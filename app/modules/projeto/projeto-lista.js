app.controller('projetoListaController', function ($scope, crudServices) {
    $scope.statusPlanejamentoList = ['Pendente', 'Concluído','Encerrado'];
    $scope.statusAtribuicaoList = ['Pendente', 'Concluído','Encerrado'];
    $scope.statusExecucaoList = ['Andamento', 'Concluído','Encerrado'];
    $scope.statusMontagemList = ['Pendente', 'Andamento', 'Concluído','Encerrado'];
    $scope.statusProtocoloList = ['Pendente', 'Pendência', 'Acompanhamento','Concluído'];
    $scope.statusList = ['Andamento', 'Concluído', 'Cancelado'];
    $scope.statusPrazoList = ['A Vencer', 'Vencidas'];
    $scope.filter = {};

    $scope.hoje = moment().format('YYYY-MM-DD');

    $scope.load = function (options = {}) {
        $scope.busy = crudServices.get('projeto', options).then(function (data) {
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