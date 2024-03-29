/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var chalk = require('chalk');
var db = require('./server/db');
var User = db.model('user');
const Products = db.model('product');
const Categories = db.model('category');
const Orders = db.model('order');
const Items = db.model('item');
const OrderDetail = db.model('orderDetails');
var Promise = require('sequelize').Promise;

var seedUsers = function () {

    var users = [
        {
            email: 'testing@fsa.com',
            password: 'password'
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        }
    ];

    var creatingUsers = users.map(function (userObj) {
        return User.create(userObj);
    });

    return Promise.all(creatingUsers);

};

var seedProducts = function () {

    var products = [
        {
            name: 'blueberries',
            price: 100,
            quantity: 5,
            source: "Jo's Farm",
            description: 'Wild blueberries',
            imageUrl: 'http://2vg3dte874793qqzcf8j9mn.wpengine.netdna-cdn.com/wp-content/uploads/handful-of-blueberries-1502-498x286.jpg'
        },
        {
            name: 'bananas',
            price: 1,
            quantity: 1,
            source: "Jo's Farm",
            description: 'free-trade bananas',
            imageUrl: 'http://pngimg.com/upload/banana_PNG835.png'
        },
        {
            name: 'eggs',
            price: 5,
            quantity: 12,
            source: "Jo's Farm",
            description: 'free-range, grass-fed',
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Egg_colours.jpg'
        }

    ];

    var creatingProducts = products.map(function (productObj) {
        return Products.create(productObj);
    });

    return Promise.all(creatingProducts);

};

var seedCategories = function () {

    var categories = [
        {
            type_name: 'fruit',
        },
        {
            type_name: 'dairy',
        },
        {
            type_name: 'meat',
        }

    ];

    var creatingCategories = categories.map(function (categoryObj) {
        return Categories.create(categoryObj);
    });

    return Promise.all(creatingCategories);

};


var seedOrders = function () {

    var orders = [
        {
            status: 'Active',
        },
        {
            status: 'Active',
        },
        {
            status: 'Complete',
        }

    ];

    var creatingOrders = orders.map(function (orderObj) {
        return Orders.create(orderObj);
    });

    return Promise.all(creatingOrders);

};

var seedItems = function () {

    var items = [
        {
            quantity: 2,
        },
        {
            quantity: 1,
        },
        {
            quantity: 3,
        }

    ];

    var creatingItems = items.map(function (itemObj) {
        return Items.create(itemObj);
    });

    return Promise.all(creatingItems);

};

var seedOrderDetails = function () {

    var orderDetails = [
        {
            name: 'Non-User',
            email: 'nonuser@gmail.com',
            address: '123'
        },
        {
            name: 'Obama',
            email: 'obama@gmail.com',
            address: 'WhiteHouse'
        },
        {
            name: 'Non-User2',
            email: 'nonuser2@gmail.com',
            address: '123'
        }

    ];

    var creatingOrderDetails = orderDetails.map(function (orderDetailObj) {
        return OrderDetail.create(orderDetailObj);
    });

    return Promise.all(creatingOrderDetails);

};

db.sync({ force: true })
    .then(function () {
        return seedUsers();
    })
    .then(function(){
        return seedProducts();
    })
    .then(function(){
        return seedCategories();
    })
    .then(function(){
        return seedOrders();
    })
    .then(function(){
        return seedItems();
    })
    .then(function(){
        return seedOrderDetails();
    })
    .then(function(){
        return Products.findAll();
    })
    .then(function(products){
        return products.map(function(eachProduct){
            if(eachProduct.name === 'eggs') return eachProduct.setCategories([2]);
            return  eachProduct.setCategories([1]);
        })
    })
    .then(function(promises){
        return Promise.all(promises);
    })
    //
    .then(function(){
        return User.findAll();
    })
    .then(function(users){
        return users.map(function(user){
            if(user.id == 1) return user.setOrders([1]);
            return  user.setOrders([2,3]);
        })
    })
    .then(function(promises){
        return Promise.all(promises);
    })
    .then(function(){
        return Items.findAll();
    })
    .then(function(items){
        return items.map(function(item){
            if(item.id == 1) {
                return Promise.all([item.setOrder(1), item.setProduct(2)]);
            }
            if(item.id == 2) {
                return Promise.all([item.setOrder(1), item.setProduct(3)]);
            }
            return  Promise.all([item.setOrder(3), item.setProduct(1)]);
        });
    })
    .then(function(promises){
        return Promise.all(promises);
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.exit(0);
    })
    .catch(function (err) {
        console.error(err);
        process.exit(1);
    });
