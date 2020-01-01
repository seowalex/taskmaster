import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import Navbar from 'components/Navbar';

const Home: React.FunctionComponent = () => {
  const [tasks, setTasks] = useState();

  useEffect(() => {
    axios.get('/api/tasks', {
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlYTg0MzJjMS0wYzJkLTRmYzMtOTM4Yy1jMmEwMmYyZjAzYmIiLCJzdWIiOiIyIiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNTc3ODc4MDU5LCJleHAiOjE1Nzc5NjQ0NTl9.gBk2XtAiHkIrZ5uag3wKlWSGouVjK78l4pwVID1H3do'
      },
    }).then((response) => {
      setTasks(response.data.data);
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Todo Manager</title>
      </Helmet>
      <Navbar />
      <div className="container">
        <form>
          <div className="form-group">
            <input type="text" className="form-control" id="todoINput" placeholder="Add task and press Enter to save." />
          </div>
        </form>
        <ul className="list-group">
          {tasks ? tasks.map((task: any) => (
            <li className="list-group-item d-flex align-items-center" key={task.id}>
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id={`task${task.id}`} checked={task.attributes.completed} />
                <label className="custom-control-label" htmlFor={`task${task.id}`} />
              </div>
              {task.attributes.title}
              <div className="ml-auto">
                {task.attributes['tag-list'].map((tag: any) => (
                  <span className="badge badge-secondary ml-1">
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
