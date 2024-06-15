clienteDashboardPropostaController.$inject = ['$rootScope','$scope', '$routeParams', 'configuracaoServices', 'crudServices', 'messageService']
function clienteDashboardPropostaController($rootScope, $scope, $routeParams, configuracaoServices, crudServices, messageService) {
    var self = this;
    var clienteId = $routeParams.id;
    var propostaAssinadaId = null;
    var fileUrl = configuracaoServices.cdnUrl + 'clientes/';
    self.filter = {};
    self.data = [];

    //PAGINATION
    self.currentPage = 1;
    self.totalItems = 0;
    self.itemsPerPage = 10;

    var options = {
        order: ['contrato', 'DESC'],
        limit: self.itemsPerPage,
        offset: 0
    };

    self.change = function () {
        options.offset = self.currentPage == 1 ? 0 : (self.currentPage * self.itemsPerPage) - self.itemsPerPage;
        self.load();
    }

    self.order = function (field) {
        if (!options.order || options.order[0] != field) options.order = [field, 'DESC'];
        else { options.order[1] = options.order[1] == 'DESC' ? 'ASC' : 'DESC' }
        self.currentPage = 1;
        options.offset = 0;
        self.load();
    }

    self.search = function (data) {
        self.filter = data;
        options.where = {...data};
        self.load();
    }
    //END PAGINATION

    self.$onInit = function () { self.load(); }

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { clienteId }); }

    self.load = function () {
        if (!clienteId) return;
        self.busy = crudServices.get('proposta/cliente/' + clienteId, options).then(function (data) {
            self.data = data.rows;
            self.totalItems = data.count;
        });
    }

    self.emitirProposta = function (proposta) {
        var title = proposta.contrato + ' - Confirmar Emissão';
        messageService.confirm(title).then(function (result) {
            if (result.value) {
                crudServices.save('proposta/update/emitir', { id: proposta.id }).then(function () {
                    messageService.display('success', 'Proposta alterada para EMITIDA com sucesso.');
                    self.load();
                });
            }
        });
    }

    self.entregarProposta = function (proposta) {
        var title = proposta.contrato + ' - Entregue ao Cliente';
        var inputType = 'date';
        messageService.confirmInput(title, inputType).then(function (data) {
            if (data) {
                crudServices.save('proposta/update/entrega', { id: proposta.id, data }).then(function () {
                    messageService.display('success', 'Entrega confirmada.');
                    self.load();
                });
            }
        });
    }

    self.concluirProposta = function (proposta) {
        var title = proposta.contrato + ' - Assinada pelo Cliente ';
        var inputType = 'date';
        messageService.confirmInput(title, inputType).then(function (data) {
            if (data) {
                crudServices.save('proposta/update/concluir', { id: proposta.id, data }).then(function () {
                    messageService.display('success', 'Proposta assinada.');
                    $rootScope.$broadcast('ON_UPDATE_PROPOSTA');
                    self.load();
                });
            }
        });
    }

    self.imprimirPropostaAssinada = function (proposta) {
        if (proposta.arquivo) {
            window.open(fileUrl + proposta.clienteId + '/propostas/' + proposta.id + '/' + proposta.arquivo, '_blank');
        } else {
            var title = proposta.contrato + ' - Arquivo da Proposta';
            var message = 'Você ainda não enviou o arquivo assinado da proposta. Gostaria de enviá-lo agora?'
            messageService.confirm(title, message).then(function (result) {
                if (result.value) {
                    propostaAssinadaId = proposta.id;
                    $("#propostaAssinaturaFileInput").val('');
                    $("#propostaAssinaturaFileInput").click();
                }
            });
        }
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        var formdata = new FormData();
        formdata.set('id', propostaAssinadaId);
        formdata.set('doc', files[0]);
        self.busy = crudServices.doc('proposta/update/arquivo', formdata).then(function () {
            self.load();
            messageService.display('success', 'Arquivo enviado com sucesso.');
        }).catch(function (erro) {
            messageService.display('error', erro.data);
        });
    }

    self.imprimirProposta = function (proposta) {
        window.open('#/imprimir/proposta/' + proposta.id, '_blank');
    }

    $scope.$on('ON_UPDATE_PATRIMONIO', (event) => {
        self.load();
    });

}

app.component('clienteDashboardPropostaComponent', {
    templateUrl: 'app/modules/cliente/dashboard/proposta/cliente-dashboard-proposta.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clienteDashboardPropostaController
});