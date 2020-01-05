import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import axios from 'axios';
import moment from 'moment';
import useDebounce from 'utils/useDebounce';
import { AuthContext } from 'contexts/AuthContext';
import Navbar from 'components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './task.module.scss';

const Task: FunctionComponent = () => {
  const history = useHistory();
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
    }).catch((error) => {
      if (error.response.status === 404) {
        history.replace('/error');
      } else {
        toast(error.response.data.error, {
          type: 'error',
          toastId: 'taskError',
        });
      }
    });
  }, [auth]);

  useEffect(() => {
    if (task) {
      axios.patch(`/api/tasks/${id}`, {
        data: {
          id,
          type: 'tasks',
          attributes: task.attributes,
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
    }
  }, [useDebounce(task, 500)]);

  useEffect(() => {
    if (document.querySelectorAll('[data-tag=""]').length) {
      (document.querySelectorAll('[data-tag=""]')[0].firstChild as HTMLElement).focus();
    }
  }, [task]);

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ContentEditableEvent): void => {
    if (e.currentTarget.type === 'checkbox') {
      task.attributes.completed = e.currentTarget.checked;
    } else {
      task.attributes[e.currentTarget.getAttribute('id')] = e.target.value;
    }

    setTask({ ...task });
  };

  const handleDayChange = (selectedDay: Date): void => {
    task.attributes['due-date'] = selectedDay.toJSON();
    setTask({ ...task });
  };

  const handleTagKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    } else if ((e.key === 'Tab' || e.key === ' ') && e.currentTarget.textContent !== '') {
      e.preventDefault();
      task.attributes['tag-list'].push('');
      setTask({ ...task });
    }
  };

  const handleTagBlur = (e: FocusEvent<HTMLSpanElement>): void => {
    if (e.currentTarget.textContent === '') {
      task.attributes['tag-list'] = task.attributes['tag-list'].filter((tag: string) => tag !== '');
      setTask({ ...task });
    }
  };

  const handleAddTag = (e: MouseEvent): void => {
    e.preventDefault();
    task.attributes['tag-list'].push('');
    setTask({ ...task });
  };

  const handleEditTag = (e: ContentEditableEvent): void => {
    const tags = [];

    for (const tag of e.currentTarget.parentNode.parentNode.childNodes) {
      tags.push(tag.textContent.replace(/[\s|\u00a0)]+/g, ''));
    }

    task.attributes['tag-list'] = tags;
    setTask({ ...task });
  };

  const handleRemoveTag = (e: MouseEvent): void => {
    task.attributes['tag-list'] = task.attributes['tag-list'].filter((tag: string) => tag !== e.currentTarget.parentElement!.getAttribute('data-tag'));
    setTask({ ...task });
  };

  return (
    <>
      <Helmet>
        <title>{task ? `Taskmaster | ${task.attributes.title}` : 'Taskmaster'}</title>
      </Helmet>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 mb-5">
            <Navbar className={styles.taskNavbar}>
              <Link to="/">
                <FontAwesomeIcon icon="arrow-left" className={styles.back} />
              </Link>
            </Navbar>
            {task ? (
              <>
                <div className="d-flex align-items-center">
                  <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
                    <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleChange} />
                    <label className={`custom-control-label ${task.attributes.completed ? 'text-muted' : ''}`} htmlFor={task.id} />
                  </div>
                  <div className={styles.taskDueDate}>
                    <FontAwesomeIcon icon="calendar-alt" className="mr-2" />
                    <DayPickerInput value={moment(task.attributes['due-date']).calendar()} onDayChange={handleDayChange} inputProps={{ readOnly: true }} />
                  </div>
                  <div>{task.attributes.priority}</div>
                </div>
                <hr />
                <ContentEditable className={`${styles.taskTitle} ${task.attributes.completed ? 'text-muted' : ''}`} id="title" tagName="h1" html={task.attributes.title} onChange={handleChange} />
                <hr />
                <ContentEditable className={`${styles.taskDescription} ${task.attributes.completed ? 'text-muted' : ''}`} id="description" tagName="p" html={task.attributes.description} onChange={handleChange} />
                <span>
                  {task.attributes['tag-list'].map((tag: string, index: number) => (
                    <span className={`badge ${styles.taskTag} ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} data-tag={tag} key={index}>
                      <ContentEditable tagName="span" html={tag} onChange={handleEditTag} onKeyDown={handleTagKeyDown} onBlur={handleTagBlur} />
                      <FontAwesomeIcon icon="times" className={styles.removeTag} onClick={handleRemoveTag} />
                    </span>
                  ))}
                </span>
                <a href="#" className={`badge ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} onClick={handleAddTag}>
                  <FontAwesomeIcon icon="plus" />
                </a>
              </>
            ) : (
              <FontAwesomeIcon icon="circle-notch" spin />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
