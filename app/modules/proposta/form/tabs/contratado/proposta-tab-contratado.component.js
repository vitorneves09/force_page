propostaTabContratadoComponentController.$inject = ['$rootScope', '$scope', 'crudServices']
function propostaTabContratadoComponentController($rootScope, $scope, crudServices) {
    var self = this;
    var itemIndex = -1;

    self.itemList = [];

    $scope.$on('PROPOSTA_FORM_MODAL_IS_READY', function (event, data) {
        crudServices.get('proposta/clausula-contratado').then(function (items) {
            self.itemList = items.rows;
            self.data.contratadoValor = data.contratadoValor;
        });
    });

    $scope.$on('PROPOSTA_CLAUSULA_CONTRATADO_FORM_MODAL_UPDATED', function (event, data) { self.load(data) });

    self.load = function (item) {
        crudServices.get('proposta/clausula-contratado').then(function (data) {
            self.itemList = data.rows;
            if (!item) return;
            self.data.contratadoValor[itemIndex].propostaContratadoId = item.id;
        });
    }

    self.create = function (input, index) {
        itemIndex = index;
        $rootScope.$broadcast('PROPOSTA_CLAUSULA_CONTRATADO_FORM_MODAL', { "nome": input });
    }

    self.add = function () {
        if (!Array.isArray(self.data.contratadoValor)) self.data.contratadoValor = [];
        self.data.contratadoValor.push({ propostaContratadoId: null, propostaId: self.data.id || null });
    }

    self.remove = function (index) {
        self.data.contratadoValor.splice(index, 1);
    }
}

app.component('propostaTabContratadoComponent', {
    templateUrl: 'app/modules/proposta/form/tabs/contratado/proposta-tab-contratado.component.html',
    bindings: {
        onUpdate: '&',
        data: '='
    },
    controller: propostaTabContratadoComponentController
});