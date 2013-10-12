module.exports = AbstractService;
var uuid       = require ('node-uuid');

function AbstractService () {}

AbstractService.prototype.connections = {};

AbstractService.prototype.connect = function (connection)
{
    var id    = uuid.v4 ();

    connection.uuid   = id;
    connection.closed = (function ()     { this.disconnect(connection); }).bind(this);
    connection.read   = (function (data) { this.recv(connection, data); }).bind(this);

    //console.log (id + ' connected');
    //this.connections[id] = connection;

    return connection;
}

AbstractService.prototype.recv = function (connection, data)
{
    console.log('[service] <- ' + data);
    console.log('[service] -> ' + data);
    this.send (connection, data.toString());
}

AbstractService.prototype.disconnect = function (id)
{
    //console.log (id + ' disconnected');
}

AbstractService.prototype.send = function(connection, data)
{
    connection.write(data);
}