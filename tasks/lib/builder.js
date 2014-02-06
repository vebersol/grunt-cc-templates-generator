exports.init = function Builder(grunt, options) {
	var methods,
		fs = require('fs'),
		dest,
		html;

	methods = {
		src: '',
		dest: '',
		components: '',
		f: '',
		vars: options.vars,
		init: function(src, f) {
			methods.src = src;
			methods.f = f;
			methods.dest = methods.getFilename(src, f.dest);
			methods.components = f.components_src;

			methods.generateTemplate();
		},

		generateTemplate: function() {
			var data = fs.readFileSync(methods.src, {
				encoding: 'utf-8'
			}, function(err, data) {
				if (err) throw err;
			});

			methods.outputData(data);
		},

		generateComponent: function() {
			grunt.file.recurse(methods.f.components_src, function(abspath, rootdir, subdir, filename) {
				var data = grunt.file.read(abspath, {
					encoding: 'utf-8'
				}),
					jsonPath = filename.match('.html') ? methods.f.components_src + 'data/' + filename.replace('.html', '.json') : null,
					json = jsonPath ? methods.loadJSON(jsonPath) : null,
					content;

				data = methods.replaceVars(data);

				if (json && json.data && json.data.length > 0) {
					content = methods.replaceContent(data, json.data[0]);

					if (content) {
						methods.writeComponent(filename, content);
					}
				} else if (filename.match('\.html')) {
					methods.writeComponent(filename, data);
				} else {
					methods.copyFile(subdir, filename);
				}
			});
		},

		outputData: function(data) {
			html = methods.replaceVars(data);
			methods.addTemplateComponents(data);
		},

		replaceVars: function(html) {
			var path,
				regex,
				matcher;
			for (i in methods.vars) {
				if (methods.vars.hasOwnProperty(i)) {
					path = methods.vars[i];
					if (path) {
						regex = new RegExp('{#' + i + '#}', 'g');
						matcher = html.match(regex);

						if (matcher) {
							html = html.replace(regex, path);
						}
					}
				}
			}

			return html;
		},

		addTemplateComponents: function(data) {
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
				str = matcher.match(/\{\{(.*)\}\}/)[1],
				matcherArr = str.split(','),
				path = methods.components + matcherArr[0] + '.html',
				index = matcherArr.length > 1 ? matcherArr[1] : null,
				jsonPath = methods.components + 'data/' + matcherArr[0] + '.json',
				cstr = '<COMPONENT>',
				componentStart,
				componentEnd,
				componentHTML,
				json;

			data = fs.readFileSync(path, {
				encoding: 'utf-8'
			}, function(err, data) {
				if (err) throw err;
			});

			json = methods.loadJSON(jsonPath);

			componentStart = data.indexOf(cstr) + cstr.length;
			componentEnd = data.indexOf('</COMPONENT>');
			componentHTML = data.substring(componentStart, componentEnd);
			componentHTML = methods.addComponentContent(componentHTML, json, index);

			return componentHTML;
		},

		loadJSON: function(path) {
			if (grunt.file.exists(path)) {
				json = grunt.file.read(path);
				json = JSON.parse(json);
				return json;
			}
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

		writeComponent: function(filename, html) {
			grunt.file.write(methods.f.components_dest + filename, html);
			grunt.log.ok('File "' + methods.f.components_dest + filename + '" created.');
		},

		copyFile: function(subdir, filename) {
			var path = subdir ? methods.f.components_src + subdir + '/' : methods.f.components_src,
				destPath = subdir ? methods.f.components_dest + subdir + '/' : methods.f.components_dest,
				origin = path + filename,
				target = destPath + filename;

			grunt.file.copy(origin, target);

			grunt.log.ok('File "' + origin + '" copy to ' + target + '.');
		},

		getFilename: function(src, dest) {
			var pathArr = src.split('/'),
				filename = pathArr[pathArr.length - 1];

			return dest + filename;
		},

		addComponentContent: function(content, json, index) {
			if (json && json.data && index !== null) {
				content = methods.addClasses(content, json.data[index]);
				content = methods.replaceContent(content, json.data[index]);
			}

			return content;
		},

		replaceContent: function(content, json) {
			var pattern,
				matcher,
				replReg;

			for (i in json) {
				if (json.hasOwnProperty(i) && (i != 'classRegex') && (i != 'classToAdd')) {
					pattern = new RegExp('{%' + i + '%}', 'g');
					matcher = content.match(pattern);


					if (matcher) {
						replReg = new RegExp(matcher[0] + '+', 'g');
						content = content.replace(replReg, json[i]);
					}
				}
			}

			return content;
		},

		addClasses: function(content, json) {
			var pattern = new RegExp(json.classRegex),
				matcher = content.match(pattern);

			if (json.classToAdd && matcher) {
				content = content.replace(matcher[0], matcher[0] + ' ' + json.classToAdd);
			}

			return content;
		}
	}

	return methods;
};