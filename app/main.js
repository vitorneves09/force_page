var app = angular.module('admin', ['selector', 'ngQuill', 'ngRoute', 'cgBusy', 'ui.utils.masks', 'idf.br-filters', 'ui.bootstrap', 'angularUtils.directives.dirPagination', 'slugifier', 'ngSanitize', 'ngAnimate', 'angularMoment', 'daterangepicker']);

app.run(["$rootScope", "$location", "amMoment", function ($rootScope, $location, amMoment) {
    amMoment.changeLocale('pt-br');
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
        if (next.autorizado) {
            var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            if (!usuarioLogado || !usuarioLogado.token) {
                $rootScope.$evalAsync(function () {
                    $location.path('/login');
                })
            }
        }
    });
}]);

app.factory('AuthInterceptor', AuthInterceptor).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('NG_QUILL_CONFIG', {
    placeholder: '', modules: {
        clipboard: {
            matchVisual: true
        },
    }
});
app.config([
    'ngQuillConfigProvider',
    'NG_QUILL_CONFIG',
    function (ngQuillConfigProvider, NG_QUILL_CONFIG) {
        ngQuillConfigProvider.set(NG_QUILL_CONFIG)
    }
])

function AuthInterceptor($location, $q, $timeout) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            config.headers['x-access-host'] = window.location.hostname;
            var usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

            if (usuarioLogado && usuarioLogado.token) {
                config.headers['x-access-token'] = usuarioLogado.token || null;
            }

            return config;
        },

        responseError: function (response) {
            if (response.status === 401) {
                $timeout(function () {
                    $location.path('/login');
                }, 500)
            }
            return $q.reject(response);
        }
    }
}

app.directive('activitiesDropdownToggle', function ($log) {

    var link = function ($scope, $element, attrs) {
        var ajax_dropdown = null;

        $element.on('click', function () {
            var badge = $(this).find('.badge');

            if (badge.hasClass('bg-color-red')) {
                badge.removeClass('bg-color-red').text(0);
            }

            ajax_dropdown = $(this).next('.ajax-dropdown');

            if (!ajax_dropdown.is(':visible')) {
                ajax_dropdown.fadeIn(150);
                $(this).addClass('active');
            }
            else {
                ajax_dropdown.fadeOut(150);
                $(this).removeClass('active');
            }

        })

        $(document).mouseup(function (e) {
            if (ajax_dropdown && !ajax_dropdown.is(e.target) && ajax_dropdown.has(e.target).length === 0) {
                ajax_dropdown.fadeOut(150);
                $element.removeClass('active');
            }
        });
    }

    return {
        restrict: 'EA',
        link: link
    }
});