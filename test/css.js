const strict = require("assert").strict;
const detective = require("../index.js");

function assert(source, dependencies) {
  strict.deepEqual(detective(source, { css: true }), dependencies);
}

describe("css", () => {
  describe("@import", () => {
    it("detects simple imports", () => {
      assert('@import "foo.css"', ["foo.css"]);
    });

    describe("url()", () => {
      it("works with url()", () => {
        assert('@import url("navigation.css");', ["navigation.css"]);
      });

      it("works with single quotes", () => {
        assert("@import url('navigation.css');", ["navigation.css"]);
      });

      it("works with no quotes", () => {
        assert("@import url(navigation.css);", ["navigation.css"]);
      });
    });

    it("detects multiple imports", () => {
      assert('@import "1.css"; @import "2.css"; @import "3.css"', [
        "1.css",
        "2.css",
        "3.css",
      ]);
    });

    it("ignores media", () => {
      assert('@import "printstyle.css" print;', ["printstyle.css"]);
    });

    it("ignores media query", () => {
      assert('@import "bar.css" (min-width: 25em);', ["bar.css"]);
    });

    it("ignores both", () => {
      assert('@import "mobstyle.css" screen and (max-width: 768px);', [
        "mobstyle.css",
      ]);
    });

    it("does not touch the paths", () => {
      assert('@import "../../././bla.css"', ["../../././bla.css"]);
    });
  });

  describe("@value", () => {
    // see https://github.com/css-modules/postcss-icss-values
    it("extracts from single values", () => {
      assert("@value primary from 'colors.css';", ["colors.css"]);
    });

    it("works with url()", () => {
      assert("@value primary from url('colors.css');", ["colors.css"]);
    });

    it("extracts from multiple values", () => {
      assert("@value primary, secondary from 'colors.css';", ["colors.css"]);
    });

    it("works with aliases", () => {
      assert(
        "@value small as bp-small, large as bp-large from 'breakpoints.css';",
        ["breakpoints.css"]
      );
    });

    it("works with grouped aliases", () => {
      assert("@value (small as t-small, large as t-large) from 'typo.css';", [
        "typo.css",
      ]);
    });

    it("leaves simple definitions alone", () => {
      assert("@value mine: #fff;", []);
    });

    it("leaves calculated definitions alone", () => {
      assert("@value mine: calc(1px + 4px)", []);
    });
  });

  describe("declarations", () => {
    it("filters out url() for direct usages", () => {
      assert(".x { background: url(bla.png) }", ["bla.png"], {
        url: true,
      });
    });

    it("filters out url() for deeper nested ones", () => {
      assert(
        ".x { list-style: lower-roman url('../img/shape.png') outside; }",
        ["../img/shape.png"],
        { url: true }
      );
    });

    it("finds url() in cursor definitions", () => {
      assert(".x { cursor: url(cursor1.png) 4 12, auto; }", ["cursor1.png"], {
        url: true,
      });
    });

    it("finds url() in @font-face", () => {
      assert(
        "@font-face { font-family: myFirstFont; src: url(sansation_light.woff); }",
        ["sansation_light.woff"],
        { url: true }
      );
    });

    it("finds url() in @value definitions", () => {
      assert("@value x: url(bummer.png)", ["bummer.png"], { url: true });
    });
  });
});
