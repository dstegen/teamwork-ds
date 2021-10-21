/*!
 * main/templates/files-list.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function filesList (files, urlPath='', id='', lessonColor='', deleteable=true) {
  let returnHtml = '';
  if (files && files.length > 0) {
    files.forEach( filePath => {
      filePath = '/data/issues/'+id+'/attachements/'+filePath;
      let delButton = '';
      let tmpFile = filePath.split('/').pop();
      if (deleteable) {
        delButton = `
          <form id="delform-${tmpFile.split('.')[0]}" action="/filedelete" method="post" enctype="multipart/form-data">
            <input type="text" readonly class="d-none" id="filePath" name="filePath" value="${filePath}">
            <input type="text" readonly class="d-none" id="urlPath" name="urlPath" value="${urlPath}">
            <input type="text" readonly class="d-none" id="id" name="id" value="${id}">
            <a href="#" class="${lessonColor} mr-2" onclick="fileDelete('delform-${tmpFile.split('.')[0]}')">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
            </a>
          </form>
        `;
      }
      returnHtml += `
        ${deleteable ? '<li>' : ''}
          <div class="d-flex justify-content-between ${deleteable ? '' : 'text-truncate'}">
            <a href="${filePath}" class="text-truncate ${lessonColor}" target="_blank">
              ${deleteable ? '' : `
                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                  <path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                </svg>`}
              ${tmpFile}
            </a>
            ${delButton}
          </div>
        ${deleteable ? '</li>' : ''}
      `;
    });
  }
  if (deleteable) returnHtml = '<ul class="pl-3">'+returnHtml+'</ul>'
  return returnHtml;
}


module.exports = filesList;
