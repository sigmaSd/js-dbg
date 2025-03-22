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
 * import dbg from "@sigma/dbg"
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

/**
Prints a variable to stderr and return it
*/
export default function dbg<T>(
  variable: T,
  options: { name?: string } = {},
): T {
  const { name = "var" } = options;

  try {
    const error = new Error();
    const stack = error.stack;

    if (!stack) {
      console.warn(`${name} = ${variable}`);
      return variable;
    }

    // Extract file, line, and column information from the stack trace
    const stackLines = stack.split("\n");
    // Find the line that calls dbg
    const callerLine = stackLines[2];

    if (!callerLine) {
      console.warn(`${name} = ${variable}`);
      return variable;
    }

    let filename = "";
    let lineNumber = "";
    let columnNumber = "";

    // Different browsers format stack traces slightly different.  This should handle
    // Chrome, Firefox, and Safari (and potentially others).  It's brittle in that
    // changes to how browsers format stack traces will break this.
    const match = callerLine.match(/at.*?\((.*?):(\d+):(\d+)\)/) || // Chrome, sometimes Edge
      callerLine.match(/at (.*?):(\d+):(\d+)/) || // Firefox
      callerLine.match(/(.*?):(\d+):(\d+)/); // Safari

    if (match) {
      filename = match[1] || "";
      lineNumber = match[2] || "";
      columnNumber = match[3] || "";
    }

    if (!filename) {
      console.warn(`${name} = ${variable}`);
      return variable;
    }
    console.warn(
      `[${filename}:${lineNumber}:${columnNumber}] ${name} = ${variable}`,
    );
  } catch {
    console.warn(`[dbg error] ${name} = ${variable}`);
  }

  return variable;
}
