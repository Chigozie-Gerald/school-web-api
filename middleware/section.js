const Type = require("../models/Types");

//For session and class
exports.objCheck = (value, arr, session = false, term) => {
  if (arr.length > 0) {
    let sesId = false;
    arr.filter((a) => {
      if (a.title === value) {
        sesId = a._id;
        if (session && term) {
          if (term > a.term || term < 0) {
            sesId = false;
          }
        }

        return a.title === value;
      }
    });
    return sesId;
  } else {
    return false;
  }
};
//For currency and Fee
exports.check = (value, arr) => {
  if ((arr, length > 0)) {
    let checked = false;
    arr.filter((a) => {
      if (a === value) {
        checked = a._id;
        return a === value;
      }
    });
    return checked;
  } else {
    return false;
  }
};

exports.isClass = (value) => {
  Type.findOne()
    .then((result) => {
      if (result) {
        return this.objCheck(value, result.className);
      } else {
        throw "Create a 'Type' before executing this action";
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.isSession = (value) => {
  Type.findOne()
    .then((result) => {
      if (result) {
        return this.objCheck(value, result.session, true);
      } else {
        throw "Create a 'Type' before executing this action";
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.isFee = (value) => {
  Type.findOne()
    .then((result) => {
      if (result) {
        return this.check(value, result.fee);
      } else {
        throw "Create a 'Type' before executing this action";
      }
    })
    .catch((err) => {
      throw err;
    });
};
exports.isTerm = (session, term) => {
  Type.findOne()
    .then((result) => {
      if (result) {
        return this.objCheck(session, result.session, true, term);
      } else {
        throw "Create a 'Type' before executing this action";
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
