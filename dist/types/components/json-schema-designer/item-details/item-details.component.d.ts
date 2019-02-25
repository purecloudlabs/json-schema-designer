import '../../../stencil.core';
import { ISchemaItem } from '../schema';
export declare class ItemDetailsComponent {
    item: ISchemaItem;
    parent: any;
    definitions: any;
    private i18n;
    enumCtrlExpanded: boolean;
    _tickle: number;
    rerender(): void;
    componentWillLoad(): void;
    _getDefinitionReferences(definition: any, prefix: string): string[];
    render(): JSX.Element;
}
