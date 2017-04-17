/**
 * Created by lei on 2017/3/5.
 */
const Router = require('koa-router');
const dataManager = require('../../managers/data');
const md5 = require('../../utils/md5');

const router = new Router({
  prefix: '/ajax',
});

router.get('/more', async (ctx) => {
  const type = ctx.query.type;
  if (!type) {
    ctx.throw(500);
  }
  const key = ctx.cookies.get(`${type}-key`, { sign: true });
  const medias = dataManager.random(type, 20, key);
  let tpl = '';
  let tplData = {};
  if (type === dataManager.TYPE_GIF) {
    tpl = 'partials/gifs.html';
    tplData = { images: medias, header: false };
  }
  if (type === dataManager.TYPE_GIRL) {
    tpl = 'partials/girls.html';
    tplData = { images: medias, header: false };
  }
  if (type === dataManager.TYPE_VIDEO) {
    tpl = 'partials/videos.html';
    tplData = { videos: medias, header: false };
  }
  tplData.noBrand = true;
  ctx.renderFile(tpl, tplData, (err, str) => {
    if (err) {
      ctx.throw(500);
    }
    ctx.cookies.set(`${type}-key`, dataManager.getMediaKey(type, medias[medias.length - 1]), { sign: true });
    ctx.body = str;
  });
});

module.exports = router;
