/*!
 * timetracking/templates/timetracking-modal.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';

// Required modules
const { getProjectById } = require('../../project/models/model-project');
const { getAllIssues } = require('../../issue/models/model-issue');
const formTextInput = require('../../main/templates/form-textinput');
const formSelect = require('../../main/templates/form-select');


function timetrackingModal () {
  return `
    <!-- Timetracking Modal -->
    <div class="modal fade" id="timetrackingModal" tabindex="-1" aria-labelledby="editEventModal" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Timetracking</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="timetracking-form" name="new-calendar-form" action="/timetracking/update" method="post">
              <input type="text" id="id-field" name="id" class="d-none" hidden value="" />
              <div class="form-group row">
                ${formSelect(getAllIssues().filter(item => item.state !== 'closed').map(item => {return [item.id, item.name+' ['+getProjectById(item.projectId).name+']']}), '', 'issueId', '', '', 'required')} <div class="col-3"></div>
                ${formTextInput('', 'date', 'required', '', '', 'text')} <div class="col-3"></div>
                ${formTextInput('', 'time', 'required', '', '', 'text')} <div class="col-3"></div>
                ${formTextInput('', 'description', '', '', '', 'text')} <div class="col-3"></div>
              </div>
              <div class="d-flex justify-content-between mt-3">
                <button type="button" class="btn btn-sm btn-secondary me-3" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-sm btn-primary">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}


module.exports = timetrackingModal;
