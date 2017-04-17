/**
 * Created by lei on 2017/3/3.
 */
const Koa = require('koa');
const render = require('koa-ejs');
const path = require('path');
const dataManager = require('./managers/data');

const assets = require('./webpack-assets.json');
const homeRouter = require('./controllers/home');
const aboutRouter = require('./controllers/about');
const ajaxRouter = require('./controllers/ajax');

dataManager.formatData();

const application = new Koa();

application.keys = ['rocks in chihepiao.com'];

const ejsOptions = {
  root: path.join(__dirname, 'views'),
  viewExt: 'html',
  cache: true,
  debug: false,
};

render(application, ejsOptions);

const oriRender = application.context.render;

application.context.render = async function renderNg(view, data) {
  const contextData = Object.assign({ menu: 'home' }, data, { assets });
  await oriRender.call(this, view, contextData);
};

application.context.renderFile = function readerFile(view, context, callback) {
  const fileName = path.join(ejsOptions.root, view);
  return render.ejs.renderFile(fileName, context, ejsOptions, callback);
};

application.use(homeRouter.routes());
application.use(aboutRouter.routes());
application.use(ajaxRouter.routes());

application.listen(7878);
