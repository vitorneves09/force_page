propostaTabEtapaComponentController.$inject = ['$rootScope', '$scope', 'crudServices']
function propostaTabEtapaComponentController($rootScope, $scope, crudServices) {
    var self = this;
    var itemIndex = -1;

    self.itemList = [];

    $scope.$on('PROPOSTA_FORM_MODAL_IS_READY', function (event, data) {
        crudServices.get('proposta/etapa').then(function (items) {
            self.itemList = items.rows;
            self.data.etapaValor = data.etapaValor;
        });
    });

    $scope.$on('PROPOSTA_ETAPA_FORM_MODAL_UPDATED', function (event, data) { self.load(data) });

    self.load = function (item) {
        crudServices.get('proposta/etapa').then(function (data) {
            self.itemList = data.rows;
            if (!item) return;
            self.data.etapaValor[itemIndex].propostaEtapaId = item.id;
        });
    }

    self.create = function (input, index) {
        itemIndex = index;
        $rootScope.$broadcast('PROPOSTA_ETAPA_FORM_MODAL', { "nome": input });
    }

    self.add = function () {
        if (!Array.isArray(self.data.etapaValor)) self.data.etapaValor = [];
        self.data.etapaValor.push({ propostaEtapaId: null, propostaId: self.data.id || null });
    }

    self.remove = function (index) {
        self.data.etapaValor.splice(index, 1);
    }

    self.change = function (newValue, index) {
        if (!newValue || self.data.etapaValor[index].prazo) return;
        self.data.etapaValor[index].prazo = newValue.prazo;
    }
}

app.component('propostaTabEtapaComponent', {
    templateUrl: 'app/modules/proposta/form/tabs/etapa/proposta-tab-etapa.component.html',
    bindings: {
        onUpdate: '&',
        data: '='
    },
    controller: propostaTabEtapaComponentController
});