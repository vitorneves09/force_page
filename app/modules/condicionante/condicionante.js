app.controller('condicionanteController',
    function ($scope, crudServices, $location) {
        $scope.hoje = moment().format('YYYY-MM-DD');
        $scope.statusList = ['Atribuição', 'Andamento', 'Concluído'];
        $scope.filter = { status : ['Atribuição', 'Andamento'] };

        $scope.load = function (options = {}) {
            $scope.busy = crudServices.get('projeto/condicionante', options).then(function (data) {
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

        $scope.modal = function (modal, data = {}) { $scope.$broadcast(modal, data); }

        $scope.visualizarProjeto = function (item) {
            $location.url('projeto/' + item.projetoId);
        }

    }
);