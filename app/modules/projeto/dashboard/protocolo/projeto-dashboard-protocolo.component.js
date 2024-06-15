projetoDashboardProtocoloController.$inject = ['$scope', '$routeParams', 'crudServices', 'messageService']
function projetoDashboardProtocoloController($scope, $routeParams, crudServices, messageService) {
    var self = this;
    var projetoId = $routeParams.id;

    self.data = {};

    self.$onInit = function () { self.load() };

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { projetoId }); }

    self.load = function () {
        if (projetoId) {
            self.busy = crudServices.get('projeto/protocolo/list/' + projetoId).then(function (data) {
                self.data = data;
            })
        }
    }

    self.concluirProtocolo = function () {
        messageService.confirm('Concluir Protocolo', 'Deseja concluir este protocolo?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.save('projeto/protocolo/update/concluir', { id: projetoId }).then(function (data) {
                    self.load();
                    $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
                    messageService.display('success', 'Protocolo concluído com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD_PROTOCOLAR', (event) => {
        self.load();
    });

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD_CONCLUIDO', (event) => {
        self.load();
    });
}

app.component('projetoDashboardProtocoloComponent', {
    templateUrl: 'app/modules/projeto/dashboard/protocolo/projeto-dashboard-protocolo.component.html',
    bindings: {
        projeto: '<',
    },
    controller: projetoDashboardProtocoloController
});