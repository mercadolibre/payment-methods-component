const fs = require('fs');
const gulp = require('gulp');
const https = require('https');
const swift = require('ui-swift');
const config = require('./config');
const debug = require('gulp-debug');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const nunjucks = require('gulp-nunjucks');
const remoteSrc = require('gulp-remote-src');
const svgSprites = require('gulp-svg-sprites');
const spritesmith = require('gulp.spritesmith');

// Dist
// ----------------------------------------------------------------------------

gulp.task('build:logos', () => {
    // Get data.
    https.get(config.uiLogos, (res) => {
        let body = '';

        // Set utf-8 encoding
        res.setEncoding('utf-8');

        // Body response
        res.on('data', (data) => body += data);

        res.on('end', () => {
            let uiLogos = JSON.parse(body);

            Object.keys(config.paymentMethods.urls).forEach(site => {
                config.paymentMethods.marketplaces.forEach(marketplace => {
                    let url = `${config.paymentMethods.urls[site]}${marketplace ? `?marketplace=${marketplace}` : ''}`;

                    console.log(url);

                    // Get data.
                    https.get(url, (res) => {
                        let body = '';

                        // Set utf-8 encoding
                        res.setEncoding('utf-8');

                        // Body response
                        res.on('data', (data) => body += data);

                        // On end
                        res.on('end', () => {
                            let items = JSON.parse(body);

                            console.log(`\n--------- ${site.toUpperCase()} ----------`);

                            let logos = items.map((item) => {
                                let name = config.paymentMethods.names[site][item.id];

                                if (name) {
                                    let logo = uiLogos[name];

                                    if (logo) {
                                        let logoDefault = `${name}.png`;
                                        let logoRetina = `${name}@2x.png`;

                                        config.sizes.forEach(size => {
                                            // Download default.
                                            remoteSrc(logoDefault, { base: logo.png[size].default.url.replace(logoDefault, '') })
                                                .pipe(rename((path) => {
                                                    path.basename = Object.keys(config.paymentMethods.names[site]).filter((key) => {
                                                        return path.basename === config.paymentMethods.names[site][key];
                                                    })[0];
                                                }))
                                                .pipe(gulp.dest(`build/png/${site}/${size}`));

                                            // Download retina.
                                            remoteSrc(logoRetina, { base: logo.png[size].retina.url.replace(logoRetina, '') })
                                                .pipe(rename((path) => {
                                                    path.basename = `${Object.keys(config.paymentMethods.names[site]).filter((key) => {
                                                        return path.basename === `${config.paymentMethods.names[site][key]}@2x`;
                                                    })[0]}@2x`;
                                                }))
                                                .pipe(gulp.dest(`build/png/${site}/${size}`));
                                        });
                                        console.log(`[Defined]     - ${item.id}`);
                                    } else {
                                        // Value of name not defined.
                                        console.log(`[Not defined] - ${item.id}`);
                                    }
                                } else {
                                    // Key of name not defined.
                                    console.log(`[Not defined] - ${item.id}`);
                                }
                            });
                        });

                    // Error
                    }).on('error', (e) => {
                        console.error(e);
                    });
                });
            });
        });

    // Error
    }).on('error', (e) => {
        console.error(e);
    });
});

gulp.task('build:sprites', () => {

    https.get(config.uiLogos, (res) => {
        let body = '';

        // Set utf-8 encoding
        res.setEncoding('utf-8');

        // Body response
        res.on('data', (data) => body += data);

        res.on('end', () => {
            let uiLogos = JSON.parse(body);

            Object.keys(config.paymentMethods.urls).forEach((site) => {
                config.sizes.forEach(size => {
                    gulp.src(`build/png/${site}/${size}/*.png`)
                        .pipe(spritesmith({
                            retinaSrcFilter: `build/png/${site}/${size}/*@2x.png`,
                            retinaImgName: `payment-methods-${size}@2x.png`,
                            retinaImgPath: `payment-methods-${size}@2x.png`,
                            cssName: `payment-methods-${size}.css`,
                            imgName: `payment-methods-${size}.png`,
                            imgPath: `payment-methods-${size}.png`,
                            cssTemplate: 'template.handlebars',
                            algorithm: 'left-right',
                            padding: 4,
                            cssHandlebarsHelpers: {
                                add_1: (num) => {
                                    return num + 1;
                                }
                            }
                        }))
                        .pipe(gulp.dest(`build/sprites/${site}/png`));
                });
            });
        });
    });
});

gulp.task('build', ['build:logos', 'build:sprites']);

// Dist
// ----------------------------------------------------------------------------

gulp.task('dist:png', () => {
    gulp.src('build/sprites/**/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist'))
});

gulp.task('dist:styles', () => {
    gulp.src('build/sprites/**/*.css')
        .pipe(cssnano())
        .pipe(rename((path) => {
            path.extname = ".min.css"
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('dist:html', () => {
    gulp.src('src/templates/base.html')
        .pipe(nunjucks.compile({
            sites: ['ar'],
            sizes: ['m'],
            names: (() => {
                return Object.keys(config.paymentMethods.names.ar);
            })(),
            version: config.version
        }))
        .pipe(gulp.dest('dist/templates'))
});

gulp.task('dist', ['dist:png', 'dist:styles', 'dist:html']);

// Others
// ----------------------------------------------------------------------------

gulp.task('swift', () => {
    swift({
        department: 'ui',
        user: 'app_ui-logo',
        password: 'PoYlvEFb46',
        container: 'statics',
        friendlyUrl: 'payment-methods-component',
        folder: 'dist',
        version: config.version
    });
});
