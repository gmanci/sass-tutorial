var app = angular.module('dawgCoffee', ['ui.router'])
   .service("cart", function() {

      var cart = [];

      //gets data from session saves to cart object
      if(typeof(Storage) !== "undefined") {
        if (localStorage.getItem("cart")) {
          var cartString = localStorage.getItem("cart");
          cart = JSON.parse(cartString);
          console.log(cart);
        };
      } else {
          // Sorry! No Web Storage support..
      }

      //this saves the changes to the session
      this.save = function () {
        if(typeof(Storage) !== "undefined") {
          var cartString = JSON.stringify(cart);
          localStorage.setItem("cart", cartString);
        } else {
            // Sorry! No Web Storage support..
        }
      };

      this.get = function() {
        return cart;
      }

      //this adds a new item
      this.add = function (product, amount, grind) {

        var found = false;
        var item = {
            product : product,
            amount : amount,
            grind : grind
        };

        angular.forEach(cart, function(value, key) {

          if(value.product === product) {
            found = true;
            // console.log("found");
            if(value.grind === grind) {
              value.amount += amount;
            } else {
              cart.push(item);
            }
          }
        });

        if(found === false) {
          cart.push(item);
        }

        this.save();
      };

      this.update = function (newCart) {
        this.cart = newCart;
        console.log(this.cart);
        this.save();
      };

      this.remove = function (index) {
        cart.splice(index, 1);
        this.save();
      }

      this.calcTotal = function () {
        var total = 0;
        angular.forEach(cart, function(value, key) {
          total += (value.product.price * value.amount);
        });
        return total;
      }

      this.empty = function () {
        this.cart = [];
        localStorage.removeItem("cart");
      }
   })

   .controller('MainController', ['$scope', '$state', '$http', 'cart' , function($scope, $state, $http, $cart) {

      $scope.cart = $cart.get();
      $scope.total = 0;
      $scope.total = $cart.calcTotal();

      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $scope.spinner = true;
      });
      $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.spinner = false;
      });
      $http.get('data/products.json')
         .then(function(result){
            $scope.products = result.data;
          });

      $scope.addToCart = function () {
        // console.log(this.product);
        $cart.add(this.product, this.amount, this.grind);
        $scope.cart = $cart.get();
        $scope.total = $cart.calcTotal();
        this.orderForm.$setPristine();
        this.amount = 1;
        this.grind = "";
      }

      $scope.updateItem = function () {
        $cart.update($scope.cart);
        $scope.cart = $cart.get();
        $scope.total = $cart.calcTotal();
      }

      $scope.removeItem = function (cartIndex) {
        console.log(cartIndex);
        $cart.remove(cartIndex);
        $scope.cart = $cart.get();
        $scope.total = $cart.calcTotal();
        console.log($scope.cart);
      }

      $scope.submitCart = function () {
        $scope.cart = [];
        $cart.empty();
        $scope.total = 0;
      }
   }])

   .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
     //
     // For any unmatched url, redirect to /state1
     $urlRouterProvider.otherwise("/");
     // $locationProvider.html5Mode(true);

     //
     // Now set up the states
     $stateProvider
      .state('Order', {
        url: "/orders",
        templateUrl: "partials/order.html"
      })
      .state('Cart', {
        url: "/orders/cart",
        templateUrl: "partials/cart.html"
      })
      .state('Details', {
        url: "/orders/:beanId",
        templateUrl: "partials/details.html",
        controller : function($scope, $stateParams) {
            $scope.beanId = $stateParams.beanId;

         }
      })
       .state('Home', {
         url: "/:jumpPoint",
         templateUrl: "partials/home.html",
         controller : function($scope, $stateParams, $location, $anchorScroll) {
            $location.hash($stateParams.jumpPoint);
            $anchorScroll();
            $location.hash('');

         }
       })

    });

  // configure html5 to get links working on jsfiddle
