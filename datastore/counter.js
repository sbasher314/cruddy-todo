const path = require('path');
const sprintf = require('sprintf-js').sprintf;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  fs.readFileAsync(exports.counterFile, 'utf8')
    .then(fileData => callback(null, Number(fileData)))
    .catch(callback);
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  return fs.writeFileAsync(exports.counterFile, counterString)
    .then(() => callback(null, counterString))
    .catch(callback);
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {
  var readAsync = new Promise(function(resolve, reject) {
    readCounter((err, id) => {
      resolve(id + 1);
    });
  });
  readAsync
    .then(id => writeCounter(id, () => callback(null, id)))
    .catch(err => callback(err));
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
