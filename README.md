#TeamWork-DS#
#### TeamWorking WebApp by Daniel Stegen ####

## Introduction ##
TeamWork-DS intends to integrate many modern team working tools in one App. Project based workflow with tasks/issues/ticket tracking, kanban boards for planing, chat functions for communication and docs for longtime documentation.

## Features ##
- Organize your work in projects with tasks/issues/bugs
- Comment on the issues
- Communicate about projects and in private chats

## Important notice ##
***At the moment TeamWork-DS is more a "proof-of-concept" project and not ready for production!***

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

## Changelog ##

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
