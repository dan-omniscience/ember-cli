'use strict';

const cleanBaseURL = require('clean-base-url');
let logger = require('heimdalljs-logger')('ember-cli:serve-files');

class ServeFilesAddon {
  /**
   * This addon is used to serve the app (`index.html`) and
   * assets (`*.js`, `*.css`, ...) at the `baseURL` prefix.
   *
   * @class ServeFilesAddon
   * @constructor
   */
  constructor(project) {
    this.project = project;
    this.name = 'serve-files-middleware';
  }

  serverMiddleware(options) {
    let app = options.app;
    options = options.options;

    let broccoliMiddleware = options.middleware || require('broccoli-middleware');
    let middleware = broccoliMiddleware(options.watcher, {
      liveReloadPath: '/ember-cli-live-reload.js',
      autoIndex: false, // disable directory listings
    });

    let baseURL = options.rootURL === '' ? '/' : cleanBaseURL(options.rootURL || options.baseURL);

    logger.info('serverMiddleware: baseURL: %s', baseURL);

    app.use(function ServeFiles(req, res, next) {
      let oldURL = req.url;
      let url = req.serveUrl || req.url;
      logger.info('serving: %s', url);

      let actualPrefix = req.url.slice(0, baseURL.length - 1); // Don't care
      let expectedPrefix = baseURL.slice(0, baseURL.length - 1); // about last slash

      if (actualPrefix === expectedPrefix) {
        req.url = url.slice(actualPrefix.length); // Remove baseURL prefix
        logger.info('serving: (prefix stripped) %s, was: %s', req.url, url);

        // Serve file, if no file has been found, reset url for proxy stuff
        // that comes afterwards
        middleware(req, res, err => {
          req.url = oldURL;
          if (err) {
            logger.error('err', err);
          }
          next(err);
        });
      } else {
        logger.info('prefixes didn\'t match, passing control on: (actual:%s expected:%s)', actualPrefix, expectedPrefix);
        next();
      }
    });
  }
}

module.exports = ServeFilesAddon;
