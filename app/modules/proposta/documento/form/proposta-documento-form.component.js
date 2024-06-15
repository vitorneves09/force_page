propostaDocumentoFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function propostaDocumentoFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('PROPOSTA_DOCUMENTO_FORM_MODAL', (event, data) => {
        $('#modalDocumentoProposta').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('proposta/documento', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('proposta/documento', self.data.id).then(function () {
                    $rootScope.$broadcast('PROPOSTA_DOCUMENTO_FORM_MODAL_UPDATED');
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalDocumentoProposta').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('proposta/documento', formData).then(function () {
            $rootScope.$broadcast('PROPOSTA_DOCUMENTO_FORM_MODAL_UPDATED');
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('proposta/documento', formData).then(function (response) {
            $rootScope.$broadcast('PROPOSTA_DOCUMENTO_FORM_MODAL_UPDATED', response.data);
            self.onUpdate({ item: response.data });
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('propostaDocumentoFormComponent', {
    templateUrl: 'app/modules/proposta/documento/form/proposta-documento-form.component.html',
    bindings: { onUpdate: '&' },
    controller: propostaDocumentoFormController
});