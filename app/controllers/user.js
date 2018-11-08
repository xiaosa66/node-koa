'use strict'

var xss = require('xss')
var mongoose =  require('mongoose')
var User = mongoose.model('User')
var Index = mongoose.model('Index')
var IndexChildSchema = mongoose.model('IndexChildSchema')

var uuid = require('uuid')
// var userHelper = require('../dbhelper/userHelper')
import userHelper from '../dbhelper/userHelper'

/**
 * 注册新用户
 * @param {Function} next          [description]
 * @yield {[type]}   [description]
 */
exports.signup = async (ctx, next) => {
	var phoneNumber = xss(ctx.request.body.phoneNumber)
	// var phoneNumber = xss(ctx.request.body.phoneNumber.trim())
	var user = await User.findOne({
	  phoneNumber: phoneNumber
	}).exec()
  console.log(user)
	
	var verifyCode = Math.floor(Math.random()*10000+1)
  console.log(phoneNumber)
	if (!user) {
	  var accessToken = uuid.v4()

	  user = new User({
	    nickname: '测试用户',
	    avatar: 'http://upload-images.jianshu.io/upload_images/5307186-eda1b28e54a4d48e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
	    phoneNumber: xss(phoneNumber),
	    verifyCode: verifyCode,
	    accessToken: accessToken
	  })
	}
	else {
	  user.verifyCode = verifyCode
	}

	try {
    user = await user.save()
    ctx.body = {
      success: true
    }
  }
  catch (e) {
    ctx.body = {
      success: false
    }

    return next
  }

}
exports.findSb = async (ctx, next) => {
  var phoneNumber = xss(ctx.request.body.phoneNumber)
	// var phoneNumber = xss(ctx.request.body.phoneNumber.trim())
	var user = await User.findOne({
	  phoneNumber: phoneNumber
	}).exec()
  console.log(user)
	try {
    ctx.body = {
      success: true,
      user
    }
  }
  catch (e) {
    ctx.body = {
      success: false
    }
  }

}




/**
 * 更新用户信息操作
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.update = async (ctx, next) => {
  var body = ctx.request.body
  var user = ctx.session.user
  var fields = 'avatar,gender,age,nickname,breed'.split(',')

  fields.forEach(function(field) {
    if (body[field]) {
      user[field] = xss(body[field])
      // user[field] = xss(body[field].trim())
    }
  })

  user = await user.save()

  ctx.body = {
    success: true,
    data: {
      nickname: user.nickname,
      accessToken: user.accessToken,
      avatar: user.avatar,
      age: user.age,
      breed: user.breed,
      gender: user.gender,
      _id: user._id
    }
  }
}



/**
 * 数据库接口测试
 * @param  {[type]}   ctx  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.users = async (ctx, next) => {
  var data = await userHelper.findAllUsers()

  ctx.body = {
    success: true,
    data
  }
}
exports.getIndex = async (ctx, next) => {
  var data = await userHelper.returnIndexData()

  ctx.body = {
    success: true,
    data
  }
}


exports.addUser = async (ctx, next) => {
  var user = new User({
      nickname: '测试用户',
      avatar: 'http://ip.example.com/u/xxx.png',
      phoneNumber: xss('13800138000'),
      verifyCode: '5896',
      accessToken: uuid.v4()
    })
  var user2 =  await userHelper.addUser(user)
  if(user2){
    ctx.body = {
      success: true,
      data : user2
    }
  }
}
exports.addIndex = async (ctx, next) => {
  console.log('ctx.request.body:',ctx.request.body);
  let body = ctx.request.body;
    let vols = new IndexChildSchema({
        hp_title:body.hp_title,
        hp_author:body.hp_author,
        hp_content:body.hp_content,
        hp_makettime:body.hp_makettime,
    })

  var dataSAve =  await userHelper.addUser(vols)
  if(dataSAve){
    ctx.body = {
      success: true,
      data : dataSAve
    }
  }
}
exports.deleteUser = async (ctx, next) => {
  const phoneNumber = xss(ctx.request.body.phoneNumber)
  // const phoneNumber = xss(ctx.request.body.phoneNumber.trim())
  console.log(phoneNumber)
  var data  = await userHelper.deleteUser({phoneNumber})
  ctx.body = {
    success: true,
    data
  }
}