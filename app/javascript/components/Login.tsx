import React, { FunctionComponent, FormEvent, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import styles from './login.module.scss';

const Login: FunctionComponent = () => {
  // @ts-ignore
  const { dispatch } = useContext(AuthContext);
  const [authorised, setAuthorised] = useState(true);
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const history = useHistory();

  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    setData({
      ...data,
      [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    axios.post('/api/login', {
      user: {
        email: data.email,
        password: data.password,
      },
    }, {
      headers: { 'Content-Type': 'application/json' },
    }).then((response) => {
      dispatch({
        type: 'login',
        payload: {
          user: response.data.email,
          token: response.headers.authorization,
        },
      });

      history.push('/');
    }).catch(() => {
      setAuthorised(false);
    });
  };

  return (
    <>
      <Helmet>
        <title>Taskmaster | Login</title>
      </Helmet>
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
          <form className="col col-xs-12 col-sm-8 col-md-6 col-xl-4" onSubmit={handleSubmit}>
            <h1 className="display-4 text-center mb-5">Taskmaster</h1>

            <div className={`form-group ${styles.formLabelGroup}`}>
              <input type="email" id="inputEmail" className={`form-control ${authorised ? '' : 'is-invalid'}`} placeholder="Email address" name="email" value={data.email} onChange={handleChange} required autoFocus />
              <label htmlFor="inputEmail">Email address</label>
            </div>

            <div className={`form-group ${styles.formLabelGroup}`}>
              <input type="password" id="inputPassword" className={`form-control ${authorised ? '' : 'is-invalid'}`} placeholder="Password" name="password" value={data.password} onChange={handleChange} required />
              <div className="invalid-feedback">
                Invalid Email or password.
              </div>
              <label htmlFor="inputEmail">Password</label>
            </div>

            <div className="form-group custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="inputRemember" />
              <label className="custom-control-label" htmlFor="inputRemember">Remember me</label>
            </div>
            <button className="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
