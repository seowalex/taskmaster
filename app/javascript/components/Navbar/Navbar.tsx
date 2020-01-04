import React, { useContext, MouseEvent } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './navbar.module.scss';

const Navbar: React.FunctionComponent = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(AuthContext);

  const handleLogout = (e: MouseEvent<HTMLButtonElement>): void => {
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
          <button type="button" className="btn btn-link nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown">
            <img src={`https://api.adorable.io/avatars/300/${state.user!.email}@adorable.io.png`} alt="Profile" className={`${styles.profileImg} rounded-circle`} />
            {state.user!.email}
          </button>
          <div className="dropdown-menu dropdown-menu-right">
            <button type="button" className="dropdown-item">
              <FontAwesomeIcon icon="user" />
              Profile
            </button>
            <button type="button" className="dropdown-item">
              <FontAwesomeIcon icon="cog" />
              Settings
            </button>
            <div className="dropdown-divider" />
            <button type="button" className="dropdown-item" onClick={handleLogout}>
              <FontAwesomeIcon icon="sign-out-alt" />
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
