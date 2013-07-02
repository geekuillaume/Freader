angular.module('backend', ['ngResource']).
    factory('User', function($resource) {
      var User = $resource('/api/user');
      return User;
    });

angular.module('Freader', ['backend'])
	.config(function ($routeProvider) {
		$routeProvider.
			when("/", {controller: loginCtrl, templateUrl: 'partials/loginView.html'}).
			when("/feeds", {controller: feedsCtrl, templateUrl: 'partials/feedsView.html'}).
			otherwise({redirectTo:'/'});
	});


function loginCtrl($scope, $resource, $location) {
	if (connected)
		return $location.path("/feeds");

	var action = "login";
	var loginText = {
		action: "Login",
		changeAction: "No account ? Register here"
	};
	var registerText = {
		action: "Register",
		changeAction: "Already have an account ? Login here"
	};

	$scope.text = (action == "login") ? loginText : registerText;

	$scope.changeAction = function() {
		action = (action == "login") ? "register" : "login";
		$scope.text = (action == "login") ? loginText : registerText;
	};

	$scope.action = function() {
		delete $scope.errorMsg;
		var infos = {
			email: $scope.email,
			password: $scope.password
		}
		if (action == "login")
			$resource('/api/login').get(infos, actionSuccess, actionFail);
		else
			$resource('/api/user').save(infos, actionSuccess, actionFail);
	}

	actionSuccess = function() {
		connected = true;
		$location.path("/feeds");
	}
	actionFail = function (response) {
		if (action == "login" && response.status == 401)
			$scope.errorMsg = "Wrong email or password";
		else if (action == "register" && response.status == 409)
			$scope.errorMsg = "Email already registered";
		else
			$scope.errorMsg = "Can't connect to server";
		console.log('Fail !');
	}
}

function feedsCtrl($scope, $resource, $location) {
	if (!connected)
		return $location.path("/");


	$scope.disconnect = function() {
		$resource('/api/login').delete({}, function () {
			connected = false;
			$location.path("/");
		});
	}

	$scope.feeds = $resource('/api/feeds').query();

	$scope.addFeed = function() {
		var newFeed = $resource('/api/feed').save({url: $scope.newFeedUrl}, function () {
			console.log("Feed added !");
			delete $scope.addErrorText;
			$scope.feeds.push(newFeed);
			$scope.showNewFeed = false;
			$scope.newFeedUrl = "";
		}, function (response) {
			if (response.status == 400)
				$scope.addErrorText = response.data;
			else
				$scope.addErrorText = "Cannot connect to server";
		});
		return true;
	}

	$scope.deleteFeed = function(feed) {
		$resource('/api/feed/' + feed._id).delete({}, function() {
			var indexof = $scope.feeds.indexOf(feed);
			$scope.feeds.splice(indexof, 1);
		});
	}

}
