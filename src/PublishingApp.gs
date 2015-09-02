/********************************************
* The constructor for the PublishingApp service
* @param {string} projectId The API project ID of the pub/sub service. 
* @return {object} The PublishingApp service
*********************************************/
function PublishingApp(projectId){return new ProjectTopic_(projectId)}


/********************************************
*********************************************/
function ProjectTopic_(projectId){
  
  if(!tokenService_){
    throw new Error("You must set a token service first")
  }
  var self = this;
  self.project = projectId;
  
  
  /********************************************
  *********************************************/
  self.getTopics = function(){
    var path = 'projects/'+self.project+'/topics'; 
    var options = {method:"GET"}
    var topics = CALLPAGE_(path,options, "topics")
    return topics;
  }
  
  /********************************************
  *********************************************/
  self.getTopicName = function(topic){
    var path = "projects/"+ self.project +"/topics/"+topic;
    var options = {method:"GET"}
    var topicName = CALL_(path,options).name;
    return topicName;
  }
  
  /********************************************
  *********************************************/
  self.getTopic = function(topic){
    return new Topic(self.getTopicName(topic));
  }
  
  /********************************************
  *********************************************/
  self.newTopic  = function(topic){
    
    // check for valid topic naming
    var expression = new RegExp(/^(?!goog)[a-z][a-z0-9-_\.~+%]{2,254}$/i);
    if(!expression.test(topic)){
      throw new Error("Invalid Topic Name")
    }
    
    var path = 'projects/'+self.project+'/topics/'+topic;
    var options = {method:"PUT"}
    var topicName = CALL_(path,options).name
    return new Topic(topicName);
  }
  
  /********************************************
  *********************************************/
  
  self.deleteTopic = function(topic){
    var topicName = self.getTopicName(topic)
    var path = 'projects/'+self.project+'/topics/'+topicName;
    var options = {method:"DELETE"};
    CALL_(path,options) 
    return self;
  }
  
  /********************************************
  *
  *********************************************/
  function Topic(topicName){
    var topicObj = this;
    topicObj.topicName_ = topicName;
    
    
    /********************************************
    *********************************************/
    topicObj.setIamPolicy = function(policyResource){
      var postBody = JSON.stringify({policy:policyResource});
      var path = topicObj.topicName_+":setIamPolicy";
      var options = {method:"POST",
                     payload:postBody};
      return CALL_(path, options);
    }
    
    /********************************************
    *********************************************/
    topicObj.getIamPolicy = function(){
      var path = topicObj.topicName_+":getIamPolicy";
      var options = {method:"GET"};
      return CALL_(path, options);
    }
    
    /********************************************
    *********************************************/
    topicObj.getSubscriptions = function(){
      var path = topicObj.topicName_+"/subscriptions"
      var options = {method:"GET"}
      var subscriptions = CALLPAGE_(path,options, "subscriptions")
      return subscriptions;
    }
    
    /********************************************
    *********************************************/
    topicObj.publish = function(Message){
      
      var postBody = JSON.stringify({messages:[Message]});
      var path = topicObj.topicName_+":publish";
      var options = {method:"POST",
                     payload:postBody};
      return CALL_(path, options);
    }
    
    /********************************************
    *********************************************/
    topicObj.getName = function(){return topicObj.topicName_}
    return topicObj;
  }
  
  /********************************************
  *********************************************/
  self.newMessage = function() {
    var message = {};
    message.data = "";
    message.attributes = {};
    return JSON.parse(JSON.stringify(message));
  }
  return self;
}
