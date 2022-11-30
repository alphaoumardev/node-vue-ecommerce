const path = require("path");

// 获取数据库模型
databaseModule = require(path.join(process.cwd(),"modules/database")); 
const logger = require('../modules/logger').logger();

module.exports.create = function(modelName,obj,cb)
{
	const db = databaseModule.getDatabase();
	const Model = db.models[modelName];
	Model.create(obj,cb);
}

module.exports.list = function(modelName,conditions,cb)
{
	const db = databaseModule.getDatabase();

	let model = db.models[modelName];

	if(!model) return cb("模型不存在",null);



	if(conditions)
	{
		if(conditions["columns"])
		{
			model = model.find(conditions["columns"]);
		} else
		{
			model = model.find();
		}

		if(conditions["offset"])
		{
			model = model.offset(parseInt(conditions["offset"]));
		}

		if(conditions["limit"])
		{
			model = model.limit(parseInt(conditions["limit"]));
		}

		if(conditions["only"])
		{
			model = model.only(conditions["only"]);
		}

		if(conditions["omit"])
		{
			model = model.omit(conditions["omit"]);
		}

		if(conditions["order"])
		{
			model = model.order(conditions["order"]);
		}

	} else
	{
		model = model.find();
	}

	model.run(function(err,models)
	{
		
		if(err)
		{
			console.log(err);
			return cb("查询失败",null);
		}
		cb(null,models);
	});
};

module.exports.countByConditions = function(modelName,conditions,cb)
{
	const db = databaseModule.getDatabase();

	let model = db.models[modelName];

	if(!model) return cb("模型不存在",null);

	const resultCB = function(err,count)
	{
		if(err)
		{
			return cb("查询失败",null);
		}
		cb(null,count);
	}

	if(conditions)
	{
		if(conditions["columns"])
		{
			model.count(conditions["columns"], resultCB);
		} else
		{
			model.count(resultCB);
		}

	} else
	{
		model.count(resultCB);
	}

};

module.exports.findOne = function(modelName,conditions,cb)
{
	const db = databaseModule.getDatabase();

	const Model = db.models[modelName];

	if(!Model) return cb("模型不存在",null);

	if(!conditions) return  cb("条件为空",null);

	Model.one(conditions,function(err,obj)
	{
		logger.debug(err);
		if(err)
		{
			return cb("查询失败",null);
		}
		return cb(null,obj);
	});
}

module.exports.update = function(modelName,id,updateObj,cb)
{
	const db = databaseModule.getDatabase();
	const Model = db.models[modelName];
	Model.get(id,function(err,obj)
	{
		if(err) return cb("更新失败",null);
		obj.save(updateObj,cb);
	});
}

module.exports.show = function(modelName,id,cb)
{
	const db = databaseModule.getDatabase();
	const Model = db.models[modelName];
	Model.get(id,function(err,obj)
	{
		cb(err,obj);
	});
}

module.exports.destroy = function(modelName,id,cb)
{
	const db = databaseModule.getDatabase();
	const Model = db.models[modelName];
	Model.get(id,function(err,obj)
	{
		if(err) return cb("无模型ID");
		obj.remove(function(err)
		{
			if(err) return cb("删除失败");
			return cb(null);
		});
	});
}

module.exports.count = function(modelName,cb)
{
	const db = databaseModule.getDatabase();
	const Model = db.models[modelName];
	Model.count(cb);
}


module.exports.exists = function(modelName,conditions,cb)
{
	const db = databaseModule.getDatabase();
	const Model = db.models[modelName];
	Model.exists(conditions,function(err,isExists)
	{
		if(err) return cb("查询失败");
		 cb(null,isExists);
	});
}

module.exports.getModel = function(modelName)
{
	const db = databaseModule.getDatabase();
	return db.models[modelName];
}