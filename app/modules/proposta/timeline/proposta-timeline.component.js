propostaTimelineController.$inject = ['$scope', 'crudServices', 'moment', 'messageService']
function propostaTimelineController($scope, crudServices, moment, messageService) {
    var self = this;
    self.data = null;
    self.registro = false;
    self.form = null;

    $scope.$on('PROPOSTA_TIMELINE_MODAL', function (event, id) {
        self.registro = false;
        self.form = { propostaId: id, dataDoOcorrido: moment().startOf('day').toDate() };
        $('#modalPropostaTimeline').modal('show');
        loadData(id);
    });

    self.chengeRegistro = function () {
        self.registro = !self.registro;
    }

    self.save = function () {
        self.busy = crudServices.add('proposta/timeline', self.form).then(function (data) {
            loadData(self.form.propostaId);
            self.registro = false;
            self.form.memorando = null;
            self.form.dataDoOcorrido = moment().startOf('day').toDate();
        }).catch(function (erro) { messageService.display('error', erro.data); });
    }

    function loadData(id) {
        self.busy = crudServices.getById('proposta/timeline', id).then(function (data) {
            self.data = data;
        }).catch(function (erro) { messageService.display('error', erro.data); });
    }
}

app.component('propostaTimelineComponent', {
    templateUrl: 'app/modules/proposta/timeline/proposta-timeline.component.html',
    controller: propostaTimelineController
});