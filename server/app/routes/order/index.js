'use strict';

const router = require('express').Router(); // eslint-disable-line new-cap
const db = require('../../../db');
const Products = db.model('product');
const Orders = db.model('order');
const Items = db.model('item');
const OrderDetails = db.model('orderDetails');
const Promise = require('sequelize').Promise;

//checkout for non-users
//req.body.products is an array of objects {products: [{productId, quantity}]}
//req.body.token = token from Stripe
//req.body.email = email
router.post('/checkout', function(req, res, next){

  var creatingOrders = [Orders.create({status: 'Complete'}), OrderDetails.create({token: req.body.token, email: req.body.email})];
  Promise.all(creatingOrders)
  .then(function([order, details]){
    return order.setOrderDetail(details.id);
  })
  .then(function(order){
    return req.body.products.map(function(product){
       //create associations for order and product
       return Items.create({quantity: product.quantity})
       .then(function(item){
          return item.setProduct(product.id);
       })
       .then(function(item){
          return item.setOrder(order.id);
       })
       //reduce quantity for each product in req.body
       .then(function(item){
          return item.reduceProductQuantity(product.quantity)
          .catch(function(err){
            err.flag = "insufficient";
            err.order = order;
            throw err;
          });
       });
    });
  })
  .then(function(promises){
    return Promise.all(promises);
  })
  .then(function(){
    res.sendStatus(201);
  })
  //if we don't have enough quantity of product in DB, the order is marked as failed
  //and we throw an error
  .catch(function(err){
    if (err.flag === "insufficient"){
      return err.order.update({status: 'Failed'})
      .then(function(){
        res.sendStatus(403);
      });
    } else next(err);
  })
});

router.param('userId', function(req, res, next, userId) {
  Orders.findOrCreate({
    where: {
      userId: req.params.userId,
      status: 'Active'
    },
    include: [{
       model: Items,
       include: [Products]
    }]
  })
  .spread(function(order){
      req.order = order;
      next();
  })
  .catch(next);
});


//get the active order for a given user
router.get('/:userId', function(req, res, next){
  res.status(200).send(req.order);
});



//merges current cart items with those in the db
router.put('/:userId/merge', function(req, res, next){
  const updates = req.body.updates;
    var updatePromises = updates.map(function(update){
      Items.findOne({
        where : {
          productId: update.id,
          orderId: req.order.id
        }
      })
      .then(function(item){
        if (item){
          return item.update({ quantity: update.quantity});
        } else {
          return Items.create({ quantity: update.quantity})
          .then(function(created){
            return created.setOrder(req.order.id);
          })
          .then(function(created){
            return created.setProduct(update.id);
          });
        }
      });
    });

    Promise.all(updatePromises)
    .then(function(){
      res.status(200).send('updated');
    }).catch(next);
});

//checkout for users
router.put('/:userId/checkout', function(req, res, next){
  //array of items in cart -->can access each productId of item
  //do a request to find all items in an order, include Products-->use this to access product instances

  Items.findAll({ where: { orderId: req.order.id }, include: [Products]})
  .then(function(orderItems) {
    return orderItems.map(function(item){
      return item.product.reduceQuantity(item.quantity);
    });
  })
  .then(function(arrayOfPromises) {
    return Promise.all(arrayOfPromises);
  })
  .then(function(){
    return Promise.all([Orders.findById(req.order.id),
      OrderDetails.create({token: req.body.token, email: req.body.email})]);
  })
  .then(function([order, details]){
    return order.setOrderDetail(details.id);
  })
  .then(function(order) {
    return order.update({ status: 'Complete'});
  })
  .then(function() {
    res.sendStatus(201);
  })
  .catch(next);
});

//remove all items from a cart
router.delete('/:userId', function(req, res, next){
  Items.destroy({
    where: {
      orderId: req.order.id
    }
  })
  .then(function(){
    res.status(204).send("Cart emptied");
  });
});

//removes a specific item from an order
router.delete('/:userId/product/:productId', function(req, res, next){
  Items.destroy({
    where : {
      productId: req.params.productId,
      orderId: req.order.id
    }
  })
  .then(function(){
    res.status(204).send("Item deleted");
  })
});


module.exports = router;
