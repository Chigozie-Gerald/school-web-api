class ResultMaker {
  constructor(terms, className, session, subjects = []) {
    this.terms = [];
    this.head = [{ terms: 0, session: "", className: "", excluded: -3 }];
    this.subjects = [];
    this.result = false;
    this.format();
    if (arguments.length === 0) {
      return;
    } else {
      if (typeof terms !== "number") {
        throw "Invalid Term type in constructor";
      }
      if (typeof className !== "string") {
        throw "Invalid className type in constructor";
      }
      if (typeof session !== "string") {
        throw "Invalid session type in constructor";
      }
      if (!this.isArray(subjects)) {
        throw "Invalid subject type in constructor";
      }
      if (subjects.some((elem) => !this.isObject(elem))) {
        throw "Invalid subject items type in constructor";
      }

      this.head = [
        {
          terms,
          session: session,
          className,
          excluded: terms === 3 ? false : terms - 3,
        },
      ];
      this.terms = Array(this.head[0].terms).fill(0);
      if (subjects.length > 0) {
        subjects.forEach((elem) => this.addSubject(elem.term, elem));
      } else {
        this.subjects = Array(this.terms.reduce((a, b) => a + b)).fill("");
      }
      this.result = this.format();
      if (
        this.terms.reduce((a, b) => a + b) !== this.subjects.length ||
        !this.check()
      ) {
        this.result = false;
        throw "Subject size invalid";
      }
    }
  }
  /* isObject
        Checks if an item is an Object, excluding Arrays
        RETURNS Boolean
  */
  isObject = (item) =>
    Object.prototype.isPrototypeOf(item) &&
    !Array.prototype.isPrototypeOf(item);
  /* isArray
        Checks if an item is an Array
        RETURNS Boolean
  */
  isArray = (item) => Array.prototype.isPrototypeOf(item);
  /* Format
        Concats head, result and term
        Ensures this.head[0].excluded integrity isn't compromised
        Also checks if the length of the array is concordant with inner size variables
        RETURNS this.result
   */
  format = () => {
    this.head[0].excluded =
      this.head[0].terms === 3 ? false : this.head[0].terms - 3;
    this.result = this.head.concat(this.terms).concat(this.subjects);
    if (!this.check()) {
      throw "Result size inconsistent with inner variables";
    }
    return this.result;
  };
  /* Get Sub
        Takes in term and subject to provide index
        RETURNS Index (number) of the subject provided in the this.subject array if found or
                Index (false) if not found
   */
  getSub = (term, name) => {
    if (typeof term !== "number" || typeof name !== "string") {
      throw "Invalid term or subject name type in Get sub";
    }
    const slice = this.getTermSub(term);
    let index = false;
    slice[2].filter((elem, n) => {
      if (elem.name === name) {
        index = n + slice[0];
        return true;
      }
    });
    return index;
  };
  /* Get Term Sub
        Takes in term and get the slice of subject for the specific term
        RETURNS an array of
         START: Index of first subject term slice item in 'this.subjects' array
         STOP: Index of LAST subject term slice item + 1 in 'this.subjects' array ***
                 useful for 'slice' operations as the last value is excluded
         SLICE: Array of sliced subjects for that term, the length of this array is for splice operations
   */
  getTermSub = (term) => {
    if (typeof term !== "number") {
      throw "Invalid term type in get term items";
    }
    if (term <= this.terms.length && term > 0) {
      const Start = (this.terms.slice(0, term - 1).length > 0
        ? this.terms.slice(0, term - 1)
        : [0]
      ).reduce((a, b) => a + b);
      const Stop = (this.terms.slice(0, term).length > 0
        ? this.terms.slice(0, term)
        : [0]
      ).reduce((a, b) => a + b);
      return [Start, Stop, this.subjects.slice(Start, Stop)];
    } else {
      throw `Bad Term: ${term} is less than 0 or more than the length of the array --> [${this.terms}]`;
    }
  };
  /* Add Subject
        Adds a subject to a specific term if the sibject doesn't exist
        Updates if the subject initially exists
        The subject is also filtered to ensure integirity
        RETURNS this.result
   */
  addSubject = (term, sub) => {
    if (!this.isObject(sub)) {
      throw "Subject type is bad in add Subject";
    }
    sub["term"] = term;
    if (!this.formatSubject(sub)[0] || this.formatSubject(sub)[1].length > 0) {
      throw this.formatSubject(sub)[1];
    }
    const slice = this.getTermSub(term);
    const Start = slice[0];
    const Arr = slice[2];
    let index = false;
    Arr.filter((elem, n) => {
      if (elem.name === sub.name) {
        index = n;
        return true;
      }
    });
    if (typeof index === "number") {
      this.subjects.splice(Start + index, 1, sub);
    } else {
      this.subjects.splice(Start, 0, sub);
      this.terms[term - 1] += 1;
    }
    this.format();
    return this.result;
  };
  /* Delete Subject
        Deletes a subject from a given term if it exists
        Reduces the this.terms by the number of the terms deleted
        RETURNS this.result
   */
  deleteSubject = (term, name) => {
    if (typeof name !== "string") {
      throw "Subject name type is bad in delete Subject";
    }
    const slice = this.getTermSub(term);
    const Start = slice[0];
    const Arr = slice[2];
    const newArr = Arr.filter((elem) => elem.name !== name);
    if (newArr.length === Arr.length) {
      throw "Subject wasn't found and so, nothing was deleted";
    } else {
      this.subjects.splice(Start, Arr.length, ...newArr);
      this.terms[term - 1] = newArr.length;
    }
    this.format();
    return this.result;
  };
  /* Result Size
        Ensures that the length of the Session result provided ***
         is equal to the addition of the length of the head (item in first index),
         the length of the terms and the length of subjects
        RETURNS a Boolean
   */
  resultSize = (result) => {
    /*
    The below checks if the size of the array is relatable to the tree 
    (done in the first elem circle) 
    */
    let resultArg = false;

    if (this.isArray(result) && result.length > 0) {
      if (
        result[0].terms &&
        result.slice(1, result[0].terms + 1).reduce((a, b) => a + b) +
          result[0].terms +
          1 ===
          result.length
      ) {
        resultArg = true;
      } else {
        resultArg = false;
      }
    }
    return resultArg;
  };
  /* Result Format
        Ensures that each Result has the neccesary keys
        Also ensures that each value of any given key has the right datatype
        RETURNS an array of 'keepMap' and an array of errors 'errorMap'
   */
  resultFormatter = (result) => {
    /*
    Ensure sanitized result is passed (i.e an actual array with size greater than zero)
    */
    let keepMap = true;
    let errorArr = [];
    result.map((elem, n) => {
      if (keepMap) {
        if (n === 0 && !Object.prototype.isPrototypeOf(elem)) {
          keepMap = false;
          errorArr.push("Fatal: Incorrect header type");
        } else {
          if (n === 0) {
            /*
          The below ensures the integrity of the header object
          */
            if (
              !Object.keys(elem).includes("terms") ||
              !Object.keys(elem).includes("session") ||
              !Object.keys(elem).includes("className") ||
              (Object.keys(elem).includes("terms") &&
                Math.sign(elem.terms) !== 1) ||
              (Object.keys(elem).includes("excluded") &&
                elem.excluded &&
                elem.terms === 3) ||
              (!Object.keys(elem).includes("excluded") && elem.terms !== 3)
            ) {
              keepMap = false;
              errorArr.push("Bad Header keys");
            }
            //Below checks size
            if (!this.resultSize(result) && keepMap) {
              keepMap = false;
              errorArr.push("Inconsistent size");
            }
          }
          //Datatype check
          if (n <= result[0].terms && n > 0) {
            if (typeof elem !== "number" || Math.sign(elem) < 0) {
              keepMap = false;
              errorArr.push("Term datatype  or value is bad");
            }
          }
          if (n > result[0].terms) {
            const feedback = this.formatSubject(elem);
            if (!feedback[0] || feedback[1].length > 0) {
              errorArr.push(...feedback[1]);
              keepMap = false;
            }
          }
        }
      }
    });
    return [keepMap, errorArr];
  };
  /* Format Subject
        Ensures that each subject has the neccesary keys
        Also ensures that each value of any given key has the right datatype
        RETURNS an array of 'keepMap' and an array of errors 'errorMap'
   */
  formatSubject = (elem) => {
    let keepMap = true;
    let errorArr = [];
    if (!this.isObject(elem)) {
      keepMap = false;
      errorArr.push("Subject datatype is bad ");
    } else {
      // Check integrity of subject type
      if (
        !Object.keys(elem).includes("term") ||
        (elem.term && Math.sign(elem.term) !== 1) ||
        (elem.term && typeof elem.term !== "number") ||
        (elem.name && typeof elem.name !== "string") ||
        !Object.keys(elem).includes("name") ||
        !Object.keys(elem).includes("gradeDistribution") ||
        !Object.keys(elem).includes("score")
      ) {
        keepMap = false;
        errorArr.push("Subject Integrity is bad ");
      } else {
        const checkGrade = this.checkGradeDist(elem);
        if (!checkGrade[0] || checkGrade[1].length > 0) {
          errorArr.push(...checkGrade[1]);
          keepMap = false;
        }
      }
    }
    return [keepMap, errorArr];
  };
  /* Grade Distribution
        Ensures the grade distribution amounts to 100 ***
         and that any given score in 'Score' is not more ***
         than the ditribution at the given index
        Also ensures that the array length of Grade dist is equal to Score arr
        RETURNS an array with 'keepMap' (Boolean) and an array of errors called 'errorMap'
  */
  checkGradeDist = (elem) => {
    /*
          Grade distribution and score are meant to have the same length
          of array
          also, the grade distribution items are meant to resuce to 100
          */
    let errorArr = [];
    let keepMap = true;
    if (!this.isArray(elem.gradeDistribution) || !this.isArray(elem.score)) {
      keepMap = false;
      errorArr.push("Grade Distribution/score is meant to be an array ");
    } else {
      // typeof here ensures numbers are given integrity check
      const gradeValue = elem.gradeDistribution.reduce((a, b) => {
        if (Math.sign(a) < 0) {
          keepMap = false;
          errorArr.push(" Distribution values are not allowed to be negative");
        }
        return typeof b === "number" && b >= 0 ? a + b : a + 0;
      });
      const scoreValue = elem.score.reduce((a, b) => {
        if (Math.sign(a) < 0) {
          keepMap = false;
          errorArr.push(" score values are not allowed to be negative");
        }
        return typeof b === "number" && b >= 0 ? a + b : a + -10000;
      });
      if (
        gradeValue !== 100 ||
        scoreValue > 100 ||
        scoreValue < 0 ||
        elem.gradeDistribution.length !== elem.score.length
      ) {
        keepMap = false;
        errorArr.push("Grade Distribution/score inconsistencies ");
      } else {
        if (
          elem.gradeDistribution.filter((enx, n) => enx < elem.score[n])
            .length > 0
        ) {
          keepMap = false;
          errorArr.push("Score cannot be more than distribution");
        }
      }
    }
    return [keepMap, errorArr];
  };
  /* Session
        Changes the value of term in head
        RETURNS undefined / null
   */
  session = (value) => {
    if (typeof value !== "string") {
      throw "Session type invalid in session change";
    }
    this.head[0].session = value;
    this.format();
  };
  /* Class
        Changes the value of class in head
        RETURNS undefined / null
   */
  className = (value) => {
    if (typeof value !== "string") {
      throw "Class type invalid in class change";
    }
    this.head[0].className = value;
    this.format();
  };
  /* Add Term
        Add a new term (to the end of the array of this.terms) and an option array of subjects
        Updates term value with the length of subject array passed
        Also increments head's term value by one
        RETURNS undefined / null
   */
  addTerm = (sub = []) => {
    if (!this.isArray(sub)) {
      throw "Subject type invalid in 'Add term'";
    }
    this.head[0].terms += 1;
    this.terms.push(0);
    //We're using a ternary operator in 'some' because
    //An empty array will always produce negative
    //And our default value for sub is []
    const condition = sub.some((elem, n) => {
      //Sets the term for each subject in the array
      sub[n].term = this.head[0].terms;
      //Checking if subject is constructed correctly
      if (
        !this.formatSubject(elem)[0] ||
        this.formatSubject(elem)[1].length > 0
      ) {
        return true;
      } else {
        this.addSubject(this.head[0].terms, elem);
        return false;
      }
    });
    if (sub.length > 0 && condition) {
      throw "There are problems with one or more of the subjects with your new term\n";
    }
    this.format();
  };
  /* Remove Term
        Removes term and its sunject and also reduces term in head
        RETURNS undefined / null
   */
  removeTerm = (term) => {
    if (typeof term !== "number") {
      throw "Term type invalid in Remove_term";
    }
    const slice = this.getTermSub(term);
    this.subjects.splice(slice[0], slice[2].length);
    if (term !== this.terms.length) {
      this.terms.splice(term - 1, 1, 0);
    } else {
      this.terms.splice(term - 1, 1);
      this.head[0].terms -= 1;
    }

    this.format();
  };
  /* Change Subject Name
        Changes the name of a subject for a specified term if allowed
        RETURNS undefined / null
  */
  changeSubjectName = (term, name, newName) => {
    if (
      typeof term !== "number" ||
      typeof name !== "string" ||
      typeof newName !== "string"
    ) {
      throw "Invalid term, old name or subject name type in change sub name";
    }

    const index = this.getSub(term, name);
    const index2 = this.getSub(term, newName);
    if (typeof index === "number") {
      if (typeof index2 === "number") {
        throw "Subject already exists, update the already existing one or try another subject name";
      } else {
        this.subjects[index].name = newName;
      }
    } else {
      throw "Subject doesn't exist in the term specified";
    }
    this.format();
  };
  /* Change Subject Score OR/AND Grade Distribution
        Changes the score or/and grade distribution of a subject for a specified term if allowed
        RETURNS undefined / null
  */
  changeSubjectScore = (term, score, name, gradeDistribution) => {
    if (
      // !this.isArray(score) ||
      typeof term !== "number" ||
      typeof name !== "string"
      // !this.isArray(gradeDistribution)
    ) {
      throw "Invalid term, distribution, score or subject name type in change subject score";
    }
    const index = this.getSub(term, name);
    score = score
      ? score
      : typeof index === "number"
      ? this.subjects[index].score
      : [];
    gradeDistribution = gradeDistribution
      ? gradeDistribution
      : typeof index === "number"
      ? this.subjects[index].gradeDistribution
      : [];

    if (typeof index === "number") {
      this.subjects[index].score = score;
      this.subjects[index].gradeDistribution = gradeDistribution;
      const gradeCheck = this.checkGradeDist(this.subjects[index]);
      if (!gradeCheck[0] || gradeCheck[1].length > 0) {
        throw gradeCheck[1];
      }
    } else {
      throw "Subject doesn't exist in the term specified";
    }
    this.format();
  };
  /* Component Function
        Breaks down given result array into components (this.head, this.terms, this.subejcts) *** 
        and constructs the result with ***
        filters available. It also prevents override if a result was previously created
        RETURN an Object of this.result, this.object, this.terms and this.head
  */
  components = (arr) => {
    const feedback = this.resultFormatter(arr);
    if (!feedback[0] || feedback[1].length > 0) {
      throw feedback[1];
    } else if (this.result.length > 1) {
      throw "Override not allowed";
    } else {
      this.head = [arr[0]];
      this.terms = Array(arr[0].terms).fill(0);
      const arrSlice = arr.slice(arr[0].terms + 1);
      for (let a = 0; a < arrSlice.length; a++) {
        const element = arrSlice[a];
        if (element.term > this.terms.length || element.term <= 0) {
          throw `Subject at index ${n + arr[0].terms + 1} has a bad term`;
        } else {
          this.terms[element.term - 1] += 1;
        }
      }
      //here try to get the 'set' of terms from input
      this.subjects = arrSlice.sort((a, b) => a.term - b.term);
    }
    this.format();
    return {
      result: this.result,
      subjects: this.subjects,
      terms: this.terms,
      head: this.head[0],
    };
  };
  /* Check function
        Ensures the length of the head + terms + subjects is the length of the full result
        RETURNS Boolean
  */
  check = () =>
    this.head[0].terms + this.subjects.length + this.head.length ===
    (this.result !== false ? this.result.length : [""].length);
}

module.exports = ResultMaker;
