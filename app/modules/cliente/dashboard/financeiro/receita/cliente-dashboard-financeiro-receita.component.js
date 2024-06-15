clienteDashboardFinanceiroReceitaController.$inject = ['$scope', '$routeParams', 'crudServices', 'moment', 'messageService']
function clienteDashboardFinanceiroReceitaController($scope, $routeParams, crudServices, moment, messageService) {
    var self = this;
    var clienteId = $routeParams.id;
    self.hoje = moment().format('YYYY-MM-DD');
    self.filter = {};
    self.data = [];

    //PAGINATION
    self.currentPage = 1;
    self.totalItems = 0;
    self.itemsPerPage = 10;

    var options = {
        order: ['dataVencimento', 'ASC'],
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

    self.modal = function (modal, data) { $scope.$broadcast(modal, data || { clienteId }); }

    self.load = function () {
        if (!clienteId) return;
        self.busy = crudServices.get('financeiro/receita/cliente/' + clienteId, options).then(function (data) {
            self.data = data.rows;
            self.totalItems = data.count;
        });
    }


    self.alterarVencimentoReceita = function (item) {
        if (item.valorPago) return;
        messageService.confirmInput('Alterar data de vencimento da parcela #' + item.id + '?', 'date').then(function (data) {
            if (data) {
                var update = { id: item.id, dataVencimento: data };
                self.busy = crudServices.save('financeiro/receita/update/data-vencimento', update).then(function (data) {
                    messageService.display('success', 'Data de vencimento alterada com sucesso.');
                    self.load();
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    $scope.$on('ON_UPDATE_PROPOSTA', (event) => {
        self.load();
    });
}

app.component('clienteDashboardFinanceiroReceitaComponent', {
    templateUrl: 'app/modules/cliente/dashboard/financeiro/receita/cliente-dashboard-financeiro-receita.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: clienteDashboardFinanceiroReceitaController
});