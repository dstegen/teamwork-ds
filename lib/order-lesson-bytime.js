/*!
 * lib/order-lesson-bytime.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function orderLessonByTime (lessonA, lessonB) {
  if ((lessonA.time === '' || lessonA.time === undefined) && lessonB.time > '') {
    return 1;
  } else if ((lessonB.time === '' || lessonB.time === undefined) && lessonA.time > '') {
    return -1;
  } else if (lessonA.time > lessonB.time) {
    return 1;
  } else if (lessonA.time < lessonB.time) {
    return -1;
  } else {
    return 0;
  }
}


module.exports = orderLessonByTime;
