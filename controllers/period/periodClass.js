const { isArray, isObject } = require("../types/create");
const days = ["mon", "tue", "wed", "thurs", "fri", "sat", "sun"];

exports.termAloc = (index, distArray, newObj) => {
  console.log("AllocTerm");
  try {
    const n = index + 1;
    /*index is index of newObj in flatten, 
      distArray is pre flattened length */
    let term;
    for (let i = 0; i < distArray.length; i++) {
      const elem = distArray[i];
      if (n <= elem) {
        term = i + 1;
        break;
      }
    }
    if (term) {
      newObj["term"] = term;
    } else {
      console.log("Term not found");
      throw "Term not found";
    }
    console.log("inner", newObj);
  } catch (err) {
    console.log("here1");
    throw err;
  }
};
exports.periodAloc = (obj, newObj) => {
  try {
    newObj["className"] = obj.className;
    newObj["arm"] = obj.arm;
    console.log("allocating period");
  } catch (err) {
    console.log("here2", err);
    throw err;
  }
};

exports.termExtract = (array) => {
  try {
    console.log("extracting");
    if (isArray(array)) {
      let error = false;
      let newArr = [];
      let value = 0;
      for (let a = 0; a < array.length; a++) {
        const elem = array[a];
        if (isArray(elem)) {
          newArr.push(elem.length + value);
          value = newArr[a];
        } else {
          error = true;
          break;
        }
      }
      if (error) {
        console.log("Please provide a 2D array for Term Extraction");
        throw "Please provide a 2D array for Term Extraction";
      }
      return newArr;
    } else {
      console.log("Please provide an array");
      throw "Please provide an array";
    }
  } catch (err) {
    console.log("here3", err);
    throw err;
  }
};
exports.periodObj = (periodObj, term) => {
  try {
    console.log("Creating Period Objects");
    periodObj.period.forEach((elem, n) => {
      periodObj.period[n] = elem.sort((a, b) => {
        console.log(days.indexOf(a.day), days.indexOf(b.day));
        if (days.indexOf(a.day) > days.indexOf(b.day)) {
          return 1;
        } else if (days.indexOf(a.day) < days.indexOf(b.day)) {
          return -1;
        } else {
          if (a.start > b.start) {
            return 1;
          } else if (a.start < b.start) {
            return -1;
          } else {
            console.log("Timing Error caught");
            throw "Timing Error caught";
          }
        }
      });
    });
    const array = periodObj.period.flat();
    const distArray = this.termExtract(periodObj.period);
    if (term >= distArray.length) {
      let newArray = [];
      let error = false;
      //array has to be sorted based on day and start, preserving term
      for (let a = 0; a < array.length; a++) {
        const elem = array[a];
        this.periodAloc(periodObj, elem);
        this.termAloc(a, distArray, elem);
        if (
          elem.start != (array[a - 1] ? array[a - 1].stop : undefined) &&
          elem.term == (array[a - 1] ? array[a - 1].term : undefined) &&
          elem.day == (array[a - 1] ? array[a - 1].day : undefined)
        ) {
          error = true;
          break;
        }
        newArray.push(elem);
      }
      if (error) {
        console.log("Time inconsistencies in Term");
        throw "Time inconsistencies in Term";
      }
      return newArray;
    } else {
      console.log("Term inconsistencies");
      throw "Term inconsistencies";
    }
  } catch (err) {
    console.log("here4", err);
    throw err;
  }
};
exports.periodConstruct = (arr, term) => {
  console.log("Constructing Period");
  try {
    if (isArray(arr)) {
      let error = false;
      let newArr = [];
      for (let a = 0; a < arr.length; a++) {
        const elem = arr[a];
        if (isObject) {
          newArr.push(this.periodObj(elem, term));
        } else {
          error = true;
          break;
        }
      }

      if (error) {
        console.log("Inner Sections should be Objects");
        throw "Inner Sections should be Objects";
      } else {
        return newArr.flat();
      }
    } else {
      console.log("An array is need for period construction");
      throw "An array is need for period construction";
    }
  } catch (err) {
    console.log("here5", err);
    throw err;
  }
};
