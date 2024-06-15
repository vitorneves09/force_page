app.factory('authServices', ['$rootScope', '$http', 'urlServices', function ($rootScope, $http, urlServices) {

    return {
        login: login,
        logout: logout,
        userInfo: userInfo,
        broadcast: broadcast,
        listen: listen,
        listenLogOut: listenLogOut,
    }

    function login(data) { return $http.post(urlServices.baseUrl + 'login', data); }
    function logout(data) { $rootScope.$broadcast("logout"); localStorage.removeItem('usuarioLogado'); }
    function userInfo() { return JSON.parse(localStorage.getItem('usuarioLogado')); }
    function broadcast() { $rootScope.$broadcast("novoUsuario") }
    function listen(callback) { $rootScope.$on("novoUsuario", callback) }
    function listenLogOut(callback) { $rootScope.$on("logout", callback) }

}]);

app.factory('crudServices', ['urlServices', '$http', 'messageService', function (urlServices, $http, messageService) {

    return {
        get: get,
        getById: getById,
        add: add,
        save: save,
        remove: remove,
        doc: doc,
        download: download,
    }

    function get(local, filter = {}, params = '') {
        var query = '?query=' + JSON.stringify(filter);
        return $http.get(urlServices.baseUrl + local + query + params).then(function (response) {
            return response.data;
        }, function (error) {
            messageService.display('error', error.data || 'Verifique sua conexão com a internet ou entre em contato com o administrador.');
        });
    }
    function getById(local, id) {
        return $http.get(urlServices.baseUrl + local + '/' + id).then(function (response) {
            return response.data;
        }, function (error) {
            messageService.display('error', error.data || 'Verifique sua conexão com a internet ou entre em contato com o administrador.');
        });
    }
    function add(local, data) { return $http.post(urlServices.baseUrl + local, data); }
    function save(local, data) { return $http.put(urlServices.baseUrl + local + '/' + (data.id || 0), data); }
    function remove(local, id) { return $http.delete(urlServices.baseUrl + local + '/' + id); }
    function doc(local, formdata, method = 'POST') {
        var request = { method: method, url: urlServices.baseUrl + local, data: formdata, headers: { 'Content-Type': undefined } };
        return $http(request)
    }
    function download(local, filter = {}, extra = '') {
        var query = '?query=' + JSON.stringify(filter) + extra;
        window.open(urlServices.baseUrl + local + query + '&host=' + window.location.hostname);
    }
}]);

app.factory('configuracaoServices', ['$http', 'moment', 'urlServices', 'messageService', function ($http, moment, urlServices, messageService) {
    var local = "configuracao";
    return {
        getById: getById,
        rangePicker: rangePicker,
        cdnUrl: 'https://flowforce.s3.sa-east-1.amazonaws.com/files/' + window.location.hostname + '/',
        hostname: window.location.hostname
    }

    function getById(id = 1) {
        var promise = $http.get(urlServices.baseUrl + local + '/' + id).then(function (response) {
            return response.data;
        }, function (error) {
            messageService.display('error', error.data || 'Verifique sua conexão com a internet ou entre em contato com o administrador.');
        });
        return promise;
    }

    function rangePicker() {
        var config = {
            locale: {
                separator: ' até ',
                format: 'DD MMMM, YYYY',
                applyLabel: "Aplicar",
                clearLabel: 'Limpar',
                fromLabel: "De",
                toLabel: "Até",
                customRangeLabel: 'Personalizado'
            },
            opens: 'left',
            showDropdowns: true,
            ranges: {
                'Hoje': [moment(), moment()],
                'Ontem': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Últimos 7 Dias': [moment().subtract(6, 'days'), moment()],
                'Últimos 30 Dias': [moment().subtract(29, 'days'), moment()],
                'Mês Atual': [moment().startOf('month'), moment().endOf('month')],
                'Mês Anterior': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
        };
        return config;
    }
}]);

app.factory('usuarioServices', ['$http', 'urlServices', 'messageService', function ($http, urlServices, messageService) {

    var local = 'usuario';

    return {
        getAll: getAll,
    }
    function getAll(filter = {}, ignoreMe = false) {
        var query = '&query=' + JSON.stringify(filter);
        var promise = $http.get(urlServices.baseUrl + local + '?ignoreMe=' + ignoreMe + query).then(function (response) {
            return response.data;
        }, function (error) {
            messageService.display('error', error.data || 'Verifique sua conexão com a internet ou entre em contato com o administrador.');
        });
        return promise;
    }
}]);

app.factory('financeiroReceitaServices', ['$http', 'urlServices', 'messageService', function ($http, urlServices, messageService) {

    var local = 'financeiro/receita';

    return {
        getClienteTotal: getClienteTotal
    }
    function getClienteTotal(id, where = 'aVencer') {
        var promise = $http.get(urlServices.baseUrl + local + '/cliente/total/' + id + '?where=' + where).then(function (response) {
            return response.data;
        }, function (error) {
            messageService.display('error', error.data || 'Verifique sua conexão com a internet ou entre em contato com o administrador.');
        });
        return promise;
    }
}]);

app.factory("fileReader", ["$q", "$log", function ($q, $log) {

    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL
    };
}]);