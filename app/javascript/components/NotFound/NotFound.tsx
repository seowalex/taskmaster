import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';

const Error: FunctionComponent = () => (
  <>
    <Helmet>
      <title>404 Not Found</title>
    </Helmet>
    <div className="vw-100 vh-100 d-flex align-items-center justify-content-center">
      <div className="jumbotron bg-transparent text-center">
        <h1 className="display-4">404 Not Found</h1>
        <p className="lead">
          The page you were looking for doesn&apos;t exist.
          <br />
          You may have mistyped the address or the page may have moved.
        </p>
      </div>
    </div>
  </>
);

export default Error;
