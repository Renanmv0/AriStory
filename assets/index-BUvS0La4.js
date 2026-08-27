(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=e(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const No="180",Bl=0,ca=1,kl=2,zc=1,Bc=2,dn=3,_n=0,Ue=1,je=2,Tn=0,mi=1,la=2,ha=3,ua=4,Vl=5,Vn=100,Hl=101,Gl=102,Wl=103,Xl=104,ql=200,Yl=201,jl=202,Jl=203,Nr=204,Fr=205,Kl=206,Zl=207,$l=208,Ql=209,th=210,eh=211,nh=212,ih=213,sh=214,Or=0,zr=1,Br=2,_i=3,kr=4,Vr=5,Hr=6,Gr=7,kc=0,rh=1,oh=2,An=0,ah=1,ch=2,lh=3,hh=4,uh=5,dh=6,fh=7,Vc=300,vi=301,xi=302,Wr=303,Xr=304,Bs=306,qr=1e3,Gn=1001,Yr=1002,Ie=1003,ph=1004,is=1005,Qe=1006,Js=1007,Wn=1008,nn=1009,Hc=1010,Gc=1011,Hi=1012,Fo=1013,jn=1014,pn=1015,$i=1016,Oo=1017,zo=1018,Gi=1020,Wc=35902,Xc=35899,qc=1021,Yc=1022,Ke=1023,Wi=1026,Xi=1027,Bo=1028,ko=1029,jc=1030,Vo=1031,Ho=1033,Rs=33776,Ps=33777,Ls=33778,Is=33779,jr=35840,Jr=35841,Kr=35842,Zr=35843,$r=36196,Qr=37492,to=37496,eo=37808,no=37809,io=37810,so=37811,ro=37812,oo=37813,ao=37814,co=37815,lo=37816,ho=37817,uo=37818,fo=37819,po=37820,mo=37821,go=36492,_o=36494,vo=36495,xo=36283,Mo=36284,yo=36285,So=36286,mh=3200,gh=3201,Jc=0,_h=1,wn="",Be="srgb",Mi="srgb-linear",Us="linear",le="srgb",Qn=7680,da=519,vh=512,xh=513,Mh=514,Kc=515,yh=516,Sh=517,bh=518,Eh=519,fa=35044,pa="300 es",tn=2e3,Ns=2001;class bi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const s=n[t];if(s!==void 0){const r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}}const Te=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ma=1234567;const Fi=Math.PI/180,qi=180/Math.PI;function Zn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Te[i&255]+Te[i>>8&255]+Te[i>>16&255]+Te[i>>24&255]+"-"+Te[t&255]+Te[t>>8&255]+"-"+Te[t>>16&15|64]+Te[t>>24&255]+"-"+Te[e&63|128]+Te[e>>8&255]+"-"+Te[e>>16&255]+Te[e>>24&255]+Te[n&255]+Te[n>>8&255]+Te[n>>16&255]+Te[n>>24&255]).toLowerCase()}function Kt(i,t,e){return Math.max(t,Math.min(e,i))}function Go(i,t){return(i%t+t)%t}function wh(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Th(i,t,e){return i!==t?(e-i)/(t-i):0}function Oi(i,t,e){return(1-e)*i+e*t}function Ah(i,t,e,n){return Oi(i,t,1-Math.exp(-e*n))}function Ch(i,t=1){return t-Math.abs(Go(i,t*2)-t)}function Rh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Ph(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Lh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ih(i,t){return i+Math.random()*(t-i)}function Dh(i){return i*(.5-Math.random())}function Uh(i){i!==void 0&&(ma=i);let t=ma+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nh(i){return i*Fi}function Fh(i){return i*qi}function Oh(i){return(i&i-1)===0&&i!==0}function zh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Bh(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function kh(i,t,e,n,s){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),f=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*f,a*l);break;case"YXY":i.set(c*f,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*f,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function fi(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Pe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Yn={DEG2RAD:Fi,RAD2DEG:qi,generateUUID:Zn,clamp:Kt,euclideanModulo:Go,mapLinear:wh,inverseLerp:Th,lerp:Oi,damp:Ah,pingpong:Ch,smoothstep:Rh,smootherstep:Ph,randInt:Lh,randFloat:Ih,randFloatSpread:Dh,seededRandom:Uh,degToRad:Nh,radToDeg:Fh,isPowerOfTwo:Oh,ceilPowerOfTwo:zh,floorPowerOfTwo:Bh,setQuaternionFromProperEuler:kh,normalize:Pe,denormalize:fi};class vt{constructor(t=0,e=0){vt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Qi{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],u=n[s+3];const d=r[o+0],f=r[o+1],g=r[o+2],v=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=f,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==f||h!==g){let m=1-a;const p=c*d+l*f+h*g+u*v,S=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){const R=Math.sqrt(M),w=Math.atan2(R,p*S);m=Math.sin(m*w)/R,a=Math.sin(a*w)/R}const _=a*S;if(c=c*m+d*_,l=l*m+f*_,h=h*m+g*_,u=u*m+v*_,m===1-a){const R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*f-l*d,t[e+1]=c*g+h*d+l*u-a*f,t[e+2]=l*g+h*f+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),u=a(r/2),d=c(n/2),f=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u+d*f*g;break;case"YZX":this._x=d*h*u+l*f*g,this._y=l*f*u+d*h*g,this._z=l*h*g-d*f*u,this._w=l*h*u-d*f*g;break;case"XZY":this._x=d*h*u-l*f*g,this._y=l*f*u-d*h*g,this._z=l*h*g+d*f*u,this._w=l*h*u+d*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-c)*f,this._y=(r-l)*f,this._z=(o-s)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(h-c)/f,this._x=.25*f,this._y=(s+o)/f,this._z=(r+l)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(r-l)/f,this._x=(s+o)/f,this._y=.25*f,this._z=(c+h)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-s)/f,this._x=(r+l)/f,this._y=(c+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Kt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+s*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const f=1-e;return this._w=f*o+e*this._w,this._x=f*n+e*this._x,this._y=f*s+e*this._y,this._z=f*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=s*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(t=0,e=0,n=0){D.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ga.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ga.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*s-a*n),h=2*(a*e-r*s),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=s+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ks.copy(this).projectOnVector(t),this.sub(Ks)}reflect(t){return this.sub(Ks.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Kt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ks=new D,ga=new Qi;class jt{constructor(t,e,n,s,r,o,a,c,l){jt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l)}set(t,e,n,s,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],v=s[0],m=s[3],p=s[6],S=s[1],M=s[4],_=s[7],R=s[2],w=s[5],T=s[8];return r[0]=o*v+a*S+c*R,r[3]=o*m+a*M+c*w,r[6]=o*p+a*_+c*T,r[1]=l*v+h*S+u*R,r[4]=l*m+h*M+u*w,r[7]=l*p+h*_+u*T,r[2]=d*v+f*S+g*R,r[5]=d*m+f*M+g*w,r[8]=d*p+f*_+g*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,f=l*r-o*c,g=e*u+n*d+s*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(s*l-h*n)*v,t[2]=(a*n-s*o)*v,t[3]=d*v,t[4]=(h*e-s*c)*v,t[5]=(s*r-a*e)*v,t[6]=f*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*r)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-s*l,s*c,-s*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Zs.makeScale(t,e)),this}rotate(t){return this.premultiply(Zs.makeRotation(-t)),this}translate(t,e){return this.premultiply(Zs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Zs=new jt;function Zc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Fs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vh(){const i=Fs("canvas");return i.style.display="block",i}const _a={};function Yi(i){i in _a||(_a[i]=!0,console.warn(i))}function Hh(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const va=new jt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),xa=new jt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gh(){const i={enabled:!0,workingColorSpace:Mi,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===le&&(s.r=gn(s.r),s.g=gn(s.g),s.b=gn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===le&&(s.r=gi(s.r),s.g=gi(s.g),s.b=gi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===wn?Us:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Yi("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Yi("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Mi]:{primaries:t,whitePoint:n,transfer:Us,toXYZ:va,fromXYZ:xa,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Be},outputColorSpaceConfig:{drawingBufferColorSpace:Be}},[Be]:{primaries:t,whitePoint:n,transfer:le,toXYZ:va,fromXYZ:xa,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Be}}}),i}const oe=Gh();function gn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function gi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let ti;class Wh{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{ti===void 0&&(ti=Fs("canvas")),ti.width=t.width,ti.height=t.height;const s=ti.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=ti}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Fs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=gn(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(gn(e[n]/255)*255):e[n]=gn(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Xh=0;class Wo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xh++}),this.uuid=Zn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):e instanceof VideoFrame?t.set(e.displayHeight,e.displayWidth,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push($s(s[o].image)):r.push($s(s[o]))}else r=$s(s);n.url=r}return e||(t.images[this.uuid]=n),n}}function $s(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Wh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let qh=0;const Qs=new D;class Ce extends bi{constructor(t=Ce.DEFAULT_IMAGE,e=Ce.DEFAULT_MAPPING,n=Gn,s=Gn,r=Qe,o=Wn,a=Ke,c=nn,l=Ce.DEFAULT_ANISOTROPY,h=wn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=Zn(),this.name="",this.source=new Wo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new vt(0,0),this.repeat=new vt(1,1),this.center=new vt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new jt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Qs).x}get height(){return this.source.getSize(Qs).y}get depth(){return this.source.getSize(Qs).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Vc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case qr:t.x=t.x-Math.floor(t.x);break;case Gn:t.x=t.x<0?0:1;break;case Yr:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case qr:t.y=t.y-Math.floor(t.y);break;case Gn:t.y=t.y<0?0:1;break;case Yr:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ce.DEFAULT_IMAGE=null;Ce.DEFAULT_MAPPING=Vc;Ce.DEFAULT_ANISOTROPY=1;class ve{constructor(t=0,e=0,n=0,s=1){ve.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],f=c[5],g=c[9],v=c[2],m=c[6],p=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+m)<.1&&Math.abs(l+f+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,_=(f+1)/2,R=(p+1)/2,w=(h+d)/4,T=(u+v)/4,C=(g+m)/4;return M>_&&M>R?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=w/n,r=T/n):_>R?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=w/s,r=C/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=T/r,s=C/r),this.set(n,s,r,e),this}let S=Math.sqrt((m-g)*(m-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(u-v)/S,this.z=(d-h)/S,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Kt(this.x,t.x,e.x),this.y=Kt(this.y,t.y,e.y),this.z=Kt(this.z,t.z,e.z),this.w=Kt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Kt(this.x,t,e),this.y=Kt(this.y,t,e),this.z=Kt(this.z,t,e),this.w=Kt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Kt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yh extends bi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new ve(0,0,t,e),this.scissorTest=!1,this.viewport=new ve(0,0,t,e);const s={width:t,height:e,depth:n.depth},r=new Ce(s);this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:Qe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const s=Object.assign({},t.textures[e].image);this.textures[e].source=new Wo(s)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Jn extends Yh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class $c extends Ce{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class jh extends Ce{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ie,this.minFilter=Ie,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ei{constructor(t=new D(1/0,1/0,1/0),e=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(We.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(We.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=We.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,We):We.fromBufferAttribute(r,o),We.applyMatrix4(t.matrixWorld),this.expandByPoint(We);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ss.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ss.copy(n.boundingBox)),ss.applyMatrix4(t.matrixWorld),this.union(ss)}const s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,We),We.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ci),rs.subVectors(this.max,Ci),ei.subVectors(t.a,Ci),ni.subVectors(t.b,Ci),ii.subVectors(t.c,Ci),xn.subVectors(ni,ei),Mn.subVectors(ii,ni),In.subVectors(ei,ii);let e=[0,-xn.z,xn.y,0,-Mn.z,Mn.y,0,-In.z,In.y,xn.z,0,-xn.x,Mn.z,0,-Mn.x,In.z,0,-In.x,-xn.y,xn.x,0,-Mn.y,Mn.x,0,-In.y,In.x,0];return!tr(e,ei,ni,ii,rs)||(e=[1,0,0,0,1,0,0,0,1],!tr(e,ei,ni,ii,rs))?!1:(os.crossVectors(xn,Mn),e=[os.x,os.y,os.z],tr(e,ei,ni,ii,rs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,We).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(We).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(an[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),an[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),an[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),an[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),an[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),an[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),an[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),an[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(an),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const an=[new D,new D,new D,new D,new D,new D,new D,new D],We=new D,ss=new Ei,ei=new D,ni=new D,ii=new D,xn=new D,Mn=new D,In=new D,Ci=new D,rs=new D,os=new D,Dn=new D;function tr(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Dn.fromArray(i,r);const a=s.x*Math.abs(Dn.x)+s.y*Math.abs(Dn.y)+s.z*Math.abs(Dn.z),c=t.dot(Dn),l=e.dot(Dn),h=n.dot(Dn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Jh=new Ei,Ri=new D,er=new D;class ks{constructor(t=new D,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Jh.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ri.subVectors(t,this.center);const e=Ri.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Ri,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(er.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ri.copy(t.center).add(er)),this.expandByPoint(Ri.copy(t.center).sub(er))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}const cn=new D,nr=new D,as=new D,yn=new D,ir=new D,cs=new D,sr=new D;class Qc{constructor(t=new D,e=new D(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,cn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=cn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(cn.copy(this.origin).addScaledVector(this.direction,e),cn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){nr.copy(t).add(e).multiplyScalar(.5),as.copy(e).sub(t).normalize(),yn.copy(this.origin).sub(nr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(as),a=yn.dot(this.direction),c=-yn.dot(as),l=yn.lengthSq(),h=Math.abs(1-o*o);let u,d,f,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,f=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),f=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),f=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(nr).addScaledVector(as,d),f}intersectSphere(t,e){cn.subVectors(t.center,this.origin);const n=cn.dot(this.direction),s=cn.dot(cn)-n*n,r=t.radius*t.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,s=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,s=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,cn)!==null}intersectTriangle(t,e,n,s,r){ir.subVectors(e,t),cs.subVectors(n,t),sr.crossVectors(ir,cs);let o=this.direction.dot(sr),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;yn.subVectors(this.origin,t);const c=a*this.direction.dot(cs.crossVectors(yn,cs));if(c<0)return null;const l=a*this.direction.dot(ir.cross(yn));if(l<0||c+l>o)return null;const h=-a*yn.dot(sr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ge{constructor(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m)}set(t,e,n,s,r,o,a,c,l,h,u,d,f,g,v,m){const p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=v,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ge().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,s=1/si.setFromMatrixColumn(t,0).length(),r=1/si.setFromMatrixColumn(t,1).length(),o=1/si.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=f+g*l,e[5]=d-v*l,e[9]=-a*c,e[2]=v-d*l,e[6]=g+f*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d+v*a,e[4]=g*a-f,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=f*a-g,e[6]=v+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,f=c*u,g=l*h,v=l*u;e[0]=d-v*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,f=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=g*l-f,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=f*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+f,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=f*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*c,f=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=o*h,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Kh,t,Zh)}lookAt(t,e,n){const s=this.elements;return Oe.subVectors(t,e),Oe.lengthSq()===0&&(Oe.z=1),Oe.normalize(),Sn.crossVectors(n,Oe),Sn.lengthSq()===0&&(Math.abs(n.z)===1?Oe.x+=1e-4:Oe.z+=1e-4,Oe.normalize(),Sn.crossVectors(n,Oe)),Sn.normalize(),ls.crossVectors(Oe,Sn),s[0]=Sn.x,s[4]=ls.x,s[8]=Oe.x,s[1]=Sn.y,s[5]=ls.y,s[9]=Oe.y,s[2]=Sn.z,s[6]=ls.z,s[10]=Oe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],v=n[6],m=n[10],p=n[14],S=n[3],M=n[7],_=n[11],R=n[15],w=s[0],T=s[4],C=s[8],x=s[12],b=s[1],L=s[5],B=s[9],W=s[13],J=s[2],j=s[6],Z=s[10],it=s[14],F=s[3],pt=s[7],yt=s[11],Rt=s[15];return r[0]=o*w+a*b+c*J+l*F,r[4]=o*T+a*L+c*j+l*pt,r[8]=o*C+a*B+c*Z+l*yt,r[12]=o*x+a*W+c*it+l*Rt,r[1]=h*w+u*b+d*J+f*F,r[5]=h*T+u*L+d*j+f*pt,r[9]=h*C+u*B+d*Z+f*yt,r[13]=h*x+u*W+d*it+f*Rt,r[2]=g*w+v*b+m*J+p*F,r[6]=g*T+v*L+m*j+p*pt,r[10]=g*C+v*B+m*Z+p*yt,r[14]=g*x+v*W+m*it+p*Rt,r[3]=S*w+M*b+_*J+R*F,r[7]=S*T+M*L+_*j+R*pt,r[11]=S*C+M*B+_*Z+R*yt,r[15]=S*x+M*W+_*it+R*Rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],f=t[14],g=t[3],v=t[7],m=t[11],p=t[15];return g*(+r*c*u-s*l*u-r*a*d+n*l*d+s*a*f-n*c*f)+v*(+e*c*f-e*l*d+r*o*d-s*o*f+s*l*h-r*c*h)+m*(+e*l*u-e*a*f-r*o*u+n*o*f+r*a*h-n*l*h)+p*(-s*a*h-e*c*u+e*a*d+s*o*u-n*o*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],f=t[11],g=t[12],v=t[13],m=t[14],p=t[15],S=u*m*l-v*d*l+v*c*f-a*m*f-u*c*p+a*d*p,M=g*d*l-h*m*l-g*c*f+o*m*f+h*c*p-o*d*p,_=h*v*l-g*u*l+g*a*f-o*v*f-h*a*p+o*u*p,R=g*u*c-h*v*c-g*a*d+o*v*d+h*a*m-o*u*m,w=e*S+n*M+s*_+r*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return t[0]=S*T,t[1]=(v*d*r-u*m*r-v*s*f+n*m*f+u*s*p-n*d*p)*T,t[2]=(a*m*r-v*c*r+v*s*l-n*m*l-a*s*p+n*c*p)*T,t[3]=(u*c*r-a*d*r-u*s*l+n*d*l+a*s*f-n*c*f)*T,t[4]=M*T,t[5]=(h*m*r-g*d*r+g*s*f-e*m*f-h*s*p+e*d*p)*T,t[6]=(g*c*r-o*m*r-g*s*l+e*m*l+o*s*p-e*c*p)*T,t[7]=(o*d*r-h*c*r+h*s*l-e*d*l-o*s*f+e*c*f)*T,t[8]=_*T,t[9]=(g*u*r-h*v*r-g*n*f+e*v*f+h*n*p-e*u*p)*T,t[10]=(o*v*r-g*a*r+g*n*l-e*v*l-o*n*p+e*a*p)*T,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*f-e*a*f)*T,t[12]=R*T,t[13]=(h*v*s-g*u*s+g*n*d-e*v*d-h*n*m+e*u*m)*T,t[14]=(g*a*s-o*v*s-g*n*c+e*v*c+o*n*m-e*a*m)*T,t[15]=(o*u*s-h*a*s+h*n*c-e*u*c-o*n*d+e*a*d)*T,this}scale(t){const e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){const s=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,f=r*h,g=r*u,v=o*h,m=o*u,p=a*u,S=c*l,M=c*h,_=c*u,R=n.x,w=n.y,T=n.z;return s[0]=(1-(v+p))*R,s[1]=(f+_)*R,s[2]=(g-M)*R,s[3]=0,s[4]=(f-_)*w,s[5]=(1-(d+p))*w,s[6]=(m+S)*w,s[7]=0,s[8]=(g+M)*T,s[9]=(m-S)*T,s[10]=(1-(d+v))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){const s=this.elements;let r=si.set(s[0],s[1],s[2]).length();const o=si.set(s[4],s[5],s[6]).length(),a=si.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Xe.copy(this);const l=1/r,h=1/o,u=1/a;return Xe.elements[0]*=l,Xe.elements[1]*=l,Xe.elements[2]*=l,Xe.elements[4]*=h,Xe.elements[5]*=h,Xe.elements[6]*=h,Xe.elements[8]*=u,Xe.elements[9]*=u,Xe.elements[10]*=u,e.setFromRotationMatrix(Xe),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,s,r,o,a=tn,c=!1){const l=this.elements,h=2*r/(e-t),u=2*r/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s);let g,v;if(c)g=r/(o-r),v=o*r/(o-r);else if(a===tn)g=-(o+r)/(o-r),v=-2*o*r/(o-r);else if(a===Ns)g=-o/(o-r),v=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=u,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=tn,c=!1){const l=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s);let g,v;if(c)g=1/(o-r),v=o/(o-r);else if(a===tn)g=-2/(o-r),v=-(o+r)/(o-r);else if(a===Ns)g=-1/(o-r),v=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=d,l[1]=0,l[5]=u,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=g,l[14]=v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const si=new D,Xe=new ge,Kh=new D(0,0,0),Zh=new D(1,1,1),Sn=new D,ls=new D,Oe=new D,Ma=new ge,ya=new Qi;class vn{constructor(t=0,e=0,n=0,s=vn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const s=t.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(Kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Kt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Kt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Kt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ma.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ma,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ya.setFromEuler(this),this.setFromQuaternion(ya,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}vn.DEFAULT_ORDER="XYZ";class tl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let $h=0;const Sa=new D,ri=new Qi,ln=new ge,hs=new D,Pi=new D,Qh=new D,tu=new Qi,ba=new D(1,0,0),Ea=new D(0,1,0),wa=new D(0,0,1),Ta={type:"added"},eu={type:"removed"},oi={type:"childadded",child:null},rr={type:"childremoved",child:null};class xe extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$h++}),this.uuid=Zn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=xe.DEFAULT_UP.clone();const t=new D,e=new vn,n=new Qi,s=new D(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ge},normalMatrix:{value:new jt}}),this.matrix=new ge,this.matrixWorld=new ge,this.matrixAutoUpdate=xe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new tl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ri.setFromAxisAngle(t,e),this.quaternion.multiply(ri),this}rotateOnWorldAxis(t,e){return ri.setFromAxisAngle(t,e),this.quaternion.premultiply(ri),this}rotateX(t){return this.rotateOnAxis(ba,t)}rotateY(t){return this.rotateOnAxis(Ea,t)}rotateZ(t){return this.rotateOnAxis(wa,t)}translateOnAxis(t,e){return Sa.copy(t).applyQuaternion(this.quaternion),this.position.add(Sa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(ba,t)}translateY(t){return this.translateOnAxis(Ea,t)}translateZ(t){return this.translateOnAxis(wa,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ln.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?hs.copy(t):hs.set(t,e,n);const s=this.parent;this.updateWorldMatrix(!0,!1),Pi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ln.lookAt(Pi,hs,this.up):ln.lookAt(hs,Pi,this.up),this.quaternion.setFromRotationMatrix(ln),s&&(ln.extractRotation(s.matrixWorld),ri.setFromRotationMatrix(ln),this.quaternion.premultiply(ri.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ta),oi.child=t,this.dispatchEvent(oi),oi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(eu),rr.child=t,this.dispatchEvent(rr),rr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(ln),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ta),oi.child=t,this.dispatchEvent(oi),oi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pi,t,Qh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Pi,tu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const s=t.children[n];this.add(s.clone())}return this}}xe.DEFAULT_UP=new D(0,1,0);xe.DEFAULT_MATRIX_AUTO_UPDATE=!0;xe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const qe=new D,hn=new D,or=new D,un=new D,ai=new D,ci=new D,Aa=new D,ar=new D,cr=new D,lr=new D,hr=new ve,ur=new ve,dr=new ve;class Je{constructor(t=new D,e=new D,n=new D){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),qe.subVectors(t,e),s.cross(qe);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){qe.subVectors(s,e),hn.subVectors(n,e),or.subVectors(t,e);const o=qe.dot(qe),a=qe.dot(hn),c=qe.dot(or),l=hn.dot(hn),h=hn.dot(or),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,f=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-f-g,g,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,un)===null?!1:un.x>=0&&un.y>=0&&un.x+un.y<=1}static getInterpolation(t,e,n,s,r,o,a,c){return this.getBarycoord(t,e,n,s,un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,un.x),c.addScaledVector(o,un.y),c.addScaledVector(a,un.z),c)}static getInterpolatedAttribute(t,e,n,s,r,o){return hr.setScalar(0),ur.setScalar(0),dr.setScalar(0),hr.fromBufferAttribute(t,e),ur.fromBufferAttribute(t,n),dr.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(hr,r.x),o.addScaledVector(ur,r.y),o.addScaledVector(dr,r.z),o}static isFrontFacing(t,e,n,s){return qe.subVectors(n,e),hn.subVectors(t,e),qe.cross(hn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return qe.subVectors(this.c,this.b),hn.subVectors(this.a,this.b),qe.cross(hn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Je.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Je.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return Je.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return Je.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Je.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,s=this.b,r=this.c;let o,a;ai.subVectors(s,n),ci.subVectors(r,n),ar.subVectors(t,n);const c=ai.dot(ar),l=ci.dot(ar);if(c<=0&&l<=0)return e.copy(n);cr.subVectors(t,s);const h=ai.dot(cr),u=ci.dot(cr);if(h>=0&&u<=h)return e.copy(s);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(ai,o);lr.subVectors(t,r);const f=ai.dot(lr),g=ci.dot(lr);if(g>=0&&f<=g)return e.copy(r);const v=f*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(ci,a);const m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return Aa.subVectors(r,s),a=(u-h)/(u-h+(f-g)),e.copy(s).addScaledVector(Aa,a);const p=1/(m+v+d);return o=v*p,a=d*p,e.copy(n).addScaledVector(ai,o).addScaledVector(ci,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const el={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},bn={h:0,s:0,l:0},us={h:0,s:0,l:0};function fr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Qt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Be){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=oe.workingColorSpace){if(t=Go(t,1),e=Kt(e,0,1),n=Kt(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=fr(o,r,t+1/3),this.g=fr(o,r,t),this.b=fr(o,r,t-1/3)}return oe.colorSpaceToWorking(this,s),this}setStyle(t,e=Be){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Be){const n=el[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gn(t.r),this.g=gn(t.g),this.b=gn(t.b),this}copyLinearToSRGB(t){return this.r=gi(t.r),this.g=gi(t.g),this.b=gi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Be){return oe.workingToColorSpace(Ae.copy(this),t),Math.round(Kt(Ae.r*255,0,255))*65536+Math.round(Kt(Ae.g*255,0,255))*256+Math.round(Kt(Ae.b*255,0,255))}getHexString(t=Be){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(Ae.copy(this),e);const n=Ae.r,s=Ae.g,r=Ae.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(s-r)/u+(s<r?6:0);break;case s:c=(r-n)/u+2;break;case r:c=(n-s)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(Ae.copy(this),e),t.r=Ae.r,t.g=Ae.g,t.b=Ae.b,t}getStyle(t=Be){oe.workingToColorSpace(Ae.copy(this),t);const e=Ae.r,n=Ae.g,s=Ae.b;return t!==Be?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(bn),this.setHSL(bn.h+t,bn.s+e,bn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(bn),t.getHSL(us);const n=Oi(bn.h,us.h,e),s=Oi(bn.s,us.s,e),r=Oi(bn.l,us.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ae=new Qt;Qt.NAMES=el;let nu=0;class wi extends bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:nu++}),this.uuid=Zn(),this.name="",this.type="Material",this.blending=mi,this.side=_n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Nr,this.blendDst=Fr,this.blendEquation=Vn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Qt(0,0,0),this.blendAlpha=0,this.depthFunc=_i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=da,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Qn,this.stencilZFail=Qn,this.stencilZPass=Qn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==mi&&(n.blending=this.blending),this.side!==_n&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Nr&&(n.blendSrc=this.blendSrc),this.blendDst!==Fr&&(n.blendDst=this.blendDst),this.blendEquation!==Vn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==_i&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==da&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Qn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Qn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Qn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Vs extends wi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Qt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new vn,this.combine=kc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Me=new D,ds=new vt;let iu=0;class en{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:iu++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=fa,this.updateRanges=[],this.gpuType=pn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ds.fromBufferAttribute(this,e),ds.applyMatrix3(t),this.setXY(e,ds.x,ds.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix3(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyMatrix4(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.applyNormalMatrix(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Me.fromBufferAttribute(this,e),Me.transformDirection(t),this.setXYZ(e,Me.x,Me.y,Me.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=fi(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Pe(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fi(e,this.array)),e}setX(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fi(e,this.array)),e}setY(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fi(e,this.array)),e}setW(t,e){return this.normalized&&(e=Pe(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),n=Pe(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),n=Pe(n,this.array),s=Pe(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Pe(e,this.array),n=Pe(n,this.array),s=Pe(s,this.array),r=Pe(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==fa&&(t.usage=this.usage),t}}class nl extends en{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class il extends en{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ne extends en{constructor(t,e,n){super(new Float32Array(t),e,n)}}let su=0;const He=new ge,pr=new xe,li=new D,ze=new Ei,Li=new Ei,Ee=new D;class we extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:su++}),this.uuid=Zn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Zc(t)?il:nl)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new jt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return He.makeRotationFromQuaternion(t),this.applyMatrix4(He),this}rotateX(t){return He.makeRotationX(t),this.applyMatrix4(He),this}rotateY(t){return He.makeRotationY(t),this.applyMatrix4(He),this}rotateZ(t){return He.makeRotationZ(t),this.applyMatrix4(He),this}translate(t,e,n){return He.makeTranslation(t,e,n),this.applyMatrix4(He),this}scale(t,e,n){return He.makeScale(t,e,n),this.applyMatrix4(He),this}lookAt(t){return pr.lookAt(t),pr.updateMatrix(),this.applyMatrix4(pr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(li).negate(),this.translate(li.x,li.y,li.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let s=0,r=t.length;s<r;s++){const o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ne(n,3))}else{const n=Math.min(t.length,e.count);for(let s=0;s<n;s++){const r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ei);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){const r=e[n];ze.setFromBufferAttribute(r),this.morphTargetsRelative?(Ee.addVectors(this.boundingBox.min,ze.min),this.boundingBox.expandByPoint(Ee),Ee.addVectors(this.boundingBox.max,ze.max),this.boundingBox.expandByPoint(Ee)):(this.boundingBox.expandByPoint(ze.min),this.boundingBox.expandByPoint(ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ks);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(t){const n=this.boundingSphere.center;if(ze.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Li.setFromBufferAttribute(a),this.morphTargetsRelative?(Ee.addVectors(ze.min,Li.min),ze.expandByPoint(Ee),Ee.addVectors(ze.max,Li.max),ze.expandByPoint(Ee)):(ze.expandByPoint(Li.min),ze.expandByPoint(Li.max))}ze.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)Ee.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Ee));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Ee.fromBufferAttribute(a,l),c&&(li.fromBufferAttribute(t,l),Ee.add(li)),s=Math.max(s,n.distanceToSquared(Ee))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,s=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new en(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<n.count;C++)a[C]=new D,c[C]=new D;const l=new D,h=new D,u=new D,d=new vt,f=new vt,g=new vt,v=new D,m=new D;function p(C,x,b){l.fromBufferAttribute(n,C),h.fromBufferAttribute(n,x),u.fromBufferAttribute(n,b),d.fromBufferAttribute(r,C),f.fromBufferAttribute(r,x),g.fromBufferAttribute(r,b),h.sub(l),u.sub(l),f.sub(d),g.sub(d);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(v.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),a[C].add(v),a[x].add(v),a[b].add(v),c[C].add(m),c[x].add(m),c[b].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let C=0,x=S.length;C<x;++C){const b=S[C],L=b.start,B=b.count;for(let W=L,J=L+B;W<J;W+=3)p(t.getX(W+0),t.getX(W+1),t.getX(W+2))}const M=new D,_=new D,R=new D,w=new D;function T(C){R.fromBufferAttribute(s,C),w.copy(R);const x=a[C];M.copy(x),M.sub(R.multiplyScalar(R.dot(x))).normalize(),_.crossVectors(w,x);const L=_.dot(c[C])<0?-1:1;o.setXYZW(C,M.x,M.y,M.z,L)}for(let C=0,x=S.length;C<x;++C){const b=S[C],L=b.start,B=b.count;for(let W=L,J=L+B;W<J;W+=3)T(t.getX(W+0)),T(t.getX(W+1)),T(t.getX(W+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new en(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);const s=new D,r=new D,o=new D,a=new D,c=new D,l=new D,h=new D,u=new D;if(t)for(let d=0,f=t.count;d<f;d+=3){const g=t.getX(d+0),v=t.getX(d+1),m=t.getX(d+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,v),o.fromBufferAttribute(e,m),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,m),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(s,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ee.fromBufferAttribute(t,e),Ee.normalize(),t.setXYZ(e,Ee.x,Ee.y,Ee.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let f=0,g=0;for(let v=0,m=c.length;v<m;v++){a.isInterleavedBufferAttribute?f=c[v]*a.data.stride+a.offset:f=c[v]*h;for(let p=0;p<h;p++)d[g++]=l[f++]}return new en(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new we,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],f=t(d,n);c.push(f)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const f=l[u];h.push(f.toJSON(t.data))}h.length>0&&(s[c]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const s=t.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ca=new ge,Un=new Qc,fs=new ks,Ra=new D,ps=new D,ms=new D,gs=new D,mr=new D,_s=new D,Pa=new D,vs=new D;class P extends xe{constructor(t=new we,e=new Vs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);const a=this.morphTargetInfluences;if(r&&a){_s.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(mr.fromBufferAttribute(u,t),o?_s.addScaledVector(mr,h):_s.addScaledVector(mr.sub(e),h))}e.add(_s)}return e}raycast(t,e){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),fs.copy(n.boundingSphere),fs.applyMatrix4(r),Un.copy(t.ray).recast(t.near),!(fs.containsPoint(Un.origin)===!1&&(Un.intersectSphere(fs,Ra)===null||Un.origin.distanceToSquared(Ra)>(t.far-t.near)**2))&&(Ca.copy(r).invert(),Un.copy(t.ray).applyMatrix4(Ca),!(n.boundingBox!==null&&Un.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Un)))}_computeIntersections(t,e,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),M=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let _=S,R=M;_<R;_+=3){const w=a.getX(_),T=a.getX(_+1),C=a.getX(_+2);s=xs(this,p,t,n,l,h,u,w,T,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(a.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=a.getX(m),M=a.getX(m+1),_=a.getX(m+2);s=xs(this,o,t,n,l,h,u,S,M,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const m=d[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),M=Math.min(c.count,Math.min(m.start+m.count,f.start+f.count));for(let _=S,R=M;_<R;_+=3){const w=_,T=_+1,C=_+2;s=xs(this,p,t,n,l,h,u,w,T,C),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=m.materialIndex,e.push(s))}}else{const g=Math.max(0,f.start),v=Math.min(c.count,f.start+f.count);for(let m=g,p=v;m<p;m+=3){const S=m,M=m+1,_=m+2;s=xs(this,o,t,n,l,h,u,S,M,_),s&&(s.faceIndex=Math.floor(m/3),e.push(s))}}}}function ru(i,t,e,n,s,r,o,a){let c;if(t.side===Ue?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,t.side===_n,a),c===null)return null;vs.copy(a),vs.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(vs);return l<e.near||l>e.far?null:{distance:l,point:vs.clone(),object:i}}function xs(i,t,e,n,s,r,o,a,c,l){i.getVertexPosition(a,ps),i.getVertexPosition(c,ms),i.getVertexPosition(l,gs);const h=ru(i,t,e,n,ps,ms,gs,Pa);if(h){const u=new D;Je.getBarycoord(Pa,ps,ms,gs,u),s&&(h.uv=Je.getInterpolatedAttribute(s,a,c,l,u,new vt)),r&&(h.uv1=Je.getInterpolatedAttribute(r,a,c,l,u,new vt)),o&&(h.normal=Je.getInterpolatedAttribute(o,a,c,l,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new D,materialIndex:0};Je.getNormal(ps,ms,gs,d.normal),h.face=d,h.barycoord=u}return h}class ot extends we{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,f=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ne(l,3)),this.setAttribute("normal",new ne(h,3)),this.setAttribute("uv",new ne(u,2));function g(v,m,p,S,M,_,R,w,T,C,x){const b=_/T,L=R/C,B=_/2,W=R/2,J=w/2,j=T+1,Z=C+1;let it=0,F=0;const pt=new D;for(let yt=0;yt<Z;yt++){const Rt=yt*L-W;for(let Mt=0;Mt<j;Mt++){const Zt=Mt*b-B;pt[v]=Zt*S,pt[m]=Rt*M,pt[p]=J,l.push(pt.x,pt.y,pt.z),pt[v]=0,pt[m]=0,pt[p]=w>0?1:-1,h.push(pt.x,pt.y,pt.z),u.push(Mt/T),u.push(1-yt/C),it+=1}}for(let yt=0;yt<C;yt++)for(let Rt=0;Rt<T;Rt++){const Mt=d+Rt+j*yt,Zt=d+Rt+j*(yt+1),ie=d+(Rt+1)+j*(yt+1),te=d+(Rt+1)+j*yt;c.push(Mt,Zt,te),c.push(Zt,ie,te),F+=6}a.addGroup(f,F,x),f+=F,d+=it}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ot(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function yi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function Le(i){const t={};for(let e=0;e<i.length;e++){const n=yi(i[e]);for(const s in n)t[s]=n[s]}return t}function ou(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function sl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}const au={clone:yi,merge:Le};var cu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Cn extends wi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cu,this.fragmentShader=lu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=yi(t.uniforms),this.uniformsGroups=ou(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class rl extends xe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ge,this.projectionMatrix=new ge,this.projectionMatrixInverse=new ge,this.coordinateSystem=tn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const En=new D,La=new vt,Ia=new vt;class Ye extends rl{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Fi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(Fi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){En.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(En.x,En.y).multiplyScalar(-t/En.z),En.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(En.x,En.y).multiplyScalar(-t/En.z)}getViewSize(t,e){return this.getViewBounds(t,La,Ia),e.subVectors(Ia,La)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Fi*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,e-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const hi=-90,ui=1;class hu extends xe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ye(hi,ui,t,e);s.layers=this.layers,this.add(s);const r=new Ye(hi,ui,t,e);r.layers=this.layers,this.add(r);const o=new Ye(hi,ui,t,e);o.layers=this.layers,this.add(o);const a=new Ye(hi,ui,t,e);a.layers=this.layers,this.add(a);const c=new Ye(hi,ui,t,e);c.layers=this.layers,this.add(c);const l=new Ye(hi,ui,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===tn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Ns)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,o),t.setRenderTarget(n,2,s),t.render(e,a),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ol extends Ce{constructor(t=[],e=vi,n,s,r,o,a,c,l,h){super(t,e,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class uu extends Jn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new ol(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ot(5,5,5),r=new Cn({name:"CubemapFromEquirect",uniforms:yi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ue,blending:Tn});r.uniforms.tEquirect.value=e;const o=new P(s,r),a=e.minFilter;return e.minFilter===Wn&&(e.minFilter=Qe),new hu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}}class Et extends xe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const du={type:"move"};class gr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const m=e.getJointPose(v,n),p=this._getHandJoint(l,v);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;l.inputState.pinching&&d>f+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=f-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(du)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Et;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Xo{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Qt(t),this.near=e,this.far=n}clone(){return new Xo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class fu extends xe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new vn,this.environmentIntensity=1,this.environmentRotation=new vn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class pu extends Ce{constructor(t=null,e=1,n=1,s,r,o,a,c,l=Ie,h=Ie,u,d){super(null,o,a,c,l,h,s,r,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const _r=new D,mu=new D,gu=new jt;class Bn{constructor(t=new D(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const s=_r.subVectors(n,e).cross(mu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(_r),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||gu.getNormalMatrix(t),s=this.coplanarPoint(_r).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Nn=new ks,_u=new vt(.5,.5),Ms=new D;class qo{constructor(t=new Bn,e=new Bn,n=new Bn,s=new Bn,r=new Bn,o=new Bn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=tn,n=!1){const s=this.planes,r=t.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],v=r[9],m=r[10],p=r[11],S=r[12],M=r[13],_=r[14],R=r[15];if(s[0].setComponents(l-o,f-h,p-g,R-S).normalize(),s[1].setComponents(l+o,f+h,p+g,R+S).normalize(),s[2].setComponents(l+a,f+u,p+v,R+M).normalize(),s[3].setComponents(l-a,f-u,p-v,R-M).normalize(),n)s[4].setComponents(c,d,m,_).normalize(),s[5].setComponents(l-c,f-d,p-m,R-_).normalize();else if(s[4].setComponents(l-c,f-d,p-m,R-_).normalize(),e===tn)s[5].setComponents(l+c,f+d,p+m,R+_).normalize();else if(e===Ns)s[5].setComponents(c,d,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Nn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Nn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Nn)}intersectsSprite(t){Nn.center.set(0,0,0);const e=_u.distanceTo(t.center);return Nn.radius=.7071067811865476+e,Nn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Nn)}intersectsSphere(t){const e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const s=e[n];if(Ms.x=s.normal.x>0?t.max.x:t.min.x,Ms.y=s.normal.y>0?t.max.y:t.min.y,Ms.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ms)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class al extends wi{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Qt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Os=new D,zs=new D,Da=new ge,Ii=new Qc,ys=new ks,vr=new D,Ua=new D;class vu extends xe{constructor(t=new we,e=new al){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)Os.fromBufferAttribute(e,s-1),zs.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=Os.distanceTo(zs);t.setAttribute("lineDistance",new ne(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ys.copy(n.boundingSphere),ys.applyMatrix4(s),ys.radius+=r,t.ray.intersectsSphere(ys)===!1)return;Da.copy(s).invert(),Ii.copy(t.ray).applyMatrix4(Da);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=h.getX(v),S=h.getX(v+1),M=Ss(this,t,Ii,c,p,S,v);M&&e.push(M)}if(this.isLineLoop){const v=h.getX(g-1),m=h.getX(f),p=Ss(this,t,Ii,c,v,m,g-1);p&&e.push(p)}}else{const f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let v=f,m=g-1;v<m;v+=l){const p=Ss(this,t,Ii,c,v,v+1,v);p&&e.push(p)}if(this.isLineLoop){const v=Ss(this,t,Ii,c,g-1,f,g-1);v&&e.push(v)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ss(i,t,e,n,s,r,o){const a=i.geometry.attributes.position;if(Os.fromBufferAttribute(a,s),zs.fromBufferAttribute(a,r),e.distanceSqToSegment(Os,zs,vr,Ua)>n)return;vr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(vr);if(!(l<t.near||l>t.far))return{distance:l,point:Ua.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const Na=new D,Fa=new D;class Oa extends vu{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)Na.fromBufferAttribute(e,s),Fa.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Na.distanceTo(Fa);t.setAttribute("lineDistance",new ne(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class xu extends Ce{constructor(t,e,n,s,r,o,a,c,l){super(t,e,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class cl extends Ce{constructor(t,e,n=jn,s,r,o,a=Ie,c=Ie,l,h=Wi,u=1){if(h!==Wi&&h!==Xi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:t,height:e,depth:u};super(d,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Wo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ll extends Ce{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Xn extends we{constructor(t=1,e=1,n=4,s=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:s,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),s=Math.max(3,Math.floor(s)),r=Math.max(1,Math.floor(r));const o=[],a=[],c=[],l=[],h=e/2,u=Math.PI/2*t,d=e,f=2*u+d,g=n*2+r,v=s+1,m=new D,p=new D;for(let S=0;S<=g;S++){let M=0,_=0,R=0,w=0;if(S<=n){const x=S/n,b=x*Math.PI/2;_=-h-t*Math.cos(b),R=t*Math.sin(b),w=-t*Math.cos(b),M=x*u}else if(S<=n+r){const x=(S-n)/r;_=-h+x*e,R=t,w=0,M=u+x*d}else{const x=(S-n-r)/n,b=x*Math.PI/2;_=h+t*Math.sin(b),R=t*Math.cos(b),w=t*Math.sin(b),M=u+d+x*u}const T=Math.max(0,Math.min(1,M/f));let C=0;S===0?C=.5/s:S===g&&(C=-.5/s);for(let x=0;x<=s;x++){const b=x/s,L=b*Math.PI*2,B=Math.sin(L),W=Math.cos(L);p.x=-R*W,p.y=_,p.z=R*B,a.push(p.x,p.y,p.z),m.set(-R*W,w,R*B),m.normalize(),c.push(m.x,m.y,m.z),l.push(b+C,T)}if(S>0){const x=(S-1)*v;for(let b=0;b<s;b++){const L=x+b,B=x+b+1,W=S*v+b,J=S*v+b+1;o.push(L,B,W),o.push(B,J,W)}}}this.setIndex(o),this.setAttribute("position",new ne(a,3)),this.setAttribute("normal",new ne(c,3)),this.setAttribute("uv",new ne(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Xn(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class ji extends we{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);const r=[],o=[],a=[],c=[],l=new D,h=new vt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const f=n+u/e*s;l.x=t*Math.cos(f),l.y=t*Math.sin(f),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new ne(o,3)),this.setAttribute("normal",new ne(a,3)),this.setAttribute("uv",new ne(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ji(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class At extends we{constructor(t=1,e=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],d=[],f=[];let g=0;const v=[],m=n/2;let p=0;S(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(h),this.setAttribute("position",new ne(u,3)),this.setAttribute("normal",new ne(d,3)),this.setAttribute("uv",new ne(f,2));function S(){const _=new D,R=new D;let w=0;const T=(e-t)/n;for(let C=0;C<=r;C++){const x=[],b=C/r,L=b*(e-t)+t;for(let B=0;B<=s;B++){const W=B/s,J=W*c+a,j=Math.sin(J),Z=Math.cos(J);R.x=L*j,R.y=-b*n+m,R.z=L*Z,u.push(R.x,R.y,R.z),_.set(j,T,Z).normalize(),d.push(_.x,_.y,_.z),f.push(W,1-b),x.push(g++)}v.push(x)}for(let C=0;C<s;C++)for(let x=0;x<r;x++){const b=v[x][C],L=v[x+1][C],B=v[x+1][C+1],W=v[x][C+1];(t>0||x!==0)&&(h.push(b,L,W),w+=3),(e>0||x!==r-1)&&(h.push(L,B,W),w+=3)}l.addGroup(p,w,0),p+=w}function M(_){const R=g,w=new vt,T=new D;let C=0;const x=_===!0?t:e,b=_===!0?1:-1;for(let B=1;B<=s;B++)u.push(0,m*b,0),d.push(0,b,0),f.push(.5,.5),g++;const L=g;for(let B=0;B<=s;B++){const J=B/s*c+a,j=Math.cos(J),Z=Math.sin(J);T.x=x*Z,T.y=m*b,T.z=x*j,u.push(T.x,T.y,T.z),d.push(0,b,0),w.x=j*.5+.5,w.y=Z*.5*b+.5,f.push(w.x,w.y),g++}for(let B=0;B<s;B++){const W=R+B,J=L+B;_===!0?h.push(J,J+1,W):h.push(J+1,J,W),C+=3}l.addGroup(p,C,_===!0?1:2),p+=C}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new At(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class sn extends At{constructor(t=1,e=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new sn(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Hs extends we{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new ne(r,3)),this.setAttribute("normal",new ne(r.slice(),3)),this.setAttribute("uv",new ne(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(S){const M=new D,_=new D,R=new D;for(let w=0;w<e.length;w+=3)f(e[w+0],M),f(e[w+1],_),f(e[w+2],R),c(M,_,R,S)}function c(S,M,_,R){const w=R+1,T=[];for(let C=0;C<=w;C++){T[C]=[];const x=S.clone().lerp(_,C/w),b=M.clone().lerp(_,C/w),L=w-C;for(let B=0;B<=L;B++)B===0&&C===w?T[C][B]=x:T[C][B]=x.clone().lerp(b,B/L)}for(let C=0;C<w;C++)for(let x=0;x<2*(w-C)-1;x++){const b=Math.floor(x/2);x%2===0?(d(T[C][b+1]),d(T[C+1][b]),d(T[C][b])):(d(T[C][b+1]),d(T[C+1][b+1]),d(T[C+1][b]))}}function l(S){const M=new D;for(let _=0;_<r.length;_+=3)M.x=r[_+0],M.y=r[_+1],M.z=r[_+2],M.normalize().multiplyScalar(S),r[_+0]=M.x,r[_+1]=M.y,r[_+2]=M.z}function h(){const S=new D;for(let M=0;M<r.length;M+=3){S.x=r[M+0],S.y=r[M+1],S.z=r[M+2];const _=m(S)/2/Math.PI+.5,R=p(S)/Math.PI+.5;o.push(_,1-R)}g(),u()}function u(){for(let S=0;S<o.length;S+=6){const M=o[S+0],_=o[S+2],R=o[S+4],w=Math.max(M,_,R),T=Math.min(M,_,R);w>.9&&T<.1&&(M<.2&&(o[S+0]+=1),_<.2&&(o[S+2]+=1),R<.2&&(o[S+4]+=1))}}function d(S){r.push(S.x,S.y,S.z)}function f(S,M){const _=S*3;M.x=t[_+0],M.y=t[_+1],M.z=t[_+2]}function g(){const S=new D,M=new D,_=new D,R=new D,w=new vt,T=new vt,C=new vt;for(let x=0,b=0;x<r.length;x+=9,b+=6){S.set(r[x+0],r[x+1],r[x+2]),M.set(r[x+3],r[x+4],r[x+5]),_.set(r[x+6],r[x+7],r[x+8]),w.set(o[b+0],o[b+1]),T.set(o[b+2],o[b+3]),C.set(o[b+4],o[b+5]),R.copy(S).add(M).add(_).divideScalar(3);const L=m(R);v(w,b+0,S,L),v(T,b+2,M,L),v(C,b+4,_,L)}}function v(S,M,_,R){R<0&&S.x===1&&(o[M]=S.x-1),_.x===0&&_.z===0&&(o[M]=R/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Hs(t.vertices,t.indices,t.radius,t.details)}}class Yo extends Hs{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Yo(t.radius,t.detail)}}class rn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,s=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let s=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],d=n[s+1]-h,f=(o-h)/d;return(s+f)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=e||(o.isVector2?new vt:new D);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new D,s=[],r=[],o=[],a=new D,c=new ge;for(let f=0;f<=t;f++){const g=f/t;s[f]=this.getTangentAt(g,new D)}r[0]=new D,o[0]=new D;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(s[f-1],s[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Kt(s[f-1].dot(s[f]),-1,1));r[f].applyMatrix4(c.makeRotationAxis(a,g))}o[f].crossVectors(s[f],r[f])}if(e===!0){let f=Math.acos(Kt(r[0].dot(r[t]),-1,1));f/=t,s[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],f*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class jo extends rn{constructor(t=0,e=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new vt){const n=e,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,f=l-this.aY;c=d*h-f*u+this.aX,l=d*u+f*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class Mu extends jo{constructor(t,e,n,s,r,o){super(t,e,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Jo(){let i=0,t=0,e=0,n=0;function s(r,o,a,c){i=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,f=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,f*=h,s(o,a,d,f)},calc:function(r){const o=r*r,a=o*r;return i+t*r+e*o+n*a}}}const bs=new D,xr=new Jo,Mr=new Jo,yr=new Jo;class yu extends rn{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new D){const n=e,s=this.points,r=s.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(bs.subVectors(s[0],s[1]).add(s[0]),l=bs);const u=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(bs.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=bs),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),f),v=Math.pow(u.distanceToSquared(d),f),m=Math.pow(d.distanceToSquared(h),f);v<1e-4&&(v=1),g<1e-4&&(g=v),m<1e-4&&(m=v),xr.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,m),Mr.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,m),yr.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,m)}else this.curveType==="catmullrom"&&(xr.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Mr.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),yr.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(xr.calc(c),Mr.calc(c),yr.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new D().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function za(i,t,e,n,s){const r=(n-t)*.5,o=(s-e)*.5,a=i*i,c=i*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*i+e}function Su(i,t){const e=1-i;return e*e*t}function bu(i,t){return 2*(1-i)*i*t}function Eu(i,t){return i*i*t}function zi(i,t,e,n){return Su(i,t)+bu(i,e)+Eu(i,n)}function wu(i,t){const e=1-i;return e*e*e*t}function Tu(i,t){const e=1-i;return 3*e*e*i*t}function Au(i,t){return 3*(1-i)*i*i*t}function Cu(i,t){return i*i*i*t}function Bi(i,t,e,n,s){return wu(i,t)+Tu(i,e)+Au(i,n)+Cu(i,s)}class hl extends rn{constructor(t=new vt,e=new vt,n=new vt,s=new vt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new vt){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Bi(t,s.x,r.x,o.x,a.x),Bi(t,s.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Ru extends rn{constructor(t=new D,e=new D,n=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Bi(t,s.x,r.x,o.x,a.x),Bi(t,s.y,r.y,o.y,a.y),Bi(t,s.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ul extends rn{constructor(t=new vt,e=new vt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new vt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new vt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Pu extends rn{constructor(t=new D,e=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new D){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new D){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class dl extends rn{constructor(t=new vt,e=new vt,n=new vt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new vt){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(zi(t,s.x,r.x,o.x),zi(t,s.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Lu extends rn{constructor(t=new D,e=new D,n=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new D){const n=e,s=this.v0,r=this.v1,o=this.v2;return n.set(zi(t,s.x,r.x,o.x),zi(t,s.y,r.y,o.y),zi(t,s.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class fl extends rn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new vt){const n=e,s=this.points,r=(s.length-1)*t,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],u=s[o>s.length-3?s.length-1:o+2];return n.set(za(a,c.x,l.x,h.x,u.x),za(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const s=t.points[e];this.points.push(new vt().fromArray(s))}return this}}var bo=Object.freeze({__proto__:null,ArcCurve:Mu,CatmullRomCurve3:yu,CubicBezierCurve:hl,CubicBezierCurve3:Ru,EllipseCurve:jo,LineCurve:ul,LineCurve3:Pu,QuadraticBezierCurve:dl,QuadraticBezierCurve3:Lu,SplineCurve:fl});class Iu extends rn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const s=t.curves[e];this.curves.push(new bo[s.type]().fromJSON(s))}return this}}class Eo extends Iu{constructor(t){super(),this.type="Path",this.currentPoint=new vt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new ul(this.currentPoint.clone(),new vt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){const r=new dl(this.currentPoint.clone(),new vt(t,e),new vt(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,o){const a=new hl(this.currentPoint.clone(),new vt(t,e),new vt(n,s),new vt(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new fl(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,s,r,o),this}absarc(t,e,n,s,r,o){return this.absellipse(t,e,n,n,s,r,o),this}ellipse(t,e,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,s,r,o,a,c),this}absellipse(t,e,n,s,r,o,a,c){const l=new jo(t,e,n,s,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Gs extends Eo{constructor(t){super(t),this.uuid=Zn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const s=t.holes[e];this.holes.push(new Eo().fromJSON(s))}return this}}function Du(i,t,e=2){const n=t&&t.length,s=n?t[0]*e:i.length;let r=pl(i,0,s,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l;if(n&&(r=zu(i,t,r,e)),i.length>80*e){a=1/0,c=1/0;let h=-1/0,u=-1/0;for(let d=e;d<s;d+=e){const f=i[d],g=i[d+1];f<a&&(a=f),g<c&&(c=g),f>h&&(h=f),g>u&&(u=g)}l=Math.max(h-a,u-c),l=l!==0?32767/l:0}return Ji(r,o,e,a,c,l,0),o}function pl(i,t,e,n,s){let r;if(s===Ju(i,t,e,n)>0)for(let o=t;o<e;o+=n)r=Ba(o/n|0,i[o],i[o+1],r);else for(let o=e-n;o>=t;o-=n)r=Ba(o/n|0,i[o],i[o+1],r);return r&&Si(r,r.next)&&(Zi(r),r=r.next),r}function Kn(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Si(e,e.next)||me(e.prev,e,e.next)===0)){if(Zi(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ji(i,t,e,n,s,r,o){if(!i)return;!o&&r&&Gu(i,n,s,r);let a=i;for(;i.prev!==i.next;){const c=i.prev,l=i.next;if(r?Nu(i,n,s,r):Uu(i)){t.push(c.i,i.i,l.i),Zi(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=Fu(Kn(i),t),Ji(i,t,e,n,s,r,2)):o===2&&Ou(i,t,e,n,s,r):Ji(Kn(i),t,e,n,s,r,1);break}}}function Uu(i){const t=i.prev,e=i,n=i.next;if(me(t,e,n)>=0)return!1;const s=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=Math.min(s,r,o),u=Math.min(a,c,l),d=Math.max(s,r,o),f=Math.max(a,c,l);let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=f&&Ui(s,a,r,c,o,l,g.x,g.y)&&me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Nu(i,t,e,n){const s=i.prev,r=i,o=i.next;if(me(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,u=r.y,d=o.y,f=Math.min(a,c,l),g=Math.min(h,u,d),v=Math.max(a,c,l),m=Math.max(h,u,d),p=wo(f,g,t,e,n),S=wo(v,m,t,e,n);let M=i.prevZ,_=i.nextZ;for(;M&&M.z>=p&&_&&_.z<=S;){if(M.x>=f&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ui(a,h,c,u,l,d,M.x,M.y)&&me(M.prev,M,M.next)>=0||(M=M.prevZ,_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Ui(a,h,c,u,l,d,_.x,_.y)&&me(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;M&&M.z>=p;){if(M.x>=f&&M.x<=v&&M.y>=g&&M.y<=m&&M!==s&&M!==o&&Ui(a,h,c,u,l,d,M.x,M.y)&&me(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;_&&_.z<=S;){if(_.x>=f&&_.x<=v&&_.y>=g&&_.y<=m&&_!==s&&_!==o&&Ui(a,h,c,u,l,d,_.x,_.y)&&me(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function Fu(i,t){let e=i;do{const n=e.prev,s=e.next.next;!Si(n,s)&&gl(n,e,e.next,s)&&Ki(n,s)&&Ki(s,n)&&(t.push(n.i,e.i,s.i),Zi(e),Zi(e.next),e=i=s),e=e.next}while(e!==i);return Kn(e)}function Ou(i,t,e,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&qu(o,a)){let c=_l(o,a);o=Kn(o,o.next),c=Kn(c,c.next),Ji(o,t,e,n,s,r,0),Ji(c,t,e,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function zu(i,t,e,n){const s=[];for(let r=0,o=t.length;r<o;r++){const a=t[r]*n,c=r<o-1?t[r+1]*n:i.length,l=pl(i,a,c,n,!1);l===l.next&&(l.steiner=!0),s.push(Xu(l))}s.sort(Bu);for(let r=0;r<s.length;r++)e=ku(s[r],e);return e}function Bu(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){const n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function ku(i,t){const e=Vu(i,t);if(!e)return t;const n=_l(e,i);return Kn(n,n.next),Kn(e,e.next)}function Vu(i,t){let e=t;const n=i.x,s=i.y;let r=-1/0,o;if(Si(i,e))return e;do{if(Si(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){const u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>r&&(r=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,c=o.x,l=o.y;let h=1/0;e=o;do{if(n>=e.x&&e.x>=c&&n!==e.x&&ml(s<l?n:r,s,c,l,s<l?r:n,s,e.x,e.y)){const u=Math.abs(s-e.y)/(n-e.x);Ki(e,i)&&(u<h||u===h&&(e.x>o.x||e.x===o.x&&Hu(o,e)))&&(o=e,h=u)}e=e.next}while(e!==a);return o}function Hu(i,t){return me(i.prev,i,t.prev)<0&&me(t.next,i,i.next)<0}function Gu(i,t,e,n){let s=i;do s.z===0&&(s.z=wo(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Wu(s)}function Wu(i){let t,e=1;do{let n=i,s;i=null;let r=null;for(t=0;n;){t++;let o=n,a=0;for(let l=0;l<e&&(a++,o=o.nextZ,!!o);l++);let c=e;for(;a>0||c>0&&o;)a!==0&&(c===0||!o||n.z<=o.z)?(s=n,n=n.nextZ,a--):(s=o,o=o.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;n=o}r.nextZ=null,e*=2}while(t>1);return i}function wo(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Xu(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function ml(i,t,e,n,s,r,o,a){return(s-o)*(t-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(s-o)*(n-a)}function Ui(i,t,e,n,s,r,o,a){return!(i===o&&t===a)&&ml(i,t,e,n,s,r,o,a)}function qu(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Yu(i,t)&&(Ki(i,t)&&Ki(t,i)&&ju(i,t)&&(me(i.prev,i,t.prev)||me(i,t.prev,t))||Si(i,t)&&me(i.prev,i,i.next)>0&&me(t.prev,t,t.next)>0)}function me(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Si(i,t){return i.x===t.x&&i.y===t.y}function gl(i,t,e,n){const s=ws(me(i,t,e)),r=ws(me(i,t,n)),o=ws(me(e,n,i)),a=ws(me(e,n,t));return!!(s!==r&&o!==a||s===0&&Es(i,e,t)||r===0&&Es(i,n,t)||o===0&&Es(e,i,n)||a===0&&Es(e,t,n))}function Es(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function ws(i){return i>0?1:i<0?-1:0}function Yu(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&gl(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ki(i,t){return me(i.prev,i,i.next)<0?me(i,t,i.next)>=0&&me(i,i.prev,t)>=0:me(i,t,i.prev)<0||me(i,i.next,t)<0}function ju(i,t){let e=i,n=!1;const s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function _l(i,t){const e=To(i.i,i.x,i.y),n=To(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Ba(i,t,e,n){const s=To(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Zi(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function To(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ju(i,t,e,n){let s=0;for(let r=t,o=e-n;r<e;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class Ku{static triangulate(t,e,n=2){return Du(t,e,n)}}class mn{static area(t){const e=t.length;let n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return mn.area(t)<0}static triangulateShape(t,e){const n=[],s=[],r=[];ka(t),Va(n,t);let o=t.length;e.forEach(ka);for(let c=0;c<e.length;c++)s.push(o),o+=e[c].length,Va(n,e[c]);const a=Ku.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function ka(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Va(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class Ko extends we{constructor(t=new Gs([new vt(.5,.5),new vt(-.5,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,s=[],r=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new ne(s,3)),this.setAttribute("uv",new ne(r,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const p=e.extrudePath,S=e.UVGenerator!==void 0?e.UVGenerator:Zu;let M,_=!1,R,w,T,C;p&&(M=p.getSpacedPoints(h),_=!0,d=!1,R=p.computeFrenetFrames(h,!1),w=new D,T=new D,C=new D),d||(m=0,f=0,g=0,v=0);const x=a.extractPoints(l);let b=x.shape;const L=x.holes;if(!mn.isClockWise(b)){b=b.reverse();for(let lt=0,rt=L.length;lt<rt;lt++){const tt=L[lt];mn.isClockWise(tt)&&(L[lt]=tt.reverse())}}function W(lt){const tt=10000000000000001e-36;let nt=lt[0];for(let _t=1;_t<=lt.length;_t++){const ht=_t%lt.length,gt=lt[ht],Ht=gt.x-nt.x,zt=gt.y-nt.y,A=Ht*Ht+zt*zt,y=Math.max(Math.abs(gt.x),Math.abs(gt.y),Math.abs(nt.x),Math.abs(nt.y)),G=tt*y*y;if(A<=G){lt.splice(ht,1),_t--;continue}nt=gt}}W(b),L.forEach(W);const J=L.length,j=b;for(let lt=0;lt<J;lt++){const rt=L[lt];b=b.concat(rt)}function Z(lt,rt,tt){return rt||console.error("THREE.ExtrudeGeometry: vec does not exist"),lt.clone().addScaledVector(rt,tt)}const it=b.length;function F(lt,rt,tt){let nt,_t,ht;const gt=lt.x-rt.x,Ht=lt.y-rt.y,zt=tt.x-lt.x,A=tt.y-lt.y,y=gt*gt+Ht*Ht,G=gt*A-Ht*zt;if(Math.abs(G)>Number.EPSILON){const q=Math.sqrt(y),ct=Math.sqrt(zt*zt+A*A),K=rt.x-Ht/q,k=rt.y+gt/q,O=tt.x-A/ct,Q=tt.y+zt/ct,mt=((O-K)*A-(Q-k)*zt)/(gt*A-Ht*zt);nt=K+gt*mt-lt.x,_t=k+Ht*mt-lt.y;const st=nt*nt+_t*_t;if(st<=2)return new vt(nt,_t);ht=Math.sqrt(st/2)}else{let q=!1;gt>Number.EPSILON?zt>Number.EPSILON&&(q=!0):gt<-Number.EPSILON?zt<-Number.EPSILON&&(q=!0):Math.sign(Ht)===Math.sign(A)&&(q=!0),q?(nt=-Ht,_t=gt,ht=Math.sqrt(y)):(nt=gt,_t=Ht,ht=Math.sqrt(y/2))}return new vt(nt/ht,_t/ht)}const pt=[];for(let lt=0,rt=j.length,tt=rt-1,nt=lt+1;lt<rt;lt++,tt++,nt++)tt===rt&&(tt=0),nt===rt&&(nt=0),pt[lt]=F(j[lt],j[tt],j[nt]);const yt=[];let Rt,Mt=pt.concat();for(let lt=0,rt=J;lt<rt;lt++){const tt=L[lt];Rt=[];for(let nt=0,_t=tt.length,ht=_t-1,gt=nt+1;nt<_t;nt++,ht++,gt++)ht===_t&&(ht=0),gt===_t&&(gt=0),Rt[nt]=F(tt[nt],tt[ht],tt[gt]);yt.push(Rt),Mt=Mt.concat(Rt)}let Zt;if(m===0)Zt=mn.triangulateShape(j,L);else{const lt=[],rt=[];for(let tt=0;tt<m;tt++){const nt=tt/m,_t=f*Math.cos(nt*Math.PI/2),ht=g*Math.sin(nt*Math.PI/2)+v;for(let gt=0,Ht=j.length;gt<Ht;gt++){const zt=Z(j[gt],pt[gt],ht);Dt(zt.x,zt.y,-_t),nt===0&&lt.push(zt)}for(let gt=0,Ht=J;gt<Ht;gt++){const zt=L[gt];Rt=yt[gt];const A=[];for(let y=0,G=zt.length;y<G;y++){const q=Z(zt[y],Rt[y],ht);Dt(q.x,q.y,-_t),nt===0&&A.push(q)}nt===0&&rt.push(A)}}Zt=mn.triangulateShape(lt,rt)}const ie=Zt.length,te=g+v;for(let lt=0;lt<it;lt++){const rt=d?Z(b[lt],Mt[lt],te):b[lt];_?(T.copy(R.normals[0]).multiplyScalar(rt.x),w.copy(R.binormals[0]).multiplyScalar(rt.y),C.copy(M[0]).add(T).add(w),Dt(C.x,C.y,C.z)):Dt(rt.x,rt.y,0)}for(let lt=1;lt<=h;lt++)for(let rt=0;rt<it;rt++){const tt=d?Z(b[rt],Mt[rt],te):b[rt];_?(T.copy(R.normals[lt]).multiplyScalar(tt.x),w.copy(R.binormals[lt]).multiplyScalar(tt.y),C.copy(M[lt]).add(T).add(w),Dt(C.x,C.y,C.z)):Dt(tt.x,tt.y,u/h*lt)}for(let lt=m-1;lt>=0;lt--){const rt=lt/m,tt=f*Math.cos(rt*Math.PI/2),nt=g*Math.sin(rt*Math.PI/2)+v;for(let _t=0,ht=j.length;_t<ht;_t++){const gt=Z(j[_t],pt[_t],nt);Dt(gt.x,gt.y,u+tt)}for(let _t=0,ht=L.length;_t<ht;_t++){const gt=L[_t];Rt=yt[_t];for(let Ht=0,zt=gt.length;Ht<zt;Ht++){const A=Z(gt[Ht],Rt[Ht],nt);_?Dt(A.x,A.y+M[h-1].y,M[h-1].x+tt):Dt(A.x,A.y,u+tt)}}}et(),$();function et(){const lt=s.length/3;if(d){let rt=0,tt=it*rt;for(let nt=0;nt<ie;nt++){const _t=Zt[nt];Pt(_t[2]+tt,_t[1]+tt,_t[0]+tt)}rt=h+m*2,tt=it*rt;for(let nt=0;nt<ie;nt++){const _t=Zt[nt];Pt(_t[0]+tt,_t[1]+tt,_t[2]+tt)}}else{for(let rt=0;rt<ie;rt++){const tt=Zt[rt];Pt(tt[2],tt[1],tt[0])}for(let rt=0;rt<ie;rt++){const tt=Zt[rt];Pt(tt[0]+it*h,tt[1]+it*h,tt[2]+it*h)}}n.addGroup(lt,s.length/3-lt,0)}function $(){const lt=s.length/3;let rt=0;Ct(j,rt),rt+=j.length;for(let tt=0,nt=L.length;tt<nt;tt++){const _t=L[tt];Ct(_t,rt),rt+=_t.length}n.addGroup(lt,s.length/3-lt,1)}function Ct(lt,rt){let tt=lt.length;for(;--tt>=0;){const nt=tt;let _t=tt-1;_t<0&&(_t=lt.length-1);for(let ht=0,gt=h+m*2;ht<gt;ht++){const Ht=it*ht,zt=it*(ht+1),A=rt+nt+Ht,y=rt+_t+Ht,G=rt+_t+zt,q=rt+nt+zt;Wt(A,y,G,q)}}}function Dt(lt,rt,tt){c.push(lt),c.push(rt),c.push(tt)}function Pt(lt,rt,tt){ee(lt),ee(rt),ee(tt);const nt=s.length/3,_t=S.generateTopUV(n,s,nt-3,nt-2,nt-1);I(_t[0]),I(_t[1]),I(_t[2])}function Wt(lt,rt,tt,nt){ee(lt),ee(rt),ee(nt),ee(rt),ee(tt),ee(nt);const _t=s.length/3,ht=S.generateSideWallUV(n,s,_t-6,_t-3,_t-2,_t-1);I(ht[0]),I(ht[1]),I(ht[3]),I(ht[1]),I(ht[2]),I(ht[3])}function ee(lt){s.push(c[lt*3+0]),s.push(c[lt*3+1]),s.push(c[lt*3+2])}function I(lt){r.push(lt.x),r.push(lt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return $u(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,o=t.shapes.length;r<o;r++){const a=e[t.shapes[r]];n.push(a)}const s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new bo[s.type]().fromJSON(s)),new Ko(n,t.options)}}const Zu={generateTopUV:function(i,t,e,n,s){const r=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[s*3],h=t[s*3+1];return[new vt(r,o),new vt(a,c),new vt(l,h)]},generateSideWallUV:function(i,t,e,n,s,r){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],f=t[s*3+1],g=t[s*3+2],v=t[r*3],m=t[r*3+1],p=t[r*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new vt(o,1-c),new vt(l,1-u),new vt(d,1-g),new vt(v,1-p)]:[new vt(a,1-c),new vt(h,1-u),new vt(f,1-g),new vt(m,1-p)]}};function $u(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){const r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Ws extends Hs{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ws(t.radius,t.detail)}}class Ge extends we{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,u=t/a,d=e/c,f=[],g=[],v=[],m=[];for(let p=0;p<h;p++){const S=p*d-o;for(let M=0;M<l;M++){const _=M*u-r;g.push(_,-S,0),v.push(0,0,1),m.push(M/a),m.push(1-p/c)}}for(let p=0;p<c;p++)for(let S=0;S<a;S++){const M=S+l*p,_=S+l*(p+1),R=S+1+l*(p+1),w=S+1+l*p;f.push(M,_,w),f.push(_,R,w)}this.setIndex(f),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(v,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ge(t.width,t.height,t.widthSegments,t.heightSegments)}}class Zo extends we{constructor(t=new Gs([new vt(0,.5),new vt(-.5,-.5),new vt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],s=[],r=[],o=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new ne(s,3)),this.setAttribute("normal",new ne(r,3)),this.setAttribute("uv",new ne(o,2));function l(h){const u=s.length/3,d=h.extractPoints(e);let f=d.shape;const g=d.holes;mn.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,p=g.length;m<p;m++){const S=g[m];mn.isClockWise(S)===!0&&(g[m]=S.reverse())}const v=mn.triangulateShape(f,g);for(let m=0,p=g.length;m<p;m++){const S=g[m];f=f.concat(S)}for(let m=0,p=f.length;m<p;m++){const S=f[m];s.push(S.x,S.y,0),r.push(0,0,1),o.push(S.x,S.y)}for(let m=0,p=v.length;m<p;m++){const S=v[m],M=S[0]+u,_=S[1]+u,R=S[2]+u;n.push(M,_,R),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return Qu(e,t)}static fromJSON(t,e){const n=[];for(let s=0,r=t.shapes.length;s<r;s++){const o=e[t.shapes[s]];n.push(o)}return new Zo(n,t.curveSegments)}}function Qu(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){const s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}class Yt extends we{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new D,d=new D,f=[],g=[],v=[],m=[];for(let p=0;p<=n;p++){const S=[],M=p/n;let _=0;p===0&&o===0?_=.5/e:p===n&&c===Math.PI&&(_=-.5/e);for(let R=0;R<=e;R++){const w=R/e;u.x=-t*Math.cos(s+w*r)*Math.sin(o+M*a),u.y=t*Math.cos(o+M*a),u.z=t*Math.sin(s+w*r)*Math.sin(o+M*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),m.push(w+_,1-M),S.push(l++)}h.push(S)}for(let p=0;p<n;p++)for(let S=0;S<e;S++){const M=h[p][S+1],_=h[p][S],R=h[p+1][S],w=h[p+1][S+1];(p!==0||o>0)&&f.push(M,_,w),(p!==n-1||c<Math.PI)&&f.push(_,R,w)}this.setIndex(f),this.setAttribute("position",new ne(g,3)),this.setAttribute("normal",new ne(v,3)),this.setAttribute("uv",new ne(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Yt(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ye extends we{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);const o=[],a=[],c=[],l=[],h=new D,u=new D,d=new D;for(let f=0;f<=n;f++)for(let g=0;g<=s;g++){const v=g/s*r,m=f/n*Math.PI*2;u.x=(t+e*Math.cos(m))*Math.cos(v),u.y=(t+e*Math.cos(m))*Math.sin(v),u.z=e*Math.sin(m),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/s),l.push(f/n)}for(let f=1;f<=n;f++)for(let g=1;g<=s;g++){const v=(s+1)*f+g-1,m=(s+1)*(f-1)+g-1,p=(s+1)*(f-1)+g,S=(s+1)*f+g;o.push(v,m,S),o.push(m,p,S)}this.setIndex(o),this.setAttribute("position",new ne(a,3)),this.setAttribute("normal",new ne(c,3)),this.setAttribute("uv",new ne(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ye(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class $o extends wi{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new Qt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Qt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Jc,this.normalScale=new vt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class td extends wi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class ed extends wi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class vl extends xe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Qt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class nd extends vl{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Qt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Sr=new ge,Ha=new D,Ga=new D;class id{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new vt(512,512),this.mapType=nn,this.map=null,this.mapPass=null,this.matrix=new ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new qo,this._frameExtents=new vt(1,1),this._viewportCount=1,this._viewports=[new ve(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ha.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ha),Ga.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ga),e.updateMatrixWorld(),Sr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sr,e.coordinateSystem,e.reversedDepth),e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Sr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Qo extends rl{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=s+e,c=s-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class sd extends id{constructor(){super(new Qo(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rd extends vl{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xe.DEFAULT_UP),this.updateMatrix(),this.target=new xe,this.shadow=new sd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class od extends Ye{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class ad{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Wa(i,t,e,n){const s=cd(n);switch(e){case qc:return i*t;case Bo:return i*t/s.components*s.byteLength;case ko:return i*t/s.components*s.byteLength;case jc:return i*t*2/s.components*s.byteLength;case Vo:return i*t*2/s.components*s.byteLength;case Yc:return i*t*3/s.components*s.byteLength;case Ke:return i*t*4/s.components*s.byteLength;case Ho:return i*t*4/s.components*s.byteLength;case Rs:case Ps:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ls:case Is:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Jr:case Zr:return Math.max(i,16)*Math.max(t,8)/4;case jr:case Kr:return Math.max(i,8)*Math.max(t,8)/2;case $r:case Qr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case to:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case eo:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case no:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case io:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case so:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case ro:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case oo:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ao:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case co:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case lo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case ho:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case uo:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case fo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case po:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case mo:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case go:case _o:case vo:return Math.ceil(i/4)*Math.ceil(t/4)*16;case xo:case Mo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case yo:case So:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function cd(i){switch(i){case nn:case Hc:return{byteLength:1,components:1};case Hi:case Gc:case $i:return{byteLength:2,components:1};case Oo:case zo:return{byteLength:2,components:4};case jn:case Fo:case pn:return{byteLength:4,components:1};case Wc:case Xc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:No}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=No);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function xl(){let i=null,t=!1,e=null,n=null;function s(r,o){e(r,o),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function ld(i){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=i.createBuffer();i.bindBuffer(c,d),i.bufferData(c,l,h),a.onUploadCallback();let f;if(l instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)f=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)f=i.SHORT;else if(l instanceof Uint32Array)f=i.UNSIGNED_INT;else if(l instanceof Int32Array)f=i.INT;else if(l instanceof Int8Array)f=i.BYTE;else if(l instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:f,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c.updateRanges;if(i.bindBuffer(l,a),u.length===0)i.bufferSubData(l,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){const g=u[d],v=u[f];v.start<=g.start+g.count+1?g.count=Math.max(g.count,v.start+v.count-g.start):(++d,u[d]=v)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){const v=u[f];i.bufferSubData(l,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(i.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var hd=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ud=`#ifdef USE_ALPHAHASH
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
#endif`,dd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,fd=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pd=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,md=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gd=`#ifdef USE_AOMAP
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
#endif`,_d=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,vd=`#ifdef USE_BATCHING
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
#endif`,xd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Md=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yd=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sd=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,bd=`#ifdef USE_IRIDESCENCE
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
#endif`,Ed=`#ifdef USE_BUMPMAP
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
#endif`,wd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Td=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ad=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Rd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Pd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ld=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Id=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Dd=`#define PI 3.141592653589793
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
} // validated`,Ud=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Nd=`vec3 transformedNormal = objectNormal;
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
#endif`,Fd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Od=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,zd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,kd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vd=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hd=`#ifdef USE_ENVMAP
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
#endif`,Gd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wd=`#ifdef USE_ENVMAP
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
#endif`,Xd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qd=`#ifdef USE_ENVMAP
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
#endif`,Yd=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,jd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Jd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Kd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zd=`#ifdef USE_GRADIENTMAP
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
}`,$d=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qd=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ef=`uniform bool receiveShadow;
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
#endif`,nf=`#ifdef USE_ENVMAP
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
#endif`,sf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,of=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,af=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cf=`PhysicalMaterial material;
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
#endif`,lf=`struct PhysicalMaterial {
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
}`,hf=`
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
#endif`,uf=`#if defined( RE_IndirectDiffuse )
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
#endif`,df=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,ff=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_f=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Mf=`#if defined( USE_POINTS_UV )
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
#endif`,yf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Sf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ef=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tf=`#ifdef USE_MORPHTARGETS
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
#endif`,Af=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Rf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Pf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,If=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Df=`#ifdef USE_NORMALMAP
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
#endif`,Uf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Nf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ff=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Of=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,kf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Hf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Xf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Yf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Jf=`float getShadowMask() {
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
}`,Kf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zf=`#ifdef USE_SKINNING
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
#endif`,$f=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qf=`#ifdef USE_SKINNING
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
#endif`,tp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ep=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,np=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ip=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,sp=`#ifdef USE_TRANSMISSION
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
#endif`,rp=`#ifdef USE_TRANSMISSION
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
#endif`,op=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ap=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,cp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const hp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,up=`uniform sampler2D t2D;
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
}`,dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fp=`#ifdef ENVMAP_TYPE_CUBE
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
}`,pp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mp=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gp=`#include <common>
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
}`,_p=`#if DEPTH_PACKING == 3200
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
}`,vp=`#define DISTANCE
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
}`,xp=`#define DISTANCE
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
}`,Mp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yp=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sp=`uniform float scale;
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
}`,bp=`uniform vec3 diffuse;
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
}`,Ep=`#include <common>
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
}`,wp=`uniform vec3 diffuse;
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
}`,Tp=`#define LAMBERT
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
}`,Ap=`#define LAMBERT
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
}`,Cp=`#define MATCAP
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
}`,Rp=`#define MATCAP
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
}`,Pp=`#define NORMAL
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
}`,Lp=`#define NORMAL
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
}`,Ip=`#define PHONG
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
}`,Dp=`#define PHONG
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
}`,Up=`#define STANDARD
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
}`,Np=`#define STANDARD
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
}`,Fp=`#define TOON
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
}`,Op=`#define TOON
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
}`,zp=`uniform float size;
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
}`,Bp=`uniform vec3 diffuse;
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
}`,kp=`#include <common>
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
}`,Vp=`uniform vec3 color;
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
}`,Hp=`uniform float rotation;
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
}`,Gp=`uniform vec3 diffuse;
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
}`,Jt={alphahash_fragment:hd,alphahash_pars_fragment:ud,alphamap_fragment:dd,alphamap_pars_fragment:fd,alphatest_fragment:pd,alphatest_pars_fragment:md,aomap_fragment:gd,aomap_pars_fragment:_d,batching_pars_vertex:vd,batching_vertex:xd,begin_vertex:Md,beginnormal_vertex:yd,bsdfs:Sd,iridescence_fragment:bd,bumpmap_pars_fragment:Ed,clipping_planes_fragment:wd,clipping_planes_pars_fragment:Td,clipping_planes_pars_vertex:Ad,clipping_planes_vertex:Cd,color_fragment:Rd,color_pars_fragment:Pd,color_pars_vertex:Ld,color_vertex:Id,common:Dd,cube_uv_reflection_fragment:Ud,defaultnormal_vertex:Nd,displacementmap_pars_vertex:Fd,displacementmap_vertex:Od,emissivemap_fragment:zd,emissivemap_pars_fragment:Bd,colorspace_fragment:kd,colorspace_pars_fragment:Vd,envmap_fragment:Hd,envmap_common_pars_fragment:Gd,envmap_pars_fragment:Wd,envmap_pars_vertex:Xd,envmap_physical_pars_fragment:nf,envmap_vertex:qd,fog_vertex:Yd,fog_pars_vertex:jd,fog_fragment:Jd,fog_pars_fragment:Kd,gradientmap_pars_fragment:Zd,lightmap_pars_fragment:$d,lights_lambert_fragment:Qd,lights_lambert_pars_fragment:tf,lights_pars_begin:ef,lights_toon_fragment:sf,lights_toon_pars_fragment:rf,lights_phong_fragment:of,lights_phong_pars_fragment:af,lights_physical_fragment:cf,lights_physical_pars_fragment:lf,lights_fragment_begin:hf,lights_fragment_maps:uf,lights_fragment_end:df,logdepthbuf_fragment:ff,logdepthbuf_pars_fragment:pf,logdepthbuf_pars_vertex:mf,logdepthbuf_vertex:gf,map_fragment:_f,map_pars_fragment:vf,map_particle_fragment:xf,map_particle_pars_fragment:Mf,metalnessmap_fragment:yf,metalnessmap_pars_fragment:Sf,morphinstance_vertex:bf,morphcolor_vertex:Ef,morphnormal_vertex:wf,morphtarget_pars_vertex:Tf,morphtarget_vertex:Af,normal_fragment_begin:Cf,normal_fragment_maps:Rf,normal_pars_fragment:Pf,normal_pars_vertex:Lf,normal_vertex:If,normalmap_pars_fragment:Df,clearcoat_normal_fragment_begin:Uf,clearcoat_normal_fragment_maps:Nf,clearcoat_pars_fragment:Ff,iridescence_pars_fragment:Of,opaque_fragment:zf,packing:Bf,premultiplied_alpha_fragment:kf,project_vertex:Vf,dithering_fragment:Hf,dithering_pars_fragment:Gf,roughnessmap_fragment:Wf,roughnessmap_pars_fragment:Xf,shadowmap_pars_fragment:qf,shadowmap_pars_vertex:Yf,shadowmap_vertex:jf,shadowmask_pars_fragment:Jf,skinbase_vertex:Kf,skinning_pars_vertex:Zf,skinning_vertex:$f,skinnormal_vertex:Qf,specularmap_fragment:tp,specularmap_pars_fragment:ep,tonemapping_fragment:np,tonemapping_pars_fragment:ip,transmission_fragment:sp,transmission_pars_fragment:rp,uv_pars_fragment:op,uv_pars_vertex:ap,uv_vertex:cp,worldpos_vertex:lp,background_vert:hp,background_frag:up,backgroundCube_vert:dp,backgroundCube_frag:fp,cube_vert:pp,cube_frag:mp,depth_vert:gp,depth_frag:_p,distanceRGBA_vert:vp,distanceRGBA_frag:xp,equirect_vert:Mp,equirect_frag:yp,linedashed_vert:Sp,linedashed_frag:bp,meshbasic_vert:Ep,meshbasic_frag:wp,meshlambert_vert:Tp,meshlambert_frag:Ap,meshmatcap_vert:Cp,meshmatcap_frag:Rp,meshnormal_vert:Pp,meshnormal_frag:Lp,meshphong_vert:Ip,meshphong_frag:Dp,meshphysical_vert:Up,meshphysical_frag:Np,meshtoon_vert:Fp,meshtoon_frag:Op,points_vert:zp,points_frag:Bp,shadow_vert:kp,shadow_frag:Vp,sprite_vert:Hp,sprite_frag:Gp},St={common:{diffuse:{value:new Qt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new jt}},envmap:{envMap:{value:null},envMapRotation:{value:new jt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new jt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new jt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new jt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new jt},normalScale:{value:new vt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new jt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new jt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new jt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new jt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Qt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Qt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0},uvTransform:{value:new jt}},sprite:{diffuse:{value:new Qt(16777215)},opacity:{value:1},center:{value:new vt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new jt},alphaMap:{value:null},alphaMapTransform:{value:new jt},alphaTest:{value:0}}},$e={basic:{uniforms:Le([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:Le([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Qt(0)}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:Le([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Qt(0)},specular:{value:new Qt(1118481)},shininess:{value:30}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:Le([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Qt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:Le([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Qt(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:Le([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:Le([St.points,St.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:Le([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:Le([St.common,St.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:Le([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:Le([St.sprite,St.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new jt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new jt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distanceRGBA:{uniforms:Le([St.common,St.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distanceRGBA_vert,fragmentShader:Jt.distanceRGBA_frag},shadow:{uniforms:Le([St.lights,St.fog,{color:{value:new Qt(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};$e.physical={uniforms:Le([$e.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new jt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new jt},clearcoatNormalScale:{value:new vt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new jt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new jt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new jt},sheen:{value:0},sheenColor:{value:new Qt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new jt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new jt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new jt},transmissionSamplerSize:{value:new vt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new jt},attenuationDistance:{value:0},attenuationColor:{value:new Qt(0)},specularColor:{value:new Qt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new jt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new jt},anisotropyVector:{value:new vt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new jt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const Ts={r:0,b:0,g:0},Fn=new vn,Wp=new ge;function Xp(i,t,e,n,s,r,o){const a=new Qt(0);let c=r===!0?0:1,l,h,u=null,d=0,f=null;function g(M){let _=M.isScene===!0?M.background:null;return _&&_.isTexture&&(_=(M.backgroundBlurriness>0?e:t).get(_)),_}function v(M){let _=!1;const R=g(M);R===null?p(a,c):R&&R.isColor&&(p(R,1),_=!0);const w=i.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,_){const R=g(_);R&&(R.isCubeTexture||R.mapping===Bs)?(h===void 0&&(h=new P(new ot(1,1,1),new Cn({name:"BackgroundCubeMaterial",uniforms:yi($e.backgroundCube.uniforms),vertexShader:$e.backgroundCube.vertexShader,fragmentShader:$e.backgroundCube.fragmentShader,side:Ue,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,T,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Fn.copy(_.backgroundRotation),Fn.x*=-1,Fn.y*=-1,Fn.z*=-1,R.isCubeTexture&&R.isRenderTargetTexture===!1&&(Fn.y*=-1,Fn.z*=-1),h.material.uniforms.envMap.value=R,h.material.uniforms.flipEnvMap.value=R.isCubeTexture&&R.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Wp.makeRotationFromEuler(Fn)),h.material.toneMapped=oe.getTransfer(R.colorSpace)!==le,(u!==R||d!==R.version||f!==i.toneMapping)&&(h.material.needsUpdate=!0,u=R,d=R.version,f=i.toneMapping),h.layers.enableAll(),M.unshift(h,h.geometry,h.material,0,0,null)):R&&R.isTexture&&(l===void 0&&(l=new P(new Ge(2,2),new Cn({name:"BackgroundMaterial",uniforms:yi($e.background.uniforms),vertexShader:$e.background.vertexShader,fragmentShader:$e.background.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=R,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=oe.getTransfer(R.colorSpace)!==le,R.matrixAutoUpdate===!0&&R.updateMatrix(),l.material.uniforms.uvTransform.value.copy(R.matrix),(u!==R||d!==R.version||f!==i.toneMapping)&&(l.material.needsUpdate=!0,u=R,d=R.version,f=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,_){M.getRGB(Ts,sl(i)),n.buffers.color.setClear(Ts.r,Ts.g,Ts.b,_,o)}function S(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(M,_=1){a.set(M),c=_,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(M){c=M,p(a,c)},render:v,addToRenderList:m,dispose:S}}function qp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(b,L,B,W,J){let j=!1;const Z=u(W,B,L);r!==Z&&(r=Z,l(r.object)),j=f(b,W,B,J),j&&g(b,W,B,J),J!==null&&t.update(J,i.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,_(b,L,B,W),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(J).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function u(b,L,B){const W=B.wireframe===!0;let J=n[b.id];J===void 0&&(J={},n[b.id]=J);let j=J[L.id];j===void 0&&(j={},J[L.id]=j);let Z=j[W];return Z===void 0&&(Z=d(c()),j[W]=Z),Z}function d(b){const L=[],B=[],W=[];for(let J=0;J<e;J++)L[J]=0,B[J]=0,W[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:B,attributeDivisors:W,object:b,attributes:{},index:null}}function f(b,L,B,W){const J=r.attributes,j=L.attributes;let Z=0;const it=B.getAttributes();for(const F in it)if(it[F].location>=0){const yt=J[F];let Rt=j[F];if(Rt===void 0&&(F==="instanceMatrix"&&b.instanceMatrix&&(Rt=b.instanceMatrix),F==="instanceColor"&&b.instanceColor&&(Rt=b.instanceColor)),yt===void 0||yt.attribute!==Rt||Rt&&yt.data!==Rt.data)return!0;Z++}return r.attributesNum!==Z||r.index!==W}function g(b,L,B,W){const J={},j=L.attributes;let Z=0;const it=B.getAttributes();for(const F in it)if(it[F].location>=0){let yt=j[F];yt===void 0&&(F==="instanceMatrix"&&b.instanceMatrix&&(yt=b.instanceMatrix),F==="instanceColor"&&b.instanceColor&&(yt=b.instanceColor));const Rt={};Rt.attribute=yt,yt&&yt.data&&(Rt.data=yt.data),J[F]=Rt,Z++}r.attributes=J,r.attributesNum=Z,r.index=W}function v(){const b=r.newAttributes;for(let L=0,B=b.length;L<B;L++)b[L]=0}function m(b){p(b,0)}function p(b,L){const B=r.newAttributes,W=r.enabledAttributes,J=r.attributeDivisors;B[b]=1,W[b]===0&&(i.enableVertexAttribArray(b),W[b]=1),J[b]!==L&&(i.vertexAttribDivisor(b,L),J[b]=L)}function S(){const b=r.newAttributes,L=r.enabledAttributes;for(let B=0,W=L.length;B<W;B++)L[B]!==b[B]&&(i.disableVertexAttribArray(B),L[B]=0)}function M(b,L,B,W,J,j,Z){Z===!0?i.vertexAttribIPointer(b,L,B,J,j):i.vertexAttribPointer(b,L,B,W,J,j)}function _(b,L,B,W){v();const J=W.attributes,j=B.getAttributes(),Z=L.defaultAttributeValues;for(const it in j){const F=j[it];if(F.location>=0){let pt=J[it];if(pt===void 0&&(it==="instanceMatrix"&&b.instanceMatrix&&(pt=b.instanceMatrix),it==="instanceColor"&&b.instanceColor&&(pt=b.instanceColor)),pt!==void 0){const yt=pt.normalized,Rt=pt.itemSize,Mt=t.get(pt);if(Mt===void 0)continue;const Zt=Mt.buffer,ie=Mt.type,te=Mt.bytesPerElement,et=ie===i.INT||ie===i.UNSIGNED_INT||pt.gpuType===Fo;if(pt.isInterleavedBufferAttribute){const $=pt.data,Ct=$.stride,Dt=pt.offset;if($.isInstancedInterleavedBuffer){for(let Pt=0;Pt<F.locationSize;Pt++)p(F.location+Pt,$.meshPerAttribute);b.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Pt=0;Pt<F.locationSize;Pt++)m(F.location+Pt);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let Pt=0;Pt<F.locationSize;Pt++)M(F.location+Pt,Rt/F.locationSize,ie,yt,Ct*te,(Dt+Rt/F.locationSize*Pt)*te,et)}else{if(pt.isInstancedBufferAttribute){for(let $=0;$<F.locationSize;$++)p(F.location+$,pt.meshPerAttribute);b.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let $=0;$<F.locationSize;$++)m(F.location+$);i.bindBuffer(i.ARRAY_BUFFER,Zt);for(let $=0;$<F.locationSize;$++)M(F.location+$,Rt/F.locationSize,ie,yt,Rt*te,Rt/F.locationSize*$*te,et)}}else if(Z!==void 0){const yt=Z[it];if(yt!==void 0)switch(yt.length){case 2:i.vertexAttrib2fv(F.location,yt);break;case 3:i.vertexAttrib3fv(F.location,yt);break;case 4:i.vertexAttrib4fv(F.location,yt);break;default:i.vertexAttrib1fv(F.location,yt)}}}}S()}function R(){C();for(const b in n){const L=n[b];for(const B in L){const W=L[B];for(const J in W)h(W[J].object),delete W[J];delete L[B]}delete n[b]}}function w(b){if(n[b.id]===void 0)return;const L=n[b.id];for(const B in L){const W=L[B];for(const J in W)h(W[J].object),delete W[J];delete L[B]}delete n[b.id]}function T(b){for(const L in n){const B=n[L];if(B[b.id]===void 0)continue;const W=B[b.id];for(const J in W)h(W[J].object),delete W[J];delete B[b.id]}}function C(){x(),o=!0,r!==s&&(r=s,l(r.object))}function x(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:x,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:v,enableAttribute:m,disableUnusedAttributes:S}}function Yp(i,t,e){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(i.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,u);let f=0;for(let g=0;g<u;g++)f+=h[g];e.update(f,n,1)}function c(l,h,u,d){if(u===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{f.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let v=0;v<u;v++)g+=h[v]*d[v];e.update(g,n,1)}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function jp(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){const T=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==Ke&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const C=T===$i&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==nn&&n.convert(T)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==pn&&!C)}function c(T){if(T==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),R=g>0,w=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:v,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:M,maxFragmentUniforms:_,vertexTextures:R,maxSamples:w}}function Jp(i){const t=this;let e=null,n=0,s=!1,r=!1;const o=new Bn,a=new jt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){const g=u.clippingPlanes,v=u.clipIntersection,m=u.clipShadows,p=i.get(u);if(!s||g===null||g.length===0||r&&!m)r?h(null):l();else{const S=r?0:n,M=S*4;let _=p.clippingState||null;c.value=_,_=h(g,d,M,f);for(let R=0;R!==M;++R)_[R]=e[R];p.clippingState=_,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,g){const v=u!==null?u.length:0;let m=null;if(v!==0){if(m=c.value,g!==!0||m===null){const p=f+v*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,_=f;M!==v;++M,_+=4)o.copy(u[M]).applyMatrix4(S,a),o.normal.toArray(m,_),m[_+3]=o.constant}c.value=m,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,m}}function Kp(i){let t=new WeakMap;function e(o,a){return a===Wr?o.mapping=vi:a===Xr&&(o.mapping=xi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Wr||a===Xr)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new uu(c.height);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",s),e(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}const pi=4,Xa=[.125,.215,.35,.446,.526,.582],Hn=20,br=new Qo,qa=new Qt;let Er=null,wr=0,Tr=0,Ar=!1;const kn=(1+Math.sqrt(5))/2,di=1/kn,Ya=[new D(-kn,di,0),new D(kn,di,0),new D(-di,0,kn),new D(di,0,kn),new D(0,kn,-di),new D(0,kn,di),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],Zp=new D;class ja{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100,r={}){const{size:o=256,position:a=Zp}=r;Er=this._renderer.getRenderTarget(),wr=this._renderer.getActiveCubeFace(),Tr=this._renderer.getActiveMipmapLevel(),Ar=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(t,n,s,c,a),e>0&&this._blur(c,0,0,e),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Za(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ka(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Er,wr,Tr),this._renderer.xr.enabled=Ar,t.scissorTest=!1,As(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===vi||t.mapping===xi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Er=this._renderer.getRenderTarget(),wr=this._renderer.getActiveCubeFace(),Tr=this._renderer.getActiveMipmapLevel(),Ar=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Qe,minFilter:Qe,generateMipmaps:!1,type:$i,format:Ke,colorSpace:Mi,depthBuffer:!1},s=Ja(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ja(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$p(r)),this._blurMaterial=Qp(r,t,e)}return s}_compileMaterial(t){const e=new P(this._lodPlanes[0],t);this._renderer.compile(e,br)}_sceneToCubeUV(t,e,n,s,r){const c=new Ye(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(qa),u.toneMapping=An,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new Vs({name:"PMREM.Background",side:Ue,depthWrite:!1,depthTest:!1}),m=new P(new ot,v);let p=!1;const S=t.background;S?S.isColor&&(v.color.copy(S),t.background=null,p=!0):(v.color.copy(qa),p=!0);for(let M=0;M<6;M++){const _=M%3;_===0?(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[M],r.y,r.z)):_===1?(c.up.set(0,0,l[M]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[M],r.z)):(c.up.set(0,l[M],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[M]));const R=this._cubeSize;As(s,_*R,M>2?R:0,R,R),u.setRenderTarget(s),p&&u.render(m,c),u.render(t,c)}m.geometry.dispose(),m.material.dispose(),u.toneMapping=f,u.autoClear=d,t.background=S}_textureToCubeUV(t,e){const n=this._renderer,s=t.mapping===vi||t.mapping===xi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Za()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ka());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new P(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;As(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,br)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ya[(s-r-1)%Ya.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,s,"latitudinal",r),this._halfBlur(o,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new P(this._lodPlanes[s],l),d=l.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Hn-1),v=r/g,m=isFinite(r)?1+Math.floor(h*v):Hn;m>Hn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Hn}`);const p=[];let S=0;for(let T=0;T<Hn;++T){const C=T/v,x=Math.exp(-C*C/2);p.push(x),T===0?S+=x:T<m&&(S+=2*x)}for(let T=0;T<p.length;T++)p[T]=p[T]/S;d.envMap.value=t.texture,d.samples.value=m,d.weights.value=p,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:M}=this;d.dTheta.value=g,d.mipInt.value=M-n;const _=this._sizeLods[s],R=3*_*(s>M-pi?s-M+pi:0),w=4*(this._cubeSize-_);As(e,R,w,3*_,2*_),c.setRenderTarget(e),c.render(u,br)}}function $p(i){const t=[],e=[],n=[];let s=i;const r=i-pi+1+Xa.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);e.push(a);let c=1/a;o>i-pi?c=Xa[o-i+pi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],f=6,g=6,v=3,m=2,p=1,S=new Float32Array(v*g*f),M=new Float32Array(m*g*f),_=new Float32Array(p*g*f);for(let w=0;w<f;w++){const T=w%3*2/3-1,C=w>2?0:-1,x=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];S.set(x,v*g*w),M.set(d,m*g*w);const b=[w,w,w,w,w,w];_.set(b,p*g*w)}const R=new we;R.setAttribute("position",new en(S,v)),R.setAttribute("uv",new en(M,m)),R.setAttribute("faceIndex",new en(_,p)),t.push(R),s>pi&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ja(i,t,e){const n=new Jn(i,t,e);return n.texture.mapping=Bs,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function As(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Qp(i,t,e){const n=new Float32Array(Hn),s=new D(0,1,0);return new Cn({name:"SphericalGaussianBlur",defines:{n:Hn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:ta(),fragmentShader:`

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
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Ka(){return new Cn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ta(),fragmentShader:`

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
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Za(){return new Cn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ta(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function ta(){return`

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
	`}function tm(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Wr||c===Xr,h=c===vi||c===xi;if(l||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new ja(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const f=a.image;return l&&f&&f.height>0||h&&f&&s(f)?(e===null&&(e=new ja(i)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function em(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const s=e(n);return s===null&&Yi("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function nm(i,t,e,n){const s={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete s[d.id];const f=r.get(d);f&&(t.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const f in d)t.update(d[f],i.ARRAY_BUFFER)}function l(u){const d=[],f=u.index,g=u.attributes.position;let v=0;if(f!==null){const S=f.array;v=f.version;for(let M=0,_=S.length;M<_;M+=3){const R=S[M+0],w=S[M+1],T=S[M+2];d.push(R,w,w,T,T,R)}}else if(g!==void 0){const S=g.array;v=g.version;for(let M=0,_=S.length/3-1;M<_;M+=3){const R=M+0,w=M+1,T=M+2;d.push(R,w,w,T,T,R)}}else return;const m=new(Zc(d)?il:nl)(d,1);m.version=v;const p=r.get(u);p&&t.remove(p),r.set(u,m)}function h(u){const d=r.get(u);if(d){const f=u.index;f!==null&&d.version<f.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function im(i,t,e){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,f){i.drawElements(n,f,r,d*o),e.update(f,n,1)}function l(d,f,g){g!==0&&(i.drawElementsInstanced(n,f,r,d*o,g),e.update(f,n,g))}function h(d,f,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,d,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];e.update(m,n,1)}function u(d,f,g,v){if(g===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<d.length;p++)l(d[p]/o,f[p],v[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,d,0,v,0,g);let p=0;for(let S=0;S<g;S++)p+=f[S]*v[S];e.update(p,n,1)}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function sm(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function rm(i,t,e){const n=new WeakMap,s=new ve;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let b=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",b)};var f=b;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,v=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],S=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let _=0;g===!0&&(_=1),v===!0&&(_=2),m===!0&&(_=3);let R=a.attributes.position.count*_,w=1;R>t.maxTextureSize&&(w=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const T=new Float32Array(R*w*4*u),C=new $c(T,R,w,u);C.type=pn,C.needsUpdate=!0;const x=_*4;for(let L=0;L<u;L++){const B=p[L],W=S[L],J=M[L],j=R*w*4*L;for(let Z=0;Z<B.count;Z++){const it=Z*x;g===!0&&(s.fromBufferAttribute(B,Z),T[j+it+0]=s.x,T[j+it+1]=s.y,T[j+it+2]=s.z,T[j+it+3]=0),v===!0&&(s.fromBufferAttribute(W,Z),T[j+it+4]=s.x,T[j+it+5]=s.y,T[j+it+6]=s.z,T[j+it+7]=0),m===!0&&(s.fromBufferAttribute(J,Z),T[j+it+8]=s.x,T[j+it+9]=s.y,T[j+it+10]=s.z,T[j+it+11]=J.itemSize===4?s.w:1)}}d={count:u,texture:C,size:new vt(R,w)},n.set(a,d),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let g=0;for(let m=0;m<l.length;m++)g+=l[m];const v=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",v),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function om(i,t,e,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(s.get(u)!==l&&(t.update(u),s.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;s.get(d)!==l&&(d.update(),s.set(d,l))}return u}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}const Ml=new Ce,$a=new cl(1,1),yl=new $c,Sl=new jh,bl=new ol,Qa=[],tc=[],ec=new Float32Array(16),nc=new Float32Array(9),ic=new Float32Array(4);function Ti(i,t,e){const n=i[0];if(n<=0||n>0)return i;const s=t*e;let r=Qa[s];if(r===void 0&&(r=new Float32Array(s),Qa[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Se(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Xs(i,t){let e=tc[t];e===void 0&&(e=new Int32Array(t),tc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function am(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function cm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2fv(this.addr,t),be(e,t)}}function lm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Se(e,t))return;i.uniform3fv(this.addr,t),be(e,t)}}function hm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4fv(this.addr,t),be(e,t)}}function um(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(Se(e,n))return;ic.set(n),i.uniformMatrix2fv(this.addr,!1,ic),be(e,n)}}function dm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(Se(e,n))return;nc.set(n),i.uniformMatrix3fv(this.addr,!1,nc),be(e,n)}}function fm(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Se(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(Se(e,n))return;ec.set(n),i.uniformMatrix4fv(this.addr,!1,ec),be(e,n)}}function pm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2iv(this.addr,t),be(e,t)}}function gm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3iv(this.addr,t),be(e,t)}}function _m(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4iv(this.addr,t),be(e,t)}}function vm(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function xm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Se(e,t))return;i.uniform2uiv(this.addr,t),be(e,t)}}function Mm(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Se(e,t))return;i.uniform3uiv(this.addr,t),be(e,t)}}function ym(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Se(e,t))return;i.uniform4uiv(this.addr,t),be(e,t)}}function Sm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?($a.compareFunction=Kc,r=$a):r=Ml,e.setTexture2D(t||r,s)}function bm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||Sl,s)}function Em(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||bl,s)}function wm(i,t,e){const n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||yl,s)}function Tm(i){switch(i){case 5126:return am;case 35664:return cm;case 35665:return lm;case 35666:return hm;case 35674:return um;case 35675:return dm;case 35676:return fm;case 5124:case 35670:return pm;case 35667:case 35671:return mm;case 35668:case 35672:return gm;case 35669:case 35673:return _m;case 5125:return vm;case 36294:return xm;case 36295:return Mm;case 36296:return ym;case 35678:case 36198:case 36298:case 36306:case 35682:return Sm;case 35679:case 36299:case 36307:return bm;case 35680:case 36300:case 36308:case 36293:return Em;case 36289:case 36303:case 36311:case 36292:return wm}}function Am(i,t){i.uniform1fv(this.addr,t)}function Cm(i,t){const e=Ti(t,this.size,2);i.uniform2fv(this.addr,e)}function Rm(i,t){const e=Ti(t,this.size,3);i.uniform3fv(this.addr,e)}function Pm(i,t){const e=Ti(t,this.size,4);i.uniform4fv(this.addr,e)}function Lm(i,t){const e=Ti(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Im(i,t){const e=Ti(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Dm(i,t){const e=Ti(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Um(i,t){i.uniform1iv(this.addr,t)}function Nm(i,t){i.uniform2iv(this.addr,t)}function Fm(i,t){i.uniform3iv(this.addr,t)}function Om(i,t){i.uniform4iv(this.addr,t)}function zm(i,t){i.uniform1uiv(this.addr,t)}function Bm(i,t){i.uniform2uiv(this.addr,t)}function km(i,t){i.uniform3uiv(this.addr,t)}function Vm(i,t){i.uniform4uiv(this.addr,t)}function Hm(i,t,e){const n=this.cache,s=t.length,r=Xs(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture2D(t[o]||Ml,r[o])}function Gm(i,t,e){const n=this.cache,s=t.length,r=Xs(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||Sl,r[o])}function Wm(i,t,e){const n=this.cache,s=t.length,r=Xs(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||bl,r[o])}function Xm(i,t,e){const n=this.cache,s=t.length,r=Xs(e,s);Se(n,r)||(i.uniform1iv(this.addr,r),be(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||yl,r[o])}function qm(i){switch(i){case 5126:return Am;case 35664:return Cm;case 35665:return Rm;case 35666:return Pm;case 35674:return Lm;case 35675:return Im;case 35676:return Dm;case 5124:case 35670:return Um;case 35667:case 35671:return Nm;case 35668:case 35672:return Fm;case 35669:case 35673:return Om;case 5125:return zm;case 36294:return Bm;case 36295:return km;case 36296:return Vm;case 35678:case 36198:case 36298:case 36306:case 35682:return Hm;case 35679:case 36299:case 36307:return Gm;case 35680:case 36300:case 36308:case 36293:return Wm;case 36289:case 36303:case 36311:case 36292:return Xm}}class Ym{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tm(e.type)}}class jm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=qm(e.type)}}class Jm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(t,e[a.id],n)}}}const Cr=/(\w+)(\])?(\[|\.)?/g;function sc(i,t){i.seq.push(t),i.map[t.id]=t}function Km(i,t,e){const n=i.name,s=n.length;for(Cr.lastIndex=0;;){const r=Cr.exec(n),o=Cr.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){sc(e,l===void 0?new Ym(a,i,t):new jm(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Jm(a),sc(e,u)),e=u}}}class Ds{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=t.getActiveUniform(e,s),o=t.getUniformLocation(e,r.name);Km(r,o,this)}}setValue(t,e,n,s){const r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){const s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,s)}}static seqWithValue(t,e){const n=[];for(let s=0,r=t.length;s!==r;++s){const o=t[s];o.id in e&&n.push(o)}return n}}function rc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Zm=37297;let $m=0;function Qm(i,t){const e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const oc=new jt;function t0(i){oe._getMatrix(oc,oe.workingColorSpace,i);const t=`mat3( ${oc.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(i)){case Us:return[t,"LinearTransferOETF"];case le:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ac(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+Qm(i.getShaderSource(t),a)}else return r}function e0(i,t){const e=t0(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function n0(i,t){let e;switch(t){case ah:e="Linear";break;case ch:e="Reinhard";break;case lh:e="Cineon";break;case hh:e="ACESFilmic";break;case dh:e="AgX";break;case fh:e="Neutral";break;case uh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Cs=new D;function i0(){oe.getLuminanceCoefficients(Cs);const i=Cs.x.toFixed(4),t=Cs.y.toFixed(4),e=Cs.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ni).join(`
`)}function r0(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function o0(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(t,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Ni(i){return i!==""}function cc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function lc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const a0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ao(i){return i.replace(a0,l0)}const c0=new Map;function l0(i,t){let e=Jt[t];if(e===void 0){const n=c0.get(t);if(n!==void 0)e=Jt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Ao(e)}const h0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hc(i){return i.replace(h0,u0)}function u0(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function uc(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}function d0(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===zc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Bc?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===dn&&(t="SHADOWMAP_TYPE_VSM"),t}function f0(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case vi:case xi:t="ENVMAP_TYPE_CUBE";break;case Bs:t="ENVMAP_TYPE_CUBE_UV";break}return t}function p0(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case xi:t="ENVMAP_MODE_REFRACTION";break}return t}function m0(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case kc:t="ENVMAP_BLENDING_MULTIPLY";break;case rh:t="ENVMAP_BLENDING_MIX";break;case oh:t="ENVMAP_BLENDING_ADD";break}return t}function g0(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function _0(i,t,e,n){const s=i.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=d0(e),l=f0(e),h=p0(e),u=m0(e),d=g0(e),f=s0(e),g=r0(r),v=s.createProgram();let m,p,S=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ni).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Ni).join(`
`),p.length>0&&(p+=`
`)):(m=[uc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ni).join(`
`),p=[uc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==An?"#define TONE_MAPPING":"",e.toneMapping!==An?Jt.tonemapping_pars_fragment:"",e.toneMapping!==An?n0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,e0("linearToOutputTexel",e.outputColorSpace),i0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Ni).join(`
`)),o=Ao(o),o=cc(o,e),o=lc(o,e),a=Ao(a),a=cc(a,e),a=lc(a,e),o=hc(o),a=hc(a),e.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",e.glslVersion===pa?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===pa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const M=S+m+o,_=S+p+a,R=rc(s,s.VERTEX_SHADER,M),w=rc(s,s.FRAGMENT_SHADER,_);s.attachShader(v,R),s.attachShader(v,w),e.index0AttributeName!==void 0?s.bindAttribLocation(v,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function T(L){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(v)||"",W=s.getShaderInfoLog(R)||"",J=s.getShaderInfoLog(w)||"",j=B.trim(),Z=W.trim(),it=J.trim();let F=!0,pt=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if(F=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,v,R,w);else{const yt=ac(s,R,"vertex"),Rt=ac(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+j+`
`+yt+`
`+Rt)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(Z===""||it==="")&&(pt=!1);pt&&(L.diagnostics={runnable:F,programLog:j,vertexShader:{log:Z,prefix:m},fragmentShader:{log:it,prefix:p}})}s.deleteShader(R),s.deleteShader(w),C=new Ds(s,v),x=o0(s,v)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let x;this.getAttributes=function(){return x===void 0&&T(this),x};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(v,Zm)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=$m++,this.cacheKey=t,this.usedTimes=1,this.program=v,this.vertexShader=R,this.fragmentShader=w,this}let v0=0;class x0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new M0(t),e.set(t,n)),n}}class M0{constructor(t){this.id=v0++,this.code=t,this.usedTimes=0}}function y0(i,t,e,n,s,r,o){const a=new tl,c=new x0,l=new Set,h=[],u=s.logarithmicDepthBuffer,d=s.vertexTextures;let f=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return l.add(x),x===0?"uv":`uv${x}`}function m(x,b,L,B,W){const J=B.fog,j=W.geometry,Z=x.isMeshStandardMaterial?B.environment:null,it=(x.isMeshStandardMaterial?e:t).get(x.envMap||Z),F=it&&it.mapping===Bs?it.image.height:null,pt=g[x.type];x.precision!==null&&(f=s.getMaxPrecision(x.precision),f!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",f,"instead."));const yt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,Rt=yt!==void 0?yt.length:0;let Mt=0;j.morphAttributes.position!==void 0&&(Mt=1),j.morphAttributes.normal!==void 0&&(Mt=2),j.morphAttributes.color!==void 0&&(Mt=3);let Zt,ie,te,et;if(pt){const ae=$e[pt];Zt=ae.vertexShader,ie=ae.fragmentShader}else Zt=x.vertexShader,ie=x.fragmentShader,c.update(x),te=c.getVertexShaderID(x),et=c.getFragmentShaderID(x);const $=i.getRenderTarget(),Ct=i.state.buffers.depth.getReversed(),Dt=W.isInstancedMesh===!0,Pt=W.isBatchedMesh===!0,Wt=!!x.map,ee=!!x.matcap,I=!!it,lt=!!x.aoMap,rt=!!x.lightMap,tt=!!x.bumpMap,nt=!!x.normalMap,_t=!!x.displacementMap,ht=!!x.emissiveMap,gt=!!x.metalnessMap,Ht=!!x.roughnessMap,zt=x.anisotropy>0,A=x.clearcoat>0,y=x.dispersion>0,G=x.iridescence>0,q=x.sheen>0,ct=x.transmission>0,K=zt&&!!x.anisotropyMap,k=A&&!!x.clearcoatMap,O=A&&!!x.clearcoatNormalMap,Q=A&&!!x.clearcoatRoughnessMap,mt=G&&!!x.iridescenceMap,st=G&&!!x.iridescenceThicknessMap,Tt=q&&!!x.sheenColorMap,Vt=q&&!!x.sheenRoughnessMap,Ft=!!x.specularMap,bt=!!x.specularColorMap,qt=!!x.specularIntensityMap,z=ct&&!!x.transmissionMap,ft=ct&&!!x.thicknessMap,xt=!!x.gradientMap,It=!!x.alphaMap,ut=x.alphaTest>0,at=!!x.alphaHash,Nt=!!x.extensions;let Xt=An;x.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Xt=i.toneMapping);const ue={shaderID:pt,shaderType:x.type,shaderName:x.name,vertexShader:Zt,fragmentShader:ie,defines:x.defines,customVertexShaderID:te,customFragmentShaderID:et,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:f,batching:Pt,batchingColor:Pt&&W._colorsTexture!==null,instancing:Dt,instancingColor:Dt&&W.instanceColor!==null,instancingMorph:Dt&&W.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Mi,alphaToCoverage:!!x.alphaToCoverage,map:Wt,matcap:ee,envMap:I,envMapMode:I&&it.mapping,envMapCubeUVHeight:F,aoMap:lt,lightMap:rt,bumpMap:tt,normalMap:nt,displacementMap:d&&_t,emissiveMap:ht,normalMapObjectSpace:nt&&x.normalMapType===_h,normalMapTangentSpace:nt&&x.normalMapType===Jc,metalnessMap:gt,roughnessMap:Ht,anisotropy:zt,anisotropyMap:K,clearcoat:A,clearcoatMap:k,clearcoatNormalMap:O,clearcoatRoughnessMap:Q,dispersion:y,iridescence:G,iridescenceMap:mt,iridescenceThicknessMap:st,sheen:q,sheenColorMap:Tt,sheenRoughnessMap:Vt,specularMap:Ft,specularColorMap:bt,specularIntensityMap:qt,transmission:ct,transmissionMap:z,thicknessMap:ft,gradientMap:xt,opaque:x.transparent===!1&&x.blending===mi&&x.alphaToCoverage===!1,alphaMap:It,alphaTest:ut,alphaHash:at,combine:x.combine,mapUv:Wt&&v(x.map.channel),aoMapUv:lt&&v(x.aoMap.channel),lightMapUv:rt&&v(x.lightMap.channel),bumpMapUv:tt&&v(x.bumpMap.channel),normalMapUv:nt&&v(x.normalMap.channel),displacementMapUv:_t&&v(x.displacementMap.channel),emissiveMapUv:ht&&v(x.emissiveMap.channel),metalnessMapUv:gt&&v(x.metalnessMap.channel),roughnessMapUv:Ht&&v(x.roughnessMap.channel),anisotropyMapUv:K&&v(x.anisotropyMap.channel),clearcoatMapUv:k&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:O&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:mt&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:st&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:Vt&&v(x.sheenRoughnessMap.channel),specularMapUv:Ft&&v(x.specularMap.channel),specularColorMapUv:bt&&v(x.specularColorMap.channel),specularIntensityMapUv:qt&&v(x.specularIntensityMap.channel),transmissionMapUv:z&&v(x.transmissionMap.channel),thicknessMapUv:ft&&v(x.thicknessMap.channel),alphaMapUv:It&&v(x.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(nt||zt),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:W.isPoints===!0&&!!j.attributes.uv&&(Wt||It),fog:!!J,useFog:x.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:x.flatShading===!0&&x.wireframe===!1,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Ct,skinning:W.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:Mt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Xt,decodeVideoTexture:Wt&&x.map.isVideoTexture===!0&&oe.getTransfer(x.map.colorSpace)===le,decodeVideoTextureEmissive:ht&&x.emissiveMap.isVideoTexture===!0&&oe.getTransfer(x.emissiveMap.colorSpace)===le,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===je,flipSided:x.side===Ue,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Nt&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Nt&&x.extensions.multiDraw===!0||Pt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return ue.vertexUv1s=l.has(1),ue.vertexUv2s=l.has(2),ue.vertexUv3s=l.has(3),l.clear(),ue}function p(x){const b=[];if(x.shaderID?b.push(x.shaderID):(b.push(x.customVertexShaderID),b.push(x.customFragmentShaderID)),x.defines!==void 0)for(const L in x.defines)b.push(L),b.push(x.defines[L]);return x.isRawShaderMaterial===!1&&(S(b,x),M(b,x),b.push(i.outputColorSpace)),b.push(x.customProgramCacheKey),b.join()}function S(x,b){x.push(b.precision),x.push(b.outputColorSpace),x.push(b.envMapMode),x.push(b.envMapCubeUVHeight),x.push(b.mapUv),x.push(b.alphaMapUv),x.push(b.lightMapUv),x.push(b.aoMapUv),x.push(b.bumpMapUv),x.push(b.normalMapUv),x.push(b.displacementMapUv),x.push(b.emissiveMapUv),x.push(b.metalnessMapUv),x.push(b.roughnessMapUv),x.push(b.anisotropyMapUv),x.push(b.clearcoatMapUv),x.push(b.clearcoatNormalMapUv),x.push(b.clearcoatRoughnessMapUv),x.push(b.iridescenceMapUv),x.push(b.iridescenceThicknessMapUv),x.push(b.sheenColorMapUv),x.push(b.sheenRoughnessMapUv),x.push(b.specularMapUv),x.push(b.specularColorMapUv),x.push(b.specularIntensityMapUv),x.push(b.transmissionMapUv),x.push(b.thicknessMapUv),x.push(b.combine),x.push(b.fogExp2),x.push(b.sizeAttenuation),x.push(b.morphTargetsCount),x.push(b.morphAttributeCount),x.push(b.numDirLights),x.push(b.numPointLights),x.push(b.numSpotLights),x.push(b.numSpotLightMaps),x.push(b.numHemiLights),x.push(b.numRectAreaLights),x.push(b.numDirLightShadows),x.push(b.numPointLightShadows),x.push(b.numSpotLightShadows),x.push(b.numSpotLightShadowsWithMaps),x.push(b.numLightProbes),x.push(b.shadowMapType),x.push(b.toneMapping),x.push(b.numClippingPlanes),x.push(b.numClipIntersection),x.push(b.depthPacking)}function M(x,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),b.gradientMap&&a.enable(22),x.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.reversedDepthBuffer&&a.enable(4),b.skinning&&a.enable(5),b.morphTargets&&a.enable(6),b.morphNormals&&a.enable(7),b.morphColors&&a.enable(8),b.premultipliedAlpha&&a.enable(9),b.shadowMapEnabled&&a.enable(10),b.doubleSided&&a.enable(11),b.flipSided&&a.enable(12),b.useDepthPacking&&a.enable(13),b.dithering&&a.enable(14),b.transmission&&a.enable(15),b.sheen&&a.enable(16),b.opaque&&a.enable(17),b.pointsUvs&&a.enable(18),b.decodeVideoTexture&&a.enable(19),b.decodeVideoTextureEmissive&&a.enable(20),b.alphaToCoverage&&a.enable(21),x.push(a.mask)}function _(x){const b=g[x.type];let L;if(b){const B=$e[b];L=au.clone(B.uniforms)}else L=x.uniforms;return L}function R(x,b){let L;for(let B=0,W=h.length;B<W;B++){const J=h[B];if(J.cacheKey===b){L=J,++L.usedTimes;break}}return L===void 0&&(L=new _0(i,b,x,r),h.push(L)),L}function w(x){if(--x.usedTimes===0){const b=h.indexOf(x);h[b]=h[h.length-1],h.pop(),x.destroy()}}function T(x){c.remove(x)}function C(){c.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:_,acquireProgram:R,releaseProgram:w,releaseShaderCache:T,programs:h,dispose:C}}function S0(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function b0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function dc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function fc(){const i=[];let t=0;const e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u,d,f,g,v,m){let p=i[t];return p===void 0?(p={id:u.id,object:u,geometry:d,material:f,groupOrder:g,renderOrder:u.renderOrder,z:v,group:m},i[t]=p):(p.id=u.id,p.object=u,p.geometry=d,p.material=f,p.groupOrder=g,p.renderOrder=u.renderOrder,p.z=v,p.group=m),t++,p}function a(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.push(p):f.transparent===!0?s.push(p):e.push(p)}function c(u,d,f,g,v,m){const p=o(u,d,f,g,v,m);f.transmission>0?n.unshift(p):f.transparent===!0?s.unshift(p):e.unshift(p)}function l(u,d){e.length>1&&e.sort(u||b0),n.length>1&&n.sort(d||dc),s.length>1&&s.sort(d||dc)}function h(){for(let u=t,d=i.length;u<d;u++){const f=i[u];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function E0(){let i=new WeakMap;function t(n,s){const r=i.get(n);let o;return r===void 0?(o=new fc,i.set(n,[o])):s>=r.length?(o=new fc,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function w0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new D,color:new Qt};break;case"SpotLight":e={position:new D,direction:new D,color:new Qt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new D,color:new Qt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new D,skyColor:new Qt,groundColor:new Qt};break;case"RectAreaLight":e={color:new Qt,position:new D,halfWidth:new D,halfHeight:new D};break}return i[t.id]=e,e}}}function T0(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new vt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let A0=0;function C0(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function R0(i){const t=new w0,e=T0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new D);const s=new D,r=new ge,o=new ge;function a(l){let h=0,u=0,d=0;for(let x=0;x<9;x++)n.probe[x].set(0,0,0);let f=0,g=0,v=0,m=0,p=0,S=0,M=0,_=0,R=0,w=0,T=0;l.sort(C0);for(let x=0,b=l.length;x<b;x++){const L=l[x],B=L.color,W=L.intensity,J=L.distance,j=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)h+=B.r*W,u+=B.g*W,d+=B.b*W;else if(L.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(L.sh.coefficients[Z],W);T++}else if(L.isDirectionalLight){const Z=t.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const it=L.shadow,F=e.get(L);F.shadowIntensity=it.intensity,F.shadowBias=it.bias,F.shadowNormalBias=it.normalBias,F.shadowRadius=it.radius,F.shadowMapSize=it.mapSize,n.directionalShadow[f]=F,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=L.shadow.matrix,S++}n.directional[f]=Z,f++}else if(L.isSpotLight){const Z=t.get(L);Z.position.setFromMatrixPosition(L.matrixWorld),Z.color.copy(B).multiplyScalar(W),Z.distance=J,Z.coneCos=Math.cos(L.angle),Z.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Z.decay=L.decay,n.spot[v]=Z;const it=L.shadow;if(L.map&&(n.spotLightMap[R]=L.map,R++,it.updateMatrices(L),L.castShadow&&w++),n.spotLightMatrix[v]=it.matrix,L.castShadow){const F=e.get(L);F.shadowIntensity=it.intensity,F.shadowBias=it.bias,F.shadowNormalBias=it.normalBias,F.shadowRadius=it.radius,F.shadowMapSize=it.mapSize,n.spotShadow[v]=F,n.spotShadowMap[v]=j,_++}v++}else if(L.isRectAreaLight){const Z=t.get(L);Z.color.copy(B).multiplyScalar(W),Z.halfWidth.set(L.width*.5,0,0),Z.halfHeight.set(0,L.height*.5,0),n.rectArea[m]=Z,m++}else if(L.isPointLight){const Z=t.get(L);if(Z.color.copy(L.color).multiplyScalar(L.intensity),Z.distance=L.distance,Z.decay=L.decay,L.castShadow){const it=L.shadow,F=e.get(L);F.shadowIntensity=it.intensity,F.shadowBias=it.bias,F.shadowNormalBias=it.normalBias,F.shadowRadius=it.radius,F.shadowMapSize=it.mapSize,F.shadowCameraNear=it.camera.near,F.shadowCameraFar=it.camera.far,n.pointShadow[g]=F,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=L.shadow.matrix,M++}n.point[g]=Z,g++}else if(L.isHemisphereLight){const Z=t.get(L);Z.skyColor.copy(L.color).multiplyScalar(W),Z.groundColor.copy(L.groundColor).multiplyScalar(W),n.hemi[p]=Z,p++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const C=n.hash;(C.directionalLength!==f||C.pointLength!==g||C.spotLength!==v||C.rectAreaLength!==m||C.hemiLength!==p||C.numDirectionalShadows!==S||C.numPointShadows!==M||C.numSpotShadows!==_||C.numSpotMaps!==R||C.numLightProbes!==T)&&(n.directional.length=f,n.spot.length=v,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=_,n.spotShadowMap.length=_,n.directionalShadowMatrix.length=S,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=_+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=T,C.directionalLength=f,C.pointLength=g,C.spotLength=v,C.rectAreaLength=m,C.hemiLength=p,C.numDirectionalShadows=S,C.numPointShadows=M,C.numSpotShadows=_,C.numSpotMaps=R,C.numLightProbes=T,n.version=A0++)}function c(l,h){let u=0,d=0,f=0,g=0,v=0;const m=h.matrixWorldInverse;for(let p=0,S=l.length;p<S;p++){const M=l[p];if(M.isDirectionalLight){const _=n.directional[u];_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),u++}else if(M.isSpotLight){const _=n.spot[f];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),_.direction.setFromMatrixPosition(M.matrixWorld),s.setFromMatrixPosition(M.target.matrixWorld),_.direction.sub(s),_.direction.transformDirection(m),f++}else if(M.isRectAreaLight){const _=n.rectArea[g];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),_.halfWidth.set(M.width*.5,0,0),_.halfHeight.set(0,M.height*.5,0),_.halfWidth.applyMatrix4(o),_.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const _=n.point[d];_.position.setFromMatrixPosition(M.matrixWorld),_.position.applyMatrix4(m),d++}else if(M.isHemisphereLight){const _=n.hemi[v];_.direction.setFromMatrixPosition(M.matrixWorld),_.direction.transformDirection(m),v++}}}return{setup:a,setupView:c,state:n}}function pc(i){const t=new R0(i),e=[],n=[];function s(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function P0(i){let t=new WeakMap;function e(s,r=0){const o=t.get(s);let a;return o===void 0?(a=new pc(i),t.set(s,[a])):r>=o.length?(a=new pc(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const L0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,I0=`uniform sampler2D shadow_pass;
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
}`;function D0(i,t,e){let n=new qo;const s=new vt,r=new vt,o=new ve,a=new td({depthPacking:gh}),c=new ed,l={},h=e.maxTextureSize,u={[_n]:Ue,[Ue]:_n,[je]:je},d=new Cn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new vt},radius:{value:4}},vertexShader:L0,fragmentShader:I0}),f=d.clone();f.defines.HORIZONTAL_PASS=1;const g=new we;g.setAttribute("position",new en(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new P(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=zc;let p=this.type;this.render=function(w,T,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const x=i.getRenderTarget(),b=i.getActiveCubeFace(),L=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Tn),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const W=p!==dn&&this.type===dn,J=p===dn&&this.type!==dn;for(let j=0,Z=w.length;j<Z;j++){const it=w[j],F=it.shadow;if(F===void 0){console.warn("THREE.WebGLShadowMap:",it,"has no shadow.");continue}if(F.autoUpdate===!1&&F.needsUpdate===!1)continue;s.copy(F.mapSize);const pt=F.getFrameExtents();if(s.multiply(pt),r.copy(F.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/pt.x),s.x=r.x*pt.x,F.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/pt.y),s.y=r.y*pt.y,F.mapSize.y=r.y)),F.map===null||W===!0||J===!0){const Rt=this.type!==dn?{minFilter:Ie,magFilter:Ie}:{};F.map!==null&&F.map.dispose(),F.map=new Jn(s.x,s.y,Rt),F.map.texture.name=it.name+".shadowMap",F.camera.updateProjectionMatrix()}i.setRenderTarget(F.map),i.clear();const yt=F.getViewportCount();for(let Rt=0;Rt<yt;Rt++){const Mt=F.getViewport(Rt);o.set(r.x*Mt.x,r.y*Mt.y,r.x*Mt.z,r.y*Mt.w),B.viewport(o),F.updateMatrices(it,Rt),n=F.getFrustum(),_(T,C,F.camera,it,this.type)}F.isPointLightShadow!==!0&&this.type===dn&&S(F,C),F.needsUpdate=!1}p=this.type,m.needsUpdate=!1,i.setRenderTarget(x,b,L)};function S(w,T){const C=t.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Jn(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(T,null,C,d,v,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(T,null,C,f,v,null)}function M(w,T,C,x){let b=null;const L=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)b=L;else if(b=C.isPointLight===!0?c:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){const B=b.uuid,W=T.uuid;let J=l[B];J===void 0&&(J={},l[B]=J);let j=J[W];j===void 0&&(j=b.clone(),J[W]=j,T.addEventListener("dispose",R)),b=j}if(b.visible=T.visible,b.wireframe=T.wireframe,x===dn?b.side=T.shadowSide!==null?T.shadowSide:T.side:b.side=T.shadowSide!==null?T.shadowSide:u[T.side],b.alphaMap=T.alphaMap,b.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,C.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const B=i.properties.get(b);B.light=C}return b}function _(w,T,C,x,b){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&b===dn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const W=t.update(w),J=w.material;if(Array.isArray(J)){const j=W.groups;for(let Z=0,it=j.length;Z<it;Z++){const F=j[Z],pt=J[F.materialIndex];if(pt&&pt.visible){const yt=M(w,pt,x,b);w.onBeforeShadow(i,w,T,C,W,yt,F),i.renderBufferDirect(C,null,W,yt,w,F),w.onAfterShadow(i,w,T,C,W,yt,F)}}}else if(J.visible){const j=M(w,J,x,b);w.onBeforeShadow(i,w,T,C,W,j,null),i.renderBufferDirect(C,null,W,j,w,null),w.onAfterShadow(i,w,T,C,W,j,null)}}const B=w.children;for(let W=0,J=B.length;W<J;W++)_(B[W],T,C,x,b)}function R(w){w.target.removeEventListener("dispose",R);for(const C in l){const x=l[C],b=w.target.uuid;b in x&&(x[b].dispose(),delete x[b])}}}const U0={[Or]:zr,[Br]:Hr,[kr]:Gr,[_i]:Vr,[zr]:Or,[Hr]:Br,[Gr]:kr,[Vr]:_i};function N0(i,t){function e(){let z=!1;const ft=new ve;let xt=null;const It=new ve(0,0,0,0);return{setMask:function(ut){xt!==ut&&!z&&(i.colorMask(ut,ut,ut,ut),xt=ut)},setLocked:function(ut){z=ut},setClear:function(ut,at,Nt,Xt,ue){ue===!0&&(ut*=Xt,at*=Xt,Nt*=Xt),ft.set(ut,at,Nt,Xt),It.equals(ft)===!1&&(i.clearColor(ut,at,Nt,Xt),It.copy(ft))},reset:function(){z=!1,xt=null,It.set(-1,0,0,0)}}}function n(){let z=!1,ft=!1,xt=null,It=null,ut=null;return{setReversed:function(at){if(ft!==at){const Nt=t.get("EXT_clip_control");at?Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.ZERO_TO_ONE_EXT):Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.NEGATIVE_ONE_TO_ONE_EXT),ft=at;const Xt=ut;ut=null,this.setClear(Xt)}},getReversed:function(){return ft},setTest:function(at){at?$(i.DEPTH_TEST):Ct(i.DEPTH_TEST)},setMask:function(at){xt!==at&&!z&&(i.depthMask(at),xt=at)},setFunc:function(at){if(ft&&(at=U0[at]),It!==at){switch(at){case Or:i.depthFunc(i.NEVER);break;case zr:i.depthFunc(i.ALWAYS);break;case Br:i.depthFunc(i.LESS);break;case _i:i.depthFunc(i.LEQUAL);break;case kr:i.depthFunc(i.EQUAL);break;case Vr:i.depthFunc(i.GEQUAL);break;case Hr:i.depthFunc(i.GREATER);break;case Gr:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}It=at}},setLocked:function(at){z=at},setClear:function(at){ut!==at&&(ft&&(at=1-at),i.clearDepth(at),ut=at)},reset:function(){z=!1,xt=null,It=null,ut=null,ft=!1}}}function s(){let z=!1,ft=null,xt=null,It=null,ut=null,at=null,Nt=null,Xt=null,ue=null;return{setTest:function(ae){z||(ae?$(i.STENCIL_TEST):Ct(i.STENCIL_TEST))},setMask:function(ae){ft!==ae&&!z&&(i.stencilMask(ae),ft=ae)},setFunc:function(ae,on,Ze){(xt!==ae||It!==on||ut!==Ze)&&(i.stencilFunc(ae,on,Ze),xt=ae,It=on,ut=Ze)},setOp:function(ae,on,Ze){(at!==ae||Nt!==on||Xt!==Ze)&&(i.stencilOp(ae,on,Ze),at=ae,Nt=on,Xt=Ze)},setLocked:function(ae){z=ae},setClear:function(ae){ue!==ae&&(i.clearStencil(ae),ue=ae)},reset:function(){z=!1,ft=null,xt=null,It=null,ut=null,at=null,Nt=null,Xt=null,ue=null}}}const r=new e,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,S=null,M=null,_=null,R=null,w=null,T=new Qt(0,0,0),C=0,x=!1,b=null,L=null,B=null,W=null,J=null;const j=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,it=0;const F=i.getParameter(i.VERSION);F.indexOf("WebGL")!==-1?(it=parseFloat(/^WebGL (\d)/.exec(F)[1]),Z=it>=1):F.indexOf("OpenGL ES")!==-1&&(it=parseFloat(/^OpenGL ES (\d)/.exec(F)[1]),Z=it>=2);let pt=null,yt={};const Rt=i.getParameter(i.SCISSOR_BOX),Mt=i.getParameter(i.VIEWPORT),Zt=new ve().fromArray(Rt),ie=new ve().fromArray(Mt);function te(z,ft,xt,It){const ut=new Uint8Array(4),at=i.createTexture();i.bindTexture(z,at),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Nt=0;Nt<xt;Nt++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(ft,0,i.RGBA,1,1,It,0,i.RGBA,i.UNSIGNED_BYTE,ut):i.texImage2D(ft+Nt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ut);return at}const et={};et[i.TEXTURE_2D]=te(i.TEXTURE_2D,i.TEXTURE_2D,1),et[i.TEXTURE_CUBE_MAP]=te(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),et[i.TEXTURE_2D_ARRAY]=te(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),et[i.TEXTURE_3D]=te(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),$(i.DEPTH_TEST),o.setFunc(_i),tt(!1),nt(ca),$(i.CULL_FACE),lt(Tn);function $(z){h[z]!==!0&&(i.enable(z),h[z]=!0)}function Ct(z){h[z]!==!1&&(i.disable(z),h[z]=!1)}function Dt(z,ft){return u[z]!==ft?(i.bindFramebuffer(z,ft),u[z]=ft,z===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=ft),z===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=ft),!0):!1}function Pt(z,ft){let xt=f,It=!1;if(z){xt=d.get(ft),xt===void 0&&(xt=[],d.set(ft,xt));const ut=z.textures;if(xt.length!==ut.length||xt[0]!==i.COLOR_ATTACHMENT0){for(let at=0,Nt=ut.length;at<Nt;at++)xt[at]=i.COLOR_ATTACHMENT0+at;xt.length=ut.length,It=!0}}else xt[0]!==i.BACK&&(xt[0]=i.BACK,It=!0);It&&i.drawBuffers(xt)}function Wt(z){return g!==z?(i.useProgram(z),g=z,!0):!1}const ee={[Vn]:i.FUNC_ADD,[Hl]:i.FUNC_SUBTRACT,[Gl]:i.FUNC_REVERSE_SUBTRACT};ee[Wl]=i.MIN,ee[Xl]=i.MAX;const I={[ql]:i.ZERO,[Yl]:i.ONE,[jl]:i.SRC_COLOR,[Nr]:i.SRC_ALPHA,[th]:i.SRC_ALPHA_SATURATE,[$l]:i.DST_COLOR,[Kl]:i.DST_ALPHA,[Jl]:i.ONE_MINUS_SRC_COLOR,[Fr]:i.ONE_MINUS_SRC_ALPHA,[Ql]:i.ONE_MINUS_DST_COLOR,[Zl]:i.ONE_MINUS_DST_ALPHA,[eh]:i.CONSTANT_COLOR,[nh]:i.ONE_MINUS_CONSTANT_COLOR,[ih]:i.CONSTANT_ALPHA,[sh]:i.ONE_MINUS_CONSTANT_ALPHA};function lt(z,ft,xt,It,ut,at,Nt,Xt,ue,ae){if(z===Tn){v===!0&&(Ct(i.BLEND),v=!1);return}if(v===!1&&($(i.BLEND),v=!0),z!==Vl){if(z!==m||ae!==x){if((p!==Vn||_!==Vn)&&(i.blendEquation(i.FUNC_ADD),p=Vn,_=Vn),ae)switch(z){case mi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case la:i.blendFunc(i.ONE,i.ONE);break;case ha:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case ua:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case mi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case la:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case ha:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ua:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}S=null,M=null,R=null,w=null,T.set(0,0,0),C=0,m=z,x=ae}return}ut=ut||ft,at=at||xt,Nt=Nt||It,(ft!==p||ut!==_)&&(i.blendEquationSeparate(ee[ft],ee[ut]),p=ft,_=ut),(xt!==S||It!==M||at!==R||Nt!==w)&&(i.blendFuncSeparate(I[xt],I[It],I[at],I[Nt]),S=xt,M=It,R=at,w=Nt),(Xt.equals(T)===!1||ue!==C)&&(i.blendColor(Xt.r,Xt.g,Xt.b,ue),T.copy(Xt),C=ue),m=z,x=!1}function rt(z,ft){z.side===je?Ct(i.CULL_FACE):$(i.CULL_FACE);let xt=z.side===Ue;ft&&(xt=!xt),tt(xt),z.blending===mi&&z.transparent===!1?lt(Tn):lt(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);const It=z.stencilWrite;a.setTest(It),It&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),ht(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):Ct(i.SAMPLE_ALPHA_TO_COVERAGE)}function tt(z){b!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),b=z)}function nt(z){z!==Bl?($(i.CULL_FACE),z!==L&&(z===ca?i.cullFace(i.BACK):z===kl?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ct(i.CULL_FACE),L=z}function _t(z){z!==B&&(Z&&i.lineWidth(z),B=z)}function ht(z,ft,xt){z?($(i.POLYGON_OFFSET_FILL),(W!==ft||J!==xt)&&(i.polygonOffset(ft,xt),W=ft,J=xt)):Ct(i.POLYGON_OFFSET_FILL)}function gt(z){z?$(i.SCISSOR_TEST):Ct(i.SCISSOR_TEST)}function Ht(z){z===void 0&&(z=i.TEXTURE0+j-1),pt!==z&&(i.activeTexture(z),pt=z)}function zt(z,ft,xt){xt===void 0&&(pt===null?xt=i.TEXTURE0+j-1:xt=pt);let It=yt[xt];It===void 0&&(It={type:void 0,texture:void 0},yt[xt]=It),(It.type!==z||It.texture!==ft)&&(pt!==xt&&(i.activeTexture(xt),pt=xt),i.bindTexture(z,ft||et[z]),It.type=z,It.texture=ft)}function A(){const z=yt[pt];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function y(){try{i.compressedTexImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function G(){try{i.compressedTexImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function q(){try{i.texSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function ct(){try{i.texSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function K(){try{i.compressedTexSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function k(){try{i.compressedTexSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function O(){try{i.texStorage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Q(){try{i.texStorage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function mt(){try{i.texImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function st(){try{i.texImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Tt(z){Zt.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),Zt.copy(z))}function Vt(z){ie.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),ie.copy(z))}function Ft(z,ft){let xt=l.get(ft);xt===void 0&&(xt=new WeakMap,l.set(ft,xt));let It=xt.get(z);It===void 0&&(It=i.getUniformBlockIndex(ft,z.name),xt.set(z,It))}function bt(z,ft){const It=l.get(ft).get(z);c.get(ft)!==It&&(i.uniformBlockBinding(ft,It,z.__bindingPointIndex),c.set(ft,It))}function qt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},pt=null,yt={},u={},d=new WeakMap,f=[],g=null,v=!1,m=null,p=null,S=null,M=null,_=null,R=null,w=null,T=new Qt(0,0,0),C=0,x=!1,b=null,L=null,B=null,W=null,J=null,Zt.set(0,0,i.canvas.width,i.canvas.height),ie.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:$,disable:Ct,bindFramebuffer:Dt,drawBuffers:Pt,useProgram:Wt,setBlending:lt,setMaterial:rt,setFlipSided:tt,setCullFace:nt,setLineWidth:_t,setPolygonOffset:ht,setScissorTest:gt,activeTexture:Ht,bindTexture:zt,unbindTexture:A,compressedTexImage2D:y,compressedTexImage3D:G,texImage2D:mt,texImage3D:st,updateUBOMapping:Ft,uniformBlockBinding:bt,texStorage2D:O,texStorage3D:Q,texSubImage2D:q,texSubImage3D:ct,compressedTexSubImage2D:K,compressedTexSubImage3D:k,scissor:Tt,viewport:Vt,reset:qt}}function F0(i,t,e,n,s,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new vt,h=new WeakMap;let u;const d=new WeakMap;let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(A,y){return f?new OffscreenCanvas(A,y):Fs("canvas")}function v(A,y,G){let q=1;const ct=zt(A);if((ct.width>G||ct.height>G)&&(q=G/Math.max(ct.width,ct.height)),q<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const K=Math.floor(q*ct.width),k=Math.floor(q*ct.height);u===void 0&&(u=g(K,k));const O=y?g(K,k):u;return O.width=K,O.height=k,O.getContext("2d").drawImage(A,0,0,K,k),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ct.width+"x"+ct.height+") to ("+K+"x"+k+")."),O}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ct.width+"x"+ct.height+")."),A;return A}function m(A){return A.generateMipmaps}function p(A){i.generateMipmap(A)}function S(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function M(A,y,G,q,ct=!1){if(A!==null){if(i[A]!==void 0)return i[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let K=y;if(y===i.RED&&(G===i.FLOAT&&(K=i.R32F),G===i.HALF_FLOAT&&(K=i.R16F),G===i.UNSIGNED_BYTE&&(K=i.R8)),y===i.RED_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.R8UI),G===i.UNSIGNED_SHORT&&(K=i.R16UI),G===i.UNSIGNED_INT&&(K=i.R32UI),G===i.BYTE&&(K=i.R8I),G===i.SHORT&&(K=i.R16I),G===i.INT&&(K=i.R32I)),y===i.RG&&(G===i.FLOAT&&(K=i.RG32F),G===i.HALF_FLOAT&&(K=i.RG16F),G===i.UNSIGNED_BYTE&&(K=i.RG8)),y===i.RG_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.RG8UI),G===i.UNSIGNED_SHORT&&(K=i.RG16UI),G===i.UNSIGNED_INT&&(K=i.RG32UI),G===i.BYTE&&(K=i.RG8I),G===i.SHORT&&(K=i.RG16I),G===i.INT&&(K=i.RG32I)),y===i.RGB_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.RGB8UI),G===i.UNSIGNED_SHORT&&(K=i.RGB16UI),G===i.UNSIGNED_INT&&(K=i.RGB32UI),G===i.BYTE&&(K=i.RGB8I),G===i.SHORT&&(K=i.RGB16I),G===i.INT&&(K=i.RGB32I)),y===i.RGBA_INTEGER&&(G===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),G===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),G===i.UNSIGNED_INT&&(K=i.RGBA32UI),G===i.BYTE&&(K=i.RGBA8I),G===i.SHORT&&(K=i.RGBA16I),G===i.INT&&(K=i.RGBA32I)),y===i.RGB&&(G===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),G===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),y===i.RGBA){const k=ct?Us:oe.getTransfer(q);G===i.FLOAT&&(K=i.RGBA32F),G===i.HALF_FLOAT&&(K=i.RGBA16F),G===i.UNSIGNED_BYTE&&(K=k===le?i.SRGB8_ALPHA8:i.RGBA8),G===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),G===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function _(A,y){let G;return A?y===null||y===jn||y===Gi?G=i.DEPTH24_STENCIL8:y===pn?G=i.DEPTH32F_STENCIL8:y===Hi&&(G=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===jn||y===Gi?G=i.DEPTH_COMPONENT24:y===pn?G=i.DEPTH_COMPONENT32F:y===Hi&&(G=i.DEPTH_COMPONENT16),G}function R(A,y){return m(A)===!0||A.isFramebufferTexture&&A.minFilter!==Ie&&A.minFilter!==Qe?Math.log2(Math.max(y.width,y.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?y.mipmaps.length:1}function w(A){const y=A.target;y.removeEventListener("dispose",w),C(y),y.isVideoTexture&&h.delete(y)}function T(A){const y=A.target;y.removeEventListener("dispose",T),b(y)}function C(A){const y=n.get(A);if(y.__webglInit===void 0)return;const G=A.source,q=d.get(G);if(q){const ct=q[y.__cacheKey];ct.usedTimes--,ct.usedTimes===0&&x(A),Object.keys(q).length===0&&d.delete(G)}n.remove(A)}function x(A){const y=n.get(A);i.deleteTexture(y.__webglTexture);const G=A.source,q=d.get(G);delete q[y.__cacheKey],o.memory.textures--}function b(A){const y=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(y.__webglFramebuffer[q]))for(let ct=0;ct<y.__webglFramebuffer[q].length;ct++)i.deleteFramebuffer(y.__webglFramebuffer[q][ct]);else i.deleteFramebuffer(y.__webglFramebuffer[q]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[q])}else{if(Array.isArray(y.__webglFramebuffer))for(let q=0;q<y.__webglFramebuffer.length;q++)i.deleteFramebuffer(y.__webglFramebuffer[q]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let q=0;q<y.__webglColorRenderbuffer.length;q++)y.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[q]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}const G=A.textures;for(let q=0,ct=G.length;q<ct;q++){const K=n.get(G[q]);K.__webglTexture&&(i.deleteTexture(K.__webglTexture),o.memory.textures--),n.remove(G[q])}n.remove(A)}let L=0;function B(){L=0}function W(){const A=L;return A>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+s.maxTextures),L+=1,A}function J(A){const y=[];return y.push(A.wrapS),y.push(A.wrapT),y.push(A.wrapR||0),y.push(A.magFilter),y.push(A.minFilter),y.push(A.anisotropy),y.push(A.internalFormat),y.push(A.format),y.push(A.type),y.push(A.generateMipmaps),y.push(A.premultiplyAlpha),y.push(A.flipY),y.push(A.unpackAlignment),y.push(A.colorSpace),y.join()}function j(A,y){const G=n.get(A);if(A.isVideoTexture&&gt(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&G.__version!==A.version){const q=A.image;if(q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{et(G,A,y);return}}else A.isExternalTexture&&(G.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,G.__webglTexture,i.TEXTURE0+y)}function Z(A,y){const G=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){et(G,A,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,G.__webglTexture,i.TEXTURE0+y)}function it(A,y){const G=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){et(G,A,y);return}e.bindTexture(i.TEXTURE_3D,G.__webglTexture,i.TEXTURE0+y)}function F(A,y){const G=n.get(A);if(A.version>0&&G.__version!==A.version){$(G,A,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,G.__webglTexture,i.TEXTURE0+y)}const pt={[qr]:i.REPEAT,[Gn]:i.CLAMP_TO_EDGE,[Yr]:i.MIRRORED_REPEAT},yt={[Ie]:i.NEAREST,[ph]:i.NEAREST_MIPMAP_NEAREST,[is]:i.NEAREST_MIPMAP_LINEAR,[Qe]:i.LINEAR,[Js]:i.LINEAR_MIPMAP_NEAREST,[Wn]:i.LINEAR_MIPMAP_LINEAR},Rt={[vh]:i.NEVER,[Eh]:i.ALWAYS,[xh]:i.LESS,[Kc]:i.LEQUAL,[Mh]:i.EQUAL,[bh]:i.GEQUAL,[yh]:i.GREATER,[Sh]:i.NOTEQUAL};function Mt(A,y){if(y.type===pn&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Qe||y.magFilter===Js||y.magFilter===is||y.magFilter===Wn||y.minFilter===Qe||y.minFilter===Js||y.minFilter===is||y.minFilter===Wn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,pt[y.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,pt[y.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,pt[y.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,yt[y.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,yt[y.minFilter]),y.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Rt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Ie||y.minFilter!==is&&y.minFilter!==Wn||y.type===pn&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){const G=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Zt(A,y){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,y.addEventListener("dispose",w));const q=y.source;let ct=d.get(q);ct===void 0&&(ct={},d.set(q,ct));const K=J(y);if(K!==A.__cacheKey){ct[K]===void 0&&(ct[K]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,G=!0),ct[K].usedTimes++;const k=ct[A.__cacheKey];k!==void 0&&(ct[A.__cacheKey].usedTimes--,k.usedTimes===0&&x(y)),A.__cacheKey=K,A.__webglTexture=ct[K].texture}return G}function ie(A,y,G){return Math.floor(Math.floor(A/G)/y)}function te(A,y,G,q){const K=A.updateRanges;if(K.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,G,q,y.data);else{K.sort((st,Tt)=>st.start-Tt.start);let k=0;for(let st=1;st<K.length;st++){const Tt=K[k],Vt=K[st],Ft=Tt.start+Tt.count,bt=ie(Vt.start,y.width,4),qt=ie(Tt.start,y.width,4);Vt.start<=Ft+1&&bt===qt&&ie(Vt.start+Vt.count-1,y.width,4)===bt?Tt.count=Math.max(Tt.count,Vt.start+Vt.count-Tt.start):(++k,K[k]=Vt)}K.length=k+1;const O=i.getParameter(i.UNPACK_ROW_LENGTH),Q=i.getParameter(i.UNPACK_SKIP_PIXELS),mt=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let st=0,Tt=K.length;st<Tt;st++){const Vt=K[st],Ft=Math.floor(Vt.start/4),bt=Math.ceil(Vt.count/4),qt=Ft%y.width,z=Math.floor(Ft/y.width),ft=bt,xt=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,qt),i.pixelStorei(i.UNPACK_SKIP_ROWS,z),e.texSubImage2D(i.TEXTURE_2D,0,qt,z,ft,xt,G,q,y.data)}A.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,O),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Q),i.pixelStorei(i.UNPACK_SKIP_ROWS,mt)}}function et(A,y,G){let q=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(q=i.TEXTURE_3D);const ct=Zt(A,y),K=y.source;e.bindTexture(q,A.__webglTexture,i.TEXTURE0+G);const k=n.get(K);if(K.version!==k.__version||ct===!0){e.activeTexture(i.TEXTURE0+G);const O=oe.getPrimaries(oe.workingColorSpace),Q=y.colorSpace===wn?null:oe.getPrimaries(y.colorSpace),mt=y.colorSpace===wn||O===Q?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt);let st=v(y.image,!1,s.maxTextureSize);st=Ht(y,st);const Tt=r.convert(y.format,y.colorSpace),Vt=r.convert(y.type);let Ft=M(y.internalFormat,Tt,Vt,y.colorSpace,y.isVideoTexture);Mt(q,y);let bt;const qt=y.mipmaps,z=y.isVideoTexture!==!0,ft=k.__version===void 0||ct===!0,xt=K.dataReady,It=R(y,st);if(y.isDepthTexture)Ft=_(y.format===Xi,y.type),ft&&(z?e.texStorage2D(i.TEXTURE_2D,1,Ft,st.width,st.height):e.texImage2D(i.TEXTURE_2D,0,Ft,st.width,st.height,0,Tt,Vt,null));else if(y.isDataTexture)if(qt.length>0){z&&ft&&e.texStorage2D(i.TEXTURE_2D,It,Ft,qt[0].width,qt[0].height);for(let ut=0,at=qt.length;ut<at;ut++)bt=qt[ut],z?xt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,bt.width,bt.height,Tt,Vt,bt.data):e.texImage2D(i.TEXTURE_2D,ut,Ft,bt.width,bt.height,0,Tt,Vt,bt.data);y.generateMipmaps=!1}else z?(ft&&e.texStorage2D(i.TEXTURE_2D,It,Ft,st.width,st.height),xt&&te(y,st,Tt,Vt)):e.texImage2D(i.TEXTURE_2D,0,Ft,st.width,st.height,0,Tt,Vt,st.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){z&&ft&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Ft,qt[0].width,qt[0].height,st.depth);for(let ut=0,at=qt.length;ut<at;ut++)if(bt=qt[ut],y.format!==Ke)if(Tt!==null)if(z){if(xt)if(y.layerUpdates.size>0){const Nt=Wa(bt.width,bt.height,y.format,y.type);for(const Xt of y.layerUpdates){const ue=bt.data.subarray(Xt*Nt/bt.data.BYTES_PER_ELEMENT,(Xt+1)*Nt/bt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,Xt,bt.width,bt.height,1,Tt,ue)}y.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,0,bt.width,bt.height,st.depth,Tt,bt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ut,Ft,bt.width,bt.height,st.depth,0,bt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else z?xt&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ut,0,0,0,bt.width,bt.height,st.depth,Tt,Vt,bt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ut,Ft,bt.width,bt.height,st.depth,0,Tt,Vt,bt.data)}else{z&&ft&&e.texStorage2D(i.TEXTURE_2D,It,Ft,qt[0].width,qt[0].height);for(let ut=0,at=qt.length;ut<at;ut++)bt=qt[ut],y.format!==Ke?Tt!==null?z?xt&&e.compressedTexSubImage2D(i.TEXTURE_2D,ut,0,0,bt.width,bt.height,Tt,bt.data):e.compressedTexImage2D(i.TEXTURE_2D,ut,Ft,bt.width,bt.height,0,bt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):z?xt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,bt.width,bt.height,Tt,Vt,bt.data):e.texImage2D(i.TEXTURE_2D,ut,Ft,bt.width,bt.height,0,Tt,Vt,bt.data)}else if(y.isDataArrayTexture)if(z){if(ft&&e.texStorage3D(i.TEXTURE_2D_ARRAY,It,Ft,st.width,st.height,st.depth),xt)if(y.layerUpdates.size>0){const ut=Wa(st.width,st.height,y.format,y.type);for(const at of y.layerUpdates){const Nt=st.data.subarray(at*ut/st.data.BYTES_PER_ELEMENT,(at+1)*ut/st.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,at,st.width,st.height,1,Tt,Vt,Nt)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,st.width,st.height,st.depth,Tt,Vt,st.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ft,st.width,st.height,st.depth,0,Tt,Vt,st.data);else if(y.isData3DTexture)z?(ft&&e.texStorage3D(i.TEXTURE_3D,It,Ft,st.width,st.height,st.depth),xt&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,st.width,st.height,st.depth,Tt,Vt,st.data)):e.texImage3D(i.TEXTURE_3D,0,Ft,st.width,st.height,st.depth,0,Tt,Vt,st.data);else if(y.isFramebufferTexture){if(ft)if(z)e.texStorage2D(i.TEXTURE_2D,It,Ft,st.width,st.height);else{let ut=st.width,at=st.height;for(let Nt=0;Nt<It;Nt++)e.texImage2D(i.TEXTURE_2D,Nt,Ft,ut,at,0,Tt,Vt,null),ut>>=1,at>>=1}}else if(qt.length>0){if(z&&ft){const ut=zt(qt[0]);e.texStorage2D(i.TEXTURE_2D,It,Ft,ut.width,ut.height)}for(let ut=0,at=qt.length;ut<at;ut++)bt=qt[ut],z?xt&&e.texSubImage2D(i.TEXTURE_2D,ut,0,0,Tt,Vt,bt):e.texImage2D(i.TEXTURE_2D,ut,Ft,Tt,Vt,bt);y.generateMipmaps=!1}else if(z){if(ft){const ut=zt(st);e.texStorage2D(i.TEXTURE_2D,It,Ft,ut.width,ut.height)}xt&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Tt,Vt,st)}else e.texImage2D(i.TEXTURE_2D,0,Ft,Tt,Vt,st);m(y)&&p(q),k.__version=K.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function $(A,y,G){if(y.image.length!==6)return;const q=Zt(A,y),ct=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+G);const K=n.get(ct);if(ct.version!==K.__version||q===!0){e.activeTexture(i.TEXTURE0+G);const k=oe.getPrimaries(oe.workingColorSpace),O=y.colorSpace===wn?null:oe.getPrimaries(y.colorSpace),Q=y.colorSpace===wn||k===O?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);const mt=y.isCompressedTexture||y.image[0].isCompressedTexture,st=y.image[0]&&y.image[0].isDataTexture,Tt=[];for(let at=0;at<6;at++)!mt&&!st?Tt[at]=v(y.image[at],!0,s.maxCubemapSize):Tt[at]=st?y.image[at].image:y.image[at],Tt[at]=Ht(y,Tt[at]);const Vt=Tt[0],Ft=r.convert(y.format,y.colorSpace),bt=r.convert(y.type),qt=M(y.internalFormat,Ft,bt,y.colorSpace),z=y.isVideoTexture!==!0,ft=K.__version===void 0||q===!0,xt=ct.dataReady;let It=R(y,Vt);Mt(i.TEXTURE_CUBE_MAP,y);let ut;if(mt){z&&ft&&e.texStorage2D(i.TEXTURE_CUBE_MAP,It,qt,Vt.width,Vt.height);for(let at=0;at<6;at++){ut=Tt[at].mipmaps;for(let Nt=0;Nt<ut.length;Nt++){const Xt=ut[Nt];y.format!==Ke?Ft!==null?z?xt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,0,0,Xt.width,Xt.height,Ft,Xt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,qt,Xt.width,Xt.height,0,Xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,0,0,Xt.width,Xt.height,Ft,bt,Xt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt,qt,Xt.width,Xt.height,0,Ft,bt,Xt.data)}}}else{if(ut=y.mipmaps,z&&ft){ut.length>0&&It++;const at=zt(Tt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,It,qt,at.width,at.height)}for(let at=0;at<6;at++)if(st){z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Tt[at].width,Tt[at].height,Ft,bt,Tt[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,qt,Tt[at].width,Tt[at].height,0,Ft,bt,Tt[at].data);for(let Nt=0;Nt<ut.length;Nt++){const ue=ut[Nt].image[at].image;z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,0,0,ue.width,ue.height,Ft,bt,ue.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,qt,ue.width,ue.height,0,Ft,bt,ue.data)}}else{z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Ft,bt,Tt[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,qt,Ft,bt,Tt[at]);for(let Nt=0;Nt<ut.length;Nt++){const Xt=ut[Nt];z?xt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,0,0,Ft,bt,Xt.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,Nt+1,qt,Ft,bt,Xt.image[at])}}}m(y)&&p(i.TEXTURE_CUBE_MAP),K.__version=ct.version,y.onUpdate&&y.onUpdate(y)}A.__version=y.version}function Ct(A,y,G,q,ct,K){const k=r.convert(G.format,G.colorSpace),O=r.convert(G.type),Q=M(G.internalFormat,k,O,G.colorSpace),mt=n.get(y),st=n.get(G);if(st.__renderTarget=y,!mt.__hasExternalTextures){const Tt=Math.max(1,y.width>>K),Vt=Math.max(1,y.height>>K);ct===i.TEXTURE_3D||ct===i.TEXTURE_2D_ARRAY?e.texImage3D(ct,K,Q,Tt,Vt,y.depth,0,k,O,null):e.texImage2D(ct,K,Q,Tt,Vt,0,k,O,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),ht(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,ct,st.__webglTexture,0,_t(y)):(ct===i.TEXTURE_2D||ct>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ct<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,ct,st.__webglTexture,K),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Dt(A,y,G){if(i.bindRenderbuffer(i.RENDERBUFFER,A),y.depthBuffer){const q=y.depthTexture,ct=q&&q.isDepthTexture?q.type:null,K=_(y.stencilBuffer,ct),k=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,O=_t(y);ht(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,O,K,y.width,y.height):G?i.renderbufferStorageMultisample(i.RENDERBUFFER,O,K,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,K,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,k,i.RENDERBUFFER,A)}else{const q=y.textures;for(let ct=0;ct<q.length;ct++){const K=q[ct],k=r.convert(K.format,K.colorSpace),O=r.convert(K.type),Q=M(K.internalFormat,k,O,K.colorSpace),mt=_t(y);G&&ht(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,Q,y.width,y.height):ht(y)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt,Q,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Q,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Pt(A,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(y.depthTexture);q.__renderTarget=y,(!q.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),j(y.depthTexture,0);const ct=q.__webglTexture,K=_t(y);if(y.depthTexture.format===Wi)ht(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ct,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ct,0);else if(y.depthTexture.format===Xi)ht(y)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ct,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ct,0);else throw new Error("Unknown depthTexture format")}function Wt(A){const y=n.get(A),G=A.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==A.depthTexture){const q=A.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),q){const ct=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,q.removeEventListener("dispose",ct)};q.addEventListener("dispose",ct),y.__depthDisposeCallback=ct}y.__boundDepthTexture=q}if(A.depthTexture&&!y.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");const q=A.texture.mipmaps;q&&q.length>0?Pt(y.__webglFramebuffer[0],A):Pt(y.__webglFramebuffer,A)}else if(G){y.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[q]),y.__webglDepthbuffer[q]===void 0)y.__webglDepthbuffer[q]=i.createRenderbuffer(),Dt(y.__webglDepthbuffer[q],A,!1);else{const ct=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=y.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ct,i.RENDERBUFFER,K)}}else{const q=A.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Dt(y.__webglDepthbuffer,A,!1);else{const ct=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,K=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,K),i.framebufferRenderbuffer(i.FRAMEBUFFER,ct,i.RENDERBUFFER,K)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ee(A,y,G){const q=n.get(A);y!==void 0&&Ct(q.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),G!==void 0&&Wt(A)}function I(A){const y=A.texture,G=n.get(A),q=n.get(y);A.addEventListener("dispose",T);const ct=A.textures,K=A.isWebGLCubeRenderTarget===!0,k=ct.length>1;if(k||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=y.version,o.memory.textures++),K){G.__webglFramebuffer=[];for(let O=0;O<6;O++)if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer[O]=[];for(let Q=0;Q<y.mipmaps.length;Q++)G.__webglFramebuffer[O][Q]=i.createFramebuffer()}else G.__webglFramebuffer[O]=i.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){G.__webglFramebuffer=[];for(let O=0;O<y.mipmaps.length;O++)G.__webglFramebuffer[O]=i.createFramebuffer()}else G.__webglFramebuffer=i.createFramebuffer();if(k)for(let O=0,Q=ct.length;O<Q;O++){const mt=n.get(ct[O]);mt.__webglTexture===void 0&&(mt.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&ht(A)===!1){G.__webglMultisampledFramebuffer=i.createFramebuffer(),G.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let O=0;O<ct.length;O++){const Q=ct[O];G.__webglColorRenderbuffer[O]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,G.__webglColorRenderbuffer[O]);const mt=r.convert(Q.format,Q.colorSpace),st=r.convert(Q.type),Tt=M(Q.internalFormat,mt,st,Q.colorSpace,A.isXRRenderTarget===!0),Vt=_t(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,Vt,Tt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+O,i.RENDERBUFFER,G.__webglColorRenderbuffer[O])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=i.createRenderbuffer(),Dt(G.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Mt(i.TEXTURE_CUBE_MAP,y);for(let O=0;O<6;O++)if(y.mipmaps&&y.mipmaps.length>0)for(let Q=0;Q<y.mipmaps.length;Q++)Ct(G.__webglFramebuffer[O][Q],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+O,Q);else Ct(G.__webglFramebuffer[O],A,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+O,0);m(y)&&p(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(k){for(let O=0,Q=ct.length;O<Q;O++){const mt=ct[O],st=n.get(mt);let Tt=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Tt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Tt,st.__webglTexture),Mt(Tt,mt),Ct(G.__webglFramebuffer,A,mt,i.COLOR_ATTACHMENT0+O,Tt,0),m(mt)&&p(Tt)}e.unbindTexture()}else{let O=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(O=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(O,q.__webglTexture),Mt(O,y),y.mipmaps&&y.mipmaps.length>0)for(let Q=0;Q<y.mipmaps.length;Q++)Ct(G.__webglFramebuffer[Q],A,y,i.COLOR_ATTACHMENT0,O,Q);else Ct(G.__webglFramebuffer,A,y,i.COLOR_ATTACHMENT0,O,0);m(y)&&p(O),e.unbindTexture()}A.depthBuffer&&Wt(A)}function lt(A){const y=A.textures;for(let G=0,q=y.length;G<q;G++){const ct=y[G];if(m(ct)){const K=S(A),k=n.get(ct).__webglTexture;e.bindTexture(K,k),p(K),e.unbindTexture()}}}const rt=[],tt=[];function nt(A){if(A.samples>0){if(ht(A)===!1){const y=A.textures,G=A.width,q=A.height;let ct=i.COLOR_BUFFER_BIT;const K=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,k=n.get(A),O=y.length>1;if(O)for(let mt=0;mt<y.length;mt++)e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,k.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,k.__webglMultisampledFramebuffer);const Q=A.texture.mipmaps;Q&&Q.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,k.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,k.__webglFramebuffer);for(let mt=0;mt<y.length;mt++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ct|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ct|=i.STENCIL_BUFFER_BIT)),O){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,k.__webglColorRenderbuffer[mt]);const st=n.get(y[mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,st,0)}i.blitFramebuffer(0,0,G,q,0,0,G,q,ct,i.NEAREST),c===!0&&(rt.length=0,tt.length=0,rt.push(i.COLOR_ATTACHMENT0+mt),A.depthBuffer&&A.resolveDepthBuffer===!1&&(rt.push(K),tt.push(K),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,tt)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,rt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),O)for(let mt=0;mt<y.length;mt++){e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,k.__webglColorRenderbuffer[mt]);const st=n.get(y[mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,k.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,st,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,k.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const y=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function _t(A){return Math.min(s.maxSamples,A.samples)}function ht(A){const y=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function gt(A){const y=o.render.frame;h.get(A)!==y&&(h.set(A,y),A.update())}function Ht(A,y){const G=A.colorSpace,q=A.format,ct=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||G!==Mi&&G!==wn&&(oe.getTransfer(G)===le?(q!==Ke||ct!==nn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),y}function zt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(l.width=A.naturalWidth||A.width,l.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(l.width=A.displayWidth,l.height=A.displayHeight):(l.width=A.width,l.height=A.height),l}this.allocateTextureUnit=W,this.resetTextureUnits=B,this.setTexture2D=j,this.setTexture2DArray=Z,this.setTexture3D=it,this.setTextureCube=F,this.rebindTextures=ee,this.setupRenderTarget=I,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=Wt,this.setupFrameBufferTexture=Ct,this.useMultisampledRTT=ht}function O0(i,t){function e(n,s=wn){let r;const o=oe.getTransfer(s);if(n===nn)return i.UNSIGNED_BYTE;if(n===Oo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===zo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Wc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Xc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Hc)return i.BYTE;if(n===Gc)return i.SHORT;if(n===Hi)return i.UNSIGNED_SHORT;if(n===Fo)return i.INT;if(n===jn)return i.UNSIGNED_INT;if(n===pn)return i.FLOAT;if(n===$i)return i.HALF_FLOAT;if(n===qc)return i.ALPHA;if(n===Yc)return i.RGB;if(n===Ke)return i.RGBA;if(n===Wi)return i.DEPTH_COMPONENT;if(n===Xi)return i.DEPTH_STENCIL;if(n===Bo)return i.RED;if(n===ko)return i.RED_INTEGER;if(n===jc)return i.RG;if(n===Vo)return i.RG_INTEGER;if(n===Ho)return i.RGBA_INTEGER;if(n===Rs||n===Ps||n===Ls||n===Is)if(o===le)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Rs)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ps)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ls)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Is)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Rs)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ps)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ls)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Is)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===jr||n===Jr||n===Kr||n===Zr)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===jr)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Jr)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Kr)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Zr)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===$r||n===Qr||n===to)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===$r||n===Qr)return o===le?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===to)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===eo||n===no||n===io||n===so||n===ro||n===oo||n===ao||n===co||n===lo||n===ho||n===uo||n===fo||n===po||n===mo)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===eo)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===no)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===io)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===so)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ro)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===oo)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ao)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===co)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===lo)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===ho)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===uo)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===fo)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===po)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===mo)return o===le?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===go||n===_o||n===vo)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===go)return o===le?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===_o)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===vo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xo||n===Mo||n===yo||n===So)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===xo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Mo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===yo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===So)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Gi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}const z0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,B0=`
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

}`;class k0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new ll(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Cn({vertexShader:z0,fragmentShader:B0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new P(new Ge(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class V0 extends bi{constructor(t,e){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,f=null,g=null;const v=typeof XRWebGLBinding<"u",m=new k0,p={},S=e.getContextAttributes();let M=null,_=null;const R=[],w=[],T=new vt;let C=null;const x=new Ye;x.viewport=new ve;const b=new Ye;b.viewport=new ve;const L=[x,b],B=new od;let W=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(et){let $=R[et];return $===void 0&&($=new gr,R[et]=$),$.getTargetRaySpace()},this.getControllerGrip=function(et){let $=R[et];return $===void 0&&($=new gr,R[et]=$),$.getGripSpace()},this.getHand=function(et){let $=R[et];return $===void 0&&($=new gr,R[et]=$),$.getHandSpace()};function j(et){const $=w.indexOf(et.inputSource);if($===-1)return;const Ct=R[$];Ct!==void 0&&(Ct.update(et.inputSource,et.frame,l||o),Ct.dispatchEvent({type:et.type,data:et.inputSource}))}function Z(){s.removeEventListener("select",j),s.removeEventListener("selectstart",j),s.removeEventListener("selectend",j),s.removeEventListener("squeeze",j),s.removeEventListener("squeezestart",j),s.removeEventListener("squeezeend",j),s.removeEventListener("end",Z),s.removeEventListener("inputsourceschange",it);for(let et=0;et<R.length;et++){const $=w[et];$!==null&&(w[et]=null,R[et].disconnect($))}W=null,J=null,m.reset();for(const et in p)delete p[et];t.setRenderTarget(M),f=null,d=null,u=null,s=null,_=null,te.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(T.width,T.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(et){r=et,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(et){a=et,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(et){l=et},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(et){if(s=et,s!==null){if(M=t.getRenderTarget(),s.addEventListener("select",j),s.addEventListener("selectstart",j),s.addEventListener("selectend",j),s.addEventListener("squeeze",j),s.addEventListener("squeezestart",j),s.addEventListener("squeezeend",j),s.addEventListener("end",Z),s.addEventListener("inputsourceschange",it),S.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(T),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ct=null,Dt=null,Pt=null;S.depth&&(Pt=S.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Ct=S.stencil?Xi:Wi,Dt=S.stencil?Gi:jn);const Wt={colorFormat:e.RGBA8,depthFormat:Pt,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(Wt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),_=new Jn(d.textureWidth,d.textureHeight,{format:Ke,type:nn,depthTexture:new cl(d.textureWidth,d.textureHeight,Dt,void 0,void 0,void 0,void 0,void 0,void 0,Ct),stencilBuffer:S.stencil,colorSpace:t.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const Ct={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(s,e,Ct),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Jn(f.framebufferWidth,f.framebufferHeight,{format:Ke,type:nn,colorSpace:t.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),te.setContext(s),te.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function it(et){for(let $=0;$<et.removed.length;$++){const Ct=et.removed[$],Dt=w.indexOf(Ct);Dt>=0&&(w[Dt]=null,R[Dt].disconnect(Ct))}for(let $=0;$<et.added.length;$++){const Ct=et.added[$];let Dt=w.indexOf(Ct);if(Dt===-1){for(let Wt=0;Wt<R.length;Wt++)if(Wt>=w.length){w.push(Ct),Dt=Wt;break}else if(w[Wt]===null){w[Wt]=Ct,Dt=Wt;break}if(Dt===-1)break}const Pt=R[Dt];Pt&&Pt.connect(Ct)}}const F=new D,pt=new D;function yt(et,$,Ct){F.setFromMatrixPosition($.matrixWorld),pt.setFromMatrixPosition(Ct.matrixWorld);const Dt=F.distanceTo(pt),Pt=$.projectionMatrix.elements,Wt=Ct.projectionMatrix.elements,ee=Pt[14]/(Pt[10]-1),I=Pt[14]/(Pt[10]+1),lt=(Pt[9]+1)/Pt[5],rt=(Pt[9]-1)/Pt[5],tt=(Pt[8]-1)/Pt[0],nt=(Wt[8]+1)/Wt[0],_t=ee*tt,ht=ee*nt,gt=Dt/(-tt+nt),Ht=gt*-tt;if($.matrixWorld.decompose(et.position,et.quaternion,et.scale),et.translateX(Ht),et.translateZ(gt),et.matrixWorld.compose(et.position,et.quaternion,et.scale),et.matrixWorldInverse.copy(et.matrixWorld).invert(),Pt[10]===-1)et.projectionMatrix.copy($.projectionMatrix),et.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const zt=ee+gt,A=I+gt,y=_t-Ht,G=ht+(Dt-Ht),q=lt*I/A*zt,ct=rt*I/A*zt;et.projectionMatrix.makePerspective(y,G,q,ct,zt,A),et.projectionMatrixInverse.copy(et.projectionMatrix).invert()}}function Rt(et,$){$===null?et.matrixWorld.copy(et.matrix):et.matrixWorld.multiplyMatrices($.matrixWorld,et.matrix),et.matrixWorldInverse.copy(et.matrixWorld).invert()}this.updateCamera=function(et){if(s===null)return;let $=et.near,Ct=et.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(Ct=m.depthFar)),B.near=b.near=x.near=$,B.far=b.far=x.far=Ct,(W!==B.near||J!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),W=B.near,J=B.far),B.layers.mask=et.layers.mask|6,x.layers.mask=B.layers.mask&3,b.layers.mask=B.layers.mask&5;const Dt=et.parent,Pt=B.cameras;Rt(B,Dt);for(let Wt=0;Wt<Pt.length;Wt++)Rt(Pt[Wt],Dt);Pt.length===2?yt(B,x,b):B.projectionMatrix.copy(x.projectionMatrix),Mt(et,B,Dt)};function Mt(et,$,Ct){Ct===null?et.matrix.copy($.matrixWorld):(et.matrix.copy(Ct.matrixWorld),et.matrix.invert(),et.matrix.multiply($.matrixWorld)),et.matrix.decompose(et.position,et.quaternion,et.scale),et.updateMatrixWorld(!0),et.projectionMatrix.copy($.projectionMatrix),et.projectionMatrixInverse.copy($.projectionMatrixInverse),et.isPerspectiveCamera&&(et.fov=qi*2*Math.atan(1/et.projectionMatrix.elements[5]),et.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(d===null&&f===null))return c},this.setFoveation=function(et){c=et,d!==null&&(d.fixedFoveation=et),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=et)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(et){return p[et]};let Zt=null;function ie(et,$){if(h=$.getViewerPose(l||o),g=$,h!==null){const Ct=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Dt=!1;Ct.length!==B.cameras.length&&(B.cameras.length=0,Dt=!0);for(let I=0;I<Ct.length;I++){const lt=Ct[I];let rt=null;if(f!==null)rt=f.getViewport(lt);else{const nt=u.getViewSubImage(d,lt);rt=nt.viewport,I===0&&(t.setRenderTargetTextures(_,nt.colorTexture,nt.depthStencilTexture),t.setRenderTarget(_))}let tt=L[I];tt===void 0&&(tt=new Ye,tt.layers.enable(I),tt.viewport=new ve,L[I]=tt),tt.matrix.fromArray(lt.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray(lt.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(rt.x,rt.y,rt.width,rt.height),I===0&&(B.matrix.copy(tt.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Dt===!0&&B.cameras.push(tt)}const Pt=s.enabledFeatures;if(Pt&&Pt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=n.getBinding();const I=u.getDepthInformation(Ct[0]);I&&I.isValid&&I.texture&&m.init(I,s.renderState)}if(Pt&&Pt.includes("camera-access")&&v){t.state.unbindTexture(),u=n.getBinding();for(let I=0;I<Ct.length;I++){const lt=Ct[I].camera;if(lt){let rt=p[lt];rt||(rt=new ll,p[lt]=rt);const tt=u.getCameraImage(lt);rt.sourceTexture=tt}}}}for(let Ct=0;Ct<R.length;Ct++){const Dt=w[Ct],Pt=R[Ct];Dt!==null&&Pt!==void 0&&Pt.update(Dt,$,l||o)}Zt&&Zt(et,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),g=null}const te=new xl;te.setAnimationLoop(ie),this.setAnimationLoop=function(et){Zt=et},this.dispose=function(){}}}const On=new vn,H0=new ge;function G0(i,t){function e(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,sl(i)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function s(m,p,S,M,_){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,_)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),v(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?c(m,p,S,M):p.isSpriteMaterial?l(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,e(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ue&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,e(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ue&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,e(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,e(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);const S=t.get(p),M=S.envMap,_=S.envMapRotation;M&&(m.envMap.value=M,On.copy(_),On.x*=-1,On.y*=-1,On.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(On.y*=-1,On.z*=-1),m.envMapRotation.value.setFromMatrix4(H0.makeRotationFromEuler(On)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function c(m,p,S,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=M*.5,p.map&&(m.map.value=p.map,e(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function l(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,e(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,e(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ue&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function v(m,p){const S=t.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function W0(i,t,e,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(S,M){const _=M.program;n.uniformBlockBinding(S,_)}function l(S,M){let _=s[S.id];_===void 0&&(g(S),_=h(S),s[S.id]=_,S.addEventListener("dispose",m));const R=M.program;n.updateUBOMapping(S,R);const w=t.render.frame;r[S.id]!==w&&(d(S),r[S.id]=w)}function h(S){const M=u();S.__bindingPointIndex=M;const _=i.createBuffer(),R=S.__size,w=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,_),i.bufferData(i.UNIFORM_BUFFER,R,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,_),_}function u(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const M=s[S.id],_=S.uniforms,R=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let w=0,T=_.length;w<T;w++){const C=Array.isArray(_[w])?_[w]:[_[w]];for(let x=0,b=C.length;x<b;x++){const L=C[x];if(f(L,w,x,R)===!0){const B=L.__offset,W=Array.isArray(L.value)?L.value:[L.value];let J=0;for(let j=0;j<W.length;j++){const Z=W[j],it=v(Z);typeof Z=="number"||typeof Z=="boolean"?(L.__data[0]=Z,i.bufferSubData(i.UNIFORM_BUFFER,B+J,L.__data)):Z.isMatrix3?(L.__data[0]=Z.elements[0],L.__data[1]=Z.elements[1],L.__data[2]=Z.elements[2],L.__data[3]=0,L.__data[4]=Z.elements[3],L.__data[5]=Z.elements[4],L.__data[6]=Z.elements[5],L.__data[7]=0,L.__data[8]=Z.elements[6],L.__data[9]=Z.elements[7],L.__data[10]=Z.elements[8],L.__data[11]=0):(Z.toArray(L.__data,J),J+=it.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,L.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function f(S,M,_,R){const w=S.value,T=M+"_"+_;if(R[T]===void 0)return typeof w=="number"||typeof w=="boolean"?R[T]=w:R[T]=w.clone(),!0;{const C=R[T];if(typeof w=="number"||typeof w=="boolean"){if(C!==w)return R[T]=w,!0}else if(C.equals(w)===!1)return C.copy(w),!0}return!1}function g(S){const M=S.uniforms;let _=0;const R=16;for(let T=0,C=M.length;T<C;T++){const x=Array.isArray(M[T])?M[T]:[M[T]];for(let b=0,L=x.length;b<L;b++){const B=x[b],W=Array.isArray(B.value)?B.value:[B.value];for(let J=0,j=W.length;J<j;J++){const Z=W[J],it=v(Z),F=_%R,pt=F%it.boundary,yt=F+pt;_+=pt,yt!==0&&R-yt<it.storage&&(_+=R-yt),B.__data=new Float32Array(it.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=_,_+=it.storage}}}const w=_%R;return w>0&&(_+=R-w),S.__size=_,S.__cache={},this}function v(S){const M={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(M.boundary=4,M.storage=4):S.isVector2?(M.boundary=8,M.storage=8):S.isVector3||S.isColor?(M.boundary=16,M.storage=12):S.isVector4?(M.boundary=16,M.storage=16):S.isMatrix3?(M.boundary=48,M.storage=48):S.isMatrix4?(M.boundary=64,M.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),M}function m(S){const M=S.target;M.removeEventListener("dispose",m);const _=o.indexOf(M.__bindingPointIndex);o.splice(_,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function p(){for(const S in s)i.deleteBuffer(s[S]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class X0{constructor(t={}){const{canvas:e=Vh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1}=t;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;const g=new Uint32Array(4),v=new Int32Array(4);let m=null,p=null;const S=[],M=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=An,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const _=this;let R=!1;this._outputColorSpace=Be;let w=0,T=0,C=null,x=-1,b=null;const L=new ve,B=new ve;let W=null;const J=new Qt(0);let j=0,Z=e.width,it=e.height,F=1,pt=null,yt=null;const Rt=new ve(0,0,Z,it),Mt=new ve(0,0,Z,it);let Zt=!1;const ie=new qo;let te=!1,et=!1;const $=new ge,Ct=new D,Dt=new ve,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Wt=!1;function ee(){return C===null?F:1}let I=n;function lt(E,V){return e.getContext(E,V)}try{const E={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${No}`),e.addEventListener("webglcontextlost",xt,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",ut,!1),I===null){const V="webgl2";if(I=lt(V,E),I===null)throw lt(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let rt,tt,nt,_t,ht,gt,Ht,zt,A,y,G,q,ct,K,k,O,Q,mt,st,Tt,Vt,Ft,bt,qt;function z(){rt=new em(I),rt.init(),Ft=new O0(I,rt),tt=new jp(I,rt,t,Ft),nt=new N0(I,rt),tt.reversedDepthBuffer&&d&&nt.buffers.depth.setReversed(!0),_t=new sm(I),ht=new S0,gt=new F0(I,rt,nt,ht,tt,Ft,_t),Ht=new Kp(_),zt=new tm(_),A=new ld(I),bt=new qp(I,A),y=new nm(I,A,_t,bt),G=new om(I,y,A,_t),st=new rm(I,tt,gt),O=new Jp(ht),q=new y0(_,Ht,zt,rt,tt,bt,O),ct=new G0(_,ht),K=new E0,k=new P0(rt),mt=new Xp(_,Ht,zt,nt,G,f,c),Q=new D0(_,G,tt),qt=new W0(I,_t,tt,nt),Tt=new Yp(I,rt,_t),Vt=new im(I,rt,_t),_t.programs=q.programs,_.capabilities=tt,_.extensions=rt,_.properties=ht,_.renderLists=K,_.shadowMap=Q,_.state=nt,_.info=_t}z();const ft=new V0(_,I);this.xr=ft,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const E=rt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=rt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return F},this.setPixelRatio=function(E){E!==void 0&&(F=E,this.setSize(Z,it,!1))},this.getSize=function(E){return E.set(Z,it)},this.setSize=function(E,V,X=!0){if(ft.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=E,it=V,e.width=Math.floor(E*F),e.height=Math.floor(V*F),X===!0&&(e.style.width=E+"px",e.style.height=V+"px"),this.setViewport(0,0,E,V)},this.getDrawingBufferSize=function(E){return E.set(Z*F,it*F).floor()},this.setDrawingBufferSize=function(E,V,X){Z=E,it=V,F=X,e.width=Math.floor(E*X),e.height=Math.floor(V*X),this.setViewport(0,0,E,V)},this.getCurrentViewport=function(E){return E.copy(L)},this.getViewport=function(E){return E.copy(Rt)},this.setViewport=function(E,V,X,Y){E.isVector4?Rt.set(E.x,E.y,E.z,E.w):Rt.set(E,V,X,Y),nt.viewport(L.copy(Rt).multiplyScalar(F).round())},this.getScissor=function(E){return E.copy(Mt)},this.setScissor=function(E,V,X,Y){E.isVector4?Mt.set(E.x,E.y,E.z,E.w):Mt.set(E,V,X,Y),nt.scissor(B.copy(Mt).multiplyScalar(F).round())},this.getScissorTest=function(){return Zt},this.setScissorTest=function(E){nt.setScissorTest(Zt=E)},this.setOpaqueSort=function(E){pt=E},this.setTransparentSort=function(E){yt=E},this.getClearColor=function(E){return E.copy(mt.getClearColor())},this.setClearColor=function(){mt.setClearColor(...arguments)},this.getClearAlpha=function(){return mt.getClearAlpha()},this.setClearAlpha=function(){mt.setClearAlpha(...arguments)},this.clear=function(E=!0,V=!0,X=!0){let Y=0;if(E){let H=!1;if(C!==null){const dt=C.texture.format;H=dt===Ho||dt===Vo||dt===ko}if(H){const dt=C.texture.type,wt=dt===nn||dt===jn||dt===Hi||dt===Gi||dt===Oo||dt===zo,Ut=mt.getClearColor(),Lt=mt.getClearAlpha(),kt=Ut.r,Gt=Ut.g,Ot=Ut.b;wt?(g[0]=kt,g[1]=Gt,g[2]=Ot,g[3]=Lt,I.clearBufferuiv(I.COLOR,0,g)):(v[0]=kt,v[1]=Gt,v[2]=Ot,v[3]=Lt,I.clearBufferiv(I.COLOR,0,v))}else Y|=I.COLOR_BUFFER_BIT}V&&(Y|=I.DEPTH_BUFFER_BIT),X&&(Y|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",xt,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",ut,!1),mt.dispose(),K.dispose(),k.dispose(),ht.dispose(),Ht.dispose(),zt.dispose(),G.dispose(),bt.dispose(),qt.dispose(),q.dispose(),ft.dispose(),ft.removeEventListener("sessionstart",Ze),ft.removeEventListener("sessionend",na),Pn.stop()};function xt(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),R=!0}function It(){console.log("THREE.WebGLRenderer: Context Restored."),R=!1;const E=_t.autoReset,V=Q.enabled,X=Q.autoUpdate,Y=Q.needsUpdate,H=Q.type;z(),_t.autoReset=E,Q.enabled=V,Q.autoUpdate=X,Q.needsUpdate=Y,Q.type=H}function ut(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function at(E){const V=E.target;V.removeEventListener("dispose",at),Nt(V)}function Nt(E){Xt(E),ht.remove(E)}function Xt(E){const V=ht.get(E).programs;V!==void 0&&(V.forEach(function(X){q.releaseProgram(X)}),E.isShaderMaterial&&q.releaseShaderCache(E))}this.renderBufferDirect=function(E,V,X,Y,H,dt){V===null&&(V=Pt);const wt=H.isMesh&&H.matrixWorld.determinant()<0,Ut=Dl(E,V,X,Y,H);nt.setMaterial(Y,wt);let Lt=X.index,kt=1;if(Y.wireframe===!0){if(Lt=y.getWireframeAttribute(X),Lt===void 0)return;kt=2}const Gt=X.drawRange,Ot=X.attributes.position;let $t=Gt.start*kt,ce=(Gt.start+Gt.count)*kt;dt!==null&&($t=Math.max($t,dt.start*kt),ce=Math.min(ce,(dt.start+dt.count)*kt)),Lt!==null?($t=Math.max($t,0),ce=Math.min(ce,Lt.count)):Ot!=null&&($t=Math.max($t,0),ce=Math.min(ce,Ot.count));const _e=ce-$t;if(_e<0||_e===1/0)return;bt.setup(H,Y,Ut,X,Lt);let de,he=Tt;if(Lt!==null&&(de=A.get(Lt),he=Vt,he.setIndex(de)),H.isMesh)Y.wireframe===!0?(nt.setLineWidth(Y.wireframeLinewidth*ee()),he.setMode(I.LINES)):he.setMode(I.TRIANGLES);else if(H.isLine){let Bt=Y.linewidth;Bt===void 0&&(Bt=1),nt.setLineWidth(Bt*ee()),H.isLineSegments?he.setMode(I.LINES):H.isLineLoop?he.setMode(I.LINE_LOOP):he.setMode(I.LINE_STRIP)}else H.isPoints?he.setMode(I.POINTS):H.isSprite&&he.setMode(I.TRIANGLES);if(H.isBatchedMesh)if(H._multiDrawInstances!==null)Yi("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),he.renderMultiDrawInstances(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount,H._multiDrawInstances);else if(rt.get("WEBGL_multi_draw"))he.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{const Bt=H._multiDrawStarts,fe=H._multiDrawCounts,se=H._multiDrawCount,Ne=Lt?A.get(Lt).bytesPerElement:1,$n=ht.get(Y).currentProgram.getUniforms();for(let Fe=0;Fe<se;Fe++)$n.setValue(I,"_gl_DrawID",Fe),he.render(Bt[Fe]/Ne,fe[Fe])}else if(H.isInstancedMesh)he.renderInstances($t,_e,H.count);else if(X.isInstancedBufferGeometry){const Bt=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,fe=Math.min(X.instanceCount,Bt);he.renderInstances($t,_e,fe)}else he.render($t,_e)};function ue(E,V,X){E.transparent===!0&&E.side===je&&E.forceSinglePass===!1?(E.side=Ue,E.needsUpdate=!0,ns(E,V,X),E.side=_n,E.needsUpdate=!0,ns(E,V,X),E.side=je):ns(E,V,X)}this.compile=function(E,V,X=null){X===null&&(X=E),p=k.get(X),p.init(V),M.push(p),X.traverseVisible(function(H){H.isLight&&H.layers.test(V.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),E!==X&&E.traverseVisible(function(H){H.isLight&&H.layers.test(V.layers)&&(p.pushLight(H),H.castShadow&&p.pushShadow(H))}),p.setupLights();const Y=new Set;return E.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;const dt=H.material;if(dt)if(Array.isArray(dt))for(let wt=0;wt<dt.length;wt++){const Ut=dt[wt];ue(Ut,X,H),Y.add(Ut)}else ue(dt,X,H),Y.add(dt)}),p=M.pop(),Y},this.compileAsync=function(E,V,X=null){const Y=this.compile(E,V,X);return new Promise(H=>{function dt(){if(Y.forEach(function(wt){ht.get(wt).currentProgram.isReady()&&Y.delete(wt)}),Y.size===0){H(E);return}setTimeout(dt,10)}rt.get("KHR_parallel_shader_compile")!==null?dt():setTimeout(dt,10)})};let ae=null;function on(E){ae&&ae(E)}function Ze(){Pn.stop()}function na(){Pn.start()}const Pn=new xl;Pn.setAnimationLoop(on),typeof self<"u"&&Pn.setContext(self),this.setAnimationLoop=function(E){ae=E,ft.setAnimationLoop(E),E===null?Pn.stop():Pn.start()},ft.addEventListener("sessionstart",Ze),ft.addEventListener("sessionend",na),this.render=function(E,V){if(V!==void 0&&V.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),ft.enabled===!0&&ft.isPresenting===!0&&(ft.cameraAutoUpdate===!0&&ft.updateCamera(V),V=ft.getCamera()),E.isScene===!0&&E.onBeforeRender(_,E,V,C),p=k.get(E,M.length),p.init(V),M.push(p),$.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),ie.setFromProjectionMatrix($,tn,V.reversedDepth),et=this.localClippingEnabled,te=O.init(this.clippingPlanes,et),m=K.get(E,S.length),m.init(),S.push(m),ft.enabled===!0&&ft.isPresenting===!0){const dt=_.xr.getDepthSensingMesh();dt!==null&&Ys(dt,V,-1/0,_.sortObjects)}Ys(E,V,0,_.sortObjects),m.finish(),_.sortObjects===!0&&m.sort(pt,yt),Wt=ft.enabled===!1||ft.isPresenting===!1||ft.hasDepthSensing()===!1,Wt&&mt.addToRenderList(m,E),this.info.render.frame++,te===!0&&O.beginShadows();const X=p.state.shadowsArray;Q.render(X,E,V),te===!0&&O.endShadows(),this.info.autoReset===!0&&this.info.reset();const Y=m.opaque,H=m.transmissive;if(p.setupLights(),V.isArrayCamera){const dt=V.cameras;if(H.length>0)for(let wt=0,Ut=dt.length;wt<Ut;wt++){const Lt=dt[wt];sa(Y,H,E,Lt)}Wt&&mt.render(E);for(let wt=0,Ut=dt.length;wt<Ut;wt++){const Lt=dt[wt];ia(m,E,Lt,Lt.viewport)}}else H.length>0&&sa(Y,H,E,V),Wt&&mt.render(E),ia(m,E,V);C!==null&&T===0&&(gt.updateMultisampleRenderTarget(C),gt.updateRenderTargetMipmap(C)),E.isScene===!0&&E.onAfterRender(_,E,V),bt.resetDefaultState(),x=-1,b=null,M.pop(),M.length>0?(p=M[M.length-1],te===!0&&O.setGlobalState(_.clippingPlanes,p.state.camera)):p=null,S.pop(),S.length>0?m=S[S.length-1]:m=null};function Ys(E,V,X,Y){if(E.visible===!1)return;if(E.layers.test(V.layers)){if(E.isGroup)X=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(V);else if(E.isLight)p.pushLight(E),E.castShadow&&p.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||ie.intersectsSprite(E)){Y&&Dt.setFromMatrixPosition(E.matrixWorld).applyMatrix4($);const wt=G.update(E),Ut=E.material;Ut.visible&&m.push(E,wt,Ut,X,Dt.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||ie.intersectsObject(E))){const wt=G.update(E),Ut=E.material;if(Y&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Dt.copy(E.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),Dt.copy(wt.boundingSphere.center)),Dt.applyMatrix4(E.matrixWorld).applyMatrix4($)),Array.isArray(Ut)){const Lt=wt.groups;for(let kt=0,Gt=Lt.length;kt<Gt;kt++){const Ot=Lt[kt],$t=Ut[Ot.materialIndex];$t&&$t.visible&&m.push(E,wt,$t,X,Dt.z,Ot)}}else Ut.visible&&m.push(E,wt,Ut,X,Dt.z,null)}}const dt=E.children;for(let wt=0,Ut=dt.length;wt<Ut;wt++)Ys(dt[wt],V,X,Y)}function ia(E,V,X,Y){const H=E.opaque,dt=E.transmissive,wt=E.transparent;p.setupLightsView(X),te===!0&&O.setGlobalState(_.clippingPlanes,X),Y&&nt.viewport(L.copy(Y)),H.length>0&&es(H,V,X),dt.length>0&&es(dt,V,X),wt.length>0&&es(wt,V,X),nt.buffers.depth.setTest(!0),nt.buffers.depth.setMask(!0),nt.buffers.color.setMask(!0),nt.setPolygonOffset(!1)}function sa(E,V,X,Y){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[Y.id]===void 0&&(p.state.transmissionRenderTarget[Y.id]=new Jn(1,1,{generateMipmaps:!0,type:rt.has("EXT_color_buffer_half_float")||rt.has("EXT_color_buffer_float")?$i:nn,minFilter:Wn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:oe.workingColorSpace}));const dt=p.state.transmissionRenderTarget[Y.id],wt=Y.viewport||L;dt.setSize(wt.z*_.transmissionResolutionScale,wt.w*_.transmissionResolutionScale);const Ut=_.getRenderTarget(),Lt=_.getActiveCubeFace(),kt=_.getActiveMipmapLevel();_.setRenderTarget(dt),_.getClearColor(J),j=_.getClearAlpha(),j<1&&_.setClearColor(16777215,.5),_.clear(),Wt&&mt.render(X);const Gt=_.toneMapping;_.toneMapping=An;const Ot=Y.viewport;if(Y.viewport!==void 0&&(Y.viewport=void 0),p.setupLightsView(Y),te===!0&&O.setGlobalState(_.clippingPlanes,Y),es(E,X,Y),gt.updateMultisampleRenderTarget(dt),gt.updateRenderTargetMipmap(dt),rt.has("WEBGL_multisampled_render_to_texture")===!1){let $t=!1;for(let ce=0,_e=V.length;ce<_e;ce++){const de=V[ce],he=de.object,Bt=de.geometry,fe=de.material,se=de.group;if(fe.side===je&&he.layers.test(Y.layers)){const Ne=fe.side;fe.side=Ue,fe.needsUpdate=!0,ra(he,X,Y,Bt,fe,se),fe.side=Ne,fe.needsUpdate=!0,$t=!0}}$t===!0&&(gt.updateMultisampleRenderTarget(dt),gt.updateRenderTargetMipmap(dt))}_.setRenderTarget(Ut,Lt,kt),_.setClearColor(J,j),Ot!==void 0&&(Y.viewport=Ot),_.toneMapping=Gt}function es(E,V,X){const Y=V.isScene===!0?V.overrideMaterial:null;for(let H=0,dt=E.length;H<dt;H++){const wt=E[H],Ut=wt.object,Lt=wt.geometry,kt=wt.group;let Gt=wt.material;Gt.allowOverride===!0&&Y!==null&&(Gt=Y),Ut.layers.test(X.layers)&&ra(Ut,V,X,Lt,Gt,kt)}}function ra(E,V,X,Y,H,dt){E.onBeforeRender(_,V,X,Y,H,dt),E.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),H.onBeforeRender(_,V,X,Y,E,dt),H.transparent===!0&&H.side===je&&H.forceSinglePass===!1?(H.side=Ue,H.needsUpdate=!0,_.renderBufferDirect(X,V,Y,H,E,dt),H.side=_n,H.needsUpdate=!0,_.renderBufferDirect(X,V,Y,H,E,dt),H.side=je):_.renderBufferDirect(X,V,Y,H,E,dt),E.onAfterRender(_,V,X,Y,H,dt)}function ns(E,V,X){V.isScene!==!0&&(V=Pt);const Y=ht.get(E),H=p.state.lights,dt=p.state.shadowsArray,wt=H.state.version,Ut=q.getParameters(E,H.state,dt,V,X),Lt=q.getProgramCacheKey(Ut);let kt=Y.programs;Y.environment=E.isMeshStandardMaterial?V.environment:null,Y.fog=V.fog,Y.envMap=(E.isMeshStandardMaterial?zt:Ht).get(E.envMap||Y.environment),Y.envMapRotation=Y.environment!==null&&E.envMap===null?V.environmentRotation:E.envMapRotation,kt===void 0&&(E.addEventListener("dispose",at),kt=new Map,Y.programs=kt);let Gt=kt.get(Lt);if(Gt!==void 0){if(Y.currentProgram===Gt&&Y.lightsStateVersion===wt)return aa(E,Ut),Gt}else Ut.uniforms=q.getUniforms(E),E.onBeforeCompile(Ut,_),Gt=q.acquireProgram(Ut,Lt),kt.set(Lt,Gt),Y.uniforms=Ut.uniforms;const Ot=Y.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ot.clippingPlanes=O.uniform),aa(E,Ut),Y.needsLights=Nl(E),Y.lightsStateVersion=wt,Y.needsLights&&(Ot.ambientLightColor.value=H.state.ambient,Ot.lightProbe.value=H.state.probe,Ot.directionalLights.value=H.state.directional,Ot.directionalLightShadows.value=H.state.directionalShadow,Ot.spotLights.value=H.state.spot,Ot.spotLightShadows.value=H.state.spotShadow,Ot.rectAreaLights.value=H.state.rectArea,Ot.ltc_1.value=H.state.rectAreaLTC1,Ot.ltc_2.value=H.state.rectAreaLTC2,Ot.pointLights.value=H.state.point,Ot.pointLightShadows.value=H.state.pointShadow,Ot.hemisphereLights.value=H.state.hemi,Ot.directionalShadowMap.value=H.state.directionalShadowMap,Ot.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ot.spotShadowMap.value=H.state.spotShadowMap,Ot.spotLightMatrix.value=H.state.spotLightMatrix,Ot.spotLightMap.value=H.state.spotLightMap,Ot.pointShadowMap.value=H.state.pointShadowMap,Ot.pointShadowMatrix.value=H.state.pointShadowMatrix),Y.currentProgram=Gt,Y.uniformsList=null,Gt}function oa(E){if(E.uniformsList===null){const V=E.currentProgram.getUniforms();E.uniformsList=Ds.seqWithValue(V.seq,E.uniforms)}return E.uniformsList}function aa(E,V){const X=ht.get(E);X.outputColorSpace=V.outputColorSpace,X.batching=V.batching,X.batchingColor=V.batchingColor,X.instancing=V.instancing,X.instancingColor=V.instancingColor,X.instancingMorph=V.instancingMorph,X.skinning=V.skinning,X.morphTargets=V.morphTargets,X.morphNormals=V.morphNormals,X.morphColors=V.morphColors,X.morphTargetsCount=V.morphTargetsCount,X.numClippingPlanes=V.numClippingPlanes,X.numIntersection=V.numClipIntersection,X.vertexAlphas=V.vertexAlphas,X.vertexTangents=V.vertexTangents,X.toneMapping=V.toneMapping}function Dl(E,V,X,Y,H){V.isScene!==!0&&(V=Pt),gt.resetTextureUnits();const dt=V.fog,wt=Y.isMeshStandardMaterial?V.environment:null,Ut=C===null?_.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Mi,Lt=(Y.isMeshStandardMaterial?zt:Ht).get(Y.envMap||wt),kt=Y.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,Gt=!!X.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ot=!!X.morphAttributes.position,$t=!!X.morphAttributes.normal,ce=!!X.morphAttributes.color;let _e=An;Y.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(_e=_.toneMapping);const de=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,he=de!==void 0?de.length:0,Bt=ht.get(Y),fe=p.state.lights;if(te===!0&&(et===!0||E!==b)){const Re=E===b&&Y.id===x;O.setState(Y,E,Re)}let se=!1;Y.version===Bt.__version?(Bt.needsLights&&Bt.lightsStateVersion!==fe.state.version||Bt.outputColorSpace!==Ut||H.isBatchedMesh&&Bt.batching===!1||!H.isBatchedMesh&&Bt.batching===!0||H.isBatchedMesh&&Bt.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&Bt.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&Bt.instancing===!1||!H.isInstancedMesh&&Bt.instancing===!0||H.isSkinnedMesh&&Bt.skinning===!1||!H.isSkinnedMesh&&Bt.skinning===!0||H.isInstancedMesh&&Bt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&Bt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&Bt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&Bt.instancingMorph===!1&&H.morphTexture!==null||Bt.envMap!==Lt||Y.fog===!0&&Bt.fog!==dt||Bt.numClippingPlanes!==void 0&&(Bt.numClippingPlanes!==O.numPlanes||Bt.numIntersection!==O.numIntersection)||Bt.vertexAlphas!==kt||Bt.vertexTangents!==Gt||Bt.morphTargets!==Ot||Bt.morphNormals!==$t||Bt.morphColors!==ce||Bt.toneMapping!==_e||Bt.morphTargetsCount!==he)&&(se=!0):(se=!0,Bt.__version=Y.version);let Ne=Bt.currentProgram;se===!0&&(Ne=ns(Y,V,H));let $n=!1,Fe=!1,Ai=!1;const pe=Ne.getUniforms(),ke=Bt.uniforms;if(nt.useProgram(Ne.program)&&($n=!0,Fe=!0,Ai=!0),Y.id!==x&&(x=Y.id,Fe=!0),$n||b!==E){nt.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),pe.setValue(I,"projectionMatrix",E.projectionMatrix),pe.setValue(I,"viewMatrix",E.matrixWorldInverse);const De=pe.map.cameraPosition;De!==void 0&&De.setValue(I,Ct.setFromMatrixPosition(E.matrixWorld)),tt.logarithmicDepthBuffer&&pe.setValue(I,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&pe.setValue(I,"isOrthographic",E.isOrthographicCamera===!0),b!==E&&(b=E,Fe=!0,Ai=!0)}if(H.isSkinnedMesh){pe.setOptional(I,H,"bindMatrix"),pe.setOptional(I,H,"bindMatrixInverse");const Re=H.skeleton;Re&&(Re.boneTexture===null&&Re.computeBoneTexture(),pe.setValue(I,"boneTexture",Re.boneTexture,gt))}H.isBatchedMesh&&(pe.setOptional(I,H,"batchingTexture"),pe.setValue(I,"batchingTexture",H._matricesTexture,gt),pe.setOptional(I,H,"batchingIdTexture"),pe.setValue(I,"batchingIdTexture",H._indirectTexture,gt),pe.setOptional(I,H,"batchingColorTexture"),H._colorsTexture!==null&&pe.setValue(I,"batchingColorTexture",H._colorsTexture,gt));const Ve=X.morphAttributes;if((Ve.position!==void 0||Ve.normal!==void 0||Ve.color!==void 0)&&st.update(H,X,Ne),(Fe||Bt.receiveShadow!==H.receiveShadow)&&(Bt.receiveShadow=H.receiveShadow,pe.setValue(I,"receiveShadow",H.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(ke.envMap.value=Lt,ke.flipEnvMap.value=Lt.isCubeTexture&&Lt.isRenderTargetTexture===!1?-1:1),Y.isMeshStandardMaterial&&Y.envMap===null&&V.environment!==null&&(ke.envMapIntensity.value=V.environmentIntensity),Fe&&(pe.setValue(I,"toneMappingExposure",_.toneMappingExposure),Bt.needsLights&&Ul(ke,Ai),dt&&Y.fog===!0&&ct.refreshFogUniforms(ke,dt),ct.refreshMaterialUniforms(ke,Y,F,it,p.state.transmissionRenderTarget[E.id]),Ds.upload(I,oa(Bt),ke,gt)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Ds.upload(I,oa(Bt),ke,gt),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&pe.setValue(I,"center",H.center),pe.setValue(I,"modelViewMatrix",H.modelViewMatrix),pe.setValue(I,"normalMatrix",H.normalMatrix),pe.setValue(I,"modelMatrix",H.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const Re=Y.uniformsGroups;for(let De=0,js=Re.length;De<js;De++){const Ln=Re[De];qt.update(Ln,Ne),qt.bind(Ln,Ne)}}return Ne}function Ul(E,V){E.ambientLightColor.needsUpdate=V,E.lightProbe.needsUpdate=V,E.directionalLights.needsUpdate=V,E.directionalLightShadows.needsUpdate=V,E.pointLights.needsUpdate=V,E.pointLightShadows.needsUpdate=V,E.spotLights.needsUpdate=V,E.spotLightShadows.needsUpdate=V,E.rectAreaLights.needsUpdate=V,E.hemisphereLights.needsUpdate=V}function Nl(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(E,V,X){const Y=ht.get(E);Y.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,Y.__autoAllocateDepthBuffer===!1&&(Y.__useRenderToTexture=!1),ht.get(E.texture).__webglTexture=V,ht.get(E.depthTexture).__webglTexture=Y.__autoAllocateDepthBuffer?void 0:X,Y.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,V){const X=ht.get(E);X.__webglFramebuffer=V,X.__useDefaultFramebuffer=V===void 0};const Fl=I.createFramebuffer();this.setRenderTarget=function(E,V=0,X=0){C=E,w=V,T=X;let Y=!0,H=null,dt=!1,wt=!1;if(E){const Lt=ht.get(E);if(Lt.__useDefaultFramebuffer!==void 0)nt.bindFramebuffer(I.FRAMEBUFFER,null),Y=!1;else if(Lt.__webglFramebuffer===void 0)gt.setupRenderTarget(E);else if(Lt.__hasExternalTextures)gt.rebindTextures(E,ht.get(E.texture).__webglTexture,ht.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Ot=E.depthTexture;if(Lt.__boundDepthTexture!==Ot){if(Ot!==null&&ht.has(Ot)&&(E.width!==Ot.image.width||E.height!==Ot.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");gt.setupDepthRenderbuffer(E)}}const kt=E.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(wt=!0);const Gt=ht.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Gt[V])?H=Gt[V][X]:H=Gt[V],dt=!0):E.samples>0&&gt.useMultisampledRTT(E)===!1?H=ht.get(E).__webglMultisampledFramebuffer:Array.isArray(Gt)?H=Gt[X]:H=Gt,L.copy(E.viewport),B.copy(E.scissor),W=E.scissorTest}else L.copy(Rt).multiplyScalar(F).floor(),B.copy(Mt).multiplyScalar(F).floor(),W=Zt;if(X!==0&&(H=Fl),nt.bindFramebuffer(I.FRAMEBUFFER,H)&&Y&&nt.drawBuffers(E,H),nt.viewport(L),nt.scissor(B),nt.setScissorTest(W),dt){const Lt=ht.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+V,Lt.__webglTexture,X)}else if(wt){const Lt=V;for(let kt=0;kt<E.textures.length;kt++){const Gt=ht.get(E.textures[kt]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+kt,Gt.__webglTexture,X,Lt)}}else if(E!==null&&X!==0){const Lt=ht.get(E.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Lt.__webglTexture,X)}x=-1},this.readRenderTargetPixels=function(E,V,X,Y,H,dt,wt,Ut=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Lt=ht.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&wt!==void 0&&(Lt=Lt[wt]),Lt){nt.bindFramebuffer(I.FRAMEBUFFER,Lt);try{const kt=E.textures[Ut],Gt=kt.format,Ot=kt.type;if(!tt.textureFormatReadable(Gt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!tt.textureTypeReadable(Ot)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=E.width-Y&&X>=0&&X<=E.height-H&&(E.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ut),I.readPixels(V,X,Y,H,Ft.convert(Gt),Ft.convert(Ot),dt))}finally{const kt=C!==null?ht.get(C).__webglFramebuffer:null;nt.bindFramebuffer(I.FRAMEBUFFER,kt)}}},this.readRenderTargetPixelsAsync=async function(E,V,X,Y,H,dt,wt,Ut=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Lt=ht.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&wt!==void 0&&(Lt=Lt[wt]),Lt)if(V>=0&&V<=E.width-Y&&X>=0&&X<=E.height-H){nt.bindFramebuffer(I.FRAMEBUFFER,Lt);const kt=E.textures[Ut],Gt=kt.format,Ot=kt.type;if(!tt.textureFormatReadable(Gt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!tt.textureTypeReadable(Ot))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const $t=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,$t),I.bufferData(I.PIXEL_PACK_BUFFER,dt.byteLength,I.STREAM_READ),E.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+Ut),I.readPixels(V,X,Y,H,Ft.convert(Gt),Ft.convert(Ot),0);const ce=C!==null?ht.get(C).__webglFramebuffer:null;nt.bindFramebuffer(I.FRAMEBUFFER,ce);const _e=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Hh(I,_e,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,$t),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,dt),I.deleteBuffer($t),I.deleteSync(_e),dt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,V=null,X=0){const Y=Math.pow(2,-X),H=Math.floor(E.image.width*Y),dt=Math.floor(E.image.height*Y),wt=V!==null?V.x:0,Ut=V!==null?V.y:0;gt.setTexture2D(E,0),I.copyTexSubImage2D(I.TEXTURE_2D,X,0,0,wt,Ut,H,dt),nt.unbindTexture()};const Ol=I.createFramebuffer(),zl=I.createFramebuffer();this.copyTextureToTexture=function(E,V,X=null,Y=null,H=0,dt=null){dt===null&&(H!==0?(Yi("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),dt=H,H=0):dt=0);let wt,Ut,Lt,kt,Gt,Ot,$t,ce,_e;const de=E.isCompressedTexture?E.mipmaps[dt]:E.image;if(X!==null)wt=X.max.x-X.min.x,Ut=X.max.y-X.min.y,Lt=X.isBox3?X.max.z-X.min.z:1,kt=X.min.x,Gt=X.min.y,Ot=X.isBox3?X.min.z:0;else{const Ve=Math.pow(2,-H);wt=Math.floor(de.width*Ve),Ut=Math.floor(de.height*Ve),E.isDataArrayTexture?Lt=de.depth:E.isData3DTexture?Lt=Math.floor(de.depth*Ve):Lt=1,kt=0,Gt=0,Ot=0}Y!==null?($t=Y.x,ce=Y.y,_e=Y.z):($t=0,ce=0,_e=0);const he=Ft.convert(V.format),Bt=Ft.convert(V.type);let fe;V.isData3DTexture?(gt.setTexture3D(V,0),fe=I.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(gt.setTexture2DArray(V,0),fe=I.TEXTURE_2D_ARRAY):(gt.setTexture2D(V,0),fe=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,V.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,V.unpackAlignment);const se=I.getParameter(I.UNPACK_ROW_LENGTH),Ne=I.getParameter(I.UNPACK_IMAGE_HEIGHT),$n=I.getParameter(I.UNPACK_SKIP_PIXELS),Fe=I.getParameter(I.UNPACK_SKIP_ROWS),Ai=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,de.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,de.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,kt),I.pixelStorei(I.UNPACK_SKIP_ROWS,Gt),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ot);const pe=E.isDataArrayTexture||E.isData3DTexture,ke=V.isDataArrayTexture||V.isData3DTexture;if(E.isDepthTexture){const Ve=ht.get(E),Re=ht.get(V),De=ht.get(Ve.__renderTarget),js=ht.get(Re.__renderTarget);nt.bindFramebuffer(I.READ_FRAMEBUFFER,De.__webglFramebuffer),nt.bindFramebuffer(I.DRAW_FRAMEBUFFER,js.__webglFramebuffer);for(let Ln=0;Ln<Lt;Ln++)pe&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ht.get(E).__webglTexture,H,Ot+Ln),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ht.get(V).__webglTexture,dt,_e+Ln)),I.blitFramebuffer(kt,Gt,wt,Ut,$t,ce,wt,Ut,I.DEPTH_BUFFER_BIT,I.NEAREST);nt.bindFramebuffer(I.READ_FRAMEBUFFER,null),nt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(H!==0||E.isRenderTargetTexture||ht.has(E)){const Ve=ht.get(E),Re=ht.get(V);nt.bindFramebuffer(I.READ_FRAMEBUFFER,Ol),nt.bindFramebuffer(I.DRAW_FRAMEBUFFER,zl);for(let De=0;De<Lt;De++)pe?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ve.__webglTexture,H,Ot+De):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ve.__webglTexture,H),ke?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Re.__webglTexture,dt,_e+De):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Re.__webglTexture,dt),H!==0?I.blitFramebuffer(kt,Gt,wt,Ut,$t,ce,wt,Ut,I.COLOR_BUFFER_BIT,I.NEAREST):ke?I.copyTexSubImage3D(fe,dt,$t,ce,_e+De,kt,Gt,wt,Ut):I.copyTexSubImage2D(fe,dt,$t,ce,kt,Gt,wt,Ut);nt.bindFramebuffer(I.READ_FRAMEBUFFER,null),nt.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else ke?E.isDataTexture||E.isData3DTexture?I.texSubImage3D(fe,dt,$t,ce,_e,wt,Ut,Lt,he,Bt,de.data):V.isCompressedArrayTexture?I.compressedTexSubImage3D(fe,dt,$t,ce,_e,wt,Ut,Lt,he,de.data):I.texSubImage3D(fe,dt,$t,ce,_e,wt,Ut,Lt,he,Bt,de):E.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,dt,$t,ce,wt,Ut,he,Bt,de.data):E.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,dt,$t,ce,de.width,de.height,he,de.data):I.texSubImage2D(I.TEXTURE_2D,dt,$t,ce,wt,Ut,he,Bt,de);I.pixelStorei(I.UNPACK_ROW_LENGTH,se),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Ne),I.pixelStorei(I.UNPACK_SKIP_PIXELS,$n),I.pixelStorei(I.UNPACK_SKIP_ROWS,Fe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ai),dt===0&&V.generateMipmaps&&I.generateMipmap(fe),nt.unbindTexture()},this.initRenderTarget=function(E){ht.get(E).__webglFramebuffer===void 0&&gt.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?gt.setTextureCube(E,0):E.isData3DTexture?gt.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?gt.setTexture2DArray(E,0):gt.setTexture2D(E,0),nt.unbindTexture()},this.resetState=function(){w=0,T=0,C=null,nt.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}}class q0{camera;pitch=Yn.degToRad(34);distance=60;yaw=Math.PI/4;targetYaw=Math.PI/4;viewSize=13;targetViewSize=13;focus=new D;desired=new D;aspect=1;constructor(){this.camera=new Qo(-1,1,1,-1,.1,200),this.resize(window.innerWidth,window.innerHeight)}resize(t,e){this.aspect=t/Math.max(1,e),this.applyFrustum()}applyFrustum(){const t=this.viewSize/2,e=t*this.aspect;this.camera.left=-e,this.camera.right=e,this.camera.top=t,this.camera.bottom=-t,this.camera.updateProjectionMatrix()}rotate(t){this.targetYaw+=Math.PI/4*Math.sign(t)}zoomBy(t){this.targetViewSize=Yn.clamp(this.targetViewSize+t,4,26)}get angle(){return this.yaw}get currentViewSize(){return this.viewSize}setViewSize(t){this.targetViewSize=Math.max(3,t)}snapTo(t){this.focus.copy(t),this.yaw=this.targetYaw,this.viewSize=this.targetViewSize,this.applyFrustum(),this.place()}update(t,e){const n=1-Math.pow(.001,t);this.focus.lerp(e,n),this.yaw+=(this.targetYaw-this.yaw)*Math.min(1,t*7),Math.abs(this.targetViewSize-this.viewSize)>.001&&(this.viewSize+=(this.targetViewSize-this.viewSize)*Math.min(1,t*7),this.applyFrustum()),this.place()}place(){const t=Math.max(0,this.viewSize-14)*.38,e=this.focus.y+t,n=Math.cos(this.pitch);this.desired.set(this.focus.x+Math.sin(this.yaw)*n*this.distance,e+Math.sin(this.pitch)*this.distance,this.focus.z+Math.cos(this.yaw)*n*this.distance),this.camera.position.copy(this.desired),this.camera.lookAt(this.focus.x,e,this.focus.z)}screenToWorld(t,e,n){const s=Math.sin(this.yaw),r=Math.cos(this.yaw);return n.set(t*r-e*s,0,-t*s-e*r),n}}class Y0{constructor(t){this.surface=t,window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("blur",this.onBlur),t.addEventListener("pointerdown",this.onPointerDown),t.addEventListener("pointermove",this.onPointerMove),t.addEventListener("pointerup",this.onPointerUp),t.addEventListener("pointercancel",this.onPointerUp)}down=new Set;pressed=new Set;stickX=0;stickY=0;stickId=null;stickOrigin={x:0,y:0};blocked=!1;onKeyDown=t=>{const e=t.code;(j0.has(e)||J0.has(e))&&t.preventDefault(),this.down.has(e)||this.pressed.add(e),this.down.add(e)};onKeyUp=t=>{this.down.delete(t.code)};onBlur=()=>{this.down.clear(),this.stickId=null,this.stickX=0,this.stickY=0};onPointerDown=t=>{t.pointerType!=="mouse"&&(this.stickId=t.pointerId,this.stickOrigin={x:t.clientX,y:t.clientY},this.surface.setPointerCapture(t.pointerId))};onPointerMove=t=>{if(t.pointerId!==this.stickId)return;const e=60,n=Math.max(-e,Math.min(e,t.clientX-this.stickOrigin.x)),s=Math.max(-e,Math.min(e,t.clientY-this.stickOrigin.y));this.stickX=n/e,this.stickY=s/e};onPointerUp=t=>{t.pointerId===this.stickId&&(this.stickId=null,this.stickX=0,this.stickY=0)};move(){if(this.blocked)return{x:0,y:0};let t=this.stickX,e=-this.stickY;(this.down.has("KeyA")||this.down.has("ArrowLeft"))&&(t-=1),(this.down.has("KeyD")||this.down.has("ArrowRight"))&&(t+=1),(this.down.has("KeyW")||this.down.has("ArrowUp"))&&(e+=1),(this.down.has("KeyS")||this.down.has("ArrowDown"))&&(e-=1);const n=Math.hypot(t,e);return n>1&&(t/=n,e/=n),{x:t,y:e}}isDown(t){return this.down.has(t)}justPressed(t){return this.pressed.has(t)}tapAction(){this.pressed.add("KeyE")}tapSwap(){this.pressed.add("KeyT")}setVirtualDown(t,e){e?(this.down.has(t)||this.pressed.add(t),this.down.add(t)):this.down.delete(t)}endFrame(){this.pressed.clear()}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("blur",this.onBlur)}}const j0=new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]),J0=new Set(["Space","KeyE","KeyQ","KeyR","KeyJ","KeyT","KeyF"]),mc="aristory.save.v1",Rr={version:1,scene:"",flags:{},memories:[],stats:{}};class ea{data;constructor(){this.data=ea.read()}static read(){try{const t=localStorage.getItem(mc);if(!t)return structuredClone(Rr);const e=JSON.parse(t);return{version:1,scene:e.scene??"",flags:e.flags??{},memories:e.memories??[],stats:e.stats??{}}}catch{return structuredClone(Rr)}}persist(){try{localStorage.setItem(mc,JSON.stringify(this.data))}catch{}}get scene(){return this.data.scene}set scene(t){this.data.scene=t,this.persist()}flag(t){return this.data.flags[t]===!0}setFlag(t,e=!0){this.data.flags[t]=e,this.persist()}bump(t,e=1){return this.data.stats[t]=(this.data.stats[t]??0)+e,this.persist(),this.data.stats[t]}stat(t){return this.data.stats[t]??0}get memories(){return this.data.memories}hasMemory(t){return this.data.memories.some(e=>e.id===t)}addMemory(t){return this.hasMemory(t.id)?!1:(this.data.memories.push({...t,at:Date.now()}),this.persist(),!0)}reset(){this.data=structuredClone(Rr),this.persist()}}class K0{boot;card;prompt;dialogue;dialogueWho;dialogueText;next;toasts;journal;journalGrid;hints;veil;escolhas;carga;advance=null;escolher=null;selecionada=0;typing=null;cardTimer=null;onTouchAction=null;onTouchSwap=null;onTouchHold=null;constructor(t){const e=document.createElement("div");e.id="ui",e.innerHTML=`
      <div class="veil"></div>
      <div class="scene-card"><b></b><span></span></div>
      <div class="toasts"></div>
      <div class="hints">
        <div>WASD / setas — andar</div>
        <div>E ou espaço — interagir</div>
        <div>T — trocar de personagem</div>
        <div>Q / R — girar a câmera · J — diário</div>
      </div>
      <div class="carga"><div class="barra"></div></div>
      <div class="prompt"><span class="icon">✨</span><span class="label"></span><span class="key">E</span></div>
      <div class="dialogue"><span class="who"></span><p class="text"></p><div class="escolhas"></div><span class="next">clique / E ▸</span></div>
      <div class="journal"><div class="sheet">
        <h2>Diário de memórias</h2>
        <p class="sub">Os momentos que a gente já viveu — e os que ainda faltam.</p>
        <div class="grid"></div>
        <button class="close">fechar</button>
      </div></div>
      <div class="touch">
        <button class="action-btn" aria-label="interagir">✨</button>
        <button class="swap-btn" aria-label="trocar de personagem">🔁</button>
        <button class="journal-btn" aria-label="diário">📖</button>
      </div>
    `,t.appendChild(e);const n=document.createElement("div");n.className="boot",n.innerHTML="<h1>AriStory</h1><p>montando o mundo…</p>",t.appendChild(n),this.boot=n,this.card=e.querySelector(".scene-card"),this.prompt=e.querySelector(".prompt"),this.dialogue=e.querySelector(".dialogue"),this.dialogueWho=e.querySelector(".dialogue .who"),this.dialogueText=e.querySelector(".dialogue .text"),this.next=e.querySelector(".dialogue .next"),this.toasts=e.querySelector(".toasts"),this.journal=e.querySelector(".journal"),this.journalGrid=e.querySelector(".journal .grid"),this.hints=e.querySelector(".hints"),this.veil=e.querySelector(".veil"),this.escolhas=e.querySelector(".escolhas"),this.carga=e.querySelector(".carga"),this.dialogue.addEventListener("click",r=>{r.target.closest(".escolhas")||this.advance?.()}),window.addEventListener("keydown",this.navegarEscolha),e.querySelector(".journal .close").addEventListener("click",()=>this.closeJournal()),this.journal.addEventListener("click",r=>{r.target===this.journal&&this.closeJournal()});const s=e.querySelector(".action-btn");s.addEventListener("click",()=>{this.dialogueOpen?this.advance?.():this.onTouchAction?.()}),s.addEventListener("pointerdown",()=>this.onTouchHold?.(!0));for(const r of["pointerup","pointercancel","pointerleave"])s.addEventListener(r,()=>this.onTouchHold?.(!1));e.querySelector(".swap-btn").addEventListener("click",()=>this.onTouchSwap?.()),e.querySelector(".journal-btn").addEventListener("click",()=>this.toggleJournal()),matchMedia("(hover: none)").matches&&document.body.classList.add("touch-device"),window.setTimeout(()=>this.hints.classList.add("hide"),12e3)}hideBoot(){this.boot.classList.add("gone"),window.setTimeout(()=>this.boot.remove(),700)}fade(t){return this.veil.classList.toggle("on",t),new Promise(e=>window.setTimeout(e,360))}sceneCard(t,e=""){this.card.querySelector("b").textContent=t,this.card.querySelector("span").textContent=e,this.card.classList.add("show"),this.cardTimer&&window.clearTimeout(this.cardTimer),this.cardTimer=window.setTimeout(()=>this.card.classList.remove("show"),2600)}showPrompt(t,e){this.prompt.querySelector(".icon").textContent=t,this.prompt.querySelector(".label").textContent=e,this.prompt.classList.add("show")}hidePrompt(){this.prompt.classList.remove("show")}showCharge(t){if(t===null){this.carga.classList.remove("show");return}this.carga.classList.add("show");const e=this.carga.querySelector(".barra");e.style.width=`${Math.max(0,Math.min(1,t))*100}%`}toast(t,e="💛"){const n=document.createElement("div");n.className="toast",n.innerHTML=`<span>${e}</span><span></span>`,n.querySelector("span:last-child").textContent=t,this.toasts.appendChild(n),window.setTimeout(()=>n.classList.add("fade"),2600),window.setTimeout(()=>n.remove(),3200)}get dialogueOpen(){return this.dialogue.classList.contains("show")}say(t,e=""){return new Promise(n=>{let s=0;this.dialogueWho.textContent=e,this.dialogueWho.style.display=e?"":"none",this.dialogue.classList.add("show");const r=()=>{this.type(t[s])};this.advance=()=>{if(this.typing!==null){window.clearInterval(this.typing),this.typing=null,this.dialogueText.textContent=t[s];return}if(s+=1,s>=t.length){this.dialogue.classList.remove("show"),this.advance=null,n();return}r()},r()})}type(t){this.typing!==null&&window.clearInterval(this.typing),this.dialogueText.textContent="";let e=0;this.typing=window.setInterval(()=>{e+=1,this.dialogueText.textContent=t.slice(0,e),e>=t.length&&(window.clearInterval(this.typing),this.typing=null)},18)}ask(t,e,n=""){return new Promise(s=>{this.dialogueWho.textContent=n,this.dialogueWho.style.display=n?"":"none",this.dialogue.classList.add("show"),this.next.style.display="none",this.type(t),this.escolhas.innerHTML="",this.selecionada=0,this.escolher=r=>{this.escolher=null,this.advance=null,this.escolhas.innerHTML="",this.escolhas.classList.remove("show"),this.next.style.display="",this.dialogue.classList.remove("show"),s(r)},e.forEach((r,o)=>{const a=document.createElement("button");a.type="button",a.textContent=r,a.addEventListener("click",()=>this.escolher?.(o)),this.escolhas.appendChild(a)}),this.escolhas.classList.add("show"),this.marcarEscolha(),this.advance=()=>this.escolher?.(this.selecionada)})}marcarEscolha(){[...this.escolhas.querySelectorAll("button")].forEach((e,n)=>e.classList.toggle("sel",n===this.selecionada))}navegarEscolha=t=>{if(!this.escolher)return;const e=this.escolhas.childElementCount;e!==0&&(t.code==="ArrowLeft"||t.code==="KeyA"?(this.selecionada=(this.selecionada-1+e)%e,this.marcarEscolha()):(t.code==="ArrowRight"||t.code==="KeyD")&&(this.selecionada=(this.selecionada+1)%e,this.marcarEscolha()))};handleAction(){return this.dialogueOpen?(this.advance?.(),!0):!1}setMemories(t){if(t.length===0){this.journalGrid.innerHTML='<p class="empty">Ainda vazio. Explore os cenários e interaja com as coisas — cada momento vira uma memória aqui.</p>';return}this.journalGrid.innerHTML="";for(const e of t){const n=document.createElement("div");n.className="memory",n.innerHTML='<div class="icon"></div><b></b><small></small><p></p>',n.querySelector(".icon").textContent=e.icon,n.querySelector("b").textContent=e.title,n.querySelector("small").textContent=e.place,n.querySelector("p").textContent=e.note,this.journalGrid.appendChild(n)}}get journalOpen(){return this.journal.classList.contains("show")}toggleJournal(){this.journalOpen?this.closeJournal():this.journal.classList.add("show")}closeJournal(){this.journal.classList.remove("show")}}function El(i,t,e){for(const n of e)if(n.kind==="circle"){const s=i.x-n.x,r=i.z-n.z,o=t+n.r,a=s*s+r*r;if(a>=o*o||a===0)continue;const c=Math.sqrt(a),l=(o-c)/c;i.x+=s*l,i.z+=r*l}else{const s=Math.cos(-n.rot),r=Math.sin(-n.rot),o=i.x-n.x,a=i.z-n.z,c=o*s-a*r,l=o*r+a*s,h=Math.max(-n.hw,Math.min(n.hw,c)),u=Math.max(-n.hd,Math.min(n.hd,l));let d=c-h,f=l-u,g=d*d+f*f;if(g>t*t)continue;if(g===0){const S=n.hw-Math.abs(c),M=n.hd-Math.abs(l);S<M?(d=Math.sign(c)||1,f=0,g=0):(d=0,f=Math.sign(l)||1);const _=d!==0?Math.sign(d)*(n.hw+t):c,R=f!==0?Math.sign(f)*(n.hd+t):l;i.x=n.x+(_*Math.cos(n.rot)-R*Math.sin(n.rot)),i.z=n.z+(_*Math.sin(n.rot)+R*Math.cos(n.rot));continue}const v=Math.sqrt(g),m=h+d/v*t,p=u+f/v*t;i.x=n.x+(m*Math.cos(n.rot)-p*Math.sin(n.rot)),i.z=n.z+(m*Math.sin(n.rot)+p*Math.cos(n.rot))}}function wl(i,t,e){i.x=Math.max(e.minX+t,Math.min(e.maxX-t,i.x)),i.z=Math.max(e.minZ+t,Math.min(e.maxZ-t,i.z))}class Z0{object=new Et;position;radius=.42;maxSpeed=4.4;accel=26;friction=18;velocity=new D;body;locked=!1;riding=!1;submersion=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,n=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=n,t.setFacing(n),this.object.add(t.group),this.body=t,e}get chest(){return new D(this.position.x,this.position.y+1,this.position.z)}teleport(t,e,n=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.body.group.rotation.y=n,this.body.setFacing(n)}setVisible(t){this.object.visible=t}update(t,e,n,s){if(this.riding){this.body.update(e,0);return}const r=this.submersion>.05,o=r?this.maxSpeed*.55:this.maxSpeed;if(!this.locked&&t.lengthSq()>1e-4){const c=t.clone().normalize();this.velocity.x+=c.x*this.accel*e,this.velocity.z+=c.z*this.accel*e;const l=Math.hypot(this.velocity.x,this.velocity.z);l>o&&(this.velocity.x=this.velocity.x/l*o,this.velocity.z=this.velocity.z/l*o),this.body.setFacing(Math.atan2(c.x,c.z))}else{const c=Math.max(0,1-this.friction*e/Math.max(.001,this.velocity.length()));this.velocity.multiplyScalar(c),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0)}this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,El(this.position,this.radius,n),wl(this.position,this.radius,s),this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(r),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}class $0{object=new Et;position;radius=.4;maxSpeed=5;velocity=new D;dir=new D;body;folga=2;ordem=null;riding=!1;submersion=0;constructor(t){this.body=t,this.object.add(t.group),this.position=this.object.position}get rig(){return this.body}get name(){return this.body.spec.name}swapRig(t){const e=this.body,n=e.group.rotation.y;return this.object.remove(e.group),t.group.rotation.y=n,t.setFacing(n),this.object.add(t.group),this.body=t,e}teleport(t,e,n=0){this.position.set(t,0,e),this.velocity.set(0,0,0),this.submersion=0,this.ordem=null,this.body.group.rotation.y=n,this.body.setFacing(n)}setVisible(t){this.object.visible=t}goTo(t,e){this.ordem=new D(t,0,e)}clearOrder(){this.ordem=null}get hasOrder(){return this.ordem!==null}update(t,e,n,s){if(this.riding){this.body.update(e,0);return}const r=this.ordem??t,o=this.ordem?.55:this.folga;this.dir.set(r.x-this.position.x,0,r.z-this.position.z);const a=this.dir.length();if(!this.ordem&&a>22){this.teleport(r.x-1.2,r.z-1.2,Math.atan2(this.dir.x,this.dir.z));return}if(a>o){this.dir.normalize();const d=Math.min(this.maxSpeed,1.6+(a-o)*2.2);this.velocity.x+=(this.dir.x*d-this.velocity.x)*Math.min(1,e*7),this.velocity.z+=(this.dir.z*d-this.velocity.z)*Math.min(1,e*7),this.body.setFacing(Math.atan2(this.dir.x,this.dir.z))}else this.velocity.multiplyScalar(Math.max(0,1-e*9)),this.velocity.lengthSq()<4e-4&&this.velocity.set(0,0,0),a>.2&&this.body.setFacing(Math.atan2(this.dir.x,this.dir.z));this.position.x+=this.velocity.x*e,this.position.z+=this.velocity.z*e,El(this.position,this.radius,n),wl(this.position,this.radius,s);const c=this.position.x-t.x,l=this.position.z-t.z,h=Math.hypot(c,l),u=.86;if(h<u&&h>1e-4){const d=(u-h)/h;this.position.x+=c*d,this.position.z+=l*d}this.body.group.position.y=-this.submersion*.72,this.body.setSwimming(this.submersion>.05),this.body.update(e,Math.hypot(this.velocity.x,this.velocity.z))}}let zn=null;function Q0(){if(!zn){const i=new Uint8Array([96,166,214,255]);zn=new pu(i,i.length,1,Bo),zn.minFilter=Ie,zn.magFilter=Ie,zn.generateMipmaps=!1,zn.needsUpdate=!0}return zn}const gc=new Map;function N(i,t={}){const e=`${i}|${t.glow??0}|${t.opacity??1}|${t.doubleSide?1:0}|${t.offset??0}`,n=gc.get(e);if(n)return n;const s=new $o({color:i,gradientMap:Q0(),transparent:(t.opacity??1)<1,opacity:t.opacity??1,side:t.doubleSide?je:_n});return t.glow&&(s.emissive=new Qt(i),s.emissiveIntensity=t.glow),t.offset&&(s.polygonOffset=!0,s.polygonOffsetFactor=-1,s.polygonOffsetUnits=-t.offset),gc.set(e,s),s}const _c=new Map;function Rn(i,t=1){const e=`${i}|${t}`,n=_c.get(e);if(n)return n;const s=new Vs({color:i,transparent:t<1,opacity:t,side:je});return _c.set(e,s),s}const vc=new Map;function xc(i){const t=vc.get(i);if(t)return t;const e=new al({color:i});return vc.set(i,e),e}const U={skyDay:9361151,skyDusk:16233866,grass:8308816,grassDark:6532414,sand:15127459,asphalt:7040886,concrete:13224130,water:5224152,trunk:9132587,leafLight:6799450,leafMid:5154376,leafDark:3834168,bush:6074447,flowerPink:16748465,flowerYellow:16767070,wood:11893050,woodDark:9067050,metalWhite:15922679,metalGrey:11121338,metalRed:14245951,glass:12183285,wallCream:15984595,wallMint:14085344,roofTile:12867391,fabricRed:14701130,fabricBlue:4882400,floorWood:13211484,rug:14258086,sofa:7180246,screen:2764602,plantPot:13666911,heart:16739211,gold:16763213,frisbee:16743001,morango:16748456,maracuja:16763213,chocolate:8014379,laranja:16751421,limao:13098578};function Co(i="redonda",t=1,e=.5){const n=new Et,s=2.1*t,r=new P(new At(.13*t,.2*t,s,8),N(U.trunk));if(r.position.y=s/2,n.add(r),i==="pinheiro")for(let o=0;o<3;o++){const a=(1.1-o*.26)*t,c=new P(new sn(a,1.3*t,9),N(o===0?U.leafDark:U.leafMid));c.position.y=s*.7+o*.72*t,n.add(c)}else if(i==="palmeira"){r.scale.y=1.5,r.position.y=s*.75;for(let o=0;o<7;o++){const a=o/7*Math.PI*2,c=new P(new Yt(.75*t,8,6),N(U.leafMid));c.scale.set(1.5,.14,.5),c.position.set(Math.cos(a)*.85*t,s*1.5-.1,Math.sin(a)*.85*t),c.rotation.y=-a,c.rotation.z=-.32,n.add(c)}}else{const o=i==="florida"?U.flowerPink:U.leafMid;[[0,s+.55*t,0,1.15],[.62*t,s+.15*t,.2*t,.78],[-.5*t,s+.3*t,-.35*t,.88],[.1*t,s+1.05*t,-.3*t,.66]].forEach(([c,l,h,u],d)=>{const f=new P(new Ws(u*t,1),N(d%2===0?o:i==="florida"?U.flowerPink:U.leafLight));f.position.set(c,l,h),f.rotation.set(e*3,e*5,e*2),n.add(f)})}return n}function Ro(i=1,t=U.bush){const e=new Et;for(let n=0;n<3;n++){const s=new P(new Ws(.42*i,1),N(t));s.position.set((n-1)*.36*i,.3*i+(n===1?.12:0),n%2*.18*i),e.add(s)}return e}function Tl(i=6,t=.9,e=[U.flowerPink,U.flowerYellow,16777215]){const n=new Et;for(let s=0;s<i;s++){const r=s/i*Math.PI*2+s*.7,o=t*(.35+s*37%100/140),a=new P(new At(.02,.02,.3,5),N(U.leafDark));a.position.set(Math.cos(r)*o,.15,Math.sin(r)*o),n.add(a);const c=new P(new Yt(.09,8,6),N(e[s%e.length]));c.position.set(Math.cos(r)*o,.33,Math.sin(r)*o),c.scale.y=.7,n.add(c)}return n}function tg(i=1){const t=new Et,e=new P(new Yo(.5*i,0),N(10133670));return e.position.y=.3*i,e.rotation.set(.4,.8,.2),e.scale.set(1,.75,1.1),t.add(e),t}function Al(i=U.wood){const t=new Et,e=new P(new ot(1.9,.1,.55),N(i));e.position.y=.48,t.add(e);const n=new P(new ot(1.9,.5,.09),N(i));n.position.set(0,.76,-.25),n.rotation.x=-.16,t.add(n);for(const s of[-1,1]){const r=new P(new ot(.1,.48,.5),N(U.metalGrey));r.position.set(s*.78,.24,0),t.add(r)}return t}function eg(i=!1){const t=new Et,e=new P(new At(.07,.09,3.4,8),N(U.metalGrey));e.position.y=1.7,t.add(e);const n=new P(new Yt(.3,12,10,0,Math.PI*2,0,Math.PI*.62),N(U.metalWhite));n.position.y=3.45,n.rotation.x=Math.PI,t.add(n);const s=new P(new Yt(.2,10,8),N(i?U.gold:15263968,{glow:i?.9:0}));return s.position.y=3.32,t.add(s),t}function ng(){const i=new Et,t=new P(new At(.28,.24,.75,10),N(5208650));t.position.y=.38,i.add(t);const e=new P(new ye(.29,.04,6,14),N(U.metalGrey));return e.position.y=.76,e.rotation.x=Math.PI/2,i.add(e),i}function ig(){const i=new Et,t=new P(new ot(1.9,.1,1),N(U.wood));t.position.y=.76,i.add(t);for(const e of[-1,1]){const n=new P(new ot(.1,.76,.9),N(U.woodDark));n.position.set(e*.75,.38,0),i.add(n);const s=new P(new ot(1.9,.08,.34),N(U.wood));s.position.set(0,.45,e*.78),i.add(s);const r=new P(new ot(1.6,.45,.08),N(U.woodDark));r.position.set(0,.22,e*.78),i.add(r)}return i}function fn(i=4,t=1.1,e=U.metalGrey){const n=new Et,s=Math.max(2,Math.round(i/1.2));for(let r=0;r<=s;r++){const o=new P(new At(.05,.05,t,6),N(e));o.position.set(-i/2+r/s*i,t/2,0),n.add(o)}for(const r of[t*.35,t*.8]){const o=new P(new ot(i,.06,.06),N(e));o.position.y=r,n.add(o)}return n}function sg(i=U.wood,t=U.metalWhite){const e=new Et,n=new P(new At(.06,.06,1.6,6),N(U.woodDark));n.position.y=.8,e.add(n);const s=new P(new ot(1.1,.7,.08),N(i));s.position.y=1.5,e.add(s);const r=new P(new ot(.85,.12,.02),N(t));return r.position.set(0,1.62,.05),e.add(r),e}function Cl(i=1){const t=new Et,e=Rn(16777215,.92),n=[[0,0,0,1.2],[1.1,-.16,.2,.85],[-1,-.2,-.1,.75],[.4,.5,-.2,.7]];for(const[s,r,o,a]of n){const c=new P(new Yt(a*i,10,8),e);c.position.set(s*i,r*i,o*i),t.add(c)}return t}function rg(i,t,e,n){const s=new Et,r=9,o=i/r,a=.35,c=1.15,l=new Et;l.rotation.z=Math.PI/2;for(let d=0;d<r;d++){const f=new P(new At(t,t,o*1.02,10,1,!0,a,c),N(d%2===0?e:n,{doubleSide:!0}));f.position.y=-i/2+o*(d+.5),l.add(f)}s.add(l);const h=Math.sin(a)*t,u=Math.cos(a)*t;for(let d=0;d<r;d++){const f=new P(new Yt(o*.36,8,6),N(d%2===0?e:n));f.position.set(-i/2+o*(d+.5),h-o*.2,u),f.scale.set(1,1.15,.7),s.add(f)}return s}function Po(i=U.fabricRed,t={}){const e=new Et,n=t.tipo??"simples",s=U.wallCream,r=N(U.wood),o=N(U.woodDark),a=new P(new ot(2.8,.16,1.9),o);a.position.y=.08,e.add(a);const c=new P(new ot(2.35,1.7,1.4),N(s));c.position.set(0,1.01,-.05),e.add(c);for(const M of[-1,1]){const _=new P(new ot(.26,1.7,.14),r);_.position.set(M*1.045,1.01,.68),e.add(_)}const l=new P(new ot(2.35,.22,.14),r);l.position.set(0,1.75,.68),e.add(l);const h=new P(new ot(1.82,.44,.06),N(5981750));h.position.set(0,1.42,.66),e.add(h);const u=new P(new ot(2.5,.14,.78),r);u.position.set(0,1.12,.94),e.add(u);const d=new P(new At(.075,.075,2.5,10),o);d.rotation.z=Math.PI/2,d.position.set(0,1.12,1.32),e.add(d);for(const M of[-1,1]){const _=new P(new At(.05,.05,1.05,8),N(U.metalWhite));_.position.set(M*1.18,.6,1.24),e.add(_)}const f=new P(new ot(2.55,.16,1.55),o);f.position.set(0,1.94,-.05),e.add(f);const g=rg(2.5,.44,i,s);g.position.set(0,1.54,.62),e.add(g);const v=t.texto??(n==="sorvete"?"Sorvete":n==="suco"?"Sucos":""),m=new P(new ot(1.75,.5,.12),N(i));m.position.set(0,2.3,-.05),e.add(m);const p=new P(new ot(1.9,.62,.08),N(s));if(p.position.set(0,2.3,-.09),e.add(p),v){const M=Pl(v,1.5,.34);M.position.set(0,2.3,.02),e.add(M)}if(n==="sorvete"){const M=Io(U.morango);M.scale.setScalar(2.6),M.position.set(0,2.78,-.05),e.add(M);const _=new P(new ot(1.24,.16,.56),N(U.metalWhite));_.position.set(-.58,1.26,1.06),e.add(_),[U.morango,U.maracuja,U.chocolate].forEach((w,T)=>{const C=new P(new At(.15,.13,.22,10),N(U.metalWhite));C.position.set(-1+T*.36,1.29,1.06),e.add(C);const x=new P(new Yt(.14,10,8),N(w));x.position.set(-1+T*.36,1.42,1.06),x.scale.y=.8,e.add(x)});for(let w=0;w<3;w++){const T=new P(new sn(.1,.3,10),N(14197852));T.position.set(.72,1.34+w*.07,1.04+w*.02),T.rotation.x=Math.PI,e.add(T)}}else if(n==="suco"){const M=new P(new Yt(.32,12,10),N(U.laranja));M.position.set(0,2.85,-.05),e.add(M);const _=new P(new Yt(.13,8,6),N(U.leafMid));_.position.set(.14,3.12,-.05),_.scale.set(1.5,.4,.8),_.rotation.z=.5,e.add(_),[U.laranja,U.limao].forEach((b,L)=>{const B=new P(new At(.15,.14,.42,12,1,!0),N(U.glass,{opacity:.45,doubleSide:!0}));B.position.set(-.78+L*.42,1.4,1.06),e.add(B);const W=new P(new At(.13,.12,.28,12),N(b));W.position.set(-.78+L*.42,1.33,1.06),e.add(W);const J=new P(new At(.025,.025,.12,6),N(U.metalGrey));J.position.set(-.78+L*.42,1.26,1.2),J.rotation.x=Math.PI/2,e.add(J)});const w=new P(new At(.22,.17,.12,12),N(U.plantPot));w.position.set(.42,1.25,1.06),e.add(w);const T=[[.32,1.34,1.03,U.laranja],[.52,1.34,1.08,U.limao],[.42,1.4,1.05,U.morango]];for(const[b,L,B,W]of T){const J=new P(new Yt(.1,10,8),N(W));J.position.set(b,L,B),e.add(J)}const C=new P(new At(.09,.07,.2,10),N(s));C.position.set(.95,1.29,1.06),e.add(C),[U.morango,U.limao,U.fabricBlue].forEach((b,L)=>{const B=new P(new At(.014,.014,.34,6),N(b));B.position.set(.93+L*.03,1.44,1.06-L*.02),B.rotation.z=(L-1)*.18,e.add(B)})}const S=new P(new ot(.06,.62,.5),N(3551276));S.position.set(1.2,1.3,.15),e.add(S);for(let M=0;M<3;M++){const _=new P(new ot(.02,.045,.3-M*.06),N(s));_.position.set(1.24,1.46-M*.16,.15),e.add(_)}return e}function Lo(i=4,t=6,e=4,n=U.wallCream,s=U.roofTile,r=U.glass){const o=new Et,a=new P(new ot(i,t,e),N(n));a.position.y=t/2,o.add(a);const c=new P(new ot(i+.3,.35,e+.3),N(s));c.position.y=t+.17,o.add(c);const l=Math.max(1,Math.floor(i/1.4)),h=Math.max(1,Math.floor(t/1.6));for(let u=0;u<h;u++)for(let d=0;d<l;d++){const f=new P(new ot(.65,.8,.06),N(r,{glow:.15})),g=-i/2+i/l*(d+.5),v=.9+t/h*u;f.position.set(g,v,e/2+.02),o.add(f);const m=f.clone();m.position.z=-e/2-.02,o.add(m)}return o}function og(i=U.frisbee){const t=new P(new At(.28,.24,.07,20),N(i));return t.castShadow=!0,t}function Rl(i=1){const t=new Et,e=N(U.heart,{glow:.35});for(const s of[-1,1]){const r=new P(new Yt(.16*i,10,8),e);r.position.set(s*.13*i,.1*i,0),t.add(r)}const n=new P(new sn(.22*i,.34*i,10),e);return n.position.y=-.1*i,n.rotation.x=Math.PI,t.add(n),t}function Pr(i=16184040){const t=new Et,e=new P(new Yt(.22,10,8),N(i));e.scale.set(1.3,.85,1),e.position.y=.12,t.add(e);const n=new P(new At(.06,.08,.24,8),N(i));n.position.set(0,.28,.14),t.add(n);const s=new P(new Yt(.11,10,8),N(i));s.position.set(0,.4,.16),t.add(s);const r=new P(new sn(.05,.14,6),N(U.gold));return r.position.set(0,.39,.28),r.rotation.x=Math.PI/2,t.add(r),t}function ag(){const i=new Et,t=new P(new ot(.34,.05,.34),N(U.frisbee));t.position.y=.025,i.add(t);const e=new P(new sn(.15,.45,10),N(U.frisbee));e.position.y=.26,i.add(e);const n=new P(new At(.1,.12,.09,10),N(16777215));return n.position.y=.28,i.add(n),i}function cg(i,t,e=1.5){const n=new Et,s=N(10475752),r=.12,o=new P(new ot(i,r,t),N(4165552));o.position.y=-e,o.receiveShadow=!0,n.add(o);for(const[a,c,l,h]of[[i,r,0,-t/2],[i,r,0,t/2],[r,t,-i/2,0],[r,t,i/2,0]]){const u=new P(new ot(a,e,c),s);u.position.set(l,-e/2,h),u.receiveShadow=!0,n.add(u)}for(const[a,c,l,h]of[[i+.3,.18,0,-t/2-.12],[i+.3,.18,0,t/2+.12],[.18,t+.3,-i/2-.12,0],[.18,t+.3,i/2+.12,0]]){const u=new P(new ot(a,.06,c),N(4951989));u.position.set(l,.02,h),n.add(u)}return n}function lg(i,t){const e=new P(new Ge(i,t,12,8),new $o({color:6276320,transparent:!0,opacity:.62}));return e.rotation.x=-Math.PI/2,e.position.y=-.12,e}function Mc(i=U.fabricBlue){const t=new Et,e=new P(new ot(.68,.07,1.7),N(U.metalWhite));e.position.y=.36,t.add(e);const n=new P(new ot(.6,.06,1.5),N(i));n.position.y=.42,t.add(n);const s=new P(new ot(.6,.06,.7),N(i));s.position.set(0,.6,-.75),s.rotation.x=-.75,t.add(s);for(const[r,o]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new P(new At(.035,.035,.36,6),N(U.metalWhite));a.position.set(r*.3,.18,o*.72),t.add(a)}return t}function yc(i=U.fabricRed){const t=new Et,e=new P(new At(.32,.36,.12,12),N(U.concrete));e.position.y=.06,t.add(e);const n=new P(new At(.045,.045,2.4,8),N(U.wood));n.position.y=1.2,t.add(n);const s=new P(new sn(1.15,.5,12),N(i));s.position.y=2.35,t.add(s);const r=new P(new sn(1.17,.18,12,1,!0),N(16777215,{doubleSide:!0}));r.position.y=2.2,t.add(r);const o=new P(new Yt(.07,8,6),N(U.gold));return o.position.y=2.62,t.add(o),t}function hg(){const i=new Et;for(const t of[-.24,.24]){const e=new P(new ye(.22,.035,6,14,Math.PI),N(U.metalGrey));e.position.set(t,.72,-.22),e.rotation.set(0,Math.PI/2,0),i.add(e);const n=new P(new At(.035,.035,1.5,8),N(U.metalGrey));n.position.set(t,.05,-.44),i.add(n)}for(let t=0;t<3;t++){const e=new P(new ot(.5,.05,.1),N(U.metalGrey));e.position.set(0,-.15-t*.34,-.44),i.add(e)}return i}function Lr(i=U.frisbee){const t=new Et,e=new P(new ye(.42,.16,10,20),N(i));e.rotation.x=Math.PI/2,t.add(e);for(let n=0;n<4;n++){const s=n/4*Math.PI*2+Math.PI/4,r=new P(new ye(.42,.165,10,6,Math.PI/5),N(16777215));r.rotation.set(Math.PI/2,0,s),t.add(r)}return t}function ug(){const i=new Et,t=new P(new At(.22,.26,.1,12),N(U.concrete));t.position.y=.05,i.add(t);const e=new P(new At(.05,.05,2.2,8),N(U.metalGrey));e.position.y=1.1,i.add(e);const n=new P(new ot(.5,.07,.07),N(U.metalGrey));n.position.set(.22,2.16,0),i.add(n);const s=new P(new At(.16,.12,.1,12),N(U.metalWhite));return s.position.set(.44,2.08,0),i.add(s),i}function dg(){const i=new Et,t=new P(new ot(.7,.8,.7),N(U.concrete));t.position.y=.4,i.add(t);const e=new P(new ot(.62,.1,2.4),N(15791350));e.position.set(0,.85,1),i.add(e);for(const n of[-.36,.36]){const s=new P(new ye(.35,.04,6,14,Math.PI),N(U.metalGrey));s.position.set(n,.9,.1),s.rotation.set(0,Math.PI/2,0),i.add(s)}return i}function Io(i=U.flowerPink){const t=new Et,e=new P(new sn(.075,.22,10),N(14197852));e.position.y=-.02,e.rotation.x=Math.PI,t.add(e);const n=new P(new Yt(.085,10,8),N(i));n.position.y=.13,t.add(n);const s=new P(new Yt(.06,8,7),N(i));return s.position.set(.03,.22,-.02),t.add(s),t}function Sc(i=U.metalGrey){const t=new Et,e=new P(new At(.07,.09,1.5,10),N(i));e.position.y=.75,t.add(e);const n=new P(new At(.52,.38,.42,14,1,!0),N(i));n.position.y=1,t.add(n);const s=new P(new ye(.62,.045,6,20),N(i));s.position.y=1.72,s.rotation.x=Math.PI/2,t.add(s);const r=new P(new At(.1,.1,.3,8),N(i));r.position.y=1.9,t.add(r);for(let o=0;o<10;o++){const a=o/10*Math.PI*2,c=new P(new At(.015,.015,.62,4),N(13226198));c.position.set(Math.cos(a)*.5,1.4,Math.sin(a)*.5),t.add(c)}return t}function fg(){const i=new Et;for(const n of[-.8,.8]){const s=new P(new ot(.12,1.5,.12),N(U.woodDark));s.position.set(n,.75,0),i.add(s)}const t=new P(new ot(2,1.2,.12),N(U.wood));t.position.y=2,i.add(t);const e=new P(new ot(1.8,.22,.03),N(U.frisbee));e.position.set(0,2.45,.08),i.add(e);for(const n of[-.45,.45]){const s=new P(new ot(.55,.6,.03),N(2830136));s.position.set(n,1.9,.08),i.add(s)}return i}function pg(i=4){const t=new Et;for(let e=0;e<3;e++){const n=new P(new ot(i,.16,.5),N(e%2===0?U.metalWhite:U.metalGrey));n.position.set(0,.25+e*.34,-e*.5),t.add(n);const s=new P(new ot(i,.25+e*.34,.1),N(U.metalGrey));s.position.set(0,(.25+e*.34)/2,-e*.5-.2),t.add(s)}return t}function mg(){const i=new Et,t=new P(new ot(.42,.95,.36),N(U.concrete));t.position.y=.48,i.add(t);const e=new P(new At(.17,.14,.12,12),N(U.metalWhite));e.position.set(0,1,.05),i.add(e);const n=new P(new At(.03,.03,.16,8),N(U.metalGrey));return n.position.set(0,1.12,-.06),n.rotation.x=.5,i.add(n),i}function gg(){const i=new Et,t=new P(new ot(.5,.4,.34),N(4871528));t.position.y=.2,i.add(t);const e=new P(new ye(.16,.028,6,14,Math.PI),N(3093568));return e.position.set(0,.42,0),e.rotation.y=Math.PI/2,i.add(e),[U.frisbee,6271190,16767070].forEach((s,r)=>{const o=new P(new At(.2,.18,.05,16),N(s));o.position.set(.34+r*.02,.06+r*.06,.22),o.rotation.z=.12,i.add(o)}),i}function _g(){const i=new Et,t=new P(new At(.1,.14,5.5,8),N(U.metalGrey));t.position.y=2.75,i.add(t);const e=new P(new ot(.9,.1,.1),N(U.metalGrey));e.position.set(.35,5.5,0),i.add(e);for(const n of[.1,.6]){const s=new P(new ot(.42,.3,.22),N(3883600));s.position.set(n,5.62,0),s.rotation.z=-.35,i.add(s);const r=new P(new ot(.36,.24,.03),N(16773324,{glow:.25}));r.position.set(n+.04,5.52,0),r.rotation.z=-.35,i.add(r)}return i}function vg(){const i=new Et,t=new P(new At(.05,.06,3,8),N(U.metalGrey));t.position.y=1.5,i.add(t);const e=new Et;return e.position.y=2.9,[U.frisbee,16777215,U.frisbee,16777215].forEach((s,r)=>{const o=.26-r*.04,a=.22-r*.04,c=new P(new At(o,a,.3,12,1,!0),N(s,{doubleSide:!0}));c.rotation.z=Math.PI/2,c.position.x=.2+r*.3,e.add(c)}),i.add(e),i.userData.manga=e,i}function Pl(i,t,e,n="#ffffff"){const s=document.createElement("canvas");s.width=384,s.height=Math.max(64,Math.round(384*e/t));const r=s.getContext("2d");r&&(r.clearRect(0,0,s.width,s.height),r.fillStyle=n,r.font=`bold ${Math.round(s.height*.62)}px ui-rounded, "Nunito", system-ui, sans-serif`,r.textAlign="center",r.textBaseline="middle",r.fillText(i,s.width/2,s.height/2+4));const o=new xu(s);return o.colorSpace=Be,new P(new Ge(t,e),new Vs({map:o,transparent:!0}))}function bc(i,t=U.fabricBlue,e="#ffffff"){const n=new Et,s=new P(new At(.08,.08,2.4,8),N(U.metalGrey));s.position.y=1.2,n.add(s);const r=2.1,o=.9,a=new P(new ot(r,o,.1),N(t));a.position.y=2.45,n.add(a);const c=new P(new ot(r+.12,o+.12,.06),N(U.metalWhite));c.position.set(0,2.45,-.03),n.add(c);const l=Pl(i,r*.86,o*.68,e);return l.position.set(0,2.45,.06),n.add(l),n}function xg(i=4161494){const t=new Et,e=8.4,n=2.6,s=2.5,r=new P(new ot(e,n,s),N(i));r.position.y=1.55,t.add(r);const o=new P(new ot(e-.2,.22,s-.15),N(U.metalWhite));o.position.y=2.9,t.add(o);const a=new P(new ot(e+.04,.3,s+.04),N(U.metalWhite));a.position.y=.6,t.add(a);for(const h of[s/2+.02,-s/2-.02])for(let u=0;u<4;u++){const d=new P(new ot(1.5,.9,.05),N(U.glass,{glow:.12}));d.position.set(-e/2+1.4+u*1.85,2.1,h),t.add(d)}for(const[h,u]of[[e/2+.02,0],[-e/2-.02,0]]){const d=new P(new ot(.05,1.1,s-.5),N(U.glass,{glow:.12}));d.position.set(h,2.1,0),d.rotation.y=u,t.add(d)}const c=new P(new ot(.06,1.9,1),N(2831424));c.position.set(e/2-1.6,1.2,s/2+.02),t.add(c);const l=new P(new ot(1.6,.34,.05),N(2040361));l.position.set(e/2-.4,2.75,s/2+.02),t.add(l);for(const[h,u]of[[e/2-1.9,s/2],[e/2-1.9,-s/2],[-e/2+1.6,s/2],[-e/2+1.6,-s/2]]){const d=new P(new At(.55,.55,.35,14),N(2237482));d.position.set(h,.5,u),d.rotation.x=Math.PI/2,t.add(d);const f=new P(new At(.24,.24,.38,12),N(U.metalGrey));f.position.set(h,.5,u),f.rotation.x=Math.PI/2,t.add(f)}return t}function Mg(i=U.metalGrey){const t=new Et;for(const r of[-1.5,1.5]){const o=new P(new At(.07,.07,2.5,8),N(i));o.position.set(r,1.25,-.6),t.add(o)}const e=new P(new ot(3.6,.12,1.6),N(i));e.position.set(0,2.5,-.2),e.rotation.x=-.06,t.add(e);const n=new P(new ot(3.6,1.6,.08),N(U.glass,{glow:.08}));n.position.set(0,1.35,-1.15),t.add(n);const s=new P(new ot(3,.1,.4),N(U.wood));s.position.set(0,.5,-.9),t.add(s);for(const r of[-1.2,1.2]){const o=new P(new ot(.08,.5,.36),N(i));o.position.set(r,.25,-.9),t.add(o)}return t}const yg=1.5,Ec=.9,wc=1.16,qn=.32,Do=.42,Ll=.34,Sg=qn+Do+Ll,bg=.5;class Eg{constructor(t){this.cena=t,this.cena.add(this.grupo)}t=-1;descanso=0;alvoA=new D;alvoB=new D;coracoes=[];grupo=new Et;soltouCoracao=!1;get rodando(){return this.t>=0}disponivel(t,e){if(this.rodando||this.descanso>0||t.riding||e.riding||t.submersion>.05||e.submersion>.05||!Tg(t,e))return!1;const n=e.position.x-t.position.x,s=e.position.z-t.position.z,r=Math.hypot(n,s);if(r>yg||r<.01)return!1;const o=Math.atan2(n,s);return Math.abs(Ir(t.rig.facing,o))<Ec&&Math.abs(Ir(e.rig.facing,o+Math.PI))<Ec}iniciar(t,e,n){if(this.rodando)return;this.t=0,this.soltouCoracao=!1;const s=e.position.x-t.position.x,r=e.position.z-t.position.z,o=Math.atan2(s,r),a=n+Math.PI/2,c=Math.abs(Ir(o,a))<Math.PI/2?a:a+Math.PI,l=(t.position.x+e.position.x)/2,h=(t.position.z+e.position.z)/2,u=Math.sin(c)*wc/2,d=Math.cos(c)*wc/2;this.alvoA.set(l-u,0,h-d),this.alvoB.set(l+u,0,h+d),t.rig.setFacing(c),e.rig.setFacing(c+Math.PI),e.clearOrder()}cancelar(t,e){this.t=-1,this.descanso=0,t.rig.setKiss(0),e.rig.setKiss(0);for(const n of this.coracoes)this.grupo.remove(n.obj);this.coracoes.length=0}update(t,e,n){if(this.descanso>0&&(this.descanso=Math.max(0,this.descanso-t)),this.rodando){this.t+=t;const s=wg(this.t);if(e.rig.setKiss(s),n.rig.setKiss(s),e.locked=!0,this.t<qn){const r=Math.min(1,t*9);e.position.lerp(this.alvoA,r),n.position.lerp(this.alvoB,r)}if(!this.soltouCoracao&&this.t>=qn*.9){this.soltouCoracao=!0;const r=Math.atan2(n.position.x-e.position.x,n.position.z-e.position.z),o=Math.sin(r),a=Math.cos(r);this.solta(e.position,o,a,-1),this.solta(n.position,o,a,1)}this.t>=Sg&&(this.t=-1,this.descanso=bg,e.rig.setKiss(0),n.rig.setKiss(0),e.locked=!1)}this.animaCoracoes(t)}solta(t,e,n,s){const r=e*s,o=n*s,a=Rl(.6);a.position.set(t.x+r*1,1.62,t.z+o*1),this.grupo.add(a),this.coracoes.push({obj:a,vida:0,giro:Math.random()*Math.PI,fx:r,fz:o})}animaCoracoes(t){for(let n=this.coracoes.length-1;n>=0;n--){const s=this.coracoes[n];s.vida+=t;const r=s.vida/1.7;if(r>=1){this.grupo.remove(s.obj),this.coracoes.splice(n,1);continue}s.obj.position.y+=t*.72;const o=(.7+Math.sin(s.vida*3+s.giro)*.25)*t;s.obj.position.x+=s.fx*o,s.obj.position.z+=s.fz*o,s.obj.rotation.y=s.giro+s.vida*1.4;const a=r<.18?r/.18:Math.min(1,(1-r)/.35);s.obj.scale.setScalar(.25+a*.9)}}}function wg(i){return i<qn?Tc(i/qn):i<qn+Do?1:Tc(Math.max(0,1-(i-qn-Do)/Ll))}function Tc(i){return i*i*(3-2*i)}function Tg(i,t){const e=i.rig.spec,n=t.rig.spec;return e.casal===!0&&n.casal===!0&&e.id!==n.id}function Ir(i,t){return Math.atan2(Math.sin(i-t),Math.cos(i-t))}const Ag={magro:.86,medio:1,forte:1.16};function Ac(i,t,e){const n=new Gs,s=5;for(let o=0;o<s*2;o++){const a=o%2===0?i:i*.46,c=o/(s*2)*Math.PI*2-Math.PI/2,l=Math.cos(c)*a,h=Math.sin(c)*a;o===0?n.moveTo(l,h):n.lineTo(l,h)}n.closePath();const r=new Ko(n,{depth:t,bevelEnabled:!1});return r.center(),new P(r,e)}class Cc{group=new Et;spec;headTop;body=new Et;head=new Et;armL=new Et;armR=new Et;legL=new Et;legR=new Et;blob;phase=0;bounce=0;beijo=0;targetFacing=0;swimming=!1;sitting=!1;trocaMaterial=[];soVestido=[];soBanho=[];constructor(t){this.spec=t;const e=t.height,n=Ag[t.build],s=e*.28,r=e*.3,o=e*.17,a=s,c=s+r*.86,l=e*.1*n,h=e*.3;this.headTop=s+r+o*2.1;const u=N(t.skin),d=N(t.shirt),f=N(t.pants),g=N(t.shoes);for(const[w,T]of[[this.legL,-1],[this.legR,1]]){w.position.set(T*e*.055*n,a,0);const C=new P(new Xn(e*.042*n,s*.62,4,10),f);C.position.y=-s*.48,w.add(C),this.trocaMaterial.push({mesh:C,normal:f,banho:u});const x=new P(new ot(e*.075*n,e*.045,e*.11),g);x.position.set(0,-s+e*.022,e*.018),w.add(x),this.trocaMaterial.push({mesh:x,normal:g,banho:u}),this.body.add(w)}const v=new P(new Xn(e*.105*n,r*.5,5,12),d);if(v.position.y=a+r*.52,v.scale.z=.82,this.body.add(v),this.trocaMaterial.push({mesh:v,normal:d,banho:u}),t.shirtAccent!==void 0){const w=new P(new At(e*.108*n,e*.108*n,e*.03,14,1,!0),N(t.shirtAccent,{doubleSide:!0}));w.position.y=a+r*.72,w.scale.z=.82,this.body.add(w),this.soVestido.push(w)}if(t.jacket!==void 0){const w=N(t.jacket,{doubleSide:!0}),T=e*.105*n,C=new P(new At(T*1.14,T*1.1,r*.66,16,1,!0,Math.PI/2+.72,Math.PI*2-1.44),w);C.position.y=a+r*.56,C.scale.z=.84,this.body.add(C),this.soVestido.push(C);const x=new P(new Yt(e*.088*n,12,10,0,Math.PI*2,0,Math.PI*.62),N(t.jacket));x.position.set(0,c+r*.04,-T*.75),x.rotation.x=-.7,x.scale.set(1.15,1,.8),this.body.add(x),this.soVestido.push(x)}const m=new P(new At(e*.118*n,e*.112*n,e*.15,14),N(t.swim??t.pants));m.position.y=a+e*.03,m.scale.z=.85,m.visible=!1,this.body.add(m),this.soBanho.push(m);for(const[w,T]of[[this.armL,-1],[this.armR,1]]){w.position.set(T*l,c,0);const C=t.jacket!==void 0?N(t.jacket):d,x=new P(new Xn(e*.038*n,h*.34,4,10),C);x.position.y=-h*.24,w.add(x),this.trocaMaterial.push({mesh:x,normal:C,banho:u});const b=new P(new Xn(e*.032*n,h*.28,4,10),u);b.position.y=-h*.66,w.add(b);const L=new P(new Yt(e*.04*n,10,8),u);L.position.y=-h*.92,w.add(L),this.body.add(w)}this.head.position.y=s+r+o*.92;const p=new P(new At(e*.035,e*.04,e*.05,10),u);p.position.y=-o*.85,this.head.add(p);const S=new P(new Yt(o,20,16),u);S.scale.set(1,1.04,1),this.head.add(S);const M=N(t.eyes);for(const w of[-1,1]){const T=new P(new Yt(o*.14,10,8),M);if(T.position.set(w*o*.35,0,o*.9),T.scale.set(1,1.25,.6),this.head.add(T),t.blush!==void 0){const C=new P(new ji(o*.16,12),Rn(t.blush,.75));C.position.set(w*o*.56,-o*.26,o*.82),C.rotation.y=w*.35,this.head.add(C)}}const _=N(t.hair.color);for(const w of[-1,1]){const T=new P(new ot(o*.3,o*.075,o*.06),_);T.position.set(w*o*.35,o*.3,o*.87),T.rotation.z=w*-.12,this.head.add(T)}const R=new P(new ye(o*.16,o*.035,6,14,Math.PI),M);R.position.set(0,-o*.38,o*.9),R.rotation.set(0,0,Math.PI),this.head.add(R),this.buildHair(o),this.buildAccessories(o,h,c,l,r,a,n),this.body.add(this.head),this.group.add(this.body),this.blob=new P(new ji(e*.16*n,18),Rn(2832939,.22)),this.blob.rotation.x=-Math.PI/2,this.blob.position.y=.02,this.group.add(this.blob),this.group.traverse(w=>{w.isMesh&&w!==this.blob&&(w.castShadow=!0,w.receiveShadow=!1)})}buildHair(t){const{style:e,color:n}=this.spec.hair,s=N(n),r=(o,a,c=.62,l=0)=>{const h=new P(new Yt(t*o,18,14,Math.PI/2+l/2,Math.PI*2-l,0,Math.PI*c),s);return h.position.y=a,this.head.add(h),h};switch(e){case"raspado":{r(1.02,t*.02).scale.set(1,.82,.96);break}case"curto":{r(1.06,t*.04).scale.set(1,.95,.98);const a=new P(new ot(t*1.5,t*.34,t*.42),s);a.position.set(0,t*.6,t*.62),a.rotation.x=-.18,this.head.add(a);break}case"franja":{r(1.07,t*.02);const o=new P(new At(t*1.05,t*1.05,t*.4,18,1,!1,Math.PI*.15,Math.PI*.7),s);o.position.set(0,t*.5,0),this.head.add(o);break}case"ondulado":{r(1.08,t*.02);for(const o of[-1,1]){const a=new P(new Yt(t*.46,12,10),s);a.position.set(o*t*.85,t*.1,-t*.1),a.scale.set(.8,1.15,1),this.head.add(a)}break}case"coque":{r(1.06,t*.02);const o=new P(new Yt(t*.42,12,10),s);o.position.set(0,t*.72,-t*.82),this.head.add(o);break}case"cachos-curtos":{const o=this.spec.hair.volume??1,a=this.spec.hair.tips!==void 0?N(this.spec.hair.tips):s;r(1,t*.02,.64,1.15).scale.set(1.02,.96,1.02);const l=[[.26,6,.3,.98],[.62,10,.27,1.02],[.98,12,.24,1.02],[1.28,12,.2,1]];let h=0;for(const[u,d,f,g]of l)for(let v=0;v<d;v++){const m=v/d*Math.PI*2+u*1.9,p=Math.sin(u)*Math.cos(m),S=Math.cos(u),M=Math.sin(u)*Math.sin(m);if(S<.72&&M>.24)continue;const _=new P(new Yt(t*f*(1+(o-1)*.4),8,7),h%5===0?a:s),R=g*(1+(o-1)*.14),w=M>0?.9:1.02;_.position.set(p*t*R,S*t*R,M*t*R*w),this.head.add(_),h++}for(let u=0;u<5;u++){const d=new P(new Yt(t*.2*(1+(o-1)*.3),8,7),u===2?a:s);d.position.set((u-2)*t*.3,t*(.62-u%2*.07),t*.62),this.head.add(d)}for(let u=0;u<3;u++){const d=new P(new Yt(t*.24*(1+(o-1)*.4),8,7),u===1?a:s);d.position.set((u-1)*t*.3,t*(.84+u%2*.07),t*.44),this.head.add(d)}for(const u of[-1,1]){const d=new P(new Yt(t*.17,8,7),s);d.position.set(u*t*.9,-t*.12,t*.22),d.scale.set(.7,1.1,.85),this.head.add(d)}break}case"cacheado":{const o=this.spec.hair.volume??1,a=this.spec.hair.tips!==void 0?N(this.spec.hair.tips):s;r(1+(o-1)*.2,t*.02,.66,1.3).scale.set(1.04,1,1.04);const l=[[.3,7,.34,1.02],[.72,11,.33,1.1],[1.08,13,.31,1.15],[1.44,13,.28,1.1],[1.78,11,.25,.98]];let h=0;for(const[u,d,f,g]of l)for(let v=0;v<d;v++){const m=v/d*Math.PI*2+u*2.3,p=Math.sin(u)*Math.cos(m),S=Math.cos(u),M=Math.sin(u)*Math.sin(m);if(u>.72&&M>.22)continue;const _=1+(o-1)*.55,R=new P(new Yt(t*f*_,8,7),h%4===0?a:s),w=g*(1+(o-1)*.28),T=M>0?.78:1.06;R.position.set(p*t*w,S*t*w,M*t*w*T),this.head.add(R),h++}for(let u=0;u<4;u++){const d=new P(new Yt(t*.22*(1+(o-1)*.4),8,7),u===1?a:s);d.position.set((u-1.5)*t*.34,t*(.62-u%2*.08),t*.62),this.head.add(d)}for(const u of[-1,1]){const d=new P(new Yt(t*.26*o,8,7),s);d.position.set(u*t*1.02*o,-t*.34,t*.28),d.scale.set(.8,1.25,.9),this.head.add(d)}break}}}buildAccessories(t,e,n,s,r,o,a){const c=this.spec.accessories??[],l=N(this.spec.accessoryColor??3093568);if(c.includes("oculos")){for(const u of[-1,1]){const d=new P(new ye(t*.24,t*.045,8,16),l);d.position.set(u*t*.36,t*.06,t*.9),this.head.add(d)}const h=new P(new ot(t*.3,t*.05,t*.05),l);h.position.set(0,t*.06,t*.92),this.head.add(h)}if(c.includes("bone")){const h=new P(new Yt(t*1.1,16,12,0,Math.PI*2,0,Math.PI*.5),l);h.position.y=t*.1,this.head.add(h);const u=new P(new At(t*1.05,t*1.05,t*.08,16,1,!1,Math.PI*.15,Math.PI*.7),l);u.position.set(0,t*.12,t*.28),u.rotation.x=-.12,this.head.add(u)}if(c.includes("barba")){const h=new P(new Yt(t*.72,14,12),N(this.spec.hair.color));h.position.set(0,-t*.42,t*.28),h.scale.set(1,.72,.85),this.head.add(h)}if(c.includes("fone")){const h=new P(new ye(t*1.05,t*.08,8,20,Math.PI),l);h.position.y=t*.05,h.rotation.z=Math.PI/2,h.rotation.y=Math.PI/2,this.head.add(h);for(const u of[-1,1]){const d=new P(new At(t*.28,t*.28,t*.16,12),l);d.position.set(u*t*1.02,t*.02,0),d.rotation.z=Math.PI/2,this.head.add(d)}}if(c.includes("corrente")){const h=new P(new ye(t*.42,t*.035,6,20),N(16763213,{glow:.2}));h.position.y=-t*.95,h.rotation.x=Math.PI/2,this.head.add(h)}if(c.includes("relogio")){const h=new P(new At(this.spec.height*.035,this.spec.height*.035,this.spec.height*.018,10),l);h.position.y=-e*.8,h.rotation.z=Math.PI/2,this.armL.add(h)}if(c.includes("presilha")){const h=this.spec.hair.volume??1,u=Ac(t*.3,t*.06,N(15918799));u.position.set(-t*.78*h,t*.92*h,t*.62*h),u.rotation.set(.35,-.6,.3),this.head.add(u)}if(c.includes("laco")){const h=this.spec.height,u=new Et,d=h*.105*a,f=new P(new Yt(h*.018,8,6),l);u.add(f);for(const g of[-1,1]){const v=new P(new ye(h*.026,h*.007,6,12),l);v.position.set(g*h*.03,h*.008,0),v.rotation.set(0,g*.5,g*.35),v.scale.set(1,.7,1),u.add(v);const m=new P(new ot(h*.012,h*.075,h*.006),l);m.position.set(g*h*.016,-h*.045,0),m.rotation.z=g*.22,u.add(m)}u.position.set(0,n-r*.1,d*.86),this.body.add(u),this.soVestido.push(u)}if(c.includes("cinto")){const h=this.spec.height,u=h*.105*a,d=o+r*.08,f=new P(new At(u*1.04,u*1.04,h*.032,16,1,!0),l);f.position.y=d,f.scale.z=.84,this.body.add(f),this.soVestido.push(f);const g=new P(new ot(h*.032,h*.03,h*.012),N(14210252));g.position.set(0,d,u*.9),this.body.add(g),this.soVestido.push(g);const v=new P(new ye(h*.028,h*.004,5,12,Math.PI),N(14210252));v.position.set(u*.6,d-h*.012,u*.6),v.rotation.set(0,-.7,Math.PI),this.body.add(v),this.soVestido.push(v);const m=Ac(h*.016,h*.004,N(14210252));m.position.set(u*.76,d-h*.05,u*.66),m.rotation.y=-.7,this.body.add(m),this.soVestido.push(m)}if(c.includes("mochila")){const h=new P(new ot(s*1.7,r*.62,this.spec.height*.09),l);h.position.set(0,o+r*.6,-this.spec.height*.11*a),this.body.add(h),this.soVestido.push(h);const u=n;for(const d of[-1,1]){const f=new P(new ot(this.spec.height*.022,r*.5,this.spec.height*.02),l);f.position.set(d*s*.6,u-r*.2,this.spec.height*.085*a),this.body.add(f),this.soVestido.push(f)}}}setFacing(t){this.targetFacing=t}get facing(){return this.group.rotation.y}cheer(){this.bounce=1}setOutfit(t){const e=t==="banho";for(const n of this.trocaMaterial)n.mesh.material=e?n.banho:n.normal;for(const n of this.soVestido)n.visible=!e;for(const n of this.soBanho)n.visible=e}setSitting(t){this.sitting=t,t||(this.body.position.y=0,this.legL.rotation.x=0,this.legR.rotation.x=0,this.armL.rotation.set(0,0,.08),this.armR.rotation.set(0,0,-.08))}setKiss(t){this.beijo=Math.max(0,Math.min(1,t))}get kissing(){return this.beijo>.001}setSwimming(t){this.swimming!==t&&(this.swimming=t,this.blob.visible=!t)}update(t,e){let n=this.targetFacing-this.group.rotation.y;if(n=Math.atan2(Math.sin(n),Math.cos(n)),this.group.rotation.y+=n*Math.min(1,t*14),this.beijo>.001){const a=this.beijo;this.phase+=t*1.2,this.legL.rotation.x=0,this.legR.rotation.x=0,this.body.rotation.x=a*.3,this.body.position.y=a*.045,this.armL.rotation.set(-a*.55,0,.08+a*.16),this.armR.rotation.set(-a*.55,0,-.08-a*.16),this.head.rotation.x=a*.18,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.sitting){this.phase+=t*.9,this.legL.rotation.x=-Math.PI/2+.06,this.legR.rotation.x=-Math.PI/2-.02,this.armL.rotation.set(-.25,0,.34),this.armR.rotation.set(-.2,0,-.34),this.body.rotation.x=-.05,this.body.position.y=Math.sin(this.phase)*.012,this.head.rotation.x=Math.sin(this.phase*.7)*.03,this.head.rotation.z*=1-Math.min(1,t*8);return}if(this.swimming){this.phase+=t*(2.6+e*1.2);const a=Math.sin(this.phase*2);this.armL.rotation.x=-1.1+a*.9,this.armR.rotation.x=-1.1-a*.9,this.armL.rotation.z=.5,this.armR.rotation.z=-.5,this.legL.rotation.x=a*.28,this.legR.rotation.x=-a*.28,this.body.rotation.x=.16,this.body.position.y=Math.sin(this.phase)*.03,this.head.rotation.x=-.14;return}const s=e>.05;this.phase+=t*(s?3.2+e*1.9:1.4);const r=s?Math.min(.62,.16+e*.14):.04,o=Math.sin(this.phase*(s?2:1));if(this.legL.rotation.x=s?o*r:0,this.legR.rotation.x=s?-o*r:0,this.armL.rotation.x=s?-o*r*.85:Math.sin(this.phase)*.05,this.armR.rotation.x=s?o*r*.85:-Math.sin(this.phase)*.05,this.armL.rotation.z=.08,this.armR.rotation.z=-.08,this.bounce>0){this.bounce=Math.max(0,this.bounce-t*1.6);const a=Math.sin((1-this.bounce)*Math.PI)*.28;this.body.position.y=a,this.head.rotation.z=Math.sin((1-this.bounce)*Math.PI*2)*.12}else{const a=s?Math.abs(Math.cos(this.phase*2))*.035:Math.sin(this.phase)*.012;this.body.position.y=a,this.head.rotation.z*=1-Math.min(1,t*8)}this.body.rotation.x=s?.06:0,this.head.rotation.x=s?-.05:Math.sin(this.phase*.6)*.03}dispose(){this.group.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()})}}class Cg{id;x;z;radius;label;icon;once;priority;highlight;run;baseY=0;baseScale=1;hot=!1;pulse=0;used=!1;busy=!1;enabled=!0;constructor(t){this.id=t.id??`${t.label}@${t.x},${t.z}`,this.x=t.x,this.z=t.z,this.radius=t.radius??2,this.label=t.label,this.icon=t.icon??"✨",this.once=t.once??!1,this.priority=t.priority??0,this.highlight=t.highlight,this.run=t.onInteract,this.highlight&&(this.baseY=this.highlight.position.y,this.baseScale=this.highlight.scale.y)}get available(){return this.enabled&&!this.busy&&!(this.once&&this.used)}moveTo(t,e){this.x=t,this.z=e}distanceTo(t,e){return Math.hypot(t-this.x,e-this.z)}setHot(t){this.hot=t}update(t){if(!this.highlight)return;const e=this.hot?1:0;if(this.pulse+=(e-this.pulse)*Math.min(1,t*8),this.pulse<.001){this.highlight.position.y=this.baseY,this.highlight.scale.y=this.baseScale;return}const n=performance.now()/1e3;this.highlight.position.y=this.baseY+Math.sin(n*4)*.06*this.pulse,this.highlight.scale.y=this.baseScale*(1+Math.sin(n*4+1)*.02*this.pulse)}async trigger(t){if(this.available){this.busy=!0;try{await this.run(t),this.used=!0}finally{this.busy=!1}}}}class Rg{constructor(t){this.game=t}root=new Et;colliders=[];interactables=[];updaters=[];bounds={minX:-40,minZ:-40,maxX:40,maxZ:40};seed=1337;decalque=0;add(...t){for(const e of t)e.traverse(n=>{n.isMesh&&(n.castShadow=!0,n.receiveShadow=!0)}),this.root.add(e);return t[0]}place(t,e,n,s,r=0){return t.position.set(e,n,s),t.rotation.y=r,t}ground(t){const e=new Ge(t.width,t.depth,1,1),n=new P(e,N(t.color));return n.rotation.x=-Math.PI/2,n.position.set(t.x??0,t.y??0,t.z??0),n.receiveShadow=!0,this.root.add(n),n}groundWithHoles(t){const e=t.width/2,n=t.depth/2,s=new Gs;s.moveTo(-e,-n),s.lineTo(e,-n),s.lineTo(e,n),s.lineTo(-e,n),s.closePath();for(const o of t.holes){const a=new Eo,c=o.x-o.width/2,l=o.x+o.width/2,h=-o.z-o.depth/2,u=-o.z+o.depth/2;a.moveTo(c,h),a.lineTo(l,h),a.lineTo(l,u),a.lineTo(c,u),a.closePath(),s.holes.push(a)}const r=new P(new Zo(s),N(t.color));return r.rotation.x=-Math.PI/2,r.position.set(t.x??0,t.y??0,t.z??0),r.receiveShadow=!0,this.root.add(r),r}patch(t,e,n,s,r,o=0,a=.01){const c=new P(new Ge(n,s),N(r,{offset:++this.decalque}));return c.rotation.set(-Math.PI/2,0,0),c.rotation.z=o,c.position.set(t,a,e),c.receiveShadow=!0,this.root.add(c),c}disc(t,e,n,s,r=.01){const o=new P(new ji(n,28),N(s,{offset:++this.decalque}));return o.rotation.x=-Math.PI/2,o.position.set(t,r,e),o.receiveShadow=!0,this.root.add(o),o}blockBox(t,e,n,s,r=0){this.colliders.push({kind:"box",x:t,z:e,hw:n,hd:s,rot:r})}blockCircle(t,e,n){this.colliders.push({kind:"circle",x:t,z:e,r:n})}blockFrom(t,e=.9){const n=new Ei().setFromObject(t),s=n.getSize(new D),r=n.getCenter(new D);this.blockBox(r.x,r.z,s.x/2*e,s.z/2*e,0)}setBounds(t,e,n,s){this.bounds={minX:t,minZ:e,maxX:n,maxZ:s}}wall(t,e,n,s,r=3,o=15984595,a=.3){const c=n-t,l=s-e,h=Math.hypot(c,l),u=Math.atan2(l,c),d=new P(new ot(h,r,a),N(o));return d.position.set((t+n)/2,r/2,(e+s)/2),d.rotation.y=-u,this.add(d),this.blockBox((t+n)/2,(e+s)/2,h/2,a/2,-u),d}interact(t){const e=new Cg(t);return this.interactables.push(e),e}door(t){return this.interact({id:`door:${t.to}:${t.entry??"default"}`,x:t.x,z:t.z,radius:t.radius??2,label:t.label,icon:t.icon??"🚪",highlight:t.highlight,onInteract:e=>e.goTo(t.to,t.entry)})}onUpdate(t){this.updaters.push(t)}rng(){return this.seed=this.seed*1664525+1013904223>>>0,this.seed/4294967295}setSeed(t){this.seed=t>>>0}range(t,e){return t+this.rng()*(e-t)}pick(t){return t[Math.floor(this.rng()*t.length)%t.length]}dispose(){this.root.traverse(t=>{const e=t;e.isMesh&&e.geometry.dispose()}),this.root.clear(),this.colliders.length=0,this.interactables.length=0,this.updaters.length=0,this.decalque=0}}class Pg{constructor(t,e,n){this.root=t,this.scenes=e,this.renderer=new X0({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Bc,t.appendChild(this.renderer.domElement),this.ui=new K0(t),this.ui.setMemories(this.save.memories),this.ui.onTouchAction=()=>this.input.tapAction(),this.ui.onTouchSwap=()=>this.input.tapSwap(),this.ui.onTouchHold=r=>this.input.setVirtualDown("KeyF",r),this.input=new Y0(this.renderer.domElement),this.hemi=new nd(16777215,9085034,1.05),this.scene.add(this.hemi),this.sun=new rd(16773840,1.5),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.near=1,this.sun.shadow.camera.far=220,this.sun.shadow.bias=-4e-4,this.sun.shadow.normalBias=.04;const s=this.sun.shadow.camera;s.left=-22,s.right=22,s.top=22,s.bottom=-22,s.updateProjectionMatrix(),this.scene.add(this.sun),this.scene.add(this.sun.target),this.player=new Z0(new Cc(n[0])),this.scene.add(this.player.object),this.beijo=new Eg(this.scene),this.parceiro=new $0(new Cc(n[1]??n[0])),this.parceiro.setVisible(n.length>1),this.scene.add(this.parceiro.object),window.addEventListener("resize",this.onResize),this.renderer.domElement.addEventListener("wheel",this.onWheel,{passive:!1})}renderer;scene=new fu;iso=new q0;input;ui;save=new ea;player;parceiro;clock=new ad;beijo;hemi;sun;current=null;hot=null;cameraTarget=null;transitioning=!1;podeBeijar=!1;elapsed=0;shadowSpan=0;traje="normal";moveDir=new D;camAim=new D;async start(t,e){const n=t??(this.scenes[this.save.scene]?this.save.scene:Object.keys(this.scenes)[0]);this.build(n,e),this.iso.snapTo(this.player.chest),this.renderer.render(this.scene,this.iso.camera),this.ui.hideBoot(),this.renderer.setAnimationLoop(this.tick)}build(t,e){const n=this.scenes[t];if(!n)throw new Error(`cena desconhecida: ${t}`);this.current&&(this.scene.remove(this.current.world.root),this.current.world.dispose());const s=new Rg(this);s.setSeed(Lg(t)),n.build(s),this.scene.add(s.root),this.current={def:n,world:s},this.applyAmbient(n.ambient);const r=e&&n.entries?.[e]||n.spawn;this.player.teleport(r.x,r.z,r.facing??0),this.player.locked=!1,this.player.riding=!1,this.player.setVisible(!0);const o=(r.facing??0)+Math.PI;this.parceiro.riding=!1,this.parceiro.teleport(r.x+Math.sin(o)*1.3,r.z+Math.cos(o)*1.3,r.facing??0),this.parceiro.setVisible(!0),this.cameraTarget=null,this.hot=null,this.beijo.cancelar(this.player,this.parceiro),this.podeBeijar=!1,this.parceiro.clearOrder(),this.setSitting(!1),this.setOutfit(n.outfit??"normal"),this.ui.hidePrompt(),this.ui.sceneCard(n.name,n.subtitle),this.save.scene=t}indoor=!1;setShadowSpan(t){if(Math.abs(t-this.shadowSpan)<1.5)return;this.shadowSpan=t,this.sun.shadow.normalBias=.04*(t/22);const e=this.sun.shadow.camera;e.left=-t,e.right=t,e.top=t,e.bottom=-t,e.updateProjectionMatrix()}applyAmbient(t){this.scene.background=new Qt(t.sky),this.scene.fog=t.fog!==void 0?new Xo(t.fog,t.fogNear??95,t.fogFar??200):null,this.hemi.color.setHex(t.ambientColor??t.sky),this.hemi.intensity=t.ambientIntensity??(t.indoor?1.35:1),this.sun.color.setHex(t.sunColor??16773840),this.sun.intensity=t.sunIntensity??(t.indoor?.85:1.6);const e=t.sunDir??[14,20,9];this.sun.position.set(e[0],e[1],e[2]),this.indoor=t.indoor===!0,this.setShadowSpan(t.indoor?12:22),this.iso.setViewSize(t.indoor?10:14)}tick=()=>{const t=Math.min(this.clock.getDelta(),.05);this.elapsed+=t;const e=this.current?.world;if(!e)return;const n=this.ui.dialogueOpen||this.ui.journalOpen||this.transitioning;this.input.blocked=n||this.player.locked,this.input.justPressed("KeyJ")&&this.ui.toggleJournal(),!n&&!this.player.locked&&this.input.justPressed("KeyT")&&this.swapCharacters(),n||(this.input.justPressed("KeyQ")&&this.iso.rotate(-1),this.input.justPressed("KeyR")&&this.iso.rotate(1));const s=this.input.justPressed("KeyE")||this.input.justPressed("Space");s&&this.ui.handleAction()||(s&&!n&&this.hot&&!this.player.locked?this.hot.trigger(this):s&&!n&&this.podeBeijar&&!this.player.locked&&this.beijo.iniciar(this.player,this.parceiro,this.iso.angle)),this.beijo.update(t,this.player,this.parceiro);const r=this.input.move();this.iso.screenToWorld(r.x,r.y,this.moveDir),this.player.update(this.moveDir,t,e.colliders,e.bounds),this.parceiro.update(this.player.position,t,e.colliders,e.bounds),this.updateHot(e,t),this.updateBeijo();for(const c of e.updaters)c(t,this.elapsed);this.cameraTarget?this.cameraTarget.getWorldPosition(this.camAim):this.camAim.copy(this.player.chest),this.iso.update(t,this.camAim);const o=this.indoor?12:Math.max(22,this.iso.currentViewSize*1.7);this.setShadowSpan(o);const a=o/22;this.sun.target.position.copy(this.camAim),this.sun.position.set(this.camAim.x+14*a,this.camAim.y+20*a,this.camAim.z+9*a),this.renderer.render(this.scene,this.iso.camera),this.input.endFrame()};updateBeijo(){this.podeBeijar=!this.ui.dialogueOpen&&!this.ui.journalOpen&&!this.player.locked&&this.beijo.disponivel(this.player,this.parceiro),!this.hot&&(this.podeBeijar?this.ui.showPrompt("💋",`Beijar ${this.parceiro.name}`):this.ui.hidePrompt())}updateHot(t,e){let n=null,s=1/0,r=-1/0;const o=this.player.position.x,a=this.player.position.z;for(const c of t.interactables){if(!c.available)continue;const l=c.distanceTo(o,a);l>c.radius||c.priority<r||c.priority===r&&l>=s||(n=c,s=l,r=c.priority)}n!==this.hot&&(this.hot?.setHot(!1),n?.setHot(!0),this.hot=n,n&&!this.player.locked?this.ui.showPrompt(n.icon,n.label):this.ui.hidePrompt()),this.player.locked||this.ui.dialogueOpen?this.ui.hidePrompt():this.hot&&this.ui.showPrompt(this.hot.icon,this.hot.label);for(const c of t.interactables)c.update(e)}get companionObject(){return this.parceiro.object}say(t,e){return this.ui.say(Array.isArray(t)?t:[t],e??this.player.name)}ask(t,e,n){return this.ui.ask(t,e,n??this.player.name)}toast(t,e){this.ui.toast(t,e)}goTo(t,e){this.transitioning||(this.transitioning=!0,(async()=>(await this.ui.fade(!0),this.build(t,e),this.iso.snapTo(this.player.chest),await this.ui.fade(!1),this.transitioning=!1))())}focusCamera(t){this.cameraTarget=t}setZoom(t){this.iso.setViewSize(t)}lockPlayer(t){this.player.locked=t,t&&this.ui.hidePrompt()}setPlayerVisible(t){this.player.setVisible(t)}flag(t){return this.save.flag(t)}setFlag(t,e=!0){this.save.setFlag(t,e)}bump(t,e=1){return this.save.bump(t,e)}stat(t){return this.save.stat(t)}unlock(t){this.save.addMemory(t)&&(this.ui.setMemories(this.save.memories),this.ui.toast(`Nova memória: ${t.title}`,t.icon),this.player.rig.cheer())}debugPlace(t,e,n=Math.PI/4){this.player.teleport(t,e,n),this.parceiro.teleport(t-1.2,e-.4,n),this.iso.snapTo(this.player.chest)}keyPressed(t){return this.ui.dialogueOpen||this.ui.journalOpen||this.player.locked?!1:this.input.justPressed(t)}keyDown(t){return this.ui.dialogueOpen||this.ui.journalOpen||this.player.locked?!1:this.input.isDown(t)}showCharge(t){this.ui.showCharge(t)}wait(t){return new Promise(e=>window.setTimeout(e,t*1e3))}playerPosition(){return this.player.position.clone()}playerFacing(){return this.player.rig.group.rotation.y}playerName(){return this.player.name}companionName(){return this.parceiro.name}companionPosition(){return this.parceiro.position.clone()}swapCharacters(){if(this.player.riding||this.parceiro.riding)return;const t=this.player.rig;this.player.swapRig(this.parceiro.rig),this.parceiro.swapRig(t),this.setOutfit(this.traje),this.ui.toast(`Agora você é ${this.player.name}`,"🔁")}submergePlayer(t){this.player.submersion=Yn.clamp(t,0,1)}submergeCompanion(t){this.parceiro.submersion=Yn.clamp(t,0,1)}rideCompanion(t,e,n=1,s=Math.PI){t.add(this.parceiro.object),this.parceiro.object.position.copy(e),this.parceiro.object.scale.setScalar(n),this.parceiro.rig.group.rotation.y=s,this.parceiro.rig.setFacing(s),this.parceiro.riding=!0}commandCompanion(t,e){this.parceiro.goTo(t,e)}freeCompanion(){this.parceiro.clearOrder()}setSitting(t){this.player.rig.setSitting(t),this.parceiro.rig.setSitting(t)}setOutfit(t){this.player.rig.setOutfit(t),this.parceiro.rig.setOutfit(t),this.traje=t}releaseCompanion(t,e,n=0){this.scene.add(this.parceiro.object),this.parceiro.object.scale.setScalar(1),this.parceiro.riding=!1,this.parceiro.teleport(t,e,n)}ridePlayer(t,e,n=1){t.add(this.player.object),this.player.object.position.copy(e),this.player.object.scale.setScalar(n),this.player.rig.group.rotation.y=Math.PI,this.player.riding=!0,this.player.locked=!0,this.ui.hidePrompt()}releasePlayer(t,e,n=0){this.scene.add(this.player.object),this.player.object.scale.setScalar(1),this.player.riding=!1,this.player.teleport(t,e,n),this.player.locked=!1}onResize=()=>{this.renderer.setSize(window.innerWidth,window.innerHeight),this.iso.resize(window.innerWidth,window.innerHeight)};onWheel=t=>{t.preventDefault(),this.iso.zoomBy(Math.sign(t.deltaY)*1.1)};dispose(){this.renderer.setAnimationLoop(null),window.removeEventListener("resize",this.onResize),this.input.dispose(),this.renderer.dispose(),this.root.replaceChildren()}}function Lg(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Rc(i=3,t=2.2,e=U.rug){const n=new P(new ot(i,.04,t),N(e));return n.position.y=.02,n.receiveShadow=!0,n}function Ig(i=U.sofa,t=2.2){const e=new Et,n=new P(new ot(t,.42,.9),N(i));n.position.y=.28,e.add(n);const s=new P(new ot(t,.62,.24),N(i));s.position.set(0,.72,-.35),e.add(s);for(const o of[-1,1]){const a=new P(new ot(.24,.5,.9),N(i));a.position.set(o*(t/2-.12),.62,0),e.add(a)}for(const[o,a]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const c=new P(new At(.05,.04,.14,6),N(U.woodDark));c.position.set(o*(t/2-.2),.07,a*.34),e.add(c)}const r=new P(new ot(.36,.12,.34),N(U.flowerPink));return r.position.set(t/2-.5,.55,-.14),r.rotation.set(.9,.4,0),e.add(r),e}function Dg(){const i=new Et,t=new P(new ot(1.2,.08,.7),N(U.wood));t.position.y=.46,i.add(t);for(const[e,n]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const s=new P(new At(.04,.04,.46,6),N(U.woodDark));s.position.set(e*.5,.23,n*.27),i.add(s)}return i}function Ug(i=!1){const t=new Et,e=new P(new ot(1.8,.5,.45),N(U.woodDark));e.position.y=.25,t.add(e);const n=new P(new ot(1.5,.85,.08),N(2040361));n.position.y=.95,t.add(n);const s=new P(new Ge(1.36,.72),Rn(i?9426943:U.screen,1));return s.name="tela",s.position.set(0,.95,.05),t.add(s),t}function Pc(i=U.wood){const t=new Et,e=new P(new ot(.5,.08,.5),N(i));e.position.y=.46,t.add(e);const n=new P(new ot(.5,.55,.07),N(i));n.position.set(0,.75,-.22),t.add(n);for(const[s,r]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const o=new P(new ot(.06,.46,.06),N(U.woodDark));o.position.set(s*.2,.23,r*.2),t.add(o)}return t}function Ng(i=2.4){const t=new Et,e=new P(new ot(i,.9,.65),N(U.wallMint));e.position.y=.45,t.add(e);const n=new P(new ot(i+.08,.08,.72),N(U.concrete));n.position.y=.94,t.add(n);const s=new P(new ot(.5,.06,.4),N(U.metalWhite));return s.position.set(i/2-.55,.97,0),t.add(s),t}function Fg(){const i=new Et,t=new P(new ot(.8,1.8,.7),N(U.metalWhite));t.position.y=.9,i.add(t);const e=new P(new ot(.82,.03,.72),N(U.metalGrey));e.position.y=1.25,i.add(e);for(const n of[.7,1.45]){const s=new P(new ot(.05,.3,.05),N(U.metalGrey));s.position.set(.3,n,.37),i.add(s)}return i}function Lc(i=1){const t=new Et,e=new P(new At(.22*i,.17*i,.34*i,10),N(U.plantPot));e.position.y=.17*i,t.add(e);for(let n=0;n<5;n++){const s=n/5*Math.PI*2,r=new P(new Yt(.2*i,8,6),N(n%2?U.leafMid:U.leafLight));r.scale.set(.5,1.5,.5),r.position.set(Math.cos(s)*.12*i,.6*i,Math.sin(s)*.12*i),r.rotation.z=Math.cos(s)*.4,r.rotation.x=-Math.sin(s)*.4,t.add(r)}return t}function Ic(i=.7,t=.55,e=U.skyDusk){const n=new Et,s=new P(new ot(i,t,.05),N(U.woodDark));n.add(s);const r=new P(new Ge(i-.1,t-.1),Rn(e));return r.position.z=.03,n.add(r),n}function Og(i=1.2,t=1.2){const e=new Et,n=new P(new Ge(i,t),Rn(U.glass,.55));e.add(n);const s=new P(new ot(i+.12,.08,.08),N(U.metalWhite));s.position.y=t/2,e.add(s);const r=s.clone();r.position.y=-t/2,e.add(r);for(const o of[-1,1]){const a=new P(new ot(.08,t,.08),N(U.metalWhite));a.position.x=o*i/2,e.add(a)}return e}function zg(i=16777215){const t=new Et,e=new P(new At(.07,.06,.13,10),N(i));e.position.y=.065,t.add(e);const n=new P(new ye(.045,.014,6,12),N(i));return n.position.set(.08,.07,0),n.rotation.y=Math.PI/2,t.add(n),t}function Bg(i=1.5,t=.9){const e=new Et,n=new P(new ot(i,.09,t),N(U.wood));n.position.y=.75,e.add(n);for(const[r,o]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const a=new P(new ot(.08,.75,.08),N(U.woodDark));a.position.set(r*(i/2-.14),.37,o*(t/2-.14)),e.add(a)}const s=new P(new At(.07,.09,.16,10),N(U.wallMint));s.position.y=.87,e.add(s);for(const r of[-1,1]){const o=new P(new Yt(.06,8,6),N(r<0?U.flowerPink:U.flowerYellow));o.position.set(r*.05,1.03,0),e.add(o)}return e}function kg(i=!0){const t=new Et,e=new P(new At(.2,.24,.06,12),N(U.woodDark));e.position.y=.03,t.add(e);const n=new P(new At(.03,.03,1.5,8),N(U.metalGrey));n.position.y=.78,t.add(n);const s=new P(new At(.22,.3,.34,14,1,!0),N(i?16773324:15130320,{glow:i?.5:0,doubleSide:!0}));return s.position.y=1.68,t.add(s),t}function Dc(i=1.1){const t=new Et,e=new P(new ot(i,.06,.24),N(U.wood));t.add(e);const n=[14245951,6074447,16763213];for(let r=0;r<3;r++){const o=new P(new ot(.1,.24,.16),N(n[r]));o.position.set(-i/2+.2+r*.16,.15,0),t.add(o)}const s=new P(new Yt(.13,10,8),N(U.leafMid));return s.position.set(i/2-.22,.16,0),s.scale.y=.8,t.add(s),t}function Vg(i=2){const t=new Et,e=new P(new ot(i,.6,.34),N(U.wallCream));t.add(e);for(const n of[-1,1]){const s=new P(new ot(.04,.16,.04),N(U.metalGrey));s.position.set(n*i*.22,-.18,.19),t.add(s)}return t}function Hg(){const i=new Et,t=new P(new ot(.66,.9,.64),N(U.metalWhite));t.position.y=.45,i.add(t);const e=new P(new At(.2,.2,.06,16),N(10467012));e.position.set(0,.5,.33),e.rotation.x=Math.PI/2,i.add(e);const n=new P(new At(.14,.14,.05,16),N(3884624));n.position.set(0,.5,.36),n.rotation.x=Math.PI/2,i.add(n);const s=new P(new ot(.6,.12,.03),N(14673128));s.position.set(0,.82,.33),i.add(s);for(const r of[-.2,0,.2]){const o=new P(new At(.025,.025,.03,8),N(U.metalGrey));o.position.set(r,.82,.36),o.rotation.x=Math.PI/2,i.add(o)}return i}function Dr(i=U.wood,t=.9,e=2.1,n=.24){const s=new Et,r=new P(new ot(t,e,.08),N(i));r.position.y=e/2,s.add(r);for(const c of[-1,1]){const l=new P(new ot(.09,e+.1,n),N(U.woodDark));l.position.set(c*(t+.09)/2,(e+.1)/2,0),s.add(l)}const o=new P(new ot(t+.2,.1,n),N(U.woodDark));o.position.y=e+.05,s.add(o);const a=new P(new Yt(.055,8,6),N(U.gold,{glow:.15}));return a.position.set(t/2-.14,e*.45,.07),s.add(a),s}const ki={id:"ari",name:"Ari",height:1.72,build:"magro",skin:15912882,blush:16748448,eyes:4862760,casal:!0,hair:{color:9395251,style:"cacheado",volume:1.28,tips:11104575},shirt:16315888,pants:5995432,shoes:16053490,swim:6271190,accessories:["presilha","laco","cinto"],accessoryColor:2368042},Vi={id:"renan",name:"Renan",height:1.78,build:"magro",skin:15714468,eyes:2366744,casal:!0,hair:{color:2037522,style:"cachos-curtos",volume:1},shirt:9277335,pants:2237226,shoes:1776672,swim:2237226,jacket:1645087,accessories:["mochila"],accessoryColor:1645087},Gg=[ki,Vi],Uo={id:"casa",name:"Casa do Ari",subtitle:"domingo de manhã, café ainda quente",ambient:{sky:15721684,indoor:!0,sunColor:16773332,sunIntensity:1,ambientColor:16643043,ambientIntensity:1.4,sunDir:[9,15,11]},spawn:{x:1.4,z:2.4,facing:Math.PI},entries:{"da-rua":{x:3.4,z:3.1,facing:Math.PI}},build(i){const t=i.game,e=async F=>{for(const[pt,yt]of F)await t.say([yt],pt)},n=ki.name,s=Vi.name,r=12,o=9,a=-r/2,c=-o/2,l=2.8;i.ground({width:r,depth:o,color:U.floorWood}),i.setBounds(a+.45,c+.45,r/2-.45,o/2-.45),i.wall(a,c,r/2,c,l,U.wallCream),i.wall(a,c,a,o/2,l,U.wallMint),i.wall(a,o/2,r/2,o/2,.45,U.wallCream),i.wall(r/2,-1.3,r/2,o/2,.45,U.wallCream);const h=.4,u=4.2,d=-1.3,f=(h+u)/2,g=(u+r/2)/2,v=.95,m=[h,f-v/2,f+v/2,g-v/2,g+v/2,r/2];for(let F=0;F<m.length;F+=2)m[F+1]-m[F]>.05&&i.wall(m[F],d,m[F+1],d,l,U.wallCream);i.wall(h,c,h,d,l,U.wallCream),i.wall(u,c,u,d,l,U.wallCream),i.wall(r/2,c,r/2,d,l,U.wallCream);const p=new P(new ot(r/2-h,.16,d-c),N(15129028));p.position.set((h+r/2)/2,l+.08,(c+d)/2),i.add(p);const S=i.add(i.place(Dr(U.woodDark,.85,2.05),f,0,d)),M=i.add(i.place(Dr(U.gold,.85,2.05),g,0,d));i.add(i.place(Ic(.6,.75,U.wallMint),3.55,1.75,d+.17)),i.add(i.place(Dc(.9),1.1,1.7,d+.19)),i.add(i.place(Ng(3.6),-3.4,0,c+.42)),i.blockBox(-3.4,c+.42,1.8,.4),i.add(i.place(Vg(2.6),-3.4,2,c+.2)),i.add(i.place(Fg(),a+.45,0,-2.6,Math.PI/2)),i.blockBox(a+.45,-2.6,.38,.42);const _=i.add(i.place(Bg(1.5,.9),-3.6,0,-1.9,.08));i.blockBox(-3.6,-1.9,.8,.52,.08),i.add(i.place(Pc(),-4.7,0,-1.9,Math.PI/2)),i.add(i.place(Pc(),-2.5,0,-1.9,-Math.PI/2));const R=i.add(i.place(Ug(!1),a+.35,0,.6,Math.PI/2));i.blockBox(a+.35,.6,.3,.9);const w=R.getObjectByName("tela");i.add(i.place(Rc(3,2.6),-2.5,0,.6));const T=i.add(i.place(Ig(U.fabricRed,2.4),-.3,0,.6,-Math.PI/2));i.blockBox(-.3,.6,.5,1.2),i.add(i.place(Dg(),-2.4,0,.6,Math.PI/2)),i.blockBox(-2.4,.6,.38,.62);const C=i.add(i.place(zg(16773856),-2.4,.5,.9));i.add(i.place(kg(!0),-.4,0,2.3)),i.blockCircle(-.4,2.3,.3);const x=i.add(i.place(Hg(),r/2-.65,0,2.9,-Math.PI/2));i.blockBox(r/2-.65,2.9,.35,.4),i.add(i.place(Og(1.8,1.3),a+.16,1.75,2.4,Math.PI/2)),i.add(i.place(Ic(.8,.6,U.skyDusk),-3.4,1.95,c+.17)),i.add(i.place(Dc(1.1),-1.6,1.8,c+.2)),i.add(i.place(Lc(1.1),a+.8,0,o/2-1));const b=i.add(i.place(Lc(.75),4.9,0,1.4)),L=i.place(Rl(.75),-.3,2.4,.6);L.visible=!1,i.add(L);const B=o/2;i.wall(2,B,2.9,B,2.6,U.wallCream),i.wall(3.9,B,4.9,B,2.6,U.wallCream);const W=i.add(i.place(Dr(U.woodDark,.95,2.1),3.4,0,B,Math.PI));i.blockBox(3.4,B,.5,.12),i.add(i.place(Rc(1.4,.8,12626050),3.4,0,o/2-1));const J=new xe;J.position.set(-.52,0,.6),J.rotation.y=-Math.PI/2,i.root.add(J);const j=new xe;j.position.set(-1.9,1.05,.6),i.root.add(j);let Z=!1;const it=F=>{Z=F,w.material=N(F?9426943:U.screen,{glow:F?.55:0})};i.interact({id:"casa:sofa",x:-.3,z:.6,radius:2,label:"Sentar no sofá",icon:"🛋️",highlight:T,onInteract:async F=>{if(await F.ask("Parece muito confortável, sentar?",["Sim","Não"])!==0){await F.say(["Depois. Se sentar agora, não levanta mais."]);return}F.lockPlayer(!0),F.ridePlayer(J,new D(-.52,.02,0),1,0),F.rideCompanion(J,new D(.52,.02,0),1,0),F.setSitting(!0),it(!0),F.focusCamera(j),F.setZoom(7.2),await F.wait(.9),await F.say(["Está passando Bo Burnham."]),await F.say(["Você já sabe a letra inteira e mesmo assim espera a parte que gosta.",`E aí olha pro lado pra ver se ${F.companionName()} tá rindo também.`]),await F.ask("Ficar mais um pouco?",["Fica","Bora pro parque"])===0&&await F.say(["Mais um. Só mais um.","Nunca é só mais um."]),F.setSitting(!1),F.focusCamera(null),F.setZoom(10),F.releasePlayer(-1.6,.4,-Math.PI/2),F.releaseCompanion(-1.6,1.5,-Math.PI/2),F.lockPlayer(!1),F.unlock({id:"sofa-preguica",title:"Domingo sem pressa",place:"Casa do Ari",note:"Os dois no sofá, Bo Burnham na TV, e o plano de sair ficando pra depois.",icon:"🛋️"})}}),i.interact({id:"casa:tv",x:a+1.4,z:.6,radius:1.5,label:"Ligar a TV",icon:"📺",highlight:R,onInteract:async F=>{it(!Z),F.toast(Z?"TV ligada":"TV desligada","📺"),Z&&await F.say(["Está passando Bo Burnham."])}}),i.interact({id:"casa:geladeira",x:a+1.5,z:-2.6,radius:1.4,label:"Abrir a geladeira",icon:"🧊",onInteract:F=>F.say(["Tem queijo, presunto, suco de pêssego e algumas bebidas alcoólicas."])}),i.interact({id:"casa:pia",x:-2.2,z:c+1.3,radius:1.4,label:"Olhar a pia",icon:"🚰",onInteract:F=>F.say(["Por algum milagre, a pia está limpa…"])}),i.interact({id:"casa:mesa",x:-3.6,z:-.9,radius:1.4,label:"Pôr a mesa",icon:"🍽️",highlight:_,onInteract:async F=>{await e([[n,"Dois pratos, duas canecas. Já virou automático."],[s,"Três, se a Rubi sair do quarto."]]),F.toast("Mesa posta","🍽️")}}),i.interact({id:"casa:maquina",x:r/2-1.7,z:2.9,radius:1.4,label:"Ver a máquina de lavar",icon:"🧺",highlight:x,onInteract:async F=>{if(F.flag("roupa-lavando")){await e([[s,"Ainda tá centrifugando."],[n,"Esse barulho é a trilha sonora dessa casa."]]);return}F.setFlag("roupa-lavando"),F.toast("Máquina ligada","🫧"),await e([[n,"Bota pra lavar agora que quando a gente voltar do parque já tá pronto."],[s,"Contanto que a Rubi não encha ela de novo antes."]])}}),i.interact({id:"casa:banheiro",x:g,z:d+1.2,radius:1.3,label:"Bater na porta do banheiro",icon:"🚪",highlight:M,onInteract:()=>e([[s,"Tem alguém aí?"],[n,"É o Guillermo. Ele vem tanto aqui que já tem horário no banheiro."]])}),i.interact({id:"casa:quarto",x:f,z:d+1.2,radius:1.4,label:"Porta do quarto",icon:"🎧",highlight:S,onInteract:async F=>{await e([[n,"Acho que a Rubi está ouvindo kpop"],[s,"Para variar né"]]),F.unlock({id:"quarto-manha",title:"Do outro lado da porta",place:"Casa do Ari",note:"Sempre tem música saindo do quarto. Dá pra saber o humor da Rubi pela playlist.",icon:"🎧"})}}),i.interact({id:"casa:planta",x:4.9,z:2.4,radius:1.4,label:"Regar a plantinha",icon:"🪴",highlight:b,onInteract:async F=>{if(F.flag("planta-regada")){await F.say(["Já bebeu água hoje. Tá mais cuidada que a gente."]);return}F.setFlag("planta-regada"),b.scale.multiplyScalar(1.2),F.toast("A plantinha cresceu um tiquinho","🌱"),await F.say(["Pronto. Ela finge que não gosta, mas gosta."])}}),i.interact({id:"casa:cafe",x:-2.4,z:1.6,radius:1.3,label:"Tomar o café",icon:"☕",highlight:C,onInteract:async F=>{await F.say(["Ainda tá quente. Bom sinal — a gente acordou tarde, mas não tanto."]),F.toast("+1 disposição","☕")}}),i.interact({id:"casa:janela",x:a+1.3,z:2.4,radius:1.5,label:"Olhar pela janela",icon:"🪟",onInteract:async F=>{await F.say(["O dia tá bom demais pra ficar em casa.","Dá tempo de ir no parque e ainda voltar antes do sol cair."]),F.unlock({id:"ceu-laranja",title:"O céu laranja",place:"Casa do Ari",note:"Da janela dele dá pra ver o céu mudando de cor no fim da tarde.",icon:"🌇"})}}),i.door({x:3.4,z:o/2-1.2,to:"villa-lobos",entry:"portao",label:"Sair — ir pro parque",icon:"🚪",highlight:W,radius:1.7}),i.onUpdate((F,pt)=>{L.visible=i.game.flag("planta-regada"),L.position.y=2.4+Math.sin(pt*1.6)*.12,L.rotation.y=pt*.9})}},re={x:0,z:-3,largura:16,profundidade:10,fundo:1.6};function Uc(i,t,e=0){return Math.abs(i-re.x)<re.largura/2-e&&Math.abs(t-re.z)<re.profundidade/2-e}const Nc={id:"clube",name:"Clube",subtitle:"a piscina que a gente ainda não conhece",outfit:"banho",ambient:{sky:10476799,fog:14086399,fogNear:100,fogFar:210,sunColor:16774880,sunIntensity:1.75,ambientColor:14480127,ambientIntensity:1.05,sunDir:[15,22,11]},spawn:{x:0,z:12,facing:Math.PI},entries:{portaria:{x:0,z:12,facing:Math.PI},beira:{x:0,z:3.5,facing:Math.PI}},build(i){const t=i.game,e={x:re.x,z:re.z,width:re.largura,depth:re.profundidade};i.groundWithHoles({width:160,depth:160,color:U.grass,holes:[e]}),i.groundWithHoles({width:34,depth:26,color:14999766,y:.015,z:-1,holes:[e]}),i.setBounds(-22,-18,22,16),i.add(i.place(cg(re.largura,re.profundidade,re.fundo),re.x,0,re.z));const n=lg(re.largura,re.profundidade);n.position.set(re.x,-.12,re.z),i.root.add(n);for(const S of[-5.2,-1.8,1.8,5.2]){const M=new P(new Ge(.24,re.profundidade-1.4),Rn(4164272));M.rotation.x=-Math.PI/2,M.position.set(re.x+S,-1.6+.08,re.z),i.root.add(M)}for(const S of[-5,5])i.add(i.place(hg(),S,0,re.z+re.profundidade/2));const s=i.add(i.place(dg(),0,0,re.z-re.profundidade/2-1.6));i.blockBox(0,re.z-re.profundidade/2-1.9,.4,.4);const r=[Lr(U.frisbee),Lr(16767070),Lr(7328752)];r.forEach((S,M)=>{i.place(S,-4.5+M*4.6,-.05,re.z-1.6+M%2*2.6),i.root.add(S)});const o=[U.fabricBlue,U.fabricRed,6074447,16763213];for(let S=0;S<6;S++){const M=-7.5+S*3;i.add(i.place(Mc(o[S%o.length]),M,0,5.4,Math.PI)),i.blockBox(M,5.4,.36,.85),S%2===0&&(i.add(i.place(yc(S%4===0?U.fabricRed:4882400),M+1.5,0,6.9)),i.blockCircle(M+1.5,6.9,.3))}const a=i.add(i.place(Mc(U.rug),10.5,0,2.2,-Math.PI/2));i.blockBox(10.5,2.2,.85,.36),i.add(i.place(yc(16748465),11.6,0,3.6)),i.blockCircle(11.6,3.6,.3);const c=i.add(i.place(ug(),-11,0,2.5,-Math.PI/2));i.blockCircle(-11,2.5,.3);const l=i.add(i.place(Po(5161384,{tipo:"suco"}),-12.5,0,7.2,.35));i.blockBox(-12.5,7.2,1.4,1,.35);const h=i.add(i.place(Lo(6,3.2,4,U.wallCream,8038084),13,0,-9));i.blockBox(13,-9,3,2),i.add(i.place(Al(),13,0,-6.6)),i.blockBox(13,-6.6,1,.35),i.setSeed(90210);for(const[S,M]of[[-18,-8],[-17,1],[18,2],[19,-6],[-19,10],[18,11]])i.add(i.place(Co("palmeira",i.range(.95,1.2),i.rng()),S,0,M)),i.blockCircle(S,M,.5);for(let S=0;S<26;S++){const M=i.range(-20,20),_=i.range(-16,14);Math.abs(M)<18&&_>-14&&_<12||i.add(i.place(S%2?Ro(i.range(.7,1.1)):Tl(6,1.1),M,0,_))}for(let S=0;S<6;S++){const M=Cl(i.range(1.8,3));M.position.set(i.range(-60,60),i.range(40,52),i.range(-50,30)),i.root.add(M);const _=i.range(.2,.5);i.onUpdate(R=>{M.position.x+=_*R,M.position.x>62&&(M.position.x=-62)})}i.add(i.place(fn(30,1.4,U.metalWhite),-6,0,14)),i.add(i.place(fn(14,1.4,U.metalWhite),12,0,14)),i.blockBox(-6,14,15,.2),i.blockBox(12,14,7,.2);const u=i.add(i.place(fn(4,1.6,U.gold),3.5,0,14));i.door({x:3.5,z:13,to:"villa-lobos",entry:"clube",label:"Voltar pro parque",icon:"🌳",highlight:u,radius:2.2});const d=[],f=(S,M,_=12)=>{for(let R=0;R<_;R++){const w=new P(new Yt(.1+Math.random()*.1,6,5),Rn(14677247,.9)),T=R/_*Math.PI*2,C=.2+Math.random()*.5;w.position.set(S+Math.cos(T)*C,-.1,M+Math.sin(T)*C),i.root.add(w),d.push({mesh:w,vy:2.2+Math.random()*2.4,vida:1})}};let g=0,v=0,m=!1;i.onUpdate((S,M)=>{n.position.y=-.12+Math.sin(M*1.4)*.015,r.forEach((C,x)=>{C.position.y=-.05+Math.sin(M*1.1+x*1.7)*.05,C.rotation.y=Math.sin(M*.4+x)*.4});const _=t.playerPosition(),R=t.companionPosition(),w=Uc(_.x,_.z,.2)?1:0,T=Uc(R.x,R.z,.2)?1:0;g+=(w-g)*Math.min(1,S*5),v+=(T-v)*Math.min(1,S*5),t.submergePlayer(g),t.submergeCompanion(v),w===1&&!m&&(m=!0,f(_.x,_.z,10),t.toast("Água morninha","💦"),t.unlock({id:"piscina-clube",title:"A piscina do clube",place:"Clube",note:"A gente ainda não foi. Mas já sei como vai ser: você entra devagar reclamando do frio e eu entro de uma vez.",icon:"🏊"}));for(let C=d.length-1;C>=0;C--){const x=d[C];x.vy-=9*S,x.mesh.position.y+=x.vy*S,x.vida-=S*.9,x.mesh.material.opacity=Math.max(0,x.vida),(x.vida<=0||x.mesh.position.y<-.6)&&(i.root.remove(x.mesh),x.mesh.geometry.dispose(),d.splice(C,1))}});const p=new xe;i.root.add(p),i.interact({id:"clube:trampolim",x:0,z:re.z-re.profundidade/2-.6,radius:2.2,label:"Pular do trampolim",icon:"🤿",highlight:s,onInteract:async S=>{S.lockPlayer(!0),await S.say(["Do trampolim?","Do trampolim."]);const M=new D(0,.95,re.z-re.profundidade/2-.4),_=new D(0,-.6,re.z+1.2);p.position.copy(M),S.ridePlayer(p,new D(0,0,0),1);const R=1.15;for(let w=0;w<R;w+=1/60){const T=w/R;p.position.lerpVectors(M,_,T),p.position.y+=Math.sin(T*Math.PI)*2.6,await S.wait(1/60)}f(_.x,_.z,18),S.releasePlayer(_.x,_.z,Math.PI),S.lockPlayer(!1),S.toast("Splash!","💦"),S.unlock({id:"trampolim",title:"O pulo do trampolim",place:"Clube",note:"Você jurou que não ia pular. Pulou primeiro.",icon:"🤿"})}}),i.interact({id:"clube:espreguicadeira",x:9.4,z:2.2,radius:1.8,label:"Deitar na espreguiçadeira",icon:"🌞",highlight:a,onInteract:async S=>{await S.say(["Sol na cara, barulho de água, ninguém com pressa.",`${S.companionName()} vai dizer que é hora de sair da água em dez minutos. E não vai sair.`]),S.toast("+1 preguiça boa","🌞")}}),i.interact({id:"clube:bar",x:-12.2,z:9.2,radius:2.2,label:"Pedir alguma coisa gelada",icon:"🍹",highlight:l,onInteract:async S=>{await S.say(["Dois sucos. Um sem gelo, que é como você gosta."]),S.toast("Suco gelado","🍹")}}),i.interact({id:"clube:chuveiro",x:-9.8,z:2.5,radius:1.8,label:"Tomar uma chuveirada",icon:"🚿",highlight:c,onInteract:async S=>{f(-10.6,2.5,8),await S.say(["Gelada. Sempre gelada."])}}),i.interact({id:"clube:vestiario",x:13,z:-6.6,radius:2.2,label:"Vestiário",icon:"🩳",highlight:h,onInteract:S=>S.say(["Cinco minutos pra trocar de roupa. Você demora quinze."])})}};function Wg(i,t,e,n){const s=new D().subVectors(t,i),r=s.length(),o=new P(new At(e,e*1.15,r,8),n);return o.position.copy(i).addScaledVector(s,.5),o.quaternion.setFromUnitVectors(new D(0,1,0),s.normalize()),o}class Xg{group=new Et;cabins=[];radius;hubHeight;speed;angle=0;rim=new Et;cabinCount;constructor(t={}){const e=this.radius=t.radius??12,n=this.cabinCount=t.cabins??32;this.speed=(t.rpm??.9)*Math.PI*2/60;const s=N(t.frameColor??U.metalWhite),r=this.hubHeight=e+2.6,o=e*.075;for(const T of[-o,o]){const C=new P(new ye(e,e*.019,8,72),s);C.position.z=T,this.rim.add(C)}const a=Math.min(48,n*2);for(let T=0;T<a;T++){const C=T/a*Math.PI*2,x=new P(new ot(e*.012,e*.012,o*2),s);x.position.set(Math.cos(C)*e,Math.sin(C)*e,0),this.rim.add(x)}const c=[];for(let T=0;T<a;T++){const C=T/a*Math.PI*2,x=(T+1)/a*Math.PI*2,b=T%2===0?-o:o,L=T%2===0?o:-o;c.push(Math.cos(C)*e,Math.sin(C)*e,b,Math.cos(x)*e,Math.sin(x)*e,L)}this.rim.add(new Oa(Fc(c),xc(14673642)));const l=[];for(let T=0;T<n;T++){const C=T/n*Math.PI*2,x=Math.cos(C)*e,b=Math.sin(C)*e;l.push(0,0,-o*.5,x,b,-o),l.push(0,0,o*.5,x,b,o)}this.rim.add(new Oa(Fc(l),xc(15660022)));const h=new P(new At(e*.085,e*.085,e*.3,14),s);h.rotation.x=Math.PI/2,this.rim.add(h);for(const T of[-e*.17,e*.17]){const C=new P(new At(e*.11,e*.07,e*.06,14),N(U.metalGrey));C.rotation.x=Math.PI/2,C.position.z=T,this.rim.add(C)}this.rim.position.y=r,this.group.add(this.rim);const u=N(t.cabinColor??U.metalWhite),d=N(7321304,{opacity:.5}),f=e*.068;for(let T=0;T<n;T++){const C=new Et,x=new P(new ot(.09,f*1.1,.09),N(U.metalGrey));x.position.y=f*1.25,C.add(x);const b=new P(new Xn(f,f*.5,5,16),u);b.scale.set(1,1,.92),C.add(b);const L=new P(new At(f*1.02,f*1.02,f*.95,18,1,!0),d);L.position.y=f*.12,L.scale.z=.92,C.add(L),C.traverse(B=>{B.isMesh&&(B.castShadow=!0)}),this.cabins.push(C),this.group.add(C)}const g=e*.42,v=new D(0,r,-e*.04),m=new D(0,r,e*.04),p=[[v,new D(-e*.2,0,-g)],[v,new D(e*.2,0,-g)],[m,new D(-e*.2,0,g)],[m,new D(e*.2,0,g)]];for(const[T,C]of p){const x=Wg(T.clone(),C.clone(),e*.03,s);x.castShadow=!0,this.group.add(x)}for(const T of[-g,g]){const C=new P(new ot(e*.42,e*.022,e*.022),s);C.position.set(0,e*.16,T),this.group.add(C)}const S=new P(new At(e*.62,e*.67,.35,26),N(U.concrete));S.position.y=.16,S.receiveShadow=!0,this.group.add(S);const M=e*.4,_=g*.92;for(const[T,C]of[[-M,-_],[M,-_],[-M,_],[M,_]]){const x=new P(new At(e*.055,e*.055,e*.16,12),N(U.metalRed));x.position.set(T,e*.08,C),x.castShadow=!0,this.group.add(x)}const R=new P(new ot(e*.55,.55,e*.3),N(U.metalGrey));R.position.set(0,.4,g*.9),R.castShadow=!0,R.receiveShadow=!0,this.group.add(R);const w=new P(new At(e*.13,e*.13,e*.34,14,1,!1,0,Math.PI),N(U.fabricRed));w.position.set(0,1.9,g*.9),w.rotation.set(0,0,Math.PI/2),w.scale.z=.6,this.group.add(w);for(const T of[-e*.15,e*.15]){const C=new P(new At(.06,.06,1.8,8),N(U.metalWhite));C.position.set(T,.9,g*.9),this.group.add(C)}this.layout()}cabinAngle(t){return this.angle+t/this.cabinCount*Math.PI*2}layout(){for(let t=0;t<this.cabins.length;t++){const e=this.cabinAngle(t);this.cabins[t].position.set(Math.cos(e)*this.radius,this.hubHeight+Math.sin(e)*this.radius,0)}}update(t){this.angle+=this.speed*t,this.rim.rotation.z=this.angle,this.layout()}boardingCabin(){let t=this.cabins[0],e=1/0;for(const n of this.cabins)n.position.y<e&&(e=n.position.y,t=n);return t}turnsSince(t){return(this.angle-t)/(Math.PI*2)}}function Fc(i){const t=new we;return t.setAttribute("position",new ne(i,3)),t}class qg{mesh;state="chao";velocity=new D;spin=0;gravity=7.2;lift=3.1;onLand=null;constructor(t){this.mesh=og(t),this.mesh.position.set(0,.06,0)}get position(){return this.mesh.position}pickUp(){this.state="guardado",this.velocity.set(0,0,0)}holdAt(t,e){this.mesh.visible=!0,this.mesh.position.set(t.x+Math.sin(e+Math.PI/2)*.34,1.02,t.z+Math.cos(e+Math.PI/2)*.34),this.mesh.rotation.set(0,this.mesh.rotation.y,Math.PI/2.4)}throwToward(t,e,n=0){const s=e.x-t.x,r=e.z-t.z,o=Math.hypot(s,r),a=(Math.random()-.5)*n;this.throwFrom(t,Math.atan2(s,r)+a,this.powerFor(o))}throwAt(t,e,n){this.throwFrom(t,e,this.powerFor(n))}powerFor(t){let e=.25,n=1.7;for(let s=0;s<14;s++){const r=(e+n)/2;this.simulateRange(r)<t?e=r:n=r}return Yn.clamp((e+n)/2,.25,1.7)}simulateRange(t){let e=1.15,n=3.4*t,s=11*t,r=0;const o=1/60;for(let a=0;a<900&&e>.06;a++){const c=n>-1.2?this.lift:0;n-=(this.gravity-c)*o,s*=1-.35*o,r+=s*o,e+=n*o}return r}throwFrom(t,e,n=1){this.state="voando",this.mesh.visible=!0,this.mesh.position.set(t.x,1.15,t.z),this.mesh.rotation.set(0,this.mesh.rotation.y,0);const s=11*n;this.velocity.set(Math.sin(e)*s,3.4*n,Math.cos(e)*s),this.spin=22}update(t,e){if(this.state!=="voando")return;const n=this.velocity.y>-1.2?this.lift:0;this.velocity.y-=(this.gravity-n)*t,this.velocity.x*=1-.35*t,this.velocity.z*=1-.35*t,this.mesh.position.addScaledVector(this.velocity,t),this.mesh.rotation.y+=this.spin*t,this.mesh.rotation.z=Math.sin(this.mesh.rotation.y)*.08;const s=Yn.clamp(this.mesh.position.x,e.minX+1,e.maxX-1),r=Yn.clamp(this.mesh.position.z,e.minZ+1,e.maxZ-1);(s!==this.mesh.position.x||r!==this.mesh.position.z)&&(this.mesh.position.x=s,this.mesh.position.z=r,this.velocity.multiplyScalar(.2)),this.mesh.position.y<=.06&&(this.mesh.position.y=.06,this.mesh.rotation.z=0,this.state="chao",this.velocity.set(0,0,0),this.onLand?.(this.mesh.position.clone()))}}const Oc={id:"villa-lobos",name:"Parque Villa Lobos",subtitle:"sábado de manhã, vento bom",ambient:{sky:U.skyDay,fog:12576503,fogNear:95,fogFar:200,sunColor:16774362,sunIntensity:1.7,ambientColor:14217471,ambientIntensity:1,sunDir:[16,22,10]},spawn:{x:0,z:26,facing:Math.PI},entries:{portao:{x:0,z:26,facing:Math.PI},roda:{x:0,z:-17,facing:0},clube:{x:33,z:13,facing:Math.PI*1.5}},build(i){const t=i.game,e=async k=>{for(const[O,Q]of k)await t.say([Q],O)},n=ki.name,s=Vi.name,r={x:18,z:-4.5,largura:26,profundidade:19},o=(k,O,Q=0)=>Math.abs(k-r.x)<r.largura/2-Q&&Math.abs(O-r.z)<r.profundidade/2-Q;i.ground({width:240,depth:240,color:U.grass}),i.setBounds(-44,-34,44,32);for(let k=0;k<14;k++)i.disc(i.range(-40,40),i.range(-30,30),i.range(2,6),U.grassDark,.004);i.disc(0,-16.5,8.6,U.sand,.008),i.disc(0,-16.5,8,U.concrete,.012),i.patch(0,4,5.5,56,U.asphalt,0,.016),i.patch(0,9,62,4.5,U.asphalt,0,.02);const a=new Xg({radius:12,cabins:32,rpm:1});i.place(a.group,0,0,-26),i.add(a.group),i.blockCircle(0,-26,7.2);for(const k of[-11,11])i.add(i.place(fn(9,1.2,U.metalWhite),k,0,-20,Math.PI/2)),i.blockBox(k,-20,.2,4.5);const c=new Et,l=new P(new Yt(2.6,14,9,0,Math.PI*2,0,Math.PI/2),new $o({color:14676731,transparent:!0,opacity:.82}));c.add(l);const h=new P(new ye(2.6,.09,6,24),N(U.metalWhite));h.rotation.x=Math.PI/2,h.position.y=.05,c.add(h);for(let k=0;k<6;k++){const O=new P(new ye(2.6,.05,5,18,Math.PI),N(U.metalWhite));O.rotation.set(0,k/6*Math.PI,0),c.add(O)}i.place(c,-9.5,0,-21),i.add(c),i.blockCircle(-9.5,-21,2.6);const u=i.add(i.place(Po(U.fabricBlue,{texto:"Bilheteria"}),9.5,0,-20.5,-.5));i.blockBox(9.5,-20.5,1.4,.95,-.5),i.disc(-21,11,9.2,U.sand,.024),i.disc(-21,11,8.5,U.water,.028),i.blockCircle(-21,11,8.8);const d=[Pr(),Pr(15262416),Pr()];d.forEach((k,O)=>{i.place(k,-21+Math.cos(O*2.1)*4.5,.1,11+Math.sin(O*2.1)*3.5,O*1.7),i.add(k)});for(let k=0;k<10;k++){const O=k/10*Math.PI*2;i.add(i.place(Ro(.7,U.leafDark),-21+Math.cos(O)*9.8,0,11+Math.sin(O)*9.8))}const f=r.x-r.largura/2,g=r.x+r.largura/2,v=r.z-r.profundidade/2,m=r.z+r.profundidade/2;i.patch(r.x,r.z,r.largura,r.profundidade,U.grassDark,0,.008);const p=(k,O,Q,mt)=>{i.patch(k,O,Q,mt,15922416,0,.012)};p(r.x,v+.3,r.largura-1.2,.28),p(r.x,m-.3,r.largura-1.2,.28),p(f+.6,r.z,.28,r.profundidade-.6),p(g-.6,r.z,.28,r.profundidade-.6),p(r.x,r.z,.28,r.profundidade-.6),p(f+6,r.z,.22,r.profundidade-.6),p(g-6,r.z,.22,r.profundidade-.6),i.disc(r.x,r.z,2.2,15922416,.011),i.disc(r.x,r.z,1.9,U.grassDark,.012);const S=(k,O,Q,mt)=>{i.add(i.place(fn(Q,1.5,U.metalWhite),k,0,O,mt?Math.PI/2:0)),mt?i.blockBox(k,O,.2,Q/2):i.blockBox(k,O,Q/2,.2)};S(r.x,v,r.largura,!1),S(r.x,m,r.largura,!1),S(g,r.z,r.profundidade,!0),S(f,v+3.75,7.5,!0),S(f,m-3.75,7.5,!0),i.add(i.place(Sc(),f+3,0,r.z)),i.blockCircle(f+3,r.z,.5);const M=i.add(i.place(Sc(U.frisbee),g-3,0,r.z));i.blockCircle(g-3,r.z,.5);const _=i.add(i.place(fg(),r.x,0,v+1.2));i.blockBox(r.x,v+1.2,1,.2);const R=i.add(i.place(pg(6),r.x,0,m-1.2,Math.PI));i.blockBox(r.x,m-1.4,3,.8);const w=i.add(i.place(mg(),f+1.6,0,r.z+4.2,Math.PI/2));i.blockCircle(f+1.6,r.z+4.2,.4);const T=i.add(i.place(gg(),f+1.8,0,r.z-3.4,.4)),C=i.add(i.place(vg(),g-1.6,0,m-2.4));i.blockCircle(g-1.6,m-2.4,.3);const x=C.userData.manga;i.onUpdate((k,O)=>{C.rotation.y=Math.sin(O*.3)*.5+.6,x.rotation.z=Math.sin(O*1.7)*.12-.06});for(const[k,O]of[[f+1,v+1],[g-1,v+1],[f+1,m-1],[g-1,m-1]])i.add(i.place(_g(),k,0,O,Math.atan2(r.x-k,r.z-O))),i.blockCircle(k,O,.4);for(const[k,O]of[[f+6,v+1.4],[f+6,m-1.4],[g-6,v+1.4],[g-6,m-1.4]])i.add(i.place(ag(),k,0,O));const b=i.add(i.place(bc("Frisbee!",U.frisbee),f-1.8,0,r.z+3.4,Math.PI*.25));i.blockCircle(f-1.8,r.z+3.4,.3);const L=[[-4.2,14,0],[4.2,14,Math.PI],[-4.2,-2,0],[4.2,-6,Math.PI],[-12,9.5,Math.PI/2]];for(const[k,O,Q]of L)i.add(i.place(Al(),k,0,O,Q)),i.blockBox(k,O,1,.35,Q);for(const[k,O]of[[-4,20],[4,6],[-4,-8],[4,22],[-4,2]])i.add(i.place(eg(!1),k,0,O)),i.blockCircle(k,O,.35);for(const[k,O]of[[3.4,17],[-3.4,11]])i.add(i.place(ng(),k,0,O)),i.blockCircle(k,O,.35);const B=i.add(i.place(ig(),-10,0,20,.3));i.blockBox(-10,20,1,.9,.3);const W=i.add(i.place(Po(16164544,{tipo:"sorvete"}),12,0,18.6,.3));i.blockBox(12,18.6,1.4,.95,.3);const J=[[0,-26,20],[-21,11,12],[18,-4.5,17],[0,4,6],[0,9,6],[12,19,4],[-10,20,3],[37,13,8]],j=(k,O)=>Math.abs(k)<4&&O>-20&&O<30?!1:!J.some(([Q,mt,st])=>Math.hypot(k-Q,O-mt)<st),Z=["redonda","redonda","pinheiro","florida","palmeira"];let it=0;for(let k=0;k<260&&it<64;k++){const O=i.range(-42,42),Q=i.range(-32,30);if(!j(O,Q))continue;const mt=i.range(.85,1.5);i.add(i.place(Co(i.pick(Z),mt,i.rng()),O,0,Q,i.range(0,6.28))),i.blockCircle(O,Q,.45*mt),it++}for(let k=0;k<90;k++){const O=i.range(-42,42),Q=i.range(-32,30);j(O,Q)&&(k%3===0?i.add(i.place(Tl(6,1.1),O,0,Q)):k%3===1?i.add(i.place(Ro(i.range(.7,1.2)),O,0,Q)):i.add(i.place(tg(i.range(.5,1)),O,0,Q)))}i.patch(-66,-10,18,220,U.water,0,.02),i.patch(-55,-10,6,220,U.concrete,0,.03);for(let k=0;k<22;k++){const O=i.range(7,20),Q=i.range(4,9);i.add(i.place(Lo(Q,O,Q*.9,i.pick([U.wallCream,U.concrete,U.wallMint]),U.metalGrey),i.range(-95,60),0,-96-i.range(0,16)))}for(let k=0;k<14;k++){const O=i.range(6,16);i.add(i.place(Lo(i.range(4,8),O,5,U.wallCream,U.roofTile),92+i.range(0,16),0,i.range(-60,40)))}for(let k=0;k<90;k++){const O=k/90*Math.PI*2,Q=62+i.range(0,28),mt=Math.cos(O)*Q,st=Math.sin(O)*Q*.9;mt<-50||i.add(i.place(Co(i.pick(Z),i.range(1.2,2.2),i.rng()),mt,0,st,i.range(0,6.28)))}for(let k=0;k<9;k++){const O=Cl(i.range(1.6,3.2));O.position.set(i.range(-70,70),i.range(56,70),i.range(-60,45)),i.root.add(O);const Q=i.range(.25,.6);i.onUpdate(mt=>{O.position.x+=Q*mt,O.position.x>56&&(O.position.x=-56)})}const F=i.add(i.place(sg(U.wood,U.metalWhite),2.6,0,27.5,Math.PI));i.add(i.place(fn(16,1.4),-10,0,28)),i.add(i.place(fn(16,1.4),10,0,28)),i.blockBox(-10,28,8,.2),i.blockBox(10,28,8,.2),i.add(i.place(fn(11,1.4),35,0,3.5,Math.PI/2)),i.add(i.place(fn(11,1.4),35,0,22.5,Math.PI/2)),i.blockBox(35,3.5,.2,5.5),i.blockBox(35,22.5,.2,5.5),i.patch(30,13,12,5,U.asphalt),i.patch(40,13,12,34,U.asphalt),i.patch(35.6,13,1.6,34,U.concrete,0,.012);const pt=i.add(i.place(xg(4161494),39.5,0,13,-Math.PI/2));i.blockBox(39.5,13,1.5,4.3);const yt=i.add(i.place(Mg(),36.4,0,13,-Math.PI/2));i.blockBox(35.9,13,.3,1.8);const Rt=i.add(i.place(bc("Clube!",5161384),36.4,0,8.6,Math.PI*.25));i.blockCircle(36.4,8.6,.3),i.door({x:37.6,z:13,to:"clube",entry:"portaria",label:"Pegar o ônibus pro clube",icon:"🚌",highlight:pt,radius:2.6}),i.door({x:0,z:27,to:"casa",entry:"da-rua",label:"Voltar pra casa",icon:"🏠",highlight:F,radius:2.2});const Mt=new qg(U.frisbee);Mt.mesh.visible=!1,i.root.add(Mt.mesh);const Zt=1.3,ie=6,te=30,et={minX:f+.7,minZ:v+.7,maxX:g-.7,maxZ:m-.7};let $="fora",Ct=0,Dt=0,Pt=!1,Wt=0,ee=null;const I=(k,O)=>{Wt+=1;const Q=k.bump("frisbee.trocas"),mt=k.stat("frisbee.recorde");Wt>mt&&k.bump("frisbee.recorde",Wt-mt),O?k.toast("Pegou no ar!","🥏"):Wt%5===0&&k.toast(`${Wt} trocas seguidas!`,"🥏"),Q>=10&&!k.flag("memoria-frisbee")&&(k.setFlag("memoria-frisbee"),k.unlock({id:"frisbee-villa",title:"Frisbee no Villa",place:"Parque Villa Lobos",note:"Todo sábado a mesma cena: o disco vai longe demais e um dos dois corre atrás rindo.",icon:"🥏"}))},lt=(k,O,Q)=>Math.max(O,Math.min(Q,k)),rt=k=>{const O=k.x<r.x?1:-1;return{x:lt(k.x+O*11,f+2,g-2),z:lt(k.z,v+2,m-2)}},tt=()=>{Pt=!1,Dt=0,t.showCharge(null)},nt=()=>{$="comigo",Mt.pickUp(),Wt=0,ee=null,t.setZoom(19),t.toast("Segure F para lançar mais longe","🥏")},_t=()=>{$="fora",Mt.mesh.visible=!1,tt(),t.freeCompanion(),t.setZoom(14),ee=null},ht=k=>{if($!=="comigo")return;const O=ie+(te-ie)*lt(k,0,1);Mt.throwAt(t.playerPosition(),t.playerFacing(),O),$="voando-pra-ele"},gt=i.interact({id:"parque:frisbee-jogar",x:r.x,z:r.z,radius:3,priority:-1,label:"Lançar o frisbee  (segure F)",icon:"🥏",onInteract:()=>ht(.55)}),Ht=i.interact({id:"parque:frisbee-pegar",x:r.x,z:r.z,radius:1.8,label:"Pegar o frisbee",icon:"🥏",onInteract:k=>{Mt.pickUp(),$="comigo",I(k,!1)}});i.onUpdate(k=>{Mt.update(k,et);const O=t.playerPosition(),Q=t.companionPosition(),mt=o(O.x,O.z,.4);if(mt&&$==="fora"?nt():!mt&&$!=="fora"&&_t(),$==="fora"){gt.enabled=!1,Ht.enabled=!1;return}if($==="comigo"){if(t.keyDown("KeyF"))Pt=!0,Dt=Math.min(1,Dt+k/Zt),t.showCharge(Dt);else if(Pt){const st=Dt;tt(),ht(st)}}else Pt&&tt();if($==="comigo"||$==="no-chao"){const st=rt(O);(!ee||Math.hypot(st.x-ee.x,st.z-ee.z)>2.5)&&(t.commandCompanion(st.x,st.z),ee=st)}switch($){case"comigo":Mt.holdAt(O,t.playerFacing());break;case"com-ele":if(Mt.holdAt(Q,Math.atan2(O.x-Q.x,O.z-Q.z)),Ct-=k,Ct<=0){const st=O.clone();st.x+=(Math.random()-.5)*2.2,st.z+=(Math.random()-.5)*2.2,Mt.throwToward(Q,st,.09),$="voando-pra-mim"}break;case"voando-pra-ele":{if(Mt.state==="voando"&&Mt.position.y<2.3&&Math.hypot(Mt.position.x-Q.x,Mt.position.z-Q.z)<1.5){t.freeCompanion(),ee=null,Mt.pickUp(),Ct=.7,$="com-ele",t.toast("Ele pegou no ar!","🙌");break}Mt.state==="chao"&&(Mt.position.distanceTo(Q)<1.6?(Mt.pickUp(),Ct=.8,$="com-ele"):(t.commandCompanion(Mt.position.x,Mt.position.z),ee=null,$="buscando"));break}case"buscando":Mt.position.distanceTo(Q)<1.1&&(t.freeCompanion(),Mt.pickUp(),Ct=.9,$="com-ele");break;case"voando-pra-mim":{if(Mt.state==="voando"&&Mt.position.y<2.3&&Math.hypot(Mt.position.x-O.x,Mt.position.z-O.z)<1.9){Mt.pickUp(),$="comigo",I(t,!0);break}Mt.state==="chao"&&($="no-chao",Mt.position.distanceTo(O)<1.9&&(Mt.pickUp(),$="comigo",I(t,!1)));break}case"no-chao":Mt.position.distanceTo(O)<1.2&&(Mt.pickUp(),$="comigo",I(t,!1));break}gt.enabled=$==="comigo",Ht.enabled=$==="no-chao",$==="comigo"?gt.moveTo(O.x,O.z):Ht.moveTo(Mt.position.x,Mt.position.z)}),i.interact({id:"parque:placa-quadra",x:f-1.8,z:r.z+4.8,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:b,onInteract:()=>e([[s,"QUADRA LIVRE — respeite quem chegou primeiro."],[n,"Hoje só tem a gente."],[s,"Então segura o F e manda ver. Quanto mais tempo segurar, mais longe vai."]])}),i.interact({id:"parque:placar",x:r.x,z:v+2.6,radius:2.2,label:"Ver o placar",icon:"🔢",highlight:_,onInteract:k=>{const O=k.stat("frisbee.recorde"),Q=k.stat("frisbee.trocas");return e([[n,O>0?`Nosso recorde é ${O} trocas seguidas.`:"O placar tá zerado."],[s,Q>0?`E já foram ${Q} no total. A gente não desiste fácil.`:"Bora estrear isso então."]])}}),i.interact({id:"parque:arquibancada",x:r.x,z:m-2.6,radius:2.4,label:"Sentar na arquibancada",icon:"🪑",highlight:R,onInteract:()=>e([[s,"Cansei. Cinco minutos."],[n,"Você falou cinco minutos faz meia hora."],[s,"E olha que descanso bem, hein."]])}),i.interact({id:"parque:bebedouro",x:f+2.8,z:r.z+4.2,radius:1.8,label:"Beber água",icon:"🚰",highlight:w,onInteract:async k=>{await e([[n,"A água daqui é sempre meio quente."],[s,"Mas depois de correr atrás de disco, tá ótima."]]),k.toast("Água (meio quente)","🚰")}}),i.interact({id:"parque:sacola",x:f+2.8,z:r.z-3.4,radius:1.8,label:"Olhar os discos",icon:"🎒",highlight:T,onInteract:()=>e([[s,"Tem uns três discos aqui de gente que esqueceu."],[n,"Um deles é seu. Desde março."],[s,"…é, pode ser."]])}),i.interact({id:"parque:cesta",x:g-4.4,z:r.z,radius:2.2,label:"Ver a cesta",icon:"🧺",highlight:M,onInteract:()=>e([[n,"Um dia a gente acerta essa cesta."],[s,"Já acertei uma vez!"],[n,"Você acertou o poste. É diferente."]])}),i.interact({id:"parque:biruta",x:g-3,z:m-2.4,radius:2,label:"Ver o vento",icon:"🎏",highlight:C,onInteract:()=>e([[s,"O vento tá indo pra lá."],[n,"Então joga contra que o disco fica no ar mais tempo."],[s,"Ou joga a favor e ele vai parar no estacionamento. Já aconteceu."]])}),i.interact({id:"parque:ponto-onibus",x:36.4,z:15.4,radius:2.2,label:"Esperar no ponto",icon:"🚏",highlight:yt,onInteract:()=>e([[n,"Esse é o que passa no clube?"],[s,"É esse. Já tá parado, é só subir."]])}),i.interact({id:"parque:placa-clube",x:36.4,z:7,radius:2.2,label:"Ler a placa",icon:"🪧",highlight:Rt,onInteract:()=>e([[s,'"Clube!" — com exclamação e tudo.'],[n,"Quem escreveu isso tava animado."]])}),i.interact({id:"parque:lago",x:-13,z:11,radius:2.6,label:"Olhar o lago",icon:"🦆",onInteract:async k=>{await k.say(["Que lago bonito... dá até vontade de pular"],Vi.name),await k.say(["Então vamos! Hahahha"],ki.name),await k.say(["NÃAAOOO"],Vi.name),k.unlock({id:"lago-pular",title:"Vontade de pular",place:"Parque Villa Lobos",note:"Um dos dois sempre tem uma ideia. O outro sempre grita.",icon:"🦆"})}});const zt=Io(U.morango),A=Io(U.maracuja);zt.visible=!1,A.visible=!1,i.root.add(zt,A);let y=0;const G=(k,O,Q)=>{k.visible=!0,k.position.set(O.x+Math.sin(Q-Math.PI/2)*.42,1.14,O.z+Math.cos(Q-Math.PI/2)*.42),k.rotation.y=Q};i.onUpdate(k=>{if(y<=0)return;y-=k;const O=t.playerName()===ki.name?zt:A,Q=O===zt?A:zt,mt=t.playerPosition(),st=t.companionPosition();G(O,mt,t.playerFacing()),G(Q,st,Math.atan2(mt.x-st.x,mt.z-st.z)),y<=0&&(zt.visible=!1,A.visible=!1,t.toast("Acabou o sorvete","🍦"))}),i.interact({id:"parque:sorveteria",x:12,z:20.6,radius:2.4,label:"Comprar sorvete",icon:"🍦",highlight:W,onInteract:async k=>{await e([[n,"Dois, por favor."],[s,"Um de morango e um de maracujá."],[n,"Nunca pedimos diferente."]]),y=50,k.toast("Morango e maracujá","🍦"),k.unlock({id:"sorvete-villa",title:"Sorvete no parque",place:"Parque Villa Lobos",note:"Morango pro Ari, maracujá pro Renan. Nunca muda, e nem precisa.",icon:"🍦"})}}),i.interact({id:"parque:piquenique",x:-10,z:21.6,radius:2.2,label:"Arrumar o piquenique",icon:"🧺",highlight:B,onInteract:async k=>{await e([[s,"A toalha xadrez de sempre."],[n,"E o pão de queijo já frio."],[s,"Frio é melhor. Aceita."]]),k.unlock({id:"piquenique",title:"Piquenique de sábado",place:"Parque Villa Lobos",note:"Sempre a mesma mesa, sempre a mesma toalha.",icon:"🧺"})}}),i.interact({id:"parque:bilheteria",x:9.5,z:-19,radius:2.2,label:"Bilheteria",icon:"🎟️",highlight:u,onInteract:()=>e([[n,"Dois pra roda gigante."],[s,"Sempre dois."]])});let q=null;const ct=k=>new Promise(O=>{q={resolve:O,de:a.angle,voltas:k}});let K=!0;i.onUpdate(k=>{if(a.update(k),K){const O=t.playerPosition(),Q=Math.hypot(O.x,O.z+26);if(Q<28){const mt=Math.max(0,Math.min(1,(Q-8)/20));t.setZoom(36-mt*21)}}if(d.forEach((O,Q)=>{O.position.y=.1+Math.sin(performance.now()/900+Q)*.05}),q&&a.turnsSince(q.de)>=q.voltas){const O=q.resolve;q=null,O()}}),i.interact({id:"parque:roda-gigante",x:0,z:-18.6,radius:3,label:"Andar na roda gigante",icon:"🎡",onInteract:async k=>{K=!1,k.lockPlayer(!0),await e([[s,"A fila tá curta hoje."],[n,"Bora subir?"]]);const O=a.boardingCabin(),Q=a.speed;a.speed=Q*5,k.ridePlayer(O,new D(-.3,-.34,0),.55),k.rideCompanion(O,new D(.3,-.34,0),.55),k.focusCamera(O),k.setZoom(38),await ct(.25),await e([[n,"Daqui dá pra ver o parque inteiro."],[s,"E aquele pedacinho do rio ali atrás."]]),await ct(.35),await e([[n,'Toda vez que a gente passa aqui embaixo você olha pra cima e diz "um dia a gente sobe".'],[s,"Pronto. Subimos."]]),await ct(.4),a.speed=Q,k.focusCamera(null),k.releasePlayer(0,-17.6,0),k.releaseCompanion(-1.1,-17.9,0),k.lockPlayer(!1),K=!0,k.unlock({id:"roda-gigante",title:"A roda gigante",place:"Parque Villa Lobos",note:"A roda branca gigante que aparece por cima das árvores. A gente sempre olha. Agora a gente subiu — os dois na mesma cabine.",icon:"🎡"})}})}},Yg={[Uo.id]:Uo,[Oc.id]:Oc,[Nc.id]:Nc},jg=Uo.id,Il=document.getElementById("app");if(!Il)throw new Error("#app nao encontrado");const qs=new Pg(Il,Yg,Gg),ts=new URLSearchParams(location.search),Jg=ts.get("cena")??void 0,Kg=ts.get("entrada")??void 0;qs.start(Jg??(localStorage.getItem("aristory.save.v1")?void 0:jg),Kg);const Ur=Number(ts.get("zoom"));Number.isFinite(Ur)&&Ur>0&&qs.setZoom(Ur);const Di=ts.get("em")?.split(",").map(Number);if(Di&&Di.length===2&&Di.every(Number.isFinite)){const i=Number(ts.get("olhar"));qs.debugPlace(Di[0],Di[1],Number.isFinite(i)?i:Math.PI/4)}window.jogo=qs;
