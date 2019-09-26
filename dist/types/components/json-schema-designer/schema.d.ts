export interface ISchemaItem {
    title: string;
    type: string;
    description: string;
    isRequired: boolean;
    isNullable: boolean;
    parent: IHasChildren;
    default: string;
    enum: any[];
    _id: string;
    isRoot: boolean;
    definitionName: string;
    isDefinition: boolean;
    jsonSchema(): any;
    changeType(type: string): void;
    addEnumValue(): void;
    removeEnumValue(index: number): void;
}
export interface IHasChildren {
    removeChild(_id: string): void;
    addChild(): void;
    getChildren(): ISchemaItem[];
    replaceChild(newItem: ISchemaItem): void;
}
export declare function createAppropriateSchemaItem(json: any, parent: IHasChildren): ISchemaItem;
export declare class SchemaBasic implements ISchemaItem {
    title: string;
    type: string;
    _appropriateTypes: string[];
    description: string;
    isRequired: boolean;
    parent: IHasChildren;
    default: string;
    isNullable: boolean;
    _id: string;
    definitionName: string;
    isDefinition: boolean;
    enum: any[];
    isRoot: boolean;
    constructor(json: any, parent: IHasChildren);
    addEnumValue(): void;
    removeEnumValue(index: any): void;
    jsonSchema(): any;
    changeType(targetType: string): this;
    copy(type: string): ISchemaItem;
    hasAppropriateType(): boolean;
    setAppropriateType(): void;
    checkAppropriateType(): void;
}
export declare abstract class SchemaRoot extends SchemaBasic implements IHasChildren {
    isRoot: boolean;
    definitions: {
        [id: string]: ISchemaItem;
    };
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
    jsonSchemaString(): string;
    getDefinitions(): ISchemaItem[];
    addDefinition(): void;
    abstract removeChild(_id: string): any;
    abstract addChild(): void;
    abstract getChildren(): ISchemaItem[];
    abstract replaceChild(newItem: ISchemaItem): void;
}
export declare class SchemaString extends SchemaBasic {
    minLength: number;
    maxLength: number;
    pattern: string;
    format: string;
    _appropriateTypes: string[];
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
}
export declare class SchemaNumeric extends SchemaBasic {
    multipleOf: number;
    minimum: number;
    exclusiveMinimum: boolean;
    maximum: number;
    exclusiveMaximum: boolean;
    _appropriateTypes: string[];
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
}
export declare class SchemaInteger extends SchemaNumeric {
    multipleOf: number;
    minimum: number;
    exclusiveMinimum: boolean;
    maximum: number;
    exclusiveMaximum: boolean;
    _appropriateTypes: string[];
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
}
export declare class SchemaReference extends SchemaBasic {
    $ref: string;
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
}
export declare class SchemaObject extends SchemaRoot implements ISchemaItem {
    requiredItems: String[];
    properties: {
        [id: string]: ISchemaItem;
    };
    schema: string;
    canHaveAdditionalProperties: boolean;
    additionalProperties: any;
    minProperties: number;
    maxProperties: number;
    _appropriateTypes: string[];
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
    removeChild(_id: string): void;
    addChild(): void;
    getChildren(): ISchemaItem[];
    replaceChild(newItem: ISchemaItem): void;
}
export declare class SchemaArray extends SchemaRoot implements ISchemaItem {
    schema: string;
    items: ISchemaItem[];
    additionalItems: boolean;
    minItems: number;
    maxItems: number;
    uniqueItems: boolean;
    isRoot: boolean;
    _appropriateTypes: string[];
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
    removeChild(id: string): void;
    addChild(): void;
    getChildren(): ISchemaItem[];
    replaceChild(newItem: ISchemaItem): void;
}
