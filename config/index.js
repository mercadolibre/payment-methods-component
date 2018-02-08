const fs = require('fs');
const names = require('./names');
const sizes = require('./sizes');

let packageJson = JSON.parse(
    fs.readFileSync('./package.json', 'utf-8')
);

const CONFIG = {
    version: packageJson.version,
    paymentMethods: {
        names: names,
        urls: {
            ar: 'https://api.mercadolibre.com/sites/MLA/payment_methods',
            br: 'https://api.mercadolibre.com/sites/MLB/payment_methods',
            cl: 'https://api.mercadolibre.com/sites/MLC/payment_methods'
        },
        marketplaces: [undefined, 'MELI', 'NONE']
    },
    uiLogos: 'https://http2.mlstatic.com/ui/ui-logos/2.1.3/logos.json',
    sizes: sizes
};

module.exports = CONFIG;
