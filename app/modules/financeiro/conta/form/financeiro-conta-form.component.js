financeiroContaFormController.$inject = ['$scope', 'crudServices', 'messageService'];
function financeiroContaFormController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('FINANCEIRO_CONTA_FORM_MODAL', (event, data = {}) => {
        $('#modalFinanceiroContaForm').modal('show');
        self.data = data;
        if (data.id)
            self.busy = crudServices.getById('financeiro/conta', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('financeiro/conta', self.data.id).then(function () {
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalFinanceiroContaForm').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('financeiro/conta', formData).then(function () {
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('financeiro/conta', formData).then(function (response) {
            self.onUpdate({ item: response.data });
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('financeiroContaFormComponent', {
    templateUrl: 'app/modules/financeiro/conta/form/financeiro-conta-form.component.html',
    bindings: { onUpdate: '&' },
    controller: financeiroContaFormController
});