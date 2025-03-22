## Changelog

### 1.2.0

-   **feat**: Added browser support via `@sigma/dbg/browser` entrypoint. Browsers and runtimes that don't support Node.js APIs (like `util.getCallSites`) should use this entrypoint. Bun currently also needs to import from `@sigma/dbg/browser` due to lack of `util.callSites` support.
-   **feat**: Updated `dbg` function to use `util.getCallSites` (or `util.getCallSite` for older Node.js versions) to determine the calling file, line number, and column number in Node.js environments.
-   **feat**: Improved stack trace parsing for browsers in `mod_browser.ts` to extract file, line, and column information, supporting Chrome, Firefox, and Safari.
-   **test**: Added tests to verify functionality with both `mod.ts` and `mod_browser.ts`.
