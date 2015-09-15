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
