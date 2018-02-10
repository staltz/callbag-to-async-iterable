/*
 * This example code below should run correctly in Firefox 57+ and Edge 16.
 * Other browsers and runtimes should catch up soon with ES2018.
 */

function source(start, sink) {
    if (start !== 0) return;
    let i = 0;
    sink(0, t => {
        if (t === 1) {
          setTimeout(() => { sink(1, i++) }, 1000)
        }
    })
}

function pipe(...cbs) {
  let res = cbs[0];
  for (let i = 1, n = cbs.length; i < n; i++) res = cbs[i](res);
  return res;
}

const filter = condition => source => (start, sink) => {
  if (start !== 0) return;
  let talkback;
  source(0, (t, d) => {
    if (t === 0) {
      talkback = d;
      sink(t, d);
    } else if (t === 1) {
      if (condition(d)) sink(t, d);
      else talkback(1);
    }
    else sink(t, d);
  });
};

const take = max => source => (start, sink) => {
  if (start !== 0) return;
  let taken = 0;
  let sourceTalkback;
  function talkback(t, d) {
    if (taken < max) sourceTalkback(t, d);
  }
  source(0, (t, d) => {
    if (t === 0) {
      sourceTalkback = d;
      sink(0, talkback);
    } else if (t === 1) {
      if (taken < max) {
        taken++;
        sink(t, d);
        if (taken === max) {
          sink(2);
          sourceTalkback(2);
        }
      }
    } else {
      sink(t, d);
    }
  });
};

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

async function main() {
  const nums = pipe(
    source,
    filter(i => i % 2),
    take(5),
    toAsyncIterable
  )
  for await (let x of nums) {
    console.log(x)
  }
}

main()
