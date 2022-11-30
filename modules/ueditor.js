const _ = require('lodash');
const path = require("path");
const Busboy = require('busboy');
const fs = require("fs");
const uniqid = require('uniqid');
const ueditor_config = require(path.join(process.cwd(),"/config/ueditor.config.js"));
const upload_config = require('config').get("upload_config");

const filetype = 'jpg,png,gif,ico,bmp';
module.exports = function(req,res,next)
{

	if(req.query.action === "config")
	{
		// 吐给客户端配置信息 
		res.jsonp(ueditor_config);
	} else if (req.query.action === 'uploadimage' || req.query.action === 'uploadfile' || req.query.action === 'uploadvideo') {
		const busboy = new Busboy({ headers: req.headers });
		busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
			const fileExtArray = filename.split(".");
			const ext = fileExtArray[fileExtArray.length - 1];
			const save_filename = uniqid() + "." + ext;
			const savePath = path.join(process.cwd(),upload_config.get("upload_ueditor"),save_filename);
			file.on('end', function ()
			{
				const result = {
				'url': upload_config.get("baseURL")+"/" + upload_config.get("upload_ueditor") + "/" + save_filename,
				'title': req.body && req.body.pictitle || filename,
				'original': filename,
				'state': 'SUCCESS'
				};
				if(req.query.encode)
				{
					res.jsonp(result);
				} else {

					res.redirect(upload_config.get("simple_upload_redirect") + "?result=" + JSON.stringify(result));
					// res.redirect(result.url);
				}
				
			});

			file.pipe(fs.createWriteStream(savePath));
		});
		req.pipe(busboy);
	} else if(req.query.action === 'listimage')
	{
		fs.readdir(path.join(process.cwd(),upload_config.get("upload_ueditor")),function(err, files){
			if(err) return res.end();
			let total = files.length;

			const filelist = [];
			// const total = 0;
			_(files).forEach(function(file)
			{
				const fileExtArray = file.split(".");
				const ext = fileExtArray[fileExtArray.length - 1];
				if (filetype.indexOf(ext.toLowerCase()) >= 0) {
					const result_file = {};
					result_file.url = upload_config.get("baseURL")+"/" + upload_config.get("upload_ueditor") + "/" + file;
					filelist.push(result_file);
					total ++;
				}
			});
			res.jsonp({
				"state": "SUCCESS",
				"list": filelist,
				"start": 1,
				"total": total
              });
		})
	}
}