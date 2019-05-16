import '../../stencil.core';
import { EventEmitter } from '../../stencil.core';
import { SchemaRoot } from './schema';
export declare class DesignerComponent {
    inputschema: string;
    inputtranslations: string;
    viewmode: string;
    debugmode: boolean;
    exportSchema(): string;
    error: EventEmitter;
    change: EventEmitter;
    watchHandler(): void;
    private i18n;
    activeTab: string;
    _tickle: number;
    workingSchema: SchemaRoot;
    componentWillLoad(): void;
    rerender(): void;
    changeRootType(type: string): void;
    private lastOutput;
    _loadSchema(): void;
    render(): JSX.Element;
}
