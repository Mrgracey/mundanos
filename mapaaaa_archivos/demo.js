jQuery(function($){amcharts2.defaultTheme=$("body").is(".post-type-archive-demo3")||$("body").is(".post-type-demo3")?"light":"none";amcharts2.useAnimated=true;if(typeof am4core!=="undefined"&&typeof am4themes_animated!=="undefined"){var animated_cb=$(".theme-button-animated");animated_cb.on("click",function(){animated_cb.toggleClass("active");amcharts2.useAnimated=animated_cb.hasClass("active");amcharts2.amchartsSwitchDemoTheme(amcharts2.currentDemoTheme,false,amcharts2.useAnimated);});}else{amcharts2.useAnimated=false;}
var theme=amcharts2.getQueryVar("theme");if(!theme)
theme=amcharts2.defaultTheme;amcharts2.amchartsSwitchDemoTheme(theme,true,true);amcharts2.updateDemoCode(false);$(".theme-switcher a").on("click",function(){if($(this).data("theme")){amcharts2.amchartsSwitchDemoTheme($(this).data("theme"),false,amcharts2.useAnimated);}});if(typeof amchartsDemoControls!=='undefined'){var int=setInterval(function(){if(typeof am4core!=="undefined"){clearInterval(int);amcharts2.initDemoControls();}else if(typeof AmCharts!=="undefined"||AmCharts.charts.length===0||AmCharts.charts[0].chartCreated){clearInterval(int);amcharts2.initDemoControls();}},100)}else{amchartsDemoControls=[];}
$("#view-source a").on("click",function(){var action=$(this).data("type");var resources=[];for(var i=0;i<demoData.resources.length;i++){var resource=demoData.resources[i];if(resource.match(/\.css/))
resources.push("<link rel=\"stylesheet\" href=\""+resource+"\" type=\"text/css\" media=\"all\" />");else
resources.push("<script src=\""+resource+"\"></script>");}
if(amcharts2.useAnimated){resources.push("<script src=\"https://www.amcharts.com/lib/4/themes/animated.js\"></script>");}
var addCss="";if(amcharts2.currentDemoTheme=="dark")
addCss="body { background-color: #30303d; color: #fff; }\n";else if(amcharts2.currentDemoTheme=="black")
addCss="body { background-color: #000; color: #fff; }\n";else if(amcharts2.currentDemoTheme=="chalk")
addCss="body { background-color: #3f3e3b; color: #fff; }\n";if(action=="source"){var source="";if(demoData.css!="")
source+="<!-- Styles -->\n"+
"<style>\n"+addCss+demoData.css+"\n</style>\n\n";source+="<!-- Resources -->\n"+
resources.join("\n")+"\n\n";source+="<!-- Chart code -->\n"+
"<script>\n"+demoData.javascript+"\n</script>\n\n";source+="<!-- HTML -->\n"+
demoData.html;amcharts2.showModal("<pre>"+amcharts2.encodeChars(source)+"</pre>","Source of the demo");}else if(action=="codepen"){jQuery("#codepen-form").remove();var form=jQuery("<form>").attr({"method":"post","id":"codepen-form","target":"_blank","action":"https://codepen.io/pen/define"}).css("display","none").appendTo("body");var field=jQuery("<input>").attr({"type":"hidden","name":"data","value":JSON.stringify({"title":demoData.title,"description":demoData.description,"html":resources.join("\n")+"\n"+demoData.html,"js":additionalJS(demoData.javascript),"css":additionalCSS(addCss+demoData.css),})});form.append(field).submit();}else if(action=="jsfiddle"){jQuery("#jsfiddle-form").remove();var form=jQuery("<form>").attr({"method":"post","id":"jsfiddle-form","target":"_blank","action":"http://jsfiddle.net/api/post/library/pure/"}).css("display","none").appendTo("body");jQuery("<input>").attr({"type":"hidden","name":"title","value":demoData.title}).appendTo(form);jQuery("<input>").attr({"type":"hidden","name":"description","value":demoData.description}).appendTo(form);jQuery("<input>").attr({"type":"hidden","name":"html","value":resources.join("\n")+"\n"+demoData.html}).appendTo(form);jQuery("<input>").attr({"type":"hidden","name":"js","value":additionalJS(demoData.javascript)}).appendTo(form);jQuery("<input>").attr({"type":"hidden","name":"css","value":additionalCSS(addCss+demoData.css)}).appendTo(form);jQuery("<input>").attr({"type":"hidden","name":"wrap","value":"b"}).appendTo(form);form.submit();}});function additionalCSS(css){return 'body {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";\n}\n\n'+css;}
function additionalJS(js){if(amcharts2.getDemoVersion()==4){return '/**\n * ---------------------------------------\n * This demo was created using amCharts 4.\n * \n * For more information visit:\n * https://www.amcharts.com/\n * \n * Documentation is available at:\n * https://www.amcharts.com/docs/v4/\n * ---------------------------------------\n */\n\n'+js;}
return js;}
$("pre").each(function(){var pre=$(this);var code=pre.find("code");var code_type=getCodeType(pre);if(code_type){pre.addClass("code");var code_label=getCodeLabel(pre);if(code.length==0){code=$("<code>").addClass("pre-scrollable").addClass(code_type).data("type",code_type);code.data("code-label",code_label);code.html(amcharts2.amdocs_escape_html(pre.html()));pre.html("").append(code);}}
code.html(amcharts2.amdocs_escape_html(code.html()));});function getCodeType(el){el=$(el);var code=el.data("code");if(!code){var classes=$(el).attr("class").split(" ");for(var i=0;i<classes.length;i++){var classname=classes[i];var matches;if(matches=classname.match(/code-(.*)/)){if(!matches[1].match(/^label-/)){return matches[1];}}}}
return code;}
function getCodeLabel(el){el=$(el);var label=el.data("code-label");if(!label&&$(el).attr("class")){var classes=$(el).attr("class").split(" ");for(var i=0;i<classes.length;i++){var classname=classes[i];var matches;if(matches=classname.match(/^code-label-(.*)/)){return matches[1].replace(/\_/," ");}else if(matches=classname.match(/code-(.*)/)){label=matches[1].replace(/\_/," ");}}}
return label||el.data("code");}
if(hljs){hljs.configure({tabReplace:'  '});hljs.initHighlightingOnLoad();}
var group;$('pre code').each(function(){var item=$(this);var parent=item.parent();var type=item.data("type");var label=item.data("code-label")||type;if(label=="TypeScript"){label="TypeScript / ES6";}
item.html(item.html().replace(/^\r?\n|\r/,''));var buttonclass="";if(group&&parent.prev().is("pre")){group.data("blocks").push(parent);parent.hide();buttonclass="btn-light";}else{group=$("<div>").addClass("btn-group btn-group-sm code-buttons").attr("role","group").insertBefore(parent);group.data("blocks",[parent]);buttonclass="btn-dark";var view=$("<button>").addClass("btn btn-light code-button code-enlarge").text("...").appendTo(group).on("click",function(ev){var group=$(this).parent();var current=group.find(".btn-dark");var clone;for(var $i=0;$i<group.data("blocks").length;$i++){if(group.data("blocks")[$i].css("display")!="none"){clone=group.data("blocks")[$i].clone();}}
clone.find('.pre-scrollable').removeClass('pre-scrollable');amcharts2.showModal(clone,"Source of the demo");});}
var button=$("<button>").addClass("btn "+buttonclass+" code-button"+" code-type-"+amcharts2.amdocs_simplify(label)).text(label).data("group",group).data("type",amcharts2.amdocs_simplify(label)).data("parent",parent).insertBefore(group.find('.code-enlarge')).on("click",function(ev){activateCodeTab($(this));});});function activateCodeTab(tab){if(tab.hasClass("btn-dark")){return;}
jQuery(".demo-code-note").remove();var group=tab.data("group");var parent=tab.data("parent");var blocks=group.data("blocks");for(var i=0;i<blocks.length;i++){if(blocks[i]===parent){blocks[i].show();}else{blocks[i].hide();}}
group.find(".btn").removeClass("btn-dark").addClass("btn-light");tab.removeClass("btn-light").addClass("btn-dark");}});amcharts2.amchartsSwitchDemoTheme=function(theme,skipDemoUpdate,useAnimated){var $=jQuery;if(amcharts2.currentDemoTheme==theme&&useAnimated===undefined)
return;if($(".theme-button-"+theme+":first").length===0)
theme=amcharts2.defaultTheme;$(".theme-button.active").not(".theme-button-animated").removeClass("active");$(".theme-button-"+theme).addClass("active");if(skipDemoUpdate!==true){var l=window.location;var newUrl=l.protocol+"//"+l.hostname+l.pathname;if(theme!=amcharts2.defaultTheme){newUrl+="?theme="+theme;}
newUrl+=l.hash;if(history.replaceState)
history.replaceState({},document.title,newUrl);else{window.location=newUrl;return;}}
if(amcharts2.currentDemoTheme)
$("body").removeClass("demo-theme-"+amcharts2.currentDemoTheme);$("body").addClass("demo-theme-"+theme);amcharts2.currentDemoTheme=theme;amcharts2.updateParamLinks();amcharts2.processLazyLoad();if(typeof demoData==="undefined")
return;if(amcharts2.getDemoVersion()==3){demoData.javascript=demoData.javascript.replace(/"theme"\:[^"]*"([a-z]+)"/g,'"theme": "'+theme+'"');}else{var newthemes="";if(theme!=="none"){newthemes+="am4core.useTheme(am4themes_"+theme+");\n";}
if(useAnimated||$("#animated-theme").prop("checked")){newthemes+="am4core.useTheme(am4themes_animated);\n";}
demoData.javascript=demoData.javascript.replace(/(\/\/ Themes begin)[\s\S]*(\/\/ Themes end)/g,"$1\n"+newthemes+"$2");}
var found=false;if(amcharts2.currentDemoTheme!="none"){for(var i=0;i<demoData.resources.length;i++){var resource=demoData.resources[i];if(demoData.resources[i].match(/\/themes\/.*\.js/)){demoData.resources[i]=demoData.resources[i].replace(/[^./]*\.js/,amcharts2.currentDemoTheme+".js");found=true;}}
if(!found)
demoData.resources.push(demoData.resources[0].replace(/[^./]*\.js/,'themes/'+amcharts2.currentDemoTheme+".js"));}else{demoData.resources=demoData.resources.filter(function(a){return!a.match(/\/themes\/.*\.js/);});}
if(skipDemoUpdate!==true){if(typeof am4core!=="undefined"){var chart=amcharts2.getCurrentChart();if(chart){chart.dispose();}
am4core.registry.themes=[];}else if(typeof AmCharts!=="undefined"&&typeof AmCharts.charts[0]!=="undefined"){AmCharts.charts[0].clear();}
eval(demoData.javascript);amcharts2.reapplyControlSettings();amcharts2.updateDemoCode(true);}
var chalkFont="https://fonts.googleapis.com/css?family=Covered+By+Your+Grace";if(theme==="chalk"&&!amcharts2.isLoaded(chalkFont))
amcharts2.loadCSS(chalkFont);}
amcharts2.getCurrentChart=function(){if(typeof am4core!=="undefined"){return am4core.registry.baseSprites[0];}else if(typeof AmCharts!=="undefined"){return AmCharts.charts[0];}}
amcharts2.setConfigVar=function(prop,val,propertyType){var path=prop.split('.');var holder=amcharts2.getCurrentChart();var element;while(element=path.shift()){var index=element.match(/\[([0-9])*\]/);if(index!==null){element=element.replace(/\[.*/,"");holder=holder[element];element=Number(index[1]);if(typeof holder.getIndex!=="undefined"){holder=holder.getIndex(element);continue;}}
if(typeof holder[element]==="undefined")
holder[element]={};if(path.length===0){switch(propertyType){case "class":holder[element]=new am4core.registry.registeredClasses[val];break;case "percent":holder[element]=am4core.percent(val);break;default:holder[element]=val;}}else{holder=holder[element];}}
if(typeof holder.dispose==="undefined"){amcharts2.getCurrentChart().validateNow(false,true);}}
amcharts2.getConfigVar=function(prop){var path=prop.split('.');var holder=amcharts2.getCurrentChart();var element;while(element=path.shift()){var index=element.match(/\[([0-9])*\]/);if(index!==null){element=element.replace(/\[.*/,"");holder=holder[element];element=Number(index[1]);if(typeof holder.getIndex!=="undefined"){holder=holder.getIndex(element);continue;}}
if(typeof holder[element]==="undefined")
return undefined;if(path.length===0){return holder[element];}else{holder=holder[element];}}
return undefined;}
amcharts2.getDemoVersion=function(){return typeof am4core!=="undefined"?4:3;}
amcharts2.initDemoControls=function(){var $=jQuery;var controlHolder=$('#demo-control-holder');$(amchartsDemoControls).each(function(){var control=$("<div>").addClass("demo-control col-md-4");control.append($("<div>").addClass("demo-control-category").html(this.category));var value=amcharts2.getConfigVar(this.property);if(value===undefined&&this.default!==undefined){value=this.default;}
if(this.type=="slider"){control.append($("<div>").addClass("demo-control-value").html(value));}
control.append($("<div>").addClass("demo-control-title").html(this.title));if(this.type=="slider"){var step=(this.max-this.min)/100;if(step>1)
step=Math.round(step);if(typeof value==='string'){value=Number(value.replace(/[^0-9.\-]*/g,""));}
var slider=$("<div>").data("property",this.property).data("unit",this.unit).slider({"min":this.min,"max":this.max,"step":step,"value":value,"slide":function(event,ui){var value=ui.value;if($(this).data("unit"))
value+=$(this).data("unit");$(this).siblings('.demo-control-value').html(value);amcharts2.setConfigVar($(this).data("property"),value);}});control.append(slider);this.control=slider;this.controlTrigger="slidechange";}else if(this.type=="select"){var value=amcharts2.getConfigVar(this.property);var wrapper=$("<div>").addClass("select");var select=$('<select>').data("property",this.property).data("propertyType",this.propertyType).on("change",function(){amcharts2.setConfigVar($(this).data("property"),$(this).val(),$(this).data("propertyType"));});wrapper.append(select);this.control=select;this.controlTrigger="change";for(var i=0;i<this.options.length;i++){var opt_value=this.options[i];var option=$("<option>").val(opt_value).html(opt_value);if(value==opt_value)
option.attr("selected","selected");select.append(option);}
control.append(wrapper);}
controlHolder.append(control);});}
amcharts2.reapplyControlSettings=function(){var $=jQuery;if(typeof am4core!="undefined"){}else if(typeof AmCharts!=="undefined"&&AmCharts.charts.length&&AmCharts.charts[0].chartRendered===true){$(amchartsDemoControls).each(function(){if(this.type=='slider'){amcharts2.setConfigVar(this.control.data("property"),this.control.slider("value"),this.control.data("propertyType"));}else{$(this.control).trigger(this.controlTrigger);}});}else{setTimeout(amcharts2.reapplyControlSettings,100);}};amcharts2.updateDemoCode=function(hl){amcharts2.updateDemoCodeJavaScript(hl);amcharts2.updateDemoCodeTypeScript(hl);amcharts2.updateDemoCodeJSON(hl);}
amcharts2.updateDemoCodeJavaScript=function(hl){var $=jQuery;var code_block=$("#demo-code-javascript");if(code_block.length==0){return;}
if(code_block.find('code').length){code_block=code_block.find('code');}
var resources=[];for(var i=0;i<demoData.resources.length;i++){var resource=demoData.resources[i];if(resource.match(/\.css/))
resources.push("<link rel=\"stylesheet\" href=\""+resource+"\" type=\"text/css\" media=\"all\" />");else
resources.push("<script src=\""+resource+"\"></script>");}
if(amcharts2.useAnimated){resources.push("<script src=\"https://www.amcharts.com/lib/4/themes/animated.js\"></script>");}
var addCss="";if(amcharts2.currentDemoTheme=="dark")
addCss="body { background-color: #30303d; color: #fff; }\n";else if(amcharts2.currentDemoTheme=="black")
addCss="body { background-color: #000; color: #fff; }\n";else if(amcharts2.currentDemoTheme=="chalk")
addCss="body { background-color: #3f3e3b; color: #fff; }\n";var source="";if(demoData.css!="")
source+="<!-- Styles -->\n"+
"<style>\n"+addCss+demoData.css+"\n</style>\n\n";source+="<!-- Resources -->\n"+
resources.join("\n")+"\n\n";if(amcharts2.getDemoVersion()==4){source+="<!-- Chart code -->\n"+
"<script>\nam4core.ready(function() {\n\n"+demoData.javascript+"\n\n}); // end am4core.ready()\n</script>\n\n";}
else{source+="<!-- Chart code -->\n"+
"<script>\n"+demoData.javascript+"\n</script>\n\n";}
source+="<!-- HTML -->\n"+
demoData.html;code_block.html(amcharts2.encodeChars(source));if(hljs&&hl){hljs.highlightBlock(code_block[0]);}}
amcharts2.updateDemoCodeTypeScript=function(hl){var $=jQuery;var code_block=$("#demo-code-typescript");if(code_block.length==0){return;}
if(code_block.find('code').length){code_block=code_block.find('code');}
var resources=[];var source="";for(var i=0;i<demoData.resources.length;i++){var resource=demoData.resources[i];if(resource.match(/\.css/)){}else
resources.push(prepResource(resource));}
if($("#animated-theme").prop("checked")){resources.push(prepResource("https://www.amcharts.com/lib/4/themes/animated.js"));}
source+="/* Imports */\n"+
resources.join("\n")+"\n\n";source+="/* Chart code */\n"+
demoData.javascript.replace(/^([\s]*)var/gm,"$1let")+"\n\n";code_block.html(amcharts2.encodeChars(source));if(hljs&&hl){hljs.highlightBlock(code_block[0]);}
function prepResource(resource){resource=resource.replace(/.*\/4\/(.*)/,"$1");if(resource.match(/geodata/)){var map=resource.replace(/geodata\/(.*)\.js/,"$1");resource="import am4geodata_"+map+" from \"@amcharts/amcharts4-geodata/"+map+"\";";}else if(resource.match(/themes/)){var theme=resource.replace(/geodata\/(.*)\.js/,"$1");resource="import am4themes_"+theme+" from \"@amcharts/amcharts4/themes/"+theme+"\";";}else if(resource.match(/core\.js/)){resource="import * as am4core from \"@amcharts/amcharts4/core\";";}else if(resource.match(/charts\.js/)){resource="import * as am4charts from \"@amcharts/amcharts4/charts\";";}else if(resource.match(/maps\.js/)){resource="import * as am4maps from \"@amcharts/amcharts4/maps\";";}else{resource="";}
return resource;}}
amcharts2.updateDemoCodeJSON=function(hl){var $=jQuery;var code_block=$("#demo-code-json");if(code_block.length==0){return;}
if(code_block.find('code').length){code_block=code_block.find('code');}
var resources=[];for(var i=0;i<demoData.resources.length;i++){var resource=demoData.resources[i];if(resource.match(/\.css/))
resources.push("<link rel=\"stylesheet\" href=\""+resource+"\" type=\"text/css\" media=\"all\" />");else
resources.push("<script src=\""+resource+"\"></script>");}
if(amcharts2.useAnimated){resources.push("<script src=\"https://www.amcharts.com/lib/4/themes/animated.js\"></script>");}
var addCss="";if(amcharts2.currentDemoTheme=="dark")
addCss="body { background-color: #30303d; color: #fff; }\n";else if(amcharts2.currentDemoTheme=="black")
addCss="body { background-color: #000; color: #fff; }\n";else if(amcharts2.currentDemoTheme=="chalk")
addCss="body { background-color: #3f3e3b; color: #fff; }\n";var source="";if(demoData.css!="")
source+="<!-- Styles -->\n"+
"<style>\n"+addCss+demoData.css+"\n</style>\n\n";source+="<!-- Resources -->\n"+
resources.join("\n")+"\n\n";source+="<!-- Chart code -->\n"+
"<script>\n"+demoData.json+"\n</script>\n\n";source+="<!-- HTML -->\n"+
demoData.html;code_block.html(amcharts2.encodeChars(source));if(hljs&&hl){hljs.highlightBlock(code_block[0]);}}
amcharts2.amdocs_escape_html=function(html){return html?html.replace(/</,'&lt;').replace(/>/,'&gt;'):html;}
amcharts2.amdocs_simplify=function(str){return str?str.replace(/[^a-z0-9]/gi,"_"):str;}