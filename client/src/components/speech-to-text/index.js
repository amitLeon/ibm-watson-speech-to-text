import React from 'react';
import SpeechToTextC from './speech-to-text';
import { Jumbotron } from 'reactstrap';

const SpeechToText = () => {
  return (
    <div>
      <Jumbotron>
        <h3>Speech to Text using IBM WATSON!!! </h3>
        <SpeechToTextC />
      </Jumbotron>

    </div>
  );
};

export default SpeechToText;
