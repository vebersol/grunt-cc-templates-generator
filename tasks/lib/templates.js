exports.init = function Templates(grunt, options) {
	var methods,
		html,
		core = require('./core').init(grunt, options);

	methods = {
		src: '',
		f: '',
		generate: function(src, f) {
			methods.src = src;
			methods.f = f;
			methods.dest = core.getFilename(src, f.dest);
			methods.components = f.components_src;

			var data = grunt.file.read(methods.src, {
				encoding: 'utf-8'
			});

			methods.outputData(data);
		},

		outputData: function(data) {
			html = core.replaceVars(data);
			methods.addTemplateComponents(html);
		},

		addTemplateComponents: function(data) {
			var matchers = data.match(/\{\{.*\}\}/g),
				componentsHTML = [];

			if (matchers) {
				for (i in matchers) {
					if (matchers.hasOwnProperty(i)) {
						componentsHTML.push(methods.getComponent(matchers[i]));
					}
				}

				methods.addComponent(componentsHTML, matchers);
			} else {
				methods.writeTemplate(data);
			}
		},

		addComponent: function(component, matchers) {
			for (var i = 0; i < matchers.length; i++) {
				var cleaned = core.cleanComponent(component[i]);
				html = html.replace(matchers[i], cleaned);
			}

			methods.writeTemplate(html);
		},

		writeTemplate: function(html) {
			grunt.file.write(methods.dest, html);
			grunt.log.ok('File "' + methods.dest + '" created.');
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
				json,
				matchAgain,
				i;


			data = grunt.file.read(path, {
				encoding: 'utf-8'
			});

			json = core.loadJSON(jsonPath);

			componentStart = data.indexOf(cstr) + cstr.length;
			componentEnd = data.indexOf('</COMPONENT>');
			componentHTML = data.substring(componentStart, componentEnd);
			componentHTML = methods.addComponentContent(componentHTML, json, index);

			matchAgain = componentHTML.match(/\{\{(.*)\}\}/);

			if (matchAgain) {
				componentHTML = componentHTML.replace(matchAgain[0], this.getComponent(componentHTML, true));
				componentHTML = methods.addComponentContent(componentHTML, json, index);
			}

			return componentHTML;
		},

		addComponentContent: function(content, json, index) {
			if (json && json.data && index !== null) {
				content = methods.addClasses(content, json.data[index]);
				content = methods.replaceContent(content, json.data[index]);
			} else {
				content = core.replaceAssetsPath(content);
			}

			return content;
		},

		replaceContent: function(content, json, isComponent) {
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

			content = core.replaceAssetsPath(content, isComponent);

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
	};

	return methods;
};