financeiroPlanoContaFormController.$inject = ['$scope', 'crudServices', 'messageService'];
function financeiroPlanoContaFormController($scope, crudServices, messageService) {
    var self = this;
    self.data = null;

    $scope.$on('FINANCEIRO_PLANO_CONTA_FORM_MODAL', (event, data) => {
        $('#modalFinanceiroPlanoContaForm').modal('show');
        self.data = data || {};
    });

    self.hide = function () {
        $('#modalFinanceiroPlanoContaForm').modal('hide');
    }

	self.save = function () {
		self.data.id ? save() : add();
	}

	function save() {
		self.busy = crudServices.save('financeiro/agrupamento', self.data).then(function (data) {
            self.onUpdate();
            self.hide();
            messageService.display('success', self.data.nome + ' atualizado com sucesso.');
		}).catch(function (erro) { messageService.display('error', erro.data) });
	};

	function add() {
		self.busy = crudServices.add('financeiro/agrupamento', self.data).then(function (ref) {
            self.onUpdate();
            self.hide();
            messageService.display('success', self.data.nome + ' cadastrado com sucesso.');
		}).catch(function (erro) { messageService.display('error', erro.data) });
	}


}

app.component('financeiroPlanoContaFormComponent', {
    templateUrl: 'app/modules/financeiro/plano-conta/form/financeiro-plano-conta-form.component.html',
    bindings: { onUpdate: '&' },
    controller: financeiroPlanoContaFormController
});