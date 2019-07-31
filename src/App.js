import React, { Component } from 'react';
import { Router as ReactRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory as createHistory } from 'history';
import { createGlobalStyle, keyframes } from 'styled-components';

import Gateway from './Gateway';
import Home from './Home';

const browserHistory = createHistory();

const backgroundGradientKeyframe = keyframes`
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
`;
const GlobalStyle = createGlobalStyle`
body {
  background: linear-gradient(270deg, #32e9e7, #96d7ff, #f396ff);
  background-size: 600% 600%;
  animation: ${backgroundGradientKeyframe} 30s ease infinite;
}
`;

export default class App extends Component {
  render() {
    return (
      <>
        <GlobalStyle />
        <ReactRouter history={browserHistory}>
          <Switch>
            <Route exact path="/ipfs/:hash" component={Gateway} />
            <Route path="/" component={Home} />
          </Switch>
        </ReactRouter>
      </>
    );
  }
}
