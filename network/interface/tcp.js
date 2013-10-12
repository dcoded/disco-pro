module.exports  = TcpInterface;
var net         = require ('net');
var IConnection = require ('./iconnection');


function TcpInterface(service)
{
    this.service  = service;
    this.server   = null;
}

TcpInterface.prototype.ANY_PORT = 0;

TcpInterface.prototype.listen = function(a, b)
{
    this.server = net.createServer();
    this.server.on ('connection', this.create_connection.bind(this));

    if (typeof a == 'function')
    {
        this.server.listen(a);
    }
    else if(typeof a == 'number' && typeof b == 'function')
    {
        this.server.listen(a, b);
    }
    else throw "[TcpInterface] valid calls: listen(port, cb), listen(cb)";
}

TcpInterface.prototype.create_connection = function (client)
{
    var connection = new IConnection ();

    connection.write = function(data) { client.write(data); }
    connection.close = function()     { client.end(); }

    connection = this.service.connect (connection);

    client.on ('data',  connection.read);
    client.on ('close', connection.closed);
}