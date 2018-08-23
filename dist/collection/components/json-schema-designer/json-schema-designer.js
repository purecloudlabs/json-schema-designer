import { SchemaObject } from './schema';
export class DesignerComponent {
    constructor() {
        this.viewmode = 'designerOnly'; //tabs, columns, designerOnly
        this.debugmode = true;
        this.activeTab = 'designer';
        this._tickle = 0;
    }
    exportSchema() {
        console.log('inside of web component');
        return this.workingSchema.jsonSchemaString();
    }
    componentWillLoad() {
        const testData = {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "title": "Skype for Business Application Properties",
            "description": "Defines the basic configuration for the Skype for Business client",
            "type": "object",
            "properties": {
                "displayType": {
                    "default": "widget",
                    "description": "Dictates the way the application will appear and function inside of PureCloud",
                    "type": "string",
                    "title": "Application Type",
                    "enum": [
                        "widget",
                        "panda",
                        "armpit"
                    ]
                },
                "groupFilter": {
                    "$ref": "#/definitions/purecloudGroupIdFilterList"
                },
                "numbertype": {
                    "default": "widget",
                    "description": "Dictates the way the application will appear and function inside of PureCloud",
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
            "definitions": {
                "purecloudGroupIdFilterList": {
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
                }
            }
        };
        //Load Translations
        if (typeof (this.inputtranslations) === 'string') {
            this.i18n.translations = JSON.parse(this.inputtranslations);
        }
        else if (this.inputtranslations) {
            this.i18n.translations = this.inputtranslations;
        }
        //Load Schema
        let startingSchema = this.debugmode ? testData : {};
        if (typeof (this.inputschema) === 'string') {
            startingSchema = JSON.parse(this.inputschema);
        }
        this.workingSchema = new SchemaObject(startingSchema, null);
    }
    rerender() {
        this._tickle++;
    }
    render() {
        const jsonOutput = this.workingSchema ? this.workingSchema.jsonSchemaString() : "";
        const definitions = this.workingSchema ? this.workingSchema.getDefinitions() : [];
        const designer = (h("div", null,
            h("h5", null,
                " ",
                this.i18n.translate('json-schema-designer.schema'),
                " "),
            h("schema-row", { item: this.workingSchema, parent: this }),
            h("h5", null,
                " ",
                this.i18n.translate('json-schema-designer.definitions'),
                " "),
            definitions.map((definition) => h("schema-row", { item: definition, parent: this })),
            h("div", { class: "text-center" },
                h("button", { class: "btn btn-default btn-xs width100", onClick: () => {
                        this.workingSchema.addDefinition();
                        this.rerender();
                    } },
                    h("i", { class: "fa fa-plus" })))));
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
            "attr": "inputschema"
        },
        "inputtranslations": {
            "type": String,
            "attr": "inputtranslations"
        },
        "viewmode": {
            "type": String,
            "attr": "viewmode"
        }
    }; }
    static get style() { return "/**style-placeholder:json-schema-designer:**/"; }
}
