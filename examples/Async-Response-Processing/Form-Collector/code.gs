/*
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

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index').setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function handleResponse(response){
  try{
    PubSubApp.setTokenService(getTokenService());
    var pub = PubSubApp.PublishingApp('api-project-665...208');
    var message = pub.newMessage();
    message.data = Utilities.base64Encode(response);
    pub.getTopic('response').publish(message);
    return true;
  }catch(e){throw new Error(e)}
  
}


function getTokenService(){
  var jsonKey = JSON.parse(PropertiesService.getScriptProperties().getProperty("jsonKey"));  
  var privateKey = jsonKey.private_key;
  var serviceAccountEmail = jsonKey.client_email; 
  var sa = GSApp.init(privateKey, ['https://www.googleapis.com/auth/pubsub'], serviceAccountEmail);
  sa.addUser(serviceAccountEmail)
  .requestToken();
  return sa.tokenService(serviceAccountEmail);
}
