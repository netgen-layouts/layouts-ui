// Generated on 2013-07-23 using generator-webapp 0.2.6
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/
var Handlebars = require('handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;

var helpers = require('./app/scripts/core-ui/helpers');

var known_helpers = {};
for(var k in helpers){ known_helpers[k] = true ;}
//console.log("KNOWN HELPERS", known_helpers);


JavaScriptCompiler.prototype.nameLookup = function(parent, name /* , type*/) {
  return "Handlebars.r("+parent +",'"+name+"')";
};

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/


// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
      app: 'app',
      dist: 'Resources/public'
    };


    grunt.initConfig({
        yeoman: yeomanConfig,
        pkg: grunt.file.readJSON('package.json'),

        yuidoc: {
          compile: {
            name: '<%= pkg.name %>',
            description: '<%= pkg.description %>',
            version: '<%= pkg.version %>',
            url: '<%= pkg.homepage %>',
            options: {
              linkNatives: true,
              paths: '<%= yeoman.app %>/scripts',
              outdir: 'docs/'
            }
          }
        },
        watch: {
          //  yuidoc: {
          //    files: '<%= yeoman.app %>/scripts/{,*/}*.js',
          //    tasks: ['yuidoc']
          //  },
            browserify: {
              files: ['<%= yeoman.app %>/scripts/**/*.js'],
              tasks: ['browserify:dev']
            },
            sass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server', 'postcss:server']
            },
            handlebars: {
                files: ['<%= yeoman.app %>/templates/**/*.hbs', 'tests/templates/**/*.hbs'],
                tasks: ['handlebars']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',

                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            proxies: [

                {
                  context: ['/bm', '/cb', '/var'],
                  host: 'bm.lan',
                  changeOrigin: true,
                  headers: {
                    host: 'bm.lan'
                  }
                }

            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            //lrSnippet,
                            mountFolder(connect, '.'),
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            mountFolder(connect, yeomanConfig.dist)
                        ];
                    }
                }
            }
        },


        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/vendor',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },

        handlebars: {
            compile: {
                files: {
                    '<%= yeoman.app %>/scripts/templates.js': '<%= yeoman.app %>/templates/**/*.hbs'
                    //, 'tests/test_templates.js': 'tests/templates/**/*.hbs'
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
              cwd: '<%= yeoman.app %>/styles',
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
              cwd: '<%= yeoman.app %>/styles',
              src: ['*.{scss,sass}'],
              dest: '<%= yeoman.dist %>/css',
              ext: '.css'
            }]
          }
        },

        postcss: {
          options: {
            map: true,
            processors: [
              require('autoprefixer')({browsers: 'last 3 versions'})
            ]
          },
          server: {
            src: '.tmp/styles/*.css'
          },

          dist: {
            src: '<%= yeoman.dist %>/css/*.css'
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
            src: ['<%= yeoman.app %>/scripts/main.js'],
            dest: '.tmp/scripts/main.js',
            options: {
              debug: true,
              external: ['jquery', 'jquery-ui'],
              browserifyOptions:{
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
            src: ['<%= yeoman.app %>/scripts/main.js'],
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
            dest: '<%= yeoman.dist %>/js/main.js'
          }
        },

        filerev: {
          files: {
            src: [
              '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}', //TODO: fix reving images in HTML templates
              '<%= yeoman.dist %>/scripts/{,*/}*.js',
              '<%= yeoman.dist %>/styles/{,*/}*.css',
              '<%= yeoman.dist %>/fonts/**/{,*/}*.{eot,svg,ttf,woff}',
              '<%= yeoman.dist %>/locales/*'
            ]
          }
        },


        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },


        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.json',
                        // '*.html',
                        'data/*',
                        'locales/*',
                        'includes/*',
                        'images/{,*/}*.{webp,gif}',
                        'fonts/**/{,*/}*.{eot,svg,ttf,woff}'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
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
        },

        bower: {
            options: {
              exclude: ['sass-bootstrap']
            },
            all: {
              rjsConfig: '<%= yeoman.app %>/scripts/main.js'
            }
        }
    });

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', /*'open',*/ 'configureProxies:server', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'fast_build',
            'configureProxies:server',
            'connect:livereload',
            'watch'
        ]);
    });


    grunt.registerTask('fast_build', function () {
      grunt.task.run([
        'clean:server',
        'concurrent:server',
        'postcss:server'
      ]);
    });



    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', function(target){
      target || (target = 'development');
      grunt.task.run([
        'clean:dist',
        'gitinfo',
        'concurrent:dist',
        'uglify:dist',
        'postcss:dist',
        'copy:dist',
        // 'filerev',
        // 'manifest',
        // 'clean:after_build',
      ]);

    });


    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);

};
