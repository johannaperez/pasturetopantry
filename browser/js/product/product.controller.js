'use strict';

app.controller('ProductCtrl', function($scope, ProductFactory, $log, $sessionStorage, product, Session) {
    $scope.product = product;
    $scope.userId = Session.user ? Session.user.id : null;

    $scope.Range = function(start, end) {
        var result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

    if (!$sessionStorage.cart) {
        Session.resetSessionCart();
    }

    $scope.addToCart = function(id, quantity) {
        let items = $sessionStorage.cart.map(item => item.id);
        let addedItemIdx = items.indexOf(id);
        if (addedItemIdx !== -1) {
            $sessionStorage.cart[addedItemIdx].quantity += quantity;
        } else if (addedItemIdx === -1 || !$sessionStorage.cart.length){
            $sessionStorage.cart.push({ id: id, quantity: quantity });
        }
    };
});
