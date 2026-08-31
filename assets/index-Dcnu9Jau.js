(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ir="180",Vh=0,$r=1,Gh=2,Dl=1,Ul=2,Ln=3,kn=0,Ye=1,mn=2,Kn=0,ki=1,Qr=2,tc=3,ec=4,Wh=5,ui=100,qh=101,Xh=102,Yh=103,jh=104,Jh=200,Zh=201,Kh=202,$h=203,ya=204,Sa=205,Qh=206,tu=207,eu=208,nu=209,iu=210,su=211,ou=212,au=213,ru=214,ba=0,wa=1,Ea=2,Vi=3,Ta=4,Aa=5,Ca=6,Ra=7,Nl=0,cu=1,lu=2,$n=0,hu=1,uu=2,du=3,fu=4,pu=5,mu=6,gu=7,Fl=300,Gi=301,Wi=302,Pa=303,Ia=304,Eo=306,La=1e3,fi=1001,Da=1002,Ge=1003,vu=1004,Ls=1005,yn=1006,Do=1007,pi=1008,En=1009,Ol=1010,zl=1011,vs=1012,Lr=1013,gi=1014,Nn=1015,Cs=1016,Dr=1017,Ur=1018,_s=1020,Bl=35902,kl=35899,Hl=1021,Vl=1022,_n=1023,xs=1026,Ms=1027,Nr=1028,Fr=1029,Gl=1030,Or=1031,zr=1033,co=33776,lo=33777,ho=33778,uo=33779,Ua=35840,Na=35841,Fa=35842,Oa=35843,za=36196,Ba=37492,ka=37496,Ha=37808,Va=37809,Ga=37810,Wa=37811,qa=37812,Xa=37813,Ya=37814,ja=37815,Ja=37816,Za=37817,Ka=37818,$a=37819,Qa=37820,tr=37821,er=36492,nr=36494,ir=36495,sr=36283,or=36284,ar=36285,rr=36286,_u=3200,xu=3201,Wl=0,Mu=1,Jn="",nn="srgb",qi="srgb-linear",_o="linear",_e="srgb",Si=7680,nc=519,yu=512,Su=513,bu=514,ql=515,wu=516,Eu=517,Tu=518,Au=519,ic=35044,sc="300 es",Sn=2e3,xo=2001;class ji{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,a=s.length;o<a;o++)s[o].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let oc=1234567;const ds=Math.PI/180,ys=180/Math.PI;function Mi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]).toLowerCase()}function ne(i,t,e){return Math.max(t,Math.min(e,i))}function Br(i,t){return(i%t+t)%t}function Cu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Ru(i,t,e){return i!==t?(e-i)/(t-i):0}function fs(i,t,e){return(1-e)*i+e*t}function Pu(i,t,e,n){return fs(i,t,1-Math.exp(-e*n))}function Iu(i,t=1){return t-Math.abs(Br(i,t*2)-t)}function Lu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Du(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Uu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Nu(i,t){return i+Math.random()*(t-i)}function Fu(i){return i*(.5-Math.random())}function Ou(i){i!==void 0&&(oc=i);let t=oc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function zu(i){return i*ds}function Bu(i){return i*ys}function ku(i){return(i&i-1)===0&&i!==0}function Hu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Vu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Gu(i,t,e,n,s){const o=Math.cos,a=Math.sin,r=o(e/2),c=a(e/2),l=o((t+n)/2),h=a((t+n)/2),u=o((t-n)/2),d=a((t-n)/2),f=o((n-t)/2),g=a((n-t)/2);switch(s){case"XYX":i.set(r*h,c*u,c*d,r*l);break;case"YZY":i.set(c*d,r*h,c*u,r*l);break;case"ZXZ":i.set(c*u,c*d,r*h,r*l);break;case"XZX":i.set(r*h,c*g,c*f,r*l);break;case"YXY":i.set(c*f,r*h,c*g,r*l);break;case"ZYZ":i.set(c*g,c*f,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function zi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function He(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ue={DEG2RAD:ds,RAD2DEG:ys,generateUUID:Mi,clamp:ne,euclideanModulo:Br,mapLinear:Cu,inverseLerp:Ru,lerp:fs,damp:Pu,pingpong:Iu,smoothstep:Lu,smootherstep:Du,randInt:Uu,randFloat:Nu,randFloatSpread:Fu,seededRandom:Ou,degToRad:zu,radToDeg:Bu,isPowerOfTwo:ku,ceilPowerOfTwo:Hu,floorPowerOfTwo:Vu,setQuaternionFromProperEuler:Gu,normalize:He,denormalize:zi};class bt{constructor(t=0,e=0){bt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,a=this.y-t.y;return this.x=o*n-a*s+t.x,this.y=o*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ji{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,a,r){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=o[a+0],f=o[a+1],g=o[a+2],_=o[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(r===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==f||h!==g){let m=1-r;const p=c*d+l*f+h*g+u*_,T=p>=0?1:-1,w=1-p*p;if(w>Number.EPSILON){const I=Math.sqrt(w),E=Math.atan2(I,p*T);m=Math.sin(m*E)/I,r=Math.sin(r*E)/I}const M=r*T;if(c=c*m+d*M,l=l*m+f*M,h=h*m+g*M,u=u*m+_*M,m===1-r){const I=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=I,l*=I,h*=I,u*=I}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,o,a){const r=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=o[a],d=o[a+1],f=o[a+2],g=o[a+3];return t[e]=r*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-r*f,t[e+2]=l*g+h*f+r*d-c*u,t[e+3]=h*g-r*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(n/2),h=r(s/2),u=r(o/2),d=c(n/2),f=c(s/2),g=c(o/2);switch(a){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+r+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(o-l)*f,this._z=(a-s)*f}else if(n>r&&n>u){const f=2*Math.sqrt(1+n-r-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+a)/f,this._z=(o+l)/f}else if(r>u){const f=2*Math.sqrt(1+r-n-u);this._w=(o-l)/f,this._x=(s+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-r);this._w=(a-s)/f,this._x=(o+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+a*r+s*l-o*c,this._y=s*h+a*c+o*r-n*l,this._z=o*h+a*l+n*c-s*r,this._w=a*h-n*r-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,a=this._w;let r=a*t._w+n*t._x+s*t._y+o*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=n,this._y=s,this._z=o,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=a*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=o*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ac.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ac.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,a=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*a,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*a,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*s-r*n),h=2*(r*e-o*s),u=2*(o*n-a*e);return this.x=e+c*l+a*u-r*h,this.y=n+c*h+r*l-o*u,this.z=s+c*u+o*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,a=e.x,r=e.y,c=e.z;return this.x=s*c-o*r,this.y=o*a-n*c,this.z=n*r-s*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Uo.copy(this).projectOnVector(t),this.sub(Uo)}reflect(t){return this.sub(Uo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Uo=new U,ac=new Ji;class $t{constructor(t,e,n,s,o,a,r,c,l){$t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,a,r,c,l)}set(t,e,n,s,o,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=r,h[3]=e,h[4]=o,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,a=n[0],r=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],T=s[1],w=s[4],M=s[7],I=s[2],E=s[5],A=s[8];return o[0]=a*_+r*T+c*I,o[3]=a*m+r*w+c*E,o[6]=a*p+r*M+c*A,o[1]=l*_+h*T+u*I,o[4]=l*m+h*w+u*E,o[7]=l*p+h*M+u*A,o[2]=d*_+f*T+g*I,o[5]=d*m+f*w+g*E,o[8]=d*p+f*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-n*o*h+n*r*c+s*o*l-s*a*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=h*a-r*l,d=r*c-h*o,f=l*o-a*c,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(r*n-s*a)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*o-r*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(a*e-n*o)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,a,r){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*a+l*r)+a+t,-s*l,s*c,-s*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(No.makeScale(t,e)),this}rotate(t){return this.premultiply(No.makeRotation(-t)),this}translate(t,e){return this.premultiply(No.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const No=new $t;function Xl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Mo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Wu(){const i=Mo("canvas");return i.style.display="block",i}const rc={};function Ss(i){i in rc||(rc[i]=!0,console.warn(i))}function qu(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}const cc=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),lc=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xu(){const i={enabled:!0,workingColorSpace:qi,spaces:{},convert:function(s,o,a){return this.enabled===!1||o===a||!o||!a||(this.spaces[o].transfer===_e&&(s.r=zn(s.r),s.g=zn(s.g),s.b=zn(s.b)),this.spaces[o].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[o].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===_e&&(s.r=Hi(s.r),s.g=Hi(s.g),s.b=Hi(s.b))),s},workingToColorSpace:function(s,o){return this.convert(s,this.workingColorSpace,o)},colorSpaceToWorking:function(s,o){return this.convert(s,o,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Jn?_o:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,o=this.workingColorSpace){return s.fromArray(this.spaces[o].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,o,a){return s.copy(this.spaces[o].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,o){return Ss("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,o)},toWorkingColorSpace:function(s,o){return Ss("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,o)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[qi]:{primaries:t,whitePoint:n,transfer:_o,toXYZ:cc,fromXYZ:lc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:t,whitePoint:n,transfer:_e,toXYZ:cc,fromXYZ:lc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}}),i}const fe=Xu();function zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Hi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let bi;class Yu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{bi===void 0&&(bi=Mo("canvas")),bi.width=t.width,bi.height=t.height;const s=bi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=bi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Mo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let a=0;a<o.length;a++)o[a]=zn(o[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zn(e[n]/255)*255):e[n]=zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let ju=0;class kr{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Mi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let a=0,r=s.length;a<r;a++)s[a].isDataTexture?o.push(Fo(s[a].image)):o.push(Fo(s[a]))}else o=Fo(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function Fo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Yu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Ju=0;const Oo=new U;class Be extends ji{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,n=fi,s=fi,o=yn,a=pi,r=_n,c=En,l=Be.DEFAULT_ANISOTROPY,h=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=Mi(),this.name="",this.source=new kr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new bt(0,0),this.repeat=new bt(1,1),this.center=new bt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Oo).x}get height(){return this.source.getSize(Oo).y}get depth(){return this.source.getSize(Oo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Fl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case La:t.x=t.x-Math.floor(t.x);break;case fi:t.x=t.x<0?0:1;break;case Da:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case La:t.y=t.y-Math.floor(t.y);break;case fi:t.y=t.y<0?0:1;break;case Da:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=Fl;Be.DEFAULT_ANISOTROPY=1;class Re{constructor(t=0,e=0,n=0,s=1){Re.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*o,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*o,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*o,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(l+1)/2,M=(f+1)/2,I=(p+1)/2,E=(h+d)/4,A=(u+_)/4,C=(g+m)/4;return w>M&&w>I?w<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(w),s=E/n,o=A/n):M>I?M<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(M),n=E/s,o=C/s):I<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(I),n=A/o,s=C/o),this.set(n,s,o,e),this}let T=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(u-_)/T,this.z=(d-h)/T,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Zu extends ji{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);const s={width:t,height:e,depth:n.depth},o=new Be(s);this.textures=[];const a=n.count;for(let r=0;r<a;r++)this.textures[r]=o.clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:yn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new kr(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class vi extends Zu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Yl extends Be{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ku extends Be{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=fi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zi{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=o.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,hn):hn.fromBufferAttribute(o,a),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Ds.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ds.copy(n.boundingBox)),Ds.applyMatrix4(t.matrixWorld),this.union(Ds)}const s=t.children;for(let o=0,a=s.length;o<a;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ns),Us.subVectors(this.max,ns),wi.subVectors(t.a,ns),Ei.subVectors(t.b,ns),Ti.subVectors(t.c,ns),Gn.subVectors(Ei,wi),Wn.subVectors(Ti,Ei),ni.subVectors(wi,Ti);let e=[0,-Gn.z,Gn.y,0,-Wn.z,Wn.y,0,-ni.z,ni.y,Gn.z,0,-Gn.x,Wn.z,0,-Wn.x,ni.z,0,-ni.x,-Gn.y,Gn.x,0,-Wn.y,Wn.x,0,-ni.y,ni.x,0];return!zo(e,wi,Ei,Ti,Us)||(e=[1,0,0,0,1,0,0,0,1],!zo(e,wi,Ei,Ti,Us))?!1:(Ns.crossVectors(Gn,Wn),e=[Ns.x,Ns.y,Ns.z],zo(e,wi,Ei,Ti,Us))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(An[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),An[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),An[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),An[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),An[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),An[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),An[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),An[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(An),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const An=[new U,new U,new U,new U,new U,new U,new U,new U],hn=new U,Ds=new Zi,wi=new U,Ei=new U,Ti=new U,Gn=new U,Wn=new U,ni=new U,ns=new U,Us=new U,Ns=new U,ii=new U;function zo(i,t,e,n,s){for(let o=0,a=i.length-3;o<=a;o+=3){ii.fromArray(i,o);const r=s.x*Math.abs(ii.x)+s.y*Math.abs(ii.y)+s.z*Math.abs(ii.z),c=t.dot(ii),l=e.dot(ii),h=n.dot(ii);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const $u=new Zi,is=new U,Bo=new U;class To{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):$u.setFromPoints(t).getCenter(n);let s=0;for(let o=0,a=t.length;o<a;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;is.subVectors(t,this.center);const e=is.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(is,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Bo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(is.copy(t.center).add(Bo)),this.expandByPoint(is.copy(t.center).sub(Bo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Cn=new U,ko=new U,Fs=new U,qn=new U,Ho=new U,Os=new U,Vo=new U;class jl{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ko.copy(t).add(e).multiplyScalar(.5),Fs.copy(e).sub(t).normalize(),qn.copy(this.origin).sub(ko);const o=t.distanceTo(e)*.5,a=-this.direction.dot(Fs),r=qn.dot(this.direction),c=-qn.dot(Fs),l=qn.lengthSq(),h=Math.abs(1-a*a);let u,d,f,g;if(h>0)if(u=a*c-r,d=a*r-c,g=o*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+a*d+2*r)+d*(a*u+d+2*c)+l}else d=o,u=Math.max(0,-(a*d+r)),f=-u*u+d*(d+2*c)+l;else d=-o,u=Math.max(0,-(a*d+r)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-a*o+r)),d=u>0?-o:Math.min(Math.max(-o,-c),o),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-o,-c),o),f=d*(d+2*c)+l):(u=Math.max(0,-(a*o+r)),d=u>0?o:Math.min(Math.max(-o,-c),o),f=-u*u+d*(d+2*c)+l);else d=a>0?-o:o,u=Math.max(0,-(a*d+r)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(ko).addScaledVector(Fs,d),f}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,o=t.radius*t.radius;if(s>o)return null;const a=Math.sqrt(o-s),r=n-a,c=n+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(o=(t.min.y-d.y)*h,a=(t.max.y-d.y)*h):(o=(t.max.y-d.y)*h,a=(t.min.y-d.y)*h),n>a||o>s||((o>n||isNaN(n))&&(n=o),(a<s||isNaN(s))&&(s=a),u>=0?(r=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(r=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||r>s)||((r>n||n!==n)&&(n=r),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,o){Ho.subVectors(e,t),Os.subVectors(n,t),Vo.crossVectors(Ho,Os);let a=this.direction.dot(Vo),r;if(a>0){if(s)return null;r=1}else if(a<0)r=-1,a=-a;else return null;qn.subVectors(this.origin,t);const c=r*this.direction.dot(Os.crossVectors(qn,Os));if(c<0)return null;const l=r*this.direction.dot(Ho.cross(qn));if(l<0||c+l>a)return null;const h=-r*qn.dot(Vo);return h<0?null:this.at(h/a,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Te{constructor(t,e,n,s,o,a,r,c,l,h,u,d,f,g,_,m){Te.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,a,r,c,l,h,u,d,f,g,_,m)}set(t,e,n,s,o,a,r,c,l,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=o,p[5]=a,p[9]=r,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Te().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ai.setFromMatrixColumn(t,0).length(),o=1/Ai.setFromMatrixColumn(t,1).length(),a=1/Ai.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,a=Math.cos(n),r=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const d=a*h,f=a*u,g=r*h,_=r*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-_*l,e[9]=-r*c,e[2]=_-d*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d+_*r,e[4]=g*r-f,e[8]=a*l,e[1]=a*u,e[5]=a*h,e[9]=-r,e[2]=f*r-g,e[6]=_+d*r,e[10]=a*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d-_*r,e[4]=-a*u,e[8]=g+f*r,e[1]=f+g*r,e[5]=a*h,e[9]=_-d*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const d=a*h,f=a*u,g=r*h,_=r*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=f*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const d=a*c,f=a*l,g=r*c,_=r*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=a*c,f=a*l,g=r*c,_=r*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=a*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=r*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Qu,t,td)}lookAt(t,e,n){const s=this.elements;return Ke.subVectors(t,e),Ke.lengthSq()===0&&(Ke.z=1),Ke.normalize(),Xn.crossVectors(n,Ke),Xn.lengthSq()===0&&(Math.abs(n.z)===1?Ke.x+=1e-4:Ke.z+=1e-4,Ke.normalize(),Xn.crossVectors(n,Ke)),Xn.normalize(),zs.crossVectors(Ke,Xn),s[0]=Xn.x,s[4]=zs.x,s[8]=Ke.x,s[1]=Xn.y,s[5]=zs.y,s[9]=Ke.y,s[2]=Xn.z,s[6]=zs.z,s[10]=Ke.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,a=n[0],r=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],T=n[3],w=n[7],M=n[11],I=n[15],E=s[0],A=s[4],C=s[8],y=s[12],v=s[1],D=s[5],F=s[9],z=s[13],q=s[2],Y=s[6],Z=s[10],et=s[14],j=s[3],nt=s[7],X=s[11],vt=s[15];return o[0]=a*E+r*v+c*q+l*j,o[4]=a*A+r*D+c*Y+l*nt,o[8]=a*C+r*F+c*Z+l*X,o[12]=a*y+r*z+c*et+l*vt,o[1]=h*E+u*v+d*q+f*j,o[5]=h*A+u*D+d*Y+f*nt,o[9]=h*C+u*F+d*Z+f*X,o[13]=h*y+u*z+d*et+f*vt,o[2]=g*E+_*v+m*q+p*j,o[6]=g*A+_*D+m*Y+p*nt,o[10]=g*C+_*F+m*Z+p*X,o[14]=g*y+_*z+m*et+p*vt,o[3]=T*E+w*v+M*q+I*j,o[7]=T*A+w*D+M*Y+I*nt,o[11]=T*C+w*F+M*Z+I*X,o[15]=T*y+w*z+M*et+I*vt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+o*c*u-s*l*u-o*r*d+n*l*d+s*r*f-n*c*f)+_*(+e*c*f-e*l*d+o*a*d-s*a*f+s*l*h-o*c*h)+m*(+e*l*u-e*r*f-o*a*u+n*a*f+o*r*h-n*l*h)+p*(-s*r*h-e*c*u+e*r*d+s*a*u-n*a*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],T=u*m*l-_*d*l+_*c*f-r*m*f-u*c*p+r*d*p,w=g*d*l-h*m*l-g*c*f+a*m*f+h*c*p-a*d*p,M=h*_*l-g*u*l+g*r*f-a*_*f-h*r*p+a*u*p,I=g*u*c-h*_*c-g*r*d+a*_*d+h*r*m-a*u*m,E=e*T+n*w+s*M+o*I;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return t[0]=T*A,t[1]=(_*d*o-u*m*o-_*s*f+n*m*f+u*s*p-n*d*p)*A,t[2]=(r*m*o-_*c*o+_*s*l-n*m*l-r*s*p+n*c*p)*A,t[3]=(u*c*o-r*d*o-u*s*l+n*d*l+r*s*f-n*c*f)*A,t[4]=w*A,t[5]=(h*m*o-g*d*o+g*s*f-e*m*f-h*s*p+e*d*p)*A,t[6]=(g*c*o-a*m*o-g*s*l+e*m*l+a*s*p-e*c*p)*A,t[7]=(a*d*o-h*c*o+h*s*l-e*d*l-a*s*f+e*c*f)*A,t[8]=M*A,t[9]=(g*u*o-h*_*o-g*n*f+e*_*f+h*n*p-e*u*p)*A,t[10]=(a*_*o-g*r*o+g*n*l-e*_*l-a*n*p+e*r*p)*A,t[11]=(h*r*o-a*u*o-h*n*l+e*u*l+a*n*f-e*r*f)*A,t[12]=I*A,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*A,t[14]=(g*r*s-a*_*s-g*n*c+e*_*c+a*n*m-e*r*m)*A,t[15]=(a*u*s-h*r*s+h*n*c-e*u*c-a*n*d+e*r*d)*A,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,a=t.x,r=t.y,c=t.z,l=o*a,h=o*r;return this.set(l*a+n,l*r-s*c,l*c+s*r,0,l*r+s*c,h*r+n,h*c-s*a,0,l*c-s*r,h*c+s*a,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,a){return this.set(1,n,o,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,a=e._y,r=e._z,c=e._w,l=o+o,h=a+a,u=r+r,d=o*l,f=o*h,g=o*u,_=a*h,m=a*u,p=r*u,T=c*l,w=c*h,M=c*u,I=n.x,E=n.y,A=n.z;return s[0]=(1-(_+p))*I,s[1]=(f+M)*I,s[2]=(g-w)*I,s[3]=0,s[4]=(f-M)*E,s[5]=(1-(d+p))*E,s[6]=(m+T)*E,s[7]=0,s[8]=(g+w)*A,s[9]=(m-T)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=Ai.set(s[0],s[1],s[2]).length();const a=Ai.set(s[4],s[5],s[6]).length(),r=Ai.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],un.copy(this);const l=1/o,h=1/a,u=1/r;return un.elements[0]*=l,un.elements[1]*=l,un.elements[2]*=l,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=u,un.elements[9]*=u,un.elements[10]*=u,e.setFromRotationMatrix(un),n.x=o,n.y=a,n.z=r,this}makePerspective(t,e,n,s,o,a,r=Sn,c=!1){const l=this.elements,h=2*o/(e-t),u=2*o/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s);let g,_;if(c)g=o/(a-o),_=a*o/(a-o);else if(r===Sn)g=-(a+o)/(a-o),_=-2*a*o/(a-o);else if(r===xo)g=-a/(a-o),_=-a*o/(a-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,o,a,r=Sn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,_;if(c)g=1/(a-o),_=a/(a-o);else if(r===Sn)g=-2/(a-o),_=-(a+o)/(a-o);else if(r===xo)g=-1/(a-o),_=-o/(a-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ai=new U,un=new Te,Qu=new U(0,0,0),td=new U(1,1,1),Xn=new U,zs=new U,Ke=new U,hc=new Te,uc=new Ji;class Hn{constructor(t=0,e=0,n=0,s=Hn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],a=s[4],r=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,o)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(r,o)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return hc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(hc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return uc.setFromEuler(this),this.setFromQuaternion(uc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Hn.DEFAULT_ORDER="XYZ";class Jl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ed=0;const dc=new U,Ci=new Ji,Rn=new Te,Bs=new U,ss=new U,nd=new U,id=new Ji,fc=new U(1,0,0),pc=new U(0,1,0),mc=new U(0,0,1),gc={type:"added"},sd={type:"removed"},Ri={type:"childadded",child:null},Go={type:"childremoved",child:null};class Ae extends ji{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=Mi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ae.DEFAULT_UP.clone();const t=new U,e=new Hn,n=new Ji,s=new U(1,1,1);function o(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Te},normalMatrix:{value:new $t}}),this.matrix=new Te,this.matrixWorld=new Te,this.matrixAutoUpdate=Ae.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(t,e){return Ci.setFromAxisAngle(t,e),this.quaternion.premultiply(Ci),this}rotateX(t){return this.rotateOnAxis(fc,t)}rotateY(t){return this.rotateOnAxis(pc,t)}rotateZ(t){return this.rotateOnAxis(mc,t)}translateOnAxis(t,e){return dc.copy(t).applyQuaternion(this.quaternion),this.position.add(dc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(fc,t)}translateY(t){return this.translateOnAxis(pc,t)}translateZ(t){return this.translateOnAxis(mc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Bs.copy(t):Bs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ss.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(ss,Bs,this.up):Rn.lookAt(Bs,ss,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(Rn),this.quaternion.premultiply(Ci.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(gc),Ri.child=t,this.dispatchEvent(Ri),Ri.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(sd),Go.child=t,this.dispatchEvent(Go),Go.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(gc),Ri.child=t,this.dispatchEvent(Ri),Ri.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,t,nd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ss,id,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(r=>({...r})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function o(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(o(t.materials,this.material[c]));s.material=r}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let r=0;r<this.children.length;r++)s.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];s.animations.push(o(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),u=a(t.shapes),d=a(t.skeletons),f=a(t.animations),g=a(t.nodes);r.length>0&&(n.geometries=r),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Ae.DEFAULT_UP=new U(0,1,0);Ae.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ae.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new U,Pn=new U,Wo=new U,In=new U,Pi=new U,Ii=new U,vc=new U,qo=new U,Xo=new U,Yo=new U,jo=new Re,Jo=new Re,Zo=new Re;class gn{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),dn.subVectors(t,e),s.cross(dn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){dn.subVectors(s,e),Pn.subVectors(n,e),Wo.subVectors(t,e);const a=dn.dot(dn),r=dn.dot(Pn),c=dn.dot(Wo),l=Pn.dot(Pn),h=Pn.dot(Wo),u=a*l-r*r;if(u===0)return o.set(0,0,0),null;const d=1/u,f=(l*c-r*h)*d,g=(a*h-r*c)*d;return o.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(t,e,n,s,o,a,r,c){return this.getBarycoord(t,e,n,s,In)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,In.x),c.addScaledVector(a,In.y),c.addScaledVector(r,In.z),c)}static getInterpolatedAttribute(t,e,n,s,o,a){return jo.setScalar(0),Jo.setScalar(0),Zo.setScalar(0),jo.fromBufferAttribute(t,e),Jo.fromBufferAttribute(t,n),Zo.fromBufferAttribute(t,s),a.setScalar(0),a.addScaledVector(jo,o.x),a.addScaledVector(Jo,o.y),a.addScaledVector(Zo,o.z),a}static isFrontFacing(t,e,n,s){return dn.subVectors(n,e),Pn.subVectors(t,e),dn.cross(Pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return dn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),dn.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return gn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let a,r;Pi.subVectors(s,n),Ii.subVectors(o,n),qo.subVectors(t,n);const c=Pi.dot(qo),l=Ii.dot(qo);if(c<=0&&l<=0)return e.copy(n);Xo.subVectors(t,s);const h=Pi.dot(Xo),u=Ii.dot(Xo);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(n).addScaledVector(Pi,a);Yo.subVectors(t,o);const f=Pi.dot(Yo),g=Ii.dot(Yo);if(g>=0&&f<=g)return e.copy(o);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(n).addScaledVector(Ii,r);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return vc.subVectors(o,s),r=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(vc,r);const p=1/(m+_+d);return a=_*p,r=d*p,e.copy(n).addScaledVector(Pi,a).addScaledVector(Ii,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Zl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yn={h:0,s:0,l:0},ks={h:0,s:0,l:0};function Ko(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class ae{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=nn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,fe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=fe.workingColorSpace){return this.r=t,this.g=e,this.b=n,fe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=fe.workingColorSpace){if(t=Br(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,a=2*n-o;this.r=Ko(a,o,t+1/3),this.g=Ko(a,o,t),this.b=Ko(a,o,t-1/3)}return fe.colorSpaceToWorking(this,s),this}setStyle(t,e=nn){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const a=s[1],r=s[2];switch(a){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],a=o.length;if(a===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=nn){const n=Zl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=Hi(t.r),this.g=Hi(t.g),this.b=Hi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=nn){return fe.workingToColorSpace(Oe.copy(this),t),Math.round(ne(Oe.r*255,0,255))*65536+Math.round(ne(Oe.g*255,0,255))*256+Math.round(ne(Oe.b*255,0,255))}getHexString(t=nn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=fe.workingColorSpace){fe.workingToColorSpace(Oe.copy(this),e);const n=Oe.r,s=Oe.g,o=Oe.b,a=Math.max(n,s,o),r=Math.min(n,s,o);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const u=a-r;switch(l=h<=.5?u/(a+r):u/(2-a-r),a){case n:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-n)/u+2;break;case o:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=fe.workingColorSpace){return fe.workingToColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=nn){fe.workingToColorSpace(Oe.copy(this),t);const e=Oe.r,n=Oe.g,s=Oe.b;return t!==nn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Yn),this.setHSL(Yn.h+t,Yn.s+e,Yn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yn),t.getHSL(ks);const n=fs(Yn.h,ks.h,e),s=fs(Yn.s,ks.s,e),o=fs(Yn.l,ks.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new ae;ae.NAMES=Zl;let od=0;class Ki extends ji{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=Mi(),this.name="",this.type="Material",this.blending=ki,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ya,this.blendDst=Sa,this.blendEquation=ui,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ae(0,0,0),this.blendAlpha=0,this.depthFunc=Vi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Si,this.stencilZFail=Si,this.stencilZPass=Si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==ki&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ya&&(n.blendSrc=this.blendSrc),this.blendDst!==Sa&&(n.blendDst=this.blendDst),this.blendEquation!==ui&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Vi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nc&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Si&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Si&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Si&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const a=[];for(const r in o){const c=o[r];delete c.metadata,a.push(c)}return a}if(e){const o=s(t.textures),a=s(t.images);o.length>0&&(n.textures=o),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Ao extends Ki{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hn,this.combine=Nl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Pe=new U,Hs=new bt;let ad=0;class wn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ad++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=ic,this.updateRanges=[],this.gpuType=Nn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Hs.fromBufferAttribute(this,e),Hs.applyMatrix3(t),this.setXY(e,Hs.x,Hs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=zi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=He(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=He(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),s=He(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=He(e,this.array),n=He(n,this.array),s=He(s,this.array),o=He(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==ic&&(t.usage=this.usage),t}}class Kl extends wn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class $l extends wn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class he extends wn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let rd=0;const ln=new Te,$o=new Ae,Li=new U,$e=new Zi,os=new Zi,De=new U;class Ne extends ji{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=Mi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Xl(t)?$l:Kl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new $t().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return ln.makeRotationFromQuaternion(t),this.applyMatrix4(ln),this}rotateX(t){return ln.makeRotationX(t),this.applyMatrix4(ln),this}rotateY(t){return ln.makeRotationY(t),this.applyMatrix4(ln),this}rotateZ(t){return ln.makeRotationZ(t),this.applyMatrix4(ln),this}translate(t,e,n){return ln.makeTranslation(t,e,n),this.applyMatrix4(ln),this}scale(t,e,n){return ln.makeScale(t,e,n),this.applyMatrix4(ln),this}lookAt(t){return $o.lookAt(t),$o.updateMatrix(),this.applyMatrix4($o.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Li).negate(),this.translate(Li.x,Li.y,Li.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,o=t.length;s<o;s++){const a=t[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const o=t[s];e.setXYZ(s,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];$e.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,$e.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,$e.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint($e.min),this.boundingBox.expandByPoint($e.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new To);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if($e.setFromBufferAttribute(t),e)for(let o=0,a=e.length;o<a;o++){const r=e[o];os.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors($e.min,os.min),$e.expandByPoint(De),De.addVectors($e.max,os.max),$e.expandByPoint(De)):($e.expandByPoint(os.min),$e.expandByPoint(os.max))}$e.getCenter(n);let s=0;for(let o=0,a=t.count;o<a;o++)De.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(De));if(e)for(let o=0,a=e.length;o<a;o++){const r=e[o],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)De.fromBufferAttribute(r,l),c&&(Li.fromBufferAttribute(t,l),De.add(Li)),s=Math.max(s,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),r=[],c=[];for(let C=0;C<n.count;C++)r[C]=new U,c[C]=new U;const l=new U,h=new U,u=new U,d=new bt,f=new bt,g=new bt,_=new U,m=new U;function p(C,y,v){l.fromBufferAttribute(n,C),h.fromBufferAttribute(n,y),u.fromBufferAttribute(n,v),d.fromBufferAttribute(o,C),f.fromBufferAttribute(o,y),g.fromBufferAttribute(o,v),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(D),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),r[C].add(_),r[y].add(_),r[v].add(_),c[C].add(m),c[y].add(m),c[v].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let C=0,y=T.length;C<y;++C){const v=T[C],D=v.start,F=v.count;for(let z=D,q=D+F;z<q;z+=3)p(t.getX(z+0),t.getX(z+1),t.getX(z+2))}const w=new U,M=new U,I=new U,E=new U;function A(C){I.fromBufferAttribute(s,C),E.copy(I);const y=r[C];w.copy(y),w.sub(I.multiplyScalar(I.dot(y))).normalize(),M.crossVectors(E,y);const D=M.dot(c[C])<0?-1:1;a.setXYZW(C,w.x,w.y,w.z,D)}for(let C=0,y=T.length;C<y;++C){const v=T[C],D=v.start,F=v.count;for(let z=D,q=D+F;z<q;z+=3)A(t.getX(z+0)),A(t.getX(z+1)),A(t.getX(z+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new wn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new U,o=new U,a=new U,r=new U,c=new U,l=new U,h=new U,u=new U;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),r.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),r.add(h),c.add(h),l.add(h),n.setXYZ(g,r.x,r.y,r.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),h.subVectors(a,o),u.subVectors(s,o),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,u=r.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){r.isInterleavedBufferAttribute?f=c[_]*r.data.stride+r.offset:f=c[_]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new wn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ne,n=this.index.array,s=this.attributes;for(const r in s){const c=s[r],l=t(c,n);e.setAttribute(r,l)}const o=this.morphAttributes;for(const r in o){const c=[],l=o[r];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const u=a[l];this.addGroup(u.start,u.count,u.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _c=new Te,si=new jl,Vs=new To,xc=new U,Gs=new U,Ws=new U,qs=new U,Qo=new U,Xs=new U,Mc=new U,Ys=new U;class x extends Ae{constructor(t=new Ne,e=new Ao){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const r=this.morphTargetInfluences;if(o&&r){Xs.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=r[c],u=o[c];h!==0&&(Qo.fromBufferAttribute(u,t),a?Xs.addScaledVector(Qo,h):Xs.addScaledVector(Qo.sub(e),h))}e.add(Xs)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Vs.copy(n.boundingSphere),Vs.applyMatrix4(o),si.copy(t.ray).recast(t.near),!(Vs.containsPoint(si.origin)===!1&&(si.intersectSphere(Vs,xc)===null||si.origin.distanceToSquared(xc)>(t.far-t.near)**2))&&(_c.copy(o).invert(),si.copy(t.ray).applyMatrix4(_c),!(n.boundingBox!==null&&si.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,si)))}_computeIntersections(t,e,n){let s;const o=this.geometry,a=this.material,r=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,d=o.groups,f=o.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],T=Math.max(m.start,f.start),w=Math.min(r.count,Math.min(m.start+m.count,f.start+f.count));for(let M=T,I=w;M<I;M+=3){const E=r.getX(M),A=r.getX(M+1),C=r.getX(M+2);s=js(this,p,t,n,l,h,u,E,A,C),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(r.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const T=r.getX(m),w=r.getX(m+1),M=r.getX(m+2);s=js(this,a,t,n,l,h,u,T,w,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=a[m.materialIndex],T=Math.max(m.start,f.start),w=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let M=T,I=w;M<I;M+=3){const E=M,A=M+1,C=M+2;s=js(this,p,t,n,l,h,u,E,A,C),s&&(s.faceIndex=Math.floor(M/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const T=m,w=m+1,M=m+2;s=js(this,a,t,n,l,h,u,T,w,M),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function cd(i,t,e,n,s,o,a,r){let c;if(t.side===Ye?c=n.intersectTriangle(a,o,s,!0,r):c=n.intersectTriangle(s,o,a,t.side===kn,r),c===null)return null;Ys.copy(r),Ys.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(Ys);return l<e.near||l>e.far?null:{distance:l,point:Ys.clone(),object:i}}function js(i,t,e,n,s,o,a,r,c,l){i.getVertexPosition(r,Gs),i.getVertexPosition(c,Ws),i.getVertexPosition(l,qs);const h=cd(i,t,e,n,Gs,Ws,qs,Mc);if(h){const u=new U;gn.getBarycoord(Mc,Gs,Ws,qs,u),s&&(h.uv=gn.getInterpolatedAttribute(s,r,c,l,u,new bt)),o&&(h.uv1=gn.getInterpolatedAttribute(o,r,c,l,u,new bt)),a&&(h.normal=gn.getInterpolatedAttribute(a,r,c,l,u,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a:r,b:c,c:l,normal:new U,materialIndex:0};gn.getNormal(Gs,Ws,qs,d.normal),h.face=d,h.barycoord=u}return h}class G extends Ne{constructor(t=1,e=1,n=1,s=1,o=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:a};const r=this;s=Math.floor(s),o=Math.floor(o),a=Math.floor(a);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,a,o,0),g("z","y","x",1,-1,n,e,-t,a,o,1),g("x","z","y",1,1,t,n,e,s,a,2),g("x","z","y",1,-1,t,n,-e,s,a,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(u,2));function g(_,m,p,T,w,M,I,E,A,C,y){const v=M/A,D=I/C,F=M/2,z=I/2,q=E/2,Y=A+1,Z=C+1;let et=0,j=0;const nt=new U;for(let X=0;X<Z;X++){const vt=X*D-z;for(let Wt=0;Wt<Y;Wt++){const te=Wt*v-F;nt[_]=te*T,nt[m]=vt*w,nt[p]=q,l.push(nt.x,nt.y,nt.z),nt[_]=0,nt[m]=0,nt[p]=E>0?1:-1,h.push(nt.x,nt.y,nt.z),u.push(Wt/A),u.push(1-X/C),et+=1}}for(let X=0;X<C;X++)for(let vt=0;vt<A;vt++){const Wt=d+vt+Y*X,te=d+vt+Y*(X+1),le=d+(vt+1)+Y*(X+1),se=d+(vt+1)+Y*X;c.push(Wt,te,se),c.push(te,le,se),j+=6}r.addGroup(f,j,y),f+=j,d+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new G(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Xi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Ve(i){const t={};for(let e=0;e<i.length;e++){const n=Xi(i[e]);for(const s in n)t[s]=n[s]}return t}function ld(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Ql(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:fe.workingColorSpace}const hd={clone:Xi,merge:Ve};var ud=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,dd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qn extends Ki{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ud,this.fragmentShader=dd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Xi(t.uniforms),this.uniformsGroups=ld(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class th extends Ae{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Te,this.projectionMatrix=new Te,this.projectionMatrixInverse=new Te,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const jn=new U,yc=new bt,Sc=new bt;class sn extends th{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=ys*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(ds*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return ys*2*Math.atan(Math.tan(ds*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(jn.x,jn.y).multiplyScalar(-t/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-t/jn.z)}getViewSize(t,e){return this.getViewBounds(t,yc,Sc),e.subVectors(Sc,yc)}setViewOffset(t,e,n,s,o,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(ds*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;o+=a.offsetX*s/c,e-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const r=this.filmOffset;r!==0&&(o+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Di=-90,Ui=1;class fd extends Ae{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new sn(Di,Ui,t,e);s.layers=this.layers,this.add(s);const o=new sn(Di,Ui,t,e);o.layers=this.layers,this.add(o);const a=new sn(Di,Ui,t,e);a.layers=this.layers,this.add(a);const r=new sn(Di,Ui,t,e);r.layers=this.layers,this.add(r);const c=new sn(Di,Ui,t,e);c.layers=this.layers,this.add(c);const l=new sn(Di,Ui,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,a,r,c]=e;for(const l of e)this.remove(l);if(t===Sn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===xo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,a,r,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,r),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class eh extends Be{constructor(t=[],e=Gi,n,s,o,a,r,c,l,h){super(t,e,n,s,o,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class pd extends vi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new eh(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new G(5,5,5),o=new Qn({name:"CubemapFromEquirect",uniforms:Xi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ye,blending:Kn});o.uniforms.tEquirect.value=e;const a=new x(s,o),r=e.minFilter;return e.minFilter===pi&&(e.minFilter=yn),new fd(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const o=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(o)}}class ct extends Ae{constructor(){super(),this.isGroup=!0,this.type="Group"}}const md={type:"move"};class ta{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ct,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ct,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ct,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(r.matrix.fromArray(s.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,s.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(s.linearVelocity)):r.hasLinearVelocity=!1,s.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(s.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(md)))}return r!==null&&(r.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ct;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Hr{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new ae(t),this.near=e,this.far=n}clone(){return new Hr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class nh extends Ae{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Hn,this.environmentIntensity=1,this.environmentRotation=new Hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class gd extends Be{constructor(t=null,e=1,n=1,s,o,a,r,c,l=Ge,h=Ge,u,d){super(null,a,r,c,l,h,s,o,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ea=new U,vd=new U,_d=new $t;class li{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=ea.subVectors(n,e).cross(vd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ea),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||_d.getNormalMatrix(t),s=this.coplanarPoint(ea).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const oi=new To,xd=new bt(.5,.5),Js=new U;class Vr{constructor(t=new li,e=new li,n=new li,s=new li,o=new li,a=new li){this.planes=[t,e,n,s,o,a]}set(t,e,n,s,o,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(n),r[3].copy(s),r[4].copy(o),r[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Sn,n=!1){const s=this.planes,o=t.elements,a=o[0],r=o[1],c=o[2],l=o[3],h=o[4],u=o[5],d=o[6],f=o[7],g=o[8],_=o[9],m=o[10],p=o[11],T=o[12],w=o[13],M=o[14],I=o[15];if(s[0].setComponents(l-a,f-h,p-g,I-T).normalize(),s[1].setComponents(l+a,f+h,p+g,I+T).normalize(),s[2].setComponents(l+r,f+u,p+_,I+w).normalize(),s[3].setComponents(l-r,f-u,p-_,I-w).normalize(),n)s[4].setComponents(c,d,m,M).normalize(),s[5].setComponents(l-c,f-d,p-m,I-M).normalize();else if(s[4].setComponents(l-c,f-d,p-m,I-M).normalize(),e===Sn)s[5].setComponents(l+c,f+d,p+m,I+M).normalize();else if(e===xo)s[5].setComponents(c,d,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),oi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),oi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(oi)}intersectsSprite(t){oi.center.set(0,0,0);const e=xd.distanceTo(t.center);return oi.radius=.7071067811865476+e,oi.applyMatrix4(t.matrixWorld),this.intersectsSphere(oi)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Js.x=s.normal.x>0?t.max.x:t.min.x,Js.y=s.normal.y>0?t.max.y:t.min.y,Js.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Js)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class ih extends Ki{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ae(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const yo=new U,So=new U,bc=new Te,as=new jl,Zs=new To,na=new U,wc=new U;class Md extends Ae{constructor(t=new Ne,e=new ih){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)yo.fromBufferAttribute(e,s-1),So.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=yo.distanceTo(So);t.setAttribute("lineDistance",new he(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Zs.copy(n.boundingSphere),Zs.applyMatrix4(s),Zs.radius+=o,t.ray.intersectsSphere(Zs)===!1)return;bc.copy(s).invert(),as.copy(t.ray).applyMatrix4(bc);const r=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=h.getX(_),T=h.getX(_+1),w=Ks(this,t,as,c,p,T,_);w&&e.push(w)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Ks(this,t,as,c,_,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(d.count,a.start+a.count);for(let _=f,m=g-1;_<m;_+=l){const p=Ks(this,t,as,c,_,_+1,_);p&&e.push(p)}if(this.isLineLoop){const _=Ks(this,t,as,c,g-1,f,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,a=s.length;o<a;o++){const r=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=o}}}}}function Ks(i,t,e,n,s,o,a){const r=i.geometry.attributes.position;if(yo.fromBufferAttribute(r,s),So.fromBufferAttribute(r,o),e.distanceSqToSegment(yo,So,na,wc)>n)return;na.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(na);if(!(l<t.near||l>t.far))return{distance:l,point:wc.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}const Ec=new U,Tc=new U;class Ac extends Md{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)Ec.fromBufferAttribute(e,s),Tc.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Ec.distanceTo(Tc);t.setAttribute("lineDistance",new he(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class yd extends Be{constructor(t,e,n,s,o,a,r,c,l){super(t,e,n,s,o,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class sh extends Be{constructor(t,e,n=gi,s,o,a,r=Ge,c=Ge,l,h=xs,u=1){if(h!==xs&&h!==Ms)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,o,a,r,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new kr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class oh extends Be{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Fn extends Ne{constructor(t=1,e=1,n=4,s=8,o=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:o},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),o=Math.max(1,Math.floor(o));const a=[],r=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+o,_=s+1,m=new U,p=new U;for(let T=0;T<=g;T++){let w=0,M=0,I=0,E=0;if(T<=n){const y=T/n,v=y*Math.PI/2;M=-h-t*Math.cos(v),I=t*Math.sin(v),E=-t*Math.cos(v),w=y*u}else if(T<=n+o){const y=(T-n)/o;M=-h+y*e,I=t,E=0,w=u+y*d}else{const y=(T-n-o)/n,v=y*Math.PI/2;M=h+t*Math.sin(v),I=t*Math.cos(v),E=t*Math.sin(v),w=u+d+y*u}const A=Math.max(0,Math.min(1,w/f));let C=0;T===0?C=.5/s:T===g&&(C=-.5/s);for(let y=0;y<=s;y++){const v=y/s,D=v*Math.PI*2,F=Math.sin(D),z=Math.cos(D);p.x=-I*z,p.y=M,p.z=I*F,r.push(p.x,p.y,p.z),m.set(-I*z,E,I*F),m.normalize(),c.push(m.x,m.y,m.z),l.push(v+C,A)}if(T>0){const y=(T-1)*_;for(let v=0;v<s;v++){const D=y+v,F=y+v+1,z=T*_+v,q=T*_+v+1;a.push(D,F,z),a.push(F,q,z)}}}this.setIndex(a),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class bs extends Ne{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const o=[],a=[],r=[],c=[],l=new U,h=new bt;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(a[d]/t+1)/2,h.y=(a[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)o.push(u,u+1,0);this.setIndex(o),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(r,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bs(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class it extends Ne{constructor(t=1,e=1,n=1,s=32,o=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:a,thetaStart:r,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;T(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new he(u,3)),this.setAttribute("normal",new he(d,3)),this.setAttribute("uv",new he(f,2));function T(){const M=new U,I=new U;let E=0;const A=(e-t)/n;for(let C=0;C<=o;C++){const y=[],v=C/o,D=v*(e-t)+t;for(let F=0;F<=s;F++){const z=F/s,q=z*c+r,Y=Math.sin(q),Z=Math.cos(q);I.x=D*Y,I.y=-v*n+m,I.z=D*Z,u.push(I.x,I.y,I.z),M.set(Y,A,Z).normalize(),d.push(M.x,M.y,M.z),f.push(z,1-v),y.push(g++)}_.push(y)}for(let C=0;C<s;C++)for(let y=0;y<o;y++){const v=_[y][C],D=_[y+1][C],F=_[y+1][C+1],z=_[y][C+1];(t>0||y!==0)&&(h.push(v,D,z),E+=3),(e>0||y!==o-1)&&(h.push(D,F,z),E+=3)}l.addGroup(p,E,0),p+=E}function w(M){const I=g,E=new bt,A=new U;let C=0;const y=M===!0?t:e,v=M===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*v,0),d.push(0,v,0),f.push(.5,.5),g++;const D=g;for(let F=0;F<=s;F++){const q=F/s*c+r,Y=Math.cos(q),Z=Math.sin(q);A.x=y*Z,A.y=m*v,A.z=y*Y,u.push(A.x,A.y,A.z),d.push(0,v,0),E.x=Y*.5+.5,E.y=Z*.5*v+.5,f.push(E.x,E.y),g++}for(let F=0;F<s;F++){const z=I+F,q=D+F;M===!0?h.push(q,q+1,z):h.push(q+1,q,z),C+=3}l.addGroup(p,C,M===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new it(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class We extends it{constructor(t=1,e=1,n=32,s=1,o=!1,a=0,r=Math.PI*2){super(0,t,e,n,s,o,a,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:r}}static fromJSON(t){return new We(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Co extends Ne{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],a=[];r(s),l(n),h(),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(o.slice(),3)),this.setAttribute("uv",new he(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function r(T){const w=new U,M=new U,I=new U;for(let E=0;E<e.length;E+=3)f(e[E+0],w),f(e[E+1],M),f(e[E+2],I),c(w,M,I,T)}function c(T,w,M,I){const E=I+1,A=[];for(let C=0;C<=E;C++){A[C]=[];const y=T.clone().lerp(M,C/E),v=w.clone().lerp(M,C/E),D=E-C;for(let F=0;F<=D;F++)F===0&&C===E?A[C][F]=y:A[C][F]=y.clone().lerp(v,F/D)}for(let C=0;C<E;C++)for(let y=0;y<2*(E-C)-1;y++){const v=Math.floor(y/2);y%2===0?(d(A[C][v+1]),d(A[C+1][v]),d(A[C][v])):(d(A[C][v+1]),d(A[C+1][v+1]),d(A[C+1][v]))}}function l(T){const w=new U;for(let M=0;M<o.length;M+=3)w.x=o[M+0],w.y=o[M+1],w.z=o[M+2],w.normalize().multiplyScalar(T),o[M+0]=w.x,o[M+1]=w.y,o[M+2]=w.z}function h(){const T=new U;for(let w=0;w<o.length;w+=3){T.x=o[w+0],T.y=o[w+1],T.z=o[w+2];const M=m(T)/2/Math.PI+.5,I=p(T)/Math.PI+.5;a.push(M,1-I)}g(),u()}function u(){for(let T=0;T<a.length;T+=6){const w=a[T+0],M=a[T+2],I=a[T+4],E=Math.max(w,M,I),A=Math.min(w,M,I);E>.9&&A<.1&&(w<.2&&(a[T+0]+=1),M<.2&&(a[T+2]+=1),I<.2&&(a[T+4]+=1))}}function d(T){o.push(T.x,T.y,T.z)}function f(T,w){const M=T*3;w.x=t[M+0],w.y=t[M+1],w.z=t[M+2]}function g(){const T=new U,w=new U,M=new U,I=new U,E=new bt,A=new bt,C=new bt;for(let y=0,v=0;y<o.length;y+=9,v+=6){T.set(o[y+0],o[y+1],o[y+2]),w.set(o[y+3],o[y+4],o[y+5]),M.set(o[y+6],o[y+7],o[y+8]),E.set(a[v+0],a[v+1]),A.set(a[v+2],a[v+3]),C.set(a[v+4],a[v+5]),I.copy(T).add(w).add(M).divideScalar(3);const D=m(I);_(E,v+0,T,D),_(A,v+2,w,D),_(C,v+4,M,D)}}function _(T,w,M,I){I<0&&T.x===1&&(a[w]=T.x-1),M.x===0&&M.z===0&&(a[w]=I/2/Math.PI+.5)}function m(T){return Math.atan2(T.z,-T.x)}function p(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Co(t.vertices,t.indices,t.radius,t.details)}}class Gr extends Co{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,o=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(o,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Gr(t.radius,t.detail)}}class Tn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const o=n.length;let a;e?a=e:a=t*n[o-1];let r=0,c=o-1,l;for(;r<=c;)if(s=Math.floor(r+(c-r)/2),l=n[s]-a,l<0)r=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(o-1);const h=n[s],d=n[s+1]-h,f=(a-h)/d;return(s+f)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const a=this.getPoint(s),r=this.getPoint(o),c=e||(a.isVector2?new bt:new U);return c.copy(r).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new U,s=[],o=[],a=[],r=new U,c=new Te;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new U)}o[0]=new U,a[0]=new U;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),r.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],r),a[0].crossVectors(s[0],o[0]);for(let f=1;f<=t;f++){if(o[f]=o[f-1].clone(),a[f]=a[f-1].clone(),r.crossVectors(s[f-1],s[f]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(ne(s[f-1].dot(s[f]),-1,1));o[f].applyMatrix4(c.makeRotationAxis(r,g))}a[f].crossVectors(s[f],o[f])}if(e===!0){let f=Math.acos(ne(o[0].dot(o[t]),-1,1));f/=t,s[0].dot(r.crossVectors(o[0],o[t]))>0&&(f=-f);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),a[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Wr extends Tn{constructor(t=0,e=0,n=1,s=1,o=0,a=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=a,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new bt){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const a=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(a?o=0:o=s),this.aClockwise===!0&&!a&&(o===s?o=-s:o=o-s);const r=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Sd extends Wr{constructor(t,e,n,s,o,a){super(t,e,n,n,s,o,a),this.isArcCurve=!0,this.type="ArcCurve"}}function qr(){let i=0,t=0,e=0,n=0;function s(o,a,r,c){i=o,t=r,e=-3*o+3*a-2*r-c,n=2*o-2*a+r+c}return{initCatmullRom:function(o,a,r,c,l){s(a,r,l*(r-o),l*(c-a))},initNonuniformCatmullRom:function(o,a,r,c,l,h,u){let d=(a-o)/l-(r-o)/(l+h)+(r-a)/h,f=(r-a)/h-(c-a)/(h+u)+(c-r)/u;d*=h,f*=h,s(a,r,d,f)},calc:function(o){const a=o*o,r=a*o;return i+t*o+e*a+n*r}}}const $s=new U,ia=new qr,sa=new qr,oa=new qr;class bd extends Tn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new U){const n=e,s=this.points,o=s.length,a=(o-(this.closed?0:1))*t;let r=Math.floor(a),c=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/o)+1)*o:c===0&&r===o-1&&(r=o-2,c=1);let l,h;this.closed||r>0?l=s[(r-1)%o]:($s.subVectors(s[0],s[1]).add(s[0]),l=$s);const u=s[r%o],d=s[(r+1)%o];if(this.closed||r+2<o?h=s[(r+2)%o]:($s.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=$s),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),ia.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),sa.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),oa.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(ia.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),sa.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),oa.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(ia.calc(c),sa.calc(c),oa.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Cc(i,t,e,n,s){const o=(n-t)*.5,a=(s-e)*.5,r=i*i,c=i*r;return(2*e-2*n+o+a)*c+(-3*e+3*n-2*o-a)*r+o*i+e}function wd(i,t){const e=1-i;return e*e*t}function Ed(i,t){return 2*(1-i)*i*t}function Td(i,t){return i*i*t}function ps(i,t,e,n){return wd(i,t)+Ed(i,e)+Td(i,n)}function Ad(i,t){const e=1-i;return e*e*e*t}function Cd(i,t){const e=1-i;return 3*e*e*i*t}function Rd(i,t){return 3*(1-i)*i*i*t}function Pd(i,t){return i*i*i*t}function ms(i,t,e,n,s){return Ad(i,t)+Cd(i,e)+Rd(i,n)+Pd(i,s)}class ah extends Tn{constructor(t=new bt,e=new bt,n=new bt,s=new bt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new bt){const n=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return n.set(ms(t,s.x,o.x,a.x,r.x),ms(t,s.y,o.y,a.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Id extends Tn{constructor(t=new U,e=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new U){const n=e,s=this.v0,o=this.v1,a=this.v2,r=this.v3;return n.set(ms(t,s.x,o.x,a.x,r.x),ms(t,s.y,o.y,a.y,r.y),ms(t,s.z,o.z,a.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class rh extends Tn{constructor(t=new bt,e=new bt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new bt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new bt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ld extends Tn{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ch extends Tn{constructor(t=new bt,e=new bt,n=new bt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new bt){const n=e,s=this.v0,o=this.v1,a=this.v2;return n.set(ps(t,s.x,o.x,a.x),ps(t,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Dd extends Tn{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){const n=e,s=this.v0,o=this.v1,a=this.v2;return n.set(ps(t,s.x,o.x,a.x),ps(t,s.y,o.y,a.y),ps(t,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class lh extends Tn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new bt){const n=e,s=this.points,o=(s.length-1)*t,a=Math.floor(o),r=o-a,c=s[a===0?a:a-1],l=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return n.set(Cc(r,c.x,l.x,h.x,u.x),Cc(r,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new bt().fromArray(s))}return this}}var cr=Object.freeze({__proto__:null,ArcCurve:Sd,CatmullRomCurve3:bd,CubicBezierCurve:ah,CubicBezierCurve3:Id,EllipseCurve:Wr,LineCurve:rh,LineCurve3:Ld,QuadraticBezierCurve:ch,QuadraticBezierCurve3:Dd,SplineCurve:lh});class Ud extends Tn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new cr[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const a=s[o]-n,r=this.curves[o],c=r.getLength(),l=c===0?0:1-a/c;return r.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const a=o[s],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new cr[s.type]().fromJSON(s))}return this}}class lr extends Ud{constructor(t){super(),this.type="Path",this.currentPoint=new bt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new rh(this.currentPoint.clone(),new bt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new ch(this.currentPoint.clone(),new bt(t,e),new bt(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,a){const r=new ah(this.currentPoint.clone(),new bt(t,e),new bt(n,s),new bt(o,a));return this.curves.push(r),this.currentPoint.set(o,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new lh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,a){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,n,s,o,a),this}absarc(t,e,n,s,o,a){return this.absellipse(t,e,n,n,s,o,a),this}ellipse(t,e,n,s,o,a,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,o,a,r,c),this}absellipse(t,e,n,s,o,a,r,c){const l=new Wr(t,e,n,s,o,a,r,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Ro extends lr{constructor(t){super(t),this.uuid=Mi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new lr().fromJSON(s))}return this}}function Nd(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=hh(i,0,s,e,!0);const a=[];if(!o||o.next===o.prev)return a;let r,c,l;if(n&&(o=kd(i,t,o,e)),i.length>80*e){r=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const f=i[d],g=i[d+1];f<r&&(r=f),g<c&&(c=g),f>h&&(h=f),g>u&&(u=g)}l=Math.max(h-r,u-c),l=l!==0?32767/l:0}return ws(o,a,e,r,c,l,0),a}function hh(i,t,e,n,s){let o;if(s===Kd(i,t,e,n)>0)for(let a=t;a<e;a+=n)o=Rc(a/n|0,i[a],i[a+1],o);else for(let a=e-n;a>=t;a-=n)o=Rc(a/n|0,i[a],i[a+1],o);return o&&Yi(o,o.next)&&(Ts(o),o=o.next),o}function _i(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Yi(e,e.next)||Ee(e.prev,e,e.next)===0)){if(Ts(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ws(i,t,e,n,s,o,a){if(!i)return;!a&&o&&qd(i,n,s,o);let r=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(o?Od(i,n,s,o):Fd(i)){t.push(c.i,i.i,l.i),Ts(i),i=l.next,r=l.next;continue}if(i=l,i===r){a?a===1?(i=zd(_i(i),t),ws(i,t,e,n,s,o,2)):a===2&&Bd(i,t,e,n,s,o):ws(_i(i),t,e,n,s,o,1);break}}}function Fd(i){const t=i.prev,e=i,n=i.next;if(Ee(t,e,n)>=0)return!1;const s=t.x,o=e.x,a=n.x,r=t.y,c=e.y,l=n.y,h=Math.min(s,o,a),u=Math.min(r,c,l),d=Math.max(s,o,a),f=Math.max(r,c,l);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&hs(s,r,o,c,a,l,g.x,g.y)&&Ee(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Od(i,t,e,n){const s=i.prev,o=i,a=i.next;if(Ee(s,o,a)>=0)return!1;const r=s.x,c=o.x,l=a.x,h=s.y,u=o.y,d=a.y,f=Math.min(r,c,l),g=Math.min(h,u,d),_=Math.max(r,c,l),m=Math.max(h,u,d),p=hr(f,g,t,e,n),T=hr(_,m,t,e,n);let w=i.prevZ,M=i.nextZ;for(;w&&w.z>=p&&M&&M.z<=T;){if(w.x>=f&&w.x<=_&&w.y>=g&&w.y<=m&&w!==s&&w!==a&&hs(r,h,c,u,l,d,w.x,w.y)&&Ee(w.prev,w,w.next)>=0||(w=w.prevZ,M.x>=f&&M.x<=_&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&hs(r,h,c,u,l,d,M.x,M.y)&&Ee(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;w&&w.z>=p;){if(w.x>=f&&w.x<=_&&w.y>=g&&w.y<=m&&w!==s&&w!==a&&hs(r,h,c,u,l,d,w.x,w.y)&&Ee(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;M&&M.z<=T;){if(M.x>=f&&M.x<=_&&M.y>=g&&M.y<=m&&M!==s&&M!==a&&hs(r,h,c,u,l,d,M.x,M.y)&&Ee(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function zd(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Yi(n,s)&&dh(n,e,e.next,s)&&Es(n,s)&&Es(s,n)&&(t.push(n.i,e.i,s.i),Ts(e),Ts(e.next),e=i=s),e=e.next}while(e!==i);return _i(e)}function Bd(i,t,e,n,s,o){let a=i;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&jd(a,r)){let c=fh(a,r);a=_i(a,a.next),c=_i(c,c.next),ws(a,t,e,n,s,o,0),ws(c,t,e,n,s,o,0);return}r=r.next}a=a.next}while(a!==i)}function kd(i,t,e,n){const s=[];for(let o=0,a=t.length;o<a;o++){const r=t[o]*n,c=o<a-1?t[o+1]*n:i.length,l=hh(i,r,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Yd(l))}s.sort(Hd);for(let o=0;o<s.length;o++)e=Vd(s[o],e);return e}function Hd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Vd(i,t){const e=Gd(i,t);if(!e)return t;const n=fh(e,i);return _i(n,n.next),_i(e,e.next)}function Gd(i,t){let e=t;const n=i.x,s=i.y;let o=-1/0,a;if(Yi(i,e))return e;do{if(Yi(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>o&&(o=u,a=e.x<e.next.x?e:e.next,u===n))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(n>=e.x&&e.x>=c&&n!==e.x&&uh(s<l?n:o,s,c,l,s<l?o:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Es(e,i)&&(u<h||u===h&&(e.x>a.x||e.x===a.x&&Wd(a,e)))&&(a=e,h=u)}e=e.next}while(e!==r);return a}function Wd(i,t){return Ee(i.prev,i,t.prev)<0&&Ee(t.next,i,i.next)<0}function qd(i,t,e,n){let s=i;do s.z===0&&(s.z=hr(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Xd(s)}function Xd(i){let t,e=1;do{let n=i,s;i=null;let o=null;for(t=0;n;){t++;let a=n,r=0;for(let l=0;l<e&&(r++,a=a.nextZ,!!a);l++);let c=e;for(;r>0||c>0&&a;)r!==0&&(c===0||!a||n.z<=a.z)?(s=n,n=n.nextZ,r--):(s=a,a=a.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;n=a}o.nextZ=null,e*=2}while(t>1);return i}function hr(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Yd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function uh(i,t,e,n,s,o,a,r){return(s-a)*(t-r)>=(i-a)*(o-r)&&(i-a)*(n-r)>=(e-a)*(t-r)&&(e-a)*(o-r)>=(s-a)*(n-r)}function hs(i,t,e,n,s,o,a,r){return!(i===a&&t===r)&&uh(i,t,e,n,s,o,a,r)}function jd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Jd(i,t)&&(Es(i,t)&&Es(t,i)&&Zd(i,t)&&(Ee(i.prev,i,t.prev)||Ee(i,t.prev,t))||Yi(i,t)&&Ee(i.prev,i,i.next)>0&&Ee(t.prev,t,t.next)>0)}function Ee(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Yi(i,t){return i.x===t.x&&i.y===t.y}function dh(i,t,e,n){const s=to(Ee(i,t,e)),o=to(Ee(i,t,n)),a=to(Ee(e,n,i)),r=to(Ee(e,n,t));return!!(s!==o&&a!==r||s===0&&Qs(i,e,t)||o===0&&Qs(i,n,t)||a===0&&Qs(e,i,n)||r===0&&Qs(e,t,n))}function Qs(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function to(i){return i>0?1:i<0?-1:0}function Jd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&dh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Es(i,t){return Ee(i.prev,i,i.next)<0?Ee(i,t,i.next)>=0&&Ee(i,i.prev,t)>=0:Ee(i,t,i.prev)<0||Ee(i,i.next,t)<0}function Zd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function fh(i,t){const e=ur(i.i,i.x,i.y),n=ur(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Rc(i,t,e,n){const s=ur(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Ts(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ur(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Kd(i,t,e,n){let s=0;for(let o=t,a=e-n;o<e;o+=n)s+=(i[a]-i[o])*(i[o+1]+i[a+1]),a=o;return s}class $d{static triangulate(t,e,n=2){return Nd(t,e,n)}}class On{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return On.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];Pc(t),Ic(n,t);let a=t.length;e.forEach(Pc);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,Ic(n,e[c]);const r=$d.triangulate(n,s);for(let c=0;c<r.length;c+=3)o.push(r.slice(c,c+3));return o}}function Pc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Ic(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Xr extends Ne{constructor(t=new Ro([new bt(.5,.5),new bt(-.5,.5),new bt(-.5,-.5),new bt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],o=[];for(let r=0,c=t.length;r<c;r++){const l=t[r];a(l)}this.setAttribute("position",new he(s,3)),this.setAttribute("uv",new he(o,2)),this.computeVertexNormals();function a(r){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:Qd;let w,M=!1,I,E,A,C;p&&(w=p.getSpacedPoints(h),M=!0,d=!1,I=p.computeFrenetFrames(h,!1),E=new U,A=new U,C=new U),d||(m=0,f=0,g=0,_=0);const y=r.extractPoints(l);let v=y.shape;const D=y.holes;if(!On.isClockWise(v)){v=v.reverse();for(let ut=0,rt=D.length;ut<rt;ut++){const ot=D[ut];On.isClockWise(ot)&&(D[ut]=ot.reverse())}}function z(ut){const ot=10000000000000001e-36;let J=ut[0];for(let yt=1;yt<=ut.length;yt++){const pt=yt%ut.length,St=ut[pt],kt=St.x-J.x,Yt=St.y-J.y,L=kt*kt+Yt*Yt,b=Math.max(Math.abs(St.x),Math.abs(St.y),Math.abs(J.x),Math.abs(J.y)),H=ot*b*b;if(L<=H){ut.splice(pt,1),yt--;continue}J=St}}z(v),D.forEach(z);const q=D.length,Y=v;for(let ut=0;ut<q;ut++){const rt=D[ut];v=v.concat(rt)}function Z(ut,rt,ot){return rt||console.error("THREE.ExtrudeGeometry: vec does not exist"),ut.clone().addScaledVector(rt,ot)}const et=v.length;function j(ut,rt,ot){let J,yt,pt;const St=ut.x-rt.x,kt=ut.y-rt.y,Yt=ot.x-ut.x,L=ot.y-ut.y,b=St*St+kt*kt,H=St*L-kt*Yt;if(Math.abs(H)>Number.EPSILON){const tt=Math.sqrt(b),lt=Math.sqrt(Yt*Yt+L*L),$=rt.x-kt/tt,It=rt.y+St/tt,_t=ot.x-L/lt,Ut=ot.y+Yt/lt,Nt=((_t-$)*L-(Ut-It)*Yt)/(St*L-kt*Yt);J=$+St*Nt-ut.x,yt=It+kt*Nt-ut.y;const mt=J*J+yt*yt;if(mt<=2)return new bt(J,yt);pt=Math.sqrt(mt/2)}else{let tt=!1;St>Number.EPSILON?Yt>Number.EPSILON&&(tt=!0):St<-Number.EPSILON?Yt<-Number.EPSILON&&(tt=!0):Math.sign(kt)===Math.sign(L)&&(tt=!0),tt?(J=-kt,yt=St,pt=Math.sqrt(b)):(J=St,yt=kt,pt=Math.sqrt(b/2))}return new bt(J/pt,yt/pt)}const nt=[];for(let ut=0,rt=Y.length,ot=rt-1,J=ut+1;ut<rt;ut++,ot++,J++)ot===rt&&(ot=0),J===rt&&(J=0),nt[ut]=j(Y[ut],Y[ot],Y[J]);const X=[];let vt,Wt=nt.concat();for(let ut=0,rt=q;ut<rt;ut++){const ot=D[ut];vt=[];for(let J=0,yt=ot.length,pt=yt-1,St=J+1;J<yt;J++,pt++,St++)pt===yt&&(pt=0),St===yt&&(St=0),vt[J]=j(ot[J],ot[pt],ot[St]);X.push(vt),Wt=Wt.concat(vt)}let te;if(m===0)te=On.triangulateShape(Y,D);else{const ut=[],rt=[];for(let ot=0;ot<m;ot++){const J=ot/m,yt=f*Math.cos(J*Math.PI/2),pt=g*Math.sin(J*Math.PI/2)+_;for(let St=0,kt=Y.length;St<kt;St++){const Yt=Z(Y[St],nt[St],pt);Bt(Yt.x,Yt.y,-yt),J===0&&ut.push(Yt)}for(let St=0,kt=q;St<kt;St++){const Yt=D[St];vt=X[St];const L=[];for(let b=0,H=Yt.length;b<H;b++){const tt=Z(Yt[b],vt[b],pt);Bt(tt.x,tt.y,-yt),J===0&&L.push(tt)}J===0&&rt.push(L)}}te=On.triangulateShape(ut,rt)}const le=te.length,se=g+_;for(let ut=0;ut<et;ut++){const rt=d?Z(v[ut],Wt[ut],se):v[ut];M?(A.copy(I.normals[0]).multiplyScalar(rt.x),E.copy(I.binormals[0]).multiplyScalar(rt.y),C.copy(w[0]).add(A).add(E),Bt(C.x,C.y,C.z)):Bt(rt.x,rt.y,0)}for(let ut=1;ut<=h;ut++)for(let rt=0;rt<et;rt++){const ot=d?Z(v[rt],Wt[rt],se):v[rt];M?(A.copy(I.normals[ut]).multiplyScalar(ot.x),E.copy(I.binormals[ut]).multiplyScalar(ot.y),C.copy(w[ut]).add(A).add(E),Bt(C.x,C.y,C.z)):Bt(ot.x,ot.y,u/h*ut)}for(let ut=m-1;ut>=0;ut--){const rt=ut/m,ot=f*Math.cos(rt*Math.PI/2),J=g*Math.sin(rt*Math.PI/2)+_;for(let yt=0,pt=Y.length;yt<pt;yt++){const St=Z(Y[yt],nt[yt],J);Bt(St.x,St.y,u+ot)}for(let yt=0,pt=D.length;yt<pt;yt++){const St=D[yt];vt=X[yt];for(let kt=0,Yt=St.length;kt<Yt;kt++){const L=Z(St[kt],vt[kt],J);M?Bt(L.x,L.y+w[h-1].y,w[h-1].x+ot):Bt(L.x,L.y,u+ot)}}}st(),ht();function st(){const ut=s.length/3;if(d){let rt=0,ot=et*rt;for(let J=0;J<le;J++){const yt=te[J];Dt(yt[2]+ot,yt[1]+ot,yt[0]+ot)}rt=h+m*2,ot=et*rt;for(let J=0;J<le;J++){const yt=te[J];Dt(yt[0]+ot,yt[1]+ot,yt[2]+ot)}}else{for(let rt=0;rt<le;rt++){const ot=te[rt];Dt(ot[2],ot[1],ot[0])}for(let rt=0;rt<le;rt++){const ot=te[rt];Dt(ot[0]+et*h,ot[1]+et*h,ot[2]+et*h)}}n.addGroup(ut,s.length/3-ut,0)}function ht(){const ut=s.length/3;let rt=0;Rt(Y,rt),rt+=Y.length;for(let ot=0,J=D.length;ot<J;ot++){const yt=D[ot];Rt(yt,rt),rt+=yt.length}n.addGroup(ut,s.length/3-ut,1)}function Rt(ut,rt){let ot=ut.length;for(;--ot>=0;){const J=ot;let yt=ot-1;yt<0&&(yt=ut.length-1);for(let pt=0,St=h+m*2;pt<St;pt++){const kt=et*pt,Yt=et*(pt+1),L=rt+J+kt,b=rt+yt+kt,H=rt+yt+Yt,tt=rt+J+Yt;ee(L,b,H,tt)}}}function Bt(ut,rt,ot){c.push(ut),c.push(rt),c.push(ot)}function Dt(ut,rt,ot){me(ut),me(rt),me(ot);const J=s.length/3,yt=T.generateTopUV(n,s,J-3,J-2,J-1);N(yt[0]),N(yt[1]),N(yt[2])}function ee(ut,rt,ot,J){me(ut),me(rt),me(J),me(rt),me(ot),me(J);const yt=s.length/3,pt=T.generateSideWallUV(n,s,yt-6,yt-3,yt-2,yt-1);N(pt[0]),N(pt[1]),N(pt[3]),N(pt[1]),N(pt[2]),N(pt[3])}function me(ut){s.push(c[ut*3+0]),s.push(c[ut*3+1]),s.push(c[ut*3+2])}function N(ut){o.push(ut.x),o.push(ut.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return tf(e,n,t)}static fromJSON(t,e){const n=[];for(let o=0,a=t.shapes.length;o<a;o++){const r=e[t.shapes[o]];n.push(r)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new cr[s.type]().fromJSON(s)),new Xr(n,t.options)}}const Qd={generateTopUV:function(i,t,e,n,s){const o=t[e*3],a=t[e*3+1],r=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new bt(o,a),new bt(r,c),new bt(l,h)]},generateSideWallUV:function(i,t,e,n,s,o){const a=t[e*3],r=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],_=t[o*3],m=t[o*3+1],p=t[o*3+2];return Math.abs(r-h)<Math.abs(a-l)?[new bt(a,1-c),new bt(l,1-u),new bt(d,1-g),new bt(_,1-p)]:[new bt(r,1-c),new bt(h,1-u),new bt(f,1-g),new bt(m,1-p)]}};function tf(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const o=i[n];e.shapes.push(o.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Rs extends Co{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Rs(t.radius,t.detail)}}class on extends Ne{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,a=e/2,r=Math.floor(n),c=Math.floor(s),l=r+1,h=c+1,u=t/r,d=e/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const T=p*d-a;for(let w=0;w<l;w++){const M=w*u-o;g.push(M,-T,0),_.push(0,0,1),m.push(w/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let T=0;T<r;T++){const w=T+l*p,M=T+l*(p+1),I=T+1+l*(p+1),E=T+1+l*p;f.push(w,M,E),f.push(M,I,E)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new on(t.width,t.height,t.widthSegments,t.heightSegments)}}class Yr extends Ne{constructor(t=new Ro([new bt(0,.5),new bt(-.5,-.5),new bt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],o=[],a=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(n),this.setAttribute("position",new he(s,3)),this.setAttribute("normal",new he(o,3)),this.setAttribute("uv",new he(a,2));function l(h){const u=s.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;On.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const T=g[m];On.isClockWise(T)===!0&&(g[m]=T.reverse())}const _=On.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const T=g[m];f=f.concat(T)}for(let m=0,p=f.length;m<p;m++){const T=f[m];s.push(T.x,T.y,0),o.push(0,0,1),a.push(T.x,T.y)}for(let m=0,p=_.length;m<p;m++){const T=_[m],w=T[0]+u,M=T[1]+u,I=T[2]+u;n.push(w,M,I),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return ef(e,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];n.push(a)}return new Yr(n,t.curveSegments)}}function ef(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class zt extends Ne{constructor(t=1,e=32,n=16,s=0,o=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:o,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+r,Math.PI);let l=0;const h=[],u=new U,d=new U,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const T=[],w=p/n;let M=0;p===0&&a===0?M=.5/e:p===n&&c===Math.PI&&(M=-.5/e);for(let I=0;I<=e;I++){const E=I/e;u.x=-t*Math.cos(s+E*o)*Math.sin(a+w*r),u.y=t*Math.cos(a+w*r),u.z=t*Math.sin(s+E*o)*Math.sin(a+w*r),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(E+M,1-w),T.push(l++)}h.push(T)}for(let p=0;p<n;p++)for(let T=0;T<e;T++){const w=h[p][T+1],M=h[p][T],I=h[p+1][T],E=h[p+1][T+1];(p!==0||a>0)&&f.push(w,M,E),(p!==n-1||c<Math.PI)&&f.push(M,I,E)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(_,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ye extends Ne{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const a=[],r=[],c=[],l=[],h=new U,u=new U,d=new U;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*o,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),r.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,T=(s+1)*f+g;a.push(_,m,T),a.push(m,p,T)}this.setIndex(a),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ye(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class ph extends Ki{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new ae(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wl,this.normalScale=new bt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class nf extends Ki{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_u,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class sf extends Ki{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class mh extends Ae{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ae(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class gh extends mh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ae(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const aa=new Te,Lc=new U,Dc=new U;class of{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new bt(512,512),this.mapType=En,this.map=null,this.mapPass=null,this.matrix=new Te,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Vr,this._frameExtents=new bt(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Lc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Lc),Dc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Dc),e.updateMatrixWorld(),aa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(aa,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(aa)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class jr extends th{constructor(t=-1,e=1,n=1,s=-1,o=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,a=n+t,r=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,a=o+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(o,a,r,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class af extends of{constructor(){super(new jr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class dr extends mh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ae.DEFAULT_UP),this.updateMatrix(),this.target=new Ae,this.shadow=new af}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class rf extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class cf{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Uc(i,t,e,n){const s=lf(n);switch(e){case Hl:return i*t;case Nr:return i*t/s.components*s.byteLength;case Fr:return i*t/s.components*s.byteLength;case Gl:return i*t*2/s.components*s.byteLength;case Or:return i*t*2/s.components*s.byteLength;case Vl:return i*t*3/s.components*s.byteLength;case _n:return i*t*4/s.components*s.byteLength;case zr:return i*t*4/s.components*s.byteLength;case co:case lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ho:case uo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Na:case Oa:return Math.max(i,16)*Math.max(t,8)/4;case Ua:case Fa:return Math.max(i,8)*Math.max(t,8)/2;case za:case Ba:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ka:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ha:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Va:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ga:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Wa:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case qa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Xa:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ya:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case ja:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Ja:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Za:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ka:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case $a:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Qa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case tr:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case er:case nr:case ir:return Math.ceil(i/4)*Math.ceil(t/4)*16;case sr:case or:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ar:case rr:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function lf(i){switch(i){case En:case Ol:return{byteLength:1,components:1};case vs:case zl:case Cs:return{byteLength:2,components:1};case Dr:case Ur:return{byteLength:2,components:4};case gi:case Lr:case Nn:return{byteLength:4,components:1};case Bl:case kl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ir}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ir);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function vh(){let i=null,t=!1,e=null,n=null;function s(o,a){e(o,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function hf(i){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),r.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:u}}function n(r,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,r),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function o(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(i.deleteBuffer(c.buffer),t.delete(r))}function a(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,r,c),l.version=r.version}}return{get:s,remove:o,update:a}}var uf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,df=`#ifdef USE_ALPHAHASH
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
#endif`,ff=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vf=`#ifdef USE_AOMAP
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
#endif`,_f=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xf=`#ifdef USE_BATCHING
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
#endif`,Mf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,wf=`#ifdef USE_IRIDESCENCE
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
#endif`,Ef=`#ifdef USE_BUMPMAP
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
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Df=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Uf=`#define PI 3.141592653589793
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
} // validated`,Nf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ff=`vec3 transformedNormal = objectNormal;
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
#endif`,Of=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gf=`#ifdef USE_ENVMAP
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
#endif`,Wf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qf=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Yf=`#ifdef USE_ENVMAP
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
#endif`,jf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,$f=`#ifdef USE_GRADIENTMAP
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
}`,Qf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ep=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,np=`uniform bool receiveShadow;
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
#endif`,ip=`#ifdef USE_ENVMAP
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
#endif`,sp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,op=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ap=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cp=`PhysicalMaterial material;
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
#endif`,lp=`struct PhysicalMaterial {
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
}`,hp=`
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
#endif`,up=`#if defined( RE_IndirectDiffuse )
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
#endif`,dp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,_p=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Mp=`#if defined( USE_POINTS_UV )
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
#endif`,yp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,wp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ep=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tp=`#ifdef USE_MORPHTARGETS
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
#endif`,Ap=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Rp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Pp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ip=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Dp=`#ifdef USE_NORMALMAP
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
#endif`,Up=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Np=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Op=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,kp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Vp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Jp=`float getShadowMask() {
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
}`,Zp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Kp=`#ifdef USE_SKINNING
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
#endif`,$p=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qp=`#ifdef USE_SKINNING
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
#endif`,t0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,e0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,n0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,i0=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,s0=`#ifdef USE_TRANSMISSION
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
#endif`,o0=`#ifdef USE_TRANSMISSION
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
#endif`,a0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,r0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,c0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,l0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const h0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,u0=`uniform sampler2D t2D;
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
}`,d0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,f0=`#ifdef ENVMAP_TYPE_CUBE
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
}`,p0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,m0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g0=`#include <common>
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
}`,v0=`#if DEPTH_PACKING == 3200
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
}`,_0=`#define DISTANCE
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
}`,x0=`#define DISTANCE
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
}`,M0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,y0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,S0=`uniform float scale;
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
}`,b0=`uniform vec3 diffuse;
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
}`,w0=`#include <common>
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
}`,E0=`uniform vec3 diffuse;
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
}`,T0=`#define LAMBERT
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
}`,A0=`#define LAMBERT
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
}`,C0=`#define MATCAP
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
}`,R0=`#define MATCAP
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
}`,P0=`#define NORMAL
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
}`,I0=`#define NORMAL
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
}`,L0=`#define PHONG
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
}`,D0=`#define PHONG
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
}`,U0=`#define STANDARD
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
}`,N0=`#define STANDARD
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
}`,F0=`#define TOON
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
}`,O0=`#define TOON
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
}`,z0=`uniform float size;
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
}`,B0=`uniform vec3 diffuse;
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
}`,k0=`#include <common>
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
}`,H0=`uniform vec3 color;
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
}`,V0=`uniform float rotation;
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
}`,G0=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:uf,alphahash_pars_fragment:df,alphamap_fragment:ff,alphamap_pars_fragment:pf,alphatest_fragment:mf,alphatest_pars_fragment:gf,aomap_fragment:vf,aomap_pars_fragment:_f,batching_pars_vertex:xf,batching_vertex:Mf,begin_vertex:yf,beginnormal_vertex:Sf,bsdfs:bf,iridescence_fragment:wf,bumpmap_pars_fragment:Ef,clipping_planes_fragment:Tf,clipping_planes_pars_fragment:Af,clipping_planes_pars_vertex:Cf,clipping_planes_vertex:Rf,color_fragment:Pf,color_pars_fragment:If,color_pars_vertex:Lf,color_vertex:Df,common:Uf,cube_uv_reflection_fragment:Nf,defaultnormal_vertex:Ff,displacementmap_pars_vertex:Of,displacementmap_vertex:zf,emissivemap_fragment:Bf,emissivemap_pars_fragment:kf,colorspace_fragment:Hf,colorspace_pars_fragment:Vf,envmap_fragment:Gf,envmap_common_pars_fragment:Wf,envmap_pars_fragment:qf,envmap_pars_vertex:Xf,envmap_physical_pars_fragment:ip,envmap_vertex:Yf,fog_vertex:jf,fog_pars_vertex:Jf,fog_fragment:Zf,fog_pars_fragment:Kf,gradientmap_pars_fragment:$f,lightmap_pars_fragment:Qf,lights_lambert_fragment:tp,lights_lambert_pars_fragment:ep,lights_pars_begin:np,lights_toon_fragment:sp,lights_toon_pars_fragment:op,lights_phong_fragment:ap,lights_phong_pars_fragment:rp,lights_physical_fragment:cp,lights_physical_pars_fragment:lp,lights_fragment_begin:hp,lights_fragment_maps:up,lights_fragment_end:dp,logdepthbuf_fragment:fp,logdepthbuf_pars_fragment:pp,logdepthbuf_pars_vertex:mp,logdepthbuf_vertex:gp,map_fragment:vp,map_pars_fragment:_p,map_particle_fragment:xp,map_particle_pars_fragment:Mp,metalnessmap_fragment:yp,metalnessmap_pars_fragment:Sp,morphinstance_vertex:bp,morphcolor_vertex:wp,morphnormal_vertex:Ep,morphtarget_pars_vertex:Tp,morphtarget_vertex:Ap,normal_fragment_begin:Cp,normal_fragment_maps:Rp,normal_pars_fragment:Pp,normal_pars_vertex:Ip,normal_vertex:Lp,normalmap_pars_fragment:Dp,clearcoat_normal_fragment_begin:Up,clearcoat_normal_fragment_maps:Np,clearcoat_pars_fragment:Fp,iridescence_pars_fragment:Op,opaque_fragment:zp,packing:Bp,premultiplied_alpha_fragment:kp,project_vertex:Hp,dithering_fragment:Vp,dithering_pars_fragment:Gp,roughnessmap_fragment:Wp,roughnessmap_pars_fragment:qp,shadowmap_pars_fragment:Xp,shadowmap_pars_vertex:Yp,shadowmap_vertex:jp,shadowmask_pars_fragment:Jp,skinbase_vertex:Zp,skinning_pars_vertex:Kp,skinning_vertex:$p,skinnormal_vertex:Qp,specularmap_fragment:t0,specularmap_pars_fragment:e0,tonemapping_fragment:n0,tonemapping_pars_fragment:i0,transmission_fragment:s0,transmission_pars_fragment:o0,uv_pars_fragment:a0,uv_pars_vertex:r0,uv_vertex:c0,worldpos_vertex:l0,background_vert:h0,background_frag:u0,backgroundCube_vert:d0,backgroundCube_frag:f0,cube_vert:p0,cube_frag:m0,depth_vert:g0,depth_frag:v0,distanceRGBA_vert:_0,distanceRGBA_frag:x0,equirect_vert:M0,equirect_frag:y0,linedashed_vert:S0,linedashed_frag:b0,meshbasic_vert:w0,meshbasic_frag:E0,meshlambert_vert:T0,meshlambert_frag:A0,meshmatcap_vert:C0,meshmatcap_frag:R0,meshnormal_vert:P0,meshnormal_frag:I0,meshphong_vert:L0,meshphong_frag:D0,meshphysical_vert:U0,meshphysical_frag:N0,meshtoon_vert:F0,meshtoon_frag:O0,points_vert:z0,points_frag:B0,shadow_vert:k0,shadow_frag:H0,sprite_vert:V0,sprite_frag:G0},Tt={common:{diffuse:{value:new ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new bt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new ae(16777215)},opacity:{value:1},center:{value:new bt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},Mn={basic:{uniforms:Ve([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:Ve([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new ae(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:Ve([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new ae(0)},specular:{value:new ae(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:Ve([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:Ve([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new ae(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:Ve([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:Ve([Tt.points,Tt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:Ve([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:Ve([Tt.common,Tt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:Ve([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:Ve([Tt.sprite,Tt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:Ve([Tt.common,Tt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:Ve([Tt.lights,Tt.fog,{color:{value:new ae(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};Mn.physical={uniforms:Ve([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new bt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new bt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new ae(0)},specularColor:{value:new ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new bt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const eo={r:0,b:0,g:0},ai=new Hn,W0=new Te;function q0(i,t,e,n,s,o,a){const r=new ae(0);let c=o===!0?0:1,l,h,u=null,d=0,f=null;function g(w){let M=w.isScene===!0?w.background:null;return M&&M.isTexture&&(M=(w.backgroundBlurriness>0?e:t).get(M)),M}function _(w){let M=!1;const I=g(w);I===null?p(r,c):I&&I.isColor&&(p(I,1),M=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||M)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(w,M){const I=g(M);I&&(I.isCubeTexture||I.mapping===Eo)?(h===void 0&&(h=new x(new G(1,1,1),new Qn({name:"BackgroundCubeMaterial",uniforms:Xi(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Ye,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),ai.copy(M.backgroundRotation),ai.x*=-1,ai.y*=-1,ai.z*=-1,I.isCubeTexture&&I.isRenderTargetTexture===!1&&(ai.y*=-1,ai.z*=-1),h.material.uniforms.envMap.value=I,h.material.uniforms.flipEnvMap.value=I.isCubeTexture&&I.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(W0.makeRotationFromEuler(ai)),h.material.toneMapped=fe.getTransfer(I.colorSpace)!==_e,(u!==I||d!==I.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=I,d=I.version,f=i.toneMapping),h.layers.enableAll(),w.unshift(h,h.geometry,h.material,0,0,null)):I&&I.isTexture&&(l===void 0&&(l=new x(new on(2,2),new Qn({name:"BackgroundMaterial",uniforms:Xi(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=I,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=fe.getTransfer(I.colorSpace)!==_e,I.matrixAutoUpdate===!0&&I.updateMatrix(),l.material.uniforms.uvTransform.value.copy(I.matrix),(u!==I||d!==I.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=I,d=I.version,f=i.toneMapping),l.layers.enableAll(),w.unshift(l,l.geometry,l.material,0,0,null))}function p(w,M){w.getRGB(eo,Ql(i)),n.buffers.color.setClear(eo.r,eo.g,eo.b,M,a)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(w,M=1){r.set(w),c=M,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(w){c=w,p(r,c)},render:_,addToRenderList:m,dispose:T}}function X0(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let o=s,a=!1;function r(v,D,F,z,q){let Y=!1;const Z=u(z,F,D);o!==Z&&(o=Z,l(o.object)),Y=f(v,z,F,q),Y&&g(v,z,F,q),q!==null&&t.update(q,i.ELEMENT_ARRAY_BUFFER),(Y||a)&&(a=!1,M(v,D,F,z),q!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(q).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,D,F){const z=F.wireframe===!0;let q=n[v.id];q===void 0&&(q={},n[v.id]=q);let Y=q[D.id];Y===void 0&&(Y={},q[D.id]=Y);let Z=Y[z];return Z===void 0&&(Z=d(c()),Y[z]=Z),Z}function d(v){const D=[],F=[],z=[];for(let q=0;q<e;q++)D[q]=0,F[q]=0,z[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:z,object:v,attributes:{},index:null}}function f(v,D,F,z){const q=o.attributes,Y=D.attributes;let Z=0;const et=F.getAttributes();for(const j in et)if(et[j].location>=0){const X=q[j];let vt=Y[j];if(vt===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(vt=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(vt=v.instanceColor)),X===void 0||X.attribute!==vt||vt&&X.data!==vt.data)return!0;Z++}return o.attributesNum!==Z||o.index!==z}function g(v,D,F,z){const q={},Y=D.attributes;let Z=0;const et=F.getAttributes();for(const j in et)if(et[j].location>=0){let X=Y[j];X===void 0&&(j==="instanceMatrix"&&v.instanceMatrix&&(X=v.instanceMatrix),j==="instanceColor"&&v.instanceColor&&(X=v.instanceColor));const vt={};vt.attribute=X,X&&X.data&&(vt.data=X.data),q[j]=vt,Z++}o.attributes=q,o.attributesNum=Z,o.index=z}function _(){const v=o.newAttributes;for(let D=0,F=v.length;D<F;D++)v[D]=0}function m(v){p(v,0)}function p(v,D){const F=o.newAttributes,z=o.enabledAttributes,q=o.attributeDivisors;F[v]=1,z[v]===0&&(i.enableVertexAttribArray(v),z[v]=1),q[v]!==D&&(i.vertexAttribDivisor(v,D),q[v]=D)}function T(){const v=o.newAttributes,D=o.enabledAttributes;for(let F=0,z=D.length;F<z;F++)D[F]!==v[F]&&(i.disableVertexAttribArray(F),D[F]=0)}function w(v,D,F,z,q,Y,Z){Z===!0?i.vertexAttribIPointer(v,D,F,q,Y):i.vertexAttribPointer(v,D,F,z,q,Y)}function M(v,D,F,z){_();const q=z.attributes,Y=F.getAttributes(),Z=D.defaultAttributeValues;for(const et in Y){const j=Y[et];if(j.location>=0){let nt=q[et];if(nt===void 0&&(et==="instanceMatrix"&&v.instanceMatrix&&(nt=v.instanceMatrix),et==="instanceColor"&&v.instanceColor&&(nt=v.instanceColor)),nt!==void 0){const X=nt.normalized,vt=nt.itemSize,Wt=t.get(nt);if(Wt===void 0)continue;const te=Wt.buffer,le=Wt.type,se=Wt.bytesPerElement,st=le===i.INT||le===i.UNSIGNED_INT||nt.gpuType===Lr;if(nt.isInterleavedBufferAttribute){const ht=nt.data,Rt=ht.stride,Bt=nt.offset;if(ht.isInstancedInterleavedBuffer){for(let Dt=0;Dt<j.locationSize;Dt++)p(j.location+Dt,ht.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ht.meshPerAttribute*ht.count)}else for(let Dt=0;Dt<j.locationSize;Dt++)m(j.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,te);for(let Dt=0;Dt<j.locationSize;Dt++)w(j.location+Dt,vt/j.locationSize,le,X,Rt*se,(Bt+vt/j.locationSize*Dt)*se,st)}else{if(nt.isInstancedBufferAttribute){for(let ht=0;ht<j.locationSize;ht++)p(j.location+ht,nt.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=nt.meshPerAttribute*nt.count)}else for(let ht=0;ht<j.locationSize;ht++)m(j.location+ht);i.bindBuffer(i.ARRAY_BUFFER,te);for(let ht=0;ht<j.locationSize;ht++)w(j.location+ht,vt/j.locationSize,le,X,vt*se,vt/j.locationSize*ht*se,st)}}else if(Z!==void 0){const X=Z[et];if(X!==void 0)switch(X.length){case 2:i.vertexAttrib2fv(j.location,X);break;case 3:i.vertexAttrib3fv(j.location,X);break;case 4:i.vertexAttrib4fv(j.location,X);break;default:i.vertexAttrib1fv(j.location,X)}}}}T()}function I(){C();for(const v in n){const D=n[v];for(const F in D){const z=D[F];for(const q in z)h(z[q].object),delete z[q];delete D[F]}delete n[v]}}function E(v){if(n[v.id]===void 0)return;const D=n[v.id];for(const F in D){const z=D[F];for(const q in z)h(z[q].object),delete z[q];delete D[F]}delete n[v.id]}function A(v){for(const D in n){const F=n[D];if(F[v.id]===void 0)continue;const z=F[v.id];for(const q in z)h(z[q].object),delete z[q];delete F[v.id]}}function C(){y(),a=!0,o!==s&&(o=s,l(o.object))}function y(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:r,reset:C,resetDefaultState:y,dispose:I,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:T}}function Y0(i,t,e){let n;function s(l){n=l}function o(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function a(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function r(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=o,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function j0(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(A){return!(A!==_n&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(A){const C=A===Cs&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==En&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Nn&&!C)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),M=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),I=g>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:w,maxFragmentUniforms:M,vertexTextures:I,maxSamples:E}}function J0(i){const t=this;let e=null,n=0,s=!1,o=!1;const a=new li,r=new $t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const T=o?0:n,w=T*4;let M=p.clippingState||null;c.value=M,M=h(g,d,w,f);for(let I=0;I!==w;++I)M[I]=e[I];p.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,T=d.matrixWorldInverse;r.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let w=0,M=f;w!==_;++w,M+=4)a.copy(u[w]).applyMatrix4(T,r),a.normal.toArray(m,M),m[M+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Z0(i){let t=new WeakMap;function e(a,r){return r===Pa?a.mapping=Gi:r===Ia&&(a.mapping=Wi),a}function n(a){if(a&&a.isTexture){const r=a.mapping;if(r===Pa||r===Ia)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new pd(c.height);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",s),e(l.texture,a.mapping)}else return null}}return a}function s(a){const r=a.target;r.removeEventListener("dispose",s);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}const Bi=4,Nc=[.125,.215,.35,.446,.526,.582],di=20,ra=new jr,Fc=new ae;let ca=null,la=0,ha=0,ua=!1;const hi=(1+Math.sqrt(5))/2,Ni=1/hi,Oc=[new U(-hi,Ni,0),new U(hi,Ni,0),new U(-Ni,0,hi),new U(Ni,0,hi),new U(0,hi,-Ni),new U(0,hi,Ni),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],K0=new U;class zc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,o={}){const{size:a=256,position:r=K0}=o;ca=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,r),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Hc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ca,la,ha),this._renderer.xr.enabled=ua,t.scissorTest=!1,no(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Gi||t.mapping===Wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ca=this._renderer.getRenderTarget(),la=this._renderer.getActiveCubeFace(),ha=this._renderer.getActiveMipmapLevel(),ua=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:yn,minFilter:yn,generateMipmaps:!1,type:Cs,format:_n,colorSpace:qi,depthBuffer:!1},s=Bc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bc(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$0(o)),this._blurMaterial=Q0(o,t,e)}return s}_compileMaterial(t){const e=new x(this._lodPlanes[0],t);this._renderer.compile(e,ra)}_sceneToCubeUV(t,e,n,s,o){const c=new sn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Fc),u.toneMapping=$n,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const _=new Ao({name:"PMREM.Background",side:Ye,depthWrite:!1,depthTest:!1}),m=new x(new G,_);let p=!1;const T=t.background;T?T.isColor&&(_.color.copy(T),t.background=null,p=!0):(_.color.copy(Fc),p=!0);for(let w=0;w<6;w++){const M=w%3;M===0?(c.up.set(0,l[w],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x+h[w],o.y,o.z)):M===1?(c.up.set(0,0,l[w]),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y+h[w],o.z)):(c.up.set(0,l[w],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y,o.z+h[w]));const I=this._cubeSize;no(s,M*I,w>2?I:0,I,I),u.setRenderTarget(s),p&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=T}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Gi||t.mapping===Wi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Hc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kc());const o=s?this._cubemapMaterial:this._equirectMaterial,a=new x(this._lodPlanes[0],o),r=o.uniforms;r.envMap.value=t;const c=this._cubeSize;no(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,ra)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const a=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),r=Oc[(s-o-1)%Oc.length];this._blur(t,o-1,o,a,r)}e.autoClear=n}_blur(t,e,n,s,o){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",o),this._halfBlur(a,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new x(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*f):2*Math.PI/(2*di-1),_=o/g,m=isFinite(o)?1+Math.floor(h*_):di;m>di&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${di}`);const p=[];let T=0;for(let A=0;A<di;++A){const C=A/_,y=Math.exp(-C*C/2);p.push(y),A===0?T+=y:A<m&&(T+=2*y)}for(let A=0;A<p.length;A++)p[A]=p[A]/T;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=a==="latitudinal",r&&(d.poleAxis.value=r);const{_lodMax:w}=this;d.dTheta.value=g,d.mipInt.value=w-n;const M=this._sizeLods[s],I=3*M*(s>w-Bi?s-w+Bi:0),E=4*(this._cubeSize-M);no(e,I,E,3*M,2*M),c.setRenderTarget(e),c.render(u,ra)}}function $0(i){const t=[],e=[],n=[];let s=i;const o=i-Bi+1+Nc.length;for(let a=0;a<o;a++){const r=Math.pow(2,s);e.push(r);let c=1/r;a>i-Bi?c=Nc[a-i+Bi-1]:a===0&&(c=0),n.push(c);const l=1/(r-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,T=new Float32Array(_*g*f),w=new Float32Array(m*g*f),M=new Float32Array(p*g*f);for(let E=0;E<f;E++){const A=E%3*2/3-1,C=E>2?0:-1,y=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];T.set(y,_*g*E),w.set(d,m*g*E);const v=[E,E,E,E,E,E];M.set(v,p*g*E)}const I=new Ne;I.setAttribute("position",new wn(T,_)),I.setAttribute("uv",new wn(w,m)),I.setAttribute("faceIndex",new wn(M,p)),t.push(I),s>Bi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Bc(i,t,e){const n=new vi(i,t,e);return n.texture.mapping=Eo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function no(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Q0(i,t,e){const n=new Float32Array(di),s=new U(0,1,0);return new Qn({name:"SphericalGaussianBlur",defines:{n:di,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Jr(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function kc(){return new Qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Jr(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Hc(){return new Qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Jr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Jr(){return`

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
	`}function tm(i){let t=new WeakMap,e=null;function n(r){if(r&&r.isTexture){const c=r.mapping,l=c===Pa||c===Ia,h=c===Gi||c===Wi;if(l||h){let u=t.get(r);const d=u!==void 0?u.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==d)return e===null&&(e=new zc(i)),u=l?e.fromEquirectangular(r,u):e.fromCubemap(r,u),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),u.texture;if(u!==void 0)return u.texture;{const f=r.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new zc(i)),u=l?e.fromEquirectangular(r):e.fromCubemap(r),u.texture.pmremVersion=r.pmremVersion,t.set(r,u),r.addEventListener("dispose",o),u.texture):null}}}return r}function s(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function o(r){const c=r.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function em(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ss("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function nm(i,t,e,n){const s={},o=new WeakMap;function a(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",a),delete s[d.id];const f=o.get(d);f&&(t.remove(f),o.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function r(u,d){return s[d.id]===!0||(d.addEventListener("dispose",a),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const T=f.array;_=f.version;for(let w=0,M=T.length;w<M;w+=3){const I=T[w+0],E=T[w+1],A=T[w+2];d.push(I,E,E,A,A,I)}}else if(g!==void 0){const T=g.array;_=g.version;for(let w=0,M=T.length/3-1;w<M;w+=3){const I=w+0,E=w+1,A=w+2;d.push(I,E,E,A,A,I)}}else return;const m=new(Xl(d)?$l:Kl)(d,1);m.version=_;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const d=o.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return o.get(u)}return{get:r,update:c,getWireframeAttribute:h}}function im(i,t,e){let n;function s(d){n=d}let o,a;function r(d){o=d.type,a=d.bytesPerElement}function c(d,f){i.drawElements(n,f,o,d*a),e.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,o,d*a,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,o,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/a,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,o,d,0,_,0,g);let p=0;for(let T=0;T<g;T++)p+=f[T]*_[T];e.update(p,n,1)}}this.setMode=s,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function sm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,a,r){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=r*(o/3);break;case i.LINES:e.lines+=r*(o/2);break;case i.LINE_STRIP:e.lines+=r*(o-1);break;case i.LINE_LOOP:e.lines+=r*o;break;case i.POINTS:e.points+=r*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function om(i,t,e){const n=new WeakMap,s=new Re;function o(a,r,c){const l=a.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(r);if(d===void 0||d.count!==u){let v=function(){C.dispose(),n.delete(r),r.removeEventListener("dispose",v)};var f=v;d!==void 0&&d.texture.dispose();const g=r.morphAttributes.position!==void 0,_=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],T=r.morphAttributes.normal||[],w=r.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),m===!0&&(M=3);let I=r.attributes.position.count*M,E=1;I>t.maxTextureSize&&(E=Math.ceil(I/t.maxTextureSize),I=t.maxTextureSize);const A=new Float32Array(I*E*4*u),C=new Yl(A,I,E,u);C.type=Nn,C.needsUpdate=!0;const y=M*4;for(let D=0;D<u;D++){const F=p[D],z=T[D],q=w[D],Y=I*E*4*D;for(let Z=0;Z<F.count;Z++){const et=Z*y;g===!0&&(s.fromBufferAttribute(F,Z),A[Y+et+0]=s.x,A[Y+et+1]=s.y,A[Y+et+2]=s.z,A[Y+et+3]=0),_===!0&&(s.fromBufferAttribute(z,Z),A[Y+et+4]=s.x,A[Y+et+5]=s.y,A[Y+et+6]=s.z,A[Y+et+7]=0),m===!0&&(s.fromBufferAttribute(q,Z),A[Y+et+8]=s.x,A[Y+et+9]=s.y,A[Y+et+10]=s.z,A[Y+et+11]=q.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new bt(I,E)},n.set(r,d),r.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:o}}function am(i,t,e,n){let s=new WeakMap;function o(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function a(){s=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:a}}const _h=new Be,Vc=new sh(1,1),xh=new Yl,Mh=new Ku,yh=new eh,Gc=[],Wc=[],qc=new Float32Array(16),Xc=new Float32Array(9),Yc=new Float32Array(4);function $i(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=Gc[s];if(o===void 0&&(o=new Float32Array(s),Gc[s]=o),t!==0){n.toArray(o,0);for(let a=1,r=0;a!==t;++a)r+=e,i[a].toArray(o,r)}return o}function Ie(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Le(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Po(i,t){let e=Wc[t];e===void 0&&(e=new Int32Array(t),Wc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function rm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2fv(this.addr,t),Le(e,t)}}function lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;i.uniform3fv(this.addr,t),Le(e,t)}}function hm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4fv(this.addr,t),Le(e,t)}}function um(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;Yc.set(n),i.uniformMatrix2fv(this.addr,!1,Yc),Le(e,n)}}function dm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;Xc.set(n),i.uniformMatrix3fv(this.addr,!1,Xc),Le(e,n)}}function fm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;qc.set(n),i.uniformMatrix4fv(this.addr,!1,qc),Le(e,n)}}function pm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2iv(this.addr,t),Le(e,t)}}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3iv(this.addr,t),Le(e,t)}}function vm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4iv(this.addr,t),Le(e,t)}}function _m(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2uiv(this.addr,t),Le(e,t)}}function Mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3uiv(this.addr,t),Le(e,t)}}function ym(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4uiv(this.addr,t),Le(e,t)}}function Sm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(Vc.compareFunction=ql,o=Vc):o=_h,e.setTexture2D(t||o,s)}function bm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Mh,s)}function wm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||yh,s)}function Em(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||xh,s)}function Tm(i){switch(i){case 5126:return rm;case 35664:return cm;case 35665:return lm;case 35666:return hm;case 35674:return um;case 35675:return dm;case 35676:return fm;case 5124:case 35670:return pm;case 35667:case 35671:return mm;case 35668:case 35672:return gm;case 35669:case 35673:return vm;case 5125:return _m;case 36294:return xm;case 36295:return Mm;case 36296:return ym;case 35678:case 36198:case 36298:case 36306:case 35682:return Sm;case 35679:case 36299:case 36307:return bm;case 35680:case 36300:case 36308:case 36293:return wm;case 36289:case 36303:case 36311:case 36292:return Em}}function Am(i,t){i.uniform1fv(this.addr,t)}function Cm(i,t){const e=$i(t,this.size,2);i.uniform2fv(this.addr,e)}function Rm(i,t){const e=$i(t,this.size,3);i.uniform3fv(this.addr,e)}function Pm(i,t){const e=$i(t,this.size,4);i.uniform4fv(this.addr,e)}function Im(i,t){const e=$i(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Lm(i,t){const e=$i(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Dm(i,t){const e=$i(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Um(i,t){i.uniform1iv(this.addr,t)}function Nm(i,t){i.uniform2iv(this.addr,t)}function Fm(i,t){i.uniform3iv(this.addr,t)}function Om(i,t){i.uniform4iv(this.addr,t)}function zm(i,t){i.uniform1uiv(this.addr,t)}function Bm(i,t){i.uniform2uiv(this.addr,t)}function km(i,t){i.uniform3uiv(this.addr,t)}function Hm(i,t){i.uniform4uiv(this.addr,t)}function Vm(i,t,e){const n=this.cache,s=t.length,o=Po(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||_h,o[a])}function Gm(i,t,e){const n=this.cache,s=t.length,o=Po(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||Mh,o[a])}function Wm(i,t,e){const n=this.cache,s=t.length,o=Po(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||yh,o[a])}function qm(i,t,e){const n=this.cache,s=t.length,o=Po(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||xh,o[a])}function Xm(i){switch(i){case 5126:return Am;case 35664:return Cm;case 35665:return Rm;case 35666:return Pm;case 35674:return Im;case 35675:return Lm;case 35676:return Dm;case 5124:case 35670:return Um;case 35667:case 35671:return Nm;case 35668:case 35672:return Fm;case 35669:case 35673:return Om;case 5125:return zm;case 36294:return Bm;case 36295:return km;case 36296:return Hm;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Gm;case 35680:case 36300:case 36308:case 36293:return Wm;case 36289:case 36303:case 36311:case 36292:return qm}}class Ym{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tm(e.type)}}class jm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xm(e.type)}}class Jm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,a=s.length;o!==a;++o){const r=s[o];r.setValue(t,e[r.id],n)}}}const da=/(\w+)(\])?(\[|\.)?/g;function jc(i,t){i.seq.push(t),i.map[t.id]=t}function Zm(i,t,e){const n=i.name,s=n.length;for(da.lastIndex=0;;){const o=da.exec(n),a=da.lastIndex;let r=o[1];const c=o[2]==="]",l=o[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===s){jc(e,l===void 0?new Ym(r,i,t):new jm(r,i,t));break}else{let u=e.map[r];u===void 0&&(u=new Jm(r),jc(e,u)),e=u}}}class fo{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),a=t.getUniformLocation(e,o.name);Zm(o,a,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,a=e.length;o!==a;++o){const r=e[o],c=n[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const a=t[s];a.id in e&&n.push(a)}return n}}function Jc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Km=37297;let $m=0;function Qm(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let a=s;a<o;a++){const r=a+1;n.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return n.join(`
`)}const Zc=new $t;function tg(i){fe._getMatrix(Zc,fe.workingColorSpace,i);const t=`mat3( ${Zc.elements.map(e=>e.toFixed(4))} )`;switch(fe.getTransfer(i)){case _o:return[t,"LinearTransferOETF"];case _e:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Kc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),o=(i.getShaderInfoLog(t)||"").trim();if(n&&o==="")return"";const a=/ERROR: 0:(\d+)/.exec(o);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+o+`

`+Qm(i.getShaderSource(t),r)}else return o}function eg(i,t){const e=tg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function ng(i,t){let e;switch(t){case hu:e="Linear";break;case uu:e="Reinhard";break;case du:e="Cineon";break;case fu:e="ACESFilmic";break;case mu:e="AgX";break;case gu:e="Neutral";break;case pu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const io=new U;function ig(){fe.getLuminanceCoefficients(io);const i=io.x.toFixed(4),t=io.y.toFixed(4),e=io.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(us).join(`
`)}function og(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ag(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),a=o.name;let r=1;o.type===i.FLOAT_MAT2&&(r=2),o.type===i.FLOAT_MAT3&&(r=3),o.type===i.FLOAT_MAT4&&(r=4),e[a]={type:o.type,location:i.getAttribLocation(t,a),locationSize:r}}return e}function us(i){return i!==""}function $c(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Qc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const rg=/^[ \t]*#include +<([\w\d./]+)>/gm;function fr(i){return i.replace(rg,lg)}const cg=new Map;function lg(i,t){let e=Qt[t];if(e===void 0){const n=cg.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return fr(e)}const hg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tl(i){return i.replace(hg,ug)}function ug(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function el(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function dg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Dl?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ul?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ln&&(t="SHADOWMAP_TYPE_VSM"),t}function fg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Gi:case Wi:t="ENVMAP_TYPE_CUBE";break;case Eo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function pg(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Wi:t="ENVMAP_MODE_REFRACTION";break}return t}function mg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Nl:t="ENVMAP_BLENDING_MULTIPLY";break;case cu:t="ENVMAP_BLENDING_MIX";break;case lu:t="ENVMAP_BLENDING_ADD";break}return t}function gg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function vg(i,t,e,n){const s=i.getContext(),o=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=dg(e),l=fg(e),h=pg(e),u=mg(e),d=gg(e),f=sg(e),g=og(o),_=s.createProgram();let m,p,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(us).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(us).join(`
`),p.length>0&&(p+=`
`)):(m=[el(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(us).join(`
`),p=[el(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==$n?"#define TONE_MAPPING":"",e.toneMapping!==$n?Qt.tonemapping_pars_fragment:"",e.toneMapping!==$n?ng("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,eg("linearToOutputTexel",e.outputColorSpace),ig(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(us).join(`
`)),a=fr(a),a=$c(a,e),a=Qc(a,e),r=fr(r),r=$c(r,e),r=Qc(r,e),a=tl(a),r=tl(r),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===sc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===sc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const w=T+m+a,M=T+p+r,I=Jc(s,s.VERTEX_SHADER,w),E=Jc(s,s.FRAGMENT_SHADER,M);s.attachShader(_,I),s.attachShader(_,E),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(D){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(_)||"",z=s.getShaderInfoLog(I)||"",q=s.getShaderInfoLog(E)||"",Y=F.trim(),Z=z.trim(),et=q.trim();let j=!0,nt=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(j=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,I,E);else{const X=Kc(s,I,"vertex"),vt=Kc(s,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+Y+`
`+X+`
`+vt)}else Y!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Y):(Z===""||et==="")&&(nt=!1);nt&&(D.diagnostics={runnable:j,programLog:Y,vertexShader:{log:Z,prefix:m},fragmentShader:{log:et,prefix:p}})}s.deleteShader(I),s.deleteShader(E),C=new fo(s,_),y=ag(s,_)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let y;this.getAttributes=function(){return y===void 0&&A(this),y};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,Km)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=$m++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=I,this.fragmentShader=E,this}let _g=0;class xg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(o)===!1&&(a.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Mg(t),e.set(t,n)),n}}class Mg{constructor(t){this.id=_g++,this.code=t,this.usedTimes=0}}function yg(i,t,e,n,s,o,a){const r=new Jl,c=new xg,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(y){return l.add(y),y===0?"uv":`uv${y}`}function m(y,v,D,F,z){const q=F.fog,Y=z.geometry,Z=y.isMeshStandardMaterial?F.environment:null,et=(y.isMeshStandardMaterial?e:t).get(y.envMap||Z),j=et&&et.mapping===Eo?et.image.height:null,nt=g[y.type];y.precision!==null&&(f=s.getMaxPrecision(y.precision),f!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",f,"instead."));const X=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,vt=X!==void 0?X.length:0;let Wt=0;Y.morphAttributes.position!==void 0&&(Wt=1),Y.morphAttributes.normal!==void 0&&(Wt=2),Y.morphAttributes.color!==void 0&&(Wt=3);let te,le,se,st;if(nt){const ie=Mn[nt];te=ie.vertexShader,le=ie.fragmentShader}else te=y.vertexShader,le=y.fragmentShader,c.update(y),se=c.getVertexShaderID(y),st=c.getFragmentShaderID(y);const ht=i.getRenderTarget(),Rt=i.state.buffers.depth.getReversed(),Bt=z.isInstancedMesh===!0,Dt=z.isBatchedMesh===!0,ee=!!y.map,me=!!y.matcap,N=!!et,ut=!!y.aoMap,rt=!!y.lightMap,ot=!!y.bumpMap,J=!!y.normalMap,yt=!!y.displacementMap,pt=!!y.emissiveMap,St=!!y.metalnessMap,kt=!!y.roughnessMap,Yt=y.anisotropy>0,L=y.clearcoat>0,b=y.dispersion>0,H=y.iridescence>0,tt=y.sheen>0,lt=y.transmission>0,$=Yt&&!!y.anisotropyMap,It=L&&!!y.clearcoatMap,_t=L&&!!y.clearcoatNormalMap,Ut=L&&!!y.clearcoatRoughnessMap,Nt=H&&!!y.iridescenceMap,mt=H&&!!y.iridescenceThicknessMap,At=tt&&!!y.sheenColorMap,Vt=tt&&!!y.sheenRoughnessMap,Ot=!!y.specularMap,Et=!!y.specularColorMap,Zt=!!y.specularIntensityMap,B=lt&&!!y.transmissionMap,gt=lt&&!!y.thicknessMap,Mt=!!y.gradientMap,wt=!!y.alphaMap,ft=y.alphaTest>0,at=!!y.alphaHash,Lt=!!y.extensions;let Jt=$n;y.toneMapped&&(ht===null||ht.isXRRenderTarget===!0)&&(Jt=i.toneMapping);const ge={shaderID:nt,shaderType:y.type,shaderName:y.name,vertexShader:te,fragmentShader:le,defines:y.defines,customVertexShaderID:se,customFragmentShaderID:st,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:f,batching:Dt,batchingColor:Dt&&z._colorsTexture!==null,instancing:Bt,instancingColor:Bt&&z.instanceColor!==null,instancingMorph:Bt&&z.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ht===null?i.outputColorSpace:ht.isXRRenderTarget===!0?ht.texture.colorSpace:qi,alphaToCoverage:!!y.alphaToCoverage,map:ee,matcap:me,envMap:N,envMapMode:N&&et.mapping,envMapCubeUVHeight:j,aoMap:ut,lightMap:rt,bumpMap:ot,normalMap:J,displacementMap:d&&yt,emissiveMap:pt,normalMapObjectSpace:J&&y.normalMapType===Mu,normalMapTangentSpace:J&&y.normalMapType===Wl,metalnessMap:St,roughnessMap:kt,anisotropy:Yt,anisotropyMap:$,clearcoat:L,clearcoatMap:It,clearcoatNormalMap:_t,clearcoatRoughnessMap:Ut,dispersion:b,iridescence:H,iridescenceMap:Nt,iridescenceThicknessMap:mt,sheen:tt,sheenColorMap:At,sheenRoughnessMap:Vt,specularMap:Ot,specularColorMap:Et,specularIntensityMap:Zt,transmission:lt,transmissionMap:B,thicknessMap:gt,gradientMap:Mt,opaque:y.transparent===!1&&y.blending===ki&&y.alphaToCoverage===!1,alphaMap:wt,alphaTest:ft,alphaHash:at,combine:y.combine,mapUv:ee&&_(y.map.channel),aoMapUv:ut&&_(y.aoMap.channel),lightMapUv:rt&&_(y.lightMap.channel),bumpMapUv:ot&&_(y.bumpMap.channel),normalMapUv:J&&_(y.normalMap.channel),displacementMapUv:yt&&_(y.displacementMap.channel),emissiveMapUv:pt&&_(y.emissiveMap.channel),metalnessMapUv:St&&_(y.metalnessMap.channel),roughnessMapUv:kt&&_(y.roughnessMap.channel),anisotropyMapUv:$&&_(y.anisotropyMap.channel),clearcoatMapUv:It&&_(y.clearcoatMap.channel),clearcoatNormalMapUv:_t&&_(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ut&&_(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&_(y.iridescenceMap.channel),iridescenceThicknessMapUv:mt&&_(y.iridescenceThicknessMap.channel),sheenColorMapUv:At&&_(y.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&_(y.sheenRoughnessMap.channel),specularMapUv:Ot&&_(y.specularMap.channel),specularColorMapUv:Et&&_(y.specularColorMap.channel),specularIntensityMapUv:Zt&&_(y.specularIntensityMap.channel),transmissionMapUv:B&&_(y.transmissionMap.channel),thicknessMapUv:gt&&_(y.thicknessMap.channel),alphaMapUv:wt&&_(y.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(J||Yt),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Y.attributes.uv&&(ee||wt),fog:!!q,useFog:y.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:y.flatShading===!0&&y.wireframe===!1,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Rt,skinning:z.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:vt,morphTextureStride:Wt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:y.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Jt,decodeVideoTexture:ee&&y.map.isVideoTexture===!0&&fe.getTransfer(y.map.colorSpace)===_e,decodeVideoTextureEmissive:pt&&y.emissiveMap.isVideoTexture===!0&&fe.getTransfer(y.emissiveMap.colorSpace)===_e,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===mn,flipSided:y.side===Ye,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:Lt&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&y.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ge.vertexUv1s=l.has(1),ge.vertexUv2s=l.has(2),ge.vertexUv3s=l.has(3),l.clear(),ge}function p(y){const v=[];if(y.shaderID?v.push(y.shaderID):(v.push(y.customVertexShaderID),v.push(y.customFragmentShaderID)),y.defines!==void 0)for(const D in y.defines)v.push(D),v.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(T(v,y),w(v,y),v.push(i.outputColorSpace)),v.push(y.customProgramCacheKey),v.join()}function T(y,v){y.push(v.precision),y.push(v.outputColorSpace),y.push(v.envMapMode),y.push(v.envMapCubeUVHeight),y.push(v.mapUv),y.push(v.alphaMapUv),y.push(v.lightMapUv),y.push(v.aoMapUv),y.push(v.bumpMapUv),y.push(v.normalMapUv),y.push(v.displacementMapUv),y.push(v.emissiveMapUv),y.push(v.metalnessMapUv),y.push(v.roughnessMapUv),y.push(v.anisotropyMapUv),y.push(v.clearcoatMapUv),y.push(v.clearcoatNormalMapUv),y.push(v.clearcoatRoughnessMapUv),y.push(v.iridescenceMapUv),y.push(v.iridescenceThicknessMapUv),y.push(v.sheenColorMapUv),y.push(v.sheenRoughnessMapUv),y.push(v.specularMapUv),y.push(v.specularColorMapUv),y.push(v.specularIntensityMapUv),y.push(v.transmissionMapUv),y.push(v.thicknessMapUv),y.push(v.combine),y.push(v.fogExp2),y.push(v.sizeAttenuation),y.push(v.morphTargetsCount),y.push(v.morphAttributeCount),y.push(v.numDirLights),y.push(v.numPointLights),y.push(v.numSpotLights),y.push(v.numSpotLightMaps),y.push(v.numHemiLights),y.push(v.numRectAreaLights),y.push(v.numDirLightShadows),y.push(v.numPointLightShadows),y.push(v.numSpotLightShadows),y.push(v.numSpotLightShadowsWithMaps),y.push(v.numLightProbes),y.push(v.shadowMapType),y.push(v.toneMapping),y.push(v.numClippingPlanes),y.push(v.numClipIntersection),y.push(v.depthPacking)}function w(y,v){r.disableAll(),v.supportsVertexTextures&&r.enable(0),v.instancing&&r.enable(1),v.instancingColor&&r.enable(2),v.instancingMorph&&r.enable(3),v.matcap&&r.enable(4),v.envMap&&r.enable(5),v.normalMapObjectSpace&&r.enable(6),v.normalMapTangentSpace&&r.enable(7),v.clearcoat&&r.enable(8),v.iridescence&&r.enable(9),v.alphaTest&&r.enable(10),v.vertexColors&&r.enable(11),v.vertexAlphas&&r.enable(12),v.vertexUv1s&&r.enable(13),v.vertexUv2s&&r.enable(14),v.vertexUv3s&&r.enable(15),v.vertexTangents&&r.enable(16),v.anisotropy&&r.enable(17),v.alphaHash&&r.enable(18),v.batching&&r.enable(19),v.dispersion&&r.enable(20),v.batchingColor&&r.enable(21),v.gradientMap&&r.enable(22),y.push(r.mask),r.disableAll(),v.fog&&r.enable(0),v.useFog&&r.enable(1),v.flatShading&&r.enable(2),v.logarithmicDepthBuffer&&r.enable(3),v.reversedDepthBuffer&&r.enable(4),v.skinning&&r.enable(5),v.morphTargets&&r.enable(6),v.morphNormals&&r.enable(7),v.morphColors&&r.enable(8),v.premultipliedAlpha&&r.enable(9),v.shadowMapEnabled&&r.enable(10),v.doubleSided&&r.enable(11),v.flipSided&&r.enable(12),v.useDepthPacking&&r.enable(13),v.dithering&&r.enable(14),v.transmission&&r.enable(15),v.sheen&&r.enable(16),v.opaque&&r.enable(17),v.pointsUvs&&r.enable(18),v.decodeVideoTexture&&r.enable(19),v.decodeVideoTextureEmissive&&r.enable(20),v.alphaToCoverage&&r.enable(21),y.push(r.mask)}function M(y){const v=g[y.type];let D;if(v){const F=Mn[v];D=hd.clone(F.uniforms)}else D=y.uniforms;return D}function I(y,v){let D;for(let F=0,z=h.length;F<z;F++){const q=h[F];if(q.cacheKey===v){D=q,++D.usedTimes;break}}return D===void 0&&(D=new vg(i,v,y,o),h.push(D)),D}function E(y){if(--y.usedTimes===0){const v=h.indexOf(y);h[v]=h[h.length-1],h.pop(),y.destroy()}}function A(y){c.remove(y)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:M,acquireProgram:I,releaseProgram:E,releaseShaderCache:A,programs:h,dispose:C}}function Sg(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let r=i.get(a);return r===void 0&&(r={},i.set(a,r)),r}function n(a){i.delete(a)}function s(a,r,c){i.get(a)[r]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function bg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function nl(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function il(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function a(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function r(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,_,m){const p=a(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||bg),n.length>1&&n.sort(d||nl),s.length>1&&s.sort(d||nl)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:r,unshift:c,finish:h,sort:l}}function wg(){let i=new WeakMap;function t(n,s){const o=i.get(n);let a;return o===void 0?(a=new il,i.set(n,[a])):s>=o.length?(a=new il,o.push(a)):a=o[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Eg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new ae};break;case"SpotLight":e={position:new U,direction:new U,color:new ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new ae,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new ae,groundColor:new ae};break;case"RectAreaLight":e={color:new ae,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function Tg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Ag=0;function Cg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Rg(i){const t=new Eg,e=Tg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const s=new U,o=new Te,a=new Te;function r(l){let h=0,u=0,d=0;for(let y=0;y<9;y++)n.probe[y].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,T=0,w=0,M=0,I=0,E=0,A=0;l.sort(Cg);for(let y=0,v=l.length;y<v;y++){const D=l[y],F=D.color,z=D.intensity,q=D.distance,Y=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=F.r*z,u+=F.g*z,d+=F.b*z;else if(D.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(D.sh.coefficients[Z],z);A++}else if(D.isDirectionalLight){const Z=t.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const et=D.shadow,j=e.get(D);j.shadowIntensity=et.intensity,j.shadowBias=et.bias,j.shadowNormalBias=et.normalBias,j.shadowRadius=et.radius,j.shadowMapSize=et.mapSize,n.directionalShadow[f]=j,n.directionalShadowMap[f]=Y,n.directionalShadowMatrix[f]=D.shadow.matrix,T++}n.directional[f]=Z,f++}else if(D.isSpotLight){const Z=t.get(D);Z.position.setFromMatrixPosition(D.matrixWorld),Z.color.copy(F).multiplyScalar(z),Z.distance=q,Z.coneCos=Math.cos(D.angle),Z.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Z.decay=D.decay,n.spot[_]=Z;const et=D.shadow;if(D.map&&(n.spotLightMap[I]=D.map,I++,et.updateMatrices(D),D.castShadow&&E++),n.spotLightMatrix[_]=et.matrix,D.castShadow){const j=e.get(D);j.shadowIntensity=et.intensity,j.shadowBias=et.bias,j.shadowNormalBias=et.normalBias,j.shadowRadius=et.radius,j.shadowMapSize=et.mapSize,n.spotShadow[_]=j,n.spotShadowMap[_]=Y,M++}_++}else if(D.isRectAreaLight){const Z=t.get(D);Z.color.copy(F).multiplyScalar(z),Z.halfWidth.set(D.width*.5,0,0),Z.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=Z,m++}else if(D.isPointLight){const Z=t.get(D);if(Z.color.copy(D.color).multiplyScalar(D.intensity),Z.distance=D.distance,Z.decay=D.decay,D.castShadow){const et=D.shadow,j=e.get(D);j.shadowIntensity=et.intensity,j.shadowBias=et.bias,j.shadowNormalBias=et.normalBias,j.shadowRadius=et.radius,j.shadowMapSize=et.mapSize,j.shadowCameraNear=et.camera.near,j.shadowCameraFar=et.camera.far,n.pointShadow[g]=j,n.pointShadowMap[g]=Y,n.pointShadowMatrix[g]=D.shadow.matrix,w++}n.point[g]=Z,g++}else if(D.isHemisphereLight){const Z=t.get(D);Z.skyColor.copy(D.color).multiplyScalar(z),Z.groundColor.copy(D.groundColor).multiplyScalar(z),n.hemi[p]=Z,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==T||C.numPointShadows!==w||C.numSpotShadows!==M||C.numSpotMaps!==I||C.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=w,n.pointShadowMap.length=w,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=w,n.spotLightMatrix.length=M+I-E,n.spotLightMap.length=I,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=A,C.directionalLength=f,C.pointLength=g,C.spotLength=_,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=T,C.numPointShadows=w,C.numSpotShadows=M,C.numSpotMaps=I,C.numLightProbes=A,n.version=Ag++)}function c(l,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,T=l.length;p<T;p++){const w=l[p];if(w.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(w.isSpotLight){const M=n.spot[f];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(w.matrixWorld),s.setFromMatrixPosition(w.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),f++}else if(w.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),a.identity(),o.copy(w.matrixWorld),o.premultiply(m),a.extractRotation(o),M.halfWidth.set(w.width*.5,0,0),M.halfHeight.set(0,w.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),g++}else if(w.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(w.matrixWorld),M.position.applyMatrix4(m),d++}else if(w.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(w.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:r,setupView:c,state:n}}function sl(i){const t=new Rg(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function o(h){e.push(h)}function a(h){n.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:r,setupLightsView:c,pushLight:o,pushShadow:a}}function Pg(i){let t=new WeakMap;function e(s,o=0){const a=t.get(s);let r;return a===void 0?(r=new sl(i),t.set(s,[r])):o>=a.length?(r=new sl(i),a.push(r)):r=a[o],r}function n(){t=new WeakMap}return{get:e,dispose:n}}const Ig=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Lg=`uniform sampler2D shadow_pass;
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
}`;function Dg(i,t,e){let n=new Vr;const s=new bt,o=new bt,a=new Re,r=new nf({depthPacking:xu}),c=new sf,l={},h=e.maxTextureSize,u={[kn]:Ye,[Ye]:kn,[mn]:mn},d=new Qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new bt},radius:{value:4}},vertexShader:Ig,fragmentShader:Lg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ne;g.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new x(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Dl;let p=this.type;this.render=function(E,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const y=i.getRenderTarget(),v=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Kn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=p!==Ln&&this.type===Ln,q=p===Ln&&this.type!==Ln;for(let Y=0,Z=E.length;Y<Z;Y++){const et=E[Y],j=et.shadow;if(j===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(j.autoUpdate===!1&&j.needsUpdate===!1)continue;s.copy(j.mapSize);const nt=j.getFrameExtents();if(s.multiply(nt),o.copy(j.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/nt.x),s.x=o.x*nt.x,j.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/nt.y),s.y=o.y*nt.y,j.mapSize.y=o.y)),j.map===null||z===!0||q===!0){const vt=this.type!==Ln?{minFilter:Ge,magFilter:Ge}:{};j.map!==null&&j.map.dispose(),j.map=new vi(s.x,s.y,vt),j.map.texture.name=et.name+".shadowMap",j.camera.updateProjectionMatrix()}i.setRenderTarget(j.map),i.clear();const X=j.getViewportCount();for(let vt=0;vt<X;vt++){const Wt=j.getViewport(vt);a.set(o.x*Wt.x,o.y*Wt.y,o.x*Wt.z,o.y*Wt.w),F.viewport(a),j.updateMatrices(et,vt),n=j.getFrustum(),M(A,C,j.camera,et,this.type)}j.isPointLightShadow!==!0&&this.type===Ln&&T(j,C),j.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(y,v,D)};function T(E,A){const C=t.update(_);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new vi(s.x,s.y)),d.uniforms.shadow_pass.value=E.map.texture,d.uniforms.resolution.value=E.mapSize,d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(A,null,C,d,_,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value=E.mapSize,f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(A,null,C,f,_,null)}function w(E,A,C,y){let v=null;const D=C.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)v=D;else if(v=C.isPointLight===!0?c:r,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const F=v.uuid,z=A.uuid;let q=l[F];q===void 0&&(q={},l[F]=q);let Y=q[z];Y===void 0&&(Y=v.clone(),q[z]=Y,A.addEventListener("dispose",I)),v=Y}if(v.visible=A.visible,v.wireframe=A.wireframe,y===Ln?v.side=A.shadowSide!==null?A.shadowSide:A.side:v.side=A.shadowSide!==null?A.shadowSide:u[A.side],v.alphaMap=A.alphaMap,v.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,v.map=A.map,v.clipShadows=A.clipShadows,v.clippingPlanes=A.clippingPlanes,v.clipIntersection=A.clipIntersection,v.displacementMap=A.displacementMap,v.displacementScale=A.displacementScale,v.displacementBias=A.displacementBias,v.wireframeLinewidth=A.wireframeLinewidth,v.linewidth=A.linewidth,C.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const F=i.properties.get(v);F.light=C}return v}function M(E,A,C,y,v){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&v===Ln)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,E.matrixWorld);const z=t.update(E),q=E.material;if(Array.isArray(q)){const Y=z.groups;for(let Z=0,et=Y.length;Z<et;Z++){const j=Y[Z],nt=q[j.materialIndex];if(nt&&nt.visible){const X=w(E,nt,y,v);E.onBeforeShadow(i,E,A,C,z,X,j),i.renderBufferDirect(C,null,z,X,E,j),E.onAfterShadow(i,E,A,C,z,X,j)}}}else if(q.visible){const Y=w(E,q,y,v);E.onBeforeShadow(i,E,A,C,z,Y,null),i.renderBufferDirect(C,null,z,Y,E,null),E.onAfterShadow(i,E,A,C,z,Y,null)}}const F=E.children;for(let z=0,q=F.length;z<q;z++)M(F[z],A,C,y,v)}function I(E){E.target.removeEventListener("dispose",I);for(const C in l){const y=l[C],v=E.target.uuid;v in y&&(y[v].dispose(),delete y[v])}}}const Ug={[ba]:wa,[Ea]:Ca,[Ta]:Ra,[Vi]:Aa,[wa]:ba,[Ca]:Ea,[Ra]:Ta,[Aa]:Vi};function Ng(i,t){function e(){let B=!1;const gt=new Re;let Mt=null;const wt=new Re(0,0,0,0);return{setMask:function(ft){Mt!==ft&&!B&&(i.colorMask(ft,ft,ft,ft),Mt=ft)},setLocked:function(ft){B=ft},setClear:function(ft,at,Lt,Jt,ge){ge===!0&&(ft*=Jt,at*=Jt,Lt*=Jt),gt.set(ft,at,Lt,Jt),wt.equals(gt)===!1&&(i.clearColor(ft,at,Lt,Jt),wt.copy(gt))},reset:function(){B=!1,Mt=null,wt.set(-1,0,0,0)}}}function n(){let B=!1,gt=!1,Mt=null,wt=null,ft=null;return{setReversed:function(at){if(gt!==at){const Lt=t.get("EXT_clip_control");at?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),gt=at;const Jt=ft;ft=null,this.setClear(Jt)}},getReversed:function(){return gt},setTest:function(at){at?ht(i.DEPTH_TEST):Rt(i.DEPTH_TEST)},setMask:function(at){Mt!==at&&!B&&(i.depthMask(at),Mt=at)},setFunc:function(at){if(gt&&(at=Ug[at]),wt!==at){switch(at){case ba:i.depthFunc(i.NEVER);break;case wa:i.depthFunc(i.ALWAYS);break;case Ea:i.depthFunc(i.LESS);break;case Vi:i.depthFunc(i.LEQUAL);break;case Ta:i.depthFunc(i.EQUAL);break;case Aa:i.depthFunc(i.GEQUAL);break;case Ca:i.depthFunc(i.GREATER);break;case Ra:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}wt=at}},setLocked:function(at){B=at},setClear:function(at){ft!==at&&(gt&&(at=1-at),i.clearDepth(at),ft=at)},reset:function(){B=!1,Mt=null,wt=null,ft=null,gt=!1}}}function s(){let B=!1,gt=null,Mt=null,wt=null,ft=null,at=null,Lt=null,Jt=null,ge=null;return{setTest:function(ie){B||(ie?ht(i.STENCIL_TEST):Rt(i.STENCIL_TEST))},setMask:function(ie){gt!==ie&&!B&&(i.stencilMask(ie),gt=ie)},setFunc:function(ie,je,qe){(Mt!==ie||wt!==je||ft!==qe)&&(i.stencilFunc(ie,je,qe),Mt=ie,wt=je,ft=qe)},setOp:function(ie,je,qe){(at!==ie||Lt!==je||Jt!==qe)&&(i.stencilOp(ie,je,qe),at=ie,Lt=je,Jt=qe)},setLocked:function(ie){B=ie},setClear:function(ie){ge!==ie&&(i.clearStencil(ie),ge=ie)},reset:function(){B=!1,gt=null,Mt=null,wt=null,ft=null,at=null,Lt=null,Jt=null,ge=null}}}const o=new e,a=new n,r=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,T=null,w=null,M=null,I=null,E=null,A=new ae(0,0,0),C=0,y=!1,v=null,D=null,F=null,z=null,q=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,et=0;const j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(j)[1]),Z=et>=1):j.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),Z=et>=2);let nt=null,X={};const vt=i.getParameter(i.SCISSOR_BOX),Wt=i.getParameter(i.VIEWPORT),te=new Re().fromArray(vt),le=new Re().fromArray(Wt);function se(B,gt,Mt,wt){const ft=new Uint8Array(4),at=i.createTexture();i.bindTexture(B,at),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Lt=0;Lt<Mt;Lt++)B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY?i.texImage3D(gt,0,i.RGBA,1,1,wt,0,i.RGBA,i.UNSIGNED_BYTE,ft):i.texImage2D(gt+Lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ft);return at}const st={};st[i.TEXTURE_2D]=se(i.TEXTURE_2D,i.TEXTURE_2D,1),st[i.TEXTURE_CUBE_MAP]=se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),st[i.TEXTURE_2D_ARRAY]=se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),st[i.TEXTURE_3D]=se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),o.setClear(0,0,0,1),a.setClear(1),r.setClear(0),ht(i.DEPTH_TEST),a.setFunc(Vi),ot(!1),J($r),ht(i.CULL_FACE),ut(Kn);function ht(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function Rt(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Bt(B,gt){return u[B]!==gt?(i.bindFramebuffer(B,gt),u[B]=gt,B===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=gt),B===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=gt),!0):!1}function Dt(B,gt){let Mt=f,wt=!1;if(B){Mt=d.get(gt),Mt===void 0&&(Mt=[],d.set(gt,Mt));const ft=B.textures;if(Mt.length!==ft.length||Mt[0]!==i.COLOR_ATTACHMENT0){for(let at=0,Lt=ft.length;at<Lt;at++)Mt[at]=i.COLOR_ATTACHMENT0+at;Mt.length=ft.length,wt=!0}}else Mt[0]!==i.BACK&&(Mt[0]=i.BACK,wt=!0);wt&&i.drawBuffers(Mt)}function ee(B){return g!==B?(i.useProgram(B),g=B,!0):!1}const me={[ui]:i.FUNC_ADD,[qh]:i.FUNC_SUBTRACT,[Xh]:i.FUNC_REVERSE_SUBTRACT};me[Yh]=i.MIN,me[jh]=i.MAX;const N={[Jh]:i.ZERO,[Zh]:i.ONE,[Kh]:i.SRC_COLOR,[ya]:i.SRC_ALPHA,[iu]:i.SRC_ALPHA_SATURATE,[eu]:i.DST_COLOR,[Qh]:i.DST_ALPHA,[$h]:i.ONE_MINUS_SRC_COLOR,[Sa]:i.ONE_MINUS_SRC_ALPHA,[nu]:i.ONE_MINUS_DST_COLOR,[tu]:i.ONE_MINUS_DST_ALPHA,[su]:i.CONSTANT_COLOR,[ou]:i.ONE_MINUS_CONSTANT_COLOR,[au]:i.CONSTANT_ALPHA,[ru]:i.ONE_MINUS_CONSTANT_ALPHA};function ut(B,gt,Mt,wt,ft,at,Lt,Jt,ge,ie){if(B===Kn){_===!0&&(Rt(i.BLEND),_=!1);return}if(_===!1&&(ht(i.BLEND),_=!0),B!==Wh){if(B!==m||ie!==y){if((p!==ui||M!==ui)&&(i.blendEquation(i.FUNC_ADD),p=ui,M=ui),ie)switch(B){case ki:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qr:i.blendFunc(i.ONE,i.ONE);break;case tc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ec:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case ki:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Qr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case tc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ec:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}T=null,w=null,I=null,E=null,A.set(0,0,0),C=0,m=B,y=ie}return}ft=ft||gt,at=at||Mt,Lt=Lt||wt,(gt!==p||ft!==M)&&(i.blendEquationSeparate(me[gt],me[ft]),p=gt,M=ft),(Mt!==T||wt!==w||at!==I||Lt!==E)&&(i.blendFuncSeparate(N[Mt],N[wt],N[at],N[Lt]),T=Mt,w=wt,I=at,E=Lt),(Jt.equals(A)===!1||ge!==C)&&(i.blendColor(Jt.r,Jt.g,Jt.b,ge),A.copy(Jt),C=ge),m=B,y=!1}function rt(B,gt){B.side===mn?Rt(i.CULL_FACE):ht(i.CULL_FACE);let Mt=B.side===Ye;gt&&(Mt=!Mt),ot(Mt),B.blending===ki&&B.transparent===!1?ut(Kn):ut(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),a.setFunc(B.depthFunc),a.setTest(B.depthTest),a.setMask(B.depthWrite),o.setMask(B.colorWrite);const wt=B.stencilWrite;r.setTest(wt),wt&&(r.setMask(B.stencilWriteMask),r.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),r.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),pt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?ht(i.SAMPLE_ALPHA_TO_COVERAGE):Rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function ot(B){v!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),v=B)}function J(B){B!==Vh?(ht(i.CULL_FACE),B!==D&&(B===$r?i.cullFace(i.BACK):B===Gh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Rt(i.CULL_FACE),D=B}function yt(B){B!==F&&(Z&&i.lineWidth(B),F=B)}function pt(B,gt,Mt){B?(ht(i.POLYGON_OFFSET_FILL),(z!==gt||q!==Mt)&&(i.polygonOffset(gt,Mt),z=gt,q=Mt)):Rt(i.POLYGON_OFFSET_FILL)}function St(B){B?ht(i.SCISSOR_TEST):Rt(i.SCISSOR_TEST)}function kt(B){B===void 0&&(B=i.TEXTURE0+Y-1),nt!==B&&(i.activeTexture(B),nt=B)}function Yt(B,gt,Mt){Mt===void 0&&(nt===null?Mt=i.TEXTURE0+Y-1:Mt=nt);let wt=X[Mt];wt===void 0&&(wt={type:void 0,texture:void 0},X[Mt]=wt),(wt.type!==B||wt.texture!==gt)&&(nt!==Mt&&(i.activeTexture(Mt),nt=Mt),i.bindTexture(B,gt||st[B]),wt.type=B,wt.texture=gt)}function L(){const B=X[nt];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function b(){try{i.compressedTexImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function H(){try{i.compressedTexImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function tt(){try{i.texSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function lt(){try{i.texSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function $(){try{i.compressedTexSubImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function It(){try{i.compressedTexSubImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function _t(){try{i.texStorage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ut(){try{i.texStorage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Nt(){try{i.texImage2D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function mt(){try{i.texImage3D(...arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function At(B){te.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),te.copy(B))}function Vt(B){le.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),le.copy(B))}function Ot(B,gt){let Mt=l.get(gt);Mt===void 0&&(Mt=new WeakMap,l.set(gt,Mt));let wt=Mt.get(B);wt===void 0&&(wt=i.getUniformBlockIndex(gt,B.name),Mt.set(B,wt))}function Et(B,gt){const wt=l.get(gt).get(B);c.get(gt)!==wt&&(i.uniformBlockBinding(gt,wt,B.__bindingPointIndex),c.set(gt,wt))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},nt=null,X={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,T=null,w=null,M=null,I=null,E=null,A=new ae(0,0,0),C=0,y=!1,v=null,D=null,F=null,z=null,q=null,te.set(0,0,i.canvas.width,i.canvas.height),le.set(0,0,i.canvas.width,i.canvas.height),o.reset(),a.reset(),r.reset()}return{buffers:{color:o,depth:a,stencil:r},enable:ht,disable:Rt,bindFramebuffer:Bt,drawBuffers:Dt,useProgram:ee,setBlending:ut,setMaterial:rt,setFlipSided:ot,setCullFace:J,setLineWidth:yt,setPolygonOffset:pt,setScissorTest:St,activeTexture:kt,bindTexture:Yt,unbindTexture:L,compressedTexImage2D:b,compressedTexImage3D:H,texImage2D:Nt,texImage3D:mt,updateUBOMapping:Ot,uniformBlockBinding:Et,texStorage2D:_t,texStorage3D:Ut,texSubImage2D:tt,texSubImage3D:lt,compressedTexSubImage2D:$,compressedTexSubImage3D:It,scissor:At,viewport:Vt,reset:Zt}}function Fg(i,t,e,n,s,o,a){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new bt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,b){return f?new OffscreenCanvas(L,b):Mo("canvas")}function _(L,b,H){let tt=1;const lt=Yt(L);if((lt.width>H||lt.height>H)&&(tt=H/Math.max(lt.width,lt.height)),tt<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){const $=Math.floor(tt*lt.width),It=Math.floor(tt*lt.height);u===void 0&&(u=g($,It));const _t=b?g($,It):u;return _t.width=$,_t.height=It,_t.getContext("2d").drawImage(L,0,0,$,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+lt.width+"x"+lt.height+") to ("+$+"x"+It+")."),_t}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+lt.width+"x"+lt.height+")."),L;return L}function m(L){return L.generateMipmaps}function p(L){i.generateMipmap(L)}function T(L){return L.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:L.isWebGL3DRenderTarget?i.TEXTURE_3D:L.isWebGLArrayRenderTarget||L.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function w(L,b,H,tt,lt=!1){if(L!==null){if(i[L]!==void 0)return i[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let $=b;if(b===i.RED&&(H===i.FLOAT&&($=i.R32F),H===i.HALF_FLOAT&&($=i.R16F),H===i.UNSIGNED_BYTE&&($=i.R8)),b===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.R8UI),H===i.UNSIGNED_SHORT&&($=i.R16UI),H===i.UNSIGNED_INT&&($=i.R32UI),H===i.BYTE&&($=i.R8I),H===i.SHORT&&($=i.R16I),H===i.INT&&($=i.R32I)),b===i.RG&&(H===i.FLOAT&&($=i.RG32F),H===i.HALF_FLOAT&&($=i.RG16F),H===i.UNSIGNED_BYTE&&($=i.RG8)),b===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RG8UI),H===i.UNSIGNED_SHORT&&($=i.RG16UI),H===i.UNSIGNED_INT&&($=i.RG32UI),H===i.BYTE&&($=i.RG8I),H===i.SHORT&&($=i.RG16I),H===i.INT&&($=i.RG32I)),b===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGB8UI),H===i.UNSIGNED_SHORT&&($=i.RGB16UI),H===i.UNSIGNED_INT&&($=i.RGB32UI),H===i.BYTE&&($=i.RGB8I),H===i.SHORT&&($=i.RGB16I),H===i.INT&&($=i.RGB32I)),b===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&($=i.RGBA8UI),H===i.UNSIGNED_SHORT&&($=i.RGBA16UI),H===i.UNSIGNED_INT&&($=i.RGBA32UI),H===i.BYTE&&($=i.RGBA8I),H===i.SHORT&&($=i.RGBA16I),H===i.INT&&($=i.RGBA32I)),b===i.RGB&&(H===i.UNSIGNED_INT_5_9_9_9_REV&&($=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&($=i.R11F_G11F_B10F)),b===i.RGBA){const It=lt?_o:fe.getTransfer(tt);H===i.FLOAT&&($=i.RGBA32F),H===i.HALF_FLOAT&&($=i.RGBA16F),H===i.UNSIGNED_BYTE&&($=It===_e?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&($=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&($=i.RGB5_A1)}return($===i.R16F||$===i.R32F||$===i.RG16F||$===i.RG32F||$===i.RGBA16F||$===i.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function M(L,b){let H;return L?b===null||b===gi||b===_s?H=i.DEPTH24_STENCIL8:b===Nn?H=i.DEPTH32F_STENCIL8:b===vs&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===gi||b===_s?H=i.DEPTH_COMPONENT24:b===Nn?H=i.DEPTH_COMPONENT32F:b===vs&&(H=i.DEPTH_COMPONENT16),H}function I(L,b){return m(L)===!0||L.isFramebufferTexture&&L.minFilter!==Ge&&L.minFilter!==yn?Math.log2(Math.max(b.width,b.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?b.mipmaps.length:1}function E(L){const b=L.target;b.removeEventListener("dispose",E),C(b),b.isVideoTexture&&h.delete(b)}function A(L){const b=L.target;b.removeEventListener("dispose",A),v(b)}function C(L){const b=n.get(L);if(b.__webglInit===void 0)return;const H=L.source,tt=d.get(H);if(tt){const lt=tt[b.__cacheKey];lt.usedTimes--,lt.usedTimes===0&&y(L),Object.keys(tt).length===0&&d.delete(H)}n.remove(L)}function y(L){const b=n.get(L);i.deleteTexture(b.__webglTexture);const H=L.source,tt=d.get(H);delete tt[b.__cacheKey],a.memory.textures--}function v(L){const b=n.get(L);if(L.depthTexture&&(L.depthTexture.dispose(),n.remove(L.depthTexture)),L.isWebGLCubeRenderTarget)for(let tt=0;tt<6;tt++){if(Array.isArray(b.__webglFramebuffer[tt]))for(let lt=0;lt<b.__webglFramebuffer[tt].length;lt++)i.deleteFramebuffer(b.__webglFramebuffer[tt][lt]);else i.deleteFramebuffer(b.__webglFramebuffer[tt]);b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer[tt])}else{if(Array.isArray(b.__webglFramebuffer))for(let tt=0;tt<b.__webglFramebuffer.length;tt++)i.deleteFramebuffer(b.__webglFramebuffer[tt]);else i.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&i.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&i.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let tt=0;tt<b.__webglColorRenderbuffer.length;tt++)b.__webglColorRenderbuffer[tt]&&i.deleteRenderbuffer(b.__webglColorRenderbuffer[tt]);b.__webglDepthRenderbuffer&&i.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const H=L.textures;for(let tt=0,lt=H.length;tt<lt;tt++){const $=n.get(H[tt]);$.__webglTexture&&(i.deleteTexture($.__webglTexture),a.memory.textures--),n.remove(H[tt])}n.remove(L)}let D=0;function F(){D=0}function z(){const L=D;return L>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+s.maxTextures),D+=1,L}function q(L){const b=[];return b.push(L.wrapS),b.push(L.wrapT),b.push(L.wrapR||0),b.push(L.magFilter),b.push(L.minFilter),b.push(L.anisotropy),b.push(L.internalFormat),b.push(L.format),b.push(L.type),b.push(L.generateMipmaps),b.push(L.premultiplyAlpha),b.push(L.flipY),b.push(L.unpackAlignment),b.push(L.colorSpace),b.join()}function Y(L,b){const H=n.get(L);if(L.isVideoTexture&&St(L),L.isRenderTargetTexture===!1&&L.isExternalTexture!==!0&&L.version>0&&H.__version!==L.version){const tt=L.image;if(tt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(tt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{st(H,L,b);return}}else L.isExternalTexture&&(H.__webglTexture=L.sourceTexture?L.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+b)}function Z(L,b){const H=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){st(H,L,b);return}e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+b)}function et(L,b){const H=n.get(L);if(L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){st(H,L,b);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+b)}function j(L,b){const H=n.get(L);if(L.version>0&&H.__version!==L.version){ht(H,L,b);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+b)}const nt={[La]:i.REPEAT,[fi]:i.CLAMP_TO_EDGE,[Da]:i.MIRRORED_REPEAT},X={[Ge]:i.NEAREST,[vu]:i.NEAREST_MIPMAP_NEAREST,[Ls]:i.NEAREST_MIPMAP_LINEAR,[yn]:i.LINEAR,[Do]:i.LINEAR_MIPMAP_NEAREST,[pi]:i.LINEAR_MIPMAP_LINEAR},vt={[yu]:i.NEVER,[Au]:i.ALWAYS,[Su]:i.LESS,[ql]:i.LEQUAL,[bu]:i.EQUAL,[Tu]:i.GEQUAL,[wu]:i.GREATER,[Eu]:i.NOTEQUAL};function Wt(L,b){if(b.type===Nn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===yn||b.magFilter===Do||b.magFilter===Ls||b.magFilter===pi||b.minFilter===yn||b.minFilter===Do||b.minFilter===Ls||b.minFilter===pi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(L,i.TEXTURE_WRAP_S,nt[b.wrapS]),i.texParameteri(L,i.TEXTURE_WRAP_T,nt[b.wrapT]),(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)&&i.texParameteri(L,i.TEXTURE_WRAP_R,nt[b.wrapR]),i.texParameteri(L,i.TEXTURE_MAG_FILTER,X[b.magFilter]),i.texParameteri(L,i.TEXTURE_MIN_FILTER,X[b.minFilter]),b.compareFunction&&(i.texParameteri(L,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(L,i.TEXTURE_COMPARE_FUNC,vt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Ge||b.minFilter!==Ls&&b.minFilter!==pi||b.type===Nn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(L,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,s.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function te(L,b){let H=!1;L.__webglInit===void 0&&(L.__webglInit=!0,b.addEventListener("dispose",E));const tt=b.source;let lt=d.get(tt);lt===void 0&&(lt={},d.set(tt,lt));const $=q(b);if($!==L.__cacheKey){lt[$]===void 0&&(lt[$]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,H=!0),lt[$].usedTimes++;const It=lt[L.__cacheKey];It!==void 0&&(lt[L.__cacheKey].usedTimes--,It.usedTimes===0&&y(b)),L.__cacheKey=$,L.__webglTexture=lt[$].texture}return H}function le(L,b,H){return Math.floor(Math.floor(L/H)/b)}function se(L,b,H,tt){const $=L.updateRanges;if($.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,b.width,b.height,H,tt,b.data);else{$.sort((mt,At)=>mt.start-At.start);let It=0;for(let mt=1;mt<$.length;mt++){const At=$[It],Vt=$[mt],Ot=At.start+At.count,Et=le(Vt.start,b.width,4),Zt=le(At.start,b.width,4);Vt.start<=Ot+1&&Et===Zt&&le(Vt.start+Vt.count-1,b.width,4)===Et?At.count=Math.max(At.count,Vt.start+Vt.count-At.start):(++It,$[It]=Vt)}$.length=It+1;const _t=i.getParameter(i.UNPACK_ROW_LENGTH),Ut=i.getParameter(i.UNPACK_SKIP_PIXELS),Nt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,b.width);for(let mt=0,At=$.length;mt<At;mt++){const Vt=$[mt],Ot=Math.floor(Vt.start/4),Et=Math.ceil(Vt.count/4),Zt=Ot%b.width,B=Math.floor(Ot/b.width),gt=Et,Mt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Zt),i.pixelStorei(i.UNPACK_SKIP_ROWS,B),e.texSubImage2D(i.TEXTURE_2D,0,Zt,B,gt,Mt,H,tt,b.data)}L.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,_t),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ut),i.pixelStorei(i.UNPACK_SKIP_ROWS,Nt)}}function st(L,b,H){let tt=i.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(tt=i.TEXTURE_2D_ARRAY),b.isData3DTexture&&(tt=i.TEXTURE_3D);const lt=te(L,b),$=b.source;e.bindTexture(tt,L.__webglTexture,i.TEXTURE0+H);const It=n.get($);if($.version!==It.__version||lt===!0){e.activeTexture(i.TEXTURE0+H);const _t=fe.getPrimaries(fe.workingColorSpace),Ut=b.colorSpace===Jn?null:fe.getPrimaries(b.colorSpace),Nt=b.colorSpace===Jn||_t===Ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let mt=_(b.image,!1,s.maxTextureSize);mt=kt(b,mt);const At=o.convert(b.format,b.colorSpace),Vt=o.convert(b.type);let Ot=w(b.internalFormat,At,Vt,b.colorSpace,b.isVideoTexture);Wt(tt,b);let Et;const Zt=b.mipmaps,B=b.isVideoTexture!==!0,gt=It.__version===void 0||lt===!0,Mt=$.dataReady,wt=I(b,mt);if(b.isDepthTexture)Ot=M(b.format===Ms,b.type),gt&&(B?e.texStorage2D(i.TEXTURE_2D,1,Ot,mt.width,mt.height):e.texImage2D(i.TEXTURE_2D,0,Ot,mt.width,mt.height,0,At,Vt,null));else if(b.isDataTexture)if(Zt.length>0){B&&gt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,Zt[0].width,Zt[0].height);for(let ft=0,at=Zt.length;ft<at;ft++)Et=Zt[ft],B?Mt&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,Et.width,Et.height,At,Vt,Et.data):e.texImage2D(i.TEXTURE_2D,ft,Ot,Et.width,Et.height,0,At,Vt,Et.data);b.generateMipmaps=!1}else B?(gt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,mt.width,mt.height),Mt&&se(b,mt,At,Vt)):e.texImage2D(i.TEXTURE_2D,0,Ot,mt.width,mt.height,0,At,Vt,mt.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){B&&gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Ot,Zt[0].width,Zt[0].height,mt.depth);for(let ft=0,at=Zt.length;ft<at;ft++)if(Et=Zt[ft],b.format!==_n)if(At!==null)if(B){if(Mt)if(b.layerUpdates.size>0){const Lt=Uc(Et.width,Et.height,b.format,b.type);for(const Jt of b.layerUpdates){const ge=Et.data.subarray(Jt*Lt/Et.data.BYTES_PER_ELEMENT,(Jt+1)*Lt/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,Jt,Et.width,Et.height,1,At,ge)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,Et.width,Et.height,mt.depth,At,Et.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ft,Ot,Et.width,Et.height,mt.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else B?Mt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ft,0,0,0,Et.width,Et.height,mt.depth,At,Vt,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ft,Ot,Et.width,Et.height,mt.depth,0,At,Vt,Et.data)}else{B&&gt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,Zt[0].width,Zt[0].height);for(let ft=0,at=Zt.length;ft<at;ft++)Et=Zt[ft],b.format!==_n?At!==null?B?Mt&&e.compressedTexSubImage2D(i.TEXTURE_2D,ft,0,0,Et.width,Et.height,At,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,ft,Ot,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):B?Mt&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,Et.width,Et.height,At,Vt,Et.data):e.texImage2D(i.TEXTURE_2D,ft,Ot,Et.width,Et.height,0,At,Vt,Et.data)}else if(b.isDataArrayTexture)if(B){if(gt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Ot,mt.width,mt.height,mt.depth),Mt)if(b.layerUpdates.size>0){const ft=Uc(mt.width,mt.height,b.format,b.type);for(const at of b.layerUpdates){const Lt=mt.data.subarray(at*ft/mt.data.BYTES_PER_ELEMENT,(at+1)*ft/mt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,at,mt.width,mt.height,1,At,Vt,Lt)}b.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,mt.width,mt.height,mt.depth,At,Vt,mt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,mt.width,mt.height,mt.depth,0,At,Vt,mt.data);else if(b.isData3DTexture)B?(gt&&e.texStorage3D(i.TEXTURE_3D,wt,Ot,mt.width,mt.height,mt.depth),Mt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,mt.width,mt.height,mt.depth,At,Vt,mt.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,mt.width,mt.height,mt.depth,0,At,Vt,mt.data);else if(b.isFramebufferTexture){if(gt)if(B)e.texStorage2D(i.TEXTURE_2D,wt,Ot,mt.width,mt.height);else{let ft=mt.width,at=mt.height;for(let Lt=0;Lt<wt;Lt++)e.texImage2D(i.TEXTURE_2D,Lt,Ot,ft,at,0,At,Vt,null),ft>>=1,at>>=1}}else if(Zt.length>0){if(B&&gt){const ft=Yt(Zt[0]);e.texStorage2D(i.TEXTURE_2D,wt,Ot,ft.width,ft.height)}for(let ft=0,at=Zt.length;ft<at;ft++)Et=Zt[ft],B?Mt&&e.texSubImage2D(i.TEXTURE_2D,ft,0,0,At,Vt,Et):e.texImage2D(i.TEXTURE_2D,ft,Ot,At,Vt,Et);b.generateMipmaps=!1}else if(B){if(gt){const ft=Yt(mt);e.texStorage2D(i.TEXTURE_2D,wt,Ot,ft.width,ft.height)}Mt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Vt,mt)}else e.texImage2D(i.TEXTURE_2D,0,Ot,At,Vt,mt);m(b)&&p(tt),It.__version=$.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function ht(L,b,H){if(b.image.length!==6)return;const tt=te(L,b),lt=b.source;e.bindTexture(i.TEXTURE_CUBE_MAP,L.__webglTexture,i.TEXTURE0+H);const $=n.get(lt);if(lt.version!==$.__version||tt===!0){e.activeTexture(i.TEXTURE0+H);const It=fe.getPrimaries(fe.workingColorSpace),_t=b.colorSpace===Jn?null:fe.getPrimaries(b.colorSpace),Ut=b.colorSpace===Jn||It===_t?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,b.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,b.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);const Nt=b.isCompressedTexture||b.image[0].isCompressedTexture,mt=b.image[0]&&b.image[0].isDataTexture,At=[];for(let at=0;at<6;at++)!Nt&&!mt?At[at]=_(b.image[at],!0,s.maxCubemapSize):At[at]=mt?b.image[at].image:b.image[at],At[at]=kt(b,At[at]);const Vt=At[0],Ot=o.convert(b.format,b.colorSpace),Et=o.convert(b.type),Zt=w(b.internalFormat,Ot,Et,b.colorSpace),B=b.isVideoTexture!==!0,gt=$.__version===void 0||tt===!0,Mt=lt.dataReady;let wt=I(b,Vt);Wt(i.TEXTURE_CUBE_MAP,b);let ft;if(Nt){B&&gt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Zt,Vt.width,Vt.height);for(let at=0;at<6;at++){ft=At[at].mipmaps;for(let Lt=0;Lt<ft.length;Lt++){const Jt=ft[Lt];b.format!==_n?Ot!==null?B?Mt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt,0,0,Jt.width,Jt.height,Ot,Jt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt,Zt,Jt.width,Jt.height,0,Jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt,0,0,Jt.width,Jt.height,Ot,Et,Jt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt,Zt,Jt.width,Jt.height,0,Ot,Et,Jt.data)}}}else{if(ft=b.mipmaps,B&&gt){ft.length>0&&wt++;const at=Yt(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Zt,at.width,at.height)}for(let at=0;at<6;at++)if(mt){B?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,At[at].width,At[at].height,Ot,Et,At[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Zt,At[at].width,At[at].height,0,Ot,Et,At[at].data);for(let Lt=0;Lt<ft.length;Lt++){const ge=ft[Lt].image[at].image;B?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt+1,0,0,ge.width,ge.height,Ot,Et,ge.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt+1,Zt,ge.width,ge.height,0,Ot,Et,ge.data)}}else{B?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ot,Et,At[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,Zt,Ot,Et,At[at]);for(let Lt=0;Lt<ft.length;Lt++){const Jt=ft[Lt];B?Mt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt+1,0,0,Ot,Et,Jt.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Lt+1,Zt,Ot,Et,Jt.image[at])}}}m(b)&&p(i.TEXTURE_CUBE_MAP),$.__version=lt.version,b.onUpdate&&b.onUpdate(b)}L.__version=b.version}function Rt(L,b,H,tt,lt,$){const It=o.convert(H.format,H.colorSpace),_t=o.convert(H.type),Ut=w(H.internalFormat,It,_t,H.colorSpace),Nt=n.get(b),mt=n.get(H);if(mt.__renderTarget=b,!Nt.__hasExternalTextures){const At=Math.max(1,b.width>>$),Vt=Math.max(1,b.height>>$);lt===i.TEXTURE_3D||lt===i.TEXTURE_2D_ARRAY?e.texImage3D(lt,$,Ut,At,Vt,b.depth,0,It,_t,null):e.texImage2D(lt,$,Ut,At,Vt,0,It,_t,null)}e.bindFramebuffer(i.FRAMEBUFFER,L),pt(b)?r.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,tt,lt,mt.__webglTexture,0,yt(b)):(lt===i.TEXTURE_2D||lt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&lt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,tt,lt,mt.__webglTexture,$),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(L,b,H){if(i.bindRenderbuffer(i.RENDERBUFFER,L),b.depthBuffer){const tt=b.depthTexture,lt=tt&&tt.isDepthTexture?tt.type:null,$=M(b.stencilBuffer,lt),It=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=yt(b);pt(b)?r.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_t,$,b.width,b.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,_t,$,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,$,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,It,i.RENDERBUFFER,L)}else{const tt=b.textures;for(let lt=0;lt<tt.length;lt++){const $=tt[lt],It=o.convert($.format,$.colorSpace),_t=o.convert($.type),Ut=w($.internalFormat,It,_t,$.colorSpace),Nt=yt(b);H&&pt(b)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,Ut,b.width,b.height):pt(b)?r.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt,Ut,b.width,b.height):i.renderbufferStorage(i.RENDERBUFFER,Ut,b.width,b.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(L,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,L),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const tt=n.get(b.depthTexture);tt.__renderTarget=b,(!tt.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),Y(b.depthTexture,0);const lt=tt.__webglTexture,$=yt(b);if(b.depthTexture.format===xs)pt(b)?r.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,lt,0);else if(b.depthTexture.format===Ms)pt(b)?r.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0,$):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,lt,0);else throw new Error("Unknown depthTexture format")}function ee(L){const b=n.get(L),H=L.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==L.depthTexture){const tt=L.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),tt){const lt=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,tt.removeEventListener("dispose",lt)};tt.addEventListener("dispose",lt),b.__depthDisposeCallback=lt}b.__boundDepthTexture=tt}if(L.depthTexture&&!b.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");const tt=L.texture.mipmaps;tt&&tt.length>0?Dt(b.__webglFramebuffer[0],L):Dt(b.__webglFramebuffer,L)}else if(H){b.__webglDepthbuffer=[];for(let tt=0;tt<6;tt++)if(e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[tt]),b.__webglDepthbuffer[tt]===void 0)b.__webglDepthbuffer[tt]=i.createRenderbuffer(),Bt(b.__webglDepthbuffer[tt],L,!1);else{const lt=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=b.__webglDepthbuffer[tt];i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,$)}}else{const tt=L.texture.mipmaps;if(tt&&tt.length>0?e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=i.createRenderbuffer(),Bt(b.__webglDepthbuffer,L,!1);else{const lt=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,$=b.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,$),i.framebufferRenderbuffer(i.FRAMEBUFFER,lt,i.RENDERBUFFER,$)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function me(L,b,H){const tt=n.get(L);b!==void 0&&Rt(tt.__webglFramebuffer,L,L.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&ee(L)}function N(L){const b=L.texture,H=n.get(L),tt=n.get(b);L.addEventListener("dispose",A);const lt=L.textures,$=L.isWebGLCubeRenderTarget===!0,It=lt.length>1;if(It||(tt.__webglTexture===void 0&&(tt.__webglTexture=i.createTexture()),tt.__version=b.version,a.memory.textures++),$){H.__webglFramebuffer=[];for(let _t=0;_t<6;_t++)if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer[_t]=[];for(let Ut=0;Ut<b.mipmaps.length;Ut++)H.__webglFramebuffer[_t][Ut]=i.createFramebuffer()}else H.__webglFramebuffer[_t]=i.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer=[];for(let _t=0;_t<b.mipmaps.length;_t++)H.__webglFramebuffer[_t]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(It)for(let _t=0,Ut=lt.length;_t<Ut;_t++){const Nt=n.get(lt[_t]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=i.createTexture(),a.memory.textures++)}if(L.samples>0&&pt(L)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let _t=0;_t<lt.length;_t++){const Ut=lt[_t];H.__webglColorRenderbuffer[_t]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[_t]);const Nt=o.convert(Ut.format,Ut.colorSpace),mt=o.convert(Ut.type),At=w(Ut.internalFormat,Nt,mt,Ut.colorSpace,L.isXRRenderTarget===!0),Vt=yt(L);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,At,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_t,i.RENDERBUFFER,H.__webglColorRenderbuffer[_t])}i.bindRenderbuffer(i.RENDERBUFFER,null),L.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Bt(H.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if($){e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),Wt(i.TEXTURE_CUBE_MAP,b);for(let _t=0;_t<6;_t++)if(b.mipmaps&&b.mipmaps.length>0)for(let Ut=0;Ut<b.mipmaps.length;Ut++)Rt(H.__webglFramebuffer[_t][Ut],L,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,Ut);else Rt(H.__webglFramebuffer[_t],L,b,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+_t,0);m(b)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let _t=0,Ut=lt.length;_t<Ut;_t++){const Nt=lt[_t],mt=n.get(Nt);let At=i.TEXTURE_2D;(L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(At=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(At,mt.__webglTexture),Wt(At,Nt),Rt(H.__webglFramebuffer,L,Nt,i.COLOR_ATTACHMENT0+_t,At,0),m(Nt)&&p(At)}e.unbindTexture()}else{let _t=i.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(_t=L.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(_t,tt.__webglTexture),Wt(_t,b),b.mipmaps&&b.mipmaps.length>0)for(let Ut=0;Ut<b.mipmaps.length;Ut++)Rt(H.__webglFramebuffer[Ut],L,b,i.COLOR_ATTACHMENT0,_t,Ut);else Rt(H.__webglFramebuffer,L,b,i.COLOR_ATTACHMENT0,_t,0);m(b)&&p(_t),e.unbindTexture()}L.depthBuffer&&ee(L)}function ut(L){const b=L.textures;for(let H=0,tt=b.length;H<tt;H++){const lt=b[H];if(m(lt)){const $=T(L),It=n.get(lt).__webglTexture;e.bindTexture($,It),p($),e.unbindTexture()}}}const rt=[],ot=[];function J(L){if(L.samples>0){if(pt(L)===!1){const b=L.textures,H=L.width,tt=L.height;let lt=i.COLOR_BUFFER_BIT;const $=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,It=n.get(L),_t=b.length>1;if(_t)for(let Nt=0;Nt<b.length;Nt++)e.bindFramebuffer(i.FRAMEBUFFER,It.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,It.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer);const Ut=L.texture.mipmaps;Ut&&Ut.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let Nt=0;Nt<b.length;Nt++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(lt|=i.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(lt|=i.STENCIL_BUFFER_BIT)),_t){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,It.__webglColorRenderbuffer[Nt]);const mt=n.get(b[Nt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,mt,0)}i.blitFramebuffer(0,0,H,tt,0,0,H,tt,lt,i.NEAREST),c===!0&&(rt.length=0,ot.length=0,rt.push(i.COLOR_ATTACHMENT0+Nt),L.depthBuffer&&L.resolveDepthBuffer===!1&&(rt.push($),ot.push($),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ot)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,rt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),_t)for(let Nt=0;Nt<b.length;Nt++){e.bindFramebuffer(i.FRAMEBUFFER,It.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,It.__webglColorRenderbuffer[Nt]);const mt=n.get(b[Nt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,It.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,mt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){const b=L.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[b])}}}function yt(L){return Math.min(s.maxSamples,L.samples)}function pt(L){const b=n.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function St(L){const b=a.render.frame;h.get(L)!==b&&(h.set(L,b),L.update())}function kt(L,b){const H=L.colorSpace,tt=L.format,lt=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||H!==qi&&H!==Jn&&(fe.getTransfer(H)===_e?(tt!==_n||lt!==En)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),b}function Yt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=Y,this.setTexture2DArray=Z,this.setTexture3D=et,this.setTextureCube=j,this.rebindTextures=me,this.setupRenderTarget=N,this.updateRenderTargetMipmap=ut,this.updateMultisampleRenderTarget=J,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=Rt,this.useMultisampledRTT=pt}function Og(i,t){function e(n,s=Jn){let o;const a=fe.getTransfer(s);if(n===En)return i.UNSIGNED_BYTE;if(n===Dr)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Ur)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Bl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===kl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Ol)return i.BYTE;if(n===zl)return i.SHORT;if(n===vs)return i.UNSIGNED_SHORT;if(n===Lr)return i.INT;if(n===gi)return i.UNSIGNED_INT;if(n===Nn)return i.FLOAT;if(n===Cs)return i.HALF_FLOAT;if(n===Hl)return i.ALPHA;if(n===Vl)return i.RGB;if(n===_n)return i.RGBA;if(n===xs)return i.DEPTH_COMPONENT;if(n===Ms)return i.DEPTH_STENCIL;if(n===Nr)return i.RED;if(n===Fr)return i.RED_INTEGER;if(n===Gl)return i.RG;if(n===Or)return i.RG_INTEGER;if(n===zr)return i.RGBA_INTEGER;if(n===co||n===lo||n===ho||n===uo)if(a===_e)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===co)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===lo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ho)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===uo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===co)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===lo)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ho)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===uo)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ua||n===Na||n===Fa||n===Oa)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===Ua)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Na)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Fa)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Oa)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===za||n===Ba||n===ka)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===za||n===Ba)return a===_e?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===ka)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ha||n===Va||n===Ga||n===Wa||n===qa||n===Xa||n===Ya||n===ja||n===Ja||n===Za||n===Ka||n===$a||n===Qa||n===tr)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===Ha)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Va)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ga)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Wa)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===qa)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Xa)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ya)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ja)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ja)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Za)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ka)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===$a)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Qa)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===tr)return a===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===er||n===nr||n===ir)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===er)return a===_e?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===nr)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===ir)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===sr||n===or||n===ar||n===rr)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===sr)return o.COMPRESSED_RED_RGTC1_EXT;if(n===or)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ar)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===rr)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===_s?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const zg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Bg=`
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

}`;class kg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new oh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Qn({vertexShader:zg,fragmentShader:Bg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new x(new on(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Hg extends ji{constructor(t,e){super();const n=this;let s=null,o=1,a=null,r="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new kg,p={},T=e.getContextAttributes();let w=null,M=null;const I=[],E=[],A=new bt;let C=null;const y=new sn;y.viewport=new Re;const v=new sn;v.viewport=new Re;const D=[y,v],F=new rf;let z=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(st){let ht=I[st];return ht===void 0&&(ht=new ta,I[st]=ht),ht.getTargetRaySpace()},this.getControllerGrip=function(st){let ht=I[st];return ht===void 0&&(ht=new ta,I[st]=ht),ht.getGripSpace()},this.getHand=function(st){let ht=I[st];return ht===void 0&&(ht=new ta,I[st]=ht),ht.getHandSpace()};function Y(st){const ht=E.indexOf(st.inputSource);if(ht===-1)return;const Rt=I[ht];Rt!==void 0&&(Rt.update(st.inputSource,st.frame,l||a),Rt.dispatchEvent({type:st.type,data:st.inputSource}))}function Z(){s.removeEventListener("select",Y),s.removeEventListener("selectstart",Y),s.removeEventListener("selectend",Y),s.removeEventListener("squeeze",Y),s.removeEventListener("squeezestart",Y),s.removeEventListener("squeezeend",Y),s.removeEventListener("end",Z),s.removeEventListener("inputsourceschange",et);for(let st=0;st<I.length;st++){const ht=E[st];ht!==null&&(E[st]=null,I[st].disconnect(ht))}z=null,q=null,m.reset();for(const st in p)delete p[st];t.setRenderTarget(w),f=null,d=null,u=null,s=null,M=null,se.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(A.width,A.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(st){o=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(st){r=st,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(st){l=st},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(st){if(s=st,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",Y),s.addEventListener("selectstart",Y),s.addEventListener("selectend",Y),s.addEventListener("squeeze",Y),s.addEventListener("squeezestart",Y),s.addEventListener("squeezeend",Y),s.addEventListener("end",Z),s.addEventListener("inputsourceschange",et),T.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Rt=null,Bt=null,Dt=null;T.depth&&(Dt=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Rt=T.stencil?Ms:xs,Bt=T.stencil?_s:gi);const ee={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:o};u=this.getBinding(),d=u.createProjectionLayer(ee),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),M=new vi(d.textureWidth,d.textureHeight,{format:_n,type:En,depthTexture:new sh(d.textureWidth,d.textureHeight,Bt,void 0,void 0,void 0,void 0,void 0,void 0,Rt),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Rt={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:o};f=new XRWebGLLayer(s,e,Rt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new vi(f.framebufferWidth,f.framebufferHeight,{format:_n,type:En,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(r),se.setContext(s),se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function et(st){for(let ht=0;ht<st.removed.length;ht++){const Rt=st.removed[ht],Bt=E.indexOf(Rt);Bt>=0&&(E[Bt]=null,I[Bt].disconnect(Rt))}for(let ht=0;ht<st.added.length;ht++){const Rt=st.added[ht];let Bt=E.indexOf(Rt);if(Bt===-1){for(let ee=0;ee<I.length;ee++)if(ee>=E.length){E.push(Rt),Bt=ee;break}else if(E[ee]===null){E[ee]=Rt,Bt=ee;break}if(Bt===-1)break}const Dt=I[Bt];Dt&&Dt.connect(Rt)}}const j=new U,nt=new U;function X(st,ht,Rt){j.setFromMatrixPosition(ht.matrixWorld),nt.setFromMatrixPosition(Rt.matrixWorld);const Bt=j.distanceTo(nt),Dt=ht.projectionMatrix.elements,ee=Rt.projectionMatrix.elements,me=Dt[14]/(Dt[10]-1),N=Dt[14]/(Dt[10]+1),ut=(Dt[9]+1)/Dt[5],rt=(Dt[9]-1)/Dt[5],ot=(Dt[8]-1)/Dt[0],J=(ee[8]+1)/ee[0],yt=me*ot,pt=me*J,St=Bt/(-ot+J),kt=St*-ot;if(ht.matrixWorld.decompose(st.position,st.quaternion,st.scale),st.translateX(kt),st.translateZ(St),st.matrixWorld.compose(st.position,st.quaternion,st.scale),st.matrixWorldInverse.copy(st.matrixWorld).invert(),Dt[10]===-1)st.projectionMatrix.copy(ht.projectionMatrix),st.projectionMatrixInverse.copy(ht.projectionMatrixInverse);else{const Yt=me+St,L=N+St,b=yt-kt,H=pt+(Bt-kt),tt=ut*N/L*Yt,lt=rt*N/L*Yt;st.projectionMatrix.makePerspective(b,H,tt,lt,Yt,L),st.projectionMatrixInverse.copy(st.projectionMatrix).invert()}}function vt(st,ht){ht===null?st.matrixWorld.copy(st.matrix):st.matrixWorld.multiplyMatrices(ht.matrixWorld,st.matrix),st.matrixWorldInverse.copy(st.matrixWorld).invert()}this.updateCamera=function(st){if(s===null)return;let ht=st.near,Rt=st.far;m.texture!==null&&(m.depthNear>0&&(ht=m.depthNear),m.depthFar>0&&(Rt=m.depthFar)),F.near=v.near=y.near=ht,F.far=v.far=y.far=Rt,(z!==F.near||q!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,q=F.far),F.layers.mask=st.layers.mask|6,y.layers.mask=F.layers.mask&3,v.layers.mask=F.layers.mask&5;const Bt=st.parent,Dt=F.cameras;vt(F,Bt);for(let ee=0;ee<Dt.length;ee++)vt(Dt[ee],Bt);Dt.length===2?X(F,y,v):F.projectionMatrix.copy(y.projectionMatrix),Wt(st,F,Bt)};function Wt(st,ht,Rt){Rt===null?st.matrix.copy(ht.matrixWorld):(st.matrix.copy(Rt.matrixWorld),st.matrix.invert(),st.matrix.multiply(ht.matrixWorld)),st.matrix.decompose(st.position,st.quaternion,st.scale),st.updateMatrixWorld(!0),st.projectionMatrix.copy(ht.projectionMatrix),st.projectionMatrixInverse.copy(ht.projectionMatrixInverse),st.isPerspectiveCamera&&(st.fov=ys*2*Math.atan(1/st.projectionMatrix.elements[5]),st.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(st){c=st,d!==null&&(d.fixedFoveation=st),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=st)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(st){return p[st]};let te=null;function le(st,ht){if(h=ht.getViewerPose(l||a),g=ht,h!==null){const Rt=h.views;f!==null&&(t.setRenderTargetFramebuffer(M,f.framebuffer),t.setRenderTarget(M));let Bt=!1;Rt.length!==F.cameras.length&&(F.cameras.length=0,Bt=!0);for(let N=0;N<Rt.length;N++){const ut=Rt[N];let rt=null;if(f!==null)rt=f.getViewport(ut);else{const J=u.getViewSubImage(d,ut);rt=J.viewport,N===0&&(t.setRenderTargetTextures(M,J.colorTexture,J.depthStencilTexture),t.setRenderTarget(M))}let ot=D[N];ot===void 0&&(ot=new sn,ot.layers.enable(N),ot.viewport=new Re,D[N]=ot),ot.matrix.fromArray(ut.transform.matrix),ot.matrix.decompose(ot.position,ot.quaternion,ot.scale),ot.projectionMatrix.fromArray(ut.projectionMatrix),ot.projectionMatrixInverse.copy(ot.projectionMatrix).invert(),ot.viewport.set(rt.x,rt.y,rt.width,rt.height),N===0&&(F.matrix.copy(ot.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),Bt===!0&&F.cameras.push(ot)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const N=u.getDepthInformation(Rt[0]);N&&N.isValid&&N.texture&&m.init(N,s.renderState)}if(Dt&&Dt.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let N=0;N<Rt.length;N++){const ut=Rt[N].camera;if(ut){let rt=p[ut];rt||(rt=new oh,p[ut]=rt);const ot=u.getCameraImage(ut);rt.sourceTexture=ot}}}}for(let Rt=0;Rt<I.length;Rt++){const Bt=E[Rt],Dt=I[Rt];Bt!==null&&Dt!==void 0&&Dt.update(Bt,ht,l||a)}te&&te(st,ht),ht.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ht}),g=null}const se=new vh;se.setAnimationLoop(le),this.setAnimationLoop=function(st){te=st},this.dispose=function(){}}}const ri=new Hn,Vg=new Te;function Gg(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Ql(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,T,w,M){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,M)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),_(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,T,w):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ye&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ye&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const T=t.get(p),w=T.envMap,M=T.envMapRotation;w&&(m.envMap.value=w,ri.copy(M),ri.x*=-1,ri.y*=-1,ri.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ri.y*=-1,ri.z*=-1),m.envMapRotation.value.setFromMatrix4(Vg.makeRotationFromEuler(ri)),m.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,T,w){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=w*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ye&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const T=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Wg(i,t,e,n){let s={},o={},a=[];const r=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,w){const M=w.program;n.uniformBlockBinding(T,M)}function l(T,w){let M=s[T.id];M===void 0&&(g(T),M=h(T),s[T.id]=M,T.addEventListener("dispose",m));const I=w.program;n.updateUBOMapping(T,I);const E=t.render.frame;o[T.id]!==E&&(d(T),o[T.id]=E)}function h(T){const w=u();T.__bindingPointIndex=w;const M=i.createBuffer(),I=T.__size,E=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,M),i.bufferData(i.UNIFORM_BUFFER,I,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,w,M),M}function u(){for(let T=0;T<r;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const w=s[T.id],M=T.uniforms,I=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let E=0,A=M.length;E<A;E++){const C=Array.isArray(M[E])?M[E]:[M[E]];for(let y=0,v=C.length;y<v;y++){const D=C[y];if(f(D,E,y,I)===!0){const F=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let q=0;for(let Y=0;Y<z.length;Y++){const Z=z[Y],et=_(Z);typeof Z=="number"||typeof Z=="boolean"?(D.__data[0]=Z,i.bufferSubData(i.UNIFORM_BUFFER,F+q,D.__data)):Z.isMatrix3?(D.__data[0]=Z.elements[0],D.__data[1]=Z.elements[1],D.__data[2]=Z.elements[2],D.__data[3]=0,D.__data[4]=Z.elements[3],D.__data[5]=Z.elements[4],D.__data[6]=Z.elements[5],D.__data[7]=0,D.__data[8]=Z.elements[6],D.__data[9]=Z.elements[7],D.__data[10]=Z.elements[8],D.__data[11]=0):(Z.toArray(D.__data,q),q+=et.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(T,w,M,I){const E=T.value,A=w+"_"+M;if(I[A]===void 0)return typeof E=="number"||typeof E=="boolean"?I[A]=E:I[A]=E.clone(),!0;{const C=I[A];if(typeof E=="number"||typeof E=="boolean"){if(C!==E)return I[A]=E,!0}else if(C.equals(E)===!1)return C.copy(E),!0}return!1}function g(T){const w=T.uniforms;let M=0;const I=16;for(let A=0,C=w.length;A<C;A++){const y=Array.isArray(w[A])?w[A]:[w[A]];for(let v=0,D=y.length;v<D;v++){const F=y[v],z=Array.isArray(F.value)?F.value:[F.value];for(let q=0,Y=z.length;q<Y;q++){const Z=z[q],et=_(Z),j=M%I,nt=j%et.boundary,X=j+nt;M+=nt,X!==0&&I-X<et.storage&&(M+=I-X),F.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=M,M+=et.storage}}}const E=M%I;return E>0&&(M+=I-E),T.__size=M,T.__cache={},this}function _(T){const w={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(w.boundary=4,w.storage=4):T.isVector2?(w.boundary=8,w.storage=8):T.isVector3||T.isColor?(w.boundary=16,w.storage=12):T.isVector4?(w.boundary=16,w.storage=16):T.isMatrix3?(w.boundary=48,w.storage=48):T.isMatrix4?(w.boundary=64,w.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),w}function m(T){const w=T.target;w.removeEventListener("dispose",m);const M=a.indexOf(w.__bindingPointIndex);a.splice(M,1),i.deleteBuffer(s[w.id]),delete s[w.id],delete o[w.id]}function p(){for(const T in s)i.deleteBuffer(s[T]);a=[],s={},o={}}return{bind:c,update:l,dispose:p}}class Sh{constructor(t={}){const{canvas:e=Wu(),context:n=null,depth:s=!0,stencil:o=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const T=[],w=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$n,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const M=this;let I=!1;this._outputColorSpace=nn;let E=0,A=0,C=null,y=-1,v=null;const D=new Re,F=new Re;let z=null;const q=new ae(0);let Y=0,Z=e.width,et=e.height,j=1,nt=null,X=null;const vt=new Re(0,0,Z,et),Wt=new Re(0,0,Z,et);let te=!1;const le=new Vr;let se=!1,st=!1;const ht=new Te,Rt=new U,Bt=new Re,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ee=!1;function me(){return C===null?j:1}let N=n;function ut(R,k){return e.getContext(R,k)}try{const R={alpha:!0,depth:s,stencil:o,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ir}`),e.addEventListener("webglcontextlost",Mt,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",ft,!1),N===null){const k="webgl2";if(N=ut(k,R),N===null)throw ut(k)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let rt,ot,J,yt,pt,St,kt,Yt,L,b,H,tt,lt,$,It,_t,Ut,Nt,mt,At,Vt,Ot,Et,Zt;function B(){rt=new em(N),rt.init(),Ot=new Og(N,rt),ot=new j0(N,rt,t,Ot),J=new Ng(N,rt),ot.reversedDepthBuffer&&d&&J.buffers.depth.setReversed(!0),yt=new sm(N),pt=new Sg,St=new Fg(N,rt,J,pt,ot,Ot,yt),kt=new Z0(M),Yt=new tm(M),L=new hf(N),Et=new X0(N,L),b=new nm(N,L,yt,Et),H=new am(N,b,L,yt),mt=new om(N,ot,St),_t=new J0(pt),tt=new yg(M,kt,Yt,rt,ot,Et,_t),lt=new Gg(M,pt),$=new wg,It=new Pg(rt),Nt=new q0(M,kt,Yt,J,H,f,c),Ut=new Dg(M,H,ot),Zt=new Wg(N,yt,ot,J),At=new Y0(N,rt,yt),Vt=new im(N,rt,yt),yt.programs=tt.programs,M.capabilities=ot,M.extensions=rt,M.properties=pt,M.renderLists=$,M.shadowMap=Ut,M.state=J,M.info=yt}B();const gt=new Hg(M,N);this.xr=gt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const R=rt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=rt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(R){R!==void 0&&(j=R,this.setSize(Z,et,!1))},this.getSize=function(R){return R.set(Z,et)},this.setSize=function(R,k,K=!0){if(gt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=R,et=k,e.width=Math.floor(R*j),e.height=Math.floor(k*j),K===!0&&(e.style.width=R+"px",e.style.height=k+"px"),this.setViewport(0,0,R,k)},this.getDrawingBufferSize=function(R){return R.set(Z*j,et*j).floor()},this.setDrawingBufferSize=function(R,k,K){Z=R,et=k,j=K,e.width=Math.floor(R*K),e.height=Math.floor(k*K),this.setViewport(0,0,R,k)},this.getCurrentViewport=function(R){return R.copy(D)},this.getViewport=function(R){return R.copy(vt)},this.setViewport=function(R,k,K,Q){R.isVector4?vt.set(R.x,R.y,R.z,R.w):vt.set(R,k,K,Q),J.viewport(D.copy(vt).multiplyScalar(j).round())},this.getScissor=function(R){return R.copy(Wt)},this.setScissor=function(R,k,K,Q){R.isVector4?Wt.set(R.x,R.y,R.z,R.w):Wt.set(R,k,K,Q),J.scissor(F.copy(Wt).multiplyScalar(j).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(R){J.setScissorTest(te=R)},this.setOpaqueSort=function(R){nt=R},this.setTransparentSort=function(R){X=R},this.getClearColor=function(R){return R.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor(...arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha(...arguments)},this.clear=function(R=!0,k=!0,K=!0){let Q=0;if(R){let V=!1;if(C!==null){const xt=C.texture.format;V=xt===zr||xt===Or||xt===Fr}if(V){const xt=C.texture.type,Ct=xt===En||xt===gi||xt===vs||xt===_s||xt===Dr||xt===Ur,Ft=Nt.getClearColor(),Pt=Nt.getClearAlpha(),Xt=Ft.r,jt=Ft.g,Ht=Ft.b;Ct?(g[0]=Xt,g[1]=jt,g[2]=Ht,g[3]=Pt,N.clearBufferuiv(N.COLOR,0,g)):(_[0]=Xt,_[1]=jt,_[2]=Ht,_[3]=Pt,N.clearBufferiv(N.COLOR,0,_))}else Q|=N.COLOR_BUFFER_BIT}k&&(Q|=N.DEPTH_BUFFER_BIT),K&&(Q|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Mt,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",ft,!1),Nt.dispose(),$.dispose(),It.dispose(),pt.dispose(),kt.dispose(),Yt.dispose(),H.dispose(),Et.dispose(),Zt.dispose(),tt.dispose(),gt.dispose(),gt.removeEventListener("sessionstart",qe),gt.removeEventListener("sessionend",O),W.stop()};function Mt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),I=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),I=!1;const R=yt.autoReset,k=Ut.enabled,K=Ut.autoUpdate,Q=Ut.needsUpdate,V=Ut.type;B(),yt.autoReset=R,Ut.enabled=k,Ut.autoUpdate=K,Ut.needsUpdate=Q,Ut.type=V}function ft(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function at(R){const k=R.target;k.removeEventListener("dispose",at),Lt(k)}function Lt(R){Jt(R),pt.remove(R)}function Jt(R){const k=pt.get(R).programs;k!==void 0&&(k.forEach(function(K){tt.releaseProgram(K)}),R.isShaderMaterial&&tt.releaseShaderCache(R))}this.renderBufferDirect=function(R,k,K,Q,V,xt){k===null&&(k=Dt);const Ct=V.isMesh&&V.matrixWorld.determinant()<0,Ft=Fh(R,k,K,Q,V);J.setMaterial(Q,Ct);let Pt=K.index,Xt=1;if(Q.wireframe===!0){if(Pt=b.getWireframeAttribute(K),Pt===void 0)return;Xt=2}const jt=K.drawRange,Ht=K.attributes.position;let oe=jt.start*Xt,ve=(jt.start+jt.count)*Xt;xt!==null&&(oe=Math.max(oe,xt.start*Xt),ve=Math.min(ve,(xt.start+xt.count)*Xt)),Pt!==null?(oe=Math.max(oe,0),ve=Math.min(ve,Pt.count)):Ht!=null&&(oe=Math.max(oe,0),ve=Math.min(ve,Ht.count));const Ce=ve-oe;if(Ce<0||Ce===1/0)return;Et.setup(V,Q,Ft,K,Pt);let Me,xe=At;if(Pt!==null&&(Me=L.get(Pt),xe=Vt,xe.setIndex(Me)),V.isMesh)Q.wireframe===!0?(J.setLineWidth(Q.wireframeLinewidth*me()),xe.setMode(N.LINES)):xe.setMode(N.TRIANGLES);else if(V.isLine){let Gt=Q.linewidth;Gt===void 0&&(Gt=1),J.setLineWidth(Gt*me()),V.isLineSegments?xe.setMode(N.LINES):V.isLineLoop?xe.setMode(N.LINE_LOOP):xe.setMode(N.LINE_STRIP)}else V.isPoints?xe.setMode(N.POINTS):V.isSprite&&xe.setMode(N.TRIANGLES);if(V.isBatchedMesh)if(V._multiDrawInstances!==null)Ss("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),xe.renderMultiDrawInstances(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount,V._multiDrawInstances);else if(rt.get("WEBGL_multi_draw"))xe.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Gt=V._multiDrawStarts,be=V._multiDrawCounts,ue=V._multiDrawCount,Je=Pt?L.get(Pt).bytesPerElement:1,yi=pt.get(Q).currentProgram.getUniforms();for(let Ze=0;Ze<ue;Ze++)yi.setValue(N,"_gl_DrawID",Ze),xe.render(Gt[Ze]/Je,be[Ze])}else if(V.isInstancedMesh)xe.renderInstances(oe,Ce,V.count);else if(K.isInstancedBufferGeometry){const Gt=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,be=Math.min(K.instanceCount,Gt);xe.renderInstances(oe,Ce,be)}else xe.render(oe,Ce)};function ge(R,k,K){R.transparent===!0&&R.side===mn&&R.forceSinglePass===!1?(R.side=Ye,R.needsUpdate=!0,ti(R,k,K),R.side=kn,R.needsUpdate=!0,ti(R,k,K),R.side=mn):ti(R,k,K)}this.compile=function(R,k,K=null){K===null&&(K=R),p=It.get(K),p.init(k),w.push(p),K.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(p.pushLight(V),V.castShadow&&p.pushShadow(V))}),R!==K&&R.traverseVisible(function(V){V.isLight&&V.layers.test(k.layers)&&(p.pushLight(V),V.castShadow&&p.pushShadow(V))}),p.setupLights();const Q=new Set;return R.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const xt=V.material;if(xt)if(Array.isArray(xt))for(let Ct=0;Ct<xt.length;Ct++){const Ft=xt[Ct];ge(Ft,K,V),Q.add(Ft)}else ge(xt,K,V),Q.add(xt)}),p=w.pop(),Q},this.compileAsync=function(R,k,K=null){const Q=this.compile(R,k,K);return new Promise(V=>{function xt(){if(Q.forEach(function(Ct){pt.get(Ct).currentProgram.isReady()&&Q.delete(Ct)}),Q.size===0){V(R);return}setTimeout(xt,10)}rt.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let ie=null;function je(R){ie&&ie(R)}function qe(){W.stop()}function O(){W.start()}const W=new vh;W.setAnimationLoop(je),typeof self<"u"&&W.setContext(self),this.setAnimationLoop=function(R){ie=R,gt.setAnimationLoop(R),R===null?W.stop():W.start()},gt.addEventListener("sessionstart",qe),gt.addEventListener("sessionend",O),this.render=function(R,k){if(k!==void 0&&k.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),gt.enabled===!0&&gt.isPresenting===!0&&(gt.cameraAutoUpdate===!0&&gt.updateCamera(k),k=gt.getCamera()),R.isScene===!0&&R.onBeforeRender(M,R,k,C),p=It.get(R,w.length),p.init(k),w.push(p),ht.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),le.setFromProjectionMatrix(ht,Sn,k.reversedDepth),st=this.localClippingEnabled,se=_t.init(this.clippingPlanes,st),m=$.get(R,T.length),m.init(),T.push(m),gt.enabled===!0&&gt.isPresenting===!0){const xt=M.xr.getDepthSensingMesh();xt!==null&&dt(xt,k,-1/0,M.sortObjects)}dt(R,k,0,M.sortObjects),m.finish(),M.sortObjects===!0&&m.sort(nt,X),ee=gt.enabled===!1||gt.isPresenting===!1||gt.hasDepthSensing()===!1,ee&&Nt.addToRenderList(m,R),this.info.render.frame++,se===!0&&_t.beginShadows();const K=p.state.shadowsArray;Ut.render(K,R,k),se===!0&&_t.endShadows(),this.info.autoReset===!0&&this.info.reset();const Q=m.opaque,V=m.transmissive;if(p.setupLights(),k.isArrayCamera){const xt=k.cameras;if(V.length>0)for(let Ct=0,Ft=xt.length;Ct<Ft;Ct++){const Pt=xt[Ct];Kt(Q,V,R,Pt)}ee&&Nt.render(R);for(let Ct=0,Ft=xt.length;Ct<Ft;Ct++){const Pt=xt[Ct];qt(m,R,Pt,Pt.viewport)}}else V.length>0&&Kt(Q,V,R,k),ee&&Nt.render(R),qt(m,R,k);C!==null&&A===0&&(St.updateMultisampleRenderTarget(C),St.updateRenderTargetMipmap(C)),R.isScene===!0&&R.onAfterRender(M,R,k),Et.resetDefaultState(),y=-1,v=null,w.pop(),w.length>0?(p=w[w.length-1],se===!0&&_t.setGlobalState(M.clippingPlanes,p.state.camera)):p=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function dt(R,k,K,Q){if(R.visible===!1)return;if(R.layers.test(k.layers)){if(R.isGroup)K=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(k);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||le.intersectsSprite(R)){Q&&Bt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(ht);const Ct=H.update(R),Ft=R.material;Ft.visible&&m.push(R,Ct,Ft,K,Bt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||le.intersectsObject(R))){const Ct=H.update(R),Ft=R.material;if(Q&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Bt.copy(R.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),Bt.copy(Ct.boundingSphere.center)),Bt.applyMatrix4(R.matrixWorld).applyMatrix4(ht)),Array.isArray(Ft)){const Pt=Ct.groups;for(let Xt=0,jt=Pt.length;Xt<jt;Xt++){const Ht=Pt[Xt],oe=Ft[Ht.materialIndex];oe&&oe.visible&&m.push(R,Ct,oe,K,Bt.z,Ht)}}else Ft.visible&&m.push(R,Ct,Ft,K,Bt.z,null)}}const xt=R.children;for(let Ct=0,Ft=xt.length;Ct<Ft;Ct++)dt(xt[Ct],k,K,Q)}function qt(R,k,K,Q){const V=R.opaque,xt=R.transmissive,Ct=R.transparent;p.setupLightsView(K),se===!0&&_t.setGlobalState(M.clippingPlanes,K),Q&&J.viewport(D.copy(Q)),V.length>0&&an(V,k,K),xt.length>0&&an(xt,k,K),Ct.length>0&&an(Ct,k,K),J.buffers.depth.setTest(!0),J.buffers.depth.setMask(!0),J.buffers.color.setMask(!0),J.setPolygonOffset(!1)}function Kt(R,k,K,Q){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Q.id]===void 0&&(p.state.transmissionRenderTarget[Q.id]=new vi(1,1,{generateMipmaps:!0,type:rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float")?Cs:En,minFilter:pi,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:fe.workingColorSpace}));const xt=p.state.transmissionRenderTarget[Q.id],Ct=Q.viewport||D;xt.setSize(Ct.z*M.transmissionResolutionScale,Ct.w*M.transmissionResolutionScale);const Ft=M.getRenderTarget(),Pt=M.getActiveCubeFace(),Xt=M.getActiveMipmapLevel();M.setRenderTarget(xt),M.getClearColor(q),Y=M.getClearAlpha(),Y<1&&M.setClearColor(16777215,.5),M.clear(),ee&&Nt.render(K);const jt=M.toneMapping;M.toneMapping=$n;const Ht=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),p.setupLightsView(Q),se===!0&&_t.setGlobalState(M.clippingPlanes,Q),an(R,K,Q),St.updateMultisampleRenderTarget(xt),St.updateRenderTargetMipmap(xt),rt.has("WEBGL_multisampled_render_to_texture")===!1){let oe=!1;for(let ve=0,Ce=k.length;ve<Ce;ve++){const Me=k[ve],xe=Me.object,Gt=Me.geometry,be=Me.material,ue=Me.group;if(be.side===mn&&xe.layers.test(Q.layers)){const Je=be.side;be.side=Ye,be.needsUpdate=!0,Qi(xe,K,Q,Gt,be,ue),be.side=Je,be.needsUpdate=!0,oe=!0}}oe===!0&&(St.updateMultisampleRenderTarget(xt),St.updateRenderTargetMipmap(xt))}M.setRenderTarget(Ft,Pt,Xt),M.setClearColor(q,Y),Ht!==void 0&&(Q.viewport=Ht),M.toneMapping=jt}function an(R,k,K){const Q=k.isScene===!0?k.overrideMaterial:null;for(let V=0,xt=R.length;V<xt;V++){const Ct=R[V],Ft=Ct.object,Pt=Ct.geometry,Xt=Ct.group;let jt=Ct.material;jt.allowOverride===!0&&Q!==null&&(jt=Q),Ft.layers.test(K.layers)&&Qi(Ft,k,K,Pt,jt,Xt)}}function Qi(R,k,K,Q,V,xt){R.onBeforeRender(M,k,K,Q,V,xt),R.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),V.onBeforeRender(M,k,K,Q,R,xt),V.transparent===!0&&V.side===mn&&V.forceSinglePass===!1?(V.side=Ye,V.needsUpdate=!0,M.renderBufferDirect(K,k,Q,V,R,xt),V.side=kn,V.needsUpdate=!0,M.renderBufferDirect(K,k,Q,V,R,xt),V.side=mn):M.renderBufferDirect(K,k,Q,V,R,xt),R.onAfterRender(M,k,K,Q,V,xt)}function ti(R,k,K){k.isScene!==!0&&(k=Dt);const Q=pt.get(R),V=p.state.lights,xt=p.state.shadowsArray,Ct=V.state.version,Ft=tt.getParameters(R,V.state,xt,k,K),Pt=tt.getProgramCacheKey(Ft);let Xt=Q.programs;Q.environment=R.isMeshStandardMaterial?k.environment:null,Q.fog=k.fog,Q.envMap=(R.isMeshStandardMaterial?Yt:kt).get(R.envMap||Q.environment),Q.envMapRotation=Q.environment!==null&&R.envMap===null?k.environmentRotation:R.envMapRotation,Xt===void 0&&(R.addEventListener("dispose",at),Xt=new Map,Q.programs=Xt);let jt=Xt.get(Pt);if(jt!==void 0){if(Q.currentProgram===jt&&Q.lightsStateVersion===Ct)return Is(R,Ft),jt}else Ft.uniforms=tt.getUniforms(R),R.onBeforeCompile(Ft,M),jt=tt.acquireProgram(Ft,Pt),Xt.set(Pt,jt),Q.uniforms=Ft.uniforms;const Ht=Q.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Ht.clippingPlanes=_t.uniform),Is(R,Ft),Q.needsLights=zh(R),Q.lightsStateVersion=Ct,Q.needsLights&&(Ht.ambientLightColor.value=V.state.ambient,Ht.lightProbe.value=V.state.probe,Ht.directionalLights.value=V.state.directional,Ht.directionalLightShadows.value=V.state.directionalShadow,Ht.spotLights.value=V.state.spot,Ht.spotLightShadows.value=V.state.spotShadow,Ht.rectAreaLights.value=V.state.rectArea,Ht.ltc_1.value=V.state.rectAreaLTC1,Ht.ltc_2.value=V.state.rectAreaLTC2,Ht.pointLights.value=V.state.point,Ht.pointLightShadows.value=V.state.pointShadow,Ht.hemisphereLights.value=V.state.hemi,Ht.directionalShadowMap.value=V.state.directionalShadowMap,Ht.directionalShadowMatrix.value=V.state.directionalShadowMatrix,Ht.spotShadowMap.value=V.state.spotShadowMap,Ht.spotLightMatrix.value=V.state.spotLightMatrix,Ht.spotLightMap.value=V.state.spotLightMap,Ht.pointShadowMap.value=V.state.pointShadowMap,Ht.pointShadowMatrix.value=V.state.pointShadowMatrix),Q.currentProgram=jt,Q.uniformsList=null,jt}function ts(R){if(R.uniformsList===null){const k=R.currentProgram.getUniforms();R.uniformsList=fo.seqWithValue(k.seq,R.uniforms)}return R.uniformsList}function Is(R,k){const K=pt.get(R);K.outputColorSpace=k.outputColorSpace,K.batching=k.batching,K.batchingColor=k.batchingColor,K.instancing=k.instancing,K.instancingColor=k.instancingColor,K.instancingMorph=k.instancingMorph,K.skinning=k.skinning,K.morphTargets=k.morphTargets,K.morphNormals=k.morphNormals,K.morphColors=k.morphColors,K.morphTargetsCount=k.morphTargetsCount,K.numClippingPlanes=k.numClippingPlanes,K.numIntersection=k.numClipIntersection,K.vertexAlphas=k.vertexAlphas,K.vertexTangents=k.vertexTangents,K.toneMapping=k.toneMapping}function Fh(R,k,K,Q,V){k.isScene!==!0&&(k=Dt),St.resetTextureUnits();const xt=k.fog,Ct=Q.isMeshStandardMaterial?k.environment:null,Ft=C===null?M.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:qi,Pt=(Q.isMeshStandardMaterial?Yt:kt).get(Q.envMap||Ct),Xt=Q.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,jt=!!K.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Ht=!!K.morphAttributes.position,oe=!!K.morphAttributes.normal,ve=!!K.morphAttributes.color;let Ce=$n;Q.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Ce=M.toneMapping);const Me=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,xe=Me!==void 0?Me.length:0,Gt=pt.get(Q),be=p.state.lights;if(se===!0&&(st===!0||R!==v)){const ke=R===v&&Q.id===y;_t.setState(Q,R,ke)}let ue=!1;Q.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==be.state.version||Gt.outputColorSpace!==Ft||V.isBatchedMesh&&Gt.batching===!1||!V.isBatchedMesh&&Gt.batching===!0||V.isBatchedMesh&&Gt.batchingColor===!0&&V.colorTexture===null||V.isBatchedMesh&&Gt.batchingColor===!1&&V.colorTexture!==null||V.isInstancedMesh&&Gt.instancing===!1||!V.isInstancedMesh&&Gt.instancing===!0||V.isSkinnedMesh&&Gt.skinning===!1||!V.isSkinnedMesh&&Gt.skinning===!0||V.isInstancedMesh&&Gt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Gt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Gt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Gt.instancingMorph===!1&&V.morphTexture!==null||Gt.envMap!==Pt||Q.fog===!0&&Gt.fog!==xt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==_t.numPlanes||Gt.numIntersection!==_t.numIntersection)||Gt.vertexAlphas!==Xt||Gt.vertexTangents!==jt||Gt.morphTargets!==Ht||Gt.morphNormals!==oe||Gt.morphColors!==ve||Gt.toneMapping!==Ce||Gt.morphTargetsCount!==xe)&&(ue=!0):(ue=!0,Gt.__version=Q.version);let Je=Gt.currentProgram;ue===!0&&(Je=ti(Q,k,V));let yi=!1,Ze=!1,es=!1;const we=Je.getUniforms(),rn=Gt.uniforms;if(J.useProgram(Je.program)&&(yi=!0,Ze=!0,es=!0),Q.id!==y&&(y=Q.id,Ze=!0),yi||v!==R){J.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),we.setValue(N,"projectionMatrix",R.projectionMatrix),we.setValue(N,"viewMatrix",R.matrixWorldInverse);const Xe=we.map.cameraPosition;Xe!==void 0&&Xe.setValue(N,Rt.setFromMatrixPosition(R.matrixWorld)),ot.logarithmicDepthBuffer&&we.setValue(N,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&we.setValue(N,"isOrthographic",R.isOrthographicCamera===!0),v!==R&&(v=R,Ze=!0,es=!0)}if(V.isSkinnedMesh){we.setOptional(N,V,"bindMatrix"),we.setOptional(N,V,"bindMatrixInverse");const ke=V.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),we.setValue(N,"boneTexture",ke.boneTexture,St))}V.isBatchedMesh&&(we.setOptional(N,V,"batchingTexture"),we.setValue(N,"batchingTexture",V._matricesTexture,St),we.setOptional(N,V,"batchingIdTexture"),we.setValue(N,"batchingIdTexture",V._indirectTexture,St),we.setOptional(N,V,"batchingColorTexture"),V._colorsTexture!==null&&we.setValue(N,"batchingColorTexture",V._colorsTexture,St));const cn=K.morphAttributes;if((cn.position!==void 0||cn.normal!==void 0||cn.color!==void 0)&&mt.update(V,K,Je),(Ze||Gt.receiveShadow!==V.receiveShadow)&&(Gt.receiveShadow=V.receiveShadow,we.setValue(N,"receiveShadow",V.receiveShadow)),Q.isMeshGouraudMaterial&&Q.envMap!==null&&(rn.envMap.value=Pt,rn.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Q.isMeshStandardMaterial&&Q.envMap===null&&k.environment!==null&&(rn.envMapIntensity.value=k.environmentIntensity),Ze&&(we.setValue(N,"toneMappingExposure",M.toneMappingExposure),Gt.needsLights&&Oh(rn,es),xt&&Q.fog===!0&&lt.refreshFogUniforms(rn,xt),lt.refreshMaterialUniforms(rn,Q,j,et,p.state.transmissionRenderTarget[R.id]),fo.upload(N,ts(Gt),rn,St)),Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(fo.upload(N,ts(Gt),rn,St),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&we.setValue(N,"center",V.center),we.setValue(N,"modelViewMatrix",V.modelViewMatrix),we.setValue(N,"normalMatrix",V.normalMatrix),we.setValue(N,"modelMatrix",V.matrixWorld),Q.isShaderMaterial||Q.isRawShaderMaterial){const ke=Q.uniformsGroups;for(let Xe=0,Lo=ke.length;Xe<Lo;Xe++){const ei=ke[Xe];Zt.update(ei,Je),Zt.bind(ei,Je)}}return Je}function Oh(R,k){R.ambientLightColor.needsUpdate=k,R.lightProbe.needsUpdate=k,R.directionalLights.needsUpdate=k,R.directionalLightShadows.needsUpdate=k,R.pointLights.needsUpdate=k,R.pointLightShadows.needsUpdate=k,R.spotLights.needsUpdate=k,R.spotLightShadows.needsUpdate=k,R.rectAreaLights.needsUpdate=k,R.hemisphereLights.needsUpdate=k}function zh(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(R,k,K){const Q=pt.get(R);Q.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),pt.get(R.texture).__webglTexture=k,pt.get(R.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:K,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,k){const K=pt.get(R);K.__webglFramebuffer=k,K.__useDefaultFramebuffer=k===void 0};const Bh=N.createFramebuffer();this.setRenderTarget=function(R,k=0,K=0){C=R,E=k,A=K;let Q=!0,V=null,xt=!1,Ct=!1;if(R){const Pt=pt.get(R);if(Pt.__useDefaultFramebuffer!==void 0)J.bindFramebuffer(N.FRAMEBUFFER,null),Q=!1;else if(Pt.__webglFramebuffer===void 0)St.setupRenderTarget(R);else if(Pt.__hasExternalTextures)St.rebindTextures(R,pt.get(R.texture).__webglTexture,pt.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Ht=R.depthTexture;if(Pt.__boundDepthTexture!==Ht){if(Ht!==null&&pt.has(Ht)&&(R.width!==Ht.image.width||R.height!==Ht.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");St.setupDepthRenderbuffer(R)}}const Xt=R.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Ct=!0);const jt=pt.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(jt[k])?V=jt[k][K]:V=jt[k],xt=!0):R.samples>0&&St.useMultisampledRTT(R)===!1?V=pt.get(R).__webglMultisampledFramebuffer:Array.isArray(jt)?V=jt[K]:V=jt,D.copy(R.viewport),F.copy(R.scissor),z=R.scissorTest}else D.copy(vt).multiplyScalar(j).floor(),F.copy(Wt).multiplyScalar(j).floor(),z=te;if(K!==0&&(V=Bh),J.bindFramebuffer(N.FRAMEBUFFER,V)&&Q&&J.drawBuffers(R,V),J.viewport(D),J.scissor(F),J.setScissorTest(z),xt){const Pt=pt.get(R.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+k,Pt.__webglTexture,K)}else if(Ct){const Pt=k;for(let Xt=0;Xt<R.textures.length;Xt++){const jt=pt.get(R.textures[Xt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Xt,jt.__webglTexture,K,Pt)}}else if(R!==null&&K!==0){const Pt=pt.get(R.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Pt.__webglTexture,K)}y=-1},this.readRenderTargetPixels=function(R,k,K,Q,V,xt,Ct,Ft=0){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(Pt=Pt[Ct]),Pt){J.bindFramebuffer(N.FRAMEBUFFER,Pt);try{const Xt=R.textures[Ft],jt=Xt.format,Ht=Xt.type;if(!ot.textureFormatReadable(jt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ot.textureTypeReadable(Ht)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=R.width-Q&&K>=0&&K<=R.height-V&&(R.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ft),N.readPixels(k,K,Q,V,Ot.convert(jt),Ot.convert(Ht),xt))}finally{const Xt=C!==null?pt.get(C).__webglFramebuffer:null;J.bindFramebuffer(N.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(R,k,K,Q,V,xt,Ct,Ft=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=pt.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ct!==void 0&&(Pt=Pt[Ct]),Pt)if(k>=0&&k<=R.width-Q&&K>=0&&K<=R.height-V){J.bindFramebuffer(N.FRAMEBUFFER,Pt);const Xt=R.textures[Ft],jt=Xt.format,Ht=Xt.type;if(!ot.textureFormatReadable(jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ot.textureTypeReadable(Ht))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const oe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,oe),N.bufferData(N.PIXEL_PACK_BUFFER,xt.byteLength,N.STREAM_READ),R.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ft),N.readPixels(k,K,Q,V,Ot.convert(jt),Ot.convert(Ht),0);const ve=C!==null?pt.get(C).__webglFramebuffer:null;J.bindFramebuffer(N.FRAMEBUFFER,ve);const Ce=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await qu(N,Ce,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,oe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,xt),N.deleteBuffer(oe),N.deleteSync(Ce),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,k=null,K=0){const Q=Math.pow(2,-K),V=Math.floor(R.image.width*Q),xt=Math.floor(R.image.height*Q),Ct=k!==null?k.x:0,Ft=k!==null?k.y:0;St.setTexture2D(R,0),N.copyTexSubImage2D(N.TEXTURE_2D,K,0,0,Ct,Ft,V,xt),J.unbindTexture()};const kh=N.createFramebuffer(),Hh=N.createFramebuffer();this.copyTextureToTexture=function(R,k,K=null,Q=null,V=0,xt=null){xt===null&&(V!==0?(Ss("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),xt=V,V=0):xt=0);let Ct,Ft,Pt,Xt,jt,Ht,oe,ve,Ce;const Me=R.isCompressedTexture?R.mipmaps[xt]:R.image;if(K!==null)Ct=K.max.x-K.min.x,Ft=K.max.y-K.min.y,Pt=K.isBox3?K.max.z-K.min.z:1,Xt=K.min.x,jt=K.min.y,Ht=K.isBox3?K.min.z:0;else{const cn=Math.pow(2,-V);Ct=Math.floor(Me.width*cn),Ft=Math.floor(Me.height*cn),R.isDataArrayTexture?Pt=Me.depth:R.isData3DTexture?Pt=Math.floor(Me.depth*cn):Pt=1,Xt=0,jt=0,Ht=0}Q!==null?(oe=Q.x,ve=Q.y,Ce=Q.z):(oe=0,ve=0,Ce=0);const xe=Ot.convert(k.format),Gt=Ot.convert(k.type);let be;k.isData3DTexture?(St.setTexture3D(k,0),be=N.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(St.setTexture2DArray(k,0),be=N.TEXTURE_2D_ARRAY):(St.setTexture2D(k,0),be=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,k.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,k.unpackAlignment);const ue=N.getParameter(N.UNPACK_ROW_LENGTH),Je=N.getParameter(N.UNPACK_IMAGE_HEIGHT),yi=N.getParameter(N.UNPACK_SKIP_PIXELS),Ze=N.getParameter(N.UNPACK_SKIP_ROWS),es=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Me.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Me.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Xt),N.pixelStorei(N.UNPACK_SKIP_ROWS,jt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ht);const we=R.isDataArrayTexture||R.isData3DTexture,rn=k.isDataArrayTexture||k.isData3DTexture;if(R.isDepthTexture){const cn=pt.get(R),ke=pt.get(k),Xe=pt.get(cn.__renderTarget),Lo=pt.get(ke.__renderTarget);J.bindFramebuffer(N.READ_FRAMEBUFFER,Xe.__webglFramebuffer),J.bindFramebuffer(N.DRAW_FRAMEBUFFER,Lo.__webglFramebuffer);for(let ei=0;ei<Pt;ei++)we&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,pt.get(R).__webglTexture,V,Ht+ei),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,pt.get(k).__webglTexture,xt,Ce+ei)),N.blitFramebuffer(Xt,jt,Ct,Ft,oe,ve,Ct,Ft,N.DEPTH_BUFFER_BIT,N.NEAREST);J.bindFramebuffer(N.READ_FRAMEBUFFER,null),J.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(V!==0||R.isRenderTargetTexture||pt.has(R)){const cn=pt.get(R),ke=pt.get(k);J.bindFramebuffer(N.READ_FRAMEBUFFER,kh),J.bindFramebuffer(N.DRAW_FRAMEBUFFER,Hh);for(let Xe=0;Xe<Pt;Xe++)we?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,cn.__webglTexture,V,Ht+Xe):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,cn.__webglTexture,V),rn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ke.__webglTexture,xt,Ce+Xe):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ke.__webglTexture,xt),V!==0?N.blitFramebuffer(Xt,jt,Ct,Ft,oe,ve,Ct,Ft,N.COLOR_BUFFER_BIT,N.NEAREST):rn?N.copyTexSubImage3D(be,xt,oe,ve,Ce+Xe,Xt,jt,Ct,Ft):N.copyTexSubImage2D(be,xt,oe,ve,Xt,jt,Ct,Ft);J.bindFramebuffer(N.READ_FRAMEBUFFER,null),J.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else rn?R.isDataTexture||R.isData3DTexture?N.texSubImage3D(be,xt,oe,ve,Ce,Ct,Ft,Pt,xe,Gt,Me.data):k.isCompressedArrayTexture?N.compressedTexSubImage3D(be,xt,oe,ve,Ce,Ct,Ft,Pt,xe,Me.data):N.texSubImage3D(be,xt,oe,ve,Ce,Ct,Ft,Pt,xe,Gt,Me):R.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,xt,oe,ve,Ct,Ft,xe,Gt,Me.data):R.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,xt,oe,ve,Me.width,Me.height,xe,Me.data):N.texSubImage2D(N.TEXTURE_2D,xt,oe,ve,Ct,Ft,xe,Gt,Me);N.pixelStorei(N.UNPACK_ROW_LENGTH,ue),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Je),N.pixelStorei(N.UNPACK_SKIP_PIXELS,yi),N.pixelStorei(N.UNPACK_SKIP_ROWS,Ze),N.pixelStorei(N.UNPACK_SKIP_IMAGES,es),xt===0&&k.generateMipmaps&&N.generateMipmap(be),J.unbindTexture()},this.initRenderTarget=function(R){pt.get(R).__webglFramebuffer===void 0&&St.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?St.setTextureCube(R,0):R.isData3DTexture?St.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?St.setTexture2DArray(R,0):St.setTexture2D(R,0),J.unbindTexture()},this.resetState=function(){E=0,A=0,C=null,J.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=fe._getDrawingBufferColorSpace(t),e.unpackColorSpace=fe._getUnpackColorSpace()}}class qg{camera;pitch=Ue.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new U;desired=new U;aspect=1;constructor(){this.camera=new jr(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=Ue.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const n=1-Math.pow(.001,t);this.focus.lerp(e,n),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,n=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*n*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*n*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,n){const s=Math.sin(this.yaw),o=Math.cos(this.yaw);return n.set(t*o-e*s,0,-t*s-e*o),n}}class Xg{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};ponteiro={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(Yg.has(e)||jg.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.surface.getBoundingClientRect();if(this.ponteiro.x=(t.clientX-e.left)/e.width*2-1,this.ponteiro.y=1-(t.clientY-e.top)/e.height*2,t.pointerId!==this.stickId)return;const n=60,s=Math.max(-n,Math.min(n,t.clientX-this.stickOrigin.x)),o=Math.max(-n,Math.min(n,t.clientY-this.stickOrigin.y));this.stickX=s/n,this.stickY=o/n};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};pointer(){return{x:this.ponteiro.x,y:this.ponteiro.y}}move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const n=Math.hypot(t,e);return n>1&&(t/=n,e/=n),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const Yg=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),jg=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF","KeyH","KeyI","Tab"]),xi=["cabeca","tronco","pernas","pes"],S={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,grassDry:11059802,dirt:12159572,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,brick:13068882,wallCream:15984595,wallMint:14085344,wallAzul:13624565,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,mesaVerde:3108695,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,roupaLa:14248826,roupaLaBarra:16180168,roupaListra:4882400,roupaListraManga:15987180,roupaJeans:4151942,roupaBota:16763213,roupaBotaCano:9067050,vestidoRosa:16176088,vestidoRenda:16644080,vestidoFita:15773373,maidPreto:2828851,maidCreme:16447214,maidFita:1512988,maidLacoVermelho:12727364,waRosa:15775432,waRosaForte:14250895,waEscuro:3880263,waBranco:16644853,waFivela:12170944,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578,pessego:16756838};let ci=null;function Jg(){if(!ci){const i=new Uint8Array([96,166,214,255]);ci=new gd(i,i.length,1,Nr),ci.minFilter=Ge,ci.magFilter=Ge,ci.generateMipmaps=!1,ci.needsUpdate=!0}return ci}const ol=new Map;function P(i,t={}){const e=`${i}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.offset??0}`,n=ol.get(e);if(n)return n;const s=new ph({color:i,gradientMap:Jg(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?mn:kn});return t.glow&&(s.emissive=new ae(i),s.emissiveIntensity=t.glow),t.offset&&(s.polygonOffset=!0,s.polygonOffsetFactor=-1,s.polygonOffsetUnits=-t.offset),ol.set(e,s),s}const al=new Map;function Vn(i,t=1){const e=`${i}|${t}`,n=al.get(e);if(n)return n;const s=new Ao({color:i,transparent:t<1,opacity:t,side:mn});return al.set(e,s),s}const rl=new Map;function cl(i){const t=rl.get(i);if(t)return t;const e=new ih({color:i});return rl.set(i,e),e}function pr(i="redonda",t=1,e=.5){const n=new ct,s=2.1*t,o=new x(new it(.13*t,.2*t,s,8),P(S.trunk));if(o.position.y=s/2,n.add(o),i==="pinheiro")for(let a=0;a<3;a++){const r=(1.1-a*.26)*t,c=new x(new We(r,1.3*t,9),P(a===0?S.leafDark:S.leafMid));c.position.y=s*.7+a*.72*t,n.add(c)}else if(i==="palmeira"){o.scale.y=1.5,o.position.y=s*.75;for(let a=0;a<7;a++){const r=a/7*Math.PI*2,c=new x(new zt(.75*t,8,6),P(S.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(r)*.85*t,s*1.5-.1,Math.sin(r)*.85*t),c.rotation.y=-r,c.rotation.z=-.32,n.add(c)}}else{const a=i==="florida"?S.flowerPink:S.leafMid;[[0,s+.55*t,0,1.15],[.62*t,s+.15*t,.2*t,.78],[-.5*t,s+.3*t,-.35*t,.88],[.1*t,s+1.05*t,-.3*t,.66]].forEach(([c,l,h,u],d)=>{const f=new x(new Rs(u*t,1),P(d%2===0?a:i==="florida"?S.flowerPink:S.leafLight));f.position.set(c,l,h),f.rotation.set(e*3,e*5,e*2),n.add(f)})}return n}function po(i=1,t=S.bush){const e=new ct;for(let n=0;n<3;n++){const s=new x(new Rs(.42*i,1),P(t));s.position.set((n-1)*.36*i,.3*i+(n===1?.12:0),n%2*.18*i),e.add(s)}return e}function mr(i=6,t=.9,e=[S.flowerPink,S.flowerYellow,16777215]){const n=new ct;for(let s=0;s<i;s++){const o=s/i*Math.PI*2+s*.7,a=t*(.35+s*37%100/140),r=new x(new it(.02,.02,.3,5),P(S.leafDark));r.position.set(Math.cos(o)*a,.15,Math.sin(o)*a),n.add(r);const c=new x(new zt(.09,8,6),P(e[s%e.length]));c.position.set(Math.cos(o)*a,.33,Math.sin(o)*a),c.scale.y=.7,n.add(c)}return n}function so(i=1,t=.5,e=10133670){const n=new ct,s=new Gr(.5*i,0),o=s.attributes.position;for(let r=0;r<o.count;r++){const c=o.getX(r),l=o.getY(r),h=o.getZ(r),u=Math.sin(Math.round(c*1e3)*12.9898+Math.round(l*1e3)*78.233+Math.round(h*1e3)*37.719+t*53.1)*43758.5453,d=1+(u-Math.floor(u)-.5)*.3;o.setXYZ(r,c*d,l*d,h*d)}s.computeVertexNormals();const a=new x(s,P(e));return a.position.y=.3*i*(.8+t*.4),a.rotation.set(t*6.28,t*4.1,t*2.2),a.scale.set(1+t*.3,.6+t*.4,1.1-t*.3),n.add(a),n}function ll(i=1,t=S.leafMid){const e=new ct,n=6;for(let s=0;s<n;s++){const o=s/n*Math.PI*2+s*.7,a=(.28+s*37%10/40)*i,r=new x(new We(.035*i,a,5),P(s%3===0?S.leafDark:s%3===1?t:S.grassDry));r.position.set(Math.cos(o)*.11*i,a*.45,Math.sin(o)*.11*i),r.rotation.set(Math.sin(o)*.35,0,Math.cos(o)*.35),e.add(r)}return e}function Zg(i=1.2,t=7){const e=new ct;for(let n=0;n<t;n++){const s=n/t*Math.PI*2+n*1.3,o=.06+n*53%10/55,a=i*(.7+n*29%10/22),r=new x(new it(.02,.028,a,5),P(n%2?S.leafDark:S.leafMid)),c=.12+n*17%10/60;if(r.position.set(Math.cos(s)*o,a/2,Math.sin(s)*o),r.rotation.set(Math.sin(s)*c,0,Math.cos(s)*c),e.add(r),n%3===0){const l=new x(new Fn(.045,a*.16,4,8),P(9071162));l.position.set(Math.cos(s)*(o+Math.cos(s)*c*a*.5),a*.97,Math.sin(s)*(o+Math.sin(s)*c*a*.5)),e.add(l)}}return e}function Kg(i=1,t=!0){const e=new ct;for(const[n,s,o]of[[0,0,.62],[.34,.2,.44]]){const a=new x(new zt(o*i,14,6,0,Math.PI*2,0,.5),P(S.leafLight));a.scale.y=.3,a.position.set(n*i,.03,s*i),e.add(a)}if(t){const n=new x(new zt(.08*i,8,6),P(S.flowerYellow));n.position.set(.16*i,.14*i,.08*i),e.add(n);for(let s=0;s<5;s++){const o=s/5*Math.PI*2,a=new x(new zt(.06*i,7,5),P(16773365));a.position.set(.16*i+Math.cos(o)*.08*i,.12*i,.08*i+Math.sin(o)*.08*i),a.scale.set(1.3,.6,1.3),e.add(a)}}return e}function $g(i=1.1,t=[S.flowerPink,S.flowerYellow,16777215,12160992],e=.5){const n=new ct,s=.24,o=new x(new it(i,i*1.05,s,18,1,!0),P(S.brick,{doubleSide:!0}));o.position.y=s/2,n.add(o);const a=new x(new ye(i,.05,6,20),P(S.wallCream));a.rotation.x=Math.PI/2,a.position.y=s,n.add(a);const r=new x(new it(i*.96,i*.96,.08,18),P(S.dirt));r.position.y=s-.03,n.add(r);const c=7;for(let l=0;l<c;l++){const h=l/c*Math.PI*2+e*6.28,u=i*(.25+(l*41+e*100)%10/18),d=t[l%t.length],f=Math.cos(h)*u,g=Math.sin(h)*u,_=new x(new zt(.2,8,6),P(S.leafDark));_.position.set(f,s+.06,g),_.scale.y=.55,n.add(_);for(let m=0;m<4;m++){const p=m/4*Math.PI*2+l,T=new x(new zt(.075,8,6),P(d));T.position.set(f+Math.cos(p)*.12,s+.16+(m+l)%3*.05,g+Math.sin(p)*.12),T.scale.y=.8,n.add(T)}}return n}function Qg(i=2.6){const t=new ct,e=P(S.metalWhite),n=.26,s=new x(new it(i*1.03,i*1.06,n,20),P(S.concrete));s.position.y=n/2,t.add(s);const o=new x(new zt(i,18,10,0,Math.PI*2,0,Math.PI/2),P(14676731,{opacity:.72,doubleSide:!0}));o.position.y=n,t.add(o);for(let h=0;h<8;h++){const u=new x(new ye(i,.045,5,20,Math.PI),e);u.rotation.set(0,h/8*Math.PI,0),u.position.y=n,t.add(u)}for(const h of[.34,.62,.85]){const u=i*Math.sqrt(Math.max(.02,1-h*h)),d=new x(new ye(u,.038,5,22),e);d.rotation.x=Math.PI/2,d.position.y=n+i*h,t.add(d)}for(const h of[0,1]){const u=new x(new ye(i,.09,6,18,Math.PI-.5),e);u.rotation.x=Math.PI/2,u.rotation.z=h?Math.PI+.25:.25,u.position.y=n+.04,t.add(u)}const a=new x(new zt(.16,10,8),e);a.position.y=n+i,t.add(a);for(let h=0;h<6;h++){const u=h/6*Math.PI*2+.3,d=i*.62,f=new x(new it(.05,.06,d,6),P(S.metalGrey));f.position.set(Math.cos(u)*i*.84,n+d/2,Math.sin(u)*i*.84),t.add(f)}const r=bh(S.wood);r.scale.setScalar(.72),r.position.set(0,n,-i*.35),r.rotation.y=.25,t.add(r);const c=new x(new it(.26,.2,.36,10),P(S.plantPot));c.position.set(i*.4,n+.18,i*.35),t.add(c);const l=new x(new Rs(.34,0),P(S.leafMid));return l.position.set(i*.4,n+.55,i*.35),t.add(l),t}function bh(i=S.wood){const t=new ct,e=new x(new G(1.9,.1,.55),P(i));e.position.y=.48,t.add(e);const n=new x(new G(1.9,.5,.09),P(i));n.position.set(0,.76,-.25),n.rotation.x=-.16,t.add(n);for(const s of[-1,1]){const o=new x(new G(.1,.48,.5),P(S.metalGrey));o.position.set(s*.78,.24,0),t.add(o)}return t}function fa(i=!1){const t=new ct,e=new x(new it(.07,.09,3.4,8),P(S.metalGrey));e.position.y=1.7,t.add(e);const n=new x(new zt(.3,12,10,0,Math.PI*2,0,Math.PI*.62),P(S.metalWhite));n.position.y=3.45,n.rotation.x=Math.PI,t.add(n);const s=new x(new zt(.2,10,8),P(i?S.gold:15263968,{glow:i?.9:0}));return s.position.y=3.32,t.add(s),t}function hl(){const i=new ct,t=new x(new it(.28,.24,.75,10),P(5208650));t.position.y=.38,i.add(t);const e=new x(new ye(.29,.04,6,14),P(S.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,i.add(e),i}function tv(){const i=new ct,t=new x(new G(1.9,.1,1),P(S.wood));t.position.y=.76,i.add(t);for(const e of[-1,1]){const n=new x(new G(.1,.76,.9),P(S.woodDark));n.position.set(e*.75,.38,0),i.add(n);const s=new x(new G(1.9,.08,.34),P(S.wood));s.position.set(0,.45,e*.78),i.add(s);const o=new x(new G(1.6,.45,.08),P(S.woodDark));o.position.set(0,.22,e*.78),i.add(o)}return i}function Dn(i=4,t=1.1,e=S.metalGrey){const n=new ct,s=Math.max(2,Math.round(i/1.2));for(let o=0;o<=s;o++){const a=new x(new it(.05,.05,t,6),P(e));a.position.set(-i/2+o/s*i,t/2,0),n.add(a)}for(const o of[t*.35,t*.8]){const a=new x(new G(i,.06,.06),P(e));a.position.y=o,n.add(a)}return n}function ev(i=S.wood,t=S.metalWhite){const e=new ct,n=new x(new it(.06,.06,1.6,6),P(S.woodDark));n.position.y=.8,e.add(n);const s=new x(new G(1.1,.7,.08),P(i));s.position.y=1.5,e.add(s);const o=new x(new G(.85,.12,.02),P(t));return o.position.set(0,1.62,.05),e.add(o),e}function wh(i=1){const t=new ct,e=Vn(16777215,.92),n=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[s,o,a,r]of n){const c=new x(new zt(r*i,10,8),e);c.position.set(s*i,o*i,a*i),t.add(c)}return t}function nv(i,t,e,n){const s=new ct,o=9,a=i/o,r=.35,c=1.15,l=new ct;l.rotation.z=Math.PI/2;for(let d=0;d<o;d++){const f=new x(new it(t,t,a*1.02,10,1,!0,r,c),P(d%2===0?e:n,{doubleSide:!0}));f.position.y=-i/2+a*(d+.5),l.add(f)}s.add(l);const h=Math.sin(r)*t,u=Math.cos(r)*t;for(let d=0;d<o;d++){const f=new x(new zt(a*.36,8,6),P(d%2===0?e:n));f.position.set(-i/2+a*(d+.5),h-a*.2,u),f.scale.set(1,1.15,.7),s.add(f)}return s}function gr(i=S.fabricRed,t={}){const e=new ct,n=t.tipo??"simples",s=S.wallCream,o=P(S.wood),a=P(S.woodDark),r=new x(new G(2.8,.16,1.9),a);r.position.y=.08,e.add(r);const c=new x(new G(2.35,1.7,1.4),P(s));c.position.set(0,1.01,-.05),e.add(c);for(const w of[-1,1]){const M=new x(new G(.26,1.7,.14),o);M.position.set(w*1.045,1.01,.68),e.add(M)}const l=new x(new G(2.35,.22,.14),o);l.position.set(0,1.75,.68),e.add(l);const h=new x(new G(1.82,.44,.06),P(5981750));h.position.set(0,1.42,.66),e.add(h);const u=new x(new G(2.5,.14,.78),o);u.position.set(0,1.12,.94),e.add(u);const d=new x(new it(.075,.075,2.5,10),a);d.rotation.z=Math.PI/2,d.position.set(0,1.12,1.32),e.add(d);for(const w of[-1,1]){const M=new x(new it(.05,.05,1.05,8),P(S.metalWhite));M.position.set(w*1.18,.6,1.24),e.add(M)}const f=new x(new G(2.55,.16,1.55),a);f.position.set(0,1.94,-.05),e.add(f);const g=nv(2.5,.44,i,s);g.position.set(0,1.54,.62),e.add(g);const _=t.texto??(n==="sorvete"?"Sorvete":n==="suco"?"Sucos":""),m=new x(new G(1.75,.5,.12),P(i));m.position.set(0,2.3,-.05),e.add(m);const p=new x(new G(1.9,.62,.08),P(s));if(p.position.set(0,2.3,-.09),e.add(p),_){const w=Zr(_,1.5,.34);w.position.set(0,2.3,.02),e.add(w)}if(n==="sorvete"){const w=xr(S.morango);w.scale.setScalar(2.6),w.position.set(0,2.78,-.05),e.add(w);const M=new x(new G(1.24,.16,.56),P(S.metalWhite));M.position.set(-.58,1.26,1.06),e.add(M),[S.morango,S.maracuja,S.chocolate].forEach((E,A)=>{const C=new x(new it(.15,.13,.22,10),P(S.metalWhite));C.position.set(-1+A*.36,1.29,1.06),e.add(C);const y=new x(new zt(.14,10,8),P(E));y.position.set(-1+A*.36,1.42,1.06),y.scale.y=.8,e.add(y)});for(let E=0;E<3;E++){const A=new x(new We(.1,.3,10),P(14197852));A.position.set(.72,1.34+E*.07,1.04+E*.02),A.rotation.x=Math.PI,e.add(A)}}else if(n==="suco"){const w=new x(new zt(.32,12,10),P(S.laranja));w.position.set(0,2.85,-.05),e.add(w);const M=new x(new zt(.13,8,6),P(S.leafMid));M.position.set(.14,3.12,-.05),M.scale.set(1.5,.4,.8),M.rotation.z=.5,e.add(M),[S.laranja,S.limao].forEach((v,D)=>{const F=new x(new it(.15,.14,.42,12,1,!0),P(S.glass,{opacity:.45,doubleSide:!0}));F.position.set(-.78+D*.42,1.4,1.06),e.add(F);const z=new x(new it(.13,.12,.28,12),P(v));z.position.set(-.78+D*.42,1.33,1.06),e.add(z);const q=new x(new it(.025,.025,.12,6),P(S.metalGrey));q.position.set(-.78+D*.42,1.26,1.2),q.rotation.x=Math.PI/2,e.add(q)});const E=new x(new it(.22,.17,.12,12),P(S.plantPot));E.position.set(.42,1.25,1.06),e.add(E);const A=[[.32,1.34,1.03,S.laranja],[.52,1.34,1.08,S.limao],[.42,1.4,1.05,S.morango]];for(const[v,D,F,z]of A){const q=new x(new zt(.1,10,8),P(z));q.position.set(v,D,F),e.add(q)}const C=new x(new it(.09,.07,.2,10),P(s));C.position.set(.95,1.29,1.06),e.add(C),[S.morango,S.limao,S.fabricBlue].forEach((v,D)=>{const F=new x(new it(.014,.014,.34,6),P(v));F.position.set(.93+D*.03,1.44,1.06-D*.02),F.rotation.z=(D-1)*.18,e.add(F)})}const T=new x(new G(.06,.62,.5),P(3551276));T.position.set(1.2,1.3,.15),e.add(T);for(let w=0;w<3;w++){const M=new x(new G(.02,.045,.3-w*.06),P(s));M.position.set(1.24,1.46-w*.16,.15),e.add(M)}return e}function vr(i=4,t=6,e=4,n=S.wallCream,s=S.roofTile,o=S.glass){const a=new ct,r=new x(new G(i,t,e),P(n));r.position.y=t/2,a.add(r);const c=new x(new G(i+.3,.35,e+.3),P(s));c.position.y=t+.17,a.add(c);const l=Math.max(1,Math.floor(i/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let u=0;u<h;u++)for(let d=0;d<l;d++){const f=new x(new G(.65,.8,.06),P(o,{glow:.15})),g=-i/2+i/l*(d+.5),_=.9+t/h*u;f.position.set(g,_,e/2+.02),a.add(f);const m=f.clone();m.position.z=-e/2-.02,a.add(m)}return a}function iv(i=S.mesaVerde){const t=new ct,e=2.6,n=1.4,s=.76,o=P(16054261),a=new x(new G(e,.06,n),P(i));a.position.y=s,t.add(a);for(const l of[-n/2+.05,n/2-.05,0]){const h=new x(new G(e-.02,.008,.05),o);h.position.set(0,s+.032,l),t.add(h)}for(const l of[-e/2+.04,e/2-.04]){const h=new x(new G(.05,.008,n-.02),o);h.position.set(l,s+.032,0),t.add(h)}const r=new x(new G(.03,.19,n+.16),P(16514556,{opacity:.72,doubleSide:!0}));r.position.y=s+.13,t.add(r);const c=new x(new G(.045,.035,n+.18),P(16777215));c.position.y=s+.225,t.add(c);for(const l of[-1.5599999999999998/2,(n+.16)/2]){const h=new x(new it(.022,.022,.24,8),P(S.metalGrey));h.position.set(0,s+.12,l),t.add(h)}for(const l of[-e/2+.22,e/2-.22]){for(const u of[-n/2+.18,n/2-.18]){const d=new x(new it(.035,.045,s,8),P(S.metalGrey));d.position.set(l,s/2,u),t.add(d)}const h=new x(new G(.05,.05,n-.36),P(S.metalGrey));h.position.set(l,s*.35,0),t.add(h)}return t}function Eh(){const i=new x(new zt(.055,12,10),P(16775398,{glow:.12}));return i.castShadow=!0,i}function bo(i=S.metalRed){const t=new ct,e=new x(new it(.17,.17,.035,20),P(i));e.rotation.x=Math.PI/2,t.add(e);const n=new x(new it(.185,.185,.022,20),P(S.wood));n.rotation.x=Math.PI/2,t.add(n);const s=new x(new Fn(.035,.16,4,8),P(S.woodDark));return s.position.y=-.25,t.add(s),t.traverse(o=>{const a=o;a.isMesh&&(a.castShadow=!0)}),t}function Th(i=S.frisbee){const t=new x(new it(.28,.24,.07,20),P(i));return t.castShadow=!0,t}function Ah(i=1){const t=new ct,e=P(S.heart,{glow:.35});for(const s of[-1,1]){const o=new x(new zt(.16*i,10,8),e);o.position.set(s*.13*i,.1*i,0),t.add(o)}const n=new x(new We(.22*i,.34*i,10),e);return n.position.y=-.1*i,n.rotation.x=Math.PI,t.add(n),t}function pa(i=16184040){const t=new ct,e=new x(new zt(.22,10,8),P(i));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const n=new x(new it(.06,.08,.24,8),P(i));n.position.set(0,.28,.14),t.add(n);const s=new x(new zt(.11,10,8),P(i));s.position.set(0,.4,.16),t.add(s);const o=new x(new We(.05,.14,6),P(S.gold));return o.position.set(0,.39,.28),o.rotation.x=Math.PI/2,t.add(o),t}function _r(i=S.wallCream){const t=new ct;t.userData.patins=!0;const e=.045,n=new x(new G(.13,.15,.26),P(i));n.position.set(0,e*2+.115,.01),t.add(n);const s=new x(new G(.125,.13,.15),P(i));s.position.set(0,e*2+.25,-.04),t.add(s);const o=new x(new G(.135,.04,.13),P(S.frisbee));o.position.set(0,e*2+.235,.02),t.add(o);const a=new x(new G(.1,.05,.28),P(S.metalGrey));a.position.set(0,e*2+.015,.01),t.add(a);for(const r of[-1,1])for(const c of[-1,1]){const l=new x(new it(e,e,.035,10),P(S.frisbee));l.rotation.z=Math.PI/2,l.position.set(r*.062,e,.01+c*.095),t.add(l)}return t}function sv(i=S.fabricBlue){const t=new ct,e=7.4,n=4.4,s=2.9,o=P(S.wallCream),a=P(S.wood),r=P(S.woodDark),c=P(S.metalWhite),l=new x(new G(e+1.6,.18,n+1.4),P(S.concrete));l.position.set(.4,.09,.3),t.add(l);const h=new x(new G(e,s,.26),o);h.position.set(0,.18+s/2,-n/2),t.add(h);for(const v of[-1,1]){const D=new x(new G(.26,s,n),o);D.position.set(v*(e/2-.13),.18+s/2,0),t.add(D)}const u=new x(new G(e,.6,.3),r);u.position.set(0,.48,n/2-.1),t.add(u);const d=P(S.glass,{opacity:.5,doubleSide:!0}),f=3,g=e-.5,_=g/f-.16;for(let v=0;v<f;v++){const D=-g/2+g/f*(v+.5),F=new x(new G(_,1.75,.08),d);F.position.set(D,1.68,n/2-.1),t.add(F)}for(let v=0;v<=f;v++){const D=-g/2+g/f*v,F=new x(new G(.14,2.05,.22),c);F.position.set(D,1.68,n/2-.1),t.add(F)}const m=new x(new G(e,.18,.24),c);m.position.set(0,2.68,n/2-.1),t.add(m);for(const[v,D]of[[1.15,[S.morango,S.fabricBlue,S.gold]],[1.95,[S.maracuja,S.wallCream]]]){const F=new x(new G(e-1.2,.1,.6),a);F.position.set(0,v,n/2-.75),t.add(F),D.forEach((z,q)=>{const Y=new ct;for(const Z of[-1,1]){const et=_r(z);et.position.x=Z*.09,Y.add(et)}Y.scale.setScalar(.8),Y.position.set((q-(D.length-1)/2)*1.5,v+.05,n/2-.75),Y.rotation.y=.3,t.add(Y)})}const p=new x(new G(e+1.1,.24,n+1.3),r);p.position.set(0,s+.42,.35),p.rotation.x=-.07,t.add(p);const T=new x(new G(e+1.34,.08,n+1.54),c);T.position.set(0,s+.29,.35),T.rotation.x=-.07,t.add(T);const w=new x(new G(e+1.34,.74,.22),P(i));w.position.set(0,s+.46,n/2+1.18),t.add(w);const M=Zr("Patins",3.2,.46);M.position.set(0,s+.46,n/2+1.31),t.add(M);for(const v of[-1,1]){const D=new x(new it(.09,.09,s+.3,8),c);D.position.set(v*(e/2+.35),(s+.3)/2,n/2+.62),t.add(D)}const I=e/2+.95,E=new x(new G(1.15,.16,3),a);E.position.set(I,1.06,.2),t.add(E);const A=new x(new it(.08,.08,3,10),r);A.position.set(I+.55,1.06,.2),t.add(A);const C=new x(new G(.9,.9,2.8),o);C.position.set(I-.1,.6,.2),t.add(C);const y=new x(new G(1.7,.16,3.2),P(i));y.position.set(I+.1,2.35,.2),t.add(y);for(const v of[-1.2,1.5]){const D=new x(new it(.07,.07,2.35,8),c);D.position.set(I+.6,1.17,.2+v),t.add(D)}return[S.morango,S.gold].forEach((v,D)=>{const F=new ct;for(const z of[-1,1]){const q=_r(v);q.position.x=z*.09,F.add(q)}F.position.set(I,1.14,-.55+D*1.4),F.rotation.y=Math.PI/2+.2,t.add(F)}),t}function ul(){const i=new ct,t=new x(new G(.34,.05,.34),P(S.frisbee));t.position.y=.025,i.add(t);const e=new x(new We(.15,.45,10),P(S.frisbee));e.position.y=.26,i.add(e);const n=new x(new it(.1,.12,.09,10),P(16777215));return n.position.y=.28,i.add(n),i}function ov(i,t,e=1.5){const n=new ct,s=P(10475752),o=.12,a=new x(new G(i,o,t),P(4165552));a.position.y=-e,a.receiveShadow=!0,n.add(a);for(const[r,c,l,h]of[[i,o,0,-t/2],[i,o,0,t/2],[o,t,-i/2,0],[o,t,i/2,0]]){const u=new x(new G(r,e,c),s);u.position.set(l,-e/2,h),u.receiveShadow=!0,n.add(u)}for(const[r,c,l,h]of[[i+.3,.18,0,-t/2-.12],[i+.3,.18,0,t/2+.12],[.18,t+.3,-i/2-.12,0],[.18,t+.3,i/2+.12,0]]){const u=new x(new G(r,.06,c),P(4951989));u.position.set(l,.02,h),n.add(u)}return n}function av(i,t){const e=new x(new on(i,t,12,8),new ph({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function dl(i=S.fabricBlue){const t=new ct,e=new x(new G(.68,.07,1.7),P(S.metalWhite));e.position.y=.36,t.add(e);const n=new x(new G(.6,.06,1.5),P(i));n.position.y=.42,t.add(n);const s=new x(new G(.6,.06,.7),P(i));s.position.set(0,.6,-.75),s.rotation.x=-.75,t.add(s);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new x(new it(.035,.035,.36,6),P(S.metalWhite));r.position.set(o*.3,.18,a*.72),t.add(r)}return t}function fl(i=S.fabricRed){const t=new ct,e=new x(new it(.32,.36,.12,12),P(S.concrete));e.position.y=.06,t.add(e);const n=new x(new it(.045,.045,2.4,8),P(S.wood));n.position.y=1.2,t.add(n);const s=new x(new We(1.15,.5,12),P(i));s.position.y=2.35,t.add(s);const o=new x(new We(1.17,.18,12,1,!0),P(16777215,{doubleSide:!0}));o.position.y=2.2,t.add(o);const a=new x(new zt(.07,8,6),P(S.gold));return a.position.y=2.62,t.add(a),t}function rv(){const i=new ct;for(const t of[-.24,.24]){const e=new x(new ye(.22,.035,6,14,Math.PI),P(S.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),i.add(e);const n=new x(new it(.035,.035,1.5,8),P(S.metalGrey));n.position.set(t,.05,-.44),i.add(n)}for(let t=0;t<3;t++){const e=new x(new G(.5,.05,.1),P(S.metalGrey));e.position.set(0,-.15-t*.34,-.44),i.add(e)}return i}function ma(i=S.frisbee){const t=new ct,e=new x(new ye(.42,.16,10,20),P(i));e.rotation.x=Math.PI/2,t.add(e);for(let n=0;n<4;n++){const s=n/4*Math.PI*2+Math.PI/4,o=new x(new ye(.42,.165,10,6,Math.PI/5),P(16777215));o.rotation.set(Math.PI/2,0,s),t.add(o)}return t}function cv(){const i=new ct,t=new x(new it(.22,.26,.1,12),P(S.concrete));t.position.y=.05,i.add(t);const e=new x(new it(.05,.05,2.2,8),P(S.metalGrey));e.position.y=1.1,i.add(e);const n=new x(new G(.5,.07,.07),P(S.metalGrey));n.position.set(.22,2.16,0),i.add(n);const s=new x(new it(.16,.12,.1,12),P(S.metalWhite));return s.position.set(.44,2.08,0),i.add(s),i}function lv(){const i=new ct,t=new x(new G(.7,.8,.7),P(S.concrete));t.position.y=.4,i.add(t);const e=new x(new G(.62,.1,2.4),P(15791350));e.position.set(0,.85,1),i.add(e);for(const n of[-.36,.36]){const s=new x(new ye(.35,.04,6,14,Math.PI),P(S.metalGrey));s.position.set(n,.9,.1),s.rotation.set(0,Math.PI/2,0),i.add(s)}return i}function xr(i=S.flowerPink){const t=new ct,e=new x(new We(.075,.22,10),P(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const n=new x(new zt(.085,10,8),P(i));n.position.y=.13,t.add(n);const s=new x(new zt(.06,8,7),P(i));return s.position.set(.03,.22,-.02),t.add(s),t}function pl(i=S.laranja){const t=new ct;t.userData.suco=!0;const e=new x(new it(.088,.062,.26,12),P(i));e.position.y=.13,t.add(e);const n=new x(new it(.095,.09,.035,12),P(16645110));n.position.y=.25,t.add(n);const s=new x(new it(.066,.066,.025,12),P(16645110));s.position.y=.012,t.add(s);const o=new x(new it(.012,.012,.32,6),P(16645110));o.position.set(.04,.31,.014),o.rotation.z=-.34,t.add(o);const a=new x(new it(.052,.052,.014,10),P(S.gold));return a.position.set(-.085,.26,0),a.rotation.x=Math.PI/2,a.rotation.z=.3,t.add(a),t}function ml(i=S.metalGrey){const t=new ct,e=new x(new it(.07,.09,1.5,10),P(i));e.position.y=.75,t.add(e);const n=new x(new it(.52,.38,.42,14,1,!0),P(i));n.position.y=1,t.add(n);const s=new x(new ye(.62,.045,6,20),P(i));s.position.y=1.72,s.rotation.x=Math.PI/2,t.add(s);const o=new x(new it(.1,.1,.3,8),P(i));o.position.y=1.9,t.add(o);for(let a=0;a<10;a++){const r=a/10*Math.PI*2,c=new x(new it(.015,.015,.62,4),P(13226198));c.position.set(Math.cos(r)*.5,1.4,Math.sin(r)*.5),t.add(c)}return t}function hv(){const i=new ct;for(const n of[-.8,.8]){const s=new x(new G(.12,1.5,.12),P(S.woodDark));s.position.set(n,.75,0),i.add(s)}const t=new x(new G(2,1.2,.12),P(S.wood));t.position.y=2,i.add(t);const e=new x(new G(1.8,.22,.03),P(S.frisbee));e.position.set(0,2.45,.08),i.add(e);for(const n of[-.45,.45]){const s=new x(new G(.55,.6,.03),P(2830136));s.position.set(n,1.9,.08),i.add(s)}return i}function uv(i=4){const t=new ct;for(let e=0;e<3;e++){const n=new x(new G(i,.16,.5),P(e%2===0?S.metalWhite:S.metalGrey));n.position.set(0,.25+e*.34,-e*.5),t.add(n);const s=new x(new G(i,.25+e*.34,.1),P(S.metalGrey));s.position.set(0,(.25+e*.34)/2,-e*.5-.2),t.add(s)}return t}function dv(){const i=new ct,t=new x(new G(.42,.95,.36),P(S.concrete));t.position.y=.48,i.add(t);const e=new x(new it(.17,.14,.12,12),P(S.metalWhite));e.position.set(0,1,.05),i.add(e);const n=new x(new it(.03,.03,.16,8),P(S.metalGrey));return n.position.set(0,1.12,-.06),n.rotation.x=.5,i.add(n),i}function fv(){const i=new ct,t=new x(new G(.5,.4,.34),P(4871528));t.position.y=.2,i.add(t);const e=new x(new ye(.16,.028,6,14,Math.PI),P(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,i.add(e),[S.frisbee,6271190,16767070].forEach((s,o)=>{const a=new x(new it(.2,.18,.05,16),P(s));a.position.set(.34+o*.02,.06+o*.06,.22),a.rotation.z=.12,i.add(a)}),i}function pv(){const i=new ct,t=new x(new it(.1,.14,5.5,8),P(S.metalGrey));t.position.y=2.75,i.add(t);const e=new x(new G(.9,.1,.1),P(S.metalGrey));e.position.set(.35,5.5,0),i.add(e);for(const n of[.1,.6]){const s=new x(new G(.42,.3,.22),P(3883600));s.position.set(n,5.62,0),s.rotation.z=-.35,i.add(s);const o=new x(new G(.36,.24,.03),P(16773324,{glow:.25}));o.position.set(n+.04,5.52,0),o.rotation.z=-.35,i.add(o)}return i}function mv(){const i=new ct,t=new x(new it(.05,.06,3,8),P(S.metalGrey));t.position.y=1.5,i.add(t);const e=new ct;return e.position.y=2.9,[S.frisbee,16777215,S.frisbee,16777215].forEach((s,o)=>{const a=.26-o*.04,r=.22-o*.04,c=new x(new it(a,r,.3,12,1,!0),P(s,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+o*.3,e.add(c)}),i.add(e),i.userData.manga=e,i}function Zr(i,t,e,n="#ffffff"){const s=document.createElement("canvas");s.width=384,s.height=Math.max(64,Math.round(384*e/t));const o=s.getContext("2d");o&&(o.clearRect(0,0,s.width,s.height),o.fillStyle=n,o.font=`bold ${Math.round(s.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(i,s.width/2,s.height/2+4));const a=new yd(s);return a.colorSpace=nn,new x(new on(t,e),new Ao({map:a,transparent:!0}))}function gl(i,t=S.fabricBlue,e="#ffffff"){const n=new ct,s=new x(new it(.08,.08,2.4,8),P(S.metalGrey));s.position.y=1.2,n.add(s);const o=2.1,a=.9,r=new x(new G(o,a,.1),P(t));r.position.y=2.45,n.add(r);const c=new x(new G(o+.12,a+.12,.06),P(S.metalWhite));c.position.set(0,2.45,-.03),n.add(c);const l=Zr(i,o*.86,a*.68,e);return l.position.set(0,2.45,.06),n.add(l),n}function gv(i=4161494){const t=new ct,e=8.4,n=2.6,s=2.5,o=new x(new G(e,n,s),P(i));o.position.y=1.55,t.add(o);const a=new x(new G(e-.2,.22,s-.15),P(S.metalWhite));a.position.y=2.9,t.add(a);const r=new x(new G(e+.04,.3,s+.04),P(S.metalWhite));r.position.y=.6,t.add(r);for(const h of[s/2+.02,-s/2-.02])for(let u=0;u<4;u++){const d=new x(new G(1.5,.9,.05),P(S.glass,{glow:.12}));d.position.set(-e/2+1.4+u*1.85,2.1,h),t.add(d)}for(const[h,u]of[[e/2+.02,0],[-e/2-.02,0]]){const d=new x(new G(.05,1.1,s-.5),P(S.glass,{glow:.12}));d.position.set(h,2.1,0),d.rotation.y=u,t.add(d)}const c=new x(new G(.06,1.9,1),P(2831424));c.position.set(e/2-1.6,1.2,s/2+.02),t.add(c);const l=new x(new G(1.6,.34,.05),P(2040361));l.position.set(e/2-.4,2.75,s/2+.02),t.add(l);for(const[h,u]of[[e/2-1.9,s/2],[e/2-1.9,-s/2],[-e/2+1.6,s/2],[-e/2+1.6,-s/2]]){const d=new x(new it(.55,.55,.35,14),P(2237482));d.position.set(h,.5,u),d.rotation.x=Math.PI/2,t.add(d);const f=new x(new it(.24,.24,.38,12),P(S.metalGrey));f.position.set(h,.5,u),f.rotation.x=Math.PI/2,t.add(f)}return t}function vv(i=S.metalGrey){const t=new ct;for(const o of[-1.5,1.5]){const a=new x(new it(.07,.07,2.5,8),P(i));a.position.set(o,1.25,-.6),t.add(a)}const e=new x(new G(3.6,.12,1.6),P(i));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const n=new x(new G(3.6,1.6,.08),P(S.glass,{glow:.08}));n.position.set(0,1.35,-1.15),t.add(n);const s=new x(new G(3,.1,.4),P(S.wood));s.position.set(0,.5,-.9),t.add(s);for(const o of[-1.2,1.2]){const a=new x(new G(.08,.5,.36),P(i));a.position.set(o,.25,-.9),t.add(a)}return t}function _v(i){const t=new ct,e=i.headR,n=e*1.07,s=Math.PI*.54,o=e*.06,a=new x(new zt(n,18,12,0,Math.PI*2,0,s),P(S.roupaLa));a.position.y=o,a.scale.y=1.16,t.add(a);const r=o+n*Math.cos(s)*1.16,c=n*Math.sin(s),l=new x(new it(c*1.03,c*1.03,e*.26,18),P(S.roupaLaBarra));l.position.y=r,t.add(l);const h=new x(new zt(e*.2,10,8),P(S.roupaLaBarra));return h.position.y=o+n*1.16,t.add(h),t}function xv(i){const t=new ct,e=new x(new it(i.h*.05*i.w,i.h*.055*i.w,i.h*.08,12),P(S.roupaBotaCano));e.position.y=-i.legH+i.h*.075,t.add(e);const n=new x(new it(i.h*.058*i.w,i.h*.058*i.w,i.h*.018,12),P(S.roupaBota));return n.position.y=-i.legH+i.h*.113,t.add(n),t}function Bn(i,t,e=t){const n=new ct;for(const o of[-1,1]){const a=new x(new zt(i*.86,9,7),P(t));a.position.x=o*i*.86,a.scale.set(1.05,.72,.42),n.add(a);const r=new x(new G(i*.34,i*1.5,i*.14),P(t));r.position.set(o*i*.42,-i*.95,0),r.rotation.z=o*.32,n.add(r)}const s=new x(new zt(i*.3,8,6),P(e));return s.scale.z=.7,n.add(s),n}function Zn(i,t,e,n=.85){const s=new ct,o=P(e),a=t*.6,r=Math.max(8,Math.ceil(2*Math.PI*i/(a*1.25)));for(let c=0;c<r;c++){const l=c/r*Math.PI*2,h=new x(new zt(a,7,6),o);h.position.set(Math.sin(l)*i,0,Math.cos(l)*i*n),h.scale.set(1,.88,.34),h.rotation.y=l,s.add(h)}return s}function vl(i,t,e,n=3){const s=new ct,o=P(e),a=t/n,r=Math.hypot(i,a);for(let c=0;c<n;c++)for(const l of[-1,1]){const h=new x(new G(r,t*.07,t*.05),o);h.position.y=-t/2+a*(c+.5),h.rotation.z=l*Math.atan2(a,i),s.add(h)}return s}function Ch(i,t){const e=new x(new zt(i,12,10),P(t));return e.scale.set(1,.82,.92),e}function Mv(i){const t=new ct,{h:e,w:n}=i,s=i.legH,o=e*.105*n,a=.85,r=P(S.vestidoRosa),c=P(S.vestidoRenda,{doubleSide:!0}),l=P(S.vestidoFita),h=new x(new it(o*1.1,o*1.06,e*.035,18,1,!0),c);h.position.y=s+i.torsoH*.78,h.scale.z=a,t.add(h);for(const M of[-1,1]){const I=new x(new ye(e*.042*n,e*.016,6,14),c);I.position.set(M*e*.1*n,s+i.torsoH*.84,0),I.rotation.set(Math.PI/2,0,M*.3),I.scale.z=.8,t.add(I)}const u=Bn(e*.04,S.vestidoFita,S.vestidoRenda);u.position.set(0,s+i.torsoH*.62,o*.9),t.add(u);const d=new x(new it(o*1.08,o*1.08,e*.03,18,1,!0),l);d.position.y=s+i.torsoH*.16,d.scale.z=a,t.add(d);const f=Bn(e*.036,S.vestidoRosa,S.vestidoFita);f.position.set(0,s+i.torsoH*.14,o*.92),t.add(f);const g=s+i.torsoH*.1,_=s-e*.13,m=o*2,p=new x(new it(o*1.02,m*.82,g-_-e*.05,20,1,!0),r);p.position.y=(g+_+e*.05)/2,p.scale.z=a,t.add(p);const T=new x(new it(m*.78,m,e*.08,20,1,!0),r);T.position.y=_+e*.04,T.scale.z=a,t.add(T);const w=new x(new it(m*1.04,m*1.12,e*.032,20,1,!0),c);w.position.y=_,w.scale.z=a,t.add(w);for(const M of[-.9,0,.9]){const I=Bn(e*.022,S.vestidoFita,S.vestidoRenda);I.position.set(Math.sin(M)*m*.92,_+e*.055,Math.cos(M)*m*.92*a),I.rotation.y=M,t.add(I)}return t}function yv(i){const t=new ct,{h:e,w:n}=i,s=i.legH,o=e*.105*n,a=s+i.torsoH*.86,r=e*.1*n,c=.85,l=P(S.maidCreme),h=P(S.maidCreme,{doubleSide:!0}),u=P(S.maidFita),d=s+i.torsoH*.12,f=s-e*.14,g=o*2,_=new x(new it(o*1.04,g,d-f,20,1,!0),P(S.maidPreto,{doubleSide:!0}));_.position.y=(d+f)/2,_.scale.z=c,t.add(_);const m=new x(new it(g*1.01,g*1.06,e*.038,20,1,!0),h);m.position.y=f+e*.016,m.scale.z=c,t.add(m);const p=Zn(g*1.04,e*.03,S.maidCreme,c);p.position.y=f-e*.008,t.add(p);const T=s+i.torsoH*.16,w=s-e*.045,M=new x(new it(o*1.06,g*.86,T-w,16,1,!0,-1.15,2.3),h);M.position.y=(T+w)/2,M.scale.z=c,t.add(M);const I=Zn(g*.88,e*.034,S.maidCreme,c);I.position.y=w,t.add(I);const E=s+i.torsoH*.2,A=new x(new it(o*1.1,o*1.1,e*.055,18,1,!0),h);A.position.y=E,A.scale.z=c,t.add(A);for(const z of[-1,1]){const q=vl(e*.03,e*.045,S.maidFita,3);q.position.set(z*o*.5,E,o*.92),t.add(q);const Y=Bn(e*.017,S.maidFita);Y.position.set(z*o*.5,E-e*.028,o*.96),t.add(Y)}for(const z of[-1,1]){const q=new x(new G(e*.055*n,a-E,e*.02),l);q.position.set(z*o*.62,(a+E)/2,o*.7),q.rotation.y=-z*.5,t.add(q);const Y=new x(new G(e*.022*n,a-E,e*.03),h);Y.position.set(z*o*.98,(a+E)/2,o*.4),Y.rotation.y=-z*.95,t.add(Y)}const C=new x(new G(o*.9,i.torsoH*.24,e*.014),l);C.position.set(0,s+i.torsoH*.4,o*.8),t.add(C);const y=vl(o*.55,i.torsoH*.2,S.maidFita,4);y.position.set(0,s+i.torsoH*.4,o*.87),t.add(y);const v=s+i.torsoH*.68;for(const z of[-1,1]){const q=new x(new G(e*.1*n,i.torsoH*.46,e*.012),l);q.position.set(z*e*.06*n,v,o*.82),q.rotation.z=z*.34,t.add(q);const Y=new x(new G(e*.007,i.torsoH*.4,e*.006),u);Y.position.set(z*e*.088*n,v+i.torsoH*.02,o*.88),Y.rotation.z=z*.34,t.add(Y);const Z=new x(new G(e*.075*n,e*.012,o*1.5),l);Z.position.set(z*r*.86,a+e*.012,0),Z.rotation.z=z*.16,t.add(Z)}const D=new x(new G(e*.24*n,i.torsoH*.36,e*.014),l);D.position.set(0,s+i.torsoH*.74,-o*.8),t.add(D);const F=new x(new G(e*.24*n,e*.011,e*.006),u);F.position.set(0,s+i.torsoH*.57,-o*.87),t.add(F);for(const z of[-1,1]){const q=Ch(e*.055*n,S.maidCreme);q.position.set(z*r,a-e*.012,0),t.add(q)}return t}function Sv(i){const t=new ct,{h:e,w:n}=i,s=i.legH,o=e*.105*n,a=s+i.torsoH*.86,r=e*.1*n,c=.85,l=P(S.maidCreme),h=P(S.maidCreme,{doubleSide:!0}),u=P(S.maidFita),d=s+i.torsoH*.12,f=s-e*.14,g=o*2,_=new x(new it(o*1.04,g,d-f,20,1,!0),P(S.maidPreto,{doubleSide:!0}));_.position.y=(d+f)/2,_.scale.z=c,t.add(_);const m=Zn(g*1.02,e*.036,S.maidPreto,c);m.position.y=f+e*.004,t.add(m);const p=s+i.torsoH*.26,T=s-e*.055,w=new x(new it(o*1.04,g*.9,p-T,16,1,!0,-1.2,2.4),h);w.position.y=(p+T)/2,w.scale.z=c,t.add(w);const M=Zn(g*.92,e*.036,S.maidCreme,c);M.position.y=T,t.add(M);const I=new ct,E=new x(new zt(e*.011,8,6),u);E.scale.set(1,1.15,.3),I.add(E);for(let j=0;j<3;j++){const nt=new x(new zt(e*.005,6,5),u);nt.position.set((j-1)*e*.012,e*.016,0),nt.scale.z=.3,I.add(nt)}I.position.set(g*.42,s-e*.005,g*.72*c),I.rotation.y=.5,t.add(I);const A=i.torsoH*.3,C=p+A*.5,y=o*1.62,v=o*.84,D=new x(new G(y,A,e*.014),l);D.position.set(0,C,v),t.add(D);for(const j of[-1,1]){const nt=new x(new We(e*.028,e*.045,4),l);nt.position.set(j*y*.32,C+A*.5+e*.019,v),nt.rotation.set(0,Math.PI/4,j*.26),nt.scale.set(1,1,.3),t.add(nt)}for(const j of[-1,1]){const nt=new x(new ye(e*.014,e*.004,5,10,Math.PI),u);nt.position.set(j*y*.26,C+A*.08,v+e*.009),nt.rotation.z=Math.PI,t.add(nt)}const F=new x(new ye(e*.009,e*.003,5,10,Math.PI),u);F.position.set(0,C-A*.12,v+e*.009),F.rotation.z=Math.PI,t.add(F);for(const j of[-1,1])for(let nt=0;nt<3;nt++){const X=new x(new G(e*.036,e*.0035,e*.0035),u);X.position.set(j*y*.4,C-A*.05+(nt-1)*e*.012,v+e*.008),X.rotation.z=j*(nt-1)*.24,t.add(X)}const z=Bn(e*.032,S.maidCreme);z.position.set(-o*1.25,s+i.torsoH*.16,o*.5),z.rotation.y=-.55,t.add(z);const q=new x(new it(o*.6,o*1.3,e*.018,20,1,!0),h);q.position.y=a+e*.008,q.scale.z=c,t.add(q);const Y=Zn(o*1.3,e*.02,S.maidCreme,c);Y.position.y=a-e*.006,t.add(Y);const Z=Bn(e*.05,S.maidLacoVermelho);Z.position.set(0,s+i.torsoH*.78,o*1.12),t.add(Z);const et=new x(new zt(e*.016,10,8),P(S.gold,{glow:.2}));et.position.set(0,s+i.torsoH*.71,o*1.16),t.add(et);for(const j of[-1,1]){const nt=Ch(e*.056*n,S.maidPreto);nt.position.set(j*r,a-e*.012,0),t.add(nt);const X=Zn(e*.05*n,e*.024,S.maidCreme,1);X.position.set(j*r,a-e*.058,0),t.add(X)}return t}function bv(i,t){const e=new ct,n=P(t);for(const o of[-1,1]){const a=new x(new zt(i*.56,8,6),n);a.position.set(o*i*.44,i*.34,0),a.scale.z=.34,e.add(a)}const s=new x(new We(i*.78,i*1.2,10),n);return s.position.y=-i*.34,s.rotation.x=Math.PI,s.scale.z=.34,e.add(s),e}function wv(i){const t=new ct,{h:e,w:n}=i,s=i.legH,o=e*.105*n,a=s+i.torsoH*.86,r=.85,c=P(S.waRosa),l=P(S.waRosa,{doubleSide:!0}),h=P(S.waRosaForte),u=P(S.waEscuro),d=P(S.waEscuro,{doubleSide:!0}),f=P(S.waBranco,{doubleSide:!0}),g=s+i.torsoH*.1,_=s-e*.135,m=o*2,p=new x(new it(o*1.02,m,g-_,22,1,!0),d);p.position.y=(g+_)/2,p.scale.z=r,t.add(p);const T=16,w=o*1.02,M=g-_,I=-Math.atan2(m-w,M);for(let nt=0;nt<T;nt++){const X=new ct;X.rotation.y=nt/T*Math.PI*2;const vt=new x(new G(e*.011,M*.94,e*.009),u);vt.position.set(0,(g+_)/2,(w+m)/2),vt.rotation.x=I,X.add(vt),X.scale.z=r,t.add(X)}const E=13;for(let nt=0;nt<E;nt++){const X=nt/E*Math.PI*2,vt=bv(e*.034,S.waEscuro);vt.position.set(Math.sin(X)*m*1.03,_-e*.016,Math.cos(X)*m*1.03*r),vt.rotation.y=X,t.add(vt)}const A=s+i.torsoH*.16,C=s-e*.095,y=new x(new it(o*1.02,m*.9,A-C,16,1,!0,-1.25,2.5),f);y.position.y=(A+C)/2,y.scale.z=r,t.add(y);const v=Zn(m*.92,e*.03,S.waBranco,r);v.position.y=C,t.add(v);const D=s+i.torsoH*.14,F=s+i.torsoH*.5,z=new x(new it(o*1.07,o*1.1,F-D,18,1,!0),d);z.position.y=(F+D)/2,z.scale.z=r,t.add(z);const q=new x(new G(o*.62,i.torsoH*.26,e*.012),u);q.position.set(0,s+i.torsoH*.6,o*.82),t.add(q);const Y=new x(new ye(e*.019,e*.005,6,12),P(S.waFivela));Y.position.set(0,s+i.torsoH*.56,o*.89),Y.scale.set(1.25,1,1),t.add(Y);for(const nt of[-1,1]){const X=new x(new G(o*1.15,i.torsoH*.42,e*.013),c);X.position.set(nt*o*.24,s+i.torsoH*.68,o*.76),X.rotation.z=nt*.52,t.add(X)}const Z=new x(new it(o*.78,o*.92,i.torsoH*.2,16,1,!0),l);Z.position.y=a-i.torsoH*.02,Z.scale.z=r,t.add(Z);const et=Bn(e*.05,S.waRosaForte);et.position.set(0,D+e*.014,o*1.12),t.add(et);for(const nt of[-1,1]){const X=new x(new G(e*.026,e*.2,e*.008),h);X.position.set(nt*e*.022,D-e*.09,m*.78),X.rotation.z=nt*.1,t.add(X);const vt=new x(new We(e*.018,e*.03,4),h);vt.position.set(nt*e*.024,D-e*.2,m*.8),vt.rotation.set(Math.PI,Math.PI/4,0),vt.scale.z=.3,t.add(vt)}const j=new x(new it(e*.043,e*.045,e*.022,14,1,!0),d);return j.position.y=a+i.torsoH*.12,t.add(j),t}function Ev(i){const t=new ct,{h:e,w:n}=i,s=e*.3,o=e*.052*n,a=e*.068*n,r=new x(new it(e*.045*n,a,s*1.1,14,1,!0),P(S.waEscuro,{doubleSide:!0}));r.position.set(o*.45,-s*.48,0),r.scale.z=.78,t.add(r);const c=new x(new it(a,a*.86,s*.5,14,1,!0),P(S.waEscuro,{doubleSide:!0}));c.position.set(o,-s*1.28,0),c.scale.z=.78,t.add(c);const l=Zn(a*.9,e*.024,S.waBranco,.78);return l.position.set(o,-s*1.52,0),t.add(l),t}function Tv(i){const t=new ct,{h:e,w:n}=i,s=-i.legH*.28,o=new x(new it(e*.047*n,e*.047*n,e*.022,14,1,!0),P(S.waBranco,{doubleSide:!0}));o.position.y=s,t.add(o);const a=new x(new it(e*.049*n,e*.049*n,e*.014,14,1,!0),P(S.waRosaForte,{doubleSide:!0}));a.position.y=s+e*.026,t.add(a);const r=Bn(e*.013,S.waRosaForte);return r.position.set(0,s+e*.026,e*.05*n),t.add(r),t}function Av(i){const t=new ct,n=-i.headR*.98,s=new x(new it(i.h*.043,i.h*.045,i.h*.026,14,1,!0),P(S.vestidoRenda,{doubleSide:!0}));s.position.y=n,t.add(s);const o=Bn(i.h*.026,S.vestidoFita,S.vestidoRenda);return o.position.set(0,n,i.h*.044),t.add(o),t}const ce={sorveteMorango:{id:"sorvete-morango",nome:"Sorvete de morango",icone:"🍦",tipo:"mao",nota:"do Ari",holdPose:"upright"},sorveteMaracuja:{id:"sorvete-maracuja",nome:"Sorvete de maracujá",icone:"🍦",tipo:"mao",nota:"do Renan",holdPose:"upright"},sucoPessego:{id:"suco-pessego",nome:"Suco de pêssego",icone:"🥤",tipo:"mao",nota:"do Ari",holdPose:"upright"},sucoMorango:{id:"suco-morango",nome:"Suco de morango",icone:"🥤",tipo:"mao",nota:"do Renan",holdPose:"upright"},chapeuPingPong:{id:"chapeu-ping-pong",nome:"Chapéu de campeão",icone:"👑",tipo:"vestivel",slot:"cabeca",nota:"ping pong, 5 a 0"},patins:{id:"patins",nome:"Patins",icone:"🛼",tipo:"vestivel",slot:"pes",nota:"da lojinha do parque"},gorroDeLa:{id:"gorro-la",nome:"Gorro de lã",icone:"🧢",tipo:"vestivel",slot:"cabeca",cor:S.roupaLa,corDetalhe:S.roupaLaBarra,nota:"para o frio que nunca faz",cobreCabelo:!0,extra:_v},camisaListrada:{id:"camisa-listrada",nome:"Camisa listrada",icone:"👕",tipo:"vestivel",slot:"tronco",cor:S.roupaListra,corDetalhe:S.roupaListraManga,nota:"mangas claras"},calcaJeans:{id:"calca-jeans",nome:"Calça jeans",icone:"👖",tipo:"vestivel",slot:"pernas",cor:S.roupaJeans,nota:"a de sempre"},vestidoRosa:{id:"vestido-rosa",nome:"Vestido rosa de babados",icone:"👗",tipo:"vestivel",slot:"tronco",cor:S.vestidoRosa,corDetalhe:S.vestidoRenda,nota:"da vitrine que o Renan viu",bracosNus:!0,pernasNuas:!0,extra:Mv},maidMarinheiro:{id:"maid-marinheiro",nome:"Maid marinheiro",icone:"🖤",tipo:"vestivel",slot:"tronco",cor:S.maidPreto,corDetalhe:S.maidCreme,nota:"gola de marinheiro e cadarço",pernasNuas:!0,extra:yv},maidGatinho:{id:"maid-gatinho",nome:"Maid gatinho",icone:"🐱",tipo:"vestivel",slot:"tronco",cor:S.maidPreto,corDetalhe:S.maidPreto,nota:"com guizo e cara de gato",pernasNuas:!0,extra:Sv},maidJapones:{id:"maid-japones",nome:"Maid japonês",icone:"🌸",tipo:"vestivel",slot:"tronco",cor:S.waRosa,corDetalhe:S.waRosa,nota:"manga de quimono e festão de corações",pernasNuas:!0,extra:wv,extraBraco:Ev},meiaDeCoxa:{id:"meia-de-coxa",nome:"Meia de coxa",icone:"🧦",tipo:"vestivel",slot:"pernas",cor:S.waBranco,nota:"com a liga rosa",extra:Tv},gargantilhaDeLaco:{id:"gargantilha-laco",nome:"Gargantilha de laço",icone:"🎀",tipo:"vestivel",slot:"cabeca",cor:S.vestidoFita,nota:"combina com o vestido",extra:Av},botaAmarela:{id:"bota-amarela",nome:"Bota amarela",icone:"🥾",tipo:"vestivel",slot:"pes",cor:S.roupaBota,corDetalhe:S.roupaBotaCano,nota:"chama atenção de longe",extra:xv},frisbee:{id:"frisbee",nome:"Frisbee",icone:"🥏",tipo:"mao",nota:"do parque",holdPose:"relaxed"}},Cv={"sorvete-morango":()=>xr(S.morango),"sorvete-maracuja":()=>xr(S.maracuja),"suco-pessego":()=>pl(S.pessego),"suco-morango":()=>pl(S.morango),frisbee:()=>Th(S.frisbee)},Rv=Object.fromEntries(Object.values(ce).map(i=>[i.id,i]));function Mr(i){return Rv[i]??null}function Pv(i){const t=Cv[i]?.();return t?(t.userData.item=i,t):null}const Un=10,As=4;function mo(i,t){return t==="mao"||i.tipo==="vestivel"}function go(i){return i.slot?xi.indexOf(i.slot):-1}function wo(i){return Array.from({length:i},()=>null)}function Rh(){return{mao:wo(Un),ativo:0,vestiveis:wo(As)}}function Iv(i,t){const e={},n=t&&typeof t=="object"?t:{},s=new Set([...Object.keys(i??{}),...Object.keys(n)]);for(const o of s)e[o]=Lv((i??{})[o],n[o]);return e}function Lv(i,t){const e=Rh();if(!i&&!t)return e;const n=(r,c,l)=>{const h=wo(c);if(!Array.isArray(r))return h;for(let u=0;u<c;u++){const d=r[u];if(!d||typeof d.id!="string"){h[u]=null;continue}const f=Mr(d.id),g=f?{...d,...f}:d;h[u]=mo(g,l)?g:null}return h},s=typeof i?.ativo=="number"?Math.floor(i.ativo):0,o=n(i?.vestiveis,As,"vestivel"),a=wo(As);for(const r of o){if(!r)continue;const c=go(r);c>=0&&a[c]===null&&(a[c]=r)}if(t&&typeof t=="object")for(const[r,c]of Object.entries(t)){if(typeof c!="string")continue;const l=Mr(c);if(!l||l.slot!==r)continue;const h=xi.indexOf(r);h>=0&&a[h]===null&&(a[h]=l)}return{mao:n(i?.mao,Un,"mao"),ativo:s>=0&&s<Un?s:0,vestiveis:a}}const _l="aristory.save.v1",ga={version:1,scene:"",flags:{},memories:[],stats:{},inventarios:{}};class Kr{data;constructor(){this.data=Kr.read()}static read(){try{const t=localStorage.getItem(_l);if(!t)return structuredClone(ga);const e=JSON.parse(t),n=e.loadouts;return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{},inventarios:Iv(e.inventarios,n)}}catch{return structuredClone(ga)}}persist(){try{localStorage.setItem(_l,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}de(t){let e=this.data.inventarios[t];return e||(e=Rh(),this.data.inventarios[t]=e),e}maos(t){return this.de(t).mao}vestiveis(t){return this.de(t).vestiveis}loadout(t){const e={};return this.de(t).vestiveis.forEach((n,s)=>{n&&(e[xi[s]]=n.id)}),e}slotAtivo(t){return this.de(t).ativo}setSlotAtivo(t,e){e<0||e>=Un||(this.de(t).ativo=e,this.persist())}itemAtivo(t){const e=this.de(t);return e.mao[e.ativo]??null}achouItem(t,e){const n=this.de(t);return n.mao.some(s=>s?.id===e)||n.vestiveis.some(s=>s?.id===e)}pegar(t,e){if(this.achouItem(t,e.id))return"repetido";if(e.tipo==="vestivel"&&this.vestir(t,e))return"guardado";const n=this.de(t);if(n.mao[n.ativo]===null)return n.mao[n.ativo]=e,this.persist(),"mao";for(let s=1;s<Un;s++){const o=(n.ativo+s)%Un;if(n.mao[o]===null)return n.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardar(t,e){if(this.achouItem(t,e.id))return"repetido";const n=this.de(t);if(n.mao[n.ativo]===null)return n.mao[n.ativo]=e,this.persist(),"mao";for(let s=1;s<Un;s++){const o=(n.ativo+s)%Un;if(n.mao[o]===null)return n.mao[o]=e,this.persist(),"guardado"}return"cheio"}vestir(t,e){if(!mo(e,"vestivel")||this.achouItem(t,e.id))return!1;const n=go(e);if(n<0)return!1;const s=this.de(t).vestiveis;return s[n]!==null?!1:(s[n]=e,this.persist(),!0)}despir(t,e){e<0||e>=As||(this.de(t).vestiveis[e]=null,this.persist())}mover(t,e,n){const s=this.de(t),o=u=>u.lista==="mao"?s.mao:s.vestiveis,a=u=>u.indice>=0&&u.indice<(u.lista==="mao"?Un:As);if(!a(e)||!a(n)||e.lista===n.lista&&e.indice===n.indice)return!1;const r=o(e),c=o(n),l=r[e.indice];if(!l||!mo(l,n.lista)||n.lista==="vestivel"&&go(l)!==n.indice)return!1;const h=c[n.indice];return h&&!mo(h,e.lista)||e.lista==="vestivel"&&h&&go(h)!==e.indice?!1:(c[n.indice]=l,r[e.indice]=h??null,this.persist(),!0)}largar(t,e){const n=this.de(t);let s=!1;for(const o of[n.mao,n.vestiveis]){const a=o.findIndex(r=>r?.id===e);a>=0&&(o[a]=null,s=!0)}return s&&this.persist(),s}reset(){this.data=structuredClone(ga),this.persist()}}class Dv{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;menu;placar;mochila;armario;boneco;corpo;acervo;donoArmario;slotsMao;slotsVestivel;dono;descarte;pegou=null;tipoNaPinca;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchHold=null;onRestart=null;onToggleSom=null;som=null;hintsTimer=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
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
      <div class="carga"><div class="barra"></div></div>
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
            <li><b>F</b><span>segurar para lançar o frisbee, na quadra</span></li>
            <li><b>roda</b><span>aproximar e afastar a câmera</span></li>
          </ul>
          <h3>No celular</h3>
          <ul>
            <li><b>arrastar</b><span>andar para onde o dedo puxar</span></li>
            <li><b>✨</b><span>interagir — segure para carregar o frisbee</span></li>
            <li><b>🔁</b><span>trocar de personagem</span></li>
            <li><b>🎒</b><span>abrir a mochila</span></li>
            <li><b>📖</b><span>abrir o diário</span></li>
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
        <h3>Vestindo</h3>
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
      <div class="touch">
        <button class="action-btn" aria-label="interagir">✨</button>
        <button class="swap-btn" aria-label="trocar de personagem">🔁</button>
        <button class="bag-btn" aria-label="mochila">🎒</button>
        <button class="journal-btn" aria-label="diário">📖</button>
      </div>
    `,t.appendChild(e);const n=document.createElement("div");n.className="boot",n.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(n),this.boot=n,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.menu=e.querySelector(".menu"),this.placar=e.querySelector(".placar"),this.mochila=e.querySelector(".mochila"),this.slotsMao=e.querySelector(".mochila .maos"),this.slotsVestivel=e.querySelector(".mochila .vestiveis"),this.dono=e.querySelector(".mochila .dono"),this.descarte=e.querySelector(".mochila .descarte"),this.armario=e.querySelector(".armario"),this.boneco=e.querySelector(".armario .boneco"),this.corpo=e.querySelector(".armario .corpo"),this.acervo=e.querySelector(".armario .acervo"),this.donoArmario=e.querySelector(".armario .dono"),this.dialogue.addEventListener("click",o=>{o.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",o=>{o.target===this.journal&&this.closeJournal()});const s=e.querySelector(".action-btn");s.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),s.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const o of["pointerup","pointercancel","pointerleave"])s.addEventListener(o,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),e.querySelector(".bag-btn").addEventListener("click",()=>this.toggleMochila()),e.querySelector(".mochila .close").addEventListener("click",()=>this.closeMochila()),e.querySelector(".armario .close").addEventListener("click",()=>this.fecharArmario()),this.armario.addEventListener("click",o=>{o.target===this.armario&&this.fecharArmario()}),this.ligarGiroDoBoneco(),e.querySelector(".mochila .descartar").addEventListener("click",()=>{this.som?.("escolha"),this.descarte.classList.add("confirmando")}),e.querySelector(".mochila .descartar-sim").addEventListener("click",()=>{const o=this.pegou;this.pegou=null,this.tipoNaPinca=void 0,this.marcarPego(null),o&&this.onDescartar?.(o)}),this.mochila.addEventListener("click",o=>{o.target===this.mochila&&this.closeMochila()});for(const o of[this.slotsMao,this.slotsVestivel])o.addEventListener("click",a=>this.tocarVaga(a)),o.addEventListener("dragstart",a=>this.comecarArrasto(a)),o.addEventListener("dragover",a=>this.arrastarSobre(a)),o.addEventListener("dragleave",a=>{a.target.closest(".slot")?.classList.remove("alvo")}),o.addEventListener("drop",a=>this.soltarArrasto(a)),o.addEventListener("dragend",()=>this.limparArrasto());e.querySelector(".menu-btn").addEventListener("click",()=>this.toggleMenu()),e.querySelector(".menu .som-btn").addEventListener("click",()=>this.onToggleSom?.()),e.querySelector(".menu .controles-btn").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.add("vendo-controles")}),e.querySelector(".menu .controles .voltar").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.remove("vendo-controles")}),e.querySelector(".menu .close").addEventListener("click",()=>this.closeMenu()),e.querySelector(".menu .recomecar").addEventListener("click",()=>{this.menu.classList.add("perguntando")}),e.querySelector(".menu .nao").addEventListener("click",()=>{this.menu.classList.remove("perguntando")}),e.querySelector(".menu .sim").addEventListener("click",()=>{this.closeMenu(),this.onRestart?.()}),this.menu.addEventListener("click",o=>{o.target===this.menu&&this.closeMenu()}),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),this.showHints()}get menuOpen(){return this.menu.classList.contains("show")}toggleMenu(){this.som?.("menu"),this.menuOpen?this.closeMenu():(this.closeJournal(),this.closeMochila(),this.menu.classList.add("show")),this.marcarTelaAberta()}closeMenu(){this.menu.classList.remove("show"),this.menu.classList.remove("perguntando"),this.menu.classList.remove("vendo-controles"),this.marcarTelaAberta()}marcarTelaAberta(){document.body.classList.toggle("tela-aberta",this.menuOpen||this.journalOpen||this.mochilaOpen||this.armarioOpen)}setSom(t){const e=this.menu.querySelector(".som-btn");e.textContent=t?"🔊 Som ligado":"🔇 Som desligado",e.classList.toggle("desligado",!t)}showHints(){this.hints.classList.remove("hide"),this.hintsTimer&&window.clearTimeout(this.hintsTimer),this.hintsTimer=window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){const n=this.prompt.querySelector(".label").textContent;this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,(!this.prompt.classList.contains("show")||n!==e)&&this.som?.("prompt"),this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showPlacar(t){if(!t){this.placar.classList.remove("show");return}this.placar.querySelector(".eu").textContent=t.eu,this.placar.querySelector(".ele").textContent=t.ele,this.placar.querySelector(".nums").textContent=`${t.meus} × ${t.dele}`,this.placar.classList.add("show")}showCharge(t){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const e=this.carga.querySelector(".barra");e.style.width=`${Math.max(0,Math.min(1,t))*100}%`}toast(t,e="💛"){const n=document.createElement("div");n.className="toast",n.innerHTML=`<span>${e}</span><span></span>`,n.querySelector("span:last-child").textContent=t,this.toasts.appendChild(n),window.setTimeout(()=>n.classList.add("fade"),2600),window.setTimeout(()=>n.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(n=>{let s=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const o=()=>{this.type(t[s])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[s];return}if(s+=1,s>=t.length){this.dialogue.classList.remove("show"),this.advance=null,n();return}o()},o()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,e%3===1&&t[e-1]!==" "&&this.som?.("fala"),this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,n=""){return new Promise(s=>{this.dialogueWho.textContent=n,this.dialogueWho.style.display=n?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=o=>{this.som?.("confirma"),this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),s(o)},e.forEach((o,a)=>{const r=document.createElement("button");r.type="button",r.textContent=o,r.addEventListener("click",()=>this.escolher?.(a)),this.escolhas.appendChild(r)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,n)=>e.classList.toggle("sel",n===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.som?.("escolha"),this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.som?.("escolha"),this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const n=document.createElement("div");n.className="memory",n.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',n.querySelector(".icon").textContent=e.icon,n.querySelector("b").textContent=e.title,n.querySelector("small").textContent=e.place,n.querySelector("p").textContent=e.note,this.journalGrid.appendChild(n)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.som?.("diario"),this.journalOpen?this.closeJournal():(this.closeMochila(),this.journal.classList.add("show")),this.marcarTelaAberta()}closeJournal(){this.journal.classList.remove("show"),this.marcarTelaAberta()}get mochilaOpen(){return this.mochila.classList.contains("show")}toggleMochila(){this.som?.("diario"),this.mochilaOpen?this.closeMochila():(this.closeJournal(),this.onAbrirMochila?.(),this.mochila.classList.add("show")),this.marcarTelaAberta()}closeMochila(){this.mochila.classList.remove("show"),this.marcarTelaAberta()}renderMochila(t,e,n,s){this.dono.textContent=`de ${s}`,this.pegou=null,this.tipoNaPinca=void 0,this.mochila.classList.remove("movendo"),this.descarte.classList.remove("show","confirmando");const o=["Cabeça","Tronco","Pernas","Pés"],a=(r,c,l,h=!1)=>{r.innerHTML="",c.forEach((u,d)=>{const f=document.createElement("button");f.className="slot",f.dataset.slot=String(d),f.classList.toggle("cheio",u!==null),f.classList.toggle("principal",d===l),f.draggable=u!==null,u?f.dataset.tipo=u.tipo:delete f.dataset.tipo;const g=h?`<em class="parte">${o[d]}</em>`:"";f.innerHTML=g+(u?`<span class="icone">${u.icone}</span><b>${u.nome}</b>`+(u.nota?`<small>${u.nota}</small>`:""):'<span class="icone vazio">·</span><b>vazio</b>'),r.appendChild(f)})};a(this.slotsMao,t,n),a(this.slotsVestivel,e,-1,!0)}get armarioOpen(){return this.armario.classList.contains("show")}abrirArmario(){this.armarioOpen||(this.som?.("escolha"),this.onAbrirArmario?.(),this.armario.classList.add("show"),this.marcarTelaAberta())}fecharArmario(){this.armarioOpen&&(this.armario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharArmario?.())}canvasDoBoneco(){return this.boneco}renderArmario(t,e,n){this.donoArmario.textContent=`de ${n}`;const s=["Cabeça","Tronco","Pernas","Pés"];if(this.corpo.innerHTML="",t.forEach((o,a)=>{const r=document.createElement("button");r.className="parte",r.classList.toggle("cheio",o!==null),r.dataset.parte=String(a),r.innerHTML=`<small>${s[a]}</small>`+(o?`<span class="icone">${o.icone}</span><b>${o.nome}</b><em>tirar</em>`:'<span class="icone vazio">·</span><b>vazio</b>'),this.corpo.appendChild(r)}),this.acervo.innerHTML="",e.length===0){const o=document.createElement("p");o.className="nada",o.textContent="Nada guardado — está tudo no corpo.",this.acervo.appendChild(o)}for(const o of e){const a=document.createElement("button");a.className="peca",a.dataset.id=o.id,a.innerHTML=`<span class="icone">${o.icone}</span><b>${o.nome}</b>`+(o.nota?`<small>${o.nota}</small>`:""),this.acervo.appendChild(a)}}onTirarParte=null;onVestirPeca=null;onAbrirArmario=null;onFecharArmario=null;onGirarBoneco=null;ligarGiroDoBoneco(){let t=!1,e=0;this.boneco.addEventListener("pointerdown",n=>{t=!0,e=n.clientX,this.boneco.setPointerCapture(n.pointerId)}),this.boneco.addEventListener("pointermove",n=>{t&&(this.onGirarBoneco?.((n.clientX-e)*.012),e=n.clientX)});for(const n of["pointerup","pointercancel"])this.boneco.addEventListener(n,()=>{t=!1});this.corpo.addEventListener("click",n=>{const s=n.target.closest(".parte");!s?.dataset.parte||!s.classList.contains("cheio")||this.onTirarParte?.(Number(s.dataset.parte))}),this.acervo.addEventListener("click",n=>{const s=n.target.closest(".peca");s?.dataset.id&&this.onVestirPeca?.(s.dataset.id)})}onEscolherSlot=null;onMoverItem=null;onDescartar=null;onAbrirMochila=null;podeIrPara(t,e){return!t||t==="vestivel"&&e==="mao"?!0:t==="mao"&&e==="vestivel"?(this.toast("Este item não pode ser vestido","🚫"),!1):!0}endereco(t){const e=t.closest(".slot");return e?.dataset.slot?{lista:e.closest(".vestiveis")?"vestivel":"mao",indice:Number(e.dataset.slot)}:null}tocarVaga(t){const e=this.endereco(t.target);if(!e)return;if(this.pegou){const s=this.pegou;if(s.lista===e.lista&&s.indice===e.indice){this.pegou=null,this.marcarPego(null);return}if(!this.podeIrPara(this.tipoNaPinca,e.lista))return;this.pegou=null,this.marcarPego(null),this.onMoverItem?.(s,e)&&this.som?.("escolha");return}const n=t.target.closest(".slot");if(e.lista==="mao"&&!n.classList.contains("cheio")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}if(n.classList.contains("cheio")){if(e.lista==="mao"&&!n.classList.contains("principal")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}this.pegou=e,this.tipoNaPinca=n.dataset.tipo,this.marcarPego(n),this.som?.("escolha")}}marcarPego(t){for(const s of this.mochila.querySelectorAll(".slot.pego"))s.classList.remove("pego");t?.classList.add("pego"),this.mochila.classList.toggle("movendo",t!==null),this.descarte.classList.toggle("show",t!==null),this.descarte.classList.remove("confirmando");const e=this.descarte.querySelector(".descartar"),n=t?.querySelector("b")?.textContent??"";e.textContent=n?`🗑 Descartar ${n}`:"🗑 Descartar"}comecarArrasto(t){const e=this.endereco(t.target),n=t.target.closest(".slot");if(!e||!n?.classList.contains("cheio")){t.preventDefault();return}t.dataTransfer?.setData("text/plain",JSON.stringify({vaga:e,tipo:n.dataset.tipo})),t.dataTransfer&&(t.dataTransfer.effectAllowed="move"),n.classList.add("pego")}arrastarSobre(t){const e=t.target.closest(".slot");e&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),e.classList.add("alvo"))}soltarArrasto(t){t.preventDefault();const e=this.endereco(t.target),n=t.dataTransfer?.getData("text/plain");if(this.limparArrasto(),!(!e||!n))try{const{vaga:s,tipo:o}=JSON.parse(n);if(!this.podeIrPara(o,e.lista))return;this.onMoverItem?.(s,e)&&this.som?.("escolha")}catch{}}limparArrasto(){for(const t of this.mochila.querySelectorAll(".slot.pego, .slot.alvo"))t.classList.remove("pego","alvo")}}function yr(i,t,e){for(const n of e)if(n.kind==="circle"){const s=i.x-n.x,o=i.z-n.z,a=t+n.r,r=s*s+o*o;if(r>=a*a||r===0)continue;const c=Math.sqrt(r),l=(a-c)/c;i.x+=s*l,i.z+=o*l}else{const s=Math.cos(-n.rot),o=Math.sin(-n.rot),a=i.x-n.x,r=i.z-n.z,c=a*s-r*o,l=a*o+r*s,h=Math.max(-n.hw,Math.min(n.hw,c)),u=Math.max(-n.hd,Math.min(n.hd,l));let d=c-h,f=l-u,g=d*d+f*f;if(g>t*t)continue;if(g===0){const T=n.hw-Math.abs(c),w=n.hd-Math.abs(l);T<w?(d=Math.sign(c)||1,f=0,g=0):(d=0,f=Math.sign(l)||1);const M=d!==0?Math.sign(d)*(n.hw+t):c,I=f!==0?Math.sign(f)*(n.hd+t):l;i.x=n.x+(M*Math.cos(n.rot)-I*Math.sin(n.rot)),i.z=n.z+(M*Math.sin(n.rot)+I*Math.cos(n.rot));continue}const _=Math.sqrt(g),m=h+d/_*t,p=u+f/_*t;i.x=n.x+(m*Math.cos(n.rot)-p*Math.sin(n.rot)),i.z=n.z+(m*Math.sin(n.rot)+p*Math.cos(n.rot))}}function Sr(i,t,e){i.x=Math.max(e.minX+t,Math.min(e.maxX-t,i.x)),i.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,i.z))}const Ph=1.3;class Uv{object=new ct;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new U;body;locked=!1;riding=!1;submersion=0;patins=!1;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,n=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=n,t.setFacing(n),this.object.add(t.group),this.body=t,e}get chest(){return new U(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,n=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=n,this.body.setFacing(n)}setVisible(t){this.object.visible=t}update(t,e,n,s){if(this.riding){this.body.update(e,0);return}const o=this.submersion>.05,a=this.patins&&!o?Ph:1,r=o?this.maxSpeed*.55:this.maxSpeed*a;if(!this.locked&&t.lengthSq()>1e-4){const l=t.clone().normalize();this.velocity.x+=l.x*this.accel*e,this.velocity.z+=l.z*this.accel*e;const h=Math.hypot(this.velocity.x,this.velocity.z);h>r&&(this.velocity.x=this.velocity.x/h*r,this.velocity.z=this.velocity.z/h*r),this.body.setFacing(Math.atan2(l.x,l.z))}else{const l=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(l),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,yr(this.position,this.radius,n),Sr(this.position,this.radius,s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(o),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class Nv{object=new ct;position;radius=.4;maxSpeed=5;velocity=new U;dir=new U;body;aoLado=0;folga=2;ordem=null;riding=!1;submersion=0;patins=!1;lado=0;distancia=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,n=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=n,t.setFacing(n),this.object.add(t.group),this.body=t,e}teleport(t,e,n=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=n,this.body.setFacing(n)}setVisible(t){this.object.visible=t}atrelar(t,e){this.lado=t,this.distancia=e,this.ordem=null}soltar(){this.lado=0}get atrelado(){return this.lado!==0}goTo(t,e){this.ordem=new U(t,0,e)}clearOrder(){this.ordem=null}hold(t,e){this.ordem?this.ordem.set(this.position.x,0,this.position.z):this.ordem=new U(this.position.x,0,this.position.z),this.velocity.set(0,0,0),this.body.setFacing(Math.atan2(t-this.position.x,e-this.position.z))}get hasOrder(){return this.ordem!==null}rebocar(t,e,n,s){const o=this.aoLado,a=t.x+Math.sin(o+Math.PI/2)*this.distancia*this.lado,r=t.z+Math.cos(o+Math.PI/2)*this.distancia*this.lado,c=this.position.x,l=this.position.z,h=Math.min(1,e*16);this.position.x+=(a-this.position.x)*h,this.position.z+=(r-this.position.z)*h,yr(this.position,this.radius,n),Sr(this.position,this.radius,s),this.velocity.set((this.position.x-c)/Math.max(e,1e-4),0,(this.position.z-l)/Math.max(e,1e-4)),this.body.setFacing(o),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}set direcaoDoPar(t){this.aoLado=t}update(t,e,n,s){if(this.riding){this.body.update(e,0);return}if(this.lado!==0){this.rebocar(t,e,n,s);return}const o=this.ordem??t,a=this.ordem?.55:this.folga;this.dir.set(o.x-this.position.x,0,o.z-this.position.z);const r=this.dir.length();if(!this.ordem&&r>22){this.teleport(o.x-1.2,o.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(r>a){this.dir.normalize();const d=this.maxSpeed*(this.patins?Ph:1),f=Math.min(d,1.6+(r-a)*2.2);this.velocity.x+=(this.dir.x*f-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*f-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),r>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,yr(this.position,this.radius,n),Sr(this.position,this.radius,s);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),u=.86;if(h<u&&h>1e-4){const d=(u-h)/h;this.position.x+=c*d,this.position.z+=l*d}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}const Fv=1.7;class Ov{grupo=new ct;vivos=[];constructor(t){t.add(this.grupo)}soltar(t,e,n,s=1.62){const o=Ah(.6);o.userData.coracao=!0,o.position.set(t.x+e,s,t.z+n),this.grupo.add(o),this.vivos.push({obj:o,vida:0,giro:Math.random()*Math.PI,fx:e,fz:n})}limpar(){for(const t of this.vivos)this.grupo.remove(t.obj);this.vivos.length=0}update(t){for(let e=this.vivos.length-1;e>=0;e--){const n=this.vivos[e];n.vida+=t;const s=n.vida/Fv;if(s>=1){this.grupo.remove(n.obj),this.vivos.splice(e,1);continue}n.obj.position.y+=t*.72;const o=(.7+Math.sin(n.vida*3+n.giro)*.25)*t;n.obj.position.x+=n.fx*o,n.obj.position.z+=n.fz*o,n.obj.rotation.y=n.giro+n.vida*1.4;const a=s<.18?s/.18:Math.min(1,(1-s)/.35);n.obj.scale.setScalar(.25+a*.9)}}}const zv=1.5,xl=.9,Ml=1.16,mi=.32,br=.42,Ih=.34,Bv=mi+br+Ih,kv=.5;class Hv{constructor(t){this.coracoes=t}t=-1;descanso=0;alvoA=new U;alvoB=new U;soltouCoracao=!1;onSom=null;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!Gv(t,e))return!1;const n=e.position.x-t.position.x,s=e.position.z-t.position.z,o=Math.hypot(n,s);if(o>zv||o<.01)return!1;const a=Math.atan2(n,s);return Math.abs(va(t.rig.facing,a))<xl&&Math.abs(va(e.rig.facing,a+Math.PI))<xl}iniciar(t,e,n){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const s=e.position.x-t.position.x,o=e.position.z-t.position.z,a=Math.atan2(s,o),r=n+Math.PI/2,c=Math.abs(va(a,r))<Math.PI/2?r:r+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,u=Math.sin(c)*Ml/2,d=Math.cos(c)*Ml/2;this.alvoA.set(l-u,0,h-d),this.alvoB.set(l+u,0,h+d),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0)}update(t,e,n){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const s=Vv(this.t);if(e.rig.setKiss(s),n.rig.setKiss(s),e.locked=!0,this.t<mi){const o=Math.min(1,t*9);e.position.lerp(this.alvoA,o),n.position.lerp(this.alvoB,o)}if(!this.soltouCoracao&&this.t>=mi*.9){this.soltouCoracao=!0;const o=Math.atan2(n.position.x-e.position.x,n.position.z-e.position.z),a=Math.sin(o),r=Math.cos(o);this.coracoes.soltar(e.position,-a,-r),this.coracoes.soltar(n.position,a,r),this.onSom?.("beijo"),this.onSom?.("coracao")}this.t>=Bv&&(this.t=-1,this.descanso=kv,e.rig.setKiss(0),n.rig.setKiss(0),e.locked=!1)}}}function Vv(i){return i<mi?yl(i/mi):i<mi+br?1:yl(Math.max(0,1-(i-mi-br)/Ih))}function yl(i){return i*i*(3-2*i)}function Gv(i,t){const e=i.rig.spec,n=t.rig.spec;return e.casal===!0&&n.casal===!0&&e.id!==n.id}function va(i,t){return Math.atan2(Math.sin(i-t),Math.cos(i-t))}const Wv=.95,qv=1.8,Xv=2.2,Yv=.5,Sl=3;class jv{constructor(t){this.coracoes=t}lado=1;ligado=!1;relogio=0;longe=0;onSom=null;get ativo(){return this.ligado}disponivel(t,e){if(this.ligado||t.riding||e.riding||t.submersion>.05||e.submersion>.05||t.locked||e.hasOrder)return!1;const n=Math.hypot(e.position.x-t.position.x,e.position.z-t.position.z);return n>.01&&n<=qv}ligar(t,e){if(this.ligado)return;this.ligado=!0,this.relogio=0,this.longe=0;const n=t.rig.facing,s=e.position.x-t.position.x,o=e.position.z-t.position.z;this.lado=s*Math.sin(n+Math.PI/2)+o*Math.cos(n+Math.PI/2)<0?-1:1,this.aplicar(t,e),this.onSom?.("escolha")}soltar(t,e){this.ligado&&(this.ligado=!1,e.soltar(),t.rig.setHoldingHands(0),e.rig.setHoldingHands(0))}trocouCorpos(t,e){this.ligado&&(this.lado=this.lado===1?-1:1,this.aplicar(t,e))}update(t,e,n){if(!this.ligado)return;if(e.riding||n.riding||e.submersion>.05||n.submersion>.05||n.hasOrder){this.soltar(e,n);return}const s=Math.hypot(n.position.x-e.position.x,n.position.z-e.position.z);if(this.longe=s>Xv?this.longe+t:0,this.longe>=Yv){this.soltar(e,n);return}if(n.direcaoDoPar=e.rig.facing,this.relogio+=t,this.relogio>=Sl){this.relogio-=Sl;const o=e.position.clone().add(n.position).multiplyScalar(.5);this.coracoes.soltar(o,0,0,2.05),this.onSom?.("coracao")}}aplicar(t,e){e.atrelar(this.lado,Wv),e.direcaoDoPar=t.rig.facing,t.rig.setHoldingHands(this.lado),e.rig.setHoldingHands(this.lado===1?-1:1)}}function re(i,t,e){const n=i.createOscillator();n.type=e.tipo??"sine",n.frequency.setValueAtTime(e.freq,e.quando),e.glide&&n.frequency.exponentialRampToValueAtTime(Math.max(20,e.glide),e.quando+e.dur),e.detune&&n.detune.setValueAtTime(e.detune,e.quando);const s=i.createGain(),o=e.vol??.2,a=e.ataque??.006;s.gain.setValueAtTime(1e-4,e.quando),s.gain.exponentialRampToValueAtTime(o,e.quando+a),s.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur);let r=s;if(e.abafo){const c=i.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(e.abafo,e.quando),s.connect(c),r=c}n.connect(s),r.connect(t),n.start(e.quando),n.stop(e.quando+e.dur+.05)}let oo=null;function Jv(i){if(!oo||oo.sampleRate!==i.sampleRate){const t=i.createBuffer(1,i.sampleRate,i.sampleRate),e=t.getChannelData(0);for(let n=0;n<e.length;n++)e[n]=Math.random()*2-1;oo=t}return oo}function en(i,t,e){const n=i.createBufferSource();n.buffer=Jv(i),n.loop=!0;const s=i.createBiquadFilter();s.type=e.tipo??"bandpass",s.frequency.setValueAtTime(e.freq??1800,e.quando),e.glide&&s.frequency.exponentialRampToValueAtTime(Math.max(60,e.glide),e.quando+e.dur),s.Q.setValueAtTime(e.q??1.2,e.quando);const o=i.createGain(),a=e.vol??.14;o.gain.setValueAtTime(1e-4,e.quando),o.gain.exponentialRampToValueAtTime(a,e.quando+.008),o.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur),n.connect(s),s.connect(o),o.connect(t),n.start(e.quando),n.stop(e.quando+e.dur+.05)}function pe(i){return 440*Math.pow(2,(i-69)/12)}function Zv(i){let t=i>>>0;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}const Kv=[0,2,4,7,9,12,14,16],Se=72,Lh={passo:({ctx:i,destino:t,t:e,n})=>{const s=n%2===0;en(i,t,{quando:e,dur:.075,vol:.05,freq:s?1500:1150,glide:s?700:560,q:.9}),re(i,t,{freq:s?128:112,quando:e,dur:.06,vol:.045,tipo:"sine"})},nadar:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.34,vol:.07,freq:700,glide:2600,q:.7})},agua:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.42,vol:.2,freq:2400,glide:500,q:.6}),re(i,t,{freq:420,glide:120,quando:e,dur:.26,vol:.1,tipo:"sine"})},prompt:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+12),quando:e,dur:.09,vol:.055,tipo:"triangle"})},interagir:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+4),quando:e,dur:.12,vol:.13,tipo:"triangle"}),re(i,t,{freq:pe(Se+11),quando:e+.055,dur:.16,vol:.1,tipo:"sine"})},fala:({ctx:i,destino:t,t:e,n})=>{const s=Kv[n%4]+(n%8<4?0:2);re(i,t,{freq:pe(Se+7+s),quando:e,dur:.06,vol:.035,tipo:"square",abafo:2200})},escolha:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+7),quando:e,dur:.07,vol:.08,tipo:"triangle"})},confirma:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+4),quando:e,dur:.1,vol:.12,tipo:"triangle"}),re(i,t,{freq:pe(Se+9),quando:e+.07,dur:.14,vol:.11,tipo:"triangle"}),re(i,t,{freq:pe(Se+16),quando:e+.14,dur:.2,vol:.09,tipo:"sine"})},porta:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.3,vol:.11,freq:900,glide:320,q:.8}),re(i,t,{freq:180,glide:90,quando:e+.16,dur:.2,vol:.09,tipo:"sine"})},memoria:({ctx:i,destino:t,t:e})=>{[0,4,7,12,16].forEach((n,s)=>{re(i,t,{freq:pe(Se+n),quando:e+s*.075,dur:.42,vol:.11-s*.008,tipo:"triangle"})})},toast:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+9),quando:e,dur:.14,vol:.09,tipo:"sine"}),re(i,t,{freq:pe(Se+16),quando:e+.08,dur:.22,vol:.07,tipo:"sine"})},trocar:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se),glide:pe(Se+12),quando:e,dur:.18,vol:.09,tipo:"triangle"}),en(i,t,{quando:e,dur:.2,vol:.05,freq:800,glide:3e3,q:.6})},beijo:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.06,vol:.1,freq:2400,glide:1200,q:2.5}),re(i,t,{freq:pe(Se+7),quando:e+.02,dur:.1,vol:.08,tipo:"sine"})},coracao:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+12),quando:e,dur:.3,vol:.07,tipo:"sine"}),re(i,t,{freq:pe(Se+19),quando:e+.09,dur:.36,vol:.05,tipo:"sine"})},lancar:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.26,vol:.12,freq:600,glide:3200,q:.7}),re(i,t,{freq:300,glide:900,quando:e,dur:.16,vol:.06,tipo:"triangle"})},pegar:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.09,vol:.13,freq:1400,glide:500,q:1.6}),re(i,t,{freq:pe(Se+9),quando:e+.03,dur:.14,vol:.1,tipo:"triangle"})},quicar:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:220,glide:110,quando:e,dur:.12,vol:.08,tipo:"sine"}),en(i,t,{quando:e,dur:.1,vol:.06,freq:900,glide:400,q:1})},sorvete:({ctx:i,destino:t,t:e})=>{[0,7,12].forEach((n,s)=>{re(i,t,{freq:pe(Se+4+n),quando:e+s*.09,dur:.3,vol:.1,tipo:"triangle"})})},pato:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:620,glide:380,quando:e,dur:.13,vol:.1,tipo:"sawtooth",abafo:1400}),re(i,t,{freq:520,glide:300,quando:e+.15,dur:.12,vol:.08,tipo:"sawtooth",abafo:1200})},tv:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.18,vol:.07,freq:3e3,glide:1200,q:.5}),re(i,t,{freq:pe(Se+4),quando:e+.1,dur:.18,vol:.07,tipo:"square",abafo:1800})},sino:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+12),quando:e,dur:.9,vol:.09,tipo:"sine"}),re(i,t,{freq:pe(Se+19),quando:e+.02,dur:.8,vol:.05,tipo:"sine",detune:6})},sentar:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.24,vol:.09,freq:700,glide:260,q:.7})},menu:({ctx:i,destino:t,t:e})=>{re(i,t,{freq:pe(Se+2),quando:e,dur:.1,vol:.09,tipo:"triangle"}),re(i,t,{freq:pe(Se+9),quando:e+.06,dur:.14,vol:.07,tipo:"triangle"})},diario:({ctx:i,destino:t,t:e})=>{en(i,t,{quando:e,dur:.22,vol:.09,freq:1200,glide:3e3,q:.6})},recomecar:({ctx:i,destino:t,t:e})=>{[0,4,7,12].forEach((n,s)=>{re(i,t,{freq:pe(Se-12+n),quando:e+s*.11,dur:.5,vol:.1,tipo:"triangle"})})}},$v=.2,Qv=1.3,Fi=i=>({raiz:i,notas:[0,4,7,11]}),rs=i=>({raiz:i,notas:[0,3,7,10]}),ao=i=>({raiz:i,notas:[0,4,7,10]}),t_=i=>({raiz:i,notas:[0,4,7,9]}),_a=[0,2,4,7,9,12,14,16,19],e_=[0,2,3,5,7,9,10,12,14],vo={casa:{bpm:82,tonica:41,giro:[Fi(0),rs(9),rs(2),ao(7)],melodia:.62,chocalho:!1,escala:_a},"villa-lobos":{bpm:100,tonica:36,giro:[Fi(0),Fi(5),rs(9),ao(7)],melodia:.8,chocalho:!0,escala:_a},clube:{bpm:92,tonica:38,giro:[t_(0),rs(2),Fi(5),ao(7)],melodia:.72,chocalho:!0,escala:_a},padrao:{bpm:88,tonica:40,giro:[Fi(0),rs(9),Fi(5),ao(7)],melodia:.6,chocalho:!1,escala:e_}},bl=[[0,2,3,6],[0,3,4,6,7],[2,3,5,6],[0,1,3,6],[0,4,6],[1,3,4,7]];class Dh{constructor(t,e){this.ctx=t,this.destino=e}clima=vo.padrao;proximoClima=null;passo=0;proximo=0;timer=null;sorte=Zv(20260827);frase=[];grau=2;get tocando(){return this.timer!==null}setClima(t){const e=vo[t]??vo.padrao;e!==this.clima&&(this.tocando?this.proximoClima=e:this.clima=e)}start(){this.timer===null&&(this.proximo=this.ctx.currentTime+.15,this.timer=window.setInterval(()=>this.agendar(),$v*1e3),this.agendar())}stop(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}preAgendar(t){for(this.proximo=0,this.passo=0;this.proximo<t;){this.tocarPasso(this.passo,this.proximo);const e=30/this.clima.bpm;this.proximo+=e*(this.passo%2===0?1.18:.82),this.passo+=1}}agendar(){const t=this.ctx.currentTime+Qv;let e=0;for(;this.proximo<t&&e++<64;){this.tocarPasso(this.passo,this.proximo);const n=30/this.clima.bpm;this.proximo+=n*(this.passo%2===0?1.18:.82),this.passo+=1}}tocarPasso(t,e){const n=t%8;n===0&&(this.proximoClima&&(this.clima=this.proximoClima,this.proximoClima=null),(Math.floor(t/8)%2===0||this.frase.length===0)&&(this.frase=bl[Math.floor(this.sorte()*bl.length)]));const s=this.clima,o=Math.floor(t/8),a=s.giro[o%s.giro.length],r=s.tonica+a.raiz;if(n===0||n===4){const c=n===0?r:r+(this.sorte()<.4?7:4);re(this.ctx,this.destino,{freq:pe(c),quando:e,dur:n===0?.6:.45,vol:.2,tipo:"sine",abafo:420})}if(n===2||n===5||n===7&&this.sorte()<.35){const c=r+24;for(const[l,h]of a.notas.entries())l===0&&n!==2||re(this.ctx,this.destino,{freq:pe(c+h),quando:e,dur:.85,vol:.07,tipo:"triangle",ataque:.03,detune:l%2?5:-5,abafo:2400})}if(this.frase.includes(n)&&this.sorte()<s.melodia){const c=[-2,-1,-1,0,1,1,2];this.grau+=c[Math.floor(this.sorte()*c.length)],this.grau>s.escala.length-3&&(this.grau-=2),this.grau<2&&(this.grau+=2),this.grau=Math.max(0,Math.min(s.escala.length-1,this.grau));const l=n>=6?a.notas[Math.floor(this.sorte()*3)]:s.escala[this.grau],h=s.tonica+31;this.marimba(pe(h+l),e),l<=9&&this.sorte()<.22&&this.marimba(pe(h+l+12),e+.03,.4)}s.chocalho&&n%2===1&&en(this.ctx,this.destino,{quando:e,dur:.06,vol:n===3||n===7?.035:.02,freq:6200,q:.8})}marimba(t,e,n=1){re(this.ctx,this.destino,{freq:t,quando:e,dur:.42,vol:.13*n,tipo:"sine"}),t<900&&re(this.ctx,this.destino,{freq:t*2,quando:e,dur:.1,vol:.04*n,tipo:"sine"})}}const wl="aristory.som",n_=.035;class i_{ctx=null;mestre=null;canalMusica=null;canalEfeitos=null;musica=null;mudo;climaPendente="padrao";contadores=new Map;ultimoEm=new Map;carregando=null;contagem=new Map;constructor(){this.mudo=localStorage.getItem(wl)==="0";const t=()=>this.ligar();for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,t,{once:!1,passive:!0})}get ligado(){return!this.mudo}get pronto(){return this.ctx!==null&&this.ctx.state==="running"}ligar(){if(!this.ctx){const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,this.mestre=e.createGain(),this.mestre.gain.value=this.mudo?0:.9,this.mestre.connect(e.destination),this.canalMusica=e.createGain(),this.canalMusica.gain.value=.9,this.canalMusica.connect(this.mestre),this.canalEfeitos=e.createGain(),this.canalEfeitos.gain.value=1,this.canalEfeitos.connect(this.mestre),this.musica=new Dh(e,this.canalMusica),this.musica.setClima(this.climaPendente)}this.ctx.resume().then(()=>{this.mudo||this.musica?.start()})}setMudo(t){if(this.mudo=t,localStorage.setItem(wl,t?"0":"1"),this.mestre&&this.ctx){const e=this.ctx.currentTime;this.mestre.gain.cancelScheduledValues(e),this.mestre.gain.setValueAtTime(this.mestre.gain.value,e),this.mestre.gain.linearRampToValueAtTime(t?0:.9,e+.12)}t?this.musica?.stop():this.ctx?.state==="running"&&this.musica?.start()}setClima(t){this.climaPendente=t,this.musica?.setClima(t)}play(t){if(this.contagem.set(t,(this.contagem.get(t)??0)+1),this.mudo||!this.ctx||!this.canalEfeitos||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(e-(this.ultimoEm.get(t)??-1)<n_)return;this.ultimoEm.set(t,e);const n=(this.contadores.get(t)??0)+1;this.contadores.set(t,n),Lh[t]({ctx:this.ctx,destino:this.canalEfeitos,t:e,n})}carga(t){if(!this.ctx||!this.canalEfeitos||this.mudo||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(t===null){if(this.carregando){const{osc:s,ganho:o}=this.carregando;o.gain.cancelScheduledValues(e),o.gain.setValueAtTime(o.gain.value,e),o.gain.exponentialRampToValueAtTime(1e-4,e+.08),s.stop(e+.1),this.carregando=null}return}if(!this.carregando){const s=this.ctx.createOscillator();s.type="triangle";const o=this.ctx.createGain();o.gain.setValueAtTime(1e-4,e),o.gain.exponentialRampToValueAtTime(.05,e+.05),s.connect(o),o.connect(this.canalEfeitos),s.start(e),this.carregando={osc:s,ganho:o}}const n=pe(60+t*19);this.carregando.osc.frequency.setTargetAtTime(n,e,.04)}aplauso(){if(!this.ctx||!this.canalEfeitos)return;const t=this.ctx.currentTime;[0,5,9,12].forEach((e,n)=>{re(this.ctx,this.canalEfeitos,{freq:pe(72+e),quando:t+n*.1,dur:.5,vol:.09,tipo:"triangle"})})}}const s_={magro:.86,medio:1,forte:1.16},El=.75,o_=.13,a_={upright:{bracoX:-1.38,bracoZ:.16,balanco:.15,itemZ:0,itemX:0},relaxed:{bracoX:-.22,bracoZ:.46,balanco:.6,itemZ:.9,itemX:.13}};function xa(i,t,e){const n=new Ro,s=5;for(let a=0;a<s*2;a++){const r=a%2===0?i:i*.46,c=a/(s*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*r,h=Math.sin(c)*r;a===0?n.moveTo(l,h):n.lineTo(l,h)}n.closePath();const o=new Xr(n,{depth:t,bevelEnabled:!1});return o.center(),new x(o,e)}class wr{group=new ct;spec;headTop;body=new ct;head=new ct;armL=new ct;armR=new ct;maoDir=new ct;legL=new ct;legR=new ct;blob;chapeu=new ct;phase=0;bounce=0;beijo=0;maos=0;pose="none";patinando=!1;altoDoPatins=0;alturaDaPerna=0;pes=[];patins=[];targetFacing=0;swimming=!1;sitting=!1;trocaMaterial=[];soVestido=[];soBanho=[];traje="normal";roupa={};extras=new Map;medidas;sobreTronco=[];cabelo;constructor(t){this.spec=t;const e=t.height,n=s_[t.build],s=e*.28,o=e/1.7;this.altoDoPatins=o_*o,this.alturaDaPerna=s;const a=e*.3,r=e*.17,c=s,l=s+a*.86,h=e*.1*n,u=e*.3;this.headTop=s+a+r*2.1,this.medidas={h:e,w:n,headR:r,legH:s,torsoH:a};const d=P(t.skin),f=P(t.shirt),g=P(t.pants),_=P(t.shoes);for(const[C,y]of[[this.legL,-1],[this.legR,1]]){C.position.set(y*e*.055*n,c,0);const v=new x(new Fn(e*.042*n,s*.62,4,10),g);v.position.y=-s*.48,C.add(v),this.trocaMaterial.push({mesh:v,normal:g,banho:d,slot:"pernas",parte:"principal"});const D=new x(new G(e*.075*n,e*.045,e*.11),_);D.position.set(0,-s+e*.022,e*.018),C.add(D),this.trocaMaterial.push({mesh:D,normal:_,banho:d,slot:"pes",parte:"principal"}),this.pes.push(D);const F=_r(t.shoes);F.scale.setScalar(o),F.visible=!1,C.add(F),this.patins.push(F),this.body.add(C)}const m=new x(new Fn(e*.105*n,a*.5,5,12),f);if(m.position.y=c+a*.52,m.scale.z=.82,this.body.add(m),this.trocaMaterial.push({mesh:m,normal:f,banho:d,slot:"tronco",parte:"principal"}),t.shirtAccent!==void 0){const C=new x(new it(e*.108*n,e*.108*n,e*.03,14,1,!0),P(t.shirtAccent,{doubleSide:!0}));C.position.y=c+a*.72,C.scale.z=.82,this.body.add(C),this.soVestido.push(C),this.sobreTronco.push(C)}if(t.jacket!==void 0){const C=P(t.jacket,{doubleSide:!0}),y=e*.105*n,v=new x(new it(y*1.14,y*1.1,a*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),C);v.position.y=c+a*.56,v.scale.z=.84,this.body.add(v),this.soVestido.push(v),this.sobreTronco.push(v);const D=new x(new zt(e*.088*n,12,10,0,Math.PI*2,0,Math.PI*.62),P(t.jacket));D.position.set(0,l+a*.04,-y*.75),D.rotation.x=-.7,D.scale.set(1.15,1,.8),this.body.add(D),this.soVestido.push(D),this.sobreTronco.push(D)}const p=new x(new it(e*.118*n,e*.112*n,e*.15,14),P(t.swim??t.pants));p.position.y=c+e*.03,p.scale.z=.85,p.visible=!1,this.body.add(p),this.soBanho.push(p);for(const[C,y]of[[this.armL,-1],[this.armR,1]]){C.position.set(y*h,l,0);const v=t.jacket!==void 0?P(t.jacket):f,D=new x(new Fn(e*.038*n,u*.34,4,10),v);D.position.y=-u*.24,C.add(D),this.trocaMaterial.push({mesh:D,normal:v,banho:d,slot:"tronco",parte:"detalhe"});const F=new x(new Fn(e*.032*n,u*.28,4,10),d);F.position.y=-u*.66,C.add(F);const z=new x(new zt(e*.04*n,10,8),d);z.position.y=-u*.92,C.add(z),this.body.add(C)}this.maoDir.position.y=-u*.98,this.armR.add(this.maoDir),this.head.position.y=s+a+r*.92;const T=new x(new it(e*.035,e*.04,e*.05,10),d);T.position.y=-r*.85,this.head.add(T);const w=new x(new zt(r,20,16),d);w.scale.set(1,1.04,1),this.head.add(w);const M=P(t.eyes);for(const C of[-1,1]){const y=new x(new zt(r*.14,10,8),M);if(y.position.set(C*r*.35,0,r*.9),y.scale.set(1,1.25,.6),this.head.add(y),t.blush!==void 0){const v=new x(new bs(r*.16,12),Vn(t.blush,.75));v.position.set(C*r*.56,-r*.26,r*.82),v.rotation.y=C*.35,this.head.add(v)}}const I=P(t.hair.color);for(const C of[-1,1]){const y=new x(new G(r*.3,r*.075,r*.06),I);y.position.set(C*r*.35,r*.3,r*.87),y.rotation.z=C*-.12,this.head.add(y)}const E=new x(new ye(r*.16,r*.035,6,14,Math.PI),M);E.position.set(0,-r*.38,r*.9),E.rotation.set(0,0,Math.PI),this.head.add(E);const A=this.head.children.length;this.buildHair(r),this.cabelo=this.head.children.slice(A),this.buildAccessories(r,u,l,h,a,c,n),this.body.add(this.head),this.group.add(this.body),this.blob=new x(new bs(e*.16*n,18),Vn(2832939,.22)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(C=>{C.isMesh&&C!==this.blob&&(C.castShadow=!0,C.receiveShadow=!1)})}buildHair(t){const{style:e,color:n}=this.spec.hair,s=P(n),o=(a,r,c=.62,l=0)=>{const h=new x(new zt(t*a,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),s);return h.position.y=r,this.head.add(h),h};switch(e){case"raspado":{o(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{o(1.06,t*.04).scale.set(1,.95,.98);const r=new x(new G(t*1.5,t*.34,t*.42),s);r.position.set(0,t*.6,t*.62),r.rotation.x=-.18,this.head.add(r);break}case"franja":{o(1.07,t*.02);const a=new x(new it(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),s);a.position.set(0,t*.5,0),this.head.add(a);break}case"ondulado":{o(1.08,t*.02);for(const a of[-1,1]){const r=new x(new zt(t*.46,12,10),s);r.position.set(a*t*.85,t*.1,-t*.1),r.scale.set(.8,1.15,1),this.head.add(r)}break}case"coque":{o(1.06,t*.02);const a=new x(new zt(t*.42,12,10),s);a.position.set(0,t*.72,-t*.82),this.head.add(a);break}case"cachos-curtos":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?P(this.spec.hair.tips):s;o(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[u,d,f,g]of l)for(let _=0;_<d;_++){const m=_/d*Math.PI*2+u*1.9,p=Math.sin(u)*Math.cos(m),T=Math.cos(u),w=Math.sin(u)*Math.sin(m);if(T<.72&&w>.24)continue;const M=new x(new zt(t*f*(1+(a-1)*.4),8,7),h%5===0?r:s),I=g*(1+(a-1)*.14),E=w>0?.9:1.02;M.position.set(p*t*I,T*t*I,w*t*I*E),this.head.add(M),h++}for(let u=0;u<5;u++){const d=new x(new zt(t*.2*(1+(a-1)*.3),8,7),u===2?r:s);d.position.set((u-2)*t*.3,t*(.62-u%2*.07),t*.62),this.head.add(d)}for(let u=0;u<3;u++){const d=new x(new zt(t*.24*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1)*t*.3,t*(.84+u%2*.07),t*.44),this.head.add(d)}for(const u of[-1,1]){const d=new x(new zt(t*.17,8,7),s);d.position.set(u*t*.9,-t*.12,t*.22),d.scale.set(.7,1.1,.85),this.head.add(d)}break}case"cacheado":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?P(this.spec.hair.tips):s;o(1+(a-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[u,d,f,g]of l)for(let _=0;_<d;_++){const m=_/d*Math.PI*2+u*2.3,p=Math.sin(u)*Math.cos(m),T=Math.cos(u),w=Math.sin(u)*Math.sin(m);if(u>.72&&w>.22)continue;const M=1+(a-1)*.55,I=new x(new zt(t*f*M,8,7),h%4===0?r:s),E=g*(1+(a-1)*.28),A=w>0?.78:1.06;I.position.set(p*t*E,T*t*E,w*t*E*A),this.head.add(I),h++}for(let u=0;u<4;u++){const d=new x(new zt(t*.22*(1+(a-1)*.4),8,7),u===1?r:s);d.position.set((u-1.5)*t*.34,t*(.62-u%2*.08),t*.62),this.head.add(d)}for(const u of[-1,1]){const d=new x(new zt(t*.26*a,8,7),s);d.position.set(u*t*1.02*a,-t*.34,t*.28),d.scale.set(.8,1.25,.9),this.head.add(d)}break}}}buildAccessories(t,e,n,s,o,a,r){const c=this.spec.accessories??[],l=P(this.spec.accessoryColor??3093568);{const h=new x(new it(t*.7,t*.7,t*.11,16),P(16774096));h.position.y=t*1.42,this.chapeu.add(h);const u=new x(new We(t*.58,t*1.05,14),P(S.gold));u.position.y=t*1.98,this.chapeu.add(u);const d=xa(t*.3,t*.07,P(16774096));d.position.y=t*2.62,this.chapeu.add(d),this.chapeu.rotation.z=-.14,this.chapeu.visible=!1,this.head.add(this.chapeu)}if(c.includes("oculos")){for(const u of[-1,1]){const d=new x(new ye(t*.24,t*.045,8,16),l);d.position.set(u*t*.36,t*.06,t*.9),this.head.add(d)}const h=new x(new G(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new x(new zt(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const u=new x(new it(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);u.position.set(0,t*.12,t*.28),u.rotation.x=-.12,this.head.add(u)}if(c.includes("barba")){const h=new x(new zt(t*.72,14,12),P(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new x(new ye(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const u of[-1,1]){const d=new x(new it(t*.28,t*.28,t*.16,12),l);d.position.set(u*t*1.02,t*.02,0),d.rotation.z=Math.PI/2,this.head.add(d)}}if(c.includes("corrente")){const h=new x(new ye(t*.42,t*.035,6,20),P(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new x(new it(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,u=xa(t*.3,t*.06,P(15918799));u.position.set(-t*.78*h,t*.92*h,t*.62*h),u.rotation.set(.35,-.6,.3),this.head.add(u)}if(c.includes("laco")){const h=this.spec.height,u=new ct,d=h*.105*r,f=new x(new zt(h*.018,8,6),l);u.add(f);for(const g of[-1,1]){const _=new x(new ye(h*.026,h*.007,6,12),l);_.position.set(g*h*.03,h*.008,0),_.rotation.set(0,g*.5,g*.35),_.scale.set(1,.7,1),u.add(_);const m=new x(new G(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,u.add(m)}u.position.set(0,n-o*.1,d*.86),this.body.add(u),this.soVestido.push(u),this.sobreTronco.push(u)}if(c.includes("cinto")){const h=this.spec.height,u=h*.105*r,d=a+o*.08,f=new x(new it(u*1.04,u*1.04,h*.032,16,1,!0),l);f.position.y=d,f.scale.z=.84,this.body.add(f),this.soVestido.push(f),this.sobreTronco.push(f);const g=new x(new G(h*.032,h*.03,h*.012),P(14210252));g.position.set(0,d,u*.9),this.body.add(g),this.soVestido.push(g),this.sobreTronco.push(g);const _=new x(new ye(h*.028,h*.004,5,12,Math.PI),P(14210252));_.position.set(u*.6,d-h*.012,u*.6),_.rotation.set(0,-.7,Math.PI),this.body.add(_),this.soVestido.push(_),this.sobreTronco.push(_);const m=xa(h*.016,h*.004,P(14210252));m.position.set(u*.76,d-h*.05,u*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m),this.sobreTronco.push(m)}if(c.includes("mochila")){const h=new x(new G(s*1.7,o*.62,this.spec.height*.09),l);h.position.set(0,a+o*.6,-this.spec.height*.11*r),this.body.add(h),this.soVestido.push(h),this.sobreTronco.push(h);const u=n;for(const d of[-1,1]){const f=new x(new G(this.spec.height*.022,o*.5,this.spec.height*.02),l);f.position.set(d*s*.6,u-o*.2,this.spec.height*.085*r),this.body.add(f),this.soVestido.push(f),this.sobreTronco.push(f)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setCampeao(t){this.chapeu.visible=t}get campeao(){return this.chapeu.visible}setOutfit(t){this.traje=t,this.aplicarVisual()}aplicarVisual(){const t=this.traje==="banho";for(const s of this.trocaMaterial){if(t){s.mesh.material=s.banho;continue}if(this.mostraPele(s.slot,s.parte)){s.mesh.material=s.banho;continue}const o=this.roupa[s.slot];if(!o){s.mesh.material=s.normal;continue}const a=s.parte==="detalhe"?o.corDetalhe??o.cor:o.cor;s.mesh.material=a===void 0?s.normal:P(a)}for(const s of this.soVestido)s.visible=!t;for(const s of this.soBanho)s.visible=t;if(!t&&this.roupa.tronco)for(const s of this.sobreTronco)s.visible=!1;for(const[s,o]of this.extras){const a=this.roupa[s]!==void 0&&(s==="cabeca"||!t)&&!(s==="pes"&&this.patinando);for(const r of o)r.visible=a}for(const s of this.pes)s.visible=!this.patinando;for(const s of this.patins)s.visible=this.patinando;const n=this.roupa.cabeca?.cobreCabelo===!0;for(const s of this.cabelo)s.visible=!n}mostraPele(t,e){for(const n of Object.values(this.roupa))if(n&&(n.pernasNuas&&t==="pernas"&&!this.roupa.pernas||n.bracosNus&&t==="tronco"&&e==="detalhe"))return!0;return!1}vestirRoupa(t){for(const e of xi){const n=t[e]??null;if((this.roupa[e]?.id??null)===n)continue;this.tirarExtras(e);const s=n?Mr(n):null;this.roupa[e]=s??void 0,s?.extra&&this.porExtras(e,s)}this.aplicarVisual()}get roupaAtual(){const t={};for(const e of xi){const n=this.roupa[e];n&&(t[e]=n.id)}return t}porExtras(t,e){if(!e.extra&&!e.extraBraco)return;const n=[];if(e.extra){const o=t==="pes"||t==="pernas"?[this.legL,this.legR]:t==="cabeca"?[this.head]:[this.body];for(const a of o)n.push([a,"corpo"])}e.extraBraco&&n.push([this.armL,"braco"],[this.armR,"braco"]);const s=[];for(const[o,a]of n){const r=a==="braco"?e.extraBraco(this.medidas):e.extra(this.medidas);r.userData.roupa=e.id,r.traverse(c=>{c.isMesh&&(c.castShadow=!0,c.receiveShadow=!1)}),o.add(r),s.push(r)}this.extras.set(t,s)}tirarExtras(t){const e=this.extras.get(t);if(e){for(const n of e)n.parent?.remove(n),n.traverse(s=>{const o=s;o.isMesh&&o.geometry.dispose()});this.extras.delete(t)}}setSitting(t){this.sitting=t,t||(this.poeAltura(0),this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setPatins(t){if(this.patinando!==t){this.patinando=t;for(const e of this.patins)e.position.y=-this.alturaDaPerna-this.altoDoPatins;this.aplicarVisual()}}get patinandoAgora(){return this.patinando}segurar(t,e="none"){for(let n=this.maoDir.children.length-1;n>=0;n--)this.maoDir.remove(this.maoDir.children[n]);this.pose=t?e:"none",t&&this.maoDir.add(t)}get segurando(){return this.maoDir.children.length>0}setHoldingHands(t){this.maos=t}get holdingHands(){return this.maos!==0}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let n=this.targetFacing-this.group.rotation.y;if(n=Math.atan2(Math.sin(n),Math.cos(n)),this.group.rotation.y+=n*Math.min(1,t*14),this.beijo>.001){const c=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=c*.3,this.poeAltura(c*.045),this.armL.rotation.set(-c*.55,0,.08+c*.16),this.armR.rotation.set(-c*.55,0,-.08-c*.16),this.head.rotation.x=c*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9;const c=Math.sin(this.phase*2.2)*.17;this.legL.rotation.x=-Math.PI/2+.06+c,this.legR.rotation.x=-Math.PI/2-.02-c,this.armL.rotation.set(-.25,0,-.34),this.armR.rotation.set(-.2,0,.34),this.maos!==0&&(this.maos<0?this.armL:this.armR).rotation.set(.12,0,El*.8*this.maos),this.body.rotation.x=-.05,this.poeAltura(Math.sin(this.phase)*.012),this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const c=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+c*.9,this.armR.rotation.x=-1.1-c*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=c*.28,this.legR.rotation.x=-c*.28,this.body.rotation.x=.16,this.poeAltura(Math.sin(this.phase)*.03),this.head.rotation.x=-.14;return}const s=e>.05,o=this.patinando?.9+e*.33:3.2+e*1.9;this.phase+=t*(s?o:1.4);const a=s?this.patinando?Math.min(.34,.12+e*.06):Math.min(.62,.16+e*.14):.04,r=Math.sin(this.phase*(s?2:1));if(this.patinando){const c=s?Math.min(.28,.1+e*.04):.03;this.legL.rotation.z=-Math.max(0,r)*c*1.7,this.legR.rotation.z=Math.max(0,-r)*c*1.7,this.legL.rotation.x=s?r*a*.25:0,this.legR.rotation.x=s?-r*a*.25:0,this.body.rotation.z=r*c*.34;const l=.34+Math.abs(r)*.14;this.armL.rotation.x=s?-r*a*.9:0,this.armR.rotation.x=s?r*a*.9:0,this.armL.rotation.z=-l,this.armR.rotation.z=l}else this.legL.rotation.z=0,this.legR.rotation.z=0,this.body.rotation.z=0,this.legL.rotation.x=s?r*a:0,this.legR.rotation.x=s?-r*a:0,this.armL.rotation.x=s?-r*a*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=s?r*a*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08;if(this.maos!==0){const c=this.maos<0?this.armL:this.armR,l=this.maos<0?this.armR:this.armL;c.rotation.z=El*this.maos,c.rotation.x=-.1,l.rotation.x*=.5}if(this.aplicarPose(),this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const c=Math.sin((1-this.bounce)*Math.PI)*.28;this.poeAltura(c),this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const c=s?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.poeAltura(c),this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=s?this.patinando?.16:.06:0,this.head.rotation.x=s?-.05:Math.sin(this.phase*.6)*.03}poeAltura(t){this.body.position.y=t+this.altoDoPatins*(this.patinando?1:0)}aplicarPose(){if(this.pose==="none"||this.maos>0){this.maoDir.rotation.set(0,0,0),this.maoDir.position.x=0;return}const t=a_[this.pose];this.armR.rotation.x=t.bracoX+this.armR.rotation.x*t.balanco,this.armR.rotation.z=t.bracoZ,this.maoDir.rotation.set(-this.armR.rotation.x,0,t.itemZ-this.armR.rotation.z),this.maoDir.position.x=t.itemX}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class r_{renderer;cena=new nh;camera=new sn(30,1,.1,20);pedestal=new ct;rig=null;spec=null;giro=0;alvo=0;constructor(t){this.renderer=new Sh({canvas:t,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.cena.add(this.pedestal);const e=new gh(16777215,8952234,1.5);this.cena.add(e);const n=new dr(16774368,1.5);n.position.set(3,5,4),this.cena.add(n);const s=new dr(12572927,.5);s.position.set(-3,2,-3),this.cena.add(s)}mostrar(t){if(this.spec?.id===t.id)return;this.rig&&(this.pedestal.remove(this.rig.group),this.rig.dispose()),this.spec=t,this.rig=new wr(t),this.pedestal.add(this.rig.group);const e=t.height;this.rig.group.position.y=-e*.5,this.camera.position.set(0,e*.04,e*2.28),this.camera.lookAt(0,0,0)}vestir(t){this.rig?.vestirRoupa(t)}girar(t){this.alvo+=t}update(t){this.rig&&(this.giro+=(this.alvo-this.giro)*Math.min(1,t*9),this.pedestal.rotation.y=this.giro,this.rig.update(t,0))}desenhar(){if(!this.rig)return;const t=this.renderer.domElement,e=t.clientWidth,n=t.clientHeight;e<2||n<2||((t.width!==e||t.height!==n)&&this.renderer.setSize(e,n,!1),this.camera.aspect=e/n,this.camera.updateProjectionMatrix(),this.renderer.render(this.cena,this.camera))}dispose(){this.rig?.dispose(),this.rig=null,this.spec=null,this.renderer.dispose()}}class c_{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;if(!this.enabled){this.hot=!1,this.pulse=0,this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const n=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(n*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(n*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}class l_{constructor(t){this.game=t}root=new ct;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,n,s,o=0){return t.position.set(e,n,s),t.rotation.y=o,t}ground(t){const e=new on(t.width,t.depth,1,1),n=new x(e,P(t.color));return n.rotation.x=-Math.PI/2,n.position.set(t.x??0,t.y??0,t.z??0),n.receiveShadow=!0,this.root.add(n),n}groundWithHoles(t){const e=t.width/2,n=t.depth/2,s=new Ro;s.moveTo(-e,-n),s.lineTo(e,-n),s.lineTo(e,n),s.lineTo(-e,n),s.closePath();for(const a of t.holes){const r=new lr,c=a.x-a.width/2,l=a.x+a.width/2,h=-a.z-a.depth/2,u=-a.z+a.depth/2;r.moveTo(c,h),r.lineTo(l,h),r.lineTo(l,u),r.lineTo(c,u),r.closePath(),s.holes.push(r)}const o=new x(new Yr(s),P(t.color));return o.rotation.x=-Math.PI/2,o.position.set(t.x??0,t.y??0,t.z??0),o.receiveShadow=!0,this.root.add(o),o}patch(t,e,n,s,o,a=0,r=.01){const c=new x(new on(n,s),P(o,{offset:++this.decalque}));return c.rotation.set(-Math.PI/2,0,0),c.rotation.z=a,c.position.set(t,r,e),c.receiveShadow=!0,this.root.add(c),c}disc(t,e,n,s,o=.01){const a=new x(new bs(n,28),P(s,{offset:++this.decalque}));return a.rotation.x=-Math.PI/2,a.position.set(t,o,e),a.receiveShadow=!0,this.root.add(a),a}blockBox(t,e,n,s,o=0){this.colliders.push({kind:"box",x:t,z:e,hw:n,hd:s,rot:o})}blockCircle(t,e,n){this.colliders.push({kind:"circle",x:t,z:e,r:n})}blockFrom(t,e=.9){const n=new Zi().setFromObject(t),s=n.getSize(new U),o=n.getCenter(new U);this.blockBox(o.x,o.z,s.x/2*e,s.z/2*e,0)}setBounds(t,e,n,s){this.bounds={minX:t,minZ:e,maxX:n,maxZ:s}}wall(t,e,n,s,o=3,a=15984595,r=.3){const c=n-t,l=s-e,h=Math.hypot(c,l),u=Math.atan2(l,c),d=new x(new G(h,o,r),P(a));return d.position.set((t+n)/2,o/2,(e+s)/2),d.rotation.y=-u,this.add(d),this.blockBox((t+n)/2,(e+s)/2,h/2,r/2,-u),d}interact(t){const e=new c_(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}banco(t,e,n=0,s){const o=this.add(this.place(bh(s),t,0,e,n));this.blockBox(t,e,.95,.35,n);const a=new Ae;a.position.set(t,0,e),a.rotation.y=n+Math.PI,this.root.add(a);const r=new Ae;r.position.set(t,.9,e),this.root.add(r);const c=.06,l=.46;return this.interact({id:`banco:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:1.9,label:"Sentar no banco",icon:"🪑",highlight:o,onInteract:async h=>{h.lockPlayer(!0),h.ridePlayer(a,new U(-l,c,.02),1,Math.PI),h.rideCompanion(a,new U(l,c,.02),1,Math.PI),h.setSitting(!0),h.focusCamera(r),await h.wait(.5),await h.say(["Senta aqui um pouco."],h.companionName()),await h.say(["Só um pouquinho."],h.playerName());let u=0;for(;u===0;)u=await h.ask("Ficar mais um pouco?",["Ficar","Levantar"]),u===0&&await h.wait(4);h.setSitting(!1),h.focusCamera(null);const d=n,f=Math.sin(d)*1.5,g=Math.cos(d)*1.5;h.releasePlayer(t+f-Math.cos(d)*.5,e+g+Math.sin(d)*.5,d),h.releaseCompanion(t+f+Math.cos(d)*.5,e+g-Math.sin(d)*.5,d),h.lockPlayer(!1)}}),o}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}class h_{constructor(t,e,n,s=Object.keys(e)[0]){this.root=t,this.scenes=e,this.dupla=n,this.cenaInicial=s,this.renderer=new Sh({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ul,t.appendChild(this.renderer.domElement),this.ui=new Dv(t),this.previa=new r_(this.ui.canvasDoBoneco()),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onEscolherSlot=a=>this.setActiveHandSlot(a),this.ui.onMoverItem=(a,r)=>this.moveItem(a,r),this.ui.onDescartar=a=>this.descartarDaVaga(a),this.ui.onAbrirMochila=()=>this.pintarMochila(),this.ui.onAbrirArmario=()=>this.pintarArmario(),this.ui.onGirarBoneco=a=>this.previa.girar(a),this.ui.onTirarParte=a=>{const r=this.playerId(),c=this.save.vestiveis(r)[a];if(c){if(this.save.despir(r,a),this.save.guardar(r,c)==="cheio"){this.save.vestir(r,c),this.ui.toast("Mochila cheia","🎒");return}this.audio.play("escolha"),this.pintarArmario()}},this.ui.onVestirPeca=a=>{const r=this.playerId(),c=this.save.maos(r).find(u=>u?.id===a);if(!c)return;const l=c.slot?xi.indexOf(c.slot):-1;if(l<0)return;const h=this.save.vestiveis(r)[l];this.save.largar(r,a),h&&this.save.despir(r,l),this.save.vestir(r,c),h&&this.save.guardar(r,h),this.audio.play("escolha"),this.pintarArmario()},this.ui.onTouchHold=a=>this.input.setVirtualDown("KeyF",a),this.ui.onRestart=()=>this.restart(),this.ui.som=a=>this.audio.play(a),this.ui.onToggleSom=()=>{this.audio.setMudo(this.audio.ligado),this.ui.setSom(this.audio.ligado),this.audio.ligado&&this.audio.play("menu")},this.ui.setSom(this.audio.ligado),this.input=new Xg(this.renderer.domElement),this.hemi=new gh(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new dr(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const o=this.sun.shadow.camera;o.left=-22,o.right=22,o.top=22,o.bottom=-22,o.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new Uv(new wr(n[0])),this.scene.add(this.player.object),this.coracoes=new Ov(this.scene),this.beijo=new Hv(this.coracoes),this.beijo.onSom=a=>this.audio.play(a),this.maos=new jv(this.coracoes),this.maos.onSom=a=>this.audio.play(a),this.parceiro=new Nv(new wr(n[1]??n[0])),this.parceiro.setVisible(n.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new nh;iso=new qg;input;ui;save=new Kr;previa;player;parceiro;clock=new cf;coracoes;beijo;maos;audio=new i_;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;naMao=new Map;trilha=0;elapsed=0;shadowSpan=0;traje="normal";moveDir=new U;camAim=new U;camOmbro=null;async start(t,e){const n=t??(this.scenes[this.save.scene]?this.save.scene:this.cenaInicial);this.build(n,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}restart(){this.save.reset(),this.ui.setMemories(this.save.memories),this.player.rig.spec.id!==this.dupla[0].id&&this.swapCharacters(),this.ui.showHints(),this.goTo(this.cenaInicial),this.audio.play("recomecar"),this.ui.toast("Do começo, então","🔄")}build(t,e){const n=this.scenes[t];if(!n)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const s=new l_(this);s.setSeed(u_(t)),n.build(s),this.scene.add(s.root),this.current={def:n,world:s},this.applyAmbient(n.ambient);const o=e&&n.entries?.[e]||n.spawn;this.player.teleport(o.x,o.z,o.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const a=(o.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(o.x+Math.sin(a)*1.3,o.z+Math.cos(a)*1.3,o.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.maos.soltar(this.player,this.parceiro),this.coracoes.limpar(),this.podeBeijar=!1,this.camOmbro=null,this.ui.showPlacar(null),this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(n.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(n.name,n.subtitle),this.audio.setClima(t),this.migrarPremios(),this.aplicarPremios(),this.save.scene=t}aplicarPremios(){this.sincronizarVestiveis()}migrarPremios(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id;this.save.flag(`chapeu-ping-pong:${e}`)&&(this.save.achouItem(e,ce.chapeuPingPong.id)||this.save.vestir(e,ce.chapeuPingPong))}}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new ae(t.sky),this.scene.fog=t.fog!==void 0?new Hr(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const n=this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.mochilaOpen||this.ui.armarioOpen||this.transitioning;this.input.blocked=n||this.player.locked,this.input.justPressed("KeyJ")&&!this.ui.menuOpen&&this.ui.toggleJournal(),(this.input.justPressed("KeyI")||this.input.justPressed("Tab"))&&!this.ui.menuOpen&&!this.ui.dialogueOpen&&(this.ui.armarioOpen?this.ui.fecharArmario():this.ui.mochilaOpen?this.ui.closeMochila():this.abrirMochila()),this.ui.armarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharArmario(),(this.ui.mochilaOpen||this.ui.armarioOpen?!this.ui.dialogueOpen&&!this.ui.menuOpen&&!this.transitioning:!n)&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),n||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1)),!n&&!this.player.locked&&this.input.justPressed("KeyH")&&this.maoNaMao();const a=this.input.justPressed("KeyE")||this.input.justPressed("Space");a&&this.ui.handleAction()||(a&&!n&&this.hot&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.audio.play("interagir"),this.hot.trigger(this)):a&&!n&&this.podeBeijar&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)):a&&!n&&!this.player.locked&&this.maoNaMao()),this.beijo.update(t,this.player,this.parceiro),this.maos.update(t,this.player,this.parceiro);const r=this.input.move();this.iso.screenToWorld(r.x,r.y,this.moveDir);const c=this.player.position.clone();this.player.update(this.moveDir,t,e.colliders,e.bounds),this.ouvirPassos(c),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.coracoes.update(t),this.sincronizarMaos(),this.sincronizarVestiveis(),this.updateHot(e,t),this.updateBeijo();for(const u of e.updaters)u(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const l=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(l);const h=l/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*h,this.camAim.y+20*h,this.camAim.z+9*h),this.renderer.render(this.scene,this.camOmbro??this.iso.camera),this.ui.armarioOpen&&(this.previa.update(t),this.previa.desenhar()),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.ui.menuOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro)}maoNaMao(){this.maos.ativo?(this.maos.soltar(this.player,this.parceiro),this.audio.play("escolha")):this.maos.disponivel(this.player,this.parceiro)&&this.maos.ligar(this.player,this.parceiro)}ouvirPassos(t){if(this.player.riding||this.player.locked)return;const e=Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z);if(e<5e-4){this.trilha=0;return}this.trilha+=e;const n=this.player.submersion>.05?1.05:.62;this.trilha>=n&&(this.trilha=0,this.audio.play(this.player.submersion>.05?"nadar":"passo"))}updateHot(t,e){let n=null,s=1/0,o=-1/0;const a=this.player.position.x,r=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(a,r);l>c.radius||c.priority<o||c.priority===o&&l>=s||(n=c,s=l,o=c.priority)}n!==this.hot&&(this.hot?.setHot(!1),n?.setHot(!0),this.hot=n,n&&!this.player.locked?this.ui.showPrompt(n.icon,n.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,n){return this.ui.ask(t,e,n??this.player.name)}toast(t,e){this.audio.play("toast"),this.ui.toast(t,e)}som(t){this.audio.play(t)}goTo(t,e){this.transitioning||(this.transitioning=!0,this.audio.play("porta"),(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setCameraOmbro(t,e){if(!t){this.camOmbro=null;return}this.camOmbro||(this.camOmbro=new sn(58,window.innerWidth/window.innerHeight,.1,400)),this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.position.copy(t),e&&this.camOmbro.lookAt(e),this.camOmbro.updateProjectionMatrix()}pointer(){return this.input.pointer()}showPlacar(t){this.ui.showPlacar(t)}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}addItem(t,e=this.playerId()){const n=this.save.pegar(e,t);return n==="cheio"&&this.ui.toast("Mochila cheia","🎒"),(n==="mao"||n==="guardado")&&this.repintarMochila(),n}storeItem(t,e=this.playerId()){const n=this.save.guardar(e,t);return n!=="cheio"&&n!=="repetido"&&this.repintarMochila(),n}removeItem(t,e=this.playerId()){const n=this.save.largar(e,t);return n&&this.repintarMochila(),n}hasItem(t,e=this.playerId()){return this.save.achouItem(e,t)}getActiveHandItem(t=this.playerId()){return this.save.itemAtivo(t)}setActiveHandSlot(t,e=this.playerId()){this.save.setSlotAtivo(e,t),this.repintarMochila()}activeHandSlot(t=this.playerId()){return this.save.slotAtivo(t)}equipWearable(t,e=this.playerId()){const n=this.save.vestir(e,t);return n&&this.repintarMochila(),n}unequipWearable(t,e=this.playerId()){this.save.despir(e,t),this.repintarMochila()}moveItem(t,e,n=this.playerId()){const s=this.save.mover(n,t,e);return s&&this.repintarMochila(),s}handItems(t=this.playerId()){return this.save.maos(t)}wearables(t=this.playerId()){return this.save.vestiveis(t)}descartarDaVaga(t){const e=this.playerId(),s=(t.lista==="mao"?this.save.maos(e):this.save.vestiveis(e))[t.indice];s&&(this.save.largar(e,s.id),this.audio.play("escolha"),this.ui.toast(`${s.nome} foi descartado`,"🗑"),this.pintarMochila())}repintarMochila(){this.ui.mochilaOpen&&this.pintarMochila()}pintarMochila(){const t=this.playerId();this.ui.renderMochila(this.save.maos(t),this.save.vestiveis(t),this.save.slotAtivo(t),this.player.name)}abrirMochila(){this.ui.toggleMochila()}sincronizarVestiveis(){for(const t of[this.player,this.parceiro]){const e=t.rig.spec.id,n=this.save.vestiveis(e),s=n.some(c=>c?.id===ce.chapeuPingPong.id);t.rig.campeao!==s&&t.rig.setCampeao(s);const o=n.some(c=>c?.id===ce.patins.id);t.patins=o,t.rig.setPatins(o);const a=this.save.loadout(e),r=xi.map(c=>a[c]??"").join("|");this.roupaAplicada.get(e)!==r&&(this.roupaAplicada.set(e,r),t.rig.vestirRoupa(a))}}sincronizarMaos(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id,n=this.save.itemAtivo(e),s=n?.id??null;this.naMao.get(e)!==s&&(this.naMao.set(e,s),t.segurar(s?Pv(s):null,n?.holdPose??"none"))}}roupaAplicada=new Map;abrirGuardaRoupa(){this.previa.mostrar(this.player.rig.spec),this.pintarArmario(),this.ui.abrirArmario()}pintarArmario(){const t=this.playerId(),e=this.save.vestiveis(t),n=this.save.maos(t).filter(s=>s!==null&&s.tipo==="vestivel");this.ui.renderArmario(e,n,this.player.name),this.previa.vestir(this.save.loadout(t))}unlock(t){this.save.addMemory(t)&&(this.audio.play("memoria"),this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,n=Math.PI/4){this.player.teleport(t,e,n),this.parceiro.teleport(t-1.2,e-.4,n),this.iso.snapTo(this.player.chest)}keyPressed(t){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.player.locked?!1:this.input.isDown(t)}showCharge(t){this.audio.carga(t),this.ui.showCharge(t)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.riding?(this.player.object.updateWorldMatrix(!0,!1),this.player.object.getWorldPosition(new U)):this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}playerId(){return this.player.rig.spec.id}companionId(){return this.parceiro.rig.spec.id}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.riding?(this.parceiro.object.updateWorldMatrix(!0,!1),this.parceiro.object.getWorldPosition(new U)):this.parceiro.position.clone()}companionFacing(){return this.parceiro.rig.facing}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.maos.trocouCorpos(this.player,this.parceiro),this.audio.play("trocar"),this.ui.toast(`Agora você é ${this.player.name}`,"🔁"),this.ui.mochilaOpen&&this.pintarMochila(),this.ui.armarioOpen&&(this.previa.mostrar(this.player.rig.spec),this.pintarArmario())}submergePlayer(t){this.player.submersion=Ue.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=Ue.clamp(t,0,1)}rideCompanion(t,e,n=1,s=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(n),this.parceiro.rig.group.rotation.y=s,this.parceiro.rig.setFacing(s),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}holdCompanion(t,e){this.parceiro.hold(t,e)}setSitting(t){if(t&&this.audio.play("sentar"),this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t),!t){this.maos.ativo||(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0));return}const e=this.player.rig.group,n=this.parceiro.rig.group;e.updateWorldMatrix(!0,!1),n.updateWorldMatrix(!0,!1);const s=new U,o=new U;e.getWorldPosition(s),n.getWorldPosition(o);const r=new U(1,0,0).applyQuaternion(e.getWorldQuaternion(new Ji)).dot(o.sub(s))<0?-1:1;this.player.rig.setHoldingHands(r),this.parceiro.rig.setHoldingHands(r===1?-1:1)}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,n=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,n)}ridePlayer(t,e,n=1,s=Math.PI){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(n),this.player.rig.group.rotation.y=s,this.player.rig.setFacing(s),this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,n=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,n),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight),this.camOmbro&&(this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.updateProjectionMatrix())};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function u_(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Er(i=3,t=2.2,e=S.rug){const n=new x(new G(i,.04,t),P(e));return n.position.y=.02,n.receiveShadow=!0,n}function d_(i=S.sofa,t=2.2){const e=new ct,n=new x(new G(t,.42,.9),P(i));n.position.y=.28,e.add(n);const s=new x(new G(t,.62,.24),P(i));s.position.set(0,.72,-.35),e.add(s);for(const a of[-1,1]){const r=new x(new G(.24,.5,.9),P(i));r.position.set(a*(t/2-.12),.62,0),e.add(r)}for(const[a,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new x(new it(.05,.04,.14,6),P(S.woodDark));c.position.set(a*(t/2-.2),.07,r*.34),e.add(c)}const o=new x(new G(.36,.12,.34),P(S.flowerPink));return o.position.set(t/2-.5,.55,-.14),o.rotation.set(.9,.4,0),e.add(o),e}function f_(){const i=new ct,t=new x(new G(1.2,.08,.7),P(S.wood));t.position.y=.46,i.add(t);for(const[e,n]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const s=new x(new it(.04,.04,.46,6),P(S.woodDark));s.position.set(e*.5,.23,n*.27),i.add(s)}return i}function p_(i=!1){const t=new ct,e=new x(new G(1.8,.5,.45),P(S.woodDark));e.position.y=.25,t.add(e);const n=new x(new G(1.5,.85,.08),P(2040361));n.position.y=.95,t.add(n);const s=new x(new on(1.36,.72),Vn(i?9426943:S.screen,1));return s.name="tela",s.position.set(0,.95,.05),t.add(s),t}function m_(i=2.1,t=1.2){const e=new ct,n=new x(new G(t,i,.32),P(S.woodDark));n.position.y=i/2,e.add(n);const s=Math.max(2,Math.floor(i/.5)),o=[14245951,4882400,16763213,6074447,16748465];for(let a=1;a<s;a++){const r=i/s*a;for(let c=0;c<5;c++){const l=new x(new G(.09,.3+c%3*.05,.2),P(o[(a+c)%o.length]));l.position.set(-t/2+.18+c*.13,r+.16,.06),l.rotation.z=c===4?.2:0,e.add(l)}}return e}function g_(i=S.fabricBlue){const t=new ct,e=new x(new G(1.5,.35,2.1),P(S.woodDark));e.position.y=.2,t.add(e);const n=new x(new G(1.44,.24,2),P(16184040));n.position.y=.49,t.add(n);const s=new x(new G(1.5,.14,1.35),P(i));s.position.set(0,.62,.3),t.add(s);const o=new x(new G(1,.16,.4),P(16777215));o.position.set(0,.66,-.72),t.add(o);const a=new x(new G(1.55,.7,.12),P(S.wood));return a.position.set(0,.6,-1.06),t.add(a),t}function v_(){const i=new ct,t=new x(new G(1.6,.08,.7),P(S.wood));t.position.y=.74,i.add(t);for(const o of[-.72,.72]){const a=new x(new G(.08,.74,.66),P(S.woodDark));a.position.set(o,.37,0),i.add(a)}const e=new x(new G(.8,.5,.06),P(2830136));e.position.set(0,1.08,-.18),i.add(e);const n=new x(new on(.72,.42),Vn(10475775));n.position.set(0,1.08,-.14),i.add(n);const s=new x(new it(.05,.12,.24,8),P(2830136));return s.position.set(0,.86,-.18),i.add(s),i}function Tr(i=S.wood){const t=new ct,e=new x(new G(.5,.08,.5),P(i));e.position.y=.46,t.add(e);const n=new x(new G(.5,.55,.07),P(i));n.position.set(0,.75,-.22),t.add(n);for(const[s,o]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new x(new G(.06,.46,.06),P(S.woodDark));a.position.set(s*.2,.23,o*.2),t.add(a)}return t}function __(i=2.4){const t=new ct,e=new x(new G(i,.9,.65),P(S.wallMint));e.position.y=.45,t.add(e);const n=new x(new G(i+.08,.08,.72),P(S.concrete));n.position.y=.94,t.add(n);const s=new x(new G(.5,.06,.4),P(S.metalWhite));return s.position.set(i/2-.55,.97,0),t.add(s),t}function x_(){const i=new ct,t=new x(new G(.8,1.8,.7),P(S.metalWhite));t.position.y=.9,i.add(t);const e=new x(new G(.82,.03,.72),P(S.metalGrey));e.position.y=1.25,i.add(e);for(const n of[.7,1.45]){const s=new x(new G(.05,.3,.05),P(S.metalGrey));s.position.set(.3,n,.37),i.add(s)}return i}function Ar(i=1){const t=new ct,e=new x(new it(.22*i,.17*i,.34*i,10),P(S.plantPot));e.position.y=.17*i,t.add(e);for(let n=0;n<5;n++){const s=n/5*Math.PI*2,o=new x(new zt(.2*i,8,6),P(n%2?S.leafMid:S.leafLight));o.scale.set(.5,1.5,.5),o.position.set(Math.cos(s)*.12*i,.6*i,Math.sin(s)*.12*i),o.rotation.z=Math.cos(s)*.4,o.rotation.x=-Math.sin(s)*.4,t.add(o)}return t}function Cr(i=.7,t=.55,e=S.skyDusk){const n=new ct,s=new x(new G(i,t,.05),P(S.woodDark));n.add(s);const o=new x(new on(i-.1,t-.1),Vn(e));return o.position.z=.03,n.add(o),n}function Uh(i=1.2,t=1.2){const e=new ct,n=new x(new on(i,t),Vn(S.glass,.55));e.add(n);const s=new x(new G(i+.12,.08,.08),P(S.metalWhite));s.position.y=t/2,e.add(s);const o=s.clone();o.position.y=-t/2,e.add(o);for(const a of[-1,1]){const r=new x(new G(.08,t,.08),P(S.metalWhite));r.position.x=a*i/2,e.add(r)}return e}function M_(i=16777215){const t=new ct,e=new x(new it(.07,.06,.13,10),P(i));e.position.y=.065,t.add(e);const n=new x(new ye(.045,.014,6,12),P(i));return n.position.set(.08,.07,0),n.rotation.y=Math.PI/2,t.add(n),t}function y_(i=1.5,t=.9){const e=new ct,n=new x(new G(i,.09,t),P(S.wood));n.position.y=.75,e.add(n);for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new x(new G(.08,.75,.08),P(S.woodDark));r.position.set(o*(i/2-.14),.37,a*(t/2-.14)),e.add(r)}const s=new x(new it(.07,.09,.16,10),P(S.wallMint));s.position.y=.87,e.add(s);for(const o of[-1,1]){const a=new x(new zt(.06,8,6),P(o<0?S.flowerPink:S.flowerYellow));a.position.set(o*.05,1.03,0),e.add(a)}return e}function S_(i=!0){const t=new ct,e=new x(new it(.2,.24,.06,12),P(S.woodDark));e.position.y=.03,t.add(e);const n=new x(new it(.03,.03,1.5,8),P(S.metalGrey));n.position.y=.78,t.add(n);const s=new x(new it(.22,.3,.34,14,1,!0),P(i?16773324:15130320,{glow:i?.5:0,doubleSide:!0}));return s.position.y=1.68,t.add(s),t}function Rr(i=1.1){const t=new ct,e=new x(new G(i,.06,.24),P(S.wood));t.add(e);const n=[14245951,6074447,16763213];for(let o=0;o<3;o++){const a=new x(new G(.1,.24,.16),P(n[o]));a.position.set(-i/2+.2+o*.16,.15,0),t.add(a)}const s=new x(new zt(.13,10,8),P(S.leafMid));return s.position.set(i/2-.22,.16,0),s.scale.y=.8,t.add(s),t}function b_(i=2){const t=new ct,e=new x(new G(i,.6,.34),P(S.wallCream));t.add(e);for(const n of[-1,1]){const s=new x(new G(.04,.16,.04),P(S.metalGrey));s.position.set(n*i*.22,-.18,.19),t.add(s)}return t}function w_(){const i=new ct,t=new x(new G(.66,.9,.64),P(S.metalWhite));t.position.y=.45,i.add(t);const e=new x(new it(.2,.2,.06,16),P(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,i.add(e);const n=new x(new it(.14,.14,.05,16),P(3884624));n.position.set(0,.5,.36),n.rotation.x=Math.PI/2,i.add(n);const s=new x(new G(.6,.12,.03),P(14673128));s.position.set(0,.82,.33),i.add(s);for(const o of[-.2,0,.2]){const a=new x(new it(.025,.025,.03,8),P(S.metalGrey));a.position.set(o,.82,.36),a.rotation.x=Math.PI/2,i.add(a)}return i}function ro(i=S.wood,t=.9,e=2.1,n=.24){const s=new ct,o=new x(new G(t,e,.08),P(i));o.position.y=e/2,s.add(o);for(const c of[-1,1]){const l=new x(new G(.09,e+.1,n),P(S.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),s.add(l)}const a=new x(new G(t+.2,.1,n),P(S.woodDark));a.position.y=e+.05,s.add(a);const r=new x(new zt(.055,8,6),P(S.gold,{glow:.15}));return r.position.set(t/2-.14,e*.45,.07),s.add(r),s}function E_(i=S.wood,t=1.6,e=2.1){const n=new ct,s=.62,o=new x(new G(t,e,s),P(S.woodDark));o.position.y=e/2,n.add(o);const a=new x(new G(t-.12,e-.16,.04),P(3812127));a.position.set(0,e/2,s/2-.05),n.add(a);const r=t/2-.05;for(const c of[-1,1]){const l=new ct;l.position.set(c*r,e/2,s/2),c>0&&(l.rotation.y=-.62),n.add(l);const h=new x(new G(r,e-.1,.06),P(i));h.position.x=-c*r/2,l.add(h);const u=new x(new it(.022,.022,.16,8),P(S.metalGrey));u.position.set(-c*(r-.12),0,.06),l.add(u)}for(const c of[-1,1])for(const l of[-1,1]){const h=new x(new G(.1,.1,.1),P(S.woodDark));h.position.set(c*(t/2-.1),.05,l*(s/2-.1)),n.add(h)}return n}function T_(i=S.wood,t=1.7){const e=new ct,n=.62,s=new x(new G(n,t,.07),P(i));s.position.y=t/2,e.add(s);const o=new x(new G(n-.14,t-.16,.03),P(S.glass,{opacity:.72,glow:.12}));return o.position.set(0,t/2,.04),e.add(o),e.rotation.x=-.05,e}function A_(){const i=new ct,t=new x(new G(.44,.5,.4),P(S.wood));t.position.y=.25,i.add(t);const e=new x(new G(.36,.14,.03),P(S.woodDark));e.position.set(0,.32,.21),i.add(e);const n=new x(new it(.06,.08,.16,8),P(S.metalGrey));n.position.y=.58,i.add(n);const s=new x(new it(.11,.15,.18,12,1,!0),P(16773324,{glow:.45,doubleSide:!0}));return s.position.y=.75,i.add(s),i}const bn={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},vn={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},C_=[bn,vn],Pr={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI},"do-quarto":{x:-5.05,z:-1.2,facing:Math.PI/2}},build(i){const t=i.game,e=async X=>{for(const[vt,Wt]of X)await t.say([Wt],vt)},n=bn.name,s=vn.name,o=12,a=9,r=-o/2,c=-a/2,l=2.8;i.ground({width:o,depth:a,color:S.floorWood}),i.setBounds(r+.45,c+.45,o/2-.45,a/2-.45),i.wall(r,c,o/2,c,l,S.wallCream);const h=-1.2,u=.95;i.wall(r,c,r,h-u/2,l,S.wallMint),i.wall(r,h+u/2,r,a/2,l,S.wallMint),i.wall(r,a/2,o/2,a/2,.45,S.wallCream),i.wall(o/2,-1.3,o/2,a/2,.45,S.wallCream);const d=.4,f=4.2,g=-1.3,_=(d+f)/2,m=(f+o/2)/2,p=.95,T=[d,_-p/2,_+p/2,m-p/2,m+p/2,o/2];for(let X=0;X<T.length;X+=2)T[X+1]-T[X]>.05&&i.wall(T[X],g,T[X+1],g,l,S.wallCream);i.wall(d,c,d,g,l,S.wallCream),i.wall(f,c,f,g,l,S.wallCream),i.wall(o/2,c,o/2,g,l,S.wallCream);const w=new x(new G(o/2-d,.16,g-c),P(15129028));w.position.set((d+o/2)/2,l+.08,(c+g)/2),i.add(w);const M=i.add(i.place(ro(S.woodDark,.85,2.05),_,0,g)),I=i.add(i.place(ro(S.gold,.85,2.05),m,0,g));i.add(i.place(Cr(.6,.75,S.wallMint),3.55,1.75,g+.17)),i.add(i.place(Rr(.9),1.1,1.7,g+.19)),i.add(i.place(ro(S.fabricBlue,.9,2.1),r,0,h,Math.PI/2)),i.door({x:r+.85,z:h,to:"quarto",entry:"da-sala",label:"Entrar no quarto do Ari",icon:"🚪"}),i.add(i.place(__(3.6),-3.4,0,c+.42)),i.blockBox(-3.4,c+.42,1.8,.4),i.add(i.place(b_(2.6),-3.4,2,c+.2)),i.add(i.place(x_(),r+.45,0,-2.6,Math.PI/2)),i.blockBox(r+.45,-2.6,.38,.42);const E=i.add(i.place(y_(1.5,.9),-3.6,0,-1.9,.08));i.blockBox(-3.6,-1.9,.8,.52,.08),i.add(i.place(Tr(),-4.7,0,-1.9,Math.PI/2)),i.add(i.place(Tr(),-2.5,0,-1.9,-Math.PI/2));const A=i.add(i.place(p_(!1),r+.35,0,.6,Math.PI/2));i.blockBox(r+.35,.6,.3,.9);const C=A.getObjectByName("tela");i.add(i.place(Er(3,2.6),-2.5,0,.6));const y=i.add(i.place(d_(S.fabricRed,2.4),-.3,0,.6,-Math.PI/2));i.blockBox(-.3,.6,.5,1.2),i.add(i.place(f_(),-2.4,0,.6,Math.PI/2)),i.blockBox(-2.4,.6,.38,.62);const v=i.add(i.place(M_(16773856),-2.4,.5,.9));i.add(i.place(S_(!0),-.4,0,2.3)),i.blockCircle(-.4,2.3,.3);const D=i.add(i.place(w_(),o/2-.65,0,2.9,-Math.PI/2));i.blockBox(o/2-.65,2.9,.35,.4),i.add(i.place(Uh(1.8,1.3),r+.16,1.75,2.4,Math.PI/2)),i.add(i.place(Cr(.8,.6,S.skyDusk),-3.4,1.95,c+.17)),i.add(i.place(Rr(1.1),-1.6,1.8,c+.2)),i.add(i.place(Ar(1.1),r+.8,0,a/2-1));const F=i.add(i.place(Ar(.75),4.9,0,1.4)),z=i.place(Ah(.75),-.3,2.4,.6);z.visible=!1,i.add(z);const q=a/2;i.wall(2,q,2.9,q,2.6,S.wallCream),i.wall(3.9,q,4.9,q,2.6,S.wallCream);const Y=i.add(i.place(ro(S.woodDark,.95,2.1),3.4,0,q,Math.PI));i.blockBox(3.4,q,.5,.12),i.add(i.place(Er(1.4,.8,12626050),3.4,0,a/2-1));const Z=new Ae;Z.position.set(-.52,0,.6),Z.rotation.y=-Math.PI/2,i.root.add(Z);const et=new Ae;et.position.set(-1.9,1.05,.6),i.root.add(et);let j=!1;const nt=X=>{j=X,C.material=P(X?9426943:S.screen,{glow:X?.55:0})};i.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:y,onInteract:async X=>{if(await X.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await X.say(["Depois. Se sentar agora, não levanta mais."]);return}X.lockPlayer(!0),X.ridePlayer(Z,new U(-.52,.02,0),1,0),X.rideCompanion(Z,new U(.52,.02,0),1,0),X.setSitting(!0),nt(!0),X.focusCamera(et),X.setZoom(7.2),await X.wait(.9),await X.say(["Está passando Bo Burnham."]),await X.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${X.companionName()} tá rindo também.`]),await X.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await X.say(["Mais um. Só mais um.","Nunca é só mais um."]),X.setSitting(!1),X.focusCamera(null),X.setZoom(10),X.releasePlayer(-1.6,.4,-Math.PI/2),X.releaseCompanion(-1.6,1.5,-Math.PI/2),X.lockPlayer(!1),X.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),i.interact({id:"casa:tv",x:r+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:A,onInteract:async X=>{nt(!j),j&&X.som("tv"),X.toast(j?"TV ligada":"TV desligada","📺"),j&&await X.say(["Está passando Bo Burnham."])}}),i.interact({id:"casa:geladeira",x:r+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:X=>X.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),i.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:X=>X.say(["Por algum milagre, a pia está limpa…"])}),i.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:E,onInteract:async X=>{await e([[n,"Dois pratos, duas canecas. Já virou automático."],[s,"Três, se a Rubi sair do quarto."]]),X.toast("Mesa posta","🍽️")}}),i.interact({id:"casa:maquina",x:o/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:D,onInteract:async X=>{if(X.flag("roupa-lavando")){await e([[s,"Ainda tá centrifugando."],[n,"Esse barulho é a trilha sonora dessa casa."]]);return}X.setFlag("roupa-lavando"),X.toast("Máquina ligada","🫧"),await e([[n,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[s,"Contanto que a Rubi não encha ela de novo antes."]])}}),i.interact({id:"casa:banheiro",x:m,z:g+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:I,onInteract:()=>e([[s,"Tem alguém aí?"],[n,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),i.interact({id:"casa:quarto",x:_,z:g+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:M,onInteract:async X=>{await e([[n,"Acho que a Rubi está ouvindo kpop"],[s,"Para variar né"]]),X.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),i.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:F,onInteract:async X=>{if(X.flag("planta-regada")){await X.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}X.setFlag("planta-regada"),F.scale.multiplyScalar(1.2),X.toast("A plantinha cresceu um tiquinho","🌱"),await X.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),i.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:v,onInteract:async X=>{await X.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),X.toast("+1 disposição","☕")}}),i.interact({id:"casa:janela",x:r+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async X=>{await X.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),X.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),i.door({x:3.4,z:a/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:Y,radius:1.7}),i.onUpdate((X,vt)=>{z.visible=i.game.flag("planta-regada"),z.position.y=2.4+Math.sin(vt*1.6)*.12,z.rotation.y=vt*.9})}},de={x:0,z:-3,largura:16,profundidade:10,fundo:1.6};function Tl(i,t,e=0){return Math.abs(i-de.x)<de.largura/2-e&&Math.abs(t-de.z)<de.profundidade/2-e}const Al={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:0,z:12,facing:Math.PI},entries:{portaria:{x:0,z:12,facing:Math.PI},beira:{x:0,z:3.5,facing:Math.PI}},build(i){const t=i.game,e=async E=>{for(const[A,C]of E)await t.say([C],A)},n=bn.name,s=vn.name,o={x:de.x,z:de.z,width:de.largura,depth:de.profundidade};i.groundWithHoles({width:160,depth:160,color:S.grass,holes:[o]}),i.groundWithHoles({width:34,depth:26,color:14999766,y:.015,z:-1,holes:[o]}),i.setBounds(-22,-18,22,16),i.add(i.place(ov(de.largura,de.profundidade,de.fundo),de.x,0,de.z));const a=av(de.largura,de.profundidade);a.position.set(de.x,-.12,de.z),i.root.add(a);for(const E of[-5.2,-1.8,1.8,5.2]){const A=new x(new on(.24,de.profundidade-1.4),Vn(4164272));A.rotation.x=-Math.PI/2,A.position.set(de.x+E,-1.6+.08,de.z),i.root.add(A)}for(const E of[-5,5])i.add(i.place(rv(),E,0,de.z+de.profundidade/2));const r=i.add(i.place(lv(),0,0,de.z-de.profundidade/2-1.6));i.blockBox(0,de.z-de.profundidade/2-1.9,.4,.4);const c=[ma(S.frisbee),ma(16767070),ma(7328752)];c.forEach((E,A)=>{i.place(E,-4.5+A*4.6,-.05,de.z-1.6+A%2*2.6),i.root.add(E)});const l=[S.fabricBlue,S.fabricRed,6074447,16763213];for(let E=0;E<6;E++){const A=-7.5+E*3;i.add(i.place(dl(l[E%l.length]),A,0,5.4,Math.PI)),i.blockBox(A,5.4,.36,.85),E%2===0&&(i.add(i.place(fl(E%4===0?S.fabricRed:4882400),A+1.5,0,6.9)),i.blockCircle(A+1.5,6.9,.3))}const h=i.add(i.place(dl(S.rug),10.5,0,2.2,-Math.PI/2));i.blockBox(10.5,2.2,.85,.36),i.add(i.place(fl(16748465),11.6,0,3.6)),i.blockCircle(11.6,3.6,.3);const u=i.add(i.place(cv(),-11,0,2.5,-Math.PI/2));i.blockCircle(-11,2.5,.3);const d=i.add(i.place(gr(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));i.blockBox(-12.5,7.2,1.4,1,.35);const f=i.add(i.place(vr(6,3.2,4,S.wallCream,8038084),13,0,-9));i.blockBox(13,-9,3,2),i.banco(13,-6.6),i.setSeed(90210);for(const[E,A]of[[-18,-8],[-17,1],[18,2],[19,-6],[-19,10],[18,11]])i.add(i.place(pr("palmeira",i.range(.95,1.2),i.rng()),E,0,A)),i.blockCircle(E,A,.5);for(let E=0;E<26;E++){const A=i.range(-20,20),C=i.range(-16,14);Math.abs(A)<18&&C>-14&&C<12||i.add(i.place(E%2?po(i.range(.7,1.1)):mr(6,1.1),A,0,C))}for(let E=0;E<6;E++){const A=wh(i.range(1.8,3));A.position.set(i.range(-60,60),i.range(40,52),i.range(-50,30)),i.root.add(A);const C=i.range(.2,.5);i.onUpdate(y=>{A.position.x+=C*y,A.position.x>62&&(A.position.x=-62)})}i.add(i.place(Dn(30,1.4,S.metalWhite),-6,0,14)),i.add(i.place(Dn(14,1.4,S.metalWhite),12,0,14)),i.blockBox(-6,14,15,.2),i.blockBox(12,14,7,.2);const g=i.add(i.place(Dn(4,1.6,S.gold),3.5,0,14));i.door({x:3.5,z:13,to:"villa-lobos",entry:"clube",label:"Voltar pro parque",icon:"🌳",highlight:g,radius:2.2});const _=[],m=(E,A,C=12)=>{t.som("agua");for(let y=0;y<C;y++){const v=new x(new zt(.1+Math.random()*.1,6,5),Vn(14677247,.9)),D=y/C*Math.PI*2,F=.2+Math.random()*.5;v.position.set(E+Math.cos(D)*F,-.1,A+Math.sin(D)*F),i.root.add(v),_.push({mesh:v,vy:2.2+Math.random()*2.4,vida:1})}};let p=0,T=0,w=!1;i.onUpdate((E,A)=>{a.position.y=-.12+Math.sin(A*1.4)*.015,c.forEach((F,z)=>{F.position.y=-.05+Math.sin(A*1.1+z*1.7)*.05,F.rotation.y=Math.sin(A*.4+z)*.4});const C=t.playerPosition(),y=t.companionPosition(),v=Tl(C.x,C.z,.2)?1:0,D=Tl(y.x,y.z,.2)?1:0;p+=(v-p)*Math.min(1,E*5),T+=(D-T)*Math.min(1,E*5),t.submergePlayer(p),t.submergeCompanion(T),v===1&&!w&&(w=!0,m(C.x,C.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let F=_.length-1;F>=0;F--){const z=_[F];z.vy-=9*E,z.mesh.position.y+=z.vy*E,z.vida-=E*.9,z.mesh.material.opacity=Math.max(0,z.vida),(z.vida<=0||z.mesh.position.y<-.6)&&(i.root.remove(z.mesh),z.mesh.geometry.dispose(),_.splice(F,1))}});const M=new Ae;i.root.add(M),i.interact({id:"clube:trampolim",x:0,z:de.z-de.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:r,onInteract:async E=>{E.lockPlayer(!0),await E.say(["Do trampolim?","Do trampolim."]);const A=new U(0,.95,de.z-de.profundidade/2-.4),C=new U(0,-.6,de.z+1.2);M.position.copy(A),E.ridePlayer(M,new U(0,0,0),1);const y=1.15;for(let v=0;v<y;v+=1/60){const D=v/y;M.position.lerpVectors(A,C,D),M.position.y+=Math.sin(D*Math.PI)*2.6,await E.wait(1/60)}m(C.x,C.z,18),E.releasePlayer(C.x,C.z,Math.PI),E.lockPlayer(!1),E.toast("Splash!","💦"),E.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),i.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:h,onInteract:async E=>{await E.say(["Sol na cara, barulho de água, ninguém com pressa.",`${E.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),E.toast("+1 preguiça boa","🌞")}});let I=0;i.onUpdate(E=>{I<=0||(I-=E,I<=0&&(t.removeItem(ce.sucoMorango.id,vn.id),t.removeItem(ce.sucoPessego.id,bn.id),t.toast("Acabou o suco","🍹")))}),i.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:d,onInteract:async E=>{await e([[s,"Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito."],[n,"Awnn gracias amorzito"]]),I=50,E.addItem(ce.sucoMorango,vn.id),E.addItem(ce.sucoPessego,bn.id),E.som("sorvete"),E.toast("Morango e pêssego","🍹")}}),i.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:u,onInteract:async E=>{m(-10.6,2.5,8),await E.say(["Gelada. Sempre gelada."])}}),i.interact({id:"clube:vestiario",x:13,z:-6.6,radius:2.2,label:"Vestiário",icon:"🩳",highlight:f,onInteract:E=>E.say(["Cinco minutos pra trocar de roupa. Você demora quinze."])})}},xn=8,fn=6.5,Qe=-xn/2,pn=-fn/2,Cl=2.8,Oi={x:2.65,z:pn+.36},R_=[ce.gorroDeLa,ce.camisaListrada,ce.calcaJeans,ce.botaAmarela,ce.vestidoRosa,ce.gargantilhaDeLaco,ce.maidMarinheiro,ce.maidGatinho,ce.maidJapones,ce.meiaDeCoxa],Rl={id:"quarto",name:"Quarto do Ari",subtitle:"a porta que fica sempre encostada",ambient:{sky:14872311,indoor:!0,sunColor:16774366,sunIntensity:.95,ambientColor:15397883,ambientIntensity:1.45,sunDir:[10,15,12]},spawn:{x:.9,z:1.7,facing:Math.PI},entries:{"da-sala":{x:.9,z:1.7,facing:Math.PI}},build(i){const t=i.game,e=async d=>{for(const[f,g]of d)await t.say([g],f)},n=bn.name,s=vn.name;i.ground({width:xn,depth:fn,color:S.floorWood}),i.setBounds(Qe+.45,pn+.45,xn/2-.45,fn/2-.45),i.wall(Qe,pn,xn/2,pn,Cl,S.wallAzul),i.wall(Qe,pn,Qe,fn/2,Cl,S.wallAzul),i.wall(xn/2,pn,xn/2,fn/2,.45,S.wallAzul);const o=.9,a=1.1;i.wall(Qe,fn/2,o-a/2,fn/2,.45,S.wallAzul),i.wall(o+a/2,fn/2,xn/2,fn/2,.45,S.wallAzul);for(const[d,f,g,_]of[[0,pn+.06,xn,0],[Qe+.06,0,fn,Math.PI/2]]){const m=new x(new G(g,.12,.05),P(12176860));m.position.set(d,.06,f),m.rotation.y=_,i.add(m)}const r=i.add(i.place(g_(S.fabricBlue),-2.2,0,-1.75));i.blockBox(-2.2,-1.75,.78,1.08),i.add(i.place(A_(),-1.05,0,-2.72)),i.blockBox(-1.05,-2.72,.24,.22);const c=i.add(i.place(m_(1.9,1.1),.15,0,pn+.22));i.blockBox(.15,pn+.22,.55,.18);const l=i.add(i.place(E_(S.wallMint),Oi.x,0,Oi.z));i.blockBox(Oi.x,Oi.z,.8,.32);const h=i.add(i.place(T_(S.woodDark),Qe+.12,0,-.6,Math.PI/2));i.add(i.place(Uh(1.6,1.2),Qe+.16,1.7,1,Math.PI/2));const u=i.add(i.place(v_(),Qe+.5,0,2,-Math.PI/2));i.blockBox(Qe+.5,2,.4,.82),i.add(i.place(Tr(S.woodDark),Qe+1.35,0,2,-Math.PI/2)),i.add(i.place(Er(2.6,2,S.rug),.3,0,1.1)),i.add(i.place(Ar(1.15),xn/2-.75,0,.9)),i.blockCircle(xn/2-.75,.9,.3),i.add(i.place(Cr(.6,.75,S.flowerPink),-2.2,1.85,pn+.17)),i.add(i.place(Rr(.9),1.05,1.9,pn+.19)),i.door({x:o,z:fn/2-.7,to:"casa",entry:"do-quarto",label:"Voltar pra sala",icon:"🚪"}),i.interact({id:"quarto:armario",x:Oi.x,z:Oi.z+1.25,radius:1.8,label:"Abrir o armário",icon:"🚪",highlight:l,onInteract:async d=>{for(const f of[d.playerId(),d.companionId()])for(const g of R_)d.storeItem(g,f);d.flag("armario-aberto")||(d.setFlag("armario-aberto"),await e([[n,"Pode mexer, fica à vontade."],[s,"Tem mais roupa aqui do que no meu apartamento inteiro."]]),d.unlock({id:"armario-do-ari",title:"O armário do Ari",place:"Quarto do Ari",note:"Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.",icon:"👕"})),d.abrirGuardaRoupa()}}),i.interact({id:"quarto:espelho",x:Qe+.95,z:-.6,radius:1.5,label:"Se olhar no espelho",icon:"🪞",highlight:h,onInteract:async d=>{if(d.wearables().filter(g=>g!==null).length===0){await e([[s,"Tô bem assim?"],[n,"Tá. Mas tem um armário inteiro logo ali."]]);return}await e([[n,`Olha só, ${d.playerName()}.`],[s,"Ficou bom mesmo."]])}}),i.interact({id:"quarto:cama",x:-2.2,z:-.5,radius:1.6,label:"Olhar a cama",icon:"🛏️",highlight:r,onInteract:()=>e([[s,"Essa cama é bem melhor que a minha."],[n,"É a mesma cama de sempre."],[s,"Não é a cama então."]])}),i.interact({id:"quarto:mesa",x:Qe+1.5,z:2,radius:1.5,label:"Olhar a escrivaninha",icon:"💻",highlight:u,onInteract:()=>e([[n,"É daqui que eu te mando mensagem de madrugada."],[s,"Eu sei. Eu tô acordado do outro lado."]])}),i.interact({id:"quarto:estante",x:.35,z:-2.2,radius:1.4,label:"Olhar a estante",icon:"📚",highlight:c,onInteract:()=>e([[s,"Você leu todos esses?"],[n,"Comecei todos esses."]])})}};function P_(i,t,e,n){const s=new U().subVectors(t,i),o=s.length(),a=new x(new it(e,e*1.15,o,8),n);return a.position.copy(i).addScaledVector(s,.5),a.quaternion.setFromUnitVectors(new U(0,1,0),s.normalize()),a}class I_{group=new ct;cabins=[];radius;hubHeight;speed;angle=0;rim=new ct;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,n=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const s=P(t.frameColor??S.metalWhite),o=this.hubHeight=e+2.6,a=e*.075;for(const A of[-a,a]){const C=new x(new ye(e,e*.019,8,72),s);C.position.z=A,this.rim.add(C)}const r=Math.min(48,n*2);for(let A=0;A<r;A++){const C=A/r*Math.PI*2,y=new x(new G(e*.012,e*.012,a*2),s);y.position.set(Math.cos(C)*e,Math.sin(C)*e,0),this.rim.add(y)}const c=[];for(let A=0;A<r;A++){const C=A/r*Math.PI*2,y=(A+1)/r*Math.PI*2,v=A%2===0?-a:a,D=A%2===0?a:-a;c.push(Math.cos(C)*e,Math.sin(C)*e,v,Math.cos(y)*e,Math.sin(y)*e,D)}this.rim.add(new Ac(Pl(c),cl(14673642)));const l=[];for(let A=0;A<n;A++){const C=A/n*Math.PI*2,y=Math.cos(C)*e,v=Math.sin(C)*e;l.push(0,0,-a*.5,y,v,-a),l.push(0,0,a*.5,y,v,a)}this.rim.add(new Ac(Pl(l),cl(15660022)));const h=new x(new it(e*.085,e*.085,e*.3,14),s);h.rotation.x=Math.PI/2,this.rim.add(h);for(const A of[-e*.17,e*.17]){const C=new x(new it(e*.11,e*.07,e*.06,14),P(S.metalGrey));C.rotation.x=Math.PI/2,C.position.z=A,this.rim.add(C)}this.rim.position.y=o,this.group.add(this.rim);const u=P(t.cabinColor??S.metalWhite),d=P(7321304,{opacity:.5}),f=e*.068;for(let A=0;A<n;A++){const C=new ct,y=new x(new G(.09,f*1.1,.09),P(S.metalGrey));y.position.y=f*1.25,C.add(y);const v=new x(new Fn(f,f*.5,5,16),u);v.scale.set(1,1,.92),C.add(v);const D=new x(new it(f*1.02,f*1.02,f*.95,18,1,!0),d);D.position.y=f*.12,D.scale.z=.92,C.add(D),C.traverse(F=>{F.isMesh&&(F.castShadow=!0)}),this.cabins.push(C),this.group.add(C)}const g=e*.42,_=new U(0,o,-e*.04),m=new U(0,o,e*.04),p=[[_,new U(-e*.2,0,-g)],[_,new U(e*.2,0,-g)],[m,new U(-e*.2,0,g)],[m,new U(e*.2,0,g)]];for(const[A,C]of p){const y=P_(A.clone(),C.clone(),e*.03,s);y.castShadow=!0,this.group.add(y)}for(const A of[-g,g]){const C=new x(new G(e*.42,e*.022,e*.022),s);C.position.set(0,e*.16,A),this.group.add(C)}const T=new x(new it(e*.62,e*.67,.35,26),P(S.concrete));T.position.y=.16,T.receiveShadow=!0,this.group.add(T);const w=e*.4,M=g*.92;for(const[A,C]of[[-w,-M],[w,-M],[-w,M],[w,M]]){const y=new x(new it(e*.055,e*.055,e*.16,12),P(S.metalRed));y.position.set(A,e*.08,C),y.castShadow=!0,this.group.add(y)}const I=new x(new G(e*.55,.55,e*.3),P(S.metalGrey));I.position.set(0,.4,g*.9),I.castShadow=!0,I.receiveShadow=!0,this.group.add(I);const E=new x(new it(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),P(S.fabricRed));E.position.set(0,1.9,g*.9),E.rotation.set(0,0,Math.PI/2),E.scale.z=.6,this.group.add(E);for(const A of[-e*.15,e*.15]){const C=new x(new it(.06,.06,1.8,8),P(S.metalWhite));C.position.set(A,.9,g*.9),this.group.add(C)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const n of this.cabins)n.position.y<e&&(e=n.position.y,t=n);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function Pl(i){const t=new Ne;return t.setAttribute("position",new he(i,3)),t}class L_{mesh;state="chao";velocity=new U;spin=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=Th(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}pickUp(){this.state="guardado",this.velocity.set(0,0,0)}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,n=0,s=1){const o=e.x-t.x,a=e.z-t.z,r=Math.hypot(o,a),c=(Math.random()-.5)*n;this.throwFrom(t,Math.atan2(o,a)+c,this.powerFor(r,s),s)}throwAt(t,e,n,s=1){this.throwFrom(t,e,this.powerFor(n,s),s)}powerFor(t,e=1){let n=.25,s=1.7;for(let o=0;o<14;o++){const a=(n+s)/2;this.simulateRange(a,e)<t?n=a:s=a}return Ue.clamp((n+s)/2,.25,1.7)}simulateRange(t,e=1){let n=1.15,s=3.4*t*e,o=11*t,a=0;const r=1/60;for(let c=0;c<900&&n>.06;c++){const l=s>-1.2?this.lift:0;s-=(this.gravity-l)*r,o*=1-.35*r,a+=o*r,n+=s*r}return a}throwFrom(t,e,n=1,s=1){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const o=11*n;this.velocity.set(Math.sin(e)*o,3.4*n*s,Math.cos(e)*o),this.spin=22}update(t,e){if(this.state!=="voando")return;const n=this.velocity.y>-1.2?this.lift:0;this.velocity.y-=(this.gravity-n)*t,this.velocity.x*=1-.35*t,this.velocity.z*=1-.35*t,this.mesh.position.addScaledVector(this.velocity,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08;const s=Ue.clamp(this.mesh.position.x,e.minX+1,e.maxX-1),o=Ue.clamp(this.mesh.position.z,e.minZ+1,e.maxZ-1);(s!==this.mesh.position.x||o!==this.mesh.position.z)&&(this.mesh.position.x=s,this.mesh.position.z=o,this.velocity.multiplyScalar(.2)),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.onLand?.(this.mesh.position.clone()))}}const ze={largura:2.6,profundidade:1.4,altura:.76},D_=.055,gs=ze.largura/2+.22,U_=gs+.9,Il=.28,N_=ze.altura+.19,F_=6.6,O_=.72,cs=ze.profundidade/2+.12,tn={vxBase:3.5,vxMin:2.9,vxMax:4.4,energiaParaVx:.05,vyBase:1.9,alturaParaVy:1.5,subidaParaVy:.12,vyMin:.75,vyMax:2.4,heranca:.25,lateralParaVz:.2,vzMax:1.05,velocidadeMaximaRaquete:6};class z_{grupo=new ct;bola;minhaRaquete;raqueteDele;fase="parado";meus=0;dele=0;alvo;onSom=null;onPonto=null;onFim=null;v=new U;espera=0;sacaEu=!0;rebatedor="eu";quiquesNoAlvo=0;lateralRaquete=0;subidaRaquete=0;zAnterior=0;yAnterior=0;erroDele=0;constructor(t=5){this.alvo=t,this.bola=Eh(),this.grupo.add(this.bola),this.minhaRaquete=bo(S.metalRed),this.raqueteDele=bo(S.fabricBlue),this.minhaRaquete.rotation.y=Math.PI/2,this.raqueteDele.rotation.y=-Math.PI/2,this.minhaRaquete.scale.setScalar(1.15),this.raqueteDele.scale.setScalar(1.15),this.grupo.add(this.minhaRaquete,this.raqueteDele),this.resetar()}comecar(){this.meus=0,this.dele=0,this.sacaEu=!0,this.resetar()}guardar(){this.fase="parado",this.grupo.visible=!1}resetar(){this.fase="sacando",this.espera=1.1,this.grupo.visible=!0;const t=this.sacaEu?-1:1;this.bola.position.set(t*(ze.largura/2-.3),ze.altura+.45,0),this.v.set(0,0,0),this.minhaRaquete.position.set(-gs,ze.altura+.3,0),this.raqueteDele.position.set(gs,ze.altura+.3,0),this.zAnterior=0,this.yAnterior=ze.altura+.3,this.lateralRaquete=0,this.subidaRaquete=0,this.sortearErro()}sortearErro(){const t=Math.random()<.25;this.erroDele=(Math.random()-.5)*(t?1.5:.5)}update(t,e){if(!(this.fase==="parado"||this.fase==="fim")){if(this.moverMinhaRaquete(t,e),this.moverRaqueteDele(t),this.fase==="ponto"||this.fase==="sacando"){this.espera-=t,this.espera<=0&&(this.fase==="ponto"?this.resetar():this.sacar());return}this.voar(t)}}sacar(){this.fase="jogando",this.rebatedor=this.sacaEu?"eu":"ele",this.quiquesNoAlvo=0,this.v.set(this.sacaEu?3.4:-3.4,1.45,(Math.random()-.5)*.6),this.onSom?.("lancar")}moverMinhaRaquete(t,e){const n=Ue.clamp(e.x*cs,-cs,cs),s=ze.altura+.16+Ue.clamp((e.y+.35)*.6,0,.75);this.minhaRaquete.position.z+=(n-this.minhaRaquete.position.z)*Math.min(1,t*18),this.minhaRaquete.position.y+=(s-this.minhaRaquete.position.y)*Math.min(1,t*14);const o=tn.velocidadeMaximaRaquete;t>0&&(this.lateralRaquete=Ue.clamp((this.minhaRaquete.position.z-this.zAnterior)/t,-o,o),this.subidaRaquete=Ue.clamp((this.minhaRaquete.position.y-this.yAnterior)/t,-o,o)),this.zAnterior=this.minhaRaquete.position.z,this.yAnterior=this.minhaRaquete.position.y}moverRaqueteDele(t){const e=this.v.x>0,n=e?this.bola.position.z+this.erroDele:0,s=e?4.6:1.6;this.raqueteDele.position.z+=(n-this.raqueteDele.position.z)*Math.min(1,t*s),this.raqueteDele.position.z=Ue.clamp(this.raqueteDele.position.z,-cs,cs);const o=e?Ue.clamp(this.bola.position.y,ze.altura+.16,ze.altura+.9):ze.altura+.3;this.raqueteDele.position.y+=(o-this.raqueteDele.position.y)*Math.min(1,t*4)}voar(t){const e=this.bola.position,n=e.x;if(this.v.y-=F_*t,e.addScaledVector(this.v,t),(n<0&&e.x>=0||n>0&&e.x<=0)&&e.y<N_){this.onSom?.("quicar"),this.marcar(this.rebatedor==="ele","na rede");return}const o=ze.altura+D_,a=Math.abs(e.x)<=ze.largura/2&&Math.abs(e.z)<=ze.profundidade/2;if(e.y<=o&&this.v.y<0&&a){if(e.y=o,this.v.y=-this.v.y*O_,this.onSom?.("quicar"),(e.x<0?"eu":"ele")===this.rebatedor){this.marcar(this.rebatedor==="ele","quique no próprio campo");return}if(this.quiquesNoAlvo+=1,this.quiquesNoAlvo>=2){this.marcar(this.rebatedor==="eu","dois quiques");return}}for(const[c,l,h]of[[-1,this.minhaRaquete,"eu"],[1,this.raqueteDele,"ele"]]){const u=c*gs;!(c<0?n>u&&e.x<=u:n<u&&e.x>=u)||this.rebatedor===h||!(Math.abs(e.z-l.position.z)<Il&&Math.abs(e.y-l.position.y)<Il)||(e.x=u,this.rebater(h==="eu"?1:-1,l.position.y,h==="eu"),this.rebatedor=h,this.quiquesNoAlvo=0,this.onSom?.("pegar"),h==="ele"&&this.sortearErro())}(e.y<.12||Math.abs(e.x)>U_||Math.abs(e.z)>2.2)&&(this.quiquesNoAlvo>=1?this.marcar(this.rebatedor==="eu","não alcançou"):this.marcar(this.rebatedor==="ele","fora"))}rebater(t,e,n){const s=n?this.lateralRaquete:this.miraDoParceiro(),o=n?this.subidaRaquete:0,a=Math.abs(s)+Math.abs(o),r=Ue.clamp(tn.vxBase+a*tn.energiaParaVx,tn.vxMin,tn.vxMax),c=Ue.clamp(tn.vyBase-(e-(ze.altura+.14))*tn.alturaParaVy+o*tn.subidaParaVy,tn.vyMin,tn.vyMax),l=Ue.clamp(this.v.z*tn.heranca+s*tn.lateralParaVz,-1.05,tn.vzMax);this.v.set(t*r,c,l)}miraDoParceiro(){const t=-this.bola.position.z*1.2,e=(Math.random()-.5)*2.4;return Ue.clamp(t+e,-4,4)}marcar(t,e){if(t?this.meus+=1:this.dele+=1,this.sacaEu=!t,this.onPonto?.(t,e),this.meus>=this.alvo||this.dele>=this.alvo){this.fase="fim",this.onFim?.(this.meus>=this.alvo);return}this.fase="ponto",this.espera=1.3}}const B_={plano:gs},Ll={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:S.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(i){const t=i.game,e=async O=>{for(const[W,dt]of O)await t.say([dt],W)},n=bn.name,s=vn.name,o={x:-8.6,z:2.5},a={x:-21,z:-5,reta:5,raio:5,miolo:2.4},r={x:o.x+4.72,z:o.z+.2},c={x:18,z:-4.5,largura:26,profundidade:19},l={x:-15.5,z:20.5,giro:.35},h=(O,W,dt=0)=>Math.abs(O-c.x)<c.largura/2-dt&&Math.abs(W-c.z)<c.profundidade/2-dt;i.ground({width:240,depth:240,color:S.grass}),i.setBounds(-44,-34,44,32);for(let O=0;O<14;O++)i.disc(i.range(-40,40),i.range(-30,30),i.range(2,6),S.grassDark,.004);i.disc(0,-16.5,8.6,S.sand,.008),i.disc(0,-16.5,8,S.concrete,.012),i.patch(0,4,5.5,56,S.asphalt,0,.016),i.patch(0,9,62,4.5,S.asphalt,0,.02);const u=(O,W,dt)=>{i.patch(a.x,a.z,a.reta*2,O*2,W,0,dt),i.disc(a.x-a.reta,a.z,O,W,dt),i.disc(a.x+a.reta,a.z,O,W,dt)},d=.3;u(a.raio,S.metalWhite,.022),u(a.raio-d,S.asphalt,.026),u(a.miolo+d,S.metalWhite,.03),u(a.miolo,S.grass,.034);const f=(a.raio+a.miolo)/2,g=[1.15,.17];for(const O of[-1,1]){for(let dt=0;dt<5;dt++){const qt=a.x-a.reta+1+dt*(a.reta*2-2)/4;i.patch(qt,a.z+O*f,g[0],g[1],S.metalWhite,0,.038)}const W=a.x+O*a.reta;for(let dt=0;dt<6;dt++){const qt=-Math.PI/2+(dt+.5)/6*Math.PI,Kt=O>0?qt:qt+Math.PI;i.patch(W+Math.cos(Kt)*f,a.z+Math.sin(Kt)*f,g[0],g[1],S.metalWhite,-(Kt+Math.PI/2),.038)}}i.patch(a.x+a.reta*.55,a.z+f,.32,a.raio-a.miolo-d*2,S.metalWhite,0,.04),i.patch(o.x+.4,o.z+.2,10,6.4,S.concrete,0,.02),i.patch(o.x+1.6,7.2,3,7,S.asphalt,0,.022);const _=new I_({radius:12,cabins:32,rpm:1});i.place(_.group,0,0,-26),i.add(_.group),i.blockCircle(0,-26,7.2);for(const O of[-11,11])i.add(i.place(Dn(9,1.2,S.metalWhite),O,0,-20,Math.PI/2)),i.blockBox(O,-20,.2,4.5);i.add(i.place(Qg(2.6),-9.5,0,-21,.4)),i.blockCircle(-9.5,-21,2.7);const m=i.add(i.place(gr(S.fabricBlue,{texto:"Bilheteria"}),9.5,0,-20.5,-.5));i.blockBox(9.5,-20.5,1.4,.95,-.5);const p=[[-6.4,-13.6,1.15],[6.4,-13.6,1.15],[-8.6,-17.4,.95],[8.6,-17.4,.95]];for(const[O,W,dt]of p)i.add(i.place($g(dt,void 0,i.rng()),O,0,W,i.range(0,6.28))),i.blockCircle(O,W,dt+.1);for(const[O,W]of[[-7.6,-11.4],[7.6,-11.4],[-12.2,-19],[12.2,-19]])i.add(i.place(fa(!1),O,0,W)),i.blockCircle(O,W,.35);for(const[O,W,dt]of[[-3.6,-12.2,.1],[3.6,-12.2,-.1],[-13.2,-22.5,1.1]])i.banco(O,W,dt);for(const[O,W]of[[6.9,-18.9],[-5.2,-11.6]])i.add(i.place(hl(),O,0,W)),i.blockCircle(O,W,.35);for(let O=0;O<22;O++){const W=O/22*Math.PI*2+i.range(-.1,.1),dt=i.range(10.5,13.5),qt=Math.cos(W)*dt,Kt=-18+Math.sin(W)*dt*.7;Math.abs(qt)<4.5&&Kt>-14||(O%3===0?i.add(i.place(po(i.range(.6,1),S.leafDark),qt,0,Kt)):O%3===1?i.add(i.place(ll(i.range(.9,1.4)),qt,0,Kt,i.range(0,6.28))):i.add(i.place(so(i.range(.4,.8),i.rng()),qt,0,Kt,i.range(0,6.28))))}i.disc(-21,11,9.2,S.sand,.024),i.disc(-21,11,8.5,S.water,.028),i.blockCircle(-21,11,8.8);const T=[pa(),pa(15262416),pa()];T.forEach((O,W)=>{i.place(O,-21+Math.cos(W*2.1)*4.5,.1,11+Math.sin(W*2.1)*3.5,W*1.7),i.add(O)});const w={x:-21,z:11};for(let O=0;O<34;O++){const W=O/34*Math.PI*2+i.range(-.09,.09),dt=i.range(9.1,11.4),qt=w.x+Math.cos(W)*dt,Kt=w.z+Math.sin(W)*dt,an=O%4;an===0?i.add(i.place(po(i.range(.6,1),S.leafDark),qt,0,Kt)):an===1?i.add(i.place(ll(i.range(.9,1.5)),qt,0,Kt,i.range(0,6.28))):an===2?i.add(i.place(so(i.range(.45,1.5),i.rng()),qt,0,Kt,i.range(0,6.28))):i.add(i.place(mr(5,.8),qt,0,Kt))}for(const[O,W,dt]of[[.9,8.4,1.6],[2.6,8.7,1.1],[4.3,8.3,1.9],[5.6,8.9,1.2]]){const qt=w.x+Math.cos(O)*W,Kt=w.z+Math.sin(O)*W;i.add(i.place(so(dt,O%1,9409947),qt,-.12,Kt,O)),i.blockCircle(qt,Kt,.4*dt)}for(const[O,W]of[[1.5,8.2],[3.4,8.4],[5.1,8.1],[.2,8.5]])i.add(i.place(Zg(i.range(1.1,1.6)),w.x+Math.cos(O)*W,0,w.z+Math.sin(O)*W));const M=[[1.1,6.6,1,!0],[2.9,7.2,.8,!1],[4.6,6.1,1.15,!0],[.4,7.4,.9,!0],[3.8,5.2,1.05,!1],[5.9,6.8,.85,!0]];for(const[O,W,dt,qt]of M){const Kt=i.place(Kg(dt,qt),w.x+Math.cos(O)*W,.045,w.z+Math.sin(O)*W);Kt.rotation.y=O,i.add(Kt)}const I=c.x-c.largura/2,E=c.x+c.largura/2,A=c.z-c.profundidade/2,C=c.z+c.profundidade/2;i.patch(c.x,c.z,c.largura,c.profundidade,S.grassDark,0,.008);const y=(O,W,dt,qt)=>{i.patch(O,W,dt,qt,15922416,0,.012)};y(c.x,A+.3,c.largura-1.2,.28),y(c.x,C-.3,c.largura-1.2,.28),y(I+.6,c.z,.28,c.profundidade-.6),y(E-.6,c.z,.28,c.profundidade-.6),y(c.x,c.z,.28,c.profundidade-.6),y(I+6,c.z,.22,c.profundidade-.6),y(E-6,c.z,.22,c.profundidade-.6),i.disc(c.x,c.z,2.2,15922416,.011),i.disc(c.x,c.z,1.9,S.grassDark,.012);const v=(O,W,dt,qt)=>{i.add(i.place(Dn(dt,1.5,S.metalWhite),O,0,W,qt?Math.PI/2:0)),qt?i.blockBox(O,W,.2,dt/2):i.blockBox(O,W,dt/2,.2)};v(c.x,A,c.largura,!1),v(c.x,C,c.largura,!1),v(E,c.z,c.profundidade,!0),v(I,A+3.75,7.5,!0),v(I,C-3.75,7.5,!0),i.add(i.place(ml(),I+3,0,c.z)),i.blockCircle(I+3,c.z,.5);const D=i.add(i.place(ml(S.frisbee),E-3,0,c.z));i.blockCircle(E-3,c.z,.5);const F=i.add(i.place(hv(),c.x,0,A+1.2));i.blockBox(c.x,A+1.2,1,.2);const z=i.add(i.place(uv(6),c.x,0,C-1.2,Math.PI));i.blockBox(c.x,C-1.4,3,.8);const q=i.add(i.place(dv(),I+1.6,0,c.z+4.2,Math.PI/2));i.blockCircle(I+1.6,c.z+4.2,.4);const Y=i.add(i.place(fv(),I+1.8,0,c.z-3.4,.4)),Z=i.add(i.place(mv(),E-1.6,0,C-2.4));i.blockCircle(E-1.6,C-2.4,.3);const et=Z.userData.manga;i.onUpdate((O,W)=>{Z.rotation.y=Math.sin(W*.3)*.5+.6,et.rotation.z=Math.sin(W*1.7)*.12-.06});for(const[O,W]of[[I+1,A+1],[E-1,A+1],[I+1,C-1],[E-1,C-1]])i.add(i.place(pv(),O,0,W,Math.atan2(c.x-O,c.z-W))),i.blockCircle(O,W,.4);for(const[O,W]of[[I+6,A+1.4],[I+6,C-1.4],[E-6,A+1.4],[E-6,C-1.4]])i.add(i.place(ul(),O,0,W));const j=i.add(i.place(gl("Frisbee!",S.frisbee),I-1.8,0,c.z+3.4,Math.PI*.25));i.blockCircle(I-1.8,c.z+3.4,.3);const nt=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[O,W,dt]of nt)i.banco(O,W,dt);for(const[O,W]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,2]])i.add(i.place(fa(!1),O,0,W)),i.blockCircle(O,W,.35);for(const[O,W]of[[3.4,17],[-3.4,11]])i.add(i.place(hl(),O,0,W)),i.blockCircle(O,W,.35);const X=i.add(i.place(tv(),-10,0,20,.3));i.blockBox(-10,20,1,.9,.3);const vt=iv(),Wt=bo(S.metalRed);Wt.position.set(-.78,.82,.3),Wt.rotation.set(-Math.PI/2,0,.7),vt.add(Wt);const te=bo(S.fabricBlue);te.position.set(.82,.82,-.28),te.rotation.set(-Math.PI/2,0,-2.3),vt.add(te);const le=Eh();le.position.set(.36,.845,.42),vt.add(le),i.add(i.place(vt,l.x,0,l.z,l.giro)),i.blockBox(l.x,l.z,1.45,.85,l.giro);const se=[Wt,te,le],st=i.add(i.place(gr(16164544,{tipo:"sorvete"}),12,0,18.6,.3));i.blockBox(12,18.6,1.4,.95,.3);const ht=i.add(i.place(sv(S.fabricBlue),o.x,0,o.z));ht.userData.loja=!0,i.blockBox(o.x,o.z-.05,3.7,2.3),i.blockBox(r.x,r.z,.65,1.6);for(const O of[-1,1])i.blockCircle(o.x+O*4.05,o.z+2.82,.16);for(const O of[-1.4,1])i.banco(o.x-5.6,o.z+O,Math.PI/2);for(const[O,W]of[[a.x-a.reta-a.raio-1.4,a.z],[a.x+a.reta+a.raio+1.4,a.z]])i.add(i.place(fa(!1),O,0,W)),i.blockCircle(O,W,.35);const Rt=14;for(let O=0;O<Rt;O++){const W=O/Rt*Math.PI*2,dt=O%2===0?a.miolo+.9:a.raio-.9,qt=a.x+Math.cos(W)*dt+Math.sign(Math.cos(W))*a.reta*Math.abs(Math.cos(W)),Kt=a.z+Math.sin(W)*dt;i.add(i.place(ul(),qt,0,Kt,i.range(0,6.28)))}i.interact({id:"parque:patins",x:r.x+1.8,z:r.z,radius:2.4,label:"Alugar patins",icon:"🛼",highlight:ht,onInteract:async O=>{if(O.hasItem(ce.patins.id)){await e([[s,"A gente já pegou um par."],[n,"É, e eu ainda não caí. Ainda."]]);return}await e([[s,"Um par pra cada um, moço."],[n,"Eu não sei patinar direito, hein."],[s,"Por isso eu vou do seu lado."]]),O.equipWearable(ce.patins),O.som("sorvete"),O.toast("Patins calçados","🛼"),O.unlock({id:"patins-villa",title:"Patins no Villa",place:"Parque Villa Lobos",note:"A pista tem cone pra desviar e a gente desviou de quase todos.",icon:"🛼"})}});const Bt=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8],[-21,-5,12],[-8.6,2.5,9]],Dt=(O,W)=>Math.abs(O)<4&&W>-20&&W<30?!1:!Bt.some(([dt,qt,Kt])=>Math.hypot(O-dt,W-qt)<Kt),ee=["redonda","redonda","pinheiro","florida","palmeira"];let me=0;for(let O=0;O<260&&me<64;O++){const W=i.range(-42,42),dt=i.range(-32,30);if(!Dt(W,dt))continue;const qt=i.range(.85,1.5);i.add(i.place(pr(i.pick(ee),qt,i.rng()),W,0,dt,i.range(0,6.28))),i.blockCircle(W,dt,.45*qt),me++}for(let O=0;O<90;O++){const W=i.range(-42,42),dt=i.range(-32,30);Dt(W,dt)&&(O%3===0?i.add(i.place(mr(6,1.1),W,0,dt)):O%3===1?i.add(i.place(po(i.range(.7,1.2)),W,0,dt)):i.add(i.place(so(i.range(.5,1)),W,0,dt)))}i.patch(-66,-10,18,220,S.water,0,.02),i.patch(-55,-10,6,220,S.concrete,0,.03);for(let O=0;O<22;O++){const W=i.range(7,20),dt=i.range(4,9);i.add(i.place(vr(dt,W,dt*.9,i.pick([S.wallCream,S.concrete,S.wallMint]),S.metalGrey),i.range(-95,60),0,-96-i.range(0,16)))}for(let O=0;O<14;O++){const W=i.range(6,16);i.add(i.place(vr(i.range(4,8),W,5,S.wallCream,S.roofTile),92+i.range(0,16),0,i.range(-60,40)))}for(let O=0;O<90;O++){const W=O/90*Math.PI*2,dt=62+i.range(0,28),qt=Math.cos(W)*dt,Kt=Math.sin(W)*dt*.9;qt<-50||i.add(i.place(pr(i.pick(ee),i.range(1.2,2.2),i.rng()),qt,0,Kt,i.range(0,6.28)))}for(let O=0;O<9;O++){const W=wh(i.range(1.6,3.2));W.position.set(i.range(-70,70),i.range(56,70),i.range(-60,45)),i.root.add(W);const dt=i.range(.25,.6);i.onUpdate(qt=>{W.position.x+=dt*qt,W.position.x>56&&(W.position.x=-56)})}const N=i.add(i.place(ev(S.wood,S.metalWhite),2.6,0,27.5,Math.PI));i.add(i.place(Dn(16,1.4),-10,0,28)),i.add(i.place(Dn(16,1.4),10,0,28)),i.blockBox(-10,28,8,.2),i.blockBox(10,28,8,.2),i.add(i.place(Dn(11,1.4),35,0,3.5,Math.PI/2)),i.add(i.place(Dn(11,1.4),35,0,22.5,Math.PI/2)),i.blockBox(35,3.5,.2,5.5),i.blockBox(35,22.5,.2,5.5),i.patch(30,13,12,5,S.asphalt),i.patch(40,13,12,34,S.asphalt),i.patch(35.6,13,1.6,34,S.concrete,0,.012);const ut=i.add(i.place(gv(4161494),39.5,0,13,-Math.PI/2));i.blockBox(39.5,13,1.5,4.3);const rt=i.add(i.place(vv(),36.4,0,13,-Math.PI/2));i.blockBox(35.9,13,.3,1.8);const ot=i.add(i.place(gl("Clube!",5161384),36.4,0,8.6,Math.PI*.25));i.blockCircle(36.4,8.6,.3),i.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:ut,radius:2.6}),i.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:N,radius:2.2});const J=new L_(S.frisbee);J.mesh.visible=!1,J.onLand=()=>t.som("quicar"),i.root.add(J.mesh);const yt=1.3,pt=6,St=30,kt={alem:3.5,arco:1.2,erro:.06,desvio:1.4,alcance:3,raio:2.1,mira:.12},Yt={minX:I+.7,minZ:A+.7,maxX:E-.7,maxZ:C-.7};let L="fora",b=0,H=0,tt=!1,lt=0,$=null;const It=(O,W)=>{O.som("pegar"),lt+=1;const dt=O.bump("frisbee.trocas"),qt=O.stat("frisbee.recorde");lt>qt&&O.bump("frisbee.recorde",lt-qt),W?O.toast("Pegou no ar!","🥏"):lt%5===0&&O.toast(`${lt} trocas seguidas!`,"🥏"),dt>=10&&!O.flag("memoria-frisbee")&&(O.setFlag("memoria-frisbee"),O.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"}))},_t=(O,W,dt)=>Math.max(W,Math.min(dt,O)),Ut=(O,W)=>Math.atan2(Math.sin(O-W),Math.cos(O-W)),Nt=O=>{const W=O.x<c.x?1:-1;return{x:_t(O.x+W*11,I+2,E-2),z:_t(O.z,A+2,C-2)}},mt=()=>{tt=!1,H=0,t.showCharge(null)},At=()=>t.getActiveHandItem()?.id===ce.frisbee.id;let Vt=!1;const Ot=()=>{const O=t.addItem(ce.frisbee);return O==="cheio"?(Vt||(Vt=!0,t.toast("Sem vaga pro frisbee","🥏")),!1):(L="comigo",J.pickUp(),lt=0,$=null,t.setZoom(19),t.toast(O==="mao"?"Segure F para lançar mais longe":"Frisbee guardado — escolha ele na mochila (I)","🥏"),!0)},Et=()=>{L="fora",Vt=!1,t.removeItem(ce.frisbee.id),J.mesh.visible=!1,mt(),t.freeCompanion(),t.setZoom(14),$=null},Zt=O=>{if(L!=="comigo"||!At())return;t.removeItem(ce.frisbee.id);const W=pt+(St-pt)*_t(O,0,1);J.throwAt(t.playerPosition(),t.playerFacing(),W),t.som("lancar"),L="voando-pra-ele"},B=i.interact({id:"parque:frisbee-jogar",x:c.x,z:c.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>Zt(.55)}),gt=i.interact({id:"parque:frisbee-pegar",x:c.x,z:c.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:O=>{O.addItem(ce.frisbee)!=="cheio"&&(J.pickUp(),L="comigo",It(O,!1))}});i.onUpdate(O=>{J.update(O,Yt);const W=t.playerPosition(),dt=t.companionPosition(),qt=h(W.x,W.z,.4);if(qt&&L==="fora"?Ot():!qt&&L!=="fora"&&Et(),L==="fora"){B.enabled=!1,gt.enabled=!1;return}if(L==="comigo"&&At()){if(t.keyDown("KeyF"))tt=!0,H=Math.min(1,H+O/yt),t.showCharge(H);else if(tt){const Kt=H;mt(),Zt(Kt)}}else tt&&mt();if(L==="comigo"||L==="no-chao"){const Kt=Nt(W);(!$||Math.hypot(Kt.x-$.x,Kt.z-$.z)>2.5)&&(t.commandCompanion(Kt.x,Kt.z),$=Kt)}switch(J.mesh.userData.fase=L,L){case"comigo":J.holdAt(W,t.playerFacing()),J.mesh.visible=!1;break;case"com-ele":{const Kt=Math.atan2(W.x-dt.x,W.z-dt.z);t.holdCompanion(W.x,W.z),J.holdAt(dt,Kt),b-=O;const an=Math.abs(Ut(t.companionFacing(),Kt))<kt.mira;if(b<=0&&(an||b<-1)){const Qi=W.x-dt.x,ti=W.z-dt.z,ts=Math.hypot(Qi,ti)||1,Is=new U(_t(W.x+Qi/ts*kt.alem+(Math.random()-.5)*kt.desvio,I+1.5,E-1.5),0,_t(W.z+ti/ts*kt.alem+(Math.random()-.5)*kt.desvio,A+1.5,C-1.5));J.throwToward(dt,Is,kt.erro,kt.arco),t.som("lancar"),$=null,L="voando-pra-mim"}break}case"voando-pra-ele":{if(J.state==="voando"&&J.position.y<2.3&&Math.hypot(J.position.x-dt.x,J.position.z-dt.z)<1.5){t.som("pegar"),t.holdCompanion(W.x,W.z),$=null,J.pickUp(),b=.7,L="com-ele",t.toast("Ele pegou no ar!","🙌");break}J.state==="chao"&&(J.position.distanceTo(dt)<1.6?(t.holdCompanion(W.x,W.z),$=null,J.pickUp(),b=.8,L="com-ele"):(t.commandCompanion(J.position.x,J.position.z),$=null,L="buscando"));break}case"buscando":J.position.distanceTo(dt)<1.1&&(t.holdCompanion(W.x,W.z),$=null,J.pickUp(),b=.9,L="com-ele");break;case"voando-pra-mim":{if(J.state==="voando"&&J.position.y<kt.alcance&&Math.hypot(J.position.x-W.x,J.position.z-W.z)<kt.raio){if(t.addItem(ce.frisbee)==="cheio")break;J.pickUp(),L="comigo",It(t,!0);break}J.state==="chao"&&(L="no-chao",J.position.distanceTo(W)<1.9&&t.addItem(ce.frisbee)!=="cheio"&&(J.pickUp(),L="comigo",It(t,!1)));break}case"no-chao":J.position.distanceTo(W)<1.2&&(J.pickUp(),L="comigo",It(t,!1));break}B.enabled=L==="comigo",gt.enabled=L==="no-chao",L==="comigo"?B.moveTo(W.x,W.z):gt.moveTo(J.position.x,J.position.z)}),i.interact({id:"parque:placa-quadra",x:I-1.8,z:c.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:j,onInteract:()=>e([[s,"QUADRA LIVRE — respeite quem chegou primeiro."],[n,"Hoje só tem a gente."],[s,"Então segura o F e manda ver. Quanto mais tempo segurar, mais longe vai."]])}),i.interact({id:"parque:placar",x:c.x,z:A+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:F,onInteract:O=>{const W=O.stat("frisbee.recorde"),dt=O.stat("frisbee.trocas");return e([[n,W>0?`Nosso recorde é ${W} trocas seguidas.`:"O placar tá zerado."],[s,dt>0?`E já foram ${dt} no total. A gente não desiste fácil.`:"Bora estrear isso então."]])}}),i.interact({id:"parque:arquibancada",x:c.x,z:C-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:z,onInteract:()=>e([[s,"Cansei. Cinco minutos."],[n,"Você falou cinco minutos faz meia hora."],[s,"E olha que descanso bem, hein."]])}),i.interact({id:"parque:bebedouro",x:I+2.8,z:c.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:q,onInteract:async O=>{await e([[n,"A água daqui é sempre meio quente."],[s,"Mas depois de correr atrás de disco, tá ótima."]]),O.toast("Água (meio quente)","🚰")}}),i.interact({id:"parque:sacola",x:I+2.8,z:c.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:Y,onInteract:()=>e([[s,"Tem uns três discos aqui de gente que esqueceu."],[n,"Um deles é seu. Desde março."],[s,"…é, pode ser."]])}),i.interact({id:"parque:cesta",x:E-4.4,z:c.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:D,onInteract:()=>e([[n,"Um dia a gente acerta essa cesta."],[s,"Já acertei uma vez!"],[n,"Você acertou o poste. É diferente."]])}),i.interact({id:"parque:biruta",x:E-3,z:C-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:Z,onInteract:()=>e([[s,"O vento tá indo pra lá."],[n,"Então joga contra que o disco fica no ar mais tempo."],[s,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),i.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:rt,onInteract:()=>e([[n,"Esse é o que passa no clube?"],[s,"É esse. Já tá parado, é só subir."]])}),i.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:ot,onInteract:()=>e([[s,'"Clube!" — com exclamação e tudo.'],[n,"Quem escreveu isso tava animado."]])}),i.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async O=>{O.som("pato"),await O.say(["Que lago bonito... dá até vontade de pular"],vn.name),await O.say(["Então vamos! Hahahha"],bn.name),await O.say(["NÃAAOOO"],vn.name),O.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});let Mt=0;i.onUpdate(O=>{Mt<=0||(Mt-=O,Mt<=0&&(t.removeItem(ce.sorveteMorango.id,bn.id),t.removeItem(ce.sorveteMaracuja.id,vn.id),t.toast("Acabou o sorvete","🍦")))});const wt=new z_(5);wt.guardar(),vt.add(wt.grupo),wt.onSom=O=>t.som(O),vt.userData.pingpong=wt;const ft=(O,W)=>{const dt=new U(O,0,W);return vt.localToWorld(dt),dt};let at=!1;const Lt=B_.plano+.55,Jt=()=>{at=!1,wt.guardar();for(const O of se)O.visible=!0;t.showPlacar(null),t.setCameraOmbro(null),t.setPlayerVisible(!0),t.lockPlayer(!1),t.freeCompanion(),ge.enabled=!0};i.onUpdate(O=>{at&&(wt.update(O,t.pointer()),at&&t.showPlacar({eu:t.playerName(),ele:t.companionName(),meus:wt.meus,dele:wt.dele}))});const ge=i.interact({id:"parque:pingpong",x:l.x,z:l.z,radius:2.6,label:"Jogar ping pong",icon:"🏓",highlight:vt,onInteract:async O=>{if(at)return;await e([[n,"Cinco pontos?"],[s,"Cinco pontos. E o perdedor carrega a bolsa até em casa."]]);const W=ft(-Lt,0),dt=ft(Lt,0);O.releasePlayer(W.x,W.z,Math.atan2(dt.x-W.x,dt.z-W.z)),O.releaseCompanion(dt.x,dt.z,Math.atan2(W.x-dt.x,W.z-dt.z)),O.holdCompanion(W.x,W.z),O.lockPlayer(!0);const qt=ft(-Lt-1.6,0),Kt=ft(0,0);O.setCameraOmbro(new U(qt.x,2.35,qt.z),new U(Kt.x,.9,Kt.z)),O.setPlayerVisible(!1);for(const an of se)an.visible=!1;ge.enabled=!1,wt.comecar(),at=!0,O.toast("Mexa o mouse para mover a raquete","🏓")}});wt.onPonto=O=>{t.som(O?"confirma":"quicar")},wt.onFim=O=>{(async()=>(Jt(),O?(t.som("memoria"),t.toast("Campeão de ping pong!","🏆"),t.equipWearable(ce.chapeuPingPong),await e([[n,"Cinco a "+wt.dele+"."],[s,"Você ganhou o chapéu. Vai ter que usar."]]),t.unlock({id:"memoria-ping-pong",title:"A mesa do parque",place:"Parque Villa Lobos",note:"Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.",icon:"🏓"})):await e([[s,"Cinco a "+wt.meus+". Revanche?"],[n,"Sempre revanche."]])))()},i.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:st,onInteract:async O=>{await e([[n,"Dois, por favor."],[s,"Um de morango e um de maracujá."],[n,"Nunca pedimos diferente."]]),Mt=50,O.addItem(ce.sorveteMorango,bn.id),O.addItem(ce.sorveteMaracuja,vn.id),O.som("sorvete"),O.toast("Morango e maracujá","🍦"),O.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),i.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:X,onInteract:async O=>{await e([[s,"A toalha xadrez de sempre."],[n,"E o pão de queijo já frio."],[s,"Frio é melhor. Aceita."]]),O.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),i.interact({id:"parque:bilheteria",x:9.5,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:m,onInteract:()=>e([[n,"Dois pra roda gigante."],[s,"Sempre dois."]])});let ie=null;const je=O=>new Promise(W=>{ie={resolve:W,de:_.angle,voltas:O}});let qe=!0;i.onUpdate(O=>{if(_.update(O),qe){const W=t.playerPosition(),dt=Math.hypot(W.x,W.z+26);if(dt<28){const qt=Math.max(0,Math.min(1,(dt-8)/20));t.setZoom(36-qt*21)}}if(T.forEach((W,dt)=>{W.position.y=.1+Math.sin(performance.now()/900+dt)*.05}),ie&&_.turnsSince(ie.de)>=ie.voltas){const W=ie.resolve;ie=null,W()}}),i.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async O=>{qe=!1,O.lockPlayer(!0),await e([[s,"A fila tá curta hoje."],[n,"Bora subir?"]]);const W=_.boardingCabin(),dt=_.speed;_.speed=dt*5,O.som("sino"),O.ridePlayer(W,new U(-.3,-.34,0),.55),O.rideCompanion(W,new U(.3,-.34,0),.55),O.focusCamera(W),O.setZoom(38),await je(.25),await e([[n,"Daqui dá pra ver o parque inteiro."],[s,"E aquele pedacinho do rio ali atrás."]]),await je(.35),await e([[n,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[s,"Pronto. Subimos."]]),await je(.4),_.speed=dt,O.focusCamera(null),O.releasePlayer(0,-17.6,0),O.releaseCompanion(-1.1,-17.9,0),O.lockPlayer(!1),qe=!0,O.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},k_={[Pr.id]:Pr,[Rl.id]:Rl,[Ll.id]:Ll,[Al.id]:Al},H_=Pr.id,Nh=document.getElementById("app");if(!Nh)throw new Error("#app nao encontrado");const Io=new h_(Nh,k_,C_,H_),Ps=new URLSearchParams(location.search),V_=Ps.get("cena")??void 0,G_=Ps.get("entrada")??void 0;Io.start(V_,G_);const Ma=Number(Ps.get("zoom"));Number.isFinite(Ma)&&Ma>0&&Io.setZoom(Ma);const ls=Ps.get("em")?.split(",").map(Number);if(ls&&ls.length===2&&ls.every(Number.isFinite)){const i=Number(Ps.get("olhar"));Io.debugPlace(ls[0],ls[1],Number.isFinite(i)?i:Math.PI/4)}window.jogo=Io;window.aristoryAudio={Musica:Dh,CLIMAS:vo,EFEITOS:Lh};window.aristoryItens=Object.fromEntries(Object.values(ce).map(i=>[i.id,i]));
