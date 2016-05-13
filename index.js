/* implementation: Copyright (C) 2012-2013 Kurt Milam - http://xioup.com | Source: https://gist.github.com/1868955
*  NPM packaging: Copyright (C) 2012-2014 Pierre-Yves Gérardy | https://github.com/pygy/underscoreDeepExtend
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

( // Module boilerplate to support browser globals, node.js and AMD.
  (typeof module !== "undefined" && function (m) { module.exports = m(); }) ||
  (typeof define === "function" && function (m) { define('underscoreDeepExtend', m); }) ||
  (function (m) { window['underscoreDeepExtend'] = m(); })
)(function () { return function(_) {

return function underscoreDeepExtend(obj) {
  var parentRE = /#{\s*?_\s*?}/,
      source,
  
      isAssign = function (oProp, sProp) {
        return (_.isUndefined(oProp) || _.isNull(oProp) || _.isFunction(oProp) || _.isNull(sProp) || _.isDate(sProp));
      },
  
      procAssign = function (oProp, sProp, propName) {
        // Perform a straight assignment
        // Assign for object properties & return for array members
        return obj[propName] = _.clone(sProp);
      },
  
      hasRegex = function (oProp, sProp) {
        return ( _.isString(sProp) && parentRE.test(sProp) );
      },
  
      procRegex = function (oProp, sProp, propName) {
        // Perform a string.replace using parentRE if oProp is a string
        if (!_.isString(oProp)) {
          // We're being optimistic at the moment
          // throw new Error('Trying to combine a string with a non-string (' + propName + ')');
        }
        // Assign for object properties & return for array members
        return obj[propName] = sProp.replace(parentRE, oProp);
      },
  
      hasArray = function (oProp, sProp) {
        return (_.isArray(oProp) || _.isArray(sProp));
      },
  
      procArray = function (oProp, sProp, propName) {
        // extend oProp if both properties are arrays
        if (!_.isArray(oProp) || !_.isArray(sProp)){
          throw new Error('Trying to combine an array with a non-array (' + propName + ')');
        }
        var tmp = _.deepExtend(obj[propName], sProp);
        // Assign for object properties & return for array members
        return obj[propName] = _.reject(tmp, _.isNull);
      },
  
      hasObject = function (oProp, sProp) {
        return (_.isObject(oProp) || _.isObject(sProp));
      },
  
      procObject = function (oProp, sProp, propName) {
        // extend oProp if both properties are objects
        if (!_.isObject(oProp) || !_.isObject(sProp)){
          throw new Error('Trying to combine an object with a non-object (' + propName + ')');
        }
        // Assign for object properties & return for array members
        return obj[propName] = _.deepExtend(oProp, sProp);
      },

      procMain = function(propName) {
        var oProp = obj[propName],
            sProp = source[propName];
          
        // The order of the 'if' statements is critical
        
        // Cases in which we want to perform a straight assignment
        if ( isAssign(oProp, sProp) ) {
          procAssign(oProp, sProp, propName);
        }
        // sProp is a string that contains parentRE
        else if ( hasRegex(oProp, sProp) ) {
          procRegex(oProp, sProp, propName);
        }
        // At least one property is an array
        else if ( hasArray(oProp, sProp) ){
          procArray(oProp, sProp, propName);
        }
        // At least one property is an object
        else if ( hasObject(oProp, sProp) ){
          procObject(oProp, sProp, propName);
        }
        // Everything else (I don't think we ever reach this else)
        else {
          // Let's be optimistic and perform a straight assignment
          obj[propName] = procAssign(oProp, sProp, propName);
        }
      },
  
      extendObject = function(src) {
        source = src;
        Object.keys(source).forEach(procMain);
      };

  _.each(Array.prototype.slice.call(arguments, 1), extendObject);
  
  return obj;
};

};
});
