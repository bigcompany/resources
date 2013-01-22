/*

  calc.js - baban
  15 Jan 2013
  this is my first script i made with the help of marak
*/

//
// define the main calculator object
//
var calc = {};


// resource = require("resource");
// calc = resource.define("calc");

//
// define the addition method
//
calc.add = function (a, b) {
  return a + b; 
}
// calc.method("add", add);
//
// define the subtraction method
//
calc.subtract = function (a, b) {
  return a - b;
}
//
// define the multiplication method
//
calc.multiply = function (a, b) {
  return a * b;
}

//
// define the division method
//
calc.divide = function (a, b) {
  return a / b;
}
//
// define the power method
//
calc.power = function (a, b) {
  return Math.pow(a, b);
};
//
// define the square root method
//
calc.squareroot = function (a) {
  return Math.sqrt(a);
};
//
// define the cube root method
//
calc.cuberoot = function (a) {
  return Math.pow(a, 1 / 3);
};
//
// define the nthroot method
//
calc.nthroot = function (a, b) {
  return Math.pow(a, 1 / b);
};
//
// define the factorial method
//
calc.factorial = function (a) {
 var result = 1;
 for (var i = 1; i <= a; i++) {
    result = result * i;
  }
  return result;
};
//
// define the isEven method
//
calc.isEven = function (a) {
 var result = a % 2;
 if (result === 1) {
    return false;
  } else {
    return true;
  }
};
//
//define the isOdd method
//
calc.isOdd = function (a) {
 return !calc.isEven(a);
};


console.log(calc);
console.log(calc.add(2, 4));
console.log(calc.subtract(2, 4));
console.log(calc.multiply(2, 4));
console.log(calc.divide(2, 4));
console.log(calc.power(6, 3));
console.log(calc.squareroot(64));
console.log(calc.cuberoot(27));
console.log(calc.factorial(5));
console.log(calc.isEven(10, 5));
console.log(calc.isOdd(9, 3));


// square root (a)
// cube root (a)
// factorial 5!, 5+4+3+2+1 (a)
// isOdd (a)
// isEven (a)
//
//resource.use("admin"); 
//resource.admin.listen();
