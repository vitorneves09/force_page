financeiroTransferenciaFormController.$inject = ['$scope', '$filter', 'crudServices', 'messageService'];
function financeiroTransferenciaFormController($scope, $filter, crudServices, messageService) {
    var self = this;
    self.contasList = [];

    $scope.$on('FINANCEIRO_TRANSFERENCIA_FORM_MODAL', (event, data) => {
        $('#modalFinanceiroTransferenciaForm').modal('show');
        self.data = {};

        crudServices.get('financeiro/conta/list').then(function (data) {
            self.contasList = data;
        })

        self.busy = crudServices.getById('financeiro/transferencia', data.id).then(function (data) {
            self.data = data;
        })
    });

    self.hide = function () {
        $('#modalFinanceiroTransferenciaForm').modal('hide');
    }

    self.save = function () {
        messageService.confirm('Confirmar Transferência', 'Deseja efetuar a transferência no valor de\n' + $filter('finance')(self.data.valor, true, 2) + '?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.add('financeiro/transferencia', self.data).then(function (data) {
                    self.onUpdate();
                    self.hide();
                    messageService.display('success', 'Transferência efetuada com sucesso.');
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.delete = function () {
        messageService.confirm('Confirmar Exclusão', 'A transferência será excluida.').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('financeiro/transferencia', self.data.id).then(function () {
                    self.onUpdate();
                    self.hide();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }
}

app.component('financeiroTransferenciaFormComponent', {
    templateUrl: 'app/modules/financeiro/transferencia/form/financeiro-transferencia-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: financeiroTransferenciaFormController
});