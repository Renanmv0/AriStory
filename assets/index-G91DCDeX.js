(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const tc="180",pu=0,bc=1,mu=2,ch=1,lh=2,Bn=3,Wn=0,$e=1,bn=2,oi=0,$i=1,Sc=2,wc=3,Ec=4,gu=5,Mi=100,vu=101,_u=102,xu=103,Mu=104,yu=200,bu=201,Su=202,wu=203,qa=204,Wa=205,Eu=206,Tu=207,Au=208,Cu=209,Pu=210,Ru=211,Iu=212,Lu=213,Du=214,Xa=0,ja=1,Ya=2,Qi=3,Za=4,Ja=5,$a=6,Ka=7,hh=0,Uu=1,Nu=2,ai=0,zu=1,Fu=2,Ou=3,Bu=4,ku=5,Vu=6,Hu=7,uh=300,ts=301,es=302,Qa=303,tr=304,Wo=306,er=1e3,bi=1001,nr=1002,je=1003,Gu=1004,Js=1005,Cn=1006,Qo=1007,Si=1008,Ln=1009,dh=1010,fh=1011,Ps=1012,ec=1013,Ei=1014,Vn=1015,Vs=1016,nc=1017,ic=1018,Rs=1020,ph=35902,mh=35899,gh=1021,vh=1022,En=1023,Is=1026,Ls=1027,sc=1028,oc=1029,_h=1030,ac=1031,rc=1033,Co=33776,Po=33777,Ro=33778,Io=33779,ir=35840,sr=35841,or=35842,ar=35843,rr=36196,cr=37492,lr=37496,hr=37808,ur=37809,dr=37810,fr=37811,pr=37812,mr=37813,gr=37814,vr=37815,_r=37816,xr=37817,Mr=37818,yr=37819,br=37820,Sr=37821,wr=36492,Er=36494,Tr=36495,Ar=36283,Cr=36284,Pr=36285,Rr=36286,qu=3200,Wu=3201,xh=0,Xu=1,ii="",nn="srgb",ns="srgb-linear",Fo="linear",ve="srgb",Ri=7680,Tc=519,ju=512,Yu=513,Zu=514,Mh=515,Ju=516,$u=517,Ku=518,Qu=519,Ac=35044,Cc="300 es",Pn=2e3,Oo=2001;class os{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const s=i[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const s=i.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}}const ze=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Pc=1234567;const ws=Math.PI/180,Ds=180/Math.PI;function Ci(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ze[n&255]+ze[n>>8&255]+ze[n>>16&255]+ze[n>>24&255]+"-"+ze[t&255]+ze[t>>8&255]+"-"+ze[t>>16&15|64]+ze[t>>24&255]+"-"+ze[e&63|128]+ze[e>>8&255]+"-"+ze[e>>16&255]+ze[e>>24&255]+ze[i&255]+ze[i>>8&255]+ze[i>>16&255]+ze[i>>24&255]).toLowerCase()}function ne(n,t,e){return Math.max(t,Math.min(e,n))}function cc(n,t){return(n%t+t)%t}function td(n,t,e,i,s){return i+(n-t)*(s-i)/(e-t)}function ed(n,t,e){return n!==t?(e-n)/(t-n):0}function Es(n,t,e){return(1-e)*n+e*t}function nd(n,t,e,i){return Es(n,t,1-Math.exp(-e*i))}function id(n,t=1){return t-Math.abs(cc(n,t*2)-t)}function sd(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function od(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function ad(n,t){return n+Math.floor(Math.random()*(t-n+1))}function rd(n,t){return n+Math.random()*(t-n)}function cd(n){return n*(.5-Math.random())}function ld(n){n!==void 0&&(Pc=n);let t=Pc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function hd(n){return n*ws}function ud(n){return n*Ds}function dd(n){return(n&n-1)===0&&n!==0}function fd(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function pd(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function md(n,t,e,i,s){const o=Math.cos,a=Math.sin,r=o(e/2),c=a(e/2),l=o((t+i)/2),h=a((t+i)/2),u=o((t-i)/2),d=a((t-i)/2),p=o((i-t)/2),g=a((i-t)/2);switch(s){case"XYX":n.set(r*h,c*u,c*d,r*l);break;case"YZY":n.set(c*d,r*h,c*u,r*l);break;case"ZXZ":n.set(c*u,c*d,r*h,r*l);break;case"XZX":n.set(r*h,c*g,c*p,r*l);break;case"YXY":n.set(c*p,r*h,c*g,r*l);break;case"ZYZ":n.set(c*g,c*p,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ji(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function qe(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const De={DEG2RAD:ws,RAD2DEG:Ds,generateUUID:Ci,clamp:ne,euclideanModulo:cc,mapLinear:td,inverseLerp:ed,lerp:Es,damp:nd,pingpong:id,smoothstep:sd,smootherstep:od,randInt:ad,randFloat:rd,randFloatSpread:cd,seededRandom:ld,degToRad:hd,radToDeg:ud,isPowerOfTwo:dd,ceilPowerOfTwo:fd,floorPowerOfTwo:pd,setQuaternionFromProperEuler:md,normalize:qe,denormalize:ji};class Tt{constructor(t=0,e=0){Tt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),s=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*i-a*s+t.x,this.y=o*s+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class as{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,o,a,r){let c=i[s+0],l=i[s+1],h=i[s+2],u=i[s+3];const d=o[a+0],p=o[a+1],g=o[a+2],v=o[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==p||h!==g){let m=1-r;const f=c*d+l*p+h*g+u*v,w=f>=0?1:-1,M=1-f*f;if(M>Number.EPSILON){const C=Math.sqrt(M),P=Math.atan2(C,f*w);m=Math.sin(m*P)/C,r=Math.sin(r*P)/C}const x=r*w;if(c=c*m+d*x,l=l*m+p*x,h=h*m+g*x,u=u*m+v*x,m===1-r){const C=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=C,l*=C,h*=C,u*=C}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,i,s,o,a){const r=i[s],c=i[s+1],l=i[s+2],h=i[s+3],u=o[a],d=o[a+1],p=o[a+2],g=o[a+3];return t[e]=r*g+h*u+c*p-l*d,t[e+1]=c*g+h*d+l*u-r*p,t[e+2]=l*g+h*p+r*d-c*u,t[e+3]=h*g-r*u-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,s=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(s/2),u=r(o/2),d=c(i/2),p=c(s/2),g=c(o/2);switch(a){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],s=e[4],o=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=i+r+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(o-l)*p,this._z=(a-s)*p}else if(i>r&&i>u){const p=2*Math.sqrt(1+i-r-u);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(o+l)/p}else if(r>u){const p=2*Math.sqrt(1+r-i-u);this._w=(o-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-i-r);this._w=(a-s)/p,this._x=(o+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,s=t._y,o=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*r+s*l-o*c,this._y=s*h+a*c+o*r-i*l,this._z=o*h+a*l+i*c-s*r,this._w=a*h-i*r-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,s=this._y,o=this._z,a=this._w;let r=a*t._w+i*t._x+s*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=s,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const p=1-e;return this._w=p*a+e*this._w,this._x=p*i+e*this._x,this._y=p*s+e*this._y,this._z=p*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=i*u+this._x*d,this._y=s*u+this._y*d,this._z=o*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),o=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,i=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Rc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Rc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6]*s,this.y=o[1]*e+o[4]*i+o[7]*s,this.z=o[2]*e+o[5]*i+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=t.elements,a=1/(o[3]*e+o[7]*i+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*i+o[8]*s+o[12])*a,this.y=(o[1]*e+o[5]*i+o[9]*s+o[13])*a,this.z=(o[2]*e+o[6]*i+o[10]*s+o[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,s=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*s-r*i),h=2*(r*e-o*s),u=2*(o*i-a*e);return this.x=e+c*l+a*u-r*h,this.y=i+c*h+r*l-o*u,this.z=s+c*u+o*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s,this.y=o[1]*e+o[5]*i+o[9]*s,this.z=o[2]*e+o[6]*i+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,s=t.y,o=t.z,a=e.x,r=e.y,c=e.z;return this.x=s*c-o*r,this.y=o*a-i*c,this.z=i*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ta.copy(this).projectOnVector(t),this.sub(ta)}reflect(t){return this.sub(ta.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(ne(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ta=new N,Rc=new as;class Kt{constructor(t,e,i,s,o,a,r,c,l){Kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l)}set(t,e,i,s,o,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=o,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[3],c=i[6],l=i[1],h=i[4],u=i[7],d=i[2],p=i[5],g=i[8],v=s[0],m=s[3],f=s[6],w=s[1],M=s[4],x=s[7],C=s[2],P=s[5],I=s[8];return o[0]=a*v+r*w+c*C,o[3]=a*m+r*M+c*P,o[6]=a*f+r*x+c*I,o[1]=l*v+h*w+u*C,o[4]=l*m+h*M+u*P,o[7]=l*f+h*x+u*I,o[2]=d*v+p*w+g*C,o[5]=d*m+p*M+g*P,o[8]=d*f+p*x+g*I,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-i*o*h+i*r*c+s*o*l-s*a*c}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,d=r*c-h*o,p=l*o-a*c,g=e*u+i*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*i)*v,t[2]=(r*i-s*a)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*o-r*e)*v,t[6]=p*v,t[7]=(i*c-l*e)*v,t[8]=(a*e-i*o)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,o,a,r){const c=Math.cos(o),l=Math.sin(o);return this.set(i*c,i*l,-i*(c*a+l*r)+a+t,-s*l,s*c,-s*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(ea.makeScale(t,e)),this}rotate(t){return this.premultiply(ea.makeRotation(-t)),this}translate(t,e){return this.premultiply(ea.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const ea=new Kt;function yh(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Bo(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function gd(){const n=Bo("canvas");return n.style.display="block",n}const Ic={};function Us(n){n in Ic||(Ic[n]=!0,console.warn(n))}function vd(n,t,e){return new Promise(function(i,s){function o(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:i()}}setTimeout(o,e)})}const Lc=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Dc=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function _d(){const n={enabled:!0,workingColorSpace:ns,spaces:{},convert:function(s,o,a){return this.enabled===!1||o===a||!o||!a||(this.spaces[o].transfer===ve&&(s.r=Gn(s.r),s.g=Gn(s.g),s.b=Gn(s.b)),this.spaces[o].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[o].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(s.r=Ki(s.r),s.g=Ki(s.g),s.b=Ki(s.b))),s},workingToColorSpace:function(s,o){return this.convert(s,this.workingColorSpace,o)},colorSpaceToWorking:function(s,o){return this.convert(s,o,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ii?Fo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,o=this.workingColorSpace){return s.fromArray(this.spaces[o].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,o,a){return s.copy(this.spaces[o].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,o){return Us("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,o)},toWorkingColorSpace:function(s,o){return Us("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,o)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[ns]:{primaries:t,whitePoint:i,transfer:Fo,toXYZ:Lc,fromXYZ:Dc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:t,whitePoint:i,transfer:ve,toXYZ:Lc,fromXYZ:Dc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}}),n}const de=_d();function Gn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Ki(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ii;class xd{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ii===void 0&&(Ii=Bo("canvas")),Ii.width=t.width,Ii.height=t.height;const s=Ii.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=Ii}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Bo("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const s=i.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=Gn(o[a]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Gn(e[i]/255)*255):e[i]=Gn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Md=0;class lc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Md++}),this.uuid=Ci(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(na(s[a].image)):o.push(na(s[a]))}else o=na(s);i.url=o}return e||(t.images[this.uuid]=i),i}}function na(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?xd.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let yd=0;const ia=new N;class Be extends os{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,i=bi,s=bi,o=Cn,a=Si,r=En,c=Ln,l=Be.DEFAULT_ANISOTROPY,h=ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yd++}),this.uuid=Ci(),this.name="",this.source=new lc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Tt(0,0),this.repeat=new Tt(1,1),this.center=new Tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(ia).x}get height(){return this.source.getSize(ia).y}get depth(){return this.source.getSize(ia).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==uh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case er:t.x=t.x-Math.floor(t.x);break;case bi:t.x=t.x<0?0:1;break;case nr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case er:t.y=t.y-Math.floor(t.y);break;case bi:t.y=t.y<0?0:1;break;case nr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=uh;Be.DEFAULT_ANISOTROPY=1;class Ee{constructor(t=0,e=0,i=0,s=1){Ee.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*s+a[12]*o,this.y=a[1]*e+a[5]*i+a[9]*s+a[13]*o,this.z=a[2]*e+a[6]*i+a[10]*s+a[14]*o,this.w=a[3]*e+a[7]*i+a[11]*s+a[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],v=c[2],m=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+p+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,x=(p+1)/2,C=(f+1)/2,P=(h+d)/4,I=(u+v)/4,T=(g+m)/4;return M>x&&M>C?M<.01?(i=0,s=.707106781,o=.707106781):(i=Math.sqrt(M),s=P/i,o=I/i):x>C?x<.01?(i=.707106781,s=0,o=.707106781):(s=Math.sqrt(x),i=P/s,o=T/s):C<.01?(i=.707106781,s=.707106781,o=0):(o=Math.sqrt(C),i=I/o,s=T/o),this.set(i,s,o,e),this}let w=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(w)<.001&&(w=1),this.x=(m-g)/w,this.y=(u-v)/w,this.z=(d-h)/w,this.w=Math.acos((l+p+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(ne(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class bd extends os{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Ee(0,0,t,e),this.scissorTest=!1,this.viewport=new Ee(0,0,t,e);const s={width:t,height:e,depth:i.depth},o=new Be(s);this.textures=[];const a=i.count;for(let r=0;r<a;r++)this.textures[r]=o.clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Cn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new lc(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ti extends bd{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class bh extends Be{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Sd extends Be{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=je,this.minFilter=je,this.wrapR=bi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class rs{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(mn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(mn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=mn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const o=i.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,mn):mn.fromBufferAttribute(o,a),mn.applyMatrix4(t.matrixWorld),this.expandByPoint(mn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),$s.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),$s.copy(i.boundingBox)),$s.applyMatrix4(t.matrixWorld),this.union($s)}const s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,mn),mn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ps),Ks.subVectors(this.max,ps),Li.subVectors(t.a,ps),Di.subVectors(t.b,ps),Ui.subVectors(t.c,ps),Jn.subVectors(Di,Li),$n.subVectors(Ui,Di),ui.subVectors(Li,Ui);let e=[0,-Jn.z,Jn.y,0,-$n.z,$n.y,0,-ui.z,ui.y,Jn.z,0,-Jn.x,$n.z,0,-$n.x,ui.z,0,-ui.x,-Jn.y,Jn.x,0,-$n.y,$n.x,0,-ui.y,ui.x,0];return!sa(e,Li,Di,Ui,Ks)||(e=[1,0,0,0,1,0,0,0,1],!sa(e,Li,Di,Ui,Ks))?!1:(Qs.crossVectors(Jn,$n),e=[Qs.x,Qs.y,Qs.z],sa(e,Li,Di,Ui,Ks))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,mn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(mn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Un[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Un[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Un[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Un[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Un[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Un[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Un[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Un[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Un),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Un=[new N,new N,new N,new N,new N,new N,new N,new N],mn=new N,$s=new rs,Li=new N,Di=new N,Ui=new N,Jn=new N,$n=new N,ui=new N,ps=new N,Ks=new N,Qs=new N,di=new N;function sa(n,t,e,i,s){for(let o=0,a=n.length-3;o<=a;o+=3){di.fromArray(n,o);const r=s.x*Math.abs(di.x)+s.y*Math.abs(di.y)+s.z*Math.abs(di.z),c=t.dot(di),l=e.dot(di),h=i.dot(di);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const wd=new rs,ms=new N,oa=new N;class Xo{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):wd.setFromPoints(t).getCenter(i);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,i.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ms.subVectors(t,this.center);const e=ms.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(ms,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(oa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ms.copy(t.center).add(oa)),this.expandByPoint(ms.copy(t.center).sub(oa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Nn=new N,aa=new N,to=new N,Kn=new N,ra=new N,eo=new N,ca=new N;class Sh{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Nn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Nn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Nn.copy(this.origin).addScaledVector(this.direction,e),Nn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){aa.copy(t).add(e).multiplyScalar(.5),to.copy(e).sub(t).normalize(),Kn.copy(this.origin).sub(aa);const o=t.distanceTo(e)*.5,a=-this.direction.dot(to),r=Kn.dot(this.direction),c=-Kn.dot(to),l=Kn.lengthSq(),h=Math.abs(1-a*a);let u,d,p,g;if(h>0)if(u=a*c-r,d=a*r-c,g=o*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,p=u*(u+a*d+2*r)+d*(a*u+d+2*c)+l}else d=o,u=Math.max(0,-(a*d+r)),p=-u*u+d*(d+2*c)+l;else d=-o,u=Math.max(0,-(a*d+r)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*o+r)),d=u>0?-o:Math.min(Math.max(-o,-c),o),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-o,-c),o),p=d*(d+2*c)+l):(u=Math.max(0,-(a*o+r)),d=u>0?o:Math.min(Math.max(-o,-c),o),p=-u*u+d*(d+2*c)+l);else d=a>0?-o:o,u=Math.max(0,-(a*d+r)),p=-u*u+d*(d+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(aa).addScaledVector(to,d),p}intersectSphere(t,e){Nn.subVectors(t.center,this.origin);const i=Nn.dot(this.direction),s=Nn.dot(Nn)-i*i,o=t.radius*t.radius;if(s>o)return null;const a=Math.sqrt(o-s),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,o,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(i=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(i=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(o=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(o=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),i>a||o>s||((o>i||isNaN(i))&&(i=o),(a<s||isNaN(s))&&(s=a),u>=0?(r=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),i>c||r>s)||((r>i||i!==i)&&(i=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Nn)!==null}intersectTriangle(t,e,i,s,o){ra.subVectors(e,t),eo.subVectors(i,t),ca.crossVectors(ra,eo);let a=this.direction.dot(ca),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;Kn.subVectors(this.origin,t);const c=r*this.direction.dot(eo.crossVectors(Kn,eo));if(c<0)return null;const l=r*this.direction.dot(ra.cross(Kn));if(l<0||c+l>a)return null;const h=-r*Kn.dot(ca);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class we{constructor(t,e,i,s,o,a,r,c,l,h,u,d,p,g,v,m){we.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,o,a,r,c,l,h,u,d,p,g,v,m)}set(t,e,i,s,o,a,r,c,l,h,u,d,p,g,v,m){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=s,f[1]=o,f[5]=a,f[9]=r,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=p,f[7]=g,f[11]=v,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new we().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,s=1/Ni.setFromMatrixColumn(t,0).length(),o=1/Ni.setFromMatrixColumn(t,1).length(),a=1/Ni.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*o,e[5]=i[5]*o,e[6]=i[6]*o,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,s=t.y,o=t.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const d=a*h,p=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=d-v*l,e[9]=-r*c,e[2]=v-d*l,e[6]=g+p*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,p=c*u,g=l*h,v=l*u;e[0]=d+v*r,e[4]=g*r-p,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=p*r-g,e[6]=v+d*r,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,p=c*u,g=l*h,v=l*u;e[0]=d-v*r,e[4]=-a*u,e[8]=g+p*r,e[1]=p+g*r,e[5]=a*h,e[9]=v-d*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,p=a*u,g=r*h,v=r*u;e[0]=c*h,e[4]=g*l-p,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=p*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,p=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+p,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=p*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=a*c,p=a*l,g=r*c,v=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=a*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=r*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ed,t,Td)}lookAt(t,e,i){const s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),Qn.crossVectors(i,Qe),Qn.lengthSq()===0&&(Math.abs(i.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),Qn.crossVectors(i,Qe)),Qn.normalize(),no.crossVectors(Qe,Qn),s[0]=Qn.x,s[4]=no.x,s[8]=Qe.x,s[1]=Qn.y,s[5]=no.y,s[9]=Qe.y,s[2]=Qn.z,s[6]=no.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,s=e.elements,o=this.elements,a=i[0],r=i[4],c=i[8],l=i[12],h=i[1],u=i[5],d=i[9],p=i[13],g=i[2],v=i[6],m=i[10],f=i[14],w=i[3],M=i[7],x=i[11],C=i[15],P=s[0],I=s[4],T=s[8],b=s[12],_=s[1],D=s[5],z=s[9],B=s[13],V=s[2],H=s[6],J=s[10],st=s[14],$=s[3],at=s[7],Z=s[11],yt=s[15];return o[0]=a*P+r*_+c*V+l*$,o[4]=a*I+r*D+c*H+l*at,o[8]=a*T+r*z+c*J+l*Z,o[12]=a*b+r*B+c*st+l*yt,o[1]=h*P+u*_+d*V+p*$,o[5]=h*I+u*D+d*H+p*at,o[9]=h*T+u*z+d*J+p*Z,o[13]=h*b+u*B+d*st+p*yt,o[2]=g*P+v*_+m*V+f*$,o[6]=g*I+v*D+m*H+f*at,o[10]=g*T+v*z+m*J+f*Z,o[14]=g*b+v*B+m*st+f*yt,o[3]=w*P+M*_+x*V+C*$,o[7]=w*I+M*D+x*H+C*at,o[11]=w*T+M*z+x*J+C*Z,o[15]=w*b+M*B+x*st+C*yt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],s=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],v=t[7],m=t[11],f=t[15];return g*(+o*c*u-s*l*u-o*r*d+i*l*d+s*r*p-i*c*p)+v*(+e*c*p-e*l*d+o*a*d-s*a*p+s*l*h-o*c*h)+m*(+e*l*u-e*r*p-o*a*u+i*a*p+o*r*h-i*l*h)+f*(-s*r*h-e*c*u+e*r*d+s*a*u-i*a*d+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],v=t[13],m=t[14],f=t[15],w=u*m*l-v*d*l+v*c*p-r*m*p-u*c*f+r*d*f,M=g*d*l-h*m*l-g*c*p+a*m*p+h*c*f-a*d*f,x=h*v*l-g*u*l+g*r*p-a*v*p-h*r*f+a*u*f,C=g*u*c-h*v*c-g*r*d+a*v*d+h*r*m-a*u*m,P=e*w+i*M+s*x+o*C;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/P;return t[0]=w*I,t[1]=(v*d*o-u*m*o-v*s*p+i*m*p+u*s*f-i*d*f)*I,t[2]=(r*m*o-v*c*o+v*s*l-i*m*l-r*s*f+i*c*f)*I,t[3]=(u*c*o-r*d*o-u*s*l+i*d*l+r*s*p-i*c*p)*I,t[4]=M*I,t[5]=(h*m*o-g*d*o+g*s*p-e*m*p-h*s*f+e*d*f)*I,t[6]=(g*c*o-a*m*o-g*s*l+e*m*l+a*s*f-e*c*f)*I,t[7]=(a*d*o-h*c*o+h*s*l-e*d*l-a*s*p+e*c*p)*I,t[8]=x*I,t[9]=(g*u*o-h*v*o-g*i*p+e*v*p+h*i*f-e*u*f)*I,t[10]=(a*v*o-g*r*o+g*i*l-e*v*l-a*i*f+e*r*f)*I,t[11]=(h*r*o-a*u*o-h*i*l+e*u*l+a*i*p-e*r*p)*I,t[12]=C*I,t[13]=(h*v*s-g*u*s+g*i*d-e*v*d-h*i*m+e*u*m)*I,t[14]=(g*r*s-a*v*s-g*i*c+e*v*c+a*i*m-e*r*m)*I,t[15]=(a*u*s-h*r*s+h*i*c-e*u*c-a*i*d+e*r*d)*I,this}scale(t){const e=this.elements,i=t.x,s=t.y,o=t.z;return e[0]*=i,e[4]*=s,e[8]*=o,e[1]*=i,e[5]*=s,e[9]*=o,e[2]*=i,e[6]*=s,e[10]*=o,e[3]*=i,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),s=Math.sin(e),o=1-i,a=t.x,r=t.y,c=t.z,l=o*a,h=o*r;return this.set(l*a+i,l*r-s*c,l*c+s*r,0,l*r+s*c,h*r+i,h*c-s*a,0,l*c-s*r,h*c+s*a,o*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,o,a){return this.set(1,i,o,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){const s=this.elements,o=e._x,a=e._y,r=e._z,c=e._w,l=o+o,h=a+a,u=r+r,d=o*l,p=o*h,g=o*u,v=a*h,m=a*u,f=r*u,w=c*l,M=c*h,x=c*u,C=i.x,P=i.y,I=i.z;return s[0]=(1-(v+f))*C,s[1]=(p+x)*C,s[2]=(g-M)*C,s[3]=0,s[4]=(p-x)*P,s[5]=(1-(d+f))*P,s[6]=(m+w)*P,s[7]=0,s[8]=(g+M)*I,s[9]=(m-w)*I,s[10]=(1-(d+v))*I,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){const s=this.elements;let o=Ni.set(s[0],s[1],s[2]).length();const a=Ni.set(s[4],s[5],s[6]).length(),r=Ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],gn.copy(this);const l=1/o,h=1/a,u=1/r;return gn.elements[0]*=l,gn.elements[1]*=l,gn.elements[2]*=l,gn.elements[4]*=h,gn.elements[5]*=h,gn.elements[6]*=h,gn.elements[8]*=u,gn.elements[9]*=u,gn.elements[10]*=u,e.setFromRotationMatrix(gn),i.x=o,i.y=a,i.z=r,this}makePerspective(t,e,i,s,o,a,r=Pn,c=!1){const l=this.elements,h=2*o/(e-t),u=2*o/(i-s),d=(e+t)/(e-t),p=(i+s)/(i-s);let g,v;if(c)g=o/(a-o),v=a*o/(a-o);else if(r===Pn)g=-(a+o)/(a-o),v=-2*a*o/(a-o);else if(r===Oo)g=-a/(a-o),v=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,s,o,a,r=Pn,c=!1){const l=this.elements,h=2/(e-t),u=2/(i-s),d=-(e+t)/(e-t),p=-(i+s)/(i-s);let g,v;if(c)g=1/(a-o),v=a/(a-o);else if(r===Pn)g=-2/(a-o),v=-(a+o)/(a-o);else if(r===Oo)g=-1/(a-o),v=-o/(a-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Ni=new N,gn=new we,Ed=new N(0,0,0),Td=new N(1,1,1),Qn=new N,no=new N,Qe=new N,Uc=new we,Nc=new as;class Xn{constructor(t=0,e=0,i=0,s=Xn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const s=t.elements,o=s[0],a=s[4],r=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],p=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,p));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Uc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Uc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Nc.setFromEuler(this),this.setFromQuaternion(Nc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xn.DEFAULT_ORDER="XYZ";class wh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ad=0;const zc=new N,zi=new as,zn=new we,io=new N,gs=new N,Cd=new N,Pd=new as,Fc=new N(1,0,0),Oc=new N(0,1,0),Bc=new N(0,0,1),kc={type:"added"},Rd={type:"removed"},Fi={type:"childadded",child:null},la={type:"childremoved",child:null};class ye extends os{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ad++}),this.uuid=Ci(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ye.DEFAULT_UP.clone();const t=new N,e=new Xn,i=new as,s=new N(1,1,1);function o(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(o),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new we},normalMatrix:{value:new Kt}}),this.matrix=new we,this.matrixWorld=new we,this.matrixAutoUpdate=ye.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return zi.setFromAxisAngle(t,e),this.quaternion.multiply(zi),this}rotateOnWorldAxis(t,e){return zi.setFromAxisAngle(t,e),this.quaternion.premultiply(zi),this}rotateX(t){return this.rotateOnAxis(Fc,t)}rotateY(t){return this.rotateOnAxis(Oc,t)}rotateZ(t){return this.rotateOnAxis(Bc,t)}translateOnAxis(t,e){return zc.copy(t).applyQuaternion(this.quaternion),this.position.add(zc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Fc,t)}translateY(t){return this.translateOnAxis(Oc,t)}translateZ(t){return this.translateOnAxis(Bc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(zn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?io.copy(t):io.set(t,e,i);const s=this.parent;this.updateWorldMatrix(!0,!1),gs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?zn.lookAt(gs,io,this.up):zn.lookAt(io,gs,this.up),this.quaternion.setFromRotationMatrix(zn),s&&(zn.extractRotation(s.matrixWorld),zi.setFromRotationMatrix(zn),this.quaternion.premultiply(zi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(kc),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Rd),la.child=t,this.dispatchEvent(la),la.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),zn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),zn.multiply(t.parent.matrixWorld)),t.applyMatrix4(zn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(kc),Fi.child=t,this.dispatchEvent(Fi),Fi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,t,Cd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(gs,Pd,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(r=>({...r})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));s.material=r}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(o(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),p=a(t.animations),g=a(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=s,i;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const s=t.children[i];this.add(s.clone())}return this}}ye.DEFAULT_UP=new N(0,1,0);ye.DEFAULT_MATRIX_AUTO_UPDATE=!0;ye.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const vn=new N,Fn=new N,ha=new N,On=new N,Oi=new N,Bi=new N,Vc=new N,ua=new N,da=new N,fa=new N,pa=new Ee,ma=new Ee,ga=new Ee;class Sn{constructor(t=new N,e=new N,i=new N){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),vn.subVectors(t,e),s.cross(vn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,i,s,o){vn.subVectors(s,e),Fn.subVectors(i,e),ha.subVectors(t,e);const a=vn.dot(vn),r=vn.dot(Fn),c=vn.dot(ha),l=Fn.dot(Fn),h=Fn.dot(ha),u=a*l-r*r;if(u===0)return o.set(0,0,0),null;const d=1/u,p=(l*c-r*h)*d,g=(a*h-r*c)*d;return o.set(1-p-g,g,p)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(t,e,i,s,o,a,r,c){return this.getBarycoord(t,e,i,s,On)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,On.x),c.addScaledVector(a,On.y),c.addScaledVector(r,On.z),c)}static getInterpolatedAttribute(t,e,i,s,o,a){return pa.setScalar(0),ma.setScalar(0),ga.setScalar(0),pa.fromBufferAttribute(t,e),ma.fromBufferAttribute(t,i),ga.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(pa,o.x),a.addScaledVector(ma,o.y),a.addScaledVector(ga,o.z),a}static isFrontFacing(t,e,i,s){return vn.subVectors(i,e),Fn.subVectors(t,e),vn.cross(Fn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return vn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),vn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Sn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Sn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,o){return Sn.getInterpolation(t,this.a,this.b,this.c,e,i,s,o)}containsPoint(t){return Sn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Sn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,s=this.b,o=this.c;let a,r;Oi.subVectors(s,i),Bi.subVectors(o,i),ua.subVectors(t,i);const c=Oi.dot(ua),l=Bi.dot(ua);if(c<=0&&l<=0)return e.copy(i);da.subVectors(t,s);const h=Oi.dot(da),u=Bi.dot(da);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(Oi,a);fa.subVectors(t,o);const p=Oi.dot(fa),g=Bi.dot(fa);if(g>=0&&p<=g)return e.copy(o);const v=p*l-c*g;if(v<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(Bi,r);const m=h*g-p*u;if(m<=0&&u-h>=0&&p-g>=0)return Vc.subVectors(o,s),r=(u-h)/(u-h+(p-g)),e.copy(s).addScaledVector(Vc,r);const f=1/(m+v+d);return a=v*f,r=d*f,e.copy(i).addScaledVector(Oi,a).addScaledVector(Bi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Eh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ti={h:0,s:0,l:0},so={h:0,s:0,l:0};function va(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class ae{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=i,de.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=de.workingColorSpace){if(t=cc(t,1),e=ne(e,0,1),i=ne(i,0,1),e===0)this.r=this.g=this.b=i;else{const o=i<=.5?i*(1+e):i+e-i*e,a=2*i-o;this.r=va(a,o,t+1/3),this.g=va(a,o,t),this.b=va(a,o,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=nn){function i(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const i=Eh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Gn(t.r),this.g=Gn(t.g),this.b=Gn(t.b),this}copyLinearToSRGB(t){return this.r=Ki(t.r),this.g=Ki(t.g),this.b=Ki(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return de.workingToColorSpace(Fe.copy(this),t),Math.round(ne(Fe.r*255,0,255))*65536+Math.round(ne(Fe.g*255,0,255))*256+Math.round(ne(Fe.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(Fe.copy(this),e);const i=Fe.r,s=Fe.g,o=Fe.b,a=Math.max(i,s,o),r=Math.min(i,s,o);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case i:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-i)/u+2;break;case o:c=(i-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=nn){de.workingToColorSpace(Fe.copy(this),t);const e=Fe.r,i=Fe.g,s=Fe.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(ti),this.setHSL(ti.h+t,ti.s+e,ti.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ti),t.getHSL(so);const i=Es(ti.h,so.h,e),s=Es(ti.s,so.s,e),o=Es(ti.l,so.l,e);return this.setHSL(i,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*i+o[6]*s,this.g=o[1]*e+o[4]*i+o[7]*s,this.b=o[2]*e+o[5]*i+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new ae;ae.NAMES=Eh;let Id=0;class cs extends os{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Id++}),this.uuid=Ci(),this.name="",this.type="Material",this.blending=$i,this.side=Wn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qa,this.blendDst=Wa,this.blendEquation=Mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=Qi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Tc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ri,this.stencilZFail=Ri,this.stencilZPass=Ri,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==$i&&(i.blending=this.blending),this.side!==Wn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==qa&&(i.blendSrc=this.blendSrc),this.blendDst!==Wa&&(i.blendDst=this.blendDst),this.blendEquation!==Mi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Qi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Tc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ri&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Ri&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Ri&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(e){const o=s(t.textures),a=s(t.images);o.length>0&&(i.textures=o),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const s=e.length;i=new Array(s);for(let o=0;o!==s;++o)i[o]=e[o].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class jo extends cs{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Xn,this.combine=hh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Te=new N,oo=new Tt;let Ld=0;class In{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ld++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Ac,this.updateRanges=[],this.gpuType=Vn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)oo.fromBufferAttribute(this,e),oo.applyMatrix3(t),this.setXY(e,oo.x,oo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix3(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=ji(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=qe(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ji(e,this.array)),e}setX(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ji(e,this.array)),e}setY(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ji(e,this.array)),e}setZ(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ji(e,this.array)),e}setW(t,e){return this.normalized&&(e=qe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),i=qe(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),i=qe(i,this.array),s=qe(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,o){return t*=this.itemSize,this.normalized&&(e=qe(e,this.array),i=qe(i,this.array),s=qe(s,this.array),o=qe(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ac&&(t.usage=this.usage),t}}class Th extends In{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Ah extends In{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class re extends In{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Dd=0;const cn=new we,_a=new ye,ki=new N,tn=new rs,vs=new rs,Re=new N;class Ie extends os{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dd++}),this.uuid=Ci(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(yh(t)?Ah:Th)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const o=new Kt().getNormalMatrix(t);i.applyNormalMatrix(o),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return cn.makeRotationFromQuaternion(t),this.applyMatrix4(cn),this}rotateX(t){return cn.makeRotationX(t),this.applyMatrix4(cn),this}rotateY(t){return cn.makeRotationY(t),this.applyMatrix4(cn),this}rotateZ(t){return cn.makeRotationZ(t),this.applyMatrix4(cn),this}translate(t,e,i){return cn.makeTranslation(t,e,i),this.applyMatrix4(cn),this}scale(t,e,i){return cn.makeScale(t,e,i),this.applyMatrix4(cn),this}lookAt(t){return _a.lookAt(t),_a.updateMatrix(),this.applyMatrix4(_a.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ki).negate(),this.translate(ki.x,ki.y,ki.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let s=0,o=t.length;s<o;s++){const a=t[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new re(i,3))}else{const i=Math.min(t.length,e.count);for(let s=0;s<i;s++){const o=t[s];e.setXYZ(s,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new rs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){const o=e[i];tn.setFromBufferAttribute(o),this.morphTargetsRelative?(Re.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Re),Re.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Re)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Xo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const i=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];vs.setFromBufferAttribute(r),this.morphTargetsRelative?(Re.addVectors(tn.min,vs.min),tn.expandByPoint(Re),Re.addVectors(tn.max,vs.max),tn.expandByPoint(Re)):(tn.expandByPoint(vs.min),tn.expandByPoint(vs.max))}tn.getCenter(i);let s=0;for(let o=0,a=t.count;o<a;o++)Re.fromBufferAttribute(t,o),s=Math.max(s,i.distanceToSquared(Re));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)Re.fromBufferAttribute(r,l),c&&(ki.fromBufferAttribute(t,l),Re.add(ki)),s=Math.max(s,i.distanceToSquared(Re))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new In(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),r=[],c=[];for(let T=0;T<i.count;T++)r[T]=new N,c[T]=new N;const l=new N,h=new N,u=new N,d=new Tt,p=new Tt,g=new Tt,v=new N,m=new N;function f(T,b,_){l.fromBufferAttribute(i,T),h.fromBufferAttribute(i,b),u.fromBufferAttribute(i,_),d.fromBufferAttribute(o,T),p.fromBufferAttribute(o,b),g.fromBufferAttribute(o,_),h.sub(l),u.sub(l),p.sub(d),g.sub(d);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(D),m.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(D),r[T].add(v),r[b].add(v),r[_].add(v),c[T].add(m),c[b].add(m),c[_].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let T=0,b=w.length;T<b;++T){const _=w[T],D=_.start,z=_.count;for(let B=D,V=D+z;B<V;B+=3)f(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const M=new N,x=new N,C=new N,P=new N;function I(T){C.fromBufferAttribute(s,T),P.copy(C);const b=r[T];M.copy(b),M.sub(C.multiplyScalar(C.dot(b))).normalize(),x.crossVectors(P,b);const D=x.dot(c[T])<0?-1:1;a.setXYZW(T,M.x,M.y,M.z,D)}for(let T=0,b=w.length;T<b;++T){const _=w[T],D=_.start,z=_.count;for(let B=D,V=D+z;B<V;B+=3)I(t.getX(B+0)),I(t.getX(B+1)),I(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new In(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const s=new N,o=new N,a=new N,r=new N,c=new N,l=new N,h=new N,u=new N;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,v),a.fromBufferAttribute(e,m),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,v),l.fromBufferAttribute(i,m),r.add(h),c.add(h),l.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(v,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)s.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Re.fromBufferAttribute(t,e),Re.normalize(),t.setXYZ(e,Re.x,Re.y,Re.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,d=new l.constructor(c.length*h);let p=0,g=0;for(let v=0,m=c.length;v<m;v++){r.isInterleavedBufferAttribute?p=c[v]*r.data.stride+r.offset:p=c[v]*h;for(let f=0;f<h;f++)d[g++]=l[p++]}return new In(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,i=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,i);e.setAttribute(r,l)}const o=this.morphAttributes;for(const r in o){const c=[],l=o[r];for(let h=0,u=l.length;h<u;h++){const d=l[h],p=t(d,i);c.push(p)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Hc=new we,fi=new Sh,ao=new Xo,Gc=new N,ro=new N,co=new N,lo=new N,xa=new N,ho=new N,qc=new N,uo=new N;class y extends ye{constructor(t=new Ie,e=new jo){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const i=this.geometry,s=i.attributes.position,o=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(o&&r){ho.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=r[c],u=o[c];h!==0&&(xa.fromBufferAttribute(u,t),a?ho.addScaledVector(xa,h):ho.addScaledVector(xa.sub(e),h))}e.add(ho)}return e}raycast(t,e){const i=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ao.copy(i.boundingSphere),ao.applyMatrix4(o),fi.copy(t.ray).recast(t.near),!(ao.containsPoint(fi.origin)===!1&&(fi.intersectSphere(ao,Gc)===null||fi.origin.distanceToSquared(Gc)>(t.far-t.near)**2))&&(Hc.copy(o).invert(),fi.copy(t.ray).applyMatrix4(Hc),!(i.boundingBox!==null&&fi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,fi)))}_computeIntersections(t,e,i){let s;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,d=o.groups,p=o.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],w=Math.max(m.start,p.start),M=Math.min(r.count,Math.min(m.start+m.count,p.start+p.count));for(let x=w,C=M;x<C;x+=3){const P=r.getX(x),I=r.getX(x+1),T=r.getX(x+2);s=fo(this,f,t,i,l,h,u,P,I,T),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(r.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const w=r.getX(m),M=r.getX(m+1),x=r.getX(m+2);s=fo(this,a,t,i,l,h,u,w,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,v=d.length;g<v;g++){const m=d[g],f=a[m.materialIndex],w=Math.max(m.start,p.start),M=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let x=w,C=M;x<C;x+=3){const P=x,I=x+1,T=x+2;s=fo(this,f,t,i,l,h,u,P,I,T),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,p.start),v=Math.min(c.count,p.start+p.count);for(let m=g,f=v;m<f;m+=3){const w=m,M=m+1,x=m+2;s=fo(this,a,t,i,l,h,u,w,M,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function Ud(n,t,e,i,s,o,a,r){let c;if(t.side===$e?c=i.intersectTriangle(a,o,s,!0,r):c=i.intersectTriangle(s,o,a,t.side===Wn,r),c===null)return null;uo.copy(r),uo.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(uo);return l<e.near||l>e.far?null:{distance:l,point:uo.clone(),object:n}}function fo(n,t,e,i,s,o,a,r,c,l){n.getVertexPosition(r,ro),n.getVertexPosition(c,co),n.getVertexPosition(l,lo);const h=Ud(n,t,e,i,ro,co,lo,qc);if(h){const u=new N;Sn.getBarycoord(qc,ro,co,lo,u),s&&(h.uv=Sn.getInterpolatedAttribute(s,r,c,l,u,new Tt)),o&&(h.uv1=Sn.getInterpolatedAttribute(o,r,c,l,u,new Tt)),a&&(h.normal=Sn.getInterpolatedAttribute(a,r,c,l,u,new N),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:c,c:l,normal:new N,materialIndex:0};Sn.getNormal(ro,co,lo,d.normal),h.face=d,h.barycoord=u}return h}class G extends Ie{constructor(t=1,e=1,i=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:o,depthSegments:a};const r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,i,e,t,a,o,0),g("z","y","x",1,-1,i,e,-t,a,o,1),g("x","z","y",1,1,t,i,e,s,a,2),g("x","z","y",1,-1,t,i,-e,s,a,3),g("x","y","z",1,-1,t,e,i,s,o,4),g("x","y","z",-1,-1,t,e,-i,s,o,5),this.setIndex(c),this.setAttribute("position",new re(l,3)),this.setAttribute("normal",new re(h,3)),this.setAttribute("uv",new re(u,2));function g(v,m,f,w,M,x,C,P,I,T,b){const _=x/I,D=C/T,z=x/2,B=C/2,V=P/2,H=I+1,J=T+1;let st=0,$=0;const at=new N;for(let Z=0;Z<J;Z++){const yt=Z*D-B;for(let Wt=0;Wt<H;Wt++){const te=Wt*_-z;at[v]=te*w,at[m]=yt*M,at[f]=V,l.push(at.x,at.y,at.z),at[v]=0,at[m]=0,at[f]=P>0?1:-1,h.push(at.x,at.y,at.z),u.push(Wt/I),u.push(1-Z/T),st+=1}}for(let Z=0;Z<T;Z++)for(let yt=0;yt<I;yt++){const Wt=d+yt+H*Z,te=d+yt+H*(Z+1),he=d+(yt+1)+H*(Z+1),se=d+(yt+1)+H*Z;c.push(Wt,te,se),c.push(te,he,se),$+=6}r.addGroup(p,$,b),p+=$,d+=st}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new G(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function is(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const s=n[e][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone():Array.isArray(s)?t[e][i]=s.slice():t[e][i]=s}}return t}function We(n){const t={};for(let e=0;e<n.length;e++){const i=is(n[e]);for(const s in i)t[s]=i[s]}return t}function Nd(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Ch(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const zd={clone:is,merge:We};var Fd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Od=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ri extends cs{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fd,this.fragmentShader=Od,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=is(t.uniforms),this.uniformsGroups=Nd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class Ph extends ye{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new we,this.projectionMatrix=new we,this.projectionMatrixInverse=new we,this.coordinateSystem=Pn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ei=new N,Wc=new Tt,Xc=new Tt;class sn extends Ph{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ds*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ds*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ei.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ei.x,ei.y).multiplyScalar(-t/ei.z),ei.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ei.x,ei.y).multiplyScalar(-t/ei.z)}getViewSize(t,e){return this.getViewBounds(t,Wc,Xc),e.subVectors(Xc,Wc)}setViewOffset(t,e,i,s,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ws*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*s/c,e-=a.offsetY*i/l,s*=a.width/c,i*=a.height/l}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Vi=-90,Hi=1;class Bd extends ye{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Vi,Hi,t,e);s.layers=this.layers,this.add(s);const o=new sn(Vi,Hi,t,e);o.layers=this.layers,this.add(o);const a=new sn(Vi,Hi,t,e);a.layers=this.layers,this.add(a);const r=new sn(Vi,Hi,t,e);r.layers=this.layers,this.add(r);const c=new sn(Vi,Hi,t,e);c.layers=this.layers,this.add(c);const l=new sn(Vi,Hi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,s,o,a,r,c]=e;for(const l of e)this.remove(l);if(t===Pn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Oo)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,s),t.render(e,o),t.setRenderTarget(i,1,s),t.render(e,a),t.setRenderTarget(i,2,s),t.render(e,r),t.setRenderTarget(i,3,s),t.render(e,c),t.setRenderTarget(i,4,s),t.render(e,l),i.texture.generateMipmaps=v,t.setRenderTarget(i,5,s),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Rh extends Be{constructor(t=[],e=ts,i,s,o,a,r,c,l,h){super(t,e,i,s,o,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class kd extends Ti{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Rh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new G(5,5,5),o=new ri({name:"CubemapFromEquirect",uniforms:is(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:$e,blending:oi});o.uniforms.tEquirect.value=e;const a=new y(s,o),r=e.minFilter;return e.minFilter===Si&&(e.minFilter=Cn),new Bd(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,s);t.setRenderTarget(o)}}class ot extends ye{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Vd={type:"move"};class Ma{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,o=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,i),f=this._getHandJoint(l,v);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,i),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(Vd)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ot;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class hc{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new ae(t),this.near=e,this.far=i}clone(){return new hc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Ih extends ye{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Xn,this.environmentIntensity=1,this.environmentRotation=new Xn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Hd extends Be{constructor(t=null,e=1,i=1,s,o,a,r,c,l=je,h=je,u,d){super(null,a,r,c,l,h,s,o,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ya=new N,Gd=new N,qd=new Kt;class _i{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const s=ya.subVectors(i,e).cross(Gd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(ya),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||qd.getNormalMatrix(t),s=this.coplanarPoint(ya).applyMatrix4(t),o=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pi=new Xo,Wd=new Tt(.5,.5),po=new N;class uc{constructor(t=new _i,e=new _i,i=new _i,s=new _i,o=new _i,a=new _i){this.planes=[t,e,i,s,o,a]}set(t,e,i,s,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Pn,i=!1){const s=this.planes,o=t.elements,a=o[0],r=o[1],c=o[2],l=o[3],h=o[4],u=o[5],d=o[6],p=o[7],g=o[8],v=o[9],m=o[10],f=o[11],w=o[12],M=o[13],x=o[14],C=o[15];if(s[0].setComponents(l-a,p-h,f-g,C-w).normalize(),s[1].setComponents(l+a,p+h,f+g,C+w).normalize(),s[2].setComponents(l+r,p+u,f+v,C+M).normalize(),s[3].setComponents(l-r,p-u,f-v,C-M).normalize(),i)s[4].setComponents(c,d,m,x).normalize(),s[5].setComponents(l-c,p-d,f-m,C-x).normalize();else if(s[4].setComponents(l-c,p-d,f-m,C-x).normalize(),e===Pn)s[5].setComponents(l+c,p+d,f+m,C+x).normalize();else if(e===Oo)s[5].setComponents(c,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),pi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),pi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(pi)}intersectsSprite(t){pi.center.set(0,0,0);const e=Wd.distanceTo(t.center);return pi.radius=.7071067811865476+e,pi.applyMatrix4(t.matrixWorld),this.intersectsSphere(pi)}intersectsSphere(t){const e=this.planes,i=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const s=e[i];if(po.x=s.normal.x>0?t.max.x:t.min.x,po.y=s.normal.y>0?t.max.y:t.min.y,po.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(po)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Lh extends cs{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const ko=new N,Vo=new N,jc=new we,_s=new Sh,mo=new Xo,ba=new N,Yc=new N;class Xd extends ye{constructor(t=new Ie,e=new Lh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let s=1,o=e.count;s<o;s++)ko.fromBufferAttribute(e,s-1),Vo.fromBufferAttribute(e,s),i[s]=i[s-1],i[s]+=ko.distanceTo(Vo);t.setAttribute("lineDistance",new re(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),mo.copy(i.boundingSphere),mo.applyMatrix4(s),mo.radius+=o,t.ray.intersectsSphere(mo)===!1)return;jc.copy(s).invert(),_s.copy(t.ray).applyMatrix4(jc);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=i.index,d=i.attributes.position;if(h!==null){const p=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=l){const f=h.getX(v),w=h.getX(v+1),M=go(this,t,_s,c,f,w,v);M&&e.push(M)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(p),f=go(this,t,_s,c,v,m,g-1);f&&e.push(f)}}else{const p=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let v=p,m=g-1;v<m;v+=l){const f=go(this,t,_s,c,v,v+1,v);f&&e.push(f)}if(this.isLineLoop){const v=go(this,t,_s,c,g-1,p,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function go(n,t,e,i,s,o,a){const r=n.geometry.attributes.position;if(ko.fromBufferAttribute(r,s),Vo.fromBufferAttribute(r,o),e.distanceSqToSegment(ko,Vo,ba,Yc)>i)return;ba.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(ba);if(!(l<t.near||l>t.far))return{distance:l,point:Yc.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Zc=new N,Jc=new N;class $c extends Xd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let s=0,o=e.count;s<o;s+=2)Zc.fromBufferAttribute(e,s),Jc.fromBufferAttribute(e,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Zc.distanceTo(Jc);t.setAttribute("lineDistance",new re(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jd extends Be{constructor(t,e,i,s,o,a,r,c,l){super(t,e,i,s,o,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dh extends Be{constructor(t,e,i=Ei,s,o,a,r=je,c=je,l,h=Is,u=1){if(h!==Is&&h!==Ls)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,o,a,r,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new lc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Uh extends Be{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Tn extends Ie{constructor(t=1,e=1,i=4,s=8,o=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:s,heightSegments:o},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),s=Math.max(3,Math.floor(s)),o=Math.max(1,Math.floor(o));const a=[],r=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,p=2*u+d,g=i*2+o,v=s+1,m=new N,f=new N;for(let w=0;w<=g;w++){let M=0,x=0,C=0,P=0;if(w<=i){const b=w/i,_=b*Math.PI/2;x=-h-t*Math.cos(_),C=t*Math.sin(_),P=-t*Math.cos(_),M=b*u}else if(w<=i+o){const b=(w-i)/o;x=-h+b*e,C=t,P=0,M=u+b*d}else{const b=(w-i-o)/i,_=b*Math.PI/2;x=h+t*Math.sin(_),C=t*Math.cos(_),P=t*Math.sin(_),M=u+d+b*u}const I=Math.max(0,Math.min(1,M/p));let T=0;w===0?T=.5/s:w===g&&(T=-.5/s);for(let b=0;b<=s;b++){const _=b/s,D=_*Math.PI*2,z=Math.sin(D),B=Math.cos(D);f.x=-C*B,f.y=x,f.z=C*z,r.push(f.x,f.y,f.z),m.set(-C*B,P,C*z),m.normalize(),c.push(m.x,m.y,m.z),l.push(_+T,I)}if(w>0){const b=(w-1)*v;for(let _=0;_<s;_++){const D=b+_,z=b+_+1,B=w*v+_,V=w*v+_+1;a.push(D,z,B),a.push(z,V,B)}}}this.setIndex(a),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Tn(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Ns extends Ie{constructor(t=1,e=32,i=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:s},e=Math.max(3,e);const o=[],a=[],r=[],c=[],l=new N,h=new Tt;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const p=i+u/e*s;l.x=t*Math.cos(p),l.y=t*Math.sin(p),a.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)o.push(u,u+1,0);this.setIndex(o),this.setAttribute("position",new re(a,3)),this.setAttribute("normal",new re(r,3)),this.setAttribute("uv",new re(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ns(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class nt extends Ie{constructor(t=1,e=1,i=1,s=32,o=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:s,heightSegments:o,openEnded:a,thetaStart:r,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],d=[],p=[];let g=0;const v=[],m=i/2;let f=0;w(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new re(u,3)),this.setAttribute("normal",new re(d,3)),this.setAttribute("uv",new re(p,2));function w(){const x=new N,C=new N;let P=0;const I=(e-t)/i;for(let T=0;T<=o;T++){const b=[],_=T/o,D=_*(e-t)+t;for(let z=0;z<=s;z++){const B=z/s,V=B*c+r,H=Math.sin(V),J=Math.cos(V);C.x=D*H,C.y=-_*i+m,C.z=D*J,u.push(C.x,C.y,C.z),x.set(H,I,J).normalize(),d.push(x.x,x.y,x.z),p.push(B,1-_),b.push(g++)}v.push(b)}for(let T=0;T<s;T++)for(let b=0;b<o;b++){const _=v[b][T],D=v[b+1][T],z=v[b+1][T+1],B=v[b][T+1];(t>0||b!==0)&&(h.push(_,D,B),P+=3),(e>0||b!==o-1)&&(h.push(D,z,B),P+=3)}l.addGroup(f,P,0),f+=P}function M(x){const C=g,P=new Tt,I=new N;let T=0;const b=x===!0?t:e,_=x===!0?1:-1;for(let z=1;z<=s;z++)u.push(0,m*_,0),d.push(0,_,0),p.push(.5,.5),g++;const D=g;for(let z=0;z<=s;z++){const V=z/s*c+r,H=Math.cos(V),J=Math.sin(V);I.x=b*J,I.y=m*_,I.z=b*H,u.push(I.x,I.y,I.z),d.push(0,_,0),P.x=H*.5+.5,P.y=J*.5*_+.5,p.push(P.x,P.y),g++}for(let z=0;z<s;z++){const B=C+z,V=D+z;x===!0?h.push(V,V+1,B):h.push(V+1,V,B),T+=3}l.addGroup(f,T,x===!0?1:2),f+=T}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ne extends nt{constructor(t=1,e=1,i=32,s=1,o=!1,a=0,r=Math.PI*2){super(0,t,e,i,s,o,a,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:r}}static fromJSON(t){return new Ne(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Yo extends Ie{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};const o=[],a=[];r(s),l(i),h(),this.setAttribute("position",new re(o,3)),this.setAttribute("normal",new re(o.slice(),3)),this.setAttribute("uv",new re(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(w){const M=new N,x=new N,C=new N;for(let P=0;P<e.length;P+=3)p(e[P+0],M),p(e[P+1],x),p(e[P+2],C),c(M,x,C,w)}function c(w,M,x,C){const P=C+1,I=[];for(let T=0;T<=P;T++){I[T]=[];const b=w.clone().lerp(x,T/P),_=M.clone().lerp(x,T/P),D=P-T;for(let z=0;z<=D;z++)z===0&&T===P?I[T][z]=b:I[T][z]=b.clone().lerp(_,z/D)}for(let T=0;T<P;T++)for(let b=0;b<2*(P-T)-1;b++){const _=Math.floor(b/2);b%2===0?(d(I[T][_+1]),d(I[T+1][_]),d(I[T][_])):(d(I[T][_+1]),d(I[T+1][_+1]),d(I[T+1][_]))}}function l(w){const M=new N;for(let x=0;x<o.length;x+=3)M.x=o[x+0],M.y=o[x+1],M.z=o[x+2],M.normalize().multiplyScalar(w),o[x+0]=M.x,o[x+1]=M.y,o[x+2]=M.z}function h(){const w=new N;for(let M=0;M<o.length;M+=3){w.x=o[M+0],w.y=o[M+1],w.z=o[M+2];const x=m(w)/2/Math.PI+.5,C=f(w)/Math.PI+.5;a.push(x,1-C)}g(),u()}function u(){for(let w=0;w<a.length;w+=6){const M=a[w+0],x=a[w+2],C=a[w+4],P=Math.max(M,x,C),I=Math.min(M,x,C);P>.9&&I<.1&&(M<.2&&(a[w+0]+=1),x<.2&&(a[w+2]+=1),C<.2&&(a[w+4]+=1))}}function d(w){o.push(w.x,w.y,w.z)}function p(w,M){const x=w*3;M.x=t[x+0],M.y=t[x+1],M.z=t[x+2]}function g(){const w=new N,M=new N,x=new N,C=new N,P=new Tt,I=new Tt,T=new Tt;for(let b=0,_=0;b<o.length;b+=9,_+=6){w.set(o[b+0],o[b+1],o[b+2]),M.set(o[b+3],o[b+4],o[b+5]),x.set(o[b+6],o[b+7],o[b+8]),P.set(a[_+0],a[_+1]),I.set(a[_+2],a[_+3]),T.set(a[_+4],a[_+5]),C.copy(w).add(M).add(x).divideScalar(3);const D=m(C);v(P,_+0,w,D),v(I,_+2,M,D),v(T,_+4,x,D)}}function v(w,M,x,C){C<0&&w.x===1&&(a[M]=w.x-1),x.x===0&&x.z===0&&(a[M]=C/2/Math.PI+.5)}function m(w){return Math.atan2(w.z,-w.x)}function f(w){return Math.atan2(-w.y,Math.sqrt(w.x*w.x+w.z*w.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yo(t.vertices,t.indices,t.radius,t.details)}}class dc extends Yo{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=1/i,o=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-i,0,-s,i,0,s,-i,0,s,i,-s,-i,0,-s,i,0,s,-i,0,s,i,0,-i,0,-s,i,0,-s,-i,0,s,i,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(o,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new dc(t.radius,t.detail)}}class Dn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,s=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),o+=i.distanceTo(s),e.push(o),s=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let s=0;const o=i.length;let a;e?a=e:a=t*i[o-1];let r=0,c=o-1,l;for(;r<=c;)if(s=Math.floor(r+(c-r)/2),l=i[s]-a,l<0)r=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,i[s]===a)return s/(o-1);const h=i[s],d=i[s+1]-h,p=(a-h)/d;return(s+p)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const a=this.getPoint(s),r=this.getPoint(o),c=e||(a.isVector2?new Tt:new N);return c.copy(r).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new N,s=[],o=[],a=[],r=new N,c=new we;for(let p=0;p<=t;p++){const g=p/t;s[p]=this.getTangentAt(g,new N)}o[0]=new N,a[0]=new N;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,i.set(1,0,0)),u<=l&&(l=u,i.set(0,1,0)),d<=l&&i.set(0,0,1),r.crossVectors(s[0],i).normalize(),o[0].crossVectors(s[0],r),a[0].crossVectors(s[0],o[0]);for(let p=1;p<=t;p++){if(o[p]=o[p-1].clone(),a[p]=a[p-1].clone(),r.crossVectors(s[p-1],s[p]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(ne(s[p-1].dot(s[p]),-1,1));o[p].applyMatrix4(c.makeRotationAxis(r,g))}a[p].crossVectors(s[p],o[p])}if(e===!0){let p=Math.acos(ne(o[0].dot(o[t]),-1,1));p/=t,s[0].dot(r.crossVectors(o[0],o[t]))>0&&(p=-p);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],p*g)),a[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class fc extends Dn{constructor(t=0,e=0,i=1,s=1,o=0,a=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Tt){const i=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(a?o=0:o=s),this.aClockwise===!0&&!a&&(o===s?o=-s:o=o-s);const r=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,p=l-this.aY;c=d*h-p*u+this.aX,l=d*u+p*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Yd extends fc{constructor(t,e,i,s,o,a){super(t,e,i,i,s,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function pc(){let n=0,t=0,e=0,i=0;function s(o,a,r,c){n=o,t=r,e=-3*o+3*a-2*r-c,i=2*o-2*a+r+c}return{initCatmullRom:function(o,a,r,c,l){s(a,r,l*(r-o),l*(c-a))},initNonuniformCatmullRom:function(o,a,r,c,l,h,u){let d=(a-o)/l-(r-o)/(l+h)+(r-a)/h,p=(r-a)/h-(c-a)/(h+u)+(c-r)/u;d*=h,p*=h,s(a,r,d,p)},calc:function(o){const a=o*o,r=a*o;return n+t*o+e*a+i*r}}}const vo=new N,Sa=new pc,wa=new pc,Ea=new pc;class Zd extends Dn{constructor(t=[],e=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=s}getPoint(t,e=new N){const i=e,s=this.points,o=s.length,a=(o-(this.closed?0:1))*t;let r=Math.floor(a),c=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/o)+1)*o:c===0&&r===o-1&&(r=o-2,c=1);let l,h;this.closed||r>0?l=s[(r-1)%o]:(vo.subVectors(s[0],s[1]).add(s[0]),l=vo);const u=s[r%o],d=s[(r+1)%o];if(this.closed||r+2<o?h=s[(r+2)%o]:(vo.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=vo),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),p),v=Math.pow(u.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(h),p);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),Sa.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),wa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),Ea.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(Sa.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),wa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Ea.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return i.set(Sa.calc(c),wa.calc(c),Ea.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new N().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Kc(n,t,e,i,s){const o=(i-t)*.5,a=(s-e)*.5,r=n*n,c=n*r;return(2*e-2*i+o+a)*c+(-3*e+3*i-2*o-a)*r+o*n+e}function Jd(n,t){const e=1-n;return e*e*t}function $d(n,t){return 2*(1-n)*n*t}function Kd(n,t){return n*n*t}function Ts(n,t,e,i){return Jd(n,t)+$d(n,e)+Kd(n,i)}function Qd(n,t){const e=1-n;return e*e*e*t}function tf(n,t){const e=1-n;return 3*e*e*n*t}function ef(n,t){return 3*(1-n)*n*n*t}function nf(n,t){return n*n*n*t}function As(n,t,e,i,s){return Qd(n,t)+tf(n,e)+ef(n,i)+nf(n,s)}class Nh extends Dn{constructor(t=new Tt,e=new Tt,i=new Tt,s=new Tt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new Tt){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(As(t,s.x,o.x,a.x,r.x),As(t,s.y,o.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class sf extends Dn{constructor(t=new N,e=new N,i=new N,s=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=s}getPoint(t,e=new N){const i=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return i.set(As(t,s.x,o.x,a.x,r.x),As(t,s.y,o.y,a.y,r.y),As(t,s.z,o.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class zh extends Dn{constructor(t=new Tt,e=new Tt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Tt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Tt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class of extends Dn{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Fh extends Dn{constructor(t=new Tt,e=new Tt,i=new Tt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Tt){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(Ts(t,s.x,o.x,a.x),Ts(t,s.y,o.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class af extends Dn{constructor(t=new N,e=new N,i=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new N){const i=e,s=this.v0,o=this.v1,a=this.v2;return i.set(Ts(t,s.x,o.x,a.x),Ts(t,s.y,o.y,a.y),Ts(t,s.z,o.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Oh extends Dn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Tt){const i=e,s=this.points,o=(s.length-1)*t,a=Math.floor(o),r=o-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(Kc(r,c.x,l.x,h.x,u.x),Kc(r,c.y,l.y,h.y,u.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const s=t.points[e];this.points.push(new Tt().fromArray(s))}return this}}var Ir=Object.freeze({__proto__:null,ArcCurve:Yd,CatmullRomCurve3:Zd,CubicBezierCurve:Nh,CubicBezierCurve3:sf,EllipseCurve:fc,LineCurve:zh,LineCurve3:of,QuadraticBezierCurve:Fh,QuadraticBezierCurve3:af,SplineCurve:Oh});class rf extends Dn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ir[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=i){const a=s[o]-i,r=this.curves[o],c=r.getLength(),l=c===0?0:1-a/c;return r.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,s=this.curves.length;i<s;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let s=0,o=this.curves;s<o.length;s++){const a=o[s],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const s=t.curves[e];this.curves.push(new Ir[s.type]().fromJSON(s))}return this}}class Lr extends rf{constructor(t){super(),this.type="Path",this.currentPoint=new Tt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new zh(this.currentPoint.clone(),new Tt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,s){const o=new Fh(this.currentPoint.clone(),new Tt(t,e),new Tt(i,s));return this.curves.push(o),this.currentPoint.set(i,s),this}bezierCurveTo(t,e,i,s,o,a){const r=new Nh(this.currentPoint.clone(),new Tt(t,e),new Tt(i,s),new Tt(o,a));return this.curves.push(r),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Oh(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,s,o,a){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,s,o,a),this}absarc(t,e,i,s,o,a){return this.absellipse(t,e,i,i,s,o,a),this}ellipse(t,e,i,s,o,a,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,s,o,a,r,c),this}absellipse(t,e,i,s,o,a,r,c){const l=new fc(t,e,i,s,o,a,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Zo extends Lr{constructor(t){super(t),this.uuid=Ci(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,s=this.holes.length;i<s;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const s=t.holes[e];this.holes.push(new Lr().fromJSON(s))}return this}}function cf(n,t,e=2){const i=t&&t.length,s=i?t[0]*e:n.length;let o=Bh(n,0,s,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,c,l;if(i&&(o=ff(n,t,o,e)),n.length>80*e){r=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const p=n[d],g=n[d+1];p<r&&(r=p),g<c&&(c=g),p>h&&(h=p),g>u&&(u=g)}l=Math.max(h-r,u-c),l=l!==0?32767/l:0}return zs(o,a,e,r,c,l,0),a}function Bh(n,t,e,i,s){let o;if(s===wf(n,t,e,i)>0)for(let a=t;a<e;a+=i)o=Qc(a/i|0,n[a],n[a+1],o);else for(let a=e-i;a>=t;a-=i)o=Qc(a/i|0,n[a],n[a+1],o);return o&&ss(o,o.next)&&(Os(o),o=o.next),o}function Ai(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(ss(e,e.next)||Se(e.prev,e,e.next)===0)){if(Os(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function zs(n,t,e,i,s,o,a){if(!n)return;!a&&o&&_f(n,i,s,o);let r=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(o?hf(n,i,s,o):lf(n)){t.push(c.i,n.i,l.i),Os(n),n=l.next,r=l.next;continue}if(n=l,n===r){a?a===1?(n=uf(Ai(n),t),zs(n,t,e,i,s,o,2)):a===2&&df(n,t,e,i,s,o):zs(Ai(n),t,e,i,s,o,1);break}}}function lf(n){const t=n.prev,e=n,i=n.next;if(Se(t,e,i)>=0)return!1;const s=t.x,o=e.x,a=i.x,r=t.y,c=e.y,l=i.y,h=Math.min(s,o,a),u=Math.min(r,c,l),d=Math.max(s,o,a),p=Math.max(r,c,l);let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&bs(s,r,o,c,a,l,g.x,g.y)&&Se(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function hf(n,t,e,i){const s=n.prev,o=n,a=n.next;if(Se(s,o,a)>=0)return!1;const r=s.x,c=o.x,l=a.x,h=s.y,u=o.y,d=a.y,p=Math.min(r,c,l),g=Math.min(h,u,d),v=Math.max(r,c,l),m=Math.max(h,u,d),f=Dr(p,g,t,e,i),w=Dr(v,m,t,e,i);let M=n.prevZ,x=n.nextZ;for(;M&&M.z>=f&&x&&x.z<=w;){if(M.x>=p&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&bs(r,h,c,u,l,d,M.x,M.y)&&Se(M.prev,M,M.next)>=0||(M=M.prevZ,x.x>=p&&x.x<=v&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&bs(r,h,c,u,l,d,x.x,x.y)&&Se(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;M&&M.z>=f;){if(M.x>=p&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&bs(r,h,c,u,l,d,M.x,M.y)&&Se(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;x&&x.z<=w;){if(x.x>=p&&x.x<=v&&x.y>=g&&x.y<=m&&x!==s&&x!==a&&bs(r,h,c,u,l,d,x.x,x.y)&&Se(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function uf(n,t){let e=n;do{const i=e.prev,s=e.next.next;!ss(i,s)&&Vh(i,e,e.next,s)&&Fs(i,s)&&Fs(s,i)&&(t.push(i.i,e.i,s.i),Os(e),Os(e.next),e=n=s),e=e.next}while(e!==n);return Ai(e)}function df(n,t,e,i,s,o){let a=n;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&yf(a,r)){let c=Hh(a,r);a=Ai(a,a.next),c=Ai(c,c.next),zs(a,t,e,i,s,o,0),zs(c,t,e,i,s,o,0);return}r=r.next}a=a.next}while(a!==n)}function ff(n,t,e,i){const s=[];for(let o=0,a=t.length;o<a;o++){const r=t[o]*i,c=o<a-1?t[o+1]*i:n.length,l=Bh(n,r,c,i,!1);l===l.next&&(l.steiner=!0),s.push(Mf(l))}s.sort(pf);for(let o=0;o<s.length;o++)e=mf(s[o],e);return e}function pf(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=i-s}return e}function mf(n,t){const e=gf(n,t);if(!e)return t;const i=Hh(e,n);return Ai(i,i.next),Ai(e,e.next)}function gf(n,t){let e=t;const i=n.x,s=n.y;let o=-1/0,a;if(ss(n,e))return e;do{if(ss(n,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=i&&u>o&&(o=u,a=e.x<e.next.x?e:e.next,u===i))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&kh(s<l?i:o,s,c,l,s<l?o:i,s,e.x,e.y)){const u=Math.abs(s-e.y)/(i-e.x);Fs(e,n)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&vf(a,e)))&&(a=e,h=u)}e=e.next}while(e!==r);return a}function vf(n,t){return Se(n.prev,n,t.prev)<0&&Se(t.next,n,n.next)<0}function _f(n,t,e,i){let s=n;do s.z===0&&(s.z=Dr(s.x,s.y,t,e,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,xf(s)}function xf(n){let t,e=1;do{let i=n,s;n=null;let o=null;for(t=0;i;){t++;let a=i,r=0;for(let l=0;l<e&&(r++,a=a.nextZ,!!a);l++);let c=e;for(;r>0||c>0&&a;)r!==0&&(c===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,r--):(s=a,a=a.nextZ,c--),o?o.nextZ=s:n=s,s.prevZ=o,o=s;i=a}o.nextZ=null,e*=2}while(t>1);return n}function Dr(n,t,e,i,s){return n=(n-e)*s|0,t=(t-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function Mf(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function kh(n,t,e,i,s,o,a,r){return(s-a)*(t-r)>=(n-a)*(o-r)&&(n-a)*(i-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(s-a)*(i-r)}function bs(n,t,e,i,s,o,a,r){return!(n===a&&t===r)&&kh(n,t,e,i,s,o,a,r)}function yf(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!bf(n,t)&&(Fs(n,t)&&Fs(t,n)&&Sf(n,t)&&(Se(n.prev,n,t.prev)||Se(n,t.prev,t))||ss(n,t)&&Se(n.prev,n,n.next)>0&&Se(t.prev,t,t.next)>0)}function Se(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function ss(n,t){return n.x===t.x&&n.y===t.y}function Vh(n,t,e,i){const s=xo(Se(n,t,e)),o=xo(Se(n,t,i)),a=xo(Se(e,i,n)),r=xo(Se(e,i,t));return!!(s!==o&&a!==r||s===0&&_o(n,e,t)||o===0&&_o(n,i,t)||a===0&&_o(e,n,i)||r===0&&_o(e,t,i))}function _o(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function xo(n){return n>0?1:n<0?-1:0}function bf(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&Vh(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Fs(n,t){return Se(n.prev,n,n.next)<0?Se(n,t,n.next)>=0&&Se(n,n.prev,t)>=0:Se(n,t,n.prev)<0||Se(n,n.next,t)<0}function Sf(n,t){let e=n,i=!1;const s=(n.x+t.x)/2,o=(n.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function Hh(n,t){const e=Ur(n.i,n.x,n.y),i=Ur(t.i,t.x,t.y),s=n.next,o=t.prev;return n.next=t,t.prev=n,e.next=s,s.prev=e,i.next=e,e.prev=i,o.next=i,i.prev=o,i}function Qc(n,t,e,i){const s=Ur(n,t,e);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Os(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Ur(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function wf(n,t,e,i){let s=0;for(let o=t,a=e-i;o<e;o+=i)s+=(n[a]-n[o])*(n[o+1]+n[a+1]),a=o;return s}class Ef{static triangulate(t,e,i=2){return cf(t,e,i)}}class Hn{static area(t){const e=t.length;let i=0;for(let s=e-1,o=0;o<e;s=o++)i+=t[s].x*t[o].y-t[o].x*t[s].y;return i*.5}static isClockWise(t){return Hn.area(t)<0}static triangulateShape(t,e){const i=[],s=[],o=[];tl(t),el(i,t);let a=t.length;e.forEach(tl);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,el(i,e[c]);const r=Ef.triangulate(i,s);for(let c=0;c<r.length;c+=3)o.push(r.slice(c,c+3));return o}}function tl(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function el(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class mc extends Ie{constructor(t=new Zo([new Tt(.5,.5),new Tt(-.5,.5),new Tt(-.5,-.5),new Tt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,s=[],o=[];for(let r=0,c=t.length;r<c;r++){const l=t[r];a(l)}this.setAttribute("position",new re(s,3)),this.setAttribute("uv",new re(o,2)),this.computeVertexNormals();function a(r){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,p=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:p-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,w=e.UVGenerator!==void 0?e.UVGenerator:Tf;let M,x=!1,C,P,I,T;f&&(M=f.getSpacedPoints(h),x=!0,d=!1,C=f.computeFrenetFrames(h,!1),P=new N,I=new N,T=new N),d||(m=0,p=0,g=0,v=0);const b=r.extractPoints(l);let _=b.shape;const D=b.holes;if(!Hn.isClockWise(_)){_=_.reverse();for(let ft=0,ht=D.length;ft<ht;ft++){const ct=D[ft];Hn.isClockWise(ct)&&(D[ft]=ct.reverse())}}function B(ft){const ct=10000000000000001e-36;let Y=ft[0];for(let bt=1;bt<=ft.length;bt++){const vt=bt%ft.length,wt=ft[vt],Xt=wt.x-Y.x,Zt=wt.y-Y.y,U=Xt*Xt+Zt*Zt,E=Math.max(Math.abs(wt.x),Math.abs(wt.y),Math.abs(Y.x),Math.abs(Y.y)),X=ct*E*E;if(U<=X){ft.splice(vt,1),bt--;continue}Y=wt}}B(_),D.forEach(B);const V=D.length,H=_;for(let ft=0;ft<V;ft++){const ht=D[ft];_=_.concat(ht)}function J(ft,ht,ct){return ht||console.error("THREE.ExtrudeGeometry: vec does not exist"),ft.clone().addScaledVector(ht,ct)}const st=_.length;function $(ft,ht,ct){let Y,bt,vt;const wt=ft.x-ht.x,Xt=ft.y-ht.y,Zt=ct.x-ft.x,U=ct.y-ft.y,E=wt*wt+Xt*Xt,X=wt*U-Xt*Zt;if(Math.abs(X)>Number.EPSILON){const Q=Math.sqrt(E),ut=Math.sqrt(Zt*Zt+U*U),it=ht.x-Xt/Q,Ft=ht.y+wt/Q,St=ct.x-U/ut,Ot=ct.y+Zt/ut,Bt=((St-it)*U-(Ot-Ft)*Zt)/(wt*U-Xt*Zt);Y=it+wt*Bt-ft.x,bt=Ft+Xt*Bt-ft.y;const xt=Y*Y+bt*bt;if(xt<=2)return new Tt(Y,bt);vt=Math.sqrt(xt/2)}else{let Q=!1;wt>Number.EPSILON?Zt>Number.EPSILON&&(Q=!0):wt<-Number.EPSILON?Zt<-Number.EPSILON&&(Q=!0):Math.sign(Xt)===Math.sign(U)&&(Q=!0),Q?(Y=-Xt,bt=wt,vt=Math.sqrt(E)):(Y=wt,bt=Xt,vt=Math.sqrt(E/2))}return new Tt(Y/vt,bt/vt)}const at=[];for(let ft=0,ht=H.length,ct=ht-1,Y=ft+1;ft<ht;ft++,ct++,Y++)ct===ht&&(ct=0),Y===ht&&(Y=0),at[ft]=$(H[ft],H[ct],H[Y]);const Z=[];let yt,Wt=at.concat();for(let ft=0,ht=V;ft<ht;ft++){const ct=D[ft];yt=[];for(let Y=0,bt=ct.length,vt=bt-1,wt=Y+1;Y<bt;Y++,vt++,wt++)vt===bt&&(vt=0),wt===bt&&(wt=0),yt[Y]=$(ct[Y],ct[vt],ct[wt]);Z.push(yt),Wt=Wt.concat(yt)}let te;if(m===0)te=Hn.triangulateShape(H,D);else{const ft=[],ht=[];for(let ct=0;ct<m;ct++){const Y=ct/m,bt=p*Math.cos(Y*Math.PI/2),vt=g*Math.sin(Y*Math.PI/2)+v;for(let wt=0,Xt=H.length;wt<Xt;wt++){const Zt=J(H[wt],at[wt],vt);Ht(Zt.x,Zt.y,-bt),Y===0&&ft.push(Zt)}for(let wt=0,Xt=V;wt<Xt;wt++){const Zt=D[wt];yt=Z[wt];const U=[];for(let E=0,X=Zt.length;E<X;E++){const Q=J(Zt[E],yt[E],vt);Ht(Q.x,Q.y,-bt),Y===0&&U.push(Q)}Y===0&&ht.push(U)}}te=Hn.triangulateShape(ft,ht)}const he=te.length,se=g+v;for(let ft=0;ft<st;ft++){const ht=d?J(_[ft],Wt[ft],se):_[ft];x?(I.copy(C.normals[0]).multiplyScalar(ht.x),P.copy(C.binormals[0]).multiplyScalar(ht.y),T.copy(M[0]).add(I).add(P),Ht(T.x,T.y,T.z)):Ht(ht.x,ht.y,0)}for(let ft=1;ft<=h;ft++)for(let ht=0;ht<st;ht++){const ct=d?J(_[ht],Wt[ht],se):_[ht];x?(I.copy(C.normals[ft]).multiplyScalar(ct.x),P.copy(C.binormals[ft]).multiplyScalar(ct.y),T.copy(M[ft]).add(I).add(P),Ht(T.x,T.y,T.z)):Ht(ct.x,ct.y,u/h*ft)}for(let ft=m-1;ft>=0;ft--){const ht=ft/m,ct=p*Math.cos(ht*Math.PI/2),Y=g*Math.sin(ht*Math.PI/2)+v;for(let bt=0,vt=H.length;bt<vt;bt++){const wt=J(H[bt],at[bt],Y);Ht(wt.x,wt.y,u+ct)}for(let bt=0,vt=D.length;bt<vt;bt++){const wt=D[bt];yt=Z[bt];for(let Xt=0,Zt=wt.length;Xt<Zt;Xt++){const U=J(wt[Xt],yt[Xt],Y);x?Ht(U.x,U.y+M[h-1].y,M[h-1].x+ct):Ht(U.x,U.y,u+ct)}}}rt(),dt();function rt(){const ft=s.length/3;if(d){let ht=0,ct=st*ht;for(let Y=0;Y<he;Y++){const bt=te[Y];zt(bt[2]+ct,bt[1]+ct,bt[0]+ct)}ht=h+m*2,ct=st*ht;for(let Y=0;Y<he;Y++){const bt=te[Y];zt(bt[0]+ct,bt[1]+ct,bt[2]+ct)}}else{for(let ht=0;ht<he;ht++){const ct=te[ht];zt(ct[2],ct[1],ct[0])}for(let ht=0;ht<he;ht++){const ct=te[ht];zt(ct[0]+st*h,ct[1]+st*h,ct[2]+st*h)}}i.addGroup(ft,s.length/3-ft,0)}function dt(){const ft=s.length/3;let ht=0;It(H,ht),ht+=H.length;for(let ct=0,Y=D.length;ct<Y;ct++){const bt=D[ct];It(bt,ht),ht+=bt.length}i.addGroup(ft,s.length/3-ft,1)}function It(ft,ht){let ct=ft.length;for(;--ct>=0;){const Y=ct;let bt=ct-1;bt<0&&(bt=ft.length-1);for(let vt=0,wt=h+m*2;vt<wt;vt++){const Xt=st*vt,Zt=st*(vt+1),U=ht+Y+Xt,E=ht+bt+Xt,X=ht+bt+Zt,Q=ht+Y+Zt;ee(U,E,X,Q)}}}function Ht(ft,ht,ct){c.push(ft),c.push(ht),c.push(ct)}function zt(ft,ht,ct){me(ft),me(ht),me(ct);const Y=s.length/3,bt=w.generateTopUV(i,s,Y-3,Y-2,Y-1);F(bt[0]),F(bt[1]),F(bt[2])}function ee(ft,ht,ct,Y){me(ft),me(ht),me(Y),me(ht),me(ct),me(Y);const bt=s.length/3,vt=w.generateSideWallUV(i,s,bt-6,bt-3,bt-2,bt-1);F(vt[0]),F(vt[1]),F(vt[3]),F(vt[1]),F(vt[2]),F(vt[3])}function me(ft){s.push(c[ft*3+0]),s.push(c[ft*3+1]),s.push(c[ft*3+2])}function F(ft){o.push(ft.x),o.push(ft.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return Af(e,i,t)}static fromJSON(t,e){const i=[];for(let o=0,a=t.shapes.length;o<a;o++){const r=e[t.shapes[o]];i.push(r)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Ir[s.type]().fromJSON(s)),new mc(i,t.options)}}const Tf={generateTopUV:function(n,t,e,i,s){const o=t[e*3],a=t[e*3+1],r=t[i*3],c=t[i*3+1],l=t[s*3],h=t[s*3+1];return[new Tt(o,a),new Tt(r,c),new Tt(l,h)]},generateSideWallUV:function(n,t,e,i,s,o){const a=t[e*3],r=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],u=t[i*3+2],d=t[s*3],p=t[s*3+1],g=t[s*3+2],v=t[o*3],m=t[o*3+1],f=t[o*3+2];return Math.abs(r-h)<Math.abs(a-l)?[new Tt(a,1-c),new Tt(l,1-u),new Tt(d,1-g),new Tt(v,1-f)]:[new Tt(r,1-c),new Tt(h,1-u),new Tt(p,1-g),new Tt(m,1-f)]}};function Af(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const o=n[i];e.shapes.push(o.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Hs extends Yo{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Hs(t.radius,t.detail)}}class Ue extends Ie{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};const o=t/2,a=e/2,r=Math.floor(i),c=Math.floor(s),l=r+1,h=c+1,u=t/r,d=e/c,p=[],g=[],v=[],m=[];for(let f=0;f<h;f++){const w=f*d-a;for(let M=0;M<l;M++){const x=M*u-o;g.push(x,-w,0),v.push(0,0,1),m.push(M/r),m.push(1-f/c)}}for(let f=0;f<c;f++)for(let w=0;w<r;w++){const M=w+l*f,x=w+l*(f+1),C=w+1+l*(f+1),P=w+1+l*f;p.push(M,x,P),p.push(x,C,P)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ue(t.width,t.height,t.widthSegments,t.heightSegments)}}class gc extends Ie{constructor(t=.5,e=1,i=32,s=1,o=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:s,thetaStart:o,thetaLength:a},i=Math.max(3,i),s=Math.max(1,s);const r=[],c=[],l=[],h=[];let u=t;const d=(e-t)/s,p=new N,g=new Tt;for(let v=0;v<=s;v++){for(let m=0;m<=i;m++){const f=o+m/i*a;p.x=u*Math.cos(f),p.y=u*Math.sin(f),c.push(p.x,p.y,p.z),l.push(0,0,1),g.x=(p.x/e+1)/2,g.y=(p.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<s;v++){const m=v*(i+1);for(let f=0;f<i;f++){const w=f+m,M=w,x=w+i+1,C=w+i+2,P=w+1;r.push(M,x,P),r.push(x,C,P)}}this.setIndex(r),this.setAttribute("position",new re(c,3)),this.setAttribute("normal",new re(l,3)),this.setAttribute("uv",new re(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new gc(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class vc extends Ie{constructor(t=new Zo([new Tt(0,.5),new Tt(-.5,-.5),new Tt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],s=[],o=[],a=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new re(s,3)),this.setAttribute("normal",new re(o,3)),this.setAttribute("uv",new re(a,2));function l(h){const u=s.length/3,d=h.extractPoints(e);let p=d.shape;const g=d.holes;Hn.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,f=g.length;m<f;m++){const w=g[m];Hn.isClockWise(w)===!0&&(g[m]=w.reverse())}const v=Hn.triangulateShape(p,g);for(let m=0,f=g.length;m<f;m++){const w=g[m];p=p.concat(w)}for(let m=0,f=p.length;m<f;m++){const w=p[m];s.push(w.x,w.y,0),o.push(0,0,1),a.push(w.x,w.y)}for(let m=0,f=v.length;m<f;m++){const w=v[m],M=w[0]+u,x=w[1]+u,C=w[2]+u;i.push(M,x,C),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Cf(e,t)}static fromJSON(t,e){const i=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];i.push(a)}return new vc(i,t.curveSegments)}}function Cf(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const s=n[e];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t}class Rt extends Ie{constructor(t=1,e=32,i=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+r,Math.PI);let l=0;const h=[],u=new N,d=new N,p=[],g=[],v=[],m=[];for(let f=0;f<=i;f++){const w=[],M=f/i;let x=0;f===0&&a===0?x=.5/e:f===i&&c===Math.PI&&(x=-.5/e);for(let C=0;C<=e;C++){const P=C/e;u.x=-t*Math.cos(s+P*o)*Math.sin(a+M*r),u.y=t*Math.cos(a+M*r),u.z=t*Math.sin(s+P*o)*Math.sin(a+M*r),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(P+x,1-M),w.push(l++)}h.push(w)}for(let f=0;f<i;f++)for(let w=0;w<e;w++){const M=h[f][w+1],x=h[f][w],C=h[f+1][w],P=h[f+1][w+1];(f!==0||a>0)&&p.push(M,x,P),(f!==i-1||c<Math.PI)&&p.push(x,C,P)}this.setIndex(p),this.setAttribute("position",new re(g,3)),this.setAttribute("normal",new re(v,3)),this.setAttribute("uv",new re(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Rt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class _e extends Ie{constructor(t=1,e=.4,i=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:o},i=Math.floor(i),s=Math.floor(s);const a=[],r=[],c=[],l=[],h=new N,u=new N,d=new N;for(let p=0;p<=i;p++)for(let g=0;g<=s;g++){const v=g/s*o,m=p/i*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),r.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(p/i)}for(let p=1;p<=i;p++)for(let g=1;g<=s;g++){const v=(s+1)*p+g-1,m=(s+1)*(p-1)+g-1,f=(s+1)*(p-1)+g,w=(s+1)*p+g;a.push(v,m,w),a.push(m,f,w)}this.setIndex(a),this.setAttribute("position",new re(r,3)),this.setAttribute("normal",new re(c,3)),this.setAttribute("uv",new re(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Gh extends cs{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ae(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xh,this.normalScale=new Tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class Pf extends cs{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=qu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Rf extends cs{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class qh extends ye{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ae(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Wh extends qh{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ae(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ta=new we,nl=new N,il=new N;class If{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Tt(512,512),this.mapType=Ln,this.map=null,this.mapPass=null,this.matrix=new we,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new uc,this._frameExtents=new Tt(1,1),this._viewportCount=1,this._viewports=[new Ee(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;nl.setFromMatrixPosition(t.matrixWorld),e.position.copy(nl),il.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(il),e.updateMatrixWorld(),Ta.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ta,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ta)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class _c extends Ph{constructor(t=-1,e=1,i=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=i-t,a=i+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Lf extends If{constructor(){super(new _c(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Nr extends qh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ye.DEFAULT_UP),this.updateMatrix(),this.target=new ye,this.shadow=new Lf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Df extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Uf{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function sl(n,t,e,i){const s=Nf(i);switch(e){case gh:return n*t;case sc:return n*t/s.components*s.byteLength;case oc:return n*t/s.components*s.byteLength;case _h:return n*t*2/s.components*s.byteLength;case ac:return n*t*2/s.components*s.byteLength;case vh:return n*t*3/s.components*s.byteLength;case En:return n*t*4/s.components*s.byteLength;case rc:return n*t*4/s.components*s.byteLength;case Co:case Po:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ro:case Io:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case sr:case ar:return Math.max(n,16)*Math.max(t,8)/4;case ir:case or:return Math.max(n,8)*Math.max(t,8)/2;case rr:case cr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case lr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case hr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case ur:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case dr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case fr:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case pr:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case mr:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case gr:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case vr:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case _r:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case xr:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Mr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case yr:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case br:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Sr:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case wr:case Er:case Tr:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Ar:case Cr:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Pr:case Rr:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Nf(n){switch(n){case Ln:case dh:return{byteLength:1,components:1};case Ps:case fh:case Vs:return{byteLength:2,components:1};case nc:case ic:return{byteLength:2,components:4};case Ei:case ec:case Vn:return{byteLength:4,components:1};case ph:case mh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:tc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=tc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Xh(){let n=null,t=!1,e=null,i=null;function s(o,a){e(o,a),i=n.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){n=o}}}function zf(n){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,u=l.byteLength,d=n.createBuffer();n.bindBuffer(c,d),n.bufferData(c,l,h),r.onUploadCallback();let p;if(l instanceof Float32Array)p=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=n.HALF_FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=n.SHORT;else if(l instanceof Uint32Array)p=n.UNSIGNED_INT;else if(l instanceof Int32Array)p=n.INT;else if(l instanceof Int8Array)p=n.BYTE;else if(l instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function i(r,c,l){const h=c.array,u=c.updateRanges;if(n.bindBuffer(l,r),u.length===0)n.bufferSubData(l,0,h);else{u.sort((p,g)=>p.start-g.start);let d=0;for(let p=1;p<u.length;p++){const g=u[d],v=u[p];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let p=0,g=u.length;p<g;p++){const v=u[p];n.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function o(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function a(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:s,remove:o,update:a}}var Ff=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Of=`#ifdef USE_ALPHAHASH
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
#endif`,Bf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,kf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Vf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Hf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Gf=`#ifdef USE_AOMAP
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
#endif`,qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Wf=`#ifdef USE_BATCHING
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
#endif`,Xf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,jf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Zf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Jf=`#ifdef USE_IRIDESCENCE
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
#endif`,$f=`#ifdef USE_BUMPMAP
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
#endif`,Kf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Qf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ep=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,np=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,ip=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,op=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ap=`#define PI 3.141592653589793
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
} // validated`,rp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,cp=`vec3 transformedNormal = objectNormal;
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
#endif`,lp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,up=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,dp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fp="gl_FragColor = linearToOutputTexel( gl_FragColor );",pp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mp=`#ifdef USE_ENVMAP
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
#endif`,gp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,vp=`#ifdef USE_ENVMAP
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
#endif`,_p=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,xp=`#ifdef USE_ENVMAP
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
#endif`,Mp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,yp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wp=`#ifdef USE_GRADIENTMAP
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
}`,Ep=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Tp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ap=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cp=`uniform bool receiveShadow;
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
#endif`,Pp=`#ifdef USE_ENVMAP
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
#endif`,Rp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ip=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Lp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Dp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Up=`PhysicalMaterial material;
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
#endif`,Np=`struct PhysicalMaterial {
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
}`,zp=`
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
#endif`,Fp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Op=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Bp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,kp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Hp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Gp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,qp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Wp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Xp=`#if defined( USE_POINTS_UV )
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
#endif`,jp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,$p=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Kp=`#ifdef USE_MORPHTARGETS
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
#endif`,Qp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,t0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,e0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,n0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,i0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,s0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,o0=`#ifdef USE_NORMALMAP
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
#endif`,a0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,r0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,c0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,l0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,h0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,u0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,d0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,f0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,p0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,m0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,g0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,v0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,x0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,M0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,y0=`float getShadowMask() {
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
}`,b0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,S0=`#ifdef USE_SKINNING
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
#endif`,w0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,E0=`#ifdef USE_SKINNING
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
#endif`,T0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,A0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,C0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,P0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,R0=`#ifdef USE_TRANSMISSION
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
#endif`,I0=`#ifdef USE_TRANSMISSION
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
#endif`,L0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,D0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,N0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const z0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,F0=`uniform sampler2D t2D;
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
}`,O0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,B0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,k0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,V0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`#include <common>
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
}`,G0=`#if DEPTH_PACKING == 3200
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
}`,q0=`#define DISTANCE
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
}`,W0=`#define DISTANCE
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
}`,X0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,j0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Y0=`uniform float scale;
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
}`,Z0=`uniform vec3 diffuse;
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
}`,J0=`#include <common>
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
}`,$0=`uniform vec3 diffuse;
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
}`,K0=`#define LAMBERT
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
}`,Q0=`#define LAMBERT
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
}`,tm=`#define MATCAP
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
}`,em=`#define MATCAP
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
}`,nm=`#define NORMAL
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
}`,im=`#define NORMAL
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
}`,sm=`#define PHONG
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
}`,om=`#define PHONG
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
}`,am=`#define STANDARD
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
}`,rm=`#define STANDARD
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
}`,cm=`#define TOON
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
}`,lm=`#define TOON
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
}`,hm=`uniform float size;
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
}`,um=`uniform vec3 diffuse;
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
}`,dm=`#include <common>
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
}`,fm=`uniform vec3 color;
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
}`,pm=`uniform float rotation;
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
}`,mm=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:Ff,alphahash_pars_fragment:Of,alphamap_fragment:Bf,alphamap_pars_fragment:kf,alphatest_fragment:Vf,alphatest_pars_fragment:Hf,aomap_fragment:Gf,aomap_pars_fragment:qf,batching_pars_vertex:Wf,batching_vertex:Xf,begin_vertex:jf,beginnormal_vertex:Yf,bsdfs:Zf,iridescence_fragment:Jf,bumpmap_pars_fragment:$f,clipping_planes_fragment:Kf,clipping_planes_pars_fragment:Qf,clipping_planes_pars_vertex:tp,clipping_planes_vertex:ep,color_fragment:np,color_pars_fragment:ip,color_pars_vertex:sp,color_vertex:op,common:ap,cube_uv_reflection_fragment:rp,defaultnormal_vertex:cp,displacementmap_pars_vertex:lp,displacementmap_vertex:hp,emissivemap_fragment:up,emissivemap_pars_fragment:dp,colorspace_fragment:fp,colorspace_pars_fragment:pp,envmap_fragment:mp,envmap_common_pars_fragment:gp,envmap_pars_fragment:vp,envmap_pars_vertex:_p,envmap_physical_pars_fragment:Pp,envmap_vertex:xp,fog_vertex:Mp,fog_pars_vertex:yp,fog_fragment:bp,fog_pars_fragment:Sp,gradientmap_pars_fragment:wp,lightmap_pars_fragment:Ep,lights_lambert_fragment:Tp,lights_lambert_pars_fragment:Ap,lights_pars_begin:Cp,lights_toon_fragment:Rp,lights_toon_pars_fragment:Ip,lights_phong_fragment:Lp,lights_phong_pars_fragment:Dp,lights_physical_fragment:Up,lights_physical_pars_fragment:Np,lights_fragment_begin:zp,lights_fragment_maps:Fp,lights_fragment_end:Op,logdepthbuf_fragment:Bp,logdepthbuf_pars_fragment:kp,logdepthbuf_pars_vertex:Vp,logdepthbuf_vertex:Hp,map_fragment:Gp,map_pars_fragment:qp,map_particle_fragment:Wp,map_particle_pars_fragment:Xp,metalnessmap_fragment:jp,metalnessmap_pars_fragment:Yp,morphinstance_vertex:Zp,morphcolor_vertex:Jp,morphnormal_vertex:$p,morphtarget_pars_vertex:Kp,morphtarget_vertex:Qp,normal_fragment_begin:t0,normal_fragment_maps:e0,normal_pars_fragment:n0,normal_pars_vertex:i0,normal_vertex:s0,normalmap_pars_fragment:o0,clearcoat_normal_fragment_begin:a0,clearcoat_normal_fragment_maps:r0,clearcoat_pars_fragment:c0,iridescence_pars_fragment:l0,opaque_fragment:h0,packing:u0,premultiplied_alpha_fragment:d0,project_vertex:f0,dithering_fragment:p0,dithering_pars_fragment:m0,roughnessmap_fragment:g0,roughnessmap_pars_fragment:v0,shadowmap_pars_fragment:_0,shadowmap_pars_vertex:x0,shadowmap_vertex:M0,shadowmask_pars_fragment:y0,skinbase_vertex:b0,skinning_pars_vertex:S0,skinning_vertex:w0,skinnormal_vertex:E0,specularmap_fragment:T0,specularmap_pars_fragment:A0,tonemapping_fragment:C0,tonemapping_pars_fragment:P0,transmission_fragment:R0,transmission_pars_fragment:I0,uv_pars_fragment:L0,uv_pars_vertex:D0,uv_vertex:U0,worldpos_vertex:N0,background_vert:z0,background_frag:F0,backgroundCube_vert:O0,backgroundCube_frag:B0,cube_vert:k0,cube_frag:V0,depth_vert:H0,depth_frag:G0,distanceRGBA_vert:q0,distanceRGBA_frag:W0,equirect_vert:X0,equirect_frag:j0,linedashed_vert:Y0,linedashed_frag:Z0,meshbasic_vert:J0,meshbasic_frag:$0,meshlambert_vert:K0,meshlambert_frag:Q0,meshmatcap_vert:tm,meshmatcap_frag:em,meshnormal_vert:nm,meshnormal_frag:im,meshphong_vert:sm,meshphong_frag:om,meshphysical_vert:am,meshphysical_frag:rm,meshtoon_vert:cm,meshtoon_frag:lm,points_vert:hm,points_frag:um,shadow_vert:dm,shadow_frag:fm,sprite_vert:pm,sprite_frag:mm},Pt={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new Tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new Tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},An={basic:{uniforms:We([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:We([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:We([Pt.common,Pt.specularmap,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:We([Pt.common,Pt.envmap,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.roughnessmap,Pt.metalnessmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:We([Pt.common,Pt.aomap,Pt.lightmap,Pt.emissivemap,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.gradientmap,Pt.fog,Pt.lights,{emissive:{value:new ae(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:We([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,Pt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:We([Pt.points,Pt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:We([Pt.common,Pt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:We([Pt.common,Pt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:We([Pt.common,Pt.bumpmap,Pt.normalmap,Pt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:We([Pt.sprite,Pt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:We([Pt.common,Pt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:We([Pt.lights,Pt.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};An.physical={uniforms:We([An.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new Tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new Tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new Tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Mo={r:0,b:0,g:0},mi=new Xn,gm=new we;function vm(n,t,e,i,s,o,a){const r=new ae(0);let c=o===!0?0:1,l,h,u=null,d=0,p=null;function g(M){let x=M.isScene===!0?M.background:null;return x&&x.isTexture&&(x=(M.backgroundBlurriness>0?e:t).get(x)),x}function v(M){let x=!1;const C=g(M);C===null?f(r,c):C&&C.isColor&&(f(C,1),x=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(M,x){const C=g(x);C&&(C.isCubeTexture||C.mapping===Wo)?(h===void 0&&(h=new y(new G(1,1,1),new ri({name:"BackgroundCubeMaterial",uniforms:is(An.backgroundCube.uniforms),vertexShader:An.backgroundCube.vertexShader,fragmentShader:An.backgroundCube.fragmentShader,side:$e,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,I,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),mi.copy(x.backgroundRotation),mi.x*=-1,mi.y*=-1,mi.z*=-1,C.isCubeTexture&&C.isRenderTargetTexture===!1&&(mi.y*=-1,mi.z*=-1),h.material.uniforms.envMap.value=C,h.material.uniforms.flipEnvMap.value=C.isCubeTexture&&C.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(gm.makeRotationFromEuler(mi)),h.material.toneMapped=de.getTransfer(C.colorSpace)!==ve,(u!==C||d!==C.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=C,d=C.version,p=n.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):C&&C.isTexture&&(l===void 0&&(l=new y(new Ue(2,2),new ri({name:"BackgroundMaterial",uniforms:is(An.background.uniforms),vertexShader:An.background.vertexShader,fragmentShader:An.background.fragmentShader,side:Wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=C,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=de.getTransfer(C.colorSpace)!==ve,C.matrixAutoUpdate===!0&&C.updateMatrix(),l.material.uniforms.uvTransform.value.copy(C.matrix),(u!==C||d!==C.version||p!==n.toneMapping)&&(l.material.needsUpdate=!0,u=C,d=C.version,p=n.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function f(M,x){M.getRGB(Mo,Ch(n)),i.buffers.color.setClear(Mo.r,Mo.g,Mo.b,x,a)}function w(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(M,x=1){r.set(M),c=x,f(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,f(r,c)},render:v,addToRenderList:m,dispose:w}}function _m(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=d(null);let o=s,a=!1;function r(_,D,z,B,V){let H=!1;const J=u(B,z,D);o!==J&&(o=J,l(o.object)),H=p(_,B,z,V),H&&g(_,B,z,V),V!==null&&t.update(V,n.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,x(_,D,z,B),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(V).buffer))}function c(){return n.createVertexArray()}function l(_){return n.bindVertexArray(_)}function h(_){return n.deleteVertexArray(_)}function u(_,D,z){const B=z.wireframe===!0;let V=i[_.id];V===void 0&&(V={},i[_.id]=V);let H=V[D.id];H===void 0&&(H={},V[D.id]=H);let J=H[B];return J===void 0&&(J=d(c()),H[B]=J),J}function d(_){const D=[],z=[],B=[];for(let V=0;V<e;V++)D[V]=0,z[V]=0,B[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:z,attributeDivisors:B,object:_,attributes:{},index:null}}function p(_,D,z,B){const V=o.attributes,H=D.attributes;let J=0;const st=z.getAttributes();for(const $ in st)if(st[$].location>=0){const Z=V[$];let yt=H[$];if(yt===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(yt=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(yt=_.instanceColor)),Z===void 0||Z.attribute!==yt||yt&&Z.data!==yt.data)return!0;J++}return o.attributesNum!==J||o.index!==B}function g(_,D,z,B){const V={},H=D.attributes;let J=0;const st=z.getAttributes();for(const $ in st)if(st[$].location>=0){let Z=H[$];Z===void 0&&($==="instanceMatrix"&&_.instanceMatrix&&(Z=_.instanceMatrix),$==="instanceColor"&&_.instanceColor&&(Z=_.instanceColor));const yt={};yt.attribute=Z,Z&&Z.data&&(yt.data=Z.data),V[$]=yt,J++}o.attributes=V,o.attributesNum=J,o.index=B}function v(){const _=o.newAttributes;for(let D=0,z=_.length;D<z;D++)_[D]=0}function m(_){f(_,0)}function f(_,D){const z=o.newAttributes,B=o.enabledAttributes,V=o.attributeDivisors;z[_]=1,B[_]===0&&(n.enableVertexAttribArray(_),B[_]=1),V[_]!==D&&(n.vertexAttribDivisor(_,D),V[_]=D)}function w(){const _=o.newAttributes,D=o.enabledAttributes;for(let z=0,B=D.length;z<B;z++)D[z]!==_[z]&&(n.disableVertexAttribArray(z),D[z]=0)}function M(_,D,z,B,V,H,J){J===!0?n.vertexAttribIPointer(_,D,z,V,H):n.vertexAttribPointer(_,D,z,B,V,H)}function x(_,D,z,B){v();const V=B.attributes,H=z.getAttributes(),J=D.defaultAttributeValues;for(const st in H){const $=H[st];if($.location>=0){let at=V[st];if(at===void 0&&(st==="instanceMatrix"&&_.instanceMatrix&&(at=_.instanceMatrix),st==="instanceColor"&&_.instanceColor&&(at=_.instanceColor)),at!==void 0){const Z=at.normalized,yt=at.itemSize,Wt=t.get(at);if(Wt===void 0)continue;const te=Wt.buffer,he=Wt.type,se=Wt.bytesPerElement,rt=he===n.INT||he===n.UNSIGNED_INT||at.gpuType===ec;if(at.isInterleavedBufferAttribute){const dt=at.data,It=dt.stride,Ht=at.offset;if(dt.isInstancedInterleavedBuffer){for(let zt=0;zt<$.locationSize;zt++)f($.location+zt,dt.meshPerAttribute);_.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let zt=0;zt<$.locationSize;zt++)m($.location+zt);n.bindBuffer(n.ARRAY_BUFFER,te);for(let zt=0;zt<$.locationSize;zt++)M($.location+zt,yt/$.locationSize,he,Z,It*se,(Ht+yt/$.locationSize*zt)*se,rt)}else{if(at.isInstancedBufferAttribute){for(let dt=0;dt<$.locationSize;dt++)f($.location+dt,at.meshPerAttribute);_.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let dt=0;dt<$.locationSize;dt++)m($.location+dt);n.bindBuffer(n.ARRAY_BUFFER,te);for(let dt=0;dt<$.locationSize;dt++)M($.location+dt,yt/$.locationSize,he,Z,yt*se,yt/$.locationSize*dt*se,rt)}}else if(J!==void 0){const Z=J[st];if(Z!==void 0)switch(Z.length){case 2:n.vertexAttrib2fv($.location,Z);break;case 3:n.vertexAttrib3fv($.location,Z);break;case 4:n.vertexAttrib4fv($.location,Z);break;default:n.vertexAttrib1fv($.location,Z)}}}}w()}function C(){T();for(const _ in i){const D=i[_];for(const z in D){const B=D[z];for(const V in B)h(B[V].object),delete B[V];delete D[z]}delete i[_]}}function P(_){if(i[_.id]===void 0)return;const D=i[_.id];for(const z in D){const B=D[z];for(const V in B)h(B[V].object),delete B[V];delete D[z]}delete i[_.id]}function I(_){for(const D in i){const z=i[D];if(z[_.id]===void 0)continue;const B=z[_.id];for(const V in B)h(B[V].object),delete B[V];delete z[_.id]}}function T(){b(),a=!0,o!==s&&(o=s,l(o.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:T,resetDefaultState:b,dispose:C,releaseStatesOfGeometry:P,releaseStatesOfProgram:I,initAttributes:v,enableAttribute:m,disableUnusedAttributes:w}}function xm(n,t,e){let i;function s(l){i=l}function o(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,u){u!==0&&(n.drawArraysInstanced(i,l,h,u),e.update(h,i,u))}function r(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,i,1)}function c(l,h,u,d){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(i,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,i,1)}}this.setMode=s,this.render=o,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function Mm(n,t,e,i){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const I=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(I){return!(I!==En&&i.convert(I)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(I){const T=I===Vs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==Ln&&i.convert(I)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==Vn&&!T)}function c(I){if(I==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),w=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),M=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),C=g>0,P=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:w,maxVaryings:M,maxFragmentUniforms:x,vertexTextures:C,maxSamples:P}}function ym(n){const t=this;let e=null,i=0,s=!1,o=!1;const a=new _i,r=new Kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||i!==0||s;return s=d,i=u.length,p},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,f=n.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const w=o?0:i,M=w*4;let x=f.clippingState||null;c.value=x,x=h(g,d,M,p);for(let C=0;C!==M;++C)x[C]=e[C];f.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=w}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(u,d,p,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const f=p+v*4,w=d.matrixWorldInverse;r.getNormalMatrix(w),(m===null||m.length<f)&&(m=new Float32Array(f));for(let M=0,x=p;M!==v;++M,x+=4)a.copy(u[M]).applyMatrix4(w,r),a.normal.toArray(m,x),m[x+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function bm(n){let t=new WeakMap;function e(a,r){return r===Qa?a.mapping=ts:r===tr&&(a.mapping=es),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===Qa||r===tr)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new kd(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:i,dispose:o}}const Yi=4,ol=[.125,.215,.35,.446,.526,.582],yi=20,Aa=new _c,al=new ae;let Ca=null,Pa=0,Ra=0,Ia=!1;const xi=(1+Math.sqrt(5))/2,Gi=1/xi,rl=[new N(-xi,Gi,0),new N(xi,Gi,0),new N(-Gi,0,xi),new N(Gi,0,xi),new N(0,xi,-Gi),new N(0,xi,Gi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Sm=new N;class cl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,s=100,o={}){const{size:a=256,position:r=Sm}=o;Ca=this._renderer.getRenderTarget(),Pa=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),Ia=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,s,c,r),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ul(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=hl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ca,Pa,Ra),this._renderer.xr.enabled=Ia,t.scissorTest=!1,yo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ts||t.mapping===es?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ca=this._renderer.getRenderTarget(),Pa=this._renderer.getActiveCubeFace(),Ra=this._renderer.getActiveMipmapLevel(),Ia=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:Vs,format:En,colorSpace:ns,depthBuffer:!1},s=ll(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ll(t,e,i);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=wm(o)),this._blurMaterial=Em(o,t,e)}return s}_compileMaterial(t){const e=new y(this._lodPlanes[0],t);this._renderer.compile(e,Aa)}_sceneToCubeUV(t,e,i,s,o){const c=new sn(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,p=u.toneMapping;u.getClearColor(al),u.toneMapping=ai,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new jo({name:"PMREM.Background",side:$e,depthWrite:!1,depthTest:!1}),m=new y(new G,v);let f=!1;const w=t.background;w?w.isColor&&(v.color.copy(w),t.background=null,f=!0):(v.color.copy(al),f=!0);for(let M=0;M<6;M++){const x=M%3;x===0?(c.up.set(0,l[M],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x+h[M],o.y,o.z)):x===1?(c.up.set(0,0,l[M]),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y+h[M],o.z)):(c.up.set(0,l[M],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y,o.z+h[M]));const C=this._cubeSize;yo(s,x*C,M>2?C:0,C,C),u.setRenderTarget(s),f&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=p,u.autoClear=d,t.background=w}_textureToCubeUV(t,e){const i=this._renderer,s=t.mapping===ts||t.mapping===es;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ul()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=hl());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new y(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const c=this._cubeSize;yo(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,Aa)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),r=rl[(s-o-1)%rl.length];this._blur(t,o-1,o,a,r)}e.autoClear=i}_blur(t,e,i,s,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,s,"latitudinal",o),this._halfBlur(a,t,i,i,s,"longitudinal",o)}_halfBlur(t,e,i,s,o,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new y(this._lodPlanes[s],l),d=l.uniforms,p=this._sizeLods[i]-1,g=isFinite(o)?Math.PI/(2*p):2*Math.PI/(2*yi-1),v=o/g,m=isFinite(o)?1+Math.floor(h*v):yi;m>yi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${yi}`);const f=[];let w=0;for(let I=0;I<yi;++I){const T=I/v,b=Math.exp(-T*T/2);f.push(b),I===0?w+=b:I<m&&(w+=2*b)}for(let I=0;I<f.length;I++)f[I]=f[I]/w;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=a==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-i;const x=this._sizeLods[s],C=3*x*(s>M-Yi?s-M+Yi:0),P=4*(this._cubeSize-x);yo(e,C,P,3*x,2*x),c.setRenderTarget(e),c.render(u,Aa)}}function wm(n){const t=[],e=[],i=[];let s=n;const o=n-Yi+1+ol.length;for(let a=0;a<o;a++){const r=Math.pow(2,s);e.push(r);let c=1/r;a>n-Yi?c=ol[a-n+Yi-1]:a===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,v=3,m=2,f=1,w=new Float32Array(v*g*p),M=new Float32Array(m*g*p),x=new Float32Array(f*g*p);for(let P=0;P<p;P++){const I=P%3*2/3-1,T=P>2?0:-1,b=[I,T,0,I+2/3,T,0,I+2/3,T+1,0,I,T,0,I+2/3,T+1,0,I,T+1,0];w.set(b,v*g*P),M.set(d,m*g*P);const _=[P,P,P,P,P,P];x.set(_,f*g*P)}const C=new Ie;C.setAttribute("position",new In(w,v)),C.setAttribute("uv",new In(M,m)),C.setAttribute("faceIndex",new In(x,f)),t.push(C),s>Yi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function ll(n,t,e){const i=new Ti(n,t,e);return i.texture.mapping=Wo,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function yo(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Em(n,t,e){const i=new Float32Array(yi),s=new N(0,1,0);return new ri({name:"SphericalGaussianBlur",defines:{n:yi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:xc(),fragmentShader:`

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
		`,blending:oi,depthTest:!1,depthWrite:!1})}function hl(){return new ri({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:xc(),fragmentShader:`

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
		`,blending:oi,depthTest:!1,depthWrite:!1})}function ul(){return new ri({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:xc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:oi,depthTest:!1,depthWrite:!1})}function xc(){return`

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
	`}function Tm(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===Qa||c===tr,h=c===ts||c===es;if(l||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new cl(n)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const p=r.image;return l&&p&&p.height>0||h&&p&&s(p)?(e===null&&(e=new cl(n)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",o),u.texture):null}}}return r}function s(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function o(r){const c=r.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Am(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const s=e(i);return s===null&&Us("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function Cm(n,t,e,i){const s={},o=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const p=o.get(d);p&&(t.remove(p),o.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const p in d)t.update(d[p],n.ARRAY_BUFFER)}function l(u){const d=[],p=u.index,g=u.attributes.position;let v=0;if(p!==null){const w=p.array;v=p.version;for(let M=0,x=w.length;M<x;M+=3){const C=w[M+0],P=w[M+1],I=w[M+2];d.push(C,P,P,I,I,C)}}else if(g!==void 0){const w=g.array;v=g.version;for(let M=0,x=w.length/3-1;M<x;M+=3){const C=M+0,P=M+1,I=M+2;d.push(C,P,P,I,I,C)}}else return;const m=new(yh(d)?Ah:Th)(d,1);m.version=v;const f=o.get(u);f&&t.remove(f),o.set(u,m)}function h(u){const d=o.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return o.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function Pm(n,t,e){let i;function s(d){i=d}let o,a;function r(d){o=d.type,a=d.bytesPerElement}function c(d,p){n.drawElements(i,p,o,d*a),e.update(p,i,1)}function l(d,p,g){g!==0&&(n.drawElementsInstanced(i,p,o,d*a,g),e.update(p,i,g))}function h(d,p,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,o,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];e.update(m,i,1)}function u(d,p,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)l(d[f]/a,p[f],v[f]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,o,d,0,v,0,g);let f=0;for(let w=0;w<g;w++)f+=p[w]*v[w];e.update(f,i,1)}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function Rm(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(o,a,r){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=r*(o/3);break;case n.LINES:e.lines+=r*(o/2);break;case n.LINE_STRIP:e.lines+=r*(o-1);break;case n.LINE_LOOP:e.lines+=r*o;break;case n.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Im(n,t,e){const i=new WeakMap,s=new Ee;function o(a,r,c){const l=a.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=i.get(r);if(d===void 0||d.count!==u){let _=function(){T.dispose(),i.delete(r),r.removeEventListener("dispose",_)};var p=_;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,v=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,f=r.morphAttributes.position||[],w=r.morphAttributes.normal||[],M=r.morphAttributes.color||[];let x=0;g===!0&&(x=1),v===!0&&(x=2),m===!0&&(x=3);let C=r.attributes.position.count*x,P=1;C>t.maxTextureSize&&(P=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const I=new Float32Array(C*P*4*u),T=new bh(I,C,P,u);T.type=Vn,T.needsUpdate=!0;const b=x*4;for(let D=0;D<u;D++){const z=f[D],B=w[D],V=M[D],H=C*P*4*D;for(let J=0;J<z.count;J++){const st=J*b;g===!0&&(s.fromBufferAttribute(z,J),I[H+st+0]=s.x,I[H+st+1]=s.y,I[H+st+2]=s.z,I[H+st+3]=0),v===!0&&(s.fromBufferAttribute(B,J),I[H+st+4]=s.x,I[H+st+5]=s.y,I[H+st+6]=s.z,I[H+st+7]=0),m===!0&&(s.fromBufferAttribute(V,J),I[H+st+8]=s.x,I[H+st+9]=s.y,I[H+st+10]=s.z,I[H+st+11]=V.itemSize===4?s.w:1)}}d={count:u,texture:T,size:new Tt(C,P)},i.set(r,d),r.addEventListener("dispose",_)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",v),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:o}}function Lm(n,t,e,i){let s=new WeakMap;function o(c){const l=i.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:a}}const jh=new Be,dl=new Dh(1,1),Yh=new bh,Zh=new Sd,Jh=new Rh,fl=[],pl=[],ml=new Float32Array(16),gl=new Float32Array(9),vl=new Float32Array(4);function ls(n,t,e){const i=n[0];if(i<=0||i>0)return n;const s=t*e;let o=fl[s];if(o===void 0&&(o=new Float32Array(s),fl[s]=o),t!==0){i.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,n[a].toArray(o,r)}return o}function Ce(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Pe(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function Jo(n,t){let e=pl[t];e===void 0&&(e=new Int32Array(t),pl[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Dm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Um(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2fv(this.addr,t),Pe(e,t)}}function Nm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ce(e,t))return;n.uniform3fv(this.addr,t),Pe(e,t)}}function zm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4fv(this.addr,t),Pe(e,t)}}function Fm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;vl.set(i),n.uniformMatrix2fv(this.addr,!1,vl),Pe(e,i)}}function Om(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;gl.set(i),n.uniformMatrix3fv(this.addr,!1,gl),Pe(e,i)}}function Bm(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Ce(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Pe(e,t)}else{if(Ce(e,i))return;ml.set(i),n.uniformMatrix4fv(this.addr,!1,ml),Pe(e,i)}}function km(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Vm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2iv(this.addr,t),Pe(e,t)}}function Hm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3iv(this.addr,t),Pe(e,t)}}function Gm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4iv(this.addr,t),Pe(e,t)}}function qm(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Wm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ce(e,t))return;n.uniform2uiv(this.addr,t),Pe(e,t)}}function Xm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ce(e,t))return;n.uniform3uiv(this.addr,t),Pe(e,t)}}function jm(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ce(e,t))return;n.uniform4uiv(this.addr,t),Pe(e,t)}}function Ym(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let o;this.type===n.SAMPLER_2D_SHADOW?(dl.compareFunction=Mh,o=dl):o=jh,e.setTexture2D(t||o,s)}function Zm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||Zh,s)}function Jm(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||Jh,s)}function $m(n,t,e){const i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||Yh,s)}function Km(n){switch(n){case 5126:return Dm;case 35664:return Um;case 35665:return Nm;case 35666:return zm;case 35674:return Fm;case 35675:return Om;case 35676:return Bm;case 5124:case 35670:return km;case 35667:case 35671:return Vm;case 35668:case 35672:return Hm;case 35669:case 35673:return Gm;case 5125:return qm;case 36294:return Wm;case 36295:return Xm;case 36296:return jm;case 35678:case 36198:case 36298:case 36306:case 35682:return Ym;case 35679:case 36299:case 36307:return Zm;case 35680:case 36300:case 36308:case 36293:return Jm;case 36289:case 36303:case 36311:case 36292:return $m}}function Qm(n,t){n.uniform1fv(this.addr,t)}function tg(n,t){const e=ls(t,this.size,2);n.uniform2fv(this.addr,e)}function eg(n,t){const e=ls(t,this.size,3);n.uniform3fv(this.addr,e)}function ng(n,t){const e=ls(t,this.size,4);n.uniform4fv(this.addr,e)}function ig(n,t){const e=ls(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function sg(n,t){const e=ls(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function og(n,t){const e=ls(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function ag(n,t){n.uniform1iv(this.addr,t)}function rg(n,t){n.uniform2iv(this.addr,t)}function cg(n,t){n.uniform3iv(this.addr,t)}function lg(n,t){n.uniform4iv(this.addr,t)}function hg(n,t){n.uniform1uiv(this.addr,t)}function ug(n,t){n.uniform2uiv(this.addr,t)}function dg(n,t){n.uniform3uiv(this.addr,t)}function fg(n,t){n.uniform4uiv(this.addr,t)}function pg(n,t,e){const i=this.cache,s=t.length,o=Jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||jh,o[a])}function mg(n,t,e){const i=this.cache,s=t.length,o=Jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Zh,o[a])}function gg(n,t,e){const i=this.cache,s=t.length,o=Jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||Jh,o[a])}function vg(n,t,e){const i=this.cache,s=t.length,o=Jo(e,s);Ce(i,o)||(n.uniform1iv(this.addr,o),Pe(i,o));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||Yh,o[a])}function _g(n){switch(n){case 5126:return Qm;case 35664:return tg;case 35665:return eg;case 35666:return ng;case 35674:return ig;case 35675:return sg;case 35676:return og;case 5124:case 35670:return ag;case 35667:case 35671:return rg;case 35668:case 35672:return cg;case 35669:case 35673:return lg;case 5125:return hg;case 36294:return ug;case 36295:return dg;case 36296:return fg;case 35678:case 36198:case 36298:case 36306:case 35682:return pg;case 35679:case 36299:case 36307:return mg;case 35680:case 36300:case 36308:case 36293:return gg;case 36289:case 36303:case 36311:case 36292:return vg}}class xg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Km(e.type)}}class Mg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=_g(e.type)}}class yg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const r=s[o];r.setValue(t,e[r.id],i)}}}const La=/(\w+)(\])?(\[|\.)?/g;function _l(n,t){n.seq.push(t),n.map[t.id]=t}function bg(n,t,e){const i=n.name,s=i.length;for(La.lastIndex=0;;){const o=La.exec(i),a=La.lastIndex;let r=o[1];const c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===s){_l(e,l===void 0?new xg(r,n,t):new Mg(r,n,t));break}else{let u=e.map[r];u===void 0&&(u=new yg(r),_l(e,u)),e=u}}}class Lo{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const o=t.getActiveUniform(e,s),a=t.getUniformLocation(e,o.name);bg(o,a,this)}}setValue(t,e,i,s){const o=this.map[e];o!==void 0&&o.setValue(t,i,s)}setOptional(t,e,i){const s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let o=0,a=e.length;o!==a;++o){const r=e[o],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const i=[];for(let s=0,o=t.length;s!==o;++s){const a=t[s];a.id in e&&i.push(a)}return i}}function xl(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Sg=37297;let wg=0;function Eg(n,t){const e=n.split(`
`),i=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=s;a<o;a++){const r=a+1;i.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return i.join(`
`)}const Ml=new Kt;function Tg(n){de._getMatrix(Ml,de.workingColorSpace,n);const t=`mat3( ${Ml.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(n)){case Fo:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function yl(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),o=(n.getShaderInfoLog(t)||"").trim();if(i&&o==="")return"";const a=/ERROR: 0:(\d+)/.exec(o);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+o+`

`+Eg(n.getShaderSource(t),r)}else return o}function Ag(n,t){const e=Tg(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Cg(n,t){let e;switch(t){case zu:e="Linear";break;case Fu:e="Reinhard";break;case Ou:e="Cineon";break;case Bu:e="ACESFilmic";break;case Vu:e="AgX";break;case Hu:e="Neutral";break;case ku:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const bo=new N;function Pg(){de.getLuminanceCoefficients(bo);const n=bo.x.toFixed(4),t=bo.y.toFixed(4),e=bo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Rg(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ss).join(`
`)}function Ig(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function Lg(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const o=n.getActiveAttrib(t,s),a=o.name;let r=1;o.type===n.FLOAT_MAT2&&(r=2),o.type===n.FLOAT_MAT3&&(r=3),o.type===n.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:n.getAttribLocation(t,a),locationSize:r}}return e}function Ss(n){return n!==""}function bl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Sl(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Dg=/^[ \t]*#include +<([\w\d./]+)>/gm;function zr(n){return n.replace(Dg,Ng)}const Ug=new Map;function Ng(n,t){let e=Qt[t];if(e===void 0){const i=Ug.get(t);if(i!==void 0)e=Qt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return zr(e)}const zg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wl(n){return n.replace(zg,Fg)}function Fg(n,t,e,i){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function El(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function Og(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===ch?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===lh?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Bn&&(t="SHADOWMAP_TYPE_VSM"),t}function Bg(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ts:case es:t="ENVMAP_TYPE_CUBE";break;case Wo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function kg(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case es:t="ENVMAP_MODE_REFRACTION";break}return t}function Vg(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case hh:t="ENVMAP_BLENDING_MULTIPLY";break;case Uu:t="ENVMAP_BLENDING_MIX";break;case Nu:t="ENVMAP_BLENDING_ADD";break}return t}function Hg(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Gg(n,t,e,i){const s=n.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=Og(e),l=Bg(e),h=kg(e),u=Vg(e),d=Hg(e),p=Rg(e),g=Ig(o),v=s.createProgram();let m,f,w=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ss).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ss).join(`
`),f.length>0&&(f+=`
`)):(m=[El(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ss).join(`
`),f=[El(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ai?"#define TONE_MAPPING":"",e.toneMapping!==ai?Qt.tonemapping_pars_fragment:"",e.toneMapping!==ai?Cg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,Ag("linearToOutputTexel",e.outputColorSpace),Pg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ss).join(`
`)),a=zr(a),a=bl(a,e),a=Sl(a,e),r=zr(r),r=bl(r,e),r=Sl(r,e),a=wl(a),r=wl(r),e.isRawShaderMaterial!==!0&&(w=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===Cc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Cc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const M=w+m+a,x=w+f+r,C=xl(s,s.VERTEX_SHADER,M),P=xl(s,s.FRAGMENT_SHADER,x);s.attachShader(v,C),s.attachShader(v,P),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function I(D){if(n.debug.checkShaderErrors){const z=s.getProgramInfoLog(v)||"",B=s.getShaderInfoLog(C)||"",V=s.getShaderInfoLog(P)||"",H=z.trim(),J=B.trim(),st=V.trim();let $=!0,at=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,C,P);else{const Z=yl(s,C,"vertex"),yt=yl(s,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+Z+`
`+yt)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(J===""||st==="")&&(at=!1);at&&(D.diagnostics={runnable:$,programLog:H,vertexShader:{log:J,prefix:m},fragmentShader:{log:st,prefix:f}})}s.deleteShader(C),s.deleteShader(P),T=new Lo(s,v),b=Lg(s,v)}let T;this.getUniforms=function(){return T===void 0&&I(this),T};let b;this.getAttributes=function(){return b===void 0&&I(this),b};let _=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=s.getProgramParameter(v,Sg)),_},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=wg++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=C,this.fragmentShader=P,this}let qg=0;class Wg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new Xg(t),e.set(t,i)),i}}class Xg{constructor(t){this.id=qg++,this.code=t,this.usedTimes=0}}function jg(n,t,e,i,s,o,a){const r=new wh,c=new Wg,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(b){return l.add(b),b===0?"uv":`uv${b}`}function m(b,_,D,z,B){const V=z.fog,H=B.geometry,J=b.isMeshStandardMaterial?z.environment:null,st=(b.isMeshStandardMaterial?e:t).get(b.envMap||J),$=st&&st.mapping===Wo?st.image.height:null,at=g[b.type];b.precision!==null&&(p=s.getMaxPrecision(b.precision),p!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",p,"instead."));const Z=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,yt=Z!==void 0?Z.length:0;let Wt=0;H.morphAttributes.position!==void 0&&(Wt=1),H.morphAttributes.normal!==void 0&&(Wt=2),H.morphAttributes.color!==void 0&&(Wt=3);let te,he,se,rt;if(at){const ce=An[at];te=ce.vertexShader,he=ce.fragmentShader}else te=b.vertexShader,he=b.fragmentShader,c.update(b),se=c.getVertexShaderID(b),rt=c.getFragmentShaderID(b);const dt=n.getRenderTarget(),It=n.state.buffers.depth.getReversed(),Ht=B.isInstancedMesh===!0,zt=B.isBatchedMesh===!0,ee=!!b.map,me=!!b.matcap,F=!!st,ft=!!b.aoMap,ht=!!b.lightMap,ct=!!b.bumpMap,Y=!!b.normalMap,bt=!!b.displacementMap,vt=!!b.emissiveMap,wt=!!b.metalnessMap,Xt=!!b.roughnessMap,Zt=b.anisotropy>0,U=b.clearcoat>0,E=b.dispersion>0,X=b.iridescence>0,Q=b.sheen>0,ut=b.transmission>0,it=Zt&&!!b.anisotropyMap,Ft=U&&!!b.clearcoatMap,St=U&&!!b.clearcoatNormalMap,Ot=U&&!!b.clearcoatRoughnessMap,Bt=X&&!!b.iridescenceMap,xt=X&&!!b.iridescenceThicknessMap,mt=Q&&!!b.sheenColorMap,Gt=Q&&!!b.sheenRoughnessMap,Nt=!!b.specularMap,At=!!b.specularColorMap,qt=!!b.specularIntensityMap,k=ut&&!!b.transmissionMap,Mt=ut&&!!b.thicknessMap,Et=!!b.gradientMap,Lt=!!b.alphaMap,pt=b.alphaTest>0,lt=!!b.alphaHash,Dt=!!b.extensions;let jt=ai;b.toneMapped&&(dt===null||dt.isXRRenderTarget===!0)&&(jt=n.toneMapping);const pe={shaderID:at,shaderType:b.type,shaderName:b.name,vertexShader:te,fragmentShader:he,defines:b.defines,customVertexShaderID:se,customFragmentShaderID:rt,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:p,batching:zt,batchingColor:zt&&B._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&B.instanceColor!==null,instancingMorph:Ht&&B.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:dt===null?n.outputColorSpace:dt.isXRRenderTarget===!0?dt.texture.colorSpace:ns,alphaToCoverage:!!b.alphaToCoverage,map:ee,matcap:me,envMap:F,envMapMode:F&&st.mapping,envMapCubeUVHeight:$,aoMap:ft,lightMap:ht,bumpMap:ct,normalMap:Y,displacementMap:d&&bt,emissiveMap:vt,normalMapObjectSpace:Y&&b.normalMapType===Xu,normalMapTangentSpace:Y&&b.normalMapType===xh,metalnessMap:wt,roughnessMap:Xt,anisotropy:Zt,anisotropyMap:it,clearcoat:U,clearcoatMap:Ft,clearcoatNormalMap:St,clearcoatRoughnessMap:Ot,dispersion:E,iridescence:X,iridescenceMap:Bt,iridescenceThicknessMap:xt,sheen:Q,sheenColorMap:mt,sheenRoughnessMap:Gt,specularMap:Nt,specularColorMap:At,specularIntensityMap:qt,transmission:ut,transmissionMap:k,thicknessMap:Mt,gradientMap:Et,opaque:b.transparent===!1&&b.blending===$i&&b.alphaToCoverage===!1,alphaMap:Lt,alphaTest:pt,alphaHash:lt,combine:b.combine,mapUv:ee&&v(b.map.channel),aoMapUv:ft&&v(b.aoMap.channel),lightMapUv:ht&&v(b.lightMap.channel),bumpMapUv:ct&&v(b.bumpMap.channel),normalMapUv:Y&&v(b.normalMap.channel),displacementMapUv:bt&&v(b.displacementMap.channel),emissiveMapUv:vt&&v(b.emissiveMap.channel),metalnessMapUv:wt&&v(b.metalnessMap.channel),roughnessMapUv:Xt&&v(b.roughnessMap.channel),anisotropyMapUv:it&&v(b.anisotropyMap.channel),clearcoatMapUv:Ft&&v(b.clearcoatMap.channel),clearcoatNormalMapUv:St&&v(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ot&&v(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Bt&&v(b.iridescenceMap.channel),iridescenceThicknessMapUv:xt&&v(b.iridescenceThicknessMap.channel),sheenColorMapUv:mt&&v(b.sheenColorMap.channel),sheenRoughnessMapUv:Gt&&v(b.sheenRoughnessMap.channel),specularMapUv:Nt&&v(b.specularMap.channel),specularColorMapUv:At&&v(b.specularColorMap.channel),specularIntensityMapUv:qt&&v(b.specularIntensityMap.channel),transmissionMapUv:k&&v(b.transmissionMap.channel),thicknessMapUv:Mt&&v(b.thicknessMap.channel),alphaMapUv:Lt&&v(b.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(Y||Zt),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!H.attributes.uv&&(ee||Lt),fog:!!V,useFog:b.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:b.flatShading===!0&&b.wireframe===!1,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:It,skinning:B.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:yt,morphTextureStride:Wt,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:b.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:jt,decodeVideoTexture:ee&&b.map.isVideoTexture===!0&&de.getTransfer(b.map.colorSpace)===ve,decodeVideoTextureEmissive:vt&&b.emissiveMap.isVideoTexture===!0&&de.getTransfer(b.emissiveMap.colorSpace)===ve,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===bn,flipSided:b.side===$e,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Dt&&b.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Dt&&b.extensions.multiDraw===!0||zt)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return pe.vertexUv1s=l.has(1),pe.vertexUv2s=l.has(2),pe.vertexUv3s=l.has(3),l.clear(),pe}function f(b){const _=[];if(b.shaderID?_.push(b.shaderID):(_.push(b.customVertexShaderID),_.push(b.customFragmentShaderID)),b.defines!==void 0)for(const D in b.defines)_.push(D),_.push(b.defines[D]);return b.isRawShaderMaterial===!1&&(w(_,b),M(_,b),_.push(n.outputColorSpace)),_.push(b.customProgramCacheKey),_.join()}function w(b,_){b.push(_.precision),b.push(_.outputColorSpace),b.push(_.envMapMode),b.push(_.envMapCubeUVHeight),b.push(_.mapUv),b.push(_.alphaMapUv),b.push(_.lightMapUv),b.push(_.aoMapUv),b.push(_.bumpMapUv),b.push(_.normalMapUv),b.push(_.displacementMapUv),b.push(_.emissiveMapUv),b.push(_.metalnessMapUv),b.push(_.roughnessMapUv),b.push(_.anisotropyMapUv),b.push(_.clearcoatMapUv),b.push(_.clearcoatNormalMapUv),b.push(_.clearcoatRoughnessMapUv),b.push(_.iridescenceMapUv),b.push(_.iridescenceThicknessMapUv),b.push(_.sheenColorMapUv),b.push(_.sheenRoughnessMapUv),b.push(_.specularMapUv),b.push(_.specularColorMapUv),b.push(_.specularIntensityMapUv),b.push(_.transmissionMapUv),b.push(_.thicknessMapUv),b.push(_.combine),b.push(_.fogExp2),b.push(_.sizeAttenuation),b.push(_.morphTargetsCount),b.push(_.morphAttributeCount),b.push(_.numDirLights),b.push(_.numPointLights),b.push(_.numSpotLights),b.push(_.numSpotLightMaps),b.push(_.numHemiLights),b.push(_.numRectAreaLights),b.push(_.numDirLightShadows),b.push(_.numPointLightShadows),b.push(_.numSpotLightShadows),b.push(_.numSpotLightShadowsWithMaps),b.push(_.numLightProbes),b.push(_.shadowMapType),b.push(_.toneMapping),b.push(_.numClippingPlanes),b.push(_.numClipIntersection),b.push(_.depthPacking)}function M(b,_){r.disableAll(),_.supportsVertexTextures&&r.enable(0),_.instancing&&r.enable(1),_.instancingColor&&r.enable(2),_.instancingMorph&&r.enable(3),_.matcap&&r.enable(4),_.envMap&&r.enable(5),_.normalMapObjectSpace&&r.enable(6),_.normalMapTangentSpace&&r.enable(7),_.clearcoat&&r.enable(8),_.iridescence&&r.enable(9),_.alphaTest&&r.enable(10),_.vertexColors&&r.enable(11),_.vertexAlphas&&r.enable(12),_.vertexUv1s&&r.enable(13),_.vertexUv2s&&r.enable(14),_.vertexUv3s&&r.enable(15),_.vertexTangents&&r.enable(16),_.anisotropy&&r.enable(17),_.alphaHash&&r.enable(18),_.batching&&r.enable(19),_.dispersion&&r.enable(20),_.batchingColor&&r.enable(21),_.gradientMap&&r.enable(22),b.push(r.mask),r.disableAll(),_.fog&&r.enable(0),_.useFog&&r.enable(1),_.flatShading&&r.enable(2),_.logarithmicDepthBuffer&&r.enable(3),_.reversedDepthBuffer&&r.enable(4),_.skinning&&r.enable(5),_.morphTargets&&r.enable(6),_.morphNormals&&r.enable(7),_.morphColors&&r.enable(8),_.premultipliedAlpha&&r.enable(9),_.shadowMapEnabled&&r.enable(10),_.doubleSided&&r.enable(11),_.flipSided&&r.enable(12),_.useDepthPacking&&r.enable(13),_.dithering&&r.enable(14),_.transmission&&r.enable(15),_.sheen&&r.enable(16),_.opaque&&r.enable(17),_.pointsUvs&&r.enable(18),_.decodeVideoTexture&&r.enable(19),_.decodeVideoTextureEmissive&&r.enable(20),_.alphaToCoverage&&r.enable(21),b.push(r.mask)}function x(b){const _=g[b.type];let D;if(_){const z=An[_];D=zd.clone(z.uniforms)}else D=b.uniforms;return D}function C(b,_){let D;for(let z=0,B=h.length;z<B;z++){const V=h[z];if(V.cacheKey===_){D=V,++D.usedTimes;break}}return D===void 0&&(D=new Gg(n,_,b,o),h.push(D)),D}function P(b){if(--b.usedTimes===0){const _=h.indexOf(b);h[_]=h[h.length-1],h.pop(),b.destroy()}}function I(b){c.remove(b)}function T(){c.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:x,acquireProgram:C,releaseProgram:P,releaseShaderCache:I,programs:h,dispose:T}}function Yg(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let r=n.get(a);return r===void 0&&(r={},n.set(a,r)),r}function i(a){n.delete(a)}function s(a,r,c){n.get(a)[r]=c}function o(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:o}}function Zg(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Tl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Al(){const n=[];let t=0;const e=[],i=[],s=[];function o(){t=0,e.length=0,i.length=0,s.length=0}function a(u,d,p,g,v,m){let f=n[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},n[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=v,f.group=m),t++,f}function r(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?i.push(f):p.transparent===!0?s.push(f):e.push(f)}function c(u,d,p,g,v,m){const f=a(u,d,p,g,v,m);p.transmission>0?i.unshift(f):p.transparent===!0?s.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||Zg),i.length>1&&i.sort(d||Tl),s.length>1&&s.sort(d||Tl)}function h(){for(let u=t,d=n.length;u<d;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:s,init:o,push:r,unshift:c,finish:h,sort:l}}function Jg(){let n=new WeakMap;function t(i,s){const o=n.get(i);let a;return o===void 0?(a=new Al,n.set(i,[a])):s>=o.length?(a=new Al,o.push(a)):a=o[s],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function $g(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new ae};break;case"SpotLight":e={position:new N,direction:new N,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new ae,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":e={color:new ae,position:new N,halfWidth:new N,halfHeight:new N};break}return n[t.id]=e,e}}}function Kg(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let Qg=0;function tv(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function ev(n){const t=new $g,e=Kg(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new N);const s=new N,o=new we,a=new we;function r(l){let h=0,u=0,d=0;for(let b=0;b<9;b++)i.probe[b].set(0,0,0);let p=0,g=0,v=0,m=0,f=0,w=0,M=0,x=0,C=0,P=0,I=0;l.sort(tv);for(let b=0,_=l.length;b<_;b++){const D=l[b],z=D.color,B=D.intensity,V=D.distance,H=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=z.r*B,u+=z.g*B,d+=z.b*B;else if(D.isLightProbe){for(let J=0;J<9;J++)i.probe[J].addScaledVector(D.sh.coefficients[J],B);I++}else if(D.isDirectionalLight){const J=t.get(D);if(J.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const st=D.shadow,$=e.get(D);$.shadowIntensity=st.intensity,$.shadowBias=st.bias,$.shadowNormalBias=st.normalBias,$.shadowRadius=st.radius,$.shadowMapSize=st.mapSize,i.directionalShadow[p]=$,i.directionalShadowMap[p]=H,i.directionalShadowMatrix[p]=D.shadow.matrix,w++}i.directional[p]=J,p++}else if(D.isSpotLight){const J=t.get(D);J.position.setFromMatrixPosition(D.matrixWorld),J.color.copy(z).multiplyScalar(B),J.distance=V,J.coneCos=Math.cos(D.angle),J.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),J.decay=D.decay,i.spot[v]=J;const st=D.shadow;if(D.map&&(i.spotLightMap[C]=D.map,C++,st.updateMatrices(D),D.castShadow&&P++),i.spotLightMatrix[v]=st.matrix,D.castShadow){const $=e.get(D);$.shadowIntensity=st.intensity,$.shadowBias=st.bias,$.shadowNormalBias=st.normalBias,$.shadowRadius=st.radius,$.shadowMapSize=st.mapSize,i.spotShadow[v]=$,i.spotShadowMap[v]=H,x++}v++}else if(D.isRectAreaLight){const J=t.get(D);J.color.copy(z).multiplyScalar(B),J.halfWidth.set(D.width*.5,0,0),J.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=J,m++}else if(D.isPointLight){const J=t.get(D);if(J.color.copy(D.color).multiplyScalar(D.intensity),J.distance=D.distance,J.decay=D.decay,D.castShadow){const st=D.shadow,$=e.get(D);$.shadowIntensity=st.intensity,$.shadowBias=st.bias,$.shadowNormalBias=st.normalBias,$.shadowRadius=st.radius,$.shadowMapSize=st.mapSize,$.shadowCameraNear=st.camera.near,$.shadowCameraFar=st.camera.far,i.pointShadow[g]=$,i.pointShadowMap[g]=H,i.pointShadowMatrix[g]=D.shadow.matrix,M++}i.point[g]=J,g++}else if(D.isHemisphereLight){const J=t.get(D);J.skyColor.copy(D.color).multiplyScalar(B),J.groundColor.copy(D.groundColor).multiplyScalar(B),i.hemi[f]=J,f++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Pt.LTC_FLOAT_1,i.rectAreaLTC2=Pt.LTC_FLOAT_2):(i.rectAreaLTC1=Pt.LTC_HALF_1,i.rectAreaLTC2=Pt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=d;const T=i.hash;(T.directionalLength!==p||T.pointLength!==g||T.spotLength!==v||T.rectAreaLength!==m||T.hemiLength!==f||T.numDirectionalShadows!==w||T.numPointShadows!==M||T.numSpotShadows!==x||T.numSpotMaps!==C||T.numLightProbes!==I)&&(i.directional.length=p,i.spot.length=v,i.rectArea.length=m,i.point.length=g,i.hemi.length=f,i.directionalShadow.length=w,i.directionalShadowMap.length=w,i.pointShadow.length=M,i.pointShadowMap.length=M,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=w,i.pointShadowMatrix.length=M,i.spotLightMatrix.length=x+C-P,i.spotLightMap.length=C,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=I,T.directionalLength=p,T.pointLength=g,T.spotLength=v,T.rectAreaLength=m,T.hemiLength=f,T.numDirectionalShadows=w,T.numPointShadows=M,T.numSpotShadows=x,T.numSpotMaps=C,T.numLightProbes=I,i.version=Qg++)}function c(l,h){let u=0,d=0,p=0,g=0,v=0;const m=h.matrixWorldInverse;for(let f=0,w=l.length;f<w;f++){const M=l[f];if(M.isDirectionalLight){const x=i.directional[u];x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(M.isSpotLight){const x=i.spot[p];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),p++}else if(M.isRectAreaLight){const x=i.rectArea[g];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),a.identity(),o.copy(M.matrixWorld),o.premultiply(m),a.extractRotation(o),x.halfWidth.set(M.width*.5,0,0),x.halfHeight.set(0,M.height*.5,0),x.halfWidth.applyMatrix4(a),x.halfHeight.applyMatrix4(a),g++}else if(M.isPointLight){const x=i.point[d];x.position.setFromMatrixPosition(M.matrixWorld),x.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const x=i.hemi[v];x.direction.setFromMatrixPosition(M.matrixWorld),x.direction.transformDirection(m),v++}}}return{setup:r,setupView:c,state:i}}function Cl(n){const t=new ev(n),e=[],i=[];function s(h){l.camera=h,e.length=0,i.length=0}function o(h){e.push(h)}function a(h){i.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:r,setupLightsView:c,pushLight:o,pushShadow:a}}function nv(n){let t=new WeakMap;function e(s,o=0){const a=t.get(s);let r;return a===void 0?(r=new Cl(n),t.set(s,[r])):o>=a.length?(r=new Cl(n),a.push(r)):r=a[o],r}function i(){t=new WeakMap}return{get:e,dispose:i}}const iv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,sv=`uniform sampler2D shadow_pass;
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
}`;function ov(n,t,e){let i=new uc;const s=new Tt,o=new Tt,a=new Ee,r=new Pf({depthPacking:Wu}),c=new Rf,l={},h=e.maxTextureSize,u={[Wn]:$e,[$e]:Wn,[bn]:bn},d=new ri({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Tt},radius:{value:4}},vertexShader:iv,fragmentShader:sv}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new Ie;g.setAttribute("position",new In(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new y(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ch;let f=this.type;this.render=function(P,I,T){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;const b=n.getRenderTarget(),_=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),z=n.state;z.setBlending(oi),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const B=f!==Bn&&this.type===Bn,V=f===Bn&&this.type!==Bn;for(let H=0,J=P.length;H<J;H++){const st=P[H],$=st.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",st,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const at=$.getFrameExtents();if(s.multiply(at),o.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/at.x),s.x=o.x*at.x,$.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/at.y),s.y=o.y*at.y,$.mapSize.y=o.y)),$.map===null||B===!0||V===!0){const yt=this.type!==Bn?{minFilter:je,magFilter:je}:{};$.map!==null&&$.map.dispose(),$.map=new Ti(s.x,s.y,yt),$.map.texture.name=st.name+".shadowMap",$.camera.updateProjectionMatrix()}n.setRenderTarget($.map),n.clear();const Z=$.getViewportCount();for(let yt=0;yt<Z;yt++){const Wt=$.getViewport(yt);a.set(o.x*Wt.x,o.y*Wt.y,o.x*Wt.z,o.y*Wt.w),z.viewport(a),$.updateMatrices(st,yt),i=$.getFrustum(),x(I,T,$.camera,st,this.type)}$.isPointLightShadow!==!0&&this.type===Bn&&w($,T),$.needsUpdate=!1}f=this.type,m.needsUpdate=!1,n.setRenderTarget(b,_,D)};function w(P,I){const T=t.update(v);d.defines.VSM_SAMPLES!==P.blurSamples&&(d.defines.VSM_SAMPLES=P.blurSamples,p.defines.VSM_SAMPLES=P.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Ti(s.x,s.y)),d.uniforms.shadow_pass.value=P.map.texture,d.uniforms.resolution.value=P.mapSize,d.uniforms.radius.value=P.radius,n.setRenderTarget(P.mapPass),n.clear(),n.renderBufferDirect(I,null,T,d,v,null),p.uniforms.shadow_pass.value=P.mapPass.texture,p.uniforms.resolution.value=P.mapSize,p.uniforms.radius.value=P.radius,n.setRenderTarget(P.map),n.clear(),n.renderBufferDirect(I,null,T,p,v,null)}function M(P,I,T,b){let _=null;const D=T.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(D!==void 0)_=D;else if(_=T.isPointLight===!0?c:r,n.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){const z=_.uuid,B=I.uuid;let V=l[z];V===void 0&&(V={},l[z]=V);let H=V[B];H===void 0&&(H=_.clone(),V[B]=H,I.addEventListener("dispose",C)),_=H}if(_.visible=I.visible,_.wireframe=I.wireframe,b===Bn?_.side=I.shadowSide!==null?I.shadowSide:I.side:_.side=I.shadowSide!==null?I.shadowSide:u[I.side],_.alphaMap=I.alphaMap,_.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,_.map=I.map,_.clipShadows=I.clipShadows,_.clippingPlanes=I.clippingPlanes,_.clipIntersection=I.clipIntersection,_.displacementMap=I.displacementMap,_.displacementScale=I.displacementScale,_.displacementBias=I.displacementBias,_.wireframeLinewidth=I.wireframeLinewidth,_.linewidth=I.linewidth,T.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const z=n.properties.get(_);z.light=T}return _}function x(P,I,T,b,_){if(P.visible===!1)return;if(P.layers.test(I.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&_===Bn)&&(!P.frustumCulled||i.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,P.matrixWorld);const B=t.update(P),V=P.material;if(Array.isArray(V)){const H=B.groups;for(let J=0,st=H.length;J<st;J++){const $=H[J],at=V[$.materialIndex];if(at&&at.visible){const Z=M(P,at,b,_);P.onBeforeShadow(n,P,I,T,B,Z,$),n.renderBufferDirect(T,null,B,Z,P,$),P.onAfterShadow(n,P,I,T,B,Z,$)}}}else if(V.visible){const H=M(P,V,b,_);P.onBeforeShadow(n,P,I,T,B,H,null),n.renderBufferDirect(T,null,B,H,P,null),P.onAfterShadow(n,P,I,T,B,H,null)}}const z=P.children;for(let B=0,V=z.length;B<V;B++)x(z[B],I,T,b,_)}function C(P){P.target.removeEventListener("dispose",C);for(const T in l){const b=l[T],_=P.target.uuid;_ in b&&(b[_].dispose(),delete b[_])}}}const av={[Xa]:ja,[Ya]:$a,[Za]:Ka,[Qi]:Ja,[ja]:Xa,[$a]:Ya,[Ka]:Za,[Ja]:Qi};function rv(n,t){function e(){let k=!1;const Mt=new Ee;let Et=null;const Lt=new Ee(0,0,0,0);return{setMask:function(pt){Et!==pt&&!k&&(n.colorMask(pt,pt,pt,pt),Et=pt)},setLocked:function(pt){k=pt},setClear:function(pt,lt,Dt,jt,pe){pe===!0&&(pt*=jt,lt*=jt,Dt*=jt),Mt.set(pt,lt,Dt,jt),Lt.equals(Mt)===!1&&(n.clearColor(pt,lt,Dt,jt),Lt.copy(Mt))},reset:function(){k=!1,Et=null,Lt.set(-1,0,0,0)}}}function i(){let k=!1,Mt=!1,Et=null,Lt=null,pt=null;return{setReversed:function(lt){if(Mt!==lt){const Dt=t.get("EXT_clip_control");lt?Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.ZERO_TO_ONE_EXT):Dt.clipControlEXT(Dt.LOWER_LEFT_EXT,Dt.NEGATIVE_ONE_TO_ONE_EXT),Mt=lt;const jt=pt;pt=null,this.setClear(jt)}},getReversed:function(){return Mt},setTest:function(lt){lt?dt(n.DEPTH_TEST):It(n.DEPTH_TEST)},setMask:function(lt){Et!==lt&&!k&&(n.depthMask(lt),Et=lt)},setFunc:function(lt){if(Mt&&(lt=av[lt]),Lt!==lt){switch(lt){case Xa:n.depthFunc(n.NEVER);break;case ja:n.depthFunc(n.ALWAYS);break;case Ya:n.depthFunc(n.LESS);break;case Qi:n.depthFunc(n.LEQUAL);break;case Za:n.depthFunc(n.EQUAL);break;case Ja:n.depthFunc(n.GEQUAL);break;case $a:n.depthFunc(n.GREATER);break;case Ka:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Lt=lt}},setLocked:function(lt){k=lt},setClear:function(lt){pt!==lt&&(Mt&&(lt=1-lt),n.clearDepth(lt),pt=lt)},reset:function(){k=!1,Et=null,Lt=null,pt=null,Mt=!1}}}function s(){let k=!1,Mt=null,Et=null,Lt=null,pt=null,lt=null,Dt=null,jt=null,pe=null;return{setTest:function(ce){k||(ce?dt(n.STENCIL_TEST):It(n.STENCIL_TEST))},setMask:function(ce){Mt!==ce&&!k&&(n.stencilMask(ce),Mt=ce)},setFunc:function(ce,on,Ke){(Et!==ce||Lt!==on||pt!==Ke)&&(n.stencilFunc(ce,on,Ke),Et=ce,Lt=on,pt=Ke)},setOp:function(ce,on,Ke){(lt!==ce||Dt!==on||jt!==Ke)&&(n.stencilOp(ce,on,Ke),lt=ce,Dt=on,jt=Ke)},setLocked:function(ce){k=ce},setClear:function(ce){pe!==ce&&(n.clearStencil(ce),pe=ce)},reset:function(){k=!1,Mt=null,Et=null,Lt=null,pt=null,lt=null,Dt=null,jt=null,pe=null}}}const o=new e,a=new i,r=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,w=null,M=null,x=null,C=null,P=null,I=new ae(0,0,0),T=0,b=!1,_=null,D=null,z=null,B=null,V=null;const H=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let J=!1,st=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(st=parseFloat(/^WebGL (\d)/.exec($)[1]),J=st>=1):$.indexOf("OpenGL ES")!==-1&&(st=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),J=st>=2);let at=null,Z={};const yt=n.getParameter(n.SCISSOR_BOX),Wt=n.getParameter(n.VIEWPORT),te=new Ee().fromArray(yt),he=new Ee().fromArray(Wt);function se(k,Mt,Et,Lt){const pt=new Uint8Array(4),lt=n.createTexture();n.bindTexture(k,lt),n.texParameteri(k,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(k,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Dt=0;Dt<Et;Dt++)k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?n.texImage3D(Mt,0,n.RGBA,1,1,Lt,0,n.RGBA,n.UNSIGNED_BYTE,pt):n.texImage2D(Mt+Dt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,pt);return lt}const rt={};rt[n.TEXTURE_2D]=se(n.TEXTURE_2D,n.TEXTURE_2D,1),rt[n.TEXTURE_CUBE_MAP]=se(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),rt[n.TEXTURE_2D_ARRAY]=se(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),rt[n.TEXTURE_3D]=se(n.TEXTURE_3D,n.TEXTURE_3D,1,1),o.setClear(0,0,0,1),a.setClear(1),r.setClear(0),dt(n.DEPTH_TEST),a.setFunc(Qi),ct(!1),Y(bc),dt(n.CULL_FACE),ft(oi);function dt(k){h[k]!==!0&&(n.enable(k),h[k]=!0)}function It(k){h[k]!==!1&&(n.disable(k),h[k]=!1)}function Ht(k,Mt){return u[k]!==Mt?(n.bindFramebuffer(k,Mt),u[k]=Mt,k===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=Mt),k===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=Mt),!0):!1}function zt(k,Mt){let Et=p,Lt=!1;if(k){Et=d.get(Mt),Et===void 0&&(Et=[],d.set(Mt,Et));const pt=k.textures;if(Et.length!==pt.length||Et[0]!==n.COLOR_ATTACHMENT0){for(let lt=0,Dt=pt.length;lt<Dt;lt++)Et[lt]=n.COLOR_ATTACHMENT0+lt;Et.length=pt.length,Lt=!0}}else Et[0]!==n.BACK&&(Et[0]=n.BACK,Lt=!0);Lt&&n.drawBuffers(Et)}function ee(k){return g!==k?(n.useProgram(k),g=k,!0):!1}const me={[Mi]:n.FUNC_ADD,[vu]:n.FUNC_SUBTRACT,[_u]:n.FUNC_REVERSE_SUBTRACT};me[xu]=n.MIN,me[Mu]=n.MAX;const F={[yu]:n.ZERO,[bu]:n.ONE,[Su]:n.SRC_COLOR,[qa]:n.SRC_ALPHA,[Pu]:n.SRC_ALPHA_SATURATE,[Au]:n.DST_COLOR,[Eu]:n.DST_ALPHA,[wu]:n.ONE_MINUS_SRC_COLOR,[Wa]:n.ONE_MINUS_SRC_ALPHA,[Cu]:n.ONE_MINUS_DST_COLOR,[Tu]:n.ONE_MINUS_DST_ALPHA,[Ru]:n.CONSTANT_COLOR,[Iu]:n.ONE_MINUS_CONSTANT_COLOR,[Lu]:n.CONSTANT_ALPHA,[Du]:n.ONE_MINUS_CONSTANT_ALPHA};function ft(k,Mt,Et,Lt,pt,lt,Dt,jt,pe,ce){if(k===oi){v===!0&&(It(n.BLEND),v=!1);return}if(v===!1&&(dt(n.BLEND),v=!0),k!==gu){if(k!==m||ce!==b){if((f!==Mi||x!==Mi)&&(n.blendEquation(n.FUNC_ADD),f=Mi,x=Mi),ce)switch(k){case $i:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Sc:n.blendFunc(n.ONE,n.ONE);break;case wc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ec:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case $i:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Sc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case wc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ec:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}w=null,M=null,C=null,P=null,I.set(0,0,0),T=0,m=k,b=ce}return}pt=pt||Mt,lt=lt||Et,Dt=Dt||Lt,(Mt!==f||pt!==x)&&(n.blendEquationSeparate(me[Mt],me[pt]),f=Mt,x=pt),(Et!==w||Lt!==M||lt!==C||Dt!==P)&&(n.blendFuncSeparate(F[Et],F[Lt],F[lt],F[Dt]),w=Et,M=Lt,C=lt,P=Dt),(jt.equals(I)===!1||pe!==T)&&(n.blendColor(jt.r,jt.g,jt.b,pe),I.copy(jt),T=pe),m=k,b=!1}function ht(k,Mt){k.side===bn?It(n.CULL_FACE):dt(n.CULL_FACE);let Et=k.side===$e;Mt&&(Et=!Et),ct(Et),k.blending===$i&&k.transparent===!1?ft(oi):ft(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),a.setFunc(k.depthFunc),a.setTest(k.depthTest),a.setMask(k.depthWrite),o.setMask(k.colorWrite);const Lt=k.stencilWrite;r.setTest(Lt),Lt&&(r.setMask(k.stencilWriteMask),r.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),r.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),vt(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?dt(n.SAMPLE_ALPHA_TO_COVERAGE):It(n.SAMPLE_ALPHA_TO_COVERAGE)}function ct(k){_!==k&&(k?n.frontFace(n.CW):n.frontFace(n.CCW),_=k)}function Y(k){k!==pu?(dt(n.CULL_FACE),k!==D&&(k===bc?n.cullFace(n.BACK):k===mu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):It(n.CULL_FACE),D=k}function bt(k){k!==z&&(J&&n.lineWidth(k),z=k)}function vt(k,Mt,Et){k?(dt(n.POLYGON_OFFSET_FILL),(B!==Mt||V!==Et)&&(n.polygonOffset(Mt,Et),B=Mt,V=Et)):It(n.POLYGON_OFFSET_FILL)}function wt(k){k?dt(n.SCISSOR_TEST):It(n.SCISSOR_TEST)}function Xt(k){k===void 0&&(k=n.TEXTURE0+H-1),at!==k&&(n.activeTexture(k),at=k)}function Zt(k,Mt,Et){Et===void 0&&(at===null?Et=n.TEXTURE0+H-1:Et=at);let Lt=Z[Et];Lt===void 0&&(Lt={type:void 0,texture:void 0},Z[Et]=Lt),(Lt.type!==k||Lt.texture!==Mt)&&(at!==Et&&(n.activeTexture(Et),at=Et),n.bindTexture(k,Mt||rt[k]),Lt.type=k,Lt.texture=Mt)}function U(){const k=Z[at];k!==void 0&&k.type!==void 0&&(n.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function E(){try{n.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function X(){try{n.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Q(){try{n.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ut(){try{n.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function it(){try{n.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ft(){try{n.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function St(){try{n.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ot(){try{n.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Bt(){try{n.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function xt(){try{n.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function mt(k){te.equals(k)===!1&&(n.scissor(k.x,k.y,k.z,k.w),te.copy(k))}function Gt(k){he.equals(k)===!1&&(n.viewport(k.x,k.y,k.z,k.w),he.copy(k))}function Nt(k,Mt){let Et=l.get(Mt);Et===void 0&&(Et=new WeakMap,l.set(Mt,Et));let Lt=Et.get(k);Lt===void 0&&(Lt=n.getUniformBlockIndex(Mt,k.name),Et.set(k,Lt))}function At(k,Mt){const Lt=l.get(Mt).get(k);c.get(Mt)!==Lt&&(n.uniformBlockBinding(Mt,Lt,k.__bindingPointIndex),c.set(Mt,Lt))}function qt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},at=null,Z={},u={},d=new WeakMap,p=[],g=null,v=!1,m=null,f=null,w=null,M=null,x=null,C=null,P=null,I=new ae(0,0,0),T=0,b=!1,_=null,D=null,z=null,B=null,V=null,te.set(0,0,n.canvas.width,n.canvas.height),he.set(0,0,n.canvas.width,n.canvas.height),o.reset(),a.reset(),r.reset()}return{buffers:{color:o,depth:a,stencil:r},enable:dt,disable:It,bindFramebuffer:Ht,drawBuffers:zt,useProgram:ee,setBlending:ft,setMaterial:ht,setFlipSided:ct,setCullFace:Y,setLineWidth:bt,setPolygonOffset:vt,setScissorTest:wt,activeTexture:Xt,bindTexture:Zt,unbindTexture:U,compressedTexImage2D:E,compressedTexImage3D:X,texImage2D:Bt,texImage3D:xt,updateUBOMapping:Nt,uniformBlockBinding:At,texStorage2D:St,texStorage3D:Ot,texSubImage2D:Q,texSubImage3D:ut,compressedTexSubImage2D:it,compressedTexSubImage3D:Ft,scissor:mt,viewport:Gt,reset:qt}}function cv(n,t,e,i,s,o,a){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Tt,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(U,E){return p?new OffscreenCanvas(U,E):Bo("canvas")}function v(U,E,X){let Q=1;const ut=Zt(U);if((ut.width>X||ut.height>X)&&(Q=X/Math.max(ut.width,ut.height)),Q<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const it=Math.floor(Q*ut.width),Ft=Math.floor(Q*ut.height);u===void 0&&(u=g(it,Ft));const St=E?g(it,Ft):u;return St.width=it,St.height=Ft,St.getContext("2d").drawImage(U,0,0,it,Ft),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ut.width+"x"+ut.height+") to ("+it+"x"+Ft+")."),St}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ut.width+"x"+ut.height+")."),U;return U}function m(U){return U.generateMipmaps}function f(U){n.generateMipmap(U)}function w(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function M(U,E,X,Q,ut=!1){if(U!==null){if(n[U]!==void 0)return n[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let it=E;if(E===n.RED&&(X===n.FLOAT&&(it=n.R32F),X===n.HALF_FLOAT&&(it=n.R16F),X===n.UNSIGNED_BYTE&&(it=n.R8)),E===n.RED_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.R8UI),X===n.UNSIGNED_SHORT&&(it=n.R16UI),X===n.UNSIGNED_INT&&(it=n.R32UI),X===n.BYTE&&(it=n.R8I),X===n.SHORT&&(it=n.R16I),X===n.INT&&(it=n.R32I)),E===n.RG&&(X===n.FLOAT&&(it=n.RG32F),X===n.HALF_FLOAT&&(it=n.RG16F),X===n.UNSIGNED_BYTE&&(it=n.RG8)),E===n.RG_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.RG8UI),X===n.UNSIGNED_SHORT&&(it=n.RG16UI),X===n.UNSIGNED_INT&&(it=n.RG32UI),X===n.BYTE&&(it=n.RG8I),X===n.SHORT&&(it=n.RG16I),X===n.INT&&(it=n.RG32I)),E===n.RGB_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.RGB8UI),X===n.UNSIGNED_SHORT&&(it=n.RGB16UI),X===n.UNSIGNED_INT&&(it=n.RGB32UI),X===n.BYTE&&(it=n.RGB8I),X===n.SHORT&&(it=n.RGB16I),X===n.INT&&(it=n.RGB32I)),E===n.RGBA_INTEGER&&(X===n.UNSIGNED_BYTE&&(it=n.RGBA8UI),X===n.UNSIGNED_SHORT&&(it=n.RGBA16UI),X===n.UNSIGNED_INT&&(it=n.RGBA32UI),X===n.BYTE&&(it=n.RGBA8I),X===n.SHORT&&(it=n.RGBA16I),X===n.INT&&(it=n.RGBA32I)),E===n.RGB&&(X===n.UNSIGNED_INT_5_9_9_9_REV&&(it=n.RGB9_E5),X===n.UNSIGNED_INT_10F_11F_11F_REV&&(it=n.R11F_G11F_B10F)),E===n.RGBA){const Ft=ut?Fo:de.getTransfer(Q);X===n.FLOAT&&(it=n.RGBA32F),X===n.HALF_FLOAT&&(it=n.RGBA16F),X===n.UNSIGNED_BYTE&&(it=Ft===ve?n.SRGB8_ALPHA8:n.RGBA8),X===n.UNSIGNED_SHORT_4_4_4_4&&(it=n.RGBA4),X===n.UNSIGNED_SHORT_5_5_5_1&&(it=n.RGB5_A1)}return(it===n.R16F||it===n.R32F||it===n.RG16F||it===n.RG32F||it===n.RGBA16F||it===n.RGBA32F)&&t.get("EXT_color_buffer_float"),it}function x(U,E){let X;return U?E===null||E===Ei||E===Rs?X=n.DEPTH24_STENCIL8:E===Vn?X=n.DEPTH32F_STENCIL8:E===Ps&&(X=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ei||E===Rs?X=n.DEPTH_COMPONENT24:E===Vn?X=n.DEPTH_COMPONENT32F:E===Ps&&(X=n.DEPTH_COMPONENT16),X}function C(U,E){return m(U)===!0||U.isFramebufferTexture&&U.minFilter!==je&&U.minFilter!==Cn?Math.log2(Math.max(E.width,E.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?E.mipmaps.length:1}function P(U){const E=U.target;E.removeEventListener("dispose",P),T(E),E.isVideoTexture&&h.delete(E)}function I(U){const E=U.target;E.removeEventListener("dispose",I),_(E)}function T(U){const E=i.get(U);if(E.__webglInit===void 0)return;const X=U.source,Q=d.get(X);if(Q){const ut=Q[E.__cacheKey];ut.usedTimes--,ut.usedTimes===0&&b(U),Object.keys(Q).length===0&&d.delete(X)}i.remove(U)}function b(U){const E=i.get(U);n.deleteTexture(E.__webglTexture);const X=U.source,Q=d.get(X);delete Q[E.__cacheKey],a.memory.textures--}function _(U){const E=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(E.__webglFramebuffer[Q]))for(let ut=0;ut<E.__webglFramebuffer[Q].length;ut++)n.deleteFramebuffer(E.__webglFramebuffer[Q][ut]);else n.deleteFramebuffer(E.__webglFramebuffer[Q]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[Q])}else{if(Array.isArray(E.__webglFramebuffer))for(let Q=0;Q<E.__webglFramebuffer.length;Q++)n.deleteFramebuffer(E.__webglFramebuffer[Q]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Q=0;Q<E.__webglColorRenderbuffer.length;Q++)E.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[Q]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const X=U.textures;for(let Q=0,ut=X.length;Q<ut;Q++){const it=i.get(X[Q]);it.__webglTexture&&(n.deleteTexture(it.__webglTexture),a.memory.textures--),i.remove(X[Q])}i.remove(U)}let D=0;function z(){D=0}function B(){const U=D;return U>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+s.maxTextures),D+=1,U}function V(U){const E=[];return E.push(U.wrapS),E.push(U.wrapT),E.push(U.wrapR||0),E.push(U.magFilter),E.push(U.minFilter),E.push(U.anisotropy),E.push(U.internalFormat),E.push(U.format),E.push(U.type),E.push(U.generateMipmaps),E.push(U.premultiplyAlpha),E.push(U.flipY),E.push(U.unpackAlignment),E.push(U.colorSpace),E.join()}function H(U,E){const X=i.get(U);if(U.isVideoTexture&&wt(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&X.__version!==U.version){const Q=U.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{rt(X,U,E);return}}else U.isExternalTexture&&(X.__webglTexture=U.sourceTexture?U.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,X.__webglTexture,n.TEXTURE0+E)}function J(U,E){const X=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&X.__version!==U.version){rt(X,U,E);return}e.bindTexture(n.TEXTURE_2D_ARRAY,X.__webglTexture,n.TEXTURE0+E)}function st(U,E){const X=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&X.__version!==U.version){rt(X,U,E);return}e.bindTexture(n.TEXTURE_3D,X.__webglTexture,n.TEXTURE0+E)}function $(U,E){const X=i.get(U);if(U.version>0&&X.__version!==U.version){dt(X,U,E);return}e.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture,n.TEXTURE0+E)}const at={[er]:n.REPEAT,[bi]:n.CLAMP_TO_EDGE,[nr]:n.MIRRORED_REPEAT},Z={[je]:n.NEAREST,[Gu]:n.NEAREST_MIPMAP_NEAREST,[Js]:n.NEAREST_MIPMAP_LINEAR,[Cn]:n.LINEAR,[Qo]:n.LINEAR_MIPMAP_NEAREST,[Si]:n.LINEAR_MIPMAP_LINEAR},yt={[ju]:n.NEVER,[Qu]:n.ALWAYS,[Yu]:n.LESS,[Mh]:n.LEQUAL,[Zu]:n.EQUAL,[Ku]:n.GEQUAL,[Ju]:n.GREATER,[$u]:n.NOTEQUAL};function Wt(U,E){if(E.type===Vn&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===Cn||E.magFilter===Qo||E.magFilter===Js||E.magFilter===Si||E.minFilter===Cn||E.minFilter===Qo||E.minFilter===Js||E.minFilter===Si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,at[E.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,at[E.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,at[E.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,Z[E.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,Z[E.minFilter]),E.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,yt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===je||E.minFilter!==Js&&E.minFilter!==Si||E.type===Vn&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const X=t.get("EXT_texture_filter_anisotropic");n.texParameterf(U,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function te(U,E){let X=!1;U.__webglInit===void 0&&(U.__webglInit=!0,E.addEventListener("dispose",P));const Q=E.source;let ut=d.get(Q);ut===void 0&&(ut={},d.set(Q,ut));const it=V(E);if(it!==U.__cacheKey){ut[it]===void 0&&(ut[it]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,X=!0),ut[it].usedTimes++;const Ft=ut[U.__cacheKey];Ft!==void 0&&(ut[U.__cacheKey].usedTimes--,Ft.usedTimes===0&&b(E)),U.__cacheKey=it,U.__webglTexture=ut[it].texture}return X}function he(U,E,X){return Math.floor(Math.floor(U/X)/E)}function se(U,E,X,Q){const it=U.updateRanges;if(it.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,E.width,E.height,X,Q,E.data);else{it.sort((xt,mt)=>xt.start-mt.start);let Ft=0;for(let xt=1;xt<it.length;xt++){const mt=it[Ft],Gt=it[xt],Nt=mt.start+mt.count,At=he(Gt.start,E.width,4),qt=he(mt.start,E.width,4);Gt.start<=Nt+1&&At===qt&&he(Gt.start+Gt.count-1,E.width,4)===At?mt.count=Math.max(mt.count,Gt.start+Gt.count-mt.start):(++Ft,it[Ft]=Gt)}it.length=Ft+1;const St=n.getParameter(n.UNPACK_ROW_LENGTH),Ot=n.getParameter(n.UNPACK_SKIP_PIXELS),Bt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,E.width);for(let xt=0,mt=it.length;xt<mt;xt++){const Gt=it[xt],Nt=Math.floor(Gt.start/4),At=Math.ceil(Gt.count/4),qt=Nt%E.width,k=Math.floor(Nt/E.width),Mt=At,Et=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,qt),n.pixelStorei(n.UNPACK_SKIP_ROWS,k),e.texSubImage2D(n.TEXTURE_2D,0,qt,k,Mt,Et,X,Q,E.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,St),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ot),n.pixelStorei(n.UNPACK_SKIP_ROWS,Bt)}}function rt(U,E,X){let Q=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Q=n.TEXTURE_3D);const ut=te(U,E),it=E.source;e.bindTexture(Q,U.__webglTexture,n.TEXTURE0+X);const Ft=i.get(it);if(it.version!==Ft.__version||ut===!0){e.activeTexture(n.TEXTURE0+X);const St=de.getPrimaries(de.workingColorSpace),Ot=E.colorSpace===ii?null:de.getPrimaries(E.colorSpace),Bt=E.colorSpace===ii||St===Ot?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Bt);let xt=v(E.image,!1,s.maxTextureSize);xt=Xt(E,xt);const mt=o.convert(E.format,E.colorSpace),Gt=o.convert(E.type);let Nt=M(E.internalFormat,mt,Gt,E.colorSpace,E.isVideoTexture);Wt(Q,E);let At;const qt=E.mipmaps,k=E.isVideoTexture!==!0,Mt=Ft.__version===void 0||ut===!0,Et=it.dataReady,Lt=C(E,xt);if(E.isDepthTexture)Nt=x(E.format===Ls,E.type),Mt&&(k?e.texStorage2D(n.TEXTURE_2D,1,Nt,xt.width,xt.height):e.texImage2D(n.TEXTURE_2D,0,Nt,xt.width,xt.height,0,mt,Gt,null));else if(E.isDataTexture)if(qt.length>0){k&&Mt&&e.texStorage2D(n.TEXTURE_2D,Lt,Nt,qt[0].width,qt[0].height);for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,Gt,At.data):e.texImage2D(n.TEXTURE_2D,pt,Nt,At.width,At.height,0,mt,Gt,At.data);E.generateMipmaps=!1}else k?(Mt&&e.texStorage2D(n.TEXTURE_2D,Lt,Nt,xt.width,xt.height),Et&&se(E,xt,mt,Gt)):e.texImage2D(n.TEXTURE_2D,0,Nt,xt.width,xt.height,0,mt,Gt,xt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){k&&Mt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Lt,Nt,qt[0].width,qt[0].height,xt.depth);for(let pt=0,lt=qt.length;pt<lt;pt++)if(At=qt[pt],E.format!==En)if(mt!==null)if(k){if(Et)if(E.layerUpdates.size>0){const Dt=sl(At.width,At.height,E.format,E.type);for(const jt of E.layerUpdates){const pe=At.data.subarray(jt*Dt/At.data.BYTES_PER_ELEMENT,(jt+1)*Dt/At.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,jt,At.width,At.height,1,mt,pe)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,0,At.width,At.height,xt.depth,mt,At.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,pt,Nt,At.width,At.height,xt.depth,0,At.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?Et&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,pt,0,0,0,At.width,At.height,xt.depth,mt,Gt,At.data):e.texImage3D(n.TEXTURE_2D_ARRAY,pt,Nt,At.width,At.height,xt.depth,0,mt,Gt,At.data)}else{k&&Mt&&e.texStorage2D(n.TEXTURE_2D,Lt,Nt,qt[0].width,qt[0].height);for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],E.format!==En?mt!==null?k?Et&&e.compressedTexSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,At.data):e.compressedTexImage2D(n.TEXTURE_2D,pt,Nt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,At.width,At.height,mt,Gt,At.data):e.texImage2D(n.TEXTURE_2D,pt,Nt,At.width,At.height,0,mt,Gt,At.data)}else if(E.isDataArrayTexture)if(k){if(Mt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Lt,Nt,xt.width,xt.height,xt.depth),Et)if(E.layerUpdates.size>0){const pt=sl(xt.width,xt.height,E.format,E.type);for(const lt of E.layerUpdates){const Dt=xt.data.subarray(lt*pt/xt.data.BYTES_PER_ELEMENT,(lt+1)*pt/xt.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,lt,xt.width,xt.height,1,mt,Gt,Dt)}E.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,xt.width,xt.height,xt.depth,mt,Gt,xt.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Nt,xt.width,xt.height,xt.depth,0,mt,Gt,xt.data);else if(E.isData3DTexture)k?(Mt&&e.texStorage3D(n.TEXTURE_3D,Lt,Nt,xt.width,xt.height,xt.depth),Et&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,xt.width,xt.height,xt.depth,mt,Gt,xt.data)):e.texImage3D(n.TEXTURE_3D,0,Nt,xt.width,xt.height,xt.depth,0,mt,Gt,xt.data);else if(E.isFramebufferTexture){if(Mt)if(k)e.texStorage2D(n.TEXTURE_2D,Lt,Nt,xt.width,xt.height);else{let pt=xt.width,lt=xt.height;for(let Dt=0;Dt<Lt;Dt++)e.texImage2D(n.TEXTURE_2D,Dt,Nt,pt,lt,0,mt,Gt,null),pt>>=1,lt>>=1}}else if(qt.length>0){if(k&&Mt){const pt=Zt(qt[0]);e.texStorage2D(n.TEXTURE_2D,Lt,Nt,pt.width,pt.height)}for(let pt=0,lt=qt.length;pt<lt;pt++)At=qt[pt],k?Et&&e.texSubImage2D(n.TEXTURE_2D,pt,0,0,mt,Gt,At):e.texImage2D(n.TEXTURE_2D,pt,Nt,mt,Gt,At);E.generateMipmaps=!1}else if(k){if(Mt){const pt=Zt(xt);e.texStorage2D(n.TEXTURE_2D,Lt,Nt,pt.width,pt.height)}Et&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,mt,Gt,xt)}else e.texImage2D(n.TEXTURE_2D,0,Nt,mt,Gt,xt);m(E)&&f(Q),Ft.__version=it.version,E.onUpdate&&E.onUpdate(E)}U.__version=E.version}function dt(U,E,X){if(E.image.length!==6)return;const Q=te(U,E),ut=E.source;e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+X);const it=i.get(ut);if(ut.version!==it.__version||Q===!0){e.activeTexture(n.TEXTURE0+X);const Ft=de.getPrimaries(de.workingColorSpace),St=E.colorSpace===ii?null:de.getPrimaries(E.colorSpace),Ot=E.colorSpace===ii||Ft===St?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ot);const Bt=E.isCompressedTexture||E.image[0].isCompressedTexture,xt=E.image[0]&&E.image[0].isDataTexture,mt=[];for(let lt=0;lt<6;lt++)!Bt&&!xt?mt[lt]=v(E.image[lt],!0,s.maxCubemapSize):mt[lt]=xt?E.image[lt].image:E.image[lt],mt[lt]=Xt(E,mt[lt]);const Gt=mt[0],Nt=o.convert(E.format,E.colorSpace),At=o.convert(E.type),qt=M(E.internalFormat,Nt,At,E.colorSpace),k=E.isVideoTexture!==!0,Mt=it.__version===void 0||Q===!0,Et=ut.dataReady;let Lt=C(E,Gt);Wt(n.TEXTURE_CUBE_MAP,E);let pt;if(Bt){k&&Mt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Lt,qt,Gt.width,Gt.height);for(let lt=0;lt<6;lt++){pt=mt[lt].mipmaps;for(let Dt=0;Dt<pt.length;Dt++){const jt=pt[Dt];E.format!==En?Nt!==null?k?Et&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,0,0,jt.width,jt.height,Nt,jt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,qt,jt.width,jt.height,0,jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,0,0,jt.width,jt.height,Nt,At,jt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt,qt,jt.width,jt.height,0,Nt,At,jt.data)}}}else{if(pt=E.mipmaps,k&&Mt){pt.length>0&&Lt++;const lt=Zt(mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Lt,qt,lt.width,lt.height)}for(let lt=0;lt<6;lt++)if(xt){k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,mt[lt].width,mt[lt].height,Nt,At,mt[lt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,mt[lt].width,mt[lt].height,0,Nt,At,mt[lt].data);for(let Dt=0;Dt<pt.length;Dt++){const pe=pt[Dt].image[lt].image;k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,0,0,pe.width,pe.height,Nt,At,pe.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,qt,pe.width,pe.height,0,Nt,At,pe.data)}}else{k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,0,0,Nt,At,mt[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,qt,Nt,At,mt[lt]);for(let Dt=0;Dt<pt.length;Dt++){const jt=pt[Dt];k?Et&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,0,0,Nt,At,jt.image[lt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,Dt+1,qt,Nt,At,jt.image[lt])}}}m(E)&&f(n.TEXTURE_CUBE_MAP),it.__version=ut.version,E.onUpdate&&E.onUpdate(E)}U.__version=E.version}function It(U,E,X,Q,ut,it){const Ft=o.convert(X.format,X.colorSpace),St=o.convert(X.type),Ot=M(X.internalFormat,Ft,St,X.colorSpace),Bt=i.get(E),xt=i.get(X);if(xt.__renderTarget=E,!Bt.__hasExternalTextures){const mt=Math.max(1,E.width>>it),Gt=Math.max(1,E.height>>it);ut===n.TEXTURE_3D||ut===n.TEXTURE_2D_ARRAY?e.texImage3D(ut,it,Ot,mt,Gt,E.depth,0,Ft,St,null):e.texImage2D(ut,it,Ot,mt,Gt,0,Ft,St,null)}e.bindFramebuffer(n.FRAMEBUFFER,U),vt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,ut,xt.__webglTexture,0,bt(E)):(ut===n.TEXTURE_2D||ut>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ut<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,ut,xt.__webglTexture,it),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ht(U,E,X){if(n.bindRenderbuffer(n.RENDERBUFFER,U),E.depthBuffer){const Q=E.depthTexture,ut=Q&&Q.isDepthTexture?Q.type:null,it=x(E.stencilBuffer,ut),Ft=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,St=bt(E);vt(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,St,it,E.width,E.height):X?n.renderbufferStorageMultisample(n.RENDERBUFFER,St,it,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,it,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ft,n.RENDERBUFFER,U)}else{const Q=E.textures;for(let ut=0;ut<Q.length;ut++){const it=Q[ut],Ft=o.convert(it.format,it.colorSpace),St=o.convert(it.type),Ot=M(it.internalFormat,Ft,St,it.colorSpace),Bt=bt(E);X&&vt(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Bt,Ot,E.width,E.height):vt(E)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Bt,Ot,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,Ot,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function zt(U,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,U),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(E.depthTexture);Q.__renderTarget=E,(!Q.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),H(E.depthTexture,0);const ut=Q.__webglTexture,it=bt(E);if(E.depthTexture.format===Is)vt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ut,0);else if(E.depthTexture.format===Ls)vt(E)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0,it):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ut,0);else throw new Error("Unknown depthTexture format")}function ee(U){const E=i.get(U),X=U.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==U.depthTexture){const Q=U.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Q){const ut=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Q.removeEventListener("dispose",ut)};Q.addEventListener("dispose",ut),E.__depthDisposeCallback=ut}E.__boundDepthTexture=Q}if(U.depthTexture&&!E.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");const Q=U.texture.mipmaps;Q&&Q.length>0?zt(E.__webglFramebuffer[0],U):zt(E.__webglFramebuffer,U)}else if(X){E.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[Q]),E.__webglDepthbuffer[Q]===void 0)E.__webglDepthbuffer[Q]=n.createRenderbuffer(),Ht(E.__webglDepthbuffer[Q],U,!1);else{const ut=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=E.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,it)}}else{const Q=U.texture.mipmaps;if(Q&&Q.length>0?e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),Ht(E.__webglDepthbuffer,U,!1);else{const ut=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,it),n.framebufferRenderbuffer(n.FRAMEBUFFER,ut,n.RENDERBUFFER,it)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function me(U,E,X){const Q=i.get(U);E!==void 0&&It(Q.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),X!==void 0&&ee(U)}function F(U){const E=U.texture,X=i.get(U),Q=i.get(E);U.addEventListener("dispose",I);const ut=U.textures,it=U.isWebGLCubeRenderTarget===!0,Ft=ut.length>1;if(Ft||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=E.version,a.memory.textures++),it){X.__webglFramebuffer=[];for(let St=0;St<6;St++)if(E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer[St]=[];for(let Ot=0;Ot<E.mipmaps.length;Ot++)X.__webglFramebuffer[St][Ot]=n.createFramebuffer()}else X.__webglFramebuffer[St]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer=[];for(let St=0;St<E.mipmaps.length;St++)X.__webglFramebuffer[St]=n.createFramebuffer()}else X.__webglFramebuffer=n.createFramebuffer();if(Ft)for(let St=0,Ot=ut.length;St<Ot;St++){const Bt=i.get(ut[St]);Bt.__webglTexture===void 0&&(Bt.__webglTexture=n.createTexture(),a.memory.textures++)}if(U.samples>0&&vt(U)===!1){X.__webglMultisampledFramebuffer=n.createFramebuffer(),X.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let St=0;St<ut.length;St++){const Ot=ut[St];X.__webglColorRenderbuffer[St]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,X.__webglColorRenderbuffer[St]);const Bt=o.convert(Ot.format,Ot.colorSpace),xt=o.convert(Ot.type),mt=M(Ot.internalFormat,Bt,xt,Ot.colorSpace,U.isXRRenderTarget===!0),Gt=bt(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,Gt,mt,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+St,n.RENDERBUFFER,X.__webglColorRenderbuffer[St])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(X.__webglDepthRenderbuffer=n.createRenderbuffer(),Ht(X.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(it){e.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),Wt(n.TEXTURE_CUBE_MAP,E);for(let St=0;St<6;St++)if(E.mipmaps&&E.mipmaps.length>0)for(let Ot=0;Ot<E.mipmaps.length;Ot++)It(X.__webglFramebuffer[St][Ot],U,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,Ot);else It(X.__webglFramebuffer[St],U,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+St,0);m(E)&&f(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ft){for(let St=0,Ot=ut.length;St<Ot;St++){const Bt=ut[St],xt=i.get(Bt);let mt=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(mt=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(mt,xt.__webglTexture),Wt(mt,Bt),It(X.__webglFramebuffer,U,Bt,n.COLOR_ATTACHMENT0+St,mt,0),m(Bt)&&f(mt)}e.unbindTexture()}else{let St=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(St=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(St,Q.__webglTexture),Wt(St,E),E.mipmaps&&E.mipmaps.length>0)for(let Ot=0;Ot<E.mipmaps.length;Ot++)It(X.__webglFramebuffer[Ot],U,E,n.COLOR_ATTACHMENT0,St,Ot);else It(X.__webglFramebuffer,U,E,n.COLOR_ATTACHMENT0,St,0);m(E)&&f(St),e.unbindTexture()}U.depthBuffer&&ee(U)}function ft(U){const E=U.textures;for(let X=0,Q=E.length;X<Q;X++){const ut=E[X];if(m(ut)){const it=w(U),Ft=i.get(ut).__webglTexture;e.bindTexture(it,Ft),f(it),e.unbindTexture()}}}const ht=[],ct=[];function Y(U){if(U.samples>0){if(vt(U)===!1){const E=U.textures,X=U.width,Q=U.height;let ut=n.COLOR_BUFFER_BIT;const it=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ft=i.get(U),St=E.length>1;if(St)for(let Bt=0;Bt<E.length;Bt++)e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer);const Ot=U.texture.mipmaps;Ot&&Ot.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglFramebuffer);for(let Bt=0;Bt<E.length;Bt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(ut|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(ut|=n.STENCIL_BUFFER_BIT)),St){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[Bt]);const xt=i.get(E[Bt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,xt,0)}n.blitFramebuffer(0,0,X,Q,0,0,X,Q,ut,n.NEAREST),c===!0&&(ht.length=0,ct.length=0,ht.push(n.COLOR_ATTACHMENT0+Bt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(ht.push(it),ct.push(it),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ct)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),St)for(let Bt=0;Bt<E.length;Bt++){e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.RENDERBUFFER,Ft.__webglColorRenderbuffer[Bt]);const xt=i.get(E[Bt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ft.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Bt,n.TEXTURE_2D,xt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ft.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const E=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function bt(U){return Math.min(s.maxSamples,U.samples)}function vt(U){const E=i.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function wt(U){const E=a.render.frame;h.get(U)!==E&&(h.set(U,E),U.update())}function Xt(U,E){const X=U.colorSpace,Q=U.format,ut=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||X!==ns&&X!==ii&&(de.getTransfer(X)===ve?(Q!==En||ut!==Ln)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),E}function Zt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=z,this.setTexture2D=H,this.setTexture2DArray=J,this.setTexture3D=st,this.setTextureCube=$,this.rebindTextures=me,this.setupRenderTarget=F,this.updateRenderTargetMipmap=ft,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=It,this.useMultisampledRTT=vt}function lv(n,t){function e(i,s=ii){let o;const a=de.getTransfer(s);if(i===Ln)return n.UNSIGNED_BYTE;if(i===nc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===ic)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ph)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===mh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===dh)return n.BYTE;if(i===fh)return n.SHORT;if(i===Ps)return n.UNSIGNED_SHORT;if(i===ec)return n.INT;if(i===Ei)return n.UNSIGNED_INT;if(i===Vn)return n.FLOAT;if(i===Vs)return n.HALF_FLOAT;if(i===gh)return n.ALPHA;if(i===vh)return n.RGB;if(i===En)return n.RGBA;if(i===Is)return n.DEPTH_COMPONENT;if(i===Ls)return n.DEPTH_STENCIL;if(i===sc)return n.RED;if(i===oc)return n.RED_INTEGER;if(i===_h)return n.RG;if(i===ac)return n.RG_INTEGER;if(i===rc)return n.RGBA_INTEGER;if(i===Co||i===Po||i===Ro||i===Io)if(a===ve)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(i===Co)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Po)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ro)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Io)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(i===Co)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Po)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ro)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Io)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ir||i===sr||i===or||i===ar)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(i===ir)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===sr)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===or)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===ar)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===rr||i===cr||i===lr)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(i===rr||i===cr)return a===ve?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(i===lr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===hr||i===ur||i===dr||i===fr||i===pr||i===mr||i===gr||i===vr||i===_r||i===xr||i===Mr||i===yr||i===br||i===Sr)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(i===hr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ur)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===dr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===fr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===pr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===mr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===gr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===vr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===_r)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===xr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Mr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===yr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===br)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Sr)return a===ve?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===wr||i===Er||i===Tr)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(i===wr)return a===ve?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Er)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Tr)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ar||i===Cr||i===Pr||i===Rr)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(i===Ar)return o.COMPRESSED_RED_RGTC1_EXT;if(i===Cr)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Pr)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Rr)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Rs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const hv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,uv=`
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

}`;class dv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Uh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new ri({vertexShader:hv,fragmentShader:uv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new y(new Ue(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class fv extends os{constructor(t,e){super();const i=this;let s=null,o=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null;const v=typeof XRWebGLBinding<"u",m=new dv,f={},w=e.getContextAttributes();let M=null,x=null;const C=[],P=[],I=new Tt;let T=null;const b=new sn;b.viewport=new Ee;const _=new sn;_.viewport=new Ee;const D=[b,_],z=new Df;let B=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(rt){let dt=C[rt];return dt===void 0&&(dt=new Ma,C[rt]=dt),dt.getTargetRaySpace()},this.getControllerGrip=function(rt){let dt=C[rt];return dt===void 0&&(dt=new Ma,C[rt]=dt),dt.getGripSpace()},this.getHand=function(rt){let dt=C[rt];return dt===void 0&&(dt=new Ma,C[rt]=dt),dt.getHandSpace()};function H(rt){const dt=P.indexOf(rt.inputSource);if(dt===-1)return;const It=C[dt];It!==void 0&&(It.update(rt.inputSource,rt.frame,l||a),It.dispatchEvent({type:rt.type,data:rt.inputSource}))}function J(){s.removeEventListener("select",H),s.removeEventListener("selectstart",H),s.removeEventListener("selectend",H),s.removeEventListener("squeeze",H),s.removeEventListener("squeezestart",H),s.removeEventListener("squeezeend",H),s.removeEventListener("end",J),s.removeEventListener("inputsourceschange",st);for(let rt=0;rt<C.length;rt++){const dt=P[rt];dt!==null&&(P[rt]=null,C[rt].disconnect(dt))}B=null,V=null,m.reset();for(const rt in f)delete f[rt];t.setRenderTarget(M),p=null,d=null,u=null,s=null,x=null,se.stop(),i.isPresenting=!1,t.setPixelRatio(T),t.setSize(I.width,I.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(rt){o=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(rt){r=rt,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(rt){l=rt},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(rt){if(s=rt,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",H),s.addEventListener("selectstart",H),s.addEventListener("selectend",H),s.addEventListener("squeeze",H),s.addEventListener("squeezestart",H),s.addEventListener("squeezeend",H),s.addEventListener("end",J),s.addEventListener("inputsourceschange",st),w.xrCompatible!==!0&&await e.makeXRCompatible(),T=t.getPixelRatio(),t.getSize(I),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let It=null,Ht=null,zt=null;w.depth&&(zt=w.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,It=w.stencil?Ls:Is,Ht=w.stencil?Rs:Ei);const ee={colorFormat:e.RGBA8,depthFormat:zt,scaleFactor:o};u=this.getBinding(),d=u.createProjectionLayer(ee),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new Ti(d.textureWidth,d.textureHeight,{format:En,type:Ln,depthTexture:new Dh(d.textureWidth,d.textureHeight,Ht,void 0,void 0,void 0,void 0,void 0,void 0,It),stencilBuffer:w.stencil,colorSpace:t.outputColorSpace,samples:w.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const It={antialias:w.antialias,alpha:!0,depth:w.depth,stencil:w.stencil,framebufferScaleFactor:o};p=new XRWebGLLayer(s,e,It),s.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Ti(p.framebufferWidth,p.framebufferHeight,{format:En,type:Ln,colorSpace:t.outputColorSpace,stencilBuffer:w.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(r),se.setContext(s),se.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function st(rt){for(let dt=0;dt<rt.removed.length;dt++){const It=rt.removed[dt],Ht=P.indexOf(It);Ht>=0&&(P[Ht]=null,C[Ht].disconnect(It))}for(let dt=0;dt<rt.added.length;dt++){const It=rt.added[dt];let Ht=P.indexOf(It);if(Ht===-1){for(let ee=0;ee<C.length;ee++)if(ee>=P.length){P.push(It),Ht=ee;break}else if(P[ee]===null){P[ee]=It,Ht=ee;break}if(Ht===-1)break}const zt=C[Ht];zt&&zt.connect(It)}}const $=new N,at=new N;function Z(rt,dt,It){$.setFromMatrixPosition(dt.matrixWorld),at.setFromMatrixPosition(It.matrixWorld);const Ht=$.distanceTo(at),zt=dt.projectionMatrix.elements,ee=It.projectionMatrix.elements,me=zt[14]/(zt[10]-1),F=zt[14]/(zt[10]+1),ft=(zt[9]+1)/zt[5],ht=(zt[9]-1)/zt[5],ct=(zt[8]-1)/zt[0],Y=(ee[8]+1)/ee[0],bt=me*ct,vt=me*Y,wt=Ht/(-ct+Y),Xt=wt*-ct;if(dt.matrixWorld.decompose(rt.position,rt.quaternion,rt.scale),rt.translateX(Xt),rt.translateZ(wt),rt.matrixWorld.compose(rt.position,rt.quaternion,rt.scale),rt.matrixWorldInverse.copy(rt.matrixWorld).invert(),zt[10]===-1)rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse);else{const Zt=me+wt,U=F+wt,E=bt-Xt,X=vt+(Ht-Xt),Q=ft*F/U*Zt,ut=ht*F/U*Zt;rt.projectionMatrix.makePerspective(E,X,Q,ut,Zt,U),rt.projectionMatrixInverse.copy(rt.projectionMatrix).invert()}}function yt(rt,dt){dt===null?rt.matrixWorld.copy(rt.matrix):rt.matrixWorld.multiplyMatrices(dt.matrixWorld,rt.matrix),rt.matrixWorldInverse.copy(rt.matrixWorld).invert()}this.updateCamera=function(rt){if(s===null)return;let dt=rt.near,It=rt.far;m.texture!==null&&(m.depthNear>0&&(dt=m.depthNear),m.depthFar>0&&(It=m.depthFar)),z.near=_.near=b.near=dt,z.far=_.far=b.far=It,(B!==z.near||V!==z.far)&&(s.updateRenderState({depthNear:z.near,depthFar:z.far}),B=z.near,V=z.far),z.layers.mask=rt.layers.mask|6,b.layers.mask=z.layers.mask&3,_.layers.mask=z.layers.mask&5;const Ht=rt.parent,zt=z.cameras;yt(z,Ht);for(let ee=0;ee<zt.length;ee++)yt(zt[ee],Ht);zt.length===2?Z(z,b,_):z.projectionMatrix.copy(b.projectionMatrix),Wt(rt,z,Ht)};function Wt(rt,dt,It){It===null?rt.matrix.copy(dt.matrixWorld):(rt.matrix.copy(It.matrixWorld),rt.matrix.invert(),rt.matrix.multiply(dt.matrixWorld)),rt.matrix.decompose(rt.position,rt.quaternion,rt.scale),rt.updateMatrixWorld(!0),rt.projectionMatrix.copy(dt.projectionMatrix),rt.projectionMatrixInverse.copy(dt.projectionMatrixInverse),rt.isPerspectiveCamera&&(rt.fov=Ds*2*Math.atan(1/rt.projectionMatrix.elements[5]),rt.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(rt){c=rt,d!==null&&(d.fixedFoveation=rt),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=rt)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(rt){return f[rt]};let te=null;function he(rt,dt){if(h=dt.getViewerPose(l||a),g=dt,h!==null){const It=h.views;p!==null&&(t.setRenderTargetFramebuffer(x,p.framebuffer),t.setRenderTarget(x));let Ht=!1;It.length!==z.cameras.length&&(z.cameras.length=0,Ht=!0);for(let F=0;F<It.length;F++){const ft=It[F];let ht=null;if(p!==null)ht=p.getViewport(ft);else{const Y=u.getViewSubImage(d,ft);ht=Y.viewport,F===0&&(t.setRenderTargetTextures(x,Y.colorTexture,Y.depthStencilTexture),t.setRenderTarget(x))}let ct=D[F];ct===void 0&&(ct=new sn,ct.layers.enable(F),ct.viewport=new Ee,D[F]=ct),ct.matrix.fromArray(ft.transform.matrix),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.projectionMatrix.fromArray(ft.projectionMatrix),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert(),ct.viewport.set(ht.x,ht.y,ht.width,ht.height),F===0&&(z.matrix.copy(ct.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Ht===!0&&z.cameras.push(ct)}const zt=s.enabledFeatures;if(zt&&zt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const F=u.getDepthInformation(It[0]);F&&F.isValid&&F.texture&&m.init(F,s.renderState)}if(zt&&zt.includes("camera-access")&&v){t.state.unbindTexture(),u=i.getBinding();for(let F=0;F<It.length;F++){const ft=It[F].camera;if(ft){let ht=f[ft];ht||(ht=new Uh,f[ft]=ht);const ct=u.getCameraImage(ft);ht.sourceTexture=ct}}}}for(let It=0;It<C.length;It++){const Ht=P[It],zt=C[It];Ht!==null&&zt!==void 0&&zt.update(Ht,dt,l||a)}te&&te(rt,dt),dt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:dt}),g=null}const se=new Xh;se.setAnimationLoop(he),this.setAnimationLoop=function(rt){te=rt},this.dispose=function(){}}}const gi=new Xn,pv=new we;function mv(n,t){function e(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function i(m,f){f.color.getRGB(m.fogColor.value,Ch(n)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,w,M,x){f.isMeshBasicMaterial||f.isMeshLambertMaterial?o(m,f):f.isMeshToonMaterial?(o(m,f),u(m,f)):f.isMeshPhongMaterial?(o(m,f),h(m,f)):f.isMeshStandardMaterial?(o(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,x)):f.isMeshMatcapMaterial?(o(m,f),g(m,f)):f.isMeshDepthMaterial?o(m,f):f.isMeshDistanceMaterial?(o(m,f),v(m,f)):f.isMeshNormalMaterial?o(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&r(m,f)):f.isPointsMaterial?c(m,f,w,M):f.isSpriteMaterial?l(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function o(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,e(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===$e&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,e(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===$e&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,e(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,e(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const w=t.get(f),M=w.envMap,x=w.envMapRotation;M&&(m.envMap.value=M,gi.copy(x),gi.x*=-1,gi.y*=-1,gi.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(gi.y*=-1,gi.z*=-1),m.envMapRotation.value.setFromMatrix4(pv.makeRotationFromEuler(gi)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform))}function r(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function c(m,f,w,M){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*w,m.scale.value=M*.5,f.map&&(m.map.value=f.map,e(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function l(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,e(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,e(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function u(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,w){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===$e&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=w.texture,m.transmissionSamplerSize.value.set(w.width,w.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function v(m,f){const w=t.get(f).light;m.referencePosition.value.setFromMatrixPosition(w.matrixWorld),m.nearDistance.value=w.shadow.camera.near,m.farDistance.value=w.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function gv(n,t,e,i){let s={},o={},a=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(w,M){const x=M.program;i.uniformBlockBinding(w,x)}function l(w,M){let x=s[w.id];x===void 0&&(g(w),x=h(w),s[w.id]=x,w.addEventListener("dispose",m));const C=M.program;i.updateUBOMapping(w,C);const P=t.render.frame;o[w.id]!==P&&(d(w),o[w.id]=P)}function h(w){const M=u();w.__bindingPointIndex=M;const x=n.createBuffer(),C=w.__size,P=w.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,C,P),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,M,x),x}function u(){for(let w=0;w<r;w++)if(a.indexOf(w)===-1)return a.push(w),w;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(w){const M=s[w.id],x=w.uniforms,C=w.__cache;n.bindBuffer(n.UNIFORM_BUFFER,M);for(let P=0,I=x.length;P<I;P++){const T=Array.isArray(x[P])?x[P]:[x[P]];for(let b=0,_=T.length;b<_;b++){const D=T[b];if(p(D,P,b,C)===!0){const z=D.__offset,B=Array.isArray(D.value)?D.value:[D.value];let V=0;for(let H=0;H<B.length;H++){const J=B[H],st=v(J);typeof J=="number"||typeof J=="boolean"?(D.__data[0]=J,n.bufferSubData(n.UNIFORM_BUFFER,z+V,D.__data)):J.isMatrix3?(D.__data[0]=J.elements[0],D.__data[1]=J.elements[1],D.__data[2]=J.elements[2],D.__data[3]=0,D.__data[4]=J.elements[3],D.__data[5]=J.elements[4],D.__data[6]=J.elements[5],D.__data[7]=0,D.__data[8]=J.elements[6],D.__data[9]=J.elements[7],D.__data[10]=J.elements[8],D.__data[11]=0):(J.toArray(D.__data,V),V+=st.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(w,M,x,C){const P=w.value,I=M+"_"+x;if(C[I]===void 0)return typeof P=="number"||typeof P=="boolean"?C[I]=P:C[I]=P.clone(),!0;{const T=C[I];if(typeof P=="number"||typeof P=="boolean"){if(T!==P)return C[I]=P,!0}else if(T.equals(P)===!1)return T.copy(P),!0}return!1}function g(w){const M=w.uniforms;let x=0;const C=16;for(let I=0,T=M.length;I<T;I++){const b=Array.isArray(M[I])?M[I]:[M[I]];for(let _=0,D=b.length;_<D;_++){const z=b[_],B=Array.isArray(z.value)?z.value:[z.value];for(let V=0,H=B.length;V<H;V++){const J=B[V],st=v(J),$=x%C,at=$%st.boundary,Z=$+at;x+=at,Z!==0&&C-Z<st.storage&&(x+=C-Z),z.__data=new Float32Array(st.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=x,x+=st.storage}}}const P=x%C;return P>0&&(x+=C-P),w.__size=x,w.__cache={},this}function v(w){const M={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(M.boundary=4,M.storage=4):w.isVector2?(M.boundary=8,M.storage=8):w.isVector3||w.isColor?(M.boundary=16,M.storage=12):w.isVector4?(M.boundary=16,M.storage=16):w.isMatrix3?(M.boundary=48,M.storage=48):w.isMatrix4?(M.boundary=64,M.storage=64):w.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",w),M}function m(w){const M=w.target;M.removeEventListener("dispose",m);const x=a.indexOf(M.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(s[M.id]),delete s[M.id],delete o[M.id]}function f(){for(const w in s)n.deleteBuffer(s[w]);a=[],s={},o={}}return{bind:c,update:l,dispose:f}}class $h{constructor(t={}){const{canvas:e=gd(),context:i=null,depth:s=!0,stencil:o=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,f=null;const w=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ai,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let C=!1;this._outputColorSpace=nn;let P=0,I=0,T=null,b=-1,_=null;const D=new Ee,z=new Ee;let B=null;const V=new ae(0);let H=0,J=e.width,st=e.height,$=1,at=null,Z=null;const yt=new Ee(0,0,J,st),Wt=new Ee(0,0,J,st);let te=!1;const he=new uc;let se=!1,rt=!1;const dt=new we,It=new N,Ht=new Ee,zt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ee=!1;function me(){return T===null?$:1}let F=i;function ft(R,q){return e.getContext(R,q)}try{const R={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${tc}`),e.addEventListener("webglcontextlost",Et,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",pt,!1),F===null){const q="webgl2";if(F=ft(q,R),F===null)throw ft(q)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let ht,ct,Y,bt,vt,wt,Xt,Zt,U,E,X,Q,ut,it,Ft,St,Ot,Bt,xt,mt,Gt,Nt,At,qt;function k(){ht=new Am(F),ht.init(),Nt=new lv(F,ht),ct=new Mm(F,ht,t,Nt),Y=new rv(F,ht),ct.reversedDepthBuffer&&d&&Y.buffers.depth.setReversed(!0),bt=new Rm(F),vt=new Yg,wt=new cv(F,ht,Y,vt,ct,Nt,bt),Xt=new bm(x),Zt=new Tm(x),U=new zf(F),At=new _m(F,U),E=new Cm(F,U,bt,At),X=new Lm(F,E,U,bt),xt=new Im(F,ct,wt),St=new ym(vt),Q=new jg(x,Xt,Zt,ht,ct,At,St),ut=new mv(x,vt),it=new Jg,Ft=new nv(ht),Bt=new vm(x,Xt,Zt,Y,X,p,c),Ot=new ov(x,X,ct),qt=new gv(F,bt,ct,Y),mt=new xm(F,ht,bt),Gt=new Pm(F,ht,bt),bt.programs=Q.programs,x.capabilities=ct,x.extensions=ht,x.properties=vt,x.renderLists=it,x.shadowMap=Ot,x.state=Y,x.info=bt}k();const Mt=new fv(x,F);this.xr=Mt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const R=ht.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=ht.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(R){R!==void 0&&($=R,this.setSize(J,st,!1))},this.getSize=function(R){return R.set(J,st)},this.setSize=function(R,q,tt=!0){if(Mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}J=R,st=q,e.width=Math.floor(R*$),e.height=Math.floor(q*$),tt===!0&&(e.style.width=R+"px",e.style.height=q+"px"),this.setViewport(0,0,R,q)},this.getDrawingBufferSize=function(R){return R.set(J*$,st*$).floor()},this.setDrawingBufferSize=function(R,q,tt){J=R,st=q,$=tt,e.width=Math.floor(R*tt),e.height=Math.floor(q*tt),this.setViewport(0,0,R,q)},this.getCurrentViewport=function(R){return R.copy(D)},this.getViewport=function(R){return R.copy(yt)},this.setViewport=function(R,q,tt,et){R.isVector4?yt.set(R.x,R.y,R.z,R.w):yt.set(R,q,tt,et),Y.viewport(D.copy(yt).multiplyScalar($).round())},this.getScissor=function(R){return R.copy(Wt)},this.setScissor=function(R,q,tt,et){R.isVector4?Wt.set(R.x,R.y,R.z,R.w):Wt.set(R,q,tt,et),Y.scissor(z.copy(Wt).multiplyScalar($).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(R){Y.setScissorTest(te=R)},this.setOpaqueSort=function(R){at=R},this.setTransparentSort=function(R){Z=R},this.getClearColor=function(R){return R.copy(Bt.getClearColor())},this.setClearColor=function(){Bt.setClearColor(...arguments)},this.getClearAlpha=function(){return Bt.getClearAlpha()},this.setClearAlpha=function(){Bt.setClearAlpha(...arguments)},this.clear=function(R=!0,q=!0,tt=!0){let et=0;if(R){let W=!1;if(T!==null){const gt=T.texture.format;W=gt===rc||gt===ac||gt===oc}if(W){const gt=T.texture.type,Ct=gt===Ln||gt===Ei||gt===Ps||gt===Rs||gt===nc||gt===ic,Ut=Bt.getClearColor(),L=Bt.getClearAlpha(),O=Ut.r,j=Ut.g,K=Ut.b;Ct?(g[0]=O,g[1]=j,g[2]=K,g[3]=L,F.clearBufferuiv(F.COLOR,0,g)):(v[0]=O,v[1]=j,v[2]=K,v[3]=L,F.clearBufferiv(F.COLOR,0,v))}else et|=F.COLOR_BUFFER_BIT}q&&(et|=F.DEPTH_BUFFER_BIT),tt&&(et|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(et)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Et,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",pt,!1),Bt.dispose(),it.dispose(),Ft.dispose(),vt.dispose(),Xt.dispose(),Zt.dispose(),X.dispose(),At.dispose(),qt.dispose(),Q.dispose(),Mt.dispose(),Mt.removeEventListener("sessionstart",Ke),Mt.removeEventListener("sessionend",qs),pn.stop()};function Et(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function Lt(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;const R=bt.autoReset,q=Ot.enabled,tt=Ot.autoUpdate,et=Ot.needsUpdate,W=Ot.type;k(),bt.autoReset=R,Ot.enabled=q,Ot.autoUpdate=tt,Ot.needsUpdate=et,Ot.type=W}function pt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function lt(R){const q=R.target;q.removeEventListener("dispose",lt),Dt(q)}function Dt(R){jt(R),vt.remove(R)}function jt(R){const q=vt.get(R).programs;q!==void 0&&(q.forEach(function(tt){Q.releaseProgram(tt)}),R.isShaderMaterial&&Q.releaseShaderCache(R))}this.renderBufferDirect=function(R,q,tt,et,W,gt){q===null&&(q=zt);const Ct=W.isMesh&&W.matrixWorld.determinant()<0,Ut=Ys(R,q,tt,et,W);Y.setMaterial(et,Ct);let L=tt.index,O=1;if(et.wireframe===!0){if(L=E.getWireframeAttribute(tt),L===void 0)return;O=2}const j=tt.drawRange,K=tt.attributes.position;let _t=j.start*O,kt=(j.start+j.count)*O;gt!==null&&(_t=Math.max(_t,gt.start*O),kt=Math.min(kt,(gt.start+gt.count)*O)),L!==null?(_t=Math.max(_t,0),kt=Math.min(kt,L.count)):K!=null&&(_t=Math.max(_t,0),kt=Math.min(kt,K.count));const oe=kt-_t;if(oe<0||oe===1/0)return;At.setup(W,et,Ut,tt,L);let Yt,$t=mt;if(L!==null&&(Yt=U.get(L),$t=Gt,$t.setIndex(Yt)),W.isMesh)et.wireframe===!0?(Y.setLineWidth(et.wireframeLinewidth*me()),$t.setMode(F.LINES)):$t.setMode(F.TRIANGLES);else if(W.isLine){let Vt=et.linewidth;Vt===void 0&&(Vt=1),Y.setLineWidth(Vt*me()),W.isLineSegments?$t.setMode(F.LINES):W.isLineLoop?$t.setMode(F.LINE_LOOP):$t.setMode(F.LINE_STRIP)}else W.isPoints?$t.setMode(F.POINTS):W.isSprite&&$t.setMode(F.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)Us("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),$t.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(ht.get("WEBGL_multi_draw"))$t.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Vt=W._multiDrawStarts,xe=W._multiDrawCounts,le=W._multiDrawCount,Le=L?U.get(L).bytesPerElement:1,Zn=vt.get(et).currentProgram.getUniforms();for(let Ve=0;Ve<le;Ve++)Zn.setValue(F,"_gl_DrawID",Ve),$t.render(Vt[Ve]/Le,xe[Ve])}else if(W.isInstancedMesh)$t.renderInstances(_t,oe,W.count);else if(tt.isInstancedBufferGeometry){const Vt=tt._maxInstanceCount!==void 0?tt._maxInstanceCount:1/0,xe=Math.min(tt.instanceCount,Vt);$t.renderInstances(_t,oe,xe)}else $t.render(_t,oe)};function pe(R,q,tt){R.transparent===!0&&R.side===bn&&R.forceSinglePass===!1?(R.side=$e,R.needsUpdate=!0,Yn(R,q,tt),R.side=Wn,R.needsUpdate=!0,Yn(R,q,tt),R.side=bn):Yn(R,q,tt)}this.compile=function(R,q,tt=null){tt===null&&(tt=R),f=Ft.get(tt),f.init(q),M.push(f),tt.traverseVisible(function(W){W.isLight&&W.layers.test(q.layers)&&(f.pushLight(W),W.castShadow&&f.pushShadow(W))}),R!==tt&&R.traverseVisible(function(W){W.isLight&&W.layers.test(q.layers)&&(f.pushLight(W),W.castShadow&&f.pushShadow(W))}),f.setupLights();const et=new Set;return R.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const gt=W.material;if(gt)if(Array.isArray(gt))for(let Ct=0;Ct<gt.length;Ct++){const Ut=gt[Ct];pe(Ut,tt,W),et.add(Ut)}else pe(gt,tt,W),et.add(gt)}),f=M.pop(),et},this.compileAsync=function(R,q,tt=null){const et=this.compile(R,q,tt);return new Promise(W=>{function gt(){if(et.forEach(function(Ct){vt.get(Ct).currentProgram.isReady()&&et.delete(Ct)}),et.size===0){W(R);return}setTimeout(gt,10)}ht.get("KHR_parallel_shader_compile")!==null?gt():setTimeout(gt,10)})};let ce=null;function on(R){ce&&ce(R)}function Ke(){pn.stop()}function qs(){pn.start()}const pn=new Xh;pn.setAnimationLoop(on),typeof self<"u"&&pn.setContext(self),this.setAnimationLoop=function(R){ce=R,Mt.setAnimationLoop(R),R===null?pn.stop():pn.start()},Mt.addEventListener("sessionstart",Ke),Mt.addEventListener("sessionend",qs),this.render=function(R,q){if(q!==void 0&&q.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),q.parent===null&&q.matrixWorldAutoUpdate===!0&&q.updateMatrixWorld(),Mt.enabled===!0&&Mt.isPresenting===!0&&(Mt.cameraAutoUpdate===!0&&Mt.updateCamera(q),q=Mt.getCamera()),R.isScene===!0&&R.onBeforeRender(x,R,q,T),f=Ft.get(R,M.length),f.init(q),M.push(f),dt.multiplyMatrices(q.projectionMatrix,q.matrixWorldInverse),he.setFromProjectionMatrix(dt,Pn,q.reversedDepth),rt=this.localClippingEnabled,se=St.init(this.clippingPlanes,rt),m=it.get(R,w.length),m.init(),w.push(m),Mt.enabled===!0&&Mt.isPresenting===!0){const gt=x.xr.getDepthSensingMesh();gt!==null&&hs(gt,q,-1/0,x.sortObjects)}hs(R,q,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(at,Z),ee=Mt.enabled===!1||Mt.isPresenting===!1||Mt.hasDepthSensing()===!1,ee&&Bt.addToRenderList(m,R),this.info.render.frame++,se===!0&&St.beginShadows();const tt=f.state.shadowsArray;Ot.render(tt,R,q),se===!0&&St.endShadows(),this.info.autoReset===!0&&this.info.reset();const et=m.opaque,W=m.transmissive;if(f.setupLights(),q.isArrayCamera){const gt=q.cameras;if(W.length>0)for(let Ct=0,Ut=gt.length;Ct<Ut;Ct++){const L=gt[Ct];Ws(et,W,R,L)}ee&&Bt.render(R);for(let Ct=0,Ut=gt.length;Ct<Ut;Ct++){const L=gt[Ct];ci(m,R,L,L.viewport)}}else W.length>0&&Ws(et,W,R,q),ee&&Bt.render(R),ci(m,R,q);T!==null&&I===0&&(wt.updateMultisampleRenderTarget(T),wt.updateRenderTargetMipmap(T)),R.isScene===!0&&R.onAfterRender(x,R,q),At.resetDefaultState(),b=-1,_=null,M.pop(),M.length>0?(f=M[M.length-1],se===!0&&St.setGlobalState(x.clippingPlanes,f.state.camera)):f=null,w.pop(),w.length>0?m=w[w.length-1]:m=null};function hs(R,q,tt,et){if(R.visible===!1)return;if(R.layers.test(q.layers)){if(R.isGroup)tt=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(q);else if(R.isLight)f.pushLight(R),R.castShadow&&f.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||he.intersectsSprite(R)){et&&Ht.setFromMatrixPosition(R.matrixWorld).applyMatrix4(dt);const Ct=X.update(R),Ut=R.material;Ut.visible&&m.push(R,Ct,Ut,tt,Ht.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||he.intersectsObject(R))){const Ct=X.update(R),Ut=R.material;if(et&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Ht.copy(R.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Ht.copy(Ct.boundingSphere.center)),Ht.applyMatrix4(R.matrixWorld).applyMatrix4(dt)),Array.isArray(Ut)){const L=Ct.groups;for(let O=0,j=L.length;O<j;O++){const K=L[O],_t=Ut[K.materialIndex];_t&&_t.visible&&m.push(R,Ct,_t,tt,Ht.z,K)}}else Ut.visible&&m.push(R,Ct,Ut,tt,Ht.z,null)}}const gt=R.children;for(let Ct=0,Ut=gt.length;Ct<Ut;Ct++)hs(gt[Ct],q,tt,et)}function ci(R,q,tt,et){const W=R.opaque,gt=R.transmissive,Ct=R.transparent;f.setupLightsView(tt),se===!0&&St.setGlobalState(x.clippingPlanes,tt),et&&Y.viewport(D.copy(et)),W.length>0&&jn(W,q,tt),gt.length>0&&jn(gt,q,tt),Ct.length>0&&jn(Ct,q,tt),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function Ws(R,q,tt,et){if((tt.isScene===!0?tt.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[et.id]===void 0&&(f.state.transmissionRenderTarget[et.id]=new Ti(1,1,{generateMipmaps:!0,type:ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float")?Vs:Ln,minFilter:Si,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const gt=f.state.transmissionRenderTarget[et.id],Ct=et.viewport||D;gt.setSize(Ct.z*x.transmissionResolutionScale,Ct.w*x.transmissionResolutionScale);const Ut=x.getRenderTarget(),L=x.getActiveCubeFace(),O=x.getActiveMipmapLevel();x.setRenderTarget(gt),x.getClearColor(V),H=x.getClearAlpha(),H<1&&x.setClearColor(16777215,.5),x.clear(),ee&&Bt.render(tt);const j=x.toneMapping;x.toneMapping=ai;const K=et.viewport;if(et.viewport!==void 0&&(et.viewport=void 0),f.setupLightsView(et),se===!0&&St.setGlobalState(x.clippingPlanes,et),jn(R,tt,et),wt.updateMultisampleRenderTarget(gt),wt.updateRenderTargetMipmap(gt),ht.has("WEBGL_multisampled_render_to_texture")===!1){let _t=!1;for(let kt=0,oe=q.length;kt<oe;kt++){const Yt=q[kt],$t=Yt.object,Vt=Yt.geometry,xe=Yt.material,le=Yt.group;if(xe.side===bn&&$t.layers.test(et.layers)){const Le=xe.side;xe.side=$e,xe.needsUpdate=!0,us($t,tt,et,Vt,xe,le),xe.side=Le,xe.needsUpdate=!0,_t=!0}}_t===!0&&(wt.updateMultisampleRenderTarget(gt),wt.updateRenderTargetMipmap(gt))}x.setRenderTarget(Ut,L,O),x.setClearColor(V,H),K!==void 0&&(et.viewport=K),x.toneMapping=j}function jn(R,q,tt){const et=q.isScene===!0?q.overrideMaterial:null;for(let W=0,gt=R.length;W<gt;W++){const Ct=R[W],Ut=Ct.object,L=Ct.geometry,O=Ct.group;let j=Ct.material;j.allowOverride===!0&&et!==null&&(j=et),Ut.layers.test(tt.layers)&&us(Ut,q,tt,L,j,O)}}function us(R,q,tt,et,W,gt){R.onBeforeRender(x,q,tt,et,W,gt),R.modelViewMatrix.multiplyMatrices(tt.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),W.onBeforeRender(x,q,tt,et,R,gt),W.transparent===!0&&W.side===bn&&W.forceSinglePass===!1?(W.side=$e,W.needsUpdate=!0,x.renderBufferDirect(tt,q,et,W,R,gt),W.side=Wn,W.needsUpdate=!0,x.renderBufferDirect(tt,q,et,W,R,gt),W.side=bn):x.renderBufferDirect(tt,q,et,W,R,gt),R.onAfterRender(x,q,tt,et,W,gt)}function Yn(R,q,tt){q.isScene!==!0&&(q=zt);const et=vt.get(R),W=f.state.lights,gt=f.state.shadowsArray,Ct=W.state.version,Ut=Q.getParameters(R,W.state,gt,q,tt),L=Q.getProgramCacheKey(Ut);let O=et.programs;et.environment=R.isMeshStandardMaterial?q.environment:null,et.fog=q.fog,et.envMap=(R.isMeshStandardMaterial?Zt:Xt).get(R.envMap||et.environment),et.envMapRotation=et.environment!==null&&R.envMap===null?q.environmentRotation:R.envMapRotation,O===void 0&&(R.addEventListener("dispose",lt),O=new Map,et.programs=O);let j=O.get(L);if(j!==void 0){if(et.currentProgram===j&&et.lightsStateVersion===Ct)return js(R,Ut),j}else Ut.uniforms=Q.getUniforms(R),R.onBeforeCompile(Ut,x),j=Q.acquireProgram(Ut,L),O.set(L,j),et.uniforms=Ut.uniforms;const K=et.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(K.clippingPlanes=St.uniform),js(R,Ut),et.needsLights=ds(R),et.lightsStateVersion=Ct,et.needsLights&&(K.ambientLightColor.value=W.state.ambient,K.lightProbe.value=W.state.probe,K.directionalLights.value=W.state.directional,K.directionalLightShadows.value=W.state.directionalShadow,K.spotLights.value=W.state.spot,K.spotLightShadows.value=W.state.spotShadow,K.rectAreaLights.value=W.state.rectArea,K.ltc_1.value=W.state.rectAreaLTC1,K.ltc_2.value=W.state.rectAreaLTC2,K.pointLights.value=W.state.point,K.pointLightShadows.value=W.state.pointShadow,K.hemisphereLights.value=W.state.hemi,K.directionalShadowMap.value=W.state.directionalShadowMap,K.directionalShadowMatrix.value=W.state.directionalShadowMatrix,K.spotShadowMap.value=W.state.spotShadowMap,K.spotLightMatrix.value=W.state.spotLightMatrix,K.spotLightMap.value=W.state.spotLightMap,K.pointShadowMap.value=W.state.pointShadowMap,K.pointShadowMatrix.value=W.state.pointShadowMatrix),et.currentProgram=j,et.uniformsList=null,j}function Xs(R){if(R.uniformsList===null){const q=R.currentProgram.getUniforms();R.uniformsList=Lo.seqWithValue(q.seq,R.uniforms)}return R.uniformsList}function js(R,q){const tt=vt.get(R);tt.outputColorSpace=q.outputColorSpace,tt.batching=q.batching,tt.batchingColor=q.batchingColor,tt.instancing=q.instancing,tt.instancingColor=q.instancingColor,tt.instancingMorph=q.instancingMorph,tt.skinning=q.skinning,tt.morphTargets=q.morphTargets,tt.morphNormals=q.morphNormals,tt.morphColors=q.morphColors,tt.morphTargetsCount=q.morphTargetsCount,tt.numClippingPlanes=q.numClippingPlanes,tt.numIntersection=q.numClipIntersection,tt.vertexAlphas=q.vertexAlphas,tt.vertexTangents=q.vertexTangents,tt.toneMapping=q.toneMapping}function Ys(R,q,tt,et,W){q.isScene!==!0&&(q=zt),wt.resetTextureUnits();const gt=q.fog,Ct=et.isMeshStandardMaterial?q.environment:null,Ut=T===null?x.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:ns,L=(et.isMeshStandardMaterial?Zt:Xt).get(et.envMap||Ct),O=et.vertexColors===!0&&!!tt.attributes.color&&tt.attributes.color.itemSize===4,j=!!tt.attributes.tangent&&(!!et.normalMap||et.anisotropy>0),K=!!tt.morphAttributes.position,_t=!!tt.morphAttributes.normal,kt=!!tt.morphAttributes.color;let oe=ai;et.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(oe=x.toneMapping);const Yt=tt.morphAttributes.position||tt.morphAttributes.normal||tt.morphAttributes.color,$t=Yt!==void 0?Yt.length:0,Vt=vt.get(et),xe=f.state.lights;if(se===!0&&(rt===!0||R!==_)){const He=R===_&&et.id===b;St.setState(et,R,He)}let le=!1;et.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==xe.state.version||Vt.outputColorSpace!==Ut||W.isBatchedMesh&&Vt.batching===!1||!W.isBatchedMesh&&Vt.batching===!0||W.isBatchedMesh&&Vt.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Vt.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Vt.instancing===!1||!W.isInstancedMesh&&Vt.instancing===!0||W.isSkinnedMesh&&Vt.skinning===!1||!W.isSkinnedMesh&&Vt.skinning===!0||W.isInstancedMesh&&Vt.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Vt.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Vt.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Vt.instancingMorph===!1&&W.morphTexture!==null||Vt.envMap!==L||et.fog===!0&&Vt.fog!==gt||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==St.numPlanes||Vt.numIntersection!==St.numIntersection)||Vt.vertexAlphas!==O||Vt.vertexTangents!==j||Vt.morphTargets!==K||Vt.morphNormals!==_t||Vt.morphColors!==kt||Vt.toneMapping!==oe||Vt.morphTargetsCount!==$t)&&(le=!0):(le=!0,Vt.__version=et.version);let Le=Vt.currentProgram;le===!0&&(Le=Yn(et,q,W));let Zn=!1,Ve=!1,li=!1;const be=Le.getUniforms(),an=Vt.uniforms;if(Y.useProgram(Le.program)&&(Zn=!0,Ve=!0,li=!0),et.id!==b&&(b=et.id,Ve=!0),Zn||_!==R){Y.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),be.setValue(F,"projectionMatrix",R.projectionMatrix),be.setValue(F,"viewMatrix",R.matrixWorldInverse);const Ye=be.map.cameraPosition;Ye!==void 0&&Ye.setValue(F,It.setFromMatrixPosition(R.matrixWorld)),ct.logarithmicDepthBuffer&&be.setValue(F,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(et.isMeshPhongMaterial||et.isMeshToonMaterial||et.isMeshLambertMaterial||et.isMeshBasicMaterial||et.isMeshStandardMaterial||et.isShaderMaterial)&&be.setValue(F,"isOrthographic",R.isOrthographicCamera===!0),_!==R&&(_=R,Ve=!0,li=!0)}if(W.isSkinnedMesh){be.setOptional(F,W,"bindMatrix"),be.setOptional(F,W,"bindMatrixInverse");const He=W.skeleton;He&&(He.boneTexture===null&&He.computeBoneTexture(),be.setValue(F,"boneTexture",He.boneTexture,wt))}W.isBatchedMesh&&(be.setOptional(F,W,"batchingTexture"),be.setValue(F,"batchingTexture",W._matricesTexture,wt),be.setOptional(F,W,"batchingIdTexture"),be.setValue(F,"batchingIdTexture",W._indirectTexture,wt),be.setOptional(F,W,"batchingColorTexture"),W._colorsTexture!==null&&be.setValue(F,"batchingColorTexture",W._colorsTexture,wt));const rn=tt.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&xt.update(W,tt,Le),(Ve||Vt.receiveShadow!==W.receiveShadow)&&(Vt.receiveShadow=W.receiveShadow,be.setValue(F,"receiveShadow",W.receiveShadow)),et.isMeshGouraudMaterial&&et.envMap!==null&&(an.envMap.value=L,an.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1),et.isMeshStandardMaterial&&et.envMap===null&&q.environment!==null&&(an.envMapIntensity.value=q.environmentIntensity),Ve&&(be.setValue(F,"toneMappingExposure",x.toneMappingExposure),Vt.needsLights&&Zs(an,li),gt&&et.fog===!0&&ut.refreshFogUniforms(an,gt),ut.refreshMaterialUniforms(an,et,$,st,f.state.transmissionRenderTarget[R.id]),Lo.upload(F,Xs(Vt),an,wt)),et.isShaderMaterial&&et.uniformsNeedUpdate===!0&&(Lo.upload(F,Xs(Vt),an,wt),et.uniformsNeedUpdate=!1),et.isSpriteMaterial&&be.setValue(F,"center",W.center),be.setValue(F,"modelViewMatrix",W.modelViewMatrix),be.setValue(F,"normalMatrix",W.normalMatrix),be.setValue(F,"modelMatrix",W.matrixWorld),et.isShaderMaterial||et.isRawShaderMaterial){const He=et.uniformsGroups;for(let Ye=0,Ko=He.length;Ye<Ko;Ye++){const hi=He[Ye];qt.update(hi,Le),qt.bind(hi,Le)}}return Le}function Zs(R,q){R.ambientLightColor.needsUpdate=q,R.lightProbe.needsUpdate=q,R.directionalLights.needsUpdate=q,R.directionalLightShadows.needsUpdate=q,R.pointLights.needsUpdate=q,R.pointLightShadows.needsUpdate=q,R.spotLights.needsUpdate=q,R.spotLightShadows.needsUpdate=q,R.rectAreaLights.needsUpdate=q,R.hemisphereLights.needsUpdate=q}function ds(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(R,q,tt){const et=vt.get(R);et.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,et.__autoAllocateDepthBuffer===!1&&(et.__useRenderToTexture=!1),vt.get(R.texture).__webglTexture=q,vt.get(R.depthTexture).__webglTexture=et.__autoAllocateDepthBuffer?void 0:tt,et.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,q){const tt=vt.get(R);tt.__webglFramebuffer=q,tt.__useDefaultFramebuffer=q===void 0};const fs=F.createFramebuffer();this.setRenderTarget=function(R,q=0,tt=0){T=R,P=q,I=tt;let et=!0,W=null,gt=!1,Ct=!1;if(R){const L=vt.get(R);if(L.__useDefaultFramebuffer!==void 0)Y.bindFramebuffer(F.FRAMEBUFFER,null),et=!1;else if(L.__webglFramebuffer===void 0)wt.setupRenderTarget(R);else if(L.__hasExternalTextures)wt.rebindTextures(R,vt.get(R.texture).__webglTexture,vt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const K=R.depthTexture;if(L.__boundDepthTexture!==K){if(K!==null&&vt.has(K)&&(R.width!==K.image.width||R.height!==K.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");wt.setupDepthRenderbuffer(R)}}const O=R.texture;(O.isData3DTexture||O.isDataArrayTexture||O.isCompressedArrayTexture)&&(Ct=!0);const j=vt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(j[q])?W=j[q][tt]:W=j[q],gt=!0):R.samples>0&&wt.useMultisampledRTT(R)===!1?W=vt.get(R).__webglMultisampledFramebuffer:Array.isArray(j)?W=j[tt]:W=j,D.copy(R.viewport),z.copy(R.scissor),B=R.scissorTest}else D.copy(yt).multiplyScalar($).floor(),z.copy(Wt).multiplyScalar($).floor(),B=te;if(tt!==0&&(W=fs),Y.bindFramebuffer(F.FRAMEBUFFER,W)&&et&&Y.drawBuffers(R,W),Y.viewport(D),Y.scissor(z),Y.setScissorTest(B),gt){const L=vt.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+q,L.__webglTexture,tt)}else if(Ct){const L=q;for(let O=0;O<R.textures.length;O++){const j=vt.get(R.textures[O]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+O,j.__webglTexture,tt,L)}}else if(R!==null&&tt!==0){const L=vt.get(R.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,L.__webglTexture,tt)}b=-1},this.readRenderTargetPixels=function(R,q,tt,et,W,gt,Ct,Ut=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let L=vt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(L=L[Ct]),L){Y.bindFramebuffer(F.FRAMEBUFFER,L);try{const O=R.textures[Ut],j=O.format,K=O.type;if(!ct.textureFormatReadable(j)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ct.textureTypeReadable(K)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}q>=0&&q<=R.width-et&&tt>=0&&tt<=R.height-W&&(R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ut),F.readPixels(q,tt,et,W,Nt.convert(j),Nt.convert(K),gt))}finally{const O=T!==null?vt.get(T).__webglFramebuffer:null;Y.bindFramebuffer(F.FRAMEBUFFER,O)}}},this.readRenderTargetPixelsAsync=async function(R,q,tt,et,W,gt,Ct,Ut=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let L=vt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(L=L[Ct]),L)if(q>=0&&q<=R.width-et&&tt>=0&&tt<=R.height-W){Y.bindFramebuffer(F.FRAMEBUFFER,L);const O=R.textures[Ut],j=O.format,K=O.type;if(!ct.textureFormatReadable(j))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ct.textureTypeReadable(K))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const _t=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,_t),F.bufferData(F.PIXEL_PACK_BUFFER,gt.byteLength,F.STREAM_READ),R.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ut),F.readPixels(q,tt,et,W,Nt.convert(j),Nt.convert(K),0);const kt=T!==null?vt.get(T).__webglFramebuffer:null;Y.bindFramebuffer(F.FRAMEBUFFER,kt);const oe=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await vd(F,oe,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,_t),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,gt),F.deleteBuffer(_t),F.deleteSync(oe),gt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,q=null,tt=0){const et=Math.pow(2,-tt),W=Math.floor(R.image.width*et),gt=Math.floor(R.image.height*et),Ct=q!==null?q.x:0,Ut=q!==null?q.y:0;wt.setTexture2D(R,0),F.copyTexSubImage2D(F.TEXTURE_2D,tt,0,0,Ct,Ut,W,gt),Y.unbindTexture()};const Pi=F.createFramebuffer(),ke=F.createFramebuffer();this.copyTextureToTexture=function(R,q,tt=null,et=null,W=0,gt=null){gt===null&&(W!==0?(Us("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),gt=W,W=0):gt=0);let Ct,Ut,L,O,j,K,_t,kt,oe;const Yt=R.isCompressedTexture?R.mipmaps[gt]:R.image;if(tt!==null)Ct=tt.max.x-tt.min.x,Ut=tt.max.y-tt.min.y,L=tt.isBox3?tt.max.z-tt.min.z:1,O=tt.min.x,j=tt.min.y,K=tt.isBox3?tt.min.z:0;else{const rn=Math.pow(2,-W);Ct=Math.floor(Yt.width*rn),Ut=Math.floor(Yt.height*rn),R.isDataArrayTexture?L=Yt.depth:R.isData3DTexture?L=Math.floor(Yt.depth*rn):L=1,O=0,j=0,K=0}et!==null?(_t=et.x,kt=et.y,oe=et.z):(_t=0,kt=0,oe=0);const $t=Nt.convert(q.format),Vt=Nt.convert(q.type);let xe;q.isData3DTexture?(wt.setTexture3D(q,0),xe=F.TEXTURE_3D):q.isDataArrayTexture||q.isCompressedArrayTexture?(wt.setTexture2DArray(q,0),xe=F.TEXTURE_2D_ARRAY):(wt.setTexture2D(q,0),xe=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,q.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,q.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,q.unpackAlignment);const le=F.getParameter(F.UNPACK_ROW_LENGTH),Le=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Zn=F.getParameter(F.UNPACK_SKIP_PIXELS),Ve=F.getParameter(F.UNPACK_SKIP_ROWS),li=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Yt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Yt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,O),F.pixelStorei(F.UNPACK_SKIP_ROWS,j),F.pixelStorei(F.UNPACK_SKIP_IMAGES,K);const be=R.isDataArrayTexture||R.isData3DTexture,an=q.isDataArrayTexture||q.isData3DTexture;if(R.isDepthTexture){const rn=vt.get(R),He=vt.get(q),Ye=vt.get(rn.__renderTarget),Ko=vt.get(He.__renderTarget);Y.bindFramebuffer(F.READ_FRAMEBUFFER,Ye.__webglFramebuffer),Y.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ko.__webglFramebuffer);for(let hi=0;hi<L;hi++)be&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,vt.get(R).__webglTexture,W,K+hi),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,vt.get(q).__webglTexture,gt,oe+hi)),F.blitFramebuffer(O,j,Ct,Ut,_t,kt,Ct,Ut,F.DEPTH_BUFFER_BIT,F.NEAREST);Y.bindFramebuffer(F.READ_FRAMEBUFFER,null),Y.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(W!==0||R.isRenderTargetTexture||vt.has(R)){const rn=vt.get(R),He=vt.get(q);Y.bindFramebuffer(F.READ_FRAMEBUFFER,Pi),Y.bindFramebuffer(F.DRAW_FRAMEBUFFER,ke);for(let Ye=0;Ye<L;Ye++)be?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,rn.__webglTexture,W,K+Ye):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,rn.__webglTexture,W),an?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,He.__webglTexture,gt,oe+Ye):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,He.__webglTexture,gt),W!==0?F.blitFramebuffer(O,j,Ct,Ut,_t,kt,Ct,Ut,F.COLOR_BUFFER_BIT,F.NEAREST):an?F.copyTexSubImage3D(xe,gt,_t,kt,oe+Ye,O,j,Ct,Ut):F.copyTexSubImage2D(xe,gt,_t,kt,O,j,Ct,Ut);Y.bindFramebuffer(F.READ_FRAMEBUFFER,null),Y.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else an?R.isDataTexture||R.isData3DTexture?F.texSubImage3D(xe,gt,_t,kt,oe,Ct,Ut,L,$t,Vt,Yt.data):q.isCompressedArrayTexture?F.compressedTexSubImage3D(xe,gt,_t,kt,oe,Ct,Ut,L,$t,Yt.data):F.texSubImage3D(xe,gt,_t,kt,oe,Ct,Ut,L,$t,Vt,Yt):R.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,gt,_t,kt,Ct,Ut,$t,Vt,Yt.data):R.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,gt,_t,kt,Yt.width,Yt.height,$t,Yt.data):F.texSubImage2D(F.TEXTURE_2D,gt,_t,kt,Ct,Ut,$t,Vt,Yt);F.pixelStorei(F.UNPACK_ROW_LENGTH,le),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Le),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Zn),F.pixelStorei(F.UNPACK_SKIP_ROWS,Ve),F.pixelStorei(F.UNPACK_SKIP_IMAGES,li),gt===0&&q.generateMipmaps&&F.generateMipmap(xe),Y.unbindTexture()},this.initRenderTarget=function(R){vt.get(R).__webglFramebuffer===void 0&&wt.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?wt.setTextureCube(R,0):R.isData3DTexture?wt.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?wt.setTexture2DArray(R,0):wt.setTexture2D(R,0),Y.unbindTexture()},this.resetState=function(){P=0,I=0,T=null,Y.reset(),At.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}class vv{camera;pitch=De.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new N;desired=new N;aspect=1;constructor(){this.camera=new _c(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=De.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const i=1-Math.pow(.001,t);this.focus.lerp(e,i),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,i=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*i*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*i*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,i){const s=Math.sin(this.yaw),o=Math.cos(this.yaw);return i.set(t*o-e*s,0,-t*s-e*o),i}}class _v{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};ponteiro={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(xv.has(e)||Mv.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.surface.getBoundingClientRect();if(this.ponteiro.x=(t.clientX-e.left)/e.width*2-1,this.ponteiro.y=1-(t.clientY-e.top)/e.height*2,t.pointerId!==this.stickId)return;const i=60,s=Math.max(-i,Math.min(i,t.clientX-this.stickOrigin.x)),o=Math.max(-i,Math.min(i,t.clientY-this.stickOrigin.y));this.stickX=s/i,this.stickY=o/i};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};pointer(){return{x:this.ponteiro.x,y:this.ponteiro.y}}move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const i=Math.hypot(t,e);return i>1&&(t/=i,e/=i),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}tapGirar(t){this.pressed.add(t<0?"KeyQ":"KeyR")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const xv=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),Mv=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF","KeyH","KeyI","Tab"]),fn=["cabeca","tronco","pernas","pes"],S={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,grassDry:11059802,dirt:12159572,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,brick:13068882,wallCream:15984595,wallMint:14085344,wallAzul:13624565,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,mesaVerde:3108695,cortica:14133098,corticaEscura:12159055,estanteFundo:7030048,pelusaBranco:16184042,pelusaCinza:11050641,pelusaCinzaEscuro:9076852,pelusaFocinho:15247277,pelusaOrelha:14395816,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,roupaLa:14248826,roupaLaBarra:16180168,roupaListra:4882400,roupaListraManga:15987180,roupaJeans:4151942,roupaBota:16763213,roupaBotaCano:9067050,vestidoRosa:16176088,vestidoRenda:16644080,vestidoFita:15773373,maidPreto:2828851,maidCreme:16447214,maidFita:1512988,maidLacoVermelho:12727364,moletomPreto:2500140,moletomCostura:1315864,moletomZiper:4539983,moletomForro:5461086,moletomPonteira:14276301,waRosa:15775432,waRosaForte:14250895,waEscuro:3880263,waBranco:16644853,waFivela:12170944,bermudaAzul:3112912,bermudaVermelha:14173503,bermudaAmarela:15906857,bermudaEstampa:3126696,bermudaEstampaFaixa:16642261,oculosLente:2302251,oculosArmacao:4012872,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578,pessego:16756838};let vi=null;function yv(){if(!vi){const n=new Uint8Array([96,166,214,255]);vi=new Hd(n,n.length,1,sc),vi.minFilter=je,vi.magFilter=je,vi.generateMipmaps=!1,vi.needsUpdate=!0}return vi}const Pl=new Map;function A(n,t={}){const e=`${n}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.decal?1:0}`,i=Pl.get(e);if(i)return i;const s=new Gh({color:n,gradientMap:yv(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?bn:Wn});return t.glow&&(s.emissive=new ae(n),s.emissiveIntensity=t.glow),t.decal&&Kh(s),Pl.set(e,s),s}function Kh(n){n.polygonOffset=!0,n.polygonOffsetFactor=-1,n.polygonOffsetUnits=-4,n.depthWrite=!1}const Rl=new Map;function Xe(n,t=1,e=!1){const i=`${n}|${t}|${e?1:0}`,s=Rl.get(i);if(s)return s;const o=new jo({color:n,transparent:t<1,opacity:t,side:bn});return e&&Kh(o),Rl.set(i,o),o}const Il=new Map;function Ll(n){const t=Il.get(n);if(t)return t;const e=new Lh({color:n});return Il.set(n,e),e}function Fr(n="redonda",t=1,e=.5){const i=new ot,s=2.1*t,o=new y(new nt(.13*t,.2*t,s,8),A(S.trunk));if(o.position.y=s/2,i.add(o),n==="pinheiro")for(let a=0;a<3;a++){const r=(1.1-a*.26)*t,c=new y(new Ne(r,1.3*t,9),A(a===0?S.leafDark:S.leafMid));c.position.y=s*.7+a*.72*t,i.add(c)}else if(n==="palmeira"){o.scale.y=1.5,o.position.y=s*.75;for(let a=0;a<7;a++){const r=a/7*Math.PI*2,c=new y(new Rt(.75*t,8,6),A(S.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(r)*.85*t,s*1.5-.1,Math.sin(r)*.85*t),c.rotation.y=-r,c.rotation.z=-.32,i.add(c)}}else{const a=n==="florida"?S.flowerPink:S.leafMid;[[0,s+.55*t,0,1.15],[.62*t,s+.15*t,.2*t,.78],[-.5*t,s+.3*t,-.35*t,.88],[.1*t,s+1.05*t,-.3*t,.66]].forEach(([c,l,h,u],d)=>{const p=new y(new Hs(u*t,1),A(d%2===0?a:n==="florida"?S.flowerPink:S.leafLight));p.position.set(c,l,h),p.rotation.set(e*3,e*5,e*2),i.add(p)})}return i}function Do(n=1,t=S.bush){const e=new ot;for(let i=0;i<3;i++){const s=new y(new Hs(.42*n,1),A(t));s.position.set((i-1)*.36*n,.3*n+(i===1?.12:0),i%2*.18*n),e.add(s)}return e}function Or(n=6,t=.9,e=[S.flowerPink,S.flowerYellow,16777215]){const i=new ot;for(let s=0;s<n;s++){const o=s/n*Math.PI*2+s*.7,a=t*(.35+s*37%100/140),r=new y(new nt(.02,.02,.3,5),A(S.leafDark));r.position.set(Math.cos(o)*a,.15,Math.sin(o)*a),i.add(r);const c=new y(new Rt(.09,8,6),A(e[s%e.length]));c.position.set(Math.cos(o)*a,.33,Math.sin(o)*a),c.scale.y=.7,i.add(c)}return i}function So(n=1,t=.5,e=10133670){const i=new ot,s=new dc(.5*n,0),o=s.attributes.position;for(let r=0;r<o.count;r++){const c=o.getX(r),l=o.getY(r),h=o.getZ(r),u=Math.sin(Math.round(c*1e3)*12.9898+Math.round(l*1e3)*78.233+Math.round(h*1e3)*37.719+t*53.1)*43758.5453,d=1+(u-Math.floor(u)-.5)*.3;o.setXYZ(r,c*d,l*d,h*d)}s.computeVertexNormals();const a=new y(s,A(e));return a.position.y=.3*n*(.8+t*.4),a.rotation.set(t*6.28,t*4.1,t*2.2),a.scale.set(1+t*.3,.6+t*.4,1.1-t*.3),i.add(a),i}function Dl(n=1,t=S.leafMid){const e=new ot,i=6;for(let s=0;s<i;s++){const o=s/i*Math.PI*2+s*.7,a=(.28+s*37%10/40)*n,r=new y(new Ne(.035*n,a,5),A(s%3===0?S.leafDark:s%3===1?t:S.grassDry));r.position.set(Math.cos(o)*.11*n,a*.45,Math.sin(o)*.11*n),r.rotation.set(Math.sin(o)*.35,0,Math.cos(o)*.35),e.add(r)}return e}function bv(n=1.2,t=7){const e=new ot;for(let i=0;i<t;i++){const s=i/t*Math.PI*2+i*1.3,o=.06+i*53%10/55,a=n*(.7+i*29%10/22),r=new y(new nt(.02,.028,a,5),A(i%2?S.leafDark:S.leafMid)),c=.12+i*17%10/60;if(r.position.set(Math.cos(s)*o,a/2,Math.sin(s)*o),r.rotation.set(Math.sin(s)*c,0,Math.cos(s)*c),e.add(r),i%3===0){const l=new y(new Tn(.045,a*.16,4,8),A(9071162));l.position.set(Math.cos(s)*(o+Math.cos(s)*c*a*.5),a*.97,Math.sin(s)*(o+Math.sin(s)*c*a*.5)),e.add(l)}}return e}function Sv(n=1,t=!0){const e=new ot;for(const[i,s,o]of[[0,0,.62],[.34,.2,.44]]){const a=new y(new Rt(o*n,14,6,0,Math.PI*2,0,.5),A(S.leafLight));a.scale.y=.3,a.position.set(i*n,.03,s*n),e.add(a)}if(t){const i=new y(new Rt(.08*n,8,6),A(S.flowerYellow));i.position.set(.16*n,.14*n,.08*n),e.add(i);for(let s=0;s<5;s++){const o=s/5*Math.PI*2,a=new y(new Rt(.06*n,7,5),A(16773365));a.position.set(.16*n+Math.cos(o)*.08*n,.12*n,.08*n+Math.sin(o)*.08*n),a.scale.set(1.3,.6,1.3),e.add(a)}}return e}function wv(n=1.1,t=[S.flowerPink,S.flowerYellow,16777215,12160992],e=.5){const i=new ot,s=.24,o=new y(new nt(n,n*1.05,s,18,1,!0),A(S.brick,{doubleSide:!0}));o.position.y=s/2,i.add(o);const a=new y(new _e(n,.05,6,20),A(S.wallCream));a.rotation.x=Math.PI/2,a.position.y=s,i.add(a);const r=new y(new nt(n*.96,n*.96,.08,18),A(S.dirt));r.position.y=s-.03,i.add(r);const c=7;for(let l=0;l<c;l++){const h=l/c*Math.PI*2+e*6.28,u=n*(.25+(l*41+e*100)%10/18),d=t[l%t.length],p=Math.cos(h)*u,g=Math.sin(h)*u,v=new y(new Rt(.2,8,6),A(S.leafDark));v.position.set(p,s+.06,g),v.scale.y=.55,i.add(v);for(let m=0;m<4;m++){const f=m/4*Math.PI*2+l,w=new y(new Rt(.075,8,6),A(d));w.position.set(p+Math.cos(f)*.12,s+.16+(m+l)%3*.05,g+Math.sin(f)*.12),w.scale.y=.8,i.add(w)}}return i}function Ev(n=2.6){const t=new ot,e=A(S.metalWhite),i=.26,s=new y(new nt(n*1.03,n*1.06,i,20),A(S.concrete));s.position.y=i/2,t.add(s);const o=new y(new Rt(n,18,10,0,Math.PI*2,0,Math.PI/2),A(14676731,{opacity:.72,doubleSide:!0}));o.position.y=i,t.add(o);for(let h=0;h<8;h++){const u=new y(new _e(n,.045,5,20,Math.PI),e);u.rotation.set(0,h/8*Math.PI,0),u.position.y=i,t.add(u)}for(const h of[.34,.62,.85]){const u=n*Math.sqrt(Math.max(.02,1-h*h)),d=new y(new _e(u,.038,5,22),e);d.rotation.x=Math.PI/2,d.position.y=i+n*h,t.add(d)}for(const h of[0,1]){const u=new y(new _e(n,.09,6,18,Math.PI-.5),e);u.rotation.x=Math.PI/2,u.rotation.z=h?Math.PI+.25:.25,u.position.y=i+.04,t.add(u)}const a=new y(new Rt(.16,10,8),e);a.position.y=i+n,t.add(a);for(let h=0;h<6;h++){const u=h/6*Math.PI*2+.3,d=n*.62,p=new y(new nt(.05,.06,d,6),A(S.metalGrey));p.position.set(Math.cos(u)*n*.84,i+d/2,Math.sin(u)*n*.84),t.add(p)}const r=Qh(S.wood);r.scale.setScalar(.72),r.position.set(0,i,-n*.35),r.rotation.y=.25,t.add(r);const c=new y(new nt(.26,.2,.36,10),A(S.plantPot));c.position.set(n*.4,i+.18,n*.35),t.add(c);const l=new y(new Hs(.34,0),A(S.leafMid));return l.position.set(n*.4,i+.55,n*.35),t.add(l),t}function Qh(n=S.wood){const t=new ot,e=new y(new G(1.9,.1,.55),A(n));e.position.y=.48,t.add(e);const i=new y(new G(1.9,.5,.09),A(n));i.position.set(0,.76,-.25),i.rotation.x=-.16,t.add(i);for(const s of[-1,1]){const o=new y(new G(.1,.48,.5),A(S.metalGrey));o.position.set(s*.78,.24,0),t.add(o)}return t}function Da(n=!1){const t=new ot,e=new y(new nt(.07,.09,3.4,8),A(S.metalGrey));e.position.y=1.7,t.add(e);const i=new y(new Rt(.3,12,10,0,Math.PI*2,0,Math.PI*.62),A(S.metalWhite));i.position.y=3.45,i.rotation.x=Math.PI,t.add(i);const s=new y(new Rt(.2,10,8),A(n?S.gold:15263968,{glow:n?.9:0}));return s.position.y=3.32,t.add(s),t}function Ul(){const n=new ot,t=new y(new nt(.28,.24,.75,10),A(5208650));t.position.y=.38,n.add(t);const e=new y(new _e(.29,.04,6,14),A(S.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,n.add(e),n}function Tv(){const n=new ot,t=new y(new G(1.9,.1,1),A(S.wood));t.position.y=.76,n.add(t);for(const e of[-1,1]){const i=new y(new G(.1,.76,.9),A(S.woodDark));i.position.set(e*.75,.38,0),n.add(i);const s=new y(new G(1.9,.08,.34),A(S.wood));s.position.set(0,.45,e*.78),n.add(s);const o=new y(new G(1.6,.45,.08),A(S.woodDark));o.position.set(0,.22,e*.78),n.add(o)}return n}function qi(n=4,t=1.1,e=S.metalGrey){const i=new ot,s=Math.max(2,Math.round(n/1.2));for(let o=0;o<=s;o++){const a=new y(new nt(.05,.05,t,6),A(e));a.position.set(-n/2+o/s*n,t/2,0),i.add(a)}for(const o of[t*.35,t*.8]){const a=new y(new G(n,.06,.06),A(e));a.position.y=o,i.add(a)}return i}function Av(n=S.wood,t=S.metalWhite){const e=new ot,i=new y(new nt(.06,.06,1.6,6),A(S.woodDark));i.position.y=.8,e.add(i);const s=new y(new G(1.1,.7,.08),A(n));s.position.y=1.5,e.add(s);const o=new y(new G(.85,.12,.02),A(t));return o.position.set(0,1.62,.05),e.add(o),e}function tu(n=1){const t=new ot,e=Xe(16777215,.92),i=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[s,o,a,r]of i){const c=new y(new Rt(r*n,10,8),e);c.position.set(s*n,o*n,a*n),t.add(c)}return t}function Cv(n,t,e,i){const s=new ot,o=9,a=n/o,r=.35,c=1.15,l=new ot;l.rotation.z=Math.PI/2;for(let d=0;d<o;d++){const p=new y(new nt(t,t,a*1.02,10,1,!0,r,c),A(d%2===0?e:i,{doubleSide:!0}));p.position.y=-n/2+a*(d+.5),l.add(p)}s.add(l);const h=Math.sin(r)*t,u=Math.cos(r)*t;for(let d=0;d<o;d++){const p=new y(new Rt(a*.36,8,6),A(d%2===0?e:i));p.position.set(-n/2+a*(d+.5),h-a*.2,u),p.scale.set(1,1.15,.7),s.add(p)}return s}function Br(n=S.fabricRed,t={}){const e=new ot;e.userData.peca="quiosque";const i=t.tipo??"simples",s=S.wallCream,o=A(S.wood),a=A(S.woodDark),r=new y(new G(2.8,.16,1.9),a);r.position.y=.08,e.add(r);const c=new y(new G(2.35,1.7,1.4),A(s));c.position.set(0,1.01,-.05),e.add(c);for(const M of[-1,1]){const x=new y(new G(.26,1.7,.14),o);x.position.set(M*1.1,.99,.68),e.add(x)}const l=new y(new G(2.5,.22,.16),o);l.position.set(0,1.715,.68),e.add(l);const h=new y(new G(1.82,.44,.06),A(5981750));h.position.set(0,1.42,.66),e.add(h);const u=new y(new G(2.5,.14,.78),o);u.position.set(0,1.12,.94),e.add(u);const d=new y(new nt(.075,.075,2.5,10),a);d.rotation.z=Math.PI/2,d.position.set(0,1.12,1.32),e.add(d);for(const M of[-1,1]){const x=new y(new nt(.05,.05,1.05,8),A(S.metalWhite));x.position.set(M*1.18,.6,1.24),e.add(x)}const p=new y(new G(2.55,.16,1.55),a);p.position.set(0,1.92,-.05),e.add(p);const g=Cv(2.5,.44,n,s);g.position.set(0,1.54,.62),e.add(g);const v=t.texto??(i==="sorvete"?"Sorvete":i==="suco"?"Sucos":""),m=new y(new G(1.75,.5,.12),A(n));m.position.set(0,2.3,-.05),e.add(m);const f=new y(new G(1.9,.62,.08),A(s));if(f.position.set(0,2.3,-.09),e.add(f),v){const M=Mc(v,1.5,.34);M.position.set(0,2.3,.02),e.add(M)}if(i==="sorvete"){const M=Hr(S.morango);M.scale.setScalar(2.6),M.position.set(0,2.78,-.05),e.add(M);const x=new y(new G(1.24,.16,.56),A(S.metalWhite));x.position.set(-.58,1.26,1.06),e.add(x),[S.morango,S.maracuja,S.chocolate].forEach((P,I)=>{const T=new y(new nt(.15,.13,.22,10),A(S.metalWhite));T.position.set(-1+I*.36,1.29,1.06),e.add(T);const b=new y(new Rt(.14,10,8),A(P));b.position.set(-1+I*.36,1.42,1.06),b.scale.y=.8,e.add(b)});for(let P=0;P<3;P++){const I=new y(new Ne(.1,.3,10),A(14197852));I.position.set(.72,1.34+P*.07,1.04+P*.02),I.rotation.x=Math.PI,e.add(I)}}else if(i==="suco"){const M=new y(new Rt(.32,12,10),A(S.laranja));M.position.set(0,2.85,-.05),e.add(M);const x=new y(new Rt(.13,8,6),A(S.leafMid));x.position.set(.14,3.12,-.05),x.scale.set(1.5,.4,.8),x.rotation.z=.5,e.add(x),[S.laranja,S.limao].forEach((_,D)=>{const z=new y(new nt(.15,.14,.42,12,1,!0),A(S.glass,{opacity:.45,doubleSide:!0}));z.position.set(-.78+D*.42,1.4,1.06),e.add(z);const B=new y(new nt(.13,.12,.28,12),A(_));B.position.set(-.78+D*.42,1.33,1.06),e.add(B);const V=new y(new nt(.025,.025,.12,6),A(S.metalGrey));V.position.set(-.78+D*.42,1.26,1.2),V.rotation.x=Math.PI/2,e.add(V)});const P=new y(new nt(.22,.17,.12,12),A(S.plantPot));P.position.set(.42,1.25,1.06),e.add(P);const I=[[.32,1.34,1.03,S.laranja],[.52,1.34,1.08,S.limao],[.42,1.4,1.05,S.morango]];for(const[_,D,z,B]of I){const V=new y(new Rt(.1,10,8),A(B));V.position.set(_,D,z),e.add(V)}const T=new y(new nt(.09,.07,.2,10),A(s));T.position.set(.95,1.29,1.06),e.add(T),[S.morango,S.limao,S.fabricBlue].forEach((_,D)=>{const z=new y(new nt(.014,.014,.34,6),A(_));z.position.set(.93+D*.03,1.44,1.06-D*.02),z.rotation.z=(D-1)*.18,e.add(z)})}const w=new y(new G(.06,.62,.5),A(3551276));w.position.set(1.16,1.3,.15),e.add(w);for(let M=0;M<3;M++){const x=new y(new G(.02,.045,.3-M*.06),A(s));x.position.set(1.205,1.46-M*.16,.15),e.add(x)}return e}function kr(n=4,t=6,e=4,i=S.wallCream,s=S.roofTile,o=S.glass){const a=new ot,r=new y(new G(n,t,e),A(i));r.position.y=t/2,a.add(r);const c=new y(new G(n+.3,.35,e+.3),A(s));c.position.y=t+.17,a.add(c);const l=Math.max(1,Math.floor(n/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let u=0;u<h;u++)for(let d=0;d<l;d++){const p=new y(new G(.65,.8,.06),A(o,{glow:.15})),g=-n/2+n/l*(d+.5),v=.9+t/h*u;p.position.set(g,v,e/2+.02),a.add(p);const m=p.clone();m.position.z=-e/2-.02,a.add(m)}return a}function Pv(n=S.mesaVerde){const t=new ot,e=2.6,i=1.4,s=.76,o=A(16054261),a=new y(new G(e,.06,i),A(n));a.position.y=s,t.add(a);for(const l of[-i/2+.05,i/2-.05,0]){const h=new y(new G(e-.02,.008,.05),o);h.position.set(0,s+.032,l),t.add(h)}for(const l of[-e/2+.04,e/2-.04]){const h=new y(new G(.05,.008,i-.02),o);h.position.set(l,s+.032,0),t.add(h)}const r=new y(new G(.03,.19,i+.16),A(16514556,{opacity:.72,doubleSide:!0}));r.position.y=s+.13,t.add(r);const c=new y(new G(.045,.035,i+.18),A(16777215));c.position.y=s+.225,t.add(c);for(const l of[-1.5599999999999998/2,(i+.16)/2]){const h=new y(new nt(.022,.022,.24,8),A(S.metalGrey));h.position.set(0,s+.12,l),t.add(h)}for(const l of[-e/2+.22,e/2-.22]){for(const u of[-i/2+.18,i/2-.18]){const d=new y(new nt(.035,.045,s,8),A(S.metalGrey));d.position.set(l,s/2,u),t.add(d)}const h=new y(new G(.05,.05,i-.36),A(S.metalGrey));h.position.set(l,s*.35,0),t.add(h)}return t}function eu(){const n=new y(new Rt(.055,12,10),A(16775398,{glow:.12}));return n.castShadow=!0,n}function Ho(n=S.metalRed){const t=new ot,e=new y(new nt(.17,.17,.035,20),A(n));e.rotation.x=Math.PI/2,t.add(e);const i=new y(new nt(.185,.185,.022,20),A(S.wood));i.rotation.x=Math.PI/2,t.add(i);const s=new y(new Tn(.035,.16,4,8),A(S.woodDark));return s.position.y=-.25,t.add(s),t.traverse(o=>{const a=o;a.isMesh&&(a.castShadow=!0)}),t}function nu(n=S.frisbee){const t=new y(new nt(.28,.24,.07,20),A(n));return t.castShadow=!0,t}function iu(n=1){const t=new ot,e=A(S.heart,{glow:.35});for(const s of[-1,1]){const o=new y(new Rt(.16*n,10,8),e);o.position.set(s*.13*n,.1*n,0),t.add(o)}const i=new y(new Ne(.22*n,.34*n,10),e);return i.position.y=-.1*n,i.rotation.x=Math.PI,t.add(i),t}function Ua(n=16184040){const t=new ot,e=new y(new Rt(.22,10,8),A(n));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const i=new y(new nt(.06,.08,.24,8),A(n));i.position.set(0,.28,.14),t.add(i);const s=new y(new Rt(.11,10,8),A(n));s.position.set(0,.4,.16),t.add(s);const o=new y(new Ne(.05,.14,6),A(S.gold));return o.position.set(0,.39,.28),o.rotation.x=Math.PI/2,t.add(o),t}function Vr(n=S.wallCream){const t=new ot;t.userData.patins=!0;const e=.045,i=new y(new G(.13,.15,.26),A(n));i.position.set(0,e*2+.115,.01),t.add(i);const s=new y(new G(.125,.13,.15),A(n));s.position.set(0,e*2+.25,-.04),t.add(s);const o=new y(new G(.135,.04,.13),A(S.frisbee));o.position.set(0,e*2+.235,.02),t.add(o);const a=new y(new G(.1,.05,.28),A(S.metalGrey));a.position.set(0,e*2+.015,.01),t.add(a);for(const r of[-1,1])for(const c of[-1,1]){const l=new y(new nt(e,e,.035,10),A(S.frisbee));l.rotation.z=Math.PI/2,l.position.set(r*.062,e,.01+c*.095),t.add(l)}return t}function Rv(n=S.fabricBlue){const t=new ot,e=7.4,i=4.4,s=2.9,o=A(S.wallCream),a=A(S.wood),r=A(S.woodDark),c=A(S.metalWhite),l=new y(new G(e+1.6,.18,i+1.4),A(S.concrete));l.position.set(.4,.09,.3),t.add(l);const h=new y(new G(e,s,.26),o);h.position.set(0,.18+s/2,-i/2),t.add(h);for(const _ of[-1,1]){const D=new y(new G(.26,s,i),o);D.position.set(_*(e/2-.13),.18+s/2,0),t.add(D)}const u=new y(new G(e,.6,.3),r);u.position.set(0,.48,i/2-.1),t.add(u);const d=A(S.glass,{opacity:.5,doubleSide:!0}),p=3,g=e-.5,v=g/p-.16;for(let _=0;_<p;_++){const D=-g/2+g/p*(_+.5),z=new y(new G(v,1.75,.08),d);z.position.set(D,1.68,i/2-.1),t.add(z)}for(let _=0;_<=p;_++){const D=-g/2+g/p*_,z=new y(new G(.14,2.05,.22),c);z.position.set(D,1.68,i/2-.1),t.add(z)}const m=new y(new G(e,.18,.24),c);m.position.set(0,2.68,i/2-.1),t.add(m);for(const[_,D]of[[1.15,[S.morango,S.fabricBlue,S.gold]],[1.95,[S.maracuja,S.wallCream]]]){const z=new y(new G(e-1.2,.1,.6),a);z.position.set(0,_,i/2-.75),t.add(z),D.forEach((B,V)=>{const H=new ot;for(const J of[-1,1]){const st=Vr(B);st.position.x=J*.09,H.add(st)}H.scale.setScalar(.8),H.position.set((V-(D.length-1)/2)*1.5,_+.05,i/2-.75),H.rotation.y=.3,t.add(H)})}const f=new y(new G(e+1.1,.24,i+1.3),r);f.position.set(0,s+.42,.35),f.rotation.x=-.07,t.add(f);const w=new y(new G(e+1.34,.08,i+1.54),c);w.position.set(0,s+.29,.35),w.rotation.x=-.07,t.add(w);const M=new y(new G(e+1.34,.74,.22),A(n));M.position.set(0,s+.46,i/2+1.18),t.add(M);const x=Mc("Patins",3.2,.46);x.position.set(0,s+.46,i/2+1.31),t.add(x);for(const _ of[-1,1]){const D=new y(new nt(.09,.09,s+.3,8),c);D.position.set(_*(e/2+.35),(s+.3)/2,i/2+.62),t.add(D)}const C=e/2+.95,P=new y(new G(1.15,.16,3),a);P.position.set(C,1.06,.2),t.add(P);const I=new y(new nt(.08,.08,3,10),r);I.position.set(C+.55,1.06,.2),t.add(I);const T=new y(new G(.9,.9,2.8),o);T.position.set(C-.1,.6,.2),t.add(T);const b=new y(new G(1.7,.16,3.2),A(n));b.position.set(C+.1,2.35,.2),t.add(b);for(const _ of[-1.2,1.5]){const D=new y(new nt(.07,.07,2.35,8),c);D.position.set(C+.6,1.17,.2+_),t.add(D)}return[S.morango,S.gold].forEach((_,D)=>{const z=new ot;for(const B of[-1,1]){const V=Vr(_);V.position.x=B*.09,z.add(V)}z.position.set(C,1.14,-.55+D*1.4),z.rotation.y=Math.PI/2+.2,t.add(z)}),t}function Nl(){const n=new ot,t=new y(new G(.34,.05,.34),A(S.frisbee));t.position.y=.025,n.add(t);const e=new y(new Ne(.15,.45,10),A(S.frisbee));e.position.y=.26,n.add(e);const i=new y(new nt(.1,.12,.09,10),A(16777215));return i.position.y=.28,n.add(i),n}function Iv(n,t,e=1.5){const i=new ot,s=A(10475752),o=.12,a=new y(new G(n,o,t),A(4165552));a.position.y=-e,a.receiveShadow=!0,i.add(a);for(const[r,c,l,h]of[[n,o,0,-t/2],[n,o,0,t/2],[o,t,-n/2,0],[o,t,n/2,0]]){const u=new y(new G(r,e,c),s);u.position.set(l,-e/2,h),u.receiveShadow=!0,i.add(u)}for(const[r,c,l,h]of[[n+.3,.18,0,-t/2-.12],[n+.3,.18,0,t/2+.12],[.18,t+.3,-n/2-.12,0],[.18,t+.3,n/2+.12,0]]){const u=new y(new G(r,.06,c),A(4951989));u.position.set(l,.02,h),i.add(u)}return i}function Lv(n,t){const e=new y(new Ue(n,t,12,8),new Gh({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function zl(n=S.fabricBlue){const t=new ot,e=new y(new G(.68,.07,1.7),A(S.metalWhite));e.position.y=.36,t.add(e);const i=new y(new G(.6,.06,1.5),A(n));i.position.y=.42,t.add(i);const s=new y(new G(.6,.06,.7),A(n));s.position.set(0,.6,-.75),s.rotation.x=-.75,t.add(s);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new y(new nt(.035,.035,.36,6),A(S.metalWhite));r.position.set(o*.3,.18,a*.72),t.add(r)}return t}function Fl(n=S.fabricRed){const t=new ot,e=new y(new nt(.32,.36,.12,12),A(S.concrete));e.position.y=.06,t.add(e);const i=new y(new nt(.045,.045,2.4,8),A(S.wood));i.position.y=1.2,t.add(i);const s=new y(new Ne(1.15,.5,12),A(n));s.position.y=2.35,t.add(s);const o=new y(new Ne(1.17,.18,12,1,!0),A(16777215,{doubleSide:!0}));o.position.y=2.2,t.add(o);const a=new y(new Rt(.07,8,6),A(S.gold));return a.position.y=2.62,t.add(a),t}function Dv(){const n=new ot;for(const t of[-.24,.24]){const e=new y(new _e(.22,.035,6,14,Math.PI),A(S.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),n.add(e);const i=new y(new nt(.035,.035,1.5,8),A(S.metalGrey));i.position.set(t,.05,-.44),n.add(i)}for(let t=0;t<3;t++){const e=new y(new G(.5,.05,.1),A(S.metalGrey));e.position.set(0,-.15-t*.34,-.44),n.add(e)}return n}function Na(n=S.frisbee){const t=new ot,e=new y(new _e(.42,.16,10,20),A(n));e.rotation.x=Math.PI/2,t.add(e);for(let i=0;i<4;i++){const s=i/4*Math.PI*2+Math.PI/4,o=new y(new _e(.42,.165,10,6,Math.PI/5),A(16777215));o.rotation.set(Math.PI/2,0,s),t.add(o)}return t}function Uv(){const n=new ot,t=new y(new nt(.22,.26,.1,12),A(S.concrete));t.position.y=.05,n.add(t);const e=new y(new nt(.05,.05,2.2,8),A(S.metalGrey));e.position.y=1.1,n.add(e);const i=new y(new G(.5,.07,.07),A(S.metalGrey));i.position.set(.22,2.16,0),n.add(i);const s=new y(new nt(.16,.12,.1,12),A(S.metalWhite));return s.position.set(.44,2.08,0),n.add(s),n}function Nv(){const n=new ot,t=new y(new G(.7,.8,.7),A(S.concrete));t.position.y=.4,n.add(t);const e=new y(new G(.62,.1,2.4),A(15791350));e.position.set(0,.85,1),n.add(e);for(const i of[-.36,.36]){const s=new y(new _e(.35,.04,6,14,Math.PI),A(S.metalGrey));s.position.set(i,.9,.1),s.rotation.set(0,Math.PI/2,0),n.add(s)}return n}function Hr(n=S.flowerPink){const t=new ot,e=new y(new Ne(.075,.22,10),A(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const i=new y(new Rt(.085,10,8),A(n));i.position.y=.13,t.add(i);const s=new y(new Rt(.06,8,7),A(n));return s.position.set(.03,.22,-.02),t.add(s),t}function Ol(n=S.laranja){const t=new ot;t.userData.suco=!0;const e=new y(new nt(.088,.062,.26,12),A(n));e.position.y=.13,t.add(e);const i=new y(new nt(.095,.09,.035,12),A(16645110));i.position.y=.25,t.add(i);const s=new y(new nt(.066,.066,.025,12),A(16645110));s.position.y=.012,t.add(s);const o=new y(new nt(.012,.012,.32,6),A(16645110));o.position.set(.04,.31,.014),o.rotation.z=-.34,t.add(o);const a=new y(new nt(.052,.052,.014,10),A(S.gold));return a.position.set(-.085,.26,0),a.rotation.x=Math.PI/2,a.rotation.z=.3,t.add(a),t}function Bl(n=S.metalGrey){const t=new ot,e=new y(new nt(.07,.09,1.5,10),A(n));e.position.y=.75,t.add(e);const i=new y(new nt(.52,.38,.42,14,1,!0),A(n));i.position.y=1,t.add(i);const s=new y(new _e(.62,.045,6,20),A(n));s.position.y=1.72,s.rotation.x=Math.PI/2,t.add(s);const o=new y(new nt(.1,.1,.3,8),A(n));o.position.y=1.9,t.add(o);for(let a=0;a<10;a++){const r=a/10*Math.PI*2,c=new y(new nt(.015,.015,.62,4),A(13226198));c.position.set(Math.cos(r)*.5,1.4,Math.sin(r)*.5),t.add(c)}return t}function zv(n=S.frisbee,t=1.9,e=.62){const i=new ot,s=e+.34,o=new y(new nt(.06,.08,t+e,10),A(n));o.position.set(-s,(t+e)/2,0),i.add(o);const a=new y(new nt(.24,.3,.12,12),A(S.metalGrey));a.position.set(-s,.06,0),i.add(a);const r=new y(new G(.36,.07,.07),A(n));r.position.set(-s+.18,t,0),i.add(r);const c=new y(new _e(e,.06,8,26),A(n));c.position.y=t,i.add(c);for(const l of[-.9,-.3,.3,.9]){const h=new y(new G(.05,.34,.02),Xe(S.gold));h.position.set(Math.sin(l)*e,t-Math.cos(l)*e-.17,0),i.add(h)}return i.traverse(l=>{const h=l;h.isMesh&&(h.castShadow=!0)}),i.userData.aro=c,i}function Fv(n=S.frisbee){const t=new ot,e=Xe(n,.92),i=new y(new _e(.86,.075,8,28),e);i.rotation.x=-Math.PI/2,i.position.y=.08,t.add(i);const s=new y(new nt(.15,.15,.07,14),e);s.position.y=.08,t.add(s);for(let a=0;a<4;a++){const r=a/4*Math.PI*2+Math.PI/4,c=new y(new G(.1,.07,.36),e);c.rotation.y=r,c.position.set(Math.sin(r)*1.3,.08,Math.cos(r)*1.3),t.add(c)}const o=new y(new G(.07,1.5,.07),e);return o.position.y=.75,t.add(o),t}function Ov(){const n=new ot;for(const i of[-.8,.8]){const s=new y(new G(.12,1.5,.12),A(S.woodDark));s.position.set(i,.75,0),n.add(s)}const t=new y(new G(2,1.2,.12),A(S.wood));t.position.y=2,n.add(t);const e=new y(new G(1.8,.22,.03),A(S.frisbee));e.position.set(0,2.45,.08),n.add(e);for(const i of[-.45,.45]){const s=new y(new G(.55,.6,.03),A(2830136));s.position.set(i,1.9,.08),n.add(s)}return n}function Bv(n=4){const t=new ot;t.userData.peca="arquibancada";const e=.5;for(let i=0;i<3;i++){const s=.25+i*.34,o=new y(new G(n,.16,e+.04),A(i%2===0?S.metalWhite:S.metalGrey));o.position.set(0,s,-i*e),t.add(o);const a=new y(new G(n-.08,s,.1),A(S.metalGrey));a.position.set(0,s/2,-i*e-.19),t.add(a)}return t}function kv(){const n=new ot,t=new y(new G(.42,.95,.36),A(S.concrete));t.position.y=.48,n.add(t);const e=new y(new nt(.17,.14,.12,12),A(S.metalWhite));e.position.set(0,1,.05),n.add(e);const i=new y(new nt(.03,.03,.16,8),A(S.metalGrey));return i.position.set(0,1.12,-.06),i.rotation.x=.5,n.add(i),n}function Vv(){const n=new ot,t=new y(new G(.5,.4,.34),A(4871528));t.position.y=.2,n.add(t);const e=new y(new _e(.16,.028,6,14,Math.PI),A(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,n.add(e),[S.frisbee,6271190,16767070].forEach((s,o)=>{const a=new y(new nt(.2,.18,.05,16),A(s));a.position.set(.34+o*.02,.06+o*.06,.22),a.rotation.z=.12,n.add(a)}),n}function Hv(){const n=new ot,t=new y(new nt(.1,.14,5.5,8),A(S.metalGrey));t.position.y=2.75,n.add(t);const e=new y(new G(.9,.1,.1),A(S.metalGrey));e.position.set(.35,5.5,0),n.add(e);for(const i of[.1,.6]){const s=new y(new G(.42,.3,.22),A(3883600));s.position.set(i,5.62,0),s.rotation.z=-.35,n.add(s);const o=new y(new G(.36,.24,.03),A(16773324,{glow:.25}));o.position.set(i+.04,5.52,0),o.rotation.z=-.35,n.add(o)}return n}function Gv(){const n=new ot,t=new y(new nt(.05,.06,3,8),A(S.metalGrey));t.position.y=1.5,n.add(t);const e=new ot;return e.position.y=2.9,[S.frisbee,16777215,S.frisbee,16777215].forEach((s,o)=>{const a=.26-o*.04,r=.22-o*.04,c=new y(new nt(a,r,.3,12,1,!0),A(s,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+o*.3,e.add(c)}),n.add(e),n.userData.manga=e,n}function Mc(n,t,e,i="#ffffff"){const s=document.createElement("canvas");s.width=384,s.height=Math.max(64,Math.round(384*e/t));const o=s.getContext("2d");o&&(o.clearRect(0,0,s.width,s.height),o.fillStyle=i,o.font=`bold ${Math.round(s.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(n,s.width/2,s.height/2+4));const a=new jd(s);return a.colorSpace=nn,new y(new Ue(t,e),new jo({map:a,transparent:!0}))}function kl(n,t=S.fabricBlue,e="#ffffff"){const i=new ot,s=new y(new nt(.08,.08,2.4,8),A(S.metalGrey));s.position.y=1.2,i.add(s);const o=2.1,a=.9,r=new y(new G(o,a,.1),A(t));r.position.y=2.45,i.add(r);const c=new y(new G(o+.12,a+.12,.06),A(S.metalWhite));c.position.set(0,2.45,-.03),i.add(c);const l=Mc(n,o*.86,a*.68,e);return l.position.set(0,2.45,.06),i.add(l),i}function su(n=4161494){const t=new ot,e=8.4,i=2.6,s=2.5,o=new y(new G(e,i,s),A(n));o.position.y=1.55,t.add(o);const a=new y(new G(e-.2,.22,s-.15),A(S.metalWhite));a.position.y=2.9,t.add(a);const r=new y(new G(e+.04,.3,s+.04),A(S.metalWhite));r.position.y=.6,t.add(r);for(const h of[s/2+.02,-s/2-.02])for(let u=0;u<4;u++){const d=new y(new G(1.5,.9,.05),A(S.glass,{glow:.12}));d.position.set(-e/2+1.4+u*1.85,2.1,h),t.add(d)}for(const[h,u]of[[e/2+.02,0],[-e/2-.02,0]]){const d=new y(new G(.05,1.1,s-.5),A(S.glass,{glow:.12}));d.position.set(h,2.1,0),d.rotation.y=u,t.add(d)}const c=new y(new G(.06,1.9,1),A(2831424));c.position.set(e/2-1.6,1.2,s/2+.02),t.add(c);const l=new y(new G(1.6,.34,.05),A(2040361));l.position.set(e/2-.4,2.75,s/2+.02),t.add(l);for(const[h,u]of[[e/2-1.9,s/2],[e/2-1.9,-s/2],[-e/2+1.6,s/2],[-e/2+1.6,-s/2]]){const d=new y(new nt(.55,.55,.35,14),A(2237482));d.position.set(h,.5,u),d.rotation.x=Math.PI/2,t.add(d);const p=new y(new nt(.24,.24,.38,12),A(S.metalGrey));p.position.set(h,.5,u),p.rotation.x=Math.PI/2,t.add(p)}return t}function qv(n=S.metalGrey){const t=new ot;for(const o of[-1.5,1.5]){const a=new y(new nt(.07,.07,2.5,8),A(n));a.position.set(o,1.25,-.6),t.add(a)}const e=new y(new G(3.6,.12,1.6),A(n));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const i=new y(new G(3.6,1.6,.08),A(S.glass,{glow:.08}));i.position.set(0,1.35,-1.15),t.add(i);const s=new y(new G(3,.1,.4),A(S.wood));s.position.set(0,.5,-.9),t.add(s);for(const o of[-1.2,1.2]){const a=new y(new G(.08,.5,.36),A(n));a.position.set(o,.25,-.9),t.add(a)}return t}function Wv(n){const t=new ot,e=n.headR,i=e*1.07,s=Math.PI*.54,o=e*.06,a=new y(new Rt(i,18,12,0,Math.PI*2,0,s),A(S.roupaLa));a.position.y=o,a.scale.y=1.16,t.add(a);const r=o+i*Math.cos(s)*1.16,c=i*Math.sin(s),l=new y(new nt(c*1.03,c*1.03,e*.26,18),A(S.roupaLaBarra));l.position.y=r,t.add(l);const h=new y(new Rt(e*.2,10,8),A(S.roupaLaBarra));return h.position.y=o+i*1.16,t.add(h),t}function Xv(n){const t=new ot,e=new y(new nt(n.h*.05*n.w,n.h*.055*n.w,n.h*.08,12),A(S.roupaBotaCano));e.position.y=-n.legH+n.h*.075,t.add(e);const i=new y(new nt(n.h*.058*n.w,n.h*.058*n.w,n.h*.018,12),A(S.roupaBota));return i.position.y=-n.legH+n.h*.113,t.add(i),t}function qn(n,t,e=t){const i=new ot;for(const o of[-1,1]){const a=new y(new Rt(n*.86,9,7),A(t));a.position.x=o*n*.86,a.scale.set(1.05,.72,.42),i.add(a);const r=new y(new G(n*.34,n*1.5,n*.14),A(t));r.position.set(o*n*.42,-n*.95,0),r.rotation.z=o*.32,i.add(r)}const s=new y(new Rt(n*.3,8,6),A(e));return s.scale.z=.7,i.add(s),i}function si(n,t,e,i=.85){const s=new ot,o=A(e),a=t*.6,r=Math.max(8,Math.ceil(2*Math.PI*n/(a*1.25)));for(let c=0;c<r;c++){const l=c/r*Math.PI*2,h=new y(new Rt(a,7,6),o);h.position.set(Math.sin(l)*n,0,Math.cos(l)*n*i),h.scale.set(1,.88,.34),h.rotation.y=l,s.add(h)}return s}function Vl(n,t,e,i=3){const s=new ot,o=A(e),a=t/i,r=Math.hypot(n,a);for(let c=0;c<i;c++)for(const l of[-1,1]){const h=new y(new G(r,t*.07,t*.05),o);h.position.y=-t/2+a*(c+.5),h.rotation.z=l*Math.atan2(a,n),s.add(h)}return s}function ou(n,t){const e=new y(new Rt(n,12,10),A(t));return e.scale.set(1,.82,.92),e}function jv(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=.85,r=A(S.vestidoRosa),c=A(S.vestidoRenda,{doubleSide:!0}),l=A(S.vestidoFita),h=new y(new nt(o*1.1,o*1.06,e*.035,18,1,!0),c);h.position.y=s+n.torsoH*.78,h.scale.z=a,t.add(h);for(const x of[-1,1]){const C=new y(new _e(e*.042*i,e*.016,6,14),c);C.position.set(x*e*.1*i,s+n.torsoH*.84,0),C.rotation.set(Math.PI/2,0,x*.3),C.scale.z=.8,t.add(C)}const u=qn(e*.04,S.vestidoFita,S.vestidoRenda);u.position.set(0,s+n.torsoH*.62,o*.9),t.add(u);const d=new y(new nt(o*1.08,o*1.08,e*.03,18,1,!0),l);d.position.y=s+n.torsoH*.16,d.scale.z=a,t.add(d);const p=qn(e*.036,S.vestidoRosa,S.vestidoFita);p.position.set(0,s+n.torsoH*.14,o*.92),t.add(p);const g=s+n.torsoH*.1,v=s-e*.13,m=o*2,f=new y(new nt(o*1.02,m*.82,g-v-e*.05,20,1,!0),r);f.position.y=(g+v+e*.05)/2,f.scale.z=a,t.add(f);const w=new y(new nt(m*.78,m,e*.08,20,1,!0),r);w.position.y=v+e*.04,w.scale.z=a,t.add(w);const M=new y(new nt(m*1.04,m*1.12,e*.032,20,1,!0),c);M.position.y=v,M.scale.z=a,t.add(M);for(const x of[-.9,0,.9]){const C=qn(e*.022,S.vestidoFita,S.vestidoRenda);C.position.set(Math.sin(x)*m*.92,v+e*.055,Math.cos(x)*m*.92*a),C.rotation.y=x,t.add(C)}return t}function Yv(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=e*.1*i,c=.85,l=A(S.maidCreme),h=A(S.maidCreme,{doubleSide:!0}),u=A(S.maidFita),d=s+n.torsoH*.12,p=s-e*.14,g=o*2,v=new y(new nt(o*1.04,g,d-p,20,1,!0),A(S.maidPreto,{doubleSide:!0}));v.position.y=(d+p)/2,v.scale.z=c,t.add(v);const m=new y(new nt(g*1.01,g*1.06,e*.038,20,1,!0),h);m.position.y=p+e*.016,m.scale.z=c,t.add(m);const f=si(g*1.04,e*.03,S.maidCreme,c);f.position.y=p-e*.008,t.add(f);const w=s+n.torsoH*.16,M=s-e*.045,x=new y(new nt(o*1.06,g*.86,w-M,16,1,!0,-1.15,2.3),h);x.position.y=(w+M)/2,x.scale.z=c,t.add(x);const C=si(g*.88,e*.034,S.maidCreme,c);C.position.y=M,t.add(C);const P=s+n.torsoH*.2,I=new y(new nt(o*1.1,o*1.1,e*.055,18,1,!0),h);I.position.y=P,I.scale.z=c,t.add(I);for(const B of[-1,1]){const V=Vl(e*.03,e*.045,S.maidFita,3);V.position.set(B*o*.5,P,o*.92),t.add(V);const H=qn(e*.017,S.maidFita);H.position.set(B*o*.5,P-e*.028,o*.96),t.add(H)}for(const B of[-1,1]){const V=new y(new G(e*.055*i,a-P,e*.02),l);V.position.set(B*o*.62,(a+P)/2,o*.7),V.rotation.y=-B*.5,t.add(V);const H=new y(new G(e*.022*i,a-P,e*.03),h);H.position.set(B*o*.98,(a+P)/2,o*.4),H.rotation.y=-B*.95,t.add(H)}const T=new y(new G(o*.9,n.torsoH*.24,e*.014),l);T.position.set(0,s+n.torsoH*.4,o*.8),t.add(T);const b=Vl(o*.55,n.torsoH*.2,S.maidFita,4);b.position.set(0,s+n.torsoH*.4,o*.87),t.add(b);const _=s+n.torsoH*.68;for(const B of[-1,1]){const V=new y(new G(e*.1*i,n.torsoH*.46,e*.012),l);V.position.set(B*e*.06*i,_,o*.82),V.rotation.z=B*.34,t.add(V);const H=new y(new G(e*.007,n.torsoH*.4,e*.006),u);H.position.set(B*e*.088*i,_+n.torsoH*.02,o*.88),H.rotation.z=B*.34,t.add(H);const J=new y(new G(e*.075*i,e*.012,o*1.5),l);J.position.set(B*r*.86,a+e*.012,0),J.rotation.z=B*.16,t.add(J)}const D=new y(new G(e*.24*i,n.torsoH*.36,e*.014),l);D.position.set(0,s+n.torsoH*.74,-o*.8),t.add(D);const z=new y(new G(e*.24*i,e*.011,e*.006),u);z.position.set(0,s+n.torsoH*.57,-o*.87),t.add(z);for(const B of[-1,1]){const V=ou(e*.055*i,S.maidCreme);V.position.set(B*r,a-e*.012,0),t.add(V)}return t}function Zv(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=e*.1*i,c=.85,l=A(S.maidCreme),h=A(S.maidCreme,{doubleSide:!0}),u=A(S.maidFita),d=s+n.torsoH*.12,p=s-e*.14,g=o*2,v=new y(new nt(o*1.04,g,d-p,20,1,!0),A(S.maidPreto,{doubleSide:!0}));v.position.y=(d+p)/2,v.scale.z=c,t.add(v);const m=si(g*1.02,e*.036,S.maidPreto,c);m.position.y=p+e*.004,t.add(m);const f=s+n.torsoH*.26,w=s-e*.055,M=new y(new nt(o*1.04,g*.9,f-w,16,1,!0,-1.2,2.4),h);M.position.y=(f+w)/2,M.scale.z=c,t.add(M);const x=si(g*.92,e*.036,S.maidCreme,c);x.position.y=w,t.add(x);const C=new ot,P=new y(new Rt(e*.011,8,6),u);P.scale.set(1,1.15,.3),C.add(P);for(let $=0;$<3;$++){const at=new y(new Rt(e*.005,6,5),u);at.position.set(($-1)*e*.012,e*.016,0),at.scale.z=.3,C.add(at)}C.position.set(g*.42,s-e*.005,g*.72*c),C.rotation.y=.5,t.add(C);const I=n.torsoH*.3,T=f+I*.5,b=o*1.62,_=o*.84,D=new y(new G(b,I,e*.014),l);D.position.set(0,T,_),t.add(D);for(const $ of[-1,1]){const at=new y(new Ne(e*.028,e*.045,4),l);at.position.set($*b*.32,T+I*.5+e*.019,_),at.rotation.set(0,Math.PI/4,$*.26),at.scale.set(1,1,.3),t.add(at)}for(const $ of[-1,1]){const at=new y(new _e(e*.014,e*.004,5,10,Math.PI),u);at.position.set($*b*.26,T+I*.08,_+e*.009),at.rotation.z=Math.PI,t.add(at)}const z=new y(new _e(e*.009,e*.003,5,10,Math.PI),u);z.position.set(0,T-I*.12,_+e*.009),z.rotation.z=Math.PI,t.add(z);for(const $ of[-1,1])for(let at=0;at<3;at++){const Z=new y(new G(e*.036,e*.0035,e*.0035),u);Z.position.set($*b*.4,T-I*.05+(at-1)*e*.012,_+e*.008),Z.rotation.z=$*(at-1)*.24,t.add(Z)}const B=qn(e*.032,S.maidCreme);B.position.set(-o*1.25,s+n.torsoH*.16,o*.5),B.rotation.y=-.55,t.add(B);const V=new y(new nt(o*.6,o*1.3,e*.018,20,1,!0),h);V.position.y=a+e*.008,V.scale.z=c,t.add(V);const H=si(o*1.3,e*.02,S.maidCreme,c);H.position.y=a-e*.006,t.add(H);const J=qn(e*.05,S.maidLacoVermelho);J.position.set(0,s+n.torsoH*.78,o*1.12),t.add(J);const st=new y(new Rt(e*.016,10,8),A(S.gold,{glow:.2}));st.position.set(0,s+n.torsoH*.71,o*1.16),t.add(st);for(const $ of[-1,1]){const at=ou(e*.056*i,S.maidPreto);at.position.set($*r,a-e*.012,0),t.add(at);const Z=si(e*.05*i,e*.024,S.maidCreme,1);Z.position.set($*r,a-e*.058,0),t.add(Z)}return t}function Jv(n,t){const e=new ot,i=A(t);for(const o of[-1,1]){const a=new y(new Rt(n*.56,8,6),i);a.position.set(o*n*.44,n*.34,0),a.scale.z=.34,e.add(a)}const s=new y(new Ne(n*.78,n*1.2,10),i);return s.position.y=-n*.34,s.rotation.x=Math.PI,s.scale.z=.34,e.add(s),e}function $v(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=.85,c=A(S.waRosa),l=A(S.waRosa,{doubleSide:!0}),h=A(S.waRosaForte),u=A(S.waEscuro),d=A(S.waEscuro,{doubleSide:!0}),p=A(S.waBranco,{doubleSide:!0}),g=s+n.torsoH*.1,v=s-e*.135,m=o*2,f=new y(new nt(o*1.02,m,g-v,22,1,!0),d);f.position.y=(g+v)/2,f.scale.z=r,t.add(f);const w=16,M=o*1.02,x=g-v,C=-Math.atan2(m-M,x);for(let at=0;at<w;at++){const Z=new ot;Z.rotation.y=at/w*Math.PI*2;const yt=new y(new G(e*.011,x*.94,e*.009),u);yt.position.set(0,(g+v)/2,(M+m)/2),yt.rotation.x=C,Z.add(yt),Z.scale.z=r,t.add(Z)}const P=13;for(let at=0;at<P;at++){const Z=at/P*Math.PI*2,yt=Jv(e*.034,S.waEscuro);yt.position.set(Math.sin(Z)*m*1.03,v-e*.016,Math.cos(Z)*m*1.03*r),yt.rotation.y=Z,t.add(yt)}const I=s+n.torsoH*.16,T=s-e*.095,b=new y(new nt(o*1.02,m*.9,I-T,16,1,!0,-1.25,2.5),p);b.position.y=(I+T)/2,b.scale.z=r,t.add(b);const _=si(m*.92,e*.03,S.waBranco,r);_.position.y=T,t.add(_);const D=s+n.torsoH*.14,z=s+n.torsoH*.5,B=new y(new nt(o*1.07,o*1.1,z-D,18,1,!0),d);B.position.y=(z+D)/2,B.scale.z=r,t.add(B);const V=new y(new G(o*.62,n.torsoH*.26,e*.012),u);V.position.set(0,s+n.torsoH*.6,o*.82),t.add(V);const H=new y(new _e(e*.019,e*.005,6,12),A(S.waFivela));H.position.set(0,s+n.torsoH*.56,o*.89),H.scale.set(1.25,1,1),t.add(H);for(const at of[-1,1]){const Z=new y(new G(o*1.15,n.torsoH*.42,e*.013),c);Z.position.set(at*o*.24,s+n.torsoH*.68,o*.76),Z.rotation.z=at*.52,t.add(Z)}const J=new y(new nt(o*.78,o*.92,n.torsoH*.2,16,1,!0),l);J.position.y=a-n.torsoH*.02,J.scale.z=r,t.add(J);const st=qn(e*.05,S.waRosaForte);st.position.set(0,D+e*.014,o*1.12),t.add(st);for(const at of[-1,1]){const Z=new y(new G(e*.026,e*.2,e*.008),h);Z.position.set(at*e*.022,D-e*.09,m*.78),Z.rotation.z=at*.1,t.add(Z);const yt=new y(new Ne(e*.018,e*.03,4),h);yt.position.set(at*e*.024,D-e*.2,m*.8),yt.rotation.set(Math.PI,Math.PI/4,0),yt.scale.z=.3,t.add(yt)}const $=new y(new nt(e*.043,e*.045,e*.022,14,1,!0),d);return $.position.y=a+n.torsoH*.12,t.add($),t}function Kv(n,t){const e=new ot,{h:i,w:s}=n,o=i*.3,a=t*i*.052*s,r=i*.068*s,c=1.2,l=new y(new nt(i*.045*s,r,o*.94,14,1,!0),A(S.waEscuro,{doubleSide:!0}));l.position.set(a*.45,-o*.44,0),l.scale.z=.78,e.add(l);const h=new y(new nt(r,r*.86,o*.38,14,1,!0),A(S.waEscuro,{doubleSide:!0}));h.position.set(a,-o*(c-.19),0),h.scale.z=.78,e.add(h);const u=si(r*.9,i*.024,S.waBranco,.78);return u.position.set(a,-o*c,0),e.add(u),e}function Qv(n){const t=new ot,{h:e,w:i}=n,s=-n.legH*.28,o=new y(new nt(e*.047*i,e*.047*i,e*.022,14,1,!0),A(S.waBranco,{doubleSide:!0}));o.position.y=s,t.add(o);const a=new y(new nt(e*.049*i,e*.049*i,e*.014,14,1,!0),A(S.waRosaForte,{doubleSide:!0}));a.position.y=s+e*.026,t.add(a);const r=qn(e*.013,S.waRosaForte);return r.position.set(0,s+e*.026,e*.05*i),t.add(r),t}function t1(n){const t=new ot,{h:e,w:i}=n,s=n.legH,o=e*.105*i,a=s+n.torsoH*.86,r=s+n.torsoH,c=.95,l=A(S.moletomPreto),h=A(S.moletomPreto,{doubleSide:!0}),u=A(S.moletomCostura),d=A(S.moletomZiper),p=A(S.moletomForro,{doubleSide:!0}),g=o*1.1,v=o*1.04,m=s+e*.012,f=a+n.torsoH*.03,w=g*c,M=new y(new nt(g,v,f-m,22),l);M.position.y=(f+m)/2,M.scale.z=c,t.add(M);const x=new y(new Rt(g,22,10,0,Math.PI*2,0,Math.PI/2),l);x.position.y=f,x.scale.set(1,.42,c),t.add(x);const C=new y(new nt(v*1.03,v*1.01,e*.022,22,1,!0),h);C.position.y=m+e*.011,C.scale.z=c,t.add(C);const P=r+e*.015,I=new y(new nt(o*1.75,o*1.15,e*.07,20,1,!0),h);I.position.y=P,I.scale.z=.95,t.add(I);const T=new y(new nt(o*1.62,o*1.05,e*.066,20,1,!0),p);T.position.y=P-e*.003,T.scale.z=.95,t.add(T);const b=new y(new Rt(o*1.15,16,12,0,Math.PI*2,0,Math.PI*.6),h);b.position.set(0,a+n.torsoH*.14,-o*.72),b.rotation.x=-1.25,b.scale.set(1.4,.95,.62),t.add(b);const _=P+e*.005,D=m+e*.014,z=new y(new G(e*.014,_-D,e*.018),d);z.position.set(0,(_+D)/2,w*.99),t.add(z);const B=new y(new G(e*.02,e*.026,e*.012),u);B.position.set(0,s+n.torsoH*.5,w*1.03),t.add(B);const V=new y(new nt(g*1.012,g*1.012,e*.007,22,1,!0),A(S.moletomCostura,{doubleSide:!0}));V.position.y=s+n.torsoH*.68,V.scale.z=c,t.add(V);for(const H of[-1,1]){const J=new ot;J.rotation.y=H*.62,J.scale.z=c;const st=new y(new G(e*.013,e*.062,e*.012),u);st.position.set(0,s+n.torsoH*.2,g*1),st.rotation.z=H*.36,J.add(st),t.add(J)}for(const H of[-1,1]){const J=new y(new nt(e*.006,e*.006,e*.016,8),A(S.moletomPonteira));J.position.set(H*e*.022,m+e*.006,v*c*.99),t.add(J)}return t}function e1(n){const t=new ot,{h:e,w:i}=n,s=e*.3,o=.82,a=new y(new Rt(e*.058*i,12,10),A(S.moletomPreto));a.position.y=-s*.03,a.scale.set(1,.92,.95),t.add(a);const r=new y(new nt(e*.056*i,e*.046*i,s*o,14,1,!0),A(S.moletomPreto,{doubleSide:!0}));r.position.y=-s*o*.5,t.add(r);const c=new y(new nt(e*.047*i,e*.045*i,e*.022,14),A(S.moletomCostura));return c.position.y=-s*o,t.add(c),t}function n1(n){const t=new ot,i=-n.headR*.98,s=new y(new nt(n.h*.043,n.h*.045,n.h*.026,14,1,!0),A(S.vestidoRenda,{doubleSide:!0}));s.position.y=i,t.add(s);const o=qn(n.h*.026,S.vestidoFita,S.vestidoRenda);return o.position.set(0,i,n.h*.044),t.add(o),t}function i1(n){const t=new ot,e=n.headR,i=A(S.oculosLente),s=A(S.oculosArmacao),o=e*.04,a=e*.26,r=e*1.07;for(const l of[-1,1]){const h=new y(new nt(a,a,e*.07,20),i);h.rotation.x=Math.PI/2,h.position.set(l*e*.38,o,r),t.add(h);const u=new y(new _e(a,e*.03,8,20),s);u.position.set(l*e*.38,o,r+e*.005),t.add(u);const d=e*.6,p=r-e*.06,g=e*.78,v=e*.4,m=g-d,f=v-p,w=new y(new G(e*.05,e*.07,Math.hypot(m,f)),s);w.position.set(l*(d+g)/2,o+e*.07,(p+v)/2),w.rotation.y=l*Math.atan2(m,f),t.add(w)}const c=new y(new nt(e*.025,e*.025,e*.34,8),s);return c.rotation.z=Math.PI/2,c.position.set(0,o+e*.07,r+e*.02),t.add(c),t}const Jt={sorveteMorango:{id:"sorvete-morango",nome:"Sorvete de morango",icone:"🍦",tipo:"mao",nota:"do Ari",holdPose:"upright"},sorveteMaracuja:{id:"sorvete-maracuja",nome:"Sorvete de maracujá",icone:"🍦",tipo:"mao",nota:"do Renan",holdPose:"upright"},sucoPessego:{id:"suco-pessego",nome:"Suco de pêssego",icone:"🥤",tipo:"mao",nota:"do Ari",holdPose:"upright"},sucoMorango:{id:"suco-morango",nome:"Suco de morango",icone:"🥤",tipo:"mao",nota:"do Renan",holdPose:"upright"},chapeuPingPong:{id:"chapeu-ping-pong",nome:"Chapéu de campeão",icone:"👑",tipo:"vestivel",slot:"cabeca",nota:"ping pong, 5 a 0"},patins:{id:"patins",nome:"Patins",icone:"🛼",tipo:"vestivel",slot:"pes",funcional:!0,nota:"da lojinha do parque · +velocidade"},gorroDeLa:{id:"gorro-la",nome:"Gorro de lã",icone:"🧢",tipo:"vestivel",slot:"cabeca",cor:S.roupaLa,corDetalhe:S.roupaLaBarra,nota:"para o frio que nunca faz",cobreCabelo:!0,extra:Wv},camisaListrada:{id:"camisa-listrada",nome:"Camisa listrada",icone:"👕",tipo:"vestivel",slot:"tronco",cor:S.roupaListra,corDetalhe:S.roupaListraManga,nota:"mangas claras"},calcaJeans:{id:"calca-jeans",nome:"Calça jeans",icone:"👖",tipo:"vestivel",slot:"pernas",cor:S.roupaJeans,nota:"a de sempre"},vestidoRosa:{id:"vestido-rosa",nome:"Vestido rosa de babados",icone:"👗",tipo:"vestivel",slot:"tronco",cor:S.vestidoRosa,corDetalhe:S.vestidoRenda,nota:"da vitrine que o Renan viu",bracosNus:!0,pernasNuas:!0,extra:jv},maidMarinheiro:{id:"maid-marinheiro",nome:"Maid marinheiro",icone:"🖤",tipo:"vestivel",slot:"tronco",cor:S.maidPreto,corDetalhe:S.maidCreme,nota:"gola de marinheiro e cadarço",pernasNuas:!0,extra:Yv},maidGatinho:{id:"maid-gatinho",nome:"Maid gatinho",icone:"🐱",tipo:"vestivel",slot:"tronco",cor:S.maidPreto,corDetalhe:S.maidPreto,nota:"com guizo e cara de gato",pernasNuas:!0,extra:Zv},maidJapones:{id:"maid-japones",nome:"Maid japonês",icone:"🌸",tipo:"vestivel",slot:"tronco",cor:S.waRosa,corDetalhe:S.waRosa,nota:"manga de quimono e festão de corações",pernasNuas:!0,extra:$v,extraBraco:Kv},moletomPreto:{id:"moletom-preto",nome:"Moletom preto",icone:"🧥",tipo:"vestivel",slot:"tronco",cor:S.moletomPreto,corDetalhe:S.moletomPreto,nota:"com capuz e zíper, o da foto no espelho",extra:t1,extraBraco:e1},meiaDeCoxa:{id:"meia-de-coxa",nome:"Meia de coxa",icone:"🧦",tipo:"vestivel",slot:"pernas",cor:S.waBranco,nota:"com a liga rosa",extra:Qv},gargantilhaDeLaco:{id:"gargantilha-laco",nome:"Gargantilha de laço",icone:"🎀",tipo:"vestivel",slot:"cabeca",cor:S.vestidoFita,nota:"combina com o vestido",extra:n1},botaAmarela:{id:"bota-amarela",nome:"Bota amarela",icone:"🥾",tipo:"vestivel",slot:"pes",cor:S.roupaBota,corDetalhe:S.roupaBotaCano,nota:"chama atenção de longe",extra:Xv},oculosEscuros:{id:"oculos-escuros",nome:"Óculos escuros",icone:"🕶️",tipo:"vestivel",slot:"cabeca",nota:"do vestiário do clube",extra:i1},bermudaAzul:{id:"bermuda-azul",nome:"Bermuda azul",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:S.bermudaAzul,nota:"a cor da própria piscina"},bermudaVermelha:{id:"bermuda-vermelha",nome:"Bermuda vermelha",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:S.bermudaVermelha,nota:"dá pra achar de longe"},bermudaAmarela:{id:"bermuda-amarela",nome:"Bermuda amarela",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:S.bermudaAmarela,nota:"sol de tarde"},bermudaEstampada:{id:"bermuda-estampada",nome:"Bermuda estampada",icone:"🌺",tipo:"vestivel",slot:"pernas",corBanho:S.bermudaEstampa,estampaBanho:S.bermudaEstampaFaixa,nota:"duas faixas cor de areia"},frisbee:{id:"frisbee",nome:"Frisbee",icone:"🥏",tipo:"mao",nota:"do parque",holdPose:"relaxed"}},au=[Jt.bermudaAzul,Jt.bermudaVermelha,Jt.bermudaAmarela,Jt.bermudaEstampada],s1={"sorvete-morango":()=>Hr(S.morango),"sorvete-maracuja":()=>Hr(S.maracuja),"suco-pessego":()=>Ol(S.pessego),"suco-morango":()=>Ol(S.morango),frisbee:()=>nu(S.frisbee)},o1=Object.fromEntries(Object.values(Jt).map(n=>[n.id,n]));function Uo(n){return o1[n]??null}function a1(n){const t=s1[n]?.();return t?(t.userData.item=n,t):null}const kn=10,Bs=4;function ks(n){return n.tipo==="vestivel"&&n.funcional!==!0}function Zi(n,t){return t==="vestivel"?n.tipo==="vestivel":t==="acervo"?ks(n):!ks(n)}function No(n){return n.slot?fn.indexOf(n.slot):-1}function Go(n){return Array.from({length:n},()=>null)}function ru(){return{mao:Go(kn),ativo:0,vestiveis:Go(Bs),acervo:[]}}function r1(n,t){const e={},i=t&&typeof t=="object"?t:{},s=new Set([...Object.keys(n??{}),...Object.keys(i)]);for(const o of s)e[o]=c1((n??{})[o],i[o]);return e}function c1(n,t){const e=ru();if(!n&&!t)return e;const i=[],s=(d,p,g)=>{const v=Go(p);if(!Array.isArray(d))return v;for(let m=0;m<p;m++){const f=d[m];if(!f||typeof f.id!="string"){v[m]=null;continue}const w=Uo(f.id),M=w?{...f,...w}:f;if(Zi(M,g)){v[m]=M;continue}v[m]=null,g==="mao"&&ks(M)&&i.push(M)}return v},o=typeof n?.ativo=="number"?Math.floor(n.ativo):0,a=s(n?.vestiveis,Bs,"vestivel"),r=Go(Bs);for(const d of a){if(!d)continue;const p=No(d);p>=0&&r[p]===null&&(r[p]=d)}if(t&&typeof t=="object")for(const[d,p]of Object.entries(t)){if(typeof p!="string")continue;const g=Uo(p);if(!g||g.slot!==d)continue;const v=fn.indexOf(d);v>=0&&r[v]===null&&(r[v]=g)}const c=s(n?.mao,kn,"mao"),l=[],h=d=>l.some(p=>p.id===d)||r.some(p=>p?.id===d)||c.some(p=>p?.id===d),u=Array.isArray(n?.acervo)?n.acervo:[];for(const d of[...u,...i]){if(!d||typeof d.id!="string")continue;const p=Uo(d.id),g=p?{...d,...p}:d;!Zi(g,"acervo")||h(g.id)||l.push(g)}return{mao:c,ativo:o>=0&&o<kn?o:0,vestiveis:r,acervo:l}}const Hl="aristory.save.v1",za={version:1,scene:"",flags:{},memories:[],stats:{},inventarios:{}};class yc{data;constructor(){this.data=yc.read()}static read(){try{const t=localStorage.getItem(Hl);if(!t)return structuredClone(za);const e=JSON.parse(t),i=e.loadouts;return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{},inventarios:r1(e.inventarios,i)}}catch{return structuredClone(za)}}persist(){try{localStorage.setItem(Hl,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}de(t){let e=this.data.inventarios[t];return e||(e=ru(),this.data.inventarios[t]=e),e}maos(t){return this.de(t).mao}vestiveis(t){return this.de(t).vestiveis}acervo(t){return this.de(t).acervo}loadout(t){const e={};return this.de(t).vestiveis.forEach((i,s)=>{i&&(e[fn[s]]=i.id)}),e}slotAtivo(t){return this.de(t).ativo}setSlotAtivo(t,e){e<0||e>=kn||(this.de(t).ativo=e,this.persist())}itemAtivo(t){const e=this.de(t);return e.mao[e.ativo]??null}achouItem(t,e){const i=this.de(t);return i.mao.some(s=>s?.id===e)||i.vestiveis.some(s=>s?.id===e)||i.acervo.some(s=>s.id===e)}pegar(t,e){if(this.achouItem(t,e.id))return"repetido";if(e.tipo==="vestivel"&&this.vestir(t,e))return"guardado";if(ks(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let s=1;s<kn;s++){const o=(i.ativo+s)%kn;if(i.mao[o]===null)return i.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardar(t,e){if(this.achouItem(t,e.id))return"repetido";if(ks(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let s=1;s<kn;s++){const o=(i.ativo+s)%kn;if(i.mao[o]===null)return i.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardarNoAcervo(t,e){return Zi(e,"acervo")?this.achouItem(t,e.id)?"repetido":(this.de(t).acervo.push(e),this.persist(),"guardado"):"cheio"}tirarDoAcervo(t,e){const i=this.de(t).acervo,s=i.findIndex(a=>a.id===e);if(s<0)return null;const[o]=i.splice(s,1);return this.persist(),o}vestir(t,e){if(!Zi(e,"vestivel"))return!1;const i=No(e);if(i<0)return!1;const s=this.de(t).vestiveis;return s[i]!==null||this.achouItem(t,e.id)&&!this.tirarDoAcervo(t,e.id)?!1:(s[i]=e,this.persist(),!0)}despir(t,e){e<0||e>=Bs||(this.de(t).vestiveis[e]=null,this.persist())}mover(t,e,i){const s=this.de(t),o=u=>u.lista==="mao"?s.mao:s.vestiveis,a=u=>u.indice>=0&&u.indice<(u.lista==="mao"?kn:Bs);if(!a(e)||!a(i)||e.lista===i.lista&&e.indice===i.indice)return!1;const r=o(e),c=o(i),l=r[e.indice];if(!l||!Zi(l,i.lista)||i.lista==="vestivel"&&No(l)!==i.indice)return!1;const h=c[i.indice];return h&&!Zi(h,e.lista)||e.lista==="vestivel"&&h&&No(h)!==e.indice?!1:(c[i.indice]=l,r[e.indice]=h??null,this.persist(),!0)}largar(t,e){const i=this.de(t);let s=!1;for(const a of[i.mao,i.vestiveis]){const r=a.findIndex(c=>c?.id===e);r>=0&&(a[r]=null,s=!0)}const o=i.acervo.findIndex(a=>a.id===e);return o>=0&&(i.acervo.splice(o,1),s=!0),s&&this.persist(),s}reset(){this.data=structuredClone(za),this.persist()}}const Fa=["Cabeça","Tronco","Pernas","Pés"];class l1{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;menu;placar;mochila;armario;boneco;corpo;acervo;donoArmario;vestiario;oculos;bermudas;donoVestiario;slotsMao;slotsVestivel;dono;descarte;memorias;quadro;pontos;acervoDoQuadro=[];naMoldura=0;pintura=null;abriuEm=0;pegou=null;tipoNaPinca;funcionalNaPinca=!1;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchGirar=null;onTouchHold=null;onRestart=null;onToggleSom=null;som=null;hintsTimer=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
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
    `,t.appendChild(e);const i=document.createElement("div");i.className="boot",i.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(i),this.boot=i,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.menu=e.querySelector(".menu"),this.placar=e.querySelector(".placar"),this.mochila=e.querySelector(".mochila"),this.slotsMao=e.querySelector(".mochila .maos"),this.slotsVestivel=e.querySelector(".mochila .vestiveis"),this.dono=e.querySelector(".mochila .dono"),this.descarte=e.querySelector(".mochila .descarte"),this.armario=e.querySelector(".armario"),this.boneco=e.querySelector(".armario .boneco"),this.corpo=e.querySelector(".armario .corpo"),this.acervo=e.querySelector(".armario .acervo"),this.donoArmario=e.querySelector(".armario .dono"),this.vestiario=e.querySelector(".vestiario"),this.oculos=e.querySelector(".vestiario .oculos"),this.bermudas=e.querySelector(".vestiario .bermudas"),this.donoVestiario=e.querySelector(".vestiario .dono"),this.memorias=e.querySelector(".memorias"),this.quadro=e.querySelector(".memorias .quadro"),this.pontos=e.querySelector(".memorias .pontos"),this.dialogue.addEventListener("click",o=>{o.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",o=>{o.target===this.journal&&this.closeJournal()});const s=e.querySelector(".action-btn");s.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),s.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const o of["pointerup","pointercancel","pointerleave"])s.addEventListener(o,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".girar-btn.esq").addEventListener("click",()=>this.onTouchGirar?.(-1)),e.querySelector(".girar-btn.dir").addEventListener("click",()=>this.onTouchGirar?.(1)),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),e.querySelector(".bag-btn").addEventListener("click",()=>this.toggleMochila()),e.querySelector(".mochila .close").addEventListener("click",()=>this.closeMochila()),e.querySelector(".armario .close").addEventListener("click",()=>this.fecharArmario()),this.armario.addEventListener("click",o=>{o.target===this.armario&&this.fecharArmario()}),e.querySelector(".vestiario .close").addEventListener("click",()=>this.fecharVestiario()),this.vestiario.addEventListener("click",o=>{o.target===this.vestiario&&this.fecharVestiario()}),this.oculos.addEventListener("click",()=>this.onAlternarOculos?.()),this.bermudas.addEventListener("click",o=>{const a=o.target.closest(".bermuda");a?.dataset.id&&this.onEscolherBermuda?.(a.dataset.id)}),e.querySelector(".memorias .close").addEventListener("click",()=>this.fecharMemorias()),e.querySelector(".memorias .antes").addEventListener("click",()=>this.folhear(-1)),e.querySelector(".memorias .depois").addEventListener("click",()=>this.folhear(1)),this.memorias.addEventListener("click",o=>{o.target===this.memorias&&this.fecharMemorias()}),this.ligarGiroDoBoneco(),e.querySelector(".mochila .descartar").addEventListener("click",()=>{this.som?.("escolha"),this.descarte.classList.add("confirmando")}),e.querySelector(".mochila .descartar-sim").addEventListener("click",()=>{const o=this.pegou;this.pegou=null,this.tipoNaPinca=void 0,this.marcarPego(null),o&&this.onDescartar?.(o)}),this.mochila.addEventListener("click",o=>{o.target===this.mochila&&this.closeMochila()});for(const o of[this.slotsMao,this.slotsVestivel])o.addEventListener("click",a=>this.tocarVaga(a)),o.addEventListener("dragstart",a=>this.comecarArrasto(a)),o.addEventListener("dragover",a=>this.arrastarSobre(a)),o.addEventListener("dragleave",a=>{a.target.closest(".slot")?.classList.remove("alvo")}),o.addEventListener("drop",a=>this.soltarArrasto(a)),o.addEventListener("dragend",()=>this.limparArrasto());e.querySelector(".menu-btn").addEventListener("click",()=>this.toggleMenu()),e.querySelector(".menu .som-btn").addEventListener("click",()=>this.onToggleSom?.()),e.querySelector(".menu .controles-btn").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.add("vendo-controles")}),e.querySelector(".menu .controles .voltar").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.remove("vendo-controles")}),e.querySelector(".menu .close").addEventListener("click",()=>this.closeMenu()),e.querySelector(".menu .recomecar").addEventListener("click",()=>{this.menu.classList.add("perguntando")}),e.querySelector(".menu .nao").addEventListener("click",()=>{this.menu.classList.remove("perguntando")}),e.querySelector(".menu .sim").addEventListener("click",()=>{this.closeMenu(),this.onRestart?.()}),this.menu.addEventListener("click",o=>{o.target===this.menu&&this.closeMenu()}),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),this.showHints()}get menuOpen(){return this.menu.classList.contains("show")}toggleMenu(){this.som?.("menu"),this.menuOpen?this.closeMenu():(this.closeJournal(),this.closeMochila(),this.menu.classList.add("show")),this.marcarTelaAberta()}closeMenu(){this.menu.classList.remove("show"),this.menu.classList.remove("perguntando"),this.menu.classList.remove("vendo-controles"),this.marcarTelaAberta()}marcarTelaAberta(){document.body.classList.toggle("tela-aberta",this.menuOpen||this.journalOpen||this.mochilaOpen||this.armarioOpen||this.memoriasOpen||this.vestiarioOpen)}setSom(t){const e=this.menu.querySelector(".som-btn");e.textContent=t?"🔊 Som ligado":"🔇 Som desligado",e.classList.toggle("desligado",!t)}showHints(){this.hints.classList.remove("hide"),this.hintsTimer&&window.clearTimeout(this.hintsTimer),this.hintsTimer=window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){const i=this.prompt.querySelector(".label").textContent;this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,(!this.prompt.classList.contains("show")||i!==e)&&this.som?.("prompt"),this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showPlacar(t){if(!t){this.placar.classList.remove("show");return}this.placar.querySelector(".eu").textContent=t.eu,this.placar.querySelector(".ele").textContent=t.ele,this.placar.querySelector(".nums").textContent=`${t.meus} × ${t.dele}`,this.placar.classList.add("show")}showCharge(t,e,i=.06){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const s=this.carga.querySelector(".barra");s.style.width=`${Math.max(0,Math.min(1,t))*100}%`;const o=this.carga.querySelector(".alvo"),a=this.carga.querySelector(".zona"),r=e!=null&&e>.02&&e<.99;if(o.style.display=r?"block":"none",a.style.display=r?"block":"none",!r){this.carga.classList.remove("certa");return}const c=h=>`calc(3px + (100% - 6px) * ${Math.max(0,Math.min(1,h))})`;o.style.left=c(e),a.style.left=c(e-i),a.style.right=`calc(3px + (100% - 6px) * ${1-Math.max(0,Math.min(1,e+i))})`;const l=Math.abs(t-e)<=i;this.carga.classList.toggle("certa",l)}toast(t,e="💛"){const i=document.createElement("div");i.className="toast",i.innerHTML=`<span>${e}</span><span></span>`,i.querySelector("span:last-child").textContent=t,this.toasts.appendChild(i),window.setTimeout(()=>i.classList.add("fade"),2600),window.setTimeout(()=>i.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(i=>{let s=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const o=()=>{this.type(t[s])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[s];return}if(s+=1,s>=t.length){this.dialogue.classList.remove("show"),this.advance=null,i();return}o()},o()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,e%3===1&&t[e-1]!==" "&&this.som?.("fala"),this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,i=""){return new Promise(s=>{this.dialogueWho.textContent=i,this.dialogueWho.style.display=i?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=o=>{this.som?.("confirma"),this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),s(o)},e.forEach((o,a)=>{const r=document.createElement("button");r.type="button",r.textContent=o,r.addEventListener("click",()=>this.escolher?.(a)),this.escolhas.appendChild(r)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,i)=>e.classList.toggle("sel",i===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.som?.("escolha"),this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.som?.("escolha"),this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const i=document.createElement("div");i.className="memory",i.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',i.querySelector(".icon").textContent=e.icon,i.querySelector("b").textContent=e.title,i.querySelector("small").textContent=e.place,i.querySelector("p").textContent=e.note,this.journalGrid.appendChild(i)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.som?.("diario"),this.journalOpen?this.closeJournal():(this.closeMochila(),this.journal.classList.add("show")),this.marcarTelaAberta()}closeJournal(){this.journal.classList.remove("show"),this.marcarTelaAberta()}get memoriasOpen(){return this.memorias.classList.contains("show")}abrirMemorias(t,e=0){this.memoriasOpen||t.length===0||(this.som?.("diario"),this.closeJournal(),this.closeMochila(),this.acervoDoQuadro=t,this.naMoldura=Math.min(Math.max(e,0),t.length-1),this.mostrarMemoria(),this.memorias.classList.add("show"),this.marcarTelaAberta(),this.abriuEm=performance.now(),this.pintura=requestAnimationFrame(this.pintarQuadro))}fecharMemorias(){this.memoriasOpen&&(this.memorias.classList.remove("show"),this.acervoDoQuadro=[],this.pintura!==null&&cancelAnimationFrame(this.pintura),this.pintura=null,this.marcarTelaAberta())}folhear(t){if(!this.memoriasOpen||this.acervoDoQuadro.length<2)return;const e=this.acervoDoQuadro.length;this.naMoldura=(this.naMoldura+t+e)%e,this.som?.("escolha"),this.mostrarMemoria(),this.abriuEm=performance.now()}mostrarMemoria(){const t=this.acervoDoQuadro[this.naMoldura];if(!t)return;this.memorias.querySelector("h2").textContent=t.titulo,this.memorias.querySelector(".sub").textContent=t.lugar,this.memorias.querySelector(".legenda").textContent=t.legenda,this.quadro.style.aspectRatio=String(t.proporcao);const e=this.acervoDoQuadro.length>1;this.memorias.classList.toggle("tem-mais",e),this.pontos.innerHTML="",e&&this.acervoDoQuadro.forEach((i,s)=>{const o=document.createElement("button");o.className="ponto",o.classList.toggle("agora",s===this.naMoldura),o.title=i.titulo,o.setAttribute("aria-label",i.titulo),o.addEventListener("click",()=>this.folhear(s-this.naMoldura)),this.pontos.appendChild(o)})}pintarQuadro=t=>{const e=this.acervoDoQuadro[this.naMoldura];if(!e||!this.memoriasOpen){this.pintura=null;return}const i=Math.min(window.devicePixelRatio||1,2),s=Math.round(this.quadro.clientWidth*i),o=Math.round(this.quadro.clientHeight*i);if(s>0&&o>0){(this.quadro.width!==s||this.quadro.height!==o)&&(this.quadro.width=s,this.quadro.height=o);const a=this.quadro.getContext("2d");a&&e.pintar(a,s,o,(t-this.abriuEm)/1e3)}this.pintura=requestAnimationFrame(this.pintarQuadro)};get mochilaOpen(){return this.mochila.classList.contains("show")}toggleMochila(){this.som?.("diario"),this.mochilaOpen?this.closeMochila():(this.closeJournal(),this.onAbrirMochila?.(),this.mochila.classList.add("show")),this.marcarTelaAberta()}closeMochila(){this.mochila.classList.remove("show"),this.marcarTelaAberta()}renderMochila(t,e,i,s){this.dono.textContent=`de ${s}`,this.pegou=null,this.tipoNaPinca=void 0,this.funcionalNaPinca=!1,this.mochila.classList.remove("movendo"),this.descarte.classList.remove("show","confirmando");const o=(a,r,c,l=!1)=>{a.innerHTML="",r.forEach((h,u)=>{const d=document.createElement("button");d.className="slot",d.dataset.slot=String(u),d.classList.toggle("cheio",h!==null),d.classList.toggle("principal",u===c);const p=h!==null&&h.tipo==="vestivel"&&h.funcional!==!0;d.draggable=h!==null&&!p,d.classList.toggle("preso",p),h?(d.dataset.tipo=h.tipo,h.funcional?d.dataset.funcional="sim":delete d.dataset.funcional):(delete d.dataset.tipo,delete d.dataset.funcional);const g=l?`<em class="parte">${Fa[u]}</em>`:"";d.innerHTML=g+(h?`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""):'<span class="icone vazio">·</span><b>vazio</b>'),a.appendChild(d)})};o(this.slotsMao,t,i),o(this.slotsVestivel,e,-1,!0)}get armarioOpen(){return this.armario.classList.contains("show")}abrirArmario(){this.armarioOpen||(this.som?.("escolha"),this.onAbrirArmario?.(),this.armario.classList.add("show"),this.marcarTelaAberta())}fecharArmario(){this.armarioOpen&&(this.armario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharArmario?.())}canvasDoBoneco(){return this.boneco}renderArmario(t,e,i){if(this.donoArmario.textContent=`de ${i}`,this.corpo.innerHTML="",t.forEach((s,o)=>{const a=document.createElement("button");a.className="parte",a.classList.toggle("cheio",s!==null),a.dataset.parte=String(o),a.innerHTML=`<small>${Fa[o]}</small>`+(s?`<span class="icone">${s.icone}</span><b>${s.nome}</b><em>tirar</em>`:'<span class="icone vazio">·</span><b>vazio</b>'),this.corpo.appendChild(a)}),this.acervo.innerHTML="",e.length===0){const s=document.createElement("p");s.className="nada",s.textContent="Nada guardado — está tudo no corpo.",this.acervo.appendChild(s);return}fn.forEach((s,o)=>{const a=e.filter(h=>h.slot===s);if(a.length===0)return;const r=document.createElement("section");r.className="grupo",r.dataset.slot=s;const c=document.createElement("h4");c.innerHTML=`${Fa[o]} <span>${a.length}</span>`,r.appendChild(c);const l=document.createElement("div");l.className="pecas";for(const h of a){const u=document.createElement("button");u.className="peca",u.dataset.id=h.id,u.innerHTML=`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""),l.appendChild(u)}r.appendChild(l),this.acervo.appendChild(r)})}onTirarParte=null;onVestirPeca=null;onAbrirArmario=null;onFecharArmario=null;onGirarBoneco=null;ligarGiroDoBoneco(){let t=!1,e=0;this.boneco.addEventListener("pointerdown",i=>{t=!0,e=i.clientX,this.boneco.setPointerCapture(i.pointerId)}),this.boneco.addEventListener("pointermove",i=>{t&&(this.onGirarBoneco?.((i.clientX-e)*.012),e=i.clientX)});for(const i of["pointerup","pointercancel"])this.boneco.addEventListener(i,()=>{t=!1});this.corpo.addEventListener("click",i=>{const s=i.target.closest(".parte");!s?.dataset.parte||!s.classList.contains("cheio")||this.onTirarParte?.(Number(s.dataset.parte))}),this.acervo.addEventListener("click",i=>{const s=i.target.closest(".peca");s?.dataset.id&&this.onVestirPeca?.(s.dataset.id)})}get vestiarioOpen(){return this.vestiario.classList.contains("show")}abrirVestiario(){this.vestiarioOpen||(this.som?.("escolha"),this.onAbrirVestiario?.(),this.vestiario.classList.add("show"),this.marcarTelaAberta())}fecharVestiario(){this.vestiarioOpen&&(this.vestiario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharVestiario?.())}renderVestiario(t){this.donoVestiario.textContent=`de ${t.dono}`,this.oculos.classList.toggle("ligado",t.oculos),this.oculos.innerHTML=`<span class="icone">🕶️</span><b>Óculos escuros</b><em>${t.oculos?"tirar":"colocar"}</em>`,this.bermudas.innerHTML="";for(const e of t.bermudas){const i=document.createElement("button");i.className="bermuda",i.classList.toggle("vestida",e.vestida),i.dataset.id=e.id;const s=document.createElement("i");s.style.background=e.faixa?`repeating-linear-gradient(160deg, ${e.cor} 0 12px, ${e.faixa} 12px 18px)`:e.cor,i.appendChild(s);const o=document.createElement("b");o.textContent=e.nome,i.appendChild(o),this.bermudas.appendChild(i)}}onAlternarOculos=null;onEscolherBermuda=null;onAbrirVestiario=null;onFecharVestiario=null;onEscolherSlot=null;onMoverItem=null;onDescartar=null;onAbrirMochila=null;podeIrPara(t,e,i=!1){return t?t==="vestivel"&&e==="mao"?i?!0:(this.toast("Roupa só se troca no guarda-roupa","👗"),!1):t==="mao"&&e==="vestivel"?(this.toast("Este item não pode ser vestido","🚫"),!1):!0:!0}endereco(t){const e=t.closest(".slot");return e?.dataset.slot?{lista:e.closest(".vestiveis")?"vestivel":"mao",indice:Number(e.dataset.slot)}:null}tocarVaga(t){const e=this.endereco(t.target);if(!e)return;if(this.pegou){const s=this.pegou;if(s.lista===e.lista&&s.indice===e.indice){this.pegou=null,this.marcarPego(null);return}if(!this.podeIrPara(this.tipoNaPinca,e.lista,this.funcionalNaPinca))return;this.pegou=null,this.marcarPego(null),this.onMoverItem?.(s,e)&&this.som?.("escolha");return}const i=t.target.closest(".slot");if(e.lista==="mao"&&!i.classList.contains("cheio")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}if(i.classList.contains("cheio")){if(e.lista==="mao"&&!i.classList.contains("principal")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}this.pegou=e,this.tipoNaPinca=i.dataset.tipo,this.funcionalNaPinca=i.dataset.funcional==="sim",this.marcarPego(i),this.som?.("escolha")}}marcarPego(t){for(const s of this.mochila.querySelectorAll(".slot.pego"))s.classList.remove("pego");t?.classList.add("pego"),this.mochila.classList.toggle("movendo",t!==null),this.descarte.classList.toggle("show",t!==null),this.descarte.classList.remove("confirmando");const e=this.descarte.querySelector(".descartar"),i=t?.querySelector("b")?.textContent??"";e.textContent=i?`🗑 Descartar ${i}`:"🗑 Descartar"}comecarArrasto(t){const e=this.endereco(t.target),i=t.target.closest(".slot");if(!e||!i?.classList.contains("cheio")){t.preventDefault();return}t.dataTransfer?.setData("text/plain",JSON.stringify({vaga:e,tipo:i.dataset.tipo,funcional:i.dataset.funcional==="sim"})),t.dataTransfer&&(t.dataTransfer.effectAllowed="move"),i.classList.add("pego")}arrastarSobre(t){const e=t.target.closest(".slot");e&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),e.classList.add("alvo"))}soltarArrasto(t){t.preventDefault();const e=this.endereco(t.target),i=t.dataTransfer?.getData("text/plain");if(this.limparArrasto(),!(!e||!i))try{const{vaga:s,tipo:o,funcional:a}=JSON.parse(i);if(!this.podeIrPara(o,e.lista,a===!0))return;this.onMoverItem?.(s,e)&&this.som?.("escolha")}catch{}}limparArrasto(){for(const t of this.mochila.querySelectorAll(".slot.pego, .slot.alvo"))t.classList.remove("pego","alvo")}}function Gr(n,t,e){for(const i of e)if(i.kind==="circle"){const s=n.x-i.x,o=n.z-i.z,a=t+i.r,r=s*s+o*o;if(r>=a*a||r===0)continue;const c=Math.sqrt(r),l=(a-c)/c;n.x+=s*l,n.z+=o*l}else{const s=Math.cos(-i.rot),o=Math.sin(-i.rot),a=n.x-i.x,r=n.z-i.z,c=a*s-r*o,l=a*o+r*s,h=Math.max(-i.hw,Math.min(i.hw,c)),u=Math.max(-i.hd,Math.min(i.hd,l));let d=c-h,p=l-u,g=d*d+p*p;if(g>t*t)continue;if(g===0){const w=i.hw-Math.abs(c),M=i.hd-Math.abs(l);w<M?(d=Math.sign(c)||1,p=0,g=0):(d=0,p=Math.sign(l)||1);const x=d!==0?Math.sign(d)*(i.hw+t):c,C=p!==0?Math.sign(p)*(i.hd+t):l;n.x=i.x+(x*Math.cos(i.rot)-C*Math.sin(i.rot)),n.z=i.z+(x*Math.sin(i.rot)+C*Math.cos(i.rot));continue}const v=Math.sqrt(g),m=h+d/v*t,f=u+p/v*t;n.x=i.x+(m*Math.cos(i.rot)-f*Math.sin(i.rot)),n.z=i.z+(m*Math.sin(i.rot)+f*Math.cos(i.rot))}}function qr(n,t,e){n.x=Math.max(e.minX+t,Math.min(e.maxX-t,n.x)),n.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,n.z))}const cu=1.3;class h1{object=new ot;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new N;body;locked=!1;riding=!1;submersion=0;patins=!1;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}get chest(){return new N(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}update(t,e,i,s){if(this.riding){this.body.update(e,0);return}const o=this.submersion>.05,a=this.patins&&!o?cu:1,r=o?this.maxSpeed*.55:this.maxSpeed*a;if(!this.locked&&t.lengthSq()>1e-4){const l=t.clone().normalize();this.velocity.x+=l.x*this.accel*e,this.velocity.z+=l.z*this.accel*e;const h=Math.hypot(this.velocity.x,this.velocity.z);h>r&&(this.velocity.x=this.velocity.x/h*r,this.velocity.z=this.velocity.z/h*r),this.body.setFacing(Math.atan2(l.x,l.z))}else{const l=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(l),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,Gr(this.position,this.radius,i),qr(this.position,this.radius,s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(o),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class u1{object=new ot;position;radius=.4;maxSpeed=5;velocity=new N;dir=new N;body;aoLado=0;folga=2;ordem=null;riding=!1;submersion=0;patins=!1;lado=0;distancia=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}atrelar(t,e){this.lado=t,this.distancia=e,this.ordem=null}soltar(){this.lado=0}get atrelado(){return this.lado!==0}goTo(t,e){this.ordem=new N(t,0,e)}clearOrder(){this.ordem=null}hold(t,e){this.ordem?this.ordem.set(this.position.x,0,this.position.z):this.ordem=new N(this.position.x,0,this.position.z),this.velocity.set(0,0,0),this.body.setFacing(Math.atan2(t-this.position.x,e-this.position.z))}get hasOrder(){return this.ordem!==null}rebocar(t,e,i,s){const o=this.aoLado,a=t.x+Math.sin(o+Math.PI/2)*this.distancia*this.lado,r=t.z+Math.cos(o+Math.PI/2)*this.distancia*this.lado,c=this.position.x,l=this.position.z,h=Math.min(1,e*16);this.position.x+=(a-this.position.x)*h,this.position.z+=(r-this.position.z)*h,Gr(this.position,this.radius,i),qr(this.position,this.radius,s),this.velocity.set((this.position.x-c)/Math.max(e,1e-4),0,(this.position.z-l)/Math.max(e,1e-4)),this.body.setFacing(o),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}set direcaoDoPar(t){this.aoLado=t}update(t,e,i,s){if(this.riding){this.body.update(e,0);return}if(this.lado!==0){this.rebocar(t,e,i,s);return}const o=this.ordem??t,a=this.ordem?.55:this.folga;this.dir.set(o.x-this.position.x,0,o.z-this.position.z);const r=this.dir.length();if(!this.ordem&&r>22){this.teleport(o.x-1.2,o.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(r>a){this.dir.normalize();const d=this.maxSpeed*(this.patins?cu:1),p=Math.min(d,1.6+(r-a)*2.2);this.velocity.x+=(this.dir.x*p-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*p-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),r>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,Gr(this.position,this.radius,i),qr(this.position,this.radius,s);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),u=.86;if(h<u&&h>1e-4){const d=(u-h)/h;this.position.x+=c*d,this.position.z+=l*d}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}const d1=1.7;class f1{grupo=new ot;vivos=[];constructor(t){t.add(this.grupo)}soltar(t,e,i,s=1.62){const o=iu(.6);o.userData.coracao=!0,o.position.set(t.x+e,s,t.z+i),this.grupo.add(o),this.vivos.push({obj:o,vida:0,giro:Math.random()*Math.PI,fx:e,fz:i})}limpar(){for(const t of this.vivos)this.grupo.remove(t.obj);this.vivos.length=0}update(t){for(let e=this.vivos.length-1;e>=0;e--){const i=this.vivos[e];i.vida+=t;const s=i.vida/d1;if(s>=1){this.grupo.remove(i.obj),this.vivos.splice(e,1);continue}i.obj.position.y+=t*.72;const o=(.7+Math.sin(i.vida*3+i.giro)*.25)*t;i.obj.position.x+=i.fx*o,i.obj.position.z+=i.fz*o,i.obj.rotation.y=i.giro+i.vida*1.4;const a=s<.18?s/.18:Math.min(1,(1-s)/.35);i.obj.scale.setScalar(.25+a*.9)}}}const p1=1.5,Gl=.9,ql=1.16,wi=.32,Wr=.42,lu=.34,m1=wi+Wr+lu,g1=.5;class v1{constructor(t){this.coracoes=t}t=-1;descanso=0;alvoA=new N;alvoB=new N;soltouCoracao=!1;onSom=null;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!x1(t,e))return!1;const i=e.position.x-t.position.x,s=e.position.z-t.position.z,o=Math.hypot(i,s);if(o>p1||o<.01)return!1;const a=Math.atan2(i,s);return Math.abs(Oa(t.rig.facing,a))<Gl&&Math.abs(Oa(e.rig.facing,a+Math.PI))<Gl}iniciar(t,e,i){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const s=e.position.x-t.position.x,o=e.position.z-t.position.z,a=Math.atan2(s,o),r=i+Math.PI/2,c=Math.abs(Oa(a,r))<Math.PI/2?r:r+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,u=Math.sin(c)*ql/2,d=Math.cos(c)*ql/2;this.alvoA.set(l-u,0,h-d),this.alvoB.set(l+u,0,h+d),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0)}update(t,e,i){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const s=_1(this.t);if(e.rig.setKiss(s),i.rig.setKiss(s),e.locked=!0,this.t<wi){const o=Math.min(1,t*9);e.position.lerp(this.alvoA,o),i.position.lerp(this.alvoB,o)}if(!this.soltouCoracao&&this.t>=wi*.9){this.soltouCoracao=!0;const o=Math.atan2(i.position.x-e.position.x,i.position.z-e.position.z),a=Math.sin(o),r=Math.cos(o);this.coracoes.soltar(e.position,-a,-r),this.coracoes.soltar(i.position,a,r),this.onSom?.("beijo"),this.onSom?.("coracao")}this.t>=m1&&(this.t=-1,this.descanso=g1,e.rig.setKiss(0),i.rig.setKiss(0),e.locked=!1)}}}function _1(n){return n<wi?Wl(n/wi):n<wi+Wr?1:Wl(Math.max(0,1-(n-wi-Wr)/lu))}function Wl(n){return n*n*(3-2*n)}function x1(n,t){const e=n.rig.spec,i=t.rig.spec;return e.casal===!0&&i.casal===!0&&e.id!==i.id}function Oa(n,t){return Math.atan2(Math.sin(n-t),Math.cos(n-t))}const M1=.95,y1=1.8,b1=2.2,S1=.5,Xl=3;class w1{constructor(t){this.coracoes=t}lado=1;ligado=!1;relogio=0;longe=0;onSom=null;get ativo(){return this.ligado}disponivel(t,e){if(this.ligado||t.riding||e.riding||t.submersion>.05||e.submersion>.05||t.locked||e.hasOrder)return!1;const i=Math.hypot(e.position.x-t.position.x,e.position.z-t.position.z);return i>.01&&i<=y1}ligar(t,e){if(this.ligado)return;this.ligado=!0,this.relogio=0,this.longe=0;const i=t.rig.facing,s=e.position.x-t.position.x,o=e.position.z-t.position.z;this.lado=s*Math.sin(i+Math.PI/2)+o*Math.cos(i+Math.PI/2)<0?-1:1,this.aplicar(t,e),this.onSom?.("escolha")}soltar(t,e){this.ligado&&(this.ligado=!1,e.soltar(),t.rig.setHoldingHands(0),e.rig.setHoldingHands(0))}trocouCorpos(t,e){this.ligado&&(this.lado=this.lado===1?-1:1,this.aplicar(t,e))}update(t,e,i){if(!this.ligado)return;if(e.riding||i.riding||e.submersion>.05||i.submersion>.05||i.hasOrder){this.soltar(e,i);return}const s=Math.hypot(i.position.x-e.position.x,i.position.z-e.position.z);if(this.longe=s>b1?this.longe+t:0,this.longe>=S1){this.soltar(e,i);return}if(i.direcaoDoPar=e.rig.facing,this.relogio+=t,this.relogio>=Xl){this.relogio-=Xl;const o=e.position.clone().add(i.position).multiplyScalar(.5);this.coracoes.soltar(o,0,0,2.05),this.onSom?.("coracao")}}aplicar(t,e){e.atrelar(this.lado,M1),e.direcaoDoPar=t.rig.facing,t.rig.setHoldingHands(this.lado),e.rig.setHoldingHands(this.lado===1?-1:1)}}function ie(n,t,e){const i=n.createOscillator();i.type=e.tipo??"sine",i.frequency.setValueAtTime(e.freq,e.quando),e.glide&&i.frequency.exponentialRampToValueAtTime(Math.max(20,e.glide),e.quando+e.dur),e.detune&&i.detune.setValueAtTime(e.detune,e.quando);const s=n.createGain(),o=e.vol??.2,a=e.ataque??.006;s.gain.setValueAtTime(1e-4,e.quando),s.gain.exponentialRampToValueAtTime(o,e.quando+a),s.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur);let r=s;if(e.abafo){const c=n.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(e.abafo,e.quando),s.connect(c),r=c}i.connect(s),r.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}let wo=null;function E1(n){if(!wo||wo.sampleRate!==n.sampleRate){const t=n.createBuffer(1,n.sampleRate,n.sampleRate),e=t.getChannelData(0);for(let i=0;i<e.length;i++)e[i]=Math.random()*2-1;wo=t}return wo}function Ze(n,t,e){const i=n.createBufferSource();i.buffer=E1(n),i.loop=!0;const s=n.createBiquadFilter();s.type=e.tipo??"bandpass",s.frequency.setValueAtTime(e.freq??1800,e.quando),e.glide&&s.frequency.exponentialRampToValueAtTime(Math.max(60,e.glide),e.quando+e.dur),s.Q.setValueAtTime(e.q??1.2,e.quando);const o=n.createGain(),a=e.vol??.14;o.gain.setValueAtTime(1e-4,e.quando),o.gain.exponentialRampToValueAtTime(a,e.quando+.008),o.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur),i.connect(s),s.connect(o),o.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}function fe(n){return 440*Math.pow(2,(n-69)/12)}function T1(n){let t=n>>>0;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}const jl=[0,2,4,7,9,12,14,16],Me=72,hu={passo:({ctx:n,destino:t,t:e,n:i})=>{const s=i%2===0;Ze(n,t,{quando:e,dur:.075,vol:.05,freq:s?1500:1150,glide:s?700:560,q:.9}),ie(n,t,{freq:s?128:112,quando:e,dur:.06,vol:.045,tipo:"sine"})},nadar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.34,vol:.07,freq:700,glide:2600,q:.7})},agua:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.42,vol:.2,freq:2400,glide:500,q:.6}),ie(n,t,{freq:420,glide:120,quando:e,dur:.26,vol:.1,tipo:"sine"})},prompt:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+12),quando:e,dur:.09,vol:.055,tipo:"triangle"})},interagir:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+4),quando:e,dur:.12,vol:.13,tipo:"triangle"}),ie(n,t,{freq:fe(Me+11),quando:e+.055,dur:.16,vol:.1,tipo:"sine"})},fala:({ctx:n,destino:t,t:e,n:i})=>{const s=jl[i%4]+(i%8<4?0:2);ie(n,t,{freq:fe(Me+7+s),quando:e,dur:.06,vol:.035,tipo:"square",abafo:2200})},escolha:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+7),quando:e,dur:.07,vol:.08,tipo:"triangle"})},confirma:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+4),quando:e,dur:.1,vol:.12,tipo:"triangle"}),ie(n,t,{freq:fe(Me+9),quando:e+.07,dur:.14,vol:.11,tipo:"triangle"}),ie(n,t,{freq:fe(Me+16),quando:e+.14,dur:.2,vol:.09,tipo:"sine"})},porta:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.3,vol:.11,freq:900,glide:320,q:.8}),ie(n,t,{freq:180,glide:90,quando:e+.16,dur:.2,vol:.09,tipo:"sine"})},memoria:({ctx:n,destino:t,t:e})=>{[0,4,7,12,16].forEach((i,s)=>{ie(n,t,{freq:fe(Me+i),quando:e+s*.075,dur:.42,vol:.11-s*.008,tipo:"triangle"})})},toast:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+9),quando:e,dur:.14,vol:.09,tipo:"sine"}),ie(n,t,{freq:fe(Me+16),quando:e+.08,dur:.22,vol:.07,tipo:"sine"})},trocar:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me),glide:fe(Me+12),quando:e,dur:.18,vol:.09,tipo:"triangle"}),Ze(n,t,{quando:e,dur:.2,vol:.05,freq:800,glide:3e3,q:.6})},beijo:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.06,vol:.1,freq:2400,glide:1200,q:2.5}),ie(n,t,{freq:fe(Me+7),quando:e+.02,dur:.1,vol:.08,tipo:"sine"})},coracao:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+12),quando:e,dur:.3,vol:.07,tipo:"sine"}),ie(n,t,{freq:fe(Me+19),quando:e+.09,dur:.36,vol:.05,tipo:"sine"})},lancar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.26,vol:.12,freq:600,glide:3200,q:.7}),ie(n,t,{freq:300,glide:900,quando:e,dur:.16,vol:.06,tipo:"triangle"})},pegar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.09,vol:.13,freq:1400,glide:500,q:1.6}),ie(n,t,{freq:fe(Me+9),quando:e+.03,dur:.14,vol:.1,tipo:"triangle"})},quicar:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:220,glide:110,quando:e,dur:.12,vol:.08,tipo:"sine"}),Ze(n,t,{quando:e,dur:.1,vol:.06,freq:900,glide:400,q:1})},sorvete:({ctx:n,destino:t,t:e})=>{[0,7,12].forEach((i,s)=>{ie(n,t,{freq:fe(Me+4+i),quando:e+s*.09,dur:.3,vol:.1,tipo:"triangle"})})},miado:({ctx:n,destino:t,t:e,n:i})=>{const s=i%2===1,o=fe(Me+jl[s?2:3]);ie(n,t,{freq:o*.82,glide:o,quando:e,dur:s?.2:.15,vol:.075,tipo:"sawtooth",abafo:1500}),ie(n,t,{freq:o,glide:o*.68,quando:e+(s?.15:.1),dur:s?.55:.4,vol:.085,ataque:.02,tipo:"sawtooth",abafo:1200}),Ze(n,t,{quando:e,dur:s?.4:.28,vol:.022,freq:1100,glide:700,q:2.2})},pato:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:620,glide:380,quando:e,dur:.13,vol:.1,tipo:"sawtooth",abafo:1400}),ie(n,t,{freq:520,glide:300,quando:e+.15,dur:.12,vol:.08,tipo:"sawtooth",abafo:1200})},tv:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.18,vol:.07,freq:3e3,glide:1200,q:.5}),ie(n,t,{freq:fe(Me+4),quando:e+.1,dur:.18,vol:.07,tipo:"square",abafo:1800})},sino:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+12),quando:e,dur:.9,vol:.09,tipo:"sine"}),ie(n,t,{freq:fe(Me+19),quando:e+.02,dur:.8,vol:.05,tipo:"sine",detune:6})},sentar:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.24,vol:.09,freq:700,glide:260,q:.7})},menu:({ctx:n,destino:t,t:e})=>{ie(n,t,{freq:fe(Me+2),quando:e,dur:.1,vol:.09,tipo:"triangle"}),ie(n,t,{freq:fe(Me+9),quando:e+.06,dur:.14,vol:.07,tipo:"triangle"})},diario:({ctx:n,destino:t,t:e})=>{Ze(n,t,{quando:e,dur:.22,vol:.09,freq:1200,glide:3e3,q:.6})},recomecar:({ctx:n,destino:t,t:e})=>{[0,4,7,12].forEach((i,s)=>{ie(n,t,{freq:fe(Me-12+i),quando:e+s*.11,dur:.5,vol:.1,tipo:"triangle"})})}},A1=.2,C1=1.3,Wi=n=>({raiz:n,notas:[0,4,7,11]}),xs=n=>({raiz:n,notas:[0,3,7,10]}),Eo=n=>({raiz:n,notas:[0,4,7,10]}),P1=n=>({raiz:n,notas:[0,4,7,9]}),Ba=[0,2,4,7,9,12,14,16,19],R1=[0,2,3,5,7,9,10,12,14],zo={casa:{bpm:82,tonica:41,giro:[Wi(0),xs(9),xs(2),Eo(7)],melodia:.62,chocalho:!1,escala:Ba},"villa-lobos":{bpm:100,tonica:36,giro:[Wi(0),Wi(5),xs(9),Eo(7)],melodia:.8,chocalho:!0,escala:Ba},clube:{bpm:92,tonica:38,giro:[P1(0),xs(2),Wi(5),Eo(7)],melodia:.72,chocalho:!0,escala:Ba},padrao:{bpm:88,tonica:40,giro:[Wi(0),xs(9),Wi(5),Eo(7)],melodia:.6,chocalho:!1,escala:R1}},Yl=[[0,2,3,6],[0,3,4,6,7],[2,3,5,6],[0,1,3,6],[0,4,6],[1,3,4,7]];class uu{constructor(t,e){this.ctx=t,this.destino=e}clima=zo.padrao;proximoClima=null;passo=0;proximo=0;timer=null;sorte=T1(20260827);frase=[];grau=2;get tocando(){return this.timer!==null}setClima(t){const e=zo[t]??zo.padrao;e!==this.clima&&(this.tocando?this.proximoClima=e:this.clima=e)}start(){this.timer===null&&(this.proximo=this.ctx.currentTime+.15,this.timer=window.setInterval(()=>this.agendar(),A1*1e3),this.agendar())}stop(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}preAgendar(t){for(this.proximo=0,this.passo=0;this.proximo<t;){this.tocarPasso(this.passo,this.proximo);const e=30/this.clima.bpm;this.proximo+=e*(this.passo%2===0?1.18:.82),this.passo+=1}}agendar(){const t=this.ctx.currentTime+C1;let e=0;for(;this.proximo<t&&e++<64;){this.tocarPasso(this.passo,this.proximo);const i=30/this.clima.bpm;this.proximo+=i*(this.passo%2===0?1.18:.82),this.passo+=1}}tocarPasso(t,e){const i=t%8;i===0&&(this.proximoClima&&(this.clima=this.proximoClima,this.proximoClima=null),(Math.floor(t/8)%2===0||this.frase.length===0)&&(this.frase=Yl[Math.floor(this.sorte()*Yl.length)]));const s=this.clima,o=Math.floor(t/8),a=s.giro[o%s.giro.length],r=s.tonica+a.raiz;if(i===0||i===4){const c=i===0?r:r+(this.sorte()<.4?7:4);ie(this.ctx,this.destino,{freq:fe(c),quando:e,dur:i===0?.6:.45,vol:.2,tipo:"sine",abafo:420})}if(i===2||i===5||i===7&&this.sorte()<.35){const c=r+24;for(const[l,h]of a.notas.entries())l===0&&i!==2||ie(this.ctx,this.destino,{freq:fe(c+h),quando:e,dur:.85,vol:.07,tipo:"triangle",ataque:.03,detune:l%2?5:-5,abafo:2400})}if(this.frase.includes(i)&&this.sorte()<s.melodia){const c=[-2,-1,-1,0,1,1,2];this.grau+=c[Math.floor(this.sorte()*c.length)],this.grau>s.escala.length-3&&(this.grau-=2),this.grau<2&&(this.grau+=2),this.grau=Math.max(0,Math.min(s.escala.length-1,this.grau));const l=i>=6?a.notas[Math.floor(this.sorte()*3)]:s.escala[this.grau],h=s.tonica+31;this.marimba(fe(h+l),e),l<=9&&this.sorte()<.22&&this.marimba(fe(h+l+12),e+.03,.4)}s.chocalho&&i%2===1&&Ze(this.ctx,this.destino,{quando:e,dur:.06,vol:i===3||i===7?.035:.02,freq:6200,q:.8})}marimba(t,e,i=1){ie(this.ctx,this.destino,{freq:t,quando:e,dur:.42,vol:.13*i,tipo:"sine"}),t<900&&ie(this.ctx,this.destino,{freq:t*2,quando:e,dur:.1,vol:.04*i,tipo:"sine"})}}const Zl="aristory.som",I1=.035;class L1{ctx=null;mestre=null;canalMusica=null;canalEfeitos=null;musica=null;mudo;climaPendente="padrao";contadores=new Map;ultimoEm=new Map;carregando=null;contagem=new Map;constructor(){this.mudo=localStorage.getItem(Zl)==="0";const t=()=>this.ligar();for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,t,{once:!1,passive:!0})}get ligado(){return!this.mudo}get pronto(){return this.ctx!==null&&this.ctx.state==="running"}ligar(){if(!this.ctx){const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,this.mestre=e.createGain(),this.mestre.gain.value=this.mudo?0:.9,this.mestre.connect(e.destination),this.canalMusica=e.createGain(),this.canalMusica.gain.value=.9,this.canalMusica.connect(this.mestre),this.canalEfeitos=e.createGain(),this.canalEfeitos.gain.value=1,this.canalEfeitos.connect(this.mestre),this.musica=new uu(e,this.canalMusica),this.musica.setClima(this.climaPendente)}this.ctx.resume().then(()=>{this.mudo||this.musica?.start()})}setMudo(t){if(this.mudo=t,localStorage.setItem(Zl,t?"0":"1"),this.mestre&&this.ctx){const e=this.ctx.currentTime;this.mestre.gain.cancelScheduledValues(e),this.mestre.gain.setValueAtTime(this.mestre.gain.value,e),this.mestre.gain.linearRampToValueAtTime(t?0:.9,e+.12)}t?this.musica?.stop():this.ctx?.state==="running"&&this.musica?.start()}setClima(t){this.climaPendente=t,this.musica?.setClima(t)}play(t){if(this.contagem.set(t,(this.contagem.get(t)??0)+1),this.mudo||!this.ctx||!this.canalEfeitos||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(e-(this.ultimoEm.get(t)??-1)<I1)return;this.ultimoEm.set(t,e);const i=(this.contadores.get(t)??0)+1;this.contadores.set(t,i),hu[t]({ctx:this.ctx,destino:this.canalEfeitos,t:e,n:i})}carga(t){if(!this.ctx||!this.canalEfeitos||this.mudo||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(t===null){if(this.carregando){const{osc:s,ganho:o}=this.carregando;o.gain.cancelScheduledValues(e),o.gain.setValueAtTime(o.gain.value,e),o.gain.exponentialRampToValueAtTime(1e-4,e+.08),s.stop(e+.1),this.carregando=null}return}if(!this.carregando){const s=this.ctx.createOscillator();s.type="triangle";const o=this.ctx.createGain();o.gain.setValueAtTime(1e-4,e),o.gain.exponentialRampToValueAtTime(.05,e+.05),s.connect(o),o.connect(this.canalEfeitos),s.start(e),this.carregando={osc:s,ganho:o}}const i=fe(60+t*19);this.carregando.osc.frequency.setTargetAtTime(i,e,.04)}aplauso(){if(!this.ctx||!this.canalEfeitos)return;const t=this.ctx.currentTime;[0,5,9,12].forEach((e,i)=>{ie(this.ctx,this.canalEfeitos,{freq:fe(72+e),quando:t+i*.1,dur:.5,vol:.09,tipo:"triangle"})})}}const D1={magro:.86,medio:1,forte:1.16},Jl=.75,U1=.13,N1={upright:{bracoX:-1.38,bracoZ:.16,balanco:.15,itemZ:0,itemX:0},relaxed:{bracoX:-.22,bracoZ:.46,balanco:.6,itemZ:.9,itemX:.13}};function ka(n,t,e){const i=new Zo,s=5;for(let a=0;a<s*2;a++){const r=a%2===0?n:n*.46,c=a/(s*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*r,h=Math.sin(c)*r;a===0?i.moveTo(l,h):i.lineTo(l,h)}i.closePath();const o=new mc(i,{depth:t,bevelEnabled:!1});return o.center(),new y(o,e)}class Xr{group=new ot;spec;headTop;body=new ot;head=new ot;armL=new ot;armR=new ot;maoDir=new ot;legL=new ot;legR=new ot;blob;chapeu=new ot;phase=0;bounce=0;beijo=0;maos=0;pose="none";patinando=!1;altoDoPatins=0;alturaDaPerna=0;pes=[];patins=[];targetFacing=0;swimming=!1;sitting=!1;deitado=!1;trocaMaterial=[];soVestido=[];soBanho=[];calcao;pernasDoShort=[];calcaoDaFicha;estampa=[];traje="normal";roupa={};extras=new Map;medidas;sobreTronco=[];cabelo;constructor(t){this.spec=t;const e=t.height,i=D1[t.build],s=e*.28,o=e/1.7;this.altoDoPatins=U1*o,this.alturaDaPerna=s;const a=e*.3,r=e*.17,c=s,l=s+a*.86,h=e*.1*i,u=e*.3;this.headTop=s+a+r*2.1,this.medidas={h:e,w:i,headR:r,legH:s,torsoH:a};const d=A(t.skin),p=A(t.shirt),g=A(t.pants),v=A(t.shoes);this.calcaoDaFicha=A(t.swim??t.pants);for(const[_,D]of[[this.legL,-1],[this.legR,1]]){_.position.set(D*e*.055*i,c,0);const z=new y(new Tn(e*.042*i,s*.62,4,10),g);z.position.y=-s*.48,_.add(z),this.trocaMaterial.push({mesh:z,normal:g,banho:d,slot:"pernas",parte:"principal"});const B=s*.36,V=new y(new nt(e*.052*i,e*.064*i,B,14,1,!0),this.calcaoDaFicha);V.position.y=s*.02-B/2,V.visible=!1,_.add(V),this.soBanho.push(V),this.pernasDoShort.push(V);const H=new y(new G(e*.075*i,e*.045,e*.11),v);H.position.set(0,-s+e*.022,e*.018),_.add(H),this.trocaMaterial.push({mesh:H,normal:v,banho:d,slot:"pes",parte:"principal"}),this.pes.push(H);const J=Vr(t.shoes);J.scale.setScalar(o),J.visible=!1,_.add(J),this.patins.push(J),this.body.add(_)}const m=new y(new Tn(e*.105*i,a*.5,5,12),p);if(m.position.y=c+a*.52,m.scale.z=.82,this.body.add(m),this.trocaMaterial.push({mesh:m,normal:p,banho:d,slot:"tronco",parte:"principal"}),t.shirtAccent!==void 0){const _=new y(new nt(e*.108*i,e*.108*i,e*.03,14,1,!0),A(t.shirtAccent,{doubleSide:!0}));_.position.y=c+a*.72,_.scale.z=.82,this.body.add(_),this.soVestido.push(_),this.sobreTronco.push(_)}if(t.jacket!==void 0){const _=A(t.jacket,{doubleSide:!0}),D=e*.105*i,z=new y(new nt(D*1.14,D*1.1,a*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),_);z.position.y=c+a*.56,z.scale.z=.84,this.body.add(z),this.soVestido.push(z),this.sobreTronco.push(z);const B=new y(new Rt(e*.088*i,12,10,0,Math.PI*2,0,Math.PI*.62),A(t.jacket));B.position.set(0,l+a*.04,-D*.75),B.rotation.x=-.7,B.scale.set(1.15,1,.8),this.body.add(B),this.soVestido.push(B),this.sobreTronco.push(B)}const f=e*.118*i,w=e*.105,M=new y(new nt(f,e*.112*i,w,14),this.calcaoDaFicha);M.position.y=c+e*.012,M.scale.z=.85,M.visible=!1,this.body.add(M),this.soBanho.push(M),this.calcao=M;for(const _ of[.3,-.12]){const D=new y(new nt(f*1.03,f*1.03,e*.019,14,1,!0),this.calcaoDaFicha);D.position.y=_*w,D.visible=!1,M.add(D),this.estampa.push(D)}for(const[_,D]of[[this.armL,-1],[this.armR,1]]){_.position.set(D*h,l,0);const z=t.jacket!==void 0?A(t.jacket):p,B=new y(new Tn(e*.038*i,u*.34,4,10),z);B.position.y=-u*.24,_.add(B),this.trocaMaterial.push({mesh:B,normal:z,banho:d,slot:"tronco",parte:"detalhe"});const V=new y(new Tn(e*.032*i,u*.28,4,10),d);V.position.y=-u*.66,_.add(V);const H=new y(new Rt(e*.04*i,10,8),d);H.position.y=-u*.92,_.add(H),this.body.add(_)}this.maoDir.position.y=-u*.98,this.armR.add(this.maoDir),this.head.position.y=s+a+r*.92;const x=new y(new nt(e*.035,e*.04,e*.05,10),d);x.position.y=-r*.85,this.head.add(x);const C=new y(new Rt(r,20,16),d);C.scale.set(1,1.04,1),this.head.add(C);const P=A(t.eyes);for(const _ of[-1,1]){const D=new y(new Rt(r*.14,10,8),P);if(D.position.set(_*r*.35,0,r*.9),D.scale.set(1,1.25,.6),this.head.add(D),t.blush!==void 0){const z=new y(new Ns(r*.16,12),Xe(t.blush,.75,!0));z.position.set(_*r*.56,-r*.26,r*.82),z.rotation.y=_*.35,this.head.add(z)}}const I=A(t.hair.color);for(const _ of[-1,1]){const D=new y(new G(r*.3,r*.075,r*.06),I);D.position.set(_*r*.35,r*.3,r*.87),D.rotation.z=_*-.12,this.head.add(D)}const T=new y(new _e(r*.16,r*.035,6,14,Math.PI),P);T.position.set(0,-r*.38,r*.9),T.rotation.set(0,0,Math.PI),this.head.add(T);const b=this.head.children.length;this.buildHair(r),this.cabelo=this.head.children.slice(b),this.buildAccessories(r,u,l,h,a,c,i),this.body.add(this.head),this.group.add(this.body),this.blob=new y(new Ns(e*.16*i,18),Xe(2832939,.22,!0)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(_=>{_.isMesh&&_!==this.blob&&(_.castShadow=!0,_.receiveShadow=!1)})}buildHair(t){const{style:e,color:i}=this.spec.hair,s=A(i),o=(a,r,c=.62,l=0)=>{const h=new y(new Rt(t*a,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),s);return h.position.y=r,this.head.add(h),h};switch(e){case"raspado":{o(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{o(1.06,t*.04).scale.set(1,.95,.98);const r=new y(new G(t*1.5,t*.34,t*.42),s);r.position.set(0,t*.6,t*.62),r.rotation.x=-.18,this.head.add(r);break}case"franja":{o(1.07,t*.02);const a=new y(new nt(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),s);a.position.set(0,t*.5,0),this.head.add(a);break}case"ondulado":{o(1.08,t*.02);for(const a of[-1,1]){const r=new y(new Rt(t*.46,12,10),s);r.position.set(a*t*.85,t*.1,-t*.1),r.scale.set(.8,1.15,1),this.head.add(r)}break}case"coque":{o(1.06,t*.02);const a=new y(new Rt(t*.42,12,10),s);a.position.set(0,t*.72,-t*.82),this.head.add(a);break}case"cachos-curtos":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?A(this.spec.hair.tips):s;o(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[u,d,p,g]of l)for(let v=0;v<d;v++){const m=v/d*Math.PI*2+u*1.9,f=Math.sin(u)*Math.cos(m),w=Math.cos(u),M=Math.sin(u)*Math.sin(m);if(w<.72&&M>.24)continue;const x=new y(new Rt(t*p*(1+(a-1)*.4),8,7),h%5===0?r:s),C=g*(1+(a-1)*.14),P=M>0?.9:1.02;x.position.set(f*t*C,w*t*C,M*t*C*P),this.head.add(x),h++}for(let u=0;u<5;u++){const d=new y(new Rt(t*.2*(1+(a-1)*.3),8,7),u===2?r:s);d.position.set((u-2)*t*.3,t*(.62-u%2*.07),t*.62),this.head.add(d)}for(let u=0;u<3;u++){const d=new y(new Rt(t*.24*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1)*t*.3,t*(.84+u%2*.07),t*.44),this.head.add(d)}for(const u of[-1,1]){const d=new y(new Rt(t*.17,8,7),s);d.position.set(u*t*.9,-t*.12,t*.22),d.scale.set(.7,1.1,.85),this.head.add(d)}break}case"cacheado":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?A(this.spec.hair.tips):s;o(1+(a-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[u,d,p,g]of l)for(let v=0;v<d;v++){const m=v/d*Math.PI*2+u*2.3,f=Math.sin(u)*Math.cos(m),w=Math.cos(u),M=Math.sin(u)*Math.sin(m);if(u>.72&&M>.22)continue;const x=1+(a-1)*.55,C=new y(new Rt(t*p*x,8,7),h%4===0?r:s),P=g*(1+(a-1)*.28),I=M>0?.78:1.06;C.position.set(f*t*P,w*t*P,M*t*P*I),this.head.add(C),h++}for(let u=0;u<4;u++){const d=new y(new Rt(t*.22*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1.5)*t*.34,t*(.62-u%2*.08),t*.62),this.head.add(d)}for(const u of[-1,1]){const d=new y(new Rt(t*.26*a,8,7),s);d.position.set(u*t*1.02*a,-t*.34,t*.28),d.scale.set(.8,1.25,.9),this.head.add(d)}break}}}buildAccessories(t,e,i,s,o,a,r){const c=this.spec.accessories??[],l=A(this.spec.accessoryColor??3093568);{const h=new y(new nt(t*.7,t*.7,t*.11,16),A(16774096));h.position.y=t*1.42,this.chapeu.add(h);const u=new y(new Ne(t*.58,t*1.05,14),A(S.gold));u.position.y=t*1.98,this.chapeu.add(u);const d=ka(t*.3,t*.07,A(16774096));d.position.y=t*2.62,this.chapeu.add(d),this.chapeu.rotation.z=-.14,this.chapeu.visible=!1,this.head.add(this.chapeu)}if(c.includes("oculos")){for(const u of[-1,1]){const d=new y(new _e(t*.24,t*.045,8,16),l);d.position.set(u*t*.36,t*.06,t*.9),this.head.add(d)}const h=new y(new G(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new y(new Rt(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const u=new y(new nt(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);u.position.set(0,t*.12,t*.28),u.rotation.x=-.12,this.head.add(u)}if(c.includes("barba")){const h=new y(new Rt(t*.72,14,12),A(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new y(new _e(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const u of[-1,1]){const d=new y(new nt(t*.28,t*.28,t*.16,12),l);d.position.set(u*t*1.02,t*.02,0),d.rotation.z=Math.PI/2,this.head.add(d)}}if(c.includes("corrente")){const h=new y(new _e(t*.42,t*.035,6,20),A(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new y(new nt(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,u=ka(t*.3,t*.06,A(15918799));u.position.set(-t*.78*h,t*.92*h,t*.62*h),u.rotation.set(.35,-.6,.3),this.head.add(u)}if(c.includes("laco")){const h=this.spec.height,u=new ot,d=h*.105*r,p=new y(new Rt(h*.018,8,6),l);u.add(p);for(const g of[-1,1]){const v=new y(new _e(h*.026,h*.007,6,12),l);v.position.set(g*h*.03,h*.008,0),v.rotation.set(0,g*.5,g*.35),v.scale.set(1,.7,1),u.add(v);const m=new y(new G(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,u.add(m)}u.position.set(0,i-o*.1,d*.86),this.body.add(u),this.soVestido.push(u),this.sobreTronco.push(u)}if(c.includes("cinto")){const h=this.spec.height,u=h*.105*r,d=a+o*.08,p=new y(new nt(u*1.04,u*1.04,h*.032,16,1,!0),l);p.position.y=d,p.scale.z=.84,this.body.add(p),this.soVestido.push(p),this.sobreTronco.push(p);const g=new y(new G(h*.032,h*.03,h*.012),A(14210252));g.position.set(0,d,u*.9),this.body.add(g),this.soVestido.push(g),this.sobreTronco.push(g);const v=new y(new _e(h*.028,h*.004,5,12,Math.PI),A(14210252));v.position.set(u*.6,d-h*.012,u*.6),v.rotation.set(0,-.7,Math.PI),this.body.add(v),this.soVestido.push(v),this.sobreTronco.push(v);const m=ka(h*.016,h*.004,A(14210252));m.position.set(u*.76,d-h*.05,u*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m),this.sobreTronco.push(m)}if(c.includes("mochila")){const h=new y(new G(s*1.7,o*.62,this.spec.height*.09),l);h.position.set(0,a+o*.6,-this.spec.height*.11*r),this.body.add(h),this.soVestido.push(h),this.sobreTronco.push(h);const u=i;for(const d of[-1,1]){const p=new y(new G(this.spec.height*.022,o*.5,this.spec.height*.02),l);p.position.set(d*s*.6,u-o*.2,this.spec.height*.085*r),this.body.add(p),this.soVestido.push(p),this.sobreTronco.push(p)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setCampeao(t){this.chapeu.visible=t}get campeao(){return this.chapeu.visible}setOutfit(t){this.traje=t,this.aplicarVisual()}aplicarVisual(){const t=this.traje==="banho";for(const a of this.trocaMaterial){if(t){a.mesh.material=a.banho;continue}if(this.mostraPele(a.slot,a.parte)){a.mesh.material=a.banho;continue}const r=this.roupa[a.slot];if(!r){a.mesh.material=a.normal;continue}const c=a.parte==="detalhe"?r.corDetalhe??r.cor:r.cor;a.mesh.material=c===void 0?a.normal:A(c)}for(const a of this.soVestido)a.visible=!t;for(const a of this.soBanho)a.visible=t;const e=this.roupa.pernas,i=e?.corBanho===void 0?this.calcaoDaFicha:A(e.corBanho);this.calcao.material=i;for(const a of this.pernasDoShort)a.material=i;for(const a of this.estampa)a.visible=e?.estampaBanho!==void 0,e?.estampaBanho!==void 0&&(a.material=A(e.estampaBanho));if(!t&&this.roupa.tronco)for(const a of this.sobreTronco)a.visible=!1;for(const[a,r]of this.extras){const c=this.roupa[a]!==void 0&&(a==="cabeca"||!t)&&!(a==="pes"&&this.patinando);for(const l of r)l.visible=c}for(const a of this.pes)a.visible=!this.patinando;for(const a of this.patins)a.visible=this.patinando;const o=this.roupa.cabeca?.cobreCabelo===!0;for(const a of this.cabelo)a.visible=!o}mostraPele(t,e){for(const i of Object.values(this.roupa))if(i&&(i.pernasNuas&&t==="pernas"&&!this.roupa.pernas||i.bracosNus&&t==="tronco"&&e==="detalhe"))return!0;return!1}vestirRoupa(t){for(const e of fn){const i=t[e]??null;if((this.roupa[e]?.id??null)===i)continue;this.tirarExtras(e);const s=i?Uo(i):null;this.roupa[e]=s??void 0,s?.extra&&this.porExtras(e,s)}this.aplicarVisual()}get roupaAtual(){const t={};for(const e of fn){const i=this.roupa[e];i&&(t[e]=i.id)}return t}porExtras(t,e){if(!e.extra&&!e.extraBraco)return;const i=[];e.extra&&(t==="pes"||t==="pernas"?i.push([this.legL,"corpo",-1],[this.legR,"corpo",1]):t==="cabeca"?i.push([this.head,"corpo",1]):i.push([this.body,"corpo",1])),e.extraBraco&&i.push([this.armL,"braco",-1],[this.armR,"braco",1]);const s=[];for(const[o,a,r]of i){const c=a==="braco"?e.extraBraco(this.medidas,r):e.extra(this.medidas,r);c.userData.roupa=e.id,c.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!1)}),o.add(c),s.push(c)}this.extras.set(t,s)}tirarExtras(t){const e=this.extras.get(t);if(e){for(const i of e)i.parent?.remove(i),i.traverse(s=>{const o=s;o.isMesh&&o.geometry.dispose()});this.extras.delete(t)}}setSitting(t){this.sitting=t,t||(this.poeAltura(0),this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setLying(t){this.deitado=t,t||(this.poeAltura(0),this.legL.rotation.set(0,0,0),this.legR.rotation.set(0,0,0),this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08),this.body.rotation.x=0)}setPatins(t){if(this.patinando!==t){this.patinando=t;for(const e of this.patins)e.position.y=-this.alturaDaPerna-this.altoDoPatins;this.aplicarVisual()}}get patinandoAgora(){return this.patinando}segurar(t,e="none"){for(let i=this.maoDir.children.length-1;i>=0;i--)this.maoDir.remove(this.maoDir.children[i]);this.pose=t?e:"none",t&&this.maoDir.add(t)}get segurando(){return this.maoDir.children.length>0}setHoldingHands(t){this.maos=t}get holdingHands(){return this.maos!==0}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let i=this.targetFacing-this.group.rotation.y;if(i=Math.atan2(Math.sin(i),Math.cos(i)),this.group.rotation.y+=i*Math.min(1,t*14),this.beijo>.001){const c=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=c*.3,this.poeAltura(c*.045),this.armL.rotation.set(-c*.55,0,.08+c*.16),this.armR.rotation.set(-c*.55,0,-.08-c*.16),this.head.rotation.x=c*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.deitado){this.phase+=t*.55,this.legL.rotation.set(0,0,-.05),this.legR.rotation.set(0,0,.05);const c=Math.sin(this.phase)*.07,l=Math.sin(this.phase*.73)*.05;this.armL.rotation.set(l,0,-.14-c),this.armR.rotation.set(-l,0,.14+c),this.body.rotation.x=Math.sin(this.phase)*.02,this.head.rotation.x=Math.sin(this.phase*.6)*.025,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9;const c=Math.sin(this.phase*2.2)*.17;this.legL.rotation.x=-Math.PI/2+.06+c,this.legR.rotation.x=-Math.PI/2-.02-c,this.armL.rotation.set(-.25,0,-.34),this.armR.rotation.set(-.2,0,.34),this.maos!==0&&(this.maos<0?this.armL:this.armR).rotation.set(.12,0,Jl*.8*this.maos),this.body.rotation.x=-.05,this.poeAltura(Math.sin(this.phase)*.012),this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const c=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+c*.9,this.armR.rotation.x=-1.1-c*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=c*.28,this.legR.rotation.x=-c*.28,this.body.rotation.x=.16,this.poeAltura(Math.sin(this.phase)*.03),this.head.rotation.x=-.14;return}const s=e>.05,o=this.patinando?.9+e*.33:3.2+e*1.9;this.phase+=t*(s?o:1.4);const a=s?this.patinando?Math.min(.34,.12+e*.06):Math.min(.62,.16+e*.14):.04,r=Math.sin(this.phase*(s?2:1));if(this.patinando){const c=s?Math.min(.28,.1+e*.04):.03;this.legL.rotation.z=-Math.max(0,r)*c*1.7,this.legR.rotation.z=Math.max(0,-r)*c*1.7,this.legL.rotation.x=s?r*a*.25:0,this.legR.rotation.x=s?-r*a*.25:0,this.body.rotation.z=r*c*.34;const l=.34+Math.abs(r)*.14;this.armL.rotation.x=s?-r*a*.9:0,this.armR.rotation.x=s?r*a*.9:0,this.armL.rotation.z=-l,this.armR.rotation.z=l}else this.legL.rotation.z=0,this.legR.rotation.z=0,this.body.rotation.z=0,this.legL.rotation.x=s?r*a:0,this.legR.rotation.x=s?-r*a:0,this.armL.rotation.x=s?-r*a*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=s?r*a*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08;if(this.maos!==0){const c=this.maos<0?this.armL:this.armR,l=this.maos<0?this.armR:this.armL;c.rotation.z=Jl*this.maos,c.rotation.x=-.1,l.rotation.x*=.5}if(this.aplicarPose(),this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const c=Math.sin((1-this.bounce)*Math.PI)*.28;this.poeAltura(c),this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const c=s?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.poeAltura(c),this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=s?this.patinando?.16:.06:0,this.head.rotation.x=s?-.05:Math.sin(this.phase*.6)*.03}poeAltura(t){this.body.position.y=t+this.altoDoPatins*(this.patinando?1:0)}aplicarPose(){if(this.pose==="none"||this.maos>0){this.maoDir.rotation.set(0,0,0),this.maoDir.position.x=0;return}const t=N1[this.pose];this.armR.rotation.x=t.bracoX+this.armR.rotation.x*t.balanco,this.armR.rotation.z=t.bracoZ,this.maoDir.rotation.set(-this.armR.rotation.x,0,t.itemZ-this.armR.rotation.z),this.maoDir.position.x=t.itemX}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class z1{renderer;cena=new Ih;camera=new sn(30,1,.1,20);pedestal=new ot;rig=null;spec=null;giro=0;alvo=0;constructor(t){this.renderer=new $h({canvas:t,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.cena.add(this.pedestal);const e=new Wh(16777215,8952234,1.5);this.cena.add(e);const i=new Nr(16774368,1.5);i.position.set(3,5,4),this.cena.add(i);const s=new Nr(12572927,.5);s.position.set(-3,2,-3),this.cena.add(s)}mostrar(t){if(this.spec?.id===t.id)return;this.rig&&(this.pedestal.remove(this.rig.group),this.rig.dispose()),this.spec=t,this.rig=new Xr(t),this.pedestal.add(this.rig.group);const e=t.height;this.rig.group.position.y=-e*.5,this.camera.position.set(0,e*.04,e*2.28),this.camera.lookAt(0,0,0)}vestir(t){this.rig?.vestirRoupa(t)}girar(t){this.alvo+=t}update(t){this.rig&&(this.giro+=(this.alvo-this.giro)*Math.min(1,t*9),this.pedestal.rotation.y=this.giro,this.rig.update(t,0))}desenhar(){if(!this.rig)return;const t=this.renderer.domElement,e=t.clientWidth,i=t.clientHeight;e<2||i<2||((t.width!==e||t.height!==i)&&this.renderer.setSize(e,i,!1),this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.render(this.cena,this.camera))}dispose(){this.rig?.dispose(),this.rig=null,this.spec=null,this.renderer.dispose()}}class F1{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;if(!this.enabled){this.hot=!1,this.pulse=0,this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const i=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(i*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(i*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}class O1{constructor(t){this.game=t}root=new ot;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,i,s,o=0){return t.position.set(e,i,s),t.rotation.y=o,t}chaoAcimaDeOutro(t){return(t??0)>0}ground(t){const e=new Ue(t.width,t.depth,1,1),i=this.chaoAcimaDeOutro(t.y),s=new y(e,A(t.color,{decal:i}));return s.rotation.x=-Math.PI/2,s.position.set(t.x??0,t.y??0,t.z??0),i?this.decalar(s):(s.receiveShadow=!0,this.root.add(s),s)}groundWithHoles(t){const e=t.width/2,i=t.depth/2,s=new Zo;s.moveTo(-e,-i),s.lineTo(e,-i),s.lineTo(e,i),s.lineTo(-e,i),s.closePath();for(const r of t.holes){const c=new Lr,l=r.x-r.width/2,h=r.x+r.width/2,u=-r.z-r.depth/2,d=-r.z+r.depth/2;c.moveTo(l,u),c.lineTo(h,u),c.lineTo(h,d),c.lineTo(l,d),c.closePath(),s.holes.push(c)}const o=this.chaoAcimaDeOutro(t.y),a=new y(new vc(s),A(t.color,{decal:o}));return a.rotation.x=-Math.PI/2,a.position.set(t.x??0,t.y??0,t.z??0),o?this.decalar(a):(a.receiveShadow=!0,this.root.add(a),a)}decalar(t){return t.renderOrder=++this.decalque,t.receiveShadow=!0,this.root.add(t),t}patch(t,e,i,s,o,a=0,r=.01){const c=new y(new Ue(i,s),A(o,{decal:!0}));return c.rotation.set(-Math.PI/2,0,0),c.rotation.z=a,c.position.set(t,r,e),this.decalar(c)}disc(t,e,i,s,o=.01){const a=new y(new Ns(i,28),A(s,{decal:!0}));return a.rotation.x=-Math.PI/2,a.position.set(t,o,e),this.decalar(a)}ring(t,e,i,s,o,a=.01){const r=new gc(Math.max(0,i-s),i,40),c=new y(r,A(o,{decal:!0}));return c.rotation.x=-Math.PI/2,c.position.set(t,a,e),this.decalar(c)}blockBox(t,e,i,s,o=0){this.colliders.push({kind:"box",x:t,z:e,hw:i,hd:s,rot:o})}blockCircle(t,e,i){this.colliders.push({kind:"circle",x:t,z:e,r:i})}blockFrom(t,e=.9){const i=new rs().setFromObject(t),s=i.getSize(new N),o=i.getCenter(new N);this.blockBox(o.x,o.z,s.x/2*e,s.z/2*e,0)}setBounds(t,e,i,s){this.bounds={minX:t,minZ:e,maxX:i,maxZ:s}}wall(t,e,i,s,o=3,a=15984595,r=.3){const c=i-t,l=s-e,h=Math.hypot(c,l),u=Math.atan2(l,c),d=new y(new G(h,o,r),A(a));return d.position.set((t+i)/2,o/2,(e+s)/2),d.rotation.y=-u,this.add(d),this.blockBox((t+i)/2,(e+s)/2,h/2,r/2,-u),d}interact(t){const e=new F1(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}banco(t,e,i=0,s){const o=this.add(this.place(Qh(s),t,0,e,i));this.blockBox(t,e,.95,.35,i);const a=new ye;a.position.set(t,0,e),a.rotation.y=i+Math.PI,this.root.add(a);const r=new ye;r.position.set(t,.9,e),this.root.add(r);const c=.06,l=.46;return this.interact({id:`banco:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:1.9,label:"Sentar no banco",icon:"🪑",highlight:o,onInteract:async h=>{h.lockPlayer(!0),h.ridePlayer(a,new N(-l,c,.02),1,Math.PI),h.rideCompanion(a,new N(l,c,.02),1,Math.PI),h.setSitting(!0),h.focusCamera(r),await h.wait(.5),await h.say(["Senta aqui um pouco."],h.companionName()),await h.say(["Só um pouquinho."],h.playerName());let u=0;for(;u===0;)u=await h.ask("Ficar mais um pouco?",["Ficar","Levantar"]),u===0&&await h.wait(4);h.setSitting(!1),h.focusCamera(null);const d=i,p=Math.sin(d)*1.5,g=Math.cos(d)*1.5;h.releasePlayer(t+p-Math.cos(d)*.5,e+g+Math.sin(d)*.5,d),h.releaseCompanion(t+p+Math.cos(d)*.5,e+g-Math.sin(d)*.5,d),h.lockPlayer(!1)}}),o}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}const Mn={x:.5,y:.44},xn=n=>1/(1+8.5*n),B1=(n,t,e,i,s)=>{const o=xn(e);return{x:(Mn.x+n*o)*i,y:(Mn.y+t*o)*s}},ln=.56,$l=-.44,_n=.62,Va=-.28,Kl=-.34,yn={ariCabelo:"#8f5c33",ariRoupa:"#e8e2d6",ariPele:"#f2cfb2",renanCabelo:"#1f1712",renanRoupa:"#1b1c22",renanPele:"#efc8a4",perna:"#15161c"},Ae={ceuTopo:"#0a1120",ceuBaixo:"#2b3d58",vigaFrente:"#6d4028",vigaBaixo:"#3c2115",longarina:"#7d4d31",tijolo:"#b1613f",tijoloSombra:"#7e4029",tijoloJunta:"#cd8461",base:"#8a8781",chaoPerto:"#8b7a51",chaoLonge:"#4a4536",junta:"#6f6650",tatil:"#77746b",tatilRisco:"#95928a",folhaClara:"#2c5741",folhaEscura:"#16301f",fio:"#5d5346",luz:"#ffd489",luzNucleo:"#fff8e6"},ge={ceuTopo:"#1f74c8",ceuBaixo:"#a9d9f2",mataLonge:"#4d7f4a",mataPerto:"#356b39",gramaAlta:"#8fae55",gramaBaixa:"#a8bd68",sombra:"#5f7a3c",inflavelClaro:"#eeeae2",inflavelCinza:"#cfd2d4",inflavelRosa:"#f06a9c",bannerXadrez:"#3f8fd1",bannerFundo:"#fbfaf6",bannerRosa:"#ef5ba1",bannerTexto:"#e0357f",gato:"#fdfcf9",gatoTraco:"#3b3630",lacoVermelho:"#e0342f",verdeBrinquedo:"#57bd45",verdeBrinquedoFundo:"#3f9a32",azulBrinquedo:"#3aa9e8",azulBrinquedoFundo:"#2681bd",amareloBrinquedo:"#f5c518",roxoBrinquedo:"#8f5cc4",torre:"#f5822c",grade:"#3f6fbd"},Ql=["#e8442f","#f5c518","#3d9be0","#f07ab0","#f7f4ec","#6fc04a","#f5822c","#a069c4"];function k1(n,t,e,i,s){n.strokeStyle=s,n.lineCap="round",n.lineWidth=Math.max(1.2,i*.04),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(t-i*.07,e-i*.55,t,e-i),n.stroke();const o=e-i;n.lineWidth=Math.max(1.6,i*.1);for(let a=0;a<9;a++){const r=-Math.PI*.94+a/8*Math.PI*.88,c=i*(.42+.14*Math.sin(a*1.7));n.beginPath(),n.moveTo(t,o+i*.04),n.quadraticCurveTo(t+Math.cos(r)*c*.62,o+Math.sin(r)*c*.58,t+Math.cos(r)*c,o+Math.sin(r)*c+c*.34),n.stroke()}}function V1(n,t,e,i,s){if(i>1.4){const o=n.createRadialGradient(t,e,0,t,e,i*6);o.addColorStop(0,`rgba(255, 206, 128, ${.58*s})`),o.addColorStop(.45,`rgba(255, 178, 96, ${.18*s})`),o.addColorStop(1,"rgba(255, 170, 90, 0)"),n.fillStyle=o,n.beginPath(),n.arc(t,e,i*6,0,Math.PI*2),n.fill()}n.fillStyle=Ae.luz,n.globalAlpha=s,n.beginPath(),n.arc(t,e,i,0,Math.PI*2),n.fill(),n.fillStyle=Ae.luzNucleo,n.beginPath(),n.arc(t,e,i*.45,0,Math.PI*2),n.fill(),n.globalAlpha=1}function qo(n,t,e,i,s,o,a,r){const c=i*.3;n.strokeStyle=yn.perna,n.lineWidth=i*.075,n.lineCap="round";for(const l of[-1,1])n.beginPath(),n.moveTo(t,e-i*.42),n.lineTo(t+l*c*.26*a,e),n.stroke();if(r){n.strokeStyle=r,n.lineWidth=i*.055;for(const l of[-1,1])n.beginPath(),n.moveTo(t+l*c*.42,e-i*.72),n.lineTo(t+l*c*.52,e-i*.44),n.stroke()}n.fillStyle=s,n.beginPath(),n.roundRect(t-c/2,e-i*.78,c,i*.4,c*.32),n.fill(),n.fillStyle=o,n.beginPath(),n.arc(t,e-i*.87,i*.11,0,Math.PI*2),n.fill()}function Ha(n,t,e,i,s,o,a,r,c,l){const h=(t+i)/2,u=(e+s)/2+o,d=p=>{const g=1-p;return{x:g*g*t+2*g*p*h+p*p*i,y:g*g*e+2*g*p*u+p*p*s}};n.strokeStyle="rgba(240, 240, 235, 0.85)",n.lineWidth=Math.max(.8,a*.05),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(h,u,i,s),n.stroke();for(let p=0;p<r;p++){const g=(p+.5)/r,v=d(Math.max(0,g-.012)),m=d(Math.min(1,g+.012)),f=m.x-v.x,w=m.y-v.y,M=Math.hypot(f,w)||1,x=-w/M,C=f/M,P=Math.sin(l*1.1+p*.8)*a*.06;n.fillStyle=Ql[(p+c)%Ql.length],n.beginPath(),n.moveTo(v.x,v.y),n.lineTo(m.x,m.y),n.lineTo((v.x+m.x)/2-x*a+P,(v.y+m.y)/2-C*a),n.closePath(),n.fill()}}function H1(n,t,e,i){n.fillStyle=ge.gato;for(const s of[-1,1])n.beginPath(),n.moveTo(t+s*i*.92,e-i*.28),n.lineTo(t+s*i*.62,e-i*1.15),n.lineTo(t+s*i*.16,e-i*.6),n.closePath(),n.fill();n.beginPath(),n.ellipse(t,e,i,i*.82,0,0,Math.PI*2),n.fill(),n.fillStyle=ge.lacoVermelho;for(const s of[-1,1])n.beginPath(),n.ellipse(t+i*(.78+s*.24),e-i*.5,i*.26,i*.2,0,0,Math.PI*2),n.fill();n.fillStyle=ge.gatoTraco;for(const s of[-1,1])n.beginPath(),n.ellipse(t+s*i*.36,e-i*.02,i*.09,i*.13,0,0,Math.PI*2),n.fill();n.fillStyle=ge.amareloBrinquedo,n.beginPath(),n.ellipse(t,e+i*.14,i*.11,i*.08,0,0,Math.PI*2),n.fill(),n.strokeStyle=ge.gatoTraco,n.lineWidth=Math.max(.5,i*.05);for(const s of[-1,1])for(let o=-1;o<=1;o++)n.beginPath(),n.moveTo(t+s*i*.6,e+i*.1+o*i*.14),n.lineTo(t+s*i*1.02,e+i*.04+o*i*.2),n.stroke()}function To(n,t,e,i,s,o,a){const r=Math.min(s*.42,i*.2);n.fillStyle=o,n.beginPath(),n.roundRect(t,e,i,s,r),n.fill(),n.strokeStyle=a,n.lineWidth=Math.max(.7,s*.045);const c=Math.max(2,Math.round(i/(s*.75)));for(let l=1;l<c;l++){const h=t+i*l/c;n.beginPath(),n.moveTo(h,e+s*.14),n.lineTo(h,e+s*.86),n.stroke()}n.strokeStyle="rgba(255, 255, 255, 0.34)",n.lineWidth=Math.max(.8,s*.07),n.beginPath(),n.moveTo(t+r,e+s*.16),n.lineTo(t+i-r,e+s*.16),n.stroke()}function G1(n,t,e,i){const s=(M,x,C)=>B1(M,x,C,t,e),o=Mn.y*e,a=n.createLinearGradient(0,0,0,o);a.addColorStop(0,Ae.ceuTopo),a.addColorStop(1,Ae.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,o);const r=n.createLinearGradient(0,o,0,e);r.addColorStop(0,Ae.chaoLonge),r.addColorStop(1,Ae.chaoPerto),n.fillStyle=r,n.fillRect(0,o,t,e-o);const c=n.createRadialGradient(Mn.x*t,e*.86,0,Mn.x*t,e*.86,t*.62);c.addColorStop(0,"rgba(255, 196, 122, 0.3)"),c.addColorStop(1,"rgba(255, 190, 120, 0)"),n.fillStyle=c,n.fillRect(0,o,t,e-o),n.strokeStyle=Ae.junta;for(let M=0;M<26;M++){const x=M*.036,C=s(-_n,ln,x),P=s(_n,ln,x);n.globalAlpha=Math.min(.42,.42*xn(x)*3.2),n.lineWidth=Math.max(.5,3*xn(x)),n.beginPath(),n.moveTo(C.x,C.y),n.lineTo(P.x,P.y),n.stroke()}n.globalAlpha=.22,n.lineWidth=1;for(let M=-6;M<=6;M++){if(M===0)continue;const x=s(M*.1,ln,0);n.beginPath(),n.moveTo(Mn.x*t,Mn.y*e),n.lineTo(x.x,x.y),n.stroke()}n.globalAlpha=1;const l=s(-.05,ln,0),h=s(.05,ln,0),u=s(-.05,ln,.97),d=s(.05,ln,.97);n.fillStyle=Ae.tatil,n.beginPath(),n.moveTo(l.x,l.y),n.lineTo(h.x,h.y),n.lineTo(d.x,d.y),n.lineTo(u.x,u.y),n.closePath(),n.fill(),n.strokeStyle=Ae.tatilRisco;for(let M=0;M<22;M++){const x=M*.042,C=s(-.038,ln,x),P=s(.038,ln,x);n.lineWidth=Math.max(.5,3.2*xn(x)),n.beginPath(),n.moveTo(C.x,C.y),n.lineTo(P.x,P.y),n.stroke()}for(let M=5;M>=0;M--){const x=.12+M*.15,C=xn(x);for(const P of[-1,1]){const I=s(P*(_n+.13),ln,x);k1(n,I.x,I.y,e*.85*C,M%2===0?Ae.folhaEscura:Ae.folhaClara)}}for(let M=7;M>=0;M--){const x=M*.115,C=xn(x),P=t*.085*C;for(const I of[-1,1]){const T=s(I*_n,ln,x),b=s(I*_n,Va,x),_=T.x-P/2;n.fillStyle=Ae.tijolo,n.fillRect(_,b.y,P,T.y-b.y),n.fillStyle=Ae.tijoloSombra,n.fillRect(I<0?_+P*.68:_,b.y,P*.32,T.y-b.y);const D=(T.y-b.y)*.09;if(n.fillStyle=Ae.base,n.fillRect(_-P*.06,T.y-D,P*1.12,D),x<.3){n.strokeStyle=Ae.tijoloJunta,n.lineWidth=Math.max(.5,1.6*C),n.globalAlpha=.5;const z=T.y-D;for(let B=1;B<14;B++){const V=b.y+(z-b.y)*B/14;n.beginPath(),n.moveTo(_,V),n.lineTo(_+P,V),n.stroke()}n.globalAlpha=1}}}n.strokeStyle=Ae.longarina,n.lineCap="butt";for(const M of[-1,1]){const x=s(M*_n*1.05,Va,0),C=s(M*_n*1.05,Va,.95);n.lineWidth=t*.03,n.beginPath(),n.moveTo(x.x,x.y),n.lineTo(C.x,C.y),n.stroke()}for(let M=17;M>=0;M--){const x=M*.052,C=xn(x),P=s(-_n*1.16,$l,x),I=s(_n*1.16,$l,x),T=Math.max(1,e*.05*C);n.fillStyle=Ae.vigaFrente,n.fillRect(P.x,P.y,I.x-P.x,T),n.fillStyle=Ae.vigaBaixo,n.fillRect(P.x,P.y+T*.62,I.x-P.x,T*.38)}const p=9;for(let M=0;M<p;M++){const x=.02+M*.095,C=x+.095,P=M%2===0?-1:1,I=s(P*_n*1.02,Kl,x),T=s(-P*_n*1.02,Kl,C),b=e*.06*xn(x),_=(I.x+T.x)/2,D=(I.y+T.y)/2+b;n.strokeStyle=Ae.fio,n.lineWidth=Math.max(.4,1.8*xn(x)),n.beginPath(),n.moveTo(I.x,I.y),n.quadraticCurveTo(_,D,T.x,T.y),n.stroke();const z=7;for(let B=0;B<=z;B++){const V=B/z,H=1-V,J=H*H*I.x+2*H*V*_+V*V*T.x,st=H*H*I.y+2*H*V*D+V*V*T.y,$=xn(x+(C-x)*V),at=.82+.18*Math.sin(i*1.6+M*2.1+B*.9);V1(n,J,st+e*.012*$,Math.max(.7,t*.015*$),at)}}const g=n.createRadialGradient(Mn.x*t,Mn.y*e-e*.02,0,Mn.x*t,Mn.y*e-e*.02,t*.085);g.addColorStop(0,"rgba(255, 232, 182, 0.9)"),g.addColorStop(.35,"rgba(255, 196, 118, 0.34)"),g.addColorStop(1,"rgba(255, 180, 100, 0)"),n.fillStyle=g,n.fillRect(0,0,t,e);const v=Math.sin(i*2.4),m=s(0,ln,.66),f=e*.5*xn(.66);qo(n,m.x-f*.34,m.y,f,yn.ariRoupa,yn.ariCabelo,v),qo(n,m.x+f*.34,m.y,f,yn.renanRoupa,yn.renanCabelo,-v),n.fillStyle="rgba(255, 176, 96, 0.07)",n.fillRect(0,0,t,e);const w=n.createRadialGradient(t/2,e*.48,t*.2,t/2,e*.48,t*.78);w.addColorStop(0,"rgba(0, 0, 0, 0)"),w.addColorStop(1,"rgba(6, 9, 16, 0.62)"),n.fillStyle=w,n.fillRect(0,0,t,e)}function q1(n,t,e,i){const o=.585*e,a=n.createLinearGradient(0,0,0,o);a.addColorStop(0,ge.ceuTopo),a.addColorStop(1,ge.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,o);for(const[w,M,x,C]of[[-.05,.5,.15,ge.mataLonge],[.42,1.05,.125,ge.mataLonge],[-.05,1.05,.08,ge.mataPerto]]){n.fillStyle=C,n.beginPath(),n.moveTo(w*t,o);for(let P=w;P<=M;P+=.035){const I=o-x*e*(.6+.4*Math.abs(Math.sin(P*27)));n.lineTo(P*t,I)}n.lineTo(M*t,o),n.closePath(),n.fill()}const r=.235*e;n.fillStyle=ge.inflavelClaro,n.beginPath(),n.moveTo(0*t,o),n.lineTo(.245*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,o),n.closePath(),n.fill(),n.fillStyle=ge.inflavelCinza,n.beginPath(),n.moveTo(0*t,o),n.lineTo(.245*t,r),n.lineTo(.315*t,r),n.lineTo(.14*t,o),n.closePath(),n.fill(),n.fillStyle=ge.inflavelCinza,n.beginPath(),n.moveTo(.235*t,r+.012*e),n.lineTo(.325*t,.175*e),n.lineTo(.412*t,r+.012*e),n.closePath(),n.fill(),n.fillStyle=ge.inflavelRosa,n.beginPath(),n.moveTo(.055*t,o-.075*e),n.lineTo(.47*t,o-.075*e),n.lineTo(.485*t,o-.035*e),n.lineTo(.04*t,o-.035*e),n.closePath(),n.fill(),n.fillStyle="rgba(112, 126, 138, 0.34)",n.beginPath(),n.moveTo(.325*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,o),n.lineTo(.33*t,o),n.closePath(),n.fill(),n.fillStyle="rgba(84, 95, 105, 0.5)",n.beginPath(),n.roundRect(.135*t,o-.075*e,.145*t,.04*e,.014*t),n.fill(),n.strokeStyle="rgba(138, 148, 156, 0.75)",n.lineWidth=Math.max(.8,e*.0045);for(let w=1;w<6;w++){const M=w/6;n.beginPath(),n.moveTo((.245+M*.155)*t,r),n.lineTo((0+M*.5)*t,o),n.stroke()}const c=.42*t,l=.425*e,h=.62*t,u=.075*e;n.fillStyle=ge.bannerFundo,n.fillRect(c,l,h,u),n.fillStyle=ge.bannerXadrez;const d=u/3;for(let w=0;w<h;w+=d)for(let M=0;M<u;M+=d)(w<d*2.2||w>h-d*5.5)&&Math.round(w/d+M/d)%2===0&&n.fillRect(c+w,l+M,d,d);n.fillStyle=ge.bannerRosa,n.fillRect(c+h-d*4.4,l,d*4.4,u),n.fillStyle="rgba(255, 255, 255, 0.85)";for(let w=0;w<3;w++)n.fillRect(c+h-d*4,l+u*(.25+w*.2),d*3.4,u*.08);H1(n,c+h-d*6.4,l+u*.46,u*.4),n.fillStyle=ge.bannerTexto,n.font=`900 ${Math.round(u*.42)}px system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText("ARRAIÁ",c+h*.42,l+u*.5),n.textAlign="left",n.textBaseline="alphabetic",To(n,.05*t,o-.055*e,.13*t,.055*e,ge.roxoBrinquedo,"#6f45a0"),To(n,.36*t,o-.085*e,.12*t,.085*e,ge.azulBrinquedo,ge.azulBrinquedoFundo),To(n,.47*t,o-.05*e,.06*t,.05*e,ge.amareloBrinquedo,"#cf9f0e"),To(n,.52*t,o-.075*e,.5*t,.075*e,ge.verdeBrinquedo,ge.verdeBrinquedoFundo),n.strokeStyle=ge.grade,n.lineWidth=Math.max(.7,e*.0035);for(let w=0;w<9;w++){const M=(.19+w*.019)*t;n.beginPath(),n.moveTo(M,o-.035*e),n.lineTo(M,o),n.stroke()}n.beginPath(),n.moveTo(.185*t,o-.032*e),n.lineTo(.36*t,o-.032*e),n.stroke(),n.strokeStyle=ge.torre,n.lineWidth=Math.max(1.2,t*.008),n.beginPath(),n.moveTo(.9*t,o+.3*e),n.lineTo(.955*t,o-.09*e),n.moveTo(1.02*t,o+.3*e),n.lineTo(.985*t,o-.09*e),n.stroke(),n.lineWidth=Math.max(.8,t*.005);for(let w=0;w<7;w++){const M=w/7,x=o-.09*e+M*.39*e,C=o-.09*e+(w+1)/7*.39*e,P=.955+M*(.9-.955),I=.985+M*(1.02-.985),T=.955+(w+1)/7*(.9-.955),b=.985+(w+1)/7*(1.02-.985);n.beginPath(),n.moveTo(P*t,x),n.lineTo(b*t,C),n.moveTo(I*t,x),n.lineTo(T*t,C),n.stroke()}const p=n.createLinearGradient(0,o,0,e);p.addColorStop(0,ge.gramaAlta),p.addColorStop(1,ge.gramaBaixa),n.fillStyle=p,n.fillRect(0,o,t,e-o),n.fillStyle="#c6b184",n.beginPath(),n.moveTo(0,o),n.lineTo(t,o),n.lineTo(t,o+.028*e);for(let w=1;w>=0;w-=.05)n.lineTo(w*t,o+(.026+.008*Math.sin(w*21))*e);n.closePath(),n.fill();const g=n.createRadialGradient(.44*t,.92*e,0,.44*t,.92*e,.62*t);g.addColorStop(0,"rgba(78, 100, 50, 0.34)"),g.addColorStop(.6,"rgba(78, 100, 50, 0.16)"),g.addColorStop(1,"rgba(78, 100, 50, 0)"),n.fillStyle=g,n.fillRect(0,o,t,e-o),n.fillStyle=ge.sombra,n.globalAlpha=.16;for(const[w,M,x,C,P]of[[.2,.87,.16,.045,.2],[.66,.9,.2,.05,-.15],[.38,.99,.3,.06,.05],[.86,.83,.13,.035,.3]])n.beginPath(),n.ellipse(w*t,M*e,x*t,C*e,P,0,Math.PI*2),n.fill();n.globalAlpha=1;const v=Math.sin(i*2.1),m=.185*e;qo(n,.4*t,.86*e,m,yn.ariRoupa,yn.ariCabelo,v,yn.ariPele),qo(n,.49*t,.86*e,m,yn.renanRoupa,yn.renanCabelo,-v,yn.renanPele),Ha(n,-.04*t,.1*e,1.04*t,.045*e,.028*e,.05*e,15,0,i),Ha(n,-.04*t,.235*e,1.04*t,.145*e,.03*e,.045*e,16,3,i),Ha(n,-.04*t,.33*e,1.04*t,.3*e,.026*e,.038*e,18,6,i),n.fillStyle="rgba(255, 236, 180, 0.09)",n.fillRect(0,0,t,e);const f=n.createRadialGradient(t/2,e*.5,t*.3,t/2,e*.5,t*.85);f.addColorStop(0,"rgba(0, 0, 0, 0)"),f.addColorStop(1,"rgba(20, 30, 40, 0.3)"),n.fillStyle=f,n.fillRect(0,0,t,e)}const jr=[{id:"o-pedido",titulo:"O pedido",lugar:"onde a gente começou, oficialmente",legenda:"As luzinhas iam até onde a gente não enxergava mais. A gente foi junto.",proporcao:3/4,pintar:G1},{id:"arraia",titulo:"O arraiá da Hello Kitty",lugar:"Parque Villa-Lobos, em junho",legenda:"Um campo inteiro de brinquedo inflável, e a gente parado olhando com cara de criança.",proporcao:3/4,pintar:q1}];class W1{constructor(t,e,i,s=Object.keys(e)[0]){this.root=t,this.scenes=e,this.dupla=i,this.cenaInicial=s,this.renderer=new $h({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=lh,t.appendChild(this.renderer.domElement),this.ui=new l1(t),this.previa=new z1(this.ui.canvasDoBoneco()),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onTouchGirar=a=>this.input.tapGirar(a),this.ui.onEscolherSlot=a=>this.setActiveHandSlot(a),this.ui.onMoverItem=(a,r)=>this.moveItem(a,r),this.ui.onDescartar=a=>this.descartarDaVaga(a),this.ui.onAbrirMochila=()=>this.pintarMochila(),this.ui.onAbrirArmario=()=>this.pintarArmario(),this.ui.onGirarBoneco=a=>this.previa.girar(a),this.ui.onTirarParte=a=>{this.tirarPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onVestirPeca=a=>{this.vestirPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onAbrirVestiario=()=>this.pintarVestiario(),this.ui.onAlternarOculos=()=>{const a=this.playerId(),r=fn.indexOf("cabeca");(this.save.vestiveis(a)[r]?.id===Jt.oculosEscuros.id?this.tirarPeca(a,r):this.vestirPeca(a,Jt.oculosEscuros.id))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onEscolherBermuda=a=>{const r=this.playerId(),c=fn.indexOf("pernas");(this.save.vestiveis(r)[c]?.id===a?this.tirarPeca(r,c):this.vestirPeca(r,a))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onTouchHold=a=>this.input.setVirtualDown("KeyF",a),this.ui.onRestart=()=>this.restart(),this.ui.som=a=>this.audio.play(a),this.ui.onToggleSom=()=>{this.audio.setMudo(this.audio.ligado),this.ui.setSom(this.audio.ligado),this.audio.ligado&&this.audio.play("menu")},this.ui.setSom(this.audio.ligado),this.input=new _v(this.renderer.domElement),this.hemi=new Wh(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new Nr(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const o=this.sun.shadow.camera;o.left=-22,o.right=22,o.top=22,o.bottom=-22,o.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new h1(new Xr(i[0])),this.scene.add(this.player.object),this.coracoes=new f1(this.scene),this.beijo=new v1(this.coracoes),this.beijo.onSom=a=>this.audio.play(a),this.maos=new w1(this.coracoes),this.maos.onSom=a=>this.audio.play(a),this.parceiro=new u1(new Xr(i[1]??i[0])),this.parceiro.setVisible(i.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new Ih;iso=new vv;input;ui;save=new yc;previa;player;parceiro;clock=new Uf;coracoes;beijo;maos;audio=new L1;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;naMao=new Map;trilha=0;elapsed=0;shadowSpan=0;traje="normal";moveDir=new N;camAim=new N;camOmbro=null;async start(t,e){const i=t??(this.scenes[this.save.scene]?this.save.scene:this.cenaInicial);this.build(i,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}restart(){this.save.reset(),this.ui.setMemories(this.save.memories),this.player.rig.spec.id!==this.dupla[0].id&&this.swapCharacters(),this.ui.showHints(),this.goTo(this.cenaInicial),this.audio.play("recomecar"),this.ui.toast("Do começo, então","🔄")}build(t,e){const i=this.scenes[t];if(!i)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const s=new O1(this);s.setSeed(X1(t)),i.build(s),this.scene.add(s.root),this.current={def:i,world:s},this.applyAmbient(i.ambient);const o=e&&i.entries?.[e]||i.spawn;this.player.teleport(o.x,o.z,o.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const a=(o.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(o.x+Math.sin(a)*1.3,o.z+Math.cos(a)*1.3,o.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.maos.soltar(this.player,this.parceiro),this.coracoes.limpar(),this.podeBeijar=!1,this.camOmbro=null,this.ui.showPlacar(null),this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(i.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(i.name,i.subtitle),this.audio.setClima(t),this.migrarPremios(),this.aplicarPremios(),this.save.scene=t}aplicarPremios(){this.sincronizarVestiveis()}migrarPremios(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id;this.save.flag(`chapeu-ping-pong:${e}`)&&(this.save.achouItem(e,Jt.chapeuPingPong.id)||this.save.vestir(e,Jt.chapeuPingPong))}}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new ae(t.sky),this.scene.fog=t.fog!==void 0?new hc(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const i=this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen||this.ui.memoriasOpen||this.transitioning;this.input.blocked=i||this.player.locked,this.input.justPressed("KeyJ")&&!this.ui.menuOpen&&this.ui.toggleJournal(),(this.input.justPressed("KeyI")||this.input.justPressed("Tab"))&&!this.ui.menuOpen&&!this.ui.dialogueOpen&&(this.ui.armarioOpen?this.ui.fecharArmario():this.ui.mochilaOpen?this.ui.closeMochila():this.abrirMochila()),this.ui.armarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharArmario(),this.ui.vestiarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharVestiario(),this.ui.memoriasOpen&&this.input.justPressed("Escape")&&this.ui.fecharMemorias(),this.ui.memoriasOpen&&(this.input.justPressed("ArrowLeft")&&this.ui.folhear(-1),this.input.justPressed("ArrowRight")&&this.ui.folhear(1)),(this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen?!this.ui.dialogueOpen&&!this.ui.menuOpen&&!this.transitioning:!i)&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),i||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1)),!i&&!this.player.locked&&this.input.justPressed("KeyH")&&this.maoNaMao();const a=this.input.justPressed("KeyE")||this.input.justPressed("Space");a&&this.ui.handleAction()||(a&&!i&&this.hot&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.audio.play("interagir"),this.hot.trigger(this)):a&&!i&&this.podeBeijar&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)):a&&!i&&!this.player.locked&&this.maoNaMao()),this.beijo.update(t,this.player,this.parceiro),this.maos.update(t,this.player,this.parceiro);const r=this.input.move();this.iso.screenToWorld(r.x,r.y,this.moveDir);const c=this.player.position.clone();this.player.update(this.moveDir,t,e.colliders,e.bounds),this.ouvirPassos(c),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.coracoes.update(t),this.sincronizarMaos(),this.sincronizarVestiveis(),this.updateHot(e,t),this.updateBeijo();for(const u of e.updaters)u(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const l=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(l);const h=l/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*h,this.camAim.y+20*h,this.camAim.z+9*h),this.renderer.render(this.scene,this.camOmbro??this.iso.camera),this.ui.armarioOpen&&(this.previa.update(t),this.previa.desenhar()),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.ui.menuOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro)}maoNaMao(){this.maos.ativo?(this.maos.soltar(this.player,this.parceiro),this.audio.play("escolha")):this.maos.disponivel(this.player,this.parceiro)&&this.maos.ligar(this.player,this.parceiro)}ouvirPassos(t){if(this.player.riding||this.player.locked)return;const e=Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z);if(e<5e-4){this.trilha=0;return}this.trilha+=e;const i=this.player.submersion>.05?1.05:.62;this.trilha>=i&&(this.trilha=0,this.audio.play(this.player.submersion>.05?"nadar":"passo"))}updateHot(t,e){let i=null,s=1/0,o=-1/0;const a=this.player.position.x,r=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(a,r);l>c.radius||c.priority<o||c.priority===o&&l>=s||(i=c,s=l,o=c.priority)}i!==this.hot&&(this.hot?.setHot(!1),i?.setHot(!0),this.hot=i,i&&!this.player.locked?this.ui.showPrompt(i.icon,i.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,i){return this.ui.ask(t,e,i??this.player.name)}toast(t,e){this.audio.play("toast"),this.ui.toast(t,e)}som(t){this.audio.play(t)}goTo(t,e){this.transitioning||(this.transitioning=!0,this.audio.play("porta"),(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setCameraOmbro(t,e){if(!t){this.camOmbro=null;return}this.camOmbro||(this.camOmbro=new sn(58,window.innerWidth/window.innerHeight,.1,400)),this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.position.copy(t),e&&this.camOmbro.lookAt(e),this.camOmbro.updateProjectionMatrix()}pointer(){return this.input.pointer()}showPlacar(t){this.ui.showPlacar(t)}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}addItem(t,e=this.playerId()){const i=this.save.pegar(e,t);return i==="cheio"&&this.ui.toast("Mochila cheia","🎒"),(i==="mao"||i==="guardado")&&this.repintarMochila(),i}storeItem(t,e=this.playerId()){const i=this.save.guardar(e,t);return i!=="cheio"&&i!=="repetido"&&this.repintarMochila(),i}removeItem(t,e=this.playerId()){const i=this.save.largar(e,t);return i&&this.repintarMochila(),i}hasItem(t,e=this.playerId()){return this.save.achouItem(e,t)}getActiveHandItem(t=this.playerId()){return this.save.itemAtivo(t)}setActiveHandSlot(t,e=this.playerId()){this.save.setSlotAtivo(e,t),this.repintarMochila()}activeHandSlot(t=this.playerId()){return this.save.slotAtivo(t)}equipWearable(t,e=this.playerId()){const i=this.save.vestir(e,t);return i&&this.repintarMochila(),i}unequipWearable(t,e=this.playerId()){this.save.despir(e,t),this.repintarMochila()}moveItem(t,e,i=this.playerId()){const s=this.save.mover(i,t,e);return s&&this.repintarMochila(),s}handItems(t=this.playerId()){return this.save.maos(t)}wearables(t=this.playerId()){return this.save.vestiveis(t)}wardrobeItems(t=this.playerId()){return this.save.acervo(t)}descartarDaVaga(t){const e=this.playerId(),s=(t.lista==="mao"?this.save.maos(e):this.save.vestiveis(e))[t.indice];s&&(this.save.largar(e,s.id),this.audio.play("escolha"),this.ui.toast(`${s.nome} foi descartado`,"🗑"),this.pintarMochila())}repintarMochila(){this.ui.mochilaOpen&&this.pintarMochila()}pintarMochila(){const t=this.playerId();this.ui.renderMochila(this.save.maos(t),this.save.vestiveis(t),this.save.slotAtivo(t),this.player.name)}abrirMochila(){this.ui.toggleMochila()}sincronizarVestiveis(){for(const t of[this.player,this.parceiro]){const e=t.rig.spec.id,i=this.save.vestiveis(e),s=i.some(c=>c?.id===Jt.chapeuPingPong.id);t.rig.campeao!==s&&t.rig.setCampeao(s);const o=i.some(c=>c?.id===Jt.patins.id);t.patins=o,t.rig.setPatins(o);const a=this.save.loadout(e),r=fn.map(c=>a[c]??"").join("|");this.roupaAplicada.get(e)!==r&&(this.roupaAplicada.set(e,r),t.rig.vestirRoupa(a))}}sincronizarMaos(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id,i=this.save.itemAtivo(e),s=i?.id??null;this.naMao.get(e)!==s&&(this.naMao.set(e,s),t.segurar(s?a1(s):null,i?.holdPose??"none"))}}roupaAplicada=new Map;vestirPeca(t,e){const i=this.save.acervo(t).find(a=>a.id===e)??this.save.maos(t).find(a=>a?.id===e)??null;if(!i)return!1;const s=i.slot?fn.indexOf(i.slot):-1;if(s<0)return!1;const o=this.save.vestiveis(t)[s];return this.save.largar(t,e),o&&this.save.despir(t,s),this.save.vestir(t,i),o&&this.save.guardar(t,o),!0}tirarPeca(t,e){const i=this.save.vestiveis(t)[e];return i?(this.save.despir(t,e),this.save.guardar(t,i)==="cheio"?(this.save.vestir(t,i),this.ui.toast("Mochila cheia","🎒"),!1):!0):!1}abrirGuardaRoupa(){this.previa.mostrar(this.player.rig.spec),this.pintarArmario(),this.ui.abrirArmario()}pintarArmario(){const t=this.playerId(),e=this.save.vestiveis(t),i=[...this.save.acervo(t),...this.save.maos(t).filter(s=>s!==null&&s.tipo==="vestivel")];this.ui.renderArmario(e,i,this.player.name),this.previa.vestir(this.save.loadout(t))}abrirVestiario(){this.pintarVestiario(),this.ui.abrirVestiario()}pintarVestiario(){const t=this.playerId(),e=this.save.vestiveis(t),i=e[fn.indexOf("cabeca")],s=e[fn.indexOf("pernas")],o=a=>`#${a.toString(16).padStart(6,"0")}`;this.ui.renderVestiario({dono:this.player.name,oculos:i?.id===Jt.oculosEscuros.id,bermudas:au.filter(a=>this.save.achouItem(t,a.id)).map(a=>({id:a.id,nome:a.nome,cor:o(a.corBanho??16777215),faixa:a.estampaBanho===void 0?void 0:o(a.estampaBanho),vestida:s?.id===a.id}))})}abrirMemoria(t){const e=jr.findIndex(i=>i.id===t);e>=0&&this.ui.abrirMemorias(jr,e)}unlock(t){this.save.addMemory(t)&&(this.audio.play("memoria"),this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,i=Math.PI/4){this.player.teleport(t,e,i),this.parceiro.teleport(t-1.2,e-.4,i),this.iso.snapTo(this.player.chest)}get telaDeLeitura(){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.memoriasOpen}keyPressed(t){return this.telaDeLeitura||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.telaDeLeitura||this.player.locked?!1:this.input.isDown(t)}showCharge(t,e,i){this.audio.carga(t),this.ui.showCharge(t,e,i)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.riding?(this.player.object.updateWorldMatrix(!0,!1),this.player.object.getWorldPosition(new N)):this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}playerId(){return this.player.rig.spec.id}companionId(){return this.parceiro.rig.spec.id}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.riding?(this.parceiro.object.updateWorldMatrix(!0,!1),this.parceiro.object.getWorldPosition(new N)):this.parceiro.position.clone()}companionFacing(){return this.parceiro.rig.facing}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.maos.trocouCorpos(this.player,this.parceiro),this.audio.play("trocar"),this.ui.toast(`Agora você é ${this.player.name}`,"🔁"),this.ui.mochilaOpen&&this.pintarMochila(),this.ui.armarioOpen&&(this.previa.mostrar(this.player.rig.spec),this.pintarArmario()),this.ui.vestiarioOpen&&this.pintarVestiario()}submergePlayer(t){this.player.submersion=De.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=De.clamp(t,0,1)}rideCompanion(t,e,i=1,s=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(i),this.parceiro.rig.group.rotation.y=s,this.parceiro.rig.setFacing(s),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}holdCompanion(t,e){this.parceiro.hold(t,e)}setSitting(t){if(t&&this.audio.play("sentar"),this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t),!t){this.maos.ativo||(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0));return}const e=this.player.rig.group,i=this.parceiro.rig.group;e.updateWorldMatrix(!0,!1),i.updateWorldMatrix(!0,!1);const s=new N,o=new N;e.getWorldPosition(s),i.getWorldPosition(o);const r=new N(1,0,0).applyQuaternion(e.getWorldQuaternion(new as)).dot(o.sub(s))<0?-1:1;this.player.rig.setHoldingHands(r),this.parceiro.rig.setHoldingHands(r===1?-1:1)}setLying(t){t&&this.audio.play("sentar"),this.player.rig.setLying(t),this.parceiro.rig.setLying(t),!t&&!this.maos.ativo&&(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0))}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,i=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,i)}ridePlayer(t,e,i=1,s=Math.PI){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(i),this.player.rig.group.rotation.y=s,this.player.rig.setFacing(s),this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,i=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,i),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight),this.camOmbro&&(this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.updateProjectionMatrix())};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function X1(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Yr(n=3,t=2.2,e=S.rug){const i=new y(new G(n,.04,t),A(e));return i.position.y=.02,i.receiveShadow=!0,i}function j1(n=S.sofa,t=2.2){const e=new ot,i=new y(new G(t,.42,.9),A(n));i.position.y=.28,e.add(i);const s=new y(new G(t,.62,.24),A(n));s.position.set(0,.72,-.35),e.add(s);for(const a of[-1,1]){const r=new y(new G(.24,.5,.9),A(n));r.position.set(a*(t/2-.12),.62,0),e.add(r)}for(const[a,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new y(new nt(.05,.04,.14,6),A(S.woodDark));c.position.set(a*(t/2-.2),.07,r*.34),e.add(c)}const o=new y(new G(.36,.12,.34),A(S.flowerPink));return o.position.set(t/2-.5,.55,-.14),o.rotation.set(.9,.4,0),e.add(o),e}function Y1(){const n=new ot,t=new y(new G(1.2,.08,.7),A(S.wood));t.position.y=.46,n.add(t);for(const[e,i]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const s=new y(new nt(.04,.04,.46,6),A(S.woodDark));s.position.set(e*.5,.23,i*.27),n.add(s)}return n}function Z1(n=!1){const t=new ot,e=new y(new G(1.8,.5,.45),A(S.woodDark));e.position.y=.25,t.add(e);const i=new y(new G(1.5,.85,.08),A(2040361));i.position.y=.95,t.add(i);const s=new y(new Ue(1.36,.72),Xe(n?9426943:S.screen,1));return s.name="tela",s.position.set(0,.95,.05),t.add(s),t}function J1(n=2.1,t=1.2,e=S.woodDark){const i=new ot;i.userData.peca="estante";const s=.32,o=.04,a=new y(new G(t-o,n-.02,o),A(S.estanteFundo));a.position.set(0,n/2,-s/2-.005),i.add(a);for(const h of[-1,1]){const u=new y(new G(o,n,s),A(e));u.position.set(h*(t-o)/2,n/2,0),i.add(u)}const r=Math.max(2,Math.floor(n/.5)),c=n/r;for(let h=0;h<=r;h++){const u=new y(new G(t-o*2,o,s),A(e)),d=h===0?o/2:h===r?n-o/2:c*h;u.position.set(0,d,0),i.add(u)}const l=[S.metalRed,S.fabricBlue,S.gold,S.bush,S.flowerPink];for(let h=0;h<r;h++){const u=c*h+o/2,p=c*(h+1)-o/2-u;let g=-t/2+o+.03,v=0;const m=t/2-o-.03;for(;v<7;){const f=.05+(h*3+v*5)%4*.018,w=Math.min(p*.92,.26+(h+v*2)%4*.035);if(g+f>m)break;const M=v>=3&&g+f+w*.5>m,x=new y(new G(f,w,.17),A(l[(h*2+v)%l.length]));x.position.set(0,w/2,.02),x.userData.livro=!0;const C=new ot;C.position.set(g+f/2,u,0),M&&(C.rotation.z=-.42),C.add(x),i.add(C),g+=M?f+w*.42:f+.012,v++}}return i}function $1(n=S.fabricBlue){const t=new ot,e=new y(new G(1.5,.35,2.1),A(S.woodDark));e.position.y=.2,t.add(e);const i=new y(new G(1.44,.24,2),A(16184040));i.position.y=.49,t.add(i);const s=new y(new G(1.5,.14,1.35),A(n));s.position.set(0,.62,.3),t.add(s);const o=new y(new G(1,.16,.4),A(16777215));o.position.set(0,.66,-.72),t.add(o);const a=new y(new G(1.55,.7,.12),A(S.wood));return a.position.set(0,.6,-1.06),t.add(a),t}function K1(){const n=new ot,t=new y(new G(1.6,.08,.7),A(S.wood));t.position.y=.74,n.add(t);for(const o of[-.72,.72]){const a=new y(new G(.08,.74,.66),A(S.woodDark));a.position.set(o,.37,0),n.add(a)}const e=new y(new G(.8,.5,.06),A(2830136));e.position.set(0,1.08,-.18),n.add(e);const i=new y(new Ue(.72,.42),Xe(10475775));i.position.set(0,1.08,-.14),n.add(i);const s=new y(new nt(.05,.12,.24,8),A(2830136));return s.position.set(0,.86,-.18),n.add(s),n}function Zr(n=S.wood){const t=new ot,e=new y(new G(.5,.08,.5),A(n));e.position.y=.46,t.add(e);const i=new y(new G(.5,.55,.07),A(n));i.position.set(0,.75,-.22),t.add(i);for(const[s,o]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new y(new G(.06,.46,.06),A(S.woodDark));a.position.set(s*.2,.23,o*.2),t.add(a)}return t}function Q1(n=2.4){const t=new ot,e=new y(new G(n,.9,.65),A(S.wallMint));e.position.y=.45,t.add(e);const i=new y(new G(n+.08,.08,.72),A(S.concrete));i.position.y=.94,t.add(i);const s=new y(new G(.5,.06,.4),A(S.metalWhite));return s.position.set(n/2-.55,.97,0),t.add(s),t}function t_(){const n=new ot,t=new y(new G(.8,1.8,.7),A(S.metalWhite));t.position.y=.9,n.add(t);const e=new y(new G(.82,.03,.72),A(S.metalGrey));e.position.y=1.25,n.add(e);for(const i of[.7,1.45]){const s=new y(new G(.05,.3,.05),A(S.metalGrey));s.position.set(.3,i,.37),n.add(s)}return n}function Jr(n=1){const t=new ot,e=new y(new nt(.22*n,.17*n,.34*n,10),A(S.plantPot));e.position.y=.17*n,t.add(e);for(let i=0;i<5;i++){const s=i/5*Math.PI*2,o=new y(new Rt(.2*n,8,6),A(i%2?S.leafMid:S.leafLight));o.scale.set(.5,1.5,.5),o.position.set(Math.cos(s)*.12*n,.6*n,Math.sin(s)*.12*n),o.rotation.z=Math.cos(s)*.4,o.rotation.x=-Math.sin(s)*.4,t.add(o)}return t}function $r(n=.7,t=.55,e=S.skyDusk){const i=new ot,s=new y(new G(n,t,.05),A(S.woodDark));i.add(s);const o=new y(new Ue(n-.1,t-.1),Xe(e,1,!0));return o.position.z=.03,o.renderOrder=1,i.add(o),i}function e_(n=1.3,t=1){const e=new ot,i=new y(new G(n,t,.05),A(S.woodDark));e.add(i);const s=new y(new Ue(n-.1,t-.1),Xe(S.cortica,1,!0));s.position.z=.03,s.renderOrder=1,e.add(s);for(let r=0;r<14;r++){const c=new y(new Ue(.018,.018),Xe(S.corticaEscura,1,!0));c.renderOrder=2,c.position.set((r*37%100/100-.5)*(n-.24),(r*61%100/100-.5)*(t-.24),.035),e.add(c)}const o=[[-.3,.2,.34,.28,.06,S.skyDusk],[.26,.24,.3,.26,-.09,S.water],[-.24,-.22,.3,.26,-.05,S.flowerPink],[.3,-.2,.32,.24,.08,S.leafMid]],a=[S.heart,S.gold,S.frisbee,S.heart];return o.forEach(([r,c,l,h,u,d],p)=>{const g=new ot,v=new y(new Ue(l,h),Xe(S.metalWhite,1,!0));v.renderOrder=3,g.add(v);const m=new y(new Ue(l-.06,h-.1),Xe(d,1,!0));m.position.set(0,.02,.002),m.renderOrder=4,g.add(m);const f=new y(new Rt(.018,8,6),A(a[p]));f.position.set(0,h/2-.03,.012),g.add(f),g.position.set(r,c,.04),g.rotation.z=u,e.add(g)}),e}function du(n=1.2,t=1.2){const e=new ot,i=new y(new Ue(n,t),Xe(S.glass,.55));e.add(i);const s=new y(new G(n+.12,.08,.08),A(S.metalWhite));s.position.y=t/2,e.add(s);const o=s.clone();o.position.y=-t/2,e.add(o);for(const a of[-1,1]){const r=new y(new G(.08,t,.08),A(S.metalWhite));r.position.x=a*n/2,e.add(r)}return e}function n_(n=16777215){const t=new ot,e=new y(new nt(.07,.06,.13,10),A(n));e.position.y=.065,t.add(e);const i=new y(new _e(.045,.014,6,12),A(n));return i.position.set(.08,.07,0),i.rotation.y=Math.PI/2,t.add(i),t}function i_(n=1.5,t=.9){const e=new ot,i=new y(new G(n,.09,t),A(S.wood));i.position.y=.75,e.add(i);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new y(new G(.08,.75,.08),A(S.woodDark));r.position.set(o*(n/2-.14),.37,a*(t/2-.14)),e.add(r)}const s=new y(new nt(.07,.09,.16,10),A(S.wallMint));s.position.y=.87,e.add(s);for(const o of[-1,1]){const a=new y(new Rt(.06,8,6),A(o<0?S.flowerPink:S.flowerYellow));a.position.set(o*.05,1.03,0),e.add(a)}return e}function s_(n=!0){const t=new ot,e=new y(new nt(.2,.24,.06,12),A(S.woodDark));e.position.y=.03,t.add(e);const i=new y(new nt(.03,.03,1.5,8),A(S.metalGrey));i.position.y=.78,t.add(i);const s=new y(new nt(.22,.3,.34,14,1,!0),A(n?16773324:15130320,{glow:n?.5:0,doubleSide:!0}));return s.position.y=1.68,t.add(s),t}function Kr(n=1.1){const t=new ot,e=new y(new G(n,.06,.24),A(S.wood));t.add(e);const i=[14245951,6074447,16763213];for(let o=0;o<3;o++){const a=new y(new G(.1,.24,.16),A(i[o]));a.position.set(-n/2+.2+o*.16,.15,0),t.add(a)}const s=new y(new Rt(.13,10,8),A(S.leafMid));return s.position.set(n/2-.22,.16,0),s.scale.y=.8,t.add(s),t}function o_(n=2){const t=new ot,e=new y(new G(n,.6,.34),A(S.wallCream));t.add(e);for(const i of[-1,1]){const s=new y(new G(.04,.16,.04),A(S.metalGrey));s.position.set(i*n*.22,-.18,.19),t.add(s)}return t}function a_(){const n=new ot,t=new y(new G(.66,.9,.64),A(S.metalWhite));t.position.y=.45,n.add(t);const e=new y(new nt(.2,.2,.06,16),A(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,n.add(e);const i=new y(new nt(.14,.14,.05,16),A(3884624));i.position.set(0,.5,.36),i.rotation.x=Math.PI/2,n.add(i);const s=new y(new G(.6,.12,.03),A(14673128));s.position.set(0,.82,.33),n.add(s);for(const o of[-.2,0,.2]){const a=new y(new nt(.025,.025,.03,8),A(S.metalGrey));a.position.set(o,.82,.36),a.rotation.x=Math.PI/2,n.add(a)}return n}function Ao(n=S.wood,t=.9,e=2.1,i=.24){const s=new ot,o=new y(new G(t,e,.08),A(n));o.position.y=e/2,s.add(o);for(const c of[-1,1]){const l=new y(new G(.09,e+.1,i),A(S.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),s.add(l)}const a=new y(new G(t+.2,.1,i),A(S.woodDark));a.position.y=e+.05,s.add(a);const r=new y(new Rt(.055,8,6),A(S.gold,{glow:.15}));return r.position.set(t/2-.14,e*.45,.07),s.add(r),s}function r_(n=S.wood,t=1.6,e=2.1){const i=new ot,s=.62,o=new y(new G(t,e,s),A(S.woodDark));o.position.y=e/2,i.add(o);const a=new y(new G(t-.12,e-.16,.04),A(3812127));a.position.set(0,e/2,s/2-.05),i.add(a);const r=t/2-.05;for(const c of[-1,1]){const l=new ot;l.position.set(c*r,e/2,s/2),c>0&&(l.rotation.y=-.62),i.add(l);const h=new y(new G(r,e-.1,.06),A(n));h.position.x=-c*r/2,l.add(h);const u=new y(new nt(.022,.022,.16,8),A(S.metalGrey));u.position.set(-c*(r-.12),0,.06),l.add(u)}for(const c of[-1,1])for(const l of[-1,1]){const h=new y(new G(.1,.1,.1),A(S.woodDark));h.position.set(c*(t/2-.1),.05,l*(s/2-.1)),i.add(h)}return i}function c_(n=S.wood,t=1.7){const e=new ot,i=.62,s=new y(new G(i,t,.07),A(n));s.position.y=t/2,e.add(s);const o=new y(new G(i-.14,t-.16,.03),A(S.glass,{opacity:.72,glow:.12}));return o.position.set(0,t/2,.04),e.add(o),e.rotation.x=-.05,e}function l_(){const n=new ot,t=new y(new G(.44,.5,.4),A(S.wood));t.position.y=.25,n.add(t);const e=new y(new G(.36,.14,.03),A(S.woodDark));e.position.set(0,.32,.21),n.add(e);const i=new y(new nt(.06,.08,.16,8),A(S.metalGrey));i.position.y=.58,n.add(i);const s=new y(new nt(.11,.15,.18,12,1,!0),A(16773324,{glow:.45,doubleSide:!0}));return s.position.y=.75,n.add(s),n}const Rn={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},wn={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},h_=[Rn,wn],Qr={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI},"do-quarto":{x:-5.05,z:-1.2,facing:Math.PI/2}},build(n){const t=n.game,e=async Z=>{for(const[yt,Wt]of Z)await t.say([Wt],yt)},i=Rn.name,s=wn.name,o=12,a=9,r=-o/2,c=-a/2,l=2.8;n.ground({width:o,depth:a,color:S.floorWood}),n.setBounds(r+.45,c+.45,o/2-.45,a/2-.45),n.wall(r,c,o/2,c,l,S.wallCream);const h=-1.2,u=.95;n.wall(r,c,r,h-u/2,l,S.wallMint),n.wall(r,h+u/2,r,a/2,l,S.wallMint),n.wall(r,a/2,o/2,a/2,.45,S.wallCream),n.wall(o/2,-1.3,o/2,a/2,.45,S.wallCream);const d=.4,p=4.2,g=-1.3,v=(d+p)/2,m=(p+o/2)/2,f=.95,w=[d,v-f/2,v+f/2,m-f/2,m+f/2,o/2];for(let Z=0;Z<w.length;Z+=2)w[Z+1]-w[Z]>.05&&n.wall(w[Z],g,w[Z+1],g,l,S.wallCream);n.wall(d,c,d,g,l,S.wallCream),n.wall(p,c,p,g,l,S.wallCream),n.wall(o/2,c,o/2,g,l,S.wallCream);const M=new y(new G(o/2-d,.16,g-c),A(15129028));M.position.set((d+o/2)/2,l+.08,(c+g)/2),n.add(M);const x=n.add(n.place(Ao(S.woodDark,.85,2.05),v,0,g)),C=n.add(n.place(Ao(S.gold,.85,2.05),m,0,g));n.add(n.place($r(.6,.75,S.wallMint),3.55,1.75,g+.17)),n.add(n.place(Kr(.9),1.1,1.7,g+.19)),n.add(n.place(Ao(S.fabricBlue,.9,2.1),r,0,h,Math.PI/2)),n.door({x:r+.85,z:h,to:"quarto",entry:"da-sala",label:"Entrar no quarto do Ari",icon:"🚪"}),n.add(n.place(Q1(3.6),-3.4,0,c+.42)),n.blockBox(-3.4,c+.42,1.8,.4),n.add(n.place(o_(2.6),-3.4,2,c+.2)),n.add(n.place(t_(),r+.45,0,-2.6,Math.PI/2)),n.blockBox(r+.45,-2.6,.38,.42);const P=n.add(n.place(i_(1.5,.9),-3.6,0,-1.9,.08));n.blockBox(-3.6,-1.9,.8,.52,.08),n.add(n.place(Zr(),-4.7,0,-1.9,Math.PI/2)),n.add(n.place(Zr(),-2.5,0,-1.9,-Math.PI/2));const I=n.add(n.place(Z1(!1),r+.35,0,.6,Math.PI/2));n.blockBox(r+.35,.6,.3,.9);const T=I.getObjectByName("tela");n.add(n.place(Yr(3,2.6),-2.5,0,.6));const b=n.add(n.place(j1(S.fabricRed,2.4),-.3,0,.6,-Math.PI/2));n.blockBox(-.3,.6,.5,1.2),n.add(n.place(Y1(),-2.4,0,.6,Math.PI/2)),n.blockBox(-2.4,.6,.38,.62);const _=n.add(n.place(n_(16773856),-2.4,.5,.9));n.add(n.place(s_(!0),-.4,0,2.3)),n.blockCircle(-.4,2.3,.3);const D=n.add(n.place(a_(),o/2-.65,0,2.9,-Math.PI/2));n.blockBox(o/2-.65,2.9,.35,.4),n.add(n.place(du(1.8,1.3),r+.16,1.75,2.4,Math.PI/2)),n.add(n.place($r(.8,.6,S.skyDusk),-3.4,1.95,c+.17)),n.add(n.place(Kr(1.1),-1.6,1.8,c+.2)),n.add(n.place(Jr(1.1),r+.8,0,a/2-1));const z=n.add(n.place(Jr(.75),4.9,0,1.4)),B=n.place(iu(.75),-.3,2.4,.6);B.visible=!1,n.add(B);const V=a/2;n.wall(2,V,2.9,V,2.6,S.wallCream),n.wall(3.9,V,4.9,V,2.6,S.wallCream);const H=n.add(n.place(Ao(S.woodDark,.95,2.1),3.4,0,V,Math.PI));n.blockBox(3.4,V,.5,.12),n.add(n.place(Yr(1.4,.8,12626050),3.4,0,a/2-1));const J=new ye;J.position.set(-.52,0,.6),J.rotation.y=-Math.PI/2,n.root.add(J);const st=new ye;st.position.set(-1.9,1.05,.6),n.root.add(st);let $=!1;const at=Z=>{$=Z,T.material=A(Z?9426943:S.screen,{glow:Z?.55:0})};n.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:b,onInteract:async Z=>{if(await Z.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await Z.say(["Depois. Se sentar agora, não levanta mais."]);return}Z.lockPlayer(!0),Z.ridePlayer(J,new N(-.52,.02,0),1,0),Z.rideCompanion(J,new N(.52,.02,0),1,0),Z.setSitting(!0),at(!0),Z.focusCamera(st),Z.setZoom(7.2),await Z.wait(.9),await Z.say(["Está passando Bo Burnham."]),await Z.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${Z.companionName()} tá rindo também.`]),await Z.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await Z.say(["Mais um. Só mais um.","Nunca é só mais um."]),Z.setSitting(!1),Z.focusCamera(null),Z.setZoom(10),Z.releasePlayer(-1.6,.4,-Math.PI/2),Z.releaseCompanion(-1.6,1.5,-Math.PI/2),Z.lockPlayer(!1),Z.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),n.interact({id:"casa:tv",x:r+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:I,onInteract:async Z=>{at(!$),$&&Z.som("tv"),Z.toast($?"TV ligada":"TV desligada","📺"),$&&await Z.say(["Está passando Bo Burnham."])}}),n.interact({id:"casa:geladeira",x:r+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:Z=>Z.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),n.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:Z=>Z.say(["Por algum milagre, a pia está limpa…"])}),n.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:P,onInteract:async Z=>{await e([[i,"Dois pratos, duas canecas. Já virou automático."],[s,"Três, se a Rubi sair do quarto."]]),Z.toast("Mesa posta","🍽️")}}),n.interact({id:"casa:maquina",x:o/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:D,onInteract:async Z=>{if(Z.flag("roupa-lavando")){await e([[s,"Ainda tá centrifugando."],[i,"Esse barulho é a trilha sonora dessa casa."]]);return}Z.setFlag("roupa-lavando"),Z.toast("Máquina ligada","🫧"),await e([[i,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[s,"Contanto que a Rubi não encha ela de novo antes."]])}}),n.interact({id:"casa:banheiro",x:m,z:g+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:C,onInteract:()=>e([[s,"Tem alguém aí?"],[i,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),n.interact({id:"casa:quarto",x:v,z:g+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:x,onInteract:async Z=>{await e([[i,"Acho que a Rubi está ouvindo kpop"],[s,"Para variar né"]]),Z.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),n.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:z,onInteract:async Z=>{if(Z.flag("planta-regada")){await Z.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}Z.setFlag("planta-regada"),z.scale.multiplyScalar(1.2),Z.toast("A plantinha cresceu um tiquinho","🌱"),await Z.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),n.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:_,onInteract:async Z=>{await Z.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),Z.toast("+1 disposição","☕")}}),n.interact({id:"casa:janela",x:r+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async Z=>{await Z.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),Z.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),n.door({x:3.4,z:a/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:H,radius:1.7}),n.onUpdate((Z,yt)=>{B.visible=n.game.flag("planta-regada"),B.position.y=2.4+Math.sin(yt*1.6)*.12,B.rotation.y=yt*.9})}},ue={x:0,z:-3,largura:16,profundidade:10,fundo:1.6},hn={z:-2,largura:48,profundidade:38},Ji={x:-21,z:9},Xi={x:Ji.x+2.4,z:Ji.z-2.6};function th(n,t,e=0){return Math.abs(n-ue.x)<ue.largura/2-e&&Math.abs(t-ue.z)<ue.profundidade/2-e}const eh={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:Xi.x,z:Xi.z,facing:Math.PI/2},entries:{portaria:{x:Xi.x,z:Xi.z,facing:Math.PI/2},beira:{x:0,z:3.5,facing:Math.PI}},build(n){const t=n.game,e=async T=>{for(const[b,_]of T)await t.say([_],b)},i=Rn.name,s=wn.name,o={x:ue.x,z:ue.z,width:ue.largura,depth:ue.profundidade};n.groundWithHoles({width:160,depth:160,color:S.grass,holes:[o]}),n.groundWithHoles({width:hn.largura,depth:hn.profundidade,color:14999766,y:.015,z:hn.z,holes:[{...o,z:o.z-hn.z}]}),n.setBounds(-22,-19,22,16),n.add(n.place(Iv(ue.largura,ue.profundidade,ue.fundo),ue.x,0,ue.z));const a=Lv(ue.largura,ue.profundidade);a.position.set(ue.x,-.12,ue.z),n.root.add(a);for(const T of[-5.2,-1.8,1.8,5.2]){const b=new y(new Ue(.24,ue.profundidade-1.4),Xe(4164272,1,!0));b.rotation.x=-Math.PI/2,b.position.set(ue.x+T,-1.6+.08,ue.z),b.renderOrder=1,n.root.add(b)}for(const T of[-5,5])n.add(n.place(Dv(),T,0,ue.z+ue.profundidade/2));const r=n.add(n.place(Nv(),0,0,ue.z-ue.profundidade/2-1.6));n.blockBox(0,ue.z-ue.profundidade/2-1.9,.4,.4);const c=[Na(S.frisbee),Na(16767070),Na(7328752)];c.forEach((T,b)=>{n.place(T,-4.5+b*4.6,-.05,ue.z-1.6+b%2*2.6),n.root.add(T)});const l=[S.fabricBlue,S.fabricRed,6074447,16763213];for(let T=0;T<6;T++){const b=-7.5+T*3;n.add(n.place(zl(l[T%l.length]),b,0,5.4,Math.PI)),n.blockBox(b,5.4,.36,.85),T%2===0&&(n.add(n.place(Fl(T%4===0?S.fabricRed:4882400),b+1.5,0,6.9)),n.blockCircle(b+1.5,6.9,.3))}const h=n.add(n.place(zl(S.rug),10.5,0,2.2,-Math.PI/2));n.blockBox(10.5,2.2,.85,.36),n.add(n.place(Fl(16748465),11.6,0,3.6)),n.blockCircle(11.6,3.6,.3);const u=n.add(n.place(Uv(),-11,0,2.5,-Math.PI/2));n.blockCircle(-11,2.5,.3);const d=n.add(n.place(Br(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));n.blockBox(-12.5,7.2,1.4,1,.35);const p=n.add(n.place(kr(6,3.2,4,S.wallCream,8038084),15,0,-18));n.blockBox(15,-18,3,2),n.banco(14,-3,-Math.PI/2),n.setSeed(90210);const g=hn.largura/2+1.5,v=hn.profundidade/2+1.5;for(const[T,b]of[[-g,-8],[-g,4],[g,2],[g,-10],[-9,-v+hn.z],[11,-v+hn.z],[-4,v+hn.z]])n.add(n.place(Fr("palmeira",n.range(.95,1.2),n.rng()),T,0,b)),n.blockCircle(T,b,.5);for(let T=0;T<26;T++){const b=n.range(-34,34),_=n.range(-32,28);Math.abs(b)<hn.largura/2+1&&Math.abs(_-hn.z)<hn.profundidade/2+1||n.add(n.place(T%2?Do(n.range(.7,1.1)):Or(6,1.1),b,0,_))}for(let T=0;T<6;T++){const b=tu(n.range(1.8,3));b.position.set(n.range(-60,60),n.range(40,52),n.range(-50,30)),n.root.add(b);const _=n.range(.2,.5);n.onUpdate(D=>{b.position.x+=_*D,b.position.x>62&&(b.position.x=-62)})}const m=n.add(n.place(su(),Ji.x,0,Ji.z,Math.PI/2));n.blockBox(Ji.x,Ji.z,1.3,4.3),n.door({x:Xi.x,z:Xi.z,to:"villa-lobos",entry:"clube",label:"Pegar o ônibus pro parque",icon:"🚌",highlight:m,radius:2.4});const f=[],w=(T,b,_=12)=>{t.som("agua");for(let D=0;D<_;D++){const z=new y(new Rt(.1+Math.random()*.1,6,5),Xe(14677247,.9)),B=D/_*Math.PI*2,V=.2+Math.random()*.5;z.position.set(T+Math.cos(B)*V,-.1,b+Math.sin(B)*V),n.root.add(z),f.push({mesh:z,vy:2.2+Math.random()*2.4,vida:1})}};let M=0,x=0,C=!1;n.onUpdate((T,b)=>{a.position.y=-.12+Math.sin(b*1.4)*.015,c.forEach((V,H)=>{V.position.y=-.05+Math.sin(b*1.1+H*1.7)*.05,V.rotation.y=Math.sin(b*.4+H)*.4});const _=t.playerPosition(),D=t.companionPosition(),z=th(_.x,_.z,.2)?1:0,B=th(D.x,D.z,.2)?1:0;M+=(z-M)*Math.min(1,T*5),x+=(B-x)*Math.min(1,T*5),t.submergePlayer(M),t.submergeCompanion(x),z===1&&!C&&(C=!0,w(_.x,_.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let V=f.length-1;V>=0;V--){const H=f[V];H.vy-=9*T,H.mesh.position.y+=H.vy*T,H.vida-=T*.9,H.mesh.material.opacity=Math.max(0,H.vida),(H.vida<=0||H.mesh.position.y<-.6)&&(n.root.remove(H.mesh),H.mesh.geometry.dispose(),f.splice(V,1))}});const P=new ye;n.root.add(P),n.interact({id:"clube:trampolim",x:0,z:ue.z-ue.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:r,onInteract:async T=>{T.lockPlayer(!0),await T.say(["Do trampolim?","Do trampolim."]);const b=new N(0,.95,ue.z-ue.profundidade/2-.4),_=new N(0,-.6,ue.z+1.2);P.position.copy(b),T.ridePlayer(P,new N(0,0,0),1);const D=1.15;for(let z=0;z<D;z+=1/60){const B=z/D;P.position.lerpVectors(b,_,B),P.position.y+=Math.sin(B*Math.PI)*2.6,await T.wait(1/60)}w(_.x,_.z,18),T.releasePlayer(_.x,_.z,Math.PI),T.lockPlayer(!1),T.toast("Splash!","💦"),T.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),n.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:h,onInteract:async T=>{await T.say(["Sol na cara, barulho de água, ninguém com pressa.",`${T.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),T.toast("+1 preguiça boa","🌞")}});let I=0;n.onUpdate(T=>{I<=0||(I-=T,I<=0&&(t.removeItem(Jt.sucoMorango.id,wn.id),t.removeItem(Jt.sucoPessego.id,Rn.id),t.toast("Acabou o suco","🍹")))}),n.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:d,onInteract:async T=>{await e([[s,"Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito."],[i,"Awnn gracias amorzito"]]),I=50,T.addItem(Jt.sucoMorango,wn.id),T.addItem(Jt.sucoPessego,Rn.id),T.som("sorvete"),T.toast("Morango e pêssego","🍹")}}),n.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:u,onInteract:async T=>{w(-10.6,2.5,8),await T.say(["Gelada. Sempre gelada."])}}),n.interact({id:"clube:vestiario",x:15,z:-15.4,radius:2,priority:1,label:"Vestiário",icon:"🩳",highlight:p,onInteract:async T=>{for(const b of[T.playerId(),T.companionId()]){T.storeItem(Jt.oculosEscuros,b);for(const _ of au)T.storeItem(_,b)}T.flag("vestiario-clube")||(T.setFlag("vestiario-clube"),await e([[i,"Cinco minutos pra trocar de roupa. Você demora quinze."],[s,"Eu demoro porque escolho. Você só pega a primeira que vê."]])),T.abrirVestiario()}})}};class u_{group=new ot;aoSoar=null;get x(){return this.group.position.x}get z(){return this.group.position.z}get estado(){return this.humor}area;jeito;humor="parado";aguarda=1.2;alvo=new N;fase=0;ateSoar;carinho=0;semente;constructor(t,e={}){this.area=t,this.jeito={velocidade:e.velocidade??.62,descansoMin:e.descansoMin??1.4,descansoMax:e.descansoMax??4.4,chanceDeSentar:e.chanceDeSentar??.35,somCadaMin:e.somCadaMin??9,somCadaMax:e.somCadaMax??20,duracaoDoCarinho:e.duracaoDoCarinho??3.4,semente:e.semente??20260902},this.semente=this.jeito.semente>>>0||1,this.ateSoar=this.jeito.somCadaMin*.7,this.group.position.set((t.minX+t.maxX)/2,0,(t.minZ+t.maxZ)/2),this.alvo.copy(this.group.position)}prontoParaAparecer(t){this.group.userData.peca=t,this.group.traverse(e=>{e.isMesh&&(e.castShadow=!0)})}sorte(){let t=this.semente;return t^=t<<13,t^=t>>>17,t^=t<<5,this.semente=t>>>0,this.semente%1e5/1e5}cabe(t,e){const i=this.area;if(t<i.minX||t>i.maxX||e<i.minZ||e>i.maxZ)return!1;for(const s of i.proibido??[])if(Math.hypot(t-s.x,e-s.z)<s.r)return!1;return!0}novoDestino(){for(let t=0;t<12;t++){const e=this.area.minX+this.sorte()*(this.area.maxX-this.area.minX),i=this.area.minZ+this.sorte()*(this.area.maxZ-this.area.minZ),s=Math.hypot(e-this.x,i-this.z);if(this.cabe(e,i)&&s>.7){this.alvo.set(e,0,i),this.humor="andando",this.aguarda=s/this.jeito.velocidade+2;return}}this.humor="parado",this.aguarda=1.5}receberCarinho(){this.humor="sentado",this.aguarda=this.jeito.duracaoDoCarinho,this.carinho=1,this.ateSoar=Math.min(this.ateSoar,2.2)}update(t){if(this.fase+=t,this.aguarda-=t,this.ateSoar-=t,this.carinho>0&&(this.carinho=Math.max(0,this.carinho-t*.42)),this.ateSoar<=0){const i=this.jeito;this.ateSoar=i.somCadaMin+this.sorte()*(i.somCadaMax-i.somCadaMin),this.aoSoar?.(),this.humor==="andando"&&(this.humor="parado",this.aguarda=.9)}if(this.aguarda<=0)if(this.humor==="andando"){const i=this.jeito;this.humor=this.sorte()<i.chanceDeSentar?"sentado":"parado",this.aguarda=i.descansoMin+this.sorte()*(i.descansoMax-i.descansoMin)}else this.novoDestino();let e=!1;if(this.humor==="andando"){const i=this.alvo.x-this.x,s=this.alvo.z-this.z,o=Math.hypot(i,s);if(o<.08)this.humor="parado",this.aguarda=1.2+this.sorte()*2.5;else{const a=Math.min(o,this.jeito.velocidade*t);this.group.position.x+=i/o*a,this.group.position.z+=s/o*a;let c=Math.atan2(i,s)-this.group.rotation.y;for(;c>Math.PI;)c-=Math.PI*2;for(;c<-Math.PI;)c+=Math.PI*2;this.group.rotation.y+=c*Math.min(1,t*7),e=!0}}this.animar(t,{andando:e,sentado:this.humor==="sentado",carinho:this.carinho,fase:this.fase})}}class d_ extends u_{corpo=new ot;cabeca=new ot;rabo=new ot;patas=[];orelhas=[];olhos=[];gomosDoRabo=[];constructor(t){super(t,{velocidade:.62,descansoMin:1.4,descansoMax:4.4,chanceDeSentar:.35,somCadaMin:9,somCadaMax:20}),this.montar(),this.prontoParaAparecer("pelusa")}montar(){const t=A(S.pelusaBranco),e=A(S.pelusaCinza),i=A(S.pelusaCinzaEscuro),s=new y(new Rt(1,14,10),t);s.scale.set(.105,.098,.165),s.position.y=.175,this.corpo.add(s);const o=new y(new Rt(1,14,10),e);o.scale.set(.098,.072,.142),o.position.set(0,.203,-.012),this.corpo.add(o);const a=new y(new Rt(.105,14,10),t);a.scale.set(1,.94,.9),this.cabeca.add(a);const r=new y(new Rt(.107,14,10,0,Math.PI*2,0,Math.PI*.54),e);r.scale.set(1,.94,.9),r.position.y=.004,this.cabeca.add(r);const c=new y(new Rt(.058,10,8),t);c.scale.set(1.05,.78,.85),c.position.set(0,-.032,.072),this.cabeca.add(c);const l=new y(new Rt(.016,8,6),A(S.pelusaFocinho));l.scale.set(1.2,.85,.8),l.position.set(0,-.024,.122),this.cabeca.add(l);for(const u of[-1,1]){const d=new ot,p=new y(new Ne(.042,.085,6),e);d.add(p);const g=new y(new Ne(.026,.058,6),A(S.pelusaOrelha));g.position.z=.016,d.add(g),d.position.set(u*.062,.092,-.006),d.rotation.z=u*.17,this.orelhas.push(d),this.cabeca.add(d);const v=new y(new Rt(.016,8,6),A(2828065));v.position.set(u*.044,.01,.09),this.olhos.push(v),this.cabeca.add(v)}this.cabeca.position.set(0,.288,.152),this.corpo.add(this.cabeca);for(const[u,d]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const p=new y(new Tn(.028,.085,3,6),t);p.position.set(u*.062,.072,d*.092),this.patas.push(p),this.corpo.add(p)}let h=this.rabo;for(let u=0;u<3;u++){const d=new ot,p=new y(new Tn(.022-u*.004,.075,3,6),u%2===0?e:i);p.position.y=.048,d.add(p),d.position.y=u===0?0:.094,d.rotation.x=u===0?-.75:.34,h.add(d),h=d,this.gomosDoRabo.push(d)}this.rabo.position.set(0,.19,-.168),this.corpo.add(this.rabo),this.group.add(this.corpo)}animar(t,{andando:e,sentado:i,carinho:s,fase:o}){if(e){const c=o*9;this.patas[0].position.z=.092+Math.sin(c)*.032,this.patas[3].position.z=-.092+Math.sin(c)*.032,this.patas[1].position.z=.092-Math.sin(c)*.032,this.patas[2].position.z=-.092-Math.sin(c)*.032,this.corpo.position.y=Math.abs(Math.sin(c))*.012,this.corpo.rotation.x=0,this.corpo.rotation.z=Math.sin(c)*.03}else{for(let u=0;u<4;u++){const d=u<2?.092:-.092;this.patas[u].position.z+=(d-this.patas[u].position.z)*Math.min(1,t*8)}this.corpo.rotation.z*=1-Math.min(1,t*8);const c=i?.34:0;this.corpo.rotation.x+=(c-this.corpo.rotation.x)*Math.min(1,t*5);const l=Math.sin(o*1.7)*.006,h=(i?.028:0)+l;this.corpo.position.y+=(h-this.corpo.position.y)*Math.min(1,t*5)}const a=e?1:.55;for(let c=0;c<this.gomosDoRabo.length;c++){const l=this.gomosDoRabo[c],h=(.1+c*.075)*a+s*.1;l.rotation.z=Math.sin(o*(2.1+c*.9))*h,c===0&&(l.rotation.x=-.75+Math.sin(o*1.3)*.12*a)}this.cabeca.rotation.y=e?0:Math.sin(o*.6)*.34,this.cabeca.rotation.x=-s*.22+Math.sin(o*1.9)*.02;for(let c=0;c<this.orelhas.length;c++){const l=c===0?-1:1,h=Math.sin(o*2.3+c*1.7);this.orelhas[c].rotation.z=l*(.17+s*.12)+h*.05*l}const r=1-s*.85;for(const c of this.olhos)c.scale.y=Math.max(.12,r)}}const un=8,dn=6.5,Ge=-un/2,Je=-dn/2,nh=2.8,ni={x:2.65,z:Je+.36},ih={x:-1.15},f_=["Ele só ronrona assim pra quem ele gosta.","Cuidado que ele dorme em cima de você.","Ó, fechou o olhinho.","Ele te adotou.","Esse aí é o dono do quarto. A gente só mora junto."],p_=[Jt.gorroDeLa,Jt.camisaListrada,Jt.calcaJeans,Jt.botaAmarela,Jt.vestidoRosa,Jt.gargantilhaDeLaco,Jt.maidMarinheiro,Jt.maidGatinho,Jt.maidJapones,Jt.meiaDeCoxa,Jt.moletomPreto],sh={id:"quarto",name:"Quarto do Ari",subtitle:"a porta que fica sempre encostada",ambient:{sky:14872311,indoor:!0,sunColor:16774366,sunIntensity:.95,ambientColor:15397883,ambientIntensity:1.45,sunDir:[10,15,12]},spawn:{x:.9,z:1.7,facing:Math.PI},entries:{"da-sala":{x:.9,z:1.7,facing:Math.PI}},build(n){const t=n.game,e=async f=>{for(const[w,M]of f)await t.say([M],w)},i=Rn.name,s=wn.name;n.ground({width:un,depth:dn,color:S.floorWood}),n.setBounds(Ge+.45,Je+.45,un/2-.45,dn/2-.45),n.wall(Ge,Je,un/2,Je,nh,S.wallAzul),n.wall(Ge,Je,Ge,dn/2,nh,S.wallAzul),n.wall(un/2,Je,un/2,dn/2,.45,S.wallAzul);const o=.9,a=1.1;n.wall(Ge,dn/2,o-a/2,dn/2,.45,S.wallAzul),n.wall(o+a/2,dn/2,un/2,dn/2,.45,S.wallAzul);for(const[f,w,M,x]of[[0,Je+.06,un,0],[Ge+.06,0,dn,Math.PI/2]]){const C=new y(new G(M,.12,.05),A(12176860));C.position.set(f,.06,w),C.rotation.y=x,n.add(C)}const r=n.add(n.place($1(S.fabricBlue),-2.2,0,-1.75));n.blockBox(-2.2,-1.75,.78,1.08);const c={x:-2.2,y:.86,z:-1.02},l=new ye;l.position.set(c.x,c.y,c.z),l.rotation.x=-Math.PI/2,n.add(l),n.add(n.place(l_(),-1.05,0,-2.72)),n.blockBox(-1.05,-2.72,.24,.22);const h=n.add(n.place(J1(1.9,1.1),.15,0,Je+.22));n.blockBox(.15,Je+.22,.55,.18);const u=n.add(n.place(r_(S.wallMint),ni.x,0,ni.z));n.blockBox(ni.x,ni.z,.8,.32);const d=n.add(n.place(c_(S.woodDark),Ge+.12,0,-.6,Math.PI/2));n.add(n.place(du(1.6,1.2),Ge+.16,1.7,1,Math.PI/2));const p=n.add(n.place(K1(),Ge+.5,0,2,-Math.PI/2));n.blockBox(Ge+.5,2,.4,.82),n.add(n.place(Zr(S.woodDark),Ge+1.35,0,2,-Math.PI/2)),n.add(n.place(Yr(2.6,2,S.rug),.3,0,1.1)),n.add(n.place(Jr(1.15),un/2-.75,0,.9)),n.blockCircle(un/2-.75,.9,.3),n.add(n.place($r(.6,.75,S.flowerPink),-2.2,1.85,Je+.17)),n.add(n.place(Kr(.9),1.05,1.9,Je+.19));const g=n.add(n.place(e_(1.3,1),ih.x,1.72,Je+.17));n.door({x:o,z:dn/2-.7,to:"casa",entry:"do-quarto",label:"Voltar pra sala",icon:"🚪"}),n.interact({id:"quarto:armario",x:ni.x,z:ni.z+1.25,radius:1.8,label:"Abrir o armário",icon:"🚪",highlight:u,onInteract:async f=>{for(const w of[f.playerId(),f.companionId()])for(const M of p_)f.storeItem(M,w);f.flag("armario-aberto")||(f.setFlag("armario-aberto"),await e([[i,"Pode mexer, fica à vontade."],[s,"Tem mais roupa aqui do que no meu apartamento inteiro."]]),f.unlock({id:"armario-do-ari",title:"O armário do Ari",place:"Quarto do Ari",note:"Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.",icon:"👕"})),f.abrirGuardaRoupa()}});const v=new d_({minX:Ge+.8,maxX:un/2-.8,minZ:Je+.9,maxZ:dn/2-.8,proibido:[{x:-2.2,z:-1.75,r:1.05},{x:-1.05,z:-2.72,r:.45},{x:.15,z:Je+.22,r:.7},{x:ni.x,z:ni.z,r:1},{x:Ge+.5,z:2,r:.9},{x:un/2-.75,z:.9,r:.6}]});n.add(v.group),v.aoSoar=()=>t.som("miado");const m=n.interact({id:"quarto:pelusa",x:v.x,z:v.z,radius:1.15,label:"Fazer carinho no Pelusa",icon:"🐈",highlight:v.group,onInteract:async f=>{if(v.receberCarinho(),f.som("miado"),!f.flag("pelusa-conhecido")){f.setFlag("pelusa-conhecido"),await e([[s,"Esse é o Pelusa?"],[i,"Esse é o Pelusa."],[s,"Ele deixa pegar?"],[i,"Ele decide na hora. Hoje ele tá deixando."]]),f.unlock({id:"pelusa",title:"O Pelusa",place:"Quarto do Ari",note:"O gato do Ari. Branco, cinza no lombo, e some pelo quarto até você sentar no chão.",icon:"🐈"});return}await f.say([n.pick(f_)],i)}});n.onUpdate(f=>{v.update(f),m.moveTo(v.x,v.z)}),n.interact({id:"quarto:memorias",x:ih.x,z:-2.15,radius:1.35,label:"Ver memórias",icon:"📌",highlight:g,onInteract:async f=>{f.flag("quadro-visto")||(f.setFlag("quadro-visto"),await e([[i,"Eu queria um lugar pra pendurar as nossas."],[s,"Um quadro de memórias."],[i,"Esse. Cada uma que a gente viver, entra aqui."]]),f.unlock({id:"quadro-de-memorias",title:"O quadro de memórias",place:"Quarto do Ari",note:"Ideia dele. A primeira já estava pregada quando eu vi.",icon:"📌"})),f.abrirMemoria("o-pedido")}}),n.interact({id:"quarto:espelho",x:Ge+.95,z:-.6,radius:1.5,label:"Se olhar no espelho",icon:"🪞",highlight:d,onInteract:async f=>{if(f.wearables().filter(M=>M!==null).length===0){await e([[s,"Tô bem assim?"],[i,"Tá. Mas tem um armário inteiro logo ali."]]);return}await e([[i,`Olha só, ${f.playerName()}.`],[s,"Ficou bom mesmo."]])}}),n.interact({id:"quarto:cama",x:-2.2,z:-.5,radius:1.6,label:"Deitar na cama",icon:"🛏️",highlight:r,onInteract:async f=>{if(await f.ask("Deitar um pouco?",["Deitar","Agora não"])!==0){await e([[s,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[s,"Não é a cama então."]]);return}f.lockPlayer(!0),f.ridePlayer(l,new N(-.36,0,0),1,0),f.rideCompanion(l,new N(.36,0,0),1,0),f.setLying(!0),f.setCameraOmbro(new N(-.95,3.75,.35),new N(-2.2,.72,-1.75)),await f.wait(1.1),await e([[s,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[s,"Não é a cama então."]]),await f.ask("Ficar mais um pouco?",["Fica","Levantar"])===0&&(await e([[i,"A gente não precisa fazer nada agora."],[s,"Eu sei."]]),await f.wait(2.4)),f.setLying(!1),f.setCameraOmbro(null),f.releasePlayer(-1.3,-.4,0),f.releaseCompanion(-1.3,.25,0),f.lockPlayer(!1),f.unlock({id:"deitar-junto",title:"Deitar sem motivo",place:"Quarto do Ari",note:"Os dois na cama dele, olhando o teto, sem plano nenhum para o resto da tarde.",icon:"🛏️"})}}),n.interact({id:"quarto:mesa",x:Ge+1.5,z:2,radius:1.5,label:"Olhar a escrivaninha",icon:"💻",highlight:p,onInteract:()=>e([[i,"É daqui que eu te mando mensagem de madrugada."],[s,"Eu sei. Eu tô acordado do outro lado."]])}),n.interact({id:"quarto:estante",x:.35,z:-2.2,radius:1.4,label:"Olhar a estante",icon:"📚",highlight:h,onInteract:async f=>{await e([[s,"Você leu todos esses?"],[i,"Comecei todos esses."],[i,"Menos esse. Esse eu li três vezes: Aristóteles e Dante Descobrem os Segredos do Universo."],[s,"Eu sei. Você me contou o final antes de eu chegar na metade."],[i,"E o seu tá aqui do lado. A Toca das Raposas."],[s,"Você guardou."],[i,"Guardei."]]),f.flag("estante-favoritos")||(f.setFlag("estante-favoritos"),f.unlock({id:"os-dois-livros",title:"Os dois livros",place:"Quarto do Ari",note:"O Aristóteles e Dante é dele. A Toca das Raposas é meu. Ficam na mesma prateleira.",icon:"📚"}))}})}};function m_(n,t,e,i){const s=new N().subVectors(t,n),o=s.length(),a=new y(new nt(e,e*1.15,o,8),i);return a.position.copy(n).addScaledVector(s,.5),a.quaternion.setFromUnitVectors(new N(0,1,0),s.normalize()),a}class g_{group=new ot;cabins=[];radius;hubHeight;speed;angle=0;rim=new ot;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,i=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const s=A(t.frameColor??S.metalWhite),o=this.hubHeight=e+2.6,a=e*.075;for(const I of[-a,a]){const T=new y(new _e(e,e*.019,8,72),s);T.position.z=I,this.rim.add(T)}const r=Math.min(48,i*2);for(let I=0;I<r;I++){const T=I/r*Math.PI*2,b=new y(new G(e*.012,e*.012,a*2),s);b.position.set(Math.cos(T)*e,Math.sin(T)*e,0),this.rim.add(b)}const c=[];for(let I=0;I<r;I++){const T=I/r*Math.PI*2,b=(I+1)/r*Math.PI*2,_=I%2===0?-a:a,D=I%2===0?a:-a;c.push(Math.cos(T)*e,Math.sin(T)*e,_,Math.cos(b)*e,Math.sin(b)*e,D)}this.rim.add(new $c(oh(c),Ll(14673642)));const l=[];for(let I=0;I<i;I++){const T=I/i*Math.PI*2,b=Math.cos(T)*e,_=Math.sin(T)*e;l.push(0,0,-a*.5,b,_,-a),l.push(0,0,a*.5,b,_,a)}this.rim.add(new $c(oh(l),Ll(15660022)));const h=new y(new nt(e*.085,e*.085,e*.3,14),s);h.rotation.x=Math.PI/2,this.rim.add(h);for(const I of[-e*.17,e*.17]){const T=new y(new nt(e*.11,e*.07,e*.06,14),A(S.metalGrey));T.rotation.x=Math.PI/2,T.position.z=I,this.rim.add(T)}this.rim.position.y=o,this.group.add(this.rim);const u=A(t.cabinColor??S.metalWhite),d=A(7321304,{opacity:.5}),p=e*.068;for(let I=0;I<i;I++){const T=new ot,b=new y(new G(.09,p*1.1,.09),A(S.metalGrey));b.position.y=p*1.25,T.add(b);const _=new y(new Tn(p,p*.5,5,16),u);_.scale.set(1,1,.92),T.add(_);const D=new y(new nt(p*1.02,p*1.02,p*.95,18,1,!0),d);D.position.y=p*.12,D.scale.z=.92,T.add(D),T.traverse(z=>{z.isMesh&&(z.castShadow=!0)}),this.cabins.push(T),this.group.add(T)}const g=e*.42,v=new N(0,o,-e*.04),m=new N(0,o,e*.04),f=[[v,new N(-e*.2,0,-g)],[v,new N(e*.2,0,-g)],[m,new N(-e*.2,0,g)],[m,new N(e*.2,0,g)]];for(const[I,T]of f){const b=m_(I.clone(),T.clone(),e*.03,s);b.castShadow=!0,this.group.add(b)}for(const I of[-g,g]){const T=new y(new G(e*.42,e*.022,e*.022),s);T.position.set(0,e*.16,I),this.group.add(T)}const w=new y(new nt(e*.62,e*.67,.35,26),A(S.concrete));w.position.y=.16,w.receiveShadow=!0,this.group.add(w);const M=e*.4,x=g*.92;for(const[I,T]of[[-M,-x],[M,-x],[-M,x],[M,x]]){const b=new y(new nt(e*.055,e*.055,e*.16,12),A(S.metalRed));b.position.set(I,e*.08,T),b.castShadow=!0,this.group.add(b)}const C=new y(new G(e*.55,.55,e*.3),A(S.metalGrey));C.position.set(0,.4,g*.9),C.castShadow=!0,C.receiveShadow=!0,this.group.add(C);const P=new y(new nt(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),A(S.fabricRed));P.position.set(0,1.9,g*.9),P.rotation.set(0,0,Math.PI/2),P.scale.z=.6,this.group.add(P);for(const I of[-e*.15,e*.15]){const T=new y(new nt(.06,.06,1.8,8),A(S.metalWhite));T.position.set(I,.9,g*.9),this.group.add(T)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const i of this.cabins)i.position.y<e&&(e=i.position.y,t=i);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function oh(n){const t=new Ie;return t.setAttribute("position",new re(n,3)),t}class v_{mesh;state="chao";velocity=new N;spin=0;curva=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=nu(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}get rasante(){return Math.hypot(this.velocity.x,this.velocity.z)}pickUp(){this.state="guardado",this.velocity.set(0,0,0),this.curva=0}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,i=0,s=1,o=0){const a=e.x-t.x,r=e.z-t.z,c=Math.hypot(a,r),l=(Math.random()-.5)*i;this.throwFrom(t,Math.atan2(a,r)+l,this.powerFor(c,s),s,o)}throwAt(t,e,i,s=1,o=0){this.throwFrom(t,e,this.powerFor(i,s),s,o)}powerFor(t,e=1){let i=.25,s=1.7;for(let o=0;o<14;o++){const a=(i+s)/2;this.simulateRange(a,e)<t?i=a:s=a}return De.clamp((i+s)/2,.25,1.7)}passo(t,e,i,s){const o=e.y>-1.2?this.lift:0;e.y-=(this.gravity-o)*s;const a=e.x,r=e.z,c=Math.hypot(a,r);return i!==0&&c>1e-4&&(e.x+=r/c*i*s,e.z+=-a/c*i*s),e.x*=1-.35*s,e.z*=1-.35*s,t.addScaledVector(e,s),i*Math.max(0,1-1.1*s)}simulateRange(t,e=1){const i=new N(0,1.15,0),s=new N(0,3.4*t*e,11*t),o=1/60;for(let a=0;a<900&&i.y>.06;a++)this.passo(i,s,0,o);return i.z}ondeVaiCair(t){const e=this.mesh.position.clone();if(this.state!=="voando")return e;const i=this.velocity.clone();let s=this.curva;const o=1/60;for(let a=0;a<900&&e.y>.06;a++)s=this.passo(e,i,s,o),this.bater(e,i,t)&&(s=0);return e.y=.06,e}throwFrom(t,e,i=1,s=1,o=0){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const a=11*i;this.velocity.set(Math.sin(e)*a,3.4*i*s,Math.cos(e)*a),this.curva=o,this.spin=22}bater(t,e,i){const s=De.clamp(t.x,i.minX,i.maxX),o=De.clamp(t.z,i.minZ,i.maxZ);return s===t.x&&o===t.z?!1:(t.x=s,t.z=o,e.multiplyScalar(.2),!0)}update(t,e){this.state==="voando"&&(this.curva=this.passo(this.mesh.position,this.velocity,this.curva,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08+this.curva*.06,this.bater(this.mesh.position,this.velocity,e)&&(this.curva=0),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.curva=0,this.onLand?.(this.mesh.position.clone())))}}const Oe={largura:2.6,profundidade:1.4,altura:.76},__=.055,Cs=Oe.largura/2+.22,x_=Cs+.9,ah=.28,M_=Oe.altura+.19,y_=6.6,b_=.72,Ms=Oe.profundidade/2+.12,en={vxBase:3.5,vxMin:2.9,vxMax:4.4,energiaParaVx:.05,vyBase:1.9,alturaParaVy:1.5,subidaParaVy:.12,vyMin:.75,vyMax:2.4,heranca:.25,lateralParaVz:.2,vzMax:1.05,velocidadeMaximaRaquete:6};class S_{grupo=new ot;bola;minhaRaquete;raqueteDele;fase="parado";meus=0;dele=0;alvo;onSom=null;onPonto=null;onFim=null;v=new N;espera=0;sacaEu=!0;rebatedor="eu";quiquesNoAlvo=0;lateralRaquete=0;subidaRaquete=0;zAnterior=0;yAnterior=0;erroDele=0;constructor(t=5){this.alvo=t,this.bola=eu(),this.grupo.add(this.bola),this.minhaRaquete=Ho(S.metalRed),this.raqueteDele=Ho(S.fabricBlue),this.minhaRaquete.rotation.y=Math.PI/2,this.raqueteDele.rotation.y=-Math.PI/2,this.minhaRaquete.scale.setScalar(1.15),this.raqueteDele.scale.setScalar(1.15),this.grupo.add(this.minhaRaquete,this.raqueteDele),this.resetar()}comecar(){this.meus=0,this.dele=0,this.sacaEu=!0,this.resetar()}guardar(){this.fase="parado",this.grupo.visible=!1}resetar(){this.fase="sacando",this.espera=1.1,this.grupo.visible=!0;const t=this.sacaEu?-1:1;this.bola.position.set(t*(Oe.largura/2-.3),Oe.altura+.45,0),this.v.set(0,0,0),this.minhaRaquete.position.set(-Cs,Oe.altura+.3,0),this.raqueteDele.position.set(Cs,Oe.altura+.3,0),this.zAnterior=0,this.yAnterior=Oe.altura+.3,this.lateralRaquete=0,this.subidaRaquete=0,this.sortearErro()}sortearErro(){const t=Math.random()<.25;this.erroDele=(Math.random()-.5)*(t?1.5:.5)}update(t,e){if(!(this.fase==="parado"||this.fase==="fim")){if(this.moverMinhaRaquete(t,e),this.moverRaqueteDele(t),this.fase==="ponto"||this.fase==="sacando"){this.espera-=t,this.espera<=0&&(this.fase==="ponto"?this.resetar():this.sacar());return}this.voar(t)}}sacar(){this.fase="jogando",this.rebatedor=this.sacaEu?"eu":"ele",this.quiquesNoAlvo=0,this.v.set(this.sacaEu?3.4:-3.4,1.45,(Math.random()-.5)*.6),this.onSom?.("lancar")}moverMinhaRaquete(t,e){const i=De.clamp(e.x*Ms,-Ms,Ms),s=Oe.altura+.16+De.clamp((e.y+.35)*.6,0,.75);this.minhaRaquete.position.z+=(i-this.minhaRaquete.position.z)*Math.min(1,t*18),this.minhaRaquete.position.y+=(s-this.minhaRaquete.position.y)*Math.min(1,t*14);const o=en.velocidadeMaximaRaquete;t>0&&(this.lateralRaquete=De.clamp((this.minhaRaquete.position.z-this.zAnterior)/t,-o,o),this.subidaRaquete=De.clamp((this.minhaRaquete.position.y-this.yAnterior)/t,-o,o)),this.zAnterior=this.minhaRaquete.position.z,this.yAnterior=this.minhaRaquete.position.y}moverRaqueteDele(t){const e=this.v.x>0,i=e?this.bola.position.z+this.erroDele:0,s=e?4.6:1.6;this.raqueteDele.position.z+=(i-this.raqueteDele.position.z)*Math.min(1,t*s),this.raqueteDele.position.z=De.clamp(this.raqueteDele.position.z,-Ms,Ms);const o=e?De.clamp(this.bola.position.y,Oe.altura+.16,Oe.altura+.9):Oe.altura+.3;this.raqueteDele.position.y+=(o-this.raqueteDele.position.y)*Math.min(1,t*4)}voar(t){const e=this.bola.position,i=e.x;if(this.v.y-=y_*t,e.addScaledVector(this.v,t),(i<0&&e.x>=0||i>0&&e.x<=0)&&e.y<M_){this.onSom?.("quicar"),this.marcar(this.rebatedor==="ele","na rede");return}const o=Oe.altura+__,a=Math.abs(e.x)<=Oe.largura/2&&Math.abs(e.z)<=Oe.profundidade/2;if(e.y<=o&&this.v.y<0&&a){if(e.y=o,this.v.y=-this.v.y*b_,this.onSom?.("quicar"),(e.x<0?"eu":"ele")===this.rebatedor){this.marcar(this.rebatedor==="ele","quique no próprio campo");return}if(this.quiquesNoAlvo+=1,this.quiquesNoAlvo>=2){this.marcar(this.rebatedor==="eu","dois quiques");return}}for(const[c,l,h]of[[-1,this.minhaRaquete,"eu"],[1,this.raqueteDele,"ele"]]){const u=c*Cs;!(c<0?i>u&&e.x<=u:i<u&&e.x>=u)||this.rebatedor===h||!(Math.abs(e.z-l.position.z)<ah&&Math.abs(e.y-l.position.y)<ah)||(e.x=u,this.rebater(h==="eu"?1:-1,l.position.y,h==="eu"),this.rebatedor=h,this.quiquesNoAlvo=0,this.onSom?.("pegar"),h==="ele"&&this.sortearErro())}(e.y<.12||Math.abs(e.x)>x_||Math.abs(e.z)>2.2)&&(this.quiquesNoAlvo>=1?this.marcar(this.rebatedor==="eu","não alcançou"):this.marcar(this.rebatedor==="ele","fora"))}rebater(t,e,i){const s=i?this.lateralRaquete:this.miraDoParceiro(),o=i?this.subidaRaquete:0,a=Math.abs(s)+Math.abs(o),r=De.clamp(en.vxBase+a*en.energiaParaVx,en.vxMin,en.vxMax),c=De.clamp(en.vyBase-(e-(Oe.altura+.14))*en.alturaParaVy+o*en.subidaParaVy,en.vyMin,en.vyMax),l=De.clamp(this.v.z*en.heranca+s*en.lateralParaVz,-1.05,en.vzMax);this.v.set(t*r,c,l)}miraDoParceiro(){const t=-this.bola.position.z*1.2,e=(Math.random()-.5)*2.4;return De.clamp(t+e,-4,4)}marcar(t,e){if(t?this.meus+=1:this.dele+=1,this.sacaEu=!t,this.onPonto?.(t,e),this.meus>=this.alvo||this.dele>=this.alvo){this.fase="fim",this.onFim?.(this.meus>=this.alvo);return}this.fase="ponto",this.espera=1.3}}const w_={plano:Cs},rh={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:S.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(n){const t=n.game,e=async L=>{for(const[O,j]of L)await t.say([j],O)},i=Rn.name,s=wn.name,o={x:-8.6,z:2.5},a={x:-21,z:-5,reta:5,raio:5,miolo:2.4},r={x:o.x+4.72,z:o.z+.2},c={x:18,z:-4.5,largura:26,profundidade:19},l={x:-15.5,z:20.5,giro:.35},h=(L,O,j=0)=>Math.abs(L-c.x)<c.largura/2-j&&Math.abs(O-c.z)<c.profundidade/2-j;n.ground({width:240,depth:240,color:S.grass}),n.setBounds(-44,-34,44,32);for(let L=0;L<14;L++)n.disc(n.range(-40,40),n.range(-30,30),n.range(2,6),S.grassDark,.004);n.disc(0,-16.5,8.6,S.sand,.008),n.disc(0,-16.5,8,S.concrete,.012),n.patch(0,4,5.5,56,S.asphalt,0,.016),n.patch(0,9,62,4.5,S.asphalt,0,.02);const u=(L,O,j)=>{n.patch(a.x,a.z,a.reta*2,L*2,O,0,j),n.disc(a.x-a.reta,a.z,L,O,j),n.disc(a.x+a.reta,a.z,L,O,j)},d=.3;u(a.raio,S.metalWhite,.022),u(a.raio-d,S.asphalt,.026),u(a.miolo+d,S.metalWhite,.03),u(a.miolo,S.grass,.034);const p=(a.raio+a.miolo)/2,g=[1.15,.17];for(const L of[-1,1]){for(let j=0;j<5;j++){const K=a.x-a.reta+1+j*(a.reta*2-2)/4;n.patch(K,a.z+L*p,g[0],g[1],S.metalWhite,0,.038)}const O=a.x+L*a.reta;for(let j=0;j<6;j++){const K=-Math.PI/2+(j+.5)/6*Math.PI,_t=L>0?K:K+Math.PI;n.patch(O+Math.cos(_t)*p,a.z+Math.sin(_t)*p,g[0],g[1],S.metalWhite,-(_t+Math.PI/2),.038)}}n.patch(a.x+a.reta*.55,a.z+p,.32,a.raio-a.miolo-d*2,S.metalWhite,0,.04),n.patch(o.x+.4,o.z+.2,10,6.4,S.concrete,0,.02),n.patch(o.x+1.6,7.2,3,7,S.asphalt,0,.022);const v=new g_({radius:12,cabins:32,rpm:1});n.place(v.group,0,0,-26),n.add(v.group),n.blockCircle(0,-26,7.2);for(const L of[-11,11])n.add(n.place(qi(9,1.2,S.metalWhite),L,0,-20,Math.PI/2)),n.blockBox(L,-20,.2,4.5);n.add(n.place(Ev(2.6),-9.5,0,-21,.4)),n.blockCircle(-9.5,-21,2.7);const m=n.add(n.place(Br(S.fabricBlue,{texto:"Bilheteria"}),8.9,0,-20.5,-.5));n.blockBox(8.9,-20.5,1.4,.95,-.5);const f=[[-6.4,-13.6,1.15],[6.4,-13.6,1.15],[-8.6,-17.4,.95],[8.6,-17.4,.95]];for(const[L,O,j]of f)n.add(n.place(wv(j,void 0,n.rng()),L,0,O,n.range(0,6.28))),n.blockCircle(L,O,j+.1);for(const[L,O]of[[-7.6,-11.4],[7.6,-11.4],[-12.2,-19],[12.2,-19]])n.add(n.place(Da(!1),L,0,O)),n.blockCircle(L,O,.35);for(const[L,O,j]of[[-3.6,-12.2,.1],[3.6,-12.2,-.1],[-13.2,-22.5,1.1]])n.banco(L,O,j);for(const[L,O]of[[6.9,-18.9],[-5.2,-11.6]])n.add(n.place(Ul(),L,0,O)),n.blockCircle(L,O,.35);for(let L=0;L<22;L++){const O=L/22*Math.PI*2+n.range(-.1,.1),j=n.range(10.5,13.5),K=Math.cos(O)*j,_t=-18+Math.sin(O)*j*.7;Math.abs(K)<4.5&&_t>-14||(L%3===0?n.add(n.place(Do(n.range(.6,1),S.leafDark),K,0,_t)):L%3===1?n.add(n.place(Dl(n.range(.9,1.4)),K,0,_t,n.range(0,6.28))):n.add(n.place(So(n.range(.4,.8),n.rng()),K,0,_t,n.range(0,6.28))))}n.disc(-21,11,9.2,S.sand,.024),n.disc(-21,11,8.5,S.water,.028),n.blockCircle(-21,11,8.8);const w=[Ua(),Ua(15262416),Ua()];w.forEach((L,O)=>{n.place(L,-21+Math.cos(O*2.1)*4.5,.1,11+Math.sin(O*2.1)*3.5,O*1.7),n.add(L)});const M={x:-21,z:11};for(let L=0;L<34;L++){const O=L/34*Math.PI*2+n.range(-.09,.09),j=n.range(9.1,11.4),K=M.x+Math.cos(O)*j,_t=M.z+Math.sin(O)*j,kt=L%4;kt===0?n.add(n.place(Do(n.range(.6,1),S.leafDark),K,0,_t)):kt===1?n.add(n.place(Dl(n.range(.9,1.5)),K,0,_t,n.range(0,6.28))):kt===2?n.add(n.place(So(n.range(.45,1.5),n.rng()),K,0,_t,n.range(0,6.28))):n.add(n.place(Or(5,.8),K,0,_t))}for(const[L,O,j]of[[.9,8.4,1.6],[2.6,8.7,1.1],[4.3,8.3,1.9],[5.6,8.9,1.2]]){const K=M.x+Math.cos(L)*O,_t=M.z+Math.sin(L)*O;n.add(n.place(So(j,L%1,9409947),K,-.12,_t,L)),n.blockCircle(K,_t,.4*j)}for(const[L,O]of[[1.5,8.2],[3.4,8.4],[5.1,8.1],[.2,8.5]])n.add(n.place(bv(n.range(1.1,1.6)),M.x+Math.cos(L)*O,0,M.z+Math.sin(L)*O));const x=[[1.1,6.6,1,!0],[2.9,7.2,.8,!1],[4.6,6.1,1.15,!0],[.4,7.4,.9,!0],[3.8,5.2,1.05,!1],[5.9,6.8,.85,!0]];for(const[L,O,j,K]of x){const _t=n.place(Sv(j,K),M.x+Math.cos(L)*O,.045,M.z+Math.sin(L)*O);_t.rotation.y=L,n.add(_t)}const C=c.x-c.largura/2,P=c.x+c.largura/2,I=c.z-c.profundidade/2,T=c.z+c.profundidade/2;n.patch(c.x,c.z,c.largura,c.profundidade,S.grassDark,0,.008);const b=(L,O,j,K)=>{n.patch(L,O,j,K,15922416,0,.012)};b(c.x,I+.3,c.largura-1.2,.28),b(c.x,T-.3,c.largura-1.2,.28),b(C+.6,c.z,.28,c.profundidade-.6),b(P-.6,c.z,.28,c.profundidade-.6),b(C+6,c.z,.22,c.profundidade-.6),b(P-6,c.z,.22,c.profundidade-.6),n.ring(c.x,c.z,2.2,.3,15922416,.012),b(c.x,c.z,.28,c.profundidade-.6);const _=(L,O,j,K)=>{n.add(n.place(qi(j,1.5,S.metalWhite),L,0,O,K?Math.PI/2:0)),K?n.blockBox(L,O,.2,j/2):n.blockBox(L,O,j/2,.2)};_(c.x,I,c.largura,!1),_(c.x,T,c.largura,!1),_(P,c.z,c.profundidade,!0),_(C,I+3.75,7.5,!0),_(C,T-3.75,7.5,!0),n.add(n.place(Bl(),C+3,0,c.z)),n.blockCircle(C+3,c.z,.5);const D=n.add(n.place(Bl(S.frisbee),P-3,0,c.z));n.blockCircle(P-3,c.z,.5);const z=n.add(n.place(Ov(),c.x,0,I+1.2));n.blockBox(c.x,I+1.2,1,.2);const B=n.add(n.place(Bv(6),c.x,0,T-1.2,Math.PI));n.blockBox(c.x,T-1.4,3,.8);const V=n.add(n.place(kv(),C+1.6,0,c.z+4.2,Math.PI/2));n.blockCircle(C+1.6,c.z+4.2,.4);const H=n.add(n.place(Vv(),C+1.8,0,c.z-3.4,.4)),J=n.add(n.place(Gv(),P-1.6,0,T-2.4));n.blockCircle(P-1.6,T-2.4,.3);const st=J.userData.manga;n.onUpdate((L,O)=>{J.rotation.y=Math.sin(O*.3)*.5+.6,st.rotation.z=Math.sin(O*1.7)*.12-.06});for(const[L,O]of[[C+1,I+1],[P-1,I+1],[C+1,T-1],[P-1,T-1]])n.add(n.place(Hv(),L,0,O,Math.atan2(c.x-L,c.z-O))),n.blockCircle(L,O,.4);for(const[L,O]of[[C+6,I+1.4],[C+6,T-1.4],[P-6,I+1.4],[P-6,T-1.4]])n.add(n.place(Nl(),L,0,O));const $=n.add(n.place(kl("Frisbee!",S.frisbee),C-1.8,0,c.z+3.4,Math.PI*.25));n.blockCircle(C-1.8,c.z+3.4,.3);const at=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[L,O,j]of at)n.banco(L,O,j);for(const[L,O]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,2]])n.add(n.place(Da(!1),L,0,O)),n.blockCircle(L,O,.35);for(const[L,O]of[[3.4,17],[-3.4,11]])n.add(n.place(Ul(),L,0,O)),n.blockCircle(L,O,.35);const Z=n.add(n.place(Tv(),-10,0,20,.3));n.blockBox(-10,20,1,.9,.3);const yt=Pv(),Wt=Ho(S.metalRed);Wt.position.set(-.78,.82,.3),Wt.rotation.set(-Math.PI/2,0,.7),yt.add(Wt);const te=Ho(S.fabricBlue);te.position.set(.82,.82,-.28),te.rotation.set(-Math.PI/2,0,-2.3),yt.add(te);const he=eu();he.position.set(.36,.845,.42),yt.add(he),n.add(n.place(yt,l.x,0,l.z,l.giro)),n.blockBox(l.x,l.z,1.45,.85,l.giro);const se=[Wt,te,he],rt=n.add(n.place(Br(16164544,{tipo:"sorvete"}),12,0,18.6,.3));n.blockBox(12,18.6,1.4,.95,.3);const dt=n.add(n.place(Rv(S.fabricBlue),o.x,0,o.z));dt.userData.loja=!0,n.blockBox(o.x,o.z-.05,3.7,2.3),n.blockBox(r.x,r.z,.65,1.6);for(const L of[-1,1])n.blockCircle(o.x+L*4.05,o.z+2.82,.16);for(const L of[-1.4,1])n.banco(o.x-5.6,o.z+L,Math.PI/2);for(const[L,O]of[[a.x-a.reta-a.raio-1.4,a.z],[a.x+a.reta+a.raio+1.4,a.z]])n.add(n.place(Da(!1),L,0,O)),n.blockCircle(L,O,.35);const It=14;for(let L=0;L<It;L++){const O=L/It*Math.PI*2,j=L%2===0?a.miolo+.9:a.raio-.9,K=a.x+Math.cos(O)*j+Math.sign(Math.cos(O))*a.reta*Math.abs(Math.cos(O)),_t=a.z+Math.sin(O)*j;n.add(n.place(Nl(),K,0,_t,n.range(0,6.28)))}n.interact({id:"parque:patins",x:r.x+1.8,z:r.z,radius:2.4,label:"Alugar patins",icon:"🛼",highlight:dt,onInteract:async L=>{if(L.hasItem(Jt.patins.id)){await e([[s,"A gente já pegou um par."],[i,"É, e eu ainda não caí. Ainda."]]);return}await e([[s,"Um par pra cada um, moço."],[i,"Eu não sei patinar direito, hein."],[s,"Por isso eu vou do seu lado."]]),L.equipWearable(Jt.patins),L.som("sorvete"),L.toast("Patins calçados","🛼"),L.unlock({id:"patins-villa",title:"Patins no Villa",place:"Parque Villa Lobos",note:"A pista tem cone pra desviar e a gente desviou de quase todos.",icon:"🛼"})}});const Ht=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8],[-21,-5,12],[-8.6,2.5,9]],zt=(L,O)=>Math.abs(L)<4&&O>-20&&O<30?!1:!Ht.some(([j,K,_t])=>Math.hypot(L-j,O-K)<_t),ee=["redonda","redonda","pinheiro","florida","palmeira"];let me=0;for(let L=0;L<260&&me<64;L++){const O=n.range(-42,42),j=n.range(-32,30);if(!zt(O,j))continue;const K=n.range(.85,1.5);n.add(n.place(Fr(n.pick(ee),K,n.rng()),O,0,j,n.range(0,6.28))),n.blockCircle(O,j,.45*K),me++}for(let L=0;L<90;L++){const O=n.range(-42,42),j=n.range(-32,30);zt(O,j)&&(L%3===0?n.add(n.place(Or(6,1.1),O,0,j)):L%3===1?n.add(n.place(Do(n.range(.7,1.2)),O,0,j)):n.add(n.place(So(n.range(.5,1)),O,0,j)))}n.patch(-66,-10,18,220,S.water,0,.02),n.patch(-55,-10,6,220,S.concrete,0,.03);for(let L=0;L<22;L++){const O=n.range(7,20),j=n.range(4,9);n.add(n.place(kr(j,O,j*.9,n.pick([S.wallCream,S.concrete,S.wallMint]),S.metalGrey),n.range(-95,60),0,-96-n.range(0,16)))}for(let L=0;L<14;L++){const O=n.range(6,16);n.add(n.place(kr(n.range(4,8),O,5,S.wallCream,S.roofTile),92+n.range(0,16),0,n.range(-60,40)))}for(let L=0;L<90;L++){const O=L/90*Math.PI*2,j=62+n.range(0,28),K=Math.cos(O)*j,_t=Math.sin(O)*j*.9;K<-50||n.add(n.place(Fr(n.pick(ee),n.range(1.2,2.2),n.rng()),K,0,_t,n.range(0,6.28)))}for(let L=0;L<9;L++){const O=tu(n.range(1.6,3.2));O.position.set(n.range(-70,70),n.range(56,70),n.range(-60,45)),n.root.add(O);const j=n.range(.25,.6);n.onUpdate(K=>{O.position.x+=j*K,O.position.x>56&&(O.position.x=-56)})}const F=n.add(n.place(Av(S.wood,S.metalWhite),2.6,0,27.5,Math.PI));n.add(n.place(qi(16,1.4),-10,0,28)),n.add(n.place(qi(16,1.4),10,0,28)),n.blockBox(-10,28,8,.2),n.blockBox(10,28,8,.2),n.add(n.place(qi(11,1.4),35,0,3.5,Math.PI/2)),n.add(n.place(qi(11,1.4),35,0,22.5,Math.PI/2)),n.blockBox(35,3.5,.2,5.5),n.blockBox(35,22.5,.2,5.5),n.patch(29.5,13,11,5,S.asphalt,0,.01),n.patch(35.6,13,1.6,34,S.concrete,0,.014),n.patch(40.8,13,8.8,34,S.asphalt,0,.018);const ft=n.add(n.place(su(4161494),39.5,0,13,-Math.PI/2));n.blockBox(39.5,13,1.5,4.3);const ht=n.add(n.place(qv(),36.4,0,13,-Math.PI/2));n.blockBox(35.9,13,.3,1.8);const ct=n.add(n.place(kl("Clube!",5161384),36.4,0,8.6,Math.PI*.25));n.blockCircle(36.4,8.6,.3),n.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:ft,radius:2.6}),n.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:F,radius:2.2});const Y=new v_(S.frisbee);Y.mesh.visible=!1,Y.onLand=()=>t.som("quicar"),n.root.add(Y.mesh);const bt=Fv();bt.visible=!1,bt.userData.mira=!0,n.root.add(bt);const vt=1.3,wt=.12,Xt=4,Zt=22,U=.06,E={alem:3.5,arco:1.2,erro:.06,desvio:1.4,alcance:3,raio:2.1,mira:.12},X={minX:C+1.7,minZ:I+1.7,maxX:P-1.7,maxZ:T-1.7},Q=(L,O,j)=>Math.max(O,Math.min(j,L)),ut=(L,O)=>Math.atan2(Math.sin(L-O),Math.cos(L-O)),it=(L,O)=>Math.hypot(L.x-O.x,L.z-O.z),Ft=[],St=(L,O,j,K,_t)=>{const kt=n.add(n.place(zv(_t,j),L,0,O,Math.PI/2));n.blockCircle(L,O+.96,.36),n.blockCircle(L,O,.75),Ft.push({centro:new N(L,j,O),raio:.58,pontos:K,roda:kt.userData.aro??null,recarga:0})};St(13,-9.4,1.9,1,S.frisbee),St(23,1.4,2.1,2,S.gold),St(18,-.6,2.5,3,S.frisbee);const Ot=(L,O,j)=>{const K=O.x-L.x,_t=O.y-L.y,kt=O.z-L.z,oe=K*K+_t*_t+kt*kt;if(oe<1e-8)return j.distanceTo(L);const Yt=Q(((j.x-L.x)*K+(j.y-L.y)*_t+(j.z-L.z)*kt)/oe,0,1);return Math.hypot(j.x-(L.x+K*Yt),j.y-(L.y+_t*Yt),j.z-(L.z+kt*Yt))},Bt=(L,O)=>{for(const j of Ft)j.recarga>0||Ot(L,O,j.centro)>j.raio||(j.recarga=1.6,t.som("sino"),t.bump("frisbee.alvos",j.pontos),t.toast(`+${j.pontos} no alvo!`,"🎯"))},xt=L=>{for(const O of Ft)O.recarga<=0||(O.recarga=Math.max(0,O.recarga-L),O.roda&&(O.roda.rotation.z+=L*9*O.recarga))};let mt="fora",Gt=0,Nt=0,At=!1,qt=0,k=null;const Mt=new N,Et=new N;let Lt=!1,pt=null,lt=0,Dt=!1,jt=!0,pe=0;const ce=L=>{t.toast(L[Math.floor(Math.random()*L.length)],"💬")},on=(L,O)=>{const j=Math.sin(O),K=Math.cos(O),_t=j>.001?(X.maxX-L.x)/j:j<-.001?(X.minX-L.x)/j:1/0,kt=K>.001?(X.maxZ-L.z)/K:K<-.001?(X.minZ-L.z)/K:1/0;return Q(Math.min(_t,kt)-1,Xt+3,Zt)},Ke=(L,O,j)=>Xt+(on(L,O)-Xt)*Q(j,0,1),qs=(L,O,j)=>{const K=on(L,O);return Q((j-Xt)/Math.max(.01,K-Xt),0,1)},pn=(L,O,j)=>{const K=qs(L,O,Math.hypot(j.x-L.x,j.z-L.z));return K>.02&&K<.99?K:null},hs=L=>1.35-.45*Q(L,0,1),ci=(L,O)=>{L.som("pegar"),qt+=1;const j=L.bump("frisbee.trocas"),K=L.stat("frisbee.recorde");qt>K&&L.bump("frisbee.recorde",qt-K),O?L.toast("Pegou no ar!","🥏"):qt%5===0&&L.toast(`${qt} trocas seguidas!`,"🥏"),j>=10&&!L.flag("memoria-frisbee")&&(L.setFlag("memoria-frisbee"),L.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"})),qt>=10&&!L.flag("memoria-frisbee-dez")&&(L.setFlag("memoria-frisbee-dez"),L.unlock({id:"frisbee-dez",title:"Dez sem deixar cair",place:"Parque Villa Lobos",note:"Dez trocas seguidas e nenhuma no chão. A gente parou porque deu fome, não porque errou.",icon:"🏆"}))},Ws=L=>{const O=L.x<c.x?1:-1;return{x:Q(L.x+O*11,C+2,P-2),z:Q(L.z,I+2,T-2)}},jn=()=>{At=!1,Nt=0,bt.visible=!1,t.showCharge(null)},us=()=>t.getActiveHandItem()?.id===Jt.frisbee.id;let Yn=!1;const Xs=()=>{const L=t.addItem(Jt.frisbee);return L==="cheio"?(Yn||(Yn=!0,t.toast("Sem vaga pro frisbee","🥏")),!1):(mt="comigo",Y.pickUp(),qt=0,k=null,t.setZoom(19),t.toast(L==="mao"?"Segure F e solte no traço da barra":"Frisbee guardado — escolha ele na mochila (I)","🥏"),!0)},js=()=>{mt="fora",Yn=!1,t.removeItem(Jt.frisbee.id),Y.mesh.visible=!1,jn(),t.freeCompanion(),t.setZoom(14),k=null,pt=null},Ys=(L,O=0,j=!0)=>{if(mt!=="comigo"||!us())return;t.removeItem(Jt.frisbee.id);const K=t.playerPosition(),_t=t.playerFacing(),kt=Q(L,0,1),oe=pn(K,_t,t.companionPosition());Lt=j&&oe!==null&&Math.abs(kt-oe)<=U,Mt.copy(K),Et.copy(t.companionPosition()),Y.throwAt(K,_t,Ke(K,_t,kt),hs(kt),O),t.som("lancar"),Dt=!1,jt=!0,pt=null,lt=0,mt="voando-pra-ele"},Zs=()=>{const L=pn(t.playerPosition(),t.playerFacing(),t.companionPosition());Ys(L??.5,0,!1)},ds=n.interact({id:"parque:frisbee-jogar",x:c.x,z:c.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>Zs()}),fs=n.interact({id:"parque:frisbee-pegar",x:c.x,z:c.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:L=>{L.addItem(Jt.frisbee)!=="cheio"&&(Y.pickUp(),mt="comigo",ci(L,!1))}});n.onUpdate((L,O)=>{const j=Y.position.clone();Y.update(L,X);const K=t.playerPosition(),_t=t.companionPosition(),kt=t.playerFacing(),oe=h(K.x,K.z,.4);if(oe&&mt==="fora"?Xs():!oe&&mt!=="fora"&&js(),mt==="fora"){ds.enabled=!1,fs.enabled=!1,bt.visible=!1,pe=kt;return}if(Y.state==="voando"&&Bt(j,Y.position),xt(L),mt==="comigo"&&us()){if(t.keyDown("KeyF")){At=!0,Nt=Math.min(1,Nt+L/vt),t.showCharge(Nt,pn(K,kt,_t),U);const Yt=Ke(K,kt,Nt);bt.position.set(K.x+Math.sin(kt)*Yt,0,K.z+Math.cos(kt)*Yt),bt.scale.setScalar(1+Math.sin(O*9)*.06),bt.visible=!0}else if(At){const Yt=Nt,$t=L>1e-4?ut(kt,pe)/L:0;jn(),Yt<wt?Zs():Ys(Yt,Q($t*.18,-2.5,2.5))}}else At&&jn();if(pe=kt,mt==="comigo"||mt==="no-chao"){const Yt=Ws(K);(!k||Math.hypot(Yt.x-k.x,Yt.z-k.z)>2.5)&&(t.commandCompanion(Yt.x,Yt.z),k=Yt)}switch(Y.mesh.userData.fase=mt,mt){case"comigo":Y.holdAt(K,kt),Y.mesh.visible=!1;break;case"com-ele":{const Yt=Math.atan2(K.x-_t.x,K.z-_t.z);t.holdCompanion(K.x,K.z),Y.holdAt(_t,Yt),Gt-=L;const $t=Math.abs(ut(t.companionFacing(),Yt))<E.mira;if(Gt<=0&&($t||Gt<-1)){const Vt=K.x-_t.x,xe=K.z-_t.z,le=Math.hypot(Vt,xe)||1,Le=Math.random(),Zn=Le<.3?E.arco*1.35:Le>.85?.95:E.arco,Ve=Le>.85?E.erro*2.5:E.erro,li=new N(Q(K.x+Vt/le*E.alem+(Math.random()-.5)*E.desvio,C+1.5,P-1.5),0,Q(K.z+xe/le*E.alem+(Math.random()-.5)*E.desvio,I+1.5,T-1.5));Y.throwToward(_t,li,Ve,Zn,(Math.random()-.5)*1),t.som("lancar"),k=null,mt="voando-pra-mim"}break}case"voando-pra-ele":{if(lt-=L,Y.state==="voando"&&lt<=0){lt=.25;const $t=Y.ondeVaiCair(X);(!pt||pt.distanceTo($t)>.8)&&(pt=$t,t.commandCompanion($t.x,$t.z),k=null)}const Yt=Y.state==="voando"&&Y.position.y<2.3&&it(Mt,Y.position)>2&&Math.hypot(Y.position.x-_t.x,Y.position.z-_t.z)<1.5;if(Yt&&!Dt){Dt=!0;const $t=it(Et,Y.position),Vt=Q(.98-Y.rasante*.022-$t*.02+(Lt?.2:0),.35,.98);jt=Math.random()<Vt}if(Yt&&jt){t.som("pegar"),t.holdCompanion(K.x,K.z),k=null,pt=null;const $t=Math.round(it(Mt,Y.position));Y.pickUp(),Gt=.7,mt="com-ele",Lt?(t.som("confirma"),t.bump("frisbee.perfeitos"),t.toast("Passe perfeito!","🎯"),ce(["Na mão! Perfeito.","Esse foi bonito, hein.","Assim fica fácil."])):(t.toast("Ele pegou no ar!","🙌"),ce(["Peguei!","Isso! Manda de novo.","Tá vendo? Sou bom nisso."]));const Vt=t.stat("frisbee.maiorPasse");$t>Vt&&(t.bump("frisbee.maiorPasse",$t-Vt),t.toast(`Novo recorde: ${$t} m`,"📏"));break}Y.state==="chao"&&(Dt&&!jt?ce(["Ah, escapou!","Raspou na minha mão!","Essa eu deixei, admito."]):it(Mt,Y.position)>16&&ce(["Calma, não sou cachorro!","Jogou pra longe demais.","Vou ter que correr até lá?"]),qt=0,Y.position.distanceTo(_t)<1.6?(t.holdCompanion(K.x,K.z),k=null,pt=null,Y.pickUp(),Gt=.8,mt="com-ele"):(t.commandCompanion(Y.position.x,Y.position.z),k=null,mt="buscando"));break}case"buscando":Y.position.distanceTo(_t)<1.1&&(t.holdCompanion(K.x,K.z),k=null,pt=null,Y.pickUp(),Gt=.9,mt="com-ele");break;case"voando-pra-mim":{if(Y.state==="voando"&&Y.position.y<E.alcance&&Math.hypot(Y.position.x-K.x,Y.position.z-K.z)<E.raio){if(t.addItem(Jt.frisbee)==="cheio")break;Y.pickUp(),mt="comigo",ci(t,!0);break}Y.state==="chao"&&(mt="no-chao",qt=0,Y.position.distanceTo(K)<1.9&&t.addItem(Jt.frisbee)!=="cheio"&&(Y.pickUp(),mt="comigo",ci(t,!1)));break}case"no-chao":Y.position.distanceTo(K)<1.2&&t.addItem(Jt.frisbee)!=="cheio"&&(Y.pickUp(),mt="comigo",ci(t,!1));break}ds.enabled=mt==="comigo"&&!At,fs.enabled=mt==="no-chao",mt==="comigo"?ds.moveTo(K.x,K.z):fs.moveTo(Y.position.x,Y.position.z)}),n.interact({id:"parque:placa-quadra",x:C-1.8,z:c.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:$,onInteract:()=>e([[s,"QUADRA LIVRE — respeite quem chegou primeiro."],[i,"Hoje só tem a gente."],[s,"Então segura o F. A marca no chão mostra onde o disco vai cair, e o traço na barra é onde eu estou."],[i,"E se eu quiser mostrar serviço?"],[s,"Acerta um dos aros. Ou uma cesta, se estiver se achando."]])}),n.interact({id:"parque:placar",x:c.x,z:I+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:z,onInteract:L=>{const O=L.stat("frisbee.recorde"),j=L.stat("frisbee.trocas"),K=L.stat("frisbee.perfeitos"),_t=L.stat("frisbee.alvos"),kt=L.stat("frisbee.maiorPasse"),oe=[[i,O>0?`Nosso recorde é ${O} trocas seguidas.`:"O placar tá zerado."],[s,j>0?`E já foram ${j} no total. A gente não desiste fácil.`:"Bora estrear isso então."]];return kt>0&&oe.push([i,`O passe mais longo que colou foi de ${kt} metros.`]),K>0&&oe.push([s,`${K} ${K===1?"passe caiu":"passes caíram"} certinho na minha mão.`]),_t>0&&oe.push([i,`E ${_t} ${_t===1?"ponto":"pontos"} nos alvos. Anota aí.`]),e(oe)}}),n.interact({id:"parque:arquibancada",x:c.x,z:T-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:B,onInteract:()=>e([[s,"Cansei. Cinco minutos."],[i,"Você falou cinco minutos faz meia hora."],[s,"E olha que descanso bem, hein."]])}),n.interact({id:"parque:bebedouro",x:C+2.8,z:c.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:V,onInteract:async L=>{await e([[i,"A água daqui é sempre meio quente."],[s,"Mas depois de correr atrás de disco, tá ótima."]]),L.toast("Água (meio quente)","🚰")}}),n.interact({id:"parque:sacola",x:C+2.8,z:c.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:H,onInteract:()=>e([[s,"Tem uns três discos aqui de gente que esqueceu."],[i,"Um deles é seu. Desde março."],[s,"…é, pode ser."]])}),n.interact({id:"parque:cesta",x:P-4.4,z:c.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:D,onInteract:()=>e([[i,"Um dia a gente acerta essa cesta."],[s,"Já acertei uma vez!"],[i,"Você acertou o poste. É diferente."]])}),n.interact({id:"parque:biruta",x:P-3,z:T-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:J,onInteract:()=>e([[s,"O vento tá indo pra lá."],[i,"Então joga contra que o disco fica no ar mais tempo."],[s,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),n.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:ht,onInteract:()=>e([[i,"Esse é o que passa no clube?"],[s,"É esse. Já tá parado, é só subir."]])}),n.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:ct,onInteract:()=>e([[s,'"Clube!" — com exclamação e tudo.'],[i,"Quem escreveu isso tava animado."]])}),n.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async L=>{L.som("pato"),await L.say(["Que lago bonito... dá até vontade de pular"],wn.name),await L.say(["Então vamos! Hahahha"],Rn.name),await L.say(["NÃAAOOO"],wn.name),L.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});let Pi=0;n.onUpdate(L=>{Pi<=0||(Pi-=L,Pi<=0&&(t.removeItem(Jt.sorveteMorango.id,Rn.id),t.removeItem(Jt.sorveteMaracuja.id,wn.id),t.toast("Acabou o sorvete","🍦")))});const ke=new S_(5);ke.guardar(),yt.add(ke.grupo),ke.onSom=L=>t.som(L),yt.userData.pingpong=ke;const R=(L,O)=>{const j=new N(L,0,O);return yt.localToWorld(j),j};let q=!1;const tt=w_.plano+.55,et=()=>{q=!1,ke.guardar();for(const L of se)L.visible=!0;t.showPlacar(null),t.setCameraOmbro(null),t.setPlayerVisible(!0),t.lockPlayer(!1),t.freeCompanion(),W.enabled=!0};n.onUpdate(L=>{q&&(ke.update(L,t.pointer()),q&&t.showPlacar({eu:t.playerName(),ele:t.companionName(),meus:ke.meus,dele:ke.dele}))});const W=n.interact({id:"parque:pingpong",x:l.x,z:l.z,radius:2.6,label:"Jogar ping pong",icon:"🏓",highlight:yt,onInteract:async L=>{if(q)return;await e([[i,"Cinco pontos?"],[s,"Cinco pontos. E o perdedor carrega a bolsa até em casa."]]);const O=R(-tt,0),j=R(tt,0);L.releasePlayer(O.x,O.z,Math.atan2(j.x-O.x,j.z-O.z)),L.releaseCompanion(j.x,j.z,Math.atan2(O.x-j.x,O.z-j.z)),L.holdCompanion(O.x,O.z),L.lockPlayer(!0);const K=R(-tt-1.6,0),_t=R(0,0);L.setCameraOmbro(new N(K.x,2.35,K.z),new N(_t.x,.9,_t.z)),L.setPlayerVisible(!1);for(const kt of se)kt.visible=!1;W.enabled=!1,ke.comecar(),q=!0,L.toast("Mexa o mouse para mover a raquete","🏓")}});ke.onPonto=L=>{t.som(L?"confirma":"quicar")},ke.onFim=L=>{(async()=>(et(),L?(t.som("memoria"),t.toast("Campeão de ping pong!","🏆"),t.equipWearable(Jt.chapeuPingPong),await e([[i,"Cinco a "+ke.dele+"."],[s,"Você ganhou o chapéu. Vai ter que usar."]]),t.unlock({id:"memoria-ping-pong",title:"A mesa do parque",place:"Parque Villa Lobos",note:"Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.",icon:"🏓"})):await e([[s,"Cinco a "+ke.meus+". Revanche?"],[i,"Sempre revanche."]])))()},n.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:rt,onInteract:async L=>{await e([[i,"Dois, por favor."],[s,"Um de morango e um de maracujá."],[i,"Nunca pedimos diferente."]]),Pi=50,L.addItem(Jt.sorveteMorango,Rn.id),L.addItem(Jt.sorveteMaracuja,wn.id),L.som("sorvete"),L.toast("Morango e maracujá","🍦"),L.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),n.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:Z,onInteract:async L=>{await e([[s,"A toalha xadrez de sempre."],[i,"E o pão de queijo já frio."],[s,"Frio é melhor. Aceita."]]),L.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),n.interact({id:"parque:bilheteria",x:8.9,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:m,onInteract:()=>e([[i,"Dois pra roda gigante."],[s,"Sempre dois."]])});let gt=null;const Ct=L=>new Promise(O=>{gt={resolve:O,de:v.angle,voltas:L}});let Ut=!0;n.onUpdate(L=>{if(v.update(L),Ut){const O=t.playerPosition(),j=Math.hypot(O.x,O.z+26);if(j<28){const K=Math.max(0,Math.min(1,(j-8)/20));t.setZoom(36-K*21)}}if(w.forEach((O,j)=>{O.position.y=.1+Math.sin(performance.now()/900+j)*.05}),gt&&v.turnsSince(gt.de)>=gt.voltas){const O=gt.resolve;gt=null,O()}}),n.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async L=>{Ut=!1,L.lockPlayer(!0),await e([[s,"A fila tá curta hoje."],[i,"Bora subir?"]]);const O=v.boardingCabin(),j=v.speed;v.speed=j*5,L.som("sino"),L.ridePlayer(O,new N(-.3,-.34,0),.55),L.rideCompanion(O,new N(.3,-.34,0),.55),L.focusCamera(O),L.setZoom(38),await Ct(.25),await e([[i,"Daqui dá pra ver o parque inteiro."],[s,"E aquele pedacinho do rio ali atrás."]]),await Ct(.35),await e([[i,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[s,"Pronto. Subimos."]]),await Ct(.4),v.speed=j,L.focusCamera(null),L.releasePlayer(0,-17.6,0),L.releaseCompanion(-1.1,-17.9,0),L.lockPlayer(!1),Ut=!0,L.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},E_={[Qr.id]:Qr,[sh.id]:sh,[rh.id]:rh,[eh.id]:eh},T_=Qr.id,fu=document.getElementById("app");if(!fu)throw new Error("#app nao encontrado");const $o=new W1(fu,E_,h_,T_),Gs=new URLSearchParams(location.search),A_=Gs.get("cena")??void 0,C_=Gs.get("entrada")??void 0;$o.start(A_,C_);const Ga=Number(Gs.get("zoom"));Number.isFinite(Ga)&&Ga>0&&$o.setZoom(Ga);const ys=Gs.get("em")?.split(",").map(Number);if(ys&&ys.length===2&&ys.every(Number.isFinite)){const n=Number(Gs.get("olhar"));$o.debugPlace(ys[0],ys[1],Number.isFinite(n)?n:Math.PI/4)}window.jogo=$o;window.aristoryAudio={Musica:uu,CLIMAS:zo,EFEITOS:hu};window.aristoryItens=Object.fromEntries(Object.values(Jt).map(n=>[n.id,n]));window.aristoryMemorias=jr.map(n=>({id:n.id,titulo:n.titulo}));
