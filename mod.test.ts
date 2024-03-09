import { assertEquals } from "jsr:@std/assert@0.219.1";
import { dbg } from "./mod.ts";

Deno.test("dbg", () => {
  // NOTE: Test stderr
  // should be possible be spawning another instance of deno
  assertEquals(dbg(4), 4);
});
