app.directive('showTotal', ['$filter', function ($filter) {
    return {
        scope: {
            itens: "=",
            tipo: "@"
        },
        link: function (scope, element) {
            scope.$watch('itens', function (item) {
                if (typeof item == 'undefined') {
                    return;
                }
                var total = 0;
                var porcentagem = 0;
                item.forEach(function (i) {
                    total += i.valor;
                    porcentagem += i.porcentagem;
                })

                var value = scope.tipo == 'total' ? $filter('currency')(total, "R$ ", 2) : $filter('percentage')(porcentagem, 2);

                element.text(value);
            }, true)
        }
    }
}]);

app.directive('colorByDate', [function () {
    return {
        scope: {
            itens: "=",
            tipo: "@"
        },
        link: function (scope, element, attributes) {
            element.addClass('hide')
        }
    }
}]);