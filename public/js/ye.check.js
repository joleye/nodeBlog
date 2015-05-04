/*
 *    表单验证控件 0.6
 *    @author joleye
 *    https://github.com/joleye/ye.check
 */

 if(!ye)
	var ye,JoleYe = ye = {};
 
(function(ye,$){
	ye.browser = {};
	if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
	    //IE 8下，以documentMode为准
		ye.browser.ie = document.documentMode || + RegExp['\x241'];
	   	ye.browser.ie6 = /msie (6.\d)/i.test(navigator.userAgent);
	}

	ye.browser.firefox = /FireFox/i.test(navigator.userAgent);

	ye.g = function(tag){
		this.find(tag);
		return this._d;
	};

	ye.find = function(seltext){
		if(typeof(seltext)=='string'){
			if(/^(#)(\w|_|-)/.test(seltext)){
				this._d = document.getElementById(seltext.substring(1));
			}else if(/^\.[\w_\-]+$|\[/.test(seltext)){
				this._d = $(seltext)[0];
			}else
				this._d = document.getElementById(seltext);
		}
		else
			this._d = seltext;
				
		return this;
	};

	/*数组对象*/
	ye.array = function(arr){
		this._data_arr = arr;
		return this;
	};

	/*数组所在位置索引号*/
	ye.index = function(val){
		for(var i=0;i<this._data_arr.length;i++){
			if(this._data_arr[i] == val){
				return i;
			}
		}
		return -1;
	};

	/*对象是否为空*/
	ye.isEmpty = function(arg){
		if(typeof arg == 'undefined' || arg=='' || arg == null)
			return true;
		else
			return false;
	}

	/*取当前下一个内容*/
	ye.next = function(val){
		for(var i=0;i<this._data_arr.length;i++){
			if(this._data_arr[i] == val){
				if(i+1<this._data_arr.length)
					return this._data_arr[i+1];
			}
		}
		return this._data_arr[0];
	};

	/*创建dom对象*/
	ye.create = function(tag){
		return document.createElement(tag);	
	};

	ye.css = function(o,data){
		o = ye.g(o);
		if(!o || !o.style){return;}
		
		for(var k in data){
			o.style[k] = data[k];
		}
	};

	/*设置对象属性*/
	ye.setAttr = function(d,key,data){
		if(typeof data=='undefined'){
			for(var k in key){
				var k1 = ye._NAME_ATTR(k);
				d.setAttribute(k1,key[k]);
			}
		}else{
			if(d){
				key = ye._NAME_ATTR(key);
				if(/INPUT|FORM/.test(d.nodeName)){
					if(typeof(d.getAttribute(key))=='object')
					{
						var dom = d.attributes[key];
						if(dom)
							d.attributes(key).value = data;
						else
							d.setAttribute(key,data);	
					}
					else
						d.setAttribute(key,data);
				}
				else
					d.setAttribute(key,data);
			}
		}
	};

	/*对象属性读取*/
	ye.getAttr = function(d,key){
		if(!d) return;
		d = this.g(d);
		key = ye._NAME_ATTR(key);
		
		if(/INPUT|FORM/.test(d.nodeName))
			if(typeof(d.getAttribute(key))=='object'){
				var dom = d.attributes[key];
				if(dom)
					return d.attributes[key].value;
				else
					return d.getAttribute(key)	;
			}
			else
				return d.getAttribute(key)	;
		else
			return d.getAttribute(key)	;
	};

	/*绑定方法*/
	ye.extend = function(options){
		for(var func in options){
			this['_'+func] = options[func];
		}
	};

	/**
	 * 对象属性设置
	 *  ie6,7下class转换
	 */
	ye._NAME_ATTR = function(key){
		var _NAME = {
				'cellpadding': 'cellPadding',
				'cellspacing': 'cellSpacing',
				'colspan': 'colSpan',
				'rowspan': 'rowSpan',
				'valign': 'vAlign',
				'usemap': 'useMap',
				'frameborder': 'frameBorder'
		};
		if(ye.browser.ie < 8){
				_NAME['class'] = 'className';
				_NAME['for'] = 'htmlFor';
		} else  {
	       _NAME['htmlFor'] = 'for';
	       _NAME['className'] = 'class';
	   }
		
		return _NAME[key] || key;
	};

	/*默认提交事件配置*/
	var _DEFAULT_POST_OPTION = {
			url : null, //default form action
			method : 'ajax',
			msg : {
				right : 'dright',
				error : 'derr'
			},
			btn : {
				name : '#post',
				text : 'load...'
			}
	};

	/*读取默认的规则*/
	ye.get_def_rule = function (form) {
	    var rule = {};
	    $(form).find('input,textarea,select').each(function () {
	        var id = this.id;
	        var rule_method = $(this).attr('check-rule');
	        
	        if (rule_method == "radio")
	            id = this.name;

	        var warning = $(this).attr('check-warning');
	        var correct = $(this).attr('check-correct');
	        
	        if (rule_method && id)
	            rule[id] = [rule_method, warning,  correct?correct:''];
	        else if(rule_method){
	            var date = new Date();
	            var tmpid = this.name + date.getTime() + Math.round(Math.random() * 100000);
	            $(this).attr('id', tmpid);
	            rule[tmpid] = [rule_method, warning, correct?correct:''];
	        }
	    });
	    return rule;
	};

	ye.check = function(c,id){
		if ( window == this ) return new ye.check(d,id);
		var _dom = ye.g(id);
		return this.init(c,_dom);
	};

	/*全自动托管*/
	ye.verify = function(id,option){
		var c = this.get_def_rule(id);
		var nc = $.extend(c,option);
		var _dom = $(id)[0];
		return this.init(nc,_dom);
	};

	ye.init = function(c,dom){
		this.conf = c;
		this._dom = dom;
		return this;
	};

	ye.do_validate = function(option){
		var conf = this.conf;
		var err = false;
		this._option = option;
		for(var k in conf){
			var f = this._task_key(k);
			if(f) err = true;
		}
		if(err){
			alert('信息填写格式错误或不完整，请检查红色标记部分');return false;
		}
		return true;
	};

	/*新验证提交*/
	ye.do_post = function(options){
		var conf = this.conf;
		var err = false;

		//默认配置
		var option = this._option = $.extend(_DEFAULT_POST_OPTION,options);
		
		for(var k in conf){
			var f = this._task_key(k);
			if(f) err = true;
		}
		if(err){
			alert('信息填写格式错误或不完整，请检查红色标记部分');
		}
		else{
			if(typeof option.btn!='undefined'){
				var jbtn = $(ye.g(option.btn.name));
				if(ye.g(option.btn.name).nodeName.toUpperCase()=='BUTTON'){
					option.btn.original = jbtn.html();
					jbtn.html(option.btn.text);
				}else{
					option.btn.original = jbtn.val();
					jbtn.val(option.btn.text);
				}
				
				ye.g(option.btn.name).disabled = true;
			}
			
			var subdom;
			
			if(typeof this._dom!='undefined')
				subdom = this._dom;
			else if(option.form)
				subdom = option.form;
			
			if(option.method == 'ajax'){
				var action = option.url ? option.url : $(subdom).attr('action');
				if(action==null || action=='')
					action = location.href;
				$.post(action,$(subdom).serialize(),function(env){
					ye.g(option.btn.name).disabled = false;
					if(ye.g(option.btn.name).nodeName.toUpperCase()=='BUTTON')
						ye.g(option.btn.name).innerHTML = option.btn.original;
					else
						ye.g(option.btn.name).value = option.btn.original;
					option.success && option.success.call(this,env);
				}).fail(function(xhr){
					option.failed && option.failed.call(this,xhr);
				});
			}
			else{
				if(option.success){
					option.success.apply(this);
				}
				
				subdom.submit();
			}
		}
	};

	/**
	 * 按照指定规则test
	 * @option : [{
			            		value : id,
			            		rule : 'int',
			            		correct : '正确',
			            		warning : '字段ID必须'
			            }]
	 */
	ye.test = function(option){
		var ret = true;
		for(var i=0;i<option.length;i++){
	        func = '_'+option[i].rule; 
	        if(!ye[func](null,option[i].value)){
	            alert(option[i].warning);
			    ret = false;
	            break;
	        }
		}
		return ret;
	}

	ye._task_key  = function(k){
		if(ye.isEmpty(k))
			return;
		
		var val = this.conf[k];
		
		//兼容easyui问题
		var ret = false;
		if(val[0] && $('#'+k).hasClass('combo-f')){
			var _jd = $(this._dom).find('*[name='+k+']');
			var k2 = _jd[0];
			ret = ye['_'+val[0]](k2,_jd.val());
		}else if(val[0]){
			var tar_val = $('#'+k).length>0?$('#'+k).val():$(k).val();
			
			var funs = val[0].split('|');
			for(var i=0;i<funs.length;i++){
				if(ret = ye['_'+funs[i]](k,tar_val))
					break;
			}
		}
		
		var option = this._option;
		
		var d = ye.g(this._format_key(k)+'_msg');
		if(!d){
			var cd = ye.create("label");
			cd.id = k+'_msg';
			$(cd).addClass('control-label').addClass('text-left');//bootstrap css
			var msgdom;
			if(ye.g(k))
				msgdom = ye.g(k);
			else if(this._option.form)
				msgdom = $(this._option.form).find('*[name='+k+']')[0];
			else
				msgdom = $(this._dom).find('*[name='+k+']')[0];
			
			if(msgdom && msgdom.parentNode && msgdom.parentNode.parentNode)
				msgdom.parentNode.parentNode.appendChild(cd);
			else{
				msgdom.parentNode.appendChild(cd);
			}
			
			d = ye.g(k+'_msg');
		}
		
		var val2 = this._task_var(val[2]);
		var val1 = this._task_var(val[1]);
		if(ret==2){
			return ;
		}else if(ret){
			d.innerHTML = val2;
			$(d).removeClass(option.msg.error).addClass(option.msg.right);
			ye.css(ye.g(k),{'borderColor':'','backgroundColor':''});
			return;
		}else{
			d.innerHTML = val1;
			$(d).removeClass(option.msg.right).addClass(option.msg.error);
			ye.css(ye.g(k),{'borderColor':'#f00',
				'backgroundColor':'#FFCCCC'
			});
			return true;
		}
	};

	/*格式化key*/
	ye._format_key = function(k){
		if(/\[name\=\w+\]/.test(k)){
			return /\[name=\w+\]/.exec(k)[0].replace('[name=','').replace(']','');
		}else
			return k;
	};

	/*在开头字母为@的时候当变量处理*/
	ye._task_var = function(k){
		if(typeof k!='undefined' && k.indexOf('@')==0){
			var val = k.substring(1);
			var ret = "";
			eval('ret='+val);
			return ret;
		}
		else
			return k;
	};

	ye._do_blur = function(d){
		ye._task_key(d);
	};

	/*焦点移开验证*/
	ye.do_blur = function(option){
		this._option = option;
		for(var k in this.conf){
			if(this.conf[k][0]=='radio'){
				$('input[name='+k+']').on('blur',function(){
					ye._do_blur(this.id);
				});
			}else{
				ye.g(k).onblur = function(){
					ye._do_blur(this.id);
				};	
			}
		}
	};

	ye.do_keyup = function(option){
		this._option = option;
		for(var k in this.conf){
			ye.g(k).onkeyup = function(){//绑定onkeyup函数
				ye._do_blur(this.id);
			};
		}
	};

	/*手机号码验证*/
	ye._mobile = function(id,val){
		return /^1\d{10}$/.test(val);
	};

	/*电子邮件验证*/
	ye._email = function(id,val){
		return /^(\w|\d|_|\-|\.){1,20}@(\w|\d|-)+\.(com|cn|net|gov\.cn|com\.cn|net\.cn)$/.test(val);
	};

	/*日期格式验证*/
	ye._date = function(id,val){
		return /^\d{4}\-\d{1,2}-\d{1,2}$/.test(val);
	};

	/*必填字段*/
	ye._require = function(id,val){
		var ret = val && val!='' ? true : false;
		return ret;
	};

	/*必填字段 默认为0情况*/
	ye._require0 = function(id,val){
		return val=='0' ? false : true;
	};

	/*性别*/
	ye._sex = function(id){
		return this._radio(id);
	};

	/*单选*/
	ye._radio = function(id){
		var tag = document.getElementsByTagName("input");
		for(var i=0;i<tag.length;i++){
			if(tag[i].name == id){
					if(tag[i].checked)
					return true;
			}	
		}
		return false;
	};

	/*数字*/
	ye._int = function(id,val){
		if(typeof val == 'undefined'){
			val = ye.g(id).value;
		}
		return /^\d+$/.test(val);
	};

	/*price*/
	ye._price = function(id,val){
		return /^(\d|\.)+$/.test(val);
	};

	/*电话*/
	ye._phone = function(id,val){
		return /(^\d{11}$)|(^\d{3,5}\-\d{7,8}$)|(^\d{3,5}\-\d{7,8}\-\d{4}$)/.test(val);
	};

	/*手机*/
	ye._mobile = function(id,val){
		return /^\d{11}$/.test(val);
	};

	/*身份证号*/
	ye._idcard = function(id,val){
		return /^[\dx]{15,18}$/.test(val);
	};

	/*年龄*/
	/**
	 *  需要对表单值进行配置 如：<input name='name' check-conf="agestart:18,ageend:60" />
	 *  agestart:开始年龄
	 *  ageend:结束年龄
	 */
	ye._age = function(id,val){
		var d = ye.g(id);
		var checkconf = ye.getAttr(d,'check-conf');	
		eval('var cdataconf='+checkconf);
		
		if(val >cdataconf.agestart && val <= cdataconf.ageend)
			return true;
		else
			return false;
	};

	/*IP验证*/
	ye._ip = function(id,val){
		if(typeof val == 'undefined'){
			val = ye.g(id).value;
		}
		var ipRegex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
		return ipRegex.test(val);
	};

	/*空值验证*/
	ye._null = function(id,val){
		return isEmpty(val);
	}
})(ye,$);