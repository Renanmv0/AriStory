(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Pa="180",Bh=0,Ka=1,kh=2,Il=1,Ll=2,Ln=3,Bn=0,Xe=1,mn=2,Jn=0,zi=1,$a=2,Qa=3,tc=4,Vh=5,li=100,Hh=101,Gh=102,Wh=103,qh=104,Xh=200,Yh=201,jh=202,Jh=203,Mr=204,yr=205,Zh=206,Kh=207,$h=208,Qh=209,tu=210,eu=211,nu=212,iu=213,su=214,Sr=0,br=1,wr=2,ki=3,Er=4,Tr=5,Ar=6,Cr=7,Dl=0,ou=1,ru=2,Zn=0,au=1,cu=2,lu=3,hu=4,uu=5,du=6,fu=7,Ul=300,Vi=301,Hi=302,Rr=303,Pr=304,wo=306,Ir=1e3,ui=1001,Lr=1002,Ge=1003,pu=1004,Ps=1005,yn=1006,Lo=1007,di=1008,En=1009,Nl=1010,Fl=1011,ms=1012,Ia=1013,pi=1014,Nn=1015,Ts=1016,La=1017,Da=1018,gs=1020,Ol=35902,zl=35899,Bl=1021,kl=1022,_n=1023,vs=1026,_s=1027,Ua=1028,Na=1029,Vl=1030,Fa=1031,Oa=1033,ro=33776,ao=33777,co=33778,lo=33779,Dr=35840,Ur=35841,Nr=35842,Fr=35843,Or=36196,zr=37492,Br=37496,kr=37808,Vr=37809,Hr=37810,Gr=37811,Wr=37812,qr=37813,Xr=37814,Yr=37815,jr=37816,Jr=37817,Zr=37818,Kr=37819,$r=37820,Qr=37821,ta=36492,ea=36494,na=36495,ia=36283,sa=36284,oa=36285,ra=36286,mu=3200,gu=3201,Hl=0,vu=1,jn="",en="srgb",Gi="srgb-linear",vo="linear",_e="srgb",Mi=7680,ec=519,_u=512,xu=513,Mu=514,Gl=515,yu=516,Su=517,bu=518,wu=519,nc=35044,ic="300 es",Sn=2e3,_o=2001;class Xi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const o=s.indexOf(e);o!==-1&&s.splice(o,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let o=0,r=s.length;o<r;o++)s[o].call(this,t);t.target=null}}}const Fe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let sc=1234567;const hs=Math.PI/180,xs=180/Math.PI;function _i(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Fe[i&255]+Fe[i>>8&255]+Fe[i>>16&255]+Fe[i>>24&255]+"-"+Fe[t&255]+Fe[t>>8&255]+"-"+Fe[t>>16&15|64]+Fe[t>>24&255]+"-"+Fe[e&63|128]+Fe[e>>8&255]+"-"+Fe[e>>16&255]+Fe[e>>24&255]+Fe[n&255]+Fe[n>>8&255]+Fe[n>>16&255]+Fe[n>>24&255]).toLowerCase()}function ne(i,t,e){return Math.max(t,Math.min(e,i))}function za(i,t){return(i%t+t)%t}function Eu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Tu(i,t,e){return i!==t?(e-i)/(t-i):0}function us(i,t,e){return(1-e)*i+e*t}function Au(i,t,e,n){return us(i,t,1-Math.exp(-e*n))}function Cu(i,t=1){return t-Math.abs(za(i,t*2)-t)}function Ru(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Pu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Iu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Lu(i,t){return i+Math.random()*(t-i)}function Du(i){return i*(.5-Math.random())}function Uu(i){i!==void 0&&(sc=i);let t=sc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nu(i){return i*hs}function Fu(i){return i*xs}function Ou(i){return(i&i-1)===0&&i!==0}function zu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Bu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function ku(i,t,e,n,s){const o=Math.cos,r=Math.sin,a=o(e/2),c=r(e/2),l=o((t+n)/2),h=r((t+n)/2),u=o((t-n)/2),d=r((t-n)/2),f=o((n-t)/2),g=r((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*f,a*l);break;case"YXY":i.set(c*f,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Fi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Ve(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Ue={DEG2RAD:hs,RAD2DEG:xs,generateUUID:_i,clamp:ne,euclideanModulo:za,mapLinear:Eu,inverseLerp:Tu,lerp:us,damp:Au,pingpong:Cu,smoothstep:Ru,smootherstep:Pu,randInt:Iu,randFloat:Lu,randFloatSpread:Du,seededRandom:Uu,degToRad:Nu,radToDeg:Fu,isPowerOfTwo:Ou,ceilPowerOfTwo:zu,floorPowerOfTwo:Bu,setQuaternionFromProperEuler:ku,normalize:Ve,denormalize:Fi};class St{constructor(t=0,e=0){St.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),o=this.x-t.x,r=this.y-t.y;return this.x=o*n-r*s+t.x,this.y=o*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Yi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,o,r,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=o[r+0],f=o[r+1],g=o[r+2],_=o[r+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==f||h!==g){let m=1-a;const p=c*d+l*f+h*g+u*_,T=p>=0?1:-1,b=1-p*p;if(b>Number.EPSILON){const L=Math.sqrt(b),w=Math.atan2(L,p*T);m=Math.sin(m*w)/L,a=Math.sin(a*w)/L}const x=a*T;if(c=c*m+d*x,l=l*m+f*x,h=h*m+g*x,u=u*m+_*x,m===1-a){const L=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=L,l*=L,h*=L,u*=L}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,o,r){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=o[r],d=o[r+1],f=o[r+2],g=o[r+3];return t[e]=a*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-a*f,t[e+2]=l*g+h*f+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,o=t._z,r=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(o/2),d=c(n/2),f=c(s/2),g=c(o/2);switch(r){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],o=e[8],r=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(o-l)*f,this._z=(r-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(o+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(o-l)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(r-s)/f,this._x=(o+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,o=t._z,r=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+r*a+s*l-o*c,this._y=s*h+r*c+o*a-n*l,this._z=o*h+r*l+n*c-s*a,this._w=r*h-n*a-s*c-o*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,o=this._z,r=this._w;let a=r*t._w+n*t._x+s*t._y+o*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=r,this._x=n,this._y=s,this._z=o,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*r+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*o+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=r*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=o*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),o=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),o*Math.sin(e),o*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class U{constructor(t=0,e=0,n=0){U.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(oc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(oc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[3]*n+o[6]*s,this.y=o[1]*e+o[4]*n+o[7]*s,this.z=o[2]*e+o[5]*n+o[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=t.elements,r=1/(o[3]*e+o[7]*n+o[11]*s+o[15]);return this.x=(o[0]*e+o[4]*n+o[8]*s+o[12])*r,this.y=(o[1]*e+o[5]*n+o[9]*s+o[13])*r,this.z=(o[2]*e+o[6]*n+o[10]*s+o[14])*r,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,o=t.x,r=t.y,a=t.z,c=t.w,l=2*(r*s-a*n),h=2*(a*e-o*s),u=2*(o*n-r*e);return this.x=e+c*l+r*u-a*h,this.y=n+c*h+a*l-o*u,this.z=s+c*u+o*h-r*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s,this.y=o[1]*e+o[5]*n+o[9]*s,this.z=o[2]*e+o[6]*n+o[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,o=t.z,r=e.x,a=e.y,c=e.z;return this.x=s*c-o*a,this.y=o*r-n*c,this.z=n*a-s*r,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Do.copy(this).projectOnVector(t),this.sub(Do)}reflect(t){return this.sub(Do.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Do=new U,oc=new Yi;class $t{constructor(t,e,n,s,o,r,a,c,l){$t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l)}set(t,e,n,s,o,r,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=o,h[5]=c,h[6]=n,h[7]=r,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=s[0],m=s[3],p=s[6],T=s[1],b=s[4],x=s[7],L=s[2],w=s[5],C=s[8];return o[0]=r*_+a*T+c*L,o[3]=r*m+a*b+c*w,o[6]=r*p+a*x+c*C,o[1]=l*_+h*T+u*L,o[4]=l*m+h*b+u*w,o[7]=l*p+h*x+u*C,o[2]=d*_+f*T+g*L,o[5]=d*m+f*b+g*w,o[8]=d*p+f*x+g*C,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*r*h-e*a*l-n*o*h+n*a*c+s*o*l-s*r*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*r-a*l,d=a*c-h*o,f=l*o-r*c,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(s*l-h*n)*_,t[2]=(a*n-s*r)*_,t[3]=d*_,t[4]=(h*e-s*c)*_,t[5]=(s*o-a*e)*_,t[6]=f*_,t[7]=(n*c-l*e)*_,t[8]=(r*e-n*o)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,o,r,a){const c=Math.cos(o),l=Math.sin(o);return this.set(n*c,n*l,-n*(c*r+l*a)+r+t,-s*l,s*c,-s*(-l*r+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Uo.makeScale(t,e)),this}rotate(t){return this.premultiply(Uo.makeRotation(-t)),this}translate(t,e){return this.premultiply(Uo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Uo=new $t;function Wl(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function xo(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vu(){const i=xo("canvas");return i.style.display="block",i}const rc={};function Ms(i){i in rc||(rc[i]=!0,console.warn(i))}function Hu(i,t,e){return new Promise(function(n,s){function o(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(o,e);break;default:n()}}setTimeout(o,e)})}const ac=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cc=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gu(){const i={enabled:!0,workingColorSpace:Gi,spaces:{},convert:function(s,o,r){return this.enabled===!1||o===r||!o||!r||(this.spaces[o].transfer===_e&&(s.r=zn(s.r),s.g=zn(s.g),s.b=zn(s.b)),this.spaces[o].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[o].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===_e&&(s.r=Bi(s.r),s.g=Bi(s.g),s.b=Bi(s.b))),s},workingToColorSpace:function(s,o){return this.convert(s,this.workingColorSpace,o)},colorSpaceToWorking:function(s,o){return this.convert(s,o,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===jn?vo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,o=this.workingColorSpace){return s.fromArray(this.spaces[o].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,o,r){return s.copy(this.spaces[o].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,o){return Ms("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,o)},toWorkingColorSpace:function(s,o){return Ms("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,o)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Gi]:{primaries:t,whitePoint:n,transfer:vo,toXYZ:ac,fromXYZ:cc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:t,whitePoint:n,transfer:_e,toXYZ:ac,fromXYZ:cc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:en}}}),i}const de=Gu();function zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Bi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let yi;class Wu{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{yi===void 0&&(yi=xo("canvas")),yi.width=t.width,yi.height=t.height;const s=yi.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=yi}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=xo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),o=s.data;for(let r=0;r<o.length;r++)o[r]=zn(o[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zn(e[n]/255)*255):e[n]=zn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let qu=0;class Ba{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=_i(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let o;if(Array.isArray(s)){o=[];for(let r=0,a=s.length;r<a;r++)s[r].isDataTexture?o.push(No(s[r].image)):o.push(No(s[r]))}else o=No(s);n.url=o}return e||(t.images[this.uuid]=n),n}}function No(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Wu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Xu=0;const Fo=new U;class Be extends Xi{constructor(t=Be.DEFAULT_IMAGE,e=Be.DEFAULT_MAPPING,n=ui,s=ui,o=yn,r=di,a=_n,c=En,l=Be.DEFAULT_ANISOTROPY,h=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xu++}),this.uuid=_i(),this.name="",this.source=new Ba(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=o,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new St(0,0),this.repeat=new St(1,1),this.center=new St(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Fo).x}get height(){return this.source.getSize(Fo).y}get depth(){return this.source.getSize(Fo).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ul)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ir:t.x=t.x-Math.floor(t.x);break;case ui:t.x=t.x<0?0:1;break;case Lr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ir:t.y=t.y-Math.floor(t.y);break;case ui:t.y=t.y<0?0:1;break;case Lr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=Ul;Be.DEFAULT_ANISOTROPY=1;class Re{constructor(t=0,e=0,n=0,s=1){Re.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,o=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*o,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*o,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*o,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*o,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,o;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],_=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(l+1)/2,x=(f+1)/2,L=(p+1)/2,w=(h+d)/4,C=(u+_)/4,R=(g+m)/4;return b>x&&b>L?b<.01?(n=0,s=.707106781,o=.707106781):(n=Math.sqrt(b),s=w/n,o=C/n):x>L?x<.01?(n=.707106781,s=0,o=.707106781):(s=Math.sqrt(x),n=w/s,o=R/s):L<.01?(n=.707106781,s=.707106781,o=0):(o=Math.sqrt(L),n=C/o,s=R/o),this.set(n,s,o,e),this}let T=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(T)<.001&&(T=1),this.x=(m-g)/T,this.y=(u-_)/T,this.z=(d-h)/T,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yu extends Xi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Re(0,0,t,e),this.scissorTest=!1,this.viewport=new Re(0,0,t,e);const s={width:t,height:e,depth:n.depth},o=new Be(s);this.textures=[];const r=n.count;for(let a=0;a<r;a++)this.textures[a]=o.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:yn,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,o=this.textures.length;s<o;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ba(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mi extends Yu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class ql extends Be{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ju extends Be{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ge,this.minFilter=Ge,this.wrapR=ui,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ji{constructor(t=new U(1/0,1/0,1/0),e=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const o=n.getAttribute("position");if(e===!0&&o!==void 0&&t.isInstancedMesh!==!0)for(let r=0,a=o.count;r<a;r++)t.isMesh===!0?t.getVertexPosition(r,hn):hn.fromBufferAttribute(o,r),hn.applyMatrix4(t.matrixWorld),this.expandByPoint(hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Is.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Is.copy(n.boundingBox)),Is.applyMatrix4(t.matrixWorld),this.union(Is)}const s=t.children;for(let o=0,r=s.length;o<r;o++)this.expandByObject(s[o],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,hn),hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ts),Ls.subVectors(this.max,ts),Si.subVectors(t.a,ts),bi.subVectors(t.b,ts),wi.subVectors(t.c,ts),Hn.subVectors(bi,Si),Gn.subVectors(wi,bi),ti.subVectors(Si,wi);let e=[0,-Hn.z,Hn.y,0,-Gn.z,Gn.y,0,-ti.z,ti.y,Hn.z,0,-Hn.x,Gn.z,0,-Gn.x,ti.z,0,-ti.x,-Hn.y,Hn.x,0,-Gn.y,Gn.x,0,-ti.y,ti.x,0];return!Oo(e,Si,bi,wi,Ls)||(e=[1,0,0,0,1,0,0,0,1],!Oo(e,Si,bi,wi,Ls))?!1:(Ds.crossVectors(Hn,Gn),e=[Ds.x,Ds.y,Ds.z],Oo(e,Si,bi,wi,Ls))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(An[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),An[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),An[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),An[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),An[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),An[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),An[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),An[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(An),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const An=[new U,new U,new U,new U,new U,new U,new U,new U],hn=new U,Is=new ji,Si=new U,bi=new U,wi=new U,Hn=new U,Gn=new U,ti=new U,ts=new U,Ls=new U,Ds=new U,ei=new U;function Oo(i,t,e,n,s){for(let o=0,r=i.length-3;o<=r;o+=3){ei.fromArray(i,o);const a=s.x*Math.abs(ei.x)+s.y*Math.abs(ei.y)+s.z*Math.abs(ei.z),c=t.dot(ei),l=e.dot(ei),h=n.dot(ei);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Ju=new ji,es=new U,zo=new U;class Eo{constructor(t=new U,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Ju.setFromPoints(t).getCenter(n);let s=0;for(let o=0,r=t.length;o<r;o++)s=Math.max(s,n.distanceToSquared(t[o]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;es.subVectors(t,this.center);const e=es.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(es,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(zo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(es.copy(t.center).add(zo)),this.expandByPoint(es.copy(t.center).sub(zo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const Cn=new U,Bo=new U,Us=new U,Wn=new U,ko=new U,Ns=new U,Vo=new U;class Xl{constructor(t=new U,e=new U(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=Cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Cn.copy(this.origin).addScaledVector(this.direction,e),Cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Bo.copy(t).add(e).multiplyScalar(.5),Us.copy(e).sub(t).normalize(),Wn.copy(this.origin).sub(Bo);const o=t.distanceTo(e)*.5,r=-this.direction.dot(Us),a=Wn.dot(this.direction),c=-Wn.dot(Us),l=Wn.lengthSq(),h=Math.abs(1-r*r);let u,d,f,g;if(h>0)if(u=r*c-a,d=r*a-c,g=o*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,f=u*(u+r*d+2*a)+d*(r*u+d+2*c)+l}else d=o,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*c)+l;else d=-o,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-r*o+a)),d=u>0?-o:Math.min(Math.max(-o,-c),o),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-o,-c),o),f=d*(d+2*c)+l):(u=Math.max(0,-(r*o+a)),d=u>0?o:Math.min(Math.max(-o,-c),o),f=-u*u+d*(d+2*c)+l);else d=r>0?-o:o,u=Math.max(0,-(r*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Bo).addScaledVector(Us,d),f}intersectSphere(t,e){Cn.subVectors(t.center,this.origin);const n=Cn.dot(this.direction),s=Cn.dot(Cn)-n*n,o=t.radius*t.radius;if(s>o)return null;const r=Math.sqrt(o-s),a=n-r,c=n+r;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,o,r,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(o=(t.min.y-d.y)*h,r=(t.max.y-d.y)*h):(o=(t.max.y-d.y)*h,r=(t.min.y-d.y)*h),n>r||o>s||((o>n||isNaN(n))&&(n=o),(r<s||isNaN(s))&&(s=r),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Cn)!==null}intersectTriangle(t,e,n,s,o){ko.subVectors(e,t),Ns.subVectors(n,t),Vo.crossVectors(ko,Ns);let r=this.direction.dot(Vo),a;if(r>0){if(s)return null;a=1}else if(r<0)a=-1,r=-r;else return null;Wn.subVectors(this.origin,t);const c=a*this.direction.dot(Ns.crossVectors(Wn,Ns));if(c<0)return null;const l=a*this.direction.dot(ko.cross(Wn));if(l<0||c+l>r)return null;const h=-a*Wn.dot(Vo);return h<0?null:this.at(h/r,o)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ee{constructor(t,e,n,s,o,r,a,c,l,h,u,d,f,g,_,m){Ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,o,r,a,c,l,h,u,d,f,g,_,m)}set(t,e,n,s,o,r,a,c,l,h,u,d,f,g,_,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=o,p[5]=r,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ee().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/Ei.setFromMatrixColumn(t,0).length(),o=1/Ei.setFromMatrixColumn(t,1).length(),r=1/Ei.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*o,e[5]=n[5]*o,e[6]=n[6]*o,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,o=t.z,r=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(o),u=Math.sin(o);if(t.order==="XYZ"){const d=r*h,f=r*u,g=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=g+f*l,e[10]=r*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d+_*a,e[4]=g*a-f,e[8]=r*l,e[1]=r*u,e[5]=r*h,e[9]=-a,e[2]=f*a-g,e[6]=_+d*a,e[10]=r*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,_=l*u;e[0]=d-_*a,e[4]=-r*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=r*h,e[9]=_-d*a,e[2]=-r*l,e[6]=a,e[10]=r*c}else if(t.order==="ZYX"){const d=r*h,f=r*u,g=a*h,_=a*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=r*c}else if(t.order==="YZX"){const d=r*c,f=r*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+f,e[1]=u,e[5]=r*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=r*c,f=r*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=r*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Zu,t,Ku)}lookAt(t,e,n){const s=this.elements;return Ze.subVectors(t,e),Ze.lengthSq()===0&&(Ze.z=1),Ze.normalize(),qn.crossVectors(n,Ze),qn.lengthSq()===0&&(Math.abs(n.z)===1?Ze.x+=1e-4:Ze.z+=1e-4,Ze.normalize(),qn.crossVectors(n,Ze)),qn.normalize(),Fs.crossVectors(Ze,qn),s[0]=qn.x,s[4]=Fs.x,s[8]=Ze.x,s[1]=qn.y,s[5]=Fs.y,s[9]=Ze.y,s[2]=qn.z,s[6]=Fs.z,s[10]=Ze.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,o=this.elements,r=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],T=n[3],b=n[7],x=n[11],L=n[15],w=s[0],C=s[4],R=s[8],M=s[12],v=s[1],D=s[5],F=s[9],k=s[13],Y=s[2],j=s[6],tt=s[10],et=s[14],K=s[3],_t=s[7],Q=s[11],bt=s[15];return o[0]=r*w+a*v+c*Y+l*K,o[4]=r*C+a*D+c*j+l*_t,o[8]=r*R+a*F+c*tt+l*Q,o[12]=r*M+a*k+c*et+l*bt,o[1]=h*w+u*v+d*Y+f*K,o[5]=h*C+u*D+d*j+f*_t,o[9]=h*R+u*F+d*tt+f*Q,o[13]=h*M+u*k+d*et+f*bt,o[2]=g*w+_*v+m*Y+p*K,o[6]=g*C+_*D+m*j+p*_t,o[10]=g*R+_*F+m*tt+p*Q,o[14]=g*M+_*k+m*et+p*bt,o[3]=T*w+b*v+x*Y+L*K,o[7]=T*C+b*D+x*j+L*_t,o[11]=T*R+b*F+x*tt+L*Q,o[15]=T*M+b*k+x*et+L*bt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],o=t[12],r=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],_=t[7],m=t[11],p=t[15];return g*(+o*c*u-s*l*u-o*a*d+n*l*d+s*a*f-n*c*f)+_*(+e*c*f-e*l*d+o*r*d-s*r*f+s*l*h-o*c*h)+m*(+e*l*u-e*a*f-o*r*u+n*r*f+o*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*d+s*r*u-n*r*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],o=t[3],r=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],_=t[13],m=t[14],p=t[15],T=u*m*l-_*d*l+_*c*f-a*m*f-u*c*p+a*d*p,b=g*d*l-h*m*l-g*c*f+r*m*f+h*c*p-r*d*p,x=h*_*l-g*u*l+g*a*f-r*_*f-h*a*p+r*u*p,L=g*u*c-h*_*c-g*a*d+r*_*d+h*a*m-r*u*m,w=e*T+n*b+s*x+o*L;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/w;return t[0]=T*C,t[1]=(_*d*o-u*m*o-_*s*f+n*m*f+u*s*p-n*d*p)*C,t[2]=(a*m*o-_*c*o+_*s*l-n*m*l-a*s*p+n*c*p)*C,t[3]=(u*c*o-a*d*o-u*s*l+n*d*l+a*s*f-n*c*f)*C,t[4]=b*C,t[5]=(h*m*o-g*d*o+g*s*f-e*m*f-h*s*p+e*d*p)*C,t[6]=(g*c*o-r*m*o-g*s*l+e*m*l+r*s*p-e*c*p)*C,t[7]=(r*d*o-h*c*o+h*s*l-e*d*l-r*s*f+e*c*f)*C,t[8]=x*C,t[9]=(g*u*o-h*_*o-g*n*f+e*_*f+h*n*p-e*u*p)*C,t[10]=(r*_*o-g*a*o+g*n*l-e*_*l-r*n*p+e*a*p)*C,t[11]=(h*a*o-r*u*o-h*n*l+e*u*l+r*n*f-e*a*f)*C,t[12]=L*C,t[13]=(h*_*s-g*u*s+g*n*d-e*_*d-h*n*m+e*u*m)*C,t[14]=(g*a*s-r*_*s-g*n*c+e*_*c+r*n*m-e*a*m)*C,t[15]=(r*u*s-h*a*s+h*n*c-e*u*c-r*n*d+e*a*d)*C,this}scale(t){const e=this.elements,n=t.x,s=t.y,o=t.z;return e[0]*=n,e[4]*=s,e[8]*=o,e[1]*=n,e[5]*=s,e[9]*=o,e[2]*=n,e[6]*=s,e[10]*=o,e[3]*=n,e[7]*=s,e[11]*=o,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),o=1-n,r=t.x,a=t.y,c=t.z,l=o*r,h=o*a;return this.set(l*r+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*r,0,l*c-s*a,h*c+s*r,o*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,o,r){return this.set(1,n,o,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,o=e._x,r=e._y,a=e._z,c=e._w,l=o+o,h=r+r,u=a+a,d=o*l,f=o*h,g=o*u,_=r*h,m=r*u,p=a*u,T=c*l,b=c*h,x=c*u,L=n.x,w=n.y,C=n.z;return s[0]=(1-(_+p))*L,s[1]=(f+x)*L,s[2]=(g-b)*L,s[3]=0,s[4]=(f-x)*w,s[5]=(1-(d+p))*w,s[6]=(m+T)*w,s[7]=0,s[8]=(g+b)*C,s[9]=(m-T)*C,s[10]=(1-(d+_))*C,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let o=Ei.set(s[0],s[1],s[2]).length();const r=Ei.set(s[4],s[5],s[6]).length(),a=Ei.set(s[8],s[9],s[10]).length();this.determinant()<0&&(o=-o),t.x=s[12],t.y=s[13],t.z=s[14],un.copy(this);const l=1/o,h=1/r,u=1/a;return un.elements[0]*=l,un.elements[1]*=l,un.elements[2]*=l,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=u,un.elements[9]*=u,un.elements[10]*=u,e.setFromRotationMatrix(un),n.x=o,n.y=r,n.z=a,this}makePerspective(t,e,n,s,o,r,a=Sn,c=!1){const l=this.elements,h=2*o/(e-t),u=2*o/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s);let g,_;if(c)g=o/(r-o),_=r*o/(r-o);else if(a===Sn)g=-(r+o)/(r-o),_=-2*r*o/(r-o);else if(a===_o)g=-r/(r-o),_=-r*o/(r-o);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,o,r,a=Sn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,_;if(c)g=1/(r-o),_=r/(r-o);else if(a===Sn)g=-2/(r-o),_=-(r+o)/(r-o);else if(a===_o)g=-1/(r-o),_=-o/(r-o);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Ei=new U,un=new Ee,Zu=new U(0,0,0),Ku=new U(1,1,1),qn=new U,Fs=new U,Ze=new U,lc=new Ee,hc=new Yi;class kn{constructor(t=0,e=0,n=0,s=kn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,o=s[0],r=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,o)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,o),this._z=0);break;case"ZXY":this._x=Math.asin(ne(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,l)):(this._y=0,this._z=Math.atan2(c,o));break;case"ZYX":this._y=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,o)):(this._x=0,this._z=Math.atan2(-r,l));break;case"YZX":this._z=Math.asin(ne(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,o)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-ne(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,o)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return lc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(lc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return hc.setFromEuler(this),this.setFromQuaternion(hc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}kn.DEFAULT_ORDER="XYZ";class Yl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let $u=0;const uc=new U,Ti=new Yi,Rn=new Ee,Os=new U,ns=new U,Qu=new U,td=new Yi,dc=new U(1,0,0),fc=new U(0,1,0),pc=new U(0,0,1),mc={type:"added"},ed={type:"removed"},Ai={type:"childadded",child:null},Ho={type:"childremoved",child:null};class Te extends Xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=_i(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Te.DEFAULT_UP.clone();const t=new U,e=new kn,n=new Yi,s=new U(1,1,1);function o(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(o),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ee},normalMatrix:{value:new $t}}),this.matrix=new Ee,this.matrixWorld=new Ee,this.matrixAutoUpdate=Te.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Yl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ti.setFromAxisAngle(t,e),this.quaternion.multiply(Ti),this}rotateOnWorldAxis(t,e){return Ti.setFromAxisAngle(t,e),this.quaternion.premultiply(Ti),this}rotateX(t){return this.rotateOnAxis(dc,t)}rotateY(t){return this.rotateOnAxis(fc,t)}rotateZ(t){return this.rotateOnAxis(pc,t)}translateOnAxis(t,e){return uc.copy(t).applyQuaternion(this.quaternion),this.position.add(uc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(dc,t)}translateY(t){return this.translateOnAxis(fc,t)}translateZ(t){return this.translateOnAxis(pc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Os.copy(t):Os.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ns.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rn.lookAt(ns,Os,this.up):Rn.lookAt(Os,ns,this.up),this.quaternion.setFromRotationMatrix(Rn),s&&(Rn.extractRotation(s.matrixWorld),Ti.setFromRotationMatrix(Rn),this.quaternion.premultiply(Ti.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(mc),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ed),Ho.child=t,this.dispatchEvent(Ho),Ho.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(mc),Ai.child=t,this.dispatchEvent(Ai),Ai.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,t,Qu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ns,td,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let o=0,r=s.length;o<r;o++)s[o].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function o(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=o(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];o(t.shapes,u)}else o(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(o(t.materials,this.material[c]));s.material=a}else s.material=o(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(o(t.animations,c))}}if(e){const a=r(t.geometries),c=r(t.materials),l=r(t.textures),h=r(t.images),u=r(t.shapes),d=r(t.skeletons),f=r(t.animations),g=r(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function r(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}Te.DEFAULT_UP=new U(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new U,Pn=new U,Go=new U,In=new U,Ci=new U,Ri=new U,gc=new U,Wo=new U,qo=new U,Xo=new U,Yo=new Re,jo=new Re,Jo=new Re;class gn{constructor(t=new U,e=new U,n=new U){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),dn.subVectors(t,e),s.cross(dn);const o=s.lengthSq();return o>0?s.multiplyScalar(1/Math.sqrt(o)):s.set(0,0,0)}static getBarycoord(t,e,n,s,o){dn.subVectors(s,e),Pn.subVectors(n,e),Go.subVectors(t,e);const r=dn.dot(dn),a=dn.dot(Pn),c=dn.dot(Go),l=Pn.dot(Pn),h=Pn.dot(Go),u=r*l-a*a;if(u===0)return o.set(0,0,0),null;const d=1/u,f=(l*c-a*h)*d,g=(r*h-a*c)*d;return o.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(t,e,n,s,o,r,a,c){return this.getBarycoord(t,e,n,s,In)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(o,In.x),c.addScaledVector(r,In.y),c.addScaledVector(a,In.z),c)}static getInterpolatedAttribute(t,e,n,s,o,r){return Yo.setScalar(0),jo.setScalar(0),Jo.setScalar(0),Yo.fromBufferAttribute(t,e),jo.fromBufferAttribute(t,n),Jo.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Yo,o.x),r.addScaledVector(jo,o.y),r.addScaledVector(Jo,o.z),r}static isFrontFacing(t,e,n,s){return dn.subVectors(n,e),Pn.subVectors(t,e),dn.cross(Pn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return dn.subVectors(this.c,this.b),Pn.subVectors(this.a,this.b),dn.cross(Pn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,o){return gn.getInterpolation(t,this.a,this.b,this.c,e,n,s,o)}containsPoint(t){return gn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,o=this.c;let r,a;Ci.subVectors(s,n),Ri.subVectors(o,n),Wo.subVectors(t,n);const c=Ci.dot(Wo),l=Ri.dot(Wo);if(c<=0&&l<=0)return e.copy(n);qo.subVectors(t,s);const h=Ci.dot(qo),u=Ri.dot(qo);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return r=c/(c-h),e.copy(n).addScaledVector(Ci,r);Xo.subVectors(t,o);const f=Ci.dot(Xo),g=Ri.dot(Xo);if(g>=0&&f<=g)return e.copy(o);const _=f*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Ri,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return gc.subVectors(o,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(gc,a);const p=1/(m+_+d);return r=_*p,a=d*p,e.copy(n).addScaledVector(Ci,r).addScaledVector(Ri,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const jl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xn={h:0,s:0,l:0},zs={h:0,s:0,l:0};function Zo(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class re{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,de.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=de.workingColorSpace){return this.r=t,this.g=e,this.b=n,de.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=de.workingColorSpace){if(t=za(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const o=n<=.5?n*(1+e):n+e-n*e,r=2*n-o;this.r=Zo(r,o,t+1/3),this.g=Zo(r,o,t),this.b=Zo(r,o,t-1/3)}return de.colorSpaceToWorking(this,s),this}setStyle(t,e=en){function n(o){o!==void 0&&parseFloat(o)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let o;const r=s[1],a=s[2];switch(r){case"rgb":case"rgba":if(o=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(255,parseInt(o[1],10))/255,Math.min(255,parseInt(o[2],10))/255,Math.min(255,parseInt(o[3],10))/255,e);if(o=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setRGB(Math.min(100,parseInt(o[1],10))/100,Math.min(100,parseInt(o[2],10))/100,Math.min(100,parseInt(o[3],10))/100,e);break;case"hsl":case"hsla":if(o=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(o[4]),this.setHSL(parseFloat(o[1])/360,parseFloat(o[2])/100,parseFloat(o[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const o=s[1],r=o.length;if(r===3)return this.setRGB(parseInt(o.charAt(0),16)/15,parseInt(o.charAt(1),16)/15,parseInt(o.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(o,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){const n=jl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=Bi(t.r),this.g=Bi(t.g),this.b=Bi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return de.workingToColorSpace(Oe.copy(this),t),Math.round(ne(Oe.r*255,0,255))*65536+Math.round(ne(Oe.g*255,0,255))*256+Math.round(ne(Oe.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=de.workingColorSpace){de.workingToColorSpace(Oe.copy(this),e);const n=Oe.r,s=Oe.g,o=Oe.b,r=Math.max(n,s,o),a=Math.min(n,s,o);let c,l;const h=(a+r)/2;if(a===r)c=0,l=0;else{const u=r-a;switch(l=h<=.5?u/(r+a):u/(2-r-a),r){case n:c=(s-o)/u+(s<o?6:0);break;case s:c=(o-n)/u+2;break;case o:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=de.workingColorSpace){return de.workingToColorSpace(Oe.copy(this),e),t.r=Oe.r,t.g=Oe.g,t.b=Oe.b,t}getStyle(t=en){de.workingToColorSpace(Oe.copy(this),t);const e=Oe.r,n=Oe.g,s=Oe.b;return t!==en?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Xn),this.setHSL(Xn.h+t,Xn.s+e,Xn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Xn),t.getHSL(zs);const n=us(Xn.h,zs.h,e),s=us(Xn.s,zs.s,e),o=us(Xn.l,zs.l,e);return this.setHSL(n,s,o),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,o=t.elements;return this.r=o[0]*e+o[3]*n+o[6]*s,this.g=o[1]*e+o[4]*n+o[7]*s,this.b=o[2]*e+o[5]*n+o[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Oe=new re;re.NAMES=jl;let nd=0;class Ji extends Xi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nd++}),this.uuid=_i(),this.name="",this.type="Material",this.blending=zi,this.side=Bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Mr,this.blendDst=yr,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new re(0,0,0),this.blendAlpha=0,this.depthFunc=ki,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=ec,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mi,this.stencilZFail=Mi,this.stencilZPass=Mi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==Bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Mr&&(n.blendSrc=this.blendSrc),this.blendDst!==yr&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ki&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==ec&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Mi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Mi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Mi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(o){const r=[];for(const a in o){const c=o[a];delete c.metadata,r.push(c)}return r}if(e){const o=s(t.textures),r=s(t.images);o.length>0&&(n.textures=o),r.length>0&&(n.images=r)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let o=0;o!==s;++o)n[o]=e[o].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class To extends Ji{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new re(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new kn,this.combine=Dl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Pe=new U,Bs=new St;let id=0;class wn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:id++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=nc,this.updateRanges=[],this.gpuType=Nn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,o=this.itemSize;s<o;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Bs.fromBufferAttribute(this,e),Bs.applyMatrix3(t),this.setXY(e,Bs.x,Bs.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix3(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyMatrix4(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.applyNormalMatrix(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Pe.fromBufferAttribute(this,e),Pe.transformDirection(t),this.setXYZ(e,Pe.x,Pe.y,Pe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Fi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Ve(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Fi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Fi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Fi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Fi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ve(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,o){return t*=this.itemSize,this.normalized&&(e=Ve(e,this.array),n=Ve(n,this.array),s=Ve(s,this.array),o=Ve(o,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=o,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==nc&&(t.usage=this.usage),t}}class Jl extends wn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Zl extends wn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class le extends wn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let sd=0;const cn=new Ee,Ko=new Te,Pi=new U,Ke=new ji,is=new ji,De=new U;class Ne extends Xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=_i(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Wl(t)?Zl:Jl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const o=new $t().getNormalMatrix(t);n.applyNormalMatrix(o),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return cn.makeRotationFromQuaternion(t),this.applyMatrix4(cn),this}rotateX(t){return cn.makeRotationX(t),this.applyMatrix4(cn),this}rotateY(t){return cn.makeRotationY(t),this.applyMatrix4(cn),this}rotateZ(t){return cn.makeRotationZ(t),this.applyMatrix4(cn),this}translate(t,e,n){return cn.makeTranslation(t,e,n),this.applyMatrix4(cn),this}scale(t,e,n){return cn.makeScale(t,e,n),this.applyMatrix4(cn),this}lookAt(t){return Ko.lookAt(t),Ko.updateMatrix(),this.applyMatrix4(Ko.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Pi).negate(),this.translate(Pi.x,Pi.y,Pi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,o=t.length;s<o;s++){const r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new le(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const o=t[s];e.setXYZ(s,o.x,o.y,o.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ji);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const o=e[n];Ke.setFromBufferAttribute(o),this.morphTargetsRelative?(De.addVectors(this.boundingBox.min,Ke.min),this.boundingBox.expandByPoint(De),De.addVectors(this.boundingBox.max,Ke.max),this.boundingBox.expandByPoint(De)):(this.boundingBox.expandByPoint(Ke.min),this.boundingBox.expandByPoint(Ke.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Eo);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new U,1/0);return}if(t){const n=this.boundingSphere.center;if(Ke.setFromBufferAttribute(t),e)for(let o=0,r=e.length;o<r;o++){const a=e[o];is.setFromBufferAttribute(a),this.morphTargetsRelative?(De.addVectors(Ke.min,is.min),Ke.expandByPoint(De),De.addVectors(Ke.max,is.max),Ke.expandByPoint(De)):(Ke.expandByPoint(is.min),Ke.expandByPoint(is.max))}Ke.getCenter(n);let s=0;for(let o=0,r=t.count;o<r;o++)De.fromBufferAttribute(t,o),s=Math.max(s,n.distanceToSquared(De));if(e)for(let o=0,r=e.length;o<r;o++){const a=e[o],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)De.fromBufferAttribute(a,l),c&&(Pi.fromBufferAttribute(t,l),De.add(Pi)),s=Math.max(s,n.distanceToSquared(De))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,o=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*n.count),4));const r=this.getAttribute("tangent"),a=[],c=[];for(let R=0;R<n.count;R++)a[R]=new U,c[R]=new U;const l=new U,h=new U,u=new U,d=new St,f=new St,g=new St,_=new U,m=new U;function p(R,M,v){l.fromBufferAttribute(n,R),h.fromBufferAttribute(n,M),u.fromBufferAttribute(n,v),d.fromBufferAttribute(o,R),f.fromBufferAttribute(o,M),g.fromBufferAttribute(o,v),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(D),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(D),a[R].add(_),a[M].add(_),a[v].add(_),c[R].add(m),c[M].add(m),c[v].add(m))}let T=this.groups;T.length===0&&(T=[{start:0,count:t.count}]);for(let R=0,M=T.length;R<M;++R){const v=T[R],D=v.start,F=v.count;for(let k=D,Y=D+F;k<Y;k+=3)p(t.getX(k+0),t.getX(k+1),t.getX(k+2))}const b=new U,x=new U,L=new U,w=new U;function C(R){L.fromBufferAttribute(s,R),w.copy(L);const M=a[R];b.copy(M),b.sub(L.multiplyScalar(L.dot(M))).normalize(),x.crossVectors(w,M);const D=x.dot(c[R])<0?-1:1;r.setXYZW(R,b.x,b.y,b.z,D)}for(let R=0,M=T.length;R<M;++R){const v=T[R],D=v.start,F=v.count;for(let k=D,Y=D+F;k<Y;k+=3)C(t.getX(k+0)),C(t.getX(k+1)),C(t.getX(k+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new wn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new U,o=new U,r=new U,a=new U,c=new U,l=new U,h=new U,u=new U;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),_=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),o.fromBufferAttribute(e,_),r.fromBufferAttribute(e,m),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),o.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),h.subVectors(r,o),u.subVectors(s,o),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)De.fromBufferAttribute(t,e),De.normalize(),t.setXYZ(e,De.x,De.y,De.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let _=0,m=c.length;_<m;_++){a.isInterleavedBufferAttribute?f=c[_]*a.data.stride+a.offset:f=c[_]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new wn(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ne,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const o=this.morphAttributes;for(const a in o){const c=[],l=o[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let a=0,c=r.length;a<c;a++){const l=r[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let o=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,o=!0)}o&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const o=t.morphAttributes;for(const l in o){const h=[],u=o[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const r=t.groups;for(let l=0,h=r.length;l<h;l++){const u=r[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const vc=new Ee,ni=new Xl,ks=new Eo,_c=new U,Vs=new U,Hs=new U,Gs=new U,$o=new U,Ws=new U,xc=new U,qs=new U;class S extends Te{constructor(t=new Ne,e=new To){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,o=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(o&&a){Ws.set(0,0,0);for(let c=0,l=o.length;c<l;c++){const h=a[c],u=o[c];h!==0&&($o.fromBufferAttribute(u,t),r?Ws.addScaledVector($o,h):Ws.addScaledVector($o.sub(e),h))}e.add(Ws)}return e}raycast(t,e){const n=this.geometry,s=this.material,o=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ks.copy(n.boundingSphere),ks.applyMatrix4(o),ni.copy(t.ray).recast(t.near),!(ks.containsPoint(ni.origin)===!1&&(ni.intersectSphere(ks,_c)===null||ni.origin.distanceToSquared(_c)>(t.far-t.near)**2))&&(vc.copy(o).invert(),ni.copy(t.ray).applyMatrix4(vc),!(n.boundingBox!==null&&ni.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ni)))}_computeIntersections(t,e,n){let s;const o=this.geometry,r=this.material,a=o.index,c=o.attributes.position,l=o.attributes.uv,h=o.attributes.uv1,u=o.attributes.normal,d=o.groups,f=o.drawRange;if(a!==null)if(Array.isArray(r))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=r[m.materialIndex],T=Math.max(m.start,f.start),b=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=T,L=b;x<L;x+=3){const w=a.getX(x),C=a.getX(x+1),R=a.getX(x+2);s=Xs(this,p,t,n,l,h,u,w,C,R),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const T=a.getX(m),b=a.getX(m+1),x=a.getX(m+2);s=Xs(this,r,t,n,l,h,u,T,b,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(r))for(let g=0,_=d.length;g<_;g++){const m=d[g],p=r[m.materialIndex],T=Math.max(m.start,f.start),b=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let x=T,L=b;x<L;x+=3){const w=x,C=x+1,R=x+2;s=Xs(this,p,t,n,l,h,u,w,C,R),s&&(s.faceIndex=Math.floor(x/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),_=Math.min(c.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){const T=m,b=m+1,x=m+2;s=Xs(this,r,t,n,l,h,u,T,b,x),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function od(i,t,e,n,s,o,r,a){let c;if(t.side===Xe?c=n.intersectTriangle(r,o,s,!0,a):c=n.intersectTriangle(s,o,r,t.side===Bn,a),c===null)return null;qs.copy(a),qs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(qs);return l<e.near||l>e.far?null:{distance:l,point:qs.clone(),object:i}}function Xs(i,t,e,n,s,o,r,a,c,l){i.getVertexPosition(a,Vs),i.getVertexPosition(c,Hs),i.getVertexPosition(l,Gs);const h=od(i,t,e,n,Vs,Hs,Gs,xc);if(h){const u=new U;gn.getBarycoord(xc,Vs,Hs,Gs,u),s&&(h.uv=gn.getInterpolatedAttribute(s,a,c,l,u,new St)),o&&(h.uv1=gn.getInterpolatedAttribute(o,a,c,l,u,new St)),r&&(h.normal=gn.getInterpolatedAttribute(r,a,c,l,u,new U),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new U,materialIndex:0};gn.getNormal(Vs,Hs,Gs,d.normal),h.face=d,h.barycoord=u}return h}class W extends Ne{constructor(t=1,e=1,n=1,s=1,o=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:o,depthSegments:r};const a=this;s=Math.floor(s),o=Math.floor(o),r=Math.floor(r);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,r,o,0),g("z","y","x",1,-1,n,e,-t,r,o,1),g("x","z","y",1,1,t,n,e,s,r,2),g("x","z","y",1,-1,t,n,-e,s,r,3),g("x","y","z",1,-1,t,e,n,s,o,4),g("x","y","z",-1,-1,t,e,-n,s,o,5),this.setIndex(c),this.setAttribute("position",new le(l,3)),this.setAttribute("normal",new le(h,3)),this.setAttribute("uv",new le(u,2));function g(_,m,p,T,b,x,L,w,C,R,M){const v=x/C,D=L/R,F=x/2,k=L/2,Y=w/2,j=C+1,tt=R+1;let et=0,K=0;const _t=new U;for(let Q=0;Q<tt;Q++){const bt=Q*D-k;for(let Wt=0;Wt<j;Wt++){const te=Wt*v-F;_t[_]=te*T,_t[m]=bt*b,_t[p]=Y,l.push(_t.x,_t.y,_t.z),_t[_]=0,_t[m]=0,_t[p]=w>0?1:-1,h.push(_t.x,_t.y,_t.z),u.push(Wt/C),u.push(1-Q/R),et+=1}}for(let Q=0;Q<R;Q++)for(let bt=0;bt<C;bt++){const Wt=d+bt+j*Q,te=d+bt+j*(Q+1),ce=d+(bt+1)+j*(Q+1),se=d+(bt+1)+j*Q;c.push(Wt,te,se),c.push(te,ce,se),K+=6}a.addGroup(f,K,M),f+=K,d+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new W(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Wi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function He(i){const t={};for(let e=0;e<i.length;e++){const n=Wi(i[e]);for(const s in n)t[s]=n[s]}return t}function rd(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Kl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:de.workingColorSpace}const ad={clone:Wi,merge:He};var cd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ld=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kn extends Ji{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cd,this.fragmentShader=ld,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Wi(t.uniforms),this.uniformsGroups=rd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class $l extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ee,this.projectionMatrix=new Ee,this.projectionMatrixInverse=new Ee,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Yn=new U,Mc=new St,yc=new St;class nn extends $l{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=xs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(hs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return xs*2*Math.atan(Math.tan(hs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Yn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Yn.x,Yn.y).multiplyScalar(-t/Yn.z),Yn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Yn.x,Yn.y).multiplyScalar(-t/Yn.z)}getViewSize(t,e){return this.getViewBounds(t,Mc,yc),e.subVectors(yc,Mc)}setViewOffset(t,e,n,s,o,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(hs*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,o=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const c=r.fullWidth,l=r.fullHeight;o+=r.offsetX*s/c,e-=r.offsetY*n/l,s*=r.width/c,n*=r.height/l}const a=this.filmOffset;a!==0&&(o+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(o,o+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ii=-90,Li=1;class hd extends Te{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new nn(Ii,Li,t,e);s.layers=this.layers,this.add(s);const o=new nn(Ii,Li,t,e);o.layers=this.layers,this.add(o);const r=new nn(Ii,Li,t,e);r.layers=this.layers,this.add(r);const a=new nn(Ii,Li,t,e);a.layers=this.layers,this.add(a);const c=new nn(Ii,Li,t,e);c.layers=this.layers,this.add(c);const l=new nn(Ii,Li,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,o,r,a,c]=e;for(const l of e)this.remove(l);if(t===Sn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),o.up.set(0,0,-1),o.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===_o)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),o.up.set(0,0,1),o.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[o,r,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,o),t.setRenderTarget(n,1,s),t.render(e,r),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Ql extends Be{constructor(t=[],e=Vi,n,s,o,r,a,c,l,h){super(t,e,n,s,o,r,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class ud extends mi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Ql(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new W(5,5,5),o=new Kn({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xe,blending:Jn});o.uniforms.tEquirect.value=e;const r=new S(s,o),a=e.minFilter;return e.minFilter===di&&(e.minFilter=yn),new hd(1,10,this).update(t,r),e.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const o=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(o)}}class ut extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dd={type:"move"};class Qo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ut,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ut,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ut,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,o=null,r=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){r=!0;for(const _ of t.hand.values()){const m=e.getJointPose(_,n),p=this._getHandJoint(l,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(o=e.getPose(t.gripSpace,n),o!==null&&(c.matrix.fromArray(o.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,o.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(o.linearVelocity)):c.hasLinearVelocity=!1,o.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(o.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&o!==null&&(s=o),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(dd)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=o!==null),l!==null&&(l.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new ut;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class ka{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new re(t),this.near=e,this.far=n}clone(){return new ka(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class th extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new kn,this.environmentIntensity=1,this.environmentRotation=new kn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class fd extends Be{constructor(t=null,e=1,n=1,s,o,r,a,c,l=Ge,h=Ge,u,d){super(null,r,a,c,l,h,s,o,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const tr=new U,pd=new U,md=new $t;class ai{constructor(t=new U(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=tr.subVectors(n,e).cross(pd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(tr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return o<0||o>1?null:e.copy(t.start).addScaledVector(n,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||md.getNormalMatrix(t),s=this.coplanarPoint(tr).applyMatrix4(t),o=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(o),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ii=new Eo,gd=new St(.5,.5),Ys=new U;class Va{constructor(t=new ai,e=new ai,n=new ai,s=new ai,o=new ai,r=new ai){this.planes=[t,e,n,s,o,r]}set(t,e,n,s,o,r){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(o),a[5].copy(r),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Sn,n=!1){const s=this.planes,o=t.elements,r=o[0],a=o[1],c=o[2],l=o[3],h=o[4],u=o[5],d=o[6],f=o[7],g=o[8],_=o[9],m=o[10],p=o[11],T=o[12],b=o[13],x=o[14],L=o[15];if(s[0].setComponents(l-r,f-h,p-g,L-T).normalize(),s[1].setComponents(l+r,f+h,p+g,L+T).normalize(),s[2].setComponents(l+a,f+u,p+_,L+b).normalize(),s[3].setComponents(l-a,f-u,p-_,L-b).normalize(),n)s[4].setComponents(c,d,m,x).normalize(),s[5].setComponents(l-c,f-d,p-m,L-x).normalize();else if(s[4].setComponents(l-c,f-d,p-m,L-x).normalize(),e===Sn)s[5].setComponents(l+c,f+d,p+m,L+x).normalize();else if(e===_o)s[5].setComponents(c,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ii.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ii.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ii)}intersectsSprite(t){ii.center.set(0,0,0);const e=gd.distanceTo(t.center);return ii.radius=.7071067811865476+e,ii.applyMatrix4(t.matrixWorld),this.intersectsSphere(ii)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let o=0;o<6;o++)if(e[o].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ys.x=s.normal.x>0?t.max.x:t.min.x,Ys.y=s.normal.y>0?t.max.y:t.min.y,Ys.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ys)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class eh extends Ji{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new re(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Mo=new U,yo=new U,Sc=new Ee,ss=new Xl,js=new Eo,er=new U,bc=new U;class vd extends Te{constructor(t=new Ne,e=new eh){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,o=e.count;s<o;s++)Mo.fromBufferAttribute(e,s-1),yo.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Mo.distanceTo(yo);t.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,o=t.params.Line.threshold,r=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),js.copy(n.boundingSphere),js.applyMatrix4(s),js.radius+=o,t.ray.intersectsSphere(js)===!1)return;Sc.copy(s).invert(),ss.copy(t.ray).applyMatrix4(Sc);const a=o/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,r.start),g=Math.min(h.count,r.start+r.count);for(let _=f,m=g-1;_<m;_+=l){const p=h.getX(_),T=h.getX(_+1),b=Js(this,t,ss,c,p,T,_);b&&e.push(b)}if(this.isLineLoop){const _=h.getX(g-1),m=h.getX(f),p=Js(this,t,ss,c,_,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,r.start),g=Math.min(d.count,r.start+r.count);for(let _=f,m=g-1;_<m;_+=l){const p=Js(this,t,ss,c,_,_+1,_);p&&e.push(p)}if(this.isLineLoop){const _=Js(this,t,ss,c,g-1,f,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let o=0,r=s.length;o<r;o++){const a=s[o].name||String(o);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=o}}}}}function Js(i,t,e,n,s,o,r){const a=i.geometry.attributes.position;if(Mo.fromBufferAttribute(a,s),yo.fromBufferAttribute(a,o),e.distanceSqToSegment(Mo,yo,er,bc)>n)return;er.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(er);if(!(l<t.near||l>t.far))return{distance:l,point:bc.clone().applyMatrix4(i.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:i}}const wc=new U,Ec=new U;class Tc extends vd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,o=e.count;s<o;s+=2)wc.fromBufferAttribute(e,s),Ec.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+wc.distanceTo(Ec);t.setAttribute("lineDistance",new le(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class _d extends Be{constructor(t,e,n,s,o,r,a,c,l){super(t,e,n,s,o,r,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class nh extends Be{constructor(t,e,n=pi,s,o,r,a=Ge,c=Ge,l,h=vs,u=1){if(h!==vs&&h!==_s)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,o,r,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ba(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ih extends Be{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Fn extends Ne{constructor(t=1,e=1,n=4,s=8,o=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:o},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),o=Math.max(1,Math.floor(o));const r=[],a=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+o,_=s+1,m=new U,p=new U;for(let T=0;T<=g;T++){let b=0,x=0,L=0,w=0;if(T<=n){const M=T/n,v=M*Math.PI/2;x=-h-t*Math.cos(v),L=t*Math.sin(v),w=-t*Math.cos(v),b=M*u}else if(T<=n+o){const M=(T-n)/o;x=-h+M*e,L=t,w=0,b=u+M*d}else{const M=(T-n-o)/n,v=M*Math.PI/2;x=h+t*Math.sin(v),L=t*Math.cos(v),w=t*Math.sin(v),b=u+d+M*u}const C=Math.max(0,Math.min(1,b/f));let R=0;T===0?R=.5/s:T===g&&(R=-.5/s);for(let M=0;M<=s;M++){const v=M/s,D=v*Math.PI*2,F=Math.sin(D),k=Math.cos(D);p.x=-L*k,p.y=x,p.z=L*F,a.push(p.x,p.y,p.z),m.set(-L*k,w,L*F),m.normalize(),c.push(m.x,m.y,m.z),l.push(v+R,C)}if(T>0){const M=(T-1)*_;for(let v=0;v<s;v++){const D=M+v,F=M+v+1,k=T*_+v,Y=T*_+v+1;r.push(D,F,k),r.push(F,Y,k)}}}this.setIndex(r),this.setAttribute("position",new le(a,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fn(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class ys extends Ne{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const o=[],r=[],a=[],c=[],l=new U,h=new St;r.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),r.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(r[d]/t+1)/2,h.y=(r[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)o.push(u,u+1,0);this.setIndex(o),this.setAttribute("position",new le(r,3)),this.setAttribute("normal",new le(a,3)),this.setAttribute("uv",new le(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ys(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class at extends Ne{constructor(t=1,e=1,n=1,s=32,o=1,r=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:o,openEnded:r,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),o=Math.floor(o);const h=[],u=[],d=[],f=[];let g=0;const _=[],m=n/2;let p=0;T(),r===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(h),this.setAttribute("position",new le(u,3)),this.setAttribute("normal",new le(d,3)),this.setAttribute("uv",new le(f,2));function T(){const x=new U,L=new U;let w=0;const C=(e-t)/n;for(let R=0;R<=o;R++){const M=[],v=R/o,D=v*(e-t)+t;for(let F=0;F<=s;F++){const k=F/s,Y=k*c+a,j=Math.sin(Y),tt=Math.cos(Y);L.x=D*j,L.y=-v*n+m,L.z=D*tt,u.push(L.x,L.y,L.z),x.set(j,C,tt).normalize(),d.push(x.x,x.y,x.z),f.push(k,1-v),M.push(g++)}_.push(M)}for(let R=0;R<s;R++)for(let M=0;M<o;M++){const v=_[M][R],D=_[M+1][R],F=_[M+1][R+1],k=_[M][R+1];(t>0||M!==0)&&(h.push(v,D,k),w+=3),(e>0||M!==o-1)&&(h.push(D,F,k),w+=3)}l.addGroup(p,w,0),p+=w}function b(x){const L=g,w=new St,C=new U;let R=0;const M=x===!0?t:e,v=x===!0?1:-1;for(let F=1;F<=s;F++)u.push(0,m*v,0),d.push(0,v,0),f.push(.5,.5),g++;const D=g;for(let F=0;F<=s;F++){const Y=F/s*c+a,j=Math.cos(Y),tt=Math.sin(Y);C.x=M*tt,C.y=m*v,C.z=M*j,u.push(C.x,C.y,C.z),d.push(0,v,0),w.x=j*.5+.5,w.y=tt*.5*v+.5,f.push(w.x,w.y),g++}for(let F=0;F<s;F++){const k=L+F,Y=D+F;x===!0?h.push(Y,Y+1,k):h.push(Y+1,Y,k),R+=3}l.addGroup(p,R,x===!0?1:2),p+=R}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new at(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ln extends at{constructor(t=1,e=1,n=32,s=1,o=!1,r=0,a=Math.PI*2){super(0,t,e,n,s,o,r,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:o,thetaStart:r,thetaLength:a}}static fromJSON(t){return new ln(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ao extends Ne{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const o=[],r=[];a(s),l(n),h(),this.setAttribute("position",new le(o,3)),this.setAttribute("normal",new le(o.slice(),3)),this.setAttribute("uv",new le(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(T){const b=new U,x=new U,L=new U;for(let w=0;w<e.length;w+=3)f(e[w+0],b),f(e[w+1],x),f(e[w+2],L),c(b,x,L,T)}function c(T,b,x,L){const w=L+1,C=[];for(let R=0;R<=w;R++){C[R]=[];const M=T.clone().lerp(x,R/w),v=b.clone().lerp(x,R/w),D=w-R;for(let F=0;F<=D;F++)F===0&&R===w?C[R][F]=M:C[R][F]=M.clone().lerp(v,F/D)}for(let R=0;R<w;R++)for(let M=0;M<2*(w-R)-1;M++){const v=Math.floor(M/2);M%2===0?(d(C[R][v+1]),d(C[R+1][v]),d(C[R][v])):(d(C[R][v+1]),d(C[R+1][v+1]),d(C[R+1][v]))}}function l(T){const b=new U;for(let x=0;x<o.length;x+=3)b.x=o[x+0],b.y=o[x+1],b.z=o[x+2],b.normalize().multiplyScalar(T),o[x+0]=b.x,o[x+1]=b.y,o[x+2]=b.z}function h(){const T=new U;for(let b=0;b<o.length;b+=3){T.x=o[b+0],T.y=o[b+1],T.z=o[b+2];const x=m(T)/2/Math.PI+.5,L=p(T)/Math.PI+.5;r.push(x,1-L)}g(),u()}function u(){for(let T=0;T<r.length;T+=6){const b=r[T+0],x=r[T+2],L=r[T+4],w=Math.max(b,x,L),C=Math.min(b,x,L);w>.9&&C<.1&&(b<.2&&(r[T+0]+=1),x<.2&&(r[T+2]+=1),L<.2&&(r[T+4]+=1))}}function d(T){o.push(T.x,T.y,T.z)}function f(T,b){const x=T*3;b.x=t[x+0],b.y=t[x+1],b.z=t[x+2]}function g(){const T=new U,b=new U,x=new U,L=new U,w=new St,C=new St,R=new St;for(let M=0,v=0;M<o.length;M+=9,v+=6){T.set(o[M+0],o[M+1],o[M+2]),b.set(o[M+3],o[M+4],o[M+5]),x.set(o[M+6],o[M+7],o[M+8]),w.set(r[v+0],r[v+1]),C.set(r[v+2],r[v+3]),R.set(r[v+4],r[v+5]),L.copy(T).add(b).add(x).divideScalar(3);const D=m(L);_(w,v+0,T,D),_(C,v+2,b,D),_(R,v+4,x,D)}}function _(T,b,x,L){L<0&&T.x===1&&(r[b]=T.x-1),x.x===0&&x.z===0&&(r[b]=L/2/Math.PI+.5)}function m(T){return Math.atan2(T.z,-T.x)}function p(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ao(t.vertices,t.indices,t.radius,t.details)}}class Ha extends Ao{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,o=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],r=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(o,r,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ha(t.radius,t.detail)}}class Tn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),o=0;e.push(0);for(let r=1;r<=t;r++)n=this.getPoint(r/t),o+=n.distanceTo(s),e.push(o),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const o=n.length;let r;e?r=e:r=t*n[o-1];let a=0,c=o-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-r,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===r)return s/(o-1);const h=n[s],d=n[s+1]-h,f=(r-h)/d;return(s+f)/(o-1)}getTangent(t,e){let s=t-1e-4,o=t+1e-4;s<0&&(s=0),o>1&&(o=1);const r=this.getPoint(s),a=this.getPoint(o),c=e||(r.isVector2?new St:new U);return c.copy(a).sub(r).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new U,s=[],o=[],r=[],a=new U,c=new Ee;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new U)}o[0]=new U,r[0]=new U;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),o[0].crossVectors(s[0],a),r[0].crossVectors(s[0],o[0]);for(let f=1;f<=t;f++){if(o[f]=o[f-1].clone(),r[f]=r[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(ne(s[f-1].dot(s[f]),-1,1));o[f].applyMatrix4(c.makeRotationAxis(a,g))}r[f].crossVectors(s[f],o[f])}if(e===!0){let f=Math.acos(ne(o[0].dot(o[t]),-1,1));f/=t,s[0].dot(a.crossVectors(o[0],o[t]))>0&&(f=-f);for(let g=1;g<=t;g++)o[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),r[g].crossVectors(s[g],o[g])}return{tangents:s,normals:o,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ga extends Tn{constructor(t=0,e=0,n=1,s=1,o=0,r=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=o,this.aEndAngle=r,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new St){const n=e,s=Math.PI*2;let o=this.aEndAngle-this.aStartAngle;const r=Math.abs(o)<Number.EPSILON;for(;o<0;)o+=s;for(;o>s;)o-=s;o<Number.EPSILON&&(r?o=0:o=s),this.aClockwise===!0&&!r&&(o===s?o=-s:o=o-s);const a=this.aStartAngle+t*o;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class xd extends Ga{constructor(t,e,n,s,o,r){super(t,e,n,n,s,o,r),this.isArcCurve=!0,this.type="ArcCurve"}}function Wa(){let i=0,t=0,e=0,n=0;function s(o,r,a,c){i=o,t=a,e=-3*o+3*r-2*a-c,n=2*o-2*r+a+c}return{initCatmullRom:function(o,r,a,c,l){s(r,a,l*(a-o),l*(c-r))},initNonuniformCatmullRom:function(o,r,a,c,l,h,u){let d=(r-o)/l-(a-o)/(l+h)+(a-r)/h,f=(a-r)/h-(c-r)/(h+u)+(c-a)/u;d*=h,f*=h,s(r,a,d,f)},calc:function(o){const r=o*o,a=r*o;return i+t*o+e*r+n*a}}}const Zs=new U,nr=new Wa,ir=new Wa,sr=new Wa;class Md extends Tn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new U){const n=e,s=this.points,o=s.length,r=(o-(this.closed?0:1))*t;let a=Math.floor(r),c=r-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/o)+1)*o:c===0&&a===o-1&&(a=o-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%o]:(Zs.subVectors(s[0],s[1]).add(s[0]),l=Zs);const u=s[a%o],d=s[(a+1)%o];if(this.closed||a+2<o?h=s[(a+2)%o]:(Zs.subVectors(s[o-1],s[o-2]).add(s[o-1]),h=Zs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),_=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),nr.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,m),ir.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,m),sr.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,m)}else this.curveType==="catmullrom"&&(nr.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),ir.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),sr.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(nr.calc(c),ir.calc(c),sr.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new U().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Ac(i,t,e,n,s){const o=(n-t)*.5,r=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+o+r)*c+(-3*e+3*n-2*o-r)*a+o*i+e}function yd(i,t){const e=1-i;return e*e*t}function Sd(i,t){return 2*(1-i)*i*t}function bd(i,t){return i*i*t}function ds(i,t,e,n){return yd(i,t)+Sd(i,e)+bd(i,n)}function wd(i,t){const e=1-i;return e*e*e*t}function Ed(i,t){const e=1-i;return 3*e*e*i*t}function Td(i,t){return 3*(1-i)*i*i*t}function Ad(i,t){return i*i*i*t}function fs(i,t,e,n,s){return wd(i,t)+Ed(i,e)+Td(i,n)+Ad(i,s)}class sh extends Tn{constructor(t=new St,e=new St,n=new St,s=new St){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new St){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(fs(t,s.x,o.x,r.x,a.x),fs(t,s.y,o.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Cd extends Tn{constructor(t=new U,e=new U,n=new U,s=new U){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new U){const n=e,s=this.v0,o=this.v1,r=this.v2,a=this.v3;return n.set(fs(t,s.x,o.x,r.x,a.x),fs(t,s.y,o.y,r.y,a.y),fs(t,s.z,o.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class oh extends Tn{constructor(t=new St,e=new St){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new St){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new St){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Rd extends Tn{constructor(t=new U,e=new U){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new U){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new U){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class rh extends Tn{constructor(t=new St,e=new St,n=new St){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new St){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(ds(t,s.x,o.x,r.x),ds(t,s.y,o.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pd extends Tn{constructor(t=new U,e=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new U){const n=e,s=this.v0,o=this.v1,r=this.v2;return n.set(ds(t,s.x,o.x,r.x),ds(t,s.y,o.y,r.y),ds(t,s.z,o.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ah extends Tn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new St){const n=e,s=this.points,o=(s.length-1)*t,r=Math.floor(o),a=o-r,c=s[r===0?r:r-1],l=s[r],h=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return n.set(Ac(a,c.x,l.x,h.x,u.x),Ac(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new St().fromArray(s))}return this}}var aa=Object.freeze({__proto__:null,ArcCurve:xd,CatmullRomCurve3:Md,CubicBezierCurve:sh,CubicBezierCurve3:Cd,EllipseCurve:Ga,LineCurve:oh,LineCurve3:Rd,QuadraticBezierCurve:rh,QuadraticBezierCurve3:Pd,SplineCurve:ah});class Id extends Tn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new aa[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let o=0;for(;o<s.length;){if(s[o]>=n){const r=s[o]-n,a=this.curves[o],c=a.getLength(),l=c===0?0:1-r/c;return a.getPointAt(l,e)}o++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,o=this.curves;s<o.length;s++){const r=o[s],a=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,c=r.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new aa[s.type]().fromJSON(s))}return this}}class ca extends Id{constructor(t){super(),this.type="Path",this.currentPoint=new St,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new oh(this.currentPoint.clone(),new St(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const o=new rh(this.currentPoint.clone(),new St(t,e),new St(n,s));return this.curves.push(o),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,o,r){const a=new sh(this.currentPoint.clone(),new St(t,e),new St(n,s),new St(o,r));return this.curves.push(a),this.currentPoint.set(o,r),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new ah(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,o,r){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,o,r),this}absarc(t,e,n,s,o,r){return this.absellipse(t,e,n,n,s,o,r),this}ellipse(t,e,n,s,o,r,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,o,r,a,c),this}absellipse(t,e,n,s,o,r,a,c){const l=new Ga(t,e,n,s,o,r,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Co extends ca{constructor(t){super(t),this.uuid=_i(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new ca().fromJSON(s))}return this}}function Ld(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let o=ch(i,0,s,e,!0);const r=[];if(!o||o.next===o.prev)return r;let a,c,l;if(n&&(o=Od(i,t,o,e)),i.length>80*e){a=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const f=i[d],g=i[d+1];f<a&&(a=f),g<c&&(c=g),f>h&&(h=f),g>u&&(u=g)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return Ss(o,r,e,a,c,l,0),r}function ch(i,t,e,n,s){let o;if(s===jd(i,t,e,n)>0)for(let r=t;r<e;r+=n)o=Cc(r/n|0,i[r],i[r+1],o);else for(let r=e-n;r>=t;r-=n)o=Cc(r/n|0,i[r],i[r+1],o);return o&&qi(o,o.next)&&(ws(o),o=o.next),o}function gi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(qi(e,e.next)||we(e.prev,e,e.next)===0)){if(ws(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ss(i,t,e,n,s,o,r){if(!i)return;!r&&o&&Hd(i,n,s,o);let a=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(o?Ud(i,n,s,o):Dd(i)){t.push(c.i,i.i,l.i),ws(i),i=l.next,a=l.next;continue}if(i=l,i===a){r?r===1?(i=Nd(gi(i),t),Ss(i,t,e,n,s,o,2)):r===2&&Fd(i,t,e,n,s,o):Ss(gi(i),t,e,n,s,o,1);break}}}function Dd(i){const t=i.prev,e=i,n=i.next;if(we(t,e,n)>=0)return!1;const s=t.x,o=e.x,r=n.x,a=t.y,c=e.y,l=n.y,h=Math.min(s,o,r),u=Math.min(a,c,l),d=Math.max(s,o,r),f=Math.max(a,c,l);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&cs(s,a,o,c,r,l,g.x,g.y)&&we(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Ud(i,t,e,n){const s=i.prev,o=i,r=i.next;if(we(s,o,r)>=0)return!1;const a=s.x,c=o.x,l=r.x,h=s.y,u=o.y,d=r.y,f=Math.min(a,c,l),g=Math.min(h,u,d),_=Math.max(a,c,l),m=Math.max(h,u,d),p=la(f,g,t,e,n),T=la(_,m,t,e,n);let b=i.prevZ,x=i.nextZ;for(;b&&b.z>=p&&x&&x.z<=T;){if(b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==s&&b!==r&&cs(a,h,c,u,l,d,b.x,b.y)&&we(b.prev,b,b.next)>=0||(b=b.prevZ,x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==r&&cs(a,h,c,u,l,d,x.x,x.y)&&we(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;b&&b.z>=p;){if(b.x>=f&&b.x<=_&&b.y>=g&&b.y<=m&&b!==s&&b!==r&&cs(a,h,c,u,l,d,b.x,b.y)&&we(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;x&&x.z<=T;){if(x.x>=f&&x.x<=_&&x.y>=g&&x.y<=m&&x!==s&&x!==r&&cs(a,h,c,u,l,d,x.x,x.y)&&we(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Nd(i,t){let e=i;do{const n=e.prev,s=e.next.next;!qi(n,s)&&hh(n,e,e.next,s)&&bs(n,s)&&bs(s,n)&&(t.push(n.i,e.i,s.i),ws(e),ws(e.next),e=i=s),e=e.next}while(e!==i);return gi(e)}function Fd(i,t,e,n,s,o){let r=i;do{let a=r.next.next;for(;a!==r.prev;){if(r.i!==a.i&&qd(r,a)){let c=uh(r,a);r=gi(r,r.next),c=gi(c,c.next),Ss(r,t,e,n,s,o,0),Ss(c,t,e,n,s,o,0);return}a=a.next}r=r.next}while(r!==i)}function Od(i,t,e,n){const s=[];for(let o=0,r=t.length;o<r;o++){const a=t[o]*n,c=o<r-1?t[o+1]*n:i.length,l=ch(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Wd(l))}s.sort(zd);for(let o=0;o<s.length;o++)e=Bd(s[o],e);return e}function zd(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Bd(i,t){const e=kd(i,t);if(!e)return t;const n=uh(e,i);return gi(n,n.next),gi(e,e.next)}function kd(i,t){let e=t;const n=i.x,s=i.y;let o=-1/0,r;if(qi(i,e))return e;do{if(qi(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>o&&(o=u,r=e.x<e.next.x?e:e.next,u===n))return r}e=e.next}while(e!==t);if(!r)return null;const a=r,c=r.x,l=r.y;let h=1/0;e=r;do{if(n>=e.x&&e.x>=c&&n!==e.x&&lh(s<l?n:o,s,c,l,s<l?o:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);bs(e,i)&&(u<h||u===h&&(e.x>r.x||e.x===r.x&&Vd(r,e)))&&(r=e,h=u)}e=e.next}while(e!==a);return r}function Vd(i,t){return we(i.prev,i,t.prev)<0&&we(t.next,i,i.next)<0}function Hd(i,t,e,n){let s=i;do s.z===0&&(s.z=la(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Gd(s)}function Gd(i){let t,e=1;do{let n=i,s;i=null;let o=null;for(t=0;n;){t++;let r=n,a=0;for(let l=0;l<e&&(a++,r=r.nextZ,!!r);l++);let c=e;for(;a>0||c>0&&r;)a!==0&&(c===0||!r||n.z<=r.z)?(s=n,n=n.nextZ,a--):(s=r,r=r.nextZ,c--),o?o.nextZ=s:i=s,s.prevZ=o,o=s;n=r}o.nextZ=null,e*=2}while(t>1);return i}function la(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Wd(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function lh(i,t,e,n,s,o,r,a){return(s-r)*(t-a)>=(i-r)*(o-a)&&(i-r)*(n-a)>=(e-r)*(t-a)&&(e-r)*(o-a)>=(s-r)*(n-a)}function cs(i,t,e,n,s,o,r,a){return!(i===r&&t===a)&&lh(i,t,e,n,s,o,r,a)}function qd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Xd(i,t)&&(bs(i,t)&&bs(t,i)&&Yd(i,t)&&(we(i.prev,i,t.prev)||we(i,t.prev,t))||qi(i,t)&&we(i.prev,i,i.next)>0&&we(t.prev,t,t.next)>0)}function we(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function qi(i,t){return i.x===t.x&&i.y===t.y}function hh(i,t,e,n){const s=$s(we(i,t,e)),o=$s(we(i,t,n)),r=$s(we(e,n,i)),a=$s(we(e,n,t));return!!(s!==o&&r!==a||s===0&&Ks(i,e,t)||o===0&&Ks(i,n,t)||r===0&&Ks(e,i,n)||a===0&&Ks(e,t,n))}function Ks(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function $s(i){return i>0?1:i<0?-1:0}function Xd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&hh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function bs(i,t){return we(i.prev,i,i.next)<0?we(i,t,i.next)>=0&&we(i,i.prev,t)>=0:we(i,t,i.prev)<0||we(i,i.next,t)<0}function Yd(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,o=(i.y+t.y)/2;do e.y>o!=e.next.y>o&&e.next.y!==e.y&&s<(e.next.x-e.x)*(o-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function uh(i,t){const e=ha(i.i,i.x,i.y),n=ha(t.i,t.x,t.y),s=i.next,o=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,o.next=n,n.prev=o,n}function Cc(i,t,e,n){const s=ha(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function ws(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ha(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function jd(i,t,e,n){let s=0;for(let o=t,r=e-n;o<e;o+=n)s+=(i[r]-i[o])*(i[o+1]+i[r+1]),r=o;return s}class Jd{static triangulate(t,e,n=2){return Ld(t,e,n)}}class On{static area(t){const e=t.length;let n=0;for(let s=e-1,o=0;o<e;s=o++)n+=t[s].x*t[o].y-t[o].x*t[s].y;return n*.5}static isClockWise(t){return On.area(t)<0}static triangulateShape(t,e){const n=[],s=[],o=[];Rc(t),Pc(n,t);let r=t.length;e.forEach(Rc);for(let c=0;c<e.length;c++)s.push(r),r+=e[c].length,Pc(n,e[c]);const a=Jd.triangulate(n,s);for(let c=0;c<a.length;c+=3)o.push(a.slice(c,c+3));return o}}function Rc(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Pc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class qa extends Ne{constructor(t=new Co([new St(.5,.5),new St(-.5,.5),new St(-.5,-.5),new St(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],o=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];r(l)}this.setAttribute("position",new le(s,3)),this.setAttribute("uv",new le(o,2)),this.computeVertexNormals();function r(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:Zd;let b,x=!1,L,w,C,R;p&&(b=p.getSpacedPoints(h),x=!0,d=!1,L=p.computeFrenetFrames(h,!1),w=new U,C=new U,R=new U),d||(m=0,f=0,g=0,_=0);const M=a.extractPoints(l);let v=M.shape;const D=M.holes;if(!On.isClockWise(v)){v=v.reverse();for(let lt=0,ot=D.length;lt<ot;lt++){const it=D[lt];On.isClockWise(it)&&(D[lt]=it.reverse())}}function k(lt){const it=10000000000000001e-36;let q=lt[0];for(let Mt=1;Mt<=lt.length;Mt++){const ft=Mt%lt.length,yt=lt[ft],Bt=yt.x-q.x,Yt=yt.y-q.y,P=Bt*Bt+Yt*Yt,y=Math.max(Math.abs(yt.x),Math.abs(yt.y),Math.abs(q.x),Math.abs(q.y)),V=it*y*y;if(P<=V){lt.splice(ft,1),Mt--;continue}q=yt}}k(v),D.forEach(k);const Y=D.length,j=v;for(let lt=0;lt<Y;lt++){const ot=D[lt];v=v.concat(ot)}function tt(lt,ot,it){return ot||console.error("THREE.ExtrudeGeometry: vec does not exist"),lt.clone().addScaledVector(ot,it)}const et=v.length;function K(lt,ot,it){let q,Mt,ft;const yt=lt.x-ot.x,Bt=lt.y-ot.y,Yt=it.x-lt.x,P=it.y-lt.y,y=yt*yt+Bt*Bt,V=yt*P-Bt*Yt;if(Math.abs(V)>Number.EPSILON){const $=Math.sqrt(y),rt=Math.sqrt(Yt*Yt+P*P),J=ot.x-Bt/$,It=ot.y+yt/$,gt=it.x-P/rt,Ut=it.y+Yt/rt,Nt=((gt-J)*P-(Ut-It)*Yt)/(yt*P-Bt*Yt);q=J+yt*Nt-lt.x,Mt=It+Bt*Nt-lt.y;const pt=q*q+Mt*Mt;if(pt<=2)return new St(q,Mt);ft=Math.sqrt(pt/2)}else{let $=!1;yt>Number.EPSILON?Yt>Number.EPSILON&&($=!0):yt<-Number.EPSILON?Yt<-Number.EPSILON&&($=!0):Math.sign(Bt)===Math.sign(P)&&($=!0),$?(q=-Bt,Mt=yt,ft=Math.sqrt(y)):(q=yt,Mt=Bt,ft=Math.sqrt(y/2))}return new St(q/ft,Mt/ft)}const _t=[];for(let lt=0,ot=j.length,it=ot-1,q=lt+1;lt<ot;lt++,it++,q++)it===ot&&(it=0),q===ot&&(q=0),_t[lt]=K(j[lt],j[it],j[q]);const Q=[];let bt,Wt=_t.concat();for(let lt=0,ot=Y;lt<ot;lt++){const it=D[lt];bt=[];for(let q=0,Mt=it.length,ft=Mt-1,yt=q+1;q<Mt;q++,ft++,yt++)ft===Mt&&(ft=0),yt===Mt&&(yt=0),bt[q]=K(it[q],it[ft],it[yt]);Q.push(bt),Wt=Wt.concat(bt)}let te;if(m===0)te=On.triangulateShape(j,D);else{const lt=[],ot=[];for(let it=0;it<m;it++){const q=it/m,Mt=f*Math.cos(q*Math.PI/2),ft=g*Math.sin(q*Math.PI/2)+_;for(let yt=0,Bt=j.length;yt<Bt;yt++){const Yt=tt(j[yt],_t[yt],ft);zt(Yt.x,Yt.y,-Mt),q===0&&lt.push(Yt)}for(let yt=0,Bt=Y;yt<Bt;yt++){const Yt=D[yt];bt=Q[yt];const P=[];for(let y=0,V=Yt.length;y<V;y++){const $=tt(Yt[y],bt[y],ft);zt($.x,$.y,-Mt),q===0&&P.push($)}q===0&&ot.push(P)}}te=On.triangulateShape(lt,ot)}const ce=te.length,se=g+_;for(let lt=0;lt<et;lt++){const ot=d?tt(v[lt],Wt[lt],se):v[lt];x?(C.copy(L.normals[0]).multiplyScalar(ot.x),w.copy(L.binormals[0]).multiplyScalar(ot.y),R.copy(b[0]).add(C).add(w),zt(R.x,R.y,R.z)):zt(ot.x,ot.y,0)}for(let lt=1;lt<=h;lt++)for(let ot=0;ot<et;ot++){const it=d?tt(v[ot],Wt[ot],se):v[ot];x?(C.copy(L.normals[lt]).multiplyScalar(it.x),w.copy(L.binormals[lt]).multiplyScalar(it.y),R.copy(b[lt]).add(C).add(w),zt(R.x,R.y,R.z)):zt(it.x,it.y,u/h*lt)}for(let lt=m-1;lt>=0;lt--){const ot=lt/m,it=f*Math.cos(ot*Math.PI/2),q=g*Math.sin(ot*Math.PI/2)+_;for(let Mt=0,ft=j.length;Mt<ft;Mt++){const yt=tt(j[Mt],_t[Mt],q);zt(yt.x,yt.y,u+it)}for(let Mt=0,ft=D.length;Mt<ft;Mt++){const yt=D[Mt];bt=Q[Mt];for(let Bt=0,Yt=yt.length;Bt<Yt;Bt++){const P=tt(yt[Bt],bt[Bt],q);x?zt(P.x,P.y+b[h-1].y,b[h-1].x+it):zt(P.x,P.y,u+it)}}}nt(),ct();function nt(){const lt=s.length/3;if(d){let ot=0,it=et*ot;for(let q=0;q<ce;q++){const Mt=te[q];Dt(Mt[2]+it,Mt[1]+it,Mt[0]+it)}ot=h+m*2,it=et*ot;for(let q=0;q<ce;q++){const Mt=te[q];Dt(Mt[0]+it,Mt[1]+it,Mt[2]+it)}}else{for(let ot=0;ot<ce;ot++){const it=te[ot];Dt(it[2],it[1],it[0])}for(let ot=0;ot<ce;ot++){const it=te[ot];Dt(it[0]+et*h,it[1]+et*h,it[2]+et*h)}}n.addGroup(lt,s.length/3-lt,0)}function ct(){const lt=s.length/3;let ot=0;Rt(j,ot),ot+=j.length;for(let it=0,q=D.length;it<q;it++){const Mt=D[it];Rt(Mt,ot),ot+=Mt.length}n.addGroup(lt,s.length/3-lt,1)}function Rt(lt,ot){let it=lt.length;for(;--it>=0;){const q=it;let Mt=it-1;Mt<0&&(Mt=lt.length-1);for(let ft=0,yt=h+m*2;ft<yt;ft++){const Bt=et*ft,Yt=et*(ft+1),P=ot+q+Bt,y=ot+Mt+Bt,V=ot+Mt+Yt,$=ot+q+Yt;ee(P,y,V,$)}}}function zt(lt,ot,it){c.push(lt),c.push(ot),c.push(it)}function Dt(lt,ot,it){me(lt),me(ot),me(it);const q=s.length/3,Mt=T.generateTopUV(n,s,q-3,q-2,q-1);N(Mt[0]),N(Mt[1]),N(Mt[2])}function ee(lt,ot,it,q){me(lt),me(ot),me(q),me(ot),me(it),me(q);const Mt=s.length/3,ft=T.generateSideWallUV(n,s,Mt-6,Mt-3,Mt-2,Mt-1);N(ft[0]),N(ft[1]),N(ft[3]),N(ft[1]),N(ft[2]),N(ft[3])}function me(lt){s.push(c[lt*3+0]),s.push(c[lt*3+1]),s.push(c[lt*3+2])}function N(lt){o.push(lt.x),o.push(lt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Kd(e,n,t)}static fromJSON(t,e){const n=[];for(let o=0,r=t.shapes.length;o<r;o++){const a=e[t.shapes[o]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new aa[s.type]().fromJSON(s)),new qa(n,t.options)}}const Zd={generateTopUV:function(i,t,e,n,s){const o=t[e*3],r=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new St(o,r),new St(a,c),new St(l,h)]},generateSideWallUV:function(i,t,e,n,s,o){const r=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],_=t[o*3],m=t[o*3+1],p=t[o*3+2];return Math.abs(a-h)<Math.abs(r-l)?[new St(r,1-c),new St(l,1-u),new St(d,1-g),new St(_,1-p)]:[new St(a,1-c),new St(h,1-u),new St(f,1-g),new St(m,1-p)]}};function Kd(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const o=i[n];e.shapes.push(o.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class As extends Ao{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],o=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,o,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new As(t.radius,t.detail)}}class sn extends Ne{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const o=t/2,r=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){const T=p*d-r;for(let b=0;b<l;b++){const x=b*u-o;g.push(x,-T,0),_.push(0,0,1),m.push(b/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let T=0;T<a;T++){const b=T+l*p,x=T+l*(p+1),L=T+1+l*(p+1),w=T+1+l*p;f.push(b,x,w),f.push(x,L,w)}this.setIndex(f),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(_,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sn(t.width,t.height,t.widthSegments,t.heightSegments)}}class Xa extends Ne{constructor(t=new Co([new St(0,.5),new St(-.5,-.5),new St(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],o=[],r=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new le(s,3)),this.setAttribute("normal",new le(o,3)),this.setAttribute("uv",new le(r,2));function l(h){const u=s.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;On.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const T=g[m];On.isClockWise(T)===!0&&(g[m]=T.reverse())}const _=On.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const T=g[m];f=f.concat(T)}for(let m=0,p=f.length;m<p;m++){const T=f[m];s.push(T.x,T.y,0),o.push(0,0,1),r.push(T.x,T.y)}for(let m=0,p=_.length;m<p;m++){const T=_[m],b=T[0]+u,x=T[1]+u,L=T[2]+u;n.push(b,x,L),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return $d(e,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const r=e[t.shapes[s]];n.push(r)}return new Xa(n,t.curveSegments)}}function $d(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Ht extends Ne{constructor(t=1,e=32,n=16,s=0,o=Math.PI*2,r=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:o,thetaStart:r,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(r+a,Math.PI);let l=0;const h=[],u=new U,d=new U,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){const T=[],b=p/n;let x=0;p===0&&r===0?x=.5/e:p===n&&c===Math.PI&&(x=-.5/e);for(let L=0;L<=e;L++){const w=L/e;u.x=-t*Math.cos(s+w*o)*Math.sin(r+b*a),u.y=t*Math.cos(r+b*a),u.z=t*Math.sin(s+w*o)*Math.sin(r+b*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(w+x,1-b),T.push(l++)}h.push(T)}for(let p=0;p<n;p++)for(let T=0;T<e;T++){const b=h[p][T+1],x=h[p][T],L=h[p+1][T],w=h[p+1][T+1];(p!==0||r>0)&&f.push(b,x,w),(p!==n-1||c<Math.PI)&&f.push(x,L,w)}this.setIndex(f),this.setAttribute("position",new le(g,3)),this.setAttribute("normal",new le(_,3)),this.setAttribute("uv",new le(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ht(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ce extends Ne{constructor(t=1,e=.4,n=12,s=48,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:o},n=Math.floor(n),s=Math.floor(s);const r=[],a=[],c=[],l=[],h=new U,u=new U,d=new U;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const _=g/s*o,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(_),u.y=(t+e*Math.cos(m))*Math.sin(_),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(_),h.y=t*Math.sin(_),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const _=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,T=(s+1)*f+g;r.push(_,m,T),r.push(m,p,T)}this.setIndex(r),this.setAttribute("position",new le(a,3)),this.setAttribute("normal",new le(c,3)),this.setAttribute("uv",new le(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ce(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class dh extends Ji{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new re(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new re(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hl,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class Qd extends Ji{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class tf extends Ji{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class fh extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new re(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class ph extends fh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new re(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const or=new Ee,Ic=new U,Lc=new U;class ef{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new St(512,512),this.mapType=En,this.map=null,this.mapPass=null,this.matrix=new Ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Va,this._frameExtents=new St(1,1),this._viewportCount=1,this._viewports=[new Re(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ic.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ic),Lc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Lc),e.updateMatrixWorld(),or.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(or,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(or)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Ya extends $l{constructor(t=-1,e=1,n=1,s=-1,o=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=o,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,o,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=o,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let o=n-t,r=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;o+=l*this.view.offsetX,r=o+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(o,r,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class nf extends ef{constructor(){super(new Ya(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class ua extends fh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new nf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class sf extends nn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class of{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Dc(i,t,e,n){const s=rf(n);switch(e){case Bl:return i*t;case Ua:return i*t/s.components*s.byteLength;case Na:return i*t/s.components*s.byteLength;case Vl:return i*t*2/s.components*s.byteLength;case Fa:return i*t*2/s.components*s.byteLength;case kl:return i*t*3/s.components*s.byteLength;case _n:return i*t*4/s.components*s.byteLength;case Oa:return i*t*4/s.components*s.byteLength;case ro:case ao:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case co:case lo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Ur:case Fr:return Math.max(i,16)*Math.max(t,8)/4;case Dr:case Nr:return Math.max(i,8)*Math.max(t,8)/2;case Or:case zr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Br:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case kr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Vr:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Hr:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Gr:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Wr:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case qr:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Xr:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Yr:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case jr:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Jr:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Zr:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Kr:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case $r:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Qr:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case ta:case ea:case na:return Math.ceil(i/4)*Math.ceil(t/4)*16;case ia:case sa:return Math.ceil(i/4)*Math.ceil(t/4)*8;case oa:case ra:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function rf(i){switch(i){case En:case Nl:return{byteLength:1,components:1};case ms:case Fl:case Ts:return{byteLength:2,components:1};case La:case Da:return{byteLength:2,components:4};case pi:case Ia:case Nn:return{byteLength:4,components:1};case Ol:case zl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Pa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Pa);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function mh(){let i=null,t=!1,e=null,n=null;function s(o,r){e(o,r),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(o){e=o},setContext:function(o){i=o}}}function af(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const _=u[f];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function o(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function r(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:o,update:r}}var cf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lf=`#ifdef USE_ALPHAHASH
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
#endif`,hf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,df=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pf=`#ifdef USE_AOMAP
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
#endif`,mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gf=`#ifdef USE_BATCHING
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
#endif`,vf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_f=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mf=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,yf=`#ifdef USE_IRIDESCENCE
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
#endif`,Sf=`#ifdef USE_BUMPMAP
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
#endif`,bf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Af=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
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
#endif`,If=`#define PI 3.141592653589793
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
} // validated`,Lf=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Df=`vec3 transformedNormal = objectNormal;
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
#endif`,Uf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ff=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Of=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kf=`#ifdef USE_ENVMAP
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
#endif`,Vf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Hf=`#ifdef USE_ENVMAP
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
#endif`,Gf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wf=`#ifdef USE_ENVMAP
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
#endif`,qf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Xf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,jf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jf=`#ifdef USE_GRADIENTMAP
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
}`,Zf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Kf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,$f=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qf=`uniform bool receiveShadow;
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
#endif`,tp=`#ifdef USE_ENVMAP
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
#endif`,ep=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,np=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ip=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sp=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,op=`PhysicalMaterial material;
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
#endif`,rp=`struct PhysicalMaterial {
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
}`,ap=`
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
#endif`,cp=`#if defined( RE_IndirectDiffuse )
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
#endif`,lp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,up=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vp=`#if defined( USE_POINTS_UV )
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
#endif`,_p=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,xp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,yp=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bp=`#ifdef USE_MORPHTARGETS
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
#endif`,wp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ep=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Tp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pp=`#ifdef USE_NORMALMAP
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
#endif`,Ip=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Lp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Up=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Np=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fp=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Op=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Bp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Gp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Wp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Xp=`float getShadowMask() {
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
}`,Yp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jp=`#ifdef USE_SKINNING
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
#endif`,Jp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Zp=`#ifdef USE_SKINNING
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
#endif`,Kp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$p=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,em=`#ifdef USE_TRANSMISSION
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
#endif`,nm=`#ifdef USE_TRANSMISSION
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
#endif`,im=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const am=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cm=`uniform sampler2D t2D;
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
}`,lm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fm=`#include <common>
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
}`,pm=`#if DEPTH_PACKING == 3200
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
}`,mm=`#define DISTANCE
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
}`,gm=`#define DISTANCE
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
}`,vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_m=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xm=`uniform float scale;
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
}`,Mm=`uniform vec3 diffuse;
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
}`,ym=`#include <common>
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
}`,Sm=`uniform vec3 diffuse;
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
}`,bm=`#define LAMBERT
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
}`,wm=`#define LAMBERT
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
}`,Em=`#define MATCAP
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
}`,Tm=`#define MATCAP
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
}`,Am=`#define NORMAL
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
}`,Cm=`#define NORMAL
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
}`,Rm=`#define PHONG
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
}`,Pm=`#define PHONG
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
}`,Im=`#define STANDARD
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
}`,Lm=`#define STANDARD
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
}`,Dm=`#define TOON
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
}`,Um=`#define TOON
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
}`,Nm=`uniform float size;
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
}`,Om=`#include <common>
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
}`,zm=`uniform vec3 color;
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
}`,Bm=`uniform float rotation;
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
}`,km=`uniform vec3 diffuse;
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
}`,Qt={alphahash_fragment:cf,alphahash_pars_fragment:lf,alphamap_fragment:hf,alphamap_pars_fragment:uf,alphatest_fragment:df,alphatest_pars_fragment:ff,aomap_fragment:pf,aomap_pars_fragment:mf,batching_pars_vertex:gf,batching_vertex:vf,begin_vertex:_f,beginnormal_vertex:xf,bsdfs:Mf,iridescence_fragment:yf,bumpmap_pars_fragment:Sf,clipping_planes_fragment:bf,clipping_planes_pars_fragment:wf,clipping_planes_pars_vertex:Ef,clipping_planes_vertex:Tf,color_fragment:Af,color_pars_fragment:Cf,color_pars_vertex:Rf,color_vertex:Pf,common:If,cube_uv_reflection_fragment:Lf,defaultnormal_vertex:Df,displacementmap_pars_vertex:Uf,displacementmap_vertex:Nf,emissivemap_fragment:Ff,emissivemap_pars_fragment:Of,colorspace_fragment:zf,colorspace_pars_fragment:Bf,envmap_fragment:kf,envmap_common_pars_fragment:Vf,envmap_pars_fragment:Hf,envmap_pars_vertex:Gf,envmap_physical_pars_fragment:tp,envmap_vertex:Wf,fog_vertex:qf,fog_pars_vertex:Xf,fog_fragment:Yf,fog_pars_fragment:jf,gradientmap_pars_fragment:Jf,lightmap_pars_fragment:Zf,lights_lambert_fragment:Kf,lights_lambert_pars_fragment:$f,lights_pars_begin:Qf,lights_toon_fragment:ep,lights_toon_pars_fragment:np,lights_phong_fragment:ip,lights_phong_pars_fragment:sp,lights_physical_fragment:op,lights_physical_pars_fragment:rp,lights_fragment_begin:ap,lights_fragment_maps:cp,lights_fragment_end:lp,logdepthbuf_fragment:hp,logdepthbuf_pars_fragment:up,logdepthbuf_pars_vertex:dp,logdepthbuf_vertex:fp,map_fragment:pp,map_pars_fragment:mp,map_particle_fragment:gp,map_particle_pars_fragment:vp,metalnessmap_fragment:_p,metalnessmap_pars_fragment:xp,morphinstance_vertex:Mp,morphcolor_vertex:yp,morphnormal_vertex:Sp,morphtarget_pars_vertex:bp,morphtarget_vertex:wp,normal_fragment_begin:Ep,normal_fragment_maps:Tp,normal_pars_fragment:Ap,normal_pars_vertex:Cp,normal_vertex:Rp,normalmap_pars_fragment:Pp,clearcoat_normal_fragment_begin:Ip,clearcoat_normal_fragment_maps:Lp,clearcoat_pars_fragment:Dp,iridescence_pars_fragment:Up,opaque_fragment:Np,packing:Fp,premultiplied_alpha_fragment:Op,project_vertex:zp,dithering_fragment:Bp,dithering_pars_fragment:kp,roughnessmap_fragment:Vp,roughnessmap_pars_fragment:Hp,shadowmap_pars_fragment:Gp,shadowmap_pars_vertex:Wp,shadowmap_vertex:qp,shadowmask_pars_fragment:Xp,skinbase_vertex:Yp,skinning_pars_vertex:jp,skinning_vertex:Jp,skinnormal_vertex:Zp,specularmap_fragment:Kp,specularmap_pars_fragment:$p,tonemapping_fragment:Qp,tonemapping_pars_fragment:tm,transmission_fragment:em,transmission_pars_fragment:nm,uv_pars_fragment:im,uv_pars_vertex:sm,uv_vertex:om,worldpos_vertex:rm,background_vert:am,background_frag:cm,backgroundCube_vert:lm,backgroundCube_frag:hm,cube_vert:um,cube_frag:dm,depth_vert:fm,depth_frag:pm,distanceRGBA_vert:mm,distanceRGBA_frag:gm,equirect_vert:vm,equirect_frag:_m,linedashed_vert:xm,linedashed_frag:Mm,meshbasic_vert:ym,meshbasic_frag:Sm,meshlambert_vert:bm,meshlambert_frag:wm,meshmatcap_vert:Em,meshmatcap_frag:Tm,meshnormal_vert:Am,meshnormal_frag:Cm,meshphong_vert:Rm,meshphong_frag:Pm,meshphysical_vert:Im,meshphysical_frag:Lm,meshtoon_vert:Dm,meshtoon_frag:Um,points_vert:Nm,points_frag:Fm,shadow_vert:Om,shadow_frag:zm,sprite_vert:Bm,sprite_frag:km},Tt={common:{diffuse:{value:new re(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new St(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new re(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new re(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new re(16777215)},opacity:{value:1},center:{value:new St(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},Mn={basic:{uniforms:He([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:Qt.meshbasic_vert,fragmentShader:Qt.meshbasic_frag},lambert:{uniforms:He([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new re(0)}}]),vertexShader:Qt.meshlambert_vert,fragmentShader:Qt.meshlambert_frag},phong:{uniforms:He([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new re(0)},specular:{value:new re(1118481)},shininess:{value:30}}]),vertexShader:Qt.meshphong_vert,fragmentShader:Qt.meshphong_frag},standard:{uniforms:He([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new re(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag},toon:{uniforms:He([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new re(0)}}]),vertexShader:Qt.meshtoon_vert,fragmentShader:Qt.meshtoon_frag},matcap:{uniforms:He([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:Qt.meshmatcap_vert,fragmentShader:Qt.meshmatcap_frag},points:{uniforms:He([Tt.points,Tt.fog]),vertexShader:Qt.points_vert,fragmentShader:Qt.points_frag},dashed:{uniforms:He([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Qt.linedashed_vert,fragmentShader:Qt.linedashed_frag},depth:{uniforms:He([Tt.common,Tt.displacementmap]),vertexShader:Qt.depth_vert,fragmentShader:Qt.depth_frag},normal:{uniforms:He([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:Qt.meshnormal_vert,fragmentShader:Qt.meshnormal_frag},sprite:{uniforms:He([Tt.sprite,Tt.fog]),vertexShader:Qt.sprite_vert,fragmentShader:Qt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Qt.background_vert,fragmentShader:Qt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:Qt.backgroundCube_vert,fragmentShader:Qt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Qt.cube_vert,fragmentShader:Qt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Qt.equirect_vert,fragmentShader:Qt.equirect_frag},distanceRGBA:{uniforms:He([Tt.common,Tt.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Qt.distanceRGBA_vert,fragmentShader:Qt.distanceRGBA_frag},shadow:{uniforms:He([Tt.lights,Tt.fog,{color:{value:new re(0)},opacity:{value:1}}]),vertexShader:Qt.shadow_vert,fragmentShader:Qt.shadow_frag}};Mn.physical={uniforms:He([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new St(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new re(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new St},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new re(0)},specularColor:{value:new re(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new St},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:Qt.meshphysical_vert,fragmentShader:Qt.meshphysical_frag};const Qs={r:0,b:0,g:0},si=new kn,Vm=new Ee;function Hm(i,t,e,n,s,o,r){const a=new re(0);let c=o===!0?0:1,l,h,u=null,d=0,f=null;function g(b){let x=b.isScene===!0?b.background:null;return x&&x.isTexture&&(x=(b.backgroundBlurriness>0?e:t).get(x)),x}function _(b){let x=!1;const L=g(b);L===null?p(a,c):L&&L.isColor&&(p(L,1),x=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,r):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,r),(i.autoClear||x)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(b,x){const L=g(x);L&&(L.isCubeTexture||L.mapping===wo)?(h===void 0&&(h=new S(new W(1,1,1),new Kn({name:"BackgroundCubeMaterial",uniforms:Wi(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Xe,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,C,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),si.copy(x.backgroundRotation),si.x*=-1,si.y*=-1,si.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),h.material.uniforms.envMap.value=L,h.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Vm.makeRotationFromEuler(si)),h.material.toneMapped=de.getTransfer(L.colorSpace)!==_e,(u!==L||d!==L.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=L,d=L.version,f=i.toneMapping),h.layers.enableAll(),b.unshift(h,h.geometry,h.material,0,0,null)):L&&L.isTexture&&(l===void 0&&(l=new S(new sn(2,2),new Kn({name:"BackgroundMaterial",uniforms:Wi(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=L,l.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,l.material.toneMapped=de.getTransfer(L.colorSpace)!==_e,L.matrixAutoUpdate===!0&&L.updateMatrix(),l.material.uniforms.uvTransform.value.copy(L.matrix),(u!==L||d!==L.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=L,d=L.version,f=i.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,x){b.getRGB(Qs,Kl(i)),n.buffers.color.setClear(Qs.r,Qs.g,Qs.b,x,r)}function T(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(b,x=1){a.set(b),c=x,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(b){c=b,p(a,c)},render:_,addToRenderList:m,dispose:T}}function Gm(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let o=s,r=!1;function a(v,D,F,k,Y){let j=!1;const tt=u(k,F,D);o!==tt&&(o=tt,l(o.object)),j=f(v,k,F,Y),j&&g(v,k,F,Y),Y!==null&&t.update(Y,i.ELEMENT_ARRAY_BUFFER),(j||r)&&(r=!1,x(v,D,F,k),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function c(){return i.createVertexArray()}function l(v){return i.bindVertexArray(v)}function h(v){return i.deleteVertexArray(v)}function u(v,D,F){const k=F.wireframe===!0;let Y=n[v.id];Y===void 0&&(Y={},n[v.id]=Y);let j=Y[D.id];j===void 0&&(j={},Y[D.id]=j);let tt=j[k];return tt===void 0&&(tt=d(c()),j[k]=tt),tt}function d(v){const D=[],F=[],k=[];for(let Y=0;Y<e;Y++)D[Y]=0,F[Y]=0,k[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:k,object:v,attributes:{},index:null}}function f(v,D,F,k){const Y=o.attributes,j=D.attributes;let tt=0;const et=F.getAttributes();for(const K in et)if(et[K].location>=0){const Q=Y[K];let bt=j[K];if(bt===void 0&&(K==="instanceMatrix"&&v.instanceMatrix&&(bt=v.instanceMatrix),K==="instanceColor"&&v.instanceColor&&(bt=v.instanceColor)),Q===void 0||Q.attribute!==bt||bt&&Q.data!==bt.data)return!0;tt++}return o.attributesNum!==tt||o.index!==k}function g(v,D,F,k){const Y={},j=D.attributes;let tt=0;const et=F.getAttributes();for(const K in et)if(et[K].location>=0){let Q=j[K];Q===void 0&&(K==="instanceMatrix"&&v.instanceMatrix&&(Q=v.instanceMatrix),K==="instanceColor"&&v.instanceColor&&(Q=v.instanceColor));const bt={};bt.attribute=Q,Q&&Q.data&&(bt.data=Q.data),Y[K]=bt,tt++}o.attributes=Y,o.attributesNum=tt,o.index=k}function _(){const v=o.newAttributes;for(let D=0,F=v.length;D<F;D++)v[D]=0}function m(v){p(v,0)}function p(v,D){const F=o.newAttributes,k=o.enabledAttributes,Y=o.attributeDivisors;F[v]=1,k[v]===0&&(i.enableVertexAttribArray(v),k[v]=1),Y[v]!==D&&(i.vertexAttribDivisor(v,D),Y[v]=D)}function T(){const v=o.newAttributes,D=o.enabledAttributes;for(let F=0,k=D.length;F<k;F++)D[F]!==v[F]&&(i.disableVertexAttribArray(F),D[F]=0)}function b(v,D,F,k,Y,j,tt){tt===!0?i.vertexAttribIPointer(v,D,F,Y,j):i.vertexAttribPointer(v,D,F,k,Y,j)}function x(v,D,F,k){_();const Y=k.attributes,j=F.getAttributes(),tt=D.defaultAttributeValues;for(const et in j){const K=j[et];if(K.location>=0){let _t=Y[et];if(_t===void 0&&(et==="instanceMatrix"&&v.instanceMatrix&&(_t=v.instanceMatrix),et==="instanceColor"&&v.instanceColor&&(_t=v.instanceColor)),_t!==void 0){const Q=_t.normalized,bt=_t.itemSize,Wt=t.get(_t);if(Wt===void 0)continue;const te=Wt.buffer,ce=Wt.type,se=Wt.bytesPerElement,nt=ce===i.INT||ce===i.UNSIGNED_INT||_t.gpuType===Ia;if(_t.isInterleavedBufferAttribute){const ct=_t.data,Rt=ct.stride,zt=_t.offset;if(ct.isInstancedInterleavedBuffer){for(let Dt=0;Dt<K.locationSize;Dt++)p(K.location+Dt,ct.meshPerAttribute);v.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Dt=0;Dt<K.locationSize;Dt++)m(K.location+Dt);i.bindBuffer(i.ARRAY_BUFFER,te);for(let Dt=0;Dt<K.locationSize;Dt++)b(K.location+Dt,bt/K.locationSize,ce,Q,Rt*se,(zt+bt/K.locationSize*Dt)*se,nt)}else{if(_t.isInstancedBufferAttribute){for(let ct=0;ct<K.locationSize;ct++)p(K.location+ct,_t.meshPerAttribute);v.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=_t.meshPerAttribute*_t.count)}else for(let ct=0;ct<K.locationSize;ct++)m(K.location+ct);i.bindBuffer(i.ARRAY_BUFFER,te);for(let ct=0;ct<K.locationSize;ct++)b(K.location+ct,bt/K.locationSize,ce,Q,bt*se,bt/K.locationSize*ct*se,nt)}}else if(tt!==void 0){const Q=tt[et];if(Q!==void 0)switch(Q.length){case 2:i.vertexAttrib2fv(K.location,Q);break;case 3:i.vertexAttrib3fv(K.location,Q);break;case 4:i.vertexAttrib4fv(K.location,Q);break;default:i.vertexAttrib1fv(K.location,Q)}}}}T()}function L(){R();for(const v in n){const D=n[v];for(const F in D){const k=D[F];for(const Y in k)h(k[Y].object),delete k[Y];delete D[F]}delete n[v]}}function w(v){if(n[v.id]===void 0)return;const D=n[v.id];for(const F in D){const k=D[F];for(const Y in k)h(k[Y].object),delete k[Y];delete D[F]}delete n[v.id]}function C(v){for(const D in n){const F=n[D];if(F[v.id]===void 0)continue;const k=F[v.id];for(const Y in k)h(k[Y].object),delete k[Y];delete F[v.id]}}function R(){M(),r=!0,o!==s&&(o=s,l(o.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:M,dispose:L,releaseStatesOfGeometry:w,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:T}}function Wm(i,t,e){let n;function s(l){n=l}function o(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function r(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)r(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_]*d[_];e.update(g,n,1)}}this.setMode=s,this.render=o,this.renderInstances=r,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function qm(i,t,e,n){let s;function o(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const C=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(C){return!(C!==_n&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){const R=C===Ts&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(C!==En&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Nn&&!R)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),T=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),x=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:o,getMaxPrecision:c,textureFormatReadable:r,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:T,maxVaryings:b,maxFragmentUniforms:x,vertexTextures:L,maxSamples:w}}function Xm(i){const t=this;let e=null,n=0,s=!1,o=!1;const r=new ai,a=new $t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){o=!0,h(null)},this.endShadows=function(){o=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||o&&!m)o?h(null):l();else{const T=o?0:n,b=T*4;let x=p.clippingState||null;c.value=x,x=h(g,d,b,f);for(let L=0;L!==b;++L)x[L]=e[L];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=T}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const _=u!==null?u.length:0;let m=null;if(_!==0){if(m=c.value,g!==!0||m===null){const p=f+_*4,T=d.matrixWorldInverse;a.getNormalMatrix(T),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,x=f;b!==_;++b,x+=4)r.copy(u[b]).applyMatrix4(T,a),r.normal.toArray(m,x),m[x+3]=r.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}function Ym(i){let t=new WeakMap;function e(r,a){return a===Rr?r.mapping=Vi:a===Pr&&(r.mapping=Hi),r}function n(r){if(r&&r.isTexture){const a=r.mapping;if(a===Rr||a===Pr)if(t.has(r)){const c=t.get(r).texture;return e(c,r.mapping)}else{const c=r.image;if(c&&c.height>0){const l=new ud(c.height);return l.fromEquirectangularTexture(i,r),t.set(r,l),r.addEventListener("dispose",s),e(l.texture,r.mapping)}else return null}}return r}function s(r){const a=r.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function o(){t=new WeakMap}return{get:n,dispose:o}}const Oi=4,Uc=[.125,.215,.35,.446,.526,.582],hi=20,rr=new Ya,Nc=new re;let ar=null,cr=0,lr=0,hr=!1;const ci=(1+Math.sqrt(5))/2,Di=1/ci,Fc=[new U(-ci,Di,0),new U(ci,Di,0),new U(-Di,0,ci),new U(Di,0,ci),new U(0,ci,-Di),new U(0,ci,Di),new U(-1,1,-1),new U(1,1,-1),new U(-1,1,1),new U(1,1,1)],jm=new U;class Oc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,o={}){const{size:r=256,position:a=jm}=o;ar=this._renderer.getRenderTarget(),cr=this._renderer.getActiveCubeFace(),lr=this._renderer.getActiveMipmapLevel(),hr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=kc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Bc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ar,cr,lr),this._renderer.xr.enabled=hr,t.scissorTest=!1,to(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Vi||t.mapping===Hi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ar=this._renderer.getRenderTarget(),cr=this._renderer.getActiveCubeFace(),lr=this._renderer.getActiveMipmapLevel(),hr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:yn,minFilter:yn,generateMipmaps:!1,type:Ts,format:_n,colorSpace:Gi,depthBuffer:!1},s=zc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zc(t,e,n);const{_lodMax:o}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Jm(o)),this._blurMaterial=Zm(o,t,e)}return s}_compileMaterial(t){const e=new S(this._lodPlanes[0],t);this._renderer.compile(e,rr)}_sceneToCubeUV(t,e,n,s,o){const c=new nn(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(Nc),u.toneMapping=Zn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const _=new To({name:"PMREM.Background",side:Xe,depthWrite:!1,depthTest:!1}),m=new S(new W,_);let p=!1;const T=t.background;T?T.isColor&&(_.color.copy(T),t.background=null,p=!0):(_.color.copy(Nc),p=!0);for(let b=0;b<6;b++){const x=b%3;x===0?(c.up.set(0,l[b],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x+h[b],o.y,o.z)):x===1?(c.up.set(0,0,l[b]),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y+h[b],o.z)):(c.up.set(0,l[b],0),c.position.set(o.x,o.y,o.z),c.lookAt(o.x,o.y,o.z+h[b]));const L=this._cubeSize;to(s,x*L,b>2?L:0,L,L),u.setRenderTarget(s),p&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=T}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===Vi||t.mapping===Hi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=kc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Bc());const o=s?this._cubemapMaterial:this._equirectMaterial,r=new S(this._lodPlanes[0],o),a=o.uniforms;a.envMap.value=t;const c=this._cubeSize;to(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(r,rr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let o=1;o<s;o++){const r=Math.sqrt(this._sigmas[o]*this._sigmas[o]-this._sigmas[o-1]*this._sigmas[o-1]),a=Fc[(s-o-1)%Fc.length];this._blur(t,o-1,o,r,a)}e.autoClear=n}_blur(t,e,n,s,o){const r=this._pingPongRenderTarget;this._halfBlur(t,r,e,n,s,"latitudinal",o),this._halfBlur(r,t,n,n,s,"longitudinal",o)}_halfBlur(t,e,n,s,o,r,a){const c=this._renderer,l=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new S(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(o)?Math.PI/(2*f):2*Math.PI/(2*hi-1),_=o/g,m=isFinite(o)?1+Math.floor(h*_):hi;m>hi&&console.warn(`sigmaRadians, ${o}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${hi}`);const p=[];let T=0;for(let C=0;C<hi;++C){const R=C/_,M=Math.exp(-R*R/2);p.push(M),C===0?T+=M:C<m&&(T+=2*M)}for(let C=0;C<p.length;C++)p[C]=p[C]/T;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=r==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:b}=this;d.dTheta.value=g,d.mipInt.value=b-n;const x=this._sizeLods[s],L=3*x*(s>b-Oi?s-b+Oi:0),w=4*(this._cubeSize-x);to(e,L,w,3*x,2*x),c.setRenderTarget(e),c.render(u,rr)}}function Jm(i){const t=[],e=[],n=[];let s=i;const o=i-Oi+1+Uc.length;for(let r=0;r<o;r++){const a=Math.pow(2,s);e.push(a);let c=1/a;r>i-Oi?c=Uc[r-i+Oi-1]:r===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,_=3,m=2,p=1,T=new Float32Array(_*g*f),b=new Float32Array(m*g*f),x=new Float32Array(p*g*f);for(let w=0;w<f;w++){const C=w%3*2/3-1,R=w>2?0:-1,M=[C,R,0,C+2/3,R,0,C+2/3,R+1,0,C,R,0,C+2/3,R+1,0,C,R+1,0];T.set(M,_*g*w),b.set(d,m*g*w);const v=[w,w,w,w,w,w];x.set(v,p*g*w)}const L=new Ne;L.setAttribute("position",new wn(T,_)),L.setAttribute("uv",new wn(b,m)),L.setAttribute("faceIndex",new wn(x,p)),t.push(L),s>Oi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function zc(i,t,e){const n=new mi(i,t,e);return n.texture.mapping=wo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function to(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Zm(i,t,e){const n=new Float32Array(hi),s=new U(0,1,0);return new Kn({name:"SphericalGaussianBlur",defines:{n:hi,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ja(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function Bc(){return new Kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ja(),fragmentShader:`

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
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function kc(){return new Kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ja(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Jn,depthTest:!1,depthWrite:!1})}function ja(){return`

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
	`}function Km(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Rr||c===Pr,h=c===Vi||c===Hi;if(l||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new Oc(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new Oc(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",o),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function o(a){const c=a.target;c.removeEventListener("dispose",o);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function r(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:r}}function $m(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Ms("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Qm(i,t,e,n){const s={},o=new WeakMap;function r(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",r),delete s[d.id];const f=o.get(d);f&&(t.remove(f),o.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",r),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let _=0;if(f!==null){const T=f.array;_=f.version;for(let b=0,x=T.length;b<x;b+=3){const L=T[b+0],w=T[b+1],C=T[b+2];d.push(L,w,w,C,C,L)}}else if(g!==void 0){const T=g.array;_=g.version;for(let b=0,x=T.length/3-1;b<x;b+=3){const L=b+0,w=b+1,C=b+2;d.push(L,w,w,C,C,L)}}else return;const m=new(Wl(d)?Zl:Jl)(d,1);m.version=_;const p=o.get(u);p&&t.remove(p),o.set(u,m)}function h(u){const d=o.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return o.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function t0(i,t,e){let n;function s(d){n=d}let o,r;function a(d){o=d.type,r=d.bytesPerElement}function c(d,f){i.drawElements(n,f,o,d*r),e.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,o,d*r,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,o,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,_){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/r,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,o,d,0,_,0,g);let p=0;for(let T=0;T<g;T++)p+=f[T]*_[T];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function e0(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(o,r,a){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=a*(o/3);break;case i.LINES:e.lines+=a*(o/2);break;case i.LINE_STRIP:e.lines+=a*(o-1);break;case i.LINE_LOOP:e.lines+=a*o;break;case i.POINTS:e.points+=a*o;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function n0(i,t,e){const n=new WeakMap,s=new Re;function o(r,a,c){const l=r.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let v=function(){R.dispose(),n.delete(a),a.removeEventListener("dispose",v)};var f=v;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],T=a.morphAttributes.normal||[],b=a.morphAttributes.color||[];let x=0;g===!0&&(x=1),_===!0&&(x=2),m===!0&&(x=3);let L=a.attributes.position.count*x,w=1;L>t.maxTextureSize&&(w=Math.ceil(L/t.maxTextureSize),L=t.maxTextureSize);const C=new Float32Array(L*w*4*u),R=new ql(C,L,w,u);R.type=Nn,R.needsUpdate=!0;const M=x*4;for(let D=0;D<u;D++){const F=p[D],k=T[D],Y=b[D],j=L*w*4*D;for(let tt=0;tt<F.count;tt++){const et=tt*M;g===!0&&(s.fromBufferAttribute(F,tt),C[j+et+0]=s.x,C[j+et+1]=s.y,C[j+et+2]=s.z,C[j+et+3]=0),_===!0&&(s.fromBufferAttribute(k,tt),C[j+et+4]=s.x,C[j+et+5]=s.y,C[j+et+6]=s.z,C[j+et+7]=0),m===!0&&(s.fromBufferAttribute(Y,tt),C[j+et+8]=s.x,C[j+et+9]=s.y,C[j+et+10]=s.z,C[j+et+11]=Y.itemSize===4?s.w:1)}}d={count:u,texture:R,size:new St(L,w)},n.set(a,d),a.addEventListener("dispose",v)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:o}}function i0(i,t,e,n){let s=new WeakMap;function o(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function r(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:o,dispose:r}}const gh=new Be,Vc=new nh(1,1),vh=new ql,_h=new ju,xh=new Ql,Hc=[],Gc=[],Wc=new Float32Array(16),qc=new Float32Array(9),Xc=new Float32Array(4);function Zi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let o=Hc[s];if(o===void 0&&(o=new Float32Array(s),Hc[s]=o),t!==0){n.toArray(o,0);for(let r=1,a=0;r!==t;++r)a+=e,i[r].toArray(o,a)}return o}function Ie(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Le(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ro(i,t){let e=Gc[t];e===void 0&&(e=new Int32Array(t),Gc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function s0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function o0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2fv(this.addr,t),Le(e,t)}}function r0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ie(e,t))return;i.uniform3fv(this.addr,t),Le(e,t)}}function a0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4fv(this.addr,t),Le(e,t)}}function c0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;Xc.set(n),i.uniformMatrix2fv(this.addr,!1,Xc),Le(e,n)}}function l0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;qc.set(n),i.uniformMatrix3fv(this.addr,!1,qc),Le(e,n)}}function h0(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ie(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Ie(e,n))return;Wc.set(n),i.uniformMatrix4fv(this.addr,!1,Wc),Le(e,n)}}function u0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function d0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2iv(this.addr,t),Le(e,t)}}function f0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3iv(this.addr,t),Le(e,t)}}function p0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4iv(this.addr,t),Le(e,t)}}function m0(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function g0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ie(e,t))return;i.uniform2uiv(this.addr,t),Le(e,t)}}function v0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ie(e,t))return;i.uniform3uiv(this.addr,t),Le(e,t)}}function _0(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ie(e,t))return;i.uniform4uiv(this.addr,t),Le(e,t)}}function x0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let o;this.type===i.SAMPLER_2D_SHADOW?(Vc.compareFunction=Gl,o=Vc):o=gh,e.setTexture2D(t||o,s)}function M0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||_h,s)}function y0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||xh,s)}function S0(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||vh,s)}function b0(i){switch(i){case 5126:return s0;case 35664:return o0;case 35665:return r0;case 35666:return a0;case 35674:return c0;case 35675:return l0;case 35676:return h0;case 5124:case 35670:return u0;case 35667:case 35671:return d0;case 35668:case 35672:return f0;case 35669:case 35673:return p0;case 5125:return m0;case 36294:return g0;case 36295:return v0;case 36296:return _0;case 35678:case 36198:case 36298:case 36306:case 35682:return x0;case 35679:case 36299:case 36307:return M0;case 35680:case 36300:case 36308:case 36293:return y0;case 36289:case 36303:case 36311:case 36292:return S0}}function w0(i,t){i.uniform1fv(this.addr,t)}function E0(i,t){const e=Zi(t,this.size,2);i.uniform2fv(this.addr,e)}function T0(i,t){const e=Zi(t,this.size,3);i.uniform3fv(this.addr,e)}function A0(i,t){const e=Zi(t,this.size,4);i.uniform4fv(this.addr,e)}function C0(i,t){const e=Zi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function R0(i,t){const e=Zi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function P0(i,t){const e=Zi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function I0(i,t){i.uniform1iv(this.addr,t)}function L0(i,t){i.uniform2iv(this.addr,t)}function D0(i,t){i.uniform3iv(this.addr,t)}function U0(i,t){i.uniform4iv(this.addr,t)}function N0(i,t){i.uniform1uiv(this.addr,t)}function F0(i,t){i.uniform2uiv(this.addr,t)}function O0(i,t){i.uniform3uiv(this.addr,t)}function z0(i,t){i.uniform4uiv(this.addr,t)}function B0(i,t,e){const n=this.cache,s=t.length,o=Ro(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let r=0;r!==s;++r)e.setTexture2D(t[r]||gh,o[r])}function k0(i,t,e){const n=this.cache,s=t.length,o=Ro(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||_h,o[r])}function V0(i,t,e){const n=this.cache,s=t.length,o=Ro(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let r=0;r!==s;++r)e.setTextureCube(t[r]||xh,o[r])}function H0(i,t,e){const n=this.cache,s=t.length,o=Ro(e,s);Ie(n,o)||(i.uniform1iv(this.addr,o),Le(n,o));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||vh,o[r])}function G0(i){switch(i){case 5126:return w0;case 35664:return E0;case 35665:return T0;case 35666:return A0;case 35674:return C0;case 35675:return R0;case 35676:return P0;case 5124:case 35670:return I0;case 35667:case 35671:return L0;case 35668:case 35672:return D0;case 35669:case 35673:return U0;case 5125:return N0;case 36294:return F0;case 36295:return O0;case 36296:return z0;case 35678:case 36198:case 36298:case 36306:case 35682:return B0;case 35679:case 36299:case 36307:return k0;case 35680:case 36300:case 36308:case 36293:return V0;case 36289:case 36303:case 36311:case 36292:return H0}}class W0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=b0(e.type)}}class q0{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=G0(e.type)}}class X0{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let o=0,r=s.length;o!==r;++o){const a=s[o];a.setValue(t,e[a.id],n)}}}const ur=/(\w+)(\])?(\[|\.)?/g;function Yc(i,t){i.seq.push(t),i.map[t.id]=t}function Y0(i,t,e){const n=i.name,s=n.length;for(ur.lastIndex=0;;){const o=ur.exec(n),r=ur.lastIndex;let a=o[1];const c=o[2]==="]",l=o[3];if(c&&(a=a|0),l===void 0||l==="["&&r+2===s){Yc(e,l===void 0?new W0(a,i,t):new q0(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new X0(a),Yc(e,u)),e=u}}}class ho{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const o=t.getActiveUniform(e,s),r=t.getUniformLocation(e,o.name);Y0(o,r,this)}}setValue(t,e,n,s){const o=this.map[e];o!==void 0&&o.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let o=0,r=e.length;o!==r;++o){const a=e[o],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,o=t.length;s!==o;++s){const r=t[s];r.id in e&&n.push(r)}return n}}function jc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const j0=37297;let J0=0;function Z0(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),o=Math.min(t+6,e.length);for(let r=s;r<o;r++){const a=r+1;n.push(`${a===t?">":" "} ${a}: ${e[r]}`)}return n.join(`
`)}const Jc=new $t;function K0(i){de._getMatrix(Jc,de.workingColorSpace,i);const t=`mat3( ${Jc.elements.map(e=>e.toFixed(4))} )`;switch(de.getTransfer(i)){case vo:return[t,"LinearTransferOETF"];case _e:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Zc(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),o=(i.getShaderInfoLog(t)||"").trim();if(n&&o==="")return"";const r=/ERROR: 0:(\d+)/.exec(o);if(r){const a=parseInt(r[1]);return e.toUpperCase()+`

`+o+`

`+Z0(i.getShaderSource(t),a)}else return o}function $0(i,t){const e=K0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Q0(i,t){let e;switch(t){case au:e="Linear";break;case cu:e="Reinhard";break;case lu:e="Cineon";break;case hu:e="ACESFilmic";break;case du:e="AgX";break;case fu:e="Neutral";break;case uu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const eo=new U;function tg(){de.getLuminanceCoefficients(eo);const i=eo.x.toFixed(4),t=eo.y.toFixed(4),e=eo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function eg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ls).join(`
`)}function ng(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function ig(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const o=i.getActiveAttrib(t,s),r=o.name;let a=1;o.type===i.FLOAT_MAT2&&(a=2),o.type===i.FLOAT_MAT3&&(a=3),o.type===i.FLOAT_MAT4&&(a=4),e[r]={type:o.type,location:i.getAttribLocation(t,r),locationSize:a}}return e}function ls(i){return i!==""}function Kc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function $c(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const sg=/^[ \t]*#include +<([\w\d./]+)>/gm;function da(i){return i.replace(sg,rg)}const og=new Map;function rg(i,t){let e=Qt[t];if(e===void 0){const n=og.get(t);if(n!==void 0)e=Qt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return da(e)}const ag=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Qc(i){return i.replace(ag,cg)}function cg(i,t,e,n){let s="";for(let o=parseInt(t);o<parseInt(e);o++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+o+" ]").replace(/UNROLLED_LOOP_INDEX/g,o);return s}function tl(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function lg(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Il?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Ll?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Ln&&(t="SHADOWMAP_TYPE_VSM"),t}function hg(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Vi:case Hi:t="ENVMAP_TYPE_CUBE";break;case wo:t="ENVMAP_TYPE_CUBE_UV";break}return t}function ug(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Hi:t="ENVMAP_MODE_REFRACTION";break}return t}function dg(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Dl:t="ENVMAP_BLENDING_MULTIPLY";break;case ou:t="ENVMAP_BLENDING_MIX";break;case ru:t="ENVMAP_BLENDING_ADD";break}return t}function fg(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function pg(i,t,e,n){const s=i.getContext(),o=e.defines;let r=e.vertexShader,a=e.fragmentShader;const c=lg(e),l=hg(e),h=ug(e),u=dg(e),d=fg(e),f=eg(e),g=ng(o),_=s.createProgram();let m,p,T=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ls).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(ls).join(`
`),p.length>0&&(p+=`
`)):(m=[tl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ls).join(`
`),p=[tl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Zn?"#define TONE_MAPPING":"",e.toneMapping!==Zn?Qt.tonemapping_pars_fragment:"",e.toneMapping!==Zn?Q0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Qt.colorspace_pars_fragment,$0("linearToOutputTexel",e.outputColorSpace),tg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ls).join(`
`)),r=da(r),r=Kc(r,e),r=$c(r,e),a=da(a),a=Kc(a,e),a=$c(a,e),r=Qc(r),a=Qc(a),e.isRawShaderMaterial!==!0&&(T=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===ic?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===ic?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const b=T+m+r,x=T+p+a,L=jc(s,s.VERTEX_SHADER,b),w=jc(s,s.FRAGMENT_SHADER,x);s.attachShader(_,L),s.attachShader(_,w),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function C(D){if(i.debug.checkShaderErrors){const F=s.getProgramInfoLog(_)||"",k=s.getShaderInfoLog(L)||"",Y=s.getShaderInfoLog(w)||"",j=F.trim(),tt=k.trim(),et=Y.trim();let K=!0,_t=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(K=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,L,w);else{const Q=Zc(s,L,"vertex"),bt=Zc(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+j+`
`+Q+`
`+bt)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(tt===""||et==="")&&(_t=!1);_t&&(D.diagnostics={runnable:K,programLog:j,vertexShader:{log:tt,prefix:m},fragmentShader:{log:et,prefix:p}})}s.deleteShader(L),s.deleteShader(w),R=new ho(s,_),M=ig(s,_)}let R;this.getUniforms=function(){return R===void 0&&C(this),R};let M;this.getAttributes=function(){return M===void 0&&C(this),M};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=s.getProgramParameter(_,j0)),v},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=J0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=w,this}let mg=0;class gg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),o=this._getShaderStage(n),r=this._getShaderCacheForMaterial(t);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(o)===!1&&(r.add(o),o.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new vg(t),e.set(t,n)),n}}class vg{constructor(t){this.id=mg++,this.code=t,this.usedTimes=0}}function _g(i,t,e,n,s,o,r){const a=new Yl,c=new gg,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return l.add(M),M===0?"uv":`uv${M}`}function m(M,v,D,F,k){const Y=F.fog,j=k.geometry,tt=M.isMeshStandardMaterial?F.environment:null,et=(M.isMeshStandardMaterial?e:t).get(M.envMap||tt),K=et&&et.mapping===wo?et.image.height:null,_t=g[M.type];M.precision!==null&&(f=s.getMaxPrecision(M.precision),f!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",f,"instead."));const Q=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,bt=Q!==void 0?Q.length:0;let Wt=0;j.morphAttributes.position!==void 0&&(Wt=1),j.morphAttributes.normal!==void 0&&(Wt=2),j.morphAttributes.color!==void 0&&(Wt=3);let te,ce,se,nt;if(_t){const ie=Mn[_t];te=ie.vertexShader,ce=ie.fragmentShader}else te=M.vertexShader,ce=M.fragmentShader,c.update(M),se=c.getVertexShaderID(M),nt=c.getFragmentShaderID(M);const ct=i.getRenderTarget(),Rt=i.state.buffers.depth.getReversed(),zt=k.isInstancedMesh===!0,Dt=k.isBatchedMesh===!0,ee=!!M.map,me=!!M.matcap,N=!!et,lt=!!M.aoMap,ot=!!M.lightMap,it=!!M.bumpMap,q=!!M.normalMap,Mt=!!M.displacementMap,ft=!!M.emissiveMap,yt=!!M.metalnessMap,Bt=!!M.roughnessMap,Yt=M.anisotropy>0,P=M.clearcoat>0,y=M.dispersion>0,V=M.iridescence>0,$=M.sheen>0,rt=M.transmission>0,J=Yt&&!!M.anisotropyMap,It=P&&!!M.clearcoatMap,gt=P&&!!M.clearcoatNormalMap,Ut=P&&!!M.clearcoatRoughnessMap,Nt=V&&!!M.iridescenceMap,pt=V&&!!M.iridescenceThicknessMap,At=$&&!!M.sheenColorMap,Vt=$&&!!M.sheenRoughnessMap,Ot=!!M.specularMap,Et=!!M.specularColorMap,Zt=!!M.specularIntensityMap,z=rt&&!!M.transmissionMap,mt=rt&&!!M.thicknessMap,xt=!!M.gradientMap,wt=!!M.alphaMap,dt=M.alphaTest>0,st=!!M.alphaHash,Lt=!!M.extensions;let Jt=Zn;M.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(Jt=i.toneMapping);const ge={shaderID:_t,shaderType:M.type,shaderName:M.name,vertexShader:te,fragmentShader:ce,defines:M.defines,customVertexShaderID:se,customFragmentShaderID:nt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:f,batching:Dt,batchingColor:Dt&&k._colorsTexture!==null,instancing:zt,instancingColor:zt&&k.instanceColor!==null,instancingMorph:zt&&k.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ct===null?i.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:Gi,alphaToCoverage:!!M.alphaToCoverage,map:ee,matcap:me,envMap:N,envMapMode:N&&et.mapping,envMapCubeUVHeight:K,aoMap:lt,lightMap:ot,bumpMap:it,normalMap:q,displacementMap:d&&Mt,emissiveMap:ft,normalMapObjectSpace:q&&M.normalMapType===vu,normalMapTangentSpace:q&&M.normalMapType===Hl,metalnessMap:yt,roughnessMap:Bt,anisotropy:Yt,anisotropyMap:J,clearcoat:P,clearcoatMap:It,clearcoatNormalMap:gt,clearcoatRoughnessMap:Ut,dispersion:y,iridescence:V,iridescenceMap:Nt,iridescenceThicknessMap:pt,sheen:$,sheenColorMap:At,sheenRoughnessMap:Vt,specularMap:Ot,specularColorMap:Et,specularIntensityMap:Zt,transmission:rt,transmissionMap:z,thicknessMap:mt,gradientMap:xt,opaque:M.transparent===!1&&M.blending===zi&&M.alphaToCoverage===!1,alphaMap:wt,alphaTest:dt,alphaHash:st,combine:M.combine,mapUv:ee&&_(M.map.channel),aoMapUv:lt&&_(M.aoMap.channel),lightMapUv:ot&&_(M.lightMap.channel),bumpMapUv:it&&_(M.bumpMap.channel),normalMapUv:q&&_(M.normalMap.channel),displacementMapUv:Mt&&_(M.displacementMap.channel),emissiveMapUv:ft&&_(M.emissiveMap.channel),metalnessMapUv:yt&&_(M.metalnessMap.channel),roughnessMapUv:Bt&&_(M.roughnessMap.channel),anisotropyMapUv:J&&_(M.anisotropyMap.channel),clearcoatMapUv:It&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:gt&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ut&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Nt&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:At&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&_(M.sheenRoughnessMap.channel),specularMapUv:Ot&&_(M.specularMap.channel),specularColorMapUv:Et&&_(M.specularColorMap.channel),specularIntensityMapUv:Zt&&_(M.specularIntensityMap.channel),transmissionMapUv:z&&_(M.transmissionMap.channel),thicknessMapUv:mt&&_(M.thicknessMap.channel),alphaMapUv:wt&&_(M.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(q||Yt),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:k.isPoints===!0&&!!j.attributes.uv&&(ee||wt),fog:!!Y,useFog:M.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Rt,skinning:k.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:bt,morphTextureStride:Wt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Jt,decodeVideoTexture:ee&&M.map.isVideoTexture===!0&&de.getTransfer(M.map.colorSpace)===_e,decodeVideoTextureEmissive:ft&&M.emissiveMap.isVideoTexture===!0&&de.getTransfer(M.emissiveMap.colorSpace)===_e,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===mn,flipSided:M.side===Xe,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Lt&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Lt&&M.extensions.multiDraw===!0||Dt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ge.vertexUv1s=l.has(1),ge.vertexUv2s=l.has(2),ge.vertexUv3s=l.has(3),l.clear(),ge}function p(M){const v=[];if(M.shaderID?v.push(M.shaderID):(v.push(M.customVertexShaderID),v.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)v.push(D),v.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(T(v,M),b(v,M),v.push(i.outputColorSpace)),v.push(M.customProgramCacheKey),v.join()}function T(M,v){M.push(v.precision),M.push(v.outputColorSpace),M.push(v.envMapMode),M.push(v.envMapCubeUVHeight),M.push(v.mapUv),M.push(v.alphaMapUv),M.push(v.lightMapUv),M.push(v.aoMapUv),M.push(v.bumpMapUv),M.push(v.normalMapUv),M.push(v.displacementMapUv),M.push(v.emissiveMapUv),M.push(v.metalnessMapUv),M.push(v.roughnessMapUv),M.push(v.anisotropyMapUv),M.push(v.clearcoatMapUv),M.push(v.clearcoatNormalMapUv),M.push(v.clearcoatRoughnessMapUv),M.push(v.iridescenceMapUv),M.push(v.iridescenceThicknessMapUv),M.push(v.sheenColorMapUv),M.push(v.sheenRoughnessMapUv),M.push(v.specularMapUv),M.push(v.specularColorMapUv),M.push(v.specularIntensityMapUv),M.push(v.transmissionMapUv),M.push(v.thicknessMapUv),M.push(v.combine),M.push(v.fogExp2),M.push(v.sizeAttenuation),M.push(v.morphTargetsCount),M.push(v.morphAttributeCount),M.push(v.numDirLights),M.push(v.numPointLights),M.push(v.numSpotLights),M.push(v.numSpotLightMaps),M.push(v.numHemiLights),M.push(v.numRectAreaLights),M.push(v.numDirLightShadows),M.push(v.numPointLightShadows),M.push(v.numSpotLightShadows),M.push(v.numSpotLightShadowsWithMaps),M.push(v.numLightProbes),M.push(v.shadowMapType),M.push(v.toneMapping),M.push(v.numClippingPlanes),M.push(v.numClipIntersection),M.push(v.depthPacking)}function b(M,v){a.disableAll(),v.supportsVertexTextures&&a.enable(0),v.instancing&&a.enable(1),v.instancingColor&&a.enable(2),v.instancingMorph&&a.enable(3),v.matcap&&a.enable(4),v.envMap&&a.enable(5),v.normalMapObjectSpace&&a.enable(6),v.normalMapTangentSpace&&a.enable(7),v.clearcoat&&a.enable(8),v.iridescence&&a.enable(9),v.alphaTest&&a.enable(10),v.vertexColors&&a.enable(11),v.vertexAlphas&&a.enable(12),v.vertexUv1s&&a.enable(13),v.vertexUv2s&&a.enable(14),v.vertexUv3s&&a.enable(15),v.vertexTangents&&a.enable(16),v.anisotropy&&a.enable(17),v.alphaHash&&a.enable(18),v.batching&&a.enable(19),v.dispersion&&a.enable(20),v.batchingColor&&a.enable(21),v.gradientMap&&a.enable(22),M.push(a.mask),a.disableAll(),v.fog&&a.enable(0),v.useFog&&a.enable(1),v.flatShading&&a.enable(2),v.logarithmicDepthBuffer&&a.enable(3),v.reversedDepthBuffer&&a.enable(4),v.skinning&&a.enable(5),v.morphTargets&&a.enable(6),v.morphNormals&&a.enable(7),v.morphColors&&a.enable(8),v.premultipliedAlpha&&a.enable(9),v.shadowMapEnabled&&a.enable(10),v.doubleSided&&a.enable(11),v.flipSided&&a.enable(12),v.useDepthPacking&&a.enable(13),v.dithering&&a.enable(14),v.transmission&&a.enable(15),v.sheen&&a.enable(16),v.opaque&&a.enable(17),v.pointsUvs&&a.enable(18),v.decodeVideoTexture&&a.enable(19),v.decodeVideoTextureEmissive&&a.enable(20),v.alphaToCoverage&&a.enable(21),M.push(a.mask)}function x(M){const v=g[M.type];let D;if(v){const F=Mn[v];D=ad.clone(F.uniforms)}else D=M.uniforms;return D}function L(M,v){let D;for(let F=0,k=h.length;F<k;F++){const Y=h[F];if(Y.cacheKey===v){D=Y,++D.usedTimes;break}}return D===void 0&&(D=new pg(i,v,M,o),h.push(D)),D}function w(M){if(--M.usedTimes===0){const v=h.indexOf(M);h[v]=h[h.length-1],h.pop(),M.destroy()}}function C(M){c.remove(M)}function R(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:x,acquireProgram:L,releaseProgram:w,releaseShaderCache:C,programs:h,dispose:R}}function xg(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function n(r){i.delete(r)}function s(r,a,c){i.get(r)[a]=c}function o(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:o}}function Mg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function el(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function nl(){const i=[];let t=0;const e=[],n=[],s=[];function o(){t=0,e.length=0,n.length=0,s.length=0}function r(u,d,f,g,_,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:_,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=_,p.group=m),t++,p}function a(u,d,f,g,_,m){const p=r(u,d,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,_,m){const p=r(u,d,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||Mg),n.length>1&&n.sort(d||el),s.length>1&&s.sort(d||el)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:o,push:a,unshift:c,finish:h,sort:l}}function yg(){let i=new WeakMap;function t(n,s){const o=i.get(n);let r;return o===void 0?(r=new nl,i.set(n,[r])):s>=o.length?(r=new nl,o.push(r)):r=o[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function Sg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new U,color:new re};break;case"SpotLight":e={position:new U,direction:new U,color:new re,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new U,color:new re,distance:0,decay:0};break;case"HemisphereLight":e={direction:new U,skyColor:new re,groundColor:new re};break;case"RectAreaLight":e={color:new re,position:new U,halfWidth:new U,halfHeight:new U};break}return i[t.id]=e,e}}}function bg(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let wg=0;function Eg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Tg(i){const t=new Sg,e=bg(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new U);const s=new U,o=new Ee,r=new Ee;function a(l){let h=0,u=0,d=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,T=0,b=0,x=0,L=0,w=0,C=0;l.sort(Eg);for(let M=0,v=l.length;M<v;M++){const D=l[M],F=D.color,k=D.intensity,Y=D.distance,j=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)h+=F.r*k,u+=F.g*k,d+=F.b*k;else if(D.isLightProbe){for(let tt=0;tt<9;tt++)n.probe[tt].addScaledVector(D.sh.coefficients[tt],k);C++}else if(D.isDirectionalLight){const tt=t.get(D);if(tt.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const et=D.shadow,K=e.get(D);K.shadowIntensity=et.intensity,K.shadowBias=et.bias,K.shadowNormalBias=et.normalBias,K.shadowRadius=et.radius,K.shadowMapSize=et.mapSize,n.directionalShadow[f]=K,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=D.shadow.matrix,T++}n.directional[f]=tt,f++}else if(D.isSpotLight){const tt=t.get(D);tt.position.setFromMatrixPosition(D.matrixWorld),tt.color.copy(F).multiplyScalar(k),tt.distance=Y,tt.coneCos=Math.cos(D.angle),tt.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),tt.decay=D.decay,n.spot[_]=tt;const et=D.shadow;if(D.map&&(n.spotLightMap[L]=D.map,L++,et.updateMatrices(D),D.castShadow&&w++),n.spotLightMatrix[_]=et.matrix,D.castShadow){const K=e.get(D);K.shadowIntensity=et.intensity,K.shadowBias=et.bias,K.shadowNormalBias=et.normalBias,K.shadowRadius=et.radius,K.shadowMapSize=et.mapSize,n.spotShadow[_]=K,n.spotShadowMap[_]=j,x++}_++}else if(D.isRectAreaLight){const tt=t.get(D);tt.color.copy(F).multiplyScalar(k),tt.halfWidth.set(D.width*.5,0,0),tt.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=tt,m++}else if(D.isPointLight){const tt=t.get(D);if(tt.color.copy(D.color).multiplyScalar(D.intensity),tt.distance=D.distance,tt.decay=D.decay,D.castShadow){const et=D.shadow,K=e.get(D);K.shadowIntensity=et.intensity,K.shadowBias=et.bias,K.shadowNormalBias=et.normalBias,K.shadowRadius=et.radius,K.shadowMapSize=et.mapSize,K.shadowCameraNear=et.camera.near,K.shadowCameraFar=et.camera.far,n.pointShadow[g]=K,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=D.shadow.matrix,b++}n.point[g]=tt,g++}else if(D.isHemisphereLight){const tt=t.get(D);tt.skyColor.copy(D.color).multiplyScalar(k),tt.groundColor.copy(D.groundColor).multiplyScalar(k),n.hemi[p]=tt,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const R=n.hash;(R.directionalLength!==f||R.pointLength!==g||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==p||R.numDirectionalShadows!==T||R.numPointShadows!==b||R.numSpotShadows!==x||R.numSpotMaps!==L||R.numLightProbes!==C)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=T,n.directionalShadowMap.length=T,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=x,n.spotShadowMap.length=x,n.directionalShadowMatrix.length=T,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=x+L-w,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=C,R.directionalLength=f,R.pointLength=g,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=p,R.numDirectionalShadows=T,R.numPointShadows=b,R.numSpotShadows=x,R.numSpotMaps=L,R.numLightProbes=C,n.version=wg++)}function c(l,h){let u=0,d=0,f=0,g=0,_=0;const m=h.matrixWorldInverse;for(let p=0,T=l.length;p<T;p++){const b=l[p];if(b.isDirectionalLight){const x=n.directional[u];x.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),u++}else if(b.isSpotLight){const x=n.spot[f];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),x.direction.sub(s),x.direction.transformDirection(m),f++}else if(b.isRectAreaLight){const x=n.rectArea[g];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),r.identity(),o.copy(b.matrixWorld),o.premultiply(m),r.extractRotation(o),x.halfWidth.set(b.width*.5,0,0),x.halfHeight.set(0,b.height*.5,0),x.halfWidth.applyMatrix4(r),x.halfHeight.applyMatrix4(r),g++}else if(b.isPointLight){const x=n.point[d];x.position.setFromMatrixPosition(b.matrixWorld),x.position.applyMatrix4(m),d++}else if(b.isHemisphereLight){const x=n.hemi[_];x.direction.setFromMatrixPosition(b.matrixWorld),x.direction.transformDirection(m),_++}}}return{setup:a,setupView:c,state:n}}function il(i){const t=new Tg(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function o(h){e.push(h)}function r(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:o,pushShadow:r}}function Ag(i){let t=new WeakMap;function e(s,o=0){const r=t.get(s);let a;return r===void 0?(a=new il(i),t.set(s,[a])):o>=r.length?(a=new il(i),r.push(a)):a=r[o],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const Cg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Rg=`uniform sampler2D shadow_pass;
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
}`;function Pg(i,t,e){let n=new Va;const s=new St,o=new St,r=new Re,a=new Qd({depthPacking:gu}),c=new tf,l={},h=e.maxTextureSize,u={[Bn]:Xe,[Xe]:Bn,[mn]:mn},d=new Kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new St},radius:{value:4}},vertexShader:Cg,fragmentShader:Rg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ne;g.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new S(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Il;let p=this.type;this.render=function(w,C,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const M=i.getRenderTarget(),v=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),F=i.state;F.setBlending(Jn),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const k=p!==Ln&&this.type===Ln,Y=p===Ln&&this.type!==Ln;for(let j=0,tt=w.length;j<tt;j++){const et=w[j],K=et.shadow;if(K===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(K.autoUpdate===!1&&K.needsUpdate===!1)continue;s.copy(K.mapSize);const _t=K.getFrameExtents();if(s.multiply(_t),o.copy(K.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(o.x=Math.floor(h/_t.x),s.x=o.x*_t.x,K.mapSize.x=o.x),s.y>h&&(o.y=Math.floor(h/_t.y),s.y=o.y*_t.y,K.mapSize.y=o.y)),K.map===null||k===!0||Y===!0){const bt=this.type!==Ln?{minFilter:Ge,magFilter:Ge}:{};K.map!==null&&K.map.dispose(),K.map=new mi(s.x,s.y,bt),K.map.texture.name=et.name+".shadowMap",K.camera.updateProjectionMatrix()}i.setRenderTarget(K.map),i.clear();const Q=K.getViewportCount();for(let bt=0;bt<Q;bt++){const Wt=K.getViewport(bt);r.set(o.x*Wt.x,o.y*Wt.y,o.x*Wt.z,o.y*Wt.w),F.viewport(r),K.updateMatrices(et,bt),n=K.getFrustum(),x(C,R,K.camera,et,this.type)}K.isPointLightShadow!==!0&&this.type===Ln&&T(K,R),K.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(M,v,D)};function T(w,C){const R=t.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new mi(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(C,null,R,d,_,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(C,null,R,f,_,null)}function b(w,C,R,M){let v=null;const D=R.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(D!==void 0)v=D;else if(v=R.isPointLight===!0?c:a,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const F=v.uuid,k=C.uuid;let Y=l[F];Y===void 0&&(Y={},l[F]=Y);let j=Y[k];j===void 0&&(j=v.clone(),Y[k]=j,C.addEventListener("dispose",L)),v=j}if(v.visible=C.visible,v.wireframe=C.wireframe,M===Ln?v.side=C.shadowSide!==null?C.shadowSide:C.side:v.side=C.shadowSide!==null?C.shadowSide:u[C.side],v.alphaMap=C.alphaMap,v.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,v.map=C.map,v.clipShadows=C.clipShadows,v.clippingPlanes=C.clippingPlanes,v.clipIntersection=C.clipIntersection,v.displacementMap=C.displacementMap,v.displacementScale=C.displacementScale,v.displacementBias=C.displacementBias,v.wireframeLinewidth=C.wireframeLinewidth,v.linewidth=C.linewidth,R.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const F=i.properties.get(v);F.light=R}return v}function x(w,C,R,M,v){if(w.visible===!1)return;if(w.layers.test(C.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===Ln)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,w.matrixWorld);const k=t.update(w),Y=w.material;if(Array.isArray(Y)){const j=k.groups;for(let tt=0,et=j.length;tt<et;tt++){const K=j[tt],_t=Y[K.materialIndex];if(_t&&_t.visible){const Q=b(w,_t,M,v);w.onBeforeShadow(i,w,C,R,k,Q,K),i.renderBufferDirect(R,null,k,Q,w,K),w.onAfterShadow(i,w,C,R,k,Q,K)}}}else if(Y.visible){const j=b(w,Y,M,v);w.onBeforeShadow(i,w,C,R,k,j,null),i.renderBufferDirect(R,null,k,j,w,null),w.onAfterShadow(i,w,C,R,k,j,null)}}const F=w.children;for(let k=0,Y=F.length;k<Y;k++)x(F[k],C,R,M,v)}function L(w){w.target.removeEventListener("dispose",L);for(const R in l){const M=l[R],v=w.target.uuid;v in M&&(M[v].dispose(),delete M[v])}}}const Ig={[Sr]:br,[wr]:Ar,[Er]:Cr,[ki]:Tr,[br]:Sr,[Ar]:wr,[Cr]:Er,[Tr]:ki};function Lg(i,t){function e(){let z=!1;const mt=new Re;let xt=null;const wt=new Re(0,0,0,0);return{setMask:function(dt){xt!==dt&&!z&&(i.colorMask(dt,dt,dt,dt),xt=dt)},setLocked:function(dt){z=dt},setClear:function(dt,st,Lt,Jt,ge){ge===!0&&(dt*=Jt,st*=Jt,Lt*=Jt),mt.set(dt,st,Lt,Jt),wt.equals(mt)===!1&&(i.clearColor(dt,st,Lt,Jt),wt.copy(mt))},reset:function(){z=!1,xt=null,wt.set(-1,0,0,0)}}}function n(){let z=!1,mt=!1,xt=null,wt=null,dt=null;return{setReversed:function(st){if(mt!==st){const Lt=t.get("EXT_clip_control");st?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),mt=st;const Jt=dt;dt=null,this.setClear(Jt)}},getReversed:function(){return mt},setTest:function(st){st?ct(i.DEPTH_TEST):Rt(i.DEPTH_TEST)},setMask:function(st){xt!==st&&!z&&(i.depthMask(st),xt=st)},setFunc:function(st){if(mt&&(st=Ig[st]),wt!==st){switch(st){case Sr:i.depthFunc(i.NEVER);break;case br:i.depthFunc(i.ALWAYS);break;case wr:i.depthFunc(i.LESS);break;case ki:i.depthFunc(i.LEQUAL);break;case Er:i.depthFunc(i.EQUAL);break;case Tr:i.depthFunc(i.GEQUAL);break;case Ar:i.depthFunc(i.GREATER);break;case Cr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}wt=st}},setLocked:function(st){z=st},setClear:function(st){dt!==st&&(mt&&(st=1-st),i.clearDepth(st),dt=st)},reset:function(){z=!1,xt=null,wt=null,dt=null,mt=!1}}}function s(){let z=!1,mt=null,xt=null,wt=null,dt=null,st=null,Lt=null,Jt=null,ge=null;return{setTest:function(ie){z||(ie?ct(i.STENCIL_TEST):Rt(i.STENCIL_TEST))},setMask:function(ie){mt!==ie&&!z&&(i.stencilMask(ie),mt=ie)},setFunc:function(ie,Ye,We){(xt!==ie||wt!==Ye||dt!==We)&&(i.stencilFunc(ie,Ye,We),xt=ie,wt=Ye,dt=We)},setOp:function(ie,Ye,We){(st!==ie||Lt!==Ye||Jt!==We)&&(i.stencilOp(ie,Ye,We),st=ie,Lt=Ye,Jt=We)},setLocked:function(ie){z=ie},setClear:function(ie){ge!==ie&&(i.clearStencil(ie),ge=ie)},reset:function(){z=!1,mt=null,xt=null,wt=null,dt=null,st=null,Lt=null,Jt=null,ge=null}}}const o=new e,r=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,T=null,b=null,x=null,L=null,w=null,C=new re(0,0,0),R=0,M=!1,v=null,D=null,F=null,k=null,Y=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let tt=!1,et=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(K)[1]),tt=et>=1):K.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),tt=et>=2);let _t=null,Q={};const bt=i.getParameter(i.SCISSOR_BOX),Wt=i.getParameter(i.VIEWPORT),te=new Re().fromArray(bt),ce=new Re().fromArray(Wt);function se(z,mt,xt,wt){const dt=new Uint8Array(4),st=i.createTexture();i.bindTexture(z,st),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Lt=0;Lt<xt;Lt++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(mt,0,i.RGBA,1,1,wt,0,i.RGBA,i.UNSIGNED_BYTE,dt):i.texImage2D(mt+Lt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,dt);return st}const nt={};nt[i.TEXTURE_2D]=se(i.TEXTURE_2D,i.TEXTURE_2D,1),nt[i.TEXTURE_CUBE_MAP]=se(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),nt[i.TEXTURE_2D_ARRAY]=se(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),nt[i.TEXTURE_3D]=se(i.TEXTURE_3D,i.TEXTURE_3D,1,1),o.setClear(0,0,0,1),r.setClear(1),a.setClear(0),ct(i.DEPTH_TEST),r.setFunc(ki),it(!1),q(Ka),ct(i.CULL_FACE),lt(Jn);function ct(z){h[z]!==!0&&(i.enable(z),h[z]=!0)}function Rt(z){h[z]!==!1&&(i.disable(z),h[z]=!1)}function zt(z,mt){return u[z]!==mt?(i.bindFramebuffer(z,mt),u[z]=mt,z===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=mt),z===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=mt),!0):!1}function Dt(z,mt){let xt=f,wt=!1;if(z){xt=d.get(mt),xt===void 0&&(xt=[],d.set(mt,xt));const dt=z.textures;if(xt.length!==dt.length||xt[0]!==i.COLOR_ATTACHMENT0){for(let st=0,Lt=dt.length;st<Lt;st++)xt[st]=i.COLOR_ATTACHMENT0+st;xt.length=dt.length,wt=!0}}else xt[0]!==i.BACK&&(xt[0]=i.BACK,wt=!0);wt&&i.drawBuffers(xt)}function ee(z){return g!==z?(i.useProgram(z),g=z,!0):!1}const me={[li]:i.FUNC_ADD,[Hh]:i.FUNC_SUBTRACT,[Gh]:i.FUNC_REVERSE_SUBTRACT};me[Wh]=i.MIN,me[qh]=i.MAX;const N={[Xh]:i.ZERO,[Yh]:i.ONE,[jh]:i.SRC_COLOR,[Mr]:i.SRC_ALPHA,[tu]:i.SRC_ALPHA_SATURATE,[$h]:i.DST_COLOR,[Zh]:i.DST_ALPHA,[Jh]:i.ONE_MINUS_SRC_COLOR,[yr]:i.ONE_MINUS_SRC_ALPHA,[Qh]:i.ONE_MINUS_DST_COLOR,[Kh]:i.ONE_MINUS_DST_ALPHA,[eu]:i.CONSTANT_COLOR,[nu]:i.ONE_MINUS_CONSTANT_COLOR,[iu]:i.CONSTANT_ALPHA,[su]:i.ONE_MINUS_CONSTANT_ALPHA};function lt(z,mt,xt,wt,dt,st,Lt,Jt,ge,ie){if(z===Jn){_===!0&&(Rt(i.BLEND),_=!1);return}if(_===!1&&(ct(i.BLEND),_=!0),z!==Vh){if(z!==m||ie!==M){if((p!==li||x!==li)&&(i.blendEquation(i.FUNC_ADD),p=li,x=li),ie)switch(z){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $a:i.blendFunc(i.ONE,i.ONE);break;case Qa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case tc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case $a:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Qa:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case tc:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}T=null,b=null,L=null,w=null,C.set(0,0,0),R=0,m=z,M=ie}return}dt=dt||mt,st=st||xt,Lt=Lt||wt,(mt!==p||dt!==x)&&(i.blendEquationSeparate(me[mt],me[dt]),p=mt,x=dt),(xt!==T||wt!==b||st!==L||Lt!==w)&&(i.blendFuncSeparate(N[xt],N[wt],N[st],N[Lt]),T=xt,b=wt,L=st,w=Lt),(Jt.equals(C)===!1||ge!==R)&&(i.blendColor(Jt.r,Jt.g,Jt.b,ge),C.copy(Jt),R=ge),m=z,M=!1}function ot(z,mt){z.side===mn?Rt(i.CULL_FACE):ct(i.CULL_FACE);let xt=z.side===Xe;mt&&(xt=!xt),it(xt),z.blending===zi&&z.transparent===!1?lt(Jn):lt(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),r.setFunc(z.depthFunc),r.setTest(z.depthTest),r.setMask(z.depthWrite),o.setMask(z.colorWrite);const wt=z.stencilWrite;a.setTest(wt),wt&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),ft(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?ct(i.SAMPLE_ALPHA_TO_COVERAGE):Rt(i.SAMPLE_ALPHA_TO_COVERAGE)}function it(z){v!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),v=z)}function q(z){z!==Bh?(ct(i.CULL_FACE),z!==D&&(z===Ka?i.cullFace(i.BACK):z===kh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Rt(i.CULL_FACE),D=z}function Mt(z){z!==F&&(tt&&i.lineWidth(z),F=z)}function ft(z,mt,xt){z?(ct(i.POLYGON_OFFSET_FILL),(k!==mt||Y!==xt)&&(i.polygonOffset(mt,xt),k=mt,Y=xt)):Rt(i.POLYGON_OFFSET_FILL)}function yt(z){z?ct(i.SCISSOR_TEST):Rt(i.SCISSOR_TEST)}function Bt(z){z===void 0&&(z=i.TEXTURE0+j-1),_t!==z&&(i.activeTexture(z),_t=z)}function Yt(z,mt,xt){xt===void 0&&(_t===null?xt=i.TEXTURE0+j-1:xt=_t);let wt=Q[xt];wt===void 0&&(wt={type:void 0,texture:void 0},Q[xt]=wt),(wt.type!==z||wt.texture!==mt)&&(_t!==xt&&(i.activeTexture(xt),_t=xt),i.bindTexture(z,mt||nt[z]),wt.type=z,wt.texture=mt)}function P(){const z=Q[_t];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function V(){try{i.compressedTexImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function $(){try{i.texSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function rt(){try{i.texSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function J(){try{i.compressedTexSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function It(){try{i.compressedTexSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function gt(){try{i.texStorage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ut(){try{i.texStorage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Nt(){try{i.texImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function pt(){try{i.texImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function At(z){te.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),te.copy(z))}function Vt(z){ce.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),ce.copy(z))}function Ot(z,mt){let xt=l.get(mt);xt===void 0&&(xt=new WeakMap,l.set(mt,xt));let wt=xt.get(z);wt===void 0&&(wt=i.getUniformBlockIndex(mt,z.name),xt.set(z,wt))}function Et(z,mt){const wt=l.get(mt).get(z);c.get(mt)!==wt&&(i.uniformBlockBinding(mt,wt,z.__bindingPointIndex),c.set(mt,wt))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},_t=null,Q={},u={},d=new WeakMap,f=[],g=null,_=!1,m=null,p=null,T=null,b=null,x=null,L=null,w=null,C=new re(0,0,0),R=0,M=!1,v=null,D=null,F=null,k=null,Y=null,te.set(0,0,i.canvas.width,i.canvas.height),ce.set(0,0,i.canvas.width,i.canvas.height),o.reset(),r.reset(),a.reset()}return{buffers:{color:o,depth:r,stencil:a},enable:ct,disable:Rt,bindFramebuffer:zt,drawBuffers:Dt,useProgram:ee,setBlending:lt,setMaterial:ot,setFlipSided:it,setCullFace:q,setLineWidth:Mt,setPolygonOffset:ft,setScissorTest:yt,activeTexture:Bt,bindTexture:Yt,unbindTexture:P,compressedTexImage2D:y,compressedTexImage3D:V,texImage2D:Nt,texImage3D:pt,updateUBOMapping:Ot,uniformBlockBinding:Et,texStorage2D:gt,texStorage3D:Ut,texSubImage2D:$,texSubImage3D:rt,compressedTexSubImage2D:J,compressedTexSubImage3D:It,scissor:At,viewport:Vt,reset:Zt}}function Dg(i,t,e,n,s,o,r){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new St,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(P,y){return f?new OffscreenCanvas(P,y):xo("canvas")}function _(P,y,V){let $=1;const rt=Yt(P);if((rt.width>V||rt.height>V)&&($=V/Math.max(rt.width,rt.height)),$<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const J=Math.floor($*rt.width),It=Math.floor($*rt.height);u===void 0&&(u=g(J,It));const gt=y?g(J,It):u;return gt.width=J,gt.height=It,gt.getContext("2d").drawImage(P,0,0,J,It),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+rt.width+"x"+rt.height+") to ("+J+"x"+It+")."),gt}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+rt.width+"x"+rt.height+")."),P;return P}function m(P){return P.generateMipmaps}function p(P){i.generateMipmap(P)}function T(P){return P.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?i.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(P,y,V,$,rt=!1){if(P!==null){if(i[P]!==void 0)return i[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let J=y;if(y===i.RED&&(V===i.FLOAT&&(J=i.R32F),V===i.HALF_FLOAT&&(J=i.R16F),V===i.UNSIGNED_BYTE&&(J=i.R8)),y===i.RED_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.R8UI),V===i.UNSIGNED_SHORT&&(J=i.R16UI),V===i.UNSIGNED_INT&&(J=i.R32UI),V===i.BYTE&&(J=i.R8I),V===i.SHORT&&(J=i.R16I),V===i.INT&&(J=i.R32I)),y===i.RG&&(V===i.FLOAT&&(J=i.RG32F),V===i.HALF_FLOAT&&(J=i.RG16F),V===i.UNSIGNED_BYTE&&(J=i.RG8)),y===i.RG_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RG8UI),V===i.UNSIGNED_SHORT&&(J=i.RG16UI),V===i.UNSIGNED_INT&&(J=i.RG32UI),V===i.BYTE&&(J=i.RG8I),V===i.SHORT&&(J=i.RG16I),V===i.INT&&(J=i.RG32I)),y===i.RGB_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGB8UI),V===i.UNSIGNED_SHORT&&(J=i.RGB16UI),V===i.UNSIGNED_INT&&(J=i.RGB32UI),V===i.BYTE&&(J=i.RGB8I),V===i.SHORT&&(J=i.RGB16I),V===i.INT&&(J=i.RGB32I)),y===i.RGBA_INTEGER&&(V===i.UNSIGNED_BYTE&&(J=i.RGBA8UI),V===i.UNSIGNED_SHORT&&(J=i.RGBA16UI),V===i.UNSIGNED_INT&&(J=i.RGBA32UI),V===i.BYTE&&(J=i.RGBA8I),V===i.SHORT&&(J=i.RGBA16I),V===i.INT&&(J=i.RGBA32I)),y===i.RGB&&(V===i.UNSIGNED_INT_5_9_9_9_REV&&(J=i.RGB9_E5),V===i.UNSIGNED_INT_10F_11F_11F_REV&&(J=i.R11F_G11F_B10F)),y===i.RGBA){const It=rt?vo:de.getTransfer($);V===i.FLOAT&&(J=i.RGBA32F),V===i.HALF_FLOAT&&(J=i.RGBA16F),V===i.UNSIGNED_BYTE&&(J=It===_e?i.SRGB8_ALPHA8:i.RGBA8),V===i.UNSIGNED_SHORT_4_4_4_4&&(J=i.RGBA4),V===i.UNSIGNED_SHORT_5_5_5_1&&(J=i.RGB5_A1)}return(J===i.R16F||J===i.R32F||J===i.RG16F||J===i.RG32F||J===i.RGBA16F||J===i.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function x(P,y){let V;return P?y===null||y===pi||y===gs?V=i.DEPTH24_STENCIL8:y===Nn?V=i.DEPTH32F_STENCIL8:y===ms&&(V=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===pi||y===gs?V=i.DEPTH_COMPONENT24:y===Nn?V=i.DEPTH_COMPONENT32F:y===ms&&(V=i.DEPTH_COMPONENT16),V}function L(P,y){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Ge&&P.minFilter!==yn?Math.log2(Math.max(y.width,y.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?y.mipmaps.length:1}function w(P){const y=P.target;y.removeEventListener("dispose",w),R(y),y.isVideoTexture&&h.delete(y)}function C(P){const y=P.target;y.removeEventListener("dispose",C),v(y)}function R(P){const y=n.get(P);if(y.__webglInit===void 0)return;const V=P.source,$=d.get(V);if($){const rt=$[y.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&M(P),Object.keys($).length===0&&d.delete(V)}n.remove(P)}function M(P){const y=n.get(P);i.deleteTexture(y.__webglTexture);const V=P.source,$=d.get(V);delete $[y.__cacheKey],r.memory.textures--}function v(P){const y=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(y.__webglFramebuffer[$]))for(let rt=0;rt<y.__webglFramebuffer[$].length;rt++)i.deleteFramebuffer(y.__webglFramebuffer[$][rt]);else i.deleteFramebuffer(y.__webglFramebuffer[$]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[$])}else{if(Array.isArray(y.__webglFramebuffer))for(let $=0;$<y.__webglFramebuffer.length;$++)i.deleteFramebuffer(y.__webglFramebuffer[$]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let $=0;$<y.__webglColorRenderbuffer.length;$++)y.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[$]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const V=P.textures;for(let $=0,rt=V.length;$<rt;$++){const J=n.get(V[$]);J.__webglTexture&&(i.deleteTexture(J.__webglTexture),r.memory.textures--),n.remove(V[$])}n.remove(P)}let D=0;function F(){D=0}function k(){const P=D;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),D+=1,P}function Y(P){const y=[];return y.push(P.wrapS),y.push(P.wrapT),y.push(P.wrapR||0),y.push(P.magFilter),y.push(P.minFilter),y.push(P.anisotropy),y.push(P.internalFormat),y.push(P.format),y.push(P.type),y.push(P.generateMipmaps),y.push(P.premultiplyAlpha),y.push(P.flipY),y.push(P.unpackAlignment),y.push(P.colorSpace),y.join()}function j(P,y){const V=n.get(P);if(P.isVideoTexture&&yt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&V.__version!==P.version){const $=P.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{nt(V,P,y);return}}else P.isExternalTexture&&(V.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,V.__webglTexture,i.TEXTURE0+y)}function tt(P,y){const V=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){nt(V,P,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,V.__webglTexture,i.TEXTURE0+y)}function et(P,y){const V=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){nt(V,P,y);return}e.bindTexture(i.TEXTURE_3D,V.__webglTexture,i.TEXTURE0+y)}function K(P,y){const V=n.get(P);if(P.version>0&&V.__version!==P.version){ct(V,P,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture,i.TEXTURE0+y)}const _t={[Ir]:i.REPEAT,[ui]:i.CLAMP_TO_EDGE,[Lr]:i.MIRRORED_REPEAT},Q={[Ge]:i.NEAREST,[pu]:i.NEAREST_MIPMAP_NEAREST,[Ps]:i.NEAREST_MIPMAP_LINEAR,[yn]:i.LINEAR,[Lo]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},bt={[_u]:i.NEVER,[wu]:i.ALWAYS,[xu]:i.LESS,[Gl]:i.LEQUAL,[Mu]:i.EQUAL,[bu]:i.GEQUAL,[yu]:i.GREATER,[Su]:i.NOTEQUAL};function Wt(P,y){if(y.type===Nn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===yn||y.magFilter===Lo||y.magFilter===Ps||y.magFilter===di||y.minFilter===yn||y.minFilter===Lo||y.minFilter===Ps||y.minFilter===di)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(P,i.TEXTURE_WRAP_S,_t[y.wrapS]),i.texParameteri(P,i.TEXTURE_WRAP_T,_t[y.wrapT]),(P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY)&&i.texParameteri(P,i.TEXTURE_WRAP_R,_t[y.wrapR]),i.texParameteri(P,i.TEXTURE_MAG_FILTER,Q[y.magFilter]),i.texParameteri(P,i.TEXTURE_MIN_FILTER,Q[y.minFilter]),y.compareFunction&&(i.texParameteri(P,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(P,i.TEXTURE_COMPARE_FUNC,bt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Ge||y.minFilter!==Ps&&y.minFilter!==di||y.type===Nn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const V=t.get("EXT_texture_filter_anisotropic");i.texParameterf(P,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function te(P,y){let V=!1;P.__webglInit===void 0&&(P.__webglInit=!0,y.addEventListener("dispose",w));const $=y.source;let rt=d.get($);rt===void 0&&(rt={},d.set($,rt));const J=Y(y);if(J!==P.__cacheKey){rt[J]===void 0&&(rt[J]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,V=!0),rt[J].usedTimes++;const It=rt[P.__cacheKey];It!==void 0&&(rt[P.__cacheKey].usedTimes--,It.usedTimes===0&&M(y)),P.__cacheKey=J,P.__webglTexture=rt[J].texture}return V}function ce(P,y,V){return Math.floor(Math.floor(P/V)/y)}function se(P,y,V,$){const J=P.updateRanges;if(J.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,V,$,y.data);else{J.sort((pt,At)=>pt.start-At.start);let It=0;for(let pt=1;pt<J.length;pt++){const At=J[It],Vt=J[pt],Ot=At.start+At.count,Et=ce(Vt.start,y.width,4),Zt=ce(At.start,y.width,4);Vt.start<=Ot+1&&Et===Zt&&ce(Vt.start+Vt.count-1,y.width,4)===Et?At.count=Math.max(At.count,Vt.start+Vt.count-At.start):(++It,J[It]=Vt)}J.length=It+1;const gt=i.getParameter(i.UNPACK_ROW_LENGTH),Ut=i.getParameter(i.UNPACK_SKIP_PIXELS),Nt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let pt=0,At=J.length;pt<At;pt++){const Vt=J[pt],Ot=Math.floor(Vt.start/4),Et=Math.ceil(Vt.count/4),Zt=Ot%y.width,z=Math.floor(Ot/y.width),mt=Et,xt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Zt),i.pixelStorei(i.UNPACK_SKIP_ROWS,z),e.texSubImage2D(i.TEXTURE_2D,0,Zt,z,mt,xt,V,$,y.data)}P.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,gt),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ut),i.pixelStorei(i.UNPACK_SKIP_ROWS,Nt)}}function nt(P,y,V){let $=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&($=i.TEXTURE_3D);const rt=te(P,y),J=y.source;e.bindTexture($,P.__webglTexture,i.TEXTURE0+V);const It=n.get(J);if(J.version!==It.__version||rt===!0){e.activeTexture(i.TEXTURE0+V);const gt=de.getPrimaries(de.workingColorSpace),Ut=y.colorSpace===jn?null:de.getPrimaries(y.colorSpace),Nt=y.colorSpace===jn||gt===Ut?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Nt);let pt=_(y.image,!1,s.maxTextureSize);pt=Bt(y,pt);const At=o.convert(y.format,y.colorSpace),Vt=o.convert(y.type);let Ot=b(y.internalFormat,At,Vt,y.colorSpace,y.isVideoTexture);Wt($,y);let Et;const Zt=y.mipmaps,z=y.isVideoTexture!==!0,mt=It.__version===void 0||rt===!0,xt=J.dataReady,wt=L(y,pt);if(y.isDepthTexture)Ot=x(y.format===_s,y.type),mt&&(z?e.texStorage2D(i.TEXTURE_2D,1,Ot,pt.width,pt.height):e.texImage2D(i.TEXTURE_2D,0,Ot,pt.width,pt.height,0,At,Vt,null));else if(y.isDataTexture)if(Zt.length>0){z&&mt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,Zt[0].width,Zt[0].height);for(let dt=0,st=Zt.length;dt<st;dt++)Et=Zt[dt],z?xt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,Et.width,Et.height,At,Vt,Et.data):e.texImage2D(i.TEXTURE_2D,dt,Ot,Et.width,Et.height,0,At,Vt,Et.data);y.generateMipmaps=!1}else z?(mt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,pt.width,pt.height),xt&&se(y,pt,At,Vt)):e.texImage2D(i.TEXTURE_2D,0,Ot,pt.width,pt.height,0,At,Vt,pt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){z&&mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Ot,Zt[0].width,Zt[0].height,pt.depth);for(let dt=0,st=Zt.length;dt<st;dt++)if(Et=Zt[dt],y.format!==_n)if(At!==null)if(z){if(xt)if(y.layerUpdates.size>0){const Lt=Dc(Et.width,Et.height,y.format,y.type);for(const Jt of y.layerUpdates){const ge=Et.data.subarray(Jt*Lt/Et.data.BYTES_PER_ELEMENT,(Jt+1)*Lt/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,Jt,Et.width,Et.height,1,At,ge)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,Et.width,Et.height,pt.depth,At,Et.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,dt,Ot,Et.width,Et.height,pt.depth,0,Et.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else z?xt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,Et.width,Et.height,pt.depth,At,Vt,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,dt,Ot,Et.width,Et.height,pt.depth,0,At,Vt,Et.data)}else{z&&mt&&e.texStorage2D(i.TEXTURE_2D,wt,Ot,Zt[0].width,Zt[0].height);for(let dt=0,st=Zt.length;dt<st;dt++)Et=Zt[dt],y.format!==_n?At!==null?z?xt&&e.compressedTexSubImage2D(i.TEXTURE_2D,dt,0,0,Et.width,Et.height,At,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,dt,Ot,Et.width,Et.height,0,Et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):z?xt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,Et.width,Et.height,At,Vt,Et.data):e.texImage2D(i.TEXTURE_2D,dt,Ot,Et.width,Et.height,0,At,Vt,Et.data)}else if(y.isDataArrayTexture)if(z){if(mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,wt,Ot,pt.width,pt.height,pt.depth),xt)if(y.layerUpdates.size>0){const dt=Dc(pt.width,pt.height,y.format,y.type);for(const st of y.layerUpdates){const Lt=pt.data.subarray(st*dt/pt.data.BYTES_PER_ELEMENT,(st+1)*dt/pt.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,st,pt.width,pt.height,1,At,Vt,Lt)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,At,Vt,pt.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ot,pt.width,pt.height,pt.depth,0,At,Vt,pt.data);else if(y.isData3DTexture)z?(mt&&e.texStorage3D(i.TEXTURE_3D,wt,Ot,pt.width,pt.height,pt.depth),xt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,At,Vt,pt.data)):e.texImage3D(i.TEXTURE_3D,0,Ot,pt.width,pt.height,pt.depth,0,At,Vt,pt.data);else if(y.isFramebufferTexture){if(mt)if(z)e.texStorage2D(i.TEXTURE_2D,wt,Ot,pt.width,pt.height);else{let dt=pt.width,st=pt.height;for(let Lt=0;Lt<wt;Lt++)e.texImage2D(i.TEXTURE_2D,Lt,Ot,dt,st,0,At,Vt,null),dt>>=1,st>>=1}}else if(Zt.length>0){if(z&&mt){const dt=Yt(Zt[0]);e.texStorage2D(i.TEXTURE_2D,wt,Ot,dt.width,dt.height)}for(let dt=0,st=Zt.length;dt<st;dt++)Et=Zt[dt],z?xt&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,At,Vt,Et):e.texImage2D(i.TEXTURE_2D,dt,Ot,At,Vt,Et);y.generateMipmaps=!1}else if(z){if(mt){const dt=Yt(pt);e.texStorage2D(i.TEXTURE_2D,wt,Ot,dt.width,dt.height)}xt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,At,Vt,pt)}else e.texImage2D(i.TEXTURE_2D,0,Ot,At,Vt,pt);m(y)&&p($),It.__version=J.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function ct(P,y,V){if(y.image.length!==6)return;const $=te(P,y),rt=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,P.__webglTexture,i.TEXTURE0+V);const J=n.get(rt);if(rt.version!==J.__version||$===!0){e.activeTexture(i.TEXTURE0+V);const It=de.getPrimaries(de.workingColorSpace),gt=y.colorSpace===jn?null:de.getPrimaries(y.colorSpace),Ut=y.colorSpace===jn||It===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ut);const Nt=y.isCompressedTexture||y.image[0].isCompressedTexture,pt=y.image[0]&&y.image[0].isDataTexture,At=[];for(let st=0;st<6;st++)!Nt&&!pt?At[st]=_(y.image[st],!0,s.maxCubemapSize):At[st]=pt?y.image[st].image:y.image[st],At[st]=Bt(y,At[st]);const Vt=At[0],Ot=o.convert(y.format,y.colorSpace),Et=o.convert(y.type),Zt=b(y.internalFormat,Ot,Et,y.colorSpace),z=y.isVideoTexture!==!0,mt=J.__version===void 0||$===!0,xt=rt.dataReady;let wt=L(y,Vt);Wt(i.TEXTURE_CUBE_MAP,y);let dt;if(Nt){z&&mt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Zt,Vt.width,Vt.height);for(let st=0;st<6;st++){dt=At[st].mipmaps;for(let Lt=0;Lt<dt.length;Lt++){const Jt=dt[Lt];y.format!==_n?Ot!==null?z?xt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt,0,0,Jt.width,Jt.height,Ot,Jt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt,Zt,Jt.width,Jt.height,0,Jt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt,0,0,Jt.width,Jt.height,Ot,Et,Jt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt,Zt,Jt.width,Jt.height,0,Ot,Et,Jt.data)}}}else{if(dt=y.mipmaps,z&&mt){dt.length>0&&wt++;const st=Yt(At[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,wt,Zt,st.width,st.height)}for(let st=0;st<6;st++)if(pt){z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,At[st].width,At[st].height,Ot,Et,At[st].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,At[st].width,At[st].height,0,Ot,Et,At[st].data);for(let Lt=0;Lt<dt.length;Lt++){const ge=dt[Lt].image[st].image;z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt+1,0,0,ge.width,ge.height,Ot,Et,ge.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt+1,Zt,ge.width,ge.height,0,Ot,Et,ge.data)}}else{z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Ot,Et,At[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,Ot,Et,At[st]);for(let Lt=0;Lt<dt.length;Lt++){const Jt=dt[Lt];z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt+1,0,0,Ot,Et,Jt.image[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,Lt+1,Zt,Ot,Et,Jt.image[st])}}}m(y)&&p(i.TEXTURE_CUBE_MAP),J.__version=rt.version,y.onUpdate&&y.onUpdate(y)}P.__version=y.version}function Rt(P,y,V,$,rt,J){const It=o.convert(V.format,V.colorSpace),gt=o.convert(V.type),Ut=b(V.internalFormat,It,gt,V.colorSpace),Nt=n.get(y),pt=n.get(V);if(pt.__renderTarget=y,!Nt.__hasExternalTextures){const At=Math.max(1,y.width>>J),Vt=Math.max(1,y.height>>J);rt===i.TEXTURE_3D||rt===i.TEXTURE_2D_ARRAY?e.texImage3D(rt,J,Ut,At,Vt,y.depth,0,It,gt,null):e.texImage2D(rt,J,Ut,At,Vt,0,It,gt,null)}e.bindFramebuffer(i.FRAMEBUFFER,P),ft(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,rt,pt.__webglTexture,0,Mt(y)):(rt===i.TEXTURE_2D||rt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,rt,pt.__webglTexture,J),e.bindFramebuffer(i.FRAMEBUFFER,null)}function zt(P,y,V){if(i.bindRenderbuffer(i.RENDERBUFFER,P),y.depthBuffer){const $=y.depthTexture,rt=$&&$.isDepthTexture?$.type:null,J=x(y.stencilBuffer,rt),It=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,gt=Mt(y);ft(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,gt,J,y.width,y.height):V?i.renderbufferStorageMultisample(i.RENDERBUFFER,gt,J,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,J,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,It,i.RENDERBUFFER,P)}else{const $=y.textures;for(let rt=0;rt<$.length;rt++){const J=$[rt],It=o.convert(J.format,J.colorSpace),gt=o.convert(J.type),Ut=b(J.internalFormat,It,gt,J.colorSpace),Nt=Mt(y);V&&ft(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,Ut,y.width,y.height):ft(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Nt,Ut,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Ut,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(P,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,P),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const $=n.get(y.depthTexture);$.__renderTarget=y,(!$.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),j(y.depthTexture,0);const rt=$.__webglTexture,J=Mt(y);if(y.depthTexture.format===vs)ft(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,rt,0);else if(y.depthTexture.format===_s)ft(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0,J):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,rt,0);else throw new Error("Unknown depthTexture format")}function ee(P){const y=n.get(P),V=P.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==P.depthTexture){const $=P.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),$){const rt=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,$.removeEventListener("dispose",rt)};$.addEventListener("dispose",rt),y.__depthDisposeCallback=rt}y.__boundDepthTexture=$}if(P.depthTexture&&!y.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");const $=P.texture.mipmaps;$&&$.length>0?Dt(y.__webglFramebuffer[0],P):Dt(y.__webglFramebuffer,P)}else if(V){y.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[$]),y.__webglDepthbuffer[$]===void 0)y.__webglDepthbuffer[$]=i.createRenderbuffer(),zt(y.__webglDepthbuffer[$],P,!1);else{const rt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer[$];i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,J)}}else{const $=P.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),zt(y.__webglDepthbuffer,P,!1);else{const rt=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,J),i.framebufferRenderbuffer(i.FRAMEBUFFER,rt,i.RENDERBUFFER,J)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function me(P,y,V){const $=n.get(P);y!==void 0&&Rt($.__webglFramebuffer,P,P.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),V!==void 0&&ee(P)}function N(P){const y=P.texture,V=n.get(P),$=n.get(y);P.addEventListener("dispose",C);const rt=P.textures,J=P.isWebGLCubeRenderTarget===!0,It=rt.length>1;if(It||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=y.version,r.memory.textures++),J){V.__webglFramebuffer=[];for(let gt=0;gt<6;gt++)if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer[gt]=[];for(let Ut=0;Ut<y.mipmaps.length;Ut++)V.__webglFramebuffer[gt][Ut]=i.createFramebuffer()}else V.__webglFramebuffer[gt]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){V.__webglFramebuffer=[];for(let gt=0;gt<y.mipmaps.length;gt++)V.__webglFramebuffer[gt]=i.createFramebuffer()}else V.__webglFramebuffer=i.createFramebuffer();if(It)for(let gt=0,Ut=rt.length;gt<Ut;gt++){const Nt=n.get(rt[gt]);Nt.__webglTexture===void 0&&(Nt.__webglTexture=i.createTexture(),r.memory.textures++)}if(P.samples>0&&ft(P)===!1){V.__webglMultisampledFramebuffer=i.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let gt=0;gt<rt.length;gt++){const Ut=rt[gt];V.__webglColorRenderbuffer[gt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,V.__webglColorRenderbuffer[gt]);const Nt=o.convert(Ut.format,Ut.colorSpace),pt=o.convert(Ut.type),At=b(Ut.internalFormat,Nt,pt,Ut.colorSpace,P.isXRRenderTarget===!0),Vt=Mt(P);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,At,P.width,P.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,V.__webglColorRenderbuffer[gt])}i.bindRenderbuffer(i.RENDERBUFFER,null),P.depthBuffer&&(V.__webglDepthRenderbuffer=i.createRenderbuffer(),zt(V.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(J){e.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),Wt(i.TEXTURE_CUBE_MAP,y);for(let gt=0;gt<6;gt++)if(y.mipmaps&&y.mipmaps.length>0)for(let Ut=0;Ut<y.mipmaps.length;Ut++)Rt(V.__webglFramebuffer[gt][Ut],P,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,Ut);else Rt(V.__webglFramebuffer[gt],P,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0);m(y)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(It){for(let gt=0,Ut=rt.length;gt<Ut;gt++){const Nt=rt[gt],pt=n.get(Nt);let At=i.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(At=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(At,pt.__webglTexture),Wt(At,Nt),Rt(V.__webglFramebuffer,P,Nt,i.COLOR_ATTACHMENT0+gt,At,0),m(Nt)&&p(At)}e.unbindTexture()}else{let gt=i.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(gt=P.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(gt,$.__webglTexture),Wt(gt,y),y.mipmaps&&y.mipmaps.length>0)for(let Ut=0;Ut<y.mipmaps.length;Ut++)Rt(V.__webglFramebuffer[Ut],P,y,i.COLOR_ATTACHMENT0,gt,Ut);else Rt(V.__webglFramebuffer,P,y,i.COLOR_ATTACHMENT0,gt,0);m(y)&&p(gt),e.unbindTexture()}P.depthBuffer&&ee(P)}function lt(P){const y=P.textures;for(let V=0,$=y.length;V<$;V++){const rt=y[V];if(m(rt)){const J=T(P),It=n.get(rt).__webglTexture;e.bindTexture(J,It),p(J),e.unbindTexture()}}}const ot=[],it=[];function q(P){if(P.samples>0){if(ft(P)===!1){const y=P.textures,V=P.width,$=P.height;let rt=i.COLOR_BUFFER_BIT;const J=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,It=n.get(P),gt=y.length>1;if(gt)for(let Nt=0;Nt<y.length;Nt++)e.bindFramebuffer(i.FRAMEBUFFER,It.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,It.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,It.__webglMultisampledFramebuffer);const Ut=P.texture.mipmaps;Ut&&Ut.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglFramebuffer);for(let Nt=0;Nt<y.length;Nt++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(rt|=i.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(rt|=i.STENCIL_BUFFER_BIT)),gt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,It.__webglColorRenderbuffer[Nt]);const pt=n.get(y[Nt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pt,0)}i.blitFramebuffer(0,0,V,$,0,0,V,$,rt,i.NEAREST),c===!0&&(ot.length=0,it.length=0,ot.push(i.COLOR_ATTACHMENT0+Nt),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ot.push(J),it.push(J),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,it)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ot))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),gt)for(let Nt=0;Nt<y.length;Nt++){e.bindFramebuffer(i.FRAMEBUFFER,It.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.RENDERBUFFER,It.__webglColorRenderbuffer[Nt]);const pt=n.get(y[Nt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,It.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Nt,i.TEXTURE_2D,pt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,It.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&c){const y=P.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function Mt(P){return Math.min(s.maxSamples,P.samples)}function ft(P){const y=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function yt(P){const y=r.render.frame;h.get(P)!==y&&(h.set(P,y),P.update())}function Bt(P,y){const V=P.colorSpace,$=P.format,rt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||V!==Gi&&V!==jn&&(de.getTransfer(V)===_e?($!==_n||rt!==En)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),y}function Yt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(l.width=P.naturalWidth||P.width,l.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(l.width=P.displayWidth,l.height=P.displayHeight):(l.width=P.width,l.height=P.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=F,this.setTexture2D=j,this.setTexture2DArray=tt,this.setTexture3D=et,this.setTextureCube=K,this.rebindTextures=me,this.setupRenderTarget=N,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=q,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=Rt,this.useMultisampledRTT=ft}function Ug(i,t){function e(n,s=jn){let o;const r=de.getTransfer(s);if(n===En)return i.UNSIGNED_BYTE;if(n===La)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Da)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ol)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===zl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Nl)return i.BYTE;if(n===Fl)return i.SHORT;if(n===ms)return i.UNSIGNED_SHORT;if(n===Ia)return i.INT;if(n===pi)return i.UNSIGNED_INT;if(n===Nn)return i.FLOAT;if(n===Ts)return i.HALF_FLOAT;if(n===Bl)return i.ALPHA;if(n===kl)return i.RGB;if(n===_n)return i.RGBA;if(n===vs)return i.DEPTH_COMPONENT;if(n===_s)return i.DEPTH_STENCIL;if(n===Ua)return i.RED;if(n===Na)return i.RED_INTEGER;if(n===Vl)return i.RG;if(n===Fa)return i.RG_INTEGER;if(n===Oa)return i.RGBA_INTEGER;if(n===ro||n===ao||n===co||n===lo)if(r===_e)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(n===ro)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===ao)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===co)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===lo)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(n===ro)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===ao)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===co)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===lo)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Dr||n===Ur||n===Nr||n===Fr)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(n===Dr)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ur)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Nr)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Fr)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Or||n===zr||n===Br)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(n===Or||n===zr)return r===_e?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(n===Br)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===kr||n===Vr||n===Hr||n===Gr||n===Wr||n===qr||n===Xr||n===Yr||n===jr||n===Jr||n===Zr||n===Kr||n===$r||n===Qr)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(n===kr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Vr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Hr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Gr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Wr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===qr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Xr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Yr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===jr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Jr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Zr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Kr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===$r)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Qr)return r===_e?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ta||n===ea||n===na)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(n===ta)return r===_e?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ea)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===na)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ia||n===sa||n===oa||n===ra)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(n===ia)return o.COMPRESSED_RED_RGTC1_EXT;if(n===sa)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===oa)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===ra)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gs?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const Ng=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Fg=`
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

}`;class Og{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new ih(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Kn({vertexShader:Ng,fragmentShader:Fg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new S(new sn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class zg extends Xi{constructor(t,e){super();const n=this;let s=null,o=1,r=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const _=typeof XRWebGLBinding<"u",m=new Og,p={},T=e.getContextAttributes();let b=null,x=null;const L=[],w=[],C=new St;let R=null;const M=new nn;M.viewport=new Re;const v=new nn;v.viewport=new Re;const D=[M,v],F=new sf;let k=null,Y=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(nt){let ct=L[nt];return ct===void 0&&(ct=new Qo,L[nt]=ct),ct.getTargetRaySpace()},this.getControllerGrip=function(nt){let ct=L[nt];return ct===void 0&&(ct=new Qo,L[nt]=ct),ct.getGripSpace()},this.getHand=function(nt){let ct=L[nt];return ct===void 0&&(ct=new Qo,L[nt]=ct),ct.getHandSpace()};function j(nt){const ct=w.indexOf(nt.inputSource);if(ct===-1)return;const Rt=L[ct];Rt!==void 0&&(Rt.update(nt.inputSource,nt.frame,l||r),Rt.dispatchEvent({type:nt.type,data:nt.inputSource}))}function tt(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",tt),s.removeEventListener("inputsourceschange",et);for(let nt=0;nt<L.length;nt++){const ct=w[nt];ct!==null&&(w[nt]=null,L[nt].disconnect(ct))}k=null,Y=null,m.reset();for(const nt in p)delete p[nt];t.setRenderTarget(b),f=null,d=null,u=null,s=null,x=null,se.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(nt){o=nt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(nt){a=nt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(nt){l=nt},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(nt){if(s=nt,s!==null){if(b=t.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",tt),s.addEventListener("inputsourceschange",et),T.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Rt=null,zt=null,Dt=null;T.depth&&(Dt=T.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Rt=T.stencil?_s:vs,zt=T.stencil?gs:pi);const ee={colorFormat:e.RGBA8,depthFormat:Dt,scaleFactor:o};u=this.getBinding(),d=u.createProjectionLayer(ee),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new mi(d.textureWidth,d.textureHeight,{format:_n,type:En,depthTexture:new nh(d.textureWidth,d.textureHeight,zt,void 0,void 0,void 0,void 0,void 0,void 0,Rt),stencilBuffer:T.stencil,colorSpace:t.outputColorSpace,samples:T.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Rt={antialias:T.antialias,alpha:!0,depth:T.depth,stencil:T.stencil,framebufferScaleFactor:o};f=new XRWebGLLayer(s,e,Rt),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new mi(f.framebufferWidth,f.framebufferHeight,{format:_n,type:En,colorSpace:t.outputColorSpace,stencilBuffer:T.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,r=await s.requestReferenceSpace(a),se.setContext(s),se.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function et(nt){for(let ct=0;ct<nt.removed.length;ct++){const Rt=nt.removed[ct],zt=w.indexOf(Rt);zt>=0&&(w[zt]=null,L[zt].disconnect(Rt))}for(let ct=0;ct<nt.added.length;ct++){const Rt=nt.added[ct];let zt=w.indexOf(Rt);if(zt===-1){for(let ee=0;ee<L.length;ee++)if(ee>=w.length){w.push(Rt),zt=ee;break}else if(w[ee]===null){w[ee]=Rt,zt=ee;break}if(zt===-1)break}const Dt=L[zt];Dt&&Dt.connect(Rt)}}const K=new U,_t=new U;function Q(nt,ct,Rt){K.setFromMatrixPosition(ct.matrixWorld),_t.setFromMatrixPosition(Rt.matrixWorld);const zt=K.distanceTo(_t),Dt=ct.projectionMatrix.elements,ee=Rt.projectionMatrix.elements,me=Dt[14]/(Dt[10]-1),N=Dt[14]/(Dt[10]+1),lt=(Dt[9]+1)/Dt[5],ot=(Dt[9]-1)/Dt[5],it=(Dt[8]-1)/Dt[0],q=(ee[8]+1)/ee[0],Mt=me*it,ft=me*q,yt=zt/(-it+q),Bt=yt*-it;if(ct.matrixWorld.decompose(nt.position,nt.quaternion,nt.scale),nt.translateX(Bt),nt.translateZ(yt),nt.matrixWorld.compose(nt.position,nt.quaternion,nt.scale),nt.matrixWorldInverse.copy(nt.matrixWorld).invert(),Dt[10]===-1)nt.projectionMatrix.copy(ct.projectionMatrix),nt.projectionMatrixInverse.copy(ct.projectionMatrixInverse);else{const Yt=me+yt,P=N+yt,y=Mt-Bt,V=ft+(zt-Bt),$=lt*N/P*Yt,rt=ot*N/P*Yt;nt.projectionMatrix.makePerspective(y,V,$,rt,Yt,P),nt.projectionMatrixInverse.copy(nt.projectionMatrix).invert()}}function bt(nt,ct){ct===null?nt.matrixWorld.copy(nt.matrix):nt.matrixWorld.multiplyMatrices(ct.matrixWorld,nt.matrix),nt.matrixWorldInverse.copy(nt.matrixWorld).invert()}this.updateCamera=function(nt){if(s===null)return;let ct=nt.near,Rt=nt.far;m.texture!==null&&(m.depthNear>0&&(ct=m.depthNear),m.depthFar>0&&(Rt=m.depthFar)),F.near=v.near=M.near=ct,F.far=v.far=M.far=Rt,(k!==F.near||Y!==F.far)&&(s.updateRenderState({depthNear:F.near,depthFar:F.far}),k=F.near,Y=F.far),F.layers.mask=nt.layers.mask|6,M.layers.mask=F.layers.mask&3,v.layers.mask=F.layers.mask&5;const zt=nt.parent,Dt=F.cameras;bt(F,zt);for(let ee=0;ee<Dt.length;ee++)bt(Dt[ee],zt);Dt.length===2?Q(F,M,v):F.projectionMatrix.copy(M.projectionMatrix),Wt(nt,F,zt)};function Wt(nt,ct,Rt){Rt===null?nt.matrix.copy(ct.matrixWorld):(nt.matrix.copy(Rt.matrixWorld),nt.matrix.invert(),nt.matrix.multiply(ct.matrixWorld)),nt.matrix.decompose(nt.position,nt.quaternion,nt.scale),nt.updateMatrixWorld(!0),nt.projectionMatrix.copy(ct.projectionMatrix),nt.projectionMatrixInverse.copy(ct.projectionMatrixInverse),nt.isPerspectiveCamera&&(nt.fov=xs*2*Math.atan(1/nt.projectionMatrix.elements[5]),nt.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(nt){c=nt,d!==null&&(d.fixedFoveation=nt),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=nt)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(nt){return p[nt]};let te=null;function ce(nt,ct){if(h=ct.getViewerPose(l||r),g=ct,h!==null){const Rt=h.views;f!==null&&(t.setRenderTargetFramebuffer(x,f.framebuffer),t.setRenderTarget(x));let zt=!1;Rt.length!==F.cameras.length&&(F.cameras.length=0,zt=!0);for(let N=0;N<Rt.length;N++){const lt=Rt[N];let ot=null;if(f!==null)ot=f.getViewport(lt);else{const q=u.getViewSubImage(d,lt);ot=q.viewport,N===0&&(t.setRenderTargetTextures(x,q.colorTexture,q.depthStencilTexture),t.setRenderTarget(x))}let it=D[N];it===void 0&&(it=new nn,it.layers.enable(N),it.viewport=new Re,D[N]=it),it.matrix.fromArray(lt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(lt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(ot.x,ot.y,ot.width,ot.height),N===0&&(F.matrix.copy(it.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),zt===!0&&F.cameras.push(it)}const Dt=s.enabledFeatures;if(Dt&&Dt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&_){u=n.getBinding();const N=u.getDepthInformation(Rt[0]);N&&N.isValid&&N.texture&&m.init(N,s.renderState)}if(Dt&&Dt.includes("camera-access")&&_){t.state.unbindTexture(),u=n.getBinding();for(let N=0;N<Rt.length;N++){const lt=Rt[N].camera;if(lt){let ot=p[lt];ot||(ot=new ih,p[lt]=ot);const it=u.getCameraImage(lt);ot.sourceTexture=it}}}}for(let Rt=0;Rt<L.length;Rt++){const zt=w[Rt],Dt=L[Rt];zt!==null&&Dt!==void 0&&Dt.update(zt,ct,l||r)}te&&te(nt,ct),ct.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ct}),g=null}const se=new mh;se.setAnimationLoop(ce),this.setAnimationLoop=function(nt){te=nt},this.dispose=function(){}}}const oi=new kn,Bg=new Ee;function kg(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Kl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,T,b,x){p.isMeshBasicMaterial||p.isMeshLambertMaterial?o(m,p):p.isMeshToonMaterial?(o(m,p),u(m,p)):p.isMeshPhongMaterial?(o(m,p),h(m,p)):p.isMeshStandardMaterial?(o(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(o(m,p),g(m,p)):p.isMeshDepthMaterial?o(m,p):p.isMeshDistanceMaterial?(o(m,p),_(m,p)):p.isMeshNormalMaterial?o(m,p):p.isLineBasicMaterial?(r(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,T,b):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function o(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Xe&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Xe&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const T=t.get(p),b=T.envMap,x=T.envMapRotation;b&&(m.envMap.value=b,oi.copy(x),oi.x*=-1,oi.y*=-1,oi.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),m.envMapRotation.value.setFromMatrix4(Bg.makeRotationFromEuler(oi)),m.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function r(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,T,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*T,m.scale.value=b*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,T){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Xe&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=T.texture,m.transmissionSamplerSize.value.set(T.width,T.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){const T=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(T.matrixWorld),m.nearDistance.value=T.shadow.camera.near,m.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Vg(i,t,e,n){let s={},o={},r=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(T,b){const x=b.program;n.uniformBlockBinding(T,x)}function l(T,b){let x=s[T.id];x===void 0&&(g(T),x=h(T),s[T.id]=x,T.addEventListener("dispose",m));const L=b.program;n.updateUBOMapping(T,L);const w=t.render.frame;o[T.id]!==w&&(d(T),o[T.id]=w)}function h(T){const b=u();T.__bindingPointIndex=b;const x=i.createBuffer(),L=T.__size,w=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,x),i.bufferData(i.UNIFORM_BUFFER,L,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,x),x}function u(){for(let T=0;T<a;T++)if(r.indexOf(T)===-1)return r.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(T){const b=s[T.id],x=T.uniforms,L=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let w=0,C=x.length;w<C;w++){const R=Array.isArray(x[w])?x[w]:[x[w]];for(let M=0,v=R.length;M<v;M++){const D=R[M];if(f(D,w,M,L)===!0){const F=D.__offset,k=Array.isArray(D.value)?D.value:[D.value];let Y=0;for(let j=0;j<k.length;j++){const tt=k[j],et=_(tt);typeof tt=="number"||typeof tt=="boolean"?(D.__data[0]=tt,i.bufferSubData(i.UNIFORM_BUFFER,F+Y,D.__data)):tt.isMatrix3?(D.__data[0]=tt.elements[0],D.__data[1]=tt.elements[1],D.__data[2]=tt.elements[2],D.__data[3]=0,D.__data[4]=tt.elements[3],D.__data[5]=tt.elements[4],D.__data[6]=tt.elements[5],D.__data[7]=0,D.__data[8]=tt.elements[6],D.__data[9]=tt.elements[7],D.__data[10]=tt.elements[8],D.__data[11]=0):(tt.toArray(D.__data,Y),Y+=et.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(T,b,x,L){const w=T.value,C=b+"_"+x;if(L[C]===void 0)return typeof w=="number"||typeof w=="boolean"?L[C]=w:L[C]=w.clone(),!0;{const R=L[C];if(typeof w=="number"||typeof w=="boolean"){if(R!==w)return L[C]=w,!0}else if(R.equals(w)===!1)return R.copy(w),!0}return!1}function g(T){const b=T.uniforms;let x=0;const L=16;for(let C=0,R=b.length;C<R;C++){const M=Array.isArray(b[C])?b[C]:[b[C]];for(let v=0,D=M.length;v<D;v++){const F=M[v],k=Array.isArray(F.value)?F.value:[F.value];for(let Y=0,j=k.length;Y<j;Y++){const tt=k[Y],et=_(tt),K=x%L,_t=K%et.boundary,Q=K+_t;x+=_t,Q!==0&&L-Q<et.storage&&(x+=L-Q),F.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=x,x+=et.storage}}}const w=x%L;return w>0&&(x+=L-w),T.__size=x,T.__cache={},this}function _(T){const b={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(b.boundary=4,b.storage=4):T.isVector2?(b.boundary=8,b.storage=8):T.isVector3||T.isColor?(b.boundary=16,b.storage=12):T.isVector4?(b.boundary=16,b.storage=16):T.isMatrix3?(b.boundary=48,b.storage=48):T.isMatrix4?(b.boundary=64,b.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),b}function m(T){const b=T.target;b.removeEventListener("dispose",m);const x=r.indexOf(b.__bindingPointIndex);r.splice(x,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete o[b.id]}function p(){for(const T in s)i.deleteBuffer(s[T]);r=[],s={},o={}}return{bind:c,update:l,dispose:p}}class Mh{constructor(t={}){const{canvas:e=Vu(),context:n=null,depth:s=!0,stencil:o=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=r;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,p=null;const T=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const x=this;let L=!1;this._outputColorSpace=en;let w=0,C=0,R=null,M=-1,v=null;const D=new Re,F=new Re;let k=null;const Y=new re(0);let j=0,tt=e.width,et=e.height,K=1,_t=null,Q=null;const bt=new Re(0,0,tt,et),Wt=new Re(0,0,tt,et);let te=!1;const ce=new Va;let se=!1,nt=!1;const ct=new Ee,Rt=new U,zt=new Re,Dt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ee=!1;function me(){return R===null?K:1}let N=n;function lt(A,B){return e.getContext(A,B)}try{const A={alpha:!0,depth:s,stencil:o,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Pa}`),e.addEventListener("webglcontextlost",xt,!1),e.addEventListener("webglcontextrestored",wt,!1),e.addEventListener("webglcontextcreationerror",dt,!1),N===null){const B="webgl2";if(N=lt(B,A),N===null)throw lt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let ot,it,q,Mt,ft,yt,Bt,Yt,P,y,V,$,rt,J,It,gt,Ut,Nt,pt,At,Vt,Ot,Et,Zt;function z(){ot=new $m(N),ot.init(),Ot=new Ug(N,ot),it=new qm(N,ot,t,Ot),q=new Lg(N,ot),it.reversedDepthBuffer&&d&&q.buffers.depth.setReversed(!0),Mt=new e0(N),ft=new xg,yt=new Dg(N,ot,q,ft,it,Ot,Mt),Bt=new Ym(x),Yt=new Km(x),P=new af(N),Et=new Gm(N,P),y=new Qm(N,P,Mt,Et),V=new i0(N,y,P,Mt),pt=new n0(N,it,yt),gt=new Xm(ft),$=new _g(x,Bt,Yt,ot,it,Et,gt),rt=new kg(x,ft),J=new yg,It=new Ag(ot),Nt=new Hm(x,Bt,Yt,q,V,f,c),Ut=new Pg(x,V,it),Zt=new Vg(N,Mt,it,q),At=new Wm(N,ot,Mt),Vt=new t0(N,ot,Mt),Mt.programs=$.programs,x.capabilities=it,x.extensions=ot,x.properties=ft,x.renderLists=J,x.shadowMap=Ut,x.state=q,x.info=Mt}z();const mt=new zg(x,N);this.xr=mt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const A=ot.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=ot.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(A){A!==void 0&&(K=A,this.setSize(tt,et,!1))},this.getSize=function(A){return A.set(tt,et)},this.setSize=function(A,B,X=!0){if(mt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}tt=A,et=B,e.width=Math.floor(A*K),e.height=Math.floor(B*K),X===!0&&(e.style.width=A+"px",e.style.height=B+"px"),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(tt*K,et*K).floor()},this.setDrawingBufferSize=function(A,B,X){tt=A,et=B,K=X,e.width=Math.floor(A*X),e.height=Math.floor(B*X),this.setViewport(0,0,A,B)},this.getCurrentViewport=function(A){return A.copy(D)},this.getViewport=function(A){return A.copy(bt)},this.setViewport=function(A,B,X,Z){A.isVector4?bt.set(A.x,A.y,A.z,A.w):bt.set(A,B,X,Z),q.viewport(D.copy(bt).multiplyScalar(K).round())},this.getScissor=function(A){return A.copy(Wt)},this.setScissor=function(A,B,X,Z){A.isVector4?Wt.set(A.x,A.y,A.z,A.w):Wt.set(A,B,X,Z),q.scissor(F.copy(Wt).multiplyScalar(K).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(A){q.setScissorTest(te=A)},this.setOpaqueSort=function(A){_t=A},this.setTransparentSort=function(A){Q=A},this.getClearColor=function(A){return A.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor(...arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha(...arguments)},this.clear=function(A=!0,B=!0,X=!0){let Z=0;if(A){let H=!1;if(R!==null){const vt=R.texture.format;H=vt===Oa||vt===Fa||vt===Na}if(H){const vt=R.texture.type,Ct=vt===En||vt===pi||vt===ms||vt===gs||vt===La||vt===Da,Ft=Nt.getClearColor(),Pt=Nt.getClearAlpha(),Xt=Ft.r,jt=Ft.g,kt=Ft.b;Ct?(g[0]=Xt,g[1]=jt,g[2]=kt,g[3]=Pt,N.clearBufferuiv(N.COLOR,0,g)):(_[0]=Xt,_[1]=jt,_[2]=kt,_[3]=Pt,N.clearBufferiv(N.COLOR,0,_))}else Z|=N.COLOR_BUFFER_BIT}B&&(Z|=N.DEPTH_BUFFER_BIT),X&&(Z|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",xt,!1),e.removeEventListener("webglcontextrestored",wt,!1),e.removeEventListener("webglcontextcreationerror",dt,!1),Nt.dispose(),J.dispose(),It.dispose(),ft.dispose(),Bt.dispose(),Yt.dispose(),V.dispose(),Et.dispose(),Zt.dispose(),$.dispose(),mt.dispose(),mt.removeEventListener("sessionstart",We),mt.removeEventListener("sessionend",O),G.stop()};function xt(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function wt(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;const A=Mt.autoReset,B=Ut.enabled,X=Ut.autoUpdate,Z=Ut.needsUpdate,H=Ut.type;z(),Mt.autoReset=A,Ut.enabled=B,Ut.autoUpdate=X,Ut.needsUpdate=Z,Ut.type=H}function dt(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function st(A){const B=A.target;B.removeEventListener("dispose",st),Lt(B)}function Lt(A){Jt(A),ft.remove(A)}function Jt(A){const B=ft.get(A).programs;B!==void 0&&(B.forEach(function(X){$.releaseProgram(X)}),A.isShaderMaterial&&$.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,X,Z,H,vt){B===null&&(B=Dt);const Ct=H.isMesh&&H.matrixWorld.determinant()<0,Ft=Dh(A,B,X,Z,H);q.setMaterial(Z,Ct);let Pt=X.index,Xt=1;if(Z.wireframe===!0){if(Pt=y.getWireframeAttribute(X),Pt===void 0)return;Xt=2}const jt=X.drawRange,kt=X.attributes.position;let oe=jt.start*Xt,ve=(jt.start+jt.count)*Xt;vt!==null&&(oe=Math.max(oe,vt.start*Xt),ve=Math.min(ve,(vt.start+vt.count)*Xt)),Pt!==null?(oe=Math.max(oe,0),ve=Math.min(ve,Pt.count)):kt!=null&&(oe=Math.max(oe,0),ve=Math.min(ve,kt.count));const Ae=ve-oe;if(Ae<0||Ae===1/0)return;Et.setup(H,Z,Ft,X,Pt);let Me,xe=At;if(Pt!==null&&(Me=P.get(Pt),xe=Vt,xe.setIndex(Me)),H.isMesh)Z.wireframe===!0?(q.setLineWidth(Z.wireframeLinewidth*me()),xe.setMode(N.LINES)):xe.setMode(N.TRIANGLES);else if(H.isLine){let Gt=Z.linewidth;Gt===void 0&&(Gt=1),q.setLineWidth(Gt*me()),H.isLineSegments?xe.setMode(N.LINES):H.isLineLoop?xe.setMode(N.LINE_LOOP):xe.setMode(N.LINE_STRIP)}else H.isPoints?xe.setMode(N.POINTS):H.isSprite&&xe.setMode(N.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)Ms("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),xe.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(ot.get("WEBGL_multi_draw"))xe.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Gt=H._multiDrawStarts,Se=H._multiDrawCounts,he=H._multiDrawCount,je=Pt?P.get(Pt).bytesPerElement:1,xi=ft.get(Z).currentProgram.getUniforms();for(let Je=0;Je<he;Je++)xi.setValue(N,"_gl_DrawID",Je),xe.render(Gt[Je]/je,Se[Je])}else if(H.isInstancedMesh)xe.renderInstances(oe,Ae,H.count);else if(X.isInstancedBufferGeometry){const Gt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Se=Math.min(X.instanceCount,Gt);xe.renderInstances(oe,Ae,Se)}else xe.render(oe,Ae)};function ge(A,B,X){A.transparent===!0&&A.side===mn&&A.forceSinglePass===!1?(A.side=Xe,A.needsUpdate=!0,$n(A,B,X),A.side=Bn,A.needsUpdate=!0,$n(A,B,X),A.side=mn):$n(A,B,X)}this.compile=function(A,B,X=null){X===null&&(X=A),p=It.get(X),p.init(B),b.push(p),X.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),A!==X&&A.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const Z=new Set;return A.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const vt=H.material;if(vt)if(Array.isArray(vt))for(let Ct=0;Ct<vt.length;Ct++){const Ft=vt[Ct];ge(Ft,X,H),Z.add(Ft)}else ge(vt,X,H),Z.add(vt)}),p=b.pop(),Z},this.compileAsync=function(A,B,X=null){const Z=this.compile(A,B,X);return new Promise(H=>{function vt(){if(Z.forEach(function(Ct){ft.get(Ct).currentProgram.isReady()&&Z.delete(Ct)}),Z.size===0){H(A);return}setTimeout(vt,10)}ot.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let ie=null;function Ye(A){ie&&ie(A)}function We(){G.stop()}function O(){G.start()}const G=new mh;G.setAnimationLoop(Ye),typeof self<"u"&&G.setContext(self),this.setAnimationLoop=function(A){ie=A,mt.setAnimationLoop(A),A===null?G.stop():G.start()},mt.addEventListener("sessionstart",We),mt.addEventListener("sessionend",O),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),mt.enabled===!0&&mt.isPresenting===!0&&(mt.cameraAutoUpdate===!0&&mt.updateCamera(B),B=mt.getCamera()),A.isScene===!0&&A.onBeforeRender(x,A,B,R),p=It.get(A,b.length),p.init(B),b.push(p),ct.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ce.setFromProjectionMatrix(ct,Sn,B.reversedDepth),nt=this.localClippingEnabled,se=gt.init(this.clippingPlanes,nt),m=J.get(A,T.length),m.init(),T.push(m),mt.enabled===!0&&mt.isPresenting===!0){const vt=x.xr.getDepthSensingMesh();vt!==null&&ht(vt,B,-1/0,x.sortObjects)}ht(A,B,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort(_t,Q),ee=mt.enabled===!1||mt.isPresenting===!1||mt.hasDepthSensing()===!1,ee&&Nt.addToRenderList(m,A),this.info.render.frame++,se===!0&&gt.beginShadows();const X=p.state.shadowsArray;Ut.render(X,A,B),se===!0&&gt.endShadows(),this.info.autoReset===!0&&this.info.reset();const Z=m.opaque,H=m.transmissive;if(p.setupLights(),B.isArrayCamera){const vt=B.cameras;if(H.length>0)for(let Ct=0,Ft=vt.length;Ct<Ft;Ct++){const Pt=vt[Ct];Kt(Z,H,A,Pt)}ee&&Nt.render(A);for(let Ct=0,Ft=vt.length;Ct<Ft;Ct++){const Pt=vt[Ct];qt(m,A,Pt,Pt.viewport)}}else H.length>0&&Kt(Z,H,A,B),ee&&Nt.render(A),qt(m,A,B);R!==null&&C===0&&(yt.updateMultisampleRenderTarget(R),yt.updateRenderTargetMipmap(R)),A.isScene===!0&&A.onAfterRender(x,A,B),Et.resetDefaultState(),M=-1,v=null,b.pop(),b.length>0?(p=b[b.length-1],se===!0&&gt.setGlobalState(x.clippingPlanes,p.state.camera)):p=null,T.pop(),T.length>0?m=T[T.length-1]:m=null};function ht(A,B,X,Z){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)X=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLight)p.pushLight(A),A.castShadow&&p.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||ce.intersectsSprite(A)){Z&&zt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ct);const Ct=V.update(A),Ft=A.material;Ft.visible&&m.push(A,Ct,Ft,X,zt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||ce.intersectsObject(A))){const Ct=V.update(A),Ft=A.material;if(Z&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),zt.copy(A.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),zt.copy(Ct.boundingSphere.center)),zt.applyMatrix4(A.matrixWorld).applyMatrix4(ct)),Array.isArray(Ft)){const Pt=Ct.groups;for(let Xt=0,jt=Pt.length;Xt<jt;Xt++){const kt=Pt[Xt],oe=Ft[kt.materialIndex];oe&&oe.visible&&m.push(A,Ct,oe,X,zt.z,kt)}}else Ft.visible&&m.push(A,Ct,Ft,X,zt.z,null)}}const vt=A.children;for(let Ct=0,Ft=vt.length;Ct<Ft;Ct++)ht(vt[Ct],B,X,Z)}function qt(A,B,X,Z){const H=A.opaque,vt=A.transmissive,Ct=A.transparent;p.setupLightsView(X),se===!0&&gt.setGlobalState(x.clippingPlanes,X),Z&&q.viewport(D.copy(Z)),H.length>0&&on(H,B,X),vt.length>0&&on(vt,B,X),Ct.length>0&&on(Ct,B,X),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function Kt(A,B,X,Z){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Z.id]===void 0&&(p.state.transmissionRenderTarget[Z.id]=new mi(1,1,{generateMipmaps:!0,type:ot.has("EXT_color_buffer_half_float")||ot.has("EXT_color_buffer_float")?Ts:En,minFilter:di,samples:4,stencilBuffer:o,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:de.workingColorSpace}));const vt=p.state.transmissionRenderTarget[Z.id],Ct=Z.viewport||D;vt.setSize(Ct.z*x.transmissionResolutionScale,Ct.w*x.transmissionResolutionScale);const Ft=x.getRenderTarget(),Pt=x.getActiveCubeFace(),Xt=x.getActiveMipmapLevel();x.setRenderTarget(vt),x.getClearColor(Y),j=x.getClearAlpha(),j<1&&x.setClearColor(16777215,.5),x.clear(),ee&&Nt.render(X);const jt=x.toneMapping;x.toneMapping=Zn;const kt=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),p.setupLightsView(Z),se===!0&&gt.setGlobalState(x.clippingPlanes,Z),on(A,X,Z),yt.updateMultisampleRenderTarget(vt),yt.updateRenderTargetMipmap(vt),ot.has("WEBGL_multisampled_render_to_texture")===!1){let oe=!1;for(let ve=0,Ae=B.length;ve<Ae;ve++){const Me=B[ve],xe=Me.object,Gt=Me.geometry,Se=Me.material,he=Me.group;if(Se.side===mn&&xe.layers.test(Z.layers)){const je=Se.side;Se.side=Xe,Se.needsUpdate=!0,Ki(xe,X,Z,Gt,Se,he),Se.side=je,Se.needsUpdate=!0,oe=!0}}oe===!0&&(yt.updateMultisampleRenderTarget(vt),yt.updateRenderTargetMipmap(vt))}x.setRenderTarget(Ft,Pt,Xt),x.setClearColor(Y,j),kt!==void 0&&(Z.viewport=kt),x.toneMapping=jt}function on(A,B,X){const Z=B.isScene===!0?B.overrideMaterial:null;for(let H=0,vt=A.length;H<vt;H++){const Ct=A[H],Ft=Ct.object,Pt=Ct.geometry,Xt=Ct.group;let jt=Ct.material;jt.allowOverride===!0&&Z!==null&&(jt=Z),Ft.layers.test(X.layers)&&Ki(Ft,B,X,Pt,jt,Xt)}}function Ki(A,B,X,Z,H,vt){A.onBeforeRender(x,B,X,Z,H,vt),A.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),H.onBeforeRender(x,B,X,Z,A,vt),H.transparent===!0&&H.side===mn&&H.forceSinglePass===!1?(H.side=Xe,H.needsUpdate=!0,x.renderBufferDirect(X,B,Z,H,A,vt),H.side=Bn,H.needsUpdate=!0,x.renderBufferDirect(X,B,Z,H,A,vt),H.side=mn):x.renderBufferDirect(X,B,Z,H,A,vt),A.onAfterRender(x,B,X,Z,H,vt)}function $n(A,B,X){B.isScene!==!0&&(B=Dt);const Z=ft.get(A),H=p.state.lights,vt=p.state.shadowsArray,Ct=H.state.version,Ft=$.getParameters(A,H.state,vt,B,X),Pt=$.getProgramCacheKey(Ft);let Xt=Z.programs;Z.environment=A.isMeshStandardMaterial?B.environment:null,Z.fog=B.fog,Z.envMap=(A.isMeshStandardMaterial?Yt:Bt).get(A.envMap||Z.environment),Z.envMapRotation=Z.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,Xt===void 0&&(A.addEventListener("dispose",st),Xt=new Map,Z.programs=Xt);let jt=Xt.get(Pt);if(jt!==void 0){if(Z.currentProgram===jt&&Z.lightsStateVersion===Ct)return Rs(A,Ft),jt}else Ft.uniforms=$.getUniforms(A),A.onBeforeCompile(Ft,x),jt=$.acquireProgram(Ft,Pt),Xt.set(Pt,jt),Z.uniforms=Ft.uniforms;const kt=Z.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(kt.clippingPlanes=gt.uniform),Rs(A,Ft),Z.needsLights=Nh(A),Z.lightsStateVersion=Ct,Z.needsLights&&(kt.ambientLightColor.value=H.state.ambient,kt.lightProbe.value=H.state.probe,kt.directionalLights.value=H.state.directional,kt.directionalLightShadows.value=H.state.directionalShadow,kt.spotLights.value=H.state.spot,kt.spotLightShadows.value=H.state.spotShadow,kt.rectAreaLights.value=H.state.rectArea,kt.ltc_1.value=H.state.rectAreaLTC1,kt.ltc_2.value=H.state.rectAreaLTC2,kt.pointLights.value=H.state.point,kt.pointLightShadows.value=H.state.pointShadow,kt.hemisphereLights.value=H.state.hemi,kt.directionalShadowMap.value=H.state.directionalShadowMap,kt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,kt.spotShadowMap.value=H.state.spotShadowMap,kt.spotLightMatrix.value=H.state.spotLightMatrix,kt.spotLightMap.value=H.state.spotLightMap,kt.pointShadowMap.value=H.state.pointShadowMap,kt.pointShadowMatrix.value=H.state.pointShadowMatrix),Z.currentProgram=jt,Z.uniformsList=null,jt}function $i(A){if(A.uniformsList===null){const B=A.currentProgram.getUniforms();A.uniformsList=ho.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function Rs(A,B){const X=ft.get(A);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function Dh(A,B,X,Z,H){B.isScene!==!0&&(B=Dt),yt.resetTextureUnits();const vt=B.fog,Ct=Z.isMeshStandardMaterial?B.environment:null,Ft=R===null?x.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Gi,Pt=(Z.isMeshStandardMaterial?Yt:Bt).get(Z.envMap||Ct),Xt=Z.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,jt=!!X.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),kt=!!X.morphAttributes.position,oe=!!X.morphAttributes.normal,ve=!!X.morphAttributes.color;let Ae=Zn;Z.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Ae=x.toneMapping);const Me=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,xe=Me!==void 0?Me.length:0,Gt=ft.get(Z),Se=p.state.lights;if(se===!0&&(nt===!0||A!==v)){const ke=A===v&&Z.id===M;gt.setState(Z,A,ke)}let he=!1;Z.version===Gt.__version?(Gt.needsLights&&Gt.lightsStateVersion!==Se.state.version||Gt.outputColorSpace!==Ft||H.isBatchedMesh&&Gt.batching===!1||!H.isBatchedMesh&&Gt.batching===!0||H.isBatchedMesh&&Gt.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Gt.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Gt.instancing===!1||!H.isInstancedMesh&&Gt.instancing===!0||H.isSkinnedMesh&&Gt.skinning===!1||!H.isSkinnedMesh&&Gt.skinning===!0||H.isInstancedMesh&&Gt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Gt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Gt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Gt.instancingMorph===!1&&H.morphTexture!==null||Gt.envMap!==Pt||Z.fog===!0&&Gt.fog!==vt||Gt.numClippingPlanes!==void 0&&(Gt.numClippingPlanes!==gt.numPlanes||Gt.numIntersection!==gt.numIntersection)||Gt.vertexAlphas!==Xt||Gt.vertexTangents!==jt||Gt.morphTargets!==kt||Gt.morphNormals!==oe||Gt.morphColors!==ve||Gt.toneMapping!==Ae||Gt.morphTargetsCount!==xe)&&(he=!0):(he=!0,Gt.__version=Z.version);let je=Gt.currentProgram;he===!0&&(je=$n(Z,B,H));let xi=!1,Je=!1,Qi=!1;const be=je.getUniforms(),rn=Gt.uniforms;if(q.useProgram(je.program)&&(xi=!0,Je=!0,Qi=!0),Z.id!==M&&(M=Z.id,Je=!0),xi||v!==A){q.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),be.setValue(N,"projectionMatrix",A.projectionMatrix),be.setValue(N,"viewMatrix",A.matrixWorldInverse);const qe=be.map.cameraPosition;qe!==void 0&&qe.setValue(N,Rt.setFromMatrixPosition(A.matrixWorld)),it.logarithmicDepthBuffer&&be.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&be.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),v!==A&&(v=A,Je=!0,Qi=!0)}if(H.isSkinnedMesh){be.setOptional(N,H,"bindMatrix"),be.setOptional(N,H,"bindMatrixInverse");const ke=H.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),be.setValue(N,"boneTexture",ke.boneTexture,yt))}H.isBatchedMesh&&(be.setOptional(N,H,"batchingTexture"),be.setValue(N,"batchingTexture",H._matricesTexture,yt),be.setOptional(N,H,"batchingIdTexture"),be.setValue(N,"batchingIdTexture",H._indirectTexture,yt),be.setOptional(N,H,"batchingColorTexture"),H._colorsTexture!==null&&be.setValue(N,"batchingColorTexture",H._colorsTexture,yt));const an=X.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&pt.update(H,X,je),(Je||Gt.receiveShadow!==H.receiveShadow)&&(Gt.receiveShadow=H.receiveShadow,be.setValue(N,"receiveShadow",H.receiveShadow)),Z.isMeshGouraudMaterial&&Z.envMap!==null&&(rn.envMap.value=Pt,rn.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Z.isMeshStandardMaterial&&Z.envMap===null&&B.environment!==null&&(rn.envMapIntensity.value=B.environmentIntensity),Je&&(be.setValue(N,"toneMappingExposure",x.toneMappingExposure),Gt.needsLights&&Uh(rn,Qi),vt&&Z.fog===!0&&rt.refreshFogUniforms(rn,vt),rt.refreshMaterialUniforms(rn,Z,K,et,p.state.transmissionRenderTarget[A.id]),ho.upload(N,$i(Gt),rn,yt)),Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(ho.upload(N,$i(Gt),rn,yt),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&be.setValue(N,"center",H.center),be.setValue(N,"modelViewMatrix",H.modelViewMatrix),be.setValue(N,"normalMatrix",H.normalMatrix),be.setValue(N,"modelMatrix",H.matrixWorld),Z.isShaderMaterial||Z.isRawShaderMaterial){const ke=Z.uniformsGroups;for(let qe=0,Io=ke.length;qe<Io;qe++){const Qn=ke[qe];Zt.update(Qn,je),Zt.bind(Qn,je)}}return je}function Uh(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function Nh(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return C},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(A,B,X){const Z=ft.get(A);Z.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),ft.get(A.texture).__webglTexture=B,ft.get(A.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:X,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,B){const X=ft.get(A);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0};const Fh=N.createFramebuffer();this.setRenderTarget=function(A,B=0,X=0){R=A,w=B,C=X;let Z=!0,H=null,vt=!1,Ct=!1;if(A){const Pt=ft.get(A);if(Pt.__useDefaultFramebuffer!==void 0)q.bindFramebuffer(N.FRAMEBUFFER,null),Z=!1;else if(Pt.__webglFramebuffer===void 0)yt.setupRenderTarget(A);else if(Pt.__hasExternalTextures)yt.rebindTextures(A,ft.get(A.texture).__webglTexture,ft.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const kt=A.depthTexture;if(Pt.__boundDepthTexture!==kt){if(kt!==null&&ft.has(kt)&&(A.width!==kt.image.width||A.height!==kt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");yt.setupDepthRenderbuffer(A)}}const Xt=A.texture;(Xt.isData3DTexture||Xt.isDataArrayTexture||Xt.isCompressedArrayTexture)&&(Ct=!0);const jt=ft.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(jt[B])?H=jt[B][X]:H=jt[B],vt=!0):A.samples>0&&yt.useMultisampledRTT(A)===!1?H=ft.get(A).__webglMultisampledFramebuffer:Array.isArray(jt)?H=jt[X]:H=jt,D.copy(A.viewport),F.copy(A.scissor),k=A.scissorTest}else D.copy(bt).multiplyScalar(K).floor(),F.copy(Wt).multiplyScalar(K).floor(),k=te;if(X!==0&&(H=Fh),q.bindFramebuffer(N.FRAMEBUFFER,H)&&Z&&q.drawBuffers(A,H),q.viewport(D),q.scissor(F),q.setScissorTest(k),vt){const Pt=ft.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,Pt.__webglTexture,X)}else if(Ct){const Pt=B;for(let Xt=0;Xt<A.textures.length;Xt++){const jt=ft.get(A.textures[Xt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+Xt,jt.__webglTexture,X,Pt)}}else if(A!==null&&X!==0){const Pt=ft.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Pt.__webglTexture,X)}M=-1},this.readRenderTargetPixels=function(A,B,X,Z,H,vt,Ct,Ft=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Pt=ft.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ct!==void 0&&(Pt=Pt[Ct]),Pt){q.bindFramebuffer(N.FRAMEBUFFER,Pt);try{const Xt=A.textures[Ft],jt=Xt.format,kt=Xt.type;if(!it.textureFormatReadable(jt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-Z&&X>=0&&X<=A.height-H&&(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ft),N.readPixels(B,X,Z,H,Ot.convert(jt),Ot.convert(kt),vt))}finally{const Xt=R!==null?ft.get(R).__webglFramebuffer:null;q.bindFramebuffer(N.FRAMEBUFFER,Xt)}}},this.readRenderTargetPixelsAsync=async function(A,B,X,Z,H,vt,Ct,Ft=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Pt=ft.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ct!==void 0&&(Pt=Pt[Ct]),Pt)if(B>=0&&B<=A.width-Z&&X>=0&&X<=A.height-H){q.bindFramebuffer(N.FRAMEBUFFER,Pt);const Xt=A.textures[Ft],jt=Xt.format,kt=Xt.type;if(!it.textureFormatReadable(jt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const oe=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,oe),N.bufferData(N.PIXEL_PACK_BUFFER,vt.byteLength,N.STREAM_READ),A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+Ft),N.readPixels(B,X,Z,H,Ot.convert(jt),Ot.convert(kt),0);const ve=R!==null?ft.get(R).__webglFramebuffer:null;q.bindFramebuffer(N.FRAMEBUFFER,ve);const Ae=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await Hu(N,Ae,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,oe),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,vt),N.deleteBuffer(oe),N.deleteSync(Ae),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,B=null,X=0){const Z=Math.pow(2,-X),H=Math.floor(A.image.width*Z),vt=Math.floor(A.image.height*Z),Ct=B!==null?B.x:0,Ft=B!==null?B.y:0;yt.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,Ct,Ft,H,vt),q.unbindTexture()};const Oh=N.createFramebuffer(),zh=N.createFramebuffer();this.copyTextureToTexture=function(A,B,X=null,Z=null,H=0,vt=null){vt===null&&(H!==0?(Ms("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),vt=H,H=0):vt=0);let Ct,Ft,Pt,Xt,jt,kt,oe,ve,Ae;const Me=A.isCompressedTexture?A.mipmaps[vt]:A.image;if(X!==null)Ct=X.max.x-X.min.x,Ft=X.max.y-X.min.y,Pt=X.isBox3?X.max.z-X.min.z:1,Xt=X.min.x,jt=X.min.y,kt=X.isBox3?X.min.z:0;else{const an=Math.pow(2,-H);Ct=Math.floor(Me.width*an),Ft=Math.floor(Me.height*an),A.isDataArrayTexture?Pt=Me.depth:A.isData3DTexture?Pt=Math.floor(Me.depth*an):Pt=1,Xt=0,jt=0,kt=0}Z!==null?(oe=Z.x,ve=Z.y,Ae=Z.z):(oe=0,ve=0,Ae=0);const xe=Ot.convert(B.format),Gt=Ot.convert(B.type);let Se;B.isData3DTexture?(yt.setTexture3D(B,0),Se=N.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(yt.setTexture2DArray(B,0),Se=N.TEXTURE_2D_ARRAY):(yt.setTexture2D(B,0),Se=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);const he=N.getParameter(N.UNPACK_ROW_LENGTH),je=N.getParameter(N.UNPACK_IMAGE_HEIGHT),xi=N.getParameter(N.UNPACK_SKIP_PIXELS),Je=N.getParameter(N.UNPACK_SKIP_ROWS),Qi=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Me.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Me.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Xt),N.pixelStorei(N.UNPACK_SKIP_ROWS,jt),N.pixelStorei(N.UNPACK_SKIP_IMAGES,kt);const be=A.isDataArrayTexture||A.isData3DTexture,rn=B.isDataArrayTexture||B.isData3DTexture;if(A.isDepthTexture){const an=ft.get(A),ke=ft.get(B),qe=ft.get(an.__renderTarget),Io=ft.get(ke.__renderTarget);q.bindFramebuffer(N.READ_FRAMEBUFFER,qe.__webglFramebuffer),q.bindFramebuffer(N.DRAW_FRAMEBUFFER,Io.__webglFramebuffer);for(let Qn=0;Qn<Pt;Qn++)be&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ft.get(A).__webglTexture,H,kt+Qn),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ft.get(B).__webglTexture,vt,Ae+Qn)),N.blitFramebuffer(Xt,jt,Ct,Ft,oe,ve,Ct,Ft,N.DEPTH_BUFFER_BIT,N.NEAREST);q.bindFramebuffer(N.READ_FRAMEBUFFER,null),q.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(H!==0||A.isRenderTargetTexture||ft.has(A)){const an=ft.get(A),ke=ft.get(B);q.bindFramebuffer(N.READ_FRAMEBUFFER,Oh),q.bindFramebuffer(N.DRAW_FRAMEBUFFER,zh);for(let qe=0;qe<Pt;qe++)be?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,an.__webglTexture,H,kt+qe):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,an.__webglTexture,H),rn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,ke.__webglTexture,vt,Ae+qe):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,ke.__webglTexture,vt),H!==0?N.blitFramebuffer(Xt,jt,Ct,Ft,oe,ve,Ct,Ft,N.COLOR_BUFFER_BIT,N.NEAREST):rn?N.copyTexSubImage3D(Se,vt,oe,ve,Ae+qe,Xt,jt,Ct,Ft):N.copyTexSubImage2D(Se,vt,oe,ve,Xt,jt,Ct,Ft);q.bindFramebuffer(N.READ_FRAMEBUFFER,null),q.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else rn?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(Se,vt,oe,ve,Ae,Ct,Ft,Pt,xe,Gt,Me.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(Se,vt,oe,ve,Ae,Ct,Ft,Pt,xe,Me.data):N.texSubImage3D(Se,vt,oe,ve,Ae,Ct,Ft,Pt,xe,Gt,Me):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,vt,oe,ve,Ct,Ft,xe,Gt,Me.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,vt,oe,ve,Me.width,Me.height,xe,Me.data):N.texSubImage2D(N.TEXTURE_2D,vt,oe,ve,Ct,Ft,xe,Gt,Me);N.pixelStorei(N.UNPACK_ROW_LENGTH,he),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,je),N.pixelStorei(N.UNPACK_SKIP_PIXELS,xi),N.pixelStorei(N.UNPACK_SKIP_ROWS,Je),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Qi),vt===0&&B.generateMipmaps&&N.generateMipmap(Se),q.unbindTexture()},this.initRenderTarget=function(A){ft.get(A).__webglFramebuffer===void 0&&yt.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?yt.setTextureCube(A,0):A.isData3DTexture?yt.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?yt.setTexture2DArray(A,0):yt.setTexture2D(A,0),q.unbindTexture()},this.resetState=function(){w=0,C=0,R=null,q.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=de._getDrawingBufferColorSpace(t),e.unpackColorSpace=de._getUnpackColorSpace()}}class Hg{camera;pitch=Ue.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new U;desired=new U;aspect=1;constructor(){this.camera=new Ya(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=Ue.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const n=1-Math.pow(.001,t);this.focus.lerp(e,n),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,n=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*n*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*n*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,n){const s=Math.sin(this.yaw),o=Math.cos(this.yaw);return n.set(t*o-e*s,0,-t*s-e*o),n}}class Gg{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};ponteiro={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(Wg.has(e)||qg.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{const e=this.surface.getBoundingClientRect();if(this.ponteiro.x=(t.clientX-e.left)/e.width*2-1,this.ponteiro.y=1-(t.clientY-e.top)/e.height*2,t.pointerId!==this.stickId)return;const n=60,s=Math.max(-n,Math.min(n,t.clientX-this.stickOrigin.x)),o=Math.max(-n,Math.min(n,t.clientY-this.stickOrigin.y));this.stickX=s/n,this.stickY=o/n};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};pointer(){return{x:this.ponteiro.x,y:this.ponteiro.y}}move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const n=Math.hypot(t,e);return n>1&&(t/=n,e/=n),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const Wg=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),qg=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF","KeyH","KeyI","Tab"]),vi=["cabeca","tronco","pernas","pes"],E={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,grassDry:11059802,dirt:12159572,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,brick:13068882,wallCream:15984595,wallMint:14085344,wallAzul:13624565,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,mesaVerde:3108695,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,roupaLa:14248826,roupaLaBarra:16180168,roupaListra:4882400,roupaListraManga:15987180,roupaJeans:4151942,roupaBota:16763213,roupaBotaCano:9067050,vestidoRosa:16176088,vestidoRenda:16644080,vestidoFita:15773373,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578,pessego:16756838};let ri=null;function Xg(){if(!ri){const i=new Uint8Array([96,166,214,255]);ri=new fd(i,i.length,1,Ua),ri.minFilter=Ge,ri.magFilter=Ge,ri.generateMipmaps=!1,ri.needsUpdate=!0}return ri}const sl=new Map;function I(i,t={}){const e=`${i}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.offset??0}`,n=sl.get(e);if(n)return n;const s=new dh({color:i,gradientMap:Xg(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?mn:Bn});return t.glow&&(s.emissive=new re(i),s.emissiveIntensity=t.glow),t.offset&&(s.polygonOffset=!0,s.polygonOffsetFactor=-1,s.polygonOffsetUnits=-t.offset),sl.set(e,s),s}const ol=new Map;function Vn(i,t=1){const e=`${i}|${t}`,n=ol.get(e);if(n)return n;const s=new To({color:i,transparent:t<1,opacity:t,side:mn});return ol.set(e,s),s}const rl=new Map;function al(i){const t=rl.get(i);if(t)return t;const e=new eh({color:i});return rl.set(i,e),e}function fa(i="redonda",t=1,e=.5){const n=new ut,s=2.1*t,o=new S(new at(.13*t,.2*t,s,8),I(E.trunk));if(o.position.y=s/2,n.add(o),i==="pinheiro")for(let r=0;r<3;r++){const a=(1.1-r*.26)*t,c=new S(new ln(a,1.3*t,9),I(r===0?E.leafDark:E.leafMid));c.position.y=s*.7+r*.72*t,n.add(c)}else if(i==="palmeira"){o.scale.y=1.5,o.position.y=s*.75;for(let r=0;r<7;r++){const a=r/7*Math.PI*2,c=new S(new Ht(.75*t,8,6),I(E.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(a)*.85*t,s*1.5-.1,Math.sin(a)*.85*t),c.rotation.y=-a,c.rotation.z=-.32,n.add(c)}}else{const r=i==="florida"?E.flowerPink:E.leafMid;[[0,s+.55*t,0,1.15],[.62*t,s+.15*t,.2*t,.78],[-.5*t,s+.3*t,-.35*t,.88],[.1*t,s+1.05*t,-.3*t,.66]].forEach(([c,l,h,u],d)=>{const f=new S(new As(u*t,1),I(d%2===0?r:i==="florida"?E.flowerPink:E.leafLight));f.position.set(c,l,h),f.rotation.set(e*3,e*5,e*2),n.add(f)})}return n}function uo(i=1,t=E.bush){const e=new ut;for(let n=0;n<3;n++){const s=new S(new As(.42*i,1),I(t));s.position.set((n-1)*.36*i,.3*i+(n===1?.12:0),n%2*.18*i),e.add(s)}return e}function pa(i=6,t=.9,e=[E.flowerPink,E.flowerYellow,16777215]){const n=new ut;for(let s=0;s<i;s++){const o=s/i*Math.PI*2+s*.7,r=t*(.35+s*37%100/140),a=new S(new at(.02,.02,.3,5),I(E.leafDark));a.position.set(Math.cos(o)*r,.15,Math.sin(o)*r),n.add(a);const c=new S(new Ht(.09,8,6),I(e[s%e.length]));c.position.set(Math.cos(o)*r,.33,Math.sin(o)*r),c.scale.y=.7,n.add(c)}return n}function no(i=1,t=.5,e=10133670){const n=new ut,s=new Ha(.5*i,0),o=s.attributes.position;for(let a=0;a<o.count;a++){const c=o.getX(a),l=o.getY(a),h=o.getZ(a),u=Math.sin(Math.round(c*1e3)*12.9898+Math.round(l*1e3)*78.233+Math.round(h*1e3)*37.719+t*53.1)*43758.5453,d=1+(u-Math.floor(u)-.5)*.3;o.setXYZ(a,c*d,l*d,h*d)}s.computeVertexNormals();const r=new S(s,I(e));return r.position.y=.3*i*(.8+t*.4),r.rotation.set(t*6.28,t*4.1,t*2.2),r.scale.set(1+t*.3,.6+t*.4,1.1-t*.3),n.add(r),n}function cl(i=1,t=E.leafMid){const e=new ut,n=6;for(let s=0;s<n;s++){const o=s/n*Math.PI*2+s*.7,r=(.28+s*37%10/40)*i,a=new S(new ln(.035*i,r,5),I(s%3===0?E.leafDark:s%3===1?t:E.grassDry));a.position.set(Math.cos(o)*.11*i,r*.45,Math.sin(o)*.11*i),a.rotation.set(Math.sin(o)*.35,0,Math.cos(o)*.35),e.add(a)}return e}function Yg(i=1.2,t=7){const e=new ut;for(let n=0;n<t;n++){const s=n/t*Math.PI*2+n*1.3,o=.06+n*53%10/55,r=i*(.7+n*29%10/22),a=new S(new at(.02,.028,r,5),I(n%2?E.leafDark:E.leafMid)),c=.12+n*17%10/60;if(a.position.set(Math.cos(s)*o,r/2,Math.sin(s)*o),a.rotation.set(Math.sin(s)*c,0,Math.cos(s)*c),e.add(a),n%3===0){const l=new S(new Fn(.045,r*.16,4,8),I(9071162));l.position.set(Math.cos(s)*(o+Math.cos(s)*c*r*.5),r*.97,Math.sin(s)*(o+Math.sin(s)*c*r*.5)),e.add(l)}}return e}function jg(i=1,t=!0){const e=new ut;for(const[n,s,o]of[[0,0,.62],[.34,.2,.44]]){const r=new S(new Ht(o*i,14,6,0,Math.PI*2,0,.5),I(E.leafLight));r.scale.y=.3,r.position.set(n*i,.03,s*i),e.add(r)}if(t){const n=new S(new Ht(.08*i,8,6),I(E.flowerYellow));n.position.set(.16*i,.14*i,.08*i),e.add(n);for(let s=0;s<5;s++){const o=s/5*Math.PI*2,r=new S(new Ht(.06*i,7,5),I(16773365));r.position.set(.16*i+Math.cos(o)*.08*i,.12*i,.08*i+Math.sin(o)*.08*i),r.scale.set(1.3,.6,1.3),e.add(r)}}return e}function Jg(i=1.1,t=[E.flowerPink,E.flowerYellow,16777215,12160992],e=.5){const n=new ut,s=.24,o=new S(new at(i,i*1.05,s,18,1,!0),I(E.brick,{doubleSide:!0}));o.position.y=s/2,n.add(o);const r=new S(new Ce(i,.05,6,20),I(E.wallCream));r.rotation.x=Math.PI/2,r.position.y=s,n.add(r);const a=new S(new at(i*.96,i*.96,.08,18),I(E.dirt));a.position.y=s-.03,n.add(a);const c=7;for(let l=0;l<c;l++){const h=l/c*Math.PI*2+e*6.28,u=i*(.25+(l*41+e*100)%10/18),d=t[l%t.length],f=Math.cos(h)*u,g=Math.sin(h)*u,_=new S(new Ht(.2,8,6),I(E.leafDark));_.position.set(f,s+.06,g),_.scale.y=.55,n.add(_);for(let m=0;m<4;m++){const p=m/4*Math.PI*2+l,T=new S(new Ht(.075,8,6),I(d));T.position.set(f+Math.cos(p)*.12,s+.16+(m+l)%3*.05,g+Math.sin(p)*.12),T.scale.y=.8,n.add(T)}}return n}function Zg(i=2.6){const t=new ut,e=I(E.metalWhite),n=.26,s=new S(new at(i*1.03,i*1.06,n,20),I(E.concrete));s.position.y=n/2,t.add(s);const o=new S(new Ht(i,18,10,0,Math.PI*2,0,Math.PI/2),I(14676731,{opacity:.72,doubleSide:!0}));o.position.y=n,t.add(o);for(let h=0;h<8;h++){const u=new S(new Ce(i,.045,5,20,Math.PI),e);u.rotation.set(0,h/8*Math.PI,0),u.position.y=n,t.add(u)}for(const h of[.34,.62,.85]){const u=i*Math.sqrt(Math.max(.02,1-h*h)),d=new S(new Ce(u,.038,5,22),e);d.rotation.x=Math.PI/2,d.position.y=n+i*h,t.add(d)}for(const h of[0,1]){const u=new S(new Ce(i,.09,6,18,Math.PI-.5),e);u.rotation.x=Math.PI/2,u.rotation.z=h?Math.PI+.25:.25,u.position.y=n+.04,t.add(u)}const r=new S(new Ht(.16,10,8),e);r.position.y=n+i,t.add(r);for(let h=0;h<6;h++){const u=h/6*Math.PI*2+.3,d=i*.62,f=new S(new at(.05,.06,d,6),I(E.metalGrey));f.position.set(Math.cos(u)*i*.84,n+d/2,Math.sin(u)*i*.84),t.add(f)}const a=yh(E.wood);a.scale.setScalar(.72),a.position.set(0,n,-i*.35),a.rotation.y=.25,t.add(a);const c=new S(new at(.26,.2,.36,10),I(E.plantPot));c.position.set(i*.4,n+.18,i*.35),t.add(c);const l=new S(new As(.34,0),I(E.leafMid));return l.position.set(i*.4,n+.55,i*.35),t.add(l),t}function yh(i=E.wood){const t=new ut,e=new S(new W(1.9,.1,.55),I(i));e.position.y=.48,t.add(e);const n=new S(new W(1.9,.5,.09),I(i));n.position.set(0,.76,-.25),n.rotation.x=-.16,t.add(n);for(const s of[-1,1]){const o=new S(new W(.1,.48,.5),I(E.metalGrey));o.position.set(s*.78,.24,0),t.add(o)}return t}function dr(i=!1){const t=new ut,e=new S(new at(.07,.09,3.4,8),I(E.metalGrey));e.position.y=1.7,t.add(e);const n=new S(new Ht(.3,12,10,0,Math.PI*2,0,Math.PI*.62),I(E.metalWhite));n.position.y=3.45,n.rotation.x=Math.PI,t.add(n);const s=new S(new Ht(.2,10,8),I(i?E.gold:15263968,{glow:i?.9:0}));return s.position.y=3.32,t.add(s),t}function ll(){const i=new ut,t=new S(new at(.28,.24,.75,10),I(5208650));t.position.y=.38,i.add(t);const e=new S(new Ce(.29,.04,6,14),I(E.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,i.add(e),i}function Kg(){const i=new ut,t=new S(new W(1.9,.1,1),I(E.wood));t.position.y=.76,i.add(t);for(const e of[-1,1]){const n=new S(new W(.1,.76,.9),I(E.woodDark));n.position.set(e*.75,.38,0),i.add(n);const s=new S(new W(1.9,.08,.34),I(E.wood));s.position.set(0,.45,e*.78),i.add(s);const o=new S(new W(1.6,.45,.08),I(E.woodDark));o.position.set(0,.22,e*.78),i.add(o)}return i}function Dn(i=4,t=1.1,e=E.metalGrey){const n=new ut,s=Math.max(2,Math.round(i/1.2));for(let o=0;o<=s;o++){const r=new S(new at(.05,.05,t,6),I(e));r.position.set(-i/2+o/s*i,t/2,0),n.add(r)}for(const o of[t*.35,t*.8]){const r=new S(new W(i,.06,.06),I(e));r.position.y=o,n.add(r)}return n}function $g(i=E.wood,t=E.metalWhite){const e=new ut,n=new S(new at(.06,.06,1.6,6),I(E.woodDark));n.position.y=.8,e.add(n);const s=new S(new W(1.1,.7,.08),I(i));s.position.y=1.5,e.add(s);const o=new S(new W(.85,.12,.02),I(t));return o.position.set(0,1.62,.05),e.add(o),e}function Sh(i=1){const t=new ut,e=Vn(16777215,.92),n=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[s,o,r,a]of n){const c=new S(new Ht(a*i,10,8),e);c.position.set(s*i,o*i,r*i),t.add(c)}return t}function Qg(i,t,e,n){const s=new ut,o=9,r=i/o,a=.35,c=1.15,l=new ut;l.rotation.z=Math.PI/2;for(let d=0;d<o;d++){const f=new S(new at(t,t,r*1.02,10,1,!0,a,c),I(d%2===0?e:n,{doubleSide:!0}));f.position.y=-i/2+r*(d+.5),l.add(f)}s.add(l);const h=Math.sin(a)*t,u=Math.cos(a)*t;for(let d=0;d<o;d++){const f=new S(new Ht(r*.36,8,6),I(d%2===0?e:n));f.position.set(-i/2+r*(d+.5),h-r*.2,u),f.scale.set(1,1.15,.7),s.add(f)}return s}function ma(i=E.fabricRed,t={}){const e=new ut,n=t.tipo??"simples",s=E.wallCream,o=I(E.wood),r=I(E.woodDark),a=new S(new W(2.8,.16,1.9),r);a.position.y=.08,e.add(a);const c=new S(new W(2.35,1.7,1.4),I(s));c.position.set(0,1.01,-.05),e.add(c);for(const b of[-1,1]){const x=new S(new W(.26,1.7,.14),o);x.position.set(b*1.045,1.01,.68),e.add(x)}const l=new S(new W(2.35,.22,.14),o);l.position.set(0,1.75,.68),e.add(l);const h=new S(new W(1.82,.44,.06),I(5981750));h.position.set(0,1.42,.66),e.add(h);const u=new S(new W(2.5,.14,.78),o);u.position.set(0,1.12,.94),e.add(u);const d=new S(new at(.075,.075,2.5,10),r);d.rotation.z=Math.PI/2,d.position.set(0,1.12,1.32),e.add(d);for(const b of[-1,1]){const x=new S(new at(.05,.05,1.05,8),I(E.metalWhite));x.position.set(b*1.18,.6,1.24),e.add(x)}const f=new S(new W(2.55,.16,1.55),r);f.position.set(0,1.94,-.05),e.add(f);const g=Qg(2.5,.44,i,s);g.position.set(0,1.54,.62),e.add(g);const _=t.texto??(n==="sorvete"?"Sorvete":n==="suco"?"Sucos":""),m=new S(new W(1.75,.5,.12),I(i));m.position.set(0,2.3,-.05),e.add(m);const p=new S(new W(1.9,.62,.08),I(s));if(p.position.set(0,2.3,-.09),e.add(p),_){const b=Ja(_,1.5,.34);b.position.set(0,2.3,.02),e.add(b)}if(n==="sorvete"){const b=_a(E.morango);b.scale.setScalar(2.6),b.position.set(0,2.78,-.05),e.add(b);const x=new S(new W(1.24,.16,.56),I(E.metalWhite));x.position.set(-.58,1.26,1.06),e.add(x),[E.morango,E.maracuja,E.chocolate].forEach((w,C)=>{const R=new S(new at(.15,.13,.22,10),I(E.metalWhite));R.position.set(-1+C*.36,1.29,1.06),e.add(R);const M=new S(new Ht(.14,10,8),I(w));M.position.set(-1+C*.36,1.42,1.06),M.scale.y=.8,e.add(M)});for(let w=0;w<3;w++){const C=new S(new ln(.1,.3,10),I(14197852));C.position.set(.72,1.34+w*.07,1.04+w*.02),C.rotation.x=Math.PI,e.add(C)}}else if(n==="suco"){const b=new S(new Ht(.32,12,10),I(E.laranja));b.position.set(0,2.85,-.05),e.add(b);const x=new S(new Ht(.13,8,6),I(E.leafMid));x.position.set(.14,3.12,-.05),x.scale.set(1.5,.4,.8),x.rotation.z=.5,e.add(x),[E.laranja,E.limao].forEach((v,D)=>{const F=new S(new at(.15,.14,.42,12,1,!0),I(E.glass,{opacity:.45,doubleSide:!0}));F.position.set(-.78+D*.42,1.4,1.06),e.add(F);const k=new S(new at(.13,.12,.28,12),I(v));k.position.set(-.78+D*.42,1.33,1.06),e.add(k);const Y=new S(new at(.025,.025,.12,6),I(E.metalGrey));Y.position.set(-.78+D*.42,1.26,1.2),Y.rotation.x=Math.PI/2,e.add(Y)});const w=new S(new at(.22,.17,.12,12),I(E.plantPot));w.position.set(.42,1.25,1.06),e.add(w);const C=[[.32,1.34,1.03,E.laranja],[.52,1.34,1.08,E.limao],[.42,1.4,1.05,E.morango]];for(const[v,D,F,k]of C){const Y=new S(new Ht(.1,10,8),I(k));Y.position.set(v,D,F),e.add(Y)}const R=new S(new at(.09,.07,.2,10),I(s));R.position.set(.95,1.29,1.06),e.add(R),[E.morango,E.limao,E.fabricBlue].forEach((v,D)=>{const F=new S(new at(.014,.014,.34,6),I(v));F.position.set(.93+D*.03,1.44,1.06-D*.02),F.rotation.z=(D-1)*.18,e.add(F)})}const T=new S(new W(.06,.62,.5),I(3551276));T.position.set(1.2,1.3,.15),e.add(T);for(let b=0;b<3;b++){const x=new S(new W(.02,.045,.3-b*.06),I(s));x.position.set(1.24,1.46-b*.16,.15),e.add(x)}return e}function ga(i=4,t=6,e=4,n=E.wallCream,s=E.roofTile,o=E.glass){const r=new ut,a=new S(new W(i,t,e),I(n));a.position.y=t/2,r.add(a);const c=new S(new W(i+.3,.35,e+.3),I(s));c.position.y=t+.17,r.add(c);const l=Math.max(1,Math.floor(i/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let u=0;u<h;u++)for(let d=0;d<l;d++){const f=new S(new W(.65,.8,.06),I(o,{glow:.15})),g=-i/2+i/l*(d+.5),_=.9+t/h*u;f.position.set(g,_,e/2+.02),r.add(f);const m=f.clone();m.position.z=-e/2-.02,r.add(m)}return r}function tv(i=E.mesaVerde){const t=new ut,e=2.6,n=1.4,s=.76,o=I(16054261),r=new S(new W(e,.06,n),I(i));r.position.y=s,t.add(r);for(const l of[-n/2+.05,n/2-.05,0]){const h=new S(new W(e-.02,.008,.05),o);h.position.set(0,s+.032,l),t.add(h)}for(const l of[-e/2+.04,e/2-.04]){const h=new S(new W(.05,.008,n-.02),o);h.position.set(l,s+.032,0),t.add(h)}const a=new S(new W(.03,.19,n+.16),I(16514556,{opacity:.72,doubleSide:!0}));a.position.y=s+.13,t.add(a);const c=new S(new W(.045,.035,n+.18),I(16777215));c.position.y=s+.225,t.add(c);for(const l of[-1.5599999999999998/2,(n+.16)/2]){const h=new S(new at(.022,.022,.24,8),I(E.metalGrey));h.position.set(0,s+.12,l),t.add(h)}for(const l of[-e/2+.22,e/2-.22]){for(const u of[-n/2+.18,n/2-.18]){const d=new S(new at(.035,.045,s,8),I(E.metalGrey));d.position.set(l,s/2,u),t.add(d)}const h=new S(new W(.05,.05,n-.36),I(E.metalGrey));h.position.set(l,s*.35,0),t.add(h)}return t}function bh(){const i=new S(new Ht(.055,12,10),I(16775398,{glow:.12}));return i.castShadow=!0,i}function So(i=E.metalRed){const t=new ut,e=new S(new at(.17,.17,.035,20),I(i));e.rotation.x=Math.PI/2,t.add(e);const n=new S(new at(.185,.185,.022,20),I(E.wood));n.rotation.x=Math.PI/2,t.add(n);const s=new S(new Fn(.035,.16,4,8),I(E.woodDark));return s.position.y=-.25,t.add(s),t.traverse(o=>{const r=o;r.isMesh&&(r.castShadow=!0)}),t}function wh(i=E.frisbee){const t=new S(new at(.28,.24,.07,20),I(i));return t.castShadow=!0,t}function Eh(i=1){const t=new ut,e=I(E.heart,{glow:.35});for(const s of[-1,1]){const o=new S(new Ht(.16*i,10,8),e);o.position.set(s*.13*i,.1*i,0),t.add(o)}const n=new S(new ln(.22*i,.34*i,10),e);return n.position.y=-.1*i,n.rotation.x=Math.PI,t.add(n),t}function fr(i=16184040){const t=new ut,e=new S(new Ht(.22,10,8),I(i));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const n=new S(new at(.06,.08,.24,8),I(i));n.position.set(0,.28,.14),t.add(n);const s=new S(new Ht(.11,10,8),I(i));s.position.set(0,.4,.16),t.add(s);const o=new S(new ln(.05,.14,6),I(E.gold));return o.position.set(0,.39,.28),o.rotation.x=Math.PI/2,t.add(o),t}function va(i=E.wallCream){const t=new ut;t.userData.patins=!0;const e=.045,n=new S(new W(.13,.15,.26),I(i));n.position.set(0,e*2+.115,.01),t.add(n);const s=new S(new W(.125,.13,.15),I(i));s.position.set(0,e*2+.25,-.04),t.add(s);const o=new S(new W(.135,.04,.13),I(E.frisbee));o.position.set(0,e*2+.235,.02),t.add(o);const r=new S(new W(.1,.05,.28),I(E.metalGrey));r.position.set(0,e*2+.015,.01),t.add(r);for(const a of[-1,1])for(const c of[-1,1]){const l=new S(new at(e,e,.035,10),I(E.frisbee));l.rotation.z=Math.PI/2,l.position.set(a*.062,e,.01+c*.095),t.add(l)}return t}function ev(i=E.fabricBlue){const t=new ut,e=7.4,n=4.4,s=2.9,o=I(E.wallCream),r=I(E.wood),a=I(E.woodDark),c=I(E.metalWhite),l=new S(new W(e+1.6,.18,n+1.4),I(E.concrete));l.position.set(.4,.09,.3),t.add(l);const h=new S(new W(e,s,.26),o);h.position.set(0,.18+s/2,-n/2),t.add(h);for(const v of[-1,1]){const D=new S(new W(.26,s,n),o);D.position.set(v*(e/2-.13),.18+s/2,0),t.add(D)}const u=new S(new W(e,.6,.3),a);u.position.set(0,.48,n/2-.1),t.add(u);const d=I(E.glass,{opacity:.5,doubleSide:!0}),f=3,g=e-.5,_=g/f-.16;for(let v=0;v<f;v++){const D=-g/2+g/f*(v+.5),F=new S(new W(_,1.75,.08),d);F.position.set(D,1.68,n/2-.1),t.add(F)}for(let v=0;v<=f;v++){const D=-g/2+g/f*v,F=new S(new W(.14,2.05,.22),c);F.position.set(D,1.68,n/2-.1),t.add(F)}const m=new S(new W(e,.18,.24),c);m.position.set(0,2.68,n/2-.1),t.add(m);for(const[v,D]of[[1.15,[E.morango,E.fabricBlue,E.gold]],[1.95,[E.maracuja,E.wallCream]]]){const F=new S(new W(e-1.2,.1,.6),r);F.position.set(0,v,n/2-.75),t.add(F),D.forEach((k,Y)=>{const j=new ut;for(const tt of[-1,1]){const et=va(k);et.position.x=tt*.09,j.add(et)}j.scale.setScalar(.8),j.position.set((Y-(D.length-1)/2)*1.5,v+.05,n/2-.75),j.rotation.y=.3,t.add(j)})}const p=new S(new W(e+1.1,.24,n+1.3),a);p.position.set(0,s+.42,.35),p.rotation.x=-.07,t.add(p);const T=new S(new W(e+1.34,.08,n+1.54),c);T.position.set(0,s+.29,.35),T.rotation.x=-.07,t.add(T);const b=new S(new W(e+1.34,.74,.22),I(i));b.position.set(0,s+.46,n/2+1.18),t.add(b);const x=Ja("Patins",3.2,.46);x.position.set(0,s+.46,n/2+1.31),t.add(x);for(const v of[-1,1]){const D=new S(new at(.09,.09,s+.3,8),c);D.position.set(v*(e/2+.35),(s+.3)/2,n/2+.62),t.add(D)}const L=e/2+.95,w=new S(new W(1.15,.16,3),r);w.position.set(L,1.06,.2),t.add(w);const C=new S(new at(.08,.08,3,10),a);C.position.set(L+.55,1.06,.2),t.add(C);const R=new S(new W(.9,.9,2.8),o);R.position.set(L-.1,.6,.2),t.add(R);const M=new S(new W(1.7,.16,3.2),I(i));M.position.set(L+.1,2.35,.2),t.add(M);for(const v of[-1.2,1.5]){const D=new S(new at(.07,.07,2.35,8),c);D.position.set(L+.6,1.17,.2+v),t.add(D)}return[E.morango,E.gold].forEach((v,D)=>{const F=new ut;for(const k of[-1,1]){const Y=va(v);Y.position.x=k*.09,F.add(Y)}F.position.set(L,1.14,-.55+D*1.4),F.rotation.y=Math.PI/2+.2,t.add(F)}),t}function hl(){const i=new ut,t=new S(new W(.34,.05,.34),I(E.frisbee));t.position.y=.025,i.add(t);const e=new S(new ln(.15,.45,10),I(E.frisbee));e.position.y=.26,i.add(e);const n=new S(new at(.1,.12,.09,10),I(16777215));return n.position.y=.28,i.add(n),i}function nv(i,t,e=1.5){const n=new ut,s=I(10475752),o=.12,r=new S(new W(i,o,t),I(4165552));r.position.y=-e,r.receiveShadow=!0,n.add(r);for(const[a,c,l,h]of[[i,o,0,-t/2],[i,o,0,t/2],[o,t,-i/2,0],[o,t,i/2,0]]){const u=new S(new W(a,e,c),s);u.position.set(l,-e/2,h),u.receiveShadow=!0,n.add(u)}for(const[a,c,l,h]of[[i+.3,.18,0,-t/2-.12],[i+.3,.18,0,t/2+.12],[.18,t+.3,-i/2-.12,0],[.18,t+.3,i/2+.12,0]]){const u=new S(new W(a,.06,c),I(4951989));u.position.set(l,.02,h),n.add(u)}return n}function iv(i,t){const e=new S(new sn(i,t,12,8),new dh({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function ul(i=E.fabricBlue){const t=new ut,e=new S(new W(.68,.07,1.7),I(E.metalWhite));e.position.y=.36,t.add(e);const n=new S(new W(.6,.06,1.5),I(i));n.position.y=.42,t.add(n);const s=new S(new W(.6,.06,.7),I(i));s.position.set(0,.6,-.75),s.rotation.x=-.75,t.add(s);for(const[o,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new S(new at(.035,.035,.36,6),I(E.metalWhite));a.position.set(o*.3,.18,r*.72),t.add(a)}return t}function dl(i=E.fabricRed){const t=new ut,e=new S(new at(.32,.36,.12,12),I(E.concrete));e.position.y=.06,t.add(e);const n=new S(new at(.045,.045,2.4,8),I(E.wood));n.position.y=1.2,t.add(n);const s=new S(new ln(1.15,.5,12),I(i));s.position.y=2.35,t.add(s);const o=new S(new ln(1.17,.18,12,1,!0),I(16777215,{doubleSide:!0}));o.position.y=2.2,t.add(o);const r=new S(new Ht(.07,8,6),I(E.gold));return r.position.y=2.62,t.add(r),t}function sv(){const i=new ut;for(const t of[-.24,.24]){const e=new S(new Ce(.22,.035,6,14,Math.PI),I(E.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),i.add(e);const n=new S(new at(.035,.035,1.5,8),I(E.metalGrey));n.position.set(t,.05,-.44),i.add(n)}for(let t=0;t<3;t++){const e=new S(new W(.5,.05,.1),I(E.metalGrey));e.position.set(0,-.15-t*.34,-.44),i.add(e)}return i}function pr(i=E.frisbee){const t=new ut,e=new S(new Ce(.42,.16,10,20),I(i));e.rotation.x=Math.PI/2,t.add(e);for(let n=0;n<4;n++){const s=n/4*Math.PI*2+Math.PI/4,o=new S(new Ce(.42,.165,10,6,Math.PI/5),I(16777215));o.rotation.set(Math.PI/2,0,s),t.add(o)}return t}function ov(){const i=new ut,t=new S(new at(.22,.26,.1,12),I(E.concrete));t.position.y=.05,i.add(t);const e=new S(new at(.05,.05,2.2,8),I(E.metalGrey));e.position.y=1.1,i.add(e);const n=new S(new W(.5,.07,.07),I(E.metalGrey));n.position.set(.22,2.16,0),i.add(n);const s=new S(new at(.16,.12,.1,12),I(E.metalWhite));return s.position.set(.44,2.08,0),i.add(s),i}function rv(){const i=new ut,t=new S(new W(.7,.8,.7),I(E.concrete));t.position.y=.4,i.add(t);const e=new S(new W(.62,.1,2.4),I(15791350));e.position.set(0,.85,1),i.add(e);for(const n of[-.36,.36]){const s=new S(new Ce(.35,.04,6,14,Math.PI),I(E.metalGrey));s.position.set(n,.9,.1),s.rotation.set(0,Math.PI/2,0),i.add(s)}return i}function _a(i=E.flowerPink){const t=new ut,e=new S(new ln(.075,.22,10),I(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const n=new S(new Ht(.085,10,8),I(i));n.position.y=.13,t.add(n);const s=new S(new Ht(.06,8,7),I(i));return s.position.set(.03,.22,-.02),t.add(s),t}function fl(i=E.laranja){const t=new ut;t.userData.suco=!0;const e=new S(new at(.088,.062,.26,12),I(i));e.position.y=.13,t.add(e);const n=new S(new at(.095,.09,.035,12),I(16645110));n.position.y=.25,t.add(n);const s=new S(new at(.066,.066,.025,12),I(16645110));s.position.y=.012,t.add(s);const o=new S(new at(.012,.012,.32,6),I(16645110));o.position.set(.04,.31,.014),o.rotation.z=-.34,t.add(o);const r=new S(new at(.052,.052,.014,10),I(E.gold));return r.position.set(-.085,.26,0),r.rotation.x=Math.PI/2,r.rotation.z=.3,t.add(r),t}function pl(i=E.metalGrey){const t=new ut,e=new S(new at(.07,.09,1.5,10),I(i));e.position.y=.75,t.add(e);const n=new S(new at(.52,.38,.42,14,1,!0),I(i));n.position.y=1,t.add(n);const s=new S(new Ce(.62,.045,6,20),I(i));s.position.y=1.72,s.rotation.x=Math.PI/2,t.add(s);const o=new S(new at(.1,.1,.3,8),I(i));o.position.y=1.9,t.add(o);for(let r=0;r<10;r++){const a=r/10*Math.PI*2,c=new S(new at(.015,.015,.62,4),I(13226198));c.position.set(Math.cos(a)*.5,1.4,Math.sin(a)*.5),t.add(c)}return t}function av(){const i=new ut;for(const n of[-.8,.8]){const s=new S(new W(.12,1.5,.12),I(E.woodDark));s.position.set(n,.75,0),i.add(s)}const t=new S(new W(2,1.2,.12),I(E.wood));t.position.y=2,i.add(t);const e=new S(new W(1.8,.22,.03),I(E.frisbee));e.position.set(0,2.45,.08),i.add(e);for(const n of[-.45,.45]){const s=new S(new W(.55,.6,.03),I(2830136));s.position.set(n,1.9,.08),i.add(s)}return i}function cv(i=4){const t=new ut;for(let e=0;e<3;e++){const n=new S(new W(i,.16,.5),I(e%2===0?E.metalWhite:E.metalGrey));n.position.set(0,.25+e*.34,-e*.5),t.add(n);const s=new S(new W(i,.25+e*.34,.1),I(E.metalGrey));s.position.set(0,(.25+e*.34)/2,-e*.5-.2),t.add(s)}return t}function lv(){const i=new ut,t=new S(new W(.42,.95,.36),I(E.concrete));t.position.y=.48,i.add(t);const e=new S(new at(.17,.14,.12,12),I(E.metalWhite));e.position.set(0,1,.05),i.add(e);const n=new S(new at(.03,.03,.16,8),I(E.metalGrey));return n.position.set(0,1.12,-.06),n.rotation.x=.5,i.add(n),i}function hv(){const i=new ut,t=new S(new W(.5,.4,.34),I(4871528));t.position.y=.2,i.add(t);const e=new S(new Ce(.16,.028,6,14,Math.PI),I(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,i.add(e),[E.frisbee,6271190,16767070].forEach((s,o)=>{const r=new S(new at(.2,.18,.05,16),I(s));r.position.set(.34+o*.02,.06+o*.06,.22),r.rotation.z=.12,i.add(r)}),i}function uv(){const i=new ut,t=new S(new at(.1,.14,5.5,8),I(E.metalGrey));t.position.y=2.75,i.add(t);const e=new S(new W(.9,.1,.1),I(E.metalGrey));e.position.set(.35,5.5,0),i.add(e);for(const n of[.1,.6]){const s=new S(new W(.42,.3,.22),I(3883600));s.position.set(n,5.62,0),s.rotation.z=-.35,i.add(s);const o=new S(new W(.36,.24,.03),I(16773324,{glow:.25}));o.position.set(n+.04,5.52,0),o.rotation.z=-.35,i.add(o)}return i}function dv(){const i=new ut,t=new S(new at(.05,.06,3,8),I(E.metalGrey));t.position.y=1.5,i.add(t);const e=new ut;return e.position.y=2.9,[E.frisbee,16777215,E.frisbee,16777215].forEach((s,o)=>{const r=.26-o*.04,a=.22-o*.04,c=new S(new at(r,a,.3,12,1,!0),I(s,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+o*.3,e.add(c)}),i.add(e),i.userData.manga=e,i}function Ja(i,t,e,n="#ffffff"){const s=document.createElement("canvas");s.width=384,s.height=Math.max(64,Math.round(384*e/t));const o=s.getContext("2d");o&&(o.clearRect(0,0,s.width,s.height),o.fillStyle=n,o.font=`bold ${Math.round(s.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,o.textAlign="center",o.textBaseline="middle",o.fillText(i,s.width/2,s.height/2+4));const r=new _d(s);return r.colorSpace=en,new S(new sn(t,e),new To({map:r,transparent:!0}))}function ml(i,t=E.fabricBlue,e="#ffffff"){const n=new ut,s=new S(new at(.08,.08,2.4,8),I(E.metalGrey));s.position.y=1.2,n.add(s);const o=2.1,r=.9,a=new S(new W(o,r,.1),I(t));a.position.y=2.45,n.add(a);const c=new S(new W(o+.12,r+.12,.06),I(E.metalWhite));c.position.set(0,2.45,-.03),n.add(c);const l=Ja(i,o*.86,r*.68,e);return l.position.set(0,2.45,.06),n.add(l),n}function fv(i=4161494){const t=new ut,e=8.4,n=2.6,s=2.5,o=new S(new W(e,n,s),I(i));o.position.y=1.55,t.add(o);const r=new S(new W(e-.2,.22,s-.15),I(E.metalWhite));r.position.y=2.9,t.add(r);const a=new S(new W(e+.04,.3,s+.04),I(E.metalWhite));a.position.y=.6,t.add(a);for(const h of[s/2+.02,-s/2-.02])for(let u=0;u<4;u++){const d=new S(new W(1.5,.9,.05),I(E.glass,{glow:.12}));d.position.set(-e/2+1.4+u*1.85,2.1,h),t.add(d)}for(const[h,u]of[[e/2+.02,0],[-e/2-.02,0]]){const d=new S(new W(.05,1.1,s-.5),I(E.glass,{glow:.12}));d.position.set(h,2.1,0),d.rotation.y=u,t.add(d)}const c=new S(new W(.06,1.9,1),I(2831424));c.position.set(e/2-1.6,1.2,s/2+.02),t.add(c);const l=new S(new W(1.6,.34,.05),I(2040361));l.position.set(e/2-.4,2.75,s/2+.02),t.add(l);for(const[h,u]of[[e/2-1.9,s/2],[e/2-1.9,-s/2],[-e/2+1.6,s/2],[-e/2+1.6,-s/2]]){const d=new S(new at(.55,.55,.35,14),I(2237482));d.position.set(h,.5,u),d.rotation.x=Math.PI/2,t.add(d);const f=new S(new at(.24,.24,.38,12),I(E.metalGrey));f.position.set(h,.5,u),f.rotation.x=Math.PI/2,t.add(f)}return t}function pv(i=E.metalGrey){const t=new ut;for(const o of[-1.5,1.5]){const r=new S(new at(.07,.07,2.5,8),I(i));r.position.set(o,1.25,-.6),t.add(r)}const e=new S(new W(3.6,.12,1.6),I(i));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const n=new S(new W(3.6,1.6,.08),I(E.glass,{glow:.08}));n.position.set(0,1.35,-1.15),t.add(n);const s=new S(new W(3,.1,.4),I(E.wood));s.position.set(0,.5,-.9),t.add(s);for(const o of[-1.2,1.2]){const r=new S(new W(.08,.5,.36),I(i));r.position.set(o,.25,-.9),t.add(r)}return t}function mv(i){const t=new ut,e=i.headR,n=e*1.07,s=Math.PI*.54,o=e*.06,r=new S(new Ht(n,18,12,0,Math.PI*2,0,s),I(E.roupaLa));r.position.y=o,r.scale.y=1.16,t.add(r);const a=o+n*Math.cos(s)*1.16,c=n*Math.sin(s),l=new S(new at(c*1.03,c*1.03,e*.26,18),I(E.roupaLaBarra));l.position.y=a,t.add(l);const h=new S(new Ht(e*.2,10,8),I(E.roupaLaBarra));return h.position.y=o+n*1.16,t.add(h),t}function gv(i){const t=new ut,e=new S(new at(i.h*.05*i.w,i.h*.055*i.w,i.h*.08,12),I(E.roupaBotaCano));e.position.y=-i.legH+i.h*.075,t.add(e);const n=new S(new at(i.h*.058*i.w,i.h*.058*i.w,i.h*.018,12),I(E.roupaBota));return n.position.y=-i.legH+i.h*.113,t.add(n),t}function fo(i,t,e=t){const n=new ut;for(const o of[-1,1]){const r=new S(new Ht(i*.62,8,6),I(t));r.position.x=o*i*.72,r.scale.set(1,.78,.5),n.add(r);const a=new S(new W(i*.34,i*1.5,i*.14),I(t));a.position.set(o*i*.42,-i*.95,0),a.rotation.z=o*.32,n.add(a)}const s=new S(new Ht(i*.3,8,6),I(e));return s.scale.z=.7,n.add(s),n}function vv(i){const t=new ut,{h:e,w:n}=i,s=i.legH,o=e*.105*n,r=.85,a=I(E.vestidoRosa),c=I(E.vestidoRenda,{doubleSide:!0}),l=I(E.vestidoFita),h=new S(new at(o*1.1,o*1.06,e*.035,18,1,!0),c);h.position.y=s+i.torsoH*.78,h.scale.z=r,t.add(h);for(const x of[-1,1]){const L=new S(new Ce(e*.042*n,e*.016,6,14),c);L.position.set(x*e*.1*n,s+i.torsoH*.84,0),L.rotation.set(Math.PI/2,0,x*.3),L.scale.z=.8,t.add(L)}const u=fo(e*.04,E.vestidoFita,E.vestidoRenda);u.position.set(0,s+i.torsoH*.62,o*.9),t.add(u);const d=new S(new at(o*1.08,o*1.08,e*.03,18,1,!0),l);d.position.y=s+i.torsoH*.16,d.scale.z=r,t.add(d);const f=fo(e*.036,E.vestidoRosa,E.vestidoFita);f.position.set(0,s+i.torsoH*.14,o*.92),t.add(f);const g=s+i.torsoH*.1,_=s-e*.13,m=o*2,p=new S(new at(o*1.02,m*.82,g-_-e*.05,20,1,!0),a);p.position.y=(g+_+e*.05)/2,p.scale.z=r,t.add(p);const T=new S(new at(m*.78,m,e*.08,20,1,!0),a);T.position.y=_+e*.04,T.scale.z=r,t.add(T);const b=new S(new at(m*1.04,m*1.12,e*.032,20,1,!0),c);b.position.y=_,b.scale.z=r,t.add(b);for(const x of[-.9,0,.9]){const L=fo(e*.022,E.vestidoFita,E.vestidoRenda);L.position.set(Math.sin(x)*m*.92,_+e*.055,Math.cos(x)*m*.92*r),L.rotation.y=x,t.add(L)}return t}function _v(i){const t=new ut,n=-i.headR*.98,s=new S(new at(i.h*.043,i.h*.045,i.h*.026,14,1,!0),I(E.vestidoRenda,{doubleSide:!0}));s.position.y=n,t.add(s);const o=fo(i.h*.026,E.vestidoFita,E.vestidoRenda);return o.position.set(0,n,i.h*.044),t.add(o),t}const pe={sorveteMorango:{id:"sorvete-morango",nome:"Sorvete de morango",icone:"🍦",tipo:"mao",nota:"do Ari",holdPose:"upright"},sorveteMaracuja:{id:"sorvete-maracuja",nome:"Sorvete de maracujá",icone:"🍦",tipo:"mao",nota:"do Renan",holdPose:"upright"},sucoPessego:{id:"suco-pessego",nome:"Suco de pêssego",icone:"🥤",tipo:"mao",nota:"do Ari",holdPose:"upright"},sucoMorango:{id:"suco-morango",nome:"Suco de morango",icone:"🥤",tipo:"mao",nota:"do Renan",holdPose:"upright"},chapeuPingPong:{id:"chapeu-ping-pong",nome:"Chapéu de campeão",icone:"👑",tipo:"vestivel",slot:"cabeca",nota:"ping pong, 5 a 0"},patins:{id:"patins",nome:"Patins",icone:"🛼",tipo:"vestivel",slot:"pes",nota:"da lojinha do parque"},gorroDeLa:{id:"gorro-la",nome:"Gorro de lã",icone:"🧢",tipo:"vestivel",slot:"cabeca",cor:E.roupaLa,corDetalhe:E.roupaLaBarra,nota:"para o frio que nunca faz",cobreCabelo:!0,extra:mv},camisaListrada:{id:"camisa-listrada",nome:"Camisa listrada",icone:"👕",tipo:"vestivel",slot:"tronco",cor:E.roupaListra,corDetalhe:E.roupaListraManga,nota:"mangas claras"},calcaJeans:{id:"calca-jeans",nome:"Calça jeans",icone:"👖",tipo:"vestivel",slot:"pernas",cor:E.roupaJeans,nota:"a de sempre"},vestidoRosa:{id:"vestido-rosa",nome:"Vestido rosa de babados",icone:"👗",tipo:"vestivel",slot:"tronco",cor:E.vestidoRosa,corDetalhe:E.vestidoRenda,nota:"da vitrine que o Renan viu",bracosNus:!0,pernasNuas:!0,extra:vv},gargantilhaDeLaco:{id:"gargantilha-laco",nome:"Gargantilha de laço",icone:"🎀",tipo:"vestivel",slot:"cabeca",cor:E.vestidoFita,nota:"combina com o vestido",extra:_v},botaAmarela:{id:"bota-amarela",nome:"Bota amarela",icone:"🥾",tipo:"vestivel",slot:"pes",cor:E.roupaBota,corDetalhe:E.roupaBotaCano,nota:"chama atenção de longe",extra:gv},frisbee:{id:"frisbee",nome:"Frisbee",icone:"🥏",tipo:"mao",nota:"do parque",holdPose:"relaxed"}},xv={"sorvete-morango":()=>_a(E.morango),"sorvete-maracuja":()=>_a(E.maracuja),"suco-pessego":()=>fl(E.pessego),"suco-morango":()=>fl(E.morango),frisbee:()=>wh(E.frisbee)},Mv=Object.fromEntries(Object.values(pe).map(i=>[i.id,i]));function xa(i){return Mv[i]??null}function yv(i){const t=xv[i]?.();return t?(t.userData.item=i,t):null}const Un=10,Es=4;function po(i,t){return t==="mao"||i.tipo==="vestivel"}function mo(i){return i.slot?vi.indexOf(i.slot):-1}function bo(i){return Array.from({length:i},()=>null)}function Th(){return{mao:bo(Un),ativo:0,vestiveis:bo(Es)}}function Sv(i,t){const e={},n=t&&typeof t=="object"?t:{},s=new Set([...Object.keys(i??{}),...Object.keys(n)]);for(const o of s)e[o]=bv((i??{})[o],n[o]);return e}function bv(i,t){const e=Th();if(!i&&!t)return e;const n=(a,c,l)=>{const h=bo(c);if(!Array.isArray(a))return h;for(let u=0;u<c;u++){const d=a[u];if(!d||typeof d.id!="string"){h[u]=null;continue}const f=xa(d.id),g=f?{...d,...f}:d;h[u]=po(g,l)?g:null}return h},s=typeof i?.ativo=="number"?Math.floor(i.ativo):0,o=n(i?.vestiveis,Es,"vestivel"),r=bo(Es);for(const a of o){if(!a)continue;const c=mo(a);c>=0&&r[c]===null&&(r[c]=a)}if(t&&typeof t=="object")for(const[a,c]of Object.entries(t)){if(typeof c!="string")continue;const l=xa(c);if(!l||l.slot!==a)continue;const h=vi.indexOf(a);h>=0&&r[h]===null&&(r[h]=l)}return{mao:n(i?.mao,Un,"mao"),ativo:s>=0&&s<Un?s:0,vestiveis:r}}const gl="aristory.save.v1",mr={version:1,scene:"",flags:{},memories:[],stats:{},inventarios:{}};class Za{data;constructor(){this.data=Za.read()}static read(){try{const t=localStorage.getItem(gl);if(!t)return structuredClone(mr);const e=JSON.parse(t),n=e.loadouts;return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{},inventarios:Sv(e.inventarios,n)}}catch{return structuredClone(mr)}}persist(){try{localStorage.setItem(gl,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}de(t){let e=this.data.inventarios[t];return e||(e=Th(),this.data.inventarios[t]=e),e}maos(t){return this.de(t).mao}vestiveis(t){return this.de(t).vestiveis}loadout(t){const e={};return this.de(t).vestiveis.forEach((n,s)=>{n&&(e[vi[s]]=n.id)}),e}slotAtivo(t){return this.de(t).ativo}setSlotAtivo(t,e){e<0||e>=Un||(this.de(t).ativo=e,this.persist())}itemAtivo(t){const e=this.de(t);return e.mao[e.ativo]??null}achouItem(t,e){const n=this.de(t);return n.mao.some(s=>s?.id===e)||n.vestiveis.some(s=>s?.id===e)}pegar(t,e){if(this.achouItem(t,e.id))return"repetido";if(e.tipo==="vestivel"&&this.vestir(t,e))return"guardado";const n=this.de(t);if(n.mao[n.ativo]===null)return n.mao[n.ativo]=e,this.persist(),"mao";for(let s=1;s<Un;s++){const o=(n.ativo+s)%Un;if(n.mao[o]===null)return n.mao[o]=e,this.persist(),"guardado"}return"cheio"}guardar(t,e){if(this.achouItem(t,e.id))return"repetido";const n=this.de(t);if(n.mao[n.ativo]===null)return n.mao[n.ativo]=e,this.persist(),"mao";for(let s=1;s<Un;s++){const o=(n.ativo+s)%Un;if(n.mao[o]===null)return n.mao[o]=e,this.persist(),"guardado"}return"cheio"}vestir(t,e){if(!po(e,"vestivel")||this.achouItem(t,e.id))return!1;const n=mo(e);if(n<0)return!1;const s=this.de(t).vestiveis;return s[n]!==null?!1:(s[n]=e,this.persist(),!0)}despir(t,e){e<0||e>=Es||(this.de(t).vestiveis[e]=null,this.persist())}mover(t,e,n){const s=this.de(t),o=u=>u.lista==="mao"?s.mao:s.vestiveis,r=u=>u.indice>=0&&u.indice<(u.lista==="mao"?Un:Es);if(!r(e)||!r(n)||e.lista===n.lista&&e.indice===n.indice)return!1;const a=o(e),c=o(n),l=a[e.indice];if(!l||!po(l,n.lista)||n.lista==="vestivel"&&mo(l)!==n.indice)return!1;const h=c[n.indice];return h&&!po(h,e.lista)||e.lista==="vestivel"&&h&&mo(h)!==e.indice?!1:(c[n.indice]=l,a[e.indice]=h??null,this.persist(),!0)}largar(t,e){const n=this.de(t);let s=!1;for(const o of[n.mao,n.vestiveis]){const r=o.findIndex(a=>a?.id===e);r>=0&&(o[r]=null,s=!0)}return s&&this.persist(),s}reset(){this.data=structuredClone(mr),this.persist()}}class wv{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;menu;placar;mochila;armario;boneco;corpo;acervo;donoArmario;slotsMao;slotsVestivel;dono;descarte;pegou=null;tipoNaPinca;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchHold=null;onRestart=null;onToggleSom=null;som=null;hintsTimer=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
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
    `,t.appendChild(e);const n=document.createElement("div");n.className="boot",n.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(n),this.boot=n,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.menu=e.querySelector(".menu"),this.placar=e.querySelector(".placar"),this.mochila=e.querySelector(".mochila"),this.slotsMao=e.querySelector(".mochila .maos"),this.slotsVestivel=e.querySelector(".mochila .vestiveis"),this.dono=e.querySelector(".mochila .dono"),this.descarte=e.querySelector(".mochila .descarte"),this.armario=e.querySelector(".armario"),this.boneco=e.querySelector(".armario .boneco"),this.corpo=e.querySelector(".armario .corpo"),this.acervo=e.querySelector(".armario .acervo"),this.donoArmario=e.querySelector(".armario .dono"),this.dialogue.addEventListener("click",o=>{o.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",o=>{o.target===this.journal&&this.closeJournal()});const s=e.querySelector(".action-btn");s.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),s.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const o of["pointerup","pointercancel","pointerleave"])s.addEventListener(o,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),e.querySelector(".bag-btn").addEventListener("click",()=>this.toggleMochila()),e.querySelector(".mochila .close").addEventListener("click",()=>this.closeMochila()),e.querySelector(".armario .close").addEventListener("click",()=>this.fecharArmario()),this.armario.addEventListener("click",o=>{o.target===this.armario&&this.fecharArmario()}),this.ligarGiroDoBoneco(),e.querySelector(".mochila .descartar").addEventListener("click",()=>{this.som?.("escolha"),this.descarte.classList.add("confirmando")}),e.querySelector(".mochila .descartar-sim").addEventListener("click",()=>{const o=this.pegou;this.pegou=null,this.tipoNaPinca=void 0,this.marcarPego(null),o&&this.onDescartar?.(o)}),this.mochila.addEventListener("click",o=>{o.target===this.mochila&&this.closeMochila()});for(const o of[this.slotsMao,this.slotsVestivel])o.addEventListener("click",r=>this.tocarVaga(r)),o.addEventListener("dragstart",r=>this.comecarArrasto(r)),o.addEventListener("dragover",r=>this.arrastarSobre(r)),o.addEventListener("dragleave",r=>{r.target.closest(".slot")?.classList.remove("alvo")}),o.addEventListener("drop",r=>this.soltarArrasto(r)),o.addEventListener("dragend",()=>this.limparArrasto());e.querySelector(".menu-btn").addEventListener("click",()=>this.toggleMenu()),e.querySelector(".menu .som-btn").addEventListener("click",()=>this.onToggleSom?.()),e.querySelector(".menu .controles-btn").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.add("vendo-controles")}),e.querySelector(".menu .controles .voltar").addEventListener("click",()=>{this.som?.("escolha"),this.menu.classList.remove("vendo-controles")}),e.querySelector(".menu .close").addEventListener("click",()=>this.closeMenu()),e.querySelector(".menu .recomecar").addEventListener("click",()=>{this.menu.classList.add("perguntando")}),e.querySelector(".menu .nao").addEventListener("click",()=>{this.menu.classList.remove("perguntando")}),e.querySelector(".menu .sim").addEventListener("click",()=>{this.closeMenu(),this.onRestart?.()}),this.menu.addEventListener("click",o=>{o.target===this.menu&&this.closeMenu()}),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),this.showHints()}get menuOpen(){return this.menu.classList.contains("show")}toggleMenu(){this.som?.("menu"),this.menuOpen?this.closeMenu():(this.closeJournal(),this.closeMochila(),this.menu.classList.add("show")),this.marcarTelaAberta()}closeMenu(){this.menu.classList.remove("show"),this.menu.classList.remove("perguntando"),this.menu.classList.remove("vendo-controles"),this.marcarTelaAberta()}marcarTelaAberta(){document.body.classList.toggle("tela-aberta",this.menuOpen||this.journalOpen||this.mochilaOpen||this.armarioOpen)}setSom(t){const e=this.menu.querySelector(".som-btn");e.textContent=t?"🔊 Som ligado":"🔇 Som desligado",e.classList.toggle("desligado",!t)}showHints(){this.hints.classList.remove("hide"),this.hintsTimer&&window.clearTimeout(this.hintsTimer),this.hintsTimer=window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){const n=this.prompt.querySelector(".label").textContent;this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,(!this.prompt.classList.contains("show")||n!==e)&&this.som?.("prompt"),this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showPlacar(t){if(!t){this.placar.classList.remove("show");return}this.placar.querySelector(".eu").textContent=t.eu,this.placar.querySelector(".ele").textContent=t.ele,this.placar.querySelector(".nums").textContent=`${t.meus} × ${t.dele}`,this.placar.classList.add("show")}showCharge(t){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const e=this.carga.querySelector(".barra");e.style.width=`${Math.max(0,Math.min(1,t))*100}%`}toast(t,e="💛"){const n=document.createElement("div");n.className="toast",n.innerHTML=`<span>${e}</span><span></span>`,n.querySelector("span:last-child").textContent=t,this.toasts.appendChild(n),window.setTimeout(()=>n.classList.add("fade"),2600),window.setTimeout(()=>n.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(n=>{let s=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const o=()=>{this.type(t[s])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[s];return}if(s+=1,s>=t.length){this.dialogue.classList.remove("show"),this.advance=null,n();return}o()},o()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,e%3===1&&t[e-1]!==" "&&this.som?.("fala"),this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,n=""){return new Promise(s=>{this.dialogueWho.textContent=n,this.dialogueWho.style.display=n?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=o=>{this.som?.("confirma"),this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),s(o)},e.forEach((o,r)=>{const a=document.createElement("button");a.type="button",a.textContent=o,a.addEventListener("click",()=>this.escolher?.(r)),this.escolhas.appendChild(a)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,n)=>e.classList.toggle("sel",n===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.som?.("escolha"),this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.som?.("escolha"),this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const n=document.createElement("div");n.className="memory",n.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',n.querySelector(".icon").textContent=e.icon,n.querySelector("b").textContent=e.title,n.querySelector("small").textContent=e.place,n.querySelector("p").textContent=e.note,this.journalGrid.appendChild(n)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.som?.("diario"),this.journalOpen?this.closeJournal():(this.closeMochila(),this.journal.classList.add("show")),this.marcarTelaAberta()}closeJournal(){this.journal.classList.remove("show"),this.marcarTelaAberta()}get mochilaOpen(){return this.mochila.classList.contains("show")}toggleMochila(){this.som?.("diario"),this.mochilaOpen?this.closeMochila():(this.closeJournal(),this.onAbrirMochila?.(),this.mochila.classList.add("show")),this.marcarTelaAberta()}closeMochila(){this.mochila.classList.remove("show"),this.marcarTelaAberta()}renderMochila(t,e,n,s){this.dono.textContent=`de ${s}`,this.pegou=null,this.tipoNaPinca=void 0,this.mochila.classList.remove("movendo"),this.descarte.classList.remove("show","confirmando");const o=["Cabeça","Tronco","Pernas","Pés"],r=(a,c,l,h=!1)=>{a.innerHTML="",c.forEach((u,d)=>{const f=document.createElement("button");f.className="slot",f.dataset.slot=String(d),f.classList.toggle("cheio",u!==null),f.classList.toggle("principal",d===l),f.draggable=u!==null,u?f.dataset.tipo=u.tipo:delete f.dataset.tipo;const g=h?`<em class="parte">${o[d]}</em>`:"";f.innerHTML=g+(u?`<span class="icone">${u.icone}</span><b>${u.nome}</b>`+(u.nota?`<small>${u.nota}</small>`:""):'<span class="icone vazio">·</span><b>vazio</b>'),a.appendChild(f)})};r(this.slotsMao,t,n),r(this.slotsVestivel,e,-1,!0)}get armarioOpen(){return this.armario.classList.contains("show")}abrirArmario(){this.armarioOpen||(this.som?.("escolha"),this.onAbrirArmario?.(),this.armario.classList.add("show"),this.marcarTelaAberta())}fecharArmario(){this.armarioOpen&&(this.armario.classList.remove("show"),this.marcarTelaAberta(),this.onFecharArmario?.())}canvasDoBoneco(){return this.boneco}renderArmario(t,e,n){this.donoArmario.textContent=`de ${n}`;const s=["Cabeça","Tronco","Pernas","Pés"];if(this.corpo.innerHTML="",t.forEach((o,r)=>{const a=document.createElement("button");a.className="parte",a.classList.toggle("cheio",o!==null),a.dataset.parte=String(r),a.innerHTML=`<small>${s[r]}</small>`+(o?`<span class="icone">${o.icone}</span><b>${o.nome}</b><em>tirar</em>`:'<span class="icone vazio">·</span><b>vazio</b>'),this.corpo.appendChild(a)}),this.acervo.innerHTML="",e.length===0){const o=document.createElement("p");o.className="nada",o.textContent="Nada guardado — está tudo no corpo.",this.acervo.appendChild(o)}for(const o of e){const r=document.createElement("button");r.className="peca",r.dataset.id=o.id,r.innerHTML=`<span class="icone">${o.icone}</span><b>${o.nome}</b>`+(o.nota?`<small>${o.nota}</small>`:""),this.acervo.appendChild(r)}}onTirarParte=null;onVestirPeca=null;onAbrirArmario=null;onFecharArmario=null;onGirarBoneco=null;ligarGiroDoBoneco(){let t=!1,e=0;this.boneco.addEventListener("pointerdown",n=>{t=!0,e=n.clientX,this.boneco.setPointerCapture(n.pointerId)}),this.boneco.addEventListener("pointermove",n=>{t&&(this.onGirarBoneco?.((n.clientX-e)*.012),e=n.clientX)});for(const n of["pointerup","pointercancel"])this.boneco.addEventListener(n,()=>{t=!1});this.corpo.addEventListener("click",n=>{const s=n.target.closest(".parte");!s?.dataset.parte||!s.classList.contains("cheio")||this.onTirarParte?.(Number(s.dataset.parte))}),this.acervo.addEventListener("click",n=>{const s=n.target.closest(".peca");s?.dataset.id&&this.onVestirPeca?.(s.dataset.id)})}onEscolherSlot=null;onMoverItem=null;onDescartar=null;onAbrirMochila=null;podeIrPara(t,e){return!t||t==="vestivel"&&e==="mao"?!0:t==="mao"&&e==="vestivel"?(this.toast("Este item não pode ser vestido","🚫"),!1):!0}endereco(t){const e=t.closest(".slot");return e?.dataset.slot?{lista:e.closest(".vestiveis")?"vestivel":"mao",indice:Number(e.dataset.slot)}:null}tocarVaga(t){const e=this.endereco(t.target);if(!e)return;if(this.pegou){const s=this.pegou;if(s.lista===e.lista&&s.indice===e.indice){this.pegou=null,this.marcarPego(null);return}if(!this.podeIrPara(this.tipoNaPinca,e.lista))return;this.pegou=null,this.marcarPego(null),this.onMoverItem?.(s,e)&&this.som?.("escolha");return}const n=t.target.closest(".slot");if(e.lista==="mao"&&!n.classList.contains("cheio")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}if(n.classList.contains("cheio")){if(e.lista==="mao"&&!n.classList.contains("principal")){this.som?.("escolha"),this.onEscolherSlot?.(e.indice);return}this.pegou=e,this.tipoNaPinca=n.dataset.tipo,this.marcarPego(n),this.som?.("escolha")}}marcarPego(t){for(const s of this.mochila.querySelectorAll(".slot.pego"))s.classList.remove("pego");t?.classList.add("pego"),this.mochila.classList.toggle("movendo",t!==null),this.descarte.classList.toggle("show",t!==null),this.descarte.classList.remove("confirmando");const e=this.descarte.querySelector(".descartar"),n=t?.querySelector("b")?.textContent??"";e.textContent=n?`🗑 Descartar ${n}`:"🗑 Descartar"}comecarArrasto(t){const e=this.endereco(t.target),n=t.target.closest(".slot");if(!e||!n?.classList.contains("cheio")){t.preventDefault();return}t.dataTransfer?.setData("text/plain",JSON.stringify({vaga:e,tipo:n.dataset.tipo})),t.dataTransfer&&(t.dataTransfer.effectAllowed="move"),n.classList.add("pego")}arrastarSobre(t){const e=t.target.closest(".slot");e&&(t.preventDefault(),t.dataTransfer&&(t.dataTransfer.dropEffect="move"),e.classList.add("alvo"))}soltarArrasto(t){t.preventDefault();const e=this.endereco(t.target),n=t.dataTransfer?.getData("text/plain");if(this.limparArrasto(),!(!e||!n))try{const{vaga:s,tipo:o}=JSON.parse(n);if(!this.podeIrPara(o,e.lista))return;this.onMoverItem?.(s,e)&&this.som?.("escolha")}catch{}}limparArrasto(){for(const t of this.mochila.querySelectorAll(".slot.pego, .slot.alvo"))t.classList.remove("pego","alvo")}}function Ma(i,t,e){for(const n of e)if(n.kind==="circle"){const s=i.x-n.x,o=i.z-n.z,r=t+n.r,a=s*s+o*o;if(a>=r*r||a===0)continue;const c=Math.sqrt(a),l=(r-c)/c;i.x+=s*l,i.z+=o*l}else{const s=Math.cos(-n.rot),o=Math.sin(-n.rot),r=i.x-n.x,a=i.z-n.z,c=r*s-a*o,l=r*o+a*s,h=Math.max(-n.hw,Math.min(n.hw,c)),u=Math.max(-n.hd,Math.min(n.hd,l));let d=c-h,f=l-u,g=d*d+f*f;if(g>t*t)continue;if(g===0){const T=n.hw-Math.abs(c),b=n.hd-Math.abs(l);T<b?(d=Math.sign(c)||1,f=0,g=0):(d=0,f=Math.sign(l)||1);const x=d!==0?Math.sign(d)*(n.hw+t):c,L=f!==0?Math.sign(f)*(n.hd+t):l;i.x=n.x+(x*Math.cos(n.rot)-L*Math.sin(n.rot)),i.z=n.z+(x*Math.sin(n.rot)+L*Math.cos(n.rot));continue}const _=Math.sqrt(g),m=h+d/_*t,p=u+f/_*t;i.x=n.x+(m*Math.cos(n.rot)-p*Math.sin(n.rot)),i.z=n.z+(m*Math.sin(n.rot)+p*Math.cos(n.rot))}}function ya(i,t,e){i.x=Math.max(e.minX+t,Math.min(e.maxX-t,i.x)),i.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,i.z))}const Ah=1.3;class Ev{object=new ut;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new U;body;locked=!1;riding=!1;submersion=0;patins=!1;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,n=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=n,t.setFacing(n),this.object.add(t.group),this.body=t,e}get chest(){return new U(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,n=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=n,this.body.setFacing(n)}setVisible(t){this.object.visible=t}update(t,e,n,s){if(this.riding){this.body.update(e,0);return}const o=this.submersion>.05,r=this.patins&&!o?Ah:1,a=o?this.maxSpeed*.55:this.maxSpeed*r;if(!this.locked&&t.lengthSq()>1e-4){const l=t.clone().normalize();this.velocity.x+=l.x*this.accel*e,this.velocity.z+=l.z*this.accel*e;const h=Math.hypot(this.velocity.x,this.velocity.z);h>a&&(this.velocity.x=this.velocity.x/h*a,this.velocity.z=this.velocity.z/h*a),this.body.setFacing(Math.atan2(l.x,l.z))}else{const l=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(l),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,Ma(this.position,this.radius,n),ya(this.position,this.radius,s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(o),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class Tv{object=new ut;position;radius=.4;maxSpeed=5;velocity=new U;dir=new U;body;aoLado=0;folga=2;ordem=null;riding=!1;submersion=0;patins=!1;lado=0;distancia=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,n=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=n,t.setFacing(n),this.object.add(t.group),this.body=t,e}teleport(t,e,n=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=n,this.body.setFacing(n)}setVisible(t){this.object.visible=t}atrelar(t,e){this.lado=t,this.distancia=e,this.ordem=null}soltar(){this.lado=0}get atrelado(){return this.lado!==0}goTo(t,e){this.ordem=new U(t,0,e)}clearOrder(){this.ordem=null}hold(t,e){this.ordem?this.ordem.set(this.position.x,0,this.position.z):this.ordem=new U(this.position.x,0,this.position.z),this.velocity.set(0,0,0),this.body.setFacing(Math.atan2(t-this.position.x,e-this.position.z))}get hasOrder(){return this.ordem!==null}rebocar(t,e,n,s){const o=this.aoLado,r=t.x+Math.sin(o+Math.PI/2)*this.distancia*this.lado,a=t.z+Math.cos(o+Math.PI/2)*this.distancia*this.lado,c=this.position.x,l=this.position.z,h=Math.min(1,e*16);this.position.x+=(r-this.position.x)*h,this.position.z+=(a-this.position.z)*h,Ma(this.position,this.radius,n),ya(this.position,this.radius,s),this.velocity.set((this.position.x-c)/Math.max(e,1e-4),0,(this.position.z-l)/Math.max(e,1e-4)),this.body.setFacing(o),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}set direcaoDoPar(t){this.aoLado=t}update(t,e,n,s){if(this.riding){this.body.update(e,0);return}if(this.lado!==0){this.rebocar(t,e,n,s);return}const o=this.ordem??t,r=this.ordem?.55:this.folga;this.dir.set(o.x-this.position.x,0,o.z-this.position.z);const a=this.dir.length();if(!this.ordem&&a>22){this.teleport(o.x-1.2,o.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(a>r){this.dir.normalize();const d=this.maxSpeed*(this.patins?Ah:1),f=Math.min(d,1.6+(a-r)*2.2);this.velocity.x+=(this.dir.x*f-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*f-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),a>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,Ma(this.position,this.radius,n),ya(this.position,this.radius,s);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),u=.86;if(h<u&&h>1e-4){const d=(u-h)/h;this.position.x+=c*d,this.position.z+=l*d}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}const Av=1.7;class Cv{grupo=new ut;vivos=[];constructor(t){t.add(this.grupo)}soltar(t,e,n,s=1.62){const o=Eh(.6);o.userData.coracao=!0,o.position.set(t.x+e,s,t.z+n),this.grupo.add(o),this.vivos.push({obj:o,vida:0,giro:Math.random()*Math.PI,fx:e,fz:n})}limpar(){for(const t of this.vivos)this.grupo.remove(t.obj);this.vivos.length=0}update(t){for(let e=this.vivos.length-1;e>=0;e--){const n=this.vivos[e];n.vida+=t;const s=n.vida/Av;if(s>=1){this.grupo.remove(n.obj),this.vivos.splice(e,1);continue}n.obj.position.y+=t*.72;const o=(.7+Math.sin(n.vida*3+n.giro)*.25)*t;n.obj.position.x+=n.fx*o,n.obj.position.z+=n.fz*o,n.obj.rotation.y=n.giro+n.vida*1.4;const r=s<.18?s/.18:Math.min(1,(1-s)/.35);n.obj.scale.setScalar(.25+r*.9)}}}const Rv=1.5,vl=.9,_l=1.16,fi=.32,Sa=.42,Ch=.34,Pv=fi+Sa+Ch,Iv=.5;class Lv{constructor(t){this.coracoes=t}t=-1;descanso=0;alvoA=new U;alvoB=new U;soltouCoracao=!1;onSom=null;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!Uv(t,e))return!1;const n=e.position.x-t.position.x,s=e.position.z-t.position.z,o=Math.hypot(n,s);if(o>Rv||o<.01)return!1;const r=Math.atan2(n,s);return Math.abs(gr(t.rig.facing,r))<vl&&Math.abs(gr(e.rig.facing,r+Math.PI))<vl}iniciar(t,e,n){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const s=e.position.x-t.position.x,o=e.position.z-t.position.z,r=Math.atan2(s,o),a=n+Math.PI/2,c=Math.abs(gr(r,a))<Math.PI/2?a:a+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,u=Math.sin(c)*_l/2,d=Math.cos(c)*_l/2;this.alvoA.set(l-u,0,h-d),this.alvoB.set(l+u,0,h+d),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0)}update(t,e,n){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const s=Dv(this.t);if(e.rig.setKiss(s),n.rig.setKiss(s),e.locked=!0,this.t<fi){const o=Math.min(1,t*9);e.position.lerp(this.alvoA,o),n.position.lerp(this.alvoB,o)}if(!this.soltouCoracao&&this.t>=fi*.9){this.soltouCoracao=!0;const o=Math.atan2(n.position.x-e.position.x,n.position.z-e.position.z),r=Math.sin(o),a=Math.cos(o);this.coracoes.soltar(e.position,-r,-a),this.coracoes.soltar(n.position,r,a),this.onSom?.("beijo"),this.onSom?.("coracao")}this.t>=Pv&&(this.t=-1,this.descanso=Iv,e.rig.setKiss(0),n.rig.setKiss(0),e.locked=!1)}}}function Dv(i){return i<fi?xl(i/fi):i<fi+Sa?1:xl(Math.max(0,1-(i-fi-Sa)/Ch))}function xl(i){return i*i*(3-2*i)}function Uv(i,t){const e=i.rig.spec,n=t.rig.spec;return e.casal===!0&&n.casal===!0&&e.id!==n.id}function gr(i,t){return Math.atan2(Math.sin(i-t),Math.cos(i-t))}const Nv=.95,Fv=1.8,Ov=2.2,zv=.5,Ml=3;class Bv{constructor(t){this.coracoes=t}lado=1;ligado=!1;relogio=0;longe=0;onSom=null;get ativo(){return this.ligado}disponivel(t,e){if(this.ligado||t.riding||e.riding||t.submersion>.05||e.submersion>.05||t.locked||e.hasOrder)return!1;const n=Math.hypot(e.position.x-t.position.x,e.position.z-t.position.z);return n>.01&&n<=Fv}ligar(t,e){if(this.ligado)return;this.ligado=!0,this.relogio=0,this.longe=0;const n=t.rig.facing,s=e.position.x-t.position.x,o=e.position.z-t.position.z;this.lado=s*Math.sin(n+Math.PI/2)+o*Math.cos(n+Math.PI/2)<0?-1:1,this.aplicar(t,e),this.onSom?.("escolha")}soltar(t,e){this.ligado&&(this.ligado=!1,e.soltar(),t.rig.setHoldingHands(0),e.rig.setHoldingHands(0))}trocouCorpos(t,e){this.ligado&&(this.lado=this.lado===1?-1:1,this.aplicar(t,e))}update(t,e,n){if(!this.ligado)return;if(e.riding||n.riding||e.submersion>.05||n.submersion>.05||n.hasOrder){this.soltar(e,n);return}const s=Math.hypot(n.position.x-e.position.x,n.position.z-e.position.z);if(this.longe=s>Ov?this.longe+t:0,this.longe>=zv){this.soltar(e,n);return}if(n.direcaoDoPar=e.rig.facing,this.relogio+=t,this.relogio>=Ml){this.relogio-=Ml;const o=e.position.clone().add(n.position).multiplyScalar(.5);this.coracoes.soltar(o,0,0,2.05),this.onSom?.("coracao")}}aplicar(t,e){e.atrelar(this.lado,Nv),e.direcaoDoPar=t.rig.facing,t.rig.setHoldingHands(this.lado),e.rig.setHoldingHands(this.lado===1?-1:1)}}function ae(i,t,e){const n=i.createOscillator();n.type=e.tipo??"sine",n.frequency.setValueAtTime(e.freq,e.quando),e.glide&&n.frequency.exponentialRampToValueAtTime(Math.max(20,e.glide),e.quando+e.dur),e.detune&&n.detune.setValueAtTime(e.detune,e.quando);const s=i.createGain(),o=e.vol??.2,r=e.ataque??.006;s.gain.setValueAtTime(1e-4,e.quando),s.gain.exponentialRampToValueAtTime(o,e.quando+r),s.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur);let a=s;if(e.abafo){const c=i.createBiquadFilter();c.type="lowpass",c.frequency.setValueAtTime(e.abafo,e.quando),s.connect(c),a=c}n.connect(s),a.connect(t),n.start(e.quando),n.stop(e.quando+e.dur+.05)}let io=null;function kv(i){if(!io||io.sampleRate!==i.sampleRate){const t=i.createBuffer(1,i.sampleRate,i.sampleRate),e=t.getChannelData(0);for(let n=0;n<e.length;n++)e[n]=Math.random()*2-1;io=t}return io}function tn(i,t,e){const n=i.createBufferSource();n.buffer=kv(i),n.loop=!0;const s=i.createBiquadFilter();s.type=e.tipo??"bandpass",s.frequency.setValueAtTime(e.freq??1800,e.quando),e.glide&&s.frequency.exponentialRampToValueAtTime(Math.max(60,e.glide),e.quando+e.dur),s.Q.setValueAtTime(e.q??1.2,e.quando);const o=i.createGain(),r=e.vol??.14;o.gain.setValueAtTime(1e-4,e.quando),o.gain.exponentialRampToValueAtTime(r,e.quando+.008),o.gain.exponentialRampToValueAtTime(1e-4,e.quando+e.dur),n.connect(s),s.connect(o),o.connect(t),n.start(e.quando),n.stop(e.quando+e.dur+.05)}function fe(i){return 440*Math.pow(2,(i-69)/12)}function Vv(i){let t=i>>>0;return()=>(t^=t<<13,t^=t>>>17,t^=t<<5,(t>>>0)%1e5/1e5)}const Hv=[0,2,4,7,9,12,14,16],ye=72,Rh={passo:({ctx:i,destino:t,t:e,n})=>{const s=n%2===0;tn(i,t,{quando:e,dur:.075,vol:.05,freq:s?1500:1150,glide:s?700:560,q:.9}),ae(i,t,{freq:s?128:112,quando:e,dur:.06,vol:.045,tipo:"sine"})},nadar:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.34,vol:.07,freq:700,glide:2600,q:.7})},agua:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.42,vol:.2,freq:2400,glide:500,q:.6}),ae(i,t,{freq:420,glide:120,quando:e,dur:.26,vol:.1,tipo:"sine"})},prompt:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+12),quando:e,dur:.09,vol:.055,tipo:"triangle"})},interagir:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+4),quando:e,dur:.12,vol:.13,tipo:"triangle"}),ae(i,t,{freq:fe(ye+11),quando:e+.055,dur:.16,vol:.1,tipo:"sine"})},fala:({ctx:i,destino:t,t:e,n})=>{const s=Hv[n%4]+(n%8<4?0:2);ae(i,t,{freq:fe(ye+7+s),quando:e,dur:.06,vol:.035,tipo:"square",abafo:2200})},escolha:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+7),quando:e,dur:.07,vol:.08,tipo:"triangle"})},confirma:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+4),quando:e,dur:.1,vol:.12,tipo:"triangle"}),ae(i,t,{freq:fe(ye+9),quando:e+.07,dur:.14,vol:.11,tipo:"triangle"}),ae(i,t,{freq:fe(ye+16),quando:e+.14,dur:.2,vol:.09,tipo:"sine"})},porta:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.3,vol:.11,freq:900,glide:320,q:.8}),ae(i,t,{freq:180,glide:90,quando:e+.16,dur:.2,vol:.09,tipo:"sine"})},memoria:({ctx:i,destino:t,t:e})=>{[0,4,7,12,16].forEach((n,s)=>{ae(i,t,{freq:fe(ye+n),quando:e+s*.075,dur:.42,vol:.11-s*.008,tipo:"triangle"})})},toast:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+9),quando:e,dur:.14,vol:.09,tipo:"sine"}),ae(i,t,{freq:fe(ye+16),quando:e+.08,dur:.22,vol:.07,tipo:"sine"})},trocar:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye),glide:fe(ye+12),quando:e,dur:.18,vol:.09,tipo:"triangle"}),tn(i,t,{quando:e,dur:.2,vol:.05,freq:800,glide:3e3,q:.6})},beijo:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.06,vol:.1,freq:2400,glide:1200,q:2.5}),ae(i,t,{freq:fe(ye+7),quando:e+.02,dur:.1,vol:.08,tipo:"sine"})},coracao:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+12),quando:e,dur:.3,vol:.07,tipo:"sine"}),ae(i,t,{freq:fe(ye+19),quando:e+.09,dur:.36,vol:.05,tipo:"sine"})},lancar:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.26,vol:.12,freq:600,glide:3200,q:.7}),ae(i,t,{freq:300,glide:900,quando:e,dur:.16,vol:.06,tipo:"triangle"})},pegar:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.09,vol:.13,freq:1400,glide:500,q:1.6}),ae(i,t,{freq:fe(ye+9),quando:e+.03,dur:.14,vol:.1,tipo:"triangle"})},quicar:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:220,glide:110,quando:e,dur:.12,vol:.08,tipo:"sine"}),tn(i,t,{quando:e,dur:.1,vol:.06,freq:900,glide:400,q:1})},sorvete:({ctx:i,destino:t,t:e})=>{[0,7,12].forEach((n,s)=>{ae(i,t,{freq:fe(ye+4+n),quando:e+s*.09,dur:.3,vol:.1,tipo:"triangle"})})},pato:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:620,glide:380,quando:e,dur:.13,vol:.1,tipo:"sawtooth",abafo:1400}),ae(i,t,{freq:520,glide:300,quando:e+.15,dur:.12,vol:.08,tipo:"sawtooth",abafo:1200})},tv:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.18,vol:.07,freq:3e3,glide:1200,q:.5}),ae(i,t,{freq:fe(ye+4),quando:e+.1,dur:.18,vol:.07,tipo:"square",abafo:1800})},sino:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+12),quando:e,dur:.9,vol:.09,tipo:"sine"}),ae(i,t,{freq:fe(ye+19),quando:e+.02,dur:.8,vol:.05,tipo:"sine",detune:6})},sentar:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.24,vol:.09,freq:700,glide:260,q:.7})},menu:({ctx:i,destino:t,t:e})=>{ae(i,t,{freq:fe(ye+2),quando:e,dur:.1,vol:.09,tipo:"triangle"}),ae(i,t,{freq:fe(ye+9),quando:e+.06,dur:.14,vol:.07,tipo:"triangle"})},diario:({ctx:i,destino:t,t:e})=>{tn(i,t,{quando:e,dur:.22,vol:.09,freq:1200,glide:3e3,q:.6})},recomecar:({ctx:i,destino:t,t:e})=>{[0,4,7,12].forEach((n,s)=>{ae(i,t,{freq:fe(ye-12+n),quando:e+s*.11,dur:.5,vol:.1,tipo:"triangle"})})}},Gv=.2,Wv=1.3,Ui=i=>({raiz:i,notas:[0,4,7,11]}),os=i=>({raiz:i,notas:[0,3,7,10]}),so=i=>({raiz:i,notas:[0,4,7,10]}),qv=i=>({raiz:i,notas:[0,4,7,9]}),vr=[0,2,4,7,9,12,14,16,19],Xv=[0,2,3,5,7,9,10,12,14],go={casa:{bpm:82,tonica:41,giro:[Ui(0),os(9),os(2),so(7)],melodia:.62,chocalho:!1,escala:vr},"villa-lobos":{bpm:100,tonica:36,giro:[Ui(0),Ui(5),os(9),so(7)],melodia:.8,chocalho:!0,escala:vr},clube:{bpm:92,tonica:38,giro:[qv(0),os(2),Ui(5),so(7)],melodia:.72,chocalho:!0,escala:vr},padrao:{bpm:88,tonica:40,giro:[Ui(0),os(9),Ui(5),so(7)],melodia:.6,chocalho:!1,escala:Xv}},yl=[[0,2,3,6],[0,3,4,6,7],[2,3,5,6],[0,1,3,6],[0,4,6],[1,3,4,7]];class Ph{constructor(t,e){this.ctx=t,this.destino=e}clima=go.padrao;proximoClima=null;passo=0;proximo=0;timer=null;sorte=Vv(20260827);frase=[];grau=2;get tocando(){return this.timer!==null}setClima(t){const e=go[t]??go.padrao;e!==this.clima&&(this.tocando?this.proximoClima=e:this.clima=e)}start(){this.timer===null&&(this.proximo=this.ctx.currentTime+.15,this.timer=window.setInterval(()=>this.agendar(),Gv*1e3),this.agendar())}stop(){this.timer!==null&&(window.clearInterval(this.timer),this.timer=null)}preAgendar(t){for(this.proximo=0,this.passo=0;this.proximo<t;){this.tocarPasso(this.passo,this.proximo);const e=30/this.clima.bpm;this.proximo+=e*(this.passo%2===0?1.18:.82),this.passo+=1}}agendar(){const t=this.ctx.currentTime+Wv;let e=0;for(;this.proximo<t&&e++<64;){this.tocarPasso(this.passo,this.proximo);const n=30/this.clima.bpm;this.proximo+=n*(this.passo%2===0?1.18:.82),this.passo+=1}}tocarPasso(t,e){const n=t%8;n===0&&(this.proximoClima&&(this.clima=this.proximoClima,this.proximoClima=null),(Math.floor(t/8)%2===0||this.frase.length===0)&&(this.frase=yl[Math.floor(this.sorte()*yl.length)]));const s=this.clima,o=Math.floor(t/8),r=s.giro[o%s.giro.length],a=s.tonica+r.raiz;if(n===0||n===4){const c=n===0?a:a+(this.sorte()<.4?7:4);ae(this.ctx,this.destino,{freq:fe(c),quando:e,dur:n===0?.6:.45,vol:.2,tipo:"sine",abafo:420})}if(n===2||n===5||n===7&&this.sorte()<.35){const c=a+24;for(const[l,h]of r.notas.entries())l===0&&n!==2||ae(this.ctx,this.destino,{freq:fe(c+h),quando:e,dur:.85,vol:.07,tipo:"triangle",ataque:.03,detune:l%2?5:-5,abafo:2400})}if(this.frase.includes(n)&&this.sorte()<s.melodia){const c=[-2,-1,-1,0,1,1,2];this.grau+=c[Math.floor(this.sorte()*c.length)],this.grau>s.escala.length-3&&(this.grau-=2),this.grau<2&&(this.grau+=2),this.grau=Math.max(0,Math.min(s.escala.length-1,this.grau));const l=n>=6?r.notas[Math.floor(this.sorte()*3)]:s.escala[this.grau],h=s.tonica+31;this.marimba(fe(h+l),e),l<=9&&this.sorte()<.22&&this.marimba(fe(h+l+12),e+.03,.4)}s.chocalho&&n%2===1&&tn(this.ctx,this.destino,{quando:e,dur:.06,vol:n===3||n===7?.035:.02,freq:6200,q:.8})}marimba(t,e,n=1){ae(this.ctx,this.destino,{freq:t,quando:e,dur:.42,vol:.13*n,tipo:"sine"}),t<900&&ae(this.ctx,this.destino,{freq:t*2,quando:e,dur:.1,vol:.04*n,tipo:"sine"})}}const Sl="aristory.som",Yv=.035;class jv{ctx=null;mestre=null;canalMusica=null;canalEfeitos=null;musica=null;mudo;climaPendente="padrao";contadores=new Map;ultimoEm=new Map;carregando=null;contagem=new Map;constructor(){this.mudo=localStorage.getItem(Sl)==="0";const t=()=>this.ligar();for(const e of["pointerdown","keydown","touchstart"])window.addEventListener(e,t,{once:!1,passive:!0})}get ligado(){return!this.mudo}get pronto(){return this.ctx!==null&&this.ctx.state==="running"}ligar(){if(!this.ctx){const t=window.AudioContext??window.webkitAudioContext;if(!t)return;const e=new t;this.ctx=e,this.mestre=e.createGain(),this.mestre.gain.value=this.mudo?0:.9,this.mestre.connect(e.destination),this.canalMusica=e.createGain(),this.canalMusica.gain.value=.9,this.canalMusica.connect(this.mestre),this.canalEfeitos=e.createGain(),this.canalEfeitos.gain.value=1,this.canalEfeitos.connect(this.mestre),this.musica=new Ph(e,this.canalMusica),this.musica.setClima(this.climaPendente)}this.ctx.resume().then(()=>{this.mudo||this.musica?.start()})}setMudo(t){if(this.mudo=t,localStorage.setItem(Sl,t?"0":"1"),this.mestre&&this.ctx){const e=this.ctx.currentTime;this.mestre.gain.cancelScheduledValues(e),this.mestre.gain.setValueAtTime(this.mestre.gain.value,e),this.mestre.gain.linearRampToValueAtTime(t?0:.9,e+.12)}t?this.musica?.stop():this.ctx?.state==="running"&&this.musica?.start()}setClima(t){this.climaPendente=t,this.musica?.setClima(t)}play(t){if(this.contagem.set(t,(this.contagem.get(t)??0)+1),this.mudo||!this.ctx||!this.canalEfeitos||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(e-(this.ultimoEm.get(t)??-1)<Yv)return;this.ultimoEm.set(t,e);const n=(this.contadores.get(t)??0)+1;this.contadores.set(t,n),Rh[t]({ctx:this.ctx,destino:this.canalEfeitos,t:e,n})}carga(t){if(!this.ctx||!this.canalEfeitos||this.mudo||this.ctx.state!=="running")return;const e=this.ctx.currentTime;if(t===null){if(this.carregando){const{osc:s,ganho:o}=this.carregando;o.gain.cancelScheduledValues(e),o.gain.setValueAtTime(o.gain.value,e),o.gain.exponentialRampToValueAtTime(1e-4,e+.08),s.stop(e+.1),this.carregando=null}return}if(!this.carregando){const s=this.ctx.createOscillator();s.type="triangle";const o=this.ctx.createGain();o.gain.setValueAtTime(1e-4,e),o.gain.exponentialRampToValueAtTime(.05,e+.05),s.connect(o),o.connect(this.canalEfeitos),s.start(e),this.carregando={osc:s,ganho:o}}const n=fe(60+t*19);this.carregando.osc.frequency.setTargetAtTime(n,e,.04)}aplauso(){if(!this.ctx||!this.canalEfeitos)return;const t=this.ctx.currentTime;[0,5,9,12].forEach((e,n)=>{ae(this.ctx,this.canalEfeitos,{freq:fe(72+e),quando:t+n*.1,dur:.5,vol:.09,tipo:"triangle"})})}}const Jv={magro:.86,medio:1,forte:1.16},bl=.75,Zv=.13,Kv={upright:{bracoX:-1.38,bracoZ:.16,balanco:.15,itemZ:0,itemX:0},relaxed:{bracoX:-.22,bracoZ:.46,balanco:.6,itemZ:.9,itemX:.13}};function _r(i,t,e){const n=new Co,s=5;for(let r=0;r<s*2;r++){const a=r%2===0?i:i*.46,c=r/(s*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*a,h=Math.sin(c)*a;r===0?n.moveTo(l,h):n.lineTo(l,h)}n.closePath();const o=new qa(n,{depth:t,bevelEnabled:!1});return o.center(),new S(o,e)}class ba{group=new ut;spec;headTop;body=new ut;head=new ut;armL=new ut;armR=new ut;maoDir=new ut;legL=new ut;legR=new ut;blob;chapeu=new ut;phase=0;bounce=0;beijo=0;maos=0;pose="none";patinando=!1;altoDoPatins=0;alturaDaPerna=0;pes=[];patins=[];targetFacing=0;swimming=!1;sitting=!1;trocaMaterial=[];soVestido=[];soBanho=[];traje="normal";roupa={};extras=new Map;medidas;sobreTronco=[];cabelo;constructor(t){this.spec=t;const e=t.height,n=Jv[t.build],s=e*.28,o=e/1.7;this.altoDoPatins=Zv*o,this.alturaDaPerna=s;const r=e*.3,a=e*.17,c=s,l=s+r*.86,h=e*.1*n,u=e*.3;this.headTop=s+r+a*2.1,this.medidas={h:e,w:n,headR:a,legH:s,torsoH:r};const d=I(t.skin),f=I(t.shirt),g=I(t.pants),_=I(t.shoes);for(const[R,M]of[[this.legL,-1],[this.legR,1]]){R.position.set(M*e*.055*n,c,0);const v=new S(new Fn(e*.042*n,s*.62,4,10),g);v.position.y=-s*.48,R.add(v),this.trocaMaterial.push({mesh:v,normal:g,banho:d,slot:"pernas",parte:"principal"});const D=new S(new W(e*.075*n,e*.045,e*.11),_);D.position.set(0,-s+e*.022,e*.018),R.add(D),this.trocaMaterial.push({mesh:D,normal:_,banho:d,slot:"pes",parte:"principal"}),this.pes.push(D);const F=va(t.shoes);F.scale.setScalar(o),F.visible=!1,R.add(F),this.patins.push(F),this.body.add(R)}const m=new S(new Fn(e*.105*n,r*.5,5,12),f);if(m.position.y=c+r*.52,m.scale.z=.82,this.body.add(m),this.trocaMaterial.push({mesh:m,normal:f,banho:d,slot:"tronco",parte:"principal"}),t.shirtAccent!==void 0){const R=new S(new at(e*.108*n,e*.108*n,e*.03,14,1,!0),I(t.shirtAccent,{doubleSide:!0}));R.position.y=c+r*.72,R.scale.z=.82,this.body.add(R),this.soVestido.push(R),this.sobreTronco.push(R)}if(t.jacket!==void 0){const R=I(t.jacket,{doubleSide:!0}),M=e*.105*n,v=new S(new at(M*1.14,M*1.1,r*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),R);v.position.y=c+r*.56,v.scale.z=.84,this.body.add(v),this.soVestido.push(v),this.sobreTronco.push(v);const D=new S(new Ht(e*.088*n,12,10,0,Math.PI*2,0,Math.PI*.62),I(t.jacket));D.position.set(0,l+r*.04,-M*.75),D.rotation.x=-.7,D.scale.set(1.15,1,.8),this.body.add(D),this.soVestido.push(D),this.sobreTronco.push(D)}const p=new S(new at(e*.118*n,e*.112*n,e*.15,14),I(t.swim??t.pants));p.position.y=c+e*.03,p.scale.z=.85,p.visible=!1,this.body.add(p),this.soBanho.push(p);for(const[R,M]of[[this.armL,-1],[this.armR,1]]){R.position.set(M*h,l,0);const v=t.jacket!==void 0?I(t.jacket):f,D=new S(new Fn(e*.038*n,u*.34,4,10),v);D.position.y=-u*.24,R.add(D),this.trocaMaterial.push({mesh:D,normal:v,banho:d,slot:"tronco",parte:"detalhe"});const F=new S(new Fn(e*.032*n,u*.28,4,10),d);F.position.y=-u*.66,R.add(F);const k=new S(new Ht(e*.04*n,10,8),d);k.position.y=-u*.92,R.add(k),this.body.add(R)}this.maoDir.position.y=-u*.98,this.armR.add(this.maoDir),this.head.position.y=s+r+a*.92;const T=new S(new at(e*.035,e*.04,e*.05,10),d);T.position.y=-a*.85,this.head.add(T);const b=new S(new Ht(a,20,16),d);b.scale.set(1,1.04,1),this.head.add(b);const x=I(t.eyes);for(const R of[-1,1]){const M=new S(new Ht(a*.14,10,8),x);if(M.position.set(R*a*.35,0,a*.9),M.scale.set(1,1.25,.6),this.head.add(M),t.blush!==void 0){const v=new S(new ys(a*.16,12),Vn(t.blush,.75));v.position.set(R*a*.56,-a*.26,a*.82),v.rotation.y=R*.35,this.head.add(v)}}const L=I(t.hair.color);for(const R of[-1,1]){const M=new S(new W(a*.3,a*.075,a*.06),L);M.position.set(R*a*.35,a*.3,a*.87),M.rotation.z=R*-.12,this.head.add(M)}const w=new S(new Ce(a*.16,a*.035,6,14,Math.PI),x);w.position.set(0,-a*.38,a*.9),w.rotation.set(0,0,Math.PI),this.head.add(w);const C=this.head.children.length;this.buildHair(a),this.cabelo=this.head.children.slice(C),this.buildAccessories(a,u,l,h,r,c,n),this.body.add(this.head),this.group.add(this.body),this.blob=new S(new ys(e*.16*n,18),Vn(2832939,.22)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(R=>{R.isMesh&&R!==this.blob&&(R.castShadow=!0,R.receiveShadow=!1)})}buildHair(t){const{style:e,color:n}=this.spec.hair,s=I(n),o=(r,a,c=.62,l=0)=>{const h=new S(new Ht(t*r,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),s);return h.position.y=a,this.head.add(h),h};switch(e){case"raspado":{o(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{o(1.06,t*.04).scale.set(1,.95,.98);const a=new S(new W(t*1.5,t*.34,t*.42),s);a.position.set(0,t*.6,t*.62),a.rotation.x=-.18,this.head.add(a);break}case"franja":{o(1.07,t*.02);const r=new S(new at(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),s);r.position.set(0,t*.5,0),this.head.add(r);break}case"ondulado":{o(1.08,t*.02);for(const r of[-1,1]){const a=new S(new Ht(t*.46,12,10),s);a.position.set(r*t*.85,t*.1,-t*.1),a.scale.set(.8,1.15,1),this.head.add(a)}break}case"coque":{o(1.06,t*.02);const r=new S(new Ht(t*.42,12,10),s);r.position.set(0,t*.72,-t*.82),this.head.add(r);break}case"cachos-curtos":{const r=this.spec.hair.volume??1,a=this.spec.hair.tips!==void 0?I(this.spec.hair.tips):s;o(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[u,d,f,g]of l)for(let _=0;_<d;_++){const m=_/d*Math.PI*2+u*1.9,p=Math.sin(u)*Math.cos(m),T=Math.cos(u),b=Math.sin(u)*Math.sin(m);if(T<.72&&b>.24)continue;const x=new S(new Ht(t*f*(1+(r-1)*.4),8,7),h%5===0?a:s),L=g*(1+(r-1)*.14),w=b>0?.9:1.02;x.position.set(p*t*L,T*t*L,b*t*L*w),this.head.add(x),h++}for(let u=0;u<5;u++){const d=new S(new Ht(t*.2*(1+(r-1)*.3),8,7),u===2?a:s);d.position.set((u-2)*t*.3,t*(.62-u%2*.07),t*.62),this.head.add(d)}for(let u=0;u<3;u++){const d=new S(new Ht(t*.24*(1+(r-1)*.4),8,7),u===1?a:s);d.position.set((u-1)*t*.3,t*(.84+u%2*.07),t*.44),this.head.add(d)}for(const u of[-1,1]){const d=new S(new Ht(t*.17,8,7),s);d.position.set(u*t*.9,-t*.12,t*.22),d.scale.set(.7,1.1,.85),this.head.add(d)}break}case"cacheado":{const r=this.spec.hair.volume??1,a=this.spec.hair.tips!==void 0?I(this.spec.hair.tips):s;o(1+(r-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[u,d,f,g]of l)for(let _=0;_<d;_++){const m=_/d*Math.PI*2+u*2.3,p=Math.sin(u)*Math.cos(m),T=Math.cos(u),b=Math.sin(u)*Math.sin(m);if(u>.72&&b>.22)continue;const x=1+(r-1)*.55,L=new S(new Ht(t*f*x,8,7),h%4===0?a:s),w=g*(1+(r-1)*.28),C=b>0?.78:1.06;L.position.set(p*t*w,T*t*w,b*t*w*C),this.head.add(L),h++}for(let u=0;u<4;u++){const d=new S(new Ht(t*.22*(1+(r-1)*.4),8,7),u===1?a:s);d.position.set((u-1.5)*t*.34,t*(.62-u%2*.08),t*.62),this.head.add(d)}for(const u of[-1,1]){const d=new S(new Ht(t*.26*r,8,7),s);d.position.set(u*t*1.02*r,-t*.34,t*.28),d.scale.set(.8,1.25,.9),this.head.add(d)}break}}}buildAccessories(t,e,n,s,o,r,a){const c=this.spec.accessories??[],l=I(this.spec.accessoryColor??3093568);{const h=new S(new at(t*.7,t*.7,t*.11,16),I(16774096));h.position.y=t*1.42,this.chapeu.add(h);const u=new S(new ln(t*.58,t*1.05,14),I(E.gold));u.position.y=t*1.98,this.chapeu.add(u);const d=_r(t*.3,t*.07,I(16774096));d.position.y=t*2.62,this.chapeu.add(d),this.chapeu.rotation.z=-.14,this.chapeu.visible=!1,this.head.add(this.chapeu)}if(c.includes("oculos")){for(const u of[-1,1]){const d=new S(new Ce(t*.24,t*.045,8,16),l);d.position.set(u*t*.36,t*.06,t*.9),this.head.add(d)}const h=new S(new W(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new S(new Ht(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const u=new S(new at(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);u.position.set(0,t*.12,t*.28),u.rotation.x=-.12,this.head.add(u)}if(c.includes("barba")){const h=new S(new Ht(t*.72,14,12),I(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new S(new Ce(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const u of[-1,1]){const d=new S(new at(t*.28,t*.28,t*.16,12),l);d.position.set(u*t*1.02,t*.02,0),d.rotation.z=Math.PI/2,this.head.add(d)}}if(c.includes("corrente")){const h=new S(new Ce(t*.42,t*.035,6,20),I(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new S(new at(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,u=_r(t*.3,t*.06,I(15918799));u.position.set(-t*.78*h,t*.92*h,t*.62*h),u.rotation.set(.35,-.6,.3),this.head.add(u)}if(c.includes("laco")){const h=this.spec.height,u=new ut,d=h*.105*a,f=new S(new Ht(h*.018,8,6),l);u.add(f);for(const g of[-1,1]){const _=new S(new Ce(h*.026,h*.007,6,12),l);_.position.set(g*h*.03,h*.008,0),_.rotation.set(0,g*.5,g*.35),_.scale.set(1,.7,1),u.add(_);const m=new S(new W(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,u.add(m)}u.position.set(0,n-o*.1,d*.86),this.body.add(u),this.soVestido.push(u),this.sobreTronco.push(u)}if(c.includes("cinto")){const h=this.spec.height,u=h*.105*a,d=r+o*.08,f=new S(new at(u*1.04,u*1.04,h*.032,16,1,!0),l);f.position.y=d,f.scale.z=.84,this.body.add(f),this.soVestido.push(f),this.sobreTronco.push(f);const g=new S(new W(h*.032,h*.03,h*.012),I(14210252));g.position.set(0,d,u*.9),this.body.add(g),this.soVestido.push(g),this.sobreTronco.push(g);const _=new S(new Ce(h*.028,h*.004,5,12,Math.PI),I(14210252));_.position.set(u*.6,d-h*.012,u*.6),_.rotation.set(0,-.7,Math.PI),this.body.add(_),this.soVestido.push(_),this.sobreTronco.push(_);const m=_r(h*.016,h*.004,I(14210252));m.position.set(u*.76,d-h*.05,u*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m),this.sobreTronco.push(m)}if(c.includes("mochila")){const h=new S(new W(s*1.7,o*.62,this.spec.height*.09),l);h.position.set(0,r+o*.6,-this.spec.height*.11*a),this.body.add(h),this.soVestido.push(h);const u=n;for(const d of[-1,1]){const f=new S(new W(this.spec.height*.022,o*.5,this.spec.height*.02),l);f.position.set(d*s*.6,u-o*.2,this.spec.height*.085*a),this.body.add(f),this.soVestido.push(f)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setCampeao(t){this.chapeu.visible=t}get campeao(){return this.chapeu.visible}setOutfit(t){this.traje=t,this.aplicarVisual()}aplicarVisual(){const t=this.traje==="banho";for(const s of this.trocaMaterial){if(t){s.mesh.material=s.banho;continue}if(this.mostraPele(s.slot,s.parte)){s.mesh.material=s.banho;continue}const o=this.roupa[s.slot];if(!o){s.mesh.material=s.normal;continue}const r=s.parte==="detalhe"?o.corDetalhe??o.cor:o.cor;s.mesh.material=r===void 0?s.normal:I(r)}for(const s of this.soVestido)s.visible=!t;for(const s of this.soBanho)s.visible=t;if(!t&&this.roupa.tronco)for(const s of this.sobreTronco)s.visible=!1;for(const[s,o]of this.extras){const r=this.roupa[s]!==void 0&&(s==="cabeca"||!t)&&!(s==="pes"&&this.patinando);for(const a of o)a.visible=r}for(const s of this.pes)s.visible=!this.patinando;for(const s of this.patins)s.visible=this.patinando;const n=this.roupa.cabeca?.cobreCabelo===!0;for(const s of this.cabelo)s.visible=!n}mostraPele(t,e){for(const n of Object.values(this.roupa))if(n&&(n.pernasNuas&&t==="pernas"||n.bracosNus&&t==="tronco"&&e==="detalhe"))return!0;return!1}vestirRoupa(t){for(const e of vi){const n=t[e]??null;if((this.roupa[e]?.id??null)===n)continue;this.tirarExtras(e);const s=n?xa(n):null;this.roupa[e]=s??void 0,s?.extra&&this.porExtras(e,s)}this.aplicarVisual()}get roupaAtual(){const t={};for(const e of vi){const n=this.roupa[e];n&&(t[e]=n.id)}return t}porExtras(t,e){if(!e.extra)return;const n=t==="pes"?[this.legL,this.legR]:t==="cabeca"?[this.head]:[this.body],s=[];for(const o of n){const r=e.extra(this.medidas);r.userData.roupa=e.id,r.traverse(a=>{a.isMesh&&(a.castShadow=!0,a.receiveShadow=!1)}),o.add(r),s.push(r)}this.extras.set(t,s)}tirarExtras(t){const e=this.extras.get(t);if(e){for(const n of e)n.parent?.remove(n),n.traverse(s=>{const o=s;o.isMesh&&o.geometry.dispose()});this.extras.delete(t)}}setSitting(t){this.sitting=t,t||(this.poeAltura(0),this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setPatins(t){if(this.patinando!==t){this.patinando=t;for(const e of this.patins)e.position.y=-this.alturaDaPerna-this.altoDoPatins;this.aplicarVisual()}}get patinandoAgora(){return this.patinando}segurar(t,e="none"){for(let n=this.maoDir.children.length-1;n>=0;n--)this.maoDir.remove(this.maoDir.children[n]);this.pose=t?e:"none",t&&this.maoDir.add(t)}get segurando(){return this.maoDir.children.length>0}setHoldingHands(t){this.maos=t}get holdingHands(){return this.maos!==0}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let n=this.targetFacing-this.group.rotation.y;if(n=Math.atan2(Math.sin(n),Math.cos(n)),this.group.rotation.y+=n*Math.min(1,t*14),this.beijo>.001){const c=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=c*.3,this.poeAltura(c*.045),this.armL.rotation.set(-c*.55,0,.08+c*.16),this.armR.rotation.set(-c*.55,0,-.08-c*.16),this.head.rotation.x=c*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9;const c=Math.sin(this.phase*2.2)*.17;this.legL.rotation.x=-Math.PI/2+.06+c,this.legR.rotation.x=-Math.PI/2-.02-c,this.armL.rotation.set(-.25,0,-.34),this.armR.rotation.set(-.2,0,.34),this.maos!==0&&(this.maos<0?this.armL:this.armR).rotation.set(.12,0,bl*.8*this.maos),this.body.rotation.x=-.05,this.poeAltura(Math.sin(this.phase)*.012),this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const c=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+c*.9,this.armR.rotation.x=-1.1-c*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=c*.28,this.legR.rotation.x=-c*.28,this.body.rotation.x=.16,this.poeAltura(Math.sin(this.phase)*.03),this.head.rotation.x=-.14;return}const s=e>.05,o=this.patinando?.9+e*.33:3.2+e*1.9;this.phase+=t*(s?o:1.4);const r=s?this.patinando?Math.min(.34,.12+e*.06):Math.min(.62,.16+e*.14):.04,a=Math.sin(this.phase*(s?2:1));if(this.patinando){const c=s?Math.min(.28,.1+e*.04):.03;this.legL.rotation.z=-Math.max(0,a)*c*1.7,this.legR.rotation.z=Math.max(0,-a)*c*1.7,this.legL.rotation.x=s?a*r*.25:0,this.legR.rotation.x=s?-a*r*.25:0,this.body.rotation.z=a*c*.34;const l=.34+Math.abs(a)*.14;this.armL.rotation.x=s?-a*r*.9:0,this.armR.rotation.x=s?a*r*.9:0,this.armL.rotation.z=-l,this.armR.rotation.z=l}else this.legL.rotation.z=0,this.legR.rotation.z=0,this.body.rotation.z=0,this.legL.rotation.x=s?a*r:0,this.legR.rotation.x=s?-a*r:0,this.armL.rotation.x=s?-a*r*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=s?a*r*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08;if(this.maos!==0){const c=this.maos<0?this.armL:this.armR,l=this.maos<0?this.armR:this.armL;c.rotation.z=bl*this.maos,c.rotation.x=-.1,l.rotation.x*=.5}if(this.aplicarPose(),this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const c=Math.sin((1-this.bounce)*Math.PI)*.28;this.poeAltura(c),this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const c=s?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.poeAltura(c),this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=s?this.patinando?.16:.06:0,this.head.rotation.x=s?-.05:Math.sin(this.phase*.6)*.03}poeAltura(t){this.body.position.y=t+this.altoDoPatins*(this.patinando?1:0)}aplicarPose(){if(this.pose==="none"||this.maos>0){this.maoDir.rotation.set(0,0,0),this.maoDir.position.x=0;return}const t=Kv[this.pose];this.armR.rotation.x=t.bracoX+this.armR.rotation.x*t.balanco,this.armR.rotation.z=t.bracoZ,this.maoDir.rotation.set(-this.armR.rotation.x,0,t.itemZ-this.armR.rotation.z),this.maoDir.position.x=t.itemX}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class $v{renderer;cena=new th;camera=new nn(30,1,.1,20);pedestal=new ut;rig=null;spec=null;giro=0;alvo=0;constructor(t){this.renderer=new Mh({canvas:t,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.cena.add(this.pedestal);const e=new ph(16777215,8952234,1.5);this.cena.add(e);const n=new ua(16774368,1.5);n.position.set(3,5,4),this.cena.add(n);const s=new ua(12572927,.5);s.position.set(-3,2,-3),this.cena.add(s)}mostrar(t){if(this.spec?.id===t.id)return;this.rig&&(this.pedestal.remove(this.rig.group),this.rig.dispose()),this.spec=t,this.rig=new ba(t),this.pedestal.add(this.rig.group);const e=t.height;this.rig.group.position.y=-e*.5,this.camera.position.set(0,e*.04,e*2.28),this.camera.lookAt(0,0,0)}vestir(t){this.rig?.vestirRoupa(t)}girar(t){this.alvo+=t}update(t){this.rig&&(this.giro+=(this.alvo-this.giro)*Math.min(1,t*9),this.pedestal.rotation.y=this.giro,this.rig.update(t,0))}desenhar(){if(!this.rig)return;const t=this.renderer.domElement,e=t.clientWidth,n=t.clientHeight;e<2||n<2||((t.width!==e||t.height!==n)&&this.renderer.setSize(e,n,!1),this.camera.aspect=e/n,this.camera.updateProjectionMatrix(),this.renderer.render(this.cena,this.camera))}dispose(){this.rig?.dispose(),this.rig=null,this.spec=null,this.renderer.dispose()}}class Qv{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;if(!this.enabled){this.hot=!1,this.pulse=0,this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const n=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(n*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(n*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}class t_{constructor(t){this.game=t}root=new ut;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,n,s,o=0){return t.position.set(e,n,s),t.rotation.y=o,t}ground(t){const e=new sn(t.width,t.depth,1,1),n=new S(e,I(t.color));return n.rotation.x=-Math.PI/2,n.position.set(t.x??0,t.y??0,t.z??0),n.receiveShadow=!0,this.root.add(n),n}groundWithHoles(t){const e=t.width/2,n=t.depth/2,s=new Co;s.moveTo(-e,-n),s.lineTo(e,-n),s.lineTo(e,n),s.lineTo(-e,n),s.closePath();for(const r of t.holes){const a=new ca,c=r.x-r.width/2,l=r.x+r.width/2,h=-r.z-r.depth/2,u=-r.z+r.depth/2;a.moveTo(c,h),a.lineTo(l,h),a.lineTo(l,u),a.lineTo(c,u),a.closePath(),s.holes.push(a)}const o=new S(new Xa(s),I(t.color));return o.rotation.x=-Math.PI/2,o.position.set(t.x??0,t.y??0,t.z??0),o.receiveShadow=!0,this.root.add(o),o}patch(t,e,n,s,o,r=0,a=.01){const c=new S(new sn(n,s),I(o,{offset:++this.decalque}));return c.rotation.set(-Math.PI/2,0,0),c.rotation.z=r,c.position.set(t,a,e),c.receiveShadow=!0,this.root.add(c),c}disc(t,e,n,s,o=.01){const r=new S(new ys(n,28),I(s,{offset:++this.decalque}));return r.rotation.x=-Math.PI/2,r.position.set(t,o,e),r.receiveShadow=!0,this.root.add(r),r}blockBox(t,e,n,s,o=0){this.colliders.push({kind:"box",x:t,z:e,hw:n,hd:s,rot:o})}blockCircle(t,e,n){this.colliders.push({kind:"circle",x:t,z:e,r:n})}blockFrom(t,e=.9){const n=new ji().setFromObject(t),s=n.getSize(new U),o=n.getCenter(new U);this.blockBox(o.x,o.z,s.x/2*e,s.z/2*e,0)}setBounds(t,e,n,s){this.bounds={minX:t,minZ:e,maxX:n,maxZ:s}}wall(t,e,n,s,o=3,r=15984595,a=.3){const c=n-t,l=s-e,h=Math.hypot(c,l),u=Math.atan2(l,c),d=new S(new W(h,o,a),I(r));return d.position.set((t+n)/2,o/2,(e+s)/2),d.rotation.y=-u,this.add(d),this.blockBox((t+n)/2,(e+s)/2,h/2,a/2,-u),d}interact(t){const e=new Qv(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}banco(t,e,n=0,s){const o=this.add(this.place(yh(s),t,0,e,n));this.blockBox(t,e,.95,.35,n);const r=new Te;r.position.set(t,0,e),r.rotation.y=n+Math.PI,this.root.add(r);const a=new Te;a.position.set(t,.9,e),this.root.add(a);const c=.06,l=.46;return this.interact({id:`banco:${t.toFixed(1)},${e.toFixed(1)}`,x:t,z:e,radius:1.9,label:"Sentar no banco",icon:"🪑",highlight:o,onInteract:async h=>{h.lockPlayer(!0),h.ridePlayer(r,new U(-l,c,.02),1,Math.PI),h.rideCompanion(r,new U(l,c,.02),1,Math.PI),h.setSitting(!0),h.focusCamera(a),await h.wait(.5),await h.say(["Senta aqui um pouco."],h.companionName()),await h.say(["Só um pouquinho."],h.playerName());let u=0;for(;u===0;)u=await h.ask("Ficar mais um pouco?",["Ficar","Levantar"]),u===0&&await h.wait(4);h.setSitting(!1),h.focusCamera(null);const d=n,f=Math.sin(d)*1.5,g=Math.cos(d)*1.5;h.releasePlayer(t+f-Math.cos(d)*.5,e+g+Math.sin(d)*.5,d),h.releaseCompanion(t+f+Math.cos(d)*.5,e+g-Math.sin(d)*.5,d),h.lockPlayer(!1)}}),o}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}class e_{constructor(t,e,n,s=Object.keys(e)[0]){this.root=t,this.scenes=e,this.dupla=n,this.cenaInicial=s,this.renderer=new Mh({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Ll,t.appendChild(this.renderer.domElement),this.ui=new wv(t),this.previa=new $v(this.ui.canvasDoBoneco()),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onEscolherSlot=r=>this.setActiveHandSlot(r),this.ui.onMoverItem=(r,a)=>this.moveItem(r,a),this.ui.onDescartar=r=>this.descartarDaVaga(r),this.ui.onAbrirMochila=()=>this.pintarMochila(),this.ui.onAbrirArmario=()=>this.pintarArmario(),this.ui.onGirarBoneco=r=>this.previa.girar(r),this.ui.onTirarParte=r=>{const a=this.playerId(),c=this.save.vestiveis(a)[r];if(c){if(this.save.despir(a,r),this.save.guardar(a,c)==="cheio"){this.save.vestir(a,c),this.ui.toast("Mochila cheia","🎒");return}this.audio.play("escolha"),this.pintarArmario()}},this.ui.onVestirPeca=r=>{const a=this.playerId(),c=this.save.maos(a).find(u=>u?.id===r);if(!c)return;const l=c.slot?vi.indexOf(c.slot):-1;if(l<0)return;const h=this.save.vestiveis(a)[l];this.save.largar(a,r),h&&this.save.despir(a,l),this.save.vestir(a,c),h&&this.save.guardar(a,h),this.audio.play("escolha"),this.pintarArmario()},this.ui.onTouchHold=r=>this.input.setVirtualDown("KeyF",r),this.ui.onRestart=()=>this.restart(),this.ui.som=r=>this.audio.play(r),this.ui.onToggleSom=()=>{this.audio.setMudo(this.audio.ligado),this.ui.setSom(this.audio.ligado),this.audio.ligado&&this.audio.play("menu")},this.ui.setSom(this.audio.ligado),this.input=new Gg(this.renderer.domElement),this.hemi=new ph(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new ua(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const o=this.sun.shadow.camera;o.left=-22,o.right=22,o.top=22,o.bottom=-22,o.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new Ev(new ba(n[0])),this.scene.add(this.player.object),this.coracoes=new Cv(this.scene),this.beijo=new Lv(this.coracoes),this.beijo.onSom=r=>this.audio.play(r),this.maos=new Bv(this.coracoes),this.maos.onSom=r=>this.audio.play(r),this.parceiro=new Tv(new ba(n[1]??n[0])),this.parceiro.setVisible(n.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new th;iso=new Hg;input;ui;save=new Za;previa;player;parceiro;clock=new of;coracoes;beijo;maos;audio=new jv;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;naMao=new Map;trilha=0;elapsed=0;shadowSpan=0;traje="normal";moveDir=new U;camAim=new U;camOmbro=null;async start(t,e){const n=t??(this.scenes[this.save.scene]?this.save.scene:this.cenaInicial);this.build(n,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}restart(){this.save.reset(),this.ui.setMemories(this.save.memories),this.player.rig.spec.id!==this.dupla[0].id&&this.swapCharacters(),this.ui.showHints(),this.goTo(this.cenaInicial),this.audio.play("recomecar"),this.ui.toast("Do começo, então","🔄")}build(t,e){const n=this.scenes[t];if(!n)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const s=new t_(this);s.setSeed(n_(t)),n.build(s),this.scene.add(s.root),this.current={def:n,world:s},this.applyAmbient(n.ambient);const o=e&&n.entries?.[e]||n.spawn;this.player.teleport(o.x,o.z,o.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const r=(o.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(o.x+Math.sin(r)*1.3,o.z+Math.cos(r)*1.3,o.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.maos.soltar(this.player,this.parceiro),this.coracoes.limpar(),this.podeBeijar=!1,this.camOmbro=null,this.ui.showPlacar(null),this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(n.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(n.name,n.subtitle),this.audio.setClima(t),this.migrarPremios(),this.aplicarPremios(),this.save.scene=t}aplicarPremios(){this.sincronizarVestiveis()}migrarPremios(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id;this.save.flag(`chapeu-ping-pong:${e}`)&&(this.save.achouItem(e,pe.chapeuPingPong.id)||this.save.vestir(e,pe.chapeuPingPong))}}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new re(t.sky),this.scene.fog=t.fog!==void 0?new ka(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const n=this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.ui.mochilaOpen||this.ui.armarioOpen||this.transitioning;this.input.blocked=n||this.player.locked,this.input.justPressed("KeyJ")&&!this.ui.menuOpen&&this.ui.toggleJournal(),(this.input.justPressed("KeyI")||this.input.justPressed("Tab"))&&!this.ui.menuOpen&&!this.ui.dialogueOpen&&(this.ui.armarioOpen?this.ui.fecharArmario():this.ui.mochilaOpen?this.ui.closeMochila():this.abrirMochila()),this.ui.armarioOpen&&this.input.justPressed("Escape")&&this.ui.fecharArmario(),(this.ui.mochilaOpen||this.ui.armarioOpen?!this.ui.dialogueOpen&&!this.ui.menuOpen&&!this.transitioning:!n)&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),n||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1)),!n&&!this.player.locked&&this.input.justPressed("KeyH")&&this.maoNaMao();const r=this.input.justPressed("KeyE")||this.input.justPressed("Space");r&&this.ui.handleAction()||(r&&!n&&this.hot&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.audio.play("interagir"),this.hot.trigger(this)):r&&!n&&this.podeBeijar&&!this.player.locked?(this.maos.soltar(this.player,this.parceiro),this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)):r&&!n&&!this.player.locked&&this.maoNaMao()),this.beijo.update(t,this.player,this.parceiro),this.maos.update(t,this.player,this.parceiro);const a=this.input.move();this.iso.screenToWorld(a.x,a.y,this.moveDir);const c=this.player.position.clone();this.player.update(this.moveDir,t,e.colliders,e.bounds),this.ouvirPassos(c),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.coracoes.update(t),this.sincronizarMaos(),this.sincronizarVestiveis(),this.updateHot(e,t),this.updateBeijo();for(const u of e.updaters)u(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const l=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(l);const h=l/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*h,this.camAim.y+20*h,this.camAim.z+9*h),this.renderer.render(this.scene,this.camOmbro??this.iso.camera),this.ui.armarioOpen&&(this.previa.update(t),this.previa.desenhar()),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.ui.menuOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro)}maoNaMao(){this.maos.ativo?(this.maos.soltar(this.player,this.parceiro),this.audio.play("escolha")):this.maos.disponivel(this.player,this.parceiro)&&this.maos.ligar(this.player,this.parceiro)}ouvirPassos(t){if(this.player.riding||this.player.locked)return;const e=Math.hypot(this.player.position.x-t.x,this.player.position.z-t.z);if(e<5e-4){this.trilha=0;return}this.trilha+=e;const n=this.player.submersion>.05?1.05:.62;this.trilha>=n&&(this.trilha=0,this.audio.play(this.player.submersion>.05?"nadar":"passo"))}updateHot(t,e){let n=null,s=1/0,o=-1/0;const r=this.player.position.x,a=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(r,a);l>c.radius||c.priority<o||c.priority===o&&l>=s||(n=c,s=l,o=c.priority)}n!==this.hot&&(this.hot?.setHot(!1),n?.setHot(!0),this.hot=n,n&&!this.player.locked?this.ui.showPrompt(n.icon,n.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,n){return this.ui.ask(t,e,n??this.player.name)}toast(t,e){this.audio.play("toast"),this.ui.toast(t,e)}som(t){this.audio.play(t)}goTo(t,e){this.transitioning||(this.transitioning=!0,this.audio.play("porta"),(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setCameraOmbro(t,e){if(!t){this.camOmbro=null;return}this.camOmbro||(this.camOmbro=new nn(58,window.innerWidth/window.innerHeight,.1,400)),this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.position.copy(t),e&&this.camOmbro.lookAt(e),this.camOmbro.updateProjectionMatrix()}pointer(){return this.input.pointer()}showPlacar(t){this.ui.showPlacar(t)}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}addItem(t,e=this.playerId()){const n=this.save.pegar(e,t);return n==="cheio"&&this.ui.toast("Mochila cheia","🎒"),(n==="mao"||n==="guardado")&&this.repintarMochila(),n}storeItem(t,e=this.playerId()){const n=this.save.guardar(e,t);return n!=="cheio"&&n!=="repetido"&&this.repintarMochila(),n}removeItem(t,e=this.playerId()){const n=this.save.largar(e,t);return n&&this.repintarMochila(),n}hasItem(t,e=this.playerId()){return this.save.achouItem(e,t)}getActiveHandItem(t=this.playerId()){return this.save.itemAtivo(t)}setActiveHandSlot(t,e=this.playerId()){this.save.setSlotAtivo(e,t),this.repintarMochila()}activeHandSlot(t=this.playerId()){return this.save.slotAtivo(t)}equipWearable(t,e=this.playerId()){const n=this.save.vestir(e,t);return n&&this.repintarMochila(),n}unequipWearable(t,e=this.playerId()){this.save.despir(e,t),this.repintarMochila()}moveItem(t,e,n=this.playerId()){const s=this.save.mover(n,t,e);return s&&this.repintarMochila(),s}handItems(t=this.playerId()){return this.save.maos(t)}wearables(t=this.playerId()){return this.save.vestiveis(t)}descartarDaVaga(t){const e=this.playerId(),s=(t.lista==="mao"?this.save.maos(e):this.save.vestiveis(e))[t.indice];s&&(this.save.largar(e,s.id),this.audio.play("escolha"),this.ui.toast(`${s.nome} foi descartado`,"🗑"),this.pintarMochila())}repintarMochila(){this.ui.mochilaOpen&&this.pintarMochila()}pintarMochila(){const t=this.playerId();this.ui.renderMochila(this.save.maos(t),this.save.vestiveis(t),this.save.slotAtivo(t),this.player.name)}abrirMochila(){this.ui.toggleMochila()}sincronizarVestiveis(){for(const t of[this.player,this.parceiro]){const e=t.rig.spec.id,n=this.save.vestiveis(e),s=n.some(c=>c?.id===pe.chapeuPingPong.id);t.rig.campeao!==s&&t.rig.setCampeao(s);const o=n.some(c=>c?.id===pe.patins.id);t.patins=o,t.rig.setPatins(o);const r=this.save.loadout(e),a=vi.map(c=>r[c]??"").join("|");this.roupaAplicada.get(e)!==a&&(this.roupaAplicada.set(e,a),t.rig.vestirRoupa(r))}}sincronizarMaos(){for(const t of[this.player.rig,this.parceiro.rig]){const e=t.spec.id,n=this.save.itemAtivo(e),s=n?.id??null;this.naMao.get(e)!==s&&(this.naMao.set(e,s),t.segurar(s?yv(s):null,n?.holdPose??"none"))}}roupaAplicada=new Map;abrirGuardaRoupa(){this.previa.mostrar(this.player.rig.spec),this.pintarArmario(),this.ui.abrirArmario()}pintarArmario(){const t=this.playerId(),e=this.save.vestiveis(t),n=this.save.maos(t).filter(s=>s!==null&&s.tipo==="vestivel");this.ui.renderArmario(e,n,this.player.name),this.previa.vestir(this.save.loadout(t))}unlock(t){this.save.addMemory(t)&&(this.audio.play("memoria"),this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,n=Math.PI/4){this.player.teleport(t,e,n),this.parceiro.teleport(t-1.2,e-.4,n),this.iso.snapTo(this.player.chest)}keyPressed(t){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.ui.dialogueOpen||this.ui.journalOpen||this.ui.menuOpen||this.player.locked?!1:this.input.isDown(t)}showCharge(t){this.audio.carga(t),this.ui.showCharge(t)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.riding?(this.player.object.updateWorldMatrix(!0,!1),this.player.object.getWorldPosition(new U)):this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}playerId(){return this.player.rig.spec.id}companionId(){return this.parceiro.rig.spec.id}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.riding?(this.parceiro.object.updateWorldMatrix(!0,!1),this.parceiro.object.getWorldPosition(new U)):this.parceiro.position.clone()}companionFacing(){return this.parceiro.rig.facing}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.maos.trocouCorpos(this.player,this.parceiro),this.audio.play("trocar"),this.ui.toast(`Agora você é ${this.player.name}`,"🔁"),this.ui.mochilaOpen&&this.pintarMochila(),this.ui.armarioOpen&&(this.previa.mostrar(this.player.rig.spec),this.pintarArmario())}submergePlayer(t){this.player.submersion=Ue.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=Ue.clamp(t,0,1)}rideCompanion(t,e,n=1,s=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(n),this.parceiro.rig.group.rotation.y=s,this.parceiro.rig.setFacing(s),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}holdCompanion(t,e){this.parceiro.hold(t,e)}setSitting(t){if(t&&this.audio.play("sentar"),this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t),!t){this.maos.ativo||(this.player.rig.setHoldingHands(0),this.parceiro.rig.setHoldingHands(0));return}const e=this.player.rig.group,n=this.parceiro.rig.group;e.updateWorldMatrix(!0,!1),n.updateWorldMatrix(!0,!1);const s=new U,o=new U;e.getWorldPosition(s),n.getWorldPosition(o);const a=new U(1,0,0).applyQuaternion(e.getWorldQuaternion(new Yi)).dot(o.sub(s))<0?-1:1;this.player.rig.setHoldingHands(a),this.parceiro.rig.setHoldingHands(a===1?-1:1)}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,n=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,n)}ridePlayer(t,e,n=1,s=Math.PI){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(n),this.player.rig.group.rotation.y=s,this.player.rig.setFacing(s),this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,n=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,n),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight),this.camOmbro&&(this.camOmbro.aspect=window.innerWidth/window.innerHeight,this.camOmbro.updateProjectionMatrix())};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function n_(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function wa(i=3,t=2.2,e=E.rug){const n=new S(new W(i,.04,t),I(e));return n.position.y=.02,n.receiveShadow=!0,n}function i_(i=E.sofa,t=2.2){const e=new ut,n=new S(new W(t,.42,.9),I(i));n.position.y=.28,e.add(n);const s=new S(new W(t,.62,.24),I(i));s.position.set(0,.72,-.35),e.add(s);for(const r of[-1,1]){const a=new S(new W(.24,.5,.9),I(i));a.position.set(r*(t/2-.12),.62,0),e.add(a)}for(const[r,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new S(new at(.05,.04,.14,6),I(E.woodDark));c.position.set(r*(t/2-.2),.07,a*.34),e.add(c)}const o=new S(new W(.36,.12,.34),I(E.flowerPink));return o.position.set(t/2-.5,.55,-.14),o.rotation.set(.9,.4,0),e.add(o),e}function s_(){const i=new ut,t=new S(new W(1.2,.08,.7),I(E.wood));t.position.y=.46,i.add(t);for(const[e,n]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const s=new S(new at(.04,.04,.46,6),I(E.woodDark));s.position.set(e*.5,.23,n*.27),i.add(s)}return i}function o_(i=!1){const t=new ut,e=new S(new W(1.8,.5,.45),I(E.woodDark));e.position.y=.25,t.add(e);const n=new S(new W(1.5,.85,.08),I(2040361));n.position.y=.95,t.add(n);const s=new S(new sn(1.36,.72),Vn(i?9426943:E.screen,1));return s.name="tela",s.position.set(0,.95,.05),t.add(s),t}function r_(i=2.1,t=1.2){const e=new ut,n=new S(new W(t,i,.32),I(E.woodDark));n.position.y=i/2,e.add(n);const s=Math.max(2,Math.floor(i/.5)),o=[14245951,4882400,16763213,6074447,16748465];for(let r=1;r<s;r++){const a=i/s*r;for(let c=0;c<5;c++){const l=new S(new W(.09,.3+c%3*.05,.2),I(o[(r+c)%o.length]));l.position.set(-t/2+.18+c*.13,a+.16,.06),l.rotation.z=c===4?.2:0,e.add(l)}}return e}function a_(i=E.fabricBlue){const t=new ut,e=new S(new W(1.5,.35,2.1),I(E.woodDark));e.position.y=.2,t.add(e);const n=new S(new W(1.44,.24,2),I(16184040));n.position.y=.49,t.add(n);const s=new S(new W(1.5,.14,1.35),I(i));s.position.set(0,.62,.3),t.add(s);const o=new S(new W(1,.16,.4),I(16777215));o.position.set(0,.66,-.72),t.add(o);const r=new S(new W(1.55,.7,.12),I(E.wood));return r.position.set(0,.6,-1.06),t.add(r),t}function c_(){const i=new ut,t=new S(new W(1.6,.08,.7),I(E.wood));t.position.y=.74,i.add(t);for(const o of[-.72,.72]){const r=new S(new W(.08,.74,.66),I(E.woodDark));r.position.set(o,.37,0),i.add(r)}const e=new S(new W(.8,.5,.06),I(2830136));e.position.set(0,1.08,-.18),i.add(e);const n=new S(new sn(.72,.42),Vn(10475775));n.position.set(0,1.08,-.14),i.add(n);const s=new S(new at(.05,.12,.24,8),I(2830136));return s.position.set(0,.86,-.18),i.add(s),i}function Ea(i=E.wood){const t=new ut,e=new S(new W(.5,.08,.5),I(i));e.position.y=.46,t.add(e);const n=new S(new W(.5,.55,.07),I(i));n.position.set(0,.75,-.22),t.add(n);for(const[s,o]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const r=new S(new W(.06,.46,.06),I(E.woodDark));r.position.set(s*.2,.23,o*.2),t.add(r)}return t}function l_(i=2.4){const t=new ut,e=new S(new W(i,.9,.65),I(E.wallMint));e.position.y=.45,t.add(e);const n=new S(new W(i+.08,.08,.72),I(E.concrete));n.position.y=.94,t.add(n);const s=new S(new W(.5,.06,.4),I(E.metalWhite));return s.position.set(i/2-.55,.97,0),t.add(s),t}function h_(){const i=new ut,t=new S(new W(.8,1.8,.7),I(E.metalWhite));t.position.y=.9,i.add(t);const e=new S(new W(.82,.03,.72),I(E.metalGrey));e.position.y=1.25,i.add(e);for(const n of[.7,1.45]){const s=new S(new W(.05,.3,.05),I(E.metalGrey));s.position.set(.3,n,.37),i.add(s)}return i}function Ta(i=1){const t=new ut,e=new S(new at(.22*i,.17*i,.34*i,10),I(E.plantPot));e.position.y=.17*i,t.add(e);for(let n=0;n<5;n++){const s=n/5*Math.PI*2,o=new S(new Ht(.2*i,8,6),I(n%2?E.leafMid:E.leafLight));o.scale.set(.5,1.5,.5),o.position.set(Math.cos(s)*.12*i,.6*i,Math.sin(s)*.12*i),o.rotation.z=Math.cos(s)*.4,o.rotation.x=-Math.sin(s)*.4,t.add(o)}return t}function Aa(i=.7,t=.55,e=E.skyDusk){const n=new ut,s=new S(new W(i,t,.05),I(E.woodDark));n.add(s);const o=new S(new sn(i-.1,t-.1),Vn(e));return o.position.z=.03,n.add(o),n}function Ih(i=1.2,t=1.2){const e=new ut,n=new S(new sn(i,t),Vn(E.glass,.55));e.add(n);const s=new S(new W(i+.12,.08,.08),I(E.metalWhite));s.position.y=t/2,e.add(s);const o=s.clone();o.position.y=-t/2,e.add(o);for(const r of[-1,1]){const a=new S(new W(.08,t,.08),I(E.metalWhite));a.position.x=r*i/2,e.add(a)}return e}function u_(i=16777215){const t=new ut,e=new S(new at(.07,.06,.13,10),I(i));e.position.y=.065,t.add(e);const n=new S(new Ce(.045,.014,6,12),I(i));return n.position.set(.08,.07,0),n.rotation.y=Math.PI/2,t.add(n),t}function d_(i=1.5,t=.9){const e=new ut,n=new S(new W(i,.09,t),I(E.wood));n.position.y=.75,e.add(n);for(const[o,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new S(new W(.08,.75,.08),I(E.woodDark));a.position.set(o*(i/2-.14),.37,r*(t/2-.14)),e.add(a)}const s=new S(new at(.07,.09,.16,10),I(E.wallMint));s.position.y=.87,e.add(s);for(const o of[-1,1]){const r=new S(new Ht(.06,8,6),I(o<0?E.flowerPink:E.flowerYellow));r.position.set(o*.05,1.03,0),e.add(r)}return e}function f_(i=!0){const t=new ut,e=new S(new at(.2,.24,.06,12),I(E.woodDark));e.position.y=.03,t.add(e);const n=new S(new at(.03,.03,1.5,8),I(E.metalGrey));n.position.y=.78,t.add(n);const s=new S(new at(.22,.3,.34,14,1,!0),I(i?16773324:15130320,{glow:i?.5:0,doubleSide:!0}));return s.position.y=1.68,t.add(s),t}function Ca(i=1.1){const t=new ut,e=new S(new W(i,.06,.24),I(E.wood));t.add(e);const n=[14245951,6074447,16763213];for(let o=0;o<3;o++){const r=new S(new W(.1,.24,.16),I(n[o]));r.position.set(-i/2+.2+o*.16,.15,0),t.add(r)}const s=new S(new Ht(.13,10,8),I(E.leafMid));return s.position.set(i/2-.22,.16,0),s.scale.y=.8,t.add(s),t}function p_(i=2){const t=new ut,e=new S(new W(i,.6,.34),I(E.wallCream));t.add(e);for(const n of[-1,1]){const s=new S(new W(.04,.16,.04),I(E.metalGrey));s.position.set(n*i*.22,-.18,.19),t.add(s)}return t}function m_(){const i=new ut,t=new S(new W(.66,.9,.64),I(E.metalWhite));t.position.y=.45,i.add(t);const e=new S(new at(.2,.2,.06,16),I(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,i.add(e);const n=new S(new at(.14,.14,.05,16),I(3884624));n.position.set(0,.5,.36),n.rotation.x=Math.PI/2,i.add(n);const s=new S(new W(.6,.12,.03),I(14673128));s.position.set(0,.82,.33),i.add(s);for(const o of[-.2,0,.2]){const r=new S(new at(.025,.025,.03,8),I(E.metalGrey));r.position.set(o,.82,.36),r.rotation.x=Math.PI/2,i.add(r)}return i}function oo(i=E.wood,t=.9,e=2.1,n=.24){const s=new ut,o=new S(new W(t,e,.08),I(i));o.position.y=e/2,s.add(o);for(const c of[-1,1]){const l=new S(new W(.09,e+.1,n),I(E.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),s.add(l)}const r=new S(new W(t+.2,.1,n),I(E.woodDark));r.position.y=e+.05,s.add(r);const a=new S(new Ht(.055,8,6),I(E.gold,{glow:.15}));return a.position.set(t/2-.14,e*.45,.07),s.add(a),s}function g_(i=E.wood,t=1.6,e=2.1){const n=new ut,s=.62,o=new S(new W(t,e,s),I(E.woodDark));o.position.y=e/2,n.add(o);const r=new S(new W(t-.12,e-.16,.04),I(3812127));r.position.set(0,e/2,s/2-.05),n.add(r);const a=t/2-.05;for(const c of[-1,1]){const l=new ut;l.position.set(c*a,e/2,s/2),c>0&&(l.rotation.y=-.62),n.add(l);const h=new S(new W(a,e-.1,.06),I(i));h.position.x=-c*a/2,l.add(h);const u=new S(new at(.022,.022,.16,8),I(E.metalGrey));u.position.set(-c*(a-.12),0,.06),l.add(u)}for(const c of[-1,1])for(const l of[-1,1]){const h=new S(new W(.1,.1,.1),I(E.woodDark));h.position.set(c*(t/2-.1),.05,l*(s/2-.1)),n.add(h)}return n}function v_(i=E.wood,t=1.7){const e=new ut,n=.62,s=new S(new W(n,t,.07),I(i));s.position.y=t/2,e.add(s);const o=new S(new W(n-.14,t-.16,.03),I(E.glass,{opacity:.72,glow:.12}));return o.position.set(0,t/2,.04),e.add(o),e.rotation.x=-.05,e}function __(){const i=new ut,t=new S(new W(.44,.5,.4),I(E.wood));t.position.y=.25,i.add(t);const e=new S(new W(.36,.14,.03),I(E.woodDark));e.position.set(0,.32,.21),i.add(e);const n=new S(new at(.06,.08,.16,8),I(E.metalGrey));n.position.y=.58,i.add(n);const s=new S(new at(.11,.15,.18,12,1,!0),I(16773324,{glow:.45,doubleSide:!0}));return s.position.y=.75,i.add(s),i}const bn={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},vn={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},x_=[bn,vn],Ra={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI},"do-quarto":{x:-5.05,z:-1.2,facing:Math.PI/2}},build(i){const t=i.game,e=async Q=>{for(const[bt,Wt]of Q)await t.say([Wt],bt)},n=bn.name,s=vn.name,o=12,r=9,a=-o/2,c=-r/2,l=2.8;i.ground({width:o,depth:r,color:E.floorWood}),i.setBounds(a+.45,c+.45,o/2-.45,r/2-.45),i.wall(a,c,o/2,c,l,E.wallCream);const h=-1.2,u=.95;i.wall(a,c,a,h-u/2,l,E.wallMint),i.wall(a,h+u/2,a,r/2,l,E.wallMint),i.wall(a,r/2,o/2,r/2,.45,E.wallCream),i.wall(o/2,-1.3,o/2,r/2,.45,E.wallCream);const d=.4,f=4.2,g=-1.3,_=(d+f)/2,m=(f+o/2)/2,p=.95,T=[d,_-p/2,_+p/2,m-p/2,m+p/2,o/2];for(let Q=0;Q<T.length;Q+=2)T[Q+1]-T[Q]>.05&&i.wall(T[Q],g,T[Q+1],g,l,E.wallCream);i.wall(d,c,d,g,l,E.wallCream),i.wall(f,c,f,g,l,E.wallCream),i.wall(o/2,c,o/2,g,l,E.wallCream);const b=new S(new W(o/2-d,.16,g-c),I(15129028));b.position.set((d+o/2)/2,l+.08,(c+g)/2),i.add(b);const x=i.add(i.place(oo(E.woodDark,.85,2.05),_,0,g)),L=i.add(i.place(oo(E.gold,.85,2.05),m,0,g));i.add(i.place(Aa(.6,.75,E.wallMint),3.55,1.75,g+.17)),i.add(i.place(Ca(.9),1.1,1.7,g+.19)),i.add(i.place(oo(E.fabricBlue,.9,2.1),a,0,h,Math.PI/2)),i.door({x:a+.85,z:h,to:"quarto",entry:"da-sala",label:"Entrar no quarto do Ari",icon:"🚪"}),i.add(i.place(l_(3.6),-3.4,0,c+.42)),i.blockBox(-3.4,c+.42,1.8,.4),i.add(i.place(p_(2.6),-3.4,2,c+.2)),i.add(i.place(h_(),a+.45,0,-2.6,Math.PI/2)),i.blockBox(a+.45,-2.6,.38,.42);const w=i.add(i.place(d_(1.5,.9),-3.6,0,-1.9,.08));i.blockBox(-3.6,-1.9,.8,.52,.08),i.add(i.place(Ea(),-4.7,0,-1.9,Math.PI/2)),i.add(i.place(Ea(),-2.5,0,-1.9,-Math.PI/2));const C=i.add(i.place(o_(!1),a+.35,0,.6,Math.PI/2));i.blockBox(a+.35,.6,.3,.9);const R=C.getObjectByName("tela");i.add(i.place(wa(3,2.6),-2.5,0,.6));const M=i.add(i.place(i_(E.fabricRed,2.4),-.3,0,.6,-Math.PI/2));i.blockBox(-.3,.6,.5,1.2),i.add(i.place(s_(),-2.4,0,.6,Math.PI/2)),i.blockBox(-2.4,.6,.38,.62);const v=i.add(i.place(u_(16773856),-2.4,.5,.9));i.add(i.place(f_(!0),-.4,0,2.3)),i.blockCircle(-.4,2.3,.3);const D=i.add(i.place(m_(),o/2-.65,0,2.9,-Math.PI/2));i.blockBox(o/2-.65,2.9,.35,.4),i.add(i.place(Ih(1.8,1.3),a+.16,1.75,2.4,Math.PI/2)),i.add(i.place(Aa(.8,.6,E.skyDusk),-3.4,1.95,c+.17)),i.add(i.place(Ca(1.1),-1.6,1.8,c+.2)),i.add(i.place(Ta(1.1),a+.8,0,r/2-1));const F=i.add(i.place(Ta(.75),4.9,0,1.4)),k=i.place(Eh(.75),-.3,2.4,.6);k.visible=!1,i.add(k);const Y=r/2;i.wall(2,Y,2.9,Y,2.6,E.wallCream),i.wall(3.9,Y,4.9,Y,2.6,E.wallCream);const j=i.add(i.place(oo(E.woodDark,.95,2.1),3.4,0,Y,Math.PI));i.blockBox(3.4,Y,.5,.12),i.add(i.place(wa(1.4,.8,12626050),3.4,0,r/2-1));const tt=new Te;tt.position.set(-.52,0,.6),tt.rotation.y=-Math.PI/2,i.root.add(tt);const et=new Te;et.position.set(-1.9,1.05,.6),i.root.add(et);let K=!1;const _t=Q=>{K=Q,R.material=I(Q?9426943:E.screen,{glow:Q?.55:0})};i.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:M,onInteract:async Q=>{if(await Q.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await Q.say(["Depois. Se sentar agora, não levanta mais."]);return}Q.lockPlayer(!0),Q.ridePlayer(tt,new U(-.52,.02,0),1,0),Q.rideCompanion(tt,new U(.52,.02,0),1,0),Q.setSitting(!0),_t(!0),Q.focusCamera(et),Q.setZoom(7.2),await Q.wait(.9),await Q.say(["Está passando Bo Burnham."]),await Q.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${Q.companionName()} tá rindo também.`]),await Q.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await Q.say(["Mais um. Só mais um.","Nunca é só mais um."]),Q.setSitting(!1),Q.focusCamera(null),Q.setZoom(10),Q.releasePlayer(-1.6,.4,-Math.PI/2),Q.releaseCompanion(-1.6,1.5,-Math.PI/2),Q.lockPlayer(!1),Q.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),i.interact({id:"casa:tv",x:a+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:C,onInteract:async Q=>{_t(!K),K&&Q.som("tv"),Q.toast(K?"TV ligada":"TV desligada","📺"),K&&await Q.say(["Está passando Bo Burnham."])}}),i.interact({id:"casa:geladeira",x:a+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:Q=>Q.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),i.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:Q=>Q.say(["Por algum milagre, a pia está limpa…"])}),i.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:w,onInteract:async Q=>{await e([[n,"Dois pratos, duas canecas. Já virou automático."],[s,"Três, se a Rubi sair do quarto."]]),Q.toast("Mesa posta","🍽️")}}),i.interact({id:"casa:maquina",x:o/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:D,onInteract:async Q=>{if(Q.flag("roupa-lavando")){await e([[s,"Ainda tá centrifugando."],[n,"Esse barulho é a trilha sonora dessa casa."]]);return}Q.setFlag("roupa-lavando"),Q.toast("Máquina ligada","🫧"),await e([[n,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[s,"Contanto que a Rubi não encha ela de novo antes."]])}}),i.interact({id:"casa:banheiro",x:m,z:g+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:L,onInteract:()=>e([[s,"Tem alguém aí?"],[n,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),i.interact({id:"casa:quarto",x:_,z:g+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:x,onInteract:async Q=>{await e([[n,"Acho que a Rubi está ouvindo kpop"],[s,"Para variar né"]]),Q.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),i.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:F,onInteract:async Q=>{if(Q.flag("planta-regada")){await Q.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}Q.setFlag("planta-regada"),F.scale.multiplyScalar(1.2),Q.toast("A plantinha cresceu um tiquinho","🌱"),await Q.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),i.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:v,onInteract:async Q=>{await Q.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),Q.toast("+1 disposição","☕")}}),i.interact({id:"casa:janela",x:a+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async Q=>{await Q.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),Q.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),i.door({x:3.4,z:r/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:j,radius:1.7}),i.onUpdate((Q,bt)=>{k.visible=i.game.flag("planta-regada"),k.position.y=2.4+Math.sin(bt*1.6)*.12,k.rotation.y=bt*.9})}},ue={x:0,z:-3,largura:16,profundidade:10,fundo:1.6};function wl(i,t,e=0){return Math.abs(i-ue.x)<ue.largura/2-e&&Math.abs(t-ue.z)<ue.profundidade/2-e}const El={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:0,z:12,facing:Math.PI},entries:{portaria:{x:0,z:12,facing:Math.PI},beira:{x:0,z:3.5,facing:Math.PI}},build(i){const t=i.game,e=async w=>{for(const[C,R]of w)await t.say([R],C)},n=bn.name,s=vn.name,o={x:ue.x,z:ue.z,width:ue.largura,depth:ue.profundidade};i.groundWithHoles({width:160,depth:160,color:E.grass,holes:[o]}),i.groundWithHoles({width:34,depth:26,color:14999766,y:.015,z:-1,holes:[o]}),i.setBounds(-22,-18,22,16),i.add(i.place(nv(ue.largura,ue.profundidade,ue.fundo),ue.x,0,ue.z));const r=iv(ue.largura,ue.profundidade);r.position.set(ue.x,-.12,ue.z),i.root.add(r);for(const w of[-5.2,-1.8,1.8,5.2]){const C=new S(new sn(.24,ue.profundidade-1.4),Vn(4164272));C.rotation.x=-Math.PI/2,C.position.set(ue.x+w,-1.6+.08,ue.z),i.root.add(C)}for(const w of[-5,5])i.add(i.place(sv(),w,0,ue.z+ue.profundidade/2));const a=i.add(i.place(rv(),0,0,ue.z-ue.profundidade/2-1.6));i.blockBox(0,ue.z-ue.profundidade/2-1.9,.4,.4);const c=[pr(E.frisbee),pr(16767070),pr(7328752)];c.forEach((w,C)=>{i.place(w,-4.5+C*4.6,-.05,ue.z-1.6+C%2*2.6),i.root.add(w)});const l=[E.fabricBlue,E.fabricRed,6074447,16763213];for(let w=0;w<6;w++){const C=-7.5+w*3;i.add(i.place(ul(l[w%l.length]),C,0,5.4,Math.PI)),i.blockBox(C,5.4,.36,.85),w%2===0&&(i.add(i.place(dl(w%4===0?E.fabricRed:4882400),C+1.5,0,6.9)),i.blockCircle(C+1.5,6.9,.3))}const h=i.add(i.place(ul(E.rug),10.5,0,2.2,-Math.PI/2));i.blockBox(10.5,2.2,.85,.36),i.add(i.place(dl(16748465),11.6,0,3.6)),i.blockCircle(11.6,3.6,.3);const u=i.add(i.place(ov(),-11,0,2.5,-Math.PI/2));i.blockCircle(-11,2.5,.3);const d=i.add(i.place(ma(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));i.blockBox(-12.5,7.2,1.4,1,.35);const f=i.add(i.place(ga(6,3.2,4,E.wallCream,8038084),13,0,-9));i.blockBox(13,-9,3,2),i.banco(13,-6.6),i.setSeed(90210);for(const[w,C]of[[-18,-8],[-17,1],[18,2],[19,-6],[-19,10],[18,11]])i.add(i.place(fa("palmeira",i.range(.95,1.2),i.rng()),w,0,C)),i.blockCircle(w,C,.5);for(let w=0;w<26;w++){const C=i.range(-20,20),R=i.range(-16,14);Math.abs(C)<18&&R>-14&&R<12||i.add(i.place(w%2?uo(i.range(.7,1.1)):pa(6,1.1),C,0,R))}for(let w=0;w<6;w++){const C=Sh(i.range(1.8,3));C.position.set(i.range(-60,60),i.range(40,52),i.range(-50,30)),i.root.add(C);const R=i.range(.2,.5);i.onUpdate(M=>{C.position.x+=R*M,C.position.x>62&&(C.position.x=-62)})}i.add(i.place(Dn(30,1.4,E.metalWhite),-6,0,14)),i.add(i.place(Dn(14,1.4,E.metalWhite),12,0,14)),i.blockBox(-6,14,15,.2),i.blockBox(12,14,7,.2);const g=i.add(i.place(Dn(4,1.6,E.gold),3.5,0,14));i.door({x:3.5,z:13,to:"villa-lobos",entry:"clube",label:"Voltar pro parque",icon:"🌳",highlight:g,radius:2.2});const _=[],m=(w,C,R=12)=>{t.som("agua");for(let M=0;M<R;M++){const v=new S(new Ht(.1+Math.random()*.1,6,5),Vn(14677247,.9)),D=M/R*Math.PI*2,F=.2+Math.random()*.5;v.position.set(w+Math.cos(D)*F,-.1,C+Math.sin(D)*F),i.root.add(v),_.push({mesh:v,vy:2.2+Math.random()*2.4,vida:1})}};let p=0,T=0,b=!1;i.onUpdate((w,C)=>{r.position.y=-.12+Math.sin(C*1.4)*.015,c.forEach((F,k)=>{F.position.y=-.05+Math.sin(C*1.1+k*1.7)*.05,F.rotation.y=Math.sin(C*.4+k)*.4});const R=t.playerPosition(),M=t.companionPosition(),v=wl(R.x,R.z,.2)?1:0,D=wl(M.x,M.z,.2)?1:0;p+=(v-p)*Math.min(1,w*5),T+=(D-T)*Math.min(1,w*5),t.submergePlayer(p),t.submergeCompanion(T),v===1&&!b&&(b=!0,m(R.x,R.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let F=_.length-1;F>=0;F--){const k=_[F];k.vy-=9*w,k.mesh.position.y+=k.vy*w,k.vida-=w*.9,k.mesh.material.opacity=Math.max(0,k.vida),(k.vida<=0||k.mesh.position.y<-.6)&&(i.root.remove(k.mesh),k.mesh.geometry.dispose(),_.splice(F,1))}});const x=new Te;i.root.add(x),i.interact({id:"clube:trampolim",x:0,z:ue.z-ue.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:a,onInteract:async w=>{w.lockPlayer(!0),await w.say(["Do trampolim?","Do trampolim."]);const C=new U(0,.95,ue.z-ue.profundidade/2-.4),R=new U(0,-.6,ue.z+1.2);x.position.copy(C),w.ridePlayer(x,new U(0,0,0),1);const M=1.15;for(let v=0;v<M;v+=1/60){const D=v/M;x.position.lerpVectors(C,R,D),x.position.y+=Math.sin(D*Math.PI)*2.6,await w.wait(1/60)}m(R.x,R.z,18),w.releasePlayer(R.x,R.z,Math.PI),w.lockPlayer(!1),w.toast("Splash!","💦"),w.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),i.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:h,onInteract:async w=>{await w.say(["Sol na cara, barulho de água, ninguém com pressa.",`${w.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),w.toast("+1 preguiça boa","🌞")}});let L=0;i.onUpdate(w=>{L<=0||(L-=w,L<=0&&(t.removeItem(pe.sucoMorango.id,vn.id),t.removeItem(pe.sucoPessego.id,bn.id),t.toast("Acabou o suco","🍹")))}),i.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:d,onInteract:async w=>{await e([[s,"Vou pedir um de morango pra mim e um de pêssego pra você, que é o seu favorito."],[n,"Awnn gracias amorzito"]]),L=50,w.addItem(pe.sucoMorango,vn.id),w.addItem(pe.sucoPessego,bn.id),w.som("sorvete"),w.toast("Morango e pêssego","🍹")}}),i.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:u,onInteract:async w=>{m(-10.6,2.5,8),await w.say(["Gelada. Sempre gelada."])}}),i.interact({id:"clube:vestiario",x:13,z:-6.6,radius:2.2,label:"Vestiário",icon:"🩳",highlight:f,onInteract:w=>w.say(["Cinco minutos pra trocar de roupa. Você demora quinze."])})}},xn=8,fn=6.5,$e=-xn/2,pn=-fn/2,Tl=2.8,Ni={x:2.65,z:pn+.36},M_=[pe.gorroDeLa,pe.camisaListrada,pe.calcaJeans,pe.botaAmarela,pe.vestidoRosa,pe.gargantilhaDeLaco],Al={id:"quarto",name:"Quarto do Ari",subtitle:"a porta que fica sempre encostada",ambient:{sky:14872311,indoor:!0,sunColor:16774366,sunIntensity:.95,ambientColor:15397883,ambientIntensity:1.45,sunDir:[10,15,12]},spawn:{x:.9,z:1.7,facing:Math.PI},entries:{"da-sala":{x:.9,z:1.7,facing:Math.PI}},build(i){const t=i.game,e=async d=>{for(const[f,g]of d)await t.say([g],f)},n=bn.name,s=vn.name;i.ground({width:xn,depth:fn,color:E.floorWood}),i.setBounds($e+.45,pn+.45,xn/2-.45,fn/2-.45),i.wall($e,pn,xn/2,pn,Tl,E.wallAzul),i.wall($e,pn,$e,fn/2,Tl,E.wallAzul),i.wall(xn/2,pn,xn/2,fn/2,.45,E.wallAzul);const o=.9,r=1.1;i.wall($e,fn/2,o-r/2,fn/2,.45,E.wallAzul),i.wall(o+r/2,fn/2,xn/2,fn/2,.45,E.wallAzul);for(const[d,f,g,_]of[[0,pn+.06,xn,0],[$e+.06,0,fn,Math.PI/2]]){const m=new S(new W(g,.12,.05),I(12176860));m.position.set(d,.06,f),m.rotation.y=_,i.add(m)}const a=i.add(i.place(a_(E.fabricBlue),-2.2,0,-1.75));i.blockBox(-2.2,-1.75,.78,1.08),i.add(i.place(__(),-1.05,0,-2.72)),i.blockBox(-1.05,-2.72,.24,.22);const c=i.add(i.place(r_(1.9,1.1),.15,0,pn+.22));i.blockBox(.15,pn+.22,.55,.18);const l=i.add(i.place(g_(E.wallMint),Ni.x,0,Ni.z));i.blockBox(Ni.x,Ni.z,.8,.32);const h=i.add(i.place(v_(E.woodDark),$e+.12,0,-.6,Math.PI/2));i.add(i.place(Ih(1.6,1.2),$e+.16,1.7,1,Math.PI/2));const u=i.add(i.place(c_(),$e+.5,0,2,-Math.PI/2));i.blockBox($e+.5,2,.4,.82),i.add(i.place(Ea(E.woodDark),$e+1.35,0,2,-Math.PI/2)),i.add(i.place(wa(2.6,2,E.rug),.3,0,1.1)),i.add(i.place(Ta(1.15),xn/2-.75,0,.9)),i.blockCircle(xn/2-.75,.9,.3),i.add(i.place(Aa(.6,.75,E.flowerPink),-2.2,1.85,pn+.17)),i.add(i.place(Ca(.9),1.05,1.9,pn+.19)),i.door({x:o,z:fn/2-.7,to:"casa",entry:"do-quarto",label:"Voltar pra sala",icon:"🚪"}),i.interact({id:"quarto:armario",x:Ni.x,z:Ni.z+1.25,radius:1.8,label:"Abrir o armário",icon:"🚪",highlight:l,onInteract:async d=>{for(const f of[d.playerId(),d.companionId()])for(const g of M_)d.storeItem(g,f);d.flag("armario-aberto")||(d.setFlag("armario-aberto"),await e([[n,"Pode mexer, fica à vontade."],[s,"Tem mais roupa aqui do que no meu apartamento inteiro."]]),d.unlock({id:"armario-do-ari",title:"O armário do Ari",place:"Quarto do Ari",note:"Ele sabe exatamente onde está cada peça. Eu ainda perco meia hora procurando meia.",icon:"👕"})),d.abrirGuardaRoupa()}}),i.interact({id:"quarto:espelho",x:$e+.95,z:-.6,radius:1.5,label:"Se olhar no espelho",icon:"🪞",highlight:h,onInteract:async d=>{if(d.wearables().filter(g=>g!==null).length===0){await e([[s,"Tô bem assim?"],[n,"Tá. Mas tem um armário inteiro logo ali."]]);return}await e([[n,`Olha só, ${d.playerName()}.`],[s,"Ficou bom mesmo."]])}}),i.interact({id:"quarto:cama",x:-2.2,z:-.5,radius:1.6,label:"Olhar a cama",icon:"🛏️",highlight:a,onInteract:()=>e([[s,"Essa cama é bem melhor que a minha."],[n,"É a mesma cama de sempre."],[s,"Não é a cama então."]])}),i.interact({id:"quarto:mesa",x:$e+1.5,z:2,radius:1.5,label:"Olhar a escrivaninha",icon:"💻",highlight:u,onInteract:()=>e([[n,"É daqui que eu te mando mensagem de madrugada."],[s,"Eu sei. Eu tô acordado do outro lado."]])}),i.interact({id:"quarto:estante",x:.35,z:-2.2,radius:1.4,label:"Olhar a estante",icon:"📚",highlight:c,onInteract:()=>e([[s,"Você leu todos esses?"],[n,"Comecei todos esses."]])})}};function y_(i,t,e,n){const s=new U().subVectors(t,i),o=s.length(),r=new S(new at(e,e*1.15,o,8),n);return r.position.copy(i).addScaledVector(s,.5),r.quaternion.setFromUnitVectors(new U(0,1,0),s.normalize()),r}class S_{group=new ut;cabins=[];radius;hubHeight;speed;angle=0;rim=new ut;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,n=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const s=I(t.frameColor??E.metalWhite),o=this.hubHeight=e+2.6,r=e*.075;for(const C of[-r,r]){const R=new S(new Ce(e,e*.019,8,72),s);R.position.z=C,this.rim.add(R)}const a=Math.min(48,n*2);for(let C=0;C<a;C++){const R=C/a*Math.PI*2,M=new S(new W(e*.012,e*.012,r*2),s);M.position.set(Math.cos(R)*e,Math.sin(R)*e,0),this.rim.add(M)}const c=[];for(let C=0;C<a;C++){const R=C/a*Math.PI*2,M=(C+1)/a*Math.PI*2,v=C%2===0?-r:r,D=C%2===0?r:-r;c.push(Math.cos(R)*e,Math.sin(R)*e,v,Math.cos(M)*e,Math.sin(M)*e,D)}this.rim.add(new Tc(Cl(c),al(14673642)));const l=[];for(let C=0;C<n;C++){const R=C/n*Math.PI*2,M=Math.cos(R)*e,v=Math.sin(R)*e;l.push(0,0,-r*.5,M,v,-r),l.push(0,0,r*.5,M,v,r)}this.rim.add(new Tc(Cl(l),al(15660022)));const h=new S(new at(e*.085,e*.085,e*.3,14),s);h.rotation.x=Math.PI/2,this.rim.add(h);for(const C of[-e*.17,e*.17]){const R=new S(new at(e*.11,e*.07,e*.06,14),I(E.metalGrey));R.rotation.x=Math.PI/2,R.position.z=C,this.rim.add(R)}this.rim.position.y=o,this.group.add(this.rim);const u=I(t.cabinColor??E.metalWhite),d=I(7321304,{opacity:.5}),f=e*.068;for(let C=0;C<n;C++){const R=new ut,M=new S(new W(.09,f*1.1,.09),I(E.metalGrey));M.position.y=f*1.25,R.add(M);const v=new S(new Fn(f,f*.5,5,16),u);v.scale.set(1,1,.92),R.add(v);const D=new S(new at(f*1.02,f*1.02,f*.95,18,1,!0),d);D.position.y=f*.12,D.scale.z=.92,R.add(D),R.traverse(F=>{F.isMesh&&(F.castShadow=!0)}),this.cabins.push(R),this.group.add(R)}const g=e*.42,_=new U(0,o,-e*.04),m=new U(0,o,e*.04),p=[[_,new U(-e*.2,0,-g)],[_,new U(e*.2,0,-g)],[m,new U(-e*.2,0,g)],[m,new U(e*.2,0,g)]];for(const[C,R]of p){const M=y_(C.clone(),R.clone(),e*.03,s);M.castShadow=!0,this.group.add(M)}for(const C of[-g,g]){const R=new S(new W(e*.42,e*.022,e*.022),s);R.position.set(0,e*.16,C),this.group.add(R)}const T=new S(new at(e*.62,e*.67,.35,26),I(E.concrete));T.position.y=.16,T.receiveShadow=!0,this.group.add(T);const b=e*.4,x=g*.92;for(const[C,R]of[[-b,-x],[b,-x],[-b,x],[b,x]]){const M=new S(new at(e*.055,e*.055,e*.16,12),I(E.metalRed));M.position.set(C,e*.08,R),M.castShadow=!0,this.group.add(M)}const L=new S(new W(e*.55,.55,e*.3),I(E.metalGrey));L.position.set(0,.4,g*.9),L.castShadow=!0,L.receiveShadow=!0,this.group.add(L);const w=new S(new at(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),I(E.fabricRed));w.position.set(0,1.9,g*.9),w.rotation.set(0,0,Math.PI/2),w.scale.z=.6,this.group.add(w);for(const C of[-e*.15,e*.15]){const R=new S(new at(.06,.06,1.8,8),I(E.metalWhite));R.position.set(C,.9,g*.9),this.group.add(R)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const n of this.cabins)n.position.y<e&&(e=n.position.y,t=n);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function Cl(i){const t=new Ne;return t.setAttribute("position",new le(i,3)),t}class b_{mesh;state="chao";velocity=new U;spin=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=wh(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}pickUp(){this.state="guardado",this.velocity.set(0,0,0)}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,n=0,s=1){const o=e.x-t.x,r=e.z-t.z,a=Math.hypot(o,r),c=(Math.random()-.5)*n;this.throwFrom(t,Math.atan2(o,r)+c,this.powerFor(a,s),s)}throwAt(t,e,n,s=1){this.throwFrom(t,e,this.powerFor(n,s),s)}powerFor(t,e=1){let n=.25,s=1.7;for(let o=0;o<14;o++){const r=(n+s)/2;this.simulateRange(r,e)<t?n=r:s=r}return Ue.clamp((n+s)/2,.25,1.7)}simulateRange(t,e=1){let n=1.15,s=3.4*t*e,o=11*t,r=0;const a=1/60;for(let c=0;c<900&&n>.06;c++){const l=s>-1.2?this.lift:0;s-=(this.gravity-l)*a,o*=1-.35*a,r+=o*a,n+=s*a}return r}throwFrom(t,e,n=1,s=1){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const o=11*n;this.velocity.set(Math.sin(e)*o,3.4*n*s,Math.cos(e)*o),this.spin=22}update(t,e){if(this.state!=="voando")return;const n=this.velocity.y>-1.2?this.lift:0;this.velocity.y-=(this.gravity-n)*t,this.velocity.x*=1-.35*t,this.velocity.z*=1-.35*t,this.mesh.position.addScaledVector(this.velocity,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08;const s=Ue.clamp(this.mesh.position.x,e.minX+1,e.maxX-1),o=Ue.clamp(this.mesh.position.z,e.minZ+1,e.maxZ-1);(s!==this.mesh.position.x||o!==this.mesh.position.z)&&(this.mesh.position.x=s,this.mesh.position.z=o,this.velocity.multiplyScalar(.2)),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.onLand?.(this.mesh.position.clone()))}}const ze={largura:2.6,profundidade:1.4,altura:.76},w_=.055,ps=ze.largura/2+.22,E_=ps+.9,Rl=.28,T_=ze.altura+.19,A_=6.6,C_=.72,rs=ze.profundidade/2+.12,Qe={vxBase:3.5,vxMin:2.9,vxMax:4.4,energiaParaVx:.05,vyBase:1.9,alturaParaVy:1.5,subidaParaVy:.12,vyMin:.75,vyMax:2.4,heranca:.25,lateralParaVz:.2,vzMax:1.05,velocidadeMaximaRaquete:6};class R_{grupo=new ut;bola;minhaRaquete;raqueteDele;fase="parado";meus=0;dele=0;alvo;onSom=null;onPonto=null;onFim=null;v=new U;espera=0;sacaEu=!0;rebatedor="eu";quiquesNoAlvo=0;lateralRaquete=0;subidaRaquete=0;zAnterior=0;yAnterior=0;erroDele=0;constructor(t=5){this.alvo=t,this.bola=bh(),this.grupo.add(this.bola),this.minhaRaquete=So(E.metalRed),this.raqueteDele=So(E.fabricBlue),this.minhaRaquete.rotation.y=Math.PI/2,this.raqueteDele.rotation.y=-Math.PI/2,this.minhaRaquete.scale.setScalar(1.15),this.raqueteDele.scale.setScalar(1.15),this.grupo.add(this.minhaRaquete,this.raqueteDele),this.resetar()}comecar(){this.meus=0,this.dele=0,this.sacaEu=!0,this.resetar()}guardar(){this.fase="parado",this.grupo.visible=!1}resetar(){this.fase="sacando",this.espera=1.1,this.grupo.visible=!0;const t=this.sacaEu?-1:1;this.bola.position.set(t*(ze.largura/2-.3),ze.altura+.45,0),this.v.set(0,0,0),this.minhaRaquete.position.set(-ps,ze.altura+.3,0),this.raqueteDele.position.set(ps,ze.altura+.3,0),this.zAnterior=0,this.yAnterior=ze.altura+.3,this.lateralRaquete=0,this.subidaRaquete=0,this.sortearErro()}sortearErro(){const t=Math.random()<.25;this.erroDele=(Math.random()-.5)*(t?1.5:.5)}update(t,e){if(!(this.fase==="parado"||this.fase==="fim")){if(this.moverMinhaRaquete(t,e),this.moverRaqueteDele(t),this.fase==="ponto"||this.fase==="sacando"){this.espera-=t,this.espera<=0&&(this.fase==="ponto"?this.resetar():this.sacar());return}this.voar(t)}}sacar(){this.fase="jogando",this.rebatedor=this.sacaEu?"eu":"ele",this.quiquesNoAlvo=0,this.v.set(this.sacaEu?3.4:-3.4,1.45,(Math.random()-.5)*.6),this.onSom?.("lancar")}moverMinhaRaquete(t,e){const n=Ue.clamp(e.x*rs,-rs,rs),s=ze.altura+.16+Ue.clamp((e.y+.35)*.6,0,.75);this.minhaRaquete.position.z+=(n-this.minhaRaquete.position.z)*Math.min(1,t*18),this.minhaRaquete.position.y+=(s-this.minhaRaquete.position.y)*Math.min(1,t*14);const o=Qe.velocidadeMaximaRaquete;t>0&&(this.lateralRaquete=Ue.clamp((this.minhaRaquete.position.z-this.zAnterior)/t,-o,o),this.subidaRaquete=Ue.clamp((this.minhaRaquete.position.y-this.yAnterior)/t,-o,o)),this.zAnterior=this.minhaRaquete.position.z,this.yAnterior=this.minhaRaquete.position.y}moverRaqueteDele(t){const e=this.v.x>0,n=e?this.bola.position.z+this.erroDele:0,s=e?4.6:1.6;this.raqueteDele.position.z+=(n-this.raqueteDele.position.z)*Math.min(1,t*s),this.raqueteDele.position.z=Ue.clamp(this.raqueteDele.position.z,-rs,rs);const o=e?Ue.clamp(this.bola.position.y,ze.altura+.16,ze.altura+.9):ze.altura+.3;this.raqueteDele.position.y+=(o-this.raqueteDele.position.y)*Math.min(1,t*4)}voar(t){const e=this.bola.position,n=e.x;if(this.v.y-=A_*t,e.addScaledVector(this.v,t),(n<0&&e.x>=0||n>0&&e.x<=0)&&e.y<T_){this.onSom?.("quicar"),this.marcar(this.rebatedor==="ele","na rede");return}const o=ze.altura+w_,r=Math.abs(e.x)<=ze.largura/2&&Math.abs(e.z)<=ze.profundidade/2;if(e.y<=o&&this.v.y<0&&r){if(e.y=o,this.v.y=-this.v.y*C_,this.onSom?.("quicar"),(e.x<0?"eu":"ele")===this.rebatedor){this.marcar(this.rebatedor==="ele","quique no próprio campo");return}if(this.quiquesNoAlvo+=1,this.quiquesNoAlvo>=2){this.marcar(this.rebatedor==="eu","dois quiques");return}}for(const[c,l,h]of[[-1,this.minhaRaquete,"eu"],[1,this.raqueteDele,"ele"]]){const u=c*ps;!(c<0?n>u&&e.x<=u:n<u&&e.x>=u)||this.rebatedor===h||!(Math.abs(e.z-l.position.z)<Rl&&Math.abs(e.y-l.position.y)<Rl)||(e.x=u,this.rebater(h==="eu"?1:-1,l.position.y,h==="eu"),this.rebatedor=h,this.quiquesNoAlvo=0,this.onSom?.("pegar"),h==="ele"&&this.sortearErro())}(e.y<.12||Math.abs(e.x)>E_||Math.abs(e.z)>2.2)&&(this.quiquesNoAlvo>=1?this.marcar(this.rebatedor==="eu","não alcançou"):this.marcar(this.rebatedor==="ele","fora"))}rebater(t,e,n){const s=n?this.lateralRaquete:this.miraDoParceiro(),o=n?this.subidaRaquete:0,r=Math.abs(s)+Math.abs(o),a=Ue.clamp(Qe.vxBase+r*Qe.energiaParaVx,Qe.vxMin,Qe.vxMax),c=Ue.clamp(Qe.vyBase-(e-(ze.altura+.14))*Qe.alturaParaVy+o*Qe.subidaParaVy,Qe.vyMin,Qe.vyMax),l=Ue.clamp(this.v.z*Qe.heranca+s*Qe.lateralParaVz,-1.05,Qe.vzMax);this.v.set(t*a,c,l)}miraDoParceiro(){const t=-this.bola.position.z*1.2,e=(Math.random()-.5)*2.4;return Ue.clamp(t+e,-4,4)}marcar(t,e){if(t?this.meus+=1:this.dele+=1,this.sacaEu=!t,this.onPonto?.(t,e),this.meus>=this.alvo||this.dele>=this.alvo){this.fase="fim",this.onFim?.(this.meus>=this.alvo);return}this.fase="ponto",this.espera=1.3}}const P_={plano:ps},Pl={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:E.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(i){const t=i.game,e=async O=>{for(const[G,ht]of O)await t.say([ht],G)},n=bn.name,s=vn.name,o={x:-8.6,z:2.5},r={x:-21,z:-5,reta:5,raio:5,miolo:2.4},a={x:o.x+4.72,z:o.z+.2},c={x:18,z:-4.5,largura:26,profundidade:19},l={x:-15.5,z:20.5,giro:.35},h=(O,G,ht=0)=>Math.abs(O-c.x)<c.largura/2-ht&&Math.abs(G-c.z)<c.profundidade/2-ht;i.ground({width:240,depth:240,color:E.grass}),i.setBounds(-44,-34,44,32);for(let O=0;O<14;O++)i.disc(i.range(-40,40),i.range(-30,30),i.range(2,6),E.grassDark,.004);i.disc(0,-16.5,8.6,E.sand,.008),i.disc(0,-16.5,8,E.concrete,.012),i.patch(0,4,5.5,56,E.asphalt,0,.016),i.patch(0,9,62,4.5,E.asphalt,0,.02);const u=(O,G,ht)=>{i.patch(r.x,r.z,r.reta*2,O*2,G,0,ht),i.disc(r.x-r.reta,r.z,O,G,ht),i.disc(r.x+r.reta,r.z,O,G,ht)},d=.3;u(r.raio,E.metalWhite,.022),u(r.raio-d,E.asphalt,.026),u(r.miolo+d,E.metalWhite,.03),u(r.miolo,E.grass,.034);const f=(r.raio+r.miolo)/2,g=[1.15,.17];for(const O of[-1,1]){for(let ht=0;ht<5;ht++){const qt=r.x-r.reta+1+ht*(r.reta*2-2)/4;i.patch(qt,r.z+O*f,g[0],g[1],E.metalWhite,0,.038)}const G=r.x+O*r.reta;for(let ht=0;ht<6;ht++){const qt=-Math.PI/2+(ht+.5)/6*Math.PI,Kt=O>0?qt:qt+Math.PI;i.patch(G+Math.cos(Kt)*f,r.z+Math.sin(Kt)*f,g[0],g[1],E.metalWhite,-(Kt+Math.PI/2),.038)}}i.patch(r.x+r.reta*.55,r.z+f,.32,r.raio-r.miolo-d*2,E.metalWhite,0,.04),i.patch(o.x+.4,o.z+.2,10,6.4,E.concrete,0,.02),i.patch(o.x+1.6,7.2,3,7,E.asphalt,0,.022);const _=new S_({radius:12,cabins:32,rpm:1});i.place(_.group,0,0,-26),i.add(_.group),i.blockCircle(0,-26,7.2);for(const O of[-11,11])i.add(i.place(Dn(9,1.2,E.metalWhite),O,0,-20,Math.PI/2)),i.blockBox(O,-20,.2,4.5);i.add(i.place(Zg(2.6),-9.5,0,-21,.4)),i.blockCircle(-9.5,-21,2.7);const m=i.add(i.place(ma(E.fabricBlue,{texto:"Bilheteria"}),9.5,0,-20.5,-.5));i.blockBox(9.5,-20.5,1.4,.95,-.5);const p=[[-6.4,-13.6,1.15],[6.4,-13.6,1.15],[-8.6,-17.4,.95],[8.6,-17.4,.95]];for(const[O,G,ht]of p)i.add(i.place(Jg(ht,void 0,i.rng()),O,0,G,i.range(0,6.28))),i.blockCircle(O,G,ht+.1);for(const[O,G]of[[-7.6,-11.4],[7.6,-11.4],[-12.2,-19],[12.2,-19]])i.add(i.place(dr(!1),O,0,G)),i.blockCircle(O,G,.35);for(const[O,G,ht]of[[-3.6,-12.2,.1],[3.6,-12.2,-.1],[-13.2,-22.5,1.1]])i.banco(O,G,ht);for(const[O,G]of[[6.9,-18.9],[-5.2,-11.6]])i.add(i.place(ll(),O,0,G)),i.blockCircle(O,G,.35);for(let O=0;O<22;O++){const G=O/22*Math.PI*2+i.range(-.1,.1),ht=i.range(10.5,13.5),qt=Math.cos(G)*ht,Kt=-18+Math.sin(G)*ht*.7;Math.abs(qt)<4.5&&Kt>-14||(O%3===0?i.add(i.place(uo(i.range(.6,1),E.leafDark),qt,0,Kt)):O%3===1?i.add(i.place(cl(i.range(.9,1.4)),qt,0,Kt,i.range(0,6.28))):i.add(i.place(no(i.range(.4,.8),i.rng()),qt,0,Kt,i.range(0,6.28))))}i.disc(-21,11,9.2,E.sand,.024),i.disc(-21,11,8.5,E.water,.028),i.blockCircle(-21,11,8.8);const T=[fr(),fr(15262416),fr()];T.forEach((O,G)=>{i.place(O,-21+Math.cos(G*2.1)*4.5,.1,11+Math.sin(G*2.1)*3.5,G*1.7),i.add(O)});const b={x:-21,z:11};for(let O=0;O<34;O++){const G=O/34*Math.PI*2+i.range(-.09,.09),ht=i.range(9.1,11.4),qt=b.x+Math.cos(G)*ht,Kt=b.z+Math.sin(G)*ht,on=O%4;on===0?i.add(i.place(uo(i.range(.6,1),E.leafDark),qt,0,Kt)):on===1?i.add(i.place(cl(i.range(.9,1.5)),qt,0,Kt,i.range(0,6.28))):on===2?i.add(i.place(no(i.range(.45,1.5),i.rng()),qt,0,Kt,i.range(0,6.28))):i.add(i.place(pa(5,.8),qt,0,Kt))}for(const[O,G,ht]of[[.9,8.4,1.6],[2.6,8.7,1.1],[4.3,8.3,1.9],[5.6,8.9,1.2]]){const qt=b.x+Math.cos(O)*G,Kt=b.z+Math.sin(O)*G;i.add(i.place(no(ht,O%1,9409947),qt,-.12,Kt,O)),i.blockCircle(qt,Kt,.4*ht)}for(const[O,G]of[[1.5,8.2],[3.4,8.4],[5.1,8.1],[.2,8.5]])i.add(i.place(Yg(i.range(1.1,1.6)),b.x+Math.cos(O)*G,0,b.z+Math.sin(O)*G));const x=[[1.1,6.6,1,!0],[2.9,7.2,.8,!1],[4.6,6.1,1.15,!0],[.4,7.4,.9,!0],[3.8,5.2,1.05,!1],[5.9,6.8,.85,!0]];for(const[O,G,ht,qt]of x){const Kt=i.place(jg(ht,qt),b.x+Math.cos(O)*G,.045,b.z+Math.sin(O)*G);Kt.rotation.y=O,i.add(Kt)}const L=c.x-c.largura/2,w=c.x+c.largura/2,C=c.z-c.profundidade/2,R=c.z+c.profundidade/2;i.patch(c.x,c.z,c.largura,c.profundidade,E.grassDark,0,.008);const M=(O,G,ht,qt)=>{i.patch(O,G,ht,qt,15922416,0,.012)};M(c.x,C+.3,c.largura-1.2,.28),M(c.x,R-.3,c.largura-1.2,.28),M(L+.6,c.z,.28,c.profundidade-.6),M(w-.6,c.z,.28,c.profundidade-.6),M(c.x,c.z,.28,c.profundidade-.6),M(L+6,c.z,.22,c.profundidade-.6),M(w-6,c.z,.22,c.profundidade-.6),i.disc(c.x,c.z,2.2,15922416,.011),i.disc(c.x,c.z,1.9,E.grassDark,.012);const v=(O,G,ht,qt)=>{i.add(i.place(Dn(ht,1.5,E.metalWhite),O,0,G,qt?Math.PI/2:0)),qt?i.blockBox(O,G,.2,ht/2):i.blockBox(O,G,ht/2,.2)};v(c.x,C,c.largura,!1),v(c.x,R,c.largura,!1),v(w,c.z,c.profundidade,!0),v(L,C+3.75,7.5,!0),v(L,R-3.75,7.5,!0),i.add(i.place(pl(),L+3,0,c.z)),i.blockCircle(L+3,c.z,.5);const D=i.add(i.place(pl(E.frisbee),w-3,0,c.z));i.blockCircle(w-3,c.z,.5);const F=i.add(i.place(av(),c.x,0,C+1.2));i.blockBox(c.x,C+1.2,1,.2);const k=i.add(i.place(cv(6),c.x,0,R-1.2,Math.PI));i.blockBox(c.x,R-1.4,3,.8);const Y=i.add(i.place(lv(),L+1.6,0,c.z+4.2,Math.PI/2));i.blockCircle(L+1.6,c.z+4.2,.4);const j=i.add(i.place(hv(),L+1.8,0,c.z-3.4,.4)),tt=i.add(i.place(dv(),w-1.6,0,R-2.4));i.blockCircle(w-1.6,R-2.4,.3);const et=tt.userData.manga;i.onUpdate((O,G)=>{tt.rotation.y=Math.sin(G*.3)*.5+.6,et.rotation.z=Math.sin(G*1.7)*.12-.06});for(const[O,G]of[[L+1,C+1],[w-1,C+1],[L+1,R-1],[w-1,R-1]])i.add(i.place(uv(),O,0,G,Math.atan2(c.x-O,c.z-G))),i.blockCircle(O,G,.4);for(const[O,G]of[[L+6,C+1.4],[L+6,R-1.4],[w-6,C+1.4],[w-6,R-1.4]])i.add(i.place(hl(),O,0,G));const K=i.add(i.place(ml("Frisbee!",E.frisbee),L-1.8,0,c.z+3.4,Math.PI*.25));i.blockCircle(L-1.8,c.z+3.4,.3);const _t=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[O,G,ht]of _t)i.banco(O,G,ht);for(const[O,G]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,2]])i.add(i.place(dr(!1),O,0,G)),i.blockCircle(O,G,.35);for(const[O,G]of[[3.4,17],[-3.4,11]])i.add(i.place(ll(),O,0,G)),i.blockCircle(O,G,.35);const Q=i.add(i.place(Kg(),-10,0,20,.3));i.blockBox(-10,20,1,.9,.3);const bt=tv(),Wt=So(E.metalRed);Wt.position.set(-.78,.82,.3),Wt.rotation.set(-Math.PI/2,0,.7),bt.add(Wt);const te=So(E.fabricBlue);te.position.set(.82,.82,-.28),te.rotation.set(-Math.PI/2,0,-2.3),bt.add(te);const ce=bh();ce.position.set(.36,.845,.42),bt.add(ce),i.add(i.place(bt,l.x,0,l.z,l.giro)),i.blockBox(l.x,l.z,1.45,.85,l.giro);const se=[Wt,te,ce],nt=i.add(i.place(ma(16164544,{tipo:"sorvete"}),12,0,18.6,.3));i.blockBox(12,18.6,1.4,.95,.3);const ct=i.add(i.place(ev(E.fabricBlue),o.x,0,o.z));ct.userData.loja=!0,i.blockBox(o.x,o.z-.05,3.7,2.3),i.blockBox(a.x,a.z,.65,1.6);for(const O of[-1,1])i.blockCircle(o.x+O*4.05,o.z+2.82,.16);for(const O of[-1.4,1])i.banco(o.x-5.6,o.z+O,Math.PI/2);for(const[O,G]of[[r.x-r.reta-r.raio-1.4,r.z],[r.x+r.reta+r.raio+1.4,r.z]])i.add(i.place(dr(!1),O,0,G)),i.blockCircle(O,G,.35);const Rt=14;for(let O=0;O<Rt;O++){const G=O/Rt*Math.PI*2,ht=O%2===0?r.miolo+.9:r.raio-.9,qt=r.x+Math.cos(G)*ht+Math.sign(Math.cos(G))*r.reta*Math.abs(Math.cos(G)),Kt=r.z+Math.sin(G)*ht;i.add(i.place(hl(),qt,0,Kt,i.range(0,6.28)))}i.interact({id:"parque:patins",x:a.x+1.8,z:a.z,radius:2.4,label:"Alugar patins",icon:"🛼",highlight:ct,onInteract:async O=>{if(O.hasItem(pe.patins.id)){await e([[s,"A gente já pegou um par."],[n,"É, e eu ainda não caí. Ainda."]]);return}await e([[s,"Um par pra cada um, moço."],[n,"Eu não sei patinar direito, hein."],[s,"Por isso eu vou do seu lado."]]),O.equipWearable(pe.patins),O.som("sorvete"),O.toast("Patins calçados","🛼"),O.unlock({id:"patins-villa",title:"Patins no Villa",place:"Parque Villa Lobos",note:"A pista tem cone pra desviar e a gente desviou de quase todos.",icon:"🛼"})}});const zt=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8],[-21,-5,12],[-8.6,2.5,9]],Dt=(O,G)=>Math.abs(O)<4&&G>-20&&G<30?!1:!zt.some(([ht,qt,Kt])=>Math.hypot(O-ht,G-qt)<Kt),ee=["redonda","redonda","pinheiro","florida","palmeira"];let me=0;for(let O=0;O<260&&me<64;O++){const G=i.range(-42,42),ht=i.range(-32,30);if(!Dt(G,ht))continue;const qt=i.range(.85,1.5);i.add(i.place(fa(i.pick(ee),qt,i.rng()),G,0,ht,i.range(0,6.28))),i.blockCircle(G,ht,.45*qt),me++}for(let O=0;O<90;O++){const G=i.range(-42,42),ht=i.range(-32,30);Dt(G,ht)&&(O%3===0?i.add(i.place(pa(6,1.1),G,0,ht)):O%3===1?i.add(i.place(uo(i.range(.7,1.2)),G,0,ht)):i.add(i.place(no(i.range(.5,1)),G,0,ht)))}i.patch(-66,-10,18,220,E.water,0,.02),i.patch(-55,-10,6,220,E.concrete,0,.03);for(let O=0;O<22;O++){const G=i.range(7,20),ht=i.range(4,9);i.add(i.place(ga(ht,G,ht*.9,i.pick([E.wallCream,E.concrete,E.wallMint]),E.metalGrey),i.range(-95,60),0,-96-i.range(0,16)))}for(let O=0;O<14;O++){const G=i.range(6,16);i.add(i.place(ga(i.range(4,8),G,5,E.wallCream,E.roofTile),92+i.range(0,16),0,i.range(-60,40)))}for(let O=0;O<90;O++){const G=O/90*Math.PI*2,ht=62+i.range(0,28),qt=Math.cos(G)*ht,Kt=Math.sin(G)*ht*.9;qt<-50||i.add(i.place(fa(i.pick(ee),i.range(1.2,2.2),i.rng()),qt,0,Kt,i.range(0,6.28)))}for(let O=0;O<9;O++){const G=Sh(i.range(1.6,3.2));G.position.set(i.range(-70,70),i.range(56,70),i.range(-60,45)),i.root.add(G);const ht=i.range(.25,.6);i.onUpdate(qt=>{G.position.x+=ht*qt,G.position.x>56&&(G.position.x=-56)})}const N=i.add(i.place($g(E.wood,E.metalWhite),2.6,0,27.5,Math.PI));i.add(i.place(Dn(16,1.4),-10,0,28)),i.add(i.place(Dn(16,1.4),10,0,28)),i.blockBox(-10,28,8,.2),i.blockBox(10,28,8,.2),i.add(i.place(Dn(11,1.4),35,0,3.5,Math.PI/2)),i.add(i.place(Dn(11,1.4),35,0,22.5,Math.PI/2)),i.blockBox(35,3.5,.2,5.5),i.blockBox(35,22.5,.2,5.5),i.patch(30,13,12,5,E.asphalt),i.patch(40,13,12,34,E.asphalt),i.patch(35.6,13,1.6,34,E.concrete,0,.012);const lt=i.add(i.place(fv(4161494),39.5,0,13,-Math.PI/2));i.blockBox(39.5,13,1.5,4.3);const ot=i.add(i.place(pv(),36.4,0,13,-Math.PI/2));i.blockBox(35.9,13,.3,1.8);const it=i.add(i.place(ml("Clube!",5161384),36.4,0,8.6,Math.PI*.25));i.blockCircle(36.4,8.6,.3),i.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:lt,radius:2.6}),i.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:N,radius:2.2});const q=new b_(E.frisbee);q.mesh.visible=!1,q.onLand=()=>t.som("quicar"),i.root.add(q.mesh);const Mt=1.3,ft=6,yt=30,Bt={alem:3.5,arco:1.2,erro:.06,desvio:1.4,alcance:3,raio:2.1,mira:.12},Yt={minX:L+.7,minZ:C+.7,maxX:w-.7,maxZ:R-.7};let P="fora",y=0,V=0,$=!1,rt=0,J=null;const It=(O,G)=>{O.som("pegar"),rt+=1;const ht=O.bump("frisbee.trocas"),qt=O.stat("frisbee.recorde");rt>qt&&O.bump("frisbee.recorde",rt-qt),G?O.toast("Pegou no ar!","🥏"):rt%5===0&&O.toast(`${rt} trocas seguidas!`,"🥏"),ht>=10&&!O.flag("memoria-frisbee")&&(O.setFlag("memoria-frisbee"),O.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"}))},gt=(O,G,ht)=>Math.max(G,Math.min(ht,O)),Ut=(O,G)=>Math.atan2(Math.sin(O-G),Math.cos(O-G)),Nt=O=>{const G=O.x<c.x?1:-1;return{x:gt(O.x+G*11,L+2,w-2),z:gt(O.z,C+2,R-2)}},pt=()=>{$=!1,V=0,t.showCharge(null)},At=()=>t.getActiveHandItem()?.id===pe.frisbee.id;let Vt=!1;const Ot=()=>{const O=t.addItem(pe.frisbee);return O==="cheio"?(Vt||(Vt=!0,t.toast("Sem vaga pro frisbee","🥏")),!1):(P="comigo",q.pickUp(),rt=0,J=null,t.setZoom(19),t.toast(O==="mao"?"Segure F para lançar mais longe":"Frisbee guardado — escolha ele na mochila (I)","🥏"),!0)},Et=()=>{P="fora",Vt=!1,t.removeItem(pe.frisbee.id),q.mesh.visible=!1,pt(),t.freeCompanion(),t.setZoom(14),J=null},Zt=O=>{if(P!=="comigo"||!At())return;t.removeItem(pe.frisbee.id);const G=ft+(yt-ft)*gt(O,0,1);q.throwAt(t.playerPosition(),t.playerFacing(),G),t.som("lancar"),P="voando-pra-ele"},z=i.interact({id:"parque:frisbee-jogar",x:c.x,z:c.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>Zt(.55)}),mt=i.interact({id:"parque:frisbee-pegar",x:c.x,z:c.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:O=>{O.addItem(pe.frisbee)!=="cheio"&&(q.pickUp(),P="comigo",It(O,!1))}});i.onUpdate(O=>{q.update(O,Yt);const G=t.playerPosition(),ht=t.companionPosition(),qt=h(G.x,G.z,.4);if(qt&&P==="fora"?Ot():!qt&&P!=="fora"&&Et(),P==="fora"){z.enabled=!1,mt.enabled=!1;return}if(P==="comigo"&&At()){if(t.keyDown("KeyF"))$=!0,V=Math.min(1,V+O/Mt),t.showCharge(V);else if($){const Kt=V;pt(),Zt(Kt)}}else $&&pt();if(P==="comigo"||P==="no-chao"){const Kt=Nt(G);(!J||Math.hypot(Kt.x-J.x,Kt.z-J.z)>2.5)&&(t.commandCompanion(Kt.x,Kt.z),J=Kt)}switch(q.mesh.userData.fase=P,P){case"comigo":q.holdAt(G,t.playerFacing()),q.mesh.visible=!1;break;case"com-ele":{const Kt=Math.atan2(G.x-ht.x,G.z-ht.z);t.holdCompanion(G.x,G.z),q.holdAt(ht,Kt),y-=O;const on=Math.abs(Ut(t.companionFacing(),Kt))<Bt.mira;if(y<=0&&(on||y<-1)){const Ki=G.x-ht.x,$n=G.z-ht.z,$i=Math.hypot(Ki,$n)||1,Rs=new U(gt(G.x+Ki/$i*Bt.alem+(Math.random()-.5)*Bt.desvio,L+1.5,w-1.5),0,gt(G.z+$n/$i*Bt.alem+(Math.random()-.5)*Bt.desvio,C+1.5,R-1.5));q.throwToward(ht,Rs,Bt.erro,Bt.arco),t.som("lancar"),J=null,P="voando-pra-mim"}break}case"voando-pra-ele":{if(q.state==="voando"&&q.position.y<2.3&&Math.hypot(q.position.x-ht.x,q.position.z-ht.z)<1.5){t.som("pegar"),t.holdCompanion(G.x,G.z),J=null,q.pickUp(),y=.7,P="com-ele",t.toast("Ele pegou no ar!","🙌");break}q.state==="chao"&&(q.position.distanceTo(ht)<1.6?(t.holdCompanion(G.x,G.z),J=null,q.pickUp(),y=.8,P="com-ele"):(t.commandCompanion(q.position.x,q.position.z),J=null,P="buscando"));break}case"buscando":q.position.distanceTo(ht)<1.1&&(t.holdCompanion(G.x,G.z),J=null,q.pickUp(),y=.9,P="com-ele");break;case"voando-pra-mim":{if(q.state==="voando"&&q.position.y<Bt.alcance&&Math.hypot(q.position.x-G.x,q.position.z-G.z)<Bt.raio){if(t.addItem(pe.frisbee)==="cheio")break;q.pickUp(),P="comigo",It(t,!0);break}q.state==="chao"&&(P="no-chao",q.position.distanceTo(G)<1.9&&t.addItem(pe.frisbee)!=="cheio"&&(q.pickUp(),P="comigo",It(t,!1)));break}case"no-chao":q.position.distanceTo(G)<1.2&&(q.pickUp(),P="comigo",It(t,!1));break}z.enabled=P==="comigo",mt.enabled=P==="no-chao",P==="comigo"?z.moveTo(G.x,G.z):mt.moveTo(q.position.x,q.position.z)}),i.interact({id:"parque:placa-quadra",x:L-1.8,z:c.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:K,onInteract:()=>e([[s,"QUADRA LIVRE — respeite quem chegou primeiro."],[n,"Hoje só tem a gente."],[s,"Então segura o F e manda ver. Quanto mais tempo segurar, mais longe vai."]])}),i.interact({id:"parque:placar",x:c.x,z:C+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:F,onInteract:O=>{const G=O.stat("frisbee.recorde"),ht=O.stat("frisbee.trocas");return e([[n,G>0?`Nosso recorde é ${G} trocas seguidas.`:"O placar tá zerado."],[s,ht>0?`E já foram ${ht} no total. A gente não desiste fácil.`:"Bora estrear isso então."]])}}),i.interact({id:"parque:arquibancada",x:c.x,z:R-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:k,onInteract:()=>e([[s,"Cansei. Cinco minutos."],[n,"Você falou cinco minutos faz meia hora."],[s,"E olha que descanso bem, hein."]])}),i.interact({id:"parque:bebedouro",x:L+2.8,z:c.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:Y,onInteract:async O=>{await e([[n,"A água daqui é sempre meio quente."],[s,"Mas depois de correr atrás de disco, tá ótima."]]),O.toast("Água (meio quente)","🚰")}}),i.interact({id:"parque:sacola",x:L+2.8,z:c.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:j,onInteract:()=>e([[s,"Tem uns três discos aqui de gente que esqueceu."],[n,"Um deles é seu. Desde março."],[s,"…é, pode ser."]])}),i.interact({id:"parque:cesta",x:w-4.4,z:c.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:D,onInteract:()=>e([[n,"Um dia a gente acerta essa cesta."],[s,"Já acertei uma vez!"],[n,"Você acertou o poste. É diferente."]])}),i.interact({id:"parque:biruta",x:w-3,z:R-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:tt,onInteract:()=>e([[s,"O vento tá indo pra lá."],[n,"Então joga contra que o disco fica no ar mais tempo."],[s,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),i.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:ot,onInteract:()=>e([[n,"Esse é o que passa no clube?"],[s,"É esse. Já tá parado, é só subir."]])}),i.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:it,onInteract:()=>e([[s,'"Clube!" — com exclamação e tudo.'],[n,"Quem escreveu isso tava animado."]])}),i.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async O=>{O.som("pato"),await O.say(["Que lago bonito... dá até vontade de pular"],vn.name),await O.say(["Então vamos! Hahahha"],bn.name),await O.say(["NÃAAOOO"],vn.name),O.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});let xt=0;i.onUpdate(O=>{xt<=0||(xt-=O,xt<=0&&(t.removeItem(pe.sorveteMorango.id,bn.id),t.removeItem(pe.sorveteMaracuja.id,vn.id),t.toast("Acabou o sorvete","🍦")))});const wt=new R_(5);wt.guardar(),bt.add(wt.grupo),wt.onSom=O=>t.som(O),bt.userData.pingpong=wt;const dt=(O,G)=>{const ht=new U(O,0,G);return bt.localToWorld(ht),ht};let st=!1;const Lt=P_.plano+.55,Jt=()=>{st=!1,wt.guardar();for(const O of se)O.visible=!0;t.showPlacar(null),t.setCameraOmbro(null),t.setPlayerVisible(!0),t.lockPlayer(!1),t.freeCompanion(),ge.enabled=!0};i.onUpdate(O=>{st&&(wt.update(O,t.pointer()),st&&t.showPlacar({eu:t.playerName(),ele:t.companionName(),meus:wt.meus,dele:wt.dele}))});const ge=i.interact({id:"parque:pingpong",x:l.x,z:l.z,radius:2.6,label:"Jogar ping pong",icon:"🏓",highlight:bt,onInteract:async O=>{if(st)return;await e([[n,"Cinco pontos?"],[s,"Cinco pontos. E o perdedor carrega a bolsa até em casa."]]);const G=dt(-Lt,0),ht=dt(Lt,0);O.releasePlayer(G.x,G.z,Math.atan2(ht.x-G.x,ht.z-G.z)),O.releaseCompanion(ht.x,ht.z,Math.atan2(G.x-ht.x,G.z-ht.z)),O.holdCompanion(G.x,G.z),O.lockPlayer(!0);const qt=dt(-Lt-1.6,0),Kt=dt(0,0);O.setCameraOmbro(new U(qt.x,2.35,qt.z),new U(Kt.x,.9,Kt.z)),O.setPlayerVisible(!1);for(const on of se)on.visible=!1;ge.enabled=!1,wt.comecar(),st=!0,O.toast("Mexa o mouse para mover a raquete","🏓")}});wt.onPonto=O=>{t.som(O?"confirma":"quicar")},wt.onFim=O=>{(async()=>(Jt(),O?(t.som("memoria"),t.toast("Campeão de ping pong!","🏆"),t.equipWearable(pe.chapeuPingPong),await e([[n,"Cinco a "+wt.dele+"."],[s,"Você ganhou o chapéu. Vai ter que usar."]]),t.unlock({id:"memoria-ping-pong",title:"A mesa do parque",place:"Parque Villa Lobos",note:"Cinco pontos e um chapéu ridículo de campeão. A gente joga mal, mas joga rindo.",icon:"🏓"})):await e([[s,"Cinco a "+wt.meus+". Revanche?"],[n,"Sempre revanche."]])))()},i.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:nt,onInteract:async O=>{await e([[n,"Dois, por favor."],[s,"Um de morango e um de maracujá."],[n,"Nunca pedimos diferente."]]),xt=50,O.addItem(pe.sorveteMorango,bn.id),O.addItem(pe.sorveteMaracuja,vn.id),O.som("sorvete"),O.toast("Morango e maracujá","🍦"),O.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),i.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:Q,onInteract:async O=>{await e([[s,"A toalha xadrez de sempre."],[n,"E o pão de queijo já frio."],[s,"Frio é melhor. Aceita."]]),O.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),i.interact({id:"parque:bilheteria",x:9.5,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:m,onInteract:()=>e([[n,"Dois pra roda gigante."],[s,"Sempre dois."]])});let ie=null;const Ye=O=>new Promise(G=>{ie={resolve:G,de:_.angle,voltas:O}});let We=!0;i.onUpdate(O=>{if(_.update(O),We){const G=t.playerPosition(),ht=Math.hypot(G.x,G.z+26);if(ht<28){const qt=Math.max(0,Math.min(1,(ht-8)/20));t.setZoom(36-qt*21)}}if(T.forEach((G,ht)=>{G.position.y=.1+Math.sin(performance.now()/900+ht)*.05}),ie&&_.turnsSince(ie.de)>=ie.voltas){const G=ie.resolve;ie=null,G()}}),i.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async O=>{We=!1,O.lockPlayer(!0),await e([[s,"A fila tá curta hoje."],[n,"Bora subir?"]]);const G=_.boardingCabin(),ht=_.speed;_.speed=ht*5,O.som("sino"),O.ridePlayer(G,new U(-.3,-.34,0),.55),O.rideCompanion(G,new U(.3,-.34,0),.55),O.focusCamera(G),O.setZoom(38),await Ye(.25),await e([[n,"Daqui dá pra ver o parque inteiro."],[s,"E aquele pedacinho do rio ali atrás."]]),await Ye(.35),await e([[n,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[s,"Pronto. Subimos."]]),await Ye(.4),_.speed=ht,O.focusCamera(null),O.releasePlayer(0,-17.6,0),O.releaseCompanion(-1.1,-17.9,0),O.lockPlayer(!1),We=!0,O.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},I_={[Ra.id]:Ra,[Al.id]:Al,[Pl.id]:Pl,[El.id]:El},L_=Ra.id,Lh=document.getElementById("app");if(!Lh)throw new Error("#app nao encontrado");const Po=new e_(Lh,I_,x_,L_),Cs=new URLSearchParams(location.search),D_=Cs.get("cena")??void 0,U_=Cs.get("entrada")??void 0;Po.start(D_,U_);const xr=Number(Cs.get("zoom"));Number.isFinite(xr)&&xr>0&&Po.setZoom(xr);const as=Cs.get("em")?.split(",").map(Number);if(as&&as.length===2&&as.every(Number.isFinite)){const i=Number(Cs.get("olhar"));Po.debugPlace(as[0],as[1],Number.isFinite(i)?i:Math.PI/4)}window.jogo=Po;window.aristoryAudio={Musica:Ph,CLIMAS:go,EFEITOS:Rh};window.aristoryItens=Object.fromEntries(Object.values(pe).map(i=>[i.id,i]));
