app.controller('financeiroTransferenciaController',
	function ($scope, moment, crudServices, configuracaoServices, messageService, urlServices) {

		$scope.dateOptions = configuracaoServices.rangePicker();
		$scope.filter = {};
		$scope.contasList = [];

		crudServices.get('financeiro/conta/list').then(contas => {
			$scope.contasList = contas;
		});

		$scope.modal = function (modal, data = {}) { $scope.$broadcast(modal, data); }

		$scope.load = function (options = {}) {
			$scope.busy = crudServices.get('financeiro/transferencia', options).then(function (data) {
				$scope.data = data.rows;
				$scope.$broadcast('PAGINATION_COUNT', { totalItems: data.count });
			});
		}

		$scope.search = function (reset = false) {
			if (reset) $scope.filter = {};
			$scope.$broadcast('PAGINATION_FILTER', angular.copy($scope.filter));
		}

		$scope.order = function (field) {
			$scope.$broadcast('PAGINATION_ORDER', angular.copy(field));
		}

	});