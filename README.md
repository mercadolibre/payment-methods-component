Payment Methods Component
=====================================

MercadoPago Payment Methods Logos, Sprites and CSS sorted by countries and sizes.

So far, this is a really really early draft. 

## Development setup

1. Install [Git](http://git-scm.com/) and [NodeJS](http://nodejs.org/).

2. Open your terminal and clone `mercadolibre/payment-methods-component` by running:

        $ git clone git@github.com:mercadolibre/payment-methods-component.git

3. Now go to the project's folder:

        $ cd payment-methods-component

4. Install its dependencies:

        $ npm install

5. Install `grunt-cli`:

        $ npm install grunt-cli -g

## File generation

You can generate a file by country and by size using Grunt commands:

Ex: payment methods for Argentina with the default size:

        grunt build --country=ar

Ex: Payment methods for Argentina and large size:

        grunt build --country=ar --size=large


You'll find the generated files in a `build` folder.

### Country List

- ar (Argentina)
- br (Brazil)
- mx (Mexico)
- ve (Venezuela)
- co (Colombia)

### Size Lists

- default 
- large

## Usage

Once you've got a css file for the component, you can add it to your css bundles in your project.

### Guidelines

- Use one file per country. Only load the component for that country.

- Add it to your own bundles, don't make an extra request for it.

### HTML Markup

- Each logo as its own class with the prefix `paymentmethod-`. Por example:

    ```
    paymentmethod-visa
    ```

- You can use them in any element. 
  
    ```html
    <!-- Unordered List -->
    <ul>
        <li class="paymentmethod-visa">Visa</li>
        <li class="paymentmethod-master">Mastercard</li>
        <li class="paymentmethod-amex">American Express</li>
    </ul>
    ```

    ```html
    <!-- Span -->
    <span class="paymentmethod-visa">Visa</span>
    ```

    ```html
    <!-- With Inline Text -->
    <p>
        <span class="paymentmethod-visa">Visa</span> terminada en 1234
    </p>
    ```

- Extend the size for large files using the `paymentmethod-large` class:
    
    ```html
    <!-- This is a large logo -->
    <span class="paymentmethod-visa paymentmethod-large">Visa</span>
    ```

- Each payment method class uses the id field from the [MercadoPago Payment Methods API](https://api.mercadolibre.com/sites/MLA/payment_methods), so you can use variables to be able to use this service and load the logos dinamically.

     ```html
    <li class="paymentmethod-${id}">${name}</li>
    ```


## Maintained by

- Nati Devalle (natalia.devalle@mercadolibre.com)
- Ivan Pianciola (ivan.pianciola@mercadolibre.com)

## Thanks to

- Guille Paz (guillermo.paz@mercadolibre.com)

## Credits

![MercadoLibre](http://static.mlstatic.com/org-img/chico/img/logo-mercadolibre-new.png)

## License
Licensed under the MIT license.

Copyright (c) 2013 [MercadoLibre](http://github.com/mercadolibre).

