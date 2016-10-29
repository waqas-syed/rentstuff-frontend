module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-ts');

    grunt.initConfig({
        uglify: {
            my_target: {
                files: [{
                    //expand: true,
                    //cwd: 'Scripts',
                    src: ['Scripts/app.js', 'Scripts/**/*.js'],
                    dest: 'wwwroot/app.js'
                }]
            },
            options: {
                sourceMap: true
            }
        },

        // Copy all JS files from external libraries and required NPM packages to wwwroot/js
        copy: {
            main: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: [
                        'Scripts/js/**/*.js'
                    ],
                    dest: 'wwwroot/js/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'assets',
                    src: '**',
                    dest: 'wwwroot/assets/'
                }]
            }
        },

        // Watch specified files and define what to do upon file changes
        watch: {
            scripts: {
                files: ['Scripts/**/*.js'],
                tasks: ['uglify', 'copy']
            }
        }
    });

    // Define the default task so it will launch all other tasks
    grunt.registerTask('default', ['uglify', 'copy', 'watch']);
};