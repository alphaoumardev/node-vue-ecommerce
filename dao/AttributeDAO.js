const path = require("path");
daoModule = require("./DAO");
databaseModule = require(path.join(process.cwd(),"modules/database"));

module.exports.list = function(cat_id,sel,cb)
{
	let db = databaseModule.getDatabase();
	let sql = "SELECT * FROM sp_attribute WHERE cat_id = ? AND attr_sel = ? AND delete_time is NULL";
	database.driver.execQuery(
			sql
		,[cat_id,sel],function(err,attributes)
		{
			if(err) return cb("查询执行出错");
			cb(null,attributes);
		});
}