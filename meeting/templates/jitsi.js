/*!
 * meeting/templates/jitsi.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function jitsi (meeting, user) {
  try {
    const serverconf = require('../../serverconf');
    return `
      <script src='https://${serverconf.meetServer}/external_api.js'></script>
      <script>
        const options = {
          roomName: '${meeting.id}-${meeting.name}',
          width: '1256px',
          height: '706px',
          parentNode: document.querySelector('#jitsi'),
          configOverwrite: {
            startWithAudioMuted: true,
            enableWelcomePage: false,
            enableClosePage: false,
            disableTileView: false,
            hideConferenceTimer: false
          },
          interfaceConfigOverwrite: {
            DISABLE_DOMINANT_SPEAKER_INDICATOR: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            DISABLE_PRESENCE_STATUS: false,
            HIDE_INVITE_MORE_HEADER: true,
            RECENT_LIST_ENABLED: true,
            SETTINGS_SECTIONS: [ 'devices' ],
            SHOW_JITSI_WATERMARK: true,
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'desktop', 'fullscreen',
                'fodeviceselection', 'profile', 'chat',
                'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'shortcuts',
                'tileview', 'videobackgroundblur', 'help', 'mute-everyone', 'mute-video-everyone', 'security'
            ],
            VIDEO_QUALITY_LABEL_DISABLED: false
          },
          userInfo: {
              displayName: '${user.fname + ' ' + user.lname}'
          }
        }
        const api = new JitsiMeetExternalAPI('${serverconf.meetServer}', options);
        // set new password for channel
        api.addEventListener('participantRoleChanged', function(event) {
            if (event.role === "moderator") {
                api.executeCommand('password', '${meeting.key}');
            }
        });
        // join a protected channel
        /*
        api.on('passwordRequired', function ()
        {
            api.executeCommand('password', '${meeting.key}');
        });
        */
        // enable lobby
        api.addEventListener('participantRoleChanged', function (event) {
            if(event.role === 'moderator') {
                api.executeCommand('toggleLobby', true);
            }
        });
      </script>
    `;
  } catch (e) {
    console.log('- ERROR Jisti configuration is missing: '+e);
    return 'HomeSchool-DS error: Jisti configuration is missing: '+e;
  }
}


module.exports = jitsi;
