/*

  calc.js - baban
  15 Jan 2013
  this is my first script i made with the help of marak
*/

//
// define the main calculator object
//


var resource = require("resource"),
 calc = resource.define("calculator");

calc.schema.description = "a basic calculator";

//
// define the addition method
//
var add = function (options, callback) {
  var result = options.a + options.b;
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
}
calc.method("add", add, {
  "description": "returns the sum of two numbers",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
          "type": "number"
        },
        "b": {
          "type": "number"
        }
       }
     },
     "callback": {
       "type": "function",
       "required": false
     }
   }
});
//
// define the subtraction method
//
var subtract = function (options, callback) {
  var result = options.a - options.b;
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
}
calc.method("subtract", subtract, {
  "description": "returns the difference of two numbers",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
          "type": "number"
        },
        "b": {
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    } 
  }
});


//
// define the multiplication method
//
var multiply = function (options, callback) {
  var result = options.a * options.b;
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
};

calc.method("multiply", multiply, {
  "description": "returns the product of two numbers",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
          "type": "number"
        },
        "b": {
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});


//
// define the division method
//
var divide = function (options, callback) {
  var result = options.a / options.b;
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
};

calc.method("divide", divide, {
  "description": "returns the result by dividing two numbers",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
         "type": "number"
        },
        "b": {
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});


//
// define the power method
//
var power = function (options, callback) {
  var result = Math.pow(options.a, options.b);
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
};
 
calc.method("power", power, {
  "description": "returns the raised power of two numbers",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
         "type": "number"
        },
	"b": {
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});



//
// define the square root method
//
var squareroot = function (options, callback) {
  var result = Math.sqrt(options.a);
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
}
calc.method("squareroot", squareroot, {
  "description": "returns the squareoot of number",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
         "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});


//
// define the cube root method
//
var cuberoot = function (options, callback) {
  var result = Math.pow(options.a, 1/3);
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
};

calc.method("cuberoot", cuberoot, {
  "description": "returns the cuberoot of number",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
         "type": "number"
        },
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});

//
// define the nthroot method
//
var nthroot = function (options, callback) {
  var result = Math.pow(options.a, 1/options.b);
  if (callback) {
    callback(null, result);
  } else {
    return result;
  }
};

calc.method("nthroot", nthroot, {
  "description": "returns the nthroot of number",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
          "type": "number"
        },
        "b":{
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});


//
// define the factorial method
//
var factorial = function (options, callback) {
 var result = 1;
 for (var i = 1; i <= options.a; i++) {
  result = result * i;
 }
 if (callback) {
   callback(null, result);
 } else {
   return result;
 }
};

calc.method("factorial", factorial, {
  "description": "returns the factorial of number",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});


///
// define the isEven method
//
var isEven = function (options, callback) {
  var result = options.a % 2;
  if (result === 1){
    result = false;
  } else {
    result = true;
  }
  if (callback) {
    callback (null, result);
  } else {
    return result;
  }
}
calc.method("isEven", isEven, {
  "description": "returns the result of number as even",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});

//
//define the isOdd method
//
var isOdd = function (options, callback) {
  var result = options.a % 2;
  if (result === 0){
    result = false;
  } else {
    result = true;
  }
  if (callback) {
    callback (null, result);
  } else {
    return result;
  }
};

calc.method("isOdd", isOdd, {
  "description": "returns the result of number as odd",
  "properties": {
    "options": {
      "type": "object",
      "properties": {
        "a":{
          "type": "number"
        }
      }
    },
    "callback": {
      "type": "function",
      "required": false
    }
  }
});

exports.calculator = calc;