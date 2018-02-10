async function* toAsyncIterable(source) {
  let talkback;
  let resolve;
  let hasVal;
  let val;
  source(0, (t, d) => {
    if (t === 0) talkback = d;
    else if (t === 1) {
      val = d;
      resolve(true);
    } else if (t === 2) {
      resolve(false);
      talkback = false;
    }
  });
  while (talkback) {
    hasVal = new Promise((_resolve) => { resolve = _resolve; });
    talkback(1);
    if (await hasVal) {
      yield val;
    } else {
      return;
    }
  }
}

module.exports = toAsyncIterable;
