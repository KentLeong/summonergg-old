const waitFor = (ms) => new Promise(r => setTimeout(r, ms));
async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

Array.prototype.asyncForEach = function() {
  console.log(this)
}

String.prototype.capitalize = () => {
  console.log(this)
}
var a = [1,2,3,4,5,6,7,8,9,10]

// asyncForEach(a, async num => {
//   // await waitFor(1000);

//   await new Promise(r => {
//     setTimeout(r, 1000)
//   })
//   console.log(num)
// })

// a.forEach(async num => {
//   await new Promise(r => {
//     setTimeout(r, 1000)
//   })
//   console.log(num)
// })
a.asyncForEach();
// a.forEach(num => {
//   console.log(num)
// }) 