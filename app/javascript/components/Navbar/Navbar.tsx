import React, {
  FunctionComponent,
  useState,
  useContext,
  MouseEvent,
  ChangeEvent,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './navbar.module.scss';

interface NavbarProps {
  className?: string;
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

const Navbar: FunctionComponent<NavbarProps> = ({ className, children }) => {
  const history = useHistory();
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [settings, setSettings] = useState(auth.user?.settings ?? {
    hideCompleted: false,
    addToBottom: false,
    sort: 'position',
  });

  const handleSettings = (e: ChangeEvent<HTMLInputElement>): void => {
    setSettings({
      ...settings,
      [e.currentTarget.id]: e.currentTarget.checked,
    });
  };

  const handleSettingsSave = (): void => {
    axios.patch(`/api/users/${auth.user?.id}`, {
      data: {
        id: auth.user?.id,
        type: 'users',
        attributes: {
          settings: {
            ...settings,
            sort: auth.user?.settings.sort,
          },
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
              settings: response.data.data.attributes.settings,
            },
            token: auth.token,
          },
        });
      }
    }).catch((error) => {
      toast(error.response.data.errors.map((err: Error): string => err.detail?.charAt(0).toUpperCase() as string + err.detail?.substring(1) as string).join('\n'), {
        type: 'error',
      });
    });
  };

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
    <>
      <nav className={`navbar sticky-top navbar-expand navbar-light ${styles.navbar} ${className}`}>
        { children }
        <ul className="navbar-nav ml-auto">
          <li className={`nav-item dropdown ${styles.profileDropdown}`}>
            <button type="button" className="btn btn-link nav-link dropdown-toggle" id="navbarDropdown" data-toggle="dropdown">
              <img src={`https://api.adorable.io/avatars/300/${auth.user?.name}@adorable.io.png`} alt="Profile" className={`${styles.profileImg} rounded-circle`} />
              <span className="d-none d-sm-inline">{auth.user?.name}</span>
            </button>
            <div className="dropdown-menu dropdown-menu-right">
              <Link to="/profile" className="dropdown-item">
                <FontAwesomeIcon icon="user" className="mr-2" />
                Profile
              </Link>
              <button type="button" className="dropdown-item" data-toggle="modal" data-target="#settingsModal">
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
      <div className="modal fade" id="settingsModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <FontAwesomeIcon icon="cog" className="mr-1" />
                Settings
              </h5>
              <button type="button" className="close" data-dismiss="modal">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="custom-control custom-switch">
                  <input type="checkbox" className="custom-control-input" id="hideCompleted" checked={settings.hideCompleted} onChange={handleSettings} />
                  <label className="custom-control-label" htmlFor="hideCompleted">Hide completed tasks</label>
                </div>
                <div className="custom-control custom-switch">
                  <input type="checkbox" className="custom-control-input" id="addToBottom" checked={settings.addToBottom} onChange={handleSettings} />
                  <label className="custom-control-label" htmlFor="addToBottom">Add new tasks to the bottom</label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={handleSettingsSave}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
