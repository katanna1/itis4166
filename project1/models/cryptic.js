const { DateTime } = require("luxon");
const { v4:uuidv4 } = require('uuid');
const products = [
    {
        id: '1',
        title: 'Black Pearl Sun Necklace',
        condition: 'New',
        price: '100',
        imageUrl: '/media/items/item1.jpg',
        seller: 'Katrina Wilson',
        description: 'This necklace is a one of a kind piece that is perfect for any occasion. The black pearl is a rare find and is sure to make a statement. The sun design is a symbol of hope and new beginnings. This necklace is perfect for anyone who loves unique jewelry.',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '2',
        title: 'Silver Chunky Heart Bangle',
        condition: 'Good',
        price: '50',
        imageUrl: '/media/items/item2.jpg',
        seller: 'Jane Doe',
        description: 'This bangle is perfect for anyone who loves chunky jewelry. The heart design is a classic and will never go out of style. The silver is high quality and will last a lifetime. This bangle is perfect for everyday wear or for a special occasion.',
        createdAt: DateTime.local(2022, 9, 10, 0).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '3',
        title: 'Black Onyx Mesh Skull Ring',
        condition: 'Like New',
        price: '20',
        imageUrl: '/media/items/item3.jpg',
        seller: 'Ryan Smith',
        description: 'This ring is perfect for anyone who loves unique jewelry. The black onyx is a rare find and is sure to make a statement. The skull design is a symbol of strength and power. This ring is perfect for anyone who loves to stand out.',
        createdAt: DateTime.now().toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '4',
        title: 'Black Cross Earrings',
        condition: 'New',
        price: '70',
        imageUrl: '/media/items/item4.jpg',
        seller: 'Anna Brown',
        description: 'Black cross earrings are a classic piece that will never go out of style. The black color is perfect for anyone who loves to wear dark colors. The cross design is a symbol of faith and will make a statement. These earrings are perfect for everyday wear or for a special occasion.',
        createdAt: DateTime.local(2024, 3, 10, 0).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '5',
        title: 'Black Lace Cross Choker',
        condition: 'Good',
        price: '30',
        imageUrl: '/media/items/item5.jpg',
        seller: 'Leo Johnson',
        description: 'This choker is perfect for anyone who loves unique jewelry. The black lace is a rare find and is sure to make a statement. The cross design is a symbol of faith and will make a statement. This choker is perfect for anyone who loves to stand out.',
        createdAt: DateTime.local(2023, 1, 1, 0).toLocaleString(DateTime.DATETIME_SHORT)
    },
    {
        id: '6',
        title: 'Black Cross Earrings',
        condition: 'New',
        price: '80',
        imageUrl: '/media/items/item6.jpg',
        seller: 'Sarah White',
        description: 'Cross earrings are a classic piece that will never go out of style. The black color is perfect for anyone who loves to wear dark colors. The cross design is a symbol of faith and will make a statement. These earrings are perfect for everyday wear or for a special occasion.',
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
        product.seller = newProduct.seller;
        product.description = newProduct.description;
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