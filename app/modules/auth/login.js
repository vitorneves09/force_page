app.controller('loginController', function ($scope, messageService, authServices, $location) {
    $scope.login = function (data) {
        $scope.busy = authServices.login({ cid: data.cid, usuario: data.usuario, senha: data.senha }).then(function (usuario) {
            localStorage.setItem('usuarioLogado', JSON.stringify(
                { token: usuario.data.token, uid: usuario.data.uid, nome: usuario.data.nome, modules: usuario.data.modules, regra: usuario.data.regra }
            ));
            authServices.broadcast();
            $location.url('/');
        }).catch(function (error) {
            messageService.display('error', error.data);
        });
    };
});