module.exports  = WsInterface;
var WebSocket   = require ('ws').Server;
var IConnection = require ('./iconnection');



function WsInterface(service)
{
    this.service  = service;
    this.server   = null;
    this.DEF_PORT = 8080;
}

WsInterface.prototype.ANY_PORT = 0;

WsInterface.prototype.listen = function(a, b)
{
    var port;
    var cb;

    if (typeof a == 'function')
    {
        port = this.DEF_PORT;
        cb   = a;
    }
    else if(typeof a == 'number' && typeof b == 'function')
    {
        port = a;
        cb   = b;
    }
    else throw "[WsInterface] valid calls: listen(port, cb), listen(cb)";

    this.server = new WebSocket({port : port});
    this.server.on ('connection', this.create_connection.bind(this));

    this.server.address = function()
    {
        return  {   address : "0.0.0.0",
                    family  : "IPv4",
                    port    : port
                };
    }

    cb();
}

WsInterface.prototype.create_connection = function (client)
{
    var connection = new IConnection ();

    connection.write  = function(data) { client.send(data); }
    connection.close  = function()     { client.close(); }
    connection.remote = function()
    {
        return {
            address : client._socket.remoteAddress,
        };
    }

    connection = this.service.connect (connection);

    client.on ('message', connection.read);
    client.on ('close',   connection.closed);
}