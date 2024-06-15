projetoMontagemDocumentoController.$inject = ['$scope', 'configuracaoServices', 'crudServices']
function projetoMontagemDocumentoController($scope, configuracaoServices, crudServices) {
    var self = this;
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';
    self.montagem = {};
    self.clienteId = null;

    $scope.$on('MONTAGEM_DOCUMENTO_MODAL', (event, data, clienteId) => {
        self.data = [];
        self.montagem = data;
        self.clienteId = clienteId;
        self.busy = crudServices.get('projeto/montagem/list/documento/' + data.id).then(function (data) {
            self.data = data;
        })
        $('#modalMontagemDocumento').modal('show');
    });
}

app.component('projetoMontagemDocumentoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/montagem/documento/projeto-montagem-documento.component.html',
    controller: projetoMontagemDocumentoController
});