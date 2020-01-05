import React, {
  useState,
  useEffect,
  useContext,
  FormEvent,
  MouseEvent,
} from 'react';
import { ReactSortable, SortableEvent } from 'react-sortablejs';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
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

const Home: React.FunctionComponent = () => {
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
    const target = e.target as HTMLInputElement;

    setSearch(target.value);
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

  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;

    axios.patch(`/api/tasks/${target.id}`, {
      data: {
        id: target.id,
        type: 'tasks',
        attributes: {
          completed: target.checked,
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

    setSearch(`${search} #${(e.target as Element).getAttribute('data-tag') as string}`.trim());
  };

  return (
    <>
      <Helmet>
        <title>Taskmaster</title>
      </Helmet>
      <Navbar />
      <div className="container">
        <form>
          <div className="form-group">
            <input type="text" className="form-control" id="todoSearch" name="search" value={search} onChange={handleSearch} placeholder="Search for tasks." />
          </div>
          <div className="form-group">
            <input type="text" className="form-control" id="todoInput" placeholder="Add task and press Enter to save." />
          </div>
        </form>
        {tasks ? (
          <ReactSortable
            tag="ul"
            className="list-group"
            animation={150}
            list={tasks}
            setList={setTasks}
            onSort={handleSort}
          >
            {tasks.map((task: Task) => (
              <li className="list-group-item d-flex align-items-center" key={task.id}>
                <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
                  <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleChange} />
                  <label className={`custom-control-label ${task.attributes.completed ? 'text-muted' : ''}`} htmlFor={task.id}>{task.attributes.title}</label>
                </div>
                <div className="ml-auto">
                  {task.attributes['tag-list'].map((tag: string) => (
                    <a href="#" className={`badge ml-1 ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} data-tag={tag} onClick={handleTagClick} key={tag}>
                      #
                      {tag}
                    </a>
                  ))}
                </div>
              </li>
            ))}
          </ReactSortable>
        ) : (
          <li className="list-group-item d-flex align-items-center">
            Loading...
          </li>
        )}
      </div>
    </>
  );
};

export default Home;
