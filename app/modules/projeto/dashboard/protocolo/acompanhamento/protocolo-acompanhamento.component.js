protocoloAcompanhamentoController.$inject = ['$scope', 'crudServices', 'messageService']
function protocoloAcompanhamentoController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.registro = false;
    self.form = null;
    self.protocolo = null;

    $scope.$on('PROTOCOLO_ACOMPANHAMENTO_MODAL', function (event, data) {
        self.registro = false;
        self.form = { projetoProtocoloId: data.id };
        self.data = [];
        self.protocolo = data;
        $('#modalProtocoloAcompanhamento').modal('show');
        loadData();
    });

    self.changeRegistro = function () {
        self.registro = !self.registro;
    }

    self.save = function () {
        self.busy = crudServices.add('projeto/protocolo/acompanhamento', self.form).then(function (data) {
            loadData();
            self.onUpdate();
            self.registro = false;
            self.form.memorando = null;
        }).catch(function (erro) { messageService.display('error', erro.data); });
    }

    function loadData() {
        self.busy = crudServices.getById('projeto/protocolo/acompanhamento', self.protocolo.id).then(function (data) {
            self.data = data;
        }).catch(function (erro) { messageService.display('error', erro.data); });
    }
}

app.component('protocoloAcompanhamentoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/protocolo/acompanhamento/protocolo-acompanhamento.component.html',
    controller: protocoloAcompanhamentoController,
    bindings: {
        onUpdate: '&'
    }
});