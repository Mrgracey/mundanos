this.wp=this.wp||{},this.wp.domReady=function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=279)}({279:function(e,t,n){"use strict";n.r(t);t.default=function(e){if("complete"===document.readyState||"interactive"===document.readyState)return e();document.addEventListener("DOMContentLoaded",e)}}}).default;;
this.wp=this.wp||{},this.wp.escapeHtml=function(e){var t={};function n(r){if(t[r])return t[r].exports;var u=t[r]={i:r,l:!1,exports:{}};return e[r].call(u.exports,u,u.exports,n),u.l=!0,u.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var u in e)n.d(r,u,function(t){return e[t]}.bind(null,u));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=324)}({324:function(e,t,n){"use strict";n.r(t),n.d(t,"escapeAmpersand",(function(){return u})),n.d(t,"escapeQuotationMark",(function(){return o})),n.d(t,"escapeLessThan",(function(){return i})),n.d(t,"escapeAttribute",(function(){return c})),n.d(t,"escapeHTML",(function(){return a})),n.d(t,"escapeEditableHTML",(function(){return f})),n.d(t,"isValidAttributeName",(function(){return p}));var r=/[\u007F-\u009F "'>/="\uFDD0-\uFDEF]/;function u(e){return e.replace(/&(?!([a-z0-9]+|#[0-9]+|#x[a-f0-9]+);)/gi,"&amp;")}function o(e){return e.replace(/"/g,"&quot;")}function i(e){return e.replace(/</g,"&lt;")}function c(e){return function(e){return e.replace(/>/g,"&gt;")}(o(u(e)))}function a(e){return i(u(e))}function f(e){return i(e.replace(/&/g,"&amp;"))}function p(e){return!r.test(e)}}});;
!function(t,e){for(var n in e)t[n]=e[n]}(window,function(t){function e(e){for(var n,r,o=e[0],s=e[1],a=0,c=[];a<o.length;a++)r=o[a],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&c.push(i[r][0]),i[r]=0;for(n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n]);for(u&&u(e);c.length;)c.shift()()}var n={},r={10:0},i={10:0};function o(e){if(n[e])return n[e].exports;var r=n[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.e=function(t){var e=[];r[t]?e.push(r[t]):0!==r[t]&&{13:1}[t]&&e.push(r[t]=new Promise((function(e,n){for(var i="rtl"===document.dir?({13:"vendors~swiper"}[t]||t)+"."+{13:"49456f3f930a97df7664"}[t]+".rtl.css":({13:"vendors~swiper"}[t]||t)+"."+{13:"49456f3f930a97df7664"}[t]+".css",s=o.p+i,a=document.getElementsByTagName("link"),c=0;c<a.length;c++){var u=(l=a[c]).getAttribute("data-href")||l.getAttribute("href");if("stylesheet"===l.rel&&(u===i||u===s))return e()}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){var l;if((u=(l=f[c]).getAttribute("data-href"))===i||u===s)return e()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.setAttribute("data-webpack",!0),d.onload=e,d.onerror=function(e){var i=e&&e.target&&e.target.src||s,o=new Error("Loading CSS chunk "+t+" failed.\n("+i+")");o.code="CSS_CHUNK_LOAD_FAILED",o.request=i,delete r[t],d.parentNode.removeChild(d),n(o)},d.href=s,document.getElementsByTagName("head")[0].appendChild(d)})).then((function(){r[t]=0})));var n=i[t];if(0!==n)if(n)e.push(n[2]);else{var s=new Promise((function(e,r){n=i[t]=[e,r]}));e.push(n[2]=s);var a,c=document.createElement("script");c.charset="utf-8",c.timeout=120,o.nc&&c.setAttribute("nonce",o.nc),c.src=function(t){return o.p+""+({13:"vendors~swiper"}[t]||t)+"."+{13:"49456f3f930a97df7664"}[t]+".js"}(t);var u=new Error;a=function(e){c.onerror=c.onload=null,clearTimeout(f);var n=i[t];if(0!==n){if(n){var r=e&&("load"===e.type?"missing":e.type),o=e&&e.target&&e.target.src;u.message="Loading chunk "+t+" failed.\n("+r+": "+o+")",u.name="ChunkLoadError",u.type=r,u.request=o,n[1](u)}i[t]=void 0}};var f=setTimeout((function(){a({type:"timeout",target:c})}),12e4);c.onerror=c.onload=a,document.head.appendChild(c)}return Promise.all(e)},o.m=t,o.c=n,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o.oe=function(t){throw console.error(t),t};var s=window.webpackJsonp=window.webpackJsonp||[],a=s.push.bind(s);s.push=e,s=s.slice();for(var c=0;c<s.length;c++)e(s[c]);var u=a;return o(o.s=274)}({100:function(t,e,n){},22:function(t,e,n){var r=n(57),i=n(58),o=n(59);t.exports=function(t,e){return r(t)||i(t,e)||o()}},274:function(t,e,n){n(37),t.exports=n(275)},275:function(t,e,n){"use strict";n.r(e);var r=n(5),i=n(53),o=n.n(i),s=n(38),a=n(67),c=n(36);"undefined"!=typeof window&&o()((function(){var t=document.getElementsByClassName("wp-block-jetpack-slideshow");Object(r.forEach)(t,(function(t){var e=t.dataset,n=e.autoplay,r=e.delay,i=e.effect,o=window.matchMedia("(prefers-reduced-motion: reduce)").matches,u=n&&!o,f=t.getElementsByClassName("swiper-container")[0],l=null;Object(a.a)(f,{autoplay:!!u&&{delay:1e3*r,disableOnInteraction:!1},effect:i,init:!0,initialSlide:0,loop:!0,keyboard:{enabled:!0,onlyInViewport:!0}},{init:c.b,imagesReady:c.d,paginationRender:c.c,transitionEnd:c.a}).then((function(t){new s.a((function(){l&&(cancelAnimationFrame(l),l=null),l=requestAnimationFrame((function(){Object(c.d)(t),t.update()}))})).observe(t.el)})).catch((function(){t.querySelector(".wp-block-jetpack-slideshow_container").classList.add("wp-swiper-initialized")}))}))}))},29:function(t,e){function n(t,e,n,r,i,o,s){try{var a=t[o](s),c=a.value}catch(u){return void n(u)}a.done?e(c):Promise.resolve(c).then(r,i)}t.exports=function(t){return function(){var e=this,r=arguments;return new Promise((function(i,o){var s=t.apply(e,r);function a(t){n(s,i,o,a,c,"next",t)}function c(t){n(s,i,o,a,c,"throw",t)}a(void 0)}))}}},31:function(t,e,n){"object"==typeof window&&window.Jetpack_Block_Assets_Base_Url&&(n.p=window.Jetpack_Block_Assets_Base_Url)},36:function(t,e,n){"use strict";n.d(e,"a",(function(){return l})),n.d(e,"b",(function(){return u})),n.d(e,"c",(function(){return d})),n.d(e,"d",(function(){return f}));var r=n(68),i=n(5),o=16/9,s=.8,a=600,c="wp-block-jetpack-slideshow_autoplay-paused";function u(t){f(t),l(t),t.el.querySelector(".wp-block-jetpack-slideshow_button-pause").addEventListener("click",(function(){t.el&&(t.el.classList.contains(c)?(t.el.classList.remove(c),t.autoplay.start(),this.setAttribute("aria-label","Pause Slideshow")):(t.el.classList.add(c),t.autoplay.stop(),this.setAttribute("aria-label","Play Slideshow")))}))}function f(t){if(t&&t.el){var e=t.el.querySelector('.swiper-slide[data-swiper-slide-index="0"] img');if(e){var n=e.clientWidth/e.clientHeight,r=Math.max(Math.min(n,o),1),i="undefined"!=typeof window?window.innerHeight*s:a,c=Math.min(t.width/r,i),u="".concat(Math.floor(c),"px"),f="".concat(Math.floor(c/2),"px");t.el.classList.add("wp-swiper-initialized"),t.wrapperEl.style.height=u,t.el.querySelector(".wp-block-jetpack-slideshow_button-prev").style.top=f,t.el.querySelector(".wp-block-jetpack-slideshow_button-next").style.top=f}}}function l(t){Object(i.forEach)(t.slides,(function(e,n){e.setAttribute("aria-hidden",n===t.activeIndex?"false":"true"),n===t.activeIndex?e.setAttribute("tabindex","-1"):e.removeAttribute("tabindex")})),function(t){var e=t.slides[t.activeIndex];if(e){var n=e.getElementsByTagName("FIGCAPTION")[0],i=e.getElementsByTagName("IMG")[0];t.a11y.liveRegion&&(t.a11y.liveRegion[0].innerHTML=n?n.innerHTML:Object(r.escapeHTML)(i.alt))}}(t)}function d(t){Object(i.forEach)(t.pagination.bullets,(function(e){e.addEventListener("click",(function(){var e=t.slides[t.realIndex];setTimeout((function(){e.focus()}),500)}))}))}},37:function(t,e,n){"use strict";n.r(e);n(31)},38:function(t,e,n){"use strict";var r=function(){if("undefined"!=typeof Map)return Map;function t(t,e){var n=-1;return t.some((function(t,r){return t[0]===e&&(n=r,!0)})),n}return(function(){function e(){this.__entries__=[]}return Object.defineProperty(e.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),e.prototype.get=function(e){var n=t(this.__entries__,e),r=this.__entries__[n];return r&&r[1]},e.prototype.set=function(e,n){var r=t(this.__entries__,e);~r?this.__entries__[r][1]=n:this.__entries__.push([e,n])},e.prototype.delete=function(e){var n=this.__entries__,r=t(n,e);~r&&n.splice(r,1)},e.prototype.has=function(e){return!!~t(this.__entries__,e)},e.prototype.clear=function(){this.__entries__.splice(0)},e.prototype.forEach=function(t,e){void 0===e&&(e=null);for(var n=0,r=this.__entries__;n<r.length;n++){var i=r[n];t.call(e,i[1],i[0])}},e}())}(),i="undefined"!=typeof window&&"undefined"!=typeof document&&window.document===document,o="undefined"!=typeof window&&window.Math===Math?window:"undefined"!=typeof self&&self.Math===Math?self:"undefined"!=typeof window&&window.Math===Math?window:Function("return this")(),s="function"==typeof requestAnimationFrame?requestAnimationFrame.bind(o):function(t){return setTimeout((function(){return t(Date.now())}),1e3/60)},a=2;var c=20,u=["top","right","bottom","left","width","height","size","weight"],f="undefined"!=typeof MutationObserver,l=function(){function t(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=function(t,e){var n=!1,r=!1,i=0;function o(){n&&(n=!1,t()),r&&u()}function c(){s(o)}function u(){var t=Date.now();if(n){if(t-i<a)return;r=!0}else n=!0,r=!1,setTimeout(c,e);i=t}return u}(this.refresh.bind(this),c)}return t.prototype.addObserver=function(t){~this.observers_.indexOf(t)||this.observers_.push(t),this.connected_||this.connect_()},t.prototype.removeObserver=function(t){var e=this.observers_,n=e.indexOf(t);~n&&e.splice(n,1),!e.length&&this.connected_&&this.disconnect_()},t.prototype.refresh=function(){this.updateObservers_()&&this.refresh()},t.prototype.updateObservers_=function(){var t=this.observers_.filter((function(t){return t.gatherActive(),t.hasActive()}));return t.forEach((function(t){return t.broadcastActive()})),t.length>0},t.prototype.connect_=function(){i&&!this.connected_&&(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),f?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},t.prototype.disconnect_=function(){i&&this.connected_&&(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},t.prototype.onTransitionEnd_=function(t){var e=t.propertyName,n=void 0===e?"":e;u.some((function(t){return!!~n.indexOf(t)}))&&this.refresh()},t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},t.instance_=null,t}(),d=function(t,e){for(var n=0,r=Object.keys(e);n<r.length;n++){var i=r[n];Object.defineProperty(t,i,{value:e[i],enumerable:!1,writable:!1,configurable:!0})}return t},h=function(t){return t&&t.ownerDocument&&t.ownerDocument.defaultView||o},p=_(0,0,0,0);function v(t){return parseFloat(t)||0}function b(t){for(var e=[],n=1;n<arguments.length;n++)e[n-1]=arguments[n];return e.reduce((function(e,n){return e+v(t["border-"+n+"-width"])}),0)}function m(t){var e=t.clientWidth,n=t.clientHeight;if(!e&&!n)return p;var r=h(t).getComputedStyle(t),i=function(t){for(var e={},n=0,r=["top","right","bottom","left"];n<r.length;n++){var i=r[n],o=t["padding-"+i];e[i]=v(o)}return e}(r),o=i.left+i.right,s=i.top+i.bottom,a=v(r.width),c=v(r.height);if("border-box"===r.boxSizing&&(Math.round(a+o)!==e&&(a-=b(r,"left","right")+o),Math.round(c+s)!==n&&(c-=b(r,"top","bottom")+s)),!function(t){return t===h(t).document.documentElement}(t)){var u=Math.round(a+o)-e,f=Math.round(c+s)-n;1!==Math.abs(u)&&(a-=u),1!==Math.abs(f)&&(c-=f)}return _(i.left,i.top,a,c)}var y="undefined"!=typeof SVGGraphicsElement?function(t){return t instanceof h(t).SVGGraphicsElement}:function(t){return t instanceof h(t).SVGElement&&"function"==typeof t.getBBox};function w(t){return i?y(t)?function(t){var e=t.getBBox();return _(0,0,e.width,e.height)}(t):m(t):p}function _(t,e,n,r){return{x:t,y:e,width:n,height:r}}var g=function(){function t(t){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=_(0,0,0,0),this.target=t}return t.prototype.isActive=function(){var t=w(this.target);return this.contentRect_=t,t.width!==this.broadcastWidth||t.height!==this.broadcastHeight},t.prototype.broadcastRect=function(){var t=this.contentRect_;return this.broadcastWidth=t.width,this.broadcastHeight=t.height,t},t}(),E=function(t,e){var n,r,i,o,s,a,c,u=(r=(n=e).x,i=n.y,o=n.width,s=n.height,a="undefined"!=typeof DOMRectReadOnly?DOMRectReadOnly:Object,c=Object.create(a.prototype),d(c,{x:r,y:i,width:o,height:s,top:i,right:r+o,bottom:s+i,left:r}),c);d(this,{target:t,contentRect:u})},O=function(){function t(t,e,n){if(this.activeObservations_=[],this.observations_=new r,"function"!=typeof t)throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=t,this.controller_=e,this.callbackCtx_=n}return t.prototype.observe=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof h(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)||(e.set(t,new g(t)),this.controller_.addObserver(this),this.controller_.refresh())}},t.prototype.unobserve=function(t){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if("undefined"!=typeof Element&&Element instanceof Object){if(!(t instanceof h(t).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(t)&&(e.delete(t),e.size||this.controller_.removeObserver(this))}},t.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},t.prototype.gatherActive=function(){var t=this;this.clearActive(),this.observations_.forEach((function(e){e.isActive()&&t.activeObservations_.push(e)}))},t.prototype.broadcastActive=function(){if(this.hasActive()){var t=this.callbackCtx_,e=this.activeObservations_.map((function(t){return new E(t.target,t.broadcastRect())}));this.callback_.call(t,e,t),this.clearActive()}},t.prototype.clearActive=function(){this.activeObservations_.splice(0)},t.prototype.hasActive=function(){return this.activeObservations_.length>0},t}(),x="undefined"!=typeof WeakMap?new WeakMap:new r,k=function t(e){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var n=l.getInstance(),r=new O(e,n,this);x.set(this,r)};["observe","unobserve","disconnect"].forEach((function(t){k.prototype[t]=function(){var e;return(e=x.get(this))[t].apply(e,arguments)}}));var A=void 0!==o.ResizeObserver?o.ResizeObserver:k;e.a=A},5:function(t,e){!function(){t.exports=this.lodash}()},53:function(t,e){!function(){t.exports=this.wp.domReady}()},57:function(t,e){t.exports=function(t){if(Array.isArray(t))return t}},58:function(t,e){t.exports=function(t,e){var n=[],r=!0,i=!1,o=void 0;try{for(var s,a=t[Symbol.iterator]();!(r=(s=a.next()).done)&&(n.push(s.value),!e||n.length!==e);r=!0);}catch(c){i=!0,o=c}finally{try{r||null==a.return||a.return()}finally{if(i)throw o}}return n}},59:function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}},67:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var r=n(22),i=n.n(r),o=n(29),s=n.n(o),a=n(5);n(100);function c(){return u.apply(this,arguments)}function u(){return(u=s()(regeneratorRuntime.mark((function t(){var e,r,o,s,c,u,f,l=arguments;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=l.length>0&&void 0!==l[0]?l[0]:".swiper-container",r=l.length>1&&void 0!==l[1]?l[1]:{},o=l.length>2&&void 0!==l[2]?l[2]:{},s={effect:"slide",grabCursor:!0,init:!0,initialSlide:0,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},pagination:{bulletElement:"button",clickable:!0,el:".swiper-pagination",type:"bullets"},preventClicksPropagation:!1,releaseFormElements:!1,setWrapperSize:!0,touchStartPreventDefault:!1,on:Object(a.mapValues)(o,(function(t){return function(){t(this)}}))},t.next=6,Promise.all([n.e(13).then(n.t.bind(null,252,7)),n.e(13).then(n.t.bind(null,253,7))]);case 6:return c=t.sent,u=i()(c,1),f=u[0].default,t.abrupt("return",new f(e,Object(a.merge)({},s,r)));case 10:case"end":return t.stop()}}),t)})))).apply(this,arguments)}},68:function(t,e){!function(){t.exports=this.wp.escapeHtml}()}}));;
/* global WPCOM_sharing_counts, grecaptcha */
var sharing_js_options;
if ( sharing_js_options && sharing_js_options.counts ) {
	var WPCOMSharing = {
		done_urls: [],
		get_counts: function() {
			var url, requests, id, service, service_request;

			if ( 'undefined' === typeof WPCOM_sharing_counts ) {
				return;
			}

			for ( url in WPCOM_sharing_counts ) {
				id = WPCOM_sharing_counts[ url ];

				if ( 'undefined' !== typeof WPCOMSharing.done_urls[ id ] ) {
					continue;
				}

				requests = {
					// Pinterest handles share counts for both http and https
					pinterest: [
						window.location.protocol +
							'//api.pinterest.com/v1/urls/count.json?callback=WPCOMSharing.update_pinterest_count&url=' +
							encodeURIComponent( url ),
					],
					// Facebook protocol summing has been shown to falsely double counts, so we only request the current URL
					facebook: [
						window.location.protocol +
							'//graph.facebook.com/?callback=WPCOMSharing.update_facebook_count&ids=' +
							encodeURIComponent( url ),
					],
				};

				for ( service in requests ) {
					if ( ! jQuery( 'a[data-shared=sharing-' + service + '-' + id + ']' ).length ) {
						continue;
					}

					while ( ( service_request = requests[ service ].pop() ) ) {
						jQuery.getScript( service_request );
					}

					if ( sharing_js_options.is_stats_active ) {
						WPCOMSharing.bump_sharing_count_stat( service );
					}
				}

				WPCOMSharing.done_urls[ id ] = true;
			}
		},

		// get the version of the url that was stored in the dom (sharing-$service-URL)
		get_permalink: function( url ) {
			if ( 'https:' === window.location.protocol ) {
				url = url.replace( /^http:\/\//i, 'https://' );
			} else {
				url = url.replace( /^https:\/\//i, 'http://' );
			}

			return url;
		},
		update_facebook_count: function( data ) {
			var url, permalink;

			if ( ! data ) {
				return;
			}

			for ( url in data ) {
				if (
					! data.hasOwnProperty( url ) ||
					! data[ url ].share ||
					! data[ url ].share.share_count
				) {
					continue;
				}

				permalink = WPCOMSharing.get_permalink( url );

				if ( ! ( permalink in WPCOM_sharing_counts ) ) {
					continue;
				}

				WPCOMSharing.inject_share_count(
					'sharing-facebook-' + WPCOM_sharing_counts[ permalink ],
					data[ url ].share.share_count
				);
			}
		},
		update_pinterest_count: function( data ) {
			if ( 'undefined' !== typeof data.count && data.count * 1 > 0 ) {
				WPCOMSharing.inject_share_count(
					'sharing-pinterest-' + WPCOM_sharing_counts[ data.url ],
					data.count
				);
			}
		},
		inject_share_count: function( id, count ) {
			var $share = jQuery( 'a[data-shared=' + id + '] > span' );
			$share.find( '.share-count' ).remove();
			$share.append(
				'<span class="share-count">' + WPCOMSharing.format_count( count ) + '</span>'
			);
		},
		format_count: function( count ) {
			if ( count < 1000 ) {
				return count;
			}
			if ( count >= 1000 && count < 10000 ) {
				return String( count ).substring( 0, 1 ) + 'K+';
			}
			return '10K+';
		},
		bump_sharing_count_stat: function( service ) {
			new Image().src =
				document.location.protocol +
				'//pixel.wp.com/g.gif?v=wpcom-no-pv&x_sharing-count-request=' +
				service +
				'&r=' +
				Math.random();
		},
	};
}

( function( $ ) {
	var $body, $sharing_email;

	$.fn.extend( {
		share_is_email: function() {
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(
				this.val()
			);
		},
	} );

	$body = $( document.body ).on( 'post-load', WPCOMSharing_do );
	$( document ).ready( function() {
		$sharing_email = $( '#sharing_email' );
		$body.append( $sharing_email );
		WPCOMSharing_do();
	} );

	function WPCOMSharing_do() {
		var $more_sharing_buttons;
		if ( 'undefined' !== typeof WPCOMSharing ) {
			WPCOMSharing.get_counts();
		}
		$more_sharing_buttons = $( '.sharedaddy a.sharing-anchor' );

		$more_sharing_buttons.click( function() {
			return false;
		} );

		$( '.sharedaddy a' ).each( function() {
			if (
				$( this ).attr( 'href' ) &&
				$( this )
					.attr( 'href' )
					.indexOf( 'share=' ) !== -1
			) {
				$( this ).attr( 'href', $( this ).attr( 'href' ) + '&nb=1' );
			}
		} );

		// Show hidden buttons

		// Touchscreen device: use click.
		// Non-touchscreen device: use click if not already appearing due to a hover event
		$more_sharing_buttons.on( 'click', function() {
			var $more_sharing_button = $( this ),
				$more_sharing_pane = $more_sharing_button.parents( 'div:first' ).find( '.inner' );

			if ( $more_sharing_pane.is( ':animated' ) ) {
				// We're in the middle of some other event's animation
				return;
			}

			if ( true === $more_sharing_pane.data( 'justSlid' ) ) {
				// We just finished some other event's animation - don't process click event so that slow-to-react-clickers don't get confused
				return;
			}

			$sharing_email.slideUp( 200 );

			$more_sharing_pane
				.css( {
					left: $more_sharing_button.position().left + 'px',
					top: $more_sharing_button.position().top + $more_sharing_button.height() + 3 + 'px',
				} )
				.slideToggle( 200 );
		} );

		if ( document.ontouchstart === undefined ) {
			// Non-touchscreen device: use hover/mouseout with delay
			$more_sharing_buttons.hover(
				function() {
					var $more_sharing_button = $( this ),
						$more_sharing_pane = $more_sharing_button.parents( 'div:first' ).find( '.inner' ),
						timer;

					if ( ! $more_sharing_pane.is( ':animated' ) ) {
						// Create a timer to make the area appear if the mouse hovers for a period
						timer = setTimeout( function() {
							var handler_item_leave,
								handler_item_enter,
								handler_original_leave,
								handler_original_enter,
								close_it;

							$sharing_email.slideUp( 200 );

							$more_sharing_pane.data( 'justSlid', true );
							$more_sharing_pane
								.css( {
									left: $more_sharing_button.position().left + 'px',
									top:
										$more_sharing_button.position().top + $more_sharing_button.height() + 3 + 'px',
								} )
								.slideDown( 200, function() {
									// Mark the item as have being appeared by the hover
									$more_sharing_button.data( 'hasoriginal', true ).data( 'hasitem', false );

									setTimeout( function() {
										$more_sharing_pane.data( 'justSlid', false );
									}, 300 );

									$more_sharing_pane
										.mouseleave( handler_item_leave )
										.mouseenter( handler_item_enter );
									$more_sharing_button
										.mouseleave( handler_original_leave )
										.mouseenter( handler_original_enter );
								} );

							// The following handlers take care of the mouseenter/mouseleave for the share button and the share area - if both are left then we close the share area
							handler_item_leave = function() {
								$more_sharing_button.data( 'hasitem', false );

								if ( $more_sharing_button.data( 'hasoriginal' ) === false ) {
									var timer = setTimeout( close_it, 800 );
									$more_sharing_button.data( 'timer2', timer );
								}
							};

							handler_item_enter = function() {
								$more_sharing_button.data( 'hasitem', true );
								clearTimeout( $more_sharing_button.data( 'timer2' ) );
							};

							handler_original_leave = function() {
								$more_sharing_button.data( 'hasoriginal', false );

								if ( $more_sharing_button.data( 'hasitem' ) === false ) {
									var timer = setTimeout( close_it, 800 );
									$more_sharing_button.data( 'timer2', timer );
								}
							};

							handler_original_enter = function() {
								$more_sharing_button.data( 'hasoriginal', true );
								clearTimeout( $more_sharing_button.data( 'timer2' ) );
							};

							close_it = function() {
								$more_sharing_pane.data( 'justSlid', true );
								$more_sharing_pane.slideUp( 200, function() {
									setTimeout( function() {
										$more_sharing_pane.data( 'justSlid', false );
									}, 300 );
								} );

								// Clear all hooks
								$more_sharing_button
									.unbind( 'mouseleave', handler_original_leave )
									.unbind( 'mouseenter', handler_original_enter );
								$more_sharing_pane
									.unbind( 'mouseleave', handler_item_leave )
									.unbind( 'mouseenter', handler_item_leave );
								return false;
							};
						}, 200 );

						// Remember the timer so we can detect it on the mouseout
						$more_sharing_button.data( 'timer', timer );
					}
				},
				function() {
					// Mouse out - remove any timer
					$more_sharing_buttons.each( function() {
						clearTimeout( $( this ).data( 'timer' ) );
					} );
					$more_sharing_buttons.data( 'timer', false );
				}
			);
		} else {
			$( document.body ).addClass( 'jp-sharing-input-touch' );
		}

		$( document ).click( function() {
			// Click outside
			// remove any timer
			$more_sharing_buttons.each( function() {
				clearTimeout( $( this ).data( 'timer' ) );
			} );
			$more_sharing_buttons.data( 'timer', false );

			// slide down forcibly
			$( '.sharedaddy .inner' ).slideUp();
		} );

		// Add click functionality
		$( '.sharedaddy ul' ).each( function() {
			if ( 'yep' === $( this ).data( 'has-click-events' ) ) {
				return;
			}
			$( this ).data( 'has-click-events', 'yep' );

			var printUrl = function( uniqueId, urlToPrint ) {
				$( 'body:first' ).append(
					'<iframe style="position:fixed;top:100;left:100;height:1px;width:1px;border:none;" id="printFrame-' +
						uniqueId +
						'" name="printFrame-' +
						uniqueId +
						'" src="' +
						urlToPrint +
						'" onload="frames[\'printFrame-' +
						uniqueId +
						"'].focus();frames['printFrame-" +
						uniqueId +
						'\'].print();"></iframe>'
				);
			};

			// Print button
			$( this )
				.find( 'a.share-print' )
				.click( function() {
					var ref = $( this ).attr( 'href' ),
						do_print = function() {
							if ( ref.indexOf( '#print' ) === -1 ) {
								var uid = new Date().getTime();
								printUrl( uid, ref );
							} else {
								print();
							}
						};

					// Is the button in a dropdown?
					if ( $( this ).parents( '.sharing-hidden' ).length > 0 ) {
						$( this )
							.parents( '.inner' )
							.slideUp( 0, function() {
								do_print();
							} );
					} else {
						do_print();
					}

					return false;
				} );

			// Press This button
			$( this )
				.find( 'a.share-press-this' )
				.click( function() {
					var s = '';

					if ( window.getSelection ) {
						s = window.getSelection();
					} else if ( document.getSelection ) {
						s = document.getSelection();
					} else if ( document.selection ) {
						s = document.selection.createRange().text;
					}

					if ( s ) {
						$( this ).attr( 'href', $( this ).attr( 'href' ) + '&sel=' + encodeURI( s ) );
					}

					if (
						! window.open(
							$( this ).attr( 'href' ),
							't',
							'toolbar=0,resizable=1,scrollbars=1,status=1,width=720,height=570'
						)
					) {
						document.location.href = $( this ).attr( 'href' );
					}

					return false;
				} );

			// Email button
			$( 'a.share-email', this ).on( 'click', function() {
				var url = $( this ).attr( 'href' );
				var currentDomain = window.location.protocol + '//' + window.location.hostname + '/';
				if ( url.indexOf( currentDomain ) !== 0 ) {
					return true;
				}

				if ( $sharing_email.is( ':visible' ) ) {
					$sharing_email.slideUp( 200 );
				} else {
					$( '.sharedaddy .inner' ).slideUp();

					$( '#sharing_email .response' ).remove();
					$( '#sharing_email form' ).show();
					$( '#sharing_email form input[type=submit]' ).removeAttr( 'disabled' );
					$( '#sharing_email form a.sharing_cancel' ).show();

					// Reset reCATPCHA if exists.
					if (
						'object' === typeof grecaptcha &&
						'function' === typeof grecaptcha.reset &&
						window.___grecaptcha_cfg.count
					) {
						grecaptcha.reset();
					}

					// Show dialog
					$sharing_email
						.css( {
							left: $( this ).offset().left + 'px',
							top: $( this ).offset().top + $( this ).height() + 'px',
						} )
						.slideDown( 200 );

					// Hook up other buttons
					$( '#sharing_email a.sharing_cancel' )
						.unbind( 'click' )
						.click( function() {
							$( '#sharing_email .errors' ).hide();
							$sharing_email.slideUp( 200 );
							$( '#sharing_background' ).fadeOut();
							return false;
						} );

					// Submit validation
					$( '#sharing_email input[type=submit]' )
						.unbind( 'click' )
						.click( function() {
							var form = $( this ).parents( 'form' );
							var source_email_input = form.find( 'input[name=source_email]' );
							var target_email_input = form.find( 'input[name=target_email]' );

							// Disable buttons + enable loading icon
							$( this ).prop( 'disabled', true );
							form.find( 'a.sharing_cancel' ).hide();
							form.find( 'img.loading' ).show();

							$( '#sharing_email .errors' ).hide();
							$( '#sharing_email .error' ).removeClass( 'error' );

							if ( ! source_email_input.share_is_email() ) {
								source_email_input.addClass( 'error' );
							}

							if ( ! target_email_input.share_is_email() ) {
								target_email_input.addClass( 'error' );
							}

							if ( $( '#sharing_email .error' ).length === 0 ) {
								// AJAX send the form
								$.ajax( {
									url: url,
									type: 'POST',
									data: form.serialize(),
									success: function( response ) {
										form.find( 'img.loading' ).hide();

										if ( response === '1' || response === '2' || response === '3' ) {
											$( '#sharing_email .errors-' + response ).show();
											form.find( 'input[type=submit]' ).removeAttr( 'disabled' );
											form.find( 'a.sharing_cancel' ).show();

											if (
												'object' === typeof grecaptcha &&
												'function' === typeof grecaptcha.reset
											) {
												grecaptcha.reset();
											}
										} else {
											$( '#sharing_email form' ).hide();
											$sharing_email.append( response );
											$( '#sharing_email a.sharing_cancel' ).click( function() {
												$sharing_email.slideUp( 200 );
												$( '#sharing_background' ).fadeOut();
												return false;
											} );
										}
									},
								} );

								return false;
							}

							form.find( 'img.loading' ).hide();
							form.find( 'input[type=submit]' ).removeAttr( 'disabled' );
							form.find( 'a.sharing_cancel' ).show();
							$( '#sharing_email .errors-1' ).show();

							return false;
						} );
				}

				return false;
			} );
		} );

		$( 'li.share-email, li.share-custom a.sharing-anchor' ).addClass( 'share-service-visible' );
	}
} )( jQuery );
;
