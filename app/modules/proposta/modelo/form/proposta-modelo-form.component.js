propostaModeloFormController.$inject = ['$scope', 'crudServices', 'messageService']
function propostaModeloFormController($scope, crudServices, messageService) {
    var self = this;

    self.list = {
        objetivo: [],
        etapa: [],
        custo: [],
        contratante: [],
        contratado: [],
        documento: [],
    }

    $scope.$on('PROPOSTA_MODELO_FORM_MODAL', (event, modelo) => {
        $('#modalPropostaModelo').modal('show');
        self.data = modelo;
        crudServices.get('proposta/etapa').then(function (data) { self.list.etapa = data.rows; });
        crudServices.get('proposta/objetivo').then(function (data) { self.list.objetivo = data.rows; });
        crudServices.get('proposta/custo').then(function (data) { self.list.custo = data.rows; });
        crudServices.get('proposta/clausula-contratante').then(function (data) { self.list.contratante = data.rows; });
        crudServices.get('proposta/clausula-contratado').then(function (data) { self.list.contratado = data.rows; });
        crudServices.get('proposta/documento').then(function (data) { self.list.documento = data.rows; });

        if (!modelo.id) return;
        self.busy = crudServices.getById('proposta/modelo', modelo.id).then(function (data) {
            data.etapa = data.etapa.map(function (item) { return item.id; })
            data.custo = data.custo.map(function (item) { return item.id; })
            data.clausulaContratante = data.clausulaContratante.map(function (item) { return item.id; })
            data.clausulaContratado = data.clausulaContratado.map(function (item) { return item.id; })
            data.documento = data.documento.map(function (item) { return item.id; })
            self.data = data;
        })
    });

    self.create = function (input, evento) {
        $scope.$broadcast(evento, { nome: input });
    }

    self.updateObjetivo = function (item = null) {
        if (!item) return;
        crudServices.get('proposta/objetivo').then(function (data) {
            self.list.objetivo = data.rows;
            self.data.objetivoId = item.id;
        });
    }

    self.updateEtapa = function (item = null) {
        if (!item) return;
        crudServices.get('proposta/etapa').then(function (data) {
            self.list.etapa = data.rows;
            if (Array.isArray(self.data.etapa)) self.data.etapa.push(item.id);
            else self.data.etapa = [item.id];
        });
    }

    self.updateCusto = function (item = null) {
        if (!item) return;
        crudServices.get('proposta/custo').then(function (data) {
            self.list.custo = data.rows;
            if (Array.isArray(self.data.custo)) self.data.custo.push(item.id);
            else self.data.custo = [item.id];
        });
    }

    self.updateClausulaContratante = function (item = null) {
        if (!item) return;
        crudServices.get('proposta/clausula-contratante').then(function (data) {
            self.list.contratante = data.rows;
            if (Array.isArray(self.data.clausulaContratante)) self.data.clausulaContratante.push(item.id);
            else self.data.clausulaContratante = [item.id];
        });
    }

    self.updateClausulaContratado = function (item = null) {
        if (!item) return;
        crudServices.get('proposta/clausula-contratado').then(function (data) {
            self.list.contratado = data.rows;
            if (Array.isArray(self.data.clausulaContratado)) self.data.clausulaContratado.push(item.id);
            else self.data.clausulaContratado = [item.id];
        });
    }

    self.updateDocumento = function (item = null) {
        if (!item) return;
        crudServices.get('proposta/documento').then(function (data) {
            self.list.documento = data.rows;
            if (Array.isArray(self.data.documento)) self.data.documento.push(item.id);
            else self.data.documento = [item.id];
        });
    }
    
    self.save = function () {
        self.data.id ? save() : add();
    }

    self.remove = function () {
        messageService.confirm('Confirmar Exclusão', 'Deseja excluir o registro ' + self.data.nome + '?').then(function (result) {
            if (result.value) {
                self.busy = crudServices.remove('proposta/modelo', self.data.id).then(function (data) {
                    self.onUpdate();
                    $('.modal').modal('hide');
                    messageService.display('success', self.data.nome + ' removido com sucesso.');
                }).catch(function (erro) { messageService.display('error', erro.data) });
            }
        });
    }

    function save() {
        self.busy = crudServices.save('proposta/modelo', self.data).then(function (data) {
            self.onUpdate();
            $('.modal').modal('hide');
            messageService.display('success', self.data.nome + ' atualizado com sucesso.');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }

    function add() {
        self.busy = crudServices.add('proposta/modelo', self.data).then(function (data) {
            self.onUpdate();
            $('.modal').modal('hide');
            messageService.display('success', self.data.nome + ' cadastrado com sucesso.');
        }).catch(function (erro) { messageService.display('error', erro.data) });
    }
}

app.component('propostaModeloFormComponent', {
    templateUrl: 'app/modules/proposta/modelo/form/proposta-modelo-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: propostaModeloFormController
});