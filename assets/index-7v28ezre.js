(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(o){if(o.ep)return;o.ep=!0;const s=e(o);fetch(o.href,s)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const vc="180",Hd=0,Bc=1,Gd=2,Sh=1,wh=2,Vn=3,jn=0,Qe=1,wn=2,ri=0,to=1,kc=2,Vc=3,Hc=4,qd=5,bi=100,Wd=101,Xd=102,jd=103,Yd=104,$d=200,Zd=201,Jd=202,Kd=203,lr=204,hr=205,Qd=206,tu=207,eu=208,nu=209,iu=210,ou=211,su=212,au=213,ru=214,dr=0,ur=1,fr=2,no=3,pr=4,mr=5,gr=6,vr=7,Eh=0,cu=1,lu=2,ci=0,hu=1,du=2,uu=3,fu=4,pu=5,mu=6,gu=7,Th=300,io=301,oo=302,_r=303,Mr=304,sa=306,Uo=1e3,wi=1001,xr=1002,$e=1003,vu=1004,as=1005,Cn=1006,ma=1007,Ei=1008,Un=1009,Ah=1010,Ph=1011,No=1012,_c=1013,Ai=1014,Gn=1015,jo=1016,Mc=1017,xc=1018,zo=1020,Ch=35902,Rh=35899,Ih=1021,Dh=1022,An=1023,Oo=1026,Fo=1027,yc=1028,bc=1029,Lh=1030,Sc=1031,wc=1033,Fs=33776,Bs=33777,ks=33778,Vs=33779,yr=35840,br=35841,Sr=35842,wr=35843,Er=36196,Tr=37492,Ar=37496,Pr=37808,Cr=37809,Rr=37810,Ir=37811,Dr=37812,Lr=37813,Ur=37814,Nr=37815,zr=37816,Or=37817,Fr=37818,Br=37819,kr=37820,Vr=37821,Hr=36492,Gr=36494,qr=36495,Wr=36283,Xr=36284,jr=36285,Yr=36286,_u=3200,Mu=3201,Uh=0,xu=1,si="",Ke="srgb",so="srgb-linear",$s="linear",xe="srgb",Di=7680,Gc=519,yu=512,bu=513,Su=514,Nh=515,wu=516,Eu=517,Tu=518,Au=519,qc=35044,Wc="300 es",Rn=2e3,Zs=2001;class lo{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const o=i[t];if(o!==void 0){const s=o.indexOf(e);s!==-1&&o.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const o=i.slice(0);for(let s=0,a=o.length;s<a;s++)o[s].call(this,t);t.target=null}}}const Oe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Xc=1234567;const Co=Math.PI/180,Bo=180/Math.PI;function Ri(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Oe[n&255]+Oe[n>>8&255]+Oe[n>>16&255]+Oe[n>>24&255]+"-"+Oe[t&255]+Oe[t>>8&255]+"-"+Oe[t>>16&15|64]+Oe[t>>24&255]+"-"+Oe[e&63|128]+Oe[e>>8&255]+"-"+Oe[e>>16&255]+Oe[e>>24&255]+Oe[i&255]+Oe[i>>8&255]+Oe[i>>16&255]+Oe[i>>24&255]).toLowerCase()}function re(n,t,e){return Math.max(t,Math.min(e,n))}function Ec(n,t){return(n%t+t)%t}function Pu(n,t,e,i,o){return i+(n-t)*(o-i)/(e-t)}function Cu(n,t,e){return n!==t?(e-n)/(t-n):0}function Ro(n,t,e){return(1-e)*n+e*t}function Ru(n,t,e,i){return Ro(n,t,1-Math.exp(-e*i))}function Iu(n,t=1){return t-Math.abs(Ec(n,t*2)-t)}function Du(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function Lu(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function Uu(n,t){return n+Math.floor(Math.random()*(t-n+1))}function Nu(n,t){return n+Math.random()*(t-n)}function zu(n){return n*(.5-Math.random())}function Ou(n){n!==void 0&&(Xc=n);let t=Xc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Fu(n){return n*Co}function Bu(n){return n*Bo}function ku(n){return(n&n-1)===0&&n!==0}function Vu(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Hu(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Gu(n,t,e,i,o){const s=Math.cos,a=Math.sin,r=s(e/2),c=a(e/2),l=s((t+i)/2),h=a((t+i)/2),d=s((t-i)/2),u=a((t-i)/2),f=s((i-t)/2),g=a((i-t)/2);switch(o){case"XYX":n.set(r*h,c*d,c*u,r*l);break;case"YZY":n.set(c*u,r*h,c*d,r*l);break;case"ZXZ":n.set(c*d,c*u,r*h,r*l);break;case"XZX":n.set(r*h,c*g,c*f,r*l);break;case"YXY":n.set(c*f,r*h,c*g,r*l);break;case"ZYZ":n.set(c*g,c*f,r*h,r*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+o)}}function Zi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function We(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ne={DEG2RAD:Co,RAD2DEG:Bo,generateUUID:Ri,clamp:re,euclideanModulo:Ec,mapLinear:Pu,inverseLerp:Cu,lerp:Ro,damp:Ru,pingpong:Iu,smoothstep:Du,smootherstep:Lu,randInt:Uu,randFloat:Nu,randFloatSpread:zu,seededRandom:Ou,degToRad:Fu,radToDeg:Bu,isPowerOfTwo:ku,ceilPowerOfTwo:Vu,floorPowerOfTwo:Hu,setQuaternionFromProperEuler:Gu,normalize:We,denormalize:Zi};class Dt{constructor(t=0,e=0){Dt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,o=t.elements;return this.x=o[0]*e+o[3]*i+o[6],this.y=o[1]*e+o[4]*i+o[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(re(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),o=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*o+t.x,this.y=s*o+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ho{constructor(t=0,e=0,i=0,o=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=o}static slerpFlat(t,e,i,o,s,a,r){let c=i[o+0],l=i[o+1],h=i[o+2],d=i[o+3];const u=s[a+0],f=s[a+1],g=s[a+2],M=s[a+3];if(r===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d;return}if(r===1){t[e+0]=u,t[e+1]=f,t[e+2]=g,t[e+3]=M;return}if(d!==M||c!==u||l!==f||h!==g){let m=1-r;const p=c*u+l*f+h*g+d*M,S=p>=0?1:-1,x=1-p*p;if(x>Number.EPSILON){const A=Math.sqrt(x),P=Math.atan2(A,p*S);m=Math.sin(m*P)/A,r=Math.sin(r*P)/A}const y=r*S;if(c=c*m+u*y,l=l*m+f*y,h=h*m+g*y,d=d*m+M*y,m===1-r){const A=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=A,l*=A,h*=A,d*=A}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,o,s,a){const r=i[o],c=i[o+1],l=i[o+2],h=i[o+3],d=s[a],u=s[a+1],f=s[a+2],g=s[a+3];return t[e]=r*g+h*d+c*f-l*u,t[e+1]=c*g+h*u+l*d-r*f,t[e+2]=l*g+h*f+r*u-c*d,t[e+3]=h*g-r*d-c*u-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,o){return this._x=t,this._y=e,this._z=i,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,o=t._y,s=t._z,a=t._order,r=Math.cos,c=Math.sin,l=r(i/2),h=r(o/2),d=r(s/2),u=c(i/2),f=c(o/2),g=c(s/2);switch(a){case"XYZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"YXZ":this._x=u*h*d+l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"ZXY":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d-u*f*g;break;case"ZYX":this._x=u*h*d-l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d+u*f*g;break;case"YZX":this._x=u*h*d+l*f*g,this._y=l*f*d+u*h*g,this._z=l*h*g-u*f*d,this._w=l*h*d-u*f*g;break;case"XZY":this._x=u*h*d-l*f*g,this._y=l*f*d-u*h*g,this._z=l*h*g+u*f*d,this._w=l*h*d+u*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,o=Math.sin(i);return this._x=t.x*o,this._y=t.y*o,this._z=t.z*o,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],o=e[4],s=e[8],a=e[1],r=e[5],c=e[9],l=e[2],h=e[6],d=e[10],u=i+r+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-c)*f,this._y=(s-l)*f,this._z=(a-o)*f}else if(i>r&&i>d){const f=2*Math.sqrt(1+i-r-d);this._w=(h-c)/f,this._x=.25*f,this._y=(o+a)/f,this._z=(s+l)/f}else if(r>d){const f=2*Math.sqrt(1+r-i-d);this._w=(s-l)/f,this._x=(o+a)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+d-i-r);this._w=(a-o)/f,this._x=(s+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(re(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const o=Math.min(1,e/i);return this.slerp(t,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,o=t._y,s=t._z,a=t._w,r=e._x,c=e._y,l=e._z,h=e._w;return this._x=i*h+a*r+o*l-s*c,this._y=o*h+a*c+s*r-i*l,this._z=s*h+a*l+i*c-o*r,this._w=a*h-i*r-o*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,o=this._y,s=this._z,a=this._w;let r=a*t._w+i*t._x+o*t._y+s*t._z;if(r<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,r=-r):this.copy(t),r>=1)return this._w=a,this._x=i,this._y=o,this._z=s,this;const c=1-r*r;if(c<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*i+e*this._x,this._y=f*o+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,r),d=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=a*d+this._w*u,this._x=i*d+this._x*u,this._y=o*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),o=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(o*Math.sin(t),o*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class N{constructor(t=0,e=0,i=0){N.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(jc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(jc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,o=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*o,this.y=s[1]*e+s[4]*i+s[7]*o,this.z=s[2]*e+s[5]*i+s[8]*o,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,o=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*o+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*o+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*o+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*o+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,o=this.z,s=t.x,a=t.y,r=t.z,c=t.w,l=2*(a*o-r*i),h=2*(r*e-s*o),d=2*(s*i-a*e);return this.x=e+c*l+a*d-r*h,this.y=i+c*h+r*l-s*d,this.z=o+c*d+s*h-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,o=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*o,this.y=s[1]*e+s[5]*i+s[9]*o,this.z=s[2]*e+s[6]*i+s[10]*o,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(re(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,o=t.y,s=t.z,a=e.x,r=e.y,c=e.z;return this.x=o*c-s*r,this.y=s*a-i*c,this.z=i*r-o*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ga.copy(this).projectOnVector(t),this.sub(ga)}reflect(t){return this.sub(ga.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(re(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,o=this.z-t.z;return e*e+i*i+o*o}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const o=Math.sin(e)*t;return this.x=o*Math.sin(i),this.y=Math.cos(e)*t,this.z=o*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),o=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=o,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ga=new N,jc=new ho;class ie{constructor(t,e,i,o,s,a,r,c,l){ie.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,o,s,a,r,c,l)}set(t,e,i,o,s,a,r,c,l){const h=this.elements;return h[0]=t,h[1]=o,h[2]=r,h[3]=e,h[4]=s,h[5]=c,h[6]=i,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,o=e.elements,s=this.elements,a=i[0],r=i[3],c=i[6],l=i[1],h=i[4],d=i[7],u=i[2],f=i[5],g=i[8],M=o[0],m=o[3],p=o[6],S=o[1],x=o[4],y=o[7],A=o[2],P=o[5],C=o[8];return s[0]=a*M+r*S+c*A,s[3]=a*m+r*x+c*P,s[6]=a*p+r*y+c*C,s[1]=l*M+h*S+d*A,s[4]=l*m+h*x+d*P,s[7]=l*p+h*y+d*C,s[2]=u*M+f*S+g*A,s[5]=u*m+f*x+g*P,s[8]=u*p+f*y+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8];return e*a*h-e*r*l-i*s*h+i*r*c+o*s*l-o*a*c}invert(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],d=h*a-r*l,u=r*c-h*s,f=l*s-a*c,g=e*d+i*u+o*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/g;return t[0]=d*M,t[1]=(o*l-h*i)*M,t[2]=(r*i-o*a)*M,t[3]=u*M,t[4]=(h*e-o*c)*M,t[5]=(o*s-r*e)*M,t[6]=f*M,t[7]=(i*c-l*e)*M,t[8]=(a*e-i*s)*M,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,o,s,a,r){const c=Math.cos(s),l=Math.sin(s);return this.set(i*c,i*l,-i*(c*a+l*r)+a+t,-o*l,o*c,-o*(-l*a+c*r)+r+e,0,0,1),this}scale(t,e){return this.premultiply(va.makeScale(t,e)),this}rotate(t){return this.premultiply(va.makeRotation(-t)),this}translate(t,e){return this.premultiply(va.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let o=0;o<9;o++)if(e[o]!==i[o])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const va=new ie;function zh(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Js(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function qu(){const n=Js("canvas");return n.style.display="block",n}const Yc={};function ko(n){n in Yc||(Yc[n]=!0,console.warn(n))}function Wu(n,t,e){return new Promise(function(i,o){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:o();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}const $c=new ie().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zc=new ie().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xu(){const n={enabled:!0,workingColorSpace:so,spaces:{},convert:function(o,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===xe&&(o.r=Wn(o.r),o.g=Wn(o.g),o.b=Wn(o.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(o.applyMatrix3(this.spaces[s].toXYZ),o.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xe&&(o.r=eo(o.r),o.g=eo(o.g),o.b=eo(o.b))),o},workingToColorSpace:function(o,s){return this.convert(o,this.workingColorSpace,s)},colorSpaceToWorking:function(o,s){return this.convert(o,s,this.workingColorSpace)},getPrimaries:function(o){return this.spaces[o].primaries},getTransfer:function(o){return o===si?$s:this.spaces[o].transfer},getToneMappingMode:function(o){return this.spaces[o].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(o,s=this.workingColorSpace){return o.fromArray(this.spaces[s].luminanceCoefficients)},define:function(o){Object.assign(this.spaces,o)},_getMatrix:function(o,s,a){return o.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(o){return this.spaces[o].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(o=this.workingColorSpace){return this.spaces[o].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(o,s){return ko("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(o,s)},toWorkingColorSpace:function(o,s){return ko("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(o,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[so]:{primaries:t,whitePoint:i,transfer:$s,toXYZ:$c,fromXYZ:Zc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ke},outputColorSpaceConfig:{drawingBufferColorSpace:Ke}},[Ke]:{primaries:t,whitePoint:i,transfer:xe,toXYZ:$c,fromXYZ:Zc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ke}}}),n}const me=Xu();function Wn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function eo(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Li;class ju{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Li===void 0&&(Li=Js("canvas")),Li.width=t.width,Li.height=t.height;const o=Li.getContext("2d");t instanceof ImageData?o.putImageData(t,0,0):o.drawImage(t,0,0,t.width,t.height),i=Li}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Js("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const o=i.getImageData(0,0,t.width,t.height),s=o.data;for(let a=0;a<s.length;a++)s[a]=Wn(s[a]/255)*255;return i.putImageData(o,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Wn(e[i]/255)*255):e[i]=Wn(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Yu=0;class Tc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Yu++}),this.uuid=Ri(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},o=this.data;if(o!==null){let s;if(Array.isArray(o)){s=[];for(let a=0,r=o.length;a<r;a++)o[a].isDataTexture?s.push(_a(o[a].image)):s.push(_a(o[a]))}else s=_a(o);i.url=s}return e||(t.images[this.uuid]=i),i}}function _a(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ju.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let $u=0;const Ma=new N;class ke extends lo{constructor(t=ke.DEFAULT_IMAGE,e=ke.DEFAULT_MAPPING,i=wi,o=wi,s=Cn,a=Ei,r=An,c=Un,l=ke.DEFAULT_ANISOTROPY,h=si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=Ri(),this.name="",this.source=new Tc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=o,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=r,this.internalFormat=null,this.type=c,this.offset=new Dt(0,0),this.repeat=new Dt(1,1),this.center=new Dt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ie,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Ma).x}get height(){return this.source.getSize(Ma).y}get depth(){return this.source.getSize(Ma).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const o=this[e];if(o===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}o&&i&&o.isVector2&&i.isVector2||o&&i&&o.isVector3&&i.isVector3||o&&i&&o.isMatrix3&&i.isMatrix3?o.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Th)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Uo:t.x=t.x-Math.floor(t.x);break;case wi:t.x=t.x<0?0:1;break;case xr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Uo:t.y=t.y-Math.floor(t.y);break;case wi:t.y=t.y<0?0:1;break;case xr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ke.DEFAULT_IMAGE=null;ke.DEFAULT_MAPPING=Th;ke.DEFAULT_ANISOTROPY=1;class Te{constructor(t=0,e=0,i=0,o=1){Te.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=o}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,o){return this.x=t,this.y=e,this.z=i,this.w=o,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,o=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*o+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*o+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*o+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*o+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,o,s;const c=t.elements,l=c[0],h=c[4],d=c[8],u=c[1],f=c[5],g=c[9],M=c[2],m=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-M)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+M)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const x=(l+1)/2,y=(f+1)/2,A=(p+1)/2,P=(h+u)/4,C=(d+M)/4,D=(g+m)/4;return x>y&&x>A?x<.01?(i=0,o=.707106781,s=.707106781):(i=Math.sqrt(x),o=P/i,s=C/i):y>A?y<.01?(i=.707106781,o=0,s=.707106781):(o=Math.sqrt(y),i=P/o,s=D/o):A<.01?(i=.707106781,o=.707106781,s=0):(s=Math.sqrt(A),i=C/s,o=D/s),this.set(i,o,s,e),this}let S=Math.sqrt((m-g)*(m-g)+(d-M)*(d-M)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-M)/S,this.z=(u-h)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this.w=re(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this.w=re(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(re(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Zu extends lo{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Cn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new Te(0,0,t,e),this.scissorTest=!1,this.viewport=new Te(0,0,t,e);const o={width:t,height:e,depth:i.depth},s=new ke(o);this.textures=[];const a=i.count;for(let r=0;r<a;r++)this.textures[r]=s.clone(),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(t={}){const e={minFilter:Cn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let o=0,s=this.textures.length;o<s;o++)this.textures[o].image.width=t,this.textures[o].image.height=e,this.textures[o].image.depth=i,this.textures[o].isArrayTexture=this.textures[o].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const o=Object.assign({},t.textures[e].image);this.textures[e].source=new Tc(o)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pi extends Zu{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Oh extends ke{constructor(t=null,e=1,i=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:o},this.magFilter=$e,this.minFilter=$e,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Ju extends ke{constructor(t=null,e=1,i=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:o},this.magFilter=$e,this.minFilter=$e,this.wrapR=wi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class uo{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(vn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(vn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=vn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,r=s.count;a<r;a++)t.isMesh===!0?t.getVertexPosition(a,vn):vn.fromBufferAttribute(s,a),vn.applyMatrix4(t.matrixWorld),this.expandByPoint(vn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),rs.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),rs.copy(i.boundingBox)),rs.applyMatrix4(t.matrixWorld),this.union(rs)}const o=t.children;for(let s=0,a=o.length;s<a;s++)this.expandByObject(o[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,vn),vn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Mo),cs.subVectors(this.max,Mo),Ui.subVectors(t.a,Mo),Ni.subVectors(t.b,Mo),zi.subVectors(t.c,Mo),Kn.subVectors(Ni,Ui),Qn.subVectors(zi,Ni),fi.subVectors(Ui,zi);let e=[0,-Kn.z,Kn.y,0,-Qn.z,Qn.y,0,-fi.z,fi.y,Kn.z,0,-Kn.x,Qn.z,0,-Qn.x,fi.z,0,-fi.x,-Kn.y,Kn.x,0,-Qn.y,Qn.x,0,-fi.y,fi.x,0];return!xa(e,Ui,Ni,zi,cs)||(e=[1,0,0,0,1,0,0,0,1],!xa(e,Ui,Ni,zi,cs))?!1:(ls.crossVectors(Kn,Qn),e=[ls.x,ls.y,ls.z],xa(e,Ui,Ni,zi,cs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,vn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(vn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const zn=[new N,new N,new N,new N,new N,new N,new N,new N],vn=new N,rs=new uo,Ui=new N,Ni=new N,zi=new N,Kn=new N,Qn=new N,fi=new N,Mo=new N,cs=new N,ls=new N,pi=new N;function xa(n,t,e,i,o){for(let s=0,a=n.length-3;s<=a;s+=3){pi.fromArray(n,s);const r=o.x*Math.abs(pi.x)+o.y*Math.abs(pi.y)+o.z*Math.abs(pi.z),c=t.dot(pi),l=e.dot(pi),h=i.dot(pi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>r)return!1}return!0}const Ku=new uo,xo=new N,ya=new N;class aa{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Ku.setFromPoints(t).getCenter(i);let o=0;for(let s=0,a=t.length;s<a;s++)o=Math.max(o,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(o),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;xo.subVectors(t,this.center);const e=xo.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),o=(i-this.radius)*.5;this.center.addScaledVector(xo,o/i),this.radius+=o}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ya.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(xo.copy(t.center).add(ya)),this.expandByPoint(xo.copy(t.center).sub(ya))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const On=new N,ba=new N,hs=new N,ti=new N,Sa=new N,ds=new N,wa=new N;class Fh{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,On)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=On.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(On.copy(this.origin).addScaledVector(this.direction,e),On.distanceToSquared(t))}distanceSqToSegment(t,e,i,o){ba.copy(t).add(e).multiplyScalar(.5),hs.copy(e).sub(t).normalize(),ti.copy(this.origin).sub(ba);const s=t.distanceTo(e)*.5,a=-this.direction.dot(hs),r=ti.dot(this.direction),c=-ti.dot(hs),l=ti.lengthSq(),h=Math.abs(1-a*a);let d,u,f,g;if(h>0)if(d=a*c-r,u=a*r-c,g=s*h,d>=0)if(u>=-g)if(u<=g){const M=1/h;d*=M,u*=M,f=d*(d+a*u+2*r)+u*(a*d+u+2*c)+l}else u=s,d=Math.max(0,-(a*u+r)),f=-d*d+u*(u+2*c)+l;else u=-s,d=Math.max(0,-(a*u+r)),f=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-a*s+r)),u=d>0?-s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-s,-c),s),f=u*(u+2*c)+l):(d=Math.max(0,-(a*s+r)),u=d>0?s:Math.min(Math.max(-s,-c),s),f=-d*d+u*(u+2*c)+l);else u=a>0?-s:s,d=Math.max(0,-(a*u+r)),f=-d*d+u*(u+2*c)+l;return i&&i.copy(this.origin).addScaledVector(this.direction,d),o&&o.copy(ba).addScaledVector(hs,u),f}intersectSphere(t,e){On.subVectors(t.center,this.origin);const i=On.dot(this.direction),o=On.dot(On)-i*i,s=t.radius*t.radius;if(o>s)return null;const a=Math.sqrt(s-o),r=i-a,c=i+a;return c<0?null:r<0?this.at(c,e):this.at(r,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,o,s,a,r,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(i=(t.min.x-u.x)*l,o=(t.max.x-u.x)*l):(i=(t.max.x-u.x)*l,o=(t.min.x-u.x)*l),h>=0?(s=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||s>o||((s>i||isNaN(i))&&(i=s),(a<o||isNaN(o))&&(o=a),d>=0?(r=(t.min.z-u.z)*d,c=(t.max.z-u.z)*d):(r=(t.max.z-u.z)*d,c=(t.min.z-u.z)*d),i>c||r>o)||((r>i||i!==i)&&(i=r),(c<o||o!==o)&&(o=c),o<0)?null:this.at(i>=0?i:o,e)}intersectsBox(t){return this.intersectBox(t,On)!==null}intersectTriangle(t,e,i,o,s){Sa.subVectors(e,t),ds.subVectors(i,t),wa.crossVectors(Sa,ds);let a=this.direction.dot(wa),r;if(a>0){if(o)return null;r=1}else if(a<0)r=-1,a=-a;else return null;ti.subVectors(this.origin,t);const c=r*this.direction.dot(ds.crossVectors(ti,ds));if(c<0)return null;const l=r*this.direction.dot(Sa.cross(ti));if(l<0||c+l>a)return null;const h=-r*ti.dot(wa);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ee{constructor(t,e,i,o,s,a,r,c,l,h,d,u,f,g,M,m){Ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,o,s,a,r,c,l,h,d,u,f,g,M,m)}set(t,e,i,o,s,a,r,c,l,h,d,u,f,g,M,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=i,p[12]=o,p[1]=s,p[5]=a,p[9]=r,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=f,p[7]=g,p[11]=M,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ee().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,o=1/Oi.setFromMatrixColumn(t,0).length(),s=1/Oi.setFromMatrixColumn(t,1).length(),a=1/Oi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*o,e[1]=i[1]*o,e[2]=i[2]*o,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,o=t.y,s=t.z,a=Math.cos(i),r=Math.sin(i),c=Math.cos(o),l=Math.sin(o),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){const u=a*h,f=a*d,g=r*h,M=r*d;e[0]=c*h,e[4]=-c*d,e[8]=l,e[1]=f+g*l,e[5]=u-M*l,e[9]=-r*c,e[2]=M-u*l,e[6]=g+f*l,e[10]=a*c}else if(t.order==="YXZ"){const u=c*h,f=c*d,g=l*h,M=l*d;e[0]=u+M*r,e[4]=g*r-f,e[8]=a*l,e[1]=a*d,e[5]=a*h,e[9]=-r,e[2]=f*r-g,e[6]=M+u*r,e[10]=a*c}else if(t.order==="ZXY"){const u=c*h,f=c*d,g=l*h,M=l*d;e[0]=u-M*r,e[4]=-a*d,e[8]=g+f*r,e[1]=f+g*r,e[5]=a*h,e[9]=M-u*r,e[2]=-a*l,e[6]=r,e[10]=a*c}else if(t.order==="ZYX"){const u=a*h,f=a*d,g=r*h,M=r*d;e[0]=c*h,e[4]=g*l-f,e[8]=u*l+M,e[1]=c*d,e[5]=M*l+u,e[9]=f*l-g,e[2]=-l,e[6]=r*c,e[10]=a*c}else if(t.order==="YZX"){const u=a*c,f=a*l,g=r*c,M=r*l;e[0]=c*h,e[4]=M-u*d,e[8]=g*d+f,e[1]=d,e[5]=a*h,e[9]=-r*h,e[2]=-l*h,e[6]=f*d+g,e[10]=u-M*d}else if(t.order==="XZY"){const u=a*c,f=a*l,g=r*c,M=r*l;e[0]=c*h,e[4]=-d,e[8]=l*h,e[1]=u*d+M,e[5]=a*h,e[9]=f*d-g,e[2]=g*d-f,e[6]=r*h,e[10]=M*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Qu,t,tf)}lookAt(t,e,i){const o=this.elements;return en.subVectors(t,e),en.lengthSq()===0&&(en.z=1),en.normalize(),ei.crossVectors(i,en),ei.lengthSq()===0&&(Math.abs(i.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),ei.crossVectors(i,en)),ei.normalize(),us.crossVectors(en,ei),o[0]=ei.x,o[4]=us.x,o[8]=en.x,o[1]=ei.y,o[5]=us.y,o[9]=en.y,o[2]=ei.z,o[6]=us.z,o[10]=en.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,o=e.elements,s=this.elements,a=i[0],r=i[4],c=i[8],l=i[12],h=i[1],d=i[5],u=i[9],f=i[13],g=i[2],M=i[6],m=i[10],p=i[14],S=i[3],x=i[7],y=i[11],A=i[15],P=o[0],C=o[4],D=o[8],E=o[12],b=o[1],L=o[5],z=o[9],B=o[13],H=o[2],W=o[6],q=o[10],tt=o[14],Y=o[3],st=o[7],j=o[11],mt=o[15];return s[0]=a*P+r*b+c*H+l*Y,s[4]=a*C+r*L+c*W+l*st,s[8]=a*D+r*z+c*q+l*j,s[12]=a*E+r*B+c*tt+l*mt,s[1]=h*P+d*b+u*H+f*Y,s[5]=h*C+d*L+u*W+f*st,s[9]=h*D+d*z+u*q+f*j,s[13]=h*E+d*B+u*tt+f*mt,s[2]=g*P+M*b+m*H+p*Y,s[6]=g*C+M*L+m*W+p*st,s[10]=g*D+M*z+m*q+p*j,s[14]=g*E+M*B+m*tt+p*mt,s[3]=S*P+x*b+y*H+A*Y,s[7]=S*C+x*L+y*W+A*st,s[11]=S*D+x*z+y*q+A*j,s[15]=S*E+x*B+y*tt+A*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],o=t[8],s=t[12],a=t[1],r=t[5],c=t[9],l=t[13],h=t[2],d=t[6],u=t[10],f=t[14],g=t[3],M=t[7],m=t[11],p=t[15];return g*(+s*c*d-o*l*d-s*r*u+i*l*u+o*r*f-i*c*f)+M*(+e*c*f-e*l*u+s*a*u-o*a*f+o*l*h-s*c*h)+m*(+e*l*d-e*r*f-s*a*d+i*a*f+s*r*h-i*l*h)+p*(-o*r*h-e*c*d+e*r*u+o*a*d-i*a*u+i*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const o=this.elements;return t.isVector3?(o[12]=t.x,o[13]=t.y,o[14]=t.z):(o[12]=t,o[13]=e,o[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],o=t[2],s=t[3],a=t[4],r=t[5],c=t[6],l=t[7],h=t[8],d=t[9],u=t[10],f=t[11],g=t[12],M=t[13],m=t[14],p=t[15],S=d*m*l-M*u*l+M*c*f-r*m*f-d*c*p+r*u*p,x=g*u*l-h*m*l-g*c*f+a*m*f+h*c*p-a*u*p,y=h*M*l-g*d*l+g*r*f-a*M*f-h*r*p+a*d*p,A=g*d*c-h*M*c-g*r*u+a*M*u+h*r*m-a*d*m,P=e*S+i*x+o*y+s*A;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/P;return t[0]=S*C,t[1]=(M*u*s-d*m*s-M*o*f+i*m*f+d*o*p-i*u*p)*C,t[2]=(r*m*s-M*c*s+M*o*l-i*m*l-r*o*p+i*c*p)*C,t[3]=(d*c*s-r*u*s-d*o*l+i*u*l+r*o*f-i*c*f)*C,t[4]=x*C,t[5]=(h*m*s-g*u*s+g*o*f-e*m*f-h*o*p+e*u*p)*C,t[6]=(g*c*s-a*m*s-g*o*l+e*m*l+a*o*p-e*c*p)*C,t[7]=(a*u*s-h*c*s+h*o*l-e*u*l-a*o*f+e*c*f)*C,t[8]=y*C,t[9]=(g*d*s-h*M*s-g*i*f+e*M*f+h*i*p-e*d*p)*C,t[10]=(a*M*s-g*r*s+g*i*l-e*M*l-a*i*p+e*r*p)*C,t[11]=(h*r*s-a*d*s-h*i*l+e*d*l+a*i*f-e*r*f)*C,t[12]=A*C,t[13]=(h*M*o-g*d*o+g*i*u-e*M*u-h*i*m+e*d*m)*C,t[14]=(g*r*o-a*M*o-g*i*c+e*M*c+a*i*m-e*r*m)*C,t[15]=(a*d*o-h*r*o+h*i*c-e*d*c-a*i*u+e*r*u)*C,this}scale(t){const e=this.elements,i=t.x,o=t.y,s=t.z;return e[0]*=i,e[4]*=o,e[8]*=s,e[1]*=i,e[5]*=o,e[9]*=s,e[2]*=i,e[6]*=o,e[10]*=s,e[3]*=i,e[7]*=o,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],o=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,o))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),o=Math.sin(e),s=1-i,a=t.x,r=t.y,c=t.z,l=s*a,h=s*r;return this.set(l*a+i,l*r-o*c,l*c+o*r,0,l*r+o*c,h*r+i,h*c-o*a,0,l*c-o*r,h*c+o*a,s*c*c+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,o,s,a){return this.set(1,i,s,0,t,1,a,0,e,o,1,0,0,0,0,1),this}compose(t,e,i){const o=this.elements,s=e._x,a=e._y,r=e._z,c=e._w,l=s+s,h=a+a,d=r+r,u=s*l,f=s*h,g=s*d,M=a*h,m=a*d,p=r*d,S=c*l,x=c*h,y=c*d,A=i.x,P=i.y,C=i.z;return o[0]=(1-(M+p))*A,o[1]=(f+y)*A,o[2]=(g-x)*A,o[3]=0,o[4]=(f-y)*P,o[5]=(1-(u+p))*P,o[6]=(m+S)*P,o[7]=0,o[8]=(g+x)*C,o[9]=(m-S)*C,o[10]=(1-(u+M))*C,o[11]=0,o[12]=t.x,o[13]=t.y,o[14]=t.z,o[15]=1,this}decompose(t,e,i){const o=this.elements;let s=Oi.set(o[0],o[1],o[2]).length();const a=Oi.set(o[4],o[5],o[6]).length(),r=Oi.set(o[8],o[9],o[10]).length();this.determinant()<0&&(s=-s),t.x=o[12],t.y=o[13],t.z=o[14],_n.copy(this);const l=1/s,h=1/a,d=1/r;return _n.elements[0]*=l,_n.elements[1]*=l,_n.elements[2]*=l,_n.elements[4]*=h,_n.elements[5]*=h,_n.elements[6]*=h,_n.elements[8]*=d,_n.elements[9]*=d,_n.elements[10]*=d,e.setFromRotationMatrix(_n),i.x=s,i.y=a,i.z=r,this}makePerspective(t,e,i,o,s,a,r=Rn,c=!1){const l=this.elements,h=2*s/(e-t),d=2*s/(i-o),u=(e+t)/(e-t),f=(i+o)/(i-o);let g,M;if(c)g=s/(a-s),M=a*s/(a-s);else if(r===Rn)g=-(a+s)/(a-s),M=-2*a*s/(a-s);else if(r===Zs)g=-a/(a-s),M=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,o,s,a,r=Rn,c=!1){const l=this.elements,h=2/(e-t),d=2/(i-o),u=-(e+t)/(e-t),f=-(i+o)/(i-o);let g,M;if(c)g=1/(a-s),M=a/(a-s);else if(r===Rn)g=-2/(a-s),M=-(a+s)/(a-s);else if(r===Zs)g=-1/(a-s),M=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+r);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=d,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=M,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let o=0;o<16;o++)if(e[o]!==i[o])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const Oi=new N,_n=new Ee,Qu=new N(0,0,0),tf=new N(1,1,1),ei=new N,us=new N,en=new N,Jc=new Ee,Kc=new ho;class Yn{constructor(t=0,e=0,i=0,o=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=o}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,o=this._order){return this._x=t,this._y=e,this._z=i,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const o=t.elements,s=o[0],a=o[4],r=o[8],c=o[1],l=o[5],h=o[9],d=o[2],u=o[6],f=o[10];switch(e){case"XYZ":this._y=Math.asin(re(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(r,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(re(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-re(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(re(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(r,f));break;case"XZY":this._z=Math.asin(-re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(r,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Jc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jc,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Kc.setFromEuler(this),this.setFromQuaternion(Kc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class Bh{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ef=0;const Qc=new N,Fi=new ho,Fn=new Ee,fs=new N,yo=new N,nf=new N,of=new ho,tl=new N(1,0,0),el=new N(0,1,0),nl=new N(0,0,1),il={type:"added"},sf={type:"removed"},Bi={type:"childadded",child:null},Ea={type:"childremoved",child:null};class ve extends lo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ef++}),this.uuid=Ri(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ve.DEFAULT_UP.clone();const t=new N,e=new Yn,i=new ho,o=new N(1,1,1);function s(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Ee},normalMatrix:{value:new ie}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Bh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.multiply(Fi),this}rotateOnWorldAxis(t,e){return Fi.setFromAxisAngle(t,e),this.quaternion.premultiply(Fi),this}rotateX(t){return this.rotateOnAxis(tl,t)}rotateY(t){return this.rotateOnAxis(el,t)}rotateZ(t){return this.rotateOnAxis(nl,t)}translateOnAxis(t,e){return Qc.copy(t).applyQuaternion(this.quaternion),this.position.add(Qc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(tl,t)}translateY(t){return this.translateOnAxis(el,t)}translateZ(t){return this.translateOnAxis(nl,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?fs.copy(t):fs.set(t,e,i);const o=this.parent;this.updateWorldMatrix(!0,!1),yo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fn.lookAt(yo,fs,this.up):Fn.lookAt(fs,yo,this.up),this.quaternion.setFromRotationMatrix(Fn),o&&(Fn.extractRotation(o.matrixWorld),Fi.setFromRotationMatrix(Fn),this.quaternion.premultiply(Fi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(il),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(sf),Ea.child=t,this.dispatchEvent(Ea),Ea.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(il),Bi.child=t,this.dispatchEvent(Bi),Bi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,o=this.children.length;i<o;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const o=this.children;for(let s=0,a=o.length;s<a;s++)o[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yo,t,nf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(yo,of,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,o=e.length;i<o;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const o=this.children;for(let s=0,a=o.length;s<a;s++)o[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.geometryInfo=this._geometryInfo.map(r=>({...r,boundingBox:r.boundingBox?r.boundingBox.toJSON():void 0,boundingSphere:r.boundingSphere?r.boundingSphere.toJSON():void 0})),o.instanceInfo=this._instanceInfo.map(r=>({...r})),o.availableInstanceIds=this._availableInstanceIds.slice(),o.availableGeometryIds=this._availableGeometryIds.slice(),o.nextIndexStart=this._nextIndexStart,o.nextVertexStart=this._nextVertexStart,o.geometryCount=this._geometryCount,o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.matricesTexture=this._matricesTexture.toJSON(t),o.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(o.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(o.boundingBox=this.boundingBox.toJSON()));function s(r,c){return r[c.uuid]===void 0&&(r[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=s(t.geometries,this.geometry);const r=this.geometry.parameters;if(r!==void 0&&r.shapes!==void 0){const c=r.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];s(t.shapes,d)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const r=[];for(let c=0,l=this.material.length;c<l;c++)r.push(s(t.materials,this.material[c]));o.material=r}else o.material=s(t.materials,this.material);if(this.children.length>0){o.children=[];for(let r=0;r<this.children.length;r++)o.children.push(this.children[r].toJSON(t).object)}if(this.animations.length>0){o.animations=[];for(let r=0;r<this.animations.length;r++){const c=this.animations[r];o.animations.push(s(t.animations,c))}}if(e){const r=a(t.geometries),c=a(t.materials),l=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),g=a(t.nodes);r.length>0&&(i.geometries=r),c.length>0&&(i.materials=c),l.length>0&&(i.textures=l),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=o,i;function a(r){const c=[];for(const l in r){const h=r[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const o=t.children[i];this.add(o.clone())}return this}}ve.DEFAULT_UP=new N(0,1,0);ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Mn=new N,Bn=new N,Ta=new N,kn=new N,ki=new N,Vi=new N,ol=new N,Aa=new N,Pa=new N,Ca=new N,Ra=new Te,Ia=new Te,Da=new Te;class En{constructor(t=new N,e=new N,i=new N){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,o){o.subVectors(i,e),Mn.subVectors(t,e),o.cross(Mn);const s=o.lengthSq();return s>0?o.multiplyScalar(1/Math.sqrt(s)):o.set(0,0,0)}static getBarycoord(t,e,i,o,s){Mn.subVectors(o,e),Bn.subVectors(i,e),Ta.subVectors(t,e);const a=Mn.dot(Mn),r=Mn.dot(Bn),c=Mn.dot(Ta),l=Bn.dot(Bn),h=Bn.dot(Ta),d=a*l-r*r;if(d===0)return s.set(0,0,0),null;const u=1/d,f=(l*c-r*h)*u,g=(a*h-r*c)*u;return s.set(1-f-g,g,f)}static containsPoint(t,e,i,o){return this.getBarycoord(t,e,i,o,kn)===null?!1:kn.x>=0&&kn.y>=0&&kn.x+kn.y<=1}static getInterpolation(t,e,i,o,s,a,r,c){return this.getBarycoord(t,e,i,o,kn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,kn.x),c.addScaledVector(a,kn.y),c.addScaledVector(r,kn.z),c)}static getInterpolatedAttribute(t,e,i,o,s,a){return Ra.setScalar(0),Ia.setScalar(0),Da.setScalar(0),Ra.fromBufferAttribute(t,e),Ia.fromBufferAttribute(t,i),Da.fromBufferAttribute(t,o),a.setScalar(0),a.addScaledVector(Ra,s.x),a.addScaledVector(Ia,s.y),a.addScaledVector(Da,s.z),a}static isFrontFacing(t,e,i,o){return Mn.subVectors(i,e),Bn.subVectors(t,e),Mn.cross(Bn).dot(o)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,o){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[o]),this}setFromAttributeAndIndices(t,e,i,o){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,o),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Mn.subVectors(this.c,this.b),Bn.subVectors(this.a,this.b),Mn.cross(Bn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return En.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return En.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,o,s){return En.getInterpolation(t,this.a,this.b,this.c,e,i,o,s)}containsPoint(t){return En.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return En.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,o=this.b,s=this.c;let a,r;ki.subVectors(o,i),Vi.subVectors(s,i),Aa.subVectors(t,i);const c=ki.dot(Aa),l=Vi.dot(Aa);if(c<=0&&l<=0)return e.copy(i);Pa.subVectors(t,o);const h=ki.dot(Pa),d=Vi.dot(Pa);if(h>=0&&d<=h)return e.copy(o);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),e.copy(i).addScaledVector(ki,a);Ca.subVectors(t,s);const f=ki.dot(Ca),g=Vi.dot(Ca);if(g>=0&&f<=g)return e.copy(s);const M=f*l-c*g;if(M<=0&&l>=0&&g<=0)return r=l/(l-g),e.copy(i).addScaledVector(Vi,r);const m=h*g-f*d;if(m<=0&&d-h>=0&&f-g>=0)return ol.subVectors(s,o),r=(d-h)/(d-h+(f-g)),e.copy(o).addScaledVector(ol,r);const p=1/(m+M+u);return a=M*p,r=u*p,e.copy(i).addScaledVector(ki,a).addScaledVector(Vi,r)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const kh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ni={h:0,s:0,l:0},ps={h:0,s:0,l:0};function La(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class le{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const o=t;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,me.colorSpaceToWorking(this,e),this}setRGB(t,e,i,o=me.workingColorSpace){return this.r=t,this.g=e,this.b=i,me.colorSpaceToWorking(this,o),this}setHSL(t,e,i,o=me.workingColorSpace){if(t=Ec(t,1),e=re(e,0,1),i=re(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,a=2*i-s;this.r=La(a,s,t+1/3),this.g=La(a,s,t),this.b=La(a,s,t-1/3)}return me.colorSpaceToWorking(this,o),this}setStyle(t,e=Ke){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=o[1],r=o[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(r))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=o[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ke){const i=kh[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Wn(t.r),this.g=Wn(t.g),this.b=Wn(t.b),this}copyLinearToSRGB(t){return this.r=eo(t.r),this.g=eo(t.g),this.b=eo(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ke){return me.workingToColorSpace(Fe.copy(this),t),Math.round(re(Fe.r*255,0,255))*65536+Math.round(re(Fe.g*255,0,255))*256+Math.round(re(Fe.b*255,0,255))}getHexString(t=Ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=me.workingColorSpace){me.workingToColorSpace(Fe.copy(this),e);const i=Fe.r,o=Fe.g,s=Fe.b,a=Math.max(i,o,s),r=Math.min(i,o,s);let c,l;const h=(r+a)/2;if(r===a)c=0,l=0;else{const d=a-r;switch(l=h<=.5?d/(a+r):d/(2-a-r),a){case i:c=(o-s)/d+(o<s?6:0);break;case o:c=(s-i)/d+2;break;case s:c=(i-o)/d+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=me.workingColorSpace){return me.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=Ke){me.workingToColorSpace(Fe.copy(this),t);const e=Fe.r,i=Fe.g,o=Fe.b;return t!==Ke?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(o*255)})`}offsetHSL(t,e,i){return this.getHSL(ni),this.setHSL(ni.h+t,ni.s+e,ni.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(ni),t.getHSL(ps);const i=Ro(ni.h,ps.h,e),o=Ro(ni.s,ps.s,e),s=Ro(ni.l,ps.l,e);return this.setHSL(i,o,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,o=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*o,this.g=s[1]*e+s[4]*i+s[7]*o,this.b=s[2]*e+s[5]*i+s[8]*o,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new le;le.NAMES=kh;let af=0;class fo extends lo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:af++}),this.uuid=Ri(),this.name="",this.type="Material",this.blending=to,this.side=jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=lr,this.blendDst=hr,this.blendEquation=bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new le(0,0,0),this.blendAlpha=0,this.depthFunc=no,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gc,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Di,this.stencilZFail=Di,this.stencilZPass=Di,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const o=this[e];if(o===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(i):o&&o.isVector3&&i&&i.isVector3?o.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==to&&(i.blending=this.blending),this.side!==jn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==lr&&(i.blendSrc=this.blendSrc),this.blendDst!==hr&&(i.blendDst=this.blendDst),this.blendEquation!==bi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==no&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gc&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Di&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Di&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Di&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function o(s){const a=[];for(const r in s){const c=s[r];delete c.metadata,a.push(c)}return a}if(e){const s=o(t.textures),a=o(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const o=e.length;i=new Array(o);for(let s=0;s!==o;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class ra extends fo{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new le(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=Eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new N,ms=new Dt;let rf=0;class Ln{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rf++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=qc,this.updateRanges=[],this.gpuType=Gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let o=0,s=this.itemSize;o<s;o++)this.array[t+o]=e.array[i+o];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)ms.fromBufferAttribute(this,e),ms.applyMatrix3(t),this.setXY(e,ms.x,ms.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Zi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=We(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Zi(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Zi(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Zi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Zi(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),i=We(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,o){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),i=We(i,this.array),o=We(o,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=o,this}setXYZW(t,e,i,o,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),i=We(i,this.array),o=We(o,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=o,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==qc&&(t.usage=this.usage),t}}class Vh extends Ln{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class Hh extends Ln{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class he extends Ln{constructor(t,e,i){super(new Float32Array(t),e,i)}}let cf=0;const hn=new Ee,Ua=new ve,Hi=new N,nn=new uo,bo=new uo,De=new N;class Le extends lo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:cf++}),this.uuid=Ri(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(zh(t)?Hh:Vh)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ie().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(t),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return hn.makeRotationFromQuaternion(t),this.applyMatrix4(hn),this}rotateX(t){return hn.makeRotationX(t),this.applyMatrix4(hn),this}rotateY(t){return hn.makeRotationY(t),this.applyMatrix4(hn),this}rotateZ(t){return hn.makeRotationZ(t),this.applyMatrix4(hn),this}translate(t,e,i){return hn.makeTranslation(t,e,i),this.applyMatrix4(hn),this}scale(t,e,i){return hn.makeScale(t,e,i),this.applyMatrix4(hn),this}lookAt(t){return Ua.lookAt(t),Ua.updateMatrix(),this.applyMatrix4(Ua.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Hi).negate(),this.translate(Hi.x,Hi.y,Hi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let o=0,s=t.length;o<s;o++){const a=t[o];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new he(i,3))}else{const i=Math.min(t.length,e.count);for(let o=0;o<i;o++){const s=t[o];e.setXYZ(o,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new uo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,o=e.length;i<o;i++){const s=e[i];nn.setFromBufferAttribute(s),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new aa);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const i=this.boundingSphere.center;if(nn.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const r=e[s];bo.setFromBufferAttribute(r),this.morphTargetsRelative?(De.addVectors(nn.min,bo.min),nn.expandByPoint(De),De.addVectors(nn.max,bo.max),nn.expandByPoint(De)):(nn.expandByPoint(bo.min),nn.expandByPoint(bo.max))}nn.getCenter(i);let o=0;for(let s=0,a=t.count;s<a;s++)De.fromBufferAttribute(t,s),o=Math.max(o,i.distanceToSquared(De));if(e)for(let s=0,a=e.length;s<a;s++){const r=e[s],c=this.morphTargetsRelative;for(let l=0,h=r.count;l<h;l++)De.fromBufferAttribute(r,l),c&&(Hi.fromBufferAttribute(t,l),De.add(Hi)),o=Math.max(o,i.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,o=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ln(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),r=[],c=[];for(let D=0;D<i.count;D++)r[D]=new N,c[D]=new N;const l=new N,h=new N,d=new N,u=new Dt,f=new Dt,g=new Dt,M=new N,m=new N;function p(D,E,b){l.fromBufferAttribute(i,D),h.fromBufferAttribute(i,E),d.fromBufferAttribute(i,b),u.fromBufferAttribute(s,D),f.fromBufferAttribute(s,E),g.fromBufferAttribute(s,b),h.sub(l),d.sub(l),f.sub(u),g.sub(u);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(L),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),r[D].add(M),r[E].add(M),r[b].add(M),c[D].add(m),c[E].add(m),c[b].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let D=0,E=S.length;D<E;++D){const b=S[D],L=b.start,z=b.count;for(let B=L,H=L+z;B<H;B+=3)p(t.getX(B+0),t.getX(B+1),t.getX(B+2))}const x=new N,y=new N,A=new N,P=new N;function C(D){A.fromBufferAttribute(o,D),P.copy(A);const E=r[D];x.copy(E),x.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(P,E);const L=y.dot(c[D])<0?-1:1;a.setXYZW(D,x.x,x.y,x.z,L)}for(let D=0,E=S.length;D<E;++D){const b=S[D],L=b.start,z=b.count;for(let B=L,H=L+z;B<H;B+=3)C(t.getX(B+0)),C(t.getX(B+1)),C(t.getX(B+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Ln(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const o=new N,s=new N,a=new N,r=new N,c=new N,l=new N,h=new N,d=new N;if(t)for(let u=0,f=t.count;u<f;u+=3){const g=t.getX(u+0),M=t.getX(u+1),m=t.getX(u+2);o.fromBufferAttribute(e,g),s.fromBufferAttribute(e,M),a.fromBufferAttribute(e,m),h.subVectors(a,s),d.subVectors(o,s),h.cross(d),r.fromBufferAttribute(i,g),c.fromBufferAttribute(i,M),l.fromBufferAttribute(i,m),r.add(h),c.add(h),l.add(h),i.setXYZ(g,r.x,r.y,r.z),i.setXYZ(M,c.x,c.y,c.z),i.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,f=e.count;u<f;u+=3)o.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,s),d.subVectors(o,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(r,c){const l=r.array,h=r.itemSize,d=r.normalized,u=new l.constructor(c.length*h);let f=0,g=0;for(let M=0,m=c.length;M<m;M++){r.isInterleavedBufferAttribute?f=c[M]*r.data.stride+r.offset:f=c[M]*h;for(let p=0;p<h;p++)u[g++]=l[f++]}return new Ln(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Le,i=this.index.array,o=this.attributes;for(const r in o){const c=o[r],l=t(c,i);e.setAttribute(r,l)}const s=this.morphAttributes;for(const r in s){const c=[],l=s[r];for(let h=0,d=l.length;h<d;h++){const u=l[h],f=t(u,i);c.push(f)}e.morphAttributes[r]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let r=0,c=a.length;r<c;r++){const l=a[r];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const c in i){const l=i[c];t.data.attributes[c]=l.toJSON(t.data)}const o={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const f=l[d];h.push(f.toJSON(t.data))}h.length>0&&(o[c]=h,s=!0)}s&&(t.data.morphAttributes=o,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const r=this.boundingSphere;return r!==null&&(t.data.boundingSphere=r.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const o=t.attributes;for(const l in o){const h=o[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],d=s[l];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,h=a.length;l<h;l++){const d=a[l];this.addGroup(d.start,d.count,d.materialIndex)}const r=t.boundingBox;r!==null&&(this.boundingBox=r.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const sl=new Ee,mi=new Fh,gs=new aa,al=new N,vs=new N,_s=new N,Ms=new N,Na=new N,xs=new N,rl=new N,ys=new N;class v extends ve{constructor(t=new Le,e=new ra){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const o=e[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=o.length;s<a;s++){const r=o[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}getVertexPosition(t,e){const i=this.geometry,o=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(o,t);const r=this.morphTargetInfluences;if(s&&r){xs.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=r[c],d=s[c];h!==0&&(Na.fromBufferAttribute(d,t),a?xs.addScaledVector(Na,h):xs.addScaledVector(Na.sub(e),h))}e.add(xs)}return e}raycast(t,e){const i=this.geometry,o=this.material,s=this.matrixWorld;o!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),gs.copy(i.boundingSphere),gs.applyMatrix4(s),mi.copy(t.ray).recast(t.near),!(gs.containsPoint(mi.origin)===!1&&(mi.intersectSphere(gs,al)===null||mi.origin.distanceToSquared(al)>(t.far-t.near)**2))&&(sl.copy(s).invert(),mi.copy(t.ray).applyMatrix4(sl),!(i.boundingBox!==null&&mi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,mi)))}_computeIntersections(t,e,i){let o;const s=this.geometry,a=this.material,r=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,f=s.drawRange;if(r!==null)if(Array.isArray(a))for(let g=0,M=u.length;g<M;g++){const m=u[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(r.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,A=x;y<A;y+=3){const P=r.getX(y),C=r.getX(y+1),D=r.getX(y+2);o=bs(this,p,t,i,l,h,d,P,C,D),o&&(o.faceIndex=Math.floor(y/3),o.face.materialIndex=m.materialIndex,e.push(o))}}else{const g=Math.max(0,f.start),M=Math.min(r.count,f.start+f.count);for(let m=g,p=M;m<p;m+=3){const S=r.getX(m),x=r.getX(m+1),y=r.getX(m+2);o=bs(this,a,t,i,l,h,d,S,x,y),o&&(o.faceIndex=Math.floor(m/3),e.push(o))}}else if(c!==void 0)if(Array.isArray(a))for(let g=0,M=u.length;g<M;g++){const m=u[g],p=a[m.materialIndex],S=Math.max(m.start,f.start),x=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,A=x;y<A;y+=3){const P=y,C=y+1,D=y+2;o=bs(this,p,t,i,l,h,d,P,C,D),o&&(o.faceIndex=Math.floor(y/3),o.face.materialIndex=m.materialIndex,e.push(o))}}else{const g=Math.max(0,f.start),M=Math.min(c.count,f.start+f.count);for(let m=g,p=M;m<p;m+=3){const S=m,x=m+1,y=m+2;o=bs(this,a,t,i,l,h,d,S,x,y),o&&(o.faceIndex=Math.floor(m/3),e.push(o))}}}}function lf(n,t,e,i,o,s,a,r){let c;if(t.side===Qe?c=i.intersectTriangle(a,s,o,!0,r):c=i.intersectTriangle(o,s,a,t.side===jn,r),c===null)return null;ys.copy(r),ys.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(ys);return l<e.near||l>e.far?null:{distance:l,point:ys.clone(),object:n}}function bs(n,t,e,i,o,s,a,r,c,l){n.getVertexPosition(r,vs),n.getVertexPosition(c,_s),n.getVertexPosition(l,Ms);const h=lf(n,t,e,i,vs,_s,Ms,rl);if(h){const d=new N;En.getBarycoord(rl,vs,_s,Ms,d),o&&(h.uv=En.getInterpolatedAttribute(o,r,c,l,d,new Dt)),s&&(h.uv1=En.getInterpolatedAttribute(s,r,c,l,d,new Dt)),a&&(h.normal=En.getInterpolatedAttribute(a,r,c,l,d,new N),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:r,b:c,c:l,normal:new N,materialIndex:0};En.getNormal(vs,_s,Ms,u.normal),h.face=u,h.barycoord=d}return h}class O extends Le{constructor(t=1,e=1,i=1,o=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:o,heightSegments:s,depthSegments:a};const r=this;o=Math.floor(o),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],h=[],d=[];let u=0,f=0;g("z","y","x",-1,-1,i,e,t,a,s,0),g("z","y","x",1,-1,i,e,-t,a,s,1),g("x","z","y",1,1,t,i,e,o,a,2),g("x","z","y",1,-1,t,i,-e,o,a,3),g("x","y","z",1,-1,t,e,i,o,s,4),g("x","y","z",-1,-1,t,e,-i,o,s,5),this.setIndex(c),this.setAttribute("position",new he(l,3)),this.setAttribute("normal",new he(h,3)),this.setAttribute("uv",new he(d,2));function g(M,m,p,S,x,y,A,P,C,D,E){const b=y/C,L=A/D,z=y/2,B=A/2,H=P/2,W=C+1,q=D+1;let tt=0,Y=0;const st=new N;for(let j=0;j<q;j++){const mt=j*L-B;for(let vt=0;vt<W;vt++){const At=vt*b-z;st[M]=At*S,st[m]=mt*x,st[p]=H,l.push(st.x,st.y,st.z),st[M]=0,st[m]=0,st[p]=P>0?1:-1,h.push(st.x,st.y,st.z),d.push(vt/C),d.push(1-j/D),tt+=1}}for(let j=0;j<D;j++)for(let mt=0;mt<C;mt++){const vt=u+mt+W*j,At=u+mt+W*(j+1),V=u+(mt+1)+W*(j+1),ft=u+(mt+1)+W*j;c.push(vt,At,ft),c.push(At,V,ft),Y+=6}r.addGroup(f,Y,E),f+=Y,u+=tt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new O(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ao(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const o=n[e][i];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=o.clone():Array.isArray(o)?t[e][i]=o.slice():t[e][i]=o}}return t}function je(n){const t={};for(let e=0;e<n.length;e++){const i=ao(n[e]);for(const o in i)t[o]=i[o]}return t}function hf(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function Gh(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:me.workingColorSpace}const df={clone:ao,merge:je};var uf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ff=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class li extends fo{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=uf,this.fragmentShader=ff,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ao(t.uniforms),this.uniformsGroups=hf(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const o in this.uniforms){const a=this.uniforms[o].value;a&&a.isTexture?e.uniforms[o]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[o]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[o]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[o]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[o]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[o]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[o]={type:"m4",value:a.toArray()}:e.uniforms[o]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const o in this.extensions)this.extensions[o]===!0&&(i[o]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class qh extends ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=Rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ii=new N,cl=new Dt,ll=new Dt;class sn extends qh{constructor(t=50,e=1,i=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=o,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Bo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Co*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Bo*2*Math.atan(Math.tan(Co*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ii.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ii.x,ii.y).multiplyScalar(-t/ii.z),ii.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ii.x,ii.y).multiplyScalar(-t/ii.z)}getViewSize(t,e){return this.getViewBounds(t,cl,ll),e.subVectors(ll,cl)}setViewOffset(t,e,i,o,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=o,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Co*.5*this.fov)/this.zoom,i=2*e,o=this.aspect*i,s=-.5*o;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*o/c,e-=a.offsetY*i/l,o*=a.width/c,i*=a.height/l}const r=this.filmOffset;r!==0&&(s+=t*r/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+o,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Gi=-90,qi=1;class pf extends ve{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new sn(Gi,qi,t,e);o.layers=this.layers,this.add(o);const s=new sn(Gi,qi,t,e);s.layers=this.layers,this.add(s);const a=new sn(Gi,qi,t,e);a.layers=this.layers,this.add(a);const r=new sn(Gi,qi,t,e);r.layers=this.layers,this.add(r);const c=new sn(Gi,qi,t,e);c.layers=this.layers,this.add(c);const l=new sn(Gi,qi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,o,s,a,r,c]=e;for(const l of e)this.remove(l);if(t===Rn)i.up.set(0,1,0),i.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),r.up.set(0,1,0),r.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Zs)i.up.set(0,-1,0),i.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),r.up.set(0,-1,0),r.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:o}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,r,c,l,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const M=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,o),t.render(e,s),t.setRenderTarget(i,1,o),t.render(e,a),t.setRenderTarget(i,2,o),t.render(e,r),t.setRenderTarget(i,3,o),t.render(e,c),t.setRenderTarget(i,4,o),t.render(e,l),i.texture.generateMipmaps=M,t.setRenderTarget(i,5,o),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class Wh extends ke{constructor(t=[],e=io,i,o,s,a,r,c,l,h){super(t,e,i,o,s,a,r,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class mf extends Pi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},o=[i,i,i,i,i,i];this.texture=new Wh(o),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new O(5,5,5),s=new li({name:"CubemapFromEquirect",uniforms:ao(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Qe,blending:ri});s.uniforms.tEquirect.value=e;const a=new v(o,s),r=e.minFilter;return e.minFilter===Ei&&(e.minFilter=Cn),new pf(1,10,this).update(t,a),e.minFilter=r,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,o=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,o);t.setRenderTarget(s)}}class ct extends ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gf={type:"move"};class za{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ct,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ct,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ct,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let o=null,s=null,a=null;const r=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const M of t.hand.values()){const m=e.getJointPose(M,i),p=this._getHandJoint(l,M);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,g=.005;l.inputState.pinching&&u>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));r!==null&&(o=e.getPose(t.targetRaySpace,i),o===null&&s!==null&&(o=s),o!==null&&(r.matrix.fromArray(o.transform.matrix),r.matrix.decompose(r.position,r.rotation,r.scale),r.matrixWorldNeedsUpdate=!0,o.linearVelocity?(r.hasLinearVelocity=!0,r.linearVelocity.copy(o.linearVelocity)):r.hasLinearVelocity=!1,o.angularVelocity?(r.hasAngularVelocity=!0,r.angularVelocity.copy(o.angularVelocity)):r.hasAngularVelocity=!1,this.dispatchEvent(gf)))}return r!==null&&(r.visible=o!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new ct;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}class Ac{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new le(t),this.near=e,this.far=i}clone(){return new Ac(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Xh extends ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class vf extends ke{constructor(t=null,e=1,i=1,o,s,a,r,c,l=$e,h=$e,d,u){super(null,a,r,c,l,h,o,s,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Oa=new N,_f=new N,Mf=new ie;class xi{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,o){return this.normal.set(t,e,i),this.constant=o,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const o=Oa.subVectors(i,e).cross(_f.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(o,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Oa),o=this.normal.dot(i);if(o===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/o;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Mf.getNormalMatrix(t),o=this.coplanarPoint(Oa).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-o.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new aa,xf=new Dt(.5,.5),Ss=new N;class Pc{constructor(t=new xi,e=new xi,i=new xi,o=new xi,s=new xi,a=new xi){this.planes=[t,e,i,o,s,a]}set(t,e,i,o,s,a){const r=this.planes;return r[0].copy(t),r[1].copy(e),r[2].copy(i),r[3].copy(o),r[4].copy(s),r[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Rn,i=!1){const o=this.planes,s=t.elements,a=s[0],r=s[1],c=s[2],l=s[3],h=s[4],d=s[5],u=s[6],f=s[7],g=s[8],M=s[9],m=s[10],p=s[11],S=s[12],x=s[13],y=s[14],A=s[15];if(o[0].setComponents(l-a,f-h,p-g,A-S).normalize(),o[1].setComponents(l+a,f+h,p+g,A+S).normalize(),o[2].setComponents(l+r,f+d,p+M,A+x).normalize(),o[3].setComponents(l-r,f-d,p-M,A-x).normalize(),i)o[4].setComponents(c,u,m,y).normalize(),o[5].setComponents(l-c,f-u,p-m,A-y).normalize();else if(o[4].setComponents(l-c,f-u,p-m,A-y).normalize(),e===Rn)o[5].setComponents(l+c,f+u,p+m,A+y).normalize();else if(e===Zs)o[5].setComponents(c,u,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(t){gi.center.set(0,0,0);const e=xf.distanceTo(t.center);return gi.radius=.7071067811865476+e,gi.applyMatrix4(t.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(t){const e=this.planes,i=t.center,o=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<o)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const o=e[i];if(Ss.x=o.normal.x>0?t.max.x:t.min.x,Ss.y=o.normal.y>0?t.max.y:t.min.y,Ss.z=o.normal.z>0?t.max.z:t.min.z,o.distanceToPoint(Ss)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class jh extends fo{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new le(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ks=new N,Qs=new N,hl=new Ee,So=new Fh,ws=new aa,Fa=new N,dl=new N;class yf extends ve{constructor(t=new Le,e=new jh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let o=1,s=e.count;o<s;o++)Ks.fromBufferAttribute(e,o-1),Qs.fromBufferAttribute(e,o),i[o]=i[o-1],i[o]+=Ks.distanceTo(Qs);t.setAttribute("lineDistance",new he(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,o=this.matrixWorld,s=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ws.copy(i.boundingSphere),ws.applyMatrix4(o),ws.radius+=s,t.ray.intersectsSphere(ws)===!1)return;hl.copy(o).invert(),So.copy(t.ray).applyMatrix4(hl);const r=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=r*r,l=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let M=f,m=g-1;M<m;M+=l){const p=h.getX(M),S=h.getX(M+1),x=Es(this,t,So,c,p,S,M);x&&e.push(x)}if(this.isLineLoop){const M=h.getX(g-1),m=h.getX(f),p=Es(this,t,So,c,M,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let M=f,m=g-1;M<m;M+=l){const p=Es(this,t,So,c,M,M+1,M);p&&e.push(p)}if(this.isLineLoop){const M=Es(this,t,So,c,g-1,f,g-1);M&&e.push(M)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const o=e[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=o.length;s<a;s++){const r=o[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[r]=s}}}}}function Es(n,t,e,i,o,s,a){const r=n.geometry.attributes.position;if(Ks.fromBufferAttribute(r,o),Qs.fromBufferAttribute(r,s),e.distanceSqToSegment(Ks,Qs,Fa,dl)>i)return;Fa.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Fa);if(!(l<t.near||l>t.far))return{distance:l,point:dl.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const ul=new N,fl=new N;class pl extends yf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let o=0,s=e.count;o<s;o+=2)ul.fromBufferAttribute(e,o),fl.fromBufferAttribute(e,o+1),i[o]=o===0?0:i[o-1],i[o+1]=i[o]+ul.distanceTo(fl);t.setAttribute("lineDistance",new he(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Yh extends ke{constructor(t,e,i,o,s,a,r,c,l){super(t,e,i,o,s,a,r,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class $h extends ke{constructor(t,e,i=Ai,o,s,a,r=$e,c=$e,l,h=Oo,d=1){if(h!==Oo&&h!==Fo)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,o,s,a,r,c,h,i,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Tc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class Zh extends ke{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class an extends Le{constructor(t=1,e=1,i=4,o=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:o,heightSegments:s},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),o=Math.max(3,Math.floor(o)),s=Math.max(1,Math.floor(s));const a=[],r=[],c=[],l=[],h=e/2,d=Math.PI/2*t,u=e,f=2*d+u,g=i*2+s,M=o+1,m=new N,p=new N;for(let S=0;S<=g;S++){let x=0,y=0,A=0,P=0;if(S<=i){const E=S/i,b=E*Math.PI/2;y=-h-t*Math.cos(b),A=t*Math.sin(b),P=-t*Math.cos(b),x=E*d}else if(S<=i+s){const E=(S-i)/s;y=-h+E*e,A=t,P=0,x=d+E*u}else{const E=(S-i-s)/i,b=E*Math.PI/2;y=h+t*Math.sin(b),A=t*Math.cos(b),P=t*Math.sin(b),x=d+u+E*d}const C=Math.max(0,Math.min(1,x/f));let D=0;S===0?D=.5/o:S===g&&(D=-.5/o);for(let E=0;E<=o;E++){const b=E/o,L=b*Math.PI*2,z=Math.sin(L),B=Math.cos(L);p.x=-A*B,p.y=y,p.z=A*z,r.push(p.x,p.y,p.z),m.set(-A*B,P,A*z),m.normalize(),c.push(m.x,m.y,m.z),l.push(b+D,C)}if(S>0){const E=(S-1)*M;for(let b=0;b<o;b++){const L=E+b,z=E+b+1,B=S*M+b,H=S*M+b+1;a.push(L,z,B),a.push(z,H,B)}}}this.setIndex(a),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new an(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Vo extends Le{constructor(t=1,e=32,i=0,o=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:o},e=Math.max(3,e);const s=[],a=[],r=[],c=[],l=new N,h=new Dt;a.push(0,0,0),r.push(0,0,1),c.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=i+d/e*o;l.x=t*Math.cos(f),l.y=t*Math.sin(f),a.push(l.x,l.y,l.z),r.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,c.push(h.x,h.y)}for(let d=1;d<=e;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new he(a,3)),this.setAttribute("normal",new he(r,3)),this.setAttribute("uv",new he(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Vo(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class nt extends Le{constructor(t=1,e=1,i=1,o=32,s=1,a=!1,r=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:o,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:c};const l=this;o=Math.floor(o),s=Math.floor(s);const h=[],d=[],u=[],f=[];let g=0;const M=[],m=i/2;let p=0;S(),a===!1&&(t>0&&x(!0),e>0&&x(!1)),this.setIndex(h),this.setAttribute("position",new he(d,3)),this.setAttribute("normal",new he(u,3)),this.setAttribute("uv",new he(f,2));function S(){const y=new N,A=new N;let P=0;const C=(e-t)/i;for(let D=0;D<=s;D++){const E=[],b=D/s,L=b*(e-t)+t;for(let z=0;z<=o;z++){const B=z/o,H=B*c+r,W=Math.sin(H),q=Math.cos(H);A.x=L*W,A.y=-b*i+m,A.z=L*q,d.push(A.x,A.y,A.z),y.set(W,C,q).normalize(),u.push(y.x,y.y,y.z),f.push(B,1-b),E.push(g++)}M.push(E)}for(let D=0;D<o;D++)for(let E=0;E<s;E++){const b=M[E][D],L=M[E+1][D],z=M[E+1][D+1],B=M[E][D+1];(t>0||E!==0)&&(h.push(b,L,B),P+=3),(e>0||E!==s-1)&&(h.push(L,z,B),P+=3)}l.addGroup(p,P,0),p+=P}function x(y){const A=g,P=new Dt,C=new N;let D=0;const E=y===!0?t:e,b=y===!0?1:-1;for(let z=1;z<=o;z++)d.push(0,m*b,0),u.push(0,b,0),f.push(.5,.5),g++;const L=g;for(let z=0;z<=o;z++){const H=z/o*c+r,W=Math.cos(H),q=Math.sin(H);C.x=E*q,C.y=m*b,C.z=E*W,d.push(C.x,C.y,C.z),u.push(0,b,0),P.x=W*.5+.5,P.y=q*.5*b+.5,f.push(P.x,P.y),g++}for(let z=0;z<o;z++){const B=A+z,H=L+z;y===!0?h.push(H,H+1,B):h.push(H+1,H,B),D+=3}l.addGroup(p,D,y===!0?1:2),p+=D}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new nt(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ce extends nt{constructor(t=1,e=1,i=32,o=1,s=!1,a=0,r=Math.PI*2){super(0,t,e,i,o,s,a,r),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:o,openEnded:s,thetaStart:a,thetaLength:r}}static fromJSON(t){return new Ce(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ca extends Le{constructor(t=[],e=[],i=1,o=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:o};const s=[],a=[];r(o),l(i),h(),this.setAttribute("position",new he(s,3)),this.setAttribute("normal",new he(s.slice(),3)),this.setAttribute("uv",new he(a,2)),o===0?this.computeVertexNormals():this.normalizeNormals();function r(S){const x=new N,y=new N,A=new N;for(let P=0;P<e.length;P+=3)f(e[P+0],x),f(e[P+1],y),f(e[P+2],A),c(x,y,A,S)}function c(S,x,y,A){const P=A+1,C=[];for(let D=0;D<=P;D++){C[D]=[];const E=S.clone().lerp(y,D/P),b=x.clone().lerp(y,D/P),L=P-D;for(let z=0;z<=L;z++)z===0&&D===P?C[D][z]=E:C[D][z]=E.clone().lerp(b,z/L)}for(let D=0;D<P;D++)for(let E=0;E<2*(P-D)-1;E++){const b=Math.floor(E/2);E%2===0?(u(C[D][b+1]),u(C[D+1][b]),u(C[D][b])):(u(C[D][b+1]),u(C[D+1][b+1]),u(C[D+1][b]))}}function l(S){const x=new N;for(let y=0;y<s.length;y+=3)x.x=s[y+0],x.y=s[y+1],x.z=s[y+2],x.normalize().multiplyScalar(S),s[y+0]=x.x,s[y+1]=x.y,s[y+2]=x.z}function h(){const S=new N;for(let x=0;x<s.length;x+=3){S.x=s[x+0],S.y=s[x+1],S.z=s[x+2];const y=m(S)/2/Math.PI+.5,A=p(S)/Math.PI+.5;a.push(y,1-A)}g(),d()}function d(){for(let S=0;S<a.length;S+=6){const x=a[S+0],y=a[S+2],A=a[S+4],P=Math.max(x,y,A),C=Math.min(x,y,A);P>.9&&C<.1&&(x<.2&&(a[S+0]+=1),y<.2&&(a[S+2]+=1),A<.2&&(a[S+4]+=1))}}function u(S){s.push(S.x,S.y,S.z)}function f(S,x){const y=S*3;x.x=t[y+0],x.y=t[y+1],x.z=t[y+2]}function g(){const S=new N,x=new N,y=new N,A=new N,P=new Dt,C=new Dt,D=new Dt;for(let E=0,b=0;E<s.length;E+=9,b+=6){S.set(s[E+0],s[E+1],s[E+2]),x.set(s[E+3],s[E+4],s[E+5]),y.set(s[E+6],s[E+7],s[E+8]),P.set(a[b+0],a[b+1]),C.set(a[b+2],a[b+3]),D.set(a[b+4],a[b+5]),A.copy(S).add(x).add(y).divideScalar(3);const L=m(A);M(P,b+0,S,L),M(C,b+2,x,L),M(D,b+4,y,L)}}function M(S,x,y,A){A<0&&S.x===1&&(a[x]=S.x-1),y.x===0&&y.z===0&&(a[x]=A/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ca(t.vertices,t.indices,t.radius,t.details)}}class Cc extends ca{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,o=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-o,-i,0,-o,i,0,o,-i,0,o,i,-o,-i,0,-o,i,0,o,-i,0,o,i,0,-i,0,-o,i,0,-o,-i,0,o,i,0,o],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Cc(t.radius,t.detail)}}class Nn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,o=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),s+=i.distanceTo(o),e.push(s),o=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let o=0;const s=i.length;let a;e?a=e:a=t*i[s-1];let r=0,c=s-1,l;for(;r<=c;)if(o=Math.floor(r+(c-r)/2),l=i[o]-a,l<0)r=o+1;else if(l>0)c=o-1;else{c=o;break}if(o=c,i[o]===a)return o/(s-1);const h=i[o],u=i[o+1]-h,f=(a-h)/u;return(o+f)/(s-1)}getTangent(t,e){let o=t-1e-4,s=t+1e-4;o<0&&(o=0),s>1&&(s=1);const a=this.getPoint(o),r=this.getPoint(s),c=e||(a.isVector2?new Dt:new N);return c.copy(r).sub(a).normalize(),c}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new N,o=[],s=[],a=[],r=new N,c=new Ee;for(let f=0;f<=t;f++){const g=f/t;o[f]=this.getTangentAt(g,new N)}s[0]=new N,a[0]=new N;let l=Number.MAX_VALUE;const h=Math.abs(o[0].x),d=Math.abs(o[0].y),u=Math.abs(o[0].z);h<=l&&(l=h,i.set(1,0,0)),d<=l&&(l=d,i.set(0,1,0)),u<=l&&i.set(0,0,1),r.crossVectors(o[0],i).normalize(),s[0].crossVectors(o[0],r),a[0].crossVectors(o[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),r.crossVectors(o[f-1],o[f]),r.length()>Number.EPSILON){r.normalize();const g=Math.acos(re(o[f-1].dot(o[f]),-1,1));s[f].applyMatrix4(c.makeRotationAxis(r,g))}a[f].crossVectors(o[f],s[f])}if(e===!0){let f=Math.acos(re(s[0].dot(s[t]),-1,1));f/=t,o[0].dot(r.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(o[g],f*g)),a[g].crossVectors(o[g],s[g])}return{tangents:o,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Rc extends Nn{constructor(t=0,e=0,i=1,o=1,s=0,a=Math.PI*2,r=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=o,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=r,this.aRotation=c}getPoint(t,e=new Dt){const i=e,o=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=o;for(;s>o;)s-=o;s<Number.EPSILON&&(a?s=0:s=o),this.aClockwise===!0&&!a&&(s===o?s=-o:s=s-o);const r=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(r),l=this.aY+this.yRadius*Math.sin(r);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,f=l-this.aY;c=u*h-f*d+this.aX,l=u*d+f*h+this.aY}return i.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class bf extends Rc{constructor(t,e,i,o,s,a){super(t,e,i,i,o,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Ic(){let n=0,t=0,e=0,i=0;function o(s,a,r,c){n=s,t=r,e=-3*s+3*a-2*r-c,i=2*s-2*a+r+c}return{initCatmullRom:function(s,a,r,c,l){o(a,r,l*(r-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,r,c,l,h,d){let u=(a-s)/l-(r-s)/(l+h)+(r-a)/h,f=(r-a)/h-(c-a)/(h+d)+(c-r)/d;u*=h,f*=h,o(a,r,u,f)},calc:function(s){const a=s*s,r=a*s;return n+t*s+e*a+i*r}}}const Ts=new N,Ba=new Ic,ka=new Ic,Va=new Ic;class Sf extends Nn{constructor(t=[],e=!1,i="centripetal",o=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=o}getPoint(t,e=new N){const i=e,o=this.points,s=o.length,a=(s-(this.closed?0:1))*t;let r=Math.floor(a),c=a-r;this.closed?r+=r>0?0:(Math.floor(Math.abs(r)/s)+1)*s:c===0&&r===s-1&&(r=s-2,c=1);let l,h;this.closed||r>0?l=o[(r-1)%s]:(Ts.subVectors(o[0],o[1]).add(o[0]),l=Ts);const d=o[r%s],u=o[(r+1)%s];if(this.closed||r+2<s?h=o[(r+2)%s]:(Ts.subVectors(o[s-1],o[s-2]).add(o[s-1]),h=Ts),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),f),M=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);M<1e-4&&(M=1),g<1e-4&&(g=M),m<1e-4&&(m=M),Ba.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,M,m),ka.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,M,m),Va.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,M,m)}else this.curveType==="catmullrom"&&(Ba.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),ka.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Va.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return i.set(Ba.calc(c),ka.calc(c),Va.calc(c)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(o.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const o=this.points[e];t.points.push(o.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(new N().fromArray(o))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function ml(n,t,e,i,o){const s=(i-t)*.5,a=(o-e)*.5,r=n*n,c=n*r;return(2*e-2*i+s+a)*c+(-3*e+3*i-2*s-a)*r+s*n+e}function wf(n,t){const e=1-n;return e*e*t}function Ef(n,t){return 2*(1-n)*n*t}function Tf(n,t){return n*n*t}function Io(n,t,e,i){return wf(n,t)+Ef(n,e)+Tf(n,i)}function Af(n,t){const e=1-n;return e*e*e*t}function Pf(n,t){const e=1-n;return 3*e*e*n*t}function Cf(n,t){return 3*(1-n)*n*n*t}function Rf(n,t){return n*n*n*t}function Do(n,t,e,i,o){return Af(n,t)+Pf(n,e)+Cf(n,i)+Rf(n,o)}class Jh extends Nn{constructor(t=new Dt,e=new Dt,i=new Dt,o=new Dt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=o}getPoint(t,e=new Dt){const i=e,o=this.v0,s=this.v1,a=this.v2,r=this.v3;return i.set(Do(t,o.x,s.x,a.x,r.x),Do(t,o.y,s.y,a.y,r.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class If extends Nn{constructor(t=new N,e=new N,i=new N,o=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=o}getPoint(t,e=new N){const i=e,o=this.v0,s=this.v1,a=this.v2,r=this.v3;return i.set(Do(t,o.x,s.x,a.x,r.x),Do(t,o.y,s.y,a.y,r.y),Do(t,o.z,s.z,a.z,r.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Kh extends Nn{constructor(t=new Dt,e=new Dt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Dt){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Dt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Df extends Nn{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qh extends Nn{constructor(t=new Dt,e=new Dt,i=new Dt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new Dt){const i=e,o=this.v0,s=this.v1,a=this.v2;return i.set(Io(t,o.x,s.x,a.x),Io(t,o.y,s.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Lf extends Nn{constructor(t=new N,e=new N,i=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new N){const i=e,o=this.v0,s=this.v1,a=this.v2;return i.set(Io(t,o.x,s.x,a.x),Io(t,o.y,s.y,a.y),Io(t,o.z,s.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class td extends Nn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Dt){const i=e,o=this.points,s=(o.length-1)*t,a=Math.floor(s),r=s-a,c=o[a===0?a:a-1],l=o[a],h=o[a>o.length-2?o.length-1:a+1],d=o[a>o.length-3?o.length-1:a+2];return i.set(ml(r,c.x,l.x,h.x,d.x),ml(r,c.y,l.y,h.y,d.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(o.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const o=this.points[e];t.points.push(o.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const o=t.points[e];this.points.push(new Dt().fromArray(o))}return this}}var $r=Object.freeze({__proto__:null,ArcCurve:bf,CatmullRomCurve3:Sf,CubicBezierCurve:Jh,CubicBezierCurve3:If,EllipseCurve:Rc,LineCurve:Kh,LineCurve3:Df,QuadraticBezierCurve:Qh,QuadraticBezierCurve3:Lf,SplineCurve:td});class Uf extends Nn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new $r[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),o=this.getCurveLengths();let s=0;for(;s<o.length;){if(o[s]>=i){const a=o[s]-i,r=this.curves[s],c=r.getLength(),l=c===0?0:1-a/c;return r.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,o=this.curves.length;i<o;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let o=0,s=this.curves;o<s.length;o++){const a=s[o],r=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(r);for(let l=0;l<c.length;l++){const h=c[l];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const o=t.curves[e];this.curves.push(o.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const o=this.curves[e];t.curves.push(o.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const o=t.curves[e];this.curves.push(new $r[o.type]().fromJSON(o))}return this}}class Zr extends Uf{constructor(t){super(),this.type="Path",this.currentPoint=new Dt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Kh(this.currentPoint.clone(),new Dt(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,o){const s=new Qh(this.currentPoint.clone(),new Dt(t,e),new Dt(i,o));return this.curves.push(s),this.currentPoint.set(i,o),this}bezierCurveTo(t,e,i,o,s,a){const r=new Jh(this.currentPoint.clone(),new Dt(t,e),new Dt(i,o),new Dt(s,a));return this.curves.push(r),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new td(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,o,s,a){const r=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+r,e+c,i,o,s,a),this}absarc(t,e,i,o,s,a){return this.absellipse(t,e,i,i,o,s,a),this}ellipse(t,e,i,o,s,a,r,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,i,o,s,a,r,c),this}absellipse(t,e,i,o,s,a,r,c){const l=new Rc(t,e,i,o,s,a,r,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Yo extends Zr{constructor(t){super(t),this.uuid=Ri(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,o=this.holes.length;i<o;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const o=t.holes[e];this.holes.push(o.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const o=this.holes[e];t.holes.push(o.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const o=t.holes[e];this.holes.push(new Zr().fromJSON(o))}return this}}function Nf(n,t,e=2){const i=t&&t.length,o=i?t[0]*e:n.length;let s=ed(n,0,o,e,!0);const a=[];if(!s||s.next===s.prev)return a;let r,c,l;if(i&&(s=kf(n,t,s,e)),n.length>80*e){r=1/0,c=1/0;let h=-1/0,d=-1/0;for(let u=e;u<o;u+=e){const f=n[u],g=n[u+1];f<r&&(r=f),g<c&&(c=g),f>h&&(h=f),g>d&&(d=g)}l=Math.max(h-r,d-c),l=l!==0?32767/l:0}return Ho(s,a,e,r,c,l,0),a}function ed(n,t,e,i,o){let s;if(o===Jf(n,t,e,i)>0)for(let a=t;a<e;a+=i)s=gl(a/i|0,n[a],n[a+1],s);else for(let a=e-i;a>=t;a-=i)s=gl(a/i|0,n[a],n[a+1],s);return s&&ro(s,s.next)&&(qo(s),s=s.next),s}function Ci(n,t){if(!n)return n;t||(t=n);let e=n,i;do if(i=!1,!e.steiner&&(ro(e,e.next)||we(e.prev,e,e.next)===0)){if(qo(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function Ho(n,t,e,i,o,s,a){if(!n)return;!a&&s&&Wf(n,i,o,s);let r=n;for(;n.prev!==n.next;){const c=n.prev,l=n.next;if(s?Of(n,i,o,s):zf(n)){t.push(c.i,n.i,l.i),qo(n),n=l.next,r=l.next;continue}if(n=l,n===r){a?a===1?(n=Ff(Ci(n),t),Ho(n,t,e,i,o,s,2)):a===2&&Bf(n,t,e,i,o,s):Ho(Ci(n),t,e,i,o,s,1);break}}}function zf(n){const t=n.prev,e=n,i=n.next;if(we(t,e,i)>=0)return!1;const o=t.x,s=e.x,a=i.x,r=t.y,c=e.y,l=i.y,h=Math.min(o,s,a),d=Math.min(r,c,l),u=Math.max(o,s,a),f=Math.max(r,c,l);let g=i.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=f&&Ao(o,r,s,c,a,l,g.x,g.y)&&we(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Of(n,t,e,i){const o=n.prev,s=n,a=n.next;if(we(o,s,a)>=0)return!1;const r=o.x,c=s.x,l=a.x,h=o.y,d=s.y,u=a.y,f=Math.min(r,c,l),g=Math.min(h,d,u),M=Math.max(r,c,l),m=Math.max(h,d,u),p=Jr(f,g,t,e,i),S=Jr(M,m,t,e,i);let x=n.prevZ,y=n.nextZ;for(;x&&x.z>=p&&y&&y.z<=S;){if(x.x>=f&&x.x<=M&&x.y>=g&&x.y<=m&&x!==o&&x!==a&&Ao(r,h,c,d,l,u,x.x,x.y)&&we(x.prev,x,x.next)>=0||(x=x.prevZ,y.x>=f&&y.x<=M&&y.y>=g&&y.y<=m&&y!==o&&y!==a&&Ao(r,h,c,d,l,u,y.x,y.y)&&we(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;x&&x.z>=p;){if(x.x>=f&&x.x<=M&&x.y>=g&&x.y<=m&&x!==o&&x!==a&&Ao(r,h,c,d,l,u,x.x,x.y)&&we(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;y&&y.z<=S;){if(y.x>=f&&y.x<=M&&y.y>=g&&y.y<=m&&y!==o&&y!==a&&Ao(r,h,c,d,l,u,y.x,y.y)&&we(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Ff(n,t){let e=n;do{const i=e.prev,o=e.next.next;!ro(i,o)&&id(i,e,e.next,o)&&Go(i,o)&&Go(o,i)&&(t.push(i.i,e.i,o.i),qo(e),qo(e.next),e=n=o),e=e.next}while(e!==n);return Ci(e)}function Bf(n,t,e,i,o,s){let a=n;do{let r=a.next.next;for(;r!==a.prev;){if(a.i!==r.i&&Yf(a,r)){let c=od(a,r);a=Ci(a,a.next),c=Ci(c,c.next),Ho(a,t,e,i,o,s,0),Ho(c,t,e,i,o,s,0);return}r=r.next}a=a.next}while(a!==n)}function kf(n,t,e,i){const o=[];for(let s=0,a=t.length;s<a;s++){const r=t[s]*i,c=s<a-1?t[s+1]*i:n.length,l=ed(n,r,c,i,!1);l===l.next&&(l.steiner=!0),o.push(jf(l))}o.sort(Vf);for(let s=0;s<o.length;s++)e=Hf(o[s],e);return e}function Vf(n,t){let e=n.x-t.x;if(e===0&&(e=n.y-t.y,e===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),o=(t.next.y-t.y)/(t.next.x-t.x);e=i-o}return e}function Hf(n,t){const e=Gf(n,t);if(!e)return t;const i=od(e,n);return Ci(i,i.next),Ci(e,e.next)}function Gf(n,t){let e=t;const i=n.x,o=n.y;let s=-1/0,a;if(ro(n,e))return e;do{if(ro(n,e.next))return e.next;if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=i&&d>s&&(s=d,a=e.x<e.next.x?e:e.next,d===i))return a}e=e.next}while(e!==t);if(!a)return null;const r=a,c=a.x,l=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=c&&i!==e.x&&nd(o<l?i:s,o,c,l,o<l?s:i,o,e.x,e.y)){const d=Math.abs(o-e.y)/(i-e.x);Go(e,n)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&qf(a,e)))&&(a=e,h=d)}e=e.next}while(e!==r);return a}function qf(n,t){return we(n.prev,n,t.prev)<0&&we(t.next,n,n.next)<0}function Wf(n,t,e,i){let o=n;do o.z===0&&(o.z=Jr(o.x,o.y,t,e,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==n);o.prevZ.nextZ=null,o.prevZ=null,Xf(o)}function Xf(n){let t,e=1;do{let i=n,o;n=null;let s=null;for(t=0;i;){t++;let a=i,r=0;for(let l=0;l<e&&(r++,a=a.nextZ,!!a);l++);let c=e;for(;r>0||c>0&&a;)r!==0&&(c===0||!a||i.z<=a.z)?(o=i,i=i.nextZ,r--):(o=a,a=a.nextZ,c--),s?s.nextZ=o:n=o,o.prevZ=s,s=o;i=a}s.nextZ=null,e*=2}while(t>1);return n}function Jr(n,t,e,i,o){return n=(n-e)*o|0,t=(t-i)*o|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,n|t<<1}function jf(n){let t=n,e=n;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==n);return e}function nd(n,t,e,i,o,s,a,r){return(o-a)*(t-r)>=(n-a)*(s-r)&&(n-a)*(i-r)>=(e-a)*(t-r)&&(e-a)*(s-r)>=(o-a)*(i-r)}function Ao(n,t,e,i,o,s,a,r){return!(n===a&&t===r)&&nd(n,t,e,i,o,s,a,r)}function Yf(n,t){return n.next.i!==t.i&&n.prev.i!==t.i&&!$f(n,t)&&(Go(n,t)&&Go(t,n)&&Zf(n,t)&&(we(n.prev,n,t.prev)||we(n,t.prev,t))||ro(n,t)&&we(n.prev,n,n.next)>0&&we(t.prev,t,t.next)>0)}function we(n,t,e){return(t.y-n.y)*(e.x-t.x)-(t.x-n.x)*(e.y-t.y)}function ro(n,t){return n.x===t.x&&n.y===t.y}function id(n,t,e,i){const o=Ps(we(n,t,e)),s=Ps(we(n,t,i)),a=Ps(we(e,i,n)),r=Ps(we(e,i,t));return!!(o!==s&&a!==r||o===0&&As(n,e,t)||s===0&&As(n,i,t)||a===0&&As(e,n,i)||r===0&&As(e,t,i))}function As(n,t,e){return t.x<=Math.max(n.x,e.x)&&t.x>=Math.min(n.x,e.x)&&t.y<=Math.max(n.y,e.y)&&t.y>=Math.min(n.y,e.y)}function Ps(n){return n>0?1:n<0?-1:0}function $f(n,t){let e=n;do{if(e.i!==n.i&&e.next.i!==n.i&&e.i!==t.i&&e.next.i!==t.i&&id(e,e.next,n,t))return!0;e=e.next}while(e!==n);return!1}function Go(n,t){return we(n.prev,n,n.next)<0?we(n,t,n.next)>=0&&we(n,n.prev,t)>=0:we(n,t,n.prev)<0||we(n,n.next,t)<0}function Zf(n,t){let e=n,i=!1;const o=(n.x+t.x)/2,s=(n.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&o<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==n);return i}function od(n,t){const e=Kr(n.i,n.x,n.y),i=Kr(t.i,t.x,t.y),o=n.next,s=t.prev;return n.next=t,t.prev=n,e.next=o,o.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function gl(n,t,e,i){const o=Kr(n,t,e);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function qo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Kr(n,t,e){return{i:n,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Jf(n,t,e,i){let o=0;for(let s=t,a=e-i;s<e;s+=i)o+=(n[a]-n[s])*(n[s+1]+n[a+1]),a=s;return o}class Kf{static triangulate(t,e,i=2){return Nf(t,e,i)}}class qn{static area(t){const e=t.length;let i=0;for(let o=e-1,s=0;s<e;o=s++)i+=t[o].x*t[s].y-t[s].x*t[o].y;return i*.5}static isClockWise(t){return qn.area(t)<0}static triangulateShape(t,e){const i=[],o=[],s=[];vl(t),_l(i,t);let a=t.length;e.forEach(vl);for(let c=0;c<e.length;c++)o.push(a),a+=e[c].length,_l(i,e[c]);const r=Kf.triangulate(i,o);for(let c=0;c<r.length;c+=3)s.push(r.slice(c,c+3));return s}}function vl(n){const t=n.length;t>2&&n[t-1].equals(n[0])&&n.pop()}function _l(n,t){for(let e=0;e<t.length;e++)n.push(t[e].x),n.push(t[e].y)}class la extends Le{constructor(t=new Yo([new Dt(.5,.5),new Dt(-.5,.5),new Dt(-.5,-.5),new Dt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,o=[],s=[];for(let r=0,c=t.length;r<c;r++){const l=t[r];a(l)}this.setAttribute("position",new he(o,3)),this.setAttribute("uv",new he(s,2)),this.computeVertexNormals();function a(r){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,M=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,S=e.UVGenerator!==void 0?e.UVGenerator:Qf;let x,y=!1,A,P,C,D;p&&(x=p.getSpacedPoints(h),y=!0,u=!1,A=p.computeFrenetFrames(h,!1),P=new N,C=new N,D=new N),u||(m=0,f=0,g=0,M=0);const E=r.extractPoints(l);let b=E.shape;const L=E.holes;if(!qn.isClockWise(b)){b=b.reverse();for(let pt=0,ut=L.length;pt<ut;pt++){const ht=L[pt];qn.isClockWise(ht)&&(L[pt]=ht.reverse())}}function B(pt){const ht=10000000000000001e-36;let Q=pt[0];for(let Et=1;Et<=pt.length;Et++){const yt=Et%pt.length,Ct=pt[yt],Zt=Ct.x-Q.x,Qt=Ct.y-Q.y,U=Zt*Zt+Qt*Qt,T=Math.max(Math.abs(Ct.x),Math.abs(Ct.y),Math.abs(Q.x),Math.abs(Q.y)),Z=ht*T*T;if(U<=Z){pt.splice(yt,1),Et--;continue}Q=Ct}}B(b),L.forEach(B);const H=L.length,W=b;for(let pt=0;pt<H;pt++){const ut=L[pt];b=b.concat(ut)}function q(pt,ut,ht){return ut||console.error("THREE.ExtrudeGeometry: vec does not exist"),pt.clone().addScaledVector(ut,ht)}const tt=b.length;function Y(pt,ut,ht){let Q,Et,yt;const Ct=pt.x-ut.x,Zt=pt.y-ut.y,Qt=ht.x-pt.x,U=ht.y-pt.y,T=Ct*Ct+Zt*Zt,Z=Ct*U-Zt*Qt;if(Math.abs(Z)>Number.EPSILON){const it=Math.sqrt(T),gt=Math.sqrt(Qt*Qt+U*U),lt=ut.x-Zt/it,Ht=ut.y+Ct/it,Tt=ht.x-U/gt,Gt=ht.y+Qt/gt,qt=((Tt-lt)*U-(Gt-Ht)*Qt)/(Ct*U-Zt*Qt);Q=lt+Ct*qt-pt.x,Et=Ht+Zt*qt-pt.y;const St=Q*Q+Et*Et;if(St<=2)return new Dt(Q,Et);yt=Math.sqrt(St/2)}else{let it=!1;Ct>Number.EPSILON?Qt>Number.EPSILON&&(it=!0):Ct<-Number.EPSILON?Qt<-Number.EPSILON&&(it=!0):Math.sign(Zt)===Math.sign(U)&&(it=!0),it?(Q=-Zt,Et=Ct,yt=Math.sqrt(T)):(Q=Ct,Et=Zt,yt=Math.sqrt(T/2))}return new Dt(Q/yt,Et/yt)}const st=[];for(let pt=0,ut=W.length,ht=ut-1,Q=pt+1;pt<ut;pt++,ht++,Q++)ht===ut&&(ht=0),Q===ut&&(Q=0),st[pt]=Y(W[pt],W[ht],W[Q]);const j=[];let mt,vt=st.concat();for(let pt=0,ut=H;pt<ut;pt++){const ht=L[pt];mt=[];for(let Q=0,Et=ht.length,yt=Et-1,Ct=Q+1;Q<Et;Q++,yt++,Ct++)yt===Et&&(yt=0),Ct===Et&&(Ct=0),mt[Q]=Y(ht[Q],ht[yt],ht[Ct]);j.push(mt),vt=vt.concat(mt)}let At;if(m===0)At=qn.triangulateShape(W,L);else{const pt=[],ut=[];for(let ht=0;ht<m;ht++){const Q=ht/m,Et=f*Math.cos(Q*Math.PI/2),yt=g*Math.sin(Q*Math.PI/2)+M;for(let Ct=0,Zt=W.length;Ct<Zt;Ct++){const Qt=q(W[Ct],st[Ct],yt);Ot(Qt.x,Qt.y,-Et),Q===0&&pt.push(Qt)}for(let Ct=0,Zt=H;Ct<Zt;Ct++){const Qt=L[Ct];mt=j[Ct];const U=[];for(let T=0,Z=Qt.length;T<Z;T++){const it=q(Qt[T],mt[T],yt);Ot(it.x,it.y,-Et),Q===0&&U.push(it)}Q===0&&ut.push(U)}}At=qn.triangulateShape(pt,ut)}const V=At.length,ft=g+M;for(let pt=0;pt<tt;pt++){const ut=u?q(b[pt],vt[pt],ft):b[pt];y?(C.copy(A.normals[0]).multiplyScalar(ut.x),P.copy(A.binormals[0]).multiplyScalar(ut.y),D.copy(x[0]).add(C).add(P),Ot(D.x,D.y,D.z)):Ot(ut.x,ut.y,0)}for(let pt=1;pt<=h;pt++)for(let ut=0;ut<tt;ut++){const ht=u?q(b[ut],vt[ut],ft):b[ut];y?(C.copy(A.normals[pt]).multiplyScalar(ht.x),P.copy(A.binormals[pt]).multiplyScalar(ht.y),D.copy(x[pt]).add(C).add(P),Ot(D.x,D.y,D.z)):Ot(ht.x,ht.y,d/h*pt)}for(let pt=m-1;pt>=0;pt--){const ut=pt/m,ht=f*Math.cos(ut*Math.PI/2),Q=g*Math.sin(ut*Math.PI/2)+M;for(let Et=0,yt=W.length;Et<yt;Et++){const Ct=q(W[Et],st[Et],Q);Ot(Ct.x,Ct.y,d+ht)}for(let Et=0,yt=L.length;Et<yt;Et++){const Ct=L[Et];mt=j[Et];for(let Zt=0,Qt=Ct.length;Zt<Qt;Zt++){const U=q(Ct[Zt],mt[Zt],Q);y?Ot(U.x,U.y+x[h-1].y,x[h-1].x+ht):Ot(U.x,U.y,d+ht)}}}K(),rt();function K(){const pt=o.length/3;if(u){let ut=0,ht=tt*ut;for(let Q=0;Q<V;Q++){const Et=At[Q];Ut(Et[2]+ht,Et[1]+ht,Et[0]+ht)}ut=h+m*2,ht=tt*ut;for(let Q=0;Q<V;Q++){const Et=At[Q];Ut(Et[0]+ht,Et[1]+ht,Et[2]+ht)}}else{for(let ut=0;ut<V;ut++){const ht=At[ut];Ut(ht[2],ht[1],ht[0])}for(let ut=0;ut<V;ut++){const ht=At[ut];Ut(ht[0]+tt*h,ht[1]+tt*h,ht[2]+tt*h)}}i.addGroup(pt,o.length/3-pt,0)}function rt(){const pt=o.length/3;let ut=0;Pt(W,ut),ut+=W.length;for(let ht=0,Q=L.length;ht<Q;ht++){const Et=L[ht];Pt(Et,ut),ut+=Et.length}i.addGroup(pt,o.length/3-pt,1)}function Pt(pt,ut){let ht=pt.length;for(;--ht>=0;){const Q=ht;let Et=ht-1;Et<0&&(Et=pt.length-1);for(let yt=0,Ct=h+m*2;yt<Ct;yt++){const Zt=tt*yt,Qt=tt*(yt+1),U=ut+Q+Zt,T=ut+Et+Zt,Z=ut+Et+Qt,it=ut+Q+Qt;jt(U,T,Z,it)}}}function Ot(pt,ut,ht){c.push(pt),c.push(ut),c.push(ht)}function Ut(pt,ut,ht){ee(pt),ee(ut),ee(ht);const Q=o.length/3,Et=S.generateTopUV(i,o,Q-3,Q-2,Q-1);F(Et[0]),F(Et[1]),F(Et[2])}function jt(pt,ut,ht,Q){ee(pt),ee(ut),ee(Q),ee(ut),ee(ht),ee(Q);const Et=o.length/3,yt=S.generateSideWallUV(i,o,Et-6,Et-3,Et-2,Et-1);F(yt[0]),F(yt[1]),F(yt[3]),F(yt[1]),F(yt[2]),F(yt[3])}function ee(pt){o.push(c[pt*3+0]),o.push(c[pt*3+1]),o.push(c[pt*3+2])}function F(pt){s.push(pt.x),s.push(pt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return tp(e,i,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const r=e[t.shapes[s]];i.push(r)}const o=t.options.extrudePath;return o!==void 0&&(t.options.extrudePath=new $r[o.type]().fromJSON(o)),new la(i,t.options)}}const Qf={generateTopUV:function(n,t,e,i,o){const s=t[e*3],a=t[e*3+1],r=t[i*3],c=t[i*3+1],l=t[o*3],h=t[o*3+1];return[new Dt(s,a),new Dt(r,c),new Dt(l,h)]},generateSideWallUV:function(n,t,e,i,o,s){const a=t[e*3],r=t[e*3+1],c=t[e*3+2],l=t[i*3],h=t[i*3+1],d=t[i*3+2],u=t[o*3],f=t[o*3+1],g=t[o*3+2],M=t[s*3],m=t[s*3+1],p=t[s*3+2];return Math.abs(r-h)<Math.abs(a-l)?[new Dt(a,1-c),new Dt(l,1-d),new Dt(u,1-g),new Dt(M,1-p)]:[new Dt(r,1-c),new Dt(h,1-d),new Dt(f,1-g),new Dt(m,1-p)]}};function tp(n,t,e){if(e.shapes=[],Array.isArray(n))for(let i=0,o=n.length;i<o;i++){const s=n[i];e.shapes.push(s.uuid)}else e.shapes.push(n.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class $o extends ca{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,o=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(o,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new $o(t.radius,t.detail)}}class ze extends Le{constructor(t=1,e=1,i=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:o};const s=t/2,a=e/2,r=Math.floor(i),c=Math.floor(o),l=r+1,h=c+1,d=t/r,u=e/c,f=[],g=[],M=[],m=[];for(let p=0;p<h;p++){const S=p*u-a;for(let x=0;x<l;x++){const y=x*d-s;g.push(y,-S,0),M.push(0,0,1),m.push(x/r),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<r;S++){const x=S+l*p,y=S+l*(p+1),A=S+1+l*(p+1),P=S+1+l*p;f.push(x,y,P),f.push(y,A,P)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(M,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ze(t.width,t.height,t.widthSegments,t.heightSegments)}}class Dc extends Le{constructor(t=.5,e=1,i=32,o=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:o,thetaStart:s,thetaLength:a},i=Math.max(3,i),o=Math.max(1,o);const r=[],c=[],l=[],h=[];let d=t;const u=(e-t)/o,f=new N,g=new Dt;for(let M=0;M<=o;M++){for(let m=0;m<=i;m++){const p=s+m/i*a;f.x=d*Math.cos(p),f.y=d*Math.sin(p),c.push(f.x,f.y,f.z),l.push(0,0,1),g.x=(f.x/e+1)/2,g.y=(f.y/e+1)/2,h.push(g.x,g.y)}d+=u}for(let M=0;M<o;M++){const m=M*(i+1);for(let p=0;p<i;p++){const S=p+m,x=S,y=S+i+1,A=S+i+2,P=S+1;r.push(x,y,P),r.push(y,A,P)}}this.setIndex(r),this.setAttribute("position",new he(c,3)),this.setAttribute("normal",new he(l,3)),this.setAttribute("uv",new he(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Dc(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class Lc extends Le{constructor(t=new Yo([new Dt(0,.5),new Dt(-.5,-.5),new Dt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],o=[],s=[],a=[];let r=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(r,c,h),r+=c,c=0;this.setIndex(i),this.setAttribute("position",new he(o,3)),this.setAttribute("normal",new he(s,3)),this.setAttribute("uv",new he(a,2));function l(h){const d=o.length/3,u=h.extractPoints(e);let f=u.shape;const g=u.holes;qn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const S=g[m];qn.isClockWise(S)===!0&&(g[m]=S.reverse())}const M=qn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const S=g[m];f=f.concat(S)}for(let m=0,p=f.length;m<p;m++){const S=f[m];o.push(S.x,S.y,0),s.push(0,0,1),a.push(S.x,S.y)}for(let m=0,p=M.length;m<p;m++){const S=M[m],x=S[0]+d,y=S[1]+d,A=S[2]+d;i.push(x,y,A),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return ep(e,t)}static fromJSON(t,e){const i=[];for(let o=0,s=t.shapes.length;o<s;o++){const a=e[t.shapes[o]];i.push(a)}return new Lc(i,t.curveSegments)}}function ep(n,t){if(t.shapes=[],Array.isArray(n))for(let e=0,i=n.length;e<i;e++){const o=n[e];t.shapes.push(o.uuid)}else t.shapes.push(n.uuid);return t}class It extends Le{constructor(t=1,e=32,i=16,o=0,s=Math.PI*2,a=0,r=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:o,phiLength:s,thetaStart:a,thetaLength:r},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const c=Math.min(a+r,Math.PI);let l=0;const h=[],d=new N,u=new N,f=[],g=[],M=[],m=[];for(let p=0;p<=i;p++){const S=[],x=p/i;let y=0;p===0&&a===0?y=.5/e:p===i&&c===Math.PI&&(y=-.5/e);for(let A=0;A<=e;A++){const P=A/e;d.x=-t*Math.cos(o+P*s)*Math.sin(a+x*r),d.y=t*Math.cos(a+x*r),d.z=t*Math.sin(o+P*s)*Math.sin(a+x*r),g.push(d.x,d.y,d.z),u.copy(d).normalize(),M.push(u.x,u.y,u.z),m.push(P+y,1-x),S.push(l++)}h.push(S)}for(let p=0;p<i;p++)for(let S=0;S<e;S++){const x=h[p][S+1],y=h[p][S],A=h[p+1][S],P=h[p+1][S+1];(p!==0||a>0)&&f.push(x,y,P),(p!==i-1||c<Math.PI)&&f.push(y,A,P)}this.setIndex(f),this.setAttribute("position",new he(g,3)),this.setAttribute("normal",new he(M,3)),this.setAttribute("uv",new he(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new It(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ge extends Le{constructor(t=1,e=.4,i=12,o=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:o,arc:s},i=Math.floor(i),o=Math.floor(o);const a=[],r=[],c=[],l=[],h=new N,d=new N,u=new N;for(let f=0;f<=i;f++)for(let g=0;g<=o;g++){const M=g/o*s,m=f/i*Math.PI*2;d.x=(t+e*Math.cos(m))*Math.cos(M),d.y=(t+e*Math.cos(m))*Math.sin(M),d.z=e*Math.sin(m),r.push(d.x,d.y,d.z),h.x=t*Math.cos(M),h.y=t*Math.sin(M),u.subVectors(d,h).normalize(),c.push(u.x,u.y,u.z),l.push(g/o),l.push(f/i)}for(let f=1;f<=i;f++)for(let g=1;g<=o;g++){const M=(o+1)*f+g-1,m=(o+1)*(f-1)+g-1,p=(o+1)*(f-1)+g,S=(o+1)*f+g;a.push(M,m,S),a.push(m,p,S)}this.setIndex(a),this.setAttribute("position",new he(r,3)),this.setAttribute("normal",new he(c,3)),this.setAttribute("uv",new he(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ge(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class sd extends fo{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new le(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new le(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Uh,this.normalScale=new Dt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class np extends fo{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=_u,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ip extends fo{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class ad extends ve{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new le(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class rd extends ad{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.groundColor=new le(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ha=new Ee,Ml=new N,xl=new N;class op{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Dt(512,512),this.mapType=Un,this.map=null,this.mapPass=null,this.matrix=new Ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pc,this._frameExtents=new Dt(1,1),this._viewportCount=1,this._viewports=[new Te(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Ml.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ml),xl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(xl),e.updateMatrixWorld(),Ha.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ha,e.coordinateSystem,e.reversedDepth),e.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ha)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Uc extends qh{constructor(t=-1,e=1,i=1,o=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=o,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,o,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=o,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let s=i-t,a=i+t,r=o+e,c=o-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,r-=h*this.view.offsetY,c=r-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,r,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class sp extends op{constructor(){super(new Uc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Qr extends ad{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ve.DEFAULT_UP),this.updateMatrix(),this.target=new ve,this.shadow=new sp}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class ap extends sn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class rp{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function yl(n,t,e,i){const o=cp(i);switch(e){case Ih:return n*t;case yc:return n*t/o.components*o.byteLength;case bc:return n*t/o.components*o.byteLength;case Lh:return n*t*2/o.components*o.byteLength;case Sc:return n*t*2/o.components*o.byteLength;case Dh:return n*t*3/o.components*o.byteLength;case An:return n*t*4/o.components*o.byteLength;case wc:return n*t*4/o.components*o.byteLength;case Fs:case Bs:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case ks:case Vs:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case br:case wr:return Math.max(n,16)*Math.max(t,8)/4;case yr:case Sr:return Math.max(n,8)*Math.max(t,8)/2;case Er:case Tr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ar:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Pr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Cr:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Rr:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Ir:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case Dr:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case Lr:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Ur:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Nr:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case zr:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Or:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case Fr:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case Br:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case kr:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case Vr:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Hr:case Gr:case qr:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Wr:case Xr:return Math.ceil(n/4)*Math.ceil(t/4)*8;case jr:case Yr:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function cp(n){switch(n){case Un:case Ah:return{byteLength:1,components:1};case No:case Ph:case jo:return{byteLength:2,components:1};case Mc:case xc:return{byteLength:2,components:4};case Ai:case _c:case Gn:return{byteLength:4,components:1};case Ch:case Rh:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:vc}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=vc);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function cd(){let n=null,t=!1,e=null,i=null;function o(s,a){e(s,a),i=n.requestAnimationFrame(o)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(o),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function lp(n){const t=new WeakMap;function e(r,c){const l=r.array,h=r.usage,d=l.byteLength,u=n.createBuffer();n.bindBuffer(c,u),n.bufferData(c,l,h),r.onUploadCallback();let f;if(l instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=n.HALF_FLOAT;else if(l instanceof Uint16Array)r.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=n.SHORT;else if(l instanceof Uint32Array)f=n.UNSIGNED_INT;else if(l instanceof Int32Array)f=n.INT;else if(l instanceof Int8Array)f=n.BYTE;else if(l instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:r.version,size:d}}function i(r,c,l){const h=c.array,d=c.updateRanges;if(n.bindBuffer(l,r),d.length===0)n.bufferSubData(l,0,h);else{d.sort((f,g)=>f.start-g.start);let u=0;for(let f=1;f<d.length;f++){const g=d[u],M=d[f];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++u,d[u]=M)}d.length=u+1;for(let f=0,g=d.length;f<g;f++){const M=d[f];n.bufferSubData(l,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}c.clearUpdateRanges()}c.onUploadCallback()}function o(r){return r.isInterleavedBufferAttribute&&(r=r.data),t.get(r)}function s(r){r.isInterleavedBufferAttribute&&(r=r.data);const c=t.get(r);c&&(n.deleteBuffer(c.buffer),t.delete(r))}function a(r,c){if(r.isInterleavedBufferAttribute&&(r=r.data),r.isGLBufferAttribute){const h=t.get(r);(!h||h.version<r.version)&&t.set(r,{buffer:r.buffer,type:r.type,bytesPerElement:r.elementSize,version:r.version});return}const l=t.get(r);if(l===void 0)t.set(r,e(r,c));else if(l.version<r.version){if(l.size!==r.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(l.buffer,r,c),l.version=r.version}}return{get:o,remove:s,update:a}}var hp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,dp=`#ifdef USE_ALPHAHASH
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
#endif`,up=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gp=`#ifdef USE_AOMAP
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
#endif`,vp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_p=`#ifdef USE_BATCHING
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
#endif`,Mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Sp=`#ifdef USE_IRIDESCENCE
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
#endif`,wp=`#ifdef USE_BUMPMAP
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
#endif`,Ep=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Tp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ap=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Rp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ip=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Lp=`#define PI 3.141592653589793
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
} // validated`,Up=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Np=`vec3 transformedNormal = objectNormal;
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
#endif`,zp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Op=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,kp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hp=`#ifdef USE_ENVMAP
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
#endif`,Gp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,qp=`#ifdef USE_ENVMAP
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
#endif`,Wp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xp=`#ifdef USE_ENVMAP
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
#endif`,jp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$p=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jp=`#ifdef USE_GRADIENTMAP
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
}`,Kp=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qp=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,t0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,e0=`uniform bool receiveShadow;
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
#endif`,n0=`#ifdef USE_ENVMAP
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
#endif`,i0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,o0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,s0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,a0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,r0=`PhysicalMaterial material;
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
#endif`,c0=`struct PhysicalMaterial {
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
}`,l0=`
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
#endif`,h0=`#if defined( RE_IndirectDiffuse )
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
#endif`,d0=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,u0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,f0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,p0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,m0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,g0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,v0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,_0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,M0=`#if defined( USE_POINTS_UV )
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
#endif`,x0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,y0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,b0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,S0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,w0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,E0=`#ifdef USE_MORPHTARGETS
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
#endif`,T0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,A0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,P0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,C0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,R0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,D0=`#ifdef USE_NORMALMAP
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
#endif`,L0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,U0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,N0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,z0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,O0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,F0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,B0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,k0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,V0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,H0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,G0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,q0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,W0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,X0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,j0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Y0=`float getShadowMask() {
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
}`,$0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Z0=`#ifdef USE_SKINNING
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
#endif`,J0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,K0=`#ifdef USE_SKINNING
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
#endif`,Q0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,em=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,im=`#ifdef USE_TRANSMISSION
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
#endif`,om=`#ifdef USE_TRANSMISSION
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
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const lm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,hm=`uniform sampler2D t2D;
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
}`,dm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,um=`#ifdef ENVMAP_TYPE_CUBE
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
}`,fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,pm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mm=`#include <common>
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
}`,gm=`#if DEPTH_PACKING == 3200
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
}`,vm=`#define DISTANCE
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
}`,_m=`#define DISTANCE
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
}`,Mm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ym=`uniform float scale;
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
}`,bm=`uniform vec3 diffuse;
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
}`,Sm=`#include <common>
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
}`,wm=`uniform vec3 diffuse;
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
}`,Em=`#define LAMBERT
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
}`,Tm=`#define LAMBERT
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
}`,Am=`#define MATCAP
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
}`,Pm=`#define MATCAP
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
}`,Cm=`#define NORMAL
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
}`,Rm=`#define NORMAL
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
}`,Im=`#define PHONG
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
}`,Dm=`#define PHONG
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
}`,Lm=`#define STANDARD
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
}`,Um=`#define STANDARD
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
}`,Nm=`#define TOON
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
}`,zm=`#define TOON
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
}`,Om=`uniform float size;
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
}`,Fm=`uniform vec3 diffuse;
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
}`,Bm=`#include <common>
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
}`,km=`uniform vec3 color;
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
}`,Vm=`uniform float rotation;
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
}`,Hm=`uniform vec3 diffuse;
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
}`,oe={alphahash_fragment:hp,alphahash_pars_fragment:dp,alphamap_fragment:up,alphamap_pars_fragment:fp,alphatest_fragment:pp,alphatest_pars_fragment:mp,aomap_fragment:gp,aomap_pars_fragment:vp,batching_pars_vertex:_p,batching_vertex:Mp,begin_vertex:xp,beginnormal_vertex:yp,bsdfs:bp,iridescence_fragment:Sp,bumpmap_pars_fragment:wp,clipping_planes_fragment:Ep,clipping_planes_pars_fragment:Tp,clipping_planes_pars_vertex:Ap,clipping_planes_vertex:Pp,color_fragment:Cp,color_pars_fragment:Rp,color_pars_vertex:Ip,color_vertex:Dp,common:Lp,cube_uv_reflection_fragment:Up,defaultnormal_vertex:Np,displacementmap_pars_vertex:zp,displacementmap_vertex:Op,emissivemap_fragment:Fp,emissivemap_pars_fragment:Bp,colorspace_fragment:kp,colorspace_pars_fragment:Vp,envmap_fragment:Hp,envmap_common_pars_fragment:Gp,envmap_pars_fragment:qp,envmap_pars_vertex:Wp,envmap_physical_pars_fragment:n0,envmap_vertex:Xp,fog_vertex:jp,fog_pars_vertex:Yp,fog_fragment:$p,fog_pars_fragment:Zp,gradientmap_pars_fragment:Jp,lightmap_pars_fragment:Kp,lights_lambert_fragment:Qp,lights_lambert_pars_fragment:t0,lights_pars_begin:e0,lights_toon_fragment:i0,lights_toon_pars_fragment:o0,lights_phong_fragment:s0,lights_phong_pars_fragment:a0,lights_physical_fragment:r0,lights_physical_pars_fragment:c0,lights_fragment_begin:l0,lights_fragment_maps:h0,lights_fragment_end:d0,logdepthbuf_fragment:u0,logdepthbuf_pars_fragment:f0,logdepthbuf_pars_vertex:p0,logdepthbuf_vertex:m0,map_fragment:g0,map_pars_fragment:v0,map_particle_fragment:_0,map_particle_pars_fragment:M0,metalnessmap_fragment:x0,metalnessmap_pars_fragment:y0,morphinstance_vertex:b0,morphcolor_vertex:S0,morphnormal_vertex:w0,morphtarget_pars_vertex:E0,morphtarget_vertex:T0,normal_fragment_begin:A0,normal_fragment_maps:P0,normal_pars_fragment:C0,normal_pars_vertex:R0,normal_vertex:I0,normalmap_pars_fragment:D0,clearcoat_normal_fragment_begin:L0,clearcoat_normal_fragment_maps:U0,clearcoat_pars_fragment:N0,iridescence_pars_fragment:z0,opaque_fragment:O0,packing:F0,premultiplied_alpha_fragment:B0,project_vertex:k0,dithering_fragment:V0,dithering_pars_fragment:H0,roughnessmap_fragment:G0,roughnessmap_pars_fragment:q0,shadowmap_pars_fragment:W0,shadowmap_pars_vertex:X0,shadowmap_vertex:j0,shadowmask_pars_fragment:Y0,skinbase_vertex:$0,skinning_pars_vertex:Z0,skinning_vertex:J0,skinnormal_vertex:K0,specularmap_fragment:Q0,specularmap_pars_fragment:tm,tonemapping_fragment:em,tonemapping_pars_fragment:nm,transmission_fragment:im,transmission_pars_fragment:om,uv_pars_fragment:sm,uv_pars_vertex:am,uv_vertex:rm,worldpos_vertex:cm,background_vert:lm,background_frag:hm,backgroundCube_vert:dm,backgroundCube_frag:um,cube_vert:fm,cube_frag:pm,depth_vert:mm,depth_frag:gm,distanceRGBA_vert:vm,distanceRGBA_frag:_m,equirect_vert:Mm,equirect_frag:xm,linedashed_vert:ym,linedashed_frag:bm,meshbasic_vert:Sm,meshbasic_frag:wm,meshlambert_vert:Em,meshlambert_frag:Tm,meshmatcap_vert:Am,meshmatcap_frag:Pm,meshnormal_vert:Cm,meshnormal_frag:Rm,meshphong_vert:Im,meshphong_frag:Dm,meshphysical_vert:Lm,meshphysical_frag:Um,meshtoon_vert:Nm,meshtoon_frag:zm,points_vert:Om,points_frag:Fm,shadow_vert:Bm,shadow_frag:km,sprite_vert:Vm,sprite_frag:Hm},zt={common:{diffuse:{value:new le(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ie}},envmap:{envMap:{value:null},envMapRotation:{value:new ie},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ie}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ie}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ie},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ie},normalScale:{value:new Dt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ie},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ie}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ie}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ie}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new le(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new le(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0},uvTransform:{value:new ie}},sprite:{diffuse:{value:new le(16777215)},opacity:{value:1},center:{value:new Dt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ie},alphaMap:{value:null},alphaMapTransform:{value:new ie},alphaTest:{value:0}}},Pn={basic:{uniforms:je([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.fog]),vertexShader:oe.meshbasic_vert,fragmentShader:oe.meshbasic_frag},lambert:{uniforms:je([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new le(0)}}]),vertexShader:oe.meshlambert_vert,fragmentShader:oe.meshlambert_frag},phong:{uniforms:je([zt.common,zt.specularmap,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,zt.lights,{emissive:{value:new le(0)},specular:{value:new le(1118481)},shininess:{value:30}}]),vertexShader:oe.meshphong_vert,fragmentShader:oe.meshphong_frag},standard:{uniforms:je([zt.common,zt.envmap,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.roughnessmap,zt.metalnessmap,zt.fog,zt.lights,{emissive:{value:new le(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag},toon:{uniforms:je([zt.common,zt.aomap,zt.lightmap,zt.emissivemap,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.gradientmap,zt.fog,zt.lights,{emissive:{value:new le(0)}}]),vertexShader:oe.meshtoon_vert,fragmentShader:oe.meshtoon_frag},matcap:{uniforms:je([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,zt.fog,{matcap:{value:null}}]),vertexShader:oe.meshmatcap_vert,fragmentShader:oe.meshmatcap_frag},points:{uniforms:je([zt.points,zt.fog]),vertexShader:oe.points_vert,fragmentShader:oe.points_frag},dashed:{uniforms:je([zt.common,zt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:oe.linedashed_vert,fragmentShader:oe.linedashed_frag},depth:{uniforms:je([zt.common,zt.displacementmap]),vertexShader:oe.depth_vert,fragmentShader:oe.depth_frag},normal:{uniforms:je([zt.common,zt.bumpmap,zt.normalmap,zt.displacementmap,{opacity:{value:1}}]),vertexShader:oe.meshnormal_vert,fragmentShader:oe.meshnormal_frag},sprite:{uniforms:je([zt.sprite,zt.fog]),vertexShader:oe.sprite_vert,fragmentShader:oe.sprite_frag},background:{uniforms:{uvTransform:{value:new ie},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:oe.background_vert,fragmentShader:oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ie}},vertexShader:oe.backgroundCube_vert,fragmentShader:oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:oe.cube_vert,fragmentShader:oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:oe.equirect_vert,fragmentShader:oe.equirect_frag},distanceRGBA:{uniforms:je([zt.common,zt.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:oe.distanceRGBA_vert,fragmentShader:oe.distanceRGBA_frag},shadow:{uniforms:je([zt.lights,zt.fog,{color:{value:new le(0)},opacity:{value:1}}]),vertexShader:oe.shadow_vert,fragmentShader:oe.shadow_frag}};Pn.physical={uniforms:je([Pn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ie},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ie},clearcoatNormalScale:{value:new Dt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ie},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ie},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ie},sheen:{value:0},sheenColor:{value:new le(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ie},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ie},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ie},transmissionSamplerSize:{value:new Dt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ie},attenuationDistance:{value:0},attenuationColor:{value:new le(0)},specularColor:{value:new le(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ie},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ie},anisotropyVector:{value:new Dt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ie}}]),vertexShader:oe.meshphysical_vert,fragmentShader:oe.meshphysical_frag};const Cs={r:0,b:0,g:0},vi=new Yn,Gm=new Ee;function qm(n,t,e,i,o,s,a){const r=new le(0);let c=s===!0?0:1,l,h,d=null,u=0,f=null;function g(x){let y=x.isScene===!0?x.background:null;return y&&y.isTexture&&(y=(x.backgroundBlurriness>0?e:t).get(y)),y}function M(x){let y=!1;const A=g(x);A===null?p(r,c):A&&A.isColor&&(p(A,1),y=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(x,y){const A=g(y);A&&(A.isCubeTexture||A.mapping===sa)?(h===void 0&&(h=new v(new O(1,1,1),new li({name:"BackgroundCubeMaterial",uniforms:ao(Pn.backgroundCube.uniforms),vertexShader:Pn.backgroundCube.vertexShader,fragmentShader:Pn.backgroundCube.fragmentShader,side:Qe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,C,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(h)),vi.copy(y.backgroundRotation),vi.x*=-1,vi.y*=-1,vi.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),h.material.uniforms.envMap.value=A,h.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gm.makeRotationFromEuler(vi)),h.material.toneMapped=me.getTransfer(A.colorSpace)!==xe,(d!==A||u!==A.version||f!==n.toneMapping)&&(h.material.needsUpdate=!0,d=A,u=A.version,f=n.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new v(new ze(2,2),new li({name:"BackgroundMaterial",uniforms:ao(Pn.background.uniforms),vertexShader:Pn.background.vertexShader,fragmentShader:Pn.background.fragmentShader,side:jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,l.material.toneMapped=me.getTransfer(A.colorSpace)!==xe,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(d!==A||u!==A.version||f!==n.toneMapping)&&(l.material.needsUpdate=!0,d=A,u=A.version,f=n.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,y){x.getRGB(Cs,Gh(n)),i.buffers.color.setClear(Cs.r,Cs.g,Cs.b,y,a)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(x,y=1){r.set(x),c=y,p(r,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(r,c)},render:M,addToRenderList:m,dispose:S}}function Wm(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},o=u(null);let s=o,a=!1;function r(b,L,z,B,H){let W=!1;const q=d(B,z,L);s!==q&&(s=q,l(s.object)),W=f(b,B,z,H),W&&g(b,B,z,H),H!==null&&t.update(H,n.ELEMENT_ARRAY_BUFFER),(W||a)&&(a=!1,y(b,L,z,B),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(H).buffer))}function c(){return n.createVertexArray()}function l(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function d(b,L,z){const B=z.wireframe===!0;let H=i[b.id];H===void 0&&(H={},i[b.id]=H);let W=H[L.id];W===void 0&&(W={},H[L.id]=W);let q=W[B];return q===void 0&&(q=u(c()),W[B]=q),q}function u(b){const L=[],z=[],B=[];for(let H=0;H<e;H++)L[H]=0,z[H]=0,B[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:z,attributeDivisors:B,object:b,attributes:{},index:null}}function f(b,L,z,B){const H=s.attributes,W=L.attributes;let q=0;const tt=z.getAttributes();for(const Y in tt)if(tt[Y].location>=0){const j=H[Y];let mt=W[Y];if(mt===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(mt=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(mt=b.instanceColor)),j===void 0||j.attribute!==mt||mt&&j.data!==mt.data)return!0;q++}return s.attributesNum!==q||s.index!==B}function g(b,L,z,B){const H={},W=L.attributes;let q=0;const tt=z.getAttributes();for(const Y in tt)if(tt[Y].location>=0){let j=W[Y];j===void 0&&(Y==="instanceMatrix"&&b.instanceMatrix&&(j=b.instanceMatrix),Y==="instanceColor"&&b.instanceColor&&(j=b.instanceColor));const mt={};mt.attribute=j,j&&j.data&&(mt.data=j.data),H[Y]=mt,q++}s.attributes=H,s.attributesNum=q,s.index=B}function M(){const b=s.newAttributes;for(let L=0,z=b.length;L<z;L++)b[L]=0}function m(b){p(b,0)}function p(b,L){const z=s.newAttributes,B=s.enabledAttributes,H=s.attributeDivisors;z[b]=1,B[b]===0&&(n.enableVertexAttribArray(b),B[b]=1),H[b]!==L&&(n.vertexAttribDivisor(b,L),H[b]=L)}function S(){const b=s.newAttributes,L=s.enabledAttributes;for(let z=0,B=L.length;z<B;z++)L[z]!==b[z]&&(n.disableVertexAttribArray(z),L[z]=0)}function x(b,L,z,B,H,W,q){q===!0?n.vertexAttribIPointer(b,L,z,H,W):n.vertexAttribPointer(b,L,z,B,H,W)}function y(b,L,z,B){M();const H=B.attributes,W=z.getAttributes(),q=L.defaultAttributeValues;for(const tt in W){const Y=W[tt];if(Y.location>=0){let st=H[tt];if(st===void 0&&(tt==="instanceMatrix"&&b.instanceMatrix&&(st=b.instanceMatrix),tt==="instanceColor"&&b.instanceColor&&(st=b.instanceColor)),st!==void 0){const j=st.normalized,mt=st.itemSize,vt=t.get(st);if(vt===void 0)continue;const At=vt.buffer,V=vt.type,ft=vt.bytesPerElement,K=V===n.INT||V===n.UNSIGNED_INT||st.gpuType===_c;if(st.isInterleavedBufferAttribute){const rt=st.data,Pt=rt.stride,Ot=st.offset;if(rt.isInstancedInterleavedBuffer){for(let Ut=0;Ut<Y.locationSize;Ut++)p(Y.location+Ut,rt.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=rt.meshPerAttribute*rt.count)}else for(let Ut=0;Ut<Y.locationSize;Ut++)m(Y.location+Ut);n.bindBuffer(n.ARRAY_BUFFER,At);for(let Ut=0;Ut<Y.locationSize;Ut++)x(Y.location+Ut,mt/Y.locationSize,V,j,Pt*ft,(Ot+mt/Y.locationSize*Ut)*ft,K)}else{if(st.isInstancedBufferAttribute){for(let rt=0;rt<Y.locationSize;rt++)p(Y.location+rt,st.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let rt=0;rt<Y.locationSize;rt++)m(Y.location+rt);n.bindBuffer(n.ARRAY_BUFFER,At);for(let rt=0;rt<Y.locationSize;rt++)x(Y.location+rt,mt/Y.locationSize,V,j,mt*ft,mt/Y.locationSize*rt*ft,K)}}else if(q!==void 0){const j=q[tt];if(j!==void 0)switch(j.length){case 2:n.vertexAttrib2fv(Y.location,j);break;case 3:n.vertexAttrib3fv(Y.location,j);break;case 4:n.vertexAttrib4fv(Y.location,j);break;default:n.vertexAttrib1fv(Y.location,j)}}}}S()}function A(){D();for(const b in i){const L=i[b];for(const z in L){const B=L[z];for(const H in B)h(B[H].object),delete B[H];delete L[z]}delete i[b]}}function P(b){if(i[b.id]===void 0)return;const L=i[b.id];for(const z in L){const B=L[z];for(const H in B)h(B[H].object),delete B[H];delete L[z]}delete i[b.id]}function C(b){for(const L in i){const z=i[L];if(z[b.id]===void 0)continue;const B=z[b.id];for(const H in B)h(B[H].object),delete B[H];delete z[b.id]}}function D(){E(),a=!0,s!==o&&(s=o,l(s.object))}function E(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:r,reset:D,resetDefaultState:E,dispose:A,releaseStatesOfGeometry:P,releaseStatesOfProgram:C,initAttributes:M,enableAttribute:m,disableUnusedAttributes:S}}function Xm(n,t,e){let i;function o(l){i=l}function s(l,h){n.drawArrays(i,l,h),e.update(h,i,1)}function a(l,h,d){d!==0&&(n.drawArraysInstanced(i,l,h,d),e.update(h,i,d))}function r(l,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,h,0,d);let f=0;for(let g=0;g<d;g++)f+=h[g];e.update(f,i,1)}function c(l,h,d,u){if(d===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)a(l[g],h[g],u[g]);else{f.multiDrawArraysInstancedWEBGL(i,l,0,h,0,u,0,d);let g=0;for(let M=0;M<d;M++)g+=h[M]*u[M];e.update(g,i,1)}}this.setMode=o,this.render=s,this.renderInstances=a,this.renderMultiDraw=r,this.renderMultiDrawInstances=c}function jm(n,t,e,i){let o;function s(){if(o!==void 0)return o;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");o=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function a(C){return!(C!==An&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function r(C){const D=C===jo&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==Un&&i.convert(C)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Gn&&!D)}function c(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=g>0,P=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:r,precision:l,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:A,maxSamples:P}}function Ym(n){const t=this;let e=null,i=0,o=!1,s=!1;const a=new xi,r=new ie,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||i!==0||o;return o=u,i=d.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const g=d.clippingPlanes,M=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!o||g===null||g.length===0||s&&!m)s?h(null):l();else{const S=s?0:i,x=S*4;let y=p.clippingState||null;c.value=y,y=h(g,u,x,f);for(let A=0;A!==x;++A)y[A]=e[A];p.clippingState=y,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(d,u,f,g){const M=d!==null?d.length:0;let m=null;if(M!==0){if(m=c.value,g!==!0||m===null){const p=f+M*4,S=u.matrixWorldInverse;r.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let x=0,y=f;x!==M;++x,y+=4)a.copy(d[x]).applyMatrix4(S,r),a.normal.toArray(m,y),m[y+3]=a.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,m}}function $m(n){let t=new WeakMap;function e(a,r){return r===_r?a.mapping=io:r===Mr&&(a.mapping=oo),a}function i(a){if(a&&a.isTexture){const r=a.mapping;if(r===_r||r===Mr)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new mf(c.height);return l.fromEquirectangularTexture(n,a),t.set(a,l),a.addEventListener("dispose",o),e(l.texture,a.mapping)}else return null}}return a}function o(a){const r=a.target;r.removeEventListener("dispose",o);const c=t.get(r);c!==void 0&&(t.delete(r),c.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}const Ji=4,bl=[.125,.215,.35,.446,.526,.582],Si=20,Ga=new Uc,Sl=new le;let qa=null,Wa=0,Xa=0,ja=!1;const yi=(1+Math.sqrt(5))/2,Wi=1/yi,wl=[new N(-yi,Wi,0),new N(yi,Wi,0),new N(-Wi,0,yi),new N(Wi,0,yi),new N(0,yi,-Wi),new N(0,yi,Wi),new N(-1,1,-1),new N(1,1,-1),new N(-1,1,1),new N(1,1,1)],Zm=new N;class El{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,o=100,s={}){const{size:a=256,position:r=Zm}=s;qa=this._renderer.getRenderTarget(),Wa=this._renderer.getActiveCubeFace(),Xa=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,i,o,c,r),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Al(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(qa,Wa,Xa),this._renderer.xr.enabled=ja,t.scissorTest=!1,Rs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===io||t.mapping===oo?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),qa=this._renderer.getRenderTarget(),Wa=this._renderer.getActiveCubeFace(),Xa=this._renderer.getActiveMipmapLevel(),ja=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Cn,minFilter:Cn,generateMipmaps:!1,type:jo,format:An,colorSpace:so,depthBuffer:!1},o=Tl(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Tl(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jm(s)),this._blurMaterial=Km(s,t,e)}return o}_compileMaterial(t){const e=new v(this._lodPlanes[0],t);this._renderer.compile(e,Ga)}_sceneToCubeUV(t,e,i,o,s){const c=new sn(90,1,e,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(Sl),d.toneMapping=ci,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(o),d.clearDepth(),d.setRenderTarget(null));const M=new ra({name:"PMREM.Background",side:Qe,depthWrite:!1,depthTest:!1}),m=new v(new O,M);let p=!1;const S=t.background;S?S.isColor&&(M.color.copy(S),t.background=null,p=!0):(M.color.copy(Sl),p=!0);for(let x=0;x<6;x++){const y=x%3;y===0?(c.up.set(0,l[x],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x+h[x],s.y,s.z)):y===1?(c.up.set(0,0,l[x]),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y+h[x],s.z)):(c.up.set(0,l[x],0),c.position.set(s.x,s.y,s.z),c.lookAt(s.x,s.y,s.z+h[x]));const A=this._cubeSize;Rs(o,y*A,x>2?A:0,A,A),d.setRenderTarget(o),p&&d.render(m,c),d.render(t,c)}m.geometry.dispose(),m.material.dispose(),d.toneMapping=f,d.autoClear=u,t.background=S}_textureToCubeUV(t,e){const i=this._renderer,o=t.mapping===io||t.mapping===oo;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Al());const s=o?this._cubemapMaterial:this._equirectMaterial,a=new v(this._lodPlanes[0],s),r=s.uniforms;r.envMap.value=t;const c=this._cubeSize;Rs(e,0,0,3*c,2*c),i.setRenderTarget(e),i.render(a,Ga)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const o=this._lodPlanes.length;for(let s=1;s<o;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),r=wl[(o-s-1)%wl.length];this._blur(t,s-1,s,a,r)}e.autoClear=i}_blur(t,e,i,o,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,o,"latitudinal",s),this._halfBlur(a,t,i,i,o,"longitudinal",s)}_halfBlur(t,e,i,o,s,a,r){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new v(this._lodPlanes[o],l),u=l.uniforms,f=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Si-1),M=s/g,m=isFinite(s)?1+Math.floor(h*M):Si;m>Si&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);const p=[];let S=0;for(let C=0;C<Si;++C){const D=C/M,E=Math.exp(-D*D/2);p.push(E),C===0?S+=E:C<m&&(S+=2*E)}for(let C=0;C<p.length;C++)p[C]=p[C]/S;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=p,u.latitudinal.value=a==="latitudinal",r&&(u.poleAxis.value=r);const{_lodMax:x}=this;u.dTheta.value=g,u.mipInt.value=x-i;const y=this._sizeLods[o],A=3*y*(o>x-Ji?o-x+Ji:0),P=4*(this._cubeSize-y);Rs(e,A,P,3*y,2*y),c.setRenderTarget(e),c.render(d,Ga)}}function Jm(n){const t=[],e=[],i=[];let o=n;const s=n-Ji+1+bl.length;for(let a=0;a<s;a++){const r=Math.pow(2,o);e.push(r);let c=1/r;a>n-Ji?c=bl[a-n+Ji-1]:a===0&&(c=0),i.push(c);const l=1/(r-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],f=6,g=6,M=3,m=2,p=1,S=new Float32Array(M*g*f),x=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let P=0;P<f;P++){const C=P%3*2/3-1,D=P>2?0:-1,E=[C,D,0,C+2/3,D,0,C+2/3,D+1,0,C,D,0,C+2/3,D+1,0,C,D+1,0];S.set(E,M*g*P),x.set(u,m*g*P);const b=[P,P,P,P,P,P];y.set(b,p*g*P)}const A=new Le;A.setAttribute("position",new Ln(S,M)),A.setAttribute("uv",new Ln(x,m)),A.setAttribute("faceIndex",new Ln(y,p)),t.push(A),o>Ji&&o--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function Tl(n,t,e){const i=new Pi(n,t,e);return i.texture.mapping=sa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Rs(n,t,e,i,o){n.viewport.set(t,e,i,o),n.scissor.set(t,e,i,o)}function Km(n,t,e){const i=new Float32Array(Si),o=new N(0,1,0);return new li({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Nc(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Al(){return new li({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Nc(),fragmentShader:`

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
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Pl(){return new li({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Nc(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ri,depthTest:!1,depthWrite:!1})}function Nc(){return`

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
	`}function Qm(n){let t=new WeakMap,e=null;function i(r){if(r&&r.isTexture){const c=r.mapping,l=c===_r||c===Mr,h=c===io||c===oo;if(l||h){let d=t.get(r);const u=d!==void 0?d.texture.pmremVersion:0;if(r.isRenderTargetTexture&&r.pmremVersion!==u)return e===null&&(e=new El(n)),d=l?e.fromEquirectangular(r,d):e.fromCubemap(r,d),d.texture.pmremVersion=r.pmremVersion,t.set(r,d),d.texture;if(d!==void 0)return d.texture;{const f=r.image;return l&&f&&f.height>0||h&&f&&o(f)?(e===null&&(e=new El(n)),d=l?e.fromEquirectangular(r):e.fromCubemap(r),d.texture.pmremVersion=r.pmremVersion,t.set(r,d),r.addEventListener("dispose",s),d.texture):null}}}return r}function o(r){let c=0;const l=6;for(let h=0;h<l;h++)r[h]!==void 0&&c++;return c===l}function s(r){const c=r.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function tg(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let o;switch(i){case"WEBGL_depth_texture":o=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=n.getExtension(i)}return t[i]=o,o}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const o=e(i);return o===null&&ko("THREE.WebGLRenderer: "+i+" extension not supported."),o}}}function eg(n,t,e,i){const o={},s=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",a),delete o[u.id];const f=s.get(u);f&&(t.remove(f),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function r(d,u){return o[u.id]===!0||(u.addEventListener("dispose",a),o[u.id]=!0,e.memory.geometries++),u}function c(d){const u=d.attributes;for(const f in u)t.update(u[f],n.ARRAY_BUFFER)}function l(d){const u=[],f=d.index,g=d.attributes.position;let M=0;if(f!==null){const S=f.array;M=f.version;for(let x=0,y=S.length;x<y;x+=3){const A=S[x+0],P=S[x+1],C=S[x+2];u.push(A,P,P,C,C,A)}}else if(g!==void 0){const S=g.array;M=g.version;for(let x=0,y=S.length/3-1;x<y;x+=3){const A=x+0,P=x+1,C=x+2;u.push(A,P,P,C,C,A)}}else return;const m=new(zh(u)?Hh:Vh)(u,1);m.version=M;const p=s.get(d);p&&t.remove(p),s.set(d,m)}function h(d){const u=s.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&l(d)}else l(d);return s.get(d)}return{get:r,update:c,getWireframeAttribute:h}}function ng(n,t,e){let i;function o(u){i=u}let s,a;function r(u){s=u.type,a=u.bytesPerElement}function c(u,f){n.drawElements(i,f,s,u*a),e.update(f,i,1)}function l(u,f,g){g!==0&&(n.drawElementsInstanced(i,f,s,u*a,g),e.update(f,i,g))}function h(u,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,s,u,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,i,1)}function d(u,f,g,M){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<u.length;p++)l(u[p]/a,f[p],M[p]);else{m.multiDrawElementsInstancedWEBGL(i,f,0,s,u,0,M,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S]*M[S];e.update(p,i,1)}}this.setMode=o,this.setIndex=r,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function ig(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,r){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=r*(s/3);break;case n.LINES:e.lines+=r*(s/2);break;case n.LINE_STRIP:e.lines+=r*(s-1);break;case n.LINE_LOOP:e.lines+=r*s;break;case n.POINTS:e.points+=r*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function o(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:o,update:i}}function og(n,t,e){const i=new WeakMap,o=new Te;function s(a,r,c){const l=a.morphTargetInfluences,h=r.morphAttributes.position||r.morphAttributes.normal||r.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(r);if(u===void 0||u.count!==d){let b=function(){D.dispose(),i.delete(r),r.removeEventListener("dispose",b)};var f=b;u!==void 0&&u.texture.dispose();const g=r.morphAttributes.position!==void 0,M=r.morphAttributes.normal!==void 0,m=r.morphAttributes.color!==void 0,p=r.morphAttributes.position||[],S=r.morphAttributes.normal||[],x=r.morphAttributes.color||[];let y=0;g===!0&&(y=1),M===!0&&(y=2),m===!0&&(y=3);let A=r.attributes.position.count*y,P=1;A>t.maxTextureSize&&(P=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);const C=new Float32Array(A*P*4*d),D=new Oh(C,A,P,d);D.type=Gn,D.needsUpdate=!0;const E=y*4;for(let L=0;L<d;L++){const z=p[L],B=S[L],H=x[L],W=A*P*4*L;for(let q=0;q<z.count;q++){const tt=q*E;g===!0&&(o.fromBufferAttribute(z,q),C[W+tt+0]=o.x,C[W+tt+1]=o.y,C[W+tt+2]=o.z,C[W+tt+3]=0),M===!0&&(o.fromBufferAttribute(B,q),C[W+tt+4]=o.x,C[W+tt+5]=o.y,C[W+tt+6]=o.z,C[W+tt+7]=0),m===!0&&(o.fromBufferAttribute(H,q),C[W+tt+8]=o.x,C[W+tt+9]=o.y,C[W+tt+10]=o.z,C[W+tt+11]=H.itemSize===4?o.w:1)}}u={count:d,texture:D,size:new Dt(A,P)},i.set(r,u),r.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const M=r.morphTargetsRelative?1:1-g;c.getUniforms().setValue(n,"morphTargetBaseInfluence",M),c.getUniforms().setValue(n,"morphTargetInfluences",l)}c.getUniforms().setValue(n,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:s}}function sg(n,t,e,i){let o=new WeakMap;function s(c){const l=i.render.frame,h=c.geometry,d=t.get(c,h);if(o.get(d)!==l&&(t.update(d),o.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",r)===!1&&c.addEventListener("dispose",r),o.get(c)!==l&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),o.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;o.get(u)!==l&&(u.update(),o.set(u,l))}return d}function a(){o=new WeakMap}function r(c){const l=c.target;l.removeEventListener("dispose",r),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}const ld=new ke,Cl=new $h(1,1),hd=new Oh,dd=new Ju,ud=new Wh,Rl=[],Il=[],Dl=new Float32Array(16),Ll=new Float32Array(9),Ul=new Float32Array(4);function po(n,t,e){const i=n[0];if(i<=0||i>0)return n;const o=t*e;let s=Rl[o];if(s===void 0&&(s=new Float32Array(o),Rl[o]=s),t!==0){i.toArray(s,0);for(let a=1,r=0;a!==t;++a)r+=e,n[a].toArray(s,r)}return s}function Re(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function Ie(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function ha(n,t){let e=Il[t];e===void 0&&(e=new Int32Array(t),Il[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function ag(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function rg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2fv(this.addr,t),Ie(e,t)}}function cg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;n.uniform3fv(this.addr,t),Ie(e,t)}}function lg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4fv(this.addr,t),Ie(e,t)}}function hg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),Ie(e,t)}else{if(Re(e,i))return;Ul.set(i),n.uniformMatrix2fv(this.addr,!1,Ul),Ie(e,i)}}function dg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),Ie(e,t)}else{if(Re(e,i))return;Ll.set(i),n.uniformMatrix3fv(this.addr,!1,Ll),Ie(e,i)}}function ug(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(Re(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),Ie(e,t)}else{if(Re(e,i))return;Dl.set(i),n.uniformMatrix4fv(this.addr,!1,Dl),Ie(e,i)}}function fg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function pg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2iv(this.addr,t),Ie(e,t)}}function mg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3iv(this.addr,t),Ie(e,t)}}function gg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4iv(this.addr,t),Ie(e,t)}}function vg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function _g(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;n.uniform2uiv(this.addr,t),Ie(e,t)}}function Mg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;n.uniform3uiv(this.addr,t),Ie(e,t)}}function xg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;n.uniform4uiv(this.addr,t),Ie(e,t)}}function yg(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o);let s;this.type===n.SAMPLER_2D_SHADOW?(Cl.compareFunction=Nh,s=Cl):s=ld,e.setTexture2D(t||s,o)}function bg(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTexture3D(t||dd,o)}function Sg(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTextureCube(t||ud,o)}function wg(n,t,e){const i=this.cache,o=e.allocateTextureUnit();i[0]!==o&&(n.uniform1i(this.addr,o),i[0]=o),e.setTexture2DArray(t||hd,o)}function Eg(n){switch(n){case 5126:return ag;case 35664:return rg;case 35665:return cg;case 35666:return lg;case 35674:return hg;case 35675:return dg;case 35676:return ug;case 5124:case 35670:return fg;case 35667:case 35671:return pg;case 35668:case 35672:return mg;case 35669:case 35673:return gg;case 5125:return vg;case 36294:return _g;case 36295:return Mg;case 36296:return xg;case 35678:case 36198:case 36298:case 36306:case 35682:return yg;case 35679:case 36299:case 36307:return bg;case 35680:case 36300:case 36308:case 36293:return Sg;case 36289:case 36303:case 36311:case 36292:return wg}}function Tg(n,t){n.uniform1fv(this.addr,t)}function Ag(n,t){const e=po(t,this.size,2);n.uniform2fv(this.addr,e)}function Pg(n,t){const e=po(t,this.size,3);n.uniform3fv(this.addr,e)}function Cg(n,t){const e=po(t,this.size,4);n.uniform4fv(this.addr,e)}function Rg(n,t){const e=po(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function Ig(n,t){const e=po(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function Dg(n,t){const e=po(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function Lg(n,t){n.uniform1iv(this.addr,t)}function Ug(n,t){n.uniform2iv(this.addr,t)}function Ng(n,t){n.uniform3iv(this.addr,t)}function zg(n,t){n.uniform4iv(this.addr,t)}function Og(n,t){n.uniform1uiv(this.addr,t)}function Fg(n,t){n.uniform2uiv(this.addr,t)}function Bg(n,t){n.uniform3uiv(this.addr,t)}function kg(n,t){n.uniform4uiv(this.addr,t)}function Vg(n,t,e){const i=this.cache,o=t.length,s=ha(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTexture2D(t[a]||ld,s[a])}function Hg(n,t,e){const i=this.cache,o=t.length,s=ha(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTexture3D(t[a]||dd,s[a])}function Gg(n,t,e){const i=this.cache,o=t.length,s=ha(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTextureCube(t[a]||ud,s[a])}function qg(n,t,e){const i=this.cache,o=t.length,s=ha(e,o);Re(i,s)||(n.uniform1iv(this.addr,s),Ie(i,s));for(let a=0;a!==o;++a)e.setTexture2DArray(t[a]||hd,s[a])}function Wg(n){switch(n){case 5126:return Tg;case 35664:return Ag;case 35665:return Pg;case 35666:return Cg;case 35674:return Rg;case 35675:return Ig;case 35676:return Dg;case 5124:case 35670:return Lg;case 35667:case 35671:return Ug;case 35668:case 35672:return Ng;case 35669:case 35673:return zg;case 5125:return Og;case 36294:return Fg;case 36295:return Bg;case 36296:return kg;case 35678:case 36198:case 36298:case 36306:case 35682:return Vg;case 35679:case 36299:case 36307:return Hg;case 35680:case 36300:case 36308:case 36293:return Gg;case 36289:case 36303:case 36311:case 36292:return qg}}class Xg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Eg(e.type)}}class jg{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Wg(e.type)}}class Yg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const o=this.seq;for(let s=0,a=o.length;s!==a;++s){const r=o[s];r.setValue(t,e[r.id],i)}}}const Ya=/(\w+)(\])?(\[|\.)?/g;function Nl(n,t){n.seq.push(t),n.map[t.id]=t}function $g(n,t,e){const i=n.name,o=i.length;for(Ya.lastIndex=0;;){const s=Ya.exec(i),a=Ya.lastIndex;let r=s[1];const c=s[2]==="]",l=s[3];if(c&&(r=r|0),l===void 0||l==="["&&a+2===o){Nl(e,l===void 0?new Xg(r,n,t):new jg(r,n,t));break}else{let d=e.map[r];d===void 0&&(d=new Yg(r),Nl(e,d)),e=d}}}class Hs{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const s=t.getActiveUniform(e,o),a=t.getUniformLocation(e,s.name);$g(s,a,this)}}setValue(t,e,i,o){const s=this.map[e];s!==void 0&&s.setValue(t,i,o)}setOptional(t,e,i){const o=e[i];o!==void 0&&this.setValue(t,i,o)}static upload(t,e,i,o){for(let s=0,a=e.length;s!==a;++s){const r=e[s],c=i[r.id];c.needsUpdate!==!1&&r.setValue(t,c.value,o)}}static seqWithValue(t,e){const i=[];for(let o=0,s=t.length;o!==s;++o){const a=t[o];a.id in e&&i.push(a)}return i}}function zl(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const Zg=37297;let Jg=0;function Kg(n,t){const e=n.split(`
`),i=[],o=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=o;a<s;a++){const r=a+1;i.push(`${r===t?">":" "} ${r}: ${e[a]}`)}return i.join(`
`)}const Ol=new ie;function Qg(n){me._getMatrix(Ol,me.workingColorSpace,n);const t=`mat3( ${Ol.elements.map(e=>e.toFixed(4))} )`;switch(me.getTransfer(n)){case $s:return[t,"LinearTransferOETF"];case xe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function Fl(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),s=(n.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const r=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+Kg(n.getShaderSource(t),r)}else return s}function t1(n,t){const e=Qg(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function e1(n,t){let e;switch(t){case hu:e="Linear";break;case du:e="Reinhard";break;case uu:e="Cineon";break;case fu:e="ACESFilmic";break;case mu:e="AgX";break;case gu:e="Neutral";break;case pu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Is=new N;function n1(){me.getLuminanceCoefficients(Is);const n=Is.x.toFixed(4),t=Is.y.toFixed(4),e=Is.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function i1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Po).join(`
`)}function o1(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function s1(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let o=0;o<i;o++){const s=n.getActiveAttrib(t,o),a=s.name;let r=1;s.type===n.FLOAT_MAT2&&(r=2),s.type===n.FLOAT_MAT3&&(r=3),s.type===n.FLOAT_MAT4&&(r=4),e[a]={type:s.type,location:n.getAttribLocation(t,a),locationSize:r}}return e}function Po(n){return n!==""}function Bl(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function kl(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const a1=/^[ \t]*#include +<([\w\d./]+)>/gm;function tc(n){return n.replace(a1,c1)}const r1=new Map;function c1(n,t){let e=oe[t];if(e===void 0){const i=r1.get(t);if(i!==void 0)e=oe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return tc(e)}const l1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vl(n){return n.replace(l1,h1)}function h1(n,t,e,i){let o="";for(let s=parseInt(t);s<parseInt(e);s++)o+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return o}function Hl(n){let t=`precision ${n.precision} float;
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
#define LOW_PRECISION`),t}function d1(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Sh?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===wh?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Vn&&(t="SHADOWMAP_TYPE_VSM"),t}function u1(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case io:case oo:t="ENVMAP_TYPE_CUBE";break;case sa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function f1(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case oo:t="ENVMAP_MODE_REFRACTION";break}return t}function p1(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Eh:t="ENVMAP_BLENDING_MULTIPLY";break;case cu:t="ENVMAP_BLENDING_MIX";break;case lu:t="ENVMAP_BLENDING_ADD";break}return t}function m1(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function g1(n,t,e,i){const o=n.getContext(),s=e.defines;let a=e.vertexShader,r=e.fragmentShader;const c=d1(e),l=u1(e),h=f1(e),d=p1(e),u=m1(e),f=i1(e),g=o1(s),M=o.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Po).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Po).join(`
`),p.length>0&&(p+=`
`)):(m=[Hl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Po).join(`
`),p=[Hl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ci?"#define TONE_MAPPING":"",e.toneMapping!==ci?oe.tonemapping_pars_fragment:"",e.toneMapping!==ci?e1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",oe.colorspace_pars_fragment,t1("linearToOutputTexel",e.outputColorSpace),n1(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Po).join(`
`)),a=tc(a),a=Bl(a,e),a=kl(a,e),r=tc(r),r=Bl(r,e),r=kl(r,e),a=Vl(a),r=Vl(r),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===Wc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=S+m+a,y=S+p+r,A=zl(o,o.VERTEX_SHADER,x),P=zl(o,o.FRAGMENT_SHADER,y);o.attachShader(M,A),o.attachShader(M,P),e.index0AttributeName!==void 0?o.bindAttribLocation(M,0,e.index0AttributeName):e.morphTargets===!0&&o.bindAttribLocation(M,0,"position"),o.linkProgram(M);function C(L){if(n.debug.checkShaderErrors){const z=o.getProgramInfoLog(M)||"",B=o.getShaderInfoLog(A)||"",H=o.getShaderInfoLog(P)||"",W=z.trim(),q=B.trim(),tt=H.trim();let Y=!0,st=!0;if(o.getProgramParameter(M,o.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(o,M,A,P);else{const j=Fl(o,A,"vertex"),mt=Fl(o,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(M,o.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+W+`
`+j+`
`+mt)}else W!==""?console.warn("THREE.WebGLProgram: Program Info Log:",W):(q===""||tt==="")&&(st=!1);st&&(L.diagnostics={runnable:Y,programLog:W,vertexShader:{log:q,prefix:m},fragmentShader:{log:tt,prefix:p}})}o.deleteShader(A),o.deleteShader(P),D=new Hs(o,M),E=s1(o,M)}let D;this.getUniforms=function(){return D===void 0&&C(this),D};let E;this.getAttributes=function(){return E===void 0&&C(this),E};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=o.getProgramParameter(M,Zg)),b},this.destroy=function(){i.releaseStatesOfProgram(this),o.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Jg++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=A,this.fragmentShader=P,this}let v1=0;class _1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,o=this._getShaderStage(e),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(o)===!1&&(a.add(o),o.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new M1(t),e.set(t,i)),i}}class M1{constructor(t){this.id=v1++,this.code=t,this.usedTimes=0}}function x1(n,t,e,i,o,s,a){const r=new Bh,c=new _1,l=new Set,h=[],d=o.logarithmicDepthBuffer,u=o.vertexTextures;let f=o.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(E){return l.add(E),E===0?"uv":`uv${E}`}function m(E,b,L,z,B){const H=z.fog,W=B.geometry,q=E.isMeshStandardMaterial?z.environment:null,tt=(E.isMeshStandardMaterial?e:t).get(E.envMap||q),Y=tt&&tt.mapping===sa?tt.image.height:null,st=g[E.type];E.precision!==null&&(f=o.getMaxPrecision(E.precision),f!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",f,"instead."));const j=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,mt=j!==void 0?j.length:0;let vt=0;W.morphAttributes.position!==void 0&&(vt=1),W.morphAttributes.normal!==void 0&&(vt=2),W.morphAttributes.color!==void 0&&(vt=3);let At,V,ft,K;if(st){const de=Pn[st];At=de.vertexShader,V=de.fragmentShader}else At=E.vertexShader,V=E.fragmentShader,c.update(E),ft=c.getVertexShaderID(E),K=c.getFragmentShaderID(E);const rt=n.getRenderTarget(),Pt=n.state.buffers.depth.getReversed(),Ot=B.isInstancedMesh===!0,Ut=B.isBatchedMesh===!0,jt=!!E.map,ee=!!E.matcap,F=!!tt,pt=!!E.aoMap,ut=!!E.lightMap,ht=!!E.bumpMap,Q=!!E.normalMap,Et=!!E.displacementMap,yt=!!E.emissiveMap,Ct=!!E.metalnessMap,Zt=!!E.roughnessMap,Qt=E.anisotropy>0,U=E.clearcoat>0,T=E.dispersion>0,Z=E.iridescence>0,it=E.sheen>0,gt=E.transmission>0,lt=Qt&&!!E.anisotropyMap,Ht=U&&!!E.clearcoatMap,Tt=U&&!!E.clearcoatNormalMap,Gt=U&&!!E.clearcoatRoughnessMap,qt=Z&&!!E.iridescenceMap,St=Z&&!!E.iridescenceThicknessMap,Mt=it&&!!E.sheenColorMap,Yt=it&&!!E.sheenRoughnessMap,Vt=!!E.specularMap,Lt=!!E.specularColorMap,$t=!!E.specularIntensityMap,G=gt&&!!E.transmissionMap,wt=gt&&!!E.thicknessMap,Rt=!!E.gradientMap,Ft=!!E.alphaMap,_t=E.alphaTest>0,dt=!!E.alphaHash,Bt=!!E.extensions;let Jt=ci;E.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(Jt=n.toneMapping);const _e={shaderID:st,shaderType:E.type,shaderName:E.name,vertexShader:At,fragmentShader:V,defines:E.defines,customVertexShaderID:ft,customFragmentShaderID:K,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:f,batching:Ut,batchingColor:Ut&&B._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&B.instanceColor!==null,instancingMorph:Ot&&B.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:rt===null?n.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:so,alphaToCoverage:!!E.alphaToCoverage,map:jt,matcap:ee,envMap:F,envMapMode:F&&tt.mapping,envMapCubeUVHeight:Y,aoMap:pt,lightMap:ut,bumpMap:ht,normalMap:Q,displacementMap:u&&Et,emissiveMap:yt,normalMapObjectSpace:Q&&E.normalMapType===xu,normalMapTangentSpace:Q&&E.normalMapType===Uh,metalnessMap:Ct,roughnessMap:Zt,anisotropy:Qt,anisotropyMap:lt,clearcoat:U,clearcoatMap:Ht,clearcoatNormalMap:Tt,clearcoatRoughnessMap:Gt,dispersion:T,iridescence:Z,iridescenceMap:qt,iridescenceThicknessMap:St,sheen:it,sheenColorMap:Mt,sheenRoughnessMap:Yt,specularMap:Vt,specularColorMap:Lt,specularIntensityMap:$t,transmission:gt,transmissionMap:G,thicknessMap:wt,gradientMap:Rt,opaque:E.transparent===!1&&E.blending===to&&E.alphaToCoverage===!1,alphaMap:Ft,alphaTest:_t,alphaHash:dt,combine:E.combine,mapUv:jt&&M(E.map.channel),aoMapUv:pt&&M(E.aoMap.channel),lightMapUv:ut&&M(E.lightMap.channel),bumpMapUv:ht&&M(E.bumpMap.channel),normalMapUv:Q&&M(E.normalMap.channel),displacementMapUv:Et&&M(E.displacementMap.channel),emissiveMapUv:yt&&M(E.emissiveMap.channel),metalnessMapUv:Ct&&M(E.metalnessMap.channel),roughnessMapUv:Zt&&M(E.roughnessMap.channel),anisotropyMapUv:lt&&M(E.anisotropyMap.channel),clearcoatMapUv:Ht&&M(E.clearcoatMap.channel),clearcoatNormalMapUv:Tt&&M(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Gt&&M(E.clearcoatRoughnessMap.channel),iridescenceMapUv:qt&&M(E.iridescenceMap.channel),iridescenceThicknessMapUv:St&&M(E.iridescenceThicknessMap.channel),sheenColorMapUv:Mt&&M(E.sheenColorMap.channel),sheenRoughnessMapUv:Yt&&M(E.sheenRoughnessMap.channel),specularMapUv:Vt&&M(E.specularMap.channel),specularColorMapUv:Lt&&M(E.specularColorMap.channel),specularIntensityMapUv:$t&&M(E.specularIntensityMap.channel),transmissionMapUv:G&&M(E.transmissionMap.channel),thicknessMapUv:wt&&M(E.thicknessMap.channel),alphaMapUv:Ft&&M(E.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(Q||Qt),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!W.attributes.uv&&(jt||Ft),fog:!!H,useFog:E.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:E.flatShading===!0&&E.wireframe===!1,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:Pt,skinning:B.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:vt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:E.dithering,shadowMapEnabled:n.shadowMap.enabled&&L.length>0,shadowMapType:n.shadowMap.type,toneMapping:Jt,decodeVideoTexture:jt&&E.map.isVideoTexture===!0&&me.getTransfer(E.map.colorSpace)===xe,decodeVideoTextureEmissive:yt&&E.emissiveMap.isVideoTexture===!0&&me.getTransfer(E.emissiveMap.colorSpace)===xe,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===wn,flipSided:E.side===Qe,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:Bt&&E.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&E.extensions.multiDraw===!0||Ut)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return _e.vertexUv1s=l.has(1),_e.vertexUv2s=l.has(2),_e.vertexUv3s=l.has(3),l.clear(),_e}function p(E){const b=[];if(E.shaderID?b.push(E.shaderID):(b.push(E.customVertexShaderID),b.push(E.customFragmentShaderID)),E.defines!==void 0)for(const L in E.defines)b.push(L),b.push(E.defines[L]);return E.isRawShaderMaterial===!1&&(S(b,E),x(b,E),b.push(n.outputColorSpace)),b.push(E.customProgramCacheKey),b.join()}function S(E,b){E.push(b.precision),E.push(b.outputColorSpace),E.push(b.envMapMode),E.push(b.envMapCubeUVHeight),E.push(b.mapUv),E.push(b.alphaMapUv),E.push(b.lightMapUv),E.push(b.aoMapUv),E.push(b.bumpMapUv),E.push(b.normalMapUv),E.push(b.displacementMapUv),E.push(b.emissiveMapUv),E.push(b.metalnessMapUv),E.push(b.roughnessMapUv),E.push(b.anisotropyMapUv),E.push(b.clearcoatMapUv),E.push(b.clearcoatNormalMapUv),E.push(b.clearcoatRoughnessMapUv),E.push(b.iridescenceMapUv),E.push(b.iridescenceThicknessMapUv),E.push(b.sheenColorMapUv),E.push(b.sheenRoughnessMapUv),E.push(b.specularMapUv),E.push(b.specularColorMapUv),E.push(b.specularIntensityMapUv),E.push(b.transmissionMapUv),E.push(b.thicknessMapUv),E.push(b.combine),E.push(b.fogExp2),E.push(b.sizeAttenuation),E.push(b.morphTargetsCount),E.push(b.morphAttributeCount),E.push(b.numDirLights),E.push(b.numPointLights),E.push(b.numSpotLights),E.push(b.numSpotLightMaps),E.push(b.numHemiLights),E.push(b.numRectAreaLights),E.push(b.numDirLightShadows),E.push(b.numPointLightShadows),E.push(b.numSpotLightShadows),E.push(b.numSpotLightShadowsWithMaps),E.push(b.numLightProbes),E.push(b.shadowMapType),E.push(b.toneMapping),E.push(b.numClippingPlanes),E.push(b.numClipIntersection),E.push(b.depthPacking)}function x(E,b){r.disableAll(),b.supportsVertexTextures&&r.enable(0),b.instancing&&r.enable(1),b.instancingColor&&r.enable(2),b.instancingMorph&&r.enable(3),b.matcap&&r.enable(4),b.envMap&&r.enable(5),b.normalMapObjectSpace&&r.enable(6),b.normalMapTangentSpace&&r.enable(7),b.clearcoat&&r.enable(8),b.iridescence&&r.enable(9),b.alphaTest&&r.enable(10),b.vertexColors&&r.enable(11),b.vertexAlphas&&r.enable(12),b.vertexUv1s&&r.enable(13),b.vertexUv2s&&r.enable(14),b.vertexUv3s&&r.enable(15),b.vertexTangents&&r.enable(16),b.anisotropy&&r.enable(17),b.alphaHash&&r.enable(18),b.batching&&r.enable(19),b.dispersion&&r.enable(20),b.batchingColor&&r.enable(21),b.gradientMap&&r.enable(22),E.push(r.mask),r.disableAll(),b.fog&&r.enable(0),b.useFog&&r.enable(1),b.flatShading&&r.enable(2),b.logarithmicDepthBuffer&&r.enable(3),b.reversedDepthBuffer&&r.enable(4),b.skinning&&r.enable(5),b.morphTargets&&r.enable(6),b.morphNormals&&r.enable(7),b.morphColors&&r.enable(8),b.premultipliedAlpha&&r.enable(9),b.shadowMapEnabled&&r.enable(10),b.doubleSided&&r.enable(11),b.flipSided&&r.enable(12),b.useDepthPacking&&r.enable(13),b.dithering&&r.enable(14),b.transmission&&r.enable(15),b.sheen&&r.enable(16),b.opaque&&r.enable(17),b.pointsUvs&&r.enable(18),b.decodeVideoTexture&&r.enable(19),b.decodeVideoTextureEmissive&&r.enable(20),b.alphaToCoverage&&r.enable(21),E.push(r.mask)}function y(E){const b=g[E.type];let L;if(b){const z=Pn[b];L=df.clone(z.uniforms)}else L=E.uniforms;return L}function A(E,b){let L;for(let z=0,B=h.length;z<B;z++){const H=h[z];if(H.cacheKey===b){L=H,++L.usedTimes;break}}return L===void 0&&(L=new g1(n,b,E,s),h.push(L)),L}function P(E){if(--E.usedTimes===0){const b=h.indexOf(E);h[b]=h[h.length-1],h.pop(),E.destroy()}}function C(E){c.remove(E)}function D(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:A,releaseProgram:P,releaseShaderCache:C,programs:h,dispose:D}}function y1(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let r=n.get(a);return r===void 0&&(r={},n.set(a,r)),r}function i(a){n.delete(a)}function o(a,r,c){n.get(a)[r]=c}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:o,dispose:s}}function b1(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Gl(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function ql(){const n=[];let t=0;const e=[],i=[],o=[];function s(){t=0,e.length=0,i.length=0,o.length=0}function a(d,u,f,g,M,m){let p=n[t];return p===void 0?(p={id:d.id,object:d,geometry:u,material:f,groupOrder:g,renderOrder:d.renderOrder,z:M,group:m},n[t]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=f,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=M,p.group=m),t++,p}function r(d,u,f,g,M,m){const p=a(d,u,f,g,M,m);f.transmission>0?i.push(p):f.transparent===!0?o.push(p):e.push(p)}function c(d,u,f,g,M,m){const p=a(d,u,f,g,M,m);f.transmission>0?i.unshift(p):f.transparent===!0?o.unshift(p):e.unshift(p)}function l(d,u){e.length>1&&e.sort(d||b1),i.length>1&&i.sort(u||Gl),o.length>1&&o.sort(u||Gl)}function h(){for(let d=t,u=n.length;d<u;d++){const f=n[d];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:i,transparent:o,init:s,push:r,unshift:c,finish:h,sort:l}}function S1(){let n=new WeakMap;function t(i,o){const s=n.get(i);let a;return s===void 0?(a=new ql,n.set(i,[a])):o>=s.length?(a=new ql,s.push(a)):a=s[o],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function w1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new N,color:new le};break;case"SpotLight":e={position:new N,direction:new N,color:new le,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new le,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new le,groundColor:new le};break;case"RectAreaLight":e={color:new le,position:new N,halfWidth:new N,halfHeight:new N};break}return n[t.id]=e,e}}}function E1(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Dt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Dt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Dt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let T1=0;function A1(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function P1(n){const t=new w1,e=E1(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)i.probe.push(new N);const o=new N,s=new Ee,a=new Ee;function r(l){let h=0,d=0,u=0;for(let E=0;E<9;E++)i.probe[E].set(0,0,0);let f=0,g=0,M=0,m=0,p=0,S=0,x=0,y=0,A=0,P=0,C=0;l.sort(A1);for(let E=0,b=l.length;E<b;E++){const L=l[E],z=L.color,B=L.intensity,H=L.distance,W=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=z.r*B,d+=z.g*B,u+=z.b*B;else if(L.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(L.sh.coefficients[q],B);C++}else if(L.isDirectionalLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const tt=L.shadow,Y=e.get(L);Y.shadowIntensity=tt.intensity,Y.shadowBias=tt.bias,Y.shadowNormalBias=tt.normalBias,Y.shadowRadius=tt.radius,Y.shadowMapSize=tt.mapSize,i.directionalShadow[f]=Y,i.directionalShadowMap[f]=W,i.directionalShadowMatrix[f]=L.shadow.matrix,S++}i.directional[f]=q,f++}else if(L.isSpotLight){const q=t.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(z).multiplyScalar(B),q.distance=H,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,i.spot[M]=q;const tt=L.shadow;if(L.map&&(i.spotLightMap[A]=L.map,A++,tt.updateMatrices(L),L.castShadow&&P++),i.spotLightMatrix[M]=tt.matrix,L.castShadow){const Y=e.get(L);Y.shadowIntensity=tt.intensity,Y.shadowBias=tt.bias,Y.shadowNormalBias=tt.normalBias,Y.shadowRadius=tt.radius,Y.shadowMapSize=tt.mapSize,i.spotShadow[M]=Y,i.spotShadowMap[M]=W,y++}M++}else if(L.isRectAreaLight){const q=t.get(L);q.color.copy(z).multiplyScalar(B),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),i.rectArea[m]=q,m++}else if(L.isPointLight){const q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){const tt=L.shadow,Y=e.get(L);Y.shadowIntensity=tt.intensity,Y.shadowBias=tt.bias,Y.shadowNormalBias=tt.normalBias,Y.shadowRadius=tt.radius,Y.shadowMapSize=tt.mapSize,Y.shadowCameraNear=tt.camera.near,Y.shadowCameraFar=tt.camera.far,i.pointShadow[g]=Y,i.pointShadowMap[g]=W,i.pointShadowMatrix[g]=L.shadow.matrix,x++}i.point[g]=q,g++}else if(L.isHemisphereLight){const q=t.get(L);q.skyColor.copy(L.color).multiplyScalar(B),q.groundColor.copy(L.groundColor).multiplyScalar(B),i.hemi[p]=q,p++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=zt.LTC_FLOAT_1,i.rectAreaLTC2=zt.LTC_FLOAT_2):(i.rectAreaLTC1=zt.LTC_HALF_1,i.rectAreaLTC2=zt.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const D=i.hash;(D.directionalLength!==f||D.pointLength!==g||D.spotLength!==M||D.rectAreaLength!==m||D.hemiLength!==p||D.numDirectionalShadows!==S||D.numPointShadows!==x||D.numSpotShadows!==y||D.numSpotMaps!==A||D.numLightProbes!==C)&&(i.directional.length=f,i.spot.length=M,i.rectArea.length=m,i.point.length=g,i.hemi.length=p,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=S,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+A-P,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=P,i.numLightProbes=C,D.directionalLength=f,D.pointLength=g,D.spotLength=M,D.rectAreaLength=m,D.hemiLength=p,D.numDirectionalShadows=S,D.numPointShadows=x,D.numSpotShadows=y,D.numSpotMaps=A,D.numLightProbes=C,i.version=T1++)}function c(l,h){let d=0,u=0,f=0,g=0,M=0;const m=h.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){const x=l[p];if(x.isDirectionalLight){const y=i.directional[d];y.direction.setFromMatrixPosition(x.matrixWorld),o.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(o),y.direction.transformDirection(m),d++}else if(x.isSpotLight){const y=i.spot[f];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),o.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(o),y.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),a.identity(),s.copy(x.matrixWorld),s.premultiply(m),a.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(a),y.halfHeight.applyMatrix4(a),g++}else if(x.isPointLight){const y=i.point[u];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),u++}else if(x.isHemisphereLight){const y=i.hemi[M];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),M++}}}return{setup:r,setupView:c,state:i}}function Wl(n){const t=new P1(n),e=[],i=[];function o(h){l.camera=h,e.length=0,i.length=0}function s(h){e.push(h)}function a(h){i.push(h)}function r(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:o,state:l,setupLights:r,setupLightsView:c,pushLight:s,pushShadow:a}}function C1(n){let t=new WeakMap;function e(o,s=0){const a=t.get(o);let r;return a===void 0?(r=new Wl(n),t.set(o,[r])):s>=a.length?(r=new Wl(n),a.push(r)):r=a[s],r}function i(){t=new WeakMap}return{get:e,dispose:i}}const R1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,I1=`uniform sampler2D shadow_pass;
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
}`;function D1(n,t,e){let i=new Pc;const o=new Dt,s=new Dt,a=new Te,r=new np({depthPacking:Mu}),c=new ip,l={},h=e.maxTextureSize,d={[jn]:Qe,[Qe]:jn,[wn]:wn},u=new li({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Dt},radius:{value:4}},vertexShader:R1,fragmentShader:I1}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const g=new Le;g.setAttribute("position",new Ln(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new v(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sh;let p=this.type;this.render=function(P,C,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;const E=n.getRenderTarget(),b=n.getActiveCubeFace(),L=n.getActiveMipmapLevel(),z=n.state;z.setBlending(ri),z.buffers.depth.getReversed()===!0?z.buffers.color.setClear(0,0,0,0):z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const B=p!==Vn&&this.type===Vn,H=p===Vn&&this.type!==Vn;for(let W=0,q=P.length;W<q;W++){const tt=P[W],Y=tt.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",tt,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;o.copy(Y.mapSize);const st=Y.getFrameExtents();if(o.multiply(st),s.copy(Y.mapSize),(o.x>h||o.y>h)&&(o.x>h&&(s.x=Math.floor(h/st.x),o.x=s.x*st.x,Y.mapSize.x=s.x),o.y>h&&(s.y=Math.floor(h/st.y),o.y=s.y*st.y,Y.mapSize.y=s.y)),Y.map===null||B===!0||H===!0){const mt=this.type!==Vn?{minFilter:$e,magFilter:$e}:{};Y.map!==null&&Y.map.dispose(),Y.map=new Pi(o.x,o.y,mt),Y.map.texture.name=tt.name+".shadowMap",Y.camera.updateProjectionMatrix()}n.setRenderTarget(Y.map),n.clear();const j=Y.getViewportCount();for(let mt=0;mt<j;mt++){const vt=Y.getViewport(mt);a.set(s.x*vt.x,s.y*vt.y,s.x*vt.z,s.y*vt.w),z.viewport(a),Y.updateMatrices(tt,mt),i=Y.getFrustum(),y(C,D,Y.camera,tt,this.type)}Y.isPointLightShadow!==!0&&this.type===Vn&&S(Y,D),Y.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(E,b,L)};function S(P,C){const D=t.update(M);u.defines.VSM_SAMPLES!==P.blurSamples&&(u.defines.VSM_SAMPLES=P.blurSamples,f.defines.VSM_SAMPLES=P.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new Pi(o.x,o.y)),u.uniforms.shadow_pass.value=P.map.texture,u.uniforms.resolution.value=P.mapSize,u.uniforms.radius.value=P.radius,n.setRenderTarget(P.mapPass),n.clear(),n.renderBufferDirect(C,null,D,u,M,null),f.uniforms.shadow_pass.value=P.mapPass.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,n.setRenderTarget(P.map),n.clear(),n.renderBufferDirect(C,null,D,f,M,null)}function x(P,C,D,E){let b=null;const L=D.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(L!==void 0)b=L;else if(b=D.isPointLight===!0?c:r,n.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const z=b.uuid,B=C.uuid;let H=l[z];H===void 0&&(H={},l[z]=H);let W=H[B];W===void 0&&(W=b.clone(),H[B]=W,C.addEventListener("dispose",A)),b=W}if(b.visible=C.visible,b.wireframe=C.wireframe,E===Vn?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:d[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,D.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const z=n.properties.get(b);z.light=D}return b}function y(P,C,D,E,b){if(P.visible===!1)return;if(P.layers.test(C.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&b===Vn)&&(!P.frustumCulled||i.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,P.matrixWorld);const B=t.update(P),H=P.material;if(Array.isArray(H)){const W=B.groups;for(let q=0,tt=W.length;q<tt;q++){const Y=W[q],st=H[Y.materialIndex];if(st&&st.visible){const j=x(P,st,E,b);P.onBeforeShadow(n,P,C,D,B,j,Y),n.renderBufferDirect(D,null,B,j,P,Y),P.onAfterShadow(n,P,C,D,B,j,Y)}}}else if(H.visible){const W=x(P,H,E,b);P.onBeforeShadow(n,P,C,D,B,W,null),n.renderBufferDirect(D,null,B,W,P,null),P.onAfterShadow(n,P,C,D,B,W,null)}}const z=P.children;for(let B=0,H=z.length;B<H;B++)y(z[B],C,D,E,b)}function A(P){P.target.removeEventListener("dispose",A);for(const D in l){const E=l[D],b=P.target.uuid;b in E&&(E[b].dispose(),delete E[b])}}}const L1={[dr]:ur,[fr]:gr,[pr]:vr,[no]:mr,[ur]:dr,[gr]:fr,[vr]:pr,[mr]:no};function U1(n,t){function e(){let G=!1;const wt=new Te;let Rt=null;const Ft=new Te(0,0,0,0);return{setMask:function(_t){Rt!==_t&&!G&&(n.colorMask(_t,_t,_t,_t),Rt=_t)},setLocked:function(_t){G=_t},setClear:function(_t,dt,Bt,Jt,_e){_e===!0&&(_t*=Jt,dt*=Jt,Bt*=Jt),wt.set(_t,dt,Bt,Jt),Ft.equals(wt)===!1&&(n.clearColor(_t,dt,Bt,Jt),Ft.copy(wt))},reset:function(){G=!1,Rt=null,Ft.set(-1,0,0,0)}}}function i(){let G=!1,wt=!1,Rt=null,Ft=null,_t=null;return{setReversed:function(dt){if(wt!==dt){const Bt=t.get("EXT_clip_control");dt?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT),wt=dt;const Jt=_t;_t=null,this.setClear(Jt)}},getReversed:function(){return wt},setTest:function(dt){dt?rt(n.DEPTH_TEST):Pt(n.DEPTH_TEST)},setMask:function(dt){Rt!==dt&&!G&&(n.depthMask(dt),Rt=dt)},setFunc:function(dt){if(wt&&(dt=L1[dt]),Ft!==dt){switch(dt){case dr:n.depthFunc(n.NEVER);break;case ur:n.depthFunc(n.ALWAYS);break;case fr:n.depthFunc(n.LESS);break;case no:n.depthFunc(n.LEQUAL);break;case pr:n.depthFunc(n.EQUAL);break;case mr:n.depthFunc(n.GEQUAL);break;case gr:n.depthFunc(n.GREATER);break;case vr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ft=dt}},setLocked:function(dt){G=dt},setClear:function(dt){_t!==dt&&(wt&&(dt=1-dt),n.clearDepth(dt),_t=dt)},reset:function(){G=!1,Rt=null,Ft=null,_t=null,wt=!1}}}function o(){let G=!1,wt=null,Rt=null,Ft=null,_t=null,dt=null,Bt=null,Jt=null,_e=null;return{setTest:function(de){G||(de?rt(n.STENCIL_TEST):Pt(n.STENCIL_TEST))},setMask:function(de){wt!==de&&!G&&(n.stencilMask(de),wt=de)},setFunc:function(de,rn,tn){(Rt!==de||Ft!==rn||_t!==tn)&&(n.stencilFunc(de,rn,tn),Rt=de,Ft=rn,_t=tn)},setOp:function(de,rn,tn){(dt!==de||Bt!==rn||Jt!==tn)&&(n.stencilOp(de,rn,tn),dt=de,Bt=rn,Jt=tn)},setLocked:function(de){G=de},setClear:function(de){_e!==de&&(n.clearStencil(de),_e=de)},reset:function(){G=!1,wt=null,Rt=null,Ft=null,_t=null,dt=null,Bt=null,Jt=null,_e=null}}}const s=new e,a=new i,r=new o,c=new WeakMap,l=new WeakMap;let h={},d={},u=new WeakMap,f=[],g=null,M=!1,m=null,p=null,S=null,x=null,y=null,A=null,P=null,C=new le(0,0,0),D=0,E=!1,b=null,L=null,z=null,B=null,H=null;const W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,tt=0;const Y=n.getParameter(n.VERSION);Y.indexOf("WebGL")!==-1?(tt=parseFloat(/^WebGL (\d)/.exec(Y)[1]),q=tt>=1):Y.indexOf("OpenGL ES")!==-1&&(tt=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),q=tt>=2);let st=null,j={};const mt=n.getParameter(n.SCISSOR_BOX),vt=n.getParameter(n.VIEWPORT),At=new Te().fromArray(mt),V=new Te().fromArray(vt);function ft(G,wt,Rt,Ft){const _t=new Uint8Array(4),dt=n.createTexture();n.bindTexture(G,dt),n.texParameteri(G,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(G,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Bt=0;Bt<Rt;Bt++)G===n.TEXTURE_3D||G===n.TEXTURE_2D_ARRAY?n.texImage3D(wt,0,n.RGBA,1,1,Ft,0,n.RGBA,n.UNSIGNED_BYTE,_t):n.texImage2D(wt+Bt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,_t);return dt}const K={};K[n.TEXTURE_2D]=ft(n.TEXTURE_2D,n.TEXTURE_2D,1),K[n.TEXTURE_CUBE_MAP]=ft(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[n.TEXTURE_2D_ARRAY]=ft(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),K[n.TEXTURE_3D]=ft(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),r.setClear(0),rt(n.DEPTH_TEST),a.setFunc(no),ht(!1),Q(Bc),rt(n.CULL_FACE),pt(ri);function rt(G){h[G]!==!0&&(n.enable(G),h[G]=!0)}function Pt(G){h[G]!==!1&&(n.disable(G),h[G]=!1)}function Ot(G,wt){return d[G]!==wt?(n.bindFramebuffer(G,wt),d[G]=wt,G===n.DRAW_FRAMEBUFFER&&(d[n.FRAMEBUFFER]=wt),G===n.FRAMEBUFFER&&(d[n.DRAW_FRAMEBUFFER]=wt),!0):!1}function Ut(G,wt){let Rt=f,Ft=!1;if(G){Rt=u.get(wt),Rt===void 0&&(Rt=[],u.set(wt,Rt));const _t=G.textures;if(Rt.length!==_t.length||Rt[0]!==n.COLOR_ATTACHMENT0){for(let dt=0,Bt=_t.length;dt<Bt;dt++)Rt[dt]=n.COLOR_ATTACHMENT0+dt;Rt.length=_t.length,Ft=!0}}else Rt[0]!==n.BACK&&(Rt[0]=n.BACK,Ft=!0);Ft&&n.drawBuffers(Rt)}function jt(G){return g!==G?(n.useProgram(G),g=G,!0):!1}const ee={[bi]:n.FUNC_ADD,[Wd]:n.FUNC_SUBTRACT,[Xd]:n.FUNC_REVERSE_SUBTRACT};ee[jd]=n.MIN,ee[Yd]=n.MAX;const F={[$d]:n.ZERO,[Zd]:n.ONE,[Jd]:n.SRC_COLOR,[lr]:n.SRC_ALPHA,[iu]:n.SRC_ALPHA_SATURATE,[eu]:n.DST_COLOR,[Qd]:n.DST_ALPHA,[Kd]:n.ONE_MINUS_SRC_COLOR,[hr]:n.ONE_MINUS_SRC_ALPHA,[nu]:n.ONE_MINUS_DST_COLOR,[tu]:n.ONE_MINUS_DST_ALPHA,[ou]:n.CONSTANT_COLOR,[su]:n.ONE_MINUS_CONSTANT_COLOR,[au]:n.CONSTANT_ALPHA,[ru]:n.ONE_MINUS_CONSTANT_ALPHA};function pt(G,wt,Rt,Ft,_t,dt,Bt,Jt,_e,de){if(G===ri){M===!0&&(Pt(n.BLEND),M=!1);return}if(M===!1&&(rt(n.BLEND),M=!0),G!==qd){if(G!==m||de!==E){if((p!==bi||y!==bi)&&(n.blendEquation(n.FUNC_ADD),p=bi,y=bi),de)switch(G){case to:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case kc:n.blendFunc(n.ONE,n.ONE);break;case Vc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Hc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}else switch(G){case to:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case kc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Vc:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Hc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",G);break}S=null,x=null,A=null,P=null,C.set(0,0,0),D=0,m=G,E=de}return}_t=_t||wt,dt=dt||Rt,Bt=Bt||Ft,(wt!==p||_t!==y)&&(n.blendEquationSeparate(ee[wt],ee[_t]),p=wt,y=_t),(Rt!==S||Ft!==x||dt!==A||Bt!==P)&&(n.blendFuncSeparate(F[Rt],F[Ft],F[dt],F[Bt]),S=Rt,x=Ft,A=dt,P=Bt),(Jt.equals(C)===!1||_e!==D)&&(n.blendColor(Jt.r,Jt.g,Jt.b,_e),C.copy(Jt),D=_e),m=G,E=!1}function ut(G,wt){G.side===wn?Pt(n.CULL_FACE):rt(n.CULL_FACE);let Rt=G.side===Qe;wt&&(Rt=!Rt),ht(Rt),G.blending===to&&G.transparent===!1?pt(ri):pt(G.blending,G.blendEquation,G.blendSrc,G.blendDst,G.blendEquationAlpha,G.blendSrcAlpha,G.blendDstAlpha,G.blendColor,G.blendAlpha,G.premultipliedAlpha),a.setFunc(G.depthFunc),a.setTest(G.depthTest),a.setMask(G.depthWrite),s.setMask(G.colorWrite);const Ft=G.stencilWrite;r.setTest(Ft),Ft&&(r.setMask(G.stencilWriteMask),r.setFunc(G.stencilFunc,G.stencilRef,G.stencilFuncMask),r.setOp(G.stencilFail,G.stencilZFail,G.stencilZPass)),yt(G.polygonOffset,G.polygonOffsetFactor,G.polygonOffsetUnits),G.alphaToCoverage===!0?rt(n.SAMPLE_ALPHA_TO_COVERAGE):Pt(n.SAMPLE_ALPHA_TO_COVERAGE)}function ht(G){b!==G&&(G?n.frontFace(n.CW):n.frontFace(n.CCW),b=G)}function Q(G){G!==Hd?(rt(n.CULL_FACE),G!==L&&(G===Bc?n.cullFace(n.BACK):G===Gd?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Pt(n.CULL_FACE),L=G}function Et(G){G!==z&&(q&&n.lineWidth(G),z=G)}function yt(G,wt,Rt){G?(rt(n.POLYGON_OFFSET_FILL),(B!==wt||H!==Rt)&&(n.polygonOffset(wt,Rt),B=wt,H=Rt)):Pt(n.POLYGON_OFFSET_FILL)}function Ct(G){G?rt(n.SCISSOR_TEST):Pt(n.SCISSOR_TEST)}function Zt(G){G===void 0&&(G=n.TEXTURE0+W-1),st!==G&&(n.activeTexture(G),st=G)}function Qt(G,wt,Rt){Rt===void 0&&(st===null?Rt=n.TEXTURE0+W-1:Rt=st);let Ft=j[Rt];Ft===void 0&&(Ft={type:void 0,texture:void 0},j[Rt]=Ft),(Ft.type!==G||Ft.texture!==wt)&&(st!==Rt&&(n.activeTexture(Rt),st=Rt),n.bindTexture(G,wt||K[G]),Ft.type=G,Ft.texture=wt)}function U(){const G=j[st];G!==void 0&&G.type!==void 0&&(n.bindTexture(G.type,null),G.type=void 0,G.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Z(){try{n.compressedTexImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function it(){try{n.texSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function gt(){try{n.texSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function lt(){try{n.compressedTexSubImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Ht(){try{n.compressedTexSubImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Tt(){try{n.texStorage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Gt(){try{n.texStorage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function qt(){try{n.texImage2D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function St(){try{n.texImage3D(...arguments)}catch(G){console.error("THREE.WebGLState:",G)}}function Mt(G){At.equals(G)===!1&&(n.scissor(G.x,G.y,G.z,G.w),At.copy(G))}function Yt(G){V.equals(G)===!1&&(n.viewport(G.x,G.y,G.z,G.w),V.copy(G))}function Vt(G,wt){let Rt=l.get(wt);Rt===void 0&&(Rt=new WeakMap,l.set(wt,Rt));let Ft=Rt.get(G);Ft===void 0&&(Ft=n.getUniformBlockIndex(wt,G.name),Rt.set(G,Ft))}function Lt(G,wt){const Ft=l.get(wt).get(G);c.get(wt)!==Ft&&(n.uniformBlockBinding(wt,Ft,G.__bindingPointIndex),c.set(wt,Ft))}function $t(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},st=null,j={},d={},u=new WeakMap,f=[],g=null,M=!1,m=null,p=null,S=null,x=null,y=null,A=null,P=null,C=new le(0,0,0),D=0,E=!1,b=null,L=null,z=null,B=null,H=null,At.set(0,0,n.canvas.width,n.canvas.height),V.set(0,0,n.canvas.width,n.canvas.height),s.reset(),a.reset(),r.reset()}return{buffers:{color:s,depth:a,stencil:r},enable:rt,disable:Pt,bindFramebuffer:Ot,drawBuffers:Ut,useProgram:jt,setBlending:pt,setMaterial:ut,setFlipSided:ht,setCullFace:Q,setLineWidth:Et,setPolygonOffset:yt,setScissorTest:Ct,activeTexture:Zt,bindTexture:Qt,unbindTexture:U,compressedTexImage2D:T,compressedTexImage3D:Z,texImage2D:qt,texImage3D:St,updateUBOMapping:Vt,uniformBlockBinding:Lt,texStorage2D:Tt,texStorage3D:Gt,texSubImage2D:it,texSubImage3D:gt,compressedTexSubImage2D:lt,compressedTexSubImage3D:Ht,scissor:Mt,viewport:Yt,reset:$t}}function N1(n,t,e,i,o,s,a){const r=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Dt,h=new WeakMap;let d;const u=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(U,T){return f?new OffscreenCanvas(U,T):Js("canvas")}function M(U,T,Z){let it=1;const gt=Qt(U);if((gt.width>Z||gt.height>Z)&&(it=Z/Math.max(gt.width,gt.height)),it<1)if(typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&U instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&U instanceof ImageBitmap||typeof VideoFrame<"u"&&U instanceof VideoFrame){const lt=Math.floor(it*gt.width),Ht=Math.floor(it*gt.height);d===void 0&&(d=g(lt,Ht));const Tt=T?g(lt,Ht):d;return Tt.width=lt,Tt.height=Ht,Tt.getContext("2d").drawImage(U,0,0,lt,Ht),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+gt.width+"x"+gt.height+") to ("+lt+"x"+Ht+")."),Tt}else return"data"in U&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+gt.width+"x"+gt.height+")."),U;return U}function m(U){return U.generateMipmaps}function p(U){n.generateMipmap(U)}function S(U){return U.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:U.isWebGL3DRenderTarget?n.TEXTURE_3D:U.isWebGLArrayRenderTarget||U.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(U,T,Z,it,gt=!1){if(U!==null){if(n[U]!==void 0)return n[U];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+U+"'")}let lt=T;if(T===n.RED&&(Z===n.FLOAT&&(lt=n.R32F),Z===n.HALF_FLOAT&&(lt=n.R16F),Z===n.UNSIGNED_BYTE&&(lt=n.R8)),T===n.RED_INTEGER&&(Z===n.UNSIGNED_BYTE&&(lt=n.R8UI),Z===n.UNSIGNED_SHORT&&(lt=n.R16UI),Z===n.UNSIGNED_INT&&(lt=n.R32UI),Z===n.BYTE&&(lt=n.R8I),Z===n.SHORT&&(lt=n.R16I),Z===n.INT&&(lt=n.R32I)),T===n.RG&&(Z===n.FLOAT&&(lt=n.RG32F),Z===n.HALF_FLOAT&&(lt=n.RG16F),Z===n.UNSIGNED_BYTE&&(lt=n.RG8)),T===n.RG_INTEGER&&(Z===n.UNSIGNED_BYTE&&(lt=n.RG8UI),Z===n.UNSIGNED_SHORT&&(lt=n.RG16UI),Z===n.UNSIGNED_INT&&(lt=n.RG32UI),Z===n.BYTE&&(lt=n.RG8I),Z===n.SHORT&&(lt=n.RG16I),Z===n.INT&&(lt=n.RG32I)),T===n.RGB_INTEGER&&(Z===n.UNSIGNED_BYTE&&(lt=n.RGB8UI),Z===n.UNSIGNED_SHORT&&(lt=n.RGB16UI),Z===n.UNSIGNED_INT&&(lt=n.RGB32UI),Z===n.BYTE&&(lt=n.RGB8I),Z===n.SHORT&&(lt=n.RGB16I),Z===n.INT&&(lt=n.RGB32I)),T===n.RGBA_INTEGER&&(Z===n.UNSIGNED_BYTE&&(lt=n.RGBA8UI),Z===n.UNSIGNED_SHORT&&(lt=n.RGBA16UI),Z===n.UNSIGNED_INT&&(lt=n.RGBA32UI),Z===n.BYTE&&(lt=n.RGBA8I),Z===n.SHORT&&(lt=n.RGBA16I),Z===n.INT&&(lt=n.RGBA32I)),T===n.RGB&&(Z===n.UNSIGNED_INT_5_9_9_9_REV&&(lt=n.RGB9_E5),Z===n.UNSIGNED_INT_10F_11F_11F_REV&&(lt=n.R11F_G11F_B10F)),T===n.RGBA){const Ht=gt?$s:me.getTransfer(it);Z===n.FLOAT&&(lt=n.RGBA32F),Z===n.HALF_FLOAT&&(lt=n.RGBA16F),Z===n.UNSIGNED_BYTE&&(lt=Ht===xe?n.SRGB8_ALPHA8:n.RGBA8),Z===n.UNSIGNED_SHORT_4_4_4_4&&(lt=n.RGBA4),Z===n.UNSIGNED_SHORT_5_5_5_1&&(lt=n.RGB5_A1)}return(lt===n.R16F||lt===n.R32F||lt===n.RG16F||lt===n.RG32F||lt===n.RGBA16F||lt===n.RGBA32F)&&t.get("EXT_color_buffer_float"),lt}function y(U,T){let Z;return U?T===null||T===Ai||T===zo?Z=n.DEPTH24_STENCIL8:T===Gn?Z=n.DEPTH32F_STENCIL8:T===No&&(Z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===Ai||T===zo?Z=n.DEPTH_COMPONENT24:T===Gn?Z=n.DEPTH_COMPONENT32F:T===No&&(Z=n.DEPTH_COMPONENT16),Z}function A(U,T){return m(U)===!0||U.isFramebufferTexture&&U.minFilter!==$e&&U.minFilter!==Cn?Math.log2(Math.max(T.width,T.height))+1:U.mipmaps!==void 0&&U.mipmaps.length>0?U.mipmaps.length:U.isCompressedTexture&&Array.isArray(U.image)?T.mipmaps.length:1}function P(U){const T=U.target;T.removeEventListener("dispose",P),D(T),T.isVideoTexture&&h.delete(T)}function C(U){const T=U.target;T.removeEventListener("dispose",C),b(T)}function D(U){const T=i.get(U);if(T.__webglInit===void 0)return;const Z=U.source,it=u.get(Z);if(it){const gt=it[T.__cacheKey];gt.usedTimes--,gt.usedTimes===0&&E(U),Object.keys(it).length===0&&u.delete(Z)}i.remove(U)}function E(U){const T=i.get(U);n.deleteTexture(T.__webglTexture);const Z=U.source,it=u.get(Z);delete it[T.__cacheKey],a.memory.textures--}function b(U){const T=i.get(U);if(U.depthTexture&&(U.depthTexture.dispose(),i.remove(U.depthTexture)),U.isWebGLCubeRenderTarget)for(let it=0;it<6;it++){if(Array.isArray(T.__webglFramebuffer[it]))for(let gt=0;gt<T.__webglFramebuffer[it].length;gt++)n.deleteFramebuffer(T.__webglFramebuffer[it][gt]);else n.deleteFramebuffer(T.__webglFramebuffer[it]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[it])}else{if(Array.isArray(T.__webglFramebuffer))for(let it=0;it<T.__webglFramebuffer.length;it++)n.deleteFramebuffer(T.__webglFramebuffer[it]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let it=0;it<T.__webglColorRenderbuffer.length;it++)T.__webglColorRenderbuffer[it]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[it]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const Z=U.textures;for(let it=0,gt=Z.length;it<gt;it++){const lt=i.get(Z[it]);lt.__webglTexture&&(n.deleteTexture(lt.__webglTexture),a.memory.textures--),i.remove(Z[it])}i.remove(U)}let L=0;function z(){L=0}function B(){const U=L;return U>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+U+" texture units while this GPU supports only "+o.maxTextures),L+=1,U}function H(U){const T=[];return T.push(U.wrapS),T.push(U.wrapT),T.push(U.wrapR||0),T.push(U.magFilter),T.push(U.minFilter),T.push(U.anisotropy),T.push(U.internalFormat),T.push(U.format),T.push(U.type),T.push(U.generateMipmaps),T.push(U.premultiplyAlpha),T.push(U.flipY),T.push(U.unpackAlignment),T.push(U.colorSpace),T.join()}function W(U,T){const Z=i.get(U);if(U.isVideoTexture&&Ct(U),U.isRenderTargetTexture===!1&&U.isExternalTexture!==!0&&U.version>0&&Z.__version!==U.version){const it=U.image;if(it===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(it.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{K(Z,U,T);return}}else U.isExternalTexture&&(Z.__webglTexture=U.sourceTexture?U.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,Z.__webglTexture,n.TEXTURE0+T)}function q(U,T){const Z=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&Z.__version!==U.version){K(Z,U,T);return}e.bindTexture(n.TEXTURE_2D_ARRAY,Z.__webglTexture,n.TEXTURE0+T)}function tt(U,T){const Z=i.get(U);if(U.isRenderTargetTexture===!1&&U.version>0&&Z.__version!==U.version){K(Z,U,T);return}e.bindTexture(n.TEXTURE_3D,Z.__webglTexture,n.TEXTURE0+T)}function Y(U,T){const Z=i.get(U);if(U.version>0&&Z.__version!==U.version){rt(Z,U,T);return}e.bindTexture(n.TEXTURE_CUBE_MAP,Z.__webglTexture,n.TEXTURE0+T)}const st={[Uo]:n.REPEAT,[wi]:n.CLAMP_TO_EDGE,[xr]:n.MIRRORED_REPEAT},j={[$e]:n.NEAREST,[vu]:n.NEAREST_MIPMAP_NEAREST,[as]:n.NEAREST_MIPMAP_LINEAR,[Cn]:n.LINEAR,[ma]:n.LINEAR_MIPMAP_NEAREST,[Ei]:n.LINEAR_MIPMAP_LINEAR},mt={[yu]:n.NEVER,[Au]:n.ALWAYS,[bu]:n.LESS,[Nh]:n.LEQUAL,[Su]:n.EQUAL,[Tu]:n.GEQUAL,[wu]:n.GREATER,[Eu]:n.NOTEQUAL};function vt(U,T){if(T.type===Gn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Cn||T.magFilter===ma||T.magFilter===as||T.magFilter===Ei||T.minFilter===Cn||T.minFilter===ma||T.minFilter===as||T.minFilter===Ei)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(U,n.TEXTURE_WRAP_S,st[T.wrapS]),n.texParameteri(U,n.TEXTURE_WRAP_T,st[T.wrapT]),(U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY)&&n.texParameteri(U,n.TEXTURE_WRAP_R,st[T.wrapR]),n.texParameteri(U,n.TEXTURE_MAG_FILTER,j[T.magFilter]),n.texParameteri(U,n.TEXTURE_MIN_FILTER,j[T.minFilter]),T.compareFunction&&(n.texParameteri(U,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(U,n.TEXTURE_COMPARE_FUNC,mt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===$e||T.minFilter!==as&&T.minFilter!==Ei||T.type===Gn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const Z=t.get("EXT_texture_filter_anisotropic");n.texParameterf(U,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,o.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function At(U,T){let Z=!1;U.__webglInit===void 0&&(U.__webglInit=!0,T.addEventListener("dispose",P));const it=T.source;let gt=u.get(it);gt===void 0&&(gt={},u.set(it,gt));const lt=H(T);if(lt!==U.__cacheKey){gt[lt]===void 0&&(gt[lt]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,Z=!0),gt[lt].usedTimes++;const Ht=gt[U.__cacheKey];Ht!==void 0&&(gt[U.__cacheKey].usedTimes--,Ht.usedTimes===0&&E(T)),U.__cacheKey=lt,U.__webglTexture=gt[lt].texture}return Z}function V(U,T,Z){return Math.floor(Math.floor(U/Z)/T)}function ft(U,T,Z,it){const lt=U.updateRanges;if(lt.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,Z,it,T.data);else{lt.sort((St,Mt)=>St.start-Mt.start);let Ht=0;for(let St=1;St<lt.length;St++){const Mt=lt[Ht],Yt=lt[St],Vt=Mt.start+Mt.count,Lt=V(Yt.start,T.width,4),$t=V(Mt.start,T.width,4);Yt.start<=Vt+1&&Lt===$t&&V(Yt.start+Yt.count-1,T.width,4)===Lt?Mt.count=Math.max(Mt.count,Yt.start+Yt.count-Mt.start):(++Ht,lt[Ht]=Yt)}lt.length=Ht+1;const Tt=n.getParameter(n.UNPACK_ROW_LENGTH),Gt=n.getParameter(n.UNPACK_SKIP_PIXELS),qt=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let St=0,Mt=lt.length;St<Mt;St++){const Yt=lt[St],Vt=Math.floor(Yt.start/4),Lt=Math.ceil(Yt.count/4),$t=Vt%T.width,G=Math.floor(Vt/T.width),wt=Lt,Rt=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,$t),n.pixelStorei(n.UNPACK_SKIP_ROWS,G),e.texSubImage2D(n.TEXTURE_2D,0,$t,G,wt,Rt,Z,it,T.data)}U.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,Tt),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Gt),n.pixelStorei(n.UNPACK_SKIP_ROWS,qt)}}function K(U,T,Z){let it=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(it=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(it=n.TEXTURE_3D);const gt=At(U,T),lt=T.source;e.bindTexture(it,U.__webglTexture,n.TEXTURE0+Z);const Ht=i.get(lt);if(lt.version!==Ht.__version||gt===!0){e.activeTexture(n.TEXTURE0+Z);const Tt=me.getPrimaries(me.workingColorSpace),Gt=T.colorSpace===si?null:me.getPrimaries(T.colorSpace),qt=T.colorSpace===si||Tt===Gt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,qt);let St=M(T.image,!1,o.maxTextureSize);St=Zt(T,St);const Mt=s.convert(T.format,T.colorSpace),Yt=s.convert(T.type);let Vt=x(T.internalFormat,Mt,Yt,T.colorSpace,T.isVideoTexture);vt(it,T);let Lt;const $t=T.mipmaps,G=T.isVideoTexture!==!0,wt=Ht.__version===void 0||gt===!0,Rt=lt.dataReady,Ft=A(T,St);if(T.isDepthTexture)Vt=y(T.format===Fo,T.type),wt&&(G?e.texStorage2D(n.TEXTURE_2D,1,Vt,St.width,St.height):e.texImage2D(n.TEXTURE_2D,0,Vt,St.width,St.height,0,Mt,Yt,null));else if(T.isDataTexture)if($t.length>0){G&&wt&&e.texStorage2D(n.TEXTURE_2D,Ft,Vt,$t[0].width,$t[0].height);for(let _t=0,dt=$t.length;_t<dt;_t++)Lt=$t[_t],G?Rt&&e.texSubImage2D(n.TEXTURE_2D,_t,0,0,Lt.width,Lt.height,Mt,Yt,Lt.data):e.texImage2D(n.TEXTURE_2D,_t,Vt,Lt.width,Lt.height,0,Mt,Yt,Lt.data);T.generateMipmaps=!1}else G?(wt&&e.texStorage2D(n.TEXTURE_2D,Ft,Vt,St.width,St.height),Rt&&ft(T,St,Mt,Yt)):e.texImage2D(n.TEXTURE_2D,0,Vt,St.width,St.height,0,Mt,Yt,St.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){G&&wt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ft,Vt,$t[0].width,$t[0].height,St.depth);for(let _t=0,dt=$t.length;_t<dt;_t++)if(Lt=$t[_t],T.format!==An)if(Mt!==null)if(G){if(Rt)if(T.layerUpdates.size>0){const Bt=yl(Lt.width,Lt.height,T.format,T.type);for(const Jt of T.layerUpdates){const _e=Lt.data.subarray(Jt*Bt/Lt.data.BYTES_PER_ELEMENT,(Jt+1)*Bt/Lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,_t,0,0,Jt,Lt.width,Lt.height,1,Mt,_e)}T.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,_t,0,0,0,Lt.width,Lt.height,St.depth,Mt,Lt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,_t,Vt,Lt.width,Lt.height,St.depth,0,Lt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else G?Rt&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,_t,0,0,0,Lt.width,Lt.height,St.depth,Mt,Yt,Lt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,_t,Vt,Lt.width,Lt.height,St.depth,0,Mt,Yt,Lt.data)}else{G&&wt&&e.texStorage2D(n.TEXTURE_2D,Ft,Vt,$t[0].width,$t[0].height);for(let _t=0,dt=$t.length;_t<dt;_t++)Lt=$t[_t],T.format!==An?Mt!==null?G?Rt&&e.compressedTexSubImage2D(n.TEXTURE_2D,_t,0,0,Lt.width,Lt.height,Mt,Lt.data):e.compressedTexImage2D(n.TEXTURE_2D,_t,Vt,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):G?Rt&&e.texSubImage2D(n.TEXTURE_2D,_t,0,0,Lt.width,Lt.height,Mt,Yt,Lt.data):e.texImage2D(n.TEXTURE_2D,_t,Vt,Lt.width,Lt.height,0,Mt,Yt,Lt.data)}else if(T.isDataArrayTexture)if(G){if(wt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,Ft,Vt,St.width,St.height,St.depth),Rt)if(T.layerUpdates.size>0){const _t=yl(St.width,St.height,T.format,T.type);for(const dt of T.layerUpdates){const Bt=St.data.subarray(dt*_t/St.data.BYTES_PER_ELEMENT,(dt+1)*_t/St.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,dt,St.width,St.height,1,Mt,Yt,Bt)}T.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,St.width,St.height,St.depth,Mt,Yt,St.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,Vt,St.width,St.height,St.depth,0,Mt,Yt,St.data);else if(T.isData3DTexture)G?(wt&&e.texStorage3D(n.TEXTURE_3D,Ft,Vt,St.width,St.height,St.depth),Rt&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,St.width,St.height,St.depth,Mt,Yt,St.data)):e.texImage3D(n.TEXTURE_3D,0,Vt,St.width,St.height,St.depth,0,Mt,Yt,St.data);else if(T.isFramebufferTexture){if(wt)if(G)e.texStorage2D(n.TEXTURE_2D,Ft,Vt,St.width,St.height);else{let _t=St.width,dt=St.height;for(let Bt=0;Bt<Ft;Bt++)e.texImage2D(n.TEXTURE_2D,Bt,Vt,_t,dt,0,Mt,Yt,null),_t>>=1,dt>>=1}}else if($t.length>0){if(G&&wt){const _t=Qt($t[0]);e.texStorage2D(n.TEXTURE_2D,Ft,Vt,_t.width,_t.height)}for(let _t=0,dt=$t.length;_t<dt;_t++)Lt=$t[_t],G?Rt&&e.texSubImage2D(n.TEXTURE_2D,_t,0,0,Mt,Yt,Lt):e.texImage2D(n.TEXTURE_2D,_t,Vt,Mt,Yt,Lt);T.generateMipmaps=!1}else if(G){if(wt){const _t=Qt(St);e.texStorage2D(n.TEXTURE_2D,Ft,Vt,_t.width,_t.height)}Rt&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Mt,Yt,St)}else e.texImage2D(n.TEXTURE_2D,0,Vt,Mt,Yt,St);m(T)&&p(it),Ht.__version=lt.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function rt(U,T,Z){if(T.image.length!==6)return;const it=At(U,T),gt=T.source;e.bindTexture(n.TEXTURE_CUBE_MAP,U.__webglTexture,n.TEXTURE0+Z);const lt=i.get(gt);if(gt.version!==lt.__version||it===!0){e.activeTexture(n.TEXTURE0+Z);const Ht=me.getPrimaries(me.workingColorSpace),Tt=T.colorSpace===si?null:me.getPrimaries(T.colorSpace),Gt=T.colorSpace===si||Ht===Tt?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);const qt=T.isCompressedTexture||T.image[0].isCompressedTexture,St=T.image[0]&&T.image[0].isDataTexture,Mt=[];for(let dt=0;dt<6;dt++)!qt&&!St?Mt[dt]=M(T.image[dt],!0,o.maxCubemapSize):Mt[dt]=St?T.image[dt].image:T.image[dt],Mt[dt]=Zt(T,Mt[dt]);const Yt=Mt[0],Vt=s.convert(T.format,T.colorSpace),Lt=s.convert(T.type),$t=x(T.internalFormat,Vt,Lt,T.colorSpace),G=T.isVideoTexture!==!0,wt=lt.__version===void 0||it===!0,Rt=gt.dataReady;let Ft=A(T,Yt);vt(n.TEXTURE_CUBE_MAP,T);let _t;if(qt){G&&wt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,Ft,$t,Yt.width,Yt.height);for(let dt=0;dt<6;dt++){_t=Mt[dt].mipmaps;for(let Bt=0;Bt<_t.length;Bt++){const Jt=_t[Bt];T.format!==An?Vt!==null?G?Rt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt,0,0,Jt.width,Jt.height,Vt,Jt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt,$t,Jt.width,Jt.height,0,Jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):G?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt,0,0,Jt.width,Jt.height,Vt,Lt,Jt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt,$t,Jt.width,Jt.height,0,Vt,Lt,Jt.data)}}}else{if(_t=T.mipmaps,G&&wt){_t.length>0&&Ft++;const dt=Qt(Mt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,Ft,$t,dt.width,dt.height)}for(let dt=0;dt<6;dt++)if(St){G?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Mt[dt].width,Mt[dt].height,Vt,Lt,Mt[dt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,$t,Mt[dt].width,Mt[dt].height,0,Vt,Lt,Mt[dt].data);for(let Bt=0;Bt<_t.length;Bt++){const _e=_t[Bt].image[dt].image;G?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt+1,0,0,_e.width,_e.height,Vt,Lt,_e.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt+1,$t,_e.width,_e.height,0,Vt,Lt,_e.data)}}else{G?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,0,0,Vt,Lt,Mt[dt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,0,$t,Vt,Lt,Mt[dt]);for(let Bt=0;Bt<_t.length;Bt++){const Jt=_t[Bt];G?Rt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt+1,0,0,Vt,Lt,Jt.image[dt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+dt,Bt+1,$t,Vt,Lt,Jt.image[dt])}}}m(T)&&p(n.TEXTURE_CUBE_MAP),lt.__version=gt.version,T.onUpdate&&T.onUpdate(T)}U.__version=T.version}function Pt(U,T,Z,it,gt,lt){const Ht=s.convert(Z.format,Z.colorSpace),Tt=s.convert(Z.type),Gt=x(Z.internalFormat,Ht,Tt,Z.colorSpace),qt=i.get(T),St=i.get(Z);if(St.__renderTarget=T,!qt.__hasExternalTextures){const Mt=Math.max(1,T.width>>lt),Yt=Math.max(1,T.height>>lt);gt===n.TEXTURE_3D||gt===n.TEXTURE_2D_ARRAY?e.texImage3D(gt,lt,Gt,Mt,Yt,T.depth,0,Ht,Tt,null):e.texImage2D(gt,lt,Gt,Mt,Yt,0,Ht,Tt,null)}e.bindFramebuffer(n.FRAMEBUFFER,U),yt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,it,gt,St.__webglTexture,0,Et(T)):(gt===n.TEXTURE_2D||gt>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&gt<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,it,gt,St.__webglTexture,lt),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Ot(U,T,Z){if(n.bindRenderbuffer(n.RENDERBUFFER,U),T.depthBuffer){const it=T.depthTexture,gt=it&&it.isDepthTexture?it.type:null,lt=y(T.stencilBuffer,gt),Ht=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Tt=Et(T);yt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Tt,lt,T.width,T.height):Z?n.renderbufferStorageMultisample(n.RENDERBUFFER,Tt,lt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,lt,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ht,n.RENDERBUFFER,U)}else{const it=T.textures;for(let gt=0;gt<it.length;gt++){const lt=it[gt],Ht=s.convert(lt.format,lt.colorSpace),Tt=s.convert(lt.type),Gt=x(lt.internalFormat,Ht,Tt,lt.colorSpace),qt=Et(T);Z&&yt(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,qt,Gt,T.width,T.height):yt(T)?r.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,qt,Gt,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Gt,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Ut(U,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,U),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const it=i.get(T.depthTexture);it.__renderTarget=T,(!it.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),W(T.depthTexture,0);const gt=it.__webglTexture,lt=Et(T);if(T.depthTexture.format===Oo)yt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,gt,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,gt,0);else if(T.depthTexture.format===Fo)yt(T)?r.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,gt,0,lt):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,gt,0);else throw new Error("Unknown depthTexture format")}function jt(U){const T=i.get(U),Z=U.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==U.depthTexture){const it=U.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),it){const gt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,it.removeEventListener("dispose",gt)};it.addEventListener("dispose",gt),T.__depthDisposeCallback=gt}T.__boundDepthTexture=it}if(U.depthTexture&&!T.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");const it=U.texture.mipmaps;it&&it.length>0?Ut(T.__webglFramebuffer[0],U):Ut(T.__webglFramebuffer,U)}else if(Z){T.__webglDepthbuffer=[];for(let it=0;it<6;it++)if(e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[it]),T.__webglDepthbuffer[it]===void 0)T.__webglDepthbuffer[it]=n.createRenderbuffer(),Ot(T.__webglDepthbuffer[it],U,!1);else{const gt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=T.__webglDepthbuffer[it];n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,gt,n.RENDERBUFFER,lt)}}else{const it=U.texture.mipmaps;if(it&&it.length>0?e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),Ot(T.__webglDepthbuffer,U,!1);else{const gt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,lt=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,lt),n.framebufferRenderbuffer(n.FRAMEBUFFER,gt,n.RENDERBUFFER,lt)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function ee(U,T,Z){const it=i.get(U);T!==void 0&&Pt(it.__webglFramebuffer,U,U.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),Z!==void 0&&jt(U)}function F(U){const T=U.texture,Z=i.get(U),it=i.get(T);U.addEventListener("dispose",C);const gt=U.textures,lt=U.isWebGLCubeRenderTarget===!0,Ht=gt.length>1;if(Ht||(it.__webglTexture===void 0&&(it.__webglTexture=n.createTexture()),it.__version=T.version,a.memory.textures++),lt){Z.__webglFramebuffer=[];for(let Tt=0;Tt<6;Tt++)if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer[Tt]=[];for(let Gt=0;Gt<T.mipmaps.length;Gt++)Z.__webglFramebuffer[Tt][Gt]=n.createFramebuffer()}else Z.__webglFramebuffer[Tt]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer=[];for(let Tt=0;Tt<T.mipmaps.length;Tt++)Z.__webglFramebuffer[Tt]=n.createFramebuffer()}else Z.__webglFramebuffer=n.createFramebuffer();if(Ht)for(let Tt=0,Gt=gt.length;Tt<Gt;Tt++){const qt=i.get(gt[Tt]);qt.__webglTexture===void 0&&(qt.__webglTexture=n.createTexture(),a.memory.textures++)}if(U.samples>0&&yt(U)===!1){Z.__webglMultisampledFramebuffer=n.createFramebuffer(),Z.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let Tt=0;Tt<gt.length;Tt++){const Gt=gt[Tt];Z.__webglColorRenderbuffer[Tt]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,Z.__webglColorRenderbuffer[Tt]);const qt=s.convert(Gt.format,Gt.colorSpace),St=s.convert(Gt.type),Mt=x(Gt.internalFormat,qt,St,Gt.colorSpace,U.isXRRenderTarget===!0),Yt=Et(U);n.renderbufferStorageMultisample(n.RENDERBUFFER,Yt,Mt,U.width,U.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Tt,n.RENDERBUFFER,Z.__webglColorRenderbuffer[Tt])}n.bindRenderbuffer(n.RENDERBUFFER,null),U.depthBuffer&&(Z.__webglDepthRenderbuffer=n.createRenderbuffer(),Ot(Z.__webglDepthRenderbuffer,U,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(lt){e.bindTexture(n.TEXTURE_CUBE_MAP,it.__webglTexture),vt(n.TEXTURE_CUBE_MAP,T);for(let Tt=0;Tt<6;Tt++)if(T.mipmaps&&T.mipmaps.length>0)for(let Gt=0;Gt<T.mipmaps.length;Gt++)Pt(Z.__webglFramebuffer[Tt][Gt],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,Gt);else Pt(Z.__webglFramebuffer[Tt],U,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+Tt,0);m(T)&&p(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Ht){for(let Tt=0,Gt=gt.length;Tt<Gt;Tt++){const qt=gt[Tt],St=i.get(qt);let Mt=n.TEXTURE_2D;(U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Mt=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Mt,St.__webglTexture),vt(Mt,qt),Pt(Z.__webglFramebuffer,U,qt,n.COLOR_ATTACHMENT0+Tt,Mt,0),m(qt)&&p(Mt)}e.unbindTexture()}else{let Tt=n.TEXTURE_2D;if((U.isWebGL3DRenderTarget||U.isWebGLArrayRenderTarget)&&(Tt=U.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(Tt,it.__webglTexture),vt(Tt,T),T.mipmaps&&T.mipmaps.length>0)for(let Gt=0;Gt<T.mipmaps.length;Gt++)Pt(Z.__webglFramebuffer[Gt],U,T,n.COLOR_ATTACHMENT0,Tt,Gt);else Pt(Z.__webglFramebuffer,U,T,n.COLOR_ATTACHMENT0,Tt,0);m(T)&&p(Tt),e.unbindTexture()}U.depthBuffer&&jt(U)}function pt(U){const T=U.textures;for(let Z=0,it=T.length;Z<it;Z++){const gt=T[Z];if(m(gt)){const lt=S(U),Ht=i.get(gt).__webglTexture;e.bindTexture(lt,Ht),p(lt),e.unbindTexture()}}}const ut=[],ht=[];function Q(U){if(U.samples>0){if(yt(U)===!1){const T=U.textures,Z=U.width,it=U.height;let gt=n.COLOR_BUFFER_BIT;const lt=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ht=i.get(U),Tt=T.length>1;if(Tt)for(let qt=0;qt<T.length;qt++)e.bindFramebuffer(n.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+qt,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,Ht.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+qt,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer);const Gt=U.texture.mipmaps;Gt&&Gt.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ht.__webglFramebuffer);for(let qt=0;qt<T.length;qt++){if(U.resolveDepthBuffer&&(U.depthBuffer&&(gt|=n.DEPTH_BUFFER_BIT),U.stencilBuffer&&U.resolveStencilBuffer&&(gt|=n.STENCIL_BUFFER_BIT)),Tt){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ht.__webglColorRenderbuffer[qt]);const St=i.get(T[qt]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,St,0)}n.blitFramebuffer(0,0,Z,it,0,0,Z,it,gt,n.NEAREST),c===!0&&(ut.length=0,ht.length=0,ut.push(n.COLOR_ATTACHMENT0+qt),U.depthBuffer&&U.resolveDepthBuffer===!1&&(ut.push(lt),ht.push(lt),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ht)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ut))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),Tt)for(let qt=0;qt<T.length;qt++){e.bindFramebuffer(n.FRAMEBUFFER,Ht.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+qt,n.RENDERBUFFER,Ht.__webglColorRenderbuffer[qt]);const St=i.get(T[qt]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,Ht.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+qt,n.TEXTURE_2D,St,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ht.__webglMultisampledFramebuffer)}else if(U.depthBuffer&&U.resolveDepthBuffer===!1&&c){const T=U.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function Et(U){return Math.min(o.maxSamples,U.samples)}function yt(U){const T=i.get(U);return U.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Ct(U){const T=a.render.frame;h.get(U)!==T&&(h.set(U,T),U.update())}function Zt(U,T){const Z=U.colorSpace,it=U.format,gt=U.type;return U.isCompressedTexture===!0||U.isVideoTexture===!0||Z!==so&&Z!==si&&(me.getTransfer(Z)===xe?(it!==An||gt!==Un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),T}function Qt(U){return typeof HTMLImageElement<"u"&&U instanceof HTMLImageElement?(l.width=U.naturalWidth||U.width,l.height=U.naturalHeight||U.height):typeof VideoFrame<"u"&&U instanceof VideoFrame?(l.width=U.displayWidth,l.height=U.displayHeight):(l.width=U.width,l.height=U.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=z,this.setTexture2D=W,this.setTexture2DArray=q,this.setTexture3D=tt,this.setTextureCube=Y,this.rebindTextures=ee,this.setupRenderTarget=F,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=Q,this.setupDepthRenderbuffer=jt,this.setupFrameBufferTexture=Pt,this.useMultisampledRTT=yt}function z1(n,t){function e(i,o=si){let s;const a=me.getTransfer(o);if(i===Un)return n.UNSIGNED_BYTE;if(i===Mc)return n.UNSIGNED_SHORT_4_4_4_4;if(i===xc)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ch)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Rh)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ah)return n.BYTE;if(i===Ph)return n.SHORT;if(i===No)return n.UNSIGNED_SHORT;if(i===_c)return n.INT;if(i===Ai)return n.UNSIGNED_INT;if(i===Gn)return n.FLOAT;if(i===jo)return n.HALF_FLOAT;if(i===Ih)return n.ALPHA;if(i===Dh)return n.RGB;if(i===An)return n.RGBA;if(i===Oo)return n.DEPTH_COMPONENT;if(i===Fo)return n.DEPTH_STENCIL;if(i===yc)return n.RED;if(i===bc)return n.RED_INTEGER;if(i===Lh)return n.RG;if(i===Sc)return n.RG_INTEGER;if(i===wc)return n.RGBA_INTEGER;if(i===Fs||i===Bs||i===ks||i===Vs)if(a===xe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Fs)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Bs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ks)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Vs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Fs)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Bs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ks)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Vs)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===yr||i===br||i===Sr||i===wr)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===yr)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===br)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Sr)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===wr)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Er||i===Tr||i===Ar)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Er||i===Tr)return a===xe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Ar)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Pr||i===Cr||i===Rr||i===Ir||i===Dr||i===Lr||i===Ur||i===Nr||i===zr||i===Or||i===Fr||i===Br||i===kr||i===Vr)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Pr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Cr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Rr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ir)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Dr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Lr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ur)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Nr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===zr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Or)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Fr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Br)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===kr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Vr)return a===xe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Hr||i===Gr||i===qr)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Hr)return a===xe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Gr)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===qr)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wr||i===Xr||i===jr||i===Yr)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Wr)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Xr)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===jr)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Yr)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===zo?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}const O1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,F1=`
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

}`;class B1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new Zh(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new li({vertexShader:O1,fragmentShader:F1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new v(new ze(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class k1 extends lo{constructor(t,e){super();const i=this;let o=null,s=1,a=null,r="local-floor",c=1,l=null,h=null,d=null,u=null,f=null,g=null;const M=typeof XRWebGLBinding<"u",m=new B1,p={},S=e.getContextAttributes();let x=null,y=null;const A=[],P=[],C=new Dt;let D=null;const E=new sn;E.viewport=new Te;const b=new sn;b.viewport=new Te;const L=[E,b],z=new ap;let B=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let rt=A[K];return rt===void 0&&(rt=new za,A[K]=rt),rt.getTargetRaySpace()},this.getControllerGrip=function(K){let rt=A[K];return rt===void 0&&(rt=new za,A[K]=rt),rt.getGripSpace()},this.getHand=function(K){let rt=A[K];return rt===void 0&&(rt=new za,A[K]=rt),rt.getHandSpace()};function W(K){const rt=P.indexOf(K.inputSource);if(rt===-1)return;const Pt=A[rt];Pt!==void 0&&(Pt.update(K.inputSource,K.frame,l||a),Pt.dispatchEvent({type:K.type,data:K.inputSource}))}function q(){o.removeEventListener("select",W),o.removeEventListener("selectstart",W),o.removeEventListener("selectend",W),o.removeEventListener("squeeze",W),o.removeEventListener("squeezestart",W),o.removeEventListener("squeezeend",W),o.removeEventListener("end",q),o.removeEventListener("inputsourceschange",tt);for(let K=0;K<A.length;K++){const rt=P[K];rt!==null&&(P[K]=null,A[K].disconnect(rt))}B=null,H=null,m.reset();for(const K in p)delete p[K];t.setRenderTarget(x),f=null,u=null,d=null,o=null,y=null,ft.stop(),i.isPresenting=!1,t.setPixelRatio(D),t.setSize(C.width,C.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){s=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){r=K,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(K){l=K},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&M&&(d=new XRWebGLBinding(o,e)),d},this.getFrame=function(){return g},this.getSession=function(){return o},this.setSession=async function(K){if(o=K,o!==null){if(x=t.getRenderTarget(),o.addEventListener("select",W),o.addEventListener("selectstart",W),o.addEventListener("selectend",W),o.addEventListener("squeeze",W),o.addEventListener("squeezestart",W),o.addEventListener("squeezeend",W),o.addEventListener("end",q),o.addEventListener("inputsourceschange",tt),S.xrCompatible!==!0&&await e.makeXRCompatible(),D=t.getPixelRatio(),t.getSize(C),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let Pt=null,Ot=null,Ut=null;S.depth&&(Ut=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Pt=S.stencil?Fo:Oo,Ot=S.stencil?zo:Ai);const jt={colorFormat:e.RGBA8,depthFormat:Ut,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(jt),o.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Pi(u.textureWidth,u.textureHeight,{format:An,type:Un,depthTexture:new $h(u.textureWidth,u.textureHeight,Ot,void 0,void 0,void 0,void 0,void 0,void 0,Pt),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const Pt={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(o,e,Pt),o.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new Pi(f.framebufferWidth,f.framebufferHeight,{format:An,type:Un,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await o.requestReferenceSpace(r),ft.setContext(o),ft.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function tt(K){for(let rt=0;rt<K.removed.length;rt++){const Pt=K.removed[rt],Ot=P.indexOf(Pt);Ot>=0&&(P[Ot]=null,A[Ot].disconnect(Pt))}for(let rt=0;rt<K.added.length;rt++){const Pt=K.added[rt];let Ot=P.indexOf(Pt);if(Ot===-1){for(let jt=0;jt<A.length;jt++)if(jt>=P.length){P.push(Pt),Ot=jt;break}else if(P[jt]===null){P[jt]=Pt,Ot=jt;break}if(Ot===-1)break}const Ut=A[Ot];Ut&&Ut.connect(Pt)}}const Y=new N,st=new N;function j(K,rt,Pt){Y.setFromMatrixPosition(rt.matrixWorld),st.setFromMatrixPosition(Pt.matrixWorld);const Ot=Y.distanceTo(st),Ut=rt.projectionMatrix.elements,jt=Pt.projectionMatrix.elements,ee=Ut[14]/(Ut[10]-1),F=Ut[14]/(Ut[10]+1),pt=(Ut[9]+1)/Ut[5],ut=(Ut[9]-1)/Ut[5],ht=(Ut[8]-1)/Ut[0],Q=(jt[8]+1)/jt[0],Et=ee*ht,yt=ee*Q,Ct=Ot/(-ht+Q),Zt=Ct*-ht;if(rt.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(Zt),K.translateZ(Ct),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),Ut[10]===-1)K.projectionMatrix.copy(rt.projectionMatrix),K.projectionMatrixInverse.copy(rt.projectionMatrixInverse);else{const Qt=ee+Ct,U=F+Ct,T=Et-Zt,Z=yt+(Ot-Zt),it=pt*F/U*Qt,gt=ut*F/U*Qt;K.projectionMatrix.makePerspective(T,Z,it,gt,Qt,U),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function mt(K,rt){rt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(rt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(o===null)return;let rt=K.near,Pt=K.far;m.texture!==null&&(m.depthNear>0&&(rt=m.depthNear),m.depthFar>0&&(Pt=m.depthFar)),z.near=b.near=E.near=rt,z.far=b.far=E.far=Pt,(B!==z.near||H!==z.far)&&(o.updateRenderState({depthNear:z.near,depthFar:z.far}),B=z.near,H=z.far),z.layers.mask=K.layers.mask|6,E.layers.mask=z.layers.mask&3,b.layers.mask=z.layers.mask&5;const Ot=K.parent,Ut=z.cameras;mt(z,Ot);for(let jt=0;jt<Ut.length;jt++)mt(Ut[jt],Ot);Ut.length===2?j(z,E,b):z.projectionMatrix.copy(E.projectionMatrix),vt(K,z,Ot)};function vt(K,rt,Pt){Pt===null?K.matrix.copy(rt.matrixWorld):(K.matrix.copy(Pt.matrixWorld),K.matrix.invert(),K.matrix.multiply(rt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(rt.projectionMatrix),K.projectionMatrixInverse.copy(rt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Bo*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(u===null&&f===null))return c},this.setFoveation=function(K){c=K,u!==null&&(u.fixedFoveation=K),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(K){return p[K]};let At=null;function V(K,rt){if(h=rt.getViewerPose(l||a),g=rt,h!==null){const Pt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let Ot=!1;Pt.length!==z.cameras.length&&(z.cameras.length=0,Ot=!0);for(let F=0;F<Pt.length;F++){const pt=Pt[F];let ut=null;if(f!==null)ut=f.getViewport(pt);else{const Q=d.getViewSubImage(u,pt);ut=Q.viewport,F===0&&(t.setRenderTargetTextures(y,Q.colorTexture,Q.depthStencilTexture),t.setRenderTarget(y))}let ht=L[F];ht===void 0&&(ht=new sn,ht.layers.enable(F),ht.viewport=new Te,L[F]=ht),ht.matrix.fromArray(pt.transform.matrix),ht.matrix.decompose(ht.position,ht.quaternion,ht.scale),ht.projectionMatrix.fromArray(pt.projectionMatrix),ht.projectionMatrixInverse.copy(ht.projectionMatrix).invert(),ht.viewport.set(ut.x,ut.y,ut.width,ut.height),F===0&&(z.matrix.copy(ht.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),Ot===!0&&z.cameras.push(ht)}const Ut=o.enabledFeatures;if(Ut&&Ut.includes("depth-sensing")&&o.depthUsage=="gpu-optimized"&&M){d=i.getBinding();const F=d.getDepthInformation(Pt[0]);F&&F.isValid&&F.texture&&m.init(F,o.renderState)}if(Ut&&Ut.includes("camera-access")&&M){t.state.unbindTexture(),d=i.getBinding();for(let F=0;F<Pt.length;F++){const pt=Pt[F].camera;if(pt){let ut=p[pt];ut||(ut=new Zh,p[pt]=ut);const ht=d.getCameraImage(pt);ut.sourceTexture=ht}}}}for(let Pt=0;Pt<A.length;Pt++){const Ot=P[Pt],Ut=A[Pt];Ot!==null&&Ut!==void 0&&Ut.update(Ot,rt,l||a)}At&&At(K,rt),rt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:rt}),g=null}const ft=new cd;ft.setAnimationLoop(V),this.setAnimationLoop=function(K){At=K},this.dispose=function(){}}}const _i=new Yn,V1=new Ee;function H1(n,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,Gh(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function o(m,p,S,x,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?s(m,p):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),h(m,p)):p.isMeshStandardMaterial?(s(m,p),u(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),M(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(a(m,p),p.isLineDashedMaterial&&r(m,p)):p.isPointsMaterial?c(m,p,S,x):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Qe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Qe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),x=S.envMap,y=S.envMapRotation;x&&(m.envMap.value=x,_i.copy(y),_i.x*=-1,_i.y*=-1,_i.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),m.envMapRotation.value.setFromMatrix4(V1.makeRotationFromEuler(_i)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function a(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function r(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,x){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=x*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function u(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Qe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function M(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:o}}function G1(n,t,e,i){let o={},s={},a=[];const r=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,x){const y=x.program;i.uniformBlockBinding(S,y)}function l(S,x){let y=o[S.id];y===void 0&&(g(S),y=h(S),o[S.id]=y,S.addEventListener("dispose",m));const A=x.program;i.updateUBOMapping(S,A);const P=t.render.frame;s[S.id]!==P&&(u(S),s[S.id]=P)}function h(S){const x=d();S.__bindingPointIndex=x;const y=n.createBuffer(),A=S.__size,P=S.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,A,P),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function d(){for(let S=0;S<r;S++)if(a.indexOf(S)===-1)return a.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(S){const x=o[S.id],y=S.uniforms,A=S.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let P=0,C=y.length;P<C;P++){const D=Array.isArray(y[P])?y[P]:[y[P]];for(let E=0,b=D.length;E<b;E++){const L=D[E];if(f(L,P,E,A)===!0){const z=L.__offset,B=Array.isArray(L.value)?L.value:[L.value];let H=0;for(let W=0;W<B.length;W++){const q=B[W],tt=M(q);typeof q=="number"||typeof q=="boolean"?(L.__data[0]=q,n.bufferSubData(n.UNIFORM_BUFFER,z+H,L.__data)):q.isMatrix3?(L.__data[0]=q.elements[0],L.__data[1]=q.elements[1],L.__data[2]=q.elements[2],L.__data[3]=0,L.__data[4]=q.elements[3],L.__data[5]=q.elements[4],L.__data[6]=q.elements[5],L.__data[7]=0,L.__data[8]=q.elements[6],L.__data[9]=q.elements[7],L.__data[10]=q.elements[8],L.__data[11]=0):(q.toArray(L.__data,H),H+=tt.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,L.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(S,x,y,A){const P=S.value,C=x+"_"+y;if(A[C]===void 0)return typeof P=="number"||typeof P=="boolean"?A[C]=P:A[C]=P.clone(),!0;{const D=A[C];if(typeof P=="number"||typeof P=="boolean"){if(D!==P)return A[C]=P,!0}else if(D.equals(P)===!1)return D.copy(P),!0}return!1}function g(S){const x=S.uniforms;let y=0;const A=16;for(let C=0,D=x.length;C<D;C++){const E=Array.isArray(x[C])?x[C]:[x[C]];for(let b=0,L=E.length;b<L;b++){const z=E[b],B=Array.isArray(z.value)?z.value:[z.value];for(let H=0,W=B.length;H<W;H++){const q=B[H],tt=M(q),Y=y%A,st=Y%tt.boundary,j=Y+st;y+=st,j!==0&&A-j<tt.storage&&(y+=A-j),z.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=y,y+=tt.storage}}}const P=y%A;return P>0&&(y+=A-P),S.__size=y,S.__cache={},this}function M(S){const x={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(x.boundary=4,x.storage=4):S.isVector2?(x.boundary=8,x.storage=8):S.isVector3||S.isColor?(x.boundary=16,x.storage=12):S.isVector4?(x.boundary=16,x.storage=16):S.isMatrix3?(x.boundary=48,x.storage=48):S.isMatrix4?(x.boundary=64,x.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),x}function m(S){const x=S.target;x.removeEventListener("dispose",m);const y=a.indexOf(x.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(o[x.id]),delete o[x.id],delete s[x.id]}function p(){for(const S in o)n.deleteBuffer(o[S]);a=[],o={},s={}}return{bind:c,update:l,dispose:p}}class fd{constructor(t={}){const{canvas:e=qu(),context:i=null,depth:o=!0,stencil:s=!1,alpha:a=!1,antialias:r=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=t;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=a;const g=new Uint32Array(4),M=new Int32Array(4);let m=null,p=null;const S=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ci,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const y=this;let A=!1;this._outputColorSpace=Ke;let P=0,C=0,D=null,E=-1,b=null;const L=new Te,z=new Te;let B=null;const H=new le(0);let W=0,q=e.width,tt=e.height,Y=1,st=null,j=null;const mt=new Te(0,0,q,tt),vt=new Te(0,0,q,tt);let At=!1;const V=new Pc;let ft=!1,K=!1;const rt=new Ee,Pt=new N,Ot=new Te,Ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let jt=!1;function ee(){return D===null?Y:1}let F=i;function pt(I,X){return e.getContext(I,X)}try{const I={alpha:!0,depth:o,stencil:s,antialias:r,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${vc}`),e.addEventListener("webglcontextlost",Rt,!1),e.addEventListener("webglcontextrestored",Ft,!1),e.addEventListener("webglcontextcreationerror",_t,!1),F===null){const X="webgl2";if(F=pt(X,I),F===null)throw pt(X)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(I){throw console.error("THREE.WebGLRenderer: "+I.message),I}let ut,ht,Q,Et,yt,Ct,Zt,Qt,U,T,Z,it,gt,lt,Ht,Tt,Gt,qt,St,Mt,Yt,Vt,Lt,$t;function G(){ut=new tg(F),ut.init(),Vt=new z1(F,ut),ht=new jm(F,ut,t,Vt),Q=new U1(F,ut),ht.reversedDepthBuffer&&u&&Q.buffers.depth.setReversed(!0),Et=new ig(F),yt=new y1,Ct=new N1(F,ut,Q,yt,ht,Vt,Et),Zt=new $m(y),Qt=new Qm(y),U=new lp(F),Lt=new Wm(F,U),T=new eg(F,U,Et,Lt),Z=new sg(F,T,U,Et),St=new og(F,ht,Ct),Tt=new Ym(yt),it=new x1(y,Zt,Qt,ut,ht,Lt,Tt),gt=new H1(y,yt),lt=new S1,Ht=new C1(ut),qt=new qm(y,Zt,Qt,Q,Z,f,c),Gt=new D1(y,Z,ht),$t=new G1(F,Et,ht,Q),Mt=new Xm(F,ut,Et),Yt=new ng(F,ut,Et),Et.programs=it.programs,y.capabilities=ht,y.extensions=ut,y.properties=yt,y.renderLists=lt,y.shadowMap=Gt,y.state=Q,y.info=Et}G();const wt=new k1(y,F);this.xr=wt,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){const I=ut.get("WEBGL_lose_context");I&&I.loseContext()},this.forceContextRestore=function(){const I=ut.get("WEBGL_lose_context");I&&I.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(I){I!==void 0&&(Y=I,this.setSize(q,tt,!1))},this.getSize=function(I){return I.set(q,tt)},this.setSize=function(I,X,ot=!0){if(wt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=I,tt=X,e.width=Math.floor(I*Y),e.height=Math.floor(X*Y),ot===!0&&(e.style.width=I+"px",e.style.height=X+"px"),this.setViewport(0,0,I,X)},this.getDrawingBufferSize=function(I){return I.set(q*Y,tt*Y).floor()},this.setDrawingBufferSize=function(I,X,ot){q=I,tt=X,Y=ot,e.width=Math.floor(I*ot),e.height=Math.floor(X*ot),this.setViewport(0,0,I,X)},this.getCurrentViewport=function(I){return I.copy(L)},this.getViewport=function(I){return I.copy(mt)},this.setViewport=function(I,X,ot,at){I.isVector4?mt.set(I.x,I.y,I.z,I.w):mt.set(I,X,ot,at),Q.viewport(L.copy(mt).multiplyScalar(Y).round())},this.getScissor=function(I){return I.copy(vt)},this.setScissor=function(I,X,ot,at){I.isVector4?vt.set(I.x,I.y,I.z,I.w):vt.set(I,X,ot,at),Q.scissor(z.copy(vt).multiplyScalar(Y).round())},this.getScissorTest=function(){return At},this.setScissorTest=function(I){Q.setScissorTest(At=I)},this.setOpaqueSort=function(I){st=I},this.setTransparentSort=function(I){j=I},this.getClearColor=function(I){return I.copy(qt.getClearColor())},this.setClearColor=function(){qt.setClearColor(...arguments)},this.getClearAlpha=function(){return qt.getClearAlpha()},this.setClearAlpha=function(){qt.setClearAlpha(...arguments)},this.clear=function(I=!0,X=!0,ot=!0){let at=0;if(I){let $=!1;if(D!==null){const xt=D.texture.format;$=xt===wc||xt===Sc||xt===bc}if($){const xt=D.texture.type,Nt=xt===Un||xt===Ai||xt===No||xt===zo||xt===Mc||xt===xc,kt=qt.getClearColor(),R=qt.getClearAlpha(),k=kt.r,J=kt.g,et=kt.b;Nt?(g[0]=k,g[1]=J,g[2]=et,g[3]=R,F.clearBufferuiv(F.COLOR,0,g)):(M[0]=k,M[1]=J,M[2]=et,M[3]=R,F.clearBufferiv(F.COLOR,0,M))}else at|=F.COLOR_BUFFER_BIT}X&&(at|=F.DEPTH_BUFFER_BIT),ot&&(at|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),F.clear(at)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Rt,!1),e.removeEventListener("webglcontextrestored",Ft,!1),e.removeEventListener("webglcontextcreationerror",_t,!1),qt.dispose(),lt.dispose(),Ht.dispose(),yt.dispose(),Zt.dispose(),Qt.dispose(),Z.dispose(),Lt.dispose(),$t.dispose(),it.dispose(),wt.dispose(),wt.removeEventListener("sessionstart",tn),wt.removeEventListener("sessionend",ts),gn.stop()};function Rt(I){I.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),A=!0}function Ft(){console.log("THREE.WebGLRenderer: Context Restored."),A=!1;const I=Et.autoReset,X=Gt.enabled,ot=Gt.autoUpdate,at=Gt.needsUpdate,$=Gt.type;G(),Et.autoReset=I,Gt.enabled=X,Gt.autoUpdate=ot,Gt.needsUpdate=at,Gt.type=$}function _t(I){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",I.statusMessage)}function dt(I){const X=I.target;X.removeEventListener("dispose",dt),Bt(X)}function Bt(I){Jt(I),yt.remove(I)}function Jt(I){const X=yt.get(I).programs;X!==void 0&&(X.forEach(function(ot){it.releaseProgram(ot)}),I.isShaderMaterial&&it.releaseShaderCache(I))}this.renderBufferDirect=function(I,X,ot,at,$,xt){X===null&&(X=Ut);const Nt=$.isMesh&&$.matrixWorld.determinant()<0,kt=os(I,X,ot,at,$);Q.setMaterial(at,Nt);let R=ot.index,k=1;if(at.wireframe===!0){if(R=T.getWireframeAttribute(ot),R===void 0)return;k=2}const J=ot.drawRange,et=ot.attributes.position;let bt=J.start*k,Wt=(J.start+J.count)*k;xt!==null&&(bt=Math.max(bt,xt.start*k),Wt=Math.min(Wt,(xt.start+xt.count)*k)),R!==null?(bt=Math.max(bt,0),Wt=Math.min(Wt,R.count)):et!=null&&(bt=Math.max(bt,0),Wt=Math.min(Wt,et.count));const ce=Wt-bt;if(ce<0||ce===1/0)return;Lt.setup($,at,kt,ot,R);let Kt,ne=Mt;if(R!==null&&(Kt=U.get(R),ne=Yt,ne.setIndex(Kt)),$.isMesh)at.wireframe===!0?(Q.setLineWidth(at.wireframeLinewidth*ee()),ne.setMode(F.LINES)):ne.setMode(F.TRIANGLES);else if($.isLine){let Xt=at.linewidth;Xt===void 0&&(Xt=1),Q.setLineWidth(Xt*ee()),$.isLineSegments?ne.setMode(F.LINES):$.isLineLoop?ne.setMode(F.LINE_LOOP):ne.setMode(F.LINE_STRIP)}else $.isPoints?ne.setMode(F.POINTS):$.isSprite&&ne.setMode(F.TRIANGLES);if($.isBatchedMesh)if($._multiDrawInstances!==null)ko("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ne.renderMultiDrawInstances($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount,$._multiDrawInstances);else if(ut.get("WEBGL_multi_draw"))ne.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const Xt=$._multiDrawStarts,ye=$._multiDrawCounts,ue=$._multiDrawCount,Ue=R?U.get(R).bytesPerElement:1,Jn=yt.get(at).currentProgram.getUniforms();for(let He=0;He<ue;He++)Jn.setValue(F,"_gl_DrawID",He),ne.render(Xt[He]/Ue,ye[He])}else if($.isInstancedMesh)ne.renderInstances(bt,ce,$.count);else if(ot.isInstancedBufferGeometry){const Xt=ot._maxInstanceCount!==void 0?ot._maxInstanceCount:1/0,ye=Math.min(ot.instanceCount,Xt);ne.renderInstances(bt,ce,ye)}else ne.render(bt,ce)};function _e(I,X,ot){I.transparent===!0&&I.side===wn&&I.forceSinglePass===!1?(I.side=Qe,I.needsUpdate=!0,Zn(I,X,ot),I.side=jn,I.needsUpdate=!0,Zn(I,X,ot),I.side=wn):Zn(I,X,ot)}this.compile=function(I,X,ot=null){ot===null&&(ot=I),p=Ht.get(ot),p.init(X),x.push(p),ot.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),I!==ot&&I.traverseVisible(function($){$.isLight&&$.layers.test(X.layers)&&(p.pushLight($),$.castShadow&&p.pushShadow($))}),p.setupLights();const at=new Set;return I.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const xt=$.material;if(xt)if(Array.isArray(xt))for(let Nt=0;Nt<xt.length;Nt++){const kt=xt[Nt];_e(kt,ot,$),at.add(kt)}else _e(xt,ot,$),at.add(xt)}),p=x.pop(),at},this.compileAsync=function(I,X,ot=null){const at=this.compile(I,X,ot);return new Promise($=>{function xt(){if(at.forEach(function(Nt){yt.get(Nt).currentProgram.isReady()&&at.delete(Nt)}),at.size===0){$(I);return}setTimeout(xt,10)}ut.get("KHR_parallel_shader_compile")!==null?xt():setTimeout(xt,10)})};let de=null;function rn(I){de&&de(I)}function tn(){gn.stop()}function ts(){gn.start()}const gn=new cd;gn.setAnimationLoop(rn),typeof self<"u"&&gn.setContext(self),this.setAnimationLoop=function(I){de=I,wt.setAnimationLoop(I),I===null?gn.stop():gn.start()},wt.addEventListener("sessionstart",tn),wt.addEventListener("sessionend",ts),this.render=function(I,X){if(X!==void 0&&X.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(A===!0)return;if(I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),X.parent===null&&X.matrixWorldAutoUpdate===!0&&X.updateMatrixWorld(),wt.enabled===!0&&wt.isPresenting===!0&&(wt.cameraAutoUpdate===!0&&wt.updateCamera(X),X=wt.getCamera()),I.isScene===!0&&I.onBeforeRender(y,I,X,D),p=Ht.get(I,x.length),p.init(X),x.push(p),rt.multiplyMatrices(X.projectionMatrix,X.matrixWorldInverse),V.setFromProjectionMatrix(rt,Rn,X.reversedDepth),K=this.localClippingEnabled,ft=Tt.init(this.clippingPlanes,K),m=lt.get(I,S.length),m.init(),S.push(m),wt.enabled===!0&&wt.isPresenting===!0){const xt=y.xr.getDepthSensingMesh();xt!==null&&mo(xt,X,-1/0,y.sortObjects)}mo(I,X,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(st,j),jt=wt.enabled===!1||wt.isPresenting===!1||wt.hasDepthSensing()===!1,jt&&qt.addToRenderList(m,I),this.info.render.frame++,ft===!0&&Tt.beginShadows();const ot=p.state.shadowsArray;Gt.render(ot,I,X),ft===!0&&Tt.endShadows(),this.info.autoReset===!0&&this.info.reset();const at=m.opaque,$=m.transmissive;if(p.setupLights(),X.isArrayCamera){const xt=X.cameras;if($.length>0)for(let Nt=0,kt=xt.length;Nt<kt;Nt++){const R=xt[Nt];es(at,$,I,R)}jt&&qt.render(I);for(let Nt=0,kt=xt.length;Nt<kt;Nt++){const R=xt[Nt];hi(m,I,R,R.viewport)}}else $.length>0&&es(at,$,I,X),jt&&qt.render(I),hi(m,I,X);D!==null&&C===0&&(Ct.updateMultisampleRenderTarget(D),Ct.updateRenderTargetMipmap(D)),I.isScene===!0&&I.onAfterRender(y,I,X),Lt.resetDefaultState(),E=-1,b=null,x.pop(),x.length>0?(p=x[x.length-1],ft===!0&&Tt.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function mo(I,X,ot,at){if(I.visible===!1)return;if(I.layers.test(X.layers)){if(I.isGroup)ot=I.renderOrder;else if(I.isLOD)I.autoUpdate===!0&&I.update(X);else if(I.isLight)p.pushLight(I),I.castShadow&&p.pushShadow(I);else if(I.isSprite){if(!I.frustumCulled||V.intersectsSprite(I)){at&&Ot.setFromMatrixPosition(I.matrixWorld).applyMatrix4(rt);const Nt=Z.update(I),kt=I.material;kt.visible&&m.push(I,Nt,kt,ot,Ot.z,null)}}else if((I.isMesh||I.isLine||I.isPoints)&&(!I.frustumCulled||V.intersectsObject(I))){const Nt=Z.update(I),kt=I.material;if(at&&(I.boundingSphere!==void 0?(I.boundingSphere===null&&I.computeBoundingSphere(),Ot.copy(I.boundingSphere.center)):(Nt.boundingSphere===null&&Nt.computeBoundingSphere(),Ot.copy(Nt.boundingSphere.center)),Ot.applyMatrix4(I.matrixWorld).applyMatrix4(rt)),Array.isArray(kt)){const R=Nt.groups;for(let k=0,J=R.length;k<J;k++){const et=R[k],bt=kt[et.materialIndex];bt&&bt.visible&&m.push(I,Nt,bt,ot,Ot.z,et)}}else kt.visible&&m.push(I,Nt,kt,ot,Ot.z,null)}}const xt=I.children;for(let Nt=0,kt=xt.length;Nt<kt;Nt++)mo(xt[Nt],X,ot,at)}function hi(I,X,ot,at){const $=I.opaque,xt=I.transmissive,Nt=I.transparent;p.setupLightsView(ot),ft===!0&&Tt.setGlobalState(y.clippingPlanes,ot),at&&Q.viewport(L.copy(at)),$.length>0&&$n($,X,ot),xt.length>0&&$n(xt,X,ot),Nt.length>0&&$n(Nt,X,ot),Q.buffers.depth.setTest(!0),Q.buffers.depth.setMask(!0),Q.buffers.color.setMask(!0),Q.setPolygonOffset(!1)}function es(I,X,ot,at){if((ot.isScene===!0?ot.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[at.id]===void 0&&(p.state.transmissionRenderTarget[at.id]=new Pi(1,1,{generateMipmaps:!0,type:ut.has("EXT_color_buffer_half_float")||ut.has("EXT_color_buffer_float")?jo:Un,minFilter:Ei,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:me.workingColorSpace}));const xt=p.state.transmissionRenderTarget[at.id],Nt=at.viewport||L;xt.setSize(Nt.z*y.transmissionResolutionScale,Nt.w*y.transmissionResolutionScale);const kt=y.getRenderTarget(),R=y.getActiveCubeFace(),k=y.getActiveMipmapLevel();y.setRenderTarget(xt),y.getClearColor(H),W=y.getClearAlpha(),W<1&&y.setClearColor(16777215,.5),y.clear(),jt&&qt.render(ot);const J=y.toneMapping;y.toneMapping=ci;const et=at.viewport;if(at.viewport!==void 0&&(at.viewport=void 0),p.setupLightsView(at),ft===!0&&Tt.setGlobalState(y.clippingPlanes,at),$n(I,ot,at),Ct.updateMultisampleRenderTarget(xt),Ct.updateRenderTargetMipmap(xt),ut.has("WEBGL_multisampled_render_to_texture")===!1){let bt=!1;for(let Wt=0,ce=X.length;Wt<ce;Wt++){const Kt=X[Wt],ne=Kt.object,Xt=Kt.geometry,ye=Kt.material,ue=Kt.group;if(ye.side===wn&&ne.layers.test(at.layers)){const Ue=ye.side;ye.side=Qe,ye.needsUpdate=!0,go(ne,ot,at,Xt,ye,ue),ye.side=Ue,ye.needsUpdate=!0,bt=!0}}bt===!0&&(Ct.updateMultisampleRenderTarget(xt),Ct.updateRenderTargetMipmap(xt))}y.setRenderTarget(kt,R,k),y.setClearColor(H,W),et!==void 0&&(at.viewport=et),y.toneMapping=J}function $n(I,X,ot){const at=X.isScene===!0?X.overrideMaterial:null;for(let $=0,xt=I.length;$<xt;$++){const Nt=I[$],kt=Nt.object,R=Nt.geometry,k=Nt.group;let J=Nt.material;J.allowOverride===!0&&at!==null&&(J=at),kt.layers.test(ot.layers)&&go(kt,X,ot,R,J,k)}}function go(I,X,ot,at,$,xt){I.onBeforeRender(y,X,ot,at,$,xt),I.modelViewMatrix.multiplyMatrices(ot.matrixWorldInverse,I.matrixWorld),I.normalMatrix.getNormalMatrix(I.modelViewMatrix),$.onBeforeRender(y,X,ot,at,I,xt),$.transparent===!0&&$.side===wn&&$.forceSinglePass===!1?($.side=Qe,$.needsUpdate=!0,y.renderBufferDirect(ot,X,at,$,I,xt),$.side=jn,$.needsUpdate=!0,y.renderBufferDirect(ot,X,at,$,I,xt),$.side=wn):y.renderBufferDirect(ot,X,at,$,I,xt),I.onAfterRender(y,X,ot,at,$,xt)}function Zn(I,X,ot){X.isScene!==!0&&(X=Ut);const at=yt.get(I),$=p.state.lights,xt=p.state.shadowsArray,Nt=$.state.version,kt=it.getParameters(I,$.state,xt,X,ot),R=it.getProgramCacheKey(kt);let k=at.programs;at.environment=I.isMeshStandardMaterial?X.environment:null,at.fog=X.fog,at.envMap=(I.isMeshStandardMaterial?Qt:Zt).get(I.envMap||at.environment),at.envMapRotation=at.environment!==null&&I.envMap===null?X.environmentRotation:I.envMapRotation,k===void 0&&(I.addEventListener("dispose",dt),k=new Map,at.programs=k);let J=k.get(R);if(J!==void 0){if(at.currentProgram===J&&at.lightsStateVersion===Nt)return is(I,kt),J}else kt.uniforms=it.getUniforms(I),I.onBeforeCompile(kt,y),J=it.acquireProgram(kt,R),k.set(R,J),at.uniforms=kt.uniforms;const et=at.uniforms;return(!I.isShaderMaterial&&!I.isRawShaderMaterial||I.clipping===!0)&&(et.clippingPlanes=Tt.uniform),is(I,kt),at.needsLights=vo(I),at.lightsStateVersion=Nt,at.needsLights&&(et.ambientLightColor.value=$.state.ambient,et.lightProbe.value=$.state.probe,et.directionalLights.value=$.state.directional,et.directionalLightShadows.value=$.state.directionalShadow,et.spotLights.value=$.state.spot,et.spotLightShadows.value=$.state.spotShadow,et.rectAreaLights.value=$.state.rectArea,et.ltc_1.value=$.state.rectAreaLTC1,et.ltc_2.value=$.state.rectAreaLTC2,et.pointLights.value=$.state.point,et.pointLightShadows.value=$.state.pointShadow,et.hemisphereLights.value=$.state.hemi,et.directionalShadowMap.value=$.state.directionalShadowMap,et.directionalShadowMatrix.value=$.state.directionalShadowMatrix,et.spotShadowMap.value=$.state.spotShadowMap,et.spotLightMatrix.value=$.state.spotLightMatrix,et.spotLightMap.value=$.state.spotLightMap,et.pointShadowMap.value=$.state.pointShadowMap,et.pointShadowMatrix.value=$.state.pointShadowMatrix),at.currentProgram=J,at.uniformsList=null,J}function ns(I){if(I.uniformsList===null){const X=I.currentProgram.getUniforms();I.uniformsList=Hs.seqWithValue(X.seq,I.uniforms)}return I.uniformsList}function is(I,X){const ot=yt.get(I);ot.outputColorSpace=X.outputColorSpace,ot.batching=X.batching,ot.batchingColor=X.batchingColor,ot.instancing=X.instancing,ot.instancingColor=X.instancingColor,ot.instancingMorph=X.instancingMorph,ot.skinning=X.skinning,ot.morphTargets=X.morphTargets,ot.morphNormals=X.morphNormals,ot.morphColors=X.morphColors,ot.morphTargetsCount=X.morphTargetsCount,ot.numClippingPlanes=X.numClippingPlanes,ot.numIntersection=X.numClipIntersection,ot.vertexAlphas=X.vertexAlphas,ot.vertexTangents=X.vertexTangents,ot.toneMapping=X.toneMapping}function os(I,X,ot,at,$){X.isScene!==!0&&(X=Ut),Ct.resetTextureUnits();const xt=X.fog,Nt=at.isMeshStandardMaterial?X.environment:null,kt=D===null?y.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:so,R=(at.isMeshStandardMaterial?Qt:Zt).get(at.envMap||Nt),k=at.vertexColors===!0&&!!ot.attributes.color&&ot.attributes.color.itemSize===4,J=!!ot.attributes.tangent&&(!!at.normalMap||at.anisotropy>0),et=!!ot.morphAttributes.position,bt=!!ot.morphAttributes.normal,Wt=!!ot.morphAttributes.color;let ce=ci;at.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ce=y.toneMapping);const Kt=ot.morphAttributes.position||ot.morphAttributes.normal||ot.morphAttributes.color,ne=Kt!==void 0?Kt.length:0,Xt=yt.get(at),ye=p.state.lights;if(ft===!0&&(K===!0||I!==b)){const Ge=I===b&&at.id===E;Tt.setState(at,I,Ge)}let ue=!1;at.version===Xt.__version?(Xt.needsLights&&Xt.lightsStateVersion!==ye.state.version||Xt.outputColorSpace!==kt||$.isBatchedMesh&&Xt.batching===!1||!$.isBatchedMesh&&Xt.batching===!0||$.isBatchedMesh&&Xt.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&Xt.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&Xt.instancing===!1||!$.isInstancedMesh&&Xt.instancing===!0||$.isSkinnedMesh&&Xt.skinning===!1||!$.isSkinnedMesh&&Xt.skinning===!0||$.isInstancedMesh&&Xt.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Xt.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Xt.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Xt.instancingMorph===!1&&$.morphTexture!==null||Xt.envMap!==R||at.fog===!0&&Xt.fog!==xt||Xt.numClippingPlanes!==void 0&&(Xt.numClippingPlanes!==Tt.numPlanes||Xt.numIntersection!==Tt.numIntersection)||Xt.vertexAlphas!==k||Xt.vertexTangents!==J||Xt.morphTargets!==et||Xt.morphNormals!==bt||Xt.morphColors!==Wt||Xt.toneMapping!==ce||Xt.morphTargetsCount!==ne)&&(ue=!0):(ue=!0,Xt.__version=at.version);let Ue=Xt.currentProgram;ue===!0&&(Ue=Zn(at,X,$));let Jn=!1,He=!1,di=!1;const Se=Ue.getUniforms(),cn=Xt.uniforms;if(Q.useProgram(Ue.program)&&(Jn=!0,He=!0,di=!0),at.id!==E&&(E=at.id,He=!0),Jn||b!==I){Q.buffers.depth.getReversed()&&I.reversedDepth!==!0&&(I._reversedDepth=!0,I.updateProjectionMatrix()),Se.setValue(F,"projectionMatrix",I.projectionMatrix),Se.setValue(F,"viewMatrix",I.matrixWorldInverse);const Ze=Se.map.cameraPosition;Ze!==void 0&&Ze.setValue(F,Pt.setFromMatrixPosition(I.matrixWorld)),ht.logarithmicDepthBuffer&&Se.setValue(F,"logDepthBufFC",2/(Math.log(I.far+1)/Math.LN2)),(at.isMeshPhongMaterial||at.isMeshToonMaterial||at.isMeshLambertMaterial||at.isMeshBasicMaterial||at.isMeshStandardMaterial||at.isShaderMaterial)&&Se.setValue(F,"isOrthographic",I.isOrthographicCamera===!0),b!==I&&(b=I,He=!0,di=!0)}if($.isSkinnedMesh){Se.setOptional(F,$,"bindMatrix"),Se.setOptional(F,$,"bindMatrixInverse");const Ge=$.skeleton;Ge&&(Ge.boneTexture===null&&Ge.computeBoneTexture(),Se.setValue(F,"boneTexture",Ge.boneTexture,Ct))}$.isBatchedMesh&&(Se.setOptional(F,$,"batchingTexture"),Se.setValue(F,"batchingTexture",$._matricesTexture,Ct),Se.setOptional(F,$,"batchingIdTexture"),Se.setValue(F,"batchingIdTexture",$._indirectTexture,Ct),Se.setOptional(F,$,"batchingColorTexture"),$._colorsTexture!==null&&Se.setValue(F,"batchingColorTexture",$._colorsTexture,Ct));const ln=ot.morphAttributes;if((ln.position!==void 0||ln.normal!==void 0||ln.color!==void 0)&&St.update($,ot,Ue),(He||Xt.receiveShadow!==$.receiveShadow)&&(Xt.receiveShadow=$.receiveShadow,Se.setValue(F,"receiveShadow",$.receiveShadow)),at.isMeshGouraudMaterial&&at.envMap!==null&&(cn.envMap.value=R,cn.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1),at.isMeshStandardMaterial&&at.envMap===null&&X.environment!==null&&(cn.envMapIntensity.value=X.environmentIntensity),He&&(Se.setValue(F,"toneMappingExposure",y.toneMappingExposure),Xt.needsLights&&ss(cn,di),xt&&at.fog===!0&&gt.refreshFogUniforms(cn,xt),gt.refreshMaterialUniforms(cn,at,Y,tt,p.state.transmissionRenderTarget[I.id]),Hs.upload(F,ns(Xt),cn,Ct)),at.isShaderMaterial&&at.uniformsNeedUpdate===!0&&(Hs.upload(F,ns(Xt),cn,Ct),at.uniformsNeedUpdate=!1),at.isSpriteMaterial&&Se.setValue(F,"center",$.center),Se.setValue(F,"modelViewMatrix",$.modelViewMatrix),Se.setValue(F,"normalMatrix",$.normalMatrix),Se.setValue(F,"modelMatrix",$.matrixWorld),at.isShaderMaterial||at.isRawShaderMaterial){const Ge=at.uniformsGroups;for(let Ze=0,pa=Ge.length;Ze<pa;Ze++){const ui=Ge[Ze];$t.update(ui,Ue),$t.bind(ui,Ue)}}return Ue}function ss(I,X){I.ambientLightColor.needsUpdate=X,I.lightProbe.needsUpdate=X,I.directionalLights.needsUpdate=X,I.directionalLightShadows.needsUpdate=X,I.pointLights.needsUpdate=X,I.pointLightShadows.needsUpdate=X,I.spotLights.needsUpdate=X,I.spotLightShadows.needsUpdate=X,I.rectAreaLights.needsUpdate=X,I.hemisphereLights.needsUpdate=X}function vo(I){return I.isMeshLambertMaterial||I.isMeshToonMaterial||I.isMeshPhongMaterial||I.isMeshStandardMaterial||I.isShadowMaterial||I.isShaderMaterial&&I.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(I,X,ot){const at=yt.get(I);at.__autoAllocateDepthBuffer=I.resolveDepthBuffer===!1,at.__autoAllocateDepthBuffer===!1&&(at.__useRenderToTexture=!1),yt.get(I.texture).__webglTexture=X,yt.get(I.depthTexture).__webglTexture=at.__autoAllocateDepthBuffer?void 0:ot,at.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(I,X){const ot=yt.get(I);ot.__webglFramebuffer=X,ot.__useDefaultFramebuffer=X===void 0};const _o=F.createFramebuffer();this.setRenderTarget=function(I,X=0,ot=0){D=I,P=X,C=ot;let at=!0,$=null,xt=!1,Nt=!1;if(I){const R=yt.get(I);if(R.__useDefaultFramebuffer!==void 0)Q.bindFramebuffer(F.FRAMEBUFFER,null),at=!1;else if(R.__webglFramebuffer===void 0)Ct.setupRenderTarget(I);else if(R.__hasExternalTextures)Ct.rebindTextures(I,yt.get(I.texture).__webglTexture,yt.get(I.depthTexture).__webglTexture);else if(I.depthBuffer){const et=I.depthTexture;if(R.__boundDepthTexture!==et){if(et!==null&&yt.has(et)&&(I.width!==et.image.width||I.height!==et.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ct.setupDepthRenderbuffer(I)}}const k=I.texture;(k.isData3DTexture||k.isDataArrayTexture||k.isCompressedArrayTexture)&&(Nt=!0);const J=yt.get(I).__webglFramebuffer;I.isWebGLCubeRenderTarget?(Array.isArray(J[X])?$=J[X][ot]:$=J[X],xt=!0):I.samples>0&&Ct.useMultisampledRTT(I)===!1?$=yt.get(I).__webglMultisampledFramebuffer:Array.isArray(J)?$=J[ot]:$=J,L.copy(I.viewport),z.copy(I.scissor),B=I.scissorTest}else L.copy(mt).multiplyScalar(Y).floor(),z.copy(vt).multiplyScalar(Y).floor(),B=At;if(ot!==0&&($=_o),Q.bindFramebuffer(F.FRAMEBUFFER,$)&&at&&Q.drawBuffers(I,$),Q.viewport(L),Q.scissor(z),Q.setScissorTest(B),xt){const R=yt.get(I.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+X,R.__webglTexture,ot)}else if(Nt){const R=X;for(let k=0;k<I.textures.length;k++){const J=yt.get(I.textures[k]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+k,J.__webglTexture,ot,R)}}else if(I!==null&&ot!==0){const R=yt.get(I.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,R.__webglTexture,ot)}E=-1},this.readRenderTargetPixels=function(I,X,ot,at,$,xt,Nt,kt=0){if(!(I&&I.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let R=yt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Nt!==void 0&&(R=R[Nt]),R){Q.bindFramebuffer(F.FRAMEBUFFER,R);try{const k=I.textures[kt],J=k.format,et=k.type;if(!ht.textureFormatReadable(J)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ht.textureTypeReadable(et)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}X>=0&&X<=I.width-at&&ot>=0&&ot<=I.height-$&&(I.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+kt),F.readPixels(X,ot,at,$,Vt.convert(J),Vt.convert(et),xt))}finally{const k=D!==null?yt.get(D).__webglFramebuffer:null;Q.bindFramebuffer(F.FRAMEBUFFER,k)}}},this.readRenderTargetPixelsAsync=async function(I,X,ot,at,$,xt,Nt,kt=0){if(!(I&&I.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let R=yt.get(I).__webglFramebuffer;if(I.isWebGLCubeRenderTarget&&Nt!==void 0&&(R=R[Nt]),R)if(X>=0&&X<=I.width-at&&ot>=0&&ot<=I.height-$){Q.bindFramebuffer(F.FRAMEBUFFER,R);const k=I.textures[kt],J=k.format,et=k.type;if(!ht.textureFormatReadable(J))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ht.textureTypeReadable(et))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const bt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,bt),F.bufferData(F.PIXEL_PACK_BUFFER,xt.byteLength,F.STREAM_READ),I.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+kt),F.readPixels(X,ot,at,$,Vt.convert(J),Vt.convert(et),0);const Wt=D!==null?yt.get(D).__webglFramebuffer:null;Q.bindFramebuffer(F.FRAMEBUFFER,Wt);const ce=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Wu(F,ce,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,bt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,xt),F.deleteBuffer(bt),F.deleteSync(ce),xt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(I,X=null,ot=0){const at=Math.pow(2,-ot),$=Math.floor(I.image.width*at),xt=Math.floor(I.image.height*at),Nt=X!==null?X.x:0,kt=X!==null?X.y:0;Ct.setTexture2D(I,0),F.copyTexSubImage2D(F.TEXTURE_2D,ot,0,0,Nt,kt,$,xt),Q.unbindTexture()};const Ii=F.createFramebuffer(),Ve=F.createFramebuffer();this.copyTextureToTexture=function(I,X,ot=null,at=null,$=0,xt=null){xt===null&&($!==0?(ko("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),xt=$,$=0):xt=0);let Nt,kt,R,k,J,et,bt,Wt,ce;const Kt=I.isCompressedTexture?I.mipmaps[xt]:I.image;if(ot!==null)Nt=ot.max.x-ot.min.x,kt=ot.max.y-ot.min.y,R=ot.isBox3?ot.max.z-ot.min.z:1,k=ot.min.x,J=ot.min.y,et=ot.isBox3?ot.min.z:0;else{const ln=Math.pow(2,-$);Nt=Math.floor(Kt.width*ln),kt=Math.floor(Kt.height*ln),I.isDataArrayTexture?R=Kt.depth:I.isData3DTexture?R=Math.floor(Kt.depth*ln):R=1,k=0,J=0,et=0}at!==null?(bt=at.x,Wt=at.y,ce=at.z):(bt=0,Wt=0,ce=0);const ne=Vt.convert(X.format),Xt=Vt.convert(X.type);let ye;X.isData3DTexture?(Ct.setTexture3D(X,0),ye=F.TEXTURE_3D):X.isDataArrayTexture||X.isCompressedArrayTexture?(Ct.setTexture2DArray(X,0),ye=F.TEXTURE_2D_ARRAY):(Ct.setTexture2D(X,0),ye=F.TEXTURE_2D),F.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,X.flipY),F.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,X.premultiplyAlpha),F.pixelStorei(F.UNPACK_ALIGNMENT,X.unpackAlignment);const ue=F.getParameter(F.UNPACK_ROW_LENGTH),Ue=F.getParameter(F.UNPACK_IMAGE_HEIGHT),Jn=F.getParameter(F.UNPACK_SKIP_PIXELS),He=F.getParameter(F.UNPACK_SKIP_ROWS),di=F.getParameter(F.UNPACK_SKIP_IMAGES);F.pixelStorei(F.UNPACK_ROW_LENGTH,Kt.width),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Kt.height),F.pixelStorei(F.UNPACK_SKIP_PIXELS,k),F.pixelStorei(F.UNPACK_SKIP_ROWS,J),F.pixelStorei(F.UNPACK_SKIP_IMAGES,et);const Se=I.isDataArrayTexture||I.isData3DTexture,cn=X.isDataArrayTexture||X.isData3DTexture;if(I.isDepthTexture){const ln=yt.get(I),Ge=yt.get(X),Ze=yt.get(ln.__renderTarget),pa=yt.get(Ge.__renderTarget);Q.bindFramebuffer(F.READ_FRAMEBUFFER,Ze.__webglFramebuffer),Q.bindFramebuffer(F.DRAW_FRAMEBUFFER,pa.__webglFramebuffer);for(let ui=0;ui<R;ui++)Se&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,yt.get(I).__webglTexture,$,et+ui),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,yt.get(X).__webglTexture,xt,ce+ui)),F.blitFramebuffer(k,J,Nt,kt,bt,Wt,Nt,kt,F.DEPTH_BUFFER_BIT,F.NEAREST);Q.bindFramebuffer(F.READ_FRAMEBUFFER,null),Q.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if($!==0||I.isRenderTargetTexture||yt.has(I)){const ln=yt.get(I),Ge=yt.get(X);Q.bindFramebuffer(F.READ_FRAMEBUFFER,Ii),Q.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ve);for(let Ze=0;Ze<R;Ze++)Se?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ln.__webglTexture,$,et+Ze):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ln.__webglTexture,$),cn?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Ge.__webglTexture,xt,ce+Ze):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ge.__webglTexture,xt),$!==0?F.blitFramebuffer(k,J,Nt,kt,bt,Wt,Nt,kt,F.COLOR_BUFFER_BIT,F.NEAREST):cn?F.copyTexSubImage3D(ye,xt,bt,Wt,ce+Ze,k,J,Nt,kt):F.copyTexSubImage2D(ye,xt,bt,Wt,k,J,Nt,kt);Q.bindFramebuffer(F.READ_FRAMEBUFFER,null),Q.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else cn?I.isDataTexture||I.isData3DTexture?F.texSubImage3D(ye,xt,bt,Wt,ce,Nt,kt,R,ne,Xt,Kt.data):X.isCompressedArrayTexture?F.compressedTexSubImage3D(ye,xt,bt,Wt,ce,Nt,kt,R,ne,Kt.data):F.texSubImage3D(ye,xt,bt,Wt,ce,Nt,kt,R,ne,Xt,Kt):I.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,xt,bt,Wt,Nt,kt,ne,Xt,Kt.data):I.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,xt,bt,Wt,Kt.width,Kt.height,ne,Kt.data):F.texSubImage2D(F.TEXTURE_2D,xt,bt,Wt,Nt,kt,ne,Xt,Kt);F.pixelStorei(F.UNPACK_ROW_LENGTH,ue),F.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Ue),F.pixelStorei(F.UNPACK_SKIP_PIXELS,Jn),F.pixelStorei(F.UNPACK_SKIP_ROWS,He),F.pixelStorei(F.UNPACK_SKIP_IMAGES,di),xt===0&&X.generateMipmaps&&F.generateMipmap(ye),Q.unbindTexture()},this.initRenderTarget=function(I){yt.get(I).__webglFramebuffer===void 0&&Ct.setupRenderTarget(I)},this.initTexture=function(I){I.isCubeTexture?Ct.setTextureCube(I,0):I.isData3DTexture?Ct.setTexture3D(I,0):I.isDataArrayTexture||I.isCompressedArrayTexture?Ct.setTexture2DArray(I,0):Ct.setTexture2D(I,0),Q.unbindTexture()},this.resetState=function(){P=0,C=0,D=null,Q.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=me._getDrawingBufferColorSpace(t),e.unpackColorSpace=me._getUnpackColorSpace()}}class q1{camera;pitch=Ne.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new N;desired=new N;aspect=1;constructor(){this.camera=new Uc(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=Ne.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const i=1-Math.pow(.001,t);this.focus.lerp(e,i),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,i=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*i*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*i*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,i){const o=Math.sin(this.yaw),s=Math.cos(this.yaw);return i.set(t*s-e*o,0,-t*o-e*s),i}}class W1{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};ponteiro={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(X1.has(e)||j1.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.surface.getBoundingClientRect();if(this.ponteiro.x=(t.clientX-e.left)/e.width*2-1,this.ponteiro.y=1-(t.clientY-e.top)/e.height*2,t.pointerId!==this.stickId)return;const i=60,o=Math.max(-i,Math.min(i,t.clientX-this.stickOrigin.x)),s=Math.max(-i,Math.min(i,t.clientY-this.stickOrigin.y));this.stickX=o/i,this.stickY=s/i};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};pointer(){return{x:this.ponteiro.x,y:this.ponteiro.y}}move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const i=Math.hypot(t,e);return i>1&&(t/=i,e/=i),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}tapGirar(t){this.pressed.add(t<0?"KeyQ":"KeyR")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const X1=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),j1=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF","KeyH","KeyI","Tab"]),mn=["cabeca","tronco","pernas","pes"],_={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,grassDry:11059802,dirt:12159572,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,brick:13068882,wallCream:15984595,wallMint:14085344,wallAzul:13624565,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,mesaVerde:3108695,cortica:14133098,corticaEscura:12159055,estanteFundo:7030048,pelusaBranco:16184042,pelusaCinza:11050641,pelusaCinzaEscuro:9076852,pelusaFocinho:15247277,pelusaOrelha:14395816,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,roupaLa:14248826,roupaLaBarra:16180168,roupaListra:4882400,roupaListraManga:15987180,roupaJeans:4151942,roupaBota:16763213,roupaBotaCano:9067050,vestidoRosa:16176088,vestidoRenda:16644080,vestidoFita:15773373,maidPreto:2828851,maidCreme:16447214,maidFita:1512988,maidLacoVermelho:12727364,moletomPreto:2500140,moletomCostura:1315864,moletomZiper:4539983,moletomForro:5461086,moletomPonteira:14276301,waRosa:15775432,waRosaForte:14250895,waEscuro:3880263,waBranco:16644853,waFivela:12170944,bermudaAzul:3112912,bermudaVermelha:14173503,bermudaAmarela:15906857,bermudaEstampa:3126696,bermudaEstampaFaixa:16642261,oculosLente:2302251,oculosArmacao:4012872,arepaMilho:15319417,arepaTostada:13605448,arepaQueijo:16508582,hamburguerPao:14854497,hamburguerGergelim:16313295,hamburguerCarne:8143907,hamburguerCarneEscura:6172696,hamburguerAlface:7848026,hamburguerBatata:15909198,perroSalsicha:13985099,perroKetchup:14039860,perroMostarda:15774761,cachorroPelo:13208402,cachorroPeito:15982788,cachorroOrelha:11104060,cachorroFocinho:4864563,gravataBorboleta:11022922,gravataNo:8791098,vestiarioAzulejo:9356253,vestiarioRejunte:7055564,vestiarioPorta:3108751,vestiarioCaixa:4157360,restauranteParede:15983567,restauranteFaixa:14862763,restauranteToldo:3120761,restauranteEsquadria:7031340,restauranteDeck:12618322,restauranteDeckRipa:11566150,dequeTabua:14199930,dequeRipa:13081192,dequeViga:11105855,dequeTrepadeira:5217094,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578,pessego:16756838};let Mi=null;function Y1(){if(!Mi){const n=new Uint8Array([96,166,214,255]);Mi=new vf(n,n.length,1,yc),Mi.minFilter=$e,Mi.magFilter=$e,Mi.generateMipmaps=!1,Mi.needsUpdate=!0}return Mi}const Xl=new Map;function w(n,t={}){const e=`${n}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.decal?1:0}|${t.mapa?.uuid??""}`,i=Xl.get(e);if(i)return i;const o=new sd({color:n,gradientMap:Y1(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?wn:jn,map:t.mapa??null});return t.glow&&(o.emissive=new le(n),o.emissiveIntensity=t.glow),t.decal&&pd(o),Xl.set(e,o),o}function pd(n){n.polygonOffset=!0,n.polygonOffsetFactor=-1,n.polygonOffsetUnits=-4,n.depthWrite=!1}const jl=new Map;function Ye(n,t=1,e=!1){const i=`${n}|${t}|${e?1:0}`,o=jl.get(i);if(o)return o;const s=new ra({color:n,transparent:t<1,opacity:t,side:wn});return e&&pd(s),jl.set(i,s),s}const Yl=new Map;function $l(n){const t=Yl.get(n);if(t)return t;const e=new jh({color:n});return Yl.set(n,e),e}function ta(n="redonda",t=1,e=.5){const i=new ct,o=2.1*t,s=new v(new nt(.13*t,.2*t,o,8),w(_.trunk));if(s.position.y=o/2,i.add(s),n==="pinheiro")for(let a=0;a<3;a++){const r=(1.1-a*.26)*t,c=new v(new Ce(r,1.3*t,9),w(a===0?_.leafDark:_.leafMid));c.position.y=o*.7+a*.72*t,i.add(c)}else if(n==="palmeira"){s.scale.y=1.5,s.position.y=o*.75;for(let a=0;a<7;a++){const r=a/7*Math.PI*2,c=new v(new It(.75*t,8,6),w(_.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(r)*.85*t,o*1.5-.1,Math.sin(r)*.85*t),c.rotation.y=-r,c.rotation.z=-.32,i.add(c)}}else{const a=n==="florida"?_.flowerPink:_.leafMid;[[0,o+.55*t,0,1.15],[.62*t,o+.15*t,.2*t,.78],[-.5*t,o+.3*t,-.35*t,.88],[.1*t,o+1.05*t,-.3*t,.66]].forEach(([c,l,h,d],u)=>{const f=new v(new $o(d*t,1),w(u%2===0?a:n==="florida"?_.flowerPink:_.leafLight));f.position.set(c,l,h),f.rotation.set(e*3,e*5,e*2),i.add(f)})}return i}function Gs(n=1,t=_.bush){const e=new ct;for(let i=0;i<3;i++){const o=new v(new $o(.42*n,1),w(t));o.position.set((i-1)*.36*n,.3*n+(i===1?.12:0),i%2*.18*n),e.add(o)}return e}function ec(n=6,t=.9,e=[_.flowerPink,_.flowerYellow,16777215]){const i=new ct;for(let o=0;o<n;o++){const s=o/n*Math.PI*2+o*.7,a=t*(.35+o*37%100/140),r=new v(new nt(.02,.02,.3,5),w(_.leafDark));r.position.set(Math.cos(s)*a,.15,Math.sin(s)*a),i.add(r);const c=new v(new It(.09,8,6),w(e[o%e.length]));c.position.set(Math.cos(s)*a,.33,Math.sin(s)*a),c.scale.y=.7,i.add(c)}return i}function Ds(n=1,t=.5,e=10133670){const i=new ct,o=new Cc(.5*n,0),s=o.attributes.position;for(let r=0;r<s.count;r++){const c=s.getX(r),l=s.getY(r),h=s.getZ(r),d=Math.sin(Math.round(c*1e3)*12.9898+Math.round(l*1e3)*78.233+Math.round(h*1e3)*37.719+t*53.1)*43758.5453,u=1+(d-Math.floor(d)-.5)*.3;s.setXYZ(r,c*u,l*u,h*u)}o.computeVertexNormals();const a=new v(o,w(e));return a.position.y=.3*n*(.8+t*.4),a.rotation.set(t*6.28,t*4.1,t*2.2),a.scale.set(1+t*.3,.6+t*.4,1.1-t*.3),i.add(a),i}function Zl(n=1,t=_.leafMid){const e=new ct,i=6;for(let o=0;o<i;o++){const s=o/i*Math.PI*2+o*.7,a=(.28+o*37%10/40)*n,r=new v(new Ce(.035*n,a,5),w(o%3===0?_.leafDark:o%3===1?t:_.grassDry));r.position.set(Math.cos(s)*.11*n,a*.45,Math.sin(s)*.11*n),r.rotation.set(Math.sin(s)*.35,0,Math.cos(s)*.35),e.add(r)}return e}function $1(n=1.2,t=7){const e=new ct;for(let i=0;i<t;i++){const o=i/t*Math.PI*2+i*1.3,s=.06+i*53%10/55,a=n*(.7+i*29%10/22),r=new v(new nt(.02,.028,a,5),w(i%2?_.leafDark:_.leafMid)),c=.12+i*17%10/60;if(r.position.set(Math.cos(o)*s,a/2,Math.sin(o)*s),r.rotation.set(Math.sin(o)*c,0,Math.cos(o)*c),e.add(r),i%3===0){const l=new v(new an(.045,a*.16,4,8),w(9071162));l.position.set(Math.cos(o)*(s+Math.cos(o)*c*a*.5),a*.97,Math.sin(o)*(s+Math.sin(o)*c*a*.5)),e.add(l)}}return e}function Z1(n=1,t=!0){const e=new ct;for(const[i,o,s]of[[0,0,.62],[.34,.2,.44]]){const a=new v(new It(s*n,14,6,0,Math.PI*2,0,.5),w(_.leafLight));a.scale.y=.3,a.position.set(i*n,.03,o*n),e.add(a)}if(t){const i=new v(new It(.08*n,8,6),w(_.flowerYellow));i.position.set(.16*n,.14*n,.08*n),e.add(i);for(let o=0;o<5;o++){const s=o/5*Math.PI*2,a=new v(new It(.06*n,7,5),w(16773365));a.position.set(.16*n+Math.cos(s)*.08*n,.12*n,.08*n+Math.sin(s)*.08*n),a.scale.set(1.3,.6,1.3),e.add(a)}}return e}const zc=.24;function md(n){const t=new ct,e=zc,i=new v(new nt(n,n*1.05,e,18,1,!0),w(_.brick,{doubleSide:!0}));i.position.y=e/2,t.add(i);const o=new v(new ge(n,.05,6,20),w(_.wallCream));o.rotation.x=Math.PI/2,o.position.y=e,t.add(o);const s=new v(new nt(n*.96,n*.96,.08,18),w(_.dirt));s.position.y=e-.03,t.add(s);const a=new v(new It(n*.9,16,8),w(_.leafMid));return a.scale.y=.11,a.position.y=e-.04,t.add(a),t}function gd(n=1.1,t=[_.flowerPink,_.flowerYellow,16777215,12160992],e=.5){const i=md(n),o=zc,s=e*6.28,a=[[s*1.7,0]],r=Math.round(9*n),c=Math.round(5*n);for(let d=0;d<r;d++)a.push([d/r*Math.PI*2+s,n*.68]);for(let d=0;d<c;d++)a.push([d/c*Math.PI*2+s+.7,n*.36]);const l=n*.2,h=n*.068;return a.forEach(([d,u],f)=>{const g=t[f%t.length],M=(f*37+e*100)%10/10-.5,m=Math.cos(d)*u+M*n*.08,p=Math.sin(d)*u-M*n*.08,S=new v(new It(l,8,6),w(_.leafDark));S.position.set(m,o+l*.3,p),S.scale.y=.55,i.add(S);for(let x=0;x<6;x++){const y=x<4,A=x/(y?4:2)*Math.PI*2+f+(y?0:.8),P=y?l*.62:l*.24,C=new v(new It(h,8,6),w(g));C.position.set(m+Math.cos(A)*P,o+l*(y?.72:1.05)+(x+f)%3*n*.04,p+Math.sin(A)*P),C.scale.y=.8,i.add(C)}}),i}function J1(n=1.3,t=1,e=.5){const i=md(n),o=zc,s=ta("palmeira",t,e);s.position.y=o,i.add(s);const a=Math.round(7*n);for(let r=0;r<a;r++){const c=r/a*Math.PI*2+e*6.28,l=n*(.45+(r*53+e*100)%10/10*.28),h=n*(.15+r*29%7/7*.07),d=new v(new It(h,8,6),w(r%2?_.leafDark:_.bush));d.position.set(Math.cos(c)*l,o+h*.3,Math.sin(c)*l),d.scale.y=.6,i.add(d)}return i}function K1(n=2.6){const t=new ct,e=w(_.metalWhite),i=.26,o=new v(new nt(n*1.03,n*1.06,i,20),w(_.concrete));o.position.y=i/2,t.add(o);const s=new v(new It(n,18,10,0,Math.PI*2,0,Math.PI/2),w(14676731,{opacity:.72,doubleSide:!0}));s.position.y=i,t.add(s);for(let h=0;h<8;h++){const d=new v(new ge(n,.045,5,20,Math.PI),e);d.rotation.set(0,h/8*Math.PI,0),d.position.y=i,t.add(d)}for(const h of[.34,.62,.85]){const d=n*Math.sqrt(Math.max(.02,1-h*h)),u=new v(new ge(d,.038,5,22),e);u.rotation.x=Math.PI/2,u.position.y=i+n*h,t.add(u)}for(const h of[0,1]){const d=new v(new ge(n,.09,6,18,Math.PI-.5),e);d.rotation.x=Math.PI/2,d.rotation.z=h?Math.PI+.25:.25,d.position.y=i+.04,t.add(d)}const a=new v(new It(.16,10,8),e);a.position.y=i+n,t.add(a);for(let h=0;h<6;h++){const d=h/6*Math.PI*2+.3,u=n*.62,f=new v(new nt(.05,.06,u,6),w(_.metalGrey));f.position.set(Math.cos(d)*n*.84,i+u/2,Math.sin(d)*n*.84),t.add(f)}const r=vd(_.wood);r.scale.setScalar(.72),r.position.set(0,i,-n*.35),r.rotation.y=.25,t.add(r);const c=new v(new nt(.26,.2,.36,10),w(_.plantPot));c.position.set(n*.4,i+.18,n*.35),t.add(c);const l=new v(new $o(.34,0),w(_.leafMid));return l.position.set(n*.4,i+.55,n*.35),t.add(l),t}function vd(n=_.wood){const t=new ct,e=new v(new O(1.9,.1,.55),w(n));e.position.y=.48,t.add(e);const i=new v(new O(1.9,.5,.09),w(n));i.position.set(0,.76,-.25),i.rotation.x=-.16,t.add(i);for(const o of[-1,1]){const s=new v(new O(.1,.48,.5),w(_.metalGrey));s.position.set(o*.78,.24,0),t.add(s)}return t}function qs(n=!1){const t=new ct,e=new v(new nt(.07,.09,3.4,8),w(_.metalGrey));e.position.y=1.7,t.add(e);const i=new v(new It(.3,12,10,0,Math.PI*2,0,Math.PI*.62),w(_.metalWhite));i.position.y=3.45,i.rotation.x=Math.PI,t.add(i);const o=new v(new It(.2,10,8),w(n?_.gold:15263968,{glow:n?.9:0}));return o.position.y=3.32,t.add(o),t}function ea(){const n=new ct,t=new v(new nt(.28,.24,.75,10),w(5208650));t.position.y=.38,n.add(t);const e=new v(new ge(.29,.04,6,14),w(_.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,n.add(e),n}function _d(){const n=new ct,t=new v(new O(1.9,.1,1),w(_.wood));t.position.y=.76,n.add(t);for(const e of[-1,1]){const i=new v(new O(.1,.76,.9),w(_.woodDark));i.position.set(e*.75,.38,0),n.add(i);const o=new v(new O(1.9,.08,.34),w(_.wood));o.position.set(0,.45,e*.78),n.add(o);const s=new v(new O(1.6,.45,.08),w(_.woodDark));s.position.set(0,.22,e*.78),n.add(s)}return n}function Xi(n=4,t=1.1,e=_.metalGrey){const i=new ct,o=Math.max(2,Math.round(n/1.2));for(let s=0;s<=o;s++){const a=new v(new nt(.05,.05,t,6),w(e));a.position.set(-n/2+s/o*n,t/2,0),i.add(a)}for(const s of[t*.35,t*.8]){const a=new v(new O(n,.06,.06),w(e));a.position.y=s,i.add(a)}return i}function Q1(n=_.wood,t=_.metalWhite){const e=new ct,i=new v(new nt(.06,.06,1.6,6),w(_.woodDark));i.position.y=.8,e.add(i);const o=new v(new O(1.1,.7,.08),w(n));o.position.y=1.5,e.add(o);const s=new v(new O(.85,.12,.02),w(t));return s.position.set(0,1.62,.05),e.add(s),e}function Md(n=1){const t=new ct,e=Ye(16777215,.92),i=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[o,s,a,r]of i){const c=new v(new It(r*n,10,8),e);c.position.set(o*n,s*n,a*n),t.add(c)}return t}function tv(n,t,e,i){const o=new ct,s=9,a=n/s,r=.35,c=1.15,l=new ct;l.rotation.z=Math.PI/2;for(let u=0;u<s;u++){const f=new v(new nt(t,t,a*1.02,10,1,!0,r,c),w(u%2===0?e:i,{doubleSide:!0}));f.position.y=-n/2+a*(u+.5),l.add(f)}o.add(l);const h=Math.sin(r)*t,d=Math.cos(r)*t;for(let u=0;u<s;u++){const f=new v(new It(a*.36,8,6),w(u%2===0?e:i));f.position.set(-n/2+a*(u+.5),h-a*.2,d),f.scale.set(1,1.15,.7),o.add(f)}return o}function nc(n=_.fabricRed,t={}){const e=new ct;e.userData.peca="quiosque";const i=t.tipo??"simples",o=_.wallCream,s=w(_.wood),a=w(_.woodDark),r=new v(new O(2.8,.16,1.9),a);r.position.y=.08,e.add(r);const c=new v(new O(2.35,1.7,1.4),w(o));c.position.set(0,1.01,-.05),e.add(c);for(const x of[-1,1]){const y=new v(new O(.26,1.7,.14),s);y.position.set(x*1.1,.99,.68),e.add(y)}const l=new v(new O(2.5,.22,.16),s);l.position.set(0,1.715,.68),e.add(l);const h=new v(new O(1.82,.44,.06),w(5981750));h.position.set(0,1.42,.66),e.add(h);const d=new v(new O(2.5,.14,.78),s);d.position.set(0,1.12,.94),e.add(d);const u=new v(new nt(.075,.075,2.5,10),a);u.rotation.z=Math.PI/2,u.position.set(0,1.12,1.32),e.add(u);for(const x of[-1,1]){const y=new v(new nt(.05,.05,1.05,8),w(_.metalWhite));y.position.set(x*1.18,.6,1.24),e.add(y)}const f=new v(new O(2.55,.16,1.55),a);f.position.set(0,1.92,-.05),e.add(f);const g=tv(2.5,.44,n,o);g.position.set(0,1.54,.62),e.add(g);const M=t.texto??(i==="sorvete"?"Sorvete":i==="suco"?"Sucos":""),m=new v(new O(1.75,.5,.12),w(n));m.position.set(0,2.3,-.05),e.add(m);const p=new v(new O(1.9,.62,.08),w(o));if(p.position.set(0,2.3,-.09),e.add(p),M){const x=Zo(M,1.5,.34);x.position.set(0,2.3,.02),e.add(x)}if(i==="sorvete"){const x=oc(_.morango);x.scale.setScalar(2.6),x.position.set(0,2.78,-.05),e.add(x);const y=new v(new O(1.24,.16,.56),w(_.metalWhite));y.position.set(-.58,1.26,1.06),e.add(y),[_.morango,_.maracuja,_.chocolate].forEach((P,C)=>{const D=new v(new nt(.15,.13,.22,10),w(_.metalWhite));D.position.set(-1+C*.36,1.29,1.06),e.add(D);const E=new v(new It(.14,10,8),w(P));E.position.set(-1+C*.36,1.42,1.06),E.scale.y=.8,e.add(E)});for(let P=0;P<3;P++){const C=new v(new Ce(.1,.3,10),w(14197852));C.position.set(.72,1.34+P*.07,1.04+P*.02),C.rotation.x=Math.PI,e.add(C)}}else if(i==="suco"){const x=new v(new It(.32,12,10),w(_.laranja));x.position.set(0,2.85,-.05),e.add(x);const y=new v(new It(.13,8,6),w(_.leafMid));y.position.set(.14,3.12,-.05),y.scale.set(1.5,.4,.8),y.rotation.z=.5,e.add(y),[_.laranja,_.limao].forEach((b,L)=>{const z=new v(new nt(.15,.14,.42,12,1,!0),w(_.glass,{opacity:.45,doubleSide:!0}));z.position.set(-.78+L*.42,1.4,1.06),e.add(z);const B=new v(new nt(.13,.12,.28,12),w(b));B.position.set(-.78+L*.42,1.33,1.06),e.add(B);const H=new v(new nt(.025,.025,.12,6),w(_.metalGrey));H.position.set(-.78+L*.42,1.26,1.2),H.rotation.x=Math.PI/2,e.add(H)});const P=new v(new nt(.22,.17,.12,12),w(_.plantPot));P.position.set(.42,1.25,1.06),e.add(P);const C=[[.32,1.34,1.03,_.laranja],[.52,1.34,1.08,_.limao],[.42,1.4,1.05,_.morango]];for(const[b,L,z,B]of C){const H=new v(new It(.1,10,8),w(B));H.position.set(b,L,z),e.add(H)}const D=new v(new nt(.09,.07,.2,10),w(o));D.position.set(.95,1.29,1.06),e.add(D),[_.morango,_.limao,_.fabricBlue].forEach((b,L)=>{const z=new v(new nt(.014,.014,.34,6),w(b));z.position.set(.93+L*.03,1.44,1.06-L*.02),z.rotation.z=(L-1)*.18,e.add(z)})}const S=new v(new O(.06,.62,.5),w(3551276));S.position.set(1.16,1.3,.15),e.add(S);for(let x=0;x<3;x++){const y=new v(new O(.02,.045,.3-x*.06),w(o));y.position.set(1.205,1.46-x*.16,.15),e.add(y)}return e}function Jl(n=4,t=6,e=4,i=_.wallCream,o=_.roofTile,s=_.glass){const a=new ct,r=new v(new O(n,t,e),w(i));r.position.y=t/2,a.add(r);const c=new v(new O(n+.3,.35,e+.3),w(o));c.position.y=t+.17,a.add(c);const l=Math.max(1,Math.floor(n/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let d=0;d<h;d++)for(let u=0;u<l;u++){const f=new v(new O(.65,.8,.06),w(s,{glow:.15})),g=-n/2+n/l*(u+.5),M=.9+t/h*d;f.position.set(g,M,e/2+.02),a.add(f);const m=f.clone();m.position.z=-e/2-.02,a.add(m)}return a}function ev(n=_.mesaVerde){const t=new ct,e=2.6,i=1.4,o=.76,s=w(16054261),a=new v(new O(e,.06,i),w(n));a.position.y=o,t.add(a);for(const l of[-i/2+.05,i/2-.05,0]){const h=new v(new O(e-.02,.008,.05),s);h.position.set(0,o+.032,l),t.add(h)}for(const l of[-e/2+.04,e/2-.04]){const h=new v(new O(.05,.008,i-.02),s);h.position.set(l,o+.032,0),t.add(h)}const r=new v(new O(.03,.19,i+.16),w(16514556,{opacity:.72,doubleSide:!0}));r.position.y=o+.13,t.add(r);const c=new v(new O(.045,.035,i+.18),w(16777215));c.position.y=o+.225,t.add(c);for(const l of[-1.5599999999999998/2,(i+.16)/2]){const h=new v(new nt(.022,.022,.24,8),w(_.metalGrey));h.position.set(0,o+.12,l),t.add(h)}for(const l of[-e/2+.22,e/2-.22]){for(const d of[-i/2+.18,i/2-.18]){const u=new v(new nt(.035,.045,o,8),w(_.metalGrey));u.position.set(l,o/2,d),t.add(u)}const h=new v(new O(.05,.05,i-.36),w(_.metalGrey));h.position.set(l,o*.35,0),t.add(h)}return t}function xd(){const n=new v(new It(.055,12,10),w(16775398,{glow:.12}));return n.castShadow=!0,n}function na(n=_.metalRed){const t=new ct,e=new v(new nt(.17,.17,.035,20),w(n));e.rotation.x=Math.PI/2,t.add(e);const i=new v(new nt(.185,.185,.022,20),w(_.wood));i.rotation.x=Math.PI/2,t.add(i);const o=new v(new an(.035,.16,4,8),w(_.woodDark));return o.position.y=-.25,t.add(o),t.traverse(s=>{const a=s;a.isMesh&&(a.castShadow=!0)}),t}function yd(n=_.frisbee){const t=new v(new nt(.28,.24,.07,20),w(n));return t.castShadow=!0,t}function bd(n=1){const t=new ct,e=w(_.heart,{glow:.35});for(const o of[-1,1]){const s=new v(new It(.16*n,10,8),e);s.position.set(o*.13*n,.1*n,0),t.add(s)}const i=new v(new Ce(.22*n,.34*n,10),e);return i.position.y=-.1*n,i.rotation.x=Math.PI,t.add(i),t}function $a(n=16184040){const t=new ct,e=new v(new It(.22,10,8),w(n));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const i=new v(new nt(.06,.08,.24,8),w(n));i.position.set(0,.28,.14),t.add(i);const o=new v(new It(.11,10,8),w(n));o.position.set(0,.4,.16),t.add(o);const s=new v(new Ce(.05,.14,6),w(_.gold));return s.position.set(0,.39,.28),s.rotation.x=Math.PI/2,t.add(s),t}function ic(n=_.wallCream){const t=new ct;t.userData.patins=!0;const e=.045,i=new v(new O(.13,.15,.26),w(n));i.position.set(0,e*2+.115,.01),t.add(i);const o=new v(new O(.125,.13,.15),w(n));o.position.set(0,e*2+.25,-.04),t.add(o);const s=new v(new O(.135,.04,.13),w(_.frisbee));s.position.set(0,e*2+.235,.02),t.add(s);const a=new v(new O(.1,.05,.28),w(_.metalGrey));a.position.set(0,e*2+.015,.01),t.add(a);for(const r of[-1,1])for(const c of[-1,1]){const l=new v(new nt(e,e,.035,10),w(_.frisbee));l.rotation.z=Math.PI/2,l.position.set(r*.062,e,.01+c*.095),t.add(l)}return t}function nv(n=_.fabricBlue){const t=new ct;t.userData.peca="loja-de-patins";const e=7.4,i=4.4,o=2.9,s=w(_.wallCream),a=w(_.wood),r=w(_.woodDark),c=w(_.metalWhite),l=new v(new O(e+1.6,.18,i+1.4),w(_.concrete));l.position.set(.4,.09,.3),t.add(l);const h=.26,d=e-h*2,u=new v(new O(d,o,h),s);u.position.set(0,.18+o/2,-i/2),t.add(u);for(const z of[-1,1]){const B=new v(new O(h,o,i),s);B.position.set(z*(e/2-h/2),.18+o/2,0),t.add(B)}const f=new v(new O(d,.6,.3),r);f.position.set(0,.48,i/2-.1),t.add(f);const g=w(_.glass,{opacity:.5,doubleSide:!0}),M=3,m=e-.5,p=m/M-.16;for(let z=0;z<M;z++){const B=-m/2+m/M*(z+.5),H=new v(new O(p,1.75,.08),g);H.position.set(B,1.68,i/2-.1),t.add(H)}for(let z=0;z<=M;z++){const B=-m/2+m/M*z,H=new v(new O(.14,2.05,.22),c);H.position.set(B,1.68,i/2-.1),t.add(H)}const S=new v(new O(d,.18,.24),c);S.position.set(0,2.68,i/2-.1),t.add(S);for(const[z,B]of[[1.15,[_.morango,_.fabricBlue,_.gold]],[1.95,[_.maracuja,_.wallCream]]]){const H=new v(new O(e-1.2,.1,.6),a);H.position.set(0,z,i/2-.75),t.add(H),B.forEach((W,q)=>{const tt=new ct;for(const Y of[-1,1]){const st=ic(W);st.position.x=Y*.09,tt.add(st)}tt.scale.setScalar(.8),tt.position.set((q-(B.length-1)/2)*1.5,z+.05,i/2-.75),tt.rotation.y=.3,t.add(tt)})}const x=new v(new O(e+1.1,.24,i+1.3),r);x.position.set(0,o+.42,.35),x.rotation.x=-.07,t.add(x);const y=new v(new O(e+1.34,.08,i+1.54),c);y.position.set(0,o+.29,.35),y.rotation.x=-.07,t.add(y);const A=new v(new O(e+1.34,.74,.22),w(n));A.position.set(0,o+.46,i/2+1.18),t.add(A);const P=Zo("Patins",3.2,.46);P.position.set(0,o+.46,i/2+1.31),t.add(P);for(const z of[-1,1]){const B=new v(new nt(.09,.09,o+.3,8),c);B.position.set(z*(e/2+.35),(o+.3)/2,i/2+.62),t.add(B)}const C=e/2+.95,D=new v(new O(1.15,.16,3),a);D.position.set(C,1.06,.2),t.add(D);const E=new v(new nt(.08,.08,3,10),r);E.position.set(C+.55,1.06,.2),t.add(E);const b=new v(new O(.9,.9,2.8),s);b.position.set(C-.1,.6,.2),t.add(b);const L=new v(new O(1.7,.16,3.2),w(n));L.position.set(C+.1,2.35,.2),t.add(L);for(const z of[-1.2,1.5]){const B=new v(new nt(.07,.07,2.35,8),c);B.position.set(C+.6,1.17,.2+z),t.add(B)}return[_.morango,_.gold].forEach((z,B)=>{const H=new ct;for(const W of[-1,1]){const q=ic(z);q.position.x=W*.09,H.add(q)}H.position.set(C,1.14,-.55+B*1.4),H.rotation.y=Math.PI/2+.2,t.add(H)}),t}function Kl(){const n=new ct,t=new v(new O(.34,.05,.34),w(_.frisbee));t.position.y=.025,n.add(t);const e=new v(new Ce(.15,.45,10),w(_.frisbee));e.position.y=.26,n.add(e);const i=new v(new nt(.1,.12,.09,10),w(16777215));return i.position.y=.28,n.add(i),n}function iv(n,t,e=1.5){const i=new ct,o=w(10475752),s=.12,a=new v(new O(n,s,t),w(4165552));a.position.y=-e,a.receiveShadow=!0,i.add(a);for(const[r,c,l,h]of[[n,s,0,-t/2],[n,s,0,t/2],[s,t,-n/2,0],[s,t,n/2,0]]){const d=new v(new O(r,e,c),o);d.position.set(l,-e/2,h),d.receiveShadow=!0,i.add(d)}for(const[r,c,l,h]of[[n+.3,.18,0,-t/2-.12],[n+.3,.18,0,t/2+.12],[.18,t+.3,-n/2-.12,0],[.18,t+.3,n/2+.12,0]]){const d=new v(new O(r,.06,c),w(4951989));d.position.set(l,.02,h),i.add(d)}return i}function ov(n,t){const e=new v(new ze(n,t,12,8),new sd({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function Za(n=_.fabricBlue){const t=new ct;t.userData.peca="espreguicadeira";const e=new v(new O(.68,.07,1.7),w(_.metalWhite));e.position.y=.36,t.add(e);const i=new v(new O(.6,.06,1.5),w(n));i.position.y=.42,t.add(i);const o=new v(new O(.5,.09,.36),w(n));o.position.set(0,.495,-.62),t.add(o);for(const[s,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new v(new nt(.035,.035,.36,6),w(_.metalWhite));r.position.set(s*.3,.18,a*.72),t.add(r)}return t}function sv(n=8,t=3.2,e=_.dequeViga,i=_.dequeRipa){const o=new ct;o.userData.peca="pergolado";const s=w(e),a=w(i),r=2.5,c=.16,l=.05,h=l+r,d=n/2-.25,u=t/2-.25;for(const p of[-d,0,d])for(const S of[-u,u]){const x=new v(new O(c,r,c),s);x.position.set(p,l+r/2,S),o.add(x);const y=new v(new O(c+.12,.1,c+.12),a);y.position.set(p,.05,S),o.add(y)}for(const p of[-u,u]){const S=new v(new O(n,.24,.2),s);S.position.set(0,h+.12,p),o.add(S)}const f=.4,g=Math.floor(n/f);for(let p=0;p<=g;p++){const S=new v(new O(.1,.12,t),a);S.position.set(-n/2+.2+p*f,h+.3,0),o.add(S)}const M=w(_.dequeTrepadeira);for(const[p,S,x]of[[-.42,-.2,1],[-.16,.28,.78],[.12,-.3,.9],[.38,.16,.72]]){const y=new v(new It(.42*x,8,6),M);y.position.set(p*n,h+.42,S*t),y.scale.set(1.5,.5,1.2),o.add(y)}const m=new v(new nt(.05,.03,1.5,6),M);return m.position.set(-d-.09,h-.6,u),o.add(m),o}function av(n=_.dequeViga){const t=new ct;t.userData.peca="mesinha-de-deque";const e=w(n),i=new v(new nt(.06,.09,.46,10),e);i.position.y=.23,t.add(i);const o=new v(new nt(.22,.26,.05,12),e);o.position.y=.025,t.add(o);const s=new v(new nt(.38,.38,.07,16),w(_.dequeTabua));s.position.y=.49,t.add(s);const a=new v(new ge(.37,.03,6,20),e);a.position.y=.47,a.rotation.x=Math.PI/2,t.add(a);const r=co(_.morango);r.position.set(-.14,.525,.05),t.add(r);const c=co(_.laranja);return c.position.set(.15,.525,-.07),t.add(c),t}function Ja(n=_.fabricRed){const t=new ct,e=new v(new nt(.32,.36,.12,12),w(_.concrete));e.position.y=.06,t.add(e);const i=new v(new nt(.045,.045,2.4,8),w(_.wood));i.position.y=1.2,t.add(i);const o=new v(new Ce(1.15,.5,12),w(n));o.position.y=2.35,t.add(o);const s=new v(new Ce(1.17,.18,12,1,!0),w(16777215,{doubleSide:!0}));s.position.y=2.2,t.add(s);const a=new v(new It(.07,8,6),w(_.gold));return a.position.y=2.62,t.add(a),t}function rv(){const n=new ct;for(const t of[-.24,.24]){const e=new v(new ge(.22,.035,6,14,Math.PI),w(_.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),n.add(e);const i=new v(new nt(.035,.035,1.5,8),w(_.metalGrey));i.position.set(t,.05,-.44),n.add(i)}for(let t=0;t<3;t++){const e=new v(new O(.5,.05,.1),w(_.metalGrey));e.position.set(0,-.15-t*.34,-.44),n.add(e)}return n}function Ka(n=_.frisbee){const t=new ct,e=new v(new ge(.42,.16,10,20),w(n));e.rotation.x=Math.PI/2,t.add(e);for(let i=0;i<4;i++){const o=i/4*Math.PI*2+Math.PI/4,s=new v(new ge(.42,.165,10,6,Math.PI/5),w(16777215));s.rotation.set(Math.PI/2,0,o),t.add(s)}return t}function cv(){const n=new ct,t=new v(new nt(.22,.26,.1,12),w(_.concrete));t.position.y=.05,n.add(t);const e=new v(new nt(.05,.05,2.2,8),w(_.metalGrey));e.position.y=1.1,n.add(e);const i=new v(new O(.5,.07,.07),w(_.metalGrey));i.position.set(.22,2.16,0),n.add(i);const o=new v(new nt(.16,.12,.1,12),w(_.metalWhite));return o.position.set(.44,2.08,0),n.add(o),n}function lv(){const n=new ct,t=new v(new O(.7,.8,.7),w(_.concrete));t.position.y=.4,n.add(t);const e=new v(new O(.62,.1,2.4),w(15791350));e.position.set(0,.85,1),n.add(e);for(const i of[-.36,.36]){const o=new v(new ge(.35,.04,6,14,Math.PI),w(_.metalGrey));o.position.set(i,.9,.1),o.rotation.set(0,Math.PI/2,0),n.add(o)}return n}function oc(n=_.flowerPink){const t=new ct,e=new v(new Ce(.075,.22,10),w(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const i=new v(new It(.085,10,8),w(n));i.position.y=.13,t.add(i);const o=new v(new It(.06,8,7),w(n));return o.position.set(.03,.22,-.02),t.add(o),t}function co(n=_.laranja){const t=new ct;t.userData.suco=!0;const e=new v(new nt(.088,.062,.26,12),w(n));e.position.y=.13,t.add(e);const i=new v(new nt(.095,.09,.035,12),w(16645110));i.position.y=.25,t.add(i);const o=new v(new nt(.066,.066,.025,12),w(16645110));o.position.y=.012,t.add(o);const s=new v(new nt(.012,.012,.32,6),w(16645110));s.position.set(.04,.31,.014),s.rotation.z=-.34,t.add(s);const a=new v(new nt(.052,.052,.014,10),w(_.gold));return a.position.set(-.085,.26,0),a.rotation.x=Math.PI/2,a.rotation.z=.3,t.add(a),t}function Ql(n=_.metalGrey){const t=new ct,e=new v(new nt(.07,.09,1.5,10),w(n));e.position.y=.75,t.add(e);const i=new v(new nt(.52,.38,.42,14,1,!0),w(n));i.position.y=1,t.add(i);const o=new v(new ge(.62,.045,6,20),w(n));o.position.y=1.72,o.rotation.x=Math.PI/2,t.add(o);const s=new v(new nt(.1,.1,.3,8),w(n));s.position.y=1.9,t.add(s);for(let a=0;a<10;a++){const r=a/10*Math.PI*2,c=new v(new nt(.015,.015,.62,4),w(13226198));c.position.set(Math.cos(r)*.5,1.4,Math.sin(r)*.5),t.add(c)}return t}function hv(n=_.frisbee,t=1.9,e=.62){const i=new ct,o=e+.34,s=new v(new nt(.06,.08,t+e,10),w(n));s.position.set(-o,(t+e)/2,0),i.add(s);const a=new v(new nt(.24,.3,.12,12),w(_.metalGrey));a.position.set(-o,.06,0),i.add(a);const r=new v(new O(.36,.07,.07),w(n));r.position.set(-o+.18,t,0),i.add(r);const c=new v(new ge(e,.06,8,26),w(n));c.position.y=t,i.add(c);for(const l of[-.9,-.3,.3,.9]){const h=new v(new O(.05,.34,.02),Ye(_.gold));h.position.set(Math.sin(l)*e,t-Math.cos(l)*e-.17,0),i.add(h)}return i.traverse(l=>{const h=l;h.isMesh&&(h.castShadow=!0)}),i.userData.aro=c,i}function dv(n=_.frisbee){const t=new ct,e=Ye(n,.92),i=new v(new ge(.86,.075,8,28),e);i.rotation.x=-Math.PI/2,i.position.y=.08,t.add(i);const o=new v(new nt(.15,.15,.07,14),e);o.position.y=.08,t.add(o);for(let a=0;a<4;a++){const r=a/4*Math.PI*2+Math.PI/4,c=new v(new O(.1,.07,.36),e);c.rotation.y=r,c.position.set(Math.sin(r)*1.3,.08,Math.cos(r)*1.3),t.add(c)}const s=new v(new O(.07,1.5,.07),e);return s.position.y=.75,t.add(s),t}function uv(){const n=new ct;for(const i of[-.8,.8]){const o=new v(new O(.12,1.5,.12),w(_.woodDark));o.position.set(i,.75,0),n.add(o)}const t=new v(new O(2,1.2,.12),w(_.wood));t.position.y=2,n.add(t);const e=new v(new O(1.8,.22,.03),w(_.frisbee));e.position.set(0,2.45,.08),n.add(e);for(const i of[-.45,.45]){const o=new v(new O(.55,.6,.03),w(2830136));o.position.set(i,1.9,.08),n.add(o)}return n}function Sd(n=4){const t=new ct;t.userData.peca="arquibancada";const e=.5;for(let i=0;i<3;i++){const o=.25+i*.34,s=new v(new O(n,.16,e+.04),w(i%2===0?_.metalWhite:_.metalGrey));s.position.set(0,o,-i*e),t.add(s);const a=new v(new O(n-.08,o,.1),w(_.metalGrey));a.position.set(0,o/2,-i*e-.19),t.add(a)}return t}function wd(){const n=new ct,t=new v(new O(.42,.95,.36),w(_.concrete));t.position.y=.48,n.add(t);const e=new v(new nt(.17,.14,.12,12),w(_.metalWhite));e.position.set(0,1,.05),n.add(e);const i=new v(new nt(.03,.03,.16,8),w(_.metalGrey));return i.position.set(0,1.12,-.06),i.rotation.x=.5,n.add(i),n}function fv(){const n=new ct,t=new v(new O(.5,.4,.34),w(4871528));t.position.y=.2,n.add(t);const e=new v(new ge(.16,.028,6,14,Math.PI),w(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,n.add(e),[_.frisbee,6271190,16767070].forEach((o,s)=>{const a=new v(new nt(.2,.18,.05,16),w(o));a.position.set(.34+s*.02,.06+s*.06,.22),a.rotation.z=.12,n.add(a)}),n}function Ed(){const n=new ct,t=new v(new nt(.1,.14,5.5,8),w(_.metalGrey));t.position.y=2.75,n.add(t);const e=new v(new O(.9,.1,.1),w(_.metalGrey));e.position.set(.35,5.5,0),n.add(e);for(const i of[.1,.6]){const o=new v(new O(.42,.3,.22),w(3883600));o.position.set(i,5.62,0),o.rotation.z=-.35,n.add(o);const s=new v(new O(.36,.24,.03),w(16773324,{glow:.25}));s.position.set(i+.04,5.52,0),s.rotation.z=-.35,n.add(s)}return n}function pv(){const n=new ct,t=new v(new nt(.05,.06,3,8),w(_.metalGrey));t.position.y=1.5,n.add(t);const e=new ct;return e.position.y=2.9,[_.frisbee,16777215,_.frisbee,16777215].forEach((o,s)=>{const a=.26-s*.04,r=.22-s*.04,c=new v(new nt(a,r,.3,12,1,!0),w(o,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+s*.3,e.add(c)}),n.add(e),n.userData.manga=e,n}function Zo(n,t,e,i="#ffffff"){const o=document.createElement("canvas");o.width=384,o.height=Math.max(64,Math.round(384*e/t));const s=o.getContext("2d");s&&(s.clearRect(0,0,o.width,o.height),s.fillStyle=i,s.font=`bold ${Math.round(o.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,s.textAlign="center",s.textBaseline="middle",s.fillText(n,o.width/2,o.height/2+4));const a=new Yh(o);return a.colorSpace=Ke,new v(new ze(t,e),new ra({map:a,transparent:!0}))}function sc(n,t=_.fabricBlue,e="#ffffff"){const i=new ct,o=new v(new nt(.08,.08,2.4,8),w(_.metalGrey));o.position.y=1.2,i.add(o);const s=2.1,a=.9,r=new v(new O(s,a,.1),w(t));r.position.y=2.45,i.add(r);const c=new v(new O(s+.12,a+.12,.06),w(_.metalWhite));c.position.set(0,2.45,-.03),i.add(c);const l=Zo(n,s*.86,a*.68,e);return l.position.set(0,2.45,.06),i.add(l),i}function Td(n=4161494){const t=new ct,e=8.4,i=2.6,o=2.5,s=new v(new O(e,i,o),w(n));s.position.y=1.55,t.add(s);const a=new v(new O(e-.2,.22,o-.15),w(_.metalWhite));a.position.y=2.9,t.add(a);const r=new v(new O(e+.04,.3,o+.04),w(_.metalWhite));r.position.y=.6,t.add(r);for(const h of[o/2+.02,-o/2-.02])for(let d=0;d<4;d++){const u=new v(new O(1.5,.9,.05),w(_.glass,{glow:.12}));u.position.set(-e/2+1.4+d*1.85,2.1,h),t.add(u)}for(const[h,d]of[[e/2+.02,0],[-e/2-.02,0]]){const u=new v(new O(.05,1.1,o-.5),w(_.glass,{glow:.12}));u.position.set(h,2.1,0),u.rotation.y=d,t.add(u)}const c=new v(new O(.06,1.9,1),w(2831424));c.position.set(e/2-1.6,1.2,o/2+.02),t.add(c);const l=new v(new O(1.6,.34,.05),w(2040361));l.position.set(e/2-.4,2.75,o/2+.02),t.add(l);for(const[h,d]of[[e/2-1.9,o/2],[e/2-1.9,-o/2],[-e/2+1.6,o/2],[-e/2+1.6,-o/2]]){const u=new v(new nt(.55,.55,.35,14),w(2237482));u.position.set(h,.5,d),u.rotation.x=Math.PI/2,t.add(u);const f=new v(new nt(.24,.24,.38,12),w(_.metalGrey));f.position.set(h,.5,d),f.rotation.x=Math.PI/2,t.add(f)}return t}function Ad(n=_.metalGrey){const t=new ct;for(const s of[-1.5,1.5]){const a=new v(new nt(.07,.07,2.5,8),w(n));a.position.set(s,1.25,-.6),t.add(a)}const e=new v(new O(3.6,.12,1.6),w(n));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const i=new v(new O(3.6,1.6,.08),w(_.glass,{glow:.08}));i.position.set(0,1.35,-1.15),t.add(i);const o=new v(new O(3,.1,.4),w(_.wood));o.position.set(0,.5,-.9),t.add(o);for(const s of[-1.2,1.2]){const a=new v(new O(.08,.5,.36),w(n));a.position.set(s,.25,-.9),t.add(a)}return t}function mv(n=_.restauranteToldo){const t=new ct;t.userData.peca="cadeira-de-patio";const e=w(_.metalWhite),i=new v(new O(.46,.07,.44),w(n));i.position.y=.45,t.add(i);for(let o=0;o<3;o++){const s=new v(new O(.42,.08,.05),w(n));s.position.set(0,.62+o*.13,-.2),t.add(s)}for(const o of[-1,1]){const s=new v(new nt(.022,.022,.55,6),e);s.position.set(o*.21,.7,-.21),t.add(s)}for(const[o,s]of[[-.19,.18],[.19,.18],[-.19,-.18],[.19,-.18]]){const a=new v(new nt(.024,.024,.45,6),e);a.position.set(o,.22,s),a.rotation.z=-Math.sign(o)*.05,a.rotation.x=Math.sign(s)*.05,t.add(a)}return t}function gv(n=_.restauranteToldo){const t=new ct;t.userData.peca="mesa-de-patio";const e=new v(new nt(.62,.62,.07,20),w(_.metalWhite));e.position.y=.74,t.add(e);const i=new v(new ge(.62,.035,6,20),w(n));i.rotation.x=Math.PI/2,i.position.y=.72,t.add(i);const o=new v(new nt(.07,.09,.72,10),w(_.metalGrey));o.position.y=.36,t.add(o);const s=new v(new nt(.34,.38,.06,14),w(_.metalGrey));s.position.y=.03,t.add(s);for(let a=0;a<4;a++){const r=mv(n),c=a*Math.PI/2;r.position.set(Math.sin(c)*1.02,0,Math.cos(c)*1.02),r.rotation.y=c+Math.PI,t.add(r)}return t}function vv(n=13,t=7){const e=new ct;e.userData.peca="restaurante";const i=n/2,o=t/2,s=4.2,a=w(_.restauranteParede),r=w(_.restauranteEsquadria),c=w(_.glass,{glow:.14}),l=new v(new O(n+.5,.34,t+.5),w(_.concrete));l.position.y=.17,e.add(l);const h=new v(new O(n,s,t),a);h.position.y=.34+s/2,e.add(h);const d=new v(new O(n+.06,.28,t+.06),w(_.restauranteFaixa));d.position.y=1.16,e.add(d);const u=o+.03,f=2.4,g=(vt,At,V,ft,K=u)=>{const rt=new v(new O(At,V,.1),r);rt.position.set(vt,ft,K),e.add(rt);const Pt=new v(new O(At-.22,V-.22,.08),c);Pt.position.set(vt,ft,K+.03),e.add(Pt);const Ot=new v(new O(.09,V-.16,.12),r);Ot.position.set(vt,ft,K+.04),e.add(Ot)};for(const vt of[-1,1]){g(vt*(f/2+1.55),2.5,2,2.1),g(vt*(f/2+4.35),2.5,2,2.1);for(const At of[f/2+1.55,f/2+4.35]){const V=new v(new O(2.3,.3,.34),w(_.plantPot));V.position.set(vt*At,1.02,u+.16),e.add(V);for(let ft=0;ft<5;ft++){const K=new v(new It(.17,8,6),w(_.bush));K.position.set(vt*At-.85+ft*.42,1.24,u+.16),e.add(K);const rt=new v(new It(.07,6,5),w(ft%2?_.flowerYellow:_.flowerPink));rt.position.set(vt*At-.85+ft*.42,1.38,u+.2),e.add(rt)}}}const M=new v(new O(f+.34,2.5,.14),r);M.position.set(0,1.53,u),e.add(M);for(const vt of[-1,1]){const At=new v(new O(f/2-.07,2.3,.07),c);At.position.set(vt*(f/4+.02),1.47,u+.02),e.add(At);const V=new v(new nt(.03,.03,.9,6),w(_.metalGrey));V.position.set(vt*.16,1.35,u+.09),e.add(V)}for(const[vt,At]of[[0,f+1.4],[1,f+2]]){const V=new v(new O(At,.17+vt*.02,.42),w(_.concrete));V.position.set(0,.25-vt*.17,o+.28+vt*.4),e.add(V)}const m=3.15,p=.7,S=n-1.2,x=13,y=S/x;for(let vt=0;vt<x;vt++){const At=new v(new O(y,.12,p),w(vt%2?_.metalWhite:_.restauranteToldo));At.position.set(-S/2+y*(vt+.5),m,o+p/2),At.rotation.x=-.12,e.add(At);const V=new v(new Ce(y*.5,.26,3),w(vt%2?_.metalWhite:_.restauranteToldo));V.rotation.x=Math.PI,V.position.set(-S/2+y*(vt+.5),m-.13,o+p-.02),e.add(V)}for(const vt of[-1,1]){const At=new v(new nt(.04,.04,.95,6),w(_.metalGrey));At.position.set(vt*(S/2-.1),m-.35,o+.4),At.rotation.x=Math.PI/2.6,e.add(At)}const A=4.05,P=new v(new O(5.2,.7,.16),w(_.restauranteEsquadria));P.position.set(0,A,o+.06),e.add(P);const C=new v(new O(5.36,.84,.1),w(_.restauranteToldo));C.position.set(0,A,o+.02),e.add(C);const D=Zo("Restaurante",4.5,.56,"#fdf6e8");D.position.set(0,A,o+.15),e.add(D);for(const vt of[-1,1]){const At=new v(new nt(.03,.03,.2,6),w(_.metalGrey));At.rotation.x=Math.PI/2,At.position.set(vt*(f/2+.42),2.5,o+.13),e.add(At);const V=new v(new It(.15,8,6),w(_.gold,{glow:.5}));V.position.set(vt*(f/2+.42),2.44,o+.24),e.add(V)}const E=.34+s,b=1.1,z=o+.55,B=Math.atan2(b,z),H=Math.hypot(z,b);for(const vt of[-1,1]){const At=new v(new O(n+1,.18,H),w(_.roofTile));At.position.set(0,E+b/2,vt*z/2),At.rotation.x=vt*B,e.add(At)}const W=new v(new O(n+1.06,.2,.42),w(_.roofTile));W.position.set(0,E+b+.06,0),e.add(W);const q=new Yo;q.moveTo(-o,0),q.lineTo(o,0),q.lineTo(0,b),q.closePath();const tt=new la(q,{depth:.3,bevelEnabled:!1});for(const vt of[-1,1]){const At=new v(tt,a);At.rotation.y=Math.PI/2,At.position.set(vt>0?i-.3:-i,E,0),e.add(At)}const Y=new v(new O(.7,1.5,.7),w(_.brick));Y.position.set(i-2.2,E+1.2,-o*.35),e.add(Y);const st=new v(new O(.9,.14,.9),w(_.concrete));st.position.set(i-2.2,E+2,-o*.35),e.add(st);const j=new v(new nt(.34,.34,.85,10),w(_.metalGrey));j.position.set(i-4,E+.95,-o*.2),e.add(j);const mt=new v(new Ce(.46,.3,10),w(_.metalGrey));mt.position.set(i-4,E+1.5,-o*.2),e.add(mt);for(let vt=0;vt<3;vt++){const At=new v(new O(.1,.8,1),c);At.position.set(i+.03,2.5,-o+1.4+vt*1.9),e.add(At);const V=new v(new O(.16,.94,1.14),r);V.position.set(i+.005,2.5,-o+1.4+vt*1.9),e.add(V)}for(const vt of[-1.3,.9]){const At=new v(new O(.42,.62,.78),w(_.metalWhite));At.position.set(i+.24,1.7,vt),e.add(At);const V=new v(new nt(.24,.24,.05,12),w(_.metalGrey));V.rotation.z=Math.PI/2,V.position.set(i+.46,1.72,vt),e.add(V)}return e}function _v(n=8,t=5){const e=new ct;e.userData.peca="vestiario";const i=n/2,o=t/2,s=3,a=.25,r=a+s,c=w(_.wallCream),l=w(_.vestiarioAzulejo),h=w(_.concrete),d=new v(new O(n+.4,a,t+.4),h);d.position.y=a/2,e.add(d);const u=new v(new O(n,s,t),c);u.position.y=a+s/2,e.add(u);const f=1.15,g=new v(new O(n+.08,f,t+.08),l);g.position.y=.18+f/2,e.add(g);for(const q of[.58,.92]){const tt=new v(new O(n+.12,.05,t+.12),w(_.vestiarioRejunte));tt.position.y=q,e.add(tt)}const M=new v(new O(n+.16,.09,t+.16),w(_.metalWhite));M.position.y=1.33,e.add(M);const m=o+.03,p=1.05;for(const q of[-1,1]){const tt=q*1.15,Y=new v(new O(p+.26,2.36,.13),h);Y.position.set(tt,1.16,m),e.add(Y);const st=new v(new O(p,2.16,.09),w(_.vestiarioPorta));st.position.set(tt,1.12,m+.04),e.add(st);for(let vt=0;vt<6;vt++){const At=new v(new O(p-.18,.08,.05),w(_.vestiarioRejunte));At.position.set(tt,.42+vt*.16,m+.09),At.rotation.x=.35,e.add(At)}const j=new v(new It(.055,8,6),w(_.metalGrey));j.position.set(tt-q*(p/2-.14),1.05,m+.11),e.add(j);const mt=new v(new O(.5,.3,.05),w(_.metalWhite));mt.position.set(tt,2.44,m+.05),e.add(mt)}const S=2.75,x=.7,y=new v(new O(n-1,.16,x),h);y.position.set(0,S,o+x/2),e.add(y);const A=new v(new O(n-1.1,.42,.1),w(_.vestiarioPorta));A.position.set(0,S-.17,o+x),e.add(A);const P=Zo("Vestiário",2.6,.3,"#fdf6e8");P.position.set(0,S-.13,o+x+.06),e.add(P);for(const q of[-1,1]){const tt=new v(new O(.1,.62,.1),h);tt.position.set(q*(n/2-.85),S-.38,o+.14),tt.rotation.x=-.6,e.add(tt)}const C=(q,tt,Y,st)=>{const j=new v(new O(st?.14:.34,.34,st?.34:.14),c);j.position.set(q,tt,Y),e.add(j);const mt=new v(new ge(.1,.035,6,10),w(_.wallAzul));mt.position.set(q+(st?.02:0),tt,Y+(st?0:.02)),st&&(mt.rotation.y=Math.PI/2),e.add(mt)};for(const q of[-1,1])for(let tt=0;tt<2;tt++)C(q*(i-.45-tt*.42),2.52,m+.05,!1);for(let q=0;q<6;q++)C(i+.05,2.52,-o+.7+q*.7,!0);const D=new v(new O(n+.5,.22,t+.5),h);D.position.y=r+.11,e.add(D);for(const[q,tt,Y,st]of[[0,o+.1,n+.5,.14],[0,-o-.1,n+.5,.14],[i+.13,0,.14,t-.1],[-i-.13,0,.14,t-.1]]){const j=new v(new O(Y,.4,st),c);j.position.set(q,r+.42,tt),e.add(j)}const E=new v(new O(1.5,.4,1.5),h);E.position.set(-i+1.6,r+.42,-o+1.5),e.add(E);const b=new v(new nt(.72,.62,.95,14),w(_.vestiarioCaixa));b.position.set(-i+1.6,r+1.1,-o+1.5),e.add(b);const L=new v(new nt(.5,.5,.14,12),w(_.metalGrey));L.position.set(-i+1.6,r+1.63,-o+1.5),e.add(L);const z=new v(new nt(.07,.07,r+.3,8),w(_.metalWhite));z.position.set(-i-.14,(r+.3)/2,o-.5),e.add(z);const B=new v(new nt(.07,.07,.4,8),w(_.metalWhite));B.rotation.z=Math.PI/2,B.position.set(-i-.3,.28,o-.5),e.add(B);const H=new v(new nt(.04,.04,.34,6),w(_.metalGrey));H.position.set(i-.6,.62,m+.16),H.rotation.x=.9,e.add(H);const W=new v(new It(.09,8,6),w(_.metalRed));return W.position.set(i-.6,.82,m+.06),e.add(W),e}function Oc(n=.26){const t=new ct,e=new v(new nt(n*.82,n*.7,.02,16),w(_.metalWhite));e.position.y=.012,t.add(e);const i=new v(new ge(n*.88,.022,6,18),w(_.metalWhite));return i.rotation.x=Math.PI/2,i.position.y=.03,t.add(i),t}function Pd(){const n=new ct;n.userData.peca="arepa-queijo",n.add(Oc());const t=new v(new nt(.16,.15,.075,14),w(_.arepaMilho));t.position.y=.08,n.add(t);const e=new v(new nt(.155,.155,.018,14),w(_.arepaTostada));e.position.y=.125,n.add(e);const i=new v(new O(.18,.03,.06),w(_.arepaQueijo));i.position.set(0,.08,.13),n.add(i);const o=new v(new It(.03,8,6),w(_.arepaQueijo));return o.position.set(.05,.055,.16),n.add(o),n}function Mv(){const n=Pd();n.userData.peca="arepa-recheada";for(const[t,e,i]of[[-.05,.1,.3],[.04,.12,-.4],[0,.07,.1]]){const o=new v(new O(.09,.022,.03),w(_.hamburguerCarne));o.position.set(t,.14,e),o.rotation.y=i,n.add(o)}return n}function th(n=2){const t=new ct;t.userData.peca=n>1?"duplo-queijo":"quarteirao",t.add(Oc(.3));let e=.045;const i=(s,a,r,c=14)=>{const l=new v(new nt(a,a,s,c),w(r));l.position.y=e+s/2,t.add(l),e+=s};i(.045,.135,_.hamburguerPao);for(let s=0;s<n;s++)i(.04,.145,s%2?_.hamburguerCarneEscura:_.hamburguerCarne),i(.014,.152,_.arepaQueijo,4);i(.022,.148,_.hamburguerAlface,16);const o=new v(new It(.14,14,8,0,Math.PI*2,0,Math.PI/2),w(_.hamburguerPao));o.scale.y=.62,o.position.y=e,t.add(o);for(const[s,a]of[[-.05,.03],[.04,-.02],[.01,.06],[-.02,-.05]]){const r=new v(new It(.011,6,4),w(_.hamburguerGergelim));r.position.set(s,e+.06,a),t.add(r)}for(const[s,a,r]of[[.2,.06,.4],[.23,-.02,-.2],[.18,-.08,.15]]){const c=new v(new O(.03,.13,.03),w(_.hamburguerBatata));c.position.set(s,.11,a),c.rotation.set(.3,r,r),t.add(c)}return t}function xv(){const n=new ct;n.userData.peca="perro-tradicional",n.add(Oc(.3));const t=new v(new an(.065,.28,4,10),w(_.hamburguerPao));t.rotation.z=Math.PI/2,t.position.y=.1,n.add(t);const e=new v(new an(.042,.34,4,10),w(_.perroSalsicha));e.rotation.z=Math.PI/2,e.position.y=.15,n.add(e);for(const[i,o]of[_.perroMostarda,_.perroKetchup,_.metalWhite].entries()){const s=new v(new O(.3,.012,.02),w(o));s.position.set(0,.186+i*.014,-.028+i*.028),n.add(s)}for(const[i,o,s]of[[-.1,.02,.5],[-.02,-.03,-.3],[.07,.03,.8],[.13,-.02,.1]]){const a=new v(new O(.055,.008,.008),w(_.hamburguerBatata));a.position.set(i,.215,o),a.rotation.y=s,n.add(a)}return n}function yv(n){switch(n){case"arepa-queijo":return Pd();case"arepa-recheada":return Mv();case"duplo-queijo":return th(2);case"quarteirao":return th(1);case"perro-tradicional":return xv();case"suco-morango":return co(_.morango);case"smoothie-manga-banana":return co(_.maracuja);default:return null}}function bv(n=_.cachorroPelo){const t=new ct;t.userData.peca="garcom-canino";const e=w(n),i=w(_.cachorroPeito),o=new v(new O(.22,.2,.4),e);o.position.set(0,.3,-.02),t.add(o);const s=new v(new O(.19,.12,.14),i);s.position.set(0,.27,.16),t.add(s);for(const[g,M]of[[-.075,.13],[.075,.13],[-.075,-.15],[.075,-.15]]){const m=new v(new O(.06,.22,.07),e);m.position.set(g,.11,M),t.add(m);const p=new v(new O(.075,.05,.095),i);p.position.set(g,.025,M+.012),t.add(p)}const a=new v(new O(.2,.18,.19),e);a.position.set(0,.45,.2),t.add(a);const r=new v(new O(.11,.085,.1),i);r.position.set(0,.41,.31),t.add(r);const c=new v(new O(.055,.04,.03),w(_.cachorroFocinho));c.position.set(0,.425,.365),t.add(c);for(const g of[-1,1]){const M=new v(new It(.022,8,6),w(2828851));M.position.set(g*.055,.48,.295),t.add(M);const m=new v(new O(.05,.15,.06),w(_.cachorroOrelha));m.position.set(g*.115,.44,.17),m.rotation.z=g*.28,t.add(m)}for(const g of[-1,1]){const M=new v(new O(.07,.06,.03),w(_.gravataBorboleta));M.position.set(g*.05,.345,.245),M.rotation.z=g*.35,t.add(M)}const l=new v(new O(.035,.035,.04),w(_.gravataNo));l.position.set(0,.345,.255),t.add(l);const h=new v(new O(.04,.04,.16),e);h.position.set(0,.38,-.24),h.rotation.x=.7,t.add(h);const d=new v(new O(.05,.05,.05),i);d.position.set(0,.45,-.3),t.add(d);const u=new v(new O(.24,.02,.3),w(_.wood));u.position.set(0,.41,-.02),t.add(u);const f=new ve;return f.name="bandeja",f.position.set(0,.42,-.02),t.add(f),t.userData.bandeja=f,t}function Sv(n){const t=new ct,e=n.headR,i=e*1.07,o=Math.PI*.54,s=e*.06,a=new v(new It(i,18,12,0,Math.PI*2,0,o),w(_.roupaLa));a.position.y=s,a.scale.y=1.16,t.add(a);const r=s+i*Math.cos(o)*1.16,c=i*Math.sin(o),l=new v(new nt(c*1.03,c*1.03,e*.26,18),w(_.roupaLaBarra));l.position.y=r,t.add(l);const h=new v(new It(e*.2,10,8),w(_.roupaLaBarra));return h.position.y=s+i*1.16,t.add(h),t}function wv(n){const t=new ct,e=new v(new nt(n.h*.05*n.w,n.h*.055*n.w,n.h*.08,12),w(_.roupaBotaCano));e.position.y=-n.legH+n.h*.075,t.add(e);const i=new v(new nt(n.h*.058*n.w,n.h*.058*n.w,n.h*.018,12),w(_.roupaBota));return i.position.y=-n.legH+n.h*.113,t.add(i),t}function Xn(n,t,e=t){const i=new ct;for(const s of[-1,1]){const a=new v(new It(n*.86,9,7),w(t));a.position.x=s*n*.86,a.scale.set(1.05,.72,.42),i.add(a);const r=new v(new O(n*.34,n*1.5,n*.14),w(t));r.position.set(s*n*.42,-n*.95,0),r.rotation.z=s*.32,i.add(r)}const o=new v(new It(n*.3,8,6),w(e));return o.scale.z=.7,i.add(o),i}function ai(n,t,e,i=.85){const o=new ct,s=w(e),a=t*.6,r=Math.max(8,Math.ceil(2*Math.PI*n/(a*1.25)));for(let c=0;c<r;c++){const l=c/r*Math.PI*2,h=new v(new It(a,7,6),s);h.position.set(Math.sin(l)*n,0,Math.cos(l)*n*i),h.scale.set(1,.88,.34),h.rotation.y=l,o.add(h)}return o}function eh(n,t,e,i=3){const o=new ct,s=w(e),a=t/i,r=Math.hypot(n,a);for(let c=0;c<i;c++)for(const l of[-1,1]){const h=new v(new O(r,t*.07,t*.05),s);h.position.y=-t/2+a*(c+.5),h.rotation.z=l*Math.atan2(a,n),o.add(h)}return o}function Cd(n,t){const e=new v(new It(n,12,10),w(t));return e.scale.set(1,.82,.92),e}function Ev(n){const t=new ct,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=.85,r=w(_.vestidoRosa),c=w(_.vestidoRenda,{doubleSide:!0}),l=w(_.vestidoFita),h=new v(new nt(s*1.1,s*1.06,e*.035,18,1,!0),c);h.position.y=o+n.torsoH*.78,h.scale.z=a,t.add(h);for(const y of[-1,1]){const A=new v(new ge(e*.042*i,e*.016,6,14),c);A.position.set(y*e*.1*i,o+n.torsoH*.84,0),A.rotation.set(Math.PI/2,0,y*.3),A.scale.z=.8,t.add(A)}const d=Xn(e*.04,_.vestidoFita,_.vestidoRenda);d.position.set(0,o+n.torsoH*.62,s*.9),t.add(d);const u=new v(new nt(s*1.08,s*1.08,e*.03,18,1,!0),l);u.position.y=o+n.torsoH*.16,u.scale.z=a,t.add(u);const f=Xn(e*.036,_.vestidoRosa,_.vestidoFita);f.position.set(0,o+n.torsoH*.14,s*.92),t.add(f);const g=o+n.torsoH*.1,M=o-e*.13,m=s*2,p=new v(new nt(s*1.02,m*.82,g-M-e*.05,20,1,!0),r);p.position.y=(g+M+e*.05)/2,p.scale.z=a,t.add(p);const S=new v(new nt(m*.78,m,e*.08,20,1,!0),r);S.position.y=M+e*.04,S.scale.z=a,t.add(S);const x=new v(new nt(m*1.04,m*1.12,e*.032,20,1,!0),c);x.position.y=M,x.scale.z=a,t.add(x);for(const y of[-.9,0,.9]){const A=Xn(e*.022,_.vestidoFita,_.vestidoRenda);A.position.set(Math.sin(y)*m*.92,M+e*.055,Math.cos(y)*m*.92*a),A.rotation.y=y,t.add(A)}return t}function Tv(n){const t=new ct,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=e*.1*i,c=.85,l=w(_.maidCreme),h=w(_.maidCreme,{doubleSide:!0}),d=w(_.maidFita),u=o+n.torsoH*.12,f=o-e*.14,g=s*2,M=new v(new nt(s*1.04,g,u-f,20,1,!0),w(_.maidPreto,{doubleSide:!0}));M.position.y=(u+f)/2,M.scale.z=c,t.add(M);const m=new v(new nt(g*1.01,g*1.06,e*.038,20,1,!0),h);m.position.y=f+e*.016,m.scale.z=c,t.add(m);const p=ai(g*1.04,e*.03,_.maidCreme,c);p.position.y=f-e*.008,t.add(p);const S=o+n.torsoH*.16,x=o-e*.045,y=new v(new nt(s*1.06,g*.86,S-x,16,1,!0,-1.15,2.3),h);y.position.y=(S+x)/2,y.scale.z=c,t.add(y);const A=ai(g*.88,e*.034,_.maidCreme,c);A.position.y=x,t.add(A);const P=o+n.torsoH*.2,C=new v(new nt(s*1.1,s*1.1,e*.055,18,1,!0),h);C.position.y=P,C.scale.z=c,t.add(C);for(const B of[-1,1]){const H=eh(e*.03,e*.045,_.maidFita,3);H.position.set(B*s*.5,P,s*.92),t.add(H);const W=Xn(e*.017,_.maidFita);W.position.set(B*s*.5,P-e*.028,s*.96),t.add(W)}for(const B of[-1,1]){const H=new v(new O(e*.055*i,a-P,e*.02),l);H.position.set(B*s*.62,(a+P)/2,s*.7),H.rotation.y=-B*.5,t.add(H);const W=new v(new O(e*.022*i,a-P,e*.03),h);W.position.set(B*s*.98,(a+P)/2,s*.4),W.rotation.y=-B*.95,t.add(W)}const D=new v(new O(s*.9,n.torsoH*.24,e*.014),l);D.position.set(0,o+n.torsoH*.4,s*.8),t.add(D);const E=eh(s*.55,n.torsoH*.2,_.maidFita,4);E.position.set(0,o+n.torsoH*.4,s*.87),t.add(E);const b=o+n.torsoH*.68;for(const B of[-1,1]){const H=new v(new O(e*.1*i,n.torsoH*.46,e*.012),l);H.position.set(B*e*.06*i,b,s*.82),H.rotation.z=B*.34,t.add(H);const W=new v(new O(e*.007,n.torsoH*.4,e*.006),d);W.position.set(B*e*.088*i,b+n.torsoH*.02,s*.88),W.rotation.z=B*.34,t.add(W);const q=new v(new O(e*.075*i,e*.012,s*1.5),l);q.position.set(B*r*.86,a+e*.012,0),q.rotation.z=B*.16,t.add(q)}const L=new v(new O(e*.24*i,n.torsoH*.36,e*.014),l);L.position.set(0,o+n.torsoH*.74,-s*.8),t.add(L);const z=new v(new O(e*.24*i,e*.011,e*.006),d);z.position.set(0,o+n.torsoH*.57,-s*.87),t.add(z);for(const B of[-1,1]){const H=Cd(e*.055*i,_.maidCreme);H.position.set(B*r,a-e*.012,0),t.add(H)}return t}function Av(n){const t=new ct,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=e*.1*i,c=.85,l=w(_.maidCreme),h=w(_.maidCreme,{doubleSide:!0}),d=w(_.maidFita),u=o+n.torsoH*.12,f=o-e*.14,g=s*2,M=new v(new nt(s*1.04,g,u-f,20,1,!0),w(_.maidPreto,{doubleSide:!0}));M.position.y=(u+f)/2,M.scale.z=c,t.add(M);const m=ai(g*1.02,e*.036,_.maidPreto,c);m.position.y=f+e*.004,t.add(m);const p=o+n.torsoH*.26,S=o-e*.055,x=new v(new nt(s*1.04,g*.9,p-S,16,1,!0,-1.2,2.4),h);x.position.y=(p+S)/2,x.scale.z=c,t.add(x);const y=ai(g*.92,e*.036,_.maidCreme,c);y.position.y=S,t.add(y);const A=new ct,P=new v(new It(e*.011,8,6),d);P.scale.set(1,1.15,.3),A.add(P);for(let Y=0;Y<3;Y++){const st=new v(new It(e*.005,6,5),d);st.position.set((Y-1)*e*.012,e*.016,0),st.scale.z=.3,A.add(st)}A.position.set(g*.42,o-e*.005,g*.72*c),A.rotation.y=.5,t.add(A);const C=n.torsoH*.3,D=p+C*.5,E=s*1.62,b=s*.84,L=new v(new O(E,C,e*.014),l);L.position.set(0,D,b),t.add(L);for(const Y of[-1,1]){const st=new v(new Ce(e*.028,e*.045,4),l);st.position.set(Y*E*.32,D+C*.5+e*.019,b),st.rotation.set(0,Math.PI/4,Y*.26),st.scale.set(1,1,.3),t.add(st)}for(const Y of[-1,1]){const st=new v(new ge(e*.014,e*.004,5,10,Math.PI),d);st.position.set(Y*E*.26,D+C*.08,b+e*.009),st.rotation.z=Math.PI,t.add(st)}const z=new v(new ge(e*.009,e*.003,5,10,Math.PI),d);z.position.set(0,D-C*.12,b+e*.009),z.rotation.z=Math.PI,t.add(z);for(const Y of[-1,1])for(let st=0;st<3;st++){const j=new v(new O(e*.036,e*.0035,e*.0035),d);j.position.set(Y*E*.4,D-C*.05+(st-1)*e*.012,b+e*.008),j.rotation.z=Y*(st-1)*.24,t.add(j)}const B=Xn(e*.032,_.maidCreme);B.position.set(-s*1.25,o+n.torsoH*.16,s*.5),B.rotation.y=-.55,t.add(B);const H=new v(new nt(s*.6,s*1.3,e*.018,20,1,!0),h);H.position.y=a+e*.008,H.scale.z=c,t.add(H);const W=ai(s*1.3,e*.02,_.maidCreme,c);W.position.y=a-e*.006,t.add(W);const q=Xn(e*.05,_.maidLacoVermelho);q.position.set(0,o+n.torsoH*.78,s*1.12),t.add(q);const tt=new v(new It(e*.016,10,8),w(_.gold,{glow:.2}));tt.position.set(0,o+n.torsoH*.71,s*1.16),t.add(tt);for(const Y of[-1,1]){const st=Cd(e*.056*i,_.maidPreto);st.position.set(Y*r,a-e*.012,0),t.add(st);const j=ai(e*.05*i,e*.024,_.maidCreme,1);j.position.set(Y*r,a-e*.058,0),t.add(j)}return t}function Pv(n,t){const e=new ct,i=w(t);for(const s of[-1,1]){const a=new v(new It(n*.56,8,6),i);a.position.set(s*n*.44,n*.34,0),a.scale.z=.34,e.add(a)}const o=new v(new Ce(n*.78,n*1.2,10),i);return o.position.y=-n*.34,o.rotation.x=Math.PI,o.scale.z=.34,e.add(o),e}function Cv(n){const t=new ct,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=.85,c=w(_.waRosa),l=w(_.waRosa,{doubleSide:!0}),h=w(_.waRosaForte),d=w(_.waEscuro),u=w(_.waEscuro,{doubleSide:!0}),f=w(_.waBranco,{doubleSide:!0}),g=o+n.torsoH*.1,M=o-e*.135,m=s*2,p=new v(new nt(s*1.02,m,g-M,22,1,!0),u);p.position.y=(g+M)/2,p.scale.z=r,t.add(p);const S=16,x=s*1.02,y=g-M,A=-Math.atan2(m-x,y);for(let st=0;st<S;st++){const j=new ct;j.rotation.y=st/S*Math.PI*2;const mt=new v(new O(e*.011,y*.94,e*.009),d);mt.position.set(0,(g+M)/2,(x+m)/2),mt.rotation.x=A,j.add(mt),j.scale.z=r,t.add(j)}const P=13;for(let st=0;st<P;st++){const j=st/P*Math.PI*2,mt=Pv(e*.034,_.waEscuro);mt.position.set(Math.sin(j)*m*1.03,M-e*.016,Math.cos(j)*m*1.03*r),mt.rotation.y=j,t.add(mt)}const C=o+n.torsoH*.16,D=o-e*.095,E=new v(new nt(s*1.02,m*.9,C-D,16,1,!0,-1.25,2.5),f);E.position.y=(C+D)/2,E.scale.z=r,t.add(E);const b=ai(m*.92,e*.03,_.waBranco,r);b.position.y=D,t.add(b);const L=o+n.torsoH*.14,z=o+n.torsoH*.5,B=new v(new nt(s*1.07,s*1.1,z-L,18,1,!0),u);B.position.y=(z+L)/2,B.scale.z=r,t.add(B);const H=new v(new O(s*.62,n.torsoH*.26,e*.012),d);H.position.set(0,o+n.torsoH*.6,s*.82),t.add(H);const W=new v(new ge(e*.019,e*.005,6,12),w(_.waFivela));W.position.set(0,o+n.torsoH*.56,s*.89),W.scale.set(1.25,1,1),t.add(W);for(const st of[-1,1]){const j=new v(new O(s*1.15,n.torsoH*.42,e*.013),c);j.position.set(st*s*.24,o+n.torsoH*.68,s*.76),j.rotation.z=st*.52,t.add(j)}const q=new v(new nt(s*.78,s*.92,n.torsoH*.2,16,1,!0),l);q.position.y=a-n.torsoH*.02,q.scale.z=r,t.add(q);const tt=Xn(e*.05,_.waRosaForte);tt.position.set(0,L+e*.014,s*1.12),t.add(tt);for(const st of[-1,1]){const j=new v(new O(e*.026,e*.2,e*.008),h);j.position.set(st*e*.022,L-e*.09,m*.78),j.rotation.z=st*.1,t.add(j);const mt=new v(new Ce(e*.018,e*.03,4),h);mt.position.set(st*e*.024,L-e*.2,m*.8),mt.rotation.set(Math.PI,Math.PI/4,0),mt.scale.z=.3,t.add(mt)}const Y=new v(new nt(e*.043,e*.045,e*.022,14,1,!0),u);return Y.position.y=a+n.torsoH*.12,t.add(Y),t}function Rv(n,t){const e=new ct,{h:i,w:o}=n,s=i*.3,a=t*i*.052*o,r=i*.068*o,c=1.2,l=new v(new nt(i*.045*o,r,s*.94,14,1,!0),w(_.waEscuro,{doubleSide:!0}));l.position.set(a*.45,-s*.44,0),l.scale.z=.78,e.add(l);const h=new v(new nt(r,r*.86,s*.38,14,1,!0),w(_.waEscuro,{doubleSide:!0}));h.position.set(a,-s*(c-.19),0),h.scale.z=.78,e.add(h);const d=ai(r*.9,i*.024,_.waBranco,.78);return d.position.set(a,-s*c,0),e.add(d),e}function Iv(n){const t=new ct,{h:e,w:i}=n,o=-n.legH*.28,s=new v(new nt(e*.047*i,e*.047*i,e*.022,14,1,!0),w(_.waBranco,{doubleSide:!0}));s.position.y=o,t.add(s);const a=new v(new nt(e*.049*i,e*.049*i,e*.014,14,1,!0),w(_.waRosaForte,{doubleSide:!0}));a.position.y=o+e*.026,t.add(a);const r=Xn(e*.013,_.waRosaForte);return r.position.set(0,o+e*.026,e*.05*i),t.add(r),t}function Dv(n){const t=new ct,{h:e,w:i}=n,o=n.legH,s=e*.105*i,a=o+n.torsoH*.86,r=o+n.torsoH,c=.95,l=w(_.moletomPreto),h=w(_.moletomPreto,{doubleSide:!0}),d=w(_.moletomCostura),u=w(_.moletomZiper),f=w(_.moletomForro,{doubleSide:!0}),g=s*1.1,M=s*1.04,m=o+e*.012,p=a+n.torsoH*.03,S=g*c,x=new v(new nt(g,M,p-m,22),l);x.position.y=(p+m)/2,x.scale.z=c,t.add(x);const y=new v(new It(g,22,10,0,Math.PI*2,0,Math.PI/2),l);y.position.y=p,y.scale.set(1,.42,c),t.add(y);const A=new v(new nt(M*1.03,M*1.01,e*.022,22,1,!0),h);A.position.y=m+e*.011,A.scale.z=c,t.add(A);const P=r+e*.015,C=new v(new nt(s*1.75,s*1.15,e*.07,20,1,!0),h);C.position.y=P,C.scale.z=.95,t.add(C);const D=new v(new nt(s*1.62,s*1.05,e*.066,20,1,!0),f);D.position.y=P-e*.003,D.scale.z=.95,t.add(D);const E=new v(new It(s*1.15,16,12,0,Math.PI*2,0,Math.PI*.6),h);E.position.set(0,a+n.torsoH*.14,-s*.72),E.rotation.x=-1.25,E.scale.set(1.4,.95,.62),t.add(E);const b=P+e*.005,L=m+e*.014,z=new v(new O(e*.014,b-L,e*.018),u);z.position.set(0,(b+L)/2,S*.99),t.add(z);const B=new v(new O(e*.02,e*.026,e*.012),d);B.position.set(0,o+n.torsoH*.5,S*1.03),t.add(B);const H=new v(new nt(g*1.012,g*1.012,e*.007,22,1,!0),w(_.moletomCostura,{doubleSide:!0}));H.position.y=o+n.torsoH*.68,H.scale.z=c,t.add(H);for(const W of[-1,1]){const q=new ct;q.rotation.y=W*.62,q.scale.z=c;const tt=new v(new O(e*.013,e*.062,e*.012),d);tt.position.set(0,o+n.torsoH*.2,g*1),tt.rotation.z=W*.36,q.add(tt),t.add(q)}for(const W of[-1,1]){const q=new v(new nt(e*.006,e*.006,e*.016,8),w(_.moletomPonteira));q.position.set(W*e*.022,m+e*.006,M*c*.99),t.add(q)}return t}function Lv(n){const t=new ct,{h:e,w:i}=n,o=e*.3,s=.82,a=new v(new It(e*.058*i,12,10),w(_.moletomPreto));a.position.y=-o*.03,a.scale.set(1,.92,.95),t.add(a);const r=new v(new nt(e*.056*i,e*.046*i,o*s,14,1,!0),w(_.moletomPreto,{doubleSide:!0}));r.position.y=-o*s*.5,t.add(r);const c=new v(new nt(e*.047*i,e*.045*i,e*.022,14),w(_.moletomCostura));return c.position.y=-o*s,t.add(c),t}function Uv(n){const t=new ct,i=-n.headR*.98,o=new v(new nt(n.h*.043,n.h*.045,n.h*.026,14,1,!0),w(_.vestidoRenda,{doubleSide:!0}));o.position.y=i,t.add(o);const s=Xn(n.h*.026,_.vestidoFita,_.vestidoRenda);return s.position.set(0,i,n.h*.044),t.add(s),t}function Nv(n){const t=new ct,e=n.headR,i=w(_.oculosLente),o=w(_.oculosArmacao),s=e*.04,a=e*.26,r=e*1.07;for(const l of[-1,1]){const h=new v(new nt(a,a,e*.07,20),i);h.rotation.x=Math.PI/2,h.position.set(l*e*.38,s,r),t.add(h);const d=new v(new ge(a,e*.03,8,20),o);d.position.set(l*e*.38,s,r+e*.005),t.add(d);const u=e*.6,f=r-e*.06,g=e*.78,M=e*.4,m=g-u,p=M-f,S=new v(new O(e*.05,e*.07,Math.hypot(m,p)),o);S.position.set(l*(u+g)/2,s+e*.07,(f+M)/2),S.rotation.y=l*Math.atan2(m,p),t.add(S)}const c=new v(new nt(e*.025,e*.025,e*.34,8),o);return c.rotation.z=Math.PI/2,c.position.set(0,s+e*.07,r+e*.02),t.add(c),t}const te={sorveteMorango:{id:"sorvete-morango",nome:"Sorvete de morango",icone:"🍦",tipo:"mao",nota:"do Ari",holdPose:"upright"},sorveteMaracuja:{id:"sorvete-maracuja",nome:"Sorvete de maracujá",icone:"🍦",tipo:"mao",nota:"do Renan",holdPose:"upright"},sucoPessego:{id:"suco-pessego",nome:"Suco de pêssego",icone:"🥤",tipo:"mao",nota:"do Ari",holdPose:"upright"},sucoMorango:{id:"suco-morango",nome:"Suco de morango",icone:"🥤",tipo:"mao",nota:"do Renan",holdPose:"upright"},chapeuPingPong:{id:"chapeu-ping-pong",nome:"Chapéu de campeão",icone:"👑",tipo:"vestivel",slot:"cabeca",nota:"ping pong, 5 a 0"},patins:{id:"patins",nome:"Patins",icone:"🛼",tipo:"vestivel",slot:"pes",funcional:!0,nota:"da lojinha do parque · +velocidade"},gorroDeLa:{id:"gorro-la",nome:"Gorro de lã",icone:"🧢",tipo:"vestivel",slot:"cabeca",cor:_.roupaLa,corDetalhe:_.roupaLaBarra,nota:"para o frio que nunca faz",cobreCabelo:!0,extra:Sv},camisaListrada:{id:"camisa-listrada",nome:"Camisa listrada",icone:"👕",tipo:"vestivel",slot:"tronco",cor:_.roupaListra,corDetalhe:_.roupaListraManga,nota:"mangas claras"},calcaJeans:{id:"calca-jeans",nome:"Calça jeans",icone:"👖",tipo:"vestivel",slot:"pernas",cor:_.roupaJeans,nota:"a de sempre"},vestidoRosa:{id:"vestido-rosa",nome:"Vestido rosa de babados",icone:"👗",tipo:"vestivel",slot:"tronco",cor:_.vestidoRosa,corDetalhe:_.vestidoRenda,nota:"da vitrine que o Renan viu",bracosNus:!0,pernasNuas:!0,extra:Ev},maidMarinheiro:{id:"maid-marinheiro",nome:"Maid marinheiro",icone:"🖤",tipo:"vestivel",slot:"tronco",cor:_.maidPreto,corDetalhe:_.maidCreme,nota:"gola de marinheiro e cadarço",pernasNuas:!0,extra:Tv},maidGatinho:{id:"maid-gatinho",nome:"Maid gatinho",icone:"🐱",tipo:"vestivel",slot:"tronco",cor:_.maidPreto,corDetalhe:_.maidPreto,nota:"com guizo e cara de gato",pernasNuas:!0,extra:Av},maidJapones:{id:"maid-japones",nome:"Maid japonês",icone:"🌸",tipo:"vestivel",slot:"tronco",cor:_.waRosa,corDetalhe:_.waRosa,nota:"manga de quimono e festão de corações",pernasNuas:!0,extra:Cv,extraBraco:Rv},moletomPreto:{id:"moletom-preto",nome:"Moletom preto",icone:"🧥",tipo:"vestivel",slot:"tronco",cor:_.moletomPreto,corDetalhe:_.moletomPreto,nota:"com capuz e zíper, o da foto no espelho",extra:Dv,extraBraco:Lv},meiaDeCoxa:{id:"meia-de-coxa",nome:"Meia de coxa",icone:"🧦",tipo:"vestivel",slot:"pernas",cor:_.waBranco,nota:"com a liga rosa",extra:Iv},gargantilhaDeLaco:{id:"gargantilha-laco",nome:"Gargantilha de laço",icone:"🎀",tipo:"vestivel",slot:"cabeca",cor:_.vestidoFita,nota:"combina com o vestido",extra:Uv},botaAmarela:{id:"bota-amarela",nome:"Bota amarela",icone:"🥾",tipo:"vestivel",slot:"pes",cor:_.roupaBota,corDetalhe:_.roupaBotaCano,nota:"chama atenção de longe",extra:wv},oculosEscuros:{id:"oculos-escuros",nome:"Óculos escuros",icone:"🕶️",tipo:"vestivel",slot:"cabeca",nota:"do vestiário do clube",extra:Nv},bermudaAzul:{id:"bermuda-azul",nome:"Bermuda azul",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaAzul,nota:"a cor da própria piscina"},bermudaVermelha:{id:"bermuda-vermelha",nome:"Bermuda vermelha",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaVermelha,nota:"dá pra achar de longe"},bermudaAmarela:{id:"bermuda-amarela",nome:"Bermuda amarela",icone:"🩳",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaAmarela,nota:"sol de tarde"},bermudaEstampada:{id:"bermuda-estampada",nome:"Bermuda estampada",icone:"🌺",tipo:"vestivel",slot:"pernas",corBanho:_.bermudaEstampa,estampaBanho:_.bermudaEstampaFaixa,nota:"duas faixas cor de areia"},frisbee:{id:"frisbee",nome:"Frisbee",icone:"🥏",tipo:"mao",nota:"do parque",holdPose:"relaxed"}},Rd=[te.bermudaAzul,te.bermudaVermelha,te.bermudaAmarela,te.bermudaEstampada],zv={"sorvete-morango":()=>oc(_.morango),"sorvete-maracuja":()=>oc(_.maracuja),"suco-pessego":()=>co(_.pessego),"suco-morango":()=>co(_.morango),frisbee:()=>yd(_.frisbee)},Ov=Object.fromEntries(Object.values(te).map(n=>[n.id,n]));function Ws(n){return Ov[n]??null}function Fv(n){const t=zv[n]?.();return t?(t.userData.item=n,t):null}const Hn=10,Wo=4;function Xo(n){return n.tipo==="vestivel"&&n.funcional!==!0}function Ki(n,t){return t==="vestivel"?n.tipo==="vestivel":t==="acervo"?Xo(n):!Xo(n)}function Xs(n){return n.slot?mn.indexOf(n.slot):-1}function ia(n){return Array.from({length:n},()=>null)}function Id(){return{mao:ia(Hn),ativo:0,vestiveis:ia(Wo),acervo:[]}}function Bv(n,t){const e={},i=t&&typeof t=="object"?t:{},o=new Set([...Object.keys(n??{}),...Object.keys(i)]);for(const s of o)e[s]=kv((n??{})[s],i[s]);return e}function kv(n,t){const e=Id();if(!n&&!t)return e;const i=[],o=(u,f,g)=>{const M=ia(f);if(!Array.isArray(u))return M;for(let m=0;m<f;m++){const p=u[m];if(!p||typeof p.id!="string"){M[m]=null;continue}const S=Ws(p.id),x=S?{...p,...S}:p;if(Ki(x,g)){M[m]=x;continue}M[m]=null,g==="mao"&&Xo(x)&&i.push(x)}return M},s=typeof n?.ativo=="number"?Math.floor(n.ativo):0,a=o(n?.vestiveis,Wo,"vestivel"),r=ia(Wo);for(const u of a){if(!u)continue;const f=Xs(u);f>=0&&r[f]===null&&(r[f]=u)}if(t&&typeof t=="object")for(const[u,f]of Object.entries(t)){if(typeof f!="string")continue;const g=Ws(f);if(!g||g.slot!==u)continue;const M=mn.indexOf(u);M>=0&&r[M]===null&&(r[M]=g)}const c=o(n?.mao,Hn,"mao"),l=[],h=u=>l.some(f=>f.id===u)||r.some(f=>f?.id===u)||c.some(f=>f?.id===u),d=Array.isArray(n?.acervo)?n.acervo:[];for(const u of[...d,...i]){if(!u||typeof u.id!="string")continue;const f=Ws(u.id),g=f?{...u,...f}:u;!Ki(g,"acervo")||h(g.id)||l.push(g)}return{mao:c,ativo:s>=0&&s<Hn?s:0,vestiveis:r,acervo:l}}const nh="aristory.save.v1",Qa={version:1,scene:"",flags:{},memories:[],stats:{},inventarios:{}};class Fc{data;constructor(){this.data=Fc.read()}static read(){try{const t=localStorage.getItem(nh);if(!t)return structuredClone(Qa);const e=JSON.parse(t),i=e.loadouts;return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{},inventarios:Bv(e.inventarios,i)}}catch{return structuredClone(Qa)}}persist(){try{localStorage.setItem(nh,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}de(t){let e=this.data.inventarios[t];return e||(e=Id(),this.data.inventarios[t]=e),e}maos(t){return this.de(t).mao}vestiveis(t){return this.de(t).vestiveis}acervo(t){return this.de(t).acervo}loadout(t){const e={};return this.de(t).vestiveis.forEach((i,o)=>{i&&(e[mn[o]]=i.id)}),e}slotAtivo(t){return this.de(t).ativo}setSlotAtivo(t,e){e<0||e>=Hn||(this.de(t).ativo=e,this.persist())}itemAtivo(t){const e=this.de(t);return e.mao[e.ativo]??null}achouItem(t,e){const i=this.de(t);return i.mao.some(o=>o?.id===e)||i.vestiveis.some(o=>o?.id===e)||i.acervo.some(o=>o.id===e)}pegar(t,e){if(this.achouItem(t,e.id))return"repetido";if(e.tipo==="vestivel"&&this.vestir(t,e))return"guardado";if(Xo(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let o=1;o<Hn;o++){const s=(i.ativo+o)%Hn;if(i.mao[s]===null)return i.mao[s]=e,this.persist(),"guardado"}return"cheio"}guardar(t,e){if(this.achouItem(t,e.id))return"repetido";if(Xo(e))return this.guardarNoAcervo(t,e);const i=this.de(t);if(i.mao[i.ativo]===null)return i.mao[i.ativo]=e,this.persist(),"mao";for(let o=1;o<Hn;o++){const s=(i.ativo+o)%Hn;if(i.mao[s]===null)return i.mao[s]=e,this.persist(),"guardado"}return"cheio"}guardarNoAcervo(t,e){return Ki(e,"acervo")?this.achouItem(t,e.id)?"repetido":(this.de(t).acervo.push(e),this.persist(),"guardado"):"cheio"}tirarDoAcervo(t,e){const i=this.de(t).acervo,o=i.findIndex(a=>a.id===e);if(o<0)return null;const[s]=i.splice(o,1);return this.persist(),s}vestir(t,e){if(!Ki(e,"vestivel"))return!1;const i=Xs(e);if(i<0)return!1;const o=this.de(t).vestiveis;return o[i]!==null||this.achouItem(t,e.id)&&!this.tirarDoAcervo(t,e.id)?!1:(o[i]=e,this.persist(),!0)}despir(t,e){e<0||e>=Wo||(this.de(t).vestiveis[e]=null,this.persist())}mover(t,e,i){const o=this.de(t),s=d=>d.lista==="mao"?o.mao:o.vestiveis,a=d=>d.indice>=0&&d.indice<(d.lista==="mao"?Hn:Wo);if(!a(e)||!a(i)||e.lista===i.lista&&e.indice===i.indice)return!1;const r=s(e),c=s(i),l=r[e.indice];if(!l||!Ki(l,i.lista)||i.lista==="vestivel"&&Xs(l)!==i.indice)return!1;const h=c[i.indice];return h&&!Ki(h,e.lista)||e.lista==="vestivel"&&h&&Xs(h)!==e.indice?!1:(c[i.indice]=l,r[e.indice]=h??null,this.persist(),!0)}largar(t,e){const i=this.de(t);let o=!1;for(const a of[i.mao,i.vestiveis]){const r=a.findIndex(c=>c?.id===e);r>=0&&(a[r]=null,o=!0)}const s=i.acervo.findIndex(a=>a.id===e);return s>=0&&(i.acervo.splice(s,1),o=!0),o&&this.persist(),o}reset(){this.data=structuredClone(Qa),this.persist()}}const tr=["Cabeça","Tronco","Pernas","Pés"];class Vv{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;menu;placar;mochila;armario;boneco;corpo;acervo;donoArmario;vestiario;oculos;bermudas;donoVestiario;slotsMao;slotsVestivel;dono;descarte;cardapio;secoesDoCardapio;fecharCardapioResolve=null;pratoMarcado=null;memorias;quadro;pontos;acervoDoQuadro=[];naMoldura=0;pintura=null;abriuEm=0;pegou=null;tipoNaPinca;funcionalNaPinca=!1;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchGirar=null;onTouchHold=null;onRestart=null;onToggleSom=null;som=null;hintsTimer=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
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
      <div class="cardapio">
        <div class="papel">
          <p class="casa">Restaurante do Clube</p>
          <h2>Cardápio</h2>
          <p class="sub">a gente lê tudo e pede o de sempre</p>
          <div class="secoes"></div>
          <p class="rodape">serviço não incluso · sorriso incluso</p>
          <button class="pedir" disabled>escolha um prato</button>
          <button class="close">só olhando, obrigado</button>
        </div>
      </div>
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
    `,t.appendChild(e);const i=document.createElement("div");i.className="boot",i.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(i),this.boot=i,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.menu=e.querySelector(".menu"),this.placar=e.querySelector(".placar"),this.mochila=e.querySelector(".mochila"),this.slotsMao=e.querySelector(".mochila .maos"),this.slotsVestivel=e.querySelector(".mochila .vestiveis"),this.dono=e.querySelector(".mochila .dono"),this.descarte=e.querySelector(".mochila .descarte"),this.armario=e.querySelector(".armario"),this.boneco=e.querySelector(".armario .boneco"),this.corpo=e.querySelector(".armario .corpo"),this.acervo=e.querySelector(".armario .acervo"),this.donoArmario=e.querySelector(".armario .dono"),this.vestiario=e.querySelector(".vestiario"),this.oculos=e.querySelector(".vestiario .oculos"),this.bermudas=e.querySelector(".vestiario .bermudas"),this.donoVestiario=e.querySelector(".vestiario .dono"),this.cardapio=e.querySelector(".cardapio"),this.secoesDoCardapio=e.querySelector(".cardapio .secoes"),this.memorias=e.querySelector(".memorias"),this.quadro=e.querySelector(".memorias .quadro"),this.pontos=e.querySelector(".memorias .pontos"),this.dialogue.addEventListener("click",s=>{s.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",s=>{s.target===this.journal&&this.closeJournal()});const o=e.querySelector(".action-btn");o.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),o.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const s of["pointerup","pointercancel","pointerleave"])o.addEventListener(s,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".girar-btn.esq").addEventListener("click",()=>this.onTouchGirar?.(-1)),e.querySelector(".girar-btn.dir").addEventListener("click",()=>this.onTouchGirar?.(1)),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),e.querySelector(".bag-btn").addEventListener("click",()=>this.toggleMochila()),e.querySelector(".mochila .close").addEventListener("click",()=>this.closeMochila()),e.querySelector(".armario .close").addEventListener("click",()=>this.fecharArmario()),this.armario.addEventListener("click",s=>{s.target===this.armario&&this.fecharArmario()}),e.querySelector(".vestiario .close").addEventListener("click",()=>this.fecharVestiario()),this.vestiario.addEventListener("click",s=>{s.target===this.vestiario&&this.fecharVestiario()}),this.oculos.addEventListener("click",()=>this.onAlternarOculos?.()),this.bermudas.addEventListener("click",s=>{const a=s.target.closest(".bermuda");a?.dataset.id&&this.onEscolherBermuda?.(a.dataset.id)}),e.querySelector(".cardapio .pedir").addEventListener("click",()=>{this.pratoMarcado&&this.fecharCardapio(this.pratoMarcado)}),e.querySelector(".cardapio .close").addEventListener("click",()=>this.fecharCardapio()),this.cardapio.addEventListener("click",s=>{s.target===this.cardapio&&this.fecharCardapio()}),e.querySelector(".memorias .close").addEventListener("click",()=>this.fecharMemorias()),e.querySelector(".memorias .antes").addEventListener("click",()=>this.folhear(-1)),e.querySelector(".memorias .depois").addEventListener("click",()=>this.folhear(1)),this.memorias.addEventListener("click",s=>{s.target===this.memorias&&this.fecharMemorias()}),this.ligarGiroDoBoneco(),e.querySelector(".mochila .descartar").addEventListener("click",()=>{this.som?.("escolha"),this.descarte.classList.add("confirmando")}),e.querySelector(".mochila .descartar-sim").addEventListener("click",()=>{const s=this.pegou;this.pegou=null,this.tipoNaPinca=void 0,this.marcarPego(null),s&&this.onDescartar?.(s)}),this.mochila.addEventListener("click",s=>{s.target===this.mochila&&this.closeMochila()});for(const s of[this.slotsMao,this.slotsVestivel])s.addEventListener("click",a=>this.tocarVaga(a)),s.addEventListener("dragstart",a=>this.comecarArrasto(a)),s.addEventListener("dragover",a=>this.arrastarSobre(a)),s.addEventListener("dragleave",a=>{a.target.closest(".slot")?.classList.remove("alvo")}),s.addEventListener("drop",a=>this.soltarArrasto(a)),s.addEventListener("dragend",()=>this.limparArrasto());e.querySelector(".menu-btn").addEventListener("click",()=>this.toggleMenu()),e.querySelector(".menu .som-btn").addEventListener("click",()=>this.onToggleSom?.()),e.querySelector(".menu .controles-btn").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.add("vendo-controles")}),e.querySelector(".menu .controles .voltar").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.remove("vendo-controles")}),e.querySelector(".menu .close").addEventListener("click",()=>this.closeMenu()),e.querySelector(".menu .recomecar").addEventListener("click",()=>{this.menu.classList.add("perguntando")}),e.querySelector(".menu .nao").addEventListener("click",()=>{this.menu.classList.remove("perguntando")}),e.querySelector(".menu .sim").addEventListener("click",()=>{this.closeMenu(),this.onRestart?.()}),this.menu.addEventListener("click",s=>{s.target===this.menu&&this.closeMenu()}),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),this.showHints()}get menuOpen(){return this.menu.classList.contains("show")}toggleMenu(){this.som?.("menu"),this.menuOpen?this.closeMenu():(this.closeJournal(),this.closeMochila(),this.menu.classList.add("show")),this.marcarTelaAberta()}closeMenu(){this.menu.classList.remove("show"),this.menu.classList.remove("perguntando"),this.menu.classList.remove("vendo-controles"),this.marcarTelaAberta()}marcarTelaAberta(){document.body.classList.toggle("tela-aberta",this.menuOpen||this.journalOpen||this.mochilaOpen||this.armarioOpen||this.memoriasOpen||this.vestiarioOpen||this.cardapioOpen)}setSom(t){const e=this.menu.querySelector(".som-btn");e.textContent=t?"🔊 Som ligado":"🔇 Som desligado",e.classList.toggle("desligado",!t)}showHints(){this.hints.classList.remove("hide"),this.hintsTimer&&window.clearTimeout(this.hintsTimer),this.hintsTimer=window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){const i=this.prompt.querySelector(".label").textContent;this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,(!this.prompt.classList.contains("show")||i!==e)&&this.som?.("prompt"),this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showPlacar(t){if(!t){this.placar.classList.remove("show");return}this.placar.querySelector(".eu").textContent=t.eu,this.placar.querySelector(".ele").textContent=t.ele,this.placar.querySelector(".nums").textContent=`${t.meus} × ${t.dele}`,this.placar.classList.add("show")}showCharge(t,e,i=.06){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const o=this.carga.querySelector(".barra");o.style.width=`${Math.max(0,Math.min(1,t))*100}%`;const s=this.carga.querySelector(".alvo"),a=this.carga.querySelector(".zona"),r=e!=null&&e>.02&&e<.99;if(s.style.display=r?"block":"none",a.style.display=r?"block":"none",!r){this.carga.classList.remove("certa");return}const c=h=>`calc(3px + (100% - 6px) * ${Math.max(0,Math.min(1,h))})`;s.style.left=c(e),a.style.left=c(e-i),a.style.right=`calc(3px + (100% - 6px) * ${1-Math.max(0,Math.min(1,e+i))})`;const l=Math.abs(t-e)<=i;this.carga.classList.toggle("certa",l)}toast(t,e="💛"){const i=document.createElement("div");i.className="toast",i.innerHTML=`<span>${e}</span><span></span>`,i.querySelector("span:last-child").textContent=t,this.toasts.appendChild(i),window.setTimeout(()=>i.classList.add("fade"),2600),window.setTimeout(()=>i.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(i=>{let o=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const s=()=>{this.type(t[o])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[o];return}if(o+=1,o>=t.length){this.dialogue.classList.remove("show"),this.advance=null,i();return}s()},s()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,e%3===1&&t[e-1]!==" "&&this.som?.("fala"),this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,i=""){return new Promise(o=>{this.dialogueWho.textContent=i,this.dialogueWho.style.display=i?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=s=>{this.som?.("confirma"),this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),o(s)},e.forEach((s,a)=>{const r=document.createElement("button");r.type="button",r.textContent=s,r.addEventListener("click",()=>this.escolher?.(a)),this.escolhas.appendChild(r)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,i)=>e.classList.toggle("sel",i===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.som?.("escolha"),this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.som?.("escolha"),this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const i=document.createElement("div");i.className="memory",i.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',i.querySelector(".icon").textContent=e.icon,i.querySelector("b").textContent=e.title,i.querySelector("small").textContent=e.place,i.querySelector("p").textContent=e.note,this.journalGrid.appendChild(i)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.som?.("diario"),this.journalOpen?this.closeJournal():(this.closeMochila(),this.journal.classList.add("show")),this.marcarTelaAberta()}closeJournal(){this.journal.classList.remove("show"),this.marcarTelaAberta()}get cardapioOpen(){return this.cardapio.classList.contains("show")}abrirCardapio(t){return new Promise(e=>{if(this.cardapioOpen){e(null);return}this.som?.("escolha"),this.pratoMarcado=null,this.desenharCardapio(t),this.pintarBotaoDePedir(),this.cardapio.classList.add("show"),this.marcarTelaAberta(),this.fecharCardapioResolve=e})}fecharCardapio(t=null){if(!this.cardapioOpen)return;this.cardapio.classList.remove("show"),this.marcarTelaAberta();const e=this.fecharCardapioResolve;this.fecharCardapioResolve=null,e?.(t)}marcarPrato(t){if(this.pratoMarcado===t){this.fecharCardapio(t);return}this.pratoMarcado=t,this.som?.("escolha");for(const e of this.secoesDoCardapio.querySelectorAll(".prato"))e.classList.toggle("marcado",e.dataset.id===t);this.pintarBotaoDePedir()}pintarBotaoDePedir(){const t=this.cardapio.querySelector(".pedir"),e=this.pratoMarcado?this.secoesDoCardapio.querySelector(`.prato[data-id="${this.pratoMarcado}"] b`):null;t.disabled=!e,t.textContent=e?`Pedir ${e.textContent}`:"escolha um prato"}desenharCardapio(t){const e=Math.min(window.devicePixelRatio||1,2),i=Math.round(64*e);this.secoesDoCardapio.innerHTML="";for(const o of t){const s=document.createElement("section");s.className="secao",s.innerHTML=`<h3><span>${o.titulo}</span></h3><p class="nota">${o.nota}</p>`;for(const a of o.pratos){const r=document.createElement("div");r.className="prato",r.classList.toggle("destaque",!!a.selo),r.dataset.id=a.id;const c=document.createElement("canvas");c.className="foto",c.width=i,c.height=i;const l=c.getContext("2d");l&&(l.translate(i/2,i/2),l.scale(1.22,1.22),l.translate(-i/2,-i/2),a.pintar(l,i));const h=document.createElement("div");h.className="texto",h.innerHTML=`<div class="titulo"><b>${a.nome}</b><i></i><em>${a.preco}</em></div><p>${a.descricao}</p>`+(a.selo?`<span class="selo">★ ${a.selo}</span>`:""),r.append(c,h),r.addEventListener("click",()=>this.marcarPrato(a.id)),s.appendChild(r)}this.secoesDoCardapio.appendChild(s)}}get memoriasOpen(){return this.memorias.classList.contains("show")}abrirMemorias(t,e=0){this.memoriasOpen||t.length===0||(this.som?.("diario"),this.closeJournal(),this.closeMochila(),this.acervoDoQuadro=t,this.naMoldura=Math.min(Math.max(e,0),t.length-1),this.mostrarMemoria(),this.memorias.classList.add("show"),this.marcarTelaAberta(),this.abriuEm=performance.now(),this.pintura=requestAnimationFrame(this.pintarQuadro))}fecharMemorias(){this.memoriasOpen&&(this.memorias.classList.remove("show"),this.acervoDoQuadro=[],this.pintura!==null&&cancelAnimationFrame(this.pintura),this.pintura=null,this.marcarTelaAberta())}folhear(t){if(!this.memoriasOpen||this.acervoDoQuadro.length<2)return;const e=this.acervoDoQuadro.length;this.naMoldura=(this.naMoldura+t+e)%e,this.som?.("escolha"),this.mostrarMemoria(),this.abriuEm=performance.now()}mostrarMemoria(){const t=this.acervoDoQuadro[this.naMoldura];if(!t)return;this.memorias.querySelector("h2").textContent=t.titulo,this.memorias.querySelector(".sub").textContent=t.lugar,this.memorias.querySelector(".legenda").textContent=t.legenda,this.quadro.style.aspectRatio=String(t.proporcao);const e=this.acervoDoQuadro.length>1;this.memorias.classList.toggle("tem-mais",e),this.pontos.innerHTML="",e&&this.acervoDoQuadro.forEach((i,o)=>{const s=document.createElement("button");s.className="ponto",s.classList.toggle("agora",o===this.naMoldura),s.title=i.titulo,s.setAttribute("aria-label",i.titulo),s.addEventListener("click",()=>this.folhear(o-this.naMoldura)),this.pontos.appendChild(s)})}pintarQuadro=t=>{const e=this.acervoDoQuadro[this.naMoldura];if(!e||!this.memoriasOpen){this.pintura=null;return}const i=Math.min(window.devicePixelRatio||1,2),o=Math.round(this.quadro.clientWidth*i),s=Math.round(this.quadro.clientHeight*i);if(o>0&&s>0){(this.quadro.width!==o||this.quadro.height!==s)&&(this.quadro.width=o,this.quadro.height=s);const a=this.quadro.getContext("2d");a&&e.pintar(a,o,s,(t-this.abriuEm)/1e3)}this.pintura=requestAnimationFrame(this.pintarQuadro)};get mochilaOpen(){return this.mochila.classList.contains("show")}toggleMochila(){this.som?.("diario"),this.mochilaOpen?this.closeMochila():(this.closeJournal(),this.onAbrirMochila?.(),this.mochila.classList.add("show")),this.marcarTelaAberta()}closeMochila(){this.mochila.classList.remove("show"),this.marcarTelaAberta()}renderMochila(t,e,i,o){this.dono.textContent=`de ${o}`,this.pegou=null,this.tipoNaPinca=void 0,this.funcionalNaPinca=!1,this.mochila.classList.remove("movendo"),this.descarte.classList.remove("show","confirmando");const s=(a,r,c,l=!1)=>{a.innerHTML="",r.forEach((h,d)=>{const u=document.createElement("button");u.className="slot",u.dataset.slot=String(d),u.classList.toggle("cheio",h!==null),u.classList.toggle("principal",d===c);const f=h!==null&&h.tipo==="vestivel"&&h.funcional!==!0;u.draggable=h!==null&&!f,u.classList.toggle("preso",f),h?(u.dataset.tipo=h.tipo,h.funcional?u.dataset.funcional="sim":delete u.dataset.funcional):(delete u.dataset.tipo,delete u.dataset.funcional);const g=l?`<em class="parte">${tr[d]}</em>`:"";u.innerHTML=g+(h?`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""):'<span class="icone vazio">·</span><b>vazio</b>'),a.appendChild(u)})};s(this.slotsMao,t,i),s(this.slotsVestivel,e,-1,!0)}get armarioOpen(){return this.armario.classList.contains("show")}abrirArmario(){this.armarioOpen||(this.som?.("escolha"),this.onAbrirArmario?.(),this.armario.classList.add("show"),this.marcarTelaAberta())}fecharArmario(){this.armarioOpen&&(this.armario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharArmario?.())}canvasDoBoneco(){return this.boneco}renderArmario(t,e,i){if(this.donoArmario.textContent=`de ${i}`,this.corpo.innerHTML="",t.forEach((o,s)=>{const a=document.createElement("button");a.className="parte",a.classList.toggle("cheio",o!==null),a.dataset.parte=String(s),a.innerHTML=`<small>${tr[s]}</small>`+(o?`<span class="icone">${o.icone}</span><b>${o.nome}</b><em>tirar</em>`:'<span class="icone vazio">·</span><b>vazio</b>'),this.corpo.appendChild(a)}),this.acervo.innerHTML="",e.length===0){const o=document.createElement("p");o.className="nada",o.textContent="Nada guardado — está tudo no corpo.",this.acervo.appendChild(o);return}mn.forEach((o,s)=>{const a=e.filter(h=>h.slot===o);if(a.length===0)return;const r=document.createElement("section");r.className="grupo",r.dataset.slot=o;const c=document.createElement("h4");c.innerHTML=`${tr[s]} <span>${a.length}</span>`,r.appendChild(c);const l=document.createElement("div");l.className="pecas";for(const h of a){const d=document.createElement("button");d.className="peca",d.dataset.id=h.id,d.innerHTML=`<span class="icone">${h.icone}</span><b>${h.nome}</b>`+(h.nota?`<small>${h.nota}</small>`:""),l.appendChild(d)}r.appendChild(l),this.acervo.appendChild(r)})}onTirarParte=null;onVestirPeca=null;onAbrirArmario=null;onFecharArmario=null;onGirarBoneco=null;ligarGiroDoBoneco(){let t=!1,e=0;this.boneco.addEventListener("pointerdown",i=>{t=!0,e=i.clientX,this.boneco.setPointerCapture(i.pointerId)}),this.boneco.addEventListener("pointermove",i=>{t&&(this.onGirarBoneco?.((i.clientX-e)*.012),e=i.clientX)});for(const i of["pointerup","pointercancel"])this.boneco.addEventListener(i,()=>{t=!1});this.corpo.addEventListener("click",i=>{const o=i.target.closest(".parte");!o?.dataset.parte||!o.classList.contains("cheio")||this.onTirarParte?.(Number(o.dataset.parte))}),this.acervo.addEventListener("click",i=>{const o=i.target.closest(".peca");o?.dataset.id&&this.onVestirPeca?.(o.dataset.id)})}get vestiarioOpen(){return this.vestiario.classList.contains("show")}abrirVestiario(){this.vestiarioOpen||(this.som?.("escolha"),this.onAbrirVestiario?.(),this.vestiario.classList.add("show"),this.marcarTelaAberta())}fecharVestiario(){this.vestiarioOpen&&(this.vestiario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharVestiario?.())}renderVestiario(t){this.donoVestiario.textContent=`de ${t.dono}`,this.oculos.classList.toggle("ligado",t.oculos),this.oculos.innerHTML=`<span class="icone">🕶️</span><b>Óculos escuros</b><em>${t.oculos?"tirar":"colocar"}</em>`,this.bermudas.innerHTML="";for(const e of t.bermudas){const i=document.createElement("button");i.className="bermuda",i.classList.toggle("vestida",e.vestida),i.dataset.id=e.id;const o=document.createElement("i");o.style.background=e.faixa?`repeating-linear-gradient(160deg, ${e.cor} 0 12px, ${e.faixa} 12px 18px)`:e.cor,i.appendChild(o);const s=document.createElement("b");s.textContent=e.nome,i.appendChild(s),this.bermudas.appendChild(i)}}onAlternarOculos=null;onEscolherBermuda=null;onAbrirVestiario=null;onFecharVestiario=null;onEscolherSlot=null;onMoverItem=null;onDescartar=null;onAbrirMochila=null;podeIrPara(t,e,i=!1){return t?t==="vestivel"&&e==="mao"?i?!0:(this.toast("Roupa só se troca no guarda-roupa","👗"),!1):t==="mao"&&e==="vestivel"?(this.toast("Este item não pode ser vestido","🚫"),!1):!0:!0}endereco(t){const e=t.closest(".slot");return e?.dataset.slot?{lista:e.closest(".vestiveis")?"vestivel":"mao",indice:Number(e.dataset.slot)}:null}tocarVaga(t){const e=this.endereco(t.target);if(!e)return;if(this.pegou){const o=this.pegou;if(o.lista===e.lista&&o.indice===e.indice){this.pegou=null,this.marcarPego(null);return}if(!this.podeIrPara(this.tipoNaPinca,e.lista,this.funcionalNaPinca))return;this.pegou=null,this.marcarPego(null),this.onMoverItem?.(o,e)&&this.som?.("escolha");return}const i=t.target.closest(".slot");if(e.lista==="mao"&&!i.classList.contains("cheio")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}if(i.classList.contains("cheio")){if(e.lista==="mao"&&!i.classList.contains("principal")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}this.pegou=e,this.tipoNaPinca=i.dataset.tipo,this.funcionalNaPinca=i.dataset.funcional==="sim",this.marcarPego(i),this.som?.("escolha")}}marcarPego(t){for(const o of this.mochila.querySelectorAll(".slot.pego"))o.classList.remove("pego");t?.classList.add("pego"),this.mochila.classList.toggle("movendo",t!==null),this.descarte.classList.toggle("show",t!==null),this.descarte.classList.remove("confirmando");const e=this.descarte.querySelector(".descartar"),i=t?.querySelector("b")?.textContent??"";e.textContent=i?`🗑 Descartar ${i}`:"🗑 Descartar"}comecarArrasto(t){const e=this.endereco(t.target),i=t.target.closest(".slot");if(!e||!i?.classList.contains("cheio")){t.preventDefault();return}t.dataTransfer?.setData("text/plain",JSON.stringify({vaga:e,tipo:i.dataset.tipo,funcional:i.dataset.funcional==="sim"})),t.dataTransfer&&(t.dataTransfer.effectAllowed="move"),i.classList.add("pego")}arrastarSobre(t){const e=t.target.closest(".slot");e&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),e.classList.add("alvo"))}soltarArrasto(t){t.preventDefault();const e=this.endereco(t.target),i=t.dataTransfer?.getData("text/plain");if(this.limparArrasto(),!(!e||!i))try{const{vaga:o,tipo:s,funcional:a}=JSON.parse(i);if(!this.podeIrPara(s,e.lista,a===!0))return;this.onMoverItem?.(o,e)&&this.som?.("escolha")}catch{}}limparArrasto(){for(const t of this.mochila.querySelectorAll(".slot.pego, .slot.alvo"))t.classList.remove("pego","alvo")}}function ac(n,t,e){for(const i of e)if(i.kind==="circle"){const o=n.x-i.x,s=n.z-i.z,a=t+i.r,r=o*o+s*s;if(r>=a*a||r===0)continue;const c=Math.sqrt(r),l=(a-c)/c;n.x+=o*l,n.z+=s*l}else{const o=Math.cos(-i.rot),s=Math.sin(-i.rot),a=n.x-i.x,r=n.z-i.z,c=a*o-r*s,l=a*s+r*o,h=Math.max(-i.hw,Math.min(i.hw,c)),d=Math.max(-i.hd,Math.min(i.hd,l));let u=c-h,f=l-d,g=u*u+f*f;if(g>t*t)continue;if(g===0){const S=i.hw-Math.abs(c),x=i.hd-Math.abs(l);S<x?(u=Math.sign(c)||1,f=0,g=0):(u=0,f=Math.sign(l)||1);const y=u!==0?Math.sign(u)*(i.hw+t):c,A=f!==0?Math.sign(f)*(i.hd+t):l;n.x=i.x+(y*Math.cos(i.rot)-A*Math.sin(i.rot)),n.z=i.z+(y*Math.sin(i.rot)+A*Math.cos(i.rot));continue}const M=Math.sqrt(g),m=h+u/M*t,p=d+f/M*t;n.x=i.x+(m*Math.cos(i.rot)-p*Math.sin(i.rot)),n.z=i.z+(m*Math.sin(i.rot)+p*Math.cos(i.rot))}}function rc(n,t,e){n.x=Math.max(e.minX+t,Math.min(e.maxX-t,n.x)),n.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,n.z))}const Dd=1.3;class Hv{object=new ct;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new N;body;locked=!1;riding=!1;submersion=0;patins=!1;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}get chest(){return new N(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}update(t,e,i,o){if(this.riding){this.body.update(e,0);return}const s=this.submersion>.05,a=this.patins&&!s?Dd:1,r=s?this.maxSpeed*.55:this.maxSpeed*a;if(!this.locked&&t.lengthSq()>1e-4){const l=t.clone().normalize();this.velocity.x+=l.x*this.accel*e,this.velocity.z+=l.z*this.accel*e;const h=Math.hypot(this.velocity.x,this.velocity.z);h>r&&(this.velocity.x=this.velocity.x/h*r,this.velocity.z=this.velocity.z/h*r),this.body.setFacing(Math.atan2(l.x,l.z))}else{const l=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(l),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,ac(this.position,this.radius,i),rc(this.position,this.radius,o),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(s),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class Gv{object=new ct;position;radius=.4;maxSpeed=5;velocity=new N;dir=new N;body;aoLado=0;folga=2;ordem=null;riding=!1;submersion=0;patins=!1;lado=0;distancia=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,i=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=i,t.setFacing(i),this.object.add(t.group),this.body=t,e}teleport(t,e,i=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=i,this.body.setFacing(i)}setVisible(t){this.object.visible=t}atrelar(t,e){this.lado=t,this.distancia=e,this.ordem=null}soltar(){this.lado=0}get atrelado(){return this.lado!==0}goTo(t,e){this.ordem=new N(t,0,e)}clearOrder(){this.ordem=null}hold(t,e){this.ordem?this.ordem.set(this.position.x,0,this.position.z):this.ordem=new N(this.position.x,0,this.position.z),this.velocity.set(0,0,0),this.body.setFacing(Math.atan2(t-this.position.x,e-this.position.z))}get hasOrder(){return this.ordem!==null}rebocar(t,e,i,o){const s=this.aoLado,a=t.x+Math.sin(s+Math.PI/2)*this.distancia*this.lado,r=t.z+Math.cos(s+Math.PI/2)*this.distancia*this.lado,c=this.position.x,l=this.position.z,h=Math.min(1,e*16);this.position.x+=(a-this.position.x)*h,this.position.z+=(r-this.position.z)*h,ac(this.position,this.radius,i),rc(this.position,this.radius,o),this.velocity.set((this.position.x-c)/Math.max(e,1e-4),0,(this.position.z-l)/Math.max(e,1e-4)),this.body.setFacing(s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}set direcaoDoPar(t){this.aoLado=t}update(t,e,i,o){if(this.riding){this.body.update(e,0);return}if(this.lado!==0){this.rebocar(t,e,i,o);return}const s=this.ordem??t,a=this.ordem?.55:this.folga;this.dir.set(s.x-this.position.x,0,s.z-this.position.z);const r=this.dir.length();if(!this.ordem&&r>22){this.teleport(s.x-1.2,s.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(r>a){this.dir.normalize();const u=this.maxSpeed*(this.patins?Dd:1),f=Math.min(u,1.6+(r-a)*2.2);this.velocity.x+=(this.dir.x*f-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*f-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),r>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,ac(this.position,this.radius,i),rc(this.position,this.radius,o);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),d=.86;if(h<d&&h>1e-4){const u=(d-h)/h;this.position.x+=c*u,this.position.z+=l*u}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}const qv=1.7;class Wv{grupo=new ct;vivos=[];constructor(t){t.add(this.grupo)}soltar(t,e,i,o=1.62){const s=bd(.6);s.userData.coracao=!0,s.position.set(t.x+e,o,t.z+i),this.grupo.add(s),this.vivos.push({obj:s,vida:0,giro:Math.random()*Math.PI,fx:e,fz:i})}limpar(){for(const t of this.vivos)this.grupo.remove(t.obj);this.vivos.length=0}update(t){for(let e=this.vivos.length-1;e>=0;e--){const i=this.vivos[e];i.vida+=t;const o=i.vida/qv;if(o>=1){this.grupo.remove(i.obj),this.vivos.splice(e,1);continue}i.obj.position.y+=t*.72;const s=(.7+Math.sin(i.vida*3+i.giro)*.25)*t;i.obj.position.x+=i.fx*s,i.obj.position.z+=i.fz*s,i.obj.rotation.y=i.giro+i.vida*1.4;const a=o<.18?o/.18:Math.min(1,(1-o)/.35);i.obj.scale.setScalar(.25+a*.9)}}}const Xv=1.5,ih=.9,oh=1.16,Ti=.32,cc=.42,Ld=.34,jv=Ti+cc+Ld,Yv=.5;class $v{constructor(t){this.coracoes=t}t=-1;descanso=0;alvoA=new N;alvoB=new N;soltouCoracao=!1;onSom=null;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!Jv(t,e))return!1;const i=e.position.x-t.position.x,o=e.position.z-t.position.z,s=Math.hypot(i,o);if(s>Xv||s<.01)return!1;const a=Math.atan2(i,o);return Math.abs(er(t.rig.facing,a))<ih&&Math.abs(er(e.rig.facing,a+Math.PI))<ih}iniciar(t,e,i){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const o=e.position.x-t.position.x,s=e.position.z-t.position.z,a=Math.atan2(o,s),r=i+Math.PI/2,c=Math.abs(er(a,r))<Math.PI/2?r:r+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,d=Math.sin(c)*oh/2,u=Math.cos(c)*oh/2;this.alvoA.set(l-d,0,h-u),this.alvoB.set(l+d,0,h+u),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0)}update(t,e,i){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const o=Zv(this.t);if(e.rig.setKiss(o),i.rig.setKiss(o),e.locked=!0,this.t<Ti){const s=Math.min(1,t*9);e.position.lerp(this.alvoA,s),i.position.lerp(this.alvoB,s)}if(!this.soltouCoracao&&this.t>=Ti*.9){this.soltouCoracao=!0;const s=Math.atan2(i.position.x-e.position.x,i.position.z-e.position.z),a=Math.sin(s),r=Math.cos(s);this.coracoes.soltar(e.position,-a,-r),this.coracoes.soltar(i.position,a,r),this.onSom?.("beijo"),this.onSom?.("coracao")}this.t>=jv&&(this.t=-1,this.descanso=Yv,e.rig.setKiss(0),i.rig.setKiss(0),e.locked=!1)}}}function Zv(n){return n<Ti?sh(n/Ti):n<Ti+cc?1:sh(Math.max(0,1-(n-Ti-cc)/Ld))}function sh(n){return n*n*(3-2*n)}function Jv(n,t){const e=n.rig.spec,i=t.rig.spec;return e.casal===!0&&i.casal===!0&&e.id!==i.id}function er(n,t){return Math.atan2(Math.sin(n-t),Math.cos(n-t))}const Kv=.95,Qv=1.8,t_=2.2,e_=.5,ah=3;class n_{constructor(t){this.coracoes=t}lado=1;ligado=!1;relogio=0;longe=0;onSom=null;get ativo(){return this.ligado}disponivel(t,e){if(this.ligado||t.riding||e.riding||t.submersion>.05||e.submersion>.05||t.locked||e.hasOrder)return!1;const i=Math.hypot(e.position.x-t.position.x,e.position.z-t.position.z);return i>.01&&i<=Qv}ligar(t,e){if(this.ligado)return;this.ligado=!0,this.relogio=0,this.longe=0;const i=t.rig.facing,o=e.position.x-t.position.x,s=e.position.z-t.position.z;this.lado=o*Math.sin(i+Math.PI/2)+s*Math.cos(i+Math.PI/2)<0?-1:1,this.aplicar(t,e),this.onSom?.("escolha")}soltar(t,e){this.ligado&&(this.ligado=!1,e.soltar(),t.rig.setHoldingHands(0),e.rig.setHoldingHands(0))}trocouCorpos(t,e){this.ligado&&(this.lado=this.lado===1?-1:1,this.aplicar(t,e))}update(t,e,i){if(!this.ligado)return;if(e.riding||i.riding||e.submersion>.05||i.submersion>.05||i.hasOrder){this.soltar(e,i);return}const o=Math.hypot(i.position.x-e.position.x,i.position.z-e.position.z);if(this.longe=o>t_?this.longe+t:0,this.longe>=e_){this.soltar(e,i);return}if(i.direcaoDoPar=e.rig.facing,this.relogio+=t,this.relogio>=ah){this.relogio-=ah;const s=e.position.clone().add(i.position).multiplyScalar(.5);this.coracoes.soltar(s,0,0,2.05),this.onSom?.("coracao")}}aplicar(t,e){e.atrelar(this.lado,Kv),e.direcaoDoPar=t.rig.facing,t.rig.setHoldingHands(this.lado),e.rig.setHoldingHands(this.lado===1?-1:1)}}function ae(n,t,e){const i=n.createOscillator();i.type=e.tipo??"sine",i.frequency.setValueAtTime(e.freq,e.quando),e.glide&&i.frequency.exponentialRampToValueAtTime(Math.max(20,e.glide),e.quando+e.dur),e.detune&&i.detune.setValueAtTime(e.detune,e.quando);const o=n.createGain(),s=e.vol??.2,a=e.ataque??.006;o.gain.setValueAtTime(1e-4,e.quando),o.gain.exponentialRampToValueAtTime(s,e.quando+a),o.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur);let r=o;if(e.abafo){const c=n.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(e.abafo,e.quando),o.connect(c),r=c}i.connect(o),r.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}let Ls=null;function i_(n){if(!Ls||Ls.sampleRate!==n.sampleRate){const t=n.createBuffer(1,n.sampleRate,n.sampleRate),e=t.getChannelData(0);for(let i=0;i<e.length;i++)e[i]=Math.random()*2-1;Ls=t}return Ls}function Xe(n,t,e){const i=n.createBufferSource();i.buffer=i_(n),i.loop=!0;const o=n.createBiquadFilter();o.type=e.tipo??"bandpass",o.frequency.setValueAtTime(e.freq??1800,e.quando),e.glide&&o.frequency.exponentialRampToValueAtTime(Math.max(60,e.glide),e.quando+e.dur),o.Q.setValueAtTime(e.q??1.2,e.quando);const s=n.createGain(),a=e.vol??.14;s.gain.setValueAtTime(1e-4,e.quando),s.gain.exponentialRampToValueAtTime(a,e.quando+.008),s.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur),i.connect(o),o.connect(s),s.connect(t),i.start(e.quando),i.stop(e.quando+e.dur+.05)}function pe(n){return 440*Math.pow(2,(n-69)/12)}function o_(n){let t=n>>>0;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}const nr=[0,2,4,7,9,12,14,16],be=72,Ud={passo:({ctx:n,destino:t,t:e,n:i})=>{const o=i%2===0;Xe(n,t,{quando:e,dur:.075,vol:.05,freq:o?1500:1150,glide:o?700:560,q:.9}),ae(n,t,{freq:o?128:112,quando:e,dur:.06,vol:.045,tipo:"sine"})},nadar:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.34,vol:.07,freq:700,glide:2600,q:.7})},agua:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.42,vol:.2,freq:2400,glide:500,q:.6}),ae(n,t,{freq:420,glide:120,quando:e,dur:.26,vol:.1,tipo:"sine"})},prompt:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+12),quando:e,dur:.09,vol:.055,tipo:"triangle"})},interagir:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+4),quando:e,dur:.12,vol:.13,tipo:"triangle"}),ae(n,t,{freq:pe(be+11),quando:e+.055,dur:.16,vol:.1,tipo:"sine"})},fala:({ctx:n,destino:t,t:e,n:i})=>{const o=nr[i%4]+(i%8<4?0:2);ae(n,t,{freq:pe(be+7+o),quando:e,dur:.06,vol:.035,tipo:"square",abafo:2200})},escolha:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+7),quando:e,dur:.07,vol:.08,tipo:"triangle"})},confirma:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+4),quando:e,dur:.1,vol:.12,tipo:"triangle"}),ae(n,t,{freq:pe(be+9),quando:e+.07,dur:.14,vol:.11,tipo:"triangle"}),ae(n,t,{freq:pe(be+16),quando:e+.14,dur:.2,vol:.09,tipo:"sine"})},porta:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.3,vol:.11,freq:900,glide:320,q:.8}),ae(n,t,{freq:180,glide:90,quando:e+.16,dur:.2,vol:.09,tipo:"sine"})},memoria:({ctx:n,destino:t,t:e})=>{[0,4,7,12,16].forEach((i,o)=>{ae(n,t,{freq:pe(be+i),quando:e+o*.075,dur:.42,vol:.11-o*.008,tipo:"triangle"})})},toast:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+9),quando:e,dur:.14,vol:.09,tipo:"sine"}),ae(n,t,{freq:pe(be+16),quando:e+.08,dur:.22,vol:.07,tipo:"sine"})},trocar:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be),glide:pe(be+12),quando:e,dur:.18,vol:.09,tipo:"triangle"}),Xe(n,t,{quando:e,dur:.2,vol:.05,freq:800,glide:3e3,q:.6})},beijo:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.06,vol:.1,freq:2400,glide:1200,q:2.5}),ae(n,t,{freq:pe(be+7),quando:e+.02,dur:.1,vol:.08,tipo:"sine"})},coracao:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+12),quando:e,dur:.3,vol:.07,tipo:"sine"}),ae(n,t,{freq:pe(be+19),quando:e+.09,dur:.36,vol:.05,tipo:"sine"})},lancar:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.26,vol:.12,freq:600,glide:3200,q:.7}),ae(n,t,{freq:300,glide:900,quando:e,dur:.16,vol:.06,tipo:"triangle"})},pegar:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.09,vol:.13,freq:1400,glide:500,q:1.6}),ae(n,t,{freq:pe(be+9),quando:e+.03,dur:.14,vol:.1,tipo:"triangle"})},quicar:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:220,glide:110,quando:e,dur:.12,vol:.08,tipo:"sine"}),Xe(n,t,{quando:e,dur:.1,vol:.06,freq:900,glide:400,q:1})},sorvete:({ctx:n,destino:t,t:e})=>{[0,7,12].forEach((i,o)=>{ae(n,t,{freq:pe(be+4+i),quando:e+o*.09,dur:.3,vol:.1,tipo:"triangle"})})},latido:({ctx:n,destino:t,t:e,n:i})=>{const o=pe(be+nr[i%2===0?0:1]-12);for(const[s,a]of[0,.14].entries())ae(n,t,{freq:o*(s===0?1.12:1),glide:o*.72,quando:e+a,dur:.11,vol:.09,tipo:"sawtooth",abafo:1100}),Xe(n,t,{quando:e+a,dur:.05,vol:.035,freq:2400})},miado:({ctx:n,destino:t,t:e,n:i})=>{const o=i%2===1,s=pe(be+nr[o?2:3]);ae(n,t,{freq:s*.82,glide:s,quando:e,dur:o?.2:.15,vol:.075,tipo:"sawtooth",abafo:1500}),ae(n,t,{freq:s,glide:s*.68,quando:e+(o?.15:.1),dur:o?.55:.4,vol:.085,ataque:.02,tipo:"sawtooth",abafo:1200}),Xe(n,t,{quando:e,dur:o?.4:.28,vol:.022,freq:1100,glide:700,q:2.2})},pato:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:620,glide:380,quando:e,dur:.13,vol:.1,tipo:"sawtooth",abafo:1400}),ae(n,t,{freq:520,glide:300,quando:e+.15,dur:.12,vol:.08,tipo:"sawtooth",abafo:1200})},tv:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.18,vol:.07,freq:3e3,glide:1200,q:.5}),ae(n,t,{freq:pe(be+4),quando:e+.1,dur:.18,vol:.07,tipo:"square",abafo:1800})},sino:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+12),quando:e,dur:.9,vol:.09,tipo:"sine"}),ae(n,t,{freq:pe(be+19),quando:e+.02,dur:.8,vol:.05,tipo:"sine",detune:6})},sentar:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.24,vol:.09,freq:700,glide:260,q:.7})},menu:({ctx:n,destino:t,t:e})=>{ae(n,t,{freq:pe(be+2),quando:e,dur:.1,vol:.09,tipo:"triangle"}),ae(n,t,{freq:pe(be+9),quando:e+.06,dur:.14,vol:.07,tipo:"triangle"})},diario:({ctx:n,destino:t,t:e})=>{Xe(n,t,{quando:e,dur:.22,vol:.09,freq:1200,glide:3e3,q:.6})},recomecar:({ctx:n,destino:t,t:e})=>{[0,4,7,12].forEach((i,o)=>{ae(n,t,{freq:pe(be-12+i),quando:e+o*.11,dur:.5,vol:.1,tipo:"triangle"})})}},s_=.2,a_=1.3,ji=n=>({raiz:n,notas:[0,4,7,11]}),wo=n=>({raiz:n,notas:[0,3,7,10]}),Us=n=>({raiz:n,notas:[0,4,7,10]}),r_=n=>({raiz:n,notas:[0,4,7,9]}),ir=[0,2,4,7,9,12,14,16,19],c_=[0,2,3,5,7,9,10,12,14],js={casa:{bpm:82,tonica:41,giro:[ji(0),wo(9),wo(2),Us(7)],melodia:.62,chocalho:!1,escala:ir},"villa-lobos":{bpm:100,tonica:36,giro:[ji(0),ji(5),wo(9),Us(7)],melodia:.8,chocalho:!0,escala:ir},clube:{bpm:92,tonica:38,giro:[r_(0),wo(2),ji(5),Us(7)],melodia:.72,chocalho:!0,escala:ir},padrao:{bpm:88,tonica:40,giro:[ji(0),wo(9),ji(5),Us(7)],melodia:.6,chocalho:!1,escala:c_}},rh=[[0,2,3,6],[0,3,4,6,7],[2,3,5,6],[0,1,3,6],[0,4,6],[1,3,4,7]];class Nd{constructor(t,e){this.ctx=t,this.destino=e}clima=js.padrao;proximoClima=null;passo=0;proximo=0;timer=null;sorte=o_(20260827);frase=[];grau=2;get tocando(){return this.timer!==null}setClima(t){const e=js[t]??js.padrao;e!==this.clima&&(this.tocando?this.proximoClima=e:this.clima=e)}start(){this.timer===null&&(this.proximo=this.ctx.currentTime+.15,this.timer=window.setInterval(()=>this.agendar(),s_*1e3),this.agendar())}stop(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}preAgendar(t){for(this.proximo=0,this.passo=0;this.proximo<t;){this.tocarPasso(this.passo,this.proximo);const e=30/this.clima.bpm;this.proximo+=e*(this.passo%2===0?1.18:.82),this.passo+=1}}agendar(){const t=this.ctx.currentTime+a_;let e=0;for(;this.proximo<t&&e++<64;){this.tocarPasso(this.passo,this.proximo);const i=30/this.clima.bpm;this.proximo+=i*(this.passo%2===0?1.18:.82),this.passo+=1}}tocarPasso(t,e){const i=t%8;i===0&&(this.proximoClima&&(this.clima=this.proximoClima,this.proximoClima=null),(Math.floor(t/8)%2===0||this.frase.length===0)&&(this.frase=rh[Math.floor(this.sorte()*rh.length)]));const o=this.clima,s=Math.floor(t/8),a=o.giro[s%o.giro.length],r=o.tonica+a.raiz;if(i===0||i===4){const c=i===0?r:r+(this.sorte()<.4?7:4);ae(this.ctx,this.destino,{freq:pe(c),quando:e,dur:i===0?.6:.45,vol:.2,tipo:"sine",abafo:420})}if(i===2||i===5||i===7&&this.sorte()<.35){const c=r+24;for(const[l,h]of a.notas.entries())l===0&&i!==2||ae(this.ctx,this.destino,{freq:pe(c+h),quando:e,dur:.85,vol:.07,tipo:"triangle",ataque:.03,detune:l%2?5:-5,abafo:2400})}if(this.frase.includes(i)&&this.sorte()<o.melodia){const c=[-2,-1,-1,0,1,1,2];this.grau+=c[Math.floor(this.sorte()*c.length)],this.grau>o.escala.length-3&&(this.grau-=2),this.grau<2&&(this.grau+=2),this.grau=Math.max(0,Math.min(o.escala.length-1,this.grau));const l=i>=6?a.notas[Math.floor(this.sorte()*3)]:o.escala[this.grau],h=o.tonica+31;this.marimba(pe(h+l),e),l<=9&&this.sorte()<.22&&this.marimba(pe(h+l+12),e+.03,.4)}o.chocalho&&i%2===1&&Xe(this.ctx,this.destino,{quando:e,dur:.06,vol:i===3||i===7?.035:.02,freq:6200,q:.8})}marimba(t,e,i=1){ae(this.ctx,this.destino,{freq:t,quando:e,dur:.42,vol:.13*i,tipo:"sine"}),t<900&&ae(this.ctx,this.destino,{freq:t*2,quando:e,dur:.1,vol:.04*i,tipo:"sine"})}}const ch="aristory.som",l_=.035;class h_{ctx=null;mestre=null;canalMusica=null;canalEfeitos=null;musica=null;mudo;climaPendente="padrao";contadores=new Map;ultimoEm=new Map;carregando=null;contagem=new Map;constructor(){this.mudo=localStorage.getItem(ch)==="0";const t=()=>this.ligar();for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,t,{once:!1,passive:!0})}get ligado(){return!this.mudo}get pronto(){return this.ctx!==null&&this.ctx.state==="running"}ligar(){if(!this.ctx){const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,this.mestre=e.createGain(),this.mestre.gain.value=this.mudo?0:.9,this.mestre.connect(e.destination),this.canalMusica=e.createGain(),this.canalMusica.gain.value=.9,this.canalMusica.connect(this.mestre),this.canalEfeitos=e.createGain(),this.canalEfeitos.gain.value=1,this.canalEfeitos.connect(this.mestre),this.musica=new Nd(e,this.canalMusica),this.musica.setClima(this.climaPendente)}this.ctx.resume().then(()=>{this.mudo||this.musica?.start()})}setMudo(t){if(this.mudo=t,localStorage.setItem(ch,t?"0":"1"),this.mestre&&this.ctx){const e=this.ctx.currentTime;this.mestre.gain.cancelScheduledValues(e),this.mestre.gain.setValueAtTime(this.mestre.gain.value,e),this.mestre.gain.linearRampToValueAtTime(t?0:.9,e+.12)}t?this.musica?.stop():this.ctx?.state==="running"&&this.musica?.start()}setClima(t){this.climaPendente=t,this.musica?.setClima(t)}play(t){if(this.contagem.set(t,(this.contagem.get(t)??0)+1),this.mudo||!this.ctx||!this.canalEfeitos||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(e-(this.ultimoEm.get(t)??-1)<l_)return;this.ultimoEm.set(t,e);const i=(this.contadores.get(t)??0)+1;this.contadores.set(t,i),Ud[t]({ctx:this.ctx,destino:this.canalEfeitos,t:e,n:i})}carga(t){if(!this.ctx||!this.canalEfeitos||this.mudo||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(t===null){if(this.carregando){const{osc:o,ganho:s}=this.carregando;s.gain.cancelScheduledValues(e),s.gain.setValueAtTime(s.gain.value,e),s.gain.exponentialRampToValueAtTime(1e-4,e+.08),o.stop(e+.1),this.carregando=null}return}if(!this.carregando){const o=this.ctx.createOscillator();o.type="triangle";const s=this.ctx.createGain();s.gain.setValueAtTime(1e-4,e),s.gain.exponentialRampToValueAtTime(.05,e+.05),o.connect(s),s.connect(this.canalEfeitos),o.start(e),this.carregando={osc:o,ganho:s}}const i=pe(60+t*19);this.carregando.osc.frequency.setTargetAtTime(i,e,.04)}aplauso(){if(!this.ctx||!this.canalEfeitos)return;const t=this.ctx.currentTime;[0,5,9,12].forEach((e,i)=>{ae(this.ctx,this.canalEfeitos,{freq:pe(72+e),quando:t+i*.1,dur:.5,vol:.09,tipo:"triangle"})})}}const d_={magro:.86,medio:1,forte:1.16},lh=.75,u_=.13,f_={upright:{bracoX:-1.38,bracoZ:.16,balanco:.15,itemZ:0,itemX:0},relaxed:{bracoX:-.22,bracoZ:.46,balanco:.6,itemZ:.9,itemX:.13}};function or(n,t,e){const i=new Yo,o=5;for(let a=0;a<o*2;a++){const r=a%2===0?n:n*.46,c=a/(o*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*r,h=Math.sin(c)*r;a===0?i.moveTo(l,h):i.lineTo(l,h)}i.closePath();const s=new la(i,{depth:t,bevelEnabled:!1});return s.center(),new v(s,e)}class lc{group=new ct;spec;headTop;body=new ct;head=new ct;armL=new ct;armR=new ct;maoDir=new ct;legL=new ct;legR=new ct;blob;chapeu=new ct;phase=0;bounce=0;beijo=0;maos=0;pose="none";patinando=!1;altoDoPatins=0;alturaDaPerna=0;pes=[];patins=[];targetFacing=0;swimming=!1;sitting=!1;deitado=!1;trocaMaterial=[];soVestido=[];soBanho=[];calcao;pernasDoShort=[];calcaoDaFicha;estampa=[];traje="normal";roupa={};extras=new Map;medidas;sobreTronco=[];cabelo;constructor(t){this.spec=t;const e=t.height,i=d_[t.build],o=e*.28,s=e/1.7;this.altoDoPatins=u_*s,this.alturaDaPerna=o;const a=e*.3,r=e*.17,c=o,l=o+a*.86,h=e*.1*i,d=e*.3;this.headTop=o+a+r*2.1,this.medidas={h:e,w:i,headR:r,legH:o,torsoH:a};const u=w(t.skin),f=w(t.shirt),g=w(t.pants),M=w(t.shoes);this.calcaoDaFicha=w(t.swim??t.pants);for(const[b,L]of[[this.legL,-1],[this.legR,1]]){b.position.set(L*e*.055*i,c,0);const z=new v(new an(e*.042*i,o*.62,4,10),g);z.position.y=-o*.48,b.add(z),this.trocaMaterial.push({mesh:z,normal:g,banho:u,slot:"pernas",parte:"principal"});const B=o*.36,H=new v(new nt(e*.052*i,e*.064*i,B,14,1,!0),this.calcaoDaFicha);H.position.y=o*.02-B/2,H.visible=!1,b.add(H),this.soBanho.push(H),this.pernasDoShort.push(H);const W=new v(new O(e*.075*i,e*.045,e*.11),M);W.position.set(0,-o+e*.022,e*.018),b.add(W),this.trocaMaterial.push({mesh:W,normal:M,banho:u,slot:"pes",parte:"principal"}),this.pes.push(W);const q=ic(t.shoes);q.scale.setScalar(s),q.visible=!1,b.add(q),this.patins.push(q),this.body.add(b)}const m=new v(new an(e*.105*i,a*.5,5,12),f);if(m.position.y=c+a*.52,m.scale.z=.82,this.body.add(m),this.trocaMaterial.push({mesh:m,normal:f,banho:u,slot:"tronco",parte:"principal"}),t.shirtAccent!==void 0){const b=new v(new nt(e*.108*i,e*.108*i,e*.03,14,1,!0),w(t.shirtAccent,{doubleSide:!0}));b.position.y=c+a*.72,b.scale.z=.82,this.body.add(b),this.soVestido.push(b),this.sobreTronco.push(b)}if(t.jacket!==void 0){const b=w(t.jacket,{doubleSide:!0}),L=e*.105*i,z=new v(new nt(L*1.14,L*1.1,a*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),b);z.position.y=c+a*.56,z.scale.z=.84,this.body.add(z),this.soVestido.push(z),this.sobreTronco.push(z);const B=new v(new It(e*.088*i,12,10,0,Math.PI*2,0,Math.PI*.62),w(t.jacket));B.position.set(0,l+a*.04,-L*.75),B.rotation.x=-.7,B.scale.set(1.15,1,.8),this.body.add(B),this.soVestido.push(B),this.sobreTronco.push(B)}const p=e*.118*i,S=e*.105,x=new v(new nt(p,e*.112*i,S,14),this.calcaoDaFicha);x.position.y=c+e*.012,x.scale.z=.85,x.visible=!1,this.body.add(x),this.soBanho.push(x),this.calcao=x;for(const b of[.3,-.12]){const L=new v(new nt(p*1.03,p*1.03,e*.019,14,1,!0),this.calcaoDaFicha);L.position.y=b*S,L.visible=!1,x.add(L),this.estampa.push(L)}for(const[b,L]of[[this.armL,-1],[this.armR,1]]){b.position.set(L*h,l,0);const z=t.jacket!==void 0?w(t.jacket):f,B=new v(new an(e*.038*i,d*.34,4,10),z);B.position.y=-d*.24,b.add(B),this.trocaMaterial.push({mesh:B,normal:z,banho:u,slot:"tronco",parte:"detalhe"});const H=new v(new an(e*.032*i,d*.28,4,10),u);H.position.y=-d*.66,b.add(H);const W=new v(new It(e*.04*i,10,8),u);W.position.y=-d*.92,b.add(W),this.body.add(b)}this.maoDir.position.y=-d*.98,this.armR.add(this.maoDir),this.head.position.y=o+a+r*.92;const y=new v(new nt(e*.035,e*.04,e*.05,10),u);y.position.y=-r*.85,this.head.add(y);const A=new v(new It(r,20,16),u);A.scale.set(1,1.04,1),this.head.add(A);const P=w(t.eyes);for(const b of[-1,1]){const L=new v(new It(r*.14,10,8),P);if(L.position.set(b*r*.35,0,r*.9),L.scale.set(1,1.25,.6),this.head.add(L),t.blush!==void 0){const z=new v(new Vo(r*.16,12),Ye(t.blush,.75,!0));z.position.set(b*r*.56,-r*.26,r*.82),z.rotation.y=b*.35,this.head.add(z)}}const C=w(t.hair.color);for(const b of[-1,1]){const L=new v(new O(r*.3,r*.075,r*.06),C);L.position.set(b*r*.35,r*.3,r*.87),L.rotation.z=b*-.12,this.head.add(L)}const D=new v(new ge(r*.16,r*.035,6,14,Math.PI),P);D.position.set(0,-r*.38,r*.9),D.rotation.set(0,0,Math.PI),this.head.add(D);const E=this.head.children.length;this.buildHair(r),this.cabelo=this.head.children.slice(E),this.buildAccessories(r,d,l,h,a,c,i),this.body.add(this.head),this.group.add(this.body),this.blob=new v(new Vo(e*.16*i,18),Ye(2832939,.22,!0)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(b=>{b.isMesh&&b!==this.blob&&(b.castShadow=!0,b.receiveShadow=!1)})}buildHair(t){const{style:e,color:i}=this.spec.hair,o=w(i),s=(a,r,c=.62,l=0)=>{const h=new v(new It(t*a,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),o);return h.position.y=r,this.head.add(h),h};switch(e){case"raspado":{s(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{s(1.06,t*.04).scale.set(1,.95,.98);const r=new v(new O(t*1.5,t*.34,t*.42),o);r.position.set(0,t*.6,t*.62),r.rotation.x=-.18,this.head.add(r);break}case"franja":{s(1.07,t*.02);const a=new v(new nt(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),o);a.position.set(0,t*.5,0),this.head.add(a);break}case"ondulado":{s(1.08,t*.02);for(const a of[-1,1]){const r=new v(new It(t*.46,12,10),o);r.position.set(a*t*.85,t*.1,-t*.1),r.scale.set(.8,1.15,1),this.head.add(r)}break}case"coque":{s(1.06,t*.02);const a=new v(new It(t*.42,12,10),o);a.position.set(0,t*.72,-t*.82),this.head.add(a);break}case"cachos-curtos":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?w(this.spec.hair.tips):o;s(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[d,u,f,g]of l)for(let M=0;M<u;M++){const m=M/u*Math.PI*2+d*1.9,p=Math.sin(d)*Math.cos(m),S=Math.cos(d),x=Math.sin(d)*Math.sin(m);if(S<.72&&x>.24)continue;const y=new v(new It(t*f*(1+(a-1)*.4),8,7),h%5===0?r:o),A=g*(1+(a-1)*.14),P=x>0?.9:1.02;y.position.set(p*t*A,S*t*A,x*t*A*P),this.head.add(y),h++}for(let d=0;d<5;d++){const u=new v(new It(t*.2*(1+(a-1)*.3),8,7),d===2?r:o);u.position.set((d-2)*t*.3,t*(.62-d%2*.07),t*.62),this.head.add(u)}for(let d=0;d<3;d++){const u=new v(new It(t*.24*(1+(a-1)*.4),8,7),d===1?r:o);u.position.set((d-1)*t*.3,t*(.84+d%2*.07),t*.44),this.head.add(u)}for(const d of[-1,1]){const u=new v(new It(t*.17,8,7),o);u.position.set(d*t*.9,-t*.12,t*.22),u.scale.set(.7,1.1,.85),this.head.add(u)}break}case"cacheado":{const a=this.spec.hair.volume??1,r=this.spec.hair.tips!==void 0?w(this.spec.hair.tips):o;s(1+(a-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[d,u,f,g]of l)for(let M=0;M<u;M++){const m=M/u*Math.PI*2+d*2.3,p=Math.sin(d)*Math.cos(m),S=Math.cos(d),x=Math.sin(d)*Math.sin(m);if(d>.72&&x>.22)continue;const y=1+(a-1)*.55,A=new v(new It(t*f*y,8,7),h%4===0?r:o),P=g*(1+(a-1)*.28),C=x>0?.78:1.06;A.position.set(p*t*P,S*t*P,x*t*P*C),this.head.add(A),h++}for(let d=0;d<4;d++){const u=new v(new It(t*.22*(1+(a-1)*.4),8,7),d===1?r:o);u.position.set((d-1.5)*t*.34,t*(.62-d%2*.08),t*.62),this.head.add(u)}for(const d of[-1,1]){const u=new v(new It(t*.26*a,8,7),o);u.position.set(d*t*1.02*a,-t*.34,t*.28),u.scale.set(.8,1.25,.9),this.head.add(u)}break}}}buildAccessories(t,e,i,o,s,a,r){const c=this.spec.accessories??[],l=w(this.spec.accessoryColor??3093568);{const h=new v(new nt(t*.7,t*.7,t*.11,16),w(16774096));h.position.y=t*1.42,this.chapeu.add(h);const d=new v(new Ce(t*.58,t*1.05,14),w(_.gold));d.position.y=t*1.98,this.chapeu.add(d);const u=or(t*.3,t*.07,w(16774096));u.position.y=t*2.62,this.chapeu.add(u),this.chapeu.rotation.z=-.14,this.chapeu.visible=!1,this.head.add(this.chapeu)}if(c.includes("oculos")){for(const d of[-1,1]){const u=new v(new ge(t*.24,t*.045,8,16),l);u.position.set(d*t*.36,t*.06,t*.9),this.head.add(u)}const h=new v(new O(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new v(new It(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const d=new v(new nt(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);d.position.set(0,t*.12,t*.28),d.rotation.x=-.12,this.head.add(d)}if(c.includes("barba")){const h=new v(new It(t*.72,14,12),w(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new v(new ge(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const d of[-1,1]){const u=new v(new nt(t*.28,t*.28,t*.16,12),l);u.position.set(d*t*1.02,t*.02,0),u.rotation.z=Math.PI/2,this.head.add(u)}}if(c.includes("corrente")){const h=new v(new ge(t*.42,t*.035,6,20),w(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new v(new nt(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,d=or(t*.3,t*.06,w(15918799));d.position.set(-t*.78*h,t*.92*h,t*.62*h),d.rotation.set(.35,-.6,.3),this.head.add(d)}if(c.includes("laco")){const h=this.spec.height,d=new ct,u=h*.105*r,f=new v(new It(h*.018,8,6),l);d.add(f);for(const g of[-1,1]){const M=new v(new ge(h*.026,h*.007,6,12),l);M.position.set(g*h*.03,h*.008,0),M.rotation.set(0,g*.5,g*.35),M.scale.set(1,.7,1),d.add(M);const m=new v(new O(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,d.add(m)}d.position.set(0,i-s*.1,u*.86),this.body.add(d),this.soVestido.push(d),this.sobreTronco.push(d)}if(c.includes("cinto")){const h=this.spec.height,d=h*.105*r,u=a+s*.08,f=new v(new nt(d*1.04,d*1.04,h*.032,16,1,!0),l);f.position.y=u,f.scale.z=.84,this.body.add(f),this.soVestido.push(f),this.sobreTronco.push(f);const g=new v(new O(h*.032,h*.03,h*.012),w(14210252));g.position.set(0,u,d*.9),this.body.add(g),this.soVestido.push(g),this.sobreTronco.push(g);const M=new v(new ge(h*.028,h*.004,5,12,Math.PI),w(14210252));M.position.set(d*.6,u-h*.012,d*.6),M.rotation.set(0,-.7,Math.PI),this.body.add(M),this.soVestido.push(M),this.sobreTronco.push(M);const m=or(h*.016,h*.004,w(14210252));m.position.set(d*.76,u-h*.05,d*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m),this.sobreTronco.push(m)}if(c.includes("mochila")){const h=new v(new O(o*1.7,s*.62,this.spec.height*.09),l);h.position.set(0,a+s*.6,-this.spec.height*.11*r),this.body.add(h),this.soVestido.push(h),this.sobreTronco.push(h);const d=i;for(const u of[-1,1]){const f=new v(new O(this.spec.height*.022,s*.5,this.spec.height*.02),l);f.position.set(u*o*.6,d-s*.2,this.spec.height*.085*r),this.body.add(f),this.soVestido.push(f),this.sobreTronco.push(f)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setCampeao(t){this.chapeu.visible=t}get campeao(){return this.chapeu.visible}setOutfit(t){this.traje=t,this.aplicarVisual()}aplicarVisual(){const t=this.traje==="banho";for(const a of this.trocaMaterial){if(t){a.mesh.material=a.banho;continue}if(this.mostraPele(a.slot,a.parte)){a.mesh.material=a.banho;continue}const r=this.roupa[a.slot];if(!r){a.mesh.material=a.normal;continue}const c=a.parte==="detalhe"?r.corDetalhe??r.cor:r.cor;a.mesh.material=c===void 0?a.normal:w(c)}for(const a of this.soVestido)a.visible=!t;for(const a of this.soBanho)a.visible=t;const e=this.roupa.pernas,i=e?.corBanho===void 0?this.calcaoDaFicha:w(e.corBanho);this.calcao.material=i;for(const a of this.pernasDoShort)a.material=i;for(const a of this.estampa)a.visible=e?.estampaBanho!==void 0,e?.estampaBanho!==void 0&&(a.material=w(e.estampaBanho));if(!t&&this.roupa.tronco)for(const a of this.sobreTronco)a.visible=!1;for(const[a,r]of this.extras){const c=this.roupa[a]!==void 0&&(a==="cabeca"||!t)&&!(a==="pes"&&this.patinando);for(const l of r)l.visible=c}for(const a of this.pes)a.visible=!this.patinando;for(const a of this.patins)a.visible=this.patinando;const s=this.roupa.cabeca?.cobreCabelo===!0;for(const a of this.cabelo)a.visible=!s}mostraPele(t,e){for(const i of Object.values(this.roupa))if(i&&(i.pernasNuas&&t==="pernas"&&!this.roupa.pernas||i.bracosNus&&t==="tronco"&&e==="detalhe"))return!0;return!1}vestirRoupa(t){for(const e of mn){const i=t[e]??null;if((this.roupa[e]?.id??null)===i)continue;this.tirarExtras(e);const o=i?Ws(i):null;this.roupa[e]=o??void 0,o?.extra&&this.porExtras(e,o)}this.aplicarVisual()}get roupaAtual(){const t={};for(const e of mn){const i=this.roupa[e];i&&(t[e]=i.id)}return t}porExtras(t,e){if(!e.extra&&!e.extraBraco)return;const i=[];e.extra&&(t==="pes"||t==="pernas"?i.push([this.legL,"corpo",-1],[this.legR,"corpo",1]):t==="cabeca"?i.push([this.head,"corpo",1]):i.push([this.body,"corpo",1])),e.extraBraco&&i.push([this.armL,"braco",-1],[this.armR,"braco",1]);const o=[];for(const[s,a,r]of i){const c=a==="braco"?e.extraBraco(this.medidas,r):e.extra(this.medidas,r);c.userData.roupa=e.id,c.traverse(l=>{l.isMesh&&(l.castShadow=!0,l.receiveShadow=!1)}),s.add(c),o.push(c)}this.extras.set(t,o)}tirarExtras(t){const e=this.extras.get(t);if(e){for(const i of e)i.parent?.remove(i),i.traverse(o=>{const s=o;s.isMesh&&s.geometry.dispose()});this.extras.delete(t)}}setSitting(t){this.sitting=t,t||(this.poeAltura(0),this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setLying(t){this.deitado=t,t||(this.poeAltura(0),this.legL.rotation.set(0,0,0),this.legR.rotation.set(0,0,0),this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08),this.body.rotation.x=0)}setPatins(t){if(this.patinando!==t){this.patinando=t;for(const e of this.patins)e.position.y=-this.alturaDaPerna-this.altoDoPatins;this.aplicarVisual()}}get patinandoAgora(){return this.patinando}segurar(t,e="none"){for(let i=this.maoDir.children.length-1;i>=0;i--)this.maoDir.remove(this.maoDir.children[i]);this.pose=t?e:"none",t&&this.maoDir.add(t)}get segurando(){return this.maoDir.children.length>0}setHoldingHands(t){this.maos=t}get holdingHands(){return this.maos!==0}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let i=this.targetFacing-this.group.rotation.y;if(i=Math.atan2(Math.sin(i),Math.cos(i)),this.group.rotation.y+=i*Math.min(1,t*14),this.beijo>.001){const c=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=c*.3,this.poeAltura(c*.045),this.armL.rotation.set(-c*.55,0,.08+c*.16),this.armR.rotation.set(-c*.55,0,-.08-c*.16),this.head.rotation.x=c*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.deitado){this.phase+=t*.55,this.legL.rotation.set(0,0,-.05),this.legR.rotation.set(0,0,.05);const c=Math.sin(this.phase)*.07,l=Math.sin(this.phase*.73)*.05;this.armL.rotation.set(l,0,-.14-c),this.armR.rotation.set(-l,0,.14+c),this.body.rotation.x=Math.sin(this.phase)*.02,this.head.rotation.x=Math.sin(this.phase*.6)*.025,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9;const c=Math.sin(this.phase*2.2)*.17;this.legL.rotation.x=-Math.PI/2+.06+c,this.legR.rotation.x=-Math.PI/2-.02-c,this.armL.rotation.set(-.25,0,-.34),this.armR.rotation.set(-.2,0,.34),this.maos!==0&&(this.maos<0?this.armL:this.armR).rotation.set(.12,0,lh*.8*this.maos),this.body.rotation.x=-.05,this.poeAltura(Math.sin(this.phase)*.012),this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const c=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+c*.9,this.armR.rotation.x=-1.1-c*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=c*.28,this.legR.rotation.x=-c*.28,this.body.rotation.x=.16,this.poeAltura(Math.sin(this.phase)*.03),this.head.rotation.x=-.14;return}const o=e>.05,s=this.patinando?.9+e*.33:3.2+e*1.9;this.phase+=t*(o?s:1.4);const a=o?this.patinando?Math.min(.34,.12+e*.06):Math.min(.62,.16+e*.14):.04,r=Math.sin(this.phase*(o?2:1));if(this.patinando){const c=o?Math.min(.28,.1+e*.04):.03;this.legL.rotation.z=-Math.max(0,r)*c*1.7,this.legR.rotation.z=Math.max(0,-r)*c*1.7,this.legL.rotation.x=o?r*a*.25:0,this.legR.rotation.x=o?-r*a*.25:0,this.body.rotation.z=r*c*.34;const l=.34+Math.abs(r)*.14;this.armL.rotation.x=o?-r*a*.9:0,this.armR.rotation.x=o?r*a*.9:0,this.armL.rotation.z=-l,this.armR.rotation.z=l}else this.legL.rotation.z=0,this.legR.rotation.z=0,this.body.rotation.z=0,this.legL.rotation.x=o?r*a:0,this.legR.rotation.x=o?-r*a:0,this.armL.rotation.x=o?-r*a*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=o?r*a*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08;if(this.maos!==0){const c=this.maos<0?this.armL:this.armR,l=this.maos<0?this.armR:this.armL;c.rotation.z=lh*this.maos,c.rotation.x=-.1,l.rotation.x*=.5}if(this.aplicarPose(),this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const c=Math.sin((1-this.bounce)*Math.PI)*.28;this.poeAltura(c),this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const c=o?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.poeAltura(c),this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=o?this.patinando?.16:.06:0,this.head.rotation.x=o?-.05:Math.sin(this.phase*.6)*.03}poeAltura(t){this.body.position.y=t+this.altoDoPatins*(this.patinando?1:0)}aplicarPose(){if(this.pose==="none"||this.maos>0){this.maoDir.rotation.set(0,0,0),this.maoDir.position.x=0;return}const t=f_[this.pose];this.armR.rotation.x=t.bracoX+this.armR.rotation.x*t.balanco,this.armR.rotation.z=t.bracoZ,this.maoDir.rotation.set(-this.armR.rotation.x,0,t.itemZ-this.armR.rotation.z),this.maoDir.position.x=t.itemX}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class p_{renderer;cena=new Xh;camera=new sn(30,1,.1,20);pedestal=new ct;rig=null;spec=null;giro=0;alvo=0;constructor(t){this.renderer=new fd({canvas:t,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.cena.add(this.pedestal);const e=new rd(16777215,8952234,1.5);this.cena.add(e);const i=new Qr(16774368,1.5);i.position.set(3,5,4),this.cena.add(i);const o=new Qr(12572927,.5);o.position.set(-3,2,-3),this.cena.add(o)}mostrar(t){if(this.spec?.id===t.id)return;this.rig&&(this.pedestal.remove(this.rig.group),this.rig.dispose()),this.spec=t,this.rig=new lc(t),this.pedestal.add(this.rig.group);const e=t.height;this.rig.group.position.y=-e*.5,this.camera.position.set(0,e*.04,e*2.28),this.camera.lookAt(0,0,0)}vestir(t){this.rig?.vestirRoupa(t)}girar(t){this.alvo+=t}update(t){this.rig&&(this.giro+=(this.alvo-this.giro)*Math.min(1,t*9),this.pedestal.rotation.y=this.giro,this.rig.update(t,0))}desenhar(){if(!this.rig)return;const t=this.renderer.domElement,e=t.clientWidth,i=t.clientHeight;e<2||i<2||((t.width!==e||t.height!==i)&&this.renderer.setSize(e,i,!1),this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.render(this.cena,this.camera))}dispose(){this.rig?.dispose(),this.rig=null,this.spec=null,this.renderer.dispose()}}class m_{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;if(!this.enabled){this.hot=!1,this.pulse=0,this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const i=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(i*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(i*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}const hh=4e-5;class g_{constructor(t){this.game=t}root=new ct;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(i=>{i.isMesh&&(i.castShadow=!0,i.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,i,o,s=0){return t.position.set(e,i,o),t.rotation.y=s,t}chaoAcimaDeOutro(t){return(t??0)>0}afundarChaoDeBase(t){return(t??0)>0?-.001-this.decalque*hh:-.006}escalarPeloChao(t,e,i){const o=t.clone();return o.needsUpdate=!0,o.repeat.set(t.repeat.x*e,t.repeat.y*i),o}ground(t){const e=new ze(t.width,t.depth,1,1),i=this.chaoAcimaDeOutro(t.y),o=t.textura?this.escalarPeloChao(t.textura,t.width,t.depth):void 0,s=new v(e,w(t.color,{decal:i,mapa:o}));return s.rotation.x=-Math.PI/2,s.position.set(t.x??0,this.afundarChaoDeBase(t.y),t.z??0),i?this.decalar(s):(s.receiveShadow=!0,this.root.add(s),s)}groundWithHoles(t){const e=t.width/2,i=t.depth/2,o=new Yo;o.moveTo(-e,-i),o.lineTo(e,-i),o.lineTo(e,i),o.lineTo(-e,i),o.closePath();for(const r of t.holes){const c=new Zr,l=r.x-r.width/2,h=r.x+r.width/2,d=-r.z-r.depth/2,u=-r.z+r.depth/2;c.moveTo(l,d),c.lineTo(h,d),c.lineTo(h,u),c.lineTo(l,u),c.closePath(),o.holes.push(c)}const s=this.chaoAcimaDeOutro(t.y),a=new v(new Lc(o),w(t.color,{decal:s,mapa:t.textura}));return a.rotation.x=-Math.PI/2,a.position.set(t.x??0,this.afundarChaoDeBase(t.y),t.z??0),s?this.decalar(a):(a.receiveShadow=!0,this.root.add(a),a)}decalar(t){return t.renderOrder=++this.decalque,t.position.y=-.001-this.decalque*hh,t.receiveShadow=!0,this.root.add(t),t}patch(t,e,i,o,s,a=0,r=.01,c){const l=c?this.escalarPeloChao(c,i,o):void 0,h=new v(new ze(i,o),w(s,{decal:!0,mapa:l}));return h.rotation.set(-Math.PI/2,0,0),h.rotation.z=a,h.position.set(t,r,e),this.decalar(h)}disc(t,e,i,o,s=.01,a){const r=a?this.escalarPeloChao(a,i*2,i*2):void 0,c=new v(new Vo(i,28),w(o,{decal:!0,mapa:r}));return c.rotation.x=-Math.PI/2,c.position.set(t,s,e),this.decalar(c)}ring(t,e,i,o,s,a=.01){const r=new Dc(Math.max(0,i-o),i,40),c=new v(r,w(s,{decal:!0}));return c.rotation.x=-Math.PI/2,c.position.set(t,a,e),this.decalar(c)}blockBox(t,e,i,o,s=0){this.colliders.push({kind:"box",x:t,z:e,hw:i,hd:o,rot:s})}blockCircle(t,e,i){this.colliders.push({kind:"circle",x:t,z:e,r:i})}blockFrom(t,e=.9){const i=new uo().setFromObject(t),o=i.getSize(new N),s=i.getCenter(new N);this.blockBox(s.x,s.z,o.x/2*e,o.z/2*e,0)}setBounds(t,e,i,o){this.bounds={minX:t,minZ:e,maxX:i,maxZ:o}}wall(t,e,i,o,s=3,a=15984595,r=.3){const c=i-t,l=o-e,h=Math.hypot(c,l),d=Math.atan2(l,c),u=new v(new O(h,s,r),w(a));return u.position.set((t+i)/2,s/2,(e+o)/2),u.rotation.y=-d,this.add(u),this.blockBox((t+i)/2,(e+o)/2,h/2,r/2,-d),u}interact(t){const e=new m_(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}banco(t,e,i=0,o){const s=this.add(this.place(vd(o),t,0,e,i));this.blockBox(t,e,.95,.35,i);const a=new ve;a.position.set(t,0,e),a.rotation.y=i+Math.PI,this.root.add(a);const r=new ve;r.position.set(t,.9,e),this.root.add(r);const c=.06,l=.46;return this.interact({id:`banco:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:1.9,label:"Sentar no banco",icon:"🪑",highlight:s,onInteract:async h=>{h.lockPlayer(!0),h.ridePlayer(a,new N(-l,c,.02),1,Math.PI),h.rideCompanion(a,new N(l,c,.02),1,Math.PI),h.setSitting(!0),h.focusCamera(r),await h.wait(.5),await h.say(["Senta aqui um pouco."],h.companionName()),await h.say(["Só um pouquinho."],h.playerName());let d=0;for(;d===0;)d=await h.ask("Ficar mais um pouco?",["Ficar","Levantar"]),d===0&&await h.wait(4);h.setSitting(!1),h.focusCamera(null);const u=i,f=Math.sin(u)*1.5,g=Math.cos(u)*1.5;h.releasePlayer(t+f-Math.cos(u)*.5,e+g+Math.sin(u)*.5,u),h.releaseCompanion(t+f+Math.cos(u)*.5,e+g-Math.sin(u)*.5,u),h.lockPlayer(!1)}}),s}mesaDePiquenique(t,e,i=0){const o=this.add(this.place(_d(),t,0,e,i));this.blockBox(t,e,1.05,.75,i);const s=new ve;s.position.set(t,0,e),s.rotation.y=i,this.root.add(s);const a=new ve;a.position.set(t,.95,e),this.root.add(a);const r=.02,c=.78;return this.interact({id:`piquenique:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:2.1,label:"Sentar na mesa",icon:"🧺",highlight:o,onInteract:async l=>{l.lockPlayer(!0),l.ridePlayer(s,new N(0,r,c),1,Math.PI),l.rideCompanion(s,new N(0,r,-c),1,0),l.setSitting(!0),l.focusCamera(a),await l.wait(.5),await l.say(["De frente pra você é melhor."],l.companionName()),await l.say(["É. Dá pra ver você falando."],l.playerName());let h=0;for(;h===0;)h=await l.ask("Ficar mais um pouco?",["Ficar","Levantar"]),h===0&&await l.wait(4);l.setSitting(!1),l.focusCamera(null);const d=Math.sin(i),u=Math.cos(i);l.releasePlayer(t+d*1.7,e+u*1.7,i+Math.PI),l.releaseCompanion(t-d*1.7,e-u*1.7,i),l.lockPlayer(!1)}}),o}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}const bn={x:.5,y:.44},yn=n=>1/(1+8.5*n),v_=(n,t,e,i,o)=>{const s=yn(e);return{x:(bn.x+n*s)*i,y:(bn.y+t*s)*o}},dn=.56,dh=-.44,xn=.62,sr=-.28,uh=-.34,Sn={ariCabelo:"#8f5c33",ariRoupa:"#e8e2d6",ariPele:"#f2cfb2",renanCabelo:"#1f1712",renanRoupa:"#1b1c22",renanPele:"#efc8a4",perna:"#15161c"},Pe={ceuTopo:"#0a1120",ceuBaixo:"#2b3d58",vigaFrente:"#6d4028",vigaBaixo:"#3c2115",longarina:"#7d4d31",tijolo:"#b1613f",tijoloSombra:"#7e4029",tijoloJunta:"#cd8461",base:"#8a8781",chaoPerto:"#8b7a51",chaoLonge:"#4a4536",junta:"#6f6650",tatil:"#77746b",tatilRisco:"#95928a",folhaClara:"#2c5741",folhaEscura:"#16301f",fio:"#5d5346",luz:"#ffd489",luzNucleo:"#fff8e6"},Me={ceuTopo:"#1f74c8",ceuBaixo:"#a9d9f2",mataLonge:"#4d7f4a",mataPerto:"#356b39",gramaAlta:"#8fae55",gramaBaixa:"#a8bd68",sombra:"#5f7a3c",inflavelClaro:"#eeeae2",inflavelCinza:"#cfd2d4",inflavelRosa:"#f06a9c",bannerXadrez:"#3f8fd1",bannerFundo:"#fbfaf6",bannerRosa:"#ef5ba1",bannerTexto:"#e0357f",gato:"#fdfcf9",gatoTraco:"#3b3630",lacoVermelho:"#e0342f",verdeBrinquedo:"#57bd45",verdeBrinquedoFundo:"#3f9a32",azulBrinquedo:"#3aa9e8",azulBrinquedoFundo:"#2681bd",amareloBrinquedo:"#f5c518",roxoBrinquedo:"#8f5cc4",torre:"#f5822c",grade:"#3f6fbd"},fh=["#e8442f","#f5c518","#3d9be0","#f07ab0","#f7f4ec","#6fc04a","#f5822c","#a069c4"];function __(n,t,e,i,o){n.strokeStyle=o,n.lineCap="round",n.lineWidth=Math.max(1.2,i*.04),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(t-i*.07,e-i*.55,t,e-i),n.stroke();const s=e-i;n.lineWidth=Math.max(1.6,i*.1);for(let a=0;a<9;a++){const r=-Math.PI*.94+a/8*Math.PI*.88,c=i*(.42+.14*Math.sin(a*1.7));n.beginPath(),n.moveTo(t,s+i*.04),n.quadraticCurveTo(t+Math.cos(r)*c*.62,s+Math.sin(r)*c*.58,t+Math.cos(r)*c,s+Math.sin(r)*c+c*.34),n.stroke()}}function M_(n,t,e,i,o){if(i>1.4){const s=n.createRadialGradient(t,e,0,t,e,i*6);s.addColorStop(0,`rgba(255, 206, 128, ${.58*o})`),s.addColorStop(.45,`rgba(255, 178, 96, ${.18*o})`),s.addColorStop(1,"rgba(255, 170, 90, 0)"),n.fillStyle=s,n.beginPath(),n.arc(t,e,i*6,0,Math.PI*2),n.fill()}n.fillStyle=Pe.luz,n.globalAlpha=o,n.beginPath(),n.arc(t,e,i,0,Math.PI*2),n.fill(),n.fillStyle=Pe.luzNucleo,n.beginPath(),n.arc(t,e,i*.45,0,Math.PI*2),n.fill(),n.globalAlpha=1}function oa(n,t,e,i,o,s,a,r){const c=i*.3;n.strokeStyle=Sn.perna,n.lineWidth=i*.075,n.lineCap="round";for(const l of[-1,1])n.beginPath(),n.moveTo(t,e-i*.42),n.lineTo(t+l*c*.26*a,e),n.stroke();if(r){n.strokeStyle=r,n.lineWidth=i*.055;for(const l of[-1,1])n.beginPath(),n.moveTo(t+l*c*.42,e-i*.72),n.lineTo(t+l*c*.52,e-i*.44),n.stroke()}n.fillStyle=o,n.beginPath(),n.roundRect(t-c/2,e-i*.78,c,i*.4,c*.32),n.fill(),n.fillStyle=s,n.beginPath(),n.arc(t,e-i*.87,i*.11,0,Math.PI*2),n.fill()}function ar(n,t,e,i,o,s,a,r,c,l){const h=(t+i)/2,d=(e+o)/2+s,u=f=>{const g=1-f;return{x:g*g*t+2*g*f*h+f*f*i,y:g*g*e+2*g*f*d+f*f*o}};n.strokeStyle="rgba(240, 240, 235, 0.85)",n.lineWidth=Math.max(.8,a*.05),n.beginPath(),n.moveTo(t,e),n.quadraticCurveTo(h,d,i,o),n.stroke();for(let f=0;f<r;f++){const g=(f+.5)/r,M=u(Math.max(0,g-.012)),m=u(Math.min(1,g+.012)),p=m.x-M.x,S=m.y-M.y,x=Math.hypot(p,S)||1,y=-S/x,A=p/x,P=Math.sin(l*1.1+f*.8)*a*.06;n.fillStyle=fh[(f+c)%fh.length],n.beginPath(),n.moveTo(M.x,M.y),n.lineTo(m.x,m.y),n.lineTo((M.x+m.x)/2-y*a+P,(M.y+m.y)/2-A*a),n.closePath(),n.fill()}}function x_(n,t,e,i){n.fillStyle=Me.gato;for(const o of[-1,1])n.beginPath(),n.moveTo(t+o*i*.92,e-i*.28),n.lineTo(t+o*i*.62,e-i*1.15),n.lineTo(t+o*i*.16,e-i*.6),n.closePath(),n.fill();n.beginPath(),n.ellipse(t,e,i,i*.82,0,0,Math.PI*2),n.fill(),n.fillStyle=Me.lacoVermelho;for(const o of[-1,1])n.beginPath(),n.ellipse(t+i*(.78+o*.24),e-i*.5,i*.26,i*.2,0,0,Math.PI*2),n.fill();n.fillStyle=Me.gatoTraco;for(const o of[-1,1])n.beginPath(),n.ellipse(t+o*i*.36,e-i*.02,i*.09,i*.13,0,0,Math.PI*2),n.fill();n.fillStyle=Me.amareloBrinquedo,n.beginPath(),n.ellipse(t,e+i*.14,i*.11,i*.08,0,0,Math.PI*2),n.fill(),n.strokeStyle=Me.gatoTraco,n.lineWidth=Math.max(.5,i*.05);for(const o of[-1,1])for(let s=-1;s<=1;s++)n.beginPath(),n.moveTo(t+o*i*.6,e+i*.1+s*i*.14),n.lineTo(t+o*i*1.02,e+i*.04+s*i*.2),n.stroke()}function Ns(n,t,e,i,o,s,a){const r=Math.min(o*.42,i*.2);n.fillStyle=s,n.beginPath(),n.roundRect(t,e,i,o,r),n.fill(),n.strokeStyle=a,n.lineWidth=Math.max(.7,o*.045);const c=Math.max(2,Math.round(i/(o*.75)));for(let l=1;l<c;l++){const h=t+i*l/c;n.beginPath(),n.moveTo(h,e+o*.14),n.lineTo(h,e+o*.86),n.stroke()}n.strokeStyle="rgba(255, 255, 255, 0.34)",n.lineWidth=Math.max(.8,o*.07),n.beginPath(),n.moveTo(t+r,e+o*.16),n.lineTo(t+i-r,e+o*.16),n.stroke()}function y_(n,t,e,i){const o=(x,y,A)=>v_(x,y,A,t,e),s=bn.y*e,a=n.createLinearGradient(0,0,0,s);a.addColorStop(0,Pe.ceuTopo),a.addColorStop(1,Pe.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,s);const r=n.createLinearGradient(0,s,0,e);r.addColorStop(0,Pe.chaoLonge),r.addColorStop(1,Pe.chaoPerto),n.fillStyle=r,n.fillRect(0,s,t,e-s);const c=n.createRadialGradient(bn.x*t,e*.86,0,bn.x*t,e*.86,t*.62);c.addColorStop(0,"rgba(255, 196, 122, 0.3)"),c.addColorStop(1,"rgba(255, 190, 120, 0)"),n.fillStyle=c,n.fillRect(0,s,t,e-s),n.strokeStyle=Pe.junta;for(let x=0;x<26;x++){const y=x*.036,A=o(-xn,dn,y),P=o(xn,dn,y);n.globalAlpha=Math.min(.42,.42*yn(y)*3.2),n.lineWidth=Math.max(.5,3*yn(y)),n.beginPath(),n.moveTo(A.x,A.y),n.lineTo(P.x,P.y),n.stroke()}n.globalAlpha=.22,n.lineWidth=1;for(let x=-6;x<=6;x++){if(x===0)continue;const y=o(x*.1,dn,0);n.beginPath(),n.moveTo(bn.x*t,bn.y*e),n.lineTo(y.x,y.y),n.stroke()}n.globalAlpha=1;const l=o(-.05,dn,0),h=o(.05,dn,0),d=o(-.05,dn,.97),u=o(.05,dn,.97);n.fillStyle=Pe.tatil,n.beginPath(),n.moveTo(l.x,l.y),n.lineTo(h.x,h.y),n.lineTo(u.x,u.y),n.lineTo(d.x,d.y),n.closePath(),n.fill(),n.strokeStyle=Pe.tatilRisco;for(let x=0;x<22;x++){const y=x*.042,A=o(-.038,dn,y),P=o(.038,dn,y);n.lineWidth=Math.max(.5,3.2*yn(y)),n.beginPath(),n.moveTo(A.x,A.y),n.lineTo(P.x,P.y),n.stroke()}for(let x=5;x>=0;x--){const y=.12+x*.15,A=yn(y);for(const P of[-1,1]){const C=o(P*(xn+.13),dn,y);__(n,C.x,C.y,e*.85*A,x%2===0?Pe.folhaEscura:Pe.folhaClara)}}for(let x=7;x>=0;x--){const y=x*.115,A=yn(y),P=t*.085*A;for(const C of[-1,1]){const D=o(C*xn,dn,y),E=o(C*xn,sr,y),b=D.x-P/2;n.fillStyle=Pe.tijolo,n.fillRect(b,E.y,P,D.y-E.y),n.fillStyle=Pe.tijoloSombra,n.fillRect(C<0?b+P*.68:b,E.y,P*.32,D.y-E.y);const L=(D.y-E.y)*.09;if(n.fillStyle=Pe.base,n.fillRect(b-P*.06,D.y-L,P*1.12,L),y<.3){n.strokeStyle=Pe.tijoloJunta,n.lineWidth=Math.max(.5,1.6*A),n.globalAlpha=.5;const z=D.y-L;for(let B=1;B<14;B++){const H=E.y+(z-E.y)*B/14;n.beginPath(),n.moveTo(b,H),n.lineTo(b+P,H),n.stroke()}n.globalAlpha=1}}}n.strokeStyle=Pe.longarina,n.lineCap="butt";for(const x of[-1,1]){const y=o(x*xn*1.05,sr,0),A=o(x*xn*1.05,sr,.95);n.lineWidth=t*.03,n.beginPath(),n.moveTo(y.x,y.y),n.lineTo(A.x,A.y),n.stroke()}for(let x=17;x>=0;x--){const y=x*.052,A=yn(y),P=o(-xn*1.16,dh,y),C=o(xn*1.16,dh,y),D=Math.max(1,e*.05*A);n.fillStyle=Pe.vigaFrente,n.fillRect(P.x,P.y,C.x-P.x,D),n.fillStyle=Pe.vigaBaixo,n.fillRect(P.x,P.y+D*.62,C.x-P.x,D*.38)}const f=9;for(let x=0;x<f;x++){const y=.02+x*.095,A=y+.095,P=x%2===0?-1:1,C=o(P*xn*1.02,uh,y),D=o(-P*xn*1.02,uh,A),E=e*.06*yn(y),b=(C.x+D.x)/2,L=(C.y+D.y)/2+E;n.strokeStyle=Pe.fio,n.lineWidth=Math.max(.4,1.8*yn(y)),n.beginPath(),n.moveTo(C.x,C.y),n.quadraticCurveTo(b,L,D.x,D.y),n.stroke();const z=7;for(let B=0;B<=z;B++){const H=B/z,W=1-H,q=W*W*C.x+2*W*H*b+H*H*D.x,tt=W*W*C.y+2*W*H*L+H*H*D.y,Y=yn(y+(A-y)*H),st=.82+.18*Math.sin(i*1.6+x*2.1+B*.9);M_(n,q,tt+e*.012*Y,Math.max(.7,t*.015*Y),st)}}const g=n.createRadialGradient(bn.x*t,bn.y*e-e*.02,0,bn.x*t,bn.y*e-e*.02,t*.085);g.addColorStop(0,"rgba(255, 232, 182, 0.9)"),g.addColorStop(.35,"rgba(255, 196, 118, 0.34)"),g.addColorStop(1,"rgba(255, 180, 100, 0)"),n.fillStyle=g,n.fillRect(0,0,t,e);const M=Math.sin(i*2.4),m=o(0,dn,.66),p=e*.5*yn(.66);oa(n,m.x-p*.34,m.y,p,Sn.ariRoupa,Sn.ariCabelo,M),oa(n,m.x+p*.34,m.y,p,Sn.renanRoupa,Sn.renanCabelo,-M),n.fillStyle="rgba(255, 176, 96, 0.07)",n.fillRect(0,0,t,e);const S=n.createRadialGradient(t/2,e*.48,t*.2,t/2,e*.48,t*.78);S.addColorStop(0,"rgba(0, 0, 0, 0)"),S.addColorStop(1,"rgba(6, 9, 16, 0.62)"),n.fillStyle=S,n.fillRect(0,0,t,e)}function b_(n,t,e,i){const s=.585*e,a=n.createLinearGradient(0,0,0,s);a.addColorStop(0,Me.ceuTopo),a.addColorStop(1,Me.ceuBaixo),n.fillStyle=a,n.fillRect(0,0,t,s);for(const[S,x,y,A]of[[-.05,.5,.15,Me.mataLonge],[.42,1.05,.125,Me.mataLonge],[-.05,1.05,.08,Me.mataPerto]]){n.fillStyle=A,n.beginPath(),n.moveTo(S*t,s);for(let P=S;P<=x;P+=.035){const C=s-y*e*(.6+.4*Math.abs(Math.sin(P*27)));n.lineTo(P*t,C)}n.lineTo(x*t,s),n.closePath(),n.fill()}const r=.235*e;n.fillStyle=Me.inflavelClaro,n.beginPath(),n.moveTo(0*t,s),n.lineTo(.245*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,s),n.closePath(),n.fill(),n.fillStyle=Me.inflavelCinza,n.beginPath(),n.moveTo(0*t,s),n.lineTo(.245*t,r),n.lineTo(.315*t,r),n.lineTo(.14*t,s),n.closePath(),n.fill(),n.fillStyle=Me.inflavelCinza,n.beginPath(),n.moveTo(.235*t,r+.012*e),n.lineTo(.325*t,.175*e),n.lineTo(.412*t,r+.012*e),n.closePath(),n.fill(),n.fillStyle=Me.inflavelRosa,n.beginPath(),n.moveTo(.055*t,s-.075*e),n.lineTo(.47*t,s-.075*e),n.lineTo(.485*t,s-.035*e),n.lineTo(.04*t,s-.035*e),n.closePath(),n.fill(),n.fillStyle="rgba(112, 126, 138, 0.34)",n.beginPath(),n.moveTo(.325*t,r),n.lineTo(.4*t,r),n.lineTo(.5*t,s),n.lineTo(.33*t,s),n.closePath(),n.fill(),n.fillStyle="rgba(84, 95, 105, 0.5)",n.beginPath(),n.roundRect(.135*t,s-.075*e,.145*t,.04*e,.014*t),n.fill(),n.strokeStyle="rgba(138, 148, 156, 0.75)",n.lineWidth=Math.max(.8,e*.0045);for(let S=1;S<6;S++){const x=S/6;n.beginPath(),n.moveTo((.245+x*.155)*t,r),n.lineTo((0+x*.5)*t,s),n.stroke()}const c=.42*t,l=.425*e,h=.62*t,d=.075*e;n.fillStyle=Me.bannerFundo,n.fillRect(c,l,h,d),n.fillStyle=Me.bannerXadrez;const u=d/3;for(let S=0;S<h;S+=u)for(let x=0;x<d;x+=u)(S<u*2.2||S>h-u*5.5)&&Math.round(S/u+x/u)%2===0&&n.fillRect(c+S,l+x,u,u);n.fillStyle=Me.bannerRosa,n.fillRect(c+h-u*4.4,l,u*4.4,d),n.fillStyle="rgba(255, 255, 255, 0.85)";for(let S=0;S<3;S++)n.fillRect(c+h-u*4,l+d*(.25+S*.2),u*3.4,d*.08);x_(n,c+h-u*6.4,l+d*.46,d*.4),n.fillStyle=Me.bannerTexto,n.font=`900 ${Math.round(d*.42)}px system-ui, sans-serif`,n.textAlign="center",n.textBaseline="middle",n.fillText("ARRAIÁ",c+h*.42,l+d*.5),n.textAlign="left",n.textBaseline="alphabetic",Ns(n,.05*t,s-.055*e,.13*t,.055*e,Me.roxoBrinquedo,"#6f45a0"),Ns(n,.36*t,s-.085*e,.12*t,.085*e,Me.azulBrinquedo,Me.azulBrinquedoFundo),Ns(n,.47*t,s-.05*e,.06*t,.05*e,Me.amareloBrinquedo,"#cf9f0e"),Ns(n,.52*t,s-.075*e,.5*t,.075*e,Me.verdeBrinquedo,Me.verdeBrinquedoFundo),n.strokeStyle=Me.grade,n.lineWidth=Math.max(.7,e*.0035);for(let S=0;S<9;S++){const x=(.19+S*.019)*t;n.beginPath(),n.moveTo(x,s-.035*e),n.lineTo(x,s),n.stroke()}n.beginPath(),n.moveTo(.185*t,s-.032*e),n.lineTo(.36*t,s-.032*e),n.stroke(),n.strokeStyle=Me.torre,n.lineWidth=Math.max(1.2,t*.008),n.beginPath(),n.moveTo(.9*t,s+.3*e),n.lineTo(.955*t,s-.09*e),n.moveTo(1.02*t,s+.3*e),n.lineTo(.985*t,s-.09*e),n.stroke(),n.lineWidth=Math.max(.8,t*.005);for(let S=0;S<7;S++){const x=S/7,y=s-.09*e+x*.39*e,A=s-.09*e+(S+1)/7*.39*e,P=.955+x*(.9-.955),C=.985+x*(1.02-.985),D=.955+(S+1)/7*(.9-.955),E=.985+(S+1)/7*(1.02-.985);n.beginPath(),n.moveTo(P*t,y),n.lineTo(E*t,A),n.moveTo(C*t,y),n.lineTo(D*t,A),n.stroke()}const f=n.createLinearGradient(0,s,0,e);f.addColorStop(0,Me.gramaAlta),f.addColorStop(1,Me.gramaBaixa),n.fillStyle=f,n.fillRect(0,s,t,e-s),n.fillStyle="#c6b184",n.beginPath(),n.moveTo(0,s),n.lineTo(t,s),n.lineTo(t,s+.028*e);for(let S=1;S>=0;S-=.05)n.lineTo(S*t,s+(.026+.008*Math.sin(S*21))*e);n.closePath(),n.fill();const g=n.createRadialGradient(.44*t,.92*e,0,.44*t,.92*e,.62*t);g.addColorStop(0,"rgba(78, 100, 50, 0.34)"),g.addColorStop(.6,"rgba(78, 100, 50, 0.16)"),g.addColorStop(1,"rgba(78, 100, 50, 0)"),n.fillStyle=g,n.fillRect(0,s,t,e-s),n.fillStyle=Me.sombra,n.globalAlpha=.16;for(const[S,x,y,A,P]of[[.2,.87,.16,.045,.2],[.66,.9,.2,.05,-.15],[.38,.99,.3,.06,.05],[.86,.83,.13,.035,.3]])n.beginPath(),n.ellipse(S*t,x*e,y*t,A*e,P,0,Math.PI*2),n.fill();n.globalAlpha=1;const M=Math.sin(i*2.1),m=.185*e;oa(n,.4*t,.86*e,m,Sn.ariRoupa,Sn.ariCabelo,M,Sn.ariPele),oa(n,.49*t,.86*e,m,Sn.renanRoupa,Sn.renanCabelo,-M,Sn.renanPele),ar(n,-.04*t,.1*e,1.04*t,.045*e,.028*e,.05*e,15,0,i),ar(n,-.04*t,.235*e,1.04*t,.145*e,.03*e,.045*e,16,3,i),ar(n,-.04*t,.33*e,1.04*t,.3*e,.026*e,.038*e,18,6,i),n.fillStyle="rgba(255, 236, 180, 0.09)",n.fillRect(0,0,t,e);const p=n.createRadialGradient(t/2,e*.5,t*.3,t/2,e*.5,t*.85);p.addColorStop(0,"rgba(0, 0, 0, 0)"),p.addColorStop(1,"rgba(20, 30, 40, 0.3)"),n.fillStyle=p,n.fillRect(0,0,t,e)}const hc=[{id:"o-pedido",titulo:"O pedido",lugar:"onde a gente começou, oficialmente",legenda:"As luzinhas iam até onde a gente não enxergava mais. A gente foi junto.",proporcao:3/4,pintar:y_},{id:"arraia",titulo:"O arraiá da Hello Kitty",lugar:"Parque Villa-Lobos, em junho",legenda:"Um campo inteiro de brinquedo inflável, e a gente parado olhando com cara de criança.",proporcao:3/4,pintar:b_}],se={pratoSombra:"#e6dac4",sombra:"rgba(74, 52, 30, 0.16)",contorno:"#7a4a26",milho:"#e9c179",milhoTostado:"#cf9a48",milhoQueimado:"#a97530",queijo:"#fbe6a6",queijoBorda:"#e9c862",pao:"#e2a961",paoEscuro:"#c88b46",gergelim:"#f8ebcf",carne:"#7c4423",carneEscura:"#5e3018",alface:"#77c05a",tomate:"#e05a4c",batata:"#f2c14e",batataEscura:"#d9a02f",salsicha:"#d5654b",salsichaEscura:"#b04a34",ketchup:"#d63b34",mostarda:"#f0b429",maionese:"#fdf6e4",vidro:"rgba(255, 255, 255, 0.38)",vidroBorda:"#dfe9ee",morango:"#f2678c",morangoClaro:"#ff9ab4",manga:"#f6a83c",mangaClara:"#ffc76a",canudo:"#ff6f91",canudoManga:"#54b7c9",folha:"#4ea648"};function Jo(n,t){const e=n.createRadialGradient(t*.42,t*.36,t*.05,t*.5,t*.5,t*.62);e.addColorStop(0,"#fffaf0"),e.addColorStop(1,se.pratoSombra),n.fillStyle=e,n.fillRect(0,0,t,t),n.strokeStyle="rgba(122, 90, 48, 0.16)",n.lineWidth=t*.03,n.beginPath(),n.ellipse(t*.5,t*.5,t*.44,t*.44,0,0,Math.PI*2),n.stroke()}function Ko(n,t,e,i){n.fillStyle=se.sombra,n.beginPath(),n.ellipse(t,e,i,i*.34,0,0,Math.PI*2),n.fill()}function In(n,t,e,i,o,s){n.beginPath(),n.roundRect(t,e,i,o,s),n.fill()}function rr(n,t,e,i,o,s,a,r,c){n.strokeStyle=t,n.lineWidth=e,n.lineCap="round",n.lineJoin="round",n.beginPath();const l=r*2;for(let h=0;h<=l;h++){const d=h/l,u=i+(s-i)*d,f=o+(a-o)*d+(h%2?c:-c);h===0?n.moveTo(u,f):n.lineTo(u,f)}n.stroke()}function zd(n,t,e,i,o){const s=t*.3,a=t*.4,r=t*.24,c=t*.84;n.strokeStyle=o,n.lineWidth=t*.055,n.lineCap="round",n.beginPath(),n.moveTo(s+a*.62,c-t*.06),n.lineTo(s+a*.86,r-t*.12),n.stroke();const l=n.createLinearGradient(0,r,0,c);l.addColorStop(0,i),l.addColorStop(1,e),n.fillStyle=l,In(n,s+t*.02,r+t*.06,a-t*.04,c-r-t*.08,t*.06),n.fillStyle=se.vidro,In(n,s,r,a,c-r,t*.07),n.strokeStyle=se.vidroBorda,n.lineWidth=t*.028,n.beginPath(),n.roundRect(s,r,a,c-r,t*.07),n.stroke(),n.fillStyle="rgba(255,255,255,0.6)",In(n,s+t*.05,r+t*.1,t*.05,c-r-t*.26,t*.03)}function Od(n,t){Jo(n,t),Ko(n,t*.5,t*.72,t*.3),n.fillStyle=se.milhoTostado,n.beginPath(),n.ellipse(t*.5,t*.53,t*.31,t*.29,0,0,Math.PI*2),n.fill(),n.fillStyle=se.milho,n.beginPath(),n.ellipse(t*.5,t*.5,t*.3,t*.28,0,0,Math.PI*2),n.fill(),n.strokeStyle=se.contorno,n.globalAlpha=.35,n.lineWidth=t*.022,n.beginPath(),n.ellipse(t*.5,t*.5,t*.3,t*.28,0,0,Math.PI*2),n.stroke(),n.globalAlpha=1,n.fillStyle=se.milhoQueimado,n.globalAlpha=.35;for(const[e,i,o]of[[-.12,-.1,.06],[.14,-.04,.05],[-.02,.13,.055]])n.beginPath(),n.ellipse(t*(.5+e),t*(.5+i),t*o,t*o*.7,.4,0,Math.PI*2),n.fill();n.globalAlpha=1,n.strokeStyle=se.milhoQueimado,n.lineWidth=t*.03,n.beginPath(),n.ellipse(t*.5,t*.5,t*.3,t*.28,0,.15,Math.PI-.15),n.stroke(),n.fillStyle=se.queijoBorda,n.beginPath(),n.ellipse(t*.5,t*.68,t*.24,t*.09,0,Math.PI,Math.PI*2),n.fill(),n.fillStyle=se.queijo,n.beginPath(),n.ellipse(t*.5,t*.67,t*.22,t*.075,0,Math.PI,Math.PI*2),n.fill(),n.fillStyle=se.queijo,n.beginPath(),n.ellipse(t*.6,t*.73,t*.035,t*.055,0,0,Math.PI*2),n.fill()}function S_(n,t){Od(n,t),n.strokeStyle=se.carne,n.lineWidth=t*.035,n.lineCap="round";for(const[e,i]of[[-.12,0],[-.02,.03],[.08,0]])n.beginPath(),n.moveTo(t*(.5+e),t*(.64+i)),n.lineTo(t*(.5+e+.09),t*(.68+i)),n.stroke();n.fillStyle=se.folha,n.beginPath(),n.ellipse(t*.36,t*.62,t*.07,t*.04,-.5,0,Math.PI*2),n.fill()}function Fd(n,t,e=2){Jo(n,t),Ko(n,t*.44,t*.78,t*.28);for(const[l,[h,d,u]]of[[.72,.5,-.35],[.79,.55,-.1],[.68,.6,.25]].entries())n.save(),n.translate(t*h,t*d),n.rotate(u),n.fillStyle=l===1?se.batataEscura:se.batata,In(n,-t*.035,-t*.16,t*.07,t*.32,t*.03),n.restore();const i=t*.44,o=t*.5,s=i-o/2;let a=t*.76;const r=(l,h,d=0)=>{a-=l,n.fillStyle=h,In(n,s-d,a,o+d*2,l,l*.45)};n.fillStyle=se.paoEscuro,In(n,s,a-t*.09,o,t*.09,t*.03),a-=t*.09;for(let l=0;l<e;l++)r(t*.085,l%2?se.carneEscura:se.carne,t*.015),a-=t*.045,n.fillStyle=se.queijo,n.beginPath(),n.moveTo(s-t*.035,a),n.lineTo(s+o+t*.035,a),n.lineTo(s+o+t*.03,a+t*.05),n.lineTo(s+o*.7,a+t*.03),n.lineTo(s+o*.42,a+t*.075),n.lineTo(s+o*.16,a+t*.03),n.lineTo(s-t*.03,a+t*.055),n.closePath(),n.fill();a-=t*.05,n.fillStyle=se.alface,n.beginPath(),n.moveTo(s-t*.05,a+t*.05);for(let l=0;l<=8;l++){const h=l/8;n.lineTo(s-t*.05+(o+t*.1)*h,a+(l%2?t*.012:t*.05))}n.lineTo(s+o+t*.05,a+t*.05),n.closePath(),n.fill();const c=a-t*.005;n.fillStyle=se.pao,n.beginPath(),n.ellipse(i,c,o/2,t*.15,0,Math.PI,Math.PI*2),n.fill(),n.fillStyle=se.gergelim;for(const[l,h]of[[-.13,-.06],[-.02,-.09],[.1,-.055],[.05,-.02]])n.beginPath(),n.ellipse(i+t*l,c+t*h,t*.022,t*.013,.5,0,Math.PI*2),n.fill()}function w_(n,t){Fd(n,t,1),n.fillStyle=se.tomate,n.beginPath(),n.ellipse(t*.24,t*.44,t*.06,t*.03,-.2,0,Math.PI*2),n.fill()}function E_(n,t){Jo(n,t),Ko(n,t*.5,t*.74,t*.32),n.save(),n.translate(t*.5,t*.55),n.rotate(-.22),n.fillStyle=se.paoEscuro,In(n,-t*.36,-t*.09,t*.72,t*.22,t*.11),n.fillStyle=se.pao,In(n,-t*.36,-t*.11,t*.72,t*.18,t*.09),n.fillStyle=se.salsichaEscura,In(n,-t*.4,-t*.115,t*.8,t*.11,t*.055),n.fillStyle=se.salsicha,In(n,-t*.4,-t*.125,t*.8,t*.095,t*.05),rr(n,se.mostarda,t*.032,-t*.32,-t*.06,t*.32,-t*.06,4,t*.022),rr(n,se.ketchup,t*.032,-t*.3,-t*.02,t*.3,-t*.02,4,t*.022),rr(n,se.maionese,t*.028,-t*.28,-t*.1,t*.28,-t*.1,4,t*.018),n.strokeStyle=se.batata,n.lineWidth=t*.018,n.lineCap="round";for(const[e,i,o]of[[-.24,-.13,.5],[-.1,-.15,-.4],[.04,-.13,.6],[.18,-.15,-.3],[-.17,-.16,-.6],[.26,-.12,.35]])n.beginPath(),n.moveTo(t*e,t*i),n.lineTo(t*(e+Math.cos(o)*.09),t*(i+Math.sin(o)*.09)),n.stroke();n.restore()}function T_(n,t){Jo(n,t),Ko(n,t*.5,t*.85,t*.26),zd(n,t,se.morango,se.morangoClaro,se.canudo),n.fillStyle="#e34b6d",n.beginPath(),n.moveTo(t*.26,t*.24),n.bezierCurveTo(t*.16,t*.24,t*.16,t*.36,t*.26,t*.4),n.bezierCurveTo(t*.36,t*.36,t*.36,t*.24,t*.26,t*.24),n.fill(),n.fillStyle=se.folha,n.beginPath(),n.ellipse(t*.26,t*.24,t*.06,t*.025,0,0,Math.PI*2),n.fill(),n.fillStyle="rgba(255,255,255,0.75)";for(const[e,i]of[[.62,.42],[.66,.56],[.6,.68]])n.beginPath(),n.ellipse(t*e,t*i,t*.017,t*.028,0,0,Math.PI*2),n.fill()}function A_(n,t){Jo(n,t),Ko(n,t*.5,t*.85,t*.26),zd(n,t,se.manga,se.mangaClara,se.canudoManga),n.fillStyle="#f6e7b8",n.beginPath(),n.ellipse(t*.28,t*.3,t*.075,t*.075,0,0,Math.PI*2),n.fill(),n.strokeStyle="#e0cd92",n.lineWidth=t*.018,n.beginPath(),n.ellipse(t*.28,t*.3,t*.075,t*.075,0,0,Math.PI*2),n.stroke(),n.fillStyle="#d9c489";for(let e=0;e<3;e++){const i=e/3*Math.PI*2+.6;n.beginPath(),n.ellipse(t*(.28+Math.cos(i)*.026),t*(.3+Math.sin(i)*.026),t*.012,t*.012,0,0,Math.PI*2),n.fill()}n.fillStyle=se.manga,n.beginPath(),n.ellipse(t*.74,t*.32,t*.055,t*.09,.5,0,Math.PI*2),n.fill()}const Bd=[{titulo:"Arepas",nota:"na chapa, servidas quentes — a casa vive delas",pratos:[{id:"arepa-queijo",nome:"Arepa de queijo",preco:"R$ 18",descricao:"Massa de milho na chapa até criar casquinha, aberta ainda quente e recheada de queijo branco que escorre antes de você conseguir morder.",selo:"o favorito do Ari",pintar:Od},{id:"arepa-recheada",nome:"Arepa recheada",preco:"R$ 26",descricao:"A mesma arepa, agora com carne desfiada macia, queijo e abacate em fatias finas por cima.",pintar:S_}]},{titulo:"Hambúrgueres",nota:"todos com batata frita dourada, sem exceção",pratos:[{id:"duplo-queijo",nome:"Duplo Burger com Queijo",preco:"R$ 34",descricao:"Dois discos de carne selados na chapa, duas fatias de queijo derretendo entre eles, alface crocante e pão de gergelim. Com batata frita.",pintar:(n,t)=>Fd(n,t,2)},{id:"quarteirao",nome:"Quarteirão com Queijo",preco:"R$ 30",descricao:"Um disco só, mas do tamanho do pão inteiro, com queijo, tomate e aquele pão macio que amassa na mão. Com batata frita.",pintar:w_}]},{titulo:"Perros Calientes",nota:"do jeito tradicional, transbordando",pratos:[{id:"perro-tradicional",nome:"Perro Caliente Tradicional",preco:"R$ 24",descricao:"Salsicha grelhada sobrando dos dois lados do pão, os três molhos em zigue-zague e uma montanha de batata palha por cima.",pintar:E_}]},{titulo:"Bebidas",nota:"geladas, saindo do liquidificador",pratos:[{id:"suco-morango",nome:"Suco de morango",preco:"R$ 12",descricao:"Morango batido na hora, bem gelado, com o copo suando do lado de fora.",pintar:T_},{id:"smoothie-manga-banana",nome:"Smoothie de manga com banana",preco:"R$ 15",descricao:"Manga madura e banana batidas juntas até ficar grosso o bastante para o canudo reclamar.",pintar:A_}]}];function P_(n){for(const t of Bd){const e=t.pratos.find(i=>i.id===n);if(e)return e}return null}class C_{constructor(t,e,i,o=Object.keys(e)[0]){this.root=t,this.scenes=e,this.dupla=i,this.cenaInicial=o,this.renderer=new fd({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=wh,t.appendChild(this.renderer.domElement),this.ui=new Vv(t),this.previa=new p_(this.ui.canvasDoBoneco()),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onTouchGirar=a=>this.input.tapGirar(a),this.ui.onEscolherSlot=a=>this.setActiveHandSlot(a),this.ui.onMoverItem=(a,r)=>this.moveItem(a,r),this.ui.onDescartar=a=>this.descartarDaVaga(a),this.ui.onAbrirMochila=()=>this.pintarMochila(),this.ui.onAbrirArmario=()=>this.pintarArmario(),this.ui.onGirarBoneco=a=>this.previa.girar(a),this.ui.onTirarParte=a=>{this.tirarPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onVestirPeca=a=>{this.vestirPeca(this.playerId(),a)&&(this.audio.play("escolha"),this.pintarArmario())},this.ui.onAbrirVestiario=()=>this.pintarVestiario(),this.ui.onAlternarOculos=()=>{const a=this.playerId(),r=mn.indexOf("cabeca");(this.save.vestiveis(a)[r]?.id===te.oculosEscuros.id?this.tirarPeca(a,r):this.vestirPeca(a,te.oculosEscuros.id))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onEscolherBermuda=a=>{const r=this.playerId(),c=mn.indexOf("pernas");(this.save.vestiveis(r)[c]?.id===a?this.tirarPeca(r,c):this.vestirPeca(r,a))&&this.audio.play("escolha"),this.pintarVestiario()},this.ui.onTouchHold=a=>this.input.setVirtualDown("KeyF",a),this.ui.onRestart=()=>this.restart(),this.ui.som=a=>this.audio.play(a),this.ui.onToggleSom=()=>{this.audio.setMudo(this.audio.ligado),this.ui.setSom(this.audio.ligado),this.audio.ligado&&this.audio.play("menu")},this.ui.setSom(this.audio.ligado),this.input=new W1(this.renderer.domElement),this.hemi=new rd(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new Qr(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const s=this.sun.shadow.camera;s.left=-22,s.right=22,s.top=22,s.bottom=-22,s.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new Hv(new lc(i[0])),this.scene.add(this.player.object),this.coracoes=new Wv(this.scene),this.beijo=new $v(this.coracoes),this.beijo.onSom=a=>this.audio.play(a),this.maos=new n_(this.coracoes),this.maos.onSom=a=>this.audio.play(a),this.parceiro=new Gv(new lc(i[1]??i[0])),this.parceiro.setVisible(i.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new Xh;iso=new q1;input;ui;save=new Fc;previa;player;parceiro;clock=new rp;coracoes;beijo;maos;audio=new h_;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;naMao=new Map;trilha=0;elapsed=0;shadowSpan=0;traje="normal";moveDir=new N;camAim=new N;camOmbro=null;async start(t,e){const i=t??(this.scenes[this.save.scene]?this.save.scene:this.cenaInicial);this.build(i,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}restart(){this.save.reset(),this.ui.setMemories(this.save.memories),this.player.rig.spec.id!==this.dupla[0].id&&this.swapCharacters(),this.ui.showHints(),this.goTo(this.cenaInicial),this.audio.play("recomecar"),this.ui.toast("Do começo, então","🔄")}build(t,e){const i=this.scenes[t];if(!i)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const o=new g_(this);o.setSeed(R_(t)),i.build(o),this.scene.add(o.root),this.current={def:i,world:o},this.applyAmbient(i.ambient);const s=e&&i.entries?.[e]||i.spawn;this.player.teleport(s.x,s.z,s.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const a=(s.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(s.x+Math.sin(a)*1.3,s.z+Math.cos(a)*1.3,s.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.maos.soltar(this.player,this.parceiro),this.coracoes.limpar(),this.podeBeijar=!1,this.camOmbro=null,this.ui.showPlacar(null),this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(i.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(i.name,i.subtitle),this.audio.setClima(t),this.migrarPremios(),this.aplicarPremios(),this.save.scene=t}aplicarPremios(){this.sincronizarVestiveis()}migrarPremios(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id;this.save.flag(`chapeu-ping-pong:${e}`)&&(this.save.achouItem(e,te.chapeuPingPong.id)||this.save.vestir(e,te.chapeuPingPong))}}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new le(t.sky),this.scene.fog=t.fog!==void 0?new Ac(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const i=this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen||this.ui.memoriasOpen||this.ui.cardapioOpen||this.transitioning;this.input.blocked=i||this.player.locked,this.input.justPressed("KeyJ")&&!this.ui.menuOpen&&this.ui.toggleJournal(),(this.input.justPressed("KeyI")||this.input.justPressed("Tab"))&&!this.ui.menuOpen&&!this.ui.dialogueOpen&&(this.ui.armarioOpen?this.ui.fecharArmario():this.ui.mochilaOpen?this.ui.closeMochila():this.abrirMochila()),this.ui.armarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharArmario(),this.ui.vestiarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharVestiario(),this.ui.memoriasOpen&&this.input.justPressed("Escape")&&this.ui.fecharMemorias(),this.ui.cardapioOpen&&this.input.justPressed("Escape")&&this.ui.fecharCardapio(),this.ui.memoriasOpen&&(this.input.justPressed("ArrowLeft")&&this.ui.folhear(-1),this.input.justPressed("ArrowRight")&&this.ui.folhear(1)),(this.ui.mochilaOpen||this.ui.armarioOpen||this.ui.vestiarioOpen?!this.ui.dialogueOpen&&!this.ui.menuOpen&&!this.transitioning:!i)&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),i||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1)),!i&&!this.player.locked&&this.input.justPressed("KeyH")&&this.maoNaMao();const a=this.input.justPressed("KeyE")||this.input.justPressed("Space");a&&this.ui.handleAction()||(a&&!i&&this.hot&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.audio.play("interagir"),this.hot.trigger(this)):a&&!i&&this.podeBeijar&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)):a&&!i&&!this.player.locked&&this.maoNaMao()),this.beijo.update(t,this.player,this.parceiro),this.maos.update(t,this.player,this.parceiro);const r=this.input.move();this.iso.screenToWorld(r.x,r.y,this.moveDir);const c=this.player.position.clone();this.player.update(this.moveDir,t,e.colliders,e.bounds),this.ouvirPassos(c),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.coracoes.update(t),this.sincronizarMaos(),this.sincronizarVestiveis(),this.updateHot(e,t),this.updateBeijo();for(const d of e.updaters)d(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const l=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(l);const h=l/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*h,this.camAim.y+20*h,this.camAim.z+9*h),this.renderer.render(this.scene,this.camOmbro??this.iso.camera),this.ui.armarioOpen&&(this.previa.update(t),this.previa.desenhar()),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.ui.menuOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro)}maoNaMao(){this.maos.ativo?(this.maos.soltar(this.player,this.parceiro),this.audio.play("escolha")):this.maos.disponivel(this.player,this.parceiro)&&this.maos.ligar(this.player,this.parceiro)}ouvirPassos(t){if(this.player.riding||this.player.locked)return;const e=Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z);if(e<5e-4){this.trilha=0;return}this.trilha+=e;const i=this.player.submersion>.05?1.05:.62;this.trilha>=i&&(this.trilha=0,this.audio.play(this.player.submersion>.05?"nadar":"passo"))}updateHot(t,e){let i=null,o=1/0,s=-1/0;const a=this.player.position.x,r=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(a,r);l>c.radius||c.priority<s||c.priority===s&&l>=o||(i=c,o=l,s=c.priority)}i!==this.hot&&(this.hot?.setHot(!1),i?.setHot(!0),this.hot=i,i&&!this.player.locked?this.ui.showPrompt(i.icon,i.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,i){return this.ui.ask(t,e,i??this.player.name)}toast(t,e){this.audio.play("toast"),this.ui.toast(t,e)}som(t){this.audio.play(t)}goTo(t,e){this.transitioning||(this.transitioning=!0,this.audio.play("porta"),(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setCameraOmbro(t,e){if(!t){this.camOmbro=null;return}this.camOmbro||(this.camOmbro=new sn(58,window.innerWidth/window.innerHeight,.1,400)),this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.position.copy(t),e&&this.camOmbro.lookAt(e),this.camOmbro.updateProjectionMatrix()}pointer(){return this.input.pointer()}showPlacar(t){this.ui.showPlacar(t)}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}addItem(t,e=this.playerId()){const i=this.save.pegar(e,t);return i==="cheio"&&this.ui.toast("Mochila cheia","🎒"),(i==="mao"||i==="guardado")&&this.repintarMochila(),i}storeItem(t,e=this.playerId()){const i=this.save.guardar(e,t);return i!=="cheio"&&i!=="repetido"&&this.repintarMochila(),i}removeItem(t,e=this.playerId()){const i=this.save.largar(e,t);return i&&this.repintarMochila(),i}hasItem(t,e=this.playerId()){return this.save.achouItem(e,t)}getActiveHandItem(t=this.playerId()){return this.save.itemAtivo(t)}setActiveHandSlot(t,e=this.playerId()){this.save.setSlotAtivo(e,t),this.repintarMochila()}activeHandSlot(t=this.playerId()){return this.save.slotAtivo(t)}equipWearable(t,e=this.playerId()){const i=this.save.vestir(e,t);return i&&this.repintarMochila(),i}unequipWearable(t,e=this.playerId()){this.save.despir(e,t),this.repintarMochila()}moveItem(t,e,i=this.playerId()){const o=this.save.mover(i,t,e);return o&&this.repintarMochila(),o}handItems(t=this.playerId()){return this.save.maos(t)}wearables(t=this.playerId()){return this.save.vestiveis(t)}wardrobeItems(t=this.playerId()){return this.save.acervo(t)}descartarDaVaga(t){const e=this.playerId(),o=(t.lista==="mao"?this.save.maos(e):this.save.vestiveis(e))[t.indice];o&&(this.save.largar(e,o.id),this.audio.play("escolha"),this.ui.toast(`${o.nome} foi descartado`,"🗑"),this.pintarMochila())}repintarMochila(){this.ui.mochilaOpen&&this.pintarMochila()}pintarMochila(){const t=this.playerId();this.ui.renderMochila(this.save.maos(t),this.save.vestiveis(t),this.save.slotAtivo(t),this.player.name)}abrirMochila(){this.ui.toggleMochila()}sincronizarVestiveis(){for(const t of[this.player,this.parceiro]){const e=t.rig.spec.id,i=this.save.vestiveis(e),o=i.some(c=>c?.id===te.chapeuPingPong.id);t.rig.campeao!==o&&t.rig.setCampeao(o);const s=i.some(c=>c?.id===te.patins.id);t.patins=s,t.rig.setPatins(s);const a=this.save.loadout(e),r=mn.map(c=>a[c]??"").join("|");this.roupaAplicada.get(e)!==r&&(this.roupaAplicada.set(e,r),t.rig.vestirRoupa(a))}}sincronizarMaos(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id,i=this.save.itemAtivo(e),o=i?.id??null;this.naMao.get(e)!==o&&(this.naMao.set(e,o),t.segurar(o?Fv(o):null,i?.holdPose??"none"))}}roupaAplicada=new Map;vestirPeca(t,e){const i=this.save.acervo(t).find(a=>a.id===e)??this.save.maos(t).find(a=>a?.id===e)??null;if(!i)return!1;const o=i.slot?mn.indexOf(i.slot):-1;if(o<0)return!1;const s=this.save.vestiveis(t)[o];return this.save.largar(t,e),s&&this.save.despir(t,o),this.save.vestir(t,i),s&&this.save.guardar(t,s),!0}tirarPeca(t,e){const i=this.save.vestiveis(t)[e];return i?(this.save.despir(t,e),this.save.guardar(t,i)==="cheio"?(this.save.vestir(t,i),this.ui.toast("Mochila cheia","🎒"),!1):!0):!1}abrirGuardaRoupa(){this.previa.mostrar(this.player.rig.spec),this.pintarArmario(),this.ui.abrirArmario()}pintarArmario(){const t=this.playerId(),e=this.save.vestiveis(t),i=[...this.save.acervo(t),...this.save.maos(t).filter(o=>o!==null&&o.tipo==="vestivel")];this.ui.renderArmario(e,i,this.player.name),this.previa.vestir(this.save.loadout(t))}abrirVestiario(){this.pintarVestiario(),this.ui.abrirVestiario()}pintarVestiario(){const t=this.playerId(),e=this.save.vestiveis(t),i=e[mn.indexOf("cabeca")],o=e[mn.indexOf("pernas")],s=a=>`#${a.toString(16).padStart(6,"0")}`;this.ui.renderVestiario({dono:this.player.name,oculos:i?.id===te.oculosEscuros.id,bermudas:Rd.filter(a=>this.save.achouItem(t,a.id)).map(a=>({id:a.id,nome:a.nome,cor:s(a.corBanho??16777215),faixa:a.estampaBanho===void 0?void 0:s(a.estampaBanho),vestida:o?.id===a.id}))})}abrirMemoria(t){const e=hc.findIndex(i=>i.id===t);e>=0&&this.ui.abrirMemorias(hc,e)}abrirCardapio(){return this.ui.abrirCardapio(Bd)}unlock(t){this.save.addMemory(t)&&(this.audio.play("memoria"),this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,i=Math.PI/4){this.player.teleport(t,e,i),this.parceiro.teleport(t-1.2,e-.4,i),this.iso.snapTo(this.player.chest)}get telaDeLeitura(){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.memoriasOpen}keyPressed(t){return this.telaDeLeitura||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.telaDeLeitura||this.player.locked?!1:this.input.isDown(t)}showCharge(t,e,i){this.audio.carga(t),this.ui.showCharge(t,e,i)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.riding?(this.player.object.updateWorldMatrix(!0,!1),this.player.object.getWorldPosition(new N)):this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}playerId(){return this.player.rig.spec.id}companionId(){return this.parceiro.rig.spec.id}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.riding?(this.parceiro.object.updateWorldMatrix(!0,!1),this.parceiro.object.getWorldPosition(new N)):this.parceiro.position.clone()}companionFacing(){return this.parceiro.rig.facing}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.maos.trocouCorpos(this.player,this.parceiro),this.audio.play("trocar"),this.ui.toast(`Agora você é ${this.player.name}`,"🔁"),this.ui.mochilaOpen&&this.pintarMochila(),this.ui.armarioOpen&&(this.previa.mostrar(this.player.rig.spec),this.pintarArmario()),this.ui.vestiarioOpen&&this.pintarVestiario()}submergePlayer(t){this.player.submersion=Ne.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=Ne.clamp(t,0,1)}rideCompanion(t,e,i=1,o=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(i),this.parceiro.rig.group.rotation.y=o,this.parceiro.rig.setFacing(o),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}holdCompanion(t,e){this.parceiro.hold(t,e)}setSitting(t){if(t&&this.audio.play("sentar"),this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t),!t){this.maos.ativo||(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0));return}const e=this.player.rig.group,i=this.parceiro.rig.group;e.updateWorldMatrix(!0,!1),i.updateWorldMatrix(!0,!1);const o=new N,s=new N;e.getWorldPosition(o),i.getWorldPosition(s);const r=new N(1,0,0).applyQuaternion(e.getWorldQuaternion(new ho)).dot(s.sub(o))<0?-1:1;this.player.rig.setHoldingHands(r),this.parceiro.rig.setHoldingHands(r===1?-1:1)}setLying(t){t&&this.audio.play("sentar"),this.player.rig.setLying(t),this.parceiro.rig.setLying(t),!t&&!this.maos.ativo&&(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0))}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,i=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,i)}ridePlayer(t,e,i=1,o=Math.PI){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(i),this.player.rig.group.rotation.y=o,this.player.rig.setFacing(o),this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,i=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,i),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight),this.camOmbro&&(this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.updateProjectionMatrix())};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function R_(n){let t=2166136261;for(let e=0;e<n.length;e++)t^=n.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function dc(n=3,t=2.2,e=_.rug){const i=new v(new O(n,.04,t),w(e));return i.position.y=.02,i.receiveShadow=!0,i}function I_(n=_.sofa,t=2.2){const e=new ct,i=new v(new O(t,.42,.9),w(n));i.position.y=.28,e.add(i);const o=new v(new O(t,.62,.24),w(n));o.position.set(0,.72,-.35),e.add(o);for(const a of[-1,1]){const r=new v(new O(.24,.5,.9),w(n));r.position.set(a*(t/2-.12),.62,0),e.add(r)}for(const[a,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new v(new nt(.05,.04,.14,6),w(_.woodDark));c.position.set(a*(t/2-.2),.07,r*.34),e.add(c)}const s=new v(new O(.36,.12,.34),w(_.flowerPink));return s.position.set(t/2-.5,.55,-.14),s.rotation.set(.9,.4,0),e.add(s),e}function D_(){const n=new ct,t=new v(new O(1.2,.08,.7),w(_.wood));t.position.y=.46,n.add(t);for(const[e,i]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const o=new v(new nt(.04,.04,.46,6),w(_.woodDark));o.position.set(e*.5,.23,i*.27),n.add(o)}return n}function L_(n=!1){const t=new ct,e=new v(new O(1.8,.5,.45),w(_.woodDark));e.position.y=.25,t.add(e);const i=new v(new O(1.5,.85,.08),w(2040361));i.position.y=.95,t.add(i);const o=new v(new ze(1.36,.72),Ye(n?9426943:_.screen,1));return o.name="tela",o.position.set(0,.95,.05),t.add(o),t}function U_(n=2.1,t=1.2,e=_.woodDark){const i=new ct;i.userData.peca="estante";const o=.32,s=.04,a=new v(new O(t-s,n-.02,s),w(_.estanteFundo));a.position.set(0,n/2,-o/2-.005),i.add(a);for(const h of[-1,1]){const d=new v(new O(s,n,o),w(e));d.position.set(h*(t-s)/2,n/2,0),i.add(d)}const r=Math.max(2,Math.floor(n/.5)),c=n/r;for(let h=0;h<=r;h++){const d=new v(new O(t-s*2,s,o),w(e)),u=h===0?s/2:h===r?n-s/2:c*h;d.position.set(0,u,0),i.add(d)}const l=[_.metalRed,_.fabricBlue,_.gold,_.bush,_.flowerPink];for(let h=0;h<r;h++){const d=c*h+s/2,f=c*(h+1)-s/2-d;let g=-t/2+s+.03,M=0;const m=t/2-s-.03;for(;M<7;){const p=.05+(h*3+M*5)%4*.018,S=Math.min(f*.92,.26+(h+M*2)%4*.035);if(g+p>m)break;const x=M>=3&&g+p+S*.5>m,y=new v(new O(p,S,.17),w(l[(h*2+M)%l.length]));y.position.set(0,S/2,.02),y.userData.livro=!0;const A=new ct;A.position.set(g+p/2,d,0),x&&(A.rotation.z=-.42),A.add(y),i.add(A),g+=x?p+S*.42:p+.012,M++}}return i}function N_(n=_.fabricBlue){const t=new ct,e=new v(new O(1.5,.35,2.1),w(_.woodDark));e.position.y=.2,t.add(e);const i=new v(new O(1.44,.24,2),w(16184040));i.position.y=.49,t.add(i);const o=new v(new O(1.5,.14,1.35),w(n));o.position.set(0,.62,.3),t.add(o);const s=new v(new O(1,.16,.4),w(16777215));s.position.set(0,.66,-.72),t.add(s);const a=new v(new O(1.55,.7,.12),w(_.wood));return a.position.set(0,.6,-1.06),t.add(a),t}function z_(){const n=new ct,t=new v(new O(1.6,.08,.7),w(_.wood));t.position.y=.74,n.add(t);for(const s of[-.72,.72]){const a=new v(new O(.08,.74,.66),w(_.woodDark));a.position.set(s,.37,0),n.add(a)}const e=new v(new O(.8,.5,.06),w(2830136));e.position.set(0,1.08,-.18),n.add(e);const i=new v(new ze(.72,.42),Ye(10475775));i.position.set(0,1.08,-.14),n.add(i);const o=new v(new nt(.05,.12,.24,8),w(2830136));return o.position.set(0,.86,-.18),n.add(o),n}function uc(n=_.wood){const t=new ct,e=new v(new O(.5,.08,.5),w(n));e.position.y=.46,t.add(e);const i=new v(new O(.5,.55,.07),w(n));i.position.set(0,.75,-.22),t.add(i);for(const[o,s]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new v(new O(.06,.46,.06),w(_.woodDark));a.position.set(o*.2,.23,s*.2),t.add(a)}return t}function O_(n=2.4){const t=new ct,e=new v(new O(n,.9,.65),w(_.wallMint));e.position.y=.45,t.add(e);const i=new v(new O(n+.08,.08,.72),w(_.concrete));i.position.y=.94,t.add(i);const o=new v(new O(.5,.06,.4),w(_.metalWhite));return o.position.set(n/2-.55,.97,0),t.add(o),t}function F_(){const n=new ct,t=new v(new O(.8,1.8,.7),w(_.metalWhite));t.position.y=.9,n.add(t);const e=new v(new O(.82,.03,.72),w(_.metalGrey));e.position.y=1.25,n.add(e);for(const i of[.7,1.45]){const o=new v(new O(.05,.3,.05),w(_.metalGrey));o.position.set(.3,i,.37),n.add(o)}return n}function fc(n=1){const t=new ct,e=new v(new nt(.22*n,.17*n,.34*n,10),w(_.plantPot));e.position.y=.17*n,t.add(e);for(let i=0;i<5;i++){const o=i/5*Math.PI*2,s=new v(new It(.2*n,8,6),w(i%2?_.leafMid:_.leafLight));s.scale.set(.5,1.5,.5),s.position.set(Math.cos(o)*.12*n,.6*n,Math.sin(o)*.12*n),s.rotation.z=Math.cos(o)*.4,s.rotation.x=-Math.sin(o)*.4,t.add(s)}return t}function pc(n=.7,t=.55,e=_.skyDusk){const i=new ct,o=new v(new O(n,t,.05),w(_.woodDark));i.add(o);const s=new v(new ze(n-.1,t-.1),Ye(e,1,!0));return s.position.z=.03,s.renderOrder=1,i.add(s),i}function B_(n=1.3,t=1){const e=new ct,i=new v(new O(n,t,.05),w(_.woodDark));e.add(i);const o=new v(new ze(n-.1,t-.1),Ye(_.cortica,1,!0));o.position.z=.03,o.renderOrder=1,e.add(o);for(let r=0;r<14;r++){const c=new v(new ze(.018,.018),Ye(_.corticaEscura,1,!0));c.renderOrder=2,c.position.set((r*37%100/100-.5)*(n-.24),(r*61%100/100-.5)*(t-.24),.035),e.add(c)}const s=[[-.3,.2,.34,.28,.06,_.skyDusk],[.26,.24,.3,.26,-.09,_.water],[-.24,-.22,.3,.26,-.05,_.flowerPink],[.3,-.2,.32,.24,.08,_.leafMid]],a=[_.heart,_.gold,_.frisbee,_.heart];return s.forEach(([r,c,l,h,d,u],f)=>{const g=new ct,M=new v(new ze(l,h),Ye(_.metalWhite,1,!0));M.renderOrder=3,g.add(M);const m=new v(new ze(l-.06,h-.1),Ye(u,1,!0));m.position.set(0,.02,.002),m.renderOrder=4,g.add(m);const p=new v(new It(.018,8,6),w(a[f]));p.position.set(0,h/2-.03,.012),g.add(p),g.position.set(r,c,.04),g.rotation.z=d,e.add(g)}),e}function kd(n=1.2,t=1.2){const e=new ct,i=new v(new ze(n,t),Ye(_.glass,.55));e.add(i);const o=new v(new O(n+.12,.08,.08),w(_.metalWhite));o.position.y=t/2,e.add(o);const s=o.clone();s.position.y=-t/2,e.add(s);for(const a of[-1,1]){const r=new v(new O(.08,t,.08),w(_.metalWhite));r.position.x=a*n/2,e.add(r)}return e}function k_(n=16777215){const t=new ct,e=new v(new nt(.07,.06,.13,10),w(n));e.position.y=.065,t.add(e);const i=new v(new ge(.045,.014,6,12),w(n));return i.position.set(.08,.07,0),i.rotation.y=Math.PI/2,t.add(i),t}function V_(n=1.5,t=.9){const e=new ct,i=new v(new O(n,.09,t),w(_.wood));i.position.y=.75,e.add(i);for(const[s,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new v(new O(.08,.75,.08),w(_.woodDark));r.position.set(s*(n/2-.14),.37,a*(t/2-.14)),e.add(r)}const o=new v(new nt(.07,.09,.16,10),w(_.wallMint));o.position.y=.87,e.add(o);for(const s of[-1,1]){const a=new v(new It(.06,8,6),w(s<0?_.flowerPink:_.flowerYellow));a.position.set(s*.05,1.03,0),e.add(a)}return e}function H_(n=!0){const t=new ct,e=new v(new nt(.2,.24,.06,12),w(_.woodDark));e.position.y=.03,t.add(e);const i=new v(new nt(.03,.03,1.5,8),w(_.metalGrey));i.position.y=.78,t.add(i);const o=new v(new nt(.22,.3,.34,14,1,!0),w(n?16773324:15130320,{glow:n?.5:0,doubleSide:!0}));return o.position.y=1.68,t.add(o),t}function mc(n=1.1){const t=new ct,e=new v(new O(n,.06,.24),w(_.wood));t.add(e);const i=[14245951,6074447,16763213];for(let s=0;s<3;s++){const a=new v(new O(.1,.24,.16),w(i[s]));a.position.set(-n/2+.2+s*.16,.15,0),t.add(a)}const o=new v(new It(.13,10,8),w(_.leafMid));return o.position.set(n/2-.22,.16,0),o.scale.y=.8,t.add(o),t}function G_(n=2){const t=new ct,e=new v(new O(n,.6,.34),w(_.wallCream));t.add(e);for(const i of[-1,1]){const o=new v(new O(.04,.16,.04),w(_.metalGrey));o.position.set(i*n*.22,-.18,.19),t.add(o)}return t}function q_(){const n=new ct,t=new v(new O(.66,.9,.64),w(_.metalWhite));t.position.y=.45,n.add(t);const e=new v(new nt(.2,.2,.06,16),w(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,n.add(e);const i=new v(new nt(.14,.14,.05,16),w(3884624));i.position.set(0,.5,.36),i.rotation.x=Math.PI/2,n.add(i);const o=new v(new O(.6,.12,.03),w(14673128));o.position.set(0,.82,.33),n.add(o);for(const s of[-.2,0,.2]){const a=new v(new nt(.025,.025,.03,8),w(_.metalGrey));a.position.set(s,.82,.36),a.rotation.x=Math.PI/2,n.add(a)}return n}function zs(n=_.wood,t=.9,e=2.1,i=.24){const o=new ct,s=new v(new O(t,e,.08),w(n));s.position.y=e/2,o.add(s);for(const c of[-1,1]){const l=new v(new O(.09,e+.1,i),w(_.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),o.add(l)}const a=new v(new O(t+.2,.1,i),w(_.woodDark));a.position.y=e+.05,o.add(a);const r=new v(new It(.055,8,6),w(_.gold,{glow:.15}));return r.position.set(t/2-.14,e*.45,.07),o.add(r),o}function W_(n=_.wood,t=1.6,e=2.1){const i=new ct,o=.62,s=new v(new O(t,e,o),w(_.woodDark));s.position.y=e/2,i.add(s);const a=new v(new O(t-.12,e-.16,.04),w(3812127));a.position.set(0,e/2,o/2-.05),i.add(a);const r=t/2-.05;for(const c of[-1,1]){const l=new ct;l.position.set(c*r,e/2,o/2),c>0&&(l.rotation.y=-.62),i.add(l);const h=new v(new O(r,e-.1,.06),w(n));h.position.x=-c*r/2,l.add(h);const d=new v(new nt(.022,.022,.16,8),w(_.metalGrey));d.position.set(-c*(r-.12),0,.06),l.add(d)}for(const c of[-1,1])for(const l of[-1,1]){const h=new v(new O(.1,.1,.1),w(_.woodDark));h.position.set(c*(t/2-.1),.05,l*(o/2-.1)),i.add(h)}return i}function X_(n=_.wood,t=1.7){const e=new ct,i=.62,o=new v(new O(i,t,.07),w(n));o.position.y=t/2,e.add(o);const s=new v(new O(i-.14,t-.16,.03),w(_.glass,{opacity:.72,glow:.12}));return s.position.set(0,t/2,.04),e.add(s),e.rotation.x=-.05,e}function j_(){const n=new ct,t=new v(new O(.44,.5,.4),w(_.wood));t.position.y=.25,n.add(t);const e=new v(new O(.36,.14,.03),w(_.woodDark));e.position.set(0,.32,.21),n.add(e);const i=new v(new nt(.06,.08,.16,8),w(_.metalGrey));i.position.y=.58,n.add(i);const o=new v(new nt(.11,.15,.18,12,1,!0),w(16773324,{glow:.45,doubleSide:!0}));return o.position.y=.75,n.add(o),n}const Dn={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},Tn={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},Y_=[Dn,Tn],gc={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI},"do-quarto":{x:-5.05,z:-1.2,facing:Math.PI/2}},build(n){const t=n.game,e=async j=>{for(const[mt,vt]of j)await t.say([vt],mt)},i=Dn.name,o=Tn.name,s=12,a=9,r=-s/2,c=-a/2,l=2.8;n.ground({width:s,depth:a,color:_.floorWood}),n.setBounds(r+.45,c+.45,s/2-.45,a/2-.45),n.wall(r,c,s/2,c,l,_.wallCream);const h=-1.2,d=.95;n.wall(r,c,r,h-d/2,l,_.wallMint),n.wall(r,h+d/2,r,a/2,l,_.wallMint),n.wall(r,a/2,s/2,a/2,.45,_.wallCream),n.wall(s/2,-1.3,s/2,a/2,.45,_.wallCream);const u=.4,f=4.2,g=-1.3,M=(u+f)/2,m=(f+s/2)/2,p=.95,S=[u,M-p/2,M+p/2,m-p/2,m+p/2,s/2];for(let j=0;j<S.length;j+=2)S[j+1]-S[j]>.05&&n.wall(S[j],g,S[j+1],g,l,_.wallCream);n.wall(u,c,u,g,l,_.wallCream),n.wall(f,c,f,g,l,_.wallCream),n.wall(s/2,c,s/2,g,l,_.wallCream);const x=new v(new O(s/2-u,.16,g-c),w(15129028));x.position.set((u+s/2)/2,l+.08,(c+g)/2),n.add(x);const y=n.add(n.place(zs(_.woodDark,.85,2.05),M,0,g)),A=n.add(n.place(zs(_.gold,.85,2.05),m,0,g));n.add(n.place(pc(.6,.75,_.wallMint),3.55,1.75,g+.17)),n.add(n.place(mc(.9),1.1,1.7,g+.19)),n.add(n.place(zs(_.fabricBlue,.9,2.1),r,0,h,Math.PI/2)),n.door({x:r+.85,z:h,to:"quarto",entry:"da-sala",label:"Entrar no quarto do Ari",icon:"🚪"}),n.add(n.place(O_(3.6),-3.4,0,c+.42)),n.blockBox(-3.4,c+.42,1.8,.4),n.add(n.place(G_(2.6),-3.4,2,c+.2)),n.add(n.place(F_(),r+.45,0,-2.6,Math.PI/2)),n.blockBox(r+.45,-2.6,.38,.42);const P=n.add(n.place(V_(1.5,.9),-3.6,0,-1.9,.08));n.blockBox(-3.6,-1.9,.8,.52,.08),n.add(n.place(uc(),-4.7,0,-1.9,Math.PI/2)),n.add(n.place(uc(),-2.5,0,-1.9,-Math.PI/2));const C=n.add(n.place(L_(!1),r+.35,0,.6,Math.PI/2));n.blockBox(r+.35,.6,.3,.9);const D=C.getObjectByName("tela");n.add(n.place(dc(3,2.6),-2.5,0,.6));const E=n.add(n.place(I_(_.fabricRed,2.4),-.3,0,.6,-Math.PI/2));n.blockBox(-.3,.6,.5,1.2),n.add(n.place(D_(),-2.4,0,.6,Math.PI/2)),n.blockBox(-2.4,.6,.38,.62);const b=n.add(n.place(k_(16773856),-2.4,.5,.9));n.add(n.place(H_(!0),-.4,0,2.3)),n.blockCircle(-.4,2.3,.3);const L=n.add(n.place(q_(),s/2-.65,0,2.9,-Math.PI/2));n.blockBox(s/2-.65,2.9,.35,.4),n.add(n.place(kd(1.8,1.3),r+.16,1.75,2.4,Math.PI/2)),n.add(n.place(pc(.8,.6,_.skyDusk),-3.4,1.95,c+.17)),n.add(n.place(mc(1.1),-1.6,1.8,c+.2)),n.add(n.place(fc(1.1),r+.8,0,a/2-1));const z=n.add(n.place(fc(.75),4.9,0,1.4)),B=n.place(bd(.75),-.3,2.4,.6);B.visible=!1,n.add(B);const H=a/2;n.wall(2,H,2.9,H,2.6,_.wallCream),n.wall(3.9,H,4.9,H,2.6,_.wallCream);const W=n.add(n.place(zs(_.woodDark,.95,2.1),3.4,0,H,Math.PI));n.blockBox(3.4,H,.5,.12),n.add(n.place(dc(1.4,.8,12626050),3.4,0,a/2-1));const q=new ve;q.position.set(-.52,0,.6),q.rotation.y=-Math.PI/2,n.root.add(q);const tt=new ve;tt.position.set(-1.9,1.05,.6),n.root.add(tt);let Y=!1;const st=j=>{Y=j,D.material=w(j?9426943:_.screen,{glow:j?.55:0})};n.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:E,onInteract:async j=>{if(await j.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await j.say(["Depois. Se sentar agora, não levanta mais."]);return}j.lockPlayer(!0),j.ridePlayer(q,new N(-.52,.02,0),1,0),j.rideCompanion(q,new N(.52,.02,0),1,0),j.setSitting(!0),st(!0),j.focusCamera(tt),j.setZoom(7.2),await j.wait(.9),await j.say(["Está passando Bo Burnham."]),await j.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${j.companionName()} tá rindo também.`]),await j.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await j.say(["Mais um. Só mais um.","Nunca é só mais um."]),j.setSitting(!1),j.focusCamera(null),j.setZoom(10),j.releasePlayer(-1.6,.4,-Math.PI/2),j.releaseCompanion(-1.6,1.5,-Math.PI/2),j.lockPlayer(!1),j.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),n.interact({id:"casa:tv",x:r+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:C,onInteract:async j=>{st(!Y),Y&&j.som("tv"),j.toast(Y?"TV ligada":"TV desligada","📺"),Y&&await j.say(["Está passando Bo Burnham."])}}),n.interact({id:"casa:geladeira",x:r+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:j=>j.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),n.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:j=>j.say(["Por algum milagre, a pia está limpa…"])}),n.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:P,onInteract:async j=>{await e([[i,"Dois pratos, duas canecas. Já virou automático."],[o,"Três, se a Rubi sair do quarto."]]),j.toast("Mesa posta","🍽️")}}),n.interact({id:"casa:maquina",x:s/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:L,onInteract:async j=>{if(j.flag("roupa-lavando")){await e([[o,"Ainda tá centrifugando."],[i,"Esse barulho é a trilha sonora dessa casa."]]);return}j.setFlag("roupa-lavando"),j.toast("Máquina ligada","🫧"),await e([[i,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[o,"Contanto que a Rubi não encha ela de novo antes."]])}}),n.interact({id:"casa:banheiro",x:m,z:g+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:A,onInteract:()=>e([[o,"Tem alguém aí?"],[i,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),n.interact({id:"casa:quarto",x:M,z:g+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:y,onInteract:async j=>{await e([[i,"Acho que a Rubi está ouvindo kpop"],[o,"Para variar né"]]),j.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),n.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:z,onInteract:async j=>{if(j.flag("planta-regada")){await j.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}j.setFlag("planta-regada"),z.scale.multiplyScalar(1.2),j.toast("A plantinha cresceu um tiquinho","🌱"),await j.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),n.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:b,onInteract:async j=>{await j.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),j.toast("+1 disposição","☕")}}),n.interact({id:"casa:janela",x:r+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async j=>{await j.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),j.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),n.door({x:3.4,z:a/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:W,radius:1.7}),n.onUpdate((j,mt)=>{B.visible=n.game.flag("planta-regada"),B.position.y=2.4+Math.sin(mt*1.6)*.12,B.rotation.y=mt*.9})}},ph=new Map;function da(n){let t=n>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967295)}function ua(n,t,e){const i=ph.get(n);if(i)return i;const o=document.createElement("canvas");o.width=256,o.height=256;const s=o.getContext("2d");s&&e(s,256);const a=new Yh(o);return a.wrapS=Uo,a.wrapT=Uo,a.repeat.set(1/t,1/t),a.colorSpace=Ke,a.anisotropy=8,a.needsUpdate=!0,ph.set(n,a),a}function $_(n=2){return ua(`placas:${n}`,n,(t,e)=>{const i=da(20260903);t.fillStyle="#ffffff",t.fillRect(0,0,e,e);for(let s=0;s<2600;s++){const a=i()>.5;t.fillStyle=a?"rgba(255,255,255,0.9)":`rgba(120,110,95,${.05+i()*.05})`;const r=.6+i()*1.5;t.beginPath(),t.arc(i()*e,i()*e,r,0,Math.PI*2),t.fill()}for(let s=0;s<7;s++){const a=i()*e,r=i()*e,c=e*(.08+i()*.14),l=t.createRadialGradient(a,r,0,a,r,c);l.addColorStop(0,`rgba(150,142,126,${.05+i()*.04})`),l.addColorStop(1,"rgba(150,142,126,0)"),t.fillStyle=l,t.fillRect(a-c,r-c,c*2,c*2)}const o=e*.016;t.fillStyle="rgba(112,104,90,0.34)",t.fillRect(0,0,e,o),t.fillRect(0,0,o,e),t.fillStyle="rgba(255,255,255,0.7)",t.fillRect(0,o,e,o*.7),t.fillRect(o,0,o*.7,e);for(const[s,a]of[[0,0],[e,0],[0,e],[e,e]]){const r=t.createRadialGradient(s,a,0,s,a,e*.16);r.addColorStop(0,"rgba(255,255,255,0.55)"),r.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=r,t.fillRect(s-e*.16,a-e*.16,e*.32,e*.32)}})}function Ys(n=9){return ua(`grama:${n}`,n,(t,e)=>{const i=da(777001);t.fillStyle="#ffffff",t.fillRect(0,0,e,e);for(let o=0;o<9;o++){const s=i()*e,a=i()*e,r=e*(.14+i()*.2),c=i()>.45;for(const l of[-e,0,e])for(const h of[-e,0,e]){const d=t.createRadialGradient(s+l,a+h,0,s+l,a+h,r);d.addColorStop(0,c?"rgba(96,124,74,0.11)":"rgba(255,255,255,0.34)"),d.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=d,t.fillRect(s+l-r,a+h-r,r*2,r*2)}}t.lineCap="round";for(let o=0;o<1500;o++){const s=i()*e,a=i()*e,r=-Math.PI/2+(i()-.5)*1.1,c=2.5+i()*4.5,l=i()>.42;t.strokeStyle=l?`rgba(255,255,255,${.3+i()*.4})`:`rgba(78,110,58,${.08+i()*.1})`,t.lineWidth=.9+i()*.9,t.beginPath(),t.moveTo(s,a),t.lineTo(s+Math.cos(r)*c,a+Math.sin(r)*c),t.stroke()}})}function Yi(n=5){return ua(`asfalto:${n}`,n,(t,e)=>{const i=da(9081977);t.fillStyle="#ffffff",t.fillRect(0,0,e,e);for(let o=0;o<8;o++){const s=i()*e,a=i()*e,r=e*(.12+i()*.2),c=i()>.45;for(const l of[-e,0,e])for(const h of[-e,0,e]){const d=t.createRadialGradient(s+l,a+h,0,s+l,a+h,r);d.addColorStop(0,c?"rgba(255,255,255,0.46)":"rgba(96,92,88,0.2)"),d.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=d,t.fillRect(s+l-r,a+h-r,r*2,r*2)}}for(let o=0;o<4200;o++){const s=i()*e,a=i()*e,r=.7+i()*1.7;t.fillStyle=`rgba(80,76,72,${.06+i()*.09})`,t.beginPath(),t.arc(s+r*.5,a+r*.6,r,0,Math.PI*2),t.fill(),t.fillStyle=`rgba(255,255,255,${.3+i()*.45})`,t.beginPath(),t.arc(s,a,r,0,Math.PI*2),t.fill()}})}function Os(n=2.4,t=6){return ua(`pedrinha:${n}:${t}`,n,(e,i)=>{const o=da(31415926),s=i/t,a=s*.13;e.fillStyle="rgba(196,190,178,1)",e.fillRect(0,0,i,i);for(let r=0;r<t;r++){const c=r%2*s*.5;for(let l=-1;l<=t;l++){const h=l*s+c,d=r*s,u=.88+o()*.12,f=Math.round(255*u);e.fillStyle=`rgb(${f},${f-3},${f-8})`,e.beginPath(),e.roundRect(h+a,d+a,s-a*2,s-a*2,s*.16),e.fill(),e.fillStyle="rgba(150,144,132,0.22)",e.fillRect(h+a,d+s-a*2.4,s-a*2,a*1.2)}}for(let r=0;r<6;r++){const c=o()*i,l=o()*i,h=i*(.16+o()*.2);for(const d of[-i,0,i])for(const u of[-i,0,i]){const f=e.createRadialGradient(c+d,l+u,0,c+d,l+u,h);f.addColorStop(0,o()>.5?"rgba(255,255,255,0.32)":"rgba(148,142,128,0.14)"),f.addColorStop(1,"rgba(255,255,255,0)"),e.fillStyle=f,e.fillRect(c+d-h,l+u-h,h*2,h*2)}}})}const fe={x:0,z:-3,largura:16,profundidade:10,fundo:1.6},un={z:-2,largura:48,profundidade:38},Qi={x:-21,z:9},$i={x:Qi.x+2.4,z:Qi.z-2.6};function mh(n,t,e=0){return Math.abs(n-fe.x)<fe.largura/2-e&&Math.abs(t-fe.z)<fe.profundidade/2-e}const gh={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:$i.x,z:$i.z,facing:Math.PI/2},entries:{portaria:{x:$i.x,z:$i.z,facing:Math.PI/2},beira:{x:0,z:3.5,facing:Math.PI}},build(n){const t=n.game,e=async V=>{for(const[ft,K]of V)await t.say([K],ft)},i=Dn.name,o=Tn.name,s={x:fe.x,z:fe.z,width:fe.largura,depth:fe.profundidade};n.groundWithHoles({width:160,depth:160,color:_.grass,holes:[s],textura:Ys(9)}),n.groundWithHoles({width:un.largura,depth:un.profundidade,color:14999766,y:.015,z:un.z,holes:[{...s,z:s.z-un.z}],textura:$_(2)}),n.setBounds(-22,-19,22,16),n.add(n.place(iv(fe.largura,fe.profundidade,fe.fundo),fe.x,0,fe.z));const a=ov(fe.largura,fe.profundidade);a.position.set(fe.x,-.12,fe.z),n.root.add(a);for(const V of[-5.2,-1.8,1.8,5.2]){const ft=new v(new ze(.24,fe.profundidade-1.4),Ye(4164272,1,!0));ft.rotation.x=-Math.PI/2,ft.position.set(fe.x+V,-1.6+.08,fe.z),ft.renderOrder=1,n.root.add(ft)}for(const V of[-5,5])n.add(n.place(rv(),V,0,fe.z+fe.profundidade/2));const r=n.add(n.place(lv(),0,0,fe.z-fe.profundidade/2-1.6));n.blockBox(0,fe.z-fe.profundidade/2-1.9,.4,.4);const c=[Ka(_.frisbee),Ka(16767070),Ka(7328752)];c.forEach((V,ft)=>{n.place(V,-4.5+ft*4.6,-.05,fe.z-1.6+ft%2*2.6),n.root.add(V)});const l=[_.fabricBlue,_.fabricRed,6074447,16763213];for(let V=0;V<6;V++){const ft=-7.5+V*3;n.add(n.place(Za(l[V%l.length]),ft,0,5.4,Math.PI)),n.blockBox(ft,5.4,.36,.85),V%2===0&&(n.add(n.place(Ja(V%4===0?_.fabricRed:4882400),ft+1.5,0,6.9)),n.blockCircle(ft+1.5,6.9,.3))}const h=n.add(n.place(Za(_.rug),10.5,0,2.2,-Math.PI/2));n.blockBox(10.5,2.2,.85,.36),n.add(n.place(Ja(16748465),11.6,0,3.6)),n.blockCircle(11.6,3.6,.3);const d=n.add(n.place(cv(),-11,0,2.5,-Math.PI/2));n.blockCircle(-11,2.5,.3);const u=n.add(n.place(nc(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));n.blockBox(-12.5,7.2,1.4,1,.35);const f=n.add(n.place(_v(8,5),15,0,-18));n.blockBox(15,-18,4.2,2.7),n.banco(14,-3,-Math.PI/2);const g={x:14.5,z:-2.1,largura:9,profundidade:10.4};n.patch(g.x,g.z,g.largura,g.profundidade,_.dequeTabua,0,.02);for(let V=0;V<12;V++){const ft=g.z-g.profundidade/2+.5+V*.85;n.patch(g.x,ft,g.largura-.4,.1,_.dequeRipa,0,.024)}const M={x:14.5,z:-5.6,largura:8,profundidade:3.2};n.add(n.place(sv(M.largura,M.profundidade),M.x,0,M.z));for(const V of[-3.75,0,3.75])for(const ft of[-1.35,1.35])n.blockCircle(M.x+V,M.z+ft,.26);const m={x:13.8,z:-.2,vao:.7};for(const V of[-.7,m.vao])n.add(n.place(Za(V<0?_.fabricBlue:16748465),m.x,0,m.z+V,-Math.PI/2)),n.blockBox(m.x,m.z+V,.85,.36);n.add(n.place(av(),15.5,0,m.z)),n.blockCircle(15.5,m.z,.42);const p=new ve;p.position.set(m.x,.62,m.z),p.rotation.y=-Math.PI/2,n.root.add(p);const S=new ve;S.rotation.x=-Math.PI/2,p.add(S),n.interact({id:"clube:deque",x:m.x,z:m.z,radius:2.4,label:"Descansar no deque",icon:"🌴",onInteract:async V=>{if(await V.ask("Deitar um pouco ao sol?",["Deitar","Agora não"])!==0){await e([[o,"Se eu deitar agora eu durmo."],[i,"É esse o plano."]]);return}V.lockPlayer(!0),V.ridePlayer(S,new N(-.7,-.65,0),1,0),V.rideCompanion(S,new N(m.vao,-.65,0),1,0),V.setLying(!0),V.setCameraOmbro(new N(m.x-1.4,4.6,m.z+2.6),new N(m.x+.3,.5,m.z)),await V.wait(1.1),await e([[o,"O sol tá bom demais."],[i,"A gente veio pra nadar."],[o,"A gente veio pra ficar. Nadar foi ideia sua."]]),await V.ask("Ficar mais um pouco?",["Fica","Levantar"])===0&&(await e([[i,"Nem precisa falar nada."],[o,"Tô só ouvindo a água."]]),await V.wait(2.4)),V.setLying(!1),V.setCameraOmbro(null),V.releasePlayer(m.x,m.z+2.4,0),V.releaseCompanion(m.x+1.2,m.z+2.4,0),V.lockPlayer(!1),V.unlock({id:"deque-do-clube",title:"A tarde no deque",place:"Clube",note:"Duas espreguiçadeiras, dois sucos e a sombra do pergolado chegando devagar.",icon:"🌴"})}});const x={x:-17,z:-14,largura:13,profundidade:7},y=x.z+x.profundidade/2,A=n.add(n.place(vv(x.largura,x.profundidade),x.x,0,x.z));n.blockBox(x.x,x.z,x.largura/2+.3,x.profundidade/2+.9);const P={x:-16.5,z:-6.8,largura:12.4,profundidade:7};n.patch(P.x,P.z,P.largura,P.profundidade,_.restauranteDeck,0,.02);for(let V=0;V<9;V++){const ft=P.z-P.profundidade/2+.5+V*.78;n.patch(P.x,ft,P.largura-.3,.1,_.restauranteDeckRipa,0,.024)}const C={x:-16.5,z:-6.6};for(const[V,ft]of[[-20.6,-8.6],[C.x,C.z],[-12.4,-8.6],[-18.6,-4.2],[-13.6,-4.2]])n.add(n.place(gv(),V,0,ft)),n.blockCircle(V,ft,1.25);const D=new ve;D.position.set(C.x,0,C.z),n.root.add(D);const E=new ve;E.position.set(C.x,1,C.z),n.root.add(E);const b=1.02,L=.02;let z=null;n.onUpdate(V=>z?.(V));const B=async(V,ft)=>{const K=yv(ft);if(!K)return;const rt=bv();rt.userData.bandeja.add(K);const Ot={x:x.x,z:y+.9},Ut={x:C.x+1.5,z:C.z};rt.position.set(Ot.x,0,Ot.z),n.add(rt),V.som("latido");const jt=(ee,F,pt)=>new Promise(ut=>{rt.rotation.y=Math.atan2(F.x-ee.x,F.z-ee.z);let ht=0;z=Q=>{ht=Math.min(pt,ht+Q);const Et=ht/pt;rt.position.x=ee.x+(F.x-ee.x)*Et,rt.position.z=ee.z+(F.z-ee.z)*Et,rt.position.y=Math.abs(Math.sin(ht*11))*.045,rt.rotation.z=Math.sin(ht*11)*.05,ht>=pt&&(z=null,rt.position.set(F.x,0,F.z),rt.rotation.z=0,ut())}});await jt(Ot,Ut,2.2),V.som("latido"),D.attach(K),K.position.set(0,.78,0),K.rotation.set(0,0,0),V.som("sorvete"),await V.wait(.4),await jt(Ut,Ot,2),n.root.remove(rt),rt.traverse(ee=>{ee.isMesh&&ee.geometry.dispose()}),await V.wait(4.5),D.remove(K),K.traverse(ee=>{ee.isMesh&&ee.geometry.dispose()}),V.toast("Estava ótimo","😌")};n.interact({id:"clube:mesa-do-restaurante",x:C.x,z:C.z,radius:2.2,label:"Sentar e ver o cardápio",icon:"📖",onInteract:async V=>{V.lockPlayer(!0),V.ridePlayer(D,new N(0,L,b),1,Math.PI),V.rideCompanion(D,new N(0,L,-b),1,0),V.setSitting(!0),V.focusCamera(E),V.setZoom(7.4),await V.wait(.6),await e([[o,"Tá bom, deixa eu ver o que tem."],[i,"Você já sabe o que vai pedir."],[o,"Sei. Mas eu gosto de ler tudo antes."],[i,"Se tiver arepa, acabou a leitura pra mim."]]);const ft=await V.abrirCardapio(),K=ft?P_(ft):null;K&&(await V.say([`Um(a) ${K.nome}, por favor!`],V.playerName()),await B(V,ft),await e([[o,"Isso aqui salvou o meu dia."],[i,"A gente volta semana que vem?"],[o,"A gente volta amanhã."]])),V.setSitting(!1),V.focusCamera(null),V.setZoom(10),V.releasePlayer(C.x,C.z+2,Math.PI),V.releaseCompanion(C.x,C.z-2,0),V.lockPlayer(!1),K&&V.unlock({id:"cardapio-do-clube",title:"O almoço no clube",place:"Clube",note:"Você leu o cardápio inteiro, de cabo a rabo. E um cachorrinho de gravata trouxe a comida.",icon:"🍽️"})}});for(const V of[-20.6,-12.4])n.add(n.place(Ja(_.restauranteToldo),V,0,-4.8)),n.blockCircle(V,-4.8,.3);n.interact({id:"clube:restaurante",x:x.x,z:y+1.3,radius:2.4,label:"Restaurante",icon:"🍽️",highlight:A,onInteract:async V=>{await e([[o,"Eu tô com fome desde que a gente entrou na água."],[i,"Você tava com fome ANTES de entrar na água."],[o,"E continuo. É consistência."]]),V.toast("Cheiro de comida boa","🍽️"),V.unlock({id:"restaurante-clube",title:"O restaurante do clube",place:"Clube",note:"Mesa na área externa, o cabelo dos dois ainda molhado, e ninguém com pressa de voltar pra piscina.",icon:"🍽️"})}});for(const V of[-5,7])n.add(n.place(Sd(6),V,0,-12.5)),n.blockBox(V,-13.2,3,1);for(const[V,ft]of[[12,-13],[20,-11],[21,-16]])n.mesaDePiquenique(V,ft);n.add(n.place(ea(),-9,0,-5)),n.blockCircle(-9,-5,.3);for(const[V,ft,K]of[[12,6,1.2],[8,12,1.1]])n.add(n.place(gd(K),V,0,ft)),n.blockCircle(V,ft,K);for(const[V,ft,K,rt]of[[-4,-17,1.3,1.05],[19,-8,1.4,.95]])n.add(n.place(J1(K,rt,V),V,0,ft)),n.blockCircle(V,ft,K);for(const V of[-9,-2,5,12])n.add(n.place(qs(),V,0,12)),n.blockCircle(V,12,.25);n.add(n.place(wd(),11.5,0,3.4)),n.blockBox(11.5,3.4,.3,.25),n.add(n.place(ea(),6.5,0,11.4)),n.blockCircle(6.5,11.4,.3),n.add(n.place(Ad(),-17,0,12.5)),n.blockBox(-17,11.9,1.9,1);for(const[V,ft,K,rt]of[["Piscina",_.fabricBlue,3,9.6],["Sucos",5161384,-15.5,10.2]])n.add(n.place(sc(V,ft),K,0,rt)),n.blockCircle(K,rt,.25);for(const V of[-20,21])n.add(n.place(Ed(),V,0,-19)),n.blockCircle(V,-19,.35);n.setSeed(90210);const H=un.largura/2+1.5,W=un.profundidade/2+1.5;for(const[V,ft]of[[-H,-8],[-H,4],[H,2],[H,-10],[-9,-W+un.z],[11,-W+un.z],[-4,W+un.z]])n.add(n.place(ta("palmeira",n.range(.95,1.2),n.rng()),V,0,ft)),n.blockCircle(V,ft,.5);for(let V=0;V<26;V++){const ft=n.range(-34,34),K=n.range(-32,28);Math.abs(ft)<un.largura/2+1&&Math.abs(K-un.z)<un.profundidade/2+1||n.add(n.place(V%2?Gs(n.range(.7,1.1)):ec(6,1.1),ft,0,K))}for(let V=0;V<6;V++){const ft=Md(n.range(1.8,3));ft.position.set(n.range(-60,60),n.range(40,52),n.range(-50,30)),n.root.add(ft);const K=n.range(.2,.5);n.onUpdate(rt=>{ft.position.x+=K*rt,ft.position.x>62&&(ft.position.x=-62)})}const q=n.add(n.place(Td(),Qi.x,0,Qi.z,Math.PI/2));n.blockBox(Qi.x,Qi.z,1.3,4.3),n.door({x:$i.x,z:$i.z,to:"villa-lobos",entry:"clube",label:"Pegar o ônibus pro parque",icon:"🚌",highlight:q,radius:2.4});const tt=[],Y=(V,ft,K=12)=>{t.som("agua");for(let rt=0;rt<K;rt++){const Pt=new v(new It(.1+Math.random()*.1,6,5),Ye(14677247,.9)),Ot=rt/K*Math.PI*2,Ut=.2+Math.random()*.5;Pt.position.set(V+Math.cos(Ot)*Ut,-.1,ft+Math.sin(Ot)*Ut),n.root.add(Pt),tt.push({mesh:Pt,vy:2.2+Math.random()*2.4,vida:1})}};let st=0,j=0,mt=!1;n.onUpdate((V,ft)=>{a.position.y=-.12+Math.sin(ft*1.4)*.015,c.forEach((Ut,jt)=>{Ut.position.y=-.05+Math.sin(ft*1.1+jt*1.7)*.05,Ut.rotation.y=Math.sin(ft*.4+jt)*.4});const K=t.playerPosition(),rt=t.companionPosition(),Pt=mh(K.x,K.z,.2)?1:0,Ot=mh(rt.x,rt.z,.2)?1:0;st+=(Pt-st)*Math.min(1,V*5),j+=(Ot-j)*Math.min(1,V*5),t.submergePlayer(st),t.submergeCompanion(j),Pt===1&&!mt&&(mt=!0,Y(K.x,K.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let Ut=tt.length-1;Ut>=0;Ut--){const jt=tt[Ut];jt.vy-=9*V,jt.mesh.position.y+=jt.vy*V,jt.vida-=V*.9,jt.mesh.material.opacity=Math.max(0,jt.vida),(jt.vida<=0||jt.mesh.position.y<-.6)&&(n.root.remove(jt.mesh),jt.mesh.geometry.dispose(),tt.splice(Ut,1))}});const vt=new ve;n.root.add(vt),n.interact({id:"clube:trampolim",x:0,z:fe.z-fe.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:r,onInteract:async V=>{V.lockPlayer(!0),await V.say(["Do trampolim?","Do trampolim."]);const ft=new N(0,.95,fe.z-fe.profundidade/2-.4),K=new N(0,-.6,fe.z+1.2);vt.position.copy(ft),V.ridePlayer(vt,new N(0,0,0),1);const rt=1.15;for(let Pt=0;Pt<rt;Pt+=1/60){const Ot=Pt/rt;vt.position.lerpVectors(ft,K,Ot),vt.position.y+=Math.sin(Ot*Math.PI)*2.6,await V.wait(1/60)}Y(K.x,K.z,18),V.releasePlayer(K.x,K.z,Math.PI),V.lockPlayer(!1),V.toast("Splash!","💦"),V.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),n.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:h,onInteract:async V=>{await V.say(["Sol na cara, barulho de água, ninguém com pressa.",`${V.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),V.toast("+1 preguiça boa","🌞")}});let At=0;n.onUpdate(V=>{At<=0||(At-=V,At<=0&&(t.removeItem(te.sucoMorango.id,Tn.id),t.removeItem(te.sucoPessego.id,Dn.id),t.toast("Acabou o suco","🍹")))}),n.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:u,onInteract:async V=>{await e([[o,"Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito."],[i,"Awnn gracias amorzito"]]),At=50,V.addItem(te.sucoMorango,Tn.id),V.addItem(te.sucoPessego,Dn.id),V.som("sorvete"),V.toast("Morango e pêssego","🍹")}}),n.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:d,onInteract:async V=>{Y(-10.6,2.5,8),await V.say(["Gelada. Sempre gelada."])}}),n.interact({id:"clube:vestiario",x:15,z:-14.2,radius:2.2,priority:1,label:"Vestiário",icon:"🩳",highlight:f,onInteract:async V=>{for(const ft of[V.playerId(),V.companionId()]){V.storeItem(te.oculosEscuros,ft);for(const K of Rd)V.storeItem(K,ft)}V.flag("vestiario-clube")||(V.setFlag("vestiario-clube"),await e([[i,"Cinco minutos pra trocar de roupa. Você demora quinze."],[o,"Eu demoro porque escolho. Você só pega a primeira que vê."]])),V.abrirVestiario()}})}};class Z_{group=new ct;aoSoar=null;get x(){return this.group.position.x}get z(){return this.group.position.z}get estado(){return this.humor}area;jeito;humor="parado";aguarda=1.2;alvo=new N;fase=0;ateSoar;carinho=0;semente;constructor(t,e={}){this.area=t,this.jeito={velocidade:e.velocidade??.62,descansoMin:e.descansoMin??1.4,descansoMax:e.descansoMax??4.4,chanceDeSentar:e.chanceDeSentar??.35,somCadaMin:e.somCadaMin??9,somCadaMax:e.somCadaMax??20,duracaoDoCarinho:e.duracaoDoCarinho??3.4,semente:e.semente??20260902},this.semente=this.jeito.semente>>>0||1,this.ateSoar=this.jeito.somCadaMin*.7,this.group.position.set((t.minX+t.maxX)/2,0,(t.minZ+t.maxZ)/2),this.alvo.copy(this.group.position)}prontoParaAparecer(t){this.group.userData.peca=t,this.group.traverse(e=>{e.isMesh&&(e.castShadow=!0)})}sorte(){let t=this.semente;return t^=t<<13,t^=t>>>17,t^=t<<5,this.semente=t>>>0,this.semente%1e5/1e5}cabe(t,e){const i=this.area;if(t<i.minX||t>i.maxX||e<i.minZ||e>i.maxZ)return!1;for(const o of i.proibido??[])if(Math.hypot(t-o.x,e-o.z)<o.r)return!1;return!0}novoDestino(){for(let t=0;t<12;t++){const e=this.area.minX+this.sorte()*(this.area.maxX-this.area.minX),i=this.area.minZ+this.sorte()*(this.area.maxZ-this.area.minZ),o=Math.hypot(e-this.x,i-this.z);if(this.cabe(e,i)&&o>.7){this.alvo.set(e,0,i),this.humor="andando",this.aguarda=o/this.jeito.velocidade+2;return}}this.humor="parado",this.aguarda=1.5}receberCarinho(){this.humor="sentado",this.aguarda=this.jeito.duracaoDoCarinho,this.carinho=1,this.ateSoar=Math.min(this.ateSoar,2.2)}update(t){if(this.fase+=t,this.aguarda-=t,this.ateSoar-=t,this.carinho>0&&(this.carinho=Math.max(0,this.carinho-t*.42)),this.ateSoar<=0){const i=this.jeito;this.ateSoar=i.somCadaMin+this.sorte()*(i.somCadaMax-i.somCadaMin),this.aoSoar?.(),this.humor==="andando"&&(this.humor="parado",this.aguarda=.9)}if(this.aguarda<=0)if(this.humor==="andando"){const i=this.jeito;this.humor=this.sorte()<i.chanceDeSentar?"sentado":"parado",this.aguarda=i.descansoMin+this.sorte()*(i.descansoMax-i.descansoMin)}else this.novoDestino();let e=!1;if(this.humor==="andando"){const i=this.alvo.x-this.x,o=this.alvo.z-this.z,s=Math.hypot(i,o);if(s<.08)this.humor="parado",this.aguarda=1.2+this.sorte()*2.5;else{const a=Math.min(s,this.jeito.velocidade*t);this.group.position.x+=i/s*a,this.group.position.z+=o/s*a;let c=Math.atan2(i,o)-this.group.rotation.y;for(;c>Math.PI;)c-=Math.PI*2;for(;c<-Math.PI;)c+=Math.PI*2;this.group.rotation.y+=c*Math.min(1,t*7),e=!0}}this.animar(t,{andando:e,sentado:this.humor==="sentado",carinho:this.carinho,fase:this.fase})}}class J_ extends Z_{corpo=new ct;cabeca=new ct;rabo=new ct;patas=[];orelhas=[];olhos=[];gomosDoRabo=[];constructor(t){super(t,{velocidade:.62,descansoMin:1.4,descansoMax:4.4,chanceDeSentar:.35,somCadaMin:9,somCadaMax:20}),this.montar(),this.prontoParaAparecer("pelusa")}montar(){const t=w(_.pelusaBranco),e=w(_.pelusaCinza),i=w(_.pelusaCinzaEscuro),o=new v(new It(1,14,10),t);o.scale.set(.105,.098,.165),o.position.y=.175,this.corpo.add(o);const s=new v(new It(1,14,10),e);s.scale.set(.098,.072,.142),s.position.set(0,.203,-.012),this.corpo.add(s);const a=new v(new It(.105,14,10),t);a.scale.set(1,.94,.9),this.cabeca.add(a);const r=new v(new It(.107,14,10,0,Math.PI*2,0,Math.PI*.54),e);r.scale.set(1,.94,.9),r.position.y=.004,this.cabeca.add(r);const c=new v(new It(.058,10,8),t);c.scale.set(1.05,.78,.85),c.position.set(0,-.032,.072),this.cabeca.add(c);const l=new v(new It(.016,8,6),w(_.pelusaFocinho));l.scale.set(1.2,.85,.8),l.position.set(0,-.024,.122),this.cabeca.add(l);for(const d of[-1,1]){const u=new ct,f=new v(new Ce(.042,.085,6),e);u.add(f);const g=new v(new Ce(.026,.058,6),w(_.pelusaOrelha));g.position.z=.016,u.add(g),u.position.set(d*.062,.092,-.006),u.rotation.z=d*.17,this.orelhas.push(u),this.cabeca.add(u);const M=new v(new It(.016,8,6),w(2828065));M.position.set(d*.044,.01,.09),this.olhos.push(M),this.cabeca.add(M)}this.cabeca.position.set(0,.288,.152),this.corpo.add(this.cabeca);for(const[d,u]of[[-1,1],[1,1],[-1,-1],[1,-1]]){const f=new v(new an(.028,.085,3,6),t);f.position.set(d*.062,.072,u*.092),this.patas.push(f),this.corpo.add(f)}let h=this.rabo;for(let d=0;d<3;d++){const u=new ct,f=new v(new an(.022-d*.004,.075,3,6),d%2===0?e:i);f.position.y=.048,u.add(f),u.position.y=d===0?0:.094,u.rotation.x=d===0?-.75:.34,h.add(u),h=u,this.gomosDoRabo.push(u)}this.rabo.position.set(0,.19,-.168),this.corpo.add(this.rabo),this.group.add(this.corpo)}animar(t,{andando:e,sentado:i,carinho:o,fase:s}){if(e){const c=s*9;this.patas[0].position.z=.092+Math.sin(c)*.032,this.patas[3].position.z=-.092+Math.sin(c)*.032,this.patas[1].position.z=.092-Math.sin(c)*.032,this.patas[2].position.z=-.092-Math.sin(c)*.032,this.corpo.position.y=Math.abs(Math.sin(c))*.012,this.corpo.rotation.x=0,this.corpo.rotation.z=Math.sin(c)*.03}else{for(let d=0;d<4;d++){const u=d<2?.092:-.092;this.patas[d].position.z+=(u-this.patas[d].position.z)*Math.min(1,t*8)}this.corpo.rotation.z*=1-Math.min(1,t*8);const c=i?.34:0;this.corpo.rotation.x+=(c-this.corpo.rotation.x)*Math.min(1,t*5);const l=Math.sin(s*1.7)*.006,h=(i?.028:0)+l;this.corpo.position.y+=(h-this.corpo.position.y)*Math.min(1,t*5)}const a=e?1:.55;for(let c=0;c<this.gomosDoRabo.length;c++){const l=this.gomosDoRabo[c],h=(.1+c*.075)*a+o*.1;l.rotation.z=Math.sin(s*(2.1+c*.9))*h,c===0&&(l.rotation.x=-.75+Math.sin(s*1.3)*.12*a)}this.cabeca.rotation.y=e?0:Math.sin(s*.6)*.34,this.cabeca.rotation.x=-o*.22+Math.sin(s*1.9)*.02;for(let c=0;c<this.orelhas.length;c++){const l=c===0?-1:1,h=Math.sin(s*2.3+c*1.7);this.orelhas[c].rotation.z=l*(.17+o*.12)+h*.05*l}const r=1-o*.85;for(const c of this.olhos)c.scale.y=Math.max(.12,r)}}const fn=8,pn=6.5,qe=-fn/2,Je=-pn/2,vh=2.8,oi={x:2.65,z:Je+.36},_h={x:-1.15},K_=["Ele só ronrona assim pra quem ele gosta.","Cuidado que ele dorme em cima de você.","Ó, fechou o olhinho.","Ele te adotou.","Esse aí é o dono do quarto. A gente só mora junto."],Q_=[te.gorroDeLa,te.camisaListrada,te.calcaJeans,te.botaAmarela,te.vestidoRosa,te.gargantilhaDeLaco,te.maidMarinheiro,te.maidGatinho,te.maidJapones,te.meiaDeCoxa,te.moletomPreto],Mh={id:"quarto",name:"Quarto do Ari",subtitle:"a porta que fica sempre encostada",ambient:{sky:14872311,indoor:!0,sunColor:16774366,sunIntensity:.95,ambientColor:15397883,ambientIntensity:1.45,sunDir:[10,15,12]},spawn:{x:.9,z:1.7,facing:Math.PI},entries:{"da-sala":{x:.9,z:1.7,facing:Math.PI}},build(n){const t=n.game,e=async p=>{for(const[S,x]of p)await t.say([x],S)},i=Dn.name,o=Tn.name;n.ground({width:fn,depth:pn,color:_.floorWood}),n.setBounds(qe+.45,Je+.45,fn/2-.45,pn/2-.45),n.wall(qe,Je,fn/2,Je,vh,_.wallAzul),n.wall(qe,Je,qe,pn/2,vh,_.wallAzul),n.wall(fn/2,Je,fn/2,pn/2,.45,_.wallAzul);const s=.9,a=1.1;n.wall(qe,pn/2,s-a/2,pn/2,.45,_.wallAzul),n.wall(s+a/2,pn/2,fn/2,pn/2,.45,_.wallAzul);for(const[p,S,x,y]of[[0,Je+.06,fn,0],[qe+.06,0,pn,Math.PI/2]]){const A=new v(new O(x,.12,.05),w(12176860));A.position.set(p,.06,S),A.rotation.y=y,n.add(A)}const r=n.add(n.place(N_(_.fabricBlue),-2.2,0,-1.75));n.blockBox(-2.2,-1.75,.78,1.08);const c={x:-2.2,y:.86,z:-1.02},l=new ve;l.position.set(c.x,c.y,c.z),l.rotation.x=-Math.PI/2,n.add(l),n.add(n.place(j_(),-1.05,0,-2.72)),n.blockBox(-1.05,-2.72,.24,.22);const h=n.add(n.place(U_(1.9,1.1),.15,0,Je+.22));n.blockBox(.15,Je+.22,.55,.18);const d=n.add(n.place(W_(_.wallMint),oi.x,0,oi.z));n.blockBox(oi.x,oi.z,.8,.32);const u=n.add(n.place(X_(_.woodDark),qe+.12,0,-.6,Math.PI/2));n.add(n.place(kd(1.6,1.2),qe+.16,1.7,1,Math.PI/2));const f=n.add(n.place(z_(),qe+.5,0,2,-Math.PI/2));n.blockBox(qe+.5,2,.4,.82),n.add(n.place(uc(_.woodDark),qe+1.35,0,2,-Math.PI/2)),n.add(n.place(dc(2.6,2,_.rug),.3,0,1.1)),n.add(n.place(fc(1.15),fn/2-.75,0,.9)),n.blockCircle(fn/2-.75,.9,.3),n.add(n.place(pc(.6,.75,_.flowerPink),-2.2,1.85,Je+.17)),n.add(n.place(mc(.9),1.05,1.9,Je+.19));const g=n.add(n.place(B_(1.3,1),_h.x,1.72,Je+.17));n.door({x:s,z:pn/2-.7,to:"casa",entry:"do-quarto",label:"Voltar pra sala",icon:"🚪"}),n.interact({id:"quarto:armario",x:oi.x,z:oi.z+1.25,radius:1.8,label:"Abrir o armário",icon:"🚪",highlight:d,onInteract:async p=>{for(const S of[p.playerId(),p.companionId()])for(const x of Q_)p.storeItem(x,S);p.flag("armario-aberto")||(p.setFlag("armario-aberto"),await e([[i,"Pode mexer, fica à vontade."],[o,"Tem mais roupa aqui do que no meu apartamento inteiro."]]),p.unlock({id:"armario-do-ari",title:"O armário do Ari",place:"Quarto do Ari",note:"Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.",icon:"👕"})),p.abrirGuardaRoupa()}});const M=new J_({minX:qe+.8,maxX:fn/2-.8,minZ:Je+.9,maxZ:pn/2-.8,proibido:[{x:-2.2,z:-1.75,r:1.05},{x:-1.05,z:-2.72,r:.45},{x:.15,z:Je+.22,r:.7},{x:oi.x,z:oi.z,r:1},{x:qe+.5,z:2,r:.9},{x:fn/2-.75,z:.9,r:.6}]});n.add(M.group),M.aoSoar=()=>t.som("miado");const m=n.interact({id:"quarto:pelusa",x:M.x,z:M.z,radius:1.15,label:"Fazer carinho no Pelusa",icon:"🐈",highlight:M.group,onInteract:async p=>{if(M.receberCarinho(),p.som("miado"),!p.flag("pelusa-conhecido")){p.setFlag("pelusa-conhecido"),await e([[o,"Esse é o Pelusa?"],[i,"Esse é o Pelusa."],[o,"Ele deixa pegar?"],[i,"Ele decide na hora. Hoje ele tá deixando."]]),p.unlock({id:"pelusa",title:"O Pelusa",place:"Quarto do Ari",note:"O gato do Ari. Branco, cinza no lombo, e some pelo quarto até você sentar no chão.",icon:"🐈"});return}await p.say([n.pick(K_)],i)}});n.onUpdate(p=>{M.update(p),m.moveTo(M.x,M.z)}),n.interact({id:"quarto:memorias",x:_h.x,z:-2.15,radius:1.35,label:"Ver memórias",icon:"📌",highlight:g,onInteract:async p=>{p.flag("quadro-visto")||(p.setFlag("quadro-visto"),await e([[i,"Eu queria um lugar pra pendurar as nossas."],[o,"Um quadro de memórias."],[i,"Esse. Cada uma que a gente viver, entra aqui."]]),p.unlock({id:"quadro-de-memorias",title:"O quadro de memórias",place:"Quarto do Ari",note:"Ideia dele. A primeira já estava pregada quando eu vi.",icon:"📌"})),p.abrirMemoria("o-pedido")}}),n.interact({id:"quarto:espelho",x:qe+.95,z:-.6,radius:1.5,label:"Se olhar no espelho",icon:"🪞",highlight:u,onInteract:async p=>{if(p.wearables().filter(x=>x!==null).length===0){await e([[o,"Tô bem assim?"],[i,"Tá. Mas tem um armário inteiro logo ali."]]);return}await e([[i,`Olha só, ${p.playerName()}.`],[o,"Ficou bom mesmo."]])}}),n.interact({id:"quarto:cama",x:-2.2,z:-.5,radius:1.6,label:"Deitar na cama",icon:"🛏️",highlight:r,onInteract:async p=>{if(await p.ask("Deitar um pouco?",["Deitar","Agora não"])!==0){await e([[o,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[o,"Não é a cama então."]]);return}p.lockPlayer(!0),p.ridePlayer(l,new N(-.36,0,0),1,0),p.rideCompanion(l,new N(.36,0,0),1,0),p.setLying(!0),p.setCameraOmbro(new N(-.95,3.75,.35),new N(-2.2,.72,-1.75)),await p.wait(1.1),await e([[o,"Essa cama é bem melhor que a minha."],[i,"É a mesma cama de sempre."],[o,"Não é a cama então."]]),await p.ask("Ficar mais um pouco?",["Fica","Levantar"])===0&&(await e([[i,"A gente não precisa fazer nada agora."],[o,"Eu sei."]]),await p.wait(2.4)),p.setLying(!1),p.setCameraOmbro(null),p.releasePlayer(-1.3,-.4,0),p.releaseCompanion(-1.3,.25,0),p.lockPlayer(!1),p.unlock({id:"deitar-junto",title:"Deitar sem motivo",place:"Quarto do Ari",note:"Os dois na cama dele, olhando o teto, sem plano nenhum para o resto da tarde.",icon:"🛏️"})}}),n.interact({id:"quarto:mesa",x:qe+1.5,z:2,radius:1.5,label:"Olhar a escrivaninha",icon:"💻",highlight:f,onInteract:()=>e([[i,"É daqui que eu te mando mensagem de madrugada."],[o,"Eu sei. Eu tô acordado do outro lado."]])}),n.interact({id:"quarto:estante",x:.35,z:-2.2,radius:1.4,label:"Olhar a estante",icon:"📚",highlight:h,onInteract:async p=>{await e([[o,"Você leu todos esses?"],[i,"Comecei todos esses."],[i,"Menos esse. Esse eu li três vezes: Aristóteles e Dante Descobrem os Segredos do Universo."],[o,"Eu sei. Você me contou o final antes de eu chegar na metade."],[i,"E o seu tá aqui do lado. A Toca das Raposas."],[o,"Você guardou."],[i,"Guardei."]]),p.flag("estante-favoritos")||(p.setFlag("estante-favoritos"),p.unlock({id:"os-dois-livros",title:"Os dois livros",place:"Quarto do Ari",note:"O Aristóteles e Dante é dele. A Toca das Raposas é meu. Ficam na mesma prateleira.",icon:"📚"}))}})}};function t2(n,t,e,i){const o=new N().subVectors(t,n),s=o.length(),a=new v(new nt(e,e*1.15,s,8),i);return a.position.copy(n).addScaledVector(o,.5),a.quaternion.setFromUnitVectors(new N(0,1,0),o.normalize()),a}class e2{group=new ct;cabins=[];radius;hubHeight;speed;angle=0;rim=new ct;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,i=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const o=w(t.frameColor??_.metalWhite),s=this.hubHeight=e+2.6,a=e*.075;for(const C of[-a,a]){const D=new v(new ge(e,e*.019,8,72),o);D.position.z=C,this.rim.add(D)}const r=Math.min(48,i*2);for(let C=0;C<r;C++){const D=C/r*Math.PI*2,E=new v(new O(e*.012,e*.012,a*2),o);E.position.set(Math.cos(D)*e,Math.sin(D)*e,0),this.rim.add(E)}const c=[];for(let C=0;C<r;C++){const D=C/r*Math.PI*2,E=(C+1)/r*Math.PI*2,b=C%2===0?-a:a,L=C%2===0?a:-a;c.push(Math.cos(D)*e,Math.sin(D)*e,b,Math.cos(E)*e,Math.sin(E)*e,L)}this.rim.add(new pl(xh(c),$l(14673642)));const l=[];for(let C=0;C<i;C++){const D=C/i*Math.PI*2,E=Math.cos(D)*e,b=Math.sin(D)*e;l.push(0,0,-a*.5,E,b,-a),l.push(0,0,a*.5,E,b,a)}this.rim.add(new pl(xh(l),$l(15660022)));const h=new v(new nt(e*.085,e*.085,e*.3,14),o);h.rotation.x=Math.PI/2,this.rim.add(h);for(const C of[-e*.17,e*.17]){const D=new v(new nt(e*.11,e*.07,e*.06,14),w(_.metalGrey));D.rotation.x=Math.PI/2,D.position.z=C,this.rim.add(D)}this.rim.position.y=s,this.group.add(this.rim);const d=w(t.cabinColor??_.metalWhite),u=w(7321304,{opacity:.5}),f=e*.068;for(let C=0;C<i;C++){const D=new ct,E=new v(new O(.09,f*1.1,.09),w(_.metalGrey));E.position.y=f*1.25,D.add(E);const b=new v(new an(f,f*.5,5,16),d);b.scale.set(1,1,.92),D.add(b);const L=new v(new nt(f*1.02,f*1.02,f*.95,18,1,!0),u);L.position.y=f*.12,L.scale.z=.92,D.add(L),D.traverse(z=>{z.isMesh&&(z.castShadow=!0)}),this.cabins.push(D),this.group.add(D)}const g=e*.42,M=new N(0,s,-e*.04),m=new N(0,s,e*.04),p=[[M,new N(-e*.2,0,-g)],[M,new N(e*.2,0,-g)],[m,new N(-e*.2,0,g)],[m,new N(e*.2,0,g)]];for(const[C,D]of p){const E=t2(C.clone(),D.clone(),e*.03,o);E.castShadow=!0,this.group.add(E)}for(const C of[-g,g]){const D=new v(new O(e*.42,e*.022,e*.022),o);D.position.set(0,e*.16,C),this.group.add(D)}const S=new v(new nt(e*.62,e*.67,.35,26),w(_.concrete));S.position.y=.16,S.receiveShadow=!0,this.group.add(S);const x=e*.4,y=g*.92;for(const[C,D]of[[-x,-y],[x,-y],[-x,y],[x,y]]){const E=new v(new nt(e*.055,e*.055,e*.16,12),w(_.metalRed));E.position.set(C,e*.08,D),E.castShadow=!0,this.group.add(E)}const A=new v(new O(e*.55,.55,e*.3),w(_.metalGrey));A.position.set(0,.4,g*.9),A.castShadow=!0,A.receiveShadow=!0,this.group.add(A);const P=new v(new nt(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),w(_.fabricRed));P.position.set(0,1.9,g*.9),P.rotation.set(0,0,Math.PI/2),P.scale.z=.6,this.group.add(P);for(const C of[-e*.15,e*.15]){const D=new v(new nt(.06,.06,1.8,8),w(_.metalWhite));D.position.set(C,.9,g*.9),this.group.add(D)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const i of this.cabins)i.position.y<e&&(e=i.position.y,t=i);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function xh(n){const t=new Le;return t.setAttribute("position",new he(n,3)),t}class n2{mesh;state="chao";velocity=new N;spin=0;curva=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=yd(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}get rasante(){return Math.hypot(this.velocity.x,this.velocity.z)}pickUp(){this.state="guardado",this.velocity.set(0,0,0),this.curva=0}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,i=0,o=1,s=0){const a=e.x-t.x,r=e.z-t.z,c=Math.hypot(a,r),l=(Math.random()-.5)*i;this.throwFrom(t,Math.atan2(a,r)+l,this.powerFor(c,o),o,s)}throwAt(t,e,i,o=1,s=0){this.throwFrom(t,e,this.powerFor(i,o),o,s)}powerFor(t,e=1){let i=.25,o=1.7;for(let s=0;s<14;s++){const a=(i+o)/2;this.simulateRange(a,e)<t?i=a:o=a}return Ne.clamp((i+o)/2,.25,1.7)}passo(t,e,i,o){const s=e.y>-1.2?this.lift:0;e.y-=(this.gravity-s)*o;const a=e.x,r=e.z,c=Math.hypot(a,r);return i!==0&&c>1e-4&&(e.x+=r/c*i*o,e.z+=-a/c*i*o),e.x*=1-.35*o,e.z*=1-.35*o,t.addScaledVector(e,o),i*Math.max(0,1-1.1*o)}simulateRange(t,e=1){const i=new N(0,1.15,0),o=new N(0,3.4*t*e,11*t),s=1/60;for(let a=0;a<900&&i.y>.06;a++)this.passo(i,o,0,s);return i.z}ondeVaiCair(t){const e=this.mesh.position.clone();if(this.state!=="voando")return e;const i=this.velocity.clone();let o=this.curva;const s=1/60;for(let a=0;a<900&&e.y>.06;a++)o=this.passo(e,i,o,s),this.bater(e,i,t)&&(o=0);return e.y=.06,e}throwFrom(t,e,i=1,o=1,s=0){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const a=11*i;this.velocity.set(Math.sin(e)*a,3.4*i*o,Math.cos(e)*a),this.curva=s,this.spin=22}bater(t,e,i){const o=Ne.clamp(t.x,i.minX,i.maxX),s=Ne.clamp(t.z,i.minZ,i.maxZ);return o===t.x&&s===t.z?!1:(t.x=o,t.z=s,e.multiplyScalar(.2),!0)}update(t,e){this.state==="voando"&&(this.curva=this.passo(this.mesh.position,this.velocity,this.curva,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08+this.curva*.06,this.bater(this.mesh.position,this.velocity,e)&&(this.curva=0),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.curva=0,this.onLand?.(this.mesh.position.clone())))}}const Be={largura:2.6,profundidade:1.4,altura:.76},i2=.055,Lo=Be.largura/2+.22,o2=Lo+.9,yh=.28,s2=Be.altura+.19,a2=6.6,r2=.72,Eo=Be.profundidade/2+.12,on={vxBase:3.5,vxMin:2.9,vxMax:4.4,energiaParaVx:.05,vyBase:1.9,alturaParaVy:1.5,subidaParaVy:.12,vyMin:.75,vyMax:2.4,heranca:.25,lateralParaVz:.2,vzMax:1.05,velocidadeMaximaRaquete:6};class c2{grupo=new ct;bola;minhaRaquete;raqueteDele;fase="parado";meus=0;dele=0;alvo;onSom=null;onPonto=null;onFim=null;v=new N;espera=0;sacaEu=!0;rebatedor="eu";quiquesNoAlvo=0;lateralRaquete=0;subidaRaquete=0;zAnterior=0;yAnterior=0;erroDele=0;constructor(t=5){this.alvo=t,this.bola=xd(),this.grupo.add(this.bola),this.minhaRaquete=na(_.metalRed),this.raqueteDele=na(_.fabricBlue),this.minhaRaquete.rotation.y=Math.PI/2,this.raqueteDele.rotation.y=-Math.PI/2,this.minhaRaquete.scale.setScalar(1.15),this.raqueteDele.scale.setScalar(1.15),this.grupo.add(this.minhaRaquete,this.raqueteDele),this.resetar()}comecar(){this.meus=0,this.dele=0,this.sacaEu=!0,this.resetar()}guardar(){this.fase="parado",this.grupo.visible=!1}resetar(){this.fase="sacando",this.espera=1.1,this.grupo.visible=!0;const t=this.sacaEu?-1:1;this.bola.position.set(t*(Be.largura/2-.3),Be.altura+.45,0),this.v.set(0,0,0),this.minhaRaquete.position.set(-Lo,Be.altura+.3,0),this.raqueteDele.position.set(Lo,Be.altura+.3,0),this.zAnterior=0,this.yAnterior=Be.altura+.3,this.lateralRaquete=0,this.subidaRaquete=0,this.sortearErro()}sortearErro(){const t=Math.random()<.25;this.erroDele=(Math.random()-.5)*(t?1.5:.5)}update(t,e){if(!(this.fase==="parado"||this.fase==="fim")){if(this.moverMinhaRaquete(t,e),this.moverRaqueteDele(t),this.fase==="ponto"||this.fase==="sacando"){this.espera-=t,this.espera<=0&&(this.fase==="ponto"?this.resetar():this.sacar());return}this.voar(t)}}sacar(){this.fase="jogando",this.rebatedor=this.sacaEu?"eu":"ele",this.quiquesNoAlvo=0,this.v.set(this.sacaEu?3.4:-3.4,1.45,(Math.random()-.5)*.6),this.onSom?.("lancar")}moverMinhaRaquete(t,e){const i=Ne.clamp(e.x*Eo,-Eo,Eo),o=Be.altura+.16+Ne.clamp((e.y+.35)*.6,0,.75);this.minhaRaquete.position.z+=(i-this.minhaRaquete.position.z)*Math.min(1,t*18),this.minhaRaquete.position.y+=(o-this.minhaRaquete.position.y)*Math.min(1,t*14);const s=on.velocidadeMaximaRaquete;t>0&&(this.lateralRaquete=Ne.clamp((this.minhaRaquete.position.z-this.zAnterior)/t,-s,s),this.subidaRaquete=Ne.clamp((this.minhaRaquete.position.y-this.yAnterior)/t,-s,s)),this.zAnterior=this.minhaRaquete.position.z,this.yAnterior=this.minhaRaquete.position.y}moverRaqueteDele(t){const e=this.v.x>0,i=e?this.bola.position.z+this.erroDele:0,o=e?4.6:1.6;this.raqueteDele.position.z+=(i-this.raqueteDele.position.z)*Math.min(1,t*o),this.raqueteDele.position.z=Ne.clamp(this.raqueteDele.position.z,-Eo,Eo);const s=e?Ne.clamp(this.bola.position.y,Be.altura+.16,Be.altura+.9):Be.altura+.3;this.raqueteDele.position.y+=(s-this.raqueteDele.position.y)*Math.min(1,t*4)}voar(t){const e=this.bola.position,i=e.x;if(this.v.y-=a2*t,e.addScaledVector(this.v,t),(i<0&&e.x>=0||i>0&&e.x<=0)&&e.y<s2){this.onSom?.("quicar"),this.marcar(this.rebatedor==="ele","na rede");return}const s=Be.altura+i2,a=Math.abs(e.x)<=Be.largura/2&&Math.abs(e.z)<=Be.profundidade/2;if(e.y<=s&&this.v.y<0&&a){if(e.y=s,this.v.y=-this.v.y*r2,this.onSom?.("quicar"),(e.x<0?"eu":"ele")===this.rebatedor){this.marcar(this.rebatedor==="ele","quique no próprio campo");return}if(this.quiquesNoAlvo+=1,this.quiquesNoAlvo>=2){this.marcar(this.rebatedor==="eu","dois quiques");return}}for(const[c,l,h]of[[-1,this.minhaRaquete,"eu"],[1,this.raqueteDele,"ele"]]){const d=c*Lo;!(c<0?i>d&&e.x<=d:i<d&&e.x>=d)||this.rebatedor===h||!(Math.abs(e.z-l.position.z)<yh&&Math.abs(e.y-l.position.y)<yh)||(e.x=d,this.rebater(h==="eu"?1:-1,l.position.y,h==="eu"),this.rebatedor=h,this.quiquesNoAlvo=0,this.onSom?.("pegar"),h==="ele"&&this.sortearErro())}(e.y<.12||Math.abs(e.x)>o2||Math.abs(e.z)>2.2)&&(this.quiquesNoAlvo>=1?this.marcar(this.rebatedor==="eu","não alcançou"):this.marcar(this.rebatedor==="ele","fora"))}rebater(t,e,i){const o=i?this.lateralRaquete:this.miraDoParceiro(),s=i?this.subidaRaquete:0,a=Math.abs(o)+Math.abs(s),r=Ne.clamp(on.vxBase+a*on.energiaParaVx,on.vxMin,on.vxMax),c=Ne.clamp(on.vyBase-(e-(Be.altura+.14))*on.alturaParaVy+s*on.subidaParaVy,on.vyMin,on.vyMax),l=Ne.clamp(this.v.z*on.heranca+o*on.lateralParaVz,-1.05,on.vzMax);this.v.set(t*r,c,l)}miraDoParceiro(){const t=-this.bola.position.z*1.2,e=(Math.random()-.5)*2.4;return Ne.clamp(t+e,-4,4)}marcar(t,e){if(t?this.meus+=1:this.dele+=1,this.sacaEu=!t,this.onPonto?.(t,e),this.meus>=this.alvo||this.dele>=this.alvo){this.fase="fim",this.onFim?.(this.meus>=this.alvo);return}this.fase="ponto",this.espera=1.3}}const l2={plano:Lo},bh={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:_.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(n){const t=n.game,e=async R=>{for(const[k,J]of R)await t.say([J],k)},i=Dn.name,o=Tn.name,s={x:-8.6,z:2.5},a={x:-21,z:-5,reta:5,raio:5,miolo:2.4},r={x:s.x+4.72,z:s.z+.2},c={x:18,z:-4.5,largura:26,profundidade:19},l={x:-15.5,z:20.5,giro:.35},h=(R,k,J=0)=>Math.abs(R-c.x)<c.largura/2-J&&Math.abs(k-c.z)<c.profundidade/2-J;n.ground({width:240,depth:240,color:_.grass,textura:Ys(9)}),n.setBounds(-44,-34,44,32);for(let R=0;R<14;R++)n.disc(n.range(-40,40),n.range(-30,30),n.range(2,6),_.grassDark,.004);n.disc(0,-16.5,8.6,_.sand,.008),n.disc(0,-16.5,8,_.concrete,.012,Os()),n.patch(0,4,5.5,56,_.asphalt,0,.016,Yi()),n.patch(0,9,62,4.5,_.asphalt,0,.02,Yi());const d=(R,k,J,et)=>{n.patch(a.x,a.z,a.reta*2,R*2,k,0,J,et),n.disc(a.x-a.reta,a.z,R,k,J,et),n.disc(a.x+a.reta,a.z,R,k,J,et)},u=.3;d(a.raio,_.metalWhite,.022),d(a.raio-u,_.asphalt,.026,Yi()),d(a.miolo+u,_.metalWhite,.03),d(a.miolo,_.grass,.034,Ys(9));const f=(a.raio+a.miolo)/2,g=[1.15,.17];for(const R of[-1,1]){for(let J=0;J<5;J++){const et=a.x-a.reta+1+J*(a.reta*2-2)/4;n.patch(et,a.z+R*f,g[0],g[1],_.metalWhite,0,.038)}const k=a.x+R*a.reta;for(let J=0;J<6;J++){const et=-Math.PI/2+(J+.5)/6*Math.PI,bt=R>0?et:et+Math.PI;n.patch(k+Math.cos(bt)*f,a.z+Math.sin(bt)*f,g[0],g[1],_.metalWhite,-(bt+Math.PI/2),.038)}}n.patch(a.x+a.reta*.55,a.z+f,.32,a.raio-a.miolo-u*2,_.metalWhite,0,.04),n.patch(s.x+.4,s.z+.2,10,6.4,_.concrete,0,.02,Os()),n.patch(s.x+1.6,7.2,3,7,_.asphalt,0,.022,Yi());const M=new e2({radius:12,cabins:32,rpm:1});n.place(M.group,0,0,-26),n.add(M.group),n.blockCircle(0,-26,7.2);for(const R of[-11,11])n.add(n.place(Xi(9,1.2,_.metalWhite),R,0,-20,Math.PI/2)),n.blockBox(R,-20,.2,4.5);n.add(n.place(K1(2.6),-9.5,0,-21,.4)),n.blockCircle(-9.5,-21,2.7);const m=n.add(n.place(nc(_.fabricBlue,{texto:"Bilheteria"}),8.9,0,-20.5,-.5));n.blockBox(8.9,-20.5,1.4,.95,-.5);const p=[[-6.4,-13.6,1.15],[6.4,-13.6,1.15],[-8.6,-17.4,.95],[8.6,-17.4,.95]];for(const[R,k,J]of p)n.add(n.place(gd(J,void 0,n.rng()),R,0,k,n.range(0,6.28))),n.blockCircle(R,k,J+.1);for(const[R,k]of[[-7.6,-11.4],[7.6,-11.4],[-12.2,-19],[12.2,-19]])n.add(n.place(qs(!1),R,0,k)),n.blockCircle(R,k,.35);for(const[R,k,J]of[[-3.6,-12.2,.1],[3.6,-12.2,-.1],[-13.2,-22.5,1.1]])n.banco(R,k,J);for(const[R,k]of[[6.9,-18.9],[-5.2,-11.6]])n.add(n.place(ea(),R,0,k)),n.blockCircle(R,k,.35);for(let R=0;R<22;R++){const k=R/22*Math.PI*2+n.range(-.1,.1),J=n.range(10.5,13.5),et=Math.cos(k)*J,bt=-18+Math.sin(k)*J*.7;Math.abs(et)<4.5&&bt>-14||(R%3===0?n.add(n.place(Gs(n.range(.6,1),_.leafDark),et,0,bt)):R%3===1?n.add(n.place(Zl(n.range(.9,1.4)),et,0,bt,n.range(0,6.28))):n.add(n.place(Ds(n.range(.4,.8),n.rng()),et,0,bt,n.range(0,6.28))))}n.disc(-21,11,9.2,_.sand,.024),n.disc(-21,11,8.5,_.water,.028),n.blockCircle(-21,11,8.8);const S=[$a(),$a(15262416),$a()];S.forEach((R,k)=>{n.place(R,-21+Math.cos(k*2.1)*4.5,.1,11+Math.sin(k*2.1)*3.5,k*1.7),n.add(R)});const x={x:-21,z:11};for(let R=0;R<34;R++){const k=R/34*Math.PI*2+n.range(-.09,.09),J=n.range(9.1,11.4),et=x.x+Math.cos(k)*J,bt=x.z+Math.sin(k)*J,Wt=R%4;Wt===0?n.add(n.place(Gs(n.range(.6,1),_.leafDark),et,0,bt)):Wt===1?n.add(n.place(Zl(n.range(.9,1.5)),et,0,bt,n.range(0,6.28))):Wt===2?n.add(n.place(Ds(n.range(.45,1.5),n.rng()),et,0,bt,n.range(0,6.28))):n.add(n.place(ec(5,.8),et,0,bt))}for(const[R,k,J]of[[.9,8.4,1.6],[2.6,8.7,1.1],[4.3,8.3,1.9],[5.6,8.9,1.2]]){const et=x.x+Math.cos(R)*k,bt=x.z+Math.sin(R)*k;n.add(n.place(Ds(J,R%1,9409947),et,-.12,bt,R)),n.blockCircle(et,bt,.4*J)}for(const[R,k]of[[1.5,8.2],[3.4,8.4],[5.1,8.1],[.2,8.5]])n.add(n.place($1(n.range(1.1,1.6)),x.x+Math.cos(R)*k,0,x.z+Math.sin(R)*k));const y=[[1.1,6.6,1,!0],[2.9,7.2,.8,!1],[4.6,6.1,1.15,!0],[.4,7.4,.9,!0],[3.8,5.2,1.05,!1],[5.9,6.8,.85,!0]];for(const[R,k,J,et]of y){const bt=n.place(Z1(J,et),x.x+Math.cos(R)*k,.045,x.z+Math.sin(R)*k);bt.rotation.y=R,n.add(bt)}const A=c.x-c.largura/2,P=c.x+c.largura/2,C=c.z-c.profundidade/2,D=c.z+c.profundidade/2;n.patch(c.x,c.z,c.largura,c.profundidade,_.grassDark,0,.008,Ys(9));const E=(R,k,J,et)=>{n.patch(R,k,J,et,15922416,0,.012)};E(c.x,C+.3,c.largura-1.2,.28),E(c.x,D-.3,c.largura-1.2,.28),E(A+.6,c.z,.28,c.profundidade-.6),E(P-.6,c.z,.28,c.profundidade-.6),E(A+6,c.z,.22,c.profundidade-.6),E(P-6,c.z,.22,c.profundidade-.6),n.ring(c.x,c.z,2.2,.3,15922416,.012),E(c.x,c.z,.28,c.profundidade-.6);const b=(R,k,J,et)=>{n.add(n.place(Xi(J,1.5,_.metalWhite),R,0,k,et?Math.PI/2:0)),et?n.blockBox(R,k,.2,J/2):n.blockBox(R,k,J/2,.2)};b(c.x,C,c.largura,!1),b(c.x,D,c.largura,!1),b(P,c.z,c.profundidade,!0),b(A,C+3.75,7.5,!0),b(A,D-3.75,7.5,!0),n.add(n.place(Ql(),A+3,0,c.z)),n.blockCircle(A+3,c.z,.5);const L=n.add(n.place(Ql(_.frisbee),P-3,0,c.z));n.blockCircle(P-3,c.z,.5);const z=n.add(n.place(uv(),c.x,0,C+1.2));n.blockBox(c.x,C+1.2,1,.2);const B=n.add(n.place(Sd(6),c.x,0,D-1.2,Math.PI));n.blockBox(c.x,D-1.4,3,.8);const H=n.add(n.place(wd(),A+1.6,0,c.z+4.2,Math.PI/2));n.blockCircle(A+1.6,c.z+4.2,.4);const W=n.add(n.place(fv(),A+1.8,0,c.z-3.4,.4)),q=n.add(n.place(pv(),P-1.6,0,D-2.4));n.blockCircle(P-1.6,D-2.4,.3);const tt=q.userData.manga;n.onUpdate((R,k)=>{q.rotation.y=Math.sin(k*.3)*.5+.6,tt.rotation.z=Math.sin(k*1.7)*.12-.06});for(const[R,k]of[[A+1,C+1],[P-1,C+1],[A+1,D-1],[P-1,D-1]])n.add(n.place(Ed(),R,0,k,Math.atan2(c.x-R,c.z-k))),n.blockCircle(R,k,.4);for(const[R,k]of[[A+6,C+1.4],[A+6,D-1.4],[P-6,C+1.4],[P-6,D-1.4]])n.add(n.place(Kl(),R,0,k));const Y=n.add(n.place(sc("Frisbee!",_.frisbee),A-1.8,0,c.z+3.4,Math.PI*.25));n.blockCircle(A-1.8,c.z+3.4,.3);const st=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[R,k,J]of st)n.banco(R,k,J);for(const[R,k]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,8]])n.add(n.place(qs(!1),R,0,k)),n.blockCircle(R,k,.35);for(const[R,k]of[[3.4,17],[-3.4,11]])n.add(n.place(ea(),R,0,k)),n.blockCircle(R,k,.35);const j=n.add(n.place(_d(),-10,0,20,.3));n.blockBox(-10,20,1,.9,.3);const mt=ev(),vt=na(_.metalRed);vt.position.set(-.78,.82,.3),vt.rotation.set(-Math.PI/2,0,.7),mt.add(vt);const At=na(_.fabricBlue);At.position.set(.82,.82,-.28),At.rotation.set(-Math.PI/2,0,-2.3),mt.add(At);const V=xd();V.position.set(.36,.845,.42),mt.add(V),n.add(n.place(mt,l.x,0,l.z,l.giro)),n.blockBox(l.x,l.z,1.45,.85,l.giro);const ft=[vt,At,V],K=n.add(n.place(nc(16164544,{tipo:"sorvete"}),12,0,18.6,.3));n.blockBox(12,18.6,1.4,.95,.3);const rt=n.add(n.place(nv(_.fabricBlue),s.x,0,s.z));rt.userData.loja=!0,n.blockBox(s.x,s.z-.05,3.7,2.3),n.blockBox(r.x,r.z,.65,1.6);for(const R of[-1,1])n.blockCircle(s.x+R*4.05,s.z+2.82,.16);for(const R of[-1.4,1])n.banco(s.x-5.6,s.z+R,Math.PI/2);for(const[R,k]of[[a.x-a.reta-a.raio-1.4,a.z],[a.x+a.reta+a.raio+1.4,a.z]])n.add(n.place(qs(!1),R,0,k)),n.blockCircle(R,k,.35);const Pt=14;for(let R=0;R<Pt;R++){const k=R/Pt*Math.PI*2,J=R%2===0?a.miolo+.9:a.raio-.9,et=a.x+Math.cos(k)*J+Math.sign(Math.cos(k))*a.reta*Math.abs(Math.cos(k)),bt=a.z+Math.sin(k)*J;n.add(n.place(Kl(),et,0,bt,n.range(0,6.28)))}n.interact({id:"parque:patins",x:r.x+1.8,z:r.z,radius:2.4,label:"Alugar patins",icon:"🛼",highlight:rt,onInteract:async R=>{if(R.hasItem(te.patins.id)){await e([[o,"A gente já pegou um par."],[i,"É, e eu ainda não caí. Ainda."]]);return}await e([[o,"Um par pra cada um, moço."],[i,"Eu não sei patinar direito, hein."],[o,"Por isso eu vou do seu lado."]]),R.equipWearable(te.patins),R.som("sorvete"),R.toast("Patins calçados","🛼"),R.unlock({id:"patins-villa",title:"Patins no Villa",place:"Parque Villa Lobos",note:"A pista tem cone pra desviar e a gente desviou de quase todos.",icon:"🛼"})}});const Ot=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8],[-21,-5,12],[-8.6,2.5,9]],Ut=(R,k)=>Math.abs(R)<4&&k>-20&&k<30?!1:!Ot.some(([J,et,bt])=>Math.hypot(R-J,k-et)<bt),jt=["redonda","redonda","pinheiro","florida","palmeira"];let ee=0;for(let R=0;R<260&&ee<64;R++){const k=n.range(-42,42),J=n.range(-32,30);if(!Ut(k,J))continue;const et=n.range(.85,1.5);n.add(n.place(ta(n.pick(jt),et,n.rng()),k,0,J,n.range(0,6.28))),n.blockCircle(k,J,.45*et),ee++}for(let R=0;R<90;R++){const k=n.range(-42,42),J=n.range(-32,30);Ut(k,J)&&(R%3===0?n.add(n.place(ec(6,1.1),k,0,J)):R%3===1?n.add(n.place(Gs(n.range(.7,1.2)),k,0,J)):n.add(n.place(Ds(n.range(.5,1)),k,0,J)))}n.patch(-66,-10,18,220,_.water,0,.02),n.patch(-55,-10,6,220,_.concrete,0,.03,Os());for(let R=0;R<22;R++){const k=n.range(7,20),J=n.range(4,9);n.add(n.place(Jl(J,k,J*.9,n.pick([_.wallCream,_.concrete,_.wallMint]),_.metalGrey),n.range(-95,60),0,-96-n.range(0,16)))}for(let R=0;R<14;R++){const k=n.range(6,16);n.add(n.place(Jl(n.range(4,8),k,5,_.wallCream,_.roofTile),92+n.range(0,16),0,n.range(-60,40)))}for(let R=0;R<90;R++){const k=R/90*Math.PI*2,J=62+n.range(0,28),et=Math.cos(k)*J,bt=Math.sin(k)*J*.9;et<-50||n.add(n.place(ta(n.pick(jt),n.range(1.2,2.2),n.rng()),et,0,bt,n.range(0,6.28)))}for(let R=0;R<9;R++){const k=Md(n.range(1.6,3.2));k.position.set(n.range(-70,70),n.range(56,70),n.range(-60,45)),n.root.add(k);const J=n.range(.25,.6);n.onUpdate(et=>{k.position.x+=J*et,k.position.x>56&&(k.position.x=-56)})}const F=n.add(n.place(Q1(_.wood,_.metalWhite),2.6,0,27.5,Math.PI));n.add(n.place(Xi(16,1.4),-10,0,28)),n.add(n.place(Xi(16,1.4),10,0,28)),n.blockBox(-10,28,8,.2),n.blockBox(10,28,8,.2),n.add(n.place(Xi(11,1.4),35,0,3.5,Math.PI/2)),n.add(n.place(Xi(11,1.4),35,0,22.5,Math.PI/2)),n.blockBox(35,3.5,.2,5.5),n.blockBox(35,22.5,.2,5.5),n.patch(29.5,13,11,5,_.asphalt,0,.01,Yi()),n.patch(35.6,13,1.6,34,_.concrete,0,.014,Os()),n.patch(40.8,13,8.8,34,_.asphalt,0,.018,Yi());for(let R=-2;R<=28;R+=5)n.patch(40.8,R,.22,2,_.metalWhite,0,.022);const pt=n.add(n.place(Td(4161494),39.5,0,13,-Math.PI/2));n.blockBox(39.5,13,1.5,4.3);const ut=n.add(n.place(Ad(),36.4,0,13,-Math.PI/2));n.blockBox(35.9,13,.3,1.8);const ht=n.add(n.place(sc("Clube!",5161384),36.4,0,8.6,Math.PI*.25));n.blockCircle(36.4,8.6,.3),n.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:pt,radius:2.6}),n.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:F,radius:2.2});const Q=new n2(_.frisbee);Q.mesh.visible=!1,Q.onLand=()=>t.som("quicar"),n.root.add(Q.mesh);const Et=dv();Et.visible=!1,Et.userData.mira=!0,n.root.add(Et);const yt=1.3,Ct=.12,Zt=4,Qt=22,U=.06,T={alem:3.5,arco:1.2,erro:.06,desvio:1.4,alcance:3,raio:2.1,mira:.12},Z={minX:A+1.7,minZ:C+1.7,maxX:P-1.7,maxZ:D-1.7},it=(R,k,J)=>Math.max(k,Math.min(J,R)),gt=(R,k)=>Math.atan2(Math.sin(R-k),Math.cos(R-k)),lt=(R,k)=>Math.hypot(R.x-k.x,R.z-k.z),Ht=[],Tt=(R,k,J,et,bt)=>{const Wt=n.add(n.place(hv(bt,J),R,0,k,Math.PI/2));n.blockCircle(R,k+.96,.36),n.blockCircle(R,k,.75),Ht.push({centro:new N(R,J,k),raio:.58,pontos:et,roda:Wt.userData.aro??null,recarga:0})};Tt(13,-9.4,1.9,1,_.frisbee),Tt(23,1.4,2.1,2,_.gold),Tt(18,-.6,2.5,3,_.frisbee);const Gt=(R,k,J)=>{const et=k.x-R.x,bt=k.y-R.y,Wt=k.z-R.z,ce=et*et+bt*bt+Wt*Wt;if(ce<1e-8)return J.distanceTo(R);const Kt=it(((J.x-R.x)*et+(J.y-R.y)*bt+(J.z-R.z)*Wt)/ce,0,1);return Math.hypot(J.x-(R.x+et*Kt),J.y-(R.y+bt*Kt),J.z-(R.z+Wt*Kt))},qt=(R,k)=>{for(const J of Ht)J.recarga>0||Gt(R,k,J.centro)>J.raio||(J.recarga=1.6,t.som("sino"),t.bump("frisbee.alvos",J.pontos),t.toast(`+${J.pontos} no alvo!`,"🎯"))},St=R=>{for(const k of Ht)k.recarga<=0||(k.recarga=Math.max(0,k.recarga-R),k.roda&&(k.roda.rotation.z+=R*9*k.recarga))};let Mt="fora",Yt=0,Vt=0,Lt=!1,$t=0,G=null;const wt=new N,Rt=new N;let Ft=!1,_t=null,dt=0,Bt=!1,Jt=!0,_e=0;const de=R=>{t.toast(R[Math.floor(Math.random()*R.length)],"💬")},rn=(R,k)=>{const J=Math.sin(k),et=Math.cos(k),bt=J>.001?(Z.maxX-R.x)/J:J<-.001?(Z.minX-R.x)/J:1/0,Wt=et>.001?(Z.maxZ-R.z)/et:et<-.001?(Z.minZ-R.z)/et:1/0;return it(Math.min(bt,Wt)-1,Zt+3,Qt)},tn=(R,k,J)=>Zt+(rn(R,k)-Zt)*it(J,0,1),ts=(R,k,J)=>{const et=rn(R,k);return it((J-Zt)/Math.max(.01,et-Zt),0,1)},gn=(R,k,J)=>{const et=ts(R,k,Math.hypot(J.x-R.x,J.z-R.z));return et>.02&&et<.99?et:null},mo=R=>1.35-.45*it(R,0,1),hi=(R,k)=>{R.som("pegar"),$t+=1;const J=R.bump("frisbee.trocas"),et=R.stat("frisbee.recorde");$t>et&&R.bump("frisbee.recorde",$t-et),k?R.toast("Pegou no ar!","🥏"):$t%5===0&&R.toast(`${$t} trocas seguidas!`,"🥏"),J>=10&&!R.flag("memoria-frisbee")&&(R.setFlag("memoria-frisbee"),R.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"})),$t>=10&&!R.flag("memoria-frisbee-dez")&&(R.setFlag("memoria-frisbee-dez"),R.unlock({id:"frisbee-dez",title:"Dez sem deixar cair",place:"Parque Villa Lobos",note:"Dez trocas seguidas e nenhuma no chão. A gente parou porque deu fome, não porque errou.",icon:"🏆"}))},es=R=>{const k=R.x<c.x?1:-1;return{x:it(R.x+k*11,A+2,P-2),z:it(R.z,C+2,D-2)}},$n=()=>{Lt=!1,Vt=0,Et.visible=!1,t.showCharge(null)},go=()=>t.getActiveHandItem()?.id===te.frisbee.id;let Zn=!1;const ns=()=>{const R=t.addItem(te.frisbee);return R==="cheio"?(Zn||(Zn=!0,t.toast("Sem vaga pro frisbee","🥏")),!1):(Mt="comigo",Q.pickUp(),$t=0,G=null,t.setZoom(19),t.toast(R==="mao"?"Segure F e solte no traço da barra":"Frisbee guardado — escolha ele na mochila (I)","🥏"),!0)},is=()=>{Mt="fora",Zn=!1,t.removeItem(te.frisbee.id),Q.mesh.visible=!1,$n(),t.freeCompanion(),t.setZoom(14),G=null,_t=null},os=(R,k=0,J=!0)=>{if(Mt!=="comigo"||!go())return;t.removeItem(te.frisbee.id);const et=t.playerPosition(),bt=t.playerFacing(),Wt=it(R,0,1),ce=gn(et,bt,t.companionPosition());Ft=J&&ce!==null&&Math.abs(Wt-ce)<=U,wt.copy(et),Rt.copy(t.companionPosition()),Q.throwAt(et,bt,tn(et,bt,Wt),mo(Wt),k),t.som("lancar"),Bt=!1,Jt=!0,_t=null,dt=0,Mt="voando-pra-ele"},ss=()=>{const R=gn(t.playerPosition(),t.playerFacing(),t.companionPosition());os(R??.5,0,!1)},vo=n.interact({id:"parque:frisbee-jogar",x:c.x,z:c.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>ss()}),_o=n.interact({id:"parque:frisbee-pegar",x:c.x,z:c.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:R=>{R.addItem(te.frisbee)!=="cheio"&&(Q.pickUp(),Mt="comigo",hi(R,!1))}});n.onUpdate((R,k)=>{const J=Q.position.clone();Q.update(R,Z);const et=t.playerPosition(),bt=t.companionPosition(),Wt=t.playerFacing(),ce=h(et.x,et.z,.4);if(ce&&Mt==="fora"?ns():!ce&&Mt!=="fora"&&is(),Mt==="fora"){vo.enabled=!1,_o.enabled=!1,Et.visible=!1,_e=Wt;return}if(Q.state==="voando"&&qt(J,Q.position),St(R),Mt==="comigo"&&go()){if(t.keyDown("KeyF")){Lt=!0,Vt=Math.min(1,Vt+R/yt),t.showCharge(Vt,gn(et,Wt,bt),U);const Kt=tn(et,Wt,Vt);Et.position.set(et.x+Math.sin(Wt)*Kt,0,et.z+Math.cos(Wt)*Kt),Et.scale.setScalar(1+Math.sin(k*9)*.06),Et.visible=!0}else if(Lt){const Kt=Vt,ne=R>1e-4?gt(Wt,_e)/R:0;$n(),Kt<Ct?ss():os(Kt,it(ne*.18,-2.5,2.5))}}else Lt&&$n();if(_e=Wt,Mt==="comigo"||Mt==="no-chao"){const Kt=es(et);(!G||Math.hypot(Kt.x-G.x,Kt.z-G.z)>2.5)&&(t.commandCompanion(Kt.x,Kt.z),G=Kt)}switch(Q.mesh.userData.fase=Mt,Mt){case"comigo":Q.holdAt(et,Wt),Q.mesh.visible=!1;break;case"com-ele":{const Kt=Math.atan2(et.x-bt.x,et.z-bt.z);t.holdCompanion(et.x,et.z),Q.holdAt(bt,Kt),Yt-=R;const ne=Math.abs(gt(t.companionFacing(),Kt))<T.mira;if(Yt<=0&&(ne||Yt<-1)){const Xt=et.x-bt.x,ye=et.z-bt.z,ue=Math.hypot(Xt,ye)||1,Ue=Math.random(),Jn=Ue<.3?T.arco*1.35:Ue>.85?.95:T.arco,He=Ue>.85?T.erro*2.5:T.erro,di=new N(it(et.x+Xt/ue*T.alem+(Math.random()-.5)*T.desvio,A+1.5,P-1.5),0,it(et.z+ye/ue*T.alem+(Math.random()-.5)*T.desvio,C+1.5,D-1.5));Q.throwToward(bt,di,He,Jn,(Math.random()-.5)*1),t.som("lancar"),G=null,Mt="voando-pra-mim"}break}case"voando-pra-ele":{if(dt-=R,Q.state==="voando"&&dt<=0){dt=.25;const ne=Q.ondeVaiCair(Z);(!_t||_t.distanceTo(ne)>.8)&&(_t=ne,t.commandCompanion(ne.x,ne.z),G=null)}const Kt=Q.state==="voando"&&Q.position.y<2.3&&lt(wt,Q.position)>2&&Math.hypot(Q.position.x-bt.x,Q.position.z-bt.z)<1.5;if(Kt&&!Bt){Bt=!0;const ne=lt(Rt,Q.position),Xt=it(.98-Q.rasante*.022-ne*.02+(Ft?.2:0),.35,.98);Jt=Math.random()<Xt}if(Kt&&Jt){t.som("pegar"),t.holdCompanion(et.x,et.z),G=null,_t=null;const ne=Math.round(lt(wt,Q.position));Q.pickUp(),Yt=.7,Mt="com-ele",Ft?(t.som("confirma"),t.bump("frisbee.perfeitos"),t.toast("Passe perfeito!","🎯"),de(["Na mão! Perfeito.","Esse foi bonito, hein.","Assim fica fácil."])):(t.toast("Ele pegou no ar!","🙌"),de(["Peguei!","Isso! Manda de novo.","Tá vendo? Sou bom nisso."]));const Xt=t.stat("frisbee.maiorPasse");ne>Xt&&(t.bump("frisbee.maiorPasse",ne-Xt),t.toast(`Novo recorde: ${ne} m`,"📏"));break}Q.state==="chao"&&(Bt&&!Jt?de(["Ah, escapou!","Raspou na minha mão!","Essa eu deixei, admito."]):lt(wt,Q.position)>16&&de(["Calma, não sou cachorro!","Jogou pra longe demais.","Vou ter que correr até lá?"]),$t=0,Q.position.distanceTo(bt)<1.6?(t.holdCompanion(et.x,et.z),G=null,_t=null,Q.pickUp(),Yt=.8,Mt="com-ele"):(t.commandCompanion(Q.position.x,Q.position.z),G=null,Mt="buscando"));break}case"buscando":Q.position.distanceTo(bt)<1.1&&(t.holdCompanion(et.x,et.z),G=null,_t=null,Q.pickUp(),Yt=.9,Mt="com-ele");break;case"voando-pra-mim":{if(Q.state==="voando"&&Q.position.y<T.alcance&&Math.hypot(Q.position.x-et.x,Q.position.z-et.z)<T.raio){if(t.addItem(te.frisbee)==="cheio")break;Q.pickUp(),Mt="comigo",hi(t,!0);break}Q.state==="chao"&&(Mt="no-chao",$t=0,Q.position.distanceTo(et)<1.9&&t.addItem(te.frisbee)!=="cheio"&&(Q.pickUp(),Mt="comigo",hi(t,!1)));break}case"no-chao":Q.position.distanceTo(et)<1.2&&t.addItem(te.frisbee)!=="cheio"&&(Q.pickUp(),Mt="comigo",hi(t,!1));break}vo.enabled=Mt==="comigo"&&!Lt,_o.enabled=Mt==="no-chao",Mt==="comigo"?vo.moveTo(et.x,et.z):_o.moveTo(Q.position.x,Q.position.z)}),n.interact({id:"parque:placa-quadra",x:A-1.8,z:c.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:Y,onInteract:()=>e([[o,"QUADRA LIVRE — respeite quem chegou primeiro."],[i,"Hoje só tem a gente."],[o,"Então segura o F. A marca no chão mostra onde o disco vai cair, e o traço na barra é onde eu estou."],[i,"E se eu quiser mostrar serviço?"],[o,"Acerta um dos aros. Ou uma cesta, se estiver se achando."]])}),n.interact({id:"parque:placar",x:c.x,z:C+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:z,onInteract:R=>{const k=R.stat("frisbee.recorde"),J=R.stat("frisbee.trocas"),et=R.stat("frisbee.perfeitos"),bt=R.stat("frisbee.alvos"),Wt=R.stat("frisbee.maiorPasse"),ce=[[i,k>0?`Nosso recorde é ${k} trocas seguidas.`:"O placar tá zerado."],[o,J>0?`E já foram ${J} no total. A gente não desiste fácil.`:"Bora estrear isso então."]];return Wt>0&&ce.push([i,`O passe mais longo que colou foi de ${Wt} metros.`]),et>0&&ce.push([o,`${et} ${et===1?"passe caiu":"passes caíram"} certinho na minha mão.`]),bt>0&&ce.push([i,`E ${bt} ${bt===1?"ponto":"pontos"} nos alvos. Anota aí.`]),e(ce)}}),n.interact({id:"parque:arquibancada",x:c.x,z:D-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:B,onInteract:()=>e([[o,"Cansei. Cinco minutos."],[i,"Você falou cinco minutos faz meia hora."],[o,"E olha que descanso bem, hein."]])}),n.interact({id:"parque:bebedouro",x:A+2.8,z:c.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:H,onInteract:async R=>{await e([[i,"A água daqui é sempre meio quente."],[o,"Mas depois de correr atrás de disco, tá ótima."]]),R.toast("Água (meio quente)","🚰")}}),n.interact({id:"parque:sacola",x:A+2.8,z:c.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:W,onInteract:()=>e([[o,"Tem uns três discos aqui de gente que esqueceu."],[i,"Um deles é seu. Desde março."],[o,"…é, pode ser."]])}),n.interact({id:"parque:cesta",x:P-4.4,z:c.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:L,onInteract:()=>e([[i,"Um dia a gente acerta essa cesta."],[o,"Já acertei uma vez!"],[i,"Você acertou o poste. É diferente."]])}),n.interact({id:"parque:biruta",x:P-3,z:D-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:q,onInteract:()=>e([[o,"O vento tá indo pra lá."],[i,"Então joga contra que o disco fica no ar mais tempo."],[o,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),n.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:ut,onInteract:()=>e([[i,"Esse é o que passa no clube?"],[o,"É esse. Já tá parado, é só subir."]])}),n.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:ht,onInteract:()=>e([[o,'"Clube!" — com exclamação e tudo.'],[i,"Quem escreveu isso tava animado."]])}),n.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async R=>{R.som("pato"),await R.say(["Que lago bonito... dá até vontade de pular"],Tn.name),await R.say(["Então vamos! Hahahha"],Dn.name),await R.say(["NÃAAOOO"],Tn.name),R.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});let Ii=0;n.onUpdate(R=>{Ii<=0||(Ii-=R,Ii<=0&&(t.removeItem(te.sorveteMorango.id,Dn.id),t.removeItem(te.sorveteMaracuja.id,Tn.id),t.toast("Acabou o sorvete","🍦")))});const Ve=new c2(5);Ve.guardar(),mt.add(Ve.grupo),Ve.onSom=R=>t.som(R),mt.userData.pingpong=Ve;const I=(R,k)=>{const J=new N(R,0,k);return mt.localToWorld(J),J};let X=!1;const ot=l2.plano+.55,at=()=>{X=!1,Ve.guardar();for(const R of ft)R.visible=!0;t.showPlacar(null),t.setCameraOmbro(null),t.setPlayerVisible(!0),t.lockPlayer(!1),t.freeCompanion(),$.enabled=!0};n.onUpdate(R=>{X&&(Ve.update(R,t.pointer()),X&&t.showPlacar({eu:t.playerName(),ele:t.companionName(),meus:Ve.meus,dele:Ve.dele}))});const $=n.interact({id:"parque:pingpong",x:l.x,z:l.z,radius:2.6,label:"Jogar ping pong",icon:"🏓",highlight:mt,onInteract:async R=>{if(X)return;await e([[i,"Cinco pontos?"],[o,"Cinco pontos. E o perdedor carrega a bolsa até em casa."]]);const k=I(-ot,0),J=I(ot,0);R.releasePlayer(k.x,k.z,Math.atan2(J.x-k.x,J.z-k.z)),R.releaseCompanion(J.x,J.z,Math.atan2(k.x-J.x,k.z-J.z)),R.holdCompanion(k.x,k.z),R.lockPlayer(!0);const et=I(-ot-1.6,0),bt=I(0,0);R.setCameraOmbro(new N(et.x,2.35,et.z),new N(bt.x,.9,bt.z)),R.setPlayerVisible(!1);for(const Wt of ft)Wt.visible=!1;$.enabled=!1,Ve.comecar(),X=!0,R.toast("Mexa o mouse para mover a raquete","🏓")}});Ve.onPonto=R=>{t.som(R?"confirma":"quicar")},Ve.onFim=R=>{(async()=>(at(),R?(t.som("memoria"),t.toast("Campeão de ping pong!","🏆"),t.equipWearable(te.chapeuPingPong),await e([[i,"Cinco a "+Ve.dele+"."],[o,"Você ganhou o chapéu. Vai ter que usar."]]),t.unlock({id:"memoria-ping-pong",title:"A mesa do parque",place:"Parque Villa Lobos",note:"Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.",icon:"🏓"})):await e([[o,"Cinco a "+Ve.meus+". Revanche?"],[i,"Sempre revanche."]])))()},n.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:K,onInteract:async R=>{await e([[i,"Dois, por favor."],[o,"Um de morango e um de maracujá."],[i,"Nunca pedimos diferente."]]),Ii=50,R.addItem(te.sorveteMorango,Dn.id),R.addItem(te.sorveteMaracuja,Tn.id),R.som("sorvete"),R.toast("Morango e maracujá","🍦"),R.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),n.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:j,onInteract:async R=>{await e([[o,"A toalha xadrez de sempre."],[i,"E o pão de queijo já frio."],[o,"Frio é melhor. Aceita."]]),R.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),n.interact({id:"parque:bilheteria",x:8.9,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:m,onInteract:()=>e([[i,"Dois pra roda gigante."],[o,"Sempre dois."]])});let xt=null;const Nt=R=>new Promise(k=>{xt={resolve:k,de:M.angle,voltas:R}});let kt=!0;n.onUpdate(R=>{if(M.update(R),kt){const k=t.playerPosition(),J=Math.hypot(k.x,k.z+26);if(J<28){const et=Math.max(0,Math.min(1,(J-8)/20));t.setZoom(36-et*21)}}if(S.forEach((k,J)=>{k.position.y=.1+Math.sin(performance.now()/900+J)*.05}),xt&&M.turnsSince(xt.de)>=xt.voltas){const k=xt.resolve;xt=null,k()}}),n.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async R=>{kt=!1,R.lockPlayer(!0),await e([[o,"A fila tá curta hoje."],[i,"Bora subir?"]]);const k=M.boardingCabin(),J=M.speed;M.speed=J*5,R.som("sino"),R.ridePlayer(k,new N(-.3,-.34,0),.55),R.rideCompanion(k,new N(.3,-.34,0),.55),R.focusCamera(k),R.setZoom(38),await Nt(.25),await e([[i,"Daqui dá pra ver o parque inteiro."],[o,"E aquele pedacinho do rio ali atrás."]]),await Nt(.35),await e([[i,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[o,"Pronto. Subimos."]]),await Nt(.4),M.speed=J,R.focusCamera(null),R.releasePlayer(0,-17.6,0),R.releaseCompanion(-1.1,-17.9,0),R.lockPlayer(!1),kt=!0,R.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},h2={[gc.id]:gc,[Mh.id]:Mh,[bh.id]:bh,[gh.id]:gh},d2=gc.id,Vd=document.getElementById("app");if(!Vd)throw new Error("#app nao encontrado");const fa=new C_(Vd,h2,Y_,d2),Qo=new URLSearchParams(location.search),u2=Qo.get("cena")??void 0,f2=Qo.get("entrada")??void 0;fa.start(u2,f2);const cr=Number(Qo.get("zoom"));Number.isFinite(cr)&&cr>0&&fa.setZoom(cr);const To=Qo.get("em")?.split(",").map(Number);if(To&&To.length===2&&To.every(Number.isFinite)){const n=Number(Qo.get("olhar"));fa.debugPlace(To[0],To[1],Number.isFinite(n)?n:Math.PI/4)}window.jogo=fa;window.aristoryAudio={Musica:Nd,CLIMAS:js,EFEITOS:Ud};window.aristoryItens=Object.fromEntries(Object.values(te).map(n=>[n.id,n]));window.aristoryMemorias=hc.map(n=>({id:n.id,titulo:n.titulo}));
