export class SchemaRowComponent {
    constructor() {
        this.showChildren = true;
        this.showDetailsPan = false;
        this._tickle = 0;
    }
    removeItem(item) {
        item.parent.removeChild(item._id);
    }
    addNewProp(item) {
        item.addChild();
    }
    rerender() {
        this._tickle++;
        this.parent.rerender();
    }
    render() {
        //Computed CSS Classes
        const rowClass = this.showDetailsPan ? 'js-row t_bg' : 'js-row';
        let requiredIconClass = this.item.isRequired ? 'fas fa-asterisk model-required text-danger' : 'fas fa-asterisk model-required';
        requiredIconClass += this.item.isRoot ? ' disabled' : '';
        const typeDisplayClass = 'badge badge-pill badge-primary ' + this.item.type;
        const descriptionIconClass = this.item.description ? 'fas fa-comment-alt model-comment pointer' : 'fas fa-comment-alt model-comment pointer disabled';
        const requiredTooltip = this.item.isRequired ? this.i18n.translate('json-schema-designer.required') : this.i18n.translate('json-schema-designer.not-required');
        //Handle Child Elements
        const objectItem = this.item;
        const propCountDisplay = objectItem.properties ? '(' + objectItem.getChildren().length + ')' : '(0)';
        let showChildrenElement;
        let children;
        if (objectItem.getChildren) {
            // Has Children
            if (this.showChildren) {
                showChildrenElement = h("i", { class: "t_color fas fa-chevron-down" });
                children = objectItem.getChildren();
            }
            else {
                showChildrenElement = h("i", { class: "t_color fas fa-chevron-right" });
                children = [];
            }
        }
        else {
            // No Children
            showChildrenElement = h("span", null);
            children = [];
        }
        return (h("div", null,
            h("div", { class: rowClass },
                h("div", { class: "information-bar" },
                    h("div", { class: "title-group" },
                        h("div", { class: "obj-exp", onClick: () => { this.showChildren = !this.showChildren; } }, showChildrenElement),
                        this.item.isDefinition
                            ? h("input", { class: "model-title", type: "text", value: this.item.definitionName, placeholder: "<Definition Name>", onInput: (event) => {
                                    let input = event.target;
                                    this.item.definitionName = input.value;
                                    this.rerender();
                                } })
                            : h("input", { class: "model-title", type: "text", value: this.item.title, placeholder: "<Title>", onInput: (event) => {
                                    let input = event.target;
                                    this.item.title = input.value;
                                    this.rerender();
                                } })),
                    h("div", { class: "model-icons" },
                        h("div", { class: "model-info" },
                            this.item.isRoot
                                ? h("select", { class: typeDisplayClass, onInput: (event) => {
                                        let input = event.target;
                                        this.item.changeType(input.value);
                                        this.rerender();
                                    } },
                                    h("option", { value: "object", class: "badge badge-pill badge-primary object" },
                                        " ",
                                        this.i18n.translate('json-schema-designer.object').toUpperCase(),
                                        " ",
                                        propCountDisplay))
                                : h("select", { class: typeDisplayClass, onInput: (event) => {
                                        let input = event.target;
                                        this.item.changeType(input.value);
                                        this.rerender();
                                    } },
                                    h("option", { value: "string", selected: this.item.type === 'string', class: "badge badge-pill badge-primar string" }, this.i18n.translate('json-schema-designer.string').toUpperCase()),
                                    h("option", { value: "number", selected: this.item.type === 'number', class: "badge badge-pill badge-primary number" }, this.i18n.translate('json-schema-designer.number').toUpperCase()),
                                    h("option", { value: "interger", selected: this.item.type === 'interger', class: "badge badge-pill badge-primary interger" }, this.i18n.translate('json-schema-designer.integer').toUpperCase()),
                                    h("option", { value: "object", selected: this.item.type === 'object', class: "badge badge-pill badge-primary object" },
                                        this.i18n.translate('json-schema-designer.object').toUpperCase(),
                                        " ",
                                        propCountDisplay),
                                    h("option", { value: "array", selected: this.item.type === 'array', class: "badge badge-pill badge-primary array" }, this.i18n.translate('json-schema-designer.array').toUpperCase()),
                                    h("option", { value: "boolean", selected: this.item.type === 'boolean', class: "badge badge-pill badge-primary boolean" }, this.i18n.translate('json-schema-designer.boolean').toUpperCase()),
                                    h("option", { value: "null", selected: this.item.type === 'null', class: "badge badge-pill badge-primary null" }, this.i18n.translate('json-schema-designer.null').toUpperCase()),
                                    h("option", { value: "$ref", selected: this.item.type === '$ref', class: "badge badge-pill badge-primary $ref" }, this.i18n.translate('json-schema-designer.$ref').toUpperCase())),
                            h("i", { class: requiredIconClass, "data-toggle": "tooltip", "data-placement": "top", "data-original-title": requiredTooltip, onClick: () => {
                                    if (this.item.isRoot)
                                        return;
                                    this.item.isRequired = !this.item.isRequired;
                                    this.rerender();
                                } }),
                            h("i", { class: descriptionIconClass, "data-toggle": "tooltip", "data-placement": "top", "data-original-title": this.item.description })),
                        h("div", { class: "model-actions" },
                            objectItem.getChildren
                                ? h("i", { class: "fas fa-plus obj-add", onClick: () => {
                                        this.addNewProp(objectItem);
                                        this.rerender();
                                    } })
                                : h("i", { class: "fas fa-plus obj-add disabled" }),
                            this.showDetailsPan
                                ? h("i", { class: "fas fa-check model-done text-success", onClick: () => { this.showDetailsPan = false; } })
                                : h("i", { class: "fas fa-pencil-alt model-detail", onClick: () => { this.showDetailsPan = true; } }),
                            this.item.isRoot
                                ? h("i", { class: "fas fa-times model-remove disabled" })
                                : h("i", { class: "fas fa-times model-remove", onClick: () => {
                                        if (this.item.isRoot)
                                            return;
                                        this.removeItem(this.item);
                                        this.rerender();
                                    } })))),
                this.showDetailsPan
                    ? h("item-details", { class: "item-details", item: this.item, parent: this })
                    : h("div", null)),
            h("div", { class: "indent" }, children.map((child) => h("schema-row", { item: child, parent: this })))));
    }
    static get is() { return "schema-row"; }
    static get properties() { return {
        "_tickle": {
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
        },
        "showChildren": {
            "state": true
        },
        "showDetailsPan": {
            "state": true
        }
    }; }
}
