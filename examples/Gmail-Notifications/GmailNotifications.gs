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

var PROJECTID = 'api-project-3...9';
var WEBHOOK_URL = 'https://script.google.com/a/macros/ccsknights.org/s/AKfycbw_RzzP6WiptJ9T9EQKiW9I5AaZfhXAiWYrkcx9OOvc11s0_J8e/exec'

function doPost(e){
  var postBody = JSON.parse(e.postData.getDataAsString());
  var messageData = Utilities.newBlob(Utilities.base64Decode(postBody.message.data)).getDataAsString();
  var ss = SpreadsheetApp.openById('1URu5nXCHLHYz5bEhMoRSb3reFdvrfb5Sl3zP0Rc00s8').getSheetByName("Log");
  ss.appendRow([new Date(), messageData, JSON.stringify(postBody,undefined,2)])
  return 200;
}

function setupPubSub(){
  var newTopic = CreateTopic("mailTrigger");
  newTopic.setIamPolicy(addGmailPolicy());
  Logger.log(newTopic.getName());
  var newSub = CreateSubscription("mailTrigger",newTopic.getName(),WEBHOOK_URL);
}

function enrollEmail(){
  PubSubApp.setTokenService(getTokenService())
  var topicName = PubSubApp.PublishingApp(PROJECTID).getTopicName("mailTrigger")
  Logger.log(watchEmail(topicName,{labelIds:["INBOX"]}));
}

function disEnrollEmail(){
  var res = UrlFetchApp.fetch("https://www.googleapis.com/gmail/v1/users/me/stop",{method:"POST",headers:{authorization:"Bearer "+ScriptApp.getOAuthToken()}});
  Logger.log(res.getContentText());
}


function addGmailPolicy(Policy){
  return PubSubApp.policyBuilder()
  [(Policy)?"editPolicy":"newPolicy"](Policy)
  .addPublisher("SERVICEACCOUNT", 'gmail-api-push@system.gserviceaccount.com')
  .getPolicy();
}

function addDomainSubs(Domain,Policy){
  return PubSubApp.policyBuilder()
  [(Policy)?"editPolicy":"newPolicy"](Policy)
  .addPublisher("DOMAIN", Domain)
  .getPolicy();
}

function getSubscriptionPolicy(){
  return PubSubApp.policyBuilder()
  .newPolicy()
  .addSubscriber("DOMAIN","ccsknights.org")
}

function watchEmail(fullTopicName,watchOptions){
  var options = {email:"me",token:ScriptApp.getOAuthToken(),labelIds:[]};
  
  for(var option in watchOptions){
    if(option in options){
      options[option] = watchOptions[option];
    }
  }
   Logger.log(options);
  var url = "https://www.googleapis.com/gmail/v1/users/"+options.email+"/watch"
  
  var payload = {
    topicName: fullTopicName,
    labelIds: options.labelIds
  }
  
  var params = {
    method:"POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers:{Authorization: "Bearer "+ options.token
    },
    muteHttpExceptions:true
  }
  
   var results = UrlFetchApp.fetch(url, params);
  
  if(results.getResponseCode() != 200){
     throw new Error(results.getContentText())
  }else{
    return JSON.parse(results.getContentText());
  }
  
 }

function CreateTopic(topicName) {
  var topic;
  PubSubApp.setTokenService(getTokenService());
  var pubservice = PubSubApp.PublishingApp(PROJECTID);
  try{topic = pubservice.newTopic(topicName)}
  catch(e){topic = pubservice.getTopic(topicName);}
  return topic;  
}

function CreateSubscription(subscriptionName,topicName,webhookUrl){
  var sub;
  PubSubApp.setTokenService(getTokenService());
  var subService = PubSubApp.SubscriptionApp(PROJECTID);
  try{sub = subService.newSubscription(subscriptionName,topicName,webhookUrl)}
  catch(e){sub = subService.getSubscription(subscriptionName,topicName,webhookUrl)}
  return sub;
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


function requestGmailScope_(){GmailApp.getAliases()}
