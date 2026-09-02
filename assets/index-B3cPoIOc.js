(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Kr="180",au=0,_c=1,ru=2,ih=1,sh=2,Fn=3,qn=0,je=1,xn=2,ii=0,ji=1,xc=2,Mc=3,yc=4,cu=5,xi=100,lu=101,hu=102,uu=103,du=104,fu=200,pu=201,mu=202,gu=203,Ha=204,Va=205,vu=206,_u=207,xu=208,Mu=209,yu=210,bu=211,Su=212,wu=213,Eu=214,Ga=0,qa=1,Wa=2,Ji=3,Xa=4,Ya=5,ja=6,Za=7,oh=0,Tu=1,Au=2,si=0,Cu=1,Pu=2,Ru=3,Iu=4,Lu=5,Du=6,Uu=7,ah=300,Ki=301,$i=302,Ja=303,Ka=304,Vo=306,$a=1e3,yi=1001,Qa=1002,We=1003,Nu=1004,Ys=1005,En=1006,Jo=1007,bi=1008,Pn=1009,rh=1010,ch=1011,Ts=1012,$r=1013,wi=1014,Bn=1015,zs=1016,Qr=1017,tc=1018,As=1020,lh=35902,hh=35899,uh=1021,dh=1022,bn=1023,Cs=1026,Ps=1027,ec=1028,nc=1029,fh=1030,ic=1031,sc=1033,Eo=33776,To=33777,Ao=33778,Co=33779,tr=35840,er=35841,nr=35842,ir=35843,sr=36196,or=37492,ar=37496,rr=37808,cr=37809,lr=37810,hr=37811,ur=37812,dr=37813,fr=37814,pr=37815,mr=37816,gr=37817,vr=37818,_r=37819,xr=37820,Mr=37821,yr=36492,br=36494,Sr=36495,wr=36283,Er=36284,Tr=36285,Ar=36286,Fu=3200,Ou=3201,ph=0,zu=1,ei="",en="srgb",Qi="srgb-linear",Uo="linear",ve="srgb",Pi=7680,bc=519,Bu=512,ku=513,Hu=514,mh=515,Vu=516,Gu=517,qu=518,Wu=519,Sc=35044,wc="300 es",Tn=2e3,No=2001;class ns{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}}const Ne=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ec=1234567;const ys=Math.PI/180,Rs=180/Math.PI;function Ai(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ne[n&255]+Ne[n>>8&255]+Ne[n>>16&255]+Ne[n>>24&255]+"-"+Ne[t&255]+Ne[t>>8&255]+"-"+Ne[t>>16&15|64]+Ne[t>>24&255]+"-"+Ne[e&63|128]+Ne[e>>8&255]+"-"+Ne[e>>16&255]+Ne[e>>24&255]+Ne[i&255]+Ne[i>>8&255]+Ne[i>>16&255]+Ne[i>>24&255]).toLowerCase()}function ee(n,t,e){return Math.max(t,Math.min(e,n))}function oc(n,t){return(n%t+t)%t}function Xu(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function Yu(n,t,e){return n!==t?(e-n)/(t-n):0}function bs(n,t,e){return(1-e)*n+e*t}function ju(n,t,e,i){return bs(n,t,1-Math.exp(-e*i))}function Zu(n,t=1){return t-Math.abs(oc(n,t*2)-t)}function Ju(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Ku(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function $u(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Qu(n,t){return n+Math.random()*(t-n)}function td(n){return n*(.5-Math.random())}function ed(n){n!==void 0&&(Ec=n);let t=Ec+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function nd(n){return n*ys}function id(n){return n*Rs}function sd(n){return(n&n-1)===0&&n!==0}function od(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ad(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function rd(n,t,e,i,s){const o=Math.cos,a=Math.sin,r=o(e/2),c=a(e/2),l=o((t+i)/2),h=a((t+i)/2),u=o((t-i)/2),d=a((t-i)/2),f=o((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(r*h,c*u,c*d,r*l);break;case"YZY":n.set(c*d,r*h,c*u,r*l);break;case"ZXZ":n.set(c*u,c*d,r*h,r*l);break;case"XZX":n.set(r*h,c*g,c*f,r*l);break;case"YXY":n.set(c*f,r*h,c*g,r*l);break;case"ZYZ":n.set(c*g,c*f,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Wi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Ve(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Le={DEG2RAD:ys,RAD2DEG:Rs,generateUUID:Ai,clamp:ee,euclideanModulo:oc,mapLinear:Xu,inverseLerp:Yu,lerp:bs,damp:ju,pingpong:Zu,smoothstep:Ju,smootherstep:Ku,randInt:$u,randFloat:Qu,randFloatSpread:td,seededRandom:ed,degToRad:nd,radToDeg:id,isPowerOfTwo:sd,ceilPowerOfTwo:od,floorPowerOfTwo:ad,setQuaternionFromProperEuler:rd,normalize:Ve,denormalize:Wi};class Tt{constructor(t=0,e=0){Tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ee(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ee(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*i-a*s+t.x,this.y=o*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class is{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,o,a,r){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const d=o[a+0],f=o[a+1],g=o[a+2],_=o[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==f||h!==g){let m=1-r;const p=c*d+l*f+h*g+u*_,w=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const P=Math.sqrt(x),E=Math.atan2(P,p*w);m=Math.sin(m*E)/P,r=Math.sin(r*E)/P}const v=r*w;if(c=c*m+d*v,l=l*m+f*v,h=h*m+g*v,u=u*m+_*v,m===1-r){const P=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=P,l*=P,h*=P,u*=P}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,o,a){const r=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=o[a],d=o[a+1],f=o[a+2],g=o[a+3];return t[e]=r*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-r*f,t[e+2]=l*g+h*f+r*d-c*u,t[e+3]=h*g-r*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(s/2),u=r(o/2),d=c(i/2),f=c(s/2),g=c(o/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],o=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(o-l)*f,this._z=(a-s)*f}else if(i>r&&i>u){const f=2*Math.sqrt(1+i-r-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(o+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-i-u);this._w=(o-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-i-r);this._w=(a-s)/f,this._x=(o+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ee(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,o=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*r+s*l-o*c,this._y=s*h+a*c+o*r-i*l,this._z=o*h+a*l+i*c-s*r,this._w=a*h-i*r-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,o=this._z,a=this._w;let r=a*t._w+i*t._x+s*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=s,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*i+e*this._x,this._y=f*s+e*this._y,this._z=f*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=o*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,i=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Tc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Tc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6]*s,this.y=o[1]*e+o[4]*i+o[7]*s,this.z=o[2]*e+o[5]*i+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=t.elements,a=1/(o[3]*e+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*i+o[8]*s+o[12])*a,this.y=(o[1]*e+o[5]*i+o[9]*s+o[13])*a,this.z=(o[2]*e+o[6]*i+o[10]*s+o[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*s-r*i),h=2*(r*e-o*s),u=2*(o*i-a*e);return this.x=e+c*l+a*u-r*h,this.y=i+c*h+r*l-o*u,this.z=s+c*u+o*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s,this.y=o[1]*e+o[5]*i+o[9]*s,this.z=o[2]*e+o[6]*i+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ee(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,o=t.z,a=e.x,r=e.y,c=e.z;return this.x=s*c-o*r,this.y=o*a-i*c,this.z=i*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Ko.copy(this).projectOnVector(t),this.sub(Ko)}reflect(t){return this.sub(Ko.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ee(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ko=new N,Tc=new is;class Kt{constructor(t,e,i,s,o,a,r,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l)}set(t,e,i,s,o,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=o,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],f=i[5],g=i[8],_=s[0],m=s[3],p=s[6],w=s[1],x=s[4],v=s[7],P=s[2],E=s[5],A=s[8];return o[0]=a*_+r*w+c*P,o[3]=a*m+r*x+c*E,o[6]=a*p+r*v+c*A,o[1]=l*_+h*w+u*P,o[4]=l*m+h*x+u*E,o[7]=l*p+h*v+u*A,o[2]=d*_+f*w+g*P,o[5]=d*m+f*x+g*E,o[8]=d*p+f*v+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-i*o*h+i*r*c+s*o*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,d=r*c-h*o,f=l*o-a*c,g=e*u+i*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*i)*_,t[2]=(r*i-s*a)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*o-r*e)*_,t[6]=f*_,t[7]=(i*c-l*e)*_,t[8]=(a*e-i*o)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,o,a,r){const c=Math.cos(o),l=Math.sin(o);return this.set(i*c,i*l,-i*(c*a+l*r)+a+t,-s*l,s*c,-s*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply($o.makeScale(t,e)),this}rotate(t){return this.premultiply($o.makeRotation(-t)),this}translate(t,e){return this.premultiply($o.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const $o=new Kt;function gh(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Fo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function cd(){const n=Fo("canvas");return n.style.display="block",n}const Ac={};function Is(n){n in Ac||(Ac[n]=!0,console.warn(n))}function ld(n,t,e){return new Promise(function(i,s){function o(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:i()}}setTimeout(o,e)})}const Cc=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pc=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function hd(){const n={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(s,o,a){return this.enabled===!1||o===a||!o||!a||(this.spaces[o].transfer===ve&&(s.r=Vn(s.r),s.g=Vn(s.g),s.b=Vn(s.b)),this.spaces[o].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[o].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=Zi(s.r),s.g=Zi(s.g),s.b=Zi(s.b))),s},workingToColorSpace:function(s,o){return this.convert(s,this.workingColorSpace,o)},colorSpaceToWorking:function(s,o){return this.convert(s,o,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ei?Uo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,o=this.workingColorSpace){return s.fromArray(this.spaces[o].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,o,a){return s.copy(this.spaces[o].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,o){return Is("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,o)},toWorkingColorSpace:function(s,o){return Is("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,o)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Qi]:{primaries:t,whitePoint:i,transfer:Uo,toXYZ:Cc,fromXYZ:Pc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:t,whitePoint:i,transfer:ve,toXYZ:Cc,fromXYZ:Pc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:en}}}),n}const de=hd();function Vn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Zi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ri;class ud{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ri===void 0&&(Ri=Fo("canvas")),Ri.width=t.width,Ri.height=t.height;const s=Ri.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Ri}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Fo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=Vn(o[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Vn(e[i]/255)*255):e[i]=Vn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let dd=0;class ac{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:dd++}),this.uuid=Ai(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(Qo(s[a].image)):o.push(Qo(s[a]))}else o=Qo(s);i.url=o}return e||(t.images[this.uuid]=i),i}}function Qo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ud.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let fd=0;const ta=new N;class ze extends ns{constructor(t=ze.DEFAULT_IMAGE,e=ze.DEFAULT_MAPPING,i=yi,s=yi,o=En,a=bi,r=bn,c=Pn,l=ze.DEFAULT_ANISOTROPY,h=ei){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:fd++}),this.uuid=Ai(),this.name="",this.source=new ac(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ta).x}get height(){return this.source.getSize(ta).y}get depth(){return this.source.getSize(ta).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ah)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $a:t.x=t.x-Math.floor(t.x);break;case yi:t.x=t.x<0?0:1;break;case Qa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $a:t.y=t.y-Math.floor(t.y);break;case yi:t.y=t.y<0?0:1;break;case Qa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ze.DEFAULT_IMAGE=null;ze.DEFAULT_MAPPING=ah;ze.DEFAULT_ANISOTROPY=1;class Ee{constructor(t=0,e=0,i=0,s=1){Ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*o,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*o,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*o,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,v=(f+1)/2,P=(p+1)/2,E=(h+d)/4,A=(u+_)/4,C=(g+m)/4;return x>v&&x>P?x<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(x),s=E/i,o=A/i):v>P?v<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(v),i=E/s,o=C/s):P<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(P),i=A/o,s=C/o),this.set(i,s,o,e),this}let w=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(w)<.001&&(w=1),this.x=(m-g)/w,this.y=(u-_)/w,this.z=(d-h)/w,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ee(this.x,t.x,e.x),this.y=ee(this.y,t.y,e.y),this.z=ee(this.z,t.z,e.z),this.w=ee(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ee(this.x,t,e),this.y=ee(this.y,t,e),this.z=ee(this.z,t,e),this.w=ee(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ee(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class pd extends ns{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ee(0,0,t,e),this.scissorTest=!1,this.viewport=new Ee(0,0,t,e);const s={width:t,height:e,depth:i.depth},o=new ze(s);this.textures=[];const a=i.count;for(let r=0;r<a;r++)this.textures[r]=o.clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:En,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new ac(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ei extends pd{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class vh extends ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class md extends ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=We,this.minFilter=We,this.wrapR=yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ss{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const o=i.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,un):un.fromBufferAttribute(o,a),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),js.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),js.copy(i.boundingBox)),js.applyMatrix4(t.matrixWorld),this.union(js)}const s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(us),Zs.subVectors(this.max,us),Ii.subVectors(t.a,us),Li.subVectors(t.b,us),Di.subVectors(t.c,us),Zn.subVectors(Li,Ii),Jn.subVectors(Di,Li),hi.subVectors(Ii,Di);let e=[0,-Zn.z,Zn.y,0,-Jn.z,Jn.y,0,-hi.z,hi.y,Zn.z,0,-Zn.x,Jn.z,0,-Jn.x,hi.z,0,-hi.x,-Zn.y,Zn.x,0,-Jn.y,Jn.x,0,-hi.y,hi.x,0];return!ea(e,Ii,Li,Di,Zs)||(e=[1,0,0,0,1,0,0,0,1],!ea(e,Ii,Li,Di,Zs))?!1:(Js.crossVectors(Zn,Jn),e=[Js.x,Js.y,Js.z],ea(e,Ii,Li,Di,Zs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(In[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),In[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),In[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),In[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),In[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),In[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),In[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),In[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(In),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const In=[new N,new N,new N,new N,new N,new N,new N,new N],un=new N,js=new ss,Ii=new N,Li=new N,Di=new N,Zn=new N,Jn=new N,hi=new N,us=new N,Zs=new N,Js=new N,ui=new N;function ea(n,t,e,i,s){for(let o=0,a=n.length-3;o<=a;o+=3){ui.fromArray(n,o);const r=s.x*Math.abs(ui.x)+s.y*Math.abs(ui.y)+s.z*Math.abs(ui.z),c=t.dot(ui),l=e.dot(ui),h=i.dot(ui);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const gd=new ss,ds=new N,na=new N;class Go{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):gd.setFromPoints(t).getCenter(i);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ds.subVectors(t,this.center);const e=ds.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ds,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(na.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ds.copy(t.center).add(na)),this.expandByPoint(ds.copy(t.center).sub(na))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Ln=new N,ia=new N,Ks=new N,Kn=new N,sa=new N,$s=new N,oa=new N;class _h{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ln)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Ln.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ln.copy(this.origin).addScaledVector(this.direction,e),Ln.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ia.copy(t).add(e).multiplyScalar(.5),Ks.copy(e).sub(t).normalize(),Kn.copy(this.origin).sub(ia);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Ks),r=Kn.dot(this.direction),c=-Kn.dot(Ks),l=Kn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-r,d=a*r-c,g=o*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*r)+d*(a*u+d+2*c)+l}else d=o,u=Math.max(0,-(a*d+r)),f=-u*u+d*(d+2*c)+l;else d=-o,u=Math.max(0,-(a*d+r)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*o+r)),d=u>0?-o:Math.min(Math.max(-o,-c),o),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-o,-c),o),f=d*(d+2*c)+l):(u=Math.max(0,-(a*o+r)),d=u>0?o:Math.min(Math.max(-o,-c),o),f=-u*u+d*(d+2*c)+l);else d=a>0?-o:o,u=Math.max(0,-(a*d+r)),f=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ia).addScaledVector(Ks,d),f}intersectSphere(t,e){Ln.subVectors(t.center,this.origin);const i=Ln.dot(this.direction),s=Ln.dot(Ln)-i*i,o=t.radius*t.radius;if(s>o)return null;const a=Math.sqrt(o-s),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,o,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(o=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(o=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||o>s||((o>i||isNaN(i))&&(i=o),(a<s||isNaN(s))&&(s=a),u>=0?(r=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Ln)!==null}intersectTriangle(t,e,i,s,o){sa.subVectors(e,t),$s.subVectors(i,t),oa.crossVectors(sa,$s);let a=this.direction.dot(oa),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;Kn.subVectors(this.origin,t);const c=r*this.direction.dot($s.crossVectors(Kn,$s));if(c<0)return null;const l=r*this.direction.dot(sa.cross(Kn));if(l<0||c+l>a)return null;const h=-r*Kn.dot(oa);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Se{constructor(t,e,i,s,o,a,r,c,l,h,u,d,f,g,_,m){Se.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l,h,u,d,f,g,_,m)}set(t,e,i,s,o,a,r,c,l,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=s,p[1]=o,p[5]=a,p[9]=r,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Se().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Ui.setFromMatrixColumn(t,0).length(),o=1/Ui.setFromMatrixColumn(t,1).length(),a=1/Ui.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*o,e[5]=i[5]*o,e[6]=i[6]*o,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,o=t.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const d=a*h,f=a*u,g=r*h,_=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-_*l,e[9]=-r*c,e[2]=_-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d+_*r,e[4]=g*r-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=f*r-g,e[6]=_+d*r,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d-_*r,e[4]=-a*u,e[8]=g+f*r,e[1]=f+g*r,e[5]=a*h,e[9]=_-d*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=r*h,_=r*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=f*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=r*c,_=r*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=r*c,_=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=r*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(vd,t,_d)}lookAt(t,e,i){const s=this.elements;return Je.subVectors(t,e),Je.lengthSq()===0&&(Je.z=1),Je.normalize(),$n.crossVectors(i,Je),$n.lengthSq()===0&&(Math.abs(i.z)===1?Je.x+=1e-4:Je.z+=1e-4,Je.normalize(),$n.crossVectors(i,Je)),$n.normalize(),Qs.crossVectors(Je,$n),s[0]=$n.x,s[4]=Qs.x,s[8]=Je.x,s[1]=$n.y,s[5]=Qs.y,s[9]=Je.y,s[2]=$n.z,s[6]=Qs.z,s[10]=Je.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],w=i[3],x=i[7],v=i[11],P=i[15],E=s[0],A=s[4],C=s[8],b=s[12],y=s[1],D=s[5],F=s[9],B=s[13],G=s[2],X=s[6],K=s[10],st=s[14],J=s[3],ot=s[7],Z=s[11],yt=s[15];return o[0]=a*E+r*y+c*G+l*J,o[4]=a*A+r*D+c*X+l*ot,o[8]=a*C+r*F+c*K+l*Z,o[12]=a*b+r*B+c*st+l*yt,o[1]=h*E+u*y+d*G+f*J,o[5]=h*A+u*D+d*X+f*ot,o[9]=h*C+u*F+d*K+f*Z,o[13]=h*b+u*B+d*st+f*yt,o[2]=g*E+_*y+m*G+p*J,o[6]=g*A+_*D+m*X+p*ot,o[10]=g*C+_*F+m*K+p*Z,o[14]=g*b+_*B+m*st+p*yt,o[3]=w*E+x*y+v*G+P*J,o[7]=w*A+x*D+v*X+P*ot,o[11]=w*C+x*F+v*K+P*Z,o[15]=w*b+x*B+v*st+P*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+o*c*u-s*l*u-o*r*d+i*l*d+s*r*f-i*c*f)+_*(+e*c*f-e*l*d+o*a*d-s*a*f+s*l*h-o*c*h)+m*(+e*l*u-e*r*f-o*a*u+i*a*f+o*r*h-i*l*h)+p*(-s*r*h-e*c*u+e*r*d+s*a*u-i*a*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],w=u*m*l-_*d*l+_*c*f-r*m*f-u*c*p+r*d*p,x=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,v=h*_*l-g*u*l+g*r*f-a*_*f-h*r*p+a*u*p,P=g*u*c-h*_*c-g*r*d+a*_*d+h*r*m-a*u*m,E=e*w+i*x+s*v+o*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=w*A,t[1]=(_*d*o-u*m*o-_*s*f+i*m*f+u*s*p-i*d*p)*A,t[2]=(r*m*o-_*c*o+_*s*l-i*m*l-r*s*p+i*c*p)*A,t[3]=(u*c*o-r*d*o-u*s*l+i*d*l+r*s*f-i*c*f)*A,t[4]=x*A,t[5]=(h*m*o-g*d*o+g*s*f-e*m*f-h*s*p+e*d*p)*A,t[6]=(g*c*o-a*m*o-g*s*l+e*m*l+a*s*p-e*c*p)*A,t[7]=(a*d*o-h*c*o+h*s*l-e*d*l-a*s*f+e*c*f)*A,t[8]=v*A,t[9]=(g*u*o-h*_*o-g*i*f+e*_*f+h*i*p-e*u*p)*A,t[10]=(a*_*o-g*r*o+g*i*l-e*_*l-a*i*p+e*r*p)*A,t[11]=(h*r*o-a*u*o-h*i*l+e*u*l+a*i*f-e*r*f)*A,t[12]=P*A,t[13]=(h*_*s-g*u*s+g*i*d-e*_*d-h*i*m+e*u*m)*A,t[14]=(g*r*s-a*_*s-g*i*c+e*_*c+a*i*m-e*r*m)*A,t[15]=(a*u*s-h*r*s+h*i*c-e*u*c-a*i*d+e*r*d)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,o=t.z;return e[0]*=i,e[4]*=s,e[8]*=o,e[1]*=i,e[5]*=s,e[9]*=o,e[2]*=i,e[6]*=s,e[10]*=o,e[3]*=i,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),o=1-i,a=t.x,r=t.y,c=t.z,l=o*a,h=o*r;return this.set(l*a+i,l*r-s*c,l*c+s*r,0,l*r+s*c,h*r+i,h*c-s*a,0,l*c-s*r,h*c+s*a,o*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,o,a){return this.set(1,i,o,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,o=e._x,a=e._y,r=e._z,c=e._w,l=o+o,h=a+a,u=r+r,d=o*l,f=o*h,g=o*u,_=a*h,m=a*u,p=r*u,w=c*l,x=c*h,v=c*u,P=i.x,E=i.y,A=i.z;return s[0]=(1-(_+p))*P,s[1]=(f+v)*P,s[2]=(g-x)*P,s[3]=0,s[4]=(f-v)*E,s[5]=(1-(d+p))*E,s[6]=(m+w)*E,s[7]=0,s[8]=(g+x)*A,s[9]=(m-w)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let o=Ui.set(s[0],s[1],s[2]).length();const a=Ui.set(s[4],s[5],s[6]).length(),r=Ui.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],dn.copy(this);const l=1/o,h=1/a,u=1/r;return dn.elements[0]*=l,dn.elements[1]*=l,dn.elements[2]*=l,dn.elements[4]*=h,dn.elements[5]*=h,dn.elements[6]*=h,dn.elements[8]*=u,dn.elements[9]*=u,dn.elements[10]*=u,e.setFromRotationMatrix(dn),i.x=o,i.y=a,i.z=r,this}makePerspective(t,e,i,s,o,a,r=Tn,c=!1){const l=this.elements,h=2*o/(e-t),u=2*o/(i-s),d=(e+t)/(e-t),f=(i+s)/(i-s);let g,_;if(c)g=o/(a-o),_=a*o/(a-o);else if(r===Tn)g=-(a+o)/(a-o),_=-2*a*o/(a-o);else if(r===No)g=-a/(a-o),_=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,o,a,r=Tn,c=!1){const l=this.elements,h=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),f=-(i+s)/(i-s);let g,_;if(c)g=1/(a-o),_=a/(a-o);else if(r===Tn)g=-2/(a-o),_=-(a+o)/(a-o);else if(r===No)g=-1/(a-o),_=-o/(a-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ui=new N,dn=new Se,vd=new N(0,0,0),_d=new N(1,1,1),$n=new N,Qs=new N,Je=new N,Rc=new Se,Ic=new is;class Wn{constructor(t=0,e=0,i=0,s=Wn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,o=s[0],a=s[4],r=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ee(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ee(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(ee(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-ee(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ee(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-ee(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Rc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Rc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ic.setFromEuler(this),this.setFromQuaternion(Ic,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Wn.DEFAULT_ORDER="XYZ";class xh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let xd=0;const Lc=new N,Ni=new is,Dn=new Se,to=new N,fs=new N,Md=new N,yd=new is,Dc=new N(1,0,0),Uc=new N(0,1,0),Nc=new N(0,0,1),Fc={type:"added"},bd={type:"removed"},Fi={type:"childadded",child:null},aa={type:"childremoved",child:null};class we extends ns{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xd++}),this.uuid=Ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=we.DEFAULT_UP.clone();const t=new N,e=new Wn,i=new is,s=new N(1,1,1);function o(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Se},normalMatrix:{value:new Kt}}),this.matrix=new Se,this.matrixWorld=new Se,this.matrixAutoUpdate=we.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ni.setFromAxisAngle(t,e),this.quaternion.multiply(Ni),this}rotateOnWorldAxis(t,e){return Ni.setFromAxisAngle(t,e),this.quaternion.premultiply(Ni),this}rotateX(t){return this.rotateOnAxis(Dc,t)}rotateY(t){return this.rotateOnAxis(Uc,t)}rotateZ(t){return this.rotateOnAxis(Nc,t)}translateOnAxis(t,e){return Lc.copy(t).applyQuaternion(this.quaternion),this.position.add(Lc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Dc,t)}translateY(t){return this.translateOnAxis(Uc,t)}translateZ(t){return this.translateOnAxis(Nc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?to.copy(t):to.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(fs,to,this.up):Dn.lookAt(to,fs,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Ni.setFromRotationMatrix(Dn),this.quaternion.premultiply(Ni.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Fc),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(bd),aa.child=t,this.dispatchEvent(aa),aa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Dn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Dn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Fc),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,t,Md),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,yd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(r=>({...r})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));s.material=r}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(o(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}we.DEFAULT_UP=new N(0,1,0);we.DEFAULT_MATRIX_AUTO_UPDATE=!0;we.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const fn=new N,Un=new N,ra=new N,Nn=new N,Oi=new N,zi=new N,Oc=new N,ca=new N,la=new N,ha=new N,ua=new Ee,da=new Ee,fa=new Ee;class Mn{constructor(t=new N,e=new N,i=new N){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),fn.subVectors(t,e),s.cross(fn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,i,s,o){fn.subVectors(s,e),Un.subVectors(i,e),ra.subVectors(t,e);const a=fn.dot(fn),r=fn.dot(Un),c=fn.dot(ra),l=Un.dot(Un),h=Un.dot(ra),u=a*l-r*r;if(u===0)return o.set(0,0,0),null;const d=1/u,f=(l*c-r*h)*d,g=(a*h-r*c)*d;return o.set(1-f-g,g,f)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Nn)===null?!1:Nn.x>=0&&Nn.y>=0&&Nn.x+Nn.y<=1}static getInterpolation(t,e,i,s,o,a,r,c){return this.getBarycoord(t,e,i,s,Nn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,Nn.x),c.addScaledVector(a,Nn.y),c.addScaledVector(r,Nn.z),c)}static getInterpolatedAttribute(t,e,i,s,o,a){return ua.setScalar(0),da.setScalar(0),fa.setScalar(0),ua.fromBufferAttribute(t,e),da.fromBufferAttribute(t,i),fa.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(ua,o.x),a.addScaledVector(da,o.y),a.addScaledVector(fa,o.z),a}static isFrontFacing(t,e,i,s){return fn.subVectors(i,e),Un.subVectors(t,e),fn.cross(Un).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return fn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),fn.cross(Un).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Mn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Mn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,o){return Mn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}containsPoint(t){return Mn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Mn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,o=this.c;let a,r;Oi.subVectors(s,i),zi.subVectors(o,i),ca.subVectors(t,i);const c=Oi.dot(ca),l=zi.dot(ca);if(c<=0&&l<=0)return e.copy(i);la.subVectors(t,s);const h=Oi.dot(la),u=zi.dot(la);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(Oi,a);ha.subVectors(t,o);const f=Oi.dot(ha),g=zi.dot(ha);if(g>=0&&f<=g)return e.copy(o);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(zi,r);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Oc.subVectors(o,s),r=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Oc,r);const p=1/(m+_+d);return a=_*p,r=d*p,e.copy(i).addScaledVector(Oi,a).addScaledVector(zi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Mh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Qn={h:0,s:0,l:0},eo={h:0,s:0,l:0};function pa(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class oe{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=i,de.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=de.workingColorSpace){if(t=oc(t,1),e=ee(e,0,1),i=ee(i,0,1),e===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+e):i+e-i*e,a=2*i-o;this.r=pa(a,o,t+1/3),this.g=pa(a,o,t),this.b=pa(a,o,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=en){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){const i=Mh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Vn(t.r),this.g=Vn(t.g),this.b=Vn(t.b),this}copyLinearToSRGB(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return de.workingToColorSpace(Fe.copy(this),t),Math.round(ee(Fe.r*255,0,255))*65536+Math.round(ee(Fe.g*255,0,255))*256+Math.round(ee(Fe.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(Fe.copy(this),e);const i=Fe.r,s=Fe.g,o=Fe.b,a=Math.max(i,s,o),r=Math.min(i,s,o);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case i:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-i)/u+2;break;case o:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=en){de.workingToColorSpace(Fe.copy(this),t);const e=Fe.r,i=Fe.g,s=Fe.b;return t!==en?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(Qn),this.setHSL(Qn.h+t,Qn.s+e,Qn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Qn),t.getHSL(eo);const i=bs(Qn.h,eo.h,e),s=bs(Qn.s,eo.s,e),o=bs(Qn.l,eo.l,e);return this.setHSL(i,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*i+o[6]*s,this.g=o[1]*e+o[4]*i+o[7]*s,this.b=o[2]*e+o[5]*i+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new oe;oe.NAMES=Mh;let Sd=0;class os extends ns{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Sd++}),this.uuid=Ai(),this.name="",this.type="Material",this.blending=ji,this.side=qn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ha,this.blendDst=Va,this.blendEquation=xi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new oe(0,0,0),this.blendAlpha=0,this.depthFunc=Ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=bc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Pi,this.stencilZFail=Pi,this.stencilZPass=Pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ji&&(i.blending=this.blending),this.side!==qn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ha&&(i.blendSrc=this.blendSrc),this.blendDst!==Va&&(i.blendDst=this.blendDst),this.blendEquation!==xi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ji&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==bc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Pi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Pi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Pi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(e){const o=s(t.textures),a=s(t.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=e[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class qo extends os{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Wn,this.combine=oh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Te=new N,no=new Tt;let wd=0;class Cn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:wd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Sc,this.updateRanges=[],this.gpuType=Bn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)no.fromBufferAttribute(this,e),no.applyMatrix3(t),this.setXY(e,no.x,no.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Wi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ve(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Wi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Wi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Wi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Wi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,o){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),i=Ve(i,this.array),s=Ve(s,this.array),o=Ve(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Sc&&(t.usage=this.usage),t}}class yh extends Cn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class bh extends Cn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class he extends Cn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Ed=0;const rn=new Se,ma=new we,Bi=new N,Ke=new ss,ps=new ss,Re=new N;class Ue extends ns{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ed++}),this.uuid=Ai(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(gh(t)?bh:yh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Kt().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return rn.makeRotationFromQuaternion(t),this.applyMatrix4(rn),this}rotateX(t){return rn.makeRotationX(t),this.applyMatrix4(rn),this}rotateY(t){return rn.makeRotationY(t),this.applyMatrix4(rn),this}rotateZ(t){return rn.makeRotationZ(t),this.applyMatrix4(rn),this}translate(t,e,i){return rn.makeTranslation(t,e,i),this.applyMatrix4(rn),this}scale(t,e,i){return rn.makeScale(t,e,i),this.applyMatrix4(rn),this}lookAt(t){return ma.lookAt(t),ma.updateMatrix(),this.applyMatrix4(ma.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Bi).negate(),this.translate(Bi.x,Bi.y,Bi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,o=t.length;s<o;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const o=t[s];e.setXYZ(s,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ss);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const o=e[i];Ke.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Go);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const i=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];ps.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(Ke.min,ps.min),Ke.expandByPoint(Re),Re.addVectors(Ke.max,ps.max),Ke.expandByPoint(Re)):(Ke.expandByPoint(ps.min),Ke.expandByPoint(ps.max))}Ke.getCenter(i);let s=0;for(let o=0,a=t.count;o<a;o++)Re.fromBufferAttribute(t,o),s=Math.max(s,i.distanceToSquared(Re));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)Re.fromBufferAttribute(r,l),c&&(Bi.fromBufferAttribute(t,l),Re.add(Bi)),s=Math.max(s,i.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Cn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),r=[],c=[];for(let C=0;C<i.count;C++)r[C]=new N,c[C]=new N;const l=new N,h=new N,u=new N,d=new Tt,f=new Tt,g=new Tt,_=new N,m=new N;function p(C,b,y){l.fromBufferAttribute(i,C),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,y),d.fromBufferAttribute(o,C),f.fromBufferAttribute(o,b),g.fromBufferAttribute(o,y),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(D),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),r[C].add(_),r[b].add(_),r[y].add(_),c[C].add(m),c[b].add(m),c[y].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let C=0,b=w.length;C<b;++C){const y=w[C],D=y.start,F=y.count;for(let B=D,G=D+F;B<G;B+=3)p(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const x=new N,v=new N,P=new N,E=new N;function A(C){P.fromBufferAttribute(s,C),E.copy(P);const b=r[C];x.copy(b),x.sub(P.multiplyScalar(P.dot(b))).normalize(),v.crossVectors(E,b);const D=v.dot(c[C])<0?-1:1;a.setXYZW(C,x.x,x.y,x.z,D)}for(let C=0,b=w.length;C<b;++C){const y=w[C],D=y.start,F=y.count;for(let B=D,G=D+F;B<G;B+=3)A(t.getX(B+0)),A(t.getX(B+1)),A(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Cn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);const s=new N,o=new N,a=new N,r=new N,c=new N,l=new N,h=new N,u=new N;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,_),l.fromBufferAttribute(i,m),r.add(h),c.add(h),l.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(_,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){r.isInterleavedBufferAttribute?f=c[_]*r.data.stride+r.offset:f=c[_]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new Cn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ue,i=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,i);e.setAttribute(r,l)}const o=this.morphAttributes;for(const r in o){const c=[],l=o[r];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const zc=new Se,di=new _h,io=new Go,Bc=new N,so=new N,oo=new N,ao=new N,ga=new N,ro=new N,kc=new N,co=new N;class M extends we{constructor(t=new Ue,e=new qo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(o&&r){ro.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=r[c],u=o[c];h!==0&&(ga.fromBufferAttribute(u,t),a?ro.addScaledVector(ga,h):ro.addScaledVector(ga.sub(e),h))}e.add(ro)}return e}raycast(t,e){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),io.copy(i.boundingSphere),io.applyMatrix4(o),di.copy(t.ray).recast(t.near),!(io.containsPoint(di.origin)===!1&&(di.intersectSphere(io,Bc)===null||di.origin.distanceToSquared(Bc)>(t.far-t.near)**2))&&(zc.copy(o).invert(),di.copy(t.ray).applyMatrix4(zc),!(i.boundingBox!==null&&di.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,di)))}_computeIntersections(t,e,i){let s;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,d=o.groups,f=o.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],w=Math.max(m.start,f.start),x=Math.min(r.count,Math.min(m.start+m.count,f.start+f.count));for(let v=w,P=x;v<P;v+=3){const E=r.getX(v),A=r.getX(v+1),C=r.getX(v+2);s=lo(this,p,t,i,l,h,u,E,A,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const w=r.getX(m),x=r.getX(m+1),v=r.getX(m+2);s=lo(this,a,t,i,l,h,u,w,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],w=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let v=w,P=x;v<P;v+=3){const E=v,A=v+1,C=v+2;s=lo(this,p,t,i,l,h,u,E,A,C),s&&(s.faceIndex=Math.floor(v/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const w=m,x=m+1,v=m+2;s=lo(this,a,t,i,l,h,u,w,x,v),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Td(n,t,e,i,s,o,a,r){let c;if(t.side===je?c=i.intersectTriangle(a,o,s,!0,r):c=i.intersectTriangle(s,o,a,t.side===qn,r),c===null)return null;co.copy(r),co.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(co);return l<e.near||l>e.far?null:{distance:l,point:co.clone(),object:n}}function lo(n,t,e,i,s,o,a,r,c,l){n.getVertexPosition(r,so),n.getVertexPosition(c,oo),n.getVertexPosition(l,ao);const h=Td(n,t,e,i,so,oo,ao,kc);if(h){const u=new N;Mn.getBarycoord(kc,so,oo,ao,u),s&&(h.uv=Mn.getInterpolatedAttribute(s,r,c,l,u,new Tt)),o&&(h.uv1=Mn.getInterpolatedAttribute(o,r,c,l,u,new Tt)),a&&(h.normal=Mn.getInterpolatedAttribute(a,r,c,l,u,new N),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:c,c:l,normal:new N,materialIndex:0};Mn.getNormal(so,oo,ao,d.normal),h.face=d,h.barycoord=u}return h}class V extends Ue{constructor(t=1,e=1,i=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:o,depthSegments:a};const r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,i,e,t,a,o,0),g("z","y","x",1,-1,i,e,-t,a,o,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,o,4),g("x","y","z",-1,-1,t,e,-i,s,o,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function g(_,m,p,w,x,v,P,E,A,C,b){const y=v/A,D=P/C,F=v/2,B=P/2,G=E/2,X=A+1,K=C+1;let st=0,J=0;const ot=new N;for(let Z=0;Z<K;Z++){const yt=Z*D-B;for(let Wt=0;Wt<X;Wt++){const Qt=Wt*y-F;ot[_]=Qt*w,ot[m]=yt*x,ot[p]=G,l.push(ot.x,ot.y,ot.z),ot[_]=0,ot[m]=0,ot[p]=E>0?1:-1,h.push(ot.x,ot.y,ot.z),u.push(Wt/A),u.push(1-Z/C),st+=1}}for(let Z=0;Z<C;Z++)for(let yt=0;yt<A;yt++){const Wt=d+yt+X*Z,Qt=d+yt+X*(Z+1),le=d+(yt+1)+X*(Z+1),ne=d+(yt+1)+X*Z;c.push(Wt,Qt,ne),c.push(Qt,le,ne),J+=6}r.addGroup(f,J,b),f+=J,d+=st}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new V(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ts(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function Ge(n){const t={};for(let e=0;e<n.length;e++){const i=ts(n[e]);for(const s in i)t[s]=i[s]}return t}function Ad(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Sh(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const Cd={clone:ts,merge:Ge};var Pd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Rd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class oi extends os{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Pd,this.fragmentShader=Rd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ts(t.uniforms),this.uniformsGroups=Ad(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class wh extends we{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Se,this.projectionMatrix=new Se,this.projectionMatrixInverse=new Se,this.coordinateSystem=Tn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ti=new N,Hc=new Tt,Vc=new Tt;class nn extends wh{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Rs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ys*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(ys*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ti.x,ti.y).multiplyScalar(-t/ti.z),ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ti.x,ti.y).multiplyScalar(-t/ti.z)}getViewSize(t,e){return this.getViewBounds(t,Hc,Vc),e.subVectors(Vc,Hc)}setViewOffset(t,e,i,s,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ys*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ki=-90,Hi=1;class Id extends we{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new nn(ki,Hi,t,e);s.layers=this.layers,this.add(s);const o=new nn(ki,Hi,t,e);o.layers=this.layers,this.add(o);const a=new nn(ki,Hi,t,e);a.layers=this.layers,this.add(a);const r=new nn(ki,Hi,t,e);r.layers=this.layers,this.add(r);const c=new nn(ki,Hi,t,e);c.layers=this.layers,this.add(c);const l=new nn(ki,Hi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,o,a,r,c]=e;for(const l of e)this.remove(l);if(t===Tn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===No)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,o),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=_,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Eh extends ze{constructor(t=[],e=Ki,i,s,o,a,r,c,l,h){super(t,e,i,s,o,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ld extends Ei{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Eh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new V(5,5,5),o=new oi({name:"CubemapFromEquirect",uniforms:ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:je,blending:ii});o.uniforms.tEquirect.value=e;const a=new M(s,o),r=e.minFilter;return e.minFilter===bi&&(e.minFilter=En),new Id(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(o)}}class at extends we{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Dd={type:"move"};class va{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,o=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,i),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,i),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Dd)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new at;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class rc{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new oe(t),this.near=e,this.far=i}clone(){return new rc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Th extends we{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Wn,this.environmentIntensity=1,this.environmentRotation=new Wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Ud extends ze{constructor(t=null,e=1,i=1,s,o,a,r,c,l=We,h=We,u,d){super(null,a,r,c,l,h,s,o,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const _a=new N,Nd=new N,Fd=new Kt;class vi{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=_a.subVectors(i,e).cross(Nd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(_a),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Fd.getNormalMatrix(t),s=this.coplanarPoint(_a).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fi=new Go,Od=new Tt(.5,.5),ho=new N;class cc{constructor(t=new vi,e=new vi,i=new vi,s=new vi,o=new vi,a=new vi){this.planes=[t,e,i,s,o,a]}set(t,e,i,s,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Tn,i=!1){const s=this.planes,o=t.elements,a=o[0],r=o[1],c=o[2],l=o[3],h=o[4],u=o[5],d=o[6],f=o[7],g=o[8],_=o[9],m=o[10],p=o[11],w=o[12],x=o[13],v=o[14],P=o[15];if(s[0].setComponents(l-a,f-h,p-g,P-w).normalize(),s[1].setComponents(l+a,f+h,p+g,P+w).normalize(),s[2].setComponents(l+r,f+u,p+_,P+x).normalize(),s[3].setComponents(l-r,f-u,p-_,P-x).normalize(),i)s[4].setComponents(c,d,m,v).normalize(),s[5].setComponents(l-c,f-d,p-m,P-v).normalize();else if(s[4].setComponents(l-c,f-d,p-m,P-v).normalize(),e===Tn)s[5].setComponents(l+c,f+d,p+m,P+v).normalize();else if(e===No)s[5].setComponents(c,d,m,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),fi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),fi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(fi)}intersectsSprite(t){fi.center.set(0,0,0);const e=Od.distanceTo(t.center);return fi.radius=.7071067811865476+e,fi.applyMatrix4(t.matrixWorld),this.intersectsSphere(fi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(ho.x=s.normal.x>0?t.max.x:t.min.x,ho.y=s.normal.y>0?t.max.y:t.min.y,ho.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ho)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ah extends os{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Oo=new N,zo=new N,Gc=new Se,ms=new _h,uo=new Go,xa=new N,qc=new N;class zd extends we{constructor(t=new Ue,e=new Ah){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,o=e.count;s<o;s++)Oo.fromBufferAttribute(e,s-1),zo.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Oo.distanceTo(zo);t.setAttribute("lineDistance",new he(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),uo.copy(i.boundingSphere),uo.applyMatrix4(s),uo.radius+=o,t.ray.intersectsSphere(uo)===!1)return;Gc.copy(s).invert(),ms.copy(t.ray).applyMatrix4(Gc);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=h.getX(_),w=h.getX(_+1),x=fo(this,t,ms,c,p,w,_);x&&e.push(x)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=fo(this,t,ms,c,_,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=fo(this,t,ms,c,_,_+1,_);p&&e.push(p)}if(this.isLineLoop){const _=fo(this,t,ms,c,g-1,f,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function fo(n,t,e,i,s,o,a){const r=n.geometry.attributes.position;if(Oo.fromBufferAttribute(r,s),zo.fromBufferAttribute(r,o),e.distanceSqToSegment(Oo,zo,xa,qc)>i)return;xa.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(xa);if(!(l<t.near||l>t.far))return{distance:l,point:qc.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Wc=new N,Xc=new N;class Yc extends zd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,o=e.count;s<o;s+=2)Wc.fromBufferAttribute(e,s),Xc.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Wc.distanceTo(Xc);t.setAttribute("lineDistance",new he(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Bd extends ze{constructor(t,e,i,s,o,a,r,c,l){super(t,e,i,s,o,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ch extends ze{constructor(t,e,i=wi,s,o,a,r=We,c=We,l,h=Cs,u=1){if(h!==Cs&&h!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,o,a,r,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ac(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ph extends ze{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class kn extends Ue{constructor(t=1,e=1,i=4,s=8,o=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:o},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),o=Math.max(1,Math.floor(o));const a=[],r=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=i*2+o,_=s+1,m=new N,p=new N;for(let w=0;w<=g;w++){let x=0,v=0,P=0,E=0;if(w<=i){const b=w/i,y=b*Math.PI/2;v=-h-t*Math.cos(y),P=t*Math.sin(y),E=-t*Math.cos(y),x=b*u}else if(w<=i+o){const b=(w-i)/o;v=-h+b*e,P=t,E=0,x=u+b*d}else{const b=(w-i-o)/i,y=b*Math.PI/2;v=h+t*Math.sin(y),P=t*Math.cos(y),E=t*Math.sin(y),x=u+d+b*u}const A=Math.max(0,Math.min(1,x/f));let C=0;w===0?C=.5/s:w===g&&(C=-.5/s);for(let b=0;b<=s;b++){const y=b/s,D=y*Math.PI*2,F=Math.sin(D),B=Math.cos(D);p.x=-P*B,p.y=v,p.z=P*F,r.push(p.x,p.y,p.z),m.set(-P*B,E,P*F),m.normalize(),c.push(m.x,m.y,m.z),l.push(y+C,A)}if(w>0){const b=(w-1)*_;for(let y=0;y<s;y++){const D=b+y,F=b+y+1,B=w*_+y,G=w*_+y+1;a.push(D,F,B),a.push(F,G,B)}}}this.setIndex(a),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new kn(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Ls extends Ue{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const o=[],a=[],r=[],c=[],l=new N,h=new Tt;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=i+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)o.push(u,u+1,0);this.setIndex(o),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(r,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ls(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class it extends Ue{constructor(t=1,e=1,i=1,s=32,o=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:o,openEnded:a,thetaStart:r,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=i/2;let p=0;w(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function w(){const v=new N,P=new N;let E=0;const A=(e-t)/i;for(let C=0;C<=o;C++){const b=[],y=C/o,D=y*(e-t)+t;for(let F=0;F<=s;F++){const B=F/s,G=B*c+r,X=Math.sin(G),K=Math.cos(G);P.x=D*X,P.y=-y*i+m,P.z=D*K,u.push(P.x,P.y,P.z),v.set(X,A,K).normalize(),d.push(v.x,v.y,v.z),f.push(B,1-y),b.push(g++)}_.push(b)}for(let C=0;C<s;C++)for(let b=0;b<o;b++){const y=_[b][C],D=_[b+1][C],F=_[b+1][C+1],B=_[b][C+1];(t>0||b!==0)&&(h.push(y,D,B),E+=3),(e>0||b!==o-1)&&(h.push(D,F,B),E+=3)}l.addGroup(p,E,0),p+=E}function x(v){const P=g,E=new Tt,A=new N;let C=0;const b=v===!0?t:e,y=v===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*y,0),d.push(0,y,0),f.push(.5,.5),g++;const D=g;for(let F=0;F<=s;F++){const G=F/s*c+r,X=Math.cos(G),K=Math.sin(G);A.x=b*K,A.y=m*y,A.z=b*X,u.push(A.x,A.y,A.z),d.push(0,y,0),E.x=X*.5+.5,E.y=K*.5*y+.5,f.push(E.x,E.y),g++}for(let F=0;F<s;F++){const B=P+F,G=D+F;v===!0?h.push(G,G+1,B):h.push(G+1,G,B),C+=3}l.addGroup(p,C,v===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new it(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xe extends it{constructor(t=1,e=1,i=32,s=1,o=!1,a=0,r=Math.PI*2){super(0,t,e,i,s,o,a,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:r}}static fromJSON(t){return new Xe(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Wo extends Ue{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const o=[],a=[];r(s),l(i),h(),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(o.slice(),3)),this.setAttribute("uv",new he(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(w){const x=new N,v=new N,P=new N;for(let E=0;E<e.length;E+=3)f(e[E+0],x),f(e[E+1],v),f(e[E+2],P),c(x,v,P,w)}function c(w,x,v,P){const E=P+1,A=[];for(let C=0;C<=E;C++){A[C]=[];const b=w.clone().lerp(v,C/E),y=x.clone().lerp(v,C/E),D=E-C;for(let F=0;F<=D;F++)F===0&&C===E?A[C][F]=b:A[C][F]=b.clone().lerp(y,F/D)}for(let C=0;C<E;C++)for(let b=0;b<2*(E-C)-1;b++){const y=Math.floor(b/2);b%2===0?(d(A[C][y+1]),d(A[C+1][y]),d(A[C][y])):(d(A[C][y+1]),d(A[C+1][y+1]),d(A[C+1][y]))}}function l(w){const x=new N;for(let v=0;v<o.length;v+=3)x.x=o[v+0],x.y=o[v+1],x.z=o[v+2],x.normalize().multiplyScalar(w),o[v+0]=x.x,o[v+1]=x.y,o[v+2]=x.z}function h(){const w=new N;for(let x=0;x<o.length;x+=3){w.x=o[x+0],w.y=o[x+1],w.z=o[x+2];const v=m(w)/2/Math.PI+.5,P=p(w)/Math.PI+.5;a.push(v,1-P)}g(),u()}function u(){for(let w=0;w<a.length;w+=6){const x=a[w+0],v=a[w+2],P=a[w+4],E=Math.max(x,v,P),A=Math.min(x,v,P);E>.9&&A<.1&&(x<.2&&(a[w+0]+=1),v<.2&&(a[w+2]+=1),P<.2&&(a[w+4]+=1))}}function d(w){o.push(w.x,w.y,w.z)}function f(w,x){const v=w*3;x.x=t[v+0],x.y=t[v+1],x.z=t[v+2]}function g(){const w=new N,x=new N,v=new N,P=new N,E=new Tt,A=new Tt,C=new Tt;for(let b=0,y=0;b<o.length;b+=9,y+=6){w.set(o[b+0],o[b+1],o[b+2]),x.set(o[b+3],o[b+4],o[b+5]),v.set(o[b+6],o[b+7],o[b+8]),E.set(a[y+0],a[y+1]),A.set(a[y+2],a[y+3]),C.set(a[y+4],a[y+5]),P.copy(w).add(x).add(v).divideScalar(3);const D=m(P);_(E,y+0,w,D),_(A,y+2,x,D),_(C,y+4,v,D)}}function _(w,x,v,P){P<0&&w.x===1&&(a[x]=w.x-1),v.x===0&&v.z===0&&(a[x]=P/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function p(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wo(t.vertices,t.indices,t.radius,t.details)}}class lc extends Wo{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=1/i,o=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(o,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new lc(t.radius,t.detail)}}class Rn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),o+=i.distanceTo(s),e.push(o),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const o=i.length;let a;e?a=e:a=t*i[o-1];let r=0,c=o-1,l;for(;r<=c;)if(s=Math.floor(r+(c-r)/2),l=i[s]-a,l<0)r=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(o-1);const h=i[s],d=i[s+1]-h,f=(a-h)/d;return(s+f)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const a=this.getPoint(s),r=this.getPoint(o),c=e||(a.isVector2?new Tt:new N);return c.copy(r).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new N,s=[],o=[],a=[],r=new N,c=new Se;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new N)}o[0]=new N,a[0]=new N;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),o[0].crossVectors(s[0],r),a[0].crossVectors(s[0],o[0]);for(let f=1;f<=t;f++){if(o[f]=o[f-1].clone(),a[f]=a[f-1].clone(),r.crossVectors(s[f-1],s[f]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(ee(s[f-1].dot(s[f]),-1,1));o[f].applyMatrix4(c.makeRotationAxis(r,g))}a[f].crossVectors(s[f],o[f])}if(e===!0){let f=Math.acos(ee(o[0].dot(o[t]),-1,1));f/=t,s[0].dot(r.crossVectors(o[0],o[t]))>0&&(f=-f);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class hc extends Rn{constructor(t=0,e=0,i=1,s=1,o=0,a=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Tt){const i=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(a?o=0:o=s),this.aClockwise===!0&&!a&&(o===s?o=-s:o=o-s);const r=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class kd extends hc{constructor(t,e,i,s,o,a){super(t,e,i,i,s,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function uc(){let n=0,t=0,e=0,i=0;function s(o,a,r,c){n=o,t=r,e=-3*o+3*a-2*r-c,i=2*o-2*a+r+c}return{initCatmullRom:function(o,a,r,c,l){s(a,r,l*(r-o),l*(c-a))},initNonuniformCatmullRom:function(o,a,r,c,l,h,u){let d=(a-o)/l-(r-o)/(l+h)+(r-a)/h,f=(r-a)/h-(c-a)/(h+u)+(c-r)/u;d*=h,f*=h,s(a,r,d,f)},calc:function(o){const a=o*o,r=a*o;return n+t*o+e*a+i*r}}}const po=new N,Ma=new uc,ya=new uc,ba=new uc;class Hd extends Rn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new N){const i=e,s=this.points,o=s.length,a=(o-(this.closed?0:1))*t;let r=Math.floor(a),c=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/o)+1)*o:c===0&&r===o-1&&(r=o-2,c=1);let l,h;this.closed||r>0?l=s[(r-1)%o]:(po.subVectors(s[0],s[1]).add(s[0]),l=po);const u=s[r%o],d=s[(r+1)%o];if(this.closed||r+2<o?h=s[(r+2)%o]:(po.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=po),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),Ma.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),ya.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),ba.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(Ma.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),ya.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),ba.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(Ma.calc(c),ya.calc(c),ba.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new N().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function jc(n,t,e,i,s){const o=(i-t)*.5,a=(s-e)*.5,r=n*n,c=n*r;return(2*e-2*i+o+a)*c+(-3*e+3*i-2*o-a)*r+o*n+e}function Vd(n,t){const e=1-n;return e*e*t}function Gd(n,t){return 2*(1-n)*n*t}function qd(n,t){return n*n*t}function Ss(n,t,e,i){return Vd(n,t)+Gd(n,e)+qd(n,i)}function Wd(n,t){const e=1-n;return e*e*e*t}function Xd(n,t){const e=1-n;return 3*e*e*n*t}function Yd(n,t){return 3*(1-n)*n*n*t}function jd(n,t){return n*n*n*t}function ws(n,t,e,i,s){return Wd(n,t)+Xd(n,e)+Yd(n,i)+jd(n,s)}class Rh extends Rn{constructor(t=new Tt,e=new Tt,i=new Tt,s=new Tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Tt){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(ws(t,s.x,o.x,a.x,r.x),ws(t,s.y,o.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Zd extends Rn{constructor(t=new N,e=new N,i=new N,s=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new N){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(ws(t,s.x,o.x,a.x,r.x),ws(t,s.y,o.y,a.y,r.y),ws(t,s.z,o.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ih extends Rn{constructor(t=new Tt,e=new Tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Tt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Jd extends Rn{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Lh extends Rn{constructor(t=new Tt,e=new Tt,i=new Tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Tt){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(Ss(t,s.x,o.x,a.x),Ss(t,s.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Kd extends Rn{constructor(t=new N,e=new N,i=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new N){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(Ss(t,s.x,o.x,a.x),Ss(t,s.y,o.y,a.y),Ss(t,s.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dh extends Rn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Tt){const i=e,s=this.points,o=(s.length-1)*t,a=Math.floor(o),r=o-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(jc(r,c.x,l.x,h.x,u.x),jc(r,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Tt().fromArray(s))}return this}}var Cr=Object.freeze({__proto__:null,ArcCurve:kd,CatmullRomCurve3:Hd,CubicBezierCurve:Rh,CubicBezierCurve3:Zd,EllipseCurve:hc,LineCurve:Ih,LineCurve3:Jd,QuadraticBezierCurve:Lh,QuadraticBezierCurve3:Kd,SplineCurve:Dh});class $d extends Rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Cr[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=i){const a=s[o]-i,r=this.curves[o],c=r.getLength(),l=c===0?0:1-a/c;return r.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,o=this.curves;s<o.length;s++){const a=o[s],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new Cr[s.type]().fromJSON(s))}return this}}class Pr extends $d{constructor(t){super(),this.type="Path",this.currentPoint=new Tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Ih(this.currentPoint.clone(),new Tt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const o=new Lh(this.currentPoint.clone(),new Tt(t,e),new Tt(i,s));return this.curves.push(o),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,o,a){const r=new Rh(this.currentPoint.clone(),new Tt(t,e),new Tt(i,s),new Tt(o,a));return this.curves.push(r),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Dh(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,o,a){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,s,o,a),this}absarc(t,e,i,s,o,a){return this.absellipse(t,e,i,i,s,o,a),this}ellipse(t,e,i,s,o,a,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,o,a,r,c),this}absellipse(t,e,i,s,o,a,r,c){const l=new hc(t,e,i,s,o,a,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Xo extends Pr{constructor(t){super(t),this.uuid=Ai(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Pr().fromJSON(s))}return this}}function Qd(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let o=Uh(n,0,s,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,c,l;if(i&&(o=of(n,t,o,e)),n.length>80*e){r=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const f=n[d],g=n[d+1];f<r&&(r=f),g<c&&(c=g),f>h&&(h=f),g>u&&(u=g)}l=Math.max(h-r,u-c),l=l!==0?32767/l:0}return Ds(o,a,e,r,c,l,0),a}function Uh(n,t,e,i,s){let o;if(s===gf(n,t,e,i)>0)for(let a=t;a<e;a+=i)o=Zc(a/i|0,n[a],n[a+1],o);else for(let a=e-i;a>=t;a-=i)o=Zc(a/i|0,n[a],n[a+1],o);return o&&es(o,o.next)&&(Ns(o),o=o.next),o}function Ti(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(es(e,e.next)||be(e.prev,e,e.next)===0)){if(Ns(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ds(n,t,e,i,s,o,a){if(!n)return;!a&&o&&hf(n,i,s,o);let r=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(o?ef(n,i,s,o):tf(n)){t.push(c.i,n.i,l.i),Ns(n),n=l.next,r=l.next;continue}if(n=l,n===r){a?a===1?(n=nf(Ti(n),t),Ds(n,t,e,i,s,o,2)):a===2&&sf(n,t,e,i,s,o):Ds(Ti(n),t,e,i,s,o,1);break}}}function tf(n){const t=n.prev,e=n,i=n.next;if(be(t,e,i)>=0)return!1;const s=t.x,o=e.x,a=i.x,r=t.y,c=e.y,l=i.y,h=Math.min(s,o,a),u=Math.min(r,c,l),d=Math.max(s,o,a),f=Math.max(r,c,l);let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&xs(s,r,o,c,a,l,g.x,g.y)&&be(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function ef(n,t,e,i){const s=n.prev,o=n,a=n.next;if(be(s,o,a)>=0)return!1;const r=s.x,c=o.x,l=a.x,h=s.y,u=o.y,d=a.y,f=Math.min(r,c,l),g=Math.min(h,u,d),_=Math.max(r,c,l),m=Math.max(h,u,d),p=Rr(f,g,t,e,i),w=Rr(_,m,t,e,i);let x=n.prevZ,v=n.nextZ;for(;x&&x.z>=p&&v&&v.z<=w;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&xs(r,h,c,u,l,d,x.x,x.y)&&be(x.prev,x,x.next)>=0||(x=x.prevZ,v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==a&&xs(r,h,c,u,l,d,v.x,v.y)&&be(v.prev,v,v.next)>=0))return!1;v=v.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&xs(r,h,c,u,l,d,x.x,x.y)&&be(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;v&&v.z<=w;){if(v.x>=f&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==a&&xs(r,h,c,u,l,d,v.x,v.y)&&be(v.prev,v,v.next)>=0)return!1;v=v.nextZ}return!0}function nf(n,t){let e=n;do{const i=e.prev,s=e.next.next;!es(i,s)&&Fh(i,e,e.next,s)&&Us(i,s)&&Us(s,i)&&(t.push(i.i,e.i,s.i),Ns(e),Ns(e.next),e=n=s),e=e.next}while(e!==n);return Ti(e)}function sf(n,t,e,i,s,o){let a=n;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&ff(a,r)){let c=Oh(a,r);a=Ti(a,a.next),c=Ti(c,c.next),Ds(a,t,e,i,s,o,0),Ds(c,t,e,i,s,o,0);return}r=r.next}a=a.next}while(a!==n)}function of(n,t,e,i){const s=[];for(let o=0,a=t.length;o<a;o++){const r=t[o]*i,c=o<a-1?t[o+1]*i:n.length,l=Uh(n,r,c,i,!1);l===l.next&&(l.steiner=!0),s.push(df(l))}s.sort(af);for(let o=0;o<s.length;o++)e=rf(s[o],e);return e}function af(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function rf(n,t){const e=cf(n,t);if(!e)return t;const i=Oh(e,n);return Ti(i,i.next),Ti(e,e.next)}function cf(n,t){let e=t;const i=n.x,s=n.y;let o=-1/0,a;if(es(n,e))return e;do{if(es(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>o&&(o=u,a=e.x<e.next.x?e:e.next,u===i))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&Nh(s<l?i:o,s,c,l,s<l?o:i,s,e.x,e.y)){const u=Math.abs(s-e.y)/(i-e.x);Us(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&lf(a,e)))&&(a=e,h=u)}e=e.next}while(e!==r);return a}function lf(n,t){return be(n.prev,n,t.prev)<0&&be(t.next,n,n.next)<0}function hf(n,t,e,i){let s=n;do s.z===0&&(s.z=Rr(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,uf(s)}function uf(n){let t,e=1;do{let i=n,s;n=null;let o=null;for(t=0;i;){t++;let a=i,r=0;for(let l=0;l<e&&(r++,a=a.nextZ,!!a);l++);let c=e;for(;r>0||c>0&&a;)r!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,r--):(s=a,a=a.nextZ,c--),o?o.nextZ=s:n=s,s.prevZ=o,o=s;i=a}o.nextZ=null,e*=2}while(t>1);return n}function Rr(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function df(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Nh(n,t,e,i,s,o,a,r){return(s-a)*(t-r)>=(n-a)*(o-r)&&(n-a)*(i-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(s-a)*(i-r)}function xs(n,t,e,i,s,o,a,r){return!(n===a&&t===r)&&Nh(n,t,e,i,s,o,a,r)}function ff(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!pf(n,t)&&(Us(n,t)&&Us(t,n)&&mf(n,t)&&(be(n.prev,n,t.prev)||be(n,t.prev,t))||es(n,t)&&be(n.prev,n,n.next)>0&&be(t.prev,t,t.next)>0)}function be(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function es(n,t){return n.x===t.x&&n.y===t.y}function Fh(n,t,e,i){const s=go(be(n,t,e)),o=go(be(n,t,i)),a=go(be(e,i,n)),r=go(be(e,i,t));return!!(s!==o&&a!==r||s===0&&mo(n,e,t)||o===0&&mo(n,i,t)||a===0&&mo(e,n,i)||r===0&&mo(e,t,i))}function mo(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function go(n){return n>0?1:n<0?-1:0}function pf(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Fh(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Us(n,t){return be(n.prev,n,n.next)<0?be(n,t,n.next)>=0&&be(n,n.prev,t)>=0:be(n,t,n.prev)<0||be(n,n.next,t)<0}function mf(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,o=(n.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Oh(n,t){const e=Ir(n.i,n.x,n.y),i=Ir(t.i,t.x,t.y),s=n.next,o=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,o.next=i,i.prev=o,i}function Zc(n,t,e,i){const s=Ir(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ns(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ir(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function gf(n,t,e,i){let s=0;for(let o=t,a=e-i;o<e;o+=i)s+=(n[a]-n[o])*(n[o+1]+n[a+1]),a=o;return s}class vf{static triangulate(t,e,i=2){return Qd(t,e,i)}}class Hn{static area(t){const e=t.length;let i=0;for(let s=e-1,o=0;o<e;s=o++)i+=t[s].x*t[o].y-t[o].x*t[s].y;return i*.5}static isClockWise(t){return Hn.area(t)<0}static triangulateShape(t,e){const i=[],s=[],o=[];Jc(t),Kc(i,t);let a=t.length;e.forEach(Jc);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Kc(i,e[c]);const r=vf.triangulate(i,s);for(let c=0;c<r.length;c+=3)o.push(r.slice(c,c+3));return o}}function Jc(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Kc(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class dc extends Ue{constructor(t=new Xo([new Tt(.5,.5),new Tt(-.5,.5),new Tt(-.5,-.5),new Tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],o=[];for(let r=0,c=t.length;r<c;r++){const l=t[r];a(l)}this.setAttribute("position",new he(s,3)),this.setAttribute("uv",new he(o,2)),this.computeVertexNormals();function a(r){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,w=e.UVGenerator!==void 0?e.UVGenerator:_f;let x,v=!1,P,E,A,C;p&&(x=p.getSpacedPoints(h),v=!0,d=!1,P=p.computeFrenetFrames(h,!1),E=new N,A=new N,C=new N),d||(m=0,f=0,g=0,_=0);const b=r.extractPoints(l);let y=b.shape;const D=b.holes;if(!Hn.isClockWise(y)){y=y.reverse();for(let ft=0,ht=D.length;ft<ht;ft++){const ct=D[ft];Hn.isClockWise(ct)&&(D[ft]=ct.reverse())}}function B(ft){const ct=10000000000000001e-36;let j=ft[0];for(let bt=1;bt<=ft.length;bt++){const vt=bt%ft.length,wt=ft[vt],Xt=wt.x-j.x,Zt=wt.y-j.y,U=Xt*Xt+Zt*Zt,T=Math.max(Math.abs(wt.x),Math.abs(wt.y),Math.abs(j.x),Math.abs(j.y)),W=ct*T*T;if(U<=W){ft.splice(vt,1),bt--;continue}j=wt}}B(y),D.forEach(B);const G=D.length,X=y;for(let ft=0;ft<G;ft++){const ht=D[ft];y=y.concat(ht)}function K(ft,ht,ct){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),ft.clone().addScaledVector(ht,ct)}const st=y.length;function J(ft,ht,ct){let j,bt,vt;const wt=ft.x-ht.x,Xt=ft.y-ht.y,Zt=ct.x-ft.x,U=ct.y-ft.y,T=wt*wt+Xt*Xt,W=wt*U-Xt*Zt;if(Math.abs(W)>Number.EPSILON){const Q=Math.sqrt(T),ut=Math.sqrt(Zt*Zt+U*U),nt=ht.x-Xt/Q,Ft=ht.y+wt/Q,St=ct.x-U/ut,Ot=ct.y+Zt/ut,zt=((St-nt)*U-(Ot-Ft)*Zt)/(wt*U-Xt*Zt);j=nt+wt*zt-ft.x,bt=Ft+Xt*zt-ft.y;const xt=j*j+bt*bt;if(xt<=2)return new Tt(j,bt);vt=Math.sqrt(xt/2)}else{let Q=!1;wt>Number.EPSILON?Zt>Number.EPSILON&&(Q=!0):wt<-Number.EPSILON?Zt<-Number.EPSILON&&(Q=!0):Math.sign(Xt)===Math.sign(U)&&(Q=!0),Q?(j=-Xt,bt=wt,vt=Math.sqrt(T)):(j=wt,bt=Xt,vt=Math.sqrt(T/2))}return new Tt(j/vt,bt/vt)}const ot=[];for(let ft=0,ht=X.length,ct=ht-1,j=ft+1;ft<ht;ft++,ct++,j++)ct===ht&&(ct=0),j===ht&&(j=0),ot[ft]=J(X[ft],X[ct],X[j]);const Z=[];let yt,Wt=ot.concat();for(let ft=0,ht=G;ft<ht;ft++){const ct=D[ft];yt=[];for(let j=0,bt=ct.length,vt=bt-1,wt=j+1;j<bt;j++,vt++,wt++)vt===bt&&(vt=0),wt===bt&&(wt=0),yt[j]=J(ct[j],ct[vt],ct[wt]);Z.push(yt),Wt=Wt.concat(yt)}let Qt;if(m===0)Qt=Hn.triangulateShape(X,D);else{const ft=[],ht=[];for(let ct=0;ct<m;ct++){const j=ct/m,bt=f*Math.cos(j*Math.PI/2),vt=g*Math.sin(j*Math.PI/2)+_;for(let wt=0,Xt=X.length;wt<Xt;wt++){const Zt=K(X[wt],ot[wt],vt);Vt(Zt.x,Zt.y,-bt),j===0&&ft.push(Zt)}for(let wt=0,Xt=G;wt<Xt;wt++){const Zt=D[wt];yt=Z[wt];const U=[];for(let T=0,W=Zt.length;T<W;T++){const Q=K(Zt[T],yt[T],vt);Vt(Q.x,Q.y,-bt),j===0&&U.push(Q)}j===0&&ht.push(U)}}Qt=Hn.triangulateShape(ft,ht)}const le=Qt.length,ne=g+_;for(let ft=0;ft<st;ft++){const ht=d?K(y[ft],Wt[ft],ne):y[ft];v?(A.copy(P.normals[0]).multiplyScalar(ht.x),E.copy(P.binormals[0]).multiplyScalar(ht.y),C.copy(x[0]).add(A).add(E),Vt(C.x,C.y,C.z)):Vt(ht.x,ht.y,0)}for(let ft=1;ft<=h;ft++)for(let ht=0;ht<st;ht++){const ct=d?K(y[ht],Wt[ht],ne):y[ht];v?(A.copy(P.normals[ft]).multiplyScalar(ct.x),E.copy(P.binormals[ft]).multiplyScalar(ct.y),C.copy(x[ft]).add(A).add(E),Vt(C.x,C.y,C.z)):Vt(ct.x,ct.y,u/h*ft)}for(let ft=m-1;ft>=0;ft--){const ht=ft/m,ct=f*Math.cos(ht*Math.PI/2),j=g*Math.sin(ht*Math.PI/2)+_;for(let bt=0,vt=X.length;bt<vt;bt++){const wt=K(X[bt],ot[bt],j);Vt(wt.x,wt.y,u+ct)}for(let bt=0,vt=D.length;bt<vt;bt++){const wt=D[bt];yt=Z[bt];for(let Xt=0,Zt=wt.length;Xt<Zt;Xt++){const U=K(wt[Xt],yt[Xt],j);v?Vt(U.x,U.y+x[h-1].y,x[h-1].x+ct):Vt(U.x,U.y,u+ct)}}}rt(),dt();function rt(){const ft=s.length/3;if(d){let ht=0,ct=st*ht;for(let j=0;j<le;j++){const bt=Qt[j];Nt(bt[2]+ct,bt[1]+ct,bt[0]+ct)}ht=h+m*2,ct=st*ht;for(let j=0;j<le;j++){const bt=Qt[j];Nt(bt[0]+ct,bt[1]+ct,bt[2]+ct)}}else{for(let ht=0;ht<le;ht++){const ct=Qt[ht];Nt(ct[2],ct[1],ct[0])}for(let ht=0;ht<le;ht++){const ct=Qt[ht];Nt(ct[0]+st*h,ct[1]+st*h,ct[2]+st*h)}}i.addGroup(ft,s.length/3-ft,0)}function dt(){const ft=s.length/3;let ht=0;Rt(X,ht),ht+=X.length;for(let ct=0,j=D.length;ct<j;ct++){const bt=D[ct];Rt(bt,ht),ht+=bt.length}i.addGroup(ft,s.length/3-ft,1)}function Rt(ft,ht){let ct=ft.length;for(;--ct>=0;){const j=ct;let bt=ct-1;bt<0&&(bt=ft.length-1);for(let vt=0,wt=h+m*2;vt<wt;vt++){const Xt=st*vt,Zt=st*(vt+1),U=ht+j+Xt,T=ht+bt+Xt,W=ht+bt+Zt,Q=ht+j+Zt;te(U,T,W,Q)}}}function Vt(ft,ht,ct){c.push(ft),c.push(ht),c.push(ct)}function Nt(ft,ht,ct){me(ft),me(ht),me(ct);const j=s.length/3,bt=w.generateTopUV(i,s,j-3,j-2,j-1);O(bt[0]),O(bt[1]),O(bt[2])}function te(ft,ht,ct,j){me(ft),me(ht),me(j),me(ht),me(ct),me(j);const bt=s.length/3,vt=w.generateSideWallUV(i,s,bt-6,bt-3,bt-2,bt-1);O(vt[0]),O(vt[1]),O(vt[3]),O(vt[1]),O(vt[2]),O(vt[3])}function me(ft){s.push(c[ft*3+0]),s.push(c[ft*3+1]),s.push(c[ft*3+2])}function O(ft){o.push(ft.x),o.push(ft.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return xf(e,i,t)}static fromJSON(t,e){const i=[];for(let o=0,a=t.shapes.length;o<a;o++){const r=e[t.shapes[o]];i.push(r)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Cr[s.type]().fromJSON(s)),new dc(i,t.options)}}const _f={generateTopUV:function(n,t,e,i,s){const o=t[e*3],a=t[e*3+1],r=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new Tt(o,a),new Tt(r,c),new Tt(l,h)]},generateSideWallUV:function(n,t,e,i,s,o){const a=t[e*3],r=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],_=t[o*3],m=t[o*3+1],p=t[o*3+2];return Math.abs(r-h)<Math.abs(a-l)?[new Tt(a,1-c),new Tt(l,1-u),new Tt(d,1-g),new Tt(_,1-p)]:[new Tt(r,1-c),new Tt(h,1-u),new Tt(f,1-g),new Tt(m,1-p)]}};function xf(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const o=n[i];e.shapes.push(o.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Bs extends Wo{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Bs(t.radius,t.detail)}}class De extends Ue{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const o=t/2,a=e/2,r=Math.floor(i),c=Math.floor(s),l=r+1,h=c+1,u=t/r,d=e/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const w=p*d-a;for(let x=0;x<l;x++){const v=x*u-o;g.push(v,-w,0),_.push(0,0,1),m.push(x/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let w=0;w<r;w++){const x=w+l*p,v=w+l*(p+1),P=w+1+l*(p+1),E=w+1+l*p;f.push(x,v,E),f.push(v,P,E)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new De(t.width,t.height,t.widthSegments,t.heightSegments)}}class fc extends Ue{constructor(t=new Xo([new Tt(0,.5),new Tt(-.5,-.5),new Tt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],o=[],a=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new he(s,3)),this.setAttribute("normal",new he(o,3)),this.setAttribute("uv",new he(a,2));function l(h){const u=s.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;Hn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const w=g[m];Hn.isClockWise(w)===!0&&(g[m]=w.reverse())}const _=Hn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const w=g[m];f=f.concat(w)}for(let m=0,p=f.length;m<p;m++){const w=f[m];s.push(w.x,w.y,0),o.push(0,0,1),a.push(w.x,w.y)}for(let m=0,p=_.length;m<p;m++){const w=_[m],x=w[0]+u,v=w[1]+u,P=w[2]+u;i.push(x,v,P),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Mf(e,t)}static fromJSON(t,e){const i=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];i.push(a)}return new fc(i,t.curveSegments)}}function Mf(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class Bt extends Ue{constructor(t=1,e=32,i=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+r,Math.PI);let l=0;const h=[],u=new N,d=new N,f=[],g=[],_=[],m=[];for(let p=0;p<=i;p++){const w=[],x=p/i;let v=0;p===0&&a===0?v=.5/e:p===i&&c===Math.PI&&(v=-.5/e);for(let P=0;P<=e;P++){const E=P/e;u.x=-t*Math.cos(s+E*o)*Math.sin(a+x*r),u.y=t*Math.cos(a+x*r),u.z=t*Math.sin(s+E*o)*Math.sin(a+x*r),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(E+v,1-x),w.push(l++)}h.push(w)}for(let p=0;p<i;p++)for(let w=0;w<e;w++){const x=h[p][w+1],v=h[p][w],P=h[p+1][w],E=h[p+1][w+1];(p!==0||a>0)&&f.push(x,v,E),(p!==i-1||c<Math.PI)&&f.push(v,P,E)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Bt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class _e extends Ue{constructor(t=1,e=.4,i=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:o},i=Math.floor(i),s=Math.floor(s);const a=[],r=[],c=[],l=[],h=new N,u=new N,d=new N;for(let f=0;f<=i;f++)for(let g=0;g<=s;g++){const _=g/s*o,m=f/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),r.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,w=(s+1)*f+g;a.push(_,m,w),a.push(m,p,w)}this.setIndex(a),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class zh extends os{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new oe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ph,this.normalScale=new Tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class yf extends os{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Fu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class bf extends os{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Bh extends we{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new oe(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class kh extends Bh{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.groundColor=new oe(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Sa=new Se,$c=new N,Qc=new N;class Sf{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Tt(512,512),this.mapType=Pn,this.map=null,this.mapPass=null,this.matrix=new Se,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cc,this._frameExtents=new Tt(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;$c.setFromMatrixPosition(t.matrixWorld),e.position.copy($c),Qc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Qc),e.updateMatrixWorld(),Sa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Sa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class pc extends wh{constructor(t=-1,e=1,i=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-t,a=i+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class wf extends Sf{constructor(){super(new pc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Lr extends Bh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(we.DEFAULT_UP),this.updateMatrix(),this.target=new we,this.shadow=new wf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Ef extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Tf{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function tl(n,t,e,i){const s=Af(i);switch(e){case uh:return n*t;case ec:return n*t/s.components*s.byteLength;case nc:return n*t/s.components*s.byteLength;case fh:return n*t*2/s.components*s.byteLength;case ic:return n*t*2/s.components*s.byteLength;case dh:return n*t*3/s.components*s.byteLength;case bn:return n*t*4/s.components*s.byteLength;case sc:return n*t*4/s.components*s.byteLength;case Eo:case To:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ao:case Co:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case er:case ir:return Math.max(n,16)*Math.max(t,8)/4;case tr:case nr:return Math.max(n,8)*Math.max(t,8)/2;case sr:case or:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ar:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case rr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case cr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case lr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case hr:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case ur:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case dr:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case fr:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case pr:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case mr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case gr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case vr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case _r:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case xr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Mr:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case yr:case br:case Sr:return Math.ceil(n/4)*Math.ceil(t/4)*16;case wr:case Er:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Tr:case Ar:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Af(n){switch(n){case Pn:case rh:return{byteLength:1,components:1};case Ts:case ch:case zs:return{byteLength:2,components:1};case Qr:case tc:return{byteLength:2,components:4};case wi:case $r:case Bn:return{byteLength:4,components:1};case lh:case hh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Kr}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Kr);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Hh(){let n=null,t=!1,e=null,i=null;function s(o,a){e(o,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){n=o}}}function Cf(n){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];n.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function o(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function a(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:s,remove:o,update:a}}var Pf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,If=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Lf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Df=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Uf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Nf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ff=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Of=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,zf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Bf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,kf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Vf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Gf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,qf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Xf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Yf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,jf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Zf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Kf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,$f=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Qf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,tp=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,ep=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,np=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ip=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,op="gl_FragColor = linearToOutputTexel( gl_FragColor );",ap=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,cp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,lp=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,hp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,up=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,dp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,pp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,mp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gp=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,vp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,_p=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Mp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,yp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Sp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ep=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Tp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ap=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Cp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Pp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Rp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ip=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Lp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Up=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Np=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Fp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Op=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,zp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Bp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,kp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Vp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Gp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,qp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Wp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Yp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,jp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Jp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Kp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,$p=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Qp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,t0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,e0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,n0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,i0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,s0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,o0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,a0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,r0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,c0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,l0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,h0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,u0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,d0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,f0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,p0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,m0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,g0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,v0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,_0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,x0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,M0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,y0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,b0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,S0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,w0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,E0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,T0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,A0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const C0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,P0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,R0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,I0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,L0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,U0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,N0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,F0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,O0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,z0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,B0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,H0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,V0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,G0=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,q0=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,W0=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,X0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Y0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,j0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Z0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,J0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,K0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Q0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,em=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,nm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,im=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sm=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,om=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,am=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:Pf,alphahash_pars_fragment:Rf,alphamap_fragment:If,alphamap_pars_fragment:Lf,alphatest_fragment:Df,alphatest_pars_fragment:Uf,aomap_fragment:Nf,aomap_pars_fragment:Ff,batching_pars_vertex:Of,batching_vertex:zf,begin_vertex:Bf,beginnormal_vertex:kf,bsdfs:Hf,iridescence_fragment:Vf,bumpmap_pars_fragment:Gf,clipping_planes_fragment:qf,clipping_planes_pars_fragment:Wf,clipping_planes_pars_vertex:Xf,clipping_planes_vertex:Yf,color_fragment:jf,color_pars_fragment:Zf,color_pars_vertex:Jf,color_vertex:Kf,common:$f,cube_uv_reflection_fragment:Qf,defaultnormal_vertex:tp,displacementmap_pars_vertex:ep,displacementmap_vertex:np,emissivemap_fragment:ip,emissivemap_pars_fragment:sp,colorspace_fragment:op,colorspace_pars_fragment:ap,envmap_fragment:rp,envmap_common_pars_fragment:cp,envmap_pars_fragment:lp,envmap_pars_vertex:hp,envmap_physical_pars_fragment:yp,envmap_vertex:up,fog_vertex:dp,fog_pars_vertex:fp,fog_fragment:pp,fog_pars_fragment:mp,gradientmap_pars_fragment:gp,lightmap_pars_fragment:vp,lights_lambert_fragment:_p,lights_lambert_pars_fragment:xp,lights_pars_begin:Mp,lights_toon_fragment:bp,lights_toon_pars_fragment:Sp,lights_phong_fragment:wp,lights_phong_pars_fragment:Ep,lights_physical_fragment:Tp,lights_physical_pars_fragment:Ap,lights_fragment_begin:Cp,lights_fragment_maps:Pp,lights_fragment_end:Rp,logdepthbuf_fragment:Ip,logdepthbuf_pars_fragment:Lp,logdepthbuf_pars_vertex:Dp,logdepthbuf_vertex:Up,map_fragment:Np,map_pars_fragment:Fp,map_particle_fragment:Op,map_particle_pars_fragment:zp,metalnessmap_fragment:Bp,metalnessmap_pars_fragment:kp,morphinstance_vertex:Hp,morphcolor_vertex:Vp,morphnormal_vertex:Gp,morphtarget_pars_vertex:qp,morphtarget_vertex:Wp,normal_fragment_begin:Xp,normal_fragment_maps:Yp,normal_pars_fragment:jp,normal_pars_vertex:Zp,normal_vertex:Jp,normalmap_pars_fragment:Kp,clearcoat_normal_fragment_begin:$p,clearcoat_normal_fragment_maps:Qp,clearcoat_pars_fragment:t0,iridescence_pars_fragment:e0,opaque_fragment:n0,packing:i0,premultiplied_alpha_fragment:s0,project_vertex:o0,dithering_fragment:a0,dithering_pars_fragment:r0,roughnessmap_fragment:c0,roughnessmap_pars_fragment:l0,shadowmap_pars_fragment:h0,shadowmap_pars_vertex:u0,shadowmap_vertex:d0,shadowmask_pars_fragment:f0,skinbase_vertex:p0,skinning_pars_vertex:m0,skinning_vertex:g0,skinnormal_vertex:v0,specularmap_fragment:_0,specularmap_pars_fragment:x0,tonemapping_fragment:M0,tonemapping_pars_fragment:y0,transmission_fragment:b0,transmission_pars_fragment:S0,uv_pars_fragment:w0,uv_pars_vertex:E0,uv_vertex:T0,worldpos_vertex:A0,background_vert:C0,background_frag:P0,backgroundCube_vert:R0,backgroundCube_frag:I0,cube_vert:L0,cube_frag:D0,depth_vert:U0,depth_frag:N0,distanceRGBA_vert:F0,distanceRGBA_frag:O0,equirect_vert:z0,equirect_frag:B0,linedashed_vert:k0,linedashed_frag:H0,meshbasic_vert:V0,meshbasic_frag:G0,meshlambert_vert:q0,meshlambert_frag:W0,meshmatcap_vert:X0,meshmatcap_frag:Y0,meshnormal_vert:j0,meshnormal_frag:Z0,meshphong_vert:J0,meshphong_frag:K0,meshphysical_vert:$0,meshphysical_frag:Q0,meshtoon_vert:tm,meshtoon_frag:em,points_vert:nm,points_frag:im,shadow_vert:sm,shadow_frag:om,sprite_vert:am,sprite_frag:rm},Pt={common:{diffuse:{value:new oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new oe(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},wn={basic:{uniforms:Ge([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:Ge([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new oe(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:Ge([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new oe(0)},specular:{value:new oe(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:Ge([Pt.common,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.roughnessmap,Pt.metalnessmap,Pt.fog,Pt.lights,{emissive:{value:new oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:Ge([Pt.common,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.gradientmap,Pt.fog,Pt.lights,{emissive:{value:new oe(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:Ge([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:Ge([Pt.points,Pt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:Ge([Pt.common,Pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:Ge([Pt.common,Pt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:Ge([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:Ge([Pt.sprite,Pt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:Ge([Pt.common,Pt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:Ge([Pt.lights,Pt.fog,{color:{value:new oe(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};wn.physical={uniforms:Ge([wn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new oe(0)},specularColor:{value:new oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const vo={r:0,b:0,g:0},pi=new Wn,cm=new Se;function lm(n,t,e,i,s,o,a){const r=new oe(0);let c=o===!0?0:1,l,h,u=null,d=0,f=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function _(x){let v=!1;const P=g(x);P===null?p(r,c):P&&P.isColor&&(p(P,1),v=!0);const E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,v){const P=g(v);P&&(P.isCubeTexture||P.mapping===Vo)?(h===void 0&&(h=new M(new V(1,1,1),new oi({name:"BackgroundCubeMaterial",uniforms:ts(wn.backgroundCube.uniforms),vertexShader:wn.backgroundCube.vertexShader,fragmentShader:wn.backgroundCube.fragmentShader,side:je,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),pi.copy(v.backgroundRotation),pi.x*=-1,pi.y*=-1,pi.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(pi.y*=-1,pi.z*=-1),h.material.uniforms.envMap.value=P,h.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(cm.makeRotationFromEuler(pi)),h.material.toneMapped=de.getTransfer(P.colorSpace)!==ve,(u!==P||d!==P.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,u=P,d=P.version,f=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):P&&P.isTexture&&(l===void 0&&(l=new M(new De(2,2),new oi({name:"BackgroundMaterial",uniforms:ts(wn.background.uniforms),vertexShader:wn.background.vertexShader,fragmentShader:wn.background.fragmentShader,side:qn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=P,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=de.getTransfer(P.colorSpace)!==ve,P.matrixAutoUpdate===!0&&P.updateMatrix(),l.material.uniforms.uvTransform.value.copy(P.matrix),(u!==P||d!==P.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,u=P,d=P.version,f=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,v){x.getRGB(vo,Sh(n)),i.buffers.color.setClear(vo.r,vo.g,vo.b,v,a)}function w(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(x,v=1){r.set(x),c=v,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(r,c)},render:_,addToRenderList:m,dispose:w}}function hm(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let o=s,a=!1;function r(y,D,F,B,G){let X=!1;const K=u(B,F,D);o!==K&&(o=K,l(o.object)),X=f(y,B,F,G),X&&g(y,B,F,G),G!==null&&t.update(G,n.ELEMENT_ARRAY_BUFFER),(X||a)&&(a=!1,v(y,D,F,B),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(G).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function h(y){return n.deleteVertexArray(y)}function u(y,D,F){const B=F.wireframe===!0;let G=i[y.id];G===void 0&&(G={},i[y.id]=G);let X=G[D.id];X===void 0&&(X={},G[D.id]=X);let K=X[B];return K===void 0&&(K=d(c()),X[B]=K),K}function d(y){const D=[],F=[],B=[];for(let G=0;G<e;G++)D[G]=0,F[G]=0,B[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:B,object:y,attributes:{},index:null}}function f(y,D,F,B){const G=o.attributes,X=D.attributes;let K=0;const st=F.getAttributes();for(const J in st)if(st[J].location>=0){const Z=G[J];let yt=X[J];if(yt===void 0&&(J==="instanceMatrix"&&y.instanceMatrix&&(yt=y.instanceMatrix),J==="instanceColor"&&y.instanceColor&&(yt=y.instanceColor)),Z===void 0||Z.attribute!==yt||yt&&Z.data!==yt.data)return!0;K++}return o.attributesNum!==K||o.index!==B}function g(y,D,F,B){const G={},X=D.attributes;let K=0;const st=F.getAttributes();for(const J in st)if(st[J].location>=0){let Z=X[J];Z===void 0&&(J==="instanceMatrix"&&y.instanceMatrix&&(Z=y.instanceMatrix),J==="instanceColor"&&y.instanceColor&&(Z=y.instanceColor));const yt={};yt.attribute=Z,Z&&Z.data&&(yt.data=Z.data),G[J]=yt,K++}o.attributes=G,o.attributesNum=K,o.index=B}function _(){const y=o.newAttributes;for(let D=0,F=y.length;D<F;D++)y[D]=0}function m(y){p(y,0)}function p(y,D){const F=o.newAttributes,B=o.enabledAttributes,G=o.attributeDivisors;F[y]=1,B[y]===0&&(n.enableVertexAttribArray(y),B[y]=1),G[y]!==D&&(n.vertexAttribDivisor(y,D),G[y]=D)}function w(){const y=o.newAttributes,D=o.enabledAttributes;for(let F=0,B=D.length;F<B;F++)D[F]!==y[F]&&(n.disableVertexAttribArray(F),D[F]=0)}function x(y,D,F,B,G,X,K){K===!0?n.vertexAttribIPointer(y,D,F,G,X):n.vertexAttribPointer(y,D,F,B,G,X)}function v(y,D,F,B){_();const G=B.attributes,X=F.getAttributes(),K=D.defaultAttributeValues;for(const st in X){const J=X[st];if(J.location>=0){let ot=G[st];if(ot===void 0&&(st==="instanceMatrix"&&y.instanceMatrix&&(ot=y.instanceMatrix),st==="instanceColor"&&y.instanceColor&&(ot=y.instanceColor)),ot!==void 0){const Z=ot.normalized,yt=ot.itemSize,Wt=t.get(ot);if(Wt===void 0)continue;const Qt=Wt.buffer,le=Wt.type,ne=Wt.bytesPerElement,rt=le===n.INT||le===n.UNSIGNED_INT||ot.gpuType===$r;if(ot.isInterleavedBufferAttribute){const dt=ot.data,Rt=dt.stride,Vt=ot.offset;if(dt.isInstancedInterleavedBuffer){for(let Nt=0;Nt<J.locationSize;Nt++)p(J.location+Nt,dt.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let Nt=0;Nt<J.locationSize;Nt++)m(J.location+Nt);n.bindBuffer(n.ARRAY_BUFFER,Qt);for(let Nt=0;Nt<J.locationSize;Nt++)x(J.location+Nt,yt/J.locationSize,le,Z,Rt*ne,(Vt+yt/J.locationSize*Nt)*ne,rt)}else{if(ot.isInstancedBufferAttribute){for(let dt=0;dt<J.locationSize;dt++)p(J.location+dt,ot.meshPerAttribute);y.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ot.meshPerAttribute*ot.count)}else for(let dt=0;dt<J.locationSize;dt++)m(J.location+dt);n.bindBuffer(n.ARRAY_BUFFER,Qt);for(let dt=0;dt<J.locationSize;dt++)x(J.location+dt,yt/J.locationSize,le,Z,yt*ne,yt/J.locationSize*dt*ne,rt)}}else if(K!==void 0){const Z=K[st];if(Z!==void 0)switch(Z.length){case 2:n.vertexAttrib2fv(J.location,Z);break;case 3:n.vertexAttrib3fv(J.location,Z);break;case 4:n.vertexAttrib4fv(J.location,Z);break;default:n.vertexAttrib1fv(J.location,Z)}}}}w()}function P(){C();for(const y in i){const D=i[y];for(const F in D){const B=D[F];for(const G in B)h(B[G].object),delete B[G];delete D[F]}delete i[y]}}function E(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const F in D){const B=D[F];for(const G in B)h(B[G].object),delete B[G];delete D[F]}delete i[y.id]}function A(y){for(const D in i){const F=i[D];if(F[y.id]===void 0)continue;const B=F[y.id];for(const G in B)h(B[G].object),delete B[G];delete F[y.id]}}function C(){b(),a=!0,o!==s&&(o=s,l(o.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:C,resetDefaultState:b,dispose:P,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:w}}function um(n,t,e){let i;function s(l){i=l}function o(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function r(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,i,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,i,1)}}this.setMode=s,this.render=o,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function dm(n,t,e,i){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==bn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(A){const C=A===zs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Pn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Bn&&!C)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),w=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),v=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:w,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:P,maxSamples:E}}function fm(n){const t=this;let e=null,i=0,s=!1,o=!1;const a=new vi,r=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||i!==0||s;return s=d,i=u.length,f},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=n.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const w=o?0:i,x=w*4;let v=p.clippingState||null;c.value=v,v=h(g,d,x,f);for(let P=0;P!==x;++P)v[P]=e[P];p.clippingState=v,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=w}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,w=d.matrixWorldInverse;r.getNormalMatrix(w),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,v=f;x!==_;++x,v+=4)a.copy(u[x]).applyMatrix4(w,r),a.normal.toArray(m,v),m[v+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function pm(n){let t=new WeakMap;function e(a,r){return r===Ja?a.mapping=Ki:r===Ka&&(a.mapping=$i),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===Ja||r===Ka)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Ld(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}const Xi=4,el=[.125,.215,.35,.446,.526,.582],Mi=20,wa=new pc,nl=new oe;let Ea=null,Ta=0,Aa=0,Ca=!1;const _i=(1+Math.sqrt(5))/2,Vi=1/_i,il=[new N(-_i,Vi,0),new N(_i,Vi,0),new N(-Vi,0,_i),new N(Vi,0,_i),new N(0,_i,-Vi),new N(0,_i,Vi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],mm=new N;class sl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,o={}){const{size:a=256,position:r=mm}=o;Ea=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),Aa=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,r),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=rl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ea,Ta,Aa),this._renderer.xr.enabled=Ca,t.scissorTest=!1,_o(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ki||t.mapping===$i?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ea=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),Aa=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:En,minFilter:En,generateMipmaps:!1,type:zs,format:bn,colorSpace:Qi,depthBuffer:!1},s=ol(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ol(t,e,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=gm(o)),this._blurMaterial=vm(o,t,e)}return s}_compileMaterial(t){const e=new M(this._lodPlanes[0],t);this._renderer.compile(e,wa)}_sceneToCubeUV(t,e,i,s,o){const c=new nn(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(nl),u.toneMapping=si,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const _=new qo({name:"PMREM.Background",side:je,depthWrite:!1,depthTest:!1}),m=new M(new V,_);let p=!1;const w=t.background;w?w.isColor&&(_.color.copy(w),t.background=null,p=!0):(_.color.copy(nl),p=!0);for(let x=0;x<6;x++){const v=x%3;v===0?(c.up.set(0,l[x],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x+h[x],o.y,o.z)):v===1?(c.up.set(0,0,l[x]),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y+h[x],o.z)):(c.up.set(0,l[x],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y,o.z+h[x]));const P=this._cubeSize;_o(s,v*P,x>2?P:0,P,P),u.setRenderTarget(s),p&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=w}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===Ki||t.mapping===$i;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=rl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=al());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new M(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const c=this._cubeSize;_o(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,wa)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),r=il[(s-o-1)%il.length];this._blur(t,o-1,o,a,r)}e.autoClear=i}_blur(t,e,i,s,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",o),this._halfBlur(a,t,i,i,s,"longitudinal",o)}_halfBlur(t,e,i,s,o,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new M(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(o)?Math.PI/(2*f):2*Math.PI/(2*Mi-1),_=o/g,m=isFinite(o)?1+Math.floor(h*_):Mi;m>Mi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Mi}`);const p=[];let w=0;for(let A=0;A<Mi;++A){const C=A/_,b=Math.exp(-C*C/2);p.push(b),A===0?w+=b:A<m&&(w+=2*b)}for(let A=0;A<p.length;A++)p[A]=p[A]/w;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const v=this._sizeLods[s],P=3*v*(s>x-Xi?s-x+Xi:0),E=4*(this._cubeSize-v);_o(e,P,E,3*v,2*v),c.setRenderTarget(e),c.render(u,wa)}}function gm(n){const t=[],e=[],i=[];let s=n;const o=n-Xi+1+el.length;for(let a=0;a<o;a++){const r=Math.pow(2,s);e.push(r);let c=1/r;a>n-Xi?c=el[a-n+Xi-1]:a===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,w=new Float32Array(_*g*f),x=new Float32Array(m*g*f),v=new Float32Array(p*g*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,C=E>2?0:-1,b=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];w.set(b,_*g*E),x.set(d,m*g*E);const y=[E,E,E,E,E,E];v.set(y,p*g*E)}const P=new Ue;P.setAttribute("position",new Cn(w,_)),P.setAttribute("uv",new Cn(x,m)),P.setAttribute("faceIndex",new Cn(v,p)),t.push(P),s>Xi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function ol(n,t,e){const i=new Ei(n,t,e);return i.texture.mapping=Vo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _o(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function vm(n,t,e){const i=new Float32Array(Mi),s=new N(0,1,0);return new oi({name:"SphericalGaussianBlur",defines:{n:Mi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function al(){return new oi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function rl(){return new oi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:mc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ii,depthTest:!1,depthWrite:!1})}function mc(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function _m(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===Ja||c===Ka,h=c===Ki||c===$i;if(l||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new sl(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new sl(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",o),u.texture):null}}}return r}function s(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function o(r){const c=r.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function xm(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Is("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Mm(n,t,e,i){const s={},o=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const f=o.get(d);f&&(t.remove(f),o.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],n.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const w=f.array;_=f.version;for(let x=0,v=w.length;x<v;x+=3){const P=w[x+0],E=w[x+1],A=w[x+2];d.push(P,E,E,A,A,P)}}else if(g!==void 0){const w=g.array;_=g.version;for(let x=0,v=w.length/3-1;x<v;x+=3){const P=x+0,E=x+1,A=x+2;d.push(P,E,E,A,A,P)}}else return;const m=new(gh(d)?bh:yh)(d,1);m.version=_;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const d=o.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return o.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function ym(n,t,e){let i;function s(d){i=d}let o,a;function r(d){o=d.type,a=d.bytesPerElement}function c(d,f){n.drawElements(i,f,o,d*a),e.update(f,i,1)}function l(d,f,g){g!==0&&(n.drawElementsInstanced(i,f,o,d*a,g),e.update(f,i,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,o,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,i,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,o,d,0,_,0,g);let p=0;for(let w=0;w<g;w++)p+=f[w]*_[w];e.update(p,i,1)}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function bm(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,r){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=r*(o/3);break;case n.LINES:e.lines+=r*(o/2);break;case n.LINE_STRIP:e.lines+=r*(o-1);break;case n.LINE_LOOP:e.lines+=r*o;break;case n.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Sm(n,t,e){const i=new WeakMap,s=new Ee;function o(a,r,c){const l=a.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let y=function(){C.dispose(),i.delete(r),r.removeEventListener("dispose",y)};var f=y;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],w=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let v=0;g===!0&&(v=1),_===!0&&(v=2),m===!0&&(v=3);let P=r.attributes.position.count*v,E=1;P>t.maxTextureSize&&(E=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const A=new Float32Array(P*E*4*u),C=new vh(A,P,E,u);C.type=Bn,C.needsUpdate=!0;const b=v*4;for(let D=0;D<u;D++){const F=p[D],B=w[D],G=x[D],X=P*E*4*D;for(let K=0;K<F.count;K++){const st=K*b;g===!0&&(s.fromBufferAttribute(F,K),A[X+st+0]=s.x,A[X+st+1]=s.y,A[X+st+2]=s.z,A[X+st+3]=0),_===!0&&(s.fromBufferAttribute(B,K),A[X+st+4]=s.x,A[X+st+5]=s.y,A[X+st+6]=s.z,A[X+st+7]=0),m===!0&&(s.fromBufferAttribute(G,K),A[X+st+8]=s.x,A[X+st+9]=s.y,A[X+st+10]=s.z,A[X+st+11]=G.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new Tt(P,E)},i.set(r,d),r.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",_),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:o}}function wm(n,t,e,i){let s=new WeakMap;function o(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:a}}const Vh=new ze,cl=new Ch(1,1),Gh=new vh,qh=new md,Wh=new Eh,ll=[],hl=[],ul=new Float32Array(16),dl=new Float32Array(9),fl=new Float32Array(4);function as(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let o=ll[s];if(o===void 0&&(o=new Float32Array(s),ll[s]=o),t!==0){i.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,n[a].toArray(o,r)}return o}function Ce(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Pe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Yo(n,t){let e=hl[t];e===void 0&&(e=new Int32Array(t),hl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Em(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Tm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2fv(this.addr,t),Pe(e,t)}}function Am(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;n.uniform3fv(this.addr,t),Pe(e,t)}}function Cm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4fv(this.addr,t),Pe(e,t)}}function Pm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;fl.set(i),n.uniformMatrix2fv(this.addr,!1,fl),Pe(e,i)}}function Rm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;dl.set(i),n.uniformMatrix3fv(this.addr,!1,dl),Pe(e,i)}}function Im(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;ul.set(i),n.uniformMatrix4fv(this.addr,!1,ul),Pe(e,i)}}function Lm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Dm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2iv(this.addr,t),Pe(e,t)}}function Um(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3iv(this.addr,t),Pe(e,t)}}function Nm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4iv(this.addr,t),Pe(e,t)}}function Fm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Om(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2uiv(this.addr,t),Pe(e,t)}}function zm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3uiv(this.addr,t),Pe(e,t)}}function Bm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4uiv(this.addr,t),Pe(e,t)}}function km(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let o;this.type===n.SAMPLER_2D_SHADOW?(cl.compareFunction=mh,o=cl):o=Vh,e.setTexture2D(t||o,s)}function Hm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||qh,s)}function Vm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Wh,s)}function Gm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Gh,s)}function qm(n){switch(n){case 5126:return Em;case 35664:return Tm;case 35665:return Am;case 35666:return Cm;case 35674:return Pm;case 35675:return Rm;case 35676:return Im;case 5124:case 35670:return Lm;case 35667:case 35671:return Dm;case 35668:case 35672:return Um;case 35669:case 35673:return Nm;case 5125:return Fm;case 36294:return Om;case 36295:return zm;case 36296:return Bm;case 35678:case 36198:case 36298:case 36306:case 35682:return km;case 35679:case 36299:case 36307:return Hm;case 35680:case 36300:case 36308:case 36293:return Vm;case 36289:case 36303:case 36311:case 36292:return Gm}}function Wm(n,t){n.uniform1fv(this.addr,t)}function Xm(n,t){const e=as(t,this.size,2);n.uniform2fv(this.addr,e)}function Ym(n,t){const e=as(t,this.size,3);n.uniform3fv(this.addr,e)}function jm(n,t){const e=as(t,this.size,4);n.uniform4fv(this.addr,e)}function Zm(n,t){const e=as(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Jm(n,t){const e=as(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Km(n,t){const e=as(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function $m(n,t){n.uniform1iv(this.addr,t)}function Qm(n,t){n.uniform2iv(this.addr,t)}function tg(n,t){n.uniform3iv(this.addr,t)}function eg(n,t){n.uniform4iv(this.addr,t)}function ng(n,t){n.uniform1uiv(this.addr,t)}function ig(n,t){n.uniform2uiv(this.addr,t)}function sg(n,t){n.uniform3uiv(this.addr,t)}function og(n,t){n.uniform4uiv(this.addr,t)}function ag(n,t,e){const i=this.cache,s=t.length,o=Yo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||Vh,o[a])}function rg(n,t,e){const i=this.cache,s=t.length,o=Yo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||qh,o[a])}function cg(n,t,e){const i=this.cache,s=t.length,o=Yo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Wh,o[a])}function lg(n,t,e){const i=this.cache,s=t.length,o=Yo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Gh,o[a])}function hg(n){switch(n){case 5126:return Wm;case 35664:return Xm;case 35665:return Ym;case 35666:return jm;case 35674:return Zm;case 35675:return Jm;case 35676:return Km;case 5124:case 35670:return $m;case 35667:case 35671:return Qm;case 35668:case 35672:return tg;case 35669:case 35673:return eg;case 5125:return ng;case 36294:return ig;case 36295:return sg;case 36296:return og;case 35678:case 36198:case 36298:case 36306:case 35682:return ag;case 35679:case 36299:case 36307:return rg;case 35680:case 36300:case 36308:case 36293:return cg;case 36289:case 36303:case 36311:case 36292:return lg}}class ug{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=qm(e.type)}}class dg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=hg(e.type)}}class fg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const r=s[o];r.setValue(t,e[r.id],i)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function pl(n,t){n.seq.push(t),n.map[t.id]=t}function pg(n,t,e){const i=n.name,s=i.length;for(Pa.lastIndex=0;;){const o=Pa.exec(i),a=Pa.lastIndex;let r=o[1];const c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===s){pl(e,l===void 0?new ug(r,n,t):new dg(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new fg(r),pl(e,u)),e=u}}}class Po{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=t.getActiveUniform(e,s),a=t.getUniformLocation(e,o.name);pg(o,a,this)}}setValue(t,e,i,s){const o=this.map[e];o!==void 0&&o.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let o=0,a=e.length;o!==a;++o){const r=e[o],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,o=t.length;s!==o;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function ml(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const mg=37297;let gg=0;function vg(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=s;a<o;a++){const r=a+1;i.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return i.join(`
`)}const gl=new Kt;function _g(n){de._getMatrix(gl,de.workingColorSpace,n);const t=`mat3( ${gl.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(n)){case Uo:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function vl(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),o=(n.getShaderInfoLog(t)||"").trim();if(i&&o==="")return"";const a=/ERROR: 0:(\d+)/.exec(o);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+o+`

`+vg(n.getShaderSource(t),r)}else return o}function xg(n,t){const e=_g(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Mg(n,t){let e;switch(t){case Cu:e="Linear";break;case Pu:e="Reinhard";break;case Ru:e="Cineon";break;case Iu:e="ACESFilmic";break;case Du:e="AgX";break;case Uu:e="Neutral";break;case Lu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const xo=new N;function yg(){de.getLuminanceCoefficients(xo);const n=xo.x.toFixed(4),t=xo.y.toFixed(4),e=xo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function bg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function Sg(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function wg(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=n.getActiveAttrib(t,s),a=o.name;let r=1;o.type===n.FLOAT_MAT2&&(r=2),o.type===n.FLOAT_MAT3&&(r=3),o.type===n.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:n.getAttribLocation(t,a),locationSize:r}}return e}function Ms(n){return n!==""}function _l(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xl(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Eg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dr(n){return n.replace(Eg,Ag)}const Tg=new Map;function Ag(n,t){let e=$t[t];if(e===void 0){const i=Tg.get(t);if(i!==void 0)e=$t[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Dr(e)}const Cg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ml(n){return n.replace(Cg,Pg)}function Pg(n,t,e,i){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function yl(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Rg(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ih?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===sh?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Fn&&(t="SHADOWMAP_TYPE_VSM"),t}function Ig(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Ki:case $i:t="ENVMAP_TYPE_CUBE";break;case Vo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Lg(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case $i:t="ENVMAP_MODE_REFRACTION";break}return t}function Dg(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case oh:t="ENVMAP_BLENDING_MULTIPLY";break;case Tu:t="ENVMAP_BLENDING_MIX";break;case Au:t="ENVMAP_BLENDING_ADD";break}return t}function Ug(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Ng(n,t,e,i){const s=n.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=Rg(e),l=Ig(e),h=Lg(e),u=Dg(e),d=Ug(e),f=bg(e),g=Sg(o),_=s.createProgram();let m,p,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),p.length>0&&(p+=`
`)):(m=[yl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),p=[yl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==si?"#define TONE_MAPPING":"",e.toneMapping!==si?$t.tonemapping_pars_fragment:"",e.toneMapping!==si?Mg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,xg("linearToOutputTexel",e.outputColorSpace),yg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),a=Dr(a),a=_l(a,e),a=xl(a,e),r=Dr(r),r=_l(r,e),r=xl(r,e),a=Ml(a),r=Ml(r),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===wc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===wc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=w+m+a,v=w+p+r,P=ml(s,s.VERTEX_SHADER,x),E=ml(s,s.FRAGMENT_SHADER,v);s.attachShader(_,P),s.attachShader(_,E),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(_)||"",B=s.getShaderInfoLog(P)||"",G=s.getShaderInfoLog(E)||"",X=F.trim(),K=B.trim(),st=G.trim();let J=!0,ot=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(J=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,_,P,E);else{const Z=vl(s,P,"vertex"),yt=vl(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+X+`
`+Z+`
`+yt)}else X!==""?console.warn("THREE.WebGLProgram: Program Info Log:",X):(K===""||st==="")&&(ot=!1);ot&&(D.diagnostics={runnable:J,programLog:X,vertexShader:{log:K,prefix:m},fragmentShader:{log:st,prefix:p}})}s.deleteShader(P),s.deleteShader(E),C=new Po(s,_),b=wg(s,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let b;this.getAttributes=function(){return b===void 0&&A(this),b};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,mg)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=gg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=E,this}let Fg=0;class Og{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new zg(t),e.set(t,i)),i}}class zg{constructor(t){this.id=Fg++,this.code=t,this.usedTimes=0}}function Bg(n,t,e,i,s,o,a){const r=new xh,c=new Og,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,y,D,F,B){const G=F.fog,X=B.geometry,K=b.isMeshStandardMaterial?F.environment:null,st=(b.isMeshStandardMaterial?e:t).get(b.envMap||K),J=st&&st.mapping===Vo?st.image.height:null,ot=g[b.type];b.precision!==null&&(f=s.getMaxPrecision(b.precision),f!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",f,"instead."));const Z=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,yt=Z!==void 0?Z.length:0;let Wt=0;X.morphAttributes.position!==void 0&&(Wt=1),X.morphAttributes.normal!==void 0&&(Wt=2),X.morphAttributes.color!==void 0&&(Wt=3);let Qt,le,ne,rt;if(ot){const ae=wn[ot];Qt=ae.vertexShader,le=ae.fragmentShader}else Qt=b.vertexShader,le=b.fragmentShader,c.update(b),ne=c.getVertexShaderID(b),rt=c.getFragmentShaderID(b);const dt=n.getRenderTarget(),Rt=n.state.buffers.depth.getReversed(),Vt=B.isInstancedMesh===!0,Nt=B.isBatchedMesh===!0,te=!!b.map,me=!!b.matcap,O=!!st,ft=!!b.aoMap,ht=!!b.lightMap,ct=!!b.bumpMap,j=!!b.normalMap,bt=!!b.displacementMap,vt=!!b.emissiveMap,wt=!!b.metalnessMap,Xt=!!b.roughnessMap,Zt=b.anisotropy>0,U=b.clearcoat>0,T=b.dispersion>0,W=b.iridescence>0,Q=b.sheen>0,ut=b.transmission>0,nt=Zt&&!!b.anisotropyMap,Ft=U&&!!b.clearcoatMap,St=U&&!!b.clearcoatNormalMap,Ot=U&&!!b.clearcoatRoughnessMap,zt=W&&!!b.iridescenceMap,xt=W&&!!b.iridescenceThicknessMap,mt=Q&&!!b.sheenColorMap,Gt=Q&&!!b.sheenRoughnessMap,Ut=!!b.specularMap,At=!!b.specularColorMap,qt=!!b.specularIntensityMap,k=ut&&!!b.transmissionMap,Mt=ut&&!!b.thicknessMap,Et=!!b.gradientMap,It=!!b.alphaMap,pt=b.alphaTest>0,lt=!!b.alphaHash,Lt=!!b.extensions;let Yt=si;b.toneMapped&&(dt===null||dt.isXRRenderTarget===!0)&&(Yt=n.toneMapping);const fe={shaderID:ot,shaderType:b.type,shaderName:b.name,vertexShader:Qt,fragmentShader:le,defines:b.defines,customVertexShaderID:ne,customFragmentShaderID:rt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:f,batching:Nt,batchingColor:Nt&&B._colorsTexture!==null,instancing:Vt,instancingColor:Vt&&B.instanceColor!==null,instancingMorph:Vt&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:dt===null?n.outputColorSpace:dt.isXRRenderTarget===!0?dt.texture.colorSpace:Qi,alphaToCoverage:!!b.alphaToCoverage,map:te,matcap:me,envMap:O,envMapMode:O&&st.mapping,envMapCubeUVHeight:J,aoMap:ft,lightMap:ht,bumpMap:ct,normalMap:j,displacementMap:d&&bt,emissiveMap:vt,normalMapObjectSpace:j&&b.normalMapType===zu,normalMapTangentSpace:j&&b.normalMapType===ph,metalnessMap:wt,roughnessMap:Xt,anisotropy:Zt,anisotropyMap:nt,clearcoat:U,clearcoatMap:Ft,clearcoatNormalMap:St,clearcoatRoughnessMap:Ot,dispersion:T,iridescence:W,iridescenceMap:zt,iridescenceThicknessMap:xt,sheen:Q,sheenColorMap:mt,sheenRoughnessMap:Gt,specularMap:Ut,specularColorMap:At,specularIntensityMap:qt,transmission:ut,transmissionMap:k,thicknessMap:Mt,gradientMap:Et,opaque:b.transparent===!1&&b.blending===ji&&b.alphaToCoverage===!1,alphaMap:It,alphaTest:pt,alphaHash:lt,combine:b.combine,mapUv:te&&_(b.map.channel),aoMapUv:ft&&_(b.aoMap.channel),lightMapUv:ht&&_(b.lightMap.channel),bumpMapUv:ct&&_(b.bumpMap.channel),normalMapUv:j&&_(b.normalMap.channel),displacementMapUv:bt&&_(b.displacementMap.channel),emissiveMapUv:vt&&_(b.emissiveMap.channel),metalnessMapUv:wt&&_(b.metalnessMap.channel),roughnessMapUv:Xt&&_(b.roughnessMap.channel),anisotropyMapUv:nt&&_(b.anisotropyMap.channel),clearcoatMapUv:Ft&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:St&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ot&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:zt&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:xt&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:mt&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:Gt&&_(b.sheenRoughnessMap.channel),specularMapUv:Ut&&_(b.specularMap.channel),specularColorMapUv:At&&_(b.specularColorMap.channel),specularIntensityMapUv:qt&&_(b.specularIntensityMap.channel),transmissionMapUv:k&&_(b.transmissionMap.channel),thicknessMapUv:Mt&&_(b.thicknessMap.channel),alphaMapUv:It&&_(b.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(j||Zt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!X.attributes.uv&&(te||It),fog:!!G,useFog:b.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Rt,skinning:B.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Wt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Yt,decodeVideoTexture:te&&b.map.isVideoTexture===!0&&de.getTransfer(b.map.colorSpace)===ve,decodeVideoTextureEmissive:vt&&b.emissiveMap.isVideoTexture===!0&&de.getTransfer(b.emissiveMap.colorSpace)===ve,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===xn,flipSided:b.side===je,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Lt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&b.extensions.multiDraw===!0||Nt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return fe.vertexUv1s=l.has(1),fe.vertexUv2s=l.has(2),fe.vertexUv3s=l.has(3),l.clear(),fe}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const D in b.defines)y.push(D),y.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(w(y,b),x(y,b),y.push(n.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function w(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function x(b,y){r.disableAll(),y.supportsVertexTextures&&r.enable(0),y.instancing&&r.enable(1),y.instancingColor&&r.enable(2),y.instancingMorph&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),y.dispersion&&r.enable(20),y.batchingColor&&r.enable(21),y.gradientMap&&r.enable(22),b.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.reversedDepthBuffer&&r.enable(4),y.skinning&&r.enable(5),y.morphTargets&&r.enable(6),y.morphNormals&&r.enable(7),y.morphColors&&r.enable(8),y.premultipliedAlpha&&r.enable(9),y.shadowMapEnabled&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),y.decodeVideoTextureEmissive&&r.enable(20),y.alphaToCoverage&&r.enable(21),b.push(r.mask)}function v(b){const y=g[b.type];let D;if(y){const F=wn[y];D=Cd.clone(F.uniforms)}else D=b.uniforms;return D}function P(b,y){let D;for(let F=0,B=h.length;F<B;F++){const G=h[F];if(G.cacheKey===y){D=G,++D.usedTimes;break}}return D===void 0&&(D=new Ng(n,y,b,o),h.push(D)),D}function E(b){if(--b.usedTimes===0){const y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function A(b){c.remove(b)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:v,acquireProgram:P,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:C}}function kg(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let r=n.get(a);return r===void 0&&(r={},n.set(a,r)),r}function i(a){n.delete(a)}function s(a,r,c){n.get(a)[r]=c}function o(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:o}}function Hg(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function bl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Sl(){const n=[];let t=0;const e=[],i=[],s=[];function o(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,f,g,_,m){let p=n[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},n[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function r(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?i.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?i.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Hg),i.length>1&&i.sort(d||bl),s.length>1&&s.sort(d||bl)}function h(){for(let u=t,d=n.length;u<d;u++){const f=n[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:s,init:o,push:r,unshift:c,finish:h,sort:l}}function Vg(){let n=new WeakMap;function t(i,s){const o=n.get(i);let a;return o===void 0?(a=new Sl,n.set(i,[a])):s>=o.length?(a=new Sl,o.push(a)):a=o[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function Gg(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new oe};break;case"SpotLight":e={position:new N,direction:new N,color:new oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new oe,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new oe,groundColor:new oe};break;case"RectAreaLight":e={color:new oe,position:new N,halfWidth:new N,halfHeight:new N};break}return n[t.id]=e,e}}}function qg(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Wg=0;function Xg(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function Yg(n){const t=new Gg,e=qg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new N);const s=new N,o=new Se,a=new Se;function r(l){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,w=0,x=0,v=0,P=0,E=0,A=0;l.sort(Xg);for(let b=0,y=l.length;b<y;b++){const D=l[b],F=D.color,B=D.intensity,G=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=F.r*B,u+=F.g*B,d+=F.b*B;else if(D.isLightProbe){for(let K=0;K<9;K++)i.probe[K].addScaledVector(D.sh.coefficients[K],B);A++}else if(D.isDirectionalLight){const K=t.get(D);if(K.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const st=D.shadow,J=e.get(D);J.shadowIntensity=st.intensity,J.shadowBias=st.bias,J.shadowNormalBias=st.normalBias,J.shadowRadius=st.radius,J.shadowMapSize=st.mapSize,i.directionalShadow[f]=J,i.directionalShadowMap[f]=X,i.directionalShadowMatrix[f]=D.shadow.matrix,w++}i.directional[f]=K,f++}else if(D.isSpotLight){const K=t.get(D);K.position.setFromMatrixPosition(D.matrixWorld),K.color.copy(F).multiplyScalar(B),K.distance=G,K.coneCos=Math.cos(D.angle),K.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),K.decay=D.decay,i.spot[_]=K;const st=D.shadow;if(D.map&&(i.spotLightMap[P]=D.map,P++,st.updateMatrices(D),D.castShadow&&E++),i.spotLightMatrix[_]=st.matrix,D.castShadow){const J=e.get(D);J.shadowIntensity=st.intensity,J.shadowBias=st.bias,J.shadowNormalBias=st.normalBias,J.shadowRadius=st.radius,J.shadowMapSize=st.mapSize,i.spotShadow[_]=J,i.spotShadowMap[_]=X,v++}_++}else if(D.isRectAreaLight){const K=t.get(D);K.color.copy(F).multiplyScalar(B),K.halfWidth.set(D.width*.5,0,0),K.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=K,m++}else if(D.isPointLight){const K=t.get(D);if(K.color.copy(D.color).multiplyScalar(D.intensity),K.distance=D.distance,K.decay=D.decay,D.castShadow){const st=D.shadow,J=e.get(D);J.shadowIntensity=st.intensity,J.shadowBias=st.bias,J.shadowNormalBias=st.normalBias,J.shadowRadius=st.radius,J.shadowMapSize=st.mapSize,J.shadowCameraNear=st.camera.near,J.shadowCameraFar=st.camera.far,i.pointShadow[g]=J,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=D.shadow.matrix,x++}i.point[g]=K,g++}else if(D.isHemisphereLight){const K=t.get(D);K.skyColor.copy(D.color).multiplyScalar(B),K.groundColor.copy(D.groundColor).multiplyScalar(B),i.hemi[p]=K,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pt.LTC_FLOAT_1,i.rectAreaLTC2=Pt.LTC_FLOAT_2):(i.rectAreaLTC1=Pt.LTC_HALF_1,i.rectAreaLTC2=Pt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const C=i.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==w||C.numPointShadows!==x||C.numSpotShadows!==v||C.numSpotMaps!==P||C.numLightProbes!==A)&&(i.directional.length=f,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=v,i.spotShadowMap.length=v,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=v+P-E,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=w,C.numPointShadows=x,C.numSpotShadows=v,C.numSpotMaps=P,C.numLightProbes=A,i.version=Wg++)}function c(l,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,w=l.length;p<w;p++){const x=l[p];if(x.isDirectionalLight){const v=i.directional[u];v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),u++}else if(x.isSpotLight){const v=i.spot[f];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),v.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),v.direction.sub(s),v.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const v=i.rectArea[g];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),a.identity(),o.copy(x.matrixWorld),o.premultiply(m),a.extractRotation(o),v.halfWidth.set(x.width*.5,0,0),v.halfHeight.set(0,x.height*.5,0),v.halfWidth.applyMatrix4(a),v.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const v=i.point[d];v.position.setFromMatrixPosition(x.matrixWorld),v.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const v=i.hemi[_];v.direction.setFromMatrixPosition(x.matrixWorld),v.direction.transformDirection(m),_++}}}return{setup:r,setupView:c,state:i}}function wl(n){const t=new Yg(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function o(h){e.push(h)}function a(h){i.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:r,setupLightsView:c,pushLight:o,pushShadow:a}}function jg(n){let t=new WeakMap;function e(s,o=0){const a=t.get(s);let r;return a===void 0?(r=new wl(n),t.set(s,[r])):o>=a.length?(r=new wl(n),a.push(r)):r=a[o],r}function i(){t=new WeakMap}return{get:e,dispose:i}}const Zg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Jg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Kg(n,t,e){let i=new cc;const s=new Tt,o=new Tt,a=new Ee,r=new yf({depthPacking:Ou}),c=new bf,l={},h=e.maxTextureSize,u={[qn]:je,[je]:qn,[xn]:xn},d=new oi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:Zg,fragmentShader:Jg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ue;g.setAttribute("position",new Cn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new M(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ih;let p=this.type;this.render=function(E,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const b=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),F=n.state;F.setBlending(ii),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const B=p!==Fn&&this.type===Fn,G=p===Fn&&this.type!==Fn;for(let X=0,K=E.length;X<K;X++){const st=E[X],J=st.shadow;if(J===void 0){console.warn("THREE.WebGLShadowMap:",st,"has no shadow.");continue}if(J.autoUpdate===!1&&J.needsUpdate===!1)continue;s.copy(J.mapSize);const ot=J.getFrameExtents();if(s.multiply(ot),o.copy(J.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/ot.x),s.x=o.x*ot.x,J.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/ot.y),s.y=o.y*ot.y,J.mapSize.y=o.y)),J.map===null||B===!0||G===!0){const yt=this.type!==Fn?{minFilter:We,magFilter:We}:{};J.map!==null&&J.map.dispose(),J.map=new Ei(s.x,s.y,yt),J.map.texture.name=st.name+".shadowMap",J.camera.updateProjectionMatrix()}n.setRenderTarget(J.map),n.clear();const Z=J.getViewportCount();for(let yt=0;yt<Z;yt++){const Wt=J.getViewport(yt);a.set(o.x*Wt.x,o.y*Wt.y,o.x*Wt.z,o.y*Wt.w),F.viewport(a),J.updateMatrices(st,yt),i=J.getFrustum(),v(A,C,J.camera,st,this.type)}J.isPointLightShadow!==!0&&this.type===Fn&&w(J,C),J.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(b,y,D)};function w(E,A){const C=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ei(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,C,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,C,f,_,null)}function x(E,A,C,b){let y=null;const D=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)y=D;else if(y=C.isPointLight===!0?c:r,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const F=y.uuid,B=A.uuid;let G=l[F];G===void 0&&(G={},l[F]=G);let X=G[B];X===void 0&&(X=y.clone(),G[B]=X,A.addEventListener("dispose",P)),y=X}if(y.visible=A.visible,y.wireframe=A.wireframe,b===Fn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const F=n.properties.get(y);F.light=C}return y}function v(E,A,C,b,y){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===Fn)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const B=t.update(E),G=E.material;if(Array.isArray(G)){const X=B.groups;for(let K=0,st=X.length;K<st;K++){const J=X[K],ot=G[J.materialIndex];if(ot&&ot.visible){const Z=x(E,ot,b,y);E.onBeforeShadow(n,E,A,C,B,Z,J),n.renderBufferDirect(C,null,B,Z,E,J),E.onAfterShadow(n,E,A,C,B,Z,J)}}}else if(G.visible){const X=x(E,G,b,y);E.onBeforeShadow(n,E,A,C,B,X,null),n.renderBufferDirect(C,null,B,X,E,null),E.onAfterShadow(n,E,A,C,B,X,null)}}const F=E.children;for(let B=0,G=F.length;B<G;B++)v(F[B],A,C,b,y)}function P(E){E.target.removeEventListener("dispose",P);for(const C in l){const b=l[C],y=E.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}const $g={[Ga]:qa,[Wa]:ja,[Xa]:Za,[Ji]:Ya,[qa]:Ga,[ja]:Wa,[Za]:Xa,[Ya]:Ji};function Qg(n,t){function e(){let k=!1;const Mt=new Ee;let Et=null;const It=new Ee(0,0,0,0);return{setMask:function(pt){Et!==pt&&!k&&(n.colorMask(pt,pt,pt,pt),Et=pt)},setLocked:function(pt){k=pt},setClear:function(pt,lt,Lt,Yt,fe){fe===!0&&(pt*=Yt,lt*=Yt,Lt*=Yt),Mt.set(pt,lt,Lt,Yt),It.equals(Mt)===!1&&(n.clearColor(pt,lt,Lt,Yt),It.copy(Mt))},reset:function(){k=!1,Et=null,It.set(-1,0,0,0)}}}function i(){let k=!1,Mt=!1,Et=null,It=null,pt=null;return{setReversed:function(lt){if(Mt!==lt){const Lt=t.get("EXT_clip_control");lt?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),Mt=lt;const Yt=pt;pt=null,this.setClear(Yt)}},getReversed:function(){return Mt},setTest:function(lt){lt?dt(n.DEPTH_TEST):Rt(n.DEPTH_TEST)},setMask:function(lt){Et!==lt&&!k&&(n.depthMask(lt),Et=lt)},setFunc:function(lt){if(Mt&&(lt=$g[lt]),It!==lt){switch(lt){case Ga:n.depthFunc(n.NEVER);break;case qa:n.depthFunc(n.ALWAYS);break;case Wa:n.depthFunc(n.LESS);break;case Ji:n.depthFunc(n.LEQUAL);break;case Xa:n.depthFunc(n.EQUAL);break;case Ya:n.depthFunc(n.GEQUAL);break;case ja:n.depthFunc(n.GREATER);break;case Za:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}It=lt}},setLocked:function(lt){k=lt},setClear:function(lt){pt!==lt&&(Mt&&(lt=1-lt),n.clearDepth(lt),pt=lt)},reset:function(){k=!1,Et=null,It=null,pt=null,Mt=!1}}}function s(){let k=!1,Mt=null,Et=null,It=null,pt=null,lt=null,Lt=null,Yt=null,fe=null;return{setTest:function(ae){k||(ae?dt(n.STENCIL_TEST):Rt(n.STENCIL_TEST))},setMask:function(ae){Mt!==ae&&!k&&(n.stencilMask(ae),Mt=ae)},setFunc:function(ae,sn,Ze){(Et!==ae||It!==sn||pt!==Ze)&&(n.stencilFunc(ae,sn,Ze),Et=ae,It=sn,pt=Ze)},setOp:function(ae,sn,Ze){(lt!==ae||Lt!==sn||Yt!==Ze)&&(n.stencilOp(ae,sn,Ze),lt=ae,Lt=sn,Yt=Ze)},setLocked:function(ae){k=ae},setClear:function(ae){fe!==ae&&(n.clearStencil(ae),fe=ae)},reset:function(){k=!1,Mt=null,Et=null,It=null,pt=null,lt=null,Lt=null,Yt=null,fe=null}}}const o=new e,a=new i,r=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,w=null,x=null,v=null,P=null,E=null,A=new oe(0,0,0),C=0,b=!1,y=null,D=null,F=null,B=null,G=null;const X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,st=0;const J=n.getParameter(n.VERSION);J.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec(J)[1]),K=st>=1):J.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),K=st>=2);let ot=null,Z={};const yt=n.getParameter(n.SCISSOR_BOX),Wt=n.getParameter(n.VIEWPORT),Qt=new Ee().fromArray(yt),le=new Ee().fromArray(Wt);function ne(k,Mt,Et,It){const pt=new Uint8Array(4),lt=n.createTexture();n.bindTexture(k,lt),n.texParameteri(k,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(k,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Lt=0;Lt<Et;Lt++)k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?n.texImage3D(Mt,0,n.RGBA,1,1,It,0,n.RGBA,n.UNSIGNED_BYTE,pt):n.texImage2D(Mt+Lt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pt);return lt}const rt={};rt[n.TEXTURE_2D]=ne(n.TEXTURE_2D,n.TEXTURE_2D,1),rt[n.TEXTURE_CUBE_MAP]=ne(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),rt[n.TEXTURE_2D_ARRAY]=ne(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),rt[n.TEXTURE_3D]=ne(n.TEXTURE_3D,n.TEXTURE_3D,1,1),o.setClear(0,0,0,1),a.setClear(1),r.setClear(0),dt(n.DEPTH_TEST),a.setFunc(Ji),ct(!1),j(_c),dt(n.CULL_FACE),ft(ii);function dt(k){h[k]!==!0&&(n.enable(k),h[k]=!0)}function Rt(k){h[k]!==!1&&(n.disable(k),h[k]=!1)}function Vt(k,Mt){return u[k]!==Mt?(n.bindFramebuffer(k,Mt),u[k]=Mt,k===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Mt),k===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Mt),!0):!1}function Nt(k,Mt){let Et=f,It=!1;if(k){Et=d.get(Mt),Et===void 0&&(Et=[],d.set(Mt,Et));const pt=k.textures;if(Et.length!==pt.length||Et[0]!==n.COLOR_ATTACHMENT0){for(let lt=0,Lt=pt.length;lt<Lt;lt++)Et[lt]=n.COLOR_ATTACHMENT0+lt;Et.length=pt.length,It=!0}}else Et[0]!==n.BACK&&(Et[0]=n.BACK,It=!0);It&&n.drawBuffers(Et)}function te(k){return g!==k?(n.useProgram(k),g=k,!0):!1}const me={[xi]:n.FUNC_ADD,[lu]:n.FUNC_SUBTRACT,[hu]:n.FUNC_REVERSE_SUBTRACT};me[uu]=n.MIN,me[du]=n.MAX;const O={[fu]:n.ZERO,[pu]:n.ONE,[mu]:n.SRC_COLOR,[Ha]:n.SRC_ALPHA,[yu]:n.SRC_ALPHA_SATURATE,[xu]:n.DST_COLOR,[vu]:n.DST_ALPHA,[gu]:n.ONE_MINUS_SRC_COLOR,[Va]:n.ONE_MINUS_SRC_ALPHA,[Mu]:n.ONE_MINUS_DST_COLOR,[_u]:n.ONE_MINUS_DST_ALPHA,[bu]:n.CONSTANT_COLOR,[Su]:n.ONE_MINUS_CONSTANT_COLOR,[wu]:n.CONSTANT_ALPHA,[Eu]:n.ONE_MINUS_CONSTANT_ALPHA};function ft(k,Mt,Et,It,pt,lt,Lt,Yt,fe,ae){if(k===ii){_===!0&&(Rt(n.BLEND),_=!1);return}if(_===!1&&(dt(n.BLEND),_=!0),k!==cu){if(k!==m||ae!==b){if((p!==xi||v!==xi)&&(n.blendEquation(n.FUNC_ADD),p=xi,v=xi),ae)switch(k){case ji:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case xc:n.blendFunc(n.ONE,n.ONE);break;case Mc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case yc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case ji:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case xc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Mc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case yc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}w=null,x=null,P=null,E=null,A.set(0,0,0),C=0,m=k,b=ae}return}pt=pt||Mt,lt=lt||Et,Lt=Lt||It,(Mt!==p||pt!==v)&&(n.blendEquationSeparate(me[Mt],me[pt]),p=Mt,v=pt),(Et!==w||It!==x||lt!==P||Lt!==E)&&(n.blendFuncSeparate(O[Et],O[It],O[lt],O[Lt]),w=Et,x=It,P=lt,E=Lt),(Yt.equals(A)===!1||fe!==C)&&(n.blendColor(Yt.r,Yt.g,Yt.b,fe),A.copy(Yt),C=fe),m=k,b=!1}function ht(k,Mt){k.side===xn?Rt(n.CULL_FACE):dt(n.CULL_FACE);let Et=k.side===je;Mt&&(Et=!Et),ct(Et),k.blending===ji&&k.transparent===!1?ft(ii):ft(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),o.setMask(k.colorWrite);const It=k.stencilWrite;r.setTest(It),It&&(r.setMask(k.stencilWriteMask),r.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),r.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),vt(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?dt(n.SAMPLE_ALPHA_TO_COVERAGE):Rt(n.SAMPLE_ALPHA_TO_COVERAGE)}function ct(k){y!==k&&(k?n.frontFace(n.CW):n.frontFace(n.CCW),y=k)}function j(k){k!==au?(dt(n.CULL_FACE),k!==D&&(k===_c?n.cullFace(n.BACK):k===ru?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Rt(n.CULL_FACE),D=k}function bt(k){k!==F&&(K&&n.lineWidth(k),F=k)}function vt(k,Mt,Et){k?(dt(n.POLYGON_OFFSET_FILL),(B!==Mt||G!==Et)&&(n.polygonOffset(Mt,Et),B=Mt,G=Et)):Rt(n.POLYGON_OFFSET_FILL)}function wt(k){k?dt(n.SCISSOR_TEST):Rt(n.SCISSOR_TEST)}function Xt(k){k===void 0&&(k=n.TEXTURE0+X-1),ot!==k&&(n.activeTexture(k),ot=k)}function Zt(k,Mt,Et){Et===void 0&&(ot===null?Et=n.TEXTURE0+X-1:Et=ot);let It=Z[Et];It===void 0&&(It={type:void 0,texture:void 0},Z[Et]=It),(It.type!==k||It.texture!==Mt)&&(ot!==Et&&(n.activeTexture(Et),ot=Et),n.bindTexture(k,Mt||rt[k]),It.type=k,It.texture=Mt)}function U(){const k=Z[ot];k!==void 0&&k.type!==void 0&&(n.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function W(){try{n.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Q(){try{n.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ut(){try{n.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function nt(){try{n.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ft(){try{n.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function St(){try{n.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ot(){try{n.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function zt(){try{n.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function xt(){try{n.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function mt(k){Qt.equals(k)===!1&&(n.scissor(k.x,k.y,k.z,k.w),Qt.copy(k))}function Gt(k){le.equals(k)===!1&&(n.viewport(k.x,k.y,k.z,k.w),le.copy(k))}function Ut(k,Mt){let Et=l.get(Mt);Et===void 0&&(Et=new WeakMap,l.set(Mt,Et));let It=Et.get(k);It===void 0&&(It=n.getUniformBlockIndex(Mt,k.name),Et.set(k,It))}function At(k,Mt){const It=l.get(Mt).get(k);c.get(Mt)!==It&&(n.uniformBlockBinding(Mt,It,k.__bindingPointIndex),c.set(Mt,It))}function qt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},ot=null,Z={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,w=null,x=null,v=null,P=null,E=null,A=new oe(0,0,0),C=0,b=!1,y=null,D=null,F=null,B=null,G=null,Qt.set(0,0,n.canvas.width,n.canvas.height),le.set(0,0,n.canvas.width,n.canvas.height),o.reset(),a.reset(),r.reset()}return{buffers:{color:o,depth:a,stencil:r},enable:dt,disable:Rt,bindFramebuffer:Vt,drawBuffers:Nt,useProgram:te,setBlending:ft,setMaterial:ht,setFlipSided:ct,setCullFace:j,setLineWidth:bt,setPolygonOffset:vt,setScissorTest:wt,activeTexture:Xt,bindTexture:Zt,unbindTexture:U,compressedTexImage2D:T,compressedTexImage3D:W,texImage2D:zt,texImage3D:xt,updateUBOMapping:Ut,uniformBlockBinding:At,texStorage2D:St,texStorage3D:Ot,texSubImage2D:Q,texSubImage3D:ut,compressedTexSubImage2D:nt,compressedTexSubImage3D:Ft,scissor:mt,viewport:Gt,reset:qt}}function tv(n,t,e,i,s,o,a){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Tt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(U,T){return f?new OffscreenCanvas(U,T):Fo("canvas")}function _(U,T,W){let Q=1;const ut=Zt(U);if((ut.width>W||ut.height>W)&&(Q=W/Math.max(ut.width,ut.height)),Q<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const nt=Math.floor(Q*ut.width),Ft=Math.floor(Q*ut.height);u===void 0&&(u=g(nt,Ft));const St=T?g(nt,Ft):u;return St.width=nt,St.height=Ft,St.getContext("2d").drawImage(U,0,0,nt,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ut.width+"x"+ut.height+") to ("+nt+"x"+Ft+")."),St}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ut.width+"x"+ut.height+")."),U;return U}function m(U){return U.generateMipmaps}function p(U){n.generateMipmap(U)}function w(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(U,T,W,Q,ut=!1){if(U!==null){if(n[U]!==void 0)return n[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let nt=T;if(T===n.RED&&(W===n.FLOAT&&(nt=n.R32F),W===n.HALF_FLOAT&&(nt=n.R16F),W===n.UNSIGNED_BYTE&&(nt=n.R8)),T===n.RED_INTEGER&&(W===n.UNSIGNED_BYTE&&(nt=n.R8UI),W===n.UNSIGNED_SHORT&&(nt=n.R16UI),W===n.UNSIGNED_INT&&(nt=n.R32UI),W===n.BYTE&&(nt=n.R8I),W===n.SHORT&&(nt=n.R16I),W===n.INT&&(nt=n.R32I)),T===n.RG&&(W===n.FLOAT&&(nt=n.RG32F),W===n.HALF_FLOAT&&(nt=n.RG16F),W===n.UNSIGNED_BYTE&&(nt=n.RG8)),T===n.RG_INTEGER&&(W===n.UNSIGNED_BYTE&&(nt=n.RG8UI),W===n.UNSIGNED_SHORT&&(nt=n.RG16UI),W===n.UNSIGNED_INT&&(nt=n.RG32UI),W===n.BYTE&&(nt=n.RG8I),W===n.SHORT&&(nt=n.RG16I),W===n.INT&&(nt=n.RG32I)),T===n.RGB_INTEGER&&(W===n.UNSIGNED_BYTE&&(nt=n.RGB8UI),W===n.UNSIGNED_SHORT&&(nt=n.RGB16UI),W===n.UNSIGNED_INT&&(nt=n.RGB32UI),W===n.BYTE&&(nt=n.RGB8I),W===n.SHORT&&(nt=n.RGB16I),W===n.INT&&(nt=n.RGB32I)),T===n.RGBA_INTEGER&&(W===n.UNSIGNED_BYTE&&(nt=n.RGBA8UI),W===n.UNSIGNED_SHORT&&(nt=n.RGBA16UI),W===n.UNSIGNED_INT&&(nt=n.RGBA32UI),W===n.BYTE&&(nt=n.RGBA8I),W===n.SHORT&&(nt=n.RGBA16I),W===n.INT&&(nt=n.RGBA32I)),T===n.RGB&&(W===n.UNSIGNED_INT_5_9_9_9_REV&&(nt=n.RGB9_E5),W===n.UNSIGNED_INT_10F_11F_11F_REV&&(nt=n.R11F_G11F_B10F)),T===n.RGBA){const Ft=ut?Uo:de.getTransfer(Q);W===n.FLOAT&&(nt=n.RGBA32F),W===n.HALF_FLOAT&&(nt=n.RGBA16F),W===n.UNSIGNED_BYTE&&(nt=Ft===ve?n.SRGB8_ALPHA8:n.RGBA8),W===n.UNSIGNED_SHORT_4_4_4_4&&(nt=n.RGBA4),W===n.UNSIGNED_SHORT_5_5_5_1&&(nt=n.RGB5_A1)}return(nt===n.R16F||nt===n.R32F||nt===n.RG16F||nt===n.RG32F||nt===n.RGBA16F||nt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function v(U,T){let W;return U?T===null||T===wi||T===As?W=n.DEPTH24_STENCIL8:T===Bn?W=n.DEPTH32F_STENCIL8:T===Ts&&(W=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===wi||T===As?W=n.DEPTH_COMPONENT24:T===Bn?W=n.DEPTH_COMPONENT32F:T===Ts&&(W=n.DEPTH_COMPONENT16),W}function P(U,T){return m(U)===!0||U.isFramebufferTexture&&U.minFilter!==We&&U.minFilter!==En?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function E(U){const T=U.target;T.removeEventListener("dispose",E),C(T),T.isVideoTexture&&h.delete(T)}function A(U){const T=U.target;T.removeEventListener("dispose",A),y(T)}function C(U){const T=i.get(U);if(T.__webglInit===void 0)return;const W=U.source,Q=d.get(W);if(Q){const ut=Q[T.__cacheKey];ut.usedTimes--,ut.usedTimes===0&&b(U),Object.keys(Q).length===0&&d.delete(W)}i.remove(U)}function b(U){const T=i.get(U);n.deleteTexture(T.__webglTexture);const W=U.source,Q=d.get(W);delete Q[T.__cacheKey],a.memory.textures--}function y(U){const T=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(T.__webglFramebuffer[Q]))for(let ut=0;ut<T.__webglFramebuffer[Q].length;ut++)n.deleteFramebuffer(T.__webglFramebuffer[Q][ut]);else n.deleteFramebuffer(T.__webglFramebuffer[Q]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[Q])}else{if(Array.isArray(T.__webglFramebuffer))for(let Q=0;Q<T.__webglFramebuffer.length;Q++)n.deleteFramebuffer(T.__webglFramebuffer[Q]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let Q=0;Q<T.__webglColorRenderbuffer.length;Q++)T.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[Q]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const W=U.textures;for(let Q=0,ut=W.length;Q<ut;Q++){const nt=i.get(W[Q]);nt.__webglTexture&&(n.deleteTexture(nt.__webglTexture),a.memory.textures--),i.remove(W[Q])}i.remove(U)}let D=0;function F(){D=0}function B(){const U=D;return U>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),D+=1,U}function G(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function X(U,T){const W=i.get(U);if(U.isVideoTexture&&wt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&W.__version!==U.version){const Q=U.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{rt(W,U,T);return}}else U.isExternalTexture&&(W.__webglTexture=U.sourceTexture?U.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,W.__webglTexture,n.TEXTURE0+T)}function K(U,T){const W=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&W.__version!==U.version){rt(W,U,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,W.__webglTexture,n.TEXTURE0+T)}function st(U,T){const W=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&W.__version!==U.version){rt(W,U,T);return}e.bindTexture(n.TEXTURE_3D,W.__webglTexture,n.TEXTURE0+T)}function J(U,T){const W=i.get(U);if(U.version>0&&W.__version!==U.version){dt(W,U,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture,n.TEXTURE0+T)}const ot={[$a]:n.REPEAT,[yi]:n.CLAMP_TO_EDGE,[Qa]:n.MIRRORED_REPEAT},Z={[We]:n.NEAREST,[Nu]:n.NEAREST_MIPMAP_NEAREST,[Ys]:n.NEAREST_MIPMAP_LINEAR,[En]:n.LINEAR,[Jo]:n.LINEAR_MIPMAP_NEAREST,[bi]:n.LINEAR_MIPMAP_LINEAR},yt={[Bu]:n.NEVER,[Wu]:n.ALWAYS,[ku]:n.LESS,[mh]:n.LEQUAL,[Hu]:n.EQUAL,[qu]:n.GEQUAL,[Vu]:n.GREATER,[Gu]:n.NOTEQUAL};function Wt(U,T){if(T.type===Bn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===En||T.magFilter===Jo||T.magFilter===Ys||T.magFilter===bi||T.minFilter===En||T.minFilter===Jo||T.minFilter===Ys||T.minFilter===bi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,ot[T.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,ot[T.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,ot[T.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,Z[T.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,Z[T.minFilter]),T.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,yt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===We||T.minFilter!==Ys&&T.minFilter!==bi||T.type===Bn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");n.texParameterf(U,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function Qt(U,T){let W=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",E));const Q=T.source;let ut=d.get(Q);ut===void 0&&(ut={},d.set(Q,ut));const nt=G(T);if(nt!==U.__cacheKey){ut[nt]===void 0&&(ut[nt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,W=!0),ut[nt].usedTimes++;const Ft=ut[U.__cacheKey];Ft!==void 0&&(ut[U.__cacheKey].usedTimes--,Ft.usedTimes===0&&b(T)),U.__cacheKey=nt,U.__webglTexture=ut[nt].texture}return W}function le(U,T,W){return Math.floor(Math.floor(U/W)/T)}function ne(U,T,W,Q){const nt=U.updateRanges;if(nt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,W,Q,T.data);else{nt.sort((xt,mt)=>xt.start-mt.start);let Ft=0;for(let xt=1;xt<nt.length;xt++){const mt=nt[Ft],Gt=nt[xt],Ut=mt.start+mt.count,At=le(Gt.start,T.width,4),qt=le(mt.start,T.width,4);Gt.start<=Ut+1&&At===qt&&le(Gt.start+Gt.count-1,T.width,4)===At?mt.count=Math.max(mt.count,Gt.start+Gt.count-mt.start):(++Ft,nt[Ft]=Gt)}nt.length=Ft+1;const St=n.getParameter(n.UNPACK_ROW_LENGTH),Ot=n.getParameter(n.UNPACK_SKIP_PIXELS),zt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let xt=0,mt=nt.length;xt<mt;xt++){const Gt=nt[xt],Ut=Math.floor(Gt.start/4),At=Math.ceil(Gt.count/4),qt=Ut%T.width,k=Math.floor(Ut/T.width),Mt=At,Et=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,qt),n.pixelStorei(n.UNPACK_SKIP_ROWS,k),e.texSubImage2D(n.TEXTURE_2D,0,qt,k,Mt,Et,W,Q,T.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,St),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ot),n.pixelStorei(n.UNPACK_SKIP_ROWS,zt)}}function rt(U,T,W){let Q=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(Q=n.TEXTURE_3D);const ut=Qt(U,T),nt=T.source;e.bindTexture(Q,U.__webglTexture,n.TEXTURE0+W);const Ft=i.get(nt);if(nt.version!==Ft.__version||ut===!0){e.activeTexture(n.TEXTURE0+W);const St=de.getPrimaries(de.workingColorSpace),Ot=T.colorSpace===ei?null:de.getPrimaries(T.colorSpace),zt=T.colorSpace===ei||St===Ot?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);let xt=_(T.image,!1,s.maxTextureSize);xt=Xt(T,xt);const mt=o.convert(T.format,T.colorSpace),Gt=o.convert(T.type);let Ut=x(T.internalFormat,mt,Gt,T.colorSpace,T.isVideoTexture);Wt(Q,T);let At;const qt=T.mipmaps,k=T.isVideoTexture!==!0,Mt=Ft.__version===void 0||ut===!0,Et=nt.dataReady,It=P(T,xt);if(T.isDepthTexture)Ut=v(T.format===Ps,T.type),Mt&&(k?e.texStorage2D(n.TEXTURE_2D,1,Ut,xt.width,xt.height):e.texImage2D(n.TEXTURE_2D,0,Ut,xt.width,xt.height,0,mt,Gt,null));else if(T.isDataTexture)if(qt.length>0){k&&Mt&&e.texStorage2D(n.TEXTURE_2D,It,Ut,qt[0].width,qt[0].height);for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,Gt,At.data):e.texImage2D(n.TEXTURE_2D,pt,Ut,At.width,At.height,0,mt,Gt,At.data);T.generateMipmaps=!1}else k?(Mt&&e.texStorage2D(n.TEXTURE_2D,It,Ut,xt.width,xt.height),Et&&ne(T,xt,mt,Gt)):e.texImage2D(n.TEXTURE_2D,0,Ut,xt.width,xt.height,0,mt,Gt,xt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){k&&Mt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,It,Ut,qt[0].width,qt[0].height,xt.depth);for(let pt=0,lt=qt.length;pt<lt;pt++)if(At=qt[pt],T.format!==bn)if(mt!==null)if(k){if(Et)if(T.layerUpdates.size>0){const Lt=tl(At.width,At.height,T.format,T.type);for(const Yt of T.layerUpdates){const fe=At.data.subarray(Yt*Lt/At.data.BYTES_PER_ELEMENT,(Yt+1)*Lt/At.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,Yt,At.width,At.height,1,mt,fe)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,0,At.width,At.height,xt.depth,mt,At.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,pt,Ut,At.width,At.height,xt.depth,0,At.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?Et&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,0,At.width,At.height,xt.depth,mt,Gt,At.data):e.texImage3D(n.TEXTURE_2D_ARRAY,pt,Ut,At.width,At.height,xt.depth,0,mt,Gt,At.data)}else{k&&Mt&&e.texStorage2D(n.TEXTURE_2D,It,Ut,qt[0].width,qt[0].height);for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],T.format!==bn?mt!==null?k?Et&&e.compressedTexSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,At.data):e.compressedTexImage2D(n.TEXTURE_2D,pt,Ut,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,Gt,At.data):e.texImage2D(n.TEXTURE_2D,pt,Ut,At.width,At.height,0,mt,Gt,At.data)}else if(T.isDataArrayTexture)if(k){if(Mt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,It,Ut,xt.width,xt.height,xt.depth),Et)if(T.layerUpdates.size>0){const pt=tl(xt.width,xt.height,T.format,T.type);for(const lt of T.layerUpdates){const Lt=xt.data.subarray(lt*pt/xt.data.BYTES_PER_ELEMENT,(lt+1)*pt/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,xt.width,xt.height,1,mt,Gt,Lt)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,mt,Gt,xt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Ut,xt.width,xt.height,xt.depth,0,mt,Gt,xt.data);else if(T.isData3DTexture)k?(Mt&&e.texStorage3D(n.TEXTURE_3D,It,Ut,xt.width,xt.height,xt.depth),Et&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,mt,Gt,xt.data)):e.texImage3D(n.TEXTURE_3D,0,Ut,xt.width,xt.height,xt.depth,0,mt,Gt,xt.data);else if(T.isFramebufferTexture){if(Mt)if(k)e.texStorage2D(n.TEXTURE_2D,It,Ut,xt.width,xt.height);else{let pt=xt.width,lt=xt.height;for(let Lt=0;Lt<It;Lt++)e.texImage2D(n.TEXTURE_2D,Lt,Ut,pt,lt,0,mt,Gt,null),pt>>=1,lt>>=1}}else if(qt.length>0){if(k&&Mt){const pt=Zt(qt[0]);e.texStorage2D(n.TEXTURE_2D,It,Ut,pt.width,pt.height)}for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,mt,Gt,At):e.texImage2D(n.TEXTURE_2D,pt,Ut,mt,Gt,At);T.generateMipmaps=!1}else if(k){if(Mt){const pt=Zt(xt);e.texStorage2D(n.TEXTURE_2D,It,Ut,pt.width,pt.height)}Et&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,mt,Gt,xt)}else e.texImage2D(n.TEXTURE_2D,0,Ut,mt,Gt,xt);m(T)&&p(Q),Ft.__version=nt.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function dt(U,T,W){if(T.image.length!==6)return;const Q=Qt(U,T),ut=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+W);const nt=i.get(ut);if(ut.version!==nt.__version||Q===!0){e.activeTexture(n.TEXTURE0+W);const Ft=de.getPrimaries(de.workingColorSpace),St=T.colorSpace===ei?null:de.getPrimaries(T.colorSpace),Ot=T.colorSpace===ei||Ft===St?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);const zt=T.isCompressedTexture||T.image[0].isCompressedTexture,xt=T.image[0]&&T.image[0].isDataTexture,mt=[];for(let lt=0;lt<6;lt++)!zt&&!xt?mt[lt]=_(T.image[lt],!0,s.maxCubemapSize):mt[lt]=xt?T.image[lt].image:T.image[lt],mt[lt]=Xt(T,mt[lt]);const Gt=mt[0],Ut=o.convert(T.format,T.colorSpace),At=o.convert(T.type),qt=x(T.internalFormat,Ut,At,T.colorSpace),k=T.isVideoTexture!==!0,Mt=nt.__version===void 0||Q===!0,Et=ut.dataReady;let It=P(T,Gt);Wt(n.TEXTURE_CUBE_MAP,T);let pt;if(zt){k&&Mt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,It,qt,Gt.width,Gt.height);for(let lt=0;lt<6;lt++){pt=mt[lt].mipmaps;for(let Lt=0;Lt<pt.length;Lt++){const Yt=pt[Lt];T.format!==bn?Ut!==null?k?Et&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,0,0,Yt.width,Yt.height,Ut,Yt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,qt,Yt.width,Yt.height,0,Yt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,0,0,Yt.width,Yt.height,Ut,At,Yt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt,qt,Yt.width,Yt.height,0,Ut,At,Yt.data)}}}else{if(pt=T.mipmaps,k&&Mt){pt.length>0&&It++;const lt=Zt(mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,It,qt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(xt){k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,mt[lt].width,mt[lt].height,Ut,At,mt[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,mt[lt].width,mt[lt].height,0,Ut,At,mt[lt].data);for(let Lt=0;Lt<pt.length;Lt++){const fe=pt[Lt].image[lt].image;k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,0,0,fe.width,fe.height,Ut,At,fe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,qt,fe.width,fe.height,0,Ut,At,fe.data)}}else{k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Ut,At,mt[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,Ut,At,mt[lt]);for(let Lt=0;Lt<pt.length;Lt++){const Yt=pt[Lt];k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,0,0,Ut,At,Yt.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Lt+1,qt,Ut,At,Yt.image[lt])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),nt.__version=ut.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function Rt(U,T,W,Q,ut,nt){const Ft=o.convert(W.format,W.colorSpace),St=o.convert(W.type),Ot=x(W.internalFormat,Ft,St,W.colorSpace),zt=i.get(T),xt=i.get(W);if(xt.__renderTarget=T,!zt.__hasExternalTextures){const mt=Math.max(1,T.width>>nt),Gt=Math.max(1,T.height>>nt);ut===n.TEXTURE_3D||ut===n.TEXTURE_2D_ARRAY?e.texImage3D(ut,nt,Ot,mt,Gt,T.depth,0,Ft,St,null):e.texImage2D(ut,nt,Ot,mt,Gt,0,Ft,St,null)}e.bindFramebuffer(n.FRAMEBUFFER,U),vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,ut,xt.__webglTexture,0,bt(T)):(ut===n.TEXTURE_2D||ut>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ut<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,ut,xt.__webglTexture,nt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Vt(U,T,W){if(n.bindRenderbuffer(n.RENDERBUFFER,U),T.depthBuffer){const Q=T.depthTexture,ut=Q&&Q.isDepthTexture?Q.type:null,nt=v(T.stencilBuffer,ut),Ft=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,St=bt(T);vt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,St,nt,T.width,T.height):W?n.renderbufferStorageMultisample(n.RENDERBUFFER,St,nt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,nt,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ft,n.RENDERBUFFER,U)}else{const Q=T.textures;for(let ut=0;ut<Q.length;ut++){const nt=Q[ut],Ft=o.convert(nt.format,nt.colorSpace),St=o.convert(nt.type),Ot=x(nt.internalFormat,Ft,St,nt.colorSpace),zt=bt(T);W&&vt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,zt,Ot,T.width,T.height):vt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,zt,Ot,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Ot,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Nt(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(T.depthTexture);Q.__renderTarget=T,(!Q.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),X(T.depthTexture,0);const ut=Q.__webglTexture,nt=bt(T);if(T.depthTexture.format===Cs)vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0);else if(T.depthTexture.format===Ps)vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0,nt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0);else throw new Error("Unknown depthTexture format")}function te(U){const T=i.get(U),W=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const Q=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),Q){const ut=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,Q.removeEventListener("dispose",ut)};Q.addEventListener("dispose",ut),T.__depthDisposeCallback=ut}T.__boundDepthTexture=Q}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");const Q=U.texture.mipmaps;Q&&Q.length>0?Nt(T.__webglFramebuffer[0],U):Nt(T.__webglFramebuffer,U)}else if(W){T.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[Q]),T.__webglDepthbuffer[Q]===void 0)T.__webglDepthbuffer[Q]=n.createRenderbuffer(),Vt(T.__webglDepthbuffer[Q],U,!1);else{const ut=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=T.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,nt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,nt)}}else{const Q=U.texture.mipmaps;if(Q&&Q.length>0?e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),Vt(T.__webglDepthbuffer,U,!1);else{const ut=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,nt=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,nt),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,nt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function me(U,T,W){const Q=i.get(U);T!==void 0&&Rt(Q.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),W!==void 0&&te(U)}function O(U){const T=U.texture,W=i.get(U),Q=i.get(T);U.addEventListener("dispose",A);const ut=U.textures,nt=U.isWebGLCubeRenderTarget===!0,Ft=ut.length>1;if(Ft||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=T.version,a.memory.textures++),nt){W.__webglFramebuffer=[];for(let St=0;St<6;St++)if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer[St]=[];for(let Ot=0;Ot<T.mipmaps.length;Ot++)W.__webglFramebuffer[St][Ot]=n.createFramebuffer()}else W.__webglFramebuffer[St]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){W.__webglFramebuffer=[];for(let St=0;St<T.mipmaps.length;St++)W.__webglFramebuffer[St]=n.createFramebuffer()}else W.__webglFramebuffer=n.createFramebuffer();if(Ft)for(let St=0,Ot=ut.length;St<Ot;St++){const zt=i.get(ut[St]);zt.__webglTexture===void 0&&(zt.__webglTexture=n.createTexture(),a.memory.textures++)}if(U.samples>0&&vt(U)===!1){W.__webglMultisampledFramebuffer=n.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let St=0;St<ut.length;St++){const Ot=ut[St];W.__webglColorRenderbuffer[St]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,W.__webglColorRenderbuffer[St]);const zt=o.convert(Ot.format,Ot.colorSpace),xt=o.convert(Ot.type),mt=x(Ot.internalFormat,zt,xt,Ot.colorSpace,U.isXRRenderTarget===!0),Gt=bt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,Gt,mt,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,W.__webglColorRenderbuffer[St])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(W.__webglDepthRenderbuffer=n.createRenderbuffer(),Vt(W.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(nt){e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),Wt(n.TEXTURE_CUBE_MAP,T);for(let St=0;St<6;St++)if(T.mipmaps&&T.mipmaps.length>0)for(let Ot=0;Ot<T.mipmaps.length;Ot++)Rt(W.__webglFramebuffer[St][Ot],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ot);else Rt(W.__webglFramebuffer[St],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);m(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let St=0,Ot=ut.length;St<Ot;St++){const zt=ut[St],xt=i.get(zt);let mt=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(mt=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(mt,xt.__webglTexture),Wt(mt,zt),Rt(W.__webglFramebuffer,U,zt,n.COLOR_ATTACHMENT0+St,mt,0),m(zt)&&p(mt)}e.unbindTexture()}else{let St=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(St=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(St,Q.__webglTexture),Wt(St,T),T.mipmaps&&T.mipmaps.length>0)for(let Ot=0;Ot<T.mipmaps.length;Ot++)Rt(W.__webglFramebuffer[Ot],U,T,n.COLOR_ATTACHMENT0,St,Ot);else Rt(W.__webglFramebuffer,U,T,n.COLOR_ATTACHMENT0,St,0);m(T)&&p(St),e.unbindTexture()}U.depthBuffer&&te(U)}function ft(U){const T=U.textures;for(let W=0,Q=T.length;W<Q;W++){const ut=T[W];if(m(ut)){const nt=w(U),Ft=i.get(ut).__webglTexture;e.bindTexture(nt,Ft),p(nt),e.unbindTexture()}}}const ht=[],ct=[];function j(U){if(U.samples>0){if(vt(U)===!1){const T=U.textures,W=U.width,Q=U.height;let ut=n.COLOR_BUFFER_BIT;const nt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ft=i.get(U),St=T.length>1;if(St)for(let zt=0;zt<T.length;zt++)e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer);const Ot=U.texture.mipmaps;Ot&&Ot.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let zt=0;zt<T.length;zt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ut|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ut|=n.STENCIL_BUFFER_BIT)),St){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[zt]);const xt=i.get(T[zt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,xt,0)}n.blitFramebuffer(0,0,W,Q,0,0,W,Q,ut,n.NEAREST),c===!0&&(ht.length=0,ct.length=0,ht.push(n.COLOR_ATTACHMENT0+zt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(ht.push(nt),ct.push(nt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ct)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),St)for(let zt=0;zt<T.length;zt++){e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[zt]);const xt=i.get(T[zt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+zt,n.TEXTURE_2D,xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const T=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function bt(U){return Math.min(s.maxSamples,U.samples)}function vt(U){const T=i.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function wt(U){const T=a.render.frame;h.get(U)!==T&&(h.set(U,T),U.update())}function Xt(U,T){const W=U.colorSpace,Q=U.format,ut=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||W!==Qi&&W!==ei&&(de.getTransfer(W)===ve?(Q!==bn||ut!==Pn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),T}function Zt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=K,this.setTexture3D=st,this.setTextureCube=J,this.rebindTextures=me,this.setupRenderTarget=O,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=j,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=Rt,this.useMultisampledRTT=vt}function ev(n,t){function e(i,s=ei){let o;const a=de.getTransfer(s);if(i===Pn)return n.UNSIGNED_BYTE;if(i===Qr)return n.UNSIGNED_SHORT_4_4_4_4;if(i===tc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===lh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===hh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===rh)return n.BYTE;if(i===ch)return n.SHORT;if(i===Ts)return n.UNSIGNED_SHORT;if(i===$r)return n.INT;if(i===wi)return n.UNSIGNED_INT;if(i===Bn)return n.FLOAT;if(i===zs)return n.HALF_FLOAT;if(i===uh)return n.ALPHA;if(i===dh)return n.RGB;if(i===bn)return n.RGBA;if(i===Cs)return n.DEPTH_COMPONENT;if(i===Ps)return n.DEPTH_STENCIL;if(i===ec)return n.RED;if(i===nc)return n.RED_INTEGER;if(i===fh)return n.RG;if(i===ic)return n.RG_INTEGER;if(i===sc)return n.RGBA_INTEGER;if(i===Eo||i===To||i===Ao||i===Co)if(a===ve)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Eo)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===To)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ao)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Co)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Eo)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===To)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ao)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Co)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===tr||i===er||i===nr||i===ir)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===tr)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===er)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===nr)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ir)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===sr||i===or||i===ar)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(i===sr||i===or)return a===ve?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===ar)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===rr||i===cr||i===lr||i===hr||i===ur||i===dr||i===fr||i===pr||i===mr||i===gr||i===vr||i===_r||i===xr||i===Mr)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(i===rr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===cr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===lr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===hr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ur)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===dr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===fr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===pr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===mr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===gr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===vr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===_r)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===xr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Mr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===yr||i===br||i===Sr)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(i===yr)return a===ve?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===br)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Sr)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wr||i===Er||i===Tr||i===Ar)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(i===wr)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Er)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Tr)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ar)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===As?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const nv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,iv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class sv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Ph(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new oi({vertexShader:nv,fragmentShader:iv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new M(new De(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class ov extends ns{constructor(t,e){super();const i=this;let s=null,o=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new sv,p={},w=e.getContextAttributes();let x=null,v=null;const P=[],E=[],A=new Tt;let C=null;const b=new nn;b.viewport=new Ee;const y=new nn;y.viewport=new Ee;const D=[b,y],F=new Ef;let B=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(rt){let dt=P[rt];return dt===void 0&&(dt=new va,P[rt]=dt),dt.getTargetRaySpace()},this.getControllerGrip=function(rt){let dt=P[rt];return dt===void 0&&(dt=new va,P[rt]=dt),dt.getGripSpace()},this.getHand=function(rt){let dt=P[rt];return dt===void 0&&(dt=new va,P[rt]=dt),dt.getHandSpace()};function X(rt){const dt=E.indexOf(rt.inputSource);if(dt===-1)return;const Rt=P[dt];Rt!==void 0&&(Rt.update(rt.inputSource,rt.frame,l||a),Rt.dispatchEvent({type:rt.type,data:rt.inputSource}))}function K(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",K),s.removeEventListener("inputsourceschange",st);for(let rt=0;rt<P.length;rt++){const dt=E[rt];dt!==null&&(E[rt]=null,P[rt].disconnect(dt))}B=null,G=null,m.reset();for(const rt in p)delete p[rt];t.setRenderTarget(x),f=null,d=null,u=null,s=null,v=null,ne.stop(),i.isPresenting=!1,t.setPixelRatio(C),t.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(rt){o=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(rt){r=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(rt){l=rt},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(rt){if(s=rt,s!==null){if(x=t.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",K),s.addEventListener("inputsourceschange",st),w.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Rt=null,Vt=null,Nt=null;w.depth&&(Nt=w.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Rt=w.stencil?Ps:Cs,Vt=w.stencil?As:wi);const te={colorFormat:e.RGBA8,depthFormat:Nt,scaleFactor:o};u=this.getBinding(),d=u.createProjectionLayer(te),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),v=new Ei(d.textureWidth,d.textureHeight,{format:bn,type:Pn,depthTexture:new Ch(d.textureWidth,d.textureHeight,Vt,void 0,void 0,void 0,void 0,void 0,void 0,Rt),stencilBuffer:w.stencil,colorSpace:t.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Rt={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:o};f=new XRWebGLLayer(s,e,Rt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Ei(f.framebufferWidth,f.framebufferHeight,{format:bn,type:Pn,colorSpace:t.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(r),ne.setContext(s),ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function st(rt){for(let dt=0;dt<rt.removed.length;dt++){const Rt=rt.removed[dt],Vt=E.indexOf(Rt);Vt>=0&&(E[Vt]=null,P[Vt].disconnect(Rt))}for(let dt=0;dt<rt.added.length;dt++){const Rt=rt.added[dt];let Vt=E.indexOf(Rt);if(Vt===-1){for(let te=0;te<P.length;te++)if(te>=E.length){E.push(Rt),Vt=te;break}else if(E[te]===null){E[te]=Rt,Vt=te;break}if(Vt===-1)break}const Nt=P[Vt];Nt&&Nt.connect(Rt)}}const J=new N,ot=new N;function Z(rt,dt,Rt){J.setFromMatrixPosition(dt.matrixWorld),ot.setFromMatrixPosition(Rt.matrixWorld);const Vt=J.distanceTo(ot),Nt=dt.projectionMatrix.elements,te=Rt.projectionMatrix.elements,me=Nt[14]/(Nt[10]-1),O=Nt[14]/(Nt[10]+1),ft=(Nt[9]+1)/Nt[5],ht=(Nt[9]-1)/Nt[5],ct=(Nt[8]-1)/Nt[0],j=(te[8]+1)/te[0],bt=me*ct,vt=me*j,wt=Vt/(-ct+j),Xt=wt*-ct;if(dt.matrixWorld.decompose(rt.position,rt.quaternion,rt.scale),rt.translateX(Xt),rt.translateZ(wt),rt.matrixWorld.compose(rt.position,rt.quaternion,rt.scale),rt.matrixWorldInverse.copy(rt.matrixWorld).invert(),Nt[10]===-1)rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse);else{const Zt=me+wt,U=O+wt,T=bt-Xt,W=vt+(Vt-Xt),Q=ft*O/U*Zt,ut=ht*O/U*Zt;rt.projectionMatrix.makePerspective(T,W,Q,ut,Zt,U),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert()}}function yt(rt,dt){dt===null?rt.matrixWorld.copy(rt.matrix):rt.matrixWorld.multiplyMatrices(dt.matrixWorld,rt.matrix),rt.matrixWorldInverse.copy(rt.matrixWorld).invert()}this.updateCamera=function(rt){if(s===null)return;let dt=rt.near,Rt=rt.far;m.texture!==null&&(m.depthNear>0&&(dt=m.depthNear),m.depthFar>0&&(Rt=m.depthFar)),F.near=y.near=b.near=dt,F.far=y.far=b.far=Rt,(B!==F.near||G!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),B=F.near,G=F.far),F.layers.mask=rt.layers.mask|6,b.layers.mask=F.layers.mask&3,y.layers.mask=F.layers.mask&5;const Vt=rt.parent,Nt=F.cameras;yt(F,Vt);for(let te=0;te<Nt.length;te++)yt(Nt[te],Vt);Nt.length===2?Z(F,b,y):F.projectionMatrix.copy(b.projectionMatrix),Wt(rt,F,Vt)};function Wt(rt,dt,Rt){Rt===null?rt.matrix.copy(dt.matrixWorld):(rt.matrix.copy(Rt.matrixWorld),rt.matrix.invert(),rt.matrix.multiply(dt.matrixWorld)),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.updateMatrixWorld(!0),rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse),rt.isPerspectiveCamera&&(rt.fov=Rs*2*Math.atan(1/rt.projectionMatrix.elements[5]),rt.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(rt){c=rt,d!==null&&(d.fixedFoveation=rt),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=rt)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(rt){return p[rt]};let Qt=null;function le(rt,dt){if(h=dt.getViewerPose(l||a),g=dt,h!==null){const Rt=h.views;f!==null&&(t.setRenderTargetFramebuffer(v,f.framebuffer),t.setRenderTarget(v));let Vt=!1;Rt.length!==F.cameras.length&&(F.cameras.length=0,Vt=!0);for(let O=0;O<Rt.length;O++){const ft=Rt[O];let ht=null;if(f!==null)ht=f.getViewport(ft);else{const j=u.getViewSubImage(d,ft);ht=j.viewport,O===0&&(t.setRenderTargetTextures(v,j.colorTexture,j.depthStencilTexture),t.setRenderTarget(v))}let ct=D[O];ct===void 0&&(ct=new nn,ct.layers.enable(O),ct.viewport=new Ee,D[O]=ct),ct.matrix.fromArray(ft.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(ft.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(ht.x,ht.y,ht.width,ht.height),O===0&&(F.matrix.copy(ct.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Vt===!0&&F.cameras.push(ct)}const Nt=s.enabledFeatures;if(Nt&&Nt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=i.getBinding();const O=u.getDepthInformation(Rt[0]);O&&O.isValid&&O.texture&&m.init(O,s.renderState)}if(Nt&&Nt.includes("camera-access")&&_){t.state.unbindTexture(),u=i.getBinding();for(let O=0;O<Rt.length;O++){const ft=Rt[O].camera;if(ft){let ht=p[ft];ht||(ht=new Ph,p[ft]=ht);const ct=u.getCameraImage(ft);ht.sourceTexture=ct}}}}for(let Rt=0;Rt<P.length;Rt++){const Vt=E[Rt],Nt=P[Rt];Vt!==null&&Nt!==void 0&&Nt.update(Vt,dt,l||a)}Qt&&Qt(rt,dt),dt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:dt}),g=null}const ne=new Hh;ne.setAnimationLoop(le),this.setAnimationLoop=function(rt){Qt=rt},this.dispose=function(){}}}const mi=new Wn,av=new Se;function rv(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Sh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,w,x,v){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,v)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),_(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,w,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===je&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===je&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const w=t.get(p),x=w.envMap,v=w.envMapRotation;x&&(m.envMap.value=x,mi.copy(v),mi.x*=-1,mi.y*=-1,mi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),m.envMapRotation.value.setFromMatrix4(av.makeRotationFromEuler(mi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,w,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*w,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,w){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===je&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const w=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function cv(n,t,e,i){let s={},o={},a=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(w,x){const v=x.program;i.uniformBlockBinding(w,v)}function l(w,x){let v=s[w.id];v===void 0&&(g(w),v=h(w),s[w.id]=v,w.addEventListener("dispose",m));const P=x.program;i.updateUBOMapping(w,P);const E=t.render.frame;o[w.id]!==E&&(d(w),o[w.id]=E)}function h(w){const x=u();w.__bindingPointIndex=x;const v=n.createBuffer(),P=w.__size,E=w.usage;return n.bindBuffer(n.UNIFORM_BUFFER,v),n.bufferData(n.UNIFORM_BUFFER,P,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,v),v}function u(){for(let w=0;w<r;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const x=s[w.id],v=w.uniforms,P=w.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let E=0,A=v.length;E<A;E++){const C=Array.isArray(v[E])?v[E]:[v[E]];for(let b=0,y=C.length;b<y;b++){const D=C[b];if(f(D,E,b,P)===!0){const F=D.__offset,B=Array.isArray(D.value)?D.value:[D.value];let G=0;for(let X=0;X<B.length;X++){const K=B[X],st=_(K);typeof K=="number"||typeof K=="boolean"?(D.__data[0]=K,n.bufferSubData(n.UNIFORM_BUFFER,F+G,D.__data)):K.isMatrix3?(D.__data[0]=K.elements[0],D.__data[1]=K.elements[1],D.__data[2]=K.elements[2],D.__data[3]=0,D.__data[4]=K.elements[3],D.__data[5]=K.elements[4],D.__data[6]=K.elements[5],D.__data[7]=0,D.__data[8]=K.elements[6],D.__data[9]=K.elements[7],D.__data[10]=K.elements[8],D.__data[11]=0):(K.toArray(D.__data,G),G+=st.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(w,x,v,P){const E=w.value,A=x+"_"+v;if(P[A]===void 0)return typeof E=="number"||typeof E=="boolean"?P[A]=E:P[A]=E.clone(),!0;{const C=P[A];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return P[A]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function g(w){const x=w.uniforms;let v=0;const P=16;for(let A=0,C=x.length;A<C;A++){const b=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,D=b.length;y<D;y++){const F=b[y],B=Array.isArray(F.value)?F.value:[F.value];for(let G=0,X=B.length;G<X;G++){const K=B[G],st=_(K),J=v%P,ot=J%st.boundary,Z=J+ot;v+=ot,Z!==0&&P-Z<st.storage&&(v+=P-Z),F.__data=new Float32Array(st.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=v,v+=st.storage}}}const E=v%P;return E>0&&(v+=P-E),w.__size=v,w.__cache={},this}function _(w){const x={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(x.boundary=4,x.storage=4):w.isVector2?(x.boundary=8,x.storage=8):w.isVector3||w.isColor?(x.boundary=16,x.storage=12):w.isVector4?(x.boundary=16,x.storage=16):w.isMatrix3?(x.boundary=48,x.storage=48):w.isMatrix4?(x.boundary=64,x.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),x}function m(w){const x=w.target;x.removeEventListener("dispose",m);const v=a.indexOf(x.__bindingPointIndex);a.splice(v,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete o[x.id]}function p(){for(const w in s)n.deleteBuffer(s[w]);a=[],s={},o={}}return{bind:c,update:l,dispose:p}}class Xh{constructor(t={}){const{canvas:e=cd(),context:i=null,depth:s=!0,stencil:o=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const w=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=si,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const v=this;let P=!1;this._outputColorSpace=en;let E=0,A=0,C=null,b=-1,y=null;const D=new Ee,F=new Ee;let B=null;const G=new oe(0);let X=0,K=e.width,st=e.height,J=1,ot=null,Z=null;const yt=new Ee(0,0,K,st),Wt=new Ee(0,0,K,st);let Qt=!1;const le=new cc;let ne=!1,rt=!1;const dt=new Se,Rt=new N,Vt=new Ee,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let te=!1;function me(){return C===null?J:1}let O=i;function ft(I,H){return e.getContext(I,H)}try{const I={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Kr}`),e.addEventListener("webglcontextlost",Et,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",pt,!1),O===null){const H="webgl2";if(O=ft(H,I),O===null)throw ft(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(I){throw console.error("THREE.WebGLRenderer: "+I.message),I}let ht,ct,j,bt,vt,wt,Xt,Zt,U,T,W,Q,ut,nt,Ft,St,Ot,zt,xt,mt,Gt,Ut,At,qt;function k(){ht=new xm(O),ht.init(),Ut=new ev(O,ht),ct=new dm(O,ht,t,Ut),j=new Qg(O,ht),ct.reversedDepthBuffer&&d&&j.buffers.depth.setReversed(!0),bt=new bm(O),vt=new kg,wt=new tv(O,ht,j,vt,ct,Ut,bt),Xt=new pm(v),Zt=new _m(v),U=new Cf(O),At=new hm(O,U),T=new Mm(O,U,bt,At),W=new wm(O,T,U,bt),xt=new Sm(O,ct,wt),St=new fm(vt),Q=new Bg(v,Xt,Zt,ht,ct,At,St),ut=new rv(v,vt),nt=new Vg,Ft=new jg(ht),zt=new lm(v,Xt,Zt,j,W,f,c),Ot=new Kg(v,W,ct),qt=new cv(O,bt,ct,j),mt=new um(O,ht,bt),Gt=new ym(O,ht,bt),bt.programs=Q.programs,v.capabilities=ct,v.extensions=ht,v.properties=vt,v.renderLists=nt,v.shadowMap=Ot,v.state=j,v.info=bt}k();const Mt=new ov(v,O);this.xr=Mt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const I=ht.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){const I=ht.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return J},this.setPixelRatio=function(I){I!==void 0&&(J=I,this.setSize(K,st,!1))},this.getSize=function(I){return I.set(K,st)},this.setSize=function(I,H,tt=!0){if(Mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=I,st=H,e.width=Math.floor(I*J),e.height=Math.floor(H*J),tt===!0&&(e.style.width=I+"px",e.style.height=H+"px"),this.setViewport(0,0,I,H)},this.getDrawingBufferSize=function(I){return I.set(K*J,st*J).floor()},this.setDrawingBufferSize=function(I,H,tt){K=I,st=H,J=tt,e.width=Math.floor(I*tt),e.height=Math.floor(H*tt),this.setViewport(0,0,I,H)},this.getCurrentViewport=function(I){return I.copy(D)},this.getViewport=function(I){return I.copy(yt)},this.setViewport=function(I,H,tt,et){I.isVector4?yt.set(I.x,I.y,I.z,I.w):yt.set(I,H,tt,et),j.viewport(D.copy(yt).multiplyScalar(J).round())},this.getScissor=function(I){return I.copy(Wt)},this.setScissor=function(I,H,tt,et){I.isVector4?Wt.set(I.x,I.y,I.z,I.w):Wt.set(I,H,tt,et),j.scissor(F.copy(Wt).multiplyScalar(J).round())},this.getScissorTest=function(){return Qt},this.setScissorTest=function(I){j.setScissorTest(Qt=I)},this.setOpaqueSort=function(I){ot=I},this.setTransparentSort=function(I){Z=I},this.getClearColor=function(I){return I.copy(zt.getClearColor())},this.setClearColor=function(){zt.setClearColor(...arguments)},this.getClearAlpha=function(){return zt.getClearAlpha()},this.setClearAlpha=function(){zt.setClearAlpha(...arguments)},this.clear=function(I=!0,H=!0,tt=!0){let et=0;if(I){let q=!1;if(C!==null){const gt=C.texture.format;q=gt===sc||gt===ic||gt===nc}if(q){const gt=C.texture.type,Ct=gt===Pn||gt===wi||gt===Ts||gt===As||gt===Qr||gt===tc,Dt=zt.getClearColor(),L=zt.getClearAlpha(),z=Dt.r,Y=Dt.g,$=Dt.b;Ct?(g[0]=z,g[1]=Y,g[2]=$,g[3]=L,O.clearBufferuiv(O.COLOR,0,g)):(_[0]=z,_[1]=Y,_[2]=$,_[3]=L,O.clearBufferiv(O.COLOR,0,_))}else et|=O.COLOR_BUFFER_BIT}H&&(et|=O.DEPTH_BUFFER_BIT),tt&&(et|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Et,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",pt,!1),zt.dispose(),nt.dispose(),Ft.dispose(),vt.dispose(),Xt.dispose(),Zt.dispose(),W.dispose(),At.dispose(),qt.dispose(),Q.dispose(),Mt.dispose(),Mt.removeEventListener("sessionstart",Ze),Mt.removeEventListener("sessionend",Hs),hn.stop()};function Et(I){I.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const I=bt.autoReset,H=Ot.enabled,tt=Ot.autoUpdate,et=Ot.needsUpdate,q=Ot.type;k(),bt.autoReset=I,Ot.enabled=H,Ot.autoUpdate=tt,Ot.needsUpdate=et,Ot.type=q}function pt(I){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function lt(I){const H=I.target;H.removeEventListener("dispose",lt),Lt(H)}function Lt(I){Yt(I),vt.remove(I)}function Yt(I){const H=vt.get(I).programs;H!==void 0&&(H.forEach(function(tt){Q.releaseProgram(tt)}),I.isShaderMaterial&&Q.releaseShaderCache(I))}this.renderBufferDirect=function(I,H,tt,et,q,gt){H===null&&(H=Nt);const Ct=q.isMesh&&q.matrixWorld.determinant()<0,Dt=Ws(I,H,tt,et,q);j.setMaterial(et,Ct);let L=tt.index,z=1;if(et.wireframe===!0){if(L=T.getWireframeAttribute(tt),L===void 0)return;z=2}const Y=tt.drawRange,$=tt.attributes.position;let _t=Y.start*z,kt=(Y.start+Y.count)*z;gt!==null&&(_t=Math.max(_t,gt.start*z),kt=Math.min(kt,(gt.start+gt.count)*z)),L!==null?(_t=Math.max(_t,0),kt=Math.min(kt,L.count)):$!=null&&(_t=Math.max(_t,0),kt=Math.min(kt,$.count));const ie=kt-_t;if(ie<0||ie===1/0)return;At.setup(q,et,Dt,tt,L);let jt,Jt=mt;if(L!==null&&(jt=U.get(L),Jt=Gt,Jt.setIndex(jt)),q.isMesh)et.wireframe===!0?(j.setLineWidth(et.wireframeLinewidth*me()),Jt.setMode(O.LINES)):Jt.setMode(O.TRIANGLES);else if(q.isLine){let Ht=et.linewidth;Ht===void 0&&(Ht=1),j.setLineWidth(Ht*me()),q.isLineSegments?Jt.setMode(O.LINES):q.isLineLoop?Jt.setMode(O.LINE_LOOP):Jt.setMode(O.LINE_STRIP)}else q.isPoints?Jt.setMode(O.POINTS):q.isSprite&&Jt.setMode(O.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)Is("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),Jt.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(ht.get("WEBGL_multi_draw"))Jt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const Ht=q._multiDrawStarts,xe=q._multiDrawCounts,re=q._multiDrawCount,Ie=L?U.get(L).bytesPerElement:1,jn=vt.get(et).currentProgram.getUniforms();for(let ke=0;ke<re;ke++)jn.setValue(O,"_gl_DrawID",ke),Jt.render(Ht[ke]/Ie,xe[ke])}else if(q.isInstancedMesh)Jt.renderInstances(_t,ie,q.count);else if(tt.isInstancedBufferGeometry){const Ht=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,xe=Math.min(tt.instanceCount,Ht);Jt.renderInstances(_t,ie,xe)}else Jt.render(_t,ie)};function fe(I,H,tt){I.transparent===!0&&I.side===xn&&I.forceSinglePass===!1?(I.side=je,I.needsUpdate=!0,Yn(I,H,tt),I.side=qn,I.needsUpdate=!0,Yn(I,H,tt),I.side=xn):Yn(I,H,tt)}this.compile=function(I,H,tt=null){tt===null&&(tt=I),p=Ft.get(tt),p.init(H),x.push(p),tt.traverseVisible(function(q){q.isLight&&q.layers.test(H.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),I!==tt&&I.traverseVisible(function(q){q.isLight&&q.layers.test(H.layers)&&(p.pushLight(q),q.castShadow&&p.pushShadow(q))}),p.setupLights();const et=new Set;return I.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const gt=q.material;if(gt)if(Array.isArray(gt))for(let Ct=0;Ct<gt.length;Ct++){const Dt=gt[Ct];fe(Dt,tt,q),et.add(Dt)}else fe(gt,tt,q),et.add(gt)}),p=x.pop(),et},this.compileAsync=function(I,H,tt=null){const et=this.compile(I,H,tt);return new Promise(q=>{function gt(){if(et.forEach(function(Ct){vt.get(Ct).currentProgram.isReady()&&et.delete(Ct)}),et.size===0){q(I);return}setTimeout(gt,10)}ht.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let ae=null;function sn(I){ae&&ae(I)}function Ze(){hn.stop()}function Hs(){hn.start()}const hn=new Hh;hn.setAnimationLoop(sn),typeof self<"u"&&hn.setContext(self),this.setAnimationLoop=function(I){ae=I,Mt.setAnimationLoop(I),I===null?hn.stop():hn.start()},Mt.addEventListener("sessionstart",Ze),Mt.addEventListener("sessionend",Hs),this.render=function(I,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),Mt.enabled===!0&&Mt.isPresenting===!0&&(Mt.cameraAutoUpdate===!0&&Mt.updateCamera(H),H=Mt.getCamera()),I.isScene===!0&&I.onBeforeRender(v,I,H,C),p=Ft.get(I,x.length),p.init(H),x.push(p),dt.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),le.setFromProjectionMatrix(dt,Tn,H.reversedDepth),rt=this.localClippingEnabled,ne=St.init(this.clippingPlanes,rt),m=nt.get(I,w.length),m.init(),w.push(m),Mt.enabled===!0&&Mt.isPresenting===!0){const gt=v.xr.getDepthSensingMesh();gt!==null&&rs(gt,H,-1/0,v.sortObjects)}rs(I,H,0,v.sortObjects),m.finish(),v.sortObjects===!0&&m.sort(ot,Z),te=Mt.enabled===!1||Mt.isPresenting===!1||Mt.hasDepthSensing()===!1,te&&zt.addToRenderList(m,I),this.info.render.frame++,ne===!0&&St.beginShadows();const tt=p.state.shadowsArray;Ot.render(tt,I,H),ne===!0&&St.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=m.opaque,q=m.transmissive;if(p.setupLights(),H.isArrayCamera){const gt=H.cameras;if(q.length>0)for(let Ct=0,Dt=gt.length;Ct<Dt;Ct++){const L=gt[Ct];Vs(et,q,I,L)}te&&zt.render(I);for(let Ct=0,Dt=gt.length;Ct<Dt;Ct++){const L=gt[Ct];ri(m,I,L,L.viewport)}}else q.length>0&&Vs(et,q,I,H),te&&zt.render(I),ri(m,I,H);C!==null&&A===0&&(wt.updateMultisampleRenderTarget(C),wt.updateRenderTargetMipmap(C)),I.isScene===!0&&I.onAfterRender(v,I,H),At.resetDefaultState(),b=-1,y=null,x.pop(),x.length>0?(p=x[x.length-1],ne===!0&&St.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function rs(I,H,tt,et){if(I.visible===!1)return;if(I.layers.test(H.layers)){if(I.isGroup)tt=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(H);else if(I.isLight)p.pushLight(I),I.castShadow&&p.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||le.intersectsSprite(I)){et&&Vt.setFromMatrixPosition(I.matrixWorld).applyMatrix4(dt);const Ct=W.update(I),Dt=I.material;Dt.visible&&m.push(I,Ct,Dt,tt,Vt.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||le.intersectsObject(I))){const Ct=W.update(I),Dt=I.material;if(et&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),Vt.copy(I.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Vt.copy(Ct.boundingSphere.center)),Vt.applyMatrix4(I.matrixWorld).applyMatrix4(dt)),Array.isArray(Dt)){const L=Ct.groups;for(let z=0,Y=L.length;z<Y;z++){const $=L[z],_t=Dt[$.materialIndex];_t&&_t.visible&&m.push(I,Ct,_t,tt,Vt.z,$)}}else Dt.visible&&m.push(I,Ct,Dt,tt,Vt.z,null)}}const gt=I.children;for(let Ct=0,Dt=gt.length;Ct<Dt;Ct++)rs(gt[Ct],H,tt,et)}function ri(I,H,tt,et){const q=I.opaque,gt=I.transmissive,Ct=I.transparent;p.setupLightsView(tt),ne===!0&&St.setGlobalState(v.clippingPlanes,tt),et&&j.viewport(D.copy(et)),q.length>0&&Xn(q,H,tt),gt.length>0&&Xn(gt,H,tt),Ct.length>0&&Xn(Ct,H,tt),j.buffers.depth.setTest(!0),j.buffers.depth.setMask(!0),j.buffers.color.setMask(!0),j.setPolygonOffset(!1)}function Vs(I,H,tt,et){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[et.id]===void 0&&(p.state.transmissionRenderTarget[et.id]=new Ei(1,1,{generateMipmaps:!0,type:ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float")?zs:Pn,minFilter:bi,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const gt=p.state.transmissionRenderTarget[et.id],Ct=et.viewport||D;gt.setSize(Ct.z*v.transmissionResolutionScale,Ct.w*v.transmissionResolutionScale);const Dt=v.getRenderTarget(),L=v.getActiveCubeFace(),z=v.getActiveMipmapLevel();v.setRenderTarget(gt),v.getClearColor(G),X=v.getClearAlpha(),X<1&&v.setClearColor(16777215,.5),v.clear(),te&&zt.render(tt);const Y=v.toneMapping;v.toneMapping=si;const $=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),p.setupLightsView(et),ne===!0&&St.setGlobalState(v.clippingPlanes,et),Xn(I,tt,et),wt.updateMultisampleRenderTarget(gt),wt.updateRenderTargetMipmap(gt),ht.has("WEBGL_multisampled_render_to_texture")===!1){let _t=!1;for(let kt=0,ie=H.length;kt<ie;kt++){const jt=H[kt],Jt=jt.object,Ht=jt.geometry,xe=jt.material,re=jt.group;if(xe.side===xn&&Jt.layers.test(et.layers)){const Ie=xe.side;xe.side=je,xe.needsUpdate=!0,cs(Jt,tt,et,Ht,xe,re),xe.side=Ie,xe.needsUpdate=!0,_t=!0}}_t===!0&&(wt.updateMultisampleRenderTarget(gt),wt.updateRenderTargetMipmap(gt))}v.setRenderTarget(Dt,L,z),v.setClearColor(G,X),$!==void 0&&(et.viewport=$),v.toneMapping=Y}function Xn(I,H,tt){const et=H.isScene===!0?H.overrideMaterial:null;for(let q=0,gt=I.length;q<gt;q++){const Ct=I[q],Dt=Ct.object,L=Ct.geometry,z=Ct.group;let Y=Ct.material;Y.allowOverride===!0&&et!==null&&(Y=et),Dt.layers.test(tt.layers)&&cs(Dt,H,tt,L,Y,z)}}function cs(I,H,tt,et,q,gt){I.onBeforeRender(v,H,tt,et,q,gt),I.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),q.onBeforeRender(v,H,tt,et,I,gt),q.transparent===!0&&q.side===xn&&q.forceSinglePass===!1?(q.side=je,q.needsUpdate=!0,v.renderBufferDirect(tt,H,et,q,I,gt),q.side=qn,q.needsUpdate=!0,v.renderBufferDirect(tt,H,et,q,I,gt),q.side=xn):v.renderBufferDirect(tt,H,et,q,I,gt),I.onAfterRender(v,H,tt,et,q,gt)}function Yn(I,H,tt){H.isScene!==!0&&(H=Nt);const et=vt.get(I),q=p.state.lights,gt=p.state.shadowsArray,Ct=q.state.version,Dt=Q.getParameters(I,q.state,gt,H,tt),L=Q.getProgramCacheKey(Dt);let z=et.programs;et.environment=I.isMeshStandardMaterial?H.environment:null,et.fog=H.fog,et.envMap=(I.isMeshStandardMaterial?Zt:Xt).get(I.envMap||et.environment),et.envMapRotation=et.environment!==null&&I.envMap===null?H.environmentRotation:I.envMapRotation,z===void 0&&(I.addEventListener("dispose",lt),z=new Map,et.programs=z);let Y=z.get(L);if(Y!==void 0){if(et.currentProgram===Y&&et.lightsStateVersion===Ct)return qs(I,Dt),Y}else Dt.uniforms=Q.getUniforms(I),I.onBeforeCompile(Dt,v),Y=Q.acquireProgram(Dt,L),z.set(L,Y),et.uniforms=Dt.uniforms;const $=et.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&($.clippingPlanes=St.uniform),qs(I,Dt),et.needsLights=ls(I),et.lightsStateVersion=Ct,et.needsLights&&($.ambientLightColor.value=q.state.ambient,$.lightProbe.value=q.state.probe,$.directionalLights.value=q.state.directional,$.directionalLightShadows.value=q.state.directionalShadow,$.spotLights.value=q.state.spot,$.spotLightShadows.value=q.state.spotShadow,$.rectAreaLights.value=q.state.rectArea,$.ltc_1.value=q.state.rectAreaLTC1,$.ltc_2.value=q.state.rectAreaLTC2,$.pointLights.value=q.state.point,$.pointLightShadows.value=q.state.pointShadow,$.hemisphereLights.value=q.state.hemi,$.directionalShadowMap.value=q.state.directionalShadowMap,$.directionalShadowMatrix.value=q.state.directionalShadowMatrix,$.spotShadowMap.value=q.state.spotShadowMap,$.spotLightMatrix.value=q.state.spotLightMatrix,$.spotLightMap.value=q.state.spotLightMap,$.pointShadowMap.value=q.state.pointShadowMap,$.pointShadowMatrix.value=q.state.pointShadowMatrix),et.currentProgram=Y,et.uniformsList=null,Y}function Gs(I){if(I.uniformsList===null){const H=I.currentProgram.getUniforms();I.uniformsList=Po.seqWithValue(H.seq,I.uniforms)}return I.uniformsList}function qs(I,H){const tt=vt.get(I);tt.outputColorSpace=H.outputColorSpace,tt.batching=H.batching,tt.batchingColor=H.batchingColor,tt.instancing=H.instancing,tt.instancingColor=H.instancingColor,tt.instancingMorph=H.instancingMorph,tt.skinning=H.skinning,tt.morphTargets=H.morphTargets,tt.morphNormals=H.morphNormals,tt.morphColors=H.morphColors,tt.morphTargetsCount=H.morphTargetsCount,tt.numClippingPlanes=H.numClippingPlanes,tt.numIntersection=H.numClipIntersection,tt.vertexAlphas=H.vertexAlphas,tt.vertexTangents=H.vertexTangents,tt.toneMapping=H.toneMapping}function Ws(I,H,tt,et,q){H.isScene!==!0&&(H=Nt),wt.resetTextureUnits();const gt=H.fog,Ct=et.isMeshStandardMaterial?H.environment:null,Dt=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Qi,L=(et.isMeshStandardMaterial?Zt:Xt).get(et.envMap||Ct),z=et.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,Y=!!tt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),$=!!tt.morphAttributes.position,_t=!!tt.morphAttributes.normal,kt=!!tt.morphAttributes.color;let ie=si;et.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(ie=v.toneMapping);const jt=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,Jt=jt!==void 0?jt.length:0,Ht=vt.get(et),xe=p.state.lights;if(ne===!0&&(rt===!0||I!==y)){const He=I===y&&et.id===b;St.setState(et,I,He)}let re=!1;et.version===Ht.__version?(Ht.needsLights&&Ht.lightsStateVersion!==xe.state.version||Ht.outputColorSpace!==Dt||q.isBatchedMesh&&Ht.batching===!1||!q.isBatchedMesh&&Ht.batching===!0||q.isBatchedMesh&&Ht.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&Ht.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&Ht.instancing===!1||!q.isInstancedMesh&&Ht.instancing===!0||q.isSkinnedMesh&&Ht.skinning===!1||!q.isSkinnedMesh&&Ht.skinning===!0||q.isInstancedMesh&&Ht.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&Ht.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&Ht.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&Ht.instancingMorph===!1&&q.morphTexture!==null||Ht.envMap!==L||et.fog===!0&&Ht.fog!==gt||Ht.numClippingPlanes!==void 0&&(Ht.numClippingPlanes!==St.numPlanes||Ht.numIntersection!==St.numIntersection)||Ht.vertexAlphas!==z||Ht.vertexTangents!==Y||Ht.morphTargets!==$||Ht.morphNormals!==_t||Ht.morphColors!==kt||Ht.toneMapping!==ie||Ht.morphTargetsCount!==Jt)&&(re=!0):(re=!0,Ht.__version=et.version);let Ie=Ht.currentProgram;re===!0&&(Ie=Yn(et,H,q));let jn=!1,ke=!1,ci=!1;const ye=Ie.getUniforms(),on=Ht.uniforms;if(j.useProgram(Ie.program)&&(jn=!0,ke=!0,ci=!0),et.id!==b&&(b=et.id,ke=!0),jn||y!==I){j.buffers.depth.getReversed()&&I.reversedDepth!==!0&&(I._reversedDepth=!0,I.updateProjectionMatrix()),ye.setValue(O,"projectionMatrix",I.projectionMatrix),ye.setValue(O,"viewMatrix",I.matrixWorldInverse);const Ye=ye.map.cameraPosition;Ye!==void 0&&Ye.setValue(O,Rt.setFromMatrixPosition(I.matrixWorld)),ct.logarithmicDepthBuffer&&ye.setValue(O,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&ye.setValue(O,"isOrthographic",I.isOrthographicCamera===!0),y!==I&&(y=I,ke=!0,ci=!0)}if(q.isSkinnedMesh){ye.setOptional(O,q,"bindMatrix"),ye.setOptional(O,q,"bindMatrixInverse");const He=q.skeleton;He&&(He.boneTexture===null&&He.computeBoneTexture(),ye.setValue(O,"boneTexture",He.boneTexture,wt))}q.isBatchedMesh&&(ye.setOptional(O,q,"batchingTexture"),ye.setValue(O,"batchingTexture",q._matricesTexture,wt),ye.setOptional(O,q,"batchingIdTexture"),ye.setValue(O,"batchingIdTexture",q._indirectTexture,wt),ye.setOptional(O,q,"batchingColorTexture"),q._colorsTexture!==null&&ye.setValue(O,"batchingColorTexture",q._colorsTexture,wt));const an=tt.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&xt.update(q,tt,Ie),(ke||Ht.receiveShadow!==q.receiveShadow)&&(Ht.receiveShadow=q.receiveShadow,ye.setValue(O,"receiveShadow",q.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(on.envMap.value=L,on.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&H.environment!==null&&(on.envMapIntensity.value=H.environmentIntensity),ke&&(ye.setValue(O,"toneMappingExposure",v.toneMappingExposure),Ht.needsLights&&Xs(on,ci),gt&&et.fog===!0&&ut.refreshFogUniforms(on,gt),ut.refreshMaterialUniforms(on,et,J,st,p.state.transmissionRenderTarget[I.id]),Po.upload(O,Gs(Ht),on,wt)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Po.upload(O,Gs(Ht),on,wt),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&ye.setValue(O,"center",q.center),ye.setValue(O,"modelViewMatrix",q.modelViewMatrix),ye.setValue(O,"normalMatrix",q.normalMatrix),ye.setValue(O,"modelMatrix",q.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const He=et.uniformsGroups;for(let Ye=0,Zo=He.length;Ye<Zo;Ye++){const li=He[Ye];qt.update(li,Ie),qt.bind(li,Ie)}}return Ie}function Xs(I,H){I.ambientLightColor.needsUpdate=H,I.lightProbe.needsUpdate=H,I.directionalLights.needsUpdate=H,I.directionalLightShadows.needsUpdate=H,I.pointLights.needsUpdate=H,I.pointLightShadows.needsUpdate=H,I.spotLights.needsUpdate=H,I.spotLightShadows.needsUpdate=H,I.rectAreaLights.needsUpdate=H,I.hemisphereLights.needsUpdate=H}function ls(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(I,H,tt){const et=vt.get(I);et.__autoAllocateDepthBuffer=I.resolveDepthBuffer===!1,et.__autoAllocateDepthBuffer===!1&&(et.__useRenderToTexture=!1),vt.get(I.texture).__webglTexture=H,vt.get(I.depthTexture).__webglTexture=et.__autoAllocateDepthBuffer?void 0:tt,et.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(I,H){const tt=vt.get(I);tt.__webglFramebuffer=H,tt.__useDefaultFramebuffer=H===void 0};const hs=O.createFramebuffer();this.setRenderTarget=function(I,H=0,tt=0){C=I,E=H,A=tt;let et=!0,q=null,gt=!1,Ct=!1;if(I){const L=vt.get(I);if(L.__useDefaultFramebuffer!==void 0)j.bindFramebuffer(O.FRAMEBUFFER,null),et=!1;else if(L.__webglFramebuffer===void 0)wt.setupRenderTarget(I);else if(L.__hasExternalTextures)wt.rebindTextures(I,vt.get(I.texture).__webglTexture,vt.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){const $=I.depthTexture;if(L.__boundDepthTexture!==$){if($!==null&&vt.has($)&&(I.width!==$.image.width||I.height!==$.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");wt.setupDepthRenderbuffer(I)}}const z=I.texture;(z.isData3DTexture||z.isDataArrayTexture||z.isCompressedArrayTexture)&&(Ct=!0);const Y=vt.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(Y[H])?q=Y[H][tt]:q=Y[H],gt=!0):I.samples>0&&wt.useMultisampledRTT(I)===!1?q=vt.get(I).__webglMultisampledFramebuffer:Array.isArray(Y)?q=Y[tt]:q=Y,D.copy(I.viewport),F.copy(I.scissor),B=I.scissorTest}else D.copy(yt).multiplyScalar(J).floor(),F.copy(Wt).multiplyScalar(J).floor(),B=Qt;if(tt!==0&&(q=hs),j.bindFramebuffer(O.FRAMEBUFFER,q)&&et&&j.drawBuffers(I,q),j.viewport(D),j.scissor(F),j.setScissorTest(B),gt){const L=vt.get(I.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+H,L.__webglTexture,tt)}else if(Ct){const L=H;for(let z=0;z<I.textures.length;z++){const Y=vt.get(I.textures[z]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+z,Y.__webglTexture,tt,L)}}else if(I!==null&&tt!==0){const L=vt.get(I.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,L.__webglTexture,tt)}b=-1},this.readRenderTargetPixels=function(I,H,tt,et,q,gt,Ct,Dt=0){if(!(I&&I.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let L=vt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Ct!==void 0&&(L=L[Ct]),L){j.bindFramebuffer(O.FRAMEBUFFER,L);try{const z=I.textures[Dt],Y=z.format,$=z.type;if(!ct.textureFormatReadable(Y)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable($)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=I.width-et&&tt>=0&&tt<=I.height-q&&(I.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Dt),O.readPixels(H,tt,et,q,Ut.convert(Y),Ut.convert($),gt))}finally{const z=C!==null?vt.get(C).__webglFramebuffer:null;j.bindFramebuffer(O.FRAMEBUFFER,z)}}},this.readRenderTargetPixelsAsync=async function(I,H,tt,et,q,gt,Ct,Dt=0){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let L=vt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Ct!==void 0&&(L=L[Ct]),L)if(H>=0&&H<=I.width-et&&tt>=0&&tt<=I.height-q){j.bindFramebuffer(O.FRAMEBUFFER,L);const z=I.textures[Dt],Y=z.format,$=z.type;if(!ct.textureFormatReadable(Y))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable($))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const _t=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,_t),O.bufferData(O.PIXEL_PACK_BUFFER,gt.byteLength,O.STREAM_READ),I.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Dt),O.readPixels(H,tt,et,q,Ut.convert(Y),Ut.convert($),0);const kt=C!==null?vt.get(C).__webglFramebuffer:null;j.bindFramebuffer(O.FRAMEBUFFER,kt);const ie=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await ld(O,ie,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,_t),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,gt),O.deleteBuffer(_t),O.deleteSync(ie),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(I,H=null,tt=0){const et=Math.pow(2,-tt),q=Math.floor(I.image.width*et),gt=Math.floor(I.image.height*et),Ct=H!==null?H.x:0,Dt=H!==null?H.y:0;wt.setTexture2D(I,0),O.copyTexSubImage2D(O.TEXTURE_2D,tt,0,0,Ct,Dt,q,gt),j.unbindTexture()};const Ci=O.createFramebuffer(),Be=O.createFramebuffer();this.copyTextureToTexture=function(I,H,tt=null,et=null,q=0,gt=null){gt===null&&(q!==0?(Is("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),gt=q,q=0):gt=0);let Ct,Dt,L,z,Y,$,_t,kt,ie;const jt=I.isCompressedTexture?I.mipmaps[gt]:I.image;if(tt!==null)Ct=tt.max.x-tt.min.x,Dt=tt.max.y-tt.min.y,L=tt.isBox3?tt.max.z-tt.min.z:1,z=tt.min.x,Y=tt.min.y,$=tt.isBox3?tt.min.z:0;else{const an=Math.pow(2,-q);Ct=Math.floor(jt.width*an),Dt=Math.floor(jt.height*an),I.isDataArrayTexture?L=jt.depth:I.isData3DTexture?L=Math.floor(jt.depth*an):L=1,z=0,Y=0,$=0}et!==null?(_t=et.x,kt=et.y,ie=et.z):(_t=0,kt=0,ie=0);const Jt=Ut.convert(H.format),Ht=Ut.convert(H.type);let xe;H.isData3DTexture?(wt.setTexture3D(H,0),xe=O.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(wt.setTexture2DArray(H,0),xe=O.TEXTURE_2D_ARRAY):(wt.setTexture2D(H,0),xe=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,H.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,H.unpackAlignment);const re=O.getParameter(O.UNPACK_ROW_LENGTH),Ie=O.getParameter(O.UNPACK_IMAGE_HEIGHT),jn=O.getParameter(O.UNPACK_SKIP_PIXELS),ke=O.getParameter(O.UNPACK_SKIP_ROWS),ci=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,jt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,jt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,z),O.pixelStorei(O.UNPACK_SKIP_ROWS,Y),O.pixelStorei(O.UNPACK_SKIP_IMAGES,$);const ye=I.isDataArrayTexture||I.isData3DTexture,on=H.isDataArrayTexture||H.isData3DTexture;if(I.isDepthTexture){const an=vt.get(I),He=vt.get(H),Ye=vt.get(an.__renderTarget),Zo=vt.get(He.__renderTarget);j.bindFramebuffer(O.READ_FRAMEBUFFER,Ye.__webglFramebuffer),j.bindFramebuffer(O.DRAW_FRAMEBUFFER,Zo.__webglFramebuffer);for(let li=0;li<L;li++)ye&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,vt.get(I).__webglTexture,q,$+li),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,vt.get(H).__webglTexture,gt,ie+li)),O.blitFramebuffer(z,Y,Ct,Dt,_t,kt,Ct,Dt,O.DEPTH_BUFFER_BIT,O.NEAREST);j.bindFramebuffer(O.READ_FRAMEBUFFER,null),j.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(q!==0||I.isRenderTargetTexture||vt.has(I)){const an=vt.get(I),He=vt.get(H);j.bindFramebuffer(O.READ_FRAMEBUFFER,Ci),j.bindFramebuffer(O.DRAW_FRAMEBUFFER,Be);for(let Ye=0;Ye<L;Ye++)ye?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,an.__webglTexture,q,$+Ye):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,an.__webglTexture,q),on?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,He.__webglTexture,gt,ie+Ye):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,He.__webglTexture,gt),q!==0?O.blitFramebuffer(z,Y,Ct,Dt,_t,kt,Ct,Dt,O.COLOR_BUFFER_BIT,O.NEAREST):on?O.copyTexSubImage3D(xe,gt,_t,kt,ie+Ye,z,Y,Ct,Dt):O.copyTexSubImage2D(xe,gt,_t,kt,z,Y,Ct,Dt);j.bindFramebuffer(O.READ_FRAMEBUFFER,null),j.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else on?I.isDataTexture||I.isData3DTexture?O.texSubImage3D(xe,gt,_t,kt,ie,Ct,Dt,L,Jt,Ht,jt.data):H.isCompressedArrayTexture?O.compressedTexSubImage3D(xe,gt,_t,kt,ie,Ct,Dt,L,Jt,jt.data):O.texSubImage3D(xe,gt,_t,kt,ie,Ct,Dt,L,Jt,Ht,jt):I.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,gt,_t,kt,Ct,Dt,Jt,Ht,jt.data):I.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,gt,_t,kt,jt.width,jt.height,Jt,jt.data):O.texSubImage2D(O.TEXTURE_2D,gt,_t,kt,Ct,Dt,Jt,Ht,jt);O.pixelStorei(O.UNPACK_ROW_LENGTH,re),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ie),O.pixelStorei(O.UNPACK_SKIP_PIXELS,jn),O.pixelStorei(O.UNPACK_SKIP_ROWS,ke),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ci),gt===0&&H.generateMipmaps&&O.generateMipmap(xe),j.unbindTexture()},this.initRenderTarget=function(I){vt.get(I).__webglFramebuffer===void 0&&wt.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?wt.setTextureCube(I,0):I.isData3DTexture?wt.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?wt.setTexture2DArray(I,0):wt.setTexture2D(I,0),j.unbindTexture()},this.resetState=function(){E=0,A=0,C=null,j.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}class lv{camera;pitch=Le.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new N;desired=new N;aspect=1;constructor(){this.camera=new pc(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=Le.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const i=1-Math.pow(.001,t);this.focus.lerp(e,i),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,i=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*i*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*i*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,i){const s=Math.sin(this.yaw),o=Math.cos(this.yaw);return i.set(t*o-e*s,0,-t*s-e*o),i}}class hv{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};ponteiro={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(uv.has(e)||dv.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.surface.getBoundingClientRect();if(this.ponteiro.x=(t.clientX-e.left)/e.width*2-1,this.ponteiro.y=1-(t.clientY-e.top)/e.height*2,t.pointerId!==this.stickId)return;const i=60,s=Math.max(-i,Math.min(i,t.clientX-this.stickOrigin.x)),o=Math.max(-i,Math.min(i,t.clientY-this.stickOrigin.y));this.stickX=s/i,this.stickY=o/i};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};pointer(){return{x:this.ponteiro.x,y:this.ponteiro.y}}move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const i=Math.hypot(t,e);return i>1&&(t/=i,e/=i),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}tapGirar(t){this.pressed.add(t<0?"KeyQ":"KeyR")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const uv=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),dv=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF","KeyH","KeyI","Tab"]),ai=["cabeca","tronco","pernas","pes"],S={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,grassDry:11059802,dirt:12159572,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,brick:13068882,wallCream:15984595,wallMint:14085344,wallAzul:13624565,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,mesaVerde:3108695,cortica:14133098,corticaEscura:12159055,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,roupaLa:14248826,roupaLaBarra:16180168,roupaListra:4882400,roupaListraManga:15987180,roupaJeans:4151942,roupaBota:16763213,roupaBotaCano:9067050,vestidoRosa:16176088,vestidoRenda:16644080,vestidoFita:15773373,maidPreto:2828851,maidCreme:16447214,maidFita:1512988,maidLacoVermelho:12727364,moletomPreto:2500140,moletomCostura:1315864,moletomZiper:4539983,moletomForro:5461086,moletomPonteira:14276301,waRosa:15775432,waRosaForte:14250895,waEscuro:3880263,waBranco:16644853,waFivela:12170944,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578,pessego:16756838};let gi=null;function fv(){if(!gi){const n=new Uint8Array([96,166,214,255]);gi=new Ud(n,n.length,1,ec),gi.minFilter=We,gi.magFilter=We,gi.generateMipmaps=!1,gi.needsUpdate=!0}return gi}const El=new Map;function R(n,t={}){const e=`${n}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.offset??0}`,i=El.get(e);if(i)return i;const s=new zh({color:n,gradientMap:fv(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?xn:qn});return t.glow&&(s.emissive=new oe(n),s.emissiveIntensity=t.glow),t.offset&&(s.polygonOffset=!0,s.polygonOffsetFactor=-1,s.polygonOffsetUnits=-t.offset),El.set(e,s),s}const Tl=new Map;function qe(n,t=1){const e=`${n}|${t}`,i=Tl.get(e);if(i)return i;const s=new qo({color:n,transparent:t<1,opacity:t,side:xn});return Tl.set(e,s),s}const Al=new Map;function Cl(n){const t=Al.get(n);if(t)return t;const e=new Ah({color:n});return Al.set(n,e),e}function Ur(n="redonda",t=1,e=.5){const i=new at,s=2.1*t,o=new M(new it(.13*t,.2*t,s,8),R(S.trunk));if(o.position.y=s/2,i.add(o),n==="pinheiro")for(let a=0;a<3;a++){const r=(1.1-a*.26)*t,c=new M(new Xe(r,1.3*t,9),R(a===0?S.leafDark:S.leafMid));c.position.y=s*.7+a*.72*t,i.add(c)}else if(n==="palmeira"){o.scale.y=1.5,o.position.y=s*.75;for(let a=0;a<7;a++){const r=a/7*Math.PI*2,c=new M(new Bt(.75*t,8,6),R(S.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(r)*.85*t,s*1.5-.1,Math.sin(r)*.85*t),c.rotation.y=-r,c.rotation.z=-.32,i.add(c)}}else{const a=n==="florida"?S.flowerPink:S.leafMid;[[0,s+.55*t,0,1.15],[.62*t,s+.15*t,.2*t,.78],[-.5*t,s+.3*t,-.35*t,.88],[.1*t,s+1.05*t,-.3*t,.66]].forEach(([c,l,h,u],d)=>{const f=new M(new Bs(u*t,1),R(d%2===0?a:n==="florida"?S.flowerPink:S.leafLight));f.position.set(c,l,h),f.rotation.set(e*3,e*5,e*2),i.add(f)})}return i}function Ro(n=1,t=S.bush){const e=new at;for(let i=0;i<3;i++){const s=new M(new Bs(.42*n,1),R(t));s.position.set((i-1)*.36*n,.3*n+(i===1?.12:0),i%2*.18*n),e.add(s)}return e}function Nr(n=6,t=.9,e=[S.flowerPink,S.flowerYellow,16777215]){const i=new at;for(let s=0;s<n;s++){const o=s/n*Math.PI*2+s*.7,a=t*(.35+s*37%100/140),r=new M(new it(.02,.02,.3,5),R(S.leafDark));r.position.set(Math.cos(o)*a,.15,Math.sin(o)*a),i.add(r);const c=new M(new Bt(.09,8,6),R(e[s%e.length]));c.position.set(Math.cos(o)*a,.33,Math.sin(o)*a),c.scale.y=.7,i.add(c)}return i}function Mo(n=1,t=.5,e=10133670){const i=new at,s=new lc(.5*n,0),o=s.attributes.position;for(let r=0;r<o.count;r++){const c=o.getX(r),l=o.getY(r),h=o.getZ(r),u=Math.sin(Math.round(c*1e3)*12.9898+Math.round(l*1e3)*78.233+Math.round(h*1e3)*37.719+t*53.1)*43758.5453,d=1+(u-Math.floor(u)-.5)*.3;o.setXYZ(r,c*d,l*d,h*d)}s.computeVertexNormals();const a=new M(s,R(e));return a.position.y=.3*n*(.8+t*.4),a.rotation.set(t*6.28,t*4.1,t*2.2),a.scale.set(1+t*.3,.6+t*.4,1.1-t*.3),i.add(a),i}function Pl(n=1,t=S.leafMid){const e=new at,i=6;for(let s=0;s<i;s++){const o=s/i*Math.PI*2+s*.7,a=(.28+s*37%10/40)*n,r=new M(new Xe(.035*n,a,5),R(s%3===0?S.leafDark:s%3===1?t:S.grassDry));r.position.set(Math.cos(o)*.11*n,a*.45,Math.sin(o)*.11*n),r.rotation.set(Math.sin(o)*.35,0,Math.cos(o)*.35),e.add(r)}return e}function pv(n=1.2,t=7){const e=new at;for(let i=0;i<t;i++){const s=i/t*Math.PI*2+i*1.3,o=.06+i*53%10/55,a=n*(.7+i*29%10/22),r=new M(new it(.02,.028,a,5),R(i%2?S.leafDark:S.leafMid)),c=.12+i*17%10/60;if(r.position.set(Math.cos(s)*o,a/2,Math.sin(s)*o),r.rotation.set(Math.sin(s)*c,0,Math.cos(s)*c),e.add(r),i%3===0){const l=new M(new kn(.045,a*.16,4,8),R(9071162));l.position.set(Math.cos(s)*(o+Math.cos(s)*c*a*.5),a*.97,Math.sin(s)*(o+Math.sin(s)*c*a*.5)),e.add(l)}}return e}function mv(n=1,t=!0){const e=new at;for(const[i,s,o]of[[0,0,.62],[.34,.2,.44]]){const a=new M(new Bt(o*n,14,6,0,Math.PI*2,0,.5),R(S.leafLight));a.scale.y=.3,a.position.set(i*n,.03,s*n),e.add(a)}if(t){const i=new M(new Bt(.08*n,8,6),R(S.flowerYellow));i.position.set(.16*n,.14*n,.08*n),e.add(i);for(let s=0;s<5;s++){const o=s/5*Math.PI*2,a=new M(new Bt(.06*n,7,5),R(16773365));a.position.set(.16*n+Math.cos(o)*.08*n,.12*n,.08*n+Math.sin(o)*.08*n),a.scale.set(1.3,.6,1.3),e.add(a)}}return e}function gv(n=1.1,t=[S.flowerPink,S.flowerYellow,16777215,12160992],e=.5){const i=new at,s=.24,o=new M(new it(n,n*1.05,s,18,1,!0),R(S.brick,{doubleSide:!0}));o.position.y=s/2,i.add(o);const a=new M(new _e(n,.05,6,20),R(S.wallCream));a.rotation.x=Math.PI/2,a.position.y=s,i.add(a);const r=new M(new it(n*.96,n*.96,.08,18),R(S.dirt));r.position.y=s-.03,i.add(r);const c=7;for(let l=0;l<c;l++){const h=l/c*Math.PI*2+e*6.28,u=n*(.25+(l*41+e*100)%10/18),d=t[l%t.length],f=Math.cos(h)*u,g=Math.sin(h)*u,_=new M(new Bt(.2,8,6),R(S.leafDark));_.position.set(f,s+.06,g),_.scale.y=.55,i.add(_);for(let m=0;m<4;m++){const p=m/4*Math.PI*2+l,w=new M(new Bt(.075,8,6),R(d));w.position.set(f+Math.cos(p)*.12,s+.16+(m+l)%3*.05,g+Math.sin(p)*.12),w.scale.y=.8,i.add(w)}}return i}function vv(n=2.6){const t=new at,e=R(S.metalWhite),i=.26,s=new M(new it(n*1.03,n*1.06,i,20),R(S.concrete));s.position.y=i/2,t.add(s);const o=new M(new Bt(n,18,10,0,Math.PI*2,0,Math.PI/2),R(14676731,{opacity:.72,doubleSide:!0}));o.position.y=i,t.add(o);for(let h=0;h<8;h++){const u=new M(new _e(n,.045,5,20,Math.PI),e);u.rotation.set(0,h/8*Math.PI,0),u.position.y=i,t.add(u)}for(const h of[.34,.62,.85]){const u=n*Math.sqrt(Math.max(.02,1-h*h)),d=new M(new _e(u,.038,5,22),e);d.rotation.x=Math.PI/2,d.position.y=i+n*h,t.add(d)}for(const h of[0,1]){const u=new M(new _e(n,.09,6,18,Math.PI-.5),e);u.rotation.x=Math.PI/2,u.rotation.z=h?Math.PI+.25:.25,u.position.y=i+.04,t.add(u)}const a=new M(new Bt(.16,10,8),e);a.position.y=i+n,t.add(a);for(let h=0;h<6;h++){const u=h/6*Math.PI*2+.3,d=n*.62,f=new M(new it(.05,.06,d,6),R(S.metalGrey));f.position.set(Math.cos(u)*n*.84,i+d/2,Math.sin(u)*n*.84),t.add(f)}const r=Yh(S.wood);r.scale.setScalar(.72),r.position.set(0,i,-n*.35),r.rotation.y=.25,t.add(r);const c=new M(new it(.26,.2,.36,10),R(S.plantPot));c.position.set(n*.4,i+.18,n*.35),t.add(c);const l=new M(new Bs(.34,0),R(S.leafMid));return l.position.set(n*.4,i+.55,n*.35),t.add(l),t}function Yh(n=S.wood){const t=new at,e=new M(new V(1.9,.1,.55),R(n));e.position.y=.48,t.add(e);const i=new M(new V(1.9,.5,.09),R(n));i.position.set(0,.76,-.25),i.rotation.x=-.16,t.add(i);for(const s of[-1,1]){const o=new M(new V(.1,.48,.5),R(S.metalGrey));o.position.set(s*.78,.24,0),t.add(o)}return t}function Ra(n=!1){const t=new at,e=new M(new it(.07,.09,3.4,8),R(S.metalGrey));e.position.y=1.7,t.add(e);const i=new M(new Bt(.3,12,10,0,Math.PI*2,0,Math.PI*.62),R(S.metalWhite));i.position.y=3.45,i.rotation.x=Math.PI,t.add(i);const s=new M(new Bt(.2,10,8),R(n?S.gold:15263968,{glow:n?.9:0}));return s.position.y=3.32,t.add(s),t}function Rl(){const n=new at,t=new M(new it(.28,.24,.75,10),R(5208650));t.position.y=.38,n.add(t);const e=new M(new _e(.29,.04,6,14),R(S.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,n.add(e),n}function _v(){const n=new at,t=new M(new V(1.9,.1,1),R(S.wood));t.position.y=.76,n.add(t);for(const e of[-1,1]){const i=new M(new V(.1,.76,.9),R(S.woodDark));i.position.set(e*.75,.38,0),n.add(i);const s=new M(new V(1.9,.08,.34),R(S.wood));s.position.set(0,.45,e*.78),n.add(s);const o=new M(new V(1.6,.45,.08),R(S.woodDark));o.position.set(0,.22,e*.78),n.add(o)}return n}function On(n=4,t=1.1,e=S.metalGrey){const i=new at,s=Math.max(2,Math.round(n/1.2));for(let o=0;o<=s;o++){const a=new M(new it(.05,.05,t,6),R(e));a.position.set(-n/2+o/s*n,t/2,0),i.add(a)}for(const o of[t*.35,t*.8]){const a=new M(new V(n,.06,.06),R(e));a.position.y=o,i.add(a)}return i}function xv(n=S.wood,t=S.metalWhite){const e=new at,i=new M(new it(.06,.06,1.6,6),R(S.woodDark));i.position.y=.8,e.add(i);const s=new M(new V(1.1,.7,.08),R(n));s.position.y=1.5,e.add(s);const o=new M(new V(.85,.12,.02),R(t));return o.position.set(0,1.62,.05),e.add(o),e}function jh(n=1){const t=new at,e=qe(16777215,.92),i=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[s,o,a,r]of i){const c=new M(new Bt(r*n,10,8),e);c.position.set(s*n,o*n,a*n),t.add(c)}return t}function Mv(n,t,e,i){const s=new at,o=9,a=n/o,r=.35,c=1.15,l=new at;l.rotation.z=Math.PI/2;for(let d=0;d<o;d++){const f=new M(new it(t,t,a*1.02,10,1,!0,r,c),R(d%2===0?e:i,{doubleSide:!0}));f.position.y=-n/2+a*(d+.5),l.add(f)}s.add(l);const h=Math.sin(r)*t,u=Math.cos(r)*t;for(let d=0;d<o;d++){const f=new M(new Bt(a*.36,8,6),R(d%2===0?e:i));f.position.set(-n/2+a*(d+.5),h-a*.2,u),f.scale.set(1,1.15,.7),s.add(f)}return s}function Fr(n=S.fabricRed,t={}){const e=new at,i=t.tipo??"simples",s=S.wallCream,o=R(S.wood),a=R(S.woodDark),r=new M(new V(2.8,.16,1.9),a);r.position.y=.08,e.add(r);const c=new M(new V(2.35,1.7,1.4),R(s));c.position.set(0,1.01,-.05),e.add(c);for(const x of[-1,1]){const v=new M(new V(.26,1.7,.14),o);v.position.set(x*1.045,1.01,.68),e.add(v)}const l=new M(new V(2.35,.22,.14),o);l.position.set(0,1.75,.68),e.add(l);const h=new M(new V(1.82,.44,.06),R(5981750));h.position.set(0,1.42,.66),e.add(h);const u=new M(new V(2.5,.14,.78),o);u.position.set(0,1.12,.94),e.add(u);const d=new M(new it(.075,.075,2.5,10),a);d.rotation.z=Math.PI/2,d.position.set(0,1.12,1.32),e.add(d);for(const x of[-1,1]){const v=new M(new it(.05,.05,1.05,8),R(S.metalWhite));v.position.set(x*1.18,.6,1.24),e.add(v)}const f=new M(new V(2.55,.16,1.55),a);f.position.set(0,1.94,-.05),e.add(f);const g=Mv(2.5,.44,n,s);g.position.set(0,1.54,.62),e.add(g);const _=t.texto??(i==="sorvete"?"Sorvete":i==="suco"?"Sucos":""),m=new M(new V(1.75,.5,.12),R(n));m.position.set(0,2.3,-.05),e.add(m);const p=new M(new V(1.9,.62,.08),R(s));if(p.position.set(0,2.3,-.09),e.add(p),_){const x=gc(_,1.5,.34);x.position.set(0,2.3,.02),e.add(x)}if(i==="sorvete"){const x=Br(S.morango);x.scale.setScalar(2.6),x.position.set(0,2.78,-.05),e.add(x);const v=new M(new V(1.24,.16,.56),R(S.metalWhite));v.position.set(-.58,1.26,1.06),e.add(v),[S.morango,S.maracuja,S.chocolate].forEach((E,A)=>{const C=new M(new it(.15,.13,.22,10),R(S.metalWhite));C.position.set(-1+A*.36,1.29,1.06),e.add(C);const b=new M(new Bt(.14,10,8),R(E));b.position.set(-1+A*.36,1.42,1.06),b.scale.y=.8,e.add(b)});for(let E=0;E<3;E++){const A=new M(new Xe(.1,.3,10),R(14197852));A.position.set(.72,1.34+E*.07,1.04+E*.02),A.rotation.x=Math.PI,e.add(A)}}else if(i==="suco"){const x=new M(new Bt(.32,12,10),R(S.laranja));x.position.set(0,2.85,-.05),e.add(x);const v=new M(new Bt(.13,8,6),R(S.leafMid));v.position.set(.14,3.12,-.05),v.scale.set(1.5,.4,.8),v.rotation.z=.5,e.add(v),[S.laranja,S.limao].forEach((y,D)=>{const F=new M(new it(.15,.14,.42,12,1,!0),R(S.glass,{opacity:.45,doubleSide:!0}));F.position.set(-.78+D*.42,1.4,1.06),e.add(F);const B=new M(new it(.13,.12,.28,12),R(y));B.position.set(-.78+D*.42,1.33,1.06),e.add(B);const G=new M(new it(.025,.025,.12,6),R(S.metalGrey));G.position.set(-.78+D*.42,1.26,1.2),G.rotation.x=Math.PI/2,e.add(G)});const E=new M(new it(.22,.17,.12,12),R(S.plantPot));E.position.set(.42,1.25,1.06),e.add(E);const A=[[.32,1.34,1.03,S.laranja],[.52,1.34,1.08,S.limao],[.42,1.4,1.05,S.morango]];for(const[y,D,F,B]of A){const G=new M(new Bt(.1,10,8),R(B));G.position.set(y,D,F),e.add(G)}const C=new M(new it(.09,.07,.2,10),R(s));C.position.set(.95,1.29,1.06),e.add(C),[S.morango,S.limao,S.fabricBlue].forEach((y,D)=>{const F=new M(new it(.014,.014,.34,6),R(y));F.position.set(.93+D*.03,1.44,1.06-D*.02),F.rotation.z=(D-1)*.18,e.add(F)})}const w=new M(new V(.06,.62,.5),R(3551276));w.position.set(1.2,1.3,.15),e.add(w);for(let x=0;x<3;x++){const v=new M(new V(.02,.045,.3-x*.06),R(s));v.position.set(1.24,1.46-x*.16,.15),e.add(v)}return e}function Or(n=4,t=6,e=4,i=S.wallCream,s=S.roofTile,o=S.glass){const a=new at,r=new M(new V(n,t,e),R(i));r.position.y=t/2,a.add(r);const c=new M(new V(n+.3,.35,e+.3),R(s));c.position.y=t+.17,a.add(c);const l=Math.max(1,Math.floor(n/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let u=0;u<h;u++)for(let d=0;d<l;d++){const f=new M(new V(.65,.8,.06),R(o,{glow:.15})),g=-n/2+n/l*(d+.5),_=.9+t/h*u;f.position.set(g,_,e/2+.02),a.add(f);const m=f.clone();m.position.z=-e/2-.02,a.add(m)}return a}function yv(n=S.mesaVerde){const t=new at,e=2.6,i=1.4,s=.76,o=R(16054261),a=new M(new V(e,.06,i),R(n));a.position.y=s,t.add(a);for(const l of[-i/2+.05,i/2-.05,0]){const h=new M(new V(e-.02,.008,.05),o);h.position.set(0,s+.032,l),t.add(h)}for(const l of[-e/2+.04,e/2-.04]){const h=new M(new V(.05,.008,i-.02),o);h.position.set(l,s+.032,0),t.add(h)}const r=new M(new V(.03,.19,i+.16),R(16514556,{opacity:.72,doubleSide:!0}));r.position.y=s+.13,t.add(r);const c=new M(new V(.045,.035,i+.18),R(16777215));c.position.y=s+.225,t.add(c);for(const l of[-1.5599999999999998/2,(i+.16)/2]){const h=new M(new it(.022,.022,.24,8),R(S.metalGrey));h.position.set(0,s+.12,l),t.add(h)}for(const l of[-e/2+.22,e/2-.22]){for(const u of[-i/2+.18,i/2-.18]){const d=new M(new it(.035,.045,s,8),R(S.metalGrey));d.position.set(l,s/2,u),t.add(d)}const h=new M(new V(.05,.05,i-.36),R(S.metalGrey));h.position.set(l,s*.35,0),t.add(h)}return t}function Zh(){const n=new M(new Bt(.055,12,10),R(16775398,{glow:.12}));return n.castShadow=!0,n}function Bo(n=S.metalRed){const t=new at,e=new M(new it(.17,.17,.035,20),R(n));e.rotation.x=Math.PI/2,t.add(e);const i=new M(new it(.185,.185,.022,20),R(S.wood));i.rotation.x=Math.PI/2,t.add(i);const s=new M(new kn(.035,.16,4,8),R(S.woodDark));return s.position.y=-.25,t.add(s),t.traverse(o=>{const a=o;a.isMesh&&(a.castShadow=!0)}),t}function Jh(n=S.frisbee){const t=new M(new it(.28,.24,.07,20),R(n));return t.castShadow=!0,t}function Kh(n=1){const t=new at,e=R(S.heart,{glow:.35});for(const s of[-1,1]){const o=new M(new Bt(.16*n,10,8),e);o.position.set(s*.13*n,.1*n,0),t.add(o)}const i=new M(new Xe(.22*n,.34*n,10),e);return i.position.y=-.1*n,i.rotation.x=Math.PI,t.add(i),t}function Ia(n=16184040){const t=new at,e=new M(new Bt(.22,10,8),R(n));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const i=new M(new it(.06,.08,.24,8),R(n));i.position.set(0,.28,.14),t.add(i);const s=new M(new Bt(.11,10,8),R(n));s.position.set(0,.4,.16),t.add(s);const o=new M(new Xe(.05,.14,6),R(S.gold));return o.position.set(0,.39,.28),o.rotation.x=Math.PI/2,t.add(o),t}function zr(n=S.wallCream){const t=new at;t.userData.patins=!0;const e=.045,i=new M(new V(.13,.15,.26),R(n));i.position.set(0,e*2+.115,.01),t.add(i);const s=new M(new V(.125,.13,.15),R(n));s.position.set(0,e*2+.25,-.04),t.add(s);const o=new M(new V(.135,.04,.13),R(S.frisbee));o.position.set(0,e*2+.235,.02),t.add(o);const a=new M(new V(.1,.05,.28),R(S.metalGrey));a.position.set(0,e*2+.015,.01),t.add(a);for(const r of[-1,1])for(const c of[-1,1]){const l=new M(new it(e,e,.035,10),R(S.frisbee));l.rotation.z=Math.PI/2,l.position.set(r*.062,e,.01+c*.095),t.add(l)}return t}function bv(n=S.fabricBlue){const t=new at,e=7.4,i=4.4,s=2.9,o=R(S.wallCream),a=R(S.wood),r=R(S.woodDark),c=R(S.metalWhite),l=new M(new V(e+1.6,.18,i+1.4),R(S.concrete));l.position.set(.4,.09,.3),t.add(l);const h=new M(new V(e,s,.26),o);h.position.set(0,.18+s/2,-i/2),t.add(h);for(const y of[-1,1]){const D=new M(new V(.26,s,i),o);D.position.set(y*(e/2-.13),.18+s/2,0),t.add(D)}const u=new M(new V(e,.6,.3),r);u.position.set(0,.48,i/2-.1),t.add(u);const d=R(S.glass,{opacity:.5,doubleSide:!0}),f=3,g=e-.5,_=g/f-.16;for(let y=0;y<f;y++){const D=-g/2+g/f*(y+.5),F=new M(new V(_,1.75,.08),d);F.position.set(D,1.68,i/2-.1),t.add(F)}for(let y=0;y<=f;y++){const D=-g/2+g/f*y,F=new M(new V(.14,2.05,.22),c);F.position.set(D,1.68,i/2-.1),t.add(F)}const m=new M(new V(e,.18,.24),c);m.position.set(0,2.68,i/2-.1),t.add(m);for(const[y,D]of[[1.15,[S.morango,S.fabricBlue,S.gold]],[1.95,[S.maracuja,S.wallCream]]]){const F=new M(new V(e-1.2,.1,.6),a);F.position.set(0,y,i/2-.75),t.add(F),D.forEach((B,G)=>{const X=new at;for(const K of[-1,1]){const st=zr(B);st.position.x=K*.09,X.add(st)}X.scale.setScalar(.8),X.position.set((G-(D.length-1)/2)*1.5,y+.05,i/2-.75),X.rotation.y=.3,t.add(X)})}const p=new M(new V(e+1.1,.24,i+1.3),r);p.position.set(0,s+.42,.35),p.rotation.x=-.07,t.add(p);const w=new M(new V(e+1.34,.08,i+1.54),c);w.position.set(0,s+.29,.35),w.rotation.x=-.07,t.add(w);const x=new M(new V(e+1.34,.74,.22),R(n));x.position.set(0,s+.46,i/2+1.18),t.add(x);const v=gc("Patins",3.2,.46);v.position.set(0,s+.46,i/2+1.31),t.add(v);for(const y of[-1,1]){const D=new M(new it(.09,.09,s+.3,8),c);D.position.set(y*(e/2+.35),(s+.3)/2,i/2+.62),t.add(D)}const P=e/2+.95,E=new M(new V(1.15,.16,3),a);E.position.set(P,1.06,.2),t.add(E);const A=new M(new it(.08,.08,3,10),r);A.position.set(P+.55,1.06,.2),t.add(A);const C=new M(new V(.9,.9,2.8),o);C.position.set(P-.1,.6,.2),t.add(C);const b=new M(new V(1.7,.16,3.2),R(n));b.position.set(P+.1,2.35,.2),t.add(b);for(const y of[-1.2,1.5]){const D=new M(new it(.07,.07,2.35,8),c);D.position.set(P+.6,1.17,.2+y),t.add(D)}return[S.morango,S.gold].forEach((y,D)=>{const F=new at;for(const B of[-1,1]){const G=zr(y);G.position.x=B*.09,F.add(G)}F.position.set(P,1.14,-.55+D*1.4),F.rotation.y=Math.PI/2+.2,t.add(F)}),t}function Il(){const n=new at,t=new M(new V(.34,.05,.34),R(S.frisbee));t.position.y=.025,n.add(t);const e=new M(new Xe(.15,.45,10),R(S.frisbee));e.position.y=.26,n.add(e);const i=new M(new it(.1,.12,.09,10),R(16777215));return i.position.y=.28,n.add(i),n}function Sv(n,t,e=1.5){const i=new at,s=R(10475752),o=.12,a=new M(new V(n,o,t),R(4165552));a.position.y=-e,a.receiveShadow=!0,i.add(a);for(const[r,c,l,h]of[[n,o,0,-t/2],[n,o,0,t/2],[o,t,-n/2,0],[o,t,n/2,0]]){const u=new M(new V(r,e,c),s);u.position.set(l,-e/2,h),u.receiveShadow=!0,i.add(u)}for(const[r,c,l,h]of[[n+.3,.18,0,-t/2-.12],[n+.3,.18,0,t/2+.12],[.18,t+.3,-n/2-.12,0],[.18,t+.3,n/2+.12,0]]){const u=new M(new V(r,.06,c),R(4951989));u.position.set(l,.02,h),i.add(u)}return i}function wv(n,t){const e=new M(new De(n,t,12,8),new zh({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function Ll(n=S.fabricBlue){const t=new at,e=new M(new V(.68,.07,1.7),R(S.metalWhite));e.position.y=.36,t.add(e);const i=new M(new V(.6,.06,1.5),R(n));i.position.y=.42,t.add(i);const s=new M(new V(.6,.06,.7),R(n));s.position.set(0,.6,-.75),s.rotation.x=-.75,t.add(s);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new M(new it(.035,.035,.36,6),R(S.metalWhite));r.position.set(o*.3,.18,a*.72),t.add(r)}return t}function Dl(n=S.fabricRed){const t=new at,e=new M(new it(.32,.36,.12,12),R(S.concrete));e.position.y=.06,t.add(e);const i=new M(new it(.045,.045,2.4,8),R(S.wood));i.position.y=1.2,t.add(i);const s=new M(new Xe(1.15,.5,12),R(n));s.position.y=2.35,t.add(s);const o=new M(new Xe(1.17,.18,12,1,!0),R(16777215,{doubleSide:!0}));o.position.y=2.2,t.add(o);const a=new M(new Bt(.07,8,6),R(S.gold));return a.position.y=2.62,t.add(a),t}function Ev(){const n=new at;for(const t of[-.24,.24]){const e=new M(new _e(.22,.035,6,14,Math.PI),R(S.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),n.add(e);const i=new M(new it(.035,.035,1.5,8),R(S.metalGrey));i.position.set(t,.05,-.44),n.add(i)}for(let t=0;t<3;t++){const e=new M(new V(.5,.05,.1),R(S.metalGrey));e.position.set(0,-.15-t*.34,-.44),n.add(e)}return n}function La(n=S.frisbee){const t=new at,e=new M(new _e(.42,.16,10,20),R(n));e.rotation.x=Math.PI/2,t.add(e);for(let i=0;i<4;i++){const s=i/4*Math.PI*2+Math.PI/4,o=new M(new _e(.42,.165,10,6,Math.PI/5),R(16777215));o.rotation.set(Math.PI/2,0,s),t.add(o)}return t}function Tv(){const n=new at,t=new M(new it(.22,.26,.1,12),R(S.concrete));t.position.y=.05,n.add(t);const e=new M(new it(.05,.05,2.2,8),R(S.metalGrey));e.position.y=1.1,n.add(e);const i=new M(new V(.5,.07,.07),R(S.metalGrey));i.position.set(.22,2.16,0),n.add(i);const s=new M(new it(.16,.12,.1,12),R(S.metalWhite));return s.position.set(.44,2.08,0),n.add(s),n}function Av(){const n=new at,t=new M(new V(.7,.8,.7),R(S.concrete));t.position.y=.4,n.add(t);const e=new M(new V(.62,.1,2.4),R(15791350));e.position.set(0,.85,1),n.add(e);for(const i of[-.36,.36]){const s=new M(new _e(.35,.04,6,14,Math.PI),R(S.metalGrey));s.position.set(i,.9,.1),s.rotation.set(0,Math.PI/2,0),n.add(s)}return n}function Br(n=S.flowerPink){const t=new at,e=new M(new Xe(.075,.22,10),R(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const i=new M(new Bt(.085,10,8),R(n));i.position.y=.13,t.add(i);const s=new M(new Bt(.06,8,7),R(n));return s.position.set(.03,.22,-.02),t.add(s),t}function Ul(n=S.laranja){const t=new at;t.userData.suco=!0;const e=new M(new it(.088,.062,.26,12),R(n));e.position.y=.13,t.add(e);const i=new M(new it(.095,.09,.035,12),R(16645110));i.position.y=.25,t.add(i);const s=new M(new it(.066,.066,.025,12),R(16645110));s.position.y=.012,t.add(s);const o=new M(new it(.012,.012,.32,6),R(16645110));o.position.set(.04,.31,.014),o.rotation.z=-.34,t.add(o);const a=new M(new it(.052,.052,.014,10),R(S.gold));return a.position.set(-.085,.26,0),a.rotation.x=Math.PI/2,a.rotation.z=.3,t.add(a),t}function Nl(n=S.metalGrey){const t=new at,e=new M(new it(.07,.09,1.5,10),R(n));e.position.y=.75,t.add(e);const i=new M(new it(.52,.38,.42,14,1,!0),R(n));i.position.y=1,t.add(i);const s=new M(new _e(.62,.045,6,20),R(n));s.position.y=1.72,s.rotation.x=Math.PI/2,t.add(s);const o=new M(new it(.1,.1,.3,8),R(n));o.position.y=1.9,t.add(o);for(let a=0;a<10;a++){const r=a/10*Math.PI*2,c=new M(new it(.015,.015,.62,4),R(13226198));c.position.set(Math.cos(r)*.5,1.4,Math.sin(r)*.5),t.add(c)}return t}function Cv(n=S.frisbee,t=1.9,e=.62){const i=new at,s=e+.34,o=new M(new it(.06,.08,t+e,10),R(n));o.position.set(-s,(t+e)/2,0),i.add(o);const a=new M(new it(.24,.3,.12,12),R(S.metalGrey));a.position.set(-s,.06,0),i.add(a);const r=new M(new V(.36,.07,.07),R(n));r.position.set(-s+.18,t,0),i.add(r);const c=new M(new _e(e,.06,8,26),R(n));c.position.y=t,i.add(c);for(const l of[-.9,-.3,.3,.9]){const h=new M(new V(.05,.34,.02),qe(S.gold));h.position.set(Math.sin(l)*e,t-Math.cos(l)*e-.17,0),i.add(h)}return i.traverse(l=>{const h=l;h.isMesh&&(h.castShadow=!0)}),i.userData.aro=c,i}function Pv(n=S.frisbee){const t=new at,e=qe(n,.92),i=new M(new _e(.86,.075,8,28),e);i.rotation.x=-Math.PI/2,i.position.y=.08,t.add(i);const s=new M(new it(.15,.15,.07,14),e);s.position.y=.08,t.add(s);for(let a=0;a<4;a++){const r=a/4*Math.PI*2+Math.PI/4,c=new M(new V(.1,.07,.36),e);c.rotation.y=r,c.position.set(Math.sin(r)*1.3,.08,Math.cos(r)*1.3),t.add(c)}const o=new M(new V(.07,1.5,.07),e);return o.position.y=.75,t.add(o),t}function Rv(){const n=new at;for(const i of[-.8,.8]){const s=new M(new V(.12,1.5,.12),R(S.woodDark));s.position.set(i,.75,0),n.add(s)}const t=new M(new V(2,1.2,.12),R(S.wood));t.position.y=2,n.add(t);const e=new M(new V(1.8,.22,.03),R(S.frisbee));e.position.set(0,2.45,.08),n.add(e);for(const i of[-.45,.45]){const s=new M(new V(.55,.6,.03),R(2830136));s.position.set(i,1.9,.08),n.add(s)}return n}function Iv(n=4){const t=new at;for(let e=0;e<3;e++){const i=new M(new V(n,.16,.5),R(e%2===0?S.metalWhite:S.metalGrey));i.position.set(0,.25+e*.34,-e*.5),t.add(i);const s=new M(new V(n,.25+e*.34,.1),R(S.metalGrey));s.position.set(0,(.25+e*.34)/2,-e*.5-.2),t.add(s)}return t}function Lv(){const n=new at,t=new M(new V(.42,.95,.36),R(S.concrete));t.position.y=.48,n.add(t);const e=new M(new it(.17,.14,.12,12),R(S.metalWhite));e.position.set(0,1,.05),n.add(e);const i=new M(new it(.03,.03,.16,8),R(S.metalGrey));return i.position.set(0,1.12,-.06),i.rotation.x=.5,n.add(i),n}function Dv(){const n=new at,t=new M(new V(.5,.4,.34),R(4871528));t.position.y=.2,n.add(t);const e=new M(new _e(.16,.028,6,14,Math.PI),R(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,n.add(e),[S.frisbee,6271190,16767070].forEach((s,o)=>{const a=new M(new it(.2,.18,.05,16),R(s));a.position.set(.34+o*.02,.06+o*.06,.22),a.rotation.z=.12,n.add(a)}),n}function Uv(){const n=new at,t=new M(new it(.1,.14,5.5,8),R(S.metalGrey));t.position.y=2.75,n.add(t);const e=new M(new V(.9,.1,.1),R(S.metalGrey));e.position.set(.35,5.5,0),n.add(e);for(const i of[.1,.6]){const s=new M(new V(.42,.3,.22),R(3883600));s.position.set(i,5.62,0),s.rotation.z=-.35,n.add(s);const o=new M(new V(.36,.24,.03),R(16773324,{glow:.25}));o.position.set(i+.04,5.52,0),o.rotation.z=-.35,n.add(o)}return n}function Nv(){const n=new at,t=new M(new it(.05,.06,3,8),R(S.metalGrey));t.position.y=1.5,n.add(t);const e=new at;return e.position.y=2.9,[S.frisbee,16777215,S.frisbee,16777215].forEach((s,o)=>{const a=.26-o*.04,r=.22-o*.04,c=new M(new it(a,r,.3,12,1,!0),R(s,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+o*.3,e.add(c)}),n.add(e),n.userData.manga=e,n}function gc(n,t,e,i="#ffffff"){const s=document.createElement("canvas");s.width=384,s.height=Math.max(64,Math.round(384*e/t));const o=s.getContext("2d");o&&(o.clearRect(0,0,s.width,s.height),o.fillStyle=i,o.font=`bold ${Math.round(s.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(n,s.width/2,s.height/2+4));const a=new Bd(s);return a.colorSpace=en,new M(new De(t,e),new qo({map:a,transparent:!0}))}function Fl(n,t=S.fabricBlue,e="#ffffff"){const i=new at,s=new M(new it(.08,.08,2.4,8),R(S.metalGrey));s.position.y=1.2,i.add(s);const o=2.1,a=.9,r=new M(new V(o,a,.1),R(t));r.position.y=2.45,i.add(r);const c=new M(new V(o+.12,a+.12,.06),R(S.metalWhite));c.position.set(0,2.45,-.03),i.add(c);const l=gc(n,o*.86,a*.68,e);return l.position.set(0,2.45,.06),i.add(l),i}function Fv(n=4161494){const t=new at,e=8.4,i=2.6,s=2.5,o=new M(new V(e,i,s),R(n));o.position.y=1.55,t.add(o);const a=new M(new V(e-.2,.22,s-.15),R(S.metalWhite));a.position.y=2.9,t.add(a);const r=new M(new V(e+.04,.3,s+.04),R(S.metalWhite));r.position.y=.6,t.add(r);for(const h of[s/2+.02,-s/2-.02])for(let u=0;u<4;u++){const d=new M(new V(1.5,.9,.05),R(S.glass,{glow:.12}));d.position.set(-e/2+1.4+u*1.85,2.1,h),t.add(d)}for(const[h,u]of[[e/2+.02,0],[-e/2-.02,0]]){const d=new M(new V(.05,1.1,s-.5),R(S.glass,{glow:.12}));d.position.set(h,2.1,0),d.rotation.y=u,t.add(d)}const c=new M(new V(.06,1.9,1),R(2831424));c.position.set(e/2-1.6,1.2,s/2+.02),t.add(c);const l=new M(new V(1.6,.34,.05),R(2040361));l.position.set(e/2-.4,2.75,s/2+.02),t.add(l);for(const[h,u]of[[e/2-1.9,s/2],[e/2-1.9,-s/2],[-e/2+1.6,s/2],[-e/2+1.6,-s/2]]){const d=new M(new it(.55,.55,.35,14),R(2237482));d.position.set(h,.5,u),d.rotation.x=Math.PI/2,t.add(d);const f=new M(new it(.24,.24,.38,12),R(S.metalGrey));f.position.set(h,.5,u),f.rotation.x=Math.PI/2,t.add(f)}return t}function Ov(n=S.metalGrey){const t=new at;for(const o of[-1.5,1.5]){const a=new M(new it(.07,.07,2.5,8),R(n));a.position.set(o,1.25,-.6),t.add(a)}const e=new M(new V(3.6,.12,1.6),R(n));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const i=new M(new V(3.6,1.6,.08),R(S.glass,{glow:.08}));i.position.set(0,1.35,-1.15),t.add(i);const s=new M(new V(3,.1,.4),R(S.wood));s.position.set(0,.5,-.9),t.add(s);for(const o of[-1.2,1.2]){const a=new M(new V(.08,.5,.36),R(n));a.position.set(o,.25,-.9),t.add(a)}return t}function zv(n){const t=new at,e=n.headR,i=e*1.07,s=Math.PI*.54,o=e*.06,a=new M(new Bt(i,18,12,0,Math.PI*2,0,s),R(S.roupaLa));a.position.y=o,a.scale.y=1.16,t.add(a);const r=o+i*Math.cos(s)*1.16,c=i*Math.sin(s),l=new M(new it(c*1.03,c*1.03,e*.26,18),R(S.roupaLaBarra));l.position.y=r,t.add(l);const h=new M(new Bt(e*.2,10,8),R(S.roupaLaBarra));return h.position.y=o+i*1.16,t.add(h),t}function Bv(n){const t=new at,e=new M(new it(n.h*.05*n.w,n.h*.055*n.w,n.h*.08,12),R(S.roupaBotaCano));e.position.y=-n.legH+n.h*.075,t.add(e);const i=new M(new it(n.h*.058*n.w,n.h*.058*n.w,n.h*.018,12),R(S.roupaBota));return i.position.y=-n.legH+n.h*.113,t.add(i),t}function Gn(n,t,e=t){const i=new at;for(const o of[-1,1]){const a=new M(new Bt(n*.86,9,7),R(t));a.position.x=o*n*.86,a.scale.set(1.05,.72,.42),i.add(a);const r=new M(new V(n*.34,n*1.5,n*.14),R(t));r.position.set(o*n*.42,-n*.95,0),r.rotation.z=o*.32,i.add(r)}const s=new M(new Bt(n*.3,8,6),R(e));return s.scale.z=.7,i.add(s),i}function ni(n,t,e,i=.85){const s=new at,o=R(e),a=t*.6,r=Math.max(8,Math.ceil(2*Math.PI*n/(a*1.25)));for(let c=0;c<r;c++){const l=c/r*Math.PI*2,h=new M(new Bt(a,7,6),o);h.position.set(Math.sin(l)*n,0,Math.cos(l)*n*i),h.scale.set(1,.88,.34),h.rotation.y=l,s.add(h)}return s}function Ol(n,t,e,i=3){const s=new at,o=R(e),a=t/i,r=Math.hypot(n,a);for(let c=0;c<i;c++)for(const l of[-1,1]){const h=new M(new V(r,t*.07,t*.05),o);h.position.y=-t/2+a*(c+.5),h.rotation.z=l*Math.atan2(a,n),s.add(h)}return s}function $h(n,t){const e=new M(new Bt(n,12,10),R(t));return e.scale.set(1,.82,.92),e}function kv(n){const t=new at,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=.85,r=R(S.vestidoRosa),c=R(S.vestidoRenda,{doubleSide:!0}),l=R(S.vestidoFita),h=new M(new it(o*1.1,o*1.06,e*.035,18,1,!0),c);h.position.y=s+n.torsoH*.78,h.scale.z=a,t.add(h);for(const v of[-1,1]){const P=new M(new _e(e*.042*i,e*.016,6,14),c);P.position.set(v*e*.1*i,s+n.torsoH*.84,0),P.rotation.set(Math.PI/2,0,v*.3),P.scale.z=.8,t.add(P)}const u=Gn(e*.04,S.vestidoFita,S.vestidoRenda);u.position.set(0,s+n.torsoH*.62,o*.9),t.add(u);const d=new M(new it(o*1.08,o*1.08,e*.03,18,1,!0),l);d.position.y=s+n.torsoH*.16,d.scale.z=a,t.add(d);const f=Gn(e*.036,S.vestidoRosa,S.vestidoFita);f.position.set(0,s+n.torsoH*.14,o*.92),t.add(f);const g=s+n.torsoH*.1,_=s-e*.13,m=o*2,p=new M(new it(o*1.02,m*.82,g-_-e*.05,20,1,!0),r);p.position.y=(g+_+e*.05)/2,p.scale.z=a,t.add(p);const w=new M(new it(m*.78,m,e*.08,20,1,!0),r);w.position.y=_+e*.04,w.scale.z=a,t.add(w);const x=new M(new it(m*1.04,m*1.12,e*.032,20,1,!0),c);x.position.y=_,x.scale.z=a,t.add(x);for(const v of[-.9,0,.9]){const P=Gn(e*.022,S.vestidoFita,S.vestidoRenda);P.position.set(Math.sin(v)*m*.92,_+e*.055,Math.cos(v)*m*.92*a),P.rotation.y=v,t.add(P)}return t}function Hv(n){const t=new at,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=e*.1*i,c=.85,l=R(S.maidCreme),h=R(S.maidCreme,{doubleSide:!0}),u=R(S.maidFita),d=s+n.torsoH*.12,f=s-e*.14,g=o*2,_=new M(new it(o*1.04,g,d-f,20,1,!0),R(S.maidPreto,{doubleSide:!0}));_.position.y=(d+f)/2,_.scale.z=c,t.add(_);const m=new M(new it(g*1.01,g*1.06,e*.038,20,1,!0),h);m.position.y=f+e*.016,m.scale.z=c,t.add(m);const p=ni(g*1.04,e*.03,S.maidCreme,c);p.position.y=f-e*.008,t.add(p);const w=s+n.torsoH*.16,x=s-e*.045,v=new M(new it(o*1.06,g*.86,w-x,16,1,!0,-1.15,2.3),h);v.position.y=(w+x)/2,v.scale.z=c,t.add(v);const P=ni(g*.88,e*.034,S.maidCreme,c);P.position.y=x,t.add(P);const E=s+n.torsoH*.2,A=new M(new it(o*1.1,o*1.1,e*.055,18,1,!0),h);A.position.y=E,A.scale.z=c,t.add(A);for(const B of[-1,1]){const G=Ol(e*.03,e*.045,S.maidFita,3);G.position.set(B*o*.5,E,o*.92),t.add(G);const X=Gn(e*.017,S.maidFita);X.position.set(B*o*.5,E-e*.028,o*.96),t.add(X)}for(const B of[-1,1]){const G=new M(new V(e*.055*i,a-E,e*.02),l);G.position.set(B*o*.62,(a+E)/2,o*.7),G.rotation.y=-B*.5,t.add(G);const X=new M(new V(e*.022*i,a-E,e*.03),h);X.position.set(B*o*.98,(a+E)/2,o*.4),X.rotation.y=-B*.95,t.add(X)}const C=new M(new V(o*.9,n.torsoH*.24,e*.014),l);C.position.set(0,s+n.torsoH*.4,o*.8),t.add(C);const b=Ol(o*.55,n.torsoH*.2,S.maidFita,4);b.position.set(0,s+n.torsoH*.4,o*.87),t.add(b);const y=s+n.torsoH*.68;for(const B of[-1,1]){const G=new M(new V(e*.1*i,n.torsoH*.46,e*.012),l);G.position.set(B*e*.06*i,y,o*.82),G.rotation.z=B*.34,t.add(G);const X=new M(new V(e*.007,n.torsoH*.4,e*.006),u);X.position.set(B*e*.088*i,y+n.torsoH*.02,o*.88),X.rotation.z=B*.34,t.add(X);const K=new M(new V(e*.075*i,e*.012,o*1.5),l);K.position.set(B*r*.86,a+e*.012,0),K.rotation.z=B*.16,t.add(K)}const D=new M(new V(e*.24*i,n.torsoH*.36,e*.014),l);D.position.set(0,s+n.torsoH*.74,-o*.8),t.add(D);const F=new M(new V(e*.24*i,e*.011,e*.006),u);F.position.set(0,s+n.torsoH*.57,-o*.87),t.add(F);for(const B of[-1,1]){const G=$h(e*.055*i,S.maidCreme);G.position.set(B*r,a-e*.012,0),t.add(G)}return t}function Vv(n){const t=new at,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=e*.1*i,c=.85,l=R(S.maidCreme),h=R(S.maidCreme,{doubleSide:!0}),u=R(S.maidFita),d=s+n.torsoH*.12,f=s-e*.14,g=o*2,_=new M(new it(o*1.04,g,d-f,20,1,!0),R(S.maidPreto,{doubleSide:!0}));_.position.y=(d+f)/2,_.scale.z=c,t.add(_);const m=ni(g*1.02,e*.036,S.maidPreto,c);m.position.y=f+e*.004,t.add(m);const p=s+n.torsoH*.26,w=s-e*.055,x=new M(new it(o*1.04,g*.9,p-w,16,1,!0,-1.2,2.4),h);x.position.y=(p+w)/2,x.scale.z=c,t.add(x);const v=ni(g*.92,e*.036,S.maidCreme,c);v.position.y=w,t.add(v);const P=new at,E=new M(new Bt(e*.011,8,6),u);E.scale.set(1,1.15,.3),P.add(E);for(let J=0;J<3;J++){const ot=new M(new Bt(e*.005,6,5),u);ot.position.set((J-1)*e*.012,e*.016,0),ot.scale.z=.3,P.add(ot)}P.position.set(g*.42,s-e*.005,g*.72*c),P.rotation.y=.5,t.add(P);const A=n.torsoH*.3,C=p+A*.5,b=o*1.62,y=o*.84,D=new M(new V(b,A,e*.014),l);D.position.set(0,C,y),t.add(D);for(const J of[-1,1]){const ot=new M(new Xe(e*.028,e*.045,4),l);ot.position.set(J*b*.32,C+A*.5+e*.019,y),ot.rotation.set(0,Math.PI/4,J*.26),ot.scale.set(1,1,.3),t.add(ot)}for(const J of[-1,1]){const ot=new M(new _e(e*.014,e*.004,5,10,Math.PI),u);ot.position.set(J*b*.26,C+A*.08,y+e*.009),ot.rotation.z=Math.PI,t.add(ot)}const F=new M(new _e(e*.009,e*.003,5,10,Math.PI),u);F.position.set(0,C-A*.12,y+e*.009),F.rotation.z=Math.PI,t.add(F);for(const J of[-1,1])for(let ot=0;ot<3;ot++){const Z=new M(new V(e*.036,e*.0035,e*.0035),u);Z.position.set(J*b*.4,C-A*.05+(ot-1)*e*.012,y+e*.008),Z.rotation.z=J*(ot-1)*.24,t.add(Z)}const B=Gn(e*.032,S.maidCreme);B.position.set(-o*1.25,s+n.torsoH*.16,o*.5),B.rotation.y=-.55,t.add(B);const G=new M(new it(o*.6,o*1.3,e*.018,20,1,!0),h);G.position.y=a+e*.008,G.scale.z=c,t.add(G);const X=ni(o*1.3,e*.02,S.maidCreme,c);X.position.y=a-e*.006,t.add(X);const K=Gn(e*.05,S.maidLacoVermelho);K.position.set(0,s+n.torsoH*.78,o*1.12),t.add(K);const st=new M(new Bt(e*.016,10,8),R(S.gold,{glow:.2}));st.position.set(0,s+n.torsoH*.71,o*1.16),t.add(st);for(const J of[-1,1]){const ot=$h(e*.056*i,S.maidPreto);ot.position.set(J*r,a-e*.012,0),t.add(ot);const Z=ni(e*.05*i,e*.024,S.maidCreme,1);Z.position.set(J*r,a-e*.058,0),t.add(Z)}return t}function Gv(n,t){const e=new at,i=R(t);for(const o of[-1,1]){const a=new M(new Bt(n*.56,8,6),i);a.position.set(o*n*.44,n*.34,0),a.scale.z=.34,e.add(a)}const s=new M(new Xe(n*.78,n*1.2,10),i);return s.position.y=-n*.34,s.rotation.x=Math.PI,s.scale.z=.34,e.add(s),e}function qv(n){const t=new at,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=.85,c=R(S.waRosa),l=R(S.waRosa,{doubleSide:!0}),h=R(S.waRosaForte),u=R(S.waEscuro),d=R(S.waEscuro,{doubleSide:!0}),f=R(S.waBranco,{doubleSide:!0}),g=s+n.torsoH*.1,_=s-e*.135,m=o*2,p=new M(new it(o*1.02,m,g-_,22,1,!0),d);p.position.y=(g+_)/2,p.scale.z=r,t.add(p);const w=16,x=o*1.02,v=g-_,P=-Math.atan2(m-x,v);for(let ot=0;ot<w;ot++){const Z=new at;Z.rotation.y=ot/w*Math.PI*2;const yt=new M(new V(e*.011,v*.94,e*.009),u);yt.position.set(0,(g+_)/2,(x+m)/2),yt.rotation.x=P,Z.add(yt),Z.scale.z=r,t.add(Z)}const E=13;for(let ot=0;ot<E;ot++){const Z=ot/E*Math.PI*2,yt=Gv(e*.034,S.waEscuro);yt.position.set(Math.sin(Z)*m*1.03,_-e*.016,Math.cos(Z)*m*1.03*r),yt.rotation.y=Z,t.add(yt)}const A=s+n.torsoH*.16,C=s-e*.095,b=new M(new it(o*1.02,m*.9,A-C,16,1,!0,-1.25,2.5),f);b.position.y=(A+C)/2,b.scale.z=r,t.add(b);const y=ni(m*.92,e*.03,S.waBranco,r);y.position.y=C,t.add(y);const D=s+n.torsoH*.14,F=s+n.torsoH*.5,B=new M(new it(o*1.07,o*1.1,F-D,18,1,!0),d);B.position.y=(F+D)/2,B.scale.z=r,t.add(B);const G=new M(new V(o*.62,n.torsoH*.26,e*.012),u);G.position.set(0,s+n.torsoH*.6,o*.82),t.add(G);const X=new M(new _e(e*.019,e*.005,6,12),R(S.waFivela));X.position.set(0,s+n.torsoH*.56,o*.89),X.scale.set(1.25,1,1),t.add(X);for(const ot of[-1,1]){const Z=new M(new V(o*1.15,n.torsoH*.42,e*.013),c);Z.position.set(ot*o*.24,s+n.torsoH*.68,o*.76),Z.rotation.z=ot*.52,t.add(Z)}const K=new M(new it(o*.78,o*.92,n.torsoH*.2,16,1,!0),l);K.position.y=a-n.torsoH*.02,K.scale.z=r,t.add(K);const st=Gn(e*.05,S.waRosaForte);st.position.set(0,D+e*.014,o*1.12),t.add(st);for(const ot of[-1,1]){const Z=new M(new V(e*.026,e*.2,e*.008),h);Z.position.set(ot*e*.022,D-e*.09,m*.78),Z.rotation.z=ot*.1,t.add(Z);const yt=new M(new Xe(e*.018,e*.03,4),h);yt.position.set(ot*e*.024,D-e*.2,m*.8),yt.rotation.set(Math.PI,Math.PI/4,0),yt.scale.z=.3,t.add(yt)}const J=new M(new it(e*.043,e*.045,e*.022,14,1,!0),d);return J.position.y=a+n.torsoH*.12,t.add(J),t}function Wv(n,t){const e=new at,{h:i,w:s}=n,o=i*.3,a=t*i*.052*s,r=i*.068*s,c=1.2,l=new M(new it(i*.045*s,r,o*.94,14,1,!0),R(S.waEscuro,{doubleSide:!0}));l.position.set(a*.45,-o*.44,0),l.scale.z=.78,e.add(l);const h=new M(new it(r,r*.86,o*.38,14,1,!0),R(S.waEscuro,{doubleSide:!0}));h.position.set(a,-o*(c-.19),0),h.scale.z=.78,e.add(h);const u=ni(r*.9,i*.024,S.waBranco,.78);return u.position.set(a,-o*c,0),e.add(u),e}function Xv(n){const t=new at,{h:e,w:i}=n,s=-n.legH*.28,o=new M(new it(e*.047*i,e*.047*i,e*.022,14,1,!0),R(S.waBranco,{doubleSide:!0}));o.position.y=s,t.add(o);const a=new M(new it(e*.049*i,e*.049*i,e*.014,14,1,!0),R(S.waRosaForte,{doubleSide:!0}));a.position.y=s+e*.026,t.add(a);const r=Gn(e*.013,S.waRosaForte);return r.position.set(0,s+e*.026,e*.05*i),t.add(r),t}function Yv(n){const t=new at,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=s+n.torsoH,c=.95,l=R(S.moletomPreto),h=R(S.moletomPreto,{doubleSide:!0}),u=R(S.moletomCostura),d=R(S.moletomZiper),f=R(S.moletomForro,{doubleSide:!0}),g=o*1.1,_=o*1.04,m=s+e*.012,p=a+n.torsoH*.03,w=g*c,x=new M(new it(g,_,p-m,22),l);x.position.y=(p+m)/2,x.scale.z=c,t.add(x);const v=new M(new Bt(g,22,10,0,Math.PI*2,0,Math.PI/2),l);v.position.y=p,v.scale.set(1,.42,c),t.add(v);const P=new M(new it(_*1.03,_*1.01,e*.022,22,1,!0),h);P.position.y=m+e*.011,P.scale.z=c,t.add(P);const E=r+e*.015,A=new M(new it(o*1.75,o*1.15,e*.07,20,1,!0),h);A.position.y=E,A.scale.z=.95,t.add(A);const C=new M(new it(o*1.62,o*1.05,e*.066,20,1,!0),f);C.position.y=E-e*.003,C.scale.z=.95,t.add(C);const b=new M(new Bt(o*1.15,16,12,0,Math.PI*2,0,Math.PI*.6),h);b.position.set(0,a+n.torsoH*.14,-o*.72),b.rotation.x=-1.25,b.scale.set(1.4,.95,.62),t.add(b);const y=E+e*.005,D=m+e*.014,F=new M(new V(e*.014,y-D,e*.018),d);F.position.set(0,(y+D)/2,w*.99),t.add(F);const B=new M(new V(e*.02,e*.026,e*.012),u);B.position.set(0,s+n.torsoH*.5,w*1.03),t.add(B);const G=new M(new it(g*1.012,g*1.012,e*.007,22,1,!0),R(S.moletomCostura,{doubleSide:!0}));G.position.y=s+n.torsoH*.68,G.scale.z=c,t.add(G);for(const X of[-1,1]){const K=new at;K.rotation.y=X*.62,K.scale.z=c;const st=new M(new V(e*.013,e*.062,e*.012),u);st.position.set(0,s+n.torsoH*.2,g*1),st.rotation.z=X*.36,K.add(st),t.add(K)}for(const X of[-1,1]){const K=new M(new it(e*.006,e*.006,e*.016,8),R(S.moletomPonteira));K.position.set(X*e*.022,m+e*.006,_*c*.99),t.add(K)}return t}function jv(n){const t=new at,{h:e,w:i}=n,s=e*.3,o=.82,a=new M(new Bt(e*.058*i,12,10),R(S.moletomPreto));a.position.y=-s*.03,a.scale.set(1,.92,.95),t.add(a);const r=new M(new it(e*.056*i,e*.046*i,s*o,14,1,!0),R(S.moletomPreto,{doubleSide:!0}));r.position.y=-s*o*.5,t.add(r);const c=new M(new it(e*.047*i,e*.045*i,e*.022,14),R(S.moletomCostura));return c.position.y=-s*o,t.add(c),t}function Zv(n){const t=new at,i=-n.headR*.98,s=new M(new it(n.h*.043,n.h*.045,n.h*.026,14,1,!0),R(S.vestidoRenda,{doubleSide:!0}));s.position.y=i,t.add(s);const o=Gn(n.h*.026,S.vestidoFita,S.vestidoRenda);return o.position.set(0,i,n.h*.044),t.add(o),t}const se={sorveteMorango:{id:"sorvete-morango",nome:"Sorvete de morango",icone:"🍦",tipo:"mao",nota:"do Ari",holdPose:"upright"},sorveteMaracuja:{id:"sorvete-maracuja",nome:"Sorvete de maracujá",icone:"🍦",tipo:"mao",nota:"do Renan",holdPose:"upright"},sucoPessego:{id:"suco-pessego",nome:"Suco de pêssego",icone:"🥤",tipo:"mao",nota:"do Ari",holdPose:"upright"},sucoMorango:{id:"suco-morango",nome:"Suco de morango",icone:"🥤",tipo:"mao",nota:"do Renan",holdPose:"upright"},chapeuPingPong:{id:"chapeu-ping-pong",nome:"Chapéu de campeão",icone:"👑",tipo:"vestivel",slot:"cabeca",nota:"ping pong, 5 a 0"},patins:{id:"patins",nome:"Patins",icone:"🛼",tipo:"vestivel",slot:"pes",funcional:!0,nota:"da lojinha do parque · +velocidade"},gorroDeLa:{id:"gorro-la",nome:"Gorro de lã",icone:"🧢",tipo:"vestivel",slot:"cabeca",cor:S.roupaLa,corDetalhe:S.roupaLaBarra,nota:"para o frio que nunca faz",cobreCabelo:!0,extra:zv},camisaListrada:{id:"camisa-listrada",nome:"Camisa listrada",icone:"👕",tipo:"vestivel",slot:"tronco",cor:S.roupaListra,corDetalhe:S.roupaListraManga,nota:"mangas claras"},calcaJeans:{id:"calca-jeans",nome:"Calça jeans",icone:"👖",tipo:"vestivel",slot:"pernas",cor:S.roupaJeans,nota:"a de sempre"},vestidoRosa:{id:"vestido-rosa",nome:"Vestido rosa de babados",icone:"👗",tipo:"vestivel",slot:"tronco",cor:S.vestidoRosa,corDetalhe:S.vestidoRenda,nota:"da vitrine que o Renan viu",bracosNus:!0,pernasNuas:!0,extra:kv},maidMarinheiro:{id:"maid-marinheiro",nome:"Maid marinheiro",icone:"🖤",tipo:"vestivel",slot:"tronco",cor:S.maidPreto,corDetalhe:S.maidCreme,nota:"gola de marinheiro e cadarço",pernasNuas:!0,extra:Hv},maidGatinho:{id:"maid-gatinho",nome:"Maid gatinho",icone:"🐱",tipo:"vestivel",slot:"tronco",cor:S.maidPreto,corDetalhe:S.maidPreto,nota:"com guizo e cara de gato",pernasNuas:!0,extra:Vv},maidJapones:{id:"maid-japones",nome:"Maid japonês",icone:"🌸",tipo:"vestivel",slot:"tronco",cor:S.waRosa,corDetalhe:S.waRosa,nota:"manga de quimono e festão de corações",pernasNuas:!0,extra:qv,extraBraco:Wv},moletomPreto:{id:"moletom-preto",nome:"Moletom preto",icone:"🧥",tipo:"vestivel",slot:"tronco",cor:S.moletomPreto,corDetalhe:S.moletomPreto,nota:"com capuz e zíper, o da foto no espelho",extra:Yv,extraBraco:jv},meiaDeCoxa:{id:"meia-de-coxa",nome:"Meia de coxa",icone:"🧦",tipo:"vestivel",slot:"pernas",cor:S.waBranco,nota:"com a liga rosa",extra:Xv},gargantilhaDeLaco:{id:"gargantilha-laco",nome:"Gargantilha de laço",icone:"🎀",tipo:"vestivel",slot:"cabeca",cor:S.vestidoFita,nota:"combina com o vestido",extra:Zv},botaAmarela:{id:"bota-amarela",nome:"Bota amarela",icone:"🥾",tipo:"vestivel",slot:"pes",cor:S.roupaBota,corDetalhe:S.roupaBotaCano,nota:"chama atenção de longe",extra:Bv},frisbee:{id:"frisbee",nome:"Frisbee",icone:"🥏",tipo:"mao",nota:"do parque",holdPose:"relaxed"}},Jv={"sorvete-morango":()=>Br(S.morango),"sorvete-maracuja":()=>Br(S.maracuja),"suco-pessego":()=>Ul(S.pessego),"suco-morango":()=>Ul(S.morango),frisbee:()=>Jh(S.frisbee)},Kv=Object.fromEntries(Object.values(se).map(n=>[n.id,n]));function Io(n){return Kv[n]??null}function $v(n){const t=Jv[n]?.();return t?(t.userData.item=n,t):null}const zn=10,Fs=4;function Os(n){return n.tipo==="vestivel"&&n.funcional!==!0}function Yi(n,t){return t==="vestivel"?n.tipo==="vestivel":t==="acervo"?Os(n):!Os(n)}function Lo(n){return n.slot?ai.indexOf(n.slot):-1}function ko(n){return Array.from({length:n},()=>null)}function Qh(){return{mao:ko(zn),ativo:0,vestiveis:ko(Fs),acervo:[]}}function Qv(n,t){const e={},i=t&&typeof t=="object"?t:{},s=new Set([...Object.keys(n??{}),...Object.keys(i)]);for(const o of s)e[o]=t1((n??{})[o],i[o]);return e}function t1(n,t){const e=Qh();if(!n&&!t)return e;const i=[],s=(d,f,g)=>{const _=ko(f);if(!Array.isArray(d))return _;for(let m=0;m<f;m++){const p=d[m];if(!p||typeof p.id!="string"){_[m]=null;continue}const w=Io(p.id),x=w?{...p,...w}:p;if(Yi(x,g)){_[m]=x;continue}_[m]=null,g==="mao"&&Os(x)&&i.push(x)}return _},o=typeof n?.ativo=="number"?Math.floor(n.ativo):0,a=s(n?.vestiveis,Fs,"vestivel"),r=ko(Fs);for(const d of a){if(!d)continue;const f=Lo(d);f>=0&&r[f]===null&&(r[f]=d)}if(t&&typeof t=="object")for(const[d,f]of Object.entries(t)){if(typeof f!="string")continue;const g=Io(f);if(!g||g.slot!==d)continue;const _=ai.indexOf(d);_>=0&&r[_]===null&&(r[_]=g)}const c=s(n?.mao,zn,"mao"),l=[],h=d=>l.some(f=>f.id===d)||r.some(f=>f?.id===d)||c.some(f=>f?.id===d),u=Array.isArray(n?.acervo)?n.acervo:[];for(const d of[...u,...i]){if(!d||typeof d.id!="string")continue;const f=Io(d.id),g=f?{...d,...f}:d;!Yi(g,"acervo")||h(g.id)||l.push(g)}return{mao:c,ativo:o>=0&&o<zn?o:0,vestiveis:r,acervo:l}}const zl="aristory.save.v1",Da={version:1,scene:"",flags:{},memories:[],stats:{},inventarios:{}};class vc{data;constructor(){this.data=vc.read()}static read(){try{const t=localStorage.getItem(zl);if(!t)return structuredClone(Da);const e=JSON.parse(t),i=e.loadouts;return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{},inventarios:Qv(e.inventarios,i)}}catch{return structuredClone(Da)}}persist(){try{localStorage.setItem(zl,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}de(t){let e=this.data.inventarios[t];return e||(e=Qh(),this.data.inventarios[t]=e),e}maos(t){return this.de(t).mao}vestiveis(t){return this.de(t).vestiveis}acervo(t){return this.de(t).acervo}loadout(t){const e={};return this.de(t).vestiveis.forEach((i,s)=>{i&&(e[ai[s]]=i.id)}),e}slotAtivo(t){return this.de(t).ativo}setSlotAtivo(t,e){e<0||e>=zn||(this.de(t).ativo=e,this.persist())}itemAtivo(t){const e=this.de(t);return e.mao[e.ativo]??null}achouItem(t,e){const i=this.de(t);return i.mao.some(s=>s?.id===e)||i.vestiveis.some(s=>s?.id===e)||i.acervo.some(s=>s.id===e)}pegar(t,e){if(this.achouItem(t,e.id))return"repetido";if(e.tipo==="vestivel"&&this.vestir(t,e))return"guardado";if(Os(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let s=1;s<zn;s++){const o=(i.ativo+s)%zn;if(i.mao[o]===null)return i.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardar(t,e){if(this.achouItem(t,e.id))return"repetido";if(Os(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let s=1;s<zn;s++){const o=(i.ativo+s)%zn;if(i.mao[o]===null)return i.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardarNoAcervo(t,e){return Yi(e,"acervo")?this.achouItem(t,e.id)?"repetido":(this.de(t).acervo.push(e),this.persist(),"guardado"):"cheio"}tirarDoAcervo(t,e){const i=this.de(t).acervo,s=i.findIndex(a=>a.id===e);if(s<0)return null;const[o]=i.splice(s,1);return this.persist(),o}vestir(t,e){if(!Yi(e,"vestivel"))return!1;const i=Lo(e);if(i<0)return!1;const s=this.de(t).vestiveis;return s[i]!==null||this.achouItem(t,e.id)&&!this.tirarDoAcervo(t,e.id)?!1:(s[i]=e,this.persist(),!0)}despir(t,e){e<0||e>=Fs||(this.de(t).vestiveis[e]=null,this.persist())}mover(t,e,i){const s=this.de(t),o=u=>u.lista==="mao"?s.mao:s.vestiveis,a=u=>u.indice>=0&&u.indice<(u.lista==="mao"?zn:Fs);if(!a(e)||!a(i)||e.lista===i.lista&&e.indice===i.indice)return!1;const r=o(e),c=o(i),l=r[e.indice];if(!l||!Yi(l,i.lista)||i.lista==="vestivel"&&Lo(l)!==i.indice)return!1;const h=c[i.indice];return h&&!Yi(h,e.lista)||e.lista==="vestivel"&&h&&Lo(h)!==e.indice?!1:(c[i.indice]=l,r[e.indice]=h??null,this.persist(),!0)}largar(t,e){const i=this.de(t);let s=!1;for(const a of[i.mao,i.vestiveis]){const r=a.findIndex(c=>c?.id===e);r>=0&&(a[r]=null,s=!0)}const o=i.acervo.findIndex(a=>a.id===e);return o>=0&&(i.acervo.splice(o,1),s=!0),s&&this.persist(),s}reset(){this.data=structuredClone(Da),this.persist()}}const Ua=["Cabeça","Tronco","Pernas","Pés"];class e1{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;menu;placar;mochila;armario;boneco;corpo;acervo;donoArmario;slotsMao;slotsVestivel;dono;descarte;memorias;quadro;pontos;acervoDoQuadro=[];naMoldura=0;pintura=null;abriuEm=0;pegou=null;tipoNaPinca;funcionalNaPinca=!1;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchGirar=null;onTouchHold=null;onRestart=null;onToggleSom=null;som=null;hintsTimer=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
      <div class="veil"></div>
      <div class="scene-card"><b></b><span></span></div>
      <div class="toasts"></div>
      <div class="hints">
        <div class="teclado">WASD / setas — andar</div>
        <div class="teclado">E ou espaço — interagir</div>
        <div class="teclado">T — trocar de personagem</div>
        <div class="teclado">Q / R — girar a câmera · J — diário</div>
        <div class="toque">arraste para andar · ✨ interagir</div>
        <div class="toque">☰ tem a lista de controles</div>
      </div>
      <div class="carga"><div class="barra"></div><i class="zona"></i><i class="alvo"></i></div>
      <div class="placar"><b class="eu"></b><span class="nums"></span><b class="ele"></b></div>
      <div class="prompt"><span class="icon">✨</span><span class="label"></span><span class="key">E</span></div>
      <div class="dialogue"><span class="who"></span><p class="text"></p><div class="escolhas"></div><span class="next">clique / E ▸</span></div>
      <div class="journal"><div class="sheet">
        <h2>Diário de memórias</h2>
        <p class="sub">Os momentos que a gente já viveu — e os que ainda faltam.</p>
        <div class="grid"></div>
        <button class="close">fechar</button>
      </div></div>
      <button class="menu-btn" aria-label="menu"><span></span><span></span><span></span></button>
      <div class="menu"><div class="sheet">
        <h2>AriStory</h2>
        <p class="sub">um passeio pelos lugares da gente</p>
        <button class="som-btn">🔊 Som ligado</button>
        <button class="controles-btn">🎮 Controles</button>
        <button class="recomecar">🔄 Recomeçar o jogo</button>
        <div class="confirma">
          <p>Isso apaga o diário de memórias e leva os dois de volta pro começo, na casa do Ari.</p>
          <div class="linha">
            <button class="sim">Recomeçar</button>
            <button class="nao">Cancelar</button>
          </div>
        </div>
        <div class="controles">
          <h3>No teclado</h3>
          <ul>
            <li><b>W A S D</b><span>andar (as setas também)</span></li>
            <li><b>E</b><span>interagir e avançar a fala (espaço também)</span></li>
            <li><b>T</b><span>trocar de personagem</span></li>
            <li><b>Q</b> <b>R</b><span>girar a câmera</span></li>
            <li><b>H</b><span>dar a mão para quem está com você</span></li>
            <li><b>I</b> <b>Tab</b><span>abrir a mochila</span></li>
            <li><b>J</b><span>abrir o diário de memórias</span></li>
            <li><b>F</b><span>segurar para carregar o frisbee — solte no traço da barra</span></li>
            <li><b>roda</b><span>aproximar e afastar a câmera</span></li>
          </ul>
          <h3>No celular</h3>
          <ul>
            <li><b>arrastar</b><span>andar para onde o dedo puxar</span></li>
            <li><b>✨</b><span>interagir — segure para carregar o frisbee</span></li>
            <li><b>🔁</b><span>trocar de personagem</span></li>
            <li><b>🎒</b><span>abrir a mochila</span></li>
            <li><b>📖</b><span>abrir o diário</span></li>
            <li><b>↺ ↻</b><span>girar a câmera — no alto, abaixo do menu</span></li>
          </ul>
          <div class="carinho">
            <h3>Os dois juntos</h3>
            <p>Perto do outro, sem nada por perto para interagir, o <b>E</b> (ou o <b>✨</b>) vira carinho:</p>
            <ul>
              <li><b>💋</b><span>de frente um para o outro, um beijinho</span></li>
              <li><b>🤝</b><span>lado a lado, saem de mãos dadas — e a cada tanto sobe um coração</span></li>
            </ul>
            <p>Para soltar as mãos, é só apertar de novo.</p>
          </div>
          <button class="voltar">voltar</button>
        </div>
        <button class="close">voltar pro jogo</button>
      </div></div>
      <div class="mochila"><div class="sheet">
        <h2>Mochila <span class="dono"></span></h2>
        <p class="sub">arraste para trocar de vaga · <b>T</b> vê a do outro</p>
        <h3>Na mão <small>toque para escolher o que fica na mão</small></h3>
        <div class="slots maos"></div>
        <h3>Vestindo <small>roupa só se troca no guarda-roupa — aqui só dá pra descartar</small></h3>
        <div class="slots vestiveis"></div>
        <div class="descarte">
          <button class="descartar">🗑 Descartar</button>
          <button class="descartar-sim">Descartar mesmo?</button>
        </div>
        <button class="close">voltar pro jogo</button>
      </div></div>
      <div class="armario"><div class="sheet">
        <h2>Guarda-roupa <span class="dono"></span></h2>
        <p class="sub">clique numa peça para vestir ou tirar · arraste o boneco para girar · <b>T</b> veste o outro</p>
        <div class="prova">
          <canvas class="boneco"></canvas>
          <div class="corpo"></div>
        </div>
        <h3>O que você tem</h3>
        <div class="acervo"></div>
        <button class="close">fechar</button>
      </div></div>
      <div class="memorias"><div class="sheet">
        <h2></h2>
        <p class="sub"></p>
        <div class="moldura">
          <button class="folhear antes" aria-label="memória anterior">‹</button>
          <canvas class="quadro"></canvas>
          <button class="folhear depois" aria-label="próxima memória">›</button>
        </div>
        <p class="legenda"></p>
        <div class="pontos"></div>
        <button class="close">fechar</button>
      </div></div>
      <div class="touch">
        <button class="action-btn" aria-label="interagir">✨</button>
        <button class="swap-btn" aria-label="trocar de personagem">🔁</button>
        <button class="bag-btn" aria-label="mochila">🎒</button>
        <button class="journal-btn" aria-label="diário">📖</button>
        <button class="girar-btn esq" aria-label="girar a câmera para a esquerda"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5a6.5 6.5 0 1 0 6.2 4.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1.6v7.6l-4.2-3.8z" fill="currentColor"/></svg></button>
        <button class="girar-btn dir" aria-label="girar a câmera para a direita"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5a6.5 6.5 0 1 0 6.2 4.6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M12 1.6v7.6l-4.2-3.8z" fill="currentColor"/></svg></button>
      </div>
    `,t.appendChild(e);const i=document.createElement("div");i.className="boot",i.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(i),this.boot=i,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.menu=e.querySelector(".menu"),this.placar=e.querySelector(".placar"),this.mochila=e.querySelector(".mochila"),this.slotsMao=e.querySelector(".mochila .maos"),this.slotsVestivel=e.querySelector(".mochila .vestiveis"),this.dono=e.querySelector(".mochila .dono"),this.descarte=e.querySelector(".mochila .descarte"),this.armario=e.querySelector(".armario"),this.boneco=e.querySelector(".armario .boneco"),this.corpo=e.querySelector(".armario .corpo"),this.acervo=e.querySelector(".armario .acervo"),this.donoArmario=e.querySelector(".armario .dono"),this.memorias=e.querySelector(".memorias"),this.quadro=e.querySelector(".memorias .quadro"),this.pontos=e.querySelector(".memorias .pontos"),this.dialogue.addEventListener("click",o=>{o.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",o=>{o.target===this.journal&&this.closeJournal()});const s=e.querySelector(".action-btn");s.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),s.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const o of["pointerup","pointercancel","pointerleave"])s.addEventListener(o,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".girar-btn.esq").addEventListener("click",()=>this.onTouchGirar?.(-1)),e.querySelector(".girar-btn.dir").addEventListener("click",()=>this.onTouchGirar?.(1)),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),e.querySelector(".bag-btn").addEventListener("click",()=>this.toggleMochila()),e.querySelector(".mochila .close").addEventListener("click",()=>this.closeMochila()),e.querySelector(".armario .close").addEventListener("click",()=>this.fecharArmario()),this.armario.addEventListener("click",o=>{o.target===this.armario&&this.fecharArmario()}),e.querySelector(".memorias .close").addEventListener("click",()=>this.fecharMemorias()),e.querySelector(".memorias .antes").addEventListener("click",()=>this.folhear(-1)),e.querySelector(".memorias .depois").addEventListener("click",()=>this.folhear(1)),this.memorias.addEventListener("click",o=>{o.target===this.memorias&&this.fecharMemorias()}),this.ligarGiroDoBoneco(),e.querySelector(".mochila .descartar").addEventListener("click",()=>{this.som?.("escolha"),this.descarte.classList.add("confirmando")}),e.querySelector(".mochila .descartar-sim").addEventListener("click",()=>{const o=this.pegou;this.pegou=null,this.tipoNaPinca=void 0,this.marcarPego(null),o&&this.onDescartar?.(o)}),this.mochila.addEventListener("click",o=>{o.target===this.mochila&&this.closeMochila()});for(const o of[this.slotsMao,this.slotsVestivel])o.addEventListener("click",a=>this.tocarVaga(a)),o.addEventListener("dragstart",a=>this.comecarArrasto(a)),o.addEventListener("dragover",a=>this.arrastarSobre(a)),o.addEventListener("dragleave",a=>{a.target.closest(".slot")?.classList.remove("alvo")}),o.addEventListener("drop",a=>this.soltarArrasto(a)),o.addEventListener("dragend",()=>this.limparArrasto());e.querySelector(".menu-btn").addEventListener("click",()=>this.toggleMenu()),e.querySelector(".menu .som-btn").addEventListener("click",()=>this.onToggleSom?.()),e.querySelector(".menu .controles-btn").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.add("vendo-controles")}),e.querySelector(".menu .controles .voltar").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.remove("vendo-controles")}),e.querySelector(".menu .close").addEventListener("click",()=>this.closeMenu()),e.querySelector(".menu .recomecar").addEventListener("click",()=>{this.menu.classList.add("perguntando")}),e.querySelector(".menu .nao").addEventListener("click",()=>{this.menu.classList.remove("perguntando")}),e.querySelector(".menu .sim").addEventListener("click",()=>{this.closeMenu(),this.onRestart?.()}),this.menu.addEventListener("click",o=>{o.target===this.menu&&this.closeMenu()}),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),this.showHints()}get menuOpen(){return this.menu.classList.contains("show")}toggleMenu(){this.som?.("menu"),this.menuOpen?this.closeMenu():(this.closeJournal(),this.closeMochila(),this.menu.classList.add("show")),this.marcarTelaAberta()}closeMenu(){this.menu.classList.remove("show"),this.menu.classList.remove("perguntando"),this.menu.classList.remove("vendo-controles"),this.marcarTelaAberta()}marcarTelaAberta(){document.body.classList.toggle("tela-aberta",this.menuOpen||this.journalOpen||this.mochilaOpen||this.armarioOpen||this.memoriasOpen)}setSom(t){const e=this.menu.querySelector(".som-btn");e.textContent=t?"🔊 Som ligado":"🔇 Som desligado",e.classList.toggle("desligado",!t)}showHints(){this.hints.classList.remove("hide"),this.hintsTimer&&window.clearTimeout(this.hintsTimer),this.hintsTimer=window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){const i=this.prompt.querySelector(".label").textContent;this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,(!this.prompt.classList.contains("show")||i!==e)&&this.som?.("prompt"),this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showPlacar(t){if(!t){this.placar.classList.remove("show");return}this.placar.querySelector(".eu").textContent=t.eu,this.placar.querySelector(".ele").textContent=t.ele,this.placar.querySelector(".nums").textContent=`${t.meus} × ${t.dele}`,this.placar.classList.add("show")}showCharge(t,e,i=.06){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const s=this.carga.querySelector(".barra");s.style.width=`${Math.max(0,Math.min(1,t))*100}%`;const o=this.carga.querySelector(".alvo"),a=this.carga.querySelector(".zona"),r=e!=null&&e>.02&&e<.99;if(o.style.display=r?"block":"none",a.style.display=r?"block":"none",!r){this.carga.classList.remove("certa");return}const c=h=>`calc(3px + (100% - 6px) * ${Math.max(0,Math.min(1,h))})`;o.style.left=c(e),a.style.left=c(e-i),a.style.right=`calc(3px + (100% - 6px) * ${1-Math.max(0,Math.min(1,e+i))})`;const l=Math.abs(t-e)<=i;this.carga.classList.toggle("certa",l)}toast(t,e="💛"){const i=document.createElement("div");i.className="toast",i.innerHTML=`<span>${e}</span><span></span>`,i.querySelector("span:last-child").textContent=t,this.toasts.appendChild(i),window.setTimeout(()=>i.classList.add("fade"),2600),window.setTimeout(()=>i.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(i=>{let s=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const o=()=>{this.type(t[s])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[s];return}if(s+=1,s>=t.length){this.dialogue.classList.remove("show"),this.advance=null,i();return}o()},o()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,e%3===1&&t[e-1]!==" "&&this.som?.("fala"),this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,i=""){return new Promise(s=>{this.dialogueWho.textContent=i,this.dialogueWho.style.display=i?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=o=>{this.som?.("confirma"),this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),s(o)},e.forEach((o,a)=>{const r=document.createElement("button");r.type="button",r.textContent=o,r.addEventListener("click",()=>this.escolher?.(a)),this.escolhas.appendChild(r)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,i)=>e.classList.toggle("sel",i===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.som?.("escolha"),this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.som?.("escolha"),this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const i=document.createElement("div");i.className="memory",i.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',i.querySelector(".icon").textContent=e.icon,i.querySelector("b").textContent=e.title,i.querySelector("small").textContent=e.place,i.querySelector("p").textContent=e.note,this.journalGrid.appendChild(i)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.som?.("diario"),this.journalOpen?this.closeJournal():(this.closeMochila(),this.journal.classList.add("show")),this.marcarTelaAberta()}closeJournal(){this.journal.classList.remove("show"),this.marcarTelaAberta()}get memoriasOpen(){return this.memorias.classList.contains("show")}abrirMemorias(t,e=0){this.memoriasOpen||t.length===0||(this.som?.("diario"),this.closeJournal(),this.closeMochila(),this.acervoDoQuadro=t,this.naMoldura=Math.min(Math.max(e,0),t.length-1),this.mostrarMemoria(),this.memorias.classList.add("show"),this.marcarTelaAberta(),this.abriuEm=performance.now(),this.pintura=requestAnimationFrame(this.pintarQuadro))}fecharMemorias(){this.memoriasOpen&&(this.memorias.classList.remove("show"),this.acervoDoQuadro=[],this.pintura!==null&&cancelAnimationFrame(this.pintura),this.pintura=null,this.marcarTelaAberta())}folhear(t){if(!this.memoriasOpen||this.acervoDoQuadro.length<2)return;const e=this.acervoDoQuadro.length;this.naMoldura=(this.naMoldura+t+e)%e,this.som?.("escolha"),this.mostrarMemoria(),this.abriuEm=performance.now()}mostrarMemoria(){const t=this.acervoDoQuadro[this.naMoldura];if(!t)return;this.memorias.querySelector("h2").textContent=t.titulo,this.memorias.querySelector(".sub").textContent=t.lugar,this.memorias.querySelector(".legenda").textContent=t.legenda,this.quadro.style.aspectRatio=String(t.proporcao);const e=this.acervoDoQuadro.length>1;this.memorias.classList.toggle("tem-mais",e),this.pontos.innerHTML="",e&&this.acervoDoQuadro.forEach((i,s)=>{const o=document.createElement("button");o.className="ponto",o.classList.toggle("agora",s===this.naMoldura),o.title=i.titulo,o.setAttribute("aria-label",i.titulo),o.addEventListener("click",()=>this.folhear(s-this.naMoldura)),this.pontos.appendChild(o)})}pintarQuadro=t=>{const e=this.acervoDoQuadro[this.naMoldura];if(!e||!this.memoriasOpen){this.pintura=null;return}const i=Math.min(window.devicePixelRatio||1,2),s=Math.round(this.quadro.clientWidth*i),o=Math.round(this.quadro.clientHeight*i);if(s>0&&o>0){(this.quadro.width!==s||this.quadro.height!==o)&&(this.quadro.width=s,this.quadro.height=o);const a=this.quadro.getContext("2d");a&&e.pintar(a,s,o,(t-this.abriuEm)/1e3)}this.pintura=requestAnimationFrame(this.pintarQuadro)};get mochilaOpen(){return this.mochila.classList.contains("show")}toggleMochila(){this.som?.("diario"),this.mochilaOpen?this.closeMochila():(this.closeJournal(),this.onAbrirMochila?.(),this.mochila.classList.add("show")),this.marcarTelaAberta()}closeMochila(){this.mochila.classList.remove("show"),this.marcarTelaAberta()}renderMochila(t,e,i,s){this.dono.textContent=`de ${s}`,this.pegou=null,this.tipoNaPinca=void 0,this.funcionalNaPinca=!1,this.mochila.classList.remove("movendo"),this.descarte.classList.remove("show","confirmando");const o=(a,r,c,l=!1)=>{a.innerHTML="",r.forEach((h,u)=>{const d=document.createElement("button");d.className="slot",d.dataset.slot=String(u),d.classList.toggle("cheio",h!==null),d.classList.toggle("principal",u===c);const f=h!==null&&h.tipo==="vestivel"&&h.funcional!==!0;d.draggable=h!==null&&!f,d.classList.toggle("preso",f),h?(d.dataset.tipo=h.tipo,h.funcional?d.dataset.funcional="sim":delete d.dataset.funcional):(delete d.dataset.tipo,delete d.dataset.funcional);const g=l?`<em class="parte">${Ua[u]}</em>`:"";d.innerHTML=g+(h?`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""):'<span class="icone vazio">·</span><b>vazio</b>'),a.appendChild(d)})};o(this.slotsMao,t,i),o(this.slotsVestivel,e,-1,!0)}get armarioOpen(){return this.armario.classList.contains("show")}abrirArmario(){this.armarioOpen||(this.som?.("escolha"),this.onAbrirArmario?.(),this.armario.classList.add("show"),this.marcarTelaAberta())}fecharArmario(){this.armarioOpen&&(this.armario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharArmario?.())}canvasDoBoneco(){return this.boneco}renderArmario(t,e,i){if(this.donoArmario.textContent=`de ${i}`,this.corpo.innerHTML="",t.forEach((s,o)=>{const a=document.createElement("button");a.className="parte",a.classList.toggle("cheio",s!==null),a.dataset.parte=String(o),a.innerHTML=`<small>${Ua[o]}</small>`+(s?`<span class="icone">${s.icone}</span><b>${s.nome}</b><em>tirar</em>`:'<span class="icone vazio">·</span><b>vazio</b>'),this.corpo.appendChild(a)}),this.acervo.innerHTML="",e.length===0){const s=document.createElement("p");s.className="nada",s.textContent="Nada guardado — está tudo no corpo.",this.acervo.appendChild(s);return}ai.forEach((s,o)=>{const a=e.filter(h=>h.slot===s);if(a.length===0)return;const r=document.createElement("section");r.className="grupo",r.dataset.slot=s;const c=document.createElement("h4");c.innerHTML=`${Ua[o]} <span>${a.length}</span>`,r.appendChild(c);const l=document.createElement("div");l.className="pecas";for(const h of a){const u=document.createElement("button");u.className="peca",u.dataset.id=h.id,u.innerHTML=`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""),l.appendChild(u)}r.appendChild(l),this.acervo.appendChild(r)})}onTirarParte=null;onVestirPeca=null;onAbrirArmario=null;onFecharArmario=null;onGirarBoneco=null;ligarGiroDoBoneco(){let t=!1,e=0;this.boneco.addEventListener("pointerdown",i=>{t=!0,e=i.clientX,this.boneco.setPointerCapture(i.pointerId)}),this.boneco.addEventListener("pointermove",i=>{t&&(this.onGirarBoneco?.((i.clientX-e)*.012),e=i.clientX)});for(const i of["pointerup","pointercancel"])this.boneco.addEventListener(i,()=>{t=!1});this.corpo.addEventListener("click",i=>{const s=i.target.closest(".parte");!s?.dataset.parte||!s.classList.contains("cheio")||this.onTirarParte?.(Number(s.dataset.parte))}),this.acervo.addEventListener("click",i=>{const s=i.target.closest(".peca");s?.dataset.id&&this.onVestirPeca?.(s.dataset.id)})}onEscolherSlot=null;onMoverItem=null;onDescartar=null;onAbrirMochila=null;podeIrPara(t,e,i=!1){return t?t==="vestivel"&&e==="mao"?i?!0:(this.toast("Roupa só se troca no guarda-roupa","👗"),!1):t==="mao"&&e==="vestivel"?(this.toast("Este item não pode ser vestido","🚫"),!1):!0:!0}endereco(t){const e=t.closest(".slot");return e?.dataset.slot?{lista:e.closest(".vestiveis")?"vestivel":"mao",indice:Number(e.dataset.slot)}:null}tocarVaga(t){const e=this.endereco(t.target);if(!e)return;if(this.pegou){const s=this.pegou;if(s.lista===e.lista&&s.indice===e.indice){this.pegou=null,this.marcarPego(null);return}if(!this.podeIrPara(this.tipoNaPinca,e.lista,this.funcionalNaPinca))return;this.pegou=null,this.marcarPego(null),this.onMoverItem?.(s,e)&&this.som?.("escolha");return}const i=t.target.closest(".slot");if(e.lista==="mao"&&!i.classList.contains("cheio")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}if(i.classList.contains("cheio")){if(e.lista==="mao"&&!i.classList.contains("principal")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}this.pegou=e,this.tipoNaPinca=i.dataset.tipo,this.funcionalNaPinca=i.dataset.funcional==="sim",this.marcarPego(i),this.som?.("escolha")}}marcarPego(t){for(const s of this.mochila.querySelectorAll(".slot.pego"))s.classList.remove("pego");t?.classList.add("pego"),this.mochila.classList.toggle("movendo",t!==null),this.descarte.classList.toggle("show",t!==null),this.descarte.classList.remove("confirmando");const e=this.descarte.querySelector(".descartar"),i=t?.querySelector("b")?.textContent??"";e.textContent=i?`🗑 Descartar ${i}`:"🗑 Descartar"}comecarArrasto(t){const e=this.endereco(t.target),i=t.target.closest(".slot");if(!e||!i?.classList.contains("cheio")){t.preventDefault();return}t.dataTransfer?.setData("text/plain",JSON.stringify({vaga:e,tipo:i.dataset.tipo,funcional:i.dataset.funcional==="sim"})),t.dataTransfer&&(t.dataTransfer.effectAllowed="move"),i.classList.add("pego")}arrastarSobre(t){const e=t.target.closest(".slot");e&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),e.classList.add("alvo"))}soltarArrasto(t){t.preventDefault();const e=this.endereco(t.target),i=t.dataTransfer?.getData("text/plain");if(this.limparArrasto(),!(!e||!i))try{const{vaga:s,tipo:o,funcional:a}=JSON.parse(i);if(!this.podeIrPara(o,e.lista,a===!0))return;this.onMoverItem?.(s,e)&&this.som?.("escolha")}catch{}}limparArrasto(){for(const t of this.mochila.querySelectorAll(".slot.pego, .slot.alvo"))t.classList.remove("pego","alvo")}}function kr(n,t,e){for(const i of e)if(i.kind==="circle"){const s=n.x-i.x,o=n.z-i.z,a=t+i.r,r=s*s+o*o;if(r>=a*a||r===0)continue;const c=Math.sqrt(r),l=(a-c)/c;n.x+=s*l,n.z+=o*l}else{const s=Math.cos(-i.rot),o=Math.sin(-i.rot),a=n.x-i.x,r=n.z-i.z,c=a*s-r*o,l=a*o+r*s,h=Math.max(-i.hw,Math.min(i.hw,c)),u=Math.max(-i.hd,Math.min(i.hd,l));let d=c-h,f=l-u,g=d*d+f*f;if(g>t*t)continue;if(g===0){const w=i.hw-Math.abs(c),x=i.hd-Math.abs(l);w<x?(d=Math.sign(c)||1,f=0,g=0):(d=0,f=Math.sign(l)||1);const v=d!==0?Math.sign(d)*(i.hw+t):c,P=f!==0?Math.sign(f)*(i.hd+t):l;n.x=i.x+(v*Math.cos(i.rot)-P*Math.sin(i.rot)),n.z=i.z+(v*Math.sin(i.rot)+P*Math.cos(i.rot));continue}const _=Math.sqrt(g),m=h+d/_*t,p=u+f/_*t;n.x=i.x+(m*Math.cos(i.rot)-p*Math.sin(i.rot)),n.z=i.z+(m*Math.sin(i.rot)+p*Math.cos(i.rot))}}function Hr(n,t,e){n.x=Math.max(e.minX+t,Math.min(e.maxX-t,n.x)),n.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,n.z))}const tu=1.3;class n1{object=new at;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new N;body;locked=!1;riding=!1;submersion=0;patins=!1;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}get chest(){return new N(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}update(t,e,i,s){if(this.riding){this.body.update(e,0);return}const o=this.submersion>.05,a=this.patins&&!o?tu:1,r=o?this.maxSpeed*.55:this.maxSpeed*a;if(!this.locked&&t.lengthSq()>1e-4){const l=t.clone().normalize();this.velocity.x+=l.x*this.accel*e,this.velocity.z+=l.z*this.accel*e;const h=Math.hypot(this.velocity.x,this.velocity.z);h>r&&(this.velocity.x=this.velocity.x/h*r,this.velocity.z=this.velocity.z/h*r),this.body.setFacing(Math.atan2(l.x,l.z))}else{const l=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(l),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,kr(this.position,this.radius,i),Hr(this.position,this.radius,s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(o),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class i1{object=new at;position;radius=.4;maxSpeed=5;velocity=new N;dir=new N;body;aoLado=0;folga=2;ordem=null;riding=!1;submersion=0;patins=!1;lado=0;distancia=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}atrelar(t,e){this.lado=t,this.distancia=e,this.ordem=null}soltar(){this.lado=0}get atrelado(){return this.lado!==0}goTo(t,e){this.ordem=new N(t,0,e)}clearOrder(){this.ordem=null}hold(t,e){this.ordem?this.ordem.set(this.position.x,0,this.position.z):this.ordem=new N(this.position.x,0,this.position.z),this.velocity.set(0,0,0),this.body.setFacing(Math.atan2(t-this.position.x,e-this.position.z))}get hasOrder(){return this.ordem!==null}rebocar(t,e,i,s){const o=this.aoLado,a=t.x+Math.sin(o+Math.PI/2)*this.distancia*this.lado,r=t.z+Math.cos(o+Math.PI/2)*this.distancia*this.lado,c=this.position.x,l=this.position.z,h=Math.min(1,e*16);this.position.x+=(a-this.position.x)*h,this.position.z+=(r-this.position.z)*h,kr(this.position,this.radius,i),Hr(this.position,this.radius,s),this.velocity.set((this.position.x-c)/Math.max(e,1e-4),0,(this.position.z-l)/Math.max(e,1e-4)),this.body.setFacing(o),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}set direcaoDoPar(t){this.aoLado=t}update(t,e,i,s){if(this.riding){this.body.update(e,0);return}if(this.lado!==0){this.rebocar(t,e,i,s);return}const o=this.ordem??t,a=this.ordem?.55:this.folga;this.dir.set(o.x-this.position.x,0,o.z-this.position.z);const r=this.dir.length();if(!this.ordem&&r>22){this.teleport(o.x-1.2,o.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(r>a){this.dir.normalize();const d=this.maxSpeed*(this.patins?tu:1),f=Math.min(d,1.6+(r-a)*2.2);this.velocity.x+=(this.dir.x*f-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*f-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),r>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,kr(this.position,this.radius,i),Hr(this.position,this.radius,s);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),u=.86;if(h<u&&h>1e-4){const d=(u-h)/h;this.position.x+=c*d,this.position.z+=l*d}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}const s1=1.7;class o1{grupo=new at;vivos=[];constructor(t){t.add(this.grupo)}soltar(t,e,i,s=1.62){const o=Kh(.6);o.userData.coracao=!0,o.position.set(t.x+e,s,t.z+i),this.grupo.add(o),this.vivos.push({obj:o,vida:0,giro:Math.random()*Math.PI,fx:e,fz:i})}limpar(){for(const t of this.vivos)this.grupo.remove(t.obj);this.vivos.length=0}update(t){for(let e=this.vivos.length-1;e>=0;e--){const i=this.vivos[e];i.vida+=t;const s=i.vida/s1;if(s>=1){this.grupo.remove(i.obj),this.vivos.splice(e,1);continue}i.obj.position.y+=t*.72;const o=(.7+Math.sin(i.vida*3+i.giro)*.25)*t;i.obj.position.x+=i.fx*o,i.obj.position.z+=i.fz*o,i.obj.rotation.y=i.giro+i.vida*1.4;const a=s<.18?s/.18:Math.min(1,(1-s)/.35);i.obj.scale.setScalar(.25+a*.9)}}}const a1=1.5,Bl=.9,kl=1.16,Si=.32,Vr=.42,eu=.34,r1=Si+Vr+eu,c1=.5;class l1{constructor(t){this.coracoes=t}t=-1;descanso=0;alvoA=new N;alvoB=new N;soltouCoracao=!1;onSom=null;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!u1(t,e))return!1;const i=e.position.x-t.position.x,s=e.position.z-t.position.z,o=Math.hypot(i,s);if(o>a1||o<.01)return!1;const a=Math.atan2(i,s);return Math.abs(Na(t.rig.facing,a))<Bl&&Math.abs(Na(e.rig.facing,a+Math.PI))<Bl}iniciar(t,e,i){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const s=e.position.x-t.position.x,o=e.position.z-t.position.z,a=Math.atan2(s,o),r=i+Math.PI/2,c=Math.abs(Na(a,r))<Math.PI/2?r:r+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,u=Math.sin(c)*kl/2,d=Math.cos(c)*kl/2;this.alvoA.set(l-u,0,h-d),this.alvoB.set(l+u,0,h+d),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0)}update(t,e,i){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const s=h1(this.t);if(e.rig.setKiss(s),i.rig.setKiss(s),e.locked=!0,this.t<Si){const o=Math.min(1,t*9);e.position.lerp(this.alvoA,o),i.position.lerp(this.alvoB,o)}if(!this.soltouCoracao&&this.t>=Si*.9){this.soltouCoracao=!0;const o=Math.atan2(i.position.x-e.position.x,i.position.z-e.position.z),a=Math.sin(o),r=Math.cos(o);this.coracoes.soltar(e.position,-a,-r),this.coracoes.soltar(i.position,a,r),this.onSom?.("beijo"),this.onSom?.("coracao")}this.t>=r1&&(this.t=-1,this.descanso=c1,e.rig.setKiss(0),i.rig.setKiss(0),e.locked=!1)}}}function h1(n){return n<Si?Hl(n/Si):n<Si+Vr?1:Hl(Math.max(0,1-(n-Si-Vr)/eu))}function Hl(n){return n*n*(3-2*n)}function u1(n,t){const e=n.rig.spec,i=t.rig.spec;return e.casal===!0&&i.casal===!0&&e.id!==i.id}function Na(n,t){return Math.atan2(Math.sin(n-t),Math.cos(n-t))}const d1=.95,f1=1.8,p1=2.2,m1=.5,Vl=3;class g1{constructor(t){this.coracoes=t}lado=1;ligado=!1;relogio=0;longe=0;onSom=null;get ativo(){return this.ligado}disponivel(t,e){if(this.ligado||t.riding||e.riding||t.submersion>.05||e.submersion>.05||t.locked||e.hasOrder)return!1;const i=Math.hypot(e.position.x-t.position.x,e.position.z-t.position.z);return i>.01&&i<=f1}ligar(t,e){if(this.ligado)return;this.ligado=!0,this.relogio=0,this.longe=0;const i=t.rig.facing,s=e.position.x-t.position.x,o=e.position.z-t.position.z;this.lado=s*Math.sin(i+Math.PI/2)+o*Math.cos(i+Math.PI/2)<0?-1:1,this.aplicar(t,e),this.onSom?.("escolha")}soltar(t,e){this.ligado&&(this.ligado=!1,e.soltar(),t.rig.setHoldingHands(0),e.rig.setHoldingHands(0))}trocouCorpos(t,e){this.ligado&&(this.lado=this.lado===1?-1:1,this.aplicar(t,e))}update(t,e,i){if(!this.ligado)return;if(e.riding||i.riding||e.submersion>.05||i.submersion>.05||i.hasOrder){this.soltar(e,i);return}const s=Math.hypot(i.position.x-e.position.x,i.position.z-e.position.z);if(this.longe=s>p1?this.longe+t:0,this.longe>=m1){this.soltar(e,i);return}if(i.direcaoDoPar=e.rig.facing,this.relogio+=t,this.relogio>=Vl){this.relogio-=Vl;const o=e.position.clone().add(i.position).multiplyScalar(.5);this.coracoes.soltar(o,0,0,2.05),this.onSom?.("coracao")}}aplicar(t,e){e.atrelar(this.lado,d1),e.direcaoDoPar=t.rig.facing,t.rig.setHoldingHands(this.lado),e.rig.setHoldingHands(this.lado===1?-1:1)}}function ce(n,t,e){const i=n.createOscillator();i.type=e.tipo??"sine",i.frequency.setValueAtTime(e.freq,e.quando),e.glide&&i.frequency.exponentialRampToValueAtTime(Math.max(20,e.glide),e.quando+e.dur),e.detune&&i.detune.setValueAtTime(e.detune,e.quando);const s=n.createGain(),o=e.vol??.2,a=e.ataque??.006;s.gain.setValueAtTime(1e-4,e.quando),s.gain.exponentialRampToValueAtTime(o,e.quando+a),s.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur);let r=s;if(e.abafo){const c=n.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(e.abafo,e.quando),s.connect(c),r=c}i.connect(s),r.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}let yo=null;function v1(n){if(!yo||yo.sampleRate!==n.sampleRate){const t=n.createBuffer(1,n.sampleRate,n.sampleRate),e=t.getChannelData(0);for(let i=0;i<e.length;i++)e[i]=Math.random()*2-1;yo=t}return yo}function tn(n,t,e){const i=n.createBufferSource();i.buffer=v1(n),i.loop=!0;const s=n.createBiquadFilter();s.type=e.tipo??"bandpass",s.frequency.setValueAtTime(e.freq??1800,e.quando),e.glide&&s.frequency.exponentialRampToValueAtTime(Math.max(60,e.glide),e.quando+e.dur),s.Q.setValueAtTime(e.q??1.2,e.quando);const o=n.createGain(),a=e.vol??.14;o.gain.setValueAtTime(1e-4,e.quando),o.gain.exponentialRampToValueAtTime(a,e.quando+.008),o.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur),i.connect(s),s.connect(o),o.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}function pe(n){return 440*Math.pow(2,(n-69)/12)}function _1(n){let t=n>>>0;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}const x1=[0,2,4,7,9,12,14,16],Me=72,nu={passo:({ctx:n,destino:t,t:e,n:i})=>{const s=i%2===0;tn(n,t,{quando:e,dur:.075,vol:.05,freq:s?1500:1150,glide:s?700:560,q:.9}),ce(n,t,{freq:s?128:112,quando:e,dur:.06,vol:.045,tipo:"sine"})},nadar:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.34,vol:.07,freq:700,glide:2600,q:.7})},agua:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.42,vol:.2,freq:2400,glide:500,q:.6}),ce(n,t,{freq:420,glide:120,quando:e,dur:.26,vol:.1,tipo:"sine"})},prompt:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+12),quando:e,dur:.09,vol:.055,tipo:"triangle"})},interagir:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+4),quando:e,dur:.12,vol:.13,tipo:"triangle"}),ce(n,t,{freq:pe(Me+11),quando:e+.055,dur:.16,vol:.1,tipo:"sine"})},fala:({ctx:n,destino:t,t:e,n:i})=>{const s=x1[i%4]+(i%8<4?0:2);ce(n,t,{freq:pe(Me+7+s),quando:e,dur:.06,vol:.035,tipo:"square",abafo:2200})},escolha:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+7),quando:e,dur:.07,vol:.08,tipo:"triangle"})},confirma:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+4),quando:e,dur:.1,vol:.12,tipo:"triangle"}),ce(n,t,{freq:pe(Me+9),quando:e+.07,dur:.14,vol:.11,tipo:"triangle"}),ce(n,t,{freq:pe(Me+16),quando:e+.14,dur:.2,vol:.09,tipo:"sine"})},porta:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.3,vol:.11,freq:900,glide:320,q:.8}),ce(n,t,{freq:180,glide:90,quando:e+.16,dur:.2,vol:.09,tipo:"sine"})},memoria:({ctx:n,destino:t,t:e})=>{[0,4,7,12,16].forEach((i,s)=>{ce(n,t,{freq:pe(Me+i),quando:e+s*.075,dur:.42,vol:.11-s*.008,tipo:"triangle"})})},toast:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+9),quando:e,dur:.14,vol:.09,tipo:"sine"}),ce(n,t,{freq:pe(Me+16),quando:e+.08,dur:.22,vol:.07,tipo:"sine"})},trocar:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me),glide:pe(Me+12),quando:e,dur:.18,vol:.09,tipo:"triangle"}),tn(n,t,{quando:e,dur:.2,vol:.05,freq:800,glide:3e3,q:.6})},beijo:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.06,vol:.1,freq:2400,glide:1200,q:2.5}),ce(n,t,{freq:pe(Me+7),quando:e+.02,dur:.1,vol:.08,tipo:"sine"})},coracao:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+12),quando:e,dur:.3,vol:.07,tipo:"sine"}),ce(n,t,{freq:pe(Me+19),quando:e+.09,dur:.36,vol:.05,tipo:"sine"})},lancar:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.26,vol:.12,freq:600,glide:3200,q:.7}),ce(n,t,{freq:300,glide:900,quando:e,dur:.16,vol:.06,tipo:"triangle"})},pegar:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.09,vol:.13,freq:1400,glide:500,q:1.6}),ce(n,t,{freq:pe(Me+9),quando:e+.03,dur:.14,vol:.1,tipo:"triangle"})},quicar:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:220,glide:110,quando:e,dur:.12,vol:.08,tipo:"sine"}),tn(n,t,{quando:e,dur:.1,vol:.06,freq:900,glide:400,q:1})},sorvete:({ctx:n,destino:t,t:e})=>{[0,7,12].forEach((i,s)=>{ce(n,t,{freq:pe(Me+4+i),quando:e+s*.09,dur:.3,vol:.1,tipo:"triangle"})})},pato:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:620,glide:380,quando:e,dur:.13,vol:.1,tipo:"sawtooth",abafo:1400}),ce(n,t,{freq:520,glide:300,quando:e+.15,dur:.12,vol:.08,tipo:"sawtooth",abafo:1200})},tv:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.18,vol:.07,freq:3e3,glide:1200,q:.5}),ce(n,t,{freq:pe(Me+4),quando:e+.1,dur:.18,vol:.07,tipo:"square",abafo:1800})},sino:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+12),quando:e,dur:.9,vol:.09,tipo:"sine"}),ce(n,t,{freq:pe(Me+19),quando:e+.02,dur:.8,vol:.05,tipo:"sine",detune:6})},sentar:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.24,vol:.09,freq:700,glide:260,q:.7})},menu:({ctx:n,destino:t,t:e})=>{ce(n,t,{freq:pe(Me+2),quando:e,dur:.1,vol:.09,tipo:"triangle"}),ce(n,t,{freq:pe(Me+9),quando:e+.06,dur:.14,vol:.07,tipo:"triangle"})},diario:({ctx:n,destino:t,t:e})=>{tn(n,t,{quando:e,dur:.22,vol:.09,freq:1200,glide:3e3,q:.6})},recomecar:({ctx:n,destino:t,t:e})=>{[0,4,7,12].forEach((i,s)=>{ce(n,t,{freq:pe(Me-12+i),quando:e+s*.11,dur:.5,vol:.1,tipo:"triangle"})})}},M1=.2,y1=1.3,Gi=n=>({raiz:n,notas:[0,4,7,11]}),gs=n=>({raiz:n,notas:[0,3,7,10]}),bo=n=>({raiz:n,notas:[0,4,7,10]}),b1=n=>({raiz:n,notas:[0,4,7,9]}),Fa=[0,2,4,7,9,12,14,16,19],S1=[0,2,3,5,7,9,10,12,14],Do={casa:{bpm:82,tonica:41,giro:[Gi(0),gs(9),gs(2),bo(7)],melodia:.62,chocalho:!1,escala:Fa},"villa-lobos":{bpm:100,tonica:36,giro:[Gi(0),Gi(5),gs(9),bo(7)],melodia:.8,chocalho:!0,escala:Fa},clube:{bpm:92,tonica:38,giro:[b1(0),gs(2),Gi(5),bo(7)],melodia:.72,chocalho:!0,escala:Fa},padrao:{bpm:88,tonica:40,giro:[Gi(0),gs(9),Gi(5),bo(7)],melodia:.6,chocalho:!1,escala:S1}},Gl=[[0,2,3,6],[0,3,4,6,7],[2,3,5,6],[0,1,3,6],[0,4,6],[1,3,4,7]];class iu{constructor(t,e){this.ctx=t,this.destino=e}clima=Do.padrao;proximoClima=null;passo=0;proximo=0;timer=null;sorte=_1(20260827);frase=[];grau=2;get tocando(){return this.timer!==null}setClima(t){const e=Do[t]??Do.padrao;e!==this.clima&&(this.tocando?this.proximoClima=e:this.clima=e)}start(){this.timer===null&&(this.proximo=this.ctx.currentTime+.15,this.timer=window.setInterval(()=>this.agendar(),M1*1e3),this.agendar())}stop(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}preAgendar(t){for(this.proximo=0,this.passo=0;this.proximo<t;){this.tocarPasso(this.passo,this.proximo);const e=30/this.clima.bpm;this.proximo+=e*(this.passo%2===0?1.18:.82),this.passo+=1}}agendar(){const t=this.ctx.currentTime+y1;let e=0;for(;this.proximo<t&&e++<64;){this.tocarPasso(this.passo,this.proximo);const i=30/this.clima.bpm;this.proximo+=i*(this.passo%2===0?1.18:.82),this.passo+=1}}tocarPasso(t,e){const i=t%8;i===0&&(this.proximoClima&&(this.clima=this.proximoClima,this.proximoClima=null),(Math.floor(t/8)%2===0||this.frase.length===0)&&(this.frase=Gl[Math.floor(this.sorte()*Gl.length)]));const s=this.clima,o=Math.floor(t/8),a=s.giro[o%s.giro.length],r=s.tonica+a.raiz;if(i===0||i===4){const c=i===0?r:r+(this.sorte()<.4?7:4);ce(this.ctx,this.destino,{freq:pe(c),quando:e,dur:i===0?.6:.45,vol:.2,tipo:"sine",abafo:420})}if(i===2||i===5||i===7&&this.sorte()<.35){const c=r+24;for(const[l,h]of a.notas.entries())l===0&&i!==2||ce(this.ctx,this.destino,{freq:pe(c+h),quando:e,dur:.85,vol:.07,tipo:"triangle",ataque:.03,detune:l%2?5:-5,abafo:2400})}if(this.frase.includes(i)&&this.sorte()<s.melodia){const c=[-2,-1,-1,0,1,1,2];this.grau+=c[Math.floor(this.sorte()*c.length)],this.grau>s.escala.length-3&&(this.grau-=2),this.grau<2&&(this.grau+=2),this.grau=Math.max(0,Math.min(s.escala.length-1,this.grau));const l=i>=6?a.notas[Math.floor(this.sorte()*3)]:s.escala[this.grau],h=s.tonica+31;this.marimba(pe(h+l),e),l<=9&&this.sorte()<.22&&this.marimba(pe(h+l+12),e+.03,.4)}s.chocalho&&i%2===1&&tn(this.ctx,this.destino,{quando:e,dur:.06,vol:i===3||i===7?.035:.02,freq:6200,q:.8})}marimba(t,e,i=1){ce(this.ctx,this.destino,{freq:t,quando:e,dur:.42,vol:.13*i,tipo:"sine"}),t<900&&ce(this.ctx,this.destino,{freq:t*2,quando:e,dur:.1,vol:.04*i,tipo:"sine"})}}const ql="aristory.som",w1=.035;class E1{ctx=null;mestre=null;canalMusica=null;canalEfeitos=null;musica=null;mudo;climaPendente="padrao";contadores=new Map;ultimoEm=new Map;carregando=null;contagem=new Map;constructor(){this.mudo=localStorage.getItem(ql)==="0";const t=()=>this.ligar();for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,t,{once:!1,passive:!0})}get ligado(){return!this.mudo}get pronto(){return this.ctx!==null&&this.ctx.state==="running"}ligar(){if(!this.ctx){const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,this.mestre=e.createGain(),this.mestre.gain.value=this.mudo?0:.9,this.mestre.connect(e.destination),this.canalMusica=e.createGain(),this.canalMusica.gain.value=.9,this.canalMusica.connect(this.mestre),this.canalEfeitos=e.createGain(),this.canalEfeitos.gain.value=1,this.canalEfeitos.connect(this.mestre),this.musica=new iu(e,this.canalMusica),this.musica.setClima(this.climaPendente)}this.ctx.resume().then(()=>{this.mudo||this.musica?.start()})}setMudo(t){if(this.mudo=t,localStorage.setItem(ql,t?"0":"1"),this.mestre&&this.ctx){const e=this.ctx.currentTime;this.mestre.gain.cancelScheduledValues(e),this.mestre.gain.setValueAtTime(this.mestre.gain.value,e),this.mestre.gain.linearRampToValueAtTime(t?0:.9,e+.12)}t?this.musica?.stop():this.ctx?.state==="running"&&this.musica?.start()}setClima(t){this.climaPendente=t,this.musica?.setClima(t)}play(t){if(this.contagem.set(t,(this.contagem.get(t)??0)+1),this.mudo||!this.ctx||!this.canalEfeitos||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(e-(this.ultimoEm.get(t)??-1)<w1)return;this.ultimoEm.set(t,e);const i=(this.contadores.get(t)??0)+1;this.contadores.set(t,i),nu[t]({ctx:this.ctx,destino:this.canalEfeitos,t:e,n:i})}carga(t){if(!this.ctx||!this.canalEfeitos||this.mudo||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(t===null){if(this.carregando){const{osc:s,ganho:o}=this.carregando;o.gain.cancelScheduledValues(e),o.gain.setValueAtTime(o.gain.value,e),o.gain.exponentialRampToValueAtTime(1e-4,e+.08),s.stop(e+.1),this.carregando=null}return}if(!this.carregando){const s=this.ctx.createOscillator();s.type="triangle";const o=this.ctx.createGain();o.gain.setValueAtTime(1e-4,e),o.gain.exponentialRampToValueAtTime(.05,e+.05),s.connect(o),o.connect(this.canalEfeitos),s.start(e),this.carregando={osc:s,ganho:o}}const i=pe(60+t*19);this.carregando.osc.frequency.setTargetAtTime(i,e,.04)}aplauso(){if(!this.ctx||!this.canalEfeitos)return;const t=this.ctx.currentTime;[0,5,9,12].forEach((e,i)=>{ce(this.ctx,this.canalEfeitos,{freq:pe(72+e),quando:t+i*.1,dur:.5,vol:.09,tipo:"triangle"})})}}const T1={magro:.86,medio:1,forte:1.16},Wl=.75,A1=.13,C1={upright:{bracoX:-1.38,bracoZ:.16,balanco:.15,itemZ:0,itemX:0},relaxed:{bracoX:-.22,bracoZ:.46,balanco:.6,itemZ:.9,itemX:.13}};function Oa(n,t,e){const i=new Xo,s=5;for(let a=0;a<s*2;a++){const r=a%2===0?n:n*.46,c=a/(s*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*r,h=Math.sin(c)*r;a===0?i.moveTo(l,h):i.lineTo(l,h)}i.closePath();const o=new dc(i,{depth:t,bevelEnabled:!1});return o.center(),new M(o,e)}class Gr{group=new at;spec;headTop;body=new at;head=new at;armL=new at;armR=new at;maoDir=new at;legL=new at;legR=new at;blob;chapeu=new at;phase=0;bounce=0;beijo=0;maos=0;pose="none";patinando=!1;altoDoPatins=0;alturaDaPerna=0;pes=[];patins=[];targetFacing=0;swimming=!1;sitting=!1;trocaMaterial=[];soVestido=[];soBanho=[];traje="normal";roupa={};extras=new Map;medidas;sobreTronco=[];cabelo;constructor(t){this.spec=t;const e=t.height,i=T1[t.build],s=e*.28,o=e/1.7;this.altoDoPatins=A1*o,this.alturaDaPerna=s;const a=e*.3,r=e*.17,c=s,l=s+a*.86,h=e*.1*i,u=e*.3;this.headTop=s+a+r*2.1,this.medidas={h:e,w:i,headR:r,legH:s,torsoH:a};const d=R(t.skin),f=R(t.shirt),g=R(t.pants),_=R(t.shoes);for(const[C,b]of[[this.legL,-1],[this.legR,1]]){C.position.set(b*e*.055*i,c,0);const y=new M(new kn(e*.042*i,s*.62,4,10),g);y.position.y=-s*.48,C.add(y),this.trocaMaterial.push({mesh:y,normal:g,banho:d,slot:"pernas",parte:"principal"});const D=new M(new V(e*.075*i,e*.045,e*.11),_);D.position.set(0,-s+e*.022,e*.018),C.add(D),this.trocaMaterial.push({mesh:D,normal:_,banho:d,slot:"pes",parte:"principal"}),this.pes.push(D);const F=zr(t.shoes);F.scale.setScalar(o),F.visible=!1,C.add(F),this.patins.push(F),this.body.add(C)}const m=new M(new kn(e*.105*i,a*.5,5,12),f);if(m.position.y=c+a*.52,m.scale.z=.82,this.body.add(m),this.trocaMaterial.push({mesh:m,normal:f,banho:d,slot:"tronco",parte:"principal"}),t.shirtAccent!==void 0){const C=new M(new it(e*.108*i,e*.108*i,e*.03,14,1,!0),R(t.shirtAccent,{doubleSide:!0}));C.position.y=c+a*.72,C.scale.z=.82,this.body.add(C),this.soVestido.push(C),this.sobreTronco.push(C)}if(t.jacket!==void 0){const C=R(t.jacket,{doubleSide:!0}),b=e*.105*i,y=new M(new it(b*1.14,b*1.1,a*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),C);y.position.y=c+a*.56,y.scale.z=.84,this.body.add(y),this.soVestido.push(y),this.sobreTronco.push(y);const D=new M(new Bt(e*.088*i,12,10,0,Math.PI*2,0,Math.PI*.62),R(t.jacket));D.position.set(0,l+a*.04,-b*.75),D.rotation.x=-.7,D.scale.set(1.15,1,.8),this.body.add(D),this.soVestido.push(D),this.sobreTronco.push(D)}const p=new M(new it(e*.118*i,e*.112*i,e*.15,14),R(t.swim??t.pants));p.position.y=c+e*.03,p.scale.z=.85,p.visible=!1,this.body.add(p),this.soBanho.push(p);for(const[C,b]of[[this.armL,-1],[this.armR,1]]){C.position.set(b*h,l,0);const y=t.jacket!==void 0?R(t.jacket):f,D=new M(new kn(e*.038*i,u*.34,4,10),y);D.position.y=-u*.24,C.add(D),this.trocaMaterial.push({mesh:D,normal:y,banho:d,slot:"tronco",parte:"detalhe"});const F=new M(new kn(e*.032*i,u*.28,4,10),d);F.position.y=-u*.66,C.add(F);const B=new M(new Bt(e*.04*i,10,8),d);B.position.y=-u*.92,C.add(B),this.body.add(C)}this.maoDir.position.y=-u*.98,this.armR.add(this.maoDir),this.head.position.y=s+a+r*.92;const w=new M(new it(e*.035,e*.04,e*.05,10),d);w.position.y=-r*.85,this.head.add(w);const x=new M(new Bt(r,20,16),d);x.scale.set(1,1.04,1),this.head.add(x);const v=R(t.eyes);for(const C of[-1,1]){const b=new M(new Bt(r*.14,10,8),v);if(b.position.set(C*r*.35,0,r*.9),b.scale.set(1,1.25,.6),this.head.add(b),t.blush!==void 0){const y=new M(new Ls(r*.16,12),qe(t.blush,.75));y.position.set(C*r*.56,-r*.26,r*.82),y.rotation.y=C*.35,this.head.add(y)}}const P=R(t.hair.color);for(const C of[-1,1]){const b=new M(new V(r*.3,r*.075,r*.06),P);b.position.set(C*r*.35,r*.3,r*.87),b.rotation.z=C*-.12,this.head.add(b)}const E=new M(new _e(r*.16,r*.035,6,14,Math.PI),v);E.position.set(0,-r*.38,r*.9),E.rotation.set(0,0,Math.PI),this.head.add(E);const A=this.head.children.length;this.buildHair(r),this.cabelo=this.head.children.slice(A),this.buildAccessories(r,u,l,h,a,c,i),this.body.add(this.head),this.group.add(this.body),this.blob=new M(new Ls(e*.16*i,18),qe(2832939,.22)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(C=>{C.isMesh&&C!==this.blob&&(C.castShadow=!0,C.receiveShadow=!1)})}buildHair(t){const{style:e,color:i}=this.spec.hair,s=R(i),o=(a,r,c=.62,l=0)=>{const h=new M(new Bt(t*a,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),s);return h.position.y=r,this.head.add(h),h};switch(e){case"raspado":{o(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{o(1.06,t*.04).scale.set(1,.95,.98);const r=new M(new V(t*1.5,t*.34,t*.42),s);r.position.set(0,t*.6,t*.62),r.rotation.x=-.18,this.head.add(r);break}case"franja":{o(1.07,t*.02);const a=new M(new it(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),s);a.position.set(0,t*.5,0),this.head.add(a);break}case"ondulado":{o(1.08,t*.02);for(const a of[-1,1]){const r=new M(new Bt(t*.46,12,10),s);r.position.set(a*t*.85,t*.1,-t*.1),r.scale.set(.8,1.15,1),this.head.add(r)}break}case"coque":{o(1.06,t*.02);const a=new M(new Bt(t*.42,12,10),s);a.position.set(0,t*.72,-t*.82),this.head.add(a);break}case"cachos-curtos":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?R(this.spec.hair.tips):s;o(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[u,d,f,g]of l)for(let _=0;_<d;_++){const m=_/d*Math.PI*2+u*1.9,p=Math.sin(u)*Math.cos(m),w=Math.cos(u),x=Math.sin(u)*Math.sin(m);if(w<.72&&x>.24)continue;const v=new M(new Bt(t*f*(1+(a-1)*.4),8,7),h%5===0?r:s),P=g*(1+(a-1)*.14),E=x>0?.9:1.02;v.position.set(p*t*P,w*t*P,x*t*P*E),this.head.add(v),h++}for(let u=0;u<5;u++){const d=new M(new Bt(t*.2*(1+(a-1)*.3),8,7),u===2?r:s);d.position.set((u-2)*t*.3,t*(.62-u%2*.07),t*.62),this.head.add(d)}for(let u=0;u<3;u++){const d=new M(new Bt(t*.24*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1)*t*.3,t*(.84+u%2*.07),t*.44),this.head.add(d)}for(const u of[-1,1]){const d=new M(new Bt(t*.17,8,7),s);d.position.set(u*t*.9,-t*.12,t*.22),d.scale.set(.7,1.1,.85),this.head.add(d)}break}case"cacheado":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?R(this.spec.hair.tips):s;o(1+(a-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[u,d,f,g]of l)for(let _=0;_<d;_++){const m=_/d*Math.PI*2+u*2.3,p=Math.sin(u)*Math.cos(m),w=Math.cos(u),x=Math.sin(u)*Math.sin(m);if(u>.72&&x>.22)continue;const v=1+(a-1)*.55,P=new M(new Bt(t*f*v,8,7),h%4===0?r:s),E=g*(1+(a-1)*.28),A=x>0?.78:1.06;P.position.set(p*t*E,w*t*E,x*t*E*A),this.head.add(P),h++}for(let u=0;u<4;u++){const d=new M(new Bt(t*.22*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1.5)*t*.34,t*(.62-u%2*.08),t*.62),this.head.add(d)}for(const u of[-1,1]){const d=new M(new Bt(t*.26*a,8,7),s);d.position.set(u*t*1.02*a,-t*.34,t*.28),d.scale.set(.8,1.25,.9),this.head.add(d)}break}}}buildAccessories(t,e,i,s,o,a,r){const c=this.spec.accessories??[],l=R(this.spec.accessoryColor??3093568);{const h=new M(new it(t*.7,t*.7,t*.11,16),R(16774096));h.position.y=t*1.42,this.chapeu.add(h);const u=new M(new Xe(t*.58,t*1.05,14),R(S.gold));u.position.y=t*1.98,this.chapeu.add(u);const d=Oa(t*.3,t*.07,R(16774096));d.position.y=t*2.62,this.chapeu.add(d),this.chapeu.rotation.z=-.14,this.chapeu.visible=!1,this.head.add(this.chapeu)}if(c.includes("oculos")){for(const u of[-1,1]){const d=new M(new _e(t*.24,t*.045,8,16),l);d.position.set(u*t*.36,t*.06,t*.9),this.head.add(d)}const h=new M(new V(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new M(new Bt(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const u=new M(new it(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);u.position.set(0,t*.12,t*.28),u.rotation.x=-.12,this.head.add(u)}if(c.includes("barba")){const h=new M(new Bt(t*.72,14,12),R(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new M(new _e(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const u of[-1,1]){const d=new M(new it(t*.28,t*.28,t*.16,12),l);d.position.set(u*t*1.02,t*.02,0),d.rotation.z=Math.PI/2,this.head.add(d)}}if(c.includes("corrente")){const h=new M(new _e(t*.42,t*.035,6,20),R(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new M(new it(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,u=Oa(t*.3,t*.06,R(15918799));u.position.set(-t*.78*h,t*.92*h,t*.62*h),u.rotation.set(.35,-.6,.3),this.head.add(u)}if(c.includes("laco")){const h=this.spec.height,u=new at,d=h*.105*r,f=new M(new Bt(h*.018,8,6),l);u.add(f);for(const g of[-1,1]){const _=new M(new _e(h*.026,h*.007,6,12),l);_.position.set(g*h*.03,h*.008,0),_.rotation.set(0,g*.5,g*.35),_.scale.set(1,.7,1),u.add(_);const m=new M(new V(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,u.add(m)}u.position.set(0,i-o*.1,d*.86),this.body.add(u),this.soVestido.push(u),this.sobreTronco.push(u)}if(c.includes("cinto")){const h=this.spec.height,u=h*.105*r,d=a+o*.08,f=new M(new it(u*1.04,u*1.04,h*.032,16,1,!0),l);f.position.y=d,f.scale.z=.84,this.body.add(f),this.soVestido.push(f),this.sobreTronco.push(f);const g=new M(new V(h*.032,h*.03,h*.012),R(14210252));g.position.set(0,d,u*.9),this.body.add(g),this.soVestido.push(g),this.sobreTronco.push(g);const _=new M(new _e(h*.028,h*.004,5,12,Math.PI),R(14210252));_.position.set(u*.6,d-h*.012,u*.6),_.rotation.set(0,-.7,Math.PI),this.body.add(_),this.soVestido.push(_),this.sobreTronco.push(_);const m=Oa(h*.016,h*.004,R(14210252));m.position.set(u*.76,d-h*.05,u*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m),this.sobreTronco.push(m)}if(c.includes("mochila")){const h=new M(new V(s*1.7,o*.62,this.spec.height*.09),l);h.position.set(0,a+o*.6,-this.spec.height*.11*r),this.body.add(h),this.soVestido.push(h),this.sobreTronco.push(h);const u=i;for(const d of[-1,1]){const f=new M(new V(this.spec.height*.022,o*.5,this.spec.height*.02),l);f.position.set(d*s*.6,u-o*.2,this.spec.height*.085*r),this.body.add(f),this.soVestido.push(f),this.sobreTronco.push(f)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setCampeao(t){this.chapeu.visible=t}get campeao(){return this.chapeu.visible}setOutfit(t){this.traje=t,this.aplicarVisual()}aplicarVisual(){const t=this.traje==="banho";for(const s of this.trocaMaterial){if(t){s.mesh.material=s.banho;continue}if(this.mostraPele(s.slot,s.parte)){s.mesh.material=s.banho;continue}const o=this.roupa[s.slot];if(!o){s.mesh.material=s.normal;continue}const a=s.parte==="detalhe"?o.corDetalhe??o.cor:o.cor;s.mesh.material=a===void 0?s.normal:R(a)}for(const s of this.soVestido)s.visible=!t;for(const s of this.soBanho)s.visible=t;if(!t&&this.roupa.tronco)for(const s of this.sobreTronco)s.visible=!1;for(const[s,o]of this.extras){const a=this.roupa[s]!==void 0&&(s==="cabeca"||!t)&&!(s==="pes"&&this.patinando);for(const r of o)r.visible=a}for(const s of this.pes)s.visible=!this.patinando;for(const s of this.patins)s.visible=this.patinando;const i=this.roupa.cabeca?.cobreCabelo===!0;for(const s of this.cabelo)s.visible=!i}mostraPele(t,e){for(const i of Object.values(this.roupa))if(i&&(i.pernasNuas&&t==="pernas"&&!this.roupa.pernas||i.bracosNus&&t==="tronco"&&e==="detalhe"))return!0;return!1}vestirRoupa(t){for(const e of ai){const i=t[e]??null;if((this.roupa[e]?.id??null)===i)continue;this.tirarExtras(e);const s=i?Io(i):null;this.roupa[e]=s??void 0,s?.extra&&this.porExtras(e,s)}this.aplicarVisual()}get roupaAtual(){const t={};for(const e of ai){const i=this.roupa[e];i&&(t[e]=i.id)}return t}porExtras(t,e){if(!e.extra&&!e.extraBraco)return;const i=[];e.extra&&(t==="pes"||t==="pernas"?i.push([this.legL,"corpo",-1],[this.legR,"corpo",1]):t==="cabeca"?i.push([this.head,"corpo",1]):i.push([this.body,"corpo",1])),e.extraBraco&&i.push([this.armL,"braco",-1],[this.armR,"braco",1]);const s=[];for(const[o,a,r]of i){const c=a==="braco"?e.extraBraco(this.medidas,r):e.extra(this.medidas,r);c.userData.roupa=e.id,c.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!1)}),o.add(c),s.push(c)}this.extras.set(t,s)}tirarExtras(t){const e=this.extras.get(t);if(e){for(const i of e)i.parent?.remove(i),i.traverse(s=>{const o=s;o.isMesh&&o.geometry.dispose()});this.extras.delete(t)}}setSitting(t){this.sitting=t,t||(this.poeAltura(0),this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setPatins(t){if(this.patinando!==t){this.patinando=t;for(const e of this.patins)e.position.y=-this.alturaDaPerna-this.altoDoPatins;this.aplicarVisual()}}get patinandoAgora(){return this.patinando}segurar(t,e="none"){for(let i=this.maoDir.children.length-1;i>=0;i--)this.maoDir.remove(this.maoDir.children[i]);this.pose=t?e:"none",t&&this.maoDir.add(t)}get segurando(){return this.maoDir.children.length>0}setHoldingHands(t){this.maos=t}get holdingHands(){return this.maos!==0}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let i=this.targetFacing-this.group.rotation.y;if(i=Math.atan2(Math.sin(i),Math.cos(i)),this.group.rotation.y+=i*Math.min(1,t*14),this.beijo>.001){const c=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=c*.3,this.poeAltura(c*.045),this.armL.rotation.set(-c*.55,0,.08+c*.16),this.armR.rotation.set(-c*.55,0,-.08-c*.16),this.head.rotation.x=c*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9;const c=Math.sin(this.phase*2.2)*.17;this.legL.rotation.x=-Math.PI/2+.06+c,this.legR.rotation.x=-Math.PI/2-.02-c,this.armL.rotation.set(-.25,0,-.34),this.armR.rotation.set(-.2,0,.34),this.maos!==0&&(this.maos<0?this.armL:this.armR).rotation.set(.12,0,Wl*.8*this.maos),this.body.rotation.x=-.05,this.poeAltura(Math.sin(this.phase)*.012),this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const c=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+c*.9,this.armR.rotation.x=-1.1-c*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=c*.28,this.legR.rotation.x=-c*.28,this.body.rotation.x=.16,this.poeAltura(Math.sin(this.phase)*.03),this.head.rotation.x=-.14;return}const s=e>.05,o=this.patinando?.9+e*.33:3.2+e*1.9;this.phase+=t*(s?o:1.4);const a=s?this.patinando?Math.min(.34,.12+e*.06):Math.min(.62,.16+e*.14):.04,r=Math.sin(this.phase*(s?2:1));if(this.patinando){const c=s?Math.min(.28,.1+e*.04):.03;this.legL.rotation.z=-Math.max(0,r)*c*1.7,this.legR.rotation.z=Math.max(0,-r)*c*1.7,this.legL.rotation.x=s?r*a*.25:0,this.legR.rotation.x=s?-r*a*.25:0,this.body.rotation.z=r*c*.34;const l=.34+Math.abs(r)*.14;this.armL.rotation.x=s?-r*a*.9:0,this.armR.rotation.x=s?r*a*.9:0,this.armL.rotation.z=-l,this.armR.rotation.z=l}else this.legL.rotation.z=0,this.legR.rotation.z=0,this.body.rotation.z=0,this.legL.rotation.x=s?r*a:0,this.legR.rotation.x=s?-r*a:0,this.armL.rotation.x=s?-r*a*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=s?r*a*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08;if(this.maos!==0){const c=this.maos<0?this.armL:this.armR,l=this.maos<0?this.armR:this.armL;c.rotation.z=Wl*this.maos,c.rotation.x=-.1,l.rotation.x*=.5}if(this.aplicarPose(),this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const c=Math.sin((1-this.bounce)*Math.PI)*.28;this.poeAltura(c),this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const c=s?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.poeAltura(c),this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=s?this.patinando?.16:.06:0,this.head.rotation.x=s?-.05:Math.sin(this.phase*.6)*.03}poeAltura(t){this.body.position.y=t+this.altoDoPatins*(this.patinando?1:0)}aplicarPose(){if(this.pose==="none"||this.maos>0){this.maoDir.rotation.set(0,0,0),this.maoDir.position.x=0;return}const t=C1[this.pose];this.armR.rotation.x=t.bracoX+this.armR.rotation.x*t.balanco,this.armR.rotation.z=t.bracoZ,this.maoDir.rotation.set(-this.armR.rotation.x,0,t.itemZ-this.armR.rotation.z),this.maoDir.position.x=t.itemX}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class P1{renderer;cena=new Th;camera=new nn(30,1,.1,20);pedestal=new at;rig=null;spec=null;giro=0;alvo=0;constructor(t){this.renderer=new Xh({canvas:t,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.cena.add(this.pedestal);const e=new kh(16777215,8952234,1.5);this.cena.add(e);const i=new Lr(16774368,1.5);i.position.set(3,5,4),this.cena.add(i);const s=new Lr(12572927,.5);s.position.set(-3,2,-3),this.cena.add(s)}mostrar(t){if(this.spec?.id===t.id)return;this.rig&&(this.pedestal.remove(this.rig.group),this.rig.dispose()),this.spec=t,this.rig=new Gr(t),this.pedestal.add(this.rig.group);const e=t.height;this.rig.group.position.y=-e*.5,this.camera.position.set(0,e*.04,e*2.28),this.camera.lookAt(0,0,0)}vestir(t){this.rig?.vestirRoupa(t)}girar(t){this.alvo+=t}update(t){this.rig&&(this.giro+=(this.alvo-this.giro)*Math.min(1,t*9),this.pedestal.rotation.y=this.giro,this.rig.update(t,0))}desenhar(){if(!this.rig)return;const t=this.renderer.domElement,e=t.clientWidth,i=t.clientHeight;e<2||i<2||((t.width!==e||t.height!==i)&&this.renderer.setSize(e,i,!1),this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.render(this.cena,this.camera))}dispose(){this.rig?.dispose(),this.rig=null,this.spec=null,this.renderer.dispose()}}class R1{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;if(!this.enabled){this.hot=!1,this.pulse=0,this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const i=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(i*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(i*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}class I1{constructor(t){this.game=t}root=new at;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,i,s,o=0){return t.position.set(e,i,s),t.rotation.y=o,t}ground(t){const e=new De(t.width,t.depth,1,1),i=new M(e,R(t.color));return i.rotation.x=-Math.PI/2,i.position.set(t.x??0,t.y??0,t.z??0),i.receiveShadow=!0,this.root.add(i),i}groundWithHoles(t){const e=t.width/2,i=t.depth/2,s=new Xo;s.moveTo(-e,-i),s.lineTo(e,-i),s.lineTo(e,i),s.lineTo(-e,i),s.closePath();for(const a of t.holes){const r=new Pr,c=a.x-a.width/2,l=a.x+a.width/2,h=-a.z-a.depth/2,u=-a.z+a.depth/2;r.moveTo(c,h),r.lineTo(l,h),r.lineTo(l,u),r.lineTo(c,u),r.closePath(),s.holes.push(r)}const o=new M(new fc(s),R(t.color));return o.rotation.x=-Math.PI/2,o.position.set(t.x??0,t.y??0,t.z??0),o.receiveShadow=!0,this.root.add(o),o}patch(t,e,i,s,o,a=0,r=.01){const c=new M(new De(i,s),R(o,{offset:++this.decalque}));return c.rotation.set(-Math.PI/2,0,0),c.rotation.z=a,c.position.set(t,r,e),c.receiveShadow=!0,this.root.add(c),c}disc(t,e,i,s,o=.01){const a=new M(new Ls(i,28),R(s,{offset:++this.decalque}));return a.rotation.x=-Math.PI/2,a.position.set(t,o,e),a.receiveShadow=!0,this.root.add(a),a}blockBox(t,e,i,s,o=0){this.colliders.push({kind:"box",x:t,z:e,hw:i,hd:s,rot:o})}blockCircle(t,e,i){this.colliders.push({kind:"circle",x:t,z:e,r:i})}blockFrom(t,e=.9){const i=new ss().setFromObject(t),s=i.getSize(new N),o=i.getCenter(new N);this.blockBox(o.x,o.z,s.x/2*e,s.z/2*e,0)}setBounds(t,e,i,s){this.bounds={minX:t,minZ:e,maxX:i,maxZ:s}}wall(t,e,i,s,o=3,a=15984595,r=.3){const c=i-t,l=s-e,h=Math.hypot(c,l),u=Math.atan2(l,c),d=new M(new V(h,o,r),R(a));return d.position.set((t+i)/2,o/2,(e+s)/2),d.rotation.y=-u,this.add(d),this.blockBox((t+i)/2,(e+s)/2,h/2,r/2,-u),d}interact(t){const e=new R1(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}banco(t,e,i=0,s){const o=this.add(this.place(Yh(s),t,0,e,i));this.blockBox(t,e,.95,.35,i);const a=new we;a.position.set(t,0,e),a.rotation.y=i+Math.PI,this.root.add(a);const r=new we;r.position.set(t,.9,e),this.root.add(r);const c=.06,l=.46;return this.interact({id:`banco:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:1.9,label:"Sentar no banco",icon:"🪑",highlight:o,onInteract:async h=>{h.lockPlayer(!0),h.ridePlayer(a,new N(-l,c,.02),1,Math.PI),h.rideCompanion(a,new N(l,c,.02),1,Math.PI),h.setSitting(!0),h.focusCamera(r),await h.wait(.5),await h.say(["Senta aqui um pouco."],h.companionName()),await h.say(["Só um pouquinho."],h.playerName());let u=0;for(;u===0;)u=await h.ask("Ficar mais um pouco?",["Ficar","Levantar"]),u===0&&await h.wait(4);h.setSitting(!1),h.focusCamera(null);const d=i,f=Math.sin(d)*1.5,g=Math.cos(d)*1.5;h.releasePlayer(t+f-Math.cos(d)*.5,e+g+Math.sin(d)*.5,d),h.releaseCompanion(t+f+Math.cos(d)*.5,e+g-Math.sin(d)*.5,d),h.lockPlayer(!1)}}),o}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}const vn={x:.5,y:.44},mn=n=>1/(1+8.5*n),L1=(n,t,e,i,s)=>{const o=mn(e);return{x:(vn.x+n*o)*i,y:(vn.y+t*o)*s}},cn=.56,Xl=-.44,pn=.62,za=-.28,Yl=-.34,_n={ariCabelo:"#8f5c33",ariRoupa:"#e8e2d6",ariPele:"#f2cfb2",renanCabelo:"#1f1712",renanRoupa:"#1b1c22",renanPele:"#efc8a4",perna:"#15161c"},Ae={ceuTopo:"#0a1120",ceuBaixo:"#2b3d58",vigaFrente:"#6d4028",vigaBaixo:"#3c2115",longarina:"#7d4d31",tijolo:"#b1613f",tijoloSombra:"#7e4029",tijoloJunta:"#cd8461",base:"#8a8781",chaoPerto:"#8b7a51",chaoLonge:"#4a4536",junta:"#6f6650",tatil:"#77746b",tatilRisco:"#95928a",folhaClara:"#2c5741",folhaEscura:"#16301f",fio:"#5d5346",luz:"#ffd489",luzNucleo:"#fff8e6"},ge={ceuTopo:"#1f74c8",ceuBaixo:"#a9d9f2",mataLonge:"#4d7f4a",mataPerto:"#356b39",gramaAlta:"#8fae55",gramaBaixa:"#a8bd68",sombra:"#5f7a3c",inflavelClaro:"#eeeae2",inflavelCinza:"#cfd2d4",inflavelRosa:"#f06a9c",bannerXadrez:"#3f8fd1",bannerFundo:"#fbfaf6",bannerRosa:"#ef5ba1",bannerTexto:"#e0357f",gato:"#fdfcf9",gatoTraco:"#3b3630",lacoVermelho:"#e0342f",verdeBrinquedo:"#57bd45",verdeBrinquedoFundo:"#3f9a32",azulBrinquedo:"#3aa9e8",azulBrinquedoFundo:"#2681bd",amareloBrinquedo:"#f5c518",roxoBrinquedo:"#8f5cc4",torre:"#f5822c",grade:"#3f6fbd"},jl=["#e8442f","#f5c518","#3d9be0","#f07ab0","#f7f4ec","#6fc04a","#f5822c","#a069c4"];function D1(n,t,e,i,s){n.strokeStyle=s,n.lineCap="round",n.lineWidth=Math.max(1.2,i*.04),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(t-i*.07,e-i*.55,t,e-i),n.stroke();const o=e-i;n.lineWidth=Math.max(1.6,i*.1);for(let a=0;a<9;a++){const r=-Math.PI*.94+a/8*Math.PI*.88,c=i*(.42+.14*Math.sin(a*1.7));n.beginPath(),n.moveTo(t,o+i*.04),n.quadraticCurveTo(t+Math.cos(r)*c*.62,o+Math.sin(r)*c*.58,t+Math.cos(r)*c,o+Math.sin(r)*c+c*.34),n.stroke()}}function U1(n,t,e,i,s){if(i>1.4){const o=n.createRadialGradient(t,e,0,t,e,i*6);o.addColorStop(0,`rgba(255, 206, 128, ${.58*s})`),o.addColorStop(.45,`rgba(255, 178, 96, ${.18*s})`),o.addColorStop(1,"rgba(255, 170, 90, 0)"),n.fillStyle=o,n.beginPath(),n.arc(t,e,i*6,0,Math.PI*2),n.fill()}n.fillStyle=Ae.luz,n.globalAlpha=s,n.beginPath(),n.arc(t,e,i,0,Math.PI*2),n.fill(),n.fillStyle=Ae.luzNucleo,n.beginPath(),n.arc(t,e,i*.45,0,Math.PI*2),n.fill(),n.globalAlpha=1}function Ho(n,t,e,i,s,o,a,r){const c=i*.3;n.strokeStyle=_n.perna,n.lineWidth=i*.075,n.lineCap="round";for(const l of[-1,1])n.beginPath(),n.moveTo(t,e-i*.42),n.lineTo(t+l*c*.26*a,e),n.stroke();if(r){n.strokeStyle=r,n.lineWidth=i*.055;for(const l of[-1,1])n.beginPath(),n.moveTo(t+l*c*.42,e-i*.72),n.lineTo(t+l*c*.52,e-i*.44),n.stroke()}n.fillStyle=s,n.beginPath(),n.roundRect(t-c/2,e-i*.78,c,i*.4,c*.32),n.fill(),n.fillStyle=o,n.beginPath(),n.arc(t,e-i*.87,i*.11,0,Math.PI*2),n.fill()}function Ba(n,t,e,i,s,o,a,r,c,l){const h=(t+i)/2,u=(e+s)/2+o,d=f=>{const g=1-f;return{x:g*g*t+2*g*f*h+f*f*i,y:g*g*e+2*g*f*u+f*f*s}};n.strokeStyle="rgba(240, 240, 235, 0.85)",n.lineWidth=Math.max(.8,a*.05),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(h,u,i,s),n.stroke();for(let f=0;f<r;f++){const g=(f+.5)/r,_=d(Math.max(0,g-.012)),m=d(Math.min(1,g+.012)),p=m.x-_.x,w=m.y-_.y,x=Math.hypot(p,w)||1,v=-w/x,P=p/x,E=Math.sin(l*1.1+f*.8)*a*.06;n.fillStyle=jl[(f+c)%jl.length],n.beginPath(),n.moveTo(_.x,_.y),n.lineTo(m.x,m.y),n.lineTo((_.x+m.x)/2-v*a+E,(_.y+m.y)/2-P*a),n.closePath(),n.fill()}}function N1(n,t,e,i){n.fillStyle=ge.gato;for(const s of[-1,1])n.beginPath(),n.moveTo(t+s*i*.92,e-i*.28),n.lineTo(t+s*i*.62,e-i*1.15),n.lineTo(t+s*i*.16,e-i*.6),n.closePath(),n.fill();n.beginPath(),n.ellipse(t,e,i,i*.82,0,0,Math.PI*2),n.fill(),n.fillStyle=ge.lacoVermelho;for(const s of[-1,1])n.beginPath(),n.ellipse(t+i*(.78+s*.24),e-i*.5,i*.26,i*.2,0,0,Math.PI*2),n.fill();n.fillStyle=ge.gatoTraco;for(const s of[-1,1])n.beginPath(),n.ellipse(t+s*i*.36,e-i*.02,i*.09,i*.13,0,0,Math.PI*2),n.fill();n.fillStyle=ge.amareloBrinquedo,n.beginPath(),n.ellipse(t,e+i*.14,i*.11,i*.08,0,0,Math.PI*2),n.fill(),n.strokeStyle=ge.gatoTraco,n.lineWidth=Math.max(.5,i*.05);for(const s of[-1,1])for(let o=-1;o<=1;o++)n.beginPath(),n.moveTo(t+s*i*.6,e+i*.1+o*i*.14),n.lineTo(t+s*i*1.02,e+i*.04+o*i*.2),n.stroke()}function So(n,t,e,i,s,o,a){const r=Math.min(s*.42,i*.2);n.fillStyle=o,n.beginPath(),n.roundRect(t,e,i,s,r),n.fill(),n.strokeStyle=a,n.lineWidth=Math.max(.7,s*.045);const c=Math.max(2,Math.round(i/(s*.75)));for(let l=1;l<c;l++){const h=t+i*l/c;n.beginPath(),n.moveTo(h,e+s*.14),n.lineTo(h,e+s*.86),n.stroke()}n.strokeStyle="rgba(255, 255, 255, 0.34)",n.lineWidth=Math.max(.8,s*.07),n.beginPath(),n.moveTo(t+r,e+s*.16),n.lineTo(t+i-r,e+s*.16),n.stroke()}function F1(n,t,e,i){const s=(x,v,P)=>L1(x,v,P,t,e),o=vn.y*e,a=n.createLinearGradient(0,0,0,o);a.addColorStop(0,Ae.ceuTopo),a.addColorStop(1,Ae.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,o);const r=n.createLinearGradient(0,o,0,e);r.addColorStop(0,Ae.chaoLonge),r.addColorStop(1,Ae.chaoPerto),n.fillStyle=r,n.fillRect(0,o,t,e-o);const c=n.createRadialGradient(vn.x*t,e*.86,0,vn.x*t,e*.86,t*.62);c.addColorStop(0,"rgba(255, 196, 122, 0.3)"),c.addColorStop(1,"rgba(255, 190, 120, 0)"),n.fillStyle=c,n.fillRect(0,o,t,e-o),n.strokeStyle=Ae.junta;for(let x=0;x<26;x++){const v=x*.036,P=s(-pn,cn,v),E=s(pn,cn,v);n.globalAlpha=Math.min(.42,.42*mn(v)*3.2),n.lineWidth=Math.max(.5,3*mn(v)),n.beginPath(),n.moveTo(P.x,P.y),n.lineTo(E.x,E.y),n.stroke()}n.globalAlpha=.22,n.lineWidth=1;for(let x=-6;x<=6;x++){if(x===0)continue;const v=s(x*.1,cn,0);n.beginPath(),n.moveTo(vn.x*t,vn.y*e),n.lineTo(v.x,v.y),n.stroke()}n.globalAlpha=1;const l=s(-.05,cn,0),h=s(.05,cn,0),u=s(-.05,cn,.97),d=s(.05,cn,.97);n.fillStyle=Ae.tatil,n.beginPath(),n.moveTo(l.x,l.y),n.lineTo(h.x,h.y),n.lineTo(d.x,d.y),n.lineTo(u.x,u.y),n.closePath(),n.fill(),n.strokeStyle=Ae.tatilRisco;for(let x=0;x<22;x++){const v=x*.042,P=s(-.038,cn,v),E=s(.038,cn,v);n.lineWidth=Math.max(.5,3.2*mn(v)),n.beginPath(),n.moveTo(P.x,P.y),n.lineTo(E.x,E.y),n.stroke()}for(let x=5;x>=0;x--){const v=.12+x*.15,P=mn(v);for(const E of[-1,1]){const A=s(E*(pn+.13),cn,v);D1(n,A.x,A.y,e*.85*P,x%2===0?Ae.folhaEscura:Ae.folhaClara)}}for(let x=7;x>=0;x--){const v=x*.115,P=mn(v),E=t*.085*P;for(const A of[-1,1]){const C=s(A*pn,cn,v),b=s(A*pn,za,v),y=C.x-E/2;n.fillStyle=Ae.tijolo,n.fillRect(y,b.y,E,C.y-b.y),n.fillStyle=Ae.tijoloSombra,n.fillRect(A<0?y+E*.68:y,b.y,E*.32,C.y-b.y);const D=(C.y-b.y)*.09;if(n.fillStyle=Ae.base,n.fillRect(y-E*.06,C.y-D,E*1.12,D),v<.3){n.strokeStyle=Ae.tijoloJunta,n.lineWidth=Math.max(.5,1.6*P),n.globalAlpha=.5;const F=C.y-D;for(let B=1;B<14;B++){const G=b.y+(F-b.y)*B/14;n.beginPath(),n.moveTo(y,G),n.lineTo(y+E,G),n.stroke()}n.globalAlpha=1}}}n.strokeStyle=Ae.longarina,n.lineCap="butt";for(const x of[-1,1]){const v=s(x*pn*1.05,za,0),P=s(x*pn*1.05,za,.95);n.lineWidth=t*.03,n.beginPath(),n.moveTo(v.x,v.y),n.lineTo(P.x,P.y),n.stroke()}for(let x=17;x>=0;x--){const v=x*.052,P=mn(v),E=s(-pn*1.16,Xl,v),A=s(pn*1.16,Xl,v),C=Math.max(1,e*.05*P);n.fillStyle=Ae.vigaFrente,n.fillRect(E.x,E.y,A.x-E.x,C),n.fillStyle=Ae.vigaBaixo,n.fillRect(E.x,E.y+C*.62,A.x-E.x,C*.38)}const f=9;for(let x=0;x<f;x++){const v=.02+x*.095,P=v+.095,E=x%2===0?-1:1,A=s(E*pn*1.02,Yl,v),C=s(-E*pn*1.02,Yl,P),b=e*.06*mn(v),y=(A.x+C.x)/2,D=(A.y+C.y)/2+b;n.strokeStyle=Ae.fio,n.lineWidth=Math.max(.4,1.8*mn(v)),n.beginPath(),n.moveTo(A.x,A.y),n.quadraticCurveTo(y,D,C.x,C.y),n.stroke();const F=7;for(let B=0;B<=F;B++){const G=B/F,X=1-G,K=X*X*A.x+2*X*G*y+G*G*C.x,st=X*X*A.y+2*X*G*D+G*G*C.y,J=mn(v+(P-v)*G),ot=.82+.18*Math.sin(i*1.6+x*2.1+B*.9);U1(n,K,st+e*.012*J,Math.max(.7,t*.015*J),ot)}}const g=n.createRadialGradient(vn.x*t,vn.y*e-e*.02,0,vn.x*t,vn.y*e-e*.02,t*.085);g.addColorStop(0,"rgba(255, 232, 182, 0.9)"),g.addColorStop(.35,"rgba(255, 196, 118, 0.34)"),g.addColorStop(1,"rgba(255, 180, 100, 0)"),n.fillStyle=g,n.fillRect(0,0,t,e);const _=Math.sin(i*2.4),m=s(0,cn,.66),p=e*.5*mn(.66);Ho(n,m.x-p*.34,m.y,p,_n.ariRoupa,_n.ariCabelo,_),Ho(n,m.x+p*.34,m.y,p,_n.renanRoupa,_n.renanCabelo,-_),n.fillStyle="rgba(255, 176, 96, 0.07)",n.fillRect(0,0,t,e);const w=n.createRadialGradient(t/2,e*.48,t*.2,t/2,e*.48,t*.78);w.addColorStop(0,"rgba(0, 0, 0, 0)"),w.addColorStop(1,"rgba(6, 9, 16, 0.62)"),n.fillStyle=w,n.fillRect(0,0,t,e)}function O1(n,t,e,i){const o=.585*e,a=n.createLinearGradient(0,0,0,o);a.addColorStop(0,ge.ceuTopo),a.addColorStop(1,ge.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,o);for(const[w,x,v,P]of[[-.05,.5,.15,ge.mataLonge],[.42,1.05,.125,ge.mataLonge],[-.05,1.05,.08,ge.mataPerto]]){n.fillStyle=P,n.beginPath(),n.moveTo(w*t,o);for(let E=w;E<=x;E+=.035){const A=o-v*e*(.6+.4*Math.abs(Math.sin(E*27)));n.lineTo(E*t,A)}n.lineTo(x*t,o),n.closePath(),n.fill()}const r=.235*e;n.fillStyle=ge.inflavelClaro,n.beginPath(),n.moveTo(0*t,o),n.lineTo(.245*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,o),n.closePath(),n.fill(),n.fillStyle=ge.inflavelCinza,n.beginPath(),n.moveTo(0*t,o),n.lineTo(.245*t,r),n.lineTo(.315*t,r),n.lineTo(.14*t,o),n.closePath(),n.fill(),n.fillStyle=ge.inflavelCinza,n.beginPath(),n.moveTo(.235*t,r+.012*e),n.lineTo(.325*t,.175*e),n.lineTo(.412*t,r+.012*e),n.closePath(),n.fill(),n.fillStyle=ge.inflavelRosa,n.beginPath(),n.moveTo(.055*t,o-.075*e),n.lineTo(.47*t,o-.075*e),n.lineTo(.485*t,o-.035*e),n.lineTo(.04*t,o-.035*e),n.closePath(),n.fill(),n.fillStyle="rgba(112, 126, 138, 0.34)",n.beginPath(),n.moveTo(.325*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,o),n.lineTo(.33*t,o),n.closePath(),n.fill(),n.fillStyle="rgba(84, 95, 105, 0.5)",n.beginPath(),n.roundRect(.135*t,o-.075*e,.145*t,.04*e,.014*t),n.fill(),n.strokeStyle="rgba(138, 148, 156, 0.75)",n.lineWidth=Math.max(.8,e*.0045);for(let w=1;w<6;w++){const x=w/6;n.beginPath(),n.moveTo((.245+x*.155)*t,r),n.lineTo((0+x*.5)*t,o),n.stroke()}const c=.42*t,l=.425*e,h=.62*t,u=.075*e;n.fillStyle=ge.bannerFundo,n.fillRect(c,l,h,u),n.fillStyle=ge.bannerXadrez;const d=u/3;for(let w=0;w<h;w+=d)for(let x=0;x<u;x+=d)(w<d*2.2||w>h-d*5.5)&&Math.round(w/d+x/d)%2===0&&n.fillRect(c+w,l+x,d,d);n.fillStyle=ge.bannerRosa,n.fillRect(c+h-d*4.4,l,d*4.4,u),n.fillStyle="rgba(255, 255, 255, 0.85)";for(let w=0;w<3;w++)n.fillRect(c+h-d*4,l+u*(.25+w*.2),d*3.4,u*.08);N1(n,c+h-d*6.4,l+u*.46,u*.4),n.fillStyle=ge.bannerTexto,n.font=`900 ${Math.round(u*.42)}px system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText("ARRAIÁ",c+h*.42,l+u*.5),n.textAlign="left",n.textBaseline="alphabetic",So(n,.05*t,o-.055*e,.13*t,.055*e,ge.roxoBrinquedo,"#6f45a0"),So(n,.36*t,o-.085*e,.12*t,.085*e,ge.azulBrinquedo,ge.azulBrinquedoFundo),So(n,.47*t,o-.05*e,.06*t,.05*e,ge.amareloBrinquedo,"#cf9f0e"),So(n,.52*t,o-.075*e,.5*t,.075*e,ge.verdeBrinquedo,ge.verdeBrinquedoFundo),n.strokeStyle=ge.grade,n.lineWidth=Math.max(.7,e*.0035);for(let w=0;w<9;w++){const x=(.19+w*.019)*t;n.beginPath(),n.moveTo(x,o-.035*e),n.lineTo(x,o),n.stroke()}n.beginPath(),n.moveTo(.185*t,o-.032*e),n.lineTo(.36*t,o-.032*e),n.stroke(),n.strokeStyle=ge.torre,n.lineWidth=Math.max(1.2,t*.008),n.beginPath(),n.moveTo(.9*t,o+.3*e),n.lineTo(.955*t,o-.09*e),n.moveTo(1.02*t,o+.3*e),n.lineTo(.985*t,o-.09*e),n.stroke(),n.lineWidth=Math.max(.8,t*.005);for(let w=0;w<7;w++){const x=w/7,v=o-.09*e+x*.39*e,P=o-.09*e+(w+1)/7*.39*e,E=.955+x*(.9-.955),A=.985+x*(1.02-.985),C=.955+(w+1)/7*(.9-.955),b=.985+(w+1)/7*(1.02-.985);n.beginPath(),n.moveTo(E*t,v),n.lineTo(b*t,P),n.moveTo(A*t,v),n.lineTo(C*t,P),n.stroke()}const f=n.createLinearGradient(0,o,0,e);f.addColorStop(0,ge.gramaAlta),f.addColorStop(1,ge.gramaBaixa),n.fillStyle=f,n.fillRect(0,o,t,e-o),n.fillStyle="#c6b184",n.beginPath(),n.moveTo(0,o),n.lineTo(t,o),n.lineTo(t,o+.028*e);for(let w=1;w>=0;w-=.05)n.lineTo(w*t,o+(.026+.008*Math.sin(w*21))*e);n.closePath(),n.fill();const g=n.createRadialGradient(.44*t,.92*e,0,.44*t,.92*e,.62*t);g.addColorStop(0,"rgba(78, 100, 50, 0.34)"),g.addColorStop(.6,"rgba(78, 100, 50, 0.16)"),g.addColorStop(1,"rgba(78, 100, 50, 0)"),n.fillStyle=g,n.fillRect(0,o,t,e-o),n.fillStyle=ge.sombra,n.globalAlpha=.16;for(const[w,x,v,P,E]of[[.2,.87,.16,.045,.2],[.66,.9,.2,.05,-.15],[.38,.99,.3,.06,.05],[.86,.83,.13,.035,.3]])n.beginPath(),n.ellipse(w*t,x*e,v*t,P*e,E,0,Math.PI*2),n.fill();n.globalAlpha=1;const _=Math.sin(i*2.1),m=.185*e;Ho(n,.4*t,.86*e,m,_n.ariRoupa,_n.ariCabelo,_,_n.ariPele),Ho(n,.49*t,.86*e,m,_n.renanRoupa,_n.renanCabelo,-_,_n.renanPele),Ba(n,-.04*t,.1*e,1.04*t,.045*e,.028*e,.05*e,15,0,i),Ba(n,-.04*t,.235*e,1.04*t,.145*e,.03*e,.045*e,16,3,i),Ba(n,-.04*t,.33*e,1.04*t,.3*e,.026*e,.038*e,18,6,i),n.fillStyle="rgba(255, 236, 180, 0.09)",n.fillRect(0,0,t,e);const p=n.createRadialGradient(t/2,e*.5,t*.3,t/2,e*.5,t*.85);p.addColorStop(0,"rgba(0, 0, 0, 0)"),p.addColorStop(1,"rgba(20, 30, 40, 0.3)"),n.fillStyle=p,n.fillRect(0,0,t,e)}const qr=[{id:"o-pedido",titulo:"O pedido",lugar:"onde a gente começou, oficialmente",legenda:"As luzinhas iam até onde a gente não enxergava mais. A gente foi junto.",proporcao:3/4,pintar:F1},{id:"arraia",titulo:"O arraiá da Hello Kitty",lugar:"Parque Villa-Lobos, em junho",legenda:"Um campo inteiro de brinquedo inflável, e a gente parado olhando com cara de criança.",proporcao:3/4,pintar:O1}];class z1{constructor(t,e,i,s=Object.keys(e)[0]){this.root=t,this.scenes=e,this.dupla=i,this.cenaInicial=s,this.renderer=new Xh({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=sh,t.appendChild(this.renderer.domElement),this.ui=new e1(t),this.previa=new P1(this.ui.canvasDoBoneco()),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onTouchGirar=a=>this.input.tapGirar(a),this.ui.onEscolherSlot=a=>this.setActiveHandSlot(a),this.ui.onMoverItem=(a,r)=>this.moveItem(a,r),this.ui.onDescartar=a=>this.descartarDaVaga(a),this.ui.onAbrirMochila=()=>this.pintarMochila(),this.ui.onAbrirArmario=()=>this.pintarArmario(),this.ui.onGirarBoneco=a=>this.previa.girar(a),this.ui.onTirarParte=a=>{const r=this.playerId(),c=this.save.vestiveis(r)[a];if(c){if(this.save.despir(r,a),this.save.guardar(r,c)==="cheio"){this.save.vestir(r,c),this.ui.toast("Mochila cheia","🎒");return}this.audio.play("escolha"),this.pintarArmario()}},this.ui.onVestirPeca=a=>{const r=this.playerId(),c=this.save.acervo(r).find(u=>u.id===a)??this.save.maos(r).find(u=>u?.id===a)??null;if(!c)return;const l=c.slot?ai.indexOf(c.slot):-1;if(l<0)return;const h=this.save.vestiveis(r)[l];this.save.largar(r,a),h&&this.save.despir(r,l),this.save.vestir(r,c),h&&this.save.guardar(r,h),this.audio.play("escolha"),this.pintarArmario()},this.ui.onTouchHold=a=>this.input.setVirtualDown("KeyF",a),this.ui.onRestart=()=>this.restart(),this.ui.som=a=>this.audio.play(a),this.ui.onToggleSom=()=>{this.audio.setMudo(this.audio.ligado),this.ui.setSom(this.audio.ligado),this.audio.ligado&&this.audio.play("menu")},this.ui.setSom(this.audio.ligado),this.input=new hv(this.renderer.domElement),this.hemi=new kh(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new Lr(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const o=this.sun.shadow.camera;o.left=-22,o.right=22,o.top=22,o.bottom=-22,o.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new n1(new Gr(i[0])),this.scene.add(this.player.object),this.coracoes=new o1(this.scene),this.beijo=new l1(this.coracoes),this.beijo.onSom=a=>this.audio.play(a),this.maos=new g1(this.coracoes),this.maos.onSom=a=>this.audio.play(a),this.parceiro=new i1(new Gr(i[1]??i[0])),this.parceiro.setVisible(i.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new Th;iso=new lv;input;ui;save=new vc;previa;player;parceiro;clock=new Tf;coracoes;beijo;maos;audio=new E1;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;naMao=new Map;trilha=0;elapsed=0;shadowSpan=0;traje="normal";moveDir=new N;camAim=new N;camOmbro=null;async start(t,e){const i=t??(this.scenes[this.save.scene]?this.save.scene:this.cenaInicial);this.build(i,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}restart(){this.save.reset(),this.ui.setMemories(this.save.memories),this.player.rig.spec.id!==this.dupla[0].id&&this.swapCharacters(),this.ui.showHints(),this.goTo(this.cenaInicial),this.audio.play("recomecar"),this.ui.toast("Do começo, então","🔄")}build(t,e){const i=this.scenes[t];if(!i)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const s=new I1(this);s.setSeed(B1(t)),i.build(s),this.scene.add(s.root),this.current={def:i,world:s},this.applyAmbient(i.ambient);const o=e&&i.entries?.[e]||i.spawn;this.player.teleport(o.x,o.z,o.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const a=(o.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(o.x+Math.sin(a)*1.3,o.z+Math.cos(a)*1.3,o.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.maos.soltar(this.player,this.parceiro),this.coracoes.limpar(),this.podeBeijar=!1,this.camOmbro=null,this.ui.showPlacar(null),this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(i.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(i.name,i.subtitle),this.audio.setClima(t),this.migrarPremios(),this.aplicarPremios(),this.save.scene=t}aplicarPremios(){this.sincronizarVestiveis()}migrarPremios(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id;this.save.flag(`chapeu-ping-pong:${e}`)&&(this.save.achouItem(e,se.chapeuPingPong.id)||this.save.vestir(e,se.chapeuPingPong))}}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new oe(t.sky),this.scene.fog=t.fog!==void 0?new rc(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const i=this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.memoriasOpen||this.transitioning;this.input.blocked=i||this.player.locked,this.input.justPressed("KeyJ")&&!this.ui.menuOpen&&this.ui.toggleJournal(),(this.input.justPressed("KeyI")||this.input.justPressed("Tab"))&&!this.ui.menuOpen&&!this.ui.dialogueOpen&&(this.ui.armarioOpen?this.ui.fecharArmario():this.ui.mochilaOpen?this.ui.closeMochila():this.abrirMochila()),this.ui.armarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharArmario(),this.ui.memoriasOpen&&this.input.justPressed("Escape")&&this.ui.fecharMemorias(),this.ui.memoriasOpen&&(this.input.justPressed("ArrowLeft")&&this.ui.folhear(-1),this.input.justPressed("ArrowRight")&&this.ui.folhear(1)),(this.ui.mochilaOpen||this.ui.armarioOpen?!this.ui.dialogueOpen&&!this.ui.menuOpen&&!this.transitioning:!i)&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),i||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1)),!i&&!this.player.locked&&this.input.justPressed("KeyH")&&this.maoNaMao();const a=this.input.justPressed("KeyE")||this.input.justPressed("Space");a&&this.ui.handleAction()||(a&&!i&&this.hot&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.audio.play("interagir"),this.hot.trigger(this)):a&&!i&&this.podeBeijar&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)):a&&!i&&!this.player.locked&&this.maoNaMao()),this.beijo.update(t,this.player,this.parceiro),this.maos.update(t,this.player,this.parceiro);const r=this.input.move();this.iso.screenToWorld(r.x,r.y,this.moveDir);const c=this.player.position.clone();this.player.update(this.moveDir,t,e.colliders,e.bounds),this.ouvirPassos(c),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.coracoes.update(t),this.sincronizarMaos(),this.sincronizarVestiveis(),this.updateHot(e,t),this.updateBeijo();for(const u of e.updaters)u(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const l=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(l);const h=l/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*h,this.camAim.y+20*h,this.camAim.z+9*h),this.renderer.render(this.scene,this.camOmbro??this.iso.camera),this.ui.armarioOpen&&(this.previa.update(t),this.previa.desenhar()),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.ui.menuOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro)}maoNaMao(){this.maos.ativo?(this.maos.soltar(this.player,this.parceiro),this.audio.play("escolha")):this.maos.disponivel(this.player,this.parceiro)&&this.maos.ligar(this.player,this.parceiro)}ouvirPassos(t){if(this.player.riding||this.player.locked)return;const e=Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z);if(e<5e-4){this.trilha=0;return}this.trilha+=e;const i=this.player.submersion>.05?1.05:.62;this.trilha>=i&&(this.trilha=0,this.audio.play(this.player.submersion>.05?"nadar":"passo"))}updateHot(t,e){let i=null,s=1/0,o=-1/0;const a=this.player.position.x,r=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(a,r);l>c.radius||c.priority<o||c.priority===o&&l>=s||(i=c,s=l,o=c.priority)}i!==this.hot&&(this.hot?.setHot(!1),i?.setHot(!0),this.hot=i,i&&!this.player.locked?this.ui.showPrompt(i.icon,i.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,i){return this.ui.ask(t,e,i??this.player.name)}toast(t,e){this.audio.play("toast"),this.ui.toast(t,e)}som(t){this.audio.play(t)}goTo(t,e){this.transitioning||(this.transitioning=!0,this.audio.play("porta"),(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setCameraOmbro(t,e){if(!t){this.camOmbro=null;return}this.camOmbro||(this.camOmbro=new nn(58,window.innerWidth/window.innerHeight,.1,400)),this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.position.copy(t),e&&this.camOmbro.lookAt(e),this.camOmbro.updateProjectionMatrix()}pointer(){return this.input.pointer()}showPlacar(t){this.ui.showPlacar(t)}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}addItem(t,e=this.playerId()){const i=this.save.pegar(e,t);return i==="cheio"&&this.ui.toast("Mochila cheia","🎒"),(i==="mao"||i==="guardado")&&this.repintarMochila(),i}storeItem(t,e=this.playerId()){const i=this.save.guardar(e,t);return i!=="cheio"&&i!=="repetido"&&this.repintarMochila(),i}removeItem(t,e=this.playerId()){const i=this.save.largar(e,t);return i&&this.repintarMochila(),i}hasItem(t,e=this.playerId()){return this.save.achouItem(e,t)}getActiveHandItem(t=this.playerId()){return this.save.itemAtivo(t)}setActiveHandSlot(t,e=this.playerId()){this.save.setSlotAtivo(e,t),this.repintarMochila()}activeHandSlot(t=this.playerId()){return this.save.slotAtivo(t)}equipWearable(t,e=this.playerId()){const i=this.save.vestir(e,t);return i&&this.repintarMochila(),i}unequipWearable(t,e=this.playerId()){this.save.despir(e,t),this.repintarMochila()}moveItem(t,e,i=this.playerId()){const s=this.save.mover(i,t,e);return s&&this.repintarMochila(),s}handItems(t=this.playerId()){return this.save.maos(t)}wearables(t=this.playerId()){return this.save.vestiveis(t)}wardrobeItems(t=this.playerId()){return this.save.acervo(t)}descartarDaVaga(t){const e=this.playerId(),s=(t.lista==="mao"?this.save.maos(e):this.save.vestiveis(e))[t.indice];s&&(this.save.largar(e,s.id),this.audio.play("escolha"),this.ui.toast(`${s.nome} foi descartado`,"🗑"),this.pintarMochila())}repintarMochila(){this.ui.mochilaOpen&&this.pintarMochila()}pintarMochila(){const t=this.playerId();this.ui.renderMochila(this.save.maos(t),this.save.vestiveis(t),this.save.slotAtivo(t),this.player.name)}abrirMochila(){this.ui.toggleMochila()}sincronizarVestiveis(){for(const t of[this.player,this.parceiro]){const e=t.rig.spec.id,i=this.save.vestiveis(e),s=i.some(c=>c?.id===se.chapeuPingPong.id);t.rig.campeao!==s&&t.rig.setCampeao(s);const o=i.some(c=>c?.id===se.patins.id);t.patins=o,t.rig.setPatins(o);const a=this.save.loadout(e),r=ai.map(c=>a[c]??"").join("|");this.roupaAplicada.get(e)!==r&&(this.roupaAplicada.set(e,r),t.rig.vestirRoupa(a))}}sincronizarMaos(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id,i=this.save.itemAtivo(e),s=i?.id??null;this.naMao.get(e)!==s&&(this.naMao.set(e,s),t.segurar(s?$v(s):null,i?.holdPose??"none"))}}roupaAplicada=new Map;abrirGuardaRoupa(){this.previa.mostrar(this.player.rig.spec),this.pintarArmario(),this.ui.abrirArmario()}pintarArmario(){const t=this.playerId(),e=this.save.vestiveis(t),i=[...this.save.acervo(t),...this.save.maos(t).filter(s=>s!==null&&s.tipo==="vestivel")];this.ui.renderArmario(e,i,this.player.name),this.previa.vestir(this.save.loadout(t))}abrirMemoria(t){const e=qr.findIndex(i=>i.id===t);e>=0&&this.ui.abrirMemorias(qr,e)}unlock(t){this.save.addMemory(t)&&(this.audio.play("memoria"),this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,i=Math.PI/4){this.player.teleport(t,e,i),this.parceiro.teleport(t-1.2,e-.4,i),this.iso.snapTo(this.player.chest)}get telaDeLeitura(){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.memoriasOpen}keyPressed(t){return this.telaDeLeitura||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.telaDeLeitura||this.player.locked?!1:this.input.isDown(t)}showCharge(t,e,i){this.audio.carga(t),this.ui.showCharge(t,e,i)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.riding?(this.player.object.updateWorldMatrix(!0,!1),this.player.object.getWorldPosition(new N)):this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}playerId(){return this.player.rig.spec.id}companionId(){return this.parceiro.rig.spec.id}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.riding?(this.parceiro.object.updateWorldMatrix(!0,!1),this.parceiro.object.getWorldPosition(new N)):this.parceiro.position.clone()}companionFacing(){return this.parceiro.rig.facing}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.maos.trocouCorpos(this.player,this.parceiro),this.audio.play("trocar"),this.ui.toast(`Agora você é ${this.player.name}`,"🔁"),this.ui.mochilaOpen&&this.pintarMochila(),this.ui.armarioOpen&&(this.previa.mostrar(this.player.rig.spec),this.pintarArmario())}submergePlayer(t){this.player.submersion=Le.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=Le.clamp(t,0,1)}rideCompanion(t,e,i=1,s=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(i),this.parceiro.rig.group.rotation.y=s,this.parceiro.rig.setFacing(s),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}holdCompanion(t,e){this.parceiro.hold(t,e)}setSitting(t){if(t&&this.audio.play("sentar"),this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t),!t){this.maos.ativo||(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0));return}const e=this.player.rig.group,i=this.parceiro.rig.group;e.updateWorldMatrix(!0,!1),i.updateWorldMatrix(!0,!1);const s=new N,o=new N;e.getWorldPosition(s),i.getWorldPosition(o);const r=new N(1,0,0).applyQuaternion(e.getWorldQuaternion(new is)).dot(o.sub(s))<0?-1:1;this.player.rig.setHoldingHands(r),this.parceiro.rig.setHoldingHands(r===1?-1:1)}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,i=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,i)}ridePlayer(t,e,i=1,s=Math.PI){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(i),this.player.rig.group.rotation.y=s,this.player.rig.setFacing(s),this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,i=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,i),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight),this.camOmbro&&(this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.updateProjectionMatrix())};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function B1(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Wr(n=3,t=2.2,e=S.rug){const i=new M(new V(n,.04,t),R(e));return i.position.y=.02,i.receiveShadow=!0,i}function k1(n=S.sofa,t=2.2){const e=new at,i=new M(new V(t,.42,.9),R(n));i.position.y=.28,e.add(i);const s=new M(new V(t,.62,.24),R(n));s.position.set(0,.72,-.35),e.add(s);for(const a of[-1,1]){const r=new M(new V(.24,.5,.9),R(n));r.position.set(a*(t/2-.12),.62,0),e.add(r)}for(const[a,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new M(new it(.05,.04,.14,6),R(S.woodDark));c.position.set(a*(t/2-.2),.07,r*.34),e.add(c)}const o=new M(new V(.36,.12,.34),R(S.flowerPink));return o.position.set(t/2-.5,.55,-.14),o.rotation.set(.9,.4,0),e.add(o),e}function H1(){const n=new at,t=new M(new V(1.2,.08,.7),R(S.wood));t.position.y=.46,n.add(t);for(const[e,i]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const s=new M(new it(.04,.04,.46,6),R(S.woodDark));s.position.set(e*.5,.23,i*.27),n.add(s)}return n}function V1(n=!1){const t=new at,e=new M(new V(1.8,.5,.45),R(S.woodDark));e.position.y=.25,t.add(e);const i=new M(new V(1.5,.85,.08),R(2040361));i.position.y=.95,t.add(i);const s=new M(new De(1.36,.72),qe(n?9426943:S.screen,1));return s.name="tela",s.position.set(0,.95,.05),t.add(s),t}function G1(n=2.1,t=1.2){const e=new at,i=new M(new V(t,n,.32),R(S.woodDark));i.position.y=n/2,e.add(i);const s=Math.max(2,Math.floor(n/.5)),o=[14245951,4882400,16763213,6074447,16748465];for(let a=1;a<s;a++){const r=n/s*a;for(let c=0;c<5;c++){const l=new M(new V(.09,.3+c%3*.05,.2),R(o[(a+c)%o.length]));l.position.set(-t/2+.18+c*.13,r+.16,.06),l.rotation.z=c===4?.2:0,e.add(l)}}return e}function q1(n=S.fabricBlue){const t=new at,e=new M(new V(1.5,.35,2.1),R(S.woodDark));e.position.y=.2,t.add(e);const i=new M(new V(1.44,.24,2),R(16184040));i.position.y=.49,t.add(i);const s=new M(new V(1.5,.14,1.35),R(n));s.position.set(0,.62,.3),t.add(s);const o=new M(new V(1,.16,.4),R(16777215));o.position.set(0,.66,-.72),t.add(o);const a=new M(new V(1.55,.7,.12),R(S.wood));return a.position.set(0,.6,-1.06),t.add(a),t}function W1(){const n=new at,t=new M(new V(1.6,.08,.7),R(S.wood));t.position.y=.74,n.add(t);for(const o of[-.72,.72]){const a=new M(new V(.08,.74,.66),R(S.woodDark));a.position.set(o,.37,0),n.add(a)}const e=new M(new V(.8,.5,.06),R(2830136));e.position.set(0,1.08,-.18),n.add(e);const i=new M(new De(.72,.42),qe(10475775));i.position.set(0,1.08,-.14),n.add(i);const s=new M(new it(.05,.12,.24,8),R(2830136));return s.position.set(0,.86,-.18),n.add(s),n}function Xr(n=S.wood){const t=new at,e=new M(new V(.5,.08,.5),R(n));e.position.y=.46,t.add(e);const i=new M(new V(.5,.55,.07),R(n));i.position.set(0,.75,-.22),t.add(i);for(const[s,o]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new M(new V(.06,.46,.06),R(S.woodDark));a.position.set(s*.2,.23,o*.2),t.add(a)}return t}function X1(n=2.4){const t=new at,e=new M(new V(n,.9,.65),R(S.wallMint));e.position.y=.45,t.add(e);const i=new M(new V(n+.08,.08,.72),R(S.concrete));i.position.y=.94,t.add(i);const s=new M(new V(.5,.06,.4),R(S.metalWhite));return s.position.set(n/2-.55,.97,0),t.add(s),t}function Y1(){const n=new at,t=new M(new V(.8,1.8,.7),R(S.metalWhite));t.position.y=.9,n.add(t);const e=new M(new V(.82,.03,.72),R(S.metalGrey));e.position.y=1.25,n.add(e);for(const i of[.7,1.45]){const s=new M(new V(.05,.3,.05),R(S.metalGrey));s.position.set(.3,i,.37),n.add(s)}return n}function Yr(n=1){const t=new at,e=new M(new it(.22*n,.17*n,.34*n,10),R(S.plantPot));e.position.y=.17*n,t.add(e);for(let i=0;i<5;i++){const s=i/5*Math.PI*2,o=new M(new Bt(.2*n,8,6),R(i%2?S.leafMid:S.leafLight));o.scale.set(.5,1.5,.5),o.position.set(Math.cos(s)*.12*n,.6*n,Math.sin(s)*.12*n),o.rotation.z=Math.cos(s)*.4,o.rotation.x=-Math.sin(s)*.4,t.add(o)}return t}function jr(n=.7,t=.55,e=S.skyDusk){const i=new at,s=new M(new V(n,t,.05),R(S.woodDark));i.add(s);const o=new M(new De(n-.1,t-.1),qe(e));return o.position.z=.03,i.add(o),i}function j1(n=1.3,t=1){const e=new at,i=new M(new V(n,t,.05),R(S.woodDark));e.add(i);const s=new M(new De(n-.1,t-.1),qe(S.cortica));s.position.z=.03,e.add(s);for(let r=0;r<14;r++){const c=new M(new De(.018,.018),qe(S.corticaEscura));c.position.set((r*37%100/100-.5)*(n-.24),(r*61%100/100-.5)*(t-.24),.035),e.add(c)}const o=[[-.3,.2,.34,.28,.06,S.skyDusk],[.26,.24,.3,.26,-.09,S.water],[-.24,-.22,.3,.26,-.05,S.flowerPink],[.3,-.2,.32,.24,.08,S.leafMid]],a=[S.heart,S.gold,S.frisbee,S.heart];return o.forEach(([r,c,l,h,u,d],f)=>{const g=new at,_=new M(new De(l,h),qe(S.metalWhite));g.add(_);const m=new M(new De(l-.06,h-.1),qe(d));m.position.set(0,.02,.002),g.add(m);const p=new M(new Bt(.018,8,6),R(a[f]));p.position.set(0,h/2-.03,.012),g.add(p),g.position.set(r,c,.04),g.rotation.z=u,e.add(g)}),e}function su(n=1.2,t=1.2){const e=new at,i=new M(new De(n,t),qe(S.glass,.55));e.add(i);const s=new M(new V(n+.12,.08,.08),R(S.metalWhite));s.position.y=t/2,e.add(s);const o=s.clone();o.position.y=-t/2,e.add(o);for(const a of[-1,1]){const r=new M(new V(.08,t,.08),R(S.metalWhite));r.position.x=a*n/2,e.add(r)}return e}function Z1(n=16777215){const t=new at,e=new M(new it(.07,.06,.13,10),R(n));e.position.y=.065,t.add(e);const i=new M(new _e(.045,.014,6,12),R(n));return i.position.set(.08,.07,0),i.rotation.y=Math.PI/2,t.add(i),t}function J1(n=1.5,t=.9){const e=new at,i=new M(new V(n,.09,t),R(S.wood));i.position.y=.75,e.add(i);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new M(new V(.08,.75,.08),R(S.woodDark));r.position.set(o*(n/2-.14),.37,a*(t/2-.14)),e.add(r)}const s=new M(new it(.07,.09,.16,10),R(S.wallMint));s.position.y=.87,e.add(s);for(const o of[-1,1]){const a=new M(new Bt(.06,8,6),R(o<0?S.flowerPink:S.flowerYellow));a.position.set(o*.05,1.03,0),e.add(a)}return e}function K1(n=!0){const t=new at,e=new M(new it(.2,.24,.06,12),R(S.woodDark));e.position.y=.03,t.add(e);const i=new M(new it(.03,.03,1.5,8),R(S.metalGrey));i.position.y=.78,t.add(i);const s=new M(new it(.22,.3,.34,14,1,!0),R(n?16773324:15130320,{glow:n?.5:0,doubleSide:!0}));return s.position.y=1.68,t.add(s),t}function Zr(n=1.1){const t=new at,e=new M(new V(n,.06,.24),R(S.wood));t.add(e);const i=[14245951,6074447,16763213];for(let o=0;o<3;o++){const a=new M(new V(.1,.24,.16),R(i[o]));a.position.set(-n/2+.2+o*.16,.15,0),t.add(a)}const s=new M(new Bt(.13,10,8),R(S.leafMid));return s.position.set(n/2-.22,.16,0),s.scale.y=.8,t.add(s),t}function $1(n=2){const t=new at,e=new M(new V(n,.6,.34),R(S.wallCream));t.add(e);for(const i of[-1,1]){const s=new M(new V(.04,.16,.04),R(S.metalGrey));s.position.set(i*n*.22,-.18,.19),t.add(s)}return t}function Q1(){const n=new at,t=new M(new V(.66,.9,.64),R(S.metalWhite));t.position.y=.45,n.add(t);const e=new M(new it(.2,.2,.06,16),R(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,n.add(e);const i=new M(new it(.14,.14,.05,16),R(3884624));i.position.set(0,.5,.36),i.rotation.x=Math.PI/2,n.add(i);const s=new M(new V(.6,.12,.03),R(14673128));s.position.set(0,.82,.33),n.add(s);for(const o of[-.2,0,.2]){const a=new M(new it(.025,.025,.03,8),R(S.metalGrey));a.position.set(o,.82,.36),a.rotation.x=Math.PI/2,n.add(a)}return n}function wo(n=S.wood,t=.9,e=2.1,i=.24){const s=new at,o=new M(new V(t,e,.08),R(n));o.position.y=e/2,s.add(o);for(const c of[-1,1]){const l=new M(new V(.09,e+.1,i),R(S.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),s.add(l)}const a=new M(new V(t+.2,.1,i),R(S.woodDark));a.position.y=e+.05,s.add(a);const r=new M(new Bt(.055,8,6),R(S.gold,{glow:.15}));return r.position.set(t/2-.14,e*.45,.07),s.add(r),s}function t_(n=S.wood,t=1.6,e=2.1){const i=new at,s=.62,o=new M(new V(t,e,s),R(S.woodDark));o.position.y=e/2,i.add(o);const a=new M(new V(t-.12,e-.16,.04),R(3812127));a.position.set(0,e/2,s/2-.05),i.add(a);const r=t/2-.05;for(const c of[-1,1]){const l=new at;l.position.set(c*r,e/2,s/2),c>0&&(l.rotation.y=-.62),i.add(l);const h=new M(new V(r,e-.1,.06),R(n));h.position.x=-c*r/2,l.add(h);const u=new M(new it(.022,.022,.16,8),R(S.metalGrey));u.position.set(-c*(r-.12),0,.06),l.add(u)}for(const c of[-1,1])for(const l of[-1,1]){const h=new M(new V(.1,.1,.1),R(S.woodDark));h.position.set(c*(t/2-.1),.05,l*(s/2-.1)),i.add(h)}return i}function e_(n=S.wood,t=1.7){const e=new at,i=.62,s=new M(new V(i,t,.07),R(n));s.position.y=t/2,e.add(s);const o=new M(new V(i-.14,t-.16,.03),R(S.glass,{opacity:.72,glow:.12}));return o.position.set(0,t/2,.04),e.add(o),e.rotation.x=-.05,e}function n_(){const n=new at,t=new M(new V(.44,.5,.4),R(S.wood));t.position.y=.25,n.add(t);const e=new M(new V(.36,.14,.03),R(S.woodDark));e.position.set(0,.32,.21),n.add(e);const i=new M(new it(.06,.08,.16,8),R(S.metalGrey));i.position.y=.58,n.add(i);const s=new M(new it(.11,.15,.18,12,1,!0),R(16773324,{glow:.45,doubleSide:!0}));return s.position.y=.75,n.add(s),n}const An={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},yn={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},i_=[An,yn],Jr={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI},"do-quarto":{x:-5.05,z:-1.2,facing:Math.PI/2}},build(n){const t=n.game,e=async Z=>{for(const[yt,Wt]of Z)await t.say([Wt],yt)},i=An.name,s=yn.name,o=12,a=9,r=-o/2,c=-a/2,l=2.8;n.ground({width:o,depth:a,color:S.floorWood}),n.setBounds(r+.45,c+.45,o/2-.45,a/2-.45),n.wall(r,c,o/2,c,l,S.wallCream);const h=-1.2,u=.95;n.wall(r,c,r,h-u/2,l,S.wallMint),n.wall(r,h+u/2,r,a/2,l,S.wallMint),n.wall(r,a/2,o/2,a/2,.45,S.wallCream),n.wall(o/2,-1.3,o/2,a/2,.45,S.wallCream);const d=.4,f=4.2,g=-1.3,_=(d+f)/2,m=(f+o/2)/2,p=.95,w=[d,_-p/2,_+p/2,m-p/2,m+p/2,o/2];for(let Z=0;Z<w.length;Z+=2)w[Z+1]-w[Z]>.05&&n.wall(w[Z],g,w[Z+1],g,l,S.wallCream);n.wall(d,c,d,g,l,S.wallCream),n.wall(f,c,f,g,l,S.wallCream),n.wall(o/2,c,o/2,g,l,S.wallCream);const x=new M(new V(o/2-d,.16,g-c),R(15129028));x.position.set((d+o/2)/2,l+.08,(c+g)/2),n.add(x);const v=n.add(n.place(wo(S.woodDark,.85,2.05),_,0,g)),P=n.add(n.place(wo(S.gold,.85,2.05),m,0,g));n.add(n.place(jr(.6,.75,S.wallMint),3.55,1.75,g+.17)),n.add(n.place(Zr(.9),1.1,1.7,g+.19)),n.add(n.place(wo(S.fabricBlue,.9,2.1),r,0,h,Math.PI/2)),n.door({x:r+.85,z:h,to:"quarto",entry:"da-sala",label:"Entrar no quarto do Ari",icon:"🚪"}),n.add(n.place(X1(3.6),-3.4,0,c+.42)),n.blockBox(-3.4,c+.42,1.8,.4),n.add(n.place($1(2.6),-3.4,2,c+.2)),n.add(n.place(Y1(),r+.45,0,-2.6,Math.PI/2)),n.blockBox(r+.45,-2.6,.38,.42);const E=n.add(n.place(J1(1.5,.9),-3.6,0,-1.9,.08));n.blockBox(-3.6,-1.9,.8,.52,.08),n.add(n.place(Xr(),-4.7,0,-1.9,Math.PI/2)),n.add(n.place(Xr(),-2.5,0,-1.9,-Math.PI/2));const A=n.add(n.place(V1(!1),r+.35,0,.6,Math.PI/2));n.blockBox(r+.35,.6,.3,.9);const C=A.getObjectByName("tela");n.add(n.place(Wr(3,2.6),-2.5,0,.6));const b=n.add(n.place(k1(S.fabricRed,2.4),-.3,0,.6,-Math.PI/2));n.blockBox(-.3,.6,.5,1.2),n.add(n.place(H1(),-2.4,0,.6,Math.PI/2)),n.blockBox(-2.4,.6,.38,.62);const y=n.add(n.place(Z1(16773856),-2.4,.5,.9));n.add(n.place(K1(!0),-.4,0,2.3)),n.blockCircle(-.4,2.3,.3);const D=n.add(n.place(Q1(),o/2-.65,0,2.9,-Math.PI/2));n.blockBox(o/2-.65,2.9,.35,.4),n.add(n.place(su(1.8,1.3),r+.16,1.75,2.4,Math.PI/2)),n.add(n.place(jr(.8,.6,S.skyDusk),-3.4,1.95,c+.17)),n.add(n.place(Zr(1.1),-1.6,1.8,c+.2)),n.add(n.place(Yr(1.1),r+.8,0,a/2-1));const F=n.add(n.place(Yr(.75),4.9,0,1.4)),B=n.place(Kh(.75),-.3,2.4,.6);B.visible=!1,n.add(B);const G=a/2;n.wall(2,G,2.9,G,2.6,S.wallCream),n.wall(3.9,G,4.9,G,2.6,S.wallCream);const X=n.add(n.place(wo(S.woodDark,.95,2.1),3.4,0,G,Math.PI));n.blockBox(3.4,G,.5,.12),n.add(n.place(Wr(1.4,.8,12626050),3.4,0,a/2-1));const K=new we;K.position.set(-.52,0,.6),K.rotation.y=-Math.PI/2,n.root.add(K);const st=new we;st.position.set(-1.9,1.05,.6),n.root.add(st);let J=!1;const ot=Z=>{J=Z,C.material=R(Z?9426943:S.screen,{glow:Z?.55:0})};n.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:b,onInteract:async Z=>{if(await Z.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await Z.say(["Depois. Se sentar agora, não levanta mais."]);return}Z.lockPlayer(!0),Z.ridePlayer(K,new N(-.52,.02,0),1,0),Z.rideCompanion(K,new N(.52,.02,0),1,0),Z.setSitting(!0),ot(!0),Z.focusCamera(st),Z.setZoom(7.2),await Z.wait(.9),await Z.say(["Está passando Bo Burnham."]),await Z.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${Z.companionName()} tá rindo também.`]),await Z.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await Z.say(["Mais um. Só mais um.","Nunca é só mais um."]),Z.setSitting(!1),Z.focusCamera(null),Z.setZoom(10),Z.releasePlayer(-1.6,.4,-Math.PI/2),Z.releaseCompanion(-1.6,1.5,-Math.PI/2),Z.lockPlayer(!1),Z.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),n.interact({id:"casa:tv",x:r+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:A,onInteract:async Z=>{ot(!J),J&&Z.som("tv"),Z.toast(J?"TV ligada":"TV desligada","📺"),J&&await Z.say(["Está passando Bo Burnham."])}}),n.interact({id:"casa:geladeira",x:r+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:Z=>Z.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),n.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:Z=>Z.say(["Por algum milagre, a pia está limpa…"])}),n.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:E,onInteract:async Z=>{await e([[i,"Dois pratos, duas canecas. Já virou automático."],[s,"Três, se a Rubi sair do quarto."]]),Z.toast("Mesa posta","🍽️")}}),n.interact({id:"casa:maquina",x:o/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:D,onInteract:async Z=>{if(Z.flag("roupa-lavando")){await e([[s,"Ainda tá centrifugando."],[i,"Esse barulho é a trilha sonora dessa casa."]]);return}Z.setFlag("roupa-lavando"),Z.toast("Máquina ligada","🫧"),await e([[i,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[s,"Contanto que a Rubi não encha ela de novo antes."]])}}),n.interact({id:"casa:banheiro",x:m,z:g+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:P,onInteract:()=>e([[s,"Tem alguém aí?"],[i,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),n.interact({id:"casa:quarto",x:_,z:g+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:v,onInteract:async Z=>{await e([[i,"Acho que a Rubi está ouvindo kpop"],[s,"Para variar né"]]),Z.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),n.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:F,onInteract:async Z=>{if(Z.flag("planta-regada")){await Z.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}Z.setFlag("planta-regada"),F.scale.multiplyScalar(1.2),Z.toast("A plantinha cresceu um tiquinho","🌱"),await Z.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),n.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:y,onInteract:async Z=>{await Z.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),Z.toast("+1 disposição","☕")}}),n.interact({id:"casa:janela",x:r+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async Z=>{await Z.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),Z.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),n.door({x:3.4,z:a/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:X,radius:1.7}),n.onUpdate((Z,yt)=>{B.visible=n.game.flag("planta-regada"),B.position.y=2.4+Math.sin(yt*1.6)*.12,B.rotation.y=yt*.9})}},ue={x:0,z:-3,largura:16,profundidade:10,fundo:1.6};function Zl(n,t,e=0){return Math.abs(n-ue.x)<ue.largura/2-e&&Math.abs(t-ue.z)<ue.profundidade/2-e}const Jl={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:0,z:12,facing:Math.PI},entries:{portaria:{x:0,z:12,facing:Math.PI},beira:{x:0,z:3.5,facing:Math.PI}},build(n){const t=n.game,e=async E=>{for(const[A,C]of E)await t.say([C],A)},i=An.name,s=yn.name,o={x:ue.x,z:ue.z,width:ue.largura,depth:ue.profundidade};n.groundWithHoles({width:160,depth:160,color:S.grass,holes:[o]}),n.groundWithHoles({width:34,depth:26,color:14999766,y:.015,z:-1,holes:[o]}),n.setBounds(-22,-18,22,16),n.add(n.place(Sv(ue.largura,ue.profundidade,ue.fundo),ue.x,0,ue.z));const a=wv(ue.largura,ue.profundidade);a.position.set(ue.x,-.12,ue.z),n.root.add(a);for(const E of[-5.2,-1.8,1.8,5.2]){const A=new M(new De(.24,ue.profundidade-1.4),qe(4164272));A.rotation.x=-Math.PI/2,A.position.set(ue.x+E,-1.6+.08,ue.z),n.root.add(A)}for(const E of[-5,5])n.add(n.place(Ev(),E,0,ue.z+ue.profundidade/2));const r=n.add(n.place(Av(),0,0,ue.z-ue.profundidade/2-1.6));n.blockBox(0,ue.z-ue.profundidade/2-1.9,.4,.4);const c=[La(S.frisbee),La(16767070),La(7328752)];c.forEach((E,A)=>{n.place(E,-4.5+A*4.6,-.05,ue.z-1.6+A%2*2.6),n.root.add(E)});const l=[S.fabricBlue,S.fabricRed,6074447,16763213];for(let E=0;E<6;E++){const A=-7.5+E*3;n.add(n.place(Ll(l[E%l.length]),A,0,5.4,Math.PI)),n.blockBox(A,5.4,.36,.85),E%2===0&&(n.add(n.place(Dl(E%4===0?S.fabricRed:4882400),A+1.5,0,6.9)),n.blockCircle(A+1.5,6.9,.3))}const h=n.add(n.place(Ll(S.rug),10.5,0,2.2,-Math.PI/2));n.blockBox(10.5,2.2,.85,.36),n.add(n.place(Dl(16748465),11.6,0,3.6)),n.blockCircle(11.6,3.6,.3);const u=n.add(n.place(Tv(),-11,0,2.5,-Math.PI/2));n.blockCircle(-11,2.5,.3);const d=n.add(n.place(Fr(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));n.blockBox(-12.5,7.2,1.4,1,.35);const f=n.add(n.place(Or(6,3.2,4,S.wallCream,8038084),13,0,-9));n.blockBox(13,-9,3,2),n.banco(13,-6.6),n.setSeed(90210);for(const[E,A]of[[-18,-8],[-17,1],[18,2],[19,-6],[-19,10],[18,11]])n.add(n.place(Ur("palmeira",n.range(.95,1.2),n.rng()),E,0,A)),n.blockCircle(E,A,.5);for(let E=0;E<26;E++){const A=n.range(-20,20),C=n.range(-16,14);Math.abs(A)<18&&C>-14&&C<12||n.add(n.place(E%2?Ro(n.range(.7,1.1)):Nr(6,1.1),A,0,C))}for(let E=0;E<6;E++){const A=jh(n.range(1.8,3));A.position.set(n.range(-60,60),n.range(40,52),n.range(-50,30)),n.root.add(A);const C=n.range(.2,.5);n.onUpdate(b=>{A.position.x+=C*b,A.position.x>62&&(A.position.x=-62)})}n.add(n.place(On(30,1.4,S.metalWhite),-6,0,14)),n.add(n.place(On(14,1.4,S.metalWhite),12,0,14)),n.blockBox(-6,14,15,.2),n.blockBox(12,14,7,.2);const g=n.add(n.place(On(4,1.6,S.gold),3.5,0,14));n.door({x:3.5,z:13,to:"villa-lobos",entry:"clube",label:"Voltar pro parque",icon:"🌳",highlight:g,radius:2.2});const _=[],m=(E,A,C=12)=>{t.som("agua");for(let b=0;b<C;b++){const y=new M(new Bt(.1+Math.random()*.1,6,5),qe(14677247,.9)),D=b/C*Math.PI*2,F=.2+Math.random()*.5;y.position.set(E+Math.cos(D)*F,-.1,A+Math.sin(D)*F),n.root.add(y),_.push({mesh:y,vy:2.2+Math.random()*2.4,vida:1})}};let p=0,w=0,x=!1;n.onUpdate((E,A)=>{a.position.y=-.12+Math.sin(A*1.4)*.015,c.forEach((F,B)=>{F.position.y=-.05+Math.sin(A*1.1+B*1.7)*.05,F.rotation.y=Math.sin(A*.4+B)*.4});const C=t.playerPosition(),b=t.companionPosition(),y=Zl(C.x,C.z,.2)?1:0,D=Zl(b.x,b.z,.2)?1:0;p+=(y-p)*Math.min(1,E*5),w+=(D-w)*Math.min(1,E*5),t.submergePlayer(p),t.submergeCompanion(w),y===1&&!x&&(x=!0,m(C.x,C.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let F=_.length-1;F>=0;F--){const B=_[F];B.vy-=9*E,B.mesh.position.y+=B.vy*E,B.vida-=E*.9,B.mesh.material.opacity=Math.max(0,B.vida),(B.vida<=0||B.mesh.position.y<-.6)&&(n.root.remove(B.mesh),B.mesh.geometry.dispose(),_.splice(F,1))}});const v=new we;n.root.add(v),n.interact({id:"clube:trampolim",x:0,z:ue.z-ue.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:r,onInteract:async E=>{E.lockPlayer(!0),await E.say(["Do trampolim?","Do trampolim."]);const A=new N(0,.95,ue.z-ue.profundidade/2-.4),C=new N(0,-.6,ue.z+1.2);v.position.copy(A),E.ridePlayer(v,new N(0,0,0),1);const b=1.15;for(let y=0;y<b;y+=1/60){const D=y/b;v.position.lerpVectors(A,C,D),v.position.y+=Math.sin(D*Math.PI)*2.6,await E.wait(1/60)}m(C.x,C.z,18),E.releasePlayer(C.x,C.z,Math.PI),E.lockPlayer(!1),E.toast("Splash!","💦"),E.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),n.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:h,onInteract:async E=>{await E.say(["Sol na cara, barulho de água, ninguém com pressa.",`${E.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),E.toast("+1 preguiça boa","🌞")}});let P=0;n.onUpdate(E=>{P<=0||(P-=E,P<=0&&(t.removeItem(se.sucoMorango.id,yn.id),t.removeItem(se.sucoPessego.id,An.id),t.toast("Acabou o suco","🍹")))}),n.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:d,onInteract:async E=>{await e([[s,"Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito."],[i,"Awnn gracias amorzito"]]),P=50,E.addItem(se.sucoMorango,yn.id),E.addItem(se.sucoPessego,An.id),E.som("sorvete"),E.toast("Morango e pêssego","🍹")}}),n.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:u,onInteract:async E=>{m(-10.6,2.5,8),await E.say(["Gelada. Sempre gelada."])}}),n.interact({id:"clube:vestiario",x:13,z:-6.6,radius:2.2,label:"Vestiário",icon:"🩳",highlight:f,onInteract:E=>E.say(["Cinco minutos pra trocar de roupa. Você demora quinze."])})}},Sn=8,gn=6.5,$e=-Sn/2,ln=-gn/2,Kl=2.8,qi={x:2.65,z:ln+.36},$l={x:-1.15},s_=[se.gorroDeLa,se.camisaListrada,se.calcaJeans,se.botaAmarela,se.vestidoRosa,se.gargantilhaDeLaco,se.maidMarinheiro,se.maidGatinho,se.maidJapones,se.meiaDeCoxa,se.moletomPreto],Ql={id:"quarto",name:"Quarto do Ari",subtitle:"a porta que fica sempre encostada",ambient:{sky:14872311,indoor:!0,sunColor:16774366,sunIntensity:.95,ambientColor:15397883,ambientIntensity:1.45,sunDir:[10,15,12]},spawn:{x:.9,z:1.7,facing:Math.PI},entries:{"da-sala":{x:.9,z:1.7,facing:Math.PI}},build(n){const t=n.game,e=async f=>{for(const[g,_]of f)await t.say([_],g)},i=An.name,s=yn.name;n.ground({width:Sn,depth:gn,color:S.floorWood}),n.setBounds($e+.45,ln+.45,Sn/2-.45,gn/2-.45),n.wall($e,ln,Sn/2,ln,Kl,S.wallAzul),n.wall($e,ln,$e,gn/2,Kl,S.wallAzul),n.wall(Sn/2,ln,Sn/2,gn/2,.45,S.wallAzul);const o=.9,a=1.1;n.wall($e,gn/2,o-a/2,gn/2,.45,S.wallAzul),n.wall(o+a/2,gn/2,Sn/2,gn/2,.45,S.wallAzul);for(const[f,g,_,m]of[[0,ln+.06,Sn,0],[$e+.06,0,gn,Math.PI/2]]){const p=new M(new V(_,.12,.05),R(12176860));p.position.set(f,.06,g),p.rotation.y=m,n.add(p)}const r=n.add(n.place(q1(S.fabricBlue),-2.2,0,-1.75));n.blockBox(-2.2,-1.75,.78,1.08),n.add(n.place(n_(),-1.05,0,-2.72)),n.blockBox(-1.05,-2.72,.24,.22);const c=n.add(n.place(G1(1.9,1.1),.15,0,ln+.22));n.blockBox(.15,ln+.22,.55,.18);const l=n.add(n.place(t_(S.wallMint),qi.x,0,qi.z));n.blockBox(qi.x,qi.z,.8,.32);const h=n.add(n.place(e_(S.woodDark),$e+.12,0,-.6,Math.PI/2));n.add(n.place(su(1.6,1.2),$e+.16,1.7,1,Math.PI/2));const u=n.add(n.place(W1(),$e+.5,0,2,-Math.PI/2));n.blockBox($e+.5,2,.4,.82),n.add(n.place(Xr(S.woodDark),$e+1.35,0,2,-Math.PI/2)),n.add(n.place(Wr(2.6,2,S.rug),.3,0,1.1)),n.add(n.place(Yr(1.15),Sn/2-.75,0,.9)),n.blockCircle(Sn/2-.75,.9,.3),n.add(n.place(jr(.6,.75,S.flowerPink),-2.2,1.85,ln+.17)),n.add(n.place(Zr(.9),1.05,1.9,ln+.19));const d=n.add(n.place(j1(1.3,1),$l.x,1.72,ln+.17));n.door({x:o,z:gn/2-.7,to:"casa",entry:"do-quarto",label:"Voltar pra sala",icon:"🚪"}),n.interact({id:"quarto:armario",x:qi.x,z:qi.z+1.25,radius:1.8,label:"Abrir o armário",icon:"🚪",highlight:l,onInteract:async f=>{for(const g of[f.playerId(),f.companionId()])for(const _ of s_)f.storeItem(_,g);f.flag("armario-aberto")||(f.setFlag("armario-aberto"),await e([[i,"Pode mexer, fica à vontade."],[s,"Tem mais roupa aqui do que no meu apartamento inteiro."]]),f.unlock({id:"armario-do-ari",title:"O armário do Ari",place:"Quarto do Ari",note:"Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.",icon:"👕"})),f.abrirGuardaRoupa()}}),n.interact({id:"quarto:memorias",x:$l.x,z:-2.15,radius:1.35,label:"Ver memórias",icon:"📌",highlight:d,onInteract:async f=>{f.flag("quadro-visto")||(f.setFlag("quadro-visto"),await e([[i,"Eu queria um lugar pra pendurar as nossas."],[s,"Um quadro de memórias."],[i,"Esse. Cada uma que a gente viver, entra aqui."]]),f.unlock({id:"quadro-de-memorias",title:"O quadro de memórias",place:"Quarto do Ari",note:"Ideia dele. A primeira já estava pregada quando eu vi.",icon:"📌"})),f.abrirMemoria("o-pedido")}}),n.interact({id:"quarto:espelho",x:$e+.95,z:-.6,radius:1.5,label:"Se olhar no espelho",icon:"🪞",highlight:h,onInteract:async f=>{if(f.wearables().filter(_=>_!==null).length===0){await e([[s,"Tô bem assim?"],[i,"Tá. Mas tem um armário inteiro logo ali."]]);return}await e([[i,`Olha só, ${f.playerName()}.`],[s,"Ficou bom mesmo."]])}}),n.interact({id:"quarto:cama",x:-2.2,z:-.5,radius:1.6,label:"Olhar a cama",icon:"🛏️",highlight:r,onInteract:()=>e([[s,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[s,"Não é a cama então."]])}),n.interact({id:"quarto:mesa",x:$e+1.5,z:2,radius:1.5,label:"Olhar a escrivaninha",icon:"💻",highlight:u,onInteract:()=>e([[i,"É daqui que eu te mando mensagem de madrugada."],[s,"Eu sei. Eu tô acordado do outro lado."]])}),n.interact({id:"quarto:estante",x:.35,z:-2.2,radius:1.4,label:"Olhar a estante",icon:"📚",highlight:c,onInteract:()=>e([[s,"Você leu todos esses?"],[i,"Comecei todos esses."]])})}};function o_(n,t,e,i){const s=new N().subVectors(t,n),o=s.length(),a=new M(new it(e,e*1.15,o,8),i);return a.position.copy(n).addScaledVector(s,.5),a.quaternion.setFromUnitVectors(new N(0,1,0),s.normalize()),a}class a_{group=new at;cabins=[];radius;hubHeight;speed;angle=0;rim=new at;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,i=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const s=R(t.frameColor??S.metalWhite),o=this.hubHeight=e+2.6,a=e*.075;for(const A of[-a,a]){const C=new M(new _e(e,e*.019,8,72),s);C.position.z=A,this.rim.add(C)}const r=Math.min(48,i*2);for(let A=0;A<r;A++){const C=A/r*Math.PI*2,b=new M(new V(e*.012,e*.012,a*2),s);b.position.set(Math.cos(C)*e,Math.sin(C)*e,0),this.rim.add(b)}const c=[];for(let A=0;A<r;A++){const C=A/r*Math.PI*2,b=(A+1)/r*Math.PI*2,y=A%2===0?-a:a,D=A%2===0?a:-a;c.push(Math.cos(C)*e,Math.sin(C)*e,y,Math.cos(b)*e,Math.sin(b)*e,D)}this.rim.add(new Yc(th(c),Cl(14673642)));const l=[];for(let A=0;A<i;A++){const C=A/i*Math.PI*2,b=Math.cos(C)*e,y=Math.sin(C)*e;l.push(0,0,-a*.5,b,y,-a),l.push(0,0,a*.5,b,y,a)}this.rim.add(new Yc(th(l),Cl(15660022)));const h=new M(new it(e*.085,e*.085,e*.3,14),s);h.rotation.x=Math.PI/2,this.rim.add(h);for(const A of[-e*.17,e*.17]){const C=new M(new it(e*.11,e*.07,e*.06,14),R(S.metalGrey));C.rotation.x=Math.PI/2,C.position.z=A,this.rim.add(C)}this.rim.position.y=o,this.group.add(this.rim);const u=R(t.cabinColor??S.metalWhite),d=R(7321304,{opacity:.5}),f=e*.068;for(let A=0;A<i;A++){const C=new at,b=new M(new V(.09,f*1.1,.09),R(S.metalGrey));b.position.y=f*1.25,C.add(b);const y=new M(new kn(f,f*.5,5,16),u);y.scale.set(1,1,.92),C.add(y);const D=new M(new it(f*1.02,f*1.02,f*.95,18,1,!0),d);D.position.y=f*.12,D.scale.z=.92,C.add(D),C.traverse(F=>{F.isMesh&&(F.castShadow=!0)}),this.cabins.push(C),this.group.add(C)}const g=e*.42,_=new N(0,o,-e*.04),m=new N(0,o,e*.04),p=[[_,new N(-e*.2,0,-g)],[_,new N(e*.2,0,-g)],[m,new N(-e*.2,0,g)],[m,new N(e*.2,0,g)]];for(const[A,C]of p){const b=o_(A.clone(),C.clone(),e*.03,s);b.castShadow=!0,this.group.add(b)}for(const A of[-g,g]){const C=new M(new V(e*.42,e*.022,e*.022),s);C.position.set(0,e*.16,A),this.group.add(C)}const w=new M(new it(e*.62,e*.67,.35,26),R(S.concrete));w.position.y=.16,w.receiveShadow=!0,this.group.add(w);const x=e*.4,v=g*.92;for(const[A,C]of[[-x,-v],[x,-v],[-x,v],[x,v]]){const b=new M(new it(e*.055,e*.055,e*.16,12),R(S.metalRed));b.position.set(A,e*.08,C),b.castShadow=!0,this.group.add(b)}const P=new M(new V(e*.55,.55,e*.3),R(S.metalGrey));P.position.set(0,.4,g*.9),P.castShadow=!0,P.receiveShadow=!0,this.group.add(P);const E=new M(new it(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),R(S.fabricRed));E.position.set(0,1.9,g*.9),E.rotation.set(0,0,Math.PI/2),E.scale.z=.6,this.group.add(E);for(const A of[-e*.15,e*.15]){const C=new M(new it(.06,.06,1.8,8),R(S.metalWhite));C.position.set(A,.9,g*.9),this.group.add(C)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const i of this.cabins)i.position.y<e&&(e=i.position.y,t=i);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function th(n){const t=new Ue;return t.setAttribute("position",new he(n,3)),t}class r_{mesh;state="chao";velocity=new N;spin=0;curva=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=Jh(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}get rasante(){return Math.hypot(this.velocity.x,this.velocity.z)}pickUp(){this.state="guardado",this.velocity.set(0,0,0),this.curva=0}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,i=0,s=1,o=0){const a=e.x-t.x,r=e.z-t.z,c=Math.hypot(a,r),l=(Math.random()-.5)*i;this.throwFrom(t,Math.atan2(a,r)+l,this.powerFor(c,s),s,o)}throwAt(t,e,i,s=1,o=0){this.throwFrom(t,e,this.powerFor(i,s),s,o)}powerFor(t,e=1){let i=.25,s=1.7;for(let o=0;o<14;o++){const a=(i+s)/2;this.simulateRange(a,e)<t?i=a:s=a}return Le.clamp((i+s)/2,.25,1.7)}passo(t,e,i,s){const o=e.y>-1.2?this.lift:0;e.y-=(this.gravity-o)*s;const a=e.x,r=e.z,c=Math.hypot(a,r);return i!==0&&c>1e-4&&(e.x+=r/c*i*s,e.z+=-a/c*i*s),e.x*=1-.35*s,e.z*=1-.35*s,t.addScaledVector(e,s),i*Math.max(0,1-1.1*s)}simulateRange(t,e=1){const i=new N(0,1.15,0),s=new N(0,3.4*t*e,11*t),o=1/60;for(let a=0;a<900&&i.y>.06;a++)this.passo(i,s,0,o);return i.z}ondeVaiCair(t){const e=this.mesh.position.clone();if(this.state!=="voando")return e;const i=this.velocity.clone();let s=this.curva;const o=1/60;for(let a=0;a<900&&e.y>.06;a++)s=this.passo(e,i,s,o),this.bater(e,i,t)&&(s=0);return e.y=.06,e}throwFrom(t,e,i=1,s=1,o=0){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const a=11*i;this.velocity.set(Math.sin(e)*a,3.4*i*s,Math.cos(e)*a),this.curva=o,this.spin=22}bater(t,e,i){const s=Le.clamp(t.x,i.minX,i.maxX),o=Le.clamp(t.z,i.minZ,i.maxZ);return s===t.x&&o===t.z?!1:(t.x=s,t.z=o,e.multiplyScalar(.2),!0)}update(t,e){this.state==="voando"&&(this.curva=this.passo(this.mesh.position,this.velocity,this.curva,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08+this.curva*.06,this.bater(this.mesh.position,this.velocity,e)&&(this.curva=0),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.curva=0,this.onLand?.(this.mesh.position.clone())))}}const Oe={largura:2.6,profundidade:1.4,altura:.76},c_=.055,Es=Oe.largura/2+.22,l_=Es+.9,eh=.28,h_=Oe.altura+.19,u_=6.6,d_=.72,vs=Oe.profundidade/2+.12,Qe={vxBase:3.5,vxMin:2.9,vxMax:4.4,energiaParaVx:.05,vyBase:1.9,alturaParaVy:1.5,subidaParaVy:.12,vyMin:.75,vyMax:2.4,heranca:.25,lateralParaVz:.2,vzMax:1.05,velocidadeMaximaRaquete:6};class f_{grupo=new at;bola;minhaRaquete;raqueteDele;fase="parado";meus=0;dele=0;alvo;onSom=null;onPonto=null;onFim=null;v=new N;espera=0;sacaEu=!0;rebatedor="eu";quiquesNoAlvo=0;lateralRaquete=0;subidaRaquete=0;zAnterior=0;yAnterior=0;erroDele=0;constructor(t=5){this.alvo=t,this.bola=Zh(),this.grupo.add(this.bola),this.minhaRaquete=Bo(S.metalRed),this.raqueteDele=Bo(S.fabricBlue),this.minhaRaquete.rotation.y=Math.PI/2,this.raqueteDele.rotation.y=-Math.PI/2,this.minhaRaquete.scale.setScalar(1.15),this.raqueteDele.scale.setScalar(1.15),this.grupo.add(this.minhaRaquete,this.raqueteDele),this.resetar()}comecar(){this.meus=0,this.dele=0,this.sacaEu=!0,this.resetar()}guardar(){this.fase="parado",this.grupo.visible=!1}resetar(){this.fase="sacando",this.espera=1.1,this.grupo.visible=!0;const t=this.sacaEu?-1:1;this.bola.position.set(t*(Oe.largura/2-.3),Oe.altura+.45,0),this.v.set(0,0,0),this.minhaRaquete.position.set(-Es,Oe.altura+.3,0),this.raqueteDele.position.set(Es,Oe.altura+.3,0),this.zAnterior=0,this.yAnterior=Oe.altura+.3,this.lateralRaquete=0,this.subidaRaquete=0,this.sortearErro()}sortearErro(){const t=Math.random()<.25;this.erroDele=(Math.random()-.5)*(t?1.5:.5)}update(t,e){if(!(this.fase==="parado"||this.fase==="fim")){if(this.moverMinhaRaquete(t,e),this.moverRaqueteDele(t),this.fase==="ponto"||this.fase==="sacando"){this.espera-=t,this.espera<=0&&(this.fase==="ponto"?this.resetar():this.sacar());return}this.voar(t)}}sacar(){this.fase="jogando",this.rebatedor=this.sacaEu?"eu":"ele",this.quiquesNoAlvo=0,this.v.set(this.sacaEu?3.4:-3.4,1.45,(Math.random()-.5)*.6),this.onSom?.("lancar")}moverMinhaRaquete(t,e){const i=Le.clamp(e.x*vs,-vs,vs),s=Oe.altura+.16+Le.clamp((e.y+.35)*.6,0,.75);this.minhaRaquete.position.z+=(i-this.minhaRaquete.position.z)*Math.min(1,t*18),this.minhaRaquete.position.y+=(s-this.minhaRaquete.position.y)*Math.min(1,t*14);const o=Qe.velocidadeMaximaRaquete;t>0&&(this.lateralRaquete=Le.clamp((this.minhaRaquete.position.z-this.zAnterior)/t,-o,o),this.subidaRaquete=Le.clamp((this.minhaRaquete.position.y-this.yAnterior)/t,-o,o)),this.zAnterior=this.minhaRaquete.position.z,this.yAnterior=this.minhaRaquete.position.y}moverRaqueteDele(t){const e=this.v.x>0,i=e?this.bola.position.z+this.erroDele:0,s=e?4.6:1.6;this.raqueteDele.position.z+=(i-this.raqueteDele.position.z)*Math.min(1,t*s),this.raqueteDele.position.z=Le.clamp(this.raqueteDele.position.z,-vs,vs);const o=e?Le.clamp(this.bola.position.y,Oe.altura+.16,Oe.altura+.9):Oe.altura+.3;this.raqueteDele.position.y+=(o-this.raqueteDele.position.y)*Math.min(1,t*4)}voar(t){const e=this.bola.position,i=e.x;if(this.v.y-=u_*t,e.addScaledVector(this.v,t),(i<0&&e.x>=0||i>0&&e.x<=0)&&e.y<h_){this.onSom?.("quicar"),this.marcar(this.rebatedor==="ele","na rede");return}const o=Oe.altura+c_,a=Math.abs(e.x)<=Oe.largura/2&&Math.abs(e.z)<=Oe.profundidade/2;if(e.y<=o&&this.v.y<0&&a){if(e.y=o,this.v.y=-this.v.y*d_,this.onSom?.("quicar"),(e.x<0?"eu":"ele")===this.rebatedor){this.marcar(this.rebatedor==="ele","quique no próprio campo");return}if(this.quiquesNoAlvo+=1,this.quiquesNoAlvo>=2){this.marcar(this.rebatedor==="eu","dois quiques");return}}for(const[c,l,h]of[[-1,this.minhaRaquete,"eu"],[1,this.raqueteDele,"ele"]]){const u=c*Es;!(c<0?i>u&&e.x<=u:i<u&&e.x>=u)||this.rebatedor===h||!(Math.abs(e.z-l.position.z)<eh&&Math.abs(e.y-l.position.y)<eh)||(e.x=u,this.rebater(h==="eu"?1:-1,l.position.y,h==="eu"),this.rebatedor=h,this.quiquesNoAlvo=0,this.onSom?.("pegar"),h==="ele"&&this.sortearErro())}(e.y<.12||Math.abs(e.x)>l_||Math.abs(e.z)>2.2)&&(this.quiquesNoAlvo>=1?this.marcar(this.rebatedor==="eu","não alcançou"):this.marcar(this.rebatedor==="ele","fora"))}rebater(t,e,i){const s=i?this.lateralRaquete:this.miraDoParceiro(),o=i?this.subidaRaquete:0,a=Math.abs(s)+Math.abs(o),r=Le.clamp(Qe.vxBase+a*Qe.energiaParaVx,Qe.vxMin,Qe.vxMax),c=Le.clamp(Qe.vyBase-(e-(Oe.altura+.14))*Qe.alturaParaVy+o*Qe.subidaParaVy,Qe.vyMin,Qe.vyMax),l=Le.clamp(this.v.z*Qe.heranca+s*Qe.lateralParaVz,-1.05,Qe.vzMax);this.v.set(t*r,c,l)}miraDoParceiro(){const t=-this.bola.position.z*1.2,e=(Math.random()-.5)*2.4;return Le.clamp(t+e,-4,4)}marcar(t,e){if(t?this.meus+=1:this.dele+=1,this.sacaEu=!t,this.onPonto?.(t,e),this.meus>=this.alvo||this.dele>=this.alvo){this.fase="fim",this.onFim?.(this.meus>=this.alvo);return}this.fase="ponto",this.espera=1.3}}const p_={plano:Es},nh={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:S.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(n){const t=n.game,e=async L=>{for(const[z,Y]of L)await t.say([Y],z)},i=An.name,s=yn.name,o={x:-8.6,z:2.5},a={x:-21,z:-5,reta:5,raio:5,miolo:2.4},r={x:o.x+4.72,z:o.z+.2},c={x:18,z:-4.5,largura:26,profundidade:19},l={x:-15.5,z:20.5,giro:.35},h=(L,z,Y=0)=>Math.abs(L-c.x)<c.largura/2-Y&&Math.abs(z-c.z)<c.profundidade/2-Y;n.ground({width:240,depth:240,color:S.grass}),n.setBounds(-44,-34,44,32);for(let L=0;L<14;L++)n.disc(n.range(-40,40),n.range(-30,30),n.range(2,6),S.grassDark,.004);n.disc(0,-16.5,8.6,S.sand,.008),n.disc(0,-16.5,8,S.concrete,.012),n.patch(0,4,5.5,56,S.asphalt,0,.016),n.patch(0,9,62,4.5,S.asphalt,0,.02);const u=(L,z,Y)=>{n.patch(a.x,a.z,a.reta*2,L*2,z,0,Y),n.disc(a.x-a.reta,a.z,L,z,Y),n.disc(a.x+a.reta,a.z,L,z,Y)},d=.3;u(a.raio,S.metalWhite,.022),u(a.raio-d,S.asphalt,.026),u(a.miolo+d,S.metalWhite,.03),u(a.miolo,S.grass,.034);const f=(a.raio+a.miolo)/2,g=[1.15,.17];for(const L of[-1,1]){for(let Y=0;Y<5;Y++){const $=a.x-a.reta+1+Y*(a.reta*2-2)/4;n.patch($,a.z+L*f,g[0],g[1],S.metalWhite,0,.038)}const z=a.x+L*a.reta;for(let Y=0;Y<6;Y++){const $=-Math.PI/2+(Y+.5)/6*Math.PI,_t=L>0?$:$+Math.PI;n.patch(z+Math.cos(_t)*f,a.z+Math.sin(_t)*f,g[0],g[1],S.metalWhite,-(_t+Math.PI/2),.038)}}n.patch(a.x+a.reta*.55,a.z+f,.32,a.raio-a.miolo-d*2,S.metalWhite,0,.04),n.patch(o.x+.4,o.z+.2,10,6.4,S.concrete,0,.02),n.patch(o.x+1.6,7.2,3,7,S.asphalt,0,.022);const _=new a_({radius:12,cabins:32,rpm:1});n.place(_.group,0,0,-26),n.add(_.group),n.blockCircle(0,-26,7.2);for(const L of[-11,11])n.add(n.place(On(9,1.2,S.metalWhite),L,0,-20,Math.PI/2)),n.blockBox(L,-20,.2,4.5);n.add(n.place(vv(2.6),-9.5,0,-21,.4)),n.blockCircle(-9.5,-21,2.7);const m=n.add(n.place(Fr(S.fabricBlue,{texto:"Bilheteria"}),9.5,0,-20.5,-.5));n.blockBox(9.5,-20.5,1.4,.95,-.5);const p=[[-6.4,-13.6,1.15],[6.4,-13.6,1.15],[-8.6,-17.4,.95],[8.6,-17.4,.95]];for(const[L,z,Y]of p)n.add(n.place(gv(Y,void 0,n.rng()),L,0,z,n.range(0,6.28))),n.blockCircle(L,z,Y+.1);for(const[L,z]of[[-7.6,-11.4],[7.6,-11.4],[-12.2,-19],[12.2,-19]])n.add(n.place(Ra(!1),L,0,z)),n.blockCircle(L,z,.35);for(const[L,z,Y]of[[-3.6,-12.2,.1],[3.6,-12.2,-.1],[-13.2,-22.5,1.1]])n.banco(L,z,Y);for(const[L,z]of[[6.9,-18.9],[-5.2,-11.6]])n.add(n.place(Rl(),L,0,z)),n.blockCircle(L,z,.35);for(let L=0;L<22;L++){const z=L/22*Math.PI*2+n.range(-.1,.1),Y=n.range(10.5,13.5),$=Math.cos(z)*Y,_t=-18+Math.sin(z)*Y*.7;Math.abs($)<4.5&&_t>-14||(L%3===0?n.add(n.place(Ro(n.range(.6,1),S.leafDark),$,0,_t)):L%3===1?n.add(n.place(Pl(n.range(.9,1.4)),$,0,_t,n.range(0,6.28))):n.add(n.place(Mo(n.range(.4,.8),n.rng()),$,0,_t,n.range(0,6.28))))}n.disc(-21,11,9.2,S.sand,.024),n.disc(-21,11,8.5,S.water,.028),n.blockCircle(-21,11,8.8);const w=[Ia(),Ia(15262416),Ia()];w.forEach((L,z)=>{n.place(L,-21+Math.cos(z*2.1)*4.5,.1,11+Math.sin(z*2.1)*3.5,z*1.7),n.add(L)});const x={x:-21,z:11};for(let L=0;L<34;L++){const z=L/34*Math.PI*2+n.range(-.09,.09),Y=n.range(9.1,11.4),$=x.x+Math.cos(z)*Y,_t=x.z+Math.sin(z)*Y,kt=L%4;kt===0?n.add(n.place(Ro(n.range(.6,1),S.leafDark),$,0,_t)):kt===1?n.add(n.place(Pl(n.range(.9,1.5)),$,0,_t,n.range(0,6.28))):kt===2?n.add(n.place(Mo(n.range(.45,1.5),n.rng()),$,0,_t,n.range(0,6.28))):n.add(n.place(Nr(5,.8),$,0,_t))}for(const[L,z,Y]of[[.9,8.4,1.6],[2.6,8.7,1.1],[4.3,8.3,1.9],[5.6,8.9,1.2]]){const $=x.x+Math.cos(L)*z,_t=x.z+Math.sin(L)*z;n.add(n.place(Mo(Y,L%1,9409947),$,-.12,_t,L)),n.blockCircle($,_t,.4*Y)}for(const[L,z]of[[1.5,8.2],[3.4,8.4],[5.1,8.1],[.2,8.5]])n.add(n.place(pv(n.range(1.1,1.6)),x.x+Math.cos(L)*z,0,x.z+Math.sin(L)*z));const v=[[1.1,6.6,1,!0],[2.9,7.2,.8,!1],[4.6,6.1,1.15,!0],[.4,7.4,.9,!0],[3.8,5.2,1.05,!1],[5.9,6.8,.85,!0]];for(const[L,z,Y,$]of v){const _t=n.place(mv(Y,$),x.x+Math.cos(L)*z,.045,x.z+Math.sin(L)*z);_t.rotation.y=L,n.add(_t)}const P=c.x-c.largura/2,E=c.x+c.largura/2,A=c.z-c.profundidade/2,C=c.z+c.profundidade/2;n.patch(c.x,c.z,c.largura,c.profundidade,S.grassDark,0,.008);const b=(L,z,Y,$)=>{n.patch(L,z,Y,$,15922416,0,.012)};b(c.x,A+.3,c.largura-1.2,.28),b(c.x,C-.3,c.largura-1.2,.28),b(P+.6,c.z,.28,c.profundidade-.6),b(E-.6,c.z,.28,c.profundidade-.6),b(c.x,c.z,.28,c.profundidade-.6),b(P+6,c.z,.22,c.profundidade-.6),b(E-6,c.z,.22,c.profundidade-.6),n.disc(c.x,c.z,2.2,15922416,.011),n.disc(c.x,c.z,1.9,S.grassDark,.012);const y=(L,z,Y,$)=>{n.add(n.place(On(Y,1.5,S.metalWhite),L,0,z,$?Math.PI/2:0)),$?n.blockBox(L,z,.2,Y/2):n.blockBox(L,z,Y/2,.2)};y(c.x,A,c.largura,!1),y(c.x,C,c.largura,!1),y(E,c.z,c.profundidade,!0),y(P,A+3.75,7.5,!0),y(P,C-3.75,7.5,!0),n.add(n.place(Nl(),P+3,0,c.z)),n.blockCircle(P+3,c.z,.5);const D=n.add(n.place(Nl(S.frisbee),E-3,0,c.z));n.blockCircle(E-3,c.z,.5);const F=n.add(n.place(Rv(),c.x,0,A+1.2));n.blockBox(c.x,A+1.2,1,.2);const B=n.add(n.place(Iv(6),c.x,0,C-1.2,Math.PI));n.blockBox(c.x,C-1.4,3,.8);const G=n.add(n.place(Lv(),P+1.6,0,c.z+4.2,Math.PI/2));n.blockCircle(P+1.6,c.z+4.2,.4);const X=n.add(n.place(Dv(),P+1.8,0,c.z-3.4,.4)),K=n.add(n.place(Nv(),E-1.6,0,C-2.4));n.blockCircle(E-1.6,C-2.4,.3);const st=K.userData.manga;n.onUpdate((L,z)=>{K.rotation.y=Math.sin(z*.3)*.5+.6,st.rotation.z=Math.sin(z*1.7)*.12-.06});for(const[L,z]of[[P+1,A+1],[E-1,A+1],[P+1,C-1],[E-1,C-1]])n.add(n.place(Uv(),L,0,z,Math.atan2(c.x-L,c.z-z))),n.blockCircle(L,z,.4);for(const[L,z]of[[P+6,A+1.4],[P+6,C-1.4],[E-6,A+1.4],[E-6,C-1.4]])n.add(n.place(Il(),L,0,z));const J=n.add(n.place(Fl("Frisbee!",S.frisbee),P-1.8,0,c.z+3.4,Math.PI*.25));n.blockCircle(P-1.8,c.z+3.4,.3);const ot=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[L,z,Y]of ot)n.banco(L,z,Y);for(const[L,z]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,2]])n.add(n.place(Ra(!1),L,0,z)),n.blockCircle(L,z,.35);for(const[L,z]of[[3.4,17],[-3.4,11]])n.add(n.place(Rl(),L,0,z)),n.blockCircle(L,z,.35);const Z=n.add(n.place(_v(),-10,0,20,.3));n.blockBox(-10,20,1,.9,.3);const yt=yv(),Wt=Bo(S.metalRed);Wt.position.set(-.78,.82,.3),Wt.rotation.set(-Math.PI/2,0,.7),yt.add(Wt);const Qt=Bo(S.fabricBlue);Qt.position.set(.82,.82,-.28),Qt.rotation.set(-Math.PI/2,0,-2.3),yt.add(Qt);const le=Zh();le.position.set(.36,.845,.42),yt.add(le),n.add(n.place(yt,l.x,0,l.z,l.giro)),n.blockBox(l.x,l.z,1.45,.85,l.giro);const ne=[Wt,Qt,le],rt=n.add(n.place(Fr(16164544,{tipo:"sorvete"}),12,0,18.6,.3));n.blockBox(12,18.6,1.4,.95,.3);const dt=n.add(n.place(bv(S.fabricBlue),o.x,0,o.z));dt.userData.loja=!0,n.blockBox(o.x,o.z-.05,3.7,2.3),n.blockBox(r.x,r.z,.65,1.6);for(const L of[-1,1])n.blockCircle(o.x+L*4.05,o.z+2.82,.16);for(const L of[-1.4,1])n.banco(o.x-5.6,o.z+L,Math.PI/2);for(const[L,z]of[[a.x-a.reta-a.raio-1.4,a.z],[a.x+a.reta+a.raio+1.4,a.z]])n.add(n.place(Ra(!1),L,0,z)),n.blockCircle(L,z,.35);const Rt=14;for(let L=0;L<Rt;L++){const z=L/Rt*Math.PI*2,Y=L%2===0?a.miolo+.9:a.raio-.9,$=a.x+Math.cos(z)*Y+Math.sign(Math.cos(z))*a.reta*Math.abs(Math.cos(z)),_t=a.z+Math.sin(z)*Y;n.add(n.place(Il(),$,0,_t,n.range(0,6.28)))}n.interact({id:"parque:patins",x:r.x+1.8,z:r.z,radius:2.4,label:"Alugar patins",icon:"🛼",highlight:dt,onInteract:async L=>{if(L.hasItem(se.patins.id)){await e([[s,"A gente já pegou um par."],[i,"É, e eu ainda não caí. Ainda."]]);return}await e([[s,"Um par pra cada um, moço."],[i,"Eu não sei patinar direito, hein."],[s,"Por isso eu vou do seu lado."]]),L.equipWearable(se.patins),L.som("sorvete"),L.toast("Patins calçados","🛼"),L.unlock({id:"patins-villa",title:"Patins no Villa",place:"Parque Villa Lobos",note:"A pista tem cone pra desviar e a gente desviou de quase todos.",icon:"🛼"})}});const Vt=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8],[-21,-5,12],[-8.6,2.5,9]],Nt=(L,z)=>Math.abs(L)<4&&z>-20&&z<30?!1:!Vt.some(([Y,$,_t])=>Math.hypot(L-Y,z-$)<_t),te=["redonda","redonda","pinheiro","florida","palmeira"];let me=0;for(let L=0;L<260&&me<64;L++){const z=n.range(-42,42),Y=n.range(-32,30);if(!Nt(z,Y))continue;const $=n.range(.85,1.5);n.add(n.place(Ur(n.pick(te),$,n.rng()),z,0,Y,n.range(0,6.28))),n.blockCircle(z,Y,.45*$),me++}for(let L=0;L<90;L++){const z=n.range(-42,42),Y=n.range(-32,30);Nt(z,Y)&&(L%3===0?n.add(n.place(Nr(6,1.1),z,0,Y)):L%3===1?n.add(n.place(Ro(n.range(.7,1.2)),z,0,Y)):n.add(n.place(Mo(n.range(.5,1)),z,0,Y)))}n.patch(-66,-10,18,220,S.water,0,.02),n.patch(-55,-10,6,220,S.concrete,0,.03);for(let L=0;L<22;L++){const z=n.range(7,20),Y=n.range(4,9);n.add(n.place(Or(Y,z,Y*.9,n.pick([S.wallCream,S.concrete,S.wallMint]),S.metalGrey),n.range(-95,60),0,-96-n.range(0,16)))}for(let L=0;L<14;L++){const z=n.range(6,16);n.add(n.place(Or(n.range(4,8),z,5,S.wallCream,S.roofTile),92+n.range(0,16),0,n.range(-60,40)))}for(let L=0;L<90;L++){const z=L/90*Math.PI*2,Y=62+n.range(0,28),$=Math.cos(z)*Y,_t=Math.sin(z)*Y*.9;$<-50||n.add(n.place(Ur(n.pick(te),n.range(1.2,2.2),n.rng()),$,0,_t,n.range(0,6.28)))}for(let L=0;L<9;L++){const z=jh(n.range(1.6,3.2));z.position.set(n.range(-70,70),n.range(56,70),n.range(-60,45)),n.root.add(z);const Y=n.range(.25,.6);n.onUpdate($=>{z.position.x+=Y*$,z.position.x>56&&(z.position.x=-56)})}const O=n.add(n.place(xv(S.wood,S.metalWhite),2.6,0,27.5,Math.PI));n.add(n.place(On(16,1.4),-10,0,28)),n.add(n.place(On(16,1.4),10,0,28)),n.blockBox(-10,28,8,.2),n.blockBox(10,28,8,.2),n.add(n.place(On(11,1.4),35,0,3.5,Math.PI/2)),n.add(n.place(On(11,1.4),35,0,22.5,Math.PI/2)),n.blockBox(35,3.5,.2,5.5),n.blockBox(35,22.5,.2,5.5),n.patch(30,13,12,5,S.asphalt),n.patch(40,13,12,34,S.asphalt),n.patch(35.6,13,1.6,34,S.concrete,0,.012);const ft=n.add(n.place(Fv(4161494),39.5,0,13,-Math.PI/2));n.blockBox(39.5,13,1.5,4.3);const ht=n.add(n.place(Ov(),36.4,0,13,-Math.PI/2));n.blockBox(35.9,13,.3,1.8);const ct=n.add(n.place(Fl("Clube!",5161384),36.4,0,8.6,Math.PI*.25));n.blockCircle(36.4,8.6,.3),n.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:ft,radius:2.6}),n.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:O,radius:2.2});const j=new r_(S.frisbee);j.mesh.visible=!1,j.onLand=()=>t.som("quicar"),n.root.add(j.mesh);const bt=Pv();bt.visible=!1,bt.userData.mira=!0,n.root.add(bt);const vt=1.3,wt=.12,Xt=4,Zt=22,U=.06,T={alem:3.5,arco:1.2,erro:.06,desvio:1.4,alcance:3,raio:2.1,mira:.12},W={minX:P+1.7,minZ:A+1.7,maxX:E-1.7,maxZ:C-1.7},Q=(L,z,Y)=>Math.max(z,Math.min(Y,L)),ut=(L,z)=>Math.atan2(Math.sin(L-z),Math.cos(L-z)),nt=(L,z)=>Math.hypot(L.x-z.x,L.z-z.z),Ft=[],St=(L,z,Y,$,_t)=>{const kt=n.add(n.place(Cv(_t,Y),L,0,z,Math.PI/2));n.blockCircle(L,z+.96,.36),n.blockCircle(L,z,.75),Ft.push({centro:new N(L,Y,z),raio:.58,pontos:$,roda:kt.userData.aro??null,recarga:0})};St(13,-9.4,1.9,1,S.frisbee),St(23,1.4,2.1,2,S.gold),St(18,-.6,2.5,3,S.frisbee);const Ot=(L,z,Y)=>{const $=z.x-L.x,_t=z.y-L.y,kt=z.z-L.z,ie=$*$+_t*_t+kt*kt;if(ie<1e-8)return Y.distanceTo(L);const jt=Q(((Y.x-L.x)*$+(Y.y-L.y)*_t+(Y.z-L.z)*kt)/ie,0,1);return Math.hypot(Y.x-(L.x+$*jt),Y.y-(L.y+_t*jt),Y.z-(L.z+kt*jt))},zt=(L,z)=>{for(const Y of Ft)Y.recarga>0||Ot(L,z,Y.centro)>Y.raio||(Y.recarga=1.6,t.som("sino"),t.bump("frisbee.alvos",Y.pontos),t.toast(`+${Y.pontos} no alvo!`,"🎯"))},xt=L=>{for(const z of Ft)z.recarga<=0||(z.recarga=Math.max(0,z.recarga-L),z.roda&&(z.roda.rotation.z+=L*9*z.recarga))};let mt="fora",Gt=0,Ut=0,At=!1,qt=0,k=null;const Mt=new N,Et=new N;let It=!1,pt=null,lt=0,Lt=!1,Yt=!0,fe=0;const ae=L=>{t.toast(L[Math.floor(Math.random()*L.length)],"💬")},sn=(L,z)=>{const Y=Math.sin(z),$=Math.cos(z),_t=Y>.001?(W.maxX-L.x)/Y:Y<-.001?(W.minX-L.x)/Y:1/0,kt=$>.001?(W.maxZ-L.z)/$:$<-.001?(W.minZ-L.z)/$:1/0;return Q(Math.min(_t,kt)-1,Xt+3,Zt)},Ze=(L,z,Y)=>Xt+(sn(L,z)-Xt)*Q(Y,0,1),Hs=(L,z,Y)=>{const $=sn(L,z);return Q((Y-Xt)/Math.max(.01,$-Xt),0,1)},hn=(L,z,Y)=>{const $=Hs(L,z,Math.hypot(Y.x-L.x,Y.z-L.z));return $>.02&&$<.99?$:null},rs=L=>1.35-.45*Q(L,0,1),ri=(L,z)=>{L.som("pegar"),qt+=1;const Y=L.bump("frisbee.trocas"),$=L.stat("frisbee.recorde");qt>$&&L.bump("frisbee.recorde",qt-$),z?L.toast("Pegou no ar!","🥏"):qt%5===0&&L.toast(`${qt} trocas seguidas!`,"🥏"),Y>=10&&!L.flag("memoria-frisbee")&&(L.setFlag("memoria-frisbee"),L.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"})),qt>=10&&!L.flag("memoria-frisbee-dez")&&(L.setFlag("memoria-frisbee-dez"),L.unlock({id:"frisbee-dez",title:"Dez sem deixar cair",place:"Parque Villa Lobos",note:"Dez trocas seguidas e nenhuma no chão. A gente parou porque deu fome, não porque errou.",icon:"🏆"}))},Vs=L=>{const z=L.x<c.x?1:-1;return{x:Q(L.x+z*11,P+2,E-2),z:Q(L.z,A+2,C-2)}},Xn=()=>{At=!1,Ut=0,bt.visible=!1,t.showCharge(null)},cs=()=>t.getActiveHandItem()?.id===se.frisbee.id;let Yn=!1;const Gs=()=>{const L=t.addItem(se.frisbee);return L==="cheio"?(Yn||(Yn=!0,t.toast("Sem vaga pro frisbee","🥏")),!1):(mt="comigo",j.pickUp(),qt=0,k=null,t.setZoom(19),t.toast(L==="mao"?"Segure F e solte no traço da barra":"Frisbee guardado — escolha ele na mochila (I)","🥏"),!0)},qs=()=>{mt="fora",Yn=!1,t.removeItem(se.frisbee.id),j.mesh.visible=!1,Xn(),t.freeCompanion(),t.setZoom(14),k=null,pt=null},Ws=(L,z=0,Y=!0)=>{if(mt!=="comigo"||!cs())return;t.removeItem(se.frisbee.id);const $=t.playerPosition(),_t=t.playerFacing(),kt=Q(L,0,1),ie=hn($,_t,t.companionPosition());It=Y&&ie!==null&&Math.abs(kt-ie)<=U,Mt.copy($),Et.copy(t.companionPosition()),j.throwAt($,_t,Ze($,_t,kt),rs(kt),z),t.som("lancar"),Lt=!1,Yt=!0,pt=null,lt=0,mt="voando-pra-ele"},Xs=()=>{const L=hn(t.playerPosition(),t.playerFacing(),t.companionPosition());Ws(L??.5,0,!1)},ls=n.interact({id:"parque:frisbee-jogar",x:c.x,z:c.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>Xs()}),hs=n.interact({id:"parque:frisbee-pegar",x:c.x,z:c.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:L=>{L.addItem(se.frisbee)!=="cheio"&&(j.pickUp(),mt="comigo",ri(L,!1))}});n.onUpdate((L,z)=>{const Y=j.position.clone();j.update(L,W);const $=t.playerPosition(),_t=t.companionPosition(),kt=t.playerFacing(),ie=h($.x,$.z,.4);if(ie&&mt==="fora"?Gs():!ie&&mt!=="fora"&&qs(),mt==="fora"){ls.enabled=!1,hs.enabled=!1,bt.visible=!1,fe=kt;return}if(j.state==="voando"&&zt(Y,j.position),xt(L),mt==="comigo"&&cs()){if(t.keyDown("KeyF")){At=!0,Ut=Math.min(1,Ut+L/vt),t.showCharge(Ut,hn($,kt,_t),U);const jt=Ze($,kt,Ut);bt.position.set($.x+Math.sin(kt)*jt,0,$.z+Math.cos(kt)*jt),bt.scale.setScalar(1+Math.sin(z*9)*.06),bt.visible=!0}else if(At){const jt=Ut,Jt=L>1e-4?ut(kt,fe)/L:0;Xn(),jt<wt?Xs():Ws(jt,Q(Jt*.18,-2.5,2.5))}}else At&&Xn();if(fe=kt,mt==="comigo"||mt==="no-chao"){const jt=Vs($);(!k||Math.hypot(jt.x-k.x,jt.z-k.z)>2.5)&&(t.commandCompanion(jt.x,jt.z),k=jt)}switch(j.mesh.userData.fase=mt,mt){case"comigo":j.holdAt($,kt),j.mesh.visible=!1;break;case"com-ele":{const jt=Math.atan2($.x-_t.x,$.z-_t.z);t.holdCompanion($.x,$.z),j.holdAt(_t,jt),Gt-=L;const Jt=Math.abs(ut(t.companionFacing(),jt))<T.mira;if(Gt<=0&&(Jt||Gt<-1)){const Ht=$.x-_t.x,xe=$.z-_t.z,re=Math.hypot(Ht,xe)||1,Ie=Math.random(),jn=Ie<.3?T.arco*1.35:Ie>.85?.95:T.arco,ke=Ie>.85?T.erro*2.5:T.erro,ci=new N(Q($.x+Ht/re*T.alem+(Math.random()-.5)*T.desvio,P+1.5,E-1.5),0,Q($.z+xe/re*T.alem+(Math.random()-.5)*T.desvio,A+1.5,C-1.5));j.throwToward(_t,ci,ke,jn,(Math.random()-.5)*1),t.som("lancar"),k=null,mt="voando-pra-mim"}break}case"voando-pra-ele":{if(lt-=L,j.state==="voando"&&lt<=0){lt=.25;const Jt=j.ondeVaiCair(W);(!pt||pt.distanceTo(Jt)>.8)&&(pt=Jt,t.commandCompanion(Jt.x,Jt.z),k=null)}const jt=j.state==="voando"&&j.position.y<2.3&&nt(Mt,j.position)>2&&Math.hypot(j.position.x-_t.x,j.position.z-_t.z)<1.5;if(jt&&!Lt){Lt=!0;const Jt=nt(Et,j.position),Ht=Q(.98-j.rasante*.022-Jt*.02+(It?.2:0),.35,.98);Yt=Math.random()<Ht}if(jt&&Yt){t.som("pegar"),t.holdCompanion($.x,$.z),k=null,pt=null;const Jt=Math.round(nt(Mt,j.position));j.pickUp(),Gt=.7,mt="com-ele",It?(t.som("confirma"),t.bump("frisbee.perfeitos"),t.toast("Passe perfeito!","🎯"),ae(["Na mão! Perfeito.","Esse foi bonito, hein.","Assim fica fácil."])):(t.toast("Ele pegou no ar!","🙌"),ae(["Peguei!","Isso! Manda de novo.","Tá vendo? Sou bom nisso."]));const Ht=t.stat("frisbee.maiorPasse");Jt>Ht&&(t.bump("frisbee.maiorPasse",Jt-Ht),t.toast(`Novo recorde: ${Jt} m`,"📏"));break}j.state==="chao"&&(Lt&&!Yt?ae(["Ah, escapou!","Raspou na minha mão!","Essa eu deixei, admito."]):nt(Mt,j.position)>16&&ae(["Calma, não sou cachorro!","Jogou pra longe demais.","Vou ter que correr até lá?"]),qt=0,j.position.distanceTo(_t)<1.6?(t.holdCompanion($.x,$.z),k=null,pt=null,j.pickUp(),Gt=.8,mt="com-ele"):(t.commandCompanion(j.position.x,j.position.z),k=null,mt="buscando"));break}case"buscando":j.position.distanceTo(_t)<1.1&&(t.holdCompanion($.x,$.z),k=null,pt=null,j.pickUp(),Gt=.9,mt="com-ele");break;case"voando-pra-mim":{if(j.state==="voando"&&j.position.y<T.alcance&&Math.hypot(j.position.x-$.x,j.position.z-$.z)<T.raio){if(t.addItem(se.frisbee)==="cheio")break;j.pickUp(),mt="comigo",ri(t,!0);break}j.state==="chao"&&(mt="no-chao",qt=0,j.position.distanceTo($)<1.9&&t.addItem(se.frisbee)!=="cheio"&&(j.pickUp(),mt="comigo",ri(t,!1)));break}case"no-chao":j.position.distanceTo($)<1.2&&t.addItem(se.frisbee)!=="cheio"&&(j.pickUp(),mt="comigo",ri(t,!1));break}ls.enabled=mt==="comigo"&&!At,hs.enabled=mt==="no-chao",mt==="comigo"?ls.moveTo($.x,$.z):hs.moveTo(j.position.x,j.position.z)}),n.interact({id:"parque:placa-quadra",x:P-1.8,z:c.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:J,onInteract:()=>e([[s,"QUADRA LIVRE — respeite quem chegou primeiro."],[i,"Hoje só tem a gente."],[s,"Então segura o F. A marca no chão mostra onde o disco vai cair, e o traço na barra é onde eu estou."],[i,"E se eu quiser mostrar serviço?"],[s,"Acerta um dos aros. Ou uma cesta, se estiver se achando."]])}),n.interact({id:"parque:placar",x:c.x,z:A+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:F,onInteract:L=>{const z=L.stat("frisbee.recorde"),Y=L.stat("frisbee.trocas"),$=L.stat("frisbee.perfeitos"),_t=L.stat("frisbee.alvos"),kt=L.stat("frisbee.maiorPasse"),ie=[[i,z>0?`Nosso recorde é ${z} trocas seguidas.`:"O placar tá zerado."],[s,Y>0?`E já foram ${Y} no total. A gente não desiste fácil.`:"Bora estrear isso então."]];return kt>0&&ie.push([i,`O passe mais longo que colou foi de ${kt} metros.`]),$>0&&ie.push([s,`${$} ${$===1?"passe caiu":"passes caíram"} certinho na minha mão.`]),_t>0&&ie.push([i,`E ${_t} ${_t===1?"ponto":"pontos"} nos alvos. Anota aí.`]),e(ie)}}),n.interact({id:"parque:arquibancada",x:c.x,z:C-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:B,onInteract:()=>e([[s,"Cansei. Cinco minutos."],[i,"Você falou cinco minutos faz meia hora."],[s,"E olha que descanso bem, hein."]])}),n.interact({id:"parque:bebedouro",x:P+2.8,z:c.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:G,onInteract:async L=>{await e([[i,"A água daqui é sempre meio quente."],[s,"Mas depois de correr atrás de disco, tá ótima."]]),L.toast("Água (meio quente)","🚰")}}),n.interact({id:"parque:sacola",x:P+2.8,z:c.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:X,onInteract:()=>e([[s,"Tem uns três discos aqui de gente que esqueceu."],[i,"Um deles é seu. Desde março."],[s,"…é, pode ser."]])}),n.interact({id:"parque:cesta",x:E-4.4,z:c.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:D,onInteract:()=>e([[i,"Um dia a gente acerta essa cesta."],[s,"Já acertei uma vez!"],[i,"Você acertou o poste. É diferente."]])}),n.interact({id:"parque:biruta",x:E-3,z:C-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:K,onInteract:()=>e([[s,"O vento tá indo pra lá."],[i,"Então joga contra que o disco fica no ar mais tempo."],[s,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),n.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:ht,onInteract:()=>e([[i,"Esse é o que passa no clube?"],[s,"É esse. Já tá parado, é só subir."]])}),n.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:ct,onInteract:()=>e([[s,'"Clube!" — com exclamação e tudo.'],[i,"Quem escreveu isso tava animado."]])}),n.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async L=>{L.som("pato"),await L.say(["Que lago bonito... dá até vontade de pular"],yn.name),await L.say(["Então vamos! Hahahha"],An.name),await L.say(["NÃAAOOO"],yn.name),L.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});let Ci=0;n.onUpdate(L=>{Ci<=0||(Ci-=L,Ci<=0&&(t.removeItem(se.sorveteMorango.id,An.id),t.removeItem(se.sorveteMaracuja.id,yn.id),t.toast("Acabou o sorvete","🍦")))});const Be=new f_(5);Be.guardar(),yt.add(Be.grupo),Be.onSom=L=>t.som(L),yt.userData.pingpong=Be;const I=(L,z)=>{const Y=new N(L,0,z);return yt.localToWorld(Y),Y};let H=!1;const tt=p_.plano+.55,et=()=>{H=!1,Be.guardar();for(const L of ne)L.visible=!0;t.showPlacar(null),t.setCameraOmbro(null),t.setPlayerVisible(!0),t.lockPlayer(!1),t.freeCompanion(),q.enabled=!0};n.onUpdate(L=>{H&&(Be.update(L,t.pointer()),H&&t.showPlacar({eu:t.playerName(),ele:t.companionName(),meus:Be.meus,dele:Be.dele}))});const q=n.interact({id:"parque:pingpong",x:l.x,z:l.z,radius:2.6,label:"Jogar ping pong",icon:"🏓",highlight:yt,onInteract:async L=>{if(H)return;await e([[i,"Cinco pontos?"],[s,"Cinco pontos. E o perdedor carrega a bolsa até em casa."]]);const z=I(-tt,0),Y=I(tt,0);L.releasePlayer(z.x,z.z,Math.atan2(Y.x-z.x,Y.z-z.z)),L.releaseCompanion(Y.x,Y.z,Math.atan2(z.x-Y.x,z.z-Y.z)),L.holdCompanion(z.x,z.z),L.lockPlayer(!0);const $=I(-tt-1.6,0),_t=I(0,0);L.setCameraOmbro(new N($.x,2.35,$.z),new N(_t.x,.9,_t.z)),L.setPlayerVisible(!1);for(const kt of ne)kt.visible=!1;q.enabled=!1,Be.comecar(),H=!0,L.toast("Mexa o mouse para mover a raquete","🏓")}});Be.onPonto=L=>{t.som(L?"confirma":"quicar")},Be.onFim=L=>{(async()=>(et(),L?(t.som("memoria"),t.toast("Campeão de ping pong!","🏆"),t.equipWearable(se.chapeuPingPong),await e([[i,"Cinco a "+Be.dele+"."],[s,"Você ganhou o chapéu. Vai ter que usar."]]),t.unlock({id:"memoria-ping-pong",title:"A mesa do parque",place:"Parque Villa Lobos",note:"Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.",icon:"🏓"})):await e([[s,"Cinco a "+Be.meus+". Revanche?"],[i,"Sempre revanche."]])))()},n.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:rt,onInteract:async L=>{await e([[i,"Dois, por favor."],[s,"Um de morango e um de maracujá."],[i,"Nunca pedimos diferente."]]),Ci=50,L.addItem(se.sorveteMorango,An.id),L.addItem(se.sorveteMaracuja,yn.id),L.som("sorvete"),L.toast("Morango e maracujá","🍦"),L.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),n.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:Z,onInteract:async L=>{await e([[s,"A toalha xadrez de sempre."],[i,"E o pão de queijo já frio."],[s,"Frio é melhor. Aceita."]]),L.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),n.interact({id:"parque:bilheteria",x:9.5,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:m,onInteract:()=>e([[i,"Dois pra roda gigante."],[s,"Sempre dois."]])});let gt=null;const Ct=L=>new Promise(z=>{gt={resolve:z,de:_.angle,voltas:L}});let Dt=!0;n.onUpdate(L=>{if(_.update(L),Dt){const z=t.playerPosition(),Y=Math.hypot(z.x,z.z+26);if(Y<28){const $=Math.max(0,Math.min(1,(Y-8)/20));t.setZoom(36-$*21)}}if(w.forEach((z,Y)=>{z.position.y=.1+Math.sin(performance.now()/900+Y)*.05}),gt&&_.turnsSince(gt.de)>=gt.voltas){const z=gt.resolve;gt=null,z()}}),n.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async L=>{Dt=!1,L.lockPlayer(!0),await e([[s,"A fila tá curta hoje."],[i,"Bora subir?"]]);const z=_.boardingCabin(),Y=_.speed;_.speed=Y*5,L.som("sino"),L.ridePlayer(z,new N(-.3,-.34,0),.55),L.rideCompanion(z,new N(.3,-.34,0),.55),L.focusCamera(z),L.setZoom(38),await Ct(.25),await e([[i,"Daqui dá pra ver o parque inteiro."],[s,"E aquele pedacinho do rio ali atrás."]]),await Ct(.35),await e([[i,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[s,"Pronto. Subimos."]]),await Ct(.4),_.speed=Y,L.focusCamera(null),L.releasePlayer(0,-17.6,0),L.releaseCompanion(-1.1,-17.9,0),L.lockPlayer(!1),Dt=!0,L.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},m_={[Jr.id]:Jr,[Ql.id]:Ql,[nh.id]:nh,[Jl.id]:Jl},g_=Jr.id,ou=document.getElementById("app");if(!ou)throw new Error("#app nao encontrado");const jo=new z1(ou,m_,i_,g_),ks=new URLSearchParams(location.search),v_=ks.get("cena")??void 0,__=ks.get("entrada")??void 0;jo.start(v_,__);const ka=Number(ks.get("zoom"));Number.isFinite(ka)&&ka>0&&jo.setZoom(ka);const _s=ks.get("em")?.split(",").map(Number);if(_s&&_s.length===2&&_s.every(Number.isFinite)){const n=Number(ks.get("olhar"));jo.debugPlace(_s[0],_s[1],Number.isFinite(n)?n:Math.PI/4)}window.jogo=jo;window.aristoryAudio={Musica:iu,CLIMAS:Do,EFEITOS:nu};window.aristoryItens=Object.fromEntries(Object.values(se).map(n=>[n.id,n]));window.aristoryMemorias=qr.map(n=>({id:n.id,titulo:n.titulo}));
