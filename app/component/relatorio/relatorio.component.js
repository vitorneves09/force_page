relatorioController.$inject = ['$scope', 'authServices', 'configuracaoServices', 'urlServices', 'crudServices', 'moment']
function relatorioController($scope, authServices, configuracaoServices, urlServices, crudServices, moment) {
    var self = this;

    self.busy = null;

    self.data = {};
    self.relatoriosList = [];
    self.agrupamentoList = [];

    self.dateOptions = configuracaoServices.rangePicker();

    var userInfo = authServices.userInfo();

    self.categoriaList = [
        {
            id: 1, nome: 'Projetos', relatorios: [
                { id: 'p1', nome: 'Valores Recebidos de Projetos', rota: 'relatorio/projeto/recebidos-no-periodo', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'p2', nome: 'Gastos com Projeto (Simples)', rota: 'relatorio/projeto/gastos-do-projeto-simples', params: '{"where":{"contrato":"{7}"}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'p3', nome: 'Gastos com Projeto (Detalhado)', rota: 'relatorio/projeto/gastos-do-projeto-detalhado', params: '{"where":{"contrato":"{7}"}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'p4', nome: 'Resumo de Propostas', rota: 'relatorio/projeto/resumo-de-propostas', params: '{"where":{"dataPeriodo":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
            ]
        },
        {
            id: 2, nome: 'Financeiro', relatorios: [
                { id: 'f7', nome: 'Despesas - Dia a Dia', rota: 'relatorio/financeiro/despesas-dia-a-dia', params: '{"where":{"dataReferencia":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'f1', nome: 'Despesas - Em aberto', rota: 'relatorio/financeiro/despesas-a-pagar', params: '{"where":{"dataVencimento":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'f2', nome: 'Despesas - Quitadas', rota: 'relatorio/financeiro/despesas-pagas', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'f3', nome: 'Receitas - Em aberto', rota: 'relatorio/financeiro/receitas-a-receber', params: '{"where":{"dataVencimento":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'f4', nome: 'Receitas - Quitadas', rota: 'relatorio/financeiro/receitas-pagas', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'f5', nome: 'Resumo Financeiro', rota: 'relatorio/financeiro/resumo-financeiro', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"}}}&cid={8}&token={9}&host=' + window.location.hostname },
            ]
        },
        {
            id: 3, nome: 'Plano de Contas', relatorios: [
                { id: 'g1', nome: 'Receitas', tipo: 'r', rota: 'relatorio/financeiro/receitas-agrupamento', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"},"plano1":{3},"plano2":{4},"plano3":{5},"plano4":{6}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'g2', nome: 'Despesas', tipo: 'd', rota: 'relatorio/financeiro/despesas-agrupamento', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"},"plano1":{3},"plano2":{4},"plano3":{5},"plano4":{6}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'g2', nome: 'Despesas - Em aberto', tipo: 'd', rota: 'relatorio/financeiro/despesas-agrupamento-aberto', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"},"plano1":{3},"plano2":{4},"plano3":{5},"plano4":{6}}}&cid={8}&token={9}&host=' + window.location.hostname },
                { id: 'g3', nome: 'Despesas - Quitadas', tipo: 'd', rota: 'relatorio/financeiro/despesas-agrupamento-pago', params: '{"where":{"dataPagamento":{"inicio":"{1}","fim":"{2}"},"plano1":{3},"plano2":{4},"plano3":{5},"plano4":{6}}}&cid={8}&token={9}&host=' + window.location.hostname },
            ]
        },
    ];


    $scope.$on('RELATORIO_MODAL', () => {
        self.data = {};
        $('#relatorioModal').modal('show');
    });

    self.setGrupos = function (newValue = {}) {
        var tipo = newValue.tipo;
        if (!tipo) return;
        self.busy = crudServices.get('financeiro/agrupamento', { where: { tipo: tipo } }).then(function (data) {
            if (!data.length) return;
            self.agrupamentoList[0] = data[0].agrupamentos;
            self.data.plano1 = data[0].id;
        });
    }

    self.setGrupo = function (nivel) {
        var plano = self.data['plano' + nivel];
        if (nivel == 2) {
            self.agrupamentoList[1] = [];
            self.agrupamentoList[2] = [];
            self.data["plano3"] = null;
            self.data["plano4"] = null;
        } else if (nivel == 3) {
            self.agrupamentoList[2] = [];
            self.data["plano4"] = null;
        }
        var grupo = self.agrupamentoList[nivel - 2].find(a => a.id == plano);
        if (grupo) self.agrupamentoList[nivel - 1] = grupo.agrupamentos;
    }

    self.changeCategoria = function (item) {
        if (!item) return;
        self.relatoriosList = angular.copy(item.relatorios);
    }

    self.visualizar = function () {
        var token = userInfo.token;
        var cid = userInfo.cid;

        var params = self.data.relatorio.params.format(
            null,
            self.data.periodo ? moment(self.data.periodo.startDate).format('YYYY-MM-DD') : '2000-01-01', // 1
            self.data.periodo ? moment(self.data.periodo.endDate).format('YYYY-MM-DD') : '2099-12-31', // 2
            self.data.plano1 || null, // 3
            self.data.plano2 || null, // 4
            self.data.plano3 || null, // 5
            self.data.plano4 || null, // 6
            self.data.contrato || null, // 7
            cid || null, // 8
            token || null, // 9
        );
        var rota = self.data.relatorio.rota;
        window.open(urlServices.baseUrl + rota + '?query=' + params, '_blank');
    }

}

app.component('relatorioComponent', {
    templateUrl: 'app/component/relatorio/relatorio.component.html',
    controller: relatorioController
});