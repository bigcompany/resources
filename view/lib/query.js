var query = function (content) {
  //
  // TODO: Add better feature detection here for $
  //
  var $,
      cheerio;

  try {
   cheerio = require('cheerio');
  } catch (err) {
    // Do nothing
  }

  //
  // Detected server-side node.js, use cheerio
  //
  if(typeof cheerio !== 'undefined') {
    $ = cheerio;
  }
  else
  {
    $ = function(){};
  }

  if(typeof $.load === 'function') {
    $ = $.load(content);
  }
  return $;

  //
  // Detected client-side jQuery, use jQuery
  //
  // TODO

  //
  // Detected client-side querySelectorAll, using querySelectorAll
  //
  // TODO

  //
  // Client-side, but no $ found. Using Zepto fallback
  //
  // TODO
};

module['exports'] = query;