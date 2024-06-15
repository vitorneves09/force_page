empresaFormComponentController.$inject = ['$scope', 'crudServices', 'fileReader', 'configServices', 'configuracaoServices', 'messageService']
function empresaFormComponentController($scope, crudServices, fileReader, configServices, configuracaoServices, messageService) {
    var self = this;
    var cidade = null;
    self.noImage = '/img/sem-logo.png';
    self.estadosList = configServices.getEstados();
    self.cidadesList = [];

    $scope.$on('EMPRESA_FORM_MODAL', function (event) {
        self.busy = crudServices.getById('empresa', 0).then(function (data) {
            if (data.logo) { data.logo = configuracaoServices.cdnUrl + 'logo/' + data.logo; }
            cidade = angular.copy(data.cidade);
            self.data = data;
        })
        $('#modalEmpresaForm').modal('show');
    });

    self.getCidades = function (estado) {
        self.cidadesList = [];
        if (!estado) return;
        self.busy = configServices.getCidades(estado).then(function (data) {
            self.cidadesList = data;
            if (cidade) {
                self.data.cidade = cidade;
                cidade = null;
            }
        });
    }

    self.openInput = function () { $("#logoInput").click(); }
    self.addFile = function (item) {
        if (!item[0]) return;
        self.data.file = item[0];
        fileReader.readAsDataUrl(self.data.file, $scope).then(function (result) {
            self.data.preview = result;
            angular.element('#logoInput').val(null);
        }).catch(function (error) {
            messageService.display('error', 'Não foi possível carregar este arquivo, por favor tente novamente ou uma imagem diferente da atual.');
        });
    }

    self.save = function () {
        var formdata = new FormData();
        formdata.set('id', "0");
        formdata.set('razaoSocial', self.data.razaoSocial);
        formdata.set('nomeFantasia', self.data.nomeFantasia);
        formdata.set('documento', self.data.documento);
        formdata.set('uf', self.data.uf);
        formdata.set('cidade', self.data.cidade);
        formdata.set('endereco', self.data.endereco);
        formdata.set('telefone', self.data.telefone);
        formdata.set('email', self.data.email);

        if (self.data.file) formdata.set('logo', self.data.file);

        save(formdata);
    }

    function save(formdata) {
        self.busy = crudServices.doc('empresa', formdata, 'PUT').then(function () {
            self.onUpdate({});
            $('#modalEmpresaForm').modal('hide');
            messageService.display('success', 'Dados da empresa atualizados com sucesso.');
        });
    };
}

app.component('empresaFormComponent', {
    templateUrl: 'app/component/empresa/empresa-form.component.html',
    bindings: {
        onUpdate: '&',
    },
    controller: empresaFormComponentController
});