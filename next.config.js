
// const { withSentryConfig } = require('@sentry/nextjs');

// next.config.js
const withTM = require('next-transpile-modules')([
  'd3',
  'internmap',
  'robust-predicates',
  'delaunator',
  "react-leaflet",
  "@react-leaflet/core",
]);

moduleExports = withTM({
  webpack5: false, // you want to keep using Webpack 4
  async redirects() {
    return [
      {
        source: '/',
        destination: '/explore/us',
        permanent: true,
      },
    ]
  },
});


const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
// module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
module.exports = moduleExports;
