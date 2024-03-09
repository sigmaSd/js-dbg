# dbg

This module exports a single function `dbg` that prints a variable and return
it.

Its taken from rust `dbg!` macro. The nice thing about it that it can be
inserted anywhere, see below for an example.

This is very useful for debugging.

```ts
import { dbg } from "@sigma/dbg";

// the nice thing is that `dbg` can be inserted anywhere
let value = fn2(dbg(fn1()));

// output: var = 4

// there are some specialized outputs based on the runtime
// for example here is the output in Deno
// output: [file:///a/b/c.ts:5:14] var = 4
```
