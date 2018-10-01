import { Set as ISet } from "immutable";

// prettier-ignore
export const validOperators = ISet<string>([
  '=', '<', '>', '<=', '>=', '<>', '!=', '<=>',
  'like', 'like binary', 'not like', 'ilike',
  '&', '|', '^', '<<', '>>',
  'rlike', 'regexp', 'not regexp',
  '~', '~*', '!~', '!~*', 'similar to',
  'not similar to', 'not ilike', '~~*', '!~~*',    
]);
