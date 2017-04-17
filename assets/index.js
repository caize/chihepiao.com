/**
 * Created by lei on 2017/3/4.
 */
require('normalize.css');
require('./index.less');
require('jquery-lazy');

const loading = {
  gif: false,
  girl: false,
  video: false,
};

function resetVideoSize() {
  const $videoWrapper = $('.video-player-wrapper');
  const winWidth = $(window).width();
  if ($videoWrapper.length > 0 && winWidth < 1120) {
    $videoWrapper.height(($(window).width() / 16) * 9);
  }
}

function loadGIF() {
  const $gifThumb = $('.gif-thumb');
  if ($gifThumb.length === 0) return;
  const ori = $gifThumb.data('src');
  $gifThumb.attr('src', ori);
  $gifThumb[0].onload = () => {
    const src = $gifThumb.attr('src');
    if (!/thumb/.test(src)) {
      $('.loading').hide();
    }
  };
}

$(() => {
  resetVideoSize();
  $('.lazy').lazy({
    effect: 'fadeIn',
  });
  $(window).on('resize', () => {
    resetVideoSize();
  });
  $(document)
    .on('click', '.toggle-menu', () => {
      $('#site-nav').toggleClass('close');
    })
    .on('click', '.load-more', (e) => {
      const $target = $(e.currentTarget);
      const type = $target.data('type');
      if (loading[type]) return;
      loading[type] = true;
      $.ajax({
        url: '/ajax/more',
        data: {
          type,
        },
        success: (res) => {
          const $res = $(res);
          $res.find('.lazy').lazy({ effect: 'fadeIn' });
          $(`#${type}s-wrapper`).append($res);
        },
        complete: () => {
          loading[type] = false;
        },
      });
    });
  loadGIF();
});
