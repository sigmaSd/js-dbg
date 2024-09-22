/**
 * # Debug
 *
 * This module exports a single function `dbg` that prints a variable and return it.
 *
 * Its taken from rust `dbg!` macro. The nice thing about it that it can be inserted anywhere, see below for an example.
 *
 * This is very useful for debugging.
 *
 * @example
 * ```ts
 * import { dbg } from "@sigma/dbg"
 *
 * // the nice thing is that `dbg` can be inserted anywhere
 * const fn1 = () => 4;
 * const fn2 = (n: number) => n + 1;
 * let value = fn2(dbg(fn1()));
 *
 * // output: var = 4
 * ```
 *
 * @module
 */

/**
Prints a variable to stderr and return it
@param value
*/
export function dbg<T>(variable: T): T {
  if (globalThis.Deno) {
    dbgDeno(variable);
  } else {
    console.warn(`var = ${variable}`);
  }

  return variable;
}

function dbgDeno(variable: unknown) {
  const stack = new Error().stack;
  const fileLine = stack?.split("\n")[3];
  if (!fileLine) {
    console.warn(`var = ${variable}`);
    return;
  }
  // at file:///home/mrcool/dev/deno/dbg/mod.test.ts:8:16
  // at c (file:///home/mrcool/dev/deno/dbg/c.ts:5:3)
  const path = /(file:\/\/[^)]+)/.exec(fileLine)?.[1];
  if (!path) {
    console.warn(`var = ${variable}`);
    return;
  }
  // make the path relative to the current working directory
  // use import.meta.url to get the current working directory
  const cwd = import.meta.url.split("/").slice(0, -1).join("/") + "/";
  const file = path.replace(cwd, "");
  console.warn(`[${file}] var = ${variable}`);
}
