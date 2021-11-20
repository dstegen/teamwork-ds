/*!
 * main/views/search-view.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/teamwork-ds/blob/master/LICENSE)
 */

'use strict';


function searchView (results, searchTerm) {
  return `
    <div id="search-view" class="container py-3 mb-5" style="min-height: 500px;">
      <h2 class="d-flex justify-content-between py-2 px-3 my-3 border">
        Search
        <span id="clock" class="d-none d-md-block">&nbsp;</span>
      </h2>
      <div class="p-3 border">
        <form id="search-form" name="search-form" action="/search" method="post" class="d-flex mb-3">
          <input type="text" class="form-control" id="searchTerm-field" name="searchTerm" placeholder="Search" aria-label="Search" value="${searchTerm}">
          <button class="btn btn btn-primary ms-2" type="submit">Search</button>
        </form>
        <hr />
        ${resultsBlock(results.filter(item => item.type === 'project'), 'Projects')}
        ${resultsBlock(results.filter(item => item.type === 'issue'),'Issues')}
        ${resultsBlock(results.filter(item => item.type === 'comment'),'Issue comments')}
        ${resultsBlock(results.filter(item => item.type === 'event'),'Calendar events')}
        ${resultsBlock(results.filter(item => item.type === 'board'),'Free board cards')}
        ${resultsBlock(results.filter(item => item.type === 'chat'),'Project chat entries')}
        ${resultsBlock(results.filter(item => item.type.includes('docs')),'Docs')}
        ${results.length < 1 ? '<p>Sorry, no search result!</p>' : ''}
      </div>
    </div>
  `;
}


// Additional fucntions

function resultsBlock (results, headline) {
  if (results.length > 0){
    return `
    <h5>${headline}</h5>
    <ul>
      <li>
        ${results.map(item => { return '<a href="'+item.url+'">'+item.name+'</a> <span class="text-muted">['+item.id+']</span><br /><span class="small text-muted">'+item.description+'</span>'; }).join('</li><li>')}
      </li>
    </ul>
    `;
  } else {
    return '';
  }
}


module.exports = searchView;
