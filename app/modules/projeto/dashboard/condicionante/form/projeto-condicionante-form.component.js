projetoCondicionanteFormController.$inject = ['$scope', 'crudServices', 'messageService'];
function projetoCondicionanteFormController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.usuariosList = [];

    $scope.$on('PROJETO_CONDICIONANTE_FORM_MODAL', (event, data) => {
        crudServices.get('usuario/list').then(function (usuarios) {
            self.usuariosList = usuarios;
            if (data.usuarioId) self.usuariosListApi.set(parseInt(data.usuarioId));
        });
        $('#modalProjetoCondicionante').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('projeto/condicionante', data.id)
                .then(function (data) { self.data = data; })
    });

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('projeto/condicionante', formData).then(function () {
            self.onUpdate();
            $('#modalProjetoCondicionante').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('projeto/condicionante', formData).then(function (response) {
            self.onUpdate();
            $('#modalProjetoCondicionante').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('projetoCondicionanteFormComponent', {
    templateUrl: 'app/modules/projeto/dashboard/condicionante/form/projeto-condicionante-form.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoCondicionanteFormController
});