/*!
 * utils/sort-items-by-date.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function sortItemsByDate (lessonA, lessonB, prop='updateDate') {
  if ((lessonA[prop] === '' || lessonA[prop] === undefined) && lessonB[prop] > '') {
    return 1;
  } else if ((lessonB[prop] === '' || lessonB[prop] === undefined) && lessonA[prop] > '') {
    return -1;
  } else if (lessonA[prop] > lessonB[prop]) {
    return 1;
  } else if (lessonA[prop] < lessonB[prop]) {
    return -1;
  } else {
    return 0;
  }
}


module.exports = sortItemsByDate;
