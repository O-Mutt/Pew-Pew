var LIVERELOAD_PORT = 35729;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['dist'],
		uglify: {
			build: {
				files: [{
                    expand: true,
                    cwd: 'app/src/',
                    src: ['**/*.js', '!libs/**/*', '!bower_components/**/*'],
                    dest: 'dist/src/',
                    ext: '.js'
				},
				{
                    expand: true,
                    flatten: true,
                    cwd: 'app/src/brower_components/',
        		    src: ['jquery/jquery.js', 'modernizr/modernizr.js'],
        		    dest: 'dist/src/libs/',
                    ext: '.min.js'
        		},
                {
                    'dist/src/libs/requirejs-jquery.min.js': ['app/src/bower_components/requirejs-jquery/parts/require.js', 'app/src/bower_components/requirejs-jquery/parts/query.js']
                }]
			}
		},
		copy: {
    	  dist: {
            files: [{
              expand: true,
              flatten: true,
              cwd: 'app/src/bower_components/',
              src: ['backbone/backbone-min.js', 'backbone/backbone-min.map', 'underscore/underscore-min.js', 'underscore/underscore-min.map'],
              dest: 'dist/src/libs/',
              filter: 'isFile'
            },
            {
              expand: true,
              flatten: true,
              cwd: 'app/src/libs/',
              src: ['**/*'],
              dest: 'dist/src/libs/',
              filter: 'isFile'
            }, 
            {
            	expand: true,
            	cwd: 'app/web',
            	src: ['**/*'],
            	dest: 'dist/web',
            	filter: 'isFile'
            }]
          }
        },
        connect: {
        	server: {
		      options: {
		        port: 8888,
		        hostname: 'localhost',
		        base: "app/"
		      }
		    },
	        livereload: {
	          options: {
	            middleware: function (connect) {
	              return [require('connect-livereload')({port: LIVERELOAD_PORT}),
	                mountFolder(connect, '.')
	              ];
	            }
	          }
            }
        },
        open: {
	      server: {
	        path: 'http://localhost:<%= connect.server.options.port %>'
	      }
	    },
        watch: {
            html: {
                options: { livereload: true },
                files: ['app/index.html'],
            },
	        js: {
                options: { livereload: true },
                files: ['app/src/**/*.js']
            }
	    }
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-open');

	grunt.registerTask('build', ['clean', 'uglify', 'copy']);
	grunt.registerTask('server', ['connect:server', 'open', 'watch']);
	grunt.registerTask('default', ['server']);
}
