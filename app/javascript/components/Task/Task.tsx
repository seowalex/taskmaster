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
import Select from 'react-select';
import { DayModifiers } from 'react-day-picker';
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

  const priorityOptions = [
    { value: '1', label: '!!!', color: '#dc3545' },
    { value: '2', label: '!!', color: '#ffc107' },
    { value: '3', label: '!', color: '#17a2b8' },
  ];
  const priorityComponents = {
    DropdownIndicator: (): null => null,
    IndicatorSeparator: (): null => null,
  };
  const priorityStyles = {
    container: (provided: any): any => ({
      ...provided,
      width: 44,
      fontSize: '1.2rem',
      textAlign: 'center',
      fontWeight: 'bold',
    }),
    control: (provided: any): any => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
    }),
    option: (provided: any, state: any): any => ({
      ...provided,
      color: state.data.color,
      cursor: 'pointer',
    }),
    valueContainer: (provided: any): any => ({
      ...provided,
      justifyContent: 'center',
    }),
    singleValue: (provided: any, state: any): any => ({
      ...provided,
      margin: 0,
      color: task.attributes.completed ? '#6c757d' : state.data.color,
      textDecoration: task.attributes.completed ? 'line-through' : '',
    }),
  };
  const priorityTheme = (theme: any): any => ({
    ...theme,
    border: 'none',
    colors: {
      ...theme.colors,
      primary: '#dee2e6',
      primary50: '#e9ecef',
      primary25: '#f8f9fa',
    },
  });

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

  // TODO: https://github.com/gpbl/react-day-picker/issues/955
  const handleDayClear = (): void => {
    task.attributes['due-date'] = null;
    setTask({ ...task });
  };

  const handlePriorityChange = (e: any): void => {
    task.attributes.priority = e.value;
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
                  <div className={`${styles.taskDueDate} ${task.attributes.completed ? 'text-muted' : ''}`}>
                    <FontAwesomeIcon icon="calendar-alt" className="mr-2" />
                    <DayPickerInput
                      value={task.attributes['due-date'] ? moment(task.attributes['due-date']).calendar() : ''}
                      onDayChange={handleDayChange}
                      inputProps={{ readOnly: true }}
                      placeholder="No due date"
                      dayPickerProps={{
                        todayButton: 'Clear',
                        onTodayButtonClick: handleDayClear,
                      }}
                    />
                  </div>
                  <Select
                    value={priorityOptions[task.attributes.priority - 1]}
                    onChange={handlePriorityChange}
                    options={priorityOptions}
                    isSearchable={false}
                    components={priorityComponents}
                    styles={priorityStyles}
                    theme={priorityTheme}
                  />
                </div>
                <hr />
                <ContentEditable
                  className={`${styles.taskTitle} ${task.attributes.completed ? 'text-muted' : ''}`}
                  id="title"
                  tagName="h1"
                  placeholder="What needs doing?"
                  html={task.attributes.title}
                  onChange={handleChange}
                />
                <hr />
                <ContentEditable
                  className={`${styles.taskDescription} ${task.attributes.completed ? 'text-muted' : ''}`}
                  id="description"
                  tagName="p"
                  placeholder="Description"
                  html={task.attributes.description}
                  onChange={handleChange}
                />
                <span>
                  {task.attributes['tag-list'].map((tag: string, index: number) => (
                    <span className={`badge ${styles.taskTag} ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} data-tag={tag} key={index}>
                      <ContentEditable
                        tagName="span"
                        html={tag}
                        onChange={handleEditTag}
                        onKeyDown={handleTagKeyDown}
                        onBlur={handleTagBlur}
                      />
                      <FontAwesomeIcon icon="times" className={styles.removeTag} onClick={handleRemoveTag} />
                    </span>
                  ))}
                </span>
                <a href="#" className={`badge ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} onClick={handleAddTag}>
                  <FontAwesomeIcon icon="plus" />
                </a>
              </>
            ) : (
              <div className={styles.loading}>
                <FontAwesomeIcon icon="circle-notch" spin />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
