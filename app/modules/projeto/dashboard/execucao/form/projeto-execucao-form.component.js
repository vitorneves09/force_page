projetoExecucaoFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function projetoExecucaoFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.usuariosList = [];

    $scope.$on('PROJETO_EXECUCAO_FORM_MODAL', (event, data) => {
        crudServices.get('usuario/list').then(function (usuarios) {
            self.usuariosList = usuarios;
            if (data.usuarioId) self.usuariosListApi.set(parseInt(data.usuarioId));
        });
        $('#modalProjetoExecucao').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('projeto/etapa', data.id)
                .then(function (data) { self.data = data; })
    });

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('projeto/etapa', formData).then(function () {
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
            $('#modalProjetoExecucao').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('projeto/etapa', formData).then(function (response) {
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
            $('#modalProjetoExecucao').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }

    self.delete = function () {
        messageService.confirm('Confirmar Exclusão', 'Esta etapa da execução será excluida.').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('projeto/etapa', self.data.id).then(function () {
                    self.onUpdate();
                    $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
                    $('#modalProjetoExecucao').modal('hide');
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }


}

app.component('projetoExecucaoFormComponent', {
    templateUrl: 'app/modules/projeto/dashboard/execucao/form/projeto-execucao-form.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoExecucaoFormController
});