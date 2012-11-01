var resource = require('resource'),
    video = resource.define('video');

video.schema.description = "for managing online digital videos";

video.property("title", {
  "type":"string",
  "default": "my title",
  "description": "the title of the video"
});

video.property("link", {
  "type":"string",
  "description": "the link to the video on a third party site",
  "format": "video"
});

video.property("description", {
  "type":"string",
  "description": "a brief description of the video"
});

video.property("tag", {
  "type": "string",
  "key": "tag",
  "description": "the tag id of the video"
});

video.method("play", function () {
  //
  // TODO
  //
});

video.method("stop", function () {
  //
  // TODO
  //
});


exports.video = video;