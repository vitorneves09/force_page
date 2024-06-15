/*app.filter("removeAccents", function () {
	return function (actual, expected) {
		if (angular.isObject(actual)) return false;
		function removeAccents(value) {
			return value.toString()
				.replace(/ã/g, 'a')
				.replace(/á/g, 'a')
				.replace(/â/g, 'a')
				.replace(/é/g, 'e')
				.replace(/ê/g, 'e')
				.replace(/í/g, 'i')
				.replace(/ó/g, 'o')
				.replace(/ô/g, 'o')
				.replace(/õ/g, 'o')
				.replace(/ú/g, 'u')
				.replace(/ç/g, 'c')
		}
		actual = removeAccents(angular.lowercase('' + actual));
		expected = removeAccents(angular.lowercase('' + expected));
		return actual.indexOf(expected) !== -1;
	}
});*/

app.filter("tabelaDeCalculo", [function () {
	return function (value) {
		if (!value) return;
		else if (value == "p") return 'Tabela PRICE';
		else if (value == "s") return 'Tabela SAC';
		else if (value == "u") return 'Parcela Única';
	}
}]);

app.filter("modalidadeDaTaxa", [function () {
	return function (value) {
		if (!value) return;
		else if (value == "m") return 'a.m. (ao mês)';
		else if (value == "a") return 'a.a. (ao ano)';
	}
}]);

app.filter("estagio", [function () {
	return function (value) {
		if (!value) return;
		else if (value == 1) return 'Tentativa de contato';
		else if (value == 2) return 'Enviar material de apresentação';
		else if (value == 3) return 'Verificar interesse do cliente em uma reunião';
		else if (value == 4) return 'Marcar reunião com o cliente';
		else if (value == 5) return 'Reunião agendada';
		else if (value == 6) return 'Informar resultados da reunião';
		else if (value == 7) return 'Pedir documentações obrigatórias';
		else if (value == 8) return 'Aguardando documentação obrigatória';
		else if (value == 9) return 'Cadastro do cliente no sistema';
		else if (value == 10) return 'Criar proposta / orçamento';
		else if (value == 11) return 'Proposta em andamento';
		else if (value == 12) return 'Prospecção reiniciada';
	}
}]);

app.filter("estagioContrato", [function () {
	return function (value) {
		if (!value) return 'Cancelado';
		else if (value == 1) return 'Elaboração de contrato';
		else if (value == 2) return 'Revisão interna';
		else if (value == 3) return 'Alterações pendentes';
		else if (value == 4) return 'Envio do contrato para o cliente';
		else if (value == 5) return 'Revisão por parte do cliente';
		else if (value == 6) return 'Recolher assinaturas';
		else if (value == 7) return 'Reconhecimento de firma';
	}
}]);

app.filter("status", [function () {
	return function (value) {
		if (!value) return;
		else if (value == 'a') return 'Aberto';
		else if (value == 'f') return 'Fechado';
		else if (value == 'c') return 'Cancelado';
		else if (value == 1) return 'Quente';
		else if (value == 2) return 'Morno';
		else if (value == 3) return 'Frio';
	}
}]);

app.filter("condicionante", [function () {
	return function (value) {
		if (!value) return;
		if (value == 'u') {
			return 'Única';
		}
		if (value == 'rf') {
			return 'Execuções fixas';
		}
		if (value == 'ec') {
			return 'Tempo indeterminado';
		}
	}
}]);

app.filter("periodo", [function () {
	return function (value) {
		if (!value) return;
		if (value == 'd') {
			return 'Dia(s)';
		}
		if (value == 'm') {
			return 'Mês(es)';
		}
		if (value == 'a') {
			return 'Ano(s)';
		}

	}
}]);

app.filter("cargo", [function () {
	return function (value) {
		if (!value) return;
		if (value == 't') { return 'Técnico'; }
		if (value == 'g') { return 'Gerente'; }
	}
}]);

app.filter("cpfCnpj", ['$filter', function ($filter) {
	return function (value) {
		if (!value) return;
		if (value.length <= 11) {
			return $filter('brCpf')(value);
		}
		return $filter('brCnpj')(value);
	}
}]);

app.filter("phonebr", ['$filter', function ($filter) {
	return function (value) {
		if (!value) return;
		var numeroLimpo = value.replace(/\D/g, '');
		var regex = /^(\d{2})(\d{4,5})(\d{4})$/;
		var resultado = numeroLimpo.replace(regex, '($1) $2-$3');
		return resultado;
	}
}]);

