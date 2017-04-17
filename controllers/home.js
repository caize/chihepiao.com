/**
 * Created by lei on 2017/3/5.
 */
const Router = require('koa-router');
const dataManager = require('../managers/data');
const md5 = require('../utils/md5');

const router = new Router();

/**
 * 首页
 */
router.get('/', async (ctx, next) => {
  const girlImages = dataManager.random(dataManager.TYPE_GIRL, 27);
  const gifImages = dataManager.random(dataManager.TYPE_GIF, 27);
  const videos = dataManager.random(dataManager.TYPE_VIDEO, 27);
  ctx.cookies.set('video-key', md5(videos[videos.length - 1].video), { sign: true });
  ctx.cookies.set('gif-key', md5(gifImages[gifImages.length - 1].url), { sign: true });
  ctx.cookies.set('girl-key', md5(girlImages[girlImages.length - 1].url), { sign: true });
  await ctx.render('index', {
    gifImages,
    girlImages,
    videos,
    noBrand: false,
    title: '吃喝飘',
  });
  await next();
});

/**
 * 详情页
 */
router.get('/:type/:key.html', async (ctx, next) => {
  const key = ctx.params.key;
  const type = ctx.params.type;
  let gifImages = dataManager.random(dataManager.TYPE_GIF, 20);
  let girlImages = dataManager.random(dataManager.TYPE_GIRL, 20);
  let videos = dataManager.random(dataManager.TYPE_VIDEO, 10);
  let media = null;
  let title = '';
  let sideVideos = null;
  let menu;
  if (type === 'g') {
    girlImages = dataManager.random(dataManager.TYPE_GIRL, 20, key);
    media = dataManager.getMedia(dataManager.TYPE_GIRL, key);
    title = '看妹子';
    menu = 'girl';
  }
  if (type === 'v') {
    videos = dataManager.random(dataManager.TYPE_VIDEO, 10, key);
    sideVideos = dataManager.random(dataManager.TYPE_VIDEO, 4, key);
    media = dataManager.getMedia(dataManager.TYPE_VIDEO, key);
    title = media.title;
    menu = 'video';
  }
  if (!type || type === 'd') {
    gifImages = dataManager.random(dataManager.TYPE_GIF, 20, key);
    media = dataManager.getMedia(dataManager.TYPE_GIF, key);
    title = media.text;
    menu = 'gif';
  }
  ctx.cookies.set('gif-key', md5(gifImages[gifImages.length - 1].url), { sign: true });
  ctx.cookies.set('girl-key', md5(girlImages[girlImages.length - 1].url), { sign: true });
  ctx.cookies.set('video-key', md5(videos[videos.length - 1].video), { sign: true });
  await ctx.render('detail', {
    girlImages,
    gifImages,
    sideVideos,
    videos,
    type,
    media,
    title,
    menu,
  });
  await next();
});

/**
 * 动图页
 */
router.get('/d.html', async (ctx, next) => {
  const key = ctx.cookies.get('gif-key', { sign: true });
  const gifImages = dataManager.random(dataManager.TYPE_GIF, 37, key);
  ctx.cookies.set('gif-key', md5(gifImages[gifImages.length - 1].url), { sign: true });
  await ctx.render('list', {
    gifImages,
    noBrand: false,
    title: '搞笑GIF动图',
    menu: 'gif',
    type: dataManager.TYPE_GIF,
  });
  await next();
});

/**
 * 妹子页
 */
router.get('/g.html', async (ctx, next) => {
  const key = ctx.cookies.get('girl-key', { sign: true });
  const girlImages = dataManager.random(dataManager.TYPE_GIRL, 37, key);
  ctx.cookies.set('girl-key', md5(girlImages[girlImages.length - 1].url), { sign: true });
  await ctx.render('list', {
    girlImages,
    noBrand: false,
    title: '极品妹子',
    menu: 'girl',
    type: dataManager.TYPE_GIRL,
  });
  await next();
});

/**
 * 妹子页
 */
router.get('/v.html', async (ctx, next) => {
  const key = ctx.cookies.get('video-key', { sign: true });
  const videos = dataManager.random(dataManager.TYPE_VIDEO, 37, key);
  ctx.cookies.set('video-key', md5(videos[videos.length - 1].video), { sign: true });
  await ctx.render('list', {
    videos,
    noBrand: false,
    title: '搞笑视频',
    menu: 'video',
    type: dataManager.TYPE_VIDEO,
  });
  await next();
});

module.exports = router;
