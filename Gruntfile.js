// Generated on 2013-07-23 using generator-webapp 0.2.6
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

/* OVERRIDE HANDLEBARS DEFAULT NAME LOOKUP ========================================================================================================*/
var Handlebars = require('grunt-contrib-handlebars/node_modules/handlebars/lib/index');
var JavaScriptCompiler = Handlebars.JavaScriptCompiler;

var helpers = require('./app/scripts/helpers');

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
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
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
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
                  context: '/pdf',
                  host: 'htmlpdfapi.com',
                  changeOrigin: true,
                  headers: {
                    host: 'htmlpdfapi.com',
                    Authentication: 'Token ClwRiwn-LCN_otqr4QA8YXEpV9Vj80u8'
                  },
                  rewrite: {
                    '^/pdf': '/api/v1/pdf'
                  }
                },


                {
                  context: ['/token', '/api'],
                  host: 'smv02.poslovna.hr',
                  changeOrigin: true,
                  headers: {
                    host: 'smv02.poslovna.hr'
                  }
                }

            ],
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            require('grunt-connect-proxy/lib/utils').proxyRequest,
                            lrSnippet,
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
                  amd: true,
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

        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                generatedImagesDir: '.tmp/images/generated',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: 'bower_components',
                httpImagesPath: '../images',
                httpGeneratedImagesPath: '/images/generated',
                httpFontsPath: '/styles/fonts',
                relativeAssets: false
            },
            dist: {},
            server: {
                options: {
                    sourcemap: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/

        /**
         * Example build file
         * https://github.com/jrburke/r.js/blob/master/build/example.build.js
         */
        requirejs: {
            options: {
                // `name` and `out` is set by grunt-usemin
                name: '../../bower_components/almond/almond',
                include: ['main'],
                mainConfigFile: '<%= yeoman.app %>/scripts/main.js',
                out: '<%= yeoman.dist %>/scripts/main.js',
                //out: '.tmp/scripts/main.js',
                baseUrl:  '<%= yeoman.app %>/scripts',
                optimize: 'uglify2',
                // TODO: Figure out how to make sourcemaps work with grunt-usemin
                // https://github.com/yeoman/grunt-usemin/issues/30
                generateSourceMaps: true,
                // required to support SourceMaps
                // http://requirejs.org/docs/errors.html#sourcemapcomments
                preserveLicenseComments: false,
                useStrict: true,
                wrap: true,
                uglify2: {
                    /*
                    output: {
                        beautify: true
                    },
                    */
                    compress: {
                        drop_console: true,
                        drop_debugger: true
                    }
                } // https://github.com/mishoo/UglifyJS2
            },

            staging: {
              options:{
                paths: {
                  "env": 'environments/staging'
                }
              }
            },

            development: {
              options: {
                paths: {
                  "env": 'environments/development'
                }
              }
            }

        },
        filerev: {

            files: {
                src: [
                    '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}', //TODO: fix reving images in HTML templates
                    '<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%= yeoman.dist %>/styles/fonts/**/{,*/}*.{eot,svg,ttf,woff}',
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
                timestamp: false,
                // master: ['*']
              },
              src: [
                '*.html',
                '*.json',
                'images/*',
                'locales/*',
                'scripts/*.js',
                'styles/*.css',
                'styles/fonts/**/{,*/}*.{eot,svg,ttf,woff}'
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
                        'locales/*',
                        'includes/*',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/**/{,*/}*.{eot,svg,ttf,woff}'
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
              'compass'
            ],
            test: [

            ],
            dist: [
                'handlebars',
                'compass',
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
            'concurrent:server',
            'configureProxies:server',
            'connect:livereload',
            'handlebars',
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
