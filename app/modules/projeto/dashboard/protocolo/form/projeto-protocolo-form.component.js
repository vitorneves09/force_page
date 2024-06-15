projetoProtocoloFormController.$inject = ['$scope', 'crudServices', 'messageService'];
function projetoProtocoloFormController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;
    self.instituicaoList = [];

    $scope.$on('PROJETO_PROTOCOLO_FORM_MODAL', (event, data) => {
        crudServices.get('projeto/instituicao/list').then(function (instituicoes) {
            self.instituicaoList = instituicoes;
            if (data.projetoInstituicaoId) self.instituicaoListApi.set(parseInt(data.projetoInstituicaoId));
        })
        $('#modalProjetoProtocolo').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('projeto/protocolo', data.id)
                .then(function (data) { self.data = data; })
    });

    self.save = function () {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('projeto/protocolo', formData).then(function () {
            self.onUpdate();
            $('#modalProjetoProtocolo').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('projetoProtocoloFormComponent', {
    templateUrl: 'app/modules/projeto/dashboard/protocolo/form/projeto-protocolo-form.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoProtocoloFormController
});