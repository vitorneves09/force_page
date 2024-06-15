projetoPendenciaFormController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function projetoPendenciaFormController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.file = null;
    self.usuariosList = [];

    $scope.$on('PENDENCIA_FORM_MODAL', (event, data) => {
        console.log(data);
        crudServices.get('usuario/list').then(function (usuarios) {
            self.usuariosList = usuarios;
        });
        $('#modalProjetoPendenciaForm').modal('show');
        self.data = {
            projetoProtocoloId: data.id,
            etapas: [],
        }
    });

    self.addFile = function (files) {
        self.file = files[0] || null;
    }

    self.save = function () {
        var formdata = new FormData();
        formdata.set('projetoProtocoloId', self.data.projetoProtocoloId);
        formdata.set('identificador', self.data.identificador);
        formdata.set('dataEntrada', self.data.dataEntrada);
        formdata.set('prazo', self.data.prazo);
        formdata.set('etapas', JSON.stringify(self.data.etapas));
        formdata.set('doc', self.file);
        self.busy = crudServices.doc('projeto/protocolo/pendencia', formdata).then(function () {
            $('#modalProjetoPendenciaForm').modal('hide');
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD_CONCLUIDO');
            $rootScope.$broadcast('ON_UPDATE_PROJETO_DASHBOARD');
            messageService.display('success', 'Pendência cadastrada com sucesso.');
        }).catch(function (erro) {
            messageService.display('error', erro.data);
        });
    }


    self.removerEtapa = function (index) { self.data.etapas.splice(index, 1); };
    self.adicionarEtapa = function () { self.data.etapas.push({}) };

}

app.component('projetoPendenciaFormComponent', {
    templateUrl: 'app/modules/projeto/dashboard/pendencia/form/projeto-pendencia-form.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoPendenciaFormController
});