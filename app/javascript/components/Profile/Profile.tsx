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
    isPassword: true,
    isPasswordConfirmation: true,
    isLoading: false,
  });
  const [data, setData] = useState({
    name: auth.user?.name,
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
      isPassword: true,
      isPasswordConfirmation: true,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (data.name !== auth.user?.name || (data.password !== '' && data.password === data.passwordConfirmation)) {
      setRequest({
        ...request,
        isLoading: true,
      });

      const attributes: UserAttributes = {};

      if (data.name !== auth.user?.name) {
        attributes.name = data.name;
      }

      if (data.password !== '') {
        attributes.password = data.password;
      }

      axios.patch(`/api/users/${auth.user?.id}`, {
        data: {
          id: auth.user?.id,
          type: 'users',
          attributes,
        },
      }, {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: auth.token,
        },
      }).then((response) => {
        if (auth.user && auth.token) {
          toast('Profile successfully updated', {
            type: 'success',
          });

          setRequest({
            ...request,
            isLoading: false,
          });

          setData({
            ...data,
            password: '',
            passwordConfirmation: '',
          });

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
      }).catch((error) => {
        setRequest({
          ...request,
          isPassword: false,
          isLoading: false,
        });

        toast(error.response.data.errors.map((err: Error): string => err.detail?.charAt(0).toUpperCase() as string + err.detail?.substring(1) as string).join('\n'), {
          type: 'error',
        });
      });
    } else if (data.password !== data.passwordConfirmation) {
      toast('Password confirmation doesn\'t match password', {
        type: 'error',
      });

      setRequest({
        ...request,
        isPasswordConfirmation: false,
      });
    }
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
              <img src={`https://api.adorable.io/avatars/300/${auth.user?.name}@adorable.io.png`} alt="Profile" className={styles.profileImg} />
              <form className="w-100" onSubmit={handleSubmit}>
                <h1 className={styles.email}>{auth.user?.email}</h1>
                <div className={`form-group ${styles.formLabelGroup}`}>
                  <input type="text" id="name" className="form-control" placeholder="Name" value={data.name} onChange={handleChange} />
                  <label htmlFor="name">Name</label>
                </div>
                <div className={`form-group ${styles.formLabelGroup}`}>
                  <input type="password" id="password" className={`form-control ${request.isPassword ? '' : 'is-invalid'}`} placeholder="New Password" value={data.password} onChange={handleChange} />
                  <label htmlFor="password">New Password</label>
                </div>
                <div className={`form-group ${styles.formLabelGroup}`}>
                  <input type="password" id="passwordConfirmation" className={`form-control ${request.isPasswordConfirmation ? '' : 'is-invalid'}`} placeholder="Confirm New Password" value={data.passwordConfirmation} onChange={handleChange} />
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
