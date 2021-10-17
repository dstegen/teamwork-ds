/*!
 * main/templates/navi.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function navi (naviObj, loggedIn, history) {
  let loggedInHtml = '';
  if (loggedIn) {
    loggedInHtml += `
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
        <div class="navbar-nav">
          ${naviObj.menuItems.map(helperMenuItem).join('')}
        </div>
      </div>
    </div>
    `;
  }
  let onClick = '';
  if (naviObj.home.link.includes('#')) onClick = `data-toggle="collapse" onclick="$('${naviObj.home.link}').collapse('toggle');"`;
  return `
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top d-block">
      <div class="container-fluid w-100">
        <a class="navbar-brand text-truncate w-25 py-0" href="${naviObj.home.link}" ${onClick}>
          ${naviObj.home.name}
        </a>
        ${loggedInHtml}
      </div>
    </nav>
    <div id="feedback" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-sm ">
        <div class="modal-content text-center py-3 text-white bg-success">
          ${history.msg} (${history.section} ID: ${history.id})
        </div>
      </div>
    </div>
    <script>
      let newMessages = ${naviObj.newMessages};
    </script>
    <!-- Main content -->
  `;
}


// Additional Functions

function helperMenuItem (item) {
  let returnHtml = '';
  if (item.dropdown) {
    returnHtml += `
      <div class="nav-item dropdown">
        <a class="nav-link dropdown-toggle text-capitalize" href="#" id="navbarDropdownMenuLink" data-bs-toggle="dropdown">${item.name}</a>
        <div class="dropdown-menu">
          ${item.dropdownItems.map(helperDropdown).join('')}
        </div>
      </div>
    `;
  } else if (item.buttonType) {
    let onClick = '';
    returnHtml += `
      <div class="nav-item">
        <a href="${item.link}" class="btn btn-light btn-sm mt-1 mx-3 text-capitalize" id="topnavi-${item.link.replace(/\//g,'')}" ${onClick}>${item.name}</a>
      </div>
      <form class="d-flex my-1">
        <input class="form-control-sm me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-sm btn-outline-light" type="submit">Search</button>
      </form>
    `;
  } else {
    let onClick = '';
    if (item.link.includes('#')) onClick = `data-toggle="collapse" onclick="$('${item.link}').collapse('toggle');"`;
    returnHtml += `
      <div class="nav-item">
        <a class="nav-link text-capitalize" id="topnavi-${item.link.replace(/\//g,'')}" href="${item.link}" ${onClick}>${item.name}</a>
      </div>
    `;
  }
  return returnHtml;
}

function helperDropdown (dropdownItem) {
  let slavePadding = '';
  if (dropdownItem.subCat) slavePadding = ' pl-4';
  let borderTop = '';
  if (dropdownItem.link.includes('new')) borderTop = 'border-top';
  let onClick = '';
  if (dropdownItem.link.includes('#')) onClick = `data-toggle="collapse" onclick="$('${dropdownItem.link}').collapse('toggle');"`;
  return `
    <div class="nav-item ${borderTop}">
      <a class="nav-link text-capitalize text-dark ${slavePadding}" href="${dropdownItem.link}" ${onClick}>
        ${dropdownItem.name}
      </a>
    </div>
  `;
}


module.exports = navi;
