app.controller('projetoDashboardController', function ($scope, $routeParams, crudServices) {
	var projetoId = $routeParams.id;
	$scope.data = {};

	$scope.load = function () {
		if (projetoId) {
			crudServices.getById('projeto', projetoId).then(function (data) {
				$scope.data = data;
			})
		}
	}

	$scope.load();

	$scope.$on('ON_UPDATE_PROJETO_DASHBOARD', (event) => {
        $scope.load();
    });

});
