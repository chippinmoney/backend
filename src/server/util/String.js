const verifyEmailFormat = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

const verifyMinimumLength = (message, minLength) => {
  return message.length >= minLength
}

const isEmpty = (message) => {
  if(!message || message=='')
      return true;
  return false;
}

const arrayIncludes = (array, searchVal) => {
  const arrayCopy = array
  return arrayCopy.includes(searchVal)
}

const arrayFindOneAndDelete = (array, searchVal) => {
  const arrayCopy = array
  for(let i=0; i<arrayCopy.length; i++) {
      if(arrayCopy[i] == searchVal) {
          arrayCopy.splice(i, 1)
          break
      }
  }

  return arrayCopy
}

const listStrToList = (listStr) => {
  const res = []
  const list = listStr.split(',')
  for(let i=0;i<list.length;i++)
      if(list[i].length>0)
          res.push(list[i])
  return res
}

const removeDuplicatesFromList =  (list) => {
  const newList = []
  for (let i=0; i<list.length; i++) {
      if (!newList.includes(list[i]))
          newList.push(list[i])
  }
  return newList
}

const Utf8ArrayToStr = (array) => {
  let out, i, len, c;
  let char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while(i < len) {
      c = array[i++];
      switch(c >> 4)
      { 
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          // 0xxxxxxx
          out += String.fromCharCode(c);
          break;
      case 12: case 13:
          // 110x xxxx   10xx xxxx
          char2 = array[i++];
          out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
          break;
      case 14:
          // 1110 xxxx  10xx xxxx  10xx xxxx
          char2 = array[i++];
          char3 = array[i++];
          out += String.fromCharCode(((c & 0x0F) << 12) |
                      ((char2 & 0x3F) << 6) |
                      ((char3 & 0x3F) << 0));
          break;
      }
  }

  return out;
}

module.exports = {
  verifyEmailFormat,
  verifyMinimumLength,
  isEmpty,
  arrayIncludes,
  arrayFindOneAndDelete,
  listStrToList,
  removeDuplicatesFromList,
  Utf8ArrayToStr
}