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
  // Chat & chat-windows
  initChat();
  // Add/Update lesson
  if (document.location.toString().includes('lessons/add')) {
    changeAddLessonsFormView('homelesson');
    calcValidFrom(moment().isoWeek());
  }
  if (document.location.toString().includes('lessons/show')) {
    if ($('form [name=lessonType]')[1].checked === true) {
      changeAddLessonsFormView('onlinelesson');
    } else {
      changeAddLessonsFormView('homelesson');
    }
  }
  // blackboard
  if (document.location.toString().includes('classroom')) {
    let done = false;
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      //e.target // newly activated tab
      //e.relatedTarget // previous active tab
      if (done === false) resizeBlackboard();
      done = true;
    })
    initBlackboard();
  }
  // Open targetted lessonBig
  if (document.location.pathname.includes('day') && document.location.pathname.split('/')[4] !== undefined) {
    $('#lessonbig-details-'+document.location.pathname.split('/').pop()).collapse('toggle');
  }
});


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

function sendChat (group) {
  var chatterId = $('#chat-window-'+group+' input[name="chatterId"]').val();
  var userchat = $('#chat-window-'+group+' input[name="userchat"]').val();
  $('#chat-window-'+group+' input[name="userchat"]').val('');
  $.ajax({
    url: '/communication/chat', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"chatterId": chatterId, "group": group, "userchat": userchat},
    success : function(result) {
        console.log(result);
    }
  });
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


//--- Lessons scripts ---//

// Filter lessons on all-lessons-view
function filterLessons (lesson) {
  let allLessonsList = document.getElementsByClassName('lesson-box');
  if (lesson !== 'Filter...') {
    for (let i=0; i<allLessonsList.length; i++) {
      allLessonsList[i].hidden = true;
    }
  } else {
    for (let i=0; i<allLessonsList.length; i++) {
      allLessonsList[i].hidden = false;
    }
  }
  let allShowLessons = document.getElementsByClassName('details-box-'+lesson);
  for (let i=0; i<allShowLessons.length; i++) {
    allShowLessons[i].hidden = false;
  }
}

// Lessons view
function changeAddLessonsFormView (view) {
  if (view === 'homelesson') {
    ['time'].forEach( item => {
      $('.form-'+item).hide();
    });
    ['returnHomework','amount'].forEach( item => {
      $('.form-'+item).show();
    });
    for (var i=0; i<6; i++) {
      $('form [name=weekdays]')[i].type = 'checkbox';
    }
  } else if (view === 'onlinelesson') {
    ['returnHomework','amount'].forEach( item => {
      $('.form-'+item).hide();
    });
    ['time'].forEach( item => {
      $('.form-'+item).show();
    });
    for (var i=0; i<6; i++) {
      $('form [name=weekdays]')[i].type = 'radio';
    }
    $('#time-field').attr('required', 'required');
  }
}

function calcValidFrom (startWeek) {
  let endWeek = startWeek;
  $('#validFrom-field').val(moment().day(1).isoWeek(startWeek).format('YYYY-MM-DD'));
  if ($('form [name=weekAmount]')[0].checked === false){
    if ($('form [name=weekAmount]')[1].checked === true) endWeek = Number(startWeek) + 1;
    if ($('form [name=weekAmount]')[2].checked === true) endWeek = Number(startWeek) + 2;
    if ($('form [name=weekAmount]')[3].checked === true) endWeek = Number(startWeek) + 3;
   }
  $('#validUntil-field').val(moment().day(7).isoWeek(endWeek).format('YYYY-MM-DD'));
}

function calcValidUntil (weekAmount) {
  let endWeek = Number($('#startWeek-field').val()) + Number(weekAmount) - 1;
  $('#validUntil-field').val(moment().day(7).isoWeek(endWeek).format('YYYY-MM-DD'));
}

function checkAvailability (myTime) {
  let myDay = '';
  for (var i=0; i<6; i++) {
    if ($('form [name=weekdays]')[i].checked === true) myDay = i+1;
  }
  let myDate = moment($('#validFrom-field').val()).isoWeekday(myDay).format('YYYY-MM-DD');
  //console.log(myDate);
  //console.log(myTime);
  if (onlinelessonsCalendar.filter(item => item.date == myDate && item.time == myTime).length > 0) {
    console.log('Sorry, timeslot taken!');
    alert('Sorry, timeslot taken!\nPls choose another time and/or date!');
    $('form [type=submit]').attr('disabled', 'disabled');
  } else {
    console.log('OK');
    $('form [type=submit]').removeAttr('disabled');
  }
}

//--- END Lessons scripts ---//


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



//+++ Blackboard functions +++///

function requestClassroomAccess () {
  window.location.replace('/classroom/requestaccess');
}

let myCanvas = '';
let context = '';

