import '../../../../dist/types/stencil.core';
import { ISchemaItem, IHasChildren } from '../schema';
export declare class SchemaRowComponent {
    item: ISchemaItem;
    parent: any;
    private i18n;
    showChildren: boolean;
    showDetailsPan: boolean;
    _tickle: number;
    removeItem(item: ISchemaItem): void;
    addNewProp(item: IHasChildren): void;
    rerender(): void;
    render(): JSX.Element;
}
