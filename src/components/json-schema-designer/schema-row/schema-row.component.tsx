import { Component, Prop, State } from '@stencil/core';
import { ISchemaItem, IHasChildren, SchemaObject } from '../schema';

declare var $: any;

@Component({
  tag: 'schema-row'
})
export class SchemaRowComponent {
  @Prop() item: ISchemaItem;
  @Prop() parent: any;
  @Prop() definitions: any;

  @Prop({ context: 'i18n' }) private i18n: any;

  @State() showChildren: boolean = true;
  @State() showDetailsPan: boolean = false;
  @State() showDeleleConfirmationMessage: boolean = false;
  @State() _tickle: number = 0;

  removeItem(item: ISchemaItem): void {
    item.parent.removeChild(item._id);
  }

  addNewProp(item: IHasChildren): void {
    item.addChild();
  }

  rerender() {
    this._tickle++;
    this.parent.rerender();
  }

  componentDidLoad() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  render() {
    //Computed CSS Classes
    const rowClass: string = this.showDetailsPan ? 'js-row t_bg' : 'js-row';
    let requiredIconClass: string = this.item.isRequired ? 'fa fa-asterisk model-required text-danger' : 'fa fa-asterisk model-required';
    requiredIconClass += this.item.isRoot ? ' disabled' : '';
    const typeDisplayClass: string = 'badge badge-pill badge-primary ' + this.item.type;
    const descriptionIconClass: string = this.item.description ? 'fa fa-comment model-comment pointer' : 'fa fa-comment model-comment pointer disabled';

    const requiredTooltip: string = this.item.isRequired ? this.i18n.translate('json-schema-designer.required') : this.i18n.translate('json-schema-designer.not-required');

    //Handle Child Elements
    const objectItem = this.item as SchemaObject;
    const propCountDisplay: string = objectItem.properties ? '(' + objectItem.getChildren().length + ')' : '(0)';
    let showChildrenElement: JSX.Element;
    let children: ISchemaItem[];
    if (objectItem.getChildren) {
      // Has Children
      if (this.showChildren) {
        showChildrenElement = <i class="t_color fa fa-chevron-down"></i>;
        children = objectItem.getChildren();
      } else {
        showChildrenElement = <i class="t_color fa fa-chevron-right"></i>;
        children = [];
      }
    } else {
      // No Children
      showChildrenElement = <span></span>
      children = [];
    }


    return (
      <div>
        <div class={rowClass}>
          <div class="information-bar">
            <div class="title-group">
              <div class="obj-exp" onClick={ ()=> { this.showChildren = !this.showChildren; } }>
                {showChildrenElement}
              </div>
              {this.item.isDefinition
                ? <input class="model-title" type="text" value={this.item.definitionName} placeholder="<Definition Name>" onInput={(event) => {
                    let input = event.target as HTMLInputElement;
                    this.item.definitionName = input.value;
                    this.rerender();
                  }}/>
                : <input class="model-title" type="text" value={this.item.title} placeholder="<Title>" onInput={(event) => {
                    let input = event.target as HTMLInputElement;
                    this.item.title = input.value;
                    this.rerender();
                  }}/>
              }
            </div>
            <div class="model-icons">
              <div class="model-info">
                {this.item.isRoot
                  ? <select class={typeDisplayClass} onInput={(event) => {
                        let input = event.target as HTMLInputElement;
                        this.parent.changeRootType(input.value);
                        this.rerender();
                      }}>
                      <option value="object" class="badge badge-pill badge-primary object"> {this.i18n.translate('json-schema-designer.object').toUpperCase()} {propCountDisplay}</option>
                      <option value="array" selected={this.item.type === 'array'} class="badge badge-pill badge-primary array">{this.i18n.translate('json-schema-designer.array').toUpperCase()}</option>
                    </select>
                  : <select class={typeDisplayClass} onInput={(event) => {
                        let input = event.target as HTMLInputElement;
                        this.item.changeType(input.value);
                        this.rerender();
                       }}>
                          <option value="string" selected={this.item.type === 'string'} class="badge badge-pill badge-primary string">{this.i18n.translate('json-schema-designer.string').toUpperCase()}</option>
                          <option value="number" selected={this.item.type === 'number'} class="badge badge-pill badge-primary number">{this.i18n.translate('json-schema-designer.number').toUpperCase()}</option>
                          <option value="integer" selected={this.item.type === 'integer'} class="badge badge-pill badge-primary interger">{this.i18n.translate('json-schema-designer.integer').toUpperCase()}</option>
                          <option value="object" selected={this.item.type === 'object'} class="badge badge-pill badge-primary object">{this.i18n.translate('json-schema-designer.object').toUpperCase()} {propCountDisplay}</option>
                          <option value="array" selected={this.item.type === 'array'} class="badge badge-pill badge-primary array">{this.i18n.translate('json-schema-designer.array').toUpperCase()}</option>
                          <option value="boolean" selected={this.item.type === 'boolean'} class="badge badge-pill badge-primary boolean">{this.i18n.translate('json-schema-designer.boolean').toUpperCase()}</option>
                          <option value="null" selected={this.item.type === 'null'} class="badge badge-pill badge-primary null">{this.i18n.translate('json-schema-designer.null').toUpperCase()}</option>
                          <option value="$ref" selected={this.item.type === '$ref'} class="badge badge-pill badge-primary $ref">{this.i18n.translate('json-schema-designer.$ref').toUpperCase()}</option>
                    </select>
                }
                <i class={requiredIconClass} data-toggle="tooltip" data-placement="top" data-original-title={requiredTooltip} onClick={ () => {
                  if (this.item.isRoot) return;
                  this.item.isRequired = !this.item.isRequired;
                  this.rerender();
                 }} ></i>
                <i class={descriptionIconClass} data-toggle="tooltip" data-placement="top" data-original-title={this.item.description}></i>
              </div>
              <div class="model-actions">
                {objectItem.getChildren
                  ? <i class="fa fa-plus obj-add" onClick={() => {
                      this.addNewProp(objectItem);
                      this.rerender();
                    }}></i>
                  : <i class="fa fa-plus obj-add disabled"></i>
                }
                {this.showDetailsPan
                  ? <i class="fa fa-check model-done text-success" onClick={() => { this.showDetailsPan = false; }}></i>
                  : <i class="fa fa-pencil model-detail" onClick={() => { this.showDetailsPan = true; }}></i>
                }
                {this.item.isRoot
                  ? <i class="fa fa-times model-remove disabled"></i>
                  : <i class="fa fa-times model-remove" onClick={() => {
                      this.showDeleleConfirmationMessage = true;
                      this.rerender();
                    }}>
                    </i>
                }
                {this.showDeleleConfirmationMessage
                  ? <div class="delete-confirmation-message">
                      <div class="message">
                        {this.i18n.translate('json-schema-designer.delete?')}
                      </div>
                      <div class="buttons">
                        <i class="fa fa-check" onClick={() => {
                            if (this.item.isRoot) return;
                            this.removeItem(this.item);
                            this.showDeleleConfirmationMessage = false;
                            this.rerender();
                          }}>
                          </i>
                        <i class="fa fa-times model-remove" onClick={() => {
                          this.showDeleleConfirmationMessage = false;
                          this.rerender();
                        }}></i>
                      </div>
                   </div>
                  : <div> </div>
                }
              </div>
            </div>
          </div>
          {this.showDetailsPan
            ? <item-details class="item-details" item={ this.item } definitions={ this.definitions } parent={ this }></item-details>
            : <div></div>
          }
        </div>
        <div class="indent">
          {children.map((child) =>
              <schema-row item={ child } definitions={ this.definitions } parent={ this }></schema-row>
          )}
        </div>
      </div>
    );
  }
}
