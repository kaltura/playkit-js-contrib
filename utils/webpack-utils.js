function createExternals() {
  return [function(context, request, callback) {
    if (request.indexOf('@playkit-js') === 0) {
      callback(null, 'umd ' + request);
      return;
    }

    if (request.indexOf('preact') === 0) {
      callback(null, 'root KalturaPlayer.ui.preact');
      return;
    }

    callback();
  }];
}

module.exports = {
  createExternals
}
