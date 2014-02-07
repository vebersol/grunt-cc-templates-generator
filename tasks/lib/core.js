exports.init = function Core(grunt, options) {
	var methods;

	methods = {
		replaceVars: function(html) {
			var path,
				regex,
				matcher;
			for (i in options.vars) {
				if (options.vars.hasOwnProperty(i)) {
					path = options.vars[i];
					if (path !== null) {
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

		replaceAssetsPath: function(html, isComponent) {
			var path = isComponent ? options.assetsPath.components : options.assetsPath.templates;

			if (path !== null) {
				regex = new RegExp('{#assetsPath#}', 'g');
				matcher = html.match(regex);

				if (matcher) {
					html = html.replace(regex, path);
				}
			}

			return html;
		},

		loadJSON: function(path) {
			if (grunt.file.exists(path)) {
				json = grunt.file.read(path);
				json = JSON.parse(json);
				return json;
			}
		},

		getFilename: function(src, dest) {
			var pathArr = src.split('/'),
				filename = pathArr[pathArr.length - 1];

			return dest + filename;
		},

		cleanComponent: function (html) {
			return html.replace(/<code[^>]*>((.|[\n\r])*)<\/code>/im, '---------------------------------------->>>>>>>>>>');
		}
	};

	return methods;
}