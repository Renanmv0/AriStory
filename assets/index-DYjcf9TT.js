(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const lc="180",Rd=0,Rc=1,Id=2,ph=1,mh=2,Vn=3,jn=0,Ke=1,Sn=2,ri=0,Qi=1,Ic=2,Lc=3,Dc=4,Ld=5,bi=100,Dd=101,Ud=102,Nd=103,zd=104,Fd=200,Od=201,Bd=202,kd=203,tr=204,er=205,Vd=206,Hd=207,Gd=208,qd=209,Wd=210,Xd=211,jd=212,Yd=213,Zd=214,nr=0,ir=1,or=2,eo=3,sr=4,ar=5,rr=6,cr=7,gh=0,$d=1,Jd=2,ci=0,Kd=1,Qd=2,tu=3,eu=4,nu=5,iu=6,ou=7,vh=300,no=301,io=302,lr=303,hr=304,ta=306,dr=1e3,wi=1001,ur=1002,Ye=1003,su=1004,is=1005,Pn=1006,ca=1007,Ei=1008,Un=1009,_h=1010,Mh=1011,Lo=1012,hc=1013,Ai=1014,Gn=1015,qo=1016,dc=1017,uc=1018,Do=1020,xh=35902,yh=35899,bh=1021,Sh=1022,Tn=1023,Uo=1026,No=1027,fc=1028,pc=1029,wh=1030,mc=1031,gc=1033,Us=33776,Ns=33777,zs=33778,Fs=33779,fr=35840,pr=35841,mr=35842,gr=35843,vr=36196,_r=37492,Mr=37496,xr=37808,yr=37809,br=37810,Sr=37811,wr=37812,Er=37813,Tr=37814,Ar=37815,Cr=37816,Pr=37817,Rr=37818,Ir=37819,Lr=37820,Dr=37821,Ur=36492,Nr=36494,zr=36495,Fr=36283,Or=36284,Br=36285,kr=36286,au=3200,ru=3201,Eh=0,cu=1,si="",on="srgb",oo="srgb-linear",qs="linear",Me="srgb",Li=7680,Uc=519,lu=512,hu=513,du=514,Th=515,uu=516,fu=517,pu=518,mu=519,Nc=35044,zc="300 es",Rn=2e3,Ws=2001;class ro{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const o=i[t];if(o!==void 0){const s=o.indexOf(e);s!==-1&&o.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const o=i.slice(0);for(let s=0,a=o.length;s<a;s++)o[s].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Fc=1234567;const Ao=Math.PI/180,zo=180/Math.PI;function Ri(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]).toLowerCase()}function se(n,t,e){return Math.max(t,Math.min(e,n))}function vc(n,t){return(n%t+t)%t}function gu(n,t,e,i,o){return i+(n-t)*(o-i)/(e-t)}function vu(n,t,e){return n!==t?(e-n)/(t-n):0}function Co(n,t,e){return(1-e)*n+e*t}function _u(n,t,e,i){return Co(n,t,1-Math.exp(-e*i))}function Mu(n,t=1){return t-Math.abs(vc(n,t*2)-t)}function xu(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function yu(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function bu(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Su(n,t){return n+Math.random()*(t-n)}function wu(n){return n*(.5-Math.random())}function Eu(n){n!==void 0&&(Fc=n);let t=Fc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Tu(n){return n*Ao}function Au(n){return n*zo}function Cu(n){return(n&n-1)===0&&n!==0}function Pu(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Ru(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Iu(n,t,e,i,o){const s=Math.cos,a=Math.sin,r=s(e/2),c=a(e/2),l=s((t+i)/2),h=a((t+i)/2),d=s((t-i)/2),u=a((t-i)/2),p=s((i-t)/2),g=a((i-t)/2);switch(o){case"XYX":n.set(r*h,c*d,c*u,r*l);break;case"YZY":n.set(c*u,r*h,c*d,r*l);break;case"ZXZ":n.set(c*d,c*u,r*h,r*l);break;case"XZX":n.set(r*h,c*g,c*p,r*l);break;case"YXY":n.set(c*p,r*h,c*g,r*l);break;case"ZYZ":n.set(c*g,c*p,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+o)}}function Zi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function We(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ne={DEG2RAD:Ao,RAD2DEG:zo,generateUUID:Ri,clamp:se,euclideanModulo:vc,mapLinear:gu,inverseLerp:vu,lerp:Co,damp:_u,pingpong:Mu,smoothstep:xu,smootherstep:yu,randInt:bu,randFloat:Su,randFloatSpread:wu,seededRandom:Eu,degToRad:Tu,radToDeg:Au,isPowerOfTwo:Cu,ceilPowerOfTwo:Pu,floorPowerOfTwo:Ru,setQuaternionFromProperEuler:Iu,normalize:We,denormalize:Zi};class Ct{constructor(t=0,e=0){Ct.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6],this.y=o[1]*e+o[4]*i+o[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(se(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(se(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),o=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*o+t.x,this.y=s*o+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class co{constructor(t=0,e=0,i=0,o=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=o}static slerpFlat(t,e,i,o,s,a,r){let c=i[o+0],l=i[o+1],h=i[o+2],d=i[o+3];const u=s[a+0],p=s[a+1],g=s[a+2],M=s[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(r===1){t[e+0]=u,t[e+1]=p,t[e+2]=g,t[e+3]=M;return}if(d!==M||c!==u||l!==p||h!==g){let m=1-r;const f=c*u+l*p+h*g+d*M,S=f>=0?1:-1,y=1-f*f;if(y>Number.EPSILON){const A=Math.sqrt(y),C=Math.atan2(A,f*S);m=Math.sin(m*C)/A,r=Math.sin(r*C)/A}const x=r*S;if(c=c*m+u*x,l=l*m+p*x,h=h*m+g*x,d=d*m+M*x,m===1-r){const A=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=A,l*=A,h*=A,d*=A}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,o,s,a){const r=i[o],c=i[o+1],l=i[o+2],h=i[o+3],d=s[a],u=s[a+1],p=s[a+2],g=s[a+3];return t[e]=r*g+h*d+c*p-l*u,t[e+1]=c*g+h*u+l*d-r*p,t[e+2]=l*g+h*p+r*u-c*d,t[e+3]=h*g-r*d-c*u-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,o){return this._x=t,this._y=e,this._z=i,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,o=t._y,s=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(o/2),d=r(s/2),u=c(i/2),p=c(o/2),g=c(s/2);switch(a){case"XYZ":this._x=u*h*d+l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d-u*p*g;break;case"YXZ":this._x=u*h*d+l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d+u*p*g;break;case"ZXY":this._x=u*h*d-l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d-u*p*g;break;case"ZYX":this._x=u*h*d-l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d+u*p*g;break;case"YZX":this._x=u*h*d+l*p*g,this._y=l*p*d+u*h*g,this._z=l*h*g-u*p*d,this._w=l*h*d-u*p*g;break;case"XZY":this._x=u*h*d-l*p*g,this._y=l*p*d-u*h*g,this._z=l*h*g+u*p*d,this._w=l*h*d+u*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,o=Math.sin(i);return this._x=t.x*o,this._y=t.y*o,this._z=t.z*o,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],o=e[4],s=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],d=e[10],u=i+r+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-c)*p,this._y=(s-l)*p,this._z=(a-o)*p}else if(i>r&&i>d){const p=2*Math.sqrt(1+i-r-d);this._w=(h-c)/p,this._x=.25*p,this._y=(o+a)/p,this._z=(s+l)/p}else if(r>d){const p=2*Math.sqrt(1+r-i-d);this._w=(s-l)/p,this._x=(o+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+d-i-r);this._w=(a-o)/p,this._x=(s+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(se(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const o=Math.min(1,e/i);return this.slerp(t,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,o=t._y,s=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*r+o*l-s*c,this._y=o*h+a*c+s*r-i*l,this._z=s*h+a*l+i*c-o*r,this._w=a*h-i*r-o*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,o=this._y,s=this._z,a=this._w;let r=a*t._w+i*t._x+o*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=o,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*o+e*this._y,this._z=p*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),d=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=a*d+this._w*u,this._x=i*d+this._x*u,this._y=o*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),o=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(o*Math.sin(t),o*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(t=0,e=0,i=0){z.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Oc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Oc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,o=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*o,this.y=s[1]*e+s[4]*i+s[7]*o,this.z=s[2]*e+s[5]*i+s[8]*o,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,o=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*o+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*o+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*o+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*o+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,o=this.z,s=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*o-r*i),h=2*(r*e-s*o),d=2*(s*i-a*e);return this.x=e+c*l+a*d-r*h,this.y=i+c*h+r*l-s*d,this.z=o+c*d+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,o=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*o,this.y=s[1]*e+s[5]*i+s[9]*o,this.z=s[2]*e+s[6]*i+s[10]*o,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this.z=se(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this.z=se(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(se(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,o=t.y,s=t.z,a=e.x,r=e.y,c=e.z;return this.x=o*c-s*r,this.y=s*a-i*c,this.z=i*r-o*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return la.copy(this).projectOnVector(t),this.sub(la)}reflect(t){return this.sub(la.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(se(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,o=this.z-t.z;return e*e+i*i+o*o}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const o=Math.sin(e)*t;return this.x=o*Math.sin(i),this.y=Math.cos(e)*t,this.z=o*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),o=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=o,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const la=new z,Oc=new co;class ee{constructor(t,e,i,o,s,a,r,c,l){ee.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,o,s,a,r,c,l)}set(t,e,i,o,s,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=o,h[2]=r,h[3]=e,h[4]=s,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,o=e.elements,s=this.elements,a=i[0],r=i[3],c=i[6],l=i[1],h=i[4],d=i[7],u=i[2],p=i[5],g=i[8],M=o[0],m=o[3],f=o[6],S=o[1],y=o[4],x=o[7],A=o[2],C=o[5],P=o[8];return s[0]=a*M+r*S+c*A,s[3]=a*m+r*y+c*C,s[6]=a*f+r*x+c*P,s[1]=l*M+h*S+d*A,s[4]=l*m+h*y+d*C,s[7]=l*f+h*x+d*P,s[2]=u*M+p*S+g*A,s[5]=u*m+p*y+g*C,s[8]=u*f+p*x+g*P,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-i*s*h+i*r*c+o*s*l-o*a*c}invert(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],d=h*a-r*l,u=r*c-h*s,p=l*s-a*c,g=e*d+i*u+o*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return t[0]=d*M,t[1]=(o*l-h*i)*M,t[2]=(r*i-o*a)*M,t[3]=u*M,t[4]=(h*e-o*c)*M,t[5]=(o*s-r*e)*M,t[6]=p*M,t[7]=(i*c-l*e)*M,t[8]=(a*e-i*s)*M,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,o,s,a,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*a+l*r)+a+t,-o*l,o*c,-o*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(ha.makeScale(t,e)),this}rotate(t){return this.premultiply(ha.makeRotation(-t)),this}translate(t,e){return this.premultiply(ha.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let o=0;o<9;o++)if(e[o]!==i[o])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ha=new ee;function Ah(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Xs(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Lu(){const n=Xs("canvas");return n.style.display="block",n}const Bc={};function Fo(n){n in Bc||(Bc[n]=!0,console.warn(n))}function Du(n,t,e){return new Promise(function(i,o){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:o();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}const kc=new ee().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vc=new ee().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Uu(){const n={enabled:!0,workingColorSpace:oo,spaces:{},convert:function(o,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===Me&&(o.r=Wn(o.r),o.g=Wn(o.g),o.b=Wn(o.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(o.applyMatrix3(this.spaces[s].toXYZ),o.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Me&&(o.r=to(o.r),o.g=to(o.g),o.b=to(o.b))),o},workingToColorSpace:function(o,s){return this.convert(o,this.workingColorSpace,s)},colorSpaceToWorking:function(o,s){return this.convert(o,s,this.workingColorSpace)},getPrimaries:function(o){return this.spaces[o].primaries},getTransfer:function(o){return o===si?qs:this.spaces[o].transfer},getToneMappingMode:function(o){return this.spaces[o].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(o,s=this.workingColorSpace){return o.fromArray(this.spaces[s].luminanceCoefficients)},define:function(o){Object.assign(this.spaces,o)},_getMatrix:function(o,s,a){return o.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(o){return this.spaces[o].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(o=this.workingColorSpace){return this.spaces[o].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(o,s){return Fo("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(o,s)},toWorkingColorSpace:function(o,s){return Fo("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(o,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[oo]:{primaries:t,whitePoint:i,transfer:qs,toXYZ:kc,fromXYZ:Vc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:t,whitePoint:i,transfer:Me,toXYZ:kc,fromXYZ:Vc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:on}}}),n}const fe=Uu();function Wn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function to(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Di;class Nu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Di===void 0&&(Di=Xs("canvas")),Di.width=t.width,Di.height=t.height;const o=Di.getContext("2d");t instanceof ImageData?o.putImageData(t,0,0):o.drawImage(t,0,0,t.width,t.height),i=Di}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Xs("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const o=i.getImageData(0,0,t.width,t.height),s=o.data;for(let a=0;a<s.length;a++)s[a]=Wn(s[a]/255)*255;return i.putImageData(o,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Wn(e[i]/255)*255):e[i]=Wn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let zu=0;class _c{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:zu++}),this.uuid=Ri(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},o=this.data;if(o!==null){let s;if(Array.isArray(o)){s=[];for(let a=0,r=o.length;a<r;a++)o[a].isDataTexture?s.push(da(o[a].image)):s.push(da(o[a]))}else s=da(o);i.url=s}return e||(t.images[this.uuid]=i),i}}function da(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Nu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Fu=0;const ua=new z;class ke extends ro{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,i=wi,o=wi,s=Pn,a=Ei,r=Tn,c=Un,l=ke.DEFAULT_ANISOTROPY,h=si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Fu++}),this.uuid=Ri(),this.name="",this.source=new _c(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=o,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Ct(0,0),this.repeat=new Ct(1,1),this.center=new Ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ee,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ua).x}get height(){return this.source.getSize(ua).y}get depth(){return this.source.getSize(ua).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const o=this[e];if(o===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}o&&i&&o.isVector2&&i.isVector2||o&&i&&o.isVector3&&i.isVector3||o&&i&&o.isMatrix3&&i.isMatrix3?o.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==vh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case dr:t.x=t.x-Math.floor(t.x);break;case wi:t.x=t.x<0?0:1;break;case ur:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case dr:t.y=t.y-Math.floor(t.y);break;case wi:t.y=t.y<0?0:1;break;case ur:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=vh;ke.DEFAULT_ANISOTROPY=1;class Te{constructor(t=0,e=0,i=0,o=1){Te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=o}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,o){return this.x=t,this.y=e,this.z=i,this.w=o,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,o=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*o+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*o+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*o+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*o+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,o,s;const c=t.elements,l=c[0],h=c[4],d=c[8],u=c[1],p=c[5],g=c[9],M=c[2],m=c[6],f=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+M)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const y=(l+1)/2,x=(p+1)/2,A=(f+1)/2,C=(h+u)/4,P=(d+M)/4,L=(g+m)/4;return y>x&&y>A?y<.01?(i=0,o=.707106781,s=.707106781):(i=Math.sqrt(y),o=C/i,s=P/i):x>A?x<.01?(i=.707106781,o=0,s=.707106781):(o=Math.sqrt(x),i=C/o,s=L/o):A<.01?(i=.707106781,o=.707106781,s=0):(s=Math.sqrt(A),i=P/s,o=L/s),this.set(i,o,s,e),this}let S=Math.sqrt((m-g)*(m-g)+(d-M)*(d-M)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-M)/S,this.z=(u-h)/S,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=se(this.x,t.x,e.x),this.y=se(this.y,t.y,e.y),this.z=se(this.z,t.z,e.z),this.w=se(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=se(this.x,t,e),this.y=se(this.y,t,e),this.z=se(this.z,t,e),this.w=se(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(se(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Ou extends ro{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Te(0,0,t,e),this.scissorTest=!1,this.viewport=new Te(0,0,t,e);const o={width:t,height:e,depth:i.depth},s=new ke(o);this.textures=[];const a=i.count;for(let r=0;r<a;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Pn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let o=0,s=this.textures.length;o<s;o++)this.textures[o].image.width=t,this.textures[o].image.height=e,this.textures[o].image.depth=i,this.textures[o].isArrayTexture=this.textures[o].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const o=Object.assign({},t.textures[e].image);this.textures[e].source=new _c(o)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ci extends Ou{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ch extends ke{constructor(t=null,e=1,i=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:o},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Bu extends ke{constructor(t=null,e=1,i=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:o},this.magFilter=Ye,this.minFilter=Ye,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class lo{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(gn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(gn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=gn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=s.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,gn):gn.fromBufferAttribute(s,a),gn.applyMatrix4(t.matrixWorld),this.expandByPoint(gn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),os.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),os.copy(i.boundingBox)),os.applyMatrix4(t.matrixWorld),this.union(os)}const o=t.children;for(let s=0,a=o.length;s<a;s++)this.expandByObject(o[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,gn),gn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(vo),ss.subVectors(this.max,vo),Ui.subVectors(t.a,vo),Ni.subVectors(t.b,vo),zi.subVectors(t.c,vo),Kn.subVectors(Ni,Ui),Qn.subVectors(zi,Ni),fi.subVectors(Ui,zi);let e=[0,-Kn.z,Kn.y,0,-Qn.z,Qn.y,0,-fi.z,fi.y,Kn.z,0,-Kn.x,Qn.z,0,-Qn.x,fi.z,0,-fi.x,-Kn.y,Kn.x,0,-Qn.y,Qn.x,0,-fi.y,fi.x,0];return!fa(e,Ui,Ni,zi,ss)||(e=[1,0,0,0,1,0,0,0,1],!fa(e,Ui,Ni,zi,ss))?!1:(as.crossVectors(Kn,Qn),e=[as.x,as.y,as.z],fa(e,Ui,Ni,zi,ss))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,gn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(gn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const zn=[new z,new z,new z,new z,new z,new z,new z,new z],gn=new z,os=new lo,Ui=new z,Ni=new z,zi=new z,Kn=new z,Qn=new z,fi=new z,vo=new z,ss=new z,as=new z,pi=new z;function fa(n,t,e,i,o){for(let s=0,a=n.length-3;s<=a;s+=3){pi.fromArray(n,s);const r=o.x*Math.abs(pi.x)+o.y*Math.abs(pi.y)+o.z*Math.abs(pi.z),c=t.dot(pi),l=e.dot(pi),h=i.dot(pi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const ku=new lo,_o=new z,pa=new z;class ea{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):ku.setFromPoints(t).getCenter(i);let o=0;for(let s=0,a=t.length;s<a;s++)o=Math.max(o,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(o),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;_o.subVectors(t,this.center);const e=_o.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),o=(i-this.radius)*.5;this.center.addScaledVector(_o,o/i),this.radius+=o}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(pa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(_o.copy(t.center).add(pa)),this.expandByPoint(_o.copy(t.center).sub(pa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Fn=new z,ma=new z,rs=new z,ti=new z,ga=new z,cs=new z,va=new z;class Ph{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Fn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Fn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Fn.copy(this.origin).addScaledVector(this.direction,e),Fn.distanceToSquared(t))}distanceSqToSegment(t,e,i,o){ma.copy(t).add(e).multiplyScalar(.5),rs.copy(e).sub(t).normalize(),ti.copy(this.origin).sub(ma);const s=t.distanceTo(e)*.5,a=-this.direction.dot(rs),r=ti.dot(this.direction),c=-ti.dot(rs),l=ti.lengthSq(),h=Math.abs(1-a*a);let d,u,p,g;if(h>0)if(d=a*c-r,u=a*r-c,g=s*h,d>=0)if(u>=-g)if(u<=g){const M=1/h;d*=M,u*=M,p=d*(d+a*u+2*r)+u*(a*d+u+2*c)+l}else u=s,d=Math.max(0,-(a*u+r)),p=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(a*u+r)),p=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*s+r)),u=d>0?-s:Math.min(Math.max(-s,-c),s),p=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-s,-c),s),p=u*(u+2*c)+l):(d=Math.max(0,-(a*s+r)),u=d>0?s:Math.min(Math.max(-s,-c),s),p=-d*d+u*(u+2*c)+l);else u=a>0?-s:s,d=Math.max(0,-(a*u+r)),p=-d*d+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),o&&o.copy(ma).addScaledVector(rs,u),p}intersectSphere(t,e){Fn.subVectors(t.center,this.origin);const i=Fn.dot(this.direction),o=Fn.dot(Fn)-i*i,s=t.radius*t.radius;if(o>s)return null;const a=Math.sqrt(s-o),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,o,s,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(i=(t.min.x-u.x)*l,o=(t.max.x-u.x)*l):(i=(t.max.x-u.x)*l,o=(t.min.x-u.x)*l),h>=0?(s=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||s>o||((s>i||isNaN(i))&&(i=s),(a<o||isNaN(o))&&(o=a),d>=0?(r=(t.min.z-u.z)*d,c=(t.max.z-u.z)*d):(r=(t.max.z-u.z)*d,c=(t.min.z-u.z)*d),i>c||r>o)||((r>i||i!==i)&&(i=r),(c<o||o!==o)&&(o=c),o<0)?null:this.at(i>=0?i:o,e)}intersectsBox(t){return this.intersectBox(t,Fn)!==null}intersectTriangle(t,e,i,o,s){ga.subVectors(e,t),cs.subVectors(i,t),va.crossVectors(ga,cs);let a=this.direction.dot(va),r;if(a>0){if(o)return null;r=1}else if(a<0)r=-1,a=-a;else return null;ti.subVectors(this.origin,t);const c=r*this.direction.dot(cs.crossVectors(ti,cs));if(c<0)return null;const l=r*this.direction.dot(ga.cross(ti));if(l<0||c+l>a)return null;const h=-r*ti.dot(va);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ee{constructor(t,e,i,o,s,a,r,c,l,h,d,u,p,g,M,m){Ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,o,s,a,r,c,l,h,d,u,p,g,M,m)}set(t,e,i,o,s,a,r,c,l,h,d,u,p,g,M,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=o,f[1]=s,f[5]=a,f[9]=r,f[13]=c,f[2]=l,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=g,f[11]=M,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ee().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,o=1/Fi.setFromMatrixColumn(t,0).length(),s=1/Fi.setFromMatrixColumn(t,1).length(),a=1/Fi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*o,e[1]=i[1]*o,e[2]=i[2]*o,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,o=t.y,s=t.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(o),l=Math.sin(o),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){const u=a*h,p=a*d,g=r*h,M=r*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=p+g*l,e[5]=u-M*l,e[9]=-r*c,e[2]=M-u*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){const u=c*h,p=c*d,g=l*h,M=l*d;e[0]=u+M*r,e[4]=g*r-p,e[8]=a*l,e[1]=a*d,e[5]=a*h,e[9]=-r,e[2]=p*r-g,e[6]=M+u*r,e[10]=a*c}else if(t.order==="ZXY"){const u=c*h,p=c*d,g=l*h,M=l*d;e[0]=u-M*r,e[4]=-a*d,e[8]=g+p*r,e[1]=p+g*r,e[5]=a*h,e[9]=M-u*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const u=a*h,p=a*d,g=r*h,M=r*d;e[0]=c*h,e[4]=g*l-p,e[8]=u*l+M,e[1]=c*d,e[5]=M*l+u,e[9]=p*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const u=a*c,p=a*l,g=r*c,M=r*l;e[0]=c*h,e[4]=M-u*d,e[8]=g*d+p,e[1]=d,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=p*d+g,e[10]=u-M*d}else if(t.order==="XZY"){const u=a*c,p=a*l,g=r*c,M=r*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=u*d+M,e[5]=a*h,e[9]=p*d-g,e[2]=g*d-p,e[6]=r*h,e[10]=M*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vu,t,Hu)}lookAt(t,e,i){const o=this.elements;return tn.subVectors(t,e),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),ei.crossVectors(i,tn),ei.lengthSq()===0&&(Math.abs(i.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),ei.crossVectors(i,tn)),ei.normalize(),ls.crossVectors(tn,ei),o[0]=ei.x,o[4]=ls.x,o[8]=tn.x,o[1]=ei.y,o[5]=ls.y,o[9]=tn.y,o[2]=ei.z,o[6]=ls.z,o[10]=tn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,o=e.elements,s=this.elements,a=i[0],r=i[4],c=i[8],l=i[12],h=i[1],d=i[5],u=i[9],p=i[13],g=i[2],M=i[6],m=i[10],f=i[14],S=i[3],y=i[7],x=i[11],A=i[15],C=o[0],P=o[4],L=o[8],E=o[12],b=o[1],D=o[5],F=o[9],V=o[13],q=o[2],W=o[6],j=o[10],N=o[14],B=o[3],K=o[7],X=o[11],ht=o[15];return s[0]=a*C+r*b+c*q+l*B,s[4]=a*P+r*D+c*W+l*K,s[8]=a*L+r*F+c*j+l*X,s[12]=a*E+r*V+c*N+l*ht,s[1]=h*C+d*b+u*q+p*B,s[5]=h*P+d*D+u*W+p*K,s[9]=h*L+d*F+u*j+p*X,s[13]=h*E+d*V+u*N+p*ht,s[2]=g*C+M*b+m*q+f*B,s[6]=g*P+M*D+m*W+f*K,s[10]=g*L+M*F+m*j+f*X,s[14]=g*E+M*V+m*N+f*ht,s[3]=S*C+y*b+x*q+A*B,s[7]=S*P+y*D+x*W+A*K,s[11]=S*L+y*F+x*j+A*X,s[15]=S*E+y*V+x*N+A*ht,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],o=t[8],s=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],d=t[6],u=t[10],p=t[14],g=t[3],M=t[7],m=t[11],f=t[15];return g*(+s*c*d-o*l*d-s*r*u+i*l*u+o*r*p-i*c*p)+M*(+e*c*p-e*l*u+s*a*u-o*a*p+o*l*h-s*c*h)+m*(+e*l*d-e*r*p-s*a*d+i*a*p+s*r*h-i*l*h)+f*(-o*r*h-e*c*d+e*r*u+o*a*d-i*a*u+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const o=this.elements;return t.isVector3?(o[12]=t.x,o[13]=t.y,o[14]=t.z):(o[12]=t,o[13]=e,o[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],d=t[9],u=t[10],p=t[11],g=t[12],M=t[13],m=t[14],f=t[15],S=d*m*l-M*u*l+M*c*p-r*m*p-d*c*f+r*u*f,y=g*u*l-h*m*l-g*c*p+a*m*p+h*c*f-a*u*f,x=h*M*l-g*d*l+g*r*p-a*M*p-h*r*f+a*d*f,A=g*d*c-h*M*c-g*r*u+a*M*u+h*r*m-a*d*m,C=e*S+i*y+o*x+s*A;if(C===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const P=1/C;return t[0]=S*P,t[1]=(M*u*s-d*m*s-M*o*p+i*m*p+d*o*f-i*u*f)*P,t[2]=(r*m*s-M*c*s+M*o*l-i*m*l-r*o*f+i*c*f)*P,t[3]=(d*c*s-r*u*s-d*o*l+i*u*l+r*o*p-i*c*p)*P,t[4]=y*P,t[5]=(h*m*s-g*u*s+g*o*p-e*m*p-h*o*f+e*u*f)*P,t[6]=(g*c*s-a*m*s-g*o*l+e*m*l+a*o*f-e*c*f)*P,t[7]=(a*u*s-h*c*s+h*o*l-e*u*l-a*o*p+e*c*p)*P,t[8]=x*P,t[9]=(g*d*s-h*M*s-g*i*p+e*M*p+h*i*f-e*d*f)*P,t[10]=(a*M*s-g*r*s+g*i*l-e*M*l-a*i*f+e*r*f)*P,t[11]=(h*r*s-a*d*s-h*i*l+e*d*l+a*i*p-e*r*p)*P,t[12]=A*P,t[13]=(h*M*o-g*d*o+g*i*u-e*M*u-h*i*m+e*d*m)*P,t[14]=(g*r*o-a*M*o-g*i*c+e*M*c+a*i*m-e*r*m)*P,t[15]=(a*d*o-h*r*o+h*i*c-e*d*c-a*i*u+e*r*u)*P,this}scale(t){const e=this.elements,i=t.x,o=t.y,s=t.z;return e[0]*=i,e[4]*=o,e[8]*=s,e[1]*=i,e[5]*=o,e[9]*=s,e[2]*=i,e[6]*=o,e[10]*=s,e[3]*=i,e[7]*=o,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],o=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,o))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),o=Math.sin(e),s=1-i,a=t.x,r=t.y,c=t.z,l=s*a,h=s*r;return this.set(l*a+i,l*r-o*c,l*c+o*r,0,l*r+o*c,h*r+i,h*c-o*a,0,l*c-o*r,h*c+o*a,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,o,s,a){return this.set(1,i,s,0,t,1,a,0,e,o,1,0,0,0,0,1),this}compose(t,e,i){const o=this.elements,s=e._x,a=e._y,r=e._z,c=e._w,l=s+s,h=a+a,d=r+r,u=s*l,p=s*h,g=s*d,M=a*h,m=a*d,f=r*d,S=c*l,y=c*h,x=c*d,A=i.x,C=i.y,P=i.z;return o[0]=(1-(M+f))*A,o[1]=(p+x)*A,o[2]=(g-y)*A,o[3]=0,o[4]=(p-x)*C,o[5]=(1-(u+f))*C,o[6]=(m+S)*C,o[7]=0,o[8]=(g+y)*P,o[9]=(m-S)*P,o[10]=(1-(u+M))*P,o[11]=0,o[12]=t.x,o[13]=t.y,o[14]=t.z,o[15]=1,this}decompose(t,e,i){const o=this.elements;let s=Fi.set(o[0],o[1],o[2]).length();const a=Fi.set(o[4],o[5],o[6]).length(),r=Fi.set(o[8],o[9],o[10]).length();this.determinant()<0&&(s=-s),t.x=o[12],t.y=o[13],t.z=o[14],vn.copy(this);const l=1/s,h=1/a,d=1/r;return vn.elements[0]*=l,vn.elements[1]*=l,vn.elements[2]*=l,vn.elements[4]*=h,vn.elements[5]*=h,vn.elements[6]*=h,vn.elements[8]*=d,vn.elements[9]*=d,vn.elements[10]*=d,e.setFromRotationMatrix(vn),i.x=s,i.y=a,i.z=r,this}makePerspective(t,e,i,o,s,a,r=Rn,c=!1){const l=this.elements,h=2*s/(e-t),d=2*s/(i-o),u=(e+t)/(e-t),p=(i+o)/(i-o);let g,M;if(c)g=s/(a-s),M=a*s/(a-s);else if(r===Rn)g=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(r===Ws)g=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,o,s,a,r=Rn,c=!1){const l=this.elements,h=2/(e-t),d=2/(i-o),u=-(e+t)/(e-t),p=-(i+o)/(i-o);let g,M;if(c)g=1/(a-s),M=a/(a-s);else if(r===Rn)g=-2/(a-s),M=-(a+s)/(a-s);else if(r===Ws)g=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let o=0;o<16;o++)if(e[o]!==i[o])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Fi=new z,vn=new Ee,Vu=new z(0,0,0),Hu=new z(1,1,1),ei=new z,ls=new z,tn=new z,Hc=new Ee,Gc=new co;class Yn{constructor(t=0,e=0,i=0,o=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=o}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,o=this._order){return this._x=t,this._y=e,this._z=i,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const o=t.elements,s=o[0],a=o[4],r=o[8],c=o[1],l=o[5],h=o[9],d=o[2],u=o[6],p=o[10];switch(e){case"XYZ":this._y=Math.asin(se(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-se(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(se(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-se(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(se(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(r,p));break;case"XZY":this._z=Math.asin(-se(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Hc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gc.setFromEuler(this),this.setFromQuaternion(Gc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class Rh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Gu=0;const qc=new z,Oi=new co,On=new Ee,hs=new z,Mo=new z,qu=new z,Wu=new co,Wc=new z(1,0,0),Xc=new z(0,1,0),jc=new z(0,0,1),Yc={type:"added"},Xu={type:"removed"},Bi={type:"childadded",child:null},_a={type:"childremoved",child:null};class xe extends ro{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Gu++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xe.DEFAULT_UP.clone();const t=new z,e=new Yn,i=new co,o=new z(1,1,1);function s(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Ee},normalMatrix:{value:new ee}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Rh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.multiply(Oi),this}rotateOnWorldAxis(t,e){return Oi.setFromAxisAngle(t,e),this.quaternion.premultiply(Oi),this}rotateX(t){return this.rotateOnAxis(Wc,t)}rotateY(t){return this.rotateOnAxis(Xc,t)}rotateZ(t){return this.rotateOnAxis(jc,t)}translateOnAxis(t,e){return qc.copy(t).applyQuaternion(this.quaternion),this.position.add(qc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wc,t)}translateY(t){return this.translateOnAxis(Xc,t)}translateZ(t){return this.translateOnAxis(jc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(On.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?hs.copy(t):hs.set(t,e,i);const o=this.parent;this.updateWorldMatrix(!0,!1),Mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?On.lookAt(Mo,hs,this.up):On.lookAt(hs,Mo,this.up),this.quaternion.setFromRotationMatrix(On),o&&(On.extractRotation(o.matrixWorld),Oi.setFromRotationMatrix(On),this.quaternion.premultiply(Oi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Yc),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Xu),_a.child=t,this.dispatchEvent(_a),_a.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),On.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),On.multiply(t.parent.matrixWorld)),t.applyMatrix4(On),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Yc),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,o=this.children.length;i<o;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const o=this.children;for(let s=0,a=o.length;s<a;s++)o[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,t,qu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Mo,Wu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const o=this.children;for(let s=0,a=o.length;s<a;s++)o[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),o.instanceInfo=this._instanceInfo.map(r=>({...r})),o.availableInstanceIds=this._availableInstanceIds.slice(),o.availableGeometryIds=this._availableGeometryIds.slice(),o.nextIndexStart=this._nextIndexStart,o.nextVertexStart=this._nextVertexStart,o.geometryCount=this._geometryCount,o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.matricesTexture=this._matricesTexture.toJSON(t),o.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(o.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(o.boundingBox=this.boundingBox.toJSON()));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];s(t.shapes,d)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));o.material=r}else o.material=s(t.materials,this.material);if(this.children.length>0){o.children=[];for(let r=0;r<this.children.length;r++)o.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){o.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];o.animations.push(s(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),p=a(t.animations),g=a(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=o,i;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const o=t.children[i];this.add(o.clone())}return this}}xe.DEFAULT_UP=new z(0,1,0);xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const _n=new z,Bn=new z,Ma=new z,kn=new z,ki=new z,Vi=new z,Zc=new z,xa=new z,ya=new z,ba=new z,Sa=new Te,wa=new Te,Ea=new Te;class wn{constructor(t=new z,e=new z,i=new z){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,o){o.subVectors(i,e),_n.subVectors(t,e),o.cross(_n);const s=o.lengthSq();return s>0?o.multiplyScalar(1/Math.sqrt(s)):o.set(0,0,0)}static getBarycoord(t,e,i,o,s){_n.subVectors(o,e),Bn.subVectors(i,e),Ma.subVectors(t,e);const a=_n.dot(_n),r=_n.dot(Bn),c=_n.dot(Ma),l=Bn.dot(Bn),h=Bn.dot(Ma),d=a*l-r*r;if(d===0)return s.set(0,0,0),null;const u=1/d,p=(l*c-r*h)*u,g=(a*h-r*c)*u;return s.set(1-p-g,g,p)}static containsPoint(t,e,i,o){return this.getBarycoord(t,e,i,o,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(t,e,i,o,s,a,r,c){return this.getBarycoord(t,e,i,o,kn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,kn.x),c.addScaledVector(a,kn.y),c.addScaledVector(r,kn.z),c)}static getInterpolatedAttribute(t,e,i,o,s,a){return Sa.setScalar(0),wa.setScalar(0),Ea.setScalar(0),Sa.fromBufferAttribute(t,e),wa.fromBufferAttribute(t,i),Ea.fromBufferAttribute(t,o),a.setScalar(0),a.addScaledVector(Sa,s.x),a.addScaledVector(wa,s.y),a.addScaledVector(Ea,s.z),a}static isFrontFacing(t,e,i,o){return _n.subVectors(i,e),Bn.subVectors(t,e),_n.cross(Bn).dot(o)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,o){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[o]),this}setFromAttributeAndIndices(t,e,i,o){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,o),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return _n.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),_n.cross(Bn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return wn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return wn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,o,s){return wn.getInterpolation(t,this.a,this.b,this.c,e,i,o,s)}containsPoint(t){return wn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return wn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,o=this.b,s=this.c;let a,r;ki.subVectors(o,i),Vi.subVectors(s,i),xa.subVectors(t,i);const c=ki.dot(xa),l=Vi.dot(xa);if(c<=0&&l<=0)return e.copy(i);ya.subVectors(t,o);const h=ki.dot(ya),d=Vi.dot(ya);if(h>=0&&d<=h)return e.copy(o);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(ki,a);ba.subVectors(t,s);const p=ki.dot(ba),g=Vi.dot(ba);if(g>=0&&p<=g)return e.copy(s);const M=p*l-c*g;if(M<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(Vi,r);const m=h*g-p*d;if(m<=0&&d-h>=0&&p-g>=0)return Zc.subVectors(s,o),r=(d-h)/(d-h+(p-g)),e.copy(o).addScaledVector(Zc,r);const f=1/(m+M+u);return a=M*f,r=u*f,e.copy(i).addScaledVector(ki,a).addScaledVector(Vi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ih={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},ds={h:0,s:0,l:0};function Ta(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ce{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const o=t;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=on){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,fe.colorSpaceToWorking(this,e),this}setRGB(t,e,i,o=fe.workingColorSpace){return this.r=t,this.g=e,this.b=i,fe.colorSpaceToWorking(this,o),this}setHSL(t,e,i,o=fe.workingColorSpace){if(t=vc(t,1),e=se(e,0,1),i=se(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,a=2*i-s;this.r=Ta(a,s,t+1/3),this.g=Ta(a,s,t),this.b=Ta(a,s,t-1/3)}return fe.colorSpaceToWorking(this,o),this}setStyle(t,e=on){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=o[1],r=o[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=o[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=on){const i=Ih[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Wn(t.r),this.g=Wn(t.g),this.b=Wn(t.b),this}copyLinearToSRGB(t){return this.r=to(t.r),this.g=to(t.g),this.b=to(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=on){return fe.workingToColorSpace(Oe.copy(this),t),Math.round(se(Oe.r*255,0,255))*65536+Math.round(se(Oe.g*255,0,255))*256+Math.round(se(Oe.b*255,0,255))}getHexString(t=on){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=fe.workingColorSpace){fe.workingToColorSpace(Oe.copy(this),e);const i=Oe.r,o=Oe.g,s=Oe.b,a=Math.max(i,o,s),r=Math.min(i,o,s);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const d=a-r;switch(l=h<=.5?d/(a+r):d/(2-a-r),a){case i:c=(o-s)/d+(o<s?6:0);break;case o:c=(s-i)/d+2;break;case s:c=(i-o)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=fe.workingColorSpace){return fe.workingToColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=on){fe.workingToColorSpace(Oe.copy(this),t);const e=Oe.r,i=Oe.g,o=Oe.b;return t!==on?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(o*255)})`}offsetHSL(t,e,i){return this.getHSL(ni),this.setHSL(ni.h+t,ni.s+e,ni.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ni),t.getHSL(ds);const i=Co(ni.h,ds.h,e),o=Co(ni.s,ds.s,e),s=Co(ni.l,ds.l,e);return this.setHSL(i,o,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,o=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*o,this.g=s[1]*e+s[4]*i+s[7]*o,this.b=s[2]*e+s[5]*i+s[8]*o,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new ce;ce.NAMES=Ih;let ju=0;class ho extends ro{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=Qi,this.side=jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=tr,this.blendDst=er,this.blendEquation=bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ce(0,0,0),this.blendAlpha=0,this.depthFunc=eo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Uc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Li,this.stencilZFail=Li,this.stencilZPass=Li,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const o=this[e];if(o===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(i):o&&o.isVector3&&i&&i.isVector3?o.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Qi&&(i.blending=this.blending),this.side!==jn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==tr&&(i.blendSrc=this.blendSrc),this.blendDst!==er&&(i.blendDst=this.blendDst),this.blendEquation!==bi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==eo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Uc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Li&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Li&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Li&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function o(s){const a=[];for(const r in s){const c=s[r];delete c.metadata,a.push(c)}return a}if(e){const s=o(t.textures),a=o(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const o=e.length;i=new Array(o);for(let s=0;s!==o;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class na extends ho{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=gh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new z,us=new Ct;let Yu=0;class Dn{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Yu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Nc,this.updateRanges=[],this.gpuType=Gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let o=0,s=this.itemSize;o<s;o++)this.array[t+o]=e.array[i+o];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)us.fromBufferAttribute(this,e),us.applyMatrix3(t),this.setXY(e,us.x,us.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Zi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=We(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),i=We(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,o){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),i=We(i,this.array),o=We(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=o,this}setXYZW(t,e,i,o,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),i=We(i,this.array),o=We(o,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=o,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Nc&&(t.usage=this.usage),t}}class Lh extends Dn{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Dh extends Dn{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class le extends Dn{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Zu=0;const ln=new Ee,Aa=new xe,Hi=new z,en=new lo,xo=new lo,Le=new z;class De extends ro{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Zu++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Ah(t)?Dh:Lh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ee().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(t),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ln.makeRotationFromQuaternion(t),this.applyMatrix4(ln),this}rotateX(t){return ln.makeRotationX(t),this.applyMatrix4(ln),this}rotateY(t){return ln.makeRotationY(t),this.applyMatrix4(ln),this}rotateZ(t){return ln.makeRotationZ(t),this.applyMatrix4(ln),this}translate(t,e,i){return ln.makeTranslation(t,e,i),this.applyMatrix4(ln),this}scale(t,e,i){return ln.makeScale(t,e,i),this.applyMatrix4(ln),this}lookAt(t){return Aa.lookAt(t),Aa.updateMatrix(),this.applyMatrix4(Aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hi).negate(),this.translate(Hi.x,Hi.y,Hi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let o=0,s=t.length;o<s;o++){const a=t[o];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new le(i,3))}else{const i=Math.min(t.length,e.count);for(let o=0;o<i;o++){const s=t[o];e.setXYZ(o,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new lo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,o=e.length;i<o;i++){const s=e[i];en.setFromBufferAttribute(s),this.morphTargetsRelative?(Le.addVectors(this.boundingBox.min,en.min),this.boundingBox.expandByPoint(Le),Le.addVectors(this.boundingBox.max,en.max),this.boundingBox.expandByPoint(Le)):(this.boundingBox.expandByPoint(en.min),this.boundingBox.expandByPoint(en.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ea);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(t){const i=this.boundingSphere.center;if(en.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const r=e[s];xo.setFromBufferAttribute(r),this.morphTargetsRelative?(Le.addVectors(en.min,xo.min),en.expandByPoint(Le),Le.addVectors(en.max,xo.max),en.expandByPoint(Le)):(en.expandByPoint(xo.min),en.expandByPoint(xo.max))}en.getCenter(i);let o=0;for(let s=0,a=t.count;s<a;s++)Le.fromBufferAttribute(t,s),o=Math.max(o,i.distanceToSquared(Le));if(e)for(let s=0,a=e.length;s<a;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)Le.fromBufferAttribute(r,l),c&&(Hi.fromBufferAttribute(t,l),Le.add(Hi)),o=Math.max(o,i.distanceToSquared(Le))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,o=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),r=[],c=[];for(let L=0;L<i.count;L++)r[L]=new z,c[L]=new z;const l=new z,h=new z,d=new z,u=new Ct,p=new Ct,g=new Ct,M=new z,m=new z;function f(L,E,b){l.fromBufferAttribute(i,L),h.fromBufferAttribute(i,E),d.fromBufferAttribute(i,b),u.fromBufferAttribute(s,L),p.fromBufferAttribute(s,E),g.fromBufferAttribute(s,b),h.sub(l),d.sub(l),p.sub(u),g.sub(u);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(d,-p.y).multiplyScalar(D),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(D),r[L].add(M),r[E].add(M),r[b].add(M),c[L].add(m),c[E].add(m),c[b].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let L=0,E=S.length;L<E;++L){const b=S[L],D=b.start,F=b.count;for(let V=D,q=D+F;V<q;V+=3)f(t.getX(V+0),t.getX(V+1),t.getX(V+2))}const y=new z,x=new z,A=new z,C=new z;function P(L){A.fromBufferAttribute(o,L),C.copy(A);const E=r[L];y.copy(E),y.sub(A.multiplyScalar(A.dot(E))).normalize(),x.crossVectors(C,E);const D=x.dot(c[L])<0?-1:1;a.setXYZW(L,y.x,y.y,y.z,D)}for(let L=0,E=S.length;L<E;++L){const b=S[L],D=b.start,F=b.count;for(let V=D,q=D+F;V<q;V+=3)P(t.getX(V+0)),P(t.getX(V+1)),P(t.getX(V+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Dn(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);const o=new z,s=new z,a=new z,r=new z,c=new z,l=new z,h=new z,d=new z;if(t)for(let u=0,p=t.count;u<p;u+=3){const g=t.getX(u+0),M=t.getX(u+1),m=t.getX(u+2);o.fromBufferAttribute(e,g),s.fromBufferAttribute(e,M),a.fromBufferAttribute(e,m),h.subVectors(a,s),d.subVectors(o,s),h.cross(d),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,M),l.fromBufferAttribute(i,m),r.add(h),c.add(h),l.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,p=e.count;u<p;u+=3)o.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,s),d.subVectors(o,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Le.fromBufferAttribute(t,e),Le.normalize(),t.setXYZ(e,Le.x,Le.y,Le.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,d=r.normalized,u=new l.constructor(c.length*h);let p=0,g=0;for(let M=0,m=c.length;M<m;M++){r.isInterleavedBufferAttribute?p=c[M]*r.data.stride+r.offset:p=c[M]*h;for(let f=0;f<h;f++)u[g++]=l[p++]}return new Dn(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new De,i=this.index.array,o=this.attributes;for(const r in o){const c=o[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let h=0,d=l.length;h<d;h++){const u=l[h],p=t(u,i);c.push(p)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const o={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const p=l[d];h.push(p.toJSON(t.data))}h.length>0&&(o[c]=h,s=!0)}s&&(t.data.morphAttributes=o,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const o=t.attributes;for(const l in o){const h=o[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],d=s[l];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const $c=new Ee,mi=new Ph,fs=new ea,Jc=new z,ps=new z,ms=new z,gs=new z,Ca=new z,vs=new z,Kc=new z,_s=new z;class v extends xe{constructor(t=new De,e=new na){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const o=e[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=o.length;s<a;s++){const r=o[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,o=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(o,t);const r=this.morphTargetInfluences;if(s&&r){vs.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=r[c],d=s[c];h!==0&&(Ca.fromBufferAttribute(d,t),a?vs.addScaledVector(Ca,h):vs.addScaledVector(Ca.sub(e),h))}e.add(vs)}return e}raycast(t,e){const i=this.geometry,o=this.material,s=this.matrixWorld;o!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),fs.copy(i.boundingSphere),fs.applyMatrix4(s),mi.copy(t.ray).recast(t.near),!(fs.containsPoint(mi.origin)===!1&&(mi.intersectSphere(fs,Jc)===null||mi.origin.distanceToSquared(Jc)>(t.far-t.near)**2))&&($c.copy(s).invert(),mi.copy(t.ray).applyMatrix4($c),!(i.boundingBox!==null&&mi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,mi)))}_computeIntersections(t,e,i){let o;const s=this.geometry,a=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,p=s.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,M=u.length;g<M;g++){const m=u[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),y=Math.min(r.count,Math.min(m.start+m.count,p.start+p.count));for(let x=S,A=y;x<A;x+=3){const C=r.getX(x),P=r.getX(x+1),L=r.getX(x+2);o=Ms(this,f,t,i,l,h,d,C,P,L),o&&(o.faceIndex=Math.floor(x/3),o.face.materialIndex=m.materialIndex,e.push(o))}}else{const g=Math.max(0,p.start),M=Math.min(r.count,p.start+p.count);for(let m=g,f=M;m<f;m+=3){const S=r.getX(m),y=r.getX(m+1),x=r.getX(m+2);o=Ms(this,a,t,i,l,h,d,S,y,x),o&&(o.faceIndex=Math.floor(m/3),e.push(o))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,M=u.length;g<M;g++){const m=u[g],f=a[m.materialIndex],S=Math.max(m.start,p.start),y=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let x=S,A=y;x<A;x+=3){const C=x,P=x+1,L=x+2;o=Ms(this,f,t,i,l,h,d,C,P,L),o&&(o.faceIndex=Math.floor(x/3),o.face.materialIndex=m.materialIndex,e.push(o))}}else{const g=Math.max(0,p.start),M=Math.min(c.count,p.start+p.count);for(let m=g,f=M;m<f;m+=3){const S=m,y=m+1,x=m+2;o=Ms(this,a,t,i,l,h,d,S,y,x),o&&(o.faceIndex=Math.floor(m/3),e.push(o))}}}}function $u(n,t,e,i,o,s,a,r){let c;if(t.side===Ke?c=i.intersectTriangle(a,s,o,!0,r):c=i.intersectTriangle(o,s,a,t.side===jn,r),c===null)return null;_s.copy(r),_s.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(_s);return l<e.near||l>e.far?null:{distance:l,point:_s.clone(),object:n}}function Ms(n,t,e,i,o,s,a,r,c,l){n.getVertexPosition(r,ps),n.getVertexPosition(c,ms),n.getVertexPosition(l,gs);const h=$u(n,t,e,i,ps,ms,gs,Kc);if(h){const d=new z;wn.getBarycoord(Kc,ps,ms,gs,d),o&&(h.uv=wn.getInterpolatedAttribute(o,r,c,l,d,new Ct)),s&&(h.uv1=wn.getInterpolatedAttribute(s,r,c,l,d,new Ct)),a&&(h.normal=wn.getInterpolatedAttribute(a,r,c,l,d,new z),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:c,c:l,normal:new z,materialIndex:0};wn.getNormal(ps,ms,gs,u.normal),h.face=u,h.barycoord=d}return h}class k extends De{constructor(t=1,e=1,i=1,o=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:o,heightSegments:s,depthSegments:a};const r=this;o=Math.floor(o),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,p=0;g("z","y","x",-1,-1,i,e,t,a,s,0),g("z","y","x",1,-1,i,e,-t,a,s,1),g("x","z","y",1,1,t,i,e,o,a,2),g("x","z","y",1,-1,t,i,-e,o,a,3),g("x","y","z",1,-1,t,e,i,o,s,4),g("x","y","z",-1,-1,t,e,-i,o,s,5),this.setIndex(c),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(d,2));function g(M,m,f,S,y,x,A,C,P,L,E){const b=x/P,D=A/L,F=x/2,V=A/2,q=C/2,W=P+1,j=L+1;let N=0,B=0;const K=new z;for(let X=0;X<j;X++){const ht=X*D-V;for(let ft=0;ft<W;ft++){const St=ft*b-F;K[M]=St*S,K[m]=ht*y,K[f]=q,l.push(K.x,K.y,K.z),K[M]=0,K[m]=0,K[f]=C>0?1:-1,h.push(K.x,K.y,K.z),d.push(ft/P),d.push(1-X/L),N+=1}}for(let X=0;X<L;X++)for(let ht=0;ht<P;ht++){const ft=u+ht+W*X,St=u+ht+W*(X+1),Dt=u+(ht+1)+W*(X+1),Kt=u+(ht+1)+W*X;c.push(ft,St,Kt),c.push(St,Dt,Kt),B+=6}r.addGroup(p,B,E),p+=B,u+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new k(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function so(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const o=n[e][i];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=o.clone():Array.isArray(o)?t[e][i]=o.slice():t[e][i]=o}}return t}function Xe(n){const t={};for(let e=0;e<n.length;e++){const i=so(n[e]);for(const o in i)t[o]=i[o]}return t}function Ju(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Uh(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:fe.workingColorSpace}const Ku={clone:so,merge:Xe};var Qu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,tf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class li extends ho{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Qu,this.fragmentShader=tf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=so(t.uniforms),this.uniformsGroups=Ju(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const o in this.uniforms){const a=this.uniforms[o].value;a&&a.isTexture?e.uniforms[o]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[o]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[o]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[o]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[o]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[o]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[o]={type:"m4",value:a.toArray()}:e.uniforms[o]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const o in this.extensions)this.extensions[o]===!0&&(i[o]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Nh extends xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=Rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ii=new z,Qc=new Ct,tl=new Ct;class sn extends Nh{constructor(t=50,e=1,i=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=o,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=zo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ao*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return zo*2*Math.atan(Math.tan(Ao*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ii.x,ii.y).multiplyScalar(-t/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ii.x,ii.y).multiplyScalar(-t/ii.z)}getViewSize(t,e){return this.getViewBounds(t,Qc,tl),e.subVectors(tl,Qc)}setViewOffset(t,e,i,o,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=o,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ao*.5*this.fov)/this.zoom,i=2*e,o=this.aspect*i,s=-.5*o;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*o/c,e-=a.offsetY*i/l,o*=a.width/c,i*=a.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+o,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Gi=-90,qi=1;class ef extends xe{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new sn(Gi,qi,t,e);o.layers=this.layers,this.add(o);const s=new sn(Gi,qi,t,e);s.layers=this.layers,this.add(s);const a=new sn(Gi,qi,t,e);a.layers=this.layers,this.add(a);const r=new sn(Gi,qi,t,e);r.layers=this.layers,this.add(r);const c=new sn(Gi,qi,t,e);c.layers=this.layers,this.add(c);const l=new sn(Gi,qi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,o,s,a,r,c]=e;for(const l of e)this.remove(l);if(t===Rn)i.up.set(0,1,0),i.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ws)i.up.set(0,-1,0),i.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:o}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,r,c,l,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,o),t.render(e,s),t.setRenderTarget(i,1,o),t.render(e,a),t.setRenderTarget(i,2,o),t.render(e,r),t.setRenderTarget(i,3,o),t.render(e,c),t.setRenderTarget(i,4,o),t.render(e,l),i.texture.generateMipmaps=M,t.setRenderTarget(i,5,o),t.render(e,h),t.setRenderTarget(d,u,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class zh extends ke{constructor(t=[],e=no,i,o,s,a,r,c,l,h){super(t,e,i,o,s,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class nf extends Ci{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},o=[i,i,i,i,i,i];this.texture=new zh(o),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new k(5,5,5),s=new li({name:"CubemapFromEquirect",uniforms:so(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ke,blending:ri});s.uniforms.tEquirect.value=e;const a=new v(o,s),r=e.minFilter;return e.minFilter===Ei&&(e.minFilter=Pn),new ef(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,o=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,o);t.setRenderTarget(s)}}class at extends xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const of={type:"move"};class Pa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new at,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new at,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new at,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let o=null,s=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const M of t.hand.values()){const m=e.getJointPose(M,i),f=this._getHandJoint(l,M);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,g=.005;l.inputState.pinching&&u>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(o=e.getPose(t.targetRaySpace,i),o===null&&s!==null&&(o=s),o!==null&&(r.matrix.fromArray(o.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,o.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(o.linearVelocity)):r.hasLinearVelocity=!1,o.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(o.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(of)))}return r!==null&&(r.visible=o!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new at;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Mc{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new ce(t),this.near=e,this.far=i}clone(){return new Mc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Fh extends xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class sf extends ke{constructor(t=null,e=1,i=1,o,s,a,r,c,l=Ye,h=Ye,d,u){super(null,a,r,c,l,h,o,s,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ra=new z,af=new z,rf=new ee;class xi{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,o){return this.normal.set(t,e,i),this.constant=o,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const o=Ra.subVectors(i,e).cross(af.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(o,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Ra),o=this.normal.dot(i);if(o===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/o;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||rf.getNormalMatrix(t),o=this.coplanarPoint(Ra).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-o.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new ea,cf=new Ct(.5,.5),xs=new z;class xc{constructor(t=new xi,e=new xi,i=new xi,o=new xi,s=new xi,a=new xi){this.planes=[t,e,i,o,s,a]}set(t,e,i,o,s,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(o),r[4].copy(s),r[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Rn,i=!1){const o=this.planes,s=t.elements,a=s[0],r=s[1],c=s[2],l=s[3],h=s[4],d=s[5],u=s[6],p=s[7],g=s[8],M=s[9],m=s[10],f=s[11],S=s[12],y=s[13],x=s[14],A=s[15];if(o[0].setComponents(l-a,p-h,f-g,A-S).normalize(),o[1].setComponents(l+a,p+h,f+g,A+S).normalize(),o[2].setComponents(l+r,p+d,f+M,A+y).normalize(),o[3].setComponents(l-r,p-d,f-M,A-y).normalize(),i)o[4].setComponents(c,u,m,x).normalize(),o[5].setComponents(l-c,p-u,f-m,A-x).normalize();else if(o[4].setComponents(l-c,p-u,f-m,A-x).normalize(),e===Rn)o[5].setComponents(l+c,p+u,f+m,A+x).normalize();else if(e===Ws)o[5].setComponents(c,u,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(t){gi.center.set(0,0,0);const e=cf.distanceTo(t.center);return gi.radius=.7071067811865476+e,gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(t){const e=this.planes,i=t.center,o=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<o)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const o=e[i];if(xs.x=o.normal.x>0?t.max.x:t.min.x,xs.y=o.normal.y>0?t.max.y:t.min.y,xs.z=o.normal.z>0?t.max.z:t.min.z,o.distanceToPoint(xs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Oh extends ho{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ce(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const js=new z,Ys=new z,el=new Ee,yo=new Ph,ys=new ea,Ia=new z,nl=new z;class lf extends xe{constructor(t=new De,e=new Oh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let o=1,s=e.count;o<s;o++)js.fromBufferAttribute(e,o-1),Ys.fromBufferAttribute(e,o),i[o]=i[o-1],i[o]+=js.distanceTo(Ys);t.setAttribute("lineDistance",new le(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,o=this.matrixWorld,s=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ys.copy(i.boundingSphere),ys.applyMatrix4(o),ys.radius+=s,t.ray.intersectsSphere(ys)===!1)return;el.copy(o).invert(),yo.copy(t.ray).applyMatrix4(el);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let M=p,m=g-1;M<m;M+=l){const f=h.getX(M),S=h.getX(M+1),y=bs(this,t,yo,c,f,S,M);y&&e.push(y)}if(this.isLineLoop){const M=h.getX(g-1),m=h.getX(p),f=bs(this,t,yo,c,M,m,g-1);f&&e.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let M=p,m=g-1;M<m;M+=l){const f=bs(this,t,yo,c,M,M+1,M);f&&e.push(f)}if(this.isLineLoop){const M=bs(this,t,yo,c,g-1,p,g-1);M&&e.push(M)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const o=e[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=o.length;s<a;s++){const r=o[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function bs(n,t,e,i,o,s,a){const r=n.geometry.attributes.position;if(js.fromBufferAttribute(r,o),Ys.fromBufferAttribute(r,s),e.distanceSqToSegment(js,Ys,Ia,nl)>i)return;Ia.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Ia);if(!(l<t.near||l>t.far))return{distance:l,point:nl.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const il=new z,ol=new z;class sl extends lf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let o=0,s=e.count;o<s;o+=2)il.fromBufferAttribute(e,o),ol.fromBufferAttribute(e,o+1),i[o]=o===0?0:i[o-1],i[o+1]=i[o]+il.distanceTo(ol);t.setAttribute("lineDistance",new le(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class hf extends ke{constructor(t,e,i,o,s,a,r,c,l){super(t,e,i,o,s,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Bh extends ke{constructor(t,e,i=Ai,o,s,a,r=Ye,c=Ye,l,h=Uo,d=1){if(h!==Uo&&h!==No)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,o,s,a,r,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new _c(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class kh extends ke{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class An extends De{constructor(t=1,e=1,i=4,o=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:o,heightSegments:s},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),o=Math.max(3,Math.floor(o)),s=Math.max(1,Math.floor(s));const a=[],r=[],c=[],l=[],h=e/2,d=Math.PI/2*t,u=e,p=2*d+u,g=i*2+s,M=o+1,m=new z,f=new z;for(let S=0;S<=g;S++){let y=0,x=0,A=0,C=0;if(S<=i){const E=S/i,b=E*Math.PI/2;x=-h-t*Math.cos(b),A=t*Math.sin(b),C=-t*Math.cos(b),y=E*d}else if(S<=i+s){const E=(S-i)/s;x=-h+E*e,A=t,C=0,y=d+E*u}else{const E=(S-i-s)/i,b=E*Math.PI/2;x=h+t*Math.sin(b),A=t*Math.cos(b),C=t*Math.sin(b),y=d+u+E*d}const P=Math.max(0,Math.min(1,y/p));let L=0;S===0?L=.5/o:S===g&&(L=-.5/o);for(let E=0;E<=o;E++){const b=E/o,D=b*Math.PI*2,F=Math.sin(D),V=Math.cos(D);f.x=-A*V,f.y=x,f.z=A*F,r.push(f.x,f.y,f.z),m.set(-A*V,C,A*F),m.normalize(),c.push(m.x,m.y,m.z),l.push(b+L,P)}if(S>0){const E=(S-1)*M;for(let b=0;b<o;b++){const D=E+b,F=E+b+1,V=S*M+b,q=S*M+b+1;a.push(D,F,V),a.push(F,q,V)}}}this.setIndex(a),this.setAttribute("position",new le(r,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new An(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Oo extends De{constructor(t=1,e=32,i=0,o=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:o},e=Math.max(3,e);const s=[],a=[],r=[],c=[],l=new z,h=new Ct;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const p=i+d/e*o;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,c.push(h.x,h.y)}for(let d=1;d<=e;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new le(a,3)),this.setAttribute("normal",new le(r,3)),this.setAttribute("uv",new le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Oo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class et extends De{constructor(t=1,e=1,i=1,o=32,s=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:o,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:c};const l=this;o=Math.floor(o),s=Math.floor(s);const h=[],d=[],u=[],p=[];let g=0;const M=[],m=i/2;let f=0;S(),a===!1&&(t>0&&y(!0),e>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new le(d,3)),this.setAttribute("normal",new le(u,3)),this.setAttribute("uv",new le(p,2));function S(){const x=new z,A=new z;let C=0;const P=(e-t)/i;for(let L=0;L<=s;L++){const E=[],b=L/s,D=b*(e-t)+t;for(let F=0;F<=o;F++){const V=F/o,q=V*c+r,W=Math.sin(q),j=Math.cos(q);A.x=D*W,A.y=-b*i+m,A.z=D*j,d.push(A.x,A.y,A.z),x.set(W,P,j).normalize(),u.push(x.x,x.y,x.z),p.push(V,1-b),E.push(g++)}M.push(E)}for(let L=0;L<o;L++)for(let E=0;E<s;E++){const b=M[E][L],D=M[E+1][L],F=M[E+1][L+1],V=M[E][L+1];(t>0||E!==0)&&(h.push(b,D,V),C+=3),(e>0||E!==s-1)&&(h.push(D,F,V),C+=3)}l.addGroup(f,C,0),f+=C}function y(x){const A=g,C=new Ct,P=new z;let L=0;const E=x===!0?t:e,b=x===!0?1:-1;for(let F=1;F<=o;F++)d.push(0,m*b,0),u.push(0,b,0),p.push(.5,.5),g++;const D=g;for(let F=0;F<=o;F++){const q=F/o*c+r,W=Math.cos(q),j=Math.sin(q);P.x=E*j,P.y=m*b,P.z=E*W,d.push(P.x,P.y,P.z),u.push(0,b,0),C.x=W*.5+.5,C.y=j*.5*b+.5,p.push(C.x,C.y),g++}for(let F=0;F<o;F++){const V=A+F,q=D+F;x===!0?h.push(q,q+1,V):h.push(q+1,q,V),L+=3}l.addGroup(f,L,x===!0?1:2),f+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new et(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Pe extends et{constructor(t=1,e=1,i=32,o=1,s=!1,a=0,r=Math.PI*2){super(0,t,e,i,o,s,a,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:o,openEnded:s,thetaStart:a,thetaLength:r}}static fromJSON(t){return new Pe(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ia extends De{constructor(t=[],e=[],i=1,o=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:o};const s=[],a=[];r(o),l(i),h(),this.setAttribute("position",new le(s,3)),this.setAttribute("normal",new le(s.slice(),3)),this.setAttribute("uv",new le(a,2)),o===0?this.computeVertexNormals():this.normalizeNormals();function r(S){const y=new z,x=new z,A=new z;for(let C=0;C<e.length;C+=3)p(e[C+0],y),p(e[C+1],x),p(e[C+2],A),c(y,x,A,S)}function c(S,y,x,A){const C=A+1,P=[];for(let L=0;L<=C;L++){P[L]=[];const E=S.clone().lerp(x,L/C),b=y.clone().lerp(x,L/C),D=C-L;for(let F=0;F<=D;F++)F===0&&L===C?P[L][F]=E:P[L][F]=E.clone().lerp(b,F/D)}for(let L=0;L<C;L++)for(let E=0;E<2*(C-L)-1;E++){const b=Math.floor(E/2);E%2===0?(u(P[L][b+1]),u(P[L+1][b]),u(P[L][b])):(u(P[L][b+1]),u(P[L+1][b+1]),u(P[L+1][b]))}}function l(S){const y=new z;for(let x=0;x<s.length;x+=3)y.x=s[x+0],y.y=s[x+1],y.z=s[x+2],y.normalize().multiplyScalar(S),s[x+0]=y.x,s[x+1]=y.y,s[x+2]=y.z}function h(){const S=new z;for(let y=0;y<s.length;y+=3){S.x=s[y+0],S.y=s[y+1],S.z=s[y+2];const x=m(S)/2/Math.PI+.5,A=f(S)/Math.PI+.5;a.push(x,1-A)}g(),d()}function d(){for(let S=0;S<a.length;S+=6){const y=a[S+0],x=a[S+2],A=a[S+4],C=Math.max(y,x,A),P=Math.min(y,x,A);C>.9&&P<.1&&(y<.2&&(a[S+0]+=1),x<.2&&(a[S+2]+=1),A<.2&&(a[S+4]+=1))}}function u(S){s.push(S.x,S.y,S.z)}function p(S,y){const x=S*3;y.x=t[x+0],y.y=t[x+1],y.z=t[x+2]}function g(){const S=new z,y=new z,x=new z,A=new z,C=new Ct,P=new Ct,L=new Ct;for(let E=0,b=0;E<s.length;E+=9,b+=6){S.set(s[E+0],s[E+1],s[E+2]),y.set(s[E+3],s[E+4],s[E+5]),x.set(s[E+6],s[E+7],s[E+8]),C.set(a[b+0],a[b+1]),P.set(a[b+2],a[b+3]),L.set(a[b+4],a[b+5]),A.copy(S).add(y).add(x).divideScalar(3);const D=m(A);M(C,b+0,S,D),M(P,b+2,y,D),M(L,b+4,x,D)}}function M(S,y,x,A){A<0&&S.x===1&&(a[y]=S.x-1),x.x===0&&x.z===0&&(a[y]=A/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function f(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ia(t.vertices,t.indices,t.radius,t.details)}}class yc extends ia{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,o=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-o,-i,0,-o,i,0,o,-i,0,o,i,-o,-i,0,-o,i,0,o,-i,0,o,i,0,-i,0,-o,i,0,-o,-i,0,o,i,0,o],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new yc(t.radius,t.detail)}}class Nn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,o=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),s+=i.distanceTo(o),e.push(s),o=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let o=0;const s=i.length;let a;e?a=e:a=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(o=Math.floor(r+(c-r)/2),l=i[o]-a,l<0)r=o+1;else if(l>0)c=o-1;else{c=o;break}if(o=c,i[o]===a)return o/(s-1);const h=i[o],u=i[o+1]-h,p=(a-h)/u;return(o+p)/(s-1)}getTangent(t,e){let o=t-1e-4,s=t+1e-4;o<0&&(o=0),s>1&&(s=1);const a=this.getPoint(o),r=this.getPoint(s),c=e||(a.isVector2?new Ct:new z);return c.copy(r).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new z,o=[],s=[],a=[],r=new z,c=new Ee;for(let p=0;p<=t;p++){const g=p/t;o[p]=this.getTangentAt(g,new z)}s[0]=new z,a[0]=new z;let l=Number.MAX_VALUE;const h=Math.abs(o[0].x),d=Math.abs(o[0].y),u=Math.abs(o[0].z);h<=l&&(l=h,i.set(1,0,0)),d<=l&&(l=d,i.set(0,1,0)),u<=l&&i.set(0,0,1),r.crossVectors(o[0],i).normalize(),s[0].crossVectors(o[0],r),a[0].crossVectors(o[0],s[0]);for(let p=1;p<=t;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),r.crossVectors(o[p-1],o[p]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(se(o[p-1].dot(o[p]),-1,1));s[p].applyMatrix4(c.makeRotationAxis(r,g))}a[p].crossVectors(o[p],s[p])}if(e===!0){let p=Math.acos(se(s[0].dot(s[t]),-1,1));p/=t,o[0].dot(r.crossVectors(s[0],s[t]))>0&&(p=-p);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(o[g],p*g)),a[g].crossVectors(o[g],s[g])}return{tangents:o,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class bc extends Nn{constructor(t=0,e=0,i=1,o=1,s=0,a=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=o,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Ct){const i=e,o=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=o;for(;s>o;)s-=o;s<Number.EPSILON&&(a?s=0:s=o),this.aClockwise===!0&&!a&&(s===o?s=-o:s=s-o);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,p=l-this.aY;c=u*h-p*d+this.aX,l=u*d+p*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class df extends bc{constructor(t,e,i,o,s,a){super(t,e,i,i,o,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Sc(){let n=0,t=0,e=0,i=0;function o(s,a,r,c){n=s,t=r,e=-3*s+3*a-2*r-c,i=2*s-2*a+r+c}return{initCatmullRom:function(s,a,r,c,l){o(a,r,l*(r-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,r,c,l,h,d){let u=(a-s)/l-(r-s)/(l+h)+(r-a)/h,p=(r-a)/h-(c-a)/(h+d)+(c-r)/d;u*=h,p*=h,o(a,r,u,p)},calc:function(s){const a=s*s,r=a*s;return n+t*s+e*a+i*r}}}const Ss=new z,La=new Sc,Da=new Sc,Ua=new Sc;class uf extends Nn{constructor(t=[],e=!1,i="centripetal",o=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=o}getPoint(t,e=new z){const i=e,o=this.points,s=o.length,a=(s-(this.closed?0:1))*t;let r=Math.floor(a),c=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,h;this.closed||r>0?l=o[(r-1)%s]:(Ss.subVectors(o[0],o[1]).add(o[0]),l=Ss);const d=o[r%s],u=o[(r+1)%s];if(this.closed||r+2<s?h=o[(r+2)%s]:(Ss.subVectors(o[s-1],o[s-2]).add(o[s-1]),h=Ss),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),p),M=Math.pow(d.distanceToSquared(u),p),m=Math.pow(u.distanceToSquared(h),p);M<1e-4&&(M=1),g<1e-4&&(g=M),m<1e-4&&(m=M),La.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,M,m),Da.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,M,m),Ua.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,M,m)}else this.curveType==="catmullrom"&&(La.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),Da.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Ua.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return i.set(La.calc(c),Da.calc(c),Ua.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(o.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const o=this.points[e];t.points.push(o.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(new z().fromArray(o))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function al(n,t,e,i,o){const s=(i-t)*.5,a=(o-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+a)*c+(-3*e+3*i-2*s-a)*r+s*n+e}function ff(n,t){const e=1-n;return e*e*t}function pf(n,t){return 2*(1-n)*n*t}function mf(n,t){return n*n*t}function Po(n,t,e,i){return ff(n,t)+pf(n,e)+mf(n,i)}function gf(n,t){const e=1-n;return e*e*e*t}function vf(n,t){const e=1-n;return 3*e*e*n*t}function _f(n,t){return 3*(1-n)*n*n*t}function Mf(n,t){return n*n*n*t}function Ro(n,t,e,i,o){return gf(n,t)+vf(n,e)+_f(n,i)+Mf(n,o)}class Vh extends Nn{constructor(t=new Ct,e=new Ct,i=new Ct,o=new Ct){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=o}getPoint(t,e=new Ct){const i=e,o=this.v0,s=this.v1,a=this.v2,r=this.v3;return i.set(Ro(t,o.x,s.x,a.x,r.x),Ro(t,o.y,s.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class xf extends Nn{constructor(t=new z,e=new z,i=new z,o=new z){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=o}getPoint(t,e=new z){const i=e,o=this.v0,s=this.v1,a=this.v2,r=this.v3;return i.set(Ro(t,o.x,s.x,a.x,r.x),Ro(t,o.y,s.y,a.y,r.y),Ro(t,o.z,s.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Hh extends Nn{constructor(t=new Ct,e=new Ct){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Ct){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Ct){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class yf extends Nn{constructor(t=new z,e=new z){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new z){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new z){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Gh extends Nn{constructor(t=new Ct,e=new Ct,i=new Ct){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Ct){const i=e,o=this.v0,s=this.v1,a=this.v2;return i.set(Po(t,o.x,s.x,a.x),Po(t,o.y,s.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class bf extends Nn{constructor(t=new z,e=new z,i=new z){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new z){const i=e,o=this.v0,s=this.v1,a=this.v2;return i.set(Po(t,o.x,s.x,a.x),Po(t,o.y,s.y,a.y),Po(t,o.z,s.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class qh extends Nn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Ct){const i=e,o=this.points,s=(o.length-1)*t,a=Math.floor(s),r=s-a,c=o[a===0?a:a-1],l=o[a],h=o[a>o.length-2?o.length-1:a+1],d=o[a>o.length-3?o.length-1:a+2];return i.set(al(r,c.x,l.x,h.x,d.x),al(r,c.y,l.y,h.y,d.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(o.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const o=this.points[e];t.points.push(o.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(new Ct().fromArray(o))}return this}}var Vr=Object.freeze({__proto__:null,ArcCurve:df,CatmullRomCurve3:uf,CubicBezierCurve:Vh,CubicBezierCurve3:xf,EllipseCurve:bc,LineCurve:Hh,LineCurve3:yf,QuadraticBezierCurve:Gh,QuadraticBezierCurve3:bf,SplineCurve:qh});class Sf extends Nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Vr[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),o=this.getCurveLengths();let s=0;for(;s<o.length;){if(o[s]>=i){const a=o[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-a/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,o=this.curves.length;i<o;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let o=0,s=this.curves;o<s.length;o++){const a=s[o],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const o=t.curves[e];this.curves.push(o.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const o=this.curves[e];t.curves.push(o.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const o=t.curves[e];this.curves.push(new Vr[o.type]().fromJSON(o))}return this}}class Hr extends Sf{constructor(t){super(),this.type="Path",this.currentPoint=new Ct,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Hh(this.currentPoint.clone(),new Ct(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,o){const s=new Gh(this.currentPoint.clone(),new Ct(t,e),new Ct(i,o));return this.curves.push(s),this.currentPoint.set(i,o),this}bezierCurveTo(t,e,i,o,s,a){const r=new Vh(this.currentPoint.clone(),new Ct(t,e),new Ct(i,o),new Ct(s,a));return this.curves.push(r),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new qh(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,o,s,a){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,o,s,a),this}absarc(t,e,i,o,s,a){return this.absellipse(t,e,i,i,o,s,a),this}ellipse(t,e,i,o,s,a,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,o,s,a,r,c),this}absellipse(t,e,i,o,s,a,r,c){const l=new bc(t,e,i,o,s,a,r,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Wo extends Hr{constructor(t){super(t),this.uuid=Ri(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,o=this.holes.length;i<o;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const o=t.holes[e];this.holes.push(o.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const o=this.holes[e];t.holes.push(o.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const o=t.holes[e];this.holes.push(new Hr().fromJSON(o))}return this}}function wf(n,t,e=2){const i=t&&t.length,o=i?t[0]*e:n.length;let s=Wh(n,0,o,e,!0);const a=[];if(!s||s.next===s.prev)return a;let r,c,l;if(i&&(s=Pf(n,t,s,e)),n.length>80*e){r=1/0,c=1/0;let h=-1/0,d=-1/0;for(let u=e;u<o;u+=e){const p=n[u],g=n[u+1];p<r&&(r=p),g<c&&(c=g),p>h&&(h=p),g>d&&(d=g)}l=Math.max(h-r,d-c),l=l!==0?32767/l:0}return Bo(s,a,e,r,c,l,0),a}function Wh(n,t,e,i,o){let s;if(o===kf(n,t,e,i)>0)for(let a=t;a<e;a+=i)s=rl(a/i|0,n[a],n[a+1],s);else for(let a=e-i;a>=t;a-=i)s=rl(a/i|0,n[a],n[a+1],s);return s&&ao(s,s.next)&&(Vo(s),s=s.next),s}function Pi(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(ao(e,e.next)||we(e.prev,e,e.next)===0)){if(Vo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Bo(n,t,e,i,o,s,a){if(!n)return;!a&&s&&Uf(n,i,o,s);let r=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(s?Tf(n,i,o,s):Ef(n)){t.push(c.i,n.i,l.i),Vo(n),n=l.next,r=l.next;continue}if(n=l,n===r){a?a===1?(n=Af(Pi(n),t),Bo(n,t,e,i,o,s,2)):a===2&&Cf(n,t,e,i,o,s):Bo(Pi(n),t,e,i,o,s,1);break}}}function Ef(n){const t=n.prev,e=n,i=n.next;if(we(t,e,i)>=0)return!1;const o=t.x,s=e.x,a=i.x,r=t.y,c=e.y,l=i.y,h=Math.min(o,s,a),d=Math.min(r,c,l),u=Math.max(o,s,a),p=Math.max(r,c,l);let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=p&&Eo(o,r,s,c,a,l,g.x,g.y)&&we(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Tf(n,t,e,i){const o=n.prev,s=n,a=n.next;if(we(o,s,a)>=0)return!1;const r=o.x,c=s.x,l=a.x,h=o.y,d=s.y,u=a.y,p=Math.min(r,c,l),g=Math.min(h,d,u),M=Math.max(r,c,l),m=Math.max(h,d,u),f=Gr(p,g,t,e,i),S=Gr(M,m,t,e,i);let y=n.prevZ,x=n.nextZ;for(;y&&y.z>=f&&x&&x.z<=S;){if(y.x>=p&&y.x<=M&&y.y>=g&&y.y<=m&&y!==o&&y!==a&&Eo(r,h,c,d,l,u,y.x,y.y)&&we(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=p&&x.x<=M&&x.y>=g&&x.y<=m&&x!==o&&x!==a&&Eo(r,h,c,d,l,u,x.x,x.y)&&we(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=f;){if(y.x>=p&&y.x<=M&&y.y>=g&&y.y<=m&&y!==o&&y!==a&&Eo(r,h,c,d,l,u,y.x,y.y)&&we(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=S;){if(x.x>=p&&x.x<=M&&x.y>=g&&x.y<=m&&x!==o&&x!==a&&Eo(r,h,c,d,l,u,x.x,x.y)&&we(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Af(n,t){let e=n;do{const i=e.prev,o=e.next.next;!ao(i,o)&&jh(i,e,e.next,o)&&ko(i,o)&&ko(o,i)&&(t.push(i.i,e.i,o.i),Vo(e),Vo(e.next),e=n=o),e=e.next}while(e!==n);return Pi(e)}function Cf(n,t,e,i,o,s){let a=n;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&Ff(a,r)){let c=Yh(a,r);a=Pi(a,a.next),c=Pi(c,c.next),Bo(a,t,e,i,o,s,0),Bo(c,t,e,i,o,s,0);return}r=r.next}a=a.next}while(a!==n)}function Pf(n,t,e,i){const o=[];for(let s=0,a=t.length;s<a;s++){const r=t[s]*i,c=s<a-1?t[s+1]*i:n.length,l=Wh(n,r,c,i,!1);l===l.next&&(l.steiner=!0),o.push(zf(l))}o.sort(Rf);for(let s=0;s<o.length;s++)e=If(o[s],e);return e}function Rf(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),o=(t.next.y-t.y)/(t.next.x-t.x);e=i-o}return e}function If(n,t){const e=Lf(n,t);if(!e)return t;const i=Yh(e,n);return Pi(i,i.next),Pi(e,e.next)}function Lf(n,t){let e=t;const i=n.x,o=n.y;let s=-1/0,a;if(ao(n,e))return e;do{if(ao(n,e.next))return e.next;if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=i&&d>s&&(s=d,a=e.x<e.next.x?e:e.next,d===i))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&Xh(o<l?i:s,o,c,l,o<l?s:i,o,e.x,e.y)){const d=Math.abs(o-e.y)/(i-e.x);ko(e,n)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&Df(a,e)))&&(a=e,h=d)}e=e.next}while(e!==r);return a}function Df(n,t){return we(n.prev,n,t.prev)<0&&we(t.next,n,n.next)<0}function Uf(n,t,e,i){let o=n;do o.z===0&&(o.z=Gr(o.x,o.y,t,e,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==n);o.prevZ.nextZ=null,o.prevZ=null,Nf(o)}function Nf(n){let t,e=1;do{let i=n,o;n=null;let s=null;for(t=0;i;){t++;let a=i,r=0;for(let l=0;l<e&&(r++,a=a.nextZ,!!a);l++);let c=e;for(;r>0||c>0&&a;)r!==0&&(c===0||!a||i.z<=a.z)?(o=i,i=i.nextZ,r--):(o=a,a=a.nextZ,c--),s?s.nextZ=o:n=o,o.prevZ=s,s=o;i=a}s.nextZ=null,e*=2}while(t>1);return n}function Gr(n,t,e,i,o){return n=(n-e)*o|0,t=(t-i)*o|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function zf(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function Xh(n,t,e,i,o,s,a,r){return(o-a)*(t-r)>=(n-a)*(s-r)&&(n-a)*(i-r)>=(e-a)*(t-r)&&(e-a)*(s-r)>=(o-a)*(i-r)}function Eo(n,t,e,i,o,s,a,r){return!(n===a&&t===r)&&Xh(n,t,e,i,o,s,a,r)}function Ff(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!Of(n,t)&&(ko(n,t)&&ko(t,n)&&Bf(n,t)&&(we(n.prev,n,t.prev)||we(n,t.prev,t))||ao(n,t)&&we(n.prev,n,n.next)>0&&we(t.prev,t,t.next)>0)}function we(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function ao(n,t){return n.x===t.x&&n.y===t.y}function jh(n,t,e,i){const o=Es(we(n,t,e)),s=Es(we(n,t,i)),a=Es(we(e,i,n)),r=Es(we(e,i,t));return!!(o!==s&&a!==r||o===0&&ws(n,e,t)||s===0&&ws(n,i,t)||a===0&&ws(e,n,i)||r===0&&ws(e,t,i))}function ws(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Es(n){return n>0?1:n<0?-1:0}function Of(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&jh(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function ko(n,t){return we(n.prev,n,n.next)<0?we(n,t,n.next)>=0&&we(n,n.prev,t)>=0:we(n,t,n.prev)<0||we(n,n.next,t)<0}function Bf(n,t){let e=n,i=!1;const o=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&o<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Yh(n,t){const e=qr(n.i,n.x,n.y),i=qr(t.i,t.x,t.y),o=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=o,o.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function rl(n,t,e,i){const o=qr(n,t,e);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function Vo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function qr(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function kf(n,t,e,i){let o=0;for(let s=t,a=e-i;s<e;s+=i)o+=(n[a]-n[s])*(n[s+1]+n[a+1]),a=s;return o}class Vf{static triangulate(t,e,i=2){return wf(t,e,i)}}class qn{static area(t){const e=t.length;let i=0;for(let o=e-1,s=0;s<e;o=s++)i+=t[o].x*t[s].y-t[s].x*t[o].y;return i*.5}static isClockWise(t){return qn.area(t)<0}static triangulateShape(t,e){const i=[],o=[],s=[];cl(t),ll(i,t);let a=t.length;e.forEach(cl);for(let c=0;c<e.length;c++)o.push(a),a+=e[c].length,ll(i,e[c]);const r=Vf.triangulate(i,o);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function cl(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function ll(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class oa extends De{constructor(t=new Wo([new Ct(.5,.5),new Ct(-.5,.5),new Ct(-.5,-.5),new Ct(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,o=[],s=[];for(let r=0,c=t.length;r<c;r++){const l=t[r];a(l)}this.setAttribute("position",new le(o,3)),this.setAttribute("uv",new le(s,2)),this.computeVertexNormals();function a(r){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,M=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,S=e.UVGenerator!==void 0?e.UVGenerator:Hf;let y,x=!1,A,C,P,L;f&&(y=f.getSpacedPoints(h),x=!0,u=!1,A=f.computeFrenetFrames(h,!1),C=new z,P=new z,L=new z),u||(m=0,p=0,g=0,M=0);const E=r.extractPoints(l);let b=E.shape;const D=E.holes;if(!qn.isClockWise(b)){b=b.reverse();for(let mt=0,dt=D.length;mt<dt;mt++){const ct=D[mt];qn.isClockWise(ct)&&(D[mt]=ct.reverse())}}function V(mt){const ct=10000000000000001e-36;let Q=mt[0];for(let wt=1;wt<=mt.length;wt++){const Mt=wt%mt.length,Tt=mt[Mt],Yt=Tt.x-Q.x,Jt=Tt.y-Q.y,U=Yt*Yt+Jt*Jt,T=Math.max(Math.abs(Tt.x),Math.abs(Tt.y),Math.abs(Q.x),Math.abs(Q.y)),$=ct*T*T;if(U<=$){mt.splice(Mt,1),wt--;continue}Q=Tt}}V(b),D.forEach(V);const q=D.length,W=b;for(let mt=0;mt<q;mt++){const dt=D[mt];b=b.concat(dt)}function j(mt,dt,ct){return dt||console.error("THREE.ExtrudeGeometry: vec does not exist"),mt.clone().addScaledVector(dt,ct)}const N=b.length;function B(mt,dt,ct){let Q,wt,Mt;const Tt=mt.x-dt.x,Yt=mt.y-dt.y,Jt=ct.x-mt.x,U=ct.y-mt.y,T=Tt*Tt+Yt*Yt,$=Tt*U-Yt*Jt;if(Math.abs($)>Number.EPSILON){const nt=Math.sqrt(T),pt=Math.sqrt(Jt*Jt+U*U),st=dt.x-Yt/nt,kt=dt.y+Tt/nt,Et=ct.x-U/pt,Vt=ct.y+Jt/pt,Ht=((Et-st)*U-(Vt-kt)*Jt)/(Tt*U-Yt*Jt);Q=st+Tt*Ht-mt.x,wt=kt+Yt*Ht-mt.y;const yt=Q*Q+wt*wt;if(yt<=2)return new Ct(Q,wt);Mt=Math.sqrt(yt/2)}else{let nt=!1;Tt>Number.EPSILON?Jt>Number.EPSILON&&(nt=!0):Tt<-Number.EPSILON?Jt<-Number.EPSILON&&(nt=!0):Math.sign(Yt)===Math.sign(U)&&(nt=!0),nt?(Q=-Yt,wt=Tt,Mt=Math.sqrt(T)):(Q=Tt,wt=Yt,Mt=Math.sqrt(T/2))}return new Ct(Q/Mt,wt/Mt)}const K=[];for(let mt=0,dt=W.length,ct=dt-1,Q=mt+1;mt<dt;mt++,ct++,Q++)ct===dt&&(ct=0),Q===dt&&(Q=0),K[mt]=B(W[mt],W[ct],W[Q]);const X=[];let ht,ft=K.concat();for(let mt=0,dt=q;mt<dt;mt++){const ct=D[mt];ht=[];for(let Q=0,wt=ct.length,Mt=wt-1,Tt=Q+1;Q<wt;Q++,Mt++,Tt++)Mt===wt&&(Mt=0),Tt===wt&&(Tt=0),ht[Q]=B(ct[Q],ct[Mt],ct[Tt]);X.push(ht),ft=ft.concat(ht)}let St;if(m===0)St=qn.triangulateShape(W,D);else{const mt=[],dt=[];for(let ct=0;ct<m;ct++){const Q=ct/m,wt=p*Math.cos(Q*Math.PI/2),Mt=g*Math.sin(Q*Math.PI/2)+M;for(let Tt=0,Yt=W.length;Tt<Yt;Tt++){const Jt=j(W[Tt],K[Tt],Mt);Gt(Jt.x,Jt.y,-wt),Q===0&&mt.push(Jt)}for(let Tt=0,Yt=q;Tt<Yt;Tt++){const Jt=D[Tt];ht=X[Tt];const U=[];for(let T=0,$=Jt.length;T<$;T++){const nt=j(Jt[T],ht[T],Mt);Gt(nt.x,nt.y,-wt),Q===0&&U.push(nt)}Q===0&&dt.push(U)}}St=qn.triangulateShape(mt,dt)}const Dt=St.length,Kt=g+M;for(let mt=0;mt<N;mt++){const dt=u?j(b[mt],ft[mt],Kt):b[mt];x?(P.copy(A.normals[0]).multiplyScalar(dt.x),C.copy(A.binormals[0]).multiplyScalar(dt.y),L.copy(y[0]).add(P).add(C),Gt(L.x,L.y,L.z)):Gt(dt.x,dt.y,0)}for(let mt=1;mt<=h;mt++)for(let dt=0;dt<N;dt++){const ct=u?j(b[dt],ft[dt],Kt):b[dt];x?(P.copy(A.normals[mt]).multiplyScalar(ct.x),C.copy(A.binormals[mt]).multiplyScalar(ct.y),L.copy(y[mt]).add(P).add(C),Gt(L.x,L.y,L.z)):Gt(ct.x,ct.y,d/h*mt)}for(let mt=m-1;mt>=0;mt--){const dt=mt/m,ct=p*Math.cos(dt*Math.PI/2),Q=g*Math.sin(dt*Math.PI/2)+M;for(let wt=0,Mt=W.length;wt<Mt;wt++){const Tt=j(W[wt],K[wt],Q);Gt(Tt.x,Tt.y,d+ct)}for(let wt=0,Mt=D.length;wt<Mt;wt++){const Tt=D[wt];ht=X[wt];for(let Yt=0,Jt=Tt.length;Yt<Jt;Yt++){const U=j(Tt[Yt],ht[Yt],Q);x?Gt(U.x,U.y+y[h-1].y,y[h-1].x+ct):Gt(U.x,U.y,d+ct)}}}rt(),ut();function rt(){const mt=o.length/3;if(u){let dt=0,ct=N*dt;for(let Q=0;Q<Dt;Q++){const wt=St[Q];Bt(wt[2]+ct,wt[1]+ct,wt[0]+ct)}dt=h+m*2,ct=N*dt;for(let Q=0;Q<Dt;Q++){const wt=St[Q];Bt(wt[0]+ct,wt[1]+ct,wt[2]+ct)}}else{for(let dt=0;dt<Dt;dt++){const ct=St[dt];Bt(ct[2],ct[1],ct[0])}for(let dt=0;dt<Dt;dt++){const ct=St[dt];Bt(ct[0]+N*h,ct[1]+N*h,ct[2]+N*h)}}i.addGroup(mt,o.length/3-mt,0)}function ut(){const mt=o.length/3;let dt=0;Ut(W,dt),dt+=W.length;for(let ct=0,Q=D.length;ct<Q;ct++){const wt=D[ct];Ut(wt,dt),dt+=wt.length}i.addGroup(mt,o.length/3-mt,1)}function Ut(mt,dt){let ct=mt.length;for(;--ct>=0;){const Q=ct;let wt=ct-1;wt<0&&(wt=mt.length-1);for(let Mt=0,Tt=h+m*2;Mt<Tt;Mt++){const Yt=N*Mt,Jt=N*(Mt+1),U=dt+Q+Yt,T=dt+wt+Yt,$=dt+wt+Jt,nt=dt+Q+Jt;oe(U,T,$,nt)}}}function Gt(mt,dt,ct){c.push(mt),c.push(dt),c.push(ct)}function Bt(mt,dt,ct){ve(mt),ve(dt),ve(ct);const Q=o.length/3,wt=S.generateTopUV(i,o,Q-3,Q-2,Q-1);O(wt[0]),O(wt[1]),O(wt[2])}function oe(mt,dt,ct,Q){ve(mt),ve(dt),ve(Q),ve(dt),ve(ct),ve(Q);const wt=o.length/3,Mt=S.generateSideWallUV(i,o,wt-6,wt-3,wt-2,wt-1);O(Mt[0]),O(Mt[1]),O(Mt[3]),O(Mt[1]),O(Mt[2]),O(Mt[3])}function ve(mt){o.push(c[mt*3+0]),o.push(c[mt*3+1]),o.push(c[mt*3+2])}function O(mt){s.push(mt.x),s.push(mt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Gf(e,i,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const r=e[t.shapes[s]];i.push(r)}const o=t.options.extrudePath;return o!==void 0&&(t.options.extrudePath=new Vr[o.type]().fromJSON(o)),new oa(i,t.options)}}const Hf={generateTopUV:function(n,t,e,i,o){const s=t[e*3],a=t[e*3+1],r=t[i*3],c=t[i*3+1],l=t[o*3],h=t[o*3+1];return[new Ct(s,a),new Ct(r,c),new Ct(l,h)]},generateSideWallUV:function(n,t,e,i,o,s){const a=t[e*3],r=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],d=t[i*3+2],u=t[o*3],p=t[o*3+1],g=t[o*3+2],M=t[s*3],m=t[s*3+1],f=t[s*3+2];return Math.abs(r-h)<Math.abs(a-l)?[new Ct(a,1-c),new Ct(l,1-d),new Ct(u,1-g),new Ct(M,1-f)]:[new Ct(r,1-c),new Ct(h,1-d),new Ct(p,1-g),new Ct(m,1-f)]}};function Gf(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,o=n.length;i<o;i++){const s=n[i];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Xo extends ia{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,o=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(o,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Xo(t.radius,t.detail)}}class ze extends De{constructor(t=1,e=1,i=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:o};const s=t/2,a=e/2,r=Math.floor(i),c=Math.floor(o),l=r+1,h=c+1,d=t/r,u=e/c,p=[],g=[],M=[],m=[];for(let f=0;f<h;f++){const S=f*u-a;for(let y=0;y<l;y++){const x=y*d-s;g.push(x,-S,0),M.push(0,0,1),m.push(y/r),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<r;S++){const y=S+l*f,x=S+l*(f+1),A=S+1+l*(f+1),C=S+1+l*f;p.push(y,x,C),p.push(x,A,C)}this.setIndex(p),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(M,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ze(t.width,t.height,t.widthSegments,t.heightSegments)}}class wc extends De{constructor(t=.5,e=1,i=32,o=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:o,thetaStart:s,thetaLength:a},i=Math.max(3,i),o=Math.max(1,o);const r=[],c=[],l=[],h=[];let d=t;const u=(e-t)/o,p=new z,g=new Ct;for(let M=0;M<=o;M++){for(let m=0;m<=i;m++){const f=s+m/i*a;p.x=d*Math.cos(f),p.y=d*Math.sin(f),c.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}d+=u}for(let M=0;M<o;M++){const m=M*(i+1);for(let f=0;f<i;f++){const S=f+m,y=S,x=S+i+1,A=S+i+2,C=S+1;r.push(y,x,C),r.push(x,A,C)}}this.setIndex(r),this.setAttribute("position",new le(c,3)),this.setAttribute("normal",new le(l,3)),this.setAttribute("uv",new le(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wc(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Ec extends De{constructor(t=new Wo([new Ct(0,.5),new Ct(-.5,-.5),new Ct(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],o=[],s=[],a=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new le(o,3)),this.setAttribute("normal",new le(s,3)),this.setAttribute("uv",new le(a,2));function l(h){const d=o.length/3,u=h.extractPoints(e);let p=u.shape;const g=u.holes;qn.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,f=g.length;m<f;m++){const S=g[m];qn.isClockWise(S)===!0&&(g[m]=S.reverse())}const M=qn.triangulateShape(p,g);for(let m=0,f=g.length;m<f;m++){const S=g[m];p=p.concat(S)}for(let m=0,f=p.length;m<f;m++){const S=p[m];o.push(S.x,S.y,0),s.push(0,0,1),a.push(S.x,S.y)}for(let m=0,f=M.length;m<f;m++){const S=M[m],y=S[0]+d,x=S[1]+d,A=S[2]+d;i.push(y,x,A),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return qf(e,t)}static fromJSON(t,e){const i=[];for(let o=0,s=t.shapes.length;o<s;o++){const a=e[t.shapes[o]];i.push(a)}return new Ec(i,t.curveSegments)}}function qf(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const o=n[e];t.shapes.push(o.uuid)}else t.shapes.push(n.uuid);return t}class Rt extends De{constructor(t=1,e=32,i=16,o=0,s=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:o,phiLength:s,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+r,Math.PI);let l=0;const h=[],d=new z,u=new z,p=[],g=[],M=[],m=[];for(let f=0;f<=i;f++){const S=[],y=f/i;let x=0;f===0&&a===0?x=.5/e:f===i&&c===Math.PI&&(x=-.5/e);for(let A=0;A<=e;A++){const C=A/e;d.x=-t*Math.cos(o+C*s)*Math.sin(a+y*r),d.y=t*Math.cos(a+y*r),d.z=t*Math.sin(o+C*s)*Math.sin(a+y*r),g.push(d.x,d.y,d.z),u.copy(d).normalize(),M.push(u.x,u.y,u.z),m.push(C+x,1-y),S.push(l++)}h.push(S)}for(let f=0;f<i;f++)for(let S=0;S<e;S++){const y=h[f][S+1],x=h[f][S],A=h[f+1][S],C=h[f+1][S+1];(f!==0||a>0)&&p.push(y,x,C),(f!==i-1||c<Math.PI)&&p.push(x,A,C)}this.setIndex(p),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(M,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ge extends De{constructor(t=1,e=.4,i=12,o=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:o,arc:s},i=Math.floor(i),o=Math.floor(o);const a=[],r=[],c=[],l=[],h=new z,d=new z,u=new z;for(let p=0;p<=i;p++)for(let g=0;g<=o;g++){const M=g/o*s,m=p/i*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(M),d.y=(t+e*Math.cos(m))*Math.sin(M),d.z=e*Math.sin(m),r.push(d.x,d.y,d.z),h.x=t*Math.cos(M),h.y=t*Math.sin(M),u.subVectors(d,h).normalize(),c.push(u.x,u.y,u.z),l.push(g/o),l.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=o;g++){const M=(o+1)*p+g-1,m=(o+1)*(p-1)+g-1,f=(o+1)*(p-1)+g,S=(o+1)*p+g;a.push(M,m,S),a.push(m,f,S)}this.setIndex(a),this.setAttribute("position",new le(r,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ge(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Zh extends ho{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ce(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ce(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Eh,this.normalScale=new Ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class Wf extends ho{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=au,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Xf extends ho{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class $h extends xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ce(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Jh extends $h{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ce(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Na=new Ee,hl=new z,dl=new z;class jf{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ct(512,512),this.mapType=Un,this.map=null,this.mapPass=null,this.matrix=new Ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xc,this._frameExtents=new Ct(1,1),this._viewportCount=1,this._viewports=[new Te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;hl.setFromMatrixPosition(t.matrixWorld),e.position.copy(hl),dl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(dl),e.updateMatrixWorld(),Na.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Na,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Na)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Tc extends Nh{constructor(t=-1,e=1,i=1,o=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=o,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,o,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=o,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let s=i-t,a=i+t,r=o+e,c=o-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,r,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Yf extends jf{constructor(){super(new Tc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Wr extends $h{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.shadow=new Yf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Zf extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class $f{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function ul(n,t,e,i){const o=Jf(i);switch(e){case bh:return n*t;case fc:return n*t/o.components*o.byteLength;case pc:return n*t/o.components*o.byteLength;case wh:return n*t*2/o.components*o.byteLength;case mc:return n*t*2/o.components*o.byteLength;case Sh:return n*t*3/o.components*o.byteLength;case Tn:return n*t*4/o.components*o.byteLength;case gc:return n*t*4/o.components*o.byteLength;case Us:case Ns:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case zs:case Fs:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case pr:case gr:return Math.max(n,16)*Math.max(t,8)/4;case fr:case mr:return Math.max(n,8)*Math.max(t,8)/2;case vr:case _r:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Mr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case xr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case yr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case br:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Sr:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case wr:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Er:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Tr:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Ar:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case Cr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Pr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Rr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Ir:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Lr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Dr:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Ur:case Nr:case zr:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Fr:case Or:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Br:case kr:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Jf(n){switch(n){case Un:case _h:return{byteLength:1,components:1};case Lo:case Mh:case qo:return{byteLength:2,components:1};case dc:case uc:return{byteLength:2,components:4};case Ai:case hc:case Gn:return{byteLength:4,components:1};case xh:case yh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:lc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=lc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Kh(){let n=null,t=!1,e=null,i=null;function o(s,a){e(s,a),i=n.requestAnimationFrame(o)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(o),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Kf(n){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,d=l.byteLength,u=n.createBuffer();n.bindBuffer(c,u),n.bufferData(c,l,h),r.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=n.HALF_FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:d}}function i(r,c,l){const h=c.array,d=c.updateRanges;if(n.bindBuffer(l,r),d.length===0)n.bufferSubData(l,0,h);else{d.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<d.length;p++){const g=d[u],M=d[p];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++u,d[u]=M)}d.length=u+1;for(let p=0,g=d.length;p<g;p++){const M=d[p];n.bufferSubData(l,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function o(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function a(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:o,remove:s,update:a}}var Qf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,tp=`#ifdef USE_ALPHAHASH
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
#endif`,ep=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,np=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ip=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,op=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,sp=`#ifdef USE_AOMAP
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
#endif`,ap=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rp=`#ifdef USE_BATCHING
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
#endif`,cp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,lp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,dp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,up=`#ifdef USE_IRIDESCENCE
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
#endif`,fp=`#ifdef USE_BUMPMAP
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
#endif`,pp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,mp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,gp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,vp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_p=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Mp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,xp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,yp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,bp=`#define PI 3.141592653589793
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
} // validated`,Sp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,wp=`vec3 transformedNormal = objectNormal;
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
#endif`,Ep=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ap=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Pp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Rp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ip=`#ifdef USE_ENVMAP
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
#endif`,Lp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Dp=`#ifdef USE_ENVMAP
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
#endif`,Up=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Np=`#ifdef USE_ENVMAP
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
#endif`,zp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Fp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Op=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Bp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,kp=`#ifdef USE_GRADIENTMAP
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
}`,Vp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Hp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Gp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,qp=`uniform bool receiveShadow;
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
#endif`,Wp=`#ifdef USE_ENVMAP
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
#endif`,Xp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,jp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Yp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Zp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$p=`PhysicalMaterial material;
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
#endif`,Jp=`struct PhysicalMaterial {
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
}`,Kp=`
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
#endif`,Qp=`#if defined( RE_IndirectDiffuse )
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
#endif`,t0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,e0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,n0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,i0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,o0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,s0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,a0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,c0=`#if defined( USE_POINTS_UV )
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
#endif`,l0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,h0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,d0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,u0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,f0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,p0=`#ifdef USE_MORPHTARGETS
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
#endif`,m0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,g0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,v0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,M0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,x0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,y0=`#ifdef USE_NORMALMAP
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
#endif`,b0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,S0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,w0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,E0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,T0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,A0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,C0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,P0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,R0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,I0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,L0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,D0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,U0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,N0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,z0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,F0=`float getShadowMask() {
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
}`,O0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,B0=`#ifdef USE_SKINNING
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
#endif`,k0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,V0=`#ifdef USE_SKINNING
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
#endif`,H0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,G0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,q0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,W0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,X0=`#ifdef USE_TRANSMISSION
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
#endif`,j0=`#ifdef USE_TRANSMISSION
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
#endif`,Y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Z0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const K0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Q0=`uniform sampler2D t2D;
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
}`,tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,em=`#ifdef ENVMAP_TYPE_CUBE
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
}`,nm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,im=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,om=`#include <common>
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
}`,sm=`#if DEPTH_PACKING == 3200
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
}`,am=`#define DISTANCE
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
}`,rm=`#define DISTANCE
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
}`,cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,lm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hm=`uniform float scale;
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
}`,dm=`uniform vec3 diffuse;
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
}`,um=`#include <common>
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
}`,fm=`uniform vec3 diffuse;
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
}`,pm=`#define LAMBERT
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
}`,mm=`#define LAMBERT
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
}`,gm=`#define MATCAP
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
}`,vm=`#define MATCAP
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
}`,_m=`#define NORMAL
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
}`,Mm=`#define NORMAL
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
}`,xm=`#define PHONG
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
}`,ym=`#define PHONG
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
}`,bm=`#define STANDARD
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
}`,Sm=`#define STANDARD
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
}`,wm=`#define TOON
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
}`,Em=`#define TOON
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
}`,Tm=`uniform float size;
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
}`,Am=`uniform vec3 diffuse;
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
}`,Cm=`#include <common>
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
}`,Pm=`uniform vec3 color;
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
}`,Rm=`uniform float rotation;
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
}`,Im=`uniform vec3 diffuse;
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
}`,ne={alphahash_fragment:Qf,alphahash_pars_fragment:tp,alphamap_fragment:ep,alphamap_pars_fragment:np,alphatest_fragment:ip,alphatest_pars_fragment:op,aomap_fragment:sp,aomap_pars_fragment:ap,batching_pars_vertex:rp,batching_vertex:cp,begin_vertex:lp,beginnormal_vertex:hp,bsdfs:dp,iridescence_fragment:up,bumpmap_pars_fragment:fp,clipping_planes_fragment:pp,clipping_planes_pars_fragment:mp,clipping_planes_pars_vertex:gp,clipping_planes_vertex:vp,color_fragment:_p,color_pars_fragment:Mp,color_pars_vertex:xp,color_vertex:yp,common:bp,cube_uv_reflection_fragment:Sp,defaultnormal_vertex:wp,displacementmap_pars_vertex:Ep,displacementmap_vertex:Tp,emissivemap_fragment:Ap,emissivemap_pars_fragment:Cp,colorspace_fragment:Pp,colorspace_pars_fragment:Rp,envmap_fragment:Ip,envmap_common_pars_fragment:Lp,envmap_pars_fragment:Dp,envmap_pars_vertex:Up,envmap_physical_pars_fragment:Wp,envmap_vertex:Np,fog_vertex:zp,fog_pars_vertex:Fp,fog_fragment:Op,fog_pars_fragment:Bp,gradientmap_pars_fragment:kp,lightmap_pars_fragment:Vp,lights_lambert_fragment:Hp,lights_lambert_pars_fragment:Gp,lights_pars_begin:qp,lights_toon_fragment:Xp,lights_toon_pars_fragment:jp,lights_phong_fragment:Yp,lights_phong_pars_fragment:Zp,lights_physical_fragment:$p,lights_physical_pars_fragment:Jp,lights_fragment_begin:Kp,lights_fragment_maps:Qp,lights_fragment_end:t0,logdepthbuf_fragment:e0,logdepthbuf_pars_fragment:n0,logdepthbuf_pars_vertex:i0,logdepthbuf_vertex:o0,map_fragment:s0,map_pars_fragment:a0,map_particle_fragment:r0,map_particle_pars_fragment:c0,metalnessmap_fragment:l0,metalnessmap_pars_fragment:h0,morphinstance_vertex:d0,morphcolor_vertex:u0,morphnormal_vertex:f0,morphtarget_pars_vertex:p0,morphtarget_vertex:m0,normal_fragment_begin:g0,normal_fragment_maps:v0,normal_pars_fragment:_0,normal_pars_vertex:M0,normal_vertex:x0,normalmap_pars_fragment:y0,clearcoat_normal_fragment_begin:b0,clearcoat_normal_fragment_maps:S0,clearcoat_pars_fragment:w0,iridescence_pars_fragment:E0,opaque_fragment:T0,packing:A0,premultiplied_alpha_fragment:C0,project_vertex:P0,dithering_fragment:R0,dithering_pars_fragment:I0,roughnessmap_fragment:L0,roughnessmap_pars_fragment:D0,shadowmap_pars_fragment:U0,shadowmap_pars_vertex:N0,shadowmap_vertex:z0,shadowmask_pars_fragment:F0,skinbase_vertex:O0,skinning_pars_vertex:B0,skinning_vertex:k0,skinnormal_vertex:V0,specularmap_fragment:H0,specularmap_pars_fragment:G0,tonemapping_fragment:q0,tonemapping_pars_fragment:W0,transmission_fragment:X0,transmission_pars_fragment:j0,uv_pars_fragment:Y0,uv_pars_vertex:Z0,uv_vertex:$0,worldpos_vertex:J0,background_vert:K0,background_frag:Q0,backgroundCube_vert:tm,backgroundCube_frag:em,cube_vert:nm,cube_frag:im,depth_vert:om,depth_frag:sm,distanceRGBA_vert:am,distanceRGBA_frag:rm,equirect_vert:cm,equirect_frag:lm,linedashed_vert:hm,linedashed_frag:dm,meshbasic_vert:um,meshbasic_frag:fm,meshlambert_vert:pm,meshlambert_frag:mm,meshmatcap_vert:gm,meshmatcap_frag:vm,meshnormal_vert:_m,meshnormal_frag:Mm,meshphong_vert:xm,meshphong_frag:ym,meshphysical_vert:bm,meshphysical_frag:Sm,meshtoon_vert:wm,meshtoon_frag:Em,points_vert:Tm,points_frag:Am,shadow_vert:Cm,shadow_frag:Pm,sprite_vert:Rm,sprite_frag:Im},Lt={common:{diffuse:{value:new ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ee}},envmap:{envMap:{value:null},envMapRotation:{value:new ee},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ee}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ee}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ee},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ee},normalScale:{value:new Ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ee},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ee}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ee}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ee}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0},uvTransform:{value:new ee}},sprite:{diffuse:{value:new ce(16777215)},opacity:{value:1},center:{value:new Ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ee},alphaMap:{value:null},alphaMapTransform:{value:new ee},alphaTest:{value:0}}},Cn={basic:{uniforms:Xe([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.fog]),vertexShader:ne.meshbasic_vert,fragmentShader:ne.meshbasic_frag},lambert:{uniforms:Xe([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new ce(0)}}]),vertexShader:ne.meshlambert_vert,fragmentShader:ne.meshlambert_frag},phong:{uniforms:Xe([Lt.common,Lt.specularmap,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,Lt.lights,{emissive:{value:new ce(0)},specular:{value:new ce(1118481)},shininess:{value:30}}]),vertexShader:ne.meshphong_vert,fragmentShader:ne.meshphong_frag},standard:{uniforms:Xe([Lt.common,Lt.envmap,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.roughnessmap,Lt.metalnessmap,Lt.fog,Lt.lights,{emissive:{value:new ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag},toon:{uniforms:Xe([Lt.common,Lt.aomap,Lt.lightmap,Lt.emissivemap,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.gradientmap,Lt.fog,Lt.lights,{emissive:{value:new ce(0)}}]),vertexShader:ne.meshtoon_vert,fragmentShader:ne.meshtoon_frag},matcap:{uniforms:Xe([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,Lt.fog,{matcap:{value:null}}]),vertexShader:ne.meshmatcap_vert,fragmentShader:ne.meshmatcap_frag},points:{uniforms:Xe([Lt.points,Lt.fog]),vertexShader:ne.points_vert,fragmentShader:ne.points_frag},dashed:{uniforms:Xe([Lt.common,Lt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ne.linedashed_vert,fragmentShader:ne.linedashed_frag},depth:{uniforms:Xe([Lt.common,Lt.displacementmap]),vertexShader:ne.depth_vert,fragmentShader:ne.depth_frag},normal:{uniforms:Xe([Lt.common,Lt.bumpmap,Lt.normalmap,Lt.displacementmap,{opacity:{value:1}}]),vertexShader:ne.meshnormal_vert,fragmentShader:ne.meshnormal_frag},sprite:{uniforms:Xe([Lt.sprite,Lt.fog]),vertexShader:ne.sprite_vert,fragmentShader:ne.sprite_frag},background:{uniforms:{uvTransform:{value:new ee},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ne.background_vert,fragmentShader:ne.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ee}},vertexShader:ne.backgroundCube_vert,fragmentShader:ne.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ne.cube_vert,fragmentShader:ne.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ne.equirect_vert,fragmentShader:ne.equirect_frag},distanceRGBA:{uniforms:Xe([Lt.common,Lt.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ne.distanceRGBA_vert,fragmentShader:ne.distanceRGBA_frag},shadow:{uniforms:Xe([Lt.lights,Lt.fog,{color:{value:new ce(0)},opacity:{value:1}}]),vertexShader:ne.shadow_vert,fragmentShader:ne.shadow_frag}};Cn.physical={uniforms:Xe([Cn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ee},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ee},clearcoatNormalScale:{value:new Ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ee},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ee},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ee},sheen:{value:0},sheenColor:{value:new ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ee},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ee},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ee},transmissionSamplerSize:{value:new Ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ee},attenuationDistance:{value:0},attenuationColor:{value:new ce(0)},specularColor:{value:new ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ee},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ee},anisotropyVector:{value:new Ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ee}}]),vertexShader:ne.meshphysical_vert,fragmentShader:ne.meshphysical_frag};const Ts={r:0,b:0,g:0},vi=new Yn,Lm=new Ee;function Dm(n,t,e,i,o,s,a){const r=new ce(0);let c=s===!0?0:1,l,h,d=null,u=0,p=null;function g(y){let x=y.isScene===!0?y.background:null;return x&&x.isTexture&&(x=(y.backgroundBlurriness>0?e:t).get(x)),x}function M(y){let x=!1;const A=g(y);A===null?f(r,c):A&&A.isColor&&(f(A,1),x=!0);const C=n.xr.getEnvironmentBlendMode();C==="additive"?i.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(y,x){const A=g(x);A&&(A.isCubeTexture||A.mapping===ta)?(h===void 0&&(h=new v(new k(1,1,1),new li({name:"BackgroundCubeMaterial",uniforms:so(Cn.backgroundCube.uniforms),vertexShader:Cn.backgroundCube.vertexShader,fragmentShader:Cn.backgroundCube.fragmentShader,side:Ke,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,P,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(h)),vi.copy(x.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Lm.makeRotationFromEuler(vi)),h.material.toneMapped=fe.getTransfer(A.colorSpace)!==Me,(d!==A||u!==A.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,d=A,u=A.version,p=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new v(new ze(2,2),new li({name:"BackgroundMaterial",uniforms:so(Cn.background.uniforms),vertexShader:Cn.background.vertexShader,fragmentShader:Cn.background.fragmentShader,side:jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=fe.getTransfer(A.colorSpace)!==Me,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(d!==A||u!==A.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,d=A,u=A.version,p=n.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function f(y,x){y.getRGB(Ts,Uh(n)),i.buffers.color.setClear(Ts.r,Ts.g,Ts.b,x,a)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(y,x=1){r.set(y),c=x,f(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,f(r,c)},render:M,addToRenderList:m,dispose:S}}function Um(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},o=u(null);let s=o,a=!1;function r(b,D,F,V,q){let W=!1;const j=d(V,F,D);s!==j&&(s=j,l(s.object)),W=p(b,V,F,q),W&&g(b,V,F,q),q!==null&&t.update(q,n.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,x(b,D,F,V),q!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function c(){return n.createVertexArray()}function l(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function d(b,D,F){const V=F.wireframe===!0;let q=i[b.id];q===void 0&&(q={},i[b.id]=q);let W=q[D.id];W===void 0&&(W={},q[D.id]=W);let j=W[V];return j===void 0&&(j=u(c()),W[V]=j),j}function u(b){const D=[],F=[],V=[];for(let q=0;q<e;q++)D[q]=0,F[q]=0,V[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:V,object:b,attributes:{},index:null}}function p(b,D,F,V){const q=s.attributes,W=D.attributes;let j=0;const N=F.getAttributes();for(const B in N)if(N[B].location>=0){const X=q[B];let ht=W[B];if(ht===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(ht=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(ht=b.instanceColor)),X===void 0||X.attribute!==ht||ht&&X.data!==ht.data)return!0;j++}return s.attributesNum!==j||s.index!==V}function g(b,D,F,V){const q={},W=D.attributes;let j=0;const N=F.getAttributes();for(const B in N)if(N[B].location>=0){let X=W[B];X===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(X=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(X=b.instanceColor));const ht={};ht.attribute=X,X&&X.data&&(ht.data=X.data),q[B]=ht,j++}s.attributes=q,s.attributesNum=j,s.index=V}function M(){const b=s.newAttributes;for(let D=0,F=b.length;D<F;D++)b[D]=0}function m(b){f(b,0)}function f(b,D){const F=s.newAttributes,V=s.enabledAttributes,q=s.attributeDivisors;F[b]=1,V[b]===0&&(n.enableVertexAttribArray(b),V[b]=1),q[b]!==D&&(n.vertexAttribDivisor(b,D),q[b]=D)}function S(){const b=s.newAttributes,D=s.enabledAttributes;for(let F=0,V=D.length;F<V;F++)D[F]!==b[F]&&(n.disableVertexAttribArray(F),D[F]=0)}function y(b,D,F,V,q,W,j){j===!0?n.vertexAttribIPointer(b,D,F,q,W):n.vertexAttribPointer(b,D,F,V,q,W)}function x(b,D,F,V){M();const q=V.attributes,W=F.getAttributes(),j=D.defaultAttributeValues;for(const N in W){const B=W[N];if(B.location>=0){let K=q[N];if(K===void 0&&(N==="instanceMatrix"&&b.instanceMatrix&&(K=b.instanceMatrix),N==="instanceColor"&&b.instanceColor&&(K=b.instanceColor)),K!==void 0){const X=K.normalized,ht=K.itemSize,ft=t.get(K);if(ft===void 0)continue;const St=ft.buffer,Dt=ft.type,Kt=ft.bytesPerElement,rt=Dt===n.INT||Dt===n.UNSIGNED_INT||K.gpuType===hc;if(K.isInterleavedBufferAttribute){const ut=K.data,Ut=ut.stride,Gt=K.offset;if(ut.isInstancedInterleavedBuffer){for(let Bt=0;Bt<B.locationSize;Bt++)f(B.location+Bt,ut.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let Bt=0;Bt<B.locationSize;Bt++)m(B.location+Bt);n.bindBuffer(n.ARRAY_BUFFER,St);for(let Bt=0;Bt<B.locationSize;Bt++)y(B.location+Bt,ht/B.locationSize,Dt,X,Ut*Kt,(Gt+ht/B.locationSize*Bt)*Kt,rt)}else{if(K.isInstancedBufferAttribute){for(let ut=0;ut<B.locationSize;ut++)f(B.location+ut,K.meshPerAttribute);b.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ut=0;ut<B.locationSize;ut++)m(B.location+ut);n.bindBuffer(n.ARRAY_BUFFER,St);for(let ut=0;ut<B.locationSize;ut++)y(B.location+ut,ht/B.locationSize,Dt,X,ht*Kt,ht/B.locationSize*ut*Kt,rt)}}else if(j!==void 0){const X=j[N];if(X!==void 0)switch(X.length){case 2:n.vertexAttrib2fv(B.location,X);break;case 3:n.vertexAttrib3fv(B.location,X);break;case 4:n.vertexAttrib4fv(B.location,X);break;default:n.vertexAttrib1fv(B.location,X)}}}}S()}function A(){L();for(const b in i){const D=i[b];for(const F in D){const V=D[F];for(const q in V)h(V[q].object),delete V[q];delete D[F]}delete i[b]}}function C(b){if(i[b.id]===void 0)return;const D=i[b.id];for(const F in D){const V=D[F];for(const q in V)h(V[q].object),delete V[q];delete D[F]}delete i[b.id]}function P(b){for(const D in i){const F=i[D];if(F[b.id]===void 0)continue;const V=F[b.id];for(const q in V)h(V[q].object),delete V[q];delete F[b.id]}}function L(){E(),a=!0,s!==o&&(s=o,l(s.object))}function E(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:r,reset:L,resetDefaultState:E,dispose:A,releaseStatesOfGeometry:C,releaseStatesOfProgram:P,initAttributes:M,enableAttribute:m,disableUnusedAttributes:S}}function Nm(n,t,e){let i;function o(l){i=l}function s(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,d){d!==0&&(n.drawArraysInstanced(i,l,h,d),e.update(h,i,d))}function r(l,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,d);let p=0;for(let g=0;g<d;g++)p+=h[g];e.update(p,i,1)}function c(l,h,d,u){if(d===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],h[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,h,0,u,0,d);let g=0;for(let M=0;M<d;M++)g+=h[M]*u[M];e.update(g,i,1)}}this.setMode=o,this.render=s,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function zm(n,t,e,i){let o;function s(){if(o!==void 0)return o;if(t.has("EXT_texture_filter_anisotropic")===!0){const P=t.get("EXT_texture_filter_anisotropic");o=n.getParameter(P.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function a(P){return!(P!==Tn&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(P){const L=P===qo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(P!==Un&&i.convert(P)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&P!==Gn&&!L)}function c(P){if(P==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";P="mediump"}return P==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,C=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:S,maxVaryings:y,maxFragmentUniforms:x,vertexTextures:A,maxSamples:C}}function Fm(n){const t=this;let e=null,i=0,o=!1,s=!1;const a=new xi,r=new ee,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||i!==0||o;return o=u,i=d.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,p){const g=d.clippingPlanes,M=d.clipIntersection,m=d.clipShadows,f=n.get(d);if(!o||g===null||g.length===0||s&&!m)s?h(null):l();else{const S=s?0:i,y=S*4;let x=f.clippingState||null;c.value=x,x=h(g,u,y,p);for(let A=0;A!==y;++A)x[A]=e[A];f.clippingState=x,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(d,u,p,g){const M=d!==null?d.length:0;let m=null;if(M!==0){if(m=c.value,g!==!0||m===null){const f=p+M*4,S=u.matrixWorldInverse;r.getNormalMatrix(S),(m===null||m.length<f)&&(m=new Float32Array(f));for(let y=0,x=p;y!==M;++y,x+=4)a.copy(d[y]).applyMatrix4(S,r),a.normal.toArray(m,x),m[x+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,m}}function Om(n){let t=new WeakMap;function e(a,r){return r===lr?a.mapping=no:r===hr&&(a.mapping=io),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===lr||r===hr)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new nf(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",o),e(l.texture,a.mapping)}else return null}}return a}function o(a){const r=a.target;r.removeEventListener("dispose",o);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}const $i=4,fl=[.125,.215,.35,.446,.526,.582],Si=20,za=new Tc,pl=new ce;let Fa=null,Oa=0,Ba=0,ka=!1;const yi=(1+Math.sqrt(5))/2,Wi=1/yi,ml=[new z(-yi,Wi,0),new z(yi,Wi,0),new z(-Wi,0,yi),new z(Wi,0,yi),new z(0,yi,-Wi),new z(0,yi,Wi),new z(-1,1,-1),new z(1,1,-1),new z(-1,1,1),new z(1,1,1)],Bm=new z;class gl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,o=100,s={}){const{size:a=256,position:r=Bm}=s;Fa=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),Ba=this._renderer.getActiveMipmapLevel(),ka=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,o,c,r),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ml(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=_l(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Fa,Oa,Ba),this._renderer.xr.enabled=ka,t.scissorTest=!1,As(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===no||t.mapping===io?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Fa=this._renderer.getRenderTarget(),Oa=this._renderer.getActiveCubeFace(),Ba=this._renderer.getActiveMipmapLevel(),ka=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Pn,minFilter:Pn,generateMipmaps:!1,type:qo,format:Tn,colorSpace:oo,depthBuffer:!1},o=vl(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vl(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=km(s)),this._blurMaterial=Vm(s,t,e)}return o}_compileMaterial(t){const e=new v(this._lodPlanes[0],t);this._renderer.compile(e,za)}_sceneToCubeUV(t,e,i,o,s){const c=new sn(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(pl),d.toneMapping=ci,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(o),d.clearDepth(),d.setRenderTarget(null));const M=new na({name:"PMREM.Background",side:Ke,depthWrite:!1,depthTest:!1}),m=new v(new k,M);let f=!1;const S=t.background;S?S.isColor&&(M.color.copy(S),t.background=null,f=!0):(M.color.copy(pl),f=!0);for(let y=0;y<6;y++){const x=y%3;x===0?(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[y],s.y,s.z)):x===1?(c.up.set(0,0,l[y]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[y],s.z)):(c.up.set(0,l[y],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[y]));const A=this._cubeSize;As(o,x*A,y>2?A:0,A,A),d.setRenderTarget(o),f&&d.render(m,c),d.render(t,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=p,d.autoClear=u,t.background=S}_textureToCubeUV(t,e){const i=this._renderer,o=t.mapping===no||t.mapping===io;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ml()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=_l());const s=o?this._cubemapMaterial:this._equirectMaterial,a=new v(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;As(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,za)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const o=this._lodPlanes.length;for(let s=1;s<o;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=ml[(o-s-1)%ml.length];this._blur(t,s-1,s,a,r)}e.autoClear=i}_blur(t,e,i,o,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,o,"latitudinal",s),this._halfBlur(a,t,i,i,o,"longitudinal",s)}_halfBlur(t,e,i,o,s,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new v(this._lodPlanes[o],l),u=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Si-1),M=s/g,m=isFinite(s)?1+Math.floor(h*M):Si;m>Si&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);const f=[];let S=0;for(let P=0;P<Si;++P){const L=P/M,E=Math.exp(-L*L/2);f.push(E),P===0?S+=E:P<m&&(S+=2*E)}for(let P=0;P<f.length;P++)f[P]=f[P]/S;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=a==="latitudinal",r&&(u.poleAxis.value=r);const{_lodMax:y}=this;u.dTheta.value=g,u.mipInt.value=y-i;const x=this._sizeLods[o],A=3*x*(o>y-$i?o-y+$i:0),C=4*(this._cubeSize-x);As(e,A,C,3*x,2*x),c.setRenderTarget(e),c.render(d,za)}}function km(n){const t=[],e=[],i=[];let o=n;const s=n-$i+1+fl.length;for(let a=0;a<s;a++){const r=Math.pow(2,o);e.push(r);let c=1/r;a>n-$i?c=fl[a-n+$i-1]:a===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,g=6,M=3,m=2,f=1,S=new Float32Array(M*g*p),y=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let C=0;C<p;C++){const P=C%3*2/3-1,L=C>2?0:-1,E=[P,L,0,P+2/3,L,0,P+2/3,L+1,0,P,L,0,P+2/3,L+1,0,P,L+1,0];S.set(E,M*g*C),y.set(u,m*g*C);const b=[C,C,C,C,C,C];x.set(b,f*g*C)}const A=new De;A.setAttribute("position",new Dn(S,M)),A.setAttribute("uv",new Dn(y,m)),A.setAttribute("faceIndex",new Dn(x,f)),t.push(A),o>$i&&o--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function vl(n,t,e){const i=new Ci(n,t,e);return i.texture.mapping=ta,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function As(n,t,e,i,o){n.viewport.set(t,e,i,o),n.scissor.set(t,e,i,o)}function Vm(n,t,e){const i=new Float32Array(Si),o=new z(0,1,0);return new li({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Ac(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function _l(){return new li({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ac(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Ml(){return new li({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ac(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Ac(){return`

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
	`}function Hm(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===lr||c===hr,h=c===no||c===io;if(l||h){let d=t.get(r);const u=d!==void 0?d.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==u)return e===null&&(e=new gl(n)),d=l?e.fromEquirectangular(r,d):e.fromCubemap(r,d),d.texture.pmremVersion=r.pmremVersion,t.set(r,d),d.texture;if(d!==void 0)return d.texture;{const p=r.image;return l&&p&&p.height>0||h&&p&&o(p)?(e===null&&(e=new gl(n)),d=l?e.fromEquirectangular(r):e.fromCubemap(r),d.texture.pmremVersion=r.pmremVersion,t.set(r,d),r.addEventListener("dispose",s),d.texture):null}}}return r}function o(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Gm(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let o;switch(i){case"WEBGL_depth_texture":o=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=n.getExtension(i)}return t[i]=o,o}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const o=e(i);return o===null&&Fo("THREE.WebGLRenderer: "+i+" extension not supported."),o}}}function qm(n,t,e,i){const o={},s=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete o[u.id];const p=s.get(u);p&&(t.remove(p),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function r(d,u){return o[u.id]===!0||(u.addEventListener("dispose",a),o[u.id]=!0,e.memory.geometries++),u}function c(d){const u=d.attributes;for(const p in u)t.update(u[p],n.ARRAY_BUFFER)}function l(d){const u=[],p=d.index,g=d.attributes.position;let M=0;if(p!==null){const S=p.array;M=p.version;for(let y=0,x=S.length;y<x;y+=3){const A=S[y+0],C=S[y+1],P=S[y+2];u.push(A,C,C,P,P,A)}}else if(g!==void 0){const S=g.array;M=g.version;for(let y=0,x=S.length/3-1;y<x;y+=3){const A=y+0,C=y+1,P=y+2;u.push(A,C,C,P,P,A)}}else return;const m=new(Ah(u)?Dh:Lh)(u,1);m.version=M;const f=s.get(d);f&&t.remove(f),s.set(d,m)}function h(d){const u=s.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&l(d)}else l(d);return s.get(d)}return{get:r,update:c,getWireframeAttribute:h}}function Wm(n,t,e){let i;function o(u){i=u}let s,a;function r(u){s=u.type,a=u.bytesPerElement}function c(u,p){n.drawElements(i,p,s,u*a),e.update(p,i,1)}function l(u,p,g){g!==0&&(n.drawElementsInstanced(i,p,s,u*a,g),e.update(p,i,g))}function h(u,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,i,1)}function d(u,p,g,M){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)l(u[f]/a,p[f],M[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,u,0,M,0,g);let f=0;for(let S=0;S<g;S++)f+=p[S]*M[S];e.update(f,i,1)}}this.setMode=o,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function Xm(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,r){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function o(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:o,update:i}}function jm(n,t,e){const i=new WeakMap,o=new Te;function s(a,r,c){const l=a.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(r);if(u===void 0||u.count!==d){let b=function(){L.dispose(),i.delete(r),r.removeEventListener("dispose",b)};var p=b;u!==void 0&&u.texture.dispose();const g=r.morphAttributes.position!==void 0,M=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,f=r.morphAttributes.position||[],S=r.morphAttributes.normal||[],y=r.morphAttributes.color||[];let x=0;g===!0&&(x=1),M===!0&&(x=2),m===!0&&(x=3);let A=r.attributes.position.count*x,C=1;A>t.maxTextureSize&&(C=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const P=new Float32Array(A*C*4*d),L=new Ch(P,A,C,d);L.type=Gn,L.needsUpdate=!0;const E=x*4;for(let D=0;D<d;D++){const F=f[D],V=S[D],q=y[D],W=A*C*4*D;for(let j=0;j<F.count;j++){const N=j*E;g===!0&&(o.fromBufferAttribute(F,j),P[W+N+0]=o.x,P[W+N+1]=o.y,P[W+N+2]=o.z,P[W+N+3]=0),M===!0&&(o.fromBufferAttribute(V,j),P[W+N+4]=o.x,P[W+N+5]=o.y,P[W+N+6]=o.z,P[W+N+7]=0),m===!0&&(o.fromBufferAttribute(q,j),P[W+N+8]=o.x,P[W+N+9]=o.y,P[W+N+10]=o.z,P[W+N+11]=q.itemSize===4?o.w:1)}}u={count:d,texture:L,size:new Ct(A,C)},i.set(r,u),r.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const M=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:s}}function Ym(n,t,e,i){let o=new WeakMap;function s(c){const l=i.render.frame,h=c.geometry,d=t.get(c,h);if(o.get(d)!==l&&(t.update(d),o.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),o.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),o.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;o.get(u)!==l&&(u.update(),o.set(u,l))}return d}function a(){o=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const Qh=new ke,xl=new Bh(1,1),td=new Ch,ed=new Bu,nd=new zh,yl=[],bl=[],Sl=new Float32Array(16),wl=new Float32Array(9),El=new Float32Array(4);function uo(n,t,e){const i=n[0];if(i<=0||i>0)return n;const o=t*e;let s=yl[o];if(s===void 0&&(s=new Float32Array(o),yl[o]=s),t!==0){i.toArray(s,0);for(let a=1,r=0;a!==t;++a)r+=e,n[a].toArray(s,r)}return s}function Re(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ie(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function sa(n,t){let e=bl[t];e===void 0&&(e=new Int32Array(t),bl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Zm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function $m(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2fv(this.addr,t),Ie(e,t)}}function Jm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;n.uniform3fv(this.addr,t),Ie(e,t)}}function Km(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4fv(this.addr,t),Ie(e,t)}}function Qm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(Re(e,i))return;El.set(i),n.uniformMatrix2fv(this.addr,!1,El),Ie(e,i)}}function tg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(Re(e,i))return;wl.set(i),n.uniformMatrix3fv(this.addr,!1,wl),Ie(e,i)}}function eg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(Re(e,i))return;Sl.set(i),n.uniformMatrix4fv(this.addr,!1,Sl),Ie(e,i)}}function ng(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function ig(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2iv(this.addr,t),Ie(e,t)}}function og(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3iv(this.addr,t),Ie(e,t)}}function sg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4iv(this.addr,t),Ie(e,t)}}function ag(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function rg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2uiv(this.addr,t),Ie(e,t)}}function cg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3uiv(this.addr,t),Ie(e,t)}}function lg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4uiv(this.addr,t),Ie(e,t)}}function hg(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o);let s;this.type===n.SAMPLER_2D_SHADOW?(xl.compareFunction=Th,s=xl):s=Qh,e.setTexture2D(t||s,o)}function dg(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTexture3D(t||ed,o)}function ug(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTextureCube(t||nd,o)}function fg(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTexture2DArray(t||td,o)}function pg(n){switch(n){case 5126:return Zm;case 35664:return $m;case 35665:return Jm;case 35666:return Km;case 35674:return Qm;case 35675:return tg;case 35676:return eg;case 5124:case 35670:return ng;case 35667:case 35671:return ig;case 35668:case 35672:return og;case 35669:case 35673:return sg;case 5125:return ag;case 36294:return rg;case 36295:return cg;case 36296:return lg;case 35678:case 36198:case 36298:case 36306:case 35682:return hg;case 35679:case 36299:case 36307:return dg;case 35680:case 36300:case 36308:case 36293:return ug;case 36289:case 36303:case 36311:case 36292:return fg}}function mg(n,t){n.uniform1fv(this.addr,t)}function gg(n,t){const e=uo(t,this.size,2);n.uniform2fv(this.addr,e)}function vg(n,t){const e=uo(t,this.size,3);n.uniform3fv(this.addr,e)}function _g(n,t){const e=uo(t,this.size,4);n.uniform4fv(this.addr,e)}function Mg(n,t){const e=uo(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function xg(n,t){const e=uo(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function yg(n,t){const e=uo(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function bg(n,t){n.uniform1iv(this.addr,t)}function Sg(n,t){n.uniform2iv(this.addr,t)}function wg(n,t){n.uniform3iv(this.addr,t)}function Eg(n,t){n.uniform4iv(this.addr,t)}function Tg(n,t){n.uniform1uiv(this.addr,t)}function Ag(n,t){n.uniform2uiv(this.addr,t)}function Cg(n,t){n.uniform3uiv(this.addr,t)}function Pg(n,t){n.uniform4uiv(this.addr,t)}function Rg(n,t,e){const i=this.cache,o=t.length,s=sa(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTexture2D(t[a]||Qh,s[a])}function Ig(n,t,e){const i=this.cache,o=t.length,s=sa(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTexture3D(t[a]||ed,s[a])}function Lg(n,t,e){const i=this.cache,o=t.length,s=sa(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTextureCube(t[a]||nd,s[a])}function Dg(n,t,e){const i=this.cache,o=t.length,s=sa(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTexture2DArray(t[a]||td,s[a])}function Ug(n){switch(n){case 5126:return mg;case 35664:return gg;case 35665:return vg;case 35666:return _g;case 35674:return Mg;case 35675:return xg;case 35676:return yg;case 5124:case 35670:return bg;case 35667:case 35671:return Sg;case 35668:case 35672:return wg;case 35669:case 35673:return Eg;case 5125:return Tg;case 36294:return Ag;case 36295:return Cg;case 36296:return Pg;case 35678:case 36198:case 36298:case 36306:case 35682:return Rg;case 35679:case 36299:case 36307:return Ig;case 35680:case 36300:case 36308:case 36293:return Lg;case 36289:case 36303:case 36311:case 36292:return Dg}}class Ng{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=pg(e.type)}}class zg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ug(e.type)}}class Fg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const o=this.seq;for(let s=0,a=o.length;s!==a;++s){const r=o[s];r.setValue(t,e[r.id],i)}}}const Va=/(\w+)(\])?(\[|\.)?/g;function Tl(n,t){n.seq.push(t),n.map[t.id]=t}function Og(n,t,e){const i=n.name,o=i.length;for(Va.lastIndex=0;;){const s=Va.exec(i),a=Va.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===o){Tl(e,l===void 0?new Ng(r,n,t):new zg(r,n,t));break}else{let d=e.map[r];d===void 0&&(d=new Fg(r),Tl(e,d)),e=d}}}class Os{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const s=t.getActiveUniform(e,o),a=t.getUniformLocation(e,s.name);Og(s,a,this)}}setValue(t,e,i,o){const s=this.map[e];s!==void 0&&s.setValue(t,i,o)}setOptional(t,e,i){const o=e[i];o!==void 0&&this.setValue(t,i,o)}static upload(t,e,i,o){for(let s=0,a=e.length;s!==a;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,o)}}static seqWithValue(t,e){const i=[];for(let o=0,s=t.length;o!==s;++o){const a=t[o];a.id in e&&i.push(a)}return i}}function Al(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Bg=37297;let kg=0;function Vg(n,t){const e=n.split(`
`),i=[],o=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=o;a<s;a++){const r=a+1;i.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return i.join(`
`)}const Cl=new ee;function Hg(n){fe._getMatrix(Cl,fe.workingColorSpace,n);const t=`mat3( ${Cl.elements.map(e=>e.toFixed(4))} )`;switch(fe.getTransfer(n)){case qs:return[t,"LinearTransferOETF"];case Me:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Pl(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=(n.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Vg(n.getShaderSource(t),r)}else return s}function Gg(n,t){const e=Hg(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function qg(n,t){let e;switch(t){case Kd:e="Linear";break;case Qd:e="Reinhard";break;case tu:e="Cineon";break;case eu:e="ACESFilmic";break;case iu:e="AgX";break;case ou:e="Neutral";break;case nu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Cs=new z;function Wg(){fe.getLuminanceCoefficients(Cs);const n=Cs.x.toFixed(4),t=Cs.y.toFixed(4),e=Cs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Xg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(To).join(`
`)}function jg(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Yg(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let o=0;o<i;o++){const s=n.getActiveAttrib(t,o),a=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[a]={type:s.type,location:n.getAttribLocation(t,a),locationSize:r}}return e}function To(n){return n!==""}function Rl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Il(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Zg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xr(n){return n.replace(Zg,Jg)}const $g=new Map;function Jg(n,t){let e=ne[t];if(e===void 0){const i=$g.get(t);if(i!==void 0)e=ne[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Xr(e)}const Kg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ll(n){return n.replace(Kg,Qg)}function Qg(n,t,e,i){let o="";for(let s=parseInt(t);s<parseInt(e);s++)o+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return o}function Dl(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function tv(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ph?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===mh?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Vn&&(t="SHADOWMAP_TYPE_VSM"),t}function ev(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case no:case io:t="ENVMAP_TYPE_CUBE";break;case ta:t="ENVMAP_TYPE_CUBE_UV";break}return t}function nv(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case io:t="ENVMAP_MODE_REFRACTION";break}return t}function iv(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case gh:t="ENVMAP_BLENDING_MULTIPLY";break;case $d:t="ENVMAP_BLENDING_MIX";break;case Jd:t="ENVMAP_BLENDING_ADD";break}return t}function ov(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function sv(n,t,e,i){const o=n.getContext(),s=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=tv(e),l=ev(e),h=nv(e),d=iv(e),u=ov(e),p=Xg(e),g=jg(s),M=o.createProgram();let m,f,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(To).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(To).join(`
`),f.length>0&&(f+=`
`)):(m=[Dl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(To).join(`
`),f=[Dl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ci?"#define TONE_MAPPING":"",e.toneMapping!==ci?ne.tonemapping_pars_fragment:"",e.toneMapping!==ci?qg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ne.colorspace_pars_fragment,Gg("linearToOutputTexel",e.outputColorSpace),Wg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(To).join(`
`)),a=Xr(a),a=Rl(a,e),a=Il(a,e),r=Xr(r),r=Rl(r,e),r=Il(r,e),a=Ll(a),r=Ll(r),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===zc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===zc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=S+m+a,x=S+f+r,A=Al(o,o.VERTEX_SHADER,y),C=Al(o,o.FRAGMENT_SHADER,x);o.attachShader(M,A),o.attachShader(M,C),e.index0AttributeName!==void 0?o.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&o.bindAttribLocation(M,0,"position"),o.linkProgram(M);function P(D){if(n.debug.checkShaderErrors){const F=o.getProgramInfoLog(M)||"",V=o.getShaderInfoLog(A)||"",q=o.getShaderInfoLog(C)||"",W=F.trim(),j=V.trim(),N=q.trim();let B=!0,K=!0;if(o.getProgramParameter(M,o.LINK_STATUS)===!1)if(B=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(o,M,A,C);else{const X=Pl(o,A,"vertex"),ht=Pl(o,C,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(M,o.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+W+`
`+X+`
`+ht)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(j===""||N==="")&&(K=!1);K&&(D.diagnostics={runnable:B,programLog:W,vertexShader:{log:j,prefix:m},fragmentShader:{log:N,prefix:f}})}o.deleteShader(A),o.deleteShader(C),L=new Os(o,M),E=Yg(o,M)}let L;this.getUniforms=function(){return L===void 0&&P(this),L};let E;this.getAttributes=function(){return E===void 0&&P(this),E};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=o.getProgramParameter(M,Bg)),b},this.destroy=function(){i.releaseStatesOfProgram(this),o.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=kg++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=A,this.fragmentShader=C,this}let av=0;class rv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,o=this._getShaderStage(e),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(o)===!1&&(a.add(o),o.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new cv(t),e.set(t,i)),i}}class cv{constructor(t){this.id=av++,this.code=t,this.usedTimes=0}}function lv(n,t,e,i,o,s,a){const r=new Rh,c=new rv,l=new Set,h=[],d=o.logarithmicDepthBuffer,u=o.vertexTextures;let p=o.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(E){return l.add(E),E===0?"uv":`uv${E}`}function m(E,b,D,F,V){const q=F.fog,W=V.geometry,j=E.isMeshStandardMaterial?F.environment:null,N=(E.isMeshStandardMaterial?e:t).get(E.envMap||j),B=N&&N.mapping===ta?N.image.height:null,K=g[E.type];E.precision!==null&&(p=o.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const X=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ht=X!==void 0?X.length:0;let ft=0;W.morphAttributes.position!==void 0&&(ft=1),W.morphAttributes.normal!==void 0&&(ft=2),W.morphAttributes.color!==void 0&&(ft=3);let St,Dt,Kt,rt;if(K){const he=Cn[K];St=he.vertexShader,Dt=he.fragmentShader}else St=E.vertexShader,Dt=E.fragmentShader,c.update(E),Kt=c.getVertexShaderID(E),rt=c.getFragmentShaderID(E);const ut=n.getRenderTarget(),Ut=n.state.buffers.depth.getReversed(),Gt=V.isInstancedMesh===!0,Bt=V.isBatchedMesh===!0,oe=!!E.map,ve=!!E.matcap,O=!!N,mt=!!E.aoMap,dt=!!E.lightMap,ct=!!E.bumpMap,Q=!!E.normalMap,wt=!!E.displacementMap,Mt=!!E.emissiveMap,Tt=!!E.metalnessMap,Yt=!!E.roughnessMap,Jt=E.anisotropy>0,U=E.clearcoat>0,T=E.dispersion>0,$=E.iridescence>0,nt=E.sheen>0,pt=E.transmission>0,st=Jt&&!!E.anisotropyMap,kt=U&&!!E.clearcoatMap,Et=U&&!!E.clearcoatNormalMap,Vt=U&&!!E.clearcoatRoughnessMap,Ht=$&&!!E.iridescenceMap,yt=$&&!!E.iridescenceThicknessMap,vt=nt&&!!E.sheenColorMap,Xt=nt&&!!E.sheenRoughnessMap,Ot=!!E.specularMap,Pt=!!E.specularColorMap,jt=!!E.specularIntensityMap,G=pt&&!!E.transmissionMap,bt=pt&&!!E.thicknessMap,At=!!E.gradientMap,Nt=!!E.alphaMap,gt=E.alphaTest>0,lt=!!E.alphaHash,zt=!!E.extensions;let Zt=ci;E.toneMapped&&(ut===null||ut.isXRRenderTarget===!0)&&(Zt=n.toneMapping);const me={shaderID:K,shaderType:E.type,shaderName:E.name,vertexShader:St,fragmentShader:Dt,defines:E.defines,customVertexShaderID:Kt,customFragmentShaderID:rt,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Bt,batchingColor:Bt&&V._colorsTexture!==null,instancing:Gt,instancingColor:Gt&&V.instanceColor!==null,instancingMorph:Gt&&V.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:ut===null?n.outputColorSpace:ut.isXRRenderTarget===!0?ut.texture.colorSpace:oo,alphaToCoverage:!!E.alphaToCoverage,map:oe,matcap:ve,envMap:O,envMapMode:O&&N.mapping,envMapCubeUVHeight:B,aoMap:mt,lightMap:dt,bumpMap:ct,normalMap:Q,displacementMap:u&&wt,emissiveMap:Mt,normalMapObjectSpace:Q&&E.normalMapType===cu,normalMapTangentSpace:Q&&E.normalMapType===Eh,metalnessMap:Tt,roughnessMap:Yt,anisotropy:Jt,anisotropyMap:st,clearcoat:U,clearcoatMap:kt,clearcoatNormalMap:Et,clearcoatRoughnessMap:Vt,dispersion:T,iridescence:$,iridescenceMap:Ht,iridescenceThicknessMap:yt,sheen:nt,sheenColorMap:vt,sheenRoughnessMap:Xt,specularMap:Ot,specularColorMap:Pt,specularIntensityMap:jt,transmission:pt,transmissionMap:G,thicknessMap:bt,gradientMap:At,opaque:E.transparent===!1&&E.blending===Qi&&E.alphaToCoverage===!1,alphaMap:Nt,alphaTest:gt,alphaHash:lt,combine:E.combine,mapUv:oe&&M(E.map.channel),aoMapUv:mt&&M(E.aoMap.channel),lightMapUv:dt&&M(E.lightMap.channel),bumpMapUv:ct&&M(E.bumpMap.channel),normalMapUv:Q&&M(E.normalMap.channel),displacementMapUv:wt&&M(E.displacementMap.channel),emissiveMapUv:Mt&&M(E.emissiveMap.channel),metalnessMapUv:Tt&&M(E.metalnessMap.channel),roughnessMapUv:Yt&&M(E.roughnessMap.channel),anisotropyMapUv:st&&M(E.anisotropyMap.channel),clearcoatMapUv:kt&&M(E.clearcoatMap.channel),clearcoatNormalMapUv:Et&&M(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Vt&&M(E.clearcoatRoughnessMap.channel),iridescenceMapUv:Ht&&M(E.iridescenceMap.channel),iridescenceThicknessMapUv:yt&&M(E.iridescenceThicknessMap.channel),sheenColorMapUv:vt&&M(E.sheenColorMap.channel),sheenRoughnessMapUv:Xt&&M(E.sheenRoughnessMap.channel),specularMapUv:Ot&&M(E.specularMap.channel),specularColorMapUv:Pt&&M(E.specularColorMap.channel),specularIntensityMapUv:jt&&M(E.specularIntensityMap.channel),transmissionMapUv:G&&M(E.transmissionMap.channel),thicknessMapUv:bt&&M(E.thicknessMap.channel),alphaMapUv:Nt&&M(E.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Q||Jt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!W.attributes.uv&&(oe||Nt),fog:!!q,useFog:E.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Ut,skinning:V.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:ht,morphTextureStride:ft,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:Zt,decodeVideoTexture:oe&&E.map.isVideoTexture===!0&&fe.getTransfer(E.map.colorSpace)===Me,decodeVideoTextureEmissive:Mt&&E.emissiveMap.isVideoTexture===!0&&fe.getTransfer(E.emissiveMap.colorSpace)===Me,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===Sn,flipSided:E.side===Ke,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:zt&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&E.extensions.multiDraw===!0||Bt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return me.vertexUv1s=l.has(1),me.vertexUv2s=l.has(2),me.vertexUv3s=l.has(3),l.clear(),me}function f(E){const b=[];if(E.shaderID?b.push(E.shaderID):(b.push(E.customVertexShaderID),b.push(E.customFragmentShaderID)),E.defines!==void 0)for(const D in E.defines)b.push(D),b.push(E.defines[D]);return E.isRawShaderMaterial===!1&&(S(b,E),y(b,E),b.push(n.outputColorSpace)),b.push(E.customProgramCacheKey),b.join()}function S(E,b){E.push(b.precision),E.push(b.outputColorSpace),E.push(b.envMapMode),E.push(b.envMapCubeUVHeight),E.push(b.mapUv),E.push(b.alphaMapUv),E.push(b.lightMapUv),E.push(b.aoMapUv),E.push(b.bumpMapUv),E.push(b.normalMapUv),E.push(b.displacementMapUv),E.push(b.emissiveMapUv),E.push(b.metalnessMapUv),E.push(b.roughnessMapUv),E.push(b.anisotropyMapUv),E.push(b.clearcoatMapUv),E.push(b.clearcoatNormalMapUv),E.push(b.clearcoatRoughnessMapUv),E.push(b.iridescenceMapUv),E.push(b.iridescenceThicknessMapUv),E.push(b.sheenColorMapUv),E.push(b.sheenRoughnessMapUv),E.push(b.specularMapUv),E.push(b.specularColorMapUv),E.push(b.specularIntensityMapUv),E.push(b.transmissionMapUv),E.push(b.thicknessMapUv),E.push(b.combine),E.push(b.fogExp2),E.push(b.sizeAttenuation),E.push(b.morphTargetsCount),E.push(b.morphAttributeCount),E.push(b.numDirLights),E.push(b.numPointLights),E.push(b.numSpotLights),E.push(b.numSpotLightMaps),E.push(b.numHemiLights),E.push(b.numRectAreaLights),E.push(b.numDirLightShadows),E.push(b.numPointLightShadows),E.push(b.numSpotLightShadows),E.push(b.numSpotLightShadowsWithMaps),E.push(b.numLightProbes),E.push(b.shadowMapType),E.push(b.toneMapping),E.push(b.numClippingPlanes),E.push(b.numClipIntersection),E.push(b.depthPacking)}function y(E,b){r.disableAll(),b.supportsVertexTextures&&r.enable(0),b.instancing&&r.enable(1),b.instancingColor&&r.enable(2),b.instancingMorph&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),b.dispersion&&r.enable(20),b.batchingColor&&r.enable(21),b.gradientMap&&r.enable(22),E.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.reversedDepthBuffer&&r.enable(4),b.skinning&&r.enable(5),b.morphTargets&&r.enable(6),b.morphNormals&&r.enable(7),b.morphColors&&r.enable(8),b.premultipliedAlpha&&r.enable(9),b.shadowMapEnabled&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),b.decodeVideoTextureEmissive&&r.enable(20),b.alphaToCoverage&&r.enable(21),E.push(r.mask)}function x(E){const b=g[E.type];let D;if(b){const F=Cn[b];D=Ku.clone(F.uniforms)}else D=E.uniforms;return D}function A(E,b){let D;for(let F=0,V=h.length;F<V;F++){const q=h[F];if(q.cacheKey===b){D=q,++D.usedTimes;break}}return D===void 0&&(D=new sv(n,b,E,s),h.push(D)),D}function C(E){if(--E.usedTimes===0){const b=h.indexOf(E);h[b]=h[h.length-1],h.pop(),E.destroy()}}function P(E){c.remove(E)}function L(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:A,releaseProgram:C,releaseShaderCache:P,programs:h,dispose:L}}function hv(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let r=n.get(a);return r===void 0&&(r={},n.set(a,r)),r}function i(a){n.delete(a)}function o(a,r,c){n.get(a)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:o,dispose:s}}function dv(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Ul(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Nl(){const n=[];let t=0;const e=[],i=[],o=[];function s(){t=0,e.length=0,i.length=0,o.length=0}function a(d,u,p,g,M,m){let f=n[t];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:g,renderOrder:d.renderOrder,z:M,group:m},n[t]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=d.renderOrder,f.z=M,f.group=m),t++,f}function r(d,u,p,g,M,m){const f=a(d,u,p,g,M,m);p.transmission>0?i.push(f):p.transparent===!0?o.push(f):e.push(f)}function c(d,u,p,g,M,m){const f=a(d,u,p,g,M,m);p.transmission>0?i.unshift(f):p.transparent===!0?o.unshift(f):e.unshift(f)}function l(d,u){e.length>1&&e.sort(d||dv),i.length>1&&i.sort(u||Ul),o.length>1&&o.sort(u||Ul)}function h(){for(let d=t,u=n.length;d<u;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:o,init:s,push:r,unshift:c,finish:h,sort:l}}function uv(){let n=new WeakMap;function t(i,o){const s=n.get(i);let a;return s===void 0?(a=new Nl,n.set(i,[a])):o>=s.length?(a=new Nl,s.push(a)):a=s[o],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function fv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new z,color:new ce};break;case"SpotLight":e={position:new z,direction:new z,color:new ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new ce,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new ce,groundColor:new ce};break;case"RectAreaLight":e={color:new ce,position:new z,halfWidth:new z,halfHeight:new z};break}return n[t.id]=e,e}}}function pv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let mv=0;function gv(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function vv(n){const t=new fv,e=pv(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new z);const o=new z,s=new Ee,a=new Ee;function r(l){let h=0,d=0,u=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let p=0,g=0,M=0,m=0,f=0,S=0,y=0,x=0,A=0,C=0,P=0;l.sort(gv);for(let E=0,b=l.length;E<b;E++){const D=l[E],F=D.color,V=D.intensity,q=D.distance,W=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=F.r*V,d+=F.g*V,u+=F.b*V;else if(D.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(D.sh.coefficients[j],V);P++}else if(D.isDirectionalLight){const j=t.get(D);if(j.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const N=D.shadow,B=e.get(D);B.shadowIntensity=N.intensity,B.shadowBias=N.bias,B.shadowNormalBias=N.normalBias,B.shadowRadius=N.radius,B.shadowMapSize=N.mapSize,i.directionalShadow[p]=B,i.directionalShadowMap[p]=W,i.directionalShadowMatrix[p]=D.shadow.matrix,S++}i.directional[p]=j,p++}else if(D.isSpotLight){const j=t.get(D);j.position.setFromMatrixPosition(D.matrixWorld),j.color.copy(F).multiplyScalar(V),j.distance=q,j.coneCos=Math.cos(D.angle),j.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),j.decay=D.decay,i.spot[M]=j;const N=D.shadow;if(D.map&&(i.spotLightMap[A]=D.map,A++,N.updateMatrices(D),D.castShadow&&C++),i.spotLightMatrix[M]=N.matrix,D.castShadow){const B=e.get(D);B.shadowIntensity=N.intensity,B.shadowBias=N.bias,B.shadowNormalBias=N.normalBias,B.shadowRadius=N.radius,B.shadowMapSize=N.mapSize,i.spotShadow[M]=B,i.spotShadowMap[M]=W,x++}M++}else if(D.isRectAreaLight){const j=t.get(D);j.color.copy(F).multiplyScalar(V),j.halfWidth.set(D.width*.5,0,0),j.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=j,m++}else if(D.isPointLight){const j=t.get(D);if(j.color.copy(D.color).multiplyScalar(D.intensity),j.distance=D.distance,j.decay=D.decay,D.castShadow){const N=D.shadow,B=e.get(D);B.shadowIntensity=N.intensity,B.shadowBias=N.bias,B.shadowNormalBias=N.normalBias,B.shadowRadius=N.radius,B.shadowMapSize=N.mapSize,B.shadowCameraNear=N.camera.near,B.shadowCameraFar=N.camera.far,i.pointShadow[g]=B,i.pointShadowMap[g]=W,i.pointShadowMatrix[g]=D.shadow.matrix,y++}i.point[g]=j,g++}else if(D.isHemisphereLight){const j=t.get(D);j.skyColor.copy(D.color).multiplyScalar(V),j.groundColor.copy(D.groundColor).multiplyScalar(V),i.hemi[f]=j,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Lt.LTC_FLOAT_1,i.rectAreaLTC2=Lt.LTC_FLOAT_2):(i.rectAreaLTC1=Lt.LTC_HALF_1,i.rectAreaLTC2=Lt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const L=i.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==M||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==S||L.numPointShadows!==y||L.numSpotShadows!==x||L.numSpotMaps!==A||L.numLightProbes!==P)&&(i.directional.length=p,i.spot.length=M,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=x+A-C,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=C,i.numLightProbes=P,L.directionalLength=p,L.pointLength=g,L.spotLength=M,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=S,L.numPointShadows=y,L.numSpotShadows=x,L.numSpotMaps=A,L.numLightProbes=P,i.version=mv++)}function c(l,h){let d=0,u=0,p=0,g=0,M=0;const m=h.matrixWorldInverse;for(let f=0,S=l.length;f<S;f++){const y=l[f];if(y.isDirectionalLight){const x=i.directional[d];x.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(o),x.direction.transformDirection(m),d++}else if(y.isSpotLight){const x=i.spot[p];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(y.matrixWorld),o.setFromMatrixPosition(y.target.matrixWorld),x.direction.sub(o),x.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),a.identity(),s.copy(y.matrixWorld),s.premultiply(m),a.extractRotation(s),x.halfWidth.set(y.width*.5,0,0),x.halfHeight.set(0,y.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(y.isPointLight){const x=i.point[u];x.position.setFromMatrixPosition(y.matrixWorld),x.position.applyMatrix4(m),u++}else if(y.isHemisphereLight){const x=i.hemi[M];x.direction.setFromMatrixPosition(y.matrixWorld),x.direction.transformDirection(m),M++}}}return{setup:r,setupView:c,state:i}}function zl(n){const t=new vv(n),e=[],i=[];function o(h){l.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function a(h){i.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:o,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:a}}function _v(n){let t=new WeakMap;function e(o,s=0){const a=t.get(o);let r;return a===void 0?(r=new zl(n),t.set(o,[r])):s>=a.length?(r=new zl(n),a.push(r)):r=a[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}const Mv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xv=`uniform sampler2D shadow_pass;
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
}`;function yv(n,t,e){let i=new xc;const o=new Ct,s=new Ct,a=new Te,r=new Wf({depthPacking:ru}),c=new Xf,l={},h=e.maxTextureSize,d={[jn]:Ke,[Ke]:jn,[Sn]:Sn},u=new li({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ct},radius:{value:4}},vertexShader:Mv,fragmentShader:xv}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const g=new De;g.setAttribute("position",new Dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new v(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ph;let f=this.type;this.render=function(C,P,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||C.length===0)return;const E=n.getRenderTarget(),b=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),F=n.state;F.setBlending(ri),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const V=f!==Vn&&this.type===Vn,q=f===Vn&&this.type!==Vn;for(let W=0,j=C.length;W<j;W++){const N=C[W],B=N.shadow;if(B===void 0){console.warn("THREE.WebGLShadowMap:",N,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;o.copy(B.mapSize);const K=B.getFrameExtents();if(o.multiply(K),s.copy(B.mapSize),(o.x>h||o.y>h)&&(o.x>h&&(s.x=Math.floor(h/K.x),o.x=s.x*K.x,B.mapSize.x=s.x),o.y>h&&(s.y=Math.floor(h/K.y),o.y=s.y*K.y,B.mapSize.y=s.y)),B.map===null||V===!0||q===!0){const ht=this.type!==Vn?{minFilter:Ye,magFilter:Ye}:{};B.map!==null&&B.map.dispose(),B.map=new Ci(o.x,o.y,ht),B.map.texture.name=N.name+".shadowMap",B.camera.updateProjectionMatrix()}n.setRenderTarget(B.map),n.clear();const X=B.getViewportCount();for(let ht=0;ht<X;ht++){const ft=B.getViewport(ht);a.set(s.x*ft.x,s.y*ft.y,s.x*ft.z,s.y*ft.w),F.viewport(a),B.updateMatrices(N,ht),i=B.getFrustum(),x(P,L,B.camera,N,this.type)}B.isPointLightShadow!==!0&&this.type===Vn&&S(B,L),B.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(E,b,D)};function S(C,P){const L=t.update(M);u.defines.VSM_SAMPLES!==C.blurSamples&&(u.defines.VSM_SAMPLES=C.blurSamples,p.defines.VSM_SAMPLES=C.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),C.mapPass===null&&(C.mapPass=new Ci(o.x,o.y)),u.uniforms.shadow_pass.value=C.map.texture,u.uniforms.resolution.value=C.mapSize,u.uniforms.radius.value=C.radius,n.setRenderTarget(C.mapPass),n.clear(),n.renderBufferDirect(P,null,L,u,M,null),p.uniforms.shadow_pass.value=C.mapPass.texture,p.uniforms.resolution.value=C.mapSize,p.uniforms.radius.value=C.radius,n.setRenderTarget(C.map),n.clear(),n.renderBufferDirect(P,null,L,p,M,null)}function y(C,P,L,E){let b=null;const D=L.isPointLight===!0?C.customDistanceMaterial:C.customDepthMaterial;if(D!==void 0)b=D;else if(b=L.isPointLight===!0?c:r,n.localClippingEnabled&&P.clipShadows===!0&&Array.isArray(P.clippingPlanes)&&P.clippingPlanes.length!==0||P.displacementMap&&P.displacementScale!==0||P.alphaMap&&P.alphaTest>0||P.map&&P.alphaTest>0||P.alphaToCoverage===!0){const F=b.uuid,V=P.uuid;let q=l[F];q===void 0&&(q={},l[F]=q);let W=q[V];W===void 0&&(W=b.clone(),q[V]=W,P.addEventListener("dispose",A)),b=W}if(b.visible=P.visible,b.wireframe=P.wireframe,E===Vn?b.side=P.shadowSide!==null?P.shadowSide:P.side:b.side=P.shadowSide!==null?P.shadowSide:d[P.side],b.alphaMap=P.alphaMap,b.alphaTest=P.alphaToCoverage===!0?.5:P.alphaTest,b.map=P.map,b.clipShadows=P.clipShadows,b.clippingPlanes=P.clippingPlanes,b.clipIntersection=P.clipIntersection,b.displacementMap=P.displacementMap,b.displacementScale=P.displacementScale,b.displacementBias=P.displacementBias,b.wireframeLinewidth=P.wireframeLinewidth,b.linewidth=P.linewidth,L.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const F=n.properties.get(b);F.light=L}return b}function x(C,P,L,E,b){if(C.visible===!1)return;if(C.layers.test(P.layers)&&(C.isMesh||C.isLine||C.isPoints)&&(C.castShadow||C.receiveShadow&&b===Vn)&&(!C.frustumCulled||i.intersectsObject(C))){C.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,C.matrixWorld);const V=t.update(C),q=C.material;if(Array.isArray(q)){const W=V.groups;for(let j=0,N=W.length;j<N;j++){const B=W[j],K=q[B.materialIndex];if(K&&K.visible){const X=y(C,K,E,b);C.onBeforeShadow(n,C,P,L,V,X,B),n.renderBufferDirect(L,null,V,X,C,B),C.onAfterShadow(n,C,P,L,V,X,B)}}}else if(q.visible){const W=y(C,q,E,b);C.onBeforeShadow(n,C,P,L,V,W,null),n.renderBufferDirect(L,null,V,W,C,null),C.onAfterShadow(n,C,P,L,V,W,null)}}const F=C.children;for(let V=0,q=F.length;V<q;V++)x(F[V],P,L,E,b)}function A(C){C.target.removeEventListener("dispose",A);for(const L in l){const E=l[L],b=C.target.uuid;b in E&&(E[b].dispose(),delete E[b])}}}const bv={[nr]:ir,[or]:rr,[sr]:cr,[eo]:ar,[ir]:nr,[rr]:or,[cr]:sr,[ar]:eo};function Sv(n,t){function e(){let G=!1;const bt=new Te;let At=null;const Nt=new Te(0,0,0,0);return{setMask:function(gt){At!==gt&&!G&&(n.colorMask(gt,gt,gt,gt),At=gt)},setLocked:function(gt){G=gt},setClear:function(gt,lt,zt,Zt,me){me===!0&&(gt*=Zt,lt*=Zt,zt*=Zt),bt.set(gt,lt,zt,Zt),Nt.equals(bt)===!1&&(n.clearColor(gt,lt,zt,Zt),Nt.copy(bt))},reset:function(){G=!1,At=null,Nt.set(-1,0,0,0)}}}function i(){let G=!1,bt=!1,At=null,Nt=null,gt=null;return{setReversed:function(lt){if(bt!==lt){const zt=t.get("EXT_clip_control");lt?zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.ZERO_TO_ONE_EXT):zt.clipControlEXT(zt.LOWER_LEFT_EXT,zt.NEGATIVE_ONE_TO_ONE_EXT),bt=lt;const Zt=gt;gt=null,this.setClear(Zt)}},getReversed:function(){return bt},setTest:function(lt){lt?ut(n.DEPTH_TEST):Ut(n.DEPTH_TEST)},setMask:function(lt){At!==lt&&!G&&(n.depthMask(lt),At=lt)},setFunc:function(lt){if(bt&&(lt=bv[lt]),Nt!==lt){switch(lt){case nr:n.depthFunc(n.NEVER);break;case ir:n.depthFunc(n.ALWAYS);break;case or:n.depthFunc(n.LESS);break;case eo:n.depthFunc(n.LEQUAL);break;case sr:n.depthFunc(n.EQUAL);break;case ar:n.depthFunc(n.GEQUAL);break;case rr:n.depthFunc(n.GREATER);break;case cr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Nt=lt}},setLocked:function(lt){G=lt},setClear:function(lt){gt!==lt&&(bt&&(lt=1-lt),n.clearDepth(lt),gt=lt)},reset:function(){G=!1,At=null,Nt=null,gt=null,bt=!1}}}function o(){let G=!1,bt=null,At=null,Nt=null,gt=null,lt=null,zt=null,Zt=null,me=null;return{setTest:function(he){G||(he?ut(n.STENCIL_TEST):Ut(n.STENCIL_TEST))},setMask:function(he){bt!==he&&!G&&(n.stencilMask(he),bt=he)},setFunc:function(he,an,Qe){(At!==he||Nt!==an||gt!==Qe)&&(n.stencilFunc(he,an,Qe),At=he,Nt=an,gt=Qe)},setOp:function(he,an,Qe){(lt!==he||zt!==an||Zt!==Qe)&&(n.stencilOp(he,an,Qe),lt=he,zt=an,Zt=Qe)},setLocked:function(he){G=he},setClear:function(he){me!==he&&(n.clearStencil(he),me=he)},reset:function(){G=!1,bt=null,At=null,Nt=null,gt=null,lt=null,zt=null,Zt=null,me=null}}}const s=new e,a=new i,r=new o,c=new WeakMap,l=new WeakMap;let h={},d={},u=new WeakMap,p=[],g=null,M=!1,m=null,f=null,S=null,y=null,x=null,A=null,C=null,P=new ce(0,0,0),L=0,E=!1,b=null,D=null,F=null,V=null,q=null;const W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,N=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(N=parseFloat(/^WebGL (\d)/.exec(B)[1]),j=N>=1):B.indexOf("OpenGL ES")!==-1&&(N=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),j=N>=2);let K=null,X={};const ht=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),St=new Te().fromArray(ht),Dt=new Te().fromArray(ft);function Kt(G,bt,At,Nt){const gt=new Uint8Array(4),lt=n.createTexture();n.bindTexture(G,lt),n.texParameteri(G,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(G,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let zt=0;zt<At;zt++)G===n.TEXTURE_3D||G===n.TEXTURE_2D_ARRAY?n.texImage3D(bt,0,n.RGBA,1,1,Nt,0,n.RGBA,n.UNSIGNED_BYTE,gt):n.texImage2D(bt+zt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,gt);return lt}const rt={};rt[n.TEXTURE_2D]=Kt(n.TEXTURE_2D,n.TEXTURE_2D,1),rt[n.TEXTURE_CUBE_MAP]=Kt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),rt[n.TEXTURE_2D_ARRAY]=Kt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),rt[n.TEXTURE_3D]=Kt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),r.setClear(0),ut(n.DEPTH_TEST),a.setFunc(eo),ct(!1),Q(Rc),ut(n.CULL_FACE),mt(ri);function ut(G){h[G]!==!0&&(n.enable(G),h[G]=!0)}function Ut(G){h[G]!==!1&&(n.disable(G),h[G]=!1)}function Gt(G,bt){return d[G]!==bt?(n.bindFramebuffer(G,bt),d[G]=bt,G===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=bt),G===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=bt),!0):!1}function Bt(G,bt){let At=p,Nt=!1;if(G){At=u.get(bt),At===void 0&&(At=[],u.set(bt,At));const gt=G.textures;if(At.length!==gt.length||At[0]!==n.COLOR_ATTACHMENT0){for(let lt=0,zt=gt.length;lt<zt;lt++)At[lt]=n.COLOR_ATTACHMENT0+lt;At.length=gt.length,Nt=!0}}else At[0]!==n.BACK&&(At[0]=n.BACK,Nt=!0);Nt&&n.drawBuffers(At)}function oe(G){return g!==G?(n.useProgram(G),g=G,!0):!1}const ve={[bi]:n.FUNC_ADD,[Dd]:n.FUNC_SUBTRACT,[Ud]:n.FUNC_REVERSE_SUBTRACT};ve[Nd]=n.MIN,ve[zd]=n.MAX;const O={[Fd]:n.ZERO,[Od]:n.ONE,[Bd]:n.SRC_COLOR,[tr]:n.SRC_ALPHA,[Wd]:n.SRC_ALPHA_SATURATE,[Gd]:n.DST_COLOR,[Vd]:n.DST_ALPHA,[kd]:n.ONE_MINUS_SRC_COLOR,[er]:n.ONE_MINUS_SRC_ALPHA,[qd]:n.ONE_MINUS_DST_COLOR,[Hd]:n.ONE_MINUS_DST_ALPHA,[Xd]:n.CONSTANT_COLOR,[jd]:n.ONE_MINUS_CONSTANT_COLOR,[Yd]:n.CONSTANT_ALPHA,[Zd]:n.ONE_MINUS_CONSTANT_ALPHA};function mt(G,bt,At,Nt,gt,lt,zt,Zt,me,he){if(G===ri){M===!0&&(Ut(n.BLEND),M=!1);return}if(M===!1&&(ut(n.BLEND),M=!0),G!==Ld){if(G!==m||he!==E){if((f!==bi||x!==bi)&&(n.blendEquation(n.FUNC_ADD),f=bi,x=bi),he)switch(G){case Qi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ic:n.blendFunc(n.ONE,n.ONE);break;case Lc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Dc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case Qi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ic:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Lc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Dc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}S=null,y=null,A=null,C=null,P.set(0,0,0),L=0,m=G,E=he}return}gt=gt||bt,lt=lt||At,zt=zt||Nt,(bt!==f||gt!==x)&&(n.blendEquationSeparate(ve[bt],ve[gt]),f=bt,x=gt),(At!==S||Nt!==y||lt!==A||zt!==C)&&(n.blendFuncSeparate(O[At],O[Nt],O[lt],O[zt]),S=At,y=Nt,A=lt,C=zt),(Zt.equals(P)===!1||me!==L)&&(n.blendColor(Zt.r,Zt.g,Zt.b,me),P.copy(Zt),L=me),m=G,E=!1}function dt(G,bt){G.side===Sn?Ut(n.CULL_FACE):ut(n.CULL_FACE);let At=G.side===Ke;bt&&(At=!At),ct(At),G.blending===Qi&&G.transparent===!1?mt(ri):mt(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),s.setMask(G.colorWrite);const Nt=G.stencilWrite;r.setTest(Nt),Nt&&(r.setMask(G.stencilWriteMask),r.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),r.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),Mt(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?ut(n.SAMPLE_ALPHA_TO_COVERAGE):Ut(n.SAMPLE_ALPHA_TO_COVERAGE)}function ct(G){b!==G&&(G?n.frontFace(n.CW):n.frontFace(n.CCW),b=G)}function Q(G){G!==Rd?(ut(n.CULL_FACE),G!==D&&(G===Rc?n.cullFace(n.BACK):G===Id?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ut(n.CULL_FACE),D=G}function wt(G){G!==F&&(j&&n.lineWidth(G),F=G)}function Mt(G,bt,At){G?(ut(n.POLYGON_OFFSET_FILL),(V!==bt||q!==At)&&(n.polygonOffset(bt,At),V=bt,q=At)):Ut(n.POLYGON_OFFSET_FILL)}function Tt(G){G?ut(n.SCISSOR_TEST):Ut(n.SCISSOR_TEST)}function Yt(G){G===void 0&&(G=n.TEXTURE0+W-1),K!==G&&(n.activeTexture(G),K=G)}function Jt(G,bt,At){At===void 0&&(K===null?At=n.TEXTURE0+W-1:At=K);let Nt=X[At];Nt===void 0&&(Nt={type:void 0,texture:void 0},X[At]=Nt),(Nt.type!==G||Nt.texture!==bt)&&(K!==At&&(n.activeTexture(At),K=At),n.bindTexture(G,bt||rt[G]),Nt.type=G,Nt.texture=bt)}function U(){const G=X[K];G!==void 0&&G.type!==void 0&&(n.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function $(){try{n.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function nt(){try{n.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function pt(){try{n.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function st(){try{n.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function kt(){try{n.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Et(){try{n.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Vt(){try{n.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ht(){try{n.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function yt(){try{n.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function vt(G){St.equals(G)===!1&&(n.scissor(G.x,G.y,G.z,G.w),St.copy(G))}function Xt(G){Dt.equals(G)===!1&&(n.viewport(G.x,G.y,G.z,G.w),Dt.copy(G))}function Ot(G,bt){let At=l.get(bt);At===void 0&&(At=new WeakMap,l.set(bt,At));let Nt=At.get(G);Nt===void 0&&(Nt=n.getUniformBlockIndex(bt,G.name),At.set(G,Nt))}function Pt(G,bt){const Nt=l.get(bt).get(G);c.get(bt)!==Nt&&(n.uniformBlockBinding(bt,Nt,G.__bindingPointIndex),c.set(bt,Nt))}function jt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},K=null,X={},d={},u=new WeakMap,p=[],g=null,M=!1,m=null,f=null,S=null,y=null,x=null,A=null,C=null,P=new ce(0,0,0),L=0,E=!1,b=null,D=null,F=null,V=null,q=null,St.set(0,0,n.canvas.width,n.canvas.height),Dt.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),r.reset()}return{buffers:{color:s,depth:a,stencil:r},enable:ut,disable:Ut,bindFramebuffer:Gt,drawBuffers:Bt,useProgram:oe,setBlending:mt,setMaterial:dt,setFlipSided:ct,setCullFace:Q,setLineWidth:wt,setPolygonOffset:Mt,setScissorTest:Tt,activeTexture:Yt,bindTexture:Jt,unbindTexture:U,compressedTexImage2D:T,compressedTexImage3D:$,texImage2D:Ht,texImage3D:yt,updateUBOMapping:Ot,uniformBlockBinding:Pt,texStorage2D:Et,texStorage3D:Vt,texSubImage2D:nt,texSubImage3D:pt,compressedTexSubImage2D:st,compressedTexSubImage3D:kt,scissor:vt,viewport:Xt,reset:jt}}function wv(n,t,e,i,o,s,a){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ct,h=new WeakMap;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(U,T){return p?new OffscreenCanvas(U,T):Xs("canvas")}function M(U,T,$){let nt=1;const pt=Jt(U);if((pt.width>$||pt.height>$)&&(nt=$/Math.max(pt.width,pt.height)),nt<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const st=Math.floor(nt*pt.width),kt=Math.floor(nt*pt.height);d===void 0&&(d=g(st,kt));const Et=T?g(st,kt):d;return Et.width=st,Et.height=kt,Et.getContext("2d").drawImage(U,0,0,st,kt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+pt.width+"x"+pt.height+") to ("+st+"x"+kt+")."),Et}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+pt.width+"x"+pt.height+")."),U;return U}function m(U){return U.generateMipmaps}function f(U){n.generateMipmap(U)}function S(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(U,T,$,nt,pt=!1){if(U!==null){if(n[U]!==void 0)return n[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let st=T;if(T===n.RED&&($===n.FLOAT&&(st=n.R32F),$===n.HALF_FLOAT&&(st=n.R16F),$===n.UNSIGNED_BYTE&&(st=n.R8)),T===n.RED_INTEGER&&($===n.UNSIGNED_BYTE&&(st=n.R8UI),$===n.UNSIGNED_SHORT&&(st=n.R16UI),$===n.UNSIGNED_INT&&(st=n.R32UI),$===n.BYTE&&(st=n.R8I),$===n.SHORT&&(st=n.R16I),$===n.INT&&(st=n.R32I)),T===n.RG&&($===n.FLOAT&&(st=n.RG32F),$===n.HALF_FLOAT&&(st=n.RG16F),$===n.UNSIGNED_BYTE&&(st=n.RG8)),T===n.RG_INTEGER&&($===n.UNSIGNED_BYTE&&(st=n.RG8UI),$===n.UNSIGNED_SHORT&&(st=n.RG16UI),$===n.UNSIGNED_INT&&(st=n.RG32UI),$===n.BYTE&&(st=n.RG8I),$===n.SHORT&&(st=n.RG16I),$===n.INT&&(st=n.RG32I)),T===n.RGB_INTEGER&&($===n.UNSIGNED_BYTE&&(st=n.RGB8UI),$===n.UNSIGNED_SHORT&&(st=n.RGB16UI),$===n.UNSIGNED_INT&&(st=n.RGB32UI),$===n.BYTE&&(st=n.RGB8I),$===n.SHORT&&(st=n.RGB16I),$===n.INT&&(st=n.RGB32I)),T===n.RGBA_INTEGER&&($===n.UNSIGNED_BYTE&&(st=n.RGBA8UI),$===n.UNSIGNED_SHORT&&(st=n.RGBA16UI),$===n.UNSIGNED_INT&&(st=n.RGBA32UI),$===n.BYTE&&(st=n.RGBA8I),$===n.SHORT&&(st=n.RGBA16I),$===n.INT&&(st=n.RGBA32I)),T===n.RGB&&($===n.UNSIGNED_INT_5_9_9_9_REV&&(st=n.RGB9_E5),$===n.UNSIGNED_INT_10F_11F_11F_REV&&(st=n.R11F_G11F_B10F)),T===n.RGBA){const kt=pt?qs:fe.getTransfer(nt);$===n.FLOAT&&(st=n.RGBA32F),$===n.HALF_FLOAT&&(st=n.RGBA16F),$===n.UNSIGNED_BYTE&&(st=kt===Me?n.SRGB8_ALPHA8:n.RGBA8),$===n.UNSIGNED_SHORT_4_4_4_4&&(st=n.RGBA4),$===n.UNSIGNED_SHORT_5_5_5_1&&(st=n.RGB5_A1)}return(st===n.R16F||st===n.R32F||st===n.RG16F||st===n.RG32F||st===n.RGBA16F||st===n.RGBA32F)&&t.get("EXT_color_buffer_float"),st}function x(U,T){let $;return U?T===null||T===Ai||T===Do?$=n.DEPTH24_STENCIL8:T===Gn?$=n.DEPTH32F_STENCIL8:T===Lo&&($=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Ai||T===Do?$=n.DEPTH_COMPONENT24:T===Gn?$=n.DEPTH_COMPONENT32F:T===Lo&&($=n.DEPTH_COMPONENT16),$}function A(U,T){return m(U)===!0||U.isFramebufferTexture&&U.minFilter!==Ye&&U.minFilter!==Pn?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function C(U){const T=U.target;T.removeEventListener("dispose",C),L(T),T.isVideoTexture&&h.delete(T)}function P(U){const T=U.target;T.removeEventListener("dispose",P),b(T)}function L(U){const T=i.get(U);if(T.__webglInit===void 0)return;const $=U.source,nt=u.get($);if(nt){const pt=nt[T.__cacheKey];pt.usedTimes--,pt.usedTimes===0&&E(U),Object.keys(nt).length===0&&u.delete($)}i.remove(U)}function E(U){const T=i.get(U);n.deleteTexture(T.__webglTexture);const $=U.source,nt=u.get($);delete nt[T.__cacheKey],a.memory.textures--}function b(U){const T=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let nt=0;nt<6;nt++){if(Array.isArray(T.__webglFramebuffer[nt]))for(let pt=0;pt<T.__webglFramebuffer[nt].length;pt++)n.deleteFramebuffer(T.__webglFramebuffer[nt][pt]);else n.deleteFramebuffer(T.__webglFramebuffer[nt]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[nt])}else{if(Array.isArray(T.__webglFramebuffer))for(let nt=0;nt<T.__webglFramebuffer.length;nt++)n.deleteFramebuffer(T.__webglFramebuffer[nt]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let nt=0;nt<T.__webglColorRenderbuffer.length;nt++)T.__webglColorRenderbuffer[nt]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[nt]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const $=U.textures;for(let nt=0,pt=$.length;nt<pt;nt++){const st=i.get($[nt]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),a.memory.textures--),i.remove($[nt])}i.remove(U)}let D=0;function F(){D=0}function V(){const U=D;return U>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+o.maxTextures),D+=1,U}function q(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function W(U,T){const $=i.get(U);if(U.isVideoTexture&&Tt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&$.__version!==U.version){const nt=U.image;if(nt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(nt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{rt($,U,T);return}}else U.isExternalTexture&&($.__webglTexture=U.sourceTexture?U.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,$.__webglTexture,n.TEXTURE0+T)}function j(U,T){const $=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&$.__version!==U.version){rt($,U,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,$.__webglTexture,n.TEXTURE0+T)}function N(U,T){const $=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&$.__version!==U.version){rt($,U,T);return}e.bindTexture(n.TEXTURE_3D,$.__webglTexture,n.TEXTURE0+T)}function B(U,T){const $=i.get(U);if(U.version>0&&$.__version!==U.version){ut($,U,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture,n.TEXTURE0+T)}const K={[dr]:n.REPEAT,[wi]:n.CLAMP_TO_EDGE,[ur]:n.MIRRORED_REPEAT},X={[Ye]:n.NEAREST,[su]:n.NEAREST_MIPMAP_NEAREST,[is]:n.NEAREST_MIPMAP_LINEAR,[Pn]:n.LINEAR,[ca]:n.LINEAR_MIPMAP_NEAREST,[Ei]:n.LINEAR_MIPMAP_LINEAR},ht={[lu]:n.NEVER,[mu]:n.ALWAYS,[hu]:n.LESS,[Th]:n.LEQUAL,[du]:n.EQUAL,[pu]:n.GEQUAL,[uu]:n.GREATER,[fu]:n.NOTEQUAL};function ft(U,T){if(T.type===Gn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Pn||T.magFilter===ca||T.magFilter===is||T.magFilter===Ei||T.minFilter===Pn||T.minFilter===ca||T.minFilter===is||T.minFilter===Ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,K[T.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,K[T.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,K[T.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,X[T.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,X[T.minFilter]),T.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,ht[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Ye||T.minFilter!==is&&T.minFilter!==Ei||T.type===Gn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const $=t.get("EXT_texture_filter_anisotropic");n.texParameterf(U,$.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,o.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function St(U,T){let $=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",C));const nt=T.source;let pt=u.get(nt);pt===void 0&&(pt={},u.set(nt,pt));const st=q(T);if(st!==U.__cacheKey){pt[st]===void 0&&(pt[st]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,$=!0),pt[st].usedTimes++;const kt=pt[U.__cacheKey];kt!==void 0&&(pt[U.__cacheKey].usedTimes--,kt.usedTimes===0&&E(T)),U.__cacheKey=st,U.__webglTexture=pt[st].texture}return $}function Dt(U,T,$){return Math.floor(Math.floor(U/$)/T)}function Kt(U,T,$,nt){const st=U.updateRanges;if(st.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,$,nt,T.data);else{st.sort((yt,vt)=>yt.start-vt.start);let kt=0;for(let yt=1;yt<st.length;yt++){const vt=st[kt],Xt=st[yt],Ot=vt.start+vt.count,Pt=Dt(Xt.start,T.width,4),jt=Dt(vt.start,T.width,4);Xt.start<=Ot+1&&Pt===jt&&Dt(Xt.start+Xt.count-1,T.width,4)===Pt?vt.count=Math.max(vt.count,Xt.start+Xt.count-vt.start):(++kt,st[kt]=Xt)}st.length=kt+1;const Et=n.getParameter(n.UNPACK_ROW_LENGTH),Vt=n.getParameter(n.UNPACK_SKIP_PIXELS),Ht=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let yt=0,vt=st.length;yt<vt;yt++){const Xt=st[yt],Ot=Math.floor(Xt.start/4),Pt=Math.ceil(Xt.count/4),jt=Ot%T.width,G=Math.floor(Ot/T.width),bt=Pt,At=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,jt),n.pixelStorei(n.UNPACK_SKIP_ROWS,G),e.texSubImage2D(n.TEXTURE_2D,0,jt,G,bt,At,$,nt,T.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Et),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Vt),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ht)}}function rt(U,T,$){let nt=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(nt=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(nt=n.TEXTURE_3D);const pt=St(U,T),st=T.source;e.bindTexture(nt,U.__webglTexture,n.TEXTURE0+$);const kt=i.get(st);if(st.version!==kt.__version||pt===!0){e.activeTexture(n.TEXTURE0+$);const Et=fe.getPrimaries(fe.workingColorSpace),Vt=T.colorSpace===si?null:fe.getPrimaries(T.colorSpace),Ht=T.colorSpace===si||Et===Vt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ht);let yt=M(T.image,!1,o.maxTextureSize);yt=Yt(T,yt);const vt=s.convert(T.format,T.colorSpace),Xt=s.convert(T.type);let Ot=y(T.internalFormat,vt,Xt,T.colorSpace,T.isVideoTexture);ft(nt,T);let Pt;const jt=T.mipmaps,G=T.isVideoTexture!==!0,bt=kt.__version===void 0||pt===!0,At=st.dataReady,Nt=A(T,yt);if(T.isDepthTexture)Ot=x(T.format===No,T.type),bt&&(G?e.texStorage2D(n.TEXTURE_2D,1,Ot,yt.width,yt.height):e.texImage2D(n.TEXTURE_2D,0,Ot,yt.width,yt.height,0,vt,Xt,null));else if(T.isDataTexture)if(jt.length>0){G&&bt&&e.texStorage2D(n.TEXTURE_2D,Nt,Ot,jt[0].width,jt[0].height);for(let gt=0,lt=jt.length;gt<lt;gt++)Pt=jt[gt],G?At&&e.texSubImage2D(n.TEXTURE_2D,gt,0,0,Pt.width,Pt.height,vt,Xt,Pt.data):e.texImage2D(n.TEXTURE_2D,gt,Ot,Pt.width,Pt.height,0,vt,Xt,Pt.data);T.generateMipmaps=!1}else G?(bt&&e.texStorage2D(n.TEXTURE_2D,Nt,Ot,yt.width,yt.height),At&&Kt(T,yt,vt,Xt)):e.texImage2D(n.TEXTURE_2D,0,Ot,yt.width,yt.height,0,vt,Xt,yt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){G&&bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Nt,Ot,jt[0].width,jt[0].height,yt.depth);for(let gt=0,lt=jt.length;gt<lt;gt++)if(Pt=jt[gt],T.format!==Tn)if(vt!==null)if(G){if(At)if(T.layerUpdates.size>0){const zt=ul(Pt.width,Pt.height,T.format,T.type);for(const Zt of T.layerUpdates){const me=Pt.data.subarray(Zt*zt/Pt.data.BYTES_PER_ELEMENT,(Zt+1)*zt/Pt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,gt,0,0,Zt,Pt.width,Pt.height,1,vt,me)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,gt,0,0,0,Pt.width,Pt.height,yt.depth,vt,Pt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,gt,Ot,Pt.width,Pt.height,yt.depth,0,Pt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?At&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,gt,0,0,0,Pt.width,Pt.height,yt.depth,vt,Xt,Pt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,gt,Ot,Pt.width,Pt.height,yt.depth,0,vt,Xt,Pt.data)}else{G&&bt&&e.texStorage2D(n.TEXTURE_2D,Nt,Ot,jt[0].width,jt[0].height);for(let gt=0,lt=jt.length;gt<lt;gt++)Pt=jt[gt],T.format!==Tn?vt!==null?G?At&&e.compressedTexSubImage2D(n.TEXTURE_2D,gt,0,0,Pt.width,Pt.height,vt,Pt.data):e.compressedTexImage2D(n.TEXTURE_2D,gt,Ot,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?At&&e.texSubImage2D(n.TEXTURE_2D,gt,0,0,Pt.width,Pt.height,vt,Xt,Pt.data):e.texImage2D(n.TEXTURE_2D,gt,Ot,Pt.width,Pt.height,0,vt,Xt,Pt.data)}else if(T.isDataArrayTexture)if(G){if(bt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Nt,Ot,yt.width,yt.height,yt.depth),At)if(T.layerUpdates.size>0){const gt=ul(yt.width,yt.height,T.format,T.type);for(const lt of T.layerUpdates){const zt=yt.data.subarray(lt*gt/yt.data.BYTES_PER_ELEMENT,(lt+1)*gt/yt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,yt.width,yt.height,1,vt,Xt,zt)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,yt.width,yt.height,yt.depth,vt,Xt,yt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Ot,yt.width,yt.height,yt.depth,0,vt,Xt,yt.data);else if(T.isData3DTexture)G?(bt&&e.texStorage3D(n.TEXTURE_3D,Nt,Ot,yt.width,yt.height,yt.depth),At&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,yt.width,yt.height,yt.depth,vt,Xt,yt.data)):e.texImage3D(n.TEXTURE_3D,0,Ot,yt.width,yt.height,yt.depth,0,vt,Xt,yt.data);else if(T.isFramebufferTexture){if(bt)if(G)e.texStorage2D(n.TEXTURE_2D,Nt,Ot,yt.width,yt.height);else{let gt=yt.width,lt=yt.height;for(let zt=0;zt<Nt;zt++)e.texImage2D(n.TEXTURE_2D,zt,Ot,gt,lt,0,vt,Xt,null),gt>>=1,lt>>=1}}else if(jt.length>0){if(G&&bt){const gt=Jt(jt[0]);e.texStorage2D(n.TEXTURE_2D,Nt,Ot,gt.width,gt.height)}for(let gt=0,lt=jt.length;gt<lt;gt++)Pt=jt[gt],G?At&&e.texSubImage2D(n.TEXTURE_2D,gt,0,0,vt,Xt,Pt):e.texImage2D(n.TEXTURE_2D,gt,Ot,vt,Xt,Pt);T.generateMipmaps=!1}else if(G){if(bt){const gt=Jt(yt);e.texStorage2D(n.TEXTURE_2D,Nt,Ot,gt.width,gt.height)}At&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,vt,Xt,yt)}else e.texImage2D(n.TEXTURE_2D,0,Ot,vt,Xt,yt);m(T)&&f(nt),kt.__version=st.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function ut(U,T,$){if(T.image.length!==6)return;const nt=St(U,T),pt=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+$);const st=i.get(pt);if(pt.version!==st.__version||nt===!0){e.activeTexture(n.TEXTURE0+$);const kt=fe.getPrimaries(fe.workingColorSpace),Et=T.colorSpace===si?null:fe.getPrimaries(T.colorSpace),Vt=T.colorSpace===si||kt===Et?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Vt);const Ht=T.isCompressedTexture||T.image[0].isCompressedTexture,yt=T.image[0]&&T.image[0].isDataTexture,vt=[];for(let lt=0;lt<6;lt++)!Ht&&!yt?vt[lt]=M(T.image[lt],!0,o.maxCubemapSize):vt[lt]=yt?T.image[lt].image:T.image[lt],vt[lt]=Yt(T,vt[lt]);const Xt=vt[0],Ot=s.convert(T.format,T.colorSpace),Pt=s.convert(T.type),jt=y(T.internalFormat,Ot,Pt,T.colorSpace),G=T.isVideoTexture!==!0,bt=st.__version===void 0||nt===!0,At=pt.dataReady;let Nt=A(T,Xt);ft(n.TEXTURE_CUBE_MAP,T);let gt;if(Ht){G&&bt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Nt,jt,Xt.width,Xt.height);for(let lt=0;lt<6;lt++){gt=vt[lt].mipmaps;for(let zt=0;zt<gt.length;zt++){const Zt=gt[zt];T.format!==Tn?Ot!==null?G?At&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt,0,0,Zt.width,Zt.height,Ot,Zt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt,jt,Zt.width,Zt.height,0,Zt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?At&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt,0,0,Zt.width,Zt.height,Ot,Pt,Zt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt,jt,Zt.width,Zt.height,0,Ot,Pt,Zt.data)}}}else{if(gt=T.mipmaps,G&&bt){gt.length>0&&Nt++;const lt=Jt(vt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Nt,jt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(yt){G?At&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,vt[lt].width,vt[lt].height,Ot,Pt,vt[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,jt,vt[lt].width,vt[lt].height,0,Ot,Pt,vt[lt].data);for(let zt=0;zt<gt.length;zt++){const me=gt[zt].image[lt].image;G?At&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt+1,0,0,me.width,me.height,Ot,Pt,me.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt+1,jt,me.width,me.height,0,Ot,Pt,me.data)}}else{G?At&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Ot,Pt,vt[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,jt,Ot,Pt,vt[lt]);for(let zt=0;zt<gt.length;zt++){const Zt=gt[zt];G?At&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt+1,0,0,Ot,Pt,Zt.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,zt+1,jt,Ot,Pt,Zt.image[lt])}}}m(T)&&f(n.TEXTURE_CUBE_MAP),st.__version=pt.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function Ut(U,T,$,nt,pt,st){const kt=s.convert($.format,$.colorSpace),Et=s.convert($.type),Vt=y($.internalFormat,kt,Et,$.colorSpace),Ht=i.get(T),yt=i.get($);if(yt.__renderTarget=T,!Ht.__hasExternalTextures){const vt=Math.max(1,T.width>>st),Xt=Math.max(1,T.height>>st);pt===n.TEXTURE_3D||pt===n.TEXTURE_2D_ARRAY?e.texImage3D(pt,st,Vt,vt,Xt,T.depth,0,kt,Et,null):e.texImage2D(pt,st,Vt,vt,Xt,0,kt,Et,null)}e.bindFramebuffer(n.FRAMEBUFFER,U),Mt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,nt,pt,yt.__webglTexture,0,wt(T)):(pt===n.TEXTURE_2D||pt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&pt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,nt,pt,yt.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Gt(U,T,$){if(n.bindRenderbuffer(n.RENDERBUFFER,U),T.depthBuffer){const nt=T.depthTexture,pt=nt&&nt.isDepthTexture?nt.type:null,st=x(T.stencilBuffer,pt),kt=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Et=wt(T);Mt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Et,st,T.width,T.height):$?n.renderbufferStorageMultisample(n.RENDERBUFFER,Et,st,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,st,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,kt,n.RENDERBUFFER,U)}else{const nt=T.textures;for(let pt=0;pt<nt.length;pt++){const st=nt[pt],kt=s.convert(st.format,st.colorSpace),Et=s.convert(st.type),Vt=y(st.internalFormat,kt,Et,st.colorSpace),Ht=wt(T);$&&Mt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ht,Vt,T.width,T.height):Mt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ht,Vt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Vt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Bt(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const nt=i.get(T.depthTexture);nt.__renderTarget=T,(!nt.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),W(T.depthTexture,0);const pt=nt.__webglTexture,st=wt(T);if(T.depthTexture.format===Uo)Mt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,pt,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,pt,0);else if(T.depthTexture.format===No)Mt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,pt,0,st):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,pt,0);else throw new Error("Unknown depthTexture format")}function oe(U){const T=i.get(U),$=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const nt=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),nt){const pt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,nt.removeEventListener("dispose",pt)};nt.addEventListener("dispose",pt),T.__depthDisposeCallback=pt}T.__boundDepthTexture=nt}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if($)throw new Error("target.depthTexture not supported in Cube render targets");const nt=U.texture.mipmaps;nt&&nt.length>0?Bt(T.__webglFramebuffer[0],U):Bt(T.__webglFramebuffer,U)}else if($){T.__webglDepthbuffer=[];for(let nt=0;nt<6;nt++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[nt]),T.__webglDepthbuffer[nt]===void 0)T.__webglDepthbuffer[nt]=n.createRenderbuffer(),Gt(T.__webglDepthbuffer[nt],U,!1);else{const pt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=T.__webglDepthbuffer[nt];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,pt,n.RENDERBUFFER,st)}}else{const nt=U.texture.mipmaps;if(nt&&nt.length>0?e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),Gt(T.__webglDepthbuffer,U,!1);else{const pt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,pt,n.RENDERBUFFER,st)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function ve(U,T,$){const nt=i.get(U);T!==void 0&&Ut(nt.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),$!==void 0&&oe(U)}function O(U){const T=U.texture,$=i.get(U),nt=i.get(T);U.addEventListener("dispose",P);const pt=U.textures,st=U.isWebGLCubeRenderTarget===!0,kt=pt.length>1;if(kt||(nt.__webglTexture===void 0&&(nt.__webglTexture=n.createTexture()),nt.__version=T.version,a.memory.textures++),st){$.__webglFramebuffer=[];for(let Et=0;Et<6;Et++)if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer[Et]=[];for(let Vt=0;Vt<T.mipmaps.length;Vt++)$.__webglFramebuffer[Et][Vt]=n.createFramebuffer()}else $.__webglFramebuffer[Et]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){$.__webglFramebuffer=[];for(let Et=0;Et<T.mipmaps.length;Et++)$.__webglFramebuffer[Et]=n.createFramebuffer()}else $.__webglFramebuffer=n.createFramebuffer();if(kt)for(let Et=0,Vt=pt.length;Et<Vt;Et++){const Ht=i.get(pt[Et]);Ht.__webglTexture===void 0&&(Ht.__webglTexture=n.createTexture(),a.memory.textures++)}if(U.samples>0&&Mt(U)===!1){$.__webglMultisampledFramebuffer=n.createFramebuffer(),$.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,$.__webglMultisampledFramebuffer);for(let Et=0;Et<pt.length;Et++){const Vt=pt[Et];$.__webglColorRenderbuffer[Et]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,$.__webglColorRenderbuffer[Et]);const Ht=s.convert(Vt.format,Vt.colorSpace),yt=s.convert(Vt.type),vt=y(Vt.internalFormat,Ht,yt,Vt.colorSpace,U.isXRRenderTarget===!0),Xt=wt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,Xt,vt,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Et,n.RENDERBUFFER,$.__webglColorRenderbuffer[Et])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&($.__webglDepthRenderbuffer=n.createRenderbuffer(),Gt($.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,nt.__webglTexture),ft(n.TEXTURE_CUBE_MAP,T);for(let Et=0;Et<6;Et++)if(T.mipmaps&&T.mipmaps.length>0)for(let Vt=0;Vt<T.mipmaps.length;Vt++)Ut($.__webglFramebuffer[Et][Vt],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,Vt);else Ut($.__webglFramebuffer[Et],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0);m(T)&&f(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(kt){for(let Et=0,Vt=pt.length;Et<Vt;Et++){const Ht=pt[Et],yt=i.get(Ht);let vt=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(vt=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(vt,yt.__webglTexture),ft(vt,Ht),Ut($.__webglFramebuffer,U,Ht,n.COLOR_ATTACHMENT0+Et,vt,0),m(Ht)&&f(vt)}e.unbindTexture()}else{let Et=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Et=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Et,nt.__webglTexture),ft(Et,T),T.mipmaps&&T.mipmaps.length>0)for(let Vt=0;Vt<T.mipmaps.length;Vt++)Ut($.__webglFramebuffer[Vt],U,T,n.COLOR_ATTACHMENT0,Et,Vt);else Ut($.__webglFramebuffer,U,T,n.COLOR_ATTACHMENT0,Et,0);m(T)&&f(Et),e.unbindTexture()}U.depthBuffer&&oe(U)}function mt(U){const T=U.textures;for(let $=0,nt=T.length;$<nt;$++){const pt=T[$];if(m(pt)){const st=S(U),kt=i.get(pt).__webglTexture;e.bindTexture(st,kt),f(st),e.unbindTexture()}}}const dt=[],ct=[];function Q(U){if(U.samples>0){if(Mt(U)===!1){const T=U.textures,$=U.width,nt=U.height;let pt=n.COLOR_BUFFER_BIT;const st=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,kt=i.get(U),Et=T.length>1;if(Et)for(let Ht=0;Ht<T.length;Ht++)e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,kt.__webglMultisampledFramebuffer);const Vt=U.texture.mipmaps;Vt&&Vt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglFramebuffer);for(let Ht=0;Ht<T.length;Ht++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(pt|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(pt|=n.STENCIL_BUFFER_BIT)),Et){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,kt.__webglColorRenderbuffer[Ht]);const yt=i.get(T[Ht]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,yt,0)}n.blitFramebuffer(0,0,$,nt,0,0,$,nt,pt,n.NEAREST),c===!0&&(dt.length=0,ct.length=0,dt.push(n.COLOR_ATTACHMENT0+Ht),U.depthBuffer&&U.resolveDepthBuffer===!1&&(dt.push(st),ct.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ct)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,dt))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Et)for(let Ht=0;Ht<T.length;Ht++){e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.RENDERBUFFER,kt.__webglColorRenderbuffer[Ht]);const yt=i.get(T[Ht]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,kt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ht,n.TEXTURE_2D,yt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,kt.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const T=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function wt(U){return Math.min(o.maxSamples,U.samples)}function Mt(U){const T=i.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Tt(U){const T=a.render.frame;h.get(U)!==T&&(h.set(U,T),U.update())}function Yt(U,T){const $=U.colorSpace,nt=U.format,pt=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||$!==oo&&$!==si&&(fe.getTransfer($)===Me?(nt!==Tn||pt!==Un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",$)),T}function Jt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=V,this.resetTextureUnits=F,this.setTexture2D=W,this.setTexture2DArray=j,this.setTexture3D=N,this.setTextureCube=B,this.rebindTextures=ve,this.setupRenderTarget=O,this.updateRenderTargetMipmap=mt,this.updateMultisampleRenderTarget=Q,this.setupDepthRenderbuffer=oe,this.setupFrameBufferTexture=Ut,this.useMultisampledRTT=Mt}function Ev(n,t){function e(i,o=si){let s;const a=fe.getTransfer(o);if(i===Un)return n.UNSIGNED_BYTE;if(i===dc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===uc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===xh)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===yh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===_h)return n.BYTE;if(i===Mh)return n.SHORT;if(i===Lo)return n.UNSIGNED_SHORT;if(i===hc)return n.INT;if(i===Ai)return n.UNSIGNED_INT;if(i===Gn)return n.FLOAT;if(i===qo)return n.HALF_FLOAT;if(i===bh)return n.ALPHA;if(i===Sh)return n.RGB;if(i===Tn)return n.RGBA;if(i===Uo)return n.DEPTH_COMPONENT;if(i===No)return n.DEPTH_STENCIL;if(i===fc)return n.RED;if(i===pc)return n.RED_INTEGER;if(i===wh)return n.RG;if(i===mc)return n.RG_INTEGER;if(i===gc)return n.RGBA_INTEGER;if(i===Us||i===Ns||i===zs||i===Fs)if(a===Me)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Us)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ns)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===zs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Fs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Us)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ns)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===zs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Fs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===fr||i===pr||i===mr||i===gr)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===fr)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pr)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===mr)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gr)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===vr||i===_r||i===Mr)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===vr||i===_r)return a===Me?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Mr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===xr||i===yr||i===br||i===Sr||i===wr||i===Er||i===Tr||i===Ar||i===Cr||i===Pr||i===Rr||i===Ir||i===Lr||i===Dr)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===xr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===yr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===br)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Sr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Er)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Tr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ar)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Cr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Pr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Rr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ir)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Lr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Dr)return a===Me?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Ur||i===Nr||i===zr)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Ur)return a===Me?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Nr)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===zr)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Fr||i===Or||i===Br||i===kr)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Fr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Or)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Br)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===kr)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Do?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const Tv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Av=`
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

}`;class Cv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new kh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new li({vertexShader:Tv,fragmentShader:Av,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new v(new ze(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Pv extends ro{constructor(t,e){super();const i=this;let o=null,s=1,a=null,r="local-floor",c=1,l=null,h=null,d=null,u=null,p=null,g=null;const M=typeof XRWebGLBinding<"u",m=new Cv,f={},S=e.getContextAttributes();let y=null,x=null;const A=[],C=[],P=new Ct;let L=null;const E=new sn;E.viewport=new Te;const b=new sn;b.viewport=new Te;const D=[E,b],F=new Zf;let V=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(rt){let ut=A[rt];return ut===void 0&&(ut=new Pa,A[rt]=ut),ut.getTargetRaySpace()},this.getControllerGrip=function(rt){let ut=A[rt];return ut===void 0&&(ut=new Pa,A[rt]=ut),ut.getGripSpace()},this.getHand=function(rt){let ut=A[rt];return ut===void 0&&(ut=new Pa,A[rt]=ut),ut.getHandSpace()};function W(rt){const ut=C.indexOf(rt.inputSource);if(ut===-1)return;const Ut=A[ut];Ut!==void 0&&(Ut.update(rt.inputSource,rt.frame,l||a),Ut.dispatchEvent({type:rt.type,data:rt.inputSource}))}function j(){o.removeEventListener("select",W),o.removeEventListener("selectstart",W),o.removeEventListener("selectend",W),o.removeEventListener("squeeze",W),o.removeEventListener("squeezestart",W),o.removeEventListener("squeezeend",W),o.removeEventListener("end",j),o.removeEventListener("inputsourceschange",N);for(let rt=0;rt<A.length;rt++){const ut=C[rt];ut!==null&&(C[rt]=null,A[rt].disconnect(ut))}V=null,q=null,m.reset();for(const rt in f)delete f[rt];t.setRenderTarget(y),p=null,u=null,d=null,o=null,x=null,Kt.stop(),i.isPresenting=!1,t.setPixelRatio(L),t.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(rt){s=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(rt){r=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(rt){l=rt},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d===null&&M&&(d=new XRWebGLBinding(o,e)),d},this.getFrame=function(){return g},this.getSession=function(){return o},this.setSession=async function(rt){if(o=rt,o!==null){if(y=t.getRenderTarget(),o.addEventListener("select",W),o.addEventListener("selectstart",W),o.addEventListener("selectend",W),o.addEventListener("squeeze",W),o.addEventListener("squeezestart",W),o.addEventListener("squeezeend",W),o.addEventListener("end",j),o.addEventListener("inputsourceschange",N),S.xrCompatible!==!0&&await e.makeXRCompatible(),L=t.getPixelRatio(),t.getSize(P),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ut=null,Gt=null,Bt=null;S.depth&&(Bt=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Ut=S.stencil?No:Uo,Gt=S.stencil?Do:Ai);const oe={colorFormat:e.RGBA8,depthFormat:Bt,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(oe),o.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),x=new Ci(u.textureWidth,u.textureHeight,{format:Tn,type:Un,depthTexture:new Bh(u.textureWidth,u.textureHeight,Gt,void 0,void 0,void 0,void 0,void 0,void 0,Ut),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const Ut={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(o,e,Ut),o.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Ci(p.framebufferWidth,p.framebufferHeight,{format:Tn,type:Un,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await o.requestReferenceSpace(r),Kt.setContext(o),Kt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function N(rt){for(let ut=0;ut<rt.removed.length;ut++){const Ut=rt.removed[ut],Gt=C.indexOf(Ut);Gt>=0&&(C[Gt]=null,A[Gt].disconnect(Ut))}for(let ut=0;ut<rt.added.length;ut++){const Ut=rt.added[ut];let Gt=C.indexOf(Ut);if(Gt===-1){for(let oe=0;oe<A.length;oe++)if(oe>=C.length){C.push(Ut),Gt=oe;break}else if(C[oe]===null){C[oe]=Ut,Gt=oe;break}if(Gt===-1)break}const Bt=A[Gt];Bt&&Bt.connect(Ut)}}const B=new z,K=new z;function X(rt,ut,Ut){B.setFromMatrixPosition(ut.matrixWorld),K.setFromMatrixPosition(Ut.matrixWorld);const Gt=B.distanceTo(K),Bt=ut.projectionMatrix.elements,oe=Ut.projectionMatrix.elements,ve=Bt[14]/(Bt[10]-1),O=Bt[14]/(Bt[10]+1),mt=(Bt[9]+1)/Bt[5],dt=(Bt[9]-1)/Bt[5],ct=(Bt[8]-1)/Bt[0],Q=(oe[8]+1)/oe[0],wt=ve*ct,Mt=ve*Q,Tt=Gt/(-ct+Q),Yt=Tt*-ct;if(ut.matrixWorld.decompose(rt.position,rt.quaternion,rt.scale),rt.translateX(Yt),rt.translateZ(Tt),rt.matrixWorld.compose(rt.position,rt.quaternion,rt.scale),rt.matrixWorldInverse.copy(rt.matrixWorld).invert(),Bt[10]===-1)rt.projectionMatrix.copy(ut.projectionMatrix),rt.projectionMatrixInverse.copy(ut.projectionMatrixInverse);else{const Jt=ve+Tt,U=O+Tt,T=wt-Yt,$=Mt+(Gt-Yt),nt=mt*O/U*Jt,pt=dt*O/U*Jt;rt.projectionMatrix.makePerspective(T,$,nt,pt,Jt,U),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert()}}function ht(rt,ut){ut===null?rt.matrixWorld.copy(rt.matrix):rt.matrixWorld.multiplyMatrices(ut.matrixWorld,rt.matrix),rt.matrixWorldInverse.copy(rt.matrixWorld).invert()}this.updateCamera=function(rt){if(o===null)return;let ut=rt.near,Ut=rt.far;m.texture!==null&&(m.depthNear>0&&(ut=m.depthNear),m.depthFar>0&&(Ut=m.depthFar)),F.near=b.near=E.near=ut,F.far=b.far=E.far=Ut,(V!==F.near||q!==F.far)&&(o.updateRenderState({depthNear:F.near,depthFar:F.far}),V=F.near,q=F.far),F.layers.mask=rt.layers.mask|6,E.layers.mask=F.layers.mask&3,b.layers.mask=F.layers.mask&5;const Gt=rt.parent,Bt=F.cameras;ht(F,Gt);for(let oe=0;oe<Bt.length;oe++)ht(Bt[oe],Gt);Bt.length===2?X(F,E,b):F.projectionMatrix.copy(E.projectionMatrix),ft(rt,F,Gt)};function ft(rt,ut,Ut){Ut===null?rt.matrix.copy(ut.matrixWorld):(rt.matrix.copy(Ut.matrixWorld),rt.matrix.invert(),rt.matrix.multiply(ut.matrixWorld)),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.updateMatrixWorld(!0),rt.projectionMatrix.copy(ut.projectionMatrix),rt.projectionMatrixInverse.copy(ut.projectionMatrixInverse),rt.isPerspectiveCamera&&(rt.fov=zo*2*Math.atan(1/rt.projectionMatrix.elements[5]),rt.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(u===null&&p===null))return c},this.setFoveation=function(rt){c=rt,u!==null&&(u.fixedFoveation=rt),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=rt)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(rt){return f[rt]};let St=null;function Dt(rt,ut){if(h=ut.getViewerPose(l||a),g=ut,h!==null){const Ut=h.views;p!==null&&(t.setRenderTargetFramebuffer(x,p.framebuffer),t.setRenderTarget(x));let Gt=!1;Ut.length!==F.cameras.length&&(F.cameras.length=0,Gt=!0);for(let O=0;O<Ut.length;O++){const mt=Ut[O];let dt=null;if(p!==null)dt=p.getViewport(mt);else{const Q=d.getViewSubImage(u,mt);dt=Q.viewport,O===0&&(t.setRenderTargetTextures(x,Q.colorTexture,Q.depthStencilTexture),t.setRenderTarget(x))}let ct=D[O];ct===void 0&&(ct=new sn,ct.layers.enable(O),ct.viewport=new Te,D[O]=ct),ct.matrix.fromArray(mt.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(mt.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(dt.x,dt.y,dt.width,dt.height),O===0&&(F.matrix.copy(ct.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Gt===!0&&F.cameras.push(ct)}const Bt=o.enabledFeatures;if(Bt&&Bt.includes("depth-sensing")&&o.depthUsage=="gpu-optimized"&&M){d=i.getBinding();const O=d.getDepthInformation(Ut[0]);O&&O.isValid&&O.texture&&m.init(O,o.renderState)}if(Bt&&Bt.includes("camera-access")&&M){t.state.unbindTexture(),d=i.getBinding();for(let O=0;O<Ut.length;O++){const mt=Ut[O].camera;if(mt){let dt=f[mt];dt||(dt=new kh,f[mt]=dt);const ct=d.getCameraImage(mt);dt.sourceTexture=ct}}}}for(let Ut=0;Ut<A.length;Ut++){const Gt=C[Ut],Bt=A[Ut];Gt!==null&&Bt!==void 0&&Bt.update(Gt,ut,l||a)}St&&St(rt,ut),ut.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ut}),g=null}const Kt=new Kh;Kt.setAnimationLoop(Dt),this.setAnimationLoop=function(rt){St=rt},this.dispose=function(){}}}const _i=new Yn,Rv=new Ee;function Iv(n,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Uh(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function o(m,f,S,y,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(m,f):f.isMeshToonMaterial?(s(m,f),d(m,f)):f.isMeshPhongMaterial?(s(m,f),h(m,f)):f.isMeshStandardMaterial?(s(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(s(m,f),g(m,f)):f.isMeshDepthMaterial?s(m,f):f.isMeshDistanceMaterial?(s(m,f),M(m,f)):f.isMeshNormalMaterial?s(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&r(m,f)):f.isPointsMaterial?c(m,f,S,y):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ke&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ke&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const S=t.get(f),y=S.envMap,x=S.envMapRotation;y&&(m.envMap.value=y,_i.copy(x),_i.x*=-1,_i.y*=-1,_i.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),m.envMapRotation.value.setFromMatrix4(Rv.makeRotationFromEuler(_i)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function r(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,S,y){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*S,m.scale.value=y*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,S){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ke&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function M(m,f){const S=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:o}}function Lv(n,t,e,i){let o={},s={},a=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,y){const x=y.program;i.uniformBlockBinding(S,x)}function l(S,y){let x=o[S.id];x===void 0&&(g(S),x=h(S),o[S.id]=x,S.addEventListener("dispose",m));const A=y.program;i.updateUBOMapping(S,A);const C=t.render.frame;s[S.id]!==C&&(u(S),s[S.id]=C)}function h(S){const y=d();S.__bindingPointIndex=y;const x=n.createBuffer(),A=S.__size,C=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,A,C),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,x),x}function d(){for(let S=0;S<r;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){const y=o[S.id],x=S.uniforms,A=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let C=0,P=x.length;C<P;C++){const L=Array.isArray(x[C])?x[C]:[x[C]];for(let E=0,b=L.length;E<b;E++){const D=L[E];if(p(D,C,E,A)===!0){const F=D.__offset,V=Array.isArray(D.value)?D.value:[D.value];let q=0;for(let W=0;W<V.length;W++){const j=V[W],N=M(j);typeof j=="number"||typeof j=="boolean"?(D.__data[0]=j,n.bufferSubData(n.UNIFORM_BUFFER,F+q,D.__data)):j.isMatrix3?(D.__data[0]=j.elements[0],D.__data[1]=j.elements[1],D.__data[2]=j.elements[2],D.__data[3]=0,D.__data[4]=j.elements[3],D.__data[5]=j.elements[4],D.__data[6]=j.elements[5],D.__data[7]=0,D.__data[8]=j.elements[6],D.__data[9]=j.elements[7],D.__data[10]=j.elements[8],D.__data[11]=0):(j.toArray(D.__data,q),q+=N.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,F,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(S,y,x,A){const C=S.value,P=y+"_"+x;if(A[P]===void 0)return typeof C=="number"||typeof C=="boolean"?A[P]=C:A[P]=C.clone(),!0;{const L=A[P];if(typeof C=="number"||typeof C=="boolean"){if(L!==C)return A[P]=C,!0}else if(L.equals(C)===!1)return L.copy(C),!0}return!1}function g(S){const y=S.uniforms;let x=0;const A=16;for(let P=0,L=y.length;P<L;P++){const E=Array.isArray(y[P])?y[P]:[y[P]];for(let b=0,D=E.length;b<D;b++){const F=E[b],V=Array.isArray(F.value)?F.value:[F.value];for(let q=0,W=V.length;q<W;q++){const j=V[q],N=M(j),B=x%A,K=B%N.boundary,X=B+K;x+=K,X!==0&&A-X<N.storage&&(x+=A-X),F.__data=new Float32Array(N.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=x,x+=N.storage}}}const C=x%A;return C>0&&(x+=A-C),S.__size=x,S.__cache={},this}function M(S){const y={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(y.boundary=4,y.storage=4):S.isVector2?(y.boundary=8,y.storage=8):S.isVector3||S.isColor?(y.boundary=16,y.storage=12):S.isVector4?(y.boundary=16,y.storage=16):S.isMatrix3?(y.boundary=48,y.storage=48):S.isMatrix4?(y.boundary=64,y.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),y}function m(S){const y=S.target;y.removeEventListener("dispose",m);const x=a.indexOf(y.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(o[y.id]),delete o[y.id],delete s[y.id]}function f(){for(const S in o)n.deleteBuffer(o[S]);a=[],o={},s={}}return{bind:c,update:l,dispose:f}}class id{constructor(t={}){const{canvas:e=Lu(),context:i=null,depth:o=!0,stencil:s=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),M=new Int32Array(4);let m=null,f=null;const S=[],y=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ci,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let A=!1;this._outputColorSpace=on;let C=0,P=0,L=null,E=-1,b=null;const D=new Te,F=new Te;let V=null;const q=new ce(0);let W=0,j=e.width,N=e.height,B=1,K=null,X=null;const ht=new Te(0,0,j,N),ft=new Te(0,0,j,N);let St=!1;const Dt=new xc;let Kt=!1,rt=!1;const ut=new Ee,Ut=new z,Gt=new Te,Bt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let oe=!1;function ve(){return L===null?B:1}let O=i;function mt(R,Y){return e.getContext(R,Y)}try{const R={alpha:!0,depth:o,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${lc}`),e.addEventListener("webglcontextlost",At,!1),e.addEventListener("webglcontextrestored",Nt,!1),e.addEventListener("webglcontextcreationerror",gt,!1),O===null){const Y="webgl2";if(O=mt(Y,R),O===null)throw mt(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let dt,ct,Q,wt,Mt,Tt,Yt,Jt,U,T,$,nt,pt,st,kt,Et,Vt,Ht,yt,vt,Xt,Ot,Pt,jt;function G(){dt=new Gm(O),dt.init(),Ot=new Ev(O,dt),ct=new zm(O,dt,t,Ot),Q=new Sv(O,dt),ct.reversedDepthBuffer&&u&&Q.buffers.depth.setReversed(!0),wt=new Xm(O),Mt=new hv,Tt=new wv(O,dt,Q,Mt,ct,Ot,wt),Yt=new Om(x),Jt=new Hm(x),U=new Kf(O),Pt=new Um(O,U),T=new qm(O,U,wt,Pt),$=new Ym(O,T,U,wt),yt=new jm(O,ct,Tt),Et=new Fm(Mt),nt=new lv(x,Yt,Jt,dt,ct,Pt,Et),pt=new Iv(x,Mt),st=new uv,kt=new _v(dt),Ht=new Dm(x,Yt,Jt,Q,$,p,c),Vt=new yv(x,$,ct),jt=new Lv(O,wt,ct,Q),vt=new Nm(O,dt,wt),Xt=new Wm(O,dt,wt),wt.programs=nt.programs,x.capabilities=ct,x.extensions=dt,x.properties=Mt,x.renderLists=st,x.shadowMap=Vt,x.state=Q,x.info=wt}G();const bt=new Pv(x,O);this.xr=bt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const R=dt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=dt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return B},this.setPixelRatio=function(R){R!==void 0&&(B=R,this.setSize(j,N,!1))},this.getSize=function(R){return R.set(j,N)},this.setSize=function(R,Y,it=!0){if(bt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=R,N=Y,e.width=Math.floor(R*B),e.height=Math.floor(Y*B),it===!0&&(e.style.width=R+"px",e.style.height=Y+"px"),this.setViewport(0,0,R,Y)},this.getDrawingBufferSize=function(R){return R.set(j*B,N*B).floor()},this.setDrawingBufferSize=function(R,Y,it){j=R,N=Y,B=it,e.width=Math.floor(R*it),e.height=Math.floor(Y*it),this.setViewport(0,0,R,Y)},this.getCurrentViewport=function(R){return R.copy(D)},this.getViewport=function(R){return R.copy(ht)},this.setViewport=function(R,Y,it,ot){R.isVector4?ht.set(R.x,R.y,R.z,R.w):ht.set(R,Y,it,ot),Q.viewport(D.copy(ht).multiplyScalar(B).round())},this.getScissor=function(R){return R.copy(ft)},this.setScissor=function(R,Y,it,ot){R.isVector4?ft.set(R.x,R.y,R.z,R.w):ft.set(R,Y,it,ot),Q.scissor(F.copy(ft).multiplyScalar(B).round())},this.getScissorTest=function(){return St},this.setScissorTest=function(R){Q.setScissorTest(St=R)},this.setOpaqueSort=function(R){K=R},this.setTransparentSort=function(R){X=R},this.getClearColor=function(R){return R.copy(Ht.getClearColor())},this.setClearColor=function(){Ht.setClearColor(...arguments)},this.getClearAlpha=function(){return Ht.getClearAlpha()},this.setClearAlpha=function(){Ht.setClearAlpha(...arguments)},this.clear=function(R=!0,Y=!0,it=!0){let ot=0;if(R){let Z=!1;if(L!==null){const _t=L.texture.format;Z=_t===gc||_t===mc||_t===pc}if(Z){const _t=L.texture.type,It=_t===Un||_t===Ai||_t===Lo||_t===Do||_t===dc||_t===uc,Ft=Ht.getClearColor(),I=Ht.getClearAlpha(),H=Ft.r,J=Ft.g,tt=Ft.b;It?(g[0]=H,g[1]=J,g[2]=tt,g[3]=I,O.clearBufferuiv(O.COLOR,0,g)):(M[0]=H,M[1]=J,M[2]=tt,M[3]=I,O.clearBufferiv(O.COLOR,0,M))}else ot|=O.COLOR_BUFFER_BIT}Y&&(ot|=O.DEPTH_BUFFER_BIT),it&&(ot|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",At,!1),e.removeEventListener("webglcontextrestored",Nt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),Ht.dispose(),st.dispose(),kt.dispose(),Mt.dispose(),Yt.dispose(),Jt.dispose(),$.dispose(),Pt.dispose(),jt.dispose(),nt.dispose(),bt.dispose(),bt.removeEventListener("sessionstart",Qe),bt.removeEventListener("sessionend",Jo),mn.stop()};function At(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Nt(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const R=wt.autoReset,Y=Vt.enabled,it=Vt.autoUpdate,ot=Vt.needsUpdate,Z=Vt.type;G(),wt.autoReset=R,Vt.enabled=Y,Vt.autoUpdate=it,Vt.needsUpdate=ot,Vt.type=Z}function gt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function lt(R){const Y=R.target;Y.removeEventListener("dispose",lt),zt(Y)}function zt(R){Zt(R),Mt.remove(R)}function Zt(R){const Y=Mt.get(R).programs;Y!==void 0&&(Y.forEach(function(it){nt.releaseProgram(it)}),R.isShaderMaterial&&nt.releaseShaderCache(R))}this.renderBufferDirect=function(R,Y,it,ot,Z,_t){Y===null&&(Y=Bt);const It=Z.isMesh&&Z.matrixWorld.determinant()<0,Ft=es(R,Y,it,ot,Z);Q.setMaterial(ot,It);let I=it.index,H=1;if(ot.wireframe===!0){if(I=T.getWireframeAttribute(it),I===void 0)return;H=2}const J=it.drawRange,tt=it.attributes.position;let xt=J.start*H,qt=(J.start+J.count)*H;_t!==null&&(xt=Math.max(xt,_t.start*H),qt=Math.min(qt,(_t.start+_t.count)*H)),I!==null?(xt=Math.max(xt,0),qt=Math.min(qt,I.count)):tt!=null&&(xt=Math.max(xt,0),qt=Math.min(qt,tt.count));const re=qt-xt;if(re<0||re===1/0)return;Pt.setup(Z,ot,Ft,it,I);let $t,te=vt;if(I!==null&&($t=U.get(I),te=Xt,te.setIndex($t)),Z.isMesh)ot.wireframe===!0?(Q.setLineWidth(ot.wireframeLinewidth*ve()),te.setMode(O.LINES)):te.setMode(O.TRIANGLES);else if(Z.isLine){let Wt=ot.linewidth;Wt===void 0&&(Wt=1),Q.setLineWidth(Wt*ve()),Z.isLineSegments?te.setMode(O.LINES):Z.isLineLoop?te.setMode(O.LINE_LOOP):te.setMode(O.LINE_STRIP)}else Z.isPoints?te.setMode(O.POINTS):Z.isSprite&&te.setMode(O.TRIANGLES);if(Z.isBatchedMesh)if(Z._multiDrawInstances!==null)Fo("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),te.renderMultiDrawInstances(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount,Z._multiDrawInstances);else if(dt.get("WEBGL_multi_draw"))te.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const Wt=Z._multiDrawStarts,ye=Z._multiDrawCounts,de=Z._multiDrawCount,Ue=I?U.get(I).bytesPerElement:1,Jn=Mt.get(ot).currentProgram.getUniforms();for(let He=0;He<de;He++)Jn.setValue(O,"_gl_DrawID",He),te.render(Wt[He]/Ue,ye[He])}else if(Z.isInstancedMesh)te.renderInstances(xt,re,Z.count);else if(it.isInstancedBufferGeometry){const Wt=it._maxInstanceCount!==void 0?it._maxInstanceCount:1/0,ye=Math.min(it.instanceCount,Wt);te.renderInstances(xt,re,ye)}else te.render(xt,re)};function me(R,Y,it){R.transparent===!0&&R.side===Sn&&R.forceSinglePass===!1?(R.side=Ke,R.needsUpdate=!0,$n(R,Y,it),R.side=jn,R.needsUpdate=!0,$n(R,Y,it),R.side=Sn):$n(R,Y,it)}this.compile=function(R,Y,it=null){it===null&&(it=R),f=kt.get(it),f.init(Y),y.push(f),it.traverseVisible(function(Z){Z.isLight&&Z.layers.test(Y.layers)&&(f.pushLight(Z),Z.castShadow&&f.pushShadow(Z))}),R!==it&&R.traverseVisible(function(Z){Z.isLight&&Z.layers.test(Y.layers)&&(f.pushLight(Z),Z.castShadow&&f.pushShadow(Z))}),f.setupLights();const ot=new Set;return R.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const _t=Z.material;if(_t)if(Array.isArray(_t))for(let It=0;It<_t.length;It++){const Ft=_t[It];me(Ft,it,Z),ot.add(Ft)}else me(_t,it,Z),ot.add(_t)}),f=y.pop(),ot},this.compileAsync=function(R,Y,it=null){const ot=this.compile(R,Y,it);return new Promise(Z=>{function _t(){if(ot.forEach(function(It){Mt.get(It).currentProgram.isReady()&&ot.delete(It)}),ot.size===0){Z(R);return}setTimeout(_t,10)}dt.get("KHR_parallel_shader_compile")!==null?_t():setTimeout(_t,10)})};let he=null;function an(R){he&&he(R)}function Qe(){mn.stop()}function Jo(){mn.start()}const mn=new Kh;mn.setAnimationLoop(an),typeof self<"u"&&mn.setContext(self),this.setAnimationLoop=function(R){he=R,bt.setAnimationLoop(R),R===null?mn.stop():mn.start()},bt.addEventListener("sessionstart",Qe),bt.addEventListener("sessionend",Jo),this.render=function(R,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),bt.enabled===!0&&bt.isPresenting===!0&&(bt.cameraAutoUpdate===!0&&bt.updateCamera(Y),Y=bt.getCamera()),R.isScene===!0&&R.onBeforeRender(x,R,Y,L),f=kt.get(R,y.length),f.init(Y),y.push(f),ut.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Dt.setFromProjectionMatrix(ut,Rn,Y.reversedDepth),rt=this.localClippingEnabled,Kt=Et.init(this.clippingPlanes,rt),m=st.get(R,S.length),m.init(),S.push(m),bt.enabled===!0&&bt.isPresenting===!0){const _t=x.xr.getDepthSensingMesh();_t!==null&&fo(_t,Y,-1/0,x.sortObjects)}fo(R,Y,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(K,X),oe=bt.enabled===!1||bt.isPresenting===!1||bt.hasDepthSensing()===!1,oe&&Ht.addToRenderList(m,R),this.info.render.frame++,Kt===!0&&Et.beginShadows();const it=f.state.shadowsArray;Vt.render(it,R,Y),Kt===!0&&Et.endShadows(),this.info.autoReset===!0&&this.info.reset();const ot=m.opaque,Z=m.transmissive;if(f.setupLights(),Y.isArrayCamera){const _t=Y.cameras;if(Z.length>0)for(let It=0,Ft=_t.length;It<Ft;It++){const I=_t[It];Ko(ot,Z,R,I)}oe&&Ht.render(R);for(let It=0,Ft=_t.length;It<Ft;It++){const I=_t[It];hi(m,R,I,I.viewport)}}else Z.length>0&&Ko(ot,Z,R,Y),oe&&Ht.render(R),hi(m,R,Y);L!==null&&P===0&&(Tt.updateMultisampleRenderTarget(L),Tt.updateRenderTargetMipmap(L)),R.isScene===!0&&R.onAfterRender(x,R,Y),Pt.resetDefaultState(),E=-1,b=null,y.pop(),y.length>0?(f=y[y.length-1],Kt===!0&&Et.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function fo(R,Y,it,ot){if(R.visible===!1)return;if(R.layers.test(Y.layers)){if(R.isGroup)it=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(Y);else if(R.isLight)f.pushLight(R),R.castShadow&&f.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Dt.intersectsSprite(R)){ot&&Gt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ut);const It=$.update(R),Ft=R.material;Ft.visible&&m.push(R,It,Ft,it,Gt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Dt.intersectsObject(R))){const It=$.update(R),Ft=R.material;if(ot&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Gt.copy(R.boundingSphere.center)):(It.boundingSphere===null&&It.computeBoundingSphere(),Gt.copy(It.boundingSphere.center)),Gt.applyMatrix4(R.matrixWorld).applyMatrix4(ut)),Array.isArray(Ft)){const I=It.groups;for(let H=0,J=I.length;H<J;H++){const tt=I[H],xt=Ft[tt.materialIndex];xt&&xt.visible&&m.push(R,It,xt,it,Gt.z,tt)}}else Ft.visible&&m.push(R,It,Ft,it,Gt.z,null)}}const _t=R.children;for(let It=0,Ft=_t.length;It<Ft;It++)fo(_t[It],Y,it,ot)}function hi(R,Y,it,ot){const Z=R.opaque,_t=R.transmissive,It=R.transparent;f.setupLightsView(it),Kt===!0&&Et.setGlobalState(x.clippingPlanes,it),ot&&Q.viewport(D.copy(ot)),Z.length>0&&Zn(Z,Y,it),_t.length>0&&Zn(_t,Y,it),It.length>0&&Zn(It,Y,it),Q.buffers.depth.setTest(!0),Q.buffers.depth.setMask(!0),Q.buffers.color.setMask(!0),Q.setPolygonOffset(!1)}function Ko(R,Y,it,ot){if((it.isScene===!0?it.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[ot.id]===void 0&&(f.state.transmissionRenderTarget[ot.id]=new Ci(1,1,{generateMipmaps:!0,type:dt.has("EXT_color_buffer_half_float")||dt.has("EXT_color_buffer_float")?qo:Un,minFilter:Ei,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:fe.workingColorSpace}));const _t=f.state.transmissionRenderTarget[ot.id],It=ot.viewport||D;_t.setSize(It.z*x.transmissionResolutionScale,It.w*x.transmissionResolutionScale);const Ft=x.getRenderTarget(),I=x.getActiveCubeFace(),H=x.getActiveMipmapLevel();x.setRenderTarget(_t),x.getClearColor(q),W=x.getClearAlpha(),W<1&&x.setClearColor(16777215,.5),x.clear(),oe&&Ht.render(it);const J=x.toneMapping;x.toneMapping=ci;const tt=ot.viewport;if(ot.viewport!==void 0&&(ot.viewport=void 0),f.setupLightsView(ot),Kt===!0&&Et.setGlobalState(x.clippingPlanes,ot),Zn(R,it,ot),Tt.updateMultisampleRenderTarget(_t),Tt.updateRenderTargetMipmap(_t),dt.has("WEBGL_multisampled_render_to_texture")===!1){let xt=!1;for(let qt=0,re=Y.length;qt<re;qt++){const $t=Y[qt],te=$t.object,Wt=$t.geometry,ye=$t.material,de=$t.group;if(ye.side===Sn&&te.layers.test(ot.layers)){const Ue=ye.side;ye.side=Ke,ye.needsUpdate=!0,po(te,it,ot,Wt,ye,de),ye.side=Ue,ye.needsUpdate=!0,xt=!0}}xt===!0&&(Tt.updateMultisampleRenderTarget(_t),Tt.updateRenderTargetMipmap(_t))}x.setRenderTarget(Ft,I,H),x.setClearColor(q,W),tt!==void 0&&(ot.viewport=tt),x.toneMapping=J}function Zn(R,Y,it){const ot=Y.isScene===!0?Y.overrideMaterial:null;for(let Z=0,_t=R.length;Z<_t;Z++){const It=R[Z],Ft=It.object,I=It.geometry,H=It.group;let J=It.material;J.allowOverride===!0&&ot!==null&&(J=ot),Ft.layers.test(it.layers)&&po(Ft,Y,it,I,J,H)}}function po(R,Y,it,ot,Z,_t){R.onBeforeRender(x,Y,it,ot,Z,_t),R.modelViewMatrix.multiplyMatrices(it.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),Z.onBeforeRender(x,Y,it,ot,R,_t),Z.transparent===!0&&Z.side===Sn&&Z.forceSinglePass===!1?(Z.side=Ke,Z.needsUpdate=!0,x.renderBufferDirect(it,Y,ot,Z,R,_t),Z.side=jn,Z.needsUpdate=!0,x.renderBufferDirect(it,Y,ot,Z,R,_t),Z.side=Sn):x.renderBufferDirect(it,Y,ot,Z,R,_t),R.onAfterRender(x,Y,it,ot,Z,_t)}function $n(R,Y,it){Y.isScene!==!0&&(Y=Bt);const ot=Mt.get(R),Z=f.state.lights,_t=f.state.shadowsArray,It=Z.state.version,Ft=nt.getParameters(R,Z.state,_t,Y,it),I=nt.getProgramCacheKey(Ft);let H=ot.programs;ot.environment=R.isMeshStandardMaterial?Y.environment:null,ot.fog=Y.fog,ot.envMap=(R.isMeshStandardMaterial?Jt:Yt).get(R.envMap||ot.environment),ot.envMapRotation=ot.environment!==null&&R.envMap===null?Y.environmentRotation:R.envMapRotation,H===void 0&&(R.addEventListener("dispose",lt),H=new Map,ot.programs=H);let J=H.get(I);if(J!==void 0){if(ot.currentProgram===J&&ot.lightsStateVersion===It)return ts(R,Ft),J}else Ft.uniforms=nt.getUniforms(R),R.onBeforeCompile(Ft,x),J=nt.acquireProgram(Ft,I),H.set(I,J),ot.uniforms=Ft.uniforms;const tt=ot.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(tt.clippingPlanes=Et.uniform),ts(R,Ft),ot.needsLights=mo(R),ot.lightsStateVersion=It,ot.needsLights&&(tt.ambientLightColor.value=Z.state.ambient,tt.lightProbe.value=Z.state.probe,tt.directionalLights.value=Z.state.directional,tt.directionalLightShadows.value=Z.state.directionalShadow,tt.spotLights.value=Z.state.spot,tt.spotLightShadows.value=Z.state.spotShadow,tt.rectAreaLights.value=Z.state.rectArea,tt.ltc_1.value=Z.state.rectAreaLTC1,tt.ltc_2.value=Z.state.rectAreaLTC2,tt.pointLights.value=Z.state.point,tt.pointLightShadows.value=Z.state.pointShadow,tt.hemisphereLights.value=Z.state.hemi,tt.directionalShadowMap.value=Z.state.directionalShadowMap,tt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,tt.spotShadowMap.value=Z.state.spotShadowMap,tt.spotLightMatrix.value=Z.state.spotLightMatrix,tt.spotLightMap.value=Z.state.spotLightMap,tt.pointShadowMap.value=Z.state.pointShadowMap,tt.pointShadowMatrix.value=Z.state.pointShadowMatrix),ot.currentProgram=J,ot.uniformsList=null,J}function Qo(R){if(R.uniformsList===null){const Y=R.currentProgram.getUniforms();R.uniformsList=Os.seqWithValue(Y.seq,R.uniforms)}return R.uniformsList}function ts(R,Y){const it=Mt.get(R);it.outputColorSpace=Y.outputColorSpace,it.batching=Y.batching,it.batchingColor=Y.batchingColor,it.instancing=Y.instancing,it.instancingColor=Y.instancingColor,it.instancingMorph=Y.instancingMorph,it.skinning=Y.skinning,it.morphTargets=Y.morphTargets,it.morphNormals=Y.morphNormals,it.morphColors=Y.morphColors,it.morphTargetsCount=Y.morphTargetsCount,it.numClippingPlanes=Y.numClippingPlanes,it.numIntersection=Y.numClipIntersection,it.vertexAlphas=Y.vertexAlphas,it.vertexTangents=Y.vertexTangents,it.toneMapping=Y.toneMapping}function es(R,Y,it,ot,Z){Y.isScene!==!0&&(Y=Bt),Tt.resetTextureUnits();const _t=Y.fog,It=ot.isMeshStandardMaterial?Y.environment:null,Ft=L===null?x.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:oo,I=(ot.isMeshStandardMaterial?Jt:Yt).get(ot.envMap||It),H=ot.vertexColors===!0&&!!it.attributes.color&&it.attributes.color.itemSize===4,J=!!it.attributes.tangent&&(!!ot.normalMap||ot.anisotropy>0),tt=!!it.morphAttributes.position,xt=!!it.morphAttributes.normal,qt=!!it.morphAttributes.color;let re=ci;ot.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(re=x.toneMapping);const $t=it.morphAttributes.position||it.morphAttributes.normal||it.morphAttributes.color,te=$t!==void 0?$t.length:0,Wt=Mt.get(ot),ye=f.state.lights;if(Kt===!0&&(rt===!0||R!==b)){const Ge=R===b&&ot.id===E;Et.setState(ot,R,Ge)}let de=!1;ot.version===Wt.__version?(Wt.needsLights&&Wt.lightsStateVersion!==ye.state.version||Wt.outputColorSpace!==Ft||Z.isBatchedMesh&&Wt.batching===!1||!Z.isBatchedMesh&&Wt.batching===!0||Z.isBatchedMesh&&Wt.batchingColor===!0&&Z.colorTexture===null||Z.isBatchedMesh&&Wt.batchingColor===!1&&Z.colorTexture!==null||Z.isInstancedMesh&&Wt.instancing===!1||!Z.isInstancedMesh&&Wt.instancing===!0||Z.isSkinnedMesh&&Wt.skinning===!1||!Z.isSkinnedMesh&&Wt.skinning===!0||Z.isInstancedMesh&&Wt.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Wt.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Wt.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Wt.instancingMorph===!1&&Z.morphTexture!==null||Wt.envMap!==I||ot.fog===!0&&Wt.fog!==_t||Wt.numClippingPlanes!==void 0&&(Wt.numClippingPlanes!==Et.numPlanes||Wt.numIntersection!==Et.numIntersection)||Wt.vertexAlphas!==H||Wt.vertexTangents!==J||Wt.morphTargets!==tt||Wt.morphNormals!==xt||Wt.morphColors!==qt||Wt.toneMapping!==re||Wt.morphTargetsCount!==te)&&(de=!0):(de=!0,Wt.__version=ot.version);let Ue=Wt.currentProgram;de===!0&&(Ue=$n(ot,Y,Z));let Jn=!1,He=!1,di=!1;const Se=Ue.getUniforms(),rn=Wt.uniforms;if(Q.useProgram(Ue.program)&&(Jn=!0,He=!0,di=!0),ot.id!==E&&(E=ot.id,He=!0),Jn||b!==R){Q.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),Se.setValue(O,"projectionMatrix",R.projectionMatrix),Se.setValue(O,"viewMatrix",R.matrixWorldInverse);const Ze=Se.map.cameraPosition;Ze!==void 0&&Ze.setValue(O,Ut.setFromMatrixPosition(R.matrixWorld)),ct.logarithmicDepthBuffer&&Se.setValue(O,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(ot.isMeshPhongMaterial||ot.isMeshToonMaterial||ot.isMeshLambertMaterial||ot.isMeshBasicMaterial||ot.isMeshStandardMaterial||ot.isShaderMaterial)&&Se.setValue(O,"isOrthographic",R.isOrthographicCamera===!0),b!==R&&(b=R,He=!0,di=!0)}if(Z.isSkinnedMesh){Se.setOptional(O,Z,"bindMatrix"),Se.setOptional(O,Z,"bindMatrixInverse");const Ge=Z.skeleton;Ge&&(Ge.boneTexture===null&&Ge.computeBoneTexture(),Se.setValue(O,"boneTexture",Ge.boneTexture,Tt))}Z.isBatchedMesh&&(Se.setOptional(O,Z,"batchingTexture"),Se.setValue(O,"batchingTexture",Z._matricesTexture,Tt),Se.setOptional(O,Z,"batchingIdTexture"),Se.setValue(O,"batchingIdTexture",Z._indirectTexture,Tt),Se.setOptional(O,Z,"batchingColorTexture"),Z._colorsTexture!==null&&Se.setValue(O,"batchingColorTexture",Z._colorsTexture,Tt));const cn=it.morphAttributes;if((cn.position!==void 0||cn.normal!==void 0||cn.color!==void 0)&&yt.update(Z,it,Ue),(He||Wt.receiveShadow!==Z.receiveShadow)&&(Wt.receiveShadow=Z.receiveShadow,Se.setValue(O,"receiveShadow",Z.receiveShadow)),ot.isMeshGouraudMaterial&&ot.envMap!==null&&(rn.envMap.value=I,rn.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1),ot.isMeshStandardMaterial&&ot.envMap===null&&Y.environment!==null&&(rn.envMapIntensity.value=Y.environmentIntensity),He&&(Se.setValue(O,"toneMappingExposure",x.toneMappingExposure),Wt.needsLights&&ns(rn,di),_t&&ot.fog===!0&&pt.refreshFogUniforms(rn,_t),pt.refreshMaterialUniforms(rn,ot,B,N,f.state.transmissionRenderTarget[R.id]),Os.upload(O,Qo(Wt),rn,Tt)),ot.isShaderMaterial&&ot.uniformsNeedUpdate===!0&&(Os.upload(O,Qo(Wt),rn,Tt),ot.uniformsNeedUpdate=!1),ot.isSpriteMaterial&&Se.setValue(O,"center",Z.center),Se.setValue(O,"modelViewMatrix",Z.modelViewMatrix),Se.setValue(O,"normalMatrix",Z.normalMatrix),Se.setValue(O,"modelMatrix",Z.matrixWorld),ot.isShaderMaterial||ot.isRawShaderMaterial){const Ge=ot.uniformsGroups;for(let Ze=0,ra=Ge.length;Ze<ra;Ze++){const ui=Ge[Ze];jt.update(ui,Ue),jt.bind(ui,Ue)}}return Ue}function ns(R,Y){R.ambientLightColor.needsUpdate=Y,R.lightProbe.needsUpdate=Y,R.directionalLights.needsUpdate=Y,R.directionalLightShadows.needsUpdate=Y,R.pointLights.needsUpdate=Y,R.pointLightShadows.needsUpdate=Y,R.spotLights.needsUpdate=Y,R.spotLightShadows.needsUpdate=Y,R.rectAreaLights.needsUpdate=Y,R.hemisphereLights.needsUpdate=Y}function mo(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(R,Y,it){const ot=Mt.get(R);ot.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,ot.__autoAllocateDepthBuffer===!1&&(ot.__useRenderToTexture=!1),Mt.get(R.texture).__webglTexture=Y,Mt.get(R.depthTexture).__webglTexture=ot.__autoAllocateDepthBuffer?void 0:it,ot.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,Y){const it=Mt.get(R);it.__webglFramebuffer=Y,it.__useDefaultFramebuffer=Y===void 0};const go=O.createFramebuffer();this.setRenderTarget=function(R,Y=0,it=0){L=R,C=Y,P=it;let ot=!0,Z=null,_t=!1,It=!1;if(R){const I=Mt.get(R);if(I.__useDefaultFramebuffer!==void 0)Q.bindFramebuffer(O.FRAMEBUFFER,null),ot=!1;else if(I.__webglFramebuffer===void 0)Tt.setupRenderTarget(R);else if(I.__hasExternalTextures)Tt.rebindTextures(R,Mt.get(R.texture).__webglTexture,Mt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const tt=R.depthTexture;if(I.__boundDepthTexture!==tt){if(tt!==null&&Mt.has(tt)&&(R.width!==tt.image.width||R.height!==tt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Tt.setupDepthRenderbuffer(R)}}const H=R.texture;(H.isData3DTexture||H.isDataArrayTexture||H.isCompressedArrayTexture)&&(It=!0);const J=Mt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(J[Y])?Z=J[Y][it]:Z=J[Y],_t=!0):R.samples>0&&Tt.useMultisampledRTT(R)===!1?Z=Mt.get(R).__webglMultisampledFramebuffer:Array.isArray(J)?Z=J[it]:Z=J,D.copy(R.viewport),F.copy(R.scissor),V=R.scissorTest}else D.copy(ht).multiplyScalar(B).floor(),F.copy(ft).multiplyScalar(B).floor(),V=St;if(it!==0&&(Z=go),Q.bindFramebuffer(O.FRAMEBUFFER,Z)&&ot&&Q.drawBuffers(R,Z),Q.viewport(D),Q.scissor(F),Q.setScissorTest(V),_t){const I=Mt.get(R.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+Y,I.__webglTexture,it)}else if(It){const I=Y;for(let H=0;H<R.textures.length;H++){const J=Mt.get(R.textures[H]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+H,J.__webglTexture,it,I)}}else if(R!==null&&it!==0){const I=Mt.get(R.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,I.__webglTexture,it)}E=-1},this.readRenderTargetPixels=function(R,Y,it,ot,Z,_t,It,Ft=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let I=Mt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&It!==void 0&&(I=I[It]),I){Q.bindFramebuffer(O.FRAMEBUFFER,I);try{const H=R.textures[Ft],J=H.format,tt=H.type;if(!ct.textureFormatReadable(J)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=R.width-ot&&it>=0&&it<=R.height-Z&&(R.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ft),O.readPixels(Y,it,ot,Z,Ot.convert(J),Ot.convert(tt),_t))}finally{const H=L!==null?Mt.get(L).__webglFramebuffer:null;Q.bindFramebuffer(O.FRAMEBUFFER,H)}}},this.readRenderTargetPixelsAsync=async function(R,Y,it,ot,Z,_t,It,Ft=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let I=Mt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&It!==void 0&&(I=I[It]),I)if(Y>=0&&Y<=R.width-ot&&it>=0&&it<=R.height-Z){Q.bindFramebuffer(O.FRAMEBUFFER,I);const H=R.textures[Ft],J=H.format,tt=H.type;if(!ct.textureFormatReadable(J))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const xt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,xt),O.bufferData(O.PIXEL_PACK_BUFFER,_t.byteLength,O.STREAM_READ),R.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Ft),O.readPixels(Y,it,ot,Z,Ot.convert(J),Ot.convert(tt),0);const qt=L!==null?Mt.get(L).__webglFramebuffer:null;Q.bindFramebuffer(O.FRAMEBUFFER,qt);const re=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Du(O,re,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,xt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,_t),O.deleteBuffer(xt),O.deleteSync(re),_t}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,Y=null,it=0){const ot=Math.pow(2,-it),Z=Math.floor(R.image.width*ot),_t=Math.floor(R.image.height*ot),It=Y!==null?Y.x:0,Ft=Y!==null?Y.y:0;Tt.setTexture2D(R,0),O.copyTexSubImage2D(O.TEXTURE_2D,it,0,0,It,Ft,Z,_t),Q.unbindTexture()};const Ii=O.createFramebuffer(),Ve=O.createFramebuffer();this.copyTextureToTexture=function(R,Y,it=null,ot=null,Z=0,_t=null){_t===null&&(Z!==0?(Fo("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_t=Z,Z=0):_t=0);let It,Ft,I,H,J,tt,xt,qt,re;const $t=R.isCompressedTexture?R.mipmaps[_t]:R.image;if(it!==null)It=it.max.x-it.min.x,Ft=it.max.y-it.min.y,I=it.isBox3?it.max.z-it.min.z:1,H=it.min.x,J=it.min.y,tt=it.isBox3?it.min.z:0;else{const cn=Math.pow(2,-Z);It=Math.floor($t.width*cn),Ft=Math.floor($t.height*cn),R.isDataArrayTexture?I=$t.depth:R.isData3DTexture?I=Math.floor($t.depth*cn):I=1,H=0,J=0,tt=0}ot!==null?(xt=ot.x,qt=ot.y,re=ot.z):(xt=0,qt=0,re=0);const te=Ot.convert(Y.format),Wt=Ot.convert(Y.type);let ye;Y.isData3DTexture?(Tt.setTexture3D(Y,0),ye=O.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(Tt.setTexture2DArray(Y,0),ye=O.TEXTURE_2D_ARRAY):(Tt.setTexture2D(Y,0),ye=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Y.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Y.unpackAlignment);const de=O.getParameter(O.UNPACK_ROW_LENGTH),Ue=O.getParameter(O.UNPACK_IMAGE_HEIGHT),Jn=O.getParameter(O.UNPACK_SKIP_PIXELS),He=O.getParameter(O.UNPACK_SKIP_ROWS),di=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,$t.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,$t.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,H),O.pixelStorei(O.UNPACK_SKIP_ROWS,J),O.pixelStorei(O.UNPACK_SKIP_IMAGES,tt);const Se=R.isDataArrayTexture||R.isData3DTexture,rn=Y.isDataArrayTexture||Y.isData3DTexture;if(R.isDepthTexture){const cn=Mt.get(R),Ge=Mt.get(Y),Ze=Mt.get(cn.__renderTarget),ra=Mt.get(Ge.__renderTarget);Q.bindFramebuffer(O.READ_FRAMEBUFFER,Ze.__webglFramebuffer),Q.bindFramebuffer(O.DRAW_FRAMEBUFFER,ra.__webglFramebuffer);for(let ui=0;ui<I;ui++)Se&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Mt.get(R).__webglTexture,Z,tt+ui),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Mt.get(Y).__webglTexture,_t,re+ui)),O.blitFramebuffer(H,J,It,Ft,xt,qt,It,Ft,O.DEPTH_BUFFER_BIT,O.NEAREST);Q.bindFramebuffer(O.READ_FRAMEBUFFER,null),Q.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(Z!==0||R.isRenderTargetTexture||Mt.has(R)){const cn=Mt.get(R),Ge=Mt.get(Y);Q.bindFramebuffer(O.READ_FRAMEBUFFER,Ii),Q.bindFramebuffer(O.DRAW_FRAMEBUFFER,Ve);for(let Ze=0;Ze<I;Ze++)Se?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,cn.__webglTexture,Z,tt+Ze):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,cn.__webglTexture,Z),rn?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ge.__webglTexture,_t,re+Ze):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ge.__webglTexture,_t),Z!==0?O.blitFramebuffer(H,J,It,Ft,xt,qt,It,Ft,O.COLOR_BUFFER_BIT,O.NEAREST):rn?O.copyTexSubImage3D(ye,_t,xt,qt,re+Ze,H,J,It,Ft):O.copyTexSubImage2D(ye,_t,xt,qt,H,J,It,Ft);Q.bindFramebuffer(O.READ_FRAMEBUFFER,null),Q.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else rn?R.isDataTexture||R.isData3DTexture?O.texSubImage3D(ye,_t,xt,qt,re,It,Ft,I,te,Wt,$t.data):Y.isCompressedArrayTexture?O.compressedTexSubImage3D(ye,_t,xt,qt,re,It,Ft,I,te,$t.data):O.texSubImage3D(ye,_t,xt,qt,re,It,Ft,I,te,Wt,$t):R.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,_t,xt,qt,It,Ft,te,Wt,$t.data):R.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,_t,xt,qt,$t.width,$t.height,te,$t.data):O.texSubImage2D(O.TEXTURE_2D,_t,xt,qt,It,Ft,te,Wt,$t);O.pixelStorei(O.UNPACK_ROW_LENGTH,de),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ue),O.pixelStorei(O.UNPACK_SKIP_PIXELS,Jn),O.pixelStorei(O.UNPACK_SKIP_ROWS,He),O.pixelStorei(O.UNPACK_SKIP_IMAGES,di),_t===0&&Y.generateMipmaps&&O.generateMipmap(ye),Q.unbindTexture()},this.initRenderTarget=function(R){Mt.get(R).__webglFramebuffer===void 0&&Tt.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?Tt.setTextureCube(R,0):R.isData3DTexture?Tt.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?Tt.setTexture2DArray(R,0):Tt.setTexture2D(R,0),Q.unbindTexture()},this.resetState=function(){C=0,P=0,L=null,Q.reset(),Pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=fe._getDrawingBufferColorSpace(t),e.unpackColorSpace=fe._getUnpackColorSpace()}}class Dv{camera;pitch=Ne.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new z;desired=new z;aspect=1;constructor(){this.camera=new Tc(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=Ne.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const i=1-Math.pow(.001,t);this.focus.lerp(e,i),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,i=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*i*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*i*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,i){const o=Math.sin(this.yaw),s=Math.cos(this.yaw);return i.set(t*s-e*o,0,-t*o-e*s),i}}class Uv{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};ponteiro={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(Nv.has(e)||zv.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.surface.getBoundingClientRect();if(this.ponteiro.x=(t.clientX-e.left)/e.width*2-1,this.ponteiro.y=1-(t.clientY-e.top)/e.height*2,t.pointerId!==this.stickId)return;const i=60,o=Math.max(-i,Math.min(i,t.clientX-this.stickOrigin.x)),s=Math.max(-i,Math.min(i,t.clientY-this.stickOrigin.y));this.stickX=o/i,this.stickY=s/i};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};pointer(){return{x:this.ponteiro.x,y:this.ponteiro.y}}move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const i=Math.hypot(t,e);return i>1&&(t/=i,e/=i),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}tapGirar(t){this.pressed.add(t<0?"KeyQ":"KeyR")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const Nv=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),zv=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF","KeyH","KeyI","Tab"]),pn=["cabeca","tronco","pernas","pes"],_={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,grassDry:11059802,dirt:12159572,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,brick:13068882,wallCream:15984595,wallMint:14085344,wallAzul:13624565,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,mesaVerde:3108695,cortica:14133098,corticaEscura:12159055,estanteFundo:7030048,pelusaBranco:16184042,pelusaCinza:11050641,pelusaCinzaEscuro:9076852,pelusaFocinho:15247277,pelusaOrelha:14395816,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,roupaLa:14248826,roupaLaBarra:16180168,roupaListra:4882400,roupaListraManga:15987180,roupaJeans:4151942,roupaBota:16763213,roupaBotaCano:9067050,vestidoRosa:16176088,vestidoRenda:16644080,vestidoFita:15773373,maidPreto:2828851,maidCreme:16447214,maidFita:1512988,maidLacoVermelho:12727364,moletomPreto:2500140,moletomCostura:1315864,moletomZiper:4539983,moletomForro:5461086,moletomPonteira:14276301,waRosa:15775432,waRosaForte:14250895,waEscuro:3880263,waBranco:16644853,waFivela:12170944,bermudaAzul:3112912,bermudaVermelha:14173503,bermudaAmarela:15906857,bermudaEstampa:3126696,bermudaEstampaFaixa:16642261,oculosLente:2302251,oculosArmacao:4012872,vestiarioAzulejo:9356253,vestiarioRejunte:7055564,vestiarioPorta:3108751,vestiarioCaixa:4157360,restauranteParede:15983567,restauranteFaixa:14862763,restauranteToldo:3120761,restauranteEsquadria:7031340,restauranteDeck:12618322,restauranteDeckRipa:11566150,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578,pessego:16756838};let Mi=null;function Fv(){if(!Mi){const n=new Uint8Array([96,166,214,255]);Mi=new sf(n,n.length,1,fc),Mi.minFilter=Ye,Mi.magFilter=Ye,Mi.generateMipmaps=!1,Mi.needsUpdate=!0}return Mi}const Fl=new Map;function w(n,t={}){const e=`${n}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.decal?1:0}`,i=Fl.get(e);if(i)return i;const o=new Zh({color:n,gradientMap:Fv(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?Sn:jn});return t.glow&&(o.emissive=new ce(n),o.emissiveIntensity=t.glow),t.decal&&od(o),Fl.set(e,o),o}function od(n){n.polygonOffset=!0,n.polygonOffsetFactor=-1,n.polygonOffsetUnits=-4,n.depthWrite=!1}const Ol=new Map;function je(n,t=1,e=!1){const i=`${n}|${t}|${e?1:0}`,o=Ol.get(i);if(o)return o;const s=new na({color:n,transparent:t<1,opacity:t,side:Sn});return e&&od(s),Ol.set(i,s),s}const Bl=new Map;function kl(n){const t=Bl.get(n);if(t)return t;const e=new Oh({color:n});return Bl.set(n,e),e}function Zs(n="redonda",t=1,e=.5){const i=new at,o=2.1*t,s=new v(new et(.13*t,.2*t,o,8),w(_.trunk));if(s.position.y=o/2,i.add(s),n==="pinheiro")for(let a=0;a<3;a++){const r=(1.1-a*.26)*t,c=new v(new Pe(r,1.3*t,9),w(a===0?_.leafDark:_.leafMid));c.position.y=o*.7+a*.72*t,i.add(c)}else if(n==="palmeira"){s.scale.y=1.5,s.position.y=o*.75;for(let a=0;a<7;a++){const r=a/7*Math.PI*2,c=new v(new Rt(.75*t,8,6),w(_.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(r)*.85*t,o*1.5-.1,Math.sin(r)*.85*t),c.rotation.y=-r,c.rotation.z=-.32,i.add(c)}}else{const a=n==="florida"?_.flowerPink:_.leafMid;[[0,o+.55*t,0,1.15],[.62*t,o+.15*t,.2*t,.78],[-.5*t,o+.3*t,-.35*t,.88],[.1*t,o+1.05*t,-.3*t,.66]].forEach(([c,l,h,d],u)=>{const p=new v(new Xo(d*t,1),w(u%2===0?a:n==="florida"?_.flowerPink:_.leafLight));p.position.set(c,l,h),p.rotation.set(e*3,e*5,e*2),i.add(p)})}return i}function Bs(n=1,t=_.bush){const e=new at;for(let i=0;i<3;i++){const o=new v(new Xo(.42*n,1),w(t));o.position.set((i-1)*.36*n,.3*n+(i===1?.12:0),i%2*.18*n),e.add(o)}return e}function jr(n=6,t=.9,e=[_.flowerPink,_.flowerYellow,16777215]){const i=new at;for(let o=0;o<n;o++){const s=o/n*Math.PI*2+o*.7,a=t*(.35+o*37%100/140),r=new v(new et(.02,.02,.3,5),w(_.leafDark));r.position.set(Math.cos(s)*a,.15,Math.sin(s)*a),i.add(r);const c=new v(new Rt(.09,8,6),w(e[o%e.length]));c.position.set(Math.cos(s)*a,.33,Math.sin(s)*a),c.scale.y=.7,i.add(c)}return i}function Ps(n=1,t=.5,e=10133670){const i=new at,o=new yc(.5*n,0),s=o.attributes.position;for(let r=0;r<s.count;r++){const c=s.getX(r),l=s.getY(r),h=s.getZ(r),d=Math.sin(Math.round(c*1e3)*12.9898+Math.round(l*1e3)*78.233+Math.round(h*1e3)*37.719+t*53.1)*43758.5453,u=1+(d-Math.floor(d)-.5)*.3;s.setXYZ(r,c*u,l*u,h*u)}o.computeVertexNormals();const a=new v(o,w(e));return a.position.y=.3*n*(.8+t*.4),a.rotation.set(t*6.28,t*4.1,t*2.2),a.scale.set(1+t*.3,.6+t*.4,1.1-t*.3),i.add(a),i}function Vl(n=1,t=_.leafMid){const e=new at,i=6;for(let o=0;o<i;o++){const s=o/i*Math.PI*2+o*.7,a=(.28+o*37%10/40)*n,r=new v(new Pe(.035*n,a,5),w(o%3===0?_.leafDark:o%3===1?t:_.grassDry));r.position.set(Math.cos(s)*.11*n,a*.45,Math.sin(s)*.11*n),r.rotation.set(Math.sin(s)*.35,0,Math.cos(s)*.35),e.add(r)}return e}function Ov(n=1.2,t=7){const e=new at;for(let i=0;i<t;i++){const o=i/t*Math.PI*2+i*1.3,s=.06+i*53%10/55,a=n*(.7+i*29%10/22),r=new v(new et(.02,.028,a,5),w(i%2?_.leafDark:_.leafMid)),c=.12+i*17%10/60;if(r.position.set(Math.cos(o)*s,a/2,Math.sin(o)*s),r.rotation.set(Math.sin(o)*c,0,Math.cos(o)*c),e.add(r),i%3===0){const l=new v(new An(.045,a*.16,4,8),w(9071162));l.position.set(Math.cos(o)*(s+Math.cos(o)*c*a*.5),a*.97,Math.sin(o)*(s+Math.sin(o)*c*a*.5)),e.add(l)}}return e}function Bv(n=1,t=!0){const e=new at;for(const[i,o,s]of[[0,0,.62],[.34,.2,.44]]){const a=new v(new Rt(s*n,14,6,0,Math.PI*2,0,.5),w(_.leafLight));a.scale.y=.3,a.position.set(i*n,.03,o*n),e.add(a)}if(t){const i=new v(new Rt(.08*n,8,6),w(_.flowerYellow));i.position.set(.16*n,.14*n,.08*n),e.add(i);for(let o=0;o<5;o++){const s=o/5*Math.PI*2,a=new v(new Rt(.06*n,7,5),w(16773365));a.position.set(.16*n+Math.cos(s)*.08*n,.12*n,.08*n+Math.sin(s)*.08*n),a.scale.set(1.3,.6,1.3),e.add(a)}}return e}const Cc=.24;function sd(n){const t=new at,e=Cc,i=new v(new et(n,n*1.05,e,18,1,!0),w(_.brick,{doubleSide:!0}));i.position.y=e/2,t.add(i);const o=new v(new ge(n,.05,6,20),w(_.wallCream));o.rotation.x=Math.PI/2,o.position.y=e,t.add(o);const s=new v(new et(n*.96,n*.96,.08,18),w(_.dirt));s.position.y=e-.03,t.add(s);const a=new v(new Rt(n*.9,16,8),w(_.leafMid));return a.scale.y=.11,a.position.y=e-.04,t.add(a),t}function ad(n=1.1,t=[_.flowerPink,_.flowerYellow,16777215,12160992],e=.5){const i=sd(n),o=Cc,s=e*6.28,a=[[s*1.7,0]],r=Math.round(9*n),c=Math.round(5*n);for(let d=0;d<r;d++)a.push([d/r*Math.PI*2+s,n*.68]);for(let d=0;d<c;d++)a.push([d/c*Math.PI*2+s+.7,n*.36]);const l=n*.2,h=n*.068;return a.forEach(([d,u],p)=>{const g=t[p%t.length],M=(p*37+e*100)%10/10-.5,m=Math.cos(d)*u+M*n*.08,f=Math.sin(d)*u-M*n*.08,S=new v(new Rt(l,8,6),w(_.leafDark));S.position.set(m,o+l*.3,f),S.scale.y=.55,i.add(S);for(let y=0;y<6;y++){const x=y<4,A=y/(x?4:2)*Math.PI*2+p+(x?0:.8),C=x?l*.62:l*.24,P=new v(new Rt(h,8,6),w(g));P.position.set(m+Math.cos(A)*C,o+l*(x?.72:1.05)+(y+p)%3*n*.04,f+Math.sin(A)*C),P.scale.y=.8,i.add(P)}}),i}function kv(n=1.3,t=1,e=.5){const i=sd(n),o=Cc,s=Zs("palmeira",t,e);s.position.y=o,i.add(s);const a=Math.round(7*n);for(let r=0;r<a;r++){const c=r/a*Math.PI*2+e*6.28,l=n*(.45+(r*53+e*100)%10/10*.28),h=n*(.15+r*29%7/7*.07),d=new v(new Rt(h,8,6),w(r%2?_.leafDark:_.bush));d.position.set(Math.cos(c)*l,o+h*.3,Math.sin(c)*l),d.scale.y=.6,i.add(d)}return i}function Vv(n=2.6){const t=new at,e=w(_.metalWhite),i=.26,o=new v(new et(n*1.03,n*1.06,i,20),w(_.concrete));o.position.y=i/2,t.add(o);const s=new v(new Rt(n,18,10,0,Math.PI*2,0,Math.PI/2),w(14676731,{opacity:.72,doubleSide:!0}));s.position.y=i,t.add(s);for(let h=0;h<8;h++){const d=new v(new ge(n,.045,5,20,Math.PI),e);d.rotation.set(0,h/8*Math.PI,0),d.position.y=i,t.add(d)}for(const h of[.34,.62,.85]){const d=n*Math.sqrt(Math.max(.02,1-h*h)),u=new v(new ge(d,.038,5,22),e);u.rotation.x=Math.PI/2,u.position.y=i+n*h,t.add(u)}for(const h of[0,1]){const d=new v(new ge(n,.09,6,18,Math.PI-.5),e);d.rotation.x=Math.PI/2,d.rotation.z=h?Math.PI+.25:.25,d.position.y=i+.04,t.add(d)}const a=new v(new Rt(.16,10,8),e);a.position.y=i+n,t.add(a);for(let h=0;h<6;h++){const d=h/6*Math.PI*2+.3,u=n*.62,p=new v(new et(.05,.06,u,6),w(_.metalGrey));p.position.set(Math.cos(d)*n*.84,i+u/2,Math.sin(d)*n*.84),t.add(p)}const r=rd(_.wood);r.scale.setScalar(.72),r.position.set(0,i,-n*.35),r.rotation.y=.25,t.add(r);const c=new v(new et(.26,.2,.36,10),w(_.plantPot));c.position.set(n*.4,i+.18,n*.35),t.add(c);const l=new v(new Xo(.34,0),w(_.leafMid));return l.position.set(n*.4,i+.55,n*.35),t.add(l),t}function rd(n=_.wood){const t=new at,e=new v(new k(1.9,.1,.55),w(n));e.position.y=.48,t.add(e);const i=new v(new k(1.9,.5,.09),w(n));i.position.set(0,.76,-.25),i.rotation.x=-.16,t.add(i);for(const o of[-1,1]){const s=new v(new k(.1,.48,.5),w(_.metalGrey));s.position.set(o*.78,.24,0),t.add(s)}return t}function ks(n=!1){const t=new at,e=new v(new et(.07,.09,3.4,8),w(_.metalGrey));e.position.y=1.7,t.add(e);const i=new v(new Rt(.3,12,10,0,Math.PI*2,0,Math.PI*.62),w(_.metalWhite));i.position.y=3.45,i.rotation.x=Math.PI,t.add(i);const o=new v(new Rt(.2,10,8),w(n?_.gold:15263968,{glow:n?.9:0}));return o.position.y=3.32,t.add(o),t}function $s(){const n=new at,t=new v(new et(.28,.24,.75,10),w(5208650));t.position.y=.38,n.add(t);const e=new v(new ge(.29,.04,6,14),w(_.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,n.add(e),n}function cd(){const n=new at,t=new v(new k(1.9,.1,1),w(_.wood));t.position.y=.76,n.add(t);for(const e of[-1,1]){const i=new v(new k(.1,.76,.9),w(_.woodDark));i.position.set(e*.75,.38,0),n.add(i);const o=new v(new k(1.9,.08,.34),w(_.wood));o.position.set(0,.45,e*.78),n.add(o);const s=new v(new k(1.6,.45,.08),w(_.woodDark));s.position.set(0,.22,e*.78),n.add(s)}return n}function Xi(n=4,t=1.1,e=_.metalGrey){const i=new at,o=Math.max(2,Math.round(n/1.2));for(let s=0;s<=o;s++){const a=new v(new et(.05,.05,t,6),w(e));a.position.set(-n/2+s/o*n,t/2,0),i.add(a)}for(const s of[t*.35,t*.8]){const a=new v(new k(n,.06,.06),w(e));a.position.y=s,i.add(a)}return i}function Hv(n=_.wood,t=_.metalWhite){const e=new at,i=new v(new et(.06,.06,1.6,6),w(_.woodDark));i.position.y=.8,e.add(i);const o=new v(new k(1.1,.7,.08),w(n));o.position.y=1.5,e.add(o);const s=new v(new k(.85,.12,.02),w(t));return s.position.set(0,1.62,.05),e.add(s),e}function ld(n=1){const t=new at,e=je(16777215,.92),i=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[o,s,a,r]of i){const c=new v(new Rt(r*n,10,8),e);c.position.set(o*n,s*n,a*n),t.add(c)}return t}function Gv(n,t,e,i){const o=new at,s=9,a=n/s,r=.35,c=1.15,l=new at;l.rotation.z=Math.PI/2;for(let u=0;u<s;u++){const p=new v(new et(t,t,a*1.02,10,1,!0,r,c),w(u%2===0?e:i,{doubleSide:!0}));p.position.y=-n/2+a*(u+.5),l.add(p)}o.add(l);const h=Math.sin(r)*t,d=Math.cos(r)*t;for(let u=0;u<s;u++){const p=new v(new Rt(a*.36,8,6),w(u%2===0?e:i));p.position.set(-n/2+a*(u+.5),h-a*.2,d),p.scale.set(1,1.15,.7),o.add(p)}return o}function Yr(n=_.fabricRed,t={}){const e=new at;e.userData.peca="quiosque";const i=t.tipo??"simples",o=_.wallCream,s=w(_.wood),a=w(_.woodDark),r=new v(new k(2.8,.16,1.9),a);r.position.y=.08,e.add(r);const c=new v(new k(2.35,1.7,1.4),w(o));c.position.set(0,1.01,-.05),e.add(c);for(const y of[-1,1]){const x=new v(new k(.26,1.7,.14),s);x.position.set(y*1.1,.99,.68),e.add(x)}const l=new v(new k(2.5,.22,.16),s);l.position.set(0,1.715,.68),e.add(l);const h=new v(new k(1.82,.44,.06),w(5981750));h.position.set(0,1.42,.66),e.add(h);const d=new v(new k(2.5,.14,.78),s);d.position.set(0,1.12,.94),e.add(d);const u=new v(new et(.075,.075,2.5,10),a);u.rotation.z=Math.PI/2,u.position.set(0,1.12,1.32),e.add(u);for(const y of[-1,1]){const x=new v(new et(.05,.05,1.05,8),w(_.metalWhite));x.position.set(y*1.18,.6,1.24),e.add(x)}const p=new v(new k(2.55,.16,1.55),a);p.position.set(0,1.92,-.05),e.add(p);const g=Gv(2.5,.44,n,o);g.position.set(0,1.54,.62),e.add(g);const M=t.texto??(i==="sorvete"?"Sorvete":i==="suco"?"Sucos":""),m=new v(new k(1.75,.5,.12),w(n));m.position.set(0,2.3,-.05),e.add(m);const f=new v(new k(1.9,.62,.08),w(o));if(f.position.set(0,2.3,-.09),e.add(f),M){const y=jo(M,1.5,.34);y.position.set(0,2.3,.02),e.add(y)}if(i==="sorvete"){const y=$r(_.morango);y.scale.setScalar(2.6),y.position.set(0,2.78,-.05),e.add(y);const x=new v(new k(1.24,.16,.56),w(_.metalWhite));x.position.set(-.58,1.26,1.06),e.add(x),[_.morango,_.maracuja,_.chocolate].forEach((C,P)=>{const L=new v(new et(.15,.13,.22,10),w(_.metalWhite));L.position.set(-1+P*.36,1.29,1.06),e.add(L);const E=new v(new Rt(.14,10,8),w(C));E.position.set(-1+P*.36,1.42,1.06),E.scale.y=.8,e.add(E)});for(let C=0;C<3;C++){const P=new v(new Pe(.1,.3,10),w(14197852));P.position.set(.72,1.34+C*.07,1.04+C*.02),P.rotation.x=Math.PI,e.add(P)}}else if(i==="suco"){const y=new v(new Rt(.32,12,10),w(_.laranja));y.position.set(0,2.85,-.05),e.add(y);const x=new v(new Rt(.13,8,6),w(_.leafMid));x.position.set(.14,3.12,-.05),x.scale.set(1.5,.4,.8),x.rotation.z=.5,e.add(x),[_.laranja,_.limao].forEach((b,D)=>{const F=new v(new et(.15,.14,.42,12,1,!0),w(_.glass,{opacity:.45,doubleSide:!0}));F.position.set(-.78+D*.42,1.4,1.06),e.add(F);const V=new v(new et(.13,.12,.28,12),w(b));V.position.set(-.78+D*.42,1.33,1.06),e.add(V);const q=new v(new et(.025,.025,.12,6),w(_.metalGrey));q.position.set(-.78+D*.42,1.26,1.2),q.rotation.x=Math.PI/2,e.add(q)});const C=new v(new et(.22,.17,.12,12),w(_.plantPot));C.position.set(.42,1.25,1.06),e.add(C);const P=[[.32,1.34,1.03,_.laranja],[.52,1.34,1.08,_.limao],[.42,1.4,1.05,_.morango]];for(const[b,D,F,V]of P){const q=new v(new Rt(.1,10,8),w(V));q.position.set(b,D,F),e.add(q)}const L=new v(new et(.09,.07,.2,10),w(o));L.position.set(.95,1.29,1.06),e.add(L),[_.morango,_.limao,_.fabricBlue].forEach((b,D)=>{const F=new v(new et(.014,.014,.34,6),w(b));F.position.set(.93+D*.03,1.44,1.06-D*.02),F.rotation.z=(D-1)*.18,e.add(F)})}const S=new v(new k(.06,.62,.5),w(3551276));S.position.set(1.16,1.3,.15),e.add(S);for(let y=0;y<3;y++){const x=new v(new k(.02,.045,.3-y*.06),w(o));x.position.set(1.205,1.46-y*.16,.15),e.add(x)}return e}function Hl(n=4,t=6,e=4,i=_.wallCream,o=_.roofTile,s=_.glass){const a=new at,r=new v(new k(n,t,e),w(i));r.position.y=t/2,a.add(r);const c=new v(new k(n+.3,.35,e+.3),w(o));c.position.y=t+.17,a.add(c);const l=Math.max(1,Math.floor(n/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let d=0;d<h;d++)for(let u=0;u<l;u++){const p=new v(new k(.65,.8,.06),w(s,{glow:.15})),g=-n/2+n/l*(u+.5),M=.9+t/h*d;p.position.set(g,M,e/2+.02),a.add(p);const m=p.clone();m.position.z=-e/2-.02,a.add(m)}return a}function qv(n=_.mesaVerde){const t=new at,e=2.6,i=1.4,o=.76,s=w(16054261),a=new v(new k(e,.06,i),w(n));a.position.y=o,t.add(a);for(const l of[-i/2+.05,i/2-.05,0]){const h=new v(new k(e-.02,.008,.05),s);h.position.set(0,o+.032,l),t.add(h)}for(const l of[-e/2+.04,e/2-.04]){const h=new v(new k(.05,.008,i-.02),s);h.position.set(l,o+.032,0),t.add(h)}const r=new v(new k(.03,.19,i+.16),w(16514556,{opacity:.72,doubleSide:!0}));r.position.y=o+.13,t.add(r);const c=new v(new k(.045,.035,i+.18),w(16777215));c.position.y=o+.225,t.add(c);for(const l of[-1.5599999999999998/2,(i+.16)/2]){const h=new v(new et(.022,.022,.24,8),w(_.metalGrey));h.position.set(0,o+.12,l),t.add(h)}for(const l of[-e/2+.22,e/2-.22]){for(const d of[-i/2+.18,i/2-.18]){const u=new v(new et(.035,.045,o,8),w(_.metalGrey));u.position.set(l,o/2,d),t.add(u)}const h=new v(new k(.05,.05,i-.36),w(_.metalGrey));h.position.set(l,o*.35,0),t.add(h)}return t}function hd(){const n=new v(new Rt(.055,12,10),w(16775398,{glow:.12}));return n.castShadow=!0,n}function Js(n=_.metalRed){const t=new at,e=new v(new et(.17,.17,.035,20),w(n));e.rotation.x=Math.PI/2,t.add(e);const i=new v(new et(.185,.185,.022,20),w(_.wood));i.rotation.x=Math.PI/2,t.add(i);const o=new v(new An(.035,.16,4,8),w(_.woodDark));return o.position.y=-.25,t.add(o),t.traverse(s=>{const a=s;a.isMesh&&(a.castShadow=!0)}),t}function dd(n=_.frisbee){const t=new v(new et(.28,.24,.07,20),w(n));return t.castShadow=!0,t}function ud(n=1){const t=new at,e=w(_.heart,{glow:.35});for(const o of[-1,1]){const s=new v(new Rt(.16*n,10,8),e);s.position.set(o*.13*n,.1*n,0),t.add(s)}const i=new v(new Pe(.22*n,.34*n,10),e);return i.position.y=-.1*n,i.rotation.x=Math.PI,t.add(i),t}function Ha(n=16184040){const t=new at,e=new v(new Rt(.22,10,8),w(n));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const i=new v(new et(.06,.08,.24,8),w(n));i.position.set(0,.28,.14),t.add(i);const o=new v(new Rt(.11,10,8),w(n));o.position.set(0,.4,.16),t.add(o);const s=new v(new Pe(.05,.14,6),w(_.gold));return s.position.set(0,.39,.28),s.rotation.x=Math.PI/2,t.add(s),t}function Zr(n=_.wallCream){const t=new at;t.userData.patins=!0;const e=.045,i=new v(new k(.13,.15,.26),w(n));i.position.set(0,e*2+.115,.01),t.add(i);const o=new v(new k(.125,.13,.15),w(n));o.position.set(0,e*2+.25,-.04),t.add(o);const s=new v(new k(.135,.04,.13),w(_.frisbee));s.position.set(0,e*2+.235,.02),t.add(s);const a=new v(new k(.1,.05,.28),w(_.metalGrey));a.position.set(0,e*2+.015,.01),t.add(a);for(const r of[-1,1])for(const c of[-1,1]){const l=new v(new et(e,e,.035,10),w(_.frisbee));l.rotation.z=Math.PI/2,l.position.set(r*.062,e,.01+c*.095),t.add(l)}return t}function Wv(n=_.fabricBlue){const t=new at,e=7.4,i=4.4,o=2.9,s=w(_.wallCream),a=w(_.wood),r=w(_.woodDark),c=w(_.metalWhite),l=new v(new k(e+1.6,.18,i+1.4),w(_.concrete));l.position.set(.4,.09,.3),t.add(l);const h=new v(new k(e,o,.26),s);h.position.set(0,.18+o/2,-i/2),t.add(h);for(const b of[-1,1]){const D=new v(new k(.26,o,i),s);D.position.set(b*(e/2-.13),.18+o/2,0),t.add(D)}const d=new v(new k(e,.6,.3),r);d.position.set(0,.48,i/2-.1),t.add(d);const u=w(_.glass,{opacity:.5,doubleSide:!0}),p=3,g=e-.5,M=g/p-.16;for(let b=0;b<p;b++){const D=-g/2+g/p*(b+.5),F=new v(new k(M,1.75,.08),u);F.position.set(D,1.68,i/2-.1),t.add(F)}for(let b=0;b<=p;b++){const D=-g/2+g/p*b,F=new v(new k(.14,2.05,.22),c);F.position.set(D,1.68,i/2-.1),t.add(F)}const m=new v(new k(e,.18,.24),c);m.position.set(0,2.68,i/2-.1),t.add(m);for(const[b,D]of[[1.15,[_.morango,_.fabricBlue,_.gold]],[1.95,[_.maracuja,_.wallCream]]]){const F=new v(new k(e-1.2,.1,.6),a);F.position.set(0,b,i/2-.75),t.add(F),D.forEach((V,q)=>{const W=new at;for(const j of[-1,1]){const N=Zr(V);N.position.x=j*.09,W.add(N)}W.scale.setScalar(.8),W.position.set((q-(D.length-1)/2)*1.5,b+.05,i/2-.75),W.rotation.y=.3,t.add(W)})}const f=new v(new k(e+1.1,.24,i+1.3),r);f.position.set(0,o+.42,.35),f.rotation.x=-.07,t.add(f);const S=new v(new k(e+1.34,.08,i+1.54),c);S.position.set(0,o+.29,.35),S.rotation.x=-.07,t.add(S);const y=new v(new k(e+1.34,.74,.22),w(n));y.position.set(0,o+.46,i/2+1.18),t.add(y);const x=jo("Patins",3.2,.46);x.position.set(0,o+.46,i/2+1.31),t.add(x);for(const b of[-1,1]){const D=new v(new et(.09,.09,o+.3,8),c);D.position.set(b*(e/2+.35),(o+.3)/2,i/2+.62),t.add(D)}const A=e/2+.95,C=new v(new k(1.15,.16,3),a);C.position.set(A,1.06,.2),t.add(C);const P=new v(new et(.08,.08,3,10),r);P.position.set(A+.55,1.06,.2),t.add(P);const L=new v(new k(.9,.9,2.8),s);L.position.set(A-.1,.6,.2),t.add(L);const E=new v(new k(1.7,.16,3.2),w(n));E.position.set(A+.1,2.35,.2),t.add(E);for(const b of[-1.2,1.5]){const D=new v(new et(.07,.07,2.35,8),c);D.position.set(A+.6,1.17,.2+b),t.add(D)}return[_.morango,_.gold].forEach((b,D)=>{const F=new at;for(const V of[-1,1]){const q=Zr(b);q.position.x=V*.09,F.add(q)}F.position.set(A,1.14,-.55+D*1.4),F.rotation.y=Math.PI/2+.2,t.add(F)}),t}function Gl(){const n=new at,t=new v(new k(.34,.05,.34),w(_.frisbee));t.position.y=.025,n.add(t);const e=new v(new Pe(.15,.45,10),w(_.frisbee));e.position.y=.26,n.add(e);const i=new v(new et(.1,.12,.09,10),w(16777215));return i.position.y=.28,n.add(i),n}function Xv(n,t,e=1.5){const i=new at,o=w(10475752),s=.12,a=new v(new k(n,s,t),w(4165552));a.position.y=-e,a.receiveShadow=!0,i.add(a);for(const[r,c,l,h]of[[n,s,0,-t/2],[n,s,0,t/2],[s,t,-n/2,0],[s,t,n/2,0]]){const d=new v(new k(r,e,c),o);d.position.set(l,-e/2,h),d.receiveShadow=!0,i.add(d)}for(const[r,c,l,h]of[[n+.3,.18,0,-t/2-.12],[n+.3,.18,0,t/2+.12],[.18,t+.3,-n/2-.12,0],[.18,t+.3,n/2+.12,0]]){const d=new v(new k(r,.06,c),w(4951989));d.position.set(l,.02,h),i.add(d)}return i}function jv(n,t){const e=new v(new ze(n,t,12,8),new Zh({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function ql(n=_.fabricBlue){const t=new at,e=new v(new k(.68,.07,1.7),w(_.metalWhite));e.position.y=.36,t.add(e);const i=new v(new k(.6,.06,1.5),w(n));i.position.y=.42,t.add(i);const o=new v(new k(.6,.06,.7),w(n));o.position.set(0,.6,-.75),o.rotation.x=-.75,t.add(o);for(const[s,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new v(new et(.035,.035,.36,6),w(_.metalWhite));r.position.set(s*.3,.18,a*.72),t.add(r)}return t}function Ga(n=_.fabricRed){const t=new at,e=new v(new et(.32,.36,.12,12),w(_.concrete));e.position.y=.06,t.add(e);const i=new v(new et(.045,.045,2.4,8),w(_.wood));i.position.y=1.2,t.add(i);const o=new v(new Pe(1.15,.5,12),w(n));o.position.y=2.35,t.add(o);const s=new v(new Pe(1.17,.18,12,1,!0),w(16777215,{doubleSide:!0}));s.position.y=2.2,t.add(s);const a=new v(new Rt(.07,8,6),w(_.gold));return a.position.y=2.62,t.add(a),t}function Yv(){const n=new at;for(const t of[-.24,.24]){const e=new v(new ge(.22,.035,6,14,Math.PI),w(_.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),n.add(e);const i=new v(new et(.035,.035,1.5,8),w(_.metalGrey));i.position.set(t,.05,-.44),n.add(i)}for(let t=0;t<3;t++){const e=new v(new k(.5,.05,.1),w(_.metalGrey));e.position.set(0,-.15-t*.34,-.44),n.add(e)}return n}function qa(n=_.frisbee){const t=new at,e=new v(new ge(.42,.16,10,20),w(n));e.rotation.x=Math.PI/2,t.add(e);for(let i=0;i<4;i++){const o=i/4*Math.PI*2+Math.PI/4,s=new v(new ge(.42,.165,10,6,Math.PI/5),w(16777215));s.rotation.set(Math.PI/2,0,o),t.add(s)}return t}function Zv(){const n=new at,t=new v(new et(.22,.26,.1,12),w(_.concrete));t.position.y=.05,n.add(t);const e=new v(new et(.05,.05,2.2,8),w(_.metalGrey));e.position.y=1.1,n.add(e);const i=new v(new k(.5,.07,.07),w(_.metalGrey));i.position.set(.22,2.16,0),n.add(i);const o=new v(new et(.16,.12,.1,12),w(_.metalWhite));return o.position.set(.44,2.08,0),n.add(o),n}function $v(){const n=new at,t=new v(new k(.7,.8,.7),w(_.concrete));t.position.y=.4,n.add(t);const e=new v(new k(.62,.1,2.4),w(15791350));e.position.set(0,.85,1),n.add(e);for(const i of[-.36,.36]){const o=new v(new ge(.35,.04,6,14,Math.PI),w(_.metalGrey));o.position.set(i,.9,.1),o.rotation.set(0,Math.PI/2,0),n.add(o)}return n}function $r(n=_.flowerPink){const t=new at,e=new v(new Pe(.075,.22,10),w(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const i=new v(new Rt(.085,10,8),w(n));i.position.y=.13,t.add(i);const o=new v(new Rt(.06,8,7),w(n));return o.position.set(.03,.22,-.02),t.add(o),t}function Wl(n=_.laranja){const t=new at;t.userData.suco=!0;const e=new v(new et(.088,.062,.26,12),w(n));e.position.y=.13,t.add(e);const i=new v(new et(.095,.09,.035,12),w(16645110));i.position.y=.25,t.add(i);const o=new v(new et(.066,.066,.025,12),w(16645110));o.position.y=.012,t.add(o);const s=new v(new et(.012,.012,.32,6),w(16645110));s.position.set(.04,.31,.014),s.rotation.z=-.34,t.add(s);const a=new v(new et(.052,.052,.014,10),w(_.gold));return a.position.set(-.085,.26,0),a.rotation.x=Math.PI/2,a.rotation.z=.3,t.add(a),t}function Xl(n=_.metalGrey){const t=new at,e=new v(new et(.07,.09,1.5,10),w(n));e.position.y=.75,t.add(e);const i=new v(new et(.52,.38,.42,14,1,!0),w(n));i.position.y=1,t.add(i);const o=new v(new ge(.62,.045,6,20),w(n));o.position.y=1.72,o.rotation.x=Math.PI/2,t.add(o);const s=new v(new et(.1,.1,.3,8),w(n));s.position.y=1.9,t.add(s);for(let a=0;a<10;a++){const r=a/10*Math.PI*2,c=new v(new et(.015,.015,.62,4),w(13226198));c.position.set(Math.cos(r)*.5,1.4,Math.sin(r)*.5),t.add(c)}return t}function Jv(n=_.frisbee,t=1.9,e=.62){const i=new at,o=e+.34,s=new v(new et(.06,.08,t+e,10),w(n));s.position.set(-o,(t+e)/2,0),i.add(s);const a=new v(new et(.24,.3,.12,12),w(_.metalGrey));a.position.set(-o,.06,0),i.add(a);const r=new v(new k(.36,.07,.07),w(n));r.position.set(-o+.18,t,0),i.add(r);const c=new v(new ge(e,.06,8,26),w(n));c.position.y=t,i.add(c);for(const l of[-.9,-.3,.3,.9]){const h=new v(new k(.05,.34,.02),je(_.gold));h.position.set(Math.sin(l)*e,t-Math.cos(l)*e-.17,0),i.add(h)}return i.traverse(l=>{const h=l;h.isMesh&&(h.castShadow=!0)}),i.userData.aro=c,i}function Kv(n=_.frisbee){const t=new at,e=je(n,.92),i=new v(new ge(.86,.075,8,28),e);i.rotation.x=-Math.PI/2,i.position.y=.08,t.add(i);const o=new v(new et(.15,.15,.07,14),e);o.position.y=.08,t.add(o);for(let a=0;a<4;a++){const r=a/4*Math.PI*2+Math.PI/4,c=new v(new k(.1,.07,.36),e);c.rotation.y=r,c.position.set(Math.sin(r)*1.3,.08,Math.cos(r)*1.3),t.add(c)}const s=new v(new k(.07,1.5,.07),e);return s.position.y=.75,t.add(s),t}function Qv(){const n=new at;for(const i of[-.8,.8]){const o=new v(new k(.12,1.5,.12),w(_.woodDark));o.position.set(i,.75,0),n.add(o)}const t=new v(new k(2,1.2,.12),w(_.wood));t.position.y=2,n.add(t);const e=new v(new k(1.8,.22,.03),w(_.frisbee));e.position.set(0,2.45,.08),n.add(e);for(const i of[-.45,.45]){const o=new v(new k(.55,.6,.03),w(2830136));o.position.set(i,1.9,.08),n.add(o)}return n}function fd(n=4){const t=new at;t.userData.peca="arquibancada";const e=.5;for(let i=0;i<3;i++){const o=.25+i*.34,s=new v(new k(n,.16,e+.04),w(i%2===0?_.metalWhite:_.metalGrey));s.position.set(0,o,-i*e),t.add(s);const a=new v(new k(n-.08,o,.1),w(_.metalGrey));a.position.set(0,o/2,-i*e-.19),t.add(a)}return t}function pd(){const n=new at,t=new v(new k(.42,.95,.36),w(_.concrete));t.position.y=.48,n.add(t);const e=new v(new et(.17,.14,.12,12),w(_.metalWhite));e.position.set(0,1,.05),n.add(e);const i=new v(new et(.03,.03,.16,8),w(_.metalGrey));return i.position.set(0,1.12,-.06),i.rotation.x=.5,n.add(i),n}function t1(){const n=new at,t=new v(new k(.5,.4,.34),w(4871528));t.position.y=.2,n.add(t);const e=new v(new ge(.16,.028,6,14,Math.PI),w(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,n.add(e),[_.frisbee,6271190,16767070].forEach((o,s)=>{const a=new v(new et(.2,.18,.05,16),w(o));a.position.set(.34+s*.02,.06+s*.06,.22),a.rotation.z=.12,n.add(a)}),n}function md(){const n=new at,t=new v(new et(.1,.14,5.5,8),w(_.metalGrey));t.position.y=2.75,n.add(t);const e=new v(new k(.9,.1,.1),w(_.metalGrey));e.position.set(.35,5.5,0),n.add(e);for(const i of[.1,.6]){const o=new v(new k(.42,.3,.22),w(3883600));o.position.set(i,5.62,0),o.rotation.z=-.35,n.add(o);const s=new v(new k(.36,.24,.03),w(16773324,{glow:.25}));s.position.set(i+.04,5.52,0),s.rotation.z=-.35,n.add(s)}return n}function e1(){const n=new at,t=new v(new et(.05,.06,3,8),w(_.metalGrey));t.position.y=1.5,n.add(t);const e=new at;return e.position.y=2.9,[_.frisbee,16777215,_.frisbee,16777215].forEach((o,s)=>{const a=.26-s*.04,r=.22-s*.04,c=new v(new et(a,r,.3,12,1,!0),w(o,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+s*.3,e.add(c)}),n.add(e),n.userData.manga=e,n}function jo(n,t,e,i="#ffffff"){const o=document.createElement("canvas");o.width=384,o.height=Math.max(64,Math.round(384*e/t));const s=o.getContext("2d");s&&(s.clearRect(0,0,o.width,o.height),s.fillStyle=i,s.font=`bold ${Math.round(o.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(n,o.width/2,o.height/2+4));const a=new hf(o);return a.colorSpace=on,new v(new ze(t,e),new na({map:a,transparent:!0}))}function Jr(n,t=_.fabricBlue,e="#ffffff"){const i=new at,o=new v(new et(.08,.08,2.4,8),w(_.metalGrey));o.position.y=1.2,i.add(o);const s=2.1,a=.9,r=new v(new k(s,a,.1),w(t));r.position.y=2.45,i.add(r);const c=new v(new k(s+.12,a+.12,.06),w(_.metalWhite));c.position.set(0,2.45,-.03),i.add(c);const l=jo(n,s*.86,a*.68,e);return l.position.set(0,2.45,.06),i.add(l),i}function gd(n=4161494){const t=new at,e=8.4,i=2.6,o=2.5,s=new v(new k(e,i,o),w(n));s.position.y=1.55,t.add(s);const a=new v(new k(e-.2,.22,o-.15),w(_.metalWhite));a.position.y=2.9,t.add(a);const r=new v(new k(e+.04,.3,o+.04),w(_.metalWhite));r.position.y=.6,t.add(r);for(const h of[o/2+.02,-o/2-.02])for(let d=0;d<4;d++){const u=new v(new k(1.5,.9,.05),w(_.glass,{glow:.12}));u.position.set(-e/2+1.4+d*1.85,2.1,h),t.add(u)}for(const[h,d]of[[e/2+.02,0],[-e/2-.02,0]]){const u=new v(new k(.05,1.1,o-.5),w(_.glass,{glow:.12}));u.position.set(h,2.1,0),u.rotation.y=d,t.add(u)}const c=new v(new k(.06,1.9,1),w(2831424));c.position.set(e/2-1.6,1.2,o/2+.02),t.add(c);const l=new v(new k(1.6,.34,.05),w(2040361));l.position.set(e/2-.4,2.75,o/2+.02),t.add(l);for(const[h,d]of[[e/2-1.9,o/2],[e/2-1.9,-o/2],[-e/2+1.6,o/2],[-e/2+1.6,-o/2]]){const u=new v(new et(.55,.55,.35,14),w(2237482));u.position.set(h,.5,d),u.rotation.x=Math.PI/2,t.add(u);const p=new v(new et(.24,.24,.38,12),w(_.metalGrey));p.position.set(h,.5,d),p.rotation.x=Math.PI/2,t.add(p)}return t}function vd(n=_.metalGrey){const t=new at;for(const s of[-1.5,1.5]){const a=new v(new et(.07,.07,2.5,8),w(n));a.position.set(s,1.25,-.6),t.add(a)}const e=new v(new k(3.6,.12,1.6),w(n));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const i=new v(new k(3.6,1.6,.08),w(_.glass,{glow:.08}));i.position.set(0,1.35,-1.15),t.add(i);const o=new v(new k(3,.1,.4),w(_.wood));o.position.set(0,.5,-.9),t.add(o);for(const s of[-1.2,1.2]){const a=new v(new k(.08,.5,.36),w(n));a.position.set(s,.25,-.9),t.add(a)}return t}function n1(n=_.restauranteToldo){const t=new at;t.userData.peca="cadeira-de-patio";const e=w(_.metalWhite),i=new v(new k(.46,.07,.44),w(n));i.position.y=.45,t.add(i);for(let o=0;o<3;o++){const s=new v(new k(.42,.08,.05),w(n));s.position.set(0,.62+o*.13,-.2),t.add(s)}for(const o of[-1,1]){const s=new v(new et(.022,.022,.55,6),e);s.position.set(o*.21,.7,-.21),t.add(s)}for(const[o,s]of[[-.19,.18],[.19,.18],[-.19,-.18],[.19,-.18]]){const a=new v(new et(.024,.024,.45,6),e);a.position.set(o,.22,s),a.rotation.z=-Math.sign(o)*.05,a.rotation.x=Math.sign(s)*.05,t.add(a)}return t}function i1(n=_.restauranteToldo){const t=new at;t.userData.peca="mesa-de-patio";const e=new v(new et(.62,.62,.07,20),w(_.metalWhite));e.position.y=.74,t.add(e);const i=new v(new ge(.62,.035,6,20),w(n));i.rotation.x=Math.PI/2,i.position.y=.72,t.add(i);const o=new v(new et(.07,.09,.72,10),w(_.metalGrey));o.position.y=.36,t.add(o);const s=new v(new et(.34,.38,.06,14),w(_.metalGrey));s.position.y=.03,t.add(s);const a=new v(new et(.07,.05,.16,10),w(_.plantPot));a.position.y=.855,t.add(a);for(const[r,c,l]of[[0,0,.16],[.05,.03,.12],[-.04,-.04,.13]]){const h=new v(new Rt(.05,8,6),w(_.flowerPink));h.position.set(r,.93+l*.5,c),t.add(h)}for(let r=0;r<4;r++){const c=n1(n),l=r*Math.PI/2;c.position.set(Math.sin(l)*1.02,0,Math.cos(l)*1.02),c.rotation.y=l+Math.PI,t.add(c)}return t}function o1(n=13,t=7){const e=new at;e.userData.peca="restaurante";const i=n/2,o=t/2,s=4.2,a=w(_.restauranteParede),r=w(_.restauranteEsquadria),c=w(_.glass,{glow:.14}),l=new v(new k(n+.5,.34,t+.5),w(_.concrete));l.position.y=.17,e.add(l);const h=new v(new k(n,s,t),a);h.position.y=.34+s/2,e.add(h);const d=new v(new k(n+.06,.28,t+.06),w(_.restauranteFaixa));d.position.y=1.16,e.add(d);const u=o+.03,p=2.4,g=(ft,St,Dt,Kt,rt=u)=>{const ut=new v(new k(St,Dt,.1),r);ut.position.set(ft,Kt,rt),e.add(ut);const Ut=new v(new k(St-.22,Dt-.22,.08),c);Ut.position.set(ft,Kt,rt+.03),e.add(Ut);const Gt=new v(new k(.09,Dt-.16,.12),r);Gt.position.set(ft,Kt,rt+.04),e.add(Gt)};for(const ft of[-1,1]){g(ft*(p/2+1.55),2.5,2,2.1),g(ft*(p/2+4.35),2.5,2,2.1);for(const St of[p/2+1.55,p/2+4.35]){const Dt=new v(new k(2.3,.3,.34),w(_.plantPot));Dt.position.set(ft*St,1.02,u+.16),e.add(Dt);for(let Kt=0;Kt<5;Kt++){const rt=new v(new Rt(.17,8,6),w(_.bush));rt.position.set(ft*St-.85+Kt*.42,1.24,u+.16),e.add(rt);const ut=new v(new Rt(.07,6,5),w(Kt%2?_.flowerYellow:_.flowerPink));ut.position.set(ft*St-.85+Kt*.42,1.38,u+.2),e.add(ut)}}}const M=new v(new k(p+.34,2.5,.14),r);M.position.set(0,1.53,u),e.add(M);for(const ft of[-1,1]){const St=new v(new k(p/2-.07,2.3,.07),c);St.position.set(ft*(p/4+.02),1.47,u+.02),e.add(St);const Dt=new v(new et(.03,.03,.9,6),w(_.metalGrey));Dt.position.set(ft*.16,1.35,u+.09),e.add(Dt)}for(const[ft,St]of[[0,p+1.4],[1,p+2]]){const Dt=new v(new k(St,.17+ft*.02,.42),w(_.concrete));Dt.position.set(0,.25-ft*.17,o+.28+ft*.4),e.add(Dt)}const m=3.15,f=.7,S=n-1.2,y=13,x=S/y;for(let ft=0;ft<y;ft++){const St=new v(new k(x,.12,f),w(ft%2?_.metalWhite:_.restauranteToldo));St.position.set(-S/2+x*(ft+.5),m,o+f/2),St.rotation.x=-.12,e.add(St);const Dt=new v(new Pe(x*.5,.26,3),w(ft%2?_.metalWhite:_.restauranteToldo));Dt.rotation.x=Math.PI,Dt.position.set(-S/2+x*(ft+.5),m-.13,o+f-.02),e.add(Dt)}for(const ft of[-1,1]){const St=new v(new et(.04,.04,.95,6),w(_.metalGrey));St.position.set(ft*(S/2-.1),m-.35,o+.4),St.rotation.x=Math.PI/2.6,e.add(St)}const A=4.05,C=new v(new k(5.2,.7,.16),w(_.restauranteEsquadria));C.position.set(0,A,o+.06),e.add(C);const P=new v(new k(5.36,.84,.1),w(_.restauranteToldo));P.position.set(0,A,o+.02),e.add(P);const L=jo("Restaurante",4.5,.56,"#fdf6e8");L.position.set(0,A,o+.15),e.add(L);for(const ft of[-1,1]){const St=new v(new et(.03,.03,.2,6),w(_.metalGrey));St.rotation.x=Math.PI/2,St.position.set(ft*(p/2+.42),2.5,o+.13),e.add(St);const Dt=new v(new Rt(.15,8,6),w(_.gold,{glow:.5}));Dt.position.set(ft*(p/2+.42),2.44,o+.24),e.add(Dt)}const E=.34+s,b=1.1,F=o+.55,V=Math.atan2(b,F),q=Math.hypot(F,b);for(const ft of[-1,1]){const St=new v(new k(n+1,.18,q),w(_.roofTile));St.position.set(0,E+b/2,ft*F/2),St.rotation.x=ft*V,e.add(St)}const W=new v(new k(n+1.06,.2,.42),w(_.roofTile));W.position.set(0,E+b+.06,0),e.add(W);const j=new Wo;j.moveTo(-o,0),j.lineTo(o,0),j.lineTo(0,b),j.closePath();const N=new oa(j,{depth:.3,bevelEnabled:!1});for(const ft of[-1,1]){const St=new v(N,a);St.rotation.y=Math.PI/2,St.position.set(ft>0?i-.3:-i,E,0),e.add(St)}const B=new v(new k(.7,1.5,.7),w(_.brick));B.position.set(i-2.2,E+1.2,-o*.35),e.add(B);const K=new v(new k(.9,.14,.9),w(_.concrete));K.position.set(i-2.2,E+2,-o*.35),e.add(K);const X=new v(new et(.34,.34,.85,10),w(_.metalGrey));X.position.set(i-4,E+.95,-o*.2),e.add(X);const ht=new v(new Pe(.46,.3,10),w(_.metalGrey));ht.position.set(i-4,E+1.5,-o*.2),e.add(ht);for(let ft=0;ft<3;ft++){const St=new v(new k(.1,.8,1),c);St.position.set(i+.03,2.5,-o+1.4+ft*1.9),e.add(St);const Dt=new v(new k(.16,.94,1.14),r);Dt.position.set(i+.005,2.5,-o+1.4+ft*1.9),e.add(Dt)}for(const ft of[-1.3,.9]){const St=new v(new k(.42,.62,.78),w(_.metalWhite));St.position.set(i+.24,1.7,ft),e.add(St);const Dt=new v(new et(.24,.24,.05,12),w(_.metalGrey));Dt.rotation.z=Math.PI/2,Dt.position.set(i+.46,1.72,ft),e.add(Dt)}return e}function s1(n=8,t=5){const e=new at;e.userData.peca="vestiario";const i=n/2,o=t/2,s=3,a=.25,r=a+s,c=w(_.wallCream),l=w(_.vestiarioAzulejo),h=w(_.concrete),d=new v(new k(n+.4,a,t+.4),h);d.position.y=a/2,e.add(d);const u=new v(new k(n,s,t),c);u.position.y=a+s/2,e.add(u);const p=1.15,g=new v(new k(n+.08,p,t+.08),l);g.position.y=.18+p/2,e.add(g);for(const j of[.58,.92]){const N=new v(new k(n+.12,.05,t+.12),w(_.vestiarioRejunte));N.position.y=j,e.add(N)}const M=new v(new k(n+.16,.09,t+.16),w(_.metalWhite));M.position.y=1.33,e.add(M);const m=o+.03,f=1.05;for(const j of[-1,1]){const N=j*1.15,B=new v(new k(f+.26,2.36,.13),h);B.position.set(N,1.16,m),e.add(B);const K=new v(new k(f,2.16,.09),w(_.vestiarioPorta));K.position.set(N,1.12,m+.04),e.add(K);for(let ft=0;ft<6;ft++){const St=new v(new k(f-.18,.08,.05),w(_.vestiarioRejunte));St.position.set(N,.42+ft*.16,m+.09),St.rotation.x=.35,e.add(St)}const X=new v(new Rt(.055,8,6),w(_.metalGrey));X.position.set(N-j*(f/2-.14),1.05,m+.11),e.add(X);const ht=new v(new k(.5,.3,.05),w(_.metalWhite));ht.position.set(N,2.44,m+.05),e.add(ht)}const S=2.75,y=.7,x=new v(new k(n-1,.16,y),h);x.position.set(0,S,o+y/2),e.add(x);const A=new v(new k(n-1.1,.42,.1),w(_.vestiarioPorta));A.position.set(0,S-.17,o+y),e.add(A);const C=jo("Vestiário",2.6,.3,"#fdf6e8");C.position.set(0,S-.13,o+y+.06),e.add(C);for(const j of[-1,1]){const N=new v(new k(.1,.62,.1),h);N.position.set(j*(n/2-.85),S-.38,o+.14),N.rotation.x=-.6,e.add(N)}const P=(j,N,B,K)=>{const X=new v(new k(K?.14:.34,.34,K?.34:.14),c);X.position.set(j,N,B),e.add(X);const ht=new v(new ge(.1,.035,6,10),w(_.wallAzul));ht.position.set(j+(K?.02:0),N,B+(K?0:.02)),K&&(ht.rotation.y=Math.PI/2),e.add(ht)};for(const j of[-1,1])for(let N=0;N<2;N++)P(j*(i-.45-N*.42),2.52,m+.05,!1);for(let j=0;j<6;j++)P(i+.05,2.52,-o+.7+j*.7,!0);const L=new v(new k(n+.5,.22,t+.5),h);L.position.y=r+.11,e.add(L);for(const[j,N,B,K]of[[0,o+.1,n+.5,.14],[0,-o-.1,n+.5,.14],[i+.13,0,.14,t-.1],[-i-.13,0,.14,t-.1]]){const X=new v(new k(B,.4,K),c);X.position.set(j,r+.42,N),e.add(X)}const E=new v(new k(1.5,.4,1.5),h);E.position.set(-i+1.6,r+.42,-o+1.5),e.add(E);const b=new v(new et(.72,.62,.95,14),w(_.vestiarioCaixa));b.position.set(-i+1.6,r+1.1,-o+1.5),e.add(b);const D=new v(new et(.5,.5,.14,12),w(_.metalGrey));D.position.set(-i+1.6,r+1.63,-o+1.5),e.add(D);const F=new v(new et(.07,.07,r+.3,8),w(_.metalWhite));F.position.set(-i-.14,(r+.3)/2,o-.5),e.add(F);const V=new v(new et(.07,.07,.4,8),w(_.metalWhite));V.rotation.z=Math.PI/2,V.position.set(-i-.3,.28,o-.5),e.add(V);const q=new v(new et(.04,.04,.34,6),w(_.metalGrey));q.position.set(i-.6,.62,m+.16),q.rotation.x=.9,e.add(q);const W=new v(new Rt(.09,8,6),w(_.metalRed));return W.position.set(i-.6,.82,m+.06),e.add(W),e}function a1(n){const t=new at,e=n.headR,i=e*1.07,o=Math.PI*.54,s=e*.06,a=new v(new Rt(i,18,12,0,Math.PI*2,0,o),w(_.roupaLa));a.position.y=s,a.scale.y=1.16,t.add(a);const r=s+i*Math.cos(o)*1.16,c=i*Math.sin(o),l=new v(new et(c*1.03,c*1.03,e*.26,18),w(_.roupaLaBarra));l.position.y=r,t.add(l);const h=new v(new Rt(e*.2,10,8),w(_.roupaLaBarra));return h.position.y=s+i*1.16,t.add(h),t}function r1(n){const t=new at,e=new v(new et(n.h*.05*n.w,n.h*.055*n.w,n.h*.08,12),w(_.roupaBotaCano));e.position.y=-n.legH+n.h*.075,t.add(e);const i=new v(new et(n.h*.058*n.w,n.h*.058*n.w,n.h*.018,12),w(_.roupaBota));return i.position.y=-n.legH+n.h*.113,t.add(i),t}function Xn(n,t,e=t){const i=new at;for(const s of[-1,1]){const a=new v(new Rt(n*.86,9,7),w(t));a.position.x=s*n*.86,a.scale.set(1.05,.72,.42),i.add(a);const r=new v(new k(n*.34,n*1.5,n*.14),w(t));r.position.set(s*n*.42,-n*.95,0),r.rotation.z=s*.32,i.add(r)}const o=new v(new Rt(n*.3,8,6),w(e));return o.scale.z=.7,i.add(o),i}function ai(n,t,e,i=.85){const o=new at,s=w(e),a=t*.6,r=Math.max(8,Math.ceil(2*Math.PI*n/(a*1.25)));for(let c=0;c<r;c++){const l=c/r*Math.PI*2,h=new v(new Rt(a,7,6),s);h.position.set(Math.sin(l)*n,0,Math.cos(l)*n*i),h.scale.set(1,.88,.34),h.rotation.y=l,o.add(h)}return o}function jl(n,t,e,i=3){const o=new at,s=w(e),a=t/i,r=Math.hypot(n,a);for(let c=0;c<i;c++)for(const l of[-1,1]){const h=new v(new k(r,t*.07,t*.05),s);h.position.y=-t/2+a*(c+.5),h.rotation.z=l*Math.atan2(a,n),o.add(h)}return o}function _d(n,t){const e=new v(new Rt(n,12,10),w(t));return e.scale.set(1,.82,.92),e}function c1(n){const t=new at,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=.85,r=w(_.vestidoRosa),c=w(_.vestidoRenda,{doubleSide:!0}),l=w(_.vestidoFita),h=new v(new et(s*1.1,s*1.06,e*.035,18,1,!0),c);h.position.y=o+n.torsoH*.78,h.scale.z=a,t.add(h);for(const x of[-1,1]){const A=new v(new ge(e*.042*i,e*.016,6,14),c);A.position.set(x*e*.1*i,o+n.torsoH*.84,0),A.rotation.set(Math.PI/2,0,x*.3),A.scale.z=.8,t.add(A)}const d=Xn(e*.04,_.vestidoFita,_.vestidoRenda);d.position.set(0,o+n.torsoH*.62,s*.9),t.add(d);const u=new v(new et(s*1.08,s*1.08,e*.03,18,1,!0),l);u.position.y=o+n.torsoH*.16,u.scale.z=a,t.add(u);const p=Xn(e*.036,_.vestidoRosa,_.vestidoFita);p.position.set(0,o+n.torsoH*.14,s*.92),t.add(p);const g=o+n.torsoH*.1,M=o-e*.13,m=s*2,f=new v(new et(s*1.02,m*.82,g-M-e*.05,20,1,!0),r);f.position.y=(g+M+e*.05)/2,f.scale.z=a,t.add(f);const S=new v(new et(m*.78,m,e*.08,20,1,!0),r);S.position.y=M+e*.04,S.scale.z=a,t.add(S);const y=new v(new et(m*1.04,m*1.12,e*.032,20,1,!0),c);y.position.y=M,y.scale.z=a,t.add(y);for(const x of[-.9,0,.9]){const A=Xn(e*.022,_.vestidoFita,_.vestidoRenda);A.position.set(Math.sin(x)*m*.92,M+e*.055,Math.cos(x)*m*.92*a),A.rotation.y=x,t.add(A)}return t}function l1(n){const t=new at,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=e*.1*i,c=.85,l=w(_.maidCreme),h=w(_.maidCreme,{doubleSide:!0}),d=w(_.maidFita),u=o+n.torsoH*.12,p=o-e*.14,g=s*2,M=new v(new et(s*1.04,g,u-p,20,1,!0),w(_.maidPreto,{doubleSide:!0}));M.position.y=(u+p)/2,M.scale.z=c,t.add(M);const m=new v(new et(g*1.01,g*1.06,e*.038,20,1,!0),h);m.position.y=p+e*.016,m.scale.z=c,t.add(m);const f=ai(g*1.04,e*.03,_.maidCreme,c);f.position.y=p-e*.008,t.add(f);const S=o+n.torsoH*.16,y=o-e*.045,x=new v(new et(s*1.06,g*.86,S-y,16,1,!0,-1.15,2.3),h);x.position.y=(S+y)/2,x.scale.z=c,t.add(x);const A=ai(g*.88,e*.034,_.maidCreme,c);A.position.y=y,t.add(A);const C=o+n.torsoH*.2,P=new v(new et(s*1.1,s*1.1,e*.055,18,1,!0),h);P.position.y=C,P.scale.z=c,t.add(P);for(const V of[-1,1]){const q=jl(e*.03,e*.045,_.maidFita,3);q.position.set(V*s*.5,C,s*.92),t.add(q);const W=Xn(e*.017,_.maidFita);W.position.set(V*s*.5,C-e*.028,s*.96),t.add(W)}for(const V of[-1,1]){const q=new v(new k(e*.055*i,a-C,e*.02),l);q.position.set(V*s*.62,(a+C)/2,s*.7),q.rotation.y=-V*.5,t.add(q);const W=new v(new k(e*.022*i,a-C,e*.03),h);W.position.set(V*s*.98,(a+C)/2,s*.4),W.rotation.y=-V*.95,t.add(W)}const L=new v(new k(s*.9,n.torsoH*.24,e*.014),l);L.position.set(0,o+n.torsoH*.4,s*.8),t.add(L);const E=jl(s*.55,n.torsoH*.2,_.maidFita,4);E.position.set(0,o+n.torsoH*.4,s*.87),t.add(E);const b=o+n.torsoH*.68;for(const V of[-1,1]){const q=new v(new k(e*.1*i,n.torsoH*.46,e*.012),l);q.position.set(V*e*.06*i,b,s*.82),q.rotation.z=V*.34,t.add(q);const W=new v(new k(e*.007,n.torsoH*.4,e*.006),d);W.position.set(V*e*.088*i,b+n.torsoH*.02,s*.88),W.rotation.z=V*.34,t.add(W);const j=new v(new k(e*.075*i,e*.012,s*1.5),l);j.position.set(V*r*.86,a+e*.012,0),j.rotation.z=V*.16,t.add(j)}const D=new v(new k(e*.24*i,n.torsoH*.36,e*.014),l);D.position.set(0,o+n.torsoH*.74,-s*.8),t.add(D);const F=new v(new k(e*.24*i,e*.011,e*.006),d);F.position.set(0,o+n.torsoH*.57,-s*.87),t.add(F);for(const V of[-1,1]){const q=_d(e*.055*i,_.maidCreme);q.position.set(V*r,a-e*.012,0),t.add(q)}return t}function h1(n){const t=new at,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=e*.1*i,c=.85,l=w(_.maidCreme),h=w(_.maidCreme,{doubleSide:!0}),d=w(_.maidFita),u=o+n.torsoH*.12,p=o-e*.14,g=s*2,M=new v(new et(s*1.04,g,u-p,20,1,!0),w(_.maidPreto,{doubleSide:!0}));M.position.y=(u+p)/2,M.scale.z=c,t.add(M);const m=ai(g*1.02,e*.036,_.maidPreto,c);m.position.y=p+e*.004,t.add(m);const f=o+n.torsoH*.26,S=o-e*.055,y=new v(new et(s*1.04,g*.9,f-S,16,1,!0,-1.2,2.4),h);y.position.y=(f+S)/2,y.scale.z=c,t.add(y);const x=ai(g*.92,e*.036,_.maidCreme,c);x.position.y=S,t.add(x);const A=new at,C=new v(new Rt(e*.011,8,6),d);C.scale.set(1,1.15,.3),A.add(C);for(let B=0;B<3;B++){const K=new v(new Rt(e*.005,6,5),d);K.position.set((B-1)*e*.012,e*.016,0),K.scale.z=.3,A.add(K)}A.position.set(g*.42,o-e*.005,g*.72*c),A.rotation.y=.5,t.add(A);const P=n.torsoH*.3,L=f+P*.5,E=s*1.62,b=s*.84,D=new v(new k(E,P,e*.014),l);D.position.set(0,L,b),t.add(D);for(const B of[-1,1]){const K=new v(new Pe(e*.028,e*.045,4),l);K.position.set(B*E*.32,L+P*.5+e*.019,b),K.rotation.set(0,Math.PI/4,B*.26),K.scale.set(1,1,.3),t.add(K)}for(const B of[-1,1]){const K=new v(new ge(e*.014,e*.004,5,10,Math.PI),d);K.position.set(B*E*.26,L+P*.08,b+e*.009),K.rotation.z=Math.PI,t.add(K)}const F=new v(new ge(e*.009,e*.003,5,10,Math.PI),d);F.position.set(0,L-P*.12,b+e*.009),F.rotation.z=Math.PI,t.add(F);for(const B of[-1,1])for(let K=0;K<3;K++){const X=new v(new k(e*.036,e*.0035,e*.0035),d);X.position.set(B*E*.4,L-P*.05+(K-1)*e*.012,b+e*.008),X.rotation.z=B*(K-1)*.24,t.add(X)}const V=Xn(e*.032,_.maidCreme);V.position.set(-s*1.25,o+n.torsoH*.16,s*.5),V.rotation.y=-.55,t.add(V);const q=new v(new et(s*.6,s*1.3,e*.018,20,1,!0),h);q.position.y=a+e*.008,q.scale.z=c,t.add(q);const W=ai(s*1.3,e*.02,_.maidCreme,c);W.position.y=a-e*.006,t.add(W);const j=Xn(e*.05,_.maidLacoVermelho);j.position.set(0,o+n.torsoH*.78,s*1.12),t.add(j);const N=new v(new Rt(e*.016,10,8),w(_.gold,{glow:.2}));N.position.set(0,o+n.torsoH*.71,s*1.16),t.add(N);for(const B of[-1,1]){const K=_d(e*.056*i,_.maidPreto);K.position.set(B*r,a-e*.012,0),t.add(K);const X=ai(e*.05*i,e*.024,_.maidCreme,1);X.position.set(B*r,a-e*.058,0),t.add(X)}return t}function d1(n,t){const e=new at,i=w(t);for(const s of[-1,1]){const a=new v(new Rt(n*.56,8,6),i);a.position.set(s*n*.44,n*.34,0),a.scale.z=.34,e.add(a)}const o=new v(new Pe(n*.78,n*1.2,10),i);return o.position.y=-n*.34,o.rotation.x=Math.PI,o.scale.z=.34,e.add(o),e}function u1(n){const t=new at,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=.85,c=w(_.waRosa),l=w(_.waRosa,{doubleSide:!0}),h=w(_.waRosaForte),d=w(_.waEscuro),u=w(_.waEscuro,{doubleSide:!0}),p=w(_.waBranco,{doubleSide:!0}),g=o+n.torsoH*.1,M=o-e*.135,m=s*2,f=new v(new et(s*1.02,m,g-M,22,1,!0),u);f.position.y=(g+M)/2,f.scale.z=r,t.add(f);const S=16,y=s*1.02,x=g-M,A=-Math.atan2(m-y,x);for(let K=0;K<S;K++){const X=new at;X.rotation.y=K/S*Math.PI*2;const ht=new v(new k(e*.011,x*.94,e*.009),d);ht.position.set(0,(g+M)/2,(y+m)/2),ht.rotation.x=A,X.add(ht),X.scale.z=r,t.add(X)}const C=13;for(let K=0;K<C;K++){const X=K/C*Math.PI*2,ht=d1(e*.034,_.waEscuro);ht.position.set(Math.sin(X)*m*1.03,M-e*.016,Math.cos(X)*m*1.03*r),ht.rotation.y=X,t.add(ht)}const P=o+n.torsoH*.16,L=o-e*.095,E=new v(new et(s*1.02,m*.9,P-L,16,1,!0,-1.25,2.5),p);E.position.y=(P+L)/2,E.scale.z=r,t.add(E);const b=ai(m*.92,e*.03,_.waBranco,r);b.position.y=L,t.add(b);const D=o+n.torsoH*.14,F=o+n.torsoH*.5,V=new v(new et(s*1.07,s*1.1,F-D,18,1,!0),u);V.position.y=(F+D)/2,V.scale.z=r,t.add(V);const q=new v(new k(s*.62,n.torsoH*.26,e*.012),d);q.position.set(0,o+n.torsoH*.6,s*.82),t.add(q);const W=new v(new ge(e*.019,e*.005,6,12),w(_.waFivela));W.position.set(0,o+n.torsoH*.56,s*.89),W.scale.set(1.25,1,1),t.add(W);for(const K of[-1,1]){const X=new v(new k(s*1.15,n.torsoH*.42,e*.013),c);X.position.set(K*s*.24,o+n.torsoH*.68,s*.76),X.rotation.z=K*.52,t.add(X)}const j=new v(new et(s*.78,s*.92,n.torsoH*.2,16,1,!0),l);j.position.y=a-n.torsoH*.02,j.scale.z=r,t.add(j);const N=Xn(e*.05,_.waRosaForte);N.position.set(0,D+e*.014,s*1.12),t.add(N);for(const K of[-1,1]){const X=new v(new k(e*.026,e*.2,e*.008),h);X.position.set(K*e*.022,D-e*.09,m*.78),X.rotation.z=K*.1,t.add(X);const ht=new v(new Pe(e*.018,e*.03,4),h);ht.position.set(K*e*.024,D-e*.2,m*.8),ht.rotation.set(Math.PI,Math.PI/4,0),ht.scale.z=.3,t.add(ht)}const B=new v(new et(e*.043,e*.045,e*.022,14,1,!0),u);return B.position.y=a+n.torsoH*.12,t.add(B),t}function f1(n,t){const e=new at,{h:i,w:o}=n,s=i*.3,a=t*i*.052*o,r=i*.068*o,c=1.2,l=new v(new et(i*.045*o,r,s*.94,14,1,!0),w(_.waEscuro,{doubleSide:!0}));l.position.set(a*.45,-s*.44,0),l.scale.z=.78,e.add(l);const h=new v(new et(r,r*.86,s*.38,14,1,!0),w(_.waEscuro,{doubleSide:!0}));h.position.set(a,-s*(c-.19),0),h.scale.z=.78,e.add(h);const d=ai(r*.9,i*.024,_.waBranco,.78);return d.position.set(a,-s*c,0),e.add(d),e}function p1(n){const t=new at,{h:e,w:i}=n,o=-n.legH*.28,s=new v(new et(e*.047*i,e*.047*i,e*.022,14,1,!0),w(_.waBranco,{doubleSide:!0}));s.position.y=o,t.add(s);const a=new v(new et(e*.049*i,e*.049*i,e*.014,14,1,!0),w(_.waRosaForte,{doubleSide:!0}));a.position.y=o+e*.026,t.add(a);const r=Xn(e*.013,_.waRosaForte);return r.position.set(0,o+e*.026,e*.05*i),t.add(r),t}function m1(n){const t=new at,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=o+n.torsoH,c=.95,l=w(_.moletomPreto),h=w(_.moletomPreto,{doubleSide:!0}),d=w(_.moletomCostura),u=w(_.moletomZiper),p=w(_.moletomForro,{doubleSide:!0}),g=s*1.1,M=s*1.04,m=o+e*.012,f=a+n.torsoH*.03,S=g*c,y=new v(new et(g,M,f-m,22),l);y.position.y=(f+m)/2,y.scale.z=c,t.add(y);const x=new v(new Rt(g,22,10,0,Math.PI*2,0,Math.PI/2),l);x.position.y=f,x.scale.set(1,.42,c),t.add(x);const A=new v(new et(M*1.03,M*1.01,e*.022,22,1,!0),h);A.position.y=m+e*.011,A.scale.z=c,t.add(A);const C=r+e*.015,P=new v(new et(s*1.75,s*1.15,e*.07,20,1,!0),h);P.position.y=C,P.scale.z=.95,t.add(P);const L=new v(new et(s*1.62,s*1.05,e*.066,20,1,!0),p);L.position.y=C-e*.003,L.scale.z=.95,t.add(L);const E=new v(new Rt(s*1.15,16,12,0,Math.PI*2,0,Math.PI*.6),h);E.position.set(0,a+n.torsoH*.14,-s*.72),E.rotation.x=-1.25,E.scale.set(1.4,.95,.62),t.add(E);const b=C+e*.005,D=m+e*.014,F=new v(new k(e*.014,b-D,e*.018),u);F.position.set(0,(b+D)/2,S*.99),t.add(F);const V=new v(new k(e*.02,e*.026,e*.012),d);V.position.set(0,o+n.torsoH*.5,S*1.03),t.add(V);const q=new v(new et(g*1.012,g*1.012,e*.007,22,1,!0),w(_.moletomCostura,{doubleSide:!0}));q.position.y=o+n.torsoH*.68,q.scale.z=c,t.add(q);for(const W of[-1,1]){const j=new at;j.rotation.y=W*.62,j.scale.z=c;const N=new v(new k(e*.013,e*.062,e*.012),d);N.position.set(0,o+n.torsoH*.2,g*1),N.rotation.z=W*.36,j.add(N),t.add(j)}for(const W of[-1,1]){const j=new v(new et(e*.006,e*.006,e*.016,8),w(_.moletomPonteira));j.position.set(W*e*.022,m+e*.006,M*c*.99),t.add(j)}return t}function g1(n){const t=new at,{h:e,w:i}=n,o=e*.3,s=.82,a=new v(new Rt(e*.058*i,12,10),w(_.moletomPreto));a.position.y=-o*.03,a.scale.set(1,.92,.95),t.add(a);const r=new v(new et(e*.056*i,e*.046*i,o*s,14,1,!0),w(_.moletomPreto,{doubleSide:!0}));r.position.y=-o*s*.5,t.add(r);const c=new v(new et(e*.047*i,e*.045*i,e*.022,14),w(_.moletomCostura));return c.position.y=-o*s,t.add(c),t}function v1(n){const t=new at,i=-n.headR*.98,o=new v(new et(n.h*.043,n.h*.045,n.h*.026,14,1,!0),w(_.vestidoRenda,{doubleSide:!0}));o.position.y=i,t.add(o);const s=Xn(n.h*.026,_.vestidoFita,_.vestidoRenda);return s.position.set(0,i,n.h*.044),t.add(s),t}function _1(n){const t=new at,e=n.headR,i=w(_.oculosLente),o=w(_.oculosArmacao),s=e*.04,a=e*.26,r=e*1.07;for(const l of[-1,1]){const h=new v(new et(a,a,e*.07,20),i);h.rotation.x=Math.PI/2,h.position.set(l*e*.38,s,r),t.add(h);const d=new v(new ge(a,e*.03,8,20),o);d.position.set(l*e*.38,s,r+e*.005),t.add(d);const u=e*.6,p=r-e*.06,g=e*.78,M=e*.4,m=g-u,f=M-p,S=new v(new k(e*.05,e*.07,Math.hypot(m,f)),o);S.position.set(l*(u+g)/2,s+e*.07,(p+M)/2),S.rotation.y=l*Math.atan2(m,f),t.add(S)}const c=new v(new et(e*.025,e*.025,e*.34,8),o);return c.rotation.z=Math.PI/2,c.position.set(0,s+e*.07,r+e*.02),t.add(c),t}const Qt={sorveteMorango:{id:"sorvete-morango",nome:"Sorvete de morango",icone:"🍦",tipo:"mao",nota:"do Ari",holdPose:"upright"},sorveteMaracuja:{id:"sorvete-maracuja",nome:"Sorvete de maracujá",icone:"🍦",tipo:"mao",nota:"do Renan",holdPose:"upright"},sucoPessego:{id:"suco-pessego",nome:"Suco de pêssego",icone:"🥤",tipo:"mao",nota:"do Ari",holdPose:"upright"},sucoMorango:{id:"suco-morango",nome:"Suco de morango",icone:"🥤",tipo:"mao",nota:"do Renan",holdPose:"upright"},chapeuPingPong:{id:"chapeu-ping-pong",nome:"Chapéu de campeão",icone:"👑",tipo:"vestivel",slot:"cabeca",nota:"ping pong, 5 a 0"},patins:{id:"patins",nome:"Patins",icone:"🛼",tipo:"vestivel",slot:"pes",funcional:!0,nota:"da lojinha do parque · +velocidade"},gorroDeLa:{id:"gorro-la",nome:"Gorro de lã",icone:"🧢",tipo:"vestivel",slot:"cabeca",cor:_.roupaLa,corDetalhe:_.roupaLaBarra,nota:"para o frio que nunca faz",cobreCabelo:!0,extra:a1},camisaListrada:{id:"camisa-listrada",nome:"Camisa listrada",icone:"👕",tipo:"vestivel",slot:"tronco",cor:_.roupaListra,corDetalhe:_.roupaListraManga,nota:"mangas claras"},calcaJeans:{id:"calca-jeans",nome:"Calça jeans",icone:"👖",tipo:"vestivel",slot:"pernas",cor:_.roupaJeans,nota:"a de sempre"},vestidoRosa:{id:"vestido-rosa",nome:"Vestido rosa de babados",icone:"👗",tipo:"vestivel",slot:"tronco",cor:_.vestidoRosa,corDetalhe:_.vestidoRenda,nota:"da vitrine que o Renan viu",bracosNus:!0,pernasNuas:!0,extra:c1},maidMarinheiro:{id:"maid-marinheiro",nome:"Maid marinheiro",icone:"🖤",tipo:"vestivel",slot:"tronco",cor:_.maidPreto,corDetalhe:_.maidCreme,nota:"gola de marinheiro e cadarço",pernasNuas:!0,extra:l1},maidGatinho:{id:"maid-gatinho",nome:"Maid gatinho",icone:"🐱",tipo:"vestivel",slot:"tronco",cor:_.maidPreto,corDetalhe:_.maidPreto,nota:"com guizo e cara de gato",pernasNuas:!0,extra:h1},maidJapones:{id:"maid-japones",nome:"Maid japonês",icone:"🌸",tipo:"vestivel",slot:"tronco",cor:_.waRosa,corDetalhe:_.waRosa,nota:"manga de quimono e festão de corações",pernasNuas:!0,extra:u1,extraBraco:f1},moletomPreto:{id:"moletom-preto",nome:"Moletom preto",icone:"🧥",tipo:"vestivel",slot:"tronco",cor:_.moletomPreto,corDetalhe:_.moletomPreto,nota:"com capuz e zíper, o da foto no espelho",extra:m1,extraBraco:g1},meiaDeCoxa:{id:"meia-de-coxa",nome:"Meia de coxa",icone:"🧦",tipo:"vestivel",slot:"pernas",cor:_.waBranco,nota:"com a liga rosa",extra:p1},gargantilhaDeLaco:{id:"gargantilha-laco",nome:"Gargantilha de laço",icone:"🎀",tipo:"vestivel",slot:"cabeca",cor:_.vestidoFita,nota:"combina com o vestido",extra:v1},botaAmarela:{id:"bota-amarela",nome:"Bota amarela",icone:"🥾",tipo:"vestivel",slot:"pes",cor:_.roupaBota,corDetalhe:_.roupaBotaCano,nota:"chama atenção de longe",extra:r1},oculosEscuros:{id:"oculos-escuros",nome:"Óculos escuros",icone:"🕶️",tipo:"vestivel",slot:"cabeca",nota:"do vestiário do clube",extra:_1},bermudaAzul:{id:"bermuda-azul",nome:"Bermuda azul",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaAzul,nota:"a cor da própria piscina"},bermudaVermelha:{id:"bermuda-vermelha",nome:"Bermuda vermelha",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaVermelha,nota:"dá pra achar de longe"},bermudaAmarela:{id:"bermuda-amarela",nome:"Bermuda amarela",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaAmarela,nota:"sol de tarde"},bermudaEstampada:{id:"bermuda-estampada",nome:"Bermuda estampada",icone:"🌺",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaEstampa,estampaBanho:_.bermudaEstampaFaixa,nota:"duas faixas cor de areia"},frisbee:{id:"frisbee",nome:"Frisbee",icone:"🥏",tipo:"mao",nota:"do parque",holdPose:"relaxed"}},Md=[Qt.bermudaAzul,Qt.bermudaVermelha,Qt.bermudaAmarela,Qt.bermudaEstampada],M1={"sorvete-morango":()=>$r(_.morango),"sorvete-maracuja":()=>$r(_.maracuja),"suco-pessego":()=>Wl(_.pessego),"suco-morango":()=>Wl(_.morango),frisbee:()=>dd(_.frisbee)},x1=Object.fromEntries(Object.values(Qt).map(n=>[n.id,n]));function Vs(n){return x1[n]??null}function y1(n){const t=M1[n]?.();return t?(t.userData.item=n,t):null}const Hn=10,Ho=4;function Go(n){return n.tipo==="vestivel"&&n.funcional!==!0}function Ji(n,t){return t==="vestivel"?n.tipo==="vestivel":t==="acervo"?Go(n):!Go(n)}function Hs(n){return n.slot?pn.indexOf(n.slot):-1}function Ks(n){return Array.from({length:n},()=>null)}function xd(){return{mao:Ks(Hn),ativo:0,vestiveis:Ks(Ho),acervo:[]}}function b1(n,t){const e={},i=t&&typeof t=="object"?t:{},o=new Set([...Object.keys(n??{}),...Object.keys(i)]);for(const s of o)e[s]=S1((n??{})[s],i[s]);return e}function S1(n,t){const e=xd();if(!n&&!t)return e;const i=[],o=(u,p,g)=>{const M=Ks(p);if(!Array.isArray(u))return M;for(let m=0;m<p;m++){const f=u[m];if(!f||typeof f.id!="string"){M[m]=null;continue}const S=Vs(f.id),y=S?{...f,...S}:f;if(Ji(y,g)){M[m]=y;continue}M[m]=null,g==="mao"&&Go(y)&&i.push(y)}return M},s=typeof n?.ativo=="number"?Math.floor(n.ativo):0,a=o(n?.vestiveis,Ho,"vestivel"),r=Ks(Ho);for(const u of a){if(!u)continue;const p=Hs(u);p>=0&&r[p]===null&&(r[p]=u)}if(t&&typeof t=="object")for(const[u,p]of Object.entries(t)){if(typeof p!="string")continue;const g=Vs(p);if(!g||g.slot!==u)continue;const M=pn.indexOf(u);M>=0&&r[M]===null&&(r[M]=g)}const c=o(n?.mao,Hn,"mao"),l=[],h=u=>l.some(p=>p.id===u)||r.some(p=>p?.id===u)||c.some(p=>p?.id===u),d=Array.isArray(n?.acervo)?n.acervo:[];for(const u of[...d,...i]){if(!u||typeof u.id!="string")continue;const p=Vs(u.id),g=p?{...u,...p}:u;!Ji(g,"acervo")||h(g.id)||l.push(g)}return{mao:c,ativo:s>=0&&s<Hn?s:0,vestiveis:r,acervo:l}}const Yl="aristory.save.v1",Wa={version:1,scene:"",flags:{},memories:[],stats:{},inventarios:{}};class Pc{data;constructor(){this.data=Pc.read()}static read(){try{const t=localStorage.getItem(Yl);if(!t)return structuredClone(Wa);const e=JSON.parse(t),i=e.loadouts;return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{},inventarios:b1(e.inventarios,i)}}catch{return structuredClone(Wa)}}persist(){try{localStorage.setItem(Yl,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}de(t){let e=this.data.inventarios[t];return e||(e=xd(),this.data.inventarios[t]=e),e}maos(t){return this.de(t).mao}vestiveis(t){return this.de(t).vestiveis}acervo(t){return this.de(t).acervo}loadout(t){const e={};return this.de(t).vestiveis.forEach((i,o)=>{i&&(e[pn[o]]=i.id)}),e}slotAtivo(t){return this.de(t).ativo}setSlotAtivo(t,e){e<0||e>=Hn||(this.de(t).ativo=e,this.persist())}itemAtivo(t){const e=this.de(t);return e.mao[e.ativo]??null}achouItem(t,e){const i=this.de(t);return i.mao.some(o=>o?.id===e)||i.vestiveis.some(o=>o?.id===e)||i.acervo.some(o=>o.id===e)}pegar(t,e){if(this.achouItem(t,e.id))return"repetido";if(e.tipo==="vestivel"&&this.vestir(t,e))return"guardado";if(Go(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let o=1;o<Hn;o++){const s=(i.ativo+o)%Hn;if(i.mao[s]===null)return i.mao[s]=e,this.persist(),"guardado"}return"cheio"}guardar(t,e){if(this.achouItem(t,e.id))return"repetido";if(Go(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let o=1;o<Hn;o++){const s=(i.ativo+o)%Hn;if(i.mao[s]===null)return i.mao[s]=e,this.persist(),"guardado"}return"cheio"}guardarNoAcervo(t,e){return Ji(e,"acervo")?this.achouItem(t,e.id)?"repetido":(this.de(t).acervo.push(e),this.persist(),"guardado"):"cheio"}tirarDoAcervo(t,e){const i=this.de(t).acervo,o=i.findIndex(a=>a.id===e);if(o<0)return null;const[s]=i.splice(o,1);return this.persist(),s}vestir(t,e){if(!Ji(e,"vestivel"))return!1;const i=Hs(e);if(i<0)return!1;const o=this.de(t).vestiveis;return o[i]!==null||this.achouItem(t,e.id)&&!this.tirarDoAcervo(t,e.id)?!1:(o[i]=e,this.persist(),!0)}despir(t,e){e<0||e>=Ho||(this.de(t).vestiveis[e]=null,this.persist())}mover(t,e,i){const o=this.de(t),s=d=>d.lista==="mao"?o.mao:o.vestiveis,a=d=>d.indice>=0&&d.indice<(d.lista==="mao"?Hn:Ho);if(!a(e)||!a(i)||e.lista===i.lista&&e.indice===i.indice)return!1;const r=s(e),c=s(i),l=r[e.indice];if(!l||!Ji(l,i.lista)||i.lista==="vestivel"&&Hs(l)!==i.indice)return!1;const h=c[i.indice];return h&&!Ji(h,e.lista)||e.lista==="vestivel"&&h&&Hs(h)!==e.indice?!1:(c[i.indice]=l,r[e.indice]=h??null,this.persist(),!0)}largar(t,e){const i=this.de(t);let o=!1;for(const a of[i.mao,i.vestiveis]){const r=a.findIndex(c=>c?.id===e);r>=0&&(a[r]=null,o=!0)}const s=i.acervo.findIndex(a=>a.id===e);return s>=0&&(i.acervo.splice(s,1),o=!0),o&&this.persist(),o}reset(){this.data=structuredClone(Wa),this.persist()}}const Xa=["Cabeça","Tronco","Pernas","Pés"];class w1{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;menu;placar;mochila;armario;boneco;corpo;acervo;donoArmario;vestiario;oculos;bermudas;donoVestiario;slotsMao;slotsVestivel;dono;descarte;cardapio;secoesDoCardapio;fecharCardapioResolve=null;memorias;quadro;pontos;acervoDoQuadro=[];naMoldura=0;pintura=null;abriuEm=0;pegou=null;tipoNaPinca;funcionalNaPinca=!1;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchGirar=null;onTouchHold=null;onRestart=null;onToggleSom=null;som=null;hintsTimer=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
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
      <div class="cardapio"><div class="segurando">
        <div class="mao esq"><i></i><i></i><i></i><i></i><span class="polegar"></span></div>
        <div class="papel">
          <p class="casa">Restaurante do Clube</p>
          <h2>Cardápio</h2>
          <p class="sub">a gente lê tudo e pede o de sempre</p>
          <div class="secoes"></div>
          <p class="rodape">serviço não incluso · sorriso incluso</p>
          <button class="close">fechar o cardápio</button>
        </div>
        <div class="mao dir"><i></i><i></i><i></i><i></i><span class="polegar"></span></div>
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
    `,t.appendChild(e);const i=document.createElement("div");i.className="boot",i.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(i),this.boot=i,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.menu=e.querySelector(".menu"),this.placar=e.querySelector(".placar"),this.mochila=e.querySelector(".mochila"),this.slotsMao=e.querySelector(".mochila .maos"),this.slotsVestivel=e.querySelector(".mochila .vestiveis"),this.dono=e.querySelector(".mochila .dono"),this.descarte=e.querySelector(".mochila .descarte"),this.armario=e.querySelector(".armario"),this.boneco=e.querySelector(".armario .boneco"),this.corpo=e.querySelector(".armario .corpo"),this.acervo=e.querySelector(".armario .acervo"),this.donoArmario=e.querySelector(".armario .dono"),this.vestiario=e.querySelector(".vestiario"),this.oculos=e.querySelector(".vestiario .oculos"),this.bermudas=e.querySelector(".vestiario .bermudas"),this.donoVestiario=e.querySelector(".vestiario .dono"),this.cardapio=e.querySelector(".cardapio"),this.secoesDoCardapio=e.querySelector(".cardapio .secoes"),this.memorias=e.querySelector(".memorias"),this.quadro=e.querySelector(".memorias .quadro"),this.pontos=e.querySelector(".memorias .pontos"),this.dialogue.addEventListener("click",s=>{s.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",s=>{s.target===this.journal&&this.closeJournal()});const o=e.querySelector(".action-btn");o.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),o.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const s of["pointerup","pointercancel","pointerleave"])o.addEventListener(s,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".girar-btn.esq").addEventListener("click",()=>this.onTouchGirar?.(-1)),e.querySelector(".girar-btn.dir").addEventListener("click",()=>this.onTouchGirar?.(1)),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),e.querySelector(".bag-btn").addEventListener("click",()=>this.toggleMochila()),e.querySelector(".mochila .close").addEventListener("click",()=>this.closeMochila()),e.querySelector(".armario .close").addEventListener("click",()=>this.fecharArmario()),this.armario.addEventListener("click",s=>{s.target===this.armario&&this.fecharArmario()}),e.querySelector(".vestiario .close").addEventListener("click",()=>this.fecharVestiario()),this.vestiario.addEventListener("click",s=>{s.target===this.vestiario&&this.fecharVestiario()}),this.oculos.addEventListener("click",()=>this.onAlternarOculos?.()),this.bermudas.addEventListener("click",s=>{const a=s.target.closest(".bermuda");a?.dataset.id&&this.onEscolherBermuda?.(a.dataset.id)}),e.querySelector(".cardapio .close").addEventListener("click",()=>this.fecharCardapio()),this.cardapio.addEventListener("click",s=>{s.target===this.cardapio&&this.fecharCardapio()}),e.querySelector(".memorias .close").addEventListener("click",()=>this.fecharMemorias()),e.querySelector(".memorias .antes").addEventListener("click",()=>this.folhear(-1)),e.querySelector(".memorias .depois").addEventListener("click",()=>this.folhear(1)),this.memorias.addEventListener("click",s=>{s.target===this.memorias&&this.fecharMemorias()}),this.ligarGiroDoBoneco(),e.querySelector(".mochila .descartar").addEventListener("click",()=>{this.som?.("escolha"),this.descarte.classList.add("confirmando")}),e.querySelector(".mochila .descartar-sim").addEventListener("click",()=>{const s=this.pegou;this.pegou=null,this.tipoNaPinca=void 0,this.marcarPego(null),s&&this.onDescartar?.(s)}),this.mochila.addEventListener("click",s=>{s.target===this.mochila&&this.closeMochila()});for(const s of[this.slotsMao,this.slotsVestivel])s.addEventListener("click",a=>this.tocarVaga(a)),s.addEventListener("dragstart",a=>this.comecarArrasto(a)),s.addEventListener("dragover",a=>this.arrastarSobre(a)),s.addEventListener("dragleave",a=>{a.target.closest(".slot")?.classList.remove("alvo")}),s.addEventListener("drop",a=>this.soltarArrasto(a)),s.addEventListener("dragend",()=>this.limparArrasto());e.querySelector(".menu-btn").addEventListener("click",()=>this.toggleMenu()),e.querySelector(".menu .som-btn").addEventListener("click",()=>this.onToggleSom?.()),e.querySelector(".menu .controles-btn").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.add("vendo-controles")}),e.querySelector(".menu .controles .voltar").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.remove("vendo-controles")}),e.querySelector(".menu .close").addEventListener("click",()=>this.closeMenu()),e.querySelector(".menu .recomecar").addEventListener("click",()=>{this.menu.classList.add("perguntando")}),e.querySelector(".menu .nao").addEventListener("click",()=>{this.menu.classList.remove("perguntando")}),e.querySelector(".menu .sim").addEventListener("click",()=>{this.closeMenu(),this.onRestart?.()}),this.menu.addEventListener("click",s=>{s.target===this.menu&&this.closeMenu()}),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),this.showHints()}get menuOpen(){return this.menu.classList.contains("show")}toggleMenu(){this.som?.("menu"),this.menuOpen?this.closeMenu():(this.closeJournal(),this.closeMochila(),this.menu.classList.add("show")),this.marcarTelaAberta()}closeMenu(){this.menu.classList.remove("show"),this.menu.classList.remove("perguntando"),this.menu.classList.remove("vendo-controles"),this.marcarTelaAberta()}marcarTelaAberta(){document.body.classList.toggle("tela-aberta",this.menuOpen||this.journalOpen||this.mochilaOpen||this.armarioOpen||this.memoriasOpen||this.vestiarioOpen||this.cardapioOpen)}setSom(t){const e=this.menu.querySelector(".som-btn");e.textContent=t?"🔊 Som ligado":"🔇 Som desligado",e.classList.toggle("desligado",!t)}showHints(){this.hints.classList.remove("hide"),this.hintsTimer&&window.clearTimeout(this.hintsTimer),this.hintsTimer=window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){const i=this.prompt.querySelector(".label").textContent;this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,(!this.prompt.classList.contains("show")||i!==e)&&this.som?.("prompt"),this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showPlacar(t){if(!t){this.placar.classList.remove("show");return}this.placar.querySelector(".eu").textContent=t.eu,this.placar.querySelector(".ele").textContent=t.ele,this.placar.querySelector(".nums").textContent=`${t.meus} × ${t.dele}`,this.placar.classList.add("show")}showCharge(t,e,i=.06){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const o=this.carga.querySelector(".barra");o.style.width=`${Math.max(0,Math.min(1,t))*100}%`;const s=this.carga.querySelector(".alvo"),a=this.carga.querySelector(".zona"),r=e!=null&&e>.02&&e<.99;if(s.style.display=r?"block":"none",a.style.display=r?"block":"none",!r){this.carga.classList.remove("certa");return}const c=h=>`calc(3px + (100% - 6px) * ${Math.max(0,Math.min(1,h))})`;s.style.left=c(e),a.style.left=c(e-i),a.style.right=`calc(3px + (100% - 6px) * ${1-Math.max(0,Math.min(1,e+i))})`;const l=Math.abs(t-e)<=i;this.carga.classList.toggle("certa",l)}toast(t,e="💛"){const i=document.createElement("div");i.className="toast",i.innerHTML=`<span>${e}</span><span></span>`,i.querySelector("span:last-child").textContent=t,this.toasts.appendChild(i),window.setTimeout(()=>i.classList.add("fade"),2600),window.setTimeout(()=>i.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(i=>{let o=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const s=()=>{this.type(t[o])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[o];return}if(o+=1,o>=t.length){this.dialogue.classList.remove("show"),this.advance=null,i();return}s()},s()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,e%3===1&&t[e-1]!==" "&&this.som?.("fala"),this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,i=""){return new Promise(o=>{this.dialogueWho.textContent=i,this.dialogueWho.style.display=i?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=s=>{this.som?.("confirma"),this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),o(s)},e.forEach((s,a)=>{const r=document.createElement("button");r.type="button",r.textContent=s,r.addEventListener("click",()=>this.escolher?.(a)),this.escolhas.appendChild(r)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,i)=>e.classList.toggle("sel",i===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.som?.("escolha"),this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.som?.("escolha"),this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const i=document.createElement("div");i.className="memory",i.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',i.querySelector(".icon").textContent=e.icon,i.querySelector("b").textContent=e.title,i.querySelector("small").textContent=e.place,i.querySelector("p").textContent=e.note,this.journalGrid.appendChild(i)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.som?.("diario"),this.journalOpen?this.closeJournal():(this.closeMochila(),this.journal.classList.add("show")),this.marcarTelaAberta()}closeJournal(){this.journal.classList.remove("show"),this.marcarTelaAberta()}get cardapioOpen(){return this.cardapio.classList.contains("show")}abrirCardapio(t){return new Promise(e=>{if(this.cardapioOpen){e();return}this.som?.("escolha"),this.desenharCardapio(t),this.cardapio.classList.add("show"),this.marcarTelaAberta(),this.fecharCardapioResolve=e})}fecharCardapio(){if(!this.cardapioOpen)return;this.cardapio.classList.remove("show"),this.marcarTelaAberta();const t=this.fecharCardapioResolve;this.fecharCardapioResolve=null,t?.()}desenharCardapio(t){const e=Math.min(window.devicePixelRatio||1,2),i=Math.round(64*e);this.secoesDoCardapio.innerHTML="";for(const o of t){const s=document.createElement("section");s.className="secao",s.innerHTML=`<h3><span>${o.titulo}</span></h3><p class="nota">${o.nota}</p>`;for(const a of o.pratos){const r=document.createElement("div");r.className="prato",r.classList.toggle("destaque",!!a.selo),r.dataset.id=a.id;const c=document.createElement("canvas");c.className="foto",c.width=i,c.height=i;const l=c.getContext("2d");l&&(l.translate(i/2,i/2),l.scale(1.22,1.22),l.translate(-i/2,-i/2),a.pintar(l,i));const h=document.createElement("div");h.className="texto",h.innerHTML=`<div class="titulo"><b>${a.nome}</b><i></i><em>${a.preco}</em></div><p>${a.descricao}</p>`+(a.selo?`<span class="selo">★ ${a.selo}</span>`:""),r.append(c,h),s.appendChild(r)}this.secoesDoCardapio.appendChild(s)}}get memoriasOpen(){return this.memorias.classList.contains("show")}abrirMemorias(t,e=0){this.memoriasOpen||t.length===0||(this.som?.("diario"),this.closeJournal(),this.closeMochila(),this.acervoDoQuadro=t,this.naMoldura=Math.min(Math.max(e,0),t.length-1),this.mostrarMemoria(),this.memorias.classList.add("show"),this.marcarTelaAberta(),this.abriuEm=performance.now(),this.pintura=requestAnimationFrame(this.pintarQuadro))}fecharMemorias(){this.memoriasOpen&&(this.memorias.classList.remove("show"),this.acervoDoQuadro=[],this.pintura!==null&&cancelAnimationFrame(this.pintura),this.pintura=null,this.marcarTelaAberta())}folhear(t){if(!this.memoriasOpen||this.acervoDoQuadro.length<2)return;const e=this.acervoDoQuadro.length;this.naMoldura=(this.naMoldura+t+e)%e,this.som?.("escolha"),this.mostrarMemoria(),this.abriuEm=performance.now()}mostrarMemoria(){const t=this.acervoDoQuadro[this.naMoldura];if(!t)return;this.memorias.querySelector("h2").textContent=t.titulo,this.memorias.querySelector(".sub").textContent=t.lugar,this.memorias.querySelector(".legenda").textContent=t.legenda,this.quadro.style.aspectRatio=String(t.proporcao);const e=this.acervoDoQuadro.length>1;this.memorias.classList.toggle("tem-mais",e),this.pontos.innerHTML="",e&&this.acervoDoQuadro.forEach((i,o)=>{const s=document.createElement("button");s.className="ponto",s.classList.toggle("agora",o===this.naMoldura),s.title=i.titulo,s.setAttribute("aria-label",i.titulo),s.addEventListener("click",()=>this.folhear(o-this.naMoldura)),this.pontos.appendChild(s)})}pintarQuadro=t=>{const e=this.acervoDoQuadro[this.naMoldura];if(!e||!this.memoriasOpen){this.pintura=null;return}const i=Math.min(window.devicePixelRatio||1,2),o=Math.round(this.quadro.clientWidth*i),s=Math.round(this.quadro.clientHeight*i);if(o>0&&s>0){(this.quadro.width!==o||this.quadro.height!==s)&&(this.quadro.width=o,this.quadro.height=s);const a=this.quadro.getContext("2d");a&&e.pintar(a,o,s,(t-this.abriuEm)/1e3)}this.pintura=requestAnimationFrame(this.pintarQuadro)};get mochilaOpen(){return this.mochila.classList.contains("show")}toggleMochila(){this.som?.("diario"),this.mochilaOpen?this.closeMochila():(this.closeJournal(),this.onAbrirMochila?.(),this.mochila.classList.add("show")),this.marcarTelaAberta()}closeMochila(){this.mochila.classList.remove("show"),this.marcarTelaAberta()}renderMochila(t,e,i,o){this.dono.textContent=`de ${o}`,this.pegou=null,this.tipoNaPinca=void 0,this.funcionalNaPinca=!1,this.mochila.classList.remove("movendo"),this.descarte.classList.remove("show","confirmando");const s=(a,r,c,l=!1)=>{a.innerHTML="",r.forEach((h,d)=>{const u=document.createElement("button");u.className="slot",u.dataset.slot=String(d),u.classList.toggle("cheio",h!==null),u.classList.toggle("principal",d===c);const p=h!==null&&h.tipo==="vestivel"&&h.funcional!==!0;u.draggable=h!==null&&!p,u.classList.toggle("preso",p),h?(u.dataset.tipo=h.tipo,h.funcional?u.dataset.funcional="sim":delete u.dataset.funcional):(delete u.dataset.tipo,delete u.dataset.funcional);const g=l?`<em class="parte">${Xa[d]}</em>`:"";u.innerHTML=g+(h?`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""):'<span class="icone vazio">·</span><b>vazio</b>'),a.appendChild(u)})};s(this.slotsMao,t,i),s(this.slotsVestivel,e,-1,!0)}get armarioOpen(){return this.armario.classList.contains("show")}abrirArmario(){this.armarioOpen||(this.som?.("escolha"),this.onAbrirArmario?.(),this.armario.classList.add("show"),this.marcarTelaAberta())}fecharArmario(){this.armarioOpen&&(this.armario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharArmario?.())}canvasDoBoneco(){return this.boneco}renderArmario(t,e,i){if(this.donoArmario.textContent=`de ${i}`,this.corpo.innerHTML="",t.forEach((o,s)=>{const a=document.createElement("button");a.className="parte",a.classList.toggle("cheio",o!==null),a.dataset.parte=String(s),a.innerHTML=`<small>${Xa[s]}</small>`+(o?`<span class="icone">${o.icone}</span><b>${o.nome}</b><em>tirar</em>`:'<span class="icone vazio">·</span><b>vazio</b>'),this.corpo.appendChild(a)}),this.acervo.innerHTML="",e.length===0){const o=document.createElement("p");o.className="nada",o.textContent="Nada guardado — está tudo no corpo.",this.acervo.appendChild(o);return}pn.forEach((o,s)=>{const a=e.filter(h=>h.slot===o);if(a.length===0)return;const r=document.createElement("section");r.className="grupo",r.dataset.slot=o;const c=document.createElement("h4");c.innerHTML=`${Xa[s]} <span>${a.length}</span>`,r.appendChild(c);const l=document.createElement("div");l.className="pecas";for(const h of a){const d=document.createElement("button");d.className="peca",d.dataset.id=h.id,d.innerHTML=`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""),l.appendChild(d)}r.appendChild(l),this.acervo.appendChild(r)})}onTirarParte=null;onVestirPeca=null;onAbrirArmario=null;onFecharArmario=null;onGirarBoneco=null;ligarGiroDoBoneco(){let t=!1,e=0;this.boneco.addEventListener("pointerdown",i=>{t=!0,e=i.clientX,this.boneco.setPointerCapture(i.pointerId)}),this.boneco.addEventListener("pointermove",i=>{t&&(this.onGirarBoneco?.((i.clientX-e)*.012),e=i.clientX)});for(const i of["pointerup","pointercancel"])this.boneco.addEventListener(i,()=>{t=!1});this.corpo.addEventListener("click",i=>{const o=i.target.closest(".parte");!o?.dataset.parte||!o.classList.contains("cheio")||this.onTirarParte?.(Number(o.dataset.parte))}),this.acervo.addEventListener("click",i=>{const o=i.target.closest(".peca");o?.dataset.id&&this.onVestirPeca?.(o.dataset.id)})}get vestiarioOpen(){return this.vestiario.classList.contains("show")}abrirVestiario(){this.vestiarioOpen||(this.som?.("escolha"),this.onAbrirVestiario?.(),this.vestiario.classList.add("show"),this.marcarTelaAberta())}fecharVestiario(){this.vestiarioOpen&&(this.vestiario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharVestiario?.())}renderVestiario(t){this.donoVestiario.textContent=`de ${t.dono}`,this.oculos.classList.toggle("ligado",t.oculos),this.oculos.innerHTML=`<span class="icone">🕶️</span><b>Óculos escuros</b><em>${t.oculos?"tirar":"colocar"}</em>`,this.bermudas.innerHTML="";for(const e of t.bermudas){const i=document.createElement("button");i.className="bermuda",i.classList.toggle("vestida",e.vestida),i.dataset.id=e.id;const o=document.createElement("i");o.style.background=e.faixa?`repeating-linear-gradient(160deg, ${e.cor} 0 12px, ${e.faixa} 12px 18px)`:e.cor,i.appendChild(o);const s=document.createElement("b");s.textContent=e.nome,i.appendChild(s),this.bermudas.appendChild(i)}}onAlternarOculos=null;onEscolherBermuda=null;onAbrirVestiario=null;onFecharVestiario=null;onEscolherSlot=null;onMoverItem=null;onDescartar=null;onAbrirMochila=null;podeIrPara(t,e,i=!1){return t?t==="vestivel"&&e==="mao"?i?!0:(this.toast("Roupa só se troca no guarda-roupa","👗"),!1):t==="mao"&&e==="vestivel"?(this.toast("Este item não pode ser vestido","🚫"),!1):!0:!0}endereco(t){const e=t.closest(".slot");return e?.dataset.slot?{lista:e.closest(".vestiveis")?"vestivel":"mao",indice:Number(e.dataset.slot)}:null}tocarVaga(t){const e=this.endereco(t.target);if(!e)return;if(this.pegou){const o=this.pegou;if(o.lista===e.lista&&o.indice===e.indice){this.pegou=null,this.marcarPego(null);return}if(!this.podeIrPara(this.tipoNaPinca,e.lista,this.funcionalNaPinca))return;this.pegou=null,this.marcarPego(null),this.onMoverItem?.(o,e)&&this.som?.("escolha");return}const i=t.target.closest(".slot");if(e.lista==="mao"&&!i.classList.contains("cheio")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}if(i.classList.contains("cheio")){if(e.lista==="mao"&&!i.classList.contains("principal")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}this.pegou=e,this.tipoNaPinca=i.dataset.tipo,this.funcionalNaPinca=i.dataset.funcional==="sim",this.marcarPego(i),this.som?.("escolha")}}marcarPego(t){for(const o of this.mochila.querySelectorAll(".slot.pego"))o.classList.remove("pego");t?.classList.add("pego"),this.mochila.classList.toggle("movendo",t!==null),this.descarte.classList.toggle("show",t!==null),this.descarte.classList.remove("confirmando");const e=this.descarte.querySelector(".descartar"),i=t?.querySelector("b")?.textContent??"";e.textContent=i?`🗑 Descartar ${i}`:"🗑 Descartar"}comecarArrasto(t){const e=this.endereco(t.target),i=t.target.closest(".slot");if(!e||!i?.classList.contains("cheio")){t.preventDefault();return}t.dataTransfer?.setData("text/plain",JSON.stringify({vaga:e,tipo:i.dataset.tipo,funcional:i.dataset.funcional==="sim"})),t.dataTransfer&&(t.dataTransfer.effectAllowed="move"),i.classList.add("pego")}arrastarSobre(t){const e=t.target.closest(".slot");e&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),e.classList.add("alvo"))}soltarArrasto(t){t.preventDefault();const e=this.endereco(t.target),i=t.dataTransfer?.getData("text/plain");if(this.limparArrasto(),!(!e||!i))try{const{vaga:o,tipo:s,funcional:a}=JSON.parse(i);if(!this.podeIrPara(s,e.lista,a===!0))return;this.onMoverItem?.(o,e)&&this.som?.("escolha")}catch{}}limparArrasto(){for(const t of this.mochila.querySelectorAll(".slot.pego, .slot.alvo"))t.classList.remove("pego","alvo")}}function Kr(n,t,e){for(const i of e)if(i.kind==="circle"){const o=n.x-i.x,s=n.z-i.z,a=t+i.r,r=o*o+s*s;if(r>=a*a||r===0)continue;const c=Math.sqrt(r),l=(a-c)/c;n.x+=o*l,n.z+=s*l}else{const o=Math.cos(-i.rot),s=Math.sin(-i.rot),a=n.x-i.x,r=n.z-i.z,c=a*o-r*s,l=a*s+r*o,h=Math.max(-i.hw,Math.min(i.hw,c)),d=Math.max(-i.hd,Math.min(i.hd,l));let u=c-h,p=l-d,g=u*u+p*p;if(g>t*t)continue;if(g===0){const S=i.hw-Math.abs(c),y=i.hd-Math.abs(l);S<y?(u=Math.sign(c)||1,p=0,g=0):(u=0,p=Math.sign(l)||1);const x=u!==0?Math.sign(u)*(i.hw+t):c,A=p!==0?Math.sign(p)*(i.hd+t):l;n.x=i.x+(x*Math.cos(i.rot)-A*Math.sin(i.rot)),n.z=i.z+(x*Math.sin(i.rot)+A*Math.cos(i.rot));continue}const M=Math.sqrt(g),m=h+u/M*t,f=d+p/M*t;n.x=i.x+(m*Math.cos(i.rot)-f*Math.sin(i.rot)),n.z=i.z+(m*Math.sin(i.rot)+f*Math.cos(i.rot))}}function Qr(n,t,e){n.x=Math.max(e.minX+t,Math.min(e.maxX-t,n.x)),n.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,n.z))}const yd=1.3;class E1{object=new at;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new z;body;locked=!1;riding=!1;submersion=0;patins=!1;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}get chest(){return new z(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}update(t,e,i,o){if(this.riding){this.body.update(e,0);return}const s=this.submersion>.05,a=this.patins&&!s?yd:1,r=s?this.maxSpeed*.55:this.maxSpeed*a;if(!this.locked&&t.lengthSq()>1e-4){const l=t.clone().normalize();this.velocity.x+=l.x*this.accel*e,this.velocity.z+=l.z*this.accel*e;const h=Math.hypot(this.velocity.x,this.velocity.z);h>r&&(this.velocity.x=this.velocity.x/h*r,this.velocity.z=this.velocity.z/h*r),this.body.setFacing(Math.atan2(l.x,l.z))}else{const l=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(l),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,Kr(this.position,this.radius,i),Qr(this.position,this.radius,o),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(s),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class T1{object=new at;position;radius=.4;maxSpeed=5;velocity=new z;dir=new z;body;aoLado=0;folga=2;ordem=null;riding=!1;submersion=0;patins=!1;lado=0;distancia=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}atrelar(t,e){this.lado=t,this.distancia=e,this.ordem=null}soltar(){this.lado=0}get atrelado(){return this.lado!==0}goTo(t,e){this.ordem=new z(t,0,e)}clearOrder(){this.ordem=null}hold(t,e){this.ordem?this.ordem.set(this.position.x,0,this.position.z):this.ordem=new z(this.position.x,0,this.position.z),this.velocity.set(0,0,0),this.body.setFacing(Math.atan2(t-this.position.x,e-this.position.z))}get hasOrder(){return this.ordem!==null}rebocar(t,e,i,o){const s=this.aoLado,a=t.x+Math.sin(s+Math.PI/2)*this.distancia*this.lado,r=t.z+Math.cos(s+Math.PI/2)*this.distancia*this.lado,c=this.position.x,l=this.position.z,h=Math.min(1,e*16);this.position.x+=(a-this.position.x)*h,this.position.z+=(r-this.position.z)*h,Kr(this.position,this.radius,i),Qr(this.position,this.radius,o),this.velocity.set((this.position.x-c)/Math.max(e,1e-4),0,(this.position.z-l)/Math.max(e,1e-4)),this.body.setFacing(s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}set direcaoDoPar(t){this.aoLado=t}update(t,e,i,o){if(this.riding){this.body.update(e,0);return}if(this.lado!==0){this.rebocar(t,e,i,o);return}const s=this.ordem??t,a=this.ordem?.55:this.folga;this.dir.set(s.x-this.position.x,0,s.z-this.position.z);const r=this.dir.length();if(!this.ordem&&r>22){this.teleport(s.x-1.2,s.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(r>a){this.dir.normalize();const u=this.maxSpeed*(this.patins?yd:1),p=Math.min(u,1.6+(r-a)*2.2);this.velocity.x+=(this.dir.x*p-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*p-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),r>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,Kr(this.position,this.radius,i),Qr(this.position,this.radius,o);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),d=.86;if(h<d&&h>1e-4){const u=(d-h)/h;this.position.x+=c*u,this.position.z+=l*u}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}const A1=1.7;class C1{grupo=new at;vivos=[];constructor(t){t.add(this.grupo)}soltar(t,e,i,o=1.62){const s=ud(.6);s.userData.coracao=!0,s.position.set(t.x+e,o,t.z+i),this.grupo.add(s),this.vivos.push({obj:s,vida:0,giro:Math.random()*Math.PI,fx:e,fz:i})}limpar(){for(const t of this.vivos)this.grupo.remove(t.obj);this.vivos.length=0}update(t){for(let e=this.vivos.length-1;e>=0;e--){const i=this.vivos[e];i.vida+=t;const o=i.vida/A1;if(o>=1){this.grupo.remove(i.obj),this.vivos.splice(e,1);continue}i.obj.position.y+=t*.72;const s=(.7+Math.sin(i.vida*3+i.giro)*.25)*t;i.obj.position.x+=i.fx*s,i.obj.position.z+=i.fz*s,i.obj.rotation.y=i.giro+i.vida*1.4;const a=o<.18?o/.18:Math.min(1,(1-o)/.35);i.obj.scale.setScalar(.25+a*.9)}}}const P1=1.5,Zl=.9,$l=1.16,Ti=.32,tc=.42,bd=.34,R1=Ti+tc+bd,I1=.5;class L1{constructor(t){this.coracoes=t}t=-1;descanso=0;alvoA=new z;alvoB=new z;soltouCoracao=!1;onSom=null;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!U1(t,e))return!1;const i=e.position.x-t.position.x,o=e.position.z-t.position.z,s=Math.hypot(i,o);if(s>P1||s<.01)return!1;const a=Math.atan2(i,o);return Math.abs(ja(t.rig.facing,a))<Zl&&Math.abs(ja(e.rig.facing,a+Math.PI))<Zl}iniciar(t,e,i){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const o=e.position.x-t.position.x,s=e.position.z-t.position.z,a=Math.atan2(o,s),r=i+Math.PI/2,c=Math.abs(ja(a,r))<Math.PI/2?r:r+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,d=Math.sin(c)*$l/2,u=Math.cos(c)*$l/2;this.alvoA.set(l-d,0,h-u),this.alvoB.set(l+d,0,h+u),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0)}update(t,e,i){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const o=D1(this.t);if(e.rig.setKiss(o),i.rig.setKiss(o),e.locked=!0,this.t<Ti){const s=Math.min(1,t*9);e.position.lerp(this.alvoA,s),i.position.lerp(this.alvoB,s)}if(!this.soltouCoracao&&this.t>=Ti*.9){this.soltouCoracao=!0;const s=Math.atan2(i.position.x-e.position.x,i.position.z-e.position.z),a=Math.sin(s),r=Math.cos(s);this.coracoes.soltar(e.position,-a,-r),this.coracoes.soltar(i.position,a,r),this.onSom?.("beijo"),this.onSom?.("coracao")}this.t>=R1&&(this.t=-1,this.descanso=I1,e.rig.setKiss(0),i.rig.setKiss(0),e.locked=!1)}}}function D1(n){return n<Ti?Jl(n/Ti):n<Ti+tc?1:Jl(Math.max(0,1-(n-Ti-tc)/bd))}function Jl(n){return n*n*(3-2*n)}function U1(n,t){const e=n.rig.spec,i=t.rig.spec;return e.casal===!0&&i.casal===!0&&e.id!==i.id}function ja(n,t){return Math.atan2(Math.sin(n-t),Math.cos(n-t))}const N1=.95,z1=1.8,F1=2.2,O1=.5,Kl=3;class B1{constructor(t){this.coracoes=t}lado=1;ligado=!1;relogio=0;longe=0;onSom=null;get ativo(){return this.ligado}disponivel(t,e){if(this.ligado||t.riding||e.riding||t.submersion>.05||e.submersion>.05||t.locked||e.hasOrder)return!1;const i=Math.hypot(e.position.x-t.position.x,e.position.z-t.position.z);return i>.01&&i<=z1}ligar(t,e){if(this.ligado)return;this.ligado=!0,this.relogio=0,this.longe=0;const i=t.rig.facing,o=e.position.x-t.position.x,s=e.position.z-t.position.z;this.lado=o*Math.sin(i+Math.PI/2)+s*Math.cos(i+Math.PI/2)<0?-1:1,this.aplicar(t,e),this.onSom?.("escolha")}soltar(t,e){this.ligado&&(this.ligado=!1,e.soltar(),t.rig.setHoldingHands(0),e.rig.setHoldingHands(0))}trocouCorpos(t,e){this.ligado&&(this.lado=this.lado===1?-1:1,this.aplicar(t,e))}update(t,e,i){if(!this.ligado)return;if(e.riding||i.riding||e.submersion>.05||i.submersion>.05||i.hasOrder){this.soltar(e,i);return}const o=Math.hypot(i.position.x-e.position.x,i.position.z-e.position.z);if(this.longe=o>F1?this.longe+t:0,this.longe>=O1){this.soltar(e,i);return}if(i.direcaoDoPar=e.rig.facing,this.relogio+=t,this.relogio>=Kl){this.relogio-=Kl;const s=e.position.clone().add(i.position).multiplyScalar(.5);this.coracoes.soltar(s,0,0,2.05),this.onSom?.("coracao")}}aplicar(t,e){e.atrelar(this.lado,N1),e.direcaoDoPar=t.rig.facing,t.rig.setHoldingHands(this.lado),e.rig.setHoldingHands(this.lado===1?-1:1)}}function ae(n,t,e){const i=n.createOscillator();i.type=e.tipo??"sine",i.frequency.setValueAtTime(e.freq,e.quando),e.glide&&i.frequency.exponentialRampToValueAtTime(Math.max(20,e.glide),e.quando+e.dur),e.detune&&i.detune.setValueAtTime(e.detune,e.quando);const o=n.createGain(),s=e.vol??.2,a=e.ataque??.006;o.gain.setValueAtTime(1e-4,e.quando),o.gain.exponentialRampToValueAtTime(s,e.quando+a),o.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur);let r=o;if(e.abafo){const c=n.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(e.abafo,e.quando),o.connect(c),r=c}i.connect(o),r.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}let Rs=null;function k1(n){if(!Rs||Rs.sampleRate!==n.sampleRate){const t=n.createBuffer(1,n.sampleRate,n.sampleRate),e=t.getChannelData(0);for(let i=0;i<e.length;i++)e[i]=Math.random()*2-1;Rs=t}return Rs}function $e(n,t,e){const i=n.createBufferSource();i.buffer=k1(n),i.loop=!0;const o=n.createBiquadFilter();o.type=e.tipo??"bandpass",o.frequency.setValueAtTime(e.freq??1800,e.quando),e.glide&&o.frequency.exponentialRampToValueAtTime(Math.max(60,e.glide),e.quando+e.dur),o.Q.setValueAtTime(e.q??1.2,e.quando);const s=n.createGain(),a=e.vol??.14;s.gain.setValueAtTime(1e-4,e.quando),s.gain.exponentialRampToValueAtTime(a,e.quando+.008),s.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur),i.connect(o),o.connect(s),s.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}function pe(n){return 440*Math.pow(2,(n-69)/12)}function V1(n){let t=n>>>0;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}const Ql=[0,2,4,7,9,12,14,16],be=72,Sd={passo:({ctx:n,destino:t,t:e,n:i})=>{const o=i%2===0;$e(n,t,{quando:e,dur:.075,vol:.05,freq:o?1500:1150,glide:o?700:560,q:.9}),ae(n,t,{freq:o?128:112,quando:e,dur:.06,vol:.045,tipo:"sine"})},nadar:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.34,vol:.07,freq:700,glide:2600,q:.7})},agua:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.42,vol:.2,freq:2400,glide:500,q:.6}),ae(n,t,{freq:420,glide:120,quando:e,dur:.26,vol:.1,tipo:"sine"})},prompt:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+12),quando:e,dur:.09,vol:.055,tipo:"triangle"})},interagir:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+4),quando:e,dur:.12,vol:.13,tipo:"triangle"}),ae(n,t,{freq:pe(be+11),quando:e+.055,dur:.16,vol:.1,tipo:"sine"})},fala:({ctx:n,destino:t,t:e,n:i})=>{const o=Ql[i%4]+(i%8<4?0:2);ae(n,t,{freq:pe(be+7+o),quando:e,dur:.06,vol:.035,tipo:"square",abafo:2200})},escolha:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+7),quando:e,dur:.07,vol:.08,tipo:"triangle"})},confirma:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+4),quando:e,dur:.1,vol:.12,tipo:"triangle"}),ae(n,t,{freq:pe(be+9),quando:e+.07,dur:.14,vol:.11,tipo:"triangle"}),ae(n,t,{freq:pe(be+16),quando:e+.14,dur:.2,vol:.09,tipo:"sine"})},porta:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.3,vol:.11,freq:900,glide:320,q:.8}),ae(n,t,{freq:180,glide:90,quando:e+.16,dur:.2,vol:.09,tipo:"sine"})},memoria:({ctx:n,destino:t,t:e})=>{[0,4,7,12,16].forEach((i,o)=>{ae(n,t,{freq:pe(be+i),quando:e+o*.075,dur:.42,vol:.11-o*.008,tipo:"triangle"})})},toast:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+9),quando:e,dur:.14,vol:.09,tipo:"sine"}),ae(n,t,{freq:pe(be+16),quando:e+.08,dur:.22,vol:.07,tipo:"sine"})},trocar:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be),glide:pe(be+12),quando:e,dur:.18,vol:.09,tipo:"triangle"}),$e(n,t,{quando:e,dur:.2,vol:.05,freq:800,glide:3e3,q:.6})},beijo:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.06,vol:.1,freq:2400,glide:1200,q:2.5}),ae(n,t,{freq:pe(be+7),quando:e+.02,dur:.1,vol:.08,tipo:"sine"})},coracao:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+12),quando:e,dur:.3,vol:.07,tipo:"sine"}),ae(n,t,{freq:pe(be+19),quando:e+.09,dur:.36,vol:.05,tipo:"sine"})},lancar:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.26,vol:.12,freq:600,glide:3200,q:.7}),ae(n,t,{freq:300,glide:900,quando:e,dur:.16,vol:.06,tipo:"triangle"})},pegar:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.09,vol:.13,freq:1400,glide:500,q:1.6}),ae(n,t,{freq:pe(be+9),quando:e+.03,dur:.14,vol:.1,tipo:"triangle"})},quicar:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:220,glide:110,quando:e,dur:.12,vol:.08,tipo:"sine"}),$e(n,t,{quando:e,dur:.1,vol:.06,freq:900,glide:400,q:1})},sorvete:({ctx:n,destino:t,t:e})=>{[0,7,12].forEach((i,o)=>{ae(n,t,{freq:pe(be+4+i),quando:e+o*.09,dur:.3,vol:.1,tipo:"triangle"})})},miado:({ctx:n,destino:t,t:e,n:i})=>{const o=i%2===1,s=pe(be+Ql[o?2:3]);ae(n,t,{freq:s*.82,glide:s,quando:e,dur:o?.2:.15,vol:.075,tipo:"sawtooth",abafo:1500}),ae(n,t,{freq:s,glide:s*.68,quando:e+(o?.15:.1),dur:o?.55:.4,vol:.085,ataque:.02,tipo:"sawtooth",abafo:1200}),$e(n,t,{quando:e,dur:o?.4:.28,vol:.022,freq:1100,glide:700,q:2.2})},pato:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:620,glide:380,quando:e,dur:.13,vol:.1,tipo:"sawtooth",abafo:1400}),ae(n,t,{freq:520,glide:300,quando:e+.15,dur:.12,vol:.08,tipo:"sawtooth",abafo:1200})},tv:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.18,vol:.07,freq:3e3,glide:1200,q:.5}),ae(n,t,{freq:pe(be+4),quando:e+.1,dur:.18,vol:.07,tipo:"square",abafo:1800})},sino:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+12),quando:e,dur:.9,vol:.09,tipo:"sine"}),ae(n,t,{freq:pe(be+19),quando:e+.02,dur:.8,vol:.05,tipo:"sine",detune:6})},sentar:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.24,vol:.09,freq:700,glide:260,q:.7})},menu:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+2),quando:e,dur:.1,vol:.09,tipo:"triangle"}),ae(n,t,{freq:pe(be+9),quando:e+.06,dur:.14,vol:.07,tipo:"triangle"})},diario:({ctx:n,destino:t,t:e})=>{$e(n,t,{quando:e,dur:.22,vol:.09,freq:1200,glide:3e3,q:.6})},recomecar:({ctx:n,destino:t,t:e})=>{[0,4,7,12].forEach((i,o)=>{ae(n,t,{freq:pe(be-12+i),quando:e+o*.11,dur:.5,vol:.1,tipo:"triangle"})})}},H1=.2,G1=1.3,ji=n=>({raiz:n,notas:[0,4,7,11]}),bo=n=>({raiz:n,notas:[0,3,7,10]}),Is=n=>({raiz:n,notas:[0,4,7,10]}),q1=n=>({raiz:n,notas:[0,4,7,9]}),Ya=[0,2,4,7,9,12,14,16,19],W1=[0,2,3,5,7,9,10,12,14],Gs={casa:{bpm:82,tonica:41,giro:[ji(0),bo(9),bo(2),Is(7)],melodia:.62,chocalho:!1,escala:Ya},"villa-lobos":{bpm:100,tonica:36,giro:[ji(0),ji(5),bo(9),Is(7)],melodia:.8,chocalho:!0,escala:Ya},clube:{bpm:92,tonica:38,giro:[q1(0),bo(2),ji(5),Is(7)],melodia:.72,chocalho:!0,escala:Ya},padrao:{bpm:88,tonica:40,giro:[ji(0),bo(9),ji(5),Is(7)],melodia:.6,chocalho:!1,escala:W1}},th=[[0,2,3,6],[0,3,4,6,7],[2,3,5,6],[0,1,3,6],[0,4,6],[1,3,4,7]];class wd{constructor(t,e){this.ctx=t,this.destino=e}clima=Gs.padrao;proximoClima=null;passo=0;proximo=0;timer=null;sorte=V1(20260827);frase=[];grau=2;get tocando(){return this.timer!==null}setClima(t){const e=Gs[t]??Gs.padrao;e!==this.clima&&(this.tocando?this.proximoClima=e:this.clima=e)}start(){this.timer===null&&(this.proximo=this.ctx.currentTime+.15,this.timer=window.setInterval(()=>this.agendar(),H1*1e3),this.agendar())}stop(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}preAgendar(t){for(this.proximo=0,this.passo=0;this.proximo<t;){this.tocarPasso(this.passo,this.proximo);const e=30/this.clima.bpm;this.proximo+=e*(this.passo%2===0?1.18:.82),this.passo+=1}}agendar(){const t=this.ctx.currentTime+G1;let e=0;for(;this.proximo<t&&e++<64;){this.tocarPasso(this.passo,this.proximo);const i=30/this.clima.bpm;this.proximo+=i*(this.passo%2===0?1.18:.82),this.passo+=1}}tocarPasso(t,e){const i=t%8;i===0&&(this.proximoClima&&(this.clima=this.proximoClima,this.proximoClima=null),(Math.floor(t/8)%2===0||this.frase.length===0)&&(this.frase=th[Math.floor(this.sorte()*th.length)]));const o=this.clima,s=Math.floor(t/8),a=o.giro[s%o.giro.length],r=o.tonica+a.raiz;if(i===0||i===4){const c=i===0?r:r+(this.sorte()<.4?7:4);ae(this.ctx,this.destino,{freq:pe(c),quando:e,dur:i===0?.6:.45,vol:.2,tipo:"sine",abafo:420})}if(i===2||i===5||i===7&&this.sorte()<.35){const c=r+24;for(const[l,h]of a.notas.entries())l===0&&i!==2||ae(this.ctx,this.destino,{freq:pe(c+h),quando:e,dur:.85,vol:.07,tipo:"triangle",ataque:.03,detune:l%2?5:-5,abafo:2400})}if(this.frase.includes(i)&&this.sorte()<o.melodia){const c=[-2,-1,-1,0,1,1,2];this.grau+=c[Math.floor(this.sorte()*c.length)],this.grau>o.escala.length-3&&(this.grau-=2),this.grau<2&&(this.grau+=2),this.grau=Math.max(0,Math.min(o.escala.length-1,this.grau));const l=i>=6?a.notas[Math.floor(this.sorte()*3)]:o.escala[this.grau],h=o.tonica+31;this.marimba(pe(h+l),e),l<=9&&this.sorte()<.22&&this.marimba(pe(h+l+12),e+.03,.4)}o.chocalho&&i%2===1&&$e(this.ctx,this.destino,{quando:e,dur:.06,vol:i===3||i===7?.035:.02,freq:6200,q:.8})}marimba(t,e,i=1){ae(this.ctx,this.destino,{freq:t,quando:e,dur:.42,vol:.13*i,tipo:"sine"}),t<900&&ae(this.ctx,this.destino,{freq:t*2,quando:e,dur:.1,vol:.04*i,tipo:"sine"})}}const eh="aristory.som",X1=.035;class j1{ctx=null;mestre=null;canalMusica=null;canalEfeitos=null;musica=null;mudo;climaPendente="padrao";contadores=new Map;ultimoEm=new Map;carregando=null;contagem=new Map;constructor(){this.mudo=localStorage.getItem(eh)==="0";const t=()=>this.ligar();for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,t,{once:!1,passive:!0})}get ligado(){return!this.mudo}get pronto(){return this.ctx!==null&&this.ctx.state==="running"}ligar(){if(!this.ctx){const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,this.mestre=e.createGain(),this.mestre.gain.value=this.mudo?0:.9,this.mestre.connect(e.destination),this.canalMusica=e.createGain(),this.canalMusica.gain.value=.9,this.canalMusica.connect(this.mestre),this.canalEfeitos=e.createGain(),this.canalEfeitos.gain.value=1,this.canalEfeitos.connect(this.mestre),this.musica=new wd(e,this.canalMusica),this.musica.setClima(this.climaPendente)}this.ctx.resume().then(()=>{this.mudo||this.musica?.start()})}setMudo(t){if(this.mudo=t,localStorage.setItem(eh,t?"0":"1"),this.mestre&&this.ctx){const e=this.ctx.currentTime;this.mestre.gain.cancelScheduledValues(e),this.mestre.gain.setValueAtTime(this.mestre.gain.value,e),this.mestre.gain.linearRampToValueAtTime(t?0:.9,e+.12)}t?this.musica?.stop():this.ctx?.state==="running"&&this.musica?.start()}setClima(t){this.climaPendente=t,this.musica?.setClima(t)}play(t){if(this.contagem.set(t,(this.contagem.get(t)??0)+1),this.mudo||!this.ctx||!this.canalEfeitos||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(e-(this.ultimoEm.get(t)??-1)<X1)return;this.ultimoEm.set(t,e);const i=(this.contadores.get(t)??0)+1;this.contadores.set(t,i),Sd[t]({ctx:this.ctx,destino:this.canalEfeitos,t:e,n:i})}carga(t){if(!this.ctx||!this.canalEfeitos||this.mudo||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(t===null){if(this.carregando){const{osc:o,ganho:s}=this.carregando;s.gain.cancelScheduledValues(e),s.gain.setValueAtTime(s.gain.value,e),s.gain.exponentialRampToValueAtTime(1e-4,e+.08),o.stop(e+.1),this.carregando=null}return}if(!this.carregando){const o=this.ctx.createOscillator();o.type="triangle";const s=this.ctx.createGain();s.gain.setValueAtTime(1e-4,e),s.gain.exponentialRampToValueAtTime(.05,e+.05),o.connect(s),s.connect(this.canalEfeitos),o.start(e),this.carregando={osc:o,ganho:s}}const i=pe(60+t*19);this.carregando.osc.frequency.setTargetAtTime(i,e,.04)}aplauso(){if(!this.ctx||!this.canalEfeitos)return;const t=this.ctx.currentTime;[0,5,9,12].forEach((e,i)=>{ae(this.ctx,this.canalEfeitos,{freq:pe(72+e),quando:t+i*.1,dur:.5,vol:.09,tipo:"triangle"})})}}const Y1={magro:.86,medio:1,forte:1.16},nh=.75,Z1=.13,$1={upright:{bracoX:-1.38,bracoZ:.16,balanco:.15,itemZ:0,itemX:0},relaxed:{bracoX:-.22,bracoZ:.46,balanco:.6,itemZ:.9,itemX:.13}};function Za(n,t,e){const i=new Wo,o=5;for(let a=0;a<o*2;a++){const r=a%2===0?n:n*.46,c=a/(o*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*r,h=Math.sin(c)*r;a===0?i.moveTo(l,h):i.lineTo(l,h)}i.closePath();const s=new oa(i,{depth:t,bevelEnabled:!1});return s.center(),new v(s,e)}class ec{group=new at;spec;headTop;body=new at;head=new at;armL=new at;armR=new at;maoDir=new at;legL=new at;legR=new at;blob;chapeu=new at;phase=0;bounce=0;beijo=0;maos=0;pose="none";patinando=!1;altoDoPatins=0;alturaDaPerna=0;pes=[];patins=[];targetFacing=0;swimming=!1;sitting=!1;deitado=!1;trocaMaterial=[];soVestido=[];soBanho=[];calcao;pernasDoShort=[];calcaoDaFicha;estampa=[];traje="normal";roupa={};extras=new Map;medidas;sobreTronco=[];cabelo;constructor(t){this.spec=t;const e=t.height,i=Y1[t.build],o=e*.28,s=e/1.7;this.altoDoPatins=Z1*s,this.alturaDaPerna=o;const a=e*.3,r=e*.17,c=o,l=o+a*.86,h=e*.1*i,d=e*.3;this.headTop=o+a+r*2.1,this.medidas={h:e,w:i,headR:r,legH:o,torsoH:a};const u=w(t.skin),p=w(t.shirt),g=w(t.pants),M=w(t.shoes);this.calcaoDaFicha=w(t.swim??t.pants);for(const[b,D]of[[this.legL,-1],[this.legR,1]]){b.position.set(D*e*.055*i,c,0);const F=new v(new An(e*.042*i,o*.62,4,10),g);F.position.y=-o*.48,b.add(F),this.trocaMaterial.push({mesh:F,normal:g,banho:u,slot:"pernas",parte:"principal"});const V=o*.36,q=new v(new et(e*.052*i,e*.064*i,V,14,1,!0),this.calcaoDaFicha);q.position.y=o*.02-V/2,q.visible=!1,b.add(q),this.soBanho.push(q),this.pernasDoShort.push(q);const W=new v(new k(e*.075*i,e*.045,e*.11),M);W.position.set(0,-o+e*.022,e*.018),b.add(W),this.trocaMaterial.push({mesh:W,normal:M,banho:u,slot:"pes",parte:"principal"}),this.pes.push(W);const j=Zr(t.shoes);j.scale.setScalar(s),j.visible=!1,b.add(j),this.patins.push(j),this.body.add(b)}const m=new v(new An(e*.105*i,a*.5,5,12),p);if(m.position.y=c+a*.52,m.scale.z=.82,this.body.add(m),this.trocaMaterial.push({mesh:m,normal:p,banho:u,slot:"tronco",parte:"principal"}),t.shirtAccent!==void 0){const b=new v(new et(e*.108*i,e*.108*i,e*.03,14,1,!0),w(t.shirtAccent,{doubleSide:!0}));b.position.y=c+a*.72,b.scale.z=.82,this.body.add(b),this.soVestido.push(b),this.sobreTronco.push(b)}if(t.jacket!==void 0){const b=w(t.jacket,{doubleSide:!0}),D=e*.105*i,F=new v(new et(D*1.14,D*1.1,a*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),b);F.position.y=c+a*.56,F.scale.z=.84,this.body.add(F),this.soVestido.push(F),this.sobreTronco.push(F);const V=new v(new Rt(e*.088*i,12,10,0,Math.PI*2,0,Math.PI*.62),w(t.jacket));V.position.set(0,l+a*.04,-D*.75),V.rotation.x=-.7,V.scale.set(1.15,1,.8),this.body.add(V),this.soVestido.push(V),this.sobreTronco.push(V)}const f=e*.118*i,S=e*.105,y=new v(new et(f,e*.112*i,S,14),this.calcaoDaFicha);y.position.y=c+e*.012,y.scale.z=.85,y.visible=!1,this.body.add(y),this.soBanho.push(y),this.calcao=y;for(const b of[.3,-.12]){const D=new v(new et(f*1.03,f*1.03,e*.019,14,1,!0),this.calcaoDaFicha);D.position.y=b*S,D.visible=!1,y.add(D),this.estampa.push(D)}for(const[b,D]of[[this.armL,-1],[this.armR,1]]){b.position.set(D*h,l,0);const F=t.jacket!==void 0?w(t.jacket):p,V=new v(new An(e*.038*i,d*.34,4,10),F);V.position.y=-d*.24,b.add(V),this.trocaMaterial.push({mesh:V,normal:F,banho:u,slot:"tronco",parte:"detalhe"});const q=new v(new An(e*.032*i,d*.28,4,10),u);q.position.y=-d*.66,b.add(q);const W=new v(new Rt(e*.04*i,10,8),u);W.position.y=-d*.92,b.add(W),this.body.add(b)}this.maoDir.position.y=-d*.98,this.armR.add(this.maoDir),this.head.position.y=o+a+r*.92;const x=new v(new et(e*.035,e*.04,e*.05,10),u);x.position.y=-r*.85,this.head.add(x);const A=new v(new Rt(r,20,16),u);A.scale.set(1,1.04,1),this.head.add(A);const C=w(t.eyes);for(const b of[-1,1]){const D=new v(new Rt(r*.14,10,8),C);if(D.position.set(b*r*.35,0,r*.9),D.scale.set(1,1.25,.6),this.head.add(D),t.blush!==void 0){const F=new v(new Oo(r*.16,12),je(t.blush,.75,!0));F.position.set(b*r*.56,-r*.26,r*.82),F.rotation.y=b*.35,this.head.add(F)}}const P=w(t.hair.color);for(const b of[-1,1]){const D=new v(new k(r*.3,r*.075,r*.06),P);D.position.set(b*r*.35,r*.3,r*.87),D.rotation.z=b*-.12,this.head.add(D)}const L=new v(new ge(r*.16,r*.035,6,14,Math.PI),C);L.position.set(0,-r*.38,r*.9),L.rotation.set(0,0,Math.PI),this.head.add(L);const E=this.head.children.length;this.buildHair(r),this.cabelo=this.head.children.slice(E),this.buildAccessories(r,d,l,h,a,c,i),this.body.add(this.head),this.group.add(this.body),this.blob=new v(new Oo(e*.16*i,18),je(2832939,.22,!0)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(b=>{b.isMesh&&b!==this.blob&&(b.castShadow=!0,b.receiveShadow=!1)})}buildHair(t){const{style:e,color:i}=this.spec.hair,o=w(i),s=(a,r,c=.62,l=0)=>{const h=new v(new Rt(t*a,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),o);return h.position.y=r,this.head.add(h),h};switch(e){case"raspado":{s(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{s(1.06,t*.04).scale.set(1,.95,.98);const r=new v(new k(t*1.5,t*.34,t*.42),o);r.position.set(0,t*.6,t*.62),r.rotation.x=-.18,this.head.add(r);break}case"franja":{s(1.07,t*.02);const a=new v(new et(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),o);a.position.set(0,t*.5,0),this.head.add(a);break}case"ondulado":{s(1.08,t*.02);for(const a of[-1,1]){const r=new v(new Rt(t*.46,12,10),o);r.position.set(a*t*.85,t*.1,-t*.1),r.scale.set(.8,1.15,1),this.head.add(r)}break}case"coque":{s(1.06,t*.02);const a=new v(new Rt(t*.42,12,10),o);a.position.set(0,t*.72,-t*.82),this.head.add(a);break}case"cachos-curtos":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?w(this.spec.hair.tips):o;s(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[d,u,p,g]of l)for(let M=0;M<u;M++){const m=M/u*Math.PI*2+d*1.9,f=Math.sin(d)*Math.cos(m),S=Math.cos(d),y=Math.sin(d)*Math.sin(m);if(S<.72&&y>.24)continue;const x=new v(new Rt(t*p*(1+(a-1)*.4),8,7),h%5===0?r:o),A=g*(1+(a-1)*.14),C=y>0?.9:1.02;x.position.set(f*t*A,S*t*A,y*t*A*C),this.head.add(x),h++}for(let d=0;d<5;d++){const u=new v(new Rt(t*.2*(1+(a-1)*.3),8,7),d===2?r:o);u.position.set((d-2)*t*.3,t*(.62-d%2*.07),t*.62),this.head.add(u)}for(let d=0;d<3;d++){const u=new v(new Rt(t*.24*(1+(a-1)*.4),8,7),d===1?r:o);u.position.set((d-1)*t*.3,t*(.84+d%2*.07),t*.44),this.head.add(u)}for(const d of[-1,1]){const u=new v(new Rt(t*.17,8,7),o);u.position.set(d*t*.9,-t*.12,t*.22),u.scale.set(.7,1.1,.85),this.head.add(u)}break}case"cacheado":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?w(this.spec.hair.tips):o;s(1+(a-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[d,u,p,g]of l)for(let M=0;M<u;M++){const m=M/u*Math.PI*2+d*2.3,f=Math.sin(d)*Math.cos(m),S=Math.cos(d),y=Math.sin(d)*Math.sin(m);if(d>.72&&y>.22)continue;const x=1+(a-1)*.55,A=new v(new Rt(t*p*x,8,7),h%4===0?r:o),C=g*(1+(a-1)*.28),P=y>0?.78:1.06;A.position.set(f*t*C,S*t*C,y*t*C*P),this.head.add(A),h++}for(let d=0;d<4;d++){const u=new v(new Rt(t*.22*(1+(a-1)*.4),8,7),d===1?r:o);u.position.set((d-1.5)*t*.34,t*(.62-d%2*.08),t*.62),this.head.add(u)}for(const d of[-1,1]){const u=new v(new Rt(t*.26*a,8,7),o);u.position.set(d*t*1.02*a,-t*.34,t*.28),u.scale.set(.8,1.25,.9),this.head.add(u)}break}}}buildAccessories(t,e,i,o,s,a,r){const c=this.spec.accessories??[],l=w(this.spec.accessoryColor??3093568);{const h=new v(new et(t*.7,t*.7,t*.11,16),w(16774096));h.position.y=t*1.42,this.chapeu.add(h);const d=new v(new Pe(t*.58,t*1.05,14),w(_.gold));d.position.y=t*1.98,this.chapeu.add(d);const u=Za(t*.3,t*.07,w(16774096));u.position.y=t*2.62,this.chapeu.add(u),this.chapeu.rotation.z=-.14,this.chapeu.visible=!1,this.head.add(this.chapeu)}if(c.includes("oculos")){for(const d of[-1,1]){const u=new v(new ge(t*.24,t*.045,8,16),l);u.position.set(d*t*.36,t*.06,t*.9),this.head.add(u)}const h=new v(new k(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new v(new Rt(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const d=new v(new et(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);d.position.set(0,t*.12,t*.28),d.rotation.x=-.12,this.head.add(d)}if(c.includes("barba")){const h=new v(new Rt(t*.72,14,12),w(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new v(new ge(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const d of[-1,1]){const u=new v(new et(t*.28,t*.28,t*.16,12),l);u.position.set(d*t*1.02,t*.02,0),u.rotation.z=Math.PI/2,this.head.add(u)}}if(c.includes("corrente")){const h=new v(new ge(t*.42,t*.035,6,20),w(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new v(new et(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,d=Za(t*.3,t*.06,w(15918799));d.position.set(-t*.78*h,t*.92*h,t*.62*h),d.rotation.set(.35,-.6,.3),this.head.add(d)}if(c.includes("laco")){const h=this.spec.height,d=new at,u=h*.105*r,p=new v(new Rt(h*.018,8,6),l);d.add(p);for(const g of[-1,1]){const M=new v(new ge(h*.026,h*.007,6,12),l);M.position.set(g*h*.03,h*.008,0),M.rotation.set(0,g*.5,g*.35),M.scale.set(1,.7,1),d.add(M);const m=new v(new k(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,d.add(m)}d.position.set(0,i-s*.1,u*.86),this.body.add(d),this.soVestido.push(d),this.sobreTronco.push(d)}if(c.includes("cinto")){const h=this.spec.height,d=h*.105*r,u=a+s*.08,p=new v(new et(d*1.04,d*1.04,h*.032,16,1,!0),l);p.position.y=u,p.scale.z=.84,this.body.add(p),this.soVestido.push(p),this.sobreTronco.push(p);const g=new v(new k(h*.032,h*.03,h*.012),w(14210252));g.position.set(0,u,d*.9),this.body.add(g),this.soVestido.push(g),this.sobreTronco.push(g);const M=new v(new ge(h*.028,h*.004,5,12,Math.PI),w(14210252));M.position.set(d*.6,u-h*.012,d*.6),M.rotation.set(0,-.7,Math.PI),this.body.add(M),this.soVestido.push(M),this.sobreTronco.push(M);const m=Za(h*.016,h*.004,w(14210252));m.position.set(d*.76,u-h*.05,d*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m),this.sobreTronco.push(m)}if(c.includes("mochila")){const h=new v(new k(o*1.7,s*.62,this.spec.height*.09),l);h.position.set(0,a+s*.6,-this.spec.height*.11*r),this.body.add(h),this.soVestido.push(h),this.sobreTronco.push(h);const d=i;for(const u of[-1,1]){const p=new v(new k(this.spec.height*.022,s*.5,this.spec.height*.02),l);p.position.set(u*o*.6,d-s*.2,this.spec.height*.085*r),this.body.add(p),this.soVestido.push(p),this.sobreTronco.push(p)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setCampeao(t){this.chapeu.visible=t}get campeao(){return this.chapeu.visible}setOutfit(t){this.traje=t,this.aplicarVisual()}aplicarVisual(){const t=this.traje==="banho";for(const a of this.trocaMaterial){if(t){a.mesh.material=a.banho;continue}if(this.mostraPele(a.slot,a.parte)){a.mesh.material=a.banho;continue}const r=this.roupa[a.slot];if(!r){a.mesh.material=a.normal;continue}const c=a.parte==="detalhe"?r.corDetalhe??r.cor:r.cor;a.mesh.material=c===void 0?a.normal:w(c)}for(const a of this.soVestido)a.visible=!t;for(const a of this.soBanho)a.visible=t;const e=this.roupa.pernas,i=e?.corBanho===void 0?this.calcaoDaFicha:w(e.corBanho);this.calcao.material=i;for(const a of this.pernasDoShort)a.material=i;for(const a of this.estampa)a.visible=e?.estampaBanho!==void 0,e?.estampaBanho!==void 0&&(a.material=w(e.estampaBanho));if(!t&&this.roupa.tronco)for(const a of this.sobreTronco)a.visible=!1;for(const[a,r]of this.extras){const c=this.roupa[a]!==void 0&&(a==="cabeca"||!t)&&!(a==="pes"&&this.patinando);for(const l of r)l.visible=c}for(const a of this.pes)a.visible=!this.patinando;for(const a of this.patins)a.visible=this.patinando;const s=this.roupa.cabeca?.cobreCabelo===!0;for(const a of this.cabelo)a.visible=!s}mostraPele(t,e){for(const i of Object.values(this.roupa))if(i&&(i.pernasNuas&&t==="pernas"&&!this.roupa.pernas||i.bracosNus&&t==="tronco"&&e==="detalhe"))return!0;return!1}vestirRoupa(t){for(const e of pn){const i=t[e]??null;if((this.roupa[e]?.id??null)===i)continue;this.tirarExtras(e);const o=i?Vs(i):null;this.roupa[e]=o??void 0,o?.extra&&this.porExtras(e,o)}this.aplicarVisual()}get roupaAtual(){const t={};for(const e of pn){const i=this.roupa[e];i&&(t[e]=i.id)}return t}porExtras(t,e){if(!e.extra&&!e.extraBraco)return;const i=[];e.extra&&(t==="pes"||t==="pernas"?i.push([this.legL,"corpo",-1],[this.legR,"corpo",1]):t==="cabeca"?i.push([this.head,"corpo",1]):i.push([this.body,"corpo",1])),e.extraBraco&&i.push([this.armL,"braco",-1],[this.armR,"braco",1]);const o=[];for(const[s,a,r]of i){const c=a==="braco"?e.extraBraco(this.medidas,r):e.extra(this.medidas,r);c.userData.roupa=e.id,c.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!1)}),s.add(c),o.push(c)}this.extras.set(t,o)}tirarExtras(t){const e=this.extras.get(t);if(e){for(const i of e)i.parent?.remove(i),i.traverse(o=>{const s=o;s.isMesh&&s.geometry.dispose()});this.extras.delete(t)}}setSitting(t){this.sitting=t,t||(this.poeAltura(0),this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setLying(t){this.deitado=t,t||(this.poeAltura(0),this.legL.rotation.set(0,0,0),this.legR.rotation.set(0,0,0),this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08),this.body.rotation.x=0)}setPatins(t){if(this.patinando!==t){this.patinando=t;for(const e of this.patins)e.position.y=-this.alturaDaPerna-this.altoDoPatins;this.aplicarVisual()}}get patinandoAgora(){return this.patinando}segurar(t,e="none"){for(let i=this.maoDir.children.length-1;i>=0;i--)this.maoDir.remove(this.maoDir.children[i]);this.pose=t?e:"none",t&&this.maoDir.add(t)}get segurando(){return this.maoDir.children.length>0}setHoldingHands(t){this.maos=t}get holdingHands(){return this.maos!==0}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let i=this.targetFacing-this.group.rotation.y;if(i=Math.atan2(Math.sin(i),Math.cos(i)),this.group.rotation.y+=i*Math.min(1,t*14),this.beijo>.001){const c=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=c*.3,this.poeAltura(c*.045),this.armL.rotation.set(-c*.55,0,.08+c*.16),this.armR.rotation.set(-c*.55,0,-.08-c*.16),this.head.rotation.x=c*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.deitado){this.phase+=t*.55,this.legL.rotation.set(0,0,-.05),this.legR.rotation.set(0,0,.05);const c=Math.sin(this.phase)*.07,l=Math.sin(this.phase*.73)*.05;this.armL.rotation.set(l,0,-.14-c),this.armR.rotation.set(-l,0,.14+c),this.body.rotation.x=Math.sin(this.phase)*.02,this.head.rotation.x=Math.sin(this.phase*.6)*.025,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9;const c=Math.sin(this.phase*2.2)*.17;this.legL.rotation.x=-Math.PI/2+.06+c,this.legR.rotation.x=-Math.PI/2-.02-c,this.armL.rotation.set(-.25,0,-.34),this.armR.rotation.set(-.2,0,.34),this.maos!==0&&(this.maos<0?this.armL:this.armR).rotation.set(.12,0,nh*.8*this.maos),this.body.rotation.x=-.05,this.poeAltura(Math.sin(this.phase)*.012),this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const c=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+c*.9,this.armR.rotation.x=-1.1-c*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=c*.28,this.legR.rotation.x=-c*.28,this.body.rotation.x=.16,this.poeAltura(Math.sin(this.phase)*.03),this.head.rotation.x=-.14;return}const o=e>.05,s=this.patinando?.9+e*.33:3.2+e*1.9;this.phase+=t*(o?s:1.4);const a=o?this.patinando?Math.min(.34,.12+e*.06):Math.min(.62,.16+e*.14):.04,r=Math.sin(this.phase*(o?2:1));if(this.patinando){const c=o?Math.min(.28,.1+e*.04):.03;this.legL.rotation.z=-Math.max(0,r)*c*1.7,this.legR.rotation.z=Math.max(0,-r)*c*1.7,this.legL.rotation.x=o?r*a*.25:0,this.legR.rotation.x=o?-r*a*.25:0,this.body.rotation.z=r*c*.34;const l=.34+Math.abs(r)*.14;this.armL.rotation.x=o?-r*a*.9:0,this.armR.rotation.x=o?r*a*.9:0,this.armL.rotation.z=-l,this.armR.rotation.z=l}else this.legL.rotation.z=0,this.legR.rotation.z=0,this.body.rotation.z=0,this.legL.rotation.x=o?r*a:0,this.legR.rotation.x=o?-r*a:0,this.armL.rotation.x=o?-r*a*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=o?r*a*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08;if(this.maos!==0){const c=this.maos<0?this.armL:this.armR,l=this.maos<0?this.armR:this.armL;c.rotation.z=nh*this.maos,c.rotation.x=-.1,l.rotation.x*=.5}if(this.aplicarPose(),this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const c=Math.sin((1-this.bounce)*Math.PI)*.28;this.poeAltura(c),this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const c=o?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.poeAltura(c),this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=o?this.patinando?.16:.06:0,this.head.rotation.x=o?-.05:Math.sin(this.phase*.6)*.03}poeAltura(t){this.body.position.y=t+this.altoDoPatins*(this.patinando?1:0)}aplicarPose(){if(this.pose==="none"||this.maos>0){this.maoDir.rotation.set(0,0,0),this.maoDir.position.x=0;return}const t=$1[this.pose];this.armR.rotation.x=t.bracoX+this.armR.rotation.x*t.balanco,this.armR.rotation.z=t.bracoZ,this.maoDir.rotation.set(-this.armR.rotation.x,0,t.itemZ-this.armR.rotation.z),this.maoDir.position.x=t.itemX}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class J1{renderer;cena=new Fh;camera=new sn(30,1,.1,20);pedestal=new at;rig=null;spec=null;giro=0;alvo=0;constructor(t){this.renderer=new id({canvas:t,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.cena.add(this.pedestal);const e=new Jh(16777215,8952234,1.5);this.cena.add(e);const i=new Wr(16774368,1.5);i.position.set(3,5,4),this.cena.add(i);const o=new Wr(12572927,.5);o.position.set(-3,2,-3),this.cena.add(o)}mostrar(t){if(this.spec?.id===t.id)return;this.rig&&(this.pedestal.remove(this.rig.group),this.rig.dispose()),this.spec=t,this.rig=new ec(t),this.pedestal.add(this.rig.group);const e=t.height;this.rig.group.position.y=-e*.5,this.camera.position.set(0,e*.04,e*2.28),this.camera.lookAt(0,0,0)}vestir(t){this.rig?.vestirRoupa(t)}girar(t){this.alvo+=t}update(t){this.rig&&(this.giro+=(this.alvo-this.giro)*Math.min(1,t*9),this.pedestal.rotation.y=this.giro,this.rig.update(t,0))}desenhar(){if(!this.rig)return;const t=this.renderer.domElement,e=t.clientWidth,i=t.clientHeight;e<2||i<2||((t.width!==e||t.height!==i)&&this.renderer.setSize(e,i,!1),this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.render(this.cena,this.camera))}dispose(){this.rig?.dispose(),this.rig=null,this.spec=null,this.renderer.dispose()}}class K1{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;if(!this.enabled){this.hot=!1,this.pulse=0,this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const i=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(i*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(i*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}class Q1{constructor(t){this.game=t}root=new at;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,i,o,s=0){return t.position.set(e,i,o),t.rotation.y=s,t}chaoAcimaDeOutro(t){return(t??0)>0}ground(t){const e=new ze(t.width,t.depth,1,1),i=this.chaoAcimaDeOutro(t.y),o=new v(e,w(t.color,{decal:i}));return o.rotation.x=-Math.PI/2,o.position.set(t.x??0,t.y??0,t.z??0),i?this.decalar(o):(o.receiveShadow=!0,this.root.add(o),o)}groundWithHoles(t){const e=t.width/2,i=t.depth/2,o=new Wo;o.moveTo(-e,-i),o.lineTo(e,-i),o.lineTo(e,i),o.lineTo(-e,i),o.closePath();for(const r of t.holes){const c=new Hr,l=r.x-r.width/2,h=r.x+r.width/2,d=-r.z-r.depth/2,u=-r.z+r.depth/2;c.moveTo(l,d),c.lineTo(h,d),c.lineTo(h,u),c.lineTo(l,u),c.closePath(),o.holes.push(c)}const s=this.chaoAcimaDeOutro(t.y),a=new v(new Ec(o),w(t.color,{decal:s}));return a.rotation.x=-Math.PI/2,a.position.set(t.x??0,t.y??0,t.z??0),s?this.decalar(a):(a.receiveShadow=!0,this.root.add(a),a)}decalar(t){return t.renderOrder=++this.decalque,t.receiveShadow=!0,this.root.add(t),t}patch(t,e,i,o,s,a=0,r=.01){const c=new v(new ze(i,o),w(s,{decal:!0}));return c.rotation.set(-Math.PI/2,0,0),c.rotation.z=a,c.position.set(t,r,e),this.decalar(c)}disc(t,e,i,o,s=.01){const a=new v(new Oo(i,28),w(o,{decal:!0}));return a.rotation.x=-Math.PI/2,a.position.set(t,s,e),this.decalar(a)}ring(t,e,i,o,s,a=.01){const r=new wc(Math.max(0,i-o),i,40),c=new v(r,w(s,{decal:!0}));return c.rotation.x=-Math.PI/2,c.position.set(t,a,e),this.decalar(c)}blockBox(t,e,i,o,s=0){this.colliders.push({kind:"box",x:t,z:e,hw:i,hd:o,rot:s})}blockCircle(t,e,i){this.colliders.push({kind:"circle",x:t,z:e,r:i})}blockFrom(t,e=.9){const i=new lo().setFromObject(t),o=i.getSize(new z),s=i.getCenter(new z);this.blockBox(s.x,s.z,o.x/2*e,o.z/2*e,0)}setBounds(t,e,i,o){this.bounds={minX:t,minZ:e,maxX:i,maxZ:o}}wall(t,e,i,o,s=3,a=15984595,r=.3){const c=i-t,l=o-e,h=Math.hypot(c,l),d=Math.atan2(l,c),u=new v(new k(h,s,r),w(a));return u.position.set((t+i)/2,s/2,(e+o)/2),u.rotation.y=-d,this.add(u),this.blockBox((t+i)/2,(e+o)/2,h/2,r/2,-d),u}interact(t){const e=new K1(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}banco(t,e,i=0,o){const s=this.add(this.place(rd(o),t,0,e,i));this.blockBox(t,e,.95,.35,i);const a=new xe;a.position.set(t,0,e),a.rotation.y=i+Math.PI,this.root.add(a);const r=new xe;r.position.set(t,.9,e),this.root.add(r);const c=.06,l=.46;return this.interact({id:`banco:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:1.9,label:"Sentar no banco",icon:"🪑",highlight:s,onInteract:async h=>{h.lockPlayer(!0),h.ridePlayer(a,new z(-l,c,.02),1,Math.PI),h.rideCompanion(a,new z(l,c,.02),1,Math.PI),h.setSitting(!0),h.focusCamera(r),await h.wait(.5),await h.say(["Senta aqui um pouco."],h.companionName()),await h.say(["Só um pouquinho."],h.playerName());let d=0;for(;d===0;)d=await h.ask("Ficar mais um pouco?",["Ficar","Levantar"]),d===0&&await h.wait(4);h.setSitting(!1),h.focusCamera(null);const u=i,p=Math.sin(u)*1.5,g=Math.cos(u)*1.5;h.releasePlayer(t+p-Math.cos(u)*.5,e+g+Math.sin(u)*.5,u),h.releaseCompanion(t+p+Math.cos(u)*.5,e+g-Math.sin(u)*.5,u),h.lockPlayer(!1)}}),s}mesaDePiquenique(t,e,i=0){const o=this.add(this.place(cd(),t,0,e,i));this.blockBox(t,e,1.05,.75,i);const s=new xe;s.position.set(t,0,e),s.rotation.y=i,this.root.add(s);const a=new xe;a.position.set(t,.95,e),this.root.add(a);const r=.02,c=.78;return this.interact({id:`piquenique:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:2.1,label:"Sentar na mesa",icon:"🧺",highlight:o,onInteract:async l=>{l.lockPlayer(!0),l.ridePlayer(s,new z(0,r,c),1,Math.PI),l.rideCompanion(s,new z(0,r,-c),1,0),l.setSitting(!0),l.focusCamera(a),await l.wait(.5),await l.say(["De frente pra você é melhor."],l.companionName()),await l.say(["É. Dá pra ver você falando."],l.playerName());let h=0;for(;h===0;)h=await l.ask("Ficar mais um pouco?",["Ficar","Levantar"]),h===0&&await l.wait(4);l.setSitting(!1),l.focusCamera(null);const d=Math.sin(i),u=Math.cos(i);l.releasePlayer(t+d*1.7,e+u*1.7,i+Math.PI),l.releaseCompanion(t-d*1.7,e-u*1.7,i),l.lockPlayer(!1)}}),o}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}const yn={x:.5,y:.44},xn=n=>1/(1+8.5*n),t_=(n,t,e,i,o)=>{const s=xn(e);return{x:(yn.x+n*s)*i,y:(yn.y+t*s)*o}},hn=.56,ih=-.44,Mn=.62,$a=-.28,oh=-.34,bn={ariCabelo:"#8f5c33",ariRoupa:"#e8e2d6",ariPele:"#f2cfb2",renanCabelo:"#1f1712",renanRoupa:"#1b1c22",renanPele:"#efc8a4",perna:"#15161c"},Ce={ceuTopo:"#0a1120",ceuBaixo:"#2b3d58",vigaFrente:"#6d4028",vigaBaixo:"#3c2115",longarina:"#7d4d31",tijolo:"#b1613f",tijoloSombra:"#7e4029",tijoloJunta:"#cd8461",base:"#8a8781",chaoPerto:"#8b7a51",chaoLonge:"#4a4536",junta:"#6f6650",tatil:"#77746b",tatilRisco:"#95928a",folhaClara:"#2c5741",folhaEscura:"#16301f",fio:"#5d5346",luz:"#ffd489",luzNucleo:"#fff8e6"},_e={ceuTopo:"#1f74c8",ceuBaixo:"#a9d9f2",mataLonge:"#4d7f4a",mataPerto:"#356b39",gramaAlta:"#8fae55",gramaBaixa:"#a8bd68",sombra:"#5f7a3c",inflavelClaro:"#eeeae2",inflavelCinza:"#cfd2d4",inflavelRosa:"#f06a9c",bannerXadrez:"#3f8fd1",bannerFundo:"#fbfaf6",bannerRosa:"#ef5ba1",bannerTexto:"#e0357f",gato:"#fdfcf9",gatoTraco:"#3b3630",lacoVermelho:"#e0342f",verdeBrinquedo:"#57bd45",verdeBrinquedoFundo:"#3f9a32",azulBrinquedo:"#3aa9e8",azulBrinquedoFundo:"#2681bd",amareloBrinquedo:"#f5c518",roxoBrinquedo:"#8f5cc4",torre:"#f5822c",grade:"#3f6fbd"},sh=["#e8442f","#f5c518","#3d9be0","#f07ab0","#f7f4ec","#6fc04a","#f5822c","#a069c4"];function e_(n,t,e,i,o){n.strokeStyle=o,n.lineCap="round",n.lineWidth=Math.max(1.2,i*.04),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(t-i*.07,e-i*.55,t,e-i),n.stroke();const s=e-i;n.lineWidth=Math.max(1.6,i*.1);for(let a=0;a<9;a++){const r=-Math.PI*.94+a/8*Math.PI*.88,c=i*(.42+.14*Math.sin(a*1.7));n.beginPath(),n.moveTo(t,s+i*.04),n.quadraticCurveTo(t+Math.cos(r)*c*.62,s+Math.sin(r)*c*.58,t+Math.cos(r)*c,s+Math.sin(r)*c+c*.34),n.stroke()}}function n_(n,t,e,i,o){if(i>1.4){const s=n.createRadialGradient(t,e,0,t,e,i*6);s.addColorStop(0,`rgba(255, 206, 128, ${.58*o})`),s.addColorStop(.45,`rgba(255, 178, 96, ${.18*o})`),s.addColorStop(1,"rgba(255, 170, 90, 0)"),n.fillStyle=s,n.beginPath(),n.arc(t,e,i*6,0,Math.PI*2),n.fill()}n.fillStyle=Ce.luz,n.globalAlpha=o,n.beginPath(),n.arc(t,e,i,0,Math.PI*2),n.fill(),n.fillStyle=Ce.luzNucleo,n.beginPath(),n.arc(t,e,i*.45,0,Math.PI*2),n.fill(),n.globalAlpha=1}function Qs(n,t,e,i,o,s,a,r){const c=i*.3;n.strokeStyle=bn.perna,n.lineWidth=i*.075,n.lineCap="round";for(const l of[-1,1])n.beginPath(),n.moveTo(t,e-i*.42),n.lineTo(t+l*c*.26*a,e),n.stroke();if(r){n.strokeStyle=r,n.lineWidth=i*.055;for(const l of[-1,1])n.beginPath(),n.moveTo(t+l*c*.42,e-i*.72),n.lineTo(t+l*c*.52,e-i*.44),n.stroke()}n.fillStyle=o,n.beginPath(),n.roundRect(t-c/2,e-i*.78,c,i*.4,c*.32),n.fill(),n.fillStyle=s,n.beginPath(),n.arc(t,e-i*.87,i*.11,0,Math.PI*2),n.fill()}function Ja(n,t,e,i,o,s,a,r,c,l){const h=(t+i)/2,d=(e+o)/2+s,u=p=>{const g=1-p;return{x:g*g*t+2*g*p*h+p*p*i,y:g*g*e+2*g*p*d+p*p*o}};n.strokeStyle="rgba(240, 240, 235, 0.85)",n.lineWidth=Math.max(.8,a*.05),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(h,d,i,o),n.stroke();for(let p=0;p<r;p++){const g=(p+.5)/r,M=u(Math.max(0,g-.012)),m=u(Math.min(1,g+.012)),f=m.x-M.x,S=m.y-M.y,y=Math.hypot(f,S)||1,x=-S/y,A=f/y,C=Math.sin(l*1.1+p*.8)*a*.06;n.fillStyle=sh[(p+c)%sh.length],n.beginPath(),n.moveTo(M.x,M.y),n.lineTo(m.x,m.y),n.lineTo((M.x+m.x)/2-x*a+C,(M.y+m.y)/2-A*a),n.closePath(),n.fill()}}function i_(n,t,e,i){n.fillStyle=_e.gato;for(const o of[-1,1])n.beginPath(),n.moveTo(t+o*i*.92,e-i*.28),n.lineTo(t+o*i*.62,e-i*1.15),n.lineTo(t+o*i*.16,e-i*.6),n.closePath(),n.fill();n.beginPath(),n.ellipse(t,e,i,i*.82,0,0,Math.PI*2),n.fill(),n.fillStyle=_e.lacoVermelho;for(const o of[-1,1])n.beginPath(),n.ellipse(t+i*(.78+o*.24),e-i*.5,i*.26,i*.2,0,0,Math.PI*2),n.fill();n.fillStyle=_e.gatoTraco;for(const o of[-1,1])n.beginPath(),n.ellipse(t+o*i*.36,e-i*.02,i*.09,i*.13,0,0,Math.PI*2),n.fill();n.fillStyle=_e.amareloBrinquedo,n.beginPath(),n.ellipse(t,e+i*.14,i*.11,i*.08,0,0,Math.PI*2),n.fill(),n.strokeStyle=_e.gatoTraco,n.lineWidth=Math.max(.5,i*.05);for(const o of[-1,1])for(let s=-1;s<=1;s++)n.beginPath(),n.moveTo(t+o*i*.6,e+i*.1+s*i*.14),n.lineTo(t+o*i*1.02,e+i*.04+s*i*.2),n.stroke()}function Ls(n,t,e,i,o,s,a){const r=Math.min(o*.42,i*.2);n.fillStyle=s,n.beginPath(),n.roundRect(t,e,i,o,r),n.fill(),n.strokeStyle=a,n.lineWidth=Math.max(.7,o*.045);const c=Math.max(2,Math.round(i/(o*.75)));for(let l=1;l<c;l++){const h=t+i*l/c;n.beginPath(),n.moveTo(h,e+o*.14),n.lineTo(h,e+o*.86),n.stroke()}n.strokeStyle="rgba(255, 255, 255, 0.34)",n.lineWidth=Math.max(.8,o*.07),n.beginPath(),n.moveTo(t+r,e+o*.16),n.lineTo(t+i-r,e+o*.16),n.stroke()}function o_(n,t,e,i){const o=(y,x,A)=>t_(y,x,A,t,e),s=yn.y*e,a=n.createLinearGradient(0,0,0,s);a.addColorStop(0,Ce.ceuTopo),a.addColorStop(1,Ce.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,s);const r=n.createLinearGradient(0,s,0,e);r.addColorStop(0,Ce.chaoLonge),r.addColorStop(1,Ce.chaoPerto),n.fillStyle=r,n.fillRect(0,s,t,e-s);const c=n.createRadialGradient(yn.x*t,e*.86,0,yn.x*t,e*.86,t*.62);c.addColorStop(0,"rgba(255, 196, 122, 0.3)"),c.addColorStop(1,"rgba(255, 190, 120, 0)"),n.fillStyle=c,n.fillRect(0,s,t,e-s),n.strokeStyle=Ce.junta;for(let y=0;y<26;y++){const x=y*.036,A=o(-Mn,hn,x),C=o(Mn,hn,x);n.globalAlpha=Math.min(.42,.42*xn(x)*3.2),n.lineWidth=Math.max(.5,3*xn(x)),n.beginPath(),n.moveTo(A.x,A.y),n.lineTo(C.x,C.y),n.stroke()}n.globalAlpha=.22,n.lineWidth=1;for(let y=-6;y<=6;y++){if(y===0)continue;const x=o(y*.1,hn,0);n.beginPath(),n.moveTo(yn.x*t,yn.y*e),n.lineTo(x.x,x.y),n.stroke()}n.globalAlpha=1;const l=o(-.05,hn,0),h=o(.05,hn,0),d=o(-.05,hn,.97),u=o(.05,hn,.97);n.fillStyle=Ce.tatil,n.beginPath(),n.moveTo(l.x,l.y),n.lineTo(h.x,h.y),n.lineTo(u.x,u.y),n.lineTo(d.x,d.y),n.closePath(),n.fill(),n.strokeStyle=Ce.tatilRisco;for(let y=0;y<22;y++){const x=y*.042,A=o(-.038,hn,x),C=o(.038,hn,x);n.lineWidth=Math.max(.5,3.2*xn(x)),n.beginPath(),n.moveTo(A.x,A.y),n.lineTo(C.x,C.y),n.stroke()}for(let y=5;y>=0;y--){const x=.12+y*.15,A=xn(x);for(const C of[-1,1]){const P=o(C*(Mn+.13),hn,x);e_(n,P.x,P.y,e*.85*A,y%2===0?Ce.folhaEscura:Ce.folhaClara)}}for(let y=7;y>=0;y--){const x=y*.115,A=xn(x),C=t*.085*A;for(const P of[-1,1]){const L=o(P*Mn,hn,x),E=o(P*Mn,$a,x),b=L.x-C/2;n.fillStyle=Ce.tijolo,n.fillRect(b,E.y,C,L.y-E.y),n.fillStyle=Ce.tijoloSombra,n.fillRect(P<0?b+C*.68:b,E.y,C*.32,L.y-E.y);const D=(L.y-E.y)*.09;if(n.fillStyle=Ce.base,n.fillRect(b-C*.06,L.y-D,C*1.12,D),x<.3){n.strokeStyle=Ce.tijoloJunta,n.lineWidth=Math.max(.5,1.6*A),n.globalAlpha=.5;const F=L.y-D;for(let V=1;V<14;V++){const q=E.y+(F-E.y)*V/14;n.beginPath(),n.moveTo(b,q),n.lineTo(b+C,q),n.stroke()}n.globalAlpha=1}}}n.strokeStyle=Ce.longarina,n.lineCap="butt";for(const y of[-1,1]){const x=o(y*Mn*1.05,$a,0),A=o(y*Mn*1.05,$a,.95);n.lineWidth=t*.03,n.beginPath(),n.moveTo(x.x,x.y),n.lineTo(A.x,A.y),n.stroke()}for(let y=17;y>=0;y--){const x=y*.052,A=xn(x),C=o(-Mn*1.16,ih,x),P=o(Mn*1.16,ih,x),L=Math.max(1,e*.05*A);n.fillStyle=Ce.vigaFrente,n.fillRect(C.x,C.y,P.x-C.x,L),n.fillStyle=Ce.vigaBaixo,n.fillRect(C.x,C.y+L*.62,P.x-C.x,L*.38)}const p=9;for(let y=0;y<p;y++){const x=.02+y*.095,A=x+.095,C=y%2===0?-1:1,P=o(C*Mn*1.02,oh,x),L=o(-C*Mn*1.02,oh,A),E=e*.06*xn(x),b=(P.x+L.x)/2,D=(P.y+L.y)/2+E;n.strokeStyle=Ce.fio,n.lineWidth=Math.max(.4,1.8*xn(x)),n.beginPath(),n.moveTo(P.x,P.y),n.quadraticCurveTo(b,D,L.x,L.y),n.stroke();const F=7;for(let V=0;V<=F;V++){const q=V/F,W=1-q,j=W*W*P.x+2*W*q*b+q*q*L.x,N=W*W*P.y+2*W*q*D+q*q*L.y,B=xn(x+(A-x)*q),K=.82+.18*Math.sin(i*1.6+y*2.1+V*.9);n_(n,j,N+e*.012*B,Math.max(.7,t*.015*B),K)}}const g=n.createRadialGradient(yn.x*t,yn.y*e-e*.02,0,yn.x*t,yn.y*e-e*.02,t*.085);g.addColorStop(0,"rgba(255, 232, 182, 0.9)"),g.addColorStop(.35,"rgba(255, 196, 118, 0.34)"),g.addColorStop(1,"rgba(255, 180, 100, 0)"),n.fillStyle=g,n.fillRect(0,0,t,e);const M=Math.sin(i*2.4),m=o(0,hn,.66),f=e*.5*xn(.66);Qs(n,m.x-f*.34,m.y,f,bn.ariRoupa,bn.ariCabelo,M),Qs(n,m.x+f*.34,m.y,f,bn.renanRoupa,bn.renanCabelo,-M),n.fillStyle="rgba(255, 176, 96, 0.07)",n.fillRect(0,0,t,e);const S=n.createRadialGradient(t/2,e*.48,t*.2,t/2,e*.48,t*.78);S.addColorStop(0,"rgba(0, 0, 0, 0)"),S.addColorStop(1,"rgba(6, 9, 16, 0.62)"),n.fillStyle=S,n.fillRect(0,0,t,e)}function s_(n,t,e,i){const s=.585*e,a=n.createLinearGradient(0,0,0,s);a.addColorStop(0,_e.ceuTopo),a.addColorStop(1,_e.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,s);for(const[S,y,x,A]of[[-.05,.5,.15,_e.mataLonge],[.42,1.05,.125,_e.mataLonge],[-.05,1.05,.08,_e.mataPerto]]){n.fillStyle=A,n.beginPath(),n.moveTo(S*t,s);for(let C=S;C<=y;C+=.035){const P=s-x*e*(.6+.4*Math.abs(Math.sin(C*27)));n.lineTo(C*t,P)}n.lineTo(y*t,s),n.closePath(),n.fill()}const r=.235*e;n.fillStyle=_e.inflavelClaro,n.beginPath(),n.moveTo(0*t,s),n.lineTo(.245*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,s),n.closePath(),n.fill(),n.fillStyle=_e.inflavelCinza,n.beginPath(),n.moveTo(0*t,s),n.lineTo(.245*t,r),n.lineTo(.315*t,r),n.lineTo(.14*t,s),n.closePath(),n.fill(),n.fillStyle=_e.inflavelCinza,n.beginPath(),n.moveTo(.235*t,r+.012*e),n.lineTo(.325*t,.175*e),n.lineTo(.412*t,r+.012*e),n.closePath(),n.fill(),n.fillStyle=_e.inflavelRosa,n.beginPath(),n.moveTo(.055*t,s-.075*e),n.lineTo(.47*t,s-.075*e),n.lineTo(.485*t,s-.035*e),n.lineTo(.04*t,s-.035*e),n.closePath(),n.fill(),n.fillStyle="rgba(112, 126, 138, 0.34)",n.beginPath(),n.moveTo(.325*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,s),n.lineTo(.33*t,s),n.closePath(),n.fill(),n.fillStyle="rgba(84, 95, 105, 0.5)",n.beginPath(),n.roundRect(.135*t,s-.075*e,.145*t,.04*e,.014*t),n.fill(),n.strokeStyle="rgba(138, 148, 156, 0.75)",n.lineWidth=Math.max(.8,e*.0045);for(let S=1;S<6;S++){const y=S/6;n.beginPath(),n.moveTo((.245+y*.155)*t,r),n.lineTo((0+y*.5)*t,s),n.stroke()}const c=.42*t,l=.425*e,h=.62*t,d=.075*e;n.fillStyle=_e.bannerFundo,n.fillRect(c,l,h,d),n.fillStyle=_e.bannerXadrez;const u=d/3;for(let S=0;S<h;S+=u)for(let y=0;y<d;y+=u)(S<u*2.2||S>h-u*5.5)&&Math.round(S/u+y/u)%2===0&&n.fillRect(c+S,l+y,u,u);n.fillStyle=_e.bannerRosa,n.fillRect(c+h-u*4.4,l,u*4.4,d),n.fillStyle="rgba(255, 255, 255, 0.85)";for(let S=0;S<3;S++)n.fillRect(c+h-u*4,l+d*(.25+S*.2),u*3.4,d*.08);i_(n,c+h-u*6.4,l+d*.46,d*.4),n.fillStyle=_e.bannerTexto,n.font=`900 ${Math.round(d*.42)}px system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText("ARRAIÁ",c+h*.42,l+d*.5),n.textAlign="left",n.textBaseline="alphabetic",Ls(n,.05*t,s-.055*e,.13*t,.055*e,_e.roxoBrinquedo,"#6f45a0"),Ls(n,.36*t,s-.085*e,.12*t,.085*e,_e.azulBrinquedo,_e.azulBrinquedoFundo),Ls(n,.47*t,s-.05*e,.06*t,.05*e,_e.amareloBrinquedo,"#cf9f0e"),Ls(n,.52*t,s-.075*e,.5*t,.075*e,_e.verdeBrinquedo,_e.verdeBrinquedoFundo),n.strokeStyle=_e.grade,n.lineWidth=Math.max(.7,e*.0035);for(let S=0;S<9;S++){const y=(.19+S*.019)*t;n.beginPath(),n.moveTo(y,s-.035*e),n.lineTo(y,s),n.stroke()}n.beginPath(),n.moveTo(.185*t,s-.032*e),n.lineTo(.36*t,s-.032*e),n.stroke(),n.strokeStyle=_e.torre,n.lineWidth=Math.max(1.2,t*.008),n.beginPath(),n.moveTo(.9*t,s+.3*e),n.lineTo(.955*t,s-.09*e),n.moveTo(1.02*t,s+.3*e),n.lineTo(.985*t,s-.09*e),n.stroke(),n.lineWidth=Math.max(.8,t*.005);for(let S=0;S<7;S++){const y=S/7,x=s-.09*e+y*.39*e,A=s-.09*e+(S+1)/7*.39*e,C=.955+y*(.9-.955),P=.985+y*(1.02-.985),L=.955+(S+1)/7*(.9-.955),E=.985+(S+1)/7*(1.02-.985);n.beginPath(),n.moveTo(C*t,x),n.lineTo(E*t,A),n.moveTo(P*t,x),n.lineTo(L*t,A),n.stroke()}const p=n.createLinearGradient(0,s,0,e);p.addColorStop(0,_e.gramaAlta),p.addColorStop(1,_e.gramaBaixa),n.fillStyle=p,n.fillRect(0,s,t,e-s),n.fillStyle="#c6b184",n.beginPath(),n.moveTo(0,s),n.lineTo(t,s),n.lineTo(t,s+.028*e);for(let S=1;S>=0;S-=.05)n.lineTo(S*t,s+(.026+.008*Math.sin(S*21))*e);n.closePath(),n.fill();const g=n.createRadialGradient(.44*t,.92*e,0,.44*t,.92*e,.62*t);g.addColorStop(0,"rgba(78, 100, 50, 0.34)"),g.addColorStop(.6,"rgba(78, 100, 50, 0.16)"),g.addColorStop(1,"rgba(78, 100, 50, 0)"),n.fillStyle=g,n.fillRect(0,s,t,e-s),n.fillStyle=_e.sombra,n.globalAlpha=.16;for(const[S,y,x,A,C]of[[.2,.87,.16,.045,.2],[.66,.9,.2,.05,-.15],[.38,.99,.3,.06,.05],[.86,.83,.13,.035,.3]])n.beginPath(),n.ellipse(S*t,y*e,x*t,A*e,C,0,Math.PI*2),n.fill();n.globalAlpha=1;const M=Math.sin(i*2.1),m=.185*e;Qs(n,.4*t,.86*e,m,bn.ariRoupa,bn.ariCabelo,M,bn.ariPele),Qs(n,.49*t,.86*e,m,bn.renanRoupa,bn.renanCabelo,-M,bn.renanPele),Ja(n,-.04*t,.1*e,1.04*t,.045*e,.028*e,.05*e,15,0,i),Ja(n,-.04*t,.235*e,1.04*t,.145*e,.03*e,.045*e,16,3,i),Ja(n,-.04*t,.33*e,1.04*t,.3*e,.026*e,.038*e,18,6,i),n.fillStyle="rgba(255, 236, 180, 0.09)",n.fillRect(0,0,t,e);const f=n.createRadialGradient(t/2,e*.5,t*.3,t/2,e*.5,t*.85);f.addColorStop(0,"rgba(0, 0, 0, 0)"),f.addColorStop(1,"rgba(20, 30, 40, 0.3)"),n.fillStyle=f,n.fillRect(0,0,t,e)}const nc=[{id:"o-pedido",titulo:"O pedido",lugar:"onde a gente começou, oficialmente",legenda:"As luzinhas iam até onde a gente não enxergava mais. A gente foi junto.",proporcao:3/4,pintar:o_},{id:"arraia",titulo:"O arraiá da Hello Kitty",lugar:"Parque Villa-Lobos, em junho",legenda:"Um campo inteiro de brinquedo inflável, e a gente parado olhando com cara de criança.",proporcao:3/4,pintar:s_}],ie={pratoSombra:"#e6dac4",sombra:"rgba(74, 52, 30, 0.16)",contorno:"#7a4a26",milho:"#e9c179",milhoTostado:"#cf9a48",milhoQueimado:"#a97530",queijo:"#fbe6a6",queijoBorda:"#e9c862",pao:"#e2a961",paoEscuro:"#c88b46",gergelim:"#f8ebcf",carne:"#7c4423",carneEscura:"#5e3018",alface:"#77c05a",tomate:"#e05a4c",batata:"#f2c14e",batataEscura:"#d9a02f",salsicha:"#d5654b",salsichaEscura:"#b04a34",ketchup:"#d63b34",mostarda:"#f0b429",maionese:"#fdf6e4",vidro:"rgba(255, 255, 255, 0.38)",vidroBorda:"#dfe9ee",morango:"#f2678c",morangoClaro:"#ff9ab4",manga:"#f6a83c",mangaClara:"#ffc76a",canudo:"#ff6f91",canudoManga:"#54b7c9",folha:"#4ea648"};function Yo(n,t){const e=n.createRadialGradient(t*.42,t*.36,t*.05,t*.5,t*.5,t*.62);e.addColorStop(0,"#fffaf0"),e.addColorStop(1,ie.pratoSombra),n.fillStyle=e,n.fillRect(0,0,t,t),n.strokeStyle="rgba(122, 90, 48, 0.16)",n.lineWidth=t*.03,n.beginPath(),n.ellipse(t*.5,t*.5,t*.44,t*.44,0,0,Math.PI*2),n.stroke()}function Zo(n,t,e,i){n.fillStyle=ie.sombra,n.beginPath(),n.ellipse(t,e,i,i*.34,0,0,Math.PI*2),n.fill()}function In(n,t,e,i,o,s){n.beginPath(),n.roundRect(t,e,i,o,s),n.fill()}function Ka(n,t,e,i,o,s,a,r,c){n.strokeStyle=t,n.lineWidth=e,n.lineCap="round",n.lineJoin="round",n.beginPath();const l=r*2;for(let h=0;h<=l;h++){const d=h/l,u=i+(s-i)*d,p=o+(a-o)*d+(h%2?c:-c);h===0?n.moveTo(u,p):n.lineTo(u,p)}n.stroke()}function Ed(n,t,e,i,o){const s=t*.3,a=t*.4,r=t*.24,c=t*.84;n.strokeStyle=o,n.lineWidth=t*.055,n.lineCap="round",n.beginPath(),n.moveTo(s+a*.62,c-t*.06),n.lineTo(s+a*.86,r-t*.12),n.stroke();const l=n.createLinearGradient(0,r,0,c);l.addColorStop(0,i),l.addColorStop(1,e),n.fillStyle=l,In(n,s+t*.02,r+t*.06,a-t*.04,c-r-t*.08,t*.06),n.fillStyle=ie.vidro,In(n,s,r,a,c-r,t*.07),n.strokeStyle=ie.vidroBorda,n.lineWidth=t*.028,n.beginPath(),n.roundRect(s,r,a,c-r,t*.07),n.stroke(),n.fillStyle="rgba(255,255,255,0.6)",In(n,s+t*.05,r+t*.1,t*.05,c-r-t*.26,t*.03)}function Td(n,t){Yo(n,t),Zo(n,t*.5,t*.72,t*.3),n.fillStyle=ie.milhoTostado,n.beginPath(),n.ellipse(t*.5,t*.53,t*.31,t*.29,0,0,Math.PI*2),n.fill(),n.fillStyle=ie.milho,n.beginPath(),n.ellipse(t*.5,t*.5,t*.3,t*.28,0,0,Math.PI*2),n.fill(),n.strokeStyle=ie.contorno,n.globalAlpha=.35,n.lineWidth=t*.022,n.beginPath(),n.ellipse(t*.5,t*.5,t*.3,t*.28,0,0,Math.PI*2),n.stroke(),n.globalAlpha=1,n.fillStyle=ie.milhoQueimado,n.globalAlpha=.35;for(const[e,i,o]of[[-.12,-.1,.06],[.14,-.04,.05],[-.02,.13,.055]])n.beginPath(),n.ellipse(t*(.5+e),t*(.5+i),t*o,t*o*.7,.4,0,Math.PI*2),n.fill();n.globalAlpha=1,n.strokeStyle=ie.milhoQueimado,n.lineWidth=t*.03,n.beginPath(),n.ellipse(t*.5,t*.5,t*.3,t*.28,0,.15,Math.PI-.15),n.stroke(),n.fillStyle=ie.queijoBorda,n.beginPath(),n.ellipse(t*.5,t*.68,t*.24,t*.09,0,Math.PI,Math.PI*2),n.fill(),n.fillStyle=ie.queijo,n.beginPath(),n.ellipse(t*.5,t*.67,t*.22,t*.075,0,Math.PI,Math.PI*2),n.fill(),n.fillStyle=ie.queijo,n.beginPath(),n.ellipse(t*.6,t*.73,t*.035,t*.055,0,0,Math.PI*2),n.fill()}function a_(n,t){Td(n,t),n.strokeStyle=ie.carne,n.lineWidth=t*.035,n.lineCap="round";for(const[e,i]of[[-.12,0],[-.02,.03],[.08,0]])n.beginPath(),n.moveTo(t*(.5+e),t*(.64+i)),n.lineTo(t*(.5+e+.09),t*(.68+i)),n.stroke();n.fillStyle=ie.folha,n.beginPath(),n.ellipse(t*.36,t*.62,t*.07,t*.04,-.5,0,Math.PI*2),n.fill()}function Ad(n,t,e=2){Yo(n,t),Zo(n,t*.44,t*.78,t*.28);for(const[l,[h,d,u]]of[[.72,.5,-.35],[.79,.55,-.1],[.68,.6,.25]].entries())n.save(),n.translate(t*h,t*d),n.rotate(u),n.fillStyle=l===1?ie.batataEscura:ie.batata,In(n,-t*.035,-t*.16,t*.07,t*.32,t*.03),n.restore();const i=t*.44,o=t*.5,s=i-o/2;let a=t*.76;const r=(l,h,d=0)=>{a-=l,n.fillStyle=h,In(n,s-d,a,o+d*2,l,l*.45)};n.fillStyle=ie.paoEscuro,In(n,s,a-t*.09,o,t*.09,t*.03),a-=t*.09;for(let l=0;l<e;l++)r(t*.085,l%2?ie.carneEscura:ie.carne,t*.015),a-=t*.045,n.fillStyle=ie.queijo,n.beginPath(),n.moveTo(s-t*.035,a),n.lineTo(s+o+t*.035,a),n.lineTo(s+o+t*.03,a+t*.05),n.lineTo(s+o*.7,a+t*.03),n.lineTo(s+o*.42,a+t*.075),n.lineTo(s+o*.16,a+t*.03),n.lineTo(s-t*.03,a+t*.055),n.closePath(),n.fill();a-=t*.05,n.fillStyle=ie.alface,n.beginPath(),n.moveTo(s-t*.05,a+t*.05);for(let l=0;l<=8;l++){const h=l/8;n.lineTo(s-t*.05+(o+t*.1)*h,a+(l%2?t*.012:t*.05))}n.lineTo(s+o+t*.05,a+t*.05),n.closePath(),n.fill();const c=a-t*.005;n.fillStyle=ie.pao,n.beginPath(),n.ellipse(i,c,o/2,t*.15,0,Math.PI,Math.PI*2),n.fill(),n.fillStyle=ie.gergelim;for(const[l,h]of[[-.13,-.06],[-.02,-.09],[.1,-.055],[.05,-.02]])n.beginPath(),n.ellipse(i+t*l,c+t*h,t*.022,t*.013,.5,0,Math.PI*2),n.fill()}function r_(n,t){Ad(n,t,1),n.fillStyle=ie.tomate,n.beginPath(),n.ellipse(t*.24,t*.44,t*.06,t*.03,-.2,0,Math.PI*2),n.fill()}function c_(n,t){Yo(n,t),Zo(n,t*.5,t*.74,t*.32),n.save(),n.translate(t*.5,t*.55),n.rotate(-.22),n.fillStyle=ie.paoEscuro,In(n,-t*.36,-t*.09,t*.72,t*.22,t*.11),n.fillStyle=ie.pao,In(n,-t*.36,-t*.11,t*.72,t*.18,t*.09),n.fillStyle=ie.salsichaEscura,In(n,-t*.4,-t*.115,t*.8,t*.11,t*.055),n.fillStyle=ie.salsicha,In(n,-t*.4,-t*.125,t*.8,t*.095,t*.05),Ka(n,ie.mostarda,t*.032,-t*.32,-t*.06,t*.32,-t*.06,4,t*.022),Ka(n,ie.ketchup,t*.032,-t*.3,-t*.02,t*.3,-t*.02,4,t*.022),Ka(n,ie.maionese,t*.028,-t*.28,-t*.1,t*.28,-t*.1,4,t*.018),n.strokeStyle=ie.batata,n.lineWidth=t*.018,n.lineCap="round";for(const[e,i,o]of[[-.24,-.13,.5],[-.1,-.15,-.4],[.04,-.13,.6],[.18,-.15,-.3],[-.17,-.16,-.6],[.26,-.12,.35]])n.beginPath(),n.moveTo(t*e,t*i),n.lineTo(t*(e+Math.cos(o)*.09),t*(i+Math.sin(o)*.09)),n.stroke();n.restore()}function l_(n,t){Yo(n,t),Zo(n,t*.5,t*.85,t*.26),Ed(n,t,ie.morango,ie.morangoClaro,ie.canudo),n.fillStyle="#e34b6d",n.beginPath(),n.moveTo(t*.26,t*.24),n.bezierCurveTo(t*.16,t*.24,t*.16,t*.36,t*.26,t*.4),n.bezierCurveTo(t*.36,t*.36,t*.36,t*.24,t*.26,t*.24),n.fill(),n.fillStyle=ie.folha,n.beginPath(),n.ellipse(t*.26,t*.24,t*.06,t*.025,0,0,Math.PI*2),n.fill(),n.fillStyle="rgba(255,255,255,0.75)";for(const[e,i]of[[.62,.42],[.66,.56],[.6,.68]])n.beginPath(),n.ellipse(t*e,t*i,t*.017,t*.028,0,0,Math.PI*2),n.fill()}function h_(n,t){Yo(n,t),Zo(n,t*.5,t*.85,t*.26),Ed(n,t,ie.manga,ie.mangaClara,ie.canudoManga),n.fillStyle="#f6e7b8",n.beginPath(),n.ellipse(t*.28,t*.3,t*.075,t*.075,0,0,Math.PI*2),n.fill(),n.strokeStyle="#e0cd92",n.lineWidth=t*.018,n.beginPath(),n.ellipse(t*.28,t*.3,t*.075,t*.075,0,0,Math.PI*2),n.stroke(),n.fillStyle="#d9c489";for(let e=0;e<3;e++){const i=e/3*Math.PI*2+.6;n.beginPath(),n.ellipse(t*(.28+Math.cos(i)*.026),t*(.3+Math.sin(i)*.026),t*.012,t*.012,0,0,Math.PI*2),n.fill()}n.fillStyle=ie.manga,n.beginPath(),n.ellipse(t*.74,t*.32,t*.055,t*.09,.5,0,Math.PI*2),n.fill()}const d_=[{titulo:"Arepas",nota:"na chapa, servidas quentes — a casa vive delas",pratos:[{id:"arepa-queijo",nome:"Arepa de queijo",preco:"R$ 18",descricao:"Massa de milho na chapa até criar casquinha, aberta ainda quente e recheada de queijo branco que escorre antes de você conseguir morder.",selo:"o favorito do Ari",pintar:Td},{id:"arepa-recheada",nome:"Arepa recheada",preco:"R$ 26",descricao:"A mesma arepa, agora com carne desfiada macia, queijo e abacate em fatias finas por cima.",pintar:a_}]},{titulo:"Hambúrgueres",nota:"todos com batata frita dourada, sem exceção",pratos:[{id:"duplo-queijo",nome:"Duplo Burger com Queijo",preco:"R$ 34",descricao:"Dois discos de carne selados na chapa, duas fatias de queijo derretendo entre eles, alface crocante e pão de gergelim. Com batata frita.",pintar:(n,t)=>Ad(n,t,2)},{id:"quarteirao",nome:"Quarteirão com Queijo",preco:"R$ 30",descricao:"Um disco só, mas do tamanho do pão inteiro, com queijo, tomate e aquele pão macio que amassa na mão. Com batata frita.",pintar:r_}]},{titulo:"Perros Calientes",nota:"do jeito tradicional, transbordando",pratos:[{id:"perro-tradicional",nome:"Perro Caliente Tradicional",preco:"R$ 24",descricao:"Salsicha grelhada sobrando dos dois lados do pão, os três molhos em zigue-zague e uma montanha de batata palha por cima.",pintar:c_}]},{titulo:"Bebidas",nota:"geladas, saindo do liquidificador",pratos:[{id:"suco-morango",nome:"Suco de morango",preco:"R$ 12",descricao:"Morango batido na hora, bem gelado, com o copo suando do lado de fora.",pintar:l_},{id:"smoothie-manga-banana",nome:"Smoothie de manga com banana",preco:"R$ 15",descricao:"Manga madura e banana batidas juntas até ficar grosso o bastante para o canudo reclamar.",pintar:h_}]}];class u_{constructor(t,e,i,o=Object.keys(e)[0]){this.root=t,this.scenes=e,this.dupla=i,this.cenaInicial=o,this.renderer=new id({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=mh,t.appendChild(this.renderer.domElement),this.ui=new w1(t),this.previa=new J1(this.ui.canvasDoBoneco()),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onTouchGirar=a=>this.input.tapGirar(a),this.ui.onEscolherSlot=a=>this.setActiveHandSlot(a),this.ui.onMoverItem=(a,r)=>this.moveItem(a,r),this.ui.onDescartar=a=>this.descartarDaVaga(a),this.ui.onAbrirMochila=()=>this.pintarMochila(),this.ui.onAbrirArmario=()=>this.pintarArmario(),this.ui.onGirarBoneco=a=>this.previa.girar(a),this.ui.onTirarParte=a=>{this.tirarPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onVestirPeca=a=>{this.vestirPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onAbrirVestiario=()=>this.pintarVestiario(),this.ui.onAlternarOculos=()=>{const a=this.playerId(),r=pn.indexOf("cabeca");(this.save.vestiveis(a)[r]?.id===Qt.oculosEscuros.id?this.tirarPeca(a,r):this.vestirPeca(a,Qt.oculosEscuros.id))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onEscolherBermuda=a=>{const r=this.playerId(),c=pn.indexOf("pernas");(this.save.vestiveis(r)[c]?.id===a?this.tirarPeca(r,c):this.vestirPeca(r,a))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onTouchHold=a=>this.input.setVirtualDown("KeyF",a),this.ui.onRestart=()=>this.restart(),this.ui.som=a=>this.audio.play(a),this.ui.onToggleSom=()=>{this.audio.setMudo(this.audio.ligado),this.ui.setSom(this.audio.ligado),this.audio.ligado&&this.audio.play("menu")},this.ui.setSom(this.audio.ligado),this.input=new Uv(this.renderer.domElement),this.hemi=new Jh(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new Wr(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const s=this.sun.shadow.camera;s.left=-22,s.right=22,s.top=22,s.bottom=-22,s.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new E1(new ec(i[0])),this.scene.add(this.player.object),this.coracoes=new C1(this.scene),this.beijo=new L1(this.coracoes),this.beijo.onSom=a=>this.audio.play(a),this.maos=new B1(this.coracoes),this.maos.onSom=a=>this.audio.play(a),this.parceiro=new T1(new ec(i[1]??i[0])),this.parceiro.setVisible(i.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new Fh;iso=new Dv;input;ui;save=new Pc;previa;player;parceiro;clock=new $f;coracoes;beijo;maos;audio=new j1;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;naMao=new Map;trilha=0;elapsed=0;shadowSpan=0;traje="normal";moveDir=new z;camAim=new z;camOmbro=null;async start(t,e){const i=t??(this.scenes[this.save.scene]?this.save.scene:this.cenaInicial);this.build(i,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}restart(){this.save.reset(),this.ui.setMemories(this.save.memories),this.player.rig.spec.id!==this.dupla[0].id&&this.swapCharacters(),this.ui.showHints(),this.goTo(this.cenaInicial),this.audio.play("recomecar"),this.ui.toast("Do começo, então","🔄")}build(t,e){const i=this.scenes[t];if(!i)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const o=new Q1(this);o.setSeed(f_(t)),i.build(o),this.scene.add(o.root),this.current={def:i,world:o},this.applyAmbient(i.ambient);const s=e&&i.entries?.[e]||i.spawn;this.player.teleport(s.x,s.z,s.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const a=(s.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(s.x+Math.sin(a)*1.3,s.z+Math.cos(a)*1.3,s.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.maos.soltar(this.player,this.parceiro),this.coracoes.limpar(),this.podeBeijar=!1,this.camOmbro=null,this.ui.showPlacar(null),this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(i.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(i.name,i.subtitle),this.audio.setClima(t),this.migrarPremios(),this.aplicarPremios(),this.save.scene=t}aplicarPremios(){this.sincronizarVestiveis()}migrarPremios(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id;this.save.flag(`chapeu-ping-pong:${e}`)&&(this.save.achouItem(e,Qt.chapeuPingPong.id)||this.save.vestir(e,Qt.chapeuPingPong))}}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new ce(t.sky),this.scene.fog=t.fog!==void 0?new Mc(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const i=this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen||this.ui.memoriasOpen||this.ui.cardapioOpen||this.transitioning;this.input.blocked=i||this.player.locked,this.input.justPressed("KeyJ")&&!this.ui.menuOpen&&this.ui.toggleJournal(),(this.input.justPressed("KeyI")||this.input.justPressed("Tab"))&&!this.ui.menuOpen&&!this.ui.dialogueOpen&&(this.ui.armarioOpen?this.ui.fecharArmario():this.ui.mochilaOpen?this.ui.closeMochila():this.abrirMochila()),this.ui.armarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharArmario(),this.ui.vestiarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharVestiario(),this.ui.memoriasOpen&&this.input.justPressed("Escape")&&this.ui.fecharMemorias(),this.ui.cardapioOpen&&this.input.justPressed("Escape")&&this.ui.fecharCardapio(),this.ui.memoriasOpen&&(this.input.justPressed("ArrowLeft")&&this.ui.folhear(-1),this.input.justPressed("ArrowRight")&&this.ui.folhear(1)),(this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen?!this.ui.dialogueOpen&&!this.ui.menuOpen&&!this.transitioning:!i)&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),i||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1)),!i&&!this.player.locked&&this.input.justPressed("KeyH")&&this.maoNaMao();const a=this.input.justPressed("KeyE")||this.input.justPressed("Space");a&&this.ui.handleAction()||(a&&!i&&this.hot&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.audio.play("interagir"),this.hot.trigger(this)):a&&!i&&this.podeBeijar&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)):a&&!i&&!this.player.locked&&this.maoNaMao()),this.beijo.update(t,this.player,this.parceiro),this.maos.update(t,this.player,this.parceiro);const r=this.input.move();this.iso.screenToWorld(r.x,r.y,this.moveDir);const c=this.player.position.clone();this.player.update(this.moveDir,t,e.colliders,e.bounds),this.ouvirPassos(c),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.coracoes.update(t),this.sincronizarMaos(),this.sincronizarVestiveis(),this.updateHot(e,t),this.updateBeijo();for(const d of e.updaters)d(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const l=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(l);const h=l/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*h,this.camAim.y+20*h,this.camAim.z+9*h),this.renderer.render(this.scene,this.camOmbro??this.iso.camera),this.ui.armarioOpen&&(this.previa.update(t),this.previa.desenhar()),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.ui.menuOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro)}maoNaMao(){this.maos.ativo?(this.maos.soltar(this.player,this.parceiro),this.audio.play("escolha")):this.maos.disponivel(this.player,this.parceiro)&&this.maos.ligar(this.player,this.parceiro)}ouvirPassos(t){if(this.player.riding||this.player.locked)return;const e=Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z);if(e<5e-4){this.trilha=0;return}this.trilha+=e;const i=this.player.submersion>.05?1.05:.62;this.trilha>=i&&(this.trilha=0,this.audio.play(this.player.submersion>.05?"nadar":"passo"))}updateHot(t,e){let i=null,o=1/0,s=-1/0;const a=this.player.position.x,r=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(a,r);l>c.radius||c.priority<s||c.priority===s&&l>=o||(i=c,o=l,s=c.priority)}i!==this.hot&&(this.hot?.setHot(!1),i?.setHot(!0),this.hot=i,i&&!this.player.locked?this.ui.showPrompt(i.icon,i.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,i){return this.ui.ask(t,e,i??this.player.name)}toast(t,e){this.audio.play("toast"),this.ui.toast(t,e)}som(t){this.audio.play(t)}goTo(t,e){this.transitioning||(this.transitioning=!0,this.audio.play("porta"),(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setCameraOmbro(t,e){if(!t){this.camOmbro=null;return}this.camOmbro||(this.camOmbro=new sn(58,window.innerWidth/window.innerHeight,.1,400)),this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.position.copy(t),e&&this.camOmbro.lookAt(e),this.camOmbro.updateProjectionMatrix()}pointer(){return this.input.pointer()}showPlacar(t){this.ui.showPlacar(t)}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}addItem(t,e=this.playerId()){const i=this.save.pegar(e,t);return i==="cheio"&&this.ui.toast("Mochila cheia","🎒"),(i==="mao"||i==="guardado")&&this.repintarMochila(),i}storeItem(t,e=this.playerId()){const i=this.save.guardar(e,t);return i!=="cheio"&&i!=="repetido"&&this.repintarMochila(),i}removeItem(t,e=this.playerId()){const i=this.save.largar(e,t);return i&&this.repintarMochila(),i}hasItem(t,e=this.playerId()){return this.save.achouItem(e,t)}getActiveHandItem(t=this.playerId()){return this.save.itemAtivo(t)}setActiveHandSlot(t,e=this.playerId()){this.save.setSlotAtivo(e,t),this.repintarMochila()}activeHandSlot(t=this.playerId()){return this.save.slotAtivo(t)}equipWearable(t,e=this.playerId()){const i=this.save.vestir(e,t);return i&&this.repintarMochila(),i}unequipWearable(t,e=this.playerId()){this.save.despir(e,t),this.repintarMochila()}moveItem(t,e,i=this.playerId()){const o=this.save.mover(i,t,e);return o&&this.repintarMochila(),o}handItems(t=this.playerId()){return this.save.maos(t)}wearables(t=this.playerId()){return this.save.vestiveis(t)}wardrobeItems(t=this.playerId()){return this.save.acervo(t)}descartarDaVaga(t){const e=this.playerId(),o=(t.lista==="mao"?this.save.maos(e):this.save.vestiveis(e))[t.indice];o&&(this.save.largar(e,o.id),this.audio.play("escolha"),this.ui.toast(`${o.nome} foi descartado`,"🗑"),this.pintarMochila())}repintarMochila(){this.ui.mochilaOpen&&this.pintarMochila()}pintarMochila(){const t=this.playerId();this.ui.renderMochila(this.save.maos(t),this.save.vestiveis(t),this.save.slotAtivo(t),this.player.name)}abrirMochila(){this.ui.toggleMochila()}sincronizarVestiveis(){for(const t of[this.player,this.parceiro]){const e=t.rig.spec.id,i=this.save.vestiveis(e),o=i.some(c=>c?.id===Qt.chapeuPingPong.id);t.rig.campeao!==o&&t.rig.setCampeao(o);const s=i.some(c=>c?.id===Qt.patins.id);t.patins=s,t.rig.setPatins(s);const a=this.save.loadout(e),r=pn.map(c=>a[c]??"").join("|");this.roupaAplicada.get(e)!==r&&(this.roupaAplicada.set(e,r),t.rig.vestirRoupa(a))}}sincronizarMaos(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id,i=this.save.itemAtivo(e),o=i?.id??null;this.naMao.get(e)!==o&&(this.naMao.set(e,o),t.segurar(o?y1(o):null,i?.holdPose??"none"))}}roupaAplicada=new Map;vestirPeca(t,e){const i=this.save.acervo(t).find(a=>a.id===e)??this.save.maos(t).find(a=>a?.id===e)??null;if(!i)return!1;const o=i.slot?pn.indexOf(i.slot):-1;if(o<0)return!1;const s=this.save.vestiveis(t)[o];return this.save.largar(t,e),s&&this.save.despir(t,o),this.save.vestir(t,i),s&&this.save.guardar(t,s),!0}tirarPeca(t,e){const i=this.save.vestiveis(t)[e];return i?(this.save.despir(t,e),this.save.guardar(t,i)==="cheio"?(this.save.vestir(t,i),this.ui.toast("Mochila cheia","🎒"),!1):!0):!1}abrirGuardaRoupa(){this.previa.mostrar(this.player.rig.spec),this.pintarArmario(),this.ui.abrirArmario()}pintarArmario(){const t=this.playerId(),e=this.save.vestiveis(t),i=[...this.save.acervo(t),...this.save.maos(t).filter(o=>o!==null&&o.tipo==="vestivel")];this.ui.renderArmario(e,i,this.player.name),this.previa.vestir(this.save.loadout(t))}abrirVestiario(){this.pintarVestiario(),this.ui.abrirVestiario()}pintarVestiario(){const t=this.playerId(),e=this.save.vestiveis(t),i=e[pn.indexOf("cabeca")],o=e[pn.indexOf("pernas")],s=a=>`#${a.toString(16).padStart(6,"0")}`;this.ui.renderVestiario({dono:this.player.name,oculos:i?.id===Qt.oculosEscuros.id,bermudas:Md.filter(a=>this.save.achouItem(t,a.id)).map(a=>({id:a.id,nome:a.nome,cor:s(a.corBanho??16777215),faixa:a.estampaBanho===void 0?void 0:s(a.estampaBanho),vestida:o?.id===a.id}))})}abrirMemoria(t){const e=nc.findIndex(i=>i.id===t);e>=0&&this.ui.abrirMemorias(nc,e)}abrirCardapio(){return this.ui.abrirCardapio(d_)}unlock(t){this.save.addMemory(t)&&(this.audio.play("memoria"),this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,i=Math.PI/4){this.player.teleport(t,e,i),this.parceiro.teleport(t-1.2,e-.4,i),this.iso.snapTo(this.player.chest)}get telaDeLeitura(){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.memoriasOpen}keyPressed(t){return this.telaDeLeitura||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.telaDeLeitura||this.player.locked?!1:this.input.isDown(t)}showCharge(t,e,i){this.audio.carga(t),this.ui.showCharge(t,e,i)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.riding?(this.player.object.updateWorldMatrix(!0,!1),this.player.object.getWorldPosition(new z)):this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}playerId(){return this.player.rig.spec.id}companionId(){return this.parceiro.rig.spec.id}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.riding?(this.parceiro.object.updateWorldMatrix(!0,!1),this.parceiro.object.getWorldPosition(new z)):this.parceiro.position.clone()}companionFacing(){return this.parceiro.rig.facing}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.maos.trocouCorpos(this.player,this.parceiro),this.audio.play("trocar"),this.ui.toast(`Agora você é ${this.player.name}`,"🔁"),this.ui.mochilaOpen&&this.pintarMochila(),this.ui.armarioOpen&&(this.previa.mostrar(this.player.rig.spec),this.pintarArmario()),this.ui.vestiarioOpen&&this.pintarVestiario()}submergePlayer(t){this.player.submersion=Ne.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=Ne.clamp(t,0,1)}rideCompanion(t,e,i=1,o=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(i),this.parceiro.rig.group.rotation.y=o,this.parceiro.rig.setFacing(o),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}holdCompanion(t,e){this.parceiro.hold(t,e)}setSitting(t){if(t&&this.audio.play("sentar"),this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t),!t){this.maos.ativo||(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0));return}const e=this.player.rig.group,i=this.parceiro.rig.group;e.updateWorldMatrix(!0,!1),i.updateWorldMatrix(!0,!1);const o=new z,s=new z;e.getWorldPosition(o),i.getWorldPosition(s);const r=new z(1,0,0).applyQuaternion(e.getWorldQuaternion(new co)).dot(s.sub(o))<0?-1:1;this.player.rig.setHoldingHands(r),this.parceiro.rig.setHoldingHands(r===1?-1:1)}setLying(t){t&&this.audio.play("sentar"),this.player.rig.setLying(t),this.parceiro.rig.setLying(t),!t&&!this.maos.ativo&&(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0))}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,i=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,i)}ridePlayer(t,e,i=1,o=Math.PI){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(i),this.player.rig.group.rotation.y=o,this.player.rig.setFacing(o),this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,i=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,i),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight),this.camOmbro&&(this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.updateProjectionMatrix())};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function f_(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function ic(n=3,t=2.2,e=_.rug){const i=new v(new k(n,.04,t),w(e));return i.position.y=.02,i.receiveShadow=!0,i}function p_(n=_.sofa,t=2.2){const e=new at,i=new v(new k(t,.42,.9),w(n));i.position.y=.28,e.add(i);const o=new v(new k(t,.62,.24),w(n));o.position.set(0,.72,-.35),e.add(o);for(const a of[-1,1]){const r=new v(new k(.24,.5,.9),w(n));r.position.set(a*(t/2-.12),.62,0),e.add(r)}for(const[a,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new v(new et(.05,.04,.14,6),w(_.woodDark));c.position.set(a*(t/2-.2),.07,r*.34),e.add(c)}const s=new v(new k(.36,.12,.34),w(_.flowerPink));return s.position.set(t/2-.5,.55,-.14),s.rotation.set(.9,.4,0),e.add(s),e}function m_(){const n=new at,t=new v(new k(1.2,.08,.7),w(_.wood));t.position.y=.46,n.add(t);for(const[e,i]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const o=new v(new et(.04,.04,.46,6),w(_.woodDark));o.position.set(e*.5,.23,i*.27),n.add(o)}return n}function g_(n=!1){const t=new at,e=new v(new k(1.8,.5,.45),w(_.woodDark));e.position.y=.25,t.add(e);const i=new v(new k(1.5,.85,.08),w(2040361));i.position.y=.95,t.add(i);const o=new v(new ze(1.36,.72),je(n?9426943:_.screen,1));return o.name="tela",o.position.set(0,.95,.05),t.add(o),t}function v_(n=2.1,t=1.2,e=_.woodDark){const i=new at;i.userData.peca="estante";const o=.32,s=.04,a=new v(new k(t-s,n-.02,s),w(_.estanteFundo));a.position.set(0,n/2,-o/2-.005),i.add(a);for(const h of[-1,1]){const d=new v(new k(s,n,o),w(e));d.position.set(h*(t-s)/2,n/2,0),i.add(d)}const r=Math.max(2,Math.floor(n/.5)),c=n/r;for(let h=0;h<=r;h++){const d=new v(new k(t-s*2,s,o),w(e)),u=h===0?s/2:h===r?n-s/2:c*h;d.position.set(0,u,0),i.add(d)}const l=[_.metalRed,_.fabricBlue,_.gold,_.bush,_.flowerPink];for(let h=0;h<r;h++){const d=c*h+s/2,p=c*(h+1)-s/2-d;let g=-t/2+s+.03,M=0;const m=t/2-s-.03;for(;M<7;){const f=.05+(h*3+M*5)%4*.018,S=Math.min(p*.92,.26+(h+M*2)%4*.035);if(g+f>m)break;const y=M>=3&&g+f+S*.5>m,x=new v(new k(f,S,.17),w(l[(h*2+M)%l.length]));x.position.set(0,S/2,.02),x.userData.livro=!0;const A=new at;A.position.set(g+f/2,d,0),y&&(A.rotation.z=-.42),A.add(x),i.add(A),g+=y?f+S*.42:f+.012,M++}}return i}function __(n=_.fabricBlue){const t=new at,e=new v(new k(1.5,.35,2.1),w(_.woodDark));e.position.y=.2,t.add(e);const i=new v(new k(1.44,.24,2),w(16184040));i.position.y=.49,t.add(i);const o=new v(new k(1.5,.14,1.35),w(n));o.position.set(0,.62,.3),t.add(o);const s=new v(new k(1,.16,.4),w(16777215));s.position.set(0,.66,-.72),t.add(s);const a=new v(new k(1.55,.7,.12),w(_.wood));return a.position.set(0,.6,-1.06),t.add(a),t}function M_(){const n=new at,t=new v(new k(1.6,.08,.7),w(_.wood));t.position.y=.74,n.add(t);for(const s of[-.72,.72]){const a=new v(new k(.08,.74,.66),w(_.woodDark));a.position.set(s,.37,0),n.add(a)}const e=new v(new k(.8,.5,.06),w(2830136));e.position.set(0,1.08,-.18),n.add(e);const i=new v(new ze(.72,.42),je(10475775));i.position.set(0,1.08,-.14),n.add(i);const o=new v(new et(.05,.12,.24,8),w(2830136));return o.position.set(0,.86,-.18),n.add(o),n}function oc(n=_.wood){const t=new at,e=new v(new k(.5,.08,.5),w(n));e.position.y=.46,t.add(e);const i=new v(new k(.5,.55,.07),w(n));i.position.set(0,.75,-.22),t.add(i);for(const[o,s]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new v(new k(.06,.46,.06),w(_.woodDark));a.position.set(o*.2,.23,s*.2),t.add(a)}return t}function x_(n=2.4){const t=new at,e=new v(new k(n,.9,.65),w(_.wallMint));e.position.y=.45,t.add(e);const i=new v(new k(n+.08,.08,.72),w(_.concrete));i.position.y=.94,t.add(i);const o=new v(new k(.5,.06,.4),w(_.metalWhite));return o.position.set(n/2-.55,.97,0),t.add(o),t}function y_(){const n=new at,t=new v(new k(.8,1.8,.7),w(_.metalWhite));t.position.y=.9,n.add(t);const e=new v(new k(.82,.03,.72),w(_.metalGrey));e.position.y=1.25,n.add(e);for(const i of[.7,1.45]){const o=new v(new k(.05,.3,.05),w(_.metalGrey));o.position.set(.3,i,.37),n.add(o)}return n}function sc(n=1){const t=new at,e=new v(new et(.22*n,.17*n,.34*n,10),w(_.plantPot));e.position.y=.17*n,t.add(e);for(let i=0;i<5;i++){const o=i/5*Math.PI*2,s=new v(new Rt(.2*n,8,6),w(i%2?_.leafMid:_.leafLight));s.scale.set(.5,1.5,.5),s.position.set(Math.cos(o)*.12*n,.6*n,Math.sin(o)*.12*n),s.rotation.z=Math.cos(o)*.4,s.rotation.x=-Math.sin(o)*.4,t.add(s)}return t}function ac(n=.7,t=.55,e=_.skyDusk){const i=new at,o=new v(new k(n,t,.05),w(_.woodDark));i.add(o);const s=new v(new ze(n-.1,t-.1),je(e,1,!0));return s.position.z=.03,s.renderOrder=1,i.add(s),i}function b_(n=1.3,t=1){const e=new at,i=new v(new k(n,t,.05),w(_.woodDark));e.add(i);const o=new v(new ze(n-.1,t-.1),je(_.cortica,1,!0));o.position.z=.03,o.renderOrder=1,e.add(o);for(let r=0;r<14;r++){const c=new v(new ze(.018,.018),je(_.corticaEscura,1,!0));c.renderOrder=2,c.position.set((r*37%100/100-.5)*(n-.24),(r*61%100/100-.5)*(t-.24),.035),e.add(c)}const s=[[-.3,.2,.34,.28,.06,_.skyDusk],[.26,.24,.3,.26,-.09,_.water],[-.24,-.22,.3,.26,-.05,_.flowerPink],[.3,-.2,.32,.24,.08,_.leafMid]],a=[_.heart,_.gold,_.frisbee,_.heart];return s.forEach(([r,c,l,h,d,u],p)=>{const g=new at,M=new v(new ze(l,h),je(_.metalWhite,1,!0));M.renderOrder=3,g.add(M);const m=new v(new ze(l-.06,h-.1),je(u,1,!0));m.position.set(0,.02,.002),m.renderOrder=4,g.add(m);const f=new v(new Rt(.018,8,6),w(a[p]));f.position.set(0,h/2-.03,.012),g.add(f),g.position.set(r,c,.04),g.rotation.z=d,e.add(g)}),e}function Cd(n=1.2,t=1.2){const e=new at,i=new v(new ze(n,t),je(_.glass,.55));e.add(i);const o=new v(new k(n+.12,.08,.08),w(_.metalWhite));o.position.y=t/2,e.add(o);const s=o.clone();s.position.y=-t/2,e.add(s);for(const a of[-1,1]){const r=new v(new k(.08,t,.08),w(_.metalWhite));r.position.x=a*n/2,e.add(r)}return e}function S_(n=16777215){const t=new at,e=new v(new et(.07,.06,.13,10),w(n));e.position.y=.065,t.add(e);const i=new v(new ge(.045,.014,6,12),w(n));return i.position.set(.08,.07,0),i.rotation.y=Math.PI/2,t.add(i),t}function w_(n=1.5,t=.9){const e=new at,i=new v(new k(n,.09,t),w(_.wood));i.position.y=.75,e.add(i);for(const[s,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new v(new k(.08,.75,.08),w(_.woodDark));r.position.set(s*(n/2-.14),.37,a*(t/2-.14)),e.add(r)}const o=new v(new et(.07,.09,.16,10),w(_.wallMint));o.position.y=.87,e.add(o);for(const s of[-1,1]){const a=new v(new Rt(.06,8,6),w(s<0?_.flowerPink:_.flowerYellow));a.position.set(s*.05,1.03,0),e.add(a)}return e}function E_(n=!0){const t=new at,e=new v(new et(.2,.24,.06,12),w(_.woodDark));e.position.y=.03,t.add(e);const i=new v(new et(.03,.03,1.5,8),w(_.metalGrey));i.position.y=.78,t.add(i);const o=new v(new et(.22,.3,.34,14,1,!0),w(n?16773324:15130320,{glow:n?.5:0,doubleSide:!0}));return o.position.y=1.68,t.add(o),t}function rc(n=1.1){const t=new at,e=new v(new k(n,.06,.24),w(_.wood));t.add(e);const i=[14245951,6074447,16763213];for(let s=0;s<3;s++){const a=new v(new k(.1,.24,.16),w(i[s]));a.position.set(-n/2+.2+s*.16,.15,0),t.add(a)}const o=new v(new Rt(.13,10,8),w(_.leafMid));return o.position.set(n/2-.22,.16,0),o.scale.y=.8,t.add(o),t}function T_(n=2){const t=new at,e=new v(new k(n,.6,.34),w(_.wallCream));t.add(e);for(const i of[-1,1]){const o=new v(new k(.04,.16,.04),w(_.metalGrey));o.position.set(i*n*.22,-.18,.19),t.add(o)}return t}function A_(){const n=new at,t=new v(new k(.66,.9,.64),w(_.metalWhite));t.position.y=.45,n.add(t);const e=new v(new et(.2,.2,.06,16),w(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,n.add(e);const i=new v(new et(.14,.14,.05,16),w(3884624));i.position.set(0,.5,.36),i.rotation.x=Math.PI/2,n.add(i);const o=new v(new k(.6,.12,.03),w(14673128));o.position.set(0,.82,.33),n.add(o);for(const s of[-.2,0,.2]){const a=new v(new et(.025,.025,.03,8),w(_.metalGrey));a.position.set(s,.82,.36),a.rotation.x=Math.PI/2,n.add(a)}return n}function Ds(n=_.wood,t=.9,e=2.1,i=.24){const o=new at,s=new v(new k(t,e,.08),w(n));s.position.y=e/2,o.add(s);for(const c of[-1,1]){const l=new v(new k(.09,e+.1,i),w(_.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),o.add(l)}const a=new v(new k(t+.2,.1,i),w(_.woodDark));a.position.y=e+.05,o.add(a);const r=new v(new Rt(.055,8,6),w(_.gold,{glow:.15}));return r.position.set(t/2-.14,e*.45,.07),o.add(r),o}function C_(n=_.wood,t=1.6,e=2.1){const i=new at,o=.62,s=new v(new k(t,e,o),w(_.woodDark));s.position.y=e/2,i.add(s);const a=new v(new k(t-.12,e-.16,.04),w(3812127));a.position.set(0,e/2,o/2-.05),i.add(a);const r=t/2-.05;for(const c of[-1,1]){const l=new at;l.position.set(c*r,e/2,o/2),c>0&&(l.rotation.y=-.62),i.add(l);const h=new v(new k(r,e-.1,.06),w(n));h.position.x=-c*r/2,l.add(h);const d=new v(new et(.022,.022,.16,8),w(_.metalGrey));d.position.set(-c*(r-.12),0,.06),l.add(d)}for(const c of[-1,1])for(const l of[-1,1]){const h=new v(new k(.1,.1,.1),w(_.woodDark));h.position.set(c*(t/2-.1),.05,l*(o/2-.1)),i.add(h)}return i}function P_(n=_.wood,t=1.7){const e=new at,i=.62,o=new v(new k(i,t,.07),w(n));o.position.y=t/2,e.add(o);const s=new v(new k(i-.14,t-.16,.03),w(_.glass,{opacity:.72,glow:.12}));return s.position.set(0,t/2,.04),e.add(s),e.rotation.x=-.05,e}function R_(){const n=new at,t=new v(new k(.44,.5,.4),w(_.wood));t.position.y=.25,n.add(t);const e=new v(new k(.36,.14,.03),w(_.woodDark));e.position.set(0,.32,.21),n.add(e);const i=new v(new et(.06,.08,.16,8),w(_.metalGrey));i.position.y=.58,n.add(i);const o=new v(new et(.11,.15,.18,12,1,!0),w(16773324,{glow:.45,doubleSide:!0}));return o.position.y=.75,n.add(o),n}const Ln={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},En={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},I_=[Ln,En],cc={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI},"do-quarto":{x:-5.05,z:-1.2,facing:Math.PI/2}},build(n){const t=n.game,e=async X=>{for(const[ht,ft]of X)await t.say([ft],ht)},i=Ln.name,o=En.name,s=12,a=9,r=-s/2,c=-a/2,l=2.8;n.ground({width:s,depth:a,color:_.floorWood}),n.setBounds(r+.45,c+.45,s/2-.45,a/2-.45),n.wall(r,c,s/2,c,l,_.wallCream);const h=-1.2,d=.95;n.wall(r,c,r,h-d/2,l,_.wallMint),n.wall(r,h+d/2,r,a/2,l,_.wallMint),n.wall(r,a/2,s/2,a/2,.45,_.wallCream),n.wall(s/2,-1.3,s/2,a/2,.45,_.wallCream);const u=.4,p=4.2,g=-1.3,M=(u+p)/2,m=(p+s/2)/2,f=.95,S=[u,M-f/2,M+f/2,m-f/2,m+f/2,s/2];for(let X=0;X<S.length;X+=2)S[X+1]-S[X]>.05&&n.wall(S[X],g,S[X+1],g,l,_.wallCream);n.wall(u,c,u,g,l,_.wallCream),n.wall(p,c,p,g,l,_.wallCream),n.wall(s/2,c,s/2,g,l,_.wallCream);const y=new v(new k(s/2-u,.16,g-c),w(15129028));y.position.set((u+s/2)/2,l+.08,(c+g)/2),n.add(y);const x=n.add(n.place(Ds(_.woodDark,.85,2.05),M,0,g)),A=n.add(n.place(Ds(_.gold,.85,2.05),m,0,g));n.add(n.place(ac(.6,.75,_.wallMint),3.55,1.75,g+.17)),n.add(n.place(rc(.9),1.1,1.7,g+.19)),n.add(n.place(Ds(_.fabricBlue,.9,2.1),r,0,h,Math.PI/2)),n.door({x:r+.85,z:h,to:"quarto",entry:"da-sala",label:"Entrar no quarto do Ari",icon:"🚪"}),n.add(n.place(x_(3.6),-3.4,0,c+.42)),n.blockBox(-3.4,c+.42,1.8,.4),n.add(n.place(T_(2.6),-3.4,2,c+.2)),n.add(n.place(y_(),r+.45,0,-2.6,Math.PI/2)),n.blockBox(r+.45,-2.6,.38,.42);const C=n.add(n.place(w_(1.5,.9),-3.6,0,-1.9,.08));n.blockBox(-3.6,-1.9,.8,.52,.08),n.add(n.place(oc(),-4.7,0,-1.9,Math.PI/2)),n.add(n.place(oc(),-2.5,0,-1.9,-Math.PI/2));const P=n.add(n.place(g_(!1),r+.35,0,.6,Math.PI/2));n.blockBox(r+.35,.6,.3,.9);const L=P.getObjectByName("tela");n.add(n.place(ic(3,2.6),-2.5,0,.6));const E=n.add(n.place(p_(_.fabricRed,2.4),-.3,0,.6,-Math.PI/2));n.blockBox(-.3,.6,.5,1.2),n.add(n.place(m_(),-2.4,0,.6,Math.PI/2)),n.blockBox(-2.4,.6,.38,.62);const b=n.add(n.place(S_(16773856),-2.4,.5,.9));n.add(n.place(E_(!0),-.4,0,2.3)),n.blockCircle(-.4,2.3,.3);const D=n.add(n.place(A_(),s/2-.65,0,2.9,-Math.PI/2));n.blockBox(s/2-.65,2.9,.35,.4),n.add(n.place(Cd(1.8,1.3),r+.16,1.75,2.4,Math.PI/2)),n.add(n.place(ac(.8,.6,_.skyDusk),-3.4,1.95,c+.17)),n.add(n.place(rc(1.1),-1.6,1.8,c+.2)),n.add(n.place(sc(1.1),r+.8,0,a/2-1));const F=n.add(n.place(sc(.75),4.9,0,1.4)),V=n.place(ud(.75),-.3,2.4,.6);V.visible=!1,n.add(V);const q=a/2;n.wall(2,q,2.9,q,2.6,_.wallCream),n.wall(3.9,q,4.9,q,2.6,_.wallCream);const W=n.add(n.place(Ds(_.woodDark,.95,2.1),3.4,0,q,Math.PI));n.blockBox(3.4,q,.5,.12),n.add(n.place(ic(1.4,.8,12626050),3.4,0,a/2-1));const j=new xe;j.position.set(-.52,0,.6),j.rotation.y=-Math.PI/2,n.root.add(j);const N=new xe;N.position.set(-1.9,1.05,.6),n.root.add(N);let B=!1;const K=X=>{B=X,L.material=w(X?9426943:_.screen,{glow:X?.55:0})};n.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:E,onInteract:async X=>{if(await X.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await X.say(["Depois. Se sentar agora, não levanta mais."]);return}X.lockPlayer(!0),X.ridePlayer(j,new z(-.52,.02,0),1,0),X.rideCompanion(j,new z(.52,.02,0),1,0),X.setSitting(!0),K(!0),X.focusCamera(N),X.setZoom(7.2),await X.wait(.9),await X.say(["Está passando Bo Burnham."]),await X.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${X.companionName()} tá rindo também.`]),await X.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await X.say(["Mais um. Só mais um.","Nunca é só mais um."]),X.setSitting(!1),X.focusCamera(null),X.setZoom(10),X.releasePlayer(-1.6,.4,-Math.PI/2),X.releaseCompanion(-1.6,1.5,-Math.PI/2),X.lockPlayer(!1),X.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),n.interact({id:"casa:tv",x:r+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:P,onInteract:async X=>{K(!B),B&&X.som("tv"),X.toast(B?"TV ligada":"TV desligada","📺"),B&&await X.say(["Está passando Bo Burnham."])}}),n.interact({id:"casa:geladeira",x:r+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:X=>X.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),n.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:X=>X.say(["Por algum milagre, a pia está limpa…"])}),n.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:C,onInteract:async X=>{await e([[i,"Dois pratos, duas canecas. Já virou automático."],[o,"Três, se a Rubi sair do quarto."]]),X.toast("Mesa posta","🍽️")}}),n.interact({id:"casa:maquina",x:s/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:D,onInteract:async X=>{if(X.flag("roupa-lavando")){await e([[o,"Ainda tá centrifugando."],[i,"Esse barulho é a trilha sonora dessa casa."]]);return}X.setFlag("roupa-lavando"),X.toast("Máquina ligada","🫧"),await e([[i,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[o,"Contanto que a Rubi não encha ela de novo antes."]])}}),n.interact({id:"casa:banheiro",x:m,z:g+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:A,onInteract:()=>e([[o,"Tem alguém aí?"],[i,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),n.interact({id:"casa:quarto",x:M,z:g+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:x,onInteract:async X=>{await e([[i,"Acho que a Rubi está ouvindo kpop"],[o,"Para variar né"]]),X.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),n.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:F,onInteract:async X=>{if(X.flag("planta-regada")){await X.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}X.setFlag("planta-regada"),F.scale.multiplyScalar(1.2),X.toast("A plantinha cresceu um tiquinho","🌱"),await X.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),n.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:b,onInteract:async X=>{await X.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),X.toast("+1 disposição","☕")}}),n.interact({id:"casa:janela",x:r+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async X=>{await X.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),X.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),n.door({x:3.4,z:a/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:W,radius:1.7}),n.onUpdate((X,ht)=>{V.visible=n.game.flag("planta-regada"),V.position.y=2.4+Math.sin(ht*1.6)*.12,V.rotation.y=ht*.9})}},ue={x:0,z:-3,largura:16,profundidade:10,fundo:1.6},dn={z:-2,largura:48,profundidade:38},Ki={x:-21,z:9},Yi={x:Ki.x+2.4,z:Ki.z-2.6};function ah(n,t,e=0){return Math.abs(n-ue.x)<ue.largura/2-e&&Math.abs(t-ue.z)<ue.profundidade/2-e}const rh={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:Yi.x,z:Yi.z,facing:Math.PI/2},entries:{portaria:{x:Yi.x,z:Yi.z,facing:Math.PI/2},beira:{x:0,z:3.5,facing:Math.PI}},build(n){const t=n.game,e=async N=>{for(const[B,K]of N)await t.say([K],B)},i=Ln.name,o=En.name,s={x:ue.x,z:ue.z,width:ue.largura,depth:ue.profundidade};n.groundWithHoles({width:160,depth:160,color:_.grass,holes:[s]}),n.groundWithHoles({width:dn.largura,depth:dn.profundidade,color:14999766,y:.015,z:dn.z,holes:[{...s,z:s.z-dn.z}]}),n.setBounds(-22,-19,22,16),n.add(n.place(Xv(ue.largura,ue.profundidade,ue.fundo),ue.x,0,ue.z));const a=jv(ue.largura,ue.profundidade);a.position.set(ue.x,-.12,ue.z),n.root.add(a);for(const N of[-5.2,-1.8,1.8,5.2]){const B=new v(new ze(.24,ue.profundidade-1.4),je(4164272,1,!0));B.rotation.x=-Math.PI/2,B.position.set(ue.x+N,-1.6+.08,ue.z),B.renderOrder=1,n.root.add(B)}for(const N of[-5,5])n.add(n.place(Yv(),N,0,ue.z+ue.profundidade/2));const r=n.add(n.place($v(),0,0,ue.z-ue.profundidade/2-1.6));n.blockBox(0,ue.z-ue.profundidade/2-1.9,.4,.4);const c=[qa(_.frisbee),qa(16767070),qa(7328752)];c.forEach((N,B)=>{n.place(N,-4.5+B*4.6,-.05,ue.z-1.6+B%2*2.6),n.root.add(N)});const l=[_.fabricBlue,_.fabricRed,6074447,16763213];for(let N=0;N<6;N++){const B=-7.5+N*3;n.add(n.place(ql(l[N%l.length]),B,0,5.4,Math.PI)),n.blockBox(B,5.4,.36,.85),N%2===0&&(n.add(n.place(Ga(N%4===0?_.fabricRed:4882400),B+1.5,0,6.9)),n.blockCircle(B+1.5,6.9,.3))}const h=n.add(n.place(ql(_.rug),10.5,0,2.2,-Math.PI/2));n.blockBox(10.5,2.2,.85,.36),n.add(n.place(Ga(16748465),11.6,0,3.6)),n.blockCircle(11.6,3.6,.3);const d=n.add(n.place(Zv(),-11,0,2.5,-Math.PI/2));n.blockCircle(-11,2.5,.3);const u=n.add(n.place(Yr(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));n.blockBox(-12.5,7.2,1.4,1,.35);const p=n.add(n.place(s1(8,5),15,0,-18));n.blockBox(15,-18,4.2,2.7),n.banco(14,-3,-Math.PI/2);const g={x:-17,z:-14,largura:13,profundidade:7},M=g.z+g.profundidade/2,m=n.add(n.place(o1(g.largura,g.profundidade),g.x,0,g.z));n.blockBox(g.x,g.z,g.largura/2+.3,g.profundidade/2+.9);const f={x:-16.5,z:-6.8,largura:12.4,profundidade:7};n.patch(f.x,f.z,f.largura,f.profundidade,_.restauranteDeck,0,.02);for(let N=0;N<9;N++){const B=f.z-f.profundidade/2+.5+N*.78;n.patch(f.x,B,f.largura-.3,.1,_.restauranteDeckRipa,0,.024)}const S={x:-16.5,z:-6.6};for(const[N,B]of[[-20.6,-8.6],[S.x,S.z],[-12.4,-8.6],[-18.6,-4.2],[-13.6,-4.2]])n.add(n.place(i1(),N,0,B)),n.blockCircle(N,B,1.25);const y=new xe;y.position.set(S.x,0,S.z),n.root.add(y);const x=new xe;x.position.set(S.x,1,S.z),n.root.add(x);const A=1.02,C=.02;n.interact({id:"clube:mesa-do-restaurante",x:S.x,z:S.z,radius:2.2,label:"Sentar e ver o cardápio",icon:"📖",onInteract:async N=>{N.lockPlayer(!0),N.ridePlayer(y,new z(0,C,A),1,Math.PI),N.rideCompanion(y,new z(0,C,-A),1,0),N.setSitting(!0),N.focusCamera(x),N.setZoom(7.4),await N.wait(.6),await e([[o,"Tá bom, deixa eu ver o que tem."],[i,"Você já sabe o que vai pedir."],[o,"Sei. Mas eu gosto de ler tudo antes."],[i,"Se tiver arepa, acabou a leitura pra mim."]]),await N.abrirCardapio(),N.setSitting(!1),N.focusCamera(null),N.setZoom(10),N.releasePlayer(S.x,S.z+2,Math.PI),N.releaseCompanion(S.x,S.z-2,0),N.lockPlayer(!1),N.unlock({id:"cardapio-do-clube",title:"O cardápio do restaurante",place:"Clube",note:"Você leu o cardápio inteiro, de cabo a rabo, e pediu arepa. Como sempre.",icon:"📖"})}});for(const N of[-20.6,-12.4])n.add(n.place(Ga(_.restauranteToldo),N,0,-4.8)),n.blockCircle(N,-4.8,.3);n.interact({id:"clube:restaurante",x:g.x,z:M+1.3,radius:2.4,label:"Restaurante",icon:"🍽️",highlight:m,onInteract:async N=>{await e([[o,"Eu tô com fome desde que a gente entrou na água."],[i,"Você tava com fome ANTES de entrar na água."],[o,"E continuo. É consistência."]]),N.toast("Cheiro de comida boa","🍽️"),N.unlock({id:"restaurante-clube",title:"O restaurante do clube",place:"Clube",note:"Mesa na área externa, o cabelo dos dois ainda molhado, e ninguém com pressa de voltar pra piscina.",icon:"🍽️"})}});for(const N of[-5,7])n.add(n.place(fd(6),N,0,-12.5)),n.blockBox(N,-13.2,3,1);for(const[N,B]of[[12,-13],[20,-11],[21,-16]])n.mesaDePiquenique(N,B);n.add(n.place($s(),-9,0,-5)),n.blockCircle(-9,-5,.3);for(const[N,B,K]of[[12,6,1.2],[8,12,1.1]])n.add(n.place(ad(K),N,0,B)),n.blockCircle(N,B,K);for(const[N,B,K,X]of[[-4,-17,1.3,1.05],[19,-8,1.4,.95]])n.add(n.place(kv(K,X,N),N,0,B)),n.blockCircle(N,B,K);for(const N of[-9,-2,5,12])n.add(n.place(ks(),N,0,12)),n.blockCircle(N,12,.25);n.add(n.place(pd(),11.5,0,3.4)),n.blockBox(11.5,3.4,.3,.25),n.add(n.place($s(),6.5,0,11.4)),n.blockCircle(6.5,11.4,.3),n.add(n.place(vd(),-17,0,12.5)),n.blockBox(-17,11.9,1.9,1);for(const[N,B,K,X]of[["Piscina",_.fabricBlue,3,9.6],["Sucos",5161384,-15.5,10.2]])n.add(n.place(Jr(N,B),K,0,X)),n.blockCircle(K,X,.25);for(const N of[-20,21])n.add(n.place(md(),N,0,-19)),n.blockCircle(N,-19,.35);n.setSeed(90210);const P=dn.largura/2+1.5,L=dn.profundidade/2+1.5;for(const[N,B]of[[-P,-8],[-P,4],[P,2],[P,-10],[-9,-L+dn.z],[11,-L+dn.z],[-4,L+dn.z]])n.add(n.place(Zs("palmeira",n.range(.95,1.2),n.rng()),N,0,B)),n.blockCircle(N,B,.5);for(let N=0;N<26;N++){const B=n.range(-34,34),K=n.range(-32,28);Math.abs(B)<dn.largura/2+1&&Math.abs(K-dn.z)<dn.profundidade/2+1||n.add(n.place(N%2?Bs(n.range(.7,1.1)):jr(6,1.1),B,0,K))}for(let N=0;N<6;N++){const B=ld(n.range(1.8,3));B.position.set(n.range(-60,60),n.range(40,52),n.range(-50,30)),n.root.add(B);const K=n.range(.2,.5);n.onUpdate(X=>{B.position.x+=K*X,B.position.x>62&&(B.position.x=-62)})}const E=n.add(n.place(gd(),Ki.x,0,Ki.z,Math.PI/2));n.blockBox(Ki.x,Ki.z,1.3,4.3),n.door({x:Yi.x,z:Yi.z,to:"villa-lobos",entry:"clube",label:"Pegar o ônibus pro parque",icon:"🚌",highlight:E,radius:2.4});const b=[],D=(N,B,K=12)=>{t.som("agua");for(let X=0;X<K;X++){const ht=new v(new Rt(.1+Math.random()*.1,6,5),je(14677247,.9)),ft=X/K*Math.PI*2,St=.2+Math.random()*.5;ht.position.set(N+Math.cos(ft)*St,-.1,B+Math.sin(ft)*St),n.root.add(ht),b.push({mesh:ht,vy:2.2+Math.random()*2.4,vida:1})}};let F=0,V=0,q=!1;n.onUpdate((N,B)=>{a.position.y=-.12+Math.sin(B*1.4)*.015,c.forEach((St,Dt)=>{St.position.y=-.05+Math.sin(B*1.1+Dt*1.7)*.05,St.rotation.y=Math.sin(B*.4+Dt)*.4});const K=t.playerPosition(),X=t.companionPosition(),ht=ah(K.x,K.z,.2)?1:0,ft=ah(X.x,X.z,.2)?1:0;F+=(ht-F)*Math.min(1,N*5),V+=(ft-V)*Math.min(1,N*5),t.submergePlayer(F),t.submergeCompanion(V),ht===1&&!q&&(q=!0,D(K.x,K.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let St=b.length-1;St>=0;St--){const Dt=b[St];Dt.vy-=9*N,Dt.mesh.position.y+=Dt.vy*N,Dt.vida-=N*.9,Dt.mesh.material.opacity=Math.max(0,Dt.vida),(Dt.vida<=0||Dt.mesh.position.y<-.6)&&(n.root.remove(Dt.mesh),Dt.mesh.geometry.dispose(),b.splice(St,1))}});const W=new xe;n.root.add(W),n.interact({id:"clube:trampolim",x:0,z:ue.z-ue.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:r,onInteract:async N=>{N.lockPlayer(!0),await N.say(["Do trampolim?","Do trampolim."]);const B=new z(0,.95,ue.z-ue.profundidade/2-.4),K=new z(0,-.6,ue.z+1.2);W.position.copy(B),N.ridePlayer(W,new z(0,0,0),1);const X=1.15;for(let ht=0;ht<X;ht+=1/60){const ft=ht/X;W.position.lerpVectors(B,K,ft),W.position.y+=Math.sin(ft*Math.PI)*2.6,await N.wait(1/60)}D(K.x,K.z,18),N.releasePlayer(K.x,K.z,Math.PI),N.lockPlayer(!1),N.toast("Splash!","💦"),N.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),n.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:h,onInteract:async N=>{await N.say(["Sol na cara, barulho de água, ninguém com pressa.",`${N.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),N.toast("+1 preguiça boa","🌞")}});let j=0;n.onUpdate(N=>{j<=0||(j-=N,j<=0&&(t.removeItem(Qt.sucoMorango.id,En.id),t.removeItem(Qt.sucoPessego.id,Ln.id),t.toast("Acabou o suco","🍹")))}),n.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:u,onInteract:async N=>{await e([[o,"Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito."],[i,"Awnn gracias amorzito"]]),j=50,N.addItem(Qt.sucoMorango,En.id),N.addItem(Qt.sucoPessego,Ln.id),N.som("sorvete"),N.toast("Morango e pêssego","🍹")}}),n.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:d,onInteract:async N=>{D(-10.6,2.5,8),await N.say(["Gelada. Sempre gelada."])}}),n.interact({id:"clube:vestiario",x:15,z:-14.2,radius:2.2,priority:1,label:"Vestiário",icon:"🩳",highlight:p,onInteract:async N=>{for(const B of[N.playerId(),N.companionId()]){N.storeItem(Qt.oculosEscuros,B);for(const K of Md)N.storeItem(K,B)}N.flag("vestiario-clube")||(N.setFlag("vestiario-clube"),await e([[i,"Cinco minutos pra trocar de roupa. Você demora quinze."],[o,"Eu demoro porque escolho. Você só pega a primeira que vê."]])),N.abrirVestiario()}})}};class L_{group=new at;aoSoar=null;get x(){return this.group.position.x}get z(){return this.group.position.z}get estado(){return this.humor}area;jeito;humor="parado";aguarda=1.2;alvo=new z;fase=0;ateSoar;carinho=0;semente;constructor(t,e={}){this.area=t,this.jeito={velocidade:e.velocidade??.62,descansoMin:e.descansoMin??1.4,descansoMax:e.descansoMax??4.4,chanceDeSentar:e.chanceDeSentar??.35,somCadaMin:e.somCadaMin??9,somCadaMax:e.somCadaMax??20,duracaoDoCarinho:e.duracaoDoCarinho??3.4,semente:e.semente??20260902},this.semente=this.jeito.semente>>>0||1,this.ateSoar=this.jeito.somCadaMin*.7,this.group.position.set((t.minX+t.maxX)/2,0,(t.minZ+t.maxZ)/2),this.alvo.copy(this.group.position)}prontoParaAparecer(t){this.group.userData.peca=t,this.group.traverse(e=>{e.isMesh&&(e.castShadow=!0)})}sorte(){let t=this.semente;return t^=t<<13,t^=t>>>17,t^=t<<5,this.semente=t>>>0,this.semente%1e5/1e5}cabe(t,e){const i=this.area;if(t<i.minX||t>i.maxX||e<i.minZ||e>i.maxZ)return!1;for(const o of i.proibido??[])if(Math.hypot(t-o.x,e-o.z)<o.r)return!1;return!0}novoDestino(){for(let t=0;t<12;t++){const e=this.area.minX+this.sorte()*(this.area.maxX-this.area.minX),i=this.area.minZ+this.sorte()*(this.area.maxZ-this.area.minZ),o=Math.hypot(e-this.x,i-this.z);if(this.cabe(e,i)&&o>.7){this.alvo.set(e,0,i),this.humor="andando",this.aguarda=o/this.jeito.velocidade+2;return}}this.humor="parado",this.aguarda=1.5}receberCarinho(){this.humor="sentado",this.aguarda=this.jeito.duracaoDoCarinho,this.carinho=1,this.ateSoar=Math.min(this.ateSoar,2.2)}update(t){if(this.fase+=t,this.aguarda-=t,this.ateSoar-=t,this.carinho>0&&(this.carinho=Math.max(0,this.carinho-t*.42)),this.ateSoar<=0){const i=this.jeito;this.ateSoar=i.somCadaMin+this.sorte()*(i.somCadaMax-i.somCadaMin),this.aoSoar?.(),this.humor==="andando"&&(this.humor="parado",this.aguarda=.9)}if(this.aguarda<=0)if(this.humor==="andando"){const i=this.jeito;this.humor=this.sorte()<i.chanceDeSentar?"sentado":"parado",this.aguarda=i.descansoMin+this.sorte()*(i.descansoMax-i.descansoMin)}else this.novoDestino();let e=!1;if(this.humor==="andando"){const i=this.alvo.x-this.x,o=this.alvo.z-this.z,s=Math.hypot(i,o);if(s<.08)this.humor="parado",this.aguarda=1.2+this.sorte()*2.5;else{const a=Math.min(s,this.jeito.velocidade*t);this.group.position.x+=i/s*a,this.group.position.z+=o/s*a;let c=Math.atan2(i,o)-this.group.rotation.y;for(;c>Math.PI;)c-=Math.PI*2;for(;c<-Math.PI;)c+=Math.PI*2;this.group.rotation.y+=c*Math.min(1,t*7),e=!0}}this.animar(t,{andando:e,sentado:this.humor==="sentado",carinho:this.carinho,fase:this.fase})}}class D_ extends L_{corpo=new at;cabeca=new at;rabo=new at;patas=[];orelhas=[];olhos=[];gomosDoRabo=[];constructor(t){super(t,{velocidade:.62,descansoMin:1.4,descansoMax:4.4,chanceDeSentar:.35,somCadaMin:9,somCadaMax:20}),this.montar(),this.prontoParaAparecer("pelusa")}montar(){const t=w(_.pelusaBranco),e=w(_.pelusaCinza),i=w(_.pelusaCinzaEscuro),o=new v(new Rt(1,14,10),t);o.scale.set(.105,.098,.165),o.position.y=.175,this.corpo.add(o);const s=new v(new Rt(1,14,10),e);s.scale.set(.098,.072,.142),s.position.set(0,.203,-.012),this.corpo.add(s);const a=new v(new Rt(.105,14,10),t);a.scale.set(1,.94,.9),this.cabeca.add(a);const r=new v(new Rt(.107,14,10,0,Math.PI*2,0,Math.PI*.54),e);r.scale.set(1,.94,.9),r.position.y=.004,this.cabeca.add(r);const c=new v(new Rt(.058,10,8),t);c.scale.set(1.05,.78,.85),c.position.set(0,-.032,.072),this.cabeca.add(c);const l=new v(new Rt(.016,8,6),w(_.pelusaFocinho));l.scale.set(1.2,.85,.8),l.position.set(0,-.024,.122),this.cabeca.add(l);for(const d of[-1,1]){const u=new at,p=new v(new Pe(.042,.085,6),e);u.add(p);const g=new v(new Pe(.026,.058,6),w(_.pelusaOrelha));g.position.z=.016,u.add(g),u.position.set(d*.062,.092,-.006),u.rotation.z=d*.17,this.orelhas.push(u),this.cabeca.add(u);const M=new v(new Rt(.016,8,6),w(2828065));M.position.set(d*.044,.01,.09),this.olhos.push(M),this.cabeca.add(M)}this.cabeca.position.set(0,.288,.152),this.corpo.add(this.cabeca);for(const[d,u]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const p=new v(new An(.028,.085,3,6),t);p.position.set(d*.062,.072,u*.092),this.patas.push(p),this.corpo.add(p)}let h=this.rabo;for(let d=0;d<3;d++){const u=new at,p=new v(new An(.022-d*.004,.075,3,6),d%2===0?e:i);p.position.y=.048,u.add(p),u.position.y=d===0?0:.094,u.rotation.x=d===0?-.75:.34,h.add(u),h=u,this.gomosDoRabo.push(u)}this.rabo.position.set(0,.19,-.168),this.corpo.add(this.rabo),this.group.add(this.corpo)}animar(t,{andando:e,sentado:i,carinho:o,fase:s}){if(e){const c=s*9;this.patas[0].position.z=.092+Math.sin(c)*.032,this.patas[3].position.z=-.092+Math.sin(c)*.032,this.patas[1].position.z=.092-Math.sin(c)*.032,this.patas[2].position.z=-.092-Math.sin(c)*.032,this.corpo.position.y=Math.abs(Math.sin(c))*.012,this.corpo.rotation.x=0,this.corpo.rotation.z=Math.sin(c)*.03}else{for(let d=0;d<4;d++){const u=d<2?.092:-.092;this.patas[d].position.z+=(u-this.patas[d].position.z)*Math.min(1,t*8)}this.corpo.rotation.z*=1-Math.min(1,t*8);const c=i?.34:0;this.corpo.rotation.x+=(c-this.corpo.rotation.x)*Math.min(1,t*5);const l=Math.sin(s*1.7)*.006,h=(i?.028:0)+l;this.corpo.position.y+=(h-this.corpo.position.y)*Math.min(1,t*5)}const a=e?1:.55;for(let c=0;c<this.gomosDoRabo.length;c++){const l=this.gomosDoRabo[c],h=(.1+c*.075)*a+o*.1;l.rotation.z=Math.sin(s*(2.1+c*.9))*h,c===0&&(l.rotation.x=-.75+Math.sin(s*1.3)*.12*a)}this.cabeca.rotation.y=e?0:Math.sin(s*.6)*.34,this.cabeca.rotation.x=-o*.22+Math.sin(s*1.9)*.02;for(let c=0;c<this.orelhas.length;c++){const l=c===0?-1:1,h=Math.sin(s*2.3+c*1.7);this.orelhas[c].rotation.z=l*(.17+o*.12)+h*.05*l}const r=1-o*.85;for(const c of this.olhos)c.scale.y=Math.max(.12,r)}}const un=8,fn=6.5,qe=-un/2,Je=-fn/2,ch=2.8,oi={x:2.65,z:Je+.36},lh={x:-1.15},U_=["Ele só ronrona assim pra quem ele gosta.","Cuidado que ele dorme em cima de você.","Ó, fechou o olhinho.","Ele te adotou.","Esse aí é o dono do quarto. A gente só mora junto."],N_=[Qt.gorroDeLa,Qt.camisaListrada,Qt.calcaJeans,Qt.botaAmarela,Qt.vestidoRosa,Qt.gargantilhaDeLaco,Qt.maidMarinheiro,Qt.maidGatinho,Qt.maidJapones,Qt.meiaDeCoxa,Qt.moletomPreto],hh={id:"quarto",name:"Quarto do Ari",subtitle:"a porta que fica sempre encostada",ambient:{sky:14872311,indoor:!0,sunColor:16774366,sunIntensity:.95,ambientColor:15397883,ambientIntensity:1.45,sunDir:[10,15,12]},spawn:{x:.9,z:1.7,facing:Math.PI},entries:{"da-sala":{x:.9,z:1.7,facing:Math.PI}},build(n){const t=n.game,e=async f=>{for(const[S,y]of f)await t.say([y],S)},i=Ln.name,o=En.name;n.ground({width:un,depth:fn,color:_.floorWood}),n.setBounds(qe+.45,Je+.45,un/2-.45,fn/2-.45),n.wall(qe,Je,un/2,Je,ch,_.wallAzul),n.wall(qe,Je,qe,fn/2,ch,_.wallAzul),n.wall(un/2,Je,un/2,fn/2,.45,_.wallAzul);const s=.9,a=1.1;n.wall(qe,fn/2,s-a/2,fn/2,.45,_.wallAzul),n.wall(s+a/2,fn/2,un/2,fn/2,.45,_.wallAzul);for(const[f,S,y,x]of[[0,Je+.06,un,0],[qe+.06,0,fn,Math.PI/2]]){const A=new v(new k(y,.12,.05),w(12176860));A.position.set(f,.06,S),A.rotation.y=x,n.add(A)}const r=n.add(n.place(__(_.fabricBlue),-2.2,0,-1.75));n.blockBox(-2.2,-1.75,.78,1.08);const c={x:-2.2,y:.86,z:-1.02},l=new xe;l.position.set(c.x,c.y,c.z),l.rotation.x=-Math.PI/2,n.add(l),n.add(n.place(R_(),-1.05,0,-2.72)),n.blockBox(-1.05,-2.72,.24,.22);const h=n.add(n.place(v_(1.9,1.1),.15,0,Je+.22));n.blockBox(.15,Je+.22,.55,.18);const d=n.add(n.place(C_(_.wallMint),oi.x,0,oi.z));n.blockBox(oi.x,oi.z,.8,.32);const u=n.add(n.place(P_(_.woodDark),qe+.12,0,-.6,Math.PI/2));n.add(n.place(Cd(1.6,1.2),qe+.16,1.7,1,Math.PI/2));const p=n.add(n.place(M_(),qe+.5,0,2,-Math.PI/2));n.blockBox(qe+.5,2,.4,.82),n.add(n.place(oc(_.woodDark),qe+1.35,0,2,-Math.PI/2)),n.add(n.place(ic(2.6,2,_.rug),.3,0,1.1)),n.add(n.place(sc(1.15),un/2-.75,0,.9)),n.blockCircle(un/2-.75,.9,.3),n.add(n.place(ac(.6,.75,_.flowerPink),-2.2,1.85,Je+.17)),n.add(n.place(rc(.9),1.05,1.9,Je+.19));const g=n.add(n.place(b_(1.3,1),lh.x,1.72,Je+.17));n.door({x:s,z:fn/2-.7,to:"casa",entry:"do-quarto",label:"Voltar pra sala",icon:"🚪"}),n.interact({id:"quarto:armario",x:oi.x,z:oi.z+1.25,radius:1.8,label:"Abrir o armário",icon:"🚪",highlight:d,onInteract:async f=>{for(const S of[f.playerId(),f.companionId()])for(const y of N_)f.storeItem(y,S);f.flag("armario-aberto")||(f.setFlag("armario-aberto"),await e([[i,"Pode mexer, fica à vontade."],[o,"Tem mais roupa aqui do que no meu apartamento inteiro."]]),f.unlock({id:"armario-do-ari",title:"O armário do Ari",place:"Quarto do Ari",note:"Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.",icon:"👕"})),f.abrirGuardaRoupa()}});const M=new D_({minX:qe+.8,maxX:un/2-.8,minZ:Je+.9,maxZ:fn/2-.8,proibido:[{x:-2.2,z:-1.75,r:1.05},{x:-1.05,z:-2.72,r:.45},{x:.15,z:Je+.22,r:.7},{x:oi.x,z:oi.z,r:1},{x:qe+.5,z:2,r:.9},{x:un/2-.75,z:.9,r:.6}]});n.add(M.group),M.aoSoar=()=>t.som("miado");const m=n.interact({id:"quarto:pelusa",x:M.x,z:M.z,radius:1.15,label:"Fazer carinho no Pelusa",icon:"🐈",highlight:M.group,onInteract:async f=>{if(M.receberCarinho(),f.som("miado"),!f.flag("pelusa-conhecido")){f.setFlag("pelusa-conhecido"),await e([[o,"Esse é o Pelusa?"],[i,"Esse é o Pelusa."],[o,"Ele deixa pegar?"],[i,"Ele decide na hora. Hoje ele tá deixando."]]),f.unlock({id:"pelusa",title:"O Pelusa",place:"Quarto do Ari",note:"O gato do Ari. Branco, cinza no lombo, e some pelo quarto até você sentar no chão.",icon:"🐈"});return}await f.say([n.pick(U_)],i)}});n.onUpdate(f=>{M.update(f),m.moveTo(M.x,M.z)}),n.interact({id:"quarto:memorias",x:lh.x,z:-2.15,radius:1.35,label:"Ver memórias",icon:"📌",highlight:g,onInteract:async f=>{f.flag("quadro-visto")||(f.setFlag("quadro-visto"),await e([[i,"Eu queria um lugar pra pendurar as nossas."],[o,"Um quadro de memórias."],[i,"Esse. Cada uma que a gente viver, entra aqui."]]),f.unlock({id:"quadro-de-memorias",title:"O quadro de memórias",place:"Quarto do Ari",note:"Ideia dele. A primeira já estava pregada quando eu vi.",icon:"📌"})),f.abrirMemoria("o-pedido")}}),n.interact({id:"quarto:espelho",x:qe+.95,z:-.6,radius:1.5,label:"Se olhar no espelho",icon:"🪞",highlight:u,onInteract:async f=>{if(f.wearables().filter(y=>y!==null).length===0){await e([[o,"Tô bem assim?"],[i,"Tá. Mas tem um armário inteiro logo ali."]]);return}await e([[i,`Olha só, ${f.playerName()}.`],[o,"Ficou bom mesmo."]])}}),n.interact({id:"quarto:cama",x:-2.2,z:-.5,radius:1.6,label:"Deitar na cama",icon:"🛏️",highlight:r,onInteract:async f=>{if(await f.ask("Deitar um pouco?",["Deitar","Agora não"])!==0){await e([[o,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[o,"Não é a cama então."]]);return}f.lockPlayer(!0),f.ridePlayer(l,new z(-.36,0,0),1,0),f.rideCompanion(l,new z(.36,0,0),1,0),f.setLying(!0),f.setCameraOmbro(new z(-.95,3.75,.35),new z(-2.2,.72,-1.75)),await f.wait(1.1),await e([[o,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[o,"Não é a cama então."]]),await f.ask("Ficar mais um pouco?",["Fica","Levantar"])===0&&(await e([[i,"A gente não precisa fazer nada agora."],[o,"Eu sei."]]),await f.wait(2.4)),f.setLying(!1),f.setCameraOmbro(null),f.releasePlayer(-1.3,-.4,0),f.releaseCompanion(-1.3,.25,0),f.lockPlayer(!1),f.unlock({id:"deitar-junto",title:"Deitar sem motivo",place:"Quarto do Ari",note:"Os dois na cama dele, olhando o teto, sem plano nenhum para o resto da tarde.",icon:"🛏️"})}}),n.interact({id:"quarto:mesa",x:qe+1.5,z:2,radius:1.5,label:"Olhar a escrivaninha",icon:"💻",highlight:p,onInteract:()=>e([[i,"É daqui que eu te mando mensagem de madrugada."],[o,"Eu sei. Eu tô acordado do outro lado."]])}),n.interact({id:"quarto:estante",x:.35,z:-2.2,radius:1.4,label:"Olhar a estante",icon:"📚",highlight:h,onInteract:async f=>{await e([[o,"Você leu todos esses?"],[i,"Comecei todos esses."],[i,"Menos esse. Esse eu li três vezes: Aristóteles e Dante Descobrem os Segredos do Universo."],[o,"Eu sei. Você me contou o final antes de eu chegar na metade."],[i,"E o seu tá aqui do lado. A Toca das Raposas."],[o,"Você guardou."],[i,"Guardei."]]),f.flag("estante-favoritos")||(f.setFlag("estante-favoritos"),f.unlock({id:"os-dois-livros",title:"Os dois livros",place:"Quarto do Ari",note:"O Aristóteles e Dante é dele. A Toca das Raposas é meu. Ficam na mesma prateleira.",icon:"📚"}))}})}};function z_(n,t,e,i){const o=new z().subVectors(t,n),s=o.length(),a=new v(new et(e,e*1.15,s,8),i);return a.position.copy(n).addScaledVector(o,.5),a.quaternion.setFromUnitVectors(new z(0,1,0),o.normalize()),a}class F_{group=new at;cabins=[];radius;hubHeight;speed;angle=0;rim=new at;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,i=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const o=w(t.frameColor??_.metalWhite),s=this.hubHeight=e+2.6,a=e*.075;for(const P of[-a,a]){const L=new v(new ge(e,e*.019,8,72),o);L.position.z=P,this.rim.add(L)}const r=Math.min(48,i*2);for(let P=0;P<r;P++){const L=P/r*Math.PI*2,E=new v(new k(e*.012,e*.012,a*2),o);E.position.set(Math.cos(L)*e,Math.sin(L)*e,0),this.rim.add(E)}const c=[];for(let P=0;P<r;P++){const L=P/r*Math.PI*2,E=(P+1)/r*Math.PI*2,b=P%2===0?-a:a,D=P%2===0?a:-a;c.push(Math.cos(L)*e,Math.sin(L)*e,b,Math.cos(E)*e,Math.sin(E)*e,D)}this.rim.add(new sl(dh(c),kl(14673642)));const l=[];for(let P=0;P<i;P++){const L=P/i*Math.PI*2,E=Math.cos(L)*e,b=Math.sin(L)*e;l.push(0,0,-a*.5,E,b,-a),l.push(0,0,a*.5,E,b,a)}this.rim.add(new sl(dh(l),kl(15660022)));const h=new v(new et(e*.085,e*.085,e*.3,14),o);h.rotation.x=Math.PI/2,this.rim.add(h);for(const P of[-e*.17,e*.17]){const L=new v(new et(e*.11,e*.07,e*.06,14),w(_.metalGrey));L.rotation.x=Math.PI/2,L.position.z=P,this.rim.add(L)}this.rim.position.y=s,this.group.add(this.rim);const d=w(t.cabinColor??_.metalWhite),u=w(7321304,{opacity:.5}),p=e*.068;for(let P=0;P<i;P++){const L=new at,E=new v(new k(.09,p*1.1,.09),w(_.metalGrey));E.position.y=p*1.25,L.add(E);const b=new v(new An(p,p*.5,5,16),d);b.scale.set(1,1,.92),L.add(b);const D=new v(new et(p*1.02,p*1.02,p*.95,18,1,!0),u);D.position.y=p*.12,D.scale.z=.92,L.add(D),L.traverse(F=>{F.isMesh&&(F.castShadow=!0)}),this.cabins.push(L),this.group.add(L)}const g=e*.42,M=new z(0,s,-e*.04),m=new z(0,s,e*.04),f=[[M,new z(-e*.2,0,-g)],[M,new z(e*.2,0,-g)],[m,new z(-e*.2,0,g)],[m,new z(e*.2,0,g)]];for(const[P,L]of f){const E=z_(P.clone(),L.clone(),e*.03,o);E.castShadow=!0,this.group.add(E)}for(const P of[-g,g]){const L=new v(new k(e*.42,e*.022,e*.022),o);L.position.set(0,e*.16,P),this.group.add(L)}const S=new v(new et(e*.62,e*.67,.35,26),w(_.concrete));S.position.y=.16,S.receiveShadow=!0,this.group.add(S);const y=e*.4,x=g*.92;for(const[P,L]of[[-y,-x],[y,-x],[-y,x],[y,x]]){const E=new v(new et(e*.055,e*.055,e*.16,12),w(_.metalRed));E.position.set(P,e*.08,L),E.castShadow=!0,this.group.add(E)}const A=new v(new k(e*.55,.55,e*.3),w(_.metalGrey));A.position.set(0,.4,g*.9),A.castShadow=!0,A.receiveShadow=!0,this.group.add(A);const C=new v(new et(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),w(_.fabricRed));C.position.set(0,1.9,g*.9),C.rotation.set(0,0,Math.PI/2),C.scale.z=.6,this.group.add(C);for(const P of[-e*.15,e*.15]){const L=new v(new et(.06,.06,1.8,8),w(_.metalWhite));L.position.set(P,.9,g*.9),this.group.add(L)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const i of this.cabins)i.position.y<e&&(e=i.position.y,t=i);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function dh(n){const t=new De;return t.setAttribute("position",new le(n,3)),t}class O_{mesh;state="chao";velocity=new z;spin=0;curva=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=dd(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}get rasante(){return Math.hypot(this.velocity.x,this.velocity.z)}pickUp(){this.state="guardado",this.velocity.set(0,0,0),this.curva=0}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,i=0,o=1,s=0){const a=e.x-t.x,r=e.z-t.z,c=Math.hypot(a,r),l=(Math.random()-.5)*i;this.throwFrom(t,Math.atan2(a,r)+l,this.powerFor(c,o),o,s)}throwAt(t,e,i,o=1,s=0){this.throwFrom(t,e,this.powerFor(i,o),o,s)}powerFor(t,e=1){let i=.25,o=1.7;for(let s=0;s<14;s++){const a=(i+o)/2;this.simulateRange(a,e)<t?i=a:o=a}return Ne.clamp((i+o)/2,.25,1.7)}passo(t,e,i,o){const s=e.y>-1.2?this.lift:0;e.y-=(this.gravity-s)*o;const a=e.x,r=e.z,c=Math.hypot(a,r);return i!==0&&c>1e-4&&(e.x+=r/c*i*o,e.z+=-a/c*i*o),e.x*=1-.35*o,e.z*=1-.35*o,t.addScaledVector(e,o),i*Math.max(0,1-1.1*o)}simulateRange(t,e=1){const i=new z(0,1.15,0),o=new z(0,3.4*t*e,11*t),s=1/60;for(let a=0;a<900&&i.y>.06;a++)this.passo(i,o,0,s);return i.z}ondeVaiCair(t){const e=this.mesh.position.clone();if(this.state!=="voando")return e;const i=this.velocity.clone();let o=this.curva;const s=1/60;for(let a=0;a<900&&e.y>.06;a++)o=this.passo(e,i,o,s),this.bater(e,i,t)&&(o=0);return e.y=.06,e}throwFrom(t,e,i=1,o=1,s=0){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const a=11*i;this.velocity.set(Math.sin(e)*a,3.4*i*o,Math.cos(e)*a),this.curva=s,this.spin=22}bater(t,e,i){const o=Ne.clamp(t.x,i.minX,i.maxX),s=Ne.clamp(t.z,i.minZ,i.maxZ);return o===t.x&&s===t.z?!1:(t.x=o,t.z=s,e.multiplyScalar(.2),!0)}update(t,e){this.state==="voando"&&(this.curva=this.passo(this.mesh.position,this.velocity,this.curva,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08+this.curva*.06,this.bater(this.mesh.position,this.velocity,e)&&(this.curva=0),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.curva=0,this.onLand?.(this.mesh.position.clone())))}}const Be={largura:2.6,profundidade:1.4,altura:.76},B_=.055,Io=Be.largura/2+.22,k_=Io+.9,uh=.28,V_=Be.altura+.19,H_=6.6,G_=.72,So=Be.profundidade/2+.12,nn={vxBase:3.5,vxMin:2.9,vxMax:4.4,energiaParaVx:.05,vyBase:1.9,alturaParaVy:1.5,subidaParaVy:.12,vyMin:.75,vyMax:2.4,heranca:.25,lateralParaVz:.2,vzMax:1.05,velocidadeMaximaRaquete:6};class q_{grupo=new at;bola;minhaRaquete;raqueteDele;fase="parado";meus=0;dele=0;alvo;onSom=null;onPonto=null;onFim=null;v=new z;espera=0;sacaEu=!0;rebatedor="eu";quiquesNoAlvo=0;lateralRaquete=0;subidaRaquete=0;zAnterior=0;yAnterior=0;erroDele=0;constructor(t=5){this.alvo=t,this.bola=hd(),this.grupo.add(this.bola),this.minhaRaquete=Js(_.metalRed),this.raqueteDele=Js(_.fabricBlue),this.minhaRaquete.rotation.y=Math.PI/2,this.raqueteDele.rotation.y=-Math.PI/2,this.minhaRaquete.scale.setScalar(1.15),this.raqueteDele.scale.setScalar(1.15),this.grupo.add(this.minhaRaquete,this.raqueteDele),this.resetar()}comecar(){this.meus=0,this.dele=0,this.sacaEu=!0,this.resetar()}guardar(){this.fase="parado",this.grupo.visible=!1}resetar(){this.fase="sacando",this.espera=1.1,this.grupo.visible=!0;const t=this.sacaEu?-1:1;this.bola.position.set(t*(Be.largura/2-.3),Be.altura+.45,0),this.v.set(0,0,0),this.minhaRaquete.position.set(-Io,Be.altura+.3,0),this.raqueteDele.position.set(Io,Be.altura+.3,0),this.zAnterior=0,this.yAnterior=Be.altura+.3,this.lateralRaquete=0,this.subidaRaquete=0,this.sortearErro()}sortearErro(){const t=Math.random()<.25;this.erroDele=(Math.random()-.5)*(t?1.5:.5)}update(t,e){if(!(this.fase==="parado"||this.fase==="fim")){if(this.moverMinhaRaquete(t,e),this.moverRaqueteDele(t),this.fase==="ponto"||this.fase==="sacando"){this.espera-=t,this.espera<=0&&(this.fase==="ponto"?this.resetar():this.sacar());return}this.voar(t)}}sacar(){this.fase="jogando",this.rebatedor=this.sacaEu?"eu":"ele",this.quiquesNoAlvo=0,this.v.set(this.sacaEu?3.4:-3.4,1.45,(Math.random()-.5)*.6),this.onSom?.("lancar")}moverMinhaRaquete(t,e){const i=Ne.clamp(e.x*So,-So,So),o=Be.altura+.16+Ne.clamp((e.y+.35)*.6,0,.75);this.minhaRaquete.position.z+=(i-this.minhaRaquete.position.z)*Math.min(1,t*18),this.minhaRaquete.position.y+=(o-this.minhaRaquete.position.y)*Math.min(1,t*14);const s=nn.velocidadeMaximaRaquete;t>0&&(this.lateralRaquete=Ne.clamp((this.minhaRaquete.position.z-this.zAnterior)/t,-s,s),this.subidaRaquete=Ne.clamp((this.minhaRaquete.position.y-this.yAnterior)/t,-s,s)),this.zAnterior=this.minhaRaquete.position.z,this.yAnterior=this.minhaRaquete.position.y}moverRaqueteDele(t){const e=this.v.x>0,i=e?this.bola.position.z+this.erroDele:0,o=e?4.6:1.6;this.raqueteDele.position.z+=(i-this.raqueteDele.position.z)*Math.min(1,t*o),this.raqueteDele.position.z=Ne.clamp(this.raqueteDele.position.z,-So,So);const s=e?Ne.clamp(this.bola.position.y,Be.altura+.16,Be.altura+.9):Be.altura+.3;this.raqueteDele.position.y+=(s-this.raqueteDele.position.y)*Math.min(1,t*4)}voar(t){const e=this.bola.position,i=e.x;if(this.v.y-=H_*t,e.addScaledVector(this.v,t),(i<0&&e.x>=0||i>0&&e.x<=0)&&e.y<V_){this.onSom?.("quicar"),this.marcar(this.rebatedor==="ele","na rede");return}const s=Be.altura+B_,a=Math.abs(e.x)<=Be.largura/2&&Math.abs(e.z)<=Be.profundidade/2;if(e.y<=s&&this.v.y<0&&a){if(e.y=s,this.v.y=-this.v.y*G_,this.onSom?.("quicar"),(e.x<0?"eu":"ele")===this.rebatedor){this.marcar(this.rebatedor==="ele","quique no próprio campo");return}if(this.quiquesNoAlvo+=1,this.quiquesNoAlvo>=2){this.marcar(this.rebatedor==="eu","dois quiques");return}}for(const[c,l,h]of[[-1,this.minhaRaquete,"eu"],[1,this.raqueteDele,"ele"]]){const d=c*Io;!(c<0?i>d&&e.x<=d:i<d&&e.x>=d)||this.rebatedor===h||!(Math.abs(e.z-l.position.z)<uh&&Math.abs(e.y-l.position.y)<uh)||(e.x=d,this.rebater(h==="eu"?1:-1,l.position.y,h==="eu"),this.rebatedor=h,this.quiquesNoAlvo=0,this.onSom?.("pegar"),h==="ele"&&this.sortearErro())}(e.y<.12||Math.abs(e.x)>k_||Math.abs(e.z)>2.2)&&(this.quiquesNoAlvo>=1?this.marcar(this.rebatedor==="eu","não alcançou"):this.marcar(this.rebatedor==="ele","fora"))}rebater(t,e,i){const o=i?this.lateralRaquete:this.miraDoParceiro(),s=i?this.subidaRaquete:0,a=Math.abs(o)+Math.abs(s),r=Ne.clamp(nn.vxBase+a*nn.energiaParaVx,nn.vxMin,nn.vxMax),c=Ne.clamp(nn.vyBase-(e-(Be.altura+.14))*nn.alturaParaVy+s*nn.subidaParaVy,nn.vyMin,nn.vyMax),l=Ne.clamp(this.v.z*nn.heranca+o*nn.lateralParaVz,-1.05,nn.vzMax);this.v.set(t*r,c,l)}miraDoParceiro(){const t=-this.bola.position.z*1.2,e=(Math.random()-.5)*2.4;return Ne.clamp(t+e,-4,4)}marcar(t,e){if(t?this.meus+=1:this.dele+=1,this.sacaEu=!t,this.onPonto?.(t,e),this.meus>=this.alvo||this.dele>=this.alvo){this.fase="fim",this.onFim?.(this.meus>=this.alvo);return}this.fase="ponto",this.espera=1.3}}const W_={plano:Io},fh={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:_.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(n){const t=n.game,e=async I=>{for(const[H,J]of I)await t.say([J],H)},i=Ln.name,o=En.name,s={x:-8.6,z:2.5},a={x:-21,z:-5,reta:5,raio:5,miolo:2.4},r={x:s.x+4.72,z:s.z+.2},c={x:18,z:-4.5,largura:26,profundidade:19},l={x:-15.5,z:20.5,giro:.35},h=(I,H,J=0)=>Math.abs(I-c.x)<c.largura/2-J&&Math.abs(H-c.z)<c.profundidade/2-J;n.ground({width:240,depth:240,color:_.grass}),n.setBounds(-44,-34,44,32);for(let I=0;I<14;I++)n.disc(n.range(-40,40),n.range(-30,30),n.range(2,6),_.grassDark,.004);n.disc(0,-16.5,8.6,_.sand,.008),n.disc(0,-16.5,8,_.concrete,.012),n.patch(0,4,5.5,56,_.asphalt,0,.016),n.patch(0,9,62,4.5,_.asphalt,0,.02);const d=(I,H,J)=>{n.patch(a.x,a.z,a.reta*2,I*2,H,0,J),n.disc(a.x-a.reta,a.z,I,H,J),n.disc(a.x+a.reta,a.z,I,H,J)},u=.3;d(a.raio,_.metalWhite,.022),d(a.raio-u,_.asphalt,.026),d(a.miolo+u,_.metalWhite,.03),d(a.miolo,_.grass,.034);const p=(a.raio+a.miolo)/2,g=[1.15,.17];for(const I of[-1,1]){for(let J=0;J<5;J++){const tt=a.x-a.reta+1+J*(a.reta*2-2)/4;n.patch(tt,a.z+I*p,g[0],g[1],_.metalWhite,0,.038)}const H=a.x+I*a.reta;for(let J=0;J<6;J++){const tt=-Math.PI/2+(J+.5)/6*Math.PI,xt=I>0?tt:tt+Math.PI;n.patch(H+Math.cos(xt)*p,a.z+Math.sin(xt)*p,g[0],g[1],_.metalWhite,-(xt+Math.PI/2),.038)}}n.patch(a.x+a.reta*.55,a.z+p,.32,a.raio-a.miolo-u*2,_.metalWhite,0,.04),n.patch(s.x+.4,s.z+.2,10,6.4,_.concrete,0,.02),n.patch(s.x+1.6,7.2,3,7,_.asphalt,0,.022);const M=new F_({radius:12,cabins:32,rpm:1});n.place(M.group,0,0,-26),n.add(M.group),n.blockCircle(0,-26,7.2);for(const I of[-11,11])n.add(n.place(Xi(9,1.2,_.metalWhite),I,0,-20,Math.PI/2)),n.blockBox(I,-20,.2,4.5);n.add(n.place(Vv(2.6),-9.5,0,-21,.4)),n.blockCircle(-9.5,-21,2.7);const m=n.add(n.place(Yr(_.fabricBlue,{texto:"Bilheteria"}),8.9,0,-20.5,-.5));n.blockBox(8.9,-20.5,1.4,.95,-.5);const f=[[-6.4,-13.6,1.15],[6.4,-13.6,1.15],[-8.6,-17.4,.95],[8.6,-17.4,.95]];for(const[I,H,J]of f)n.add(n.place(ad(J,void 0,n.rng()),I,0,H,n.range(0,6.28))),n.blockCircle(I,H,J+.1);for(const[I,H]of[[-7.6,-11.4],[7.6,-11.4],[-12.2,-19],[12.2,-19]])n.add(n.place(ks(!1),I,0,H)),n.blockCircle(I,H,.35);for(const[I,H,J]of[[-3.6,-12.2,.1],[3.6,-12.2,-.1],[-13.2,-22.5,1.1]])n.banco(I,H,J);for(const[I,H]of[[6.9,-18.9],[-5.2,-11.6]])n.add(n.place($s(),I,0,H)),n.blockCircle(I,H,.35);for(let I=0;I<22;I++){const H=I/22*Math.PI*2+n.range(-.1,.1),J=n.range(10.5,13.5),tt=Math.cos(H)*J,xt=-18+Math.sin(H)*J*.7;Math.abs(tt)<4.5&&xt>-14||(I%3===0?n.add(n.place(Bs(n.range(.6,1),_.leafDark),tt,0,xt)):I%3===1?n.add(n.place(Vl(n.range(.9,1.4)),tt,0,xt,n.range(0,6.28))):n.add(n.place(Ps(n.range(.4,.8),n.rng()),tt,0,xt,n.range(0,6.28))))}n.disc(-21,11,9.2,_.sand,.024),n.disc(-21,11,8.5,_.water,.028),n.blockCircle(-21,11,8.8);const S=[Ha(),Ha(15262416),Ha()];S.forEach((I,H)=>{n.place(I,-21+Math.cos(H*2.1)*4.5,.1,11+Math.sin(H*2.1)*3.5,H*1.7),n.add(I)});const y={x:-21,z:11};for(let I=0;I<34;I++){const H=I/34*Math.PI*2+n.range(-.09,.09),J=n.range(9.1,11.4),tt=y.x+Math.cos(H)*J,xt=y.z+Math.sin(H)*J,qt=I%4;qt===0?n.add(n.place(Bs(n.range(.6,1),_.leafDark),tt,0,xt)):qt===1?n.add(n.place(Vl(n.range(.9,1.5)),tt,0,xt,n.range(0,6.28))):qt===2?n.add(n.place(Ps(n.range(.45,1.5),n.rng()),tt,0,xt,n.range(0,6.28))):n.add(n.place(jr(5,.8),tt,0,xt))}for(const[I,H,J]of[[.9,8.4,1.6],[2.6,8.7,1.1],[4.3,8.3,1.9],[5.6,8.9,1.2]]){const tt=y.x+Math.cos(I)*H,xt=y.z+Math.sin(I)*H;n.add(n.place(Ps(J,I%1,9409947),tt,-.12,xt,I)),n.blockCircle(tt,xt,.4*J)}for(const[I,H]of[[1.5,8.2],[3.4,8.4],[5.1,8.1],[.2,8.5]])n.add(n.place(Ov(n.range(1.1,1.6)),y.x+Math.cos(I)*H,0,y.z+Math.sin(I)*H));const x=[[1.1,6.6,1,!0],[2.9,7.2,.8,!1],[4.6,6.1,1.15,!0],[.4,7.4,.9,!0],[3.8,5.2,1.05,!1],[5.9,6.8,.85,!0]];for(const[I,H,J,tt]of x){const xt=n.place(Bv(J,tt),y.x+Math.cos(I)*H,.045,y.z+Math.sin(I)*H);xt.rotation.y=I,n.add(xt)}const A=c.x-c.largura/2,C=c.x+c.largura/2,P=c.z-c.profundidade/2,L=c.z+c.profundidade/2;n.patch(c.x,c.z,c.largura,c.profundidade,_.grassDark,0,.008);const E=(I,H,J,tt)=>{n.patch(I,H,J,tt,15922416,0,.012)};E(c.x,P+.3,c.largura-1.2,.28),E(c.x,L-.3,c.largura-1.2,.28),E(A+.6,c.z,.28,c.profundidade-.6),E(C-.6,c.z,.28,c.profundidade-.6),E(A+6,c.z,.22,c.profundidade-.6),E(C-6,c.z,.22,c.profundidade-.6),n.ring(c.x,c.z,2.2,.3,15922416,.012),E(c.x,c.z,.28,c.profundidade-.6);const b=(I,H,J,tt)=>{n.add(n.place(Xi(J,1.5,_.metalWhite),I,0,H,tt?Math.PI/2:0)),tt?n.blockBox(I,H,.2,J/2):n.blockBox(I,H,J/2,.2)};b(c.x,P,c.largura,!1),b(c.x,L,c.largura,!1),b(C,c.z,c.profundidade,!0),b(A,P+3.75,7.5,!0),b(A,L-3.75,7.5,!0),n.add(n.place(Xl(),A+3,0,c.z)),n.blockCircle(A+3,c.z,.5);const D=n.add(n.place(Xl(_.frisbee),C-3,0,c.z));n.blockCircle(C-3,c.z,.5);const F=n.add(n.place(Qv(),c.x,0,P+1.2));n.blockBox(c.x,P+1.2,1,.2);const V=n.add(n.place(fd(6),c.x,0,L-1.2,Math.PI));n.blockBox(c.x,L-1.4,3,.8);const q=n.add(n.place(pd(),A+1.6,0,c.z+4.2,Math.PI/2));n.blockCircle(A+1.6,c.z+4.2,.4);const W=n.add(n.place(t1(),A+1.8,0,c.z-3.4,.4)),j=n.add(n.place(e1(),C-1.6,0,L-2.4));n.blockCircle(C-1.6,L-2.4,.3);const N=j.userData.manga;n.onUpdate((I,H)=>{j.rotation.y=Math.sin(H*.3)*.5+.6,N.rotation.z=Math.sin(H*1.7)*.12-.06});for(const[I,H]of[[A+1,P+1],[C-1,P+1],[A+1,L-1],[C-1,L-1]])n.add(n.place(md(),I,0,H,Math.atan2(c.x-I,c.z-H))),n.blockCircle(I,H,.4);for(const[I,H]of[[A+6,P+1.4],[A+6,L-1.4],[C-6,P+1.4],[C-6,L-1.4]])n.add(n.place(Gl(),I,0,H));const B=n.add(n.place(Jr("Frisbee!",_.frisbee),A-1.8,0,c.z+3.4,Math.PI*.25));n.blockCircle(A-1.8,c.z+3.4,.3);const K=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[I,H,J]of K)n.banco(I,H,J);for(const[I,H]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,2]])n.add(n.place(ks(!1),I,0,H)),n.blockCircle(I,H,.35);for(const[I,H]of[[3.4,17],[-3.4,11]])n.add(n.place($s(),I,0,H)),n.blockCircle(I,H,.35);const X=n.add(n.place(cd(),-10,0,20,.3));n.blockBox(-10,20,1,.9,.3);const ht=qv(),ft=Js(_.metalRed);ft.position.set(-.78,.82,.3),ft.rotation.set(-Math.PI/2,0,.7),ht.add(ft);const St=Js(_.fabricBlue);St.position.set(.82,.82,-.28),St.rotation.set(-Math.PI/2,0,-2.3),ht.add(St);const Dt=hd();Dt.position.set(.36,.845,.42),ht.add(Dt),n.add(n.place(ht,l.x,0,l.z,l.giro)),n.blockBox(l.x,l.z,1.45,.85,l.giro);const Kt=[ft,St,Dt],rt=n.add(n.place(Yr(16164544,{tipo:"sorvete"}),12,0,18.6,.3));n.blockBox(12,18.6,1.4,.95,.3);const ut=n.add(n.place(Wv(_.fabricBlue),s.x,0,s.z));ut.userData.loja=!0,n.blockBox(s.x,s.z-.05,3.7,2.3),n.blockBox(r.x,r.z,.65,1.6);for(const I of[-1,1])n.blockCircle(s.x+I*4.05,s.z+2.82,.16);for(const I of[-1.4,1])n.banco(s.x-5.6,s.z+I,Math.PI/2);for(const[I,H]of[[a.x-a.reta-a.raio-1.4,a.z],[a.x+a.reta+a.raio+1.4,a.z]])n.add(n.place(ks(!1),I,0,H)),n.blockCircle(I,H,.35);const Ut=14;for(let I=0;I<Ut;I++){const H=I/Ut*Math.PI*2,J=I%2===0?a.miolo+.9:a.raio-.9,tt=a.x+Math.cos(H)*J+Math.sign(Math.cos(H))*a.reta*Math.abs(Math.cos(H)),xt=a.z+Math.sin(H)*J;n.add(n.place(Gl(),tt,0,xt,n.range(0,6.28)))}n.interact({id:"parque:patins",x:r.x+1.8,z:r.z,radius:2.4,label:"Alugar patins",icon:"🛼",highlight:ut,onInteract:async I=>{if(I.hasItem(Qt.patins.id)){await e([[o,"A gente já pegou um par."],[i,"É, e eu ainda não caí. Ainda."]]);return}await e([[o,"Um par pra cada um, moço."],[i,"Eu não sei patinar direito, hein."],[o,"Por isso eu vou do seu lado."]]),I.equipWearable(Qt.patins),I.som("sorvete"),I.toast("Patins calçados","🛼"),I.unlock({id:"patins-villa",title:"Patins no Villa",place:"Parque Villa Lobos",note:"A pista tem cone pra desviar e a gente desviou de quase todos.",icon:"🛼"})}});const Gt=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8],[-21,-5,12],[-8.6,2.5,9]],Bt=(I,H)=>Math.abs(I)<4&&H>-20&&H<30?!1:!Gt.some(([J,tt,xt])=>Math.hypot(I-J,H-tt)<xt),oe=["redonda","redonda","pinheiro","florida","palmeira"];let ve=0;for(let I=0;I<260&&ve<64;I++){const H=n.range(-42,42),J=n.range(-32,30);if(!Bt(H,J))continue;const tt=n.range(.85,1.5);n.add(n.place(Zs(n.pick(oe),tt,n.rng()),H,0,J,n.range(0,6.28))),n.blockCircle(H,J,.45*tt),ve++}for(let I=0;I<90;I++){const H=n.range(-42,42),J=n.range(-32,30);Bt(H,J)&&(I%3===0?n.add(n.place(jr(6,1.1),H,0,J)):I%3===1?n.add(n.place(Bs(n.range(.7,1.2)),H,0,J)):n.add(n.place(Ps(n.range(.5,1)),H,0,J)))}n.patch(-66,-10,18,220,_.water,0,.02),n.patch(-55,-10,6,220,_.concrete,0,.03);for(let I=0;I<22;I++){const H=n.range(7,20),J=n.range(4,9);n.add(n.place(Hl(J,H,J*.9,n.pick([_.wallCream,_.concrete,_.wallMint]),_.metalGrey),n.range(-95,60),0,-96-n.range(0,16)))}for(let I=0;I<14;I++){const H=n.range(6,16);n.add(n.place(Hl(n.range(4,8),H,5,_.wallCream,_.roofTile),92+n.range(0,16),0,n.range(-60,40)))}for(let I=0;I<90;I++){const H=I/90*Math.PI*2,J=62+n.range(0,28),tt=Math.cos(H)*J,xt=Math.sin(H)*J*.9;tt<-50||n.add(n.place(Zs(n.pick(oe),n.range(1.2,2.2),n.rng()),tt,0,xt,n.range(0,6.28)))}for(let I=0;I<9;I++){const H=ld(n.range(1.6,3.2));H.position.set(n.range(-70,70),n.range(56,70),n.range(-60,45)),n.root.add(H);const J=n.range(.25,.6);n.onUpdate(tt=>{H.position.x+=J*tt,H.position.x>56&&(H.position.x=-56)})}const O=n.add(n.place(Hv(_.wood,_.metalWhite),2.6,0,27.5,Math.PI));n.add(n.place(Xi(16,1.4),-10,0,28)),n.add(n.place(Xi(16,1.4),10,0,28)),n.blockBox(-10,28,8,.2),n.blockBox(10,28,8,.2),n.add(n.place(Xi(11,1.4),35,0,3.5,Math.PI/2)),n.add(n.place(Xi(11,1.4),35,0,22.5,Math.PI/2)),n.blockBox(35,3.5,.2,5.5),n.blockBox(35,22.5,.2,5.5),n.patch(29.5,13,11,5,_.asphalt,0,.01),n.patch(35.6,13,1.6,34,_.concrete,0,.014),n.patch(40.8,13,8.8,34,_.asphalt,0,.018);const mt=n.add(n.place(gd(4161494),39.5,0,13,-Math.PI/2));n.blockBox(39.5,13,1.5,4.3);const dt=n.add(n.place(vd(),36.4,0,13,-Math.PI/2));n.blockBox(35.9,13,.3,1.8);const ct=n.add(n.place(Jr("Clube!",5161384),36.4,0,8.6,Math.PI*.25));n.blockCircle(36.4,8.6,.3),n.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:mt,radius:2.6}),n.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:O,radius:2.2});const Q=new O_(_.frisbee);Q.mesh.visible=!1,Q.onLand=()=>t.som("quicar"),n.root.add(Q.mesh);const wt=Kv();wt.visible=!1,wt.userData.mira=!0,n.root.add(wt);const Mt=1.3,Tt=.12,Yt=4,Jt=22,U=.06,T={alem:3.5,arco:1.2,erro:.06,desvio:1.4,alcance:3,raio:2.1,mira:.12},$={minX:A+1.7,minZ:P+1.7,maxX:C-1.7,maxZ:L-1.7},nt=(I,H,J)=>Math.max(H,Math.min(J,I)),pt=(I,H)=>Math.atan2(Math.sin(I-H),Math.cos(I-H)),st=(I,H)=>Math.hypot(I.x-H.x,I.z-H.z),kt=[],Et=(I,H,J,tt,xt)=>{const qt=n.add(n.place(Jv(xt,J),I,0,H,Math.PI/2));n.blockCircle(I,H+.96,.36),n.blockCircle(I,H,.75),kt.push({centro:new z(I,J,H),raio:.58,pontos:tt,roda:qt.userData.aro??null,recarga:0})};Et(13,-9.4,1.9,1,_.frisbee),Et(23,1.4,2.1,2,_.gold),Et(18,-.6,2.5,3,_.frisbee);const Vt=(I,H,J)=>{const tt=H.x-I.x,xt=H.y-I.y,qt=H.z-I.z,re=tt*tt+xt*xt+qt*qt;if(re<1e-8)return J.distanceTo(I);const $t=nt(((J.x-I.x)*tt+(J.y-I.y)*xt+(J.z-I.z)*qt)/re,0,1);return Math.hypot(J.x-(I.x+tt*$t),J.y-(I.y+xt*$t),J.z-(I.z+qt*$t))},Ht=(I,H)=>{for(const J of kt)J.recarga>0||Vt(I,H,J.centro)>J.raio||(J.recarga=1.6,t.som("sino"),t.bump("frisbee.alvos",J.pontos),t.toast(`+${J.pontos} no alvo!`,"🎯"))},yt=I=>{for(const H of kt)H.recarga<=0||(H.recarga=Math.max(0,H.recarga-I),H.roda&&(H.roda.rotation.z+=I*9*H.recarga))};let vt="fora",Xt=0,Ot=0,Pt=!1,jt=0,G=null;const bt=new z,At=new z;let Nt=!1,gt=null,lt=0,zt=!1,Zt=!0,me=0;const he=I=>{t.toast(I[Math.floor(Math.random()*I.length)],"💬")},an=(I,H)=>{const J=Math.sin(H),tt=Math.cos(H),xt=J>.001?($.maxX-I.x)/J:J<-.001?($.minX-I.x)/J:1/0,qt=tt>.001?($.maxZ-I.z)/tt:tt<-.001?($.minZ-I.z)/tt:1/0;return nt(Math.min(xt,qt)-1,Yt+3,Jt)},Qe=(I,H,J)=>Yt+(an(I,H)-Yt)*nt(J,0,1),Jo=(I,H,J)=>{const tt=an(I,H);return nt((J-Yt)/Math.max(.01,tt-Yt),0,1)},mn=(I,H,J)=>{const tt=Jo(I,H,Math.hypot(J.x-I.x,J.z-I.z));return tt>.02&&tt<.99?tt:null},fo=I=>1.35-.45*nt(I,0,1),hi=(I,H)=>{I.som("pegar"),jt+=1;const J=I.bump("frisbee.trocas"),tt=I.stat("frisbee.recorde");jt>tt&&I.bump("frisbee.recorde",jt-tt),H?I.toast("Pegou no ar!","🥏"):jt%5===0&&I.toast(`${jt} trocas seguidas!`,"🥏"),J>=10&&!I.flag("memoria-frisbee")&&(I.setFlag("memoria-frisbee"),I.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"})),jt>=10&&!I.flag("memoria-frisbee-dez")&&(I.setFlag("memoria-frisbee-dez"),I.unlock({id:"frisbee-dez",title:"Dez sem deixar cair",place:"Parque Villa Lobos",note:"Dez trocas seguidas e nenhuma no chão. A gente parou porque deu fome, não porque errou.",icon:"🏆"}))},Ko=I=>{const H=I.x<c.x?1:-1;return{x:nt(I.x+H*11,A+2,C-2),z:nt(I.z,P+2,L-2)}},Zn=()=>{Pt=!1,Ot=0,wt.visible=!1,t.showCharge(null)},po=()=>t.getActiveHandItem()?.id===Qt.frisbee.id;let $n=!1;const Qo=()=>{const I=t.addItem(Qt.frisbee);return I==="cheio"?($n||($n=!0,t.toast("Sem vaga pro frisbee","🥏")),!1):(vt="comigo",Q.pickUp(),jt=0,G=null,t.setZoom(19),t.toast(I==="mao"?"Segure F e solte no traço da barra":"Frisbee guardado — escolha ele na mochila (I)","🥏"),!0)},ts=()=>{vt="fora",$n=!1,t.removeItem(Qt.frisbee.id),Q.mesh.visible=!1,Zn(),t.freeCompanion(),t.setZoom(14),G=null,gt=null},es=(I,H=0,J=!0)=>{if(vt!=="comigo"||!po())return;t.removeItem(Qt.frisbee.id);const tt=t.playerPosition(),xt=t.playerFacing(),qt=nt(I,0,1),re=mn(tt,xt,t.companionPosition());Nt=J&&re!==null&&Math.abs(qt-re)<=U,bt.copy(tt),At.copy(t.companionPosition()),Q.throwAt(tt,xt,Qe(tt,xt,qt),fo(qt),H),t.som("lancar"),zt=!1,Zt=!0,gt=null,lt=0,vt="voando-pra-ele"},ns=()=>{const I=mn(t.playerPosition(),t.playerFacing(),t.companionPosition());es(I??.5,0,!1)},mo=n.interact({id:"parque:frisbee-jogar",x:c.x,z:c.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>ns()}),go=n.interact({id:"parque:frisbee-pegar",x:c.x,z:c.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:I=>{I.addItem(Qt.frisbee)!=="cheio"&&(Q.pickUp(),vt="comigo",hi(I,!1))}});n.onUpdate((I,H)=>{const J=Q.position.clone();Q.update(I,$);const tt=t.playerPosition(),xt=t.companionPosition(),qt=t.playerFacing(),re=h(tt.x,tt.z,.4);if(re&&vt==="fora"?Qo():!re&&vt!=="fora"&&ts(),vt==="fora"){mo.enabled=!1,go.enabled=!1,wt.visible=!1,me=qt;return}if(Q.state==="voando"&&Ht(J,Q.position),yt(I),vt==="comigo"&&po()){if(t.keyDown("KeyF")){Pt=!0,Ot=Math.min(1,Ot+I/Mt),t.showCharge(Ot,mn(tt,qt,xt),U);const $t=Qe(tt,qt,Ot);wt.position.set(tt.x+Math.sin(qt)*$t,0,tt.z+Math.cos(qt)*$t),wt.scale.setScalar(1+Math.sin(H*9)*.06),wt.visible=!0}else if(Pt){const $t=Ot,te=I>1e-4?pt(qt,me)/I:0;Zn(),$t<Tt?ns():es($t,nt(te*.18,-2.5,2.5))}}else Pt&&Zn();if(me=qt,vt==="comigo"||vt==="no-chao"){const $t=Ko(tt);(!G||Math.hypot($t.x-G.x,$t.z-G.z)>2.5)&&(t.commandCompanion($t.x,$t.z),G=$t)}switch(Q.mesh.userData.fase=vt,vt){case"comigo":Q.holdAt(tt,qt),Q.mesh.visible=!1;break;case"com-ele":{const $t=Math.atan2(tt.x-xt.x,tt.z-xt.z);t.holdCompanion(tt.x,tt.z),Q.holdAt(xt,$t),Xt-=I;const te=Math.abs(pt(t.companionFacing(),$t))<T.mira;if(Xt<=0&&(te||Xt<-1)){const Wt=tt.x-xt.x,ye=tt.z-xt.z,de=Math.hypot(Wt,ye)||1,Ue=Math.random(),Jn=Ue<.3?T.arco*1.35:Ue>.85?.95:T.arco,He=Ue>.85?T.erro*2.5:T.erro,di=new z(nt(tt.x+Wt/de*T.alem+(Math.random()-.5)*T.desvio,A+1.5,C-1.5),0,nt(tt.z+ye/de*T.alem+(Math.random()-.5)*T.desvio,P+1.5,L-1.5));Q.throwToward(xt,di,He,Jn,(Math.random()-.5)*1),t.som("lancar"),G=null,vt="voando-pra-mim"}break}case"voando-pra-ele":{if(lt-=I,Q.state==="voando"&&lt<=0){lt=.25;const te=Q.ondeVaiCair($);(!gt||gt.distanceTo(te)>.8)&&(gt=te,t.commandCompanion(te.x,te.z),G=null)}const $t=Q.state==="voando"&&Q.position.y<2.3&&st(bt,Q.position)>2&&Math.hypot(Q.position.x-xt.x,Q.position.z-xt.z)<1.5;if($t&&!zt){zt=!0;const te=st(At,Q.position),Wt=nt(.98-Q.rasante*.022-te*.02+(Nt?.2:0),.35,.98);Zt=Math.random()<Wt}if($t&&Zt){t.som("pegar"),t.holdCompanion(tt.x,tt.z),G=null,gt=null;const te=Math.round(st(bt,Q.position));Q.pickUp(),Xt=.7,vt="com-ele",Nt?(t.som("confirma"),t.bump("frisbee.perfeitos"),t.toast("Passe perfeito!","🎯"),he(["Na mão! Perfeito.","Esse foi bonito, hein.","Assim fica fácil."])):(t.toast("Ele pegou no ar!","🙌"),he(["Peguei!","Isso! Manda de novo.","Tá vendo? Sou bom nisso."]));const Wt=t.stat("frisbee.maiorPasse");te>Wt&&(t.bump("frisbee.maiorPasse",te-Wt),t.toast(`Novo recorde: ${te} m`,"📏"));break}Q.state==="chao"&&(zt&&!Zt?he(["Ah, escapou!","Raspou na minha mão!","Essa eu deixei, admito."]):st(bt,Q.position)>16&&he(["Calma, não sou cachorro!","Jogou pra longe demais.","Vou ter que correr até lá?"]),jt=0,Q.position.distanceTo(xt)<1.6?(t.holdCompanion(tt.x,tt.z),G=null,gt=null,Q.pickUp(),Xt=.8,vt="com-ele"):(t.commandCompanion(Q.position.x,Q.position.z),G=null,vt="buscando"));break}case"buscando":Q.position.distanceTo(xt)<1.1&&(t.holdCompanion(tt.x,tt.z),G=null,gt=null,Q.pickUp(),Xt=.9,vt="com-ele");break;case"voando-pra-mim":{if(Q.state==="voando"&&Q.position.y<T.alcance&&Math.hypot(Q.position.x-tt.x,Q.position.z-tt.z)<T.raio){if(t.addItem(Qt.frisbee)==="cheio")break;Q.pickUp(),vt="comigo",hi(t,!0);break}Q.state==="chao"&&(vt="no-chao",jt=0,Q.position.distanceTo(tt)<1.9&&t.addItem(Qt.frisbee)!=="cheio"&&(Q.pickUp(),vt="comigo",hi(t,!1)));break}case"no-chao":Q.position.distanceTo(tt)<1.2&&t.addItem(Qt.frisbee)!=="cheio"&&(Q.pickUp(),vt="comigo",hi(t,!1));break}mo.enabled=vt==="comigo"&&!Pt,go.enabled=vt==="no-chao",vt==="comigo"?mo.moveTo(tt.x,tt.z):go.moveTo(Q.position.x,Q.position.z)}),n.interact({id:"parque:placa-quadra",x:A-1.8,z:c.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:B,onInteract:()=>e([[o,"QUADRA LIVRE — respeite quem chegou primeiro."],[i,"Hoje só tem a gente."],[o,"Então segura o F. A marca no chão mostra onde o disco vai cair, e o traço na barra é onde eu estou."],[i,"E se eu quiser mostrar serviço?"],[o,"Acerta um dos aros. Ou uma cesta, se estiver se achando."]])}),n.interact({id:"parque:placar",x:c.x,z:P+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:F,onInteract:I=>{const H=I.stat("frisbee.recorde"),J=I.stat("frisbee.trocas"),tt=I.stat("frisbee.perfeitos"),xt=I.stat("frisbee.alvos"),qt=I.stat("frisbee.maiorPasse"),re=[[i,H>0?`Nosso recorde é ${H} trocas seguidas.`:"O placar tá zerado."],[o,J>0?`E já foram ${J} no total. A gente não desiste fácil.`:"Bora estrear isso então."]];return qt>0&&re.push([i,`O passe mais longo que colou foi de ${qt} metros.`]),tt>0&&re.push([o,`${tt} ${tt===1?"passe caiu":"passes caíram"} certinho na minha mão.`]),xt>0&&re.push([i,`E ${xt} ${xt===1?"ponto":"pontos"} nos alvos. Anota aí.`]),e(re)}}),n.interact({id:"parque:arquibancada",x:c.x,z:L-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:V,onInteract:()=>e([[o,"Cansei. Cinco minutos."],[i,"Você falou cinco minutos faz meia hora."],[o,"E olha que descanso bem, hein."]])}),n.interact({id:"parque:bebedouro",x:A+2.8,z:c.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:q,onInteract:async I=>{await e([[i,"A água daqui é sempre meio quente."],[o,"Mas depois de correr atrás de disco, tá ótima."]]),I.toast("Água (meio quente)","🚰")}}),n.interact({id:"parque:sacola",x:A+2.8,z:c.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:W,onInteract:()=>e([[o,"Tem uns três discos aqui de gente que esqueceu."],[i,"Um deles é seu. Desde março."],[o,"…é, pode ser."]])}),n.interact({id:"parque:cesta",x:C-4.4,z:c.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:D,onInteract:()=>e([[i,"Um dia a gente acerta essa cesta."],[o,"Já acertei uma vez!"],[i,"Você acertou o poste. É diferente."]])}),n.interact({id:"parque:biruta",x:C-3,z:L-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:j,onInteract:()=>e([[o,"O vento tá indo pra lá."],[i,"Então joga contra que o disco fica no ar mais tempo."],[o,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),n.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:dt,onInteract:()=>e([[i,"Esse é o que passa no clube?"],[o,"É esse. Já tá parado, é só subir."]])}),n.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:ct,onInteract:()=>e([[o,'"Clube!" — com exclamação e tudo.'],[i,"Quem escreveu isso tava animado."]])}),n.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async I=>{I.som("pato"),await I.say(["Que lago bonito... dá até vontade de pular"],En.name),await I.say(["Então vamos! Hahahha"],Ln.name),await I.say(["NÃAAOOO"],En.name),I.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});let Ii=0;n.onUpdate(I=>{Ii<=0||(Ii-=I,Ii<=0&&(t.removeItem(Qt.sorveteMorango.id,Ln.id),t.removeItem(Qt.sorveteMaracuja.id,En.id),t.toast("Acabou o sorvete","🍦")))});const Ve=new q_(5);Ve.guardar(),ht.add(Ve.grupo),Ve.onSom=I=>t.som(I),ht.userData.pingpong=Ve;const R=(I,H)=>{const J=new z(I,0,H);return ht.localToWorld(J),J};let Y=!1;const it=W_.plano+.55,ot=()=>{Y=!1,Ve.guardar();for(const I of Kt)I.visible=!0;t.showPlacar(null),t.setCameraOmbro(null),t.setPlayerVisible(!0),t.lockPlayer(!1),t.freeCompanion(),Z.enabled=!0};n.onUpdate(I=>{Y&&(Ve.update(I,t.pointer()),Y&&t.showPlacar({eu:t.playerName(),ele:t.companionName(),meus:Ve.meus,dele:Ve.dele}))});const Z=n.interact({id:"parque:pingpong",x:l.x,z:l.z,radius:2.6,label:"Jogar ping pong",icon:"🏓",highlight:ht,onInteract:async I=>{if(Y)return;await e([[i,"Cinco pontos?"],[o,"Cinco pontos. E o perdedor carrega a bolsa até em casa."]]);const H=R(-it,0),J=R(it,0);I.releasePlayer(H.x,H.z,Math.atan2(J.x-H.x,J.z-H.z)),I.releaseCompanion(J.x,J.z,Math.atan2(H.x-J.x,H.z-J.z)),I.holdCompanion(H.x,H.z),I.lockPlayer(!0);const tt=R(-it-1.6,0),xt=R(0,0);I.setCameraOmbro(new z(tt.x,2.35,tt.z),new z(xt.x,.9,xt.z)),I.setPlayerVisible(!1);for(const qt of Kt)qt.visible=!1;Z.enabled=!1,Ve.comecar(),Y=!0,I.toast("Mexa o mouse para mover a raquete","🏓")}});Ve.onPonto=I=>{t.som(I?"confirma":"quicar")},Ve.onFim=I=>{(async()=>(ot(),I?(t.som("memoria"),t.toast("Campeão de ping pong!","🏆"),t.equipWearable(Qt.chapeuPingPong),await e([[i,"Cinco a "+Ve.dele+"."],[o,"Você ganhou o chapéu. Vai ter que usar."]]),t.unlock({id:"memoria-ping-pong",title:"A mesa do parque",place:"Parque Villa Lobos",note:"Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.",icon:"🏓"})):await e([[o,"Cinco a "+Ve.meus+". Revanche?"],[i,"Sempre revanche."]])))()},n.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:rt,onInteract:async I=>{await e([[i,"Dois, por favor."],[o,"Um de morango e um de maracujá."],[i,"Nunca pedimos diferente."]]),Ii=50,I.addItem(Qt.sorveteMorango,Ln.id),I.addItem(Qt.sorveteMaracuja,En.id),I.som("sorvete"),I.toast("Morango e maracujá","🍦"),I.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),n.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:X,onInteract:async I=>{await e([[o,"A toalha xadrez de sempre."],[i,"E o pão de queijo já frio."],[o,"Frio é melhor. Aceita."]]),I.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),n.interact({id:"parque:bilheteria",x:8.9,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:m,onInteract:()=>e([[i,"Dois pra roda gigante."],[o,"Sempre dois."]])});let _t=null;const It=I=>new Promise(H=>{_t={resolve:H,de:M.angle,voltas:I}});let Ft=!0;n.onUpdate(I=>{if(M.update(I),Ft){const H=t.playerPosition(),J=Math.hypot(H.x,H.z+26);if(J<28){const tt=Math.max(0,Math.min(1,(J-8)/20));t.setZoom(36-tt*21)}}if(S.forEach((H,J)=>{H.position.y=.1+Math.sin(performance.now()/900+J)*.05}),_t&&M.turnsSince(_t.de)>=_t.voltas){const H=_t.resolve;_t=null,H()}}),n.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async I=>{Ft=!1,I.lockPlayer(!0),await e([[o,"A fila tá curta hoje."],[i,"Bora subir?"]]);const H=M.boardingCabin(),J=M.speed;M.speed=J*5,I.som("sino"),I.ridePlayer(H,new z(-.3,-.34,0),.55),I.rideCompanion(H,new z(.3,-.34,0),.55),I.focusCamera(H),I.setZoom(38),await It(.25),await e([[i,"Daqui dá pra ver o parque inteiro."],[o,"E aquele pedacinho do rio ali atrás."]]),await It(.35),await e([[i,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[o,"Pronto. Subimos."]]),await It(.4),M.speed=J,I.focusCamera(null),I.releasePlayer(0,-17.6,0),I.releaseCompanion(-1.1,-17.9,0),I.lockPlayer(!1),Ft=!0,I.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},X_={[cc.id]:cc,[hh.id]:hh,[fh.id]:fh,[rh.id]:rh},j_=cc.id,Pd=document.getElementById("app");if(!Pd)throw new Error("#app nao encontrado");const aa=new u_(Pd,X_,I_,j_),$o=new URLSearchParams(location.search),Y_=$o.get("cena")??void 0,Z_=$o.get("entrada")??void 0;aa.start(Y_,Z_);const Qa=Number($o.get("zoom"));Number.isFinite(Qa)&&Qa>0&&aa.setZoom(Qa);const wo=$o.get("em")?.split(",").map(Number);if(wo&&wo.length===2&&wo.every(Number.isFinite)){const n=Number($o.get("olhar"));aa.debugPlace(wo[0],wo[1],Number.isFinite(n)?n:Math.PI/4)}window.jogo=aa;window.aristoryAudio={Musica:wd,CLIMAS:Gs,EFEITOS:Sd};window.aristoryItens=Object.fromEntries(Object.values(Qt).map(n=>[n.id,n]));window.aristoryMemorias=nc.map(n=>({id:n.id,titulo:n.titulo}));
