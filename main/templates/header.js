/*!
 * main/templates/header.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function header () {
  return `
    <!DOCTYPE HTML>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <!-- Bootstrap, jquery and trumbowyg CSS -->
            <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="/node_modules/jquery-ui-dist/jquery-ui.min.css">
          <!-- Css Theme -->
            <link rel="stylesheet" href="/public/styles.css">
          <!-- Favicon -->
          <title>TeamWork-ds</title>
        </head>
        <body>
          <div id="teamwork-ds">`;
}


module.exports = header;
