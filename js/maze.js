Array.prototype.clone = function() {
	return [].concat(this);
}
var game = function(element, options) {
	options = options || {
		number: 9
	};
	this.element = this.get(element);
	this.width = Math.pow(options.number, 0.5);
	this.timer = 1000;
	this.crossrate = 0.9; //杂交率 
	this.mutationrate = 0.1 //变异率 
	this.veclen = 400; //基因组的长度 
	this.zero = null;
	this.count = 0;
	this.good = null;
	this.inerterval = null;
	this.finished = false;
	this.map = (function() {
		// 随即生成1到100的打乱的数组，这个算法是跟JK学习的，也算是一种洗牌算法，感觉不错，谢谢JK   
		var i,
			len = 9,
			oldsource = [1, 2, 3, 4, 5, 6, 7, 8, 0];
		var cpos = 8,
			tmp;
		for(i = 0; i < 1000; i++) {
			var random = Math.floor(Math.random() * 5);
			if(random == 0) { //上 
				if(cpos < 3) {
					continue;
				} else {
					tmp = oldsource[cpos];
					oldsource[cpos] = oldsource[cpos - 3];
					oldsource[cpos - 3] = tmp;
					cpos = cpos - 3;
				}
			} else if(random == 1) {
				if(cpos >= 6) {
					continue;
				} else {
					tmp = oldsource[cpos];
					oldsource[cpos] = oldsource[cpos + 3];
					oldsource[cpos + 3] = tmp;
					cpos = cpos + 3;
				}
			} else if(random == 2) {
				if(cpos % 3 == 0) {
					continue;
				} else {
					tmp = oldsource[cpos];
					oldsource[cpos] = oldsource[cpos - 1];
					oldsource[cpos - 1] = tmp;
					cpos = cpos - 1;
				}
			} else {
				if((cpos + 1) % 3 == 0) {
					continue;
				} else {
					tmp = oldsource[cpos];
					oldsource[cpos] = oldsource[cpos + 1];
					oldsource[cpos + 1] = tmp;
					cpos = cpos + 1;
				}
			}
		}

		return oldsource;
	}());
	this.group = (function() {
		var arr = [],
			len = 160,
			veclen = 400;
		for(var i = 0; i < len; i++) {
			var vec = [];
			for(var j = 0; j < veclen; j++) {
				vec.push(Math.floor(Math.random() * 4));
			}
			arr.push(vec);
		}
		return arr;
	})();
	this.minscore = null;
	this.max = "0|group";
	this.cmap = null;
	this.score = (function() {
		var arr = [],
			len = 160;
		for(var i = 0; i < len; i++) {
			arr.push(0);
		}
		return arr;
	})();
	this.initmap();
}
game.prototype = {
	initmap: function() {
		var i = 0,
			j = 0,
			width = this.width,
			html = [],
			map = this.map;
		for(i = 0; i < width; i++) {
			var tmp = [];
			for(j = 0; j < width; j++) {
				var value = map[i * 3 + j];
				tmp.push("<div class='box1 " + (value == 0 ? "null" : "") + "' index='" + (i * 3 + j) + "'>" + value + "</div>");
			}
			html.push(tmp.join(""));
		}
		this.element.innerHTML = html.join("");
		this.element.style.width = width * 64 + "px";
		for(i = 0; i < width * width; i++) {
			if(map[i] == 0) {
				this.zero = i;
				break;
			}
		}
	},
	get: function(element) {
		return typeof element == "string" ? document.getElementById(element) : element;
	},
	slove: function() {},
	/** 
	 * 
	 *a,b为map中的index位置 
	 */
	swap: function(a, b) {
		var map = this.map;

		var el_a, el_b;
		var els = this.element.getElementsByTagName("div");
		for(var i = 0; i < els.length; i++) {
			var el = els[i];
			if(el.innerHTML == map[a]) {
				el_a = el;
			}
			if(el.innerHTML == map[b]) {
				el_b = el;
			}
		}
		var tmp = map[a];
		map[a] = map[b];
		map[b] = tmp;

		// 交换内容 
		tmp = el_a.innerHTML;
		el_a.innerHTML = el_b.innerHTML;
		el_b.innerHTML = tmp;

		//交换index 
		tmp = el_a.getAttribute("index");
		el_a.setAttribute("index", el_b.getAttribute("index"));
		el_b.setAttribute("index", tmp);
		//交换class 
		tmp = el_a.className;
		el_a.className = el_b.className;
		el_b.className = tmp;
	},
	/** 
	 *杂交 
	 */
	cross: function(mum, dad, crossrate) {
		var child1 = mum,
			child2 = dad;
		crossrate = crossrate || this.crossrate;
		var crate = Math.random();
		if(crate < crossrate)
			return [mum, dad];
		var crosspos = Math.floor(Math.random() * this.veclen);
		for(var i = 0; i < crosspos; i++) {
			child1[i] = mum[i];
			child2[i] = dad[i];
		}
		for(i = crosspos; i < this.veclen; i++) {
			child2[i] = mum[i];
			child1[i] = dad[i];
		}
		return [child1, child2];
	},
	draw: function(good) {
		var good = good || this.good,
			index = this.goodindex;
		var i = 0;
		var me = this;
		var tmppos = me.zero;
		me.inerterval = setInterval(function() {
			if(me.map.join("") == [1, 2, 3, 4, 5, 6, 7, 8, 0].join("") || i > index) {
				window.clearInterval(me.inerterval);
			}
			var dot = good[i];
			if(dot == 0) { //上 
				if(me.zero >= 3) {
					me.swap(me.zero, me.zero - 3);
					me.zero = me.zero - 3;
				}
			} else if(dot == 1) { //下 
				if(me.zero < 6) {
					me.swap(me.zero, me.zero + 3);
					me.zero = me.zero + 3;
				}

			} else if(dot == 2) { //左 
				if(me.zero % 3 != 0) {
					me.swap(me.zero, me.zero - 1);
					me.zero = me.zero - 1;
				}
			} else if(dot == 3) { //右 
				if((me.zero + 1) % 3 != 0) {
					me.swap(me.zero, me.zero + 1);
					me.zero = me.zero + 1;
				}
			}
			i++;
		}, 50);
	},
	/** 
	 *变异 
	 */
	mutation: function(data, crate) {

		crate = crate == true ? 0 : Math.random();
		if(crate > this.mutationrate) {
			return data;
		}
		var crosspos;
		for(var i = 0; i < 8; i++) {
			crosspos = Math.floor(Math.random() * this.veclen);
			data[crosspos] = Math.floor(Math.random() * 4);
		}

		return data;
	},
	/** 
	 *变异所有 
	 */
	mutationall: function() {
		for(var i = 0; i < this.group.length; i++) {
			var data = this.group[i];
			var crosspos = Math.floor(Math.random() * this.veclen);
			data[crosspos] = Math.floor(Math.random() * 4);
			crosspos = Math.floor(Math.random() * this.veclen);
			data[crosspos] = Math.floor(Math.random() * 4);
			crosspos = Math.floor(Math.random() * this.veclen);
			data[crosspos] = Math.floor(Math.random() * 4);
			crosspos = Math.floor(Math.random() * this.veclen);
			data[crosspos] = Math.floor(Math.random() * 4);
			crosspos = Math.floor(Math.random() * this.veclen);
			data[crosspos] = Math.floor(Math.random() * 4);
			crosspos = Math.floor(Math.random() * this.veclen);
			data[crosspos] = Math.floor(Math.random() * 4);
		}
	},
	/** 
	 *赌轮算法 
	 */
	wheel: function() {
		var group = this.group,
			score = this.score,
			len = group.length,
			totalscore = this.getTotalScore(),
			plusscore = 0,
			r = null,
			random = Math.random() * totalscore;

		for(var i = 0; i < len; i++) {
			if(plusscore >= random) {

				return group[i];
				break;
			} else {
				plusscore += parseInt(score[i]);
			}
		}
		return group[0];
	},
	/** 
	 *获取分数综合 
	 */
	getTotalScore: function() {
		var sum = 0;
		for(var i = 0; i < this.score.length; i++) {
			sum += parseInt(this.score[i]);
		}
		return sum;
	},
	/** 
	 *根据当前的group来计算适应性分数 
	 */
	updateScore: function() {
		var group = this.group,
			score = this.score,
			len = group.length;
		for(var i = 0; i < len; i++) {

			score[i] = this.getScore(group[i]);
			if(this.minscore == null) {
				this.minscore = group[i];
			} else {
				if(score[i] < this.minscore) {
					this.minscore = group[i];
				}
			}
			if(score[i] == 9) {
				this.good = group[i];
				this.finished = true;
				break;
			}
		}
	},
	getScore: function(vec) {
		var tmpgroup = this.map.clone(),
			tmppos = this.zero;
		var anim = [];
		var ans = [1, 2, 3, 4, 5, 6, 7, 8, 0];
		//console.log(tmpgroup); 
		for(var i = 0; i < vec.length; i++) {
			var dot = parseInt(vec[i]);
			if(dot == 0) { //上 
				if(tmppos < 3) {
					continue;
				}
				anim.push(dot);
				var temp = tmpgroup[tmppos - 3];
				if(temp == undefined) console.log("un")
				tmpgroup[tmppos - 3] = tmpgroup[tmppos];
				tmpgroup[tmppos] = temp;
				tmppos = tmppos - 3;
				if(this.check(tmpgroup, i)) {
					console.log("finished,路径为:" + anim.join(""));
					this.goodindex = i;
					this.draw(anim)
					return 9;
					break;
				}
			} else if(dot == 1) { //下 
				if(tmppos >= 6) {
					continue;
				}
				anim.push(dot);
				var temp = tmpgroup[tmppos + 3];
				if(temp == undefined) console.log("un")
				tmpgroup[tmppos + 3] = tmpgroup[tmppos];
				tmpgroup[tmppos] = temp;
				tmppos = tmppos + 3;
				if(this.check(tmpgroup, i)) {
					console.log("finished,路径为:" + anim.join(""));
					this.goodindex = i;
					this.draw(anim)
					return 9;
					break;
				}
			} else if(dot == 2) { //左 
				if(tmppos % 3 == 0) {
					continue;
				}
				anim.push(dot);
				var temp = tmpgroup[tmppos - 1];
				if(temp == undefined) console.log("un")
				tmpgroup[tmppos - 1] = tmpgroup[tmppos];
				tmpgroup[tmppos] = temp;
				tmppos = tmppos - 1;
				if(this.check(tmpgroup, i)) {
					console.log("finished,路径为:" + anim.join(""));
					this.goodindex = i;
					this.draw(anim)
					return 9;
					break;
				}
			} else if(dot == 3) { //右 
				if((tmppos + 1) % 3 == 0) {
					continue;
				}
				anim.push(dot);
				var temp = tmpgroup[tmppos + 1];
				if(temp == undefined) console.log("un")
				tmpgroup[tmppos + 1] = tmpgroup[tmppos];
				tmpgroup[tmppos] = temp;
				tmppos = tmppos + 1;
				if(this.check(tmpgroup, i)) {
					console.log("finished,路径为:" + anim.join(""));
					this.goodindex = i;
					this.draw(anim)
					return 9;
					break;
				}
			}
		}

		var nowscore = 0;

		for(var i = 0; i < 9; i++) {
			if(ans[i] == tmpgroup[i]) {
				nowscore++;
			}
		}

		var a = this.max.split("|");
		if(nowscore > parseInt(a)) {
			this.max = nowscore + "|" + tmpgroup.join("");
		}
		this.cmap = tmpgroup;
		return nowscore;
	},
	check: function(group, index) {
		var ans = [1, 2, 3, 4, 5, 6, 7, 8, 0],
			nowscore = 0;
		for(var i = 0; i < 9; i++) {
			//for(var j = 0 ; j < 9 ; j++){ 
			if(ans[i] == group[i]) {
				nowscore++;
			}
		}
		return nowscore == 9;
	},
	/** 
	 *生成下一个子代的基因族群 
	 */
	nextGroup: function() {
		var group = this.group,
			len = group.length,
			newgroup = [],
			greatChild = 0;
		for(var i = 1; i < len; i++) {
			if(this.score[i] > this.score[greatChild]) {
				greatChild = i;
			}
		}
		while(newgroup.length < len) {
			if(this.count > 1000) {
				this.mutationall();
			}
			var mum = this.wheel();
			var dad = this.wheel();
			//console.log(mum,dad); 
			//console.log(this.cross(mum,dad)); 

			if(mum == dad) {
				newgroup.push(this.mutation(mum));
			} else {

				//console.log(childs); 

				var childs = this.cross(mum, dad, this.crossrate);

				if(newgroup.length < len) {
					newgroup.push(childs[0])
				}
				if(newgroup.length < len) {
					newgroup.push(childs[1])
				}
			}
			var child = this.wheel();
			if(newgroup.length < len) {
				newgroup.push(this.mutation(child));
			}
		}
		for(var i = 0; i < len; i++) {
			this.group[i] = newgroup[i];
		}
		//console.log(this.group,newgroup); 
	},
	epoch: function() {
		var me = this;
		me.count++;
		me.updateScore();
		me.nextGroup();
		//console.log(me.getTotalScore()); 
		if(!me.finished && me.timer > 0) {
			me.timer--;
			me.epoch();
		} else {
			this.timer = 1000;
			console.log("stoped");
		}

	}
}
var g = new game("map");