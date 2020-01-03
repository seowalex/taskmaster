import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './navbar.module.scss';

const Navbar: React.FunctionComponent = () => {
  const history = useHistory();
  // @ts-ignore
  const { state, dispatch } = useContext(AuthContext);

  const handleLogout = (e: any): void => {
    e.preventDefault();

    axios.delete('/api/logout', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: state.token,
      },
    }).then(() => {
      dispatch({
        type: 'logout',
      });

      history.push('/');
    });
  };

  return (
    <nav className="navbar sticky-top navbar-expand navbar-light">
      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown">
            <img src={`https://api.adorable.io/avatars/300/${state.user}@adorable.io.png`} alt="Profile" className={`${styles.profileImg} rounded-circle`} />
            {state.user}
          </a>
          <div className="dropdown-menu dropdown-menu-right">
            <a className="dropdown-item" href="#">
              <FontAwesomeIcon icon="user" />
              Profile
            </a>
            <a className="dropdown-item" href="#">
              <FontAwesomeIcon icon="cog" />
              Settings
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#" onClick={handleLogout}>
              <FontAwesomeIcon icon="sign-out-alt" />
              Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
