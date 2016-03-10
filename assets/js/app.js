angular.module('evSettings', [])
    .controller('evSettingsController', function($scope) {
        $scope.channels = {};
        $scope.showChannels = false;
        $scope.filter = "";
        $scope.saveChannels = function() {
        	chrome.storage.sync.set({
        		channels: $scope.channels
        	});
            $scope.showChannels = false;
        };
    })
    //https://github.com/petebacondarwin/angular-toArrayFilter
    .filter('toArray', function() {
        return function(obj, addKey) {
            if (!angular.isObject(obj)) return obj;
            if (addKey === false) {
                return Object.keys(obj)
                    .map(function(key) {
                        return obj[key];
                    });
            } else {
                return Object.keys(obj)
                    .map(function(key) {
                        var value = obj[key];
                        return angular.isObject(value) ? Object.defineProperty(value, '$key', {
                            enumerable: false,
                            value: key
                        }) : {
                            $key: key,
                            $value: value
                        };
                    });
            }
        };
    });