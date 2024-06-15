app.factory('configServices', ['$http', 'urlServices', 'messageService', function ($http, urlServices) {
	var estados = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RO", "RS", "RR", "SC", "SE", "SP", "TO"];

	return {
		getEstados: function () {
			return estados;
		},
		getCidades: function (uf) {
			return $http.get(urlServices.baseUrl + 'municipio/' + uf).then(function (response) {
				return response.data;
			}, function (error) {
				messageService.display('error', error.data || 'Verifique sua conexão com a internet ou entre em contato com o administrador.');
			});
		}
	}

}]);

app.directive('ngFiles', ['$parse', function ($parse) {

	function fn_link(scope, element, attrs) {
		var onChange = $parse(attrs.ngFiles);
		element.on('change', function (event) {
			onChange(scope, { $files: event.target.files });
		});
	};

	return {
		link: fn_link
	}
}])