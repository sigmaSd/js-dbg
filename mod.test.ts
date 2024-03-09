import { assertEquals } from "jsr:@std/assert@0.219.1";
import { dbg } from "./mod.ts";

Deno.test("dbg", () => {
  assertEquals(dbg(4), 4);
});
