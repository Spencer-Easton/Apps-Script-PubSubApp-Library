/*
   PubSubApp - SubscriptionApp.gs
 
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
 * Construtor for the SubscriptionApp service
 * @param {string} projectId The API project ID of the pub/sub service
 * @return {object} The SubscriptionApp service
 *********************************************/
function SubscriptionApp(projectId) {
  return new ProjectSubscription_(projectId)
}

/********************************************
 *********************************************/
function ProjectSubscription_(projectId) {
  var self_ = this;
  self_.project = projectId;

  /********************************************
   *********************************************/
  self_.getSubscriptions = function() {
    var path = 'projects/' + self_.project + '/subscriptions',
      options = {
        method: "GET"
      },
      subscriptions = CALLPAGE_(path, options, "subscriptions");
    return subscriptions;
  };

  /********************************************
   *********************************************/
  self_.getSubscription = function(subscriptionName) {
    var path = "projects/" + self_.project + "/subscriptions/" + subscriptionName,
      options = {
        method: "GET"
      },
      subResource = CALL_(path, options);
    return new Subscription(subResource);
  };

  /********************************************
   *********************************************/
  self_.deleteSubscription = function(subscriptionName) {
    var path = "projects/" + self_.project + "/subscriptions/" + subscriptionName,
      options = {
        method: "DELETE"
      };
    CALL_(path, options);
    return self_;
  };

  /********************************************
   *********************************************/
  self_.newSubscription = function(subscriptionName, topicName, endPoint) {
    var expression = new RegExp(/^(?!goog)[a-z][a-z0-9\-_\.~+%]{2,254}$/i);
    if (!expression.test(subscriptionName)) {
      throw new Error("Invalid Subscription Name");
    }
    var path = "projects/" + self_.project + "/subscriptions/" + subscriptionName,
      subOptions = {
        topic: topicName,
        pushConfig: {},
        ackDeadlineSeconds: 30
      };

    if (endPoint) {
      subOptions.pushConfig.pushEndpoint = endPoint;
    }
    var options = {
        method: "PUT",
        payload: JSON.stringify(subOptions)
      },
      subResource = CALL_(path, options);
    return new Subscription(subResource);
  };

  /********************************************
   *********************************************/
  function Subscription(subResource) {
    var selfSub = this;
    selfSub.resource = subResource;

    /******************************************/
    /******************************************/
    selfSub.getResource = function() {
      return selfSub.resource
    };

    /******************************************/
    /******************************************/
    selfSub.setIamPolicy = function(policyResource) {
      var path = selfSub.resource.name + ":setIamPolicy",
        options = {
          method: "POST",
          payload: JSON.stringify({
            policy: policyResource
          })
        };
      return CALL_(path, options);
    };

    /******************************************/
    /******************************************/
    selfSub.getIamPolicy = function() {
      var path = selfSub.resource.name + ":getIamPolicy",
        options = {
          method: "GET"
        };
      return CALL_(path, options);
    };

    /******************************************/
    /******************************************/
    selfSub.testIamPolicy = function(permissionsArray) {
      var path = selfSub.resource.name + ":testIamPermissions",
        options = {
          method: "POST",
          payload: JSON.stringify({
            "permissions": permissionsArray
          })
        };
      return CALL_(path, options);
    };

    /******************************************/
    /******************************************/
    selfSub.pull = function(maxCount, autoAck) {
      var autoAck = autoAck !== false,
        returnMessages = [],
        ackIds = [],
        maxCount = maxCount || 1,
        payload = {
          "returnImmediately": true,
          "maxMessages": maxCount,
        },
        path = selfSub.resource.name + ":pull",
        options = {
          method: "POST",
          payload: JSON.stringify(payload)
        },
        messages = CALL_(path, options).receivedMessages;
      if (autoAck) {
        for (var i in messages) {
          ackIds.push(messages[i].ackId);
        }
        if (ackIds.length > 0) {
          selfSub.ack(ackIds);
        }
      }
      return messages;
    };

    /******************************************/
    /******************************************/
    selfSub.modifyAckDeadline = function(ackIds, seconds) {
      var payload = {
          ackIds: ackIds,
          "ackDeadlineSeconds": seconds
        },
        path = selfSub.resource.name + ":modifyAckDeadline",
        options = {
          method: "POST",
          payload: JSON.stringify(payload)
        };
      CALL_(path, options);
      return selfSub;
    };

    /******************************************/
    /******************************************/
    selfSub.ack = function(ackIds) {
      var payload = {
          ackIds: ackIds
        },
        path = selfSub.resource.name + ":acknowledge",
        options = {
          method: "POST",
          payload: JSON.stringify(payload)
        };
      CALL_(path, options);
      return selfSub;
    };
  }
  return self_;
}