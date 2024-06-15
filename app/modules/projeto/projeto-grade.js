app.controller('projetoGradeController', function ($scope, crudServices) {
    $scope.planejamento = [];
    $scope.atribuicao = [];
    $scope.execucao = [];
    $scope.montagem = [];
    $scope.montagemAndamento = [];
    $scope.protocolo = [];
    $scope.protocoloAcompanhamento = [];
    $scope.protocoloPendencia = [];

    $scope.load = function (options = {}) {
        $scope.busy = crudServices.get('projeto/grade', options).then(function (data) {

            $scope.planejamento = (data || []).filter(function (item) {
                return item.statusPlanejamento == 'Pendente';
            });

            $scope.atribuicao = (data || []).filter(function (item) {
                return item.statusAtribuicao == 'Pendente';
            });

            $scope.execucao = (data || []).filter(function (item) {
                return item.statusExecucao == 'Andamento';
            });

            $scope.montagem = (data || []).filter(function (item) {
                return item.statusMontagem == 'Pendente';
            });

            $scope.montagemAndamento = (data || []).filter(function (item) {
                return item.statusMontagem == 'Andamento';
            });

            $scope.protocolo = (data || []).filter(function (item) {
                return item.statusProtocolo == 'Pendente';
            });

            $scope.protocoloAcompanhamento = (data || []).filter(function (item) {
                return item.statusProtocolo == 'Acompanhamento';
            })

            $scope.protocoloPendencia = (data || []).filter(function (item) {
                return item.statusProtocolo == 'Pendencia';
            })

            console.log(data);

        });
    }

    $scope.load();
});
