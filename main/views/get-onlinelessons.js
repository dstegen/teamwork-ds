/*!
 * main/views/get-onlinelessons.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('../../lib/locale');
const config = require('../../main/models/model-config').getConfig();
const { thisWeek, isActualWeek, weekDayFromNumber } = require('../../lib/dateJuggler');
const { getLessons } = require('../../lesson/models/model-lessons');


function getOnlinelessons (user, weekOffset) {
  let returnHtml = '';
  let allLessons = [];
  if (user.role === 'member') {
    user.group.forEach( group => {
      allLessons = allLessons.concat(getLessons(group).filter(item => item.lessonType === 'onlinelesson' && isActualWeek(item.validFrom, item.validUntil, thisWeek()+weekOffset) && (user.courses.includes(item.lesson) || user.leader.includes(group))));
      allLessons.forEach( item => {
        if (!item.group) item.group = group;
      });
    });
  } else {
    allLessons = getLessons(user.group).filter(item => item.lessonType === 'onlinelesson' && isActualWeek(item.validFrom, item.validUntil, thisWeek()+weekOffset));
  }
  // sort lessons according to date & time
  allLessons = allLessons.sort((a,b) => reorderLessonsByDateAsc(a,b));
  [1,2,3,4,5,6].forEach( wd => {
    if (allLessons.filter(item => item.weekdays.includes(wd)).length > 0) {
      returnHtml += '<strong>' + weekDayFromNumber(thisWeek()+weekOffset, wd) + '</strong><br />'
      allLessons.filter(item => item.weekdays.includes(wd)).forEach( item => {
        returnHtml += '<div class="mb-2">'
        returnHtml += '<strong>' + item.time + ' ' + locale.lessons.oclock[config.lang] + '</strong>: ';
        if (user.role === 'member') {
          returnHtml += '<a href="/lessons/show/'+item.group+'/'+item.id+'">' + item.lesson + ': ' + item.chapter + '</a>';
          returnHtml += ' (' + item.group + ')';
        } else {
          returnHtml += item.lesson + ': ' + item.chapter;
        }
        returnHtml += '<br /></div>';
      });
    }
  });
  return returnHtml;
}


// Additional functions

function reorderLessonsByDateAsc (lessonA, lessonB) {
  if (lessonA.weekdays[0] > lessonB.weekdays[0]) {
    return 1;
  } else if (lessonA.weekdays[0] < lessonB.weekdays[0]) {
    return -1;
  } else {
    if (lessonA.time > lessonB.time) {
      return 1;
    } else if (lessonA.time < lessonB.time) {
      return -1;
    } else {
      return 0;
    }
  }
}


module.exports = getOnlinelessons;