app.filter('dateRangeStart', function () {
	return function (items, startDate, field = 'dataVencimento') {
		var retArray = [];

		if (!startDate) {
			return items;
		}
		angular.forEach(items, function (obj) {
			var receivedDate = obj[field];
			if (receivedDate >= startDate) {
				retArray.push(obj);
			}
		});
		return retArray;
	}
});

app.filter('dateRangeEnd', function () {
	//var more1day = (23 * 60 * 60 * 1000) + (59 * 60 * 1000);
	return function (items, endDate, field = 'dataVencimento') {
		var retArray = [];

		if (!endDate) {
			return items;
		}
		//endDate += more1day;
		angular.forEach(items, function (obj) {
			var receivedDate = obj[field];
			if (receivedDate <= endDate) {
				retArray.push(obj);
			}
		});
		return retArray;
	}
});

app.filter('agrupamento', function () {
	return function (items, todos) {

		if (todos) {
			return items;
		}

		var retArray = [];
		angular.forEach(items, function (obj) {
			if (!obj.deletedAt) { // apenas os que não foram deletados
				retArray.push(obj);
			}
		});

		return retArray;
	}
});

app.filter('diasRestantes', function () {
	return function (dataFim, formato) {
		if (!dataFim)
			return;

		var string;
		var data = moment(dataFim);
		var hoje = moment();
		var diferenca = Math.ceil(data.diff(hoje, 'days', true));
		if (formato) {
			string = moment(dataFim).format('DD/MM/YYYY') + '&nbsp';
			if (diferenca > 3) { string += ' <span class="custom-label label-primary">' + diferenca + ' dias</span>' }
			else if (diferenca == 1) { string += ' <span class="custom-label label-warning">1 dia</span>' }
			else if (diferenca > 0) { string += ' <span class="custom-label label-warning">' + diferenca + ' dias</span>' }
			else if (diferenca == 0) { string += ' <span class="custom-label label-warning">Hoje</span>' }
			else { string += ' <i class="fa fa-circle text-warning font-xs"></i>' }
		} else {
			string = moment(dataFim).format('DD/MM/YYYY');
		}
		return string;
	}
});

app.filter('financeiroSituacao', function () {
	return function (items, situacao) {
		var hoje = moment().format('YYYY-MM-DD');
		var retArray = [];
		var count = 0;

		if (!situacao) {
			return items;
		}

		if (situacao.quitadas) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.dataPagamento) {
					retArray.push(obj);
				}
			});
		}

		if (situacao.vencidas) {
			count++;
			angular.forEach(items, function (obj) {
				if (!obj.dataPagamento && obj.dataVencimento < hoje && !obj.previsao) {
					retArray.push(obj);
				}
			});
		}

		if (situacao.avencer) {
			count++;
			angular.forEach(items, function (obj) {
				if (!obj.dataPagamento && obj.dataVencimento >= hoje && !obj.previsao) {
					retArray.push(obj);
				}
			});
		}

		if (situacao.previsao) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.previsao) {
					retArray.push(obj);
				}
			});
		}

		return count ? retArray : items;
	}
});

app.filter('projetoSituacao', function () {
	return function (items, situacao) {
		var retArray = [];
		var count = 0;

		if (!situacao) {
			return items;
		}

		if (situacao.incompleta) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.status == 'Incompleta') {
					retArray.push(obj);
				}
			});
		}

		if (situacao.elaborada) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.status == 'Elaborada') {
					retArray.push(obj);
				}
			});
		}

		if (situacao.emitida) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.status == 'Emitida') {
					retArray.push(obj);
				}
			});
		}

		if (situacao.negociacao) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.status == 'Negociação') {
					retArray.push(obj);
				}
			});
		}

		if (situacao.aprovada) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.status == 'Aprovada') {
					retArray.push(obj);
				}
			});
		}

		if (situacao.cancelada) {
			count++;
			angular.forEach(items, function (obj) {
				if (obj.status == 'Cancelada') {
					retArray.push(obj);
				}
			});
		}

		return count ? retArray : items;
	}
});

app.filter('financeiroPendente', function () {
	return function (items, pendente) {
		var retArray = [];

		if (!pendente || (!pendente.nota && !pendente.boleto)) {
			return items;
		}

		angular.forEach(items, function (obj) {
			if ((!obj.boleto && pendente.boleto) || (!obj.nota && pendente.nota)) {
				retArray.push(obj);
			}
		});

		return retArray;
	}
});

app.directive("formatDate", function () {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, modelCtrl) {
			modelCtrl.$parsers.push(function (value) {
				return moment(value).format('YYYY-MM-DD');
			});
			modelCtrl.$formatters.push(function (modelValue) {
				if (modelValue) {
					return moment(modelValue).format('DD-MM-YYYY');
				}
			})
		}
	}
})