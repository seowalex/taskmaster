import React, {
  FunctionComponent,
  FormEvent,
  useState,
  useContext,
} from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './login.module.scss';

const Login: FunctionComponent = () => {
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };
  const { dispatchAuth } = useContext(AuthContext);
  const [request, setRequest] = useState({
    isAuthorised: true,
    isLoading: false,
  });
  const [data, setData] = useState({
    email: '',
    password: '',
    remember: true,
  });

  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [e.currentTarget.name]: e.currentTarget.type === 'checkbox' ? e.currentTarget.checked : e.currentTarget.value,
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

    axios.post('/api/login', {
      user: {
        email: data.email,
        password: data.password,
      },
    }, {
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatchAuth({
        type: data.remember ? 'login' : 'login_once',
        payload: {
          user: {
            email: response.data.email,
            name: response.data.name,
          },
          token: response.headers.authorization,
        },
      });

      toast.dismiss('loginError');

      history.replace(from);
    }).catch((error) => {
      setRequest({
        isAuthorised: false,
        isLoading: false,
      });

      toast(error.response.data.error, {
        type: 'error',
        toastId: 'loginError',
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>Taskmaster | Log in</title>
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
            <div className="form-group custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="inputRemember" name="remember" checked={data.remember} onChange={handleChange} />
              <label className="custom-control-label" htmlFor="inputRemember">Remember me</label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">
              {request.isLoading ? <FontAwesomeIcon icon="circle-notch" spin /> : 'Log in'}
            </button>
            <Link to="/signup" className="btn btn-outline-secondary btn-block btn-sm">Sign up</Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
