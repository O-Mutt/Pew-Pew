/**
 * Created with IntelliJ IDEA.
 * User: Todd Kerpelman
 * Date: 9/28/12
 * Time: 11:11 AM
 *
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

"use strict";

var login = login || {};


login.userId = '';
login.loggedIn = false;


login.scopes = 'https://www.googleapis.com/auth/games https://www.googleapis.com/auth/appstate';

login.GooglePlayer = login.GooglePlayer  || {};

login.GooglePlayer.displayName = '';
login.GooglePlayer.profileUrl = '';
login.GooglePlayer.userId = '';

login.GooglePlayer.loadLocalPlayer = function() {
  var request = gapi.client.games.players.get({playerId: 'me'});
  request.execute(function(response) {
    $('#welcome #message').text('Welcome, ' + response.displayName + '!');
    login.GooglePlayer.displayName = response.displayName;
    login.GooglePlayer.profileUrl = response.avatarImageUrl;
    login.GooglePlayer.userId = response.playerId;
    //welcome.dataLoaded(welcome.ENUM_PLAYER_DATA);
  });
};

/**
 * This function allows us to load up the game service via the discovery doc
 * and makes calls directly through the client library instead of needing
 * to specify the REST endpoints.
 */
login.loadClient = function() {
  // Load up /games/v1
  gapi.client.load('games','v1',function(response) {
    login.GooglePlayer.loadLocalPlayer();
    //achManager.loadData();
    //leadManager.preloadData();
    //welcome.loadUp();
    //challenge.tryToLoad();
	//Game.Create();
  });

  // Load up v1management
  gapi.client.load('gamesManagement','v1management', function(response) {
    //welcome.dataLoaded(welcome.ENUM_MANAGEMENT_API);
  });

  // Load up /plus/v1
  gapi.client.load('plus','v1', function(response) {
    //welcome.dataLoaded(welcome.ENUM_PLUS_API)
  });

};


login.handleAuthResult = function(auth) {
  console.log('We are in handle auth result');
  if (auth) {
    console.log('Hooray! You\'re logged in!');
    login.loadClient();
  } else {
	console.log('BOOOO! Failed login')	
	login.loginAlertCallback('Yes');//navigator.notification.confirm('In order to take full advantage of Galaga we would like to log you in with your Google+ account', login.logingAlertCallback, 'Login Please', 'Yes,No');
  }
};

login.trySilentAuth = function() {
	console.log('Trying silent auth');
	gapi.auth.authorize({client_id: googleConstants.CLIENT_ID, scope: login.scopes, immediate: true}, login.handleAuthResult);
};

login.showLoginDialog=function() {
	console.log('Show Login Dialog');
	gapi.auth.authorize({client_id: googleConstants.CLIENT_ID, scope: login.scopes, immediate: false}, login.handleAuthResult);
};

login.loginAlertCallback = function(button) {
	if (button === 'Yes') {
		login.showLoginDialog();
	} else {
		console.log('bitches don\'t like loggin in');
	}
}


