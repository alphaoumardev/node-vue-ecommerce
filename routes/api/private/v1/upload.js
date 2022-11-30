const express = require('express');
const router = express.Router();
const path = require("path");

const fs = require('fs');
const os = require('os');

const multer  = require('multer');
// 临时上传目录
const upload = multer({ dest: 'tmp_uploads/' });

const upload_config = require('config').get("upload_config");

// 提供文件上传服务
router.post("/",upload.single('file'),function(req,res,next) {
	const fileExtArray = req.file.originalname.split(".");
	const ext = fileExtArray[fileExtArray.length - 1];
	const targetPath = req.file.path + "." + ext;
	fs.rename(path.join(process.cwd(),"/" + req.file.path),path.join(process.cwd(),targetPath),function(err){
		if(err) {
			return res.sendResult(null,400,"上传文件失败");
		}
		res.sendResult({"tmp_path":targetPath,"url":upload_config.get("baseURL") + "/" + targetPath},200,"上传成功");
	})
});

module.exports = router;