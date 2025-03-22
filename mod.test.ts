import { assertEquals, assertMatch } from "jsr:@std/assert@0.219.1";

for (
  const mod of ["./mod.ts", "./mod_browser.ts"]
) {
  const { dbg } = await import(mod);

  Deno.test("basic", () => {
    assertEquals(dbg(4), 4);
  });

  Deno.test("message(file)", () => {
    {
      const output = new Deno.Command("deno", {
        args: ["eval", `import {dbg} from '${mod}'; dbg(4)`],
      }).outputSync();
      assertMatch(
        new TextDecoder().decode(output.stderr),
        /var = 4\n$/,
      );
    }
    {
      const output = new Deno.Command("deno", {
        args: ["eval", `import {dbg} from '${mod}'; dbg(4, {name: 'myVar'})`],
      }).outputSync();
      assertMatch(
        new TextDecoder().decode(output.stderr),
        /myVar = 4\n$/,
      );
    }
  });
}
