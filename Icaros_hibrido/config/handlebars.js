const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
        range: function (start, end) {
            const array = [];
            for (let i = start; i <= end; i++) {
                array.push(i);
            }
            return array;
        }
    }
});

module.exports = hbs;