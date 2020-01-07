import React, {
  FunctionComponent,
  FormEvent,
  useState,
  useContext,
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
  });

  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [e.currentTarget.name]: e.currentTarget.value,
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
      },
    }, {
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatchAuth({
        type: 'login',
        payload: {
          user: {
            id: response.data.id,
            email: response.data.email,
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

      if (error.response.data.errors.email) {
        for (const msg of error.response.data.errors.email) {
          errorMessage += `Email ${msg}\n`;
        }
      }

      if (error.response.data.errors.password) {
        for (const msg of error.response.data.errors.password) {
          errorMessage += `Password ${msg}\n`;
        }
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
          <form className="col-12 col-sm-8 col-md-6 col-xl-4" onSubmit={handleSubmit}>
            <h1 className="display-4 text-center mb-5">Taskmaster</h1>
            <div className={`form-group ${styles.formLabelGroup}`}>
              <input type="email" id="inputEmail" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Email address" name="email" value={data.email} onChange={handleChange} required autoFocus />
              <label htmlFor="inputEmail">Email address</label>
            </div>
            <div className={`form-group ${styles.formLabelGroup}`}>
              <input type="password" id="inputPassword" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Password" name="password" value={data.password} onChange={handleChange} required />
              <label htmlFor="inputPassword">Password</label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              {request.isLoading ? <FontAwesomeIcon icon="circle-notch" spin /> : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
