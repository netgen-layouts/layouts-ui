'use strict';

var _ = require('underscore');

// Override Handlebars default name lookup
var Handlebars = require('handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;

var helpers = require('./app/scripts/helpers');

var known_helpers = {};
for (var k in helpers) {
  known_helpers[k] = true;
}

JavaScriptCompiler.prototype.nameLookup = function(parent, name /* , type*/ ) {
  return "Handlebars.r(" + parent + ",'" + name + "')";
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var grunt_config = 'grunt.json';
  if (!grunt.file.exists(grunt_config)) {
    grunt.file.copy(grunt_config + '.dist', grunt_config)
    throw new Error('Please fill in the ' + grunt_config +' file in the root directory and run Grunt again.');
  }

  var config = {
    app: 'app',
    dist: 'bundle/Resources/public',
    dev:  'bundle/Resources/public/dev',
    local: grunt.file.readJSON(grunt_config)
  };

  grunt.initConfig({
    config: config,

    watch: {
      browserify_vendor: {
        files: ['node_modules/@netgen/content-browser-ui/app/scripts/**/*.js'],
        tasks: ['browserify:dev']
      },

      browserify: {
        files: ['<%= config.app %>/scripts/**/*.js'],
        tasks: ['browserify:dev']
      },

      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}', 'node_modules/@netgen/content-browser-ui/app/styles/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev']
      },

      handlebars: {
        files: ['<%= config.app %>/templates/**/*.hbs'],
        tasks: ['handlebars']
      }
    },

    browserSync: {
      options: {
        open: false,
        watchTask: true,
        startPath: config.local.start_path,
        proxy: config.local.domain
      },

      dev: {
        bsFiles: {
          src: [
            '<%= config.dev %>/js/*.js',
            '<%= config.dev %>/css/*.css',
            '../layouts-core/bundles/LayoutsAdminBundle/Resources/views/app/**/*.twig',
            '../layouts-core/bundles/LayoutsBundle/Resources/views/**/*.twig'
          ]
        }
      }
    },

    clean: {
      dev: '<%= config.dev %>',
      dist: '<%= config.dist %>'
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
            return filename
              .replace(/^app\/templates\//, '')
              .replace(/\.hbs$/, '');
          }
        }
      }
    },

    sass: {
      options: {
        implementation: require('node-sass'),
        includePaths: ['.']
      },

      dev: {
        options: {
          sourceMap: true,
          sourceMapEmbed: true,
          sourceMapContents: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.dev %>/css',
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
            remove: false
          })
        ]
      },

      dev: {
        src: '<%= config.dev %>/css/*.css'
      },

      dist: {
        src: '<%= config.dist %>/css/*.css'
      }
    },

    browserify: {
      dev: {
        src: ['<%= config.app %>/scripts/main.js'],
        dest: '<%= config.dev %>/js/netgen-layouts.js',
        options: {
          browserifyOptions: {
            debug: true,
            insertGlobalVars: {
              process: function() {
                return JSON.stringify({env: 'development'});
              },
            },
          }
        }
      },

      dist: {
        src: ['<%= config.app %>/scripts/main.js'],
        dest: '<%= config.dev %>/js/netgen-layouts.js',
        options: {
          require: ['@netgen/content-browser-ui'],
          browserifyOptions: {
            insertGlobalVars: {
              process: function() {
                return JSON.stringify({env: 'production'});
              },
            },
          },
        }
      }
    },

    uglify: {
      dist: {
        options: {
          compress: {
            drop_console: true,
            inline: false,
          }
        },
        src: '<%= config.dev %>/js/netgen-layouts.js',
        dest: '<%= config.dist %>/js/netgen-layouts.js'
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
            cwd: 'node_modules/ckeditor4',
            src: '**',
            dest: '<%= config.dist %>/vendor/ckeditor'
          },
          {
            expand: true,
            cwd: 'node_modules/@netgen/content-browser-ui/bundle/Resources/public/media',
            src: '**',
            dest: '<%= config.dist %>/media'
          }
        ]
      },

      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            'fonts/**/{,*/}*.{eot,svg,ttf,woff,woff2}'
          ]
        }]
      }
    },

    shell: {
      dev: {
        command: [
          'ln -s ../../../../node_modules/@netgen/content-browser-ui/bundle/Resources/public/media <%= config.dev %>/media',
          'ln -s ../../../../app/fonts <%= config.dev %>/fonts',
          'ln -s ../../../../app/images <%= config.dev %>/images'
        ].join('\n')
      }
    },

    concurrent: {
      dev: [
        'browserify:dev',
        'sass:dev'
      ],

      dist: [
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
      'browserSync:dev',
      'watch'
    ]);
  });

  grunt.registerTask('fast_build', function() {
    grunt.task.run([
      'clean:dev',
      'handlebars',
      'concurrent:dev',
      'postcss:dev',
      'shell:dev'
    ]);
  });

  grunt.registerTask('build', function() {
    grunt.task.run([
      'clean:dist',
      'handlebars',
      'copy:vendor',
      'concurrent:dist',
      'postcss:dist',
      'copy:dist',
      'uglify:dist'
    ]);
  });

  grunt.registerTask('default', ['server']);
};
