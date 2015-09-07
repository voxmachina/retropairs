module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		react: {
			compile:  {
				files: {
					'app.js': [
						'src/Components/Application.jsx',
						'src/main.jsx'
					]
				}
			}
		},

		watch: {
			compile: {
				files: 'src/**/*.jsx',
				tasks: ['react']
			}
		}
	});

	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('dev', ['react', 'watch']);
};
