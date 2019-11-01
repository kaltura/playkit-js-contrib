function createExternals() {
  return [function(context, request, callback) {
    if (request.indexOf('@playkit-js') === 0 || request.indexOf('preact') === 0) {
      return callback(null, 'umd ' + request);
    }

    callback();
  }];
}

module.exports = {
  createExternals
}
