var fs = require("fs");
var request = require("request");
var config = require("./project.config");

module.exports = function(grunt) {
  'use strict';

  // URL endpoint
  var sitePath = config.sitePath;

  // stage URL for humans
  var stage_url = ['https://s3-us-west-2.amazonaws.com/dev.apps.statesman.com', config.sitePath, 'index.html'].join("/");

  // prod URL for humans
  var prod_url = ['https://s3-us-west-2.amazonaws.com/apps.statesman.com', config.sitePath, 'index.html'].join("/");

  grunt.initConfig({

    // Copy FontAwesome files to the fonts/ directory
    copy: {
       fonts: {
        src: [
          'node_modules/bootstrap/fonts/**'
        ],
        dest: 'public/fonts/',
        flatten: true,
        expand: true
      }
    },

    // Transpile LESS
    less: {
      options: {
        sourceMap: true,
        paths: ['node_modules/bootstrap/less']
      },
      prod: {
        options: {
          compress: true,
          cleancss: false
        },
        files: {
          "public/style.css": "src/main.less"
        }
      }
    },

    // Run our JavaScript through JSHint
    jshint: {
      js: {
        src: ['src/main.js']
      }
    },

    // Squish all that js into one file
    uglify: {
      options: {
        sourceMap: true
      },
      prod: {
        files: {
          'public/scripts.js': [
            'node_modules/pym.js/dist/pym.v1.js',
            'src/main.js'
          ]
        }
      }
    },

    // Watch for changes in LESS and JavaScript files,
    // relint/retranspile when a file changes
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['src/**js'],
        tasks: ['jshint', 'uglify']
      },
      styles: {
        files: ['src/**less'],
        tasks: ['less']
      },
      templates: {
        files: ['src/njk/*'],
        tasks: ['nunjucks']
      }
    },

    nunjucks: {
      options: {
        data: grunt.file.readJSON('src/data/data.json'),
        paths: 'src/njk'
      },
      dev: {
        files: [{
          expand: true,
          cwd: 'src/njk',
          src: [
            '*.html'
          ],
          dest: 'public',
          ext: '.html'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
          preserveLineBreaks: true
        },
        files: {
          'public/index.html': 'public/index.html',
          'public/tease.html': 'public/tease.html'
        }
      }
    }
  });


  // Load the task plugins
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nunjucks-2-html');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadTasks('tasks/');

  // register a custom task to hit slack
  grunt.registerTask('slack', function(where_dis_go) {

      // first, check to see if there's a .slack file
      // (this file has the webhook endpoint)
      if(grunt.file.isFile('.slack')) {

          // homeboy here runs async, so
          var done = this.async();

          // prod or stage?
          var s3Path = where_dis_go === "prod" ? prod_url : stage_url;

          var payload = {
              "text": "deploying property-tax-impact *" + config.sitePath +  "*: " + s3Path,
              "channel": "#bakery",
              "username": "Taxbot",
              "icon_emoji": ":moneybag:"
          };

          // send the request
          request.post(
              {
                  url: fs.readFileSync('.slack', {encoding: 'utf8'}),
                  json: payload
              },
              function callback(err, res, body) {
                  done();
                  if (body !== "ok") {
                      return console.error('upload failed:', body);
                  }
              console.log('we slacked it up just fine people, good work');
          });
      }
      // if no .slack file, log it
      else {
          grunt.log.warn('No .slack file exists. Skipping Slack notification.');
      }
  });

  grunt.registerTask('default', ['copy', 'nunjucks', 'htmlmin', 'less', 'jshint', 'uglify']);
  // Publishing tasks
  grunt.registerTask('stage', ['default', 'deployS3:stage', 'slack:stage']);
  grunt.registerTask('prod', ['default', 'deployS3:prod', 'slack:prod']);

};
