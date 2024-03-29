'use strict';

app.config(function ($stateProvider) {
    $stateProvider.state('adminHome', {
        url: '/admin/home',
        templateUrl: 'js/admin/admin-home.html',
        controller: 'AdminCtrl',
        resolve: {
          categories: function(Products) {
            return Products.getAllCategories();
          },
          products: function(Products) {
            return Products.fetchAll()
          },
          users: function(AdminFactory) {
            return AdminFactory.getUsers();
          }
      }
    });

    $stateProvider.state('adminHome.productList', {
        templateUrl: 'js/admin/product-list.html',
        controller: 'AdminCtrl',
        param: {products: null}
    });

    $stateProvider.state('adminHome.addProduct', {
        templateUrl: 'js/admin/add-product.html',
        controller: 'AdminCtrl',
    });

    $stateProvider.state('adminHome.addCategory', {
        templateUrl: 'js/admin/add-category.html',
        controller: 'AdminCtrl',
    });

    $stateProvider.state('adminHome.allUsers', {
        templateUrl: 'js/admin/all-user.html',
        controller: 'AdminCtrl',
    });
});
