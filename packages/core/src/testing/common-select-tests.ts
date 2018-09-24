import { SelectBuilder } from "../SelectBuilder";
import { raw } from "../rawTag";

interface SelectBuilderFactory {
  (): SelectBuilder;
}

export function commonSelectTests(builder: SelectBuilderFactory) {
  function snap(b: SelectBuilder) {
    expect(b.getAst()).toMatchSnapshot();
    expect(b.toOperation()).toMatchSnapshot();
  }
  test("select columns", () => {
    snap(builder().select("a", "b"));
  });

  test("select columns, with builder", () => {
    snap(
      builder().select(
        "a",
        "b",
        builder()
          .select("c")
          .as("sub")
      )
    );
  });

  test("select columns, with raw", () => {
    snap(builder().select("a", "b", raw`COUNT(*) as cnt`));
  });

  test("select from table", () => {
    snap(
      builder()
        .select("a", "b")
        .from("users")
    );
  });

  test("where clause", () => {
    snap(
      builder()
        .from("users")
        .where("id", 1)
    );
  });

  test("where subquery", () => {
    snap(
      builder()
        .from("users")
        .where(q => {
          q.where("id", 1).andWhere("id", 2);
        })
        .orWhere("id", 4)
    );
  });

  test("join + left join", () => {
    snap(
      builder()
        .select("*")
        .from("users")
        .join("contacts", "users.id", "=", "contacts.id")
        .leftJoin("photos", "users.id", "=", "photos.id")
    );
  });

  test("cross join", () => {
    snap(
      builder()
        .select("*")
        .from("users")
        .crossJoin("contracts")
        .crossJoin("photos")
    );
  });

  test("full outer join", () => {
    snap(
      builder()
        .select("*")
        .from("users")
        .fullOuterJoin("contacts", "users.id", "=", "contacts.id")
    );
  });

  test("right (outer) join", () => {
    snap(
      builder()
        .select("*")
        .from("users")
        .rightJoin("contacts", "users.id", "=", "contacts.id")
        .rightOuterJoin("photos", "users.id", "=", "photos.id")
    );
  });

  test("multi-statement join", () => {
    snap(
      builder()
        .select("*")
        .from("users")
        .join("contacts", qb => {
          qb.on("users.id", "=", "contacts.id").orOn("users.name", "=", "contacts.name");
        })
    );
  });

  test("complex join with nest conditional statements", () => {
    snap(
      builder()
        .select("*")
        .from("users")
        .join("contacts", q => {
          q.on(j => {
            j.on("users.id", "=", "contacts.id");
            j.orOn("users.name", "=", "contacts.name");
          });
        })
    );
  });

  test("complex join with empty in", () => {
    snap(
      builder()
        .select("*")
        .from("users")
        .join("contacts", qb => {
          qb.on("users.id", "=", "contacts.id").onIn("users.name", []);
        })
    );
  });

  test("throws with invalid operator", () => {
    // expect(() => {
    //   builder()
    //     .select("*")
    //     .from("users")
    //     .where(
    //       "id",
    //       "in",
    //       builder()
    //         .select("*")
    //         // @ts-ignore
    //         .where("id", "isnt", 1)
    //     )
    //     .toString();
    // }).toThrow('The operator "isnt" is not permitted');
  });
}
