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
 * **Browsers:**
 *
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

  // Base log prefix in case stack parsing fails
  let logPrefix = `${name} =`;

  const error = new Error();
  const stack = error.stack;

  if (!stack) {
    // Fallback if no stack trace is available
    console.warn(logPrefix, variable); // Pass variable separately
    return variable;
  }

  const stackLines = stack.split("\n");
  // Index 2 is typically the caller of dbg:
  // 0: Error message string ("Error")
  // 1: Stack frame for the dbg() function itself
  // 2: Stack frame for the *caller* of dbg()
  const callerLine = stackLines[2];

  if (!callerLine) {
    // Fallback if stack trace format is unexpected
    console.warn(logPrefix, variable); // Pass variable separately
    return variable;
  }

  // Regex attempts to handle common stack trace formats (V8/Chrome, Firefox, Safari)
  // It's brittle and may need adjustments for different engines or future browser versions.
  const match = callerLine.match(/at.*?\(?(.*?):(\d+):(\d+)\)?$/) || // V8/Chrome (allow optional parens)
    callerLine.match(/@?(.*?):(\d+):(\d+)$/); // Firefox / Safari (allow optional @)

  if (match) {
    // Extract file, line, and column
    const rawFilename = match[1]?.trim() || "";
    const lineNumber = match[2] || "?";
    const columnNumber = match[3] || "?";

    if (rawFilename) {
      // Attempt to extract just the filename from URL/path for cleaner logging
      let displayFilename = rawFilename;
      try {
        const lastSlash = rawFilename.lastIndexOf("/");
        if (lastSlash !== -1) {
          displayFilename = rawFilename.substring(lastSlash + 1);
        }
        // Handle potential query params or hash in URLs
        const queryIndex = displayFilename.indexOf("?");
        if (queryIndex !== -1) {
          displayFilename = displayFilename.substring(0, queryIndex);
        }
        const hashIndex = displayFilename.indexOf("#");
        if (hashIndex !== -1) {
          displayFilename = displayFilename.substring(0, hashIndex);
        }
      } catch { /* Ignore errors during string manipulation */ }

      // Update log prefix with location info
      logPrefix =
        `[${displayFilename}:${lineNumber}:${columnNumber}] ${name} =`;
    }
  }
  // If regex didn't match or filename was empty, logPrefix remains the default

  console.warn(logPrefix, variable); // Log prefix string, then the variable itself for browser inspection

  return variable;
}
