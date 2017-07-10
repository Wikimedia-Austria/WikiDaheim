import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';
import { outputFiles } from '../../../webpack/output-files';

const ServerHtml = ({ appHtml }) => (
  <html lang='en'>
    <head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0' />

      <title>Marvin &bull; React/Redux Boilerplate</title>

      <link rel='stylesheet' href={ `/${ outputFiles.css }` } />
    </head>
    <body>
      <div
        id='root'
        dangerouslySetInnerHTML={ { __html: appHtml } } // eslint-disable-line react/no-danger
      />
      <script type='text/javascript' src={ `/${ outputFiles.vendor }` } />
      <script type='text/javascript' src={ `/${ outputFiles.client }` } />
    </body>
  </html>
);

ServerHtml.propTypes = {
  appHtml: PropTypes.string,
};

const getServerHtml = (appHtml) => {
  return `<!doctype html>${ ReactDOMServer.renderToString(<ServerHtml appHtml={ appHtml } />) }`;
};

export default getServerHtml;
