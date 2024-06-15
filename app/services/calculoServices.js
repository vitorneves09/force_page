app.factory('calculoServices', [function () {

    return {
        makeParcelas: makeParcelas,
        remakeParcela: remakeParcela,
        makeDatas: makeDatas
    }

    function makeParcelas(financeiro) {
        var valorTotal = financeiro.valor || 0;
        var QtdParcelas = financeiro.parcelas;
        var valorParcela = (valorTotal / QtdParcelas).cFloat();
        var porcentagem = percentage(valorTotal, valorParcela);

        var retorno = [];
        var ValorTotalParcelas = 0;

        for (var i = 0; i < QtdParcelas; i++) {

            var tempData = moment(financeiro.dataEntrada).add(i, 'months').format('YYYY-MM-DD');

            var temp = {
                data: tempData,
                valor: valorParcela,
                porcentagem: porcentagem,
                financeiroFormaPagamentoId: null,
                propostaFormaCobrancaId: 2,
            };

            ValorTotalParcelas += valorParcela;

            retorno.push(temp);
        }

        var diferenca = valorTotal - ValorTotalParcelas;
        if (QtdParcelas && diferenca) {
            retorno[(QtdParcelas - 1)].valor += diferenca;
        }
        return retorno;
    }

    function remakeParcela(tipo, pos, valorTotal, pagamento) {
        if (tipo == 'p') {
            pagamento.valor = (valorTotal * (pagamento.porcentagem * 100)) / 100;
        } else {
            pagamento.porcentagem = ((pagamento.valor * 100) / valorTotal) / 100;
        }
        return pagamento;
    }

    function makeDatas(financeiro, primeiraParcela) {
        var parcelas = financeiro.parcelas;
        var count = 0;

        for (var i = count; i < parcelas; i++) {
            var tempData = moment(financeiro.dataEntrada).add(i, 'months').format('YYYY-MM-DD');
            financeiro.parcela[i].data = tempData;
            financeiro.parcela[i].numero = (i + 1);
        }
        return financeiro;
    }

    function percentage(total, parcel) {
        // Retorna porcentagem de 0 a 1, EX: 0.5 = 50% (Devido a mascara)
        return ((parcel * 100) / total) / 100;
    }

}]);