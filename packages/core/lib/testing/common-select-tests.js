"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rawTag_1 = require("../rawTag");
function commonSelectTests(builder) {
    function snap(b) {
        expect(b.getAst()).toMatchSnapshot();
        expect(b.toOperation()).toMatchSnapshot();
    }
    test("select columns", () => {
        snap(builder().select("a", "b"));
    });
    test("select columns, with builder", () => {
        snap(builder().select("a", "b", builder()
            .select("c")
            .as("sub")));
    });
    test("select columns, with raw", () => {
        snap(builder().select("a", "b", rawTag_1.raw `COUNT(*) as cnt`));
    });
    test("select from table", () => {
        snap(builder()
            .select("a", "b")
            .from("users"));
    });
    test("where clause", () => {
        snap(builder()
            .from("users")
            .where("id", 1));
    });
    test("where subquery", () => {
        snap(builder()
            .from("users")
            .where(q => {
            q.where("id", 1).andWhere("id", 2);
        })
            .orWhere("id", 4));
    });
}
exports.commonSelectTests = commonSelectTests;
