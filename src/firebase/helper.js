//  return env based format from firebase
function getEnvFormat(obj) {
  function getProperFormatKeys(str) {
    var arr = ["REACT", "APP"];
    var s = "";
    for (var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch >= 65 && ch <= 90) {
        arr.push(s.toUpperCase());
        s = str[i];
      } else {
        s += str[i];
      }
    }
    arr.push(s.toUpperCase());
    return arr.join("_");
  }

  return Object.keys(obj)
    .map((key) => {
      return [getProperFormatKeys(key), "=", obj[key]].join("");
    })
    .join("\n");
}
