const less = require('@stencil/less');

exports.config = {
  namespace: 'jsonschemadesigner',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ],
  copy: [
    { src: 'assets' }
  ],
  plugins: [
    less()
  ],
  globalScript: 'src/global/index.ts'
};
