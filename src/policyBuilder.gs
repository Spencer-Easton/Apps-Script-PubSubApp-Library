/********************************************
 * The constructor of the policyBuilder service
 * @return {object} The policyBuilder service
 *********************************************/
function policyBuilder() {
  return new policyBuilder_();
}

function policyBuilder_() {
  var policyBuilder = this,
    POLICY = JSON.stringify({
      bindings: []
    }),
    ROLES = Object.freeze({
      Viewer: "roles/viewer",
      Editor: "roles/editor",
      Owner: "roles/owner",
      Publisher: "roles/pubsub.publisher",
      Subscriber: "roles/pubsub.subscriber"
    }),
    MEMBERTYPE = Object.freeze({
      ALLUSERS: "allAuthenticatedUsers",
      USER: "user:",
      SERVICEACCOUNT: "serviceAccount:",
      GROUP: "group:",
      DOMAIN: "domain:"
    });


  /********************************************
   * Creates a Policy object from an existing IAM policy resource
   * @param {object} policyResource The policy resource to edit
   * @return {object} new Policy object
   *********************************************/
  policyBuilder.editPolicy = function(policyResource) {
    var policyMap = {},
      policy = policyResource.bindings;
    for (var i in policy) {
      if (!(policy[i].role in policyMap)) {
        policyMap[policy[i].role] = [];
      }
      for (var ii in policy[i].members) {
        policyMap[policy[i].role].push(policy[i].members[ii]);
      }
    }
    return new Policy_(policyMap);
  };

  /********************************************
   * Creates a new Policy object
   * @return {object} new Policy object
   *********************************************/
  policyBuilder.newPolicy = function() {
    return new Policy_();
  };

  function Policy_(policyMap) {
    var policyMapper = policyMap || {};
    var thisPolicy = this;

    for (var role in ROLES) {
      /********************************************
       * Add member to policy role
       * @param {string} memberRole The role defined in MEMBERTYPE object
       * @param {string} Name The name, usually the email, of the user
       * @return {object} this Policy object
       *********************************************/
      thisPolicy["add" + role] = (function(myRole) {
        return function(memberType, Name) {
          addMember_(myRole, memberType.toUpperCase(), Name);
          return thisPolicy;
        };
      })(role);

      /********************************************
       * remove member from policy role      
       * @param {string} Name The name, usually the email, of the user
       * @return {object} this Policy object
       *********************************************/
      thisPolicy["remove" + role] = (function(myRole) {
        return function(Name) {
          removeMember_(myRole, Name);
          return thisPolicy;
        };
      })(role);

    }

    /******************************************/
    /******************************************/
    function addMember_(role, memberType, name) {
      var name = name || "";
      if (!(ROLES[role] in policyMapper)) {
        policyMapper[ROLES[role]] = [];
      }
      policyMapper[ROLES[role]].push(MEMBERTYPE[memberType] + name);
    }

    /******************************************/
    /******************************************/
    function removeMember_(role, name) {
      var name = name || "";
      for (var i = 0; i < policyMapper[ROLES[role]].length; i++) {
        if (policyMapper[ROLES[role]][i].indexOf(name) != -1) {
          policyMapper[ROLES[role]].splice(i, 1);
        }
      }
    }
    /********************************************
     * Return this poliocy as a IAM PolicyResource
     * @return {object} IAM policy resource object
     *********************************************/
    thisPolicy.getPolicy = function() {
      var returnPolicy = JSON.parse(POLICY),
        members;
      for (var policy in policyMapper) {
        returnPolicy.bindings.push({
          role: policy,
          members: policyMapper[policy]
        });
      }
      return returnPolicy;
    };
    return thisPolicy;
  }
  return policyBuilder;
}