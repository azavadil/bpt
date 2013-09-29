define(['SocialNetView', 'text!templates/register.html'], function(SocialNetView, registerTemplate) {
  var registerView = SocialNetView.extend({
    requireLogin: false,

	el: $('#content'),

    events: {
      "submit form": "register"
    },

    register: function() {
      $.post('/register', {
        username: $('input[name=username]').val(),
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
      }, function(data) {
	console.log(data);
        window.location.hash = 'login'; 
      });
      return false;
    },

    render: function() {
      this.$el.html(registerTemplate);
    }
  });

  return registerView;
});
