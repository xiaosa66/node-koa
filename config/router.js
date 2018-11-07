'use strict'

const Router = require('koa-router')
const User = require('../app/controllers/user')
const App = require('../app/controllers/app')

module.exports = function(){
	var router = new Router({
    prefix: '/api'
  })

  // user
  router.post('/u/signup', App.hasBody, User.signup)
  router.post('/u/update', App.hasBody, App.hasToken, User.update)

  // DB Interface test
  router.get('/hp/idlist/0',User.getIndex)
  router.get('/movie/list/0',User.getIndex)
  router.post('/movie/list/add',User.addIndex)
  router.post('/test/user/add',User.addUser)
  router.post('/test/user/delete',User.deleteUser)
  router.post('/test/user/findsb',User.findSb)

  return router
}