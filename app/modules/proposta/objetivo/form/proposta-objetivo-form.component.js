propostaObjetivoFormController.$inject = ['$scope', 'crudServices', 'messageService'];
function propostaObjetivoFormController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('PROPOSTA_OBJETIVO_FORM_MODAL', (event, data) => {
        $('#modalObjetivoProposta').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('proposta/objetivo', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('proposta/objetivo', self.data.id).then(function () {
                    self.onUpdate();
                    $('#modalObjetivoProposta').modal('hide');
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('proposta/objetivo', formData).then(function () {
            self.onUpdate();
            $('#modalObjetivoProposta').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('proposta/objetivo', formData).then(function (response) {
            self.onUpdate({ item: response.data });
            $('#modalObjetivoProposta').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('propostaObjetivoFormComponent', {
    templateUrl: 'app/modules/proposta/objetivo/form/proposta-objetivo-form.component.html',
    bindings: { onUpdate: '&' },
    controller: propostaObjetivoFormController
});