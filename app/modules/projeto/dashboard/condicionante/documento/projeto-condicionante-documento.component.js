projetoCondicionanteDocumentoController.$inject = ['$scope', 'configuracaoServices', 'crudServices', 'messageService']
function projetoCondicionanteDocumentoController($scope, configuracaoServices, crudServices, messageService) {
    var self = this;
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';
    self.condicionante = {};
    self.clienteId = null;

    $scope.$on('CONDICIONANTE_DOCUMENTO_MODAL', (event, data, clienteId) => {
        self.data = [];
        self.condicionante = data;
        self.clienteId = clienteId;
        self.busy = crudServices.get('projeto/condicionante/list/documento/' + data.id).then(function (data) {
            self.data = data;
        })
        $('#modalCondicionanteDocumento').modal('show');
    });

    self.urlArquivo = function (item) {
        return self.fileUrl + self.condicionante.clienteId + '/projetos/' + self.condicionante.projetoId + '/condicionantes/' + self.condicionante.id + '/' + item.arquivo;
    }
}

app.component('projetoCondicionanteDocumentoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/condicionante/documento/projeto-condicionante-documento.component.html',
    controller: projetoCondicionanteDocumentoController
});