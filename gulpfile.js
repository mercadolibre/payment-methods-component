const gulp = require('gulp');
const https = require('https');
const config = require('./config');
const debug = require('gulp-debug');
const rename = require('gulp-rename');
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
                        // remoteSrc(logos, { base: 'https://' })
                        //     .pipe(rename((path) => {
                        //         let id = path.basename.replace('.svg', '');
                        //         let name = config.paymentMethods.names[site][id];
                        //         path.basename = `${name}.svg`;
                        //     }))
                        //     .pipe(svgSprites())
                        //     .pipe(gulp.dest('build'));

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
                            imgName: 'sprite.png',
                            cssName: 'sprite.css',
                            retinaImgName: 'sprite@2x.png',
                            retinaSrcFilter: `build/png/${site}/${size}/*@2x.png`
                        }))
                        .pipe(gulp.dest(`build/sprites/${site}/${size}`));
                });
            });
        });
    });
});

gulp.task('config', () => {
    console.log(JSON.stringify(config, null, '    '));
});
