financeiroReceitaTituloFormController.$inject = ['$scope', 'moment', 'crudServices', 'messageService']
function financeiroReceitaTituloFormController($scope, moment, crudServices, messageService) {
    var self = this;
    self.totalParcelas = 0;
    self.totalRecebido = 0;
    self.gruposList = [];
    self.pessoasList = [];
    self.projetosList = [];


    $scope.$on('RECEITA_TITULO_FORM_MODAL', (event, data) => {
        crudServices.get('cliente/list').then(function (clientes) {
            self.pessoasList = clientes;
            if(data.clienteId) self.pessoasListApi.set(parseInt(data.clienteId));
        });
        crudServices.get('projeto/list').then(function (projetos) {
            self.projetosList = projetos;
        });
        $('#modalReceitaForm').modal('show');
        self.data = {
            dataEmissao: moment().startOf('day').toDate(),
            dataEntrada: moment().startOf('day').toDate(),
            parcelas: 1,
            valor: 0,
        }
        self.gruposList[0] = [];
        self.gruposList[1] = [];
        self.gruposList[2] = [];
        if (data.id) {
            self.busy = crudServices.getById('financeiro/titulo/receita', data.financeiroTituloId).then(function (titulo) {
                titulo.dataEmissao = moment(titulo.dataEmissao).startOf('day').toDate();
                titulo.dataEntrada = moment(titulo.dataEntrada).startOf('day').toDate();
                titulo.financeiroReceitas = titulo.financeiroReceitas.map(function (item) { item.dataVencimento = moment(item.dataVencimento).startOf('day').toDate(); return item; })
                self.data = titulo;
                self.setGrupos();
                self.calcTotalParcelas();
            })
        } else {
            self.setGrupos();
        }
    });

    self.setGrupos = function () {
        self.busy = crudServices.get('financeiro/agrupamento', { where: { tipo: "r" } }).then(function (data) {
            if (!data.length) return;
            self.gruposList[0] = data[0].agrupamentos;
            self.data.agrupamentoId1 = data[0].id;

            if (self.data.agrupamentoId2) self.setGrupo(2, false);
            if (self.data.agrupamentoId3) self.setGrupo(3, false);
        })
    }

    self.setGrupo = function (nivel, reset = true) {
        var local = 'agrupamentoId';
        var grupolist = 'gruposList';

        var agrupamentoId = self.data[local + nivel]
        if (nivel == 2) {
            self[grupolist][1] = [];
            self[grupolist][2] = [];
            reset ? self.data[local + "3"] = null : '';
            reset ? self.data[local + "4"] = null : '';
        } else if (nivel == 3) {
            self[grupolist][2] = [];
            reset ? self.data[local + "4"] = null : '';
        }
        var grupo = self[grupolist][nivel - 2].find(a => a.id == agrupamentoId);
        if (grupo) self[grupolist][nivel - 1] = grupo.agrupamentos;
    }

    self.makeParcelas = function () {

        if (!self.data.valor || !self.data.parcelas) return;

        if (self.data.parcelas > 240) {
            messageService.display('error', 'O limite de parcelas é de no maximo 240.');
            self.data.parcelas = 1;
        }

        var valorTotal = self.data.valor || 0;
        var QtdParcelas = self.data.parcelas;
        var valorParcela = (valorTotal / QtdParcelas).cFloat();
        var retorno = [];

        var valorTotalParcelas = 0;

        for (var i = 0; i < QtdParcelas; i++) {
            var tempData = moment(self.data.dataEntrada).add(i, 'months').startOf('day').toDate();
            var temp = {
                dataVencimento: tempData,
                valor: valorParcela,
                numero: i + 1,
            };
            valorTotalParcelas += valorParcela;
            retorno.push(temp);
        }

        var diferenca = valorTotal - valorTotalParcelas;
        if (QtdParcelas && diferenca) {
            retorno[(QtdParcelas - 1)].valor += diferenca;
        }
        self.data.financeiroReceitas = retorno;
        self.calcTotalParcelas();
    }

    self.makeData = function () {
        var parcelas = self.data.parcelas;

        for (var i = 0; i < parcelas; i++) {
            var tempData = moment(self.data.dataEntrada).add(i, 'months').startOf('day').toDate();
            self.data.financeiroReceitas[i].dataVencimento = tempData;
        }

        self.data.financeiroReceitas = self.data.financeiroReceitas;
    }

    self.calcTotalParcelas = function () {
        self.totalParcelas = 0;
        self.totalRecebido = 0;
        self.data.financeiroReceitas.forEach(function (item) {
            self.totalParcelas += item.valorPago || item.valor;
            self.totalRecebido += item.valorPago;
        })
    }

    self.save = function () {
        self.calcTotalParcelas();
        if (self.totalParcelas.cFloat() != self.data.valor) {
            return messageService.display('warning', 'A soma das parcelas devem ser iguais ao valor do total da receita.');
        }

        self.data.id ? save() : add();
    }

    self.delete = function () {
        messageService.confirm('Confirmar Exclusão', 'Este titulo será excluido.').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('financeiro/titulo/receita', self.data.id).then(function () {
                    self.onUpdate();
                    $('.modal').modal('hide');
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.cancelarRecebimento = function (parcela) {
        messageService.confirm('Cancelar Recebimento', 'O pagamento da parcela de numero #' + parcela.numero + ' será cancelado.').then(function (result) {
            if (result.value) {
                self.busy = crudServices.save('financeiro/receita/update/cancelar-recebimento', { id: parcela.id }).then(function () {
                    self.onUpdate();
                    crudServices.getById('financeiro/titulo/receita', self.data.id).then(function (titulo) {
                        titulo.dataEmissao = moment(titulo.dataEmissao).startOf('day').toDate();
                        titulo.dataEntrada = moment(titulo.dataEntrada).startOf('day').toDate();
                        titulo.financeiroReceitas = titulo.financeiroReceitas.map(function (item) { item.dataVencimento = moment(item.dataVencimento).startOf('day').toDate(); return item; })
                        self.data = titulo;
                        self.calcTotalParcelas();
                    })
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    self.showParcelaNumero = function (parcela) {
        var text = parcela.numero;
        if (parcela.financeiroReceita) {
            text += '.' + parcela.financeiroReceita.numero;
        }
        return text;
    }

    self.imprimirReciboReceita = function (id) {
        window.open('#/financeiro/receita/recibo/' + id, '_blank');
    }

    function save() {
        self.busy = crudServices.save('financeiro/titulo/receita', self.data).then(function (data) {
            $('.modal').modal('hide');
            self.onUpdate();
            messageService.display('success', 'Receita atualizada com sucesso.');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        self.busy = crudServices.add('financeiro/titulo/receita', self.data).then(function (titulo) {
            $('.modal').modal('hide');
            self.onUpdate();
            messageService.display('success', 'Receita cadastrada com sucesso.');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }


}

app.component('financeiroReceitaTituloFormComponent', {
    templateUrl: 'app/modules/financeiro/receita/titulo/financeiro-receita-titulo-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: financeiroReceitaTituloFormController
});