app.controller('financeiroReceitaController',
	function ($scope, moment, crudServices, configuracaoServices, messageService, urlServices) {

		$scope.dateOptions = configuracaoServices.rangePicker();
		$scope.hoje = moment().format('YYYY-MM-DD');
		$scope.statusList = ['Quitadas', 'A Vencer', 'Vencidas'];
		$scope.filter = {situacaoFinanceiro: ['A Vencer', 'Vencidas']};

		$scope.modal = function (modal, data = {}) { $scope.$broadcast(modal, data); }

		$scope.load = function (options = {}) {
			$scope.busy = crudServices.get('financeiro/receita', options).then(function (data) {
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

		$scope.pessoaList = {
			url: urlServices.baseUrl + 'cliente/search',
			transformResponse: function (data) {
				return angular.fromJson(data);
			}
		};

		$scope.alterarVencimentoReceita = function (item) {
			if (item.valorPago) return;
			messageService.confirmInput('Alterar data de vencimento da parcela #' + item.id + '?', 'date').then(function (data) {
				if (data) {
					var update = { id: item.id, dataVencimento: data };
					$scope.busy = crudServices.save('financeiro/receita/update/data-vencimento', update).then(function (data) {
						messageService.display('success', 'Data de vencimento alterada com sucesso.');
						$scope.load();
					}).catch(function (erro) { messageService.display('error', erro.data) });
				}
			});
		}

	});