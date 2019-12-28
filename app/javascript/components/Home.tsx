import * as React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from 'components/Navbar';

const Home: React.FunctionComponent = () => (
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
        <li className="list-group-item d-flex align-items-center">
          <div className="custom-control custom-checkbox">
            <input type="checkbox" className="custom-control-input" id="customCheck1" />
            <label className="custom-control-label" htmlFor="customCheck1" />
          </div>
          Cras justo odio
          <span className="badge badge-secondary ml-auto">#work</span>
        </li>
        <li className="list-group-item">Dapibus ac facilisis in</li>
        <li className="list-group-item">Morbi leo risus</li>
        <li className="list-group-item">Porta ac consectetur ac</li>
        <li className="list-group-item">Vestibulum at eros</li>
        <li className="list-group-item">Cras justo odio</li>
        <li className="list-group-item">Dapibus ac facilisis in</li>
        <li className="list-group-item">Morbi leo risus</li>
        <li className="list-group-item">Porta ac consectetur ac</li>
        <li className="list-group-item">Vestibulum at eros</li>
        <li className="list-group-item">Cras justo odio</li>
        <li className="list-group-item">Dapibus ac facilisis in</li>
        <li className="list-group-item">Morbi leo risus</li>
        <li className="list-group-item">Porta ac consectetur ac</li>
        <li className="list-group-item">Vestibulum at eros</li>
      </ul>
    </div>
  </>
);

export default Home;
