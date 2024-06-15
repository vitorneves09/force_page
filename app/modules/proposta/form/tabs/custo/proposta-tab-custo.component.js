propostaTabCustoComponentController.$inject = ['$rootScope', '$scope', 'crudServices']
function propostaTabCustoComponentController($rootScope, $scope, crudServices) {
    var self = this;
    var itemIndex = -1;

    self.itemList = [];

    $scope.$on('PROPOSTA_FORM_MODAL_IS_READY', function (event, data) {
        crudServices.get('proposta/custo').then(function (items) {
            self.itemList = items.rows;
            self.data.custoValor = data.custoValor;
        });
    });

    $scope.$on('PROPOSTA_CUSTO_FORM_MODAL_UPDATED', function (event, data) { self.load(data) });

    self.load = function (item) {
        crudServices.get('proposta/custo').then(function (data) {
            self.itemList = data.rows;
            if (!item) return;
            self.data.custoValor[itemIndex].propostaCustoId = item.id;
        });
    }

    self.create = function (input, index) {
        itemIndex = index;
        $rootScope.$broadcast('PROPOSTA_CUSTO_FORM_MODAL', { "nome": input });
    }

    self.add = function () {
        if (!Array.isArray(self.data.custoValor)) self.data.custoValor = [];
        self.data.custoValor.push({ propostaCustoId: null, propostaId: self.data.id || null });
    }

    self.remove = function (index) {
        self.data.custoValor.splice(index, 1);
    }

    self.custosValue = function () {
        if (!self.data || !Array.isArray(self.data.custoValor)) return 0;
        return self.data.custoValor.reduce(function (total, item) { return total + (item.valor || 0) }, 0);
    }
}

app.component('propostaTabCustoComponent', {
    templateUrl: 'app/modules/proposta/form/tabs/custo/proposta-tab-custo.component.html',
    bindings: {
        onUpdate: '&',
        data: '='
    },
    controller: propostaTabCustoComponentController
});