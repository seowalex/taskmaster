import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  createRef,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
  FocusEvent,
  CSSProperties,
} from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import Select, { ValueType, OptionTypeBase, Theme } from 'react-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import TextareaAutosize from 'react-textarea-autosize';
import AutosizeInput from 'react-input-autosize';
import axios from 'axios';
import moment from 'moment';
import useDebounce from 'utils/useDebounce';
import { AuthContext } from 'contexts/AuthContext';
import Navbar from 'components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './task.module.scss';

interface PriorityOptions {
  value: number;
  label: string;
  color: string;
}

const Task: FunctionComponent = () => {
  const history = useHistory();
  const { id } = useParams();
  const [task, setTask] = useState();
  const [saving, setSaving] = useState(false);
  const { auth, dispatchAuth } = useContext(AuthContext);
  const dayPickerInput = createRef<DayPickerInput>();

  const priorityOptions = [
    { value: 1, label: '!!!', color: '#dc3545' },
    { value: 2, label: '!!', color: '#ffc107' },
    { value: 3, label: '!', color: '#6c757d' },
  ];
  const priorityComponents = {
    DropdownIndicator: (): null => null,
    IndicatorSeparator: (): null => null,
  };
  const priorityStyles = {
    container: (provided: CSSProperties): CSSProperties => ({
      ...provided,
      width: 44,
      fontSize: '1.2rem',
      textAlign: 'center',
      fontWeight: 'bold',
    }),
    control: (provided: CSSProperties): CSSProperties => ({
      ...provided,
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
    }),
    option: (provided: CSSProperties, state: any): CSSProperties => ({
      ...provided,
      color: state.data.color,
      cursor: 'pointer',
    }),
    valueContainer: (provided: CSSProperties): CSSProperties => ({
      ...provided,
      justifyContent: 'center',
    }),
    singleValue: (provided: CSSProperties, state: any): CSSProperties => ({
      ...provided,
      margin: 0,
      color: task.attributes.completed ? '#6c757d' : state.data.color,
      textDecoration: task.attributes.completed ? 'line-through' : '',
    }),
  };
  const priorityTheme = (theme: Theme): Theme => ({
    ...theme,
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
        'Content-Type': 'application/vnd.api+json',
        Authorization: auth.token,
      },
    }).then((response) => {
      setTask(response.data.data);
    }).catch((error) => {
      if (error.response.status === 401) {
        dispatchAuth({
          type: 'logout',
        });
      } else if (error.response.status === 404) {
        history.replace('/error');
      } else {
        toast(error.response.data.error, {
          type: 'error',
          toastId: 'readError',
        });
      }
    });
  }, [auth]);

  useEffect(() => {
    if (task) {
      axios.patch(task.links.self, {
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
      }).then(() => {
        setSaving(false);
      }).catch((error) => {
        toast(error.response.data.error, {
          type: 'error',
          toastId: 'updateError',
        });
      });
    }
  }, [useDebounce(task, 500)]);

  useEffect(() => {
    setSaving(true);

    for (let i = 0; i < document.getElementsByClassName('tag').length; i += 1) {
      if (document.getElementsByClassName('tag')[i].getElementsByTagName('input')[0].value === '') {
        document.getElementsByClassName('tag')[i].getElementsByTagName('input')[0].focus();
      }
    }
  }, [task]);

  const handleCheckAndEdit = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    if (e.currentTarget.type === 'checkbox') {
      task.attributes.completed = (e.currentTarget as HTMLInputElement).checked;
    } else if (e.currentTarget.id === 'title') {
      task.attributes.title = e.currentTarget.value.replace(/\n/g, '');
    } else {
      task.attributes.description = e.currentTarget.value;
    }

    setTask({ ...task });
  };

  const handleDayChange = (selectedDay: Date): void => {
    task.attributes['due-date'] = selectedDay;
    setTask({ ...task });
  };

  // TODO: https://github.com/gpbl/react-day-picker/issues/955
  const handleDayClear = (): void => {
    if (dayPickerInput.current) {
      dayPickerInput.current.hideDayPicker();
    }

    task.attributes['due-date'] = null;
    setTask({ ...task });
  };

  const handlePriorityChange = (e: ValueType<OptionTypeBase>): void => {
    task.attributes.priority = (e as PriorityOptions).value;
    setTask({ ...task });
  };

  const handleTagAdd = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    task.attributes['tag-list'].push('');
    setTask({ ...task });
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      e.currentTarget.blur();
    } else if ((e.key === 'Tab' || e.key === ' ') && e.currentTarget.value !== '') {
      e.preventDefault();
      task.attributes['tag-list'].push('');
      setTask({ ...task });
    }
  };

  const handleTagBlur = (e: FocusEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value === '') {
      task.attributes['tag-list'] = task.attributes['tag-list'].filter((tag: string) => tag !== '');
      setTask({ ...task });
    }
  };

  const handleTagEdit = (): void => {
    const tags = [];

    for (let i = 0; i < document.getElementsByClassName('tag').length; i += 1) {
      tags.push(document.getElementsByClassName('tag')[i].getElementsByTagName('input')[0].value.replace(/[\s|\u00a0)]+/g, ''));
    }

    task.attributes['tag-list'] = tags;
    setTask({ ...task });
  };

  const handleRemoveTag = (e: MouseEvent<Element>): void => {
    task.attributes['tag-list'] = task.attributes['tag-list'].filter((tag: string) => {
      return tag !== e.currentTarget.getAttribute('data-tag');
    });
    setTask({ ...task });
  };

  const handleDelete = (): void => {
    axios.delete(task.links.self, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: auth.token,
      },
    }).then(() => {
      history.replace('/');
    }).catch((error) => {
      toast(error.response.data.error, {
        type: 'error',
        toastId: 'deleteError',
      });
    });
  };

  return (
    <>
      <Helmet>
        <title>{task ? `Taskmaster | ${task.attributes.title}` : 'Taskmaster'}</title>
      </Helmet>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 mb-5">
            <Navbar>
              <Link to="/" className={styles.back}>
                <FontAwesomeIcon icon="arrow-left" />
              </Link>
              {saving ? (
                <div className={`${styles.saving}`}>
                  Saving
                  <FontAwesomeIcon icon="circle-notch" spin />
                </div>
              ) : ''}
            </Navbar>
            {task ? (
              <>
                <div className="d-flex align-items-center">
                  <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
                    <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleCheckAndEdit} />
                    <label className={`custom-control-label ${task.attributes.completed ? 'text-muted' : ''}`} htmlFor={task.id} />
                  </div>
                  <div className={`${styles.taskDueDate} ${task.attributes.completed ? 'text-muted' : ''}`}>
                    <FontAwesomeIcon icon="calendar-alt" className="mr-2" />
                    {task.attributes['due-date'] ? moment(task.attributes['due-date']).calendar() : 'No due date'}
                    <DayPickerInput
                      ref={dayPickerInput}
                      value={task.attributes['due-date'] ? task.attributes['due-date'] : ''}
                      onDayChange={handleDayChange}
                      inputProps={{ readOnly: true }}
                      placeholder=""
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
                <TextareaAutosize
                  id="title"
                  className={`${styles.taskTitle} ${task.attributes.completed ? 'text-muted' : ''}`}
                  placeholder="What needs doing?"
                  value={task.attributes.title}
                  onChange={handleCheckAndEdit}
                />
                <hr />
                <TextareaAutosize
                  id="description"
                  className={`${styles.taskDescription} ${task.attributes.completed ? 'text-muted' : ''} mb-2`}
                  placeholder="Description"
                  value={task.attributes.description}
                  onChange={handleCheckAndEdit}
                />
                <div className="mb-5">
                  {task.attributes['tag-list'].map((tag: string, index: number) => (
                    <span className={`badge ${styles.taskTag} ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} key={index}>
                      <AutosizeInput
                        className="tag"
                        value={tag}
                        onChange={handleTagEdit}
                        onKeyDown={handleTagKeyDown}
                        onBlur={handleTagBlur}
                      />
                      <FontAwesomeIcon icon="times" className={styles.removeTag} onClick={handleRemoveTag} data-tag={tag} />
                    </span>
                  ))}
                  <a href="#" className={`badge ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} onClick={handleTagAdd}>
                    <FontAwesomeIcon icon="plus" />
                  </a>
                </div>
                <button type="button" className="btn btn-outline-danger btn-block" onClick={handleDelete}>
                  <FontAwesomeIcon icon="trash" className="mr-1" />
                  Delete
                </button>
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
