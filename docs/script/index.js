!function(t){var e={};function n(r){if(e[r])return e[r].exports;var s=e[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:r})},n.r=function(t){Object.defineProperty(t,"__esModule",{value:!0})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s="./index.js")}({"./index.js":function(t,e,n){"use strict";n.r(e);n("./script/script.js"),n("./style/style.sss")},"./script/dom-polyfill.js":function(t,e,n){"use strict";DOMTokenList.prototype.replace||(DOMTokenList.prototype.replace=function(t,e){this.contains(t)&&(this.remove(t),this.add(e))})},"./script/script.js":function(t,e,n){"use strict";n("./script/dom-polyfill.js");document.addEventListener("submit",function(t){t.preventDefault()}),document.body.classList.replace("scripting-unavailable","scripting-available")},"./style/style.sss":function(t,e,n){}});
//# sourceMappingURL=index.js.map