app.controller('tarefaController', function ($scope, crudServices, messageService) {

    var concluirRota = { 'Execução' : 'tarefa/update/concluir-execucao', 'Montagem' : 'tarefa/update/concluir-montagem', 'Condicionante' : 'tarefa/update/concluir-condicionante' };
    $scope.load = function (options = {}) {
        $scope.busy = crudServices.get('tarefa').then(function (data) {
            $scope.data = data;
        });
    }

    $scope.load();

    $scope.concluir = function (tarefa) {
        messageService.confirm('Concluir', 'Você deseja concluir esta tarefa?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.save(concluirRota[tarefa.origem], { id: tarefa.id }).then(function () {
                    $scope.load();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    $scope.modal = function (modal, data) { $scope.$broadcast(modal, data) }
});