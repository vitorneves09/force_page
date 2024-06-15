clienteDashboardInfoController.$inject = ['$scope', '$routeParams', 'crudServices']
function clienteDashboardInfoController($scope, $routeParams, crudServices) {
    var self = this;
    var clienteId = $routeParams.id;
    self.data = {};

    self.$onInit = function () { self.load() };

    self.modal = function (modal) { $scope.$broadcast(modal, self.data); }

    self.load = function () {
        if (clienteId)
            crudServices.getById('cliente', clienteId).then(function (data) {
                self.data = data;
            })
    }
}

app.component('clienteDashboardInfoComponent', {
    templateUrl: 'app/modules/cliente/dashboard/info/cliente-dashboard-info.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clienteDashboardInfoController
});