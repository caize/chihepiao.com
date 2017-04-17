/**
 * Created by lei on 2017/3/26.
 */
const Router = require('koa-router');

const router = new Router();

router.get('/about.html', async (ctx, next) => {
  await ctx.render('about', {
    title: '关于我们',
    menu: 'about',
  });
  await next();
});

module.exports = router;
