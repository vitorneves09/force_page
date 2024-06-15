projetoExecucaoDocumentoController.$inject = ['$scope', 'configuracaoServices', 'crudServices', 'messageService']
function projetoExecucaoDocumentoController($scope, configuracaoServices, crudServices, messageService) {
    var self = this;
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';
    self.etapa = {};
    self.clienteId = null;

    $scope.$on('EXECUCAO_DOCUMENTO_MODAL', (event, data, clienteId) => {
        self.data = [];
        self.etapa = data;
        self.clienteId = clienteId;
        self.busy = crudServices.get('projeto/documento/list/etapa/' + data.id).then(function (data) {
            self.data = data;
        })
        $('#modalExecucaoDocumento').modal('show');
    });
}

app.component('projetoExecucaoDocumentoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/execucao/documento/projeto-execucao-documento.component.html',
    controller: projetoExecucaoDocumentoController
});