var amcharts2={"cons":{"anim":{"fast":300,"norm":500,"slow":1500,"snail":10000}},"lazyLoad":{"interval":false,"inited":false,"active":false,"pending":[]},"loaded":{}};jQuery(function($){var doc=$(document),win=$(window),body=$("body");function scrollHandler(){if(doc.scrollTop()||win.scrollTop()){body.addClass("scrolled");}else{body.removeClass("scrolled");}
if(Math.round(win.scrollTop()+win.height())==doc.height()){body.addClass("bottom");}else{body.removeClass("bottom");}
amcharts2.processLazyLoad();amcharts2.processAffix();}
var resizeTimeout;win.on("resize",function(){if(resizeTimeout){clearTimeout(resizeTimeout);}
resizeTimeout=setTimeout(scrollHandler,100);});doc.on("scroll touchmove ready",scrollHandler);if(typeof document.onscroll=="undefined")
win.on("scroll",scrollHandler);$(".menu-toggle").on("click",function(){$("#"+$(this).data("controls")).toggleClass("open");});$(".toggle").on("click",function(){$("#"+$(this).data("controls")).toggle();});$("a > img.size-full, a > img.size-large, a > img.size-medium, a > img.size-thumbnail").on("click",function(){var title=$(this).prop("alt");$(this).parent("a").on("click",function(e){if(this.href.match(/\.png|\.jpg/)){e.preventDefault();amcharts2.showModal('<img src="'+this.href+'" />',title);}})});$(".modal-target").on("click",function(ev){ev.preventDefault();var href=$(this).prop("href");var title=$(this).prop("title")||"Demo";amcharts2.showModal('<iframe width="100%" height="98%" src="'+this.href+'" />',title);return;});if($(".cross-fader").length){setInterval(function(){$(".cross-fader").each(function(){var cf=$(this);var current=cf.find(".cross-fader-item.current");var next;if(current.length===0){cf.find(".cross-fader-item").first().addClass("current").fadeIn(amcharts2.cons.anim.slow);return;}else{next=current.next(".cross-fader-item")
if(!next.length===0)
next=cf.find(".cross-fader-item").first();}
current.removeClass("current").fadeOut(amcharts2.cons.anim.slow,function(){next.addClass("current").fadeIn(amcharts2.cons.anim.slow)});});},amcharts2.cons.anim.snail);}
if($(".anchor-title").length){function handleScrollAnchor(){var slot_offset=anchor_title_slot.offset();$("#demo-categories li").removeClass("current-menu-item");for(var i=anchor_titles.length-1;i>=0;i--){var title=$(anchor_titles[i]);var offset=title.offset();if(offset.top<slot_offset.top){var link_id=title.data("anchor-title-to");$("#anchor-to-"+link_id).addClass("current-menu-item");return;}}
var title=$(anchor_titles[0]);var link_id=title.data("anchor-title-to");$("#anchor-to-"+link_id).addClass("current-menu-item");}
var anchor_title_slot=$(".anchor-title-slot");var anchor_titles=$(".anchor-title");doc.on("scroll load touchmove",handleScrollAnchor);if(typeof document.onscroll=="undefined")
win.on("scroll",handleScrollAnchor);handleScrollAnchor();}
if(window.location.hash){setTimeout(function(){amcharts2.scrollTo(window.location.hash);},10);}
$("a.scroll-to").on("click",function(e){e.preventDefault()
amcharts2.scrollTo($(this).attr("href"));});$(".carousel").each(function(){var holder=$(this);var wrapper=holder.find(".carousel-wrapper");var carousel=wrapper.find(".carousel-items");var w=0,activeOffset=0,i=0,window_w=$(window).width(),current;carousel.find("li").each(function(){var itemWidth=$(this).outerWidth();if($(this).hasClass("active")){activeOffset=w+i;current=$(this);}
w+=itemWidth+10;i-=9;});carousel.css({"width":(w)+"px"});var maxSpeed=15,deadZone=0.4;holder.on("mousemove",function(e){wrapper.kinetic("stop");if(amcharts2.leftButtonDown){wrapper.kinetic("stop");return;}
var parentOffset=$(this).parent().offset();var relX=e.pageX-parentOffset.left;var w=$(this).width()/2;var offset=relX-w;if(Math.abs(relX-w)<(w*deadZone)){wrapper.kinetic("stop");return;}
var deadZoneW=w*(deadZone/2);var speed=maxSpeed*(offset/w);if(!carousel.data("stopped")){wrapper.kinetic("start",{velocity:speed});}
amcharts2.startLazyLoad();}).on("mouseleave",function(e){if(amcharts2.leftButtonDown)
return;wrapper.kinetic("stop");amcharts2.stopLazyLoad();});holder.find(".carousel-nav").on("mouseover",function(){carousel.data("stopped",true);}).on("mouseleave",function(){carousel.data("stopped",false);}).click(function(){carousel.data("stopped",false);wrapper.kinetic("stop");wrapper.kinetic("start",{velocity:$(this).hasClass("carousel-left")?-10:10});setTimeout(function(){wrapper.kinetic("stop");if(holder.find(".carousel-nav:hover").length)
carousel.data("stopped",true);},700);});wrapper.kinetic({"y":false});amcharts2.leftButtonDown=false;$(wrapper).on("mousedown",function(e){if(e.which===1)amcharts2.leftButtonDown=true;});$(wrapper).on("mouseup",function(e){if(e.which===1)amcharts2.leftButtonDown=false;});wrapper.prop("scrollLeft",activeOffset);holder.animate({"opacity":1},amcharts2.cons.anim.slow,amcharts2.processLazyLoad);});$(document).keyup(function(e){if(e.keyCode==27){amcharts2.closeModal();$("body").removeClass("search-open share-open");$("#masthead .search-form input.search-field").blur();}});amcharts2.processLazyLoad();amcharts2.processAffix();var search_open_timeout;$("#masthead .search-form input.search-submit").on("click",function(e){e.preventDefault();clearTimeout(search_open_timeout);if($("body").hasClass("search-open")&&$("#masthead .search-form input.search-field").val()!=""){$("#masthead .search-form").submit();return;}
search_open_timeout=setTimeout(function(){$("body").toggleClass("search-open");$("#masthead .search-form input.search-field").focus();},1);});$("#masthead .search-form input.search-field").on("blur",function(){clearTimeout(search_open_timeout);search_open_timeout=setTimeout(function(){$("body").removeClass("search-open");},100);});$("#masthead .share-this-toggle").on("click",function(){$("body").toggleClass("share-open");})
if($('.slider').length){setInterval(function(){$('.slider').each(function(){var slider=$(this);if(slider.data("paused"))
return;var page_links=slider.find(".slider-page-link").not(".slide-over");if(page_links.length>1){var current=slider.find(".slider-page-link.current");if(current.length===0)
current=page_links.first();var link=current.next(":not(.slide-over)");if(link.length===0)
link=page_links.first();var slide=link.data("slide");var x="-"+slide.css("left");slider.find(".slider-holder").css("margin-left",x);setNav(slider,x);}});},amcharts2.cons.anim.snail);$('.slider').each(function(){var slider=$(this);var mask=$("<div>").addClass("slider-mask");var holder=$("<div>").addClass("slider-holder trans-all").appendTo(mask);slider.find("> *").addClass("slider-slide").appendTo(holder);slider.append(mask);var prev=$("<a>").text("Previous slide").addClass("slider-nav slider-prev icon icon-next trans-all").appendTo(slider).data("slider",slider);var next=$("<a>").text("Next slide").addClass("slider-nav slider-next icon icon-prev trans-all").appendTo(slider).data("slider",slider);var slides=holder.find(".slider-slide");if(slides.length>1){var active_slides=slides.length-getSlides(slider)+1;var nav=$("<div>").addClass("slider-page-nav").appendTo(slider).data("slider",slider);var slide_no=1;slides.each(function(){var slide=$(this);var link=$("<a>").text("Go to slide #"+slide_no).addClass("slider-page-link trans-all").appendTo(nav).data("slider",slider).data("slide",slide).on("click",function(){var slide=$(this).data("slide");var x="-"+slide.css("left");holder.css("margin-left",x);setNav(slider,x);});if(slide_no>active_slides)
link.addClass("slide-over");slide_no++;})}
slider.on("click",".slider-nav",function(){var nav=$(this);if(nav.data("animating"))
return;nav.data("animating",true);var prev=nav.hasClass("slider-prev");var slider=nav.data("slider");var holder=slider.find(".slider-holder");var x=getPos(slider);var increment=Number(slider.data("slide_w"))+Number(slider.data("slide_gap"));var slides=getSlides(slider);var max=getMax(slider);if(prev){x+=increment;if(x>0)
x=0;}else{if(x<=max)
return;x-=increment;}
holder.css("margin-left",x);setNav(slider,x);setTimeout(function(){nav.data("animating",false);},amcharts2.cons.anim.norm);}).on("mouseenter",function(){slider.data("paused",true);}).on("mouseleave",function(){slider.data("paused",false);});positionSliderElements(slider);setNav(slider,0);slider.css("visibility","visible");});jQuery(window).on("resize",function(){$('.slider').each(function(){var slider=$(this);positionSliderElements(slider);setNav(slider);});});function setNav(slider,pos){if(atStart(slider,pos))
slider.find(".slider-prev").addClass("disabled");else
slider.find(".slider-prev").removeClass("disabled");if(atEnd(slider,pos))
slider.find(".slider-next").addClass("disabled");else
slider.find(".slider-next").removeClass("disabled");slider.find(".slider-page-link").removeClass("current").each(function(){var item=$(this).data("slide");if(getNumber(item.css("left"))==getNumber(pos)){$(this).addClass("current");return;}});}
function atStart(slider,pos){return pos===0;}
function atEnd(slider,pos){var slides=getSlides(slider);var increment=Number(slider.data("slide_w"))+Number(slider.data("slide_gap"));return pos<=getMax(slider);}
function getMax(slider){var slides=getSlides(slider);var items=slider.find(".slider-slide").length;var increment=Number(slider.data("slide_w"))+Number(slider.data("slide_gap"));return(items-slides)*increment*-1;}
function getPos(slider){return Number(slider.find(".slider-holder").css("margin-left").replace(/[^.0-9\-]/g,""));}
function getNumber(str){str=str+"";return str.replace(/[^.0-9]/g,"");}
function getSlides(slider){if(slider.width()<1036)
return 1;return Number(slider.data("slides"))}
function positionSliderElements(slider){var holder=slider.find(".slider-holder").css("margin-left",0);var mask=slider.find(".slider-mask");var w=slider.width();var slides=getSlides(slider);var slide_gap=25;var slide_w=(w-slide_gap*(slides-1))/slides;slider.data("slide_w",slide_w).data("slide_gap",slide_gap);var h=0,x=0,i=0;holder.find(".slider-slide").each(function(){var item=$(this);item.data("slide-index",i);i++;var item_h=item.outerHeight()
if(item_h>h)
h=item_h;item.css({"position":"absolute","top":0,"left":x,"width":slide_w});x+=slide_w+slide_gap;});if(slider.data("height"))
h=slider.data("height");mask.css("height",h);holder.css("height",h);}}
function checkLoginForm(){var login_missing=false;$("#loginform").find("#user_login, #user_pass, #user_name, #user_password").each(function(){if(this.value=="")
login_missing=true;});var agree_missing=false;$("#loginform").find("#user_agree").each(function(){var version=amcharts2.read_cookie("amcharts_last_accepted_policy_version");if(this.checked){amcharts2.create_cookie("amcharts_last_accepted_policy_version",amcharts2_policy_version,256);version=amcharts2_policy_version;}else{amcharts2.erase_cookie("amcharts_last_accepted_policy_version");version="";}
this.checked=(version&&version==amcharts2_policy_version)==true;if(!this.checked)
agree_missing=true;});if(login_missing||agree_missing)
$("#loginform #wp-submit").attr("disabled","disabled");else
$("#loginform #wp-submit").removeAttr("disabled");if(agree_missing)
$(".social-login .button").addClass("disabled");else
$(".social-login .button").removeClass("disabled");}
checkLoginForm();$("#loginform input").on("change keyup",checkLoginForm);$("ul.menu.page-menu li.menu-item.menu-item-type-custom a").each(function(){$("<i>").addClass("icon icon-outside").appendTo($(this));});$('.select-all-order-item').click(function(){$('.order-item').prop('checked',this.checked);amchartsSetOrderButton();});$('.order-item').click(function(){amchartsSetOrderButton();});$('.order-bt').click(function(e){var prods=[];var orders=[];var qtys=[];var coupons=[];$('.order-item:checked').each(function(){prods.push(this.value);orders.push('&for_'+this.value+'='+$(this).data('for'));if($(this).data('qty')>1)
qtys.push('&quantity_'+this.value+'='+$(this).data('qty'));if($(this).data('coupon')!='')
coupons.push($(this).data('coupon'));});var coupon='';if(coupons.length)
coupon='&coupon='+coupons.join(',')
if(prods.length){var url='https://amcharts.cleverbridge.com/403/?scope=checkout&currency=USD&cart='+prods.join(',')+orders.join('')+qtys.join('')+coupon;if(!ga){window.location.href=url;return;}
try{e.preventDefault();amcharts2.goToUrl(url);}catch(err){window.location.href=url;}}});function amchartsSetOrderButton(){if($('.order-item:checked').length)
$('.order-bt').prop('disabled',false);else
$('.order-bt').prop('disabled',true);}
$('.feedback-vertical').each(function(){var holder=$(this);function scheduleNext(){var duration=holder.find('.feedback-item:first').text().length*200;if(duration<4000)
duration=4000;else if(duration>8000)
duration=8000;setTimeout(function(){if(!holder.is(':hover'))
holder.find('.feedback-item:last').hide().prependTo(holder).fadeIn(amcharts2.cons.anim.slow);scheduleNext();},duration);}
scheduleNext();});$('.downloads-table a.button').on('click',function(){ga('send','event','Downloads','download',$(this).prop('href'));});$(".subscribe_news a").on("click",function(ev){ev.preventDefault();amcharts2.subscribeNews();});amcharts2.notices=0;function processNotices(){var version=amcharts2.read_cookie("amcharts_last_accepted_policy_version");if(!version||version!=amcharts2_policy_version){amcharts2.notices++;$("#notice_policy").addClass("visible");$("#notice_policy .button").on("click",function(){amcharts2.create_cookie("amcharts_last_accepted_policy_version",amcharts2_policy_version,256);$("#notice_policy").fadeOut();amcharts2.notices--;amcharts2.processNoticeBody();});}
if(!amcharts2.read_cookie("amcharts_news_subscribed")&&!amcharts2.read_cookie("amcharts_news_not_interested")){amcharts2.notices++;$("#subscribe_news").addClass("visible");$("#subscribe_news .button.agree").on("click",function(){amcharts2.subscribeNews();});$("#subscribe_news .button.not_interested").on("click",function(){amcharts2.create_cookie("amcharts_news_not_interested",1,100);$("#subscribe_news").fadeOut();amcharts2.notices--;amcharts2.processNoticeBody();});}
amcharts2.processNoticeBody();}
processNotices();$(".site-header .close").on("click",function(){$("#page").removeClass("with-banner");amcharts2.create_cookie("amcharts_banner_closed",1,20);});});amcharts2.processNoticeBody=function(){var $=jQuery;$("body").removeClass("notice-0 notice-1 notice-2 notice-3 notice-present").addClass("notice-"+amcharts2.notices);if(amcharts2.notices){$("body").addClass("notice-present");}}
amcharts2.subscribeNews=function(){var $=jQuery;require(["mojo/signup-forms/Loader"],function(L){L.start({"baseUrl":"mc.us1.list-manage.com","uuid":"0a74d1bfdc666e9fa96b39e15","lid":"c06757a41b"})});amcharts2.create_cookie("amcharts_news_subscribed",1,500);amcharts2.erase_cookie("MCPopupClosed");amcharts2.notices--;amcharts2.processNoticeBody();$("#subscribe_news").hide();}
amcharts2.subscribeDataviz=function(){var $=jQuery;require(["mojo/signup-forms/Loader"],function(L){L.start({"baseUrl":"mc.us1.list-manage.com","uuid":"0a74d1bfdc666e9fa96b39e15","lid":"f7af0fa56b"})})
amcharts2.create_cookie("amcharts_dataviz_subscribed",1,500);amcharts2.erase_cookie("MCPopupClosed");$("#subscribe_dataviz").hide();amcharts2.notices--;amcharts2.processNoticeBody();}
amcharts2.getQueryVar=function(variable){var query=window.location.search.substring(1);var vars=query.split("&");for(var i=0;i<vars.length;i++){var pair=vars[i].split("=");if(pair[0]==variable){return pair[1];}}
return(false);}
amcharts2.scrollTo=function(hash){var $=jQuery;if($(hash).length==0){return;}
$("html, body").animate({"scrollTop":$(hash).offset().top},800,function(){window.location.hash=hash;});}
amcharts2.updateParamLinks=function(){var $=jQuery;$("a.param").each(function(){var link=$(this);var param=link.data("param");var value=amcharts2.getQueryVar(param);var parts=link.attr("href").split("#");var url=parts.shift();var hash=parts.shift();if(value==""){url=url.replace(new RegExp(param+"=[^&]*"),"");}else if(url.match(new RegExp(param+"="))!==null){url=url.replace(new RegExp(param+"=[^&]*"),param+"="+value);}else{url+="?"+param+"="+value;}
if(hash){url+="#"+hash;}
link.attr("href",amcharts2.normalizeURL(url));});}
amcharts2.normalizeURL=function(url){url=url.replace(/\?\&/,"?");url=url.replace(/\?$|\&$/,"");return url;}
amcharts2.showModal=function(html,title){var $=jQuery;if(am4core!==undefined){am4core.system.isPaused=true;}
amcharts2.closeModal();var modal=$("<div>").attr("id","modal").addClass("modal").hide().appendTo("body");var curtain=$("<div>").addClass("curtain").appendTo(modal).on("click",amcharts2.closeModal);var body=$("<body>").addClass("body").appendTo(modal);var close=$("<input>").attr({"type":"button","value":"Close"}).addClass("close").on("click",amcharts2.closeModal).appendTo(body);if(typeof title!=="undefined"){var title=$("<div>").addClass("title").html(title).appendTo(body);}
var content=$("<div>").addClass("content").appendTo(body);if(typeof html=="String"){$("<div>").addClass("inner").html(html).appendTo(content);}else{$("<div>").addClass("inner").append(html).appendTo(content);}
modal.fadeIn(amcharts2.cons.anim.norm);}
amcharts2.closeModal=function(){var $=jQuery;if($("#modal").length){$("#modal").remove();if(am4core!==undefined){am4core.system.isPaused=false;}}}
amcharts2.encodeChars=function(text){return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");}
amcharts2.goToUrl=function(url){if(ga){try{var notracker=true;ga(function(tracker){notracker=false;if(url.indexOf("?")===-1)
window.location.href=url+'?'+tracker.get('linkerParam');else
window.location.href=url+'&'+tracker.get('linkerParam');});if(notracker){window.location.href=url;}}catch(e){window.location.href=url;}}else{window.location.href=url;}}
amcharts2.processLazyLoad=function(){var $=jQuery;if(amcharts2.lazyLoad.inited===false){amcharts2.lazyLoad.pending=$("img.lazy-load:not(.loaded)");amcharts2.lazyLoad.active=amcharts2.lazyLoad.pending.length>0;amcharts2.lazyLoad.inited=true;}
if(!amcharts2.lazyLoad.active)
return;var wW=$(window).width(),wH=$(window).height(),wS=$(window).scrollTop();$(amcharts2.lazyLoad.pending).each(function(index,item){var img=$(item);if(!img.is(":visible"))
return;var offset=img.offset();if((offset.top>wS)&&(offset.top<(wS+wH))&&(offset.left>-100)&&(offset.left<wW)){img.prop("src",img.data("src")).addClass("loaded");}});amcharts2.lazyLoad.pending.filter(function(item){return!$(item).hasClass("loaded");});amcharts2.lazyLoad.active=amcharts2.lazyLoad.pending.length>0;}
amcharts2.startLazyLoad=function(){clearInterval(amcharts2.lazyLoad.interval);amcharts2.lazyLoad.interval=setInterval(amcharts2.processLazyLoad,500);}
amcharts2.stopLazyLoad=function(){setTimeout(function(){clearInterval(amcharts2.lazyLoad.interval);},1000);}
amcharts2.processAffix=function(){var $=jQuery;var wW=$(window).width(),wH=$(window).height(),wS=$(window).scrollTop();$(".fixed-pos").each(function(){var affix_id=$(this).data("affix");if(affix_id){var affix_object=$("#"+affix_id);var affix_offset=affix_object.offset();var affix_bottom=affix_offset.top+affix_object.outerHeight();var target_object=$(this);var target_offset=target_object.offset();var target_bottom=target_offset.top+target_object.outerHeight()-Number(this.style.marginTop.replace(/[^0-9\-]*/g,""));var available_height=wH-target_offset.top-20+wS;target_object.css("max-height",available_height);target_object.css("overflow","auto");var diff=Math.round(target_bottom-affix_bottom);if(diff>0){this.style.marginTop="-"+diff+"px";}else{this.style.marginTop="";}}});}
amcharts2.loadCSS=function(src){var link=document.createElement("link")
link.setAttribute("rel","stylesheet");link.setAttribute("type","text/css");link.setAttribute("href",src);document.getElementsByTagName("head")[0].appendChild(link);amcharts2.loaded[src]=true;}
amcharts2.isLoaded=function(src){return amcharts2.loaded[src]===true;}
amcharts2.create_cookie=function(name,value,days){var expires;if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));expires="; expires="+date.toGMTString();}else{expires="";}
document.cookie=encodeURIComponent(name)+"="+encodeURIComponent(value)+expires+"; path=/; domain="+window.location.hostname;}
amcharts2.read_cookie=function(name){var nameEQ=encodeURIComponent(name)+"=";var ca=document.cookie.split(';');for(var i=0;i<ca.length;i++){var c=ca[i];while(c.charAt(0)===' ')c=c.substring(1,c.length);if(c.indexOf(nameEQ)===0)return decodeURIComponent(c.substring(nameEQ.length,c.length));}
return null;}
amcharts2.erase_cookie=function(name){amcharts2.create_cookie(name,"",-1);}