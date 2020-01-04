import React, {
  useEffect,
  useContext,
  FormEvent,
} from 'react';
import { ReactSortable, SortableEvent } from 'react-sortablejs';
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
    order: number;
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
  const [tasks, setTasks] = React.useState();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios.get('/api/tasks', {
      params: {
        sort: 'order',
      },
      headers: {
        Authorization: auth.token,
      },
    }).then((response) => {
      setTasks(response.data.data);
    });
  }, [auth]);

  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    console.log({
      id: target.id,
      type: 'tasks',
      attributes: {
        completed: target.checked,
      },
    });

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
    });
  };

  const handleSort = (e: SortableEvent): void => {
    axios.patch(`/api/tasks/${e.item.getAttribute('data-id')}`, {
      data: {
        id: e.item.getAttribute('data-id'),
        type: 'tasks',
        attributes: {
          order: e.newIndex as number + 1,
        },
      },
    }, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: auth.token,
      },
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
        {tasks ? (
          <ReactSortable
            tag="ul"
            className="list-group"
            list={tasks}
            setList={setTasks}
            onSort={handleSort}
          >
            {tasks.map((task: Task) => (
              <li className="list-group-item d-flex align-items-center" key={task.id}>
                <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
                  <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleChange} />
                  <label className="custom-control-label" htmlFor={task.id}>
                    {task.attributes.order}
                    &nbsp;
                    {task.attributes.title}
                  </label>
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
