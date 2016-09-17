app.config(function($stateProvider) {
    $stateProvider.state('checkout', {
        url: '/checkout',
        templateUrl: 'js/checkout/checkout.html',
        controller: 'CartCtrl',
        resolve: {
            products: function($sessionStorage, ProductFactory) {
                let products = [];
                if ($sessionStorage.cart) {
                    for (var i = 0; i < $sessionStorage.cart.length; i++) {
                        ProductFactory.getProduct($sessionStorage.cart[i].id)
                            .then(function(product) {


                                for (var i2 = 0; i2 < products.length; i2++) {
                                    if (products[i2].id === product.id) {
                                        var inCart = true;
                                    }
                                }
                                if (!inCart) {
                                    product.totalCost = $sessionStorage.cart[i2].quantity * product.price;
                                    products.push(product);
                                }
                            });
                    }
                }
                return products;
            }
        }
    });
});
