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
 * **Browser:
 * Browsers and runtimes that don't support node apis, should use `@sigma/dbg/browser` entrypoint.
 *
 * Note: Bun currently does not support `util.callSites` so it should also import from `@sigma/dbg/browser`.
 * @module
 */

import util from "node:util";
import path from "node:path";

/**
Prints a variable to stderr and return it
*/
export function dbg<T>(variable: T, options: { name?: string } = {}): T {
  const { name = "var" } = options;

  try {
    const fn = util.getCallSites !== undefined
      ? util.getCallSites
      // @ts-ignore: for node before v23.3.0
      : util.getCallSite;
    const callSites = fn();
    const caller = callSites[1]; // Get the call site of the *caller* of dbg
    if (!caller) {
      console.warn(`${name} = ${variable}`);
    } else {
      const filename = caller.scriptName;
      const lineNumber = caller.lineNumber;
      const columnNumber = caller.column;

      if (!filename) {
        console.warn(`${name} = ${variable}`);
        return variable;
      }

      // Use import.meta.url to get the current module's URL
      const currentModuleUrl = import.meta.url;

      const relativePath = filename.startsWith("file:")
        ? path.relative(
          new URL(".", currentModuleUrl).pathname,
          new URL(filename).pathname,
        )
        : path.relative(new URL(".", currentModuleUrl).pathname, filename); // handles both file:// and regular paths

      console.warn(
        `[${relativePath}:${lineNumber}:${columnNumber}] ${name} = ${variable}`,
      );
    }
  } catch (e) {
    console.log(e);
    console.warn(`[dbg error] ${name} = ${variable}`);
  }

  return variable;
}
