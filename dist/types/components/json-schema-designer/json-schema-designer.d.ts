import '../../stencil.core';
export declare class DesignerComponent {
    inputschema: string;
    inputtranslations: string;
    viewmode: string;
    debugmode: boolean;
    exportSchema(): any;
    private i18n;
    activeTab: string;
    _tickle: number;
    workingSchema: any;
    constructor();
    componentWillLoad(): void;
    rerender(): void;
    render(): JSX.Element;
}
