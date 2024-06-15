app.controller('imprimirController',
	function ($scope, $routeParams, configuracaoServices, crudServices, $sce) {
		var id = $routeParams.id;
		$scope.cdnUrl = configuracaoServices.cdnUrl;
		$scope.hostname = configuracaoServices.hostname;
		$scope.tipo = $routeParams.tipo;
		$scope.hoje = new Date();

		$scope.alfabeto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'z'];

		$scope.condicionantes = { paga: [], gratis: [], cliente: [] }

		$scope.trustAsHtml = function (string) {
			return $sce.trustAsHtml(string);
		};

		if ($scope.tipo == 'proposta') {
			$scope.busy = crudServices.getById('proposta/imprimir', id).then(function (data) {
				$scope.empresa = data.empresa;
				$scope.proposta = data.proposta;
			});
		}

		else if ($scope.tipo == 'reciboReceita') {
			$scope.busy = crudServices.getById('financeiro/receita', id).then(function (data) {
				$scope.recibo = data;
			});
		}

	});
