propostaTabContratanteComponentController.$inject = ['$rootScope', '$scope', 'crudServices']
function propostaTabContratanteComponentController($rootScope, $scope, crudServices) {
    var self = this;
    var itemIndex = -1;

    self.itemList = [];

    $scope.$on('PROPOSTA_FORM_MODAL_IS_READY', function (event, data) {
        crudServices.get('proposta/clausula-contratante').then(function (items) {
            self.itemList = items.rows;
            self.data.contratanteValor = data.contratanteValor;
        });
    });

    $scope.$on('PROPOSTA_CLAUSULA_CONTRATANTE_FORM_MODAL_UPDATED', function (event, data) { self.load(data) });

    self.load = function (item) {
        crudServices.get('proposta/clausula-contratante').then(function (data) {
            self.itemList = data.rows;
            if (!item) return;
            self.data.contratanteValor[itemIndex].propostaContratanteId = item.id;
        });
    }

    self.create = function (input, index) {
        itemIndex = index;
        $rootScope.$broadcast('PROPOSTA_CLAUSULA_CONTRATANTE_FORM_MODAL', { "nome": input });
    }

    self.add = function () {
        if (!Array.isArray(self.data.contratanteValor)) self.data.contratanteValor = [];
        self.data.contratanteValor.push({ propostaContratanteId: null, propostaId: self.data.id || null });
    }

    self.remove = function (index) {
        self.data.contratanteValor.splice(index, 1);
    }
}

app.component('propostaTabContratanteComponent', {
    templateUrl: 'app/modules/proposta/form/tabs/contratante/proposta-tab-contratante.component.html',
    bindings: {
        onUpdate: '&',
        data: '='
    },
    controller: propostaTabContratanteComponentController
});