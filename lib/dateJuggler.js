/*!
 * lib/dateJuggler.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required Modules
const moment = require('moment');
//const config = require('../main/models/model-config').getConfig();
//if (config && config.lang) moment.locale(config.lang);
moment.updateLocale('en', {
  longDateFormat : {
        LT : 'HH:mm',
        LTS : 'HH:mm:ss',
        L : 'DD/MM/YYYY',
        LL : 'D MMMM YYYY',
        LLL : 'D MMMM YYYY HH:mm',
        LLLL : 'dddd D MMMM YYYY HH:mm'
    }
});

function thisWeek (inDate) {
  let week = moment().isoWeek();
  if (moment(inDate).isValid()) {
    week = moment(inDate).isoWeek();
  }
  return week; //Number
}

function thisDay (inDate) {
  let day = moment().dayOfYear();
  if (inDate !== undefined && inDate !== '') {
    day = moment(inDate).dayOfYear();
  }
  return day; //Number
}

function weekDates (curWeek=thisWeek()) {
  let today = moment();
  if (curWeek !== undefined && curWeek !== '') {
    today = moment().isoWeek(curWeek);
  }
  return  today.day(1).isoWeek(curWeek).format('LL') + ' – ' + today.day(+7).isoWeek(curWeek).format('LL'); //String
}

function weekDayNumber (inDay=thisDay()) {
  return moment(moment().dayOfYear(inDay)).day(); //Number
}

function formatDay (inDay) {
  let today = moment().format('dddd[, ] DD. MMM YYYY');
  if (inDay !== undefined && inDay !== '' && Number.isInteger(Number(inDay)))  today = moment().dayOfYear(inDay).format('dddd[, ] DD. MMMM')
  return today; //String
}

function formatDate (weekday=1, week=thisWeek()) {
  return moment().day(weekday).isoWeek(week).format('LL'); //String
}

function formatDateWithDay (weekday=1, week=thisWeek()) {
  return moment().day(weekday).isoWeek(week).format('dddd[, ] DD. MMM YYYY'); //String
}

function weekDay (weekday=moment().day()) {
  return moment().day(weekday).format('dddd'); //String
}

function weekDayFromNumber (week, wd) {
  return moment().isoWeek(Number(week)).isoWeekday(Number(wd)).format('dddd'); // String
}

function beforeToday (weekday=1, week=thisWeek()) {
  let today = moment();
  let inDay = moment().isoWeek(week).day(weekday);
  return moment(inDay).isBefore(today); //Boolean
}

function beforeFinishDate (finishDate, today = moment()) {
  moment(finishDate).isoWeek();
  if (moment(finishDate).isoWeek() === moment(today).isoWeek()) {
    return true; //Boolean
  } else {
    return false; //Boolean
  }
}

function notValid (inDate, today=moment()) {
  return moment(today).isAfter(inDate); //Boolean
}

function isActualWeek (startDate, endDate, week=thisWeek()) {
  let today = moment().isoWeek(week);
  return moment(today).isBetween(startDate, endDate, 'day', '[]'); //Boolean
}

function momentFromDay (inDay) {
  return moment(moment().dayOfYear(inDay)); //Date
}

function workdaysBetween (startDate, endDate, weekdays=[1,2,3,4,5]) {
  let workdays = 0;
  let offset = 0;
  weekdays.forEach( day => {
    if (day < moment(startDate).day() || moment(startDate).day() === 0) {
      offset++;
    }
    if (moment(endDate).day() !== 0 && day > moment(endDate).day()) {
      offset++;
    }
  });
  let startWeek = moment(startDate).isoWeek();
  let endWeek = moment(endDate).isoWeek();
  if (startWeek <= endWeek) {
    workdays = weekdays.length * (endWeek - startWeek +1);
  } else {
    if (moment(startDate).isoWeeksInYear() === 53) {
      workdays = weekdays.length * (54 - startWeek + endWeek);
    } else {
      workdays = weekdays.length * (53 - startWeek + endWeek);
    }
  }
  return workdays - offset; // Number
}

function dateIsRecent (inDate, days=3) {
  if (inDate === undefined) {
    return false;
  } else {
    return moment(inDate).add(days, 'days').isAfter(moment()); //Boolean
  }
}

function getDaytime () {
  if (moment().hour() > 18) {
    return 'NIGHT'; // String
  } else {
    return moment().format('A'); // String
  }
}

function dayFromWeek (weekday=1, week=thisWeek()) {
  return moment().day(weekday).week(week).dayOfYear(); // Number 1-365
}

function weeksArray (startWeek=thisWeek(), length=6) {
  let returnArray = [];
  for (let i=startWeek; i<startWeek+length; i++) {
    returnArray.push([i,weekDates(i)+' ('+i+')']);
  }
  return returnArray; // Array
}

function validFromUntil (startDate, endDate, weekdays=['1','2']) {
  if (weekdays.length < 2 && moment(startDate).isoWeek() === moment(endDate).isoWeek()) {
    return moment(startDate).isoWeekday(Number(weekdays[0])).format('dddd[, ] DD. MMM YYYY'); // String
  } else {
    if (moment(startDate).year() === moment(endDate).year()) {
      if (moment(startDate).month() === moment(endDate).month()) {
        return moment(startDate).format('D.') + ' - ' + moment(endDate).format('LL'); // String
      } else {
        return moment(startDate).format('D. MMMM') + ' - ' + moment(endDate).format('LL'); // String
      }
    }else {
      return moment(startDate).format('LL') + ' - ' + moment(endDate).format('LL'); // String
    }
  }
}

function getWebDate (startDate, myWeekday) {
  return moment(startDate).isoWeekday(Number(myWeekday)).format('YYYY-MM-DD'); // Web-Date String
}

function formatDateShort (startDate, myWeekday) {
  return moment(startDate).isoWeekday(Number(myWeekday)).format('dddd'); // Web-Date String
}

function humanDate (inDate) {
  return moment(inDate).calendar(null,{
    //lastWeek: 'dddd[, ] DD.MM.YYYY',
    sameElse: 'dddd[, ] DD.MM.YYYY'
  });
} // String

function humanToday (inDate=moment()) {
  return moment(inDate).format('dddd[, ] DD. MMM YYYY'); // String
}

function newDate () {
  return moment().format();
}

function getWeekDates(w=1, startDate=moment()) {
  let returnArray = [];
  for (let i=1; i<8; i++) {
    returnArray.push(moment().isoWeek(moment(startDate).isoWeek()+w).day(i).format('YYYY-MM-DD[T10:00:00+01:00]'));
  }
  return returnArray; // Array of Date Strings
}


module.exports = { thisWeek, thisDay, weekDates, weekDayNumber, formatDay, formatDate, weekDay, beforeToday, isActualWeek, momentFromDay, workdaysBetween, dateIsRecent, beforeFinishDate, notValid, getDaytime, dayFromWeek, weeksArray, formatDateWithDay, validFromUntil, getWebDate, weekDayFromNumber, formatDateShort, humanDate, humanToday, newDate, getWeekDates };
