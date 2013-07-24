// @ Utilities for gremlin resource

// translate complex exceptions from java
module.exports.simplifye = function simplifye(e){
  var except = {};

  if (e.toString().indexOf("OSecurityAccessException") != -1) {
    except = {
      error: "ERROR: Database access error - check your credentials.",
      stacktrace: e
    };
  }
  else if (e.toString().indexOf("OConfigurationException") != -1){
    except = {
      error: "ERROR: Configuration error - check your database name.",
      stacktrace: e
    };
  }
  else if (e.toString().indexOf("NoClassDefFoundError") != -1){
    except = {
      error: "ERROR: Configuration error - check javacom name is correct and jars exist for gremlin-node.",
      stacktrace: e
    };
  }
  else {
    except = {
      error: "ERROR: Unknown - check stack trace.",
      stacktrace: e
    };
  }

  return except;
};