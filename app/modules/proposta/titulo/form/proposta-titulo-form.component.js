propostaTituloFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function propostaTituloFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('PROPOSTA_TITULO_FORM_MODAL', (event, data = {}) => {
        self.data = data;
        $('#modalTituloProposta').modal('show');
        if (data.id)
            self.busy = crudServices.getById('proposta/titulo', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('proposta/titulo', self.data.id).then(function () {
                    $rootScope.$broadcast('PROPOSTA_TITULO_FORM_MODAL_UPDATED');
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalTituloProposta').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('proposta/titulo', formData).then(function () {
            $rootScope.$broadcast('PROPOSTA_TITULO_FORM_MODAL_UPDATED');
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('proposta/titulo', formData).then(function (response) {
            $rootScope.$broadcast('PROPOSTA_TITULO_FORM_MODAL_UPDATED', response.data);
            self.onUpdate({ item: response.data });
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('propostaTituloFormComponent', {
    templateUrl: 'app/modules/proposta/titulo/form/proposta-titulo-form.component.html',
    bindings: { onUpdate: '&' },
    controller: propostaTituloFormController
});