require('../styles/main.styl');

var $ = require('jQuery');

$(document).ready(function () {
  console.log('he');
  $('.login-form').submit(function (e) {
    var $this = $(this);

    e.preventDefault();
    $this.find('.login-form-submit')
      .prop('disabled', true)
      .addClass('loading');

    $.ajax($this.attr('action'), {
        data: $this.serialize(),
        method: $this.attr('method')
      })
      .success(function (data) {
        $this.find('.login-form-output').html('<a href="' + data.url + '" class="login-form-subscribe">Subscribe</a>');
      })
      .fail(function (jqXHR) {
        if ((!jqXHR.responseJSON) || (!jqXHR.responseJSON.error)) {
          return;
        }

        $this.find('.login-form-output').html('<p class="login-form-error">' + jqXHR.responseJSON.error + '</p>');
      })
      .always(function () {
        $this.find('.login-form-submit')
          .prop('disabled', false)
          .removeClass('loading');
      });

  });
});
