exports.init = function Builder(grunt, options) {
	var methods,
		fs = require('fs'),
		dest,
		html;

	methods = {
		src: '',
		dest: '',
		components: '',
		init: function(src, dest, components) {
			methods.src = src;
			methods.dest = methods.getFilename(src, dest);;
			methods.components = components;

			methods.readTemplate();
		},

		readTemplate: function() {
			var data = fs.readFileSync(methods.src, {
				encoding: 'utf-8'
			}, function(err, data) {
				if (err) throw err;
			});

			methods.outputData(data);
		},

		outputData: function(data) {
			html = data;
			methods.replaceContents(data);
		},

		replaceContents: function(data) {
			var matchers = data.match(/\{\{.*\}\}/g),
				componentsHTML = [];

			for (i in matchers) {
				if (matchers.hasOwnProperty(i)) {
					componentsHTML.push(methods.getComponent(matchers[i]));
				}
			}

			methods.addComponent(componentsHTML, matchers);
		},

		getComponent: function(matcher) {
			var data,
				path = methods.components + matcher.match(/\{\{(.*)\}\}/)[1] + '.html',
				cstr = '<COMPONENT>',
				componentStart,
				componentEnd,
				componentHTML;

			data = fs.readFileSync(path, {
				encoding: 'utf-8'
			}, function(err, data) {
				if (err) throw err;
			});

			componentStart = data.indexOf(cstr) + cstr.length;
			componentEnd = data.indexOf('</COMPONENT>');
			componentHTML = data.substring(componentStart, componentEnd);

			return componentHTML;
		},

		addComponent: function(component, matchers) {
			for (var i = 0; i < matchers.length; i++) {
				html = html.replace(matchers[i], component[i]);
			}

			methods.writeTemplate(html);
		},

		writeTemplate: function(html) {
			grunt.file.write(methods.dest, html);
			grunt.log.ok('File "' + methods.dest + '" created.');
		},

		getFilename: function(src, dest) {
			var pathArr = src.split('/'),
				filename = pathArr[pathArr.length - 1];

			return dest + filename;
		}
	}

	return methods;
};