import '../../stencil.core';
export declare class DesignerComponent {
    inputSchema: any;
    inputTranslations: any;
    outputSchemaCallback: any;
    viewMode: string;
    private i18n;
    activeTab: string;
    _tickle: number;
    workingSchema: any;
    constructor();
    exportSchema(): void;
    componentWillLoad(): void;
    componentDidLoad(): void;
    rerender(): void;
    render(): JSX.Element;
}
