//封装websocket连接、接收消息、重连、保持心跳
var wsPath="172.16.1.15:8080/gongdi/";
var myws={
	isConnected:false,
	ws:null,
	connect:function(){
	    if ('WebSocket' in window) {
	        this.ws= new WebSocket("ws://"+wsPath+"websck");
	    }else {
	        this.ws = new SockJS("http://"+wsPath+"sockjs/websck/info");
	    }
	    this.ws.onopen=this.onopen;
	    this.ws.onmessage=this.onmessage;
	    this.ws.onclose=this.onclose;
	    this.ws.onerror=this.onerror;
	},
	onopen:function(){
		myws.isConnected=true;
    	log('myws.isConnected:'+myws.isConnected);
	},
	onmessage:function(event){
		log('messeage:'+event.data);
		var data =JSON.parse(event.data);
		if(data.type=="operatingInstruction" && data.hasOwnProperty("taskId")){
			
		}
	},
	onclose:function(event){
		myws.isConnected=false;
		log('close');
//		myws.connect();
	},
	onerror:function(e){
		log('error');
//		myws.connect();
	},
	send:function(data){
		var data=JSON.stringify(data)
		this.ws.send(data);
		log('send:'+data);
	}
	
};
myws.connect();
var count=0;
setInterval(function(){
	if(myws.isConnected){
		var data={type:'heart',msg:'hello',count:count++};
		myws.send(data);
	}
},100000)
function log(message){
	console.log(message);
}

