tarefaDocumentoController.$inject = ['$scope', 'configuracaoServices', 'crudServices', 'messageService']
function tarefaDocumentoController($scope, configuracaoServices, crudServices, messageService) {
    var self = this;
    self.tarefa = {};
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';

    $scope.$on('TAREFA_DOCUMENTO_MODAL', (event, data) => {
        self.tarefa = data;
        self.data = [];
        self.documentoProjeto = [];
        self.documentoPlanejamento = [];
        crudServices.get('tarefa/documento/list/planejamento/' + self.tarefa.id).then(function (data) {
            self.documentoPlanejamento = data;
        })
        self.busy = crudServices.get('tarefa/documento/list/projeto/' + self.tarefa.id).then(function (data) {
            self.documentoProjeto = data;
        })
        $('#modalTarefaDocumento').modal('show');
        self.load();
    });

    self.load = function () {
        crudServices.get('tarefa/documento/list/' + self.tarefa.id).then(function (data) {
            self.data = data;
        })
    }

    self.openFileInput = function () {
        $("#tarefaDocumentoFileInput").val('');
        $("#tarefaDocumentoFileInput").click();
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        messageService.confirmInput('Informe a descrição do arquivo.', 'text').then(function (nome) {
            if (!nome) return;
            var formdata = new FormData();
            formdata.set('id', self.tarefa.id);
            formdata.set('nome', nome);
            formdata.set('doc', files[0]);
            self.busy = crudServices.doc('tarefa/documento', formdata).then(function () {
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
                $scope.busy = crudServices.remove('tarefa/documento', item.id).then(function () {
                    self.load();
                    messageService.display('success', 'Arquivo removido com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }
}

app.component('tarefaDocumentoComponent', {
    templateUrl: 'app/modules/tarefa/documento/tarefa-documento.component.html',
    controller: tarefaDocumentoController
});