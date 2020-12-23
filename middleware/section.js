const Type = require("../models/Types");

exports.isClass = (value) => {
  Type.findOne({ "class.name": value })
    .then((result) => {
      if (result) {
        return true;
      } else {
        throw "Class is invalid";
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.isSession = (value) => {
  Type.findOne({ "session.title": value })
    .then((result) => {
      if (result) {
        return true;
      } else {
        throw "Session is invalid";
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.isFee = (value) => {
  Type.findOne({ fees: value })
    .then((result) => {
      if (result) {
        return true;
      } else {
        throw "Fee is invalid";
      }
    })
    .catch((err) => {
      throw err;
    });
};
exports.isTerm = (session, term) => {
  Type.findOne({ "session.title": session, "session.title": { $lte: term } })
    .then((result) => {
      if (result) {
        return true;
      } else {
        throw "Session is invalid";
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.isEqual = (item1, item2) => {
  try {
    assert.deepStrictEqual(item1, item2);
    return true;
  } catch (err) {
    return false;
  }
};
exports.keyCheck = (object, arr) => {
  const keyChecker = new ResultMaker();
  if (keyChecker.isObject(object) && keyChecker.isArray(arr)) {
    const set1 = new Set(Object.keys(object));
    const set2 = new Set(Object.keys(object).concat(arr));
    return isEqual(set1, set2);
  } else {
    return false;
  }
};
