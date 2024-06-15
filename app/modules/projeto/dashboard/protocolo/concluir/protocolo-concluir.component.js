protocoloConcluirFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function protocoloConcluirFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.file = null;
    self.protocolo = null;
    self.modosList = ['Até o vencimento', 'Uma única vez'];

    $scope.$on('PROTOCOLO_CONCLUIR_MODAL', (event, data) => {
        $('#modalProtocoloConcluir').modal('show');
        self.protocolo = data || {};
        self.data = {
            condicionantes: [],
        }
    });

    self.addFile = function (files) {
        self.file = files[0] || null;
    }

    self.save = function () {
        var formdata = new FormData();
        formdata.set('projetoProtocoloId', self.protocolo.id);
        formdata.set('identificador', self.data.identificador);
        formdata.set('dataAssinatura', self.data.dataAssinatura);
        formdata.set('dataVencimento', self.data.dataVencimento);
        formdata.set('projetoCondicionantes', JSON.stringify(self.data.condicionantes));
        formdata.set('doc', self.file);
        self.busy = crudServices.doc('projeto/protocolo/update/concluir', formdata).then(function () {
            $('#modalProtocoloConcluir').modal('hide');
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
            messageService.display('success', 'Protocolo concluído com sucesso');
        }).catch(function (erro) {
            messageService.display('error', erro.data);
        });
    }

    self.removerCondicionante = function (index) { self.data.condicionantes.splice(index, 1); };
    self.adicionarCondicionante = function () { self.data.condicionantes.push({}) };

}

app.component('protocoloConcluirFormComponent', {
    templateUrl: 'app/modules/projeto/dashboard/protocolo/concluir/protocolo-concluir.component.html',
    bindings: { onUpdate: '&' },
    controller: protocoloConcluirFormController
});