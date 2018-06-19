import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import 'bootstrap/dist/css/bootstrap.min.css';

import routes from './routes';
import 'whatwg-fetch';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    {routes}
  </Router>,
  document.getElementById('root')
);
