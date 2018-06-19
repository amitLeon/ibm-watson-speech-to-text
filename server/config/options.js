/**
 * @file Configuration & Options based on environment
 */

const env = process.env.NODE_ENV || 'prod';

/**
 * Options per environment, overwrites common settings
 */
const settings = ({
  dev: {
    server: {
      port: 8080,
      webpackFrontend: 'http://localhost:8081'
    },
    speech_to_text: {
      username: "<YOUR_SPEECH_TO_TEXT_USERNAME>",
      password: "<YOUR_SPEECH_TO_TEXT_PASSWORD>"
    }
  },
  // Production
  prod: {
    server: {
      port: 3000,
      build: './build'
    },
    speech_to_text: {
      username: "<YOUR_SPEECH_TO_TEXT_USERNAME>",
      password: "<YOUR_SPEECH_TO_TEXT_PASSWORD>"
    }
  }
})[env];

module.exports = settings;
