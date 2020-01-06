import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  FormEvent,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
} from 'react';
import { Link } from 'react-router-dom';
import { ReactSortable, SortableEvent } from 'react-sortablejs';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';
import useDebounce from 'utils/useDebounce';
import { AuthContext } from 'contexts/AuthContext';
import Navbar from 'components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './home.module.scss';

interface Task {
  readonly id: string;
  readonly type: string;
  readonly links: {
    readonly self: string;
  };
  attributes: {
    title: string;
    description: string;
    completed: boolean;
    priority: number;
    position: number;
    'due-date': string;
    'tag-list': string[];
  };
}

interface SearchParams {
  sort: string;
  'filter[search]'?: string;
}

const Home: FunctionComponent = () => {
  const [title, setTitle] = useState('');
  const [tasks, setTasks] = useState();
  const [search, setSearch] = useState({
    query: '',
    isSearching: false,
  });
  const { auth, dispatchAuth } = useContext(AuthContext);

  useEffect(() => {
    const params: SearchParams = {
      sort: 'position',
    };

    if (search.query.length) {
      params['filter[search]'] = search.query;
    }

    axios.get('/api/tasks', {
      params,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: auth.token,
      },
    }).then((response) => {
      setTasks(response.data.data);
      setSearch({
        ...search,
        isSearching: false,
      });
    }).catch((error) => {
      if (error.response.status === 401) {
        dispatchAuth({
          type: 'logout',
        });
      } else {
        toast(error.response.data.error, {
          type: 'error',
          toastId: 'loginError',
        });
      }
    });
  }, [auth, useDebounce(search.query, 500)]);

  const handleSearch = (e: FormEvent<HTMLInputElement>): void => {
    setSearch({
      query: e.currentTarget.value,
      isSearching: true,
    });
  };

  const handleSearchClear = (): void => {
    setSearch({
      query: '',
      isSearching: true,
    });
  };

  const handleTaskEdit = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.currentTarget.value);
  };

  const handleTaskAdd = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && e.currentTarget.value !== '') {
      e.preventDefault();
      axios.post('/api/tasks', {
        data: {
          type: 'tasks',
          attributes: {
            title: e.currentTarget.value,
          },
        },
      }, {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: auth.token,
        },
      }).then((response) => {
        setTitle('');
        setTasks([
          ...tasks,
          response.data.data,
        ]);
      }).catch((error) => {
        toast(error.response.data.error, {
          type: 'error',
          toastId: 'addError',
        });
      });
    }
  };

  const handleSort = (e: SortableEvent): void => {
    axios.patch(`/api/tasks/${e.item.getAttribute('data-id')}`, {
      data: {
        id: e.item.getAttribute('data-id'),
        type: 'tasks',
        attributes: {
          position: e.newIndex as number + 1,
        },
      },
    }, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: auth.token,
      },
    }).catch((error) => {
      toast(error.response.data.error, {
        type: 'error',
        toastId: 'sortError',
      });
    });
  };

  const handleCheck = (e: FormEvent<HTMLInputElement>): void => {
    const changedTask = tasks.find((task: Task) => task.id === e.currentTarget.id);

    if (changedTask) {
      changedTask.attributes.completed = e.currentTarget.checked;
    }

    setTasks([...tasks]);

    axios.patch(`/api/tasks/${e.currentTarget.id}`, {
      data: {
        id: e.currentTarget.id,
        type: 'tasks',
        attributes: {
          completed: e.currentTarget.checked,
        },
      },
    }, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: auth.token,
      },
    }).catch((error) => {
      toast(error.response.data.error, {
        type: 'error',
        toastId: 'changeError',
      });
    });
  };

  const handleTagClick = (e: MouseEvent): void => {
    e.preventDefault();

    setSearch({
      query: `${search.query} #${e.currentTarget.getAttribute('data-tag') as string}`.trim(),
      isSearching: true,
    });
  };

  // TODO: https://github.com/SortableJS/react-sortablejs/pull/119

  return (
    <>
      <Helmet>
        <title>Taskmaster</title>
      </Helmet>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 mb-5">
            <Navbar>
              <input type="text" className={`form-control ${styles.search}`} placeholder="Search for tasks" value={search.query} onChange={handleSearch} />
              {
                search.isSearching
                  ? <FontAwesomeIcon icon="circle-notch" spin className={styles.searchIcon} />
                  : search.query === ''
                    ? <FontAwesomeIcon icon="search" className={styles.searchIcon} />
                    : <FontAwesomeIcon icon="times" className={`${styles.searchIcon} ${styles.searchClearIcon}`} onClick={handleSearchClear} />
              }
            </Navbar>
            <input type="text" className={styles.newTask} placeholder="Add task and press Enter to save" value={title} onChange={handleTaskEdit} onKeyDown={handleTaskAdd} />
            {tasks ? (
              <ReactSortable
                tag="ul"
                className={`list-group ${styles.tasks}`}
                animation={150}
                list={tasks}
                setList={setTasks}
                onSort={handleSort}
              >
                {tasks.map((task: Task) => (
                  <li className="list-group-item d-flex align-items-center" key={task.id}>
                    <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
                      <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleCheck} />
                      <label className={`custom-control-label priority-${task.attributes.priority}`} htmlFor={task.id} />
                    </div>
                    <Link to={`/tasks/${task.id}`} className={styles.taskContainer}>
                      <div className={`${styles.taskTitle} ${task.attributes.completed ? 'text-muted' : ''}`}>{task.attributes.title}</div>
                      <div className={styles.taskTags}>
                        {task.attributes['tag-list'].map((tag: string) => (
                          <span className={`badge ml-1 ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} data-tag={tag} onClick={handleTagClick} key={tag}>
                            #
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </li>
                ))}
              </ReactSortable>
            ) : (
              <li className="list-group-item d-flex align-items-center">
                Loading...
              </li>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
