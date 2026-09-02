(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const $r="180",hu=0,xc=1,uu=2,oh=1,ah=2,zn=3,Wn=0,$e=1,yn=2,oi=0,Yi=1,Mc=2,yc=3,bc=4,du=5,Mi=100,fu=101,pu=102,mu=103,gu=104,vu=200,_u=201,xu=202,Mu=203,Va=204,Ha=205,yu=206,bu=207,Su=208,wu=209,Eu=210,Tu=211,Au=212,Cu=213,Pu=214,Ga=0,qa=1,Wa=2,Ji=3,Xa=4,ja=5,Ya=6,Za=7,rh=0,Ru=1,Iu=2,ai=0,Lu=1,Du=2,Uu=3,Nu=4,Fu=5,Ou=6,zu=7,ch=300,$i=301,Ki=302,Ja=303,$a=304,Ho=306,Ka=1e3,bi=1001,Qa=1002,je=1003,Bu=1004,js=1005,An=1006,Jo=1007,Si=1008,In=1009,lh=1010,hh=1011,Ts=1012,Kr=1013,Ei=1014,Vn=1015,zs=1016,Qr=1017,tc=1018,As=1020,uh=35902,dh=35899,fh=1021,ph=1022,wn=1023,Cs=1026,Ps=1027,ec=1028,nc=1029,mh=1030,ic=1031,sc=1033,Eo=33776,To=33777,Ao=33778,Co=33779,tr=35840,er=35841,nr=35842,ir=35843,sr=36196,or=37492,ar=37496,rr=37808,cr=37809,lr=37810,hr=37811,ur=37812,dr=37813,fr=37814,pr=37815,mr=37816,gr=37817,vr=37818,_r=37819,xr=37820,Mr=37821,yr=36492,br=36494,Sr=36495,wr=36283,Er=36284,Tr=36285,Ar=36286,ku=3200,Vu=3201,gh=0,Hu=1,ii="",nn="srgb",Qi="srgb-linear",Uo="linear",ve="srgb",Ri=7680,Sc=519,Gu=512,qu=513,Wu=514,vh=515,Xu=516,ju=517,Yu=518,Zu=519,wc=35044,Ec="300 es",Cn=2e3,No=2001;class ns{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Tc=1234567;const ys=Math.PI/180,Rs=180/Math.PI;function Ci(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]).toLowerCase()}function ne(n,t,e){return Math.max(t,Math.min(e,n))}function oc(n,t){return(n%t+t)%t}function Ju(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function $u(n,t,e){return n!==t?(e-n)/(t-n):0}function bs(n,t,e){return(1-e)*n+e*t}function Ku(n,t,e,i){return bs(n,t,1-Math.exp(-e*i))}function Qu(n,t=1){return t-Math.abs(oc(n,t*2)-t)}function td(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function ed(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function nd(n,t){return n+Math.floor(Math.random()*(t-n+1))}function id(n,t){return n+Math.random()*(t-n)}function sd(n){return n*(.5-Math.random())}function od(n){n!==void 0&&(Tc=n);let t=Tc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ad(n){return n*ys}function rd(n){return n*Rs}function cd(n){return(n&n-1)===0&&n!==0}function ld(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function hd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ud(n,t,e,i,s){const o=Math.cos,a=Math.sin,r=o(e/2),c=a(e/2),l=o((t+i)/2),h=a((t+i)/2),u=o((t-i)/2),d=a((t-i)/2),p=o((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(r*h,c*u,c*d,r*l);break;case"YZY":n.set(c*d,r*h,c*u,r*l);break;case"ZXZ":n.set(c*u,c*d,r*h,r*l);break;case"XZX":n.set(r*h,c*g,c*p,r*l);break;case"YXY":n.set(c*p,r*h,c*g,r*l);break;case"ZYZ":n.set(c*g,c*p,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Wi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function qe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const De={DEG2RAD:ys,RAD2DEG:Rs,generateUUID:Ci,clamp:ne,euclideanModulo:oc,mapLinear:Ju,inverseLerp:$u,lerp:bs,damp:Ku,pingpong:Qu,smoothstep:td,smootherstep:ed,randInt:nd,randFloat:id,randFloatSpread:sd,seededRandom:od,degToRad:ad,radToDeg:rd,isPowerOfTwo:cd,ceilPowerOfTwo:ld,floorPowerOfTwo:hd,setQuaternionFromProperEuler:ud,normalize:qe,denormalize:Wi};class Tt{constructor(t=0,e=0){Tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*i-a*s+t.x,this.y=o*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class is{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,o,a,r){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const d=o[a+0],p=o[a+1],g=o[a+2],v=o[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==p||h!==g){let m=1-r;const f=c*d+l*p+h*g+u*v,S=f>=0?1:-1,x=1-f*f;if(x>Number.EPSILON){const P=Math.sqrt(x),E=Math.atan2(P,f*S);m=Math.sin(m*E)/P,r=Math.sin(r*E)/P}const _=r*S;if(c=c*m+d*_,l=l*m+p*_,h=h*m+g*_,u=u*m+v*_,m===1-r){const P=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=P,l*=P,h*=P,u*=P}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,o,a){const r=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=o[a],d=o[a+1],p=o[a+2],g=o[a+3];return t[e]=r*g+h*u+c*p-l*d,t[e+1]=c*g+h*d+l*u-r*p,t[e+2]=l*g+h*p+r*d-c*u,t[e+3]=h*g-r*u-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(s/2),u=r(o/2),d=c(i/2),p=c(s/2),g=c(o/2);switch(a){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],o=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(o-l)*p,this._z=(a-s)*p}else if(i>r&&i>u){const p=2*Math.sqrt(1+i-r-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(o+l)/p}else if(r>u){const p=2*Math.sqrt(1+r-i-u);this._w=(o-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-i-r);this._w=(a-s)/p,this._x=(o+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,o=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*r+s*l-o*c,this._y=s*h+a*c+o*r-i*l,this._z=o*h+a*l+i*c-s*r,this._w=a*h-i*r-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,o=this._z,a=this._w;let r=a*t._w+i*t._x+s*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=s,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=o*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,i=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ac.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ac.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6]*s,this.y=o[1]*e+o[4]*i+o[7]*s,this.z=o[2]*e+o[5]*i+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=t.elements,a=1/(o[3]*e+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*i+o[8]*s+o[12])*a,this.y=(o[1]*e+o[5]*i+o[9]*s+o[13])*a,this.z=(o[2]*e+o[6]*i+o[10]*s+o[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*s-r*i),h=2*(r*e-o*s),u=2*(o*i-a*e);return this.x=e+c*l+a*u-r*h,this.y=i+c*h+r*l-o*u,this.z=s+c*u+o*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s,this.y=o[1]*e+o[5]*i+o[9]*s,this.z=o[2]*e+o[6]*i+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,o=t.z,a=e.x,r=e.y,c=e.z;return this.x=s*c-o*r,this.y=o*a-i*c,this.z=i*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return $o.copy(this).projectOnVector(t),this.sub($o)}reflect(t){return this.sub($o.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $o=new N,Ac=new is;class Kt{constructor(t,e,i,s,o,a,r,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l)}set(t,e,i,s,o,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=o,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],p=i[5],g=i[8],v=s[0],m=s[3],f=s[6],S=s[1],x=s[4],_=s[7],P=s[2],E=s[5],A=s[8];return o[0]=a*v+r*S+c*P,o[3]=a*m+r*x+c*E,o[6]=a*f+r*_+c*A,o[1]=l*v+h*S+u*P,o[4]=l*m+h*x+u*E,o[7]=l*f+h*_+u*A,o[2]=d*v+p*S+g*P,o[5]=d*m+p*x+g*E,o[8]=d*f+p*_+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-i*o*h+i*r*c+s*o*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,d=r*c-h*o,p=l*o-a*c,g=e*u+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*i)*v,t[2]=(r*i-s*a)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*o-r*e)*v,t[6]=p*v,t[7]=(i*c-l*e)*v,t[8]=(a*e-i*o)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,o,a,r){const c=Math.cos(o),l=Math.sin(o);return this.set(i*c,i*l,-i*(c*a+l*r)+a+t,-s*l,s*c,-s*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(Ko.makeScale(t,e)),this}rotate(t){return this.premultiply(Ko.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ko.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Ko=new Kt;function _h(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Fo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function dd(){const n=Fo("canvas");return n.style.display="block",n}const Cc={};function Is(n){n in Cc||(Cc[n]=!0,console.warn(n))}function fd(n,t,e){return new Promise(function(i,s){function o(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:i()}}setTimeout(o,e)})}const Pc=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Rc=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function pd(){const n={enabled:!0,workingColorSpace:Qi,spaces:{},convert:function(s,o,a){return this.enabled===!1||o===a||!o||!a||(this.spaces[o].transfer===ve&&(s.r=Gn(s.r),s.g=Gn(s.g),s.b=Gn(s.b)),this.spaces[o].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[o].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=Zi(s.r),s.g=Zi(s.g),s.b=Zi(s.b))),s},workingToColorSpace:function(s,o){return this.convert(s,this.workingColorSpace,o)},colorSpaceToWorking:function(s,o){return this.convert(s,o,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ii?Uo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,o=this.workingColorSpace){return s.fromArray(this.spaces[o].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,o,a){return s.copy(this.spaces[o].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,o){return Is("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,o)},toWorkingColorSpace:function(s,o){return Is("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,o)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Qi]:{primaries:t,whitePoint:i,transfer:Uo,toXYZ:Pc,fromXYZ:Rc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:t,whitePoint:i,transfer:ve,toXYZ:Pc,fromXYZ:Rc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}}),n}const de=pd();function Gn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Zi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ii;class md{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ii===void 0&&(Ii=Fo("canvas")),Ii.width=t.width,Ii.height=t.height;const s=Ii.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Ii}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Fo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=Gn(o[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Gn(e[i]/255)*255):e[i]=Gn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let gd=0;class ac{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:gd++}),this.uuid=Ci(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(Qo(s[a].image)):o.push(Qo(s[a]))}else o=Qo(s);i.url=o}return e||(t.images[this.uuid]=i),i}}function Qo(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?md.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let vd=0;const ta=new N;class Be extends ns{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,i=bi,s=bi,o=An,a=Si,r=wn,c=In,l=Be.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:vd++}),this.uuid=Ci(),this.name="",this.source=new ac(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ta).x}get height(){return this.source.getSize(ta).y}get depth(){return this.source.getSize(ta).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ch)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ka:t.x=t.x-Math.floor(t.x);break;case bi:t.x=t.x<0?0:1;break;case Qa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ka:t.y=t.y-Math.floor(t.y);break;case bi:t.y=t.y<0?0:1;break;case Qa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=ch;Be.DEFAULT_ANISOTROPY=1;class Ee{constructor(t=0,e=0,i=0,s=1){Ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*o,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*o,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*o,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],v=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,_=(p+1)/2,P=(f+1)/2,E=(h+d)/4,A=(u+v)/4,R=(g+m)/4;return x>_&&x>P?x<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(x),s=E/i,o=A/i):_>P?_<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(_),i=E/s,o=R/s):P<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(P),i=A/o,s=R/o),this.set(i,s,o,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(d-h)/S,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class _d extends ns{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:An,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ee(0,0,t,e),this.scissorTest=!1,this.viewport=new Ee(0,0,t,e);const s={width:t,height:e,depth:i.depth},o=new Be(s);this.textures=[];const a=i.count;for(let r=0;r<a;r++)this.textures[r]=o.clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:An,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new ac(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ti extends _d{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class xh extends Be{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class xd extends Be{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ss{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(pn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(pn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=pn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const o=i.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,pn):pn.fromBufferAttribute(o,a),pn.applyMatrix4(t.matrixWorld),this.expandByPoint(pn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ys.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ys.copy(i.boundingBox)),Ys.applyMatrix4(t.matrixWorld),this.union(Ys)}const s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,pn),pn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(us),Zs.subVectors(this.max,us),Li.subVectors(t.a,us),Di.subVectors(t.b,us),Ui.subVectors(t.c,us),Jn.subVectors(Di,Li),$n.subVectors(Ui,Di),ui.subVectors(Li,Ui);let e=[0,-Jn.z,Jn.y,0,-$n.z,$n.y,0,-ui.z,ui.y,Jn.z,0,-Jn.x,$n.z,0,-$n.x,ui.z,0,-ui.x,-Jn.y,Jn.x,0,-$n.y,$n.x,0,-ui.y,ui.x,0];return!ea(e,Li,Di,Ui,Zs)||(e=[1,0,0,0,1,0,0,0,1],!ea(e,Li,Di,Ui,Zs))?!1:(Js.crossVectors(Jn,$n),e=[Js.x,Js.y,Js.z],ea(e,Li,Di,Ui,Zs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,pn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(pn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Dn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Dn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Dn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Dn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Dn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Dn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Dn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Dn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Dn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Dn=[new N,new N,new N,new N,new N,new N,new N,new N],pn=new N,Ys=new ss,Li=new N,Di=new N,Ui=new N,Jn=new N,$n=new N,ui=new N,us=new N,Zs=new N,Js=new N,di=new N;function ea(n,t,e,i,s){for(let o=0,a=n.length-3;o<=a;o+=3){di.fromArray(n,o);const r=s.x*Math.abs(di.x)+s.y*Math.abs(di.y)+s.z*Math.abs(di.z),c=t.dot(di),l=e.dot(di),h=i.dot(di);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const Md=new ss,ds=new N,na=new N;class Go{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Md.setFromPoints(t).getCenter(i);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ds.subVectors(t,this.center);const e=ds.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ds,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(na.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ds.copy(t.center).add(na)),this.expandByPoint(ds.copy(t.center).sub(na))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Un=new N,ia=new N,$s=new N,Kn=new N,sa=new N,Ks=new N,oa=new N;class Mh{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Un)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Un.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Un.copy(this.origin).addScaledVector(this.direction,e),Un.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){ia.copy(t).add(e).multiplyScalar(.5),$s.copy(e).sub(t).normalize(),Kn.copy(this.origin).sub(ia);const o=t.distanceTo(e)*.5,a=-this.direction.dot($s),r=Kn.dot(this.direction),c=-Kn.dot($s),l=Kn.lengthSq(),h=Math.abs(1-a*a);let u,d,p,g;if(h>0)if(u=a*c-r,d=a*r-c,g=o*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,p=u*(u+a*d+2*r)+d*(a*u+d+2*c)+l}else d=o,u=Math.max(0,-(a*d+r)),p=-u*u+d*(d+2*c)+l;else d=-o,u=Math.max(0,-(a*d+r)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*o+r)),d=u>0?-o:Math.min(Math.max(-o,-c),o),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-o,-c),o),p=d*(d+2*c)+l):(u=Math.max(0,-(a*o+r)),d=u>0?o:Math.min(Math.max(-o,-c),o),p=-u*u+d*(d+2*c)+l);else d=a>0?-o:o,u=Math.max(0,-(a*d+r)),p=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ia).addScaledVector($s,d),p}intersectSphere(t,e){Un.subVectors(t.center,this.origin);const i=Un.dot(this.direction),s=Un.dot(Un)-i*i,o=t.radius*t.radius;if(s>o)return null;const a=Math.sqrt(o-s),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,o,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(o=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(o=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||o>s||((o>i||isNaN(i))&&(i=o),(a<s||isNaN(s))&&(s=a),u>=0?(r=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Un)!==null}intersectTriangle(t,e,i,s,o){sa.subVectors(e,t),Ks.subVectors(i,t),oa.crossVectors(sa,Ks);let a=this.direction.dot(oa),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;Kn.subVectors(this.origin,t);const c=r*this.direction.dot(Ks.crossVectors(Kn,Ks));if(c<0)return null;const l=r*this.direction.dot(sa.cross(Kn));if(l<0||c+l>a)return null;const h=-r*Kn.dot(oa);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class we{constructor(t,e,i,s,o,a,r,c,l,h,u,d,p,g,v,m){we.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l,h,u,d,p,g,v,m)}set(t,e,i,s,o,a,r,c,l,h,u,d,p,g,v,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=s,f[1]=o,f[5]=a,f[9]=r,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new we().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Ni.setFromMatrixColumn(t,0).length(),o=1/Ni.setFromMatrixColumn(t,1).length(),a=1/Ni.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*o,e[5]=i[5]*o,e[6]=i[6]*o,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,o=t.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const d=a*h,p=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=d-v*l,e[9]=-r*c,e[2]=v-d*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,p=c*u,g=l*h,v=l*u;e[0]=d+v*r,e[4]=g*r-p,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=p*r-g,e[6]=v+d*r,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,p=c*u,g=l*h,v=l*u;e[0]=d-v*r,e[4]=-a*u,e[8]=g+p*r,e[1]=p+g*r,e[5]=a*h,e[9]=v-d*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,p=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=g*l-p,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=p*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,p=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=p*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,p=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=r*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(yd,t,bd)}lookAt(t,e,i){const s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),Qn.crossVectors(i,Qe),Qn.lengthSq()===0&&(Math.abs(i.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),Qn.crossVectors(i,Qe)),Qn.normalize(),Qs.crossVectors(Qe,Qn),s[0]=Qn.x,s[4]=Qs.x,s[8]=Qe.x,s[1]=Qn.y,s[5]=Qs.y,s[9]=Qe.y,s[2]=Qn.z,s[6]=Qs.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],p=i[13],g=i[2],v=i[6],m=i[10],f=i[14],S=i[3],x=i[7],_=i[11],P=i[15],E=s[0],A=s[4],R=s[8],w=s[12],y=s[1],D=s[5],F=s[9],z=s[13],V=s[2],q=s[6],J=s[10],st=s[14],$=s[3],at=s[7],Z=s[11],yt=s[15];return o[0]=a*E+r*y+c*V+l*$,o[4]=a*A+r*D+c*q+l*at,o[8]=a*R+r*F+c*J+l*Z,o[12]=a*w+r*z+c*st+l*yt,o[1]=h*E+u*y+d*V+p*$,o[5]=h*A+u*D+d*q+p*at,o[9]=h*R+u*F+d*J+p*Z,o[13]=h*w+u*z+d*st+p*yt,o[2]=g*E+v*y+m*V+f*$,o[6]=g*A+v*D+m*q+f*at,o[10]=g*R+v*F+m*J+f*Z,o[14]=g*w+v*z+m*st+f*yt,o[3]=S*E+x*y+_*V+P*$,o[7]=S*A+x*D+_*q+P*at,o[11]=S*R+x*F+_*J+P*Z,o[15]=S*w+x*z+_*st+P*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],v=t[7],m=t[11],f=t[15];return g*(+o*c*u-s*l*u-o*r*d+i*l*d+s*r*p-i*c*p)+v*(+e*c*p-e*l*d+o*a*d-s*a*p+s*l*h-o*c*h)+m*(+e*l*u-e*r*p-o*a*u+i*a*p+o*r*h-i*l*h)+f*(-s*r*h-e*c*u+e*r*d+s*a*u-i*a*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],v=t[13],m=t[14],f=t[15],S=u*m*l-v*d*l+v*c*p-r*m*p-u*c*f+r*d*f,x=g*d*l-h*m*l-g*c*p+a*m*p+h*c*f-a*d*f,_=h*v*l-g*u*l+g*r*p-a*v*p-h*r*f+a*u*f,P=g*u*c-h*v*c-g*r*d+a*v*d+h*r*m-a*u*m,E=e*S+i*x+s*_+o*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=S*A,t[1]=(v*d*o-u*m*o-v*s*p+i*m*p+u*s*f-i*d*f)*A,t[2]=(r*m*o-v*c*o+v*s*l-i*m*l-r*s*f+i*c*f)*A,t[3]=(u*c*o-r*d*o-u*s*l+i*d*l+r*s*p-i*c*p)*A,t[4]=x*A,t[5]=(h*m*o-g*d*o+g*s*p-e*m*p-h*s*f+e*d*f)*A,t[6]=(g*c*o-a*m*o-g*s*l+e*m*l+a*s*f-e*c*f)*A,t[7]=(a*d*o-h*c*o+h*s*l-e*d*l-a*s*p+e*c*p)*A,t[8]=_*A,t[9]=(g*u*o-h*v*o-g*i*p+e*v*p+h*i*f-e*u*f)*A,t[10]=(a*v*o-g*r*o+g*i*l-e*v*l-a*i*f+e*r*f)*A,t[11]=(h*r*o-a*u*o-h*i*l+e*u*l+a*i*p-e*r*p)*A,t[12]=P*A,t[13]=(h*v*s-g*u*s+g*i*d-e*v*d-h*i*m+e*u*m)*A,t[14]=(g*r*s-a*v*s-g*i*c+e*v*c+a*i*m-e*r*m)*A,t[15]=(a*u*s-h*r*s+h*i*c-e*u*c-a*i*d+e*r*d)*A,this}scale(t){const e=this.elements,i=t.x,s=t.y,o=t.z;return e[0]*=i,e[4]*=s,e[8]*=o,e[1]*=i,e[5]*=s,e[9]*=o,e[2]*=i,e[6]*=s,e[10]*=o,e[3]*=i,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),o=1-i,a=t.x,r=t.y,c=t.z,l=o*a,h=o*r;return this.set(l*a+i,l*r-s*c,l*c+s*r,0,l*r+s*c,h*r+i,h*c-s*a,0,l*c-s*r,h*c+s*a,o*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,o,a){return this.set(1,i,o,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,o=e._x,a=e._y,r=e._z,c=e._w,l=o+o,h=a+a,u=r+r,d=o*l,p=o*h,g=o*u,v=a*h,m=a*u,f=r*u,S=c*l,x=c*h,_=c*u,P=i.x,E=i.y,A=i.z;return s[0]=(1-(v+f))*P,s[1]=(p+_)*P,s[2]=(g-x)*P,s[3]=0,s[4]=(p-_)*E,s[5]=(1-(d+f))*E,s[6]=(m+S)*E,s[7]=0,s[8]=(g+x)*A,s[9]=(m-S)*A,s[10]=(1-(d+v))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let o=Ni.set(s[0],s[1],s[2]).length();const a=Ni.set(s[4],s[5],s[6]).length(),r=Ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],mn.copy(this);const l=1/o,h=1/a,u=1/r;return mn.elements[0]*=l,mn.elements[1]*=l,mn.elements[2]*=l,mn.elements[4]*=h,mn.elements[5]*=h,mn.elements[6]*=h,mn.elements[8]*=u,mn.elements[9]*=u,mn.elements[10]*=u,e.setFromRotationMatrix(mn),i.x=o,i.y=a,i.z=r,this}makePerspective(t,e,i,s,o,a,r=Cn,c=!1){const l=this.elements,h=2*o/(e-t),u=2*o/(i-s),d=(e+t)/(e-t),p=(i+s)/(i-s);let g,v;if(c)g=o/(a-o),v=a*o/(a-o);else if(r===Cn)g=-(a+o)/(a-o),v=-2*a*o/(a-o);else if(r===No)g=-a/(a-o),v=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,o,a,r=Cn,c=!1){const l=this.elements,h=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),p=-(i+s)/(i-s);let g,v;if(c)g=1/(a-o),v=a/(a-o);else if(r===Cn)g=-2/(a-o),v=-(a+o)/(a-o);else if(r===No)g=-1/(a-o),v=-o/(a-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ni=new N,mn=new we,yd=new N(0,0,0),bd=new N(1,1,1),Qn=new N,Qs=new N,Qe=new N,Ic=new we,Lc=new is;class Xn{constructor(t=0,e=0,i=0,s=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,o=s[0],a=s[4],r=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,p));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Ic.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ic,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Lc.setFromEuler(this),this.setFromQuaternion(Lc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class yh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Sd=0;const Dc=new N,Fi=new is,Nn=new we,to=new N,fs=new N,wd=new N,Ed=new is,Uc=new N(1,0,0),Nc=new N(0,1,0),Fc=new N(0,0,1),Oc={type:"added"},Td={type:"removed"},Oi={type:"childadded",child:null},aa={type:"childremoved",child:null};class ye extends ns{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sd++}),this.uuid=Ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new N,e=new Xn,i=new is,s=new N(1,1,1);function o(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new we},normalMatrix:{value:new Kt}}),this.matrix=new we,this.matrixWorld=new we,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new yh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(Uc,t)}rotateY(t){return this.rotateOnAxis(Nc,t)}rotateZ(t){return this.rotateOnAxis(Fc,t)}translateOnAxis(t,e){return Dc.copy(t).applyQuaternion(this.quaternion),this.position.add(Dc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Uc,t)}translateY(t){return this.translateOnAxis(Nc,t)}translateZ(t){return this.translateOnAxis(Fc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Nn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?to.copy(t):to.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),fs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Nn.lookAt(fs,to,this.up):Nn.lookAt(to,fs,this.up),this.quaternion.setFromRotationMatrix(Nn),s&&(Nn.extractRotation(s.matrixWorld),Fi.setFromRotationMatrix(Nn),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Oc),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Td),aa.child=t,this.dispatchEvent(aa),aa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Nn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Nn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Nn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Oc),Oi.child=t,this.dispatchEvent(Oi),Oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,t,wd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fs,Ed,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(r=>({...r})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));s.material=r}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(o(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}ye.DEFAULT_UP=new N(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gn=new N,Fn=new N,ra=new N,On=new N,zi=new N,Bi=new N,zc=new N,ca=new N,la=new N,ha=new N,ua=new Ee,da=new Ee,fa=new Ee;class bn{constructor(t=new N,e=new N,i=new N){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),gn.subVectors(t,e),s.cross(gn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,i,s,o){gn.subVectors(s,e),Fn.subVectors(i,e),ra.subVectors(t,e);const a=gn.dot(gn),r=gn.dot(Fn),c=gn.dot(ra),l=Fn.dot(Fn),h=Fn.dot(ra),u=a*l-r*r;if(u===0)return o.set(0,0,0),null;const d=1/u,p=(l*c-r*h)*d,g=(a*h-r*c)*d;return o.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(t,e,i,s,o,a,r,c){return this.getBarycoord(t,e,i,s,On)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,On.x),c.addScaledVector(a,On.y),c.addScaledVector(r,On.z),c)}static getInterpolatedAttribute(t,e,i,s,o,a){return ua.setScalar(0),da.setScalar(0),fa.setScalar(0),ua.fromBufferAttribute(t,e),da.fromBufferAttribute(t,i),fa.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(ua,o.x),a.addScaledVector(da,o.y),a.addScaledVector(fa,o.z),a}static isFrontFacing(t,e,i,s){return gn.subVectors(i,e),Fn.subVectors(t,e),gn.cross(Fn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return gn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),gn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return bn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return bn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,o){return bn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}containsPoint(t){return bn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return bn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,o=this.c;let a,r;zi.subVectors(s,i),Bi.subVectors(o,i),ca.subVectors(t,i);const c=zi.dot(ca),l=Bi.dot(ca);if(c<=0&&l<=0)return e.copy(i);la.subVectors(t,s);const h=zi.dot(la),u=Bi.dot(la);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(zi,a);ha.subVectors(t,o);const p=zi.dot(ha),g=Bi.dot(ha);if(g>=0&&p<=g)return e.copy(o);const v=p*l-c*g;if(v<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(Bi,r);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return zc.subVectors(o,s),r=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(zc,r);const f=1/(m+v+d);return a=v*f,r=d*f,e.copy(i).addScaledVector(zi,a).addScaledVector(Bi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const bh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ti={h:0,s:0,l:0},eo={h:0,s:0,l:0};function pa(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ae{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=i,de.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=de.workingColorSpace){if(t=oc(t,1),e=ne(e,0,1),i=ne(i,0,1),e===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+e):i+e-i*e,a=2*i-o;this.r=pa(a,o,t+1/3),this.g=pa(a,o,t),this.b=pa(a,o,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=nn){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const i=bh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=Zi(t.r),this.g=Zi(t.g),this.b=Zi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return de.workingToColorSpace(Oe.copy(this),t),Math.round(ne(Oe.r*255,0,255))*65536+Math.round(ne(Oe.g*255,0,255))*256+Math.round(ne(Oe.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(Oe.copy(this),e);const i=Oe.r,s=Oe.g,o=Oe.b,a=Math.max(i,s,o),r=Math.min(i,s,o);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case i:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-i)/u+2;break;case o:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=nn){de.workingToColorSpace(Oe.copy(this),t);const e=Oe.r,i=Oe.g,s=Oe.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(ti),this.setHSL(ti.h+t,ti.s+e,ti.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ti),t.getHSL(eo);const i=bs(ti.h,eo.h,e),s=bs(ti.s,eo.s,e),o=bs(ti.l,eo.l,e);return this.setHSL(i,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*i+o[6]*s,this.g=o[1]*e+o[4]*i+o[7]*s,this.b=o[2]*e+o[5]*i+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new ae;ae.NAMES=bh;let Ad=0;class os extends ns{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=Ci(),this.name="",this.type="Material",this.blending=Yi,this.side=Wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Va,this.blendDst=Ha,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=Ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ri,this.stencilZFail=Ri,this.stencilZPass=Ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Yi&&(i.blending=this.blending),this.side!==Wn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Va&&(i.blendSrc=this.blendSrc),this.blendDst!==Ha&&(i.blendDst=this.blendDst),this.blendEquation!==Mi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ji&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Sc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ri&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ri&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ri&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(e){const o=s(t.textures),a=s(t.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=e[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class qo extends os{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=rh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Te=new N,no=new Tt;let Cd=0;class Rn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Cd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=wc,this.updateRanges=[],this.gpuType=Vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)no.fromBufferAttribute(this,e),no.applyMatrix3(t),this.setXY(e,no.x,no.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Wi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=qe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Wi(e,this.array)),e}setX(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Wi(e,this.array)),e}setY(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Wi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Wi(e,this.array)),e}setW(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),i=qe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),i=qe(i,this.array),s=qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,o){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),i=qe(i,this.array),s=qe(s,this.array),o=qe(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==wc&&(t.usage=this.usage),t}}class Sh extends Rn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class wh extends Rn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class re extends Rn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Pd=0;const cn=new we,ma=new ye,ki=new N,tn=new ss,ps=new ss,Re=new N;class Ie extends ns{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Pd++}),this.uuid=Ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_h(t)?wh:Sh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Kt().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return cn.makeRotationFromQuaternion(t),this.applyMatrix4(cn),this}rotateX(t){return cn.makeRotationX(t),this.applyMatrix4(cn),this}rotateY(t){return cn.makeRotationY(t),this.applyMatrix4(cn),this}rotateZ(t){return cn.makeRotationZ(t),this.applyMatrix4(cn),this}translate(t,e,i){return cn.makeTranslation(t,e,i),this.applyMatrix4(cn),this}scale(t,e,i){return cn.makeScale(t,e,i),this.applyMatrix4(cn),this}lookAt(t){return ma.lookAt(t),ma.updateMatrix(),this.applyMatrix4(ma.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,o=t.length;s<o;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new re(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const o=t[s];e.setXYZ(s,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ss);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const o=e[i];tn.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Go);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const i=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];ps.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(tn.min,ps.min),tn.expandByPoint(Re),Re.addVectors(tn.max,ps.max),tn.expandByPoint(Re)):(tn.expandByPoint(ps.min),tn.expandByPoint(ps.max))}tn.getCenter(i);let s=0;for(let o=0,a=t.count;o<a;o++)Re.fromBufferAttribute(t,o),s=Math.max(s,i.distanceToSquared(Re));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)Re.fromBufferAttribute(r,l),c&&(ki.fromBufferAttribute(t,l),Re.add(ki)),s=Math.max(s,i.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Rn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),r=[],c=[];for(let R=0;R<i.count;R++)r[R]=new N,c[R]=new N;const l=new N,h=new N,u=new N,d=new Tt,p=new Tt,g=new Tt,v=new N,m=new N;function f(R,w,y){l.fromBufferAttribute(i,R),h.fromBufferAttribute(i,w),u.fromBufferAttribute(i,y),d.fromBufferAttribute(o,R),p.fromBufferAttribute(o,w),g.fromBufferAttribute(o,y),h.sub(l),u.sub(l),p.sub(d),g.sub(d);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(D),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(D),r[R].add(v),r[w].add(v),r[y].add(v),c[R].add(m),c[w].add(m),c[y].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let R=0,w=S.length;R<w;++R){const y=S[R],D=y.start,F=y.count;for(let z=D,V=D+F;z<V;z+=3)f(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const x=new N,_=new N,P=new N,E=new N;function A(R){P.fromBufferAttribute(s,R),E.copy(P);const w=r[R];x.copy(w),x.sub(P.multiplyScalar(P.dot(w))).normalize(),_.crossVectors(E,w);const D=_.dot(c[R])<0?-1:1;a.setXYZW(R,x.x,x.y,x.z,D)}for(let R=0,w=S.length;R<w;++R){const y=S[R],D=y.start,F=y.count;for(let z=D,V=D+F;z<V;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Rn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const s=new N,o=new N,a=new N,r=new N,c=new N,l=new N,h=new N,u=new N;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),r.add(h),c.add(h),l.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,d=new l.constructor(c.length*h);let p=0,g=0;for(let v=0,m=c.length;v<m;v++){r.isInterleavedBufferAttribute?p=c[v]*r.data.stride+r.offset:p=c[v]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new Rn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,i=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,i);e.setAttribute(r,l)}const o=this.morphAttributes;for(const r in o){const c=[],l=o[r];for(let h=0,u=l.length;h<u;h++){const d=l[h],p=t(d,i);c.push(p)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Bc=new we,fi=new Mh,io=new Go,kc=new N,so=new N,oo=new N,ao=new N,ga=new N,ro=new N,Vc=new N,co=new N;class M extends ye{constructor(t=new Ie,e=new qo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(o&&r){ro.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=r[c],u=o[c];h!==0&&(ga.fromBufferAttribute(u,t),a?ro.addScaledVector(ga,h):ro.addScaledVector(ga.sub(e),h))}e.add(ro)}return e}raycast(t,e){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),io.copy(i.boundingSphere),io.applyMatrix4(o),fi.copy(t.ray).recast(t.near),!(io.containsPoint(fi.origin)===!1&&(fi.intersectSphere(io,kc)===null||fi.origin.distanceToSquared(kc)>(t.far-t.near)**2))&&(Bc.copy(o).invert(),fi.copy(t.ray).applyMatrix4(Bc),!(i.boundingBox!==null&&fi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,fi)))}_computeIntersections(t,e,i){let s;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,d=o.groups,p=o.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),x=Math.min(r.count,Math.min(m.start+m.count,p.start+p.count));for(let _=S,P=x;_<P;_+=3){const E=r.getX(_),A=r.getX(_+1),R=r.getX(_+2);s=lo(this,f,t,i,l,h,u,E,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(r.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const S=r.getX(m),x=r.getX(m+1),_=r.getX(m+2);s=lo(this,a,t,i,l,h,u,S,x,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),x=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let _=S,P=x;_<P;_+=3){const E=_,A=_+1,R=_+2;s=lo(this,f,t,i,l,h,u,E,A,R),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const S=m,x=m+1,_=m+2;s=lo(this,a,t,i,l,h,u,S,x,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Rd(n,t,e,i,s,o,a,r){let c;if(t.side===$e?c=i.intersectTriangle(a,o,s,!0,r):c=i.intersectTriangle(s,o,a,t.side===Wn,r),c===null)return null;co.copy(r),co.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(co);return l<e.near||l>e.far?null:{distance:l,point:co.clone(),object:n}}function lo(n,t,e,i,s,o,a,r,c,l){n.getVertexPosition(r,so),n.getVertexPosition(c,oo),n.getVertexPosition(l,ao);const h=Rd(n,t,e,i,so,oo,ao,Vc);if(h){const u=new N;bn.getBarycoord(Vc,so,oo,ao,u),s&&(h.uv=bn.getInterpolatedAttribute(s,r,c,l,u,new Tt)),o&&(h.uv1=bn.getInterpolatedAttribute(o,r,c,l,u,new Tt)),a&&(h.normal=bn.getInterpolatedAttribute(a,r,c,l,u,new N),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:c,c:l,normal:new N,materialIndex:0};bn.getNormal(so,oo,ao,d.normal),h.face=d,h.barycoord=u}return h}class H extends Ie{constructor(t=1,e=1,i=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:o,depthSegments:a};const r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,i,e,t,a,o,0),g("z","y","x",1,-1,i,e,-t,a,o,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,o,4),g("x","y","z",-1,-1,t,e,-i,s,o,5),this.setIndex(c),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(u,2));function g(v,m,f,S,x,_,P,E,A,R,w){const y=_/A,D=P/R,F=_/2,z=P/2,V=E/2,q=A+1,J=R+1;let st=0,$=0;const at=new N;for(let Z=0;Z<J;Z++){const yt=Z*D-z;for(let Wt=0;Wt<q;Wt++){const te=Wt*y-F;at[v]=te*S,at[m]=yt*x,at[f]=V,l.push(at.x,at.y,at.z),at[v]=0,at[m]=0,at[f]=E>0?1:-1,h.push(at.x,at.y,at.z),u.push(Wt/A),u.push(1-Z/R),st+=1}}for(let Z=0;Z<R;Z++)for(let yt=0;yt<A;yt++){const Wt=d+yt+q*Z,te=d+yt+q*(Z+1),he=d+(yt+1)+q*(Z+1),se=d+(yt+1)+q*Z;c.push(Wt,te,se),c.push(te,he,se),$+=6}r.addGroup(p,$,w),p+=$,d+=st}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new H(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ts(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function We(n){const t={};for(let e=0;e<n.length;e++){const i=ts(n[e]);for(const s in i)t[s]=i[s]}return t}function Id(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Eh(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const Ld={clone:ts,merge:We};var Dd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ud=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ri extends os{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dd,this.fragmentShader=Ud,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ts(t.uniforms),this.uniformsGroups=Id(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Th extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new we,this.projectionMatrix=new we,this.projectionMatrixInverse=new we,this.coordinateSystem=Cn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ei=new N,Hc=new Tt,Gc=new Tt;class sn extends Th{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Rs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ys*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Rs*2*Math.atan(Math.tan(ys*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ei.x,ei.y).multiplyScalar(-t/ei.z),ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ei.x,ei.y).multiplyScalar(-t/ei.z)}getViewSize(t,e){return this.getViewBounds(t,Hc,Gc),e.subVectors(Gc,Hc)}setViewOffset(t,e,i,s,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ys*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vi=-90,Hi=1;class Nd extends ye{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Vi,Hi,t,e);s.layers=this.layers,this.add(s);const o=new sn(Vi,Hi,t,e);o.layers=this.layers,this.add(o);const a=new sn(Vi,Hi,t,e);a.layers=this.layers,this.add(a);const r=new sn(Vi,Hi,t,e);r.layers=this.layers,this.add(r);const c=new sn(Vi,Hi,t,e);c.layers=this.layers,this.add(c);const l=new sn(Vi,Hi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,o,a,r,c]=e;for(const l of e)this.remove(l);if(t===Cn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===No)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,o),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Ah extends Be{constructor(t=[],e=$i,i,s,o,a,r,c,l,h){super(t,e,i,s,o,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Fd extends Ti{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Ah(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new H(5,5,5),o=new ri({name:"CubemapFromEquirect",uniforms:ts(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$e,blending:oi});o.uniforms.tEquirect.value=e;const a=new M(s,o),r=e.minFilter;return e.minFilter===Si&&(e.minFilter=An),new Nd(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(o)}}class ot extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Od={type:"move"};class va{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,o=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,i),f=this._getHandJoint(l,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,i),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Od)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ot;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class rc{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new ae(t),this.near=e,this.far=i}clone(){return new rc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Ch extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class zd extends Be{constructor(t=null,e=1,i=1,s,o,a,r,c,l=je,h=je,u,d){super(null,a,r,c,l,h,s,o,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const _a=new N,Bd=new N,kd=new Kt;class _i{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=_a.subVectors(i,e).cross(Bd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(_a),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||kd.getNormalMatrix(t),s=this.coplanarPoint(_a).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pi=new Go,Vd=new Tt(.5,.5),ho=new N;class cc{constructor(t=new _i,e=new _i,i=new _i,s=new _i,o=new _i,a=new _i){this.planes=[t,e,i,s,o,a]}set(t,e,i,s,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Cn,i=!1){const s=this.planes,o=t.elements,a=o[0],r=o[1],c=o[2],l=o[3],h=o[4],u=o[5],d=o[6],p=o[7],g=o[8],v=o[9],m=o[10],f=o[11],S=o[12],x=o[13],_=o[14],P=o[15];if(s[0].setComponents(l-a,p-h,f-g,P-S).normalize(),s[1].setComponents(l+a,p+h,f+g,P+S).normalize(),s[2].setComponents(l+r,p+u,f+v,P+x).normalize(),s[3].setComponents(l-r,p-u,f-v,P-x).normalize(),i)s[4].setComponents(c,d,m,_).normalize(),s[5].setComponents(l-c,p-d,f-m,P-_).normalize();else if(s[4].setComponents(l-c,p-d,f-m,P-_).normalize(),e===Cn)s[5].setComponents(l+c,p+d,f+m,P+_).normalize();else if(e===No)s[5].setComponents(c,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(t){pi.center.set(0,0,0);const e=Vd.distanceTo(t.center);return pi.radius=.7071067811865476+e,pi.applyMatrix4(t.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(ho.x=s.normal.x>0?t.max.x:t.min.x,ho.y=s.normal.y>0?t.max.y:t.min.y,ho.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ho)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ph extends os{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Oo=new N,zo=new N,qc=new we,ms=new Mh,uo=new Go,xa=new N,Wc=new N;class Hd extends ye{constructor(t=new Ie,e=new Ph){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,o=e.count;s<o;s++)Oo.fromBufferAttribute(e,s-1),zo.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=Oo.distanceTo(zo);t.setAttribute("lineDistance",new re(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),uo.copy(i.boundingSphere),uo.applyMatrix4(s),uo.radius+=o,t.ray.intersectsSphere(uo)===!1)return;qc.copy(s).invert(),ms.copy(t.ray).applyMatrix4(qc);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=l){const f=h.getX(v),S=h.getX(v+1),x=fo(this,t,ms,c,f,S,v);x&&e.push(x)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(p),f=fo(this,t,ms,c,v,m,g-1);f&&e.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=l){const f=fo(this,t,ms,c,v,v+1,v);f&&e.push(f)}if(this.isLineLoop){const v=fo(this,t,ms,c,g-1,p,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function fo(n,t,e,i,s,o,a){const r=n.geometry.attributes.position;if(Oo.fromBufferAttribute(r,s),zo.fromBufferAttribute(r,o),e.distanceSqToSegment(Oo,zo,xa,Wc)>i)return;xa.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(xa);if(!(l<t.near||l>t.far))return{distance:l,point:Wc.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Xc=new N,jc=new N;class Yc extends Hd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,o=e.count;s<o;s+=2)Xc.fromBufferAttribute(e,s),jc.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Xc.distanceTo(jc);t.setAttribute("lineDistance",new re(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Gd extends Be{constructor(t,e,i,s,o,a,r,c,l){super(t,e,i,s,o,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Rh extends Be{constructor(t,e,i=Ei,s,o,a,r=je,c=je,l,h=Cs,u=1){if(h!==Cs&&h!==Ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,o,a,r,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ac(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Ih extends Be{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class En extends Ie{constructor(t=1,e=1,i=4,s=8,o=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:o},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),o=Math.max(1,Math.floor(o));const a=[],r=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,p=2*u+d,g=i*2+o,v=s+1,m=new N,f=new N;for(let S=0;S<=g;S++){let x=0,_=0,P=0,E=0;if(S<=i){const w=S/i,y=w*Math.PI/2;_=-h-t*Math.cos(y),P=t*Math.sin(y),E=-t*Math.cos(y),x=w*u}else if(S<=i+o){const w=(S-i)/o;_=-h+w*e,P=t,E=0,x=u+w*d}else{const w=(S-i-o)/i,y=w*Math.PI/2;_=h+t*Math.sin(y),P=t*Math.cos(y),E=t*Math.sin(y),x=u+d+w*u}const A=Math.max(0,Math.min(1,x/p));let R=0;S===0?R=.5/s:S===g&&(R=-.5/s);for(let w=0;w<=s;w++){const y=w/s,D=y*Math.PI*2,F=Math.sin(D),z=Math.cos(D);f.x=-P*z,f.y=_,f.z=P*F,r.push(f.x,f.y,f.z),m.set(-P*z,E,P*F),m.normalize(),c.push(m.x,m.y,m.z),l.push(y+R,A)}if(S>0){const w=(S-1)*v;for(let y=0;y<s;y++){const D=w+y,F=w+y+1,z=S*v+y,V=S*v+y+1;a.push(D,F,z),a.push(F,V,z)}}}this.setIndex(a),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new En(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Ls extends Ie{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const o=[],a=[],r=[],c=[],l=new N,h=new Tt;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const p=i+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)o.push(u,u+1,0);this.setIndex(o),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(r,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ls(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class nt extends Ie{constructor(t=1,e=1,i=1,s=32,o=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:o,openEnded:a,thetaStart:r,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],d=[],p=[];let g=0;const v=[],m=i/2;let f=0;S(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(p,2));function S(){const _=new N,P=new N;let E=0;const A=(e-t)/i;for(let R=0;R<=o;R++){const w=[],y=R/o,D=y*(e-t)+t;for(let F=0;F<=s;F++){const z=F/s,V=z*c+r,q=Math.sin(V),J=Math.cos(V);P.x=D*q,P.y=-y*i+m,P.z=D*J,u.push(P.x,P.y,P.z),_.set(q,A,J).normalize(),d.push(_.x,_.y,_.z),p.push(z,1-y),w.push(g++)}v.push(w)}for(let R=0;R<s;R++)for(let w=0;w<o;w++){const y=v[w][R],D=v[w+1][R],F=v[w+1][R+1],z=v[w][R+1];(t>0||w!==0)&&(h.push(y,D,z),E+=3),(e>0||w!==o-1)&&(h.push(D,F,z),E+=3)}l.addGroup(f,E,0),f+=E}function x(_){const P=g,E=new Tt,A=new N;let R=0;const w=_===!0?t:e,y=_===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*y,0),d.push(0,y,0),p.push(.5,.5),g++;const D=g;for(let F=0;F<=s;F++){const V=F/s*c+r,q=Math.cos(V),J=Math.sin(V);A.x=w*J,A.y=m*y,A.z=w*q,u.push(A.x,A.y,A.z),d.push(0,y,0),E.x=q*.5+.5,E.y=J*.5*y+.5,p.push(E.x,E.y),g++}for(let F=0;F<s;F++){const z=P+F,V=D+F;_===!0?h.push(V,V+1,z):h.push(V+1,V,z),R+=3}l.addGroup(f,R,_===!0?1:2),f+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ne extends nt{constructor(t=1,e=1,i=32,s=1,o=!1,a=0,r=Math.PI*2){super(0,t,e,i,s,o,a,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:r}}static fromJSON(t){return new Ne(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Wo extends Ie{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const o=[],a=[];r(s),l(i),h(),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(o.slice(),3)),this.setAttribute("uv",new re(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(S){const x=new N,_=new N,P=new N;for(let E=0;E<e.length;E+=3)p(e[E+0],x),p(e[E+1],_),p(e[E+2],P),c(x,_,P,S)}function c(S,x,_,P){const E=P+1,A=[];for(let R=0;R<=E;R++){A[R]=[];const w=S.clone().lerp(_,R/E),y=x.clone().lerp(_,R/E),D=E-R;for(let F=0;F<=D;F++)F===0&&R===E?A[R][F]=w:A[R][F]=w.clone().lerp(y,F/D)}for(let R=0;R<E;R++)for(let w=0;w<2*(E-R)-1;w++){const y=Math.floor(w/2);w%2===0?(d(A[R][y+1]),d(A[R+1][y]),d(A[R][y])):(d(A[R][y+1]),d(A[R+1][y+1]),d(A[R+1][y]))}}function l(S){const x=new N;for(let _=0;_<o.length;_+=3)x.x=o[_+0],x.y=o[_+1],x.z=o[_+2],x.normalize().multiplyScalar(S),o[_+0]=x.x,o[_+1]=x.y,o[_+2]=x.z}function h(){const S=new N;for(let x=0;x<o.length;x+=3){S.x=o[x+0],S.y=o[x+1],S.z=o[x+2];const _=m(S)/2/Math.PI+.5,P=f(S)/Math.PI+.5;a.push(_,1-P)}g(),u()}function u(){for(let S=0;S<a.length;S+=6){const x=a[S+0],_=a[S+2],P=a[S+4],E=Math.max(x,_,P),A=Math.min(x,_,P);E>.9&&A<.1&&(x<.2&&(a[S+0]+=1),_<.2&&(a[S+2]+=1),P<.2&&(a[S+4]+=1))}}function d(S){o.push(S.x,S.y,S.z)}function p(S,x){const _=S*3;x.x=t[_+0],x.y=t[_+1],x.z=t[_+2]}function g(){const S=new N,x=new N,_=new N,P=new N,E=new Tt,A=new Tt,R=new Tt;for(let w=0,y=0;w<o.length;w+=9,y+=6){S.set(o[w+0],o[w+1],o[w+2]),x.set(o[w+3],o[w+4],o[w+5]),_.set(o[w+6],o[w+7],o[w+8]),E.set(a[y+0],a[y+1]),A.set(a[y+2],a[y+3]),R.set(a[y+4],a[y+5]),P.copy(S).add(x).add(_).divideScalar(3);const D=m(P);v(E,y+0,S,D),v(A,y+2,x,D),v(R,y+4,_,D)}}function v(S,x,_,P){P<0&&S.x===1&&(a[x]=S.x-1),_.x===0&&_.z===0&&(a[x]=P/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function f(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Wo(t.vertices,t.indices,t.radius,t.details)}}class lc extends Wo{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=1/i,o=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(o,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new lc(t.radius,t.detail)}}class Ln{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),o+=i.distanceTo(s),e.push(o),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const o=i.length;let a;e?a=e:a=t*i[o-1];let r=0,c=o-1,l;for(;r<=c;)if(s=Math.floor(r+(c-r)/2),l=i[s]-a,l<0)r=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(o-1);const h=i[s],d=i[s+1]-h,p=(a-h)/d;return(s+p)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const a=this.getPoint(s),r=this.getPoint(o),c=e||(a.isVector2?new Tt:new N);return c.copy(r).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new N,s=[],o=[],a=[],r=new N,c=new we;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new N)}o[0]=new N,a[0]=new N;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),o[0].crossVectors(s[0],r),a[0].crossVectors(s[0],o[0]);for(let p=1;p<=t;p++){if(o[p]=o[p-1].clone(),a[p]=a[p-1].clone(),r.crossVectors(s[p-1],s[p]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(ne(s[p-1].dot(s[p]),-1,1));o[p].applyMatrix4(c.makeRotationAxis(r,g))}a[p].crossVectors(s[p],o[p])}if(e===!0){let p=Math.acos(ne(o[0].dot(o[t]),-1,1));p/=t,s[0].dot(r.crossVectors(o[0],o[t]))>0&&(p=-p);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class hc extends Ln{constructor(t=0,e=0,i=1,s=1,o=0,a=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Tt){const i=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(a?o=0:o=s),this.aClockwise===!0&&!a&&(o===s?o=-s:o=o-s);const r=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,p=l-this.aY;c=d*h-p*u+this.aX,l=d*u+p*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class qd extends hc{constructor(t,e,i,s,o,a){super(t,e,i,i,s,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function uc(){let n=0,t=0,e=0,i=0;function s(o,a,r,c){n=o,t=r,e=-3*o+3*a-2*r-c,i=2*o-2*a+r+c}return{initCatmullRom:function(o,a,r,c,l){s(a,r,l*(r-o),l*(c-a))},initNonuniformCatmullRom:function(o,a,r,c,l,h,u){let d=(a-o)/l-(r-o)/(l+h)+(r-a)/h,p=(r-a)/h-(c-a)/(h+u)+(c-r)/u;d*=h,p*=h,s(a,r,d,p)},calc:function(o){const a=o*o,r=a*o;return n+t*o+e*a+i*r}}}const po=new N,Ma=new uc,ya=new uc,ba=new uc;class Wd extends Ln{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new N){const i=e,s=this.points,o=s.length,a=(o-(this.closed?0:1))*t;let r=Math.floor(a),c=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/o)+1)*o:c===0&&r===o-1&&(r=o-2,c=1);let l,h;this.closed||r>0?l=s[(r-1)%o]:(po.subVectors(s[0],s[1]).add(s[0]),l=po);const u=s[r%o],d=s[(r+1)%o];if(this.closed||r+2<o?h=s[(r+2)%o]:(po.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=po),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),p),v=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Ma.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),ya.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),ba.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Ma.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),ya.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),ba.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(Ma.calc(c),ya.calc(c),ba.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new N().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Zc(n,t,e,i,s){const o=(i-t)*.5,a=(s-e)*.5,r=n*n,c=n*r;return(2*e-2*i+o+a)*c+(-3*e+3*i-2*o-a)*r+o*n+e}function Xd(n,t){const e=1-n;return e*e*t}function jd(n,t){return 2*(1-n)*n*t}function Yd(n,t){return n*n*t}function Ss(n,t,e,i){return Xd(n,t)+jd(n,e)+Yd(n,i)}function Zd(n,t){const e=1-n;return e*e*e*t}function Jd(n,t){const e=1-n;return 3*e*e*n*t}function $d(n,t){return 3*(1-n)*n*n*t}function Kd(n,t){return n*n*n*t}function ws(n,t,e,i,s){return Zd(n,t)+Jd(n,e)+$d(n,i)+Kd(n,s)}class Lh extends Ln{constructor(t=new Tt,e=new Tt,i=new Tt,s=new Tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Tt){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(ws(t,s.x,o.x,a.x,r.x),ws(t,s.y,o.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Qd extends Ln{constructor(t=new N,e=new N,i=new N,s=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new N){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(ws(t,s.x,o.x,a.x,r.x),ws(t,s.y,o.y,a.y,r.y),ws(t,s.z,o.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Dh extends Ln{constructor(t=new Tt,e=new Tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Tt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tf extends Ln{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uh extends Ln{constructor(t=new Tt,e=new Tt,i=new Tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Tt){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(Ss(t,s.x,o.x,a.x),Ss(t,s.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ef extends Ln{constructor(t=new N,e=new N,i=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new N){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(Ss(t,s.x,o.x,a.x),Ss(t,s.y,o.y,a.y),Ss(t,s.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nh extends Ln{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Tt){const i=e,s=this.points,o=(s.length-1)*t,a=Math.floor(o),r=o-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Zc(r,c.x,l.x,h.x,u.x),Zc(r,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Tt().fromArray(s))}return this}}var Cr=Object.freeze({__proto__:null,ArcCurve:qd,CatmullRomCurve3:Wd,CubicBezierCurve:Lh,CubicBezierCurve3:Qd,EllipseCurve:hc,LineCurve:Dh,LineCurve3:tf,QuadraticBezierCurve:Uh,QuadraticBezierCurve3:ef,SplineCurve:Nh});class nf extends Ln{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Cr[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=i){const a=s[o]-i,r=this.curves[o],c=r.getLength(),l=c===0?0:1-a/c;return r.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,o=this.curves;s<o.length;s++){const a=o[s],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new Cr[s.type]().fromJSON(s))}return this}}class Pr extends nf{constructor(t){super(),this.type="Path",this.currentPoint=new Tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Dh(this.currentPoint.clone(),new Tt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const o=new Uh(this.currentPoint.clone(),new Tt(t,e),new Tt(i,s));return this.curves.push(o),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,o,a){const r=new Lh(this.currentPoint.clone(),new Tt(t,e),new Tt(i,s),new Tt(o,a));return this.curves.push(r),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Nh(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,o,a){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,s,o,a),this}absarc(t,e,i,s,o,a){return this.absellipse(t,e,i,i,s,o,a),this}ellipse(t,e,i,s,o,a,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,o,a,r,c),this}absellipse(t,e,i,s,o,a,r,c){const l=new hc(t,e,i,s,o,a,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Xo extends Pr{constructor(t){super(t),this.uuid=Ci(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Pr().fromJSON(s))}return this}}function sf(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let o=Fh(n,0,s,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,c,l;if(i&&(o=lf(n,t,o,e)),n.length>80*e){r=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const p=n[d],g=n[d+1];p<r&&(r=p),g<c&&(c=g),p>h&&(h=p),g>u&&(u=g)}l=Math.max(h-r,u-c),l=l!==0?32767/l:0}return Ds(o,a,e,r,c,l,0),a}function Fh(n,t,e,i,s){let o;if(s===Mf(n,t,e,i)>0)for(let a=t;a<e;a+=i)o=Jc(a/i|0,n[a],n[a+1],o);else for(let a=e-i;a>=t;a-=i)o=Jc(a/i|0,n[a],n[a+1],o);return o&&es(o,o.next)&&(Ns(o),o=o.next),o}function Ai(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(es(e,e.next)||Se(e.prev,e,e.next)===0)){if(Ns(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ds(n,t,e,i,s,o,a){if(!n)return;!a&&o&&pf(n,i,s,o);let r=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(o?af(n,i,s,o):of(n)){t.push(c.i,n.i,l.i),Ns(n),n=l.next,r=l.next;continue}if(n=l,n===r){a?a===1?(n=rf(Ai(n),t),Ds(n,t,e,i,s,o,2)):a===2&&cf(n,t,e,i,s,o):Ds(Ai(n),t,e,i,s,o,1);break}}}function of(n){const t=n.prev,e=n,i=n.next;if(Se(t,e,i)>=0)return!1;const s=t.x,o=e.x,a=i.x,r=t.y,c=e.y,l=i.y,h=Math.min(s,o,a),u=Math.min(r,c,l),d=Math.max(s,o,a),p=Math.max(r,c,l);let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&xs(s,r,o,c,a,l,g.x,g.y)&&Se(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function af(n,t,e,i){const s=n.prev,o=n,a=n.next;if(Se(s,o,a)>=0)return!1;const r=s.x,c=o.x,l=a.x,h=s.y,u=o.y,d=a.y,p=Math.min(r,c,l),g=Math.min(h,u,d),v=Math.max(r,c,l),m=Math.max(h,u,d),f=Rr(p,g,t,e,i),S=Rr(v,m,t,e,i);let x=n.prevZ,_=n.nextZ;for(;x&&x.z>=f&&_&&_.z<=S;){if(x.x>=p&&x.x<=v&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&xs(r,h,c,u,l,d,x.x,x.y)&&Se(x.prev,x,x.next)>=0||(x=x.prevZ,_.x>=p&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&xs(r,h,c,u,l,d,_.x,_.y)&&Se(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;x&&x.z>=f;){if(x.x>=p&&x.x<=v&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&xs(r,h,c,u,l,d,x.x,x.y)&&Se(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;_&&_.z<=S;){if(_.x>=p&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==a&&xs(r,h,c,u,l,d,_.x,_.y)&&Se(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function rf(n,t){let e=n;do{const i=e.prev,s=e.next.next;!es(i,s)&&zh(i,e,e.next,s)&&Us(i,s)&&Us(s,i)&&(t.push(i.i,e.i,s.i),Ns(e),Ns(e.next),e=n=s),e=e.next}while(e!==n);return Ai(e)}function cf(n,t,e,i,s,o){let a=n;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&vf(a,r)){let c=Bh(a,r);a=Ai(a,a.next),c=Ai(c,c.next),Ds(a,t,e,i,s,o,0),Ds(c,t,e,i,s,o,0);return}r=r.next}a=a.next}while(a!==n)}function lf(n,t,e,i){const s=[];for(let o=0,a=t.length;o<a;o++){const r=t[o]*i,c=o<a-1?t[o+1]*i:n.length,l=Fh(n,r,c,i,!1);l===l.next&&(l.steiner=!0),s.push(gf(l))}s.sort(hf);for(let o=0;o<s.length;o++)e=uf(s[o],e);return e}function hf(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function uf(n,t){const e=df(n,t);if(!e)return t;const i=Bh(e,n);return Ai(i,i.next),Ai(e,e.next)}function df(n,t){let e=t;const i=n.x,s=n.y;let o=-1/0,a;if(es(n,e))return e;do{if(es(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>o&&(o=u,a=e.x<e.next.x?e:e.next,u===i))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&Oh(s<l?i:o,s,c,l,s<l?o:i,s,e.x,e.y)){const u=Math.abs(s-e.y)/(i-e.x);Us(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&ff(a,e)))&&(a=e,h=u)}e=e.next}while(e!==r);return a}function ff(n,t){return Se(n.prev,n,t.prev)<0&&Se(t.next,n,n.next)<0}function pf(n,t,e,i){let s=n;do s.z===0&&(s.z=Rr(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,mf(s)}function mf(n){let t,e=1;do{let i=n,s;n=null;let o=null;for(t=0;i;){t++;let a=i,r=0;for(let l=0;l<e&&(r++,a=a.nextZ,!!a);l++);let c=e;for(;r>0||c>0&&a;)r!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,r--):(s=a,a=a.nextZ,c--),o?o.nextZ=s:n=s,s.prevZ=o,o=s;i=a}o.nextZ=null,e*=2}while(t>1);return n}function Rr(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function gf(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Oh(n,t,e,i,s,o,a,r){return(s-a)*(t-r)>=(n-a)*(o-r)&&(n-a)*(i-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(s-a)*(i-r)}function xs(n,t,e,i,s,o,a,r){return!(n===a&&t===r)&&Oh(n,t,e,i,s,o,a,r)}function vf(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!_f(n,t)&&(Us(n,t)&&Us(t,n)&&xf(n,t)&&(Se(n.prev,n,t.prev)||Se(n,t.prev,t))||es(n,t)&&Se(n.prev,n,n.next)>0&&Se(t.prev,t,t.next)>0)}function Se(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function es(n,t){return n.x===t.x&&n.y===t.y}function zh(n,t,e,i){const s=go(Se(n,t,e)),o=go(Se(n,t,i)),a=go(Se(e,i,n)),r=go(Se(e,i,t));return!!(s!==o&&a!==r||s===0&&mo(n,e,t)||o===0&&mo(n,i,t)||a===0&&mo(e,n,i)||r===0&&mo(e,t,i))}function mo(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function go(n){return n>0?1:n<0?-1:0}function _f(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&zh(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Us(n,t){return Se(n.prev,n,n.next)<0?Se(n,t,n.next)>=0&&Se(n,n.prev,t)>=0:Se(n,t,n.prev)<0||Se(n,n.next,t)<0}function xf(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,o=(n.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Bh(n,t){const e=Ir(n.i,n.x,n.y),i=Ir(t.i,t.x,t.y),s=n.next,o=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,o.next=i,i.prev=o,i}function Jc(n,t,e,i){const s=Ir(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ns(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ir(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Mf(n,t,e,i){let s=0;for(let o=t,a=e-i;o<e;o+=i)s+=(n[a]-n[o])*(n[o+1]+n[a+1]),a=o;return s}class yf{static triangulate(t,e,i=2){return sf(t,e,i)}}class Hn{static area(t){const e=t.length;let i=0;for(let s=e-1,o=0;o<e;s=o++)i+=t[s].x*t[o].y-t[o].x*t[s].y;return i*.5}static isClockWise(t){return Hn.area(t)<0}static triangulateShape(t,e){const i=[],s=[],o=[];$c(t),Kc(i,t);let a=t.length;e.forEach($c);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Kc(i,e[c]);const r=yf.triangulate(i,s);for(let c=0;c<r.length;c+=3)o.push(r.slice(c,c+3));return o}}function $c(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function Kc(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class dc extends Ie{constructor(t=new Xo([new Tt(.5,.5),new Tt(-.5,.5),new Tt(-.5,-.5),new Tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],o=[];for(let r=0,c=t.length;r<c;r++){const l=t[r];a(l)}this.setAttribute("position",new re(s,3)),this.setAttribute("uv",new re(o,2)),this.computeVertexNormals();function a(r){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,S=e.UVGenerator!==void 0?e.UVGenerator:bf;let x,_=!1,P,E,A,R;f&&(x=f.getSpacedPoints(h),_=!0,d=!1,P=f.computeFrenetFrames(h,!1),E=new N,A=new N,R=new N),d||(m=0,p=0,g=0,v=0);const w=r.extractPoints(l);let y=w.shape;const D=w.holes;if(!Hn.isClockWise(y)){y=y.reverse();for(let ft=0,ht=D.length;ft<ht;ft++){const ct=D[ft];Hn.isClockWise(ct)&&(D[ft]=ct.reverse())}}function z(ft){const ct=10000000000000001e-36;let Y=ft[0];for(let bt=1;bt<=ft.length;bt++){const vt=bt%ft.length,wt=ft[vt],Xt=wt.x-Y.x,Zt=wt.y-Y.y,U=Xt*Xt+Zt*Zt,T=Math.max(Math.abs(wt.x),Math.abs(wt.y),Math.abs(Y.x),Math.abs(Y.y)),X=ct*T*T;if(U<=X){ft.splice(vt,1),bt--;continue}Y=wt}}z(y),D.forEach(z);const V=D.length,q=y;for(let ft=0;ft<V;ft++){const ht=D[ft];y=y.concat(ht)}function J(ft,ht,ct){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),ft.clone().addScaledVector(ht,ct)}const st=y.length;function $(ft,ht,ct){let Y,bt,vt;const wt=ft.x-ht.x,Xt=ft.y-ht.y,Zt=ct.x-ft.x,U=ct.y-ft.y,T=wt*wt+Xt*Xt,X=wt*U-Xt*Zt;if(Math.abs(X)>Number.EPSILON){const Q=Math.sqrt(T),ut=Math.sqrt(Zt*Zt+U*U),it=ht.x-Xt/Q,Ot=ht.y+wt/Q,St=ct.x-U/ut,zt=ct.y+Zt/ut,Bt=((St-it)*U-(zt-Ot)*Zt)/(wt*U-Xt*Zt);Y=it+wt*Bt-ft.x,bt=Ot+Xt*Bt-ft.y;const xt=Y*Y+bt*bt;if(xt<=2)return new Tt(Y,bt);vt=Math.sqrt(xt/2)}else{let Q=!1;wt>Number.EPSILON?Zt>Number.EPSILON&&(Q=!0):wt<-Number.EPSILON?Zt<-Number.EPSILON&&(Q=!0):Math.sign(Xt)===Math.sign(U)&&(Q=!0),Q?(Y=-Xt,bt=wt,vt=Math.sqrt(T)):(Y=wt,bt=Xt,vt=Math.sqrt(T/2))}return new Tt(Y/vt,bt/vt)}const at=[];for(let ft=0,ht=q.length,ct=ht-1,Y=ft+1;ft<ht;ft++,ct++,Y++)ct===ht&&(ct=0),Y===ht&&(Y=0),at[ft]=$(q[ft],q[ct],q[Y]);const Z=[];let yt,Wt=at.concat();for(let ft=0,ht=V;ft<ht;ft++){const ct=D[ft];yt=[];for(let Y=0,bt=ct.length,vt=bt-1,wt=Y+1;Y<bt;Y++,vt++,wt++)vt===bt&&(vt=0),wt===bt&&(wt=0),yt[Y]=$(ct[Y],ct[vt],ct[wt]);Z.push(yt),Wt=Wt.concat(yt)}let te;if(m===0)te=Hn.triangulateShape(q,D);else{const ft=[],ht=[];for(let ct=0;ct<m;ct++){const Y=ct/m,bt=p*Math.cos(Y*Math.PI/2),vt=g*Math.sin(Y*Math.PI/2)+v;for(let wt=0,Xt=q.length;wt<Xt;wt++){const Zt=J(q[wt],at[wt],vt);Ht(Zt.x,Zt.y,-bt),Y===0&&ft.push(Zt)}for(let wt=0,Xt=V;wt<Xt;wt++){const Zt=D[wt];yt=Z[wt];const U=[];for(let T=0,X=Zt.length;T<X;T++){const Q=J(Zt[T],yt[T],vt);Ht(Q.x,Q.y,-bt),Y===0&&U.push(Q)}Y===0&&ht.push(U)}}te=Hn.triangulateShape(ft,ht)}const he=te.length,se=g+v;for(let ft=0;ft<st;ft++){const ht=d?J(y[ft],Wt[ft],se):y[ft];_?(A.copy(P.normals[0]).multiplyScalar(ht.x),E.copy(P.binormals[0]).multiplyScalar(ht.y),R.copy(x[0]).add(A).add(E),Ht(R.x,R.y,R.z)):Ht(ht.x,ht.y,0)}for(let ft=1;ft<=h;ft++)for(let ht=0;ht<st;ht++){const ct=d?J(y[ht],Wt[ht],se):y[ht];_?(A.copy(P.normals[ft]).multiplyScalar(ct.x),E.copy(P.binormals[ft]).multiplyScalar(ct.y),R.copy(x[ft]).add(A).add(E),Ht(R.x,R.y,R.z)):Ht(ct.x,ct.y,u/h*ft)}for(let ft=m-1;ft>=0;ft--){const ht=ft/m,ct=p*Math.cos(ht*Math.PI/2),Y=g*Math.sin(ht*Math.PI/2)+v;for(let bt=0,vt=q.length;bt<vt;bt++){const wt=J(q[bt],at[bt],Y);Ht(wt.x,wt.y,u+ct)}for(let bt=0,vt=D.length;bt<vt;bt++){const wt=D[bt];yt=Z[bt];for(let Xt=0,Zt=wt.length;Xt<Zt;Xt++){const U=J(wt[Xt],yt[Xt],Y);_?Ht(U.x,U.y+x[h-1].y,x[h-1].x+ct):Ht(U.x,U.y,u+ct)}}}rt(),dt();function rt(){const ft=s.length/3;if(d){let ht=0,ct=st*ht;for(let Y=0;Y<he;Y++){const bt=te[Y];Ft(bt[2]+ct,bt[1]+ct,bt[0]+ct)}ht=h+m*2,ct=st*ht;for(let Y=0;Y<he;Y++){const bt=te[Y];Ft(bt[0]+ct,bt[1]+ct,bt[2]+ct)}}else{for(let ht=0;ht<he;ht++){const ct=te[ht];Ft(ct[2],ct[1],ct[0])}for(let ht=0;ht<he;ht++){const ct=te[ht];Ft(ct[0]+st*h,ct[1]+st*h,ct[2]+st*h)}}i.addGroup(ft,s.length/3-ft,0)}function dt(){const ft=s.length/3;let ht=0;It(q,ht),ht+=q.length;for(let ct=0,Y=D.length;ct<Y;ct++){const bt=D[ct];It(bt,ht),ht+=bt.length}i.addGroup(ft,s.length/3-ft,1)}function It(ft,ht){let ct=ft.length;for(;--ct>=0;){const Y=ct;let bt=ct-1;bt<0&&(bt=ft.length-1);for(let vt=0,wt=h+m*2;vt<wt;vt++){const Xt=st*vt,Zt=st*(vt+1),U=ht+Y+Xt,T=ht+bt+Xt,X=ht+bt+Zt,Q=ht+Y+Zt;ee(U,T,X,Q)}}}function Ht(ft,ht,ct){c.push(ft),c.push(ht),c.push(ct)}function Ft(ft,ht,ct){me(ft),me(ht),me(ct);const Y=s.length/3,bt=S.generateTopUV(i,s,Y-3,Y-2,Y-1);O(bt[0]),O(bt[1]),O(bt[2])}function ee(ft,ht,ct,Y){me(ft),me(ht),me(Y),me(ht),me(ct),me(Y);const bt=s.length/3,vt=S.generateSideWallUV(i,s,bt-6,bt-3,bt-2,bt-1);O(vt[0]),O(vt[1]),O(vt[3]),O(vt[1]),O(vt[2]),O(vt[3])}function me(ft){s.push(c[ft*3+0]),s.push(c[ft*3+1]),s.push(c[ft*3+2])}function O(ft){o.push(ft.x),o.push(ft.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Sf(e,i,t)}static fromJSON(t,e){const i=[];for(let o=0,a=t.shapes.length;o<a;o++){const r=e[t.shapes[o]];i.push(r)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Cr[s.type]().fromJSON(s)),new dc(i,t.options)}}const bf={generateTopUV:function(n,t,e,i,s){const o=t[e*3],a=t[e*3+1],r=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new Tt(o,a),new Tt(r,c),new Tt(l,h)]},generateSideWallUV:function(n,t,e,i,s,o){const a=t[e*3],r=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],d=t[s*3],p=t[s*3+1],g=t[s*3+2],v=t[o*3],m=t[o*3+1],f=t[o*3+2];return Math.abs(r-h)<Math.abs(a-l)?[new Tt(a,1-c),new Tt(l,1-u),new Tt(d,1-g),new Tt(v,1-f)]:[new Tt(r,1-c),new Tt(h,1-u),new Tt(p,1-g),new Tt(m,1-f)]}};function Sf(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const o=n[i];e.shapes.push(o.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Bs extends Wo{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Bs(t.radius,t.detail)}}class Ue extends Ie{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const o=t/2,a=e/2,r=Math.floor(i),c=Math.floor(s),l=r+1,h=c+1,u=t/r,d=e/c,p=[],g=[],v=[],m=[];for(let f=0;f<h;f++){const S=f*d-a;for(let x=0;x<l;x++){const _=x*u-o;g.push(_,-S,0),v.push(0,0,1),m.push(x/r),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<r;S++){const x=S+l*f,_=S+l*(f+1),P=S+1+l*(f+1),E=S+1+l*f;p.push(x,_,E),p.push(_,P,E)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ue(t.width,t.height,t.widthSegments,t.heightSegments)}}class fc extends Ie{constructor(t=.5,e=1,i=32,s=1,o=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:o,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const r=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,p=new N,g=new Tt;for(let v=0;v<=s;v++){for(let m=0;m<=i;m++){const f=o+m/i*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),c.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(i+1);for(let f=0;f<i;f++){const S=f+m,x=S,_=S+i+1,P=S+i+2,E=S+1;r.push(x,_,E),r.push(_,P,E)}}this.setIndex(r),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fc(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class pc extends Ie{constructor(t=new Xo([new Tt(0,.5),new Tt(-.5,-.5),new Tt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],o=[],a=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new re(s,3)),this.setAttribute("normal",new re(o,3)),this.setAttribute("uv",new re(a,2));function l(h){const u=s.length/3,d=h.extractPoints(e);let p=d.shape;const g=d.holes;Hn.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,f=g.length;m<f;m++){const S=g[m];Hn.isClockWise(S)===!0&&(g[m]=S.reverse())}const v=Hn.triangulateShape(p,g);for(let m=0,f=g.length;m<f;m++){const S=g[m];p=p.concat(S)}for(let m=0,f=p.length;m<f;m++){const S=p[m];s.push(S.x,S.y,0),o.push(0,0,1),a.push(S.x,S.y)}for(let m=0,f=v.length;m<f;m++){const S=v[m],x=S[0]+u,_=S[1]+u,P=S[2]+u;i.push(x,_,P),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return wf(e,t)}static fromJSON(t,e){const i=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];i.push(a)}return new pc(i,t.curveSegments)}}function wf(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class Rt extends Ie{constructor(t=1,e=32,i=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+r,Math.PI);let l=0;const h=[],u=new N,d=new N,p=[],g=[],v=[],m=[];for(let f=0;f<=i;f++){const S=[],x=f/i;let _=0;f===0&&a===0?_=.5/e:f===i&&c===Math.PI&&(_=-.5/e);for(let P=0;P<=e;P++){const E=P/e;u.x=-t*Math.cos(s+E*o)*Math.sin(a+x*r),u.y=t*Math.cos(a+x*r),u.z=t*Math.sin(s+E*o)*Math.sin(a+x*r),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(E+_,1-x),S.push(l++)}h.push(S)}for(let f=0;f<i;f++)for(let S=0;S<e;S++){const x=h[f][S+1],_=h[f][S],P=h[f+1][S],E=h[f+1][S+1];(f!==0||a>0)&&p.push(x,_,E),(f!==i-1||c<Math.PI)&&p.push(_,P,E)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class _e extends Ie{constructor(t=1,e=.4,i=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:o},i=Math.floor(i),s=Math.floor(s);const a=[],r=[],c=[],l=[],h=new N,u=new N,d=new N;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){const v=g/s*o,m=p/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),r.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){const v=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,S=(s+1)*p+g;a.push(v,m,S),a.push(m,f,S)}this.setIndex(a),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class kh extends os{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ae(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=gh,this.normalScale=new Tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class Ef extends os{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ku,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Tf extends os{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Vh extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ae(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Hh extends Vh{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ae(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Sa=new we,Qc=new N,tl=new N;class Af{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Tt(512,512),this.mapType=In,this.map=null,this.mapPass=null,this.matrix=new we,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new cc,this._frameExtents=new Tt(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Qc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qc),tl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tl),e.updateMatrixWorld(),Sa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Sa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class mc extends Th{constructor(t=-1,e=1,i=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-t,a=i+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Cf extends Af{constructor(){super(new mc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Lr extends Vh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new Cf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Pf extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Rf{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function el(n,t,e,i){const s=If(i);switch(e){case fh:return n*t;case ec:return n*t/s.components*s.byteLength;case nc:return n*t/s.components*s.byteLength;case mh:return n*t*2/s.components*s.byteLength;case ic:return n*t*2/s.components*s.byteLength;case ph:return n*t*3/s.components*s.byteLength;case wn:return n*t*4/s.components*s.byteLength;case sc:return n*t*4/s.components*s.byteLength;case Eo:case To:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ao:case Co:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case er:case ir:return Math.max(n,16)*Math.max(t,8)/4;case tr:case nr:return Math.max(n,8)*Math.max(t,8)/2;case sr:case or:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ar:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case rr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case cr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case lr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case hr:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case ur:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case dr:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case fr:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case pr:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case mr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case gr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case vr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case _r:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case xr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Mr:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case yr:case br:case Sr:return Math.ceil(n/4)*Math.ceil(t/4)*16;case wr:case Er:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Tr:case Ar:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function If(n){switch(n){case In:case lh:return{byteLength:1,components:1};case Ts:case hh:case zs:return{byteLength:2,components:1};case Qr:case tc:return{byteLength:2,components:4};case Ei:case Kr:case Vn:return{byteLength:4,components:1};case uh:case dh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:$r}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=$r);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Gh(){let n=null,t=!1,e=null,i=null;function s(o,a){e(o,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){n=o}}}function Lf(n){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),r.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=n.HALF_FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],v=u[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const v=u[p];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function o(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function a(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:s,remove:o,update:a}}var Df=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Uf=`#ifdef USE_ALPHAHASH
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
#endif`,Nf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ff=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Of=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bf=`#ifdef USE_AOMAP
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
#endif`,kf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vf=`#ifdef USE_BATCHING
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
#endif`,Hf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Wf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Xf=`#ifdef USE_IRIDESCENCE
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
#endif`,jf=`#ifdef USE_BUMPMAP
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
#endif`,Yf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Zf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Jf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,$f=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Kf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Qf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,tp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ep=`#if defined( USE_COLOR_ALPHA )
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
#endif`,np=`#define PI 3.141592653589793
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
} // validated`,ip=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,sp=`vec3 transformedNormal = objectNormal;
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
#endif`,op=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ap=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,rp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,lp="gl_FragColor = linearToOutputTexel( gl_FragColor );",hp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,up=`#ifdef USE_ENVMAP
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
#endif`,dp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,fp=`#ifdef USE_ENVMAP
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
#endif`,pp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mp=`#ifdef USE_ENVMAP
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
#endif`,gp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_p=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,xp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Mp=`#ifdef USE_GRADIENTMAP
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
}`,yp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,wp=`uniform bool receiveShadow;
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
#endif`,Ep=`#ifdef USE_ENVMAP
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
#endif`,Tp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ap=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Cp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Pp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Rp=`PhysicalMaterial material;
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
#endif`,Ip=`struct PhysicalMaterial {
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
}`,Lp=`
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
#endif`,Dp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Up=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Np=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Op=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,zp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,kp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Vp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Hp=`#if defined( USE_POINTS_UV )
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
#endif`,Gp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,qp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Wp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Xp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,jp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yp=`#ifdef USE_MORPHTARGETS
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
#endif`,Zp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Jp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,$p=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Kp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,t0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,e0=`#ifdef USE_NORMALMAP
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
#endif`,n0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,i0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,s0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,o0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,a0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,r0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,c0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,l0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,h0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,u0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,d0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,f0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,p0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,m0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,g0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,v0=`float getShadowMask() {
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
}`,_0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,x0=`#ifdef USE_SKINNING
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
#endif`,M0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,y0=`#ifdef USE_SKINNING
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
#endif`,b0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,S0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,w0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,E0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,T0=`#ifdef USE_TRANSMISSION
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
#endif`,A0=`#ifdef USE_TRANSMISSION
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
#endif`,C0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,P0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,R0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,I0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const L0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,D0=`uniform sampler2D t2D;
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
}`,U0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,N0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,F0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,O0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,z0=`#include <common>
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
}`,B0=`#if DEPTH_PACKING == 3200
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
}`,k0=`#define DISTANCE
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
}`,V0=`#define DISTANCE
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
}`,H0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,G0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,q0=`uniform float scale;
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
}`,W0=`uniform vec3 diffuse;
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
}`,X0=`#include <common>
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
}`,j0=`uniform vec3 diffuse;
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
}`,Y0=`#define LAMBERT
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
}`,Z0=`#define LAMBERT
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
}`,J0=`#define MATCAP
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
}`,$0=`#define MATCAP
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
}`,K0=`#define NORMAL
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
}`,Q0=`#define NORMAL
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
}`,tm=`#define PHONG
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
}`,em=`#define PHONG
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
}`,nm=`#define STANDARD
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
}`,im=`#define STANDARD
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
}`,sm=`#define TOON
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
}`,om=`#define TOON
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
}`,am=`uniform float size;
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
}`,rm=`uniform vec3 diffuse;
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
}`,cm=`#include <common>
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
}`,lm=`uniform vec3 color;
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
}`,hm=`uniform float rotation;
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
}`,um=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:Df,alphahash_pars_fragment:Uf,alphamap_fragment:Nf,alphamap_pars_fragment:Ff,alphatest_fragment:Of,alphatest_pars_fragment:zf,aomap_fragment:Bf,aomap_pars_fragment:kf,batching_pars_vertex:Vf,batching_vertex:Hf,begin_vertex:Gf,beginnormal_vertex:qf,bsdfs:Wf,iridescence_fragment:Xf,bumpmap_pars_fragment:jf,clipping_planes_fragment:Yf,clipping_planes_pars_fragment:Zf,clipping_planes_pars_vertex:Jf,clipping_planes_vertex:$f,color_fragment:Kf,color_pars_fragment:Qf,color_pars_vertex:tp,color_vertex:ep,common:np,cube_uv_reflection_fragment:ip,defaultnormal_vertex:sp,displacementmap_pars_vertex:op,displacementmap_vertex:ap,emissivemap_fragment:rp,emissivemap_pars_fragment:cp,colorspace_fragment:lp,colorspace_pars_fragment:hp,envmap_fragment:up,envmap_common_pars_fragment:dp,envmap_pars_fragment:fp,envmap_pars_vertex:pp,envmap_physical_pars_fragment:Ep,envmap_vertex:mp,fog_vertex:gp,fog_pars_vertex:vp,fog_fragment:_p,fog_pars_fragment:xp,gradientmap_pars_fragment:Mp,lightmap_pars_fragment:yp,lights_lambert_fragment:bp,lights_lambert_pars_fragment:Sp,lights_pars_begin:wp,lights_toon_fragment:Tp,lights_toon_pars_fragment:Ap,lights_phong_fragment:Cp,lights_phong_pars_fragment:Pp,lights_physical_fragment:Rp,lights_physical_pars_fragment:Ip,lights_fragment_begin:Lp,lights_fragment_maps:Dp,lights_fragment_end:Up,logdepthbuf_fragment:Np,logdepthbuf_pars_fragment:Fp,logdepthbuf_pars_vertex:Op,logdepthbuf_vertex:zp,map_fragment:Bp,map_pars_fragment:kp,map_particle_fragment:Vp,map_particle_pars_fragment:Hp,metalnessmap_fragment:Gp,metalnessmap_pars_fragment:qp,morphinstance_vertex:Wp,morphcolor_vertex:Xp,morphnormal_vertex:jp,morphtarget_pars_vertex:Yp,morphtarget_vertex:Zp,normal_fragment_begin:Jp,normal_fragment_maps:$p,normal_pars_fragment:Kp,normal_pars_vertex:Qp,normal_vertex:t0,normalmap_pars_fragment:e0,clearcoat_normal_fragment_begin:n0,clearcoat_normal_fragment_maps:i0,clearcoat_pars_fragment:s0,iridescence_pars_fragment:o0,opaque_fragment:a0,packing:r0,premultiplied_alpha_fragment:c0,project_vertex:l0,dithering_fragment:h0,dithering_pars_fragment:u0,roughnessmap_fragment:d0,roughnessmap_pars_fragment:f0,shadowmap_pars_fragment:p0,shadowmap_pars_vertex:m0,shadowmap_vertex:g0,shadowmask_pars_fragment:v0,skinbase_vertex:_0,skinning_pars_vertex:x0,skinning_vertex:M0,skinnormal_vertex:y0,specularmap_fragment:b0,specularmap_pars_fragment:S0,tonemapping_fragment:w0,tonemapping_pars_fragment:E0,transmission_fragment:T0,transmission_pars_fragment:A0,uv_pars_fragment:C0,uv_pars_vertex:P0,uv_vertex:R0,worldpos_vertex:I0,background_vert:L0,background_frag:D0,backgroundCube_vert:U0,backgroundCube_frag:N0,cube_vert:F0,cube_frag:O0,depth_vert:z0,depth_frag:B0,distanceRGBA_vert:k0,distanceRGBA_frag:V0,equirect_vert:H0,equirect_frag:G0,linedashed_vert:q0,linedashed_frag:W0,meshbasic_vert:X0,meshbasic_frag:j0,meshlambert_vert:Y0,meshlambert_frag:Z0,meshmatcap_vert:J0,meshmatcap_frag:$0,meshnormal_vert:K0,meshnormal_frag:Q0,meshphong_vert:tm,meshphong_frag:em,meshphysical_vert:nm,meshphysical_frag:im,meshtoon_vert:sm,meshtoon_frag:om,points_vert:am,points_frag:rm,shadow_vert:cm,shadow_frag:lm,sprite_vert:hm,sprite_frag:um},Pt={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},Tn={basic:{uniforms:We([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:We([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:We([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:We([Pt.common,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.roughnessmap,Pt.metalnessmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:We([Pt.common,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.gradientmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:We([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:We([Pt.points,Pt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:We([Pt.common,Pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:We([Pt.common,Pt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:We([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:We([Pt.sprite,Pt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:We([Pt.common,Pt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:We([Pt.lights,Pt.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};Tn.physical={uniforms:We([Tn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const vo={r:0,b:0,g:0},mi=new Xn,dm=new we;function fm(n,t,e,i,s,o,a){const r=new ae(0);let c=o===!0?0:1,l,h,u=null,d=0,p=null;function g(x){let _=x.isScene===!0?x.background:null;return _&&_.isTexture&&(_=(x.backgroundBlurriness>0?e:t).get(_)),_}function v(x){let _=!1;const P=g(x);P===null?f(r,c):P&&P.isColor&&(f(P,1),_=!0);const E=n.xr.getEnvironmentBlendMode();E==="additive"?i.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,_){const P=g(_);P&&(P.isCubeTexture||P.mapping===Ho)?(h===void 0&&(h=new M(new H(1,1,1),new ri({name:"BackgroundCubeMaterial",uniforms:ts(Tn.backgroundCube.uniforms),vertexShader:Tn.backgroundCube.vertexShader,fragmentShader:Tn.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),mi.copy(_.backgroundRotation),mi.x*=-1,mi.y*=-1,mi.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),h.material.uniforms.envMap.value=P,h.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(dm.makeRotationFromEuler(mi)),h.material.toneMapped=de.getTransfer(P.colorSpace)!==ve,(u!==P||d!==P.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=P,d=P.version,p=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):P&&P.isTexture&&(l===void 0&&(l=new M(new Ue(2,2),new ri({name:"BackgroundMaterial",uniforms:ts(Tn.background.uniforms),vertexShader:Tn.background.vertexShader,fragmentShader:Tn.background.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=P,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=de.getTransfer(P.colorSpace)!==ve,P.matrixAutoUpdate===!0&&P.updateMatrix(),l.material.uniforms.uvTransform.value.copy(P.matrix),(u!==P||d!==P.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=P,d=P.version,p=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function f(x,_){x.getRGB(vo,Eh(n)),i.buffers.color.setClear(vo.r,vo.g,vo.b,_,a)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(x,_=1){r.set(x),c=_,f(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,f(r,c)},render:v,addToRenderList:m,dispose:S}}function pm(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let o=s,a=!1;function r(y,D,F,z,V){let q=!1;const J=u(z,F,D);o!==J&&(o=J,l(o.object)),q=p(y,z,F,V),q&&g(y,z,F,V),V!==null&&t.update(V,n.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,_(y,D,F,z),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function c(){return n.createVertexArray()}function l(y){return n.bindVertexArray(y)}function h(y){return n.deleteVertexArray(y)}function u(y,D,F){const z=F.wireframe===!0;let V=i[y.id];V===void 0&&(V={},i[y.id]=V);let q=V[D.id];q===void 0&&(q={},V[D.id]=q);let J=q[z];return J===void 0&&(J=d(c()),q[z]=J),J}function d(y){const D=[],F=[],z=[];for(let V=0;V<e;V++)D[V]=0,F[V]=0,z[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:z,object:y,attributes:{},index:null}}function p(y,D,F,z){const V=o.attributes,q=D.attributes;let J=0;const st=F.getAttributes();for(const $ in st)if(st[$].location>=0){const Z=V[$];let yt=q[$];if(yt===void 0&&($==="instanceMatrix"&&y.instanceMatrix&&(yt=y.instanceMatrix),$==="instanceColor"&&y.instanceColor&&(yt=y.instanceColor)),Z===void 0||Z.attribute!==yt||yt&&Z.data!==yt.data)return!0;J++}return o.attributesNum!==J||o.index!==z}function g(y,D,F,z){const V={},q=D.attributes;let J=0;const st=F.getAttributes();for(const $ in st)if(st[$].location>=0){let Z=q[$];Z===void 0&&($==="instanceMatrix"&&y.instanceMatrix&&(Z=y.instanceMatrix),$==="instanceColor"&&y.instanceColor&&(Z=y.instanceColor));const yt={};yt.attribute=Z,Z&&Z.data&&(yt.data=Z.data),V[$]=yt,J++}o.attributes=V,o.attributesNum=J,o.index=z}function v(){const y=o.newAttributes;for(let D=0,F=y.length;D<F;D++)y[D]=0}function m(y){f(y,0)}function f(y,D){const F=o.newAttributes,z=o.enabledAttributes,V=o.attributeDivisors;F[y]=1,z[y]===0&&(n.enableVertexAttribArray(y),z[y]=1),V[y]!==D&&(n.vertexAttribDivisor(y,D),V[y]=D)}function S(){const y=o.newAttributes,D=o.enabledAttributes;for(let F=0,z=D.length;F<z;F++)D[F]!==y[F]&&(n.disableVertexAttribArray(F),D[F]=0)}function x(y,D,F,z,V,q,J){J===!0?n.vertexAttribIPointer(y,D,F,V,q):n.vertexAttribPointer(y,D,F,z,V,q)}function _(y,D,F,z){v();const V=z.attributes,q=F.getAttributes(),J=D.defaultAttributeValues;for(const st in q){const $=q[st];if($.location>=0){let at=V[st];if(at===void 0&&(st==="instanceMatrix"&&y.instanceMatrix&&(at=y.instanceMatrix),st==="instanceColor"&&y.instanceColor&&(at=y.instanceColor)),at!==void 0){const Z=at.normalized,yt=at.itemSize,Wt=t.get(at);if(Wt===void 0)continue;const te=Wt.buffer,he=Wt.type,se=Wt.bytesPerElement,rt=he===n.INT||he===n.UNSIGNED_INT||at.gpuType===Kr;if(at.isInterleavedBufferAttribute){const dt=at.data,It=dt.stride,Ht=at.offset;if(dt.isInstancedInterleavedBuffer){for(let Ft=0;Ft<$.locationSize;Ft++)f($.location+Ft,dt.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let Ft=0;Ft<$.locationSize;Ft++)m($.location+Ft);n.bindBuffer(n.ARRAY_BUFFER,te);for(let Ft=0;Ft<$.locationSize;Ft++)x($.location+Ft,yt/$.locationSize,he,Z,It*se,(Ht+yt/$.locationSize*Ft)*se,rt)}else{if(at.isInstancedBufferAttribute){for(let dt=0;dt<$.locationSize;dt++)f($.location+dt,at.meshPerAttribute);y.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let dt=0;dt<$.locationSize;dt++)m($.location+dt);n.bindBuffer(n.ARRAY_BUFFER,te);for(let dt=0;dt<$.locationSize;dt++)x($.location+dt,yt/$.locationSize,he,Z,yt*se,yt/$.locationSize*dt*se,rt)}}else if(J!==void 0){const Z=J[st];if(Z!==void 0)switch(Z.length){case 2:n.vertexAttrib2fv($.location,Z);break;case 3:n.vertexAttrib3fv($.location,Z);break;case 4:n.vertexAttrib4fv($.location,Z);break;default:n.vertexAttrib1fv($.location,Z)}}}}S()}function P(){R();for(const y in i){const D=i[y];for(const F in D){const z=D[F];for(const V in z)h(z[V].object),delete z[V];delete D[F]}delete i[y]}}function E(y){if(i[y.id]===void 0)return;const D=i[y.id];for(const F in D){const z=D[F];for(const V in z)h(z[V].object),delete z[V];delete D[F]}delete i[y.id]}function A(y){for(const D in i){const F=i[D];if(F[y.id]===void 0)continue;const z=F[y.id];for(const V in z)h(z[V].object),delete z[V];delete F[y.id]}}function R(){w(),a=!0,o!==s&&(o=s,l(o.object))}function w(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:R,resetDefaultState:w,dispose:P,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function mm(n,t,e){let i;function s(l){i=l}function o(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function r(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,i,1)}function c(l,h,u,d){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,i,1)}}this.setMode=s,this.render=o,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function gm(n,t,e,i){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==wn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(A){const R=A===zs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==In&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Vn&&!R)}function c(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:S,maxVaryings:x,maxFragmentUniforms:_,vertexTextures:P,maxSamples:E}}function vm(n){const t=this;let e=null,i=0,s=!1,o=!1;const a=new _i,r=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||i!==0||s;return s=d,i=u.length,p},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const S=o?0:i,x=S*4;let _=f.clippingState||null;c.value=_,_=h(g,d,x,p);for(let P=0;P!==x;++P)_[P]=e[P];f.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,p,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const f=p+v*4,S=d.matrixWorldInverse;r.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let x=0,_=p;x!==v;++x,_+=4)a.copy(u[x]).applyMatrix4(S,r),a.normal.toArray(m,_),m[_+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function _m(n){let t=new WeakMap;function e(a,r){return r===Ja?a.mapping=$i:r===$a&&(a.mapping=Ki),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===Ja||r===$a)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Fd(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}const Xi=4,nl=[.125,.215,.35,.446,.526,.582],yi=20,wa=new mc,il=new ae;let Ea=null,Ta=0,Aa=0,Ca=!1;const xi=(1+Math.sqrt(5))/2,Gi=1/xi,sl=[new N(-xi,Gi,0),new N(xi,Gi,0),new N(-Gi,0,xi),new N(Gi,0,xi),new N(0,xi,-Gi),new N(0,xi,Gi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],xm=new N;class ol{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,o={}){const{size:a=256,position:r=xm}=o;Ea=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),Aa=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,r),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=rl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ea,Ta,Aa),this._renderer.xr.enabled=Ca,t.scissorTest=!1,_o(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===$i||t.mapping===Ki?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ea=this._renderer.getRenderTarget(),Ta=this._renderer.getActiveCubeFace(),Aa=this._renderer.getActiveMipmapLevel(),Ca=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:An,minFilter:An,generateMipmaps:!1,type:zs,format:wn,colorSpace:Qi,depthBuffer:!1},s=al(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=al(t,e,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Mm(o)),this._blurMaterial=ym(o,t,e)}return s}_compileMaterial(t){const e=new M(this._lodPlanes[0],t);this._renderer.compile(e,wa)}_sceneToCubeUV(t,e,i,s,o){const c=new sn(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(il),u.toneMapping=ai,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new qo({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),m=new M(new H,v);let f=!1;const S=t.background;S?S.isColor&&(v.color.copy(S),t.background=null,f=!0):(v.color.copy(il),f=!0);for(let x=0;x<6;x++){const _=x%3;_===0?(c.up.set(0,l[x],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x+h[x],o.y,o.z)):_===1?(c.up.set(0,0,l[x]),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y+h[x],o.z)):(c.up.set(0,l[x],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y,o.z+h[x]));const P=this._cubeSize;_o(s,_*P,x>2?P:0,P,P),u.setRenderTarget(s),f&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,t.background=S}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===$i||t.mapping===Ki;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=cl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=rl());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new M(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const c=this._cubeSize;_o(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,wa)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),r=sl[(s-o-1)%sl.length];this._blur(t,o-1,o,a,r)}e.autoClear=i}_blur(t,e,i,s,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",o),this._halfBlur(a,t,i,i,s,"longitudinal",o)}_halfBlur(t,e,i,s,o,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new M(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(o)?Math.PI/(2*p):2*Math.PI/(2*yi-1),v=o/g,m=isFinite(o)?1+Math.floor(h*v):yi;m>yi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yi}`);const f=[];let S=0;for(let A=0;A<yi;++A){const R=A/v,w=Math.exp(-R*R/2);f.push(w),A===0?S+=w:A<m&&(S+=2*w)}for(let A=0;A<f.length;A++)f[A]=f[A]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:x}=this;d.dTheta.value=g,d.mipInt.value=x-i;const _=this._sizeLods[s],P=3*_*(s>x-Xi?s-x+Xi:0),E=4*(this._cubeSize-_);_o(e,P,E,3*_,2*_),c.setRenderTarget(e),c.render(u,wa)}}function Mm(n){const t=[],e=[],i=[];let s=n;const o=n-Xi+1+nl.length;for(let a=0;a<o;a++){const r=Math.pow(2,s);e.push(r);let c=1/r;a>n-Xi?c=nl[a-n+Xi-1]:a===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,v=3,m=2,f=1,S=new Float32Array(v*g*p),x=new Float32Array(m*g*p),_=new Float32Array(f*g*p);for(let E=0;E<p;E++){const A=E%3*2/3-1,R=E>2?0:-1,w=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];S.set(w,v*g*E),x.set(d,m*g*E);const y=[E,E,E,E,E,E];_.set(y,f*g*E)}const P=new Ie;P.setAttribute("position",new Rn(S,v)),P.setAttribute("uv",new Rn(x,m)),P.setAttribute("faceIndex",new Rn(_,f)),t.push(P),s>Xi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function al(n,t,e){const i=new Ti(n,t,e);return i.texture.mapping=Ho,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function _o(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function ym(n,t,e){const i=new Float32Array(yi),s=new N(0,1,0);return new ri({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:gc(),fragmentShader:`

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
		`,blending:oi,depthTest:!1,depthWrite:!1})}function rl(){return new ri({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:gc(),fragmentShader:`

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
		`,blending:oi,depthTest:!1,depthWrite:!1})}function cl(){return new ri({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:gc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function gc(){return`

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
	`}function bm(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===Ja||c===$a,h=c===$i||c===Ki;if(l||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new ol(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const p=r.image;return l&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new ol(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",o),u.texture):null}}}return r}function s(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function o(r){const c=r.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Sm(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Is("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function wm(n,t,e,i){const s={},o=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const p=o.get(d);p&&(t.remove(p),o.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const p in d)t.update(d[p],n.ARRAY_BUFFER)}function l(u){const d=[],p=u.index,g=u.attributes.position;let v=0;if(p!==null){const S=p.array;v=p.version;for(let x=0,_=S.length;x<_;x+=3){const P=S[x+0],E=S[x+1],A=S[x+2];d.push(P,E,E,A,A,P)}}else if(g!==void 0){const S=g.array;v=g.version;for(let x=0,_=S.length/3-1;x<_;x+=3){const P=x+0,E=x+1,A=x+2;d.push(P,E,E,A,A,P)}}else return;const m=new(_h(d)?wh:Sh)(d,1);m.version=v;const f=o.get(u);f&&t.remove(f),o.set(u,m)}function h(u){const d=o.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return o.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function Em(n,t,e){let i;function s(d){i=d}let o,a;function r(d){o=d.type,a=d.bytesPerElement}function c(d,p){n.drawElements(i,p,o,d*a),e.update(p,i,1)}function l(d,p,g){g!==0&&(n.drawElementsInstanced(i,p,o,d*a,g),e.update(p,i,g))}function h(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,o,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,i,1)}function u(d,p,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/a,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,o,d,0,v,0,g);let f=0;for(let S=0;S<g;S++)f+=p[S]*v[S];e.update(f,i,1)}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Tm(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,r){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=r*(o/3);break;case n.LINES:e.lines+=r*(o/2);break;case n.LINE_STRIP:e.lines+=r*(o-1);break;case n.LINE_LOOP:e.lines+=r*o;break;case n.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Am(n,t,e){const i=new WeakMap,s=new Ee;function o(a,r,c){const l=a.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let y=function(){R.dispose(),i.delete(r),r.removeEventListener("dispose",y)};var p=y;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,f=r.morphAttributes.position||[],S=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let P=r.attributes.position.count*_,E=1;P>t.maxTextureSize&&(E=Math.ceil(P/t.maxTextureSize),P=t.maxTextureSize);const A=new Float32Array(P*E*4*u),R=new xh(A,P,E,u);R.type=Vn,R.needsUpdate=!0;const w=_*4;for(let D=0;D<u;D++){const F=f[D],z=S[D],V=x[D],q=P*E*4*D;for(let J=0;J<F.count;J++){const st=J*w;g===!0&&(s.fromBufferAttribute(F,J),A[q+st+0]=s.x,A[q+st+1]=s.y,A[q+st+2]=s.z,A[q+st+3]=0),v===!0&&(s.fromBufferAttribute(z,J),A[q+st+4]=s.x,A[q+st+5]=s.y,A[q+st+6]=s.z,A[q+st+7]=0),m===!0&&(s.fromBufferAttribute(V,J),A[q+st+8]=s.x,A[q+st+9]=s.y,A[q+st+10]=s.z,A[q+st+11]=V.itemSize===4?s.w:1)}}d={count:u,texture:R,size:new Tt(P,E)},i.set(r,d),r.addEventListener("dispose",y)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:o}}function Cm(n,t,e,i){let s=new WeakMap;function o(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:a}}const qh=new Be,ll=new Rh(1,1),Wh=new xh,Xh=new xd,jh=new Ah,hl=[],ul=[],dl=new Float32Array(16),fl=new Float32Array(9),pl=new Float32Array(4);function as(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let o=hl[s];if(o===void 0&&(o=new Float32Array(s),hl[s]=o),t!==0){i.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,n[a].toArray(o,r)}return o}function Ce(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Pe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function jo(n,t){let e=ul[t];e===void 0&&(e=new Int32Array(t),ul[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Pm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Rm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2fv(this.addr,t),Pe(e,t)}}function Im(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;n.uniform3fv(this.addr,t),Pe(e,t)}}function Lm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4fv(this.addr,t),Pe(e,t)}}function Dm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;pl.set(i),n.uniformMatrix2fv(this.addr,!1,pl),Pe(e,i)}}function Um(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;fl.set(i),n.uniformMatrix3fv(this.addr,!1,fl),Pe(e,i)}}function Nm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;dl.set(i),n.uniformMatrix4fv(this.addr,!1,dl),Pe(e,i)}}function Fm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Om(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2iv(this.addr,t),Pe(e,t)}}function zm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3iv(this.addr,t),Pe(e,t)}}function Bm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4iv(this.addr,t),Pe(e,t)}}function km(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Vm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2uiv(this.addr,t),Pe(e,t)}}function Hm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3uiv(this.addr,t),Pe(e,t)}}function Gm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4uiv(this.addr,t),Pe(e,t)}}function qm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let o;this.type===n.SAMPLER_2D_SHADOW?(ll.compareFunction=vh,o=ll):o=qh,e.setTexture2D(t||o,s)}function Wm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Xh,s)}function Xm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||jh,s)}function jm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Wh,s)}function Ym(n){switch(n){case 5126:return Pm;case 35664:return Rm;case 35665:return Im;case 35666:return Lm;case 35674:return Dm;case 35675:return Um;case 35676:return Nm;case 5124:case 35670:return Fm;case 35667:case 35671:return Om;case 35668:case 35672:return zm;case 35669:case 35673:return Bm;case 5125:return km;case 36294:return Vm;case 36295:return Hm;case 36296:return Gm;case 35678:case 36198:case 36298:case 36306:case 35682:return qm;case 35679:case 36299:case 36307:return Wm;case 35680:case 36300:case 36308:case 36293:return Xm;case 36289:case 36303:case 36311:case 36292:return jm}}function Zm(n,t){n.uniform1fv(this.addr,t)}function Jm(n,t){const e=as(t,this.size,2);n.uniform2fv(this.addr,e)}function $m(n,t){const e=as(t,this.size,3);n.uniform3fv(this.addr,e)}function Km(n,t){const e=as(t,this.size,4);n.uniform4fv(this.addr,e)}function Qm(n,t){const e=as(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function tg(n,t){const e=as(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function eg(n,t){const e=as(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function ng(n,t){n.uniform1iv(this.addr,t)}function ig(n,t){n.uniform2iv(this.addr,t)}function sg(n,t){n.uniform3iv(this.addr,t)}function og(n,t){n.uniform4iv(this.addr,t)}function ag(n,t){n.uniform1uiv(this.addr,t)}function rg(n,t){n.uniform2uiv(this.addr,t)}function cg(n,t){n.uniform3uiv(this.addr,t)}function lg(n,t){n.uniform4uiv(this.addr,t)}function hg(n,t,e){const i=this.cache,s=t.length,o=jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||qh,o[a])}function ug(n,t,e){const i=this.cache,s=t.length,o=jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Xh,o[a])}function dg(n,t,e){const i=this.cache,s=t.length,o=jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||jh,o[a])}function fg(n,t,e){const i=this.cache,s=t.length,o=jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Wh,o[a])}function pg(n){switch(n){case 5126:return Zm;case 35664:return Jm;case 35665:return $m;case 35666:return Km;case 35674:return Qm;case 35675:return tg;case 35676:return eg;case 5124:case 35670:return ng;case 35667:case 35671:return ig;case 35668:case 35672:return sg;case 35669:case 35673:return og;case 5125:return ag;case 36294:return rg;case 36295:return cg;case 36296:return lg;case 35678:case 36198:case 36298:case 36306:case 35682:return hg;case 35679:case 36299:case 36307:return ug;case 35680:case 36300:case 36308:case 36293:return dg;case 36289:case 36303:case 36311:case 36292:return fg}}class mg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Ym(e.type)}}class gg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=pg(e.type)}}class vg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const r=s[o];r.setValue(t,e[r.id],i)}}}const Pa=/(\w+)(\])?(\[|\.)?/g;function ml(n,t){n.seq.push(t),n.map[t.id]=t}function _g(n,t,e){const i=n.name,s=i.length;for(Pa.lastIndex=0;;){const o=Pa.exec(i),a=Pa.lastIndex;let r=o[1];const c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===s){ml(e,l===void 0?new mg(r,n,t):new gg(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new vg(r),ml(e,u)),e=u}}}class Po{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=t.getActiveUniform(e,s),a=t.getUniformLocation(e,o.name);_g(o,a,this)}}setValue(t,e,i,s){const o=this.map[e];o!==void 0&&o.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let o=0,a=e.length;o!==a;++o){const r=e[o],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,o=t.length;s!==o;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function gl(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const xg=37297;let Mg=0;function yg(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=s;a<o;a++){const r=a+1;i.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return i.join(`
`)}const vl=new Kt;function bg(n){de._getMatrix(vl,de.workingColorSpace,n);const t=`mat3( ${vl.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(n)){case Uo:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function _l(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),o=(n.getShaderInfoLog(t)||"").trim();if(i&&o==="")return"";const a=/ERROR: 0:(\d+)/.exec(o);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+o+`

`+yg(n.getShaderSource(t),r)}else return o}function Sg(n,t){const e=bg(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function wg(n,t){let e;switch(t){case Lu:e="Linear";break;case Du:e="Reinhard";break;case Uu:e="Cineon";break;case Nu:e="ACESFilmic";break;case Ou:e="AgX";break;case zu:e="Neutral";break;case Fu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const xo=new N;function Eg(){de.getLuminanceCoefficients(xo);const n=xo.x.toFixed(4),t=xo.y.toFixed(4),e=xo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Tg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ms).join(`
`)}function Ag(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Cg(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=n.getActiveAttrib(t,s),a=o.name;let r=1;o.type===n.FLOAT_MAT2&&(r=2),o.type===n.FLOAT_MAT3&&(r=3),o.type===n.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:n.getAttribLocation(t,a),locationSize:r}}return e}function Ms(n){return n!==""}function xl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ml(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Pg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Dr(n){return n.replace(Pg,Ig)}const Rg=new Map;function Ig(n,t){let e=Qt[t];if(e===void 0){const i=Rg.get(t);if(i!==void 0)e=Qt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Dr(e)}const Lg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function yl(n){return n.replace(Lg,Dg)}function Dg(n,t,e,i){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function bl(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Ug(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===oh?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===ah?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===zn&&(t="SHADOWMAP_TYPE_VSM"),t}function Ng(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case $i:case Ki:t="ENVMAP_TYPE_CUBE";break;case Ho:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Fg(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ki:t="ENVMAP_MODE_REFRACTION";break}return t}function Og(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case rh:t="ENVMAP_BLENDING_MULTIPLY";break;case Ru:t="ENVMAP_BLENDING_MIX";break;case Iu:t="ENVMAP_BLENDING_ADD";break}return t}function zg(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Bg(n,t,e,i){const s=n.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=Ug(e),l=Ng(e),h=Fg(e),u=Og(e),d=zg(e),p=Tg(e),g=Ag(o),v=s.createProgram();let m,f,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ms).join(`
`),f.length>0&&(f+=`
`)):(m=[bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ms).join(`
`),f=[bl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ai?"#define TONE_MAPPING":"",e.toneMapping!==ai?Qt.tonemapping_pars_fragment:"",e.toneMapping!==ai?wg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,Sg("linearToOutputTexel",e.outputColorSpace),Eg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ms).join(`
`)),a=Dr(a),a=xl(a,e),a=Ml(a,e),r=Dr(r),r=xl(r,e),r=Ml(r,e),a=yl(a),r=yl(r),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Ec?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ec?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const x=S+m+a,_=S+f+r,P=gl(s,s.VERTEX_SHADER,x),E=gl(s,s.FRAGMENT_SHADER,_);s.attachShader(v,P),s.attachShader(v,E),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function A(D){if(n.debug.checkShaderErrors){const F=s.getProgramInfoLog(v)||"",z=s.getShaderInfoLog(P)||"",V=s.getShaderInfoLog(E)||"",q=F.trim(),J=z.trim(),st=V.trim();let $=!0,at=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,P,E);else{const Z=_l(s,P,"vertex"),yt=_l(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+q+`
`+Z+`
`+yt)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(J===""||st==="")&&(at=!1);at&&(D.diagnostics={runnable:$,programLog:q,vertexShader:{log:J,prefix:m},fragmentShader:{log:st,prefix:f}})}s.deleteShader(P),s.deleteShader(E),R=new Po(s,v),w=Cg(s,v)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(v,xg)),y},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Mg++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=P,this.fragmentShader=E,this}let kg=0;class Vg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Hg(t),e.set(t,i)),i}}class Hg{constructor(t){this.id=kg++,this.code=t,this.usedTimes=0}}function Gg(n,t,e,i,s,o,a){const r=new yh,c=new Vg,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(w){return l.add(w),w===0?"uv":`uv${w}`}function m(w,y,D,F,z){const V=F.fog,q=z.geometry,J=w.isMeshStandardMaterial?F.environment:null,st=(w.isMeshStandardMaterial?e:t).get(w.envMap||J),$=st&&st.mapping===Ho?st.image.height:null,at=g[w.type];w.precision!==null&&(p=s.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const Z=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,yt=Z!==void 0?Z.length:0;let Wt=0;q.morphAttributes.position!==void 0&&(Wt=1),q.morphAttributes.normal!==void 0&&(Wt=2),q.morphAttributes.color!==void 0&&(Wt=3);let te,he,se,rt;if(at){const ce=Tn[at];te=ce.vertexShader,he=ce.fragmentShader}else te=w.vertexShader,he=w.fragmentShader,c.update(w),se=c.getVertexShaderID(w),rt=c.getFragmentShaderID(w);const dt=n.getRenderTarget(),It=n.state.buffers.depth.getReversed(),Ht=z.isInstancedMesh===!0,Ft=z.isBatchedMesh===!0,ee=!!w.map,me=!!w.matcap,O=!!st,ft=!!w.aoMap,ht=!!w.lightMap,ct=!!w.bumpMap,Y=!!w.normalMap,bt=!!w.displacementMap,vt=!!w.emissiveMap,wt=!!w.metalnessMap,Xt=!!w.roughnessMap,Zt=w.anisotropy>0,U=w.clearcoat>0,T=w.dispersion>0,X=w.iridescence>0,Q=w.sheen>0,ut=w.transmission>0,it=Zt&&!!w.anisotropyMap,Ot=U&&!!w.clearcoatMap,St=U&&!!w.clearcoatNormalMap,zt=U&&!!w.clearcoatRoughnessMap,Bt=X&&!!w.iridescenceMap,xt=X&&!!w.iridescenceThicknessMap,mt=Q&&!!w.sheenColorMap,Gt=Q&&!!w.sheenRoughnessMap,Nt=!!w.specularMap,At=!!w.specularColorMap,qt=!!w.specularIntensityMap,k=ut&&!!w.transmissionMap,Mt=ut&&!!w.thicknessMap,Et=!!w.gradientMap,Lt=!!w.alphaMap,pt=w.alphaTest>0,lt=!!w.alphaHash,Dt=!!w.extensions;let jt=ai;w.toneMapped&&(dt===null||dt.isXRRenderTarget===!0)&&(jt=n.toneMapping);const pe={shaderID:at,shaderType:w.type,shaderName:w.name,vertexShader:te,fragmentShader:he,defines:w.defines,customVertexShaderID:se,customFragmentShaderID:rt,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ft,batchingColor:Ft&&z._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&z.instanceColor!==null,instancingMorph:Ht&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:dt===null?n.outputColorSpace:dt.isXRRenderTarget===!0?dt.texture.colorSpace:Qi,alphaToCoverage:!!w.alphaToCoverage,map:ee,matcap:me,envMap:O,envMapMode:O&&st.mapping,envMapCubeUVHeight:$,aoMap:ft,lightMap:ht,bumpMap:ct,normalMap:Y,displacementMap:d&&bt,emissiveMap:vt,normalMapObjectSpace:Y&&w.normalMapType===Hu,normalMapTangentSpace:Y&&w.normalMapType===gh,metalnessMap:wt,roughnessMap:Xt,anisotropy:Zt,anisotropyMap:it,clearcoat:U,clearcoatMap:Ot,clearcoatNormalMap:St,clearcoatRoughnessMap:zt,dispersion:T,iridescence:X,iridescenceMap:Bt,iridescenceThicknessMap:xt,sheen:Q,sheenColorMap:mt,sheenRoughnessMap:Gt,specularMap:Nt,specularColorMap:At,specularIntensityMap:qt,transmission:ut,transmissionMap:k,thicknessMap:Mt,gradientMap:Et,opaque:w.transparent===!1&&w.blending===Yi&&w.alphaToCoverage===!1,alphaMap:Lt,alphaTest:pt,alphaHash:lt,combine:w.combine,mapUv:ee&&v(w.map.channel),aoMapUv:ft&&v(w.aoMap.channel),lightMapUv:ht&&v(w.lightMap.channel),bumpMapUv:ct&&v(w.bumpMap.channel),normalMapUv:Y&&v(w.normalMap.channel),displacementMapUv:bt&&v(w.displacementMap.channel),emissiveMapUv:vt&&v(w.emissiveMap.channel),metalnessMapUv:wt&&v(w.metalnessMap.channel),roughnessMapUv:Xt&&v(w.roughnessMap.channel),anisotropyMapUv:it&&v(w.anisotropyMap.channel),clearcoatMapUv:Ot&&v(w.clearcoatMap.channel),clearcoatNormalMapUv:St&&v(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:zt&&v(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&v(w.iridescenceMap.channel),iridescenceThicknessMapUv:xt&&v(w.iridescenceThicknessMap.channel),sheenColorMapUv:mt&&v(w.sheenColorMap.channel),sheenRoughnessMapUv:Gt&&v(w.sheenRoughnessMap.channel),specularMapUv:Nt&&v(w.specularMap.channel),specularColorMapUv:At&&v(w.specularColorMap.channel),specularIntensityMapUv:qt&&v(w.specularIntensityMap.channel),transmissionMapUv:k&&v(w.transmissionMap.channel),thicknessMapUv:Mt&&v(w.thicknessMap.channel),alphaMapUv:Lt&&v(w.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Y||Zt),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(ee||Lt),fog:!!V,useFog:w.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:w.flatShading===!0&&w.wireframe===!1,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:It,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Wt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:jt,decodeVideoTexture:ee&&w.map.isVideoTexture===!0&&de.getTransfer(w.map.colorSpace)===ve,decodeVideoTextureEmissive:vt&&w.emissiveMap.isVideoTexture===!0&&de.getTransfer(w.emissiveMap.colorSpace)===ve,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===yn,flipSided:w.side===$e,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Dt&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Dt&&w.extensions.multiDraw===!0||Ft)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return pe.vertexUv1s=l.has(1),pe.vertexUv2s=l.has(2),pe.vertexUv3s=l.has(3),l.clear(),pe}function f(w){const y=[];if(w.shaderID?y.push(w.shaderID):(y.push(w.customVertexShaderID),y.push(w.customFragmentShaderID)),w.defines!==void 0)for(const D in w.defines)y.push(D),y.push(w.defines[D]);return w.isRawShaderMaterial===!1&&(S(y,w),x(y,w),y.push(n.outputColorSpace)),y.push(w.customProgramCacheKey),y.join()}function S(w,y){w.push(y.precision),w.push(y.outputColorSpace),w.push(y.envMapMode),w.push(y.envMapCubeUVHeight),w.push(y.mapUv),w.push(y.alphaMapUv),w.push(y.lightMapUv),w.push(y.aoMapUv),w.push(y.bumpMapUv),w.push(y.normalMapUv),w.push(y.displacementMapUv),w.push(y.emissiveMapUv),w.push(y.metalnessMapUv),w.push(y.roughnessMapUv),w.push(y.anisotropyMapUv),w.push(y.clearcoatMapUv),w.push(y.clearcoatNormalMapUv),w.push(y.clearcoatRoughnessMapUv),w.push(y.iridescenceMapUv),w.push(y.iridescenceThicknessMapUv),w.push(y.sheenColorMapUv),w.push(y.sheenRoughnessMapUv),w.push(y.specularMapUv),w.push(y.specularColorMapUv),w.push(y.specularIntensityMapUv),w.push(y.transmissionMapUv),w.push(y.thicknessMapUv),w.push(y.combine),w.push(y.fogExp2),w.push(y.sizeAttenuation),w.push(y.morphTargetsCount),w.push(y.morphAttributeCount),w.push(y.numDirLights),w.push(y.numPointLights),w.push(y.numSpotLights),w.push(y.numSpotLightMaps),w.push(y.numHemiLights),w.push(y.numRectAreaLights),w.push(y.numDirLightShadows),w.push(y.numPointLightShadows),w.push(y.numSpotLightShadows),w.push(y.numSpotLightShadowsWithMaps),w.push(y.numLightProbes),w.push(y.shadowMapType),w.push(y.toneMapping),w.push(y.numClippingPlanes),w.push(y.numClipIntersection),w.push(y.depthPacking)}function x(w,y){r.disableAll(),y.supportsVertexTextures&&r.enable(0),y.instancing&&r.enable(1),y.instancingColor&&r.enable(2),y.instancingMorph&&r.enable(3),y.matcap&&r.enable(4),y.envMap&&r.enable(5),y.normalMapObjectSpace&&r.enable(6),y.normalMapTangentSpace&&r.enable(7),y.clearcoat&&r.enable(8),y.iridescence&&r.enable(9),y.alphaTest&&r.enable(10),y.vertexColors&&r.enable(11),y.vertexAlphas&&r.enable(12),y.vertexUv1s&&r.enable(13),y.vertexUv2s&&r.enable(14),y.vertexUv3s&&r.enable(15),y.vertexTangents&&r.enable(16),y.anisotropy&&r.enable(17),y.alphaHash&&r.enable(18),y.batching&&r.enable(19),y.dispersion&&r.enable(20),y.batchingColor&&r.enable(21),y.gradientMap&&r.enable(22),w.push(r.mask),r.disableAll(),y.fog&&r.enable(0),y.useFog&&r.enable(1),y.flatShading&&r.enable(2),y.logarithmicDepthBuffer&&r.enable(3),y.reversedDepthBuffer&&r.enable(4),y.skinning&&r.enable(5),y.morphTargets&&r.enable(6),y.morphNormals&&r.enable(7),y.morphColors&&r.enable(8),y.premultipliedAlpha&&r.enable(9),y.shadowMapEnabled&&r.enable(10),y.doubleSided&&r.enable(11),y.flipSided&&r.enable(12),y.useDepthPacking&&r.enable(13),y.dithering&&r.enable(14),y.transmission&&r.enable(15),y.sheen&&r.enable(16),y.opaque&&r.enable(17),y.pointsUvs&&r.enable(18),y.decodeVideoTexture&&r.enable(19),y.decodeVideoTextureEmissive&&r.enable(20),y.alphaToCoverage&&r.enable(21),w.push(r.mask)}function _(w){const y=g[w.type];let D;if(y){const F=Tn[y];D=Ld.clone(F.uniforms)}else D=w.uniforms;return D}function P(w,y){let D;for(let F=0,z=h.length;F<z;F++){const V=h[F];if(V.cacheKey===y){D=V,++D.usedTimes;break}}return D===void 0&&(D=new Bg(n,y,w,o),h.push(D)),D}function E(w){if(--w.usedTimes===0){const y=h.indexOf(w);h[y]=h[h.length-1],h.pop(),w.destroy()}}function A(w){c.remove(w)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:_,acquireProgram:P,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:R}}function qg(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let r=n.get(a);return r===void 0&&(r={},n.set(a,r)),r}function i(a){n.delete(a)}function s(a,r,c){n.get(a)[r]=c}function o(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:o}}function Wg(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Sl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function wl(){const n=[];let t=0;const e=[],i=[],s=[];function o(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,p,g,v,m){let f=n[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},n[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=v,f.group=m),t++,f}function r(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||Wg),i.length>1&&i.sort(d||Sl),s.length>1&&s.sort(d||Sl)}function h(){for(let u=t,d=n.length;u<d;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:o,push:r,unshift:c,finish:h,sort:l}}function Xg(){let n=new WeakMap;function t(i,s){const o=n.get(i);let a;return o===void 0?(a=new wl,n.set(i,[a])):s>=o.length?(a=new wl,o.push(a)):a=o[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function jg(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new ae};break;case"SpotLight":e={position:new N,direction:new N,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new ae,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":e={color:new ae,position:new N,halfWidth:new N,halfHeight:new N};break}return n[t.id]=e,e}}}function Yg(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Zg=0;function Jg(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function $g(n){const t=new jg,e=Yg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new N);const s=new N,o=new we,a=new we;function r(l){let h=0,u=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,S=0,x=0,_=0,P=0,E=0,A=0;l.sort(Jg);for(let w=0,y=l.length;w<y;w++){const D=l[w],F=D.color,z=D.intensity,V=D.distance,q=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=F.r*z,u+=F.g*z,d+=F.b*z;else if(D.isLightProbe){for(let J=0;J<9;J++)i.probe[J].addScaledVector(D.sh.coefficients[J],z);A++}else if(D.isDirectionalLight){const J=t.get(D);if(J.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const st=D.shadow,$=e.get(D);$.shadowIntensity=st.intensity,$.shadowBias=st.bias,$.shadowNormalBias=st.normalBias,$.shadowRadius=st.radius,$.shadowMapSize=st.mapSize,i.directionalShadow[p]=$,i.directionalShadowMap[p]=q,i.directionalShadowMatrix[p]=D.shadow.matrix,S++}i.directional[p]=J,p++}else if(D.isSpotLight){const J=t.get(D);J.position.setFromMatrixPosition(D.matrixWorld),J.color.copy(F).multiplyScalar(z),J.distance=V,J.coneCos=Math.cos(D.angle),J.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),J.decay=D.decay,i.spot[v]=J;const st=D.shadow;if(D.map&&(i.spotLightMap[P]=D.map,P++,st.updateMatrices(D),D.castShadow&&E++),i.spotLightMatrix[v]=st.matrix,D.castShadow){const $=e.get(D);$.shadowIntensity=st.intensity,$.shadowBias=st.bias,$.shadowNormalBias=st.normalBias,$.shadowRadius=st.radius,$.shadowMapSize=st.mapSize,i.spotShadow[v]=$,i.spotShadowMap[v]=q,_++}v++}else if(D.isRectAreaLight){const J=t.get(D);J.color.copy(F).multiplyScalar(z),J.halfWidth.set(D.width*.5,0,0),J.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=J,m++}else if(D.isPointLight){const J=t.get(D);if(J.color.copy(D.color).multiplyScalar(D.intensity),J.distance=D.distance,J.decay=D.decay,D.castShadow){const st=D.shadow,$=e.get(D);$.shadowIntensity=st.intensity,$.shadowBias=st.bias,$.shadowNormalBias=st.normalBias,$.shadowRadius=st.radius,$.shadowMapSize=st.mapSize,$.shadowCameraNear=st.camera.near,$.shadowCameraFar=st.camera.far,i.pointShadow[g]=$,i.pointShadowMap[g]=q,i.pointShadowMatrix[g]=D.shadow.matrix,x++}i.point[g]=J,g++}else if(D.isHemisphereLight){const J=t.get(D);J.skyColor.copy(D.color).multiplyScalar(z),J.groundColor.copy(D.groundColor).multiplyScalar(z),i.hemi[f]=J,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pt.LTC_FLOAT_1,i.rectAreaLTC2=Pt.LTC_FLOAT_2):(i.rectAreaLTC1=Pt.LTC_HALF_1,i.rectAreaLTC2=Pt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const R=i.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==m||R.hemiLength!==f||R.numDirectionalShadows!==S||R.numPointShadows!==x||R.numSpotShadows!==_||R.numSpotMaps!==P||R.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=_,i.spotShadowMap.length=_,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=_+P-E,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,R.directionalLength=p,R.pointLength=g,R.spotLength=v,R.rectAreaLength=m,R.hemiLength=f,R.numDirectionalShadows=S,R.numPointShadows=x,R.numSpotShadows=_,R.numSpotMaps=P,R.numLightProbes=A,i.version=Zg++)}function c(l,h){let u=0,d=0,p=0,g=0,v=0;const m=h.matrixWorldInverse;for(let f=0,S=l.length;f<S;f++){const x=l[f];if(x.isDirectionalLight){const _=i.directional[u];_.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(x.isSpotLight){const _=i.spot[p];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const _=i.rectArea[g];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),a.identity(),o.copy(x.matrixWorld),o.premultiply(m),a.extractRotation(o),_.halfWidth.set(x.width*.5,0,0),_.halfHeight.set(0,x.height*.5,0),_.halfWidth.applyMatrix4(a),_.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const _=i.point[d];_.position.setFromMatrixPosition(x.matrixWorld),_.position.applyMatrix4(m),d++}else if(x.isHemisphereLight){const _=i.hemi[v];_.direction.setFromMatrixPosition(x.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:r,setupView:c,state:i}}function El(n){const t=new $g(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function o(h){e.push(h)}function a(h){i.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:r,setupLightsView:c,pushLight:o,pushShadow:a}}function Kg(n){let t=new WeakMap;function e(s,o=0){const a=t.get(s);let r;return a===void 0?(r=new El(n),t.set(s,[r])):o>=a.length?(r=new El(n),a.push(r)):r=a[o],r}function i(){t=new WeakMap}return{get:e,dispose:i}}const Qg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,tv=`uniform sampler2D shadow_pass;
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
}`;function ev(n,t,e){let i=new cc;const s=new Tt,o=new Tt,a=new Ee,r=new Ef({depthPacking:Vu}),c=new Tf,l={},h=e.maxTextureSize,u={[Wn]:$e,[$e]:Wn,[yn]:yn},d=new ri({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:Qg,fragmentShader:tv}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ie;g.setAttribute("position",new Rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new M(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=oh;let f=this.type;this.render=function(E,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const w=n.getRenderTarget(),y=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),F=n.state;F.setBlending(oi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=f!==zn&&this.type===zn,V=f===zn&&this.type!==zn;for(let q=0,J=E.length;q<J;q++){const st=E[q],$=st.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",st,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const at=$.getFrameExtents();if(s.multiply(at),o.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/at.x),s.x=o.x*at.x,$.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/at.y),s.y=o.y*at.y,$.mapSize.y=o.y)),$.map===null||z===!0||V===!0){const yt=this.type!==zn?{minFilter:je,magFilter:je}:{};$.map!==null&&$.map.dispose(),$.map=new Ti(s.x,s.y,yt),$.map.texture.name=st.name+".shadowMap",$.camera.updateProjectionMatrix()}n.setRenderTarget($.map),n.clear();const Z=$.getViewportCount();for(let yt=0;yt<Z;yt++){const Wt=$.getViewport(yt);a.set(o.x*Wt.x,o.y*Wt.y,o.x*Wt.z,o.y*Wt.w),F.viewport(a),$.updateMatrices(st,yt),i=$.getFrustum(),_(A,R,$.camera,st,this.type)}$.isPointLightShadow!==!0&&this.type===zn&&S($,R),$.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(w,y,D)};function S(E,A){const R=t.update(v);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ti(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,R,d,v,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,R,p,v,null)}function x(E,A,R,w){let y=null;const D=R.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)y=D;else if(y=R.isPointLight===!0?c:r,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const F=y.uuid,z=A.uuid;let V=l[F];V===void 0&&(V={},l[F]=V);let q=V[z];q===void 0&&(q=y.clone(),V[z]=q,A.addEventListener("dispose",P)),y=q}if(y.visible=A.visible,y.wireframe=A.wireframe,w===zn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,R.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const F=n.properties.get(y);F.light=R}return y}function _(E,A,R,w,y){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&y===zn)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,E.matrixWorld);const z=t.update(E),V=E.material;if(Array.isArray(V)){const q=z.groups;for(let J=0,st=q.length;J<st;J++){const $=q[J],at=V[$.materialIndex];if(at&&at.visible){const Z=x(E,at,w,y);E.onBeforeShadow(n,E,A,R,z,Z,$),n.renderBufferDirect(R,null,z,Z,E,$),E.onAfterShadow(n,E,A,R,z,Z,$)}}}else if(V.visible){const q=x(E,V,w,y);E.onBeforeShadow(n,E,A,R,z,q,null),n.renderBufferDirect(R,null,z,q,E,null),E.onAfterShadow(n,E,A,R,z,q,null)}}const F=E.children;for(let z=0,V=F.length;z<V;z++)_(F[z],A,R,w,y)}function P(E){E.target.removeEventListener("dispose",P);for(const R in l){const w=l[R],y=E.target.uuid;y in w&&(w[y].dispose(),delete w[y])}}}const nv={[Ga]:qa,[Wa]:Ya,[Xa]:Za,[Ji]:ja,[qa]:Ga,[Ya]:Wa,[Za]:Xa,[ja]:Ji};function iv(n,t){function e(){let k=!1;const Mt=new Ee;let Et=null;const Lt=new Ee(0,0,0,0);return{setMask:function(pt){Et!==pt&&!k&&(n.colorMask(pt,pt,pt,pt),Et=pt)},setLocked:function(pt){k=pt},setClear:function(pt,lt,Dt,jt,pe){pe===!0&&(pt*=jt,lt*=jt,Dt*=jt),Mt.set(pt,lt,Dt,jt),Lt.equals(Mt)===!1&&(n.clearColor(pt,lt,Dt,jt),Lt.copy(Mt))},reset:function(){k=!1,Et=null,Lt.set(-1,0,0,0)}}}function i(){let k=!1,Mt=!1,Et=null,Lt=null,pt=null;return{setReversed:function(lt){if(Mt!==lt){const Dt=t.get("EXT_clip_control");lt?Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.ZERO_TO_ONE_EXT):Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.NEGATIVE_ONE_TO_ONE_EXT),Mt=lt;const jt=pt;pt=null,this.setClear(jt)}},getReversed:function(){return Mt},setTest:function(lt){lt?dt(n.DEPTH_TEST):It(n.DEPTH_TEST)},setMask:function(lt){Et!==lt&&!k&&(n.depthMask(lt),Et=lt)},setFunc:function(lt){if(Mt&&(lt=nv[lt]),Lt!==lt){switch(lt){case Ga:n.depthFunc(n.NEVER);break;case qa:n.depthFunc(n.ALWAYS);break;case Wa:n.depthFunc(n.LESS);break;case Ji:n.depthFunc(n.LEQUAL);break;case Xa:n.depthFunc(n.EQUAL);break;case ja:n.depthFunc(n.GEQUAL);break;case Ya:n.depthFunc(n.GREATER);break;case Za:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Lt=lt}},setLocked:function(lt){k=lt},setClear:function(lt){pt!==lt&&(Mt&&(lt=1-lt),n.clearDepth(lt),pt=lt)},reset:function(){k=!1,Et=null,Lt=null,pt=null,Mt=!1}}}function s(){let k=!1,Mt=null,Et=null,Lt=null,pt=null,lt=null,Dt=null,jt=null,pe=null;return{setTest:function(ce){k||(ce?dt(n.STENCIL_TEST):It(n.STENCIL_TEST))},setMask:function(ce){Mt!==ce&&!k&&(n.stencilMask(ce),Mt=ce)},setFunc:function(ce,on,Ke){(Et!==ce||Lt!==on||pt!==Ke)&&(n.stencilFunc(ce,on,Ke),Et=ce,Lt=on,pt=Ke)},setOp:function(ce,on,Ke){(lt!==ce||Dt!==on||jt!==Ke)&&(n.stencilOp(ce,on,Ke),lt=ce,Dt=on,jt=Ke)},setLocked:function(ce){k=ce},setClear:function(ce){pe!==ce&&(n.clearStencil(ce),pe=ce)},reset:function(){k=!1,Mt=null,Et=null,Lt=null,pt=null,lt=null,Dt=null,jt=null,pe=null}}}const o=new e,a=new i,r=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,S=null,x=null,_=null,P=null,E=null,A=new ae(0,0,0),R=0,w=!1,y=null,D=null,F=null,z=null,V=null;const q=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,st=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec($)[1]),J=st>=1):$.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),J=st>=2);let at=null,Z={};const yt=n.getParameter(n.SCISSOR_BOX),Wt=n.getParameter(n.VIEWPORT),te=new Ee().fromArray(yt),he=new Ee().fromArray(Wt);function se(k,Mt,Et,Lt){const pt=new Uint8Array(4),lt=n.createTexture();n.bindTexture(k,lt),n.texParameteri(k,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(k,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Dt=0;Dt<Et;Dt++)k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?n.texImage3D(Mt,0,n.RGBA,1,1,Lt,0,n.RGBA,n.UNSIGNED_BYTE,pt):n.texImage2D(Mt+Dt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pt);return lt}const rt={};rt[n.TEXTURE_2D]=se(n.TEXTURE_2D,n.TEXTURE_2D,1),rt[n.TEXTURE_CUBE_MAP]=se(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),rt[n.TEXTURE_2D_ARRAY]=se(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),rt[n.TEXTURE_3D]=se(n.TEXTURE_3D,n.TEXTURE_3D,1,1),o.setClear(0,0,0,1),a.setClear(1),r.setClear(0),dt(n.DEPTH_TEST),a.setFunc(Ji),ct(!1),Y(xc),dt(n.CULL_FACE),ft(oi);function dt(k){h[k]!==!0&&(n.enable(k),h[k]=!0)}function It(k){h[k]!==!1&&(n.disable(k),h[k]=!1)}function Ht(k,Mt){return u[k]!==Mt?(n.bindFramebuffer(k,Mt),u[k]=Mt,k===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Mt),k===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Mt),!0):!1}function Ft(k,Mt){let Et=p,Lt=!1;if(k){Et=d.get(Mt),Et===void 0&&(Et=[],d.set(Mt,Et));const pt=k.textures;if(Et.length!==pt.length||Et[0]!==n.COLOR_ATTACHMENT0){for(let lt=0,Dt=pt.length;lt<Dt;lt++)Et[lt]=n.COLOR_ATTACHMENT0+lt;Et.length=pt.length,Lt=!0}}else Et[0]!==n.BACK&&(Et[0]=n.BACK,Lt=!0);Lt&&n.drawBuffers(Et)}function ee(k){return g!==k?(n.useProgram(k),g=k,!0):!1}const me={[Mi]:n.FUNC_ADD,[fu]:n.FUNC_SUBTRACT,[pu]:n.FUNC_REVERSE_SUBTRACT};me[mu]=n.MIN,me[gu]=n.MAX;const O={[vu]:n.ZERO,[_u]:n.ONE,[xu]:n.SRC_COLOR,[Va]:n.SRC_ALPHA,[Eu]:n.SRC_ALPHA_SATURATE,[Su]:n.DST_COLOR,[yu]:n.DST_ALPHA,[Mu]:n.ONE_MINUS_SRC_COLOR,[Ha]:n.ONE_MINUS_SRC_ALPHA,[wu]:n.ONE_MINUS_DST_COLOR,[bu]:n.ONE_MINUS_DST_ALPHA,[Tu]:n.CONSTANT_COLOR,[Au]:n.ONE_MINUS_CONSTANT_COLOR,[Cu]:n.CONSTANT_ALPHA,[Pu]:n.ONE_MINUS_CONSTANT_ALPHA};function ft(k,Mt,Et,Lt,pt,lt,Dt,jt,pe,ce){if(k===oi){v===!0&&(It(n.BLEND),v=!1);return}if(v===!1&&(dt(n.BLEND),v=!0),k!==du){if(k!==m||ce!==w){if((f!==Mi||_!==Mi)&&(n.blendEquation(n.FUNC_ADD),f=Mi,_=Mi),ce)switch(k){case Yi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Mc:n.blendFunc(n.ONE,n.ONE);break;case yc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case bc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Yi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Mc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case yc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case bc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}S=null,x=null,P=null,E=null,A.set(0,0,0),R=0,m=k,w=ce}return}pt=pt||Mt,lt=lt||Et,Dt=Dt||Lt,(Mt!==f||pt!==_)&&(n.blendEquationSeparate(me[Mt],me[pt]),f=Mt,_=pt),(Et!==S||Lt!==x||lt!==P||Dt!==E)&&(n.blendFuncSeparate(O[Et],O[Lt],O[lt],O[Dt]),S=Et,x=Lt,P=lt,E=Dt),(jt.equals(A)===!1||pe!==R)&&(n.blendColor(jt.r,jt.g,jt.b,pe),A.copy(jt),R=pe),m=k,w=!1}function ht(k,Mt){k.side===yn?It(n.CULL_FACE):dt(n.CULL_FACE);let Et=k.side===$e;Mt&&(Et=!Et),ct(Et),k.blending===Yi&&k.transparent===!1?ft(oi):ft(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),o.setMask(k.colorWrite);const Lt=k.stencilWrite;r.setTest(Lt),Lt&&(r.setMask(k.stencilWriteMask),r.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),r.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),vt(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?dt(n.SAMPLE_ALPHA_TO_COVERAGE):It(n.SAMPLE_ALPHA_TO_COVERAGE)}function ct(k){y!==k&&(k?n.frontFace(n.CW):n.frontFace(n.CCW),y=k)}function Y(k){k!==hu?(dt(n.CULL_FACE),k!==D&&(k===xc?n.cullFace(n.BACK):k===uu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):It(n.CULL_FACE),D=k}function bt(k){k!==F&&(J&&n.lineWidth(k),F=k)}function vt(k,Mt,Et){k?(dt(n.POLYGON_OFFSET_FILL),(z!==Mt||V!==Et)&&(n.polygonOffset(Mt,Et),z=Mt,V=Et)):It(n.POLYGON_OFFSET_FILL)}function wt(k){k?dt(n.SCISSOR_TEST):It(n.SCISSOR_TEST)}function Xt(k){k===void 0&&(k=n.TEXTURE0+q-1),at!==k&&(n.activeTexture(k),at=k)}function Zt(k,Mt,Et){Et===void 0&&(at===null?Et=n.TEXTURE0+q-1:Et=at);let Lt=Z[Et];Lt===void 0&&(Lt={type:void 0,texture:void 0},Z[Et]=Lt),(Lt.type!==k||Lt.texture!==Mt)&&(at!==Et&&(n.activeTexture(Et),at=Et),n.bindTexture(k,Mt||rt[k]),Lt.type=k,Lt.texture=Mt)}function U(){const k=Z[at];k!==void 0&&k.type!==void 0&&(n.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function X(){try{n.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Q(){try{n.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ut(){try{n.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function it(){try{n.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ot(){try{n.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function St(){try{n.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function zt(){try{n.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Bt(){try{n.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function xt(){try{n.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function mt(k){te.equals(k)===!1&&(n.scissor(k.x,k.y,k.z,k.w),te.copy(k))}function Gt(k){he.equals(k)===!1&&(n.viewport(k.x,k.y,k.z,k.w),he.copy(k))}function Nt(k,Mt){let Et=l.get(Mt);Et===void 0&&(Et=new WeakMap,l.set(Mt,Et));let Lt=Et.get(k);Lt===void 0&&(Lt=n.getUniformBlockIndex(Mt,k.name),Et.set(k,Lt))}function At(k,Mt){const Lt=l.get(Mt).get(k);c.get(Mt)!==Lt&&(n.uniformBlockBinding(Mt,Lt,k.__bindingPointIndex),c.set(Mt,Lt))}function qt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},at=null,Z={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,S=null,x=null,_=null,P=null,E=null,A=new ae(0,0,0),R=0,w=!1,y=null,D=null,F=null,z=null,V=null,te.set(0,0,n.canvas.width,n.canvas.height),he.set(0,0,n.canvas.width,n.canvas.height),o.reset(),a.reset(),r.reset()}return{buffers:{color:o,depth:a,stencil:r},enable:dt,disable:It,bindFramebuffer:Ht,drawBuffers:Ft,useProgram:ee,setBlending:ft,setMaterial:ht,setFlipSided:ct,setCullFace:Y,setLineWidth:bt,setPolygonOffset:vt,setScissorTest:wt,activeTexture:Xt,bindTexture:Zt,unbindTexture:U,compressedTexImage2D:T,compressedTexImage3D:X,texImage2D:Bt,texImage3D:xt,updateUBOMapping:Nt,uniformBlockBinding:At,texStorage2D:St,texStorage3D:zt,texSubImage2D:Q,texSubImage3D:ut,compressedTexSubImage2D:it,compressedTexSubImage3D:Ot,scissor:mt,viewport:Gt,reset:qt}}function sv(n,t,e,i,s,o,a){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Tt,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(U,T){return p?new OffscreenCanvas(U,T):Fo("canvas")}function v(U,T,X){let Q=1;const ut=Zt(U);if((ut.width>X||ut.height>X)&&(Q=X/Math.max(ut.width,ut.height)),Q<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const it=Math.floor(Q*ut.width),Ot=Math.floor(Q*ut.height);u===void 0&&(u=g(it,Ot));const St=T?g(it,Ot):u;return St.width=it,St.height=Ot,St.getContext("2d").drawImage(U,0,0,it,Ot),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ut.width+"x"+ut.height+") to ("+it+"x"+Ot+")."),St}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ut.width+"x"+ut.height+")."),U;return U}function m(U){return U.generateMipmaps}function f(U){n.generateMipmap(U)}function S(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(U,T,X,Q,ut=!1){if(U!==null){if(n[U]!==void 0)return n[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let it=T;if(T===n.RED&&(X===n.FLOAT&&(it=n.R32F),X===n.HALF_FLOAT&&(it=n.R16F),X===n.UNSIGNED_BYTE&&(it=n.R8)),T===n.RED_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.R8UI),X===n.UNSIGNED_SHORT&&(it=n.R16UI),X===n.UNSIGNED_INT&&(it=n.R32UI),X===n.BYTE&&(it=n.R8I),X===n.SHORT&&(it=n.R16I),X===n.INT&&(it=n.R32I)),T===n.RG&&(X===n.FLOAT&&(it=n.RG32F),X===n.HALF_FLOAT&&(it=n.RG16F),X===n.UNSIGNED_BYTE&&(it=n.RG8)),T===n.RG_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.RG8UI),X===n.UNSIGNED_SHORT&&(it=n.RG16UI),X===n.UNSIGNED_INT&&(it=n.RG32UI),X===n.BYTE&&(it=n.RG8I),X===n.SHORT&&(it=n.RG16I),X===n.INT&&(it=n.RG32I)),T===n.RGB_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.RGB8UI),X===n.UNSIGNED_SHORT&&(it=n.RGB16UI),X===n.UNSIGNED_INT&&(it=n.RGB32UI),X===n.BYTE&&(it=n.RGB8I),X===n.SHORT&&(it=n.RGB16I),X===n.INT&&(it=n.RGB32I)),T===n.RGBA_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.RGBA8UI),X===n.UNSIGNED_SHORT&&(it=n.RGBA16UI),X===n.UNSIGNED_INT&&(it=n.RGBA32UI),X===n.BYTE&&(it=n.RGBA8I),X===n.SHORT&&(it=n.RGBA16I),X===n.INT&&(it=n.RGBA32I)),T===n.RGB&&(X===n.UNSIGNED_INT_5_9_9_9_REV&&(it=n.RGB9_E5),X===n.UNSIGNED_INT_10F_11F_11F_REV&&(it=n.R11F_G11F_B10F)),T===n.RGBA){const Ot=ut?Uo:de.getTransfer(Q);X===n.FLOAT&&(it=n.RGBA32F),X===n.HALF_FLOAT&&(it=n.RGBA16F),X===n.UNSIGNED_BYTE&&(it=Ot===ve?n.SRGB8_ALPHA8:n.RGBA8),X===n.UNSIGNED_SHORT_4_4_4_4&&(it=n.RGBA4),X===n.UNSIGNED_SHORT_5_5_5_1&&(it=n.RGB5_A1)}return(it===n.R16F||it===n.R32F||it===n.RG16F||it===n.RG32F||it===n.RGBA16F||it===n.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function _(U,T){let X;return U?T===null||T===Ei||T===As?X=n.DEPTH24_STENCIL8:T===Vn?X=n.DEPTH32F_STENCIL8:T===Ts&&(X=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Ei||T===As?X=n.DEPTH_COMPONENT24:T===Vn?X=n.DEPTH_COMPONENT32F:T===Ts&&(X=n.DEPTH_COMPONENT16),X}function P(U,T){return m(U)===!0||U.isFramebufferTexture&&U.minFilter!==je&&U.minFilter!==An?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function E(U){const T=U.target;T.removeEventListener("dispose",E),R(T),T.isVideoTexture&&h.delete(T)}function A(U){const T=U.target;T.removeEventListener("dispose",A),y(T)}function R(U){const T=i.get(U);if(T.__webglInit===void 0)return;const X=U.source,Q=d.get(X);if(Q){const ut=Q[T.__cacheKey];ut.usedTimes--,ut.usedTimes===0&&w(U),Object.keys(Q).length===0&&d.delete(X)}i.remove(U)}function w(U){const T=i.get(U);n.deleteTexture(T.__webglTexture);const X=U.source,Q=d.get(X);delete Q[T.__cacheKey],a.memory.textures--}function y(U){const T=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(T.__webglFramebuffer[Q]))for(let ut=0;ut<T.__webglFramebuffer[Q].length;ut++)n.deleteFramebuffer(T.__webglFramebuffer[Q][ut]);else n.deleteFramebuffer(T.__webglFramebuffer[Q]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[Q])}else{if(Array.isArray(T.__webglFramebuffer))for(let Q=0;Q<T.__webglFramebuffer.length;Q++)n.deleteFramebuffer(T.__webglFramebuffer[Q]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let Q=0;Q<T.__webglColorRenderbuffer.length;Q++)T.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[Q]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const X=U.textures;for(let Q=0,ut=X.length;Q<ut;Q++){const it=i.get(X[Q]);it.__webglTexture&&(n.deleteTexture(it.__webglTexture),a.memory.textures--),i.remove(X[Q])}i.remove(U)}let D=0;function F(){D=0}function z(){const U=D;return U>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),D+=1,U}function V(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function q(U,T){const X=i.get(U);if(U.isVideoTexture&&wt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&X.__version!==U.version){const Q=U.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{rt(X,U,T);return}}else U.isExternalTexture&&(X.__webglTexture=U.sourceTexture?U.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,X.__webglTexture,n.TEXTURE0+T)}function J(U,T){const X=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&X.__version!==U.version){rt(X,U,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,X.__webglTexture,n.TEXTURE0+T)}function st(U,T){const X=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&X.__version!==U.version){rt(X,U,T);return}e.bindTexture(n.TEXTURE_3D,X.__webglTexture,n.TEXTURE0+T)}function $(U,T){const X=i.get(U);if(U.version>0&&X.__version!==U.version){dt(X,U,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture,n.TEXTURE0+T)}const at={[Ka]:n.REPEAT,[bi]:n.CLAMP_TO_EDGE,[Qa]:n.MIRRORED_REPEAT},Z={[je]:n.NEAREST,[Bu]:n.NEAREST_MIPMAP_NEAREST,[js]:n.NEAREST_MIPMAP_LINEAR,[An]:n.LINEAR,[Jo]:n.LINEAR_MIPMAP_NEAREST,[Si]:n.LINEAR_MIPMAP_LINEAR},yt={[Gu]:n.NEVER,[Zu]:n.ALWAYS,[qu]:n.LESS,[vh]:n.LEQUAL,[Wu]:n.EQUAL,[Yu]:n.GEQUAL,[Xu]:n.GREATER,[ju]:n.NOTEQUAL};function Wt(U,T){if(T.type===Vn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===An||T.magFilter===Jo||T.magFilter===js||T.magFilter===Si||T.minFilter===An||T.minFilter===Jo||T.minFilter===js||T.minFilter===Si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,at[T.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,at[T.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,at[T.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,Z[T.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,Z[T.minFilter]),T.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,yt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===je||T.minFilter!==js&&T.minFilter!==Si||T.type===Vn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const X=t.get("EXT_texture_filter_anisotropic");n.texParameterf(U,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function te(U,T){let X=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",E));const Q=T.source;let ut=d.get(Q);ut===void 0&&(ut={},d.set(Q,ut));const it=V(T);if(it!==U.__cacheKey){ut[it]===void 0&&(ut[it]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,X=!0),ut[it].usedTimes++;const Ot=ut[U.__cacheKey];Ot!==void 0&&(ut[U.__cacheKey].usedTimes--,Ot.usedTimes===0&&w(T)),U.__cacheKey=it,U.__webglTexture=ut[it].texture}return X}function he(U,T,X){return Math.floor(Math.floor(U/X)/T)}function se(U,T,X,Q){const it=U.updateRanges;if(it.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,X,Q,T.data);else{it.sort((xt,mt)=>xt.start-mt.start);let Ot=0;for(let xt=1;xt<it.length;xt++){const mt=it[Ot],Gt=it[xt],Nt=mt.start+mt.count,At=he(Gt.start,T.width,4),qt=he(mt.start,T.width,4);Gt.start<=Nt+1&&At===qt&&he(Gt.start+Gt.count-1,T.width,4)===At?mt.count=Math.max(mt.count,Gt.start+Gt.count-mt.start):(++Ot,it[Ot]=Gt)}it.length=Ot+1;const St=n.getParameter(n.UNPACK_ROW_LENGTH),zt=n.getParameter(n.UNPACK_SKIP_PIXELS),Bt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let xt=0,mt=it.length;xt<mt;xt++){const Gt=it[xt],Nt=Math.floor(Gt.start/4),At=Math.ceil(Gt.count/4),qt=Nt%T.width,k=Math.floor(Nt/T.width),Mt=At,Et=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,qt),n.pixelStorei(n.UNPACK_SKIP_ROWS,k),e.texSubImage2D(n.TEXTURE_2D,0,qt,k,Mt,Et,X,Q,T.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,St),n.pixelStorei(n.UNPACK_SKIP_PIXELS,zt),n.pixelStorei(n.UNPACK_SKIP_ROWS,Bt)}}function rt(U,T,X){let Q=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(Q=n.TEXTURE_3D);const ut=te(U,T),it=T.source;e.bindTexture(Q,U.__webglTexture,n.TEXTURE0+X);const Ot=i.get(it);if(it.version!==Ot.__version||ut===!0){e.activeTexture(n.TEXTURE0+X);const St=de.getPrimaries(de.workingColorSpace),zt=T.colorSpace===ii?null:de.getPrimaries(T.colorSpace),Bt=T.colorSpace===ii||St===zt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let xt=v(T.image,!1,s.maxTextureSize);xt=Xt(T,xt);const mt=o.convert(T.format,T.colorSpace),Gt=o.convert(T.type);let Nt=x(T.internalFormat,mt,Gt,T.colorSpace,T.isVideoTexture);Wt(Q,T);let At;const qt=T.mipmaps,k=T.isVideoTexture!==!0,Mt=Ot.__version===void 0||ut===!0,Et=it.dataReady,Lt=P(T,xt);if(T.isDepthTexture)Nt=_(T.format===Ps,T.type),Mt&&(k?e.texStorage2D(n.TEXTURE_2D,1,Nt,xt.width,xt.height):e.texImage2D(n.TEXTURE_2D,0,Nt,xt.width,xt.height,0,mt,Gt,null));else if(T.isDataTexture)if(qt.length>0){k&&Mt&&e.texStorage2D(n.TEXTURE_2D,Lt,Nt,qt[0].width,qt[0].height);for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,Gt,At.data):e.texImage2D(n.TEXTURE_2D,pt,Nt,At.width,At.height,0,mt,Gt,At.data);T.generateMipmaps=!1}else k?(Mt&&e.texStorage2D(n.TEXTURE_2D,Lt,Nt,xt.width,xt.height),Et&&se(T,xt,mt,Gt)):e.texImage2D(n.TEXTURE_2D,0,Nt,xt.width,xt.height,0,mt,Gt,xt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){k&&Mt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Lt,Nt,qt[0].width,qt[0].height,xt.depth);for(let pt=0,lt=qt.length;pt<lt;pt++)if(At=qt[pt],T.format!==wn)if(mt!==null)if(k){if(Et)if(T.layerUpdates.size>0){const Dt=el(At.width,At.height,T.format,T.type);for(const jt of T.layerUpdates){const pe=At.data.subarray(jt*Dt/At.data.BYTES_PER_ELEMENT,(jt+1)*Dt/At.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,jt,At.width,At.height,1,mt,pe)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,0,At.width,At.height,xt.depth,mt,At.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,pt,Nt,At.width,At.height,xt.depth,0,At.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?Et&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,0,At.width,At.height,xt.depth,mt,Gt,At.data):e.texImage3D(n.TEXTURE_2D_ARRAY,pt,Nt,At.width,At.height,xt.depth,0,mt,Gt,At.data)}else{k&&Mt&&e.texStorage2D(n.TEXTURE_2D,Lt,Nt,qt[0].width,qt[0].height);for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],T.format!==wn?mt!==null?k?Et&&e.compressedTexSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,At.data):e.compressedTexImage2D(n.TEXTURE_2D,pt,Nt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,Gt,At.data):e.texImage2D(n.TEXTURE_2D,pt,Nt,At.width,At.height,0,mt,Gt,At.data)}else if(T.isDataArrayTexture)if(k){if(Mt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Lt,Nt,xt.width,xt.height,xt.depth),Et)if(T.layerUpdates.size>0){const pt=el(xt.width,xt.height,T.format,T.type);for(const lt of T.layerUpdates){const Dt=xt.data.subarray(lt*pt/xt.data.BYTES_PER_ELEMENT,(lt+1)*pt/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,xt.width,xt.height,1,mt,Gt,Dt)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,mt,Gt,xt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Nt,xt.width,xt.height,xt.depth,0,mt,Gt,xt.data);else if(T.isData3DTexture)k?(Mt&&e.texStorage3D(n.TEXTURE_3D,Lt,Nt,xt.width,xt.height,xt.depth),Et&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,mt,Gt,xt.data)):e.texImage3D(n.TEXTURE_3D,0,Nt,xt.width,xt.height,xt.depth,0,mt,Gt,xt.data);else if(T.isFramebufferTexture){if(Mt)if(k)e.texStorage2D(n.TEXTURE_2D,Lt,Nt,xt.width,xt.height);else{let pt=xt.width,lt=xt.height;for(let Dt=0;Dt<Lt;Dt++)e.texImage2D(n.TEXTURE_2D,Dt,Nt,pt,lt,0,mt,Gt,null),pt>>=1,lt>>=1}}else if(qt.length>0){if(k&&Mt){const pt=Zt(qt[0]);e.texStorage2D(n.TEXTURE_2D,Lt,Nt,pt.width,pt.height)}for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,mt,Gt,At):e.texImage2D(n.TEXTURE_2D,pt,Nt,mt,Gt,At);T.generateMipmaps=!1}else if(k){if(Mt){const pt=Zt(xt);e.texStorage2D(n.TEXTURE_2D,Lt,Nt,pt.width,pt.height)}Et&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,mt,Gt,xt)}else e.texImage2D(n.TEXTURE_2D,0,Nt,mt,Gt,xt);m(T)&&f(Q),Ot.__version=it.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function dt(U,T,X){if(T.image.length!==6)return;const Q=te(U,T),ut=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+X);const it=i.get(ut);if(ut.version!==it.__version||Q===!0){e.activeTexture(n.TEXTURE0+X);const Ot=de.getPrimaries(de.workingColorSpace),St=T.colorSpace===ii?null:de.getPrimaries(T.colorSpace),zt=T.colorSpace===ii||Ot===St?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,zt);const Bt=T.isCompressedTexture||T.image[0].isCompressedTexture,xt=T.image[0]&&T.image[0].isDataTexture,mt=[];for(let lt=0;lt<6;lt++)!Bt&&!xt?mt[lt]=v(T.image[lt],!0,s.maxCubemapSize):mt[lt]=xt?T.image[lt].image:T.image[lt],mt[lt]=Xt(T,mt[lt]);const Gt=mt[0],Nt=o.convert(T.format,T.colorSpace),At=o.convert(T.type),qt=x(T.internalFormat,Nt,At,T.colorSpace),k=T.isVideoTexture!==!0,Mt=it.__version===void 0||Q===!0,Et=ut.dataReady;let Lt=P(T,Gt);Wt(n.TEXTURE_CUBE_MAP,T);let pt;if(Bt){k&&Mt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Lt,qt,Gt.width,Gt.height);for(let lt=0;lt<6;lt++){pt=mt[lt].mipmaps;for(let Dt=0;Dt<pt.length;Dt++){const jt=pt[Dt];T.format!==wn?Nt!==null?k?Et&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,0,0,jt.width,jt.height,Nt,jt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,qt,jt.width,jt.height,0,jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,0,0,jt.width,jt.height,Nt,At,jt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,qt,jt.width,jt.height,0,Nt,At,jt.data)}}}else{if(pt=T.mipmaps,k&&Mt){pt.length>0&&Lt++;const lt=Zt(mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Lt,qt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(xt){k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,mt[lt].width,mt[lt].height,Nt,At,mt[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,mt[lt].width,mt[lt].height,0,Nt,At,mt[lt].data);for(let Dt=0;Dt<pt.length;Dt++){const pe=pt[Dt].image[lt].image;k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,0,0,pe.width,pe.height,Nt,At,pe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,qt,pe.width,pe.height,0,Nt,At,pe.data)}}else{k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Nt,At,mt[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,Nt,At,mt[lt]);for(let Dt=0;Dt<pt.length;Dt++){const jt=pt[Dt];k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,0,0,Nt,At,jt.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,qt,Nt,At,jt.image[lt])}}}m(T)&&f(n.TEXTURE_CUBE_MAP),it.__version=ut.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function It(U,T,X,Q,ut,it){const Ot=o.convert(X.format,X.colorSpace),St=o.convert(X.type),zt=x(X.internalFormat,Ot,St,X.colorSpace),Bt=i.get(T),xt=i.get(X);if(xt.__renderTarget=T,!Bt.__hasExternalTextures){const mt=Math.max(1,T.width>>it),Gt=Math.max(1,T.height>>it);ut===n.TEXTURE_3D||ut===n.TEXTURE_2D_ARRAY?e.texImage3D(ut,it,zt,mt,Gt,T.depth,0,Ot,St,null):e.texImage2D(ut,it,zt,mt,Gt,0,Ot,St,null)}e.bindFramebuffer(n.FRAMEBUFFER,U),vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,ut,xt.__webglTexture,0,bt(T)):(ut===n.TEXTURE_2D||ut>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ut<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,ut,xt.__webglTexture,it),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ht(U,T,X){if(n.bindRenderbuffer(n.RENDERBUFFER,U),T.depthBuffer){const Q=T.depthTexture,ut=Q&&Q.isDepthTexture?Q.type:null,it=_(T.stencilBuffer,ut),Ot=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,St=bt(T);vt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,St,it,T.width,T.height):X?n.renderbufferStorageMultisample(n.RENDERBUFFER,St,it,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,it,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ot,n.RENDERBUFFER,U)}else{const Q=T.textures;for(let ut=0;ut<Q.length;ut++){const it=Q[ut],Ot=o.convert(it.format,it.colorSpace),St=o.convert(it.type),zt=x(it.internalFormat,Ot,St,it.colorSpace),Bt=bt(T);X&&vt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Bt,zt,T.width,T.height):vt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Bt,zt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,zt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ft(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(T.depthTexture);Q.__renderTarget=T,(!Q.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),q(T.depthTexture,0);const ut=Q.__webglTexture,it=bt(T);if(T.depthTexture.format===Cs)vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0);else if(T.depthTexture.format===Ps)vt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0);else throw new Error("Unknown depthTexture format")}function ee(U){const T=i.get(U),X=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const Q=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),Q){const ut=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,Q.removeEventListener("dispose",ut)};Q.addEventListener("dispose",ut),T.__depthDisposeCallback=ut}T.__boundDepthTexture=Q}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");const Q=U.texture.mipmaps;Q&&Q.length>0?Ft(T.__webglFramebuffer[0],U):Ft(T.__webglFramebuffer,U)}else if(X){T.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[Q]),T.__webglDepthbuffer[Q]===void 0)T.__webglDepthbuffer[Q]=n.createRenderbuffer(),Ht(T.__webglDepthbuffer[Q],U,!1);else{const ut=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=T.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,it)}}else{const Q=U.texture.mipmaps;if(Q&&Q.length>0?e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),Ht(T.__webglDepthbuffer,U,!1);else{const ut=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,it)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function me(U,T,X){const Q=i.get(U);T!==void 0&&It(Q.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),X!==void 0&&ee(U)}function O(U){const T=U.texture,X=i.get(U),Q=i.get(T);U.addEventListener("dispose",A);const ut=U.textures,it=U.isWebGLCubeRenderTarget===!0,Ot=ut.length>1;if(Ot||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=T.version,a.memory.textures++),it){X.__webglFramebuffer=[];for(let St=0;St<6;St++)if(T.mipmaps&&T.mipmaps.length>0){X.__webglFramebuffer[St]=[];for(let zt=0;zt<T.mipmaps.length;zt++)X.__webglFramebuffer[St][zt]=n.createFramebuffer()}else X.__webglFramebuffer[St]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){X.__webglFramebuffer=[];for(let St=0;St<T.mipmaps.length;St++)X.__webglFramebuffer[St]=n.createFramebuffer()}else X.__webglFramebuffer=n.createFramebuffer();if(Ot)for(let St=0,zt=ut.length;St<zt;St++){const Bt=i.get(ut[St]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),a.memory.textures++)}if(U.samples>0&&vt(U)===!1){X.__webglMultisampledFramebuffer=n.createFramebuffer(),X.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let St=0;St<ut.length;St++){const zt=ut[St];X.__webglColorRenderbuffer[St]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,X.__webglColorRenderbuffer[St]);const Bt=o.convert(zt.format,zt.colorSpace),xt=o.convert(zt.type),mt=x(zt.internalFormat,Bt,xt,zt.colorSpace,U.isXRRenderTarget===!0),Gt=bt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,Gt,mt,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,X.__webglColorRenderbuffer[St])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(X.__webglDepthRenderbuffer=n.createRenderbuffer(),Ht(X.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),Wt(n.TEXTURE_CUBE_MAP,T);for(let St=0;St<6;St++)if(T.mipmaps&&T.mipmaps.length>0)for(let zt=0;zt<T.mipmaps.length;zt++)It(X.__webglFramebuffer[St][zt],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,zt);else It(X.__webglFramebuffer[St],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);m(T)&&f(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ot){for(let St=0,zt=ut.length;St<zt;St++){const Bt=ut[St],xt=i.get(Bt);let mt=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(mt=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(mt,xt.__webglTexture),Wt(mt,Bt),It(X.__webglFramebuffer,U,Bt,n.COLOR_ATTACHMENT0+St,mt,0),m(Bt)&&f(mt)}e.unbindTexture()}else{let St=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(St=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(St,Q.__webglTexture),Wt(St,T),T.mipmaps&&T.mipmaps.length>0)for(let zt=0;zt<T.mipmaps.length;zt++)It(X.__webglFramebuffer[zt],U,T,n.COLOR_ATTACHMENT0,St,zt);else It(X.__webglFramebuffer,U,T,n.COLOR_ATTACHMENT0,St,0);m(T)&&f(St),e.unbindTexture()}U.depthBuffer&&ee(U)}function ft(U){const T=U.textures;for(let X=0,Q=T.length;X<Q;X++){const ut=T[X];if(m(ut)){const it=S(U),Ot=i.get(ut).__webglTexture;e.bindTexture(it,Ot),f(it),e.unbindTexture()}}}const ht=[],ct=[];function Y(U){if(U.samples>0){if(vt(U)===!1){const T=U.textures,X=U.width,Q=U.height;let ut=n.COLOR_BUFFER_BIT;const it=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ot=i.get(U),St=T.length>1;if(St)for(let Bt=0;Bt<T.length;Bt++)e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer);const zt=U.texture.mipmaps;zt&&zt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ot.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ot.__webglFramebuffer);for(let Bt=0;Bt<T.length;Bt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ut|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ut|=n.STENCIL_BUFFER_BIT)),St){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ot.__webglColorRenderbuffer[Bt]);const xt=i.get(T[Bt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,xt,0)}n.blitFramebuffer(0,0,X,Q,0,0,X,Q,ut,n.NEAREST),c===!0&&(ht.length=0,ct.length=0,ht.push(n.COLOR_ATTACHMENT0+Bt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(ht.push(it),ct.push(it),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ct)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),St)for(let Bt=0;Bt<T.length;Bt++){e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,Ot.__webglColorRenderbuffer[Bt]);const xt=i.get(T[Bt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ot.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const T=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function bt(U){return Math.min(s.maxSamples,U.samples)}function vt(U){const T=i.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function wt(U){const T=a.render.frame;h.get(U)!==T&&(h.set(U,T),U.update())}function Xt(U,T){const X=U.colorSpace,Q=U.format,ut=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||X!==Qi&&X!==ii&&(de.getTransfer(X)===ve?(Q!==wn||ut!==In)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),T}function Zt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=q,this.setTexture2DArray=J,this.setTexture3D=st,this.setTextureCube=$,this.rebindTextures=me,this.setupRenderTarget=O,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=It,this.useMultisampledRTT=vt}function ov(n,t){function e(i,s=ii){let o;const a=de.getTransfer(s);if(i===In)return n.UNSIGNED_BYTE;if(i===Qr)return n.UNSIGNED_SHORT_4_4_4_4;if(i===tc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===uh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===dh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===lh)return n.BYTE;if(i===hh)return n.SHORT;if(i===Ts)return n.UNSIGNED_SHORT;if(i===Kr)return n.INT;if(i===Ei)return n.UNSIGNED_INT;if(i===Vn)return n.FLOAT;if(i===zs)return n.HALF_FLOAT;if(i===fh)return n.ALPHA;if(i===ph)return n.RGB;if(i===wn)return n.RGBA;if(i===Cs)return n.DEPTH_COMPONENT;if(i===Ps)return n.DEPTH_STENCIL;if(i===ec)return n.RED;if(i===nc)return n.RED_INTEGER;if(i===mh)return n.RG;if(i===ic)return n.RG_INTEGER;if(i===sc)return n.RGBA_INTEGER;if(i===Eo||i===To||i===Ao||i===Co)if(a===ve)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Eo)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===To)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ao)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Co)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Eo)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===To)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ao)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Co)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===tr||i===er||i===nr||i===ir)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===tr)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===er)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===nr)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ir)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===sr||i===or||i===ar)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(i===sr||i===or)return a===ve?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===ar)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===rr||i===cr||i===lr||i===hr||i===ur||i===dr||i===fr||i===pr||i===mr||i===gr||i===vr||i===_r||i===xr||i===Mr)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(i===rr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===cr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===lr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===hr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===ur)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===dr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===fr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===pr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===mr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===gr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===vr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===_r)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===xr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Mr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===yr||i===br||i===Sr)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(i===yr)return a===ve?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===br)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Sr)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===wr||i===Er||i===Tr||i===Ar)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(i===wr)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Er)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Tr)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Ar)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===As?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const av=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rv=`
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

}`;class cv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Ih(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ri({vertexShader:av,fragmentShader:rv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new M(new Ue(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lv extends ns{constructor(t,e){super();const i=this;let s=null,o=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null;const v=typeof XRWebGLBinding<"u",m=new cv,f={},S=e.getContextAttributes();let x=null,_=null;const P=[],E=[],A=new Tt;let R=null;const w=new sn;w.viewport=new Ee;const y=new sn;y.viewport=new Ee;const D=[w,y],F=new Pf;let z=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(rt){let dt=P[rt];return dt===void 0&&(dt=new va,P[rt]=dt),dt.getTargetRaySpace()},this.getControllerGrip=function(rt){let dt=P[rt];return dt===void 0&&(dt=new va,P[rt]=dt),dt.getGripSpace()},this.getHand=function(rt){let dt=P[rt];return dt===void 0&&(dt=new va,P[rt]=dt),dt.getHandSpace()};function q(rt){const dt=E.indexOf(rt.inputSource);if(dt===-1)return;const It=P[dt];It!==void 0&&(It.update(rt.inputSource,rt.frame,l||a),It.dispatchEvent({type:rt.type,data:rt.inputSource}))}function J(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",st);for(let rt=0;rt<P.length;rt++){const dt=E[rt];dt!==null&&(E[rt]=null,P[rt].disconnect(dt))}z=null,V=null,m.reset();for(const rt in f)delete f[rt];t.setRenderTarget(x),p=null,d=null,u=null,s=null,_=null,se.stop(),i.isPresenting=!1,t.setPixelRatio(R),t.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(rt){o=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(rt){r=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(rt){l=rt},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(rt){if(s=rt,s!==null){if(x=t.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",J),s.addEventListener("inputsourceschange",st),S.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(A),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let It=null,Ht=null,Ft=null;S.depth&&(Ft=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,It=S.stencil?Ps:Cs,Ht=S.stencil?As:Ei);const ee={colorFormat:e.RGBA8,depthFormat:Ft,scaleFactor:o};u=this.getBinding(),d=u.createProjectionLayer(ee),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new Ti(d.textureWidth,d.textureHeight,{format:wn,type:In,depthTexture:new Rh(d.textureWidth,d.textureHeight,Ht,void 0,void 0,void 0,void 0,void 0,void 0,It),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const It={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:o};p=new XRWebGLLayer(s,e,It),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new Ti(p.framebufferWidth,p.framebufferHeight,{format:wn,type:In,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(r),se.setContext(s),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function st(rt){for(let dt=0;dt<rt.removed.length;dt++){const It=rt.removed[dt],Ht=E.indexOf(It);Ht>=0&&(E[Ht]=null,P[Ht].disconnect(It))}for(let dt=0;dt<rt.added.length;dt++){const It=rt.added[dt];let Ht=E.indexOf(It);if(Ht===-1){for(let ee=0;ee<P.length;ee++)if(ee>=E.length){E.push(It),Ht=ee;break}else if(E[ee]===null){E[ee]=It,Ht=ee;break}if(Ht===-1)break}const Ft=P[Ht];Ft&&Ft.connect(It)}}const $=new N,at=new N;function Z(rt,dt,It){$.setFromMatrixPosition(dt.matrixWorld),at.setFromMatrixPosition(It.matrixWorld);const Ht=$.distanceTo(at),Ft=dt.projectionMatrix.elements,ee=It.projectionMatrix.elements,me=Ft[14]/(Ft[10]-1),O=Ft[14]/(Ft[10]+1),ft=(Ft[9]+1)/Ft[5],ht=(Ft[9]-1)/Ft[5],ct=(Ft[8]-1)/Ft[0],Y=(ee[8]+1)/ee[0],bt=me*ct,vt=me*Y,wt=Ht/(-ct+Y),Xt=wt*-ct;if(dt.matrixWorld.decompose(rt.position,rt.quaternion,rt.scale),rt.translateX(Xt),rt.translateZ(wt),rt.matrixWorld.compose(rt.position,rt.quaternion,rt.scale),rt.matrixWorldInverse.copy(rt.matrixWorld).invert(),Ft[10]===-1)rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse);else{const Zt=me+wt,U=O+wt,T=bt-Xt,X=vt+(Ht-Xt),Q=ft*O/U*Zt,ut=ht*O/U*Zt;rt.projectionMatrix.makePerspective(T,X,Q,ut,Zt,U),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert()}}function yt(rt,dt){dt===null?rt.matrixWorld.copy(rt.matrix):rt.matrixWorld.multiplyMatrices(dt.matrixWorld,rt.matrix),rt.matrixWorldInverse.copy(rt.matrixWorld).invert()}this.updateCamera=function(rt){if(s===null)return;let dt=rt.near,It=rt.far;m.texture!==null&&(m.depthNear>0&&(dt=m.depthNear),m.depthFar>0&&(It=m.depthFar)),F.near=y.near=w.near=dt,F.far=y.far=w.far=It,(z!==F.near||V!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,V=F.far),F.layers.mask=rt.layers.mask|6,w.layers.mask=F.layers.mask&3,y.layers.mask=F.layers.mask&5;const Ht=rt.parent,Ft=F.cameras;yt(F,Ht);for(let ee=0;ee<Ft.length;ee++)yt(Ft[ee],Ht);Ft.length===2?Z(F,w,y):F.projectionMatrix.copy(w.projectionMatrix),Wt(rt,F,Ht)};function Wt(rt,dt,It){It===null?rt.matrix.copy(dt.matrixWorld):(rt.matrix.copy(It.matrixWorld),rt.matrix.invert(),rt.matrix.multiply(dt.matrixWorld)),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.updateMatrixWorld(!0),rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse),rt.isPerspectiveCamera&&(rt.fov=Rs*2*Math.atan(1/rt.projectionMatrix.elements[5]),rt.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(rt){c=rt,d!==null&&(d.fixedFoveation=rt),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=rt)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(rt){return f[rt]};let te=null;function he(rt,dt){if(h=dt.getViewerPose(l||a),g=dt,h!==null){const It=h.views;p!==null&&(t.setRenderTargetFramebuffer(_,p.framebuffer),t.setRenderTarget(_));let Ht=!1;It.length!==F.cameras.length&&(F.cameras.length=0,Ht=!0);for(let O=0;O<It.length;O++){const ft=It[O];let ht=null;if(p!==null)ht=p.getViewport(ft);else{const Y=u.getViewSubImage(d,ft);ht=Y.viewport,O===0&&(t.setRenderTargetTextures(_,Y.colorTexture,Y.depthStencilTexture),t.setRenderTarget(_))}let ct=D[O];ct===void 0&&(ct=new sn,ct.layers.enable(O),ct.viewport=new Ee,D[O]=ct),ct.matrix.fromArray(ft.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(ft.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(ht.x,ht.y,ht.width,ht.height),O===0&&(F.matrix.copy(ct.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Ht===!0&&F.cameras.push(ct)}const Ft=s.enabledFeatures;if(Ft&&Ft.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const O=u.getDepthInformation(It[0]);O&&O.isValid&&O.texture&&m.init(O,s.renderState)}if(Ft&&Ft.includes("camera-access")&&v){t.state.unbindTexture(),u=i.getBinding();for(let O=0;O<It.length;O++){const ft=It[O].camera;if(ft){let ht=f[ft];ht||(ht=new Ih,f[ft]=ht);const ct=u.getCameraImage(ft);ht.sourceTexture=ct}}}}for(let It=0;It<P.length;It++){const Ht=E[It],Ft=P[It];Ht!==null&&Ft!==void 0&&Ft.update(Ht,dt,l||a)}te&&te(rt,dt),dt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:dt}),g=null}const se=new Gh;se.setAnimationLoop(he),this.setAnimationLoop=function(rt){te=rt},this.dispose=function(){}}}const gi=new Xn,hv=new we;function uv(n,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Eh(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,S,x,_){f.isMeshBasicMaterial||f.isMeshLambertMaterial?o(m,f):f.isMeshToonMaterial?(o(m,f),u(m,f)):f.isMeshPhongMaterial?(o(m,f),h(m,f)):f.isMeshStandardMaterial?(o(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,_)):f.isMeshMatcapMaterial?(o(m,f),g(m,f)):f.isMeshDepthMaterial?o(m,f):f.isMeshDistanceMaterial?(o(m,f),v(m,f)):f.isMeshNormalMaterial?o(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&r(m,f)):f.isPointsMaterial?c(m,f,S,x):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function o(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===$e&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===$e&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const S=t.get(f),x=S.envMap,_=S.envMapRotation;x&&(m.envMap.value=x,gi.copy(_),gi.x*=-1,gi.y*=-1,gi.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),m.envMapRotation.value.setFromMatrix4(hv.makeRotationFromEuler(gi)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function r(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,S,x){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=x*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===$e&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const S=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function dv(n,t,e,i){let s={},o={},a=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,x){const _=x.program;i.uniformBlockBinding(S,_)}function l(S,x){let _=s[S.id];_===void 0&&(g(S),_=h(S),s[S.id]=_,S.addEventListener("dispose",m));const P=x.program;i.updateUBOMapping(S,P);const E=t.render.frame;o[S.id]!==E&&(d(S),o[S.id]=E)}function h(S){const x=u();S.__bindingPointIndex=x;const _=n.createBuffer(),P=S.__size,E=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,_),n.bufferData(n.UNIFORM_BUFFER,P,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,_),_}function u(){for(let S=0;S<r;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const x=s[S.id],_=S.uniforms,P=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let E=0,A=_.length;E<A;E++){const R=Array.isArray(_[E])?_[E]:[_[E]];for(let w=0,y=R.length;w<y;w++){const D=R[w];if(p(D,E,w,P)===!0){const F=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let V=0;for(let q=0;q<z.length;q++){const J=z[q],st=v(J);typeof J=="number"||typeof J=="boolean"?(D.__data[0]=J,n.bufferSubData(n.UNIFORM_BUFFER,F+V,D.__data)):J.isMatrix3?(D.__data[0]=J.elements[0],D.__data[1]=J.elements[1],D.__data[2]=J.elements[2],D.__data[3]=0,D.__data[4]=J.elements[3],D.__data[5]=J.elements[4],D.__data[6]=J.elements[5],D.__data[7]=0,D.__data[8]=J.elements[6],D.__data[9]=J.elements[7],D.__data[10]=J.elements[8],D.__data[11]=0):(J.toArray(D.__data,V),V+=st.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,x,_,P){const E=S.value,A=x+"_"+_;if(P[A]===void 0)return typeof E=="number"||typeof E=="boolean"?P[A]=E:P[A]=E.clone(),!0;{const R=P[A];if(typeof E=="number"||typeof E=="boolean"){if(R!==E)return P[A]=E,!0}else if(R.equals(E)===!1)return R.copy(E),!0}return!1}function g(S){const x=S.uniforms;let _=0;const P=16;for(let A=0,R=x.length;A<R;A++){const w=Array.isArray(x[A])?x[A]:[x[A]];for(let y=0,D=w.length;y<D;y++){const F=w[y],z=Array.isArray(F.value)?F.value:[F.value];for(let V=0,q=z.length;V<q;V++){const J=z[V],st=v(J),$=_%P,at=$%st.boundary,Z=$+at;_+=at,Z!==0&&P-Z<st.storage&&(_+=P-Z),F.__data=new Float32Array(st.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=_,_+=st.storage}}}const E=_%P;return E>0&&(_+=P-E),S.__size=_,S.__cache={},this}function v(S){const x={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(x.boundary=4,x.storage=4):S.isVector2?(x.boundary=8,x.storage=8):S.isVector3||S.isColor?(x.boundary=16,x.storage=12):S.isVector4?(x.boundary=16,x.storage=16):S.isMatrix3?(x.boundary=48,x.storage=48):S.isMatrix4?(x.boundary=64,x.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),x}function m(S){const x=S.target;x.removeEventListener("dispose",m);const _=a.indexOf(x.__bindingPointIndex);a.splice(_,1),n.deleteBuffer(s[x.id]),delete s[x.id],delete o[x.id]}function f(){for(const S in s)n.deleteBuffer(s[S]);a=[],s={},o={}}return{bind:c,update:l,dispose:f}}class Yh{constructor(t={}){const{canvas:e=dd(),context:i=null,depth:s=!0,stencil:o=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,f=null;const S=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ai,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let P=!1;this._outputColorSpace=nn;let E=0,A=0,R=null,w=-1,y=null;const D=new Ee,F=new Ee;let z=null;const V=new ae(0);let q=0,J=e.width,st=e.height,$=1,at=null,Z=null;const yt=new Ee(0,0,J,st),Wt=new Ee(0,0,J,st);let te=!1;const he=new cc;let se=!1,rt=!1;const dt=new we,It=new N,Ht=new Ee,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ee=!1;function me(){return R===null?$:1}let O=i;function ft(I,G){return e.getContext(I,G)}try{const I={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${$r}`),e.addEventListener("webglcontextlost",Et,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",pt,!1),O===null){const G="webgl2";if(O=ft(G,I),O===null)throw ft(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(I){throw console.error("THREE.WebGLRenderer: "+I.message),I}let ht,ct,Y,bt,vt,wt,Xt,Zt,U,T,X,Q,ut,it,Ot,St,zt,Bt,xt,mt,Gt,Nt,At,qt;function k(){ht=new Sm(O),ht.init(),Nt=new ov(O,ht),ct=new gm(O,ht,t,Nt),Y=new iv(O,ht),ct.reversedDepthBuffer&&d&&Y.buffers.depth.setReversed(!0),bt=new Tm(O),vt=new qg,wt=new sv(O,ht,Y,vt,ct,Nt,bt),Xt=new _m(_),Zt=new bm(_),U=new Lf(O),At=new pm(O,U),T=new wm(O,U,bt,At),X=new Cm(O,T,U,bt),xt=new Am(O,ct,wt),St=new vm(vt),Q=new Gg(_,Xt,Zt,ht,ct,At,St),ut=new uv(_,vt),it=new Xg,Ot=new Kg(ht),Bt=new fm(_,Xt,Zt,Y,X,p,c),zt=new ev(_,X,ct),qt=new dv(O,bt,ct,Y),mt=new mm(O,ht,bt),Gt=new Em(O,ht,bt),bt.programs=Q.programs,_.capabilities=ct,_.extensions=ht,_.properties=vt,_.renderLists=it,_.shadowMap=zt,_.state=Y,_.info=bt}k();const Mt=new lv(_,O);this.xr=Mt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const I=ht.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){const I=ht.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(I){I!==void 0&&($=I,this.setSize(J,st,!1))},this.getSize=function(I){return I.set(J,st)},this.setSize=function(I,G,tt=!0){if(Mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=I,st=G,e.width=Math.floor(I*$),e.height=Math.floor(G*$),tt===!0&&(e.style.width=I+"px",e.style.height=G+"px"),this.setViewport(0,0,I,G)},this.getDrawingBufferSize=function(I){return I.set(J*$,st*$).floor()},this.setDrawingBufferSize=function(I,G,tt){J=I,st=G,$=tt,e.width=Math.floor(I*tt),e.height=Math.floor(G*tt),this.setViewport(0,0,I,G)},this.getCurrentViewport=function(I){return I.copy(D)},this.getViewport=function(I){return I.copy(yt)},this.setViewport=function(I,G,tt,et){I.isVector4?yt.set(I.x,I.y,I.z,I.w):yt.set(I,G,tt,et),Y.viewport(D.copy(yt).multiplyScalar($).round())},this.getScissor=function(I){return I.copy(Wt)},this.setScissor=function(I,G,tt,et){I.isVector4?Wt.set(I.x,I.y,I.z,I.w):Wt.set(I,G,tt,et),Y.scissor(F.copy(Wt).multiplyScalar($).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(I){Y.setScissorTest(te=I)},this.setOpaqueSort=function(I){at=I},this.setTransparentSort=function(I){Z=I},this.getClearColor=function(I){return I.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor(...arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha(...arguments)},this.clear=function(I=!0,G=!0,tt=!0){let et=0;if(I){let W=!1;if(R!==null){const gt=R.texture.format;W=gt===sc||gt===ic||gt===nc}if(W){const gt=R.texture.type,Ct=gt===In||gt===Ei||gt===Ts||gt===As||gt===Qr||gt===tc,Ut=Bt.getClearColor(),L=Bt.getClearAlpha(),B=Ut.r,j=Ut.g,K=Ut.b;Ct?(g[0]=B,g[1]=j,g[2]=K,g[3]=L,O.clearBufferuiv(O.COLOR,0,g)):(v[0]=B,v[1]=j,v[2]=K,v[3]=L,O.clearBufferiv(O.COLOR,0,v))}else et|=O.COLOR_BUFFER_BIT}G&&(et|=O.DEPTH_BUFFER_BIT),tt&&(et|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Et,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",pt,!1),Bt.dispose(),it.dispose(),Ot.dispose(),vt.dispose(),Xt.dispose(),Zt.dispose(),X.dispose(),At.dispose(),qt.dispose(),Q.dispose(),Mt.dispose(),Mt.removeEventListener("sessionstart",Ke),Mt.removeEventListener("sessionend",Vs),fn.stop()};function Et(I){I.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const I=bt.autoReset,G=zt.enabled,tt=zt.autoUpdate,et=zt.needsUpdate,W=zt.type;k(),bt.autoReset=I,zt.enabled=G,zt.autoUpdate=tt,zt.needsUpdate=et,zt.type=W}function pt(I){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function lt(I){const G=I.target;G.removeEventListener("dispose",lt),Dt(G)}function Dt(I){jt(I),vt.remove(I)}function jt(I){const G=vt.get(I).programs;G!==void 0&&(G.forEach(function(tt){Q.releaseProgram(tt)}),I.isShaderMaterial&&Q.releaseShaderCache(I))}this.renderBufferDirect=function(I,G,tt,et,W,gt){G===null&&(G=Ft);const Ct=W.isMesh&&W.matrixWorld.determinant()<0,Ut=Ws(I,G,tt,et,W);Y.setMaterial(et,Ct);let L=tt.index,B=1;if(et.wireframe===!0){if(L=T.getWireframeAttribute(tt),L===void 0)return;B=2}const j=tt.drawRange,K=tt.attributes.position;let _t=j.start*B,kt=(j.start+j.count)*B;gt!==null&&(_t=Math.max(_t,gt.start*B),kt=Math.min(kt,(gt.start+gt.count)*B)),L!==null?(_t=Math.max(_t,0),kt=Math.min(kt,L.count)):K!=null&&(_t=Math.max(_t,0),kt=Math.min(kt,K.count));const oe=kt-_t;if(oe<0||oe===1/0)return;At.setup(W,et,Ut,tt,L);let Yt,$t=mt;if(L!==null&&(Yt=U.get(L),$t=Gt,$t.setIndex(Yt)),W.isMesh)et.wireframe===!0?(Y.setLineWidth(et.wireframeLinewidth*me()),$t.setMode(O.LINES)):$t.setMode(O.TRIANGLES);else if(W.isLine){let Vt=et.linewidth;Vt===void 0&&(Vt=1),Y.setLineWidth(Vt*me()),W.isLineSegments?$t.setMode(O.LINES):W.isLineLoop?$t.setMode(O.LINE_LOOP):$t.setMode(O.LINE_STRIP)}else W.isPoints?$t.setMode(O.POINTS):W.isSprite&&$t.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Is("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),$t.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(ht.get("WEBGL_multi_draw"))$t.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Vt=W._multiDrawStarts,xe=W._multiDrawCounts,le=W._multiDrawCount,Le=L?U.get(L).bytesPerElement:1,Zn=vt.get(et).currentProgram.getUniforms();for(let Ve=0;Ve<le;Ve++)Zn.setValue(O,"_gl_DrawID",Ve),$t.render(Vt[Ve]/Le,xe[Ve])}else if(W.isInstancedMesh)$t.renderInstances(_t,oe,W.count);else if(tt.isInstancedBufferGeometry){const Vt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,xe=Math.min(tt.instanceCount,Vt);$t.renderInstances(_t,oe,xe)}else $t.render(_t,oe)};function pe(I,G,tt){I.transparent===!0&&I.side===yn&&I.forceSinglePass===!1?(I.side=$e,I.needsUpdate=!0,Yn(I,G,tt),I.side=Wn,I.needsUpdate=!0,Yn(I,G,tt),I.side=yn):Yn(I,G,tt)}this.compile=function(I,G,tt=null){tt===null&&(tt=I),f=Ot.get(tt),f.init(G),x.push(f),tt.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(f.pushLight(W),W.castShadow&&f.pushShadow(W))}),I!==tt&&I.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(f.pushLight(W),W.castShadow&&f.pushShadow(W))}),f.setupLights();const et=new Set;return I.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const gt=W.material;if(gt)if(Array.isArray(gt))for(let Ct=0;Ct<gt.length;Ct++){const Ut=gt[Ct];pe(Ut,tt,W),et.add(Ut)}else pe(gt,tt,W),et.add(gt)}),f=x.pop(),et},this.compileAsync=function(I,G,tt=null){const et=this.compile(I,G,tt);return new Promise(W=>{function gt(){if(et.forEach(function(Ct){vt.get(Ct).currentProgram.isReady()&&et.delete(Ct)}),et.size===0){W(I);return}setTimeout(gt,10)}ht.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let ce=null;function on(I){ce&&ce(I)}function Ke(){fn.stop()}function Vs(){fn.start()}const fn=new Gh;fn.setAnimationLoop(on),typeof self<"u"&&fn.setContext(self),this.setAnimationLoop=function(I){ce=I,Mt.setAnimationLoop(I),I===null?fn.stop():fn.start()},Mt.addEventListener("sessionstart",Ke),Mt.addEventListener("sessionend",Vs),this.render=function(I,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),Mt.enabled===!0&&Mt.isPresenting===!0&&(Mt.cameraAutoUpdate===!0&&Mt.updateCamera(G),G=Mt.getCamera()),I.isScene===!0&&I.onBeforeRender(_,I,G,R),f=Ot.get(I,x.length),f.init(G),x.push(f),dt.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),he.setFromProjectionMatrix(dt,Cn,G.reversedDepth),rt=this.localClippingEnabled,se=St.init(this.clippingPlanes,rt),m=it.get(I,S.length),m.init(),S.push(m),Mt.enabled===!0&&Mt.isPresenting===!0){const gt=_.xr.getDepthSensingMesh();gt!==null&&rs(gt,G,-1/0,_.sortObjects)}rs(I,G,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(at,Z),ee=Mt.enabled===!1||Mt.isPresenting===!1||Mt.hasDepthSensing()===!1,ee&&Bt.addToRenderList(m,I),this.info.render.frame++,se===!0&&St.beginShadows();const tt=f.state.shadowsArray;zt.render(tt,I,G),se===!0&&St.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=m.opaque,W=m.transmissive;if(f.setupLights(),G.isArrayCamera){const gt=G.cameras;if(W.length>0)for(let Ct=0,Ut=gt.length;Ct<Ut;Ct++){const L=gt[Ct];Hs(et,W,I,L)}ee&&Bt.render(I);for(let Ct=0,Ut=gt.length;Ct<Ut;Ct++){const L=gt[Ct];ci(m,I,L,L.viewport)}}else W.length>0&&Hs(et,W,I,G),ee&&Bt.render(I),ci(m,I,G);R!==null&&A===0&&(wt.updateMultisampleRenderTarget(R),wt.updateRenderTargetMipmap(R)),I.isScene===!0&&I.onAfterRender(_,I,G),At.resetDefaultState(),w=-1,y=null,x.pop(),x.length>0?(f=x[x.length-1],se===!0&&St.setGlobalState(_.clippingPlanes,f.state.camera)):f=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function rs(I,G,tt,et){if(I.visible===!1)return;if(I.layers.test(G.layers)){if(I.isGroup)tt=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(G);else if(I.isLight)f.pushLight(I),I.castShadow&&f.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||he.intersectsSprite(I)){et&&Ht.setFromMatrixPosition(I.matrixWorld).applyMatrix4(dt);const Ct=X.update(I),Ut=I.material;Ut.visible&&m.push(I,Ct,Ut,tt,Ht.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||he.intersectsObject(I))){const Ct=X.update(I),Ut=I.material;if(et&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),Ht.copy(I.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Ht.copy(Ct.boundingSphere.center)),Ht.applyMatrix4(I.matrixWorld).applyMatrix4(dt)),Array.isArray(Ut)){const L=Ct.groups;for(let B=0,j=L.length;B<j;B++){const K=L[B],_t=Ut[K.materialIndex];_t&&_t.visible&&m.push(I,Ct,_t,tt,Ht.z,K)}}else Ut.visible&&m.push(I,Ct,Ut,tt,Ht.z,null)}}const gt=I.children;for(let Ct=0,Ut=gt.length;Ct<Ut;Ct++)rs(gt[Ct],G,tt,et)}function ci(I,G,tt,et){const W=I.opaque,gt=I.transmissive,Ct=I.transparent;f.setupLightsView(tt),se===!0&&St.setGlobalState(_.clippingPlanes,tt),et&&Y.viewport(D.copy(et)),W.length>0&&jn(W,G,tt),gt.length>0&&jn(gt,G,tt),Ct.length>0&&jn(Ct,G,tt),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function Hs(I,G,tt,et){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[et.id]===void 0&&(f.state.transmissionRenderTarget[et.id]=new Ti(1,1,{generateMipmaps:!0,type:ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float")?zs:In,minFilter:Si,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const gt=f.state.transmissionRenderTarget[et.id],Ct=et.viewport||D;gt.setSize(Ct.z*_.transmissionResolutionScale,Ct.w*_.transmissionResolutionScale);const Ut=_.getRenderTarget(),L=_.getActiveCubeFace(),B=_.getActiveMipmapLevel();_.setRenderTarget(gt),_.getClearColor(V),q=_.getClearAlpha(),q<1&&_.setClearColor(16777215,.5),_.clear(),ee&&Bt.render(tt);const j=_.toneMapping;_.toneMapping=ai;const K=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),f.setupLightsView(et),se===!0&&St.setGlobalState(_.clippingPlanes,et),jn(I,tt,et),wt.updateMultisampleRenderTarget(gt),wt.updateRenderTargetMipmap(gt),ht.has("WEBGL_multisampled_render_to_texture")===!1){let _t=!1;for(let kt=0,oe=G.length;kt<oe;kt++){const Yt=G[kt],$t=Yt.object,Vt=Yt.geometry,xe=Yt.material,le=Yt.group;if(xe.side===yn&&$t.layers.test(et.layers)){const Le=xe.side;xe.side=$e,xe.needsUpdate=!0,cs($t,tt,et,Vt,xe,le),xe.side=Le,xe.needsUpdate=!0,_t=!0}}_t===!0&&(wt.updateMultisampleRenderTarget(gt),wt.updateRenderTargetMipmap(gt))}_.setRenderTarget(Ut,L,B),_.setClearColor(V,q),K!==void 0&&(et.viewport=K),_.toneMapping=j}function jn(I,G,tt){const et=G.isScene===!0?G.overrideMaterial:null;for(let W=0,gt=I.length;W<gt;W++){const Ct=I[W],Ut=Ct.object,L=Ct.geometry,B=Ct.group;let j=Ct.material;j.allowOverride===!0&&et!==null&&(j=et),Ut.layers.test(tt.layers)&&cs(Ut,G,tt,L,j,B)}}function cs(I,G,tt,et,W,gt){I.onBeforeRender(_,G,tt,et,W,gt),I.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),W.onBeforeRender(_,G,tt,et,I,gt),W.transparent===!0&&W.side===yn&&W.forceSinglePass===!1?(W.side=$e,W.needsUpdate=!0,_.renderBufferDirect(tt,G,et,W,I,gt),W.side=Wn,W.needsUpdate=!0,_.renderBufferDirect(tt,G,et,W,I,gt),W.side=yn):_.renderBufferDirect(tt,G,et,W,I,gt),I.onAfterRender(_,G,tt,et,W,gt)}function Yn(I,G,tt){G.isScene!==!0&&(G=Ft);const et=vt.get(I),W=f.state.lights,gt=f.state.shadowsArray,Ct=W.state.version,Ut=Q.getParameters(I,W.state,gt,G,tt),L=Q.getProgramCacheKey(Ut);let B=et.programs;et.environment=I.isMeshStandardMaterial?G.environment:null,et.fog=G.fog,et.envMap=(I.isMeshStandardMaterial?Zt:Xt).get(I.envMap||et.environment),et.envMapRotation=et.environment!==null&&I.envMap===null?G.environmentRotation:I.envMapRotation,B===void 0&&(I.addEventListener("dispose",lt),B=new Map,et.programs=B);let j=B.get(L);if(j!==void 0){if(et.currentProgram===j&&et.lightsStateVersion===Ct)return qs(I,Ut),j}else Ut.uniforms=Q.getUniforms(I),I.onBeforeCompile(Ut,_),j=Q.acquireProgram(Ut,L),B.set(L,j),et.uniforms=Ut.uniforms;const K=et.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(K.clippingPlanes=St.uniform),qs(I,Ut),et.needsLights=ls(I),et.lightsStateVersion=Ct,et.needsLights&&(K.ambientLightColor.value=W.state.ambient,K.lightProbe.value=W.state.probe,K.directionalLights.value=W.state.directional,K.directionalLightShadows.value=W.state.directionalShadow,K.spotLights.value=W.state.spot,K.spotLightShadows.value=W.state.spotShadow,K.rectAreaLights.value=W.state.rectArea,K.ltc_1.value=W.state.rectAreaLTC1,K.ltc_2.value=W.state.rectAreaLTC2,K.pointLights.value=W.state.point,K.pointLightShadows.value=W.state.pointShadow,K.hemisphereLights.value=W.state.hemi,K.directionalShadowMap.value=W.state.directionalShadowMap,K.directionalShadowMatrix.value=W.state.directionalShadowMatrix,K.spotShadowMap.value=W.state.spotShadowMap,K.spotLightMatrix.value=W.state.spotLightMatrix,K.spotLightMap.value=W.state.spotLightMap,K.pointShadowMap.value=W.state.pointShadowMap,K.pointShadowMatrix.value=W.state.pointShadowMatrix),et.currentProgram=j,et.uniformsList=null,j}function Gs(I){if(I.uniformsList===null){const G=I.currentProgram.getUniforms();I.uniformsList=Po.seqWithValue(G.seq,I.uniforms)}return I.uniformsList}function qs(I,G){const tt=vt.get(I);tt.outputColorSpace=G.outputColorSpace,tt.batching=G.batching,tt.batchingColor=G.batchingColor,tt.instancing=G.instancing,tt.instancingColor=G.instancingColor,tt.instancingMorph=G.instancingMorph,tt.skinning=G.skinning,tt.morphTargets=G.morphTargets,tt.morphNormals=G.morphNormals,tt.morphColors=G.morphColors,tt.morphTargetsCount=G.morphTargetsCount,tt.numClippingPlanes=G.numClippingPlanes,tt.numIntersection=G.numClipIntersection,tt.vertexAlphas=G.vertexAlphas,tt.vertexTangents=G.vertexTangents,tt.toneMapping=G.toneMapping}function Ws(I,G,tt,et,W){G.isScene!==!0&&(G=Ft),wt.resetTextureUnits();const gt=G.fog,Ct=et.isMeshStandardMaterial?G.environment:null,Ut=R===null?_.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Qi,L=(et.isMeshStandardMaterial?Zt:Xt).get(et.envMap||Ct),B=et.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,j=!!tt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),K=!!tt.morphAttributes.position,_t=!!tt.morphAttributes.normal,kt=!!tt.morphAttributes.color;let oe=ai;et.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(oe=_.toneMapping);const Yt=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,$t=Yt!==void 0?Yt.length:0,Vt=vt.get(et),xe=f.state.lights;if(se===!0&&(rt===!0||I!==y)){const He=I===y&&et.id===w;St.setState(et,I,He)}let le=!1;et.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==xe.state.version||Vt.outputColorSpace!==Ut||W.isBatchedMesh&&Vt.batching===!1||!W.isBatchedMesh&&Vt.batching===!0||W.isBatchedMesh&&Vt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Vt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Vt.instancing===!1||!W.isInstancedMesh&&Vt.instancing===!0||W.isSkinnedMesh&&Vt.skinning===!1||!W.isSkinnedMesh&&Vt.skinning===!0||W.isInstancedMesh&&Vt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Vt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Vt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Vt.instancingMorph===!1&&W.morphTexture!==null||Vt.envMap!==L||et.fog===!0&&Vt.fog!==gt||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==St.numPlanes||Vt.numIntersection!==St.numIntersection)||Vt.vertexAlphas!==B||Vt.vertexTangents!==j||Vt.morphTargets!==K||Vt.morphNormals!==_t||Vt.morphColors!==kt||Vt.toneMapping!==oe||Vt.morphTargetsCount!==$t)&&(le=!0):(le=!0,Vt.__version=et.version);let Le=Vt.currentProgram;le===!0&&(Le=Yn(et,G,W));let Zn=!1,Ve=!1,li=!1;const be=Le.getUniforms(),an=Vt.uniforms;if(Y.useProgram(Le.program)&&(Zn=!0,Ve=!0,li=!0),et.id!==w&&(w=et.id,Ve=!0),Zn||y!==I){Y.buffers.depth.getReversed()&&I.reversedDepth!==!0&&(I._reversedDepth=!0,I.updateProjectionMatrix()),be.setValue(O,"projectionMatrix",I.projectionMatrix),be.setValue(O,"viewMatrix",I.matrixWorldInverse);const Ye=be.map.cameraPosition;Ye!==void 0&&Ye.setValue(O,It.setFromMatrixPosition(I.matrixWorld)),ct.logarithmicDepthBuffer&&be.setValue(O,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&be.setValue(O,"isOrthographic",I.isOrthographicCamera===!0),y!==I&&(y=I,Ve=!0,li=!0)}if(W.isSkinnedMesh){be.setOptional(O,W,"bindMatrix"),be.setOptional(O,W,"bindMatrixInverse");const He=W.skeleton;He&&(He.boneTexture===null&&He.computeBoneTexture(),be.setValue(O,"boneTexture",He.boneTexture,wt))}W.isBatchedMesh&&(be.setOptional(O,W,"batchingTexture"),be.setValue(O,"batchingTexture",W._matricesTexture,wt),be.setOptional(O,W,"batchingIdTexture"),be.setValue(O,"batchingIdTexture",W._indirectTexture,wt),be.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&be.setValue(O,"batchingColorTexture",W._colorsTexture,wt));const rn=tt.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&xt.update(W,tt,Le),(Ve||Vt.receiveShadow!==W.receiveShadow)&&(Vt.receiveShadow=W.receiveShadow,be.setValue(O,"receiveShadow",W.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(an.envMap.value=L,an.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&G.environment!==null&&(an.envMapIntensity.value=G.environmentIntensity),Ve&&(be.setValue(O,"toneMappingExposure",_.toneMappingExposure),Vt.needsLights&&Xs(an,li),gt&&et.fog===!0&&ut.refreshFogUniforms(an,gt),ut.refreshMaterialUniforms(an,et,$,st,f.state.transmissionRenderTarget[I.id]),Po.upload(O,Gs(Vt),an,wt)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Po.upload(O,Gs(Vt),an,wt),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&be.setValue(O,"center",W.center),be.setValue(O,"modelViewMatrix",W.modelViewMatrix),be.setValue(O,"normalMatrix",W.normalMatrix),be.setValue(O,"modelMatrix",W.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const He=et.uniformsGroups;for(let Ye=0,Zo=He.length;Ye<Zo;Ye++){const hi=He[Ye];qt.update(hi,Le),qt.bind(hi,Le)}}return Le}function Xs(I,G){I.ambientLightColor.needsUpdate=G,I.lightProbe.needsUpdate=G,I.directionalLights.needsUpdate=G,I.directionalLightShadows.needsUpdate=G,I.pointLights.needsUpdate=G,I.pointLightShadows.needsUpdate=G,I.spotLights.needsUpdate=G,I.spotLightShadows.needsUpdate=G,I.rectAreaLights.needsUpdate=G,I.hemisphereLights.needsUpdate=G}function ls(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(I,G,tt){const et=vt.get(I);et.__autoAllocateDepthBuffer=I.resolveDepthBuffer===!1,et.__autoAllocateDepthBuffer===!1&&(et.__useRenderToTexture=!1),vt.get(I.texture).__webglTexture=G,vt.get(I.depthTexture).__webglTexture=et.__autoAllocateDepthBuffer?void 0:tt,et.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(I,G){const tt=vt.get(I);tt.__webglFramebuffer=G,tt.__useDefaultFramebuffer=G===void 0};const hs=O.createFramebuffer();this.setRenderTarget=function(I,G=0,tt=0){R=I,E=G,A=tt;let et=!0,W=null,gt=!1,Ct=!1;if(I){const L=vt.get(I);if(L.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(O.FRAMEBUFFER,null),et=!1;else if(L.__webglFramebuffer===void 0)wt.setupRenderTarget(I);else if(L.__hasExternalTextures)wt.rebindTextures(I,vt.get(I.texture).__webglTexture,vt.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){const K=I.depthTexture;if(L.__boundDepthTexture!==K){if(K!==null&&vt.has(K)&&(I.width!==K.image.width||I.height!==K.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");wt.setupDepthRenderbuffer(I)}}const B=I.texture;(B.isData3DTexture||B.isDataArrayTexture||B.isCompressedArrayTexture)&&(Ct=!0);const j=vt.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(j[G])?W=j[G][tt]:W=j[G],gt=!0):I.samples>0&&wt.useMultisampledRTT(I)===!1?W=vt.get(I).__webglMultisampledFramebuffer:Array.isArray(j)?W=j[tt]:W=j,D.copy(I.viewport),F.copy(I.scissor),z=I.scissorTest}else D.copy(yt).multiplyScalar($).floor(),F.copy(Wt).multiplyScalar($).floor(),z=te;if(tt!==0&&(W=hs),Y.bindFramebuffer(O.FRAMEBUFFER,W)&&et&&Y.drawBuffers(I,W),Y.viewport(D),Y.scissor(F),Y.setScissorTest(z),gt){const L=vt.get(I.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+G,L.__webglTexture,tt)}else if(Ct){const L=G;for(let B=0;B<I.textures.length;B++){const j=vt.get(I.textures[B]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+B,j.__webglTexture,tt,L)}}else if(I!==null&&tt!==0){const L=vt.get(I.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,L.__webglTexture,tt)}w=-1},this.readRenderTargetPixels=function(I,G,tt,et,W,gt,Ct,Ut=0){if(!(I&&I.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let L=vt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Ct!==void 0&&(L=L[Ct]),L){Y.bindFramebuffer(O.FRAMEBUFFER,L);try{const B=I.textures[Ut],j=B.format,K=B.type;if(!ct.textureFormatReadable(j)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(K)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=I.width-et&&tt>=0&&tt<=I.height-W&&(I.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ut),O.readPixels(G,tt,et,W,Nt.convert(j),Nt.convert(K),gt))}finally{const B=R!==null?vt.get(R).__webglFramebuffer:null;Y.bindFramebuffer(O.FRAMEBUFFER,B)}}},this.readRenderTargetPixelsAsync=async function(I,G,tt,et,W,gt,Ct,Ut=0){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let L=vt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Ct!==void 0&&(L=L[Ct]),L)if(G>=0&&G<=I.width-et&&tt>=0&&tt<=I.height-W){Y.bindFramebuffer(O.FRAMEBUFFER,L);const B=I.textures[Ut],j=B.format,K=B.type;if(!ct.textureFormatReadable(j))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(K))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const _t=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,_t),O.bufferData(O.PIXEL_PACK_BUFFER,gt.byteLength,O.STREAM_READ),I.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ut),O.readPixels(G,tt,et,W,Nt.convert(j),Nt.convert(K),0);const kt=R!==null?vt.get(R).__webglFramebuffer:null;Y.bindFramebuffer(O.FRAMEBUFFER,kt);const oe=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await fd(O,oe,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,_t),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,gt),O.deleteBuffer(_t),O.deleteSync(oe),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(I,G=null,tt=0){const et=Math.pow(2,-tt),W=Math.floor(I.image.width*et),gt=Math.floor(I.image.height*et),Ct=G!==null?G.x:0,Ut=G!==null?G.y:0;wt.setTexture2D(I,0),O.copyTexSubImage2D(O.TEXTURE_2D,tt,0,0,Ct,Ut,W,gt),Y.unbindTexture()};const Pi=O.createFramebuffer(),ke=O.createFramebuffer();this.copyTextureToTexture=function(I,G,tt=null,et=null,W=0,gt=null){gt===null&&(W!==0?(Is("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),gt=W,W=0):gt=0);let Ct,Ut,L,B,j,K,_t,kt,oe;const Yt=I.isCompressedTexture?I.mipmaps[gt]:I.image;if(tt!==null)Ct=tt.max.x-tt.min.x,Ut=tt.max.y-tt.min.y,L=tt.isBox3?tt.max.z-tt.min.z:1,B=tt.min.x,j=tt.min.y,K=tt.isBox3?tt.min.z:0;else{const rn=Math.pow(2,-W);Ct=Math.floor(Yt.width*rn),Ut=Math.floor(Yt.height*rn),I.isDataArrayTexture?L=Yt.depth:I.isData3DTexture?L=Math.floor(Yt.depth*rn):L=1,B=0,j=0,K=0}et!==null?(_t=et.x,kt=et.y,oe=et.z):(_t=0,kt=0,oe=0);const $t=Nt.convert(G.format),Vt=Nt.convert(G.type);let xe;G.isData3DTexture?(wt.setTexture3D(G,0),xe=O.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(wt.setTexture2DArray(G,0),xe=O.TEXTURE_2D_ARRAY):(wt.setTexture2D(G,0),xe=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,G.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,G.unpackAlignment);const le=O.getParameter(O.UNPACK_ROW_LENGTH),Le=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Zn=O.getParameter(O.UNPACK_SKIP_PIXELS),Ve=O.getParameter(O.UNPACK_SKIP_ROWS),li=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,Yt.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Yt.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,B),O.pixelStorei(O.UNPACK_SKIP_ROWS,j),O.pixelStorei(O.UNPACK_SKIP_IMAGES,K);const be=I.isDataArrayTexture||I.isData3DTexture,an=G.isDataArrayTexture||G.isData3DTexture;if(I.isDepthTexture){const rn=vt.get(I),He=vt.get(G),Ye=vt.get(rn.__renderTarget),Zo=vt.get(He.__renderTarget);Y.bindFramebuffer(O.READ_FRAMEBUFFER,Ye.__webglFramebuffer),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,Zo.__webglFramebuffer);for(let hi=0;hi<L;hi++)be&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,vt.get(I).__webglTexture,W,K+hi),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,vt.get(G).__webglTexture,gt,oe+hi)),O.blitFramebuffer(B,j,Ct,Ut,_t,kt,Ct,Ut,O.DEPTH_BUFFER_BIT,O.NEAREST);Y.bindFramebuffer(O.READ_FRAMEBUFFER,null),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(W!==0||I.isRenderTargetTexture||vt.has(I)){const rn=vt.get(I),He=vt.get(G);Y.bindFramebuffer(O.READ_FRAMEBUFFER,Pi),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,ke);for(let Ye=0;Ye<L;Ye++)be?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,rn.__webglTexture,W,K+Ye):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,rn.__webglTexture,W),an?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,He.__webglTexture,gt,oe+Ye):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,He.__webglTexture,gt),W!==0?O.blitFramebuffer(B,j,Ct,Ut,_t,kt,Ct,Ut,O.COLOR_BUFFER_BIT,O.NEAREST):an?O.copyTexSubImage3D(xe,gt,_t,kt,oe+Ye,B,j,Ct,Ut):O.copyTexSubImage2D(xe,gt,_t,kt,B,j,Ct,Ut);Y.bindFramebuffer(O.READ_FRAMEBUFFER,null),Y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else an?I.isDataTexture||I.isData3DTexture?O.texSubImage3D(xe,gt,_t,kt,oe,Ct,Ut,L,$t,Vt,Yt.data):G.isCompressedArrayTexture?O.compressedTexSubImage3D(xe,gt,_t,kt,oe,Ct,Ut,L,$t,Yt.data):O.texSubImage3D(xe,gt,_t,kt,oe,Ct,Ut,L,$t,Vt,Yt):I.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,gt,_t,kt,Ct,Ut,$t,Vt,Yt.data):I.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,gt,_t,kt,Yt.width,Yt.height,$t,Yt.data):O.texSubImage2D(O.TEXTURE_2D,gt,_t,kt,Ct,Ut,$t,Vt,Yt);O.pixelStorei(O.UNPACK_ROW_LENGTH,le),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Le),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Zn),O.pixelStorei(O.UNPACK_SKIP_ROWS,Ve),O.pixelStorei(O.UNPACK_SKIP_IMAGES,li),gt===0&&G.generateMipmaps&&O.generateMipmap(xe),Y.unbindTexture()},this.initRenderTarget=function(I){vt.get(I).__webglFramebuffer===void 0&&wt.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?wt.setTextureCube(I,0):I.isData3DTexture?wt.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?wt.setTexture2DArray(I,0):wt.setTexture2D(I,0),Y.unbindTexture()},this.resetState=function(){E=0,A=0,R=null,Y.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Cn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}class fv{camera;pitch=De.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new N;desired=new N;aspect=1;constructor(){this.camera=new mc(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=De.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const i=1-Math.pow(.001,t);this.focus.lerp(e,i),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,i=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*i*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*i*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,i){const s=Math.sin(this.yaw),o=Math.cos(this.yaw);return i.set(t*o-e*s,0,-t*s-e*o),i}}class pv{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};ponteiro={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(mv.has(e)||gv.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.surface.getBoundingClientRect();if(this.ponteiro.x=(t.clientX-e.left)/e.width*2-1,this.ponteiro.y=1-(t.clientY-e.top)/e.height*2,t.pointerId!==this.stickId)return;const i=60,s=Math.max(-i,Math.min(i,t.clientX-this.stickOrigin.x)),o=Math.max(-i,Math.min(i,t.clientY-this.stickOrigin.y));this.stickX=s/i,this.stickY=o/i};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};pointer(){return{x:this.ponteiro.x,y:this.ponteiro.y}}move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const i=Math.hypot(t,e);return i>1&&(t/=i,e/=i),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}tapGirar(t){this.pressed.add(t<0?"KeyQ":"KeyR")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const mv=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),gv=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF","KeyH","KeyI","Tab"]),dn=["cabeca","tronco","pernas","pes"],b={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,grassDry:11059802,dirt:12159572,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,brick:13068882,wallCream:15984595,wallMint:14085344,wallAzul:13624565,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,mesaVerde:3108695,cortica:14133098,corticaEscura:12159055,estanteFundo:7030048,pelusaBranco:16184042,pelusaCinza:11050641,pelusaCinzaEscuro:9076852,pelusaFocinho:15247277,pelusaOrelha:14395816,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,roupaLa:14248826,roupaLaBarra:16180168,roupaListra:4882400,roupaListraManga:15987180,roupaJeans:4151942,roupaBota:16763213,roupaBotaCano:9067050,vestidoRosa:16176088,vestidoRenda:16644080,vestidoFita:15773373,maidPreto:2828851,maidCreme:16447214,maidFita:1512988,maidLacoVermelho:12727364,moletomPreto:2500140,moletomCostura:1315864,moletomZiper:4539983,moletomForro:5461086,moletomPonteira:14276301,waRosa:15775432,waRosaForte:14250895,waEscuro:3880263,waBranco:16644853,waFivela:12170944,bermudaAzul:3112912,bermudaVermelha:14173503,bermudaAmarela:15906857,bermudaEstampa:3126696,bermudaEstampaFaixa:16642261,oculosLente:2302251,oculosArmacao:4012872,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578,pessego:16756838};let vi=null;function vv(){if(!vi){const n=new Uint8Array([96,166,214,255]);vi=new zd(n,n.length,1,ec),vi.minFilter=je,vi.magFilter=je,vi.generateMipmaps=!1,vi.needsUpdate=!0}return vi}const Tl=new Map;function C(n,t={}){const e=`${n}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.decal?1:0}`,i=Tl.get(e);if(i)return i;const s=new kh({color:n,gradientMap:vv(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?yn:Wn});return t.glow&&(s.emissive=new ae(n),s.emissiveIntensity=t.glow),t.decal&&Zh(s),Tl.set(e,s),s}function Zh(n){n.polygonOffset=!0,n.polygonOffsetFactor=-1,n.polygonOffsetUnits=-4,n.depthWrite=!1}const Al=new Map;function Xe(n,t=1,e=!1){const i=`${n}|${t}|${e?1:0}`,s=Al.get(i);if(s)return s;const o=new qo({color:n,transparent:t<1,opacity:t,side:yn});return e&&Zh(o),Al.set(i,o),o}const Cl=new Map;function Pl(n){const t=Cl.get(n);if(t)return t;const e=new Ph({color:n});return Cl.set(n,e),e}function Ur(n="redonda",t=1,e=.5){const i=new ot,s=2.1*t,o=new M(new nt(.13*t,.2*t,s,8),C(b.trunk));if(o.position.y=s/2,i.add(o),n==="pinheiro")for(let a=0;a<3;a++){const r=(1.1-a*.26)*t,c=new M(new Ne(r,1.3*t,9),C(a===0?b.leafDark:b.leafMid));c.position.y=s*.7+a*.72*t,i.add(c)}else if(n==="palmeira"){o.scale.y=1.5,o.position.y=s*.75;for(let a=0;a<7;a++){const r=a/7*Math.PI*2,c=new M(new Rt(.75*t,8,6),C(b.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(r)*.85*t,s*1.5-.1,Math.sin(r)*.85*t),c.rotation.y=-r,c.rotation.z=-.32,i.add(c)}}else{const a=n==="florida"?b.flowerPink:b.leafMid;[[0,s+.55*t,0,1.15],[.62*t,s+.15*t,.2*t,.78],[-.5*t,s+.3*t,-.35*t,.88],[.1*t,s+1.05*t,-.3*t,.66]].forEach(([c,l,h,u],d)=>{const p=new M(new Bs(u*t,1),C(d%2===0?a:n==="florida"?b.flowerPink:b.leafLight));p.position.set(c,l,h),p.rotation.set(e*3,e*5,e*2),i.add(p)})}return i}function Ro(n=1,t=b.bush){const e=new ot;for(let i=0;i<3;i++){const s=new M(new Bs(.42*n,1),C(t));s.position.set((i-1)*.36*n,.3*n+(i===1?.12:0),i%2*.18*n),e.add(s)}return e}function Nr(n=6,t=.9,e=[b.flowerPink,b.flowerYellow,16777215]){const i=new ot;for(let s=0;s<n;s++){const o=s/n*Math.PI*2+s*.7,a=t*(.35+s*37%100/140),r=new M(new nt(.02,.02,.3,5),C(b.leafDark));r.position.set(Math.cos(o)*a,.15,Math.sin(o)*a),i.add(r);const c=new M(new Rt(.09,8,6),C(e[s%e.length]));c.position.set(Math.cos(o)*a,.33,Math.sin(o)*a),c.scale.y=.7,i.add(c)}return i}function Mo(n=1,t=.5,e=10133670){const i=new ot,s=new lc(.5*n,0),o=s.attributes.position;for(let r=0;r<o.count;r++){const c=o.getX(r),l=o.getY(r),h=o.getZ(r),u=Math.sin(Math.round(c*1e3)*12.9898+Math.round(l*1e3)*78.233+Math.round(h*1e3)*37.719+t*53.1)*43758.5453,d=1+(u-Math.floor(u)-.5)*.3;o.setXYZ(r,c*d,l*d,h*d)}s.computeVertexNormals();const a=new M(s,C(e));return a.position.y=.3*n*(.8+t*.4),a.rotation.set(t*6.28,t*4.1,t*2.2),a.scale.set(1+t*.3,.6+t*.4,1.1-t*.3),i.add(a),i}function Rl(n=1,t=b.leafMid){const e=new ot,i=6;for(let s=0;s<i;s++){const o=s/i*Math.PI*2+s*.7,a=(.28+s*37%10/40)*n,r=new M(new Ne(.035*n,a,5),C(s%3===0?b.leafDark:s%3===1?t:b.grassDry));r.position.set(Math.cos(o)*.11*n,a*.45,Math.sin(o)*.11*n),r.rotation.set(Math.sin(o)*.35,0,Math.cos(o)*.35),e.add(r)}return e}function _v(n=1.2,t=7){const e=new ot;for(let i=0;i<t;i++){const s=i/t*Math.PI*2+i*1.3,o=.06+i*53%10/55,a=n*(.7+i*29%10/22),r=new M(new nt(.02,.028,a,5),C(i%2?b.leafDark:b.leafMid)),c=.12+i*17%10/60;if(r.position.set(Math.cos(s)*o,a/2,Math.sin(s)*o),r.rotation.set(Math.sin(s)*c,0,Math.cos(s)*c),e.add(r),i%3===0){const l=new M(new En(.045,a*.16,4,8),C(9071162));l.position.set(Math.cos(s)*(o+Math.cos(s)*c*a*.5),a*.97,Math.sin(s)*(o+Math.sin(s)*c*a*.5)),e.add(l)}}return e}function xv(n=1,t=!0){const e=new ot;for(const[i,s,o]of[[0,0,.62],[.34,.2,.44]]){const a=new M(new Rt(o*n,14,6,0,Math.PI*2,0,.5),C(b.leafLight));a.scale.y=.3,a.position.set(i*n,.03,s*n),e.add(a)}if(t){const i=new M(new Rt(.08*n,8,6),C(b.flowerYellow));i.position.set(.16*n,.14*n,.08*n),e.add(i);for(let s=0;s<5;s++){const o=s/5*Math.PI*2,a=new M(new Rt(.06*n,7,5),C(16773365));a.position.set(.16*n+Math.cos(o)*.08*n,.12*n,.08*n+Math.sin(o)*.08*n),a.scale.set(1.3,.6,1.3),e.add(a)}}return e}function Mv(n=1.1,t=[b.flowerPink,b.flowerYellow,16777215,12160992],e=.5){const i=new ot,s=.24,o=new M(new nt(n,n*1.05,s,18,1,!0),C(b.brick,{doubleSide:!0}));o.position.y=s/2,i.add(o);const a=new M(new _e(n,.05,6,20),C(b.wallCream));a.rotation.x=Math.PI/2,a.position.y=s,i.add(a);const r=new M(new nt(n*.96,n*.96,.08,18),C(b.dirt));r.position.y=s-.03,i.add(r);const c=7;for(let l=0;l<c;l++){const h=l/c*Math.PI*2+e*6.28,u=n*(.25+(l*41+e*100)%10/18),d=t[l%t.length],p=Math.cos(h)*u,g=Math.sin(h)*u,v=new M(new Rt(.2,8,6),C(b.leafDark));v.position.set(p,s+.06,g),v.scale.y=.55,i.add(v);for(let m=0;m<4;m++){const f=m/4*Math.PI*2+l,S=new M(new Rt(.075,8,6),C(d));S.position.set(p+Math.cos(f)*.12,s+.16+(m+l)%3*.05,g+Math.sin(f)*.12),S.scale.y=.8,i.add(S)}}return i}function yv(n=2.6){const t=new ot,e=C(b.metalWhite),i=.26,s=new M(new nt(n*1.03,n*1.06,i,20),C(b.concrete));s.position.y=i/2,t.add(s);const o=new M(new Rt(n,18,10,0,Math.PI*2,0,Math.PI/2),C(14676731,{opacity:.72,doubleSide:!0}));o.position.y=i,t.add(o);for(let h=0;h<8;h++){const u=new M(new _e(n,.045,5,20,Math.PI),e);u.rotation.set(0,h/8*Math.PI,0),u.position.y=i,t.add(u)}for(const h of[.34,.62,.85]){const u=n*Math.sqrt(Math.max(.02,1-h*h)),d=new M(new _e(u,.038,5,22),e);d.rotation.x=Math.PI/2,d.position.y=i+n*h,t.add(d)}for(const h of[0,1]){const u=new M(new _e(n,.09,6,18,Math.PI-.5),e);u.rotation.x=Math.PI/2,u.rotation.z=h?Math.PI+.25:.25,u.position.y=i+.04,t.add(u)}const a=new M(new Rt(.16,10,8),e);a.position.y=i+n,t.add(a);for(let h=0;h<6;h++){const u=h/6*Math.PI*2+.3,d=n*.62,p=new M(new nt(.05,.06,d,6),C(b.metalGrey));p.position.set(Math.cos(u)*n*.84,i+d/2,Math.sin(u)*n*.84),t.add(p)}const r=Jh(b.wood);r.scale.setScalar(.72),r.position.set(0,i,-n*.35),r.rotation.y=.25,t.add(r);const c=new M(new nt(.26,.2,.36,10),C(b.plantPot));c.position.set(n*.4,i+.18,n*.35),t.add(c);const l=new M(new Bs(.34,0),C(b.leafMid));return l.position.set(n*.4,i+.55,n*.35),t.add(l),t}function Jh(n=b.wood){const t=new ot,e=new M(new H(1.9,.1,.55),C(n));e.position.y=.48,t.add(e);const i=new M(new H(1.9,.5,.09),C(n));i.position.set(0,.76,-.25),i.rotation.x=-.16,t.add(i);for(const s of[-1,1]){const o=new M(new H(.1,.48,.5),C(b.metalGrey));o.position.set(s*.78,.24,0),t.add(o)}return t}function Ra(n=!1){const t=new ot,e=new M(new nt(.07,.09,3.4,8),C(b.metalGrey));e.position.y=1.7,t.add(e);const i=new M(new Rt(.3,12,10,0,Math.PI*2,0,Math.PI*.62),C(b.metalWhite));i.position.y=3.45,i.rotation.x=Math.PI,t.add(i);const s=new M(new Rt(.2,10,8),C(n?b.gold:15263968,{glow:n?.9:0}));return s.position.y=3.32,t.add(s),t}function Il(){const n=new ot,t=new M(new nt(.28,.24,.75,10),C(5208650));t.position.y=.38,n.add(t);const e=new M(new _e(.29,.04,6,14),C(b.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,n.add(e),n}function bv(){const n=new ot,t=new M(new H(1.9,.1,1),C(b.wood));t.position.y=.76,n.add(t);for(const e of[-1,1]){const i=new M(new H(.1,.76,.9),C(b.woodDark));i.position.set(e*.75,.38,0),n.add(i);const s=new M(new H(1.9,.08,.34),C(b.wood));s.position.set(0,.45,e*.78),n.add(s);const o=new M(new H(1.6,.45,.08),C(b.woodDark));o.position.set(0,.22,e*.78),n.add(o)}return n}function Bn(n=4,t=1.1,e=b.metalGrey){const i=new ot,s=Math.max(2,Math.round(n/1.2));for(let o=0;o<=s;o++){const a=new M(new nt(.05,.05,t,6),C(e));a.position.set(-n/2+o/s*n,t/2,0),i.add(a)}for(const o of[t*.35,t*.8]){const a=new M(new H(n,.06,.06),C(e));a.position.y=o,i.add(a)}return i}function Sv(n=b.wood,t=b.metalWhite){const e=new ot,i=new M(new nt(.06,.06,1.6,6),C(b.woodDark));i.position.y=.8,e.add(i);const s=new M(new H(1.1,.7,.08),C(n));s.position.y=1.5,e.add(s);const o=new M(new H(.85,.12,.02),C(t));return o.position.set(0,1.62,.05),e.add(o),e}function $h(n=1){const t=new ot,e=Xe(16777215,.92),i=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[s,o,a,r]of i){const c=new M(new Rt(r*n,10,8),e);c.position.set(s*n,o*n,a*n),t.add(c)}return t}function wv(n,t,e,i){const s=new ot,o=9,a=n/o,r=.35,c=1.15,l=new ot;l.rotation.z=Math.PI/2;for(let d=0;d<o;d++){const p=new M(new nt(t,t,a*1.02,10,1,!0,r,c),C(d%2===0?e:i,{doubleSide:!0}));p.position.y=-n/2+a*(d+.5),l.add(p)}s.add(l);const h=Math.sin(r)*t,u=Math.cos(r)*t;for(let d=0;d<o;d++){const p=new M(new Rt(a*.36,8,6),C(d%2===0?e:i));p.position.set(-n/2+a*(d+.5),h-a*.2,u),p.scale.set(1,1.15,.7),s.add(p)}return s}function Fr(n=b.fabricRed,t={}){const e=new ot;e.userData.peca="quiosque";const i=t.tipo??"simples",s=b.wallCream,o=C(b.wood),a=C(b.woodDark),r=new M(new H(2.8,.16,1.9),a);r.position.y=.08,e.add(r);const c=new M(new H(2.35,1.7,1.4),C(s));c.position.set(0,1.01,-.05),e.add(c);for(const x of[-1,1]){const _=new M(new H(.26,1.7,.14),o);_.position.set(x*1.1,.99,.68),e.add(_)}const l=new M(new H(2.5,.22,.16),o);l.position.set(0,1.715,.68),e.add(l);const h=new M(new H(1.82,.44,.06),C(5981750));h.position.set(0,1.42,.66),e.add(h);const u=new M(new H(2.5,.14,.78),o);u.position.set(0,1.12,.94),e.add(u);const d=new M(new nt(.075,.075,2.5,10),a);d.rotation.z=Math.PI/2,d.position.set(0,1.12,1.32),e.add(d);for(const x of[-1,1]){const _=new M(new nt(.05,.05,1.05,8),C(b.metalWhite));_.position.set(x*1.18,.6,1.24),e.add(_)}const p=new M(new H(2.55,.16,1.55),a);p.position.set(0,1.92,-.05),e.add(p);const g=wv(2.5,.44,n,s);g.position.set(0,1.54,.62),e.add(g);const v=t.texto??(i==="sorvete"?"Sorvete":i==="suco"?"Sucos":""),m=new M(new H(1.75,.5,.12),C(n));m.position.set(0,2.3,-.05),e.add(m);const f=new M(new H(1.9,.62,.08),C(s));if(f.position.set(0,2.3,-.09),e.add(f),v){const x=vc(v,1.5,.34);x.position.set(0,2.3,.02),e.add(x)}if(i==="sorvete"){const x=Br(b.morango);x.scale.setScalar(2.6),x.position.set(0,2.78,-.05),e.add(x);const _=new M(new H(1.24,.16,.56),C(b.metalWhite));_.position.set(-.58,1.26,1.06),e.add(_),[b.morango,b.maracuja,b.chocolate].forEach((E,A)=>{const R=new M(new nt(.15,.13,.22,10),C(b.metalWhite));R.position.set(-1+A*.36,1.29,1.06),e.add(R);const w=new M(new Rt(.14,10,8),C(E));w.position.set(-1+A*.36,1.42,1.06),w.scale.y=.8,e.add(w)});for(let E=0;E<3;E++){const A=new M(new Ne(.1,.3,10),C(14197852));A.position.set(.72,1.34+E*.07,1.04+E*.02),A.rotation.x=Math.PI,e.add(A)}}else if(i==="suco"){const x=new M(new Rt(.32,12,10),C(b.laranja));x.position.set(0,2.85,-.05),e.add(x);const _=new M(new Rt(.13,8,6),C(b.leafMid));_.position.set(.14,3.12,-.05),_.scale.set(1.5,.4,.8),_.rotation.z=.5,e.add(_),[b.laranja,b.limao].forEach((y,D)=>{const F=new M(new nt(.15,.14,.42,12,1,!0),C(b.glass,{opacity:.45,doubleSide:!0}));F.position.set(-.78+D*.42,1.4,1.06),e.add(F);const z=new M(new nt(.13,.12,.28,12),C(y));z.position.set(-.78+D*.42,1.33,1.06),e.add(z);const V=new M(new nt(.025,.025,.12,6),C(b.metalGrey));V.position.set(-.78+D*.42,1.26,1.2),V.rotation.x=Math.PI/2,e.add(V)});const E=new M(new nt(.22,.17,.12,12),C(b.plantPot));E.position.set(.42,1.25,1.06),e.add(E);const A=[[.32,1.34,1.03,b.laranja],[.52,1.34,1.08,b.limao],[.42,1.4,1.05,b.morango]];for(const[y,D,F,z]of A){const V=new M(new Rt(.1,10,8),C(z));V.position.set(y,D,F),e.add(V)}const R=new M(new nt(.09,.07,.2,10),C(s));R.position.set(.95,1.29,1.06),e.add(R),[b.morango,b.limao,b.fabricBlue].forEach((y,D)=>{const F=new M(new nt(.014,.014,.34,6),C(y));F.position.set(.93+D*.03,1.44,1.06-D*.02),F.rotation.z=(D-1)*.18,e.add(F)})}const S=new M(new H(.06,.62,.5),C(3551276));S.position.set(1.16,1.3,.15),e.add(S);for(let x=0;x<3;x++){const _=new M(new H(.02,.045,.3-x*.06),C(s));_.position.set(1.205,1.46-x*.16,.15),e.add(_)}return e}function Or(n=4,t=6,e=4,i=b.wallCream,s=b.roofTile,o=b.glass){const a=new ot,r=new M(new H(n,t,e),C(i));r.position.y=t/2,a.add(r);const c=new M(new H(n+.3,.35,e+.3),C(s));c.position.y=t+.17,a.add(c);const l=Math.max(1,Math.floor(n/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let u=0;u<h;u++)for(let d=0;d<l;d++){const p=new M(new H(.65,.8,.06),C(o,{glow:.15})),g=-n/2+n/l*(d+.5),v=.9+t/h*u;p.position.set(g,v,e/2+.02),a.add(p);const m=p.clone();m.position.z=-e/2-.02,a.add(m)}return a}function Ev(n=b.mesaVerde){const t=new ot,e=2.6,i=1.4,s=.76,o=C(16054261),a=new M(new H(e,.06,i),C(n));a.position.y=s,t.add(a);for(const l of[-i/2+.05,i/2-.05,0]){const h=new M(new H(e-.02,.008,.05),o);h.position.set(0,s+.032,l),t.add(h)}for(const l of[-e/2+.04,e/2-.04]){const h=new M(new H(.05,.008,i-.02),o);h.position.set(l,s+.032,0),t.add(h)}const r=new M(new H(.03,.19,i+.16),C(16514556,{opacity:.72,doubleSide:!0}));r.position.y=s+.13,t.add(r);const c=new M(new H(.045,.035,i+.18),C(16777215));c.position.y=s+.225,t.add(c);for(const l of[-1.5599999999999998/2,(i+.16)/2]){const h=new M(new nt(.022,.022,.24,8),C(b.metalGrey));h.position.set(0,s+.12,l),t.add(h)}for(const l of[-e/2+.22,e/2-.22]){for(const u of[-i/2+.18,i/2-.18]){const d=new M(new nt(.035,.045,s,8),C(b.metalGrey));d.position.set(l,s/2,u),t.add(d)}const h=new M(new H(.05,.05,i-.36),C(b.metalGrey));h.position.set(l,s*.35,0),t.add(h)}return t}function Kh(){const n=new M(new Rt(.055,12,10),C(16775398,{glow:.12}));return n.castShadow=!0,n}function Bo(n=b.metalRed){const t=new ot,e=new M(new nt(.17,.17,.035,20),C(n));e.rotation.x=Math.PI/2,t.add(e);const i=new M(new nt(.185,.185,.022,20),C(b.wood));i.rotation.x=Math.PI/2,t.add(i);const s=new M(new En(.035,.16,4,8),C(b.woodDark));return s.position.y=-.25,t.add(s),t.traverse(o=>{const a=o;a.isMesh&&(a.castShadow=!0)}),t}function Qh(n=b.frisbee){const t=new M(new nt(.28,.24,.07,20),C(n));return t.castShadow=!0,t}function tu(n=1){const t=new ot,e=C(b.heart,{glow:.35});for(const s of[-1,1]){const o=new M(new Rt(.16*n,10,8),e);o.position.set(s*.13*n,.1*n,0),t.add(o)}const i=new M(new Ne(.22*n,.34*n,10),e);return i.position.y=-.1*n,i.rotation.x=Math.PI,t.add(i),t}function Ia(n=16184040){const t=new ot,e=new M(new Rt(.22,10,8),C(n));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const i=new M(new nt(.06,.08,.24,8),C(n));i.position.set(0,.28,.14),t.add(i);const s=new M(new Rt(.11,10,8),C(n));s.position.set(0,.4,.16),t.add(s);const o=new M(new Ne(.05,.14,6),C(b.gold));return o.position.set(0,.39,.28),o.rotation.x=Math.PI/2,t.add(o),t}function zr(n=b.wallCream){const t=new ot;t.userData.patins=!0;const e=.045,i=new M(new H(.13,.15,.26),C(n));i.position.set(0,e*2+.115,.01),t.add(i);const s=new M(new H(.125,.13,.15),C(n));s.position.set(0,e*2+.25,-.04),t.add(s);const o=new M(new H(.135,.04,.13),C(b.frisbee));o.position.set(0,e*2+.235,.02),t.add(o);const a=new M(new H(.1,.05,.28),C(b.metalGrey));a.position.set(0,e*2+.015,.01),t.add(a);for(const r of[-1,1])for(const c of[-1,1]){const l=new M(new nt(e,e,.035,10),C(b.frisbee));l.rotation.z=Math.PI/2,l.position.set(r*.062,e,.01+c*.095),t.add(l)}return t}function Tv(n=b.fabricBlue){const t=new ot,e=7.4,i=4.4,s=2.9,o=C(b.wallCream),a=C(b.wood),r=C(b.woodDark),c=C(b.metalWhite),l=new M(new H(e+1.6,.18,i+1.4),C(b.concrete));l.position.set(.4,.09,.3),t.add(l);const h=new M(new H(e,s,.26),o);h.position.set(0,.18+s/2,-i/2),t.add(h);for(const y of[-1,1]){const D=new M(new H(.26,s,i),o);D.position.set(y*(e/2-.13),.18+s/2,0),t.add(D)}const u=new M(new H(e,.6,.3),r);u.position.set(0,.48,i/2-.1),t.add(u);const d=C(b.glass,{opacity:.5,doubleSide:!0}),p=3,g=e-.5,v=g/p-.16;for(let y=0;y<p;y++){const D=-g/2+g/p*(y+.5),F=new M(new H(v,1.75,.08),d);F.position.set(D,1.68,i/2-.1),t.add(F)}for(let y=0;y<=p;y++){const D=-g/2+g/p*y,F=new M(new H(.14,2.05,.22),c);F.position.set(D,1.68,i/2-.1),t.add(F)}const m=new M(new H(e,.18,.24),c);m.position.set(0,2.68,i/2-.1),t.add(m);for(const[y,D]of[[1.15,[b.morango,b.fabricBlue,b.gold]],[1.95,[b.maracuja,b.wallCream]]]){const F=new M(new H(e-1.2,.1,.6),a);F.position.set(0,y,i/2-.75),t.add(F),D.forEach((z,V)=>{const q=new ot;for(const J of[-1,1]){const st=zr(z);st.position.x=J*.09,q.add(st)}q.scale.setScalar(.8),q.position.set((V-(D.length-1)/2)*1.5,y+.05,i/2-.75),q.rotation.y=.3,t.add(q)})}const f=new M(new H(e+1.1,.24,i+1.3),r);f.position.set(0,s+.42,.35),f.rotation.x=-.07,t.add(f);const S=new M(new H(e+1.34,.08,i+1.54),c);S.position.set(0,s+.29,.35),S.rotation.x=-.07,t.add(S);const x=new M(new H(e+1.34,.74,.22),C(n));x.position.set(0,s+.46,i/2+1.18),t.add(x);const _=vc("Patins",3.2,.46);_.position.set(0,s+.46,i/2+1.31),t.add(_);for(const y of[-1,1]){const D=new M(new nt(.09,.09,s+.3,8),c);D.position.set(y*(e/2+.35),(s+.3)/2,i/2+.62),t.add(D)}const P=e/2+.95,E=new M(new H(1.15,.16,3),a);E.position.set(P,1.06,.2),t.add(E);const A=new M(new nt(.08,.08,3,10),r);A.position.set(P+.55,1.06,.2),t.add(A);const R=new M(new H(.9,.9,2.8),o);R.position.set(P-.1,.6,.2),t.add(R);const w=new M(new H(1.7,.16,3.2),C(n));w.position.set(P+.1,2.35,.2),t.add(w);for(const y of[-1.2,1.5]){const D=new M(new nt(.07,.07,2.35,8),c);D.position.set(P+.6,1.17,.2+y),t.add(D)}return[b.morango,b.gold].forEach((y,D)=>{const F=new ot;for(const z of[-1,1]){const V=zr(y);V.position.x=z*.09,F.add(V)}F.position.set(P,1.14,-.55+D*1.4),F.rotation.y=Math.PI/2+.2,t.add(F)}),t}function Ll(){const n=new ot,t=new M(new H(.34,.05,.34),C(b.frisbee));t.position.y=.025,n.add(t);const e=new M(new Ne(.15,.45,10),C(b.frisbee));e.position.y=.26,n.add(e);const i=new M(new nt(.1,.12,.09,10),C(16777215));return i.position.y=.28,n.add(i),n}function Av(n,t,e=1.5){const i=new ot,s=C(10475752),o=.12,a=new M(new H(n,o,t),C(4165552));a.position.y=-e,a.receiveShadow=!0,i.add(a);for(const[r,c,l,h]of[[n,o,0,-t/2],[n,o,0,t/2],[o,t,-n/2,0],[o,t,n/2,0]]){const u=new M(new H(r,e,c),s);u.position.set(l,-e/2,h),u.receiveShadow=!0,i.add(u)}for(const[r,c,l,h]of[[n+.3,.18,0,-t/2-.12],[n+.3,.18,0,t/2+.12],[.18,t+.3,-n/2-.12,0],[.18,t+.3,n/2+.12,0]]){const u=new M(new H(r,.06,c),C(4951989));u.position.set(l,.02,h),i.add(u)}return i}function Cv(n,t){const e=new M(new Ue(n,t,12,8),new kh({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function Dl(n=b.fabricBlue){const t=new ot,e=new M(new H(.68,.07,1.7),C(b.metalWhite));e.position.y=.36,t.add(e);const i=new M(new H(.6,.06,1.5),C(n));i.position.y=.42,t.add(i);const s=new M(new H(.6,.06,.7),C(n));s.position.set(0,.6,-.75),s.rotation.x=-.75,t.add(s);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new M(new nt(.035,.035,.36,6),C(b.metalWhite));r.position.set(o*.3,.18,a*.72),t.add(r)}return t}function Ul(n=b.fabricRed){const t=new ot,e=new M(new nt(.32,.36,.12,12),C(b.concrete));e.position.y=.06,t.add(e);const i=new M(new nt(.045,.045,2.4,8),C(b.wood));i.position.y=1.2,t.add(i);const s=new M(new Ne(1.15,.5,12),C(n));s.position.y=2.35,t.add(s);const o=new M(new Ne(1.17,.18,12,1,!0),C(16777215,{doubleSide:!0}));o.position.y=2.2,t.add(o);const a=new M(new Rt(.07,8,6),C(b.gold));return a.position.y=2.62,t.add(a),t}function Pv(){const n=new ot;for(const t of[-.24,.24]){const e=new M(new _e(.22,.035,6,14,Math.PI),C(b.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),n.add(e);const i=new M(new nt(.035,.035,1.5,8),C(b.metalGrey));i.position.set(t,.05,-.44),n.add(i)}for(let t=0;t<3;t++){const e=new M(new H(.5,.05,.1),C(b.metalGrey));e.position.set(0,-.15-t*.34,-.44),n.add(e)}return n}function La(n=b.frisbee){const t=new ot,e=new M(new _e(.42,.16,10,20),C(n));e.rotation.x=Math.PI/2,t.add(e);for(let i=0;i<4;i++){const s=i/4*Math.PI*2+Math.PI/4,o=new M(new _e(.42,.165,10,6,Math.PI/5),C(16777215));o.rotation.set(Math.PI/2,0,s),t.add(o)}return t}function Rv(){const n=new ot,t=new M(new nt(.22,.26,.1,12),C(b.concrete));t.position.y=.05,n.add(t);const e=new M(new nt(.05,.05,2.2,8),C(b.metalGrey));e.position.y=1.1,n.add(e);const i=new M(new H(.5,.07,.07),C(b.metalGrey));i.position.set(.22,2.16,0),n.add(i);const s=new M(new nt(.16,.12,.1,12),C(b.metalWhite));return s.position.set(.44,2.08,0),n.add(s),n}function Iv(){const n=new ot,t=new M(new H(.7,.8,.7),C(b.concrete));t.position.y=.4,n.add(t);const e=new M(new H(.62,.1,2.4),C(15791350));e.position.set(0,.85,1),n.add(e);for(const i of[-.36,.36]){const s=new M(new _e(.35,.04,6,14,Math.PI),C(b.metalGrey));s.position.set(i,.9,.1),s.rotation.set(0,Math.PI/2,0),n.add(s)}return n}function Br(n=b.flowerPink){const t=new ot,e=new M(new Ne(.075,.22,10),C(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const i=new M(new Rt(.085,10,8),C(n));i.position.y=.13,t.add(i);const s=new M(new Rt(.06,8,7),C(n));return s.position.set(.03,.22,-.02),t.add(s),t}function Nl(n=b.laranja){const t=new ot;t.userData.suco=!0;const e=new M(new nt(.088,.062,.26,12),C(n));e.position.y=.13,t.add(e);const i=new M(new nt(.095,.09,.035,12),C(16645110));i.position.y=.25,t.add(i);const s=new M(new nt(.066,.066,.025,12),C(16645110));s.position.y=.012,t.add(s);const o=new M(new nt(.012,.012,.32,6),C(16645110));o.position.set(.04,.31,.014),o.rotation.z=-.34,t.add(o);const a=new M(new nt(.052,.052,.014,10),C(b.gold));return a.position.set(-.085,.26,0),a.rotation.x=Math.PI/2,a.rotation.z=.3,t.add(a),t}function Fl(n=b.metalGrey){const t=new ot,e=new M(new nt(.07,.09,1.5,10),C(n));e.position.y=.75,t.add(e);const i=new M(new nt(.52,.38,.42,14,1,!0),C(n));i.position.y=1,t.add(i);const s=new M(new _e(.62,.045,6,20),C(n));s.position.y=1.72,s.rotation.x=Math.PI/2,t.add(s);const o=new M(new nt(.1,.1,.3,8),C(n));o.position.y=1.9,t.add(o);for(let a=0;a<10;a++){const r=a/10*Math.PI*2,c=new M(new nt(.015,.015,.62,4),C(13226198));c.position.set(Math.cos(r)*.5,1.4,Math.sin(r)*.5),t.add(c)}return t}function Lv(n=b.frisbee,t=1.9,e=.62){const i=new ot,s=e+.34,o=new M(new nt(.06,.08,t+e,10),C(n));o.position.set(-s,(t+e)/2,0),i.add(o);const a=new M(new nt(.24,.3,.12,12),C(b.metalGrey));a.position.set(-s,.06,0),i.add(a);const r=new M(new H(.36,.07,.07),C(n));r.position.set(-s+.18,t,0),i.add(r);const c=new M(new _e(e,.06,8,26),C(n));c.position.y=t,i.add(c);for(const l of[-.9,-.3,.3,.9]){const h=new M(new H(.05,.34,.02),Xe(b.gold));h.position.set(Math.sin(l)*e,t-Math.cos(l)*e-.17,0),i.add(h)}return i.traverse(l=>{const h=l;h.isMesh&&(h.castShadow=!0)}),i.userData.aro=c,i}function Dv(n=b.frisbee){const t=new ot,e=Xe(n,.92),i=new M(new _e(.86,.075,8,28),e);i.rotation.x=-Math.PI/2,i.position.y=.08,t.add(i);const s=new M(new nt(.15,.15,.07,14),e);s.position.y=.08,t.add(s);for(let a=0;a<4;a++){const r=a/4*Math.PI*2+Math.PI/4,c=new M(new H(.1,.07,.36),e);c.rotation.y=r,c.position.set(Math.sin(r)*1.3,.08,Math.cos(r)*1.3),t.add(c)}const o=new M(new H(.07,1.5,.07),e);return o.position.y=.75,t.add(o),t}function Uv(){const n=new ot;for(const i of[-.8,.8]){const s=new M(new H(.12,1.5,.12),C(b.woodDark));s.position.set(i,.75,0),n.add(s)}const t=new M(new H(2,1.2,.12),C(b.wood));t.position.y=2,n.add(t);const e=new M(new H(1.8,.22,.03),C(b.frisbee));e.position.set(0,2.45,.08),n.add(e);for(const i of[-.45,.45]){const s=new M(new H(.55,.6,.03),C(2830136));s.position.set(i,1.9,.08),n.add(s)}return n}function Nv(n=4){const t=new ot;t.userData.peca="arquibancada";const e=.5;for(let i=0;i<3;i++){const s=.25+i*.34,o=new M(new H(n,.16,e+.04),C(i%2===0?b.metalWhite:b.metalGrey));o.position.set(0,s,-i*e),t.add(o);const a=new M(new H(n-.08,s,.1),C(b.metalGrey));a.position.set(0,s/2,-i*e-.19),t.add(a)}return t}function Fv(){const n=new ot,t=new M(new H(.42,.95,.36),C(b.concrete));t.position.y=.48,n.add(t);const e=new M(new nt(.17,.14,.12,12),C(b.metalWhite));e.position.set(0,1,.05),n.add(e);const i=new M(new nt(.03,.03,.16,8),C(b.metalGrey));return i.position.set(0,1.12,-.06),i.rotation.x=.5,n.add(i),n}function Ov(){const n=new ot,t=new M(new H(.5,.4,.34),C(4871528));t.position.y=.2,n.add(t);const e=new M(new _e(.16,.028,6,14,Math.PI),C(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,n.add(e),[b.frisbee,6271190,16767070].forEach((s,o)=>{const a=new M(new nt(.2,.18,.05,16),C(s));a.position.set(.34+o*.02,.06+o*.06,.22),a.rotation.z=.12,n.add(a)}),n}function zv(){const n=new ot,t=new M(new nt(.1,.14,5.5,8),C(b.metalGrey));t.position.y=2.75,n.add(t);const e=new M(new H(.9,.1,.1),C(b.metalGrey));e.position.set(.35,5.5,0),n.add(e);for(const i of[.1,.6]){const s=new M(new H(.42,.3,.22),C(3883600));s.position.set(i,5.62,0),s.rotation.z=-.35,n.add(s);const o=new M(new H(.36,.24,.03),C(16773324,{glow:.25}));o.position.set(i+.04,5.52,0),o.rotation.z=-.35,n.add(o)}return n}function Bv(){const n=new ot,t=new M(new nt(.05,.06,3,8),C(b.metalGrey));t.position.y=1.5,n.add(t);const e=new ot;return e.position.y=2.9,[b.frisbee,16777215,b.frisbee,16777215].forEach((s,o)=>{const a=.26-o*.04,r=.22-o*.04,c=new M(new nt(a,r,.3,12,1,!0),C(s,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+o*.3,e.add(c)}),n.add(e),n.userData.manga=e,n}function vc(n,t,e,i="#ffffff"){const s=document.createElement("canvas");s.width=384,s.height=Math.max(64,Math.round(384*e/t));const o=s.getContext("2d");o&&(o.clearRect(0,0,s.width,s.height),o.fillStyle=i,o.font=`bold ${Math.round(s.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(n,s.width/2,s.height/2+4));const a=new Gd(s);return a.colorSpace=nn,new M(new Ue(t,e),new qo({map:a,transparent:!0}))}function Ol(n,t=b.fabricBlue,e="#ffffff"){const i=new ot,s=new M(new nt(.08,.08,2.4,8),C(b.metalGrey));s.position.y=1.2,i.add(s);const o=2.1,a=.9,r=new M(new H(o,a,.1),C(t));r.position.y=2.45,i.add(r);const c=new M(new H(o+.12,a+.12,.06),C(b.metalWhite));c.position.set(0,2.45,-.03),i.add(c);const l=vc(n,o*.86,a*.68,e);return l.position.set(0,2.45,.06),i.add(l),i}function kv(n=4161494){const t=new ot,e=8.4,i=2.6,s=2.5,o=new M(new H(e,i,s),C(n));o.position.y=1.55,t.add(o);const a=new M(new H(e-.2,.22,s-.15),C(b.metalWhite));a.position.y=2.9,t.add(a);const r=new M(new H(e+.04,.3,s+.04),C(b.metalWhite));r.position.y=.6,t.add(r);for(const h of[s/2+.02,-s/2-.02])for(let u=0;u<4;u++){const d=new M(new H(1.5,.9,.05),C(b.glass,{glow:.12}));d.position.set(-e/2+1.4+u*1.85,2.1,h),t.add(d)}for(const[h,u]of[[e/2+.02,0],[-e/2-.02,0]]){const d=new M(new H(.05,1.1,s-.5),C(b.glass,{glow:.12}));d.position.set(h,2.1,0),d.rotation.y=u,t.add(d)}const c=new M(new H(.06,1.9,1),C(2831424));c.position.set(e/2-1.6,1.2,s/2+.02),t.add(c);const l=new M(new H(1.6,.34,.05),C(2040361));l.position.set(e/2-.4,2.75,s/2+.02),t.add(l);for(const[h,u]of[[e/2-1.9,s/2],[e/2-1.9,-s/2],[-e/2+1.6,s/2],[-e/2+1.6,-s/2]]){const d=new M(new nt(.55,.55,.35,14),C(2237482));d.position.set(h,.5,u),d.rotation.x=Math.PI/2,t.add(d);const p=new M(new nt(.24,.24,.38,12),C(b.metalGrey));p.position.set(h,.5,u),p.rotation.x=Math.PI/2,t.add(p)}return t}function Vv(n=b.metalGrey){const t=new ot;for(const o of[-1.5,1.5]){const a=new M(new nt(.07,.07,2.5,8),C(n));a.position.set(o,1.25,-.6),t.add(a)}const e=new M(new H(3.6,.12,1.6),C(n));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const i=new M(new H(3.6,1.6,.08),C(b.glass,{glow:.08}));i.position.set(0,1.35,-1.15),t.add(i);const s=new M(new H(3,.1,.4),C(b.wood));s.position.set(0,.5,-.9),t.add(s);for(const o of[-1.2,1.2]){const a=new M(new H(.08,.5,.36),C(n));a.position.set(o,.25,-.9),t.add(a)}return t}function Hv(n){const t=new ot,e=n.headR,i=e*1.07,s=Math.PI*.54,o=e*.06,a=new M(new Rt(i,18,12,0,Math.PI*2,0,s),C(b.roupaLa));a.position.y=o,a.scale.y=1.16,t.add(a);const r=o+i*Math.cos(s)*1.16,c=i*Math.sin(s),l=new M(new nt(c*1.03,c*1.03,e*.26,18),C(b.roupaLaBarra));l.position.y=r,t.add(l);const h=new M(new Rt(e*.2,10,8),C(b.roupaLaBarra));return h.position.y=o+i*1.16,t.add(h),t}function Gv(n){const t=new ot,e=new M(new nt(n.h*.05*n.w,n.h*.055*n.w,n.h*.08,12),C(b.roupaBotaCano));e.position.y=-n.legH+n.h*.075,t.add(e);const i=new M(new nt(n.h*.058*n.w,n.h*.058*n.w,n.h*.018,12),C(b.roupaBota));return i.position.y=-n.legH+n.h*.113,t.add(i),t}function qn(n,t,e=t){const i=new ot;for(const o of[-1,1]){const a=new M(new Rt(n*.86,9,7),C(t));a.position.x=o*n*.86,a.scale.set(1.05,.72,.42),i.add(a);const r=new M(new H(n*.34,n*1.5,n*.14),C(t));r.position.set(o*n*.42,-n*.95,0),r.rotation.z=o*.32,i.add(r)}const s=new M(new Rt(n*.3,8,6),C(e));return s.scale.z=.7,i.add(s),i}function si(n,t,e,i=.85){const s=new ot,o=C(e),a=t*.6,r=Math.max(8,Math.ceil(2*Math.PI*n/(a*1.25)));for(let c=0;c<r;c++){const l=c/r*Math.PI*2,h=new M(new Rt(a,7,6),o);h.position.set(Math.sin(l)*n,0,Math.cos(l)*n*i),h.scale.set(1,.88,.34),h.rotation.y=l,s.add(h)}return s}function zl(n,t,e,i=3){const s=new ot,o=C(e),a=t/i,r=Math.hypot(n,a);for(let c=0;c<i;c++)for(const l of[-1,1]){const h=new M(new H(r,t*.07,t*.05),o);h.position.y=-t/2+a*(c+.5),h.rotation.z=l*Math.atan2(a,n),s.add(h)}return s}function eu(n,t){const e=new M(new Rt(n,12,10),C(t));return e.scale.set(1,.82,.92),e}function qv(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=.85,r=C(b.vestidoRosa),c=C(b.vestidoRenda,{doubleSide:!0}),l=C(b.vestidoFita),h=new M(new nt(o*1.1,o*1.06,e*.035,18,1,!0),c);h.position.y=s+n.torsoH*.78,h.scale.z=a,t.add(h);for(const _ of[-1,1]){const P=new M(new _e(e*.042*i,e*.016,6,14),c);P.position.set(_*e*.1*i,s+n.torsoH*.84,0),P.rotation.set(Math.PI/2,0,_*.3),P.scale.z=.8,t.add(P)}const u=qn(e*.04,b.vestidoFita,b.vestidoRenda);u.position.set(0,s+n.torsoH*.62,o*.9),t.add(u);const d=new M(new nt(o*1.08,o*1.08,e*.03,18,1,!0),l);d.position.y=s+n.torsoH*.16,d.scale.z=a,t.add(d);const p=qn(e*.036,b.vestidoRosa,b.vestidoFita);p.position.set(0,s+n.torsoH*.14,o*.92),t.add(p);const g=s+n.torsoH*.1,v=s-e*.13,m=o*2,f=new M(new nt(o*1.02,m*.82,g-v-e*.05,20,1,!0),r);f.position.y=(g+v+e*.05)/2,f.scale.z=a,t.add(f);const S=new M(new nt(m*.78,m,e*.08,20,1,!0),r);S.position.y=v+e*.04,S.scale.z=a,t.add(S);const x=new M(new nt(m*1.04,m*1.12,e*.032,20,1,!0),c);x.position.y=v,x.scale.z=a,t.add(x);for(const _ of[-.9,0,.9]){const P=qn(e*.022,b.vestidoFita,b.vestidoRenda);P.position.set(Math.sin(_)*m*.92,v+e*.055,Math.cos(_)*m*.92*a),P.rotation.y=_,t.add(P)}return t}function Wv(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=e*.1*i,c=.85,l=C(b.maidCreme),h=C(b.maidCreme,{doubleSide:!0}),u=C(b.maidFita),d=s+n.torsoH*.12,p=s-e*.14,g=o*2,v=new M(new nt(o*1.04,g,d-p,20,1,!0),C(b.maidPreto,{doubleSide:!0}));v.position.y=(d+p)/2,v.scale.z=c,t.add(v);const m=new M(new nt(g*1.01,g*1.06,e*.038,20,1,!0),h);m.position.y=p+e*.016,m.scale.z=c,t.add(m);const f=si(g*1.04,e*.03,b.maidCreme,c);f.position.y=p-e*.008,t.add(f);const S=s+n.torsoH*.16,x=s-e*.045,_=new M(new nt(o*1.06,g*.86,S-x,16,1,!0,-1.15,2.3),h);_.position.y=(S+x)/2,_.scale.z=c,t.add(_);const P=si(g*.88,e*.034,b.maidCreme,c);P.position.y=x,t.add(P);const E=s+n.torsoH*.2,A=new M(new nt(o*1.1,o*1.1,e*.055,18,1,!0),h);A.position.y=E,A.scale.z=c,t.add(A);for(const z of[-1,1]){const V=zl(e*.03,e*.045,b.maidFita,3);V.position.set(z*o*.5,E,o*.92),t.add(V);const q=qn(e*.017,b.maidFita);q.position.set(z*o*.5,E-e*.028,o*.96),t.add(q)}for(const z of[-1,1]){const V=new M(new H(e*.055*i,a-E,e*.02),l);V.position.set(z*o*.62,(a+E)/2,o*.7),V.rotation.y=-z*.5,t.add(V);const q=new M(new H(e*.022*i,a-E,e*.03),h);q.position.set(z*o*.98,(a+E)/2,o*.4),q.rotation.y=-z*.95,t.add(q)}const R=new M(new H(o*.9,n.torsoH*.24,e*.014),l);R.position.set(0,s+n.torsoH*.4,o*.8),t.add(R);const w=zl(o*.55,n.torsoH*.2,b.maidFita,4);w.position.set(0,s+n.torsoH*.4,o*.87),t.add(w);const y=s+n.torsoH*.68;for(const z of[-1,1]){const V=new M(new H(e*.1*i,n.torsoH*.46,e*.012),l);V.position.set(z*e*.06*i,y,o*.82),V.rotation.z=z*.34,t.add(V);const q=new M(new H(e*.007,n.torsoH*.4,e*.006),u);q.position.set(z*e*.088*i,y+n.torsoH*.02,o*.88),q.rotation.z=z*.34,t.add(q);const J=new M(new H(e*.075*i,e*.012,o*1.5),l);J.position.set(z*r*.86,a+e*.012,0),J.rotation.z=z*.16,t.add(J)}const D=new M(new H(e*.24*i,n.torsoH*.36,e*.014),l);D.position.set(0,s+n.torsoH*.74,-o*.8),t.add(D);const F=new M(new H(e*.24*i,e*.011,e*.006),u);F.position.set(0,s+n.torsoH*.57,-o*.87),t.add(F);for(const z of[-1,1]){const V=eu(e*.055*i,b.maidCreme);V.position.set(z*r,a-e*.012,0),t.add(V)}return t}function Xv(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=e*.1*i,c=.85,l=C(b.maidCreme),h=C(b.maidCreme,{doubleSide:!0}),u=C(b.maidFita),d=s+n.torsoH*.12,p=s-e*.14,g=o*2,v=new M(new nt(o*1.04,g,d-p,20,1,!0),C(b.maidPreto,{doubleSide:!0}));v.position.y=(d+p)/2,v.scale.z=c,t.add(v);const m=si(g*1.02,e*.036,b.maidPreto,c);m.position.y=p+e*.004,t.add(m);const f=s+n.torsoH*.26,S=s-e*.055,x=new M(new nt(o*1.04,g*.9,f-S,16,1,!0,-1.2,2.4),h);x.position.y=(f+S)/2,x.scale.z=c,t.add(x);const _=si(g*.92,e*.036,b.maidCreme,c);_.position.y=S,t.add(_);const P=new ot,E=new M(new Rt(e*.011,8,6),u);E.scale.set(1,1.15,.3),P.add(E);for(let $=0;$<3;$++){const at=new M(new Rt(e*.005,6,5),u);at.position.set(($-1)*e*.012,e*.016,0),at.scale.z=.3,P.add(at)}P.position.set(g*.42,s-e*.005,g*.72*c),P.rotation.y=.5,t.add(P);const A=n.torsoH*.3,R=f+A*.5,w=o*1.62,y=o*.84,D=new M(new H(w,A,e*.014),l);D.position.set(0,R,y),t.add(D);for(const $ of[-1,1]){const at=new M(new Ne(e*.028,e*.045,4),l);at.position.set($*w*.32,R+A*.5+e*.019,y),at.rotation.set(0,Math.PI/4,$*.26),at.scale.set(1,1,.3),t.add(at)}for(const $ of[-1,1]){const at=new M(new _e(e*.014,e*.004,5,10,Math.PI),u);at.position.set($*w*.26,R+A*.08,y+e*.009),at.rotation.z=Math.PI,t.add(at)}const F=new M(new _e(e*.009,e*.003,5,10,Math.PI),u);F.position.set(0,R-A*.12,y+e*.009),F.rotation.z=Math.PI,t.add(F);for(const $ of[-1,1])for(let at=0;at<3;at++){const Z=new M(new H(e*.036,e*.0035,e*.0035),u);Z.position.set($*w*.4,R-A*.05+(at-1)*e*.012,y+e*.008),Z.rotation.z=$*(at-1)*.24,t.add(Z)}const z=qn(e*.032,b.maidCreme);z.position.set(-o*1.25,s+n.torsoH*.16,o*.5),z.rotation.y=-.55,t.add(z);const V=new M(new nt(o*.6,o*1.3,e*.018,20,1,!0),h);V.position.y=a+e*.008,V.scale.z=c,t.add(V);const q=si(o*1.3,e*.02,b.maidCreme,c);q.position.y=a-e*.006,t.add(q);const J=qn(e*.05,b.maidLacoVermelho);J.position.set(0,s+n.torsoH*.78,o*1.12),t.add(J);const st=new M(new Rt(e*.016,10,8),C(b.gold,{glow:.2}));st.position.set(0,s+n.torsoH*.71,o*1.16),t.add(st);for(const $ of[-1,1]){const at=eu(e*.056*i,b.maidPreto);at.position.set($*r,a-e*.012,0),t.add(at);const Z=si(e*.05*i,e*.024,b.maidCreme,1);Z.position.set($*r,a-e*.058,0),t.add(Z)}return t}function jv(n,t){const e=new ot,i=C(t);for(const o of[-1,1]){const a=new M(new Rt(n*.56,8,6),i);a.position.set(o*n*.44,n*.34,0),a.scale.z=.34,e.add(a)}const s=new M(new Ne(n*.78,n*1.2,10),i);return s.position.y=-n*.34,s.rotation.x=Math.PI,s.scale.z=.34,e.add(s),e}function Yv(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=.85,c=C(b.waRosa),l=C(b.waRosa,{doubleSide:!0}),h=C(b.waRosaForte),u=C(b.waEscuro),d=C(b.waEscuro,{doubleSide:!0}),p=C(b.waBranco,{doubleSide:!0}),g=s+n.torsoH*.1,v=s-e*.135,m=o*2,f=new M(new nt(o*1.02,m,g-v,22,1,!0),d);f.position.y=(g+v)/2,f.scale.z=r,t.add(f);const S=16,x=o*1.02,_=g-v,P=-Math.atan2(m-x,_);for(let at=0;at<S;at++){const Z=new ot;Z.rotation.y=at/S*Math.PI*2;const yt=new M(new H(e*.011,_*.94,e*.009),u);yt.position.set(0,(g+v)/2,(x+m)/2),yt.rotation.x=P,Z.add(yt),Z.scale.z=r,t.add(Z)}const E=13;for(let at=0;at<E;at++){const Z=at/E*Math.PI*2,yt=jv(e*.034,b.waEscuro);yt.position.set(Math.sin(Z)*m*1.03,v-e*.016,Math.cos(Z)*m*1.03*r),yt.rotation.y=Z,t.add(yt)}const A=s+n.torsoH*.16,R=s-e*.095,w=new M(new nt(o*1.02,m*.9,A-R,16,1,!0,-1.25,2.5),p);w.position.y=(A+R)/2,w.scale.z=r,t.add(w);const y=si(m*.92,e*.03,b.waBranco,r);y.position.y=R,t.add(y);const D=s+n.torsoH*.14,F=s+n.torsoH*.5,z=new M(new nt(o*1.07,o*1.1,F-D,18,1,!0),d);z.position.y=(F+D)/2,z.scale.z=r,t.add(z);const V=new M(new H(o*.62,n.torsoH*.26,e*.012),u);V.position.set(0,s+n.torsoH*.6,o*.82),t.add(V);const q=new M(new _e(e*.019,e*.005,6,12),C(b.waFivela));q.position.set(0,s+n.torsoH*.56,o*.89),q.scale.set(1.25,1,1),t.add(q);for(const at of[-1,1]){const Z=new M(new H(o*1.15,n.torsoH*.42,e*.013),c);Z.position.set(at*o*.24,s+n.torsoH*.68,o*.76),Z.rotation.z=at*.52,t.add(Z)}const J=new M(new nt(o*.78,o*.92,n.torsoH*.2,16,1,!0),l);J.position.y=a-n.torsoH*.02,J.scale.z=r,t.add(J);const st=qn(e*.05,b.waRosaForte);st.position.set(0,D+e*.014,o*1.12),t.add(st);for(const at of[-1,1]){const Z=new M(new H(e*.026,e*.2,e*.008),h);Z.position.set(at*e*.022,D-e*.09,m*.78),Z.rotation.z=at*.1,t.add(Z);const yt=new M(new Ne(e*.018,e*.03,4),h);yt.position.set(at*e*.024,D-e*.2,m*.8),yt.rotation.set(Math.PI,Math.PI/4,0),yt.scale.z=.3,t.add(yt)}const $=new M(new nt(e*.043,e*.045,e*.022,14,1,!0),d);return $.position.y=a+n.torsoH*.12,t.add($),t}function Zv(n,t){const e=new ot,{h:i,w:s}=n,o=i*.3,a=t*i*.052*s,r=i*.068*s,c=1.2,l=new M(new nt(i*.045*s,r,o*.94,14,1,!0),C(b.waEscuro,{doubleSide:!0}));l.position.set(a*.45,-o*.44,0),l.scale.z=.78,e.add(l);const h=new M(new nt(r,r*.86,o*.38,14,1,!0),C(b.waEscuro,{doubleSide:!0}));h.position.set(a,-o*(c-.19),0),h.scale.z=.78,e.add(h);const u=si(r*.9,i*.024,b.waBranco,.78);return u.position.set(a,-o*c,0),e.add(u),e}function Jv(n){const t=new ot,{h:e,w:i}=n,s=-n.legH*.28,o=new M(new nt(e*.047*i,e*.047*i,e*.022,14,1,!0),C(b.waBranco,{doubleSide:!0}));o.position.y=s,t.add(o);const a=new M(new nt(e*.049*i,e*.049*i,e*.014,14,1,!0),C(b.waRosaForte,{doubleSide:!0}));a.position.y=s+e*.026,t.add(a);const r=qn(e*.013,b.waRosaForte);return r.position.set(0,s+e*.026,e*.05*i),t.add(r),t}function $v(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=s+n.torsoH,c=.95,l=C(b.moletomPreto),h=C(b.moletomPreto,{doubleSide:!0}),u=C(b.moletomCostura),d=C(b.moletomZiper),p=C(b.moletomForro,{doubleSide:!0}),g=o*1.1,v=o*1.04,m=s+e*.012,f=a+n.torsoH*.03,S=g*c,x=new M(new nt(g,v,f-m,22),l);x.position.y=(f+m)/2,x.scale.z=c,t.add(x);const _=new M(new Rt(g,22,10,0,Math.PI*2,0,Math.PI/2),l);_.position.y=f,_.scale.set(1,.42,c),t.add(_);const P=new M(new nt(v*1.03,v*1.01,e*.022,22,1,!0),h);P.position.y=m+e*.011,P.scale.z=c,t.add(P);const E=r+e*.015,A=new M(new nt(o*1.75,o*1.15,e*.07,20,1,!0),h);A.position.y=E,A.scale.z=.95,t.add(A);const R=new M(new nt(o*1.62,o*1.05,e*.066,20,1,!0),p);R.position.y=E-e*.003,R.scale.z=.95,t.add(R);const w=new M(new Rt(o*1.15,16,12,0,Math.PI*2,0,Math.PI*.6),h);w.position.set(0,a+n.torsoH*.14,-o*.72),w.rotation.x=-1.25,w.scale.set(1.4,.95,.62),t.add(w);const y=E+e*.005,D=m+e*.014,F=new M(new H(e*.014,y-D,e*.018),d);F.position.set(0,(y+D)/2,S*.99),t.add(F);const z=new M(new H(e*.02,e*.026,e*.012),u);z.position.set(0,s+n.torsoH*.5,S*1.03),t.add(z);const V=new M(new nt(g*1.012,g*1.012,e*.007,22,1,!0),C(b.moletomCostura,{doubleSide:!0}));V.position.y=s+n.torsoH*.68,V.scale.z=c,t.add(V);for(const q of[-1,1]){const J=new ot;J.rotation.y=q*.62,J.scale.z=c;const st=new M(new H(e*.013,e*.062,e*.012),u);st.position.set(0,s+n.torsoH*.2,g*1),st.rotation.z=q*.36,J.add(st),t.add(J)}for(const q of[-1,1]){const J=new M(new nt(e*.006,e*.006,e*.016,8),C(b.moletomPonteira));J.position.set(q*e*.022,m+e*.006,v*c*.99),t.add(J)}return t}function Kv(n){const t=new ot,{h:e,w:i}=n,s=e*.3,o=.82,a=new M(new Rt(e*.058*i,12,10),C(b.moletomPreto));a.position.y=-s*.03,a.scale.set(1,.92,.95),t.add(a);const r=new M(new nt(e*.056*i,e*.046*i,s*o,14,1,!0),C(b.moletomPreto,{doubleSide:!0}));r.position.y=-s*o*.5,t.add(r);const c=new M(new nt(e*.047*i,e*.045*i,e*.022,14),C(b.moletomCostura));return c.position.y=-s*o,t.add(c),t}function Qv(n){const t=new ot,i=-n.headR*.98,s=new M(new nt(n.h*.043,n.h*.045,n.h*.026,14,1,!0),C(b.vestidoRenda,{doubleSide:!0}));s.position.y=i,t.add(s);const o=qn(n.h*.026,b.vestidoFita,b.vestidoRenda);return o.position.set(0,i,n.h*.044),t.add(o),t}function t1(n){const t=new ot,e=n.headR,i=C(b.oculosLente),s=C(b.oculosArmacao),o=e*.04,a=.2,r=e*.26,c=e*1.07;for(const h of[-1,1]){const u=new M(new nt(r,r,e*.07,20),i);u.rotation.order="YXZ",u.rotation.set(Math.PI/2,-h*a,0),u.position.set(h*e*.38,o,c),t.add(u);const d=new M(new _e(r,e*.03,8,20),s);d.rotation.order="YXZ",d.rotation.set(0,-h*a,0),d.position.set(h*e*.38,o,c+e*.005),t.add(d);const p=e*.6,g=c-e*.06,v=e*.78,m=e*.4,f=v-p,S=m-g,x=new M(new H(e*.05,e*.07,Math.hypot(f,S)),s);x.position.set(h*(p+v)/2,o+e*.07,(g+m)/2),x.rotation.y=h*Math.atan2(f,S),t.add(x)}const l=new M(new nt(e*.025,e*.025,e*.34,8),s);return l.rotation.z=Math.PI/2,l.position.set(0,o+e*.07,c+e*.02),t.add(l),t}const Jt={sorveteMorango:{id:"sorvete-morango",nome:"Sorvete de morango",icone:"🍦",tipo:"mao",nota:"do Ari",holdPose:"upright"},sorveteMaracuja:{id:"sorvete-maracuja",nome:"Sorvete de maracujá",icone:"🍦",tipo:"mao",nota:"do Renan",holdPose:"upright"},sucoPessego:{id:"suco-pessego",nome:"Suco de pêssego",icone:"🥤",tipo:"mao",nota:"do Ari",holdPose:"upright"},sucoMorango:{id:"suco-morango",nome:"Suco de morango",icone:"🥤",tipo:"mao",nota:"do Renan",holdPose:"upright"},chapeuPingPong:{id:"chapeu-ping-pong",nome:"Chapéu de campeão",icone:"👑",tipo:"vestivel",slot:"cabeca",nota:"ping pong, 5 a 0"},patins:{id:"patins",nome:"Patins",icone:"🛼",tipo:"vestivel",slot:"pes",funcional:!0,nota:"da lojinha do parque · +velocidade"},gorroDeLa:{id:"gorro-la",nome:"Gorro de lã",icone:"🧢",tipo:"vestivel",slot:"cabeca",cor:b.roupaLa,corDetalhe:b.roupaLaBarra,nota:"para o frio que nunca faz",cobreCabelo:!0,extra:Hv},camisaListrada:{id:"camisa-listrada",nome:"Camisa listrada",icone:"👕",tipo:"vestivel",slot:"tronco",cor:b.roupaListra,corDetalhe:b.roupaListraManga,nota:"mangas claras"},calcaJeans:{id:"calca-jeans",nome:"Calça jeans",icone:"👖",tipo:"vestivel",slot:"pernas",cor:b.roupaJeans,nota:"a de sempre"},vestidoRosa:{id:"vestido-rosa",nome:"Vestido rosa de babados",icone:"👗",tipo:"vestivel",slot:"tronco",cor:b.vestidoRosa,corDetalhe:b.vestidoRenda,nota:"da vitrine que o Renan viu",bracosNus:!0,pernasNuas:!0,extra:qv},maidMarinheiro:{id:"maid-marinheiro",nome:"Maid marinheiro",icone:"🖤",tipo:"vestivel",slot:"tronco",cor:b.maidPreto,corDetalhe:b.maidCreme,nota:"gola de marinheiro e cadarço",pernasNuas:!0,extra:Wv},maidGatinho:{id:"maid-gatinho",nome:"Maid gatinho",icone:"🐱",tipo:"vestivel",slot:"tronco",cor:b.maidPreto,corDetalhe:b.maidPreto,nota:"com guizo e cara de gato",pernasNuas:!0,extra:Xv},maidJapones:{id:"maid-japones",nome:"Maid japonês",icone:"🌸",tipo:"vestivel",slot:"tronco",cor:b.waRosa,corDetalhe:b.waRosa,nota:"manga de quimono e festão de corações",pernasNuas:!0,extra:Yv,extraBraco:Zv},moletomPreto:{id:"moletom-preto",nome:"Moletom preto",icone:"🧥",tipo:"vestivel",slot:"tronco",cor:b.moletomPreto,corDetalhe:b.moletomPreto,nota:"com capuz e zíper, o da foto no espelho",extra:$v,extraBraco:Kv},meiaDeCoxa:{id:"meia-de-coxa",nome:"Meia de coxa",icone:"🧦",tipo:"vestivel",slot:"pernas",cor:b.waBranco,nota:"com a liga rosa",extra:Jv},gargantilhaDeLaco:{id:"gargantilha-laco",nome:"Gargantilha de laço",icone:"🎀",tipo:"vestivel",slot:"cabeca",cor:b.vestidoFita,nota:"combina com o vestido",extra:Qv},botaAmarela:{id:"bota-amarela",nome:"Bota amarela",icone:"🥾",tipo:"vestivel",slot:"pes",cor:b.roupaBota,corDetalhe:b.roupaBotaCano,nota:"chama atenção de longe",extra:Gv},oculosEscuros:{id:"oculos-escuros",nome:"Óculos escuros",icone:"🕶️",tipo:"vestivel",slot:"cabeca",nota:"do vestiário do clube",extra:t1},bermudaAzul:{id:"bermuda-azul",nome:"Bermuda azul",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:b.bermudaAzul,nota:"a cor da própria piscina"},bermudaVermelha:{id:"bermuda-vermelha",nome:"Bermuda vermelha",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:b.bermudaVermelha,nota:"dá pra achar de longe"},bermudaAmarela:{id:"bermuda-amarela",nome:"Bermuda amarela",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:b.bermudaAmarela,nota:"sol de tarde"},bermudaEstampada:{id:"bermuda-estampada",nome:"Bermuda estampada",icone:"🌺",tipo:"vestivel",slot:"pernas",corBanho:b.bermudaEstampa,estampaBanho:b.bermudaEstampaFaixa,nota:"duas faixas cor de areia"},frisbee:{id:"frisbee",nome:"Frisbee",icone:"🥏",tipo:"mao",nota:"do parque",holdPose:"relaxed"}},nu=[Jt.bermudaAzul,Jt.bermudaVermelha,Jt.bermudaAmarela,Jt.bermudaEstampada],e1={"sorvete-morango":()=>Br(b.morango),"sorvete-maracuja":()=>Br(b.maracuja),"suco-pessego":()=>Nl(b.pessego),"suco-morango":()=>Nl(b.morango),frisbee:()=>Qh(b.frisbee)},n1=Object.fromEntries(Object.values(Jt).map(n=>[n.id,n]));function Io(n){return n1[n]??null}function i1(n){const t=e1[n]?.();return t?(t.userData.item=n,t):null}const kn=10,Fs=4;function Os(n){return n.tipo==="vestivel"&&n.funcional!==!0}function ji(n,t){return t==="vestivel"?n.tipo==="vestivel":t==="acervo"?Os(n):!Os(n)}function Lo(n){return n.slot?dn.indexOf(n.slot):-1}function ko(n){return Array.from({length:n},()=>null)}function iu(){return{mao:ko(kn),ativo:0,vestiveis:ko(Fs),acervo:[]}}function s1(n,t){const e={},i=t&&typeof t=="object"?t:{},s=new Set([...Object.keys(n??{}),...Object.keys(i)]);for(const o of s)e[o]=o1((n??{})[o],i[o]);return e}function o1(n,t){const e=iu();if(!n&&!t)return e;const i=[],s=(d,p,g)=>{const v=ko(p);if(!Array.isArray(d))return v;for(let m=0;m<p;m++){const f=d[m];if(!f||typeof f.id!="string"){v[m]=null;continue}const S=Io(f.id),x=S?{...f,...S}:f;if(ji(x,g)){v[m]=x;continue}v[m]=null,g==="mao"&&Os(x)&&i.push(x)}return v},o=typeof n?.ativo=="number"?Math.floor(n.ativo):0,a=s(n?.vestiveis,Fs,"vestivel"),r=ko(Fs);for(const d of a){if(!d)continue;const p=Lo(d);p>=0&&r[p]===null&&(r[p]=d)}if(t&&typeof t=="object")for(const[d,p]of Object.entries(t)){if(typeof p!="string")continue;const g=Io(p);if(!g||g.slot!==d)continue;const v=dn.indexOf(d);v>=0&&r[v]===null&&(r[v]=g)}const c=s(n?.mao,kn,"mao"),l=[],h=d=>l.some(p=>p.id===d)||r.some(p=>p?.id===d)||c.some(p=>p?.id===d),u=Array.isArray(n?.acervo)?n.acervo:[];for(const d of[...u,...i]){if(!d||typeof d.id!="string")continue;const p=Io(d.id),g=p?{...d,...p}:d;!ji(g,"acervo")||h(g.id)||l.push(g)}return{mao:c,ativo:o>=0&&o<kn?o:0,vestiveis:r,acervo:l}}const Bl="aristory.save.v1",Da={version:1,scene:"",flags:{},memories:[],stats:{},inventarios:{}};class _c{data;constructor(){this.data=_c.read()}static read(){try{const t=localStorage.getItem(Bl);if(!t)return structuredClone(Da);const e=JSON.parse(t),i=e.loadouts;return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{},inventarios:s1(e.inventarios,i)}}catch{return structuredClone(Da)}}persist(){try{localStorage.setItem(Bl,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}de(t){let e=this.data.inventarios[t];return e||(e=iu(),this.data.inventarios[t]=e),e}maos(t){return this.de(t).mao}vestiveis(t){return this.de(t).vestiveis}acervo(t){return this.de(t).acervo}loadout(t){const e={};return this.de(t).vestiveis.forEach((i,s)=>{i&&(e[dn[s]]=i.id)}),e}slotAtivo(t){return this.de(t).ativo}setSlotAtivo(t,e){e<0||e>=kn||(this.de(t).ativo=e,this.persist())}itemAtivo(t){const e=this.de(t);return e.mao[e.ativo]??null}achouItem(t,e){const i=this.de(t);return i.mao.some(s=>s?.id===e)||i.vestiveis.some(s=>s?.id===e)||i.acervo.some(s=>s.id===e)}pegar(t,e){if(this.achouItem(t,e.id))return"repetido";if(e.tipo==="vestivel"&&this.vestir(t,e))return"guardado";if(Os(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let s=1;s<kn;s++){const o=(i.ativo+s)%kn;if(i.mao[o]===null)return i.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardar(t,e){if(this.achouItem(t,e.id))return"repetido";if(Os(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let s=1;s<kn;s++){const o=(i.ativo+s)%kn;if(i.mao[o]===null)return i.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardarNoAcervo(t,e){return ji(e,"acervo")?this.achouItem(t,e.id)?"repetido":(this.de(t).acervo.push(e),this.persist(),"guardado"):"cheio"}tirarDoAcervo(t,e){const i=this.de(t).acervo,s=i.findIndex(a=>a.id===e);if(s<0)return null;const[o]=i.splice(s,1);return this.persist(),o}vestir(t,e){if(!ji(e,"vestivel"))return!1;const i=Lo(e);if(i<0)return!1;const s=this.de(t).vestiveis;return s[i]!==null||this.achouItem(t,e.id)&&!this.tirarDoAcervo(t,e.id)?!1:(s[i]=e,this.persist(),!0)}despir(t,e){e<0||e>=Fs||(this.de(t).vestiveis[e]=null,this.persist())}mover(t,e,i){const s=this.de(t),o=u=>u.lista==="mao"?s.mao:s.vestiveis,a=u=>u.indice>=0&&u.indice<(u.lista==="mao"?kn:Fs);if(!a(e)||!a(i)||e.lista===i.lista&&e.indice===i.indice)return!1;const r=o(e),c=o(i),l=r[e.indice];if(!l||!ji(l,i.lista)||i.lista==="vestivel"&&Lo(l)!==i.indice)return!1;const h=c[i.indice];return h&&!ji(h,e.lista)||e.lista==="vestivel"&&h&&Lo(h)!==e.indice?!1:(c[i.indice]=l,r[e.indice]=h??null,this.persist(),!0)}largar(t,e){const i=this.de(t);let s=!1;for(const a of[i.mao,i.vestiveis]){const r=a.findIndex(c=>c?.id===e);r>=0&&(a[r]=null,s=!0)}const o=i.acervo.findIndex(a=>a.id===e);return o>=0&&(i.acervo.splice(o,1),s=!0),s&&this.persist(),s}reset(){this.data=structuredClone(Da),this.persist()}}const Ua=["Cabeça","Tronco","Pernas","Pés"];class a1{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;menu;placar;mochila;armario;boneco;corpo;acervo;donoArmario;vestiario;oculos;bermudas;donoVestiario;slotsMao;slotsVestivel;dono;descarte;memorias;quadro;pontos;acervoDoQuadro=[];naMoldura=0;pintura=null;abriuEm=0;pegou=null;tipoNaPinca;funcionalNaPinca=!1;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchGirar=null;onTouchHold=null;onRestart=null;onToggleSom=null;som=null;hintsTimer=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
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
      <div class="vestiario"><div class="sheet">
        <h2>Vestiário <span class="dono"></span></h2>
        <p class="sub">o traje de praia de cada um · <b>T</b> troca de pessoa</p>
        <h3>Óculos escuros</h3>
        <button class="oculos"></button>
        <h3>Cor da bermuda</h3>
        <div class="bermudas"></div>
        <button class="close">voltar pra piscina</button>
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
    `,t.appendChild(e);const i=document.createElement("div");i.className="boot",i.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(i),this.boot=i,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.menu=e.querySelector(".menu"),this.placar=e.querySelector(".placar"),this.mochila=e.querySelector(".mochila"),this.slotsMao=e.querySelector(".mochila .maos"),this.slotsVestivel=e.querySelector(".mochila .vestiveis"),this.dono=e.querySelector(".mochila .dono"),this.descarte=e.querySelector(".mochila .descarte"),this.armario=e.querySelector(".armario"),this.boneco=e.querySelector(".armario .boneco"),this.corpo=e.querySelector(".armario .corpo"),this.acervo=e.querySelector(".armario .acervo"),this.donoArmario=e.querySelector(".armario .dono"),this.vestiario=e.querySelector(".vestiario"),this.oculos=e.querySelector(".vestiario .oculos"),this.bermudas=e.querySelector(".vestiario .bermudas"),this.donoVestiario=e.querySelector(".vestiario .dono"),this.memorias=e.querySelector(".memorias"),this.quadro=e.querySelector(".memorias .quadro"),this.pontos=e.querySelector(".memorias .pontos"),this.dialogue.addEventListener("click",o=>{o.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",o=>{o.target===this.journal&&this.closeJournal()});const s=e.querySelector(".action-btn");s.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),s.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const o of["pointerup","pointercancel","pointerleave"])s.addEventListener(o,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".girar-btn.esq").addEventListener("click",()=>this.onTouchGirar?.(-1)),e.querySelector(".girar-btn.dir").addEventListener("click",()=>this.onTouchGirar?.(1)),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),e.querySelector(".bag-btn").addEventListener("click",()=>this.toggleMochila()),e.querySelector(".mochila .close").addEventListener("click",()=>this.closeMochila()),e.querySelector(".armario .close").addEventListener("click",()=>this.fecharArmario()),this.armario.addEventListener("click",o=>{o.target===this.armario&&this.fecharArmario()}),e.querySelector(".vestiario .close").addEventListener("click",()=>this.fecharVestiario()),this.vestiario.addEventListener("click",o=>{o.target===this.vestiario&&this.fecharVestiario()}),this.oculos.addEventListener("click",()=>this.onAlternarOculos?.()),this.bermudas.addEventListener("click",o=>{const a=o.target.closest(".bermuda");a?.dataset.id&&this.onEscolherBermuda?.(a.dataset.id)}),e.querySelector(".memorias .close").addEventListener("click",()=>this.fecharMemorias()),e.querySelector(".memorias .antes").addEventListener("click",()=>this.folhear(-1)),e.querySelector(".memorias .depois").addEventListener("click",()=>this.folhear(1)),this.memorias.addEventListener("click",o=>{o.target===this.memorias&&this.fecharMemorias()}),this.ligarGiroDoBoneco(),e.querySelector(".mochila .descartar").addEventListener("click",()=>{this.som?.("escolha"),this.descarte.classList.add("confirmando")}),e.querySelector(".mochila .descartar-sim").addEventListener("click",()=>{const o=this.pegou;this.pegou=null,this.tipoNaPinca=void 0,this.marcarPego(null),o&&this.onDescartar?.(o)}),this.mochila.addEventListener("click",o=>{o.target===this.mochila&&this.closeMochila()});for(const o of[this.slotsMao,this.slotsVestivel])o.addEventListener("click",a=>this.tocarVaga(a)),o.addEventListener("dragstart",a=>this.comecarArrasto(a)),o.addEventListener("dragover",a=>this.arrastarSobre(a)),o.addEventListener("dragleave",a=>{a.target.closest(".slot")?.classList.remove("alvo")}),o.addEventListener("drop",a=>this.soltarArrasto(a)),o.addEventListener("dragend",()=>this.limparArrasto());e.querySelector(".menu-btn").addEventListener("click",()=>this.toggleMenu()),e.querySelector(".menu .som-btn").addEventListener("click",()=>this.onToggleSom?.()),e.querySelector(".menu .controles-btn").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.add("vendo-controles")}),e.querySelector(".menu .controles .voltar").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.remove("vendo-controles")}),e.querySelector(".menu .close").addEventListener("click",()=>this.closeMenu()),e.querySelector(".menu .recomecar").addEventListener("click",()=>{this.menu.classList.add("perguntando")}),e.querySelector(".menu .nao").addEventListener("click",()=>{this.menu.classList.remove("perguntando")}),e.querySelector(".menu .sim").addEventListener("click",()=>{this.closeMenu(),this.onRestart?.()}),this.menu.addEventListener("click",o=>{o.target===this.menu&&this.closeMenu()}),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),this.showHints()}get menuOpen(){return this.menu.classList.contains("show")}toggleMenu(){this.som?.("menu"),this.menuOpen?this.closeMenu():(this.closeJournal(),this.closeMochila(),this.menu.classList.add("show")),this.marcarTelaAberta()}closeMenu(){this.menu.classList.remove("show"),this.menu.classList.remove("perguntando"),this.menu.classList.remove("vendo-controles"),this.marcarTelaAberta()}marcarTelaAberta(){document.body.classList.toggle("tela-aberta",this.menuOpen||this.journalOpen||this.mochilaOpen||this.armarioOpen||this.memoriasOpen||this.vestiarioOpen)}setSom(t){const e=this.menu.querySelector(".som-btn");e.textContent=t?"🔊 Som ligado":"🔇 Som desligado",e.classList.toggle("desligado",!t)}showHints(){this.hints.classList.remove("hide"),this.hintsTimer&&window.clearTimeout(this.hintsTimer),this.hintsTimer=window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){const i=this.prompt.querySelector(".label").textContent;this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,(!this.prompt.classList.contains("show")||i!==e)&&this.som?.("prompt"),this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showPlacar(t){if(!t){this.placar.classList.remove("show");return}this.placar.querySelector(".eu").textContent=t.eu,this.placar.querySelector(".ele").textContent=t.ele,this.placar.querySelector(".nums").textContent=`${t.meus} × ${t.dele}`,this.placar.classList.add("show")}showCharge(t,e,i=.06){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const s=this.carga.querySelector(".barra");s.style.width=`${Math.max(0,Math.min(1,t))*100}%`;const o=this.carga.querySelector(".alvo"),a=this.carga.querySelector(".zona"),r=e!=null&&e>.02&&e<.99;if(o.style.display=r?"block":"none",a.style.display=r?"block":"none",!r){this.carga.classList.remove("certa");return}const c=h=>`calc(3px + (100% - 6px) * ${Math.max(0,Math.min(1,h))})`;o.style.left=c(e),a.style.left=c(e-i),a.style.right=`calc(3px + (100% - 6px) * ${1-Math.max(0,Math.min(1,e+i))})`;const l=Math.abs(t-e)<=i;this.carga.classList.toggle("certa",l)}toast(t,e="💛"){const i=document.createElement("div");i.className="toast",i.innerHTML=`<span>${e}</span><span></span>`,i.querySelector("span:last-child").textContent=t,this.toasts.appendChild(i),window.setTimeout(()=>i.classList.add("fade"),2600),window.setTimeout(()=>i.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(i=>{let s=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const o=()=>{this.type(t[s])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[s];return}if(s+=1,s>=t.length){this.dialogue.classList.remove("show"),this.advance=null,i();return}o()},o()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,e%3===1&&t[e-1]!==" "&&this.som?.("fala"),this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,i=""){return new Promise(s=>{this.dialogueWho.textContent=i,this.dialogueWho.style.display=i?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=o=>{this.som?.("confirma"),this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),s(o)},e.forEach((o,a)=>{const r=document.createElement("button");r.type="button",r.textContent=o,r.addEventListener("click",()=>this.escolher?.(a)),this.escolhas.appendChild(r)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,i)=>e.classList.toggle("sel",i===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.som?.("escolha"),this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.som?.("escolha"),this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const i=document.createElement("div");i.className="memory",i.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',i.querySelector(".icon").textContent=e.icon,i.querySelector("b").textContent=e.title,i.querySelector("small").textContent=e.place,i.querySelector("p").textContent=e.note,this.journalGrid.appendChild(i)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.som?.("diario"),this.journalOpen?this.closeJournal():(this.closeMochila(),this.journal.classList.add("show")),this.marcarTelaAberta()}closeJournal(){this.journal.classList.remove("show"),this.marcarTelaAberta()}get memoriasOpen(){return this.memorias.classList.contains("show")}abrirMemorias(t,e=0){this.memoriasOpen||t.length===0||(this.som?.("diario"),this.closeJournal(),this.closeMochila(),this.acervoDoQuadro=t,this.naMoldura=Math.min(Math.max(e,0),t.length-1),this.mostrarMemoria(),this.memorias.classList.add("show"),this.marcarTelaAberta(),this.abriuEm=performance.now(),this.pintura=requestAnimationFrame(this.pintarQuadro))}fecharMemorias(){this.memoriasOpen&&(this.memorias.classList.remove("show"),this.acervoDoQuadro=[],this.pintura!==null&&cancelAnimationFrame(this.pintura),this.pintura=null,this.marcarTelaAberta())}folhear(t){if(!this.memoriasOpen||this.acervoDoQuadro.length<2)return;const e=this.acervoDoQuadro.length;this.naMoldura=(this.naMoldura+t+e)%e,this.som?.("escolha"),this.mostrarMemoria(),this.abriuEm=performance.now()}mostrarMemoria(){const t=this.acervoDoQuadro[this.naMoldura];if(!t)return;this.memorias.querySelector("h2").textContent=t.titulo,this.memorias.querySelector(".sub").textContent=t.lugar,this.memorias.querySelector(".legenda").textContent=t.legenda,this.quadro.style.aspectRatio=String(t.proporcao);const e=this.acervoDoQuadro.length>1;this.memorias.classList.toggle("tem-mais",e),this.pontos.innerHTML="",e&&this.acervoDoQuadro.forEach((i,s)=>{const o=document.createElement("button");o.className="ponto",o.classList.toggle("agora",s===this.naMoldura),o.title=i.titulo,o.setAttribute("aria-label",i.titulo),o.addEventListener("click",()=>this.folhear(s-this.naMoldura)),this.pontos.appendChild(o)})}pintarQuadro=t=>{const e=this.acervoDoQuadro[this.naMoldura];if(!e||!this.memoriasOpen){this.pintura=null;return}const i=Math.min(window.devicePixelRatio||1,2),s=Math.round(this.quadro.clientWidth*i),o=Math.round(this.quadro.clientHeight*i);if(s>0&&o>0){(this.quadro.width!==s||this.quadro.height!==o)&&(this.quadro.width=s,this.quadro.height=o);const a=this.quadro.getContext("2d");a&&e.pintar(a,s,o,(t-this.abriuEm)/1e3)}this.pintura=requestAnimationFrame(this.pintarQuadro)};get mochilaOpen(){return this.mochila.classList.contains("show")}toggleMochila(){this.som?.("diario"),this.mochilaOpen?this.closeMochila():(this.closeJournal(),this.onAbrirMochila?.(),this.mochila.classList.add("show")),this.marcarTelaAberta()}closeMochila(){this.mochila.classList.remove("show"),this.marcarTelaAberta()}renderMochila(t,e,i,s){this.dono.textContent=`de ${s}`,this.pegou=null,this.tipoNaPinca=void 0,this.funcionalNaPinca=!1,this.mochila.classList.remove("movendo"),this.descarte.classList.remove("show","confirmando");const o=(a,r,c,l=!1)=>{a.innerHTML="",r.forEach((h,u)=>{const d=document.createElement("button");d.className="slot",d.dataset.slot=String(u),d.classList.toggle("cheio",h!==null),d.classList.toggle("principal",u===c);const p=h!==null&&h.tipo==="vestivel"&&h.funcional!==!0;d.draggable=h!==null&&!p,d.classList.toggle("preso",p),h?(d.dataset.tipo=h.tipo,h.funcional?d.dataset.funcional="sim":delete d.dataset.funcional):(delete d.dataset.tipo,delete d.dataset.funcional);const g=l?`<em class="parte">${Ua[u]}</em>`:"";d.innerHTML=g+(h?`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""):'<span class="icone vazio">·</span><b>vazio</b>'),a.appendChild(d)})};o(this.slotsMao,t,i),o(this.slotsVestivel,e,-1,!0)}get armarioOpen(){return this.armario.classList.contains("show")}abrirArmario(){this.armarioOpen||(this.som?.("escolha"),this.onAbrirArmario?.(),this.armario.classList.add("show"),this.marcarTelaAberta())}fecharArmario(){this.armarioOpen&&(this.armario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharArmario?.())}canvasDoBoneco(){return this.boneco}renderArmario(t,e,i){if(this.donoArmario.textContent=`de ${i}`,this.corpo.innerHTML="",t.forEach((s,o)=>{const a=document.createElement("button");a.className="parte",a.classList.toggle("cheio",s!==null),a.dataset.parte=String(o),a.innerHTML=`<small>${Ua[o]}</small>`+(s?`<span class="icone">${s.icone}</span><b>${s.nome}</b><em>tirar</em>`:'<span class="icone vazio">·</span><b>vazio</b>'),this.corpo.appendChild(a)}),this.acervo.innerHTML="",e.length===0){const s=document.createElement("p");s.className="nada",s.textContent="Nada guardado — está tudo no corpo.",this.acervo.appendChild(s);return}dn.forEach((s,o)=>{const a=e.filter(h=>h.slot===s);if(a.length===0)return;const r=document.createElement("section");r.className="grupo",r.dataset.slot=s;const c=document.createElement("h4");c.innerHTML=`${Ua[o]} <span>${a.length}</span>`,r.appendChild(c);const l=document.createElement("div");l.className="pecas";for(const h of a){const u=document.createElement("button");u.className="peca",u.dataset.id=h.id,u.innerHTML=`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""),l.appendChild(u)}r.appendChild(l),this.acervo.appendChild(r)})}onTirarParte=null;onVestirPeca=null;onAbrirArmario=null;onFecharArmario=null;onGirarBoneco=null;ligarGiroDoBoneco(){let t=!1,e=0;this.boneco.addEventListener("pointerdown",i=>{t=!0,e=i.clientX,this.boneco.setPointerCapture(i.pointerId)}),this.boneco.addEventListener("pointermove",i=>{t&&(this.onGirarBoneco?.((i.clientX-e)*.012),e=i.clientX)});for(const i of["pointerup","pointercancel"])this.boneco.addEventListener(i,()=>{t=!1});this.corpo.addEventListener("click",i=>{const s=i.target.closest(".parte");!s?.dataset.parte||!s.classList.contains("cheio")||this.onTirarParte?.(Number(s.dataset.parte))}),this.acervo.addEventListener("click",i=>{const s=i.target.closest(".peca");s?.dataset.id&&this.onVestirPeca?.(s.dataset.id)})}get vestiarioOpen(){return this.vestiario.classList.contains("show")}abrirVestiario(){this.vestiarioOpen||(this.som?.("escolha"),this.onAbrirVestiario?.(),this.vestiario.classList.add("show"),this.marcarTelaAberta())}fecharVestiario(){this.vestiarioOpen&&(this.vestiario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharVestiario?.())}renderVestiario(t){this.donoVestiario.textContent=`de ${t.dono}`,this.oculos.classList.toggle("ligado",t.oculos),this.oculos.innerHTML=`<span class="icone">🕶️</span><b>Óculos escuros</b><em>${t.oculos?"tirar":"colocar"}</em>`,this.bermudas.innerHTML="";for(const e of t.bermudas){const i=document.createElement("button");i.className="bermuda",i.classList.toggle("vestida",e.vestida),i.dataset.id=e.id;const s=document.createElement("i");s.style.background=e.faixa?`repeating-linear-gradient(160deg, ${e.cor} 0 12px, ${e.faixa} 12px 18px)`:e.cor,i.appendChild(s);const o=document.createElement("b");o.textContent=e.nome,i.appendChild(o),this.bermudas.appendChild(i)}}onAlternarOculos=null;onEscolherBermuda=null;onAbrirVestiario=null;onFecharVestiario=null;onEscolherSlot=null;onMoverItem=null;onDescartar=null;onAbrirMochila=null;podeIrPara(t,e,i=!1){return t?t==="vestivel"&&e==="mao"?i?!0:(this.toast("Roupa só se troca no guarda-roupa","👗"),!1):t==="mao"&&e==="vestivel"?(this.toast("Este item não pode ser vestido","🚫"),!1):!0:!0}endereco(t){const e=t.closest(".slot");return e?.dataset.slot?{lista:e.closest(".vestiveis")?"vestivel":"mao",indice:Number(e.dataset.slot)}:null}tocarVaga(t){const e=this.endereco(t.target);if(!e)return;if(this.pegou){const s=this.pegou;if(s.lista===e.lista&&s.indice===e.indice){this.pegou=null,this.marcarPego(null);return}if(!this.podeIrPara(this.tipoNaPinca,e.lista,this.funcionalNaPinca))return;this.pegou=null,this.marcarPego(null),this.onMoverItem?.(s,e)&&this.som?.("escolha");return}const i=t.target.closest(".slot");if(e.lista==="mao"&&!i.classList.contains("cheio")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}if(i.classList.contains("cheio")){if(e.lista==="mao"&&!i.classList.contains("principal")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}this.pegou=e,this.tipoNaPinca=i.dataset.tipo,this.funcionalNaPinca=i.dataset.funcional==="sim",this.marcarPego(i),this.som?.("escolha")}}marcarPego(t){for(const s of this.mochila.querySelectorAll(".slot.pego"))s.classList.remove("pego");t?.classList.add("pego"),this.mochila.classList.toggle("movendo",t!==null),this.descarte.classList.toggle("show",t!==null),this.descarte.classList.remove("confirmando");const e=this.descarte.querySelector(".descartar"),i=t?.querySelector("b")?.textContent??"";e.textContent=i?`🗑 Descartar ${i}`:"🗑 Descartar"}comecarArrasto(t){const e=this.endereco(t.target),i=t.target.closest(".slot");if(!e||!i?.classList.contains("cheio")){t.preventDefault();return}t.dataTransfer?.setData("text/plain",JSON.stringify({vaga:e,tipo:i.dataset.tipo,funcional:i.dataset.funcional==="sim"})),t.dataTransfer&&(t.dataTransfer.effectAllowed="move"),i.classList.add("pego")}arrastarSobre(t){const e=t.target.closest(".slot");e&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),e.classList.add("alvo"))}soltarArrasto(t){t.preventDefault();const e=this.endereco(t.target),i=t.dataTransfer?.getData("text/plain");if(this.limparArrasto(),!(!e||!i))try{const{vaga:s,tipo:o,funcional:a}=JSON.parse(i);if(!this.podeIrPara(o,e.lista,a===!0))return;this.onMoverItem?.(s,e)&&this.som?.("escolha")}catch{}}limparArrasto(){for(const t of this.mochila.querySelectorAll(".slot.pego, .slot.alvo"))t.classList.remove("pego","alvo")}}function kr(n,t,e){for(const i of e)if(i.kind==="circle"){const s=n.x-i.x,o=n.z-i.z,a=t+i.r,r=s*s+o*o;if(r>=a*a||r===0)continue;const c=Math.sqrt(r),l=(a-c)/c;n.x+=s*l,n.z+=o*l}else{const s=Math.cos(-i.rot),o=Math.sin(-i.rot),a=n.x-i.x,r=n.z-i.z,c=a*s-r*o,l=a*o+r*s,h=Math.max(-i.hw,Math.min(i.hw,c)),u=Math.max(-i.hd,Math.min(i.hd,l));let d=c-h,p=l-u,g=d*d+p*p;if(g>t*t)continue;if(g===0){const S=i.hw-Math.abs(c),x=i.hd-Math.abs(l);S<x?(d=Math.sign(c)||1,p=0,g=0):(d=0,p=Math.sign(l)||1);const _=d!==0?Math.sign(d)*(i.hw+t):c,P=p!==0?Math.sign(p)*(i.hd+t):l;n.x=i.x+(_*Math.cos(i.rot)-P*Math.sin(i.rot)),n.z=i.z+(_*Math.sin(i.rot)+P*Math.cos(i.rot));continue}const v=Math.sqrt(g),m=h+d/v*t,f=u+p/v*t;n.x=i.x+(m*Math.cos(i.rot)-f*Math.sin(i.rot)),n.z=i.z+(m*Math.sin(i.rot)+f*Math.cos(i.rot))}}function Vr(n,t,e){n.x=Math.max(e.minX+t,Math.min(e.maxX-t,n.x)),n.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,n.z))}const su=1.3;class r1{object=new ot;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new N;body;locked=!1;riding=!1;submersion=0;patins=!1;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}get chest(){return new N(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}update(t,e,i,s){if(this.riding){this.body.update(e,0);return}const o=this.submersion>.05,a=this.patins&&!o?su:1,r=o?this.maxSpeed*.55:this.maxSpeed*a;if(!this.locked&&t.lengthSq()>1e-4){const l=t.clone().normalize();this.velocity.x+=l.x*this.accel*e,this.velocity.z+=l.z*this.accel*e;const h=Math.hypot(this.velocity.x,this.velocity.z);h>r&&(this.velocity.x=this.velocity.x/h*r,this.velocity.z=this.velocity.z/h*r),this.body.setFacing(Math.atan2(l.x,l.z))}else{const l=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(l),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,kr(this.position,this.radius,i),Vr(this.position,this.radius,s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(o),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class c1{object=new ot;position;radius=.4;maxSpeed=5;velocity=new N;dir=new N;body;aoLado=0;folga=2;ordem=null;riding=!1;submersion=0;patins=!1;lado=0;distancia=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}atrelar(t,e){this.lado=t,this.distancia=e,this.ordem=null}soltar(){this.lado=0}get atrelado(){return this.lado!==0}goTo(t,e){this.ordem=new N(t,0,e)}clearOrder(){this.ordem=null}hold(t,e){this.ordem?this.ordem.set(this.position.x,0,this.position.z):this.ordem=new N(this.position.x,0,this.position.z),this.velocity.set(0,0,0),this.body.setFacing(Math.atan2(t-this.position.x,e-this.position.z))}get hasOrder(){return this.ordem!==null}rebocar(t,e,i,s){const o=this.aoLado,a=t.x+Math.sin(o+Math.PI/2)*this.distancia*this.lado,r=t.z+Math.cos(o+Math.PI/2)*this.distancia*this.lado,c=this.position.x,l=this.position.z,h=Math.min(1,e*16);this.position.x+=(a-this.position.x)*h,this.position.z+=(r-this.position.z)*h,kr(this.position,this.radius,i),Vr(this.position,this.radius,s),this.velocity.set((this.position.x-c)/Math.max(e,1e-4),0,(this.position.z-l)/Math.max(e,1e-4)),this.body.setFacing(o),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}set direcaoDoPar(t){this.aoLado=t}update(t,e,i,s){if(this.riding){this.body.update(e,0);return}if(this.lado!==0){this.rebocar(t,e,i,s);return}const o=this.ordem??t,a=this.ordem?.55:this.folga;this.dir.set(o.x-this.position.x,0,o.z-this.position.z);const r=this.dir.length();if(!this.ordem&&r>22){this.teleport(o.x-1.2,o.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(r>a){this.dir.normalize();const d=this.maxSpeed*(this.patins?su:1),p=Math.min(d,1.6+(r-a)*2.2);this.velocity.x+=(this.dir.x*p-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*p-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),r>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,kr(this.position,this.radius,i),Vr(this.position,this.radius,s);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),u=.86;if(h<u&&h>1e-4){const d=(u-h)/h;this.position.x+=c*d,this.position.z+=l*d}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}const l1=1.7;class h1{grupo=new ot;vivos=[];constructor(t){t.add(this.grupo)}soltar(t,e,i,s=1.62){const o=tu(.6);o.userData.coracao=!0,o.position.set(t.x+e,s,t.z+i),this.grupo.add(o),this.vivos.push({obj:o,vida:0,giro:Math.random()*Math.PI,fx:e,fz:i})}limpar(){for(const t of this.vivos)this.grupo.remove(t.obj);this.vivos.length=0}update(t){for(let e=this.vivos.length-1;e>=0;e--){const i=this.vivos[e];i.vida+=t;const s=i.vida/l1;if(s>=1){this.grupo.remove(i.obj),this.vivos.splice(e,1);continue}i.obj.position.y+=t*.72;const o=(.7+Math.sin(i.vida*3+i.giro)*.25)*t;i.obj.position.x+=i.fx*o,i.obj.position.z+=i.fz*o,i.obj.rotation.y=i.giro+i.vida*1.4;const a=s<.18?s/.18:Math.min(1,(1-s)/.35);i.obj.scale.setScalar(.25+a*.9)}}}const u1=1.5,kl=.9,Vl=1.16,wi=.32,Hr=.42,ou=.34,d1=wi+Hr+ou,f1=.5;class p1{constructor(t){this.coracoes=t}t=-1;descanso=0;alvoA=new N;alvoB=new N;soltouCoracao=!1;onSom=null;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!g1(t,e))return!1;const i=e.position.x-t.position.x,s=e.position.z-t.position.z,o=Math.hypot(i,s);if(o>u1||o<.01)return!1;const a=Math.atan2(i,s);return Math.abs(Na(t.rig.facing,a))<kl&&Math.abs(Na(e.rig.facing,a+Math.PI))<kl}iniciar(t,e,i){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const s=e.position.x-t.position.x,o=e.position.z-t.position.z,a=Math.atan2(s,o),r=i+Math.PI/2,c=Math.abs(Na(a,r))<Math.PI/2?r:r+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,u=Math.sin(c)*Vl/2,d=Math.cos(c)*Vl/2;this.alvoA.set(l-u,0,h-d),this.alvoB.set(l+u,0,h+d),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0)}update(t,e,i){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const s=m1(this.t);if(e.rig.setKiss(s),i.rig.setKiss(s),e.locked=!0,this.t<wi){const o=Math.min(1,t*9);e.position.lerp(this.alvoA,o),i.position.lerp(this.alvoB,o)}if(!this.soltouCoracao&&this.t>=wi*.9){this.soltouCoracao=!0;const o=Math.atan2(i.position.x-e.position.x,i.position.z-e.position.z),a=Math.sin(o),r=Math.cos(o);this.coracoes.soltar(e.position,-a,-r),this.coracoes.soltar(i.position,a,r),this.onSom?.("beijo"),this.onSom?.("coracao")}this.t>=d1&&(this.t=-1,this.descanso=f1,e.rig.setKiss(0),i.rig.setKiss(0),e.locked=!1)}}}function m1(n){return n<wi?Hl(n/wi):n<wi+Hr?1:Hl(Math.max(0,1-(n-wi-Hr)/ou))}function Hl(n){return n*n*(3-2*n)}function g1(n,t){const e=n.rig.spec,i=t.rig.spec;return e.casal===!0&&i.casal===!0&&e.id!==i.id}function Na(n,t){return Math.atan2(Math.sin(n-t),Math.cos(n-t))}const v1=.95,_1=1.8,x1=2.2,M1=.5,Gl=3;class y1{constructor(t){this.coracoes=t}lado=1;ligado=!1;relogio=0;longe=0;onSom=null;get ativo(){return this.ligado}disponivel(t,e){if(this.ligado||t.riding||e.riding||t.submersion>.05||e.submersion>.05||t.locked||e.hasOrder)return!1;const i=Math.hypot(e.position.x-t.position.x,e.position.z-t.position.z);return i>.01&&i<=_1}ligar(t,e){if(this.ligado)return;this.ligado=!0,this.relogio=0,this.longe=0;const i=t.rig.facing,s=e.position.x-t.position.x,o=e.position.z-t.position.z;this.lado=s*Math.sin(i+Math.PI/2)+o*Math.cos(i+Math.PI/2)<0?-1:1,this.aplicar(t,e),this.onSom?.("escolha")}soltar(t,e){this.ligado&&(this.ligado=!1,e.soltar(),t.rig.setHoldingHands(0),e.rig.setHoldingHands(0))}trocouCorpos(t,e){this.ligado&&(this.lado=this.lado===1?-1:1,this.aplicar(t,e))}update(t,e,i){if(!this.ligado)return;if(e.riding||i.riding||e.submersion>.05||i.submersion>.05||i.hasOrder){this.soltar(e,i);return}const s=Math.hypot(i.position.x-e.position.x,i.position.z-e.position.z);if(this.longe=s>x1?this.longe+t:0,this.longe>=M1){this.soltar(e,i);return}if(i.direcaoDoPar=e.rig.facing,this.relogio+=t,this.relogio>=Gl){this.relogio-=Gl;const o=e.position.clone().add(i.position).multiplyScalar(.5);this.coracoes.soltar(o,0,0,2.05),this.onSom?.("coracao")}}aplicar(t,e){e.atrelar(this.lado,v1),e.direcaoDoPar=t.rig.facing,t.rig.setHoldingHands(this.lado),e.rig.setHoldingHands(this.lado===1?-1:1)}}function ie(n,t,e){const i=n.createOscillator();i.type=e.tipo??"sine",i.frequency.setValueAtTime(e.freq,e.quando),e.glide&&i.frequency.exponentialRampToValueAtTime(Math.max(20,e.glide),e.quando+e.dur),e.detune&&i.detune.setValueAtTime(e.detune,e.quando);const s=n.createGain(),o=e.vol??.2,a=e.ataque??.006;s.gain.setValueAtTime(1e-4,e.quando),s.gain.exponentialRampToValueAtTime(o,e.quando+a),s.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur);let r=s;if(e.abafo){const c=n.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(e.abafo,e.quando),s.connect(c),r=c}i.connect(s),r.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}let yo=null;function b1(n){if(!yo||yo.sampleRate!==n.sampleRate){const t=n.createBuffer(1,n.sampleRate,n.sampleRate),e=t.getChannelData(0);for(let i=0;i<e.length;i++)e[i]=Math.random()*2-1;yo=t}return yo}function Ze(n,t,e){const i=n.createBufferSource();i.buffer=b1(n),i.loop=!0;const s=n.createBiquadFilter();s.type=e.tipo??"bandpass",s.frequency.setValueAtTime(e.freq??1800,e.quando),e.glide&&s.frequency.exponentialRampToValueAtTime(Math.max(60,e.glide),e.quando+e.dur),s.Q.setValueAtTime(e.q??1.2,e.quando);const o=n.createGain(),a=e.vol??.14;o.gain.setValueAtTime(1e-4,e.quando),o.gain.exponentialRampToValueAtTime(a,e.quando+.008),o.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur),i.connect(s),s.connect(o),o.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}function fe(n){return 440*Math.pow(2,(n-69)/12)}function S1(n){let t=n>>>0;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}const ql=[0,2,4,7,9,12,14,16],Me=72,au={passo:({ctx:n,destino:t,t:e,n:i})=>{const s=i%2===0;Ze(n,t,{quando:e,dur:.075,vol:.05,freq:s?1500:1150,glide:s?700:560,q:.9}),ie(n,t,{freq:s?128:112,quando:e,dur:.06,vol:.045,tipo:"sine"})},nadar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.34,vol:.07,freq:700,glide:2600,q:.7})},agua:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.42,vol:.2,freq:2400,glide:500,q:.6}),ie(n,t,{freq:420,glide:120,quando:e,dur:.26,vol:.1,tipo:"sine"})},prompt:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+12),quando:e,dur:.09,vol:.055,tipo:"triangle"})},interagir:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+4),quando:e,dur:.12,vol:.13,tipo:"triangle"}),ie(n,t,{freq:fe(Me+11),quando:e+.055,dur:.16,vol:.1,tipo:"sine"})},fala:({ctx:n,destino:t,t:e,n:i})=>{const s=ql[i%4]+(i%8<4?0:2);ie(n,t,{freq:fe(Me+7+s),quando:e,dur:.06,vol:.035,tipo:"square",abafo:2200})},escolha:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+7),quando:e,dur:.07,vol:.08,tipo:"triangle"})},confirma:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+4),quando:e,dur:.1,vol:.12,tipo:"triangle"}),ie(n,t,{freq:fe(Me+9),quando:e+.07,dur:.14,vol:.11,tipo:"triangle"}),ie(n,t,{freq:fe(Me+16),quando:e+.14,dur:.2,vol:.09,tipo:"sine"})},porta:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.3,vol:.11,freq:900,glide:320,q:.8}),ie(n,t,{freq:180,glide:90,quando:e+.16,dur:.2,vol:.09,tipo:"sine"})},memoria:({ctx:n,destino:t,t:e})=>{[0,4,7,12,16].forEach((i,s)=>{ie(n,t,{freq:fe(Me+i),quando:e+s*.075,dur:.42,vol:.11-s*.008,tipo:"triangle"})})},toast:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+9),quando:e,dur:.14,vol:.09,tipo:"sine"}),ie(n,t,{freq:fe(Me+16),quando:e+.08,dur:.22,vol:.07,tipo:"sine"})},trocar:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me),glide:fe(Me+12),quando:e,dur:.18,vol:.09,tipo:"triangle"}),Ze(n,t,{quando:e,dur:.2,vol:.05,freq:800,glide:3e3,q:.6})},beijo:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.06,vol:.1,freq:2400,glide:1200,q:2.5}),ie(n,t,{freq:fe(Me+7),quando:e+.02,dur:.1,vol:.08,tipo:"sine"})},coracao:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+12),quando:e,dur:.3,vol:.07,tipo:"sine"}),ie(n,t,{freq:fe(Me+19),quando:e+.09,dur:.36,vol:.05,tipo:"sine"})},lancar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.26,vol:.12,freq:600,glide:3200,q:.7}),ie(n,t,{freq:300,glide:900,quando:e,dur:.16,vol:.06,tipo:"triangle"})},pegar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.09,vol:.13,freq:1400,glide:500,q:1.6}),ie(n,t,{freq:fe(Me+9),quando:e+.03,dur:.14,vol:.1,tipo:"triangle"})},quicar:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:220,glide:110,quando:e,dur:.12,vol:.08,tipo:"sine"}),Ze(n,t,{quando:e,dur:.1,vol:.06,freq:900,glide:400,q:1})},sorvete:({ctx:n,destino:t,t:e})=>{[0,7,12].forEach((i,s)=>{ie(n,t,{freq:fe(Me+4+i),quando:e+s*.09,dur:.3,vol:.1,tipo:"triangle"})})},miado:({ctx:n,destino:t,t:e,n:i})=>{const s=i%2===1,o=fe(Me+ql[s?2:3]);ie(n,t,{freq:o*.82,glide:o,quando:e,dur:s?.2:.15,vol:.075,tipo:"sawtooth",abafo:1500}),ie(n,t,{freq:o,glide:o*.68,quando:e+(s?.15:.1),dur:s?.55:.4,vol:.085,ataque:.02,tipo:"sawtooth",abafo:1200}),Ze(n,t,{quando:e,dur:s?.4:.28,vol:.022,freq:1100,glide:700,q:2.2})},pato:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:620,glide:380,quando:e,dur:.13,vol:.1,tipo:"sawtooth",abafo:1400}),ie(n,t,{freq:520,glide:300,quando:e+.15,dur:.12,vol:.08,tipo:"sawtooth",abafo:1200})},tv:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.18,vol:.07,freq:3e3,glide:1200,q:.5}),ie(n,t,{freq:fe(Me+4),quando:e+.1,dur:.18,vol:.07,tipo:"square",abafo:1800})},sino:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+12),quando:e,dur:.9,vol:.09,tipo:"sine"}),ie(n,t,{freq:fe(Me+19),quando:e+.02,dur:.8,vol:.05,tipo:"sine",detune:6})},sentar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.24,vol:.09,freq:700,glide:260,q:.7})},menu:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+2),quando:e,dur:.1,vol:.09,tipo:"triangle"}),ie(n,t,{freq:fe(Me+9),quando:e+.06,dur:.14,vol:.07,tipo:"triangle"})},diario:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.22,vol:.09,freq:1200,glide:3e3,q:.6})},recomecar:({ctx:n,destino:t,t:e})=>{[0,4,7,12].forEach((i,s)=>{ie(n,t,{freq:fe(Me-12+i),quando:e+s*.11,dur:.5,vol:.1,tipo:"triangle"})})}},w1=.2,E1=1.3,qi=n=>({raiz:n,notas:[0,4,7,11]}),gs=n=>({raiz:n,notas:[0,3,7,10]}),bo=n=>({raiz:n,notas:[0,4,7,10]}),T1=n=>({raiz:n,notas:[0,4,7,9]}),Fa=[0,2,4,7,9,12,14,16,19],A1=[0,2,3,5,7,9,10,12,14],Do={casa:{bpm:82,tonica:41,giro:[qi(0),gs(9),gs(2),bo(7)],melodia:.62,chocalho:!1,escala:Fa},"villa-lobos":{bpm:100,tonica:36,giro:[qi(0),qi(5),gs(9),bo(7)],melodia:.8,chocalho:!0,escala:Fa},clube:{bpm:92,tonica:38,giro:[T1(0),gs(2),qi(5),bo(7)],melodia:.72,chocalho:!0,escala:Fa},padrao:{bpm:88,tonica:40,giro:[qi(0),gs(9),qi(5),bo(7)],melodia:.6,chocalho:!1,escala:A1}},Wl=[[0,2,3,6],[0,3,4,6,7],[2,3,5,6],[0,1,3,6],[0,4,6],[1,3,4,7]];class ru{constructor(t,e){this.ctx=t,this.destino=e}clima=Do.padrao;proximoClima=null;passo=0;proximo=0;timer=null;sorte=S1(20260827);frase=[];grau=2;get tocando(){return this.timer!==null}setClima(t){const e=Do[t]??Do.padrao;e!==this.clima&&(this.tocando?this.proximoClima=e:this.clima=e)}start(){this.timer===null&&(this.proximo=this.ctx.currentTime+.15,this.timer=window.setInterval(()=>this.agendar(),w1*1e3),this.agendar())}stop(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}preAgendar(t){for(this.proximo=0,this.passo=0;this.proximo<t;){this.tocarPasso(this.passo,this.proximo);const e=30/this.clima.bpm;this.proximo+=e*(this.passo%2===0?1.18:.82),this.passo+=1}}agendar(){const t=this.ctx.currentTime+E1;let e=0;for(;this.proximo<t&&e++<64;){this.tocarPasso(this.passo,this.proximo);const i=30/this.clima.bpm;this.proximo+=i*(this.passo%2===0?1.18:.82),this.passo+=1}}tocarPasso(t,e){const i=t%8;i===0&&(this.proximoClima&&(this.clima=this.proximoClima,this.proximoClima=null),(Math.floor(t/8)%2===0||this.frase.length===0)&&(this.frase=Wl[Math.floor(this.sorte()*Wl.length)]));const s=this.clima,o=Math.floor(t/8),a=s.giro[o%s.giro.length],r=s.tonica+a.raiz;if(i===0||i===4){const c=i===0?r:r+(this.sorte()<.4?7:4);ie(this.ctx,this.destino,{freq:fe(c),quando:e,dur:i===0?.6:.45,vol:.2,tipo:"sine",abafo:420})}if(i===2||i===5||i===7&&this.sorte()<.35){const c=r+24;for(const[l,h]of a.notas.entries())l===0&&i!==2||ie(this.ctx,this.destino,{freq:fe(c+h),quando:e,dur:.85,vol:.07,tipo:"triangle",ataque:.03,detune:l%2?5:-5,abafo:2400})}if(this.frase.includes(i)&&this.sorte()<s.melodia){const c=[-2,-1,-1,0,1,1,2];this.grau+=c[Math.floor(this.sorte()*c.length)],this.grau>s.escala.length-3&&(this.grau-=2),this.grau<2&&(this.grau+=2),this.grau=Math.max(0,Math.min(s.escala.length-1,this.grau));const l=i>=6?a.notas[Math.floor(this.sorte()*3)]:s.escala[this.grau],h=s.tonica+31;this.marimba(fe(h+l),e),l<=9&&this.sorte()<.22&&this.marimba(fe(h+l+12),e+.03,.4)}s.chocalho&&i%2===1&&Ze(this.ctx,this.destino,{quando:e,dur:.06,vol:i===3||i===7?.035:.02,freq:6200,q:.8})}marimba(t,e,i=1){ie(this.ctx,this.destino,{freq:t,quando:e,dur:.42,vol:.13*i,tipo:"sine"}),t<900&&ie(this.ctx,this.destino,{freq:t*2,quando:e,dur:.1,vol:.04*i,tipo:"sine"})}}const Xl="aristory.som",C1=.035;class P1{ctx=null;mestre=null;canalMusica=null;canalEfeitos=null;musica=null;mudo;climaPendente="padrao";contadores=new Map;ultimoEm=new Map;carregando=null;contagem=new Map;constructor(){this.mudo=localStorage.getItem(Xl)==="0";const t=()=>this.ligar();for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,t,{once:!1,passive:!0})}get ligado(){return!this.mudo}get pronto(){return this.ctx!==null&&this.ctx.state==="running"}ligar(){if(!this.ctx){const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,this.mestre=e.createGain(),this.mestre.gain.value=this.mudo?0:.9,this.mestre.connect(e.destination),this.canalMusica=e.createGain(),this.canalMusica.gain.value=.9,this.canalMusica.connect(this.mestre),this.canalEfeitos=e.createGain(),this.canalEfeitos.gain.value=1,this.canalEfeitos.connect(this.mestre),this.musica=new ru(e,this.canalMusica),this.musica.setClima(this.climaPendente)}this.ctx.resume().then(()=>{this.mudo||this.musica?.start()})}setMudo(t){if(this.mudo=t,localStorage.setItem(Xl,t?"0":"1"),this.mestre&&this.ctx){const e=this.ctx.currentTime;this.mestre.gain.cancelScheduledValues(e),this.mestre.gain.setValueAtTime(this.mestre.gain.value,e),this.mestre.gain.linearRampToValueAtTime(t?0:.9,e+.12)}t?this.musica?.stop():this.ctx?.state==="running"&&this.musica?.start()}setClima(t){this.climaPendente=t,this.musica?.setClima(t)}play(t){if(this.contagem.set(t,(this.contagem.get(t)??0)+1),this.mudo||!this.ctx||!this.canalEfeitos||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(e-(this.ultimoEm.get(t)??-1)<C1)return;this.ultimoEm.set(t,e);const i=(this.contadores.get(t)??0)+1;this.contadores.set(t,i),au[t]({ctx:this.ctx,destino:this.canalEfeitos,t:e,n:i})}carga(t){if(!this.ctx||!this.canalEfeitos||this.mudo||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(t===null){if(this.carregando){const{osc:s,ganho:o}=this.carregando;o.gain.cancelScheduledValues(e),o.gain.setValueAtTime(o.gain.value,e),o.gain.exponentialRampToValueAtTime(1e-4,e+.08),s.stop(e+.1),this.carregando=null}return}if(!this.carregando){const s=this.ctx.createOscillator();s.type="triangle";const o=this.ctx.createGain();o.gain.setValueAtTime(1e-4,e),o.gain.exponentialRampToValueAtTime(.05,e+.05),s.connect(o),o.connect(this.canalEfeitos),s.start(e),this.carregando={osc:s,ganho:o}}const i=fe(60+t*19);this.carregando.osc.frequency.setTargetAtTime(i,e,.04)}aplauso(){if(!this.ctx||!this.canalEfeitos)return;const t=this.ctx.currentTime;[0,5,9,12].forEach((e,i)=>{ie(this.ctx,this.canalEfeitos,{freq:fe(72+e),quando:t+i*.1,dur:.5,vol:.09,tipo:"triangle"})})}}const R1={magro:.86,medio:1,forte:1.16},jl=.75,I1=.13,L1={upright:{bracoX:-1.38,bracoZ:.16,balanco:.15,itemZ:0,itemX:0},relaxed:{bracoX:-.22,bracoZ:.46,balanco:.6,itemZ:.9,itemX:.13}};function Oa(n,t,e){const i=new Xo,s=5;for(let a=0;a<s*2;a++){const r=a%2===0?n:n*.46,c=a/(s*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*r,h=Math.sin(c)*r;a===0?i.moveTo(l,h):i.lineTo(l,h)}i.closePath();const o=new dc(i,{depth:t,bevelEnabled:!1});return o.center(),new M(o,e)}class Gr{group=new ot;spec;headTop;body=new ot;head=new ot;armL=new ot;armR=new ot;maoDir=new ot;legL=new ot;legR=new ot;blob;chapeu=new ot;phase=0;bounce=0;beijo=0;maos=0;pose="none";patinando=!1;altoDoPatins=0;alturaDaPerna=0;pes=[];patins=[];targetFacing=0;swimming=!1;sitting=!1;deitado=!1;trocaMaterial=[];soVestido=[];soBanho=[];calcao;pernasDoShort=[];calcaoDaFicha;estampa=[];traje="normal";roupa={};extras=new Map;medidas;sobreTronco=[];cabelo;constructor(t){this.spec=t;const e=t.height,i=R1[t.build],s=e*.28,o=e/1.7;this.altoDoPatins=I1*o,this.alturaDaPerna=s;const a=e*.3,r=e*.17,c=s,l=s+a*.86,h=e*.1*i,u=e*.3;this.headTop=s+a+r*2.1,this.medidas={h:e,w:i,headR:r,legH:s,torsoH:a};const d=C(t.skin),p=C(t.shirt),g=C(t.pants),v=C(t.shoes);this.calcaoDaFicha=C(t.swim??t.pants);for(const[y,D]of[[this.legL,-1],[this.legR,1]]){y.position.set(D*e*.055*i,c,0);const F=new M(new En(e*.042*i,s*.62,4,10),g);F.position.y=-s*.48,y.add(F),this.trocaMaterial.push({mesh:F,normal:g,banho:d,slot:"pernas",parte:"principal"});const z=s*.36,V=new M(new nt(e*.052*i,e*.064*i,z,14,1,!0),this.calcaoDaFicha);V.position.y=s*.02-z/2,V.visible=!1,y.add(V),this.soBanho.push(V),this.pernasDoShort.push(V);const q=new M(new H(e*.075*i,e*.045,e*.11),v);q.position.set(0,-s+e*.022,e*.018),y.add(q),this.trocaMaterial.push({mesh:q,normal:v,banho:d,slot:"pes",parte:"principal"}),this.pes.push(q);const J=zr(t.shoes);J.scale.setScalar(o),J.visible=!1,y.add(J),this.patins.push(J),this.body.add(y)}const m=new M(new En(e*.105*i,a*.5,5,12),p);if(m.position.y=c+a*.52,m.scale.z=.82,this.body.add(m),this.trocaMaterial.push({mesh:m,normal:p,banho:d,slot:"tronco",parte:"principal"}),t.shirtAccent!==void 0){const y=new M(new nt(e*.108*i,e*.108*i,e*.03,14,1,!0),C(t.shirtAccent,{doubleSide:!0}));y.position.y=c+a*.72,y.scale.z=.82,this.body.add(y),this.soVestido.push(y),this.sobreTronco.push(y)}if(t.jacket!==void 0){const y=C(t.jacket,{doubleSide:!0}),D=e*.105*i,F=new M(new nt(D*1.14,D*1.1,a*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),y);F.position.y=c+a*.56,F.scale.z=.84,this.body.add(F),this.soVestido.push(F),this.sobreTronco.push(F);const z=new M(new Rt(e*.088*i,12,10,0,Math.PI*2,0,Math.PI*.62),C(t.jacket));z.position.set(0,l+a*.04,-D*.75),z.rotation.x=-.7,z.scale.set(1.15,1,.8),this.body.add(z),this.soVestido.push(z),this.sobreTronco.push(z)}const f=e*.118*i,S=e*.105,x=new M(new nt(f,e*.112*i,S,14),this.calcaoDaFicha);x.position.y=c+e*.012,x.scale.z=.85,x.visible=!1,this.body.add(x),this.soBanho.push(x),this.calcao=x;for(const y of[.3,-.12]){const D=new M(new nt(f*1.03,f*1.03,e*.019,14,1,!0),this.calcaoDaFicha);D.position.y=y*S,D.visible=!1,x.add(D),this.estampa.push(D)}for(const[y,D]of[[this.armL,-1],[this.armR,1]]){y.position.set(D*h,l,0);const F=t.jacket!==void 0?C(t.jacket):p,z=new M(new En(e*.038*i,u*.34,4,10),F);z.position.y=-u*.24,y.add(z),this.trocaMaterial.push({mesh:z,normal:F,banho:d,slot:"tronco",parte:"detalhe"});const V=new M(new En(e*.032*i,u*.28,4,10),d);V.position.y=-u*.66,y.add(V);const q=new M(new Rt(e*.04*i,10,8),d);q.position.y=-u*.92,y.add(q),this.body.add(y)}this.maoDir.position.y=-u*.98,this.armR.add(this.maoDir),this.head.position.y=s+a+r*.92;const _=new M(new nt(e*.035,e*.04,e*.05,10),d);_.position.y=-r*.85,this.head.add(_);const P=new M(new Rt(r,20,16),d);P.scale.set(1,1.04,1),this.head.add(P);const E=C(t.eyes);for(const y of[-1,1]){const D=new M(new Rt(r*.14,10,8),E);if(D.position.set(y*r*.35,0,r*.9),D.scale.set(1,1.25,.6),this.head.add(D),t.blush!==void 0){const F=new M(new Ls(r*.16,12),Xe(t.blush,.75,!0));F.position.set(y*r*.56,-r*.26,r*.82),F.rotation.y=y*.35,this.head.add(F)}}const A=C(t.hair.color);for(const y of[-1,1]){const D=new M(new H(r*.3,r*.075,r*.06),A);D.position.set(y*r*.35,r*.3,r*.87),D.rotation.z=y*-.12,this.head.add(D)}const R=new M(new _e(r*.16,r*.035,6,14,Math.PI),E);R.position.set(0,-r*.38,r*.9),R.rotation.set(0,0,Math.PI),this.head.add(R);const w=this.head.children.length;this.buildHair(r),this.cabelo=this.head.children.slice(w),this.buildAccessories(r,u,l,h,a,c,i),this.body.add(this.head),this.group.add(this.body),this.blob=new M(new Ls(e*.16*i,18),Xe(2832939,.22,!0)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(y=>{y.isMesh&&y!==this.blob&&(y.castShadow=!0,y.receiveShadow=!1)})}buildHair(t){const{style:e,color:i}=this.spec.hair,s=C(i),o=(a,r,c=.62,l=0)=>{const h=new M(new Rt(t*a,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),s);return h.position.y=r,this.head.add(h),h};switch(e){case"raspado":{o(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{o(1.06,t*.04).scale.set(1,.95,.98);const r=new M(new H(t*1.5,t*.34,t*.42),s);r.position.set(0,t*.6,t*.62),r.rotation.x=-.18,this.head.add(r);break}case"franja":{o(1.07,t*.02);const a=new M(new nt(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),s);a.position.set(0,t*.5,0),this.head.add(a);break}case"ondulado":{o(1.08,t*.02);for(const a of[-1,1]){const r=new M(new Rt(t*.46,12,10),s);r.position.set(a*t*.85,t*.1,-t*.1),r.scale.set(.8,1.15,1),this.head.add(r)}break}case"coque":{o(1.06,t*.02);const a=new M(new Rt(t*.42,12,10),s);a.position.set(0,t*.72,-t*.82),this.head.add(a);break}case"cachos-curtos":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?C(this.spec.hair.tips):s;o(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[u,d,p,g]of l)for(let v=0;v<d;v++){const m=v/d*Math.PI*2+u*1.9,f=Math.sin(u)*Math.cos(m),S=Math.cos(u),x=Math.sin(u)*Math.sin(m);if(S<.72&&x>.24)continue;const _=new M(new Rt(t*p*(1+(a-1)*.4),8,7),h%5===0?r:s),P=g*(1+(a-1)*.14),E=x>0?.9:1.02;_.position.set(f*t*P,S*t*P,x*t*P*E),this.head.add(_),h++}for(let u=0;u<5;u++){const d=new M(new Rt(t*.2*(1+(a-1)*.3),8,7),u===2?r:s);d.position.set((u-2)*t*.3,t*(.62-u%2*.07),t*.62),this.head.add(d)}for(let u=0;u<3;u++){const d=new M(new Rt(t*.24*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1)*t*.3,t*(.84+u%2*.07),t*.44),this.head.add(d)}for(const u of[-1,1]){const d=new M(new Rt(t*.17,8,7),s);d.position.set(u*t*.9,-t*.12,t*.22),d.scale.set(.7,1.1,.85),this.head.add(d)}break}case"cacheado":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?C(this.spec.hair.tips):s;o(1+(a-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[u,d,p,g]of l)for(let v=0;v<d;v++){const m=v/d*Math.PI*2+u*2.3,f=Math.sin(u)*Math.cos(m),S=Math.cos(u),x=Math.sin(u)*Math.sin(m);if(u>.72&&x>.22)continue;const _=1+(a-1)*.55,P=new M(new Rt(t*p*_,8,7),h%4===0?r:s),E=g*(1+(a-1)*.28),A=x>0?.78:1.06;P.position.set(f*t*E,S*t*E,x*t*E*A),this.head.add(P),h++}for(let u=0;u<4;u++){const d=new M(new Rt(t*.22*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1.5)*t*.34,t*(.62-u%2*.08),t*.62),this.head.add(d)}for(const u of[-1,1]){const d=new M(new Rt(t*.26*a,8,7),s);d.position.set(u*t*1.02*a,-t*.34,t*.28),d.scale.set(.8,1.25,.9),this.head.add(d)}break}}}buildAccessories(t,e,i,s,o,a,r){const c=this.spec.accessories??[],l=C(this.spec.accessoryColor??3093568);{const h=new M(new nt(t*.7,t*.7,t*.11,16),C(16774096));h.position.y=t*1.42,this.chapeu.add(h);const u=new M(new Ne(t*.58,t*1.05,14),C(b.gold));u.position.y=t*1.98,this.chapeu.add(u);const d=Oa(t*.3,t*.07,C(16774096));d.position.y=t*2.62,this.chapeu.add(d),this.chapeu.rotation.z=-.14,this.chapeu.visible=!1,this.head.add(this.chapeu)}if(c.includes("oculos")){for(const u of[-1,1]){const d=new M(new _e(t*.24,t*.045,8,16),l);d.position.set(u*t*.36,t*.06,t*.9),this.head.add(d)}const h=new M(new H(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new M(new Rt(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const u=new M(new nt(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);u.position.set(0,t*.12,t*.28),u.rotation.x=-.12,this.head.add(u)}if(c.includes("barba")){const h=new M(new Rt(t*.72,14,12),C(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new M(new _e(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const u of[-1,1]){const d=new M(new nt(t*.28,t*.28,t*.16,12),l);d.position.set(u*t*1.02,t*.02,0),d.rotation.z=Math.PI/2,this.head.add(d)}}if(c.includes("corrente")){const h=new M(new _e(t*.42,t*.035,6,20),C(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new M(new nt(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,u=Oa(t*.3,t*.06,C(15918799));u.position.set(-t*.78*h,t*.92*h,t*.62*h),u.rotation.set(.35,-.6,.3),this.head.add(u)}if(c.includes("laco")){const h=this.spec.height,u=new ot,d=h*.105*r,p=new M(new Rt(h*.018,8,6),l);u.add(p);for(const g of[-1,1]){const v=new M(new _e(h*.026,h*.007,6,12),l);v.position.set(g*h*.03,h*.008,0),v.rotation.set(0,g*.5,g*.35),v.scale.set(1,.7,1),u.add(v);const m=new M(new H(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,u.add(m)}u.position.set(0,i-o*.1,d*.86),this.body.add(u),this.soVestido.push(u),this.sobreTronco.push(u)}if(c.includes("cinto")){const h=this.spec.height,u=h*.105*r,d=a+o*.08,p=new M(new nt(u*1.04,u*1.04,h*.032,16,1,!0),l);p.position.y=d,p.scale.z=.84,this.body.add(p),this.soVestido.push(p),this.sobreTronco.push(p);const g=new M(new H(h*.032,h*.03,h*.012),C(14210252));g.position.set(0,d,u*.9),this.body.add(g),this.soVestido.push(g),this.sobreTronco.push(g);const v=new M(new _e(h*.028,h*.004,5,12,Math.PI),C(14210252));v.position.set(u*.6,d-h*.012,u*.6),v.rotation.set(0,-.7,Math.PI),this.body.add(v),this.soVestido.push(v),this.sobreTronco.push(v);const m=Oa(h*.016,h*.004,C(14210252));m.position.set(u*.76,d-h*.05,u*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m),this.sobreTronco.push(m)}if(c.includes("mochila")){const h=new M(new H(s*1.7,o*.62,this.spec.height*.09),l);h.position.set(0,a+o*.6,-this.spec.height*.11*r),this.body.add(h),this.soVestido.push(h),this.sobreTronco.push(h);const u=i;for(const d of[-1,1]){const p=new M(new H(this.spec.height*.022,o*.5,this.spec.height*.02),l);p.position.set(d*s*.6,u-o*.2,this.spec.height*.085*r),this.body.add(p),this.soVestido.push(p),this.sobreTronco.push(p)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setCampeao(t){this.chapeu.visible=t}get campeao(){return this.chapeu.visible}setOutfit(t){this.traje=t,this.aplicarVisual()}aplicarVisual(){const t=this.traje==="banho";for(const a of this.trocaMaterial){if(t){a.mesh.material=a.banho;continue}if(this.mostraPele(a.slot,a.parte)){a.mesh.material=a.banho;continue}const r=this.roupa[a.slot];if(!r){a.mesh.material=a.normal;continue}const c=a.parte==="detalhe"?r.corDetalhe??r.cor:r.cor;a.mesh.material=c===void 0?a.normal:C(c)}for(const a of this.soVestido)a.visible=!t;for(const a of this.soBanho)a.visible=t;const e=this.roupa.pernas,i=e?.corBanho===void 0?this.calcaoDaFicha:C(e.corBanho);this.calcao.material=i;for(const a of this.pernasDoShort)a.material=i;for(const a of this.estampa)a.visible=e?.estampaBanho!==void 0,e?.estampaBanho!==void 0&&(a.material=C(e.estampaBanho));if(!t&&this.roupa.tronco)for(const a of this.sobreTronco)a.visible=!1;for(const[a,r]of this.extras){const c=this.roupa[a]!==void 0&&(a==="cabeca"||!t)&&!(a==="pes"&&this.patinando);for(const l of r)l.visible=c}for(const a of this.pes)a.visible=!this.patinando;for(const a of this.patins)a.visible=this.patinando;const o=this.roupa.cabeca?.cobreCabelo===!0;for(const a of this.cabelo)a.visible=!o}mostraPele(t,e){for(const i of Object.values(this.roupa))if(i&&(i.pernasNuas&&t==="pernas"&&!this.roupa.pernas||i.bracosNus&&t==="tronco"&&e==="detalhe"))return!0;return!1}vestirRoupa(t){for(const e of dn){const i=t[e]??null;if((this.roupa[e]?.id??null)===i)continue;this.tirarExtras(e);const s=i?Io(i):null;this.roupa[e]=s??void 0,s?.extra&&this.porExtras(e,s)}this.aplicarVisual()}get roupaAtual(){const t={};for(const e of dn){const i=this.roupa[e];i&&(t[e]=i.id)}return t}porExtras(t,e){if(!e.extra&&!e.extraBraco)return;const i=[];e.extra&&(t==="pes"||t==="pernas"?i.push([this.legL,"corpo",-1],[this.legR,"corpo",1]):t==="cabeca"?i.push([this.head,"corpo",1]):i.push([this.body,"corpo",1])),e.extraBraco&&i.push([this.armL,"braco",-1],[this.armR,"braco",1]);const s=[];for(const[o,a,r]of i){const c=a==="braco"?e.extraBraco(this.medidas,r):e.extra(this.medidas,r);c.userData.roupa=e.id,c.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!1)}),o.add(c),s.push(c)}this.extras.set(t,s)}tirarExtras(t){const e=this.extras.get(t);if(e){for(const i of e)i.parent?.remove(i),i.traverse(s=>{const o=s;o.isMesh&&o.geometry.dispose()});this.extras.delete(t)}}setSitting(t){this.sitting=t,t||(this.poeAltura(0),this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setLying(t){this.deitado=t,t||(this.poeAltura(0),this.legL.rotation.set(0,0,0),this.legR.rotation.set(0,0,0),this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08),this.body.rotation.x=0)}setPatins(t){if(this.patinando!==t){this.patinando=t;for(const e of this.patins)e.position.y=-this.alturaDaPerna-this.altoDoPatins;this.aplicarVisual()}}get patinandoAgora(){return this.patinando}segurar(t,e="none"){for(let i=this.maoDir.children.length-1;i>=0;i--)this.maoDir.remove(this.maoDir.children[i]);this.pose=t?e:"none",t&&this.maoDir.add(t)}get segurando(){return this.maoDir.children.length>0}setHoldingHands(t){this.maos=t}get holdingHands(){return this.maos!==0}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let i=this.targetFacing-this.group.rotation.y;if(i=Math.atan2(Math.sin(i),Math.cos(i)),this.group.rotation.y+=i*Math.min(1,t*14),this.beijo>.001){const c=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=c*.3,this.poeAltura(c*.045),this.armL.rotation.set(-c*.55,0,.08+c*.16),this.armR.rotation.set(-c*.55,0,-.08-c*.16),this.head.rotation.x=c*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.deitado){this.phase+=t*.55,this.legL.rotation.set(0,0,-.05),this.legR.rotation.set(0,0,.05);const c=Math.sin(this.phase)*.07,l=Math.sin(this.phase*.73)*.05;this.armL.rotation.set(l,0,-.14-c),this.armR.rotation.set(-l,0,.14+c),this.body.rotation.x=Math.sin(this.phase)*.02,this.head.rotation.x=Math.sin(this.phase*.6)*.025,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9;const c=Math.sin(this.phase*2.2)*.17;this.legL.rotation.x=-Math.PI/2+.06+c,this.legR.rotation.x=-Math.PI/2-.02-c,this.armL.rotation.set(-.25,0,-.34),this.armR.rotation.set(-.2,0,.34),this.maos!==0&&(this.maos<0?this.armL:this.armR).rotation.set(.12,0,jl*.8*this.maos),this.body.rotation.x=-.05,this.poeAltura(Math.sin(this.phase)*.012),this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const c=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+c*.9,this.armR.rotation.x=-1.1-c*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=c*.28,this.legR.rotation.x=-c*.28,this.body.rotation.x=.16,this.poeAltura(Math.sin(this.phase)*.03),this.head.rotation.x=-.14;return}const s=e>.05,o=this.patinando?.9+e*.33:3.2+e*1.9;this.phase+=t*(s?o:1.4);const a=s?this.patinando?Math.min(.34,.12+e*.06):Math.min(.62,.16+e*.14):.04,r=Math.sin(this.phase*(s?2:1));if(this.patinando){const c=s?Math.min(.28,.1+e*.04):.03;this.legL.rotation.z=-Math.max(0,r)*c*1.7,this.legR.rotation.z=Math.max(0,-r)*c*1.7,this.legL.rotation.x=s?r*a*.25:0,this.legR.rotation.x=s?-r*a*.25:0,this.body.rotation.z=r*c*.34;const l=.34+Math.abs(r)*.14;this.armL.rotation.x=s?-r*a*.9:0,this.armR.rotation.x=s?r*a*.9:0,this.armL.rotation.z=-l,this.armR.rotation.z=l}else this.legL.rotation.z=0,this.legR.rotation.z=0,this.body.rotation.z=0,this.legL.rotation.x=s?r*a:0,this.legR.rotation.x=s?-r*a:0,this.armL.rotation.x=s?-r*a*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=s?r*a*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08;if(this.maos!==0){const c=this.maos<0?this.armL:this.armR,l=this.maos<0?this.armR:this.armL;c.rotation.z=jl*this.maos,c.rotation.x=-.1,l.rotation.x*=.5}if(this.aplicarPose(),this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const c=Math.sin((1-this.bounce)*Math.PI)*.28;this.poeAltura(c),this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const c=s?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.poeAltura(c),this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=s?this.patinando?.16:.06:0,this.head.rotation.x=s?-.05:Math.sin(this.phase*.6)*.03}poeAltura(t){this.body.position.y=t+this.altoDoPatins*(this.patinando?1:0)}aplicarPose(){if(this.pose==="none"||this.maos>0){this.maoDir.rotation.set(0,0,0),this.maoDir.position.x=0;return}const t=L1[this.pose];this.armR.rotation.x=t.bracoX+this.armR.rotation.x*t.balanco,this.armR.rotation.z=t.bracoZ,this.maoDir.rotation.set(-this.armR.rotation.x,0,t.itemZ-this.armR.rotation.z),this.maoDir.position.x=t.itemX}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class D1{renderer;cena=new Ch;camera=new sn(30,1,.1,20);pedestal=new ot;rig=null;spec=null;giro=0;alvo=0;constructor(t){this.renderer=new Yh({canvas:t,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.cena.add(this.pedestal);const e=new Hh(16777215,8952234,1.5);this.cena.add(e);const i=new Lr(16774368,1.5);i.position.set(3,5,4),this.cena.add(i);const s=new Lr(12572927,.5);s.position.set(-3,2,-3),this.cena.add(s)}mostrar(t){if(this.spec?.id===t.id)return;this.rig&&(this.pedestal.remove(this.rig.group),this.rig.dispose()),this.spec=t,this.rig=new Gr(t),this.pedestal.add(this.rig.group);const e=t.height;this.rig.group.position.y=-e*.5,this.camera.position.set(0,e*.04,e*2.28),this.camera.lookAt(0,0,0)}vestir(t){this.rig?.vestirRoupa(t)}girar(t){this.alvo+=t}update(t){this.rig&&(this.giro+=(this.alvo-this.giro)*Math.min(1,t*9),this.pedestal.rotation.y=this.giro,this.rig.update(t,0))}desenhar(){if(!this.rig)return;const t=this.renderer.domElement,e=t.clientWidth,i=t.clientHeight;e<2||i<2||((t.width!==e||t.height!==i)&&this.renderer.setSize(e,i,!1),this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.render(this.cena,this.camera))}dispose(){this.rig?.dispose(),this.rig=null,this.spec=null,this.renderer.dispose()}}class U1{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;if(!this.enabled){this.hot=!1,this.pulse=0,this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const i=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(i*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(i*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}class N1{constructor(t){this.game=t}root=new ot;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,i,s,o=0){return t.position.set(e,i,s),t.rotation.y=o,t}chaoAcimaDeOutro(t){return(t??0)>0}ground(t){const e=new Ue(t.width,t.depth,1,1),i=this.chaoAcimaDeOutro(t.y),s=new M(e,C(t.color,{decal:i}));return s.rotation.x=-Math.PI/2,s.position.set(t.x??0,t.y??0,t.z??0),i?this.decalar(s):(s.receiveShadow=!0,this.root.add(s),s)}groundWithHoles(t){const e=t.width/2,i=t.depth/2,s=new Xo;s.moveTo(-e,-i),s.lineTo(e,-i),s.lineTo(e,i),s.lineTo(-e,i),s.closePath();for(const r of t.holes){const c=new Pr,l=r.x-r.width/2,h=r.x+r.width/2,u=-r.z-r.depth/2,d=-r.z+r.depth/2;c.moveTo(l,u),c.lineTo(h,u),c.lineTo(h,d),c.lineTo(l,d),c.closePath(),s.holes.push(c)}const o=this.chaoAcimaDeOutro(t.y),a=new M(new pc(s),C(t.color,{decal:o}));return a.rotation.x=-Math.PI/2,a.position.set(t.x??0,t.y??0,t.z??0),o?this.decalar(a):(a.receiveShadow=!0,this.root.add(a),a)}decalar(t){return t.renderOrder=++this.decalque,t.receiveShadow=!0,this.root.add(t),t}patch(t,e,i,s,o,a=0,r=.01){const c=new M(new Ue(i,s),C(o,{decal:!0}));return c.rotation.set(-Math.PI/2,0,0),c.rotation.z=a,c.position.set(t,r,e),this.decalar(c)}disc(t,e,i,s,o=.01){const a=new M(new Ls(i,28),C(s,{decal:!0}));return a.rotation.x=-Math.PI/2,a.position.set(t,o,e),this.decalar(a)}ring(t,e,i,s,o,a=.01){const r=new fc(Math.max(0,i-s),i,40),c=new M(r,C(o,{decal:!0}));return c.rotation.x=-Math.PI/2,c.position.set(t,a,e),this.decalar(c)}blockBox(t,e,i,s,o=0){this.colliders.push({kind:"box",x:t,z:e,hw:i,hd:s,rot:o})}blockCircle(t,e,i){this.colliders.push({kind:"circle",x:t,z:e,r:i})}blockFrom(t,e=.9){const i=new ss().setFromObject(t),s=i.getSize(new N),o=i.getCenter(new N);this.blockBox(o.x,o.z,s.x/2*e,s.z/2*e,0)}setBounds(t,e,i,s){this.bounds={minX:t,minZ:e,maxX:i,maxZ:s}}wall(t,e,i,s,o=3,a=15984595,r=.3){const c=i-t,l=s-e,h=Math.hypot(c,l),u=Math.atan2(l,c),d=new M(new H(h,o,r),C(a));return d.position.set((t+i)/2,o/2,(e+s)/2),d.rotation.y=-u,this.add(d),this.blockBox((t+i)/2,(e+s)/2,h/2,r/2,-u),d}interact(t){const e=new U1(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}banco(t,e,i=0,s){const o=this.add(this.place(Jh(s),t,0,e,i));this.blockBox(t,e,.95,.35,i);const a=new ye;a.position.set(t,0,e),a.rotation.y=i+Math.PI,this.root.add(a);const r=new ye;r.position.set(t,.9,e),this.root.add(r);const c=.06,l=.46;return this.interact({id:`banco:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:1.9,label:"Sentar no banco",icon:"🪑",highlight:o,onInteract:async h=>{h.lockPlayer(!0),h.ridePlayer(a,new N(-l,c,.02),1,Math.PI),h.rideCompanion(a,new N(l,c,.02),1,Math.PI),h.setSitting(!0),h.focusCamera(r),await h.wait(.5),await h.say(["Senta aqui um pouco."],h.companionName()),await h.say(["Só um pouquinho."],h.playerName());let u=0;for(;u===0;)u=await h.ask("Ficar mais um pouco?",["Ficar","Levantar"]),u===0&&await h.wait(4);h.setSitting(!1),h.focusCamera(null);const d=i,p=Math.sin(d)*1.5,g=Math.cos(d)*1.5;h.releasePlayer(t+p-Math.cos(d)*.5,e+g+Math.sin(d)*.5,d),h.releaseCompanion(t+p+Math.cos(d)*.5,e+g-Math.sin(d)*.5,d),h.lockPlayer(!1)}}),o}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}const xn={x:.5,y:.44},_n=n=>1/(1+8.5*n),F1=(n,t,e,i,s)=>{const o=_n(e);return{x:(xn.x+n*o)*i,y:(xn.y+t*o)*s}},ln=.56,Yl=-.44,vn=.62,za=-.28,Zl=-.34,Mn={ariCabelo:"#8f5c33",ariRoupa:"#e8e2d6",ariPele:"#f2cfb2",renanCabelo:"#1f1712",renanRoupa:"#1b1c22",renanPele:"#efc8a4",perna:"#15161c"},Ae={ceuTopo:"#0a1120",ceuBaixo:"#2b3d58",vigaFrente:"#6d4028",vigaBaixo:"#3c2115",longarina:"#7d4d31",tijolo:"#b1613f",tijoloSombra:"#7e4029",tijoloJunta:"#cd8461",base:"#8a8781",chaoPerto:"#8b7a51",chaoLonge:"#4a4536",junta:"#6f6650",tatil:"#77746b",tatilRisco:"#95928a",folhaClara:"#2c5741",folhaEscura:"#16301f",fio:"#5d5346",luz:"#ffd489",luzNucleo:"#fff8e6"},ge={ceuTopo:"#1f74c8",ceuBaixo:"#a9d9f2",mataLonge:"#4d7f4a",mataPerto:"#356b39",gramaAlta:"#8fae55",gramaBaixa:"#a8bd68",sombra:"#5f7a3c",inflavelClaro:"#eeeae2",inflavelCinza:"#cfd2d4",inflavelRosa:"#f06a9c",bannerXadrez:"#3f8fd1",bannerFundo:"#fbfaf6",bannerRosa:"#ef5ba1",bannerTexto:"#e0357f",gato:"#fdfcf9",gatoTraco:"#3b3630",lacoVermelho:"#e0342f",verdeBrinquedo:"#57bd45",verdeBrinquedoFundo:"#3f9a32",azulBrinquedo:"#3aa9e8",azulBrinquedoFundo:"#2681bd",amareloBrinquedo:"#f5c518",roxoBrinquedo:"#8f5cc4",torre:"#f5822c",grade:"#3f6fbd"},Jl=["#e8442f","#f5c518","#3d9be0","#f07ab0","#f7f4ec","#6fc04a","#f5822c","#a069c4"];function O1(n,t,e,i,s){n.strokeStyle=s,n.lineCap="round",n.lineWidth=Math.max(1.2,i*.04),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(t-i*.07,e-i*.55,t,e-i),n.stroke();const o=e-i;n.lineWidth=Math.max(1.6,i*.1);for(let a=0;a<9;a++){const r=-Math.PI*.94+a/8*Math.PI*.88,c=i*(.42+.14*Math.sin(a*1.7));n.beginPath(),n.moveTo(t,o+i*.04),n.quadraticCurveTo(t+Math.cos(r)*c*.62,o+Math.sin(r)*c*.58,t+Math.cos(r)*c,o+Math.sin(r)*c+c*.34),n.stroke()}}function z1(n,t,e,i,s){if(i>1.4){const o=n.createRadialGradient(t,e,0,t,e,i*6);o.addColorStop(0,`rgba(255, 206, 128, ${.58*s})`),o.addColorStop(.45,`rgba(255, 178, 96, ${.18*s})`),o.addColorStop(1,"rgba(255, 170, 90, 0)"),n.fillStyle=o,n.beginPath(),n.arc(t,e,i*6,0,Math.PI*2),n.fill()}n.fillStyle=Ae.luz,n.globalAlpha=s,n.beginPath(),n.arc(t,e,i,0,Math.PI*2),n.fill(),n.fillStyle=Ae.luzNucleo,n.beginPath(),n.arc(t,e,i*.45,0,Math.PI*2),n.fill(),n.globalAlpha=1}function Vo(n,t,e,i,s,o,a,r){const c=i*.3;n.strokeStyle=Mn.perna,n.lineWidth=i*.075,n.lineCap="round";for(const l of[-1,1])n.beginPath(),n.moveTo(t,e-i*.42),n.lineTo(t+l*c*.26*a,e),n.stroke();if(r){n.strokeStyle=r,n.lineWidth=i*.055;for(const l of[-1,1])n.beginPath(),n.moveTo(t+l*c*.42,e-i*.72),n.lineTo(t+l*c*.52,e-i*.44),n.stroke()}n.fillStyle=s,n.beginPath(),n.roundRect(t-c/2,e-i*.78,c,i*.4,c*.32),n.fill(),n.fillStyle=o,n.beginPath(),n.arc(t,e-i*.87,i*.11,0,Math.PI*2),n.fill()}function Ba(n,t,e,i,s,o,a,r,c,l){const h=(t+i)/2,u=(e+s)/2+o,d=p=>{const g=1-p;return{x:g*g*t+2*g*p*h+p*p*i,y:g*g*e+2*g*p*u+p*p*s}};n.strokeStyle="rgba(240, 240, 235, 0.85)",n.lineWidth=Math.max(.8,a*.05),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(h,u,i,s),n.stroke();for(let p=0;p<r;p++){const g=(p+.5)/r,v=d(Math.max(0,g-.012)),m=d(Math.min(1,g+.012)),f=m.x-v.x,S=m.y-v.y,x=Math.hypot(f,S)||1,_=-S/x,P=f/x,E=Math.sin(l*1.1+p*.8)*a*.06;n.fillStyle=Jl[(p+c)%Jl.length],n.beginPath(),n.moveTo(v.x,v.y),n.lineTo(m.x,m.y),n.lineTo((v.x+m.x)/2-_*a+E,(v.y+m.y)/2-P*a),n.closePath(),n.fill()}}function B1(n,t,e,i){n.fillStyle=ge.gato;for(const s of[-1,1])n.beginPath(),n.moveTo(t+s*i*.92,e-i*.28),n.lineTo(t+s*i*.62,e-i*1.15),n.lineTo(t+s*i*.16,e-i*.6),n.closePath(),n.fill();n.beginPath(),n.ellipse(t,e,i,i*.82,0,0,Math.PI*2),n.fill(),n.fillStyle=ge.lacoVermelho;for(const s of[-1,1])n.beginPath(),n.ellipse(t+i*(.78+s*.24),e-i*.5,i*.26,i*.2,0,0,Math.PI*2),n.fill();n.fillStyle=ge.gatoTraco;for(const s of[-1,1])n.beginPath(),n.ellipse(t+s*i*.36,e-i*.02,i*.09,i*.13,0,0,Math.PI*2),n.fill();n.fillStyle=ge.amareloBrinquedo,n.beginPath(),n.ellipse(t,e+i*.14,i*.11,i*.08,0,0,Math.PI*2),n.fill(),n.strokeStyle=ge.gatoTraco,n.lineWidth=Math.max(.5,i*.05);for(const s of[-1,1])for(let o=-1;o<=1;o++)n.beginPath(),n.moveTo(t+s*i*.6,e+i*.1+o*i*.14),n.lineTo(t+s*i*1.02,e+i*.04+o*i*.2),n.stroke()}function So(n,t,e,i,s,o,a){const r=Math.min(s*.42,i*.2);n.fillStyle=o,n.beginPath(),n.roundRect(t,e,i,s,r),n.fill(),n.strokeStyle=a,n.lineWidth=Math.max(.7,s*.045);const c=Math.max(2,Math.round(i/(s*.75)));for(let l=1;l<c;l++){const h=t+i*l/c;n.beginPath(),n.moveTo(h,e+s*.14),n.lineTo(h,e+s*.86),n.stroke()}n.strokeStyle="rgba(255, 255, 255, 0.34)",n.lineWidth=Math.max(.8,s*.07),n.beginPath(),n.moveTo(t+r,e+s*.16),n.lineTo(t+i-r,e+s*.16),n.stroke()}function k1(n,t,e,i){const s=(x,_,P)=>F1(x,_,P,t,e),o=xn.y*e,a=n.createLinearGradient(0,0,0,o);a.addColorStop(0,Ae.ceuTopo),a.addColorStop(1,Ae.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,o);const r=n.createLinearGradient(0,o,0,e);r.addColorStop(0,Ae.chaoLonge),r.addColorStop(1,Ae.chaoPerto),n.fillStyle=r,n.fillRect(0,o,t,e-o);const c=n.createRadialGradient(xn.x*t,e*.86,0,xn.x*t,e*.86,t*.62);c.addColorStop(0,"rgba(255, 196, 122, 0.3)"),c.addColorStop(1,"rgba(255, 190, 120, 0)"),n.fillStyle=c,n.fillRect(0,o,t,e-o),n.strokeStyle=Ae.junta;for(let x=0;x<26;x++){const _=x*.036,P=s(-vn,ln,_),E=s(vn,ln,_);n.globalAlpha=Math.min(.42,.42*_n(_)*3.2),n.lineWidth=Math.max(.5,3*_n(_)),n.beginPath(),n.moveTo(P.x,P.y),n.lineTo(E.x,E.y),n.stroke()}n.globalAlpha=.22,n.lineWidth=1;for(let x=-6;x<=6;x++){if(x===0)continue;const _=s(x*.1,ln,0);n.beginPath(),n.moveTo(xn.x*t,xn.y*e),n.lineTo(_.x,_.y),n.stroke()}n.globalAlpha=1;const l=s(-.05,ln,0),h=s(.05,ln,0),u=s(-.05,ln,.97),d=s(.05,ln,.97);n.fillStyle=Ae.tatil,n.beginPath(),n.moveTo(l.x,l.y),n.lineTo(h.x,h.y),n.lineTo(d.x,d.y),n.lineTo(u.x,u.y),n.closePath(),n.fill(),n.strokeStyle=Ae.tatilRisco;for(let x=0;x<22;x++){const _=x*.042,P=s(-.038,ln,_),E=s(.038,ln,_);n.lineWidth=Math.max(.5,3.2*_n(_)),n.beginPath(),n.moveTo(P.x,P.y),n.lineTo(E.x,E.y),n.stroke()}for(let x=5;x>=0;x--){const _=.12+x*.15,P=_n(_);for(const E of[-1,1]){const A=s(E*(vn+.13),ln,_);O1(n,A.x,A.y,e*.85*P,x%2===0?Ae.folhaEscura:Ae.folhaClara)}}for(let x=7;x>=0;x--){const _=x*.115,P=_n(_),E=t*.085*P;for(const A of[-1,1]){const R=s(A*vn,ln,_),w=s(A*vn,za,_),y=R.x-E/2;n.fillStyle=Ae.tijolo,n.fillRect(y,w.y,E,R.y-w.y),n.fillStyle=Ae.tijoloSombra,n.fillRect(A<0?y+E*.68:y,w.y,E*.32,R.y-w.y);const D=(R.y-w.y)*.09;if(n.fillStyle=Ae.base,n.fillRect(y-E*.06,R.y-D,E*1.12,D),_<.3){n.strokeStyle=Ae.tijoloJunta,n.lineWidth=Math.max(.5,1.6*P),n.globalAlpha=.5;const F=R.y-D;for(let z=1;z<14;z++){const V=w.y+(F-w.y)*z/14;n.beginPath(),n.moveTo(y,V),n.lineTo(y+E,V),n.stroke()}n.globalAlpha=1}}}n.strokeStyle=Ae.longarina,n.lineCap="butt";for(const x of[-1,1]){const _=s(x*vn*1.05,za,0),P=s(x*vn*1.05,za,.95);n.lineWidth=t*.03,n.beginPath(),n.moveTo(_.x,_.y),n.lineTo(P.x,P.y),n.stroke()}for(let x=17;x>=0;x--){const _=x*.052,P=_n(_),E=s(-vn*1.16,Yl,_),A=s(vn*1.16,Yl,_),R=Math.max(1,e*.05*P);n.fillStyle=Ae.vigaFrente,n.fillRect(E.x,E.y,A.x-E.x,R),n.fillStyle=Ae.vigaBaixo,n.fillRect(E.x,E.y+R*.62,A.x-E.x,R*.38)}const p=9;for(let x=0;x<p;x++){const _=.02+x*.095,P=_+.095,E=x%2===0?-1:1,A=s(E*vn*1.02,Zl,_),R=s(-E*vn*1.02,Zl,P),w=e*.06*_n(_),y=(A.x+R.x)/2,D=(A.y+R.y)/2+w;n.strokeStyle=Ae.fio,n.lineWidth=Math.max(.4,1.8*_n(_)),n.beginPath(),n.moveTo(A.x,A.y),n.quadraticCurveTo(y,D,R.x,R.y),n.stroke();const F=7;for(let z=0;z<=F;z++){const V=z/F,q=1-V,J=q*q*A.x+2*q*V*y+V*V*R.x,st=q*q*A.y+2*q*V*D+V*V*R.y,$=_n(_+(P-_)*V),at=.82+.18*Math.sin(i*1.6+x*2.1+z*.9);z1(n,J,st+e*.012*$,Math.max(.7,t*.015*$),at)}}const g=n.createRadialGradient(xn.x*t,xn.y*e-e*.02,0,xn.x*t,xn.y*e-e*.02,t*.085);g.addColorStop(0,"rgba(255, 232, 182, 0.9)"),g.addColorStop(.35,"rgba(255, 196, 118, 0.34)"),g.addColorStop(1,"rgba(255, 180, 100, 0)"),n.fillStyle=g,n.fillRect(0,0,t,e);const v=Math.sin(i*2.4),m=s(0,ln,.66),f=e*.5*_n(.66);Vo(n,m.x-f*.34,m.y,f,Mn.ariRoupa,Mn.ariCabelo,v),Vo(n,m.x+f*.34,m.y,f,Mn.renanRoupa,Mn.renanCabelo,-v),n.fillStyle="rgba(255, 176, 96, 0.07)",n.fillRect(0,0,t,e);const S=n.createRadialGradient(t/2,e*.48,t*.2,t/2,e*.48,t*.78);S.addColorStop(0,"rgba(0, 0, 0, 0)"),S.addColorStop(1,"rgba(6, 9, 16, 0.62)"),n.fillStyle=S,n.fillRect(0,0,t,e)}function V1(n,t,e,i){const o=.585*e,a=n.createLinearGradient(0,0,0,o);a.addColorStop(0,ge.ceuTopo),a.addColorStop(1,ge.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,o);for(const[S,x,_,P]of[[-.05,.5,.15,ge.mataLonge],[.42,1.05,.125,ge.mataLonge],[-.05,1.05,.08,ge.mataPerto]]){n.fillStyle=P,n.beginPath(),n.moveTo(S*t,o);for(let E=S;E<=x;E+=.035){const A=o-_*e*(.6+.4*Math.abs(Math.sin(E*27)));n.lineTo(E*t,A)}n.lineTo(x*t,o),n.closePath(),n.fill()}const r=.235*e;n.fillStyle=ge.inflavelClaro,n.beginPath(),n.moveTo(0*t,o),n.lineTo(.245*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,o),n.closePath(),n.fill(),n.fillStyle=ge.inflavelCinza,n.beginPath(),n.moveTo(0*t,o),n.lineTo(.245*t,r),n.lineTo(.315*t,r),n.lineTo(.14*t,o),n.closePath(),n.fill(),n.fillStyle=ge.inflavelCinza,n.beginPath(),n.moveTo(.235*t,r+.012*e),n.lineTo(.325*t,.175*e),n.lineTo(.412*t,r+.012*e),n.closePath(),n.fill(),n.fillStyle=ge.inflavelRosa,n.beginPath(),n.moveTo(.055*t,o-.075*e),n.lineTo(.47*t,o-.075*e),n.lineTo(.485*t,o-.035*e),n.lineTo(.04*t,o-.035*e),n.closePath(),n.fill(),n.fillStyle="rgba(112, 126, 138, 0.34)",n.beginPath(),n.moveTo(.325*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,o),n.lineTo(.33*t,o),n.closePath(),n.fill(),n.fillStyle="rgba(84, 95, 105, 0.5)",n.beginPath(),n.roundRect(.135*t,o-.075*e,.145*t,.04*e,.014*t),n.fill(),n.strokeStyle="rgba(138, 148, 156, 0.75)",n.lineWidth=Math.max(.8,e*.0045);for(let S=1;S<6;S++){const x=S/6;n.beginPath(),n.moveTo((.245+x*.155)*t,r),n.lineTo((0+x*.5)*t,o),n.stroke()}const c=.42*t,l=.425*e,h=.62*t,u=.075*e;n.fillStyle=ge.bannerFundo,n.fillRect(c,l,h,u),n.fillStyle=ge.bannerXadrez;const d=u/3;for(let S=0;S<h;S+=d)for(let x=0;x<u;x+=d)(S<d*2.2||S>h-d*5.5)&&Math.round(S/d+x/d)%2===0&&n.fillRect(c+S,l+x,d,d);n.fillStyle=ge.bannerRosa,n.fillRect(c+h-d*4.4,l,d*4.4,u),n.fillStyle="rgba(255, 255, 255, 0.85)";for(let S=0;S<3;S++)n.fillRect(c+h-d*4,l+u*(.25+S*.2),d*3.4,u*.08);B1(n,c+h-d*6.4,l+u*.46,u*.4),n.fillStyle=ge.bannerTexto,n.font=`900 ${Math.round(u*.42)}px system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText("ARRAIÁ",c+h*.42,l+u*.5),n.textAlign="left",n.textBaseline="alphabetic",So(n,.05*t,o-.055*e,.13*t,.055*e,ge.roxoBrinquedo,"#6f45a0"),So(n,.36*t,o-.085*e,.12*t,.085*e,ge.azulBrinquedo,ge.azulBrinquedoFundo),So(n,.47*t,o-.05*e,.06*t,.05*e,ge.amareloBrinquedo,"#cf9f0e"),So(n,.52*t,o-.075*e,.5*t,.075*e,ge.verdeBrinquedo,ge.verdeBrinquedoFundo),n.strokeStyle=ge.grade,n.lineWidth=Math.max(.7,e*.0035);for(let S=0;S<9;S++){const x=(.19+S*.019)*t;n.beginPath(),n.moveTo(x,o-.035*e),n.lineTo(x,o),n.stroke()}n.beginPath(),n.moveTo(.185*t,o-.032*e),n.lineTo(.36*t,o-.032*e),n.stroke(),n.strokeStyle=ge.torre,n.lineWidth=Math.max(1.2,t*.008),n.beginPath(),n.moveTo(.9*t,o+.3*e),n.lineTo(.955*t,o-.09*e),n.moveTo(1.02*t,o+.3*e),n.lineTo(.985*t,o-.09*e),n.stroke(),n.lineWidth=Math.max(.8,t*.005);for(let S=0;S<7;S++){const x=S/7,_=o-.09*e+x*.39*e,P=o-.09*e+(S+1)/7*.39*e,E=.955+x*(.9-.955),A=.985+x*(1.02-.985),R=.955+(S+1)/7*(.9-.955),w=.985+(S+1)/7*(1.02-.985);n.beginPath(),n.moveTo(E*t,_),n.lineTo(w*t,P),n.moveTo(A*t,_),n.lineTo(R*t,P),n.stroke()}const p=n.createLinearGradient(0,o,0,e);p.addColorStop(0,ge.gramaAlta),p.addColorStop(1,ge.gramaBaixa),n.fillStyle=p,n.fillRect(0,o,t,e-o),n.fillStyle="#c6b184",n.beginPath(),n.moveTo(0,o),n.lineTo(t,o),n.lineTo(t,o+.028*e);for(let S=1;S>=0;S-=.05)n.lineTo(S*t,o+(.026+.008*Math.sin(S*21))*e);n.closePath(),n.fill();const g=n.createRadialGradient(.44*t,.92*e,0,.44*t,.92*e,.62*t);g.addColorStop(0,"rgba(78, 100, 50, 0.34)"),g.addColorStop(.6,"rgba(78, 100, 50, 0.16)"),g.addColorStop(1,"rgba(78, 100, 50, 0)"),n.fillStyle=g,n.fillRect(0,o,t,e-o),n.fillStyle=ge.sombra,n.globalAlpha=.16;for(const[S,x,_,P,E]of[[.2,.87,.16,.045,.2],[.66,.9,.2,.05,-.15],[.38,.99,.3,.06,.05],[.86,.83,.13,.035,.3]])n.beginPath(),n.ellipse(S*t,x*e,_*t,P*e,E,0,Math.PI*2),n.fill();n.globalAlpha=1;const v=Math.sin(i*2.1),m=.185*e;Vo(n,.4*t,.86*e,m,Mn.ariRoupa,Mn.ariCabelo,v,Mn.ariPele),Vo(n,.49*t,.86*e,m,Mn.renanRoupa,Mn.renanCabelo,-v,Mn.renanPele),Ba(n,-.04*t,.1*e,1.04*t,.045*e,.028*e,.05*e,15,0,i),Ba(n,-.04*t,.235*e,1.04*t,.145*e,.03*e,.045*e,16,3,i),Ba(n,-.04*t,.33*e,1.04*t,.3*e,.026*e,.038*e,18,6,i),n.fillStyle="rgba(255, 236, 180, 0.09)",n.fillRect(0,0,t,e);const f=n.createRadialGradient(t/2,e*.5,t*.3,t/2,e*.5,t*.85);f.addColorStop(0,"rgba(0, 0, 0, 0)"),f.addColorStop(1,"rgba(20, 30, 40, 0.3)"),n.fillStyle=f,n.fillRect(0,0,t,e)}const qr=[{id:"o-pedido",titulo:"O pedido",lugar:"onde a gente começou, oficialmente",legenda:"As luzinhas iam até onde a gente não enxergava mais. A gente foi junto.",proporcao:3/4,pintar:k1},{id:"arraia",titulo:"O arraiá da Hello Kitty",lugar:"Parque Villa-Lobos, em junho",legenda:"Um campo inteiro de brinquedo inflável, e a gente parado olhando com cara de criança.",proporcao:3/4,pintar:V1}];class H1{constructor(t,e,i,s=Object.keys(e)[0]){this.root=t,this.scenes=e,this.dupla=i,this.cenaInicial=s,this.renderer=new Yh({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ah,t.appendChild(this.renderer.domElement),this.ui=new a1(t),this.previa=new D1(this.ui.canvasDoBoneco()),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onTouchGirar=a=>this.input.tapGirar(a),this.ui.onEscolherSlot=a=>this.setActiveHandSlot(a),this.ui.onMoverItem=(a,r)=>this.moveItem(a,r),this.ui.onDescartar=a=>this.descartarDaVaga(a),this.ui.onAbrirMochila=()=>this.pintarMochila(),this.ui.onAbrirArmario=()=>this.pintarArmario(),this.ui.onGirarBoneco=a=>this.previa.girar(a),this.ui.onTirarParte=a=>{this.tirarPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onVestirPeca=a=>{this.vestirPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onAbrirVestiario=()=>this.pintarVestiario(),this.ui.onAlternarOculos=()=>{const a=this.playerId(),r=dn.indexOf("cabeca");(this.save.vestiveis(a)[r]?.id===Jt.oculosEscuros.id?this.tirarPeca(a,r):this.vestirPeca(a,Jt.oculosEscuros.id))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onEscolherBermuda=a=>{const r=this.playerId(),c=dn.indexOf("pernas");(this.save.vestiveis(r)[c]?.id===a?this.tirarPeca(r,c):this.vestirPeca(r,a))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onTouchHold=a=>this.input.setVirtualDown("KeyF",a),this.ui.onRestart=()=>this.restart(),this.ui.som=a=>this.audio.play(a),this.ui.onToggleSom=()=>{this.audio.setMudo(this.audio.ligado),this.ui.setSom(this.audio.ligado),this.audio.ligado&&this.audio.play("menu")},this.ui.setSom(this.audio.ligado),this.input=new pv(this.renderer.domElement),this.hemi=new Hh(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new Lr(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const o=this.sun.shadow.camera;o.left=-22,o.right=22,o.top=22,o.bottom=-22,o.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new r1(new Gr(i[0])),this.scene.add(this.player.object),this.coracoes=new h1(this.scene),this.beijo=new p1(this.coracoes),this.beijo.onSom=a=>this.audio.play(a),this.maos=new y1(this.coracoes),this.maos.onSom=a=>this.audio.play(a),this.parceiro=new c1(new Gr(i[1]??i[0])),this.parceiro.setVisible(i.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new Ch;iso=new fv;input;ui;save=new _c;previa;player;parceiro;clock=new Rf;coracoes;beijo;maos;audio=new P1;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;naMao=new Map;trilha=0;elapsed=0;shadowSpan=0;traje="normal";moveDir=new N;camAim=new N;camOmbro=null;async start(t,e){const i=t??(this.scenes[this.save.scene]?this.save.scene:this.cenaInicial);this.build(i,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}restart(){this.save.reset(),this.ui.setMemories(this.save.memories),this.player.rig.spec.id!==this.dupla[0].id&&this.swapCharacters(),this.ui.showHints(),this.goTo(this.cenaInicial),this.audio.play("recomecar"),this.ui.toast("Do começo, então","🔄")}build(t,e){const i=this.scenes[t];if(!i)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const s=new N1(this);s.setSeed(G1(t)),i.build(s),this.scene.add(s.root),this.current={def:i,world:s},this.applyAmbient(i.ambient);const o=e&&i.entries?.[e]||i.spawn;this.player.teleport(o.x,o.z,o.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const a=(o.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(o.x+Math.sin(a)*1.3,o.z+Math.cos(a)*1.3,o.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.maos.soltar(this.player,this.parceiro),this.coracoes.limpar(),this.podeBeijar=!1,this.camOmbro=null,this.ui.showPlacar(null),this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(i.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(i.name,i.subtitle),this.audio.setClima(t),this.migrarPremios(),this.aplicarPremios(),this.save.scene=t}aplicarPremios(){this.sincronizarVestiveis()}migrarPremios(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id;this.save.flag(`chapeu-ping-pong:${e}`)&&(this.save.achouItem(e,Jt.chapeuPingPong.id)||this.save.vestir(e,Jt.chapeuPingPong))}}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new ae(t.sky),this.scene.fog=t.fog!==void 0?new rc(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const i=this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen||this.ui.memoriasOpen||this.transitioning;this.input.blocked=i||this.player.locked,this.input.justPressed("KeyJ")&&!this.ui.menuOpen&&this.ui.toggleJournal(),(this.input.justPressed("KeyI")||this.input.justPressed("Tab"))&&!this.ui.menuOpen&&!this.ui.dialogueOpen&&(this.ui.armarioOpen?this.ui.fecharArmario():this.ui.mochilaOpen?this.ui.closeMochila():this.abrirMochila()),this.ui.armarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharArmario(),this.ui.vestiarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharVestiario(),this.ui.memoriasOpen&&this.input.justPressed("Escape")&&this.ui.fecharMemorias(),this.ui.memoriasOpen&&(this.input.justPressed("ArrowLeft")&&this.ui.folhear(-1),this.input.justPressed("ArrowRight")&&this.ui.folhear(1)),(this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen?!this.ui.dialogueOpen&&!this.ui.menuOpen&&!this.transitioning:!i)&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),i||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1)),!i&&!this.player.locked&&this.input.justPressed("KeyH")&&this.maoNaMao();const a=this.input.justPressed("KeyE")||this.input.justPressed("Space");a&&this.ui.handleAction()||(a&&!i&&this.hot&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.audio.play("interagir"),this.hot.trigger(this)):a&&!i&&this.podeBeijar&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)):a&&!i&&!this.player.locked&&this.maoNaMao()),this.beijo.update(t,this.player,this.parceiro),this.maos.update(t,this.player,this.parceiro);const r=this.input.move();this.iso.screenToWorld(r.x,r.y,this.moveDir);const c=this.player.position.clone();this.player.update(this.moveDir,t,e.colliders,e.bounds),this.ouvirPassos(c),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.coracoes.update(t),this.sincronizarMaos(),this.sincronizarVestiveis(),this.updateHot(e,t),this.updateBeijo();for(const u of e.updaters)u(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const l=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(l);const h=l/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*h,this.camAim.y+20*h,this.camAim.z+9*h),this.renderer.render(this.scene,this.camOmbro??this.iso.camera),this.ui.armarioOpen&&(this.previa.update(t),this.previa.desenhar()),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.ui.menuOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro)}maoNaMao(){this.maos.ativo?(this.maos.soltar(this.player,this.parceiro),this.audio.play("escolha")):this.maos.disponivel(this.player,this.parceiro)&&this.maos.ligar(this.player,this.parceiro)}ouvirPassos(t){if(this.player.riding||this.player.locked)return;const e=Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z);if(e<5e-4){this.trilha=0;return}this.trilha+=e;const i=this.player.submersion>.05?1.05:.62;this.trilha>=i&&(this.trilha=0,this.audio.play(this.player.submersion>.05?"nadar":"passo"))}updateHot(t,e){let i=null,s=1/0,o=-1/0;const a=this.player.position.x,r=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(a,r);l>c.radius||c.priority<o||c.priority===o&&l>=s||(i=c,s=l,o=c.priority)}i!==this.hot&&(this.hot?.setHot(!1),i?.setHot(!0),this.hot=i,i&&!this.player.locked?this.ui.showPrompt(i.icon,i.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,i){return this.ui.ask(t,e,i??this.player.name)}toast(t,e){this.audio.play("toast"),this.ui.toast(t,e)}som(t){this.audio.play(t)}goTo(t,e){this.transitioning||(this.transitioning=!0,this.audio.play("porta"),(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setCameraOmbro(t,e){if(!t){this.camOmbro=null;return}this.camOmbro||(this.camOmbro=new sn(58,window.innerWidth/window.innerHeight,.1,400)),this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.position.copy(t),e&&this.camOmbro.lookAt(e),this.camOmbro.updateProjectionMatrix()}pointer(){return this.input.pointer()}showPlacar(t){this.ui.showPlacar(t)}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}addItem(t,e=this.playerId()){const i=this.save.pegar(e,t);return i==="cheio"&&this.ui.toast("Mochila cheia","🎒"),(i==="mao"||i==="guardado")&&this.repintarMochila(),i}storeItem(t,e=this.playerId()){const i=this.save.guardar(e,t);return i!=="cheio"&&i!=="repetido"&&this.repintarMochila(),i}removeItem(t,e=this.playerId()){const i=this.save.largar(e,t);return i&&this.repintarMochila(),i}hasItem(t,e=this.playerId()){return this.save.achouItem(e,t)}getActiveHandItem(t=this.playerId()){return this.save.itemAtivo(t)}setActiveHandSlot(t,e=this.playerId()){this.save.setSlotAtivo(e,t),this.repintarMochila()}activeHandSlot(t=this.playerId()){return this.save.slotAtivo(t)}equipWearable(t,e=this.playerId()){const i=this.save.vestir(e,t);return i&&this.repintarMochila(),i}unequipWearable(t,e=this.playerId()){this.save.despir(e,t),this.repintarMochila()}moveItem(t,e,i=this.playerId()){const s=this.save.mover(i,t,e);return s&&this.repintarMochila(),s}handItems(t=this.playerId()){return this.save.maos(t)}wearables(t=this.playerId()){return this.save.vestiveis(t)}wardrobeItems(t=this.playerId()){return this.save.acervo(t)}descartarDaVaga(t){const e=this.playerId(),s=(t.lista==="mao"?this.save.maos(e):this.save.vestiveis(e))[t.indice];s&&(this.save.largar(e,s.id),this.audio.play("escolha"),this.ui.toast(`${s.nome} foi descartado`,"🗑"),this.pintarMochila())}repintarMochila(){this.ui.mochilaOpen&&this.pintarMochila()}pintarMochila(){const t=this.playerId();this.ui.renderMochila(this.save.maos(t),this.save.vestiveis(t),this.save.slotAtivo(t),this.player.name)}abrirMochila(){this.ui.toggleMochila()}sincronizarVestiveis(){for(const t of[this.player,this.parceiro]){const e=t.rig.spec.id,i=this.save.vestiveis(e),s=i.some(c=>c?.id===Jt.chapeuPingPong.id);t.rig.campeao!==s&&t.rig.setCampeao(s);const o=i.some(c=>c?.id===Jt.patins.id);t.patins=o,t.rig.setPatins(o);const a=this.save.loadout(e),r=dn.map(c=>a[c]??"").join("|");this.roupaAplicada.get(e)!==r&&(this.roupaAplicada.set(e,r),t.rig.vestirRoupa(a))}}sincronizarMaos(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id,i=this.save.itemAtivo(e),s=i?.id??null;this.naMao.get(e)!==s&&(this.naMao.set(e,s),t.segurar(s?i1(s):null,i?.holdPose??"none"))}}roupaAplicada=new Map;vestirPeca(t,e){const i=this.save.acervo(t).find(a=>a.id===e)??this.save.maos(t).find(a=>a?.id===e)??null;if(!i)return!1;const s=i.slot?dn.indexOf(i.slot):-1;if(s<0)return!1;const o=this.save.vestiveis(t)[s];return this.save.largar(t,e),o&&this.save.despir(t,s),this.save.vestir(t,i),o&&this.save.guardar(t,o),!0}tirarPeca(t,e){const i=this.save.vestiveis(t)[e];return i?(this.save.despir(t,e),this.save.guardar(t,i)==="cheio"?(this.save.vestir(t,i),this.ui.toast("Mochila cheia","🎒"),!1):!0):!1}abrirGuardaRoupa(){this.previa.mostrar(this.player.rig.spec),this.pintarArmario(),this.ui.abrirArmario()}pintarArmario(){const t=this.playerId(),e=this.save.vestiveis(t),i=[...this.save.acervo(t),...this.save.maos(t).filter(s=>s!==null&&s.tipo==="vestivel")];this.ui.renderArmario(e,i,this.player.name),this.previa.vestir(this.save.loadout(t))}abrirVestiario(){this.pintarVestiario(),this.ui.abrirVestiario()}pintarVestiario(){const t=this.playerId(),e=this.save.vestiveis(t),i=e[dn.indexOf("cabeca")],s=e[dn.indexOf("pernas")],o=a=>`#${a.toString(16).padStart(6,"0")}`;this.ui.renderVestiario({dono:this.player.name,oculos:i?.id===Jt.oculosEscuros.id,bermudas:nu.filter(a=>this.save.achouItem(t,a.id)).map(a=>({id:a.id,nome:a.nome,cor:o(a.corBanho??16777215),faixa:a.estampaBanho===void 0?void 0:o(a.estampaBanho),vestida:s?.id===a.id}))})}abrirMemoria(t){const e=qr.findIndex(i=>i.id===t);e>=0&&this.ui.abrirMemorias(qr,e)}unlock(t){this.save.addMemory(t)&&(this.audio.play("memoria"),this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,i=Math.PI/4){this.player.teleport(t,e,i),this.parceiro.teleport(t-1.2,e-.4,i),this.iso.snapTo(this.player.chest)}get telaDeLeitura(){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.memoriasOpen}keyPressed(t){return this.telaDeLeitura||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.telaDeLeitura||this.player.locked?!1:this.input.isDown(t)}showCharge(t,e,i){this.audio.carga(t),this.ui.showCharge(t,e,i)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.riding?(this.player.object.updateWorldMatrix(!0,!1),this.player.object.getWorldPosition(new N)):this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}playerId(){return this.player.rig.spec.id}companionId(){return this.parceiro.rig.spec.id}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.riding?(this.parceiro.object.updateWorldMatrix(!0,!1),this.parceiro.object.getWorldPosition(new N)):this.parceiro.position.clone()}companionFacing(){return this.parceiro.rig.facing}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.maos.trocouCorpos(this.player,this.parceiro),this.audio.play("trocar"),this.ui.toast(`Agora você é ${this.player.name}`,"🔁"),this.ui.mochilaOpen&&this.pintarMochila(),this.ui.armarioOpen&&(this.previa.mostrar(this.player.rig.spec),this.pintarArmario()),this.ui.vestiarioOpen&&this.pintarVestiario()}submergePlayer(t){this.player.submersion=De.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=De.clamp(t,0,1)}rideCompanion(t,e,i=1,s=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(i),this.parceiro.rig.group.rotation.y=s,this.parceiro.rig.setFacing(s),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}holdCompanion(t,e){this.parceiro.hold(t,e)}setSitting(t){if(t&&this.audio.play("sentar"),this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t),!t){this.maos.ativo||(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0));return}const e=this.player.rig.group,i=this.parceiro.rig.group;e.updateWorldMatrix(!0,!1),i.updateWorldMatrix(!0,!1);const s=new N,o=new N;e.getWorldPosition(s),i.getWorldPosition(o);const r=new N(1,0,0).applyQuaternion(e.getWorldQuaternion(new is)).dot(o.sub(s))<0?-1:1;this.player.rig.setHoldingHands(r),this.parceiro.rig.setHoldingHands(r===1?-1:1)}setLying(t){t&&this.audio.play("sentar"),this.player.rig.setLying(t),this.parceiro.rig.setLying(t),!t&&!this.maos.ativo&&(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0))}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,i=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,i)}ridePlayer(t,e,i=1,s=Math.PI){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(i),this.player.rig.group.rotation.y=s,this.player.rig.setFacing(s),this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,i=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,i),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight),this.camOmbro&&(this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.updateProjectionMatrix())};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function G1(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Wr(n=3,t=2.2,e=b.rug){const i=new M(new H(n,.04,t),C(e));return i.position.y=.02,i.receiveShadow=!0,i}function q1(n=b.sofa,t=2.2){const e=new ot,i=new M(new H(t,.42,.9),C(n));i.position.y=.28,e.add(i);const s=new M(new H(t,.62,.24),C(n));s.position.set(0,.72,-.35),e.add(s);for(const a of[-1,1]){const r=new M(new H(.24,.5,.9),C(n));r.position.set(a*(t/2-.12),.62,0),e.add(r)}for(const[a,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new M(new nt(.05,.04,.14,6),C(b.woodDark));c.position.set(a*(t/2-.2),.07,r*.34),e.add(c)}const o=new M(new H(.36,.12,.34),C(b.flowerPink));return o.position.set(t/2-.5,.55,-.14),o.rotation.set(.9,.4,0),e.add(o),e}function W1(){const n=new ot,t=new M(new H(1.2,.08,.7),C(b.wood));t.position.y=.46,n.add(t);for(const[e,i]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const s=new M(new nt(.04,.04,.46,6),C(b.woodDark));s.position.set(e*.5,.23,i*.27),n.add(s)}return n}function X1(n=!1){const t=new ot,e=new M(new H(1.8,.5,.45),C(b.woodDark));e.position.y=.25,t.add(e);const i=new M(new H(1.5,.85,.08),C(2040361));i.position.y=.95,t.add(i);const s=new M(new Ue(1.36,.72),Xe(n?9426943:b.screen,1));return s.name="tela",s.position.set(0,.95,.05),t.add(s),t}function j1(n=2.1,t=1.2,e=b.woodDark){const i=new ot;i.userData.peca="estante";const s=.32,o=.04,a=new M(new H(t-o,n-.02,o),C(b.estanteFundo));a.position.set(0,n/2,-s/2-.005),i.add(a);for(const h of[-1,1]){const u=new M(new H(o,n,s),C(e));u.position.set(h*(t-o)/2,n/2,0),i.add(u)}const r=Math.max(2,Math.floor(n/.5)),c=n/r;for(let h=0;h<=r;h++){const u=new M(new H(t-o*2,o,s),C(e)),d=h===0?o/2:h===r?n-o/2:c*h;u.position.set(0,d,0),i.add(u)}const l=[b.metalRed,b.fabricBlue,b.gold,b.bush,b.flowerPink];for(let h=0;h<r;h++){const u=c*h+o/2,p=c*(h+1)-o/2-u;let g=-t/2+o+.03,v=0;const m=t/2-o-.03;for(;v<7;){const f=.05+(h*3+v*5)%4*.018,S=Math.min(p*.92,.26+(h+v*2)%4*.035);if(g+f>m)break;const x=v>=3&&g+f+S*.5>m,_=new M(new H(f,S,.17),C(l[(h*2+v)%l.length]));_.position.set(0,S/2,.02),_.userData.livro=!0;const P=new ot;P.position.set(g+f/2,u,0),x&&(P.rotation.z=-.42),P.add(_),i.add(P),g+=x?f+S*.42:f+.012,v++}}return i}function Y1(n=b.fabricBlue){const t=new ot,e=new M(new H(1.5,.35,2.1),C(b.woodDark));e.position.y=.2,t.add(e);const i=new M(new H(1.44,.24,2),C(16184040));i.position.y=.49,t.add(i);const s=new M(new H(1.5,.14,1.35),C(n));s.position.set(0,.62,.3),t.add(s);const o=new M(new H(1,.16,.4),C(16777215));o.position.set(0,.66,-.72),t.add(o);const a=new M(new H(1.55,.7,.12),C(b.wood));return a.position.set(0,.6,-1.06),t.add(a),t}function Z1(){const n=new ot,t=new M(new H(1.6,.08,.7),C(b.wood));t.position.y=.74,n.add(t);for(const o of[-.72,.72]){const a=new M(new H(.08,.74,.66),C(b.woodDark));a.position.set(o,.37,0),n.add(a)}const e=new M(new H(.8,.5,.06),C(2830136));e.position.set(0,1.08,-.18),n.add(e);const i=new M(new Ue(.72,.42),Xe(10475775));i.position.set(0,1.08,-.14),n.add(i);const s=new M(new nt(.05,.12,.24,8),C(2830136));return s.position.set(0,.86,-.18),n.add(s),n}function Xr(n=b.wood){const t=new ot,e=new M(new H(.5,.08,.5),C(n));e.position.y=.46,t.add(e);const i=new M(new H(.5,.55,.07),C(n));i.position.set(0,.75,-.22),t.add(i);for(const[s,o]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new M(new H(.06,.46,.06),C(b.woodDark));a.position.set(s*.2,.23,o*.2),t.add(a)}return t}function J1(n=2.4){const t=new ot,e=new M(new H(n,.9,.65),C(b.wallMint));e.position.y=.45,t.add(e);const i=new M(new H(n+.08,.08,.72),C(b.concrete));i.position.y=.94,t.add(i);const s=new M(new H(.5,.06,.4),C(b.metalWhite));return s.position.set(n/2-.55,.97,0),t.add(s),t}function $1(){const n=new ot,t=new M(new H(.8,1.8,.7),C(b.metalWhite));t.position.y=.9,n.add(t);const e=new M(new H(.82,.03,.72),C(b.metalGrey));e.position.y=1.25,n.add(e);for(const i of[.7,1.45]){const s=new M(new H(.05,.3,.05),C(b.metalGrey));s.position.set(.3,i,.37),n.add(s)}return n}function jr(n=1){const t=new ot,e=new M(new nt(.22*n,.17*n,.34*n,10),C(b.plantPot));e.position.y=.17*n,t.add(e);for(let i=0;i<5;i++){const s=i/5*Math.PI*2,o=new M(new Rt(.2*n,8,6),C(i%2?b.leafMid:b.leafLight));o.scale.set(.5,1.5,.5),o.position.set(Math.cos(s)*.12*n,.6*n,Math.sin(s)*.12*n),o.rotation.z=Math.cos(s)*.4,o.rotation.x=-Math.sin(s)*.4,t.add(o)}return t}function Yr(n=.7,t=.55,e=b.skyDusk){const i=new ot,s=new M(new H(n,t,.05),C(b.woodDark));i.add(s);const o=new M(new Ue(n-.1,t-.1),Xe(e,1,!0));return o.position.z=.03,o.renderOrder=1,i.add(o),i}function K1(n=1.3,t=1){const e=new ot,i=new M(new H(n,t,.05),C(b.woodDark));e.add(i);const s=new M(new Ue(n-.1,t-.1),Xe(b.cortica,1,!0));s.position.z=.03,s.renderOrder=1,e.add(s);for(let r=0;r<14;r++){const c=new M(new Ue(.018,.018),Xe(b.corticaEscura,1,!0));c.renderOrder=2,c.position.set((r*37%100/100-.5)*(n-.24),(r*61%100/100-.5)*(t-.24),.035),e.add(c)}const o=[[-.3,.2,.34,.28,.06,b.skyDusk],[.26,.24,.3,.26,-.09,b.water],[-.24,-.22,.3,.26,-.05,b.flowerPink],[.3,-.2,.32,.24,.08,b.leafMid]],a=[b.heart,b.gold,b.frisbee,b.heart];return o.forEach(([r,c,l,h,u,d],p)=>{const g=new ot,v=new M(new Ue(l,h),Xe(b.metalWhite,1,!0));v.renderOrder=3,g.add(v);const m=new M(new Ue(l-.06,h-.1),Xe(d,1,!0));m.position.set(0,.02,.002),m.renderOrder=4,g.add(m);const f=new M(new Rt(.018,8,6),C(a[p]));f.position.set(0,h/2-.03,.012),g.add(f),g.position.set(r,c,.04),g.rotation.z=u,e.add(g)}),e}function cu(n=1.2,t=1.2){const e=new ot,i=new M(new Ue(n,t),Xe(b.glass,.55));e.add(i);const s=new M(new H(n+.12,.08,.08),C(b.metalWhite));s.position.y=t/2,e.add(s);const o=s.clone();o.position.y=-t/2,e.add(o);for(const a of[-1,1]){const r=new M(new H(.08,t,.08),C(b.metalWhite));r.position.x=a*n/2,e.add(r)}return e}function Q1(n=16777215){const t=new ot,e=new M(new nt(.07,.06,.13,10),C(n));e.position.y=.065,t.add(e);const i=new M(new _e(.045,.014,6,12),C(n));return i.position.set(.08,.07,0),i.rotation.y=Math.PI/2,t.add(i),t}function t_(n=1.5,t=.9){const e=new ot,i=new M(new H(n,.09,t),C(b.wood));i.position.y=.75,e.add(i);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new M(new H(.08,.75,.08),C(b.woodDark));r.position.set(o*(n/2-.14),.37,a*(t/2-.14)),e.add(r)}const s=new M(new nt(.07,.09,.16,10),C(b.wallMint));s.position.y=.87,e.add(s);for(const o of[-1,1]){const a=new M(new Rt(.06,8,6),C(o<0?b.flowerPink:b.flowerYellow));a.position.set(o*.05,1.03,0),e.add(a)}return e}function e_(n=!0){const t=new ot,e=new M(new nt(.2,.24,.06,12),C(b.woodDark));e.position.y=.03,t.add(e);const i=new M(new nt(.03,.03,1.5,8),C(b.metalGrey));i.position.y=.78,t.add(i);const s=new M(new nt(.22,.3,.34,14,1,!0),C(n?16773324:15130320,{glow:n?.5:0,doubleSide:!0}));return s.position.y=1.68,t.add(s),t}function Zr(n=1.1){const t=new ot,e=new M(new H(n,.06,.24),C(b.wood));t.add(e);const i=[14245951,6074447,16763213];for(let o=0;o<3;o++){const a=new M(new H(.1,.24,.16),C(i[o]));a.position.set(-n/2+.2+o*.16,.15,0),t.add(a)}const s=new M(new Rt(.13,10,8),C(b.leafMid));return s.position.set(n/2-.22,.16,0),s.scale.y=.8,t.add(s),t}function n_(n=2){const t=new ot,e=new M(new H(n,.6,.34),C(b.wallCream));t.add(e);for(const i of[-1,1]){const s=new M(new H(.04,.16,.04),C(b.metalGrey));s.position.set(i*n*.22,-.18,.19),t.add(s)}return t}function i_(){const n=new ot,t=new M(new H(.66,.9,.64),C(b.metalWhite));t.position.y=.45,n.add(t);const e=new M(new nt(.2,.2,.06,16),C(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,n.add(e);const i=new M(new nt(.14,.14,.05,16),C(3884624));i.position.set(0,.5,.36),i.rotation.x=Math.PI/2,n.add(i);const s=new M(new H(.6,.12,.03),C(14673128));s.position.set(0,.82,.33),n.add(s);for(const o of[-.2,0,.2]){const a=new M(new nt(.025,.025,.03,8),C(b.metalGrey));a.position.set(o,.82,.36),a.rotation.x=Math.PI/2,n.add(a)}return n}function wo(n=b.wood,t=.9,e=2.1,i=.24){const s=new ot,o=new M(new H(t,e,.08),C(n));o.position.y=e/2,s.add(o);for(const c of[-1,1]){const l=new M(new H(.09,e+.1,i),C(b.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),s.add(l)}const a=new M(new H(t+.2,.1,i),C(b.woodDark));a.position.y=e+.05,s.add(a);const r=new M(new Rt(.055,8,6),C(b.gold,{glow:.15}));return r.position.set(t/2-.14,e*.45,.07),s.add(r),s}function s_(n=b.wood,t=1.6,e=2.1){const i=new ot,s=.62,o=new M(new H(t,e,s),C(b.woodDark));o.position.y=e/2,i.add(o);const a=new M(new H(t-.12,e-.16,.04),C(3812127));a.position.set(0,e/2,s/2-.05),i.add(a);const r=t/2-.05;for(const c of[-1,1]){const l=new ot;l.position.set(c*r,e/2,s/2),c>0&&(l.rotation.y=-.62),i.add(l);const h=new M(new H(r,e-.1,.06),C(n));h.position.x=-c*r/2,l.add(h);const u=new M(new nt(.022,.022,.16,8),C(b.metalGrey));u.position.set(-c*(r-.12),0,.06),l.add(u)}for(const c of[-1,1])for(const l of[-1,1]){const h=new M(new H(.1,.1,.1),C(b.woodDark));h.position.set(c*(t/2-.1),.05,l*(s/2-.1)),i.add(h)}return i}function o_(n=b.wood,t=1.7){const e=new ot,i=.62,s=new M(new H(i,t,.07),C(n));s.position.y=t/2,e.add(s);const o=new M(new H(i-.14,t-.16,.03),C(b.glass,{opacity:.72,glow:.12}));return o.position.set(0,t/2,.04),e.add(o),e.rotation.x=-.05,e}function a_(){const n=new ot,t=new M(new H(.44,.5,.4),C(b.wood));t.position.y=.25,n.add(t);const e=new M(new H(.36,.14,.03),C(b.woodDark));e.position.set(0,.32,.21),n.add(e);const i=new M(new nt(.06,.08,.16,8),C(b.metalGrey));i.position.y=.58,n.add(i);const s=new M(new nt(.11,.15,.18,12,1,!0),C(16773324,{glow:.45,doubleSide:!0}));return s.position.y=.75,n.add(s),n}const Pn={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},Sn={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},r_=[Pn,Sn],Jr={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI},"do-quarto":{x:-5.05,z:-1.2,facing:Math.PI/2}},build(n){const t=n.game,e=async Z=>{for(const[yt,Wt]of Z)await t.say([Wt],yt)},i=Pn.name,s=Sn.name,o=12,a=9,r=-o/2,c=-a/2,l=2.8;n.ground({width:o,depth:a,color:b.floorWood}),n.setBounds(r+.45,c+.45,o/2-.45,a/2-.45),n.wall(r,c,o/2,c,l,b.wallCream);const h=-1.2,u=.95;n.wall(r,c,r,h-u/2,l,b.wallMint),n.wall(r,h+u/2,r,a/2,l,b.wallMint),n.wall(r,a/2,o/2,a/2,.45,b.wallCream),n.wall(o/2,-1.3,o/2,a/2,.45,b.wallCream);const d=.4,p=4.2,g=-1.3,v=(d+p)/2,m=(p+o/2)/2,f=.95,S=[d,v-f/2,v+f/2,m-f/2,m+f/2,o/2];for(let Z=0;Z<S.length;Z+=2)S[Z+1]-S[Z]>.05&&n.wall(S[Z],g,S[Z+1],g,l,b.wallCream);n.wall(d,c,d,g,l,b.wallCream),n.wall(p,c,p,g,l,b.wallCream),n.wall(o/2,c,o/2,g,l,b.wallCream);const x=new M(new H(o/2-d,.16,g-c),C(15129028));x.position.set((d+o/2)/2,l+.08,(c+g)/2),n.add(x);const _=n.add(n.place(wo(b.woodDark,.85,2.05),v,0,g)),P=n.add(n.place(wo(b.gold,.85,2.05),m,0,g));n.add(n.place(Yr(.6,.75,b.wallMint),3.55,1.75,g+.17)),n.add(n.place(Zr(.9),1.1,1.7,g+.19)),n.add(n.place(wo(b.fabricBlue,.9,2.1),r,0,h,Math.PI/2)),n.door({x:r+.85,z:h,to:"quarto",entry:"da-sala",label:"Entrar no quarto do Ari",icon:"🚪"}),n.add(n.place(J1(3.6),-3.4,0,c+.42)),n.blockBox(-3.4,c+.42,1.8,.4),n.add(n.place(n_(2.6),-3.4,2,c+.2)),n.add(n.place($1(),r+.45,0,-2.6,Math.PI/2)),n.blockBox(r+.45,-2.6,.38,.42);const E=n.add(n.place(t_(1.5,.9),-3.6,0,-1.9,.08));n.blockBox(-3.6,-1.9,.8,.52,.08),n.add(n.place(Xr(),-4.7,0,-1.9,Math.PI/2)),n.add(n.place(Xr(),-2.5,0,-1.9,-Math.PI/2));const A=n.add(n.place(X1(!1),r+.35,0,.6,Math.PI/2));n.blockBox(r+.35,.6,.3,.9);const R=A.getObjectByName("tela");n.add(n.place(Wr(3,2.6),-2.5,0,.6));const w=n.add(n.place(q1(b.fabricRed,2.4),-.3,0,.6,-Math.PI/2));n.blockBox(-.3,.6,.5,1.2),n.add(n.place(W1(),-2.4,0,.6,Math.PI/2)),n.blockBox(-2.4,.6,.38,.62);const y=n.add(n.place(Q1(16773856),-2.4,.5,.9));n.add(n.place(e_(!0),-.4,0,2.3)),n.blockCircle(-.4,2.3,.3);const D=n.add(n.place(i_(),o/2-.65,0,2.9,-Math.PI/2));n.blockBox(o/2-.65,2.9,.35,.4),n.add(n.place(cu(1.8,1.3),r+.16,1.75,2.4,Math.PI/2)),n.add(n.place(Yr(.8,.6,b.skyDusk),-3.4,1.95,c+.17)),n.add(n.place(Zr(1.1),-1.6,1.8,c+.2)),n.add(n.place(jr(1.1),r+.8,0,a/2-1));const F=n.add(n.place(jr(.75),4.9,0,1.4)),z=n.place(tu(.75),-.3,2.4,.6);z.visible=!1,n.add(z);const V=a/2;n.wall(2,V,2.9,V,2.6,b.wallCream),n.wall(3.9,V,4.9,V,2.6,b.wallCream);const q=n.add(n.place(wo(b.woodDark,.95,2.1),3.4,0,V,Math.PI));n.blockBox(3.4,V,.5,.12),n.add(n.place(Wr(1.4,.8,12626050),3.4,0,a/2-1));const J=new ye;J.position.set(-.52,0,.6),J.rotation.y=-Math.PI/2,n.root.add(J);const st=new ye;st.position.set(-1.9,1.05,.6),n.root.add(st);let $=!1;const at=Z=>{$=Z,R.material=C(Z?9426943:b.screen,{glow:Z?.55:0})};n.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:w,onInteract:async Z=>{if(await Z.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await Z.say(["Depois. Se sentar agora, não levanta mais."]);return}Z.lockPlayer(!0),Z.ridePlayer(J,new N(-.52,.02,0),1,0),Z.rideCompanion(J,new N(.52,.02,0),1,0),Z.setSitting(!0),at(!0),Z.focusCamera(st),Z.setZoom(7.2),await Z.wait(.9),await Z.say(["Está passando Bo Burnham."]),await Z.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${Z.companionName()} tá rindo também.`]),await Z.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await Z.say(["Mais um. Só mais um.","Nunca é só mais um."]),Z.setSitting(!1),Z.focusCamera(null),Z.setZoom(10),Z.releasePlayer(-1.6,.4,-Math.PI/2),Z.releaseCompanion(-1.6,1.5,-Math.PI/2),Z.lockPlayer(!1),Z.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),n.interact({id:"casa:tv",x:r+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:A,onInteract:async Z=>{at(!$),$&&Z.som("tv"),Z.toast($?"TV ligada":"TV desligada","📺"),$&&await Z.say(["Está passando Bo Burnham."])}}),n.interact({id:"casa:geladeira",x:r+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:Z=>Z.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),n.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:Z=>Z.say(["Por algum milagre, a pia está limpa…"])}),n.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:E,onInteract:async Z=>{await e([[i,"Dois pratos, duas canecas. Já virou automático."],[s,"Três, se a Rubi sair do quarto."]]),Z.toast("Mesa posta","🍽️")}}),n.interact({id:"casa:maquina",x:o/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:D,onInteract:async Z=>{if(Z.flag("roupa-lavando")){await e([[s,"Ainda tá centrifugando."],[i,"Esse barulho é a trilha sonora dessa casa."]]);return}Z.setFlag("roupa-lavando"),Z.toast("Máquina ligada","🫧"),await e([[i,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[s,"Contanto que a Rubi não encha ela de novo antes."]])}}),n.interact({id:"casa:banheiro",x:m,z:g+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:P,onInteract:()=>e([[s,"Tem alguém aí?"],[i,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),n.interact({id:"casa:quarto",x:v,z:g+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:_,onInteract:async Z=>{await e([[i,"Acho que a Rubi está ouvindo kpop"],[s,"Para variar né"]]),Z.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),n.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:F,onInteract:async Z=>{if(Z.flag("planta-regada")){await Z.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}Z.setFlag("planta-regada"),F.scale.multiplyScalar(1.2),Z.toast("A plantinha cresceu um tiquinho","🌱"),await Z.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),n.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:y,onInteract:async Z=>{await Z.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),Z.toast("+1 disposição","☕")}}),n.interact({id:"casa:janela",x:r+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async Z=>{await Z.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),Z.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),n.door({x:3.4,z:a/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:q,radius:1.7}),n.onUpdate((Z,yt)=>{z.visible=n.game.flag("planta-regada"),z.position.y=2.4+Math.sin(yt*1.6)*.12,z.rotation.y=yt*.9})}},ue={x:0,z:-3,largura:16,profundidade:10,fundo:1.6};function $l(n,t,e=0){return Math.abs(n-ue.x)<ue.largura/2-e&&Math.abs(t-ue.z)<ue.profundidade/2-e}const Kl={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:0,z:12,facing:Math.PI},entries:{portaria:{x:0,z:12,facing:Math.PI},beira:{x:0,z:3.5,facing:Math.PI}},build(n){const t=n.game,e=async E=>{for(const[A,R]of E)await t.say([R],A)},i=Pn.name,s=Sn.name,o={x:ue.x,z:ue.z,width:ue.largura,depth:ue.profundidade};n.groundWithHoles({width:160,depth:160,color:b.grass,holes:[o]}),n.groundWithHoles({width:34,depth:26,color:14999766,y:.015,z:-1,holes:[o]}),n.setBounds(-22,-18,22,16),n.add(n.place(Av(ue.largura,ue.profundidade,ue.fundo),ue.x,0,ue.z));const a=Cv(ue.largura,ue.profundidade);a.position.set(ue.x,-.12,ue.z),n.root.add(a);for(const E of[-5.2,-1.8,1.8,5.2]){const A=new M(new Ue(.24,ue.profundidade-1.4),Xe(4164272,1,!0));A.rotation.x=-Math.PI/2,A.position.set(ue.x+E,-1.6+.08,ue.z),A.renderOrder=1,n.root.add(A)}for(const E of[-5,5])n.add(n.place(Pv(),E,0,ue.z+ue.profundidade/2));const r=n.add(n.place(Iv(),0,0,ue.z-ue.profundidade/2-1.6));n.blockBox(0,ue.z-ue.profundidade/2-1.9,.4,.4);const c=[La(b.frisbee),La(16767070),La(7328752)];c.forEach((E,A)=>{n.place(E,-4.5+A*4.6,-.05,ue.z-1.6+A%2*2.6),n.root.add(E)});const l=[b.fabricBlue,b.fabricRed,6074447,16763213];for(let E=0;E<6;E++){const A=-7.5+E*3;n.add(n.place(Dl(l[E%l.length]),A,0,5.4,Math.PI)),n.blockBox(A,5.4,.36,.85),E%2===0&&(n.add(n.place(Ul(E%4===0?b.fabricRed:4882400),A+1.5,0,6.9)),n.blockCircle(A+1.5,6.9,.3))}const h=n.add(n.place(Dl(b.rug),10.5,0,2.2,-Math.PI/2));n.blockBox(10.5,2.2,.85,.36),n.add(n.place(Ul(16748465),11.6,0,3.6)),n.blockCircle(11.6,3.6,.3);const u=n.add(n.place(Rv(),-11,0,2.5,-Math.PI/2));n.blockCircle(-11,2.5,.3);const d=n.add(n.place(Fr(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));n.blockBox(-12.5,7.2,1.4,1,.35);const p=n.add(n.place(Or(6,3.2,4,b.wallCream,8038084),13,0,-9));n.blockBox(13,-9,3,2),n.banco(9,-6.6),n.setSeed(90210);for(const[E,A]of[[-18,-8],[-17,1],[18,2],[19,-6],[-19,10],[18,11]])n.add(n.place(Ur("palmeira",n.range(.95,1.2),n.rng()),E,0,A)),n.blockCircle(E,A,.5);for(let E=0;E<26;E++){const A=n.range(-20,20),R=n.range(-16,14);Math.abs(A)<18&&R>-14&&R<12||n.add(n.place(E%2?Ro(n.range(.7,1.1)):Nr(6,1.1),A,0,R))}for(let E=0;E<6;E++){const A=$h(n.range(1.8,3));A.position.set(n.range(-60,60),n.range(40,52),n.range(-50,30)),n.root.add(A);const R=n.range(.2,.5);n.onUpdate(w=>{A.position.x+=R*w,A.position.x>62&&(A.position.x=-62)})}n.add(n.place(Bn(30,1.4,b.metalWhite),-6,0,14)),n.add(n.place(Bn(14,1.4,b.metalWhite),12,0,14)),n.blockBox(-6,14,15,.2),n.blockBox(12,14,7,.2);const g=n.add(n.place(Bn(4,1.6,b.gold),3.5,0,14));n.door({x:3.5,z:13,to:"villa-lobos",entry:"clube",label:"Voltar pro parque",icon:"🌳",highlight:g,radius:2.2});const v=[],m=(E,A,R=12)=>{t.som("agua");for(let w=0;w<R;w++){const y=new M(new Rt(.1+Math.random()*.1,6,5),Xe(14677247,.9)),D=w/R*Math.PI*2,F=.2+Math.random()*.5;y.position.set(E+Math.cos(D)*F,-.1,A+Math.sin(D)*F),n.root.add(y),v.push({mesh:y,vy:2.2+Math.random()*2.4,vida:1})}};let f=0,S=0,x=!1;n.onUpdate((E,A)=>{a.position.y=-.12+Math.sin(A*1.4)*.015,c.forEach((F,z)=>{F.position.y=-.05+Math.sin(A*1.1+z*1.7)*.05,F.rotation.y=Math.sin(A*.4+z)*.4});const R=t.playerPosition(),w=t.companionPosition(),y=$l(R.x,R.z,.2)?1:0,D=$l(w.x,w.z,.2)?1:0;f+=(y-f)*Math.min(1,E*5),S+=(D-S)*Math.min(1,E*5),t.submergePlayer(f),t.submergeCompanion(S),y===1&&!x&&(x=!0,m(R.x,R.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let F=v.length-1;F>=0;F--){const z=v[F];z.vy-=9*E,z.mesh.position.y+=z.vy*E,z.vida-=E*.9,z.mesh.material.opacity=Math.max(0,z.vida),(z.vida<=0||z.mesh.position.y<-.6)&&(n.root.remove(z.mesh),z.mesh.geometry.dispose(),v.splice(F,1))}});const _=new ye;n.root.add(_),n.interact({id:"clube:trampolim",x:0,z:ue.z-ue.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:r,onInteract:async E=>{E.lockPlayer(!0),await E.say(["Do trampolim?","Do trampolim."]);const A=new N(0,.95,ue.z-ue.profundidade/2-.4),R=new N(0,-.6,ue.z+1.2);_.position.copy(A),E.ridePlayer(_,new N(0,0,0),1);const w=1.15;for(let y=0;y<w;y+=1/60){const D=y/w;_.position.lerpVectors(A,R,D),_.position.y+=Math.sin(D*Math.PI)*2.6,await E.wait(1/60)}m(R.x,R.z,18),E.releasePlayer(R.x,R.z,Math.PI),E.lockPlayer(!1),E.toast("Splash!","💦"),E.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),n.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:h,onInteract:async E=>{await E.say(["Sol na cara, barulho de água, ninguém com pressa.",`${E.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),E.toast("+1 preguiça boa","🌞")}});let P=0;n.onUpdate(E=>{P<=0||(P-=E,P<=0&&(t.removeItem(Jt.sucoMorango.id,Sn.id),t.removeItem(Jt.sucoPessego.id,Pn.id),t.toast("Acabou o suco","🍹")))}),n.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:d,onInteract:async E=>{await e([[s,"Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito."],[i,"Awnn gracias amorzito"]]),P=50,E.addItem(Jt.sucoMorango,Sn.id),E.addItem(Jt.sucoPessego,Pn.id),E.som("sorvete"),E.toast("Morango e pêssego","🍹")}}),n.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:u,onInteract:async E=>{m(-10.6,2.5,8),await E.say(["Gelada. Sempre gelada."])}}),n.interact({id:"clube:vestiario",x:13,z:-6.9,radius:2,priority:1,label:"Vestiário",icon:"🩳",highlight:p,onInteract:async E=>{for(const A of[E.playerId(),E.companionId()]){E.storeItem(Jt.oculosEscuros,A);for(const R of nu)E.storeItem(R,A)}E.flag("vestiario-clube")||(E.setFlag("vestiario-clube"),await e([[i,"Cinco minutos pra trocar de roupa. Você demora quinze."],[s,"Eu demoro porque escolho. Você só pega a primeira que vê."]])),E.abrirVestiario()}})}};class c_{group=new ot;aoSoar=null;get x(){return this.group.position.x}get z(){return this.group.position.z}get estado(){return this.humor}area;jeito;humor="parado";aguarda=1.2;alvo=new N;fase=0;ateSoar;carinho=0;semente;constructor(t,e={}){this.area=t,this.jeito={velocidade:e.velocidade??.62,descansoMin:e.descansoMin??1.4,descansoMax:e.descansoMax??4.4,chanceDeSentar:e.chanceDeSentar??.35,somCadaMin:e.somCadaMin??9,somCadaMax:e.somCadaMax??20,duracaoDoCarinho:e.duracaoDoCarinho??3.4,semente:e.semente??20260902},this.semente=this.jeito.semente>>>0||1,this.ateSoar=this.jeito.somCadaMin*.7,this.group.position.set((t.minX+t.maxX)/2,0,(t.minZ+t.maxZ)/2),this.alvo.copy(this.group.position)}prontoParaAparecer(t){this.group.userData.peca=t,this.group.traverse(e=>{e.isMesh&&(e.castShadow=!0)})}sorte(){let t=this.semente;return t^=t<<13,t^=t>>>17,t^=t<<5,this.semente=t>>>0,this.semente%1e5/1e5}cabe(t,e){const i=this.area;if(t<i.minX||t>i.maxX||e<i.minZ||e>i.maxZ)return!1;for(const s of i.proibido??[])if(Math.hypot(t-s.x,e-s.z)<s.r)return!1;return!0}novoDestino(){for(let t=0;t<12;t++){const e=this.area.minX+this.sorte()*(this.area.maxX-this.area.minX),i=this.area.minZ+this.sorte()*(this.area.maxZ-this.area.minZ),s=Math.hypot(e-this.x,i-this.z);if(this.cabe(e,i)&&s>.7){this.alvo.set(e,0,i),this.humor="andando",this.aguarda=s/this.jeito.velocidade+2;return}}this.humor="parado",this.aguarda=1.5}receberCarinho(){this.humor="sentado",this.aguarda=this.jeito.duracaoDoCarinho,this.carinho=1,this.ateSoar=Math.min(this.ateSoar,2.2)}update(t){if(this.fase+=t,this.aguarda-=t,this.ateSoar-=t,this.carinho>0&&(this.carinho=Math.max(0,this.carinho-t*.42)),this.ateSoar<=0){const i=this.jeito;this.ateSoar=i.somCadaMin+this.sorte()*(i.somCadaMax-i.somCadaMin),this.aoSoar?.(),this.humor==="andando"&&(this.humor="parado",this.aguarda=.9)}if(this.aguarda<=0)if(this.humor==="andando"){const i=this.jeito;this.humor=this.sorte()<i.chanceDeSentar?"sentado":"parado",this.aguarda=i.descansoMin+this.sorte()*(i.descansoMax-i.descansoMin)}else this.novoDestino();let e=!1;if(this.humor==="andando"){const i=this.alvo.x-this.x,s=this.alvo.z-this.z,o=Math.hypot(i,s);if(o<.08)this.humor="parado",this.aguarda=1.2+this.sorte()*2.5;else{const a=Math.min(o,this.jeito.velocidade*t);this.group.position.x+=i/o*a,this.group.position.z+=s/o*a;let c=Math.atan2(i,s)-this.group.rotation.y;for(;c>Math.PI;)c-=Math.PI*2;for(;c<-Math.PI;)c+=Math.PI*2;this.group.rotation.y+=c*Math.min(1,t*7),e=!0}}this.animar(t,{andando:e,sentado:this.humor==="sentado",carinho:this.carinho,fase:this.fase})}}class l_ extends c_{corpo=new ot;cabeca=new ot;rabo=new ot;patas=[];orelhas=[];olhos=[];gomosDoRabo=[];constructor(t){super(t,{velocidade:.62,descansoMin:1.4,descansoMax:4.4,chanceDeSentar:.35,somCadaMin:9,somCadaMax:20}),this.montar(),this.prontoParaAparecer("pelusa")}montar(){const t=C(b.pelusaBranco),e=C(b.pelusaCinza),i=C(b.pelusaCinzaEscuro),s=new M(new Rt(1,14,10),t);s.scale.set(.105,.098,.165),s.position.y=.175,this.corpo.add(s);const o=new M(new Rt(1,14,10),e);o.scale.set(.098,.072,.142),o.position.set(0,.203,-.012),this.corpo.add(o);const a=new M(new Rt(.105,14,10),t);a.scale.set(1,.94,.9),this.cabeca.add(a);const r=new M(new Rt(.107,14,10,0,Math.PI*2,0,Math.PI*.54),e);r.scale.set(1,.94,.9),r.position.y=.004,this.cabeca.add(r);const c=new M(new Rt(.058,10,8),t);c.scale.set(1.05,.78,.85),c.position.set(0,-.032,.072),this.cabeca.add(c);const l=new M(new Rt(.016,8,6),C(b.pelusaFocinho));l.scale.set(1.2,.85,.8),l.position.set(0,-.024,.122),this.cabeca.add(l);for(const u of[-1,1]){const d=new ot,p=new M(new Ne(.042,.085,6),e);d.add(p);const g=new M(new Ne(.026,.058,6),C(b.pelusaOrelha));g.position.z=.016,d.add(g),d.position.set(u*.062,.092,-.006),d.rotation.z=u*.17,this.orelhas.push(d),this.cabeca.add(d);const v=new M(new Rt(.016,8,6),C(2828065));v.position.set(u*.044,.01,.09),this.olhos.push(v),this.cabeca.add(v)}this.cabeca.position.set(0,.288,.152),this.corpo.add(this.cabeca);for(const[u,d]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const p=new M(new En(.028,.085,3,6),t);p.position.set(u*.062,.072,d*.092),this.patas.push(p),this.corpo.add(p)}let h=this.rabo;for(let u=0;u<3;u++){const d=new ot,p=new M(new En(.022-u*.004,.075,3,6),u%2===0?e:i);p.position.y=.048,d.add(p),d.position.y=u===0?0:.094,d.rotation.x=u===0?-.75:.34,h.add(d),h=d,this.gomosDoRabo.push(d)}this.rabo.position.set(0,.19,-.168),this.corpo.add(this.rabo),this.group.add(this.corpo)}animar(t,{andando:e,sentado:i,carinho:s,fase:o}){if(e){const c=o*9;this.patas[0].position.z=.092+Math.sin(c)*.032,this.patas[3].position.z=-.092+Math.sin(c)*.032,this.patas[1].position.z=.092-Math.sin(c)*.032,this.patas[2].position.z=-.092-Math.sin(c)*.032,this.corpo.position.y=Math.abs(Math.sin(c))*.012,this.corpo.rotation.x=0,this.corpo.rotation.z=Math.sin(c)*.03}else{for(let u=0;u<4;u++){const d=u<2?.092:-.092;this.patas[u].position.z+=(d-this.patas[u].position.z)*Math.min(1,t*8)}this.corpo.rotation.z*=1-Math.min(1,t*8);const c=i?.34:0;this.corpo.rotation.x+=(c-this.corpo.rotation.x)*Math.min(1,t*5);const l=Math.sin(o*1.7)*.006,h=(i?.028:0)+l;this.corpo.position.y+=(h-this.corpo.position.y)*Math.min(1,t*5)}const a=e?1:.55;for(let c=0;c<this.gomosDoRabo.length;c++){const l=this.gomosDoRabo[c],h=(.1+c*.075)*a+s*.1;l.rotation.z=Math.sin(o*(2.1+c*.9))*h,c===0&&(l.rotation.x=-.75+Math.sin(o*1.3)*.12*a)}this.cabeca.rotation.y=e?0:Math.sin(o*.6)*.34,this.cabeca.rotation.x=-s*.22+Math.sin(o*1.9)*.02;for(let c=0;c<this.orelhas.length;c++){const l=c===0?-1:1,h=Math.sin(o*2.3+c*1.7);this.orelhas[c].rotation.z=l*(.17+s*.12)+h*.05*l}const r=1-s*.85;for(const c of this.olhos)c.scale.y=Math.max(.12,r)}}const hn=8,un=6.5,Ge=-hn/2,Je=-un/2,Ql=2.8,ni={x:2.65,z:Je+.36},th={x:-1.15},h_=["Ele só ronrona assim pra quem ele gosta.","Cuidado que ele dorme em cima de você.","Ó, fechou o olhinho.","Ele te adotou.","Esse aí é o dono do quarto. A gente só mora junto."],u_=[Jt.gorroDeLa,Jt.camisaListrada,Jt.calcaJeans,Jt.botaAmarela,Jt.vestidoRosa,Jt.gargantilhaDeLaco,Jt.maidMarinheiro,Jt.maidGatinho,Jt.maidJapones,Jt.meiaDeCoxa,Jt.moletomPreto],eh={id:"quarto",name:"Quarto do Ari",subtitle:"a porta que fica sempre encostada",ambient:{sky:14872311,indoor:!0,sunColor:16774366,sunIntensity:.95,ambientColor:15397883,ambientIntensity:1.45,sunDir:[10,15,12]},spawn:{x:.9,z:1.7,facing:Math.PI},entries:{"da-sala":{x:.9,z:1.7,facing:Math.PI}},build(n){const t=n.game,e=async f=>{for(const[S,x]of f)await t.say([x],S)},i=Pn.name,s=Sn.name;n.ground({width:hn,depth:un,color:b.floorWood}),n.setBounds(Ge+.45,Je+.45,hn/2-.45,un/2-.45),n.wall(Ge,Je,hn/2,Je,Ql,b.wallAzul),n.wall(Ge,Je,Ge,un/2,Ql,b.wallAzul),n.wall(hn/2,Je,hn/2,un/2,.45,b.wallAzul);const o=.9,a=1.1;n.wall(Ge,un/2,o-a/2,un/2,.45,b.wallAzul),n.wall(o+a/2,un/2,hn/2,un/2,.45,b.wallAzul);for(const[f,S,x,_]of[[0,Je+.06,hn,0],[Ge+.06,0,un,Math.PI/2]]){const P=new M(new H(x,.12,.05),C(12176860));P.position.set(f,.06,S),P.rotation.y=_,n.add(P)}const r=n.add(n.place(Y1(b.fabricBlue),-2.2,0,-1.75));n.blockBox(-2.2,-1.75,.78,1.08);const c={x:-2.2,y:.86,z:-1.02},l=new ye;l.position.set(c.x,c.y,c.z),l.rotation.x=-Math.PI/2,n.add(l),n.add(n.place(a_(),-1.05,0,-2.72)),n.blockBox(-1.05,-2.72,.24,.22);const h=n.add(n.place(j1(1.9,1.1),.15,0,Je+.22));n.blockBox(.15,Je+.22,.55,.18);const u=n.add(n.place(s_(b.wallMint),ni.x,0,ni.z));n.blockBox(ni.x,ni.z,.8,.32);const d=n.add(n.place(o_(b.woodDark),Ge+.12,0,-.6,Math.PI/2));n.add(n.place(cu(1.6,1.2),Ge+.16,1.7,1,Math.PI/2));const p=n.add(n.place(Z1(),Ge+.5,0,2,-Math.PI/2));n.blockBox(Ge+.5,2,.4,.82),n.add(n.place(Xr(b.woodDark),Ge+1.35,0,2,-Math.PI/2)),n.add(n.place(Wr(2.6,2,b.rug),.3,0,1.1)),n.add(n.place(jr(1.15),hn/2-.75,0,.9)),n.blockCircle(hn/2-.75,.9,.3),n.add(n.place(Yr(.6,.75,b.flowerPink),-2.2,1.85,Je+.17)),n.add(n.place(Zr(.9),1.05,1.9,Je+.19));const g=n.add(n.place(K1(1.3,1),th.x,1.72,Je+.17));n.door({x:o,z:un/2-.7,to:"casa",entry:"do-quarto",label:"Voltar pra sala",icon:"🚪"}),n.interact({id:"quarto:armario",x:ni.x,z:ni.z+1.25,radius:1.8,label:"Abrir o armário",icon:"🚪",highlight:u,onInteract:async f=>{for(const S of[f.playerId(),f.companionId()])for(const x of u_)f.storeItem(x,S);f.flag("armario-aberto")||(f.setFlag("armario-aberto"),await e([[i,"Pode mexer, fica à vontade."],[s,"Tem mais roupa aqui do que no meu apartamento inteiro."]]),f.unlock({id:"armario-do-ari",title:"O armário do Ari",place:"Quarto do Ari",note:"Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.",icon:"👕"})),f.abrirGuardaRoupa()}});const v=new l_({minX:Ge+.8,maxX:hn/2-.8,minZ:Je+.9,maxZ:un/2-.8,proibido:[{x:-2.2,z:-1.75,r:1.05},{x:-1.05,z:-2.72,r:.45},{x:.15,z:Je+.22,r:.7},{x:ni.x,z:ni.z,r:1},{x:Ge+.5,z:2,r:.9},{x:hn/2-.75,z:.9,r:.6}]});n.add(v.group),v.aoSoar=()=>t.som("miado");const m=n.interact({id:"quarto:pelusa",x:v.x,z:v.z,radius:1.15,label:"Fazer carinho no Pelusa",icon:"🐈",highlight:v.group,onInteract:async f=>{if(v.receberCarinho(),f.som("miado"),!f.flag("pelusa-conhecido")){f.setFlag("pelusa-conhecido"),await e([[s,"Esse é o Pelusa?"],[i,"Esse é o Pelusa."],[s,"Ele deixa pegar?"],[i,"Ele decide na hora. Hoje ele tá deixando."]]),f.unlock({id:"pelusa",title:"O Pelusa",place:"Quarto do Ari",note:"O gato do Ari. Branco, cinza no lombo, e some pelo quarto até você sentar no chão.",icon:"🐈"});return}await f.say([n.pick(h_)],i)}});n.onUpdate(f=>{v.update(f),m.moveTo(v.x,v.z)}),n.interact({id:"quarto:memorias",x:th.x,z:-2.15,radius:1.35,label:"Ver memórias",icon:"📌",highlight:g,onInteract:async f=>{f.flag("quadro-visto")||(f.setFlag("quadro-visto"),await e([[i,"Eu queria um lugar pra pendurar as nossas."],[s,"Um quadro de memórias."],[i,"Esse. Cada uma que a gente viver, entra aqui."]]),f.unlock({id:"quadro-de-memorias",title:"O quadro de memórias",place:"Quarto do Ari",note:"Ideia dele. A primeira já estava pregada quando eu vi.",icon:"📌"})),f.abrirMemoria("o-pedido")}}),n.interact({id:"quarto:espelho",x:Ge+.95,z:-.6,radius:1.5,label:"Se olhar no espelho",icon:"🪞",highlight:d,onInteract:async f=>{if(f.wearables().filter(x=>x!==null).length===0){await e([[s,"Tô bem assim?"],[i,"Tá. Mas tem um armário inteiro logo ali."]]);return}await e([[i,`Olha só, ${f.playerName()}.`],[s,"Ficou bom mesmo."]])}}),n.interact({id:"quarto:cama",x:-2.2,z:-.5,radius:1.6,label:"Deitar na cama",icon:"🛏️",highlight:r,onInteract:async f=>{if(await f.ask("Deitar um pouco?",["Deitar","Agora não"])!==0){await e([[s,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[s,"Não é a cama então."]]);return}f.lockPlayer(!0),f.ridePlayer(l,new N(-.36,0,0),1,0),f.rideCompanion(l,new N(.36,0,0),1,0),f.setLying(!0),f.setCameraOmbro(new N(-.95,3.75,.35),new N(-2.2,.72,-1.75)),await f.wait(1.1),await e([[s,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[s,"Não é a cama então."]]),await f.ask("Ficar mais um pouco?",["Fica","Levantar"])===0&&(await e([[i,"A gente não precisa fazer nada agora."],[s,"Eu sei."]]),await f.wait(2.4)),f.setLying(!1),f.setCameraOmbro(null),f.releasePlayer(-1.3,-.4,0),f.releaseCompanion(-1.3,.25,0),f.lockPlayer(!1),f.unlock({id:"deitar-junto",title:"Deitar sem motivo",place:"Quarto do Ari",note:"Os dois na cama dele, olhando o teto, sem plano nenhum para o resto da tarde.",icon:"🛏️"})}}),n.interact({id:"quarto:mesa",x:Ge+1.5,z:2,radius:1.5,label:"Olhar a escrivaninha",icon:"💻",highlight:p,onInteract:()=>e([[i,"É daqui que eu te mando mensagem de madrugada."],[s,"Eu sei. Eu tô acordado do outro lado."]])}),n.interact({id:"quarto:estante",x:.35,z:-2.2,radius:1.4,label:"Olhar a estante",icon:"📚",highlight:h,onInteract:async f=>{await e([[s,"Você leu todos esses?"],[i,"Comecei todos esses."],[i,"Menos esse. Esse eu li três vezes: Aristóteles e Dante Descobrem os Segredos do Universo."],[s,"Eu sei. Você me contou o final antes de eu chegar na metade."],[i,"E o seu tá aqui do lado. A Toca das Raposas."],[s,"Você guardou."],[i,"Guardei."]]),f.flag("estante-favoritos")||(f.setFlag("estante-favoritos"),f.unlock({id:"os-dois-livros",title:"Os dois livros",place:"Quarto do Ari",note:"O Aristóteles e Dante é dele. A Toca das Raposas é meu. Ficam na mesma prateleira.",icon:"📚"}))}})}};function d_(n,t,e,i){const s=new N().subVectors(t,n),o=s.length(),a=new M(new nt(e,e*1.15,o,8),i);return a.position.copy(n).addScaledVector(s,.5),a.quaternion.setFromUnitVectors(new N(0,1,0),s.normalize()),a}class f_{group=new ot;cabins=[];radius;hubHeight;speed;angle=0;rim=new ot;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,i=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const s=C(t.frameColor??b.metalWhite),o=this.hubHeight=e+2.6,a=e*.075;for(const A of[-a,a]){const R=new M(new _e(e,e*.019,8,72),s);R.position.z=A,this.rim.add(R)}const r=Math.min(48,i*2);for(let A=0;A<r;A++){const R=A/r*Math.PI*2,w=new M(new H(e*.012,e*.012,a*2),s);w.position.set(Math.cos(R)*e,Math.sin(R)*e,0),this.rim.add(w)}const c=[];for(let A=0;A<r;A++){const R=A/r*Math.PI*2,w=(A+1)/r*Math.PI*2,y=A%2===0?-a:a,D=A%2===0?a:-a;c.push(Math.cos(R)*e,Math.sin(R)*e,y,Math.cos(w)*e,Math.sin(w)*e,D)}this.rim.add(new Yc(nh(c),Pl(14673642)));const l=[];for(let A=0;A<i;A++){const R=A/i*Math.PI*2,w=Math.cos(R)*e,y=Math.sin(R)*e;l.push(0,0,-a*.5,w,y,-a),l.push(0,0,a*.5,w,y,a)}this.rim.add(new Yc(nh(l),Pl(15660022)));const h=new M(new nt(e*.085,e*.085,e*.3,14),s);h.rotation.x=Math.PI/2,this.rim.add(h);for(const A of[-e*.17,e*.17]){const R=new M(new nt(e*.11,e*.07,e*.06,14),C(b.metalGrey));R.rotation.x=Math.PI/2,R.position.z=A,this.rim.add(R)}this.rim.position.y=o,this.group.add(this.rim);const u=C(t.cabinColor??b.metalWhite),d=C(7321304,{opacity:.5}),p=e*.068;for(let A=0;A<i;A++){const R=new ot,w=new M(new H(.09,p*1.1,.09),C(b.metalGrey));w.position.y=p*1.25,R.add(w);const y=new M(new En(p,p*.5,5,16),u);y.scale.set(1,1,.92),R.add(y);const D=new M(new nt(p*1.02,p*1.02,p*.95,18,1,!0),d);D.position.y=p*.12,D.scale.z=.92,R.add(D),R.traverse(F=>{F.isMesh&&(F.castShadow=!0)}),this.cabins.push(R),this.group.add(R)}const g=e*.42,v=new N(0,o,-e*.04),m=new N(0,o,e*.04),f=[[v,new N(-e*.2,0,-g)],[v,new N(e*.2,0,-g)],[m,new N(-e*.2,0,g)],[m,new N(e*.2,0,g)]];for(const[A,R]of f){const w=d_(A.clone(),R.clone(),e*.03,s);w.castShadow=!0,this.group.add(w)}for(const A of[-g,g]){const R=new M(new H(e*.42,e*.022,e*.022),s);R.position.set(0,e*.16,A),this.group.add(R)}const S=new M(new nt(e*.62,e*.67,.35,26),C(b.concrete));S.position.y=.16,S.receiveShadow=!0,this.group.add(S);const x=e*.4,_=g*.92;for(const[A,R]of[[-x,-_],[x,-_],[-x,_],[x,_]]){const w=new M(new nt(e*.055,e*.055,e*.16,12),C(b.metalRed));w.position.set(A,e*.08,R),w.castShadow=!0,this.group.add(w)}const P=new M(new H(e*.55,.55,e*.3),C(b.metalGrey));P.position.set(0,.4,g*.9),P.castShadow=!0,P.receiveShadow=!0,this.group.add(P);const E=new M(new nt(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),C(b.fabricRed));E.position.set(0,1.9,g*.9),E.rotation.set(0,0,Math.PI/2),E.scale.z=.6,this.group.add(E);for(const A of[-e*.15,e*.15]){const R=new M(new nt(.06,.06,1.8,8),C(b.metalWhite));R.position.set(A,.9,g*.9),this.group.add(R)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const i of this.cabins)i.position.y<e&&(e=i.position.y,t=i);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function nh(n){const t=new Ie;return t.setAttribute("position",new re(n,3)),t}class p_{mesh;state="chao";velocity=new N;spin=0;curva=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=Qh(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}get rasante(){return Math.hypot(this.velocity.x,this.velocity.z)}pickUp(){this.state="guardado",this.velocity.set(0,0,0),this.curva=0}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,i=0,s=1,o=0){const a=e.x-t.x,r=e.z-t.z,c=Math.hypot(a,r),l=(Math.random()-.5)*i;this.throwFrom(t,Math.atan2(a,r)+l,this.powerFor(c,s),s,o)}throwAt(t,e,i,s=1,o=0){this.throwFrom(t,e,this.powerFor(i,s),s,o)}powerFor(t,e=1){let i=.25,s=1.7;for(let o=0;o<14;o++){const a=(i+s)/2;this.simulateRange(a,e)<t?i=a:s=a}return De.clamp((i+s)/2,.25,1.7)}passo(t,e,i,s){const o=e.y>-1.2?this.lift:0;e.y-=(this.gravity-o)*s;const a=e.x,r=e.z,c=Math.hypot(a,r);return i!==0&&c>1e-4&&(e.x+=r/c*i*s,e.z+=-a/c*i*s),e.x*=1-.35*s,e.z*=1-.35*s,t.addScaledVector(e,s),i*Math.max(0,1-1.1*s)}simulateRange(t,e=1){const i=new N(0,1.15,0),s=new N(0,3.4*t*e,11*t),o=1/60;for(let a=0;a<900&&i.y>.06;a++)this.passo(i,s,0,o);return i.z}ondeVaiCair(t){const e=this.mesh.position.clone();if(this.state!=="voando")return e;const i=this.velocity.clone();let s=this.curva;const o=1/60;for(let a=0;a<900&&e.y>.06;a++)s=this.passo(e,i,s,o),this.bater(e,i,t)&&(s=0);return e.y=.06,e}throwFrom(t,e,i=1,s=1,o=0){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const a=11*i;this.velocity.set(Math.sin(e)*a,3.4*i*s,Math.cos(e)*a),this.curva=o,this.spin=22}bater(t,e,i){const s=De.clamp(t.x,i.minX,i.maxX),o=De.clamp(t.z,i.minZ,i.maxZ);return s===t.x&&o===t.z?!1:(t.x=s,t.z=o,e.multiplyScalar(.2),!0)}update(t,e){this.state==="voando"&&(this.curva=this.passo(this.mesh.position,this.velocity,this.curva,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08+this.curva*.06,this.bater(this.mesh.position,this.velocity,e)&&(this.curva=0),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.curva=0,this.onLand?.(this.mesh.position.clone())))}}const ze={largura:2.6,profundidade:1.4,altura:.76},m_=.055,Es=ze.largura/2+.22,g_=Es+.9,ih=.28,v_=ze.altura+.19,__=6.6,x_=.72,vs=ze.profundidade/2+.12,en={vxBase:3.5,vxMin:2.9,vxMax:4.4,energiaParaVx:.05,vyBase:1.9,alturaParaVy:1.5,subidaParaVy:.12,vyMin:.75,vyMax:2.4,heranca:.25,lateralParaVz:.2,vzMax:1.05,velocidadeMaximaRaquete:6};class M_{grupo=new ot;bola;minhaRaquete;raqueteDele;fase="parado";meus=0;dele=0;alvo;onSom=null;onPonto=null;onFim=null;v=new N;espera=0;sacaEu=!0;rebatedor="eu";quiquesNoAlvo=0;lateralRaquete=0;subidaRaquete=0;zAnterior=0;yAnterior=0;erroDele=0;constructor(t=5){this.alvo=t,this.bola=Kh(),this.grupo.add(this.bola),this.minhaRaquete=Bo(b.metalRed),this.raqueteDele=Bo(b.fabricBlue),this.minhaRaquete.rotation.y=Math.PI/2,this.raqueteDele.rotation.y=-Math.PI/2,this.minhaRaquete.scale.setScalar(1.15),this.raqueteDele.scale.setScalar(1.15),this.grupo.add(this.minhaRaquete,this.raqueteDele),this.resetar()}comecar(){this.meus=0,this.dele=0,this.sacaEu=!0,this.resetar()}guardar(){this.fase="parado",this.grupo.visible=!1}resetar(){this.fase="sacando",this.espera=1.1,this.grupo.visible=!0;const t=this.sacaEu?-1:1;this.bola.position.set(t*(ze.largura/2-.3),ze.altura+.45,0),this.v.set(0,0,0),this.minhaRaquete.position.set(-Es,ze.altura+.3,0),this.raqueteDele.position.set(Es,ze.altura+.3,0),this.zAnterior=0,this.yAnterior=ze.altura+.3,this.lateralRaquete=0,this.subidaRaquete=0,this.sortearErro()}sortearErro(){const t=Math.random()<.25;this.erroDele=(Math.random()-.5)*(t?1.5:.5)}update(t,e){if(!(this.fase==="parado"||this.fase==="fim")){if(this.moverMinhaRaquete(t,e),this.moverRaqueteDele(t),this.fase==="ponto"||this.fase==="sacando"){this.espera-=t,this.espera<=0&&(this.fase==="ponto"?this.resetar():this.sacar());return}this.voar(t)}}sacar(){this.fase="jogando",this.rebatedor=this.sacaEu?"eu":"ele",this.quiquesNoAlvo=0,this.v.set(this.sacaEu?3.4:-3.4,1.45,(Math.random()-.5)*.6),this.onSom?.("lancar")}moverMinhaRaquete(t,e){const i=De.clamp(e.x*vs,-vs,vs),s=ze.altura+.16+De.clamp((e.y+.35)*.6,0,.75);this.minhaRaquete.position.z+=(i-this.minhaRaquete.position.z)*Math.min(1,t*18),this.minhaRaquete.position.y+=(s-this.minhaRaquete.position.y)*Math.min(1,t*14);const o=en.velocidadeMaximaRaquete;t>0&&(this.lateralRaquete=De.clamp((this.minhaRaquete.position.z-this.zAnterior)/t,-o,o),this.subidaRaquete=De.clamp((this.minhaRaquete.position.y-this.yAnterior)/t,-o,o)),this.zAnterior=this.minhaRaquete.position.z,this.yAnterior=this.minhaRaquete.position.y}moverRaqueteDele(t){const e=this.v.x>0,i=e?this.bola.position.z+this.erroDele:0,s=e?4.6:1.6;this.raqueteDele.position.z+=(i-this.raqueteDele.position.z)*Math.min(1,t*s),this.raqueteDele.position.z=De.clamp(this.raqueteDele.position.z,-vs,vs);const o=e?De.clamp(this.bola.position.y,ze.altura+.16,ze.altura+.9):ze.altura+.3;this.raqueteDele.position.y+=(o-this.raqueteDele.position.y)*Math.min(1,t*4)}voar(t){const e=this.bola.position,i=e.x;if(this.v.y-=__*t,e.addScaledVector(this.v,t),(i<0&&e.x>=0||i>0&&e.x<=0)&&e.y<v_){this.onSom?.("quicar"),this.marcar(this.rebatedor==="ele","na rede");return}const o=ze.altura+m_,a=Math.abs(e.x)<=ze.largura/2&&Math.abs(e.z)<=ze.profundidade/2;if(e.y<=o&&this.v.y<0&&a){if(e.y=o,this.v.y=-this.v.y*x_,this.onSom?.("quicar"),(e.x<0?"eu":"ele")===this.rebatedor){this.marcar(this.rebatedor==="ele","quique no próprio campo");return}if(this.quiquesNoAlvo+=1,this.quiquesNoAlvo>=2){this.marcar(this.rebatedor==="eu","dois quiques");return}}for(const[c,l,h]of[[-1,this.minhaRaquete,"eu"],[1,this.raqueteDele,"ele"]]){const u=c*Es;!(c<0?i>u&&e.x<=u:i<u&&e.x>=u)||this.rebatedor===h||!(Math.abs(e.z-l.position.z)<ih&&Math.abs(e.y-l.position.y)<ih)||(e.x=u,this.rebater(h==="eu"?1:-1,l.position.y,h==="eu"),this.rebatedor=h,this.quiquesNoAlvo=0,this.onSom?.("pegar"),h==="ele"&&this.sortearErro())}(e.y<.12||Math.abs(e.x)>g_||Math.abs(e.z)>2.2)&&(this.quiquesNoAlvo>=1?this.marcar(this.rebatedor==="eu","não alcançou"):this.marcar(this.rebatedor==="ele","fora"))}rebater(t,e,i){const s=i?this.lateralRaquete:this.miraDoParceiro(),o=i?this.subidaRaquete:0,a=Math.abs(s)+Math.abs(o),r=De.clamp(en.vxBase+a*en.energiaParaVx,en.vxMin,en.vxMax),c=De.clamp(en.vyBase-(e-(ze.altura+.14))*en.alturaParaVy+o*en.subidaParaVy,en.vyMin,en.vyMax),l=De.clamp(this.v.z*en.heranca+s*en.lateralParaVz,-1.05,en.vzMax);this.v.set(t*r,c,l)}miraDoParceiro(){const t=-this.bola.position.z*1.2,e=(Math.random()-.5)*2.4;return De.clamp(t+e,-4,4)}marcar(t,e){if(t?this.meus+=1:this.dele+=1,this.sacaEu=!t,this.onPonto?.(t,e),this.meus>=this.alvo||this.dele>=this.alvo){this.fase="fim",this.onFim?.(this.meus>=this.alvo);return}this.fase="ponto",this.espera=1.3}}const y_={plano:Es},sh={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:b.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(n){const t=n.game,e=async L=>{for(const[B,j]of L)await t.say([j],B)},i=Pn.name,s=Sn.name,o={x:-8.6,z:2.5},a={x:-21,z:-5,reta:5,raio:5,miolo:2.4},r={x:o.x+4.72,z:o.z+.2},c={x:18,z:-4.5,largura:26,profundidade:19},l={x:-15.5,z:20.5,giro:.35},h=(L,B,j=0)=>Math.abs(L-c.x)<c.largura/2-j&&Math.abs(B-c.z)<c.profundidade/2-j;n.ground({width:240,depth:240,color:b.grass}),n.setBounds(-44,-34,44,32);for(let L=0;L<14;L++)n.disc(n.range(-40,40),n.range(-30,30),n.range(2,6),b.grassDark,.004);n.disc(0,-16.5,8.6,b.sand,.008),n.disc(0,-16.5,8,b.concrete,.012),n.patch(0,4,5.5,56,b.asphalt,0,.016),n.patch(0,9,62,4.5,b.asphalt,0,.02);const u=(L,B,j)=>{n.patch(a.x,a.z,a.reta*2,L*2,B,0,j),n.disc(a.x-a.reta,a.z,L,B,j),n.disc(a.x+a.reta,a.z,L,B,j)},d=.3;u(a.raio,b.metalWhite,.022),u(a.raio-d,b.asphalt,.026),u(a.miolo+d,b.metalWhite,.03),u(a.miolo,b.grass,.034);const p=(a.raio+a.miolo)/2,g=[1.15,.17];for(const L of[-1,1]){for(let j=0;j<5;j++){const K=a.x-a.reta+1+j*(a.reta*2-2)/4;n.patch(K,a.z+L*p,g[0],g[1],b.metalWhite,0,.038)}const B=a.x+L*a.reta;for(let j=0;j<6;j++){const K=-Math.PI/2+(j+.5)/6*Math.PI,_t=L>0?K:K+Math.PI;n.patch(B+Math.cos(_t)*p,a.z+Math.sin(_t)*p,g[0],g[1],b.metalWhite,-(_t+Math.PI/2),.038)}}n.patch(a.x+a.reta*.55,a.z+p,.32,a.raio-a.miolo-d*2,b.metalWhite,0,.04),n.patch(o.x+.4,o.z+.2,10,6.4,b.concrete,0,.02),n.patch(o.x+1.6,7.2,3,7,b.asphalt,0,.022);const v=new f_({radius:12,cabins:32,rpm:1});n.place(v.group,0,0,-26),n.add(v.group),n.blockCircle(0,-26,7.2);for(const L of[-11,11])n.add(n.place(Bn(9,1.2,b.metalWhite),L,0,-20,Math.PI/2)),n.blockBox(L,-20,.2,4.5);n.add(n.place(yv(2.6),-9.5,0,-21,.4)),n.blockCircle(-9.5,-21,2.7);const m=n.add(n.place(Fr(b.fabricBlue,{texto:"Bilheteria"}),8.9,0,-20.5,-.5));n.blockBox(8.9,-20.5,1.4,.95,-.5);const f=[[-6.4,-13.6,1.15],[6.4,-13.6,1.15],[-8.6,-17.4,.95],[8.6,-17.4,.95]];for(const[L,B,j]of f)n.add(n.place(Mv(j,void 0,n.rng()),L,0,B,n.range(0,6.28))),n.blockCircle(L,B,j+.1);for(const[L,B]of[[-7.6,-11.4],[7.6,-11.4],[-12.2,-19],[12.2,-19]])n.add(n.place(Ra(!1),L,0,B)),n.blockCircle(L,B,.35);for(const[L,B,j]of[[-3.6,-12.2,.1],[3.6,-12.2,-.1],[-13.2,-22.5,1.1]])n.banco(L,B,j);for(const[L,B]of[[6.9,-18.9],[-5.2,-11.6]])n.add(n.place(Il(),L,0,B)),n.blockCircle(L,B,.35);for(let L=0;L<22;L++){const B=L/22*Math.PI*2+n.range(-.1,.1),j=n.range(10.5,13.5),K=Math.cos(B)*j,_t=-18+Math.sin(B)*j*.7;Math.abs(K)<4.5&&_t>-14||(L%3===0?n.add(n.place(Ro(n.range(.6,1),b.leafDark),K,0,_t)):L%3===1?n.add(n.place(Rl(n.range(.9,1.4)),K,0,_t,n.range(0,6.28))):n.add(n.place(Mo(n.range(.4,.8),n.rng()),K,0,_t,n.range(0,6.28))))}n.disc(-21,11,9.2,b.sand,.024),n.disc(-21,11,8.5,b.water,.028),n.blockCircle(-21,11,8.8);const S=[Ia(),Ia(15262416),Ia()];S.forEach((L,B)=>{n.place(L,-21+Math.cos(B*2.1)*4.5,.1,11+Math.sin(B*2.1)*3.5,B*1.7),n.add(L)});const x={x:-21,z:11};for(let L=0;L<34;L++){const B=L/34*Math.PI*2+n.range(-.09,.09),j=n.range(9.1,11.4),K=x.x+Math.cos(B)*j,_t=x.z+Math.sin(B)*j,kt=L%4;kt===0?n.add(n.place(Ro(n.range(.6,1),b.leafDark),K,0,_t)):kt===1?n.add(n.place(Rl(n.range(.9,1.5)),K,0,_t,n.range(0,6.28))):kt===2?n.add(n.place(Mo(n.range(.45,1.5),n.rng()),K,0,_t,n.range(0,6.28))):n.add(n.place(Nr(5,.8),K,0,_t))}for(const[L,B,j]of[[.9,8.4,1.6],[2.6,8.7,1.1],[4.3,8.3,1.9],[5.6,8.9,1.2]]){const K=x.x+Math.cos(L)*B,_t=x.z+Math.sin(L)*B;n.add(n.place(Mo(j,L%1,9409947),K,-.12,_t,L)),n.blockCircle(K,_t,.4*j)}for(const[L,B]of[[1.5,8.2],[3.4,8.4],[5.1,8.1],[.2,8.5]])n.add(n.place(_v(n.range(1.1,1.6)),x.x+Math.cos(L)*B,0,x.z+Math.sin(L)*B));const _=[[1.1,6.6,1,!0],[2.9,7.2,.8,!1],[4.6,6.1,1.15,!0],[.4,7.4,.9,!0],[3.8,5.2,1.05,!1],[5.9,6.8,.85,!0]];for(const[L,B,j,K]of _){const _t=n.place(xv(j,K),x.x+Math.cos(L)*B,.045,x.z+Math.sin(L)*B);_t.rotation.y=L,n.add(_t)}const P=c.x-c.largura/2,E=c.x+c.largura/2,A=c.z-c.profundidade/2,R=c.z+c.profundidade/2;n.patch(c.x,c.z,c.largura,c.profundidade,b.grassDark,0,.008);const w=(L,B,j,K)=>{n.patch(L,B,j,K,15922416,0,.012)};w(c.x,A+.3,c.largura-1.2,.28),w(c.x,R-.3,c.largura-1.2,.28),w(P+.6,c.z,.28,c.profundidade-.6),w(E-.6,c.z,.28,c.profundidade-.6),w(P+6,c.z,.22,c.profundidade-.6),w(E-6,c.z,.22,c.profundidade-.6),n.ring(c.x,c.z,2.2,.3,15922416,.012),w(c.x,c.z,.28,c.profundidade-.6);const y=(L,B,j,K)=>{n.add(n.place(Bn(j,1.5,b.metalWhite),L,0,B,K?Math.PI/2:0)),K?n.blockBox(L,B,.2,j/2):n.blockBox(L,B,j/2,.2)};y(c.x,A,c.largura,!1),y(c.x,R,c.largura,!1),y(E,c.z,c.profundidade,!0),y(P,A+3.75,7.5,!0),y(P,R-3.75,7.5,!0),n.add(n.place(Fl(),P+3,0,c.z)),n.blockCircle(P+3,c.z,.5);const D=n.add(n.place(Fl(b.frisbee),E-3,0,c.z));n.blockCircle(E-3,c.z,.5);const F=n.add(n.place(Uv(),c.x,0,A+1.2));n.blockBox(c.x,A+1.2,1,.2);const z=n.add(n.place(Nv(6),c.x,0,R-1.2,Math.PI));n.blockBox(c.x,R-1.4,3,.8);const V=n.add(n.place(Fv(),P+1.6,0,c.z+4.2,Math.PI/2));n.blockCircle(P+1.6,c.z+4.2,.4);const q=n.add(n.place(Ov(),P+1.8,0,c.z-3.4,.4)),J=n.add(n.place(Bv(),E-1.6,0,R-2.4));n.blockCircle(E-1.6,R-2.4,.3);const st=J.userData.manga;n.onUpdate((L,B)=>{J.rotation.y=Math.sin(B*.3)*.5+.6,st.rotation.z=Math.sin(B*1.7)*.12-.06});for(const[L,B]of[[P+1,A+1],[E-1,A+1],[P+1,R-1],[E-1,R-1]])n.add(n.place(zv(),L,0,B,Math.atan2(c.x-L,c.z-B))),n.blockCircle(L,B,.4);for(const[L,B]of[[P+6,A+1.4],[P+6,R-1.4],[E-6,A+1.4],[E-6,R-1.4]])n.add(n.place(Ll(),L,0,B));const $=n.add(n.place(Ol("Frisbee!",b.frisbee),P-1.8,0,c.z+3.4,Math.PI*.25));n.blockCircle(P-1.8,c.z+3.4,.3);const at=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[L,B,j]of at)n.banco(L,B,j);for(const[L,B]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,2]])n.add(n.place(Ra(!1),L,0,B)),n.blockCircle(L,B,.35);for(const[L,B]of[[3.4,17],[-3.4,11]])n.add(n.place(Il(),L,0,B)),n.blockCircle(L,B,.35);const Z=n.add(n.place(bv(),-10,0,20,.3));n.blockBox(-10,20,1,.9,.3);const yt=Ev(),Wt=Bo(b.metalRed);Wt.position.set(-.78,.82,.3),Wt.rotation.set(-Math.PI/2,0,.7),yt.add(Wt);const te=Bo(b.fabricBlue);te.position.set(.82,.82,-.28),te.rotation.set(-Math.PI/2,0,-2.3),yt.add(te);const he=Kh();he.position.set(.36,.845,.42),yt.add(he),n.add(n.place(yt,l.x,0,l.z,l.giro)),n.blockBox(l.x,l.z,1.45,.85,l.giro);const se=[Wt,te,he],rt=n.add(n.place(Fr(16164544,{tipo:"sorvete"}),12,0,18.6,.3));n.blockBox(12,18.6,1.4,.95,.3);const dt=n.add(n.place(Tv(b.fabricBlue),o.x,0,o.z));dt.userData.loja=!0,n.blockBox(o.x,o.z-.05,3.7,2.3),n.blockBox(r.x,r.z,.65,1.6);for(const L of[-1,1])n.blockCircle(o.x+L*4.05,o.z+2.82,.16);for(const L of[-1.4,1])n.banco(o.x-5.6,o.z+L,Math.PI/2);for(const[L,B]of[[a.x-a.reta-a.raio-1.4,a.z],[a.x+a.reta+a.raio+1.4,a.z]])n.add(n.place(Ra(!1),L,0,B)),n.blockCircle(L,B,.35);const It=14;for(let L=0;L<It;L++){const B=L/It*Math.PI*2,j=L%2===0?a.miolo+.9:a.raio-.9,K=a.x+Math.cos(B)*j+Math.sign(Math.cos(B))*a.reta*Math.abs(Math.cos(B)),_t=a.z+Math.sin(B)*j;n.add(n.place(Ll(),K,0,_t,n.range(0,6.28)))}n.interact({id:"parque:patins",x:r.x+1.8,z:r.z,radius:2.4,label:"Alugar patins",icon:"🛼",highlight:dt,onInteract:async L=>{if(L.hasItem(Jt.patins.id)){await e([[s,"A gente já pegou um par."],[i,"É, e eu ainda não caí. Ainda."]]);return}await e([[s,"Um par pra cada um, moço."],[i,"Eu não sei patinar direito, hein."],[s,"Por isso eu vou do seu lado."]]),L.equipWearable(Jt.patins),L.som("sorvete"),L.toast("Patins calçados","🛼"),L.unlock({id:"patins-villa",title:"Patins no Villa",place:"Parque Villa Lobos",note:"A pista tem cone pra desviar e a gente desviou de quase todos.",icon:"🛼"})}});const Ht=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8],[-21,-5,12],[-8.6,2.5,9]],Ft=(L,B)=>Math.abs(L)<4&&B>-20&&B<30?!1:!Ht.some(([j,K,_t])=>Math.hypot(L-j,B-K)<_t),ee=["redonda","redonda","pinheiro","florida","palmeira"];let me=0;for(let L=0;L<260&&me<64;L++){const B=n.range(-42,42),j=n.range(-32,30);if(!Ft(B,j))continue;const K=n.range(.85,1.5);n.add(n.place(Ur(n.pick(ee),K,n.rng()),B,0,j,n.range(0,6.28))),n.blockCircle(B,j,.45*K),me++}for(let L=0;L<90;L++){const B=n.range(-42,42),j=n.range(-32,30);Ft(B,j)&&(L%3===0?n.add(n.place(Nr(6,1.1),B,0,j)):L%3===1?n.add(n.place(Ro(n.range(.7,1.2)),B,0,j)):n.add(n.place(Mo(n.range(.5,1)),B,0,j)))}n.patch(-66,-10,18,220,b.water,0,.02),n.patch(-55,-10,6,220,b.concrete,0,.03);for(let L=0;L<22;L++){const B=n.range(7,20),j=n.range(4,9);n.add(n.place(Or(j,B,j*.9,n.pick([b.wallCream,b.concrete,b.wallMint]),b.metalGrey),n.range(-95,60),0,-96-n.range(0,16)))}for(let L=0;L<14;L++){const B=n.range(6,16);n.add(n.place(Or(n.range(4,8),B,5,b.wallCream,b.roofTile),92+n.range(0,16),0,n.range(-60,40)))}for(let L=0;L<90;L++){const B=L/90*Math.PI*2,j=62+n.range(0,28),K=Math.cos(B)*j,_t=Math.sin(B)*j*.9;K<-50||n.add(n.place(Ur(n.pick(ee),n.range(1.2,2.2),n.rng()),K,0,_t,n.range(0,6.28)))}for(let L=0;L<9;L++){const B=$h(n.range(1.6,3.2));B.position.set(n.range(-70,70),n.range(56,70),n.range(-60,45)),n.root.add(B);const j=n.range(.25,.6);n.onUpdate(K=>{B.position.x+=j*K,B.position.x>56&&(B.position.x=-56)})}const O=n.add(n.place(Sv(b.wood,b.metalWhite),2.6,0,27.5,Math.PI));n.add(n.place(Bn(16,1.4),-10,0,28)),n.add(n.place(Bn(16,1.4),10,0,28)),n.blockBox(-10,28,8,.2),n.blockBox(10,28,8,.2),n.add(n.place(Bn(11,1.4),35,0,3.5,Math.PI/2)),n.add(n.place(Bn(11,1.4),35,0,22.5,Math.PI/2)),n.blockBox(35,3.5,.2,5.5),n.blockBox(35,22.5,.2,5.5),n.patch(29.5,13,11,5,b.asphalt,0,.01),n.patch(35.6,13,1.6,34,b.concrete,0,.014),n.patch(40.8,13,8.8,34,b.asphalt,0,.018);const ft=n.add(n.place(kv(4161494),39.5,0,13,-Math.PI/2));n.blockBox(39.5,13,1.5,4.3);const ht=n.add(n.place(Vv(),36.4,0,13,-Math.PI/2));n.blockBox(35.9,13,.3,1.8);const ct=n.add(n.place(Ol("Clube!",5161384),36.4,0,8.6,Math.PI*.25));n.blockCircle(36.4,8.6,.3),n.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:ft,radius:2.6}),n.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:O,radius:2.2});const Y=new p_(b.frisbee);Y.mesh.visible=!1,Y.onLand=()=>t.som("quicar"),n.root.add(Y.mesh);const bt=Dv();bt.visible=!1,bt.userData.mira=!0,n.root.add(bt);const vt=1.3,wt=.12,Xt=4,Zt=22,U=.06,T={alem:3.5,arco:1.2,erro:.06,desvio:1.4,alcance:3,raio:2.1,mira:.12},X={minX:P+1.7,minZ:A+1.7,maxX:E-1.7,maxZ:R-1.7},Q=(L,B,j)=>Math.max(B,Math.min(j,L)),ut=(L,B)=>Math.atan2(Math.sin(L-B),Math.cos(L-B)),it=(L,B)=>Math.hypot(L.x-B.x,L.z-B.z),Ot=[],St=(L,B,j,K,_t)=>{const kt=n.add(n.place(Lv(_t,j),L,0,B,Math.PI/2));n.blockCircle(L,B+.96,.36),n.blockCircle(L,B,.75),Ot.push({centro:new N(L,j,B),raio:.58,pontos:K,roda:kt.userData.aro??null,recarga:0})};St(13,-9.4,1.9,1,b.frisbee),St(23,1.4,2.1,2,b.gold),St(18,-.6,2.5,3,b.frisbee);const zt=(L,B,j)=>{const K=B.x-L.x,_t=B.y-L.y,kt=B.z-L.z,oe=K*K+_t*_t+kt*kt;if(oe<1e-8)return j.distanceTo(L);const Yt=Q(((j.x-L.x)*K+(j.y-L.y)*_t+(j.z-L.z)*kt)/oe,0,1);return Math.hypot(j.x-(L.x+K*Yt),j.y-(L.y+_t*Yt),j.z-(L.z+kt*Yt))},Bt=(L,B)=>{for(const j of Ot)j.recarga>0||zt(L,B,j.centro)>j.raio||(j.recarga=1.6,t.som("sino"),t.bump("frisbee.alvos",j.pontos),t.toast(`+${j.pontos} no alvo!`,"🎯"))},xt=L=>{for(const B of Ot)B.recarga<=0||(B.recarga=Math.max(0,B.recarga-L),B.roda&&(B.roda.rotation.z+=L*9*B.recarga))};let mt="fora",Gt=0,Nt=0,At=!1,qt=0,k=null;const Mt=new N,Et=new N;let Lt=!1,pt=null,lt=0,Dt=!1,jt=!0,pe=0;const ce=L=>{t.toast(L[Math.floor(Math.random()*L.length)],"💬")},on=(L,B)=>{const j=Math.sin(B),K=Math.cos(B),_t=j>.001?(X.maxX-L.x)/j:j<-.001?(X.minX-L.x)/j:1/0,kt=K>.001?(X.maxZ-L.z)/K:K<-.001?(X.minZ-L.z)/K:1/0;return Q(Math.min(_t,kt)-1,Xt+3,Zt)},Ke=(L,B,j)=>Xt+(on(L,B)-Xt)*Q(j,0,1),Vs=(L,B,j)=>{const K=on(L,B);return Q((j-Xt)/Math.max(.01,K-Xt),0,1)},fn=(L,B,j)=>{const K=Vs(L,B,Math.hypot(j.x-L.x,j.z-L.z));return K>.02&&K<.99?K:null},rs=L=>1.35-.45*Q(L,0,1),ci=(L,B)=>{L.som("pegar"),qt+=1;const j=L.bump("frisbee.trocas"),K=L.stat("frisbee.recorde");qt>K&&L.bump("frisbee.recorde",qt-K),B?L.toast("Pegou no ar!","🥏"):qt%5===0&&L.toast(`${qt} trocas seguidas!`,"🥏"),j>=10&&!L.flag("memoria-frisbee")&&(L.setFlag("memoria-frisbee"),L.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"})),qt>=10&&!L.flag("memoria-frisbee-dez")&&(L.setFlag("memoria-frisbee-dez"),L.unlock({id:"frisbee-dez",title:"Dez sem deixar cair",place:"Parque Villa Lobos",note:"Dez trocas seguidas e nenhuma no chão. A gente parou porque deu fome, não porque errou.",icon:"🏆"}))},Hs=L=>{const B=L.x<c.x?1:-1;return{x:Q(L.x+B*11,P+2,E-2),z:Q(L.z,A+2,R-2)}},jn=()=>{At=!1,Nt=0,bt.visible=!1,t.showCharge(null)},cs=()=>t.getActiveHandItem()?.id===Jt.frisbee.id;let Yn=!1;const Gs=()=>{const L=t.addItem(Jt.frisbee);return L==="cheio"?(Yn||(Yn=!0,t.toast("Sem vaga pro frisbee","🥏")),!1):(mt="comigo",Y.pickUp(),qt=0,k=null,t.setZoom(19),t.toast(L==="mao"?"Segure F e solte no traço da barra":"Frisbee guardado — escolha ele na mochila (I)","🥏"),!0)},qs=()=>{mt="fora",Yn=!1,t.removeItem(Jt.frisbee.id),Y.mesh.visible=!1,jn(),t.freeCompanion(),t.setZoom(14),k=null,pt=null},Ws=(L,B=0,j=!0)=>{if(mt!=="comigo"||!cs())return;t.removeItem(Jt.frisbee.id);const K=t.playerPosition(),_t=t.playerFacing(),kt=Q(L,0,1),oe=fn(K,_t,t.companionPosition());Lt=j&&oe!==null&&Math.abs(kt-oe)<=U,Mt.copy(K),Et.copy(t.companionPosition()),Y.throwAt(K,_t,Ke(K,_t,kt),rs(kt),B),t.som("lancar"),Dt=!1,jt=!0,pt=null,lt=0,mt="voando-pra-ele"},Xs=()=>{const L=fn(t.playerPosition(),t.playerFacing(),t.companionPosition());Ws(L??.5,0,!1)},ls=n.interact({id:"parque:frisbee-jogar",x:c.x,z:c.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>Xs()}),hs=n.interact({id:"parque:frisbee-pegar",x:c.x,z:c.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:L=>{L.addItem(Jt.frisbee)!=="cheio"&&(Y.pickUp(),mt="comigo",ci(L,!1))}});n.onUpdate((L,B)=>{const j=Y.position.clone();Y.update(L,X);const K=t.playerPosition(),_t=t.companionPosition(),kt=t.playerFacing(),oe=h(K.x,K.z,.4);if(oe&&mt==="fora"?Gs():!oe&&mt!=="fora"&&qs(),mt==="fora"){ls.enabled=!1,hs.enabled=!1,bt.visible=!1,pe=kt;return}if(Y.state==="voando"&&Bt(j,Y.position),xt(L),mt==="comigo"&&cs()){if(t.keyDown("KeyF")){At=!0,Nt=Math.min(1,Nt+L/vt),t.showCharge(Nt,fn(K,kt,_t),U);const Yt=Ke(K,kt,Nt);bt.position.set(K.x+Math.sin(kt)*Yt,0,K.z+Math.cos(kt)*Yt),bt.scale.setScalar(1+Math.sin(B*9)*.06),bt.visible=!0}else if(At){const Yt=Nt,$t=L>1e-4?ut(kt,pe)/L:0;jn(),Yt<wt?Xs():Ws(Yt,Q($t*.18,-2.5,2.5))}}else At&&jn();if(pe=kt,mt==="comigo"||mt==="no-chao"){const Yt=Hs(K);(!k||Math.hypot(Yt.x-k.x,Yt.z-k.z)>2.5)&&(t.commandCompanion(Yt.x,Yt.z),k=Yt)}switch(Y.mesh.userData.fase=mt,mt){case"comigo":Y.holdAt(K,kt),Y.mesh.visible=!1;break;case"com-ele":{const Yt=Math.atan2(K.x-_t.x,K.z-_t.z);t.holdCompanion(K.x,K.z),Y.holdAt(_t,Yt),Gt-=L;const $t=Math.abs(ut(t.companionFacing(),Yt))<T.mira;if(Gt<=0&&($t||Gt<-1)){const Vt=K.x-_t.x,xe=K.z-_t.z,le=Math.hypot(Vt,xe)||1,Le=Math.random(),Zn=Le<.3?T.arco*1.35:Le>.85?.95:T.arco,Ve=Le>.85?T.erro*2.5:T.erro,li=new N(Q(K.x+Vt/le*T.alem+(Math.random()-.5)*T.desvio,P+1.5,E-1.5),0,Q(K.z+xe/le*T.alem+(Math.random()-.5)*T.desvio,A+1.5,R-1.5));Y.throwToward(_t,li,Ve,Zn,(Math.random()-.5)*1),t.som("lancar"),k=null,mt="voando-pra-mim"}break}case"voando-pra-ele":{if(lt-=L,Y.state==="voando"&&lt<=0){lt=.25;const $t=Y.ondeVaiCair(X);(!pt||pt.distanceTo($t)>.8)&&(pt=$t,t.commandCompanion($t.x,$t.z),k=null)}const Yt=Y.state==="voando"&&Y.position.y<2.3&&it(Mt,Y.position)>2&&Math.hypot(Y.position.x-_t.x,Y.position.z-_t.z)<1.5;if(Yt&&!Dt){Dt=!0;const $t=it(Et,Y.position),Vt=Q(.98-Y.rasante*.022-$t*.02+(Lt?.2:0),.35,.98);jt=Math.random()<Vt}if(Yt&&jt){t.som("pegar"),t.holdCompanion(K.x,K.z),k=null,pt=null;const $t=Math.round(it(Mt,Y.position));Y.pickUp(),Gt=.7,mt="com-ele",Lt?(t.som("confirma"),t.bump("frisbee.perfeitos"),t.toast("Passe perfeito!","🎯"),ce(["Na mão! Perfeito.","Esse foi bonito, hein.","Assim fica fácil."])):(t.toast("Ele pegou no ar!","🙌"),ce(["Peguei!","Isso! Manda de novo.","Tá vendo? Sou bom nisso."]));const Vt=t.stat("frisbee.maiorPasse");$t>Vt&&(t.bump("frisbee.maiorPasse",$t-Vt),t.toast(`Novo recorde: ${$t} m`,"📏"));break}Y.state==="chao"&&(Dt&&!jt?ce(["Ah, escapou!","Raspou na minha mão!","Essa eu deixei, admito."]):it(Mt,Y.position)>16&&ce(["Calma, não sou cachorro!","Jogou pra longe demais.","Vou ter que correr até lá?"]),qt=0,Y.position.distanceTo(_t)<1.6?(t.holdCompanion(K.x,K.z),k=null,pt=null,Y.pickUp(),Gt=.8,mt="com-ele"):(t.commandCompanion(Y.position.x,Y.position.z),k=null,mt="buscando"));break}case"buscando":Y.position.distanceTo(_t)<1.1&&(t.holdCompanion(K.x,K.z),k=null,pt=null,Y.pickUp(),Gt=.9,mt="com-ele");break;case"voando-pra-mim":{if(Y.state==="voando"&&Y.position.y<T.alcance&&Math.hypot(Y.position.x-K.x,Y.position.z-K.z)<T.raio){if(t.addItem(Jt.frisbee)==="cheio")break;Y.pickUp(),mt="comigo",ci(t,!0);break}Y.state==="chao"&&(mt="no-chao",qt=0,Y.position.distanceTo(K)<1.9&&t.addItem(Jt.frisbee)!=="cheio"&&(Y.pickUp(),mt="comigo",ci(t,!1)));break}case"no-chao":Y.position.distanceTo(K)<1.2&&t.addItem(Jt.frisbee)!=="cheio"&&(Y.pickUp(),mt="comigo",ci(t,!1));break}ls.enabled=mt==="comigo"&&!At,hs.enabled=mt==="no-chao",mt==="comigo"?ls.moveTo(K.x,K.z):hs.moveTo(Y.position.x,Y.position.z)}),n.interact({id:"parque:placa-quadra",x:P-1.8,z:c.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:$,onInteract:()=>e([[s,"QUADRA LIVRE — respeite quem chegou primeiro."],[i,"Hoje só tem a gente."],[s,"Então segura o F. A marca no chão mostra onde o disco vai cair, e o traço na barra é onde eu estou."],[i,"E se eu quiser mostrar serviço?"],[s,"Acerta um dos aros. Ou uma cesta, se estiver se achando."]])}),n.interact({id:"parque:placar",x:c.x,z:A+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:F,onInteract:L=>{const B=L.stat("frisbee.recorde"),j=L.stat("frisbee.trocas"),K=L.stat("frisbee.perfeitos"),_t=L.stat("frisbee.alvos"),kt=L.stat("frisbee.maiorPasse"),oe=[[i,B>0?`Nosso recorde é ${B} trocas seguidas.`:"O placar tá zerado."],[s,j>0?`E já foram ${j} no total. A gente não desiste fácil.`:"Bora estrear isso então."]];return kt>0&&oe.push([i,`O passe mais longo que colou foi de ${kt} metros.`]),K>0&&oe.push([s,`${K} ${K===1?"passe caiu":"passes caíram"} certinho na minha mão.`]),_t>0&&oe.push([i,`E ${_t} ${_t===1?"ponto":"pontos"} nos alvos. Anota aí.`]),e(oe)}}),n.interact({id:"parque:arquibancada",x:c.x,z:R-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:z,onInteract:()=>e([[s,"Cansei. Cinco minutos."],[i,"Você falou cinco minutos faz meia hora."],[s,"E olha que descanso bem, hein."]])}),n.interact({id:"parque:bebedouro",x:P+2.8,z:c.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:V,onInteract:async L=>{await e([[i,"A água daqui é sempre meio quente."],[s,"Mas depois de correr atrás de disco, tá ótima."]]),L.toast("Água (meio quente)","🚰")}}),n.interact({id:"parque:sacola",x:P+2.8,z:c.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:q,onInteract:()=>e([[s,"Tem uns três discos aqui de gente que esqueceu."],[i,"Um deles é seu. Desde março."],[s,"…é, pode ser."]])}),n.interact({id:"parque:cesta",x:E-4.4,z:c.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:D,onInteract:()=>e([[i,"Um dia a gente acerta essa cesta."],[s,"Já acertei uma vez!"],[i,"Você acertou o poste. É diferente."]])}),n.interact({id:"parque:biruta",x:E-3,z:R-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:J,onInteract:()=>e([[s,"O vento tá indo pra lá."],[i,"Então joga contra que o disco fica no ar mais tempo."],[s,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),n.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:ht,onInteract:()=>e([[i,"Esse é o que passa no clube?"],[s,"É esse. Já tá parado, é só subir."]])}),n.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:ct,onInteract:()=>e([[s,'"Clube!" — com exclamação e tudo.'],[i,"Quem escreveu isso tava animado."]])}),n.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async L=>{L.som("pato"),await L.say(["Que lago bonito... dá até vontade de pular"],Sn.name),await L.say(["Então vamos! Hahahha"],Pn.name),await L.say(["NÃAAOOO"],Sn.name),L.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});let Pi=0;n.onUpdate(L=>{Pi<=0||(Pi-=L,Pi<=0&&(t.removeItem(Jt.sorveteMorango.id,Pn.id),t.removeItem(Jt.sorveteMaracuja.id,Sn.id),t.toast("Acabou o sorvete","🍦")))});const ke=new M_(5);ke.guardar(),yt.add(ke.grupo),ke.onSom=L=>t.som(L),yt.userData.pingpong=ke;const I=(L,B)=>{const j=new N(L,0,B);return yt.localToWorld(j),j};let G=!1;const tt=y_.plano+.55,et=()=>{G=!1,ke.guardar();for(const L of se)L.visible=!0;t.showPlacar(null),t.setCameraOmbro(null),t.setPlayerVisible(!0),t.lockPlayer(!1),t.freeCompanion(),W.enabled=!0};n.onUpdate(L=>{G&&(ke.update(L,t.pointer()),G&&t.showPlacar({eu:t.playerName(),ele:t.companionName(),meus:ke.meus,dele:ke.dele}))});const W=n.interact({id:"parque:pingpong",x:l.x,z:l.z,radius:2.6,label:"Jogar ping pong",icon:"🏓",highlight:yt,onInteract:async L=>{if(G)return;await e([[i,"Cinco pontos?"],[s,"Cinco pontos. E o perdedor carrega a bolsa até em casa."]]);const B=I(-tt,0),j=I(tt,0);L.releasePlayer(B.x,B.z,Math.atan2(j.x-B.x,j.z-B.z)),L.releaseCompanion(j.x,j.z,Math.atan2(B.x-j.x,B.z-j.z)),L.holdCompanion(B.x,B.z),L.lockPlayer(!0);const K=I(-tt-1.6,0),_t=I(0,0);L.setCameraOmbro(new N(K.x,2.35,K.z),new N(_t.x,.9,_t.z)),L.setPlayerVisible(!1);for(const kt of se)kt.visible=!1;W.enabled=!1,ke.comecar(),G=!0,L.toast("Mexa o mouse para mover a raquete","🏓")}});ke.onPonto=L=>{t.som(L?"confirma":"quicar")},ke.onFim=L=>{(async()=>(et(),L?(t.som("memoria"),t.toast("Campeão de ping pong!","🏆"),t.equipWearable(Jt.chapeuPingPong),await e([[i,"Cinco a "+ke.dele+"."],[s,"Você ganhou o chapéu. Vai ter que usar."]]),t.unlock({id:"memoria-ping-pong",title:"A mesa do parque",place:"Parque Villa Lobos",note:"Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.",icon:"🏓"})):await e([[s,"Cinco a "+ke.meus+". Revanche?"],[i,"Sempre revanche."]])))()},n.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:rt,onInteract:async L=>{await e([[i,"Dois, por favor."],[s,"Um de morango e um de maracujá."],[i,"Nunca pedimos diferente."]]),Pi=50,L.addItem(Jt.sorveteMorango,Pn.id),L.addItem(Jt.sorveteMaracuja,Sn.id),L.som("sorvete"),L.toast("Morango e maracujá","🍦"),L.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),n.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:Z,onInteract:async L=>{await e([[s,"A toalha xadrez de sempre."],[i,"E o pão de queijo já frio."],[s,"Frio é melhor. Aceita."]]),L.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),n.interact({id:"parque:bilheteria",x:8.9,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:m,onInteract:()=>e([[i,"Dois pra roda gigante."],[s,"Sempre dois."]])});let gt=null;const Ct=L=>new Promise(B=>{gt={resolve:B,de:v.angle,voltas:L}});let Ut=!0;n.onUpdate(L=>{if(v.update(L),Ut){const B=t.playerPosition(),j=Math.hypot(B.x,B.z+26);if(j<28){const K=Math.max(0,Math.min(1,(j-8)/20));t.setZoom(36-K*21)}}if(S.forEach((B,j)=>{B.position.y=.1+Math.sin(performance.now()/900+j)*.05}),gt&&v.turnsSince(gt.de)>=gt.voltas){const B=gt.resolve;gt=null,B()}}),n.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async L=>{Ut=!1,L.lockPlayer(!0),await e([[s,"A fila tá curta hoje."],[i,"Bora subir?"]]);const B=v.boardingCabin(),j=v.speed;v.speed=j*5,L.som("sino"),L.ridePlayer(B,new N(-.3,-.34,0),.55),L.rideCompanion(B,new N(.3,-.34,0),.55),L.focusCamera(B),L.setZoom(38),await Ct(.25),await e([[i,"Daqui dá pra ver o parque inteiro."],[s,"E aquele pedacinho do rio ali atrás."]]),await Ct(.35),await e([[i,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[s,"Pronto. Subimos."]]),await Ct(.4),v.speed=j,L.focusCamera(null),L.releasePlayer(0,-17.6,0),L.releaseCompanion(-1.1,-17.9,0),L.lockPlayer(!1),Ut=!0,L.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},b_={[Jr.id]:Jr,[eh.id]:eh,[sh.id]:sh,[Kl.id]:Kl},S_=Jr.id,lu=document.getElementById("app");if(!lu)throw new Error("#app nao encontrado");const Yo=new H1(lu,b_,r_,S_),ks=new URLSearchParams(location.search),w_=ks.get("cena")??void 0,E_=ks.get("entrada")??void 0;Yo.start(w_,E_);const ka=Number(ks.get("zoom"));Number.isFinite(ka)&&ka>0&&Yo.setZoom(ka);const _s=ks.get("em")?.split(",").map(Number);if(_s&&_s.length===2&&_s.every(Number.isFinite)){const n=Number(ks.get("olhar"));Yo.debugPlace(_s[0],_s[1],Number.isFinite(n)?n:Math.PI/4)}window.jogo=Yo;window.aristoryAudio={Musica:ru,CLIMAS:Do,EFEITOS:au};window.aristoryItens=Object.fromEntries(Object.values(Jt).map(n=>[n.id,n]));window.aristoryMemorias=qr.map(n=>({id:n.id,titulo:n.titulo}));
