const fs = require('fs');
const names = require('./names');

let packageJson = JSON.parse(
    fs.readFileSync('./package.json', 'utf-8')
);

const CONFIG = {
    version: packageJson.version,
    paymentMethods: {
        names: names,
        urls: {
            mla: 'https://api.mercadolibre.com/sites/MLA/payment_methods',
            mlb: 'https://api.mercadolibre.com/sites/MLB/payment_methods',
            mlc: 'https://api.mercadolibre.com/sites/MLC/payment_methods'
        }
    },
    uiLogos: 'https://http2.mlstatic.com/ui/ui-logos/2.0.0-develop.2/logos.json'
};

module.exports = CONFIG;
