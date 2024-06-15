financeiroDespesaPagarFormController.$inject = ['$scope', '$filter', 'crudServices', 'messageService'];
function financeiroDespesaPagarFormController($scope, $filter, crudServices, messageService) {
    var self = this;
    self.formaPagamentoList = [];
    self.contaList = [];

    $scope.$on('DESPESA_PAGAR_FORM_MODAL', (event, data) => {
        $('#modalDespesaPagarForm').modal('show');
        self.data = {};

        crudServices.get('financeiro/forma-pagamento').then(function (data) {
            self.formaPagamentoList = data.rows;
        })

        crudServices.get('financeiro/conta').then(function (data) {
            self.contaList = data.rows;
        })

        self.busy = crudServices.getById('financeiro/despesa', data.id).then(function (data) {
            self.data = data;
            self.data.juros = 0;
            self.data.acrescimo = 0;
            self.data.desconto = 0;
            self.data.valorPago = self.data.valor;
            self.data.valorRenegociado = 0;
            self.data.dataRenegociada = null;
            self.data.opcaoPagamento = 'Total';
            self.data.dataPagamento = Date.now();
        })
    });

    self.hide = function () {
        $('#modalDespesaPagarForm').modal('hide');
    }

    self.calcValorPago = function () {
        var descontos = (self.data.juros || 0) + (self.data.acrescimo || 0) - (self.data.desconto || 0);
        self.data.valorPago = self.data.valor + descontos;
    }

    self.onOpcaoPagamento = function (value) {
        if (value == 'Parcial') {
            self.data.valorPago = 0;
            self.data.valorRenegociado = 0;
            self.data.dataRenegociada = null;
        } else {
            self.data.valorPago = self.data.valor;
            self.data.juros = 0;
            self.data.acrescimo = 0;
            self.data.desconto = 0;
            self.data.valorRenegociado = 0;
            self.data.dataRenegociada = null;
        }
    }

    self.save = function () {
        if (self.data.opcaoPagamento == 'Parcial') {
            pagamentoParcial();
            return;
        } else {
            pagamentoTotal();
            return;
        }
    }

    function pagamentoTotal() {
        var valorPago = self.data.valor + (self.data.juros || 0) + (self.data.acrescimo || 0) - (self.data.desconto || 0);

        if (self.data.valorPago != valorPago) return messageService.display('error', 'A soma dos valores não conferem com o valor da dívida.');

        messageService.confirm('Confirmar Pagamento', 'Deseja efetuar o pagamento desta conta no valor de\n' + $filter('finance')(self.data.valorPago, true, 2) + '?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.save('financeiro/despesa/pagar/total', self.data).then(function (data) {
                    self.onUpdate();
                    self.hide();
                    messageService.display('success', 'Conta paga com sucesso.');
                }).catch(function (erro) { messageService.display('error', erro.data) });

            }
        });

    }

    function pagamentoParcial() {
        messageService.confirm('Confirmar Pagamento',
            'Será realizado o pagamento no valor de ' + $filter('finance')(self.data.valorPago, true, 2) +
            ' e uma nova divida será criada no valor ' + $filter('finance')(self.data.valorRenegociado, true, 2) + ' com vencimento em ' + $filter('date')(self.data.dataRenegociada, 'dd/MM/yyyy')).then(function (result) {
                if (result.value) {
                    self.busy = crudServices.save('financeiro/despesa/pagar/parcial', self.data).then(function (data) {
                        self.onUpdate();
                        self.hide();
                        messageService.display('success', 'Conta paga com sucesso.');
                    }).catch(function (erro) { messageService.display('error', erro.data) });
                }
            });
    }

}

app.component('financeiroDespesaPagarFormComponent', {
    templateUrl: 'app/modules/financeiro/despesa/pagar/financeiro-despesa-pagar-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: financeiroDespesaPagarFormController
});