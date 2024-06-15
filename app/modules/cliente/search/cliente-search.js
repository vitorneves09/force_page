app.controller('clienteSearchController', function ($rootScope, $scope, $location, $timeout, crudServices) {
	$scope.filter = {};

	$scope.load = function (options = {}) {
		$scope.busy = crudServices.get('cliente', options).then(function (data) {
			$scope.data = data.rows;
			$rootScope.$broadcast('PAGINATION_COUNT', { totalItems: data.count });
		});
	}

	$scope.search = function (reset = false) {
		if (reset) $scope.filter = {};
		$rootScope.$broadcast('PAGINATION_FILTER', angular.copy($scope.filter));
	}

	$scope.order = function (field) {
		$rootScope.$broadcast('PAGINATION_ORDER', angular.copy(field));
	}

	$scope.modal = function (modal, data = {}) { $scope.$broadcast(modal, data); }

	$scope.gotoCliente = (data) => {
		$timeout(function () { $location.url('pessoa/' + data.id); }, 1000);
	}
});
