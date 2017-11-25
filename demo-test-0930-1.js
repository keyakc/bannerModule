var $vis_window=$("<div></div>");
$vis_window.attr("id","vis_window");
//接口5
var banner_position="body";
$(banner_position).append($vis_window);
//接口3
var window_width=350,window_height=340;
$vis_window.css({
	width:window_width+'px',
	height:window_height+'px'
});
var vis_window_width=$vis_window.innerWidth();

//接口4
//图片格式和数量
var img_num=7,img_style='jpg';
//传送带生成
var translate_line_str='\
<div id="translate_line" style="transform:translateX(-100%) translateZ(0px);transition:0.5s;">\
	<div class="slide" style="left:0%">\
	<img src="img-2/images/work_'+padding(img_num)+'.'+img_style+'">\
	</div>\
	<div class="slide slide_active" style="left:100%">\
	<img src="img-2/images/work_01.'+img_style+'">\
	</div>\
	<div class="slide" style="left:200%">\
	<img src="img-2/images/work_02.'+img_style+'">\
	</div>\
</div>';
$vis_window.append(translate_line_str);

var $translate_line=$("#translate_line");
var $img_units=$("#translate_line > div");

var slideOffset;//整体偏移
//接口2


//生成容器
var $cursor=$("<div></div>");
//赋予标识
$cursor.attr("id","cursor");
//生成页码
$cursor.append("<a href='#'>&lt</a><a href='#'>&gt</a>")
//接口1
var page_str="",img_num=7;
for(i=1;i<=img_num;i++) {
	page_str+="<a href='#'>"+i+"</a>";
}
//放入容器
$cursor.children().eq(0).after(page_str);
//页码初始化
$cursor.children().eq(1).addClass("active");
//放入主体
$cursor.appendTo($vis_window);
var $cursors=$("#cursor a");
var cursorsLength=img_num+2;

//获取 css width
var vis_window_width=getStyle(vis_window,"width").match(/(\d+)/)[0];





//幻灯片位置
function picChange(n,T){
	var transOffset=-n;
	console.log(n);
	if(T==null) T=0.5;
	var trans="transform:translateX("+transOffset+"00%) translateZ(0px);transition:"+T+"s;";
	$translate_line.attr("style",trans);
	//重置位置
	$img_units.eq(mod(n-1,3)).css("left",(n-1)+"00%");
	$img_units.eq(mod(n,3)).css("left",n+"00%");
	$img_units.eq(mod(n+1,3)).css("left",(n+1)+"00%");
	// console.log(img_units[mod(n-1,3)].getElementsByTagName("img")[0].src);
	//重置图样
	$img_units.eq(mod(n-1,3)).children("img").eq(0).attr("src","img-2/images/work_0"+reg(n-1,cursorsLength-2)+".jpg");	
	$img_units.eq(mod(n,3)).children("img").eq(0).attr("src","img-2/images/work_0"+reg(n,cursorsLength-2)+".jpg");
	$img_units.eq(mod(n+1,3)).children("img").eq(0).attr("src","img-2/images/work_0"+reg(n+1,cursorsLength-2)+".jpg");
	button_class(reg(n,cursorsLength-2));
	slide_class(mod(n,$img_units.length));
}
//各页码注册事件
var clickHandler=function(page) {
	return function(){//接口已形成，变量不释放
		picChange(page,0);
	}
};
for(q=1,p=cursorsLength;q<=p-2;q++){
	$cursors.eq(q).click(clickHandler(q));
}
$cursors.eq(cursorsLength-1).click(function(){
	//获取样式
	var trans=$translate_line.attr("style");
	slideOffset=trans.match(/translateX\((.+)%\)/)[1]/100;	
	slideOffset*=-1;
	slideOffset++;
	picChange(slideOffset);
	
});
$cursors.eq(0).click(function(){
	//获取样式
	var trans=$translate_line.attr("style");
	slideOffset=trans.match(/translateX\((.+)%\)/)[1]/100;	
	slideOffset*=-1;
	slideOffset--;
	picChange(slideOffset);	
});
//拖拽部分
var downFlag,clientX,pxOffset;
$translate_line.mousedown(function(event){
	downFlag=1;
	event.preventDefault();
	var trans=$translate_line.attr("style");
	slideOffset=trans.match(/translateX\((.+)%\)/)[1]/100;
		//以视口宽度为加权获取起始偏移
	pxOffset=slideOffset*vis_window_width;
	clientX=event.clientX;
	clientY=event.clientY;
})
$translate_line.mousemove(function(event){	
	if(downFlag==1){
		var offsetX=pxOffset+event.clientX-clientX;
		var str;	
		str="transform:translateX("+offsetX+"px) translateZ(0px);transition:"+0+"s;";
		$translate_line.attr("style",str);
		if((event.clientX-clientX)>=vis_window_width/3){
			downFlag=0;
			slideOffset*=-1;
			slideOffset--;
			picChange(slideOffset);
		}
		if((event.clientX-clientX)<=-vis_window_width/3){
			downFlag=0;
			slideOffset*=-1;
			slideOffset++;
			picChange(slideOffset);
		}
	};
})
$translate_line.mouseup(function(){
	if(downFlag!=0) {
		slideOffset*=-1
		picChange(slideOffset);
	}	
	downFlag=0;
})
//幻灯片样式切换
function slide_class(n) {
	for(i=0,j=$img_units.length;i<j;i++){
		$img_units.eq(i).removeClass("slide_active");
	}
	$img_units.eq(n).addClass('slide_active');
}
//按钮样式切换
function button_class(n){
	for(i=0;i<cursorsLength;i++){
		$cursors.eq(i).removeClass("active");
	}
	$cursors.eq(n).addClass('active');	
}
//辅助方法
//取余和文件名差异匹配
function reg(offset,n) {
	if(Math.abs(offset)%n==0) return n;
	if(offset<0){
	return n+offset%n;
	}else{
	return offset%n;
	}
} 
//取摸
function mod(m,n) {
	if(m>=0) return m%n;
	if(m<0) {
		if(m%n==0) {
			return 0;
		}else{
		return n+m%n;
		}
	}
}
//两位
function padding(number) {
	return number < 10 ? '0' + number : '' + number;
}
// 获取元素当前样式
	function getStyle(element,cssPropertyName){
	    if(window.getComputedStyle){
	        //优先使用W3C规范
	       return window.getComputedStyle(element).getPropertyValue(cssPropertyName);
	       //getPropertyValue方法可直接使用CSS属性名称，不需要转换成驼峰模式；
	    }else{
	        //针对IE9以下兼容
	        return element.currentStyle.getAttribute(camelize(cssPropertyName));
	        //IE9以下使用getAttribute方法，而且属性名必须改为驼峰模式；
	    }
	}
	//camelize 实现将属性名改成驼峰模式；
	function camelize(attr) {
	    return attr.replace(/-(\w)/g, function(match, p1) {
	        return p1.toUpperCase();
	    });
	}