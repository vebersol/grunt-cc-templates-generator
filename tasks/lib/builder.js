exports.init = function Builder(grunt, options) {
	var methods,
		fs = require('fs'),
		core = require('./core').init(grunt, options),
		templates = require('./templates').init(grunt, options),
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
			methods.dest = core.getFilename(src, f.dest);
			methods.components = f.components_src;

			templates.generate(src, f);
		},

		generateComponent: function() {
			var sourceFiles = {};
			grunt.file.recurse(methods.f.components_src, function(abspath, rootdir, subdir, filename) {
				var data = grunt.file.read(abspath, {
					encoding: 'utf-8'
				}),
					jsonPath = filename.match('.html') ? methods.f.components_src + 'data/' + filename.replace('.html', '.json') : null,
					json = jsonPath ? core.loadJSON(jsonPath) : null,
					content;

				data = core.replaceVars(data);

				if (json && json.data && json.data.length > 0) {
					content = templates.replaceContent(data, json.data[0], true);

					if (content) {
						methods.writeComponent(filename, content);
					}
				} else if (filename.match('\.html')) {
					data = core.replaceAssetsPath(data, true);
					methods.writeComponent(filename, data);
				} else {
					methods.copyFile(subdir, filename);
				}

				if (filename.match('\.html')) {
					sourceFiles[filename] = data;
				}
			});

			methods.filterComponentsSource(sourceFiles);
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

		clean: function(path) {
			if (grunt.file.exists(path)) {
				grunt.log.ok('Components path removed:  "' + path);
				grunt.file.delete(path);
			}
		},

		filterComponentsSource: function(sources) {
			var i,
				cstr = '<body>',
				start,
				end,
				components = [],
				out;
			for (i in sources) {
				if (sources.hasOwnProperty(i)) {
					out = "<!-- " + i + " -->\n";
					out += '<h1 class="DAWCL-content-list-title">' + i + '</h1>';
					bodyTag = sources[i].match(/<body.*>/g);
					start = sources[i].search(bodyTag[0]) + bodyTag[0].length;
					end = sources[i].indexOf('</body>');

					out += sources[i].substring(start, end);
					out = out.replace(/(\<script (.*)\>([\s\S.]*)\<\/script\>)/gi, '');

					components.push(out);
				}
			}

			methods.writeIndex(components);
		},

		writeIndex: function(components) {
			var template = grunt.file.read(methods.f.components_dest + 'template.html', {
				encoding: 'utf-8'
			}),
				html = template.replace(/<body[^>]*>((.|[\n\r])*)<\/body>/im, components.join(' ')),
				filepath = methods.f.components_dest + 'index.html';

			grunt.file.write(filepath, html);
			grunt.log.ok('File "' + filepath + '" created.');
		}
	}

	return methods;
};