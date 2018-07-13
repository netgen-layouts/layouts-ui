'use strict';

var _ = require('underscore');

// Override Handlebars default name lookup
var Handlebars = require('handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;

var helpers = require('@netgen/layouts-core-ui/app/scripts/helpers');
var project_helpers = require('./app/scripts/lib/handlebars/helpers');
var all_helpers = _.extend({}, helpers, project_helpers);

var known_helpers = {};
for (var k in all_helpers) {
  known_helpers[k] = true;
}

JavaScriptCompiler.prototype.nameLookup = function(parent, name /* , type*/ ) {
  return "Handlebars.r(" + parent + ",'" + name + "')";
};

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.loadNpmTasks('intern');

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

    intern: {
      unit: {
        options: {
          runType: 'client', // console /  nodejs
          config: 'tests/intern',
          reporters: [ 'Console', { id: 'LcovHtml', directory: 'tests/coverage' } ],
          suites: [ 'tests/unit/**/*' ]
        }
      },

      functional: {
        options: {
          proxyUrl: config.local.test_domain + ':3005/' + config.local.test_start_path + '/',
          runType: 'runner', // browsers
          config: 'tests/intern',
          reporters: [ 'Runner'],
          functionalSuites: [ 'tests/functional/**/*' ]
        }
      }
    },

    selenium_standalone: {
      options: {
        stopOnExit: true
      },

      dev: {
        seleniumVersion: '2.49.1',
        seleniumDownloadURL: 'http://selenium-release.storage.googleapis.com',
        drivers: {
          chrome: {
            version: '2.21',
            arch: process.arch,
            baseURL: 'http://chromedriver.storage.googleapis.com'
          },
          ie: {
            version: '2.53.0',
            arch: 'ia32',
            baseURL: 'http://selenium-release.storage.googleapis.com'
          }
        }
      }
    },

    watch: {
      browserify_vendor: {
        files: ['node_modules/@netgen/layouts-core-ui/app/scripts/**/*.js', 'node_modules/@netgen/content-browser-ui/app/scripts/**/*.js'],
        tasks: ['browserify:dev']
      },

      browserify: {
        files: ['<%= config.app %>/scripts/**/*.js'],
        tasks: ['browserify:dev']
      },

      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}', 'node_modules/@netgen/layouts-core-ui/app/styles/**/*.scss', 'node_modules/@netgen/content-browser-ui/app/styles/**/*.scss'],
        tasks: ['sass:dev', 'postcss:dev']
      },

      handlebars: {
        files: ['<%= config.app %>/templates/**/*.hbs', 'tests/templates/**/*.hbs'],
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
            '../block-manager/bundles/BlockManagerAdminBundle/Resources/views/app/**/*.twig',
            '../block-manager/bundles/BlockManagerBundle/Resources/views/**/*.twig'
          ]
        }
      },

      test: {
        options: {
          port: 3005,
          ghostMode: false,
          watchTask: true,
          notify: false,
          startPath: config.local.test_start_path,
          proxy: config.local.test_domain
        }
      }
    },

    clean: {
      dev: '<%= config.dev %>',
      vendor: '<%= config.dist %>/vendor',
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
            browsers: 'last 3 versions',
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
          require: ['@netgen/layouts-core-ui'],
          browserifyOptions: {
            debug: true
          }
        }
      },

      dist: {
        src: ['<%= config.app %>/scripts/main.js'],
        dest: '<%= config.dev %>/js/netgen-layouts.js',
        options: {
          require: ['@netgen/layouts-core-ui', '@netgen/content-browser-ui']
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
            cwd: 'node_modules/ckeditor',
            src: '**',
            dest: '<%= config.dist %>/vendor/ckeditor'
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
      fixtures: {
        command: 'tests/load_fixtures.sh <%= config.local.db.host %> <%= config.local.db.user %> <%= config.local.db.password %> <%= config.local.db.name %>'
      },

      dev: {
        command: [
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
        'copy:vendor',
        'imagemin',
        'svgmin'
      ]
    }
  });

  grunt.registerTask('npm_to_vendor', [
    'clean:vendor',
    'copy:vendor'
  ]);

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
      'concurrent:dist',
      'postcss:dist',
      'copy:dist',
      'uglify:dist'
    ]);
  });

  // To use, install Selenium
  // grunt selenium_standalone:dev:install
  grunt.registerTask('test', function(target) {
    var tasks = [];

    if(!target || target == 'unit'){
      tasks.push('intern:unit');
    }

    if(!target || target == 'functional'){
      tasks.push('shell:fixtures');
      tasks.push('fast_build');
      tasks.push('browserSync:test');
      tasks.push('selenium_standalone:dev:start');
      tasks.push('intern:functional');
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('default', ['server']);
};
