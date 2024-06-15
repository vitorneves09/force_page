propostaClausulaContratadoFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function propostaClausulaContratadoFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('PROPOSTA_CLAUSULA_CONTRATADO_FORM_MODAL', (event, data) => {
        $('#modalClausulaContratadoProposta').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('proposta/clausula-contratado', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('proposta/clausula-contratado', self.data.id).then(function () {
                    $rootScope.$broadcast('PROPOSTA_CLAUSULA_CONTRATADO_FORM_MODAL_UPDATED');
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalClausulaContratadoProposta').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('proposta/clausula-contratado', formData).then(function () {
            $rootScope.$broadcast('PROPOSTA_CLAUSULA_CONTRATADO_FORM_MODAL_UPDATED');
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('proposta/clausula-contratado', formData).then(function (response) {
            $rootScope.$broadcast('PROPOSTA_CLAUSULA_CONTRATADO_FORM_MODAL_UPDATED', response.data);
            self.onUpdate({ item: response.data });
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('propostaClausulaContratadoFormComponent', {
    templateUrl: 'app/modules/proposta/clausula-contratado/form/proposta-clausula-contratado-form.component.html',
    bindings: { onUpdate: '&' },
    controller: propostaClausulaContratadoFormController
});