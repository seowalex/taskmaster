import React, {
  useState,
  useEffect,
  useContext,
  FormEvent,
} from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ContentEditable from 'react-contenteditable';
import axios from 'axios';
import { AuthContext } from 'contexts/AuthContext';
import Navbar from 'components/Navbar';
import styles from './task.module.scss';

const Task: React.FunctionComponent = () => {
  const { id } = useParams();
  const [task, setTask] = useState();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`/api/tasks/${id}`, {
      headers: {
        Authorization: auth.token,
      },
    }).then((response) => {
      setTask(response.data.data);
    });
  }, [auth]);

  const handleChange = (e: FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;

    task.attributes.completed = target.checked;
    setTask({ ...task });

    axios.patch(`/api/tasks/${id}`, {
      data: {
        id,
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
    });
  };

  return (
    <>
      <Helmet>
        <title>{task ? `Taskmaster | ${task.attributes.title}` : 'Taskmaster'}</title>
      </Helmet>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center">
          {task ? (
            <div className="col-12 col-md-10 col-lg-8">
              <div className="d-flex align-items-center">
                <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
                  <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleChange} />
                  <label className={`custom-control-label ${task.attributes.completed ? 'text-muted' : ''}`} htmlFor={task.id} />
                </div>
                <div className="flex-grow-1 ">{task.attributes['due-date']}</div>
                <div>{task.attributes.priority}</div>
              </div>
              <hr />
              <ContentEditable className={`font-weight-light ${styles.taskTitle} ${task.attributes.completed ? 'text-muted' : ''}`} tagName="h1" html={task.attributes.title} onChange={handleChange} />
              <hr />
              <p className={`lead ${styles.taskDescription} ${task.attributes.completed ? 'text-muted' : ''}`} contentEditable>{task.attributes.description}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Task;
