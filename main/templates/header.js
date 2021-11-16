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
            <link rel="stylesheet" href="/bootstrap/dist/css/bootstrap.min.css">
            <link rel="stylesheet" href="/tokenfield/dist/tokenfield.css">
            <link rel="stylesheet" href="/jquery-ui-dist/jquery-ui.min.css">
          <!-- FullCalendar -->
            <link href='/public/fullcalendar/lib/main.css' rel='stylesheet' />
          <!-- Flatpickr -->
            <link rel="stylesheet" href="/flatpickr/dist/flatpickr.min.css">
            <link rel="stylesheet" type="text/css" href="/flatpickr/dist/themes/material_blue.css">
          <!-- Trumbowyg -->
            <link rel="stylesheet" href="/trumbowyg/dist/ui/trumbowyg.min.css">
          <!-- Css Theme -->
            <link rel="stylesheet" href="/public/styles.css">
          <!-- Favicon -->
            <link rel="apple-touch-icon" sizes="57x57" href="/public/favicon/apple-icon-57x57.png">
            <link rel="apple-touch-icon" sizes="60x60" href="/public/favicon/apple-icon-60x60.png">
            <link rel="apple-touch-icon" sizes="72x72" href="/public/favicon/apple-icon-72x72.png">
            <link rel="apple-touch-icon" sizes="76x76" href="/public/favicon/apple-icon-76x76.png">
            <link rel="apple-touch-icon" sizes="114x114" href="/public/favicon/apple-icon-114x114.png">
            <link rel="apple-touch-icon" sizes="120x120" href="/public/favicon/apple-icon-120x120.png">
            <link rel="apple-touch-icon" sizes="144x144" href="/public/favicon/apple-icon-144x144.png">
            <link rel="apple-touch-icon" sizes="152x152" href="/public/favicon/apple-icon-152x152.png">
            <link rel="apple-touch-icon" sizes="180x180" href="/public/favicon/apple-icon-180x180.png">
            <link rel="icon" type="image/png" sizes="192x192"  href="/public/favicon/android-icon-192x192.png">
            <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon/favicon-32x32.png">
            <link rel="icon" type="image/png" sizes="96x96" href="/public/favicon/favicon-96x96.png">
            <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon/favicon-16x16.png">
            <link rel="manifest" href="/public/favicon/manifest.json">
            <meta name="msapplication-TileColor" content="#ffffff">
            <meta name="msapplication-TileImage" content="/public/favicon/ms-icon-144x144.png">
            <meta name="theme-color" content="#ffffff">
          <title>TeamWork-DS</title>
        </head>
        <body>
          <div id="teamwork-ds">`;
}


module.exports = header;
