import React, {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  createRef,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
  CSSProperties,
} from 'react';
import { Link } from 'react-router-dom';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  SortEnd,
} from 'react-sortable-hoc';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import Select, { ValueType, OptionTypeBase, Theme } from 'react-select';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import axios from 'axios';
import arrayMove from 'array-move';
import moment from 'moment';
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
  'filter[completed]'?: boolean;
  'filter[search]'?: string;
}

interface SortOptions {
  value: string;
  label: string;
}

interface PriorityOptions {
  value: number;
  label: string;
  color: string;
}

interface TaskAttributes {
  title: string;
  priority: number;
  'due-date': string;
  position?: number;
}

const Home: FunctionComponent = () => {
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 3,
    dueDate: '',
  });
  const [tasks, setTasks] = useState();
  const [search, setSearch] = useState({
    query: '',
    isSearching: false,
  });
  const { auth, dispatchAuth } = useContext(AuthContext);
  const [sort, setSort] = useState(auth.user ? auth.user.settings.sort : 'position');
  const newTaskTitle = createRef<HTMLInputElement>();
  const dayPickerInput = createRef<DayPickerInput>();

  const sortOptions = [
    { value: 'title', label: 'By title' },
    { value: 'priority', label: 'By priority' },
    { value: 'due-date', label: 'By due date' },
    { value: 'position', label: 'By custom' },
  ];

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
      color: state.data.color,
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
    const params: SearchParams = {
      sort,
    };

    if (auth.user?.settings.hideCompleted) {
      params['filter[completed]'] = false;
    }

    if (search.query.length) {
      params['filter[search]'] = search.query;
    }

    const { CancelToken } = axios;
    const source = CancelToken.source();

    axios.get('/api/tasks', {
      params,
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: auth.token,
      },
      cancelToken: source.token,
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
          toastId: 'readError',
        });
      }
    });

    return (): void => source.cancel();
  }, [auth.token, auth.user?.settings, useDebounce(search.query, 500)]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
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

  const handleSortOrder = (e: ValueType<OptionTypeBase>): void => {
    setSort((e as SortOptions).value);

    axios.patch(`/api/users/${auth.user?.id}`, {
      data: {
        id: auth.user?.id,
        type: 'users',
        attributes: {
          settings: {
            ...auth.user?.settings,
            sort: (e as SortOptions).value,
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
      toast(error.response.data.error, {
        type: 'error',
        toastId: 'sortError',
      });
    });
  };

  const handleTaskTitle = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewTask({
      ...newTask,
      title: e.currentTarget.value,
    });
  };

  const handlePriorityChange = (e: ValueType<OptionTypeBase>): void => {
    setNewTask({
      ...newTask,
      priority: (e as PriorityOptions).value,
    });

    if (newTaskTitle.current) {
      newTaskTitle.current.focus();
    }
  };

  const handleDayChange = (selectedDay: Date): void => {
    setNewTask({
      ...newTask,
      dueDate: selectedDay.toJSON(),
    });

    if (newTaskTitle.current) {
      newTaskTitle.current.focus();
    }
  };

  const handleDayClear = (): void => {
    if (dayPickerInput.current) {
      dayPickerInput.current.hideDayPicker();
    }

    setNewTask({
      ...newTask,
      dueDate: '',
    });

    if (newTaskTitle.current) {
      newTaskTitle.current.focus();
    }
  };

  const handleTaskAdd = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && e.currentTarget.value !== '') {
      const attributes: TaskAttributes = {
        title: newTask.title,
        priority: newTask.priority,
        'due-date': newTask.dueDate,
      };

      if (auth.user?.settings.addToBottom) {
        attributes.position = tasks.findIndex((task: Task) => task.attributes.completed) < 0
          ? tasks.length
          : tasks.findIndex((task: Task) => task.attributes.completed);
      } else {
        attributes.position = 0;
      }

      axios.post('/api/tasks', {
        data: {
          type: 'tasks',
          attributes,
        },
      }, {
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Authorization: auth.token,
        },
      }).then((response) => {
        setNewTask({
          title: '',
          priority: 3,
          dueDate: '',
        });

        let index = response.data.data.attributes.position;

        if (sort === 'title') {
          index = tasks
            .filter((task: Task) => task.attributes.completed === false)
            .findIndex(
              (task: Task) => response.data.data.attributes.title < task.attributes.title,
            ) === -1
            ? tasks.findIndex((task: Task) => task.attributes.completed === true)
            : tasks.findIndex(
              (task: Task) => response.data.data.attributes.title < task.attributes.title,
            );
        } else if (sort === 'priority') {
          index = tasks
            .filter((task: Task) => task.attributes.completed === false)
            .findIndex(
              (task: Task) => response.data.data.attributes.priority < task.attributes.priority,
            ) === -1
            ? tasks.findIndex((task: Task) => task.attributes.completed === true)
            : tasks.findIndex(
              (task: Task) => response.data.data.attributes.priority < task.attributes.priority,
            );
        } else if (sort === 'due-date') {
          index = tasks
            .filter((task: Task) => task.attributes.completed === false)
            .findIndex(
              (task: Task) => (task.attributes['due-date']
                ? response.data.data.attributes['due-date'] < task.attributes['due-date']
                : true),
            ) === -1
            ? tasks.findIndex((task: Task) => task.attributes.completed === true)
            : tasks.findIndex(
              (task: Task) => (task.attributes['due-date']
                ? response.data.data.attributes['due-date'] < task.attributes['due-date']
                : true),
            );
        }

        tasks.splice(index, 0, response.data.data);
        setTasks([...tasks]);
      }).catch((error) => {
        toast(error.response.data.error, {
          type: 'error',
          toastId: 'addError',
        });
      });
    }
  };

  const handleCheck = (e: ChangeEvent<HTMLInputElement>): void => {
    const newPosition = tasks.findIndex((task: Task) => task.attributes.completed) < 0
      ? tasks.length - 1
      : tasks.findIndex((task: Task) => task.attributes.completed) - +e.currentTarget.checked;
    const changedTaskIndex = tasks.findIndex((task: Task) => task.id === e.currentTarget.id);
    const changedTask = tasks[changedTaskIndex];

    changedTask.attributes.completed = e.currentTarget.checked;

    if (auth.user && auth.user.settings.hideCompleted) {
      setTasks(tasks.filter((task: Task) => task.id !== e.currentTarget.id));
    } else {
      setTasks(arrayMove(tasks, changedTaskIndex, newPosition));
    }

    axios.patch(`/api/tasks/${e.currentTarget.id}`, {
      data: {
        id: e.currentTarget.id,
        type: 'tasks',
        attributes: {
          completed: e.currentTarget.checked,
          position: newPosition,
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
        toastId: 'editError',
      });
    });
  };

  const handleTagClick = (e: MouseEvent<HTMLSpanElement>): void => {
    e.preventDefault();

    setSearch({
      query: `${search.query} #${e.currentTarget.getAttribute('data-tag') as string}`.trim(),
      isSearching: true,
    });
  };

  const handleSortEnd = (e: SortEnd): void => {
    const sortedTasks: Task[] = arrayMove(tasks, e.oldIndex, e.newIndex);
    setTasks(sortedTasks);

    axios.patch(`/api/tasks/${sortedTasks[e.newIndex].id}`, {
      data: {
        id: sortedTasks[e.newIndex].id,
        type: 'tasks',
        attributes: {
          position: e.newIndex,
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

  const DragHandle = SortableHandle(() => (
    <div className={`${styles.taskDragHandle} ${sort !== 'position' ? 'invisible' : ''}`}>
      <FontAwesomeIcon icon="grip-lines" />
    </div>
  ));

  const SortableItem = SortableElement(({ task }: { task: Task }) => (
    <li className="list-group-item d-flex align-items-center">
      <DragHandle />
      <div className={`custom-control custom-checkbox ${styles.taskCheckbox}`}>
        <input type="checkbox" className="custom-control-input" id={task.id} name={task.id} checked={task.attributes.completed} onChange={handleCheck} />
        <label className={`custom-control-label priority-${task.attributes.priority}`} htmlFor={task.id} />
      </div>
      <Link to={`/tasks/${task.id}`} className={styles.taskContainer}>
        <div className={`${styles.taskTitle} ${task.attributes.completed ? 'text-muted' : ''}`}>{task.attributes.title}</div>
        <div className={styles.taskTags}>
          {task.attributes['tag-list'].map((tag: string) => (
            <span className={`badge ml-1 ${task.attributes.completed ? 'badge-secondary' : 'badge-dark'}`} data-tag={tag} onClick={handleTagClick} key={tag}>{tag}</span>
          ))}
        </div>
        {task.attributes['due-date'] ? (
          <div className={styles.taskDueDate}>
            {
              moment(task.attributes['due-date']).year() === moment().year()
                ? moment(task.attributes['due-date']).format('MMM D')
                : moment(task.attributes['due-date']).format('MMM D, YYYY')
            }
          </div>
        ) : ('')}
      </Link>
    </li>
  ));

  const SortableList = SortableContainer(() => (
    <ul className={`list-group ${styles.tasks}`}>
      {tasks.map((task: Task, index: number) => (
        <SortableItem task={task} key={`task-${task.id}`} index={index} collection={task.attributes.completed.toString()} disabled={sort !== 'position'} />
      ))}
    </ul>
  ));

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
            <Select
              value={sortOptions.find((e: SortOptions): boolean => e.value === sort)}
              onChange={handleSortOrder}
              options={sortOptions}
              isSearchable={false}
              className={styles.sort}
            />
            <div className={styles.newTask}>
              <input type="text" className={styles.newTaskTitle} ref={newTaskTitle} placeholder="Add task and press Enter to save" value={newTask.title} onChange={handleTaskTitle} onKeyDown={handleTaskAdd} />
              <div className={styles.newTaskDueDate}>
                <FontAwesomeIcon icon="calendar-alt" className={newTask.dueDate.length ? '' : 'text-muted'} />
                <DayPickerInput
                  ref={dayPickerInput}
                  value={newTask.dueDate}
                  onDayChange={handleDayChange}
                  inputProps={{ readOnly: true }}
                  placeholder=""
                  dayPickerProps={{
                    todayButton: 'Clear',
                    onTodayButtonClick: handleDayClear,
                  }}
                />
              </div>
              <div className={styles.newTaskPriority}>
                <Select
                  value={priorityOptions[newTask.priority - 1]}
                  onChange={handlePriorityChange}
                  options={priorityOptions}
                  isSearchable={false}
                  components={priorityComponents}
                  styles={priorityStyles}
                  theme={priorityTheme}
                />
              </div>
            </div>
            {tasks ? tasks.length ? (
              <SortableList
                onSortEnd={handleSortEnd}
                lockAxis="y"
                helperClass={styles.draggedTask}
                useDragHandle
              />
            ) : (
              <div className={styles.noTasks}>
                <FontAwesomeIcon icon="tasks" />
                <div>No tasks here. Add some tasks to get started!</div>
              </div>
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

export default Home;
