(function() {
  angular.module('searchApp',['ui.bootstrap', 'leaflet-directive'])

  .controller('mainCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {
      $scope.keywords = ""
      $scope.members = [];
      $scope.hospitals = {};

      $scope.lastmodify = '';

      $http.get('http://tonyq.org/kptaipei/api-20150628.php')
      .success(function(result) {
        $scope.members = result.data;
        $scope.lastmodify = result.lastmodify;
      });

      $http.get('https://raw.githubusercontent.com/harry2690/psof/gh-pages/hospitals.json')
      .success(function(result) {
        for (var i = 0; i < result.data.length; i++) {
          $scope.hospitals[result.data[i]['醫院名稱']] = result.data[i];
        }
      });

      $scope.namePipe = function() {
        return ($scope.keywords.length > 1) ? $scope.keywords[0] + '○' + $scope.keywords.substr(2, $scope.keywords.length-2) : $scope.keywords;
      };

      $scope.openHospitalModal = function ($event, hospital) {
        $event.preventDefault();

        var modalInstance = $modal.open({
          templateUrl: 'hospitalModalContent.html',
          controller: 'hospitalModalInstanceCtrl',
          resolve: {
            hospital: function () {
              return hospital;
            }
          }
        });
      };

      angular.extend($scope, {
        center: {
          lat: 25.047923,
          lng: 121.5170907,
          zoom: 16
        },
        layers: {
          baselayers: {
            googleTerrain: {
              name: 'Google Terrain',
              layerType: 'TERRAIN',
              type: 'google'
            },
            googleHybrid: {
              name: 'Google Hybrid',
              layerType: 'HYBRID',
              type: 'google'
            }
          }
        },
        markers: {
          CurrentLocation: {
            lat: 25.047923,
            lng: 121.5170907,
            focus: true
          }
        },
      });
    }
  ])

  .controller('hospitalModalInstanceCtrl', ['$scope', '$modalInstance', 'hospital',
    function ($scope, $modalInstance, hospital) {
      $scope.hospital = hospital;

      $scope.close = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]);

})();
