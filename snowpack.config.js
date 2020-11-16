/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: ['@snowpack/plugin-dotenv', '@prefresh/snowpack'],
  install: [
    /* ... */
  ],
  installOptions: {
    sourceMaps: true,
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    sourceMaps: true,
    /* ... */
  },
  proxy: {
    /* ... */
  },

  alias: {
    /* ... */
  },
};
