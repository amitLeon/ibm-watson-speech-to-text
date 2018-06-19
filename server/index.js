/**
 * @file Main app file.
 */

import express from 'express';
import proxy from 'http-proxy-middleware';
import bodyParser from 'body-parser';

import fallback from 'express-history-api-fallback';
const watson = require('watson-developer-cloud');

// config
import options from './config/options';

export default function (production = false) {
  const app = express();

  app.use(bodyParser.json());

  const speechToText = new watson.SpeechToTextV1({
    username: options.speech_to_text.username,
    password: options.speech_to_text.password,
  });

  const authorization = new watson.AuthorizationV1(speechToText.getCredentials());

  app.get('/api/token', (req, res, next) => {
    authorization.getToken((err, token) => {
      if (err) {
        next(err);
      } else {
        res.send(token);
      }
    });
  });

  if (!production) {
    // DEV mode: use webpack dev server with proxy to have smae session
    app.use('/', proxy({ target: options.server.webpackFrontend, changeOrigin: true }));
  } else {
    // not dev mode: use static build files
    app.use('/', express.static(options.server.build));
    // is necessary as we use html5 history
    app.use(fallback('index.html', { root: `${__dirname}/${options.server.build}` }));
  }

  const port = options.server.port;
  app.listen(port, () => console.log(`browse to localhost:${port}`));
};
