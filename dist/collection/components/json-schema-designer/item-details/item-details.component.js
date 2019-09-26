export class ItemDetailsComponent {
    constructor() {
        this._tickle = 0;
    }
    rerender() {
        this._tickle++;
        this.parent.rerender();
    }
    componentWillLoad() {
        if (this.item.enum && this.item.enum.length) {
            this.enumCtrlExpanded = true;
        }
    }
    _getDefinitionReferences(definition, prefix) {
        let references = [];
        let name = definition.definitionName || definition.title;
        let reference = prefix + name;
        references.push(reference);
        let children = definition.getChildren ? definition.getChildren() : [];
        children.forEach((child) => {
            references = references.concat(this._getDefinitionReferences(child, reference + '/'));
        });
        return references;
    }
    render() {
        //Item Casts for Specific Fields
        const refItem = this.item;
        const stringItem = this.item;
        const numberItem = this.item;
        const objectItem = this.item;
        const arrayItem = this.item;
        const enums = this.item.enum ? this.item.enum : [];
        let definitionReferences = [];
        this.definitions.forEach((definition) => {
            definitionReferences = definitionReferences.concat(this._getDefinitionReferences(definition, '#/definitions/'));
        });
        const basicFields = (h("div", { class: "col-lg-6 border-right" },
            h("h4", { class: "t_color bold" },
                " ",
                this.i18n.translate('json-schema-designer.general'),
                " "),
            h("form", { class: "form-horizontal", role: "form" },
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.title'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "text", class: "form-control", id: "foldName", value: this.item.title, name: "title", onInput: (event) => {
                                const input = event.target;
                                this.item.title = input.value;
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.description'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("textarea", { class: "form-control", value: this.item.description, onInput: (event) => {
                                const input = event.target;
                                this.item.description = input.value;
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.default'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "text", class: "form-control", value: this.item.default, onInput: (event) => {
                                const input = event.target;
                                this.item.default = input.value;
                                this.rerender();
                            } }))),
                this.item.type === 'null'
                    ? h("div", null)
                    : h("div", null,
                        h("div", { class: "form-group" },
                            h("div", { class: "col-sm-offset-1 col-sm-10" },
                                h("div", { class: "checkbox" },
                                    h("label", null,
                                        h("input", { type: "checkbox", checked: this.item.isRequired, onInput: (event) => {
                                                if (this.item.isRoot)
                                                    return;
                                                const input = event.target;
                                                this.item.isRequired = input.checked;
                                                this.rerender();
                                            }, disabled: this.item.isRoot }),
                                        " ",
                                        this.i18n.translate('json-schema-designer.required'))))),
                        h("div", { class: "form-group" },
                            h("div", { class: "col-sm-offset-1 col-sm-10" },
                                h("div", { class: "checkbox" },
                                    h("label", null,
                                        h("input", { type: "checkbox", checked: this.item.isNullable, onInput: (event) => {
                                                if (this.item.isRoot)
                                                    return;
                                                const input = event.target;
                                                this.item.isNullable = input.checked;
                                                this.rerender();
                                            } }),
                                        " ",
                                        this.i18n.translate('json-schema-designer.nullable'))))),
                        this.item.type !== 'object' ?
                            h("div", { class: "form-group" },
                                h("label", { class: "col-sm-10" },
                                    " ",
                                    this.i18n.translate('json-schema-designer.enumerated-values'),
                                    " "),
                                h("div", { class: "col-sm-10" },
                                    enums.map((enumObject, index) => h("div", { class: "row" },
                                        h("div", { class: "col-sm-8" },
                                            h("input", { type: enumObject.type, class: "form-control input-sm", value: enumObject.value, onInput: (event) => {
                                                    const input = event.target;
                                                    this.item.enum[index].value = input.value;
                                                    this.rerender();
                                                } })),
                                        h("div", { class: "col-sm-3" },
                                            h("select", { class: "form-control input-sm", onInput: (event) => {
                                                    const input = event.target;
                                                    this.item.enum[index].type = input.value;
                                                    this.rerender();
                                                } },
                                                h("option", { value: 'string' }, this.i18n.translate('json-schema-designer.string')),
                                                h("option", { value: 'number' }, this.i18n.translate('json-schema-designer.number')))),
                                        h("div", { class: "col-sm-1" },
                                            h("i", { class: "btn fa fa-times", onClick: () => {
                                                    this.item.removeEnumValue(index);
                                                    this.rerender();
                                                } })))),
                                    h("div", null,
                                        h("button", { type: "button", class: "btn btn-default btn-xs width100", onClick: () => {
                                                this.item.addEnumValue();
                                                this.rerender();
                                            } },
                                            h("i", { class: "fa fa-plus" })))))
                            : h("div", null)))));
        const stringFields = (h("div", { class: "col-lg-6" },
            h("form", { class: "form-horizontal" },
                h("h4", { class: "t_color bold" },
                    " ",
                    this.i18n.translate('json-schema-designer.string'),
                    " "),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.minimum-length')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: stringItem.minLength, min: "1", onInput: (event) => {
                                const input = event.target;
                                stringItem.minLength = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.maximum-length')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: stringItem.maxLength, min: "1", onInput: (event) => {
                                const input = event.target;
                                stringItem.maxLength = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.format'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "text", class: "form-control form-control-sm", value: stringItem.format, onInput: (event) => {
                                const input = event.target;
                                stringItem.format = input.value;
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.pattern'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "text", class: "form-control", value: stringItem.pattern, min: "0", onInput: (event) => {
                                const input = event.target;
                                stringItem.pattern = input.value;
                                this.rerender();
                            } }))))));
        const numberFields = (h("div", { class: "col-lg-6" },
            h("form", { class: "form-horizontal" },
                h("h4", { class: "t_color bold" },
                    " ",
                    this.i18n.translate('json-schema-designer.numeric'),
                    " "),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.minimum')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: numberItem.minimum, onInput: (event) => {
                                const input = event.target;
                                numberItem.minimum = Number(input.value);
                                this.rerender();
                            } })),
                    h("div", { class: "col-sm-offset-1 col-sm-10" },
                        h("div", { class: "checkbox" },
                            h("label", null,
                                h("input", { type: "checkbox", checked: numberItem.exclusiveMinimum, onInput: (event) => {
                                        const input = event.target;
                                        numberItem.exclusiveMinimum = input.checked;
                                        this.rerender();
                                    } }),
                                this.i18n.translate('json-schema-designer.exclusive'))))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.maximum')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: numberItem.maximum, onInput: (event) => {
                                const input = event.target;
                                numberItem.maximum = Number(input.value);
                                this.rerender();
                            } })),
                    h("div", { class: "col-sm-offset-1 col-sm-10" },
                        h("div", { class: "checkbox" },
                            h("label", null,
                                h("input", { type: "checkbox", checked: numberItem.exclusiveMaximum, onInput: (event) => {
                                        const input = event.target;
                                        numberItem.exclusiveMaximum = input.checked;
                                        this.rerender();
                                    } }),
                                " ",
                                this.i18n.translate('json-schema-designer.exclusive'),
                                " ")))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.multiple-of'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: numberItem.multipleOf, onInput: (event) => {
                                const input = event.target;
                                numberItem.multipleOf = Number(input.value);
                                this.rerender();
                            } }))))));
        const objectFields = (h("div", { class: "col-lg-6" },
            h("form", { class: "form-horizontal" },
                h("h4", { class: "t_color bold" },
                    " ",
                    this.i18n.translate('json-schema-designer.object'),
                    " "),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.schema'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "text", class: "form-control", value: objectItem.schema, onInput: (event) => {
                                const input = event.target;
                                objectItem.schema = input.value;
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.minimum-properties')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: objectItem.minProperties, min: "1", onInput: (event) => {
                                const input = event.target;
                                objectItem.minProperties = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.maximum-properties')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: objectItem.maxProperties, min: "1", onInput: (event) => {
                                const input = event.target;
                                objectItem.maxProperties = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("div", { class: "col-sm-10" },
                        h("div", { class: "checkbox" },
                            h("label", null,
                                h("input", { type: "checkbox", checked: objectItem.canHaveAdditionalProperties, onInput: (event) => {
                                        const input = event.target;
                                        objectItem.canHaveAdditionalProperties = input.checked;
                                        this.rerender();
                                    } }),
                                this.i18n.translate('json-schema-designer.allow-additional-properties'))))))));
        const arrayFields = (h("div", { class: "col-lg-6" },
            h("form", { class: "form-horizontal" },
                h("h4", { class: "t_color bold" },
                    " ",
                    this.i18n.translate('json-schema-designer.array'),
                    " "),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.minimum-items')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: arrayItem.minItems, min: "1", onInput: (event) => {
                                const input = event.target;
                                arrayItem.minItems = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" }, this.i18n.translate('json-schema-designer.maximum-items')),
                    h("div", { class: "col-sm-10" },
                        h("input", { type: "number", class: "form-control", value: arrayItem.maxItems, min: "1", onInput: (event) => {
                                const input = event.target;
                                arrayItem.maxItems = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("div", { class: "col-sm-10" },
                        h("div", { class: "checkbox" },
                            h("label", null,
                                h("input", { type: "checkbox", checked: arrayItem.uniqueItems, onInput: (event) => {
                                        const input = event.target;
                                        arrayItem.uniqueItems = input.checked;
                                        this.rerender();
                                    } }),
                                this.i18n.translate('json-schema-designer.unique-items'))))),
                h("div", { class: "form-group" },
                    h("div", { class: "col-sm-10" },
                        h("div", { class: "checkbox" },
                            h("label", null,
                                h("input", { type: "checkbox", checked: arrayItem.additionalItems, onInput: (event) => {
                                        const input = event.target;
                                        arrayItem.additionalItems = input.checked;
                                        this.rerender();
                                    } }),
                                this.i18n.translate('json-schema-designer.additional-items'))))))));
        const refFields = (h("div", { class: "col-lg-12" },
            h("form", { class: "form-horizontal" },
                h("div", { class: "form-group" },
                    h("label", { class: "col-sm-10" },
                        " ",
                        this.i18n.translate('json-schema-designer.reference'),
                        " "),
                    h("div", { class: "col-sm-10" },
                        h("select", { class: "form-control input-sm", onInput: (event) => {
                                const input = event.target;
                                const definitionName = input.value;
                                refItem.$ref = definitionName;
                                this.rerender();
                            } },
                            h("option", { value: "", disabled: true, selected: !refItem.$ref }, this.i18n.translate('json-schema-designer.select-definition')),
                            definitionReferences.map((name) => h("option", null,
                                h("option", { selected: refItem.$ref === name }, name)))))))));
        let typeSpecificFields;
        switch (this.item.type) {
            case 'string':
                typeSpecificFields = stringFields;
                break;
            case 'integer':
            case 'number':
                typeSpecificFields = numberFields;
                break;
            case 'object':
                typeSpecificFields = objectFields;
                break;
            case 'array':
                typeSpecificFields = arrayFields;
                break;
            default:
                typeSpecificFields = ("");
        }
        return (h("div", { class: "model-det-cont container" }, this.item.type === '$ref'
            ? h("div", { class: "row" }, refFields)
            : h("div", { class: "row" },
                basicFields,
                typeSpecificFields)));
    }
    static get is() { return "item-details"; }
    static get properties() { return {
        "_tickle": {
            "state": true
        },
        "definitions": {
            "type": "Any",
            "attr": "definitions"
        },
        "enumCtrlExpanded": {
            "state": true
        },
        "i18n": {
            "context": "i18n"
        },
        "item": {
            "type": "Any",
            "attr": "item"
        },
        "parent": {
            "type": "Any",
            "attr": "parent"
        }
    }; }
}
