projetoMontagemFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function projetoMontagemFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.usuariosList = [];

    $scope.$on('PROJETO_MONTAGEM_FORM_MODAL', (event, data) => {
        crudServices.get('usuario/list').then(function (usuarios) {
            self.usuariosList = usuarios;
            if (data.usuarioId) self.usuariosListApi.set(parseInt(data.usuarioId));
        });
        $('#modalProjetoMontagem').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('projeto/montagem', data.id)
                .then(function (data) { self.data = data; })
    });

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        self.busy = crudServices.save('projeto/montagem', self.data).then(function () {
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
            $('#modalProjetoMontagem').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        self.busy = crudServices.add('projeto/montagem', self.data).then(function (response) {
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
            $('#modalProjetoMontagem').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }

    self.delete = function () {
        messageService.confirm('Confirmar Exclusão', 'Esta etapa da montagem será excluida.').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('projeto/montagem', self.data.id).then(function () {
                    self.onUpdate();
                    $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
                    $('#modalProjetoMontagem').modal('hide');
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }


}

app.component('projetoMontagemFormComponent', {
    templateUrl: 'app/modules/projeto/dashboard/montagem/form/projeto-montagem-form.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoMontagemFormController
});