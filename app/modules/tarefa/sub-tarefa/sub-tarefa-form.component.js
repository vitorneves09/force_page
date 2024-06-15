subTarefaFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function subTarefaFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('SUB_TAREFA_FORM_MODAL', (event, data = {}) => {
        self.data = data;
        $('#modalSubTarefa').modal('show');
        if (data.id)
            self.busy = crudServices.getById('tarefa/sub-tarefa', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Excluir', 'Você deseja excluir esta sub-tarefa?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('tarefa/sub-tarefa', self.data.id).then(function () {
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.concluir = function () {
        messageService.confirm('Concluir', 'Você deseja concluir esta sub-tarefa?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.save('tarefa/sub-tarefa/update/concluir', self.data).then(function () {
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalSubTarefa').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        self.busy = crudServices.save('tarefa/sub-tarefa', self.data).then(function () {
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        self.busy = crudServices.add('tarefa/sub-tarefa', self.data).then(function (response) {
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('subTarefaFormComponent', {
    templateUrl: 'app/modules/tarefa/sub-tarefa/sub-tarefa-form.component.html',
    bindings: { onUpdate: '&' },
    controller: subTarefaFormController
});