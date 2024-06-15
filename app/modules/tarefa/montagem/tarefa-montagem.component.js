tarefaMontagemController.$inject = ['$scope', 'configuracaoServices', 'crudServices', 'messageService']
function tarefaMontagemController($scope, configuracaoServices, crudServices, messageService) {
    var self = this;
    self.tarefa = {};
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';

    $scope.$on('TAREFA_MONTAGEM_MODAL', (event, data) => {
        self.tarefa = data;
        self.data = [];
        self.documentoProjeto = [];
        self.busy = crudServices.get('tarefa/montagem/list/projeto/' + self.tarefa.id).then(function (data) {
            data.forEach(function (item) {
                item.checked = item.projetoMontagemUpload ? true : false;
            })
            self.documentoProjeto = data;
        })
        $('#modalTarefaMontagem').modal('show');
        self.load();
    });

    self.load = function () {
        crudServices.get('tarefa/montagem/list/' + self.tarefa.id).then(function (data) {
            self.data = data;
        })
    }

    self.openFileInput = function () {
        $("#tarefaMontagemFileInput").val('');
        $("#tarefaMontagemFileInput").click();
    }

    self.save = function () {

        var selecionados = self.documentoProjeto.filter(function (item) {
            return item.checked
        }).map(function (item) {
            return item.id
        })
        self.busy = crudServices.save('tarefa/montagem', { id: self.tarefa.id, selecionados }).then(function () {
            $('#modalTarefaMontagem').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        messageService.confirmInput('Informe a descrição do arquivo.', 'text').then(function (nome) {
            if (!nome) return;
            var formdata = new FormData();
            formdata.set('id', self.tarefa.id);
            formdata.set('nome', nome);
            formdata.set('doc', files[0]);
            self.busy = crudServices.doc('tarefa/montagem', formdata).then(function () {
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
                $scope.busy = crudServices.remove('tarefa/montagem', item.id).then(function () {
                    self.load();
                    messageService.display('success', 'Arquivo removido com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }
}

app.component('tarefaMontagemComponent', {
    templateUrl: 'app/modules/tarefa/montagem/tarefa-montagem.component.html',
    controller: tarefaMontagemController
});