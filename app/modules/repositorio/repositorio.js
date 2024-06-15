app.controller('repositorioController',
    function ($scope, crudServices, configuracaoServices) {
        $scope.fileUrl = configuracaoServices.cdnUrl + 'clientes/';
        $scope.dateOptions = configuracaoServices.rangePicker();
        $scope.hoje = moment().format('YYYY-MM-DD');
        $scope.statusList = ['A Vencer', 'Vencidas'];

        $scope.load = function (options = {}) {
            $scope.busy = crudServices.get('repositorio', options).then(function (data) {
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

    }
);