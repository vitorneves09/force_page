financeiroContaExtratoController.$inject = ['$scope', 'moment', 'crudServices', 'messageService', 'configuracaoServices'];
function financeiroContaExtratoController($scope, moment, crudServices, messageService, configuracaoServices) {
    var self = this;
    self.data = null;
    self.contasList = [];
    self.filter = {};

    self.dateOptions = configuracaoServices.rangePicker();

    $scope.$on('FINANCEIRO_CONTA_EXTRATO_MODAL', (event, data = {}) => {
        self.filter.fimDoDia = 'Não';
        self.filter.data = {
            startDate: moment().startOf('month'),
            endDate: moment().endOf('month')
        }
        crudServices.get('financeiro/conta/list').then(contas => {
            self.contasList = contas;
            self.filter.contaId = data.id;
        });

        $('#modalFinanceiroContaExtrato').modal('show');
        self.filtrar(data.id);
    });

    self.hide = function () {
        $('#modalFinanceiroContaExtrato').modal('hide');
    }

    self.filtrar = function (id) {
        var where = { where: { id: id || self.filter.contaId, data: { inicio: self.filter.data.startDate.format('YYYY-MM-DD'), fim: self.filter.data.endDate.format('YYYY-MM-DD') } } }
        self.busy = crudServices.get('financeiro/conta/extrato', where).then(function (data) {
            self.data = data;
        })
    }

}

app.component('financeiroContaExtratoComponent', {
    templateUrl: 'app/modules/financeiro/conta/extrato/financeiro-conta-extrato.component.html',
    controller: financeiroContaExtratoController
});