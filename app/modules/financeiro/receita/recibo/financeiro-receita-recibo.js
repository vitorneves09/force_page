app.controller('financeiroReceitaReciboController',
    function ($scope, $routeParams, configuracaoServices, crudServices) {
        var id = $routeParams.id;
        $scope.cdnUrl = configuracaoServices.cdnUrl;
        $scope.hostname = configuracaoServices.hostname;
        $scope.hoje = new Date();

        crudServices.getById('empresa', 0).then(function (data) {
            $scope.empresa = data;
        });

        $scope.busy = crudServices.getById('financeiro/receita/recibo', id).then(function (data) {
            $scope.data = data;
        });


    });
