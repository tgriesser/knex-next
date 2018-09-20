import { BaseSelectBuilder } from "../../../src/SelectBuilder";

export function pagination(BuilderClass: typeof BaseSelectBuilder) {
  Object.assign(BuilderClass.prototype, {
    forPage(this: BaseSelectBuilder, page: number, perPage: number = 15) {
      return this.chain(ast => {
        return ast;
      });
    },
    forPageAfterId(
      this: BaseSelectBuilder,
      $perPage = 15,
      $lastId = 0,
      $column = "id"
    ) {
      return this.chain(ast => {
        return ast;
      });
    },
    /**
     * Paginate the given query into a simple paginator.
     */
    paginate(
      perPage: number = 15,
      columns: string[] = ["*"],
      pageName: string = "page",
      page: number | null = null
    ) {
      // $page = $page ?: Paginator::resolveCurrentPage($pageName);
      // $total = $this->getCountForPagination($columns);
      // $results = $total ? $this->forPage($page, $perPage)->get($columns) : collect();
      // return $this->paginator($results, $total, $perPage, $page, [
      //     'path' => Paginator::resolveCurrentPath(),
      //     'pageName' => $pageName,
      // ]);
    },
  });
}
