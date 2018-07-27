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
    replaceChild(newItem: ISchemaItem): any;
}
export declare class SchemaBasic implements ISchemaItem {
    title: string;
    type: string;
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
    changeType(targetType: string): void;
}
export declare class SchemaString extends SchemaBasic {
    minLength: number;
    maxLength: number;
    pattern: string;
    format: string;
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
}
export declare class SchemaNumeric extends SchemaBasic {
    multipleOf: number;
    minimum: number;
    exclusiveMinimum: boolean;
    maximum: number;
    exclusiveMaximum: boolean;
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
}
export declare class SchemaReference extends SchemaBasic {
    $ref: string;
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
}
export declare class SchemaObject extends SchemaBasic implements ISchemaItem, IHasChildren {
    requiredItems: String[];
    properties: {
        [id: string]: ISchemaItem;
    };
    isRoot: boolean;
    schema: string;
    definitions: {
        [id: string]: ISchemaItem;
    };
    canHaveAdditionalProperties: boolean;
    additionalProperties: any;
    minProperties: number;
    maxProperties: number;
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
    jsonSchemaString(): string;
    removeChild(_id: string): void;
    addChild(): void;
    getChildren(): ISchemaItem[];
    replaceChild(newItem: ISchemaItem): void;
    getDefinitions(): ISchemaItem[];
    addDefinition(): void;
}
export declare class SchemaArray extends SchemaBasic implements ISchemaItem, IHasChildren {
    schema: string;
    items: ISchemaItem[];
    additionalItems: boolean;
    minItems: number;
    maxItems: number;
    uniqueItems: boolean;
    constructor(json: any, parent: IHasChildren);
    jsonSchema(): any;
    removeChild(id: string): void;
    addChild(): void;
    getChildren(): ISchemaItem[];
    replaceChild(newItem: ISchemaItem): void;
}
