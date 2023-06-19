// next.config.js

module.exports = {
  // Your existing configuration options...

  async rewrites() {
    return [
      {
        source: '/data.csv',
        destination: '/public/data.csv',
      },
    ];
  },
};
