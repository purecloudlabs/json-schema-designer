const less = require('@stencil/less');

exports.config = {
  namespace: 'mycomponent',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: false
    }
  ],
  plugins: [
    less()
  ]
};
