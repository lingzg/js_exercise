var myApp = {}
myApp.person = {
	name: 'tom',
	sex: '男'
};
var contextPath = "/" + window.location.pathname.split("/")[1];
var AjaxHelp = {
	getjsonParm: function(rangeID) {
		var range = $("#" + rangeID);
		if(range) {
			var dataStr = "{";
			var inputs = range.find("input");
			var selects = range.find("select");
			var textAreas = range.find("textarea");
			var items = $.merge(inputs, selects);
			items = $.merge(items, textAreas);
			if(items && items.length > 0) {
				items.each(function(i, item) {
					var name = $(this).attr("name");
					var value = $(this).val();
					if(i == (inputs.length - 1)) {
						dataStr += name + ":'" + value + "'";
					} else {
						dataStr += name + ":'" + value + "',";
					};
				});
			}
			dataStr += "}";
			var data = eval("(" + dataStr + ")");
			var date = new Date();
			data.currTime = date.getSeconds();
			return data;
		}
		return {};
	},
	myAjax: function(url, params, callBack, render) {
		var option = {};
		option.beforeSend = function() {
			if(render) {
				jQuery(render).showLoading();
			}
		};
		option.complete = function() {
			if(render) {
				jQuery(render).hideLoading();
			}
		};
		option.url = contextPath + url;
		option.type = "post";
		option.dataType = "json";
		if(params == null) {
			params = {};
		}
		//处理缓存
		var date = new Date();
		params._dtstime = date.getTime();
		option.data = params;
		option.success = callBack;
		option.error = function(XMLHttpRequest, textStatus, errorThrown) {
			//alert("请求失败"); 
		};
		$.ajax(option);
	}
};

function writeln(str) {
	document.write(str + '<br/>');
}
myApp.student = Object.beget(myApp.person);
myApp.student.name = 'jerry';
writeln(myApp.student.name);
writeln(myApp.person.name);
myApp.student.age = 20;
for(var i in myApp.student) {
	writeln(i + ',' + myApp.student[i] + ',' + (typeof myApp.student[i]));
}
delete myApp.student.name;
writeln(myApp.student.name);
writeln(JSON.stringify(myApp));

myApp.myObject = {
	value: 0,
	increment: function(inc) {
		return this.value += typeof inc === 'number' ? inc : 1;
	}
}

writeln(myApp.myObject.increment(1));
writeln(myApp.myObject.increment(2));
writeln(myApp.myObject.increment(3));
writeln((-10 / 3).integer());
writeln((10 / 3).integer());
writeln('  ab sd  '.trim());
writeln('  ab sd  '.removeBlank());
var timer = null;

function clock() {
	if(timer == null) {
		timer = setInterval(function() {
			$('#time').html(new Date().format('yyyy-MM-dd hh:mm:ss.S'));
		}, 1000)
	} else {
		clearInterval(timer);
		timer = null;
	}

}
var haoni = function(disc, src, aux, dst) {
		if(disc > 0) {
			haoni(disc - 1, src, dst, aux);
			writeln('move disc ' + disc + ' from ' + src + ' to ' + dst);
			haoni(disc - 1, aux, src, dst);
		}
	}
	//haoni(10,'源','中转','目标');
var walk_the_Dom = function walk(node, func) {
	func(node);
	node = node.firstChild;
	while(node) {
		walk(node, func);
		node = node.nextSibling;
	}
}
var getElementByAttribute = function(attr, value) {
	var results = [];
	walk_the_Dom(document.body, function(node) {
		var actual = node.nodeType === 1 && node.getAttribute(attr);
		if(typeof actual === 'string' && (actual === value || typeof value !== 'string')) {
			results.push(node);
		}
	});
	return results;
}

//尾递归
var factorial = function factorial(i, a) {
		a = a || 1;
		if(i < 2) {
			return a;
		}
		return factorial(i - 1, i * a);
	}
	//writeln('factorial : '+factorial(3,3));
var myObject = function() {
	var value = 0;
	return {
		increment: function(inc) {
			value += typeof inc === 'number' ? inc : 1;
		},
		getValue: function() {
			return value;
		}
	};
}();
//console.log(myObject);
var quo = function(status) {
	return {
		getStatus: function() {
			return status;
		}
	};
};
var myQuo = quo('amazed');
//console.log(quo);
//writeln(myQuo.getStatus());
var fade = function(node) {
		var level = 1;
		var step = function() {
			var hex = level.toString(16);
			node.style.backgroundColor = '#FFFF' + hex + hex;
			if(level < 15) {
				level++;
				setTimeout(step, 200);
			}
		}
		setTimeout(step, 200);
	}
	//fade(document.body);
var add_the_handlers = function(nodes) {
	var i;
	for(i = 0; i < nodes.length; i++) {
		nodes[i].onclick = function(e) {
			alert(i);
		}
	}
}
var addTheHandlers = function(nodes) {
		var i;
		for(i = 0; i < nodes.length; i++) {
			nodes[i].onclick = function(j) {
				return function(e) {
					alert(j);
				};
			}(i);
		}
	}
	//add_the_handlers(document.getElementsByTagName('input'));
	//addTheHandlers(document.getElementsByTagName('input'));
	//writeln('&lt;&quot;&gt;'.deentityify());
var serial_maker = function() {
	var perfix = '';
	var seq = 0;
	return {
		setPerfix: function(p) {
			perfix = p;
		},
		setSeq: function(s) {
			seq = s;
		},
		gensym: function() {
			return perfix + (seq++);
		}
	};
};
var seqer = serial_maker();
seqer.setPerfix('Q');
seqer.setSeq(1000);
//writeln(seqer.gensym());
//writeln(seqer.gensym());
(function() {
	this.appName = 'good';
	document.body.addEventListener('click', (function(me) {
		return function(e) {
			//alert(me.appName);
			//console.log(e);
		};

	})(this), false);
})()
var add = function(a, b) {
	if(typeof a !== 'number' || typeof b !== 'number') {
		throw {
			name: 'TypeError',
			message: 'add need numbers'
		};
	}
	return a + b;
}
var mult=function (a,b) {
	return a*b;
}
var add1 = add.curry(1);
//writeln(add1(6));
var fibonacci = function() {
	var memo = [0, 1];
	var fib = function(n) {
		var result = memo[n];
		if(typeof result !== 'number') {
			result = fib(n - 1) + fib(n - 2);
			memo[n] = result;
		}
		return result;
	};
	return fib;
}();
var genFibonacci = function(n) {
	var array = [];
	for(var i = 1; i <= n; i++) {
		array.push(fibonacci(i));
	}
	return array;
}
writeln(genFibonacci(20));
var memoizer = function(memo, fundamental) {
	var shell = function(n) {
		var result = memo[n];
		if(typeof result !== 'number') {
			result = fundamental(shell, n);
			memo[n] = result;
		}
		return result;
	};
	return shell;
};
var fibonacci2 = memoizer([0, 1], function(shell, n) {
	return shell(n - 1) + shell(n - 2);
});
writeln(fibonacci(20));
writeln(fibonacci2(20));
var factorial2 = memoizer([1, 1], function(shell, n) {
	return n * shell(n - 1);
});
writeln(factorial(15));
writeln(factorial2(15));
var mammal = function(spec) {
	var that = {};
	that.get_name = function() {
		return spec.name;
	};
	that.says = function() {
		return spec.saying || '';
	};
	return that;
};
var myMammal = mammal({
	name: 'Herb'
});
var cat = function(spec) {
	spec.saying = spec.saying || 'meow';
	var that = mammal(spec);
	that.purr = function(n) {
		var i, s = '';
		for(i = 0; i < n; i++) {
			if(s) {
				s += '-';
			}
			s += 'r';
		}
	};
	that.get_name = function() {
		return that.says() + ' ' + spec.name + ' ' + that.says();
	};
	return that;
};
var myCat = cat({
	name: 'Henrietaa'
});
var coolcat = function(spec) {
	var that = cat(spec),
		super_get_name = that.superior('get_name');
	that.get_name = function(n) {
		return 'like ' + super_get_name() + ' bay';
	};
	return that;
};
var myCoolcat = coolcat({
	name: 'Bix'
});
writeln(myCoolcat.get_name());
var eventuality = function(that) {
	var registry = {};
	that.fire = function(event) {
		var array, func, handler, i,
			type = typeof event === 'string' ? event : event.type;
		if(registry.hasOwnProperty(type)) {
			array = registry[type];
			for(var i = 0; i < array.length; i++) {
				handler = array[i];
				func = handler.method;
				if(typeof func === 'string') {
					func = this[func];
				}
				func.apply(this, handler.parameters || [event]);
			}
		}
		return this;
	};
	that.on = function(type, method, parameters) {
		var handler = {
			method: method,
			parameters: parameters
		};
		if(registry.hasOwnProperty(type)) {
			registry[type].push(handler);
		} else {
			registry[type] = [handler];
		}
		return this;
	};
	return that;
};
writeln([].isArray());
writeln({}.isArray());
writeln({'1':1,'2':2,'3':3,length:3}.isArray());
var arr=[];
writeln(arr.length);
arr[100]=100;
writeln(arr.length);
var data=[4,8,15,16,23,42];
writeln(data.reduce(add,0));
writeln(data.reduce(mult,1));
data.total=function () {
	return this.reduce(add,0);
};
writeln(data.total());
writeln(Object.typeis(undefined));
writeln(Object.typeis(null));
writeln(Object.typeis(NaN));
writeln(Object.typeis(Number));
writeln(Object.typeis(''));
writeln(Object.typeis([]));
writeln(Object.typeis({}));
writeln(Object.typeis(function () {}));