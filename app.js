//var TcpInterface  = require ('./network/interface/tcp');
var WsInterface   = require ('./network/interface/ws');
//var Service       = require ('./network/service/service');
//var ApiService    = require ('./network/service/api');
var JsonService   = require ('./network/service/json');

var api_v1  	  = require('./api/v1');


var websocket = new WsInterface (new JsonService (api_v1));
	websocket.listen (30001, function ()
	{
		// server ready and listening
	    console.log (websocket.server.address ());
	});