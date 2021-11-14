#TeamWork-DS#
#### TeamWorking WebApp by Daniel Stegen ####

## Introduction ##
TeamWork-DS intends to integrate many modern team working tools in one App. Project based workflows with tasks/issues/tickets, time tracking, kanban boards for planing, calendars and reminders, chat functions and online video meetings for communication,  docs for longtime documentation.

## Features ##
- Organize your work in projects with tasks/issues/bugs
- Comment on issues
- Communicate about projects and in private chats
- View projects on kanban boards
- View projects on calendar
- Trello-like free boards for additional orangisation
- Team calendar
- Jitsi online video meetings


## Important notice ##
***-> At the moment TeamWork-DS is more a "proof-of-concept" and not ready for production!***

#### Missing features: ####
- Database support (currently only *.json files)
- Secure privacy support (all saved data is unencrypted)
- Scaleabilty (currently everything runs in one process)
- Documentation & HowTos


## Installation ##

1. Download **teamwork-ds.zip**

2. Unzip teamwork-ds.zip into your project directory

   ```
   unzip teamwork-ds.zip -d ./teamwork-ds
   ```

3. Change into the **teamwork-ds** directory and install the dependencies

   ```
   cd teamwork-ds
   npm install
   ```

4. Start teamwork-ds within the **teamwork-ds** directory with the command:

   ```
   npm start
   ```

## HowTos ##

#### Install example data ####
```
node helper/install-example-date.js
```

#### Add example events only ####
```
node helper/add-example-events.js
```

#### Optional ./serverconf.json ####
```
{
  "serverIp": "0", // listen to all ips
  "serverPort": 8585,
  "secure": true,
  "keyFile": "/path/to/ssl/server.key",
  "certFile": "/path/to/ssl/server.cert",
  "meetServer": "your-jitsi-meet-server.com"
}
```


## Changelog ##

### v0.1.5 ####
- added simple full text search
- added personal todo lists
- added checklist to issue
- improved issues subtasks handling

#### v0.1.4 ####
- added multiple calendars
- refactored & improved calendars
- added event description
- added subtasks to issues
- added basic people resource page
- added team member overview page
- refactored user controller
- several bugfixes and usability improvements

#### v0.1.3 ####
- important security fix in router
- added members settings
- added member photo upload
- added position to user
- fixed admin dropdown menu
- some bugfixes and cleanups

#### v0.1.2 ####
- added jitsi online video meetings
- added example data install script
- refactored & improved activities
- bugfixes and visual improvements

#### v0.1.1 ####
- added activity stream
- drag'n drop events in calendar
- added free boards
- added calendar list view to main page
- added member pictures

#### v0.0.9 ####
- added flatpickr
- added more event editing options


#### v0.0.8 ####
- added calendar
- securtiy fix for delivery
- security fix for up- & donwload

#### v0.0.7 ####
- added projects kanban boards
- added first favicon
- added more use of icons
- added issue pills

#### v0.0.5 ####
- enabled communication
- visual improvements & better browser compatibility
- some bugfixes

#### v0.0.4 ####
- finished issues implementation
- some bugfixes

#### v0.0.3 ####
- added tokenfield for tags and watchers

## License ##

The MIT License (MIT)

Copyright (c) 2021 Daniel Stegen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Author: Daniel Stegen

Email: info@danielstegen.de
