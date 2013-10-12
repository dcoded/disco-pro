module.exports = IConnection;


function IConnection () {}

IConnection.prototype.read   = function (data)   { console.log('non initialized Connection.read()'); }
IConnection.prototype.write  = function (data)   { console.log('non initialized Connection.write()'); }
IConnection.prototype.close  = function ()       { console.log('non initialized Connection.close()'); }
IConnection.prototype.closed = function()        { console.log('non initialized Connection.closed()'); }