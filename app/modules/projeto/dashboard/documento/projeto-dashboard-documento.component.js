projetoDashboardDocumentoController.$inject = ['$scope', '$routeParams', 'configuracaoServices', 'crudServices', 'messageService']
function projetoDashboardDocumentoController($scope, $routeParams, configuracaoServices, crudServices, messageService) {
    var self = this;
    var projetoId = $routeParams.id;

    self.data = {};
    self.fileUrl = configuracaoServices.cdnUrl + 'clientes/';

    self.$onInit = function () { self.load() };

    self.load = function () {
        if (projetoId)
            self.busy = crudServices.get('projeto/documento/list/' + projetoId).then(function (data) {
                self.data = data;
            })
    }

    self.openFileInput = function () {
        $("#projetoDashboardDocumentoFileInput").val('');
        $("#projetoDashboardDocumentoFileInput").click();
    }

    self.addFile = function (files) {
        if (!files[0]) return;
        messageService.confirmInput('Informe o nome do arquivo.', 'text').then(function (nome) {
            if (!nome) return;
            var formdata = new FormData();
            formdata.set('projetoId', projetoId);
            formdata.set('nome', nome);
            formdata.set('doc', files[0]);
            self.busy = crudServices.doc('projeto/documento', formdata).then(function () {
                self.load();
                messageService.display('success', 'Arquivo enviado com sucesso.');
            }).catch(function (erro) {
                messageService.display('error', erro.data);
            });
        });
    }

    self.removeFile = function (documento) {
        messageService.confirm('Excluir', 'Deseja remover o documento ' + documento.titulo + '?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('projeto/documento', documento.id).then(function (data) {
                    self.load();
                    messageService.display('success', 'Arquivo removido com sucesso!');
                }).catch(function (erro) {
                    messageService.display('error', erro.data);
                });
            }
        });
    }

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD_PROTOCOLAR', (event) => {
        self.load();
    });

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD_CONCLUIDO', (event) => {
        self.load();
    });

}

app.component('projetoDashboardDocumentoComponent', {
    templateUrl: 'app/modules/projeto/dashboard/documento/projeto-dashboard-documento.component.html',
    bindings: {
        projeto: '<',
    },
    controller: projetoDashboardDocumentoController
});