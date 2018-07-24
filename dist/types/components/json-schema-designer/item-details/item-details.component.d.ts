import '../../../stencil.core';
import { ISchemaItem } from '../schema';
export declare class ItemDetailsComponent {
    item: ISchemaItem;
    parent: any;
    private i18n;
    enumCtrlExpanded: boolean;
    _tickle: number;
    rerender(): void;
    componentWillLoad(): void;
    render(): JSX.Element;
}
