import React, { FunctionComponent, useContext, MouseEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './navbar.module.scss';

interface NavbarProps {
  className?: string;
}

const Navbar: FunctionComponent<NavbarProps> = (props) => {
  const { className, children } = props;
  const history = useHistory();
  const { auth, dispatchAuth } = useContext(AuthContext);

  const handleLogout = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    axios.delete('/api/logout', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth.token,
      },
    }).then(() => {
      dispatchAuth({
        type: 'logout',
      });

      history.push('/');
    }).catch((error) => {
      toast(error.response.data.error, {
        type: 'error',
        toastId: 'logoutError',
      });
    });
  };

  return (
    <nav className={`navbar sticky-top navbar-expand navbar-light ${styles.navbar} ${className}`}>
      { children }
      <ul className="navbar-nav ml-auto">
        <li className={`nav-item dropdown ${styles.profileDropdown}`}>
          <button type="button" className="btn btn-link nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown">
            <img src={`https://api.adorable.io/avatars/300/${auth.user ? auth.user.name : ''}@adorable.io.png`} alt="Profile" className={`${styles.profileImg} rounded-circle`} />
            <span className="d-none d-sm-inline">{auth.user ? auth.user.name : ''}</span>
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <Link to="/profile" className="dropdown-item">
              <FontAwesomeIcon icon="user" className="mr-2" />
              Profile
            </Link>
            <button type="button" className="dropdown-item">
              <FontAwesomeIcon icon="cog" className="mr-2" />
              Settings
            </button>
            <div className="dropdown-divider" />
            <button type="button" className="dropdown-item" onClick={handleLogout}>
              <FontAwesomeIcon icon="sign-out-alt" className="mr-2" />
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
