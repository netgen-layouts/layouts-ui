var cache_on = false;

module.exports = {
  url: 'http://localhost:3000/bm/dev/app/',
  waitForConditionTimeout: (cache_on ? 2 : 60) * 1000
};
