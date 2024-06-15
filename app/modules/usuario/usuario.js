app.controller('usuarioController', function ($scope, messageService, crudServices, usuarioServices, authServices) {
	var local = 'usuario';
	$scope.regrasList = authServices.userInfo().modules || [];

	/******************* PAGINAÇÃO *****************/
	$scope.totalUsuarios = 0;
	$scope.usuariosPorPagina = 10;
	var findOptions = {
		attr: ["usuario", "email", "situacao"],
		order: ["nome", "ASC"],
		limit: $scope.usuariosPorPagina,
		offset: 0
	};
	$scope.filtrarUsuarios = function (busca) {
		findOptions.where = {}
		findOptions.offset = 0;
		$scope.totalUsuarios = 0;
		for (var key in busca) {
			findOptions.where[key] = busca[key];
		}
		carregarUsuarios();
	}
	$scope.mudarPaginaUsuarios = function (paginaUsuarios) {
		findOptions.offset = paginaUsuarios == 1 ? 0 : (paginaUsuarios * findOptions.limit) - findOptions.limit;
		carregarUsuarios();
	}
	$scope.ordenar = function (campo) {
		if (findOptions.order[0] == campo) {
			findOptions.order[1] = findOptions.order[1] == 'ASC' ? 'DESC' : 'ASC';
		} else {
			findOptions.order[0] = campo
			findOptions.order[1] = 'ASC';
		}
		carregarUsuarios();
	}
	/******************* PAGINAÇÃO *****************/

	carregarUsuarios();
	function carregarUsuarios() {
		$scope.busy = usuarioServices.getAll(findOptions).then(function (data) {
			$scope.usuarios = data.rows;
			$scope.totalUsuarios = data.count;
		});
	}

	$scope.modalFormUsuario = {};
	$scope.modalUsuario = function (data = {}) {
		$scope.modalFormUsuario = { situacao: 'Ativo' };
		$('#modalUsuario').modal('show');
		if (data.id)
			$scope.busy = crudServices.getById(local, data.id).then(function (data) { $scope.modalFormUsuario = data });
	}

	$scope.saveUsuario = function (form) {
		form.id ? save(form) : add(form);
	}

	$scope.removeUsuario = function (usuario) {
		messageService.confirm('Confirmar Exclusão', 'Deseja realmente excluir a conta de usuário ' + usuario.usuario + '?').then(function (result) {
			if (result.value) {
				$scope.busy = crudServices.remove('usuario', usuario.id).then(function () {
					carregarUsuarios();
					$('.modal').modal('hide');
					messageService.display('success', 'Conta removida com sucesso.');
				}).catch(function (erro) { messageService.display('error', erro.data) });
			}
		})
	}

	function save(usuario) {
		$scope.busy = crudServices.save('usuario', usuario).then(function (data) {
			carregarUsuarios();
			$('.modal').modal('hide');
			messageService.display('success', 'Conta atualizada com sucesso.');
		}).catch(function (erro) { messageService.display('error', erro.data) });
	};

	function add(usuario) {
		$scope.busy = crudServices.add('usuario', usuario).then(function (ref) {
			carregarUsuarios();
			$('.modal').modal('hide');
			messageService.display('success', 'Conta cadastrada com sucesso.');
		}).catch(function (erro) { messageService.display('error', erro.data) });
	}

});