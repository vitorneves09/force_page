propostaTabFinanceiroComponentController.$inject = ['$scope', 'calculoServices', 'crudServices', 'messageService']
function propostaTabFinanceiroComponentController($scope, calculoServices, crudServices, messageService) {
    var self = this;

    self.agrupamentosList = [];
    self.formaPagamentoList = [];
    self.formaCobrancaList = [];

    $scope.$on('PROPOSTA_FORM_MODAL_IS_READY', function (event, data) {
        self.agrupamentosList[1] = [];
        self.agrupamentosList[2] = [];

        crudServices.get('financeiro/agrupamento', { where: { tipo: "r" } }).then((agrupamentos) => {
            self.agrupamentosList[0] = agrupamentos[0].agrupamentos;
            self.data.financeiro.agrupamentoId1 = agrupamentos[0].id;
            self.setAgrupamento(2, false);
            self.setAgrupamento(3, false);
        })

        crudServices.get('financeiro/forma-pagamento/list').then((data) => {
            self.formaPagamentoList = data;
        })

        crudServices.get('proposta/forma-cobranca/list').then((data) => {
            self.formaCobrancaList = data;
        })
    });

    self.setAgrupamento = function (nivel, reset = true) {
        var agrupamentoId = self.data.financeiro['agrupamentoId' + nivel]
        if (nivel == 2) {
            self.agrupamentosList[1] = [];
            self.agrupamentosList[2] = [];
            if (reset) {
                self.data.financeiro.agrupamentoId3 = null;
                self.data.financeiro.agrupamentoId4 = null;
            }
        } else if (nivel == 3) {
            self.agrupamentosList[2] = [];
            if (reset)
                self.data.financeiro["agrupamentoId4"] = null;
        }
        var item = self.agrupamentosList[nivel - 2].find(a => a.id == agrupamentoId);
        if (item) self.agrupamentosList[nivel - 1] = item.agrupamentos;
    }

    self.makeParcelas = function () {
        self.data.financeiro.parcela = angular.copy(calculoServices.makeParcelas(self.data.financeiro));
        self.makeDatas();
    }

    self.makeDatas = function () {
        var entrada = self.data.financeiro.primeiraParcela;
        self.data.financeiro = calculoServices.makeDatas(self.data.financeiro, entrada);
    }

    self.remakeParcelas = function (tipo, pos) {
        var valorTotal = self.data.financeiro.valor;
        var parcela = self.data.financeiro.parcela[pos];
        self.data.financeiro.parcela[pos] = calculoServices.remakeParcela(tipo, pos, valorTotal, parcela);
    }
}

app.component('propostaTabFinanceiroComponent', {
    templateUrl: 'app/modules/proposta/form/tabs/financeiro/proposta-tab-financeiro.component.html',
    bindings: {
        onUpdate: '&',
        data: '='
    },
    controller: propostaTabFinanceiroComponentController
});