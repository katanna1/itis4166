const { DateTime } = require("luxon");
const { v4:uuidv4 } = require('uuid');
const products = [
    {
        id: '1',
        title: 'A funny ',
        content: 'Hhfdhdhf haskdh jaksks hwoodpfp jsdkfdsls.',
        author: 'Katrina',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '2',
        title: 'Itis raining',
        content: 'Blah  hhdfhjdsjdfsjfd.',
        author: 'Wilson',
        createdAt: DateTime.local(2000, 9, 10, 0).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '3',
        title: 'Learning NBAD',
        content: 'exercise 4 completion thing',
        author: 'Katrina Wilson',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    }
];

exports.find = () => products;

exports.findById = function(id) {
    return products.find(product=>product.id === id);
};

exports.save = function (product) {
    product.id = uuidv4();
    product.createdAt = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
    products.push(product);
};

exports.updateById = function(id, newProduct) {
    let product = products.find(product=>product.id === id);
    if(product) {
        product.title = newProduct.title;
        product.content = newProduct.content;
        return true;
    } else {
        return false;
    }
}

exports.deleteById = function(id) {
    let index = products.findIndex(product =>product.id === id);
    if(index !==-1) {
        products.splice(index, 1);
        return true;
    } else {
        return false;
    }
}