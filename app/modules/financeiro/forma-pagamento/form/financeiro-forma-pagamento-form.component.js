financeiroFormaPagamentoFormController.$inject = ['$scope', 'crudServices', 'messageService'];
function financeiroFormaPagamentoFormController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('FINANCEIRO_FORMA_PAGAMENTO_FORM_MODAL', (event, data) => {
        $('#modalFinanceiroFormaPagamento').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('financeiro/forma-pagamento', data.id)
                .then(function (data) { self.data = data; })
    });

    self.remove = function () {
        messageService.confirm('Confirme a exclusão!', 'Você realmente deseja excluir este registro?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('financeiro/forma-pagamento', self.data.id).then(function () {
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.hide = function () {
        $('#modalFinanceiroFormaPagamento').modal('hide');
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('financeiro/forma-pagamento', formData).then(function () {
            self.onUpdate();
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('financeiro/forma-pagamento', formData).then(function (response) {
            self.onUpdate({ item: response.data });
            self.hide();
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('financeiroFormaPagamentoFormComponent', {
    templateUrl: 'app/modules/financeiro/forma-pagamento/form/financeiro-forma-pagamento-form.component.html',
    bindings: { onUpdate: '&' },
    controller: financeiroFormaPagamentoFormController
});