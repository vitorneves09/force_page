projetoMontagemProtocolarController.$inject = ['$rootScope', '$scope', 'crudServices', 'messageService'];
function projetoMontagemProtocolarController($rootScope, $scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.file = null;
    self.instituicaoList = [];

    $scope.$on('PROJETO_MONTAGEM_PROTOCOLAR_MODAL', (event, data) => {
        crudServices.get('projeto/instituicao/list').then(function (instituicoes) {
            self.instituicaoList = instituicoes;
        })
        $('#modalProjetoMontagemProtocolar').modal('show');
        self.data = {
            projetoMontagemId: data.id
        };
    });

    self.load = function (item) {
        crudServices.get('projeto/instituicao/list').then(function (instituicoes) {
            self.instituicaoList = instituicoes;
            if (item.id) self.instituicaoListApi.set(parseInt(item.id));
        })
    }

    self.create = function (input, evento) {
        $scope.$broadcast(evento, { nome: input });
    }

    self.save = function () {
        var formdata = new FormData();
        formdata.set('projetoMontagemId', self.data.projetoMontagemId);
        formdata.set('projetoInstituicaoId', self.data.projetoInstituicaoId);
        formdata.set('identificador', self.data.identificador);
        formdata.set('dataProtocolo', self.data.dataProtocolo);
        formdata.set('prazo', self.data.prazo);
        if (self.data.setor) formdata.set('setor', self.data.setor);
        if (self.data.responsavel) formdata.set('responsavel', self.data.responsavel);
        formdata.set('doc', self.file);
        self.busy = crudServices.doc('projeto/montagem/update/protocolar', formdata).then(function () {
            $('#modalProjetoMontagemProtocolar').modal('hide');
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

app.component('projetoMontagemProtocolarComponent', {
    templateUrl: 'app/modules/projeto/dashboard/montagem/protocolar/projeto-montagem-protocolar.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoMontagemProtocolarController
});