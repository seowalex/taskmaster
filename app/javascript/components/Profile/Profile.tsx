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
import styles from './profile.module.scss';

const Profile: FunctionComponent = () => {
  const history = useHistory();
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [request, setRequest] = useState({
    isAuthorised: true,
    isLoading: false,
  });
  const [data, setData] = useState({
    name: auth.user ? auth.user.name : '',
    currentPassword: '',
    password: '',
    passwordConfirmation: '',
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
        name: data.name,
        currentPassword: data.currentPassword,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      },
    }, {
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatchAuth({
        type: 'login',
        payload: {
          user: {
            email: response.data.email,
            name: response.data.name,
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

      if (error.response.data.errors.name) {
        for (const msg of error.response.data.errors.name) {
          errorMessage += `Name ${msg}\n`;
        }
      }

      if (error.response.data.errors.password) {
        for (const msg of error.response.data.errors.password) {
          errorMessage += `Password ${msg}\n`;
        }
      }

      if (error.response.data.errors.password_confirmation) {
        for (const msg of error.response.data.errors.password_confirmation) {
          errorMessage += `Password confirmation ${msg}\n`;
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
        <title>{auth.user && auth.user.name !== '' ? `Taskmaster | ${auth.user.name}` : 'Taskmaster'}</title>
      </Helmet>
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-12 mt-5 mb-5 d-flex flex-column align-items-center">
            <img src={`https://api.adorable.io/avatars/300/${auth.user ? auth.user.name : ''}@adorable.io.png`} alt="Profile" className={styles.profileImg} />
            <form className="w-100" onSubmit={handleSubmit}>
              <h1 className={styles.email}>{auth.user ? auth.user.email : ''}</h1>
              <div className={`form-group ${styles.formLabelGroup}`}>
                <input type="text" id="inputName" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Name" name="name" value={data.name} onChange={handleChange} required />
                <label htmlFor="inputName">Name</label>
              </div>
              <div className={`form-group ${styles.formLabelGroup}`}>
                <input type="password" id="inputPassword" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Password" name="password" value={data.password} onChange={handleChange} required />
                <label htmlFor="inputPassword">Password</label>
              </div>
              <div className={`form-group ${styles.formLabelGroup}`}>
                <input type="password" id="inputPasswordConfirmation" className={`form-control ${request.isAuthorised ? '' : 'is-invalid'}`} placeholder="Confirm Password" name="passwordConfirmation" value={data.passwordConfirmation} onChange={handleChange} required />
                <label htmlFor="inputPasswordConfirmation">Confirm Password</label>
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

export default Profile;
