app.controller('propostaModeloController', function ($scope, messageService, crudServices) {
	var lastFindOptions = {};

	$scope.paginationCount = 0;
	$scope.paginationOrder = ['nome', 'ASC'];
	$scope.paginationFilter = {};
	$scope.filter = {};

	$scope.load = function (findOptions) {
		lastFindOptions = findOptions ? findOptions : lastFindOptions;
		$scope.busy = crudServices.get('proposta/modelo', lastFindOptions).then(function (data) {
			$scope.data = data.rows;
			$scope.paginationCount = data.count;
		});
	}

	$scope.search = function (reset = false) {
		if (reset) $scope.filter = {};
		$scope.paginationFilter = angular.copy($scope.filter)
	}

	$scope.modal = function (modal, data = {}) { $scope.$broadcast(modal, data); }
});