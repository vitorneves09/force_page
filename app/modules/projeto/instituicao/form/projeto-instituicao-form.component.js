projetoInstituicaoFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function projetoInstituicaoFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('PROJETO_INSTITUICAO_FORM_MODAL', (event, data) => {
        $('#modalProjetoInstituicao').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('projeto/instituicao', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('projeto/instituicao', self.data.id).then(function () {
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalProjetoInstituicao').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('projeto/instituicao', formData).then(function () {
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('projeto/instituicao', formData).then(function (response) {
            self.onUpdate({ item: response.data });
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('projetoInstituicaoFormComponent', {
    templateUrl: 'app/modules/projeto/instituicao/form/projeto-instituicao-form.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoInstituicaoFormController
});