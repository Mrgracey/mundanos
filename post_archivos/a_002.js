/* Detect-zoom
 * -----------
 * Cross Browser Zoom and Pixel Ratio Detector
 * Version 1.0.4 | Apr 1 2013
 * dual-licensed under the WTFPL and MIT license
 * Maintained by https://github/tombigel
 * Original developer https://github.com/yonran
 */

//AMD and CommonJS initialization copied from https://github.com/zohararad/audio5js
(function (root, ns, factory) {
    "use strict";

    if (typeof (module) !== 'undefined' && module.exports) { // CommonJS
        module.exports = factory(ns, root);
    } else if (typeof (define) === 'function' && define.amd) { // AMD
        define("factory", function () {
            return factory(ns, root);
        });
    } else {
        root[ns] = factory(ns, root);
    }

}(window, 'detectZoom', function () {

    /**
     * Use devicePixelRatio if supported by the browser
     * @return {Number}
     * @private
     */
    var devicePixelRatio = function () {
        return window.devicePixelRatio || 1;
    };

    /**
     * Fallback function to set default values
     * @return {Object}
     * @private
     */
    var fallback = function () {
        return {
            zoom: 1,
            devicePxPerCssPx: 1
        };
    };
    /**
     * IE 8 and 9: no trick needed!
     * TODO: Test on IE10 and Windows 8 RT
     * @return {Object}
     * @private
     **/
    var ie8 = function () {
        var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * For IE10 we need to change our technique again...
     * thanks https://github.com/stefanvanburen
     * @return {Object}
     * @private
     */
    var ie10 = function () {
        var zoom = Math.round((document.documentElement.offsetHeight / window.innerHeight) * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * Mobile WebKit
     * the trick: window.innerWIdth is in CSS pixels, while
     * screen.width and screen.height are in system pixels.
     * And there are no scrollbars to mess up the measurement.
     * @return {Object}
     * @private
     */
    var webkitMobile = function () {
        var deviceWidth = (Math.abs(window.orientation) == 90) ? screen.height : screen.width;
        var zoom = deviceWidth / window.innerWidth;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * Desktop Webkit
     * the trick: an element's clientHeight is in CSS pixels, while you can
     * set its line-height in system pixels using font-size and
     * -webkit-text-size-adjust:none.
     * device-pixel-ratio: http://www.webkit.org/blog/55/high-dpi-web-sites/
     *
     * Previous trick (used before http://trac.webkit.org/changeset/100847):
     * documentElement.scrollWidth is in CSS pixels, while
     * document.width was in system pixels. Note that this is the
     * layout width of the document, which is slightly different from viewport
     * because document width does not include scrollbars and might be wider
     * due to big elements.
     * @return {Object}
     * @private
     */
    var webkit = function () {
        var important = function (str) {
            return str.replace(/;/g, " !important;");
        };

        var div = document.createElement('div');
        div.innerHTML = "1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0";
        div.setAttribute('style', important('font: 100px/1em sans-serif; -webkit-text-size-adjust: none; text-size-adjust: none; height: auto; width: 1em; padding: 0; overflow: visible;'));

        // The container exists so that the div will be laid out in its own flow
        // while not impacting the layout, viewport size, or display of the
        // webpage as a whole.
        // Add !important and relevant CSS rule resets
        // so that other rules cannot affect the results.
        var container = document.createElement('div');
        container.setAttribute('style', important('width:0; height:0; overflow:hidden; visibility:hidden; position: absolute;'));
        container.appendChild(div);

        document.body.appendChild(container);
        var zoom = 1000 / div.clientHeight;
        zoom = Math.round(zoom * 100) / 100;
        document.body.removeChild(container);

        return{
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * no real trick; device-pixel-ratio is the ratio of device dpi / css dpi.
     * (Note that this is a different interpretation than Webkit's device
     * pixel ratio, which is the ratio device dpi / system dpi).
     *
     * Also, for Mozilla, there is no difference between the zoom factor and the device ratio.
     *
     * @return {Object}
     * @private
     */
    var firefox4 = function () {
        var zoom = mediaQueryBinarySearch('min--moz-device-pixel-ratio', '', 0, 10, 20, 0.0001);
        zoom = Math.round(zoom * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom
        };
    };

    /**
     * Firefox 18.x
     * Mozilla added support for devicePixelRatio to Firefox 18,
     * but it is affected by the zoom level, so, like in older
     * Firefox we can't tell if we are in zoom mode or in a device
     * with a different pixel ratio
     * @return {Object}
     * @private
     */
    var firefox18 = function () {
        return {
            zoom: firefox4().zoom,
            devicePxPerCssPx: devicePixelRatio()
        };
    };

    /**
     * works starting Opera 11.11
     * the trick: outerWidth is the viewport width including scrollbars in
     * system px, while innerWidth is the viewport width including scrollbars
     * in CSS px
     * @return {Object}
     * @private
     */
    var opera11 = function () {
        var zoom = window.top.outerWidth / window.top.innerWidth;
        zoom = Math.round(zoom * 100) / 100;
        return {
            zoom: zoom,
            devicePxPerCssPx: zoom * devicePixelRatio()
        };
    };

    /**
     * Use a binary search through media queries to find zoom level in Firefox
     * @param property
     * @param unit
     * @param a
     * @param b
     * @param maxIter
     * @param epsilon
     * @return {Number}
     */
    var mediaQueryBinarySearch = function (property, unit, a, b, maxIter, epsilon) {
        var matchMedia;
        var head, style, div;
        if (window.matchMedia) {
            matchMedia = window.matchMedia;
        } else {
            head = document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            head.appendChild(style);

            div = document.createElement('div');
            div.className = 'mediaQueryBinarySearch';
            div.style.display = 'none';
            document.body.appendChild(div);

            matchMedia = function (query) {
                style.sheet.insertRule('@media ' + query + '{.mediaQueryBinarySearch ' + '{text-decoration: underline} }', 0);
                var matched = getComputedStyle(div, null).textDecoration == 'underline';
                style.sheet.deleteRule(0);
                return {matches: matched};
            };
        }
        var ratio = binarySearch(a, b, maxIter);
        if (div) {
            head.removeChild(style);
            document.body.removeChild(div);
        }
        return ratio;

        function binarySearch(a, b, maxIter) {
            var mid = (a + b) / 2;
            if (maxIter <= 0 || b - a < epsilon) {
                return mid;
            }
            var query = "(" + property + ":" + mid + unit + ")";
            if (matchMedia(query).matches) {
                return binarySearch(mid, b, maxIter - 1);
            } else {
                return binarySearch(a, mid, maxIter - 1);
            }
        }
    };

    /**
     * Generate detection function
     * @private
     */
    var detectFunction = (function () {
        var func = fallback;
        //IE8+
        if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
            func = ie8;
        }
        // IE10+ / Touch
        else if (window.navigator.msMaxTouchPoints) {
            func = ie10;
        }
        //Mobile Webkit
        else if ('orientation' in window && typeof document.body.style.webkitMarquee === 'string') {
            func = webkitMobile;
        }
        //WebKit
        else if (typeof document.body.style.webkitMarquee === 'string') {
            func = webkit;
        }
        //Opera
        else if (navigator.userAgent.indexOf('Opera') >= 0) {
            func = opera11;
        }
        //Last one is Firefox
        //FF 18.x
        else if (window.devicePixelRatio) {
            func = firefox18;
        }
        //FF 4.0 - 17.x
        else if (firefox4().zoom > 0.001) {
            func = firefox4;
        }

        return func;
    }());


    return ({

        /**
         * Ratios.zoom shorthand
         * @return {Number} Zoom level
         */
        zoom: function () {
            return detectFunction().zoom;
        },

        /**
         * Ratios.devicePxPerCssPx shorthand
         * @return {Number} devicePxPerCssPx level
         */
        device: function () {
            return detectFunction().devicePxPerCssPx;
        }
    });
}));

var wpcom_img_zoomer = {
        clientHintSupport: {
                gravatar: false,
                files: false,
                photon: false,
                mshots: false,
                staticAssets: false,
                latex: false,
                imgpress: false,
        },
	useHints: false,
	zoomed: false,
	timer: null,
	interval: 1000, // zoom polling interval in millisecond

	// Should we apply width/height attributes to control the image size?
	imgNeedsSizeAtts: function( img ) {
		// Do not overwrite existing width/height attributes.
		if ( img.getAttribute('width') !== null || img.getAttribute('height') !== null )
			return false;
		// Do not apply the attributes if the image is already constrained by a parent element.
		if ( img.width < img.naturalWidth || img.height < img.naturalHeight )
			return false;
		return true;
	},

        hintsFor: function( service ) {
                if ( this.useHints === false ) {
                        return false;
                }
                if ( this.hints() === false ) {
                        return false;
                }
                if ( typeof this.clientHintSupport[service] === "undefined" ) {
                        return false;
                }
                if ( this.clientHintSupport[service] === true ) {
                        return true;
                }
                return false;
        },

	hints: function() {
		try {
			var chrome = window.navigator.userAgent.match(/\sChrome\/([0-9]+)\.[.0-9]+\s/)
			if (chrome !== null) {
				var version = parseInt(chrome[1], 10)
				if (isNaN(version) === false && version >= 46) {
					return true
				}
			}
		} catch (e) {
			return false
		}
		return false
	},

	init: function() {
		var t = this;
		try{
			t.zoomImages();
			t.timer = setInterval( function() { t.zoomImages(); }, t.interval );
		}
		catch(e){
		}
	},

	stop: function() {
		if ( this.timer )
			clearInterval( this.timer );
	},

	getScale: function() {
		var scale = detectZoom.device();
		// Round up to 1.5 or the next integer below the cap.
		if      ( scale <= 1.0 ) scale = 1.0;
		else if ( scale <= 1.5 ) scale = 1.5;
		else if ( scale <= 2.0 ) scale = 2.0;
		else if ( scale <= 3.0 ) scale = 3.0;
		else if ( scale <= 4.0 ) scale = 4.0;
		else                     scale = 5.0;
		return scale;
	},

	shouldZoom: function( scale ) {
		var t = this;
		// Do not operate on hidden frames.
		if ( "innerWidth" in window && !window.innerWidth )
			return false;
		// Don't do anything until scale > 1
		if ( scale == 1.0 && t.zoomed == false )
			return false;
		return true;
	},

	zoomImages: function() {
		var t = this;
		var scale = t.getScale();
		if ( ! t.shouldZoom( scale ) ){
			return;
		}
		t.zoomed = true;
		// Loop through all the <img> elements on the page.
		var imgs = document.getElementsByTagName("img");

		for ( var i = 0; i < imgs.length; i++ ) {
			// Wait for original images to load
			if ( "complete" in imgs[i] && ! imgs[i].complete )
				continue;

			// Skip images that have srcset attributes.
			if ( imgs[i].hasAttribute('srcset') ) {
				continue;
			}

			// Skip images that don't need processing.
			var imgScale = imgs[i].getAttribute("scale");
			if ( imgScale == scale || imgScale == "0" )
				continue;

			// Skip images that have already failed at this scale
			var scaleFail = imgs[i].getAttribute("scale-fail");
			if ( scaleFail && scaleFail <= scale )
				continue;

			// Skip images that have no dimensions yet.
			if ( ! ( imgs[i].width && imgs[i].height ) )
				continue;

			// Skip images from Lazy Load plugins
			if ( ! imgScale && imgs[i].getAttribute("data-lazy-src") && (imgs[i].getAttribute("data-lazy-src") !== imgs[i].getAttribute("src")))
				continue;

			if ( t.scaleImage( imgs[i], scale ) ) {
				// Mark the img as having been processed at this scale.
				imgs[i].setAttribute("scale", scale);
			}
			else {
				// Set the flag to skip this image.
				imgs[i].setAttribute("scale", "0");
			}
		}
	},

	scaleImage: function( img, scale ) {
		var t = this;
		var newSrc = img.src;

                var isFiles = false;
                var isLatex = false;
                var isPhoton = false;

		// Skip slideshow images
		if ( img.parentNode.className.match(/slideshow-slide/) )
			return false;

		// Scale gravatars that have ?s= or ?size=
		if ( img.src.match( /^https?:\/\/([^\/]*\.)?gravatar\.com\/.+[?&](s|size)=/ ) ) {
                        if ( this.hintsFor( "gravatar" ) === true ) {
                                return false;
                        }
			newSrc = img.src.replace( /([?&](s|size)=)(\d+)/, function( $0, $1, $2, $3 ) {
				// Stash the original size
				var originalAtt = "originals",
				originalSize = img.getAttribute(originalAtt);
				if ( originalSize === null ) {
					originalSize = $3;
					img.setAttribute(originalAtt, originalSize);
					if ( t.imgNeedsSizeAtts( img ) ) {
						// Fix width and height attributes to rendered dimensions.
						img.width = img.width;
						img.height = img.height;
					}
				}
				// Get the width/height of the image in CSS pixels
				var size = img.clientWidth;
				// Convert CSS pixels to device pixels
				var targetSize = Math.ceil(img.clientWidth * scale);
				// Don't go smaller than the original size
				targetSize = Math.max( targetSize, originalSize );
				// Don't go larger than the service supports
				targetSize = Math.min( targetSize, 512 );
				return $1 + targetSize;
			});
		}

		// Scale mshots that have width
		else if ( img.src.match(/^https?:\/\/([^\/]+\.)*(wordpress|wp)\.com\/mshots\/.+[?&]w=\d+/) ) {
                        if ( this.hintsFor( "mshots" ) === true ) {
                                return false;
                        }
			newSrc = img.src.replace( /([?&]w=)(\d+)/, function($0, $1, $2) {
				// Stash the original size
				var originalAtt = 'originalw', originalSize = img.getAttribute(originalAtt);
				if ( originalSize === null ) {
					originalSize = $2;
					img.setAttribute(originalAtt, originalSize);
					if ( t.imgNeedsSizeAtts( img ) ) {
						// Fix width and height attributes to rendered dimensions.
						img.width = img.width;
						img.height = img.height;
					}
				}
				// Get the width of the image in CSS pixels
				var size = img.clientWidth;
				// Convert CSS pixels to device pixels
				var targetSize = Math.ceil(size * scale);
				// Don't go smaller than the original size
				targetSize = Math.max( targetSize, originalSize );
				// Don't go bigger unless the current one is actually lacking
				if ( scale > img.getAttribute("scale") && targetSize <= img.naturalWidth )
					targetSize = $2;
				if ( $2 != targetSize )
					return $1 + targetSize;
				return $0;
			});

			// Update height attribute to match width
			newSrc = newSrc.replace( /([?&]h=)(\d+)/, function($0, $1, $2) {
				if ( newSrc == img.src ) {
					return $0;
				}
				// Stash the original size
				var originalAtt = 'originalh', originalSize = img.getAttribute(originalAtt);
				if ( originalSize === null ) {
					originalSize = $2;
					img.setAttribute(originalAtt, originalSize);
				}
				// Get the height of the image in CSS pixels
				var size = img.clientHeight;
				// Convert CSS pixels to device pixels
				var targetSize = Math.ceil(size * scale);
				// Don't go smaller than the original size
				targetSize = Math.max( targetSize, originalSize );
				// Don't go bigger unless the current one is actually lacking
				if ( scale > img.getAttribute("scale") && targetSize <= img.naturalHeight )
					targetSize = $2;
				if ( $2 != targetSize )
					return $1 + targetSize;
				return $0;
			});
		}

		// Scale simple imgpress queries (s0.wp.com) that only specify w/h/fit
		else if ( img.src.match(/^https?:\/\/([^\/.]+\.)*(wp|wordpress)\.com\/imgpress\?(.+)/) ) {
                        if ( this.hintsFor( "imgpress" ) === true ) {
                                return false; 
                        }
			var imgpressSafeFunctions = ["zoom", "url", "h", "w", "fit", "filter", "brightness", "contrast", "colorize", "smooth", "unsharpmask"];
			// Search the query string for unsupported functions.
			var qs = RegExp.$3.split('&');
			for ( var q in qs ) {
				q = qs[q].split('=')[0];
				if ( imgpressSafeFunctions.indexOf(q) == -1 ) {
					return false;
				}
			}
			// Fix width and height attributes to rendered dimensions.
			img.width = img.width;
			img.height = img.height;
			// Compute new src
			if ( scale == 1 )
				newSrc = img.src.replace(/\?(zoom=[^&]+&)?/, '?');
			else
				newSrc = img.src.replace(/\?(zoom=[^&]+&)?/, '?zoom=' + scale + '&');
		}

		// Scale files.wordpress.com, LaTeX, or Photon images (i#.wp.com)
		else if (
			( isFiles = img.src.match(/^https?:\/\/([^\/]+)\.files\.wordpress\.com\/.+[?&][wh]=/) ) ||
			( isLatex = img.src.match(/^https?:\/\/([^\/.]+\.)*(wp|wordpress)\.com\/latex\.php\?(latex|zoom)=(.+)/) ) ||
			( isPhoton = img.src.match(/^https?:\/\/i[\d]{1}\.wp\.com\/(.+)/) )
		) {
                        if ( false !== isFiles && this.hintsFor( "files" ) === true ) {
                                return false
                        }
                        if ( false !== isLatex && this.hintsFor( "latex" ) === true ) {
                                return false
                        }
                        if ( false !== isPhoton && this.hintsFor( "photon" ) === true ) {
                                return false
                        }
			// Fix width and height attributes to rendered dimensions.
			img.width = img.width;
			img.height = img.height;
			// Compute new src
			if ( scale == 1 ) {
				newSrc = img.src.replace(/\?(zoom=[^&]+&)?/, '?');
			} else {
				newSrc = img.src;

				var url_var = newSrc.match( /([?&]w=)(\d+)/ );
				if ( url_var !== null && url_var[2] ) {
					newSrc = newSrc.replace( url_var[0], url_var[1] + img.width );
				}

				url_var = newSrc.match( /([?&]h=)(\d+)/ );
				if ( url_var !== null && url_var[2] ) {
					newSrc = newSrc.replace( url_var[0], url_var[1] + img.height );
				}

				var zoom_arg = '&zoom=2';
				if ( !newSrc.match( /\?/ ) ) {
					zoom_arg = '?zoom=2';
				}
				img.setAttribute( 'srcset', newSrc + zoom_arg + ' ' + scale + 'x' );
			}
		}

		// Scale static assets that have a name matching *-1x.png or *@1x.png
		else if ( img.src.match(/^https?:\/\/[^\/]+\/.*[-@]([12])x\.(gif|jpeg|jpg|png)(\?|$)/) ) {
                        if ( this.hintsFor( "staticAssets" ) === true ) {
                                return false; 
                        }
			// Fix width and height attributes to rendered dimensions.
			img.width = img.width;
			img.height = img.height;
			var currentSize = RegExp.$1, newSize = currentSize;
			if ( scale <= 1 )
				newSize = 1;
			else
				newSize = 2;
			if ( currentSize != newSize )
				newSrc = img.src.replace(/([-@])[12]x\.(gif|jpeg|jpg|png)(\?|$)/, '$1'+newSize+'x.$2$3');
		}

		else {
			return false;
		}

		// Don't set img.src unless it has changed. This avoids unnecessary reloads.
		if ( newSrc != img.src ) {
			// Store the original img.src
			var prevSrc, origSrc = img.getAttribute("src-orig");
			if ( !origSrc ) {
				origSrc = img.src;
				img.setAttribute("src-orig", origSrc);
			}
			// In case of error, revert img.src
			prevSrc = img.src;
			img.onerror = function(){
				img.src = prevSrc;
				if ( img.getAttribute("scale-fail") < scale )
					img.setAttribute("scale-fail", scale);
				img.onerror = null;
			};
			// Finally load the new image
			img.src = newSrc;
		}

		return true;
	}
};

wpcom_img_zoomer.init();
;
/* global pm, wpcom_reblog */

var jetpackLikesWidgetQueue = [];
var jetpackLikesWidgetBatch = [];
var jetpackLikesMasterReady = false;

function JetpackLikespostMessage( message, target ) {
	if ( 'string' === typeof message ){
		try {
			message = JSON.parse( message );
		} catch(e) {
			return;
		}
	}

	pm( {
		target: target,
		type: 'likesMessage',
		data: message,
		origin: '*'
	} );
}

function JetpackLikesBatchHandler() {
	var requests = [];
	jQuery( 'div.jetpack-likes-widget-unloaded' ).each( function() {
		if ( jetpackLikesWidgetBatch.indexOf( this.id ) > -1 ) {
			return;
		}
		jetpackLikesWidgetBatch.push( this.id );
		var regex = /like-(post|comment)-wrapper-(\d+)-(\d+)-(\w+)/,
			match = regex.exec( this.id ),
			info;

		if ( ! match || match.length !== 5 ) {
			return;
		}

		info = {
			blog_id: match[2],
			width:   this.width
		};

		if ( 'post' === match[1] ) {
			info.post_id = match[3];
		} else if ( 'comment' === match[1] ) {
			info.comment_id = match[3];
		}

		info.obj_id = match[4];

		requests.push( info );
	});

	if ( requests.length > 0 ) {
		JetpackLikespostMessage( { event: 'initialBatch', requests: requests }, window.frames['likes-master'] );
	}
}

function JetpackLikesMessageListener( event, message ) {
	var allowedOrigin, $container, $list, offset, rowLength, height, scrollbarWidth;

	if ( 'undefined' === typeof event.event ) {
		return;
	}

	// We only allow messages from one origin
	allowedOrigin = window.location.protocol + '//widgets.wp.com';
	if ( allowedOrigin !== message.origin ) {
		return;
	}

	if ( 'masterReady' === event.event ) {
		jQuery( document ).ready( function() {
			jetpackLikesMasterReady = true;

			var stylesData = {
					event: 'injectStyles'
				},
				$sdTextColor = jQuery( '.sd-text-color' ),
				$sdLinkColor = jQuery( '.sd-link-color' );

			if ( jQuery( 'iframe.admin-bar-likes-widget' ).length > 0 ) {
				JetpackLikespostMessage( { event: 'adminBarEnabled' }, window.frames[ 'likes-master' ] );

				stylesData.adminBarStyles = {
					background: jQuery( '#wpadminbar .quicklinks li#wp-admin-bar-wpl-like > a' ).css( 'background' ),
					isRtl: ( 'rtl' === jQuery( '#wpadminbar' ).css( 'direction' ) )
				};
			}

			// enable reblogs if we're on a single post page
			if ( jQuery( 'body' ).hasClass( 'single' ) ) {
				JetpackLikespostMessage( { event: 'reblogsEnabled' }, window.frames[ 'likes-master' ] );
			}

			if ( ! window.addEventListener ) {
				jQuery( '#wp-admin-bar-admin-bar-likes-widget' ).hide();
			}

			stylesData.textStyles = {
				color:          $sdTextColor.css( 'color' ),
				fontFamily:     $sdTextColor.css( 'font-family' ),
				fontSize:       $sdTextColor.css( 'font-size' ),
				direction:      $sdTextColor.css( 'direction' ),
				fontWeight:     $sdTextColor.css( 'font-weight' ),
				fontStyle:      $sdTextColor.css( 'font-style' ),
				textDecoration: $sdTextColor.css('text-decoration')
			};

			stylesData.linkStyles = {
				color:          $sdLinkColor.css('color'),
				fontFamily:     $sdLinkColor.css('font-family'),
				fontSize:       $sdLinkColor.css('font-size'),
				textDecoration: $sdLinkColor.css('text-decoration'),
				fontWeight:     $sdLinkColor.css( 'font-weight' ),
				fontStyle:      $sdLinkColor.css( 'font-style' )
			};

			JetpackLikespostMessage( stylesData, window.frames[ 'likes-master' ] );

			JetpackLikesBatchHandler();

			jQuery( document ).on( 'inview', 'div.jetpack-likes-widget-unloaded', function() {
				jetpackLikesWidgetQueue.push( this.id );
			});
		});
	}

	if ( 'showLikeWidget' === event.event ) {
		jQuery( '#' + event.id + ' .post-likes-widget-placeholder'  ).fadeOut( 'fast', function() {
			jQuery( '#' + event.id + ' .post-likes-widget' ).fadeIn( 'fast', function() {
				JetpackLikespostMessage( { event: 'likeWidgetDisplayed', blog_id: event.blog_id, post_id: event.post_id, obj_id: event.obj_id }, window.frames['likes-master'] );
			});
		});
	}

	if ( 'clickReblogFlair' === event.event ) {
		wpcom_reblog.toggle_reblog_box_flair( event.obj_id );
	}

	if ( 'showOtherGravatars' === event.event ) {
		$container = jQuery( '#likes-other-gravatars' );
		$list = $container.find( 'ul' );

		$container.hide();
		$list.html( '' );

		$container.find( '.likes-text span' ).text( event.total );

		jQuery.each( event.likers, function( i, liker ) {
			var element = jQuery( '<li><a><img /></a></li>' );
			element.addClass( liker.css_class );

			element.find( 'a' ).
				attr({
					href: liker.profile_URL,
					rel: 'nofollow',
					target: '_parent'
				}).
				addClass( 'wpl-liker' );

			element.find( 'img' ).
				attr({
					src: liker.avatar_URL,
					alt: liker.name
				}).
				css({
					width: '30px',
					height: '30px',
					paddingRight: '3px'
				});

			$list.append( element );
		} );

		offset = jQuery( '[name=\'' + event.parent + '\']' ).offset();

		$container.css( 'left', offset.left + event.position.left - 10 + 'px' );
		$container.css( 'top', offset.top + event.position.top - 33 + 'px' );

		rowLength = Math.floor( event.width / 37 );
		height = ( Math.ceil( event.likers.length / rowLength ) * 37 ) + 13;
		if ( height > 204 ) {
			height = 204;
		}

		$container.css( 'height', height + 'px' );
		$container.css( 'width', rowLength * 37 - 7 + 'px' );

		$list.css( 'width', rowLength * 37 + 'px' );

		$container.fadeIn( 'slow' );

		scrollbarWidth = $list[0].offsetWidth - $list[0].clientWidth;
		if ( scrollbarWidth > 0 ) {
			$container.width( $container.width() + scrollbarWidth );
			$list.width( $list.width() + scrollbarWidth );
		}
	}
}

pm.bind( 'likesMessage', JetpackLikesMessageListener );

jQuery( document ).click( function( e ) {
	var $container = jQuery( '#likes-other-gravatars' );

	if ( $container.has( e.target ).length === 0 ) {
		$container.fadeOut( 'slow' );
	}
});

function JetpackLikesWidgetQueueHandler() {
	var $wrapper, wrapperID, found;
	if ( ! jetpackLikesMasterReady ) {
		setTimeout( JetpackLikesWidgetQueueHandler, 500 );
		return;
	}

	if ( jetpackLikesWidgetQueue.length > 0 ) {
		// We may have a widget that needs creating now
		found = false;
		while( jetpackLikesWidgetQueue.length > 0 ) {
			// Grab the first member of the queue that isn't already loading.
			wrapperID = jetpackLikesWidgetQueue.splice( 0, 1 )[0];
			if ( jQuery( '#' + wrapperID ).hasClass( 'jetpack-likes-widget-unloaded' ) ) {
				found = true;
				break;
			}
		}
		if ( ! found ) {
			setTimeout( JetpackLikesWidgetQueueHandler, 500 );
			return;
		}
	} else if ( jQuery( 'div.jetpack-likes-widget-unloaded' ).length > 0 ) {
		// Grab any unloaded widgets for a batch request
		JetpackLikesBatchHandler();

		// Get the next unloaded widget
		wrapperID = jQuery( 'div.jetpack-likes-widget-unloaded' ).first()[0].id;
		if ( ! wrapperID ) {
			// Everything is currently loaded
			setTimeout( JetpackLikesWidgetQueueHandler, 500 );
			return;
		}
	}

	if ( 'undefined' === typeof wrapperID ) {
		setTimeout( JetpackLikesWidgetQueueHandler, 500 );
		return;
	}

	$wrapper = jQuery( '#' + wrapperID );
	$wrapper.find( 'iframe' ).remove();

	if ( $wrapper.hasClass( 'slim-likes-widget' ) ) {
		$wrapper.find( '.post-likes-widget-placeholder' ).after( '<iframe class="post-likes-widget jetpack-likes-widget" name="' + $wrapper.data( 'name' ) + '" height="22px" width="68px" frameBorder="0" scrolling="no" src="' + $wrapper.data( 'src' ) + '"></iframe>' );
	} else {
		$wrapper.find( '.post-likes-widget-placeholder' ).after( '<iframe class="post-likes-widget jetpack-likes-widget" name="' + $wrapper.data( 'name' ) + '" height="55px" width="100%" frameBorder="0" src="' + $wrapper.data( 'src' ) + '"></iframe>' );
	}

	$wrapper.removeClass( 'jetpack-likes-widget-unloaded' ).addClass( 'jetpack-likes-widget-loading' );

	$wrapper.find( 'iframe' ).load( function( e ) {
		var $iframe = jQuery( e.target );
		$wrapper.removeClass( 'jetpack-likes-widget-loading' ).addClass( 'jetpack-likes-widget-loaded' );

		JetpackLikespostMessage( { event: 'loadLikeWidget', name: $iframe.attr( 'name' ), width: $iframe.width(), domain: window.location.hostname }, window.frames[ 'likes-master' ] );

		if ( $wrapper.hasClass( 'slim-likes-widget' ) ) {
			$wrapper.find( 'iframe' ).Jetpack( 'resizeable' );
		}
	});
	setTimeout( JetpackLikesWidgetQueueHandler, 250 );
}
JetpackLikesWidgetQueueHandler();
;
/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

function Swipe(container, options) {

  "use strict";

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution
  
  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;

  function setup() {

    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) options.continuous = false;

    //special case if two slides
    if (browser.transitions && options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = container.getBoundingClientRect().width || container.offsetWidth;

    element.style.width = (slides.length * width) + 'px';

    // stack elements
    var pos = slides.length;
    while(pos--) {

      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = (pos * -width) + 'px';
        move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
      }

    }

    // reposition elements before and after index
    if (options.continuous && browser.transitions) {
      move(circle(index-1), -width, 0);
      move(circle(index+1), width, 0);
    }

    if (!browser.transitions) element.style.left = (index * -width) + 'px';

    container.style.visibility = 'visible';

  }

  function prev() {

    if (options.continuous) slide(index-1);
    else if (index) slide(index-1);

  }

  function next() {

    if (options.continuous) slide(index+1);
    else if (index < slides.length - 1) slide(index+1);

  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;
    
    if (browser.transitions) {

      var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (options.continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to =  -direction * slides.length + to;

      }

      var diff = Math.abs(index-to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);
            
      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place
      
    } else {     
      
      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function translate(index, dist, speed) {

    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration = 
    style.MozTransitionDuration = 
    style.msTransitionDuration = 
    style.OTransitionDuration = 
    style.transitionDuration = speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform = 
    style.MozTransform = 
    style.OTransform = 'translateX(' + dist + 'px)';

  }

  function animate(from, to, speed) {

    // if not an animation, just reposition
    if (!speed) {

      element.style.left = to + 'px';
      return;

    }
    
    var start = +new Date;
    
    var timer = setInterval(function() {

      var timeElap = +new Date - start;
      
      if (timeElap > speed) {

        element.style.left = to + 'px';

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return;

      }

      element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

    }, 4);

  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {

    interval = setTimeout(next, delay);

  }

  function stop() {

    delay = 0;
    clearTimeout(interval);

  }


  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;      

  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case 'touchstart': this.start(event); break;
        case 'touchmove': this.move(event); break;
        case 'touchend': offloadFn(this.end(event)); break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend': offloadFn(this.transitionEnd(event)); break;
        case 'resize': offloadFn(setup.call()); break;
      }

      if (options.stopPropagation) event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date

      };
      
      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

      if (options.disableScroll) event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if ( typeof isScrolling == 'undefined') {
        isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {

        // prevent native scrolling 
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) { // we don't add resistance at the end

          translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

        } else {

          delta.x = 
            delta.x / 
              ( (!index && delta.x > 0               // if first slide and sliding left
                || index == slides.length - 1        // or if last slide and sliding right
                && delta.x < 0                       // and if sliding at all
              ) ?                      
              ( Math.abs(delta.x) / width + 1 )      // determine resistance level
              : 1 );                                 // no resistance if false
          
          // translate 1:1
          translate(index-1, delta.x + slidePos[index-1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index+1, delta.x + slidePos[index+1], 0);
        }

      }

    },
    end: function(event) {

      // measure duration
      var duration = +new Date - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide = 
            Number(duration) < 250               // if slide duration is less than 250ms
            && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
            || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds = 
            !index && delta.x > 0                            // if first slide and slide amt is greater than 0
            || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;
      
      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index-1), -width, 0);
              move(circle(index+2), width, 0);

            } else {
              move(index-1, -width, 0);
            }

            move(index, slidePos[index]-width, speed);
            move(circle(index+1), slidePos[circle(index+1)]-width, speed);
            index = circle(index+1);  
                      
          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index+1), width, 0);
              move(circle(index-2), -width, 0);

            } else {
              move(index+1, width, 0);
            }

            move(index, slidePos[index]+width, speed);
            move(circle(index-1), slidePos[circle(index-1)]+width, speed);
            index = circle(index-1);

          }

          options.callback && options.callback(index, slides[index]);

        } else {

          if (options.continuous) {

            move(circle(index-1), -width, speed);
            move(index, 0, speed);
            move(circle(index+1), width, speed);

          } else {

            move(index-1, -width, speed);
            move(index, 0, speed);
            move(index+1, width, speed);
          }

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false)
      element.removeEventListener('touchend', events, false)

    },
    transitionEnd: function(event) {

      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {
        
        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

      }

    }

  }

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();


  // add event listeners
  if (browser.addEventListener) {
    
    // set touchstart event on element    
    if (browser.touch) element.addEventListener('touchstart', events, false);

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);

  } else {

    window.onresize = function () { setup() }; // to play nice with old IE

  }

  // expose the Swipe API
  return {
    setup: function() {

      setup();

    },
    slide: function(to, speed) {
      
      // cancel slideshow
      stop();
      
      slide(to, speed);

    },
    prev: function() {

      // cancel slideshow
      stop();

      prev();

    },
    next: function() {

      // cancel slideshow
      stop();

      next();

    },
    getPos: function() {

      // return current index position
      return index;

    },
    getNumSlides: function() {
      
      // return total number of slides
      return length;
    },
    kill: function() {

      // cancel slideshow
      stop();

      // reset element
      element.style.width = 'auto';
      element.style.left = 0;

      // reset slides
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];
        slide.style.width = '100%';
        slide.style.left = 0;

        if (browser.transitions) translate(pos, 0, 0);

      }

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);

      }
      else {

        window.onresize = null;

      }

    }
  }

}


if ( window.jQuery || window.Zepto ) {
  (function($) {
    $.fn.Swipe = function(params) {
      return this.each(function() {
        $(this).data('Swipe', new Swipe($(this)[0], params));
      });
    }
  })( window.jQuery || window.Zepto )
}
;
/**
 * Comment Likes - JavaScript
 *
 * This handles liking and unliking comments, as well as viewing who has
 * liked a particular comment.
 *
 * @dependency  jQuery
 * @dependency  Swipe
 *
 * @package     Comment_Likes
 * @subpackage  JavaScript
 */
jQuery( function() {
	var $ = jQuery;
	var extWin;
	var extWinCheck;
	var commentLikeEvent;

	// The O2 theme re-injects this script into the DOM when somebody
	// creates a new thread and the page is already open, but we don't
	// want to run this script a second time.
	if ( window.comment_likes_loaded ) return;
	window.comment_likes_loaded = true;

	// Client-side cache of who liked a particular comment to avoid
	// having to hit the server multiple times for the same data.
	var comment_like_cache = {};

	/**
	 * Parse the comment ID from a comment like link.
	 */
	var get_comment_id = function( $link ) {
		var comment_id = $link.attr( 'href' ).split( 'like_comment=' );
		return comment_id[1].split( '&_wpnonce=' )[0];
	};

	/**
	 * Handle an ajax action on the comment like link.
	 */
	var handle_link_action = function( $link, action, comment_id, callback ) {
		var nonce = $link.attr( 'href' ).split( '_wpnonce=' )[1];

		$.post( '/wp-admin/admin-ajax.php', {
			'action': action,
			'_wpnonce': nonce,
			'like_comment': comment_id,
			'blog_id': Number( $link.data( 'blog' ) )
		}, callback, 'json' );
	};

	// Overlay used for displaying comment like info.
	var overlay = {

		// Overlay element.
		$el: $( '<div/>' )
			.appendTo( 'body' )
			.addClass( 'comment-likes-overlay' )
			.hide()
			.mouseenter( function() {
				// Don't hide the overlay if the user is mousing over it.
				overlay.cancel_hide();
			} ).mouseleave( function() {
				overlay.request_hide();
			} ),

		// Inner contents of overlay.
		$inner: null,

		// Instance of the Swipe library.
		swipe: null,

		// Initialise the overlay for use, removing any old content.
		clear: function() {
			// Unload any previous instance of Swipe (to avoid leaking a global
			// event handler). This is done before clearing the contents of the
			// overlay because Swipe expects the slides to still be present.
			if ( this.swipe ) {
				this.swipe.kill();
				this.swipe = null;
			}
			this.$el.html( '' );
			this.$inner = $( '<div/>' ).addClass( 'inner' ).appendTo( this.$el );
		},

		/**
		 * Construct a list (<ul>) of user (gravatar, name) details.
		 *
		 * @param  data     liker data returned from the server
		 * @param  klass    CSS class to apply to the <ul> element
		 * @param  start    index of user to start at
		 * @param  length   number of users to include in the list
		 *
		 * @return          HTML for the list
		 */
		get_user_bits: function( data, klass, start, length ) {
			start = start || 0;
			var last = start + ( length || data.length );
			last = ( last > data.length ) ? data.length : last;
			var html = '<div class="liker-list"><ul class="' + ( klass || '' ) + '">';
			for ( var i = start; i < last; ++i ) {
				var user = data[ i ];
				html += '<li>';
				html += '<a rel="nofollow" title="' + user.display_name_esc + '" href="' + user.profile_url_esc + '"><img src="' + user.avatar_url_esc + '" alt="' + user.display_name_esc + '"  /> <span class="user-name">' + user.display_name_esc + '</span></a>';
				html += '</li>';
			}
			html += '</ul></div>';
			return html;
		},

		/**
		 * Render the display of who has liked this comment. The type of
		 * display depends on how many people have liked the comment.
		 * If more than 10 people have liked the comment, this function
		 * renders navigation controls and sets up the Swipe library for
		 * changing between pages.
		 *
		 * @param link  the element over which the user is hovering
		 * @param data  the results retrieved from the server
		 */
		show_likes: function( $link, data ) {
			this.clear();

			$link.data( 'likeCount', data.length );
			if ( 0 === data.length ) {
				// No likers after all.
				return this.$el.hide();
			}

			this.$inner.css( 'padding', 12 );

			if ( data.length < 6 ) {
				// Only one column needed.
				this.$inner.css( 'max-width', 200 );
				this.$inner.html( this.get_user_bits( data, 'single' ) );

			} else if ( data.length < 11 ) {
				// Two columns, but only one page.
				this.$inner.html( this.get_user_bits( data, 'double' ) );

			} else {
				// Multiple pages.
				this.render_likes_with_pagination( data );
			}

			// Move the overlay into the correct position and then show it.
			this.set_position( $link );
		},

		/**
		 * Render multiple pages of likes with pagination controls.
		 * This function is intended to be called by `show_likes` above.
		 *
		 * @param data  the results retrieved from the server
		 */
		render_likes_with_pagination: function( data ) {
			var page_count = Math.ceil( data.length / 10 );
			// Swipe requires two nested containers.
			var $swipe = $( '<div/>' ).addClass( 'swipe' ).appendTo( this.$inner );
			var $div = $( '<div/>' ).addClass( 'swipe-wrap' ).appendTo( $swipe );
			for ( var i = 0; i < page_count; ++i ) {
				$( this.get_user_bits( data, 'double', i * 10, 10 ) ).appendTo( $div );
			}

			/** Navigation controls.
			 *  This is based on the Newdash controls found in
			 *    reader/recommendations-templates.php
			 */
			var nav_html = '<nav class="slider-nav"><a href="#" class="prev"><span class="noticon noticon-previous" title="Previous" alt="<"></span></a><span class="position">';
			for ( var i = 0; i < page_count; ++i ) {
				nav_html += '<em data-page="' + i + '" class="' + ( ( i === 0 ) ? 'on' : '' ) + '">&bull;</em>';
			}
			nav_html += '</span><a href="#" class="next"><span class="noticon noticon-next" title="Next" alt=">"></span></a></nav>';
			var $nav = $( nav_html ).appendTo( this.$inner );

			/** Set up Swipe. **/

			// Swipe cannot be set up successfully unless its container
			// is visible, so we show it now.
			this.$el.show();

			var swipe = this.swipe = new Swipe( $swipe[0], {
				callback: function( pos ) {
					// Update the pagination indicators.
					//
					// If there are exactly two pages, Swipe has a weird
					// special case where it duplicates both pages and
					// can return index 2 and 3 even though those aren't
					// real pages (see swipe.js, line 47). To deal with
					// this, we use the expression `pos % page_count`.
					pos = pos % page_count;
					$nav.find( 'em' ).each( function() {
						var page = Number( $( this ).data( 'page' ) );
						$( this ).attr( 'class', ( pos === page ) ? 'on' : '' );
					} );
				}
			} );
			$nav.find( 'em' ).on( 'click', function( $e ) {
				// Go to the page corresponding to the indicator clicked.
				swipe.slide( Number( $( this ).data( 'page' ) ) );
				$e.preventDefault();
			} );
			// Previous and next buttons.
			$nav.find( '.prev' ).on( 'click', function( $e ) {
				swipe.prev();
				$e.preventDefault();
			} );
			$nav.find( '.next' ).on( 'click', function( $e ) {
				swipe.next();
				$e.preventDefault();
			} );
		},

		/**
		 * Open the overlay and show a loading message.
		 */
		show_loading_message: function( $link ) {
			this.clear();
			this.$inner.text( comment_like_text.loading );
			this.set_position( $link );
		},

		/**
		 * Position the overlay near the current comment.
		 *
		 * @param $link  element near which to position the overlay
		 */
		set_position: function( $link ) {
			// Prepare a down arrow icon for the bottom of the overlay.
			var $icon = $( '<span/>' )
				.appendTo( this.$el )
				.addClass( 'icon noticon noticon-downarrow' )
				.css( 'text-shadow', '0px 1px 1px rgb(223, 223, 223)' );

			var offset = $link.offset();
			var left = offset.left - ( this.$el.width() - $link.width() ) / 2;
			left = left < 5 ? 5 : left;
			var top = offset.top - this.$el.height() + 5;

			// Check if the overlay would appear off the screen.
			if ( top < ( $( window ).scrollTop() + ( $( '#wpadminbar' ).height() || 0 ) ) ) {
				// We'll display the overlay beneath the link instead.
				top = offset.top + $link.height();
				// Instead of using the down arrow icon, use an up arrow.
				$icon.remove().prependTo( this.$el )
					.removeClass( 'noticon-downarrow')
					.addClass( 'noticon-uparrow' )
					.css( {
						'text-shadow': '0px -1px 1px rgb(223, 223, 223)',
						'vertical-align': 'bottom'
					} );
			}

			this.$el.css( { 'left': left, 'top': top } ).show();

			$icon.css( {
				// The height of the arrow icon differs slightly between browsers,
				// so we compute the margin here to make sure it isn't disjointed
				// from the overlay.
				'margin-top': $icon[0].scrollHeight - 26,
				'margin-bottom': 20 - $icon[0].scrollHeight,

				// Position the arrow to be horizontally centred on the link.
				'padding-left': offset.left - left + ( $link.width() - $icon[0].scrollWidth ) / 2
			} );
		},

		/**
		 * Return whether the overlay is visible.
		 */
		is_visible: function() {
			return ( 'none' !== this.$el.css( 'display' ) );
		},

		// Timeout used for hiding the overlay.
		hide_timeout: null,

		/**
		 * Request that the overlay be hidden after a short delay.
		 */
		request_hide: function() {
			if ( null !== this.hide_timeout ) {
				return;
			}
			var self = this;
			this.hide_timeout = setTimeout( function() {
				self.$el.hide();
				self.clear();
			}, 300 );
		},

		/**
		 * Cancel a request to hide the overlay.
		 */
		cancel_hide: function() {
			if ( null !== this.hide_timeout ) {
				clearTimeout( this.hide_timeout );
				this.hide_timeout = null;
			}
		}
	};

	// The most recent comment for which the user has requested to see
	// who liked it.
	var relevant_comment;

	// Precache after this timeout.
	var precache_timeout = null;

	/**
	 * Fetch the like data for a particular comment.
	 */
	var fetch_like_data = function( $link, comment_id ) {
		comment_like_cache[ comment_id ] = null;

		var $star = $link.parent().parent().find( 'a.comment-like-link' );
		handle_link_action( $star, 'view_comment_likes', comment_id, function( data ) {
			// Populate the cache.
			comment_like_cache[ comment_id ] = data;

			// Only show the overlay if the user is interested.
			if ( overlay.is_visible() && ( relevant_comment === comment_id ) ) {
				overlay.show_likes( $link, data );
			}
		} );
	};

	function readCookie( c ) {
		var nameEQ = c + '=',
			cookieStrings = document.cookie.split( ';' ),
			i, cookieString, num, chunk, pairs, pair, cookie_data;
		for ( i = 0; i < cookieStrings.length; i++ ) {
			cookieString = cookieStrings[ i ];
			while ( cookieString.charAt( 0 ) === ' ' ) {
				cookieString = cookieString.substring( 1, cookieString.length );
			}
			if ( cookieString.indexOf( nameEQ ) === 0 ) {
				chunk = cookieString.substring( nameEQ.length, cookieString.length );
				pairs = chunk.split( '&' );
				cookie_data = {};
				for ( num = pairs.length - 1; num >= 0; num-- ) {
					pair = pairs[ num ].split( '=' );
					cookie_data[ pair[0] ] = decodeURIComponent( pair[1] );
				}
				return cookie_data;
			}
		}
		return null;
	}

	function getServiceData() {
		var data = readCookie( 'wpc_wpc' );
		if ( null === data || 'undefined' === typeof data.access_token || ! data.access_token ) {
			return false;
		}
		return data;
	}

	function readMessage( event ) {
		if ( 'undefined' == typeof event.event ) {
			return;
		}

		if ( 'login' == event.event && event.success ) {
			extWinCheck = setInterval( function() {
				if ( ! extWin || extWin.closed ) {
					clearInterval( extWinCheck );
					if ( getServiceData() ) {

						// Load page in an iframe to get the current comment nonce
						var nonceIframe = document.createElement( 'iframe' );
						nonceIframe.id = 'wp-login-comment-nonce-iframe';
						nonceIframe.style.display = 'none';
						nonceIframe.src = commentLikeEvent + '';
						document.body.appendChild( nonceIframe );

						var commentLikeId = ( commentLikeEvent + '' ).split( 'like_comment=' )[1].split( '&_wpnonce=' )[0];
						var c = false;

						// Set a 5 second timeout to redirect to the comment page without doing the Like as a fallback
						var commentLikeTimeout = setTimeout( function() {
							window.location = commentLikeEvent;
						}, 5000 );

						// Check for a new nonced redirect and use that if available before timing out
						var commentLikeCheck = setInterval( function() {
							c = $( '#wp-login-comment-nonce-iframe' ).contents().find( '#comment-like-' + commentLikeId + ' .comment-like-link' );
							if ( 'undefined' !== typeof c && 'undefined' !== typeof c[0] && 'undefined' !== typeof c[0].href ) {
								clearTimeout( commentLikeTimeout );
								clearInterval( commentLikeCheck );
								window.location = c[0].href;
							}
						}, 100 );
					}
				}
			}, 100 );

			if ( extWin ) {
				if ( ! extWin.closed ) {
					extWin.close();
				}
				extWin = false;
			}

			$( '#wp-login-polling-iframe' ).remove();
		}
	}

	if ( 'undefined' != typeof window.pm ) {
		pm.bind( 'loginMessage', function( e ) { readMessage( e ); } );
	}

	$( 'body' ).on( 'click', 'a.comment-like-link', function( $e ) {
		if ( $( $e.target ).hasClass( 'needs-login' ) ) {
			$e.preventDefault();
			commentLikeEvent = $e.target;
			if ( extWin ) {
				if ( ! extWin.closed ) {
					extWin.close();
				}
				extWin = false;
			}

			$( '#wp-login-polling-iframe' ).remove();

			var url = 'https://wordpress.com/public.api/connect/?action=request&service=wordpress';
			extWin = window.open( url, 'likeconn', 'status=0,toolbar=0,location=1,menubar=0,directories=0,resizable=1,scrollbars=1,height=560,width=500' );

			// Append cookie polling login iframe to this window to wait for user to finish logging in (or cancel)
			var loginIframe = $( "<iframe id='wp-login-polling-iframe'></iframe>" );
			loginIframe.attr( "src", "https://wordpress.com/public.api/connect/?iframe=true" );
			loginIframe.css( "display", "none" );
			$( document.body ).append( loginIframe );

			return false;
		}

		// Record that the user likes or does not like this comment.
		var $star = $( this );
		var comment_id = get_comment_id( $star );
		$star.addClass( 'loading' );
		// Determine whether to like or unlike based on whether the comment is
		// currently liked.
		var action = ( $( 'p#comment-like-' + comment_id ).data( 'liked' ) === 'comment-liked' ) ? 'unlike_comment' : 'like_comment';
		handle_link_action( $star, action, comment_id, function( data ) {
			// Invalidate the like cache for this comment.
			delete comment_like_cache[ comment_id ];

			$( '#comment-like-count-' + data.context ).html( data.display );

			if ( 'like_comment' === action ) {
				$( 'p#comment-like-' + data.context ).removeClass( 'comment-not-liked' )
					.addClass( 'comment-liked' )
					.data( 'liked', 'comment-liked' );
			} else {
				$( 'p#comment-like-' + data.context ).removeClass( 'comment-liked' )
					.addClass( 'comment-not-liked' )
					.data( 'liked', 'comment-not-liked' );
			}

			// Prefetch new data for this comment (if there are likers left).
			var $link = $star.parent().find( 'a.view-likers' );
			if ( 0 !== $link.length ) {
				fetch_like_data( $link, comment_id );
			}

			$star.removeClass( 'loading' );
		} );
		$e.preventDefault();
		$e.stopPropagation();

	} ).on( 'click', 'p.comment-not-liked', function() {
		// When a comment hasn't been liked, make the text clickable, too
		$( this ).find( 'a.comment-like-link' ).click();

	} ).on( 'mouseenter', 'p.comment-likes a.view-likers', function() {
		// Show the user a list of who has liked this comment.

		var $link = $( this );
		if ( 0 === Number( $link.data( 'likeCount' ) || 0 ) ) {
			// No one has liked this comment.
			return;
		}

		// Don't hide the overlay.
		overlay.cancel_hide();

		// Get the comment ID.
		var $star = $link.parent().parent().find( 'a.comment-like-link' );
		var comment_id = relevant_comment = get_comment_id( $star );

		// Check if the list of likes for this comment is already in
		// the cache.
		if ( comment_id in comment_like_cache ) {
			var entry = comment_like_cache[ comment_id ];
			// Only display the likes if the ajax request is
			// actually done.
			if ( null !== entry ) {
				overlay.show_likes( $link, entry );
			} else {
				// Make sure the overlay is visible (in case
				// the user moved the mouse away while loading
				// but then came back before it finished
				// loading).
				overlay.show_loading_message( $link );
			}
			return;
		}

		// Position the "Loading..." overlay.
		overlay.show_loading_message( $link );

		// Fetch the data.
		fetch_like_data( $link, comment_id );

	} ).on( 'mouseleave', 'p.comment-likes a.view-likers', function() {
		// User has moved cursor away - hide the overlay.
		overlay.request_hide();

	} ).on( 'click', 'p.comment-likes a.view-likers', function( $e ) {
		// Don't do anything when clicking on the text.
		$e.preventDefault();

	} ).on( 'mouseenter', '.comment:has(a.comment-like-link)', function() {
		// User is moving over a comment - precache the comment like data.
		if ( null !== precache_timeout ) {
			clearTimeout( precache_timeout );
			precache_timeout = null;
		}

		var $star = $( this ).find( 'a.comment-like-link' );
		var $link = $star.parent().find( 'a.view-likers' );
		if ( 0 === Number( $link.data( 'likeCount' ) || 0 ) ) {
			// No likes.
			return;
		}
		var comment_id = get_comment_id( $star );
		if ( comment_id in comment_like_cache ) {
			// Already in cache.
			return;
		}

		precache_timeout = setTimeout( function() {
			precache_timeout = null;
			if ( comment_id in comment_like_cache ) {
				// Was cached in the interim.
				return;
			}
			fetch_like_data( $link, comment_id );
		}, 1000 );
	} );
} );
;

// Event Countdown Block
// JavaScript that loads on front-end to update the block
( function() {
	// loop through all event countdown blocks on page
	const intervalIds = [];
	const cals = document.getElementsByClassName( 'wp-block-jetpack-event-countdown' );
	for ( let i = 0; i < cals.length; i++ ) {
		const cal = cals[ i ];

		// grab date from event-countdown__date field
		const eventDateElem = cal.getElementsByClassName( 'event-countdown__date' );
		if ( eventDateElem.length < 1 ) { continue; }

		// parse date into unix time
		const dtstr = eventDateElem[0].innerHTML;
		const eventTime = new Date(dtstr).getTime();
		if ( isNaN(eventTime) ) { continue; }

		// only start interval if event is in the future
		if ( ( eventTime - Date.now() ) > 0 ) {
			intervalIds[i] = window.setInterval( updateCountdown, 1000, eventTime, cal, i );
		} else {
			itsHappening( cal );
		}
	}

	// function called by interval to update displayed time
	// Countdown element passed in as the dom node to search
	// within, supporting multiple events per page
	function updateCountdown( ts, elem, id ) {
		let now = Date.now();
		let diff = ts - now;

		if ( diff < 0 ) {
			itsHappening( elem );
			window.clearInterval( intervalIds[ id ] ); // remove interval here
			return;
		}

		// convert diff to seconds
		let rem = Math.round( diff / 1000 );

		const days = Math.floor( rem / ( 24 * 60 * 60 ) );
		rem = rem - days * 24 * 60 * 60;

		const hours = Math.floor( rem / ( 60 * 60 ) );
		rem = rem - hours * 60 * 60;

		const mins = Math.floor( rem / 60 );
		rem = rem - mins * 60;

		const secs = rem;

		elem.getElementsByClassName('event-countdown__day')[0].innerHTML = days;
		elem.getElementsByClassName('event-countdown__hour')[0].innerHTML = hours;
		elem.getElementsByClassName('event-countdown__minute')[0].innerHTML = mins;
		elem.getElementsByClassName('event-countdown__second')[0].innerHTML = secs;
	}

	// what should we do after the event has passed
	// the majority of views will be well after and
	// not during the transition
	function itsHappening( elem ) {
		const countdown = elem.getElementsByClassName('event-countdown__counter')[0];
		const fireworks = document.createElement("div");
		elem.getElementsByClassName('event-countdown__day')[0].innerHTML = 0;
		elem.getElementsByClassName('event-countdown__hour')[0].innerHTML = 0;
		elem.getElementsByClassName('event-countdown__minute')[0].innerHTML = 0;
		elem.getElementsByClassName('event-countdown__second')[0].innerHTML = 0;
		countdown.classList.add("event-countdown__counter-stopped")
		fireworks.className = "event-countdown__fireworks";
		fireworks.innerHTML = "<div class='event-countdown__fireworks-before'></div><div class='event-countdown__fireworks-after'></div>";
		countdown.parentNode.appendChild(fireworks, countdown);
	}

})();
;
/**
 * navigation.js
 *
 * Handles toggling the navigation menu for small screens.
 */
( function() {
	var container, button, menu;

	container = document.getElementById( 'site-navigation' );
	if ( ! container )
		return;

	button = container.getElementsByTagName( 'h1' )[0];
	if ( 'undefined' === typeof button )
		return;

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	if ( -1 === menu.className.indexOf( 'nav-menu' ) )
		menu.className += ' nav-menu';

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) )
			container.className = container.className.replace( ' toggled', '' );
		else
			container.className += ' toggled';
	};
} )();
;
( function() {
	var is_webkit = navigator.userAgent.toLowerCase().indexOf( 'webkit' ) > -1,
	    is_opera  = navigator.userAgent.toLowerCase().indexOf( 'opera' )  > -1,
	    is_ie     = navigator.userAgent.toLowerCase().indexOf( 'msie' )   > -1;

	if ( ( is_webkit || is_opera || is_ie ) && 'undefined' !== typeof( document.getElementById ) ) {
		var eventMethod = ( window.addEventListener ) ? 'addEventListener' : 'attachEvent';
		window[ eventMethod ]( 'hashchange', function() {
			var element = document.getElementById( location.hash.substring( 1 ) );

			if ( element ) {
				if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) )
					element.tabIndex = -1;

				element.focus();
			}
		}, false );
	}
})();
;
window.addComment=function(s){var u,f,v,y=s.document,p={commentReplyClass:"comment-reply-link",cancelReplyId:"cancel-comment-reply-link",commentFormId:"commentform",temporaryFormId:"wp-temp-form-div",parentIdFieldId:"comment_parent",postIdFieldId:"comment_post_ID"},e=s.MutationObserver||s.WebKitMutationObserver||s.MozMutationObserver,i="querySelector"in y&&"addEventListener"in s,n=!!y.documentElement.dataset;function t(){r(),function(){if(!e)return;new e(d).observe(y.body,{childList:!0,subtree:!0})}()}function r(e){if(i&&(u=I(p.cancelReplyId),f=I(p.commentFormId),u)){u.addEventListener("touchstart",a),u.addEventListener("click",a);var t=function(e){if((e.metaKey||e.ctrlKey)&&13===e.keyCode)return f.removeEventListener("keydown",t),e.preventDefault(),f.submit.click(),!1};f&&f.addEventListener("keydown",t);for(var n,r=function(e){var t,n=p.commentReplyClass;e&&e.childNodes||(e=y);t=y.getElementsByClassName?e.getElementsByClassName(n):e.querySelectorAll("."+n);return t}(e),d=0,o=r.length;d<o;d++)(n=r[d]).addEventListener("touchstart",l),n.addEventListener("click",l)}}function a(e){var t=I(p.temporaryFormId);t&&v&&(I(p.parentIdFieldId).value="0",t.parentNode.replaceChild(v,t),this.style.display="none",e.preventDefault())}function l(e){var t=this,n=m(t,"belowelement"),r=m(t,"commentid"),d=m(t,"respondelement"),o=m(t,"postid");n&&r&&d&&o&&!1===s.addComment.moveForm(n,r,d,o)&&e.preventDefault()}function d(e){for(var t=e.length;t--;)if(e[t].addedNodes.length)return void r()}function m(e,t){return n?e.dataset[t]:e.getAttribute("data-"+t)}function I(e){return y.getElementById(e)}return i&&"loading"!==y.readyState?t():i&&s.addEventListener("DOMContentLoaded",t,!1),{init:r,moveForm:function(e,t,n,r){var d=I(e);v=I(n);var o,i,a,l=I(p.parentIdFieldId),m=I(p.postIdFieldId);if(d&&v&&l){!function(e){var t=p.temporaryFormId,n=I(t);if(n)return;(n=y.createElement("div")).id=t,n.style.display="none",e.parentNode.insertBefore(n,e)}(v),r&&m&&(m.value=r),l.value=t,u.style.display="",d.parentNode.insertBefore(v,d.nextSibling),u.onclick=function(){return!1};try{for(var c=0;c<f.elements.length;c++)if(o=f.elements[c],i=!1,"getComputedStyle"in s?a=s.getComputedStyle(o):y.documentElement.currentStyle&&(a=o.currentStyle),(o.offsetWidth<=0&&o.offsetHeight<=0||"hidden"===a.visibility)&&(i=!0),"hidden"!==o.type&&!o.disabled&&!i){o.focus();break}}catch(e){}return!1}}}}(window);;
/*!
 * imagesLoaded PACKAGED v3.2.0
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){"use strict";function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,s=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;t<e.length;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),s="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(s?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;t<e.length;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,s=this.getListenersAsObject(e);for(r in s)s.hasOwnProperty(r)&&(i=t(s[r],n),-1!==i&&s[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,s=e?this.removeListener:this.addListener,o=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)s.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?s.call(this,i,r):o.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,s,o=this.getListenersAsObject(e);for(r in o)if(o.hasOwnProperty(r))for(i=o[r].length;i--;)n=o[r][i],n.once===!0&&this.removeListener(e,n.listener),s=n.listener.apply(this,t||[]),s===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=s,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var s={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",s):e.eventie=s}(this),function(e,t){"use strict";"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof module&&module.exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"==f.call(e)}function s(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0;n<e.length;n++)t.push(e[n]);else t.push(e);return t}function o(e,t,n){if(!(this instanceof o))return new o(e,t,n);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=s(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),u&&(this.jqDeferred=new u.Deferred);var r=this;setTimeout(function(){r.check()})}function h(e){this.img=e}function a(e,t){this.url=e,this.element=t,this.img=new Image}var u=e.jQuery,c=e.console,f=Object.prototype.toString;o.prototype=new t,o.prototype.options={},o.prototype.getImages=function(){this.images=[];for(var e=0;e<this.elements.length;e++){var t=this.elements[e];this.addElementImages(t)}},o.prototype.addElementImages=function(e){"IMG"==e.nodeName&&this.addImage(e),this.options.background===!0&&this.addElementBackgroundImages(e);var t=e.nodeType;if(t&&d[t]){for(var n=e.querySelectorAll("img"),i=0;i<n.length;i++){var r=n[i];this.addImage(r)}if("string"==typeof this.options.background){var s=e.querySelectorAll(this.options.background);for(i=0;i<s.length;i++){var o=s[i];this.addElementBackgroundImages(o)}}}};var d={1:!0,9:!0,11:!0};o.prototype.addElementBackgroundImages=function(e){for(var t=m(e),n=/url\(['"]*([^'"\)]+)['"]*\)/gi,i=n.exec(t.backgroundImage);null!==i;){var r=i&&i[1];r&&this.addBackground(r,e),i=n.exec(t.backgroundImage)}};var m=e.getComputedStyle||function(e){return e.currentStyle};return o.prototype.addImage=function(e){var t=new h(e);this.images.push(t)},o.prototype.addBackground=function(e,t){var n=new a(e,t);this.images.push(n)},o.prototype.check=function(){function e(e,n,i){setTimeout(function(){t.progress(e,n,i)})}var t=this;if(this.progressedCount=0,this.hasAnyBroken=!1,!this.images.length)return void this.complete();for(var n=0;n<this.images.length;n++){var i=this.images[n];i.once("progress",e),i.check()}},o.prototype.progress=function(e,t,n){this.progressedCount++,this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded,this.emit("progress",this,e,t),this.jqDeferred&&this.jqDeferred.notify&&this.jqDeferred.notify(this,e),this.progressedCount==this.images.length&&this.complete(),this.options.debug&&c&&c.log("progress: "+n,e,t)},o.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";if(this.isComplete=!0,this.emit(e,this),this.emit("always",this),this.jqDeferred){var t=this.hasAnyBroken?"reject":"resolve";this.jqDeferred[t](this)}},h.prototype=new t,h.prototype.check=function(){var e=this.getIsImageComplete();return e?void this.confirm(0!==this.img.naturalWidth,"naturalWidth"):(this.proxyImage=new Image,n.bind(this.proxyImage,"load",this),n.bind(this.proxyImage,"error",this),n.bind(this.img,"load",this),n.bind(this.img,"error",this),void(this.proxyImage.src=this.img.src))},h.prototype.getIsImageComplete=function(){return this.img.complete&&void 0!==this.img.naturalWidth},h.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("progress",this,this.img,t)},h.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},h.prototype.onload=function(){this.confirm(!0,"onload"),this.unbindEvents()},h.prototype.onerror=function(){this.confirm(!1,"onerror"),this.unbindEvents()},h.prototype.unbindEvents=function(){n.unbind(this.proxyImage,"load",this),n.unbind(this.proxyImage,"error",this),n.unbind(this.img,"load",this),n.unbind(this.img,"error",this)},a.prototype=new h,a.prototype.check=function(){n.bind(this.img,"load",this),n.bind(this.img,"error",this),this.img.src=this.url;var e=this.getIsImageComplete();e&&(this.confirm(0!==this.img.naturalWidth,"naturalWidth"),this.unbindEvents())},a.prototype.unbindEvents=function(){n.unbind(this.img,"load",this),n.unbind(this.img,"error",this)},a.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("progress",this,this.element,t)},o.makeJQueryPlugin=function(t){t=t||e.jQuery,t&&(u=t,u.fn.imagesLoaded=function(e,t){var n=new o(this,e,t);return n.jqDeferred.promise(u(this))})},o.makeJQueryPlugin(),o});;
/*!
 * Masonry PACKAGED v3.3.2
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

!function(a){function b(){}function c(a){function c(b){b.prototype.option||(b.prototype.option=function(b){a.isPlainObject(b)&&(this.options=a.extend(!0,this.options,b))})}function e(b,c){a.fn[b]=function(e){if("string"==typeof e){for(var g=d.call(arguments,1),h=0,i=this.length;i>h;h++){var j=this[h],k=a.data(j,b);if(k)if(a.isFunction(k[e])&&"_"!==e.charAt(0)){var l=k[e].apply(k,g);if(void 0!==l)return l}else f("no such method '"+e+"' for "+b+" instance");else f("cannot call methods on "+b+" prior to initialization; attempted to call '"+e+"'")}return this}return this.each(function(){var d=a.data(this,b);d?(d.option(e),d._init()):(d=new c(this,e),a.data(this,b,d))})}}if(a){var f="undefined"==typeof console?b:function(a){console.error(a)};return a.bridget=function(a,b){c(b),e(a,b)},a.bridget}}var d=Array.prototype.slice;"function"==typeof define&&define.amd?define("jquery-bridget/jquery.bridget",["jquery"],c):c("object"==typeof exports?require("jquery"):a.jQuery)}(window),function(a){function b(b){var c=a.event;return c.target=c.target||c.srcElement||b,c}var c=document.documentElement,d=function(){};c.addEventListener?d=function(a,b,c){a.addEventListener(b,c,!1)}:c.attachEvent&&(d=function(a,c,d){a[c+d]=d.handleEvent?function(){var c=b(a);d.handleEvent.call(d,c)}:function(){var c=b(a);d.call(a,c)},a.attachEvent("on"+c,a[c+d])});var e=function(){};c.removeEventListener?e=function(a,b,c){a.removeEventListener(b,c,!1)}:c.detachEvent&&(e=function(a,b,c){a.detachEvent("on"+b,a[b+c]);try{delete a[b+c]}catch(d){a[b+c]=void 0}});var f={bind:d,unbind:e};"function"==typeof define&&define.amd?define("eventie/eventie",f):"object"==typeof exports?module.exports=f:a.eventie=f}(window),function(){function a(){}function b(a,b){for(var c=a.length;c--;)if(a[c].listener===b)return c;return-1}function c(a){return function(){return this[a].apply(this,arguments)}}var d=a.prototype,e=this,f=e.EventEmitter;d.getListeners=function(a){var b,c,d=this._getEvents();if(a instanceof RegExp){b={};for(c in d)d.hasOwnProperty(c)&&a.test(c)&&(b[c]=d[c])}else b=d[a]||(d[a]=[]);return b},d.flattenListeners=function(a){var b,c=[];for(b=0;b<a.length;b+=1)c.push(a[b].listener);return c},d.getListenersAsObject=function(a){var b,c=this.getListeners(a);return c instanceof Array&&(b={},b[a]=c),b||c},d.addListener=function(a,c){var d,e=this.getListenersAsObject(a),f="object"==typeof c;for(d in e)e.hasOwnProperty(d)&&-1===b(e[d],c)&&e[d].push(f?c:{listener:c,once:!1});return this},d.on=c("addListener"),d.addOnceListener=function(a,b){return this.addListener(a,{listener:b,once:!0})},d.once=c("addOnceListener"),d.defineEvent=function(a){return this.getListeners(a),this},d.defineEvents=function(a){for(var b=0;b<a.length;b+=1)this.defineEvent(a[b]);return this},d.removeListener=function(a,c){var d,e,f=this.getListenersAsObject(a);for(e in f)f.hasOwnProperty(e)&&(d=b(f[e],c),-1!==d&&f[e].splice(d,1));return this},d.off=c("removeListener"),d.addListeners=function(a,b){return this.manipulateListeners(!1,a,b)},d.removeListeners=function(a,b){return this.manipulateListeners(!0,a,b)},d.manipulateListeners=function(a,b,c){var d,e,f=a?this.removeListener:this.addListener,g=a?this.removeListeners:this.addListeners;if("object"!=typeof b||b instanceof RegExp)for(d=c.length;d--;)f.call(this,b,c[d]);else for(d in b)b.hasOwnProperty(d)&&(e=b[d])&&("function"==typeof e?f.call(this,d,e):g.call(this,d,e));return this},d.removeEvent=function(a){var b,c=typeof a,d=this._getEvents();if("string"===c)delete d[a];else if(a instanceof RegExp)for(b in d)d.hasOwnProperty(b)&&a.test(b)&&delete d[b];else delete this._events;return this},d.removeAllListeners=c("removeEvent"),d.emitEvent=function(a,b){var c,d,e,f,g=this.getListenersAsObject(a);for(e in g)if(g.hasOwnProperty(e))for(d=g[e].length;d--;)c=g[e][d],c.once===!0&&this.removeListener(a,c.listener),f=c.listener.apply(this,b||[]),f===this._getOnceReturnValue()&&this.removeListener(a,c.listener);return this},d.trigger=c("emitEvent"),d.emit=function(a){var b=Array.prototype.slice.call(arguments,1);return this.emitEvent(a,b)},d.setOnceReturnValue=function(a){return this._onceReturnValue=a,this},d._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},d._getEvents=function(){return this._events||(this._events={})},a.noConflict=function(){return e.EventEmitter=f,a},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return a}):"object"==typeof module&&module.exports?module.exports=a:e.EventEmitter=a}.call(this),function(a){function b(a){if(a){if("string"==typeof d[a])return a;a=a.charAt(0).toUpperCase()+a.slice(1);for(var b,e=0,f=c.length;f>e;e++)if(b=c[e]+a,"string"==typeof d[b])return b}}var c="Webkit Moz ms Ms O".split(" "),d=document.documentElement.style;"function"==typeof define&&define.amd?define("get-style-property/get-style-property",[],function(){return b}):"object"==typeof exports?module.exports=b:a.getStyleProperty=b}(window),function(a){function b(a){var b=parseFloat(a),c=-1===a.indexOf("%")&&!isNaN(b);return c&&b}function c(){}function d(){for(var a={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},b=0,c=g.length;c>b;b++){var d=g[b];a[d]=0}return a}function e(c){function e(){if(!m){m=!0;var d=a.getComputedStyle;if(j=function(){var a=d?function(a){return d(a,null)}:function(a){return a.currentStyle};return function(b){var c=a(b);return c||f("Style returned "+c+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),c}}(),k=c("boxSizing")){var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style[k]="border-box";var g=document.body||document.documentElement;g.appendChild(e);var h=j(e);l=200===b(h.width),g.removeChild(e)}}}function h(a){if(e(),"string"==typeof a&&(a=document.querySelector(a)),a&&"object"==typeof a&&a.nodeType){var c=j(a);if("none"===c.display)return d();var f={};f.width=a.offsetWidth,f.height=a.offsetHeight;for(var h=f.isBorderBox=!(!k||!c[k]||"border-box"!==c[k]),m=0,n=g.length;n>m;m++){var o=g[m],p=c[o];p=i(a,p);var q=parseFloat(p);f[o]=isNaN(q)?0:q}var r=f.paddingLeft+f.paddingRight,s=f.paddingTop+f.paddingBottom,t=f.marginLeft+f.marginRight,u=f.marginTop+f.marginBottom,v=f.borderLeftWidth+f.borderRightWidth,w=f.borderTopWidth+f.borderBottomWidth,x=h&&l,y=b(c.width);y!==!1&&(f.width=y+(x?0:r+v));var z=b(c.height);return z!==!1&&(f.height=z+(x?0:s+w)),f.innerWidth=f.width-(r+v),f.innerHeight=f.height-(s+w),f.outerWidth=f.width+t,f.outerHeight=f.height+u,f}}function i(b,c){if(a.getComputedStyle||-1===c.indexOf("%"))return c;var d=b.style,e=d.left,f=b.runtimeStyle,g=f&&f.left;return g&&(f.left=b.currentStyle.left),d.left=c,c=d.pixelLeft,d.left=e,g&&(f.left=g),c}var j,k,l,m=!1;return h}var f="undefined"==typeof console?c:function(a){console.error(a)},g=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"];"function"==typeof define&&define.amd?define("get-size/get-size",["get-style-property/get-style-property"],e):"object"==typeof exports?module.exports=e(require("desandro-get-style-property")):a.getSize=e(a.getStyleProperty)}(window),function(a){function b(a){"function"==typeof a&&(b.isReady?a():g.push(a))}function c(a){var c="readystatechange"===a.type&&"complete"!==f.readyState;b.isReady||c||d()}function d(){b.isReady=!0;for(var a=0,c=g.length;c>a;a++){var d=g[a];d()}}function e(e){return"complete"===f.readyState?d():(e.bind(f,"DOMContentLoaded",c),e.bind(f,"readystatechange",c),e.bind(a,"load",c)),b}var f=a.document,g=[];b.isReady=!1,"function"==typeof define&&define.amd?define("doc-ready/doc-ready",["eventie/eventie"],e):"object"==typeof exports?module.exports=e(require("eventie")):a.docReady=e(a.eventie)}(window),function(a){function b(a,b){return a[g](b)}function c(a){if(!a.parentNode){var b=document.createDocumentFragment();b.appendChild(a)}}function d(a,b){c(a);for(var d=a.parentNode.querySelectorAll(b),e=0,f=d.length;f>e;e++)if(d[e]===a)return!0;return!1}function e(a,d){return c(a),b(a,d)}var f,g=function(){if(a.matches)return"matches";if(a.matchesSelector)return"matchesSelector";for(var b=["webkit","moz","ms","o"],c=0,d=b.length;d>c;c++){var e=b[c],f=e+"MatchesSelector";if(a[f])return f}}();if(g){var h=document.createElement("div"),i=b(h,"div");f=i?b:e}else f=d;"function"==typeof define&&define.amd?define("matches-selector/matches-selector",[],function(){return f}):"object"==typeof exports?module.exports=f:window.matchesSelector=f}(Element.prototype),function(a,b){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["doc-ready/doc-ready","matches-selector/matches-selector"],function(c,d){return b(a,c,d)}):"object"==typeof exports?module.exports=b(a,require("doc-ready"),require("desandro-matches-selector")):a.fizzyUIUtils=b(a,a.docReady,a.matchesSelector)}(window,function(a,b,c){var d={};d.extend=function(a,b){for(var c in b)a[c]=b[c];return a},d.modulo=function(a,b){return(a%b+b)%b};var e=Object.prototype.toString;d.isArray=function(a){return"[object Array]"==e.call(a)},d.makeArray=function(a){var b=[];if(d.isArray(a))b=a;else if(a&&"number"==typeof a.length)for(var c=0,e=a.length;e>c;c++)b.push(a[c]);else b.push(a);return b},d.indexOf=Array.prototype.indexOf?function(a,b){return a.indexOf(b)}:function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},d.removeFrom=function(a,b){var c=d.indexOf(a,b);-1!=c&&a.splice(c,1)},d.isElement="function"==typeof HTMLElement||"object"==typeof HTMLElement?function(a){return a instanceof HTMLElement}:function(a){return a&&"object"==typeof a&&1==a.nodeType&&"string"==typeof a.nodeName},d.setText=function(){function a(a,c){b=b||(void 0!==document.documentElement.textContent?"textContent":"innerText"),a[b]=c}var b;return a}(),d.getParent=function(a,b){for(;a!=document.body;)if(a=a.parentNode,c(a,b))return a},d.getQueryElement=function(a){return"string"==typeof a?document.querySelector(a):a},d.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},d.filterFindElements=function(a,b){a=d.makeArray(a);for(var e=[],f=0,g=a.length;g>f;f++){var h=a[f];if(d.isElement(h))if(b){c(h,b)&&e.push(h);for(var i=h.querySelectorAll(b),j=0,k=i.length;k>j;j++)e.push(i[j])}else e.push(h)}return e},d.debounceMethod=function(a,b,c){var d=a.prototype[b],e=b+"Timeout";a.prototype[b]=function(){var a=this[e];a&&clearTimeout(a);var b=arguments,f=this;this[e]=setTimeout(function(){d.apply(f,b),delete f[e]},c||100)}},d.toDashed=function(a){return a.replace(/(.)([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()};var f=a.console;return d.htmlInit=function(c,e){b(function(){for(var b=d.toDashed(e),g=document.querySelectorAll(".js-"+b),h="data-"+b+"-options",i=0,j=g.length;j>i;i++){var k,l=g[i],m=l.getAttribute(h);try{k=m&&JSON.parse(m)}catch(n){f&&f.error("Error parsing "+h+" on "+l.nodeName.toLowerCase()+(l.id?"#"+l.id:"")+": "+n);continue}var o=new c(l,k),p=a.jQuery;p&&p.data(l,e,o)}})},d}),function(a,b){"function"==typeof define&&define.amd?define("outlayer/item",["eventEmitter/EventEmitter","get-size/get-size","get-style-property/get-style-property","fizzy-ui-utils/utils"],function(c,d,e,f){return b(a,c,d,e,f)}):"object"==typeof exports?module.exports=b(a,require("wolfy87-eventemitter"),require("get-size"),require("desandro-get-style-property"),require("fizzy-ui-utils")):(a.Outlayer={},a.Outlayer.Item=b(a,a.EventEmitter,a.getSize,a.getStyleProperty,a.fizzyUIUtils))}(window,function(a,b,c,d,e){function f(a){for(var b in a)return!1;return b=null,!0}function g(a,b){a&&(this.element=a,this.layout=b,this.position={x:0,y:0},this._create())}function h(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}var i=a.getComputedStyle,j=i?function(a){return i(a,null)}:function(a){return a.currentStyle},k=d("transition"),l=d("transform"),m=k&&l,n=!!d("perspective"),o={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"otransitionend",transition:"transitionend"}[k],p=["transform","transition","transitionDuration","transitionProperty"],q=function(){for(var a={},b=0,c=p.length;c>b;b++){var e=p[b],f=d(e);f&&f!==e&&(a[e]=f)}return a}();e.extend(g.prototype,b.prototype),g.prototype._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.getSize=function(){this.size=c(this.element)},g.prototype.css=function(a){var b=this.element.style;for(var c in a){var d=q[c]||c;b[d]=a[c]}},g.prototype.getPosition=function(){var a=j(this.element),b=this.layout.options,c=b.isOriginLeft,d=b.isOriginTop,e=a[c?"left":"right"],f=a[d?"top":"bottom"],g=this.layout.size,h=-1!=e.indexOf("%")?parseFloat(e)/100*g.width:parseInt(e,10),i=-1!=f.indexOf("%")?parseFloat(f)/100*g.height:parseInt(f,10);h=isNaN(h)?0:h,i=isNaN(i)?0:i,h-=c?g.paddingLeft:g.paddingRight,i-=d?g.paddingTop:g.paddingBottom,this.position.x=h,this.position.y=i},g.prototype.layoutPosition=function(){var a=this.layout.size,b=this.layout.options,c={},d=b.isOriginLeft?"paddingLeft":"paddingRight",e=b.isOriginLeft?"left":"right",f=b.isOriginLeft?"right":"left",g=this.position.x+a[d];c[e]=this.getXValue(g),c[f]="";var h=b.isOriginTop?"paddingTop":"paddingBottom",i=b.isOriginTop?"top":"bottom",j=b.isOriginTop?"bottom":"top",k=this.position.y+a[h];c[i]=this.getYValue(k),c[j]="",this.css(c),this.emitEvent("layout",[this])},g.prototype.getXValue=function(a){var b=this.layout.options;return b.percentPosition&&!b.isHorizontal?a/this.layout.size.width*100+"%":a+"px"},g.prototype.getYValue=function(a){var b=this.layout.options;return b.percentPosition&&b.isHorizontal?a/this.layout.size.height*100+"%":a+"px"},g.prototype._transitionTo=function(a,b){this.getPosition();var c=this.position.x,d=this.position.y,e=parseInt(a,10),f=parseInt(b,10),g=e===this.position.x&&f===this.position.y;if(this.setPosition(a,b),g&&!this.isTransitioning)return void this.layoutPosition();var h=a-c,i=b-d,j={};j.transform=this.getTranslate(h,i),this.transition({to:j,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},g.prototype.getTranslate=function(a,b){var c=this.layout.options;return a=c.isOriginLeft?a:-a,b=c.isOriginTop?b:-b,n?"translate3d("+a+"px, "+b+"px, 0)":"translate("+a+"px, "+b+"px)"},g.prototype.goTo=function(a,b){this.setPosition(a,b),this.layoutPosition()},g.prototype.moveTo=m?g.prototype._transitionTo:g.prototype.goTo,g.prototype.setPosition=function(a,b){this.position.x=parseInt(a,10),this.position.y=parseInt(b,10)},g.prototype._nonTransition=function(a){this.css(a.to),a.isCleaning&&this._removeStyles(a.to);for(var b in a.onTransitionEnd)a.onTransitionEnd[b].call(this)},g.prototype._transition=function(a){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(a);var b=this._transn;for(var c in a.onTransitionEnd)b.onEnd[c]=a.onTransitionEnd[c];for(c in a.to)b.ingProperties[c]=!0,a.isCleaning&&(b.clean[c]=!0);if(a.from){this.css(a.from);var d=this.element.offsetHeight;d=null}this.enableTransition(a.to),this.css(a.to),this.isTransitioning=!0};var r="opacity,"+h(q.transform||"transform");g.prototype.enableTransition=function(){this.isTransitioning||(this.css({transitionProperty:r,transitionDuration:this.layout.options.transitionDuration}),this.element.addEventListener(o,this,!1))},g.prototype.transition=g.prototype[k?"_transition":"_nonTransition"],g.prototype.onwebkitTransitionEnd=function(a){this.ontransitionend(a)},g.prototype.onotransitionend=function(a){this.ontransitionend(a)};var s={"-webkit-transform":"transform","-moz-transform":"transform","-o-transform":"transform"};g.prototype.ontransitionend=function(a){if(a.target===this.element){var b=this._transn,c=s[a.propertyName]||a.propertyName;if(delete b.ingProperties[c],f(b.ingProperties)&&this.disableTransition(),c in b.clean&&(this.element.style[a.propertyName]="",delete b.clean[c]),c in b.onEnd){var d=b.onEnd[c];d.call(this),delete b.onEnd[c]}this.emitEvent("transitionEnd",[this])}},g.prototype.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(o,this,!1),this.isTransitioning=!1},g.prototype._removeStyles=function(a){var b={};for(var c in a)b[c]="";this.css(b)};var t={transitionProperty:"",transitionDuration:""};return g.prototype.removeTransitionStyles=function(){this.css(t)},g.prototype.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},g.prototype.remove=function(){if(!k||!parseFloat(this.layout.options.transitionDuration))return void this.removeElem();var a=this;this.once("transitionEnd",function(){a.removeElem()}),this.hide()},g.prototype.reveal=function(){delete this.isHidden,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("visibleStyle");b[c]=this.onRevealTransitionEnd,this.transition({from:a.hiddenStyle,to:a.visibleStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},g.prototype.getHideRevealTransitionEndProperty=function(a){var b=this.layout.options[a];if(b.opacity)return"opacity";for(var c in b)return c},g.prototype.hide=function(){this.isHidden=!0,this.css({display:""});var a=this.layout.options,b={},c=this.getHideRevealTransitionEndProperty("hiddenStyle");b[c]=this.onHideTransitionEnd,this.transition({from:a.visibleStyle,to:a.hiddenStyle,isCleaning:!0,onTransitionEnd:b})},g.prototype.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},g.prototype.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},g}),function(a,b){"function"==typeof define&&define.amd?define("outlayer/outlayer",["eventie/eventie","eventEmitter/EventEmitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(c,d,e,f,g){return b(a,c,d,e,f,g)}):"object"==typeof exports?module.exports=b(a,require("eventie"),require("wolfy87-eventemitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):a.Outlayer=b(a,a.eventie,a.EventEmitter,a.getSize,a.fizzyUIUtils,a.Outlayer.Item)}(window,function(a,b,c,d,e,f){function g(a,b){var c=e.getQueryElement(a);if(!c)return void(h&&h.error("Bad element for "+this.constructor.namespace+": "+(c||a)));this.element=c,i&&(this.$element=i(this.element)),this.options=e.extend({},this.constructor.defaults),this.option(b);var d=++k;this.element.outlayerGUID=d,l[d]=this,this._create(),this.options.isInitLayout&&this.layout()}var h=a.console,i=a.jQuery,j=function(){},k=0,l={};return g.namespace="outlayer",g.Item=f,g.defaults={containerStyle:{position:"relative"},isInitLayout:!0,isOriginLeft:!0,isOriginTop:!0,isResizeBound:!0,isResizingContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}},e.extend(g.prototype,c.prototype),g.prototype.option=function(a){e.extend(this.options,a)},g.prototype._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),e.extend(this.element.style,this.options.containerStyle),this.options.isResizeBound&&this.bindResize()},g.prototype.reloadItems=function(){this.items=this._itemize(this.element.children)},g.prototype._itemize=function(a){for(var b=this._filterFindItemElements(a),c=this.constructor.Item,d=[],e=0,f=b.length;f>e;e++){var g=b[e],h=new c(g,this);d.push(h)}return d},g.prototype._filterFindItemElements=function(a){return e.filterFindElements(a,this.options.itemSelector)},g.prototype.getItemElements=function(){for(var a=[],b=0,c=this.items.length;c>b;b++)a.push(this.items[b].element);return a},g.prototype.layout=function(){this._resetLayout(),this._manageStamps();var a=void 0!==this.options.isLayoutInstant?this.options.isLayoutInstant:!this._isLayoutInited;this.layoutItems(this.items,a),this._isLayoutInited=!0},g.prototype._init=g.prototype.layout,g.prototype._resetLayout=function(){this.getSize()},g.prototype.getSize=function(){this.size=d(this.element)},g.prototype._getMeasurement=function(a,b){var c,f=this.options[a];f?("string"==typeof f?c=this.element.querySelector(f):e.isElement(f)&&(c=f),this[a]=c?d(c)[b]:f):this[a]=0},g.prototype.layoutItems=function(a,b){a=this._getItemsForLayout(a),this._layoutItems(a,b),this._postLayout()},g.prototype._getItemsForLayout=function(a){for(var b=[],c=0,d=a.length;d>c;c++){var e=a[c];e.isIgnored||b.push(e)}return b},g.prototype._layoutItems=function(a,b){if(this._emitCompleteOnItems("layout",a),a&&a.length){for(var c=[],d=0,e=a.length;e>d;d++){var f=a[d],g=this._getItemLayoutPosition(f);g.item=f,g.isInstant=b||f.isLayoutInstant,c.push(g)}this._processLayoutQueue(c)}},g.prototype._getItemLayoutPosition=function(){return{x:0,y:0}},g.prototype._processLayoutQueue=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];this._positionItem(d.item,d.x,d.y,d.isInstant)}},g.prototype._positionItem=function(a,b,c,d){d?a.goTo(b,c):a.moveTo(b,c)},g.prototype._postLayout=function(){this.resizeContainer()},g.prototype.resizeContainer=function(){if(this.options.isResizingContainer){var a=this._getContainerSize();a&&(this._setContainerMeasure(a.width,!0),this._setContainerMeasure(a.height,!1))}},g.prototype._getContainerSize=j,g.prototype._setContainerMeasure=function(a,b){if(void 0!==a){var c=this.size;c.isBorderBox&&(a+=b?c.paddingLeft+c.paddingRight+c.borderLeftWidth+c.borderRightWidth:c.paddingBottom+c.paddingTop+c.borderTopWidth+c.borderBottomWidth),a=Math.max(a,0),this.element.style[b?"width":"height"]=a+"px"}},g.prototype._emitCompleteOnItems=function(a,b){function c(){e.dispatchEvent(a+"Complete",null,[b])}function d(){g++,g===f&&c()}var e=this,f=b.length;if(!b||!f)return void c();for(var g=0,h=0,i=b.length;i>h;h++){var j=b[h];j.once(a,d)}},g.prototype.dispatchEvent=function(a,b,c){var d=b?[b].concat(c):c;if(this.emitEvent(a,d),i)if(this.$element=this.$element||i(this.element),b){var e=i.Event(b);e.type=a,this.$element.trigger(e,c)}else this.$element.trigger(a,c)},g.prototype.ignore=function(a){var b=this.getItem(a);b&&(b.isIgnored=!0)},g.prototype.unignore=function(a){var b=this.getItem(a);b&&delete b.isIgnored},g.prototype.stamp=function(a){if(a=this._find(a)){this.stamps=this.stamps.concat(a);for(var b=0,c=a.length;c>b;b++){var d=a[b];this.ignore(d)}}},g.prototype.unstamp=function(a){if(a=this._find(a))for(var b=0,c=a.length;c>b;b++){var d=a[b];e.removeFrom(this.stamps,d),this.unignore(d)}},g.prototype._find=function(a){return a?("string"==typeof a&&(a=this.element.querySelectorAll(a)),a=e.makeArray(a)):void 0},g.prototype._manageStamps=function(){if(this.stamps&&this.stamps.length){this._getBoundingRect();for(var a=0,b=this.stamps.length;b>a;a++){var c=this.stamps[a];this._manageStamp(c)}}},g.prototype._getBoundingRect=function(){var a=this.element.getBoundingClientRect(),b=this.size;this._boundingRect={left:a.left+b.paddingLeft+b.borderLeftWidth,top:a.top+b.paddingTop+b.borderTopWidth,right:a.right-(b.paddingRight+b.borderRightWidth),bottom:a.bottom-(b.paddingBottom+b.borderBottomWidth)}},g.prototype._manageStamp=j,g.prototype._getElementOffset=function(a){var b=a.getBoundingClientRect(),c=this._boundingRect,e=d(a),f={left:b.left-c.left-e.marginLeft,top:b.top-c.top-e.marginTop,right:c.right-b.right-e.marginRight,bottom:c.bottom-b.bottom-e.marginBottom};return f},g.prototype.handleEvent=function(a){var b="on"+a.type;this[b]&&this[b](a)},g.prototype.bindResize=function(){this.isResizeBound||(b.bind(a,"resize",this),this.isResizeBound=!0)},g.prototype.unbindResize=function(){this.isResizeBound&&b.unbind(a,"resize",this),this.isResizeBound=!1},g.prototype.onresize=function(){function a(){b.resize(),delete b.resizeTimeout}this.resizeTimeout&&clearTimeout(this.resizeTimeout);var b=this;this.resizeTimeout=setTimeout(a,100)},g.prototype.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},g.prototype.needsResizeLayout=function(){var a=d(this.element),b=this.size&&a;return b&&a.innerWidth!==this.size.innerWidth},g.prototype.addItems=function(a){var b=this._itemize(a);return b.length&&(this.items=this.items.concat(b)),b},g.prototype.appended=function(a){var b=this.addItems(a);b.length&&(this.layoutItems(b,!0),this.reveal(b))},g.prototype.prepended=function(a){var b=this._itemize(a);if(b.length){var c=this.items.slice(0);this.items=b.concat(c),this._resetLayout(),this._manageStamps(),this.layoutItems(b,!0),this.reveal(b),this.layoutItems(c)}},g.prototype.reveal=function(a){this._emitCompleteOnItems("reveal",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.reveal()}},g.prototype.hide=function(a){this._emitCompleteOnItems("hide",a);for(var b=a&&a.length,c=0;b&&b>c;c++){var d=a[c];d.hide()}},g.prototype.revealItemElements=function(a){var b=this.getItems(a);this.reveal(b)},g.prototype.hideItemElements=function(a){var b=this.getItems(a);this.hide(b)},g.prototype.getItem=function(a){for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];if(d.element===a)return d}},g.prototype.getItems=function(a){a=e.makeArray(a);for(var b=[],c=0,d=a.length;d>c;c++){var f=a[c],g=this.getItem(f);g&&b.push(g)}return b},g.prototype.remove=function(a){var b=this.getItems(a);if(this._emitCompleteOnItems("remove",b),b&&b.length)for(var c=0,d=b.length;d>c;c++){var f=b[c];f.remove(),e.removeFrom(this.items,f)}},g.prototype.destroy=function(){var a=this.element.style;a.height="",a.position="",a.width="";for(var b=0,c=this.items.length;c>b;b++){var d=this.items[b];d.destroy()}this.unbindResize();var e=this.element.outlayerGUID;delete l[e],delete this.element.outlayerGUID,i&&i.removeData(this.element,this.constructor.namespace)},g.data=function(a){a=e.getQueryElement(a);var b=a&&a.outlayerGUID;return b&&l[b]},g.create=function(a,b){function c(){g.apply(this,arguments)}return Object.create?c.prototype=Object.create(g.prototype):e.extend(c.prototype,g.prototype),c.prototype.constructor=c,c.defaults=e.extend({},g.defaults),e.extend(c.defaults,b),c.prototype.settings={},c.namespace=a,c.data=g.data,c.Item=function(){f.apply(this,arguments)},c.Item.prototype=new f,e.htmlInit(c,a),i&&i.bridget&&i.bridget(a,c),c},g.Item=f,g}),function(a,b){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size","fizzy-ui-utils/utils"],b):"object"==typeof exports?module.exports=b(require("outlayer"),require("get-size"),require("fizzy-ui-utils")):a.Masonry=b(a.Outlayer,a.getSize,a.fizzyUIUtils)}(window,function(a,b,c){var d=a.create("masonry");return d.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns();var a=this.cols;for(this.colYs=[];a--;)this.colYs.push(0);this.maxY=0},d.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var a=this.items[0],c=a&&a.element;this.columnWidth=c&&b(c).outerWidth||this.containerWidth}var d=this.columnWidth+=this.gutter,e=this.containerWidth+this.gutter,f=e/d,g=d-e%d,h=g&&1>g?"round":"floor";f=Math[h](f),this.cols=Math.max(f,1)},d.prototype.getContainerWidth=function(){var a=this.options.isFitWidth?this.element.parentNode:this.element,c=b(a);this.containerWidth=c&&c.innerWidth},d.prototype._getItemLayoutPosition=function(a){a.getSize();var b=a.size.outerWidth%this.columnWidth,d=b&&1>b?"round":"ceil",e=Math[d](a.size.outerWidth/this.columnWidth);e=Math.min(e,this.cols);for(var f=this._getColGroup(e),g=Math.min.apply(Math,f),h=c.indexOf(f,g),i={x:this.columnWidth*h,y:g},j=g+a.size.outerHeight,k=this.cols+1-f.length,l=0;k>l;l++)this.colYs[h+l]=j;return i},d.prototype._getColGroup=function(a){if(2>a)return this.colYs;for(var b=[],c=this.cols+1-a,d=0;c>d;d++){var e=this.colYs.slice(d,d+a);b[d]=Math.max.apply(Math,e)}return b},d.prototype._manageStamp=function(a){var c=b(a),d=this._getElementOffset(a),e=this.options.isOriginLeft?d.left:d.right,f=e+c.outerWidth,g=Math.floor(e/this.columnWidth);g=Math.max(0,g);var h=Math.floor(f/this.columnWidth);h-=f%this.columnWidth?0:1,h=Math.min(this.cols-1,h);for(var i=(this.options.isOriginTop?d.top:d.bottom)+c.outerHeight,j=g;h>=j;j++)this.colYs[j]=Math.max(i,this.colYs[j])},d.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var a={height:this.maxY};return this.options.isFitWidth&&(a.width=this._getContainerFitWidth()),a},d.prototype._getContainerFitWidth=function(){for(var a=0,b=this.cols;--b&&0===this.colYs[b];)a++;return(this.cols-a)*this.columnWidth-this.gutter},d.prototype.needsResizeLayout=function(){var a=this.containerWidth;return this.getContainerWidth(),a!==this.containerWidth},d});;
( function( $ ) {

	$( window ).load( function() {

		var widgets_area = $( '.widgets-area' );

		$( '#secondary' ).on( 'click', '.widgets-trigger', function( event ) {
			event.preventDefault();
			$( this ).toggleClass( 'active' );

			// Remove mejs players from sidebar
			$( '#secondary .mejs-container' ).each( function( i, el ) {
				if ( mejs.players[ el.id ] ) {
					mejs.players[ el.id ].remove();
				}
			} );

			if( $( this ).hasClass( 'active' ) ) {
				$( '.widgets-wrapper' ).slideDown( 250 );
				// Trigger resize to make sure widgets fit prefectly.
				$( this ).trigger( 'resize' );
				// Masonry blocks
				widgets_area.imagesLoaded( function() {
					if ( $( 'body' ).hasClass( 'rtl' ) ) {
						widgets_area.masonry( {
							columnWidth: 1,
							itemSelector: '.widget',
							transitionDuration: 0,
							isOriginLeft: false
						} );
					} else {
						widgets_area.masonry( {
							columnWidth: 1,
							itemSelector: '.widget',
							transitionDuration: 0
						} );
					}
					// Show the widgets
					widgets_area.children( '.widget' ).animate( {
						'opacity' : 1
					}, 250 );
				} );

				// Re-initialize mediaelement players.
				setTimeout( function() {
					if ( window.wp && window.wp.mediaelement ) {
						window.wp.mediaelement.initialize();
					}
				} );

				// Trigger resize event to display VideoPress player.
				setTimeout( function(){
					if ( typeof( Event ) === 'function' ) {
						window.dispatchEvent( new Event( 'resize' ) );
					} else {
						var event = window.document.createEvent( 'UIEvents' );
						event.initUIEvent( 'resize', true, false, window, 0 );
						window.dispatchEvent( event );
					}
				} );
			} else {
				$( '.widgets-wrapper' ).slideUp( 250 );
				// Make sure the widgets are hidden
				widgets_area.children( '.widget' ).animate( {
					'opacity' : 0
				}, 250 );
			}
		} );
		$( '#secondary' ).on( 'mouseenter mouseleave', '.widgets-trigger', function() {
			$( '#secondary' ).toggleClass( 'hover' );
		} );

		$( window ).resize( function () {

			// Force layout correction after 1500 milliseconds
			setTimeout( function () {
				widgets_area.masonry();
			}, 1500 );

		} );

	} );

} )( jQuery );
;
(function(){function r(){}var n=this,t=n._,e=Array.prototype,o=Object.prototype,u=Function.prototype,i=e.push,c=e.slice,s=o.toString,a=o.hasOwnProperty,f=Array.isArray,l=Object.keys,p=u.bind,h=Object.create,v=function(n){return n instanceof v?n:this instanceof v?void(this._wrapped=n):new v(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=v),exports._=v):n._=v,v.VERSION="1.8.3";var y=function(u,i,n){if(void 0===i)return u;switch(null==n?3:n){case 1:return function(n){return u.call(i,n)};case 2:return function(n,t){return u.call(i,n,t)};case 3:return function(n,t,r){return u.call(i,n,t,r)};case 4:return function(n,t,r,e){return u.call(i,n,t,r,e)}}return function(){return u.apply(i,arguments)}},d=function(n,t,r){return null==n?v.identity:v.isFunction(n)?y(n,t,r):v.isObject(n)?v.matcher(n):v.property(n)};v.iteratee=function(n,t){return d(n,t,1/0)};function g(c,f){return function(n){var t=arguments.length;if(t<2||null==n)return n;for(var r=1;r<t;r++)for(var e=arguments[r],u=c(e),i=u.length,o=0;o<i;o++){var a=u[o];f&&void 0!==n[a]||(n[a]=e[a])}return n}}function m(n){if(!v.isObject(n))return{};if(h)return h(n);r.prototype=n;var t=new r;return r.prototype=null,t}function b(t){return function(n){return null==n?void 0:n[t]}}var x=Math.pow(2,53)-1,_=b("length"),j=function(n){var t=_(n);return"number"==typeof t&&0<=t&&t<=x};function w(a){return function(n,t,r,e){t=y(t,e,4);var u=!j(n)&&v.keys(n),i=(u||n).length,o=0<a?0:i-1;return arguments.length<3&&(r=n[u?u[o]:o],o+=a),function(n,t,r,e,u,i){for(;0<=u&&u<i;u+=a){var o=e?e[u]:u;r=t(r,n[o],o,n)}return r}(n,t,r,u,o,i)}}v.each=v.forEach=function(n,t,r){var e,u;if(t=y(t,r),j(n))for(e=0,u=n.length;e<u;e++)t(n[e],e,n);else{var i=v.keys(n);for(e=0,u=i.length;e<u;e++)t(n[i[e]],i[e],n)}return n},v.map=v.collect=function(n,t,r){t=d(t,r);for(var e=!j(n)&&v.keys(n),u=(e||n).length,i=Array(u),o=0;o<u;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},v.reduce=v.foldl=v.inject=w(1),v.reduceRight=v.foldr=w(-1),v.find=v.detect=function(n,t,r){var e;if(void 0!==(e=j(n)?v.findIndex(n,t,r):v.findKey(n,t,r))&&-1!==e)return n[e]},v.filter=v.select=function(n,e,t){var u=[];return e=d(e,t),v.each(n,function(n,t,r){e(n,t,r)&&u.push(n)}),u},v.reject=function(n,t,r){return v.filter(n,v.negate(d(t)),r)},v.every=v.all=function(n,t,r){t=d(t,r);for(var e=!j(n)&&v.keys(n),u=(e||n).length,i=0;i<u;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},v.some=v.any=function(n,t,r){t=d(t,r);for(var e=!j(n)&&v.keys(n),u=(e||n).length,i=0;i<u;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},v.contains=v.includes=v.include=function(n,t,r,e){return j(n)||(n=v.values(n)),"number"==typeof r&&!e||(r=0),0<=v.indexOf(n,t,r)},v.invoke=function(n,r){var e=c.call(arguments,2),u=v.isFunction(r);return v.map(n,function(n){var t=u?r:n[r];return null==t?t:t.apply(n,e)})},v.pluck=function(n,t){return v.map(n,v.property(t))},v.where=function(n,t){return v.filter(n,v.matcher(t))},v.findWhere=function(n,t){return v.find(n,v.matcher(t))},v.max=function(n,e,t){var r,u,i=-1/0,o=-1/0;if(null==e&&null!=n)for(var a=0,c=(n=j(n)?n:v.values(n)).length;a<c;a++)r=n[a],i<r&&(i=r);else e=d(e,t),v.each(n,function(n,t,r){u=e(n,t,r),(o<u||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},v.min=function(n,e,t){var r,u,i=1/0,o=1/0;if(null==e&&null!=n)for(var a=0,c=(n=j(n)?n:v.values(n)).length;a<c;a++)(r=n[a])<i&&(i=r);else e=d(e,t),v.each(n,function(n,t,r){((u=e(n,t,r))<o||u===1/0&&i===1/0)&&(i=n,o=u)});return i},v.shuffle=function(n){for(var t,r=j(n)?n:v.values(n),e=r.length,u=Array(e),i=0;i<e;i++)(t=v.random(0,i))!==i&&(u[i]=u[t]),u[t]=r[i];return u},v.sample=function(n,t,r){return null==t||r?(j(n)||(n=v.values(n)),n[v.random(n.length-1)]):v.shuffle(n).slice(0,Math.max(0,t))},v.sortBy=function(n,e,t){return e=d(e,t),v.pluck(v.map(n,function(n,t,r){return{value:n,index:t,criteria:e(n,t,r)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(e<r||void 0===r)return 1;if(r<e||void 0===e)return-1}return n.index-t.index}),"value")};function A(o){return function(e,u,n){var i={};return u=d(u,n),v.each(e,function(n,t){var r=u(n,t,e);o(i,n,r)}),i}}v.groupBy=A(function(n,t,r){v.has(n,r)?n[r].push(t):n[r]=[t]}),v.indexBy=A(function(n,t,r){n[r]=t}),v.countBy=A(function(n,t,r){v.has(n,r)?n[r]++:n[r]=1}),v.toArray=function(n){return n?v.isArray(n)?c.call(n):j(n)?v.map(n,v.identity):v.values(n):[]},v.size=function(n){return null==n?0:j(n)?n.length:v.keys(n).length},v.partition=function(n,e,t){e=d(e,t);var u=[],i=[];return v.each(n,function(n,t,r){(e(n,t,r)?u:i).push(n)}),[u,i]},v.first=v.head=v.take=function(n,t,r){if(null!=n)return null==t||r?n[0]:v.initial(n,n.length-t)},v.initial=function(n,t,r){return c.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},v.last=function(n,t,r){if(null!=n)return null==t||r?n[n.length-1]:v.rest(n,Math.max(0,n.length-t))},v.rest=v.tail=v.drop=function(n,t,r){return c.call(n,null==t||r?1:t)},v.compact=function(n){return v.filter(n,v.identity)};var O=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=_(n);o<a;o++){var c=n[o];if(j(c)&&(v.isArray(c)||v.isArguments(c))){t||(c=O(c,t,r));var f=0,l=c.length;for(u.length+=l;f<l;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};function k(i){return function(n,t,r){t=d(t,r);for(var e=_(n),u=0<i?0:e-1;0<=u&&u<e;u+=i)if(t(n[u],u,n))return u;return-1}}function F(i,o,a){return function(n,t,r){var e=0,u=_(n);if("number"==typeof r)0<i?e=0<=r?r:Math.max(r+u,e):u=0<=r?Math.min(r+1,u):r+u+1;else if(a&&r&&u)return n[r=a(n,t)]===t?r:-1;if(t!=t)return 0<=(r=o(c.call(n,e,u),v.isNaN))?r+e:-1;for(r=0<i?e:u-1;0<=r&&r<u;r+=i)if(n[r]===t)return r;return-1}}v.flatten=function(n,t){return O(n,t,!1)},v.without=function(n){return v.difference(n,c.call(arguments,1))},v.uniq=v.unique=function(n,t,r,e){v.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=d(r,e));for(var u=[],i=[],o=0,a=_(n);o<a;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?v.contains(i,f)||(i.push(f),u.push(c)):v.contains(u,c)||u.push(c)}return u},v.union=function(){return v.uniq(O(arguments,!0,!0))},v.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=_(n);e<u;e++){var i=n[e];if(!v.contains(t,i)){for(var o=1;o<r&&v.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},v.difference=function(n){var t=O(arguments,!0,!0,1);return v.filter(n,function(n){return!v.contains(t,n)})},v.zip=function(){return v.unzip(arguments)},v.unzip=function(n){for(var t=n&&v.max(n,_).length||0,r=Array(t),e=0;e<t;e++)r[e]=v.pluck(n,e);return r},v.object=function(n,t){for(var r={},e=0,u=_(n);e<u;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},v.findIndex=k(1),v.findLastIndex=k(-1),v.sortedIndex=function(n,t,r,e){for(var u=(r=d(r,e,1))(t),i=0,o=_(n);i<o;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},v.indexOf=F(1,v.findIndex,v.sortedIndex),v.lastIndexOf=F(-1,v.findLastIndex),v.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;i<e;i++,n+=r)u[i]=n;return u};function S(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=m(n.prototype),o=n.apply(i,u);return v.isObject(o)?o:i}v.bind=function(n,t){if(p&&n.bind===p)return p.apply(n,c.call(arguments,1));if(!v.isFunction(n))throw new TypeError("Bind must be called on a function");var r=c.call(arguments,2),e=function(){return S(n,e,t,this,r.concat(c.call(arguments)))};return e},v.partial=function(u){var i=c.call(arguments,1),o=function(){for(var n=0,t=i.length,r=Array(t),e=0;e<t;e++)r[e]=i[e]===v?arguments[n++]:i[e];for(;n<arguments.length;)r.push(arguments[n++]);return S(u,o,this,this,r)};return o},v.bindAll=function(n){var t,r,e=arguments.length;if(e<=1)throw new Error("bindAll must be passed function names");for(t=1;t<e;t++)n[r=arguments[t]]=v.bind(n[r],n);return n},v.memoize=function(e,u){var i=function(n){var t=i.cache,r=""+(u?u.apply(this,arguments):n);return v.has(t,r)||(t[r]=e.apply(this,arguments)),t[r]};return i.cache={},i},v.delay=function(n,t){var r=c.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},v.defer=v.partial(v.delay,v,1),v.throttle=function(r,e,u){var i,o,a,c=null,f=0;u=u||{};function l(){f=!1===u.leading?0:v.now(),c=null,a=r.apply(i,o),c||(i=o=null)}return function(){var n=v.now();f||!1!==u.leading||(f=n);var t=e-(n-f);return i=this,o=arguments,t<=0||e<t?(c&&(clearTimeout(c),c=null),f=n,a=r.apply(i,o),c||(i=o=null)):c||!1===u.trailing||(c=setTimeout(l,t)),a}},v.debounce=function(t,r,e){var u,i,o,a,c,f=function(){var n=v.now()-a;n<r&&0<=n?u=setTimeout(f,r-n):(u=null,e||(c=t.apply(o,i),u||(o=i=null)))};return function(){o=this,i=arguments,a=v.now();var n=e&&!u;return u=u||setTimeout(f,r),n&&(c=t.apply(o,i),o=i=null),c}},v.wrap=function(n,t){return v.partial(t,n)},v.negate=function(n){return function(){return!n.apply(this,arguments)}},v.compose=function(){var r=arguments,e=r.length-1;return function(){for(var n=e,t=r[e].apply(this,arguments);n--;)t=r[n].call(this,t);return t}},v.after=function(n,t){return function(){if(--n<1)return t.apply(this,arguments)}},v.before=function(n,t){var r;return function(){return 0<--n&&(r=t.apply(this,arguments)),n<=1&&(t=null),r}},v.once=v.partial(v.before,2);var E=!{toString:null}.propertyIsEnumerable("toString"),M=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];function I(n,t){var r=M.length,e=n.constructor,u=v.isFunction(e)&&e.prototype||o,i="constructor";for(v.has(n,i)&&!v.contains(t,i)&&t.push(i);r--;)(i=M[r])in n&&n[i]!==u[i]&&!v.contains(t,i)&&t.push(i)}v.keys=function(n){if(!v.isObject(n))return[];if(l)return l(n);var t=[];for(var r in n)v.has(n,r)&&t.push(r);return E&&I(n,t),t},v.allKeys=function(n){if(!v.isObject(n))return[];var t=[];for(var r in n)t.push(r);return E&&I(n,t),t},v.values=function(n){for(var t=v.keys(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=n[t[u]];return e},v.mapObject=function(n,t,r){t=d(t,r);for(var e,u=v.keys(n),i=u.length,o={},a=0;a<i;a++)o[e=u[a]]=t(n[e],e,n);return o},v.pairs=function(n){for(var t=v.keys(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=[t[u],n[t[u]]];return e},v.invert=function(n){for(var t={},r=v.keys(n),e=0,u=r.length;e<u;e++)t[n[r[e]]]=r[e];return t},v.functions=v.methods=function(n){var t=[];for(var r in n)v.isFunction(n[r])&&t.push(r);return t.sort()},v.extend=g(v.allKeys),v.extendOwn=v.assign=g(v.keys),v.findKey=function(n,t,r){t=d(t,r);for(var e,u=v.keys(n),i=0,o=u.length;i<o;i++)if(t(n[e=u[i]],e,n))return e},v.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;v.isFunction(t)?(u=v.allKeys(o),e=y(t,r)):(u=O(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;a<c;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},v.omit=function(n,t,r){if(v.isFunction(t))t=v.negate(t);else{var e=v.map(O(arguments,!1,!1,1),String);t=function(n,t){return!v.contains(e,t)}}return v.pick(n,t,r)},v.defaults=g(v.allKeys,!0),v.create=function(n,t){var r=m(n);return t&&v.extendOwn(r,t),r},v.clone=function(n){return v.isObject(n)?v.isArray(n)?n.slice():v.extend({},n):n},v.tap=function(n,t){return t(n),n},v.isMatch=function(n,t){var r=v.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;i<e;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof v&&(n=n._wrapped),t instanceof v&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!=+n?+t!=+t:0==+n?1/+n==1/t:+n==+t;case"[object Date]":case"[object Boolean]":return+n==+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(v.isFunction(o)&&o instanceof o&&v.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}e=e||[];for(var c=(r=r||[]).length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if((c=n.length)!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=v.keys(n);if(c=l.length,v.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!v.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};v.isEqual=function(n,t){return N(n,t)},v.isEmpty=function(n){return null==n||(j(n)&&(v.isArray(n)||v.isString(n)||v.isArguments(n))?0===n.length:0===v.keys(n).length)},v.isElement=function(n){return!(!n||1!==n.nodeType)},v.isArray=f||function(n){return"[object Array]"===s.call(n)},v.isObject=function(n){var t=typeof n;return"function"==t||"object"==t&&!!n},v.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(t){v["is"+t]=function(n){return s.call(n)==="[object "+t+"]"}}),v.isArguments(arguments)||(v.isArguments=function(n){return v.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(v.isFunction=function(n){return"function"==typeof n||!1}),v.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},v.isNaN=function(n){return v.isNumber(n)&&n!==+n},v.isBoolean=function(n){return!0===n||!1===n||"[object Boolean]"===s.call(n)},v.isNull=function(n){return null===n},v.isUndefined=function(n){return void 0===n},v.has=function(n,t){return null!=n&&a.call(n,t)},v.noConflict=function(){return n._=t,this},v.identity=function(n){return n},v.constant=function(n){return function(){return n}},v.noop=function(){},v.property=b,v.propertyOf=function(t){return null==t?function(){}:function(n){return t[n]}},v.matcher=v.matches=function(t){return t=v.extendOwn({},t),function(n){return v.isMatch(n,t)}},v.times=function(n,t,r){var e=Array(Math.max(0,n));t=y(t,r,1);for(var u=0;u<n;u++)e[u]=t(u);return e},v.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},v.now=Date.now||function(){return(new Date).getTime()};function B(t){function r(n){return t[n]}var n="(?:"+v.keys(t).join("|")+")",e=RegExp(n),u=RegExp(n,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,r):n}}var T={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},R=v.invert(T);v.escape=B(T),v.unescape=B(R),v.result=function(n,t,r){var e=null==n?void 0:n[t];return void 0===e&&(e=r),v.isFunction(e)?e.call(n):e};var q=0;v.uniqueId=function(n){var t=++q+"";return n?n+t:t},v.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};function K(n){return"\\"+D[n]}var z=/(.)^/,D={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},L=/\\|'|\r|\n|\u2028|\u2029/g;v.template=function(i,n,t){!n&&t&&(n=t),n=v.defaults({},n,v.templateSettings);var r=RegExp([(n.escape||z).source,(n.interpolate||z).source,(n.evaluate||z).source].join("|")+"|$","g"),o=0,a="__p+='";i.replace(r,function(n,t,r,e,u){return a+=i.slice(o,u).replace(L,K),o=u+n.length,t?a+="'+\n((__t=("+t+"))==null?'':_.escape(__t))+\n'":r?a+="'+\n((__t=("+r+"))==null?'':__t)+\n'":e&&(a+="';\n"+e+"\n__p+='"),n}),a+="';\n",n.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{var e=new Function(n.variable||"obj","_",a)}catch(n){throw n.source=a,n}function u(n){return e.call(this,n,v)}var c=n.variable||"obj";return u.source="function("+c+"){\n"+a+"}",u},v.chain=function(n){var t=v(n);return t._chain=!0,t};function P(n,t){return n._chain?v(t).chain():t}v.mixin=function(r){v.each(v.functions(r),function(n){var t=v[n]=r[n];v.prototype[n]=function(){var n=[this._wrapped];return i.apply(n,arguments),P(this,t.apply(v,n))}})},v.mixin(v),v.each(["pop","push","reverse","shift","sort","splice","unshift"],function(t){var r=e[t];v.prototype[t]=function(){var n=this._wrapped;return r.apply(n,arguments),"shift"!==t&&"splice"!==t||0!==n.length||delete n[0],P(this,n)}}),v.each(["concat","join","slice"],function(n){var t=e[n];v.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),v.prototype.value=function(){return this._wrapped},v.prototype.valueOf=v.prototype.toJSON=v.prototype.value,v.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return v})}).call(this);;
( function( $ ) {

	/*
	 * Add dropdown toggle that display child menu items.
	 */
	function primary_nav() {

		$( '.main-navigation ul .genericon' ).remove();

		if( $( window ).width() < 960 ) {
			$( '.main-navigation .page_item_has_children > a, .main-navigation .menu-item-has-children > a' ).append( '<span class="genericon genericon-expand" />' );
			$( '.main-navigation ul .genericon' ).click( function( event ) {
				event.preventDefault();
				$( this ).toggleClass( 'genericon-expand' ).toggleClass( 'genericon-collapse' );
				$( this ).closest( 'li' ).toggleClass( 'toggle-on' );
				$( this ).parent().next( '.children, .sub-menu' ).toggleClass( 'toggle-on' );
			} );
		}

	}

	/*
	 * Add classes to images and captions if image post format.
	 */
	function image_post_format() {

		$( '.hentry.format-image img, .portfolio-entry .entry-content img' ).each( function() {
			var img = $( this ),
			    caption = $( this ).closest( 'div' ),
			    new_img = new Image();

			new_img.src = img.attr('src');
			var img_width = new_img.width;

			if ( img_width >= 1100 ) {
				$( this ).addClass( 'image-big' );
				$( this ).parents( 'p' ).addClass( 'image-big-wrapper' );
				if ( $.trim( $( this ).parents( 'p' ).text() ) != '' ) {
					$( this ).parents( 'p' ).contents().filter( 'a, img' ).wrap( '<span class="image-big-wrapper" />' );
					$( this ).parents( 'p' ).removeClass( 'image-big-wrapper' );
				}
			}
			if ( caption.hasClass( 'wp-caption' ) && img_width >= 1080 ) {
				$( this ).removeClass( 'image-big' );
				caption.addClass( 'caption-big' );
			}
		} );

	}

	/*
	 * Remove Flash Fallback from HTML5 Audio in audio post format.
	 */
	function audio_post_format() {

		$( '.hentry.format-audio .entry-media audio' ).each( function() {
			var audio_id = $( this ).attr( 'id' );
			$( this ).next( '#' + audio_id + '-flash' ).remove();
			$( this ).parent().siblings( '.entry-content' ).find( '#' + audio_id + '-flash' ).parents( 'span' ).remove();
		} );

	}

	/*
	 * Remove content if empty.
	 */
	function content() {

		$( '.page-content, .hentry:not(.portfolio-entry) .entry-content, .entry-summary, .entry-sharedaddy, .sharedaddy' ).each( function() {
			if ( ! $( this ).find( 'iframe' ).length && ! $( this ).find( 'img' ).length && $.trim( $( this ).text() ) === '' ) {
				$( this ).remove();
			}
		} );

	}

	/*
	 * Resize entry-thumbnail, entry-gallery, entry-media, video-wrapper (video post format), caption-big and image-big for full width on small screens.
	 */
	function calc() {

		$( '.entry-thumbnail, .entry-gallery, .entry-media, .hentry.format-video > .video-wrapper, .caption-big' ).each( function() {
			if( $( window ).width() < 768 ) {
	    		$( this ).css( 'width', '100%' ).css( 'width', '+=40px' );
	    		if ( $( 'body' ).hasClass( 'rtl' ) ) {
		    		$( this ).css( 'margin-right', '-20px' );
	    		} else {
		    		$( this ).css( 'margin-left', '-20px' );
	    		}
			} else if( $( window ).width() < 960 ) {
	    		$( this ).css( 'width', '100%' ).css( 'width', '+=80px' );
	    		if ( $( 'body' ).hasClass( 'rtl' ) ) {
		    		$( this ).css( 'margin-right', '-40px' );
	    		} else {
		    		$( this ).css( 'margin-left', '-40px' );
	    		}
			} else {
				$( this ).css( {
					'width': '',
					'margin-right': '',
					'margin-left': ''
				} );
			}
		} );
		$( '.caption-big' ).each( function() {
			if( $( window ).width() < 960 ) {
	    		$( this ).css( 'max-width', '200%' );
			} else {
				$( this ).css( 'max-width', '' );
			}
		} );
		$( '.image-big' ).each( function() {
			if( $( window ).width() < 768 ) {
	    		$( this ).parents( '.image-big-wrapper' ).css( {
	    			'display': 'block',
	    			'width': '100%',
	    		} ).css( 'width', '+=40px' );
	    		if ( $( 'body' ).hasClass( 'rtl' ) ) {
		    		$( this ).parents( '.image-big-wrapper' ).css( 'margin-right', '-20px' );
	    		} else {
		    		$( this ).parents( '.image-big-wrapper' ).css( 'margin-left', '-20px' );
	    		}
			} else if( $( window ).width() < 960 ) {
	    		$( this ).parents( '.image-big-wrapper' ).css( {
	    			'display': 'block',
	    			'width': '100%',
	    		} ).css( 'width', '+=80px' );
	    		if ( $( 'body' ).hasClass( 'rtl' ) ) {
		    		$( this ).parents( '.image-big-wrapper' ).css( 'margin-right', '-40px' );
	    		} else {
		    		$( this ).parents( '.image-big-wrapper' ).css( 'margin-left', '-40px' );
	    		}
			} else {
				$( this ).parents( '.image-big-wrapper' ).css( {
					'display': '',
					'width': '',
					'margin-right': '',
					'margin-left': ''
				} );
			}
		} );

	}

	/*
	 * Wrap sharedaddy in a div and move it after entry-header for aside, quote and status post format.
	 */
	function sharedaddy() {

		$( '.hentry.format-aside .entry-content > .sharedaddy, .hentry.format-quote .entry-content > .sharedaddy, .hentry.format-status .entry-content > .sharedaddy' ).each( function() {
			$( this ).wrap( '<div class="entry-sharedaddy" />' );
		} );
		$( '.entry-sharedaddy' ).each( function() {
			$( this ).insertAfter( $( this ).closest( '.hentry' ).find( '.entry-header' ) );
		} );

	}

	/*
	 * Load all the functions.
	 */
	function load_functions() {

		primary_nav();
		image_post_format();
		audio_post_format();
		content();
		calc();
		sharedaddy();

	}
	$( window ).load( load_functions ).resize( _.debounce( load_functions, 100 ) );
	$( document ).on( 'post-load', load_functions );

} )( jQuery );
;
/***
 * Warning: This file is remotely enqueued in Jetpack's Masterbar module.
 * Changing it will also affect Jetpack sites.
 */
jQuery( document ).ready( function( $, wpcom ) {
	var masterbar,
		menupops = $( 'li#wp-admin-bar-blog.menupop, li#wp-admin-bar-newdash.menupop, li#wp-admin-bar-my-account.menupop' ),
		newmenu = $( '#wp-admin-bar-new-post-types' );

	// Unbind hoverIntent, we want clickable menus.
	menupops
		.unbind( 'mouseenter mouseleave' )
		.removeProp( 'hoverIntent_t' )
		.removeProp( 'hoverIntent_s' )
		.on( 'mouseover', function(e) {
			var li = $(e.target).closest( 'li.menupop' );
			menupops.not(li).removeClass( 'ab-hover' );
			li.toggleClass( 'ab-hover' );
		} )
		.on( 'click touchstart', function(e) {
			var $target = $( e.target );

			if ( masterbar.focusSubMenus( $target ) ) {
				return;
			}

			e.preventDefault();
			masterbar.toggleMenu( $target );
		} );

	masterbar = {
		focusSubMenus: function( $target ) {
			// Handle selection of menu items
			if ( ! $target.closest( 'ul' ).hasClass( 'ab-top-menu' ) ) {
				$target
					.closest( 'li' );

				return true;
			}

			return false;
		},

		toggleMenu: function( $target ) {
			var $li = $target.closest( 'li.menupop' ),
				$html = $( 'html' );

			$( 'body' ).off( 'click.ab-menu' );
			$( '#wpadminbar li.menupop' ).not($li).removeClass( 'ab-active wpnt-stayopen wpnt-show' );

			if ( $li.hasClass( 'ab-active' ) ) {
				$li.removeClass( 'ab-active' );
				$html.removeClass( 'ab-menu-open' );
			} else {
				$li.addClass( 'ab-active' );
				$html.addClass( 'ab-menu-open' );

				$( 'body' ).on( 'click.ab-menu', function( e ) {
					if ( ! $( e.target ).parents( '#wpadminbar' ).length ) {
						e.preventDefault();
						masterbar.toggleMenu( $li );
						$( 'body' ).off( 'click.ab-menu' );
					}
				} );
			}
		}
	};
} );;
/*globals JSON */
( function( $ ) {
	var eventName = 'wpcom_masterbar_click';

	var linksTracksEvents = {
		//top level items
		'wp-admin-bar-blog'                        : 'my_sites',
		'wp-admin-bar-newdash'                     : 'reader',
		'wp-admin-bar-ab-new-post'                 : 'write_button',
		'wp-admin-bar-my-account'                  : 'my_account',
		'wp-admin-bar-notes'                       : 'notifications',
		//my sites - top items
		'wp-admin-bar-switch-site'                 : 'my_sites_switch_site',
		'wp-admin-bar-blog-info'                   : 'my_sites_site_info',
		'wp-admin-bar-site-view'                   : 'my_sites_view_site',
		'wp-admin-bar-blog-stats'                  : 'my_sites_site_stats',
		'wp-admin-bar-plan'                        : 'my_sites_plan',
		'wp-admin-bar-plan-badge'                  : 'my_sites_plan_badge',
		//my sites - manage
		'wp-admin-bar-edit-page'                   : 'my_sites_manage_site_pages',
		'wp-admin-bar-new-page-badge'              : 'my_sites_manage_add_page',
		'wp-admin-bar-edit-post'                   : 'my_sites_manage_blog_posts',
		'wp-admin-bar-new-post-badge'              : 'my_sites_manage_add_post',
		'wp-admin-bar-edit-attachment'             : 'my_sites_manage_media',
		'wp-admin-bar-new-attachment-badge'        : 'my_sites_manage_add_media',
		'wp-admin-bar-comments'                    : 'my_sites_manage_comments',
		'wp-admin-bar-edit-jetpack-testimonial'    : 'my_sites_manage_testimonials',
		'wp-admin-bar-new-jetpack-testimonial'     : 'my_sites_manage_add_testimonial',
		'wp-admin-bar-edit-jetpack-portfolio'      : 'my_sites_manage_portfolio',
		'wp-admin-bar-new-jetpack-portfolio'       : 'my_sites_manage_add_portfolio',
		//my sites - personalize
		'wp-admin-bar-themes'                      : 'my_sites_personalize_themes',
		'wp-admin-bar-cmz'                         : 'my_sites_personalize_themes_customize',
		//my sites - configure
		'wp-admin-bar-sharing'                     : 'my_sites_configure_sharing',
		'wp-admin-bar-people'                      : 'my_sites_configure_people',
		'wp-admin-bar-people-add'                  : 'my_sites_configure_people_add_button',
		'wp-admin-bar-plugins'                     : 'my_sites_configure_plugins',
		'wp-admin-bar-domains'                     : 'my_sites_configure_domains',
		'wp-admin-bar-domains-add'                 : 'my_sites_configure_add_domain',
		'wp-admin-bar-blog-settings'               : 'my_sites_configure_settings',
		'wp-admin-bar-legacy-dashboard'            : 'my_sites_configure_wp_admin',
		//reader
		'wp-admin-bar-followed-sites'              : 'reader_followed_sites',
		'wp-admin-bar-reader-followed-sites-manage': 'reader_manage_followed_sites',
		'wp-admin-bar-discover-discover'           : 'reader_discover',
		'wp-admin-bar-discover-search'             : 'reader_search',
		'wp-admin-bar-my-activity-my-likes'        : 'reader_my_likes',
		//account
		'wp-admin-bar-user-info'                   : 'my_account_user_name',
		// account - profile
		'wp-admin-bar-my-profile'                  : 'my_account_profile_my_profile',
		'wp-admin-bar-account-settings'            : 'my_account_profile_account_settings',
		'wp-admin-bar-billing'                     : 'my_account_profile_manage_purchases',
		'wp-admin-bar-security'                    : 'my_account_profile_security',
		'wp-admin-bar-notifications'               : 'my_account_profile_notifications',
		//account - special
		'wp-admin-bar-get-apps'                    : 'my_account_special_get_apps',
		'wp-admin-bar-next-steps'                  : 'my_account_special_next_steps',
		'wp-admin-bar-help'                        : 'my_account_special_help',
	};

	var notesTracksEvents = {
		openSite: function( data ) {
			return {
				clicked: 'masterbar_notifications_panel_site',
				site_id: data.siteId
			};
		},
		openPost: function( data ) {
			return {
				clicked: 'masterbar_notifications_panel_post',
				site_id: data.siteId,
				post_id: data.postId
			};
		},
		openComment: function( data ) {
			return {
				clicked: 'masterbar_notifications_panel_comment',
				site_id: data.siteId,
				post_id: data.postId,
				comment_id: data.commentId
			};
		}
	};

	function recordTracksEvent( eventProps ) {
		eventProps = eventProps || {};
		window._tkq = window._tkq || [];
		window._tkq.push( [ 'recordEvent', eventName, eventProps ] );
	}

	function parseJson( s, defaultValue ) {
		try {
			return JSON.parse( s );
		} catch ( e ) {
			return defaultValue;
		}
	}

	$( document ).ready( function() {
		var trackableLinks = '.mb-trackable .ab-item:not(div),' +
			'#wp-admin-bar-notes .ab-item,' +
			'#wp-admin-bar-user-info .ab-item,' +
			'.mb-trackable .ab-secondary';

		$( trackableLinks ).on( 'click touchstart', function( e ) {
			var $target = $( e.target ),
				$parent = $target.closest( 'li' );

			if ( ! $parent ) {
				return;
			}

			var trackingId = $target.attr( 'ID' ) || $parent.attr( 'ID' );

			if ( ! linksTracksEvents.hasOwnProperty( trackingId ) ) {
				return;
			}

			var eventProps = { 'clicked': linksTracksEvents[ trackingId ] };

			recordTracksEvent( eventProps );
		} );
	} );

	// listen for postMessage events from the notifications iframe
	$( window ).on( 'message', function( e ) {
		var event = ! e.data && e.originalEvent.data ? e.originalEvent : e;
		if ( event.origin !== 'https://widgets.wp.com' ) {
			return;
		}

		var data = ( 'string' === typeof event.data ) ? parseJson( event.data, {} ) : event.data;
		if ( 'notesIframeMessage' !== data.type ) {
			return;
		}

		var eventData = notesTracksEvents[ data.action ];
		if ( ! eventData ) {
			return;
		}

		recordTracksEvent( eventData( data ) );
	} );

} )( jQuery );
;
var wpcom = window.wpcom || {};
wpcom.actionbar = {};
wpcom.actionbar.data = actionbardata;

// This might be better in another file, but is here for now
(function($){
	var fbd = wpcom.actionbar.data,
			d = document,
			docHeight = $( d ).height(),
			b = d.getElementsByTagName( 'body' )[0],
			lastScrollTop = 0,
			lastScrollDir, fb, fhtml, fbhtml, fbHtmlLi,
			followingbtn, followbtn, fbdf, action,
			slkhtml = '', foldhtml = '', reporthtml = '',
			customizeIcon, editIcon, statsIcon, themeHtml = '', signupHtml = '', loginHtml = '',
			viewReaderHtml = '', editSubsHtml = '', editFollowsHtml = '',
			toggleactionbar, $actionbar;

	// Don't show actionbar when iframed
	if ( window != window.top ) {
		return;
	}

	fhtml = '<ul>';

	// Customize Icon
	customizeIcon = '<svg class="gridicon gridicon__customize" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M2 6c0-1.505.78-3.08 2-4 0 .845.69 2 2 2 1.657 0 3 1.343 3 3 0 .386-.08.752-.212 1.09.74.594 1.476 1.19 2.19 1.81L8.9 11.98c-.62-.716-1.214-1.454-1.807-2.192C6.753 9.92 6.387 10 6 10c-2.21 0-4-1.79-4-4zm12.152 6.848l1.34-1.34c.607.304 1.283.492 2.008.492 2.485 0 4.5-2.015 4.5-4.5 0-.725-.188-1.4-.493-2.007L18 9l-2-2 3.507-3.507C18.9 3.188 18.225 3 17.5 3 15.015 3 13 5.015 13 7.5c0 .725.188 1.4.493 2.007L3 20l2 2 6.848-6.848c1.885 1.928 3.874 3.753 5.977 5.45l1.425 1.148 1.5-1.5-1.15-1.425c-1.695-2.103-3.52-4.092-5.448-5.977z" data-reactid=".2.1.1:0.1b.0"></path></g></svg>';

	if ( fbd.canCustomizeSite && fbd.isLoggedIn ) {
		fhtml += '<li class="actnbr-btn actnbr-customize"><a href="'+ fbd.customizeLink +'">' + customizeIcon + '<span>' + fbd.i18n.customize + '<span></a></li>';
	}

	// Edit Icon
	editIcon = '<svg class="gridicon gridicon__pencil" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M13 6l5 5-9.507 9.507c-.686-.686-.69-1.794-.012-2.485l-.002-.003c-.69.676-1.8.673-2.485-.013-.677-.677-.686-1.762-.036-2.455l-.008-.008c-.694.65-1.78.64-2.456-.036L13 6zm7.586-.414l-2.172-2.172c-.78-.78-2.047-.78-2.828 0L14 5l5 5 1.586-1.586c.78-.78.78-2.047 0-2.828zM3 18v3h3c0-1.657-1.343-3-3-3z"></path></g></svg>';

	if ( fbd.canEditPost ) {
		fhtml += '<li class="actnbr-btn actnbr-edit"><a href="'+ fbd.editLink +'">' + editIcon + '<span>' + fbd.i18n.edit + '</span></a></li>';
	}

	// Stats Icon
	statsIcon = '<svg class="gridicon gridicon__stats-alt" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M21,21H3v-2h18V21z M8,10H4v7h4V10z M14,3h-4v14h4V3z M20,6h-4v11h4V6z"/></path></g></svg>';

	if ( fbd.canEditPost ) {
		fhtml += '<li class="actnbr-btn actnbr-stats"><a href="'+ fbd.statsLink +'">' + statsIcon + '<span>' + fbd.i18n.stats + '</span></a></li>';
	}

	// Follow/Unfollow Icon
	followingbtn = '<svg class="gridicon gridicon__following" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M23 13.482L15.508 21 12 17.4l1.412-1.388 2.106 2.188 6.094-6.094L23 13.482zm-7.455 1.862L20 10.89V2H2v14c0 1.1.9 2 2 2h4.538l4.913-4.832 2.095 2.176zM8 13H4v-1h4v1zm3-2H4v-1h7v1zm0-2H4V8h7v1zm7-3H4V4h14v2z"/></g></svg>';
	followbtn = '<svg class="gridicon gridicon__follow" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path d="M23 16v2h-3v3h-2v-3h-3v-2h3v-3h2v3h3zM20 2v9h-4v3h-3v4H4c-1.1 0-2-.9-2-2V2h18zM8 13v-1H4v1h4zm3-3H4v1h7v-1zm0-2H4v1h7V8zm7-4H4v2h14V4z"/></g></svg>';

	fbhtml = '<a class="actnbr-action actnbr-actn-follow" href="">' + followbtn + '<span>' + fbd.i18n.follow + '</span></a>';
	if ( fbd.isFollowing ) {
		fbhtml = '<a class="actnbr-action actnbr-actn-following" href="">' + followingbtn + '<span>' + fbd.i18n.following + '</span></a>';
	}

	// Show follow/unfollow icon on top level, when this is not your own site
	if ( fbd.canFollow && ! ( fbd.canEditPost || fbd.canCustomizeSite ) ) {
		fhtml += '<li class="actnbr-btn actnbr-hidden"> \
			    	' + fbhtml + ' \
			    	<div class="actnbr-popover tip tip-top-left actnbr-notice"> \
			    		<div class="tip-arrow"></div> \
			    		<div class="tip-inner actnbr-follow-bubble"></div> \
			    	</div> \
			    </li>';
	}

	if ( ! fbd.canCustomizeSite ) {
		// Report Link
		reporthtml = '<li class="flb-report"><a href="http://en.wordpress.com/abuse/">' + fbd.i18n.report + '</a></li>';
	}

	// Show shortlink on single posts
	if ( fbd.isSingular ) {
		slkhtml = '<li class="actnbr-shortlink"><a href="' + fbd.shortlink + '">' + fbd.i18n.shortlink + '</a></li>'
	}

	// Set up fold/unfold menu item
	foldhtml = '<li class="actnbr-fold"><a href="">' + fbd.i18n.foldBar + '</a></li>'
	if ( fbd.isFolded ) {
		foldhtml = '<li class="actnbr-fold"><a href="">' + fbd.i18n.unfoldBar + '</a></li>'
	}
	if ( ! fbd.isLoggedIn && ! fbd.canFollow ) {
		foldhtml = '';
	}

	if ( fbd.isLoggedIn ) {
		if ( '' != fbd.themeURL ) {
			themeHtml = '<li class="actnbr-theme"><a href="' + fbd.themeURL + '">' + fbd.i18n.themeInfo.replace( /{theme}/, fbd.themeName ) + '</a></li>';
		}
		if ( fbd.canFollow ) {
			if ( fbd.isSingular ) {
				viewReaderHtml = '<li class="actnbr-reader"><a href="https://wordpress.com/read/blogs/' + fbd.siteID + '/posts/' + fbd.postID +'">' + fbd.i18n.viewReadPost + '</a></li>';
			} else {
				viewReaderHtml = '<li class="actnbr-reader"><a href="https://wordpress.com/read/' + ( fbd.feedID ? 'feeds/' + fbd.feedID : 'blogs/' + fbd.siteID ) + '">' + fbd.i18n.viewReader + '</a></li>';
			}
		}
		editFollowsHtml = '<li class="actnbr-follows"><a href="https://wordpress.com/following/edit">' + fbd.i18n.editSubs + '</a></li>';
	} else {
		loginHtml += '<li class="actnbr-login"><a href="' + fbd.loginURL + '">' + fbd.i18n.login + '</a></li>';
		signupHtml = '<li class="actnbr-signup"><a href="' + fbd.signupURL + '">' + fbd.i18n.signup + '</a></li>';
		editSubsHtml = '<li class="actnbr-subs"><a href="https://subscribe.wordpress.com/">' + fbd.i18n.editSubs + '</a></li>';
	}

	// Hide follow/unfollow completely for static sites, and sites not allowing followers (VIP, private, etc).
	if ( ! fbd.canFollow ) {
		fbHtmlLi = '';
	} else {
		fbHtmlLi = '<li class="actnbr-folded-follow">' + fbhtml + '</li>';
	}

	// Ellipsis Menu
	fhtml += '<li class="actnbr-ellipsis actnbr-hidden"> \
			  <svg class="gridicon gridicon__ellipsis" height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="12" r="2"/></g></svg> \
			  <div class="actnbr-popover tip tip-top-left actnbr-more"> \
			  	<div class="tip-arrow"></div> \
			  	<div class="tip-inner"> \
				  <ul> \
				    <li class="actnbr-sitename"><a href="' + fbd.siteURL + '">' + fbd.icon + ' ' + actionBarEscapeHtml( fbd.siteName ) + '</a></li> \
				   	<li class="actnbr-folded-customize"><a href="'+ fbd.customizeLink +'">' + customizeIcon + '<span>' + fbd.i18n.customize + '<span></a></li> \
				    ' + fbHtmlLi + ' \
					' + signupHtml + ' \
				    ' + loginHtml + ' \
				    ' + themeHtml + ' \
				    ' + slkhtml + ' \
				    ' + reporthtml + ' \
				    ' + viewReaderHtml + ' \
				    ' + editFollowsHtml + ' \
				    ' + editSubsHtml + ' \
				    ' + foldhtml + ' \
			      </ul> \
			    </div> \
		      </div> \
		    </li> \
	      </ul>';

	fbdf = d.createElement( 'div' );
	fbdf.id = 'actionbar';
	fbdf.innerHTML = fhtml;
	b.appendChild( fbdf );

	$actionbar = $( '#actionbar' ).addClass( 'actnbr-' + fbd.themeSlug.replace( '/', '-' ) );

	// Add classes based on contents
	if ( fbd.canCustomizeSite ) {
		$actionbar.addClass( 'actnbr-has-customize' );
	}

	if ( fbd.canEditPost ) {
		$actionbar.addClass( 'actnbr-has-edit' );
	}

	if ( ! fbd.canCustomizeSite ) {
		$actionbar.addClass( 'actnbr-has-follow' );
	}

	if ( fbd.isFolded ) {
		$actionbar.addClass( 'actnbr-folded' );
	}

	// Show status message if available
	if ( fbd.statusMessage ) {
		showActionBarStatusMessage( fbd.statusMessage );
	}

	// *** Actions *****************

	// Follow Site
	$actionbar.on(  'click', '.actnbr-actn-follow', function(e) {
		e.preventDefault();

		if ( fbd.isLoggedIn ) {
			showActionBarStatusMessage( '<div class="actnbr-reader">' + fbd.i18n.followedText + '</div>' );
			bumpStat( 'followed' );
			var eventProps = {
				'follow_source': 'actionbar',
				'url': fbd.siteURL
			};
			recordTracksEvent( 'wpcom_actionbar_site_followed', eventProps );

			request( 'ab_subscribe_to_blog' );
		} else {
			showActionBarFollowForm();
		}
	} )

	// UnFollow Site
	.on(  'click', '.actnbr-actn-following', function(e) {
		e.preventDefault();
		$( '#actionbar .actnbr-actn-following' ).replaceWith( '<a class="actnbr-action actnbr-actn-follow" href="">' + followbtn + '<span>' + fbd.i18n.follow + '</span></a>' );

		bumpStat( 'unfollowed' );
		var eventProps = {
			'follow_source': 'actionbar',
			'url': fbd.siteURL
		};
		recordTracksEvent( 'wpcom_actionbar_site_unfollowed', eventProps );

		request( 'ab_unsubscribe_from_blog' );
	} )

	// Show shortlink prompt
	.on( 'click', '.actnbr-shortlink a', function(e) {
		e.preventDefault();
		window.prompt( "Shortlink: ", fbd.shortlink );
	} )

	// Toggle more menu
	.on( 'click', '.actnbr-ellipsis', function(e) {
		if ( $( e.target ).closest( 'a' ).hasClass( 'actnbr-action' ) ) {
			return false;
		}

		var popoverLi = $( '#actionbar .actnbr-ellipsis' );
		popoverLi.toggleClass( 'actnbr-hidden' );

		setTimeout( function() {
			if ( ! popoverLi.hasClass( 'actnbr-hidden' ) ) {
				bumpStat( 'show_more_menu' );

				$( document ).on( 'click.actnbr-body-click', function() {
					popoverLi.addClass( 'actnbr-hidden' );

					$( document ).off( 'click.actnbr-body-click' );
				} );
			}
		}, 10 );
	})

	// Fold/Unfold
	.on( 'click', '.actnbr-fold', function(e) {
		e.preventDefault();

		if ( $( '#actionbar' ).hasClass( 'actnbr-folded' ) ) {
			$( '.actnbr-fold a' ).html( fbd.i18n.foldBar );
			$( '#actionbar' ).removeClass( 'actnbr-folded' );

			$.post( fbd.xhrURL, { 'action': 'unfold_actionbar' } );
		} else {
			$( '.actnbr-fold a' ).html( fbd.i18n.unfoldBar );
			$( '#actionbar' ).addClass( 'actnbr-folded' );

			$.post( fbd.xhrURL, { 'action': 'fold_actionbar' } );
		}
	})

	// Record stats for clicks
	.on( 'click', '.actnbr-sitename a', createStatsBumperEventHandler( 'clicked_site_title' ) )
	.on( 'click', '.actnbr-customize a', createStatsBumperEventHandler( 'customized' ) )
	.on( 'click', '.actnbr-folded-customize a', createStatsBumperEventHandler( 'customized' ) )
	.on( 'click', '.actnbr-theme a', createStatsBumperEventHandler( 'explored_theme' ) )
	.on( 'click', '.actnbr-edit a', createStatsBumperEventHandler( 'edited' ) )
	.on( 'click', '.actnbr-stats a', createStatsBumperEventHandler( 'clicked_stats' ) )
	.on( 'click', '.flb-report a', createStatsBumperEventHandler( 'reported_content' ) )
	.on( 'click', '.actnbr-follows a', createStatsBumperEventHandler( 'managed_following' ) )
	.on( 'click', '.actnbr-shortlink a', function() {
		bumpStat( 'copied_shortlink' );
	} )
	.on( 'click', '.actnbr-reader a', createStatsBumperEventHandler( 'view_reader' ) )
	.on( 'submit', '.actnbr-follow-bubble form', createStatsBumperEventHandler( 'submit_follow_form', function() {
		$( '#actionbar .actnbr-follow-bubble form button' ).attr( 'disabled', true );
	} ) )
	.on( 'click', '.actnbr-login-nudge a', createStatsBumperEventHandler( 'clicked_login_nudge' ) )
	.on( 'click', '.actnbr-signup a', createStatsBumperEventHandler( 'clicked_signup_link' ) )
	.on( 'click', '.actnbr-login a', createStatsBumperEventHandler( 'clicked_login_link' ) )
	.on( 'click', '.actnbr-subs a', createStatsBumperEventHandler( 'clicked_manage_subs_link' ) );

	// Make Follow/Unfollow requests
	var request = function( action ) {
		$.post( fbd.xhrURL, {
			'action': action,
			'_wpnonce': fbd.nonce,
			'source': 'actionbar',
			'blog_id': fbd.siteID
		});
	};

	// Show/Hide actionbar on scroll
	fb = $('#actionbar');
	toggleactionbar = function() {
		var st = $(window).scrollTop(),
			topOffset = 0;

		if ( $(window).scrollTop() < 0 ) {
			return;
		}

		// Still
		if ( lastScrollTop == 0 || ( ( st == lastScrollTop ) && lastScrollDir == 'up' ) ) {
			fb.removeClass( 'actnbr-hidden' );

		// Moving
		} else {
			 // Scrolling Up
		    if ( st < lastScrollTop ){
				fb.removeClass( 'actnbr-hidden' );
				lastScrollDir = 'up';

			// Scrolling Down
			} else {
				// check if there are any popovers open, and only hide action bar if not
				if ( $( '#actionbar > ul > li:not(.actnbr-hidden) > .actnbr-popover' ).length === 0 ) {
					fb.addClass( 'actnbr-hidden' );
					lastScrollDir = 'down';

					// Hide any menus
					$( '#actionbar li' ).addClass( 'actnbr-hidden' );
				}
			}
		}

		lastScrollTop = st;
	};
	setInterval( toggleactionbar, 100 );

	var bumpStat = function( stat ) {
		return $.post( fbd.xhrURL, {
			'action': 'actionbar_stats',
			'stat': stat
		} );
	};

	var recordTracksEvent =	function( eventName, eventProps ) {
		eventProps = eventProps || {};
		window._tkq = window._tkq || [];
		window._tkq.push( [ 'recordEvent', eventName, eventProps ] );
	};

	/**
	 * A factory method for creating an event handler function that will bump a specific stat and ONLY THEN re-dispatch
	 * the event. This will ensure that the bumped stat is indeed recorded before navigating the page away, as otherwise
	 * some browsers may very well decide to cancel the stat request in that case.
	 *
	 * @param {String} stat the name of the stat to bump
	 * @param {Function} additionalEffect an additional function that should be called after the stat is bumped
	 */
	function createStatsBumperEventHandler( stat, additionalEffect ) {
		var completedEvents = {};

		return function eventHandler( event ) {
			if ( completedEvents[ event.timeStamp ] ) {
				delete completedEvents[ event.timeStamp ];

				// hack-around to submit forms, dispatching "submit" event is not enough for them
				if ( event.type === 'submit' ) {
					event.target.submit();
				}

				if ( typeof additionalEffect === 'function' ) {
					return additionalEffect( event );
				}

				return true;
			}

			event.preventDefault();
			event.stopPropagation();

			function dispatchOriginalEvent() {
				var newEvent;

				// Retrieves the native event object created by the browser from the jQuery event object
				var originalEvent = event.originalEvent;

				/**
				 * Handles Internet Explorer that doesn't support Event nor CustomEvent constructors
				 *
				 * @see https://developer.mozilla.org/en-US/docs/Web/API/Event/Event
				 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
				 * @see https://stackoverflow.com/questions/26596123/internet-explorer-9-10-11-event-constructor-doesnt-work/
				 */
				if ( typeof window.CustomEvent !== 'function' ) {
					newEvent = document.createEvent( 'CustomEvent' );
					newEvent.initCustomEvent(
						originalEvent.type,
						originalEvent.bubbles,
						originalEvent.cancelable,
						originalEvent.detail
					);
				} else {
					newEvent = new originalEvent.constructor( originalEvent.type, originalEvent );
				}

				completedEvents[ newEvent.timeStamp ] = true;

				originalEvent.target.dispatchEvent( newEvent );
			}

			bumpStat( stat ).then( dispatchOriginalEvent, dispatchOriginalEvent );
		}
	}

	function actionBarEscapeHtml(string) {
		return String(string).replace(/[&<>"'\/]/g, function (s) {
			var entityMap = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': '&quot;',
				"'": '&#39;',
				"/": '&#x2F;'
			};
			return entityMap[s];
		});
	}

	function showActionBarStatusMessage( message ) {
		$( '#actionbar .actnbr-actn-follow' ).replaceWith( '<a class="actnbr-action actnbr-actn-following" href="">' + followingbtn + '<span>' + fbd.i18n.following + '</span></a>' );
		$( '#actionbar .actnbr-follow-bubble' ).html( ' \
			<ul> \
				<li class="actnbr-sitename"><a href="' + fbd.siteURL + '">' + fbd.icon + ' ' + actionBarEscapeHtml( fbd.siteName ) + '</a></li> \
				<li class="actnbr-message">' + message + '</li> \
			</ul> \
		');

		var btn = $( '#actionbar .actnbr-btn' );
		btn.removeClass( 'actnbr-hidden' );

		setTimeout( function() {
			if ( ! btn.hasClass( 'actnbr-hidden' ) ) {
				$( '#actionbar .actnbr-email-field' ).focus();
				$( document ).on( 'click.actnbr-body-click', function(e) {
					if ( $( e.target ).closest( '.actnbr-popover' )[0] ) {
						return;
					}
					btn.addClass( 'actnbr-hidden' );
					$( document ).off( 'click.actnbr-body-click' );
				} );
			}
		}, 10 );
	}

	function showActionBarFollowForm() {
		var btn = $( '#actionbar .actnbr-btn' );
		btn.toggleClass( 'actnbr-hidden' );

		var form = $('<form>');

		if ( fbd.i18n.followers ) {
			form.append( $( '<div class="actnbr-follow-count">' ).html( fbd.i18n.followers ) );
		}

		form.append($('<div>').append($('<input>').attr({"type": "email", "name": "email", "placeholder": fbd.i18n.enterEmail, "class": "actnbr-email-field"})));
		form.append($('<input type="hidden" name="action" value="subscribe"/>'));
		form.append($('<input type="hidden" name="blog_id">').attr('value', fbd.siteID));
		form.append($('<input type="hidden" name="source">').attr('value', fbd.referer));
		form.append($('<input type="hidden" name="sub-type" value="actionbar-follow"/>'));
		form.append($(fbd.subscribeNonce));
		form.append($('<div class="actnbr-button-wrap">').append($('<button type="submit">').attr('value', fbd.i18n.subscribe).html(fbd.i18n.subscribe)));
		form.attr('method', 'post');
		form.attr('action', 'https://subscribe.wordpress.com');
		form.attr('accept-charset', 'utf-8');

		var html = $('<ul/>');
		html.append($('<li class="actnbr-sitename">').append($('<a>').attr('href', fbd.siteURL).append($(fbd.icon)).append(' ' + actionBarEscapeHtml( fbd.siteName ))))
		html.append($('<li>').append(form));
		html.append($('<li class="actnbr-login-nudge">').append($('<div>').html(fbd.i18n.alreadyUser)));

		$( '#actionbar .actnbr-follow-bubble' ).empty().append(html);

		setTimeout( function() {
			if ( ! btn.hasClass( 'actnbr-hidden' ) ) {
				bumpStat( 'show_follow_form' );

				$( '#actionbar .actnbr-email-field' ).focus();

				$( document ).on( 'click.actnbr-body-click', function( event ) {
					if ( $( event.target ).closest( '.actnbr-popover' )[ 0 ] ) {
						return;
					}

					btn.addClass( 'actnbr-hidden' );

					$( document ).off( 'click.actnbr-body-click' );
				} );
			}
		}, 10 );
	}
})(jQuery);
;
//fgnass.github.com/spin.js#v1.3

/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */
(function(root, factory) {

  /* CommonJS */
  if (typeof exports == 'object')  module.exports = factory()

  /* AMD module */
  else if (typeof define == 'function' && define.amd) define(factory)

  /* Browser global */
  else root.Spinner = factory()
}
(this, function() {
  "use strict";

  var prefixes = ['webkit', 'Moz', 'ms', 'O'] /* Vendor prefixes */
    , animations = {} /* Animation rules keyed by their name */
    , useCssAnimations /* Whether to use CSS animations or setTimeout */

  /**
   * Utility function to create elements. If no tag name is given,
   * a DIV is created. Optionally properties can be passed.
   */
  function createEl(tag, prop) {
    var el = document.createElement(tag || 'div')
      , n

    for(n in prop) el[n] = prop[n]
    return el
  }

  /**
   * Appends children and returns the parent.
   */
  function ins(parent /* child1, child2, ...*/) {
    for (var i=1, n=arguments.length; i<n; i++)
      parent.appendChild(arguments[i])

    return parent
  }

  /**
   * Insert a new stylesheet to hold the @keyframe or VML rules.
   */
  var sheet = (function() {
    var el = createEl('style', {type : 'text/css'})
    ins(document.getElementsByTagName('head')[0], el)
    return el.sheet || el.styleSheet
  }())

  /**
   * Creates an opacity keyframe animation rule and returns its name.
   * Since most mobile Webkits have timing issues with animation-delay,
   * we create separate rules for each line/segment.
   */
  function addAnimation(alpha, trail, i, lines) {
    var name = ['opacity', trail, ~~(alpha*100), i, lines].join('-')
      , start = 0.01 + i/lines * 100
      , z = Math.max(1 - (1-alpha) / trail * (100-start), alpha)
      , prefix = useCssAnimations.substring(0, useCssAnimations.indexOf('Animation')).toLowerCase()
      , pre = prefix && '-' + prefix + '-' || ''

    if (!animations[name]) {
      sheet.insertRule(
        '@' + pre + 'keyframes ' + name + '{' +
        '0%{opacity:' + z + '}' +
        start + '%{opacity:' + alpha + '}' +
        (start+0.01) + '%{opacity:1}' +
        (start+trail) % 100 + '%{opacity:' + alpha + '}' +
        '100%{opacity:' + z + '}' +
        '}', sheet.cssRules.length)

      animations[name] = 1
    }

    return name
  }

  /**
   * Tries various vendor prefixes and returns the first supported property.
   */
  function vendor(el, prop) {
    var s = el.style
      , pp
      , i

    if(s[prop] !== undefined) return prop
    prop = prop.charAt(0).toUpperCase() + prop.slice(1)
    for(i=0; i<prefixes.length; i++) {
      pp = prefixes[i]+prop
      if(s[pp] !== undefined) return pp
    }
  }

  /**
   * Sets multiple style properties at once.
   */
  function css(el, prop) {
    for (var n in prop)
      el.style[vendor(el, n)||n] = prop[n]

    return el
  }

  /**
   * Fills in default values.
   */
  function merge(obj) {
    for (var i=1; i < arguments.length; i++) {
      var def = arguments[i]
      for (var n in def)
        if (obj[n] === undefined) obj[n] = def[n]
    }
    return obj
  }

  /**
   * Returns the absolute page-offset of the given element.
   */
  function pos(el) {
    var o = { x:el.offsetLeft, y:el.offsetTop }
    while((el = el.offsetParent))
      o.x+=el.offsetLeft, o.y+=el.offsetTop

    return o
  }

  // Built-in defaults

  var defaults = {
    lines: 12,            // The number of lines to draw
    length: 7,            // The length of each line
    width: 5,             // The line thickness
    radius: 10,           // The radius of the inner circle
    rotate: 0,            // Rotation offset
    corners: 1,           // Roundness (0..1)
    color: '#000',        // #rgb or #rrggbb
    direction: 1,         // 1: clockwise, -1: counterclockwise
    speed: 1,             // Rounds per second
    trail: 100,           // Afterglow percentage
    opacity: 1/4,         // Opacity of the lines
    fps: 20,              // Frames per second when using setTimeout()
    zIndex: 2e9,          // Use a high z-index by default
    className: 'spinner', // CSS class to assign to the element
    top: 'auto',          // center vertically
    left: 'auto',         // center horizontally
    position: 'relative'  // element position
  }

  /** The constructor */
  function Spinner(o) {
    if (typeof this == 'undefined') return new Spinner(o)
    this.opts = merge(o || {}, Spinner.defaults, defaults)
  }

  // Global defaults that override the built-ins:
  Spinner.defaults = {}

  merge(Spinner.prototype, {

    /**
     * Adds the spinner to the given target element. If this instance is already
     * spinning, it is automatically removed from its previous target b calling
     * stop() internally.
     */
    spin: function(target) {
      this.stop()

      var self = this
        , o = self.opts
        , el = self.el = css(createEl(0, {className: o.className}), {position: o.position, width: 0, zIndex: o.zIndex})
        , mid = o.radius+o.length+o.width
        , ep // element position
        , tp // target position

      if (target) {
        target.insertBefore(el, target.firstChild||null)
        tp = pos(target)
        ep = pos(el)
        css(el, {
          left: (o.left == 'auto' ? tp.x-ep.x + (target.offsetWidth >> 1) : parseInt(o.left, 10) + mid) + 'px',
          top: (o.top == 'auto' ? tp.y-ep.y + (target.offsetHeight >> 1) : parseInt(o.top, 10) + mid)  + 'px'
        })
      }

      el.setAttribute('role', 'progressbar')
      self.lines(el, self.opts)

      if (!useCssAnimations) {
        // No CSS animation support, use setTimeout() instead
        var i = 0
          , start = (o.lines - 1) * (1 - o.direction) / 2
          , alpha
          , fps = o.fps
          , f = fps/o.speed
          , ostep = (1-o.opacity) / (f*o.trail / 100)
          , astep = f/o.lines

        ;(function anim() {
          i++;
          for (var j = 0; j < o.lines; j++) {
            alpha = Math.max(1 - (i + (o.lines - j) * astep) % f * ostep, o.opacity)

            self.opacity(el, j * o.direction + start, alpha, o)
          }
          self.timeout = self.el && setTimeout(anim, ~~(1000/fps))
        })()
      }
      return self
    },

    /**
     * Stops and removes the Spinner.
     */
    stop: function() {
      var el = this.el
      if (el) {
        clearTimeout(this.timeout)
        if (el.parentNode) el.parentNode.removeChild(el)
        this.el = undefined
      }
      return this
    },

    /**
     * Internal method that draws the individual lines. Will be overwritten
     * in VML fallback mode below.
     */
    lines: function(el, o) {
      var i = 0
        , start = (o.lines - 1) * (1 - o.direction) / 2
        , seg

      function fill(color, shadow) {
        return css(createEl(), {
          position: 'absolute',
          width: (o.length+o.width) + 'px',
          height: o.width + 'px',
          background: color,
          boxShadow: shadow,
          transformOrigin: 'left',
          transform: 'rotate(' + ~~(360/o.lines*i+o.rotate) + 'deg) translate(' + o.radius+'px' +',0)',
          borderRadius: (o.corners * o.width>>1) + 'px'
        })
      }

      for (; i < o.lines; i++) {
        seg = css(createEl(), {
          position: 'absolute',
          top: 1+~(o.width/2) + 'px',
          transform: o.hwaccel ? 'translate3d(0,0,0)' : '',
          opacity: o.opacity,
          animation: useCssAnimations && addAnimation(o.opacity, o.trail, start + i * o.direction, o.lines) + ' ' + 1/o.speed + 's linear infinite'
        })

        if (o.shadow) ins(seg, css(fill('#000', '0 0 4px ' + '#000'), {top: 2+'px'}))

        ins(el, ins(seg, fill(o.color, '0 0 1px rgba(0,0,0,.1)')))
      }
      return el
    },

    /**
     * Internal method that adjusts the opacity of a single line.
     * Will be overwritten in VML fallback mode below.
     */
    opacity: function(el, i, val) {
      if (i < el.childNodes.length) el.childNodes[i].style.opacity = val
    }

  })


  function initVML() {

    /* Utility function to create a VML tag */
    function vml(tag, attr) {
      return createEl('<' + tag + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', attr)
    }

    // No CSS transforms but VML support, add a CSS rule for VML elements:
    sheet.addRule('.spin-vml', 'behavior:url(#default#VML)')

    Spinner.prototype.lines = function(el, o) {
      var r = o.length+o.width
        , s = 2*r

      function grp() {
        return css(
          vml('group', {
            coordsize: s + ' ' + s,
            coordorigin: -r + ' ' + -r
          }),
          { width: s, height: s }
        )
      }

      var margin = -(o.width+o.length)*2 + 'px'
        , g = css(grp(), {position: 'absolute', top: margin, left: margin})
        , i

      function seg(i, dx, filter) {
        ins(g,
          ins(css(grp(), {rotation: 360 / o.lines * i + 'deg', left: ~~dx}),
            ins(css(vml('roundrect', {arcsize: o.corners}), {
                width: r,
                height: o.width,
                left: o.radius,
                top: -o.width>>1,
                filter: filter
              }),
              vml('fill', {color: o.color, opacity: o.opacity}),
              vml('stroke', {opacity: 0}) // transparent stroke to fix color bleeding upon opacity change
            )
          )
        )
      }

      if (o.shadow)
        for (i = 1; i <= o.lines; i++)
          seg(i, -2, 'progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)')

      for (i = 1; i <= o.lines; i++) seg(i)
      return ins(el, g)
    }

    Spinner.prototype.opacity = function(el, i, val, o) {
      var c = el.firstChild
      o = o.shadow && o.lines || 0
      if (c && i+o < c.childNodes.length) {
        c = c.childNodes[i+o]; c = c && c.firstChild; c = c && c.firstChild
        if (c) c.opacity = val
      }
    }
  }

  var probe = css(createEl('group'), {behavior: 'url(#default#VML)'})

  if (!vendor(probe, 'transform') && probe.adj) initVML()
  else useCssAnimations = vendor(probe, 'animation')

  return Spinner

}));
;
/**
 * Copyright (c) 2011-2013 Felix Gnass
 * Licensed under the MIT license
 */

/*

Basic Usage:
============

$('#el').spin(); // Creates a default Spinner using the text color of #el.
$('#el').spin({ ... }); // Creates a Spinner using the provided options.

$('#el').spin(false); // Stops and removes the spinner.

Using Presets:
==============

$('#el').spin('small'); // Creates a 'small' Spinner using the text color of #el.
$('#el').spin('large', '#fff'); // Creates a 'large' white Spinner.

Adding a custom preset:
=======================

$.fn.spin.presets.flower = {
  lines: 9
  length: 10
  width: 20
  radius: 0
}

$('#el').spin('flower', 'red');

*/

(function(factory) {

  if (typeof exports == 'object') {
    // CommonJS
    factory(require('jquery'), require('spin'))
  }
  else if (typeof define == 'function' && define.amd) {
    // AMD, register as anonymous module
    define(['jquery', 'spin'], factory)
  }
  else {
    // Browser globals
    if (!window.Spinner) throw new Error('Spin.js not present')
    factory(window.jQuery, window.Spinner)
  }

}(function($, Spinner) {

  $.fn.spin = function(opts, color) {

    return this.each(function() {
      var $this = $(this),
        data = $this.data();

      if (data.spinner) {
        data.spinner.stop();
        delete data.spinner;
      }
      if (opts !== false) {
        opts = $.extend(
          { color: color || $this.css('color') },
          $.fn.spin.presets[opts] || opts
        )
        // Begin WordPress Additions
        // To use opts.right, you need to have specified a length, width, and radius.
        if ( typeof opts.right !== 'undefined' && typeof opts.length !== 'undefined'
          && typeof opts.width !== 'undefined' && typeof opts.radius !== 'undefined' ) {
          var pad = $this.css( 'padding-left' );
          pad = ( typeof pad === 'undefined' ) ? 0 : parseInt( pad, 10 );
          opts.left = $this.outerWidth() - ( 2 * ( opts.length + opts.width + opts.radius ) ) - pad - opts.right;
          delete opts.right;
        }
        // End WordPress Additions
        data.spinner = new Spinner(opts).spin(this)
      }
    })
  }

  $.fn.spin.presets = {
    tiny: { lines: 8, length: 2, width: 2, radius: 3 },
    small: { lines: 8, length: 4, width: 3, radius: 5 },
    large: { lines: 10, length: 8, width: 4, radius: 8 }
  }

}));

// Jetpack Presets Overrides:
(function($){
	$.fn.spin.presets.wp = { trail: 60, speed: 1.3 };
	$.fn.spin.presets.small  = $.extend( { lines:  8, length: 2, width: 2, radius: 3 }, $.fn.spin.presets.wp );
	$.fn.spin.presets.medium = $.extend( { lines:  8, length: 4, width: 3, radius: 5 }, $.fn.spin.presets.wp );
	$.fn.spin.presets.large  = $.extend( { lines: 10, length: 6, width: 4, radius: 7 }, $.fn.spin.presets.wp );
	$.fn.spin.presets['small-left']   = $.extend( { left:  5 }, $.fn.spin.presets.small );
	$.fn.spin.presets['small-right']  = $.extend( { right: 5 }, $.fn.spin.presets.small );
	$.fn.spin.presets['medium-left']  = $.extend( { left:  5 }, $.fn.spin.presets.medium );
	$.fn.spin.presets['medium-right'] = $.extend( { right: 5 }, $.fn.spin.presets.medium );
	$.fn.spin.presets['large-left']   = $.extend( { left:  5 }, $.fn.spin.presets.large );
	$.fn.spin.presets['large-right']  = $.extend( { right: 5 }, $.fn.spin.presets.large );
})(jQuery);
;
/* global jetpackCarouselStrings, DocumentTouch */

// @start-hide-in-jetpack
if (typeof wpcom === 'undefined') {
	var wpcom = {};
}
wpcom.carousel = (function(/*$*/) {
	var prebuilt_widths = jetpackCarouselStrings.widths;
	var pageviews_stats_args = jetpackCarouselStrings.stats_query_args;

	var findFirstLargeEnoughWidth = function(original_w, original_h, dest_w, dest_h) {
		var inverse_ratio = original_h / original_w;

		for ( var i = 0; i < prebuilt_widths.length; ++i ) {
			if ( prebuilt_widths[i] >= dest_w || prebuilt_widths[i] * inverse_ratio >= dest_h ) {
				return prebuilt_widths[i];
			}
		}

		return original_w;
	};

	var removeResizeFromImageURL = function( url ) {
		return removeArgFromURL( url, 'resize' );
	};

	var removeArgFromURL = function( url, arg ) {
		var re = new RegExp( '[\\?&]' + arg + '(=[^?&]+)?' );
		if ( url.match( re ) ) {
			return url.replace( re, '' );
		}
		return url;
	};

	var addWidthToImageURL = function(url, width) {
		width = parseInt(width, 10);
		// Give devices with a higher devicePixelRatio higher-res images (Retina display = 2, Android phones = 1.5, etc)
		if ('undefined' !== typeof window.devicePixelRatio && window.devicePixelRatio > 1) {
			width = Math.round( width * window.devicePixelRatio );
		}
		url = addArgToURL(url, 'w', width);
		url = addArgToURL(url, 'h', '');
		return url;
	};

	var addArgToURL = function(url, arg, value) {
		var re = new RegExp(arg+'=[^?&]+');
		if ( url.match(re) ) {
			return url.replace(re, arg + '=' + value);
		} else {
			var divider = url.indexOf('?') !== -1 ? '&' : '?';
			return url + divider + arg + '=' + value;
		}
	};

	var stat = function ( names ) {
		if ( typeof names !== 'string' ) {
			names = names.join( ',' );
		}

		new Image().src = window.location.protocol +
			'//pixel.wp.com/g.gif?v=wpcom-no-pv' +
			'&x_carousel=' + names +
			'&baba=' + Math.random();
	};

	var pageview = function ( post_id ) {
		new Image().src = window.location.protocol +
			'//pixel.wp.com/g.gif?host=' + encodeURIComponent( window.location.host ) +
			'&ref=' + encodeURIComponent( document.referrer ) +
			'&rand=' + Math.random() +
			'&' + pageviews_stats_args +
			'&post=' + encodeURIComponent( post_id );
	};


	return {
		findFirstLargeEnoughWidth: findFirstLargeEnoughWidth,
		removeResizeFromImageURL: removeResizeFromImageURL,
		addWidthToImageURL: addWidthToImageURL,
		stat: stat,
		pageview: pageview
	};

})(jQuery);
// @end-hide-in-jetpack

jQuery( document ).ready( function( $ ) {
	// gallery faded layer and container elements
	var overlay,
		comments,
		gallery,
		container,
		nextButton,
		previousButton,
		info,
		transitionBegin,
		caption,
		resizeTimeout,
		photo_info,
		close_hint,
		commentInterval,
		lastSelectedSlide,
		screenPadding = 110,
		originalOverflow = $( 'body' ).css( 'overflow' ),
		originalHOverflow = $( 'html' ).css( 'overflow' ),
		proportion = 85,
		last_known_location_hash = '',
		imageMeta,
		titleAndDescription,
		commentForm,
		leftColWrapper,
		scrollPos;

	if ( window.innerWidth <= 760 ) {
		screenPadding = Math.round( ( window.innerWidth / 760 ) * 110 );

		if (
			screenPadding < 40 &&
			( 'ontouchstart' in window || ( window.DocumentTouch && document instanceof DocumentTouch ) )
		) {
			screenPadding = 0;
		}
	}

	// Adding a polyfill for browsers that do not have Date.now
	if ( 'undefined' === typeof Date.now ) {
		Date.now = function now() {
			return new Date().getTime();
		};
	}

	var keyListener = function( e ) {
		switch ( e.which ) {
			case 38: // up
				e.preventDefault();
				container.scrollTop( container.scrollTop() - 100 );
				break;
			case 40: // down
				e.preventDefault();
				container.scrollTop( container.scrollTop() + 100 );
				break;
			case 39: // right
				e.preventDefault();
				gallery.jp_carousel( 'next' );
				break;
			case 37: // left
			case 8: // backspace
				e.preventDefault();
				gallery.jp_carousel( 'previous' );
				break;
			case 27: // escape
				e.preventDefault();
				container.jp_carousel( 'close' );
				break;
			default:
				// making jslint happy
				break;
		}
	};

	var resizeListener = function(/*e*/) {
		clearTimeout( resizeTimeout );
		resizeTimeout = setTimeout( function() {
			gallery.jp_carousel( 'slides' ).jp_carousel( 'fitSlide', true );
			gallery.jp_carousel( 'updateSlidePositions', true );
			gallery.jp_carousel( 'fitMeta', true );
		}, 200 );
	};

	var prepareGallery = function(/*dataCarouselExtra*/) {
		if ( ! overlay ) {
			overlay = $( '<div></div>' )
				.addClass( 'jp-carousel-overlay' )
				.css( {
					position: 'fixed',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
				} );

			var buttons =
				'<a class="jp-carousel-commentlink" href="#">' + jetpackCarouselStrings.comment + '</a>';
			if ( 1 === Number( jetpackCarouselStrings.is_logged_in ) ) {
// @start-hide-in-jetpack
				if ( 1 === Number( jetpackCarouselStrings.is_public && 1 === Number( jetpackCarouselStrings.reblog_enabled ) ) ) {
					buttons += '<a class="jp-carousel-reblog" href="#">' + jetpackCarouselStrings.reblog + '</a>';
				}
// @end-hide-in-jetpack
			}

			buttons = $( '<div class="jp-carousel-buttons">' + buttons + '</div>' );

			caption = $( '<h2 itemprop="caption description"></h2>' );
			photo_info = $( '<div class="jp-carousel-photo-info"></div>' ).append( caption );

			imageMeta = $( '<div></div>' )
				.addClass( 'jp-carousel-image-meta' )
				.css( {
					float: 'right',
					'margin-top': '20px',
					width: '250px',
				} );

			imageMeta
				.append( buttons )
				.append( "<ul class='jp-carousel-image-exif' style='display:none;'></ul>" )
				.append( "<a class='jp-carousel-image-download' style='display:none;'></a>" )
				.append( "<div class='jp-carousel-image-map' style='display:none;'></div>" );

			titleAndDescription = $( '<div></div>' )
				.addClass( 'jp-carousel-titleanddesc' )
				.css( {
					width: '100%',
					'margin-top': imageMeta.css( 'margin-top' ),
				} );

			var commentFormMarkup = '<div id="jp-carousel-comment-form-container">';

			if (
				jetpackCarouselStrings.local_comments_commenting_as &&
				jetpackCarouselStrings.local_comments_commenting_as.length
			) {
				// Comments not enabled, fallback to local comments

				if (
					1 !== Number( jetpackCarouselStrings.is_logged_in ) &&
					1 === Number( jetpackCarouselStrings.comment_registration )
				) {
					commentFormMarkup +=
						'<div id="jp-carousel-comment-form-commenting-as">' +
						jetpackCarouselStrings.local_comments_commenting_as +
						'</div>';
				} else {
					commentFormMarkup += '<form id="jp-carousel-comment-form">';
					commentFormMarkup +=
						'<textarea name="comment" class="jp-carousel-comment-form-field jp-carousel-comment-form-textarea" id="jp-carousel-comment-form-comment-field" placeholder="' +
						jetpackCarouselStrings.write_comment +
						'"></textarea>';
					commentFormMarkup += '<div id="jp-carousel-comment-form-submit-and-info-wrapper">';
					commentFormMarkup +=
						'<div id="jp-carousel-comment-form-commenting-as">' +
						jetpackCarouselStrings.local_comments_commenting_as +
						'</div>';
					commentFormMarkup +=
						'<input type="submit" name="submit" class="jp-carousel-comment-form-button" id="jp-carousel-comment-form-button-submit" value="' +
						jetpackCarouselStrings.post_comment +
						'" />';
					commentFormMarkup += '<span id="jp-carousel-comment-form-spinner">&nbsp;</span>';
					commentFormMarkup += '<div id="jp-carousel-comment-post-results"></div>';
					commentFormMarkup += '</div>';
					commentFormMarkup += '</form>';
				}
			}
			commentFormMarkup += '</div>';

			commentForm = $( commentFormMarkup ).css( {
				width: '100%',
				'margin-top': '20px',
				color: '#999',
			} );

			comments = $( '<div></div>' )
				.addClass( 'jp-carousel-comments' )
				.css( {
					width: '100%',
					bottom: '10px',
					'margin-top': '20px',
				} );

			var commentsLoading = $(
				'<div id="jp-carousel-comments-loading"><span>' +
					jetpackCarouselStrings.loading_comments +
					'</span></div>'
			).css( {
				width: '100%',
				bottom: '10px',
				'margin-top': '20px',
			} );

			var leftWidth = $( window ).width() - screenPadding * 2 - ( imageMeta.width() + 40 );
			leftWidth += 'px';

			leftColWrapper = $( '<div></div>' )
				.addClass( 'jp-carousel-left-column-wrapper' )
				.css( {
					width: Math.floor( leftWidth ),
				} )
				.append( titleAndDescription )
				.append( commentForm )
				.append( comments )
				.append( commentsLoading );

			var fadeaway = $( '<div></div>' ).addClass( 'jp-carousel-fadeaway' );

			info = $( '<div></div>' )
				.addClass( 'jp-carousel-info' )
				.css( {
					top: Math.floor( ( $( window ).height() / 100 ) * proportion ),
					left: screenPadding,
					right: screenPadding,
				} )
				.append( photo_info )
				.append( imageMeta );

			if ( window.innerWidth <= 760 ) {
				photo_info.remove().insertAfter( titleAndDescription );
				info.prepend( leftColWrapper );
			} else {
				info.append( leftColWrapper );
			}

			var targetBottomPos = $( window ).height() - parseInt( info.css( 'top' ), 10 ) + 'px';

			nextButton = $( '<div><span></span></div>' )
				.addClass( 'jp-carousel-next-button' )
				.css( {
					right: '15px',
				} )
				.hide();

			previousButton = $( '<div><span></span></div>' )
				.addClass( 'jp-carousel-previous-button' )
				.css( {
					left: 0,
				} )
				.hide();

			nextButton.add( previousButton ).css( {
				position: 'fixed',
				top: '40px',
				bottom: targetBottomPos,
				width: screenPadding,
			} );

			gallery = $( '<div></div>' )
				.addClass( 'jp-carousel' )
				.css( {
					position: 'absolute',
					top: 0,
					bottom: targetBottomPos,
					left: 0,
					right: 0,
				} );

			close_hint = $( '<div class="jp-carousel-close-hint"><span>&times;</span></div>' ).css( {
				position: 'fixed',
			} );

			container = $( '<div></div>' )
				.addClass( 'jp-carousel-wrap' )
				.addClass( 'jp-carousel-transitions' );
			if ( 'white' === jetpackCarouselStrings.background_color ) {
				container.addClass( 'jp-carousel-light' );
			}

			container.attr( 'itemscope', '' );

			container.attr( 'itemtype', 'https://schema.org/ImageGallery' );

			container
				.css( {
					position: 'fixed',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					'z-index': 2147483647,
					'overflow-x': 'hidden',
					'overflow-y': 'auto',
					direction: 'ltr',
				} )
				.hide()
				.append( overlay )
				.append( gallery )
				.append( fadeaway )
				.append( info )
				.append( nextButton )
				.append( previousButton )
				.append( close_hint )
				.appendTo( $( 'body' ) )
				.click( function( e ) {
					var target = $( e.target ),
						wrap = target.parents( 'div.jp-carousel-wrap' ),
						data = wrap.data( 'carousel-extra' ),
						slide = wrap.find( 'div.selected' ),
						attachment_id = slide.data( 'attachment-id' );
					data = data || [];

					if (
						target.is( gallery ) ||
						target
							.parents()
							.add( target )
							.is( close_hint )
					) {
						container.jp_carousel( 'close' );
// @start-hide-in-jetpack
					} else if ( target.hasClass('jp-carousel-reblog') ) {
						e.preventDefault();
						e.stopPropagation();
						if ( !target.hasClass('reblogged') ) {
							target.jp_carousel('show_reblog_box');
							wpcom.carousel.stat('reblog_show_box');
						}
					} else if ( target.parents('#carousel-reblog-box').length ) {
						if ( target.is('a.cancel') ) {
							e.preventDefault();
							e.stopPropagation();
							target.jp_carousel('hide_reblog_box');
							wpcom.carousel.stat('reblog_cancel');
						} else if ( target.is( 'input[type="submit"]' ) ) {
							e.preventDefault();
							e.stopPropagation();

							var note = $('#carousel-reblog-box textarea').val();
							if ( jetpackCarouselStrings.reblog_add_thoughts === note ) {
								note = '';
							}

							$('#carousel-reblog-submit').val( jetpackCarouselStrings.reblogging );
							$('#carousel-reblog-submit').prop('disabled', true);
							$( '#carousel-reblog-box div.submit span.canceltext' ).spin( 'small' );

							$.post( jetpackCarouselStrings.ajaxurl, {
								'action': 'post_reblog',
								'reblog_source': 'carousel',
								'original_blog_id': $('#carousel-reblog-box input#carousel-reblog-blog-id').val(),
								'original_post_id': $('.jp-carousel div.selected').data('attachment-id'),
								'blog_id': $('#carousel-reblog-box select').val(),
								'blog_url': $('#carousel-reblog-box input#carousel-reblog-blog-url').val(),
								'blog_title': $('#carousel-reblog-box input#carousel-reblog-blog-title').val(),
								'post_url': $('#carousel-reblog-box input#carousel-reblog-post-url').val(),
								'post_title': slide.data( 'caption' ) || $('#carousel-reblog-box input#carousel-reblog-post-title').val(),
								'note': note,
								'_wpnonce': $('#carousel-reblog-box #_wpnonce').val()
							},
							function(/*result*/) {
								$('#carousel-reblog-box').css({ 'height': $('#carousel-reblog-box').height() + 'px' }).slideUp('fast');
								$('a.jp-carousel-reblog').html( jetpackCarouselStrings.reblogged ).removeClass( 'reblog' ).addClass( 'reblogged' );
								$( '#carousel-reblog-box div.submit span.canceltext' ).spin( false );
								$('#carousel-reblog-submit').val( jetpackCarouselStrings.post_reblog );
								$('div.jp-carousel-info').children().not('#carousel-reblog-box').fadeIn('fast');
								slide.data('reblogged', 1);
								$('div.gallery').find('img[data-attachment-id="' + slide.data('attachment-id') + '"]').data('reblogged', 1);


							}, 'json' );
							wpcom.carousel.stat('reblog_submit');
						}
					} else if ( target.hasClass( 'jp-carousel-image-download' ) ) {
						wpcom.carousel.stat( 'download_original_click' );
// @end-hide-in-jetpack
					} else if ( target.hasClass( 'jp-carousel-commentlink' ) ) {
						e.preventDefault();
						e.stopPropagation();
						$( window ).unbind( 'keydown', keyListener );
						container.animate( { scrollTop: parseInt( info.position()[ 'top' ], 10 ) }, 'fast' );
						$( '#jp-carousel-comment-form-submit-and-info-wrapper' ).slideDown( 'fast' );
						$( '#jp-carousel-comment-form-comment-field' ).focus();
					} else if ( target.hasClass( 'jp-carousel-comment-login' ) ) {
						var url = jetpackCarouselStrings.login_url + '%23jp-carousel-' + attachment_id;

						window.location.href = url;
					} else if ( target.parents( '#jp-carousel-comment-form-container' ).length ) {
						var textarea = $( '#jp-carousel-comment-form-comment-field' )
							.blur( function() {
								$( window ).bind( 'keydown', keyListener );
							} )
							.focus( function() {
								$( window ).unbind( 'keydown', keyListener );
							} );

						var emailField = $( '#jp-carousel-comment-form-email-field' )
							.blur( function() {
								$( window ).bind( 'keydown', keyListener );
							} )
							.focus( function() {
								$( window ).unbind( 'keydown', keyListener );
							} );

						var authorField = $( '#jp-carousel-comment-form-author-field' )
							.blur( function() {
								$( window ).bind( 'keydown', keyListener );
							} )
							.focus( function() {
								$( window ).unbind( 'keydown', keyListener );
							} );

						var urlField = $( '#jp-carousel-comment-form-url-field' )
							.blur( function() {
								$( window ).bind( 'keydown', keyListener );
							} )
							.focus( function() {
								$( window ).unbind( 'keydown', keyListener );
							} );

						if ( textarea && textarea.attr( 'id' ) === target.attr( 'id' ) ) {
							// For first page load
							$( window ).unbind( 'keydown', keyListener );
							$( '#jp-carousel-comment-form-submit-and-info-wrapper' ).slideDown( 'fast' );
						} else if ( target.is( 'input[type="submit"]' ) ) {
							e.preventDefault();
							e.stopPropagation();

							$( '#jp-carousel-comment-form-spinner' ).spin( 'small', 'white' );

							var ajaxData = {
								action: 'post_attachment_comment',
								nonce: jetpackCarouselStrings.nonce,
								blog_id: data[ 'blog_id' ],
								id: attachment_id,
								comment: textarea.val(),
							};

							if ( ! ajaxData[ 'comment' ].length ) {
								gallery.jp_carousel( 'postCommentError', {
									field: 'jp-carousel-comment-form-comment-field',
									error: jetpackCarouselStrings.no_comment_text,
								} );
								return;
							}

							if ( 1 !== Number( jetpackCarouselStrings.is_logged_in ) ) {
								ajaxData[ 'email' ] = emailField.val();
								ajaxData[ 'author' ] = authorField.val();
								ajaxData[ 'url' ] = urlField.val();

								if ( 1 === Number( jetpackCarouselStrings.require_name_email ) ) {
									if ( ! ajaxData[ 'email' ].length || ! ajaxData[ 'email' ].match( '@' ) ) {
										gallery.jp_carousel( 'postCommentError', {
											field: 'jp-carousel-comment-form-email-field',
											error: jetpackCarouselStrings.no_comment_email,
										} );
										return;
									} else if ( ! ajaxData[ 'author' ].length ) {
										gallery.jp_carousel( 'postCommentError', {
											field: 'jp-carousel-comment-form-author-field',
											error: jetpackCarouselStrings.no_comment_author,
										} );
										return;
									}
								}
							}

							$.ajax( {
								type: 'POST',
								url: jetpackCarouselStrings.ajaxurl,
								data: ajaxData,
								dataType: 'json',
								success: function( response /*, status, xhr*/ ) {
									if ( 'approved' === response.comment_status ) {
										$( '#jp-carousel-comment-post-results' )
											.slideUp( 'fast' )
											.html(
												'<span class="jp-carousel-comment-post-success">' +
													jetpackCarouselStrings.comment_approved +
													'</span>'
											)
											.slideDown( 'fast' );
									} else if ( 'unapproved' === response.comment_status ) {
										$( '#jp-carousel-comment-post-results' )
											.slideUp( 'fast' )
											.html(
												'<span class="jp-carousel-comment-post-success">' +
													jetpackCarouselStrings.comment_unapproved +
													'</span>'
											)
											.slideDown( 'fast' );
									} else {
										// 'deleted', 'spam', false
										$( '#jp-carousel-comment-post-results' )
											.slideUp( 'fast' )
											.html(
												'<span class="jp-carousel-comment-post-error">' +
													jetpackCarouselStrings.comment_post_error +
													'</span>'
											)
											.slideDown( 'fast' );
									}
									gallery.jp_carousel( 'clearCommentTextAreaValue' );
									gallery.jp_carousel( 'getComments', {
										attachment_id: attachment_id,
										offset: 0,
										clear: true,
									} );
									$( '#jp-carousel-comment-form-button-submit' ).val(
										jetpackCarouselStrings.post_comment
									);
									$( '#jp-carousel-comment-form-spinner' ).spin( false );
								},
								error: function(/*xhr, status, error*/) {
									// TODO: Add error handling and display here
									gallery.jp_carousel( 'postCommentError', {
										field: 'jp-carousel-comment-form-comment-field',
										error: jetpackCarouselStrings.comment_post_error,
									} );
									return;
								},
							} );
						}
					} else if ( ! target.parents( '.jp-carousel-info' ).length ) {
						container.jp_carousel( 'next' );
					}
				} )
				.bind( 'jp_carousel.afterOpen', function() {
					$( window ).bind( 'keydown', keyListener );
					$( window ).bind( 'resize', resizeListener );
					gallery.opened = true;

					resizeListener();
				} )
				.bind( 'jp_carousel.beforeClose', function() {
					var scroll = $( window ).scrollTop();

					$( window ).unbind( 'keydown', keyListener );
					$( window ).unbind( 'resize', resizeListener );
					$( window ).scrollTop( scroll );
					$( '.jp-carousel-previous-button' ).hide();
					$( '.jp-carousel-next-button' ).hide();
					// Set height to original value
					// Fix some themes where closing carousel brings view back to top
					$( 'html' ).css( 'height', '' );

					gallery.jp_carousel( 'hide_reblog_box' ); // @hide-in-jetpack
				})
				.bind( 'jp_carousel.afterClose', function() {
					if ( window.location.hash && history.back ) {
						history.back();
					}
					last_known_location_hash = '';
					gallery.opened = false;
				} )
				.on( 'transitionend.jp-carousel ', '.jp-carousel-slide', function( e ) {
					// If the movement transitions take more than twice the allotted time, disable them.
					// There is some wiggle room in the 2x, since some of that time is taken up in
					// JavaScript, setting up the transition and calling the events.
					if ( 'transform' === e.originalEvent.propertyName ) {
						var transitionMultiplier =
							( Date.now() - transitionBegin ) / 1000 / e.originalEvent.elapsedTime;

						container.off( 'transitionend.jp-carousel' );

						if ( transitionMultiplier >= 2 ) {
							$( '.jp-carousel-transitions' ).removeClass( 'jp-carousel-transitions' );
						}
					}
				} );

			$( '.jp-carousel-wrap' ).touchwipe( {
				wipeLeft: function( e ) {
					e.preventDefault();
					gallery.jp_carousel( 'next' );
				},
				wipeRight: function( e ) {
					e.preventDefault();
					gallery.jp_carousel( 'previous' );
				},
				preventDefaultEvents: false,
			} );

			nextButton.add( previousButton ).click( function( e ) {
				e.preventDefault();
				e.stopPropagation();
				if ( nextButton.is( this ) ) {
					gallery.jp_carousel( 'next' );
				} else {
					gallery.jp_carousel( 'previous' );
				}
			} );
		}
	};

	var processSingleImageGallery = function() {
		// process links that contain img tag with attribute data-attachment-id
		$( 'a img[data-attachment-id]' ).each( function() {
			var container = $( this ).parent();

			// skip if image was already added to gallery by shortcode
			if ( container.parent( '.gallery-icon' ).length ) {
				return;
			}

			// skip if the container is not a link
			if ( 'undefined' === typeof $( container ).attr( 'href' ) ) {
				return;
			}

			var valid = false;

			// if link points to 'Media File' (ignoring GET parameters) and flag is set allow it
			if (
				$( container )
					.attr( 'href' )
					.split( '?' )[ 0 ] ===
					$( this )
						.attr( 'data-orig-file' )
						.split( '?' )[ 0 ] &&
				1 === Number( jetpackCarouselStrings.single_image_gallery_media_file )
			) {
				valid = true;
			}

			// if link points to 'Attachment Page' allow it
			if ( $( container ).attr( 'href' ) === $( this ).attr( 'data-permalink' ) ) {
				valid = true;
			}

			// links to 'Custom URL' or 'Media File' when flag not set are not valid
			if ( ! valid ) {
				return;
			}

			// make this node a gallery recognizable by event listener above
			$( container ).addClass( 'single-image-gallery' );
			// blog_id is needed to allow posting comments to correct blog
			$( container ).data( 'carousel-extra', {
				blog_id: Number( jetpackCarouselStrings.blog_id ),
			} );
		} );
	};

	var methods = {
		testForData: function( gallery ) {
			gallery = $( gallery ); // make sure we have it as a jQuery object.
			return ! ( ! gallery.length || ! gallery.data( 'carousel-extra' ) );
		},

		testIfOpened: function() {
			return !! (
				'undefined' !== typeof gallery &&
				'undefined' !== typeof gallery.opened &&
				gallery.opened
			);
		},

		openOrSelectSlide: function( index ) {
			// The `open` method triggers an asynchronous effect, so we will get an
			// error if we try to use `open` then `selectSlideAtIndex` immediately
			// after it. We can only use `selectSlideAtIndex` if the carousel is
			// already open.
			if ( ! $( this ).jp_carousel( 'testIfOpened' ) ) {
				// The `open` method selects the correct slide during the
				// initialization.
				$( this ).jp_carousel( 'open', { start_index: index } );
			} else {
				gallery.jp_carousel( 'selectSlideAtIndex', index );
			}
		},

		open: function( options ) {
			var settings = {
					items_selector:
						'.gallery-item [data-attachment-id], .tiled-gallery-item [data-attachment-id], img[data-attachment-id]',
					start_index: 0,
				},
				data = $( this ).data( 'carousel-extra' );

			if ( ! data ) {
				return; // don't run if the default gallery functions weren't used
			}

			prepareGallery( data );

			if ( gallery.jp_carousel( 'testIfOpened' ) ) {
				return; // don't open if already opened
			}

			// make sure to stop the page from scrolling behind the carousel overlay, so we don't trigger
			// infiniscroll for it when enabled (Reader, theme infiniscroll, etc).
			originalOverflow = $( 'body' ).css( 'overflow' );
			$( 'body' ).css( 'overflow', 'hidden' );
			// prevent html from overflowing on some of the new themes.
			originalHOverflow = $( 'html' ).css( 'overflow' );
			$( 'html' ).css( 'overflow', 'hidden' );
			scrollPos = $( window ).scrollTop();

			container.data( 'carousel-extra', data );
// @start-hide-in-jetpack
			wpcom.carousel.stat( ['open', 'view_image'] );
// @end-hide-in-jetpack

			return this.each( function() {
				// If options exist, lets merge them
				// with our default settings
				var $this = $( this );

				if ( options ) {
					$.extend( settings, options );
				}
				if ( -1 === settings.start_index ) {
					settings.start_index = 0; //-1 returned if can't find index, so start from beginning
				}

				container.trigger( 'jp_carousel.beforeOpen' ).fadeIn( 'fast', function() {
					container.trigger( 'jp_carousel.afterOpen' );
					gallery
						.jp_carousel(
							'initSlides',
							$this.find( settings.items_selector ),
							settings.start_index
						)
						.jp_carousel( 'selectSlideAtIndex', settings.start_index );
				} );
				gallery.html( '' );
			} );
		},

		selectSlideAtIndex: function( index ) {
			var slides = this.jp_carousel( 'slides' ),
				selected = slides.eq( index );

			if ( 0 === selected.length ) {
				selected = slides.eq( 0 );
			}

			gallery.jp_carousel( 'selectSlide', selected, false );
			return this;
		},

		close: function() {
			// make sure to let the page scroll again
			$( 'body' ).css( 'overflow', originalOverflow );
			$( 'html' ).css( 'overflow', originalHOverflow );
			this.jp_carousel( 'clearCommentTextAreaValue' );
			return container.trigger( 'jp_carousel.beforeClose' ).fadeOut( 'fast', function() {
				container.trigger( 'jp_carousel.afterClose' );
				$( window ).scrollTop( scrollPos );
			} );
		},

		next: function() {
			this.jp_carousel( 'previousOrNext', 'nextSlide' );
            gallery.jp_carousel( 'hide_reblog_box' ); // @hide-in-jetpack
		},

		previous: function() {
			this.jp_carousel( 'previousOrNext', 'prevSlide' );
            gallery.jp_carousel( 'hide_reblog_box' ); // @hide-in-jetpack
		},

		previousOrNext: function( slideSelectionMethodName ) {
			if ( ! this.jp_carousel( 'hasMultipleImages' ) ) {
				return false;
			}

			var slide = gallery.jp_carousel( slideSelectionMethodName );

			if ( slide ) {
				container.animate( { scrollTop: 0 }, 'fast' );
				this.jp_carousel( 'clearCommentTextAreaValue' );
				this.jp_carousel( 'selectSlide', slide );
                wpcom.carousel.stat( ['previous', 'view_image'] ); // @hide-in-jetpack
			}
		},

        // @start-hide-in-jetpack
       resetButtons : function(current) {
		   if ( current.data( 'reblogged' ) ) {
                $('.jp-carousel-buttons a.jp-carousel-reblog').addClass( 'reblogged' ).text( jetpackCarouselStrings.reblogged );
		   } else {
                $('.jp-carousel-buttons a.jp-carousel-reblog').removeClass( 'reblogged' ).text( jetpackCarouselStrings.reblog );
		   }
           // Must also take care of reblog/reblogged here
        },
        // @end-hide-in-jetpack


		selectedSlide: function() {
			return this.find( '.selected' );
		},

		setSlidePosition: function( x ) {
			transitionBegin = Date.now();

			return this.css( {
				'-webkit-transform': 'translate3d(' + x + 'px,0,0)',
				'-moz-transform': 'translate3d(' + x + 'px,0,0)',
				'-ms-transform': 'translate(' + x + 'px,0)',
				'-o-transform': 'translate(' + x + 'px,0)',
				transform: 'translate3d(' + x + 'px,0,0)',
			} );
		},

		updateSlidePositions: function( animate ) {
			var current = this.jp_carousel( 'selectedSlide' ),
				galleryWidth = gallery.width(),
				currentWidth = current.width(),
				previous = gallery.jp_carousel( 'prevSlide' ),
				next = gallery.jp_carousel( 'nextSlide' ),
				previousPrevious = previous.prev(),
				nextNext = next.next(),
				left = Math.floor( ( galleryWidth - currentWidth ) * 0.5 );

			current.jp_carousel( 'setSlidePosition', left ).show();

			// minimum width
			gallery.jp_carousel( 'fitInfo', animate );

			// prep the slides
			var direction = lastSelectedSlide.is( current.prevAll() ) ? 1 : -1;

			// Since we preload the `previousPrevious` and `nextNext` slides, we need
			// to make sure they technically visible in the DOM, but invisible to the
			// user. To hide them from the user, we position them outside the edges
			// of the window.
			//
			// This section of code only applies when there are more than three
			// slides. Otherwise, the `previousPrevious` and `nextNext` slides will
			// overlap with the `previous` and `next` slides which must be visible
			// regardless.
			if ( 1 === direction ) {
				if ( ! nextNext.is( previous ) ) {
					nextNext.jp_carousel( 'setSlidePosition', galleryWidth + next.width() ).show();
				}

				if ( ! previousPrevious.is( next ) ) {
					previousPrevious
						.jp_carousel( 'setSlidePosition', -previousPrevious.width() - currentWidth )
						.show();
				}
			} else {
				if ( ! nextNext.is( previous ) ) {
					nextNext.jp_carousel( 'setSlidePosition', galleryWidth + currentWidth ).show();
				}
			}

			previous
				.jp_carousel( 'setSlidePosition', Math.floor( -previous.width() + screenPadding * 0.75 ) )
				.show();
			next
				.jp_carousel( 'setSlidePosition', Math.ceil( galleryWidth - screenPadding * 0.75 ) )
				.show();
		},

		selectSlide: function( slide, animate ) {
			lastSelectedSlide = this.find( '.selected' ).removeClass( 'selected' );

			var slides = gallery.jp_carousel( 'slides' ).css( { position: 'fixed' } ),
				current = $( slide )
					.addClass( 'selected' )
					.css( { position: 'relative' } ),
				attachmentId = current.data( 'attachment-id' ),
				previous = gallery.jp_carousel( 'prevSlide' ),
				next = gallery.jp_carousel( 'nextSlide' ),
				previousPrevious = previous.prev(),
				nextNext = next.next(),
				animated,
				captionHtml;

			// center the main image
			gallery.jp_carousel( 'loadFullImage', current );

			caption.hide();

			if ( next.length === 0 && slides.length <= 2 ) {
				$( '.jp-carousel-next-button' ).hide();
			} else {
				$( '.jp-carousel-next-button' ).show();
			}

			if ( previous.length === 0 && slides.length <= 2 ) {
				$( '.jp-carousel-previous-button' ).hide();
			} else {
				$( '.jp-carousel-previous-button' ).show();
			}

			animated = current
				.add( previous )
				.add( previousPrevious )
				.add( next )
				.add( nextNext )
				.jp_carousel( 'loadSlide' );

			// slide the whole view to the x we want
			slides.not( animated ).hide();

			gallery.jp_carousel( 'updateSlidePositions', animate );

			gallery.jp_carousel( 'resetButtons', current ); // @hide-in-jetpack
            container.trigger( 'jp_carousel.selectSlide', [ current ] );

			gallery.jp_carousel( 'getTitleDesc', {
				title: current.data( 'title' ),
				desc: current.data( 'desc' ),
			} );

			var imageMeta = current.data( 'image-meta' );
			gallery.jp_carousel( 'updateExif', imageMeta );
			gallery.jp_carousel( 'updateFullSizeLink', current );
			gallery.jp_carousel( 'updateMap', imageMeta );
			gallery.jp_carousel( 'testCommentsOpened', current.data( 'comments-opened' ) );
			gallery.jp_carousel( 'getComments', {
				attachment_id: attachmentId,
				offset: 0,
				clear: true,
			} );
			$( '#jp-carousel-comment-post-results' ).slideUp();

			// $('<div />').text(sometext).html() is a trick to go to HTML to plain
			// text (including HTML entities decode, etc)
			if ( current.data( 'caption' ) ) {
				captionHtml = $( '<div />' )
					.text( current.data( 'caption' ) )
					.html();

				if (
					captionHtml ===
					$( '<div />' )
						.text( current.data( 'title' ) )
						.html()
				) {
					$( '.jp-carousel-titleanddesc-title' )
						.fadeOut( 'fast' )
						.empty();
				}

				if (
					captionHtml ===
					$( '<div />' )
						.text( current.data( 'desc' ) )
						.html()
				) {
					$( '.jp-carousel-titleanddesc-desc' )
						.fadeOut( 'fast' )
						.empty();
				}

				caption.html( current.data( 'caption' ) ).fadeIn( 'slow' );
			} else {
				caption.fadeOut( 'fast' ).empty();
			}

			// Record pageview in WP Stats, for each new image loaded full-screen.
			if ( jetpackCarouselStrings.stats ) {
				new Image().src =
					document.location.protocol +
					'//pixel.wp.com/g.gif?' +
					jetpackCarouselStrings.stats +
					'&post=' +
					encodeURIComponent( attachmentId ) +
					'&rand=' +
					Math.random();
			}
            wpcom.carousel.pageview( attachmentId ); // @hide-in-jetpack
			// Load the images for the next and previous slides.
			$( next )
				.add( previous )
				.each( function() {
					gallery.jp_carousel( 'loadFullImage', $( this ) );
				} );

			window.location.hash = last_known_location_hash = '#jp-carousel-' + attachmentId;
		},

		slides: function() {
			return this.find( '.jp-carousel-slide' );
		},

		slideDimensions: function() {
			return {
				width: $( window ).width() - screenPadding * 2,
				height: Math.floor( ( $( window ).height() / 100 ) * proportion - 60 ),
			};
		},

		loadSlide: function() {
			return this.each( function() {
				var slide = $( this );
				slide.find( 'img' ).one( 'load', function() {
					// set the width/height of the image if it's too big
					slide.jp_carousel( 'fitSlide', false );
				} );
			} );
		},

		bestFit: function() {
			var max = gallery.jp_carousel( 'slideDimensions' ),
				orig = this.jp_carousel( 'originalDimensions' ),
				orig_ratio = orig.width / orig.height,
				w_ratio = 1,
				h_ratio = 1,
				width,
				height;

			if ( orig.width > max.width ) {
				w_ratio = max.width / orig.width;
			}
			if ( orig.height > max.height ) {
				h_ratio = max.height / orig.height;
			}

			if ( w_ratio < h_ratio ) {
				width = max.width;
				height = Math.floor( width / orig_ratio );
			} else if ( h_ratio < w_ratio ) {
				height = max.height;
				width = Math.floor( height * orig_ratio );
			} else {
				width = orig.width;
				height = orig.height;
			}

			return {
				width: width,
				height: height,
			};
		},

		fitInfo: function(/*animated*/) {
			var current = this.jp_carousel( 'selectedSlide' ),
				size = current.jp_carousel( 'bestFit' );

			photo_info.css( {
				left: Math.floor( ( info.width() - size.width ) * 0.5 ),
				width: Math.floor( size.width ),
			} );

			return this;
		},

		fitMeta: function( animated ) {
			var newInfoTop = {
				top: Math.floor( ( $( window ).height() / 100 ) * proportion + 5 ) + 'px',
			};
			var newLeftWidth = { width: info.width() - ( imageMeta.width() + 80 ) + 'px' };

			if ( animated ) {
				info.animate( newInfoTop );
				leftColWrapper.animate( newLeftWidth );
			} else {
				info.animate( newInfoTop );
				leftColWrapper.css( newLeftWidth );
			}
		},

		fitSlide: function(/*animated*/) {
			return this.each( function() {
				var $this = $( this ),
					dimensions = $this.jp_carousel( 'bestFit' ),
					method = 'css',
					max = gallery.jp_carousel( 'slideDimensions' );

				dimensions.left = 0;
				dimensions.top = Math.floor( ( max.height - dimensions.height ) * 0.5 ) + 40;
				$this[ method ]( dimensions );
			} );
		},

		texturize: function( text ) {
			text = '' + text; // make sure we get a string. Title "1" came in as int 1, for example, which did not support .replace().
			text = text
				.replace( /'/g, '&#8217;' )
				.replace( /&#039;/g, '&#8217;' )
				.replace( /[\u2019]/g, '&#8217;' );
			text = text
				.replace( /"/g, '&#8221;' )
				.replace( /&#034;/g, '&#8221;' )
				.replace( /&quot;/g, '&#8221;' )
				.replace( /[\u201D]/g, '&#8221;' );
			text = text.replace( /([\w]+)=&#[\d]+;(.+?)&#[\d]+;/g, '$1="$2"' ); // untexturize allowed HTML tags params double-quotes
			return $.trim( text );
		},

		initSlides: function( items, start_index ) {
			if ( items.length < 2 ) {
				$( '.jp-carousel-next-button, .jp-carousel-previous-button' ).hide();
			} else {
				$( '.jp-carousel-next-button, .jp-carousel-previous-button' ).show();
			}

			// Calculate the new src.
			items.each( function(/*i*/) {
				var src_item = $( this ),
					orig_size = src_item.data( 'orig-size' ) || '',
					max = gallery.jp_carousel( 'slideDimensions' ),
					parts = orig_size.split( ',' ),
					medium_file = src_item.data( 'medium-file' ) || '',
					large_file = src_item.data( 'large-file' ) || '',
					src;
				orig_size = { width: parseInt( parts[ 0 ], 10 ), height: parseInt( parts[ 1 ], 10 ) };

// @start-hide-in-jetpack
				 if ( 'undefined' !== typeof wpcom ) {
					src = src_item.attr('src') || src_item.attr('original') || src_item.data('original') || src_item.data('lazy-src');
					if (src.indexOf('imgpress') !== -1) {
						src = src_item.data('orig-file');
					}
					// Square/Circle galleries use a resize param that needs to be removed.
					src = wpcom.carousel.removeResizeFromImageURL( src );
					src = wpcom.carousel.addWidthToImageURL( src, wpcom.carousel.findFirstLargeEnoughWidth( orig_size.width, orig_size.height, max.width, max.height ) );
				} else {

// @end-hide-in-jetpack
                src = src_item.data( 'orig-file' );

				src = gallery.jp_carousel( 'selectBestImageSize', {
					orig_file: src,
					orig_width: orig_size.width,
					orig_height: orig_size.height,
					max_width: max.width,
					max_height: max.height,
					medium_file: medium_file,
					large_file: large_file,
				} );
// @start-hide-in-jetpack
				 } // end else of if ( 'undefined' != typeof wpcom )
// @end-hide-in-jetpack

				// Set the final src
				$( this ).data( 'gallery-src', src );
			} );

			// If the start_index is not 0 then preload the clicked image first.
			if ( 0 !== start_index ) {
				$( '<img/>' )[ 0 ].src = $( items[ start_index ] ).data( 'gallery-src' );
			}

			var useInPageThumbnails =
				items.first().closest( '.tiled-gallery.type-rectangular' ).length > 0;

			// create the 'slide'
			items.each( function( i ) {
				var src_item = $( this ),
					reblogged       = src_item.data( 'reblogged' ) || 0, // @hide-in-jetpack
					attachment_id = src_item.data( 'attachment-id' ) || 0,
					comments_opened = src_item.data( 'comments-opened' ) || 0,
					image_meta = src_item.data( 'image-meta' ) || {},
					orig_size = src_item.data( 'orig-size' ) || '',
					thumb_size = { width: src_item[ 0 ].naturalWidth, height: src_item[ 0 ].naturalHeight },
					title = src_item.data( 'image-title' ) || '',
					description = src_item.data( 'image-description' ) || '',
					caption =
						src_item
							.parents( '.gallery-item' )
							.find( '.gallery-caption' )
							.html() || '',
					src = src_item.data( 'gallery-src' ) || '',
					medium_file = src_item.data( 'medium-file' ) || '',
					large_file = src_item.data( 'large-file' ) || '',
					orig_file = src_item.data( 'orig-file' ) || '';

				var tiledCaption = src_item
					.parents( 'div.tiled-gallery-item' )
					.find( 'div.tiled-gallery-caption' )
					.html();
				if ( tiledCaption ) {
					caption = tiledCaption;
				}

				if ( attachment_id && orig_size.length ) {
					title = gallery.jp_carousel( 'texturize', title );
					description = gallery.jp_carousel( 'texturize', description );
					caption = gallery.jp_carousel( 'texturize', caption );

					// Initially, the image is a 1x1 transparent gif.  The preview is shown as a background image on the slide itself.
					var image = $( '<img/>' )
						.attr(
							'src',
							'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
						)
						.css( 'width', '100%' )
						.css( 'height', '100%' );

					var slide = $(
						'<div class="jp-carousel-slide" itemprop="associatedMedia" itemscope itemtype="https://schema.org/ImageObject"></div>'
					)
						.hide()
						.css( {
							//'position' : 'fixed',
							left: i < start_index ? -1000 : gallery.width(),
						} )
						.append( image )
						.appendTo( gallery )
						.data( 'src', src )
						.data( 'title', title )
						.data( 'desc', description )
						.data( 'caption', caption )
						.data( 'attachment-id', attachment_id )
						.data( 'permalink', src_item.parents( 'a' ).attr( 'href' ) )
						.data( 'orig-size', orig_size )
						.data( 'comments-opened', comments_opened )
						.data( 'image-meta', image_meta )
						.data( 'medium-file', medium_file )
						.data( 'large-file', large_file )
						.data( 'orig-file', orig_file )
						.data( 'thumb-size', thumb_size )
                        .data( 'reblogged', reblogged ) // @hide-in-jetpack
                        ;

						if ( useInPageThumbnails ) {
						// Use the image already loaded in the gallery as a preview.
						slide.data( 'preview-image', src_item.attr( 'src' ) ).css( {
							'background-image': 'url("' + src_item.attr( 'src' ) + '")',
							'background-size': '100% 100%',
							'background-position': 'center center',
						} );
					}

					slide.jp_carousel( 'fitSlide', false );
				}
			} );
			return this;
		},

		selectBestImageSize: function( args ) {
			if ( 'object' !== typeof args ) {
				args = {};
			}

			if ( 'undefined' === typeof args.orig_file ) {
				return '';
			}

			if ( 'undefined' === typeof args.orig_width || 'undefined' === typeof args.max_width ) {
				return args.orig_file;
			}

			if ( 'undefined' === typeof args.medium_file || 'undefined' === typeof args.large_file ) {
				return args.orig_file;
			}

			// Check if the image is being served by Photon (using a regular expression on the hostname).

			var imageLinkParser = document.createElement( 'a' );
			imageLinkParser.href = args.large_file;

			var isPhotonUrl = /^i[0-2].wp.com$/i.test( imageLinkParser.hostname );

			var medium_size_parts = gallery.jp_carousel(
				'getImageSizeParts',
				args.medium_file,
				args.orig_width,
				isPhotonUrl
			);
			var large_size_parts = gallery.jp_carousel(
				'getImageSizeParts',
				args.large_file,
				args.orig_width,
				isPhotonUrl
			);

			var large_width = parseInt( large_size_parts[ 0 ], 10 ),
				large_height = parseInt( large_size_parts[ 1 ], 10 ),
				medium_width = parseInt( medium_size_parts[ 0 ], 10 ),
				medium_height = parseInt( medium_size_parts[ 1 ], 10 );

			// Assign max width and height.
			args.orig_max_width = args.max_width;
			args.orig_max_height = args.max_height;

			// Give devices with a higher devicePixelRatio higher-res images (Retina display = 2, Android phones = 1.5, etc)
			if ( 'undefined' !== typeof window.devicePixelRatio && window.devicePixelRatio > 1 ) {
				args.max_width = args.max_width * window.devicePixelRatio;
				args.max_height = args.max_height * window.devicePixelRatio;
			}

			if ( large_width >= args.max_width || large_height >= args.max_height ) {
				return args.large_file;
			}

			if ( medium_width >= args.max_width || medium_height >= args.max_height ) {
				return args.medium_file;
			}

			if ( isPhotonUrl ) {
				// args.orig_file doesn't point to a Photon url, so in this case we use args.large_file
				// to return the photon url of the original image.
				var largeFileIndex = args.large_file.lastIndexOf( '?' );
				var origPhotonUrl = args.large_file;
				if ( -1 !== largeFileIndex ) {
					origPhotonUrl = args.large_file.substring( 0, largeFileIndex );
					// If we have a really large image load a smaller version
					// that is closer to the viewable size
					if ( args.orig_width > args.max_width || args.orig_height > args.max_height ) {
						origPhotonUrl += '?fit=' + args.orig_max_width + '%2C' + args.orig_max_height;
					}
				}
				return origPhotonUrl;
			}

			return args.orig_file;
		},

		getImageSizeParts: function( file, orig_width, isPhotonUrl ) {
			var size = isPhotonUrl
				? file.replace( /.*=([\d]+%2C[\d]+).*$/, '$1' )
				: file.replace( /.*-([\d]+x[\d]+)\..+$/, '$1' );

			var size_parts =
				size !== file
					? isPhotonUrl
						? size.split( '%2C' )
						: size.split( 'x' )
					: [ orig_width, 0 ];

			// If one of the dimensions is set to 9999, then the actual value of that dimension can't be retrieved from the url.
			// In that case, we set the value to 0.
			if ( '9999' === size_parts[ 0 ] ) {
				size_parts[ 0 ] = '0';
			}

			if ( '9999' === size_parts[ 1 ] ) {
				size_parts[ 1 ] = '0';
			}

			return size_parts;
		},

// @start-hide-in-jetpack
        show_reblog_box: function() {
            $('#carousel-reblog-box textarea').val(jetpackCarouselStrings.reblog_add_thoughts);
            //t.addClass('selected');
            $('#carousel-reblog-box p.response').remove();
            $('#carousel-reblog-box div.submit, #carousel-reblog-box div.submit span.canceltext').show();
            $('#carousel-reblog-box div.submit input[type=submit]').prop('disabled', false);

            var current = $('.jp-carousel div.selected');
            $('#carousel-reblog-box input#carousel-reblog-post-url').val( current.data('permalink') );
            $('#carousel-reblog-box input#carousel-reblog-post-title').val( $('div.jp-carousel-info').children('h2').text() );

            $('div.jp-carousel-info').append( $('#carousel-reblog-box') ).children().fadeOut('fast');
            $('#carousel-reblog-box').fadeIn('fast');
        },

        hide_reblog_box: function () {
            $( 'div.jp-carousel-info' ).children().not( '#carousel-reblog-box' ).fadeIn( 'fast' );
            $( '#carousel-reblog-box' ).fadeOut( 'fast' );
        },
// @end-hide-in-jetpack

		originalDimensions: function() {
			var splitted = $( this )
				.data( 'orig-size' )
				.split( ',' );
			return { width: parseInt( splitted[ 0 ], 10 ), height: parseInt( splitted[ 1 ], 10 ) };
		},

		format: function( args ) {
			if ( 'object' !== typeof args ) {
				args = {};
			}
			if ( ! args.text || 'undefined' === typeof args.text ) {
				return;
			}
			if ( ! args.replacements || 'undefined' === typeof args.replacements ) {
				return args.text;
			}
			return args.text.replace( /{(\d+)}/g, function( match, number ) {
				return typeof args.replacements[ number ] !== 'undefined'
					? args.replacements[ number ]
					: match;
			} );
		},

		/**
		 * Returns a number in a fraction format that represents the shutter speed.
		 * @param Number speed
		 * @return String
		 */
		shutterSpeed: function( speed ) {
			var denominator;

			// round to one decimal if value > 1s by multiplying it by 10, rounding, then dividing by 10 again
			if ( speed >= 1 ) {
				return Math.round( speed * 10 ) / 10 + 's';
			}

			// If the speed is less than one, we find the denominator by inverting
			// the number. Since cameras usually use rational numbers as shutter
			// speeds, we should get a nice round number. Or close to one in cases
			// like 1/30. So we round it.
			denominator = Math.round( 1 / speed );

			return '1/' + denominator + 's';
		},

		parseTitleDesc: function( value ) {
			if ( ! value.match( ' ' ) && value.match( '_' ) ) {
				return '';
			}

			return value;
		},

		getTitleDesc: function( data ) {
			var title = '',
				desc = '',
				markup = '',
				target;

			target = $( 'div.jp-carousel-titleanddesc', 'div.jp-carousel-wrap' );
			target.hide();

			title = gallery.jp_carousel( 'parseTitleDesc', data.title ) || '';
			desc = gallery.jp_carousel( 'parseTitleDesc', data.desc ) || '';

			if ( title.length || desc.length ) {
				// Convert from HTML to plain text (including HTML entities decode, etc)
				if (
					$( '<div />' )
						.html( title )
						.text() ===
					$( '<div />' )
						.html( desc )
						.text()
				) {
					title = '';
				}

				markup = title.length
					? '<div class="jp-carousel-titleanddesc-title">' + title + '</div>'
					: '';
				markup += desc.length
					? '<div class="jp-carousel-titleanddesc-desc">' + desc + '</div>'
					: '';

				target.html( markup ).fadeIn( 'slow' );
			}

			$( 'div#jp-carousel-comment-form-container' ).css( 'margin-top', '20px' );
			$( 'div#jp-carousel-comments-loading' ).css( 'margin-top', '20px' );
		},

		// updateExif updates the contents of the exif UL (.jp-carousel-image-exif)
		updateExif: function( meta ) {
			if ( ! meta || 1 !== Number( jetpackCarouselStrings.display_exif ) ) {
				return false;
			}

			var $ul = $( "<ul class='jp-carousel-image-exif'></ul>" );

			$.each( meta, function( key, val ) {
				if (
					0 === parseFloat( val ) ||
					! val.length ||
					-1 === $.inArray( key, $.makeArray( jetpackCarouselStrings.meta_data ) )
				) {
					return;
				}

				switch ( key ) {
					case 'focal_length':
						val = val + 'mm';
						break;
					case 'shutter_speed':
						val = gallery.jp_carousel( 'shutterSpeed', val );
						break;
					case 'aperture':
						val = 'f/' + val;
						break;
				}

				$ul.append( '<li><h5>' + jetpackCarouselStrings[ key ] + '</h5>' + val + '</li>' );
			} );

			// Update (replace) the content of the ul
			$( 'div.jp-carousel-image-meta ul.jp-carousel-image-exif' ).replaceWith( $ul );
		},

		// updateFullSizeLink updates the contents of the jp-carousel-image-download link
		updateFullSizeLink: function( current ) {
			if ( ! current || ! current.data ) {
				return false;
			}
			var original,
				origSize = current.data( 'orig-size' ).split( ',' ),
				imageLinkParser = document.createElement( 'a' );

			imageLinkParser.href = current.data( 'src' ).replace( /\?.+$/, '' );

			// Is this a Photon URL?
			if ( imageLinkParser.hostname.match( /^i[\d]{1}.wp.com$/i ) !== null ) {
				original = imageLinkParser.href;
			} else {
				original = current.data( 'orig-file' ).replace( /\?.+$/, '' );
			}

			var permalink = $(
				'<a>' +
					gallery.jp_carousel( 'format', {
						text: jetpackCarouselStrings.download_original,
						replacements: origSize,
					} ) +
					'</a>'
			)
				.addClass( 'jp-carousel-image-download' )
				.attr( 'href', original )
				.attr( 'target', '_blank' );

			// Update (replace) the content of the anchor
			$( 'div.jp-carousel-image-meta a.jp-carousel-image-download' ).replaceWith( permalink );
		},

		updateMap: function( meta ) {
			if (
				! meta.latitude ||
				! meta.longitude ||
				1 !== Number( jetpackCarouselStrings.display_geo )
			) {
				return;
			}

			var latitude = meta.latitude,
				longitude = meta.longitude,
				$metabox = $( 'div.jp-carousel-image-meta', 'div.jp-carousel-wrap' ),
				$mapbox = $( '<div></div>' ),
				style =
					'&scale=2&style=feature:all|element:all|invert_lightness:true|hue:0x0077FF|saturation:-50|lightness:-5|gamma:0.91';

			$mapbox
				.addClass( 'jp-carousel-image-map' )
				.html(
					'<img width="154" height="154" src="https://maps.googleapis.com/maps/api/staticmap?\
							center=' +
						latitude +
						',' +
						longitude +
						'&\
							zoom=8&\
							size=154x154&\
							sensor=false&\
							markers=size:medium%7Ccolor:blue%7C' +
						latitude +
						',' +
						longitude +
						style +
						'" class="gmap-main" />\
							\
						<div class="gmap-topright"><div class="imgclip"><img width="175" height="154" src="https://maps.googleapis.com/maps/api/staticmap?\
							center=' +
						latitude +
						',' +
						longitude +
						'&\
							zoom=3&\
							size=175x154&\
							sensor=false&\
							markers=size:small%7Ccolor:blue%7C' +
						latitude +
						',' +
						longitude +
						style +
						'"c /></div></div>\
							\
						'
				)
				.prependTo( $metabox );
		},

		testCommentsOpened: function( opened ) {
			if ( 1 === parseInt( opened, 10 ) ) {
// @start-hide-in-jetpack
				if ( 1 === Number( jetpackCarouselStrings.is_logged_in ) ) {
					$('.jp-carousel-commentlink').fadeIn('fast');
				} else {
// @end-hide-in-jetpack
					$( '.jp-carousel-buttons' ).fadeIn( 'fast' );
// @start-hide-in-jetpack
				}
// @end-hide-in-jetpack
				commentForm.fadeIn( 'fast' );
			} else {
// @start-hide-in-jetpack
				if ( 1 === Number( jetpackCarouselStrings.is_logged_in ) ) {
					$('.jp-carousel-commentlink').fadeOut('fast');
				} else {
// @end-hide-in-jetpack
					$( '.jp-carousel-buttons' ).fadeOut( 'fast' );
// @start-hide-in-jetpack
				}
// @end-hide-in-jetpack
				commentForm.fadeOut( 'fast' );
			}
		},

        getComments: function( args ) {
            clearInterval( commentInterval );

            if ( 'object' !== typeof args ) {
                return;
            }

            if ( 'undefined' === typeof args.attachment_id || ! args.attachment_id ) {
                return;
            }

            if ( ! args.offset || 'undefined' === typeof args.offset || args.offset < 1 ) {
                args.offset = 0;
            }

            var comments = $( '.jp-carousel-comments' ),
                commentsLoading = $( '#jp-carousel-comments-loading' ).show();

            if ( args.clear ) {
                comments.hide().empty();
            }

            $.ajax( {
                type: 'GET',
                url: jetpackCarouselStrings.ajaxurl,
                dataType: 'json',
                data: {
                    action: 'get_attachment_comments',
                    nonce: jetpackCarouselStrings.nonce,
                    id: args.attachment_id,
                    offset: args.offset,
                },
                success: function( data /*, status, xhr*/ ) {
                    if ( args.clear ) {
                        comments.fadeOut( 'fast' ).empty();
                    }

                    $( data ).each( function() {
                        var comment = $( '<div></div>' )
                            .addClass( 'jp-carousel-comment' )
                            .attr( 'id', 'jp-carousel-comment-' + this[ 'id' ] )
                            .html(
                                '<div class="comment-gravatar">' +
                                this[ 'gravatar_markup' ] +
                                '</div>' +
                                '<div class="comment-author">' +
                                this[ 'author_markup' ] +
                                '</div>' +
                                '<div class="comment-date">' +
                                this[ 'date_gmt' ] +
                                '</div>' +
                                '<div class="comment-content">' +
                                this[ 'content' ] +
                                '</div>'
                            );
                        comments.append( comment );

                        // Set the interval to check for a new page of comments.
                        clearInterval( commentInterval );
                        commentInterval = setInterval( function() {
                            if (
                                $( '.jp-carousel-overlay' ).height() - 150 <
                                $( '.jp-carousel-wrap' ).scrollTop() + $( window ).height()
                            ) {
                                gallery.jp_carousel( 'getComments', {
                                    attachment_id: args.attachment_id,
                                    offset: args.offset + 10,
                                    clear: false,
                                } );
                                clearInterval( commentInterval );
                            }
                        }, 300 );
                    } );

                    // Verify (late) that the user didn't repeatldy click the arrows really fast, in which case the requested
                    // attachment id might no longer match the current attachment id by the time we get the data back or a now
                    // registered infiniscroll event kicks in, so we don't ever display comments for the wrong image by mistake.
                    var current = $( '.jp-carousel div.selected' );
                    if ( current && current.data && current.data( 'attachment-id' ) != args.attachment_id ) {
                        comments.fadeOut( 'fast' );
                        comments.empty();
                        return;
                    }

                    // Increase the height of the background, semi-transparent overlay to match the new length of the comments list.
                    $( '.jp-carousel-overlay' ).height(
                        $( window ).height() +
                        titleAndDescription.height() +
                        commentForm.height() +
                        ( comments.height() > 0 ? comments.height() : imageMeta.height() ) +
                        200
                    );

                    comments.show();
                    commentsLoading.hide();
                },
                error: function( xhr, status, error ) {
                    // TODO: proper error handling
                    console.log( 'Comment get fail...', xhr, status, error );
                    comments.fadeIn( 'fast' );
                    commentsLoading.fadeOut( 'fast' );
                },
            } );
        },

        postCommentError: function( args ) {
            if ( 'object' !== typeof args ) {
                args = {};
            }
            if (
                ! args.field ||
                'undefined' === typeof args.field ||
                ! args.error ||
                'undefined' === typeof args.error
            ) {
                return;
            }
            $( '#jp-carousel-comment-post-results' )
                .slideUp( 'fast' )
                .html( '<span class="jp-carousel-comment-post-error">' + args.error + '</span>' )
                .slideDown( 'fast' );
            $( '#jp-carousel-comment-form-spinner' ).spin( false );
        },

        setCommentIframeSrc: function( attachment_id ) {
            var iframe = $( '#jp-carousel-comment-iframe' );
            // Set the proper irame src for the current attachment id
            if ( iframe && iframe.length ) {
                iframe.attr( 'src', iframe.attr( 'src' ).replace( /(postid=)\d+/, '$1' + attachment_id ) );
                iframe.attr(
                    'src',
                    iframe.attr( 'src' ).replace( /(%23.+)?$/, '%23jp-carousel-' + attachment_id )
                );
            }
        },

        clearCommentTextAreaValue: function() {
            var commentTextArea = $( '#jp-carousel-comment-form-comment-field' );
            if ( commentTextArea ) {
                commentTextArea.val( '' );
            }
        },

        nextSlide: function() {
            var slides = this.jp_carousel( 'slides' );
            var selected = this.jp_carousel( 'selectedSlide' );

            if ( selected.length === 0 || ( slides.length > 2 && selected.is( slides.last() ) ) ) {
                return slides.first();
            }

            return selected.next();
        },

        prevSlide: function() {
            var slides = this.jp_carousel( 'slides' );
            var selected = this.jp_carousel( 'selectedSlide' );

            if ( selected.length === 0 || ( slides.length > 2 && selected.is( slides.first() ) ) ) {
                return slides.last();
            }

            return selected.prev();
        },

        loadFullImage: function( slide ) {
            var image = slide.find( 'img:first' );

            if ( ! image.data( 'loaded' ) ) {
                // If the width of the slide is smaller than the width of the "thumbnail" we're already using,
                // don't load the full image.

                image.on( 'load.jetpack', function() {
                    image.off( 'load.jetpack' );
                    $( this )
                        .closest( '.jp-carousel-slide' )
                        .css( 'background-image', '' );
                } );

                if (
                    ! slide.data( 'preview-image' ) ||
                    ( slide.data( 'thumb-size' ) && slide.width() > slide.data( 'thumb-size' ).width )
                ) {
                    image
                        .attr( 'src', image.closest( '.jp-carousel-slide' ).data( 'src' ) )
                        .attr( 'itemprop', 'image' );
                } else {
                    image.attr( 'src', slide.data( 'preview-image' ) ).attr( 'itemprop', 'image' );
                }

                image.data( 'loaded', 1 );
            }
        },

        hasMultipleImages: function() {
            return gallery.jp_carousel( 'slides' ).length > 1;
        },
    };

    $.fn.jp_carousel = function( method ) {
        // ask for the HTML of the gallery
        // Method calling logic
        if ( methods[ method ] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
        } else if ( typeof method === 'object' || ! method ) {
            return methods.open.apply( this, arguments );
        } else {
            $.error( 'Method ' + method + ' does not exist on jQuery.jp_carousel' );
        }
    };

    // register the event listener for starting the gallery
    $( document.body ).on(
        'click.jp-carousel',
        'div.gallery, div.tiled-gallery, ul.wp-block-gallery, ul.blocks-gallery-grid, div.wp-block-jetpack-tiled-gallery, a.single-image-gallery',
        function( e ) {
            if ( ! $( this ).jp_carousel( 'testForData', e.currentTarget ) ) {
                return;
            }

            // Do not open the modal if we are looking at a gallery caption from before WP5, which may contain a link.
            if (
                $( e.target )
                    .parent()
                    .hasClass( 'gallery-caption' )
            ) {
                return;
            }

            // Do not open the modal if we are looking at a caption of a gallery block, which may contain a link.
            if (
                $( e.target )
                    .parent()
                    .is( 'figcaption' )
            ) {
                return;
            }

            // Set height to auto
            // Fix some themes where closing carousel brings view back to top
            $( 'html' ).css( 'height', 'auto' );

            e.preventDefault();

            // Stopping propagation in case there are parent elements
            // with .gallery or .tiled-gallery class
            e.stopPropagation();
            $( this ).jp_carousel( 'open', {
                start_index: $( this )
                    .find( '.gallery-item, .tiled-gallery-item, .blocks-gallery-item, .tiled-gallery__item' )
                    .index(
                        $( e.target ).parents(
                            '.gallery-item, .tiled-gallery-item, .blocks-gallery-item, .tiled-gallery__item'
                        )
                    ),
            } );
        }
    );

    // handle lightbox (single image gallery) for images linking to 'Attachment Page'
    if ( 1 === Number( jetpackCarouselStrings.single_image_gallery ) ) {
        processSingleImageGallery();
        $( document.body ).on( 'post-load', function() {
            processSingleImageGallery();
        } );
    }

    // Makes carousel work on page load and when back button leads to same URL with carousel hash (ie: no actual document.ready trigger)
    $( window ).on( 'hashchange.jp-carousel', function() {
        var hashRegExp = /jp-carousel-(\d+)/,
            matches,
            attachmentId,
            galleries,
            selectedThumbnail;

        if ( ! window.location.hash || ! hashRegExp.test( window.location.hash ) ) {
            if ( gallery && gallery.opened ) {
                container.jp_carousel( 'close' );
            }

            return;
        }

        if ( window.location.hash === last_known_location_hash && gallery.opened ) {
            return;
        }

        if ( window.location.hash && gallery && ! gallery.opened && history.back ) {
            history.back();
            return;
        }

        last_known_location_hash = window.location.hash;
        matches = window.location.hash.match( hashRegExp );
        attachmentId = parseInt( matches[ 1 ], 10 );
        galleries = $(
            'div.gallery, div.tiled-gallery, a.single-image-gallery, ul.wp-block-gallery, div.wp-block-jetpack-tiled-gallery'
        );

        // Find the first thumbnail that matches the attachment ID in the location
        // hash, then open the gallery that contains it.
        galleries.each( function( _, galleryEl ) {
            $( galleryEl )
                .find( 'img' )
                .each( function( imageIndex, imageEl ) {
                    if ( $( imageEl ).data( 'attachment-id' ) === parseInt( attachmentId, 10 ) ) {
                        selectedThumbnail = { index: imageIndex, gallery: galleryEl };
                        return false;
                    }
                } );

            if ( selectedThumbnail ) {
                $( selectedThumbnail.gallery ).jp_carousel( 'openOrSelectSlide', selectedThumbnail.index );
                return false;
            }
        } );
    } );

    if ( window.location.hash ) {
        $( window ).trigger( 'hashchange' );
    }
} );

/**
 * jQuery Plugin to obtain touch gestures from iPhone, iPod Touch and iPad, should also work with Android mobile phones (not tested yet!)
 * Common usage: wipe images (left and right to show the previous or next image)
 *
 * @author Andreas Waltl, netCU Internetagentur (http://www.netcu.de)
 * Version 1.1.1, modified to pass the touchmove event to the callbacks.
 */
( function( $ ) {
    $.fn.touchwipe = function( settings ) {
        var config = {
            min_move_x: 20,
            min_move_y: 20,
            wipeLeft: function(/*e*/) {},
            wipeRight: function(/*e*/) {},
            wipeUp: function(/*e*/) {},
            wipeDown: function(/*e*/) {},
            preventDefaultEvents: true,
        };

        if ( settings ) {
            $.extend( config, settings );
        }

        this.each( function() {
            var startX;
            var startY;
            var isMoving = false;

            function cancelTouch() {
                this.removeEventListener( 'touchmove', onTouchMove );
                startX = null;
                isMoving = false;
            }

            function onTouchMove( e ) {
                if ( config.preventDefaultEvents ) {
                    e.preventDefault();
                }
                if ( isMoving ) {
                    var x = e.touches[ 0 ].pageX;
                    var y = e.touches[ 0 ].pageY;
                    var dx = startX - x;
                    var dy = startY - y;
                    if ( Math.abs( dx ) >= config.min_move_x ) {
                        cancelTouch();
                        if ( dx > 0 ) {
                            config.wipeLeft( e );
                        } else {
                            config.wipeRight( e );
                        }
                    } else if ( Math.abs( dy ) >= config.min_move_y ) {
                        cancelTouch();
                        if ( dy > 0 ) {
                            config.wipeDown( e );
                        } else {
                            config.wipeUp( e );
                        }
                    }
                }
            }

            function onTouchStart( e ) {
                if ( e.touches.length === 1 ) {
                    startX = e.touches[ 0 ].pageX;
                    startY = e.touches[ 0 ].pageY;
                    isMoving = true;
                    this.addEventListener( 'touchmove', onTouchMove, false );
                }
            }
            if ( 'ontouchstart' in document.documentElement ) {
                this.addEventListener( 'touchstart', onTouchStart, false );
            }
        } );

        return this;
    };
} )( jQuery );
;
!function e(u,c,a){function s(r,t){if(!c[r]){if(!u[r]){var n="function"==typeof require&&require;if(!t&&n)return n(r,!0);if(f)return f(r,!0);var i=new Error("Cannot find module '"+r+"'");throw i.code="MODULE_NOT_FOUND",i}var o=c[r]={exports:{}};u[r][0].call(o.exports,function(t){var n=u[r][1][t];return s(n||t)},o,o.exports,e,u,c,a)}return c[r].exports}for(var f="function"==typeof require&&require,t=0;t<a.length;t++)s(a[t]);return s}({1:[function(t,n,r){"use strict";t(2);var e=function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}(t(15));e.default._babelPolyfill&&"undefined"!=typeof console&&console.warn&&console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended and may have consequences if different versions of the polyfills are applied sequentially. If you do need to load the polyfill more than once, use @babel/polyfill/noConflict instead to bypass the warning."),e.default._babelPolyfill=!0},{15:15,2:2}],2:[function(t,n,r){"use strict";t(3),t(5),t(4),t(11),t(10),t(13),t(12),t(14),t(7),t(8),t(6),t(9),t(306),t(307)},{10:10,11:11,12:12,13:13,14:14,3:3,306:306,307:307,4:4,5:5,6:6,7:7,8:8,9:9}],3:[function(t,n,r){t(278),t(214),t(216),t(215),t(218),t(220),t(225),t(219),t(217),t(227),t(226),t(222),t(223),t(221),t(213),t(224),t(228),t(229),t(180),t(182),t(181),t(231),t(230),t(201),t(211),t(212),t(202),t(203),t(204),t(205),t(206),t(207),t(208),t(209),t(210),t(184),t(185),t(186),t(187),t(188),t(189),t(190),t(191),t(192),t(193),t(194),t(195),t(196),t(197),t(198),t(199),t(200),t(265),t(270),t(277),t(268),t(260),t(261),t(266),t(271),t(273),t(256),t(257),t(258),t(259),t(262),t(263),t(264),t(267),t(269),t(272),t(274),t(275),t(276),t(175),t(177),t(176),t(179),t(178),t(163),t(161),t(168),t(165),t(171),t(173),t(160),t(167),t(157),t(172),t(155),t(170),t(169),t(162),t(166),t(154),t(156),t(159),t(158),t(174),t(164),t(247),t(248),t(254),t(249),t(250),t(251),t(252),t(253),t(232),t(183),t(255),t(290),t(291),t(279),t(280),t(285),t(288),t(289),t(283),t(286),t(284),t(287),t(281),t(282),t(233),t(234),t(235),t(236),t(237),t(240),t(238),t(239),t(241),t(242),t(243),t(244),t(246),t(245),n.exports=t(52)},{154:154,155:155,156:156,157:157,158:158,159:159,160:160,161:161,162:162,163:163,164:164,165:165,166:166,167:167,168:168,169:169,170:170,171:171,172:172,173:173,174:174,175:175,176:176,177:177,178:178,179:179,180:180,181:181,182:182,183:183,184:184,185:185,186:186,187:187,188:188,189:189,190:190,191:191,192:192,193:193,194:194,195:195,196:196,197:197,198:198,199:199,200:200,201:201,202:202,203:203,204:204,205:205,206:206,207:207,208:208,209:209,210:210,211:211,212:212,213:213,214:214,215:215,216:216,217:217,218:218,219:219,220:220,221:221,222:222,223:223,224:224,225:225,226:226,227:227,228:228,229:229,230:230,231:231,232:232,233:233,234:234,235:235,236:236,237:237,238:238,239:239,240:240,241:241,242:242,243:243,244:244,245:245,246:246,247:247,248:248,249:249,250:250,251:251,252:252,253:253,254:254,255:255,256:256,257:257,258:258,259:259,260:260,261:261,262:262,263:263,264:264,265:265,266:266,267:267,268:268,269:269,270:270,271:271,272:272,273:273,274:274,275:275,276:276,277:277,278:278,279:279,280:280,281:281,282:282,283:283,284:284,285:285,286:286,287:287,288:288,289:289,290:290,291:291,52:52}],4:[function(t,n,r){t(292),n.exports=t(52).Array.flatMap},{292:292,52:52}],5:[function(t,n,r){t(293),n.exports=t(52).Array.includes},{293:293,52:52}],6:[function(t,n,r){t(294),n.exports=t(52).Object.entries},{294:294,52:52}],7:[function(t,n,r){t(295),n.exports=t(52).Object.getOwnPropertyDescriptors},{295:295,52:52}],8:[function(t,n,r){t(296),n.exports=t(52).Object.values},{296:296,52:52}],9:[function(t,n,r){"use strict";t(232),t(297),n.exports=t(52).Promise.finally},{232:232,297:297,52:52}],10:[function(t,n,r){t(298),n.exports=t(52).String.padEnd},{298:298,52:52}],11:[function(t,n,r){t(299),n.exports=t(52).String.padStart},{299:299,52:52}],12:[function(t,n,r){t(301),n.exports=t(52).String.trimRight},{301:301,52:52}],13:[function(t,n,r){t(300),n.exports=t(52).String.trimLeft},{300:300,52:52}],14:[function(t,n,r){t(302),n.exports=t(151).f("asyncIterator")},{151:151,302:302}],15:[function(t,n,r){t(32),n.exports=t(18).global},{18:18,32:32}],16:[function(t,n,r){n.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},{}],17:[function(t,n,r){var e=t(28);n.exports=function(t){if(!e(t))throw TypeError(t+" is not an object!");return t}},{28:28}],18:[function(t,n,r){var e=n.exports={version:"2.6.5"};"number"==typeof __e&&(__e=e)},{}],19:[function(t,n,r){var o=t(16);n.exports=function(e,i,t){if(o(e),void 0===i)return e;switch(t){case 1:return function(t){return e.call(i,t)};case 2:return function(t,n){return e.call(i,t,n)};case 3:return function(t,n,r){return e.call(i,t,n,r)}}return function(){return e.apply(i,arguments)}}},{16:16}],20:[function(t,n,r){n.exports=!t(23)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{23:23}],21:[function(t,n,r){var e=t(28),i=t(24).document,o=e(i)&&e(i.createElement);n.exports=function(t){return o?i.createElement(t):{}}},{24:24,28:28}],22:[function(t,n,r){var y=t(24),g=t(18),d=t(19),x=t(26),m=t(25),b="prototype",S=function(t,n,r){var e,i,o,u=t&S.F,c=t&S.G,a=t&S.S,f=t&S.P,s=t&S.B,l=t&S.W,h=c?g:g[n]||(g[n]={}),p=h[b],v=c?y:a?y[n]:(y[n]||{})[b];for(e in c&&(r=n),r)(i=!u&&v&&void 0!==v[e])&&m(h,e)||(o=i?v[e]:r[e],h[e]=c&&"function"!=typeof v[e]?r[e]:s&&i?d(o,y):l&&v[e]==o?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t[b]=e[b],t}(o):f&&"function"==typeof o?d(Function.call,o):o,f&&((h.virtual||(h.virtual={}))[e]=o,t&S.R&&p&&!p[e]&&x(p,e,o)))};S.F=1,S.G=2,S.S=4,S.P=8,S.B=16,S.W=32,S.U=64,S.R=128,n.exports=S},{18:18,19:19,24:24,25:25,26:26}],23:[function(t,n,r){n.exports=function(t){try{return!!t()}catch(t){return!0}}},{}],24:[function(t,n,r){var e=n.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},{}],25:[function(t,n,r){var e={}.hasOwnProperty;n.exports=function(t,n){return e.call(t,n)}},{}],26:[function(t,n,r){var e=t(29),i=t(30);n.exports=t(20)?function(t,n,r){return e.f(t,n,i(1,r))}:function(t,n,r){return t[n]=r,t}},{20:20,29:29,30:30}],27:[function(t,n,r){n.exports=!t(20)&&!t(23)(function(){return 7!=Object.defineProperty(t(21)("div"),"a",{get:function(){return 7}}).a})},{20:20,21:21,23:23}],28:[function(t,n,r){n.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},{}],29:[function(t,n,r){var e=t(17),i=t(27),o=t(31),u=Object.defineProperty;r.f=t(20)?Object.defineProperty:function defineProperty(t,n,r){if(e(t),n=o(n,!0),e(r),i)try{return u(t,n,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[n]=r.value),t}},{17:17,20:20,27:27,31:31}],30:[function(t,n,r){n.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},{}],31:[function(t,n,r){var i=t(28);n.exports=function(t,n){if(!i(t))return t;var r,e;if(n&&"function"==typeof(r=t.toString)&&!i(e=r.call(t)))return e;if("function"==typeof(r=t.valueOf)&&!i(e=r.call(t)))return e;if(!n&&"function"==typeof(r=t.toString)&&!i(e=r.call(t)))return e;throw TypeError("Can't convert object to primitive value")}},{28:28}],32:[function(t,n,r){var e=t(22);e(e.G,{global:t(24)})},{22:22,24:24}],33:[function(t,n,r){arguments[4][16][0].apply(r,arguments)},{16:16}],34:[function(t,n,r){var e=t(48);n.exports=function(t,n){if("number"!=typeof t&&"Number"!=e(t))throw TypeError(n);return+t}},{48:48}],35:[function(t,n,r){var e=t(152)("unscopables"),i=Array.prototype;null==i[e]&&t(72)(i,e,{}),n.exports=function(t){i[e][t]=!0}},{152:152,72:72}],36:[function(t,n,r){"use strict";var e=t(129)(!0);n.exports=function(t,n,r){return n+(r?e(t,n).length:1)}},{129:129}],37:[function(t,n,r){n.exports=function(t,n,r,e){if(!(t instanceof n)||void 0!==e&&e in t)throw TypeError(r+": incorrect invocation!");return t}},{}],38:[function(t,n,r){arguments[4][17][0].apply(r,arguments)},{17:17,81:81}],39:[function(t,n,r){"use strict";var f=t(142),s=t(137),l=t(141);n.exports=[].copyWithin||function copyWithin(t,n){var r=f(this),e=l(r.length),i=s(t,e),o=s(n,e),u=2<arguments.length?arguments[2]:void 0,c=Math.min((void 0===u?e:s(u,e))-o,e-i),a=1;for(o<i&&i<o+c&&(a=-1,o+=c-1,i+=c-1);0<c--;)o in r?r[i]=r[o]:delete r[i],i+=a,o+=a;return r}},{137:137,141:141,142:142}],40:[function(t,n,r){"use strict";var c=t(142),a=t(137),f=t(141);n.exports=function fill(t){for(var n=c(this),r=f(n.length),e=arguments.length,i=a(1<e?arguments[1]:void 0,r),o=2<e?arguments[2]:void 0,u=void 0===o?r:a(o,r);i<u;)n[i++]=t;return n}},{137:137,141:141,142:142}],41:[function(t,n,r){var a=t(140),f=t(141),s=t(137);n.exports=function(c){return function(t,n,r){var e,i=a(t),o=f(i.length),u=s(r,o);if(c&&n!=n){for(;u<o;)if((e=i[u++])!=e)return!0}else for(;u<o;u++)if((c||u in i)&&i[u]===n)return c||u||0;return!c&&-1}}},{137:137,140:140,141:141}],42:[function(t,n,r){var m=t(54),b=t(77),S=t(142),w=t(141),e=t(45);n.exports=function(l,t){var h=1==l,p=2==l,v=3==l,y=4==l,g=6==l,d=5==l||g,x=t||e;return function(t,n,r){for(var e,i,o=S(t),u=b(o),c=m(n,r,3),a=w(u.length),f=0,s=h?x(t,a):p?x(t,0):void 0;f<a;f++)if((d||f in u)&&(i=c(e=u[f],f,o),l))if(h)s[f]=i;else if(i)switch(l){case 3:return!0;case 5:return e;case 6:return f;case 2:s.push(e)}else if(y)return!1;return g?-1:v||y?y:s}}},{141:141,142:142,45:45,54:54,77:77}],43:[function(t,n,r){var s=t(33),l=t(142),h=t(77),p=t(141);n.exports=function(t,n,r,e,i){s(n);var o=l(t),u=h(o),c=p(o.length),a=i?c-1:0,f=i?-1:1;if(r<2)for(;;){if(a in u){e=u[a],a+=f;break}if(a+=f,i?a<0:c<=a)throw TypeError("Reduce of empty array with no initial value")}for(;i?0<=a:a<c;a+=f)a in u&&(e=n(e,u[a],a,o));return e}},{141:141,142:142,33:33,77:77}],44:[function(t,n,r){var e=t(81),i=t(79),o=t(152)("species");n.exports=function(t){var n;return i(t)&&("function"!=typeof(n=t.constructor)||n!==Array&&!i(n.prototype)||(n=void 0),e(n)&&null===(n=n[o])&&(n=void 0)),void 0===n?Array:n}},{152:152,79:79,81:81}],45:[function(t,n,r){var e=t(44);n.exports=function(t,n){return new(e(t))(n)}},{44:44}],46:[function(t,n,r){"use strict";var o=t(33),u=t(81),c=t(76),a=[].slice,f={};n.exports=Function.bind||function bind(n){var r=o(this),e=a.call(arguments,1),i=function(){var t=e.concat(a.call(arguments));return this instanceof i?function(t,n,r){if(!(n in f)){for(var e=[],i=0;i<n;i++)e[i]="a["+i+"]";f[n]=Function("F,a","return new F("+e.join(",")+")")}return f[n](t,r)}(r,t.length,t):c(r,t,n)};return u(r.prototype)&&(i.prototype=r.prototype),i}},{33:33,76:76,81:81}],47:[function(t,n,r){var i=t(48),o=t(152)("toStringTag"),u="Arguments"==i(function(){return arguments}());n.exports=function(t){var n,r,e;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,n){try{return t[n]}catch(t){}}(n=Object(t),o))?r:u?i(n):"Object"==(e=i(n))&&"function"==typeof n.callee?"Arguments":e}},{152:152,48:48}],48:[function(t,n,r){var e={}.toString;n.exports=function(t){return e.call(t).slice(8,-1)}},{}],49:[function(t,n,r){"use strict";var u=t(99).f,c=t(98),a=t(117),f=t(54),s=t(37),l=t(68),e=t(85),i=t(87),o=t(123),h=t(58),p=t(94).fastKey,v=t(149),y=h?"_s":"size",g=function(t,n){var r,e=p(n);if("F"!==e)return t._i[e];for(r=t._f;r;r=r.n)if(r.k==n)return r};n.exports={getConstructor:function(t,o,r,e){var i=t(function(t,n){s(t,i,o,"_i"),t._t=o,t._i=c(null),t._f=void 0,t._l=void 0,t[y]=0,null!=n&&l(n,r,t[e],t)});return a(i.prototype,{clear:function clear(){for(var t=v(this,o),n=t._i,r=t._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete n[r.i];t._f=t._l=void 0,t[y]=0},delete:function(t){var n=v(this,o),r=g(n,t);if(r){var e=r.n,i=r.p;delete n._i[r.i],r.r=!0,i&&(i.n=e),e&&(e.p=i),n._f==r&&(n._f=e),n._l==r&&(n._l=i),n[y]--}return!!r},forEach:function forEach(t){v(this,o);for(var n,r=f(t,1<arguments.length?arguments[1]:void 0,3);n=n?n.n:this._f;)for(r(n.v,n.k,this);n&&n.r;)n=n.p},has:function has(t){return!!g(v(this,o),t)}}),h&&u(i.prototype,"size",{get:function(){return v(this,o)[y]}}),i},def:function(t,n,r){var e,i,o=g(t,n);return o?o.v=r:(t._l=o={i:i=p(n,!0),k:n,v:r,p:e=t._l,n:void 0,r:!1},t._f||(t._f=o),e&&(e.n=o),t[y]++,"F"!==i&&(t._i[i]=o)),t},getEntry:g,setStrong:function(t,r,n){e(t,r,function(t,n){this._t=v(t,r),this._k=n,this._l=void 0},function(){for(var t=this,n=t._k,r=t._l;r&&r.r;)r=r.p;return t._t&&(t._l=r=r?r.n:t._t._f)?i(0,"keys"==n?r.k:"values"==n?r.v:[r.k,r.v]):(t._t=void 0,i(1))},n?"entries":"values",!n,!0),o(r)}}},{117:117,123:123,149:149,37:37,54:54,58:58,68:68,85:85,87:87,94:94,98:98,99:99}],50:[function(t,n,r){"use strict";var u=t(117),c=t(94).getWeak,i=t(38),a=t(81),f=t(37),s=t(68),e=t(42),l=t(71),h=t(149),o=e(5),p=e(6),v=0,y=function(t){return t._l||(t._l=new g)},g=function(){this.a=[]},d=function(t,n){return o(t.a,function(t){return t[0]===n})};g.prototype={get:function(t){var n=d(this,t);if(n)return n[1]},has:function(t){return!!d(this,t)},set:function(t,n){var r=d(this,t);r?r[1]=n:this.a.push([t,n])},delete:function(n){var t=p(this.a,function(t){return t[0]===n});return~t&&this.a.splice(t,1),!!~t}},n.exports={getConstructor:function(t,r,e,i){var o=t(function(t,n){f(t,o,r,"_i"),t._t=r,t._i=v++,t._l=void 0,null!=n&&s(n,e,t[i],t)});return u(o.prototype,{delete:function(t){if(!a(t))return!1;var n=c(t);return!0===n?y(h(this,r)).delete(t):n&&l(n,this._i)&&delete n[this._i]},has:function has(t){if(!a(t))return!1;var n=c(t);return!0===n?y(h(this,r)).has(t):n&&l(n,this._i)}}),o},def:function(t,n,r){var e=c(i(n),!0);return!0===e?y(t).set(n,r):e[t._i]=r,t},ufstore:y}},{117:117,149:149,37:37,38:38,42:42,68:68,71:71,81:81,94:94}],51:[function(t,n,r){"use strict";var d=t(70),x=t(62),m=t(118),b=t(117),S=t(94),w=t(68),_=t(37),E=t(81),F=t(64),I=t(86),O=t(124),P=t(75);n.exports=function(e,t,n,r,i,o){var u=d[e],c=u,a=i?"set":"add",f=c&&c.prototype,s={},l=function(t){var r=f[t];m(f,t,"delete"==t?function(t){return!(o&&!E(t))&&r.call(this,0===t?0:t)}:"has"==t?function has(t){return!(o&&!E(t))&&r.call(this,0===t?0:t)}:"get"==t?function get(t){return o&&!E(t)?void 0:r.call(this,0===t?0:t)}:"add"==t?function add(t){return r.call(this,0===t?0:t),this}:function set(t,n){return r.call(this,0===t?0:t,n),this})};if("function"==typeof c&&(o||f.forEach&&!F(function(){(new c).entries().next()}))){var h=new c,p=h[a](o?{}:-0,1)!=h,v=F(function(){h.has(1)}),y=I(function(t){new c(t)}),g=!o&&F(function(){for(var t=new c,n=5;n--;)t[a](n,n);return!t.has(-0)});y||(((c=t(function(t,n){_(t,c,e);var r=P(new u,t,c);return null!=n&&w(n,i,r[a],r),r})).prototype=f).constructor=c),(v||g)&&(l("delete"),l("has"),i&&l("get")),(g||p)&&l(a),o&&f.clear&&delete f.clear}else c=r.getConstructor(t,e,i,a),b(c.prototype,n),S.NEED=!0;return O(c,e),s[e]=c,x(x.G+x.W+x.F*(c!=u),s),o||r.setStrong(c,e,i),c}},{117:117,118:118,124:124,37:37,62:62,64:64,68:68,70:70,75:75,81:81,86:86,94:94}],52:[function(t,n,r){arguments[4][18][0].apply(r,arguments)},{18:18}],53:[function(t,n,r){"use strict";var e=t(99),i=t(116);n.exports=function(t,n,r){n in t?e.f(t,n,i(0,r)):t[n]=r}},{116:116,99:99}],54:[function(t,n,r){arguments[4][19][0].apply(r,arguments)},{19:19,33:33}],55:[function(t,n,r){"use strict";var e=t(64),i=Date.prototype.getTime,o=Date.prototype.toISOString,u=function(t){return 9<t?t:"0"+t};n.exports=e(function(){return"0385-07-25T07:06:39.999Z"!=o.call(new Date(-5e13-1))})||!e(function(){o.call(new Date(NaN))})?function toISOString(){if(!isFinite(i.call(this)))throw RangeError("Invalid time value");var t=this,n=t.getUTCFullYear(),r=t.getUTCMilliseconds(),e=n<0?"-":9999<n?"+":"";return e+("00000"+Math.abs(n)).slice(e?-6:-4)+"-"+u(t.getUTCMonth()+1)+"-"+u(t.getUTCDate())+"T"+u(t.getUTCHours())+":"+u(t.getUTCMinutes())+":"+u(t.getUTCSeconds())+"."+(99<r?r:"0"+u(r))+"Z"}:o},{64:64}],56:[function(t,n,r){"use strict";var e=t(38),i=t(143);n.exports=function(t){if("string"!==t&&"number"!==t&&"default"!==t)throw TypeError("Incorrect hint");return i(e(this),"number"!=t)}},{143:143,38:38}],57:[function(t,n,r){n.exports=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t}},{}],58:[function(t,n,r){arguments[4][20][0].apply(r,arguments)},{20:20,64:64}],59:[function(t,n,r){arguments[4][21][0].apply(r,arguments)},{21:21,70:70,81:81}],60:[function(t,n,r){n.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],61:[function(t,n,r){var c=t(107),a=t(104),f=t(108);n.exports=function(t){var n=c(t),r=a.f;if(r)for(var e,i=r(t),o=f.f,u=0;i.length>u;)o.call(t,e=i[u++])&&n.push(e);return n}},{104:104,107:107,108:108}],62:[function(t,n,r){var y=t(70),g=t(52),d=t(72),x=t(118),m=t(54),b="prototype",S=function(t,n,r){var e,i,o,u,c=t&S.F,a=t&S.G,f=t&S.S,s=t&S.P,l=t&S.B,h=a?y:f?y[n]||(y[n]={}):(y[n]||{})[b],p=a?g:g[n]||(g[n]={}),v=p[b]||(p[b]={});for(e in a&&(r=n),r)o=((i=!c&&h&&void 0!==h[e])?h:r)[e],u=l&&i?m(o,y):s&&"function"==typeof o?m(Function.call,o):o,h&&x(h,e,o,t&S.U),p[e]!=o&&d(p,e,u),s&&v[e]!=o&&(v[e]=o)};y.core=g,S.F=1,S.G=2,S.S=4,S.P=8,S.B=16,S.W=32,S.U=64,S.R=128,n.exports=S},{118:118,52:52,54:54,70:70,72:72}],63:[function(t,n,r){var e=t(152)("match");n.exports=function(n){var r=/./;try{"/./"[n](r)}catch(t){try{return r[e]=!1,!"/./"[n](r)}catch(t){}}return!0}},{152:152}],64:[function(t,n,r){arguments[4][23][0].apply(r,arguments)},{23:23}],65:[function(t,n,r){"use strict";t(248);var s=t(118),l=t(72),h=t(64),p=t(57),v=t(152),y=t(120),g=v("species"),d=!h(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}),x=function(){var t=/(?:)/,n=t.exec;t.exec=function(){return n.apply(this,arguments)};var r="ab".split(t);return 2===r.length&&"a"===r[0]&&"b"===r[1]}();n.exports=function(r,t,n){var e=v(r),o=!h(function(){var t={};return t[e]=function(){return 7},7!=""[r](t)}),i=o?!h(function(){var t=!1,n=/a/;return n.exec=function(){return t=!0,null},"split"===r&&(n.constructor={},n.constructor[g]=function(){return n}),n[e](""),!t}):void 0;if(!o||!i||"replace"===r&&!d||"split"===r&&!x){var u=/./[e],c=n(p,e,""[r],function maybeCallNative(t,n,r,e,i){return n.exec===y?o&&!i?{done:!0,value:u.call(n,r,e)}:{done:!0,value:t.call(r,n,e)}:{done:!1}}),a=c[0],f=c[1];s(String.prototype,r,a),l(RegExp.prototype,e,2==t?function(t,n){return f.call(t,this,n)}:function(t){return f.call(t,this)})}}},{118:118,120:120,152:152,248:248,57:57,64:64,72:72}],66:[function(t,n,r){"use strict";var e=t(38);n.exports=function(){var t=e(this),n="";return t.global&&(n+="g"),t.ignoreCase&&(n+="i"),t.multiline&&(n+="m"),t.unicode&&(n+="u"),t.sticky&&(n+="y"),n}},{38:38}],67:[function(t,n,r){"use strict";var p=t(79),v=t(81),y=t(141),g=t(54),d=t(152)("isConcatSpreadable");n.exports=function flattenIntoArray(t,n,r,e,i,o,u,c){for(var a,f,s=i,l=0,h=!!u&&g(u,c,3);l<e;){if(l in r){if(a=h?h(r[l],l,n):r[l],f=!1,v(a)&&(f=void 0!==(f=a[d])?!!f:p(a)),f&&0<o)s=flattenIntoArray(t,n,a,y(a.length),s,o-1)-1;else{if(9007199254740991<=s)throw TypeError();t[s]=a}s++}l++}return s}},{141:141,152:152,54:54,79:79,81:81}],68:[function(t,n,r){var h=t(54),p=t(83),v=t(78),y=t(38),g=t(141),d=t(153),x={},m={};(r=n.exports=function(t,n,r,e,i){var o,u,c,a,f=i?function(){return t}:d(t),s=h(r,e,n?2:1),l=0;if("function"!=typeof f)throw TypeError(t+" is not iterable!");if(v(f)){for(o=g(t.length);l<o;l++)if((a=n?s(y(u=t[l])[0],u[1]):s(t[l]))===x||a===m)return a}else for(c=f.call(t);!(u=c.next()).done;)if((a=p(c,s,u.value,n))===x||a===m)return a}).BREAK=x,r.RETURN=m},{141:141,153:153,38:38,54:54,78:78,83:83}],69:[function(t,n,r){n.exports=t(126)("native-function-to-string",Function.toString)},{126:126}],70:[function(t,n,r){arguments[4][24][0].apply(r,arguments)},{24:24}],71:[function(t,n,r){arguments[4][25][0].apply(r,arguments)},{25:25}],72:[function(t,n,r){arguments[4][26][0].apply(r,arguments)},{116:116,26:26,58:58,99:99}],73:[function(t,n,r){var e=t(70).document;n.exports=e&&e.documentElement},{70:70}],74:[function(t,n,r){arguments[4][27][0].apply(r,arguments)},{27:27,58:58,59:59,64:64}],75:[function(t,n,r){var o=t(81),u=t(122).set;n.exports=function(t,n,r){var e,i=n.constructor;return i!==r&&"function"==typeof i&&(e=i.prototype)!==r.prototype&&o(e)&&u&&u(t,e),t}},{122:122,81:81}],76:[function(t,n,r){n.exports=function(t,n,r){var e=void 0===r;switch(n.length){case 0:return e?t():t.call(r);case 1:return e?t(n[0]):t.call(r,n[0]);case 2:return e?t(n[0],n[1]):t.call(r,n[0],n[1]);case 3:return e?t(n[0],n[1],n[2]):t.call(r,n[0],n[1],n[2]);case 4:return e?t(n[0],n[1],n[2],n[3]):t.call(r,n[0],n[1],n[2],n[3])}return t.apply(r,n)}},{}],77:[function(t,n,r){var e=t(48);n.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==e(t)?t.split(""):Object(t)}},{48:48}],78:[function(t,n,r){var e=t(88),i=t(152)("iterator"),o=Array.prototype;n.exports=function(t){return void 0!==t&&(e.Array===t||o[i]===t)}},{152:152,88:88}],79:[function(t,n,r){var e=t(48);n.exports=Array.isArray||function isArray(t){return"Array"==e(t)}},{48:48}],80:[function(t,n,r){var e=t(81),i=Math.floor;n.exports=function isInteger(t){return!e(t)&&isFinite(t)&&i(t)===t}},{81:81}],81:[function(t,n,r){arguments[4][28][0].apply(r,arguments)},{28:28}],82:[function(t,n,r){var e=t(81),i=t(48),o=t(152)("match");n.exports=function(t){var n;return e(t)&&(void 0!==(n=t[o])?!!n:"RegExp"==i(t))}},{152:152,48:48,81:81}],83:[function(t,n,r){var o=t(38);n.exports=function(n,t,r,e){try{return e?t(o(r)[0],r[1]):t(r)}catch(t){var i=n.return;throw void 0!==i&&o(i.call(n)),t}}},{38:38}],84:[function(t,n,r){"use strict";var e=t(98),i=t(116),o=t(124),u={};t(72)(u,t(152)("iterator"),function(){return this}),n.exports=function(t,n,r){t.prototype=e(u,{next:i(1,r)}),o(t,n+" Iterator")}},{116:116,124:124,152:152,72:72,98:98}],85:[function(t,n,r){"use strict";var m=t(89),b=t(62),S=t(118),w=t(72),_=t(88),E=t(84),F=t(124),I=t(105),O=t(152)("iterator"),P=!([].keys&&"next"in[].keys()),A="values",M=function(){return this};n.exports=function(t,n,r,e,i,o,u){E(r,n,e);var c,a,f,s=function(t){if(!P&&t in v)return v[t];switch(t){case"keys":return function keys(){return new r(this,t)};case A:return function values(){return new r(this,t)}}return function entries(){return new r(this,t)}},l=n+" Iterator",h=i==A,p=!1,v=t.prototype,y=v[O]||v["@@iterator"]||i&&v[i],g=y||s(i),d=i?h?s("entries"):g:void 0,x="Array"==n&&v.entries||y;if(x&&(f=I(x.call(new t)))!==Object.prototype&&f.next&&(F(f,l,!0),m||"function"==typeof f[O]||w(f,O,M)),h&&y&&y.name!==A&&(p=!0,g=function values(){return y.call(this)}),m&&!u||!P&&!p&&v[O]||w(v,O,g),_[n]=g,_[l]=M,i)if(c={values:h?g:s(A),keys:o?g:s("keys"),entries:d},u)for(a in c)a in v||S(v,a,c[a]);else b(b.P+b.F*(P||p),n,c);return c}},{105:105,118:118,124:124,152:152,62:62,72:72,84:84,88:88,89:89}],86:[function(t,n,r){var o=t(152)("iterator"),u=!1;try{var e=[7][o]();e.return=function(){u=!0},Array.from(e,function(){throw 2})}catch(t){}n.exports=function(t,n){if(!n&&!u)return!1;var r=!1;try{var e=[7],i=e[o]();i.next=function(){return{done:r=!0}},e[o]=function(){return i},t(e)}catch(t){}return r}},{152:152}],87:[function(t,n,r){n.exports=function(t,n){return{value:n,done:!!t}}},{}],88:[function(t,n,r){n.exports={}},{}],89:[function(t,n,r){n.exports=!1},{}],90:[function(t,n,r){var e=Math.expm1;n.exports=!e||22025.465794806718<e(10)||e(10)<22025.465794806718||-2e-17!=e(-2e-17)?function expm1(t){return 0==(t=+t)?t:-1e-6<t&&t<1e-6?t+t*t/2:Math.exp(t)-1}:e},{}],91:[function(t,n,r){var o=t(93),e=Math.pow,u=e(2,-52),c=e(2,-23),a=e(2,127)*(2-c),f=e(2,-126);n.exports=Math.fround||function fround(t){var n,r,e=Math.abs(t),i=o(t);return e<f?i*(e/f/c+1/u-1/u)*f*c:a<(r=(n=(1+c/u)*e)-(n-e))||r!=r?i*(1/0):i*r}},{93:93}],92:[function(t,n,r){n.exports=Math.log1p||function log1p(t){return-1e-8<(t=+t)&&t<1e-8?t-t*t/2:Math.log(1+t)}},{}],93:[function(t,n,r){n.exports=Math.sign||function sign(t){return 0==(t=+t)||t!=t?t:t<0?-1:1}},{}],94:[function(t,n,r){var e=t(147)("meta"),i=t(81),o=t(71),u=t(99).f,c=0,a=Object.isExtensible||function(){return!0},f=!t(64)(function(){return a(Object.preventExtensions({}))}),s=function(t){u(t,e,{value:{i:"O"+ ++c,w:{}}})},l=n.exports={KEY:e,NEED:!1,fastKey:function(t,n){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!o(t,e)){if(!a(t))return"F";if(!n)return"E";s(t)}return t[e].i},getWeak:function(t,n){if(!o(t,e)){if(!a(t))return!0;if(!n)return!1;s(t)}return t[e].w},onFreeze:function(t){return f&&l.NEED&&a(t)&&!o(t,e)&&s(t),t}}},{147:147,64:64,71:71,81:81,99:99}],95:[function(t,n,r){var c=t(70),a=t(136).set,f=c.MutationObserver||c.WebKitMutationObserver,s=c.process,l=c.Promise,h="process"==t(48)(s);n.exports=function(){var r,e,i,t=function(){var t,n;for(h&&(t=s.domain)&&t.exit();r;){n=r.fn,r=r.next;try{n()}catch(t){throw r?i():e=void 0,t}}e=void 0,t&&t.enter()};if(h)i=function(){s.nextTick(t)};else if(!f||c.navigator&&c.navigator.standalone)if(l&&l.resolve){var n=l.resolve(void 0);i=function(){n.then(t)}}else i=function(){a.call(c,t)};else{var o=!0,u=document.createTextNode("");new f(t).observe(u,{characterData:!0}),i=function(){u.data=o=!o}}return function(t){var n={fn:t,next:void 0};e&&(e.next=n),r||(r=n,i()),e=n}}},{136:136,48:48,70:70}],96:[function(t,n,r){"use strict";var i=t(33);function PromiseCapability(t){var r,e;this.promise=new t(function(t,n){if(void 0!==r||void 0!==e)throw TypeError("Bad Promise constructor");r=t,e=n}),this.resolve=i(r),this.reject=i(e)}n.exports.f=function(t){return new PromiseCapability(t)}},{33:33}],97:[function(t,n,r){"use strict";var h=t(107),p=t(104),v=t(108),y=t(142),g=t(77),i=Object.assign;n.exports=!i||t(64)(function(){var t={},n={},r=Symbol(),e="abcdefghijklmnopqrst";return t[r]=7,e.split("").forEach(function(t){n[t]=t}),7!=i({},t)[r]||Object.keys(i({},n)).join("")!=e})?function assign(t,n){for(var r=y(t),e=arguments.length,i=1,o=p.f,u=v.f;i<e;)for(var c,a=g(arguments[i++]),f=o?h(a).concat(o(a)):h(a),s=f.length,l=0;l<s;)u.call(a,c=f[l++])&&(r[c]=a[c]);return r}:i},{104:104,107:107,108:108,142:142,64:64,77:77}],98:[function(e,t,n){var i=e(38),o=e(100),u=e(60),c=e(125)("IE_PROTO"),a=function(){},f="prototype",s=function(){var t,n=e(59)("iframe"),r=u.length;for(n.style.display="none",e(73).appendChild(n),n.src="javascript:",(t=n.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),s=t.F;r--;)delete s[f][u[r]];return s()};t.exports=Object.create||function create(t,n){var r;return null!==t?(a[f]=i(t),r=new a,a[f]=null,r[c]=t):r=s(),void 0===n?r:o(r,n)}},{100:100,125:125,38:38,59:59,60:60,73:73}],99:[function(t,n,r){arguments[4][29][0].apply(r,arguments)},{143:143,29:29,38:38,58:58,74:74}],100:[function(t,n,r){var u=t(99),c=t(38),a=t(107);n.exports=t(58)?Object.defineProperties:function defineProperties(t,n){c(t);for(var r,e=a(n),i=e.length,o=0;o<i;)u.f(t,r=e[o++],n[r]);return t}},{107:107,38:38,58:58,99:99}],101:[function(t,n,r){var e=t(108),i=t(116),o=t(140),u=t(143),c=t(71),a=t(74),f=Object.getOwnPropertyDescriptor;r.f=t(58)?f:function getOwnPropertyDescriptor(t,n){if(t=o(t),n=u(n,!0),a)try{return f(t,n)}catch(t){}if(c(t,n))return i(!e.f.call(t,n),t[n])}},{108:108,116:116,140:140,143:143,58:58,71:71,74:74}],102:[function(t,n,r){var e=t(140),i=t(103).f,o={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];n.exports.f=function getOwnPropertyNames(t){return u&&"[object Window]"==o.call(t)?function(t){try{return i(t)}catch(t){return u.slice()}}(t):i(e(t))}},{103:103,140:140}],103:[function(t,n,r){var e=t(106),i=t(60).concat("length","prototype");r.f=Object.getOwnPropertyNames||function getOwnPropertyNames(t){return e(t,i)}},{106:106,60:60}],104:[function(t,n,r){r.f=Object.getOwnPropertySymbols},{}],105:[function(t,n,r){var e=t(71),i=t(142),o=t(125)("IE_PROTO"),u=Object.prototype;n.exports=Object.getPrototypeOf||function(t){return t=i(t),e(t,o)?t[o]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},{125:125,142:142,71:71}],106:[function(t,n,r){var u=t(71),c=t(140),a=t(41)(!1),f=t(125)("IE_PROTO");n.exports=function(t,n){var r,e=c(t),i=0,o=[];for(r in e)r!=f&&u(e,r)&&o.push(r);for(;n.length>i;)u(e,r=n[i++])&&(~a(o,r)||o.push(r));return o}},{125:125,140:140,41:41,71:71}],107:[function(t,n,r){var e=t(106),i=t(60);n.exports=Object.keys||function keys(t){return e(t,i)}},{106:106,60:60}],108:[function(t,n,r){r.f={}.propertyIsEnumerable},{}],109:[function(t,n,r){var i=t(62),o=t(52),u=t(64);n.exports=function(t,n){var r=(o.Object||{})[t]||Object[t],e={};e[t]=n(r),i(i.S+i.F*u(function(){r(1)}),"Object",e)}},{52:52,62:62,64:64}],110:[function(t,n,r){var a=t(107),f=t(140),s=t(108).f;n.exports=function(c){return function(t){for(var n,r=f(t),e=a(r),i=e.length,o=0,u=[];o<i;)s.call(r,n=e[o++])&&u.push(c?[n,r[n]]:r[n]);return u}}},{107:107,108:108,140:140}],111:[function(t,n,r){var e=t(103),i=t(104),o=t(38),u=t(70).Reflect;n.exports=u&&u.ownKeys||function ownKeys(t){var n=e.f(o(t)),r=i.f;return r?n.concat(r(t)):n}},{103:103,104:104,38:38,70:70}],112:[function(t,n,r){var e=t(70).parseFloat,i=t(134).trim;n.exports=1/e(t(135)+"-0")!=-1/0?function parseFloat(t){var n=i(String(t),3),r=e(n);return 0===r&&"-"==n.charAt(0)?-0:r}:e},{134:134,135:135,70:70}],113:[function(t,n,r){var e=t(70).parseInt,i=t(134).trim,o=t(135),u=/^[-+]?0[xX]/;n.exports=8!==e(o+"08")||22!==e(o+"0x16")?function parseInt(t,n){var r=i(String(t),3);return e(r,n>>>0||(u.test(r)?16:10))}:e},{134:134,135:135,70:70}],114:[function(t,n,r){n.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},{}],115:[function(t,n,r){var e=t(38),i=t(81),o=t(96);n.exports=function(t,n){if(e(t),i(n)&&n.constructor===t)return n;var r=o.f(t);return(0,r.resolve)(n),r.promise}},{38:38,81:81,96:96}],116:[function(t,n,r){arguments[4][30][0].apply(r,arguments)},{30:30}],117:[function(t,n,r){var i=t(118);n.exports=function(t,n,r){for(var e in n)i(t,e,n[e],r);return t}},{118:118}],118:[function(t,n,r){var o=t(70),u=t(72),c=t(71),a=t(147)("src"),e=t(69),i="toString",f=(""+e).split(i);t(52).inspectSource=function(t){return e.call(t)},(n.exports=function(t,n,r,e){var i="function"==typeof r;i&&(c(r,"name")||u(r,"name",n)),t[n]!==r&&(i&&(c(r,a)||u(r,a,t[n]?""+t[n]:f.join(String(n)))),t===o?t[n]=r:e?t[n]?t[n]=r:u(t,n,r):(delete t[n],u(t,n,r)))})(Function.prototype,i,function toString(){return"function"==typeof this&&this[a]||e.call(this)})},{147:147,52:52,69:69,70:70,71:71,72:72}],119:[function(t,n,r){"use strict";var i=t(47),o=RegExp.prototype.exec;n.exports=function(t,n){var r=t.exec;if("function"==typeof r){var e=r.call(t,n);if("object"!=typeof e)throw new TypeError("RegExp exec method returned something other than an Object or null");return e}if("RegExp"!==i(t))throw new TypeError("RegExp#exec called on incompatible receiver");return o.call(t,n)}},{47:47}],120:[function(t,n,r){"use strict";var e,i,u=t(66),c=RegExp.prototype.exec,a=String.prototype.replace,o=c,f="lastIndex",s=(e=/a/,i=/b*/g,c.call(e,"a"),c.call(i,"a"),0!==e[f]||0!==i[f]),l=void 0!==/()??/.exec("")[1];(s||l)&&(o=function exec(t){var n,r,e,i,o=this;return l&&(r=new RegExp("^"+o.source+"$(?!\\s)",u.call(o))),s&&(n=o[f]),e=c.call(o,t),s&&e&&(o[f]=o.global?e.index+e[0].length:n),l&&e&&1<e.length&&a.call(e[0],r,function(){for(i=1;i<arguments.length-2;i++)void 0===arguments[i]&&(e[i]=void 0)}),e}),n.exports=o},{66:66}],121:[function(t,n,r){n.exports=Object.is||function is(t,n){return t===n?0!==t||1/t==1/n:t!=t&&n!=n}},{}],122:[function(n,t,r){var e=n(81),i=n(38),o=function(t,n){if(i(t),!e(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,r,e){try{(e=n(54)(Function.call,n(101).f(Object.prototype,"__proto__").set,2))(t,[]),r=!(t instanceof Array)}catch(t){r=!0}return function setPrototypeOf(t,n){return o(t,n),r?t.__proto__=n:e(t,n),t}}({},!1):void 0),check:o}},{101:101,38:38,54:54,81:81}],123:[function(t,n,r){"use strict";var e=t(70),i=t(99),o=t(58),u=t(152)("species");n.exports=function(t){var n=e[t];o&&n&&!n[u]&&i.f(n,u,{configurable:!0,get:function(){return this}})}},{152:152,58:58,70:70,99:99}],124:[function(t,n,r){var e=t(99).f,i=t(71),o=t(152)("toStringTag");n.exports=function(t,n,r){t&&!i(t=r?t:t.prototype,o)&&e(t,o,{configurable:!0,value:n})}},{152:152,71:71,99:99}],125:[function(t,n,r){var e=t(126)("keys"),i=t(147);n.exports=function(t){return e[t]||(e[t]=i(t))}},{126:126,147:147}],126:[function(t,n,r){var e=t(52),i=t(70),o="__core-js_shared__",u=i[o]||(i[o]={});(n.exports=function(t,n){return u[t]||(u[t]=void 0!==n?n:{})})("versions",[]).push({version:e.version,mode:t(89)?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},{52:52,70:70,89:89}],127:[function(t,n,r){var i=t(38),o=t(33),u=t(152)("species");n.exports=function(t,n){var r,e=i(t).constructor;return void 0===e||null==(r=i(e)[u])?n:o(r)}},{152:152,33:33,38:38}],128:[function(t,n,r){"use strict";var e=t(64);n.exports=function(t,n){return!!t&&e(function(){n?t.call(null,function(){},1):t.call(null)})}},{64:64}],129:[function(t,n,r){var a=t(139),f=t(57);n.exports=function(c){return function(t,n){var r,e,i=String(f(t)),o=a(n),u=i.length;return o<0||u<=o?c?"":void 0:(r=i.charCodeAt(o))<55296||56319<r||o+1===u||(e=i.charCodeAt(o+1))<56320||57343<e?c?i.charAt(o):r:c?i.slice(o,o+2):e-56320+(r-55296<<10)+65536}}},{139:139,57:57}],130:[function(t,n,r){var e=t(82),i=t(57);n.exports=function(t,n,r){if(e(n))throw TypeError("String#"+r+" doesn't accept regex!");return String(i(t))}},{57:57,82:82}],131:[function(t,n,r){var e=t(62),i=t(64),u=t(57),c=/"/g,o=function(t,n,r,e){var i=String(u(t)),o="<"+n;return""!==r&&(o+=" "+r+'="'+String(e).replace(c,"&quot;")+'"'),o+">"+i+"</"+n+">"};n.exports=function(n,t){var r={};r[n]=t(o),e(e.P+e.F*i(function(){var t=""[n]('"');return t!==t.toLowerCase()||3<t.split('"').length}),"String",r)}},{57:57,62:62,64:64}],132:[function(t,n,r){var s=t(141),l=t(133),h=t(57);n.exports=function(t,n,r,e){var i=String(h(t)),o=i.length,u=void 0===r?" ":String(r),c=s(n);if(c<=o||""==u)return i;var a=c-o,f=l.call(u,Math.ceil(a/u.length));return f.length>a&&(f=f.slice(0,a)),e?f+i:i+f}},{133:133,141:141,57:57}],133:[function(t,n,r){"use strict";var i=t(139),o=t(57);n.exports=function repeat(t){var n=String(o(this)),r="",e=i(t);if(e<0||e==1/0)throw RangeError("Count can't be negative");for(;0<e;(e>>>=1)&&(n+=n))1&e&&(r+=n);return r}},{139:139,57:57}],134:[function(t,n,r){var u=t(62),e=t(57),c=t(64),a=t(135),i="["+a+"]",o=RegExp("^"+i+i+"*"),f=RegExp(i+i+"*$"),s=function(t,n,r){var e={},i=c(function(){return!!a[t]()||"​"!="​"[t]()}),o=e[t]=i?n(l):a[t];r&&(e[r]=o),u(u.P+u.F*i,"String",e)},l=s.trim=function(t,n){return t=String(e(t)),1&n&&(t=t.replace(o,"")),2&n&&(t=t.replace(f,"")),t};n.exports=s},{135:135,57:57,62:62,64:64}],135:[function(t,n,r){n.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},{}],136:[function(t,n,r){var e,i,o,u=t(54),c=t(76),a=t(73),f=t(59),s=t(70),l=s.process,h=s.setImmediate,p=s.clearImmediate,v=s.MessageChannel,y=s.Dispatch,g=0,d={},x="onreadystatechange",m=function(){var t=+this;if(d.hasOwnProperty(t)){var n=d[t];delete d[t],n()}},b=function(t){m.call(t.data)};h&&p||(h=function setImmediate(t){for(var n=[],r=1;arguments.length>r;)n.push(arguments[r++]);return d[++g]=function(){c("function"==typeof t?t:Function(t),n)},e(g),g},p=function clearImmediate(t){delete d[t]},"process"==t(48)(l)?e=function(t){l.nextTick(u(m,t,1))}:y&&y.now?e=function(t){y.now(u(m,t,1))}:v?(o=(i=new v).port2,i.port1.onmessage=b,e=u(o.postMessage,o,1)):s.addEventListener&&"function"==typeof postMessage&&!s.importScripts?(e=function(t){s.postMessage(t+"","*")},s.addEventListener("message",b,!1)):e=x in f("script")?function(t){a.appendChild(f("script"))[x]=function(){a.removeChild(this),m.call(t)}}:function(t){setTimeout(u(m,t,1),0)}),n.exports={set:h,clear:p}},{48:48,54:54,59:59,70:70,73:73,76:76}],137:[function(t,n,r){var e=t(139),i=Math.max,o=Math.min;n.exports=function(t,n){return(t=e(t))<0?i(t+n,0):o(t,n)}},{139:139}],138:[function(t,n,r){var e=t(139),i=t(141);n.exports=function(t){if(void 0===t)return 0;var n=e(t),r=i(n);if(n!==r)throw RangeError("Wrong length!");return r}},{139:139,141:141}],139:[function(t,n,r){var e=Math.ceil,i=Math.floor;n.exports=function(t){return isNaN(t=+t)?0:(0<t?i:e)(t)}},{}],140:[function(t,n,r){var e=t(77),i=t(57);n.exports=function(t){return e(i(t))}},{57:57,77:77}],141:[function(t,n,r){var e=t(139),i=Math.min;n.exports=function(t){return 0<t?i(e(t),9007199254740991):0}},{139:139}],142:[function(t,n,r){var e=t(57);n.exports=function(t){return Object(e(t))}},{57:57}],143:[function(t,n,r){arguments[4][31][0].apply(r,arguments)},{31:31,81:81}],144:[function(t,n,r){"use strict";if(t(58)){var d=t(89),x=t(70),m=t(64),b=t(62),S=t(146),e=t(145),h=t(54),w=t(37),i=t(116),_=t(72),o=t(117),u=t(139),E=t(141),F=t(138),c=t(137),a=t(143),f=t(71),I=t(47),O=t(81),p=t(142),v=t(78),P=t(98),A=t(105),M=t(103).f,y=t(153),s=t(147),l=t(152),g=t(42),k=t(41),N=t(127),j=t(164),T=t(88),R=t(86),L=t(123),C=t(40),G=t(39),D=t(99),U=t(101),W=D.f,V=U.f,B=x.RangeError,z=x.TypeError,q=x.Uint8Array,Y="ArrayBuffer",K="Shared"+Y,$="BYTES_PER_ELEMENT",J="prototype",X=Array[J],H=e.ArrayBuffer,Z=e.DataView,Q=g(0),tt=g(2),nt=g(3),rt=g(4),et=g(5),it=g(6),ot=k(!0),ut=k(!1),ct=j.values,at=j.keys,ft=j.entries,st=X.lastIndexOf,lt=X.reduce,ht=X.reduceRight,pt=X.join,vt=X.sort,yt=X.slice,gt=X.toString,dt=X.toLocaleString,xt=l("iterator"),mt=l("toStringTag"),bt=s("typed_constructor"),St=s("def_constructor"),wt=S.CONSTR,_t=S.TYPED,Et=S.VIEW,Ft="Wrong length!",It=g(1,function(t,n){return kt(N(t,t[St]),n)}),Ot=m(function(){return 1===new q(new Uint16Array([1]).buffer)[0]}),Pt=!!q&&!!q[J].set&&m(function(){new q(1).set({})}),At=function(t,n){var r=u(t);if(r<0||r%n)throw B("Wrong offset!");return r},Mt=function(t){if(O(t)&&_t in t)return t;throw z(t+" is not a typed array!")},kt=function(t,n){if(!(O(t)&&bt in t))throw z("It is not a typed array constructor!");return new t(n)},Nt=function(t,n){return jt(N(t,t[St]),n)},jt=function(t,n){for(var r=0,e=n.length,i=kt(t,e);r<e;)i[r]=n[r++];return i},Tt=function(t,n,r){W(t,n,{get:function(){return this._d[r]}})},Rt=function from(t){var n,r,e,i,o,u,c=p(t),a=arguments.length,f=1<a?arguments[1]:void 0,s=void 0!==f,l=y(c);if(null!=l&&!v(l)){for(u=l.call(c),e=[],n=0;!(o=u.next()).done;n++)e.push(o.value);c=e}for(s&&2<a&&(f=h(f,arguments[2],2)),n=0,r=E(c.length),i=kt(this,r);n<r;n++)i[n]=s?f(c[n],n):c[n];return i},Lt=function of(){for(var t=0,n=arguments.length,r=kt(this,n);t<n;)r[t]=arguments[t++];return r},Ct=!!q&&m(function(){dt.call(new q(1))}),Gt=function toLocaleString(){return dt.apply(Ct?yt.call(Mt(this)):Mt(this),arguments)},Dt={copyWithin:function copyWithin(t,n){return G.call(Mt(this),t,n,2<arguments.length?arguments[2]:void 0)},every:function every(t){return rt(Mt(this),t,1<arguments.length?arguments[1]:void 0)},fill:function fill(t){return C.apply(Mt(this),arguments)},filter:function filter(t){return Nt(this,tt(Mt(this),t,1<arguments.length?arguments[1]:void 0))},find:function find(t){return et(Mt(this),t,1<arguments.length?arguments[1]:void 0)},findIndex:function findIndex(t){return it(Mt(this),t,1<arguments.length?arguments[1]:void 0)},forEach:function forEach(t){Q(Mt(this),t,1<arguments.length?arguments[1]:void 0)},indexOf:function indexOf(t){return ut(Mt(this),t,1<arguments.length?arguments[1]:void 0)},includes:function includes(t){return ot(Mt(this),t,1<arguments.length?arguments[1]:void 0)},join:function join(t){return pt.apply(Mt(this),arguments)},lastIndexOf:function lastIndexOf(t){return st.apply(Mt(this),arguments)},map:function map(t){return It(Mt(this),t,1<arguments.length?arguments[1]:void 0)},reduce:function reduce(t){return lt.apply(Mt(this),arguments)},reduceRight:function reduceRight(t){return ht.apply(Mt(this),arguments)},reverse:function reverse(){for(var t,n=this,r=Mt(n).length,e=Math.floor(r/2),i=0;i<e;)t=n[i],n[i++]=n[--r],n[r]=t;return n},some:function some(t){return nt(Mt(this),t,1<arguments.length?arguments[1]:void 0)},sort:function sort(t){return vt.call(Mt(this),t)},subarray:function subarray(t,n){var r=Mt(this),e=r.length,i=c(t,e);return new(N(r,r[St]))(r.buffer,r.byteOffset+i*r.BYTES_PER_ELEMENT,E((void 0===n?e:c(n,e))-i))}},Ut=function slice(t,n){return Nt(this,yt.call(Mt(this),t,n))},Wt=function set(t){Mt(this);var n=At(arguments[1],1),r=this.length,e=p(t),i=E(e.length),o=0;if(r<i+n)throw B(Ft);for(;o<i;)this[n+o]=e[o++]},Vt={entries:function entries(){return ft.call(Mt(this))},keys:function keys(){return at.call(Mt(this))},values:function values(){return ct.call(Mt(this))}},Bt=function(t,n){return O(t)&&t[_t]&&"symbol"!=typeof n&&n in t&&String(+n)==String(n)},zt=function getOwnPropertyDescriptor(t,n){return Bt(t,n=a(n,!0))?i(2,t[n]):V(t,n)},qt=function defineProperty(t,n,r){return!(Bt(t,n=a(n,!0))&&O(r)&&f(r,"value"))||f(r,"get")||f(r,"set")||r.configurable||f(r,"writable")&&!r.writable||f(r,"enumerable")&&!r.enumerable?W(t,n,r):(t[n]=r.value,t)};wt||(U.f=zt,D.f=qt),b(b.S+b.F*!wt,"Object",{getOwnPropertyDescriptor:zt,defineProperty:qt}),m(function(){gt.call({})})&&(gt=dt=function toString(){return pt.call(this)});var Yt=o({},Dt);o(Yt,Vt),_(Yt,xt,Vt.values),o(Yt,{slice:Ut,set:Wt,constructor:function(){},toString:gt,toLocaleString:Gt}),Tt(Yt,"buffer","b"),Tt(Yt,"byteOffset","o"),Tt(Yt,"byteLength","l"),Tt(Yt,"length","e"),W(Yt,mt,{get:function(){return this[_t]}}),n.exports=function(t,l,n,o){var h=t+((o=!!o)?"Clamped":"")+"Array",r="get"+t,u="set"+t,p=x[h],c=p||{},e=p&&A(p),i=!p||!S.ABV,a={},f=p&&p[J],v=function(t,i){W(t,i,{get:function(){return t=i,(n=this._d).v[r](t*l+n.o,Ot);var t,n},set:function(t){return n=i,r=t,e=this._d,o&&(r=(r=Math.round(r))<0?0:255<r?255:255&r),void e.v[u](n*l+e.o,r,Ot);var n,r,e},enumerable:!0})};i?(p=n(function(t,n,r,e){w(t,p,h,"_d");var i,o,u,c,a=0,f=0;if(O(n)){if(!(n instanceof H||(c=I(n))==Y||c==K))return _t in n?jt(p,n):Rt.call(p,n);i=n,f=At(r,l);var s=n.byteLength;if(void 0===e){if(s%l)throw B(Ft);if((o=s-f)<0)throw B(Ft)}else if(s<(o=E(e)*l)+f)throw B(Ft);u=o/l}else u=F(n),i=new H(o=u*l);for(_(t,"_d",{b:i,o:f,l:o,e:u,v:new Z(i)});a<u;)v(t,a++)}),f=p[J]=P(Yt),_(f,"constructor",p)):m(function(){p(1)})&&m(function(){new p(-1)})&&R(function(t){new p,new p(null),new p(1.5),new p(t)},!0)||(p=n(function(t,n,r,e){var i;return w(t,p,h),O(n)?n instanceof H||(i=I(n))==Y||i==K?void 0!==e?new c(n,At(r,l),e):void 0!==r?new c(n,At(r,l)):new c(n):_t in n?jt(p,n):Rt.call(p,n):new c(F(n))}),Q(e!==Function.prototype?M(c).concat(M(e)):M(c),function(t){t in p||_(p,t,c[t])}),p[J]=f,d||(f.constructor=p));var s=f[xt],y=!!s&&("values"==s.name||null==s.name),g=Vt.values;_(p,bt,!0),_(f,_t,h),_(f,Et,!0),_(f,St,p),(o?new p(1)[mt]==h:mt in f)||W(f,mt,{get:function(){return h}}),a[h]=p,b(b.G+b.W+b.F*(p!=c),a),b(b.S,h,{BYTES_PER_ELEMENT:l}),b(b.S+b.F*m(function(){c.of.call(p,1)}),h,{from:Rt,of:Lt}),$ in f||_(f,$,l),b(b.P,h,Dt),L(h),b(b.P+b.F*Pt,h,{set:Wt}),b(b.P+b.F*!y,h,Vt),d||f.toString==gt||(f.toString=gt),b(b.P+b.F*m(function(){new p(1).slice()}),h,{slice:Ut}),b(b.P+b.F*(m(function(){return[1,2].toLocaleString()!=new p([1,2]).toLocaleString()})||!m(function(){f.toLocaleString.call([1,2])})),h,{toLocaleString:Gt}),T[h]=y?s:g,d||y||_(f,xt,g)}}else n.exports=function(){}},{101:101,103:103,105:105,116:116,117:117,123:123,127:127,137:137,138:138,139:139,141:141,142:142,143:143,145:145,146:146,147:147,152:152,153:153,164:164,37:37,39:39,40:40,41:41,42:42,47:47,54:54,58:58,62:62,64:64,70:70,71:71,72:72,78:78,81:81,86:86,88:88,89:89,98:98,99:99}],145:[function(t,n,r){"use strict";var e=t(70),i=t(58),o=t(89),u=t(146),c=t(72),a=t(117),f=t(64),s=t(37),l=t(139),h=t(141),p=t(138),v=t(103).f,y=t(99).f,g=t(40),d=t(124),x="ArrayBuffer",m="DataView",b="prototype",S="Wrong index!",w=e[x],_=e[m],E=e.Math,F=e.RangeError,I=e.Infinity,O=w,P=E.abs,A=E.pow,M=E.floor,k=E.log,N=E.LN2,j="byteLength",T="byteOffset",R=i?"_b":"buffer",L=i?"_l":j,C=i?"_o":T;function packIEEE754(t,n,r){var e,i,o,u=new Array(r),c=8*r-n-1,a=(1<<c)-1,f=a>>1,s=23===n?A(2,-24)-A(2,-77):0,l=0,h=t<0||0===t&&1/t<0?1:0;for((t=P(t))!=t||t===I?(i=t!=t?1:0,e=a):(e=M(k(t)/N),t*(o=A(2,-e))<1&&(e--,o*=2),2<=(t+=1<=e+f?s/o:s*A(2,1-f))*o&&(e++,o/=2),a<=e+f?(i=0,e=a):1<=e+f?(i=(t*o-1)*A(2,n),e+=f):(i=t*A(2,f-1)*A(2,n),e=0));8<=n;u[l++]=255&i,i/=256,n-=8);for(e=e<<n|i,c+=n;0<c;u[l++]=255&e,e/=256,c-=8);return u[--l]|=128*h,u}function unpackIEEE754(t,n,r){var e,i=8*r-n-1,o=(1<<i)-1,u=o>>1,c=i-7,a=r-1,f=t[a--],s=127&f;for(f>>=7;0<c;s=256*s+t[a],a--,c-=8);for(e=s&(1<<-c)-1,s>>=-c,c+=n;0<c;e=256*e+t[a],a--,c-=8);if(0===s)s=1-u;else{if(s===o)return e?NaN:f?-I:I;e+=A(2,n),s-=u}return(f?-1:1)*e*A(2,s-n)}function unpackI32(t){return t[3]<<24|t[2]<<16|t[1]<<8|t[0]}function packI8(t){return[255&t]}function packI16(t){return[255&t,t>>8&255]}function packI32(t){return[255&t,t>>8&255,t>>16&255,t>>24&255]}function packF64(t){return packIEEE754(t,52,8)}function packF32(t){return packIEEE754(t,23,4)}function addGetter(t,n,r){y(t[b],n,{get:function(){return this[r]}})}function get(t,n,r,e){var i=p(+r);if(i+n>t[L])throw F(S);var o=t[R]._b,u=i+t[C],c=o.slice(u,u+n);return e?c:c.reverse()}function set(t,n,r,e,i,o){var u=p(+r);if(u+n>t[L])throw F(S);for(var c=t[R]._b,a=u+t[C],f=e(+i),s=0;s<n;s++)c[a+s]=f[o?s:n-s-1]}if(u.ABV){if(!f(function(){w(1)})||!f(function(){new w(-1)})||f(function(){return new w,new w(1.5),new w(NaN),w.name!=x})){for(var G,D=(w=function ArrayBuffer(t){return s(this,w),new O(p(t))})[b]=O[b],U=v(O),W=0;U.length>W;)(G=U[W++])in w||c(w,G,O[G]);o||(D.constructor=w)}var V=new _(new w(2)),B=_[b].setInt8;V.setInt8(0,2147483648),V.setInt8(1,2147483649),!V.getInt8(0)&&V.getInt8(1)||a(_[b],{setInt8:function setInt8(t,n){B.call(this,t,n<<24>>24)},setUint8:function setUint8(t,n){B.call(this,t,n<<24>>24)}},!0)}else w=function ArrayBuffer(t){s(this,w,x);var n=p(t);this._b=g.call(new Array(n),0),this[L]=n},_=function DataView(t,n,r){s(this,_,m),s(t,w,m);var e=t[L],i=l(n);if(i<0||e<i)throw F("Wrong offset!");if(e<i+(r=void 0===r?e-i:h(r)))throw F("Wrong length!");this[R]=t,this[C]=i,this[L]=r},i&&(addGetter(w,j,"_l"),addGetter(_,"buffer","_b"),addGetter(_,j,"_l"),addGetter(_,T,"_o")),a(_[b],{getInt8:function getInt8(t){return get(this,1,t)[0]<<24>>24},getUint8:function getUint8(t){return get(this,1,t)[0]},getInt16:function getInt16(t){var n=get(this,2,t,arguments[1]);return(n[1]<<8|n[0])<<16>>16},getUint16:function getUint16(t){var n=get(this,2,t,arguments[1]);return n[1]<<8|n[0]},getInt32:function getInt32(t){return unpackI32(get(this,4,t,arguments[1]))},getUint32:function getUint32(t){return unpackI32(get(this,4,t,arguments[1]))>>>0},getFloat32:function getFloat32(t){return unpackIEEE754(get(this,4,t,arguments[1]),23,4)},getFloat64:function getFloat64(t){return unpackIEEE754(get(this,8,t,arguments[1]),52,8)},setInt8:function setInt8(t,n){set(this,1,t,packI8,n)},setUint8:function setUint8(t,n){set(this,1,t,packI8,n)},setInt16:function setInt16(t,n){set(this,2,t,packI16,n,arguments[2])},setUint16:function setUint16(t,n){set(this,2,t,packI16,n,arguments[2])},setInt32:function setInt32(t,n){set(this,4,t,packI32,n,arguments[2])},setUint32:function setUint32(t,n){set(this,4,t,packI32,n,arguments[2])},setFloat32:function setFloat32(t,n){set(this,4,t,packF32,n,arguments[2])},setFloat64:function setFloat64(t,n){set(this,8,t,packF64,n,arguments[2])}});d(w,x),d(_,m),c(_[b],u.VIEW,!0),r[x]=w,r[m]=_},{103:103,117:117,124:124,138:138,139:139,141:141,146:146,37:37,40:40,58:58,64:64,70:70,72:72,89:89,99:99}],146:[function(t,n,r){for(var e,i=t(70),o=t(72),u=t(147),c=u("typed_array"),a=u("view"),f=!(!i.ArrayBuffer||!i.DataView),s=f,l=0,h="Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");l<9;)(e=i[h[l++]])?(o(e.prototype,c,!0),o(e.prototype,a,!0)):s=!1;n.exports={ABV:f,CONSTR:s,TYPED:c,VIEW:a}},{147:147,70:70,72:72}],147:[function(t,n,r){var e=0,i=Math.random();n.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+i).toString(36))}},{}],148:[function(t,n,r){var e=t(70).navigator;n.exports=e&&e.userAgent||""},{70:70}],149:[function(t,n,r){var e=t(81);n.exports=function(t,n){if(!e(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},{81:81}],150:[function(t,n,r){var e=t(70),i=t(52),o=t(89),u=t(151),c=t(99).f;n.exports=function(t){var n=i.Symbol||(i.Symbol=o?{}:e.Symbol||{});"_"==t.charAt(0)||t in n||c(n,t,{value:u.f(t)})}},{151:151,52:52,70:70,89:89,99:99}],151:[function(t,n,r){r.f=t(152)},{152:152}],152:[function(t,n,r){var e=t(126)("wks"),i=t(147),o=t(70).Symbol,u="function"==typeof o;(n.exports=function(t){return e[t]||(e[t]=u&&o[t]||(u?o:i)("Symbol."+t))}).store=e},{126:126,147:147,70:70}],153:[function(t,n,r){var e=t(47),i=t(152)("iterator"),o=t(88);n.exports=t(52).getIteratorMethod=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[e(t)]}},{152:152,47:47,52:52,88:88}],154:[function(t,n,r){var e=t(62);e(e.P,"Array",{copyWithin:t(39)}),t(35)("copyWithin")},{35:35,39:39,62:62}],155:[function(t,n,r){"use strict";var e=t(62),i=t(42)(4);e(e.P+e.F*!t(128)([].every,!0),"Array",{every:function every(t){return i(this,t,arguments[1])}})},{128:128,42:42,62:62}],156:[function(t,n,r){var e=t(62);e(e.P,"Array",{fill:t(40)}),t(35)("fill")},{35:35,40:40,62:62}],157:[function(t,n,r){"use strict";var e=t(62),i=t(42)(2);e(e.P+e.F*!t(128)([].filter,!0),"Array",{filter:function filter(t){return i(this,t,arguments[1])}})},{128:128,42:42,62:62}],158:[function(t,n,r){"use strict";var e=t(62),i=t(42)(6),o="findIndex",u=!0;o in[]&&Array(1)[o](function(){u=!1}),e(e.P+e.F*u,"Array",{findIndex:function findIndex(t){return i(this,t,1<arguments.length?arguments[1]:void 0)}}),t(35)(o)},{35:35,42:42,62:62}],159:[function(t,n,r){"use strict";var e=t(62),i=t(42)(5),o="find",u=!0;o in[]&&Array(1)[o](function(){u=!1}),e(e.P+e.F*u,"Array",{find:function find(t){return i(this,t,1<arguments.length?arguments[1]:void 0)}}),t(35)(o)},{35:35,42:42,62:62}],160:[function(t,n,r){"use strict";var e=t(62),i=t(42)(0),o=t(128)([].forEach,!0);e(e.P+e.F*!o,"Array",{forEach:function forEach(t){return i(this,t,arguments[1])}})},{128:128,42:42,62:62}],161:[function(t,n,r){"use strict";var h=t(54),e=t(62),p=t(142),v=t(83),y=t(78),g=t(141),d=t(53),x=t(153);e(e.S+e.F*!t(86)(function(t){Array.from(t)}),"Array",{from:function from(t){var n,r,e,i,o=p(t),u="function"==typeof this?this:Array,c=arguments.length,a=1<c?arguments[1]:void 0,f=void 0!==a,s=0,l=x(o);if(f&&(a=h(a,2<c?arguments[2]:void 0,2)),null==l||u==Array&&y(l))for(r=new u(n=g(o.length));s<n;s++)d(r,s,f?a(o[s],s):o[s]);else for(i=l.call(o),r=new u;!(e=i.next()).done;s++)d(r,s,f?v(i,a,[e.value,s],!0):e.value);return r.length=s,r}})},{141:141,142:142,153:153,53:53,54:54,62:62,78:78,83:83,86:86}],162:[function(t,n,r){"use strict";var e=t(62),i=t(41)(!1),o=[].indexOf,u=!!o&&1/[1].indexOf(1,-0)<0;e(e.P+e.F*(u||!t(128)(o)),"Array",{indexOf:function indexOf(t){return u?o.apply(this,arguments)||0:i(this,t,arguments[1])}})},{128:128,41:41,62:62}],163:[function(t,n,r){var e=t(62);e(e.S,"Array",{isArray:t(79)})},{62:62,79:79}],164:[function(t,n,r){"use strict";var e=t(35),i=t(87),o=t(88),u=t(140);n.exports=t(85)(Array,"Array",function(t,n){this._t=u(t),this._i=0,this._k=n},function(){var t=this._t,n=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,i(1)):i(0,"keys"==n?r:"values"==n?t[r]:[r,t[r]])},"values"),o.Arguments=o.Array,e("keys"),e("values"),e("entries")},{140:140,35:35,85:85,87:87,88:88}],165:[function(t,n,r){"use strict";var e=t(62),i=t(140),o=[].join;e(e.P+e.F*(t(77)!=Object||!t(128)(o)),"Array",{join:function join(t){return o.call(i(this),void 0===t?",":t)}})},{128:128,140:140,62:62,77:77}],166:[function(t,n,r){"use strict";var e=t(62),i=t(140),o=t(139),u=t(141),c=[].lastIndexOf,a=!!c&&1/[1].lastIndexOf(1,-0)<0;e(e.P+e.F*(a||!t(128)(c)),"Array",{lastIndexOf:function lastIndexOf(t){if(a)return c.apply(this,arguments)||0;var n=i(this),r=u(n.length),e=r-1;for(1<arguments.length&&(e=Math.min(e,o(arguments[1]))),e<0&&(e=r+e);0<=e;e--)if(e in n&&n[e]===t)return e||0;return-1}})},{128:128,139:139,140:140,141:141,62:62}],167:[function(t,n,r){"use strict";var e=t(62),i=t(42)(1);e(e.P+e.F*!t(128)([].map,!0),"Array",{map:function map(t){return i(this,t,arguments[1])}})},{128:128,42:42,62:62}],168:[function(t,n,r){"use strict";var e=t(62),i=t(53);e(e.S+e.F*t(64)(function(){function F(){}return!(Array.of.call(F)instanceof F)}),"Array",{of:function of(){for(var t=0,n=arguments.length,r=new("function"==typeof this?this:Array)(n);t<n;)i(r,t,arguments[t++]);return r.length=n,r}})},{53:53,62:62,64:64}],169:[function(t,n,r){"use strict";var e=t(62),i=t(43);e(e.P+e.F*!t(128)([].reduceRight,!0),"Array",{reduceRight:function reduceRight(t){return i(this,t,arguments.length,arguments[1],!0)}})},{128:128,43:43,62:62}],170:[function(t,n,r){"use strict";var e=t(62),i=t(43);e(e.P+e.F*!t(128)([].reduce,!0),"Array",{reduce:function reduce(t){return i(this,t,arguments.length,arguments[1],!1)}})},{128:128,43:43,62:62}],171:[function(t,n,r){"use strict";var e=t(62),i=t(73),f=t(48),s=t(137),l=t(141),h=[].slice;e(e.P+e.F*t(64)(function(){i&&h.call(i)}),"Array",{slice:function slice(t,n){var r=l(this.length),e=f(this);if(n=void 0===n?r:n,"Array"==e)return h.call(this,t,n);for(var i=s(t,r),o=s(n,r),u=l(o-i),c=new Array(u),a=0;a<u;a++)c[a]="String"==e?this.charAt(i+a):this[i+a];return c}})},{137:137,141:141,48:48,62:62,64:64,73:73}],172:[function(t,n,r){"use strict";var e=t(62),i=t(42)(3);e(e.P+e.F*!t(128)([].some,!0),"Array",{some:function some(t){return i(this,t,arguments[1])}})},{128:128,42:42,62:62}],173:[function(t,n,r){"use strict";var e=t(62),i=t(33),o=t(142),u=t(64),c=[].sort,a=[1,2,3];e(e.P+e.F*(u(function(){a.sort(void 0)})||!u(function(){a.sort(null)})||!t(128)(c)),"Array",{sort:function sort(t){return void 0===t?c.call(o(this)):c.call(o(this),i(t))}})},{128:128,142:142,33:33,62:62,64:64}],174:[function(t,n,r){t(123)("Array")},{123:123}],175:[function(t,n,r){var e=t(62);e(e.S,"Date",{now:function(){return(new Date).getTime()}})},{62:62}],176:[function(t,n,r){var e=t(62),i=t(55);e(e.P+e.F*(Date.prototype.toISOString!==i),"Date",{toISOString:i})},{55:55,62:62}],177:[function(t,n,r){"use strict";var e=t(62),i=t(142),o=t(143);e(e.P+e.F*t(64)(function(){return null!==new Date(NaN).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})}),"Date",{toJSON:function toJSON(t){var n=i(this),r=o(n);return"number"!=typeof r||isFinite(r)?n.toISOString():null}})},{142:142,143:143,62:62,64:64}],178:[function(t,n,r){var e=t(152)("toPrimitive"),i=Date.prototype;e in i||t(72)(i,e,t(56))},{152:152,56:56,72:72}],179:[function(t,n,r){var e=Date.prototype,i="Invalid Date",o="toString",u=e[o],c=e.getTime;new Date(NaN)+""!=i&&t(118)(e,o,function toString(){var t=c.call(this);return t==t?u.call(this):i})},{118:118}],180:[function(t,n,r){var e=t(62);e(e.P,"Function",{bind:t(46)})},{46:46,62:62}],181:[function(t,n,r){"use strict";var e=t(81),i=t(105),o=t(152)("hasInstance"),u=Function.prototype;o in u||t(99).f(u,o,{value:function(t){if("function"!=typeof this||!e(t))return!1;if(!e(this.prototype))return t instanceof this;for(;t=i(t);)if(this.prototype===t)return!0;return!1}})},{105:105,152:152,81:81,99:99}],182:[function(t,n,r){var e=t(99).f,i=Function.prototype,o=/^\s*function ([^ (]*)/;"name"in i||t(58)&&e(i,"name",{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(t){return""}}})},{58:58,99:99}],183:[function(t,n,r){"use strict";var e=t(49),i=t(149);n.exports=t(51)("Map",function(t){return function Map(){return t(this,0<arguments.length?arguments[0]:void 0)}},{get:function get(t){var n=e.getEntry(i(this,"Map"),t);return n&&n.v},set:function set(t,n){return e.def(i(this,"Map"),0===t?0:t,n)}},e,!0)},{149:149,49:49,51:51}],184:[function(t,n,r){var e=t(62),i=t(92),o=Math.sqrt,u=Math.acosh;e(e.S+e.F*!(u&&710==Math.floor(u(Number.MAX_VALUE))&&u(1/0)==1/0),"Math",{acosh:function acosh(t){return(t=+t)<1?NaN:94906265.62425156<t?Math.log(t)+Math.LN2:i(t-1+o(t-1)*o(t+1))}})},{62:62,92:92}],185:[function(t,n,r){var e=t(62),i=Math.asinh;e(e.S+e.F*!(i&&0<1/i(0)),"Math",{asinh:function asinh(t){return isFinite(t=+t)&&0!=t?t<0?-asinh(-t):Math.log(t+Math.sqrt(t*t+1)):t}})},{62:62}],186:[function(t,n,r){var e=t(62),i=Math.atanh;e(e.S+e.F*!(i&&1/i(-0)<0),"Math",{atanh:function atanh(t){return 0==(t=+t)?t:Math.log((1+t)/(1-t))/2}})},{62:62}],187:[function(t,n,r){var e=t(62),i=t(93);e(e.S,"Math",{cbrt:function cbrt(t){return i(t=+t)*Math.pow(Math.abs(t),1/3)}})},{62:62,93:93}],188:[function(t,n,r){var e=t(62);e(e.S,"Math",{clz32:function clz32(t){return(t>>>=0)?31-Math.floor(Math.log(t+.5)*Math.LOG2E):32}})},{62:62}],189:[function(t,n,r){var e=t(62),i=Math.exp;e(e.S,"Math",{cosh:function cosh(t){return(i(t=+t)+i(-t))/2}})},{62:62}],190:[function(t,n,r){var e=t(62),i=t(90);e(e.S+e.F*(i!=Math.expm1),"Math",{expm1:i})},{62:62,90:90}],191:[function(t,n,r){var e=t(62);e(e.S,"Math",{fround:t(91)})},{62:62,91:91}],192:[function(t,n,r){var e=t(62),a=Math.abs;e(e.S,"Math",{hypot:function hypot(t,n){for(var r,e,i=0,o=0,u=arguments.length,c=0;o<u;)c<(r=a(arguments[o++]))?(i=i*(e=c/r)*e+1,c=r):i+=0<r?(e=r/c)*e:r;return c===1/0?1/0:c*Math.sqrt(i)}})},{62:62}],193:[function(t,n,r){var e=t(62),i=Math.imul;e(e.S+e.F*t(64)(function(){return-5!=i(4294967295,5)||2!=i.length}),"Math",{imul:function imul(t,n){var r=65535,e=+t,i=+n,o=r&e,u=r&i;return 0|o*u+((r&e>>>16)*u+o*(r&i>>>16)<<16>>>0)}})},{62:62,64:64}],194:[function(t,n,r){var e=t(62);e(e.S,"Math",{log10:function log10(t){return Math.log(t)*Math.LOG10E}})},{62:62}],195:[function(t,n,r){var e=t(62);e(e.S,"Math",{log1p:t(92)})},{62:62,92:92}],196:[function(t,n,r){var e=t(62);e(e.S,"Math",{log2:function log2(t){return Math.log(t)/Math.LN2}})},{62:62}],197:[function(t,n,r){var e=t(62);e(e.S,"Math",{sign:t(93)})},{62:62,93:93}],198:[function(t,n,r){var e=t(62),i=t(90),o=Math.exp;e(e.S+e.F*t(64)(function(){return-2e-17!=!Math.sinh(-2e-17)}),"Math",{sinh:function sinh(t){return Math.abs(t=+t)<1?(i(t)-i(-t))/2:(o(t-1)-o(-t-1))*(Math.E/2)}})},{62:62,64:64,90:90}],199:[function(t,n,r){var e=t(62),i=t(90),o=Math.exp;e(e.S,"Math",{tanh:function tanh(t){var n=i(t=+t),r=i(-t);return n==1/0?1:r==1/0?-1:(n-r)/(o(t)+o(-t))}})},{62:62,90:90}],200:[function(t,n,r){var e=t(62);e(e.S,"Math",{trunc:function trunc(t){return(0<t?Math.floor:Math.ceil)(t)}})},{62:62}],201:[function(t,n,r){"use strict";var e=t(70),i=t(71),o=t(48),u=t(75),s=t(143),c=t(64),a=t(103).f,f=t(101).f,l=t(99).f,h=t(134).trim,p="Number",v=e[p],y=v,g=v.prototype,d=o(t(98)(g))==p,x="trim"in String.prototype,m=function(t){var n=s(t,!1);if("string"==typeof n&&2<n.length){var r,e,i,o=(n=x?n.trim():h(n,3)).charCodeAt(0);if(43===o||45===o){if(88===(r=n.charCodeAt(2))||120===r)return NaN}else if(48===o){switch(n.charCodeAt(1)){case 66:case 98:e=2,i=49;break;case 79:case 111:e=8,i=55;break;default:return+n}for(var u,c=n.slice(2),a=0,f=c.length;a<f;a++)if((u=c.charCodeAt(a))<48||i<u)return NaN;return parseInt(c,e)}}return+n};if(!v(" 0o1")||!v("0b1")||v("+0x1")){v=function Number(t){var n=arguments.length<1?0:t,r=this;return r instanceof v&&(d?c(function(){g.valueOf.call(r)}):o(r)!=p)?u(new y(m(n)),r,v):m(n)};for(var b,S=t(58)?a(y):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),w=0;S.length>w;w++)i(y,b=S[w])&&!i(v,b)&&l(v,b,f(y,b));(v.prototype=g).constructor=v,t(118)(e,p,v)}},{101:101,103:103,118:118,134:134,143:143,48:48,58:58,64:64,70:70,71:71,75:75,98:98,99:99}],202:[function(t,n,r){var e=t(62);e(e.S,"Number",{EPSILON:Math.pow(2,-52)})},{62:62}],203:[function(t,n,r){var e=t(62),i=t(70).isFinite;e(e.S,"Number",{isFinite:function isFinite(t){return"number"==typeof t&&i(t)}})},{62:62,70:70}],204:[function(t,n,r){var e=t(62);e(e.S,"Number",{isInteger:t(80)})},{62:62,80:80}],205:[function(t,n,r){var e=t(62);e(e.S,"Number",{isNaN:function isNaN(t){return t!=t}})},{62:62}],206:[function(t,n,r){var e=t(62),i=t(80),o=Math.abs;e(e.S,"Number",{isSafeInteger:function isSafeInteger(t){return i(t)&&o(t)<=9007199254740991}})},{62:62,80:80}],207:[function(t,n,r){var e=t(62);e(e.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},{62:62}],208:[function(t,n,r){var e=t(62);e(e.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},{62:62}],209:[function(t,n,r){var e=t(62),i=t(112);e(e.S+e.F*(Number.parseFloat!=i),"Number",{parseFloat:i})},{112:112,62:62}],210:[function(t,n,r){var e=t(62),i=t(113);e(e.S+e.F*(Number.parseInt!=i),"Number",{parseInt:i})},{113:113,62:62}],211:[function(t,n,r){"use strict";var e=t(62),f=t(139),s=t(34),l=t(133),i=1..toFixed,o=Math.floor,u=[0,0,0,0,0,0],h="Number.toFixed: incorrect invocation!",p=function(t,n){for(var r=-1,e=n;++r<6;)e+=t*u[r],u[r]=e%1e7,e=o(e/1e7)},v=function(t){for(var n=6,r=0;0<=--n;)r+=u[n],u[n]=o(r/t),r=r%t*1e7},y=function(){for(var t=6,n="";0<=--t;)if(""!==n||0===t||0!==u[t]){var r=String(u[t]);n=""===n?r:n+l.call("0",7-r.length)+r}return n},g=function(t,n,r){return 0===n?r:n%2==1?g(t,n-1,r*t):g(t*t,n/2,r)};e(e.P+e.F*(!!i&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!t(64)(function(){i.call({})})),"Number",{toFixed:function toFixed(t){var n,r,e,i,o=s(this,h),u=f(t),c="",a="0";if(u<0||20<u)throw RangeError(h);if(o!=o)return"NaN";if(o<=-1e21||1e21<=o)return String(o);if(o<0&&(c="-",o=-o),1e-21<o)if(r=(n=function(t){for(var n=0,r=t;4096<=r;)n+=12,r/=4096;for(;2<=r;)n+=1,r/=2;return n}(o*g(2,69,1))-69)<0?o*g(2,-n,1):o/g(2,n,1),r*=4503599627370496,0<(n=52-n)){for(p(0,r),e=u;7<=e;)p(1e7,0),e-=7;for(p(g(10,e,1),0),e=n-1;23<=e;)v(1<<23),e-=23;v(1<<e),p(1,1),v(2),a=y()}else p(0,r),p(1<<-n,0),a=y()+l.call("0",u);return a=0<u?c+((i=a.length)<=u?"0."+l.call("0",u-i)+a:a.slice(0,i-u)+"."+a.slice(i-u)):c+a}})},{133:133,139:139,34:34,62:62,64:64}],212:[function(t,n,r){"use strict";var e=t(62),i=t(64),o=t(34),u=1..toPrecision;e(e.P+e.F*(i(function(){return"1"!==u.call(1,void 0)})||!i(function(){u.call({})})),"Number",{toPrecision:function toPrecision(t){var n=o(this,"Number#toPrecision: incorrect invocation!");return void 0===t?u.call(n):u.call(n,t)}})},{34:34,62:62,64:64}],213:[function(t,n,r){var e=t(62);e(e.S+e.F,"Object",{assign:t(97)})},{62:62,97:97}],214:[function(t,n,r){var e=t(62);e(e.S,"Object",{create:t(98)})},{62:62,98:98}],215:[function(t,n,r){var e=t(62);e(e.S+e.F*!t(58),"Object",{defineProperties:t(100)})},{100:100,58:58,62:62}],216:[function(t,n,r){var e=t(62);e(e.S+e.F*!t(58),"Object",{defineProperty:t(99).f})},{58:58,62:62,99:99}],217:[function(t,n,r){var e=t(81),i=t(94).onFreeze;t(109)("freeze",function(n){return function freeze(t){return n&&e(t)?n(i(t)):t}})},{109:109,81:81,94:94}],218:[function(t,n,r){var e=t(140),i=t(101).f;t(109)("getOwnPropertyDescriptor",function(){return function getOwnPropertyDescriptor(t,n){return i(e(t),n)}})},{101:101,109:109,140:140}],219:[function(t,n,r){t(109)("getOwnPropertyNames",function(){return t(102).f})},{102:102,109:109}],220:[function(t,n,r){var e=t(142),i=t(105);t(109)("getPrototypeOf",function(){return function getPrototypeOf(t){return i(e(t))}})},{105:105,109:109,142:142}],221:[function(t,n,r){var e=t(81);t(109)("isExtensible",function(n){return function isExtensible(t){return!!e(t)&&(!n||n(t))}})},{109:109,81:81}],222:[function(t,n,r){var e=t(81);t(109)("isFrozen",function(n){return function isFrozen(t){return!e(t)||!!n&&n(t)}})},{109:109,81:81}],223:[function(t,n,r){var e=t(81);t(109)("isSealed",function(n){return function isSealed(t){return!e(t)||!!n&&n(t)}})},{109:109,81:81}],224:[function(t,n,r){var e=t(62);e(e.S,"Object",{is:t(121)})},{121:121,62:62}],225:[function(t,n,r){var e=t(142),i=t(107);t(109)("keys",function(){return function keys(t){return i(e(t))}})},{107:107,109:109,142:142}],226:[function(t,n,r){var e=t(81),i=t(94).onFreeze;t(109)("preventExtensions",function(n){return function preventExtensions(t){return n&&e(t)?n(i(t)):t}})},{109:109,81:81,94:94}],227:[function(t,n,r){var e=t(81),i=t(94).onFreeze;t(109)("seal",function(n){return function seal(t){return n&&e(t)?n(i(t)):t}})},{109:109,81:81,94:94}],228:[function(t,n,r){var e=t(62);e(e.S,"Object",{setPrototypeOf:t(122).set})},{122:122,62:62}],229:[function(t,n,r){"use strict";var e=t(47),i={};i[t(152)("toStringTag")]="z",i+""!="[object z]"&&t(118)(Object.prototype,"toString",function toString(){return"[object "+e(this)+"]"},!0)},{118:118,152:152,47:47}],230:[function(t,n,r){var e=t(62),i=t(112);e(e.G+e.F*(parseFloat!=i),{parseFloat:i})},{112:112,62:62}],231:[function(t,n,r){var e=t(62),i=t(113);e(e.G+e.F*(parseInt!=i),{parseInt:i})},{113:113,62:62}],232:[function(r,t,n){"use strict";var e,i,o,u,c=r(89),a=r(70),f=r(54),s=r(47),l=r(62),h=r(81),p=r(33),v=r(37),y=r(68),g=r(127),d=r(136).set,x=r(95)(),m=r(96),b=r(114),S=r(148),w=r(115),_="Promise",E=a.TypeError,F=a.process,I=F&&F.versions,O=I&&I.v8||"",P=a[_],A="process"==s(F),M=function(){},k=i=m.f,N=!!function(){try{var t=P.resolve(1),n=(t.constructor={})[r(152)("species")]=function(t){t(M,M)};return(A||"function"==typeof PromiseRejectionEvent)&&t.then(M)instanceof n&&0!==O.indexOf("6.6")&&-1===S.indexOf("Chrome/66")}catch(t){}}(),j=function(t){var n;return!(!h(t)||"function"!=typeof(n=t.then))&&n},T=function(s,r){if(!s._n){s._n=!0;var e=s._c;x(function(){for(var a=s._v,f=1==s._s,t=0,n=function(t){var n,r,e,i=f?t.ok:t.fail,o=t.resolve,u=t.reject,c=t.domain;try{i?(f||(2==s._h&&C(s),s._h=1),!0===i?n=a:(c&&c.enter(),n=i(a),c&&(c.exit(),e=!0)),n===t.promise?u(E("Promise-chain cycle")):(r=j(n))?r.call(n,o,u):o(n)):u(a)}catch(t){c&&!e&&c.exit(),u(t)}};e.length>t;)n(e[t++]);s._c=[],s._n=!1,r&&!s._h&&R(s)})}},R=function(o){d.call(a,function(){var t,n,r,e=o._v,i=L(o);if(i&&(t=b(function(){A?F.emit("unhandledRejection",e,o):(n=a.onunhandledrejection)?n({promise:o,reason:e}):(r=a.console)&&r.error&&r.error("Unhandled promise rejection",e)}),o._h=A||L(o)?2:1),o._a=void 0,i&&t.e)throw t.v})},L=function(t){return 1!==t._h&&0===(t._a||t._c).length},C=function(n){d.call(a,function(){var t;A?F.emit("rejectionHandled",n):(t=a.onrejectionhandled)&&t({promise:n,reason:n._v})})},G=function(t){var n=this;n._d||(n._d=!0,(n=n._w||n)._v=t,n._s=2,n._a||(n._a=n._c.slice()),T(n,!0))},D=function(t){var r,e=this;if(!e._d){e._d=!0,e=e._w||e;try{if(e===t)throw E("Promise can't be resolved itself");(r=j(t))?x(function(){var n={_w:e,_d:!1};try{r.call(t,f(D,n,1),f(G,n,1))}catch(t){G.call(n,t)}}):(e._v=t,e._s=1,T(e,!1))}catch(t){G.call({_w:e,_d:!1},t)}}};N||(P=function Promise(t){v(this,P,_,"_h"),p(t),e.call(this);try{t(f(D,this,1),f(G,this,1))}catch(t){G.call(this,t)}},(e=function Promise(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1}).prototype=r(117)(P.prototype,{then:function then(t,n){var r=k(g(this,P));return r.ok="function"!=typeof t||t,r.fail="function"==typeof n&&n,r.domain=A?F.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&T(this,!1),r.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new e;this.promise=t,this.resolve=f(D,t,1),this.reject=f(G,t,1)},m.f=k=function(t){return t===P||t===u?new o(t):i(t)}),l(l.G+l.W+l.F*!N,{Promise:P}),r(124)(P,_),r(123)(_),u=r(52)[_],l(l.S+l.F*!N,_,{reject:function reject(t){var n=k(this);return(0,n.reject)(t),n.promise}}),l(l.S+l.F*(c||!N),_,{resolve:function resolve(t){return w(c&&this===u?P:this,t)}}),l(l.S+l.F*!(N&&r(86)(function(t){P.all(t).catch(M)})),_,{all:function all(t){var u=this,n=k(u),c=n.resolve,a=n.reject,r=b(function(){var e=[],i=0,o=1;y(t,!1,function(t){var n=i++,r=!1;e.push(void 0),o++,u.resolve(t).then(function(t){r||(r=!0,e[n]=t,--o||c(e))},a)}),--o||c(e)});return r.e&&a(r.v),n.promise},race:function race(t){var n=this,r=k(n),e=r.reject,i=b(function(){y(t,!1,function(t){n.resolve(t).then(r.resolve,e)})});return i.e&&e(i.v),r.promise}})},{114:114,115:115,117:117,123:123,124:124,127:127,136:136,148:148,152:152,33:33,37:37,47:47,52:52,54:54,62:62,68:68,70:70,81:81,86:86,89:89,95:95,96:96}],233:[function(t,n,r){var e=t(62),o=t(33),u=t(38),c=(t(70).Reflect||{}).apply,a=Function.apply;e(e.S+e.F*!t(64)(function(){c(function(){})}),"Reflect",{apply:function apply(t,n,r){var e=o(t),i=u(r);return c?c(e,n,i):a.call(e,n,i)}})},{33:33,38:38,62:62,64:64,70:70}],234:[function(t,n,r){var e=t(62),c=t(98),a=t(33),f=t(38),s=t(81),i=t(64),l=t(46),h=(t(70).Reflect||{}).construct,p=i(function(){function F(){}return!(h(function(){},[],F)instanceof F)}),v=!i(function(){h(function(){})});e(e.S+e.F*(p||v),"Reflect",{construct:function construct(t,n){a(t),f(n);var r=arguments.length<3?t:a(arguments[2]);if(v&&!p)return h(t,n,r);if(t==r){switch(n.length){case 0:return new t;case 1:return new t(n[0]);case 2:return new t(n[0],n[1]);case 3:return new t(n[0],n[1],n[2]);case 4:return new t(n[0],n[1],n[2],n[3])}var e=[null];return e.push.apply(e,n),new(l.apply(t,e))}var i=r.prototype,o=c(s(i)?i:Object.prototype),u=Function.apply.call(t,o,n);return s(u)?u:o}})},{33:33,38:38,46:46,62:62,64:64,70:70,81:81,98:98}],235:[function(t,n,r){var e=t(99),i=t(62),o=t(38),u=t(143);i(i.S+i.F*t(64)(function(){Reflect.defineProperty(e.f({},1,{value:1}),1,{value:2})}),"Reflect",{defineProperty:function defineProperty(t,n,r){o(t),n=u(n,!0),o(r);try{return e.f(t,n,r),!0}catch(t){return!1}}})},{143:143,38:38,62:62,64:64,99:99}],236:[function(t,n,r){var e=t(62),i=t(101).f,o=t(38);e(e.S,"Reflect",{deleteProperty:function deleteProperty(t,n){var r=i(o(t),n);return!(r&&!r.configurable)&&delete t[n]}})},{101:101,38:38,62:62}],237:[function(t,n,r){"use strict";var e=t(62),i=t(38),o=function(t){this._t=i(t),this._i=0;var n,r=this._k=[];for(n in t)r.push(n)};t(84)(o,"Object",function(){var t,n=this._k;do{if(this._i>=n.length)return{value:void 0,done:!0}}while(!((t=n[this._i++])in this._t));return{value:t,done:!1}}),e(e.S,"Reflect",{enumerate:function enumerate(t){return new o(t)}})},{38:38,62:62,84:84}],238:[function(t,n,r){var e=t(101),i=t(62),o=t(38);i(i.S,"Reflect",{getOwnPropertyDescriptor:function getOwnPropertyDescriptor(t,n){return e.f(o(t),n)}})},{101:101,38:38,62:62}],239:[function(t,n,r){var e=t(62),i=t(105),o=t(38);e(e.S,"Reflect",{getPrototypeOf:function getPrototypeOf(t){return i(o(t))}})},{105:105,38:38,62:62}],240:[function(t,n,r){var o=t(101),u=t(105),c=t(71),e=t(62),a=t(81),f=t(38);e(e.S,"Reflect",{get:function get(t,n){var r,e,i=arguments.length<3?t:arguments[2];return f(t)===i?t[n]:(r=o.f(t,n))?c(r,"value")?r.value:void 0!==r.get?r.get.call(i):void 0:a(e=u(t))?get(e,n,i):void 0}})},{101:101,105:105,38:38,62:62,71:71,81:81}],241:[function(t,n,r){var e=t(62);e(e.S,"Reflect",{has:function has(t,n){return n in t}})},{62:62}],242:[function(t,n,r){var e=t(62),i=t(38),o=Object.isExtensible;e(e.S,"Reflect",{isExtensible:function isExtensible(t){return i(t),!o||o(t)}})},{38:38,62:62}],243:[function(t,n,r){var e=t(62);e(e.S,"Reflect",{ownKeys:t(111)})},{111:111,62:62}],244:[function(t,n,r){var e=t(62),i=t(38),o=Object.preventExtensions;e(e.S,"Reflect",{preventExtensions:function preventExtensions(t){i(t);try{return o&&o(t),!0}catch(t){return!1}}})},{38:38,62:62}],245:[function(t,n,r){var e=t(62),i=t(122);i&&e(e.S,"Reflect",{setPrototypeOf:function setPrototypeOf(t,n){i.check(t,n);try{return i.set(t,n),!0}catch(t){return!1}}})},{122:122,62:62}],246:[function(t,n,r){var c=t(99),a=t(101),f=t(105),s=t(71),e=t(62),l=t(116),h=t(38),p=t(81);e(e.S,"Reflect",{set:function set(t,n,r){var e,i,o=arguments.length<4?t:arguments[3],u=a.f(h(t),n);if(!u){if(p(i=f(t)))return set(i,n,r,o);u=l(0)}if(s(u,"value")){if(!1===u.writable||!p(o))return!1;if(e=a.f(o,n)){if(e.get||e.set||!1===e.writable)return!1;e.value=r,c.f(o,n,e)}else c.f(o,n,l(0,r));return!0}return void 0!==u.set&&(u.set.call(o,r),!0)}})},{101:101,105:105,116:116,38:38,62:62,71:71,81:81,99:99}],247:[function(t,n,r){var e=t(70),o=t(75),i=t(99).f,u=t(103).f,c=t(82),a=t(66),f=e.RegExp,s=f,l=f.prototype,h=/a/g,p=/a/g,v=new f(h)!==h;if(t(58)&&(!v||t(64)(function(){return p[t(152)("match")]=!1,f(h)!=h||f(p)==p||"/a/i"!=f(h,"i")}))){f=function RegExp(t,n){var r=this instanceof f,e=c(t),i=void 0===n;return!r&&e&&t.constructor===f&&i?t:o(v?new s(e&&!i?t.source:t,n):s((e=t instanceof f)?t.source:t,e&&i?a.call(t):n),r?this:l,f)};for(var y=function(n){n in f||i(f,n,{configurable:!0,get:function(){return s[n]},set:function(t){s[n]=t}})},g=u(s),d=0;g.length>d;)y(g[d++]);(l.constructor=f).prototype=l,t(118)(e,"RegExp",f)}t(123)("RegExp")},{103:103,118:118,123:123,152:152,58:58,64:64,66:66,70:70,75:75,82:82,99:99}],248:[function(t,n,r){"use strict";var e=t(120);t(62)({target:"RegExp",proto:!0,forced:e!==/./.exec},{exec:e})},{120:120,62:62}],249:[function(t,n,r){t(58)&&"g"!=/./g.flags&&t(99).f(RegExp.prototype,"flags",{configurable:!0,get:t(66)})},{58:58,66:66,99:99}],250:[function(t,n,r){"use strict";var l=t(38),h=t(141),p=t(36),v=t(119);t(65)("match",1,function(e,i,f,s){return[function match(t){var n=e(this),r=null==t?void 0:t[i];return void 0!==r?r.call(t,n):new RegExp(t)[i](String(n))},function(t){var n=s(f,t,this);if(n.done)return n.value;var r=l(t),e=String(this);if(!r.global)return v(r,e);for(var i,o=r.unicode,u=[],c=r.lastIndex=0;null!==(i=v(r,e));){var a=String(i[0]);""===(u[c]=a)&&(r.lastIndex=p(e,h(r.lastIndex),o)),c++}return 0===c?null:u}]})},{119:119,141:141,36:36,38:38,65:65}],251:[function(t,n,r){"use strict";var _=t(38),e=t(142),E=t(141),F=t(139),I=t(36),O=t(119),P=Math.max,A=Math.min,h=Math.floor,p=/\$([$&`']|\d\d?|<[^>]*>)/g,v=/\$([$&`']|\d\d?)/g;t(65)("replace",2,function(i,o,S,w){return[function replace(t,n){var r=i(this),e=null==t?void 0:t[o];return void 0!==e?e.call(t,r,n):S.call(String(r),t,n)},function(t,n){var r=w(S,t,this,n);if(r.done)return r.value;var e=_(t),i=String(this),o="function"==typeof n;o||(n=String(n));var u=e.global;if(u){var c=e.unicode;e.lastIndex=0}for(var a=[];;){var f=O(e,i);if(null===f)break;if(a.push(f),!u)break;""===String(f[0])&&(e.lastIndex=I(i,E(e.lastIndex),c))}for(var s,l="",h=0,p=0;p<a.length;p++){f=a[p];for(var v=String(f[0]),y=P(A(F(f.index),i.length),0),g=[],d=1;d<f.length;d++)g.push(void 0===(s=f[d])?s:String(s));var x=f.groups;if(o){var m=[v].concat(g,y,i);void 0!==x&&m.push(x);var b=String(n.apply(void 0,m))}else b=getSubstitution(v,i,y,g,x,n);h<=y&&(l+=i.slice(h,y)+b,h=y+v.length)}return l+i.slice(h)}];function getSubstitution(o,u,c,a,f,t){var s=c+o.length,l=a.length,n=v;return void 0!==f&&(f=e(f),n=p),S.call(t,n,function(t,n){var r;switch(n.charAt(0)){case"$":return"$";case"&":return o;case"`":return u.slice(0,c);case"'":return u.slice(s);case"<":r=f[n.slice(1,-1)];break;default:var e=+n;if(0===e)return t;if(l<e){var i=h(e/10);return 0===i?t:i<=l?void 0===a[i-1]?n.charAt(1):a[i-1]+n.charAt(1):t}r=a[e-1]}return void 0===r?"":r})}})},{119:119,139:139,141:141,142:142,36:36,38:38,65:65}],252:[function(t,n,r){"use strict";var a=t(38),f=t(121),s=t(119);t(65)("search",1,function(e,i,u,c){return[function search(t){var n=e(this),r=null==t?void 0:t[i];return void 0!==r?r.call(t,n):new RegExp(t)[i](String(n))},function(t){var n=c(u,t,this);if(n.done)return n.value;var r=a(t),e=String(this),i=r.lastIndex;f(i,0)||(r.lastIndex=0);var o=s(r,e);return f(r.lastIndex,i)||(r.lastIndex=i),null===o?-1:o.index}]})},{119:119,121:121,38:38,65:65}],253:[function(t,n,r){"use strict";var l=t(82),m=t(38),b=t(127),S=t(36),w=t(141),_=t(119),h=t(120),e=t(64),E=Math.min,p=[].push,u="split",v="length",y="lastIndex",F=4294967295,I=!e(function(){RegExp(F,"y")});t(65)("split",2,function(i,o,g,d){var x;return x="c"=="abbc"[u](/(b)*/)[1]||4!="test"[u](/(?:)/,-1)[v]||2!="ab"[u](/(?:ab)*/)[v]||4!="."[u](/(.?)(.?)/)[v]||1<"."[u](/()()/)[v]||""[u](/.?/)[v]?function(t,n){var r=String(this);if(void 0===t&&0===n)return[];if(!l(t))return g.call(r,t,n);for(var e,i,o,u=[],c=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),a=0,f=void 0===n?F:n>>>0,s=new RegExp(t.source,c+"g");(e=h.call(s,r))&&!(a<(i=s[y])&&(u.push(r.slice(a,e.index)),1<e[v]&&e.index<r[v]&&p.apply(u,e.slice(1)),o=e[0][v],a=i,u[v]>=f));)s[y]===e.index&&s[y]++;return a===r[v]?!o&&s.test("")||u.push(""):u.push(r.slice(a)),u[v]>f?u.slice(0,f):u}:"0"[u](void 0,0)[v]?function(t,n){return void 0===t&&0===n?[]:g.call(this,t,n)}:g,[function split(t,n){var r=i(this),e=null==t?void 0:t[o];return void 0!==e?e.call(t,r,n):x.call(String(r),t,n)},function(t,n){var r=d(x,t,this,n,x!==g);if(r.done)return r.value;var e=m(t),i=String(this),o=b(e,RegExp),u=e.unicode,c=(e.ignoreCase?"i":"")+(e.multiline?"m":"")+(e.unicode?"u":"")+(I?"y":"g"),a=new o(I?e:"^(?:"+e.source+")",c),f=void 0===n?F:n>>>0;if(0===f)return[];if(0===i.length)return null===_(a,i)?[i]:[];for(var s=0,l=0,h=[];l<i.length;){a.lastIndex=I?l:0;var p,v=_(a,I?i:i.slice(l));if(null===v||(p=E(w(a.lastIndex+(I?0:l)),i.length))===s)l=S(i,l,u);else{if(h.push(i.slice(s,l)),h.length===f)return h;for(var y=1;y<=v.length-1;y++)if(h.push(v[y]),h.length===f)return h;l=s=p}}return h.push(i.slice(s)),h}]})},{119:119,120:120,127:127,141:141,36:36,38:38,64:64,65:65,82:82}],254:[function(n,t,r){"use strict";n(249);var e=n(38),i=n(66),o=n(58),u="toString",c=/./[u],a=function(t){n(118)(RegExp.prototype,u,t,!0)};n(64)(function(){return"/a/b"!=c.call({source:"a",flags:"b"})})?a(function toString(){var t=e(this);return"/".concat(t.source,"/","flags"in t?t.flags:!o&&t instanceof RegExp?i.call(t):void 0)}):c.name!=u&&a(function toString(){return c.call(this)})},{118:118,249:249,38:38,58:58,64:64,66:66}],255:[function(t,n,r){"use strict";var e=t(49),i=t(149);n.exports=t(51)("Set",function(t){return function Set(){return t(this,0<arguments.length?arguments[0]:void 0)}},{add:function add(t){return e.def(i(this,"Set"),t=0===t?0:t,t)}},e)},{149:149,49:49,51:51}],256:[function(t,n,r){"use strict";t(131)("anchor",function(n){return function anchor(t){return n(this,"a","name",t)}})},{131:131}],257:[function(t,n,r){"use strict";t(131)("big",function(t){return function big(){return t(this,"big","","")}})},{131:131}],258:[function(t,n,r){"use strict";t(131)("blink",function(t){return function blink(){return t(this,"blink","","")}})},{131:131}],259:[function(t,n,r){"use strict";t(131)("bold",function(t){return function bold(){return t(this,"b","","")}})},{131:131}],260:[function(t,n,r){"use strict";var e=t(62),i=t(129)(!1);e(e.P,"String",{codePointAt:function codePointAt(t){return i(this,t)}})},{129:129,62:62}],261:[function(t,n,r){"use strict";var e=t(62),u=t(141),c=t(130),a="endsWith",f=""[a];e(e.P+e.F*t(63)(a),"String",{endsWith:function endsWith(t){var n=c(this,t,a),r=1<arguments.length?arguments[1]:void 0,e=u(n.length),i=void 0===r?e:Math.min(u(r),e),o=String(t);return f?f.call(n,o,i):n.slice(i-o.length,i)===o}})},{130:130,141:141,62:62,63:63}],262:[function(t,n,r){"use strict";t(131)("fixed",function(t){return function fixed(){return t(this,"tt","","")}})},{131:131}],263:[function(t,n,r){"use strict";t(131)("fontcolor",function(n){return function fontcolor(t){return n(this,"font","color",t)}})},{131:131}],264:[function(t,n,r){"use strict";t(131)("fontsize",function(n){return function fontsize(t){return n(this,"font","size",t)}})},{131:131}],265:[function(t,n,r){var e=t(62),o=t(137),u=String.fromCharCode,i=String.fromCodePoint;e(e.S+e.F*(!!i&&1!=i.length),"String",{fromCodePoint:function fromCodePoint(t){for(var n,r=[],e=arguments.length,i=0;i<e;){if(n=+arguments[i++],o(n,1114111)!==n)throw RangeError(n+" is not a valid code point");r.push(n<65536?u(n):u(55296+((n-=65536)>>10),n%1024+56320))}return r.join("")}})},{137:137,62:62}],266:[function(t,n,r){"use strict";var e=t(62),i=t(130),o="includes";e(e.P+e.F*t(63)(o),"String",{includes:function includes(t){return!!~i(this,t,o).indexOf(t,1<arguments.length?arguments[1]:void 0)}})},{130:130,62:62,63:63}],267:[function(t,n,r){"use strict";t(131)("italics",function(t){return function italics(){return t(this,"i","","")}})},{131:131}],268:[function(t,n,r){"use strict";var e=t(129)(!0);t(85)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,n=this._t,r=this._i;return r>=n.length?{value:void 0,done:!0}:(t=e(n,r),this._i+=t.length,{value:t,done:!1})})},{129:129,85:85}],269:[function(t,n,r){"use strict";t(131)("link",function(n){return function link(t){return n(this,"a","href",t)}})},{131:131}],270:[function(t,n,r){var e=t(62),u=t(140),c=t(141);e(e.S,"String",{raw:function raw(t){for(var n=u(t.raw),r=c(n.length),e=arguments.length,i=[],o=0;o<r;)i.push(String(n[o++])),o<e&&i.push(String(arguments[o]));return i.join("")}})},{140:140,141:141,62:62}],271:[function(t,n,r){var e=t(62);e(e.P,"String",{repeat:t(133)})},{133:133,62:62}],272:[function(t,n,r){"use strict";t(131)("small",function(t){return function small(){return t(this,"small","","")}})},{131:131}],273:[function(t,n,r){"use strict";var e=t(62),i=t(141),o=t(130),u="startsWith",c=""[u];e(e.P+e.F*t(63)(u),"String",{startsWith:function startsWith(t){var n=o(this,t,u),r=i(Math.min(1<arguments.length?arguments[1]:void 0,n.length)),e=String(t);return c?c.call(n,e,r):n.slice(r,r+e.length)===e}})},{130:130,141:141,62:62,63:63}],274:[function(t,n,r){"use strict";t(131)("strike",function(t){return function strike(){return t(this,"strike","","")}})},{131:131}],275:[function(t,n,r){"use strict";t(131)("sub",function(t){return function sub(){return t(this,"sub","","")}})},{131:131}],276:[function(t,n,r){"use strict";t(131)("sup",function(t){return function sup(){return t(this,"sup","","")}})},{131:131}],277:[function(t,n,r){"use strict";t(134)("trim",function(t){return function trim(){return t(this,3)}})},{134:134}],278:[function(t,n,r){"use strict";var e=t(70),u=t(71),i=t(58),o=t(62),c=t(118),a=t(94).KEY,f=t(64),s=t(126),l=t(124),h=t(147),p=t(152),v=t(151),y=t(150),g=t(61),d=t(79),x=t(38),m=t(81),b=t(140),S=t(143),w=t(116),_=t(98),E=t(102),F=t(101),I=t(99),O=t(107),P=F.f,A=I.f,M=E.f,k=e.Symbol,N=e.JSON,j=N&&N.stringify,T="prototype",R=p("_hidden"),L=p("toPrimitive"),C={}.propertyIsEnumerable,G=s("symbol-registry"),D=s("symbols"),U=s("op-symbols"),W=Object[T],V="function"==typeof k,B=e.QObject,z=!B||!B[T]||!B[T].findChild,q=i&&f(function(){return 7!=_(A({},"a",{get:function(){return A(this,"a",{value:7}).a}})).a})?function(t,n,r){var e=P(W,n);e&&delete W[n],A(t,n,r),e&&t!==W&&A(W,n,e)}:A,Y=function(t){var n=D[t]=_(k[T]);return n._k=t,n},K=V&&"symbol"==typeof k.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof k},$=function defineProperty(t,n,r){return t===W&&$(U,n,r),x(t),n=S(n,!0),x(r),u(D,n)?(r.enumerable?(u(t,R)&&t[R][n]&&(t[R][n]=!1),r=_(r,{enumerable:w(0,!1)})):(u(t,R)||A(t,R,w(1,{})),t[R][n]=!0),q(t,n,r)):A(t,n,r)},J=function defineProperties(t,n){x(t);for(var r,e=g(n=b(n)),i=0,o=e.length;i<o;)$(t,r=e[i++],n[r]);return t},X=function propertyIsEnumerable(t){var n=C.call(this,t=S(t,!0));return!(this===W&&u(D,t)&&!u(U,t))&&(!(n||!u(this,t)||!u(D,t)||u(this,R)&&this[R][t])||n)},H=function getOwnPropertyDescriptor(t,n){if(t=b(t),n=S(n,!0),t!==W||!u(D,n)||u(U,n)){var r=P(t,n);return!r||!u(D,n)||u(t,R)&&t[R][n]||(r.enumerable=!0),r}},Z=function getOwnPropertyNames(t){for(var n,r=M(b(t)),e=[],i=0;r.length>i;)u(D,n=r[i++])||n==R||n==a||e.push(n);return e},Q=function getOwnPropertySymbols(t){for(var n,r=t===W,e=M(r?U:b(t)),i=[],o=0;e.length>o;)!u(D,n=e[o++])||r&&!u(W,n)||i.push(D[n]);return i};V||(c((k=function Symbol(){if(this instanceof k)throw TypeError("Symbol is not a constructor!");var n=h(0<arguments.length?arguments[0]:void 0),r=function(t){this===W&&r.call(U,t),u(this,R)&&u(this[R],n)&&(this[R][n]=!1),q(this,n,w(1,t))};return i&&z&&q(W,n,{configurable:!0,set:r}),Y(n)})[T],"toString",function toString(){return this._k}),F.f=H,I.f=$,t(103).f=E.f=Z,t(108).f=X,t(104).f=Q,i&&!t(89)&&c(W,"propertyIsEnumerable",X,!0),v.f=function(t){return Y(p(t))}),o(o.G+o.W+o.F*!V,{Symbol:k});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;tt.length>nt;)p(tt[nt++]);for(var rt=O(p.store),et=0;rt.length>et;)y(rt[et++]);o(o.S+o.F*!V,"Symbol",{for:function(t){return u(G,t+="")?G[t]:G[t]=k(t)},keyFor:function keyFor(t){if(!K(t))throw TypeError(t+" is not a symbol!");for(var n in G)if(G[n]===t)return n},useSetter:function(){z=!0},useSimple:function(){z=!1}}),o(o.S+o.F*!V,"Object",{create:function create(t,n){return void 0===n?_(t):J(_(t),n)},defineProperty:$,defineProperties:J,getOwnPropertyDescriptor:H,getOwnPropertyNames:Z,getOwnPropertySymbols:Q}),N&&o(o.S+o.F*(!V||f(function(){var t=k();return"[null]"!=j([t])||"{}"!=j({a:t})||"{}"!=j(Object(t))})),"JSON",{stringify:function stringify(t){for(var n,r,e=[t],i=1;arguments.length>i;)e.push(arguments[i++]);if(r=n=e[1],(m(n)||void 0!==t)&&!K(t))return d(n)||(n=function(t,n){if("function"==typeof r&&(n=r.call(this,t,n)),!K(n))return n}),e[1]=n,j.apply(N,e)}}),k[T][L]||t(72)(k[T],L,k[T].valueOf),l(k,"Symbol"),l(Math,"Math",!0),l(e.JSON,"JSON",!0)},{101:101,102:102,103:103,104:104,107:107,108:108,116:116,118:118,124:124,126:126,140:140,143:143,147:147,150:150,151:151,152:152,38:38,58:58,61:61,62:62,64:64,70:70,71:71,72:72,79:79,81:81,89:89,94:94,98:98,99:99}],279:[function(t,n,r){"use strict";var e=t(62),i=t(146),o=t(145),f=t(38),s=t(137),l=t(141),u=t(81),c=t(70).ArrayBuffer,h=t(127),p=o.ArrayBuffer,v=o.DataView,a=i.ABV&&c.isView,y=p.prototype.slice,g=i.VIEW,d="ArrayBuffer";e(e.G+e.W+e.F*(c!==p),{ArrayBuffer:p}),e(e.S+e.F*!i.CONSTR,d,{isView:function isView(t){return a&&a(t)||u(t)&&g in t}}),e(e.P+e.U+e.F*t(64)(function(){return!new p(2).slice(1,void 0).byteLength}),d,{slice:function slice(t,n){if(void 0!==y&&void 0===n)return y.call(f(this),t);for(var r=f(this).byteLength,e=s(t,r),i=s(void 0===n?r:n,r),o=new(h(this,p))(l(i-e)),u=new v(this),c=new v(o),a=0;e<i;)c.setUint8(a++,u.getUint8(e++));return o}}),t(123)(d)},{123:123,127:127,137:137,141:141,145:145,146:146,38:38,62:62,64:64,70:70,81:81}],280:[function(t,n,r){var e=t(62);e(e.G+e.W+e.F*!t(146).ABV,{DataView:t(145).DataView})},{145:145,146:146,62:62}],281:[function(t,n,r){t(144)("Float32",4,function(e){return function Float32Array(t,n,r){return e(this,t,n,r)}})},{144:144}],282:[function(t,n,r){t(144)("Float64",8,function(e){return function Float64Array(t,n,r){return e(this,t,n,r)}})},{144:144}],283:[function(t,n,r){t(144)("Int16",2,function(e){return function Int16Array(t,n,r){return e(this,t,n,r)}})},{144:144}],284:[function(t,n,r){t(144)("Int32",4,function(e){return function Int32Array(t,n,r){return e(this,t,n,r)}})},{144:144}],285:[function(t,n,r){t(144)("Int8",1,function(e){return function Int8Array(t,n,r){return e(this,t,n,r)}})},{144:144}],286:[function(t,n,r){t(144)("Uint16",2,function(e){return function Uint16Array(t,n,r){return e(this,t,n,r)}})},{144:144}],287:[function(t,n,r){t(144)("Uint32",4,function(e){return function Uint32Array(t,n,r){return e(this,t,n,r)}})},{144:144}],288:[function(t,n,r){t(144)("Uint8",1,function(e){return function Uint8Array(t,n,r){return e(this,t,n,r)}})},{144:144}],289:[function(t,n,r){t(144)("Uint8",1,function(e){return function Uint8ClampedArray(t,n,r){return e(this,t,n,r)}},!0)},{144:144}],290:[function(t,n,r){"use strict";var o,e=t(70),i=t(42)(0),u=t(118),c=t(94),a=t(97),f=t(50),s=t(81),l=t(149),h=t(149),p=!e.ActiveXObject&&"ActiveXObject"in e,v="WeakMap",y=c.getWeak,g=Object.isExtensible,d=f.ufstore,x=function(t){return function WeakMap(){return t(this,0<arguments.length?arguments[0]:void 0)}},m={get:function get(t){if(s(t)){var n=y(t);return!0===n?d(l(this,v)).get(t):n?n[this._i]:void 0}},set:function set(t,n){return f.def(l(this,v),t,n)}},b=n.exports=t(51)(v,x,m,f,!0,!0);h&&p&&(a((o=f.getConstructor(x,v)).prototype,m),c.NEED=!0,i(["delete","has","get","set"],function(e){var t=b.prototype,i=t[e];u(t,e,function(t,n){if(!s(t)||g(t))return i.call(this,t,n);this._f||(this._f=new o);var r=this._f[e](t,n);return"set"==e?this:r})}))},{118:118,149:149,42:42,50:50,51:51,70:70,81:81,94:94,97:97}],291:[function(t,n,r){"use strict";var e=t(50),i=t(149),o="WeakSet";t(51)(o,function(t){return function WeakSet(){return t(this,0<arguments.length?arguments[0]:void 0)}},{add:function add(t){return e.def(i(this,o),t,!0)}},e,!1,!0)},{149:149,50:50,51:51}],292:[function(t,n,r){"use strict";var e=t(62),i=t(67),o=t(142),u=t(141),c=t(33),a=t(45);e(e.P,"Array",{flatMap:function flatMap(t){var n,r,e=o(this);return c(t),n=u(e.length),r=a(e,0),i(r,e,e,n,0,1,t,arguments[1]),r}}),t(35)("flatMap")},{141:141,142:142,33:33,35:35,45:45,62:62,67:67}],293:[function(t,n,r){"use strict";var e=t(62),i=t(41)(!0);e(e.P,"Array",{includes:function includes(t){return i(this,t,1<arguments.length?arguments[1]:void 0)}}),t(35)("includes")},{35:35,41:41,62:62}],294:[function(t,n,r){var e=t(62),i=t(110)(!0);e(e.S,"Object",{entries:function entries(t){return i(t)}})},{110:110,62:62}],295:[function(t,n,r){var e=t(62),a=t(111),f=t(140),s=t(101),l=t(53);e(e.S,"Object",{getOwnPropertyDescriptors:function getOwnPropertyDescriptors(t){for(var n,r,e=f(t),i=s.f,o=a(e),u={},c=0;o.length>c;)void 0!==(r=i(e,n=o[c++]))&&l(u,n,r);return u}})},{101:101,111:111,140:140,53:53,62:62}],296:[function(t,n,r){var e=t(62),i=t(110)(!1);e(e.S,"Object",{values:function values(t){return i(t)}})},{110:110,62:62}],297:[function(t,n,r){"use strict";var e=t(62),i=t(52),o=t(70),u=t(127),c=t(115);e(e.P+e.R,"Promise",{finally:function(n){var r=u(this,i.Promise||o.Promise),t="function"==typeof n;return this.then(t?function(t){return c(r,n()).then(function(){return t})}:n,t?function(t){return c(r,n()).then(function(){throw t})}:n)}})},{115:115,127:127,52:52,62:62,70:70}],298:[function(t,n,r){"use strict";var e=t(62),i=t(132),o=t(148),u=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(o);e(e.P+e.F*u,"String",{padEnd:function padEnd(t){return i(this,t,1<arguments.length?arguments[1]:void 0,!1)}})},{132:132,148:148,62:62}],299:[function(t,n,r){"use strict";var e=t(62),i=t(132),o=t(148),u=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(o);e(e.P+e.F*u,"String",{padStart:function padStart(t){return i(this,t,1<arguments.length?arguments[1]:void 0,!0)}})},{132:132,148:148,62:62}],300:[function(t,n,r){"use strict";t(134)("trimLeft",function(t){return function trimLeft(){return t(this,1)}},"trimStart")},{134:134}],301:[function(t,n,r){"use strict";t(134)("trimRight",function(t){return function trimRight(){return t(this,2)}},"trimEnd")},{134:134}],302:[function(t,n,r){t(150)("asyncIterator")},{150:150}],303:[function(t,n,r){for(var e=t(164),i=t(107),o=t(118),u=t(70),c=t(72),a=t(88),f=t(152),s=f("iterator"),l=f("toStringTag"),h=a.Array,p={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},v=i(p),y=0;y<v.length;y++){var g,d=v[y],x=p[d],m=u[d],b=m&&m.prototype;if(b&&(b[s]||c(b,s,h),b[l]||c(b,l,d),a[d]=h,x))for(g in e)b[g]||o(b,g,e[g],!0)}},{107:107,118:118,152:152,164:164,70:70,72:72,88:88}],304:[function(t,n,r){var e=t(62),i=t(136);e(e.G+e.B,{setImmediate:i.set,clearImmediate:i.clear})},{136:136,62:62}],305:[function(t,n,r){var e=t(70),i=t(62),o=t(148),u=[].slice,c=/MSIE .\./.test(o),a=function(i){return function(t,n){var r=2<arguments.length,e=!!r&&u.call(arguments,2);return i(r?function(){("function"==typeof t?t:Function(t)).apply(this,e)}:t,n)}};i(i.G+i.B+i.F*c,{setTimeout:a(e.setTimeout),setInterval:a(e.setInterval)})},{148:148,62:62,70:70}],306:[function(t,n,r){t(305),t(304),t(303),n.exports=t(52)},{303:303,304:304,305:305,52:52}],307:[function(t,n,r){var e=function(o){"use strict";var c,t=Object.prototype,a=t.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},i=n.iterator||"@@iterator",r=n.asyncIterator||"@@asyncIterator",e=n.toStringTag||"@@toStringTag";function wrap(t,n,r,e){var i=n&&n.prototype instanceof Generator?n:Generator,o=Object.create(i.prototype),u=new Context(e||[]);return o._invoke=function makeInvokeMethod(o,u,c){var a=f;return function invoke(t,n){if(a===l)throw new Error("Generator is already running");if(a===h){if("throw"===t)throw n;return doneResult()}for(c.method=t,c.arg=n;;){var r=c.delegate;if(r){var e=maybeInvokeDelegate(r,c);if(e){if(e===p)continue;return e}}if("next"===c.method)c.sent=c._sent=c.arg;else if("throw"===c.method){if(a===f)throw a=h,c.arg;c.dispatchException(c.arg)}else"return"===c.method&&c.abrupt("return",c.arg);a=l;var i=tryCatch(o,u,c);if("normal"===i.type){if(a=c.done?h:s,i.arg===p)continue;return{value:i.arg,done:c.done}}"throw"===i.type&&(a=h,c.method="throw",c.arg=i.arg)}}}(t,r,u),o}function tryCatch(t,n,r){try{return{type:"normal",arg:t.call(n,r)}}catch(t){return{type:"throw",arg:t}}}o.wrap=wrap;var f="suspendedStart",s="suspendedYield",l="executing",h="completed",p={};function Generator(){}function GeneratorFunction(){}function GeneratorFunctionPrototype(){}var u={};u[i]=function(){return this};var v=Object.getPrototypeOf,y=v&&v(v(values([])));y&&y!==t&&a.call(y,i)&&(u=y);var g=GeneratorFunctionPrototype.prototype=Generator.prototype=Object.create(u);function defineIteratorMethods(t){["next","throw","return"].forEach(function(n){t[n]=function(t){return this._invoke(n,t)}})}function AsyncIterator(c){var t;this._invoke=function enqueue(r,e){function callInvokeWithMethodAndArg(){return new Promise(function(t,n){!function invoke(t,n,r,e){var i=tryCatch(c[t],c,n);if("throw"!==i.type){var o=i.arg,u=o.value;return u&&"object"==typeof u&&a.call(u,"__await")?Promise.resolve(u.__await).then(function(t){invoke("next",t,r,e)},function(t){invoke("throw",t,r,e)}):Promise.resolve(u).then(function(t){o.value=t,r(o)},function(t){return invoke("throw",t,r,e)})}e(i.arg)}(r,e,t,n)})}return t=t?t.then(callInvokeWithMethodAndArg,callInvokeWithMethodAndArg):callInvokeWithMethodAndArg()}}function maybeInvokeDelegate(t,n){var r=t.iterator[n.method];if(r===c){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=c,maybeInvokeDelegate(t,n),"throw"===n.method))return p;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return p}var e=tryCatch(r,t.iterator,n.arg);if("throw"===e.type)return n.method="throw",n.arg=e.arg,n.delegate=null,p;var i=e.arg;return i?i.done?(n[t.resultName]=i.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=c),n.delegate=null,p):i:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,p)}function pushTryEntry(t){var n={tryLoc:t[0]};1 in t&&(n.catchLoc=t[1]),2 in t&&(n.finallyLoc=t[2],n.afterLoc=t[3]),this.tryEntries.push(n)}function resetTryEntry(t){var n=t.completion||{};n.type="normal",delete n.arg,t.completion=n}function Context(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(pushTryEntry,this),this.reset(!0)}function values(t){if(t){var n=t[i];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,e=function next(){for(;++r<t.length;)if(a.call(t,r))return next.value=t[r],next.done=!1,next;return next.value=c,next.done=!0,next};return e.next=e}}return{next:doneResult}}function doneResult(){return{value:c,done:!0}}return GeneratorFunction.prototype=g.constructor=GeneratorFunctionPrototype,GeneratorFunctionPrototype.constructor=GeneratorFunction,GeneratorFunctionPrototype[e]=GeneratorFunction.displayName="GeneratorFunction",o.isGeneratorFunction=function(t){var n="function"==typeof t&&t.constructor;return!!n&&(n===GeneratorFunction||"GeneratorFunction"===(n.displayName||n.name))},o.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,GeneratorFunctionPrototype):(t.__proto__=GeneratorFunctionPrototype,e in t||(t[e]="GeneratorFunction")),t.prototype=Object.create(g),t},o.awrap=function(t){return{__await:t}},defineIteratorMethods(AsyncIterator.prototype),AsyncIterator.prototype[r]=function(){return this},o.AsyncIterator=AsyncIterator,o.async=function(t,n,r,e){var i=new AsyncIterator(wrap(t,n,r,e));return o.isGeneratorFunction(n)?i:i.next().then(function(t){return t.done?t.value:i.next()})},defineIteratorMethods(g),g[e]="Generator",g[i]=function(){return this},g.toString=function(){return"[object Generator]"},o.keys=function(n){var r=[];for(var t in n)r.push(t);return r.reverse(),function next(){for(;r.length;){var t=r.pop();if(t in n)return next.value=t,next.done=!1,next}return next.done=!0,next}},o.values=values,Context.prototype={constructor:Context,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=c,this.done=!1,this.delegate=null,this.method="next",this.arg=c,this.tryEntries.forEach(resetTryEntry),!t)for(var n in this)"t"===n.charAt(0)&&a.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=c)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(r){if(this.done)throw r;var e=this;function handle(t,n){return i.type="throw",i.arg=r,e.next=t,n&&(e.method="next",e.arg=c),!!n}for(var t=this.tryEntries.length-1;0<=t;--t){var n=this.tryEntries[t],i=n.completion;if("root"===n.tryLoc)return handle("end");if(n.tryLoc<=this.prev){var o=a.call(n,"catchLoc"),u=a.call(n,"finallyLoc");if(o&&u){if(this.prev<n.catchLoc)return handle(n.catchLoc,!0);if(this.prev<n.finallyLoc)return handle(n.finallyLoc)}else if(o){if(this.prev<n.catchLoc)return handle(n.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<n.finallyLoc)return handle(n.finallyLoc)}}}},abrupt:function(t,n){for(var r=this.tryEntries.length-1;0<=r;--r){var e=this.tryEntries[r];if(e.tryLoc<=this.prev&&a.call(e,"finallyLoc")&&this.prev<e.finallyLoc){var i=e;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=n&&n<=i.finallyLoc&&(i=null);var o=i?i.completion:{};return o.type=t,o.arg=n,i?(this.method="next",this.next=i.finallyLoc,p):this.complete(o)},complete:function(t,n){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&n&&(this.next=n),p},finish:function(t){for(var n=this.tryEntries.length-1;0<=n;--n){var r=this.tryEntries[n];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),resetTryEntry(r),p}},catch:function(t){for(var n=this.tryEntries.length-1;0<=n;--n){var r=this.tryEntries[n];if(r.tryLoc===t){var e=r.completion;if("throw"===e.type){var i=e.arg;resetTryEntry(r)}return i}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,r){return this.delegate={iterator:values(t),resultName:n,nextLoc:r},"next"===this.method&&(this.arg=c),p}},o}("object"==typeof n?n.exports:{});try{regeneratorRuntime=e}catch(t){Function("r","regeneratorRuntime = r")(e)}},{}]},{},[1]);
;
this.wp=this.wp||{},this.wp.i18n=function(t){var n={};function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=n,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,n){if(1&n&&(t=r(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(r.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)r.d(e,o,function(n){return t[n]}.bind(null,o));return e},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.p="",r(r.s=316)}({135:function(t,n,r){var e;!function(){"use strict";var o={not_string:/[^s]/,not_bool:/[^t]/,not_type:/[^T]/,not_primitive:/[^v]/,number:/[diefg]/,numeric_arg:/[bcdiefguxX]/,json:/[j]/,not_json:/[^j]/,text:/^[^\x25]+/,modulo:/^\x25{2}/,placeholder:/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,key:/^([a-z_][a-z_\d]*)/i,key_access:/^\.([a-z_][a-z_\d]*)/i,index_access:/^\[(\d+)\]/,sign:/^[\+\-]/};function i(t){return function(t,n){var r,e,u,a,s,c,f,l,p,d=1,g=t.length,h="";for(e=0;e<g;e++)if("string"==typeof t[e])h+=t[e];else if(Array.isArray(t[e])){if((a=t[e])[2])for(r=n[d],u=0;u<a[2].length;u++){if(!r.hasOwnProperty(a[2][u]))throw new Error(i('[sprintf] property "%s" does not exist',a[2][u]));r=r[a[2][u]]}else r=a[1]?n[a[1]]:n[d++];if(o.not_type.test(a[8])&&o.not_primitive.test(a[8])&&r instanceof Function&&(r=r()),o.numeric_arg.test(a[8])&&"number"!=typeof r&&isNaN(r))throw new TypeError(i("[sprintf] expecting number but found %T",r));switch(o.number.test(a[8])&&(l=r>=0),a[8]){case"b":r=parseInt(r,10).toString(2);break;case"c":r=String.fromCharCode(parseInt(r,10));break;case"d":case"i":r=parseInt(r,10);break;case"j":r=JSON.stringify(r,null,a[6]?parseInt(a[6]):0);break;case"e":r=a[7]?parseFloat(r).toExponential(a[7]):parseFloat(r).toExponential();break;case"f":r=a[7]?parseFloat(r).toFixed(a[7]):parseFloat(r);break;case"g":r=a[7]?String(Number(r.toPrecision(a[7]))):parseFloat(r);break;case"o":r=(parseInt(r,10)>>>0).toString(8);break;case"s":r=String(r),r=a[7]?r.substring(0,a[7]):r;break;case"t":r=String(!!r),r=a[7]?r.substring(0,a[7]):r;break;case"T":r=Object.prototype.toString.call(r).slice(8,-1).toLowerCase(),r=a[7]?r.substring(0,a[7]):r;break;case"u":r=parseInt(r,10)>>>0;break;case"v":r=r.valueOf(),r=a[7]?r.substring(0,a[7]):r;break;case"x":r=(parseInt(r,10)>>>0).toString(16);break;case"X":r=(parseInt(r,10)>>>0).toString(16).toUpperCase()}o.json.test(a[8])?h+=r:(!o.number.test(a[8])||l&&!a[3]?p="":(p=l?"+":"-",r=r.toString().replace(o.sign,"")),c=a[4]?"0"===a[4]?"0":a[4].charAt(1):" ",f=a[6]-(p+r).length,s=a[6]&&f>0?c.repeat(f):"",h+=a[5]?p+r+s:"0"===c?p+s+r:s+p+r)}return h}(function(t){if(a[t])return a[t];var n,r=t,e=[],i=0;for(;r;){if(null!==(n=o.text.exec(r)))e.push(n[0]);else if(null!==(n=o.modulo.exec(r)))e.push("%");else{if(null===(n=o.placeholder.exec(r)))throw new SyntaxError("[sprintf] unexpected placeholder");if(n[2]){i|=1;var u=[],s=n[2],c=[];if(null===(c=o.key.exec(s)))throw new SyntaxError("[sprintf] failed to parse named argument key");for(u.push(c[1]);""!==(s=s.substring(c[0].length));)if(null!==(c=o.key_access.exec(s)))u.push(c[1]);else{if(null===(c=o.index_access.exec(s)))throw new SyntaxError("[sprintf] failed to parse named argument key");u.push(c[1])}n[2]=u}else i|=2;if(3===i)throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");e.push(n)}r=r.substring(n[0].length)}return a[t]=e}(t),arguments)}function u(t,n){return i.apply(null,[t].concat(n||[]))}var a=Object.create(null);n.sprintf=i,n.vsprintf=u,"undefined"!=typeof window&&(window.sprintf=i,window.vsprintf=u,void 0===(e=function(){return{sprintf:i,vsprintf:u}}.call(n,r,n,t))||(t.exports=e))}()},316:function(t,n,r){"use strict";r.r(n);var e,o,i,u,a=r(7);e={"(":9,"!":8,"*":7,"/":7,"%":7,"+":6,"-":6,"<":5,"<=":5,">":5,">=":5,"==":4,"!=":4,"&&":3,"||":2,"?":1,"?:":1},o=["(","?"],i={")":["("],":":["?","?:"]},u=/<=|>=|==|!=|&&|\|\||\?:|\(|!|\*|\/|%|\+|-|<|>|\?|\)|:/;var s={"!":function(t){return!t},"*":function(t,n){return t*n},"/":function(t,n){return t/n},"%":function(t,n){return t%n},"+":function(t,n){return t+n},"-":function(t,n){return t-n},"<":function(t,n){return t<n},"<=":function(t,n){return t<=n},">":function(t,n){return t>n},">=":function(t,n){return t>=n},"==":function(t,n){return t===n},"!=":function(t,n){return t!==n},"&&":function(t,n){return t&&n},"||":function(t,n){return t||n},"?:":function(t,n,r){if(t)throw n;return r}};function c(t){var n=function(t){for(var n,r,a,s,c=[],f=[];n=t.match(u);){for(r=n[0],(a=t.substr(0,n.index).trim())&&c.push(a);s=f.pop();){if(i[r]){if(i[r][0]===s){r=i[r][1]||r;break}}else if(o.indexOf(s)>=0||e[s]<e[r]){f.push(s);break}c.push(s)}i[r]||f.push(r),t=t.substr(n.index+r.length)}return(t=t.trim())&&c.push(t),c.concat(f.reverse())}(t);return function(t){return function(t,n){var r,e,o,i,u,a,c=[];for(r=0;r<t.length;r++){if(u=t[r],i=s[u]){for(e=i.length,o=Array(e);e--;)o[e]=c.pop();try{a=i.apply(null,o)}catch(t){return t}}else a=n.hasOwnProperty(u)?n[u]:+u;c.push(a)}return c[0]}(n,t)}}var f={contextDelimiter:"",onMissingKey:null};function l(t,n){var r;for(r in this.data=t,this.pluralForms={},n=n||{},this.options={},f)this.options[r]=n[r]||f[r]}l.prototype.getPluralForm=function(t,n){var r,e,o,i,u=this.pluralForms[t];return u||("function"!=typeof(o=(r=this.data[t][""])["Plural-Forms"]||r["plural-forms"]||r.plural_forms)&&(e=function(t){var n,r,e;for(n=t.split(";"),r=0;r<n.length;r++)if(0===(e=n[r].trim()).indexOf("plural="))return e.substr(7)}(r["Plural-Forms"]||r["plural-forms"]||r.plural_forms),i=c(e),o=function(t){return+i({n:t})}),u=this.pluralForms[t]=o),u(n)},l.prototype.dcnpgettext=function(t,n,r,e,o){var i,u,a;return i=void 0===o?0:this.getPluralForm(t,o),u=r,n&&(u=n+this.options.contextDelimiter+r),(a=this.data[t][u])&&a[i]?a[i]:(this.options.onMissingKey&&this.options.onMissingKey(r,t),0===i?r:e)};var p=r(44),d=r.n(p),g=r(135),h=r.n(g);r.d(n,"setLocaleData",(function(){return x})),r.d(n,"__",(function(){return w})),r.d(n,"_x",(function(){return _})),r.d(n,"_n",(function(){return O})),r.d(n,"_nx",(function(){return j})),r.d(n,"sprintf",(function(){return S}));var v={"":{plural_forms:function(t){return 1===t?0:1}}},b=d()(console.error),y=new l({});function x(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"default";y.data[n]=Object(a.a)({},v,y.data[n],t),y.data[n][""]=Object(a.a)({},v[""],y.data[n][""])}function m(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"default",n=arguments.length>1?arguments[1]:void 0,r=arguments.length>2?arguments[2]:void 0,e=arguments.length>3?arguments[3]:void 0,o=arguments.length>4?arguments[4]:void 0;return y.data[t]||x(void 0,t),y.dcnpgettext(t,n,r,e,o)}function w(t,n){return m(n,void 0,t)}function _(t,n,r){return m(r,n,t)}function O(t,n,r,e){return m(e,void 0,t,n,r)}function j(t,n,r,e,o){return m(o,e,t,n,r)}function S(t){try{for(var n=arguments.length,r=new Array(n>1?n-1:0),e=1;e<n;e++)r[e-1]=arguments[e];return h.a.sprintf.apply(h.a,[t].concat(r))}catch(n){return b("sprintf error: \n\n"+n.toString()),t}}},44:function(t,n,r){t.exports=function(t,n){var r,e,o,i=0;function u(){var n,u,a=e,s=arguments.length;t:for(;a;){if(a.args.length===arguments.length){for(u=0;u<s;u++)if(a.args[u]!==arguments[u]){a=a.next;continue t}return a!==e&&(a===o&&(o=a.prev),a.prev.next=a.next,a.next&&(a.next.prev=a.prev),a.next=e,a.prev=null,e.prev=a,e=a),a.val}a=a.next}for(n=new Array(s),u=0;u<s;u++)n[u]=arguments[u];return a={args:n,val:t.apply(null,n)},e?(e.prev=a,a.next=e):o=a,i===r?(o=o.prev).next=null:i++,e=a,a.val}return n&&n.maxSize&&(r=n.maxSize),u.clear=function(){e=null,o=null,i=0},u}},7:function(t,n,r){"use strict";r.d(n,"a",(function(){return o}));var e=r(9);function o(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{},o=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(r).filter((function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable})))),o.forEach((function(n){Object(e.a)(t,n,r[n])}))}return t}},9:function(t,n,r){"use strict";function e(t,n,r){return n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r,t}r.d(n,"a",(function(){return e}))}});;
