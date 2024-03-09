/**
This module exports a single function `dbg` that prints a variable and return it.

Its taken from rust `dbg!` macro. The nice thing about it that it can be inserted anywhere, see below for an example.

This is very useful for debugging.

@example
```ts
import { dbg } from "@sigma/dbg"

// the nice thing is that `dbg` can be inserted anywhere
let value = fn2(dbg(fn1()));

// output: var = 4

// there are some specialized outputs based on the runtime
// for example here is the output in Deno
// output: [file:///a/b/c.ts:5:14] var = 4
```

@module
*/

/**
Prints a variable to stderr and return it
@param value
*/
export function dbg<T>(variable: T): T {
  const modulePath = getModulePath();

  if (modulePath) {
    console.warn(`[${modulePath}] var = ${variable}`);
  } else {
    console.warn(`var = ${variable}`);
  }

  return variable;
}

function getModulePath() {
  if (runningInDeno()) {
    return new Error()
      .stack
      ?.split("\n")
      .at(2)
      ?.match(/(file:\/\/.*?)\)?$/)
      ?.at(1);
  } else if (runningInBun()) {
    return new Error()
      .stack
      ?.split("\n")
      .at(2)
      // NOTE: bun stack line and column number are wrong, so we don't use them
      ?.match(/\((.*?):/)
      ?.at(1);
  }
}

function runningInDeno() {
  return globalThis.Deno !== undefined;
}

function runningInBun() {
  // deno-lint-ignore no-explicit-any
  return (globalThis as any).Bun !== undefined;
}
