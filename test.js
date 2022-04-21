const myFun = async (parm, callback) => {
  for (var i = 0; i < 5; i++) {
    console.log(i);
    await asyncForEach();
  }
};

function asyncForEach() {
  return new Promise((resolve) => {
    console.log("in");
    setTimeout(function () {
      console.log("out");
      return resolve();
    }, 1000);
  });
}

myFun();
