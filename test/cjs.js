const assert = require("assert").strict;
const detective = require("../index.js");

describe("cjs", () => {
  it("returns the dependencies of a commonjs module", () => {
    const deps = detective('var a = require("./a");\n var b = require("./b");');
    assert.equal(deps.length, 2);
  });

  it("returns the dependencies of a main require cjs module", () => {
    const deps = detective(
      'var a = require("./a");\n var b = require.main.require("./b");'
    );

    assert.equal(deps[0], "./a");
    assert.equal(deps[1], "./b");
    assert.equal(deps.length, 2);
  });

  it("does exclude requires based on variable values", () => {
    const deps = detective(
      'var a = require("./a");\n var b = "foo" + ".js";;\n var c = require(b);'
    );

    assert.equal(deps[0], "./a");
    assert.equal(deps.length, 1);
  });

  it("returns an empty list if there are no dependencies", () => {
    const deps = detective("1 + 1;");
    assert.equal(deps.length, 0);
  });

  it("does not throw on jsx", () => {
    assert.doesNotThrow(() => {
      detective('var a = require("./foobar"); var templ = <jsx />');
    });
  });

  describe("es6", () => {
    it("supports es6 syntax", () => {
      const deps = detective(
        'const a = require("./a");\n let b = require("./b");'
      );
      assert.equal(deps.length, 2);
    });

    it("supports template literals", () => {
      const deps = detective(
        'const a = require("./a");\n let b = require("./b");\n var c = require(`./c`);'
      );
      assert.equal(deps.length, 3);
    });
  });
});
