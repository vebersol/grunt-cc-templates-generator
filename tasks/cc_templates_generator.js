/*
 * grunt-cc-templates-generator
 * https://github.com/vebersol/grunt-cc-templates-generator
 *
 * Copyright (c) 2014 Vinícius Ebersol
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('cc_templates_generator', 'A plugin that generates templates based on components.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			vars: {}
		});

		var builder = require('./lib/builder').init(grunt, options);

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			// Concat specified files.
			var src = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				// Read file source.
				builder.init(filepath, f);
				// return grunt.file.read(filepath);
			});
		});

		builder.generateComponent();
	});

};