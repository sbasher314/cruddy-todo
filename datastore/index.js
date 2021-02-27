const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    return fs.writeFileAsync(path.join(exports.dataDir, id + '.txt'), text)
      .then(() => callback(null, { id, text }))
      .catch(callback);
  });
};

exports.readAll = (callback) => {
  return fs.readdirAsync(exports.dataDir)
    .then((files) => {
      var Promises = _.map(files, file => {
        return exports.readOne(file.slice(0, -4), (err, text) => text);
      });
      return Promise.all(Promises);
    })
    .then((fileArray) => callback(null, fileArray))
    .catch(callback);
};

exports.readOne = (id, callback) => {
  return fs.readFileAsync(path.join(exports.dataDir, id + '.txt'), 'utf8')
    .then(text => callback(null, { id, text }))
    .catch(callback);
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err) => {
    if (!err) {
      return fs.writeFileAsync(path.join(exports.dataDir, id + '.txt'), text);
    }
  })
    .then(() => callback(null, {id, text}))
    .catch(callback);
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), err => {
    callback(err);
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
