import { createAppropriateSchemaItem } from './schema';
const TEST_DEFINITIONS = {
    "genesysCloudIdFilterList": {
        "type": [
            "null",
            "array"
        ],
        "title": "Group Filtering",
        "description": "Limit visibility of permissioned users to selected groups. Leaving blank will allow visibility for all users in this integration's defined permissions.",
        "items": {
            "type": "string",
            "title": "Group GUID",
            "pattern": "^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$"
        }
    },
    "definition2": {
        "type": [
            "string"
        ],
        "title": "definition2",
        "description": "this is a definition"
    }
};
const TEST_SCHEMAS = [
    {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Skype for Business Application Properties",
        "description": "Defines the basic configuration for the Skype for Business client",
        "type": "object",
        "properties": {
            "displayType": {
                "default": "widget",
                "description": "Dictates the way the application will appear and function inside of Genesys Cloud",
                "type": "string",
                "title": "Application Type",
                "enum": [
                    "widget",
                    "panda",
                    "armpit"
                ]
            },
            "groupFilter": {
                "$ref": "#/definitions/genesysCloudGroupIdFilterList"
            },
            "numbertype": {
                "default": "widget",
                "description": "Dictates the way the application will appear and function inside of Genesys Cloud",
                "type": "number",
                "title": "Application Type",
                "enum": [
                    1,
                    2,
                    3
                ]
            }
        },
        "additionalProperties": false,
        "displayOrder": [
            "displayType",
            "groupFilter"
        ],
        "definitions": TEST_DEFINITIONS
    },
    {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "array",
        "properties": {},
        "items": {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "title": "Account",
            "type": "object",
            "description": "A Salesforce account.",
            "required": ["Id"],
            "properties": {
                "Id": {
                    "type": "string",
                    "description": "The ID of the account."
                },
                "Name": {
                    "type": "string",
                    "description": "The name of the account."
                },
                "AccountNumber": {
                    "type": "string",
                    "description": "The account number."
                },
                "Phone": {
                    "type": "string",
                    "description": "The phone number associated with the account."
                },
                "BillingStreet": { "type": "string", "description": "The billing street address." }, "BillingCity": { "type": "string", "description": "The billing city." }, "BillingState": { "type": "string", "description": "The billing state." }, "BillingPostalCode": { "type": "string", "description": "The billing postal code." }, "BillingCountry": { "type": "string", "description": "The billing country." }, "ShippingStreet": { "type": "string", "description": "The shipping street address." }, "ShippingCity": { "type": "string", "description": "The shipping city." }, "ShippingState": { "type": "string", "description": "The shipping state." }, "ShippingPostalCode": { "type": "string", "description": "The shipping postal code." }, "ShippingCountry": { "type": "string", "description": "The shipping country." }
            }
        }
    },
    {}
];
export class DesignerComponent {
    constructor() {
        this.viewmode = 'columns'; //tabs, columns, designerOnly
        this.debugmode = false;
        this.usedefinitions = true;
        this.usenullable = true;
        this.activeTab = 'designer';
        this._tickle = 0;
        this.lastOutput = '';
    }
    exportSchema() {
        try {
            return this.workingSchema.jsonSchemaString();
        }
        catch (e) {
            this.error.emit(e);
        }
    }
    watchHandler() {
        this._loadSchema();
    }
    componentWillLoad() {
        //Load Translations
        if (typeof (this.inputtranslations) === 'string') {
            this.i18n.translations = JSON.parse(this.inputtranslations);
        }
        else if (this.inputtranslations) {
            this.i18n.translations = this.inputtranslations;
        }
        //Load Schema
        this._loadSchema();
    }
    rerender() {
        this._tickle++;
    }
    changeRootType(type) {
        //grab definitions
        let definitions = this.workingSchema.definitions || {};
        let newRoot = this.workingSchema.copy(type);
        newRoot.definitions = definitions;
        Object.values(definitions).forEach((definition) => {
            definition.parent = newRoot;
        });
        this.workingSchema = newRoot;
    }
    _loadSchema() {
        let startingSchema = this.debugmode ? TEST_SCHEMAS[0] : this.inputschema;
        try {
            if (typeof (startingSchema) === 'string') {
                startingSchema = JSON.parse(startingSchema);
            }
            if (startingSchema.type !== 'object' && startingSchema.type !== 'array') {
                throw new Error('root schema must have type object or array. Loading empty object schema');
            }
            this.workingSchema = createAppropriateSchemaItem(startingSchema, null);
        }
        catch (error) {
            this.error.emit(error);
            startingSchema = { type: 'object' };
            this.workingSchema = createAppropriateSchemaItem(startingSchema, null);
        }
    }
    render() {
        const jsonOutput = this.workingSchema ? this.workingSchema.jsonSchemaString() : "";
        if (this.lastOutput !== jsonOutput) {
            this.lastOutput = jsonOutput;
            this.change.emit(jsonOutput);
        }
        const definitions = this.workingSchema ? this.workingSchema.getDefinitions() : [];
        const dataTypes = this.datatypes ? (this.datatypes instanceof Array ? this.datatypes : JSON.parse(this.datatypes)) : ['string', 'number', 'integer', 'object', 'array', 'boolean', 'null', '$ref'];
        const useNullable = this.usenullable;
        const designer = (h("div", null,
            h("h5", null,
                " ",
                this.i18n.translate('json-schema-designer.schema'),
                " "),
            h("schema-row", { item: this.workingSchema, parent: this, definitions: definitions, dataTypeArray: dataTypes, usenullable: useNullable }),
            definitions.length
                ? h("div", null,
                    h("h5", null,
                        " ",
                        this.i18n.translate('json-schema-designer.definitions'),
                        " "),
                    definitions.map((definition) => h("schema-row", { item: definition, parent: this, definitions: definitions, dataTypeArray: dataTypes, usenullable: useNullable })))
                : h("div", null),
            this.usedefinitions ?
                h("div", { class: "row" },
                    h("div", { class: "col-sm-12" },
                        h("button", { class: "btn btn-link btn-xs pull-right", onClick: () => {
                                this.workingSchema.addDefinition();
                                this.rerender();
                            } },
                            h("span", null,
                                " ",
                                this.i18n.translate('json-schema-designer.add-definition'),
                                " "),
                            h("i", { class: "fa fa-plus" }))))
                : h("div", { class: "row" })));
        if (this.viewmode === 'tabs') {
            const desingerPillClass = this.activeTab === 'designer' ? 'btn btn-primary' : 'btn btn-default';
            const outputPillClass = this.activeTab === 'output' ? 'btn btn-primary' : 'btn btn-default';
            return (h("div", { id: "json-schema-designer", class: "container" },
                h("div", { class: "row" },
                    h("div", { class: "tabs" },
                        h("div", { class: desingerPillClass, onClick: () => { this.activeTab = 'designer'; } }, " Designer "),
                        h("div", { class: outputPillClass, onClick: () => { this.activeTab = 'output'; } }, " Output "))),
                h("div", { class: "row" }, this.activeTab === 'designer'
                    ? h("div", { class: "col-lg-12" }, designer)
                    : h("div", { class: "col-lg-12" },
                        h("pre", null,
                            " ",
                            jsonOutput)))));
        }
        else if (this.viewmode === 'columns') {
            return (h("div", { id: "json-schema-designer", class: "container" },
                h("div", { class: "row" },
                    h("div", { class: "col-lg-6" }, designer),
                    h("div", { class: "col-lg-6" },
                        h("pre", null,
                            " ",
                            jsonOutput)))));
        }
        else if (this.viewmode === 'designerOnly') {
            return (h("div", { id: "json-schema-designer", class: "container" },
                h("div", { class: "row" },
                    h("div", { class: "col-lg-12" }, designer))));
        }
        else {
            console.error('view mode:', '"' + this.viewmode + '"', 'not supported');
            return (h("div", { class: "container" },
                h("h4", { class: 'text-danger' },
                    " ",
                    this.i18n.translate('json-schema-designer.view-mode-not-supported'))));
        }
    }
    static get is() { return "json-schema-designer"; }
    static get properties() { return {
        "_tickle": {
            "state": true
        },
        "activeTab": {
            "state": true
        },
        "datatypes": {
            "type": "Any",
            "attr": "datatypes"
        },
        "debugmode": {
            "type": Boolean,
            "attr": "debugmode"
        },
        "exportSchema": {
            "method": true
        },
        "i18n": {
            "context": "i18n"
        },
        "inputschema": {
            "type": String,
            "attr": "inputschema",
            "watchCallbacks": ["watchHandler"]
        },
        "inputtranslations": {
            "type": String,
            "attr": "inputtranslations"
        },
        "usedefinitions": {
            "type": Boolean,
            "attr": "usedefinitions"
        },
        "usenullable": {
            "type": Boolean,
            "attr": "usenullable"
        },
        "viewmode": {
            "type": String,
            "attr": "viewmode"
        }
    }; }
    static get events() { return [{
            "name": "error",
            "method": "error",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }, {
            "name": "change",
            "method": "change",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get style() { return "/**style-placeholder:json-schema-designer:**/"; }
}
