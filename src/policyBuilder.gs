/********************************************
* The constructor of the policyBuilder service
* @return {object} The policyBuilder service
*********************************************/
function policyBuilder(){return new policyBuilder_()}

/********************************************
*********************************************/
var policyBuilder_ = function(){
  var policyBuilder = this,
      POLICY = JSON.stringify({bindings:[]}),
      ROLES = Object.freeze({VIEWER:"roles/viewer",EDITOR:"roles/editor",OWNER:"roles/owner",PUBLISHER:"roles/pubsub.publisher",SUB:"roles/pubsub.subscriber"}),
      MEMBERTYPE = Object.freeze({ALLUSERS:"allAuthenticatedUsers",USER:"user:",SERVICEACCOUNT:"serviceAccount:",GROUP:"group:", DOMAIN:"domain:"});
  
  
  /********************************************
  *********************************************/
  policyBuilder.editPolicy = function(policyResource){
    var policyMap = {};
    var policy = policyResource.bindings;
    for(i in policy){
      if(!(policy[i].role in policyMap)){policyMap[policy[i].role] = [];}
      for(ii in policy[i].members){
        policyMap[policy[i].role].push(policy[i].members[ii])
      }
    }
    return new Policy_(policyMap);
  }
  
  /********************************************
  *********************************************/ 
  policyBuilder.newPolicy = function(){
    return new Policy_();
  }
  
  /********************************************
  *********************************************/
  function Policy_(policyMap){
    var policyMapper = policyMap || {};
    var thisPolicy = this;
    
    /******************************************/
    /******************************************/
    thisPolicy.removeOwner = function(name){
      removeMember_(ROLES["OWNER"],name);
      return thisPolicy;
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.removeEditor = function(name){
      removeMember_(ROLES["EDITOR"],name);
      return thisPolicy;
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.removeViewer = function(name){
      removeMember_(ROLES["VIEWER"],name);
      return thisPolicy;
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.removePublisher = function(name){
      removeMember_(ROLES["PUBLISHER"],name);
      return thisPolicy;
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.removeSubscriber = function(name){
      removeMember_(ROLES["SUB"],name);
      return thisPolicy;
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.addOwner = function(memberType,Name){
      addMember_("OWNER",memberType.toUpperCase(),Name);
      return thisPolicy; 
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.addEditor = function(memberType,Name){
      addMember_("EDITOR",memberType.toUpperCase(),Name);
      return thisPolicy; 
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.addViewer = function(memberType,Name){
      addMember_("VIEWER",memberType.toUpperCase(),Name);
      return thisPolicy; 
    };
    
    /******************************************/
    /******************************************/
    thisPolicy.addPublisher = function(memberType,Name){
      addMember_("PUBLISHER",memberType.toUpperCase(),Name);
      return thisPolicy; 
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.addSubscriber = function(memberType,Name){
      addMember_("SUB",memberType.toUpperCase(),Name);
      return thisPolicy; 
    }
    
    /******************************************/
    /******************************************/
    function addMember_(role,memberType,name){
      if(!name)name="";
      if(!(ROLES[role] in policyMapper)){policyMapper[ROLES[role]] = [];}
      policyMapper[ROLES[role]].push(MEMBERTYPE[memberType]+name);
    }
    
    /******************************************/
    /******************************************/
    function removeMember_(role,name){
      if(!name)name="";
      for(var i = 0; i < policyMapper[role].length;i++){
        if(policyMapper[role][i].indexOf(name) != -1){policyMapper[role].splice(i,1)};
      }
    }
    
    /******************************************/
    /******************************************/
    thisPolicy.getPolicy = function(){
      var returnPolicy = JSON.parse(POLICY);
      var members;
      for(var policy in policyMapper){
        returnPolicy.bindings.push({role:policy,members:policyMapper[policy]})
      }
      return returnPolicy;
    } 
    return thisPolicy;
  }
   return policyBuilder;
}
