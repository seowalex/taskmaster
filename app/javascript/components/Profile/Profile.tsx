import React, {
  FunctionComponent,
  useState,
  useContext,
  FormEvent,
  ChangeEvent,
} from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import Navbar from 'components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './profile.module.scss';

interface UserAttributes {
  name?: string;
  password?: string;
}

interface Error {
  readonly id?: string;
  readonly links?: {
    readonly about: string;
  };
  readonly status?: string;
  readonly code?: string;
  readonly title?: string;
  readonly detail?: string;
  readonly source?: {
    readonly pointer?: string;
    readonly parameter?: string;
  };
}

const Profile: FunctionComponent = () => {
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [request, setRequest] = useState({
    isCurrentPassword: true,
    isPassword: true,
    isPasswordConfirmation: true,
    isLoading: false,
  });
  const [data, setData] = useState({
    name: auth.user?.name,
    currentPassword: '',
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
      isCurrentPassword: true,
      isPassword: true,
      isPasswordConfirmation: true,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    let updateName = Promise.resolve();
    let updatePassword = Promise.resolve();

    if (data.name !== auth.user?.name) {
      setRequest({
        ...request,
        isLoading: true,
      });

      updateName = axios.patch(`/api/users/${auth.user?.id}`, {
        data: {
          id: auth.user?.id,
          type: 'users',
          attributes: {
            name: data.name,
          },
        },
      }, {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: auth.token,
        },
      }).then((response) => {
        if (auth.user && auth.token) {
          dispatchAuth({
            type: 'login',
            payload: {
              user: {
                ...auth.user,
                name: response.data.data.attributes.name,
              },
              token: auth.token,
            },
          });
        }
      });
    }

    if (data.password !== '') {
      setRequest({
        ...request,
        isLoading: true,
      });

      updatePassword = axios.patch('/api/signup', {
        user: {
          current_password: data.currentPassword,
          password: data.password,
          password_confirmation: data.passwordConfirmation,
        },
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token,
        },
      });
    }

    axios.all([
      updateName,
      updatePassword,
    ]).then(() => {
      toast('Profile successfully updated', {
        type: 'success',
      });

      setRequest({
        ...request,
        isLoading: false,
      });

      setData({
        ...data,
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
      });
    }).catch((error) => {
      setRequest({
        isCurrentPassword: !Object.prototype.hasOwnProperty.call(error.response.data.errors, 'current_password'),
        isPassword: !Object.prototype.hasOwnProperty.call(error.response.data.errors, 'password'),
        isPasswordConfirmation: !Object.prototype.hasOwnProperty.call(error.response.data.errors, 'password_confirmation'),
        isLoading: false,
      });

      let errorMessage = '';

      for (const msg of error.response.data.errors.current_password ?? []) {
        errorMessage += `Current password ${msg}\n`;
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
        <title>{auth.user?.name ? `Taskmaster | ${auth.user.name}` : 'Taskmaster'}</title>
      </Helmet>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <Navbar>
              <Link to="/" className={styles.back}>
                <FontAwesomeIcon icon="arrow-left" />
              </Link>
            </Navbar>
            <div className="mt-5 mb-5 d-flex flex-column align-items-center">
              <form className="w-100" onSubmit={handleSubmit}>
                <h1 className={styles.email}>{auth.user?.email}</h1>
                <div className={`form-group ${styles.formLabelGroup}`}>
                  <input type="text" id="name" className="form-control" placeholder="Name" value={data.name} onChange={handleChange} />
                  <label htmlFor="name">Name</label>
                </div>
                <div className={`form-group ${styles.formLabelGroup}`}>
                  <input type="password" id="currentPassword" className={`form-control ${request.isCurrentPassword ? '' : 'is-invalid'}`} placeholder="Current Password" value={data.currentPassword} onChange={handleChange} required={data.password !== ''} />
                  <label htmlFor="currentPassword">Current Password</label>
                </div>
                <div className={`form-group ${styles.formLabelGroup}`}>
                  <input type="password" id="password" className={`form-control ${request.isPassword ? '' : 'is-invalid'}`} placeholder="New Password" value={data.password} onChange={handleChange} />
                  <label htmlFor="password">New Password</label>
                </div>
                <div className={`form-group ${styles.formLabelGroup}`}>
                  <input type="password" id="passwordConfirmation" className={`form-control ${request.isPasswordConfirmation ? '' : 'is-invalid'}`} placeholder="Confirm New Password" value={data.passwordConfirmation} onChange={handleChange} required={data.password !== ''} />
                  <label htmlFor="passwordConfirmation">Confirm New Password</label>
                </div>
                <button className="btn btn-lg btn-primary btn-block" type="submit">
                  {request.isLoading ? <FontAwesomeIcon icon="circle-notch" spin /> : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