function resizeBlackboard () {
  var heightRatio = 9/16;
  $('#studentChalkboard').height($('#studentChalkboard').width() * heightRatio);
  //myCanvas = document.getElementById('myBlackboard');
  myCanvas.width = $('#chalkboard').width();
  myCanvas.style.width = myCanvas.width+'px';
  myCanvas.height = myCanvas.width * heightRatio;
  myCanvas.style.height = myCanvas.width * heightRatio+'px';
  //context = myCanvas.getContext('2d');
  //context.strokeStyle = 'white';
}

function initBlackboard () {
  // When true, moving the mouse draws on the canvas
  let isDrawing = false;
  let x = 0;
  let y = 0;
  try {
    var heightRatio = 9/16;
    $('#studentChalkboard').height($('#studentChalkboard').width() * heightRatio);
    myCanvas = document.getElementById('myBlackboard');
    myCanvas.width = $('#chalkboard').width();
    myCanvas.style.width = myCanvas.width+'px';
    myCanvas.height = myCanvas.width * heightRatio;
    myCanvas.style.height = myCanvas.width * heightRatio+'px';
    context = myCanvas.getContext('2d');
    chalkboardChangeColor('white');
    /*
    var background = new Image();
    var group = document.getElementById('myBlackboard').className;
    $.ajax({
      url:'/data/classes/'+group+'/onlinelesson.png',
      type:'HEAD',
      error: function () {
          background.src = "/public/blackboard.jpg";
      },
      success: function () {
          background.src = "/data/classes/"+group+"/onlinelesson.png";
      }
    });
    background.onload = function () {
      context.drawImage(background,0,0);
    }
    */
    var timeoutHandle = '';

    // event.offsetX, event.offsetY gives the (x,y) offset from the edge of the canvas.

    // Add the event listeners for mousedown, mousemove, and mouseup
    myCanvas.addEventListener('mousedown', e => {
      window.clearTimeout(timeoutHandle);
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
    });

    myCanvas.addEventListener('touchstart', e => {
      window.clearTimeout(timeoutHandle);
      x = e.offsetX;
      y = e.offsetY;
      isDrawing = true;
    });

    myCanvas.addEventListener('mousemove', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
    });

    myCanvas.addEventListener('touchmove', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
      }
    });

    window.addEventListener('mouseup', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
        // start timer, after 10sec transmit as long as isDrawing === false, reset on isDrawing === true
        timeoutHandle = window.setTimeout(function() {
          transmitBlackboard(myCanvas, context);
        }, 5000);
      }
    });

    window.addEventListener('touchend', e => {
      if (isDrawing === true) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
        // start timer, after 10sec transmit as long as isDrawing === false, reset on isDrawing === true
        timeoutHandle = window.setTimeout(function() {
          transmitBlackboard(myCanvas, context);
        }, 5000);
      }
    });

  } catch (e) {
    //console.log(e);
  }
}

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  //context.strokeStyle = 'white';
  context.lineWidth = 3;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function chalkboardChangeColor (myColor) {
  context.strokeStyle = myColor;
}

function transmitBlackboard (myCanvas, context) {
  var curContent = context.getImageData(0,0,1110,625);
  var chalkboardImg = myCanvas.toDataURL("image/png");
  var curGroup = window.location.pathname.split('/')[2];
  $.ajax({
    url: '/classroom/'+curGroup+'/updatechalkboard/', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"group": curGroup, "data": chalkboardImg},
    success : function(result) {
        console.log(result);
    }
  });
}

function cleanChalkboard (group) {
  $.ajax({
    url: '/classroom/'+group+'/cleanchalkboard', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"group": group, "action": 'cleanchalkboard'}
  });
  initBlackboard();
}

//--- ENDE Blackboard functions ---///


function signalTeacher (group, userId) {
  $.ajax({
    url: '/classroom/signal', // url where to submit the request
    type : "POST", // type of action POST || GET
    dataType : 'json', // data type
    data : {"group": group, "userId": userId},
    success : function(result) {
        console.log(result);
    }
  });
}

function signal (id) {
  $('#'+id+' svg').addClass('d-block');
  $('#'+id+' div').addClass('pl-3');
  $('#'+id+' small').addClass('font-weight-bold')
}

function closeClassroom (group) {
  //window.location.replace('/classroom/'+group+'/endlesson');
  try {
    const pList = api.getParticipantsInfo();
    for (var i=0; i<pList.length; i++) {
      api.executeCommand('kickParticipant', pList[i].participantId);
    }
    api.executeCommand('hangup');
    //api.dispose();
  } catch (e) {
    //console.log(e);
  } finally {
    window.location.replace('/classroom/'+group+'/endlesson');
  }
}

function exitClassroom () {
  try {
    api.executeCommand('hangup');
  } catch (e) {
    //console.log(e);
  } finally {
    window.location.replace('/classroom/exitaccess');
  }
}
