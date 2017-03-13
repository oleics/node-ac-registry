
module.exports = throws;

function throws(fn) {
  var thrown;
  try {
    fn();
  } catch(ex) {
    thrown = ex;
  }
  return thrown instanceof Error;
}
