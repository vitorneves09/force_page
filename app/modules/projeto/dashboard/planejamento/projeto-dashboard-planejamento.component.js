projetoDashboardPlanejamentoController.$inject = ['$rootScope', '$scope', '$routeParams', 'configuracaoServices', 'crudServices', 'messageService']
function projetoDashboardPlanejamentoController($rootScope, $scope, $routeParams, configuracaoServices, crudServices, messageService) {
    var self = this;
    var projetoId = $routeParams.id;

    self.data = {};
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';

    self.$onInit = function () { self.load() };

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { projetoId }); }

    self.load = function () {
        if (projetoId)
            self.busy = crudServices.get('projeto/planejamento/list/' + projetoId).then(function (data) {
                self.data = data;
            })
    }

    self.openFileInput = function () {
        $("#projetoDashboardPlanejamentoFileInput").val('');
        $("#projetoDashboardPlanejamentoFileInput").click();
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        messageService.confirmInput('Informe o título do arquivo.', 'text').then(function (titulo) {
            if (!titulo) return;
            var formdata = new FormData();
            formdata.set('projetoId', projetoId);
            formdata.set('titulo', titulo);
            formdata.set('doc', files[0]);
            self.busy = crudServices.doc('projeto/planejamento', formdata).then(function () {
                self.load();
                messageService.display('success', 'Arquivo enviado com sucesso.');
            }).catch(function (erro) {
                messageService.display('error', erro.data);
            });
        });
    }

    self.removeFile = function (documento) {
        messageService.confirm('Excluir', 'Deseja remover o documento ' + documento.titulo + '?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('projeto/planejamento', documento.id).then(function (data) {
                    self.load();
                    messageService.display('success', 'Arquivo removido com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }

    self.concluirPlanejamento = function () {
        messageService.confirm('Concluir Planejamento', 'Deseja concluir o planejamento do projeto?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.save('projeto/planejamento/update/concluir', { id: projetoId }).then(function (data) {
                    $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
                    messageService.display('success', 'Planejamento concluído com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }
}

app.component('projetoDashboardPlanejamentoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/planejamento/projeto-dashboard-planejamento.component.html',
    bindings: {
        projeto: '<',
    },
    controller: projetoDashboardPlanejamentoController
});