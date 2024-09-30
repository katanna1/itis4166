const { DateTime } = require("luxon");
const { v4:uuidv4 } = require('uuid');
const products = [
    {
        id: '1',
        title: 'Black Pearl Sun Necklace',
        condition: 'New',
        price: '100',
        imageUrl: '/media/items/item1.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '2',
        title: 'Silver Chunky Heart Bangle',
        condition: 'Good',
        price: '50',
        imageUrl: '/media/items/item2.jpg',
        createdAt: DateTime.local(2000, 9, 10, 0).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '3',
        title: 'Black Onyx Mesh Skull Ring',
        condition: 'Like New',
        price: '20',
        imageUrl: '/media/items/item3.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '4',
        title: 'Black Cross Earrings',
        condition: 'New',
        price: '70',
        imageUrl: '/media/items/item4.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '5',
        title: 'Black Lace Cross Choker',
        condition: 'Good',
        price: '30',
        imageUrl: '/media/items/item5.jpg',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '6',
        title: 'Black Cross Earrings',
        condition: 'New',
        price: '80',
        imageUrl: '/media/items/item6.jpg',
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
        product.condition = newProduct.condition;
        product.price = newProduct.price;
        product.imageUrl = newProduct.imageUrl;
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