clienteFormController.$inject = ['$scope', 'configServices', 'crudServices', 'messageService']
function clienteFormController($scope, configServices, crudServices, messageService) {
    var self = this;
    var cidade = null;

    $scope.$on('CLIENTE_FORM_MODAL', (event, cliente) => {
        self.cliente = {};
        self.estadosList = configServices.getEstados();
        self.cidadesList = [];
        if (cliente && cliente.cidade) cidade = cliente.cidade || null;
        $('#modalClienteForm').modal('show');
        if (cliente.id)
            self.busy = crudServices.getById('cliente', cliente.id).then(function (data) {
                cidade = data.cidade;
                self.cliente = data;
            })
    });

    self.getCidades = function (estado) {
        self.cidadesList = [];
        if (!estado) return;
        self.busy = configServices.getCidades(estado).then(function (data) {
            self.cidadesList = data;
            if (self.cliente.id || cidade) {
                self.cliente.cidade = angular.copy(cidade);
            }
        });
    }

    self.save = function () {
        self.cliente.id ? save() : add();
    }

    function save() {
        self.busy = crudServices.save('cliente', self.cliente).then(function () {
            self.onUpdate();
            $('.modal').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    };

    function add() {
        self.busy = crudServices.add('cliente', self.cliente).then(function (response) {
            messageService.display('success', 'Cliente cadastrado com sucesso.');
            self.onUpdate({ newCliente: response.data });
            $('.modal').modal('hide');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }

}

app.component('clienteFormComponent', {
    templateUrl: 'app/modules/cliente/components/cliente-form/cliente-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clienteFormController
});