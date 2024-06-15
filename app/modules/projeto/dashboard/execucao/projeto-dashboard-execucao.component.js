projetoDashboardExecucaoController.$inject = ['$scope', '$routeParams', 'crudServices']
function projetoDashboardExecucaoController($scope, $routeParams, crudServices) {
    var self = this;
    var projetoId = $routeParams.id;

    self.data = {};

    self.$onInit = function () { self.load() };

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { projetoId }, self.projeto.clienteId); }

    self.load = function () {
        if (projetoId) {
            self.busy = crudServices.get('projeto/etapa/list/' + projetoId).then(function (data) {
                self.data = data;
            })
        }
    }

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD_CONCLUIDO', (event) => {
        self.load();
    });

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD_PROTOCOLAR', (event) => {
        self.load();
    });
}

app.component('projetoDashboardExecucaoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/execucao/projeto-dashboard-execucao.component.html',
    bindings: {
        projeto: '<',
    },
    controller: projetoDashboardExecucaoController
});