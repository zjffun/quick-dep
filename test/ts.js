const assert = require("assert").strict;
const detective = require("../index.js");

describe("typescript", () => {
  it("retrieves the dependencies of modules", () => {
    const fixture = 'import {foo, bar} from "mylib";';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "mylib");
  });

  it("retrieves the re-export dependencies of modules", () => {
    const fixture = 'export {foo, bar} from "mylib";';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "mylib");
  });

  it("retrieves the re-export * dependencies of modules", () => {
    const fixture = 'export * from "mylib";';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "mylib");
  });

  it("handles multiple imports", () => {
    const fixture = 'import {foo, bar} from "mylib";\nimport "mylib2"';
    const deps = detective(fixture);
    assert.equal(deps.length, 2);
    assert.equal(deps[0], "mylib");
    assert.equal(deps[1], "mylib2");
  });

  it("handles default imports", () => {
    const fixture = 'import foo from "foo";';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "foo");
  });

  it("handles dynamic imports", () => {
    const fixture = 'import("foo");';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "foo");
  });

  it("handles async imports", () => {
    const fixture = '() => import("foo");';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "foo");
  });

  it('retrieves dependencies from modules using "export ="', () => {
    const fixture = 'import foo = require("mylib");';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "mylib");
  });

  it("returns an empty list for empty files", () => {
    const fixture = "";
    const deps = detective(fixture);
    assert.equal(deps.length, 0);
  });

  it("does not throw with angle bracket type assertions in a module", () => {
    assert.doesNotThrow(() => {
      const fixture = 'import foo from "foo"; var baz = <baz>bar;';
      detective(fixture);
    });
  });

  it("parses out type annotation imports", () => {
    const fixture = 'const x: typeof import("foo") = 0;';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "foo");
  });


  it("parses out TypeScript >= 3.8 type imports", () => {
    const fixture = 'import type { Foo } from "foo"';
    const deps = detective(fixture);
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "foo");
  });


  it("supports CJS when mixedImports is true", () => {
    const fixture = 'const foo = require("foobar")';
    const deps = detective(fixture, { mixedImports: true });
    assert.equal(deps.length, 1);
    assert.equal(deps[0], "foobar");
  });

  describe("jsx", () => {
    it("does not throw with JSX in a module and parserOptions.jsx", () => {
      assert.doesNotThrow(() => {
        const fixture = 'import Foo from "Foo"; var foo = <Foo/>;';
        detective(fixture, { jsx: true });
      });
    });
  });

  describe("tsx", () => {
    it("returns the import of a tsx file when using option", () => {
      const fixture = 'import Foo from "Foo"; var foo = <Foo/>;';
      const results = detective(fixture, { jsx: true });
      assert.equal(results[0], "Foo");
    });
  });
});
