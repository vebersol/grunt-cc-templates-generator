# grunt-cc-templates-generator

> A plugin that generates templates based on components.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cc-templates-generator --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-cc-templates-generator');
```

## The "cc_templates_generator" task

### Overview
In your project's Gruntfile, add a section named `cc_templates_generator` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cc_templates_generator: {
      default_options: {
        options: {},
        src: 'tmp/templates/**.html',
        dest: 'tmp/generated/templates/',
        components_src: 'tmp/components/',
        components_dest: 'tmp/generated/components/'
      }
    }
});
```

### Options

Currently there are no options to be set

### Usage Examples

#### Default Options
In this example, the default options will get templates from templates path (src) and generate templates on destination path (dest). The components path must be set.

```js
grunt.initConfig({
  cc_templates_generator: {
      default_options: {
        options: {},
        src: 'tmp/templates/**.html',
        dest: 'tmp/generated/templates/',
        components_src: 'tmp/components/',
        components_dest: 'tmp/generated/components/'
      }
    }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 * 2014-02-04   v0.1.0   First commit
 * 2014-02-05   v0.1.1   Buider functionality
