/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: ['@snowpack/plugin-dotenv', '@prefresh/snowpack'],
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: 'es2019',
  },
  packageOptions: {
    sourcemap: true,
  },
  buildOptions: {
    sourcemap: true,
  },
};
