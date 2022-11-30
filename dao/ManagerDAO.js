const path = require("path");
daoModule = require("./DAO");
databaseModule = require(path.join(process.cwd(),"modules/database"));

module.exports.create = function(obj,cb)
{
	daoModule.create("ManagerModel",obj,cb);
}

module.exports.list = function(conditions,cb)
{
	daoModule.list("ManagerModel",conditions,function(err,models)
	{
		if(err) return cb(err,null);
		cb(null,models);
	});
}

module.exports.findOne = function(conditions,cb)
{
	daoModule.findOne("ManagerModel",conditions,cb);
}

module.exports.findByKey = function(key,offset,limit,cb)
{
	databaseModule.getDatabase();
	let sql = "SELECT * FROM sp_manager as mgr LEFT JOIN sp_role as role ON mgr.role_id = role.role_id";

	if(key)
	{
		sql += " WHERE mg_name LIKE ? LIMIT ?,?";
		database.driver.execQuery(
			sql
		,["%" + key + "%",offset,limit],function(err,managers)
			{
			if(err) return cb("查询执行出错");
			cb(null,managers);
		});
	} else
	{
		sql += " LIMIT ?,? ";
		database.driver.execQuery(sql,[offset,limit],function(err,managers)
		{
			if(err) return cb("查询执行出错");
			cb(null,managers);
		});
	}
}

module.exports.exists = function(username,cb)
{
	const db = databaseModule.getDatabase();
	const Model = db.models.ManagerModel;
	Model.exists(
		{"mg_name":username},function(err,isExists)
		{
		if(err) return cb("查询失败");
		 cb(null,isExists);
	});
}

module.exports.countByKey = function(key,cb)
{
	databaseModule.getDatabase();
	let sql = "SELECT count(*) as count FROM sp_manager";
	if(key)
	{
		sql += " WHERE mg_name LIKE ?";
		database.driver.execQuery(
			sql
		,["%" + key + "%"],function(err,result)
			{
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	} else
	{
		database.driver.execQuery(sql,function(err,result)
		{
			if(err) return cb("查询执行出错");
			cb(null,result[0]["count"]);
		});
	}
	
}

module.exports.show = function(id,cb)
{
	daoModule.show("ManagerModel",id,cb);
}

module.exports.update = function(obj,cb)
{
	daoModule.update("ManagerModel",obj.mg_id,obj,cb);
}

module.exports.destroy = function(id,cb)
{
	daoModule.destroy("ManagerModel",id,function(err)
	{
		if(err) return cb(err);
		return cb(null);
	});
}

module.exports.save = function(obj,cb)
{
	daoModule.show(obj.mg_id,function(err,oldObj)
	{
		if(err)
		{
			daoModule.create("ManagerModel",obj,cb);
		} else
		{
			daoModule.update("ManagerModel",obj.mg_id,obj,cb);
		}
	})
}


module.exports.count = function(cb)
{
	daoModule("ManagerModel",cb);
}