angular.module('nibs_ibeacon.trolley', ['nibs_ibeacon.s3uploader'])

    // Routes
    .config(function ($stateProvider) {

        $stateProvider

            .state('app.create-trolley', {
                url: "/create-trolley",
                views: {
                    'menuContent' :{
                        templateUrl: "templates/create-trolley.html",
                        controller: "CreateTrolleyCtrl"
                    }
                }
            })

    })

    // Services
    .factory('User', function ($http, $rootScope) {
        return {
          all: function() {
              return $http.get($rootScope.server.url + '/trolley');
          },
          create: function(trolley) {
              return $http.post($rootScope.server.url + '/trolley/', trolley);
          },
          deleteAll: function() {
              return $http.delete($rootScope.server.url + '/trolley');
          }
        };

    })

    .factory('Preference', function() {

        var preferences = [
            { text: 'Dark', value: 'Dark' },
            { text: 'Milk', value: 'Milk' },
            { text: 'White', value: 'White' }
        ];

        return {
            all: function() {
                return preferences;
            }
        }
    })

    //Controllers
    .controller('TrolleyCtrl', function ($rootScope, $scope, $state, User, STATUS_LABELS, STATUS_DESCRIPTIONS) {

        User.get().success(function(user) {
            $rootScope.user = user;
            $scope.statusLabel = STATUS_LABELS[user.status - 1];
            $scope.statusDescription = STATUS_DESCRIPTIONS[user.status - 1];
        });

        $scope.popupDialog = function() {

            if (navigator.notification) {
                navigator.notification.alert(
                    'You have a new message!',  // message
                    function() {                // callback
                        $state.go('app.messages');
                    },
                    'Nibs',                     // title
                    'Open Inbox'             // buttonName
                );
            } else {
                alert('You have a new message!');
                $state.go('app.messages');
            }

        }

    })

    .controller('CreateTrolleyCtrl', function ($scope, $window, $ionicPopup, S3Uploader, Trolley) {

        User.get().success(function(trolley) {
            $scope.trolley = trolley;
        });

        $scope.create = function () {
          Trolley.create({Address__c: $scope.trolley.Address__c, Condition__c: $scope.trolley.Condition__c})
              .success(function(status) {
                  Status.checkStatus(status);
                  Status.show('Your Report has been saved.');
              });
        };

        $scope.addPicture = function (from) {

            if (!navigator.camera) {
                $ionicPopup.alert({title: 'Sorry', content: 'This device does not support Camera'});
                return;
            }

            var fileName,
                options = {   quality: 45,
                    allowEdit: true,
                    targetWidth: 300,
                    targetHeight: 300,
                    destinationType: Camera.DestinationType.FILE_URI,
                    encodingType: Camera.EncodingType.JPEG };
            if (from === "LIBRARY") {
                options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
                options.saveToPhotoAlbum = false;
            } else {
                options.sourceType = Camera.PictureSourceType.CAMERA;
                options.saveToPhotoAlbum = true;
            }

            navigator.camera.getPicture(
                function (imageURI) {
                    // without setTimeout(), the code below seems to be executed twice.
                    setTimeout(function () {
                        fileName = new Date().getTime() + ".jpg";
                        S3Uploader.upload(imageURI, fileName).then(function () {
                            $scope.user.pictureurl = 'https://accor-static.s3.amazonaws.com/' + fileName;
                        });
                    });
                },
                function (message) {
                    // We typically get here because the use canceled the photo operation. Seems better to fail silently.
                }, options);
            return false;
        };
    });
