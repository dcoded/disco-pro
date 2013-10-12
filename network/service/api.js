module.exports = ApiService;

var AbstractService = require ('./service');

function ApiService () {}

ApiService.prototype = new AbstractService();


var i = 0;
ApiService.prototype.recv = function(connection, data)
{
    var response = JSON.stringify({
        'foo' : 'bar',
        'test' : i++
    });
    connection.write("HTTP/1.0 200 OK\r\nContent-Length: " + response.length + "\r\n\r\n" + response);
    connection.close();
}