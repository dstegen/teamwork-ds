/*!
 * main/templates/tail.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const myPackage = require('../../package');


function tail (wsport) {
  return `
        </div>
        <!-- Footer -->
        <div class="footer fixed-bottom">
          <div class="small bg-primary text-light text-center py-3">
            &copy; 2021 by Daniel Stegen, Version: ${myPackage.version}
          </div>
        </div>
      </div>

      <!-- jQuery first, then Bootstrap JS -->
        <script src="/jquery/dist/jquery.min.js"></script>
        <script src="/jquery-ui-dist/jquery-ui.min.js"></script>
        <script src="/tokenfield/dist/tokenfield.min.js"></script>
        <script src="/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/bs-custom-file-input/dist/bs-custom-file-input.min.js"></script>
        <script src="/moment/min/moment-with-locales.min.js"></script>
      <!-- FullCalendar -->
        <script src='/public/fullcalendar/lib/main.js'></script>
      <!-- Flatpickr -->
        <script src="/flatpickr/dist/flatpickr.min.js"></script>
      <!-- Trumbowyg -->
        <script src="/trumbowyg/dist/trumbowyg.min.js"></script>
      <!-- Datatables -->
        <script src="/datatables.net/js/jquery.dataTables.min.js"></script>
      <!-- Other Scripts -->
        <script src="/public/clock.js"></script>
        <script src="/public/cookie.js"></script>
        <script src="/public/scripts.js"></script>
      <!-- WebSockets -->
      <script>
        const hostnameTail = window.location.hostname ;
        const wsProtocolTail = location.protocol.replace('http','ws');
        const socketTail = new WebSocket(wsProtocolTail+'//'+hostnameTail+':${wsport}/', 'protocolOne', { perMessageDeflate: false });
        socketTail.onmessage = function (msg) {
          //console.log(msg.data);
          if (msg.data === 'chatUpdate') {
            notifyMe('New message');
          } else {
            notifyMe(msg.data.toString());
          }
          if (window.location.pathname.includes('communication') || window.location.pathname.includes('project') || window.location.pathname.includes('issue')) {
            setTimeout(function(){ location.reload(); }, 1500);
          }
        };
      </script>
    </body>
  </html>`;
}


module.exports = tail;
