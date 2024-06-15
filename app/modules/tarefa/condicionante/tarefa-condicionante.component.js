tarefaCondicionanteController.$inject = ['$scope', 'configuracaoServices', 'crudServices', 'messageService']
function tarefaCondicionanteController($scope, configuracaoServices, crudServices, messageService) {
    var self = this;
    self.tarefa = {};
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';

    $scope.$on('TAREFA_CONDICIONANTE_MODAL', (event, data) => {
        self.tarefa = data;
        self.data = [];
        self.documentoProjeto = [];
        self.busy = crudServices.get('tarefa/condicionante/list/projeto/' + self.tarefa.id).then(function (data) {
            self.documentoProjeto = data;
        })
        $('#modalTarefaCondicionante').modal('show');
        self.load();
    });

    self.load = function () {
        crudServices.get('tarefa/condicionante/list/' + self.tarefa.id).then(function (data) {
            self.data = data;
        })
    }

    self.openFileInput = function () {
        $("#tarefaCondicionanteFileInput").val('');
        $("#tarefaCondicionanteFileInput").click();
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        messageService.confirmInput('Informe a descrição do arquivo.', 'text').then(function (nome) {
            if (!nome) return;
            var formdata = new FormData();
            formdata.set('id', self.tarefa.id);
            formdata.set('nome', nome);
            formdata.set('doc', files[0]);
            self.busy = crudServices.doc('tarefa/condicionante/documento', formdata).then(function () {
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
                $scope.busy = crudServices.remove('tarefa/condicionante/documento', item.id).then(function () {
                    self.load();
                    messageService.display('success', 'Arquivo removido com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }
}

app.component('tarefaCondicionanteComponent', {
    templateUrl: 'app/modules/tarefa/condicionante/tarefa-condicionante.component.html',
    controller: tarefaCondicionanteController
});