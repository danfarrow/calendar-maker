module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			js: {
				src: [
					'src/js/init.js',
					'src/js/render.js'
				],
				dest: 'build/init.js'
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				mangle: true,
				wrap: 'ggg',
			},
			build: {
				// src: 'src/<%= pkg.name %>.js',
				// dest: 'build/<%= pkg.name %>.min.js'
				src: 'build/init.js',
				dest: 'public/js/init.min.js'
			}
		},

		sass: {
		    dist: {
		        options: {
		            style: 'compressed',
		            cacheLocation: 'src/sass/.sass-cache'
		        },
		        files: {
		            'build/base.css' : 'src/sass/base.scss'
		        }
		    } 
		},

		// @todo Use expand: false with wildcard in /themes/* ?
		autoprefixer: {
            dist: {
        		src: 'build/base.css',
        		dest: 'public/css/base.css'
        	}
	    },

		copy: {
		  main: {
		    files: [
		    	{
		    		expand: false,
		    		src: 'src/index.html',
		    		dest: 'public/index.html',
		    	},
		      // includes files within path
		      // {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

		      // includes files within path and its sub-d1irectories
		      // {expand: true, src: ['path/**'], dest: 'dest/'},

		      // makes all src relative to cwd
		      // {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

		      // flattens results to a single level
		      // {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'}
		    ]
		  }
		},

		watch: {
			options: {
        		livereload: true,
    		},

    		config: {
    			files: [
    				'Gruntfile.js'
				],
				tasks: ['concat', 'uglify', 'copy', 'sass', 'autoprefixer'],
				options: {
					spawn: false,
				}
    		},

		    scripts: {
		        files: [
		        	'src/js/*.js'
	        	],
		        tasks: ['concat', 'uglify', 'copy'],
		        options: {
		            spawn: false,
		        }
		    },

			css: {
			    files: [
			    	'src/sass/*.scss',
			    	'src/sass/themes/*.scss'
		    	],
			    tasks: ['sass', 'autoprefixer'],
			    options: {
			        spawn: false,
			    }
			},

			html: {
				files: ['src/index.html'],
				tasks: ['copy'],
				options: {
					spawn: false,
				}
			},
		},

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default', ['concat', 'uglify', 'copy', 'sass', 'autoprefixer']);
};
