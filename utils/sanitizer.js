/*!
 * utils/sanitizer.js
 * teamwork-ds (https://github.com/dstegen/teamwork-ds)
 * Copyright 2021 Daniel Stegen <info@danielstegen.de>
 * Licensed under MIT (https://github.com/dstegen/webapputils-ds/blob/master/LICENSE)
 */

'use strict';


function sanitizer (inputString) {
  const allowedTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'del', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong','small', 'em', 'sup', 'sub', 'strike', 'hr', 'hr /', 'br', 'br /', 'div'];
  // <a> and <img /> are special cases, for the above are no attributes or classes allowed!
  let returnString = '';
  if (typeof(inputString) === 'string' && inputString.includes('<')) {
    // Input could include HTML TAGs, so better do something
    let splitList = inputString.split(/(<[^>]*>)/);
    splitList.forEach(subStr => {
      // Easier compare to allowedTags
      let testString = subStr.replace(/<*\/*>*/g,'');
      if (subStr.includes('<a') || subStr.includes('</a>') || subStr.includes('<img')) {
        // Special case links and images, but erase all 'on...'-Action, javascript or other active things
        returnString += subStr.replace(/on.*=.*"|on.*=.*'|\(.*\)|"java.*"|'java.*'/g,'');
      } else if (allowedTags.includes(testString)) {
        // TAGs from the allowedTags list are ok, if they're pure ;-)
        returnString += subStr;
      } else {
        // Everthing else erase all TAGs
        returnString += subStr.replace(/<[^>]*>/g,'');
      }
    });
  } else if (typeof(inputString) === 'string' && inputString === 'false') {
    return false;
  } else if (typeof(inputString) === 'string' && inputString === 'true') {
    return true;
  } else if (typeof(inputString) === 'string' || typeof(inputString) === 'number') {
    // Input doesn't include HTML TAGs
    returnString = inputString;
  }
  return returnString;
}

module.exports = sanitizer;
