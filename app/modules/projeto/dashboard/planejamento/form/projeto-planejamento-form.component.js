projetoPlanejamentoFormController.$inject = ['$scope', 'crudServices', 'messageService'];
function projetoPlanejamentoFormController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('PROJETO_PLANEJAMENTO_FORM_MODAL', (event, data) => {
        $('#modalProjetoPlanejamento').modal('show');
        self.data = data || {};
        if (data.id)
            self.busy = crudServices.getById('projeto/planejamento', data.id)
                .then(function (data) { self.data = data; })
    });

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.save('projeto/planejamento', formData).then(function () {
            self.onUpdate();
            $('#modalProjetoPlanejamento').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        var formData = angular.copy(self.data);
        self.busy = crudServices.add('projeto/planejamento', formData).then(function (response) {
            self.onUpdate();
            $('#modalProjetoPlanejamento').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('projetoPlanejamentoFormComponent', {
    templateUrl: 'app/modules/projeto/dashboard/planejamento/form/projeto-planejamento-form.component.html',
    bindings: { onUpdate: '&' },
    controller: projetoPlanejamentoFormController
});