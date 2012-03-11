$(function() {
  var socket = io.connect('http://localhost');

  var updateMessage = function(data) {
    if($('li[data-created="'+ data.created +'"]').length < 1 &&
       data.created !== undefined) {
      var msg = $('<li data-created="'+ data.created +'"><img><p></p></li>');
      msg.find('img').attr('src', data.gravatar);
      msg.find('p').html(data.message);
      $('body ol').append(msg);
    }
  }

  $('#login').click(function() {
    navigator.id.getVerifiedEmail(function(assertion) {
      if(assertion) {
        $('form input').val(assertion);
        $('form').submit();
      }
    });
  });

  $('form').submit(function(ev) {
    ev.preventDefault();
    var self = $(this);

    $.ajax({
      type: 'POST',
      url: self.attr('action'),
      data: self.serialize(),
      success: function(data) {
        updateMessage(data);
      },
      dataType: 'json'
    });
  });

  socket.on('connect', function () {
    socket.on('message', function (data) {
      updateMessage(data);
    });
  });
});
