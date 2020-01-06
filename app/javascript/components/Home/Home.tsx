import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  FormEvent,
  MouseEvent,
} from 'react';
import { Link } from 'react-router-dom';
import { ReactSortable, SortableEvent } from 'react-sortablejs';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import axios from 'axios';
import useDebounce from 'utils/useDebounce';
import { AuthContext } from 'contexts/AuthContext';
import Navbar from 'components/Navbar';
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
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState();
  const [search, setSearch] = useState('');
  const { auth, dispatchAuth } = useContext(AuthContext);

  useEffect(() => {
    const params: SearchParams = {
      sort: 'position',
    };

    if (search.length) {
      params['filter[search]'] = search;
    }

    axios.get('/api/tasks', {
      params,
      headers: {
        Authorization: auth.token,
      },
    }).then((response) => {
      setTasks(response.data.data);
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
  }, [auth, useDebounce(search, 500)]);

  const handleSearch = (e: FormEvent<HTMLInputElement>): void => {
    setSearch(e.currentTarget.value);
  };

  const handleTaskNew = (e: ContentEditableEvent): void => {
    console.log(e);
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
    }).then((response) => {
      const changedTask = tasks.find((task: Task) => task.id === response.data.data.id);

      if (changedTask) {
        changedTask.attributes.completed = response.data.data.attributes.completed;
      }

      setTasks([...tasks]);
    }).catch((error) => {
      toast(error.response.data.error, {
        type: 'error',
        toastId: 'changeError',
      });
    });
  };

  const handleTagClick = (e: MouseEvent): void => {
    e.preventDefault();

    setSearch(`${search} #${e.currentTarget.getAttribute('data-tag') as string}`.trim());
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
            <Navbar />
            {/* <form>
              <div className="form-group">
                <input type="text" className="form-control" id="todoSearch" name="search" value={search} onChange={handleSearch} placeholder="Search for tasks." />
              </div>
              <div className="form-group">
                <input type="text" className="form-control" id="todoInput" placeholder="Add task and press Enter to save." />
              </div>
            </form> */}
            <ContentEditable
              className={styles.newTask}
              tagName="h1"
              placeholder="Add task and press Enter to save."
              html={newTask}
              onChange={handleTaskNew}
            />
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
                      <div className={`${styles.taskTitle} ${task.attributes.completed ? 'text-muted' : ''}`}>
                        {task.attributes.title}
                      </div>
                      <div className={styles.taskTags}>
                        {task.attributes['tag-list'].map((tag: string) => (
                          <a href="#" className={`badge ml-1 ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} data-tag={tag} onClick={handleTagClick} key={tag}>
                            #
                            {tag}
                          </a>
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
