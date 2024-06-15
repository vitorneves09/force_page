propostaTabDocumentoComponentController.$inject = ['$rootScope', '$scope', 'crudServices']
function propostaTabDocumentoComponentController($rootScope, $scope, crudServices) {
    var self = this;
    var itemIndex = -1;

    self.itemList = [];

    $scope.$on('PROPOSTA_FORM_MODAL_IS_READY', function (event, data) {
        crudServices.get('proposta/documento').then(function (items) {
            self.itemList = items.rows;
            self.data.documentoValor = data.documentoValor;
        });
    });

    $scope.$on('PROPOSTA_DOCUMENTO_FORM_MODAL_UPDATED', function (event, data) { self.load(data) });

    self.load = function (item) {
        crudServices.get('proposta/documento').then(function (data) {
            self.itemList = data.rows;
            if (!item) return;
            self.data.documentoValor[itemIndex].propostaDocumentoId = item.id;
        });
    }

    self.create = function (input, index) {
        itemIndex = index;
        $rootScope.$broadcast('PROPOSTA_DOCUMENTO_FORM_MODAL', { "nome": input });
    }

    self.add = function () {
        if (!Array.isArray(self.data.documentoValor)) self.data.documentoValor = [];
        self.data.documentoValor.push({ propostaDocumentoId: null, propostaId: self.data.id || null });
    }

    self.remove = function (index) {
        self.data.documentoValor.splice(index, 1);
    }
}

app.component('propostaTabDocumentoComponent', {
    templateUrl: 'app/modules/proposta/form/tabs/documento/proposta-tab-documento.component.html',
    bindings: {
        onUpdate: '&',
        data: '='
    },
    controller: propostaTabDocumentoComponentController
});