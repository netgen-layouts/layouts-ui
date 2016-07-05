// Generated on 2013-07-23 using generator-webapp 0.2.6
'use strict';

var _ = require('underscore');
var proxyMiddleware = require('http-proxy-middleware');

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/
var Handlebars = require('handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;

var helpers = require('./app/scripts/core-ui/helpers');
var project_helpers = require('./app/scripts/lib/handlebars/helpers');

var all_helpers = _.extend({}, helpers, project_helpers);
var known_helpers = {};

for (var k in all_helpers) {
  known_helpers[k] = true;
}



JavaScriptCompiler.prototype.nameLookup = function(parent, name /* , type*/ ) {
  return "Handlebars.r(" + parent + ",'" + name + "')";
};

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var local_config = 'local_config.json';
  if (!grunt.file.exists(local_config)) {
    grunt.file.copy(local_config + '.example', local_config)
    throw new Error('Please fill ' + local_config + ' in directory of Gruntfile.js');
  }

  // configurable paths
  var config = {
    app: 'app',
    dist: 'Resources/public',
    local: grunt.file.readJSON(local_config)
  };


  grunt.initConfig({
    config: config,
    pkg: grunt.file.readJSON('package.json'),

    watch: {

      browserify: {
        files: ['<%= config.app %>/scripts/**/*.js'],
        tasks: ['browserify:dev']
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'postcss:server']
      },
      handlebars: {
        files: ['<%= config.app %>/templates/**/*.hbs', 'tests/templates/**/*.hbs'],
        tasks: ['handlebars']
      }
    },


    browserSync: {
      bsFiles: {
        src: [
          '.tmp/scripts/*.js',
          '.tmp/styles/*.css',
          '../block-manager/bundles/BlockManagerAdminBundle/Resources/views/app/**/*.twig',
          '../block-manager/bundles/BlockManagerBundle/Resources/views/**/*.twig'
        ]
      },
      options: {
        open: false,
        watchTask: true,
        startPath: 'bm/dev/app',
        proxy: config.local.domain
      }
    },



    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/vendor',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp',
      vendor: [
        '<%= config.dist %>/vendor/alloy-editor'
      ]
    },

    handlebars: {
      compile: {
        files: {
          '<%= config.app %>/scripts/templates.js': '<%= config.app %>/templates/**/*.hbs'
        },
        options: {
          compilerOptions: {
            knownHelpers: known_helpers,
            knownHelpersOnly: true
          },
          commonjs: true,
          wrapped: true,
          processPartialName: function(filename) {
            return filename
              .replace(/^app\/templates\//, '')
              .replace(/_(\w+)\.hbs$/, '$1');
          },
          processName: function(filename) {
            // funky name processing here
            return filename
              .replace(/^app\/templates\//, '')
              .replace(/\.hbs$/, '');
          }
        }
      }
    },

    sass: {
      options: {
        includePaths: ['.']
      },
      server: {
        options: {
          sourceMap: true,
          sourceMapEmbed: true,
          sourceMapContents: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      dist: {
        options: {
          sourceMap: false,
          sourceMapEmbed: false,
          sourceMapContents: false,
          outputStyle: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dist %>/css',
          ext: '.css'
        }]
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
            browsers: 'last 3 versions'
          })
        ]
      },
      server: {
        src: '.tmp/styles/*.css'
      },

      dist: {
        src: '<%= config.dist %>/css/*.css'
      }
    },

    browserify: {

      vendor: {
        src: [],
        dest: '.tmp/scripts/vendor.js',
        options: {
          debug: true,
          require: ['jquery', 'jquery-ui']
        }
      },

      dev: {
        src: ['<%= config.app %>/scripts/main.js'],
        dest: '.tmp/scripts/main.js',
        options: {
          debug: true,
          external: ['jquery', 'jquery-ui'],
          browserifyOptions: {
            debug: true
          },
          alias: {
            'core': './app/scripts/core-ui/core.js',
            'core_boot': './app/scripts/core-ui/core_boot.js',
            'core_tree': './app/scripts/core-ui/models/mixin/tree.js',
            'core_pager': './app/scripts/core-ui/components/pager.js',
            'browser': './app/scripts/browser-ui/main.js'
          }
        },
      },

      dist: {
        src: ['<%= config.app %>/scripts/main.js'],
        dest: '.tmp/scripts/main.js',
        options: {
          require: ['jquery', 'jquery-ui'],
          alias: {
            'core': './app/scripts/core-ui/core.js',
            'core_boot': './app/scripts/core-ui/core_boot.js',
            'core_tree': './app/scripts/core-ui/models/mixin/tree.js',
            'core_pager': './app/scripts/core-ui/components/pager.js',
            'browser': './app/scripts/browser-ui/main.js'
          }
        }
      }
    },


    uglify: {
      dist: {
        options: {
          compress: {
            drop_console: true
          }
        },
        src: '.tmp/scripts/main.js',
        dest: '<%= config.dist %>/js/main.js'
      }
    },


    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },


    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{webp,gif}',
            'fonts/**/{,*/}*.{eot,svg,ttf,woff}'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= config.dist %>/images',
          src: [
            'generated/*'
          ]
        }]
      },


      vendor: {
        files: [
          {
            expand: true,
            cwd: 'node_modules/ace-builds/src-min-noconflict',
            src: '**',
            dest: '<%= config.dist %>/vendor/ace-editor'
          },
          {
            expand: true,
            cwd: 'node_modules/alloyeditor/dist/alloy-editor',
            src: '**',
            dest: '<%= config.dist %>/vendor/alloy-editor'
          }
        ]
      }

    },


    concurrent: {
      server: [
        'handlebars',
        'sass:server',
        'browserify:vendor',
        'browserify:dev'
      ],
      test: [

      ],
      dist: [
        'handlebars',
        'browserify:dist',
        'sass:dist',
        'imagemin',
        'svgmin'
      ]
    }
  });

  grunt.registerTask('server', function() {
    grunt.task.run([
      'fast_build',
      'browserSync',
      'watch'
    ]);
  });


  grunt.registerTask('fast_build', function() {
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'postcss:server'
    ]);
  });


  grunt.registerTask('build', function() {
    grunt.task.run([
      'clean:dist',
      'gitinfo',
      'concurrent:dist',
      'uglify:dist',
      'postcss:dist',
      'copy:dist'
    ]);

  });



  grunt.registerTask('npm_to_vendor', [
    'clean:vendor',
    'copy:vendor'
  ]);


  grunt.registerTask('default', ['server']);

};
