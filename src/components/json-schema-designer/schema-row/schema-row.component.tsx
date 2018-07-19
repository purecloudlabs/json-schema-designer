import { Component, Prop, State } from '@stencil/core';
import { ISchemaItem, IHasChildren, SchemaObject } from '../schema';

@Component({
  tag: 'schema-row'
})
export class SchemaRowComponent {
  @Prop() item: ISchemaItem;
  @Prop({context: 'workingSchema' }) workingSchema: any;
  @Prop() parent: any;

  @State() showChildren: boolean = true;
  @State() showDetailsPan: boolean = false;

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

  render() {
    //Computed CSS Classes
    const rowClass: string = this.showDetailsPan ? 'js-row t_bg' : 'js-row';
    let requiredIconClass: string = this.item.isRequired ? 'fas fa-asterisk model-required text-danger' : 'fas fa-asterisk model-required';
    requiredIconClass += this.item.isRoot ? ' disabled' : '';
    const typeDisplayClass: string = 'badge badge-pill badge-primary ' + this.item.type;

    //Handle Child Elements
    const objectItem = this.item as SchemaObject;
    const propCountDisplay: string = objectItem.properties ? '(' + objectItem.getChildren().length + ')' : '(0)';
    let showChildrenElement: JSX.Element;
    let children: ISchemaItem[];
    if (objectItem.getChildren) {
      // Has Children
      if (this.showChildren) {
        showChildrenElement = <i class="t_color fas fa-chevron-down"></i>;
        children = objectItem.getChildren();
      } else {
        showChildrenElement = <i class="t_color fas fa-chevron-right"></i>;
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
                        this.item.changeType(input.value);
                        this.rerender();
                      }}>
                      <option value="object" class="badge badge-pill badge-primary object">OBJECT {propCountDisplay}</option>

                    </select>
                  : <select class={typeDisplayClass} onInput={(event) => {
                        let input = event.target as HTMLInputElement;
                        this.item.changeType(input.value);
                        this.rerender();
                       }}>
                          <option value="string" selected={this.item.type === 'string'} class="badge badge-pill badge-primar string">STRING</option>
                          <option value="number" selected={this.item.type === 'number'} class="badge badge-pill badge-primary number">NUMBER</option>
                          <option value="interger" selected={this.item.type === 'interger'} class="badge badge-pill badge-primary interger">INTEGER</option>
                          <option value="object" selected={this.item.type === 'object'} class="badge badge-pill badge-primary object">OBJECT {propCountDisplay}</option>
                          <option value="array" selected={this.item.type === 'array'} class="badge badge-pill badge-primary array">ARRAY</option>
                          <option value="boolean" selected={this.item.type === 'boolean'} class="badge badge-pill badge-primary boolean">BOOLEAN</option>
                          <option value="null" selected={this.item.type === 'null'} class="badge badge-pill badge-primary null">NULL</option>
                          <option value="$ref" selected={this.item.type === '$ref'} class="badge badge-pill badge-primary $ref">$ref</option>
                    </select>
                }
                <i class={requiredIconClass} title="required-tooltip" onClick={ () => {
                  if (this.item.isRoot) return;
                  this.item.isRequired = !this.item.isRequired;
                  this.rerender();
                 }} ></i>
                <i class="fas fa-comment-alt model-comment pointer"></i>
              </div>
              <div class="model-actions">
                {objectItem.getChildren
                  ? <i class="fas fa-plus obj-add" onClick={() => {
                      this.addNewProp(objectItem);
                      this.rerender();
                    }}></i>
                  : <i class="fas fa-plus obj-add disabled"></i>
                }
                {this.showDetailsPan
                  ? <i class="fas fa-check model-done text-success" onClick={() => { this.showDetailsPan = false; }}></i>
                  : <i class="fas fa-pencil-alt model-detail" onClick={() => { this.showDetailsPan = true; }}></i>
                }
                {this.item.isRoot
                  ? <i class="fas fa-times model-remove disabled"></i>
                  : <i class="fas fa-times model-remove" onClick={() => {
                      if (this.item.isRoot) return;
                      this.removeItem(this.item)
                      this.rerender();
                    }}>
                    </i>
                }
              </div>
            </div>
          </div>
          {this.showDetailsPan
            ? <item-details class="item-details" item={this.item} parent={this}></item-details>
            : <div></div>
          }
        </div>
        <div class="indent">
          {children.map((child) =>
              <schema-row item={child} parent={this}></schema-row>
          )}
        </div>
      </div>
    );
  }
}
