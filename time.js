

var docPerPage = 205;
function calculateTime(pages) {
  var docPerPage = 205;
  var msPerDoc = 250;
  var time;

  let seconds = Math.round(((docPerPage*pages)/msPerDoc)%60)
  let hours = Math.floor(((docPerPage*pages)/msPerDoc)/60)
  return `${hours} hours, and ${seconds} seconds`;
}

console.log(calculateTime(6830))
