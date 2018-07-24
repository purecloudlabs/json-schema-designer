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
    render() {
        //computed classes
        const requiredCheckBoxStyle = this.item.isRoot ? 'form-check disabled' : 'form-check'; //TODO: style="padding: 2px 0;"
        //Item Casts for Specific Fields
        const refItem = this.item;
        const stringItem = this.item;
        const numberItem = this.item;
        const objectItem = this.item;
        const arrayItem = this.item;
        const enums = this.item.enum ? this.item.enum : [];
        const basicFields = (h("div", { class: "col border-right" },
            h("div", { class: "t_color bold" },
                " ",
                this.i18n.translate('json-schema-designer.general'),
                " "),
            h("div", null,
                h("form", { class: "form-horizontal form-compact model-detail-form", name: "detailForm", role: "form" },
                    h("div", { class: "form-group" },
                        h("label", { class: "control-label col-xs-2" },
                            " ",
                            this.i18n.translate('json-schema-designer.title'),
                            " "),
                        h("div", { class: "col-xs-9" },
                            h("input", { type: "text", class: "form-control sm detail-ip", id: "foldName", value: this.item.title, name: "title", onInput: (event) => {
                                    const input = event.target;
                                    this.item.title = input.value;
                                    this.rerender();
                                } }))),
                    h("div", { class: "form-group" },
                        h("label", { class: "control-label col-xs-2" },
                            " ",
                            this.i18n.translate('json-schema-designer.description'),
                            " "),
                        h("div", { class: "col-xs-9" },
                            h("textarea", { class: "form-control", value: this.item.description, onInput: (event) => {
                                    const input = event.target;
                                    this.item.description = input.value;
                                    this.rerender();
                                } }))),
                    h("div", { class: "form-group" },
                        h("label", { class: "control-label col-xs-2" },
                            " ",
                            this.i18n.translate('json-schema-designer.default'),
                            " "),
                        h("div", { class: "col-xs-9" },
                            h("input", { type: "text", class: "form-control sm detail-ip", value: this.item.default, onInput: (event) => {
                                    const input = event.target;
                                    this.item.default = input.value;
                                    this.rerender();
                                } }))),
                    this.item.type === 'null'
                        ? h("div", null)
                        : h("div", null,
                            h("div", { class: requiredCheckBoxStyle },
                                h("label", null,
                                    h("input", { type: "checkbox", checked: this.item.isRequired, onInput: (event) => {
                                            if (this.item.isRoot)
                                                return;
                                            const input = event.target;
                                            this.item.isRequired = input.checked;
                                            this.rerender();
                                        } }),
                                    " ",
                                    this.i18n.translate('json-schema-designer.required'),
                                    " ")),
                            h("div", { class: "form-check" },
                                h("label", null,
                                    h("input", { type: "checkbox", checked: this.item.isNullable, onInput: (event) => {
                                            if (this.item.isRoot)
                                                return;
                                            const input = event.target;
                                            this.item.isNullable = input.checked;
                                            this.rerender();
                                        } }),
                                    " ",
                                    this.i18n.translate('json-schema-designer.nullable'),
                                    " ")),
                            h("div", null,
                                h("div", { class: "enum-control-bar", onClick: () => {
                                        this.enumCtrlExpanded = !this.enumCtrlExpanded;
                                    } },
                                    this.enumCtrlExpanded
                                        ? h("i", { class: "btn fas fa-chevron-down" })
                                        : h("i", { class: "btn fas fa-chevron-right" }),
                                    h("label", null,
                                        " ",
                                        this.i18n.translate('json-schema-designer.enumerated-values'),
                                        " ")),
                                this.enumCtrlExpanded
                                    ? h("div", null,
                                        enums.map((enumObject, index) => h("div", { class: "enum-row" },
                                            h("input", { type: enumObject.type, class: "form-control form-control-sm", value: enumObject.value, onInput: (event) => {
                                                    const input = event.target;
                                                    this.item.enum[index].value = input.value;
                                                    this.rerender();
                                                } }),
                                            h("select", { class: "custom-select custom-select-sm", onInput: (event) => {
                                                    const input = event.target;
                                                    this.item.enum[index].type = input.value;
                                                    this.rerender();
                                                } },
                                                h("option", { value: 'string' }, this.i18n.translate('json-schema-designer.string')),
                                                h("option", { value: 'number' }, this.i18n.translate('json-schema-designer.number'))),
                                            h("i", { class: "btn fas fa-times", onClick: () => {
                                                    this.item.removeEnumValue(index);
                                                    this.rerender();
                                                } }))),
                                        h("div", { class: "text-center" },
                                            h("button", { type: "button", class: "btn btn-secondary btn-sm", onClick: () => {
                                                    this.item.addEnumValue();
                                                    this.rerender();
                                                } },
                                                h("i", { class: "fas fa-plus" }),
                                                this.i18n.translate('json-schema-designer.add-value'))))
                                    : h("div", null)))))));
        const stringFields = (h("div", { class: "col" },
            h("form", null,
                h("div", { class: "t_color bold" },
                    " ",
                    this.i18n.translate('json-schema-designer.numeric'),
                    " "),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-8 col-form-label" },
                        this.i18n.translate('json-schema-designer.minimum-length'),
                        ":"),
                    h("div", { class: "col-sm-4" },
                        h("input", { type: "number", class: "form-control form-control-sm", value: stringItem.minLength, min: "1", onInput: (event) => {
                                const input = event.target;
                                stringItem.minLength = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-8 col-form-label" }, this.i18n.translate('json-schema-designer.maximum-length')),
                    h("div", { class: "col-sm-4" },
                        h("input", { type: "number", class: "form-control form-control-sm", value: stringItem.maxLength, min: "1", onInput: (event) => {
                                const input = event.target;
                                stringItem.maxLength = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("label", null,
                        " ",
                        this.i18n.translate('json-schema-designer.format'),
                        ": "),
                    h("input", { type: "text", class: "form-control form-control-sm", value: stringItem.format, onInput: (event) => {
                            const input = event.target;
                            stringItem.format = input.value;
                            this.rerender();
                        } })),
                h("div", { class: "form-group" },
                    h("label", null,
                        " ",
                        this.i18n.translate('json-schema-designer.pattern'),
                        ": "),
                    h("input", { type: "text", class: "form-control form-control-sm", value: stringItem.pattern, min: "0", onInput: (event) => {
                            const input = event.target;
                            stringItem.pattern = input.value;
                            this.rerender();
                        } })))));
        const numberFields = (h("div", { class: "col" },
            h("form", null,
                h("div", { class: "t_color bold" },
                    " ",
                    this.i18n.translate('json-schema-designer.numeric'),
                    " "),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-6 col-form-label" }, this.i18n.translate('json-schema-designer.minimum')),
                    h("div", { class: "col-sm-6 " },
                        h("input", { type: "number", class: "form-control form-control-sm", value: numberItem.minimum, onInput: (event) => {
                                const input = event.target;
                                numberItem.minimum = Number(input.value);
                                this.rerender();
                            } })),
                    h("div", { class: "form-check" },
                        h("label", null,
                            h("input", { type: "checkbox", checked: numberItem.exclusiveMinimum, onInput: (event) => {
                                    const input = event.target;
                                    numberItem.exclusiveMinimum = input.checked;
                                    this.rerender();
                                } }),
                            " ",
                            this.i18n.translate('json-schema-designer.exclusive'),
                            " "))),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-6 col-form-label" }, this.i18n.translate('json-schema-designer.maximum')),
                    h("div", { class: "col-sm-6 " },
                        h("input", { type: "number", class: "form-control form-control-sm", value: numberItem.maximum, onInput: (event) => {
                                const input = event.target;
                                numberItem.maximum = Number(input.value);
                                this.rerender();
                            } })),
                    h("div", { class: "form-check" },
                        h("label", null,
                            h("input", { type: "checkbox", checked: numberItem.exclusiveMaximum, onInput: (event) => {
                                    const input = event.target;
                                    numberItem.exclusiveMaximum = input.checked;
                                    this.rerender();
                                } }),
                            " ",
                            this.i18n.translate('json-schema-designer.exclusive'),
                            " "))),
                h("div", { class: "form-group" },
                    h("label", null,
                        " ",
                        this.i18n.translate('json-schema-designer.multiple-of'),
                        ": "),
                    h("input", { type: "number", class: "form-control form-control-sm", value: numberItem.multipleOf, onInput: (event) => {
                            const input = event.target;
                            numberItem.multipleOf = Number(input.value);
                            this.rerender();
                        } })))));
        const objectFields = (h("div", { class: "col" },
            h("form", null,
                h("div", { class: "t_color bold" }, " Object "),
                h("div", { class: "form-group" },
                    h("label", null,
                        " ",
                        this.i18n.translate('json-schema-designer.schema'),
                        ": "),
                    h("input", { type: "text", class: "form-control form-control-sm", value: objectItem.schema, onInput: (event) => {
                            const input = event.target;
                            objectItem.schema = input.value;
                            this.rerender();
                        } })),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-8 col-form-label" },
                        this.i18n.translate('json-schema-designer.minimum-properties'),
                        ":"),
                    h("div", { class: "col-sm-4" },
                        h("input", { type: "number", class: "form-control form-control-sm", value: objectItem.minProperties, min: "1", onInput: (event) => {
                                const input = event.target;
                                objectItem.minProperties = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-8 col-form-label" },
                        this.i18n.translate('json-schema-designer.maximum-properties'),
                        ":"),
                    h("div", { class: "col-sm-4" },
                        h("input", { type: "number", class: "form-control form-control-sm", value: objectItem.maxProperties, min: "1", onInput: (event) => {
                                const input = event.target;
                                objectItem.maxProperties = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("div", { class: "form-check" },
                        h("label", null,
                            h("input", { type: "checkbox", checked: objectItem.canHaveAdditionalProperties, onInput: (event) => {
                                    const input = event.target;
                                    objectItem.canHaveAdditionalProperties = input.checked;
                                    this.rerender();
                                } }),
                            " ",
                            this.i18n.translate('json-schema-designer.allow-additional-properties'),
                            " "))),
                h("div", { class: "form-group" },
                    h("label", null,
                        " ",
                        this.i18n.translate('json-schema-designer.additional-properties'),
                        ": "),
                    h("input", { type: "text", class: "form-control form-control-sm", value: objectItem.additionalProperties, onInput: (event) => {
                            const input = event.target;
                            objectItem.additionalProperties = input.value;
                            this.rerender();
                        } })))));
        const arrayFields = (h("div", { class: "col" },
            h("form", null,
                h("div", { class: "t_color bold" },
                    " ",
                    this.i18n.translate('json-schema-designer.array'),
                    " "),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-8 col-form-label" },
                        this.i18n.translate('json-schema-designer.minimum-items'),
                        ":"),
                    h("div", { class: "col-sm-4" },
                        h("input", { type: "number", class: "form-control form-control-sm", value: arrayItem.minItems, min: "1", onInput: (event) => {
                                const input = event.target;
                                arrayItem.minItems = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group row" },
                    h("label", { class: "col-sm-8 col-form-label" },
                        this.i18n.translate('json-schema-designer.maximum-items'),
                        ":"),
                    h("div", { class: "col-sm-4" },
                        h("input", { type: "number", class: "form-control form-control-sm", value: arrayItem.maxItems, min: "1", onInput: (event) => {
                                const input = event.target;
                                arrayItem.maxItems = Number(input.value);
                                this.rerender();
                            } }))),
                h("div", { class: "form-group" },
                    h("div", { class: "form-check" },
                        h("label", null,
                            h("input", { type: "checkbox", checked: arrayItem.uniqueItems, onInput: (event) => {
                                    const input = event.target;
                                    arrayItem.uniqueItems = input.checked;
                                    this.rerender();
                                } }),
                            " ",
                            this.i18n.translate('json-schema-designer.unique-items'),
                            " "))),
                h("div", { class: "form-group" },
                    h("div", { class: "form-check" },
                        h("label", null,
                            h("input", { type: "checkbox", checked: arrayItem.additionalItems, onInput: (event) => {
                                    const input = event.target;
                                    arrayItem.additionalItems = input.checked;
                                    this.rerender();
                                } }),
                            " ",
                            this.i18n.translate('json-schema-designer.additional-items'),
                            " "))))));
        const refFields = (h("div", { class: "col" },
            h("div", { class: "form-group" },
                h("label", { class: "control-label col-xs-2" },
                    " ",
                    this.i18n.translate('json-schema-designer.reference'),
                    ": "),
                h("div", { class: "col-xs-9" },
                    h("input", { type: "text", value: refItem.$ref, class: "form-control sm detail-ip", onInput: (event) => {
                            const input = event.target;
                            refItem.$ref = input.value;
                            this.rerender();
                        } })))));
        let typeSpecificFields;
        switch (this.item.type) {
            case 'string':
                typeSpecificFields = stringFields;
                break;
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
                typeSpecificFields = (h("div", null));
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
