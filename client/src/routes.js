import React from 'react';
import { Route, Redirect, Switch } from 'react-router';
import SpeechToText from './components/speech-to-text';

export default (
  <Switch>
    <Route exact path='/speech-to-text' component={SpeechToText} />
    <Redirect to='/speech-to-text' />
  </Switch>
);
