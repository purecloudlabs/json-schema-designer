export function createAppropriateSchemaItem(json, parent) {
    if (json.$ref || json.type === '$ref') {
        return new SchemaReference(json, parent);
    }
    else {
        let mainType;
        if (Array.isArray(json.type)) {
            mainType = json.type.find((item) => {
                return item !== 'null';
            });
        }
        else {
            mainType = json.type;
        }
        switch (mainType) {
            case 'object':
                return new SchemaObject(json, parent);
            case 'array':
                return new SchemaArray(json, parent);
            case 'string':
                return new SchemaString(json, parent);
            case 'integer':
            case 'number':
                return new SchemaNumeric(json, parent);
            default:
                return new SchemaBasic(json, parent);
        }
    }
}
;
function _generateId() {
    let placeholder = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return placeholder.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
export class SchemaBasic {
    constructor(json, parent) {
        if (json._id) {
            this._id = json._id;
        }
        else {
            this._id = _generateId();
        }
        this.title = json.title;
        this.description = json.description;
        this.parent = parent;
        isRoot: false;
        this.default = json.default;
        this.isRequired = json.isRequired || false;
        this.definitionName = json.definitionName;
        this.isDefinition = json.isDefinition;
        // construct enum array
        this.enum = [];
        if (json.enum) {
            json.enum.forEach((enumValue) => {
                this.enum.push({
                    value: enumValue,
                    type: typeof (enumValue)
                });
            });
        }
        // handle types
        if (Array.isArray(json.type)) {
            if (json.type.length > 2) {
                console.error('more than two types not supported');
            }
            if (json.type.length === 2 && !json.type.includes('null')) {
                console.error('multiple types can only include null and an additional value');
            }
            json.type.forEach((typeItem) => {
                if (typeItem === 'null') {
                    this.isNullable = true;
                }
                else {
                    this.type = typeItem;
                }
            });
        }
        else {
            this.type = json.type || 'string';
        }
    }
    addEnumValue() {
        this.enum.push({});
    }
    removeEnumValue(index) {
        this.enum.splice(index, 1);
    }
    jsonSchema() {
        let output = {
            title: this.title ? this.title : undefined,
            description: this.description ? this.description : undefined,
            default: this.default ? this.default : undefined,
        };
        if (this.isNullable) {
            output.type = [this.type, 'null'];
        }
        else {
            output.type = this.type;
        }
        if (this.enum && this.enum.length) {
            output.enum = this.enum.map((enumObject) => {
                if (enumObject.type === "number") {
                    return Number(enumObject.value);
                }
                else {
                    return enumObject.value;
                }
            });
        }
        return output;
    }
    changeType(targetType) {
        const complexTypes = [
            'string',
            'number',
            'integer',
            'object',
            'array',
            '$ref'
        ];
        if (targetType === this.type) {
            return this;
        }
        const needToCreateNewObject = complexTypes.includes(this.type) || complexTypes.includes(targetType);
        if (needToCreateNewObject) {
            const valuesToCopy = {
                title: this.title,
                description: this.description,
                type: targetType,
                isRequired: this.isRequired,
                _id: this._id,
                definitionName: this.definitionName,
                isDefinition: this.isDefinition
            };
            let newObject = createAppropriateSchemaItem(valuesToCopy, this.parent);
            this.parent.replaceChild(newObject);
        }
        else {
            this.type = targetType;
        }
    }
    copy(type) {
        const valuesToCopy = {
            title: this.title,
            description: this.description,
            type: type || this.type,
            isRequired: this.isRequired,
            _id: this._id
        };
        return createAppropriateSchemaItem(valuesToCopy, this.parent);
    }
}
export class SchemaRoot extends SchemaBasic {
    constructor(json, parent) {
        super(json, parent);
        this.isRoot = !parent;
        this.isRequired = this.isRoot;
        if (json.definitions) {
            this.definitions = {};
            Object.entries(json.definitions).forEach((keyVal) => {
                const key = keyVal[0];
                const value = keyVal[1];
                value.definitionName = key;
                value.isDefinition = true;
                const definition = createAppropriateSchemaItem(value, this);
                this.definitions[definition._id] = definition;
            });
        }
    }
    jsonSchema() {
        let output = super.jsonSchema();
        if (this.definitions && Object.values(this.definitions).length) {
            output.definitions = {};
            Object.entries(this.definitions).forEach((keyValue) => {
                const value = keyValue[1];
                output.definitions[value.definitionName] = value.jsonSchema();
            });
        }
        return output;
    }
    jsonSchemaString() {
        return JSON.stringify(this.jsonSchema(), null, 2);
    }
    getDefinitions() {
        return this.definitions ? Object.values(this.definitions) : [];
    }
    addDefinition() {
        if (!this.definitions)
            this.definitions = {};
        const newDef = new SchemaBasic({}, this);
        newDef.isDefinition = true;
        this.definitions[newDef._id] = newDef;
    }
}
export class SchemaString extends SchemaBasic {
    constructor(json, parent) {
        super(json, parent);
        this.minLength = json.minLength;
        this.maxLength = json.maxLength;
        this.pattern = json.pattern;
        this.format = json.format;
    }
    jsonSchema() {
        let output = super.jsonSchema();
        output.minLength = this.minLength ? this.minLength : undefined;
        output.maxLength = this.maxLength ? this.maxLength : undefined;
        output.pattern = this.pattern ? this.pattern : undefined;
        output.format = this.format ? this.format : undefined;
        return output;
    }
}
export class SchemaNumeric extends SchemaBasic {
    constructor(json, parent) {
        super(json, parent);
        this.multipleOf = json.multipleOf;
        this.minimum = json.minimum;
        this.exclusiveMinimum = json.exclusiveMinimum;
        this.maximum = json.maximum;
        this.exclusiveMaximum = json.exclusiveMaximum;
    }
    jsonSchema() {
        let output = super.jsonSchema();
        output.multipleOf = this.multipleOf ? this.multipleOf : undefined;
        output.minimum = this.minimum ? this.minimum : undefined;
        output.exclusiveMinimum = this.exclusiveMinimum ? this.exclusiveMinimum : undefined;
        output.maximum = this.maximum ? this.maximum : undefined;
        output.exclusiveMaximum = this.exclusiveMaximum ? this.exclusiveMaximum : undefined;
        return output;
    }
}
export class SchemaReference extends SchemaBasic {
    constructor(json, parent) {
        super(json, parent);
        this.$ref = json.$ref;
        this.type = '$ref';
    }
    jsonSchema() {
        return {
            $ref: this.$ref
        };
    }
}
export class SchemaObject extends SchemaRoot {
    //dependancies: any; TODO: Advanced Feature
    constructor(json, parent) {
        super(json, parent);
        this.type = 'object';
        this.schema = json.$schema;
        this.properties = {};
        if (typeof (json.additionalProperties) === 'boolean') {
            this.canHaveAdditionalProperties = json.additionalProperties;
        }
        else if (json.additionalProperties) {
            this.canHaveAdditionalProperties = true;
            this.additionalProperties = json.additionalProperties;
        }
        else {
            this.canHaveAdditionalProperties = true;
        }
        this.minProperties = json.minProperties;
        this.maxProperties = json.maxProperties;
        if (json.properties) {
            Object.entries(json.properties).forEach((entry) => {
                let key = entry[0];
                let value = entry[1];
                value.title = key;
                const newProperty = createAppropriateSchemaItem(value, this);
                this.properties[newProperty._id] = newProperty;
            });
        }
        if (json.required) {
            json.required.forEach((requiredItemName) => {
                let requiredItem = Object.values(this.properties).find((property) => {
                    return property.title === requiredItemName;
                });
                if (!requiredItem) {
                    const error = new ErrorEvent('error', { message: 'required items must exist as properties. Item: ' + requiredItemName, error: new Error('required items must exist as properties. Item: ' + requiredItemName) });
                    document.querySelector('#output-schema-designer').dispatchEvent(error);
                }
                else {
                    requiredItem.isRequired = true;
                }
            });
        }
    }
    jsonSchema() {
        let output = super.jsonSchema();
        output.$schema = this.schema ? this.schema : undefined;
        output.required = [];
        output.properties = {};
        output.minProperties = this.minProperties ? this.minProperties : undefined;
        output.maxProperties = this.maxProperties ? this.maxProperties : undefined;
        output.additionalProperties = this.additionalProperties ? this.additionalProperties : this.canHaveAdditionalProperties;
        Object.values(this.properties).forEach((property) => {
            output.properties[property.title] = property.jsonSchema();
            delete output.properties[property.title].title;
            if (property.isRequired) {
                output.required.push(property.title);
            }
        });
        if (output.required.length === 0) {
            delete output.required;
        }
        return output;
    }
    removeChild(_id) {
        if (this.properties[_id]) {
            delete this.properties[_id];
        }
        else if (this.definitions[_id]) {
            delete this.definitions[_id];
        }
    }
    addChild() {
        const newProp = new SchemaBasic({}, this);
        this.properties[newProp._id] = newProp;
    }
    getChildren() {
        return Object.values(this.properties) || [];
    }
    replaceChild(newItem) {
        if (this.properties[newItem._id]) {
            this.properties[newItem._id] = newItem;
        }
        else if (this.definitions[newItem._id]) {
            this.definitions[newItem._id] = newItem;
        }
    }
}
export class SchemaArray extends SchemaRoot {
    constructor(json, parent) {
        super(json, parent);
        this.schema = json.$schema;
        this.items = [];
        let items = json.items || { title: 'Item 1' };
        items = items.length ? items : [items];
        items.forEach((item) => {
            this.items.push(createAppropriateSchemaItem(item, this));
        });
    }
    jsonSchema() {
        let output = super.jsonSchema();
        output.$schema = this.schema;
        output.additionalItems = this.additionalItems;
        output.minItems = this.minItems ? this.minItems : undefined;
        output.maxItems = this.maxItems ? this.maxItems : undefined;
        output.uniqueItems = this.uniqueItems;
        if (this.items.length) {
            if (this.items.length > 1) {
                output['items'] = [];
                this.items.forEach((item) => {
                    output['items'].push(item.jsonSchema());
                });
            }
            else {
                output['items'] = this.items[0].jsonSchema();
            }
        }
        return output;
    }
    removeChild(id) {
        let itemRemoved = false;
        this.items = this.items.filter((item) => {
            if (item._id = id) {
                itemRemoved = true;
            }
            return item._id != id;
        });
        if (this.definitions && this.definitions[id]) {
            itemRemoved = true;
            delete this.definitions[id];
        }
        if (!itemRemoved) {
            console.error('failed to remove child', 'child id', id, 'parent', this);
        }
    }
    addChild() {
        const title = 'Item ' + (this.getChildren().length + 1);
        this.items.push(new SchemaBasic({ title }, this));
    }
    getChildren() {
        return this.items;
    }
    replaceChild(newItem) {
        this.items.forEach((item, index) => {
            if (item.title === newItem.title) {
                this.items[index] = newItem;
            }
            else if (this.definitions[newItem._id]) {
                this.definitions[newItem._id] = newItem;
            }
        });
    }
}
