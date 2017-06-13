Function.prototype.method = function(name, func) {
	if(!this.prototype[name]) {
		this.prototype[name] = func;
	}
	return this;
}
Function.method('curry', function() {
	var slice = Array.prototype.slice,
		args = slice.apply(arguments),
		me = this;
	return function() {
		return me.apply(null, args.concat(slice.apply(arguments)));
	};
});

Number.method('integer', function() {
	return Math[this < 0 ? 'ceil' : 'floor'](this);
});
String.method('trim', function() {
	return this.replace(/(^\s+)|(\s+$)/g, '');
});
String.method('removeBlank', function() {
	return this.replace(/\s/g, '')
});
String.method('deentityify', function() {
	var entity = {
		quot: '"',
		lt: '<',
		gt: '>'
	};
	return function() {
		return this.replace(/&([^&;]+);/g, function(a, b) {
			var r = entity[b];
			return typeof r === 'string' ? r : a;
		});
	};
}());
Array.method('reduce', function(func, value) {
	for(var i = 0; i < this.length; i++) {
		value = func(this[i], value);
	}
	return value;
});
Array.method('copyOf', function(original, newLength) {
	var array = new Array(newLength);
	for(var i = 0; i < array.length; i++) {
		array[i] = original[i];
	}
	return array;
});
Array.dim = function(dimension, initial) {
	var a = [],
		i;
	for(i = 0; i < dimension; i++) {
		a[i] = initial;
	}
	return a;
}
Date.method('format', function(fmt) {
	var o = {
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'h+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'q+': Math.floor((this.getMonth() + 3) / 3),
		'S': this.getMilliseconds()
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for(var k in o) {
		if(new RegExp('(' + k + ')').test(fmt)) {
			fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
		}
	}
	return fmt;
});
Object.method('superior', function(name) {
	var that = this,
		method = that[name];
	return function() {
		return method.apply(that, arguments);
	};
});
Object.method('isArray', function() {
	var me = this;
	return me && typeof me === 'object' && typeof me.length === 'number' &&
		typeof me.splice === 'function' && !me.propertyIsEnumerable('length');
});
Object.typeis = function(obj) {
	return Object.prototype.toString.call(obj).slice(8, -1);
};
if(typeof Object.beget !== 'funcion') {
	Object.beget = function(o) {
		var F = function() {};
		F.prototype = o;
		return new F();
	}
}
var Cookie = {
	//两个参数，一个是cookie的名子，一个是值
	setCookie: function(name, value) {
		var Days = 30; //此 cookie 将被保存 30 天
		var exp = new Date(); //new Date("December 31, 9998");
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	},
	//获取cookie
	getCookie: function(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if(arr != null) return unescape(arr[2]);
		return null;
	},
	//删除cookie
	delCookie: function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = Cookie.getCookie(name);
		if(cval != null) {
			document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		}
	}
};