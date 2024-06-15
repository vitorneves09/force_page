app.controller('clienteDashboardController', function ($scope, authServices) {
	$scope.tab = 'receitas';
	$scope.user = authServices.userInfo();

	$scope.hasModule = function (item) {
        return $scope.user.modules.includes(item) && $scope.user.regra.includes(item);
    }
});
