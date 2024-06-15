propostaTabGeralComponentController.$inject = ['$rootScope', '$scope', '$filter', 'crudServices', 'messageService']
function propostaTabGeralComponentController($rootScope, $scope, $filter, crudServices, messageService) {
    var self = this;

    self.patrimoniosList = [];
    self.propostaTitulosList = [];
    self.modeloList = [];
    self.numeroContrato = null;

    $scope.$on('PROPOSTA_FORM_MODAL_IS_READY', function (event, data) {
        crudServices.get('info/numero-proposta').then(function (response) {
            self.numeroContrato = response;
        });
        crudServices.get('cliente/patrimonio/lista/' + data.clienteId).then(function (patrimonio) {
            self.patrimoniosList = patrimonio;
            self.data.patrimonioId = data.patrimonioId;
        });
        crudServices.get('proposta/modelo').then(function (response) {
            self.modeloList = response.rows;
            self.data.propostaModeloId = data.propostaModeloId;
        });
        self.loadTitulo({ id: data.propostaTituloId });
    });

    $scope.$on('PROPOSTA_TITULO_FORM_MODAL_UPDATED', function (event, data) { self.loadTitulo(data) });

    self.loadTitulo = function (item) {
        crudServices.get('proposta/titulo').then(function (data) {
            self.propostaTitulosList = data.rows;
            if (item) self.data.propostaTituloId = item.id;
        });
    }

    self.addPropostaTitulo = function (input) { $rootScope.$broadcast('PROPOSTA_TITULO_FORM_MODAL', { "nome": input }); }

    self.onDocumento = function () {
        if (self.data.tipoDoc == 'cliente')
            self.busy = crudServices.getById('cliente', self.data.clienteId).then(function (data) { self.data.documento = data.documento })
        else if (self.data.tipoDoc == 'patrimonio') {
            if (!self.data.patrimonioId) {
                messageService.display('warning', 'Esta opção necessita que um patrimônio seja escolhido antes de ser utilizada.');
                self.data.tipoDoc = '';
                self.data.documento = null;
            }
            else
                self.busy = crudServices.getById('patrimonio', self.data.patrimonioId).then(function (data) { self.data.documento = data.documento })
        }
        else
            self.data.documento = null;
    }

    self.onModelo = function (modelo) {
        if (!modelo || self.data.propostaModeloId == modelo.id) return;
        self.data.etapaValor = [];
        self.data.custoValor = [];
        self.data.documentoValor = [];
        self.data.contratanteValor = [];
        self.data.contratadoValor = [];

        self.busy = crudServices.getById('proposta/modelo', modelo.id).then(function (data) {
            self.data.objetivo = data.objetivo.descricao;
            self.data.etapaValor = data.etapa.map(function (etapa) {
                return { propostaEtapaId: etapa.id, prazo: etapa.prazo };
            })
            self.data.custoValor = data.custo.map(function (custo) {
                return { propostaCustoId: custo.id, valor: 0 };
            })

            self.data.documentoValor = data.documento.map(function (documento) {
                return { propostaDocumentoId: documento.id, valor: 0 };
            })

            self.data.contratanteValor = data.clausulaContratante.map(function (contratante) {
                return { propostaContratanteId: contratante.id };
            })

            self.data.contratadoValor = data.clausulaContratado.map(function (contratado) {
                return { propostaContratadoId: contratado.id };
            })
        })
    }

}

app.component('propostaTabGeralComponent', {
    templateUrl: 'app/modules/proposta/form/tabs/geral/proposta-tab-geral.component.html',
    bindings: {
        onUpdate: '&',
        data: '='
    },
    controller: propostaTabGeralComponentController
});