/*
   PubSubApp - PubSubApp.gs
 
   Copyright (c) 2015 Spencer Easton
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/



var BASEURL_ = 'https://pubsub.googleapis.com/v1/';
var tokenService_;

/*
 * Stores the function passed that is invoked to get a OAuth2 token;
 * @param {function} service The function used to get the OAuth2 token;
 *
 */
function setTokenService(service) {
  tokenService_ = service;
}


function CALL_(path, options) {
  var fetchOptions = {
      method: "",
      muteHttpExceptions: true,
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + tokenService_()
      }
    },
    url = BASEURL_ + path;

  for (var option in options) {
    fetchOptions[option] = options[option];
  }

  /*global UrlFetchApp*/
  var response = UrlFetchApp.fetch(url, fetchOptions);
  if (response.getResponseCode() != 200) {
    throw new Error(response.getContentText());
  }
  else {
    return JSON.parse(response.getContentText());
  }
}

function CALLPAGE_(path, options, returnParamPath) {
  var fetchOptions = {
    method: "",
    muteHttpExceptions: true,
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + tokenService_()
    }
  };
  for (var option in options) {
    fetchOptions[option] = options[option];
  }

  var url = BASEURL_ + path,
    returnArray = [],
    nextPageToken;
  do {
    if (nextPageToken) {
      url += "?pageToken=" + nextPageToken;
    }
    var results = UrlFetchApp.fetch(url, fetchOptions);
    if (results.getResponseCode() != 200) {
      throw new Error(results.getContentText());
    }
    else {
      var resp = JSON.parse(results.getContentText());
      nextPageToken = resp.nextPageToken;
      returnArray = returnArray.concat(resp[returnParamPath]);
    }

  } while (nextPageToken);
  return returnArray;
}