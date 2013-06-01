var resource = require('resource');

module['exports'] = function (options, callback) {

	  var $ = this.$;

		$('.table').html(options.table);

		callback(null, $.html());
};

