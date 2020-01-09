import React, {
  FunctionComponent,
  useState,
  useContext,
  FormEvent,
  ChangeEvent,
} from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './signup.module.scss';

const Signup: FunctionComponent = () => {
  const history = useHistory();
  const { dispatchAuth } = useContext(AuthContext);
  const [request, setRequest] = useState({
    isAuthorised: true,
    isLoading: false,
  });
  const [data, setData] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [e.currentTarget.id]: e.currentTarget.value,
    });

    setRequest({
      ...request,
      isAuthorised: true,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setRequest({
      ...request,
      isLoading: true,
    });

    axios.post('/api/signup', {
      user: {
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
        name: data.email.substring(0, data.email.lastIndexOf('@')),
        settings: JSON.stringify({
          hideCompleted: false,
          addToBottom: false,
          sort: 'position',
        }),
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      dispatchAuth({
        type: 'login',
        payload: {
          user: {
            id: response.data.id,
            email: response.data.email,
            name: response.data.name,
            settings: JSON.parse(response.data.settings),
          },
          token: response.headers.authorization,
        },
      });

      toast.dismiss('signupError');

      history.replace('/');
    }).catch((error) => {
      setRequest({
        isAuthorised: false,
        isLoading: false,
      });

      let errorMessage = '';

      for (const msg of error.response.data.errors.email ?? []) {
        errorMessage += `Email ${msg}\n`;
      }

      for (const msg of error.response.data.errors.password ?? []) {
        errorMessage += `Password ${msg}\n`;
      }

      for (const msg of error.response.data.errors.password_confirmation ?? []) {
        errorMessage += `Password confirmation ${msg}\n`;
      }

      toast(errorMessage, {
        type: 'error',
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>Taskmaster | Sign up</title>
      </Helmet>
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-12 col-sm-8 col-md-6 col-xl-4 mt-5 mb-5">
            <form onSubmit={handleSubmit}>
              <h1 className="display-4 text-center mb-5">Taskmaster</h1>
              <div className={`form-group ${styles.formLabelGroup}`}>
                <input type="email" id="email" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Email address" value={data.email} onChange={handleChange} required autoFocus />
                <label htmlFor="email">Email address</label>
              </div>
              <div className={`form-group ${styles.formLabelGroup}`}>
                <input type="password" id="password" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Password" value={data.password} onChange={handleChange} required />
                <label htmlFor="password">Password</label>
              </div>
              <div className={`form-group ${styles.formLabelGroup}`}>
                <input type="password" id="passwordConfirmation" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Confirm Password" value={data.passwordConfirmation} onChange={handleChange} required />
                <label htmlFor="passwordConfirmation">Confirm Password</label>
              </div>
              <button className="btn btn-lg btn-primary btn-block" type="submit">
                {request.isLoading ? <FontAwesomeIcon icon="circle-notch" spin /> : 'Sign up'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
