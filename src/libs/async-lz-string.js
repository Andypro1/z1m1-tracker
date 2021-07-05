var LIB=function(t){var e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(r,a,function(e){return t[e]}.bind(null,a));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";n.r(e),n.d(e,"compressToUTF16",(function(){return y})),n.d(e,"decompressFromUTF16",(function(){return m}));var r=function(t,e,n,r){return new(n||(n=Promise))((function(a,o){function i(t){try{c(r.next(t))}catch(t){o(t)}}function u(t){try{c(r.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,u)}c((r=r.apply(t,e||[])).next())}))},a=function(t,e){var n,r,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(a=i.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){i.label=o[1];break}if(6===o[0]&&i.label<a[1]){i.label=a[1],a=o;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(o);break}a[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(t){o=[6,t],r=0}finally{n=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}};function o(){return r(this,void 0,void 0,(function(){return a(this,(function(t){return[2,new Promise((function(t){setTimeout(t,0)}))]}))}))}var i=function(t,e,n,r){return new(n||(n=Promise))((function(a,o){function i(t){try{c(r.next(t))}catch(t){o(t)}}function u(t){try{c(r.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,u)}c((r=r.apply(t,e||[])).next())}))},u=function(t,e){var n,r,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(a=i.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){i.label=o[1];break}if(6===o[0]&&i.label<a[1]){i.label=a[1],a=o;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(o);break}a[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(t){o=[6,t],r=0}finally{n=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},c=[0,8,4,12,2,10,6,14,1,9,5,13,3,11,7,15];var s=function(){function t(){}return t.writeValueToData=function(t,e,n,r,a){if(n%4!=0||t.dataPosition+n>r-1)for(var o=0;o<n;o++)t.dataVal=t.dataVal<<1|1&e,t.dataPosition==r-1?(t.dataPosition=0,t.data.push(a(t.dataVal)),t.dataVal=0):t.dataPosition++,e>>=1;else t.dataVal<<=n,t.dataVal|=function(t,e){for(var n=0,r=0;r<e;++r)n<<=4,n|=c[15&t],t>>=4;return n}(e,n/4),t.dataPosition+=n},t.writeWToDataVal=function(e,n,r){e.dictionaryToCreate.has(e.w)?(e.w.charCodeAt(0)<256?(t.writeValueToData(e,0,e.numBits,n,r),t.writeValueToData(e,e.w.charCodeAt(0),8,n,r)):(t.writeValueToData(e,1,e.numBits,n,r),t.writeValueToData(e,e.w.charCodeAt(0),16,n,r)),e.enlargeIn--,0==e.enlargeIn&&(e.enlargeIn=Math.pow(2,e.numBits),e.numBits++),e.dictionaryToCreate.delete(e.w)):t.writeValueToData(e,e.dictionary.get(e.w),e.numBits,n,r),e.enlargeIn--,0==e.enlargeIn&&(e.enlargeIn=Math.pow(2,e.numBits),e.numBits++)},t.loopIteration=function(t,e,n,r,a){var o=t.charAt(e);a.dictionary.has(o)||(a.dictionary.set(o,a.dictSize++),a.dictionaryToCreate.set(o,!0));var i=a.w+o;a.dictionary.has(i)?a.w=i:(this.writeWToDataVal(a,n,r),a.dictionary.set(i,a.dictSize++),a.w=String(o))},t.prototype.compress=function(e,n,r){var a=this;return new Promise((function(c){return i(a,void 0,void 0,(function(){var a,i;return u(this,(function(u){switch(u.label){case 0:if(null==e)return c(""),[2];a={data:[],dataPosition:0,dataVal:0,dictionary:new Map,dictionaryToCreate:new Map,dictSize:3,enlargeIn:2,numBits:2,w:""},i=0,u.label=1;case 1:return i<e.length?(t.loopIteration(e,i,n,r,a),i%1e4!=0?[3,3]:[4,o()]):[3,4];case 2:u.sent(),u.label=3;case 3:return i+=1,[3,1];case 4:return""!==a.w&&t.writeWToDataVal(a,n,r),t.writeValueToData(a,2,a.numBits,n,r),a.dataVal<<=n-a.dataPosition,a.data.push(r(a.dataVal)),c(a.data.join("")),[2]}}))}))}))},t}(),l=function(t,e,n,r){return new(n||(n=Promise))((function(a,o){function i(t){try{c(r.next(t))}catch(t){o(t)}}function u(t){try{c(r.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,u)}c((r=r.apply(t,e||[])).next())}))},f=function(t,e){var n,r,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(a=i.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){i.label=o[1];break}if(6===o[0]&&i.label<a[1]){i.label=a[1],a=o;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(o);break}a[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(t){o=[6,t],r=0}finally{n=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},d=function(){function t(){}return t.prototype.decompress=function(t,e,n){var r=this;return new Promise((function(a){return l(r,void 0,void 0,(function(){var r,i,u;return f(this,(function(c){switch(c.label){case 0:for(r={bits:0,c:null,dataIndex:1,dataPosition:e,dataVal:n(0),dictionary:new Map,dictSize:4,enlargeIn:4,entry:"",maxPower:Math.pow(2,2),numBits:3,power:1,resb:null,result:[],w:null},i=0;i<3;i+=1)r.dictionary.set(i,i);for(;r.power!=r.maxPower;)r.resb=r.dataVal&r.dataPosition,r.dataPosition>>=1,0==r.dataPosition&&(r.dataPosition=e,r.dataVal=n(r.dataIndex++)),r.bits|=(r.resb>0?1:0)*r.power,r.power<<=1;switch(r.bits){case 0:for(r.bits=0,r.maxPower=Math.pow(2,8),r.power=1;r.power!=r.maxPower;)r.resb=r.dataVal&r.dataPosition,r.dataPosition>>=1,0==r.dataPosition&&(r.dataPosition=e,r.dataVal=n(r.dataIndex++)),r.bits|=(r.resb>0?1:0)*r.power,r.power<<=1;r.c=String.fromCharCode(r.bits);break;case 1:for(r.bits=0,r.maxPower=Math.pow(2,16),r.power=1;r.power!==r.maxPower;)r.resb=r.dataVal&r.dataPosition,r.dataPosition>>=1,0===r.dataPosition&&(r.dataPosition=e,r.dataVal=n(r.dataIndex++)),r.bits|=(r.resb>0?1:0)*r.power,r.power<<=1;r.c=String.fromCharCode(r.bits);break;case 2:return a(""),[2]}r.dictionary[3]=r.c,r.w=r.c,r.result.push(r.c),u=1,c.label=1;case 1:return u%2e4!=0?[3,3]:[4,o()];case 2:c.sent(),c.label=3;case 3:if(r.dataIndex>t)return a(""),[2];for(r.bits=0,r.maxPower=Math.pow(2,r.numBits),r.power=1;r.power!=r.maxPower;)r.resb=r.dataVal&r.dataPosition,r.dataPosition>>=1,0==r.dataPosition&&(r.dataPosition=e,r.dataVal=n(r.dataIndex++)),r.bits|=(r.resb>0?1:0)*r.power,r.power<<=1;switch(r.c=r.bits){case 0:for(r.bits=0,r.maxPower=Math.pow(2,8),r.power=1;r.power!==r.maxPower;)r.resb=r.dataVal&r.dataPosition,r.dataPosition>>=1,0==r.dataPosition&&(r.dataPosition=e,r.dataVal=n(r.dataIndex++)),r.bits|=(r.resb>0?1:0)*r.power,r.power<<=1;r.dictionary[r.dictSize++]=String.fromCharCode(r.bits),r.c=r.dictSize-1,r.enlargeIn--;break;case 1:for(r.bits=0,r.maxPower=Math.pow(2,16),r.power=1;r.power!==r.maxPower;)r.resb=r.dataVal&r.dataPosition,r.dataPosition>>=1,0==r.dataPosition&&(r.dataPosition=e,r.dataVal=n(r.dataIndex++)),r.bits|=(r.resb>0?1:0)*r.power,r.power<<=1;r.dictionary[r.dictSize++]=String.fromCharCode(r.bits),r.c=r.dictSize-1,r.enlargeIn--;break;case 2:return a(r.result.join("")),[2]}if(0==r.enlargeIn&&(r.enlargeIn=Math.pow(2,r.numBits),r.numBits++),r.dictionary[r.c])r.entry=r.dictionary[r.c];else{if(r.c!==r.dictSize)return a(null),[2];r.entry=r.w+r.w.charAt(0)}return r.result.push(r.entry),r.dictionary[r.dictSize++]=r.w+r.entry.charAt(0),r.enlargeIn--,r.w=r.entry,0==r.enlargeIn&&(r.enlargeIn=Math.pow(2,r.numBits),r.numBits++),u++,[3,1];case 4:return[2]}}))}))}))},t}(),p=function(t,e,n,r){return new(n||(n=Promise))((function(a,o){function i(t){try{c(r.next(t))}catch(t){o(t)}}function u(t){try{c(r.throw(t))}catch(t){o(t)}}function c(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,u)}c((r=r.apply(t,e||[])).next())}))},w=function(t,e){var n,r,a,o,i={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(a=2&o[0]?r.return:o[0]?r.throw||((a=r.return)&&a.call(r),0):r.next)&&!(a=a.call(r,o[1])).done)return a;switch(r=0,a&&(o=[2&o[0],a.value]),o[0]){case 0:case 1:a=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!(a=i.trys,(a=a.length>0&&a[a.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!a||o[1]>a[0]&&o[1]<a[3])){i.label=o[1];break}if(6===o[0]&&i.label<a[1]){i.label=a[1],a=o;break}if(a&&i.label<a[2]){i.label=a[2],i.ops.push(o);break}a[2]&&i.ops.pop(),i.trys.pop();continue}o=e.call(t,i)}catch(t){o=[6,t],r=0}finally{n=a=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}},b=new s,h=new d;function y(t){return p(this,void 0,void 0,(function(){return w(this,(function(e){switch(e.label){case 0:return null===t?[2,""]:[4,b.compress(t,15,(function(t){return String.fromCharCode(t+32)}))];case 1:return[2,e.sent()+" "]}}))}))}function m(t){return p(this,void 0,void 0,(function(){return w(this,(function(e){switch(e.label){case 0:return null===t?[2,""]:""===t?[2,null]:[4,h.decompress(t.length,16384,(function(e){return t.charCodeAt(e)-32}))];case 1:return[2,e.sent()]}}))}))}}]);void 0===LIB&&console.error("esm-webpack-plugin: nothing exported!");const _LIB$compressToUTF16=LIB.compressToUTF16,_LIB$decompressFromUTF16=LIB.decompressFromUTF16;export{_LIB$compressToUTF16 as compressToUTF16,_LIB$decompressFromUTF16 as decompressFromUTF16};
//# sourceMappingURL=async-lz-string.js.map