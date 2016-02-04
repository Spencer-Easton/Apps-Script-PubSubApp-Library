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