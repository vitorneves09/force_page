app.controller('headerController', function ($rootScope, $scope, authServices, configuracaoServices) {
    $scope.user = authServices.userInfo();
    $scope.calculadora = { hora: {}, viagem: {} };
    var configuracao;

    $scope.hasModule = function (item) {
        return $scope.user.modules.includes(item) && $scope.user.regra.includes(item);
    }

    configuracaoServices.getById().then(function (data) {
        configuracao = data;
    });

    $scope.calcHora = function () {
        var horas = $scope.calculadora.hora || {};
        $scope.calculadora.hora.total = (horas.quantidade * horas.preco) * parseFloat(horas.dificuldade);

        if ($scope.calculadora.hora.total)
            $scope.calcValorTotal();
    }

    $scope.modalHeader = function (modal) { $scope.$broadcast(modal); }

    $scope.modalProjetoCalculadora = function (data = {}) {
        $scope.calculadora = {
            hora: { preco: configuracao.precoHora },
            viagem: { valorkm: configuracao.valorKm },
            margem: configuracao.margemLucro,
            imposto: configuracao.imposto,
        };
        $('#modalProjetoCalculadora').modal('show');
    }

    $scope.calcViagem = function () {
        var viagem = $scope.calculadora.viagem || {};
        $scope.calculadora.viagem.total = ((viagem.distancia * 2) * viagem.quantidade) * viagem.valorkm;

        if ($scope.calculadora.viagem.total)
            $scope.calcValorTotal();
    }

    $scope.calcValorTotal = function () {
        var calculadora = $scope.calculadora
        var totalProjeto = (calculadora.hora.total || 0) + (calculadora.viagem.total || 0) + (calculadora.tercerizado || 0);
        var margem = (((calculadora.margem * 100) || 0) * (totalProjeto || 0)) / 100;

        $scope.calculadora.total = (totalProjeto + margem);
    }

});