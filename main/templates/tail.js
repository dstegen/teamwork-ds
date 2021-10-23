/*!
 * main/templates/tail.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const myPackage = require('../../package');


function tail () {
  return `
        </div>
        <!-- Footer -->
        <div class="footer">
          <div class="small bg-primary text-light text-center pt-4 pb-4">
            &copy; 2021 by Daniel Stegen, Version: ${myPackage.version}
          </div>
        </div>
      </div>

      <!-- jQuery first, then Bootstrap JS -->
        <script src="/node_modules/jquery/dist/jquery.min.js"></script>
        <script src="/node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="/node_modules/tokenfield/dist/tokenfield.min.js"></script>
        <script src="/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/node_modules/bs-custom-file-input/dist/bs-custom-file-input.min.js"></script>
        <script src="/node_modules/moment/min/moment-with-locales.min.js"></script>
      <!-- FullCalendar -->
        <script src='/public/fullcalendar/lib/main.js'></script>
      <!-- Other Scripts -->
        <script src="/public/clock.js"></script>
        <script src="/public/cookie.js"></script>
        <script src="/public/scripts.js"></script>
    </body>
  </html>`;
}


module.exports = tail;
