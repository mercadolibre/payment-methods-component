module.exports = function(grunt) {

    var country = grunt.option('country'),
        size = grunt.option('size') || 'default,large',
        files = [
            'css/payment-methods.css',
            'css/countries/' + country + '/payment-methods.css'
        ],
        sizeCollection = size.split(','),
        destination = 'build/payment-methods.' + country + '__' + size + '.css';

    sizeCollection.forEach(function (e) {
        files.push('css/countries/' + country + '/' + e + '/payment-methods.css');
    });

    if (sizeCollection.length > 1) {
        // Rename file when all sizes
        destination = 'build/payment-methods.' + country + '.css'
    }

    // Project configuration.
    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'concat': {
            'build': {
                'src': files,
                'dest': destination
            }
        },

        'copy': {
            'main': {
                'files': [{
                    'expand': true,

                    // Source folder
                    'cwd': 'build/',

                    // Source files
                    'src': [
                        'payment-methods.*.css',
                        'payment-methods.*__*.css'
                    ],

                    // Destination folder
                    'dest': 'dist/',

                    'rename': function (dest, src) {
                        return dest + src.replace('/__*/', '');
                    }
                }]
            },
            'images': {
                'files': [
                    {
                        'src': 'css/countries/' + country + '/default/payment-methods-default.png',
                        'dest': 'dist/images/' + country + '/payment-methods-default.png'
                    },
                    {
                        'src': 'css/countries/' + country + '/default/payment-methods-default@2x.png',
                        'dest': 'dist/images/' + country + '/payment-methods-default@2x.png'
                    },
                    {
                        'src': 'css/countries/' + country + '/large/payment-methods-large.png',
                        'dest': 'dist/images/' + country + '/payment-methods-large.png'
                    },
                    {
                        'src': 'css/countries/' + country + '/large/payment-methods-large@2x.png',
                        'dest': 'dist/images/' + country + '/payment-methods-large@2x.png'
                    },
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', []);
    grunt.registerTask('build', ['concat']);
    grunt.registerTask('dist', ['copy:main']);
    grunt.registerTask('images', ['copy:images']);
};
