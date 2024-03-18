# Debug

This module exports a single function `dbg` that prints a variable and return
it.

Its taken from rust `dbg!` macro. The nice thing about it that it can be
inserted anywhere, see below for an example.

This is very useful for debugging.

## Examples

**Example 1**

```ts
import { dbg } from "@sigma/dbg";

// the nice thing is that `dbg` can be inserted anywhere
let value = fn2(dbg(fn1()));

// output: var = 4
```
