import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './navbar.module.scss';

const Navbar: React.FunctionComponent = () => (
  <nav className="navbar sticky-top navbar-expand navbar-light">
    <ul className="navbar-nav ml-auto">
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown">
          <img src="https://api.adorable.io/avatars/300/alex@adorable.io.png" alt="Profile" className={`${styles.profileImg} rounded-circle`} />
          Alex
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
          <a className="dropdown-item" href="#">
            <FontAwesomeIcon icon="sign-out-alt" />
            Logout
          </a>
        </div>
      </li>
    </ul>
  </nav>
);

export default Navbar;
