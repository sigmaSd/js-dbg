import { assertEquals } from "jsr:@std/assert@0.219.1";
import { dbg } from "./mod.ts";

Deno.test("basic", () => {
  assertEquals(dbg(4), 4);
});

//TODO: also test more specifiers like https
Deno.test("message(file)", () => {
  const output = new Deno.Command("deno", {
    args: ["eval", "import {dbg} from './mod.ts'; dbg(4)"],
  }).outputSync();
  assertEquals(
    new TextDecoder().decode(output.stderr),
    `[file://${import.meta.filename?.replace(".test", "")}:30:22] var = 4\n`,
  );
});
