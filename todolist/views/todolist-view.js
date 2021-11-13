/*!
 * todolist/views/todolist-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

let showMe = 'd-none';
let reloadIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
</svg>`;


function todolistView (tdListObj, userAgent) {
  if (userAgent && userAgent.includes('AppleWebKit')) {
    showMe = '';
  } else {
    showMe = 'd-none'
  }
  return `
    <div id="todolist-view" class="container py-3" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Todo lists
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="row border p-3 g-0">
        ${tdListObj.lists.map(listView).join('')}
        ${addListForm()}
      </div>
    </div>
  `;
}


// Additional functions

function listView (list) {
  let returnHtml = `
    <div class="col-12 col-lg-6 col-xl-4 mb-5">
      ${listForm(list)}
      <ol>
  `;
  list.items.forEach( item => {
    returnHtml += `
      <li>${itemForm(item, list.listId)}</li>
    `;
  });
  returnHtml += `
      <li>${addItemForm(list.listId)}</li>
      </ol>
    </div>
  `;
  return returnHtml;
}

function addListForm () {
  return `
  <div class="col-12 col-lg-6 col-xl-4">
    <form action="/todolist/add" method="post" class="d-flex justify-conten-between">
      <input type="text" class="form-control ms-3" name="name" value="" placeholder="New list" style="border: none; border-bottom: 1px solid gray;" />
      <button type="submit" class="btn btn-sm btn-primary ms-3"> + </button>
    </form>
  </div>
  `;
}

function listForm (list) {
  return `
    <div id="list-form-${list.listId}" class="d-flex justify-content-start">
      <form action="/todolist/update" method="post" class="d-flex justify-conten-between me-3 w-100">
        <input type="text" name="listId" class="d-none" hidden value="${list.listId}">
        <input type="text" class="form-control form-control-lg text-truncate" name="name" value="${list.name}" style="border: none;" onfocus="$('#list-delbutton-${list.listId}').removeClass('d-none')">
        <button type="submit" class="btn btn-sm btn-link p-0 m-0 ${showMe}">${reloadIcon}</button>
      </form>
      <span id="list-delbutton-${list.listId}" class=" mt-2 d-none">${delButton('', list.listId, 'list')}</span>
    </div>
  `;
}

function addItemForm (listId) {
  return `
    <form action="/todolist/update" method="post" class="d-flex justify-conten-between">
      <input type="text" name="listId" class="d-none" hidden value="${listId}" />
      <input type="text" class="form-control" name="item" value="" style="border: none; border-bottom: 1px solid gray;" />
      <button type="submit" class="btn btn-sm btn-light ms-3"> + </button>
    </form>
  `;
}

function itemForm (item, listId) {
  let strikethrough = item.done === true ? 'text-decoration-line-through text-muted' : '';
  return `
    <div class="d-flex justify-content-start">
    <form action="/todolist/update" method="post" class="d-flex justify-conten-between w-100">
      <input type="text" name="listId" class="d-none" hidden value="${listId}">
      <input type="text" name="itemId" class="d-none" hidden value="${item.itemId}">
      <input type="text" class="form-control text-truncate ${strikethrough}" name="item" value="${item.item}" id="item-${listId}-${item.itemId}" style="border: none;">
      <input class="form-check-input me-3" type="checkbox" value="true" id="done-${listId}-${item.itemId}" name="done" onchange="toggleDone(this.id,this.checked);" ${item.done === true ? 'checked' : ''}>
      <button type="submit" class="btn btn-sm btn-link p-0 m-0 ${showMe}">${reloadIcon}</button>
    </form>
    <span class="ms-3">${delButton(item, listId, 'item')}</span>
    </div>
  `;
}

function delButton (item, listId, what) {
  return `
    <form id="delform-${listId}-${item.itemId}" action="/todolist/delete" method="post">
      <input type="text" readonly class="d-none" id="what" name="what" value="${what}">
      <input type="text" readonly class="d-none" id="listId" name="listId" value="${listId}">
      <input type="text" readonly class="d-none" id="itemId" name="itemId" value="${item.itemId}">
      <a href="#" class="mr-2" onclick="fileDelete('delform-${listId}-${item.itemId}')">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
      </a>
    </form>
  `;
}

module.exports = todolistView;
