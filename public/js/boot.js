require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    models: 'models',
    text: '/js/libs/text',
    templates: '../templates',
    bootstrap: '/js/libs/bootstrap.min', 


    SocialNetView: '/js/SocialNetView'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'SocialNet': ['Backbone'], 
    'bootstrap': ['jQuery']
  }
});

require(['SocialNet'], function(SocialNet) {
  SocialNet.initialize();
});
