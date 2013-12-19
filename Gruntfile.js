module.exports = function(grunt) {

    var country = grunt.option('country'),
        size = grunt.option('size') || 'default';

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'concat': {
            'dist': {
                'src': ['css/payment-methods.css', 'css/countries/' + country + '/payment-methods.css', 'css/countries/' + country + '/' + size + '/payment-methods.css'],
                'dest': 'build/payment-methods.' + country + '.css'
            }
        },
        'copy': {
            'main': {
                'files': [{
                    'expand': true,
                    'cwd': 'css/countries/' + country + '/' + size + '/',
                    'src': ['payment-methods-' + size + '.png'],
                    'dest': 'build/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('build', ['concat', 'copy']);

};