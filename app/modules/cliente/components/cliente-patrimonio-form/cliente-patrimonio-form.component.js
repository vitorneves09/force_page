clientePatrimonioFormController.$inject = ['$rootScope','$scope', 'configServices', 'crudServices', 'messageService']
function clientePatrimonioFormController($rootScope, $scope, configServices, crudServices, messageService) {
    var self = this;
    var cidade = null;
    self.estadosList = configServices.getEstados();
    self.cidadesList = [];

    $scope.$on('CLIENTE_PATRIMONIO_FORM_MODAL', (event, data) => {
        self.data = data || {};
        $('#modalClientePatrimonioForm').modal('show');
        if (data && data.cidade)
            cidade = data.cidade;
        if (data.id)
            self.busy = crudServices.get('cliente/patrimonio/' + data.id).then(function (data) {
                cidade = data.cidade;
                self.data = data;
            })
    });

    self.getCidades = function (item) {
        self.cidadesList = [];
        if (!item) return;
        self.busy = configServices.getCidades(item).then(function (data) {
            self.cidadesList = data;
            if (self.data.id || cidade) {
                self.data.cidade = angular.copy(cidade);
            }
        });
    }

    self.save = function () {
        self.data.id ? save() : add();
    }

    function save() {
        self.busy = crudServices.save('cliente/patrimonio', self.data).then(function () {
            self.onUpdate();
            $rootScope.$broadcast('ON_UPDATE_PATRIMONIO');
            $('.modal').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        self.busy = crudServices.add('cliente/patrimonio', self.data).then(function (response) {
            messageService.display('success', 'Novo patrimônio cadastrado com sucesso.');
            self.onUpdate();
            $('.modal').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('clientePatrimonioFormComponent', {
    templateUrl: 'app/modules/cliente/components/cliente-patrimonio-form/cliente-patrimonio-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clientePatrimonioFormController
});