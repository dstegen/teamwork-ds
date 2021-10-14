/*!
 * lib/getNaviObj.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const locale = require('./locale');
const config = require('../main/models/model-config').getConfig();
const { getLatestMessages } = require('../communication/models/model-messages');
const { getTitleNameById } = require('../user/models/model-user');


function getNaviObj (user) {
  let role = '';
  if (user) role = user.role;
  let myGroup = [];
  let lessonsDropdown = [];
  let classesDropdown = [];
  let boardsDropdown = [];
  let classroomDropdowns = [];
  switch (role) {
    case 'student':
      return {
        school: config.schoolName,
        loginname: locale.headlines.navi_student[config.lang]+': '+getTitleNameById(user.id),
        loggedin: true,
        home: {
          name: 'TeamWork-DS',
          link: '/'
        },
        menuItems: [
          {
            name: locale.headlines.navi_today[config.lang],
            link: '/lessons/day',
            dropdown: false
          },
          {
            name: locale.headlines.navi_this_week[config.lang],
            link: '/timetable',
            dropdown: false
          },
          {
            name: locale.headlines.navi_classroom[config.lang],
            link: '/classroom',
            dropdown: false
          },
          {
            name: locale.headlines.board[config.lang],
            link: '/board',
            dropdown: false
          },
          {
            name: locale.headlines.navi_communication[config.lang],
            link: '/communication',
            dropdown: false
          }
        ],
        newMessages: getLatestMessages(user.id).length
      };
    case 'teacher':
      myGroup = user.group;
      lessonsDropdown = [
        {
          name: locale.headlines.navi_overview[config.lang],
          link: '/lessons'
        }
      ]
      for (let i=0; i<myGroup.length; i++) {
        lessonsDropdown.push(
          {
            name: '+ '+locale.headlines.navi_new_class[config.lang]+' '+myGroup[i],
            link: '/lessons/add/'+myGroup[i]
          }
        )
      }
      for (let i=0; i<myGroup.length; i++) {
        classesDropdown.push(
          {
            name: locale.headlines.class[config.lang]+' '+myGroup[i],
            link: '/classes/'+myGroup[i]
          }
        )
      }
      for (let i=0; i<myGroup.length; i++) {
        boardsDropdown.push(
          {
            name: locale.headlines.board[config.lang]+' '+myGroup[i],
            link: '/board/'+myGroup[i]
          }
        )
      }
      for (let i=0; i<myGroup.length; i++) {
        classroomDropdowns.push(
          {
            name: locale.headlines.navi_classroom[config.lang]+' '+myGroup[i],
            link: '/classroom/'+myGroup[i]
          }
        )
      }
      return {
        school: config.schoolName,
        loginname: locale.headlines.navi_teacher[config.lang]+': '+getTitleNameById(user.id),
        loggedin: true,
        home: {
          name: 'TeamWork-DS',
          link: '/'
        },
        menuItems: [
          {
            name: locale.headlines.navi_communication[config.lang],
            link: '/communication',
            dropdown: false
          },
          {
            name: locale.headlines.navi_classroom[config.lang],
            link: '#',
            dropdown: true,
            dropdownItems: classroomDropdowns
          },
          {
            name: locale.headlines.navi_classes[config.lang],
            link: '#',
            dropdown: true,
            dropdownItems: classesDropdown
          },
          {
            name: locale.headlines.board[config.lang],
            link: '#',
            dropdown: true,
            dropdownItems: boardsDropdown
          },
          {
            name: locale.headlines.navi_lessons[config.lang],
            link: '#',
            dropdown: true,
            dropdownItems: lessonsDropdown
          }
        ],
        newMessages: getLatestMessages(user.id).length
      };
    case 'admin':
      return {
        school: config.schoolName,
        loginname: 'Admin: '+getTitleNameById(user.id),
        loggedin: true,
        home: {
          name: 'TeamWork-DS',
          link: '/admin'
        },
        menuItems: [
          {
            name: 'School',
            link: '/admin/school',
            dropdown: false
          },
          {
            name: 'Group',
            link: '/admin/settings',
            dropdown: false
          },
          {
            name: 'Users',
            link: '/admin/edituser',
            dropdown: false
          }
        ]
      };
    default:
      return {
        school: config.schoolName,
        loginname: '',
        loggedin: false,
        home: {
          name: 'TeamWork-DS',
          link: '#dashboard'
        },
        menuItems: [
          {
            name: 'support',
            link: 'mailto:'+config.supportEmail,
            dropdown: false
          }
        ]
      };
  }
}


module.exports = getNaviObj;
