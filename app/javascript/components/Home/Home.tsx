import React, {
  useEffect,
  useContext,
  useReducer,
  FormEvent,
} from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
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

type TaskAction = {
  type: 'one';
  payload: {
    id: string;
    completed: boolean;
  };
} | {
  type: 'all';
  payload: Task[];
};

const Home: React.FunctionComponent = () => {
  const [tasks, dipatchTasks] = useReducer((state: Task[], action: TaskAction) => {
    switch (action.type) {
      case 'all': {
        return action.payload;
      }

      case 'one': {
        const changedTask = state.find((task: Task) => task.id === action.payload.id);

        if (changedTask) {
          changedTask.attributes.completed = action.payload.completed;
        }

        return [...state];
      }

      default: {
        return state;
      }
    }
  }, []);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios.get('/api/tasks', {
      headers: {
        Authorization: auth.token,
      },
    }).then((response) => {
      dipatchTasks({
        type: 'all',
        payload: response.data.data,
      });
    });
  }, [auth]);

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
      dipatchTasks({
        type: 'one',
        payload: {
          id: response.data.data.id,
          completed: response.data.data.attributes.completed,
        },
      });
    });
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
            <input type="text" className="form-control" id="todoInput" placeholder="Add task and press Enter to save." />
          </div>
        </form>
        <ul className="list-group">
          {tasks.length ? tasks.map((task: Task) => (
            <li className="list-group-item d-flex align-items-center" key={task.id}>
              <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
                <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleChange} />
                <label className="custom-control-label" htmlFor={task.id}>{task.attributes.title}</label>
              </div>
              <div className="ml-auto">
                {task.attributes['tag-list'].map((tag: string) => (
                  <span className="badge badge-secondary ml-1" key={tag}>
                    #
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          )) : (
            <li className="list-group-item d-flex align-items-center">
              Loading...
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Home;
