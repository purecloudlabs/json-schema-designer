import '../../../stencil.core';
import { ISchemaItem, IHasChildren } from '../schema';
export declare class SchemaRowComponent {
    item: ISchemaItem;
    parent: any;
    definitions: any;
    dataTypeArray: string[];
    private i18n;
    usenullable: boolean;
    showChildren: boolean;
    showDetailsPan: boolean;
    showDeleteConfirmationMessage: boolean;
    _tickle: number;
    removeItem(item: ISchemaItem): void;
    addNewProp(item: IHasChildren): void;
    rerender(): void;
    componentDidLoad(): void;
    getOptions(propCountDisplay: any): any[];
    render(): JSX.Element;
}
