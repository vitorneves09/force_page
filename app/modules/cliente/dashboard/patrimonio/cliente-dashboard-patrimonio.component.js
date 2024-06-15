clienteDashboardPatrimonioController.$inject = ['$scope', '$routeParams', 'crudServices', 'messageService']
function clienteDashboardPatrimonioController($scope, $routeParams, crudServices, messageService) {
    var self = this;
    var clienteId = $routeParams.id;

    self.data = {};

    self.$onInit = function () { self.load() };

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { clienteId }); }

    self.load = function () {
        if (clienteId)
            crudServices.get('cliente/patrimonio/lista/' + clienteId).then(function (data) {
                self.data = data;
            })
    }
}

app.component('clienteDashboardPatrimonioComponent', {
    templateUrl: 'app/modules/cliente/dashboard/patrimonio/cliente-dashboard-patrimonio.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clienteDashboardPatrimonioController
});