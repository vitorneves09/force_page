projetoDashboardMontagemController.$inject = ['$scope', '$routeParams', 'crudServices']
function projetoDashboardMontagemController($scope, $routeParams, crudServices) {
    var self = this;
    var projetoId = $routeParams.id;

    self.data = {};

    self.$onInit = function () { self.load() };

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { projetoId }, self.projeto.clienteId); }

    self.load = function () {
        if (projetoId) {
            self.busy = crudServices.get('projeto/montagem/list/' + projetoId).then(function (data) {
                self.data = data;
            })
        }
    }

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD_CONCLUIDO', (event) => {
        self.load();
    });
}

app.component('projetoDashboardMontagemComponent', {
    templateUrl: 'app/modules/projeto/dashboard/montagem/projeto-dashboard-montagem.component.html',
    bindings: {
        projeto: '<',
    },
    controller: projetoDashboardMontagemController
});