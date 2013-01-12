var resource = require('resource'),
    tag = resource.define('tag');

tag.schema.description = "a simple hierarchical tagging system";

tag.persist('memory');

tag.property("name", {
  "type":"string",
  "description": "the name of the tag",
  "required": true
});

tag.property("parentID", {
  "type":"string",
  "description": "the parent ID of the tag",
  "key": "tag",
  "default": ""
});

tag.method('createTag', createTag, {
  "description": "",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "name": tag.schema.properties.name,
        "parentID": tag.schema.properties.parentID
      }
    }
  }
});

// TODO: remove createTag function, move FK lookup to resource.js
function createTag (options, callback) {
  console.log('createTag');
  
  //
  // Check if the parent id exists
  //
  tag.get(options.parentID, function(err, result){
    //
    // If there is any error getting parent ( not found, or other),
    // do not create the tag
    //
    if (err) {
      console.log(err)
      return callback(err);
    }
    
    return tag.create(options, callback);
  });
}


tag.method('getTag', getTag, {
  "description": "",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "id": tag.schema.properties.name
      }
    }
  }
});

function getTag (options, callback) {
  var arr = [];
  
  
  function _fetch (id) {
    //
    // Get tag by id
    //
    tag.get(id, function(err, result){
      //
      // If there is any error getting parent ( not found, or other),
      // do not go any further
      //
      if (err) {
        return callback(err);
      }
      arr.unshift(result);
      if(result.parentID === "null") { // TODO: 0 might better than stringy null value
        return callback(err, arr);
      }
      _fetch(result.parentID);
    });
  }
  _fetch(options.id);
}

exports.tag = tag;