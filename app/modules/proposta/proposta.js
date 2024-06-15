app.controller('propostaController',
    function ($scope, messageService, crudServices, configuracaoServices) {
        var propostaAssinadaId = null;
        var fileUrl = configuracaoServices.cdnUrl + 'clientes/';
        $scope.statusList = ['Elaborada', 'Emitida', 'Negociação', 'Concluída'];
        $scope.filter = {};

        $scope.load = function (options = {}) {
            $scope.busy = crudServices.get('proposta', options).then(function (data) {
                $scope.data = data.rows;
                $scope.$broadcast('PAGINATION_COUNT', { totalItems: data.count });
            });
        }

        $scope.search = function (reset = false) {
            if (reset) $scope.filter = {};
            $scope.$broadcast('PAGINATION_FILTER', angular.copy($scope.filter));
        }

        $scope.order = function (field) {
            $scope.$broadcast('PAGINATION_ORDER', angular.copy(field));
        }

        $scope.modal = function (modal, data = {}) { $scope.$broadcast(modal, data); }

        $scope.emitirProposta = function (proposta) {
            if (proposta.status != 'Elaborada') return;
            var title = 'Etapa da proposta';
            var message = 'Confirme a emissão da proposta ' + proposta.contrato;
            messageService.confirm(title, message).then(function (result) {
                if (result.value) {
                    $scope.busy = crudServices.save('proposta/update/emitir', { id: proposta.id }).then(function () {
                        messageService.display('success', 'Proposta alterada para EMITIDA com sucesso.');
                        $scope.search();
                    });
                }
            });
        }

        $scope.entregarProposta = function (proposta) {
            if (proposta.status != 'Emitida') return;
            var title = 'Informe a data da entrega da proposta.';
            var inputType = 'date';
            messageService.confirmInput(title, inputType).then(function (data) {
                if (data) {
                    $scope.busy = crudServices.save('proposta/update/entrega', { id: proposta.id, data }).then(function () {
                        messageService.display('success', 'Entrega confirmada, aguardando negociação com cliente.');
                        $scope.search();
                    });
                }
            });
        }

        $scope.update = function (proposta, status) {
            var proposta = { id: proposta.id, status: status };
            if (status == 'Cancelada')
                messageService.confirmInput('Informe o motivo do cancelamento', 'text').then(function (data) {
                    if (data) {
                        proposta.memorando = data;
                        updateEtapa(proposta);
                    }
                });
            else
                messageService.confirm('Etapa da proposta', 'Confirme a emissão da proposta ' + proposta.contrato).then(function (result) { if (result.value) updateEtapa(proposta); });
        }

        function updateEtapa(proposta) {
            crudServices.save('proposta', proposta).then(function (data) {
                messageService.display('success', 'Solicitação concluída.');
                $scope.search();
            });
        }

        $scope.concluirProposta = function (proposta) {
            var title = proposta.contrato + ' - Assinada pelo Cliente ';
            var inputType = 'date';
            messageService.confirmInput(title, inputType).then(function (data) {
                if (data) {
                    crudServices.save('proposta/update/concluir', { id: proposta.id, data }).then(function () {
                        messageService.display('success', 'Proposta assinada.');
                        $scope.search();
                    });
                }
            });
        }

        $scope.imprimirPropostaAssinada = function (proposta) {
            if (proposta.arquivo) {
                window.open(fileUrl + proposta.clienteId + '/propostas/' + proposta.id + '/' + proposta.arquivo, '_blank');
            } else {
                var title = proposta.contrato + ' - Arquivo da Proposta';
                var message = 'Você ainda não enviou o arquivo assinado da proposta. Gostaria de enviá-lo agora?'
                messageService.confirm(title, message).then(function (result) {
                    if (result.value) {
                        propostaAssinadaId = proposta.id;
                        $("#propostaAssinaturaFileInput").val('');
                        $("#propostaAssinaturaFileInput").click();
                    }
                });
            }
        }

        $scope.addFile = function (files) {
            if (!files[0]) return;
            var formdata = new FormData();
            formdata.set('id', propostaAssinadaId);
            formdata.set('doc', files[0]);
            $scope.busy = crudServices.doc('proposta/update/arquivo', formdata).then(function () {
                $scope.search();
                messageService.display('success', 'Arquivo enviado com sucesso.');
            });
        }


        $scope.imprimirProposta = function (proposta) {
            window.open('#/imprimir/proposta/' + proposta.id, '_blank');
        }
    });