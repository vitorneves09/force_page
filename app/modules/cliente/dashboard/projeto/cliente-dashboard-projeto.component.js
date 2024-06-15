clienteDashboardProjetoController.$inject = ['$scope', '$routeParams', 'crudServices']
function clienteDashboardProjetoController($scope, $routeParams, crudServices) {
    var self = this;
    var clienteId = $routeParams.id;
    self.filter = {};
    self.data = [];

    //PAGINATION
    self.currentPage = 1;
    self.totalItems = 0;
    self.itemsPerPage = 10;

    var options = {
        order: ['contrato', 'DESC'],
        limit: self.itemsPerPage,
        offset: 0
    };

    self.change = function () {
        options.offset = self.currentPage == 1 ? 0 : (self.currentPage * self.itemsPerPage) - self.itemsPerPage;
        self.load();
    }

    self.order = function (field) {
        if (!options.order || options.order[0] != field) options.order = [field, 'DESC'];
        else { options.order[1] = options.order[1] == 'DESC' ? 'ASC' : 'DESC' }
        self.currentPage = 1;
        options.offset = 0;
        self.load();
    }

    self.search = function (data) {
        self.filter = data;
        options.where = { ...data };
        self.load();
    }
    //END PAGINATION

    self.$onInit = function () { self.load(); }

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { clienteId }); }

    self.load = function () {
        if (!clienteId) return;
        self.busy = crudServices.get('projeto/cliente/' + clienteId, options).then(function (data) {
            self.data = data.rows;
            self.totalItems = data.count;
        });
    }

    $scope.$on('ON_UPDATE_PATRIMONIO', (event) => {
        self.load();
    });

    $scope.$on('ON_UPDATE_PROPOSTA', (event) => {
        self.load();
    });
}

app.component('clienteDashboardProjetoComponent', {
    templateUrl: 'app/modules/cliente/dashboard/projeto/cliente-dashboard-projeto.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clienteDashboardProjetoController
});