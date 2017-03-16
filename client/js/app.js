var app = angular.module('nibs_ibeacon', ['ionic', 'openfb','nibs_ibeacon.oauthcallback','nibs_ibeacon.membershipcard','nibs_ibeacon.wave','nibs_ibeacon.chatterfeed', 'nibs_ibeacon.gallery','nibs_ibeacon.productcat', 'nibs_ibeacon.config', 'nibs_ibeacon.profile', 'nibs_ibeacon.auth', 'nibs_ibeacon.product', 'nibs_ibeacon.offer', 'nibs_ibeacon.store-locator', 'nibs_ibeacon.settings', 'nibs_ibeacon.case'])

    .run(function ($window, $location, $rootScope, $state, $ionicPlatform, $http, OpenFB, FB_APP_ID, SERVER_URL) {
         console.log('hi');
        var user = JSON.parse($window.localStorage.getItem('user'));

        console.log(user);

        $rootScope.user = user;
        //console.log($rootScope.user);
        //console.log('firstname of connected user : ' + $rootScope.user.externalUserId);
        //console.log('points of connected user : ' + $rootScope.user.points);

        $rootScope.server = {
            url: SERVER_URL || location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '')
        };

        // Intialize OpenFB Facebook library
        OpenFB.init(FB_APP_ID, $window.localStorage);

        $ionicPlatform.ready(function () {
            if (window.StatusBar) {
                            //setupLightning();
                             console.log('1:');
                StatusBar.styleLightContent();
                             var logToDom = function (message) {
                             var e = document.createElement('label');
                             e.innerText = message;
                             console.log('2:');
                             var br = document.createElement('br');
                             var br2 = document.createElement('br');
                             document.body.appendChild(e);
                             document.body.appendChild(br);
                             document.body.appendChild(br2);

                             window.scrollTo(0, window.document.height);
                             };


                             /***********************************************
                              *   NOTIFICATIONS
                              **********************************************/
                             console.log('3:');
                             window.plugin.notification.local.cancelAll(function () {}, $rootScope);

                             window.plugin.notification.local.onclick = function (id, state, json) {
                                var major = JSON.parse(json).type;
                                if (major === 4522) {
                                  console.log('Beacon iPad:');
                                  window.location.href = '#/app/profile';

                                } else if (major === 45268) {
                                  console.log('Beacon Mint:');
                                  window.location.href = '#/app/offers';
                                }
                             }

                             /***********************************************
                              *   DELEGATES
                              **********************************************/
                             console.log('4:');
                             var delegate = new cordova.plugins.locationManager.Delegate();

                             delegate.didDetermineStateForRegion = function (pluginResult) {

                                console.log('didDetermineStateForRegion:', JSON.stringify(pluginResult));
                                console.log('connected user 2 : ' + $rootScope.user);

                                if(pluginResult.state === "CLRegionStateInside"){

                                    if (pluginResult.region.major === 4522) {
                                        console.log('4522');
                                        window.plugin.notification.local.add({ message: 'Welcome to your store !',
                                                                         badge           : 0,
                                                                         id             : 1,
                                                                         json:       JSON.stringify({ type: 1627 })
                                        });
                                    }
                                    if (pluginResult.region.major === 4522 && $rootScope.user != null) {
                                        console.log('1');
                                        window.plugin.notification.local.add({ message: 'You\'ve got ' + $rootScope.user.points + ' points. Discover our fidelity offers !',
                                                                  badge           : 0,
                                                                  id             : 1,
                                                                  json:       JSON.stringify({ type: 1629 })
                                        });
                                    }
                                }
                                else if(pluginResult.state === "CLRegionStateOutside"){
                                //OUTSIDE REGION
                             console.log('Out of Range');
                             //window.plugin.notification.local.add({ message: 'À bientôt !',
                                     //                                    badge           : 0,
                                     //                                    id             : 1});
                                }
                             };

                             cordova.plugins.locationManager.setDelegate(delegate);

                             /***********************************************
                              *   BEACON CONFIGURATION
                              **********************************************/

                             /* Beacon 1  */
                             var uuid = '8492E75F-4FD6-469D-B132-043FE94921D8';
                             var identifier = 'iPad Beacon';
                             var minor = 0;
                             var major = 4522;
                             var beaconRegion1 = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor, true);

                             cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion1)
                             .fail(console.error)
                             .done();

                             /* Beacon 2 -  */
                             uuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
                             identifier = 'Mint Cocktail';
                             minor = 46007;
                             major = 45268;
                             var beaconRegion2 = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid, major, minor, true);

                             cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion2)
                             .fail(console.error)
                             .done();

                             /***********************************************
                              *   PLUGIN CONFIGURATION
                              **********************************************/

                             cordova.plugins.locationManager.requestAlwaysAuthorization();
                             cordova.plugins.locationManager.disableDebugLogs();

            }

        });

        // Re-route to welcome street if we don't have an authenticated token
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (toState.name !== 'start.login' && toState.name !== 'start.signup' && toState.name !== 'start.welcome' && toState.name !== 'app.logout' && !$window.localStorage.getItem('token')) {
                console.log('Aborting state ' + toState.name + ': No token');
                $state.go('start.welcome');
                event.preventDefault();
            }
        });

        $state.go('app.profile');
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        //$ionicConfigProvider.views.maxCache(0);
        $stateProvider

            .state('start', {
                url: "/start",
                abstract: true,
                templateUrl: "templates/start.html"
            })

            .state('start.welcome', {
                url: "/welcome",
                views: {
                    'pageContent': {
                        templateUrl: "templates/welcome.html"
                    }
                }
            })
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html"
            })


    })

    // XMLHTTPRequest Interceptor.
    // Outbound: Adds access token to HTTP requests before they are sent to the server.
    // Inbound: Handles 401 (Not Authorized) errors by loading the Login page
    .factory('AuthInterceptor', function ($rootScope, $window, $q, $location) {

        return {
            request: function (config) {
                $rootScope.loading = true;
                config.headers = config.headers || {};
                if ($window.localStorage.getItem('token')) {
                    config.headers.authorization = $window.localStorage.getItem('token');
                }
                return config || $q.when(config);
            },
            requestError: function (request) {
                console.log('request error');
                $rootScope.loading = false;
                return $q.reject(request);
            },
            response: function (response) {
                $rootScope.loading = false;
                return response || $q.when(response);
            },
            responseError: function (response) {
                console.log(JSON.stringify(response));
                $rootScope.loading = false;
                if (response && response.status === 401) {
                    // TODO: broadcast event instead.
                    $location.path('/start/welcome');
                } else if (response && response.status !== 404) {
                    console.log(response);
                    // alert(response.data);
                }
                return $q.reject(response);
            }
        };
    })

    // Add the AuthInterceptor declared above
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    });


    /**

      Add Code For Lightning Out - Lightining Components

    **/
    function forceLogin(key) {
    	forceInit();
    	force.login(function(success) {
    		var oauth = force.getOauth();
    		setupLightning();
    	});
    }

    function createChatterFeed(type, subjectId) {
        setupLightning(function() {
    		$Lightning.createComponent("forceChatter:feed", {type: type, subjectId: subjectId}, "chatterFeed");
        $Lightning.createComponent("c:DigitalMemberShip", "", "memberCard");
        //$Lightning.createComponent("c:DigitalMemberShip", "", "chatterFeed");
        });
    }

        function createMemberCard(type, subjectId) {
            setupLightning(function() {
        		//$Lightning.createComponent("forceChatter:feed", {type: type, subjectId: subjectId}, "chatterFeed");
            $Lightning.createComponent("c:DigitalMemberShip", "", "memberCard");
            //$Lightning.createComponent("c:DigitalMemberShip", "", "chatterFeed");
            });
        }

    function forceInit() {
	     force.init(config);
     };
var _lightningReady = false;
    function handleOpenURL(url) {
        console.log('url', url);
        //window.location.href = '#/app/offers/qrcode';
        var prefix = 'accor://';
        var result = '#/app/'+ url;
        console.log('result', result);
        window.location.href = result;
    }

    function setupLightning(callback) {
	var appName = config.loApp;
	var oauth = force.getOauth();
    if (!oauth) {
        alert("Please login to Salesforce.com first!");
        return;
    }

	if (_lightningReady) {
		if (typeof callback === "function") {
			callback();
		}
	} else {
	    // Transform the URL for Lightning
	    var url = oauth.instanceUrl.replace("my.salesforce", "lightning.force");
      console.log ("oauth token " + oauth.access_token);
      console.log ("url  " + url);
      console.log ("appName  " + appName);
	    $Lightning.use(appName,
	        function() {
				_lightningReady = true;
				document.getElementById("chatterFeedButton").style.display = "";
				if (typeof callback === "function") {
					callback();
				}
	        }, url, oauth.access_token);
	}
}
