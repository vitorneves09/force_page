projetoMontagemProtocolarPendenciaController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function projetoMontagemProtocolarPendenciaController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.file = null;

    $scope.$on('PROJETO_MONTAGEM_PROTOCOLAR_PENDENCIA_MODAL', (event, data) => {
        $('#modalProjetoMontagemProtocolarPendencia').modal('show');
        self.data = {
            projetoMontagemId: data.id
        };
    });

    self.save = function () {
        var formdata = new FormData();
        formdata.set('projetoMontagemId', self.data.projetoMontagemId);
        formdata.set('identificador', self.data.identificador);
        formdata.set('dataProtocolo', self.data.dataProtocolo);
        formdata.set('doc', self.file);
        self.busy = crudServices.doc('projeto/montagem/update/protocolar-pendencia', formdata).then(function () {
            $('#modalProjetoMontagemProtocolarPendencia').modal('hide');
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD_PROTOCOLAR');
            messageService.display('success', 'Montagem protocolada com sucesso.');
        }).catch(function (erro) {
            messageService.display('error', erro.data);
        });
    }

    self.addFile = function (files) {
        self.file = files[0] || null;
    }

}

app.component('projetoMontagemProtocolarPendenciaComponent', {
    templateUrl: 'app/modules/projeto/dashboard/montagem/protocolar-pendencia/projeto-montagem-protocolar-pendencia.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoMontagemProtocolarPendenciaController
});