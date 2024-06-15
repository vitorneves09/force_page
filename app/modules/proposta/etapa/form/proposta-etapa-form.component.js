propostaEtapaFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function propostaEtapaFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('PROPOSTA_ETAPA_FORM_MODAL', (event, data) => {
        $('#modalEtapaProposta').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('proposta/etapa', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('proposta/etapa', self.data.id).then(function () {
                    $rootScope.$broadcast('PROPOSTA_ETAPA_FORM_MODAL_UPDATED');
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalEtapaProposta').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('proposta/etapa', formData).then(function () {
            $rootScope.$broadcast('PROPOSTA_ETAPA_FORM_MODAL_UPDATED');
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('proposta/etapa', formData).then(function (response) {
            $rootScope.$broadcast('PROPOSTA_ETAPA_FORM_MODAL_UPDATED', response.data);
            self.onUpdate({ item: response.data });
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('propostaEtapaFormComponent', {
    templateUrl: 'app/modules/proposta/etapa/form/proposta-etapa-form.component.html',
    bindings: { onUpdate: '&' },
    controller: propostaEtapaFormController
});