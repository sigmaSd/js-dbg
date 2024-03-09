/**
This module exports a single function `dbg` that prints a variable and return it.

Its taken from rust `dbg!` macro. The nice thing about it that it can be inserted anywhere, see below for an example.

This is very useful for debugging.

@example
```ts
import { dbg } from "jsr:@sigma/dbg"

// the nice thing is that `dbg` can be inserted anywhere
let value = fn2(dbg(fn1()))

// output: var = 4

// there are some specialized outputs based on the runtime
// for example here is the output in Deno
// output: [/a/b/c.ts:5:14] var = 4
```

@module
*/

/**
Prints a variable to stderr and return it
@param value
*/
export function dbg<T>(variable: T): T {
  let modulePath;
  if (runningInDeno()) {
    modulePath = new Error()
      .stack
      ?.split("\n")
      .at(2)
      ?.match(/file:\/\/(.*?)\)?$/)
      ?.at(1);
  } else if (runningInBun()) {
    modulePath = new Error()
      .stack
      ?.split("\n")
      .at(2)
      ?.match(/\((.*?)\)/)
      ?.at(1);
  }

  if (modulePath) {
    console.warn(`[${modulePath}] var = ${variable}`);
  } else {
    console.warn(`var = ${variable}`);
  }

  return variable;
}

function runningInDeno() {
  return globalThis.Deno !== undefined;
}

function runningInBun() {
  // deno-lint-ignore no-explicit-any
  return (globalThis as any).Bun !== undefined;
}
