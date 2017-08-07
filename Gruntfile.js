module.exports = function(grunt)
{
  'use strict';

  var script_lib = [
  ];

  var style_lib = [
  ];

  var convertToBlade = false;

  //Get pug destination
  if ( convertToBlade ) {
    var pugDest = 'resources/pug/dist/';
    var pugTask = ['pug','copy:pug_php'];
  }
  else {
    var pugDest = 'public/';
    var pugTask = ['pug'];
  }

  //
  //Grunt config
  var gruntConfig = {
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - built on <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      views: 'views/',
      styles: 'resources/sass/',
      scripts: 'resources/js/',
      assets: '',
      public: 'public/',
      pug_cwd: 'resources/pug/',
      pug_cwd_public: 'resources/pug/public/',
      pug_files: '**/*.pug',
      pug_dest: pugDest,
      node_modules: './node_modules/'
    },

    browserify: {
      typescripts: {
        options: {
          plugin: ['tsify'],
          sourceType: 'module'
        },
        src: [
          '<%= meta.scripts %>ts/*.ts'
        ],
        dest: '<%= meta.scripts %>/dist/ts.js'
      },
      babelify: {
        options: {
          transform: [["babelify", { "presets": ["es2015"] }]]
        },
        src: [
          '<%= meta.scripts %>src/script-arif.js',
          '<%= meta.scripts %>src/script-bian.js'
        ],
        dest: '<%= meta.scripts %>/dist/main.js'
      },
      general: {
        src: [
          '<%= meta.scripts %>src/script-arif.js',
          '<%= meta.scripts %>src/script-bian.js'
        ],
        dest: '<%= meta.scripts %>/dist/main.js'
      }
    },

    babel: {
  		options: {
  			sourceMap: true,
  			presets: ['es2015']
  		},
  		dist: {
  			files: {
  				'<%= meta.scripts %>/dist/script-arif.js': '<%= meta.scripts %>/src/script-arif.js',
  				'<%= meta.scripts %>/dist/script-bian.js': '<%= meta.scripts %>/src/script-bian.js'
  			}
  		}
  	},

    concat: {
      css_libs: {
          src: style_lib,
          dest: '<%= meta.styles %>dist/libs.css',
      },
      css_general: {
          src: [
              '<%= meta.styles %>dist/libs.css',
              '<%= meta.styles %>vendors/*.css',
              '<%= meta.styles %>dist/styles.css'
          ],
          dest: '<%= meta.public %>css/styles.css',
      },
      npm_libs: {
          src: script_lib,
          dest: '<%= meta.scripts %>/dist/libs.js',
      },
      js_basic: {
        src: [
          '<%= meta.scripts %>/vendors/*.js',
          '<%= meta.scripts %>src/scripts.js'
        ],
        dest: '<%= meta.scripts %>/dist/general.js'
      },
      js_general: {
        src: [
          '<%= meta.scripts %>/dist/libs.js',
          '<%= meta.scripts %>/vendors/*.js',
          '<%= meta.scripts %>/dist/main.js'
        ],
        dest: '<%= meta.public %>js/scripts.js',
      }
    },

    uglify: {
      general: {
        src: '<%= meta.public %>js/scripts.js',
        dest: '<%= meta.public %>js/scripts.min.js'
      }
    },

    postcss: {
      options: {
        processors: [
          require('postcss-short')(),
          require('postcss-fontpath')(),
          require('autoprefixer')({
            browsers: ['last 2 versions', 'ie 6-8', 'Firefox > 20']
          })
        ]
      },
      dist: {
        src: '<%= meta.public %>css/*.css',
      }
    },

    sass: {
      basic: {
        options: {
          compass: true,
          sourcemap: 'none',
          style: 'expended'
        },
        files: [{
          expand: true,
          cwd: '<%= meta.styles %>src',
          src: ['*.sass', '*.scss'],
          dest: '<%= meta.styles %>dist',
          ext: '.css'
        }]
      }
    },

    cssnano: {
      options: {
        sourcemap: false,
        zindex: false
      },
      dist: {
        files: {
          '<%= meta.public %>css/styles.min.css': '<%= meta.public %>css/styles.css'
        }
      }
    },

    pug: {
      main: {
        options: {
          pretty: true,
          data: {
            debug: false
          }
        },
        files: [{
          expand: true,
          cwd: '<%= meta.pug_cwd_public %>',
          src: ['<%= meta.pug_files %>'],
          dest: '<%= meta.pug_dest %>',
          ext: '.html'
        }]
      }
    },

    copy: {
      scripts: {
        files: [{
          expand: true,
          cwd: '<%= meta.scripts %>single/',
          src: '**',
          dest: '<%= meta.public %>js/'
        }]
      },
      pug_php: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= meta.pug_dest %>',
          src: ['**/*.html'],
          dest: '<%= meta.views %>',
          rename: function(dest, src) {
             return dest + src.replace(/\.html$/, ".blade.php");
          }
        }]
      },
    },

    watch: {
      options: {
        spawn: false,
        interrupt: false,
        livereload: true
      },
      style: {
        files: [
          '<%= meta.styles %>/**/*.sass',
          '<%= meta.styles %>/**/*.scss'
        ],
        tasks: ['sass','concat:css_libs','concat:css_general','postcss','cssnano']
      },
      script: {
        files: [
          '<%= meta.scripts %>/**/*.js'
        ],
        tasks: ['browserify:babelify','concat:npm_libs','concat:js_general','copy:scripts','uglify']
      },
      pug: {
        files: [
          '<%= meta.pug_cwd %>/**/*.pug'
        ],
        tasks: pugTask
      }
    },

    clean: {
      options: {
        force: true
      },
      dev: [
        '<%= meta.public %>css',
        '<%= meta.public %>js',
        '<%= meta.public %>*.html'
      ],
      css: ['<%= meta.public %>css'],
      js: ['<%= meta.public %>js'],
      prod: ['<%= meta.public %>*.html']
    }

  };

  grunt.initConfig( gruntConfig );

  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-cssnano');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');

  //
  // Build tasking
  //
  var buildSettings = [
    'clean:dev',
    'sass',
    'concat:css_libs',
    'concat:css_general',
    'postcss',
    'pug',
    'browserify:babelify',
    'concat:npm_libs',
    'concat:js_general',
    'copy:scripts',
    'uglify'
  ];
  if ( convertToBlade ) {
    buildSettings.push( 'copy:pug_php' );
  }
  grunt.registerTask('build', buildSettings);

  //
  // Frontend tasking
  //
  grunt.registerTask('build_front', [
    'clean:css',
    'clean:js',
    'sass',
    'concat:css_libs',
    'concat:css_general',
    'postcss',
    'cssnano',
    'browserify:babelify',
    'concat:npm_libs',
    'concat:js_basic',
    'concat:js_general',
    'copy:scripts'
  ]);
  grunt.registerTask('build_style', [
    'clean:css',
    'sass',
    'concat:css_libs',
    'concat:css_general',
    'postcss'
  ]);
  grunt.registerTask('build_script', [
    'clean:js',
    'browserify:babelify',
    'concat:npm_libs',
    'concat:js_basic',
    'concat:js_general',
    'copy:scripts'
  ]);

  //
  //Html tasking
  //
  var htmlSettings = [
    'clean:prod',
    'pug'
  ];
  if ( convertToBlade ) {
    htmlSettings.push( 'copy:pug_php' );
  }
  grunt.registerTask('build_html', htmlSettings );

  //
  //Release tasking
  //
  grunt.registerTask('release', [
    'build',
    'clean:prod',
    'cssnano',
    'uglify'
  ]);

  grunt.registerTask('default',    ['build', 'watch']);
  grunt.registerTask('run_adv',    ['build_adv', 'watch']);
  grunt.registerTask('run_front',  ['build_front', 'watch']);
  grunt.registerTask('run_style',  ['build_style', 'watch']);
  grunt.registerTask('run_script', ['build_script', 'watch']);
  grunt.registerTask('run_html',   ['build_html', 'watch']);
};
