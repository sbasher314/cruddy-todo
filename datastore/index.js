const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (error) => {
        if (error) {
          callback(error);
        } else {
          items[id] = text;
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    var readPromise = Promise.promisify(exports.readOne);
    var Promises = _.map(files, file => {
      return readPromise(file.slice(0, -4));
    });
    Promise.all(Promises)
      .then((fileArray) => callback(err, fileArray));
  });
};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, id + '.txt'), 'utf8', (error, data) => {
    var text = data;
    if (!text || error !== null) {
      callback(error);
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  exports.readOne(id, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (error) => {
        if (error) {
          callback(error);
        } else {
          items[id] = text;
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(path.join(exports.dataDir, id + '.txt'), err => {
    if (err === null) {
      delete items[id];
    }
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
