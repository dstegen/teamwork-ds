/*!
 * public/scripts.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

 // Start Clock
 updateClock();
 setInterval('updateClock()', 1000 );

 // Init some scripts and settings
$(document).ready(function () {
  // Init bsCustomFileInput-script for better file-upload forms
  bsCustomFileInput.init();
  // Enable tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
  // init Tokenfield
  initTokenfield();
});

// *** Tokenfield ***//
var myTags = [
  {
    "id": "important",
    "name": "important"
  },
  {
    "id": "frontend",
    "name": "frontend"
  },
  {
    "id": "backend",
    "name": "backend"
  }
]

function initTokenfield () {
  let tfTags = new Tokenfield({
    el: document.querySelector('#tags-field'),
    items: myTags,
    delimiters: [','],
    itemName: "tagsItems",
    newItems: false
  });
  let tagsArray = [];
  $('#tags-field').val().split(',').forEach( item => {
    if (item != '') {
      tagsArray.push({ id: item, name: item });
    }
  });
  tfTags.setItems(tagsArray);
  let tfWatchers = new Tokenfield({
    el: document.querySelector('#watchers-field'),
    items: watchersArray,
    delimiters: [','],
    itemName: "watchersItems",
    newItems: false
  });
  let curWatchersArray = [];
  $('#watchers-field').val().split(',').forEach( id => {
    if (id != '') {
      curWatchersArray.push({ id: id, name: watchersArray.filter( entry => entry.id === Number(id))[0].name });
    }
  });
  tfWatchers.setItems(curWatchersArray);
}



//+++ START Chat functions +++//

// Initialize Chat functions
function initChat () {
  for (let i=0; i<$('.chat-window').length; i++) {
    $('#'+$('.chat-window')[i].id).scrollTop($('.chat-window')[i].scrollHeight);
  };
  if (!localStorage.closedChats) {
    localStorage.closedChats = '';
  }
  localStorage.closedChats.split(',').forEach(item => {
    if (item != '') {
      $('#'+item).collapse('hide');
      $('#toggle-button-'+item.split('-')[2]).text(' + ');
    }
  });
  if (newMessages > 0) {
    $('#topnavi-communication').append('<span class="badge badge-light ml-1">'+newMessages+'</span>');
  }
}

function toggleChat (id) {
  console.log(id);
  if ($('#'+id+'.collapse.show').length > 0) {
    $('#'+id).collapse('hide');
    $('#toggle-button-'+id.split('-')[2]).text(' + ');
    let closedChats = localStorage.closedChats.split(',').filter( item => item !== '');
    closedChats.push(id);
    localStorage.closedChats = closedChats;
    console.log(localStorage.closedChats);
  } else {
    $('#'+id).collapse('show');
    $('#toggle-button-'+id.split('-')[2]).text(' - ');
    let closedChats = localStorage.closedChats.split(',').filter( item => item !== '');
    closedChats.splice(closedChats.indexOf(id),1);
    localStorage.closedChats = closedChats;
    console.log(localStorage.closedChats);
  }
}

function sendComment (group) {
  var chatterId = $('#chat-window-'+group+' input[name="chatterId"]').val();
  var userchat = $('#chat-window-'+group+' input[name="userchat"]').val();
  $.ajax({
    url: '/issue/comment', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"chatterId": chatterId, "issueId": group, "userchat": userchat},
    success : function(result) {
        console.log(result);
    }
  });
  $('#chat-window-'+group+' input[name="userchat"]').val('');
}

function sendChat (group) {
  var chatterId = $('#chat-window-'+group+' input[name="chatterId"]').val();
  var userchat = $('#chat-window-'+group+' input[name="userchat"]').val();
  $.ajax({
    url: '/communication/chat', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"chatterId": chatterId, "group": group, "userchat": userchat},
    success : function(result) {
        console.log(result);
    }
  });
  $('#chat-window-'+group+' input[name="userchat"]').val('');
}

//--- END CHat functions ---//



// newPrivateMessage-Modal
function showNewPrivateMessage (myGroup, chatMate) {
  $('#new-message-'+myGroup+' form select').val(chatMate);
  $('#new-message-'+myGroup).collapse('show');
}

// E-Mail function for onclick
function sendEmail (email) {
  window.location = "mailto:"+email;
}

// Add "Are you sure?"-Alert to delete-buttons
function confirmDelete (id, action) {
  //console.log(id+':'+action);
  let confirmQuestion = 'Are you sure, you want to delete this item?';
  if (confirm(confirmQuestion)) {
    $('#'+id).attr('action', action);
    $('#'+id).submit();
  }
};

function fileDelete (formId) {
  //console.log(formId);
  let confirmQuestion = 'Are you sure, you want to delete this item?';
  if (confirm(confirmQuestion)) {
    $('#'+formId).submit();
  }
}


// Check if new password and retype match
$(document).ready(function () {
  if (window.location.pathname === '/setpassword') {
    $("#txtConfirmPassword").keyup(isPasswordMatch());
  }
});

// Edit user functions
function selectGroup (group) {
  console.log(group);
  window.location = "/admin/edituser?"+group;
}

function selectGroupSettings (group) {
  console.log(group);
  window.location = "/admin/settings?"+group;
}

function selectUser (userId) {
  window.location = "/admin/edituser/"+userId;
}

// Edit boards
function enableDisableInput (checkbox, enableElement, disableElement) {
  if(checkbox.checked == true) {
    $(enableElement).prop('disabled', false);
    if (disableElement) $(disableElement).prop('disabled', 'disabled');
  } else {
    $(enableElement).prop('disabled', 'disabled');
    if (disableElement) $(disableElement).prop('disabled', false);
  }
}

// jQuery-ui sortable
$( function() {
  $(".sortable").sortable({
    update: function( event, ui ) {}
  });
  $(".sortable").sortable( "option", "cancel", "form,a,button" );
});

$(".sortable").on("sortupdate", function(event, ui) {
  var myList = document.getElementsByClassName("board-frame");
  var ordList = myList[0].getElementsByClassName("board-topic");
  var newOrder = [];
  for (var i=0; i<ordList.length; i++) {
    newOrder.push(ordList[i].id.replace(/topic-/,''));
  }
  var curGroup = window.location.pathname.split('/')[2];
  console.log('group: '+curGroup+', New Order: '+newOrder);
  $.ajax({
    url: '/board/'+curGroup+'/reorder', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"group": curGroup, "newOrder": newOrder},
    success : function(result) {
        console.log(result);
    }
  });
  $("#feedback .modal-content").html('Re-order was saved!<br>Class: '+curGroup+' New Order: '+newOrder);
  $("#feedback").modal('show');
  setTimeout( function () {$("#feedback").modal('hide');}, 2500);
} );
