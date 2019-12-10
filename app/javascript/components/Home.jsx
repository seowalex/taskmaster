import React from 'react';
import { Helmet } from 'react-helmet';

const Home = () => (
  <>
    <Helmet>
      <title>Todo Manager</title>
    </Helmet>
    <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
      <div className="jumbotron jumbotron-fluid bg-transparent">
        <div className="container secondary-color">
          <h1 className="display-4">Home</h1>
          <p className="lead">
            A curated list of recipes for the best homemade meal and delicacies.
          </p>
        </div>
      </div>
    </div>
  </>
);

export default Home;
