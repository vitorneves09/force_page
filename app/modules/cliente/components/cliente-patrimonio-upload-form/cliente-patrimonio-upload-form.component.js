clientePatrimonioUploadFormController.$inject = ['$scope', 'configuracaoServices', 'crudServices', 'messageService']
function clientePatrimonioUploadFormController($scope, configuracaoServices, crudServices, messageService) {
    var self = this;
    self.patrimonio = {};
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';

    $scope.$on('CLIENTE_PATRIMONIO_UPLOAD_FORM_MODAL', (event, data) => {
        self.patrimonio = data;
        self.data = [];
        $('#modalClientePatrimonioUploadForm').modal('show');
        self.load();
    });

    self.load = function () {
        self.busy = crudServices.get('cliente/patrimonio/documento/' + self.patrimonio.id).then(function (data) {
            self.data = data;
        })
    }

    self.openFileInput = function () {
        $("#clientePatrimonioUploadDashboardFileInput").val('');
        $("#clientePatrimonioUploadDashboardFileInput").click();
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        messageService.confirmInput('Informe a descrição do arquivo.', 'text').then(function (descricao) {
            if (!descricao) return;
            var formdata = new FormData();
            formdata.set('id', self.patrimonio.id);
            formdata.set('descricao', descricao);
            formdata.set('doc', files[0]);
            self.busy = crudServices.doc('cliente/patrimonio/documento/', formdata).then(function () {
                self.load();
                messageService.display('success', 'Arquivo enviado com sucesso.');
            }).catch(function (erro) {
                messageService.display('error', erro.data);
            });
        });
    }

    self.remove = function (item) {
        messageService.confirm('Excluir', 'Deseja remover o arquivo ' + item.nome + '?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('cliente/patrimonio/documento', item.id).then(function () {
                    self.load();
                    messageService.display('success', 'Arquivo removido com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }
}

app.component('clientePatrimonioUploadFormComponent', {
    templateUrl: 'app/modules/cliente/components/cliente-patrimonio-upload-form/cliente-patrimonio-upload-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clientePatrimonioUploadFormController
});