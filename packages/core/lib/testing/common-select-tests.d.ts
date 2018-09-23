import { SelectBuilder } from "../SelectBuilder";
interface SelectBuilderFactory {
    (): SelectBuilder;
}
export declare function commonSelectTests(builder: SelectBuilderFactory): void;
export {};
