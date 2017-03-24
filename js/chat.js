
var socket= io();
function setUsername(){
  socket.emit('setUsername',document.getElementById('name').value);
  $('.writename').hide();
  $('.chat_window').show();
}
var user;
socket.on('userSet',function(data){
  user = data.username;
  document.getElementById('Txtusername').value = user;
   document.getElementById("welcomeUser").innerHTML = "Welcome, " + user ;
});

// send message

function sendMessage(){
   var msg = document.getElementById('message').value;
   if(msg){
      socket.emit('msg',{message:msg,user:user});
   }
  document.getElementsByClassName('emoji-wysiwyg-editor')[0].innerHTML = ' ';


}
function utilEscapeRegex(str) {
  return (str + '').replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
};
function utilHtmlEntities (str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};
function emojiAreaCreateIcon (group, emoji) {
  var filename = $.emojiarea.icons[group]['icons'][emoji];
  var path = $.emojiarea.path || '';
  if (path.length && path.charAt(path.length - 1) !== '/') {
    path += '/';
  }
  return '<img src="' + path + filename + '" alt="' + utilHtmlEntities(emoji) + '" >';
};

socket.on('newmsg',function(data){
  console.log('new msg');
    if(user){
      var html =data.message;
      var userdata =data.user;
      var currentUser =   document.getElementById('Txtusername').value;
      var emojis = $.emojiarea.icons;
      for (var group in emojis) {
        for (var key in emojis[group]['icons']) {
          if (emojis[group]['icons'].hasOwnProperty(key)) {
            html = html.replace(new RegExp(utilEscapeRegex(key), 'g'), emojiAreaCreateIcon(group, key));
          }
        }
      }

      // start

      var Message;
      Message = function (arg) {
          this.text = arg.text, this.message_side = arg.message_side;
          this.draw = function (_this) {
              return function () {
                  var $message;
                  $message = $($('.message_template').clone().html());
                  console.log(_this.text);
                  $message.addClass(_this.message_side).find('.text').html(_this.text);
                  $message.addClass(_this.message_side).find('.cname').html(userdata);
                  $('.messages').append($message);
                  return setTimeout(function () {
                      return $message.addClass('appeared');
                  }, 0);
              };
          }(this);
          return this;
      };

      var $messages, message;
      var getMessageText, message_side, sendMessage;
      message_side = 'right';
      $('.message_input').val('');
      $messages = $('.messages');
      if(currentUser == userdata ){
          message_side = 'right';
      }
      else{
          message_side = 'left';
      }
      //message_side = message_side === 'left' ? 'left' : 'right';
      message = new Message({
          text: html,
          message_side: message_side
      });
      message.draw();
      return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);


      ///ends
  //       document.getElementById('message-container').innerHTML += '<div><b>' + data.user + '</b>: ' + html+ '</div>'
    }
});
socket.on('broadcast',function(data){
});
