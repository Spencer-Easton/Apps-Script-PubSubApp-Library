/*
   PubSubApp - PublishingApp.gs
 
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

/*global tokenService_*/
/*global CALLPAGE_*/
/*global CALL_*/


/********************************************
 * The constructor for the PublishingApp service
 * @param {string} projectId The API project ID of the pub/sub service. 
 * @return {object} The PublishingApp service
 *********************************************/
function PublishingApp(projectId) {
  return new ProjectTopic_(projectId);
}


/********************************************
 *********************************************/
function ProjectTopic_(projectId) {

  if (!tokenService_) {
    throw new Error("You must set a token service first");
  }
  var self = this;
  self.project = projectId;


  /********************************************
   *********************************************/
  self.getTopics = function() {
    var path = 'projects/' + self.project + '/topics',
      options = {
        method: "GET"
      },
      topics = CALLPAGE_(path, options, "topics");
    return topics;
  };

  /********************************************
   *********************************************/
  self.getTopicName = function(topic) {
    var path = "projects/" + self.project + "/topics/" + topic,
      options = {
        method: "GET"
      },
      topicName = CALL_(path, options).name;
    return topicName;
  };

  /********************************************
   *********************************************/
  self.getTopic = function(topic) {
    return new Topic(self.getTopicName(topic));
  };

  /********************************************
   *********************************************/
  self.newTopic = function(topic) {

    // check for valid topic naming
    var expression = new RegExp(/^(?!goog)[a-z][a-z0-9-_\.~+%]{2,254}$/i);
    if (!expression.test(topic)) {
      throw new Error("Invalid Topic Name");
    }

    var path = 'projects/' + self.project + '/topics/' + topic,
      options = {
        method: "PUT"
      },
      topicName = CALL_(path, options).name;
    return new Topic(topicName);
  };

  /********************************************
   *********************************************/

  self.deleteTopic = function(topic) {
    var topicName = self.getTopicName(topic),
      path = 'projects/' + self.project + '/topics/' + topicName,
      options = {
        method: "DELETE"
      };
    CALL_(path, options);
    return self;
  };

  /********************************************
   *
   *********************************************/
  function Topic(topicName) {
    var topicObj = this;
    topicObj.topicName_ = topicName;


    /********************************************
     *********************************************/
    topicObj.setIamPolicy = function(policyResource) {
      var postBody = JSON.stringify({
          policy: policyResource
        }),
        path = topicObj.topicName_ + ":setIamPolicy",
        options = {
          method: "POST",
          payload: postBody
        };
      return CALL_(path, options);
    };

    /********************************************
     *********************************************/
    topicObj.getIamPolicy = function() {
      var path = topicObj.topicName_ + ":getIamPolicy",
        options = {
          method: "GET"
        };
      return CALL_(path, options);
    };

    /********************************************
     *********************************************/
    topicObj.testIamPolicy = function(permissionsArray) {

      var path = topicObj.topicName_ + ":testIamPermissions",
        options = {
          method: "POST",
          payload: JSON.stringify({
            "permissions": permissionsArray
          })
        };

      return CALL_(path, options);
    };
    /********************************************
     *********************************************/
    topicObj.getSubscriptions = function() {
      var path = topicObj.topicName_ + "/subscriptions",
        options = {
          method: "GET"
        },
        subscriptions = CALLPAGE_(path, options, "subscriptions");
      return subscriptions;
    };

    /********************************************
     *********************************************/
    topicObj.publish = function(Message) {

      var postBody = JSON.stringify({
          messages: [Message]
        }),
        path = topicObj.topicName_ + ":publish",
        options = {
          method: "POST",
          payload: postBody
        };
      return CALL_(path, options);
    };

    /********************************************
     *********************************************/
    topicObj.getName = function() {
      return topicObj.topicName_
    };
    return topicObj;
  }

  /********************************************
   *********************************************/
  self.newMessage = function() {
    var message = {};
    message.data = "";
    message.attributes = {};
    return JSON.parse(JSON.stringify(message));
  };
  return self;
}