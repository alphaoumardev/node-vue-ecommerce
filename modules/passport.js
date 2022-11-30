const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Strategy = require('passport-http-bearer').Strategy;

const jwt = require("jsonwebtoken");

const _ = require('lodash');

const jwt_config = require("config").get("jwt_config");

// 通过登录函数初始化

module.exports.setup = function (app, loginFunc)
{
	// 用户名密码 登录策略
	passport.use(new LocalStrategy(
		function(username, password, done)
		{
			if(!loginFunc) return done("登录验证函数未设置");

			loginFunc(username,password,function(err,user)
			{
				if(err) return done(err);
				return done(null, user);
			});
		})
	);

	// token 验证策略
	passport.use(new Strategy(
		function(token, done)
		{
			jwt.verify(token, jwt_config.get("secretKey"), function (err, decode) {
				if (err) { return done("验证错误"); }
				return done(null, decode);
			});
		}
 	));

	// 初始化passport模块
	app.use(passport.initialize());

	if(callback) callback();
};


module.exports.login = function(req,res,next)
{

	passport.authenticate('local', function(err, user, info) {
		
		if(err) return res.sendResult(null,400,err);
		if(!user) return res.sendResult(null,400,"参数错误");

		// 获取角色信息
		const token = jwt.sign({"uid":user.id,"rid":user.rid}, jwt_config.get("secretKey"), {"expiresIn": jwt_config.get("expiresIn")});
		user.token = "Bearer " + token;
		return res.sendResult(user,200,'登录成功');
	})(req, res, next);
	
}

module.exports.tokenAuth = function(req,res,next)
{
	passport.authenticate('bearer', { session: false },function(err,tokenData)
	{
		if(err) return res.sendResult(null,400,'无效token');
		if(!tokenData) return res.sendResult(null,400,'无效token');
		req.userInfo = {};
		req.userInfo.uid = tokenData["uid"];
		req.userInfo.rid = tokenData["rid"];
		next();
	})(req, res, next);
}
