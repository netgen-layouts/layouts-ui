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
        dist: 'dist',
        releases: 'releases',
        hidden_folder: 'dist/scripts/e3b0c44298fc1c149afbf4'
    };


    grunt.registerTask('foo', 'A sample task that logs stuff.', function() {
      console.log(grunt.filerev.summary);
    });

    grunt.initConfig({
        yeoman: yeomanConfig,
        pkg: grunt.file.readJSON('package.json'),

        // oneskyoutput: {
        //   oneskyoutput: {
        //     default_options: {
        //       platformId: '25669',
        //       path: '<%= yeoman.app %>/locales'
        //     }
        //   },
        // },

        karma: {
          unit: {
            configFile: 'karma.conf.js',
            options: {
              files: [
                {pattern: 'bower_components/*/*.js', included: false},
                {pattern: 'app/scripts/**/*.js', included: false},
                {pattern: 'tests/test_templates.js', included: false},
                {pattern: 'tests/unit/**/*.js', included: false},
                {pattern: 'tests/fixtures/**/*.js', included: false},
                'tests/test-main.js'
              ],

              // test results reporter to use
              // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
              reporters: ['progress', 'coverage'],

              coverageReporter: {
                dir : 'coverage/'
              },

              preprocessors: {
                'app/scripts/**/*.js': 'coverage'
              }

            }
          }
        },

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
              tasks: ['browserify:dev', 'concat:dev']
            },
            sass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass:server']
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
        open: {
            server: {
                path: 'http://aseba.lan/'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        'releases/*',
                        '!releases/.htaccess',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            after_build: ['<%= yeoman.dist %>/includes'],
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
            sourceMap: true,
            sourceMapEmbed: true,
            sourceMapContents: true,
            includePaths: ['.']
          },
          server: {
            files: [{
              expand: true,
              cwd: '<%= yeoman.app %>/styles',
              src: ['*.{scss,sass}'],
              dest: '.tmp/styles',
              ext: '.css'
            }]
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
              }
            },
          }
        },
        concat: {
          dev: {
            src: ['.tmp/scripts/vendor.js', '.tmp/scripts/main.js'],
            dest: '<%= yeoman.app %>/bundle.js',
            options: {
              // It includes semicolon.js!
              // This is needed to prevent the two concatenated IIFE's fro each bundle being
              // interpreted as a function call
              separator: ';\n'
            }
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


         manifest: {
            generate: {
              options: {
                basePath: '<%= yeoman.dist %>',
                //network: ['http://*', 'https://*'],
                //fallback: ['/ /offline.html'],
                //exclude: ['js/jquery.min.js'],
                preferOnline: true,
                verbose: false,
                hash: false,
                timestamp: true
                // master: ['*']
              },
              src: [
                '*.html',
                '*.json',
                'images/*',
                'locales/*',
                'scripts/*.js',
                'styles/*.css',
                'fonts/**/{,*/}*.{eot,svg,ttf,woff}'
              ],
              dest: '<%= yeoman.dist %>/manifest.appcache'
            }
          },



        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images'],
                patterns:{
                    js: [
                        [
                            /["'](images\/[^'"\)#]+)(#.+)?["']/gm,
                            'Replacing images'
                        ],
                        [
                            /["'](locales\/[^'"\)#]+)(#.+)?["']/gm,
                            'Replacing locales'
                        ],
                        [
                            /["'](styles\/[^'"\)#]+)(#.+)?["']/gm,
                            'Replacing styles'
                        ]
                    ]
                }
            },
            html: ['<%= yeoman.dist %>/*.html'],
            css: ['<%= yeoman.dist %>/styles/*.css'],
            js: ['<%= yeoman.dist %>/scripts/*.js']
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
        cssmin: {
            // This task is pre-configured if you do not wish to use Usemin
            // blocks for your CSS. By default, the Usemin block from your
            // `index.html` will take care of minification, e.g.
            //
            //     <!-- build:css({.tmp,app}) styles/main.css -->
            //
            // dist: {
            //     files: {
            //         '<%= yeoman.dist %>/styles/main.css': [
            //             '.tmp/styles/{,*/}*.css',
            //             '<%= yeoman.app %>/styles/{,*/}*.css'
            //         ]
            //     }
            // }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },


        preprocess : {
            options: {
                inline: true,
                context : {
                    DEBUG: false,
                    VERSION: '<%= pkg.version %>'
                }
            },
            html : {
                src : [
                    '<%= yeoman.dist %>/index.html'
                ]
            }
        },

        replace: {
          remove_sourcemap_comment: {
            src: ['<%= yeoman.dist %>/scripts/*.js'],
            overwrite: true,                 // overwrite matched source files
            replacements: [{
              from: /\/\/#.*/,
              to: ''
            }]
          },
          manifest: {
            src: ['<%= yeoman.dist %>/index.html'],
            overwrite: true,                 // overwrite matched source files
            replacements: [{
              from: 'data-manifest',
              to: 'manifest'
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
                        '*.html',
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

        shell: {
            options: {
                stderr: false
            },

            translations_download: {
                command: 'ruby onesky.rb download'
            },

            translations_upload: {
                command: 'ruby onesky.rb upload'
            },

            read_file_name: {
                command: 'ls <%= yeoman.dist %>/scripts/*.main.js',
                options: {
                    callback: function(err, stdout, stderr, cb){
                        var name = stdout.match(/\w+\.main\.js/)[0];
                        grunt.config.set('main_js_file_name', name);
                        console.log(name);
                        cb();
                    }
                }
            },
            move_source_file: {
                command: [
                    'mkdir -p <%= yeoman.hidden_folder %>',
                    'mv <%= yeoman.dist %>/scripts/*.js.map <%= yeoman.hidden_folder %>/'
                ].join(' && ')
            }
        },

        concurrent: {
            server: [
              'sass',
              'browserify:vendor',
              'browserify:dev'
            ],
            test: [

            ],
            dist: [
                'handlebars',
                'browserify',
                'sass',
                'imagemin',
                'svgmin'
                // 'shell:translations_download'
            ]
        },

        compress: {
          main: {
            options: {
              archive: 'releases/<%= gitinfo.local.branch.current.name  %>/dist_<%= gitinfo.local.branch.current.shortSHA %>.zip'
            },
            files: [
              {src: ['<%= yeoman.dist %>/**'] }, // includes files in path and its subdirs
            ]
          }
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
            'clean:server',
            'handlebars',
            'concurrent:server',
            'concat:dev',
            'configureProxies:server',
            'connect:livereload',
            //'open',
            'watch'
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
        'useminPrepare',
        'requirejs:'+target,
        'concat',
        'cssmin',
        'copy:dist',
        'preprocess:html',
        'filerev',
        'usemin',
        'replace',
        'sourcemaps',
        'manifest',
        'htmlmin',
        'clean:after_build',
        'compress'
      ]);

    });


    grunt.registerTask('sourcemaps', [
        'shell:move_source_file'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);

};
