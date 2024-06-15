app.controller('financeiroPlanoContaController', function ($scope, messageService, crudServices) {

	$scope.load = function (options = {}) {
		$scope.busy = crudServices.get('financeiro/agrupamento', options).then(function (data) {
			$scope.data = data;
		});
	}

	$scope.load();

	$scope.modal = function (modal, data = {}, posicao, edit = true) {
		var dataModal = edit ? angular.copy(data) : { agrupamentoId: data.id, posicao: posicao, pai: data.nome, nome: '' }
		$scope.$broadcast(modal, dataModal);
	}

	$scope.remove = function (data) {
		messageService.confirm('Confirmar Exclusão', 'Deseja excluir o registro ' + data.nome + '?').then(function (result) {
			if (result.value) {
				$scope.busy = crudServices.remove('financeiro/agrupamento', data.id).then(function () {
					messageService.display('success', data.nome + ' removido com sucesso.');
					$scope.load();
				}).catch(function (erro) { messageService.display('error', erro.data) });
			}
		})
	}

});