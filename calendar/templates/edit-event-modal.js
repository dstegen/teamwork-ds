/*!
 * calendar/templates/edit-event-modal.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getAllUsers } = require('../../user/models/model-user');
const { getAllCalendars } = require('../models/model-calendar');
const formTextInput = require('../../main/templates/form-textinput');
const formTextArea = require('../../main/templates/form-textarea');
const formCheckbox = require('../../main/templates/form-checkbox');
const formSelect = require('../../main/templates/form-select');


function editEventModal () {
  let allUserList = getAllUsers().map( item => { return {id: item.id, name: item.fname+' '+item.lname}; });
  return `
    <!-- Modal -->
    <div class="modal fade" id="editEventModal" tabindex="-1" aria-labelledby="editEventModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add/edit event</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="edit-event-form" name="edit-event-form" action="/calendar/update" method="post">
              <input type="text" id="id-field" name="id" class="d-none" hidden value="" />
              <div class="form-group row">
                ${formTextInput('', 'title', 'required', '', '', 'text')} <div class="col-3"></div>
                ${formCheckbox(['true'], 'online', [], [], true)} <div class="col-3"></div>
                ${formSelect(getAllCalendars().map(item => {return [item.url, item.name]}), '/calendar/load/101', 'sourceUrl', '', '', '')} <div class="col-3"></div>
                ${formTextInput('', 'start', 'required', '', '', 'text')} <div class="col-3"></div>
                ${formTextInput('', 'end', '', '', '', 'text')} <div class="col-3"></div>
                ${formCheckbox(['true'], 'allDay', [], [], true)} <div class="col-3"></div>
                ${formTextInput('', 'members', '', '', '', 'text')} <div class="col-3"></div>
                <div class="col-12 mt-1"></div>
                ${formTextArea('', 'description', '')} <div class="col-3"></div>
              </div>
              <div class="d-flex justify-content-between mt-3">
                <span>
                  <button type="submit" class="btn btn-sm btn-danger me-3" onclick="confirmDelete(this.form.name, \'/calendar/delete\')">Delete</button>
                  <small class="supersmall tex-muted" id="eventId"></small>
                </span>
                <span>
                  <button type="button" class="btn btn-sm btn-secondary me-3" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-sm btn-primary">Update</button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <script>
      var membersArray = ${JSON.stringify(allUserList)};
    </script>
  `;
}


module.exports = editEventModal;
