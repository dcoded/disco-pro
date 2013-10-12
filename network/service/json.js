module.exports = JsonService;

var AbstractService = require ('./service');

function JsonService (handler)
{
	this.handler = handler;
}
JsonService.prototype = new AbstractService();

JsonService.prototype.error =
{
	BAD_JSON 			 : { code : 0, what : "malformed JSON recieved"},
	MISSING_ACTION_FIELD : { code : 1, what : "required 'action' field is missing"},
	INVALID_ACTION_FIELD : { code : 2, what : "value for 'action' field is unknown to service"}
};

JsonService.prototype.send = function(connection, object)
{
	connection.write(JSON.stringify(object));
}


JsonService.prototype.recv = function(connection, json)
{
	try
	{
		var object = JSON.parse(json);
	}
	catch(ex)
	{
		console.log(ex);

		this.send(connection,
		{
			error    : this.error.BAD_JSON
		});
		return;
	}


	if(object.request === undefined)
	   object.request = 0;

	if(object.data === undefined)
	   object.data = {};


	if(object.action === undefined)
	{
		this.send(connection,
		{
			response : object.request,
			error    : this.error.MISSING_ACTION_FIELD
		});
	}
	else
	{
		var handler = this.handler;
		var links   = object.action.split('.');

		try
		{
			for(var i in links)
				handler = handler[links[i]];
		}
		catch(ex)
		{
			console.log(ex)
			this.send(connection,
			{
				response : object.request,
				error    : this.error.INVALID_ACTION_FIELD
			});
			return;
		}

		if(typeof handler !== 'function')
		{
			this.send(connection,
			{
				response : object.request,
				error    : this.error.INVALID_ACTION_FIELD
			});	
		}

		else
		{
			var res = handler.bind(connection)(object.data);
			if(res !== undefined)
			{
				res.response = object.request;
				res.action   = object.action;

				this.send(connection, res);
			}
		}

	}
}