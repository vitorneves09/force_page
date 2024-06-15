propostaFormController.$inject = ['$scope', 'moment', 'crudServices', 'messageService', 'calculoServices']
function propostaFormController($scope, moment, crudServices, messageService, calculoServices) {
	var self = this;

	self.tab = 'geral';

	$scope.$on('PROPOSTA_FORM_MODAL', (event, data) => {
		$('#modalPropostaForm').modal('show');

		self.changeTab('geral');

		self.data = {
			clienteId: data.clienteId,
			financeiro: {
				primeiraParcela: 'padrao',
				parcelas: 1,
				porcentagemDaMulta: 0,
				porcentagemDaMora: 0,
				dataEntrada: moment().format('YYYY-MM-DD'),
				agrupamentoId1: null,
				agrupamentoId2: null,
				agrupamentoId3: null,
				agrupamentoId4: null,
				valor: 0,
				parcela: [],
			},
			patrimonioId: null,
			propostaTituloId: null,
			propostaModeloId: null,
			tipoDoc: null,
			documento: null,
			prazo: null,
			etapaValor: [],
			custoValor: [],
			documentoValor: [],
			contratanteValor: [],
			contratadoValor: [],
			objetivo: null,
			observacao: null
		};

		if (data.id) {
			self.busy = crudServices.getById('proposta', data.id).then(function (response) {
				self.data = angular.copy(response);
				$scope.$broadcast('PROPOSTA_FORM_MODAL_IS_READY', response);
			})
		} else {
			$scope.$broadcast('PROPOSTA_FORM_MODAL_IS_READY', self.data);
		}
	});

	self.changeTab = function (tab) { self.tab = tab }

	self.save = function () {
		if (self.data.financeiro.valor) {
			var total = self.data.financeiro.parcela.map(function (item) { return item.valor }).reduce(function (a, b) { return a + b; })
			if (total != self.data.financeiro.valor) {
				self.changeTab('financeiro');
				return messageService.display('warning', 'A soma das PARCELAS não conferem com o valor total da proposta.');
			}
		}

		self.data.id ? save() : add();
	}

	self.cancelar = function () {
		messageService.confirmInput('Informe o motivo do cancelamento', 'text').then(function (data) {
			if (data) {
				var proposta = {
					id: self.data.id,
					motivoCancelamento: data
				}
				self.busy = crudServices.save('proposta/update/cancelar', proposta).then(function (data) {
					messageService.display('success', 'Proposta cancelada com sucesso.');
					self.onUpdate({ update: true });
					$('.modal').modal('hide');
				});
			}
		});
	}

	function save() {
		self.busy = crudServices.save('proposta', self.data).then(function () {
			self.onUpdate();
			$('.modal').modal('hide');
		}).catch(function (erro) { messageService.display('error', erro.data) });
	};

	function add() {
		self.busy = crudServices.add('proposta', self.data).then(function (data) {
			messageService.display('success', 'Proposta cadastrada com sucesso.');
			self.onUpdate();
			$('.modal').modal('hide');
		}).catch(function (erro) { messageService.display('error', erro.data) });
	}

}

app.component('propostaFormComponent', {
	templateUrl: 'app/modules/proposta/form/proposta-form.component.html',
	bindings: {
		onUpdate: '&',
	},
	controller: propostaFormController
});