import { SchemaObject } from './schema';
export class DesignerComponent {
    constructor() {
        this.viewMode = 'tabs';
        this.activeTab = 'designer';
        this._tickle = 0;
    }
    exportSchema() {
        this.outputSchemaCallback && this.outputSchemaCallback(this.workingSchema.jsonSchemaString());
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
        this.workingSchema = this.inputSchema ? new SchemaObject(this.inputSchema, null) : new SchemaObject(testData, null);
        if (this.inputTranslations)
            this.i18n.transtions = this.inputTranslations;
    }
    componentDidLoad() {
        $('[data-toggle="tooltip"]').tooltip();
    }
    rerender() {
        this._tickle++;
    }
    render() {
        const jsonOutput = this.workingSchema ? this.workingSchema.jsonSchemaString() : "";
        const definitions = this.workingSchema ? this.workingSchema.getDefinitions() : [];
        if (this.viewMode === 'tabs') {
            const desingerPillClass = this.activeTab === 'designer' ? 'nav-link active' : 'nav-link';
            const outputPillClass = this.activeTab === 'output' ? 'nav-link active' : 'nav-link';
            return (h("div", { class: "json-schema-builder container" },
                h("div", { class: "p-3" },
                    h("ul", { class: "nav nav-pills justify-content-center" },
                        h("li", { class: "btn nav-item" },
                            h("div", { class: desingerPillClass, onClick: () => { this.activeTab = 'designer'; } }, " Designer ")),
                        h("li", { class: "btn nav-item" },
                            h("div", { class: outputPillClass, onClick: () => { this.activeTab = 'output'; } }, " Output ")))),
                h("div", { class: "row" }, this.activeTab === 'designer'
                    ? h("div", { class: "col-lg-12" },
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
                            h("button", { class: "btn btn-secondary btn-sm", onClick: () => {
                                    this.workingSchema.addDefinition();
                                    this.rerender();
                                } },
                                h("i", { class: "fas fa-plus" }),
                                " ",
                                this.i18n.translate('json-schema-designer.add-definition'))))
                    : h("div", { class: "col-lg-12" },
                        h("div", { class: "card card-body bg-light" },
                            h("div", { class: "text-center" },
                                h("button", { class: "btn btn-secondary btn-sm", onClick: () => this.exportSchema() },
                                    " ",
                                    this.i18n.translate('json-schema-designer.export'),
                                    " ")),
                            h("pre", null,
                                " ",
                                jsonOutput))))));
        }
        else if (this.viewMode === 'columns') {
            return (h("div", { class: "json-schema-builder container" },
                h("div", { class: "row" },
                    h("div", { class: "col-lg-6" },
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
                            h("button", { class: "btn btn-secondary btn-sm", onClick: () => {
                                    this.workingSchema.addDefinition();
                                    this.rerender();
                                } },
                                h("i", { class: "fas fa-plus" }),
                                " ",
                                this.i18n.translate('json-schema-designer.add-definition')))),
                    h("div", { class: "col-lg-6" },
                        h("div", { class: "card card-body bg-light" },
                            h("div", { class: "text-center" },
                                h("button", { class: "btn btn-secondary btn-sm", onClick: () => this.exportSchema() },
                                    " ",
                                    this.i18n.translate('json-schema-designer.export'),
                                    " ")),
                            h("pre", null,
                                " ",
                                jsonOutput))))));
        }
        else {
            console.error('view mode:', '"' + this.viewMode + '"', 'not supported');
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
        "i18n": {
            "context": "i18n"
        },
        "inputSchema": {
            "type": "Any",
            "attr": "input-schema"
        },
        "inputTranslations": {
            "type": "Any",
            "attr": "input-translations"
        },
        "outputSchemaCallback": {
            "type": "Any",
            "attr": "output-schema-callback"
        },
        "viewMode": {
            "type": String,
            "attr": "view-mode"
        }
    }; }
    static get style() { return "/**style-placeholder:json-schema-designer:**/"; }
}
