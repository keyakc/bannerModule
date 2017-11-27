(function(){

  // 赋值属性
  // extend({a:1}, {b:1, a:2}) -> {a:1, b:1}
  function extend(o1, o2){
    for(var i in o2) if(typeof o1[i] === 'undefined'){
      o1[i] = o2[i]
    } 
    return o1
  }	
  function padding(number) {
    return number < 10 ? '0' + number : '' + number;
  }
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


  var template1='\
  <div class="mod_vis_window">\
    <div class="translate_line" style="transform:translateX(-100%) translateZ(0px);transition:0.5s;">\
    </div>\
    <p class="intro">可拖拽、宽度响应</p>\
    <div class="cursor">\
    </div>\
  </div>\
  ';
  


	function Banner(propObj){
    this.mod_vis_window=$("<div></div>").append(template1).children(".mod_vis_window").eq(0);
    this.translate_line=this.mod_vis_window.children(".translate_line").eq(0);
    this.cursor=this.mod_vis_window.children(".cursor").eq(0);

    //幻灯片初始化获得节点
    extend(this,propObj);
    this._init(this.img_units, this.cursor, this.imageUrl,
      this.imageStyle, this.imagesNumber, this.translate_line, this.n_offSet, this.mod_vis_window);
		//偏移
    // this.n_offSet;
	}



	extend(Banner.prototype,{
    consl : function () {
        console.log(this.translate_line);
        console.log(this.cursor.children());
        console.log(this.img_units);
    },
    setLimit : function() {
        var x=this.mod_vis_window.innerWidth();
        console.log("this.vis_window_width="+x);
    },
    putImages : function() {
        this.translate_line.append();
    },
    _init : function(img_units, cursor, imageUrl, imageStyle, imagesNumber,translate_line, n_offSet, mod_vis_window, callback) {
      //图片初始化
        var template2='\
        <div class="slide slide_hidden" style="left:-100%">\
          <img src="'+imageUrl+padding(imagesNumber-1)+'.'+imageStyle+'">\
          </div>\
         <div class="slide slide_middle" style="left:0%">\
          <img src="'+imageUrl+padding(imagesNumber)+'.'+imageStyle+'">\
          </div>\
          <div class="slide slide_active" style="left:100%">\
          <img src="'+imageUrl+'01.'+imageStyle+'">\
          </div>\
          <div class="slide slide_middle" style="left:200%">\
          <img src="'+imageUrl+'02.'+imageStyle+'">\
          </div>\
          <div class="slide slide_hidden" style="left:300%">\
          <img src="'+imageUrl+'03.'+imageStyle+'">\
          </div>\
        ';
        this.img_units=translate_line.append(template2).children();//?
        //页码初始化
        for(i=0;i<imagesNumber+2;i++) {
            cursor.append('<a href="#">'+i+'</a>');
        }
        cursor.children().eq(0).html("&lt");
        cursor.children().eq(1).addClass("active");
        cursor.children().eq(imagesNumber+1).html("&gt");
        //事件注册
        var 
            cursors=cursor.children(),
            obj=this;

        for(q=1;q<=imagesNumber;q++){
          cursors.eq(q).click(this.clickHandler(q));
        }

        cursors.eq(imagesNumber+1).click(function(){
        //获取样式
          var trans=translate_line.attr("style");
          n_offSet=trans.match(/translateX\((.+)%\)/)[1]/100;
          console.log(n_offSet)
          n_offSet*=-1;
          n_offSet++;
          obj.picChange(n_offSet);        
        });

        cursors.eq(0).click(function(){
         //获取样式
          var trans=translate_line.attr("style");
          n_offSet=trans.match(/translateX\((.+)%\)/)[1]/100;  
          n_offSet*=-1;
          n_offSet--;
          obj.picChange(n_offSet); 
        });     
        //自动轮播初始化
        this.autoplay(this); 
        //启用拖拽     
        this._init_drag(this);
    },
    autoplay : function(obj) {
      if(obj.autoPlay==false) return;//开关
      var trans=function(){
        var trans=obj.translate_line.attr("style");
        var n_offSet=trans.match(/translateX\((.+)%\)/)[1]/100;
            n_offSet*=-1;
            n_offSet++;
            obj.picChange(n_offSet);
      };
      var ap=setInterval(trans,3000);
      obj.translate_line.mouseenter(function(){clearInterval(ap)});
      obj.translate_line.mouseleave(function(){ap=setInterval(trans,3000)})
    },
    _init_drag : function(thisObj) {//需要外部调用初始化
      if(thisObj.drag==false) return;
      //拖拽部分
        var downFlag=0,//标记
            clientX,
            pxOffset,
            vis_window_width=this.mod_vis_window.innerWidth(),
            n_offSet=this.n_offSet,
            obj=this;

        this.translate_line.mousedown(function(event){         
          downFlag=1;
          event.preventDefault();
          var trans=obj.translate_line.attr("style");
          n_offSet=trans.match(/translateX\((.+)%\)/)[1]/100;
            //以视口宽度为加权获取起始偏移
          pxOffset=n_offSet*vis_window_width;
          clientX=event.clientX;
        });

        this.translate_line.mousemove(function(event){  
          if(downFlag==1&&thisObj.drag){
            var offsetX=pxOffset+event.clientX-clientX;
            var str;  
            str="transform:translateX("+offsetX+"px) translateZ(0px);transition:"+0+"s;";
            obj.translate_line.attr("style",str);
            if((event.clientX-clientX)>=vis_window_width/3){
              downFlag=0;
              n_offSet*=-1;
              n_offSet--;
              obj.picChange(n_offSet);
            }
            if((event.clientX-clientX)<=-vis_window_width/3){
              downFlag=0;
              n_offSet*=-1;
              n_offSet++;
              obj.picChange(n_offSet);
            }
          };
        });

        this.translate_line.mouseup(function(event){
          if(downFlag!=0) {
            n_offSet*=-1
            obj.picChange(n_offSet);
          } 
          downFlag=0;
        });
    },
    picChange : function (n_offSet,T,img_units,cursor,imagesNumber,translate_line){
        var 
            minus_n=-n_offSet,            
            img_units=img_units||this.img_units,
            cursor=cursor||this.cursor,
            imagesNumber=imagesNumber||this.imagesNumber,
            translate_line=translate_line||this.translate_line;
        //拖拽无延时
        if(T!=0) T=0.5;        
        this.n_offSet=n_offSet;

        var trans="transform:translateX("+minus_n+"00%) translateZ(0px);transition:"+T+"s;";
        translate_line.attr("style",trans);
        //重置位置
        img_units.eq(mod(n_offSet-2,5)).css("left",(n_offSet-2)+"00%");
        img_units.eq(mod(n_offSet-1,5)).css("left",(n_offSet-1)+"00%");
        img_units.eq(mod(n_offSet,5)).css("left",n_offSet+"00%");
        img_units.eq(mod(n_offSet+1,5)).css("left",(n_offSet+1)+"00%");
        img_units.eq(mod(n_offSet+2,5)).css("left",(n_offSet+2)+"00%");

        //重置图样
        img_units.eq(mod(n_offSet-2,5)).children("img").eq(0).attr("src",this.imageUrl+padding(reg(n_offSet-2,imagesNumber))+".jpg");
        img_units.eq(mod(n_offSet-1,5)).children("img").eq(0).attr("src",this.imageUrl+padding(reg(n_offSet-1,imagesNumber))+".jpg");  
        img_units.eq(mod(n_offSet,5)).children("img").eq(0).attr("src",this.imageUrl+padding(reg(n_offSet,imagesNumber))+".jpg");
        img_units.eq(mod(n_offSet+1,5)).children("img").eq(0).attr("src",this.imageUrl+padding(reg(n_offSet+1,imagesNumber))+".jpg");
        img_units.eq(mod(n_offSet+2,5)).children("img").eq(0).attr("src",this.imageUrl+padding(reg(n_offSet+2,imagesNumber))+".jpg");


        //页码样式切换
        this.button_class(cursor,reg(n_offSet,imagesNumber));
        this.slide_class(img_units,n_offSet,img_units.length);
    },

    //按钮样式切换
    button_class : function(cursor,n) {        
      cursor.children().removeClass("active");        
      cursor.children().eq(n).addClass('active');
    },

    //幻灯片样式切换
    slide_class : function(img_units,n_offSet,n) {
      img_units.removeClass("slide_active slide_hidden slide_middle");     
      img_units.eq(mod(n_offSet-2,n)).addClass('slide_hidden');
      img_units.eq(mod(n_offSet-1,n)).addClass('slide_middle');
      img_units.eq(mod(n_offSet,n)).addClass('slide_active');
      img_units.eq(mod(n_offSet+1,n)).addClass('slide_middle');
      img_units.eq(mod(n_offSet+2,n)).addClass('slide_hidden');
    },

    //各页码注册事件
    clickHandler : function(page) {
      var obj=this;
      return function(){//闭包
        obj.picChange(page,0);
      }
    }
	});



  // ----------------------------------------------------------------------
  // 暴露API:  Amd || Commonjs  || Global 
  // 支持commonjs
  if (typeof exports === 'object') {
    module.exports = Banner;
    // 支持amd
  } else if (typeof define === 'function' && define.amd) {
    define(function() {
      return Banner
    });
  } else {
    // 直接暴露到全局
    window.Banner = Banner;
  }
})()



