const Type = require("../models/Types").Type;
const TypeClassName = require("../models/Types").TypeClassName;
const TypeSession = require("../models/Types").TypeSession;

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

exports.isClass = (title) => {
  TypeClassName.findOne({ title: value })
    .then((className) => {
      if (className) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      throw err;
    });
};

exports.isSession = (title, term = false) => {
  TypeSession.findOne({ title })
    .then((sess) => {
      if (sess) {
        if (term && (term > sess.term || term < 0)) {
          return false;
        }
        return true;
      } else {
        throw false;
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
exports.isTerm = (title, term) => {
  this.isSession(title, term);
};

// exports.isEqual = (item1, item2) => {
//   try {
//     assert.deepStrictEqual(item1, item2);
//     return true;
//   } catch (err) {
//     return false;
//   }
// };
exports.isEqual = (item1, item2) => {
  let result = true;
  for (let a of item2) {
    if (!item1.has(a)) {
      result = false;
      break;
    }
  }
  return result;
};
exports.keyCheck = (object, arr) => {
  const { isArray, isObject } = require("../controllers/types/create");
  if (isObject(object) && isArray(arr)) {
    const set1 = new Set(Object.keys(object));
    const concatArr = Object.keys(object).concat(arr);
    const set2 = new Set(concatArr);
    return this.isEqual(set1, set2);
  } else {
    return false;
  }
};
