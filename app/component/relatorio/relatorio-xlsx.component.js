relatorioXlsxController.$inject = ['$scope', 'authServices', 'configuracaoServices', 'crudServices', 'moment']
function relatorioXlsxController($scope, authServices, configuracaoServices, crudServices, moment) {
    var self = this;
    var userInfo = authServices.userInfo();
    var rotas = {
        'Receitas': 'relatorio/financeiro/receitas-xlsx', 'Despesas': 'relatorio/financeiro/despesas-xlsx', 'Projetos': 'relatorio/projeto/projetos-xls'
    }

    self.busy = null;
    self.data = { modelo: 'Despesas' };
    self.modelosList = ['Receitas', 'Despesas', 'Projetos'];
    self.dateOptions = configuracaoServices.rangePicker();

    $scope.$on('RELATORIO_XLSX_MODAL', () => {
        self.data = { modelo: 'Despesas' };
        $('#relatorioXlsxModal').modal('show');
    });

    self.download = function () {
        var token = userInfo.token || null;

        var params = {
            where: {
                periodo: {
                    startDate: self.data.periodo ? moment(self.data.periodo.startDate).format('YYYY-MM-DD') : '2000-01-01',
                    endDate: self.data.periodo ? moment(self.data.periodo.endDate).format('YYYY-MM-DD') : '2099-12-31'
                }
            }
        };
        var rota = rotas[self.data.modelo];
        var extra = '&token=' + token;
        self.busy = crudServices.download(rota, params, extra);
    }
}

app.component('relatorioXlsxComponent', {
    templateUrl: 'app/component/relatorio/relatorio-xlsx.component.html',
    controller: relatorioXlsxController
});