// 导入 request 模块
const request = require('request')

// 自动匹配运单号所属的物流公司
function autoComNumber(orderno)
{
  const url = `https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=${orderno}`
  return new Promise(function(resolve, reject)
  {
    request(url,(err, response, body) => {
      if (err) return reject({ status: 500, msg: err.message })
      // resolve(body)
      // console.log(body.num)
      body = JSON.parse(body)
      if (body.auto.length <= 0) return reject({ status: 501, msg: '无对应的物流公司' })
      resolve({ status: 200, msg: body.auto[0], comCode: body.auto[0].comCode })
    })
  })
}

async function getLogisticsInfo(req, res) {
  // const result = await autoComNumber(req.params.orderno)
  // console.log('result',result)
  // if (result.status !== 200) {
  //   return {
  //     meta: {
  //       status: 500,
  //       message: '获取物流信息失败！'
  //     }
  //   }
  // }

  // const dataUrl = `https://www.kuaidi100.com/query?type=${result.comCode}&postid=${req.params.orderno}&temp=0.2595247267684455`
  // request(dataUrl, (err, response, body) => {
  //   if (err) {
  //     return res.send({
  //       meta: {
  //         status: 501,
  //         message: '获取物流信息失败！'
  //       }
  //     })
  //   }
    // 获取物流信息成功
    let data = [{"time":"2020-11-15 12:39:56","ftime":"2020-11-15 12:39:56","context":"已签收,签收人是 汤小洋 先生/女士，如有疑问请联系派件员阿奇(13805148888)，如您未收到此快递，请拨打投诉电话：15294207777，感谢使用申通快递，期待再次为您服务","location":null},{"time":"2020-11-15 08:46:54","ftime":"2020-11-15 08:46:54","context":"上海浦东寒亭营业厅-寒亭阿奇(13805148888)-派件中","location":null},{"time":"2020-11-15 08:38:57","ftime":"2020-11-15 08:38:57","context":"已到达-上海浦东寒亭营业厅","location":null},{"time":"2020-11-15 06:38:13","ftime":"2020-11-15 06:38:13","context":"已到达-上海浦东寒亭营业厅","location":null},{"time":"2020-11-14 20:56:45","ftime":"2020-11-14 20:56:45","context":"上海浦东转运中心-已发往-上海浦东寒亭公司","location":null},{"time":"2020-11-14 20:52:44","ftime":"2020-11-14 20:52:44","context":"已到达-上海浦东转运中心","location":null},{"time":"2020-11-14 17:43:48","ftime":"2020-11-14 17:43:48","context":"已到达-上海浦东转运中心","location":null},{"time":"2020-11-14 10:53:46","ftime":"2020-11-14 10:53:46","context":"上海浦东转运中心-已发往-上海浦东转运中心","location":null},{"time":"2020-11-14 10:43:31","ftime":"2020-11-14 10:43:31","context":"已到达-上海浦东转运中心","location":null},{"time":"2020-11-14 02:43:20","ftime":"2020-11-14 02:43:20","context":"江苏苏州转运中心-已发往-上海浦东转运中心","location":null},{"time":"2020-11-14 02:41:40","ftime":"2020-11-14 02:41:40","context":"已到达-江苏苏州转运中心","location":null},{"time":"2020-11-13 16:28:13","ftime":"2020-11-13 16:28:13","context":"江苏南京转运中心-已发往-江苏苏州转运中心","location":null},{"time":"2020-11-13 15:03:30","ftime":"2020-11-13 15:03:30","context":"南京IT教育公司-已发往-江苏南京转运中心","location":null},{"time":"2020-11-13 14:47:56","ftime":"2020-11-13 14:47:56","context":"南京IT教育公司-已发往-江苏南京转运中心","location":null},{"time":"2020-11-13 14:37:06","ftime":"2020-11-13 14:37:06","context":"南京IT教育公司-城东汪小主宠物店-已收件","location":null}]

    return res.send({
      meta: {
        status: 200,
        message: '获取物流信息成功！'
      },
      data
    })
  // })
}

module.exports = {
  getLogisticsInfo
}
