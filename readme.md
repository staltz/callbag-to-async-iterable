# callbag-to-async-iterable

Convert any pullable callbag source to an AsyncIterable (`async function*`).

**EXPERIMENTAL:** uses async iterators from ES2018, which are known to only work in Firefox 57+ and Edge 16.

Copy file `ff-example.js` and paste it in Firefox's console to see a successful run.

`npm install callbag-to-async-iterable`

## Example

### Some day this example will work

```js
const {pipe, filter, take} = require('callbag-basics');
const toAsyncIterable = require('callbag-to-async-iterable');

function pullableAsyncSource(start, sink) {
  if (start !== 0) return;
  let i = 0;
  sink(0, t => {
    if (t === 1) {
      setTimeout(() => { sink(1, i++) }, 1000);
    }
  });
}

async function main() {
  const nums = pipe(
    pullableAsyncSource,
    filter(i => i % 2),
    take(5),
    toAsyncIterable
  );

  for await (let x of nums) {
    console.log(x);
  }
}

main();
// 1
// 3
// 5
// 7
// 9
```

