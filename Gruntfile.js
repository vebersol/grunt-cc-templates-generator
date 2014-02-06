/*
 * grunt-cc-templates-generator
 * https://github.com/vebersol/grunt-cc-templates-generator
 *
 * Copyright (c) 2014 Vinícius Ebersol
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		// Configuration to be run (and then tested).
		cc_templates_generator: {
			default_options: {
				options: {
					vars: {
						templatesAssetsPath: '',
						componentsAssetsPath: '../../../'
					},

					assetsPath: {
						templates: '',
						components: '../../'
					}
				},
				src: 'tmp/templates/**.html',
				dest: 'tmp/generated/templates/',
				components_src: 'tmp/components/',
				components_dest: 'tmp/generated/components/'
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// By default, lint and run all tests.
	grunt.registerTask('default', ['cc_templates_generator']);

};