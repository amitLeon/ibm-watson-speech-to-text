import React from 'react';
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone';
import { Jumbotron, Button, FormGroup,  Label, Input } from 'reactstrap';
import './speech-to-text.scss';

class SpeechToText extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      token: null,
      text: '',
      listening: false,
      error: null
    });
  }

  componentDidMount() {
    this.fetchToken();
  }

  handleError = (err, extra) => {
    console.error(err, extra);
    if (err.name === 'UNRECOGNIZED_FORMAT') {
      err = 'Unable to determine content type from file name or header; mp3, wav, flac, ogg, opus, and webm are supported. Please choose a different file.';
    } else if (err.name === 'NotSupportedError' && this.state.audioSource === 'mic') {
      err = 'This browser does not support microphone input.';
    } else if (err.message === '(\'UpsamplingNotAllowed\', 8000, 16000)') {
      err = 'Please select a narrowband voice model to transcribe 8KHz audio files.';
    } else if (err.message === 'Invalid constraint') {
      // iPod Touch does this on iOS 11 - there is a microphone, but Safari claims there isn't
      err = 'Unable to access microphone';
    }
    this.setState({ error: err.message || err });
  }

  stopListening = () => {
    if (this.stream) {
      this.stream.stop();
    }

    this.setState({ text: null, listening: false });
  }

  onClickListener = () => {
    if (this.state.listening) {
      this.stopListening();
      return;
    }

    this.setState({ listening: !this.state.listening });

    const stream = recognizeMicrophone({
      token: this.state.token,
      smart_formatting: true,
      format: true, // adds capitals, periods, and a few other things (client-side)
      objectMode: true,
    });

    this.stream = stream;

    stream.on('data', (data) => {
      const { results } = data;

      if (results.length) this.setState({ text: results[0].alternatives[0].transcript });
    });

    stream.on('error', (data) => this.stopListening());
  }

  fetchToken() {
    return fetch('/api/token').then((res) => {
      if (res.status !== 200) {
        throw new Error('Error retrieving auth token');
      }
      return res.text();
    }).then(token => {
      this.setState({ token })
    }).catch(this.handleError);
  }

  render() {
    return (
      <React.Fragment>
        <FormGroup>
          <Label for="speechToText">Your Text</Label>
          <Input type="textarea" name="text" id="speechToText" value={this.state.text} />
        </FormGroup>
        <Button color="primary" onClick={this.onClickListener}>
          {this.state.listening ? 'Stop' : 'Start'} Listening
        </Button>
      </React.Fragment>
    );
  }
}

export default SpeechToText;
