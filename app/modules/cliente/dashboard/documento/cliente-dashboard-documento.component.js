clienteDashboardDocumentoController.$inject = ['$scope', '$routeParams', 'configuracaoServices', 'crudServices', 'messageService']
function clienteDashboardDocumentoController($scope, $routeParams, configuracaoServices, crudServices, messageService) {
    var self = this;
    var clienteId = $routeParams.id;

    self.data = {};
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/' + clienteId + '/documentos/';

    self.$onInit = function () { self.load() };

    self.load = function () {
        if (clienteId)
            crudServices.get('cliente/documento/' + clienteId).then(function (data) {
                self.data = data;
            })
    }

    self.openFileInput = function () {
        $("#clienteDashboardFileInput").val('');
        $("#clienteDashboardFileInput").click();
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        messageService.confirmInput('Informe a descrição do arquivo.', 'text').then(function (descricao) {
            if (!descricao) return;
            var formdata = new FormData();
            formdata.set('id', clienteId);
            formdata.set('descricao', descricao);
            formdata.set('doc', files[0]);
            self.busy = crudServices.doc('cliente/documento', formdata).then(function () {
                self.load();
                messageService.display('success', 'Arquivo enviado com sucesso.');
            }).catch(function (erro) {
                messageService.display('error', erro.data);
            });
        });
    }

    self.remove = function (documento) {
        messageService.confirm('Excluir', 'Deseja remover o arquivo ' + documento.nome + '?').then(function (result) {
            if (result.value) {
                $scope.busy = crudServices.remove('cliente/documento', documento.id).then(function (data) {
                    self.load();
                    messageService.display('success', 'Arquivo removido com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }
}

app.component('clienteDashboardDocumentoComponent', {
    templateUrl: 'app/modules/cliente/dashboard/documento/cliente-dashboard-documento.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clienteDashboardDocumentoController
});