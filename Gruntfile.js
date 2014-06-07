module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/content.min.js': 'dist/content.js',
          'dist/background.min.js': 'dist/background.js',
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    coffee: {
      compile: {
        files: {
          'dist/background.js': ['lib/config/*.coffee', 'lib/background/*.coffee'], // compile and concat into single file
          'dist/content.js': ['lib/config/*.coffee', 'lib/content_scripts/jQuery.getPath.coffee', 'lib/content_scripts/content_script.coffee'] // compile and concat into single file
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['lib/*/*'],
      tasks: ['coffee', 'uglify']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['coffee']);

};