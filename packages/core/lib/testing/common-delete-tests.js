"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function commonDeleteTests(del) {
    function snap(b) {
        expect(b.getAst()).toMatchSnapshot();
        expect(b.toOperation()).toMatchSnapshot();
    }
    test("from table", () => {
        snap(del().from("someTable"));
    });
    test("from table where", () => {
        snap(del()
            .from("someTable")
            .where("id", 1)
            .orWhere({ foo: 2, bar: 3 }));
    });
    test(".then() executes", () => {
        del()
            .from("someTable")
            .where("id", 1);
    });
}
exports.commonDeleteTests = commonDeleteTests;
