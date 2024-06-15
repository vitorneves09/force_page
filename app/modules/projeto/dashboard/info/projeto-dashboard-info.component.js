projetoDashboardInfoController.$inject = ['$rootScope', 'configuracaoServices', 'crudServices', 'messageService'];
function projetoDashboardInfoController($rootScope, configuracaoServices, crudServices, messageService) {
    var self = this;
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';


    self.concluirProjeto = function () {
        messageService.confirm('Concluir', 'O projeto esta finalizado e deseja conclui-lo?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.save('projeto/update/concluir', { id: self.projeto.id }).then(function (data) {
                    $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
                    $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD_CONCLUIDO');
                    messageService.display('success', 'Projeto concluído com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }

}

app.component('projetoDashboardInfoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/info/projeto-dashboard-info.component.html',
    bindings: {
        projeto: '<',
    },
    controller: projetoDashboardInfoController
});