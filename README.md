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
        options: {
          vars: {},
          assetsPath: {
            templates: '',
            components: ''
          }
        },
        src: 'tmp/templates/**.html',
        dest: 'tmp/generated/templates/',
        components_src: 'tmp/components/',
        components_dest: 'tmp/generated/components/'
      }
    }
});
```

### Options

#### options.vars
Type: `Object`
Default value: `{}`

Here you can set many different vars to be used in your templates/components

#### options.assetsPath
Type: `Object`
Default value: `{
  templates: '',
  components: ''
}`

You can define different path for your assets if your templates and components will be in different paths

### Usage Examples

#### Default Options
In this example, the default options will get templates from templates path (src) and generate templates on destination path (dest). The components path must be set.

```js
grunt.initConfig({
  cc_templates_generator: {
      default_options: {
        options: {
          vars: {},
          assetsPath: {
            templates: '',
            components: ''
          }
        },
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
 * 2014-02-05   v0.2.0   Improve template generation
 * 2014-02-05   v0.2.1   Enable uses of variables
 * 2014-02-06   v0.2.2   Different paths for templates and components can be set
 * 2014-02-06   v0.2.3   Remove logs
 * 2014-02-06   v0.2.4   Bugfix
 * 2014-02-06   v0.2.5   Bugfix
 * 2014-02-06   v0.2.6   Remove components folder before generate again
 * 2014-02-06   v0.2.7   Create list of components
 * 2014-02-07   v0.2.8   Create list of components using iframes
 * 2014-02-07   v0.2.9   Better output for index
 * 2014-02-07   v0.3.0   Remove code tags from components
 * 2014-02-07   v0.3.1   Fix publish issue
 * 2014-02-07   v0.3.2   Bugfix
 * 2014-02-07   v0.3.3   Remove unnecessary code
 * 2014-02-07   v0.3.4   Improve index generation
 * 2014-02-07   v0.3.5   Force files deletion outside grunt context
 * 2014-03-18   v0.3.6   Recursive mode: component could be called from other component