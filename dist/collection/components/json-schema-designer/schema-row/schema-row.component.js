export class SchemaRowComponent {
    constructor() {
        this.showChildren = true;
        this.showDetailsPan = false;
        this.showDeleteConfirmationMessage = false;
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
    componentDidLoad() {
        $('[data-toggle="tooltip"]').tooltip();
    }
    getOptions(propCountDisplay) {
        let options = [];
        for (let i = 0; i < this.dataTypeArray.length; i++) {
            if (this.dataTypeArray[i] === 'object') {
                options.push(h("option", { value: this.dataTypeArray[i], selected: this.item.type === this.dataTypeArray[i], class: 'badge badge-pill badge-primary ' + this.dataTypeArray[i] },
                    this.i18n.translate('json-schema-designer.' + this.dataTypeArray[i]).toUpperCase(),
                    " ",
                    propCountDisplay));
            }
            else {
                options.push(h("option", { value: this.dataTypeArray[i], selected: this.item.type === this.dataTypeArray[i], class: 'badge badge-pill badge-primary ' + this.dataTypeArray[i] }, this.i18n.translate('json-schema-designer.' + this.dataTypeArray[i]).toUpperCase()));
            }
        }
        return options;
    }
    render() {
        //Computed CSS Classes
        const rowClass = this.showDetailsPan ? 'js-row selected' : 'js-row';
        let requiredIconClass = this.item.isRequired ? 'fa fa-asterisk model-required text-danger' : 'fa fa-asterisk model-required';
        requiredIconClass += this.item.isRoot ? ' disabled' : '';
        const typeDisplayClass = 'badge badge-pill badge-primary ' + this.item.type;
        const descriptionIconClass = this.item.description ? 'fa fa-comment model-comment pointer' : 'fa fa-comment model-comment pointer disabled';
        const requiredTooltip = this.item.isRequired ? this.i18n.translate('json-schema-designer.required') : this.i18n.translate('json-schema-designer.not-required');
        //Handle Child Elements
        const objectItem = this.item;
        const propCountDisplay = objectItem.properties ? '(' + objectItem.getChildren().length + ')' : '(0)';
        let showChildrenElement;
        let children;
        if (objectItem.getChildren) {
            // Has Children
            if (this.showChildren) {
                showChildrenElement = h("i", { class: "t_color fa fa-chevron-down" });
                children = objectItem.getChildren();
            }
            else {
                showChildrenElement = h("i", { class: "t_color fa fa-chevron-right" });
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
                            ? h("input", { class: "model-title", type: "text", value: this.item.definitionName, placeholder: '<' + this.i18n.translate('json-schema-designer.definition-name') + '>', onInput: (event) => {
                                    let input = event.target;
                                    this.item.definitionName = input.value;
                                    this.rerender();
                                } })
                            : h("input", { class: "model-title", type: "text", value: this.item.title, placeholder: '<' + this.i18n.translate('json-schema-designer.title') + '>', onInput: (event) => {
                                    let input = event.target;
                                    this.item.title = input.value;
                                    this.rerender();
                                } })),
                    h("div", { class: "model-icons" },
                        h("div", { class: "model-info" },
                            this.item.isRoot
                                ? h("select", { class: typeDisplayClass, onInput: (event) => {
                                        let input = event.target;
                                        this.parent.changeRootType(input.value);
                                        this.rerender();
                                    } },
                                    h("option", { value: "object", class: "badge badge-pill badge-primary object" },
                                        " ",
                                        this.i18n.translate('json-schema-designer.object').toUpperCase(),
                                        " ",
                                        propCountDisplay),
                                    h("option", { value: "array", selected: this.item.type === 'array', class: "badge badge-pill badge-primary array" }, this.i18n.translate('json-schema-designer.array').toUpperCase()))
                                : h("select", { class: typeDisplayClass, onInput: (event) => {
                                        let input = event.target;
                                        this.item.changeType(input.value);
                                        this.rerender();
                                    } }, this.getOptions(propCountDisplay)),
                            h("i", { class: requiredIconClass, "data-toggle": "tooltip", "data-placement": "top", "data-original-title": requiredTooltip, onClick: () => {
                                    if (this.item.isRoot)
                                        return;
                                    this.item.isRequired = !this.item.isRequired;
                                    this.rerender();
                                } }),
                            h("i", { class: descriptionIconClass, "data-toggle": "tooltip", "data-placement": "top", "data-original-title": this.item.description })),
                        h("div", { class: "model-actions" },
                            objectItem.getChildren
                                ? h("i", { class: "fa fa-plus obj-add", onClick: () => {
                                        this.addNewProp(objectItem);
                                        this.rerender();
                                    } })
                                : h("i", { class: "fa fa-plus obj-add disabled" }),
                            this.showDetailsPan
                                ? h("i", { class: "fa fa-check model-done text-success", onClick: () => { this.showDetailsPan = false; } })
                                : h("i", { class: "fa fa-pencil model-detail", onClick: () => { this.showDetailsPan = true; } }),
                            this.item.isRoot
                                ? h("i", { class: "fa fa-times model-remove disabled" })
                                : h("i", { class: "fa fa-times model-remove", onClick: () => {
                                        this.showDeleteConfirmationMessage = true;
                                    } }),
                            this.showDeleteConfirmationMessage
                                ? h("div", { class: "delete-confirmation-message" },
                                    h("div", { class: "message delete-message" }, this.i18n.translate('json-schema-designer.delete?')),
                                    h("div", { class: "buttons" },
                                        h("i", { class: "fa fa-check", onClick: () => {
                                                if (this.item.isRoot)
                                                    return;
                                                this.removeItem(this.item);
                                                this.showDeleteConfirmationMessage = false;
                                                this.rerender();
                                            } }),
                                        h("i", { class: "fa fa-times model-remove", onClick: () => {
                                                this.showDeleteConfirmationMessage = false;
                                            } })))
                                : h("div", null, " ")))),
                this.showDetailsPan
                    ? h("item-details", { class: "item-details", item: this.item, definitions: this.definitions, parent: this, usenullable: this.usenullable })
                    : h("div", null)),
            h("div", { class: "indent" }, children.map((child) => h("schema-row", { item: child, definitions: this.definitions, parent: this, dataTypeArray: this.dataTypeArray, usenullable: this.usenullable })))));
    }
    static get is() { return "schema-row"; }
    static get properties() { return {
        "_tickle": {
            "state": true
        },
        "dataTypeArray": {
            "type": "Any",
            "attr": "data-type-array"
        },
        "definitions": {
            "type": "Any",
            "attr": "definitions"
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
        "showDeleteConfirmationMessage": {
            "state": true
        },
        "showDetailsPan": {
            "state": true
        },
        "usenullable": {
            "type": Boolean,
            "attr": "usenullable"
        }
    }; }
}
