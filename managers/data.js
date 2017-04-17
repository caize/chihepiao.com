/**
 * Created by lei on 2017/3/5.
 */

const md5 = require('../utils/md5');

const gifData = require('../data/gif.json');
const girlData = require('../data/girl.json');
const videoData = require('../data/videos.json');

const gifKeyIndexMap = {};
const girlKeyIndexMap = {};
const videoKeyIndexMap = {};

const TYPE_GIF = 'gif';
const TYPE_GIRL = 'girl';
const TYPE_VIDEO = 'video';

module.exports.TYPE_GIF = TYPE_GIF;
module.exports.TYPE_GIRL = TYPE_GIRL;
module.exports.TYPE_VIDEO = TYPE_VIDEO;

module.exports.formatData = () => {
  for (let i = 0; i < gifData.length; i += 1) {
    gifKeyIndexMap[md5(gifData[i].url)] = i;
  }
  for (let i = 0; i < girlData.length; i++) {
    girlKeyIndexMap[md5(girlData[i])] = i;
  }
  for (let i = 0; i < videoData.length; i++) {
    videoKeyIndexMap[md5(videoData[i].video)] = i;
  }
};

module.exports.getData = (type) => {
  const dataMap = {
    [TYPE_GIF]: [gifKeyIndexMap, gifData],
    [TYPE_GIRL]: [girlKeyIndexMap, girlData],
    [TYPE_VIDEO]: [videoKeyIndexMap, videoData],
  };
  return dataMap[type];
};

module.exports.getUrlPrefix = (type) => {
  const dataMap = {
    [TYPE_GIF]: '/d',
    [TYPE_GIRL]: '/g',
    [TYPE_VIDEO]: '/v',
  };
  return dataMap[type];
};

module.exports.getMedia = (type, key) => {
  const [indexMap, data] = module.exports.getData(type);
  const index = indexMap[key];
  if (index !== 0 && !index) return null;
  let media = data[index];
  if (typeof media === 'string') {
    media = { url: media };
  }
  media.nextPageUrl = this.getNextPageUrl(type, media);
  media.pageUrl = `${module.exports.getUrlPrefix(type)}/${key}.html`;
  return media;
};

module.exports.getMediaKey = (type, media) => {
  let body = '';
  if (type === TYPE_GIF || type === TYPE_GIRL) {
    body = media.url;
  }
  if (type === TYPE_VIDEO) {
    body = media.video;
  }
  return md5(body);
};

module.exports.getGif = key => module.exports.getMedia(TYPE_GIF, key);

module.exports.getGirl = key => module.exports.getMedia(TYPE_GIRL, key);

module.exports.getNextPageUrl = (type, media) => {
  const key = module.exports.getMediaKey(type, media);
  const nextMedia = module.exports.random(type, 1, key, true);
  const nextKey = module.exports.getMediaKey(type, nextMedia);
  return `${module.exports.getUrlPrefix(type)}/${nextKey}.html`;
};

module.exports.random = (type, count, startKey, withOutNext) => {
  const [indexMap, data] = module.exports.getData(type);
  const ret = [];
  const total = data.length;
  const range = total > 50 ? 50 : total;
  const randomRange = startKey ? range : total;
  const randomNumbers = module.exports.randomNumber(randomRange, count);
  const startIndex = startKey ? indexMap[startKey] : 0;
  if (!randomNumbers) return ret;
  randomNumbers.forEach((n) => {
    const item = data[(startIndex + n) % total];
    const media = typeof item === 'string' ? { url: item } : item;
    const mediaKey = module.exports.getMediaKey(type, media);
    media.pageUrl = `${module.exports.getUrlPrefix(type)}/${mediaKey}.html`;
    if (!withOutNext) {
      media.nextPageUrl = module.exports.getNextPageUrl(type, media);
    }
    ret.push(media);
  });
  return count === 1 ? ret[0] : ret;
};

module.exports.randomNumber = (range, count) => {
  if (count <= 0) {
    return null;
  }
  if (count === 1) {
    return [Math.floor(Math.random() * range)];
  }
  let ret = [];
  if (count > range) {
    ret = [...new Array(range).keys()];
  }
  while (ret.length < count) {
    const r = Math.floor(Math.random() * range);
    if (ret.indexOf(r) === -1 || ret.length >= range) {
      ret.push(r);
    }
  }
  return ret;
};
