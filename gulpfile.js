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

gulp.task('build:logos', () => {
    https.get(config.uiLogos, (res) => {
        let body = '';

        // Set utf-8 encoding
        res.setEncoding('utf-8');

        // Body response
        res.on('data', (data) => body += data);

        res.on('end', () => {
            let uiLogos = JSON.parse(body);

            Object.keys(config.paymentMethods.urls).forEach((site) => {

                // Get data.
                https.get(config.paymentMethods.urls[site], (res) => {
                    let body = '';

                    // Set utf-8 encoding
                    res.setEncoding('utf-8');

                    // Body response
                    res.on('data', (data) => body += data);

                    // On end
                    res.on('end', () => {
                        let items = JSON.parse(body);
                        let logos = items.map((item) => {
                            let name = config.paymentMethods.names[site][item.id];

                            if (name) {
                                let logo = uiLogos.logos[name];

                                if (logo) {
                                    return logo.svg.url;
                                } else {
                                    // Value of name not defined.
                                }
                            } else {
                                // Key of name not defined.
                            }
                        });

                        // Generate sprite
                        remoteSrc(logos, { base: 'https://' })
                            .pipe(rename((path) => {
                                path.basename = Object.keys(config.paymentMethods.names[site]).filter((key) => {
                                    return path.basename === config.paymentMethods.names[site][key];
                                })[0];
                            }))
                            .pipe(svgSprites({
                                afterTransform: (data) => {
                                    data.sizes = [
                                        {
                                            "name": "xs",
                                            "size": 18
                                        },
                                        {
                                            "name": "s",
                                            "size": 24
                                        },
                                        {
                                            "name": "m",
                                            "size": 32
                                        },
                                        {
                                            "name": "l",
                                            "size": 36
                                        },
                                        {
                                            "name": "xl",
                                            "size": 48
                                        }
                                    ];
                                    return data;
                                },
                                templates: {
                                    css: fs.readFileSync(`template.css`, 'utf-8')
                                },
                                preview: false,
                                common: 'paymentmethod-',
                                svgId: 'paymentmethod-%f',
                                svgPath: `https://http2.mlstatic.com/ui/payment-methods-component/2.0.0-develop.7/${site}/svg/payment-methods.svg`,
                                // svgPath: `payment-methods.svg`,
                                baseSize: 40,
                                cssFile: `${site}/svg/payment-methods.css`,
                                svg: {
                                    sprite: `${site}/svg/payment-methods.svg`
                                },
                                layout: 'horizontal'
                            }))
                            .pipe(gulp.dest('build/sprites'));

                        Object.keys(uiLogos.sizes).forEach((size) => {
                            let logosDefault = items.map((item) => {
                                let name = config.paymentMethods.names[site][item.id];

                                if (name) {
                                    let logo = uiLogos.logos[name];

                                    if (logo) {
                                        return logo.png[size].default.url.replace('http2.mlstatic.com/ui/ui-logos/2.0.0-develop.2/png/', '');
                                    } else {
                                        // Value of name not defined.
                                    }
                                } else {
                                    // Key of name not defined.
                                }
                            });
                            let logosRetina = items.map((item) => {
                                let name = config.paymentMethods.names[site][item.id];

                                if (name) {
                                    let logo = uiLogos.logos[name];

                                    if (logo) {
                                        return logo.png[size].retina.url.replace('http2.mlstatic.com/ui/ui-logos/2.0.0-develop.2/png/', '');
                                    } else {
                                        // Value of name not defined.
                                    }
                                } else {
                                    // Key of name not defined.
                                }
                            });

                            // Download default.
                            remoteSrc(logosDefault, { base: 'https://http2.mlstatic.com/ui/ui-logos/2.0.0-develop.2/png/' })
                                .pipe(rename((path) => {
                                    path.basename = Object.keys(config.paymentMethods.names[site]).filter((key) => {
                                        return path.basename === config.paymentMethods.names[site][key];
                                    })[0];
                                }))
                                .pipe(gulp.dest(`build/png/${site}`));

                            // Download retina.
                            remoteSrc(logosRetina, { base: 'https://http2.mlstatic.com/ui/ui-logos/2.0.0-develop.2/png/' })
                                .pipe(rename((path) => {
                                    path.basename = `${Object.keys(config.paymentMethods.names[site]).filter((key) => {
                                        return path.basename === `${config.paymentMethods.names[site][key]}@2x`;
                                    })[0]}@2x`;
                                }))
                                .pipe(gulp.dest(`build/png/${site}`));
                        });
                    });

                // Error
                }).on('error', (e) => {
                    console.error(e);
                });
            });
        });
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
                Object.keys(uiLogos.sizes).forEach((size) => {
                    gulp.src(`build/png/${site}/${size}/*.png`)
                        .pipe(spritesmith({
                            retinaSrcFilter: `build/png/${site}/${size}/*@2x.png`,
                            retinaImgName: `payment-methods-${size}@2x.png`,
                            retinaImgPath: `https://http2.mlstatic.com/ui/payment-methods-component/2.0.0-develop.7/${site}/png/payment-methods-${size}@2x.png`,
                            // retinaImgPath: `payment-methods-${size}@2x.png`,
                            cssName: `payment-methods-${size}.css`,
                            imgName: `payment-methods-${size}.png`,
                            imgPath: `https://http2.mlstatic.com/ui/payment-methods-component/2.0.0-develop.7/${site}/png/payment-methods-${size}.png`,
                            // imgPath: `payment-methods-${size}.png`,
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

gulp.task('swift', () => {
    swift({
        department: 'ui',
        user: 'app_ui-logo',
        password: 'PoYlvEFb46',
        container: 'statics',
        friendlyUrl: 'payment-methods-component',
        folder: 'dist',
        version: '2.0.0-develop.7'
    });
});

gulp.task('config', () => {
    console.log(JSON.stringify(config, null, '    '));
});

// Dist
// ----------------------------------------------------------------------------

gulp.task('dist:png', () => {
    gulp.src('build/sprites/**/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist'))
});

gulp.task('dist:svg', () => {
    gulp.src('build/sprites/**/*.svg')
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
            })()
        }))
        .pipe(gulp.dest('dist/templates'))
});

gulp.task('dist', ['dist:png', 'dist:svg', 'dist:styles']);
