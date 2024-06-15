projetoDashboardCondicionanteController.$inject = ['moment', '$scope', '$routeParams', 'crudServices']
function projetoDashboardCondicionanteController(moment, $scope, $routeParams, crudServices) {
    var self = this;
    var projetoId = $routeParams.id;
    self.hoje = moment().format('YYYY-MM-DD');

    self.data = {};

    self.$onInit = function () { self.load() };

    self.modal = function (modal, item) { $scope.$broadcast(modal, item || { projetoId }, self.projeto.clienteId); }

    self.load = function () {
        if (projetoId)
            self.busy = crudServices.get('projeto/condicionante/list/' + projetoId).then(function (data) {
                self.data = data;
            })
    }

    $scope.$on('ON_UPDATE_PROJETO_DASHBOARD', (event) => {
        self.load();
    });

}

app.component('projetoDashboardCondicionanteComponent', {
    templateUrl: 'app/modules/projeto/dashboard/condicionante/projeto-dashboard-condicionante.component.html',
    bindings: {
        projeto: '<',
    },
    controller: projetoDashboardCondicionanteController
});