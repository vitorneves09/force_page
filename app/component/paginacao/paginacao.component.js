paginacaoComponentController.$inject = ['$scope',]
function paginacaoComponentController($scope) {
    var self = this;
    self.currentPage = 1;
    self.totalItems = 0;
    self.itemsPerPage = 10;

    var options = {
        order: null,
        limit: self.itemsPerPage,
        offset: 0
    };

    self.$onInit = function () {
        if (self.order) options.order = angular.copy(self.order);
        if (self.filter) options.where = angular.copy(self.filter);
        load();
    };

    self.change = function () {
        options.offset = self.currentPage == 1 ? 0 : (self.currentPage * self.itemsPerPage) - self.itemsPerPage;
        load();
    }

    $scope.$on('PAGINATION_COUNT' + (self.id || ''), (event, data) => {
        self.totalItems = data.totalItems;
    });

    $scope.$on('PAGINATION_FILTER' + (self.id || ''), (event, data) => {
        self.currentPage = 1;
        self.totalItems = 0;
        options.offset = 0;
        options.where = {};
        for (var key in data) {
            options.where[key] = data[key];
        }
        load();
    });

    $scope.$on('PAGINATION_ORDER' + (self.id || ''), (event, field) => {
        if (!options.order || options.order[0] != field) options.order = [field, 'DESC'];
        else { options.order[1] = options.order[1] == 'DESC' ? 'ASC' : 'DESC' }
        self.currentPage = 1;
        options.offset = 0;
        load();
    });

    function load() { self.onUpdate({ options }); }
}

app.component('paginacaoComponent', {
    templateUrl: 'app/component/paginacao/paginacao.component.html',
    bindings: { id: '<', onUpdate: '&', order: '<', filter: '<' },
    controller: paginacaoComponentController
});