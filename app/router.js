app.config(function ($routeProvider, $locationProvider) {
	$locationProvider.hashPrefix('');

	// USUARIO
	$routeProvider.when("/usuario", {
		templateUrl: "app/modules/usuario/usuario.html",
		controller: "usuarioController",
		autorizado: true
	});
	// FIM DO USUÁRIO

	// CLIENTE
	$routeProvider.when("/", {
		templateUrl: "app/modules/cliente/search/cliente-search.html",
		controller: "clienteSearchController",
		autorizado: true
	});
	$routeProvider.when("/pessoa/:id", {
		templateUrl: "app/modules/cliente/dashboard/cliente-dashboard.html",
		controller: "clienteDashboardController",
		autorizado: true
	});
	// FIM DO CLIENTE


	// FINANCEIRO
	$routeProvider.when("/financeiro/despesa", {
		templateUrl: "app/modules/financeiro/despesa/financeiro-despesa.html",
		controller: "financeiroDespesaController",
		autorizado: true
	});

	$routeProvider.when("/financeiro/receita", {
		templateUrl: "app/modules/financeiro/receita/financeiro-receita.html",
		controller: "financeiroReceitaController",
		autorizado: true
	});

	$routeProvider.when("/financeiro/transferencia", {
		templateUrl: "app/modules/financeiro/transferencia/financeiro-transferencia.html",
		controller: "financeiroTransferenciaController",
		autorizado: true
	});

	$routeProvider.when("/financeiro/receita/recibo/:id", {
		templateUrl: "app/modules/financeiro/receita/recibo/financeiro-receita-recibo.html",
		controller: "financeiroReceitaReciboController",
		autorizado: true
	});

	$routeProvider.when("/financeiro/conta", {
		templateUrl: "app/modules/financeiro/conta/financeiro-conta.html",
		controller: "financeiroContaController",
		autorizado: true
	});

	$routeProvider.when("/financeiro/plano-conta", {
		templateUrl: "app/modules/financeiro/plano-conta/financeiro-plano-conta.html",
		controller: "financeiroPlanoContaController",
		autorizado: true
	});

	$routeProvider.when("/financeiro/forma-pagamento", {
		templateUrl: "app/modules/financeiro/forma-pagamento/financeiro-forma-pagamento.html",
		controller: "financeiroFormaPagamentoController",
		autorizado: true
	});
	// FIM DO FINANCEIRO


	// PROPOSTA
	$routeProvider.when("/proposta", {
		templateUrl: "app/modules/proposta/proposta.html",
		controller: "propostaController",
		autorizado: true
	});
	$routeProvider.when("/proposta-modelo", {
		templateUrl: "app/modules/proposta/modelo/proposta-modelo.html",
		controller: "propostaModeloController",
		autorizado: true
	});
	$routeProvider.when("/proposta-titulo", {
		templateUrl: "app/modules/proposta/titulo/proposta-titulo.html",
		controller: "propostaTituloController",
		autorizado: true
	});
	$routeProvider.when("/proposta-objetivo", {
		templateUrl: "app/modules/proposta/objetivo/proposta-objetivo.html",
		controller: "propostaObjetivoController",
		autorizado: true
	});
	$routeProvider.when("/proposta-etapa", {
		templateUrl: "app/modules/proposta/etapa/proposta-etapa.html",
		controller: "propostaEtapaController",
		autorizado: true
	});
	$routeProvider.when("/proposta-custo", {
		templateUrl: "app/modules/proposta/custo/proposta-custo.html",
		controller: "propostaCustoController",
		autorizado: true
	});
	$routeProvider.when("/proposta-documento", {
		templateUrl: "app/modules/proposta/documento/proposta-documento.html",
		controller: "propostaDocumentoController",
		autorizado: true
	});
	$routeProvider.when("/proposta-clausula-contratante", {
		templateUrl: "app/modules/proposta/clausula-contratante/proposta-clausula-contratante.html",
		controller: "propostaClausulaContratanteController",
		autorizado: true
	});
	$routeProvider.when("/proposta-clausula-contratado", {
		templateUrl: "app/modules/proposta/clausula-contratado/proposta-clausula-contratado.html",
		controller: "propostaClausulaContratadoController",
		autorizado: true
	});
	$routeProvider.when("/proposta-forma-cobranca", {
		templateUrl: "app/modules/proposta/forma-cobranca/proposta-forma-cobranca.html",
		controller: "propostaFormaCobrancaController",
		autorizado: true
	});
	// FIM DA PROPOSTA

	// PROJETO
	$routeProvider.when("/projeto-lista", {
		templateUrl: "app/modules/projeto/projeto-lista.html",
		controller: "projetoListaController",
		autorizado: true
	});
	$routeProvider.when("/projeto-grade", {
		templateUrl: "app/modules/projeto/projeto-grade.html",
		controller: "projetoGradeController",
		autorizado: true
	});
	$routeProvider.when("/projeto/:id", {
		templateUrl: "app/modules/projeto/dashboard/projeto-dashboard.html",
		controller: "projetoDashboardController",
		autorizado: true
	});
	$routeProvider.when("/projeto-instituicao", {
		templateUrl: "app/modules/projeto/instituicao/projeto-instituicao.html",
		controller: "projetoInstituicaoController",
		autorizado: true
	});
	// FIM DO PROJETO


	// TAREFA
	$routeProvider.when("/tarefa", {
		templateUrl: "app/modules/tarefa/tarefa.html",
		controller: "tarefaController",
		autorizado: true
	});
	// FIM DA TAREFA

	// REPOSITÓRIO
	$routeProvider.when("/repositorio", {
		templateUrl: "app/modules/repositorio/repositorio.html",
		controller: "repositorioController",
		autorizado: true
	});
	// FIM DO REPOSITÓRIO

	// CONDICIONANTES
	$routeProvider.when("/condicionante", {
		templateUrl: "app/modules/condicionante/condicionante.html",
		controller: "condicionanteController",
		autorizado: true
	});
	// FIM DO CONDICIONANTES


	// IMPRIMIR
	$routeProvider.when("/imprimir/:tipo/:id", {
		templateUrl: "app/modules/imprimir/imprimir.html",
		controller: "imprimirController",
		autorizado: true
	});
	// FIM DO IMPRIMIR

	// Fim do Projeto
	$routeProvider.when("/usuarios", {
		templateUrl: "app/views/usuarios.html",
		controller: "usuariosController",
		autorizado: true
	});
	$routeProvider.when("/login", {
		templateUrl: "app/modules/auth/login.html",
		controller: "loginController",
	});
	$routeProvider.when("/logout", {
		resolve: {
			"currentAuth": ["authServices", function (authServices) {
				authServices.logout();
				window.location = "#/login";
				return;
			}]
		}
	});
	$routeProvider.otherwise({
		templateUrl: "app/layout/404.html",
		autorizado: true
	});
});