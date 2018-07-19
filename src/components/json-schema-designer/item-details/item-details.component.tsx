import { Component, Prop, State } from '@stencil/core';
import { ISchemaItem, SchemaReference, SchemaString, SchemaNumeric, SchemaObject, SchemaArray } from '../schema';

@Component({
  tag: 'item-details'
})
export class ItemDetailsComponent {
  @Prop() item: ISchemaItem;
  @Prop() parent: any;
  @State() enumCtrlExpanded: boolean;

  @State() _tickle: number = 0;


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
    const refItem = this.item as SchemaReference;
    const stringItem = this.item as SchemaString;
    const numberItem = this.item as SchemaNumeric;
    const objectItem = this.item as SchemaObject;
    const arrayItem = this.item as SchemaArray;

    const enums = this.item.enum ? this.item.enum : [];

    const stringFields: JSX.Element = (
      <div class="col">
        <form>
          <div class="t_color bold"> Numeric </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">Minimum Length:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={stringItem.minLength} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.minLength = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">Maximum Length:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={stringItem.maxLength} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.maxLength = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label> Format: </label>
            <input type="text" class="form-control form-control-sm" value={stringItem.format} onInput={(event) => {
              const input = event.target as HTMLInputElement;
              stringItem.format = input.value;
              this.rerender();
            }}/>
          </div>
          <div class="form-group">
            <label> Pattern: </label>
            <input type="text" class="form-control form-control-sm" value={stringItem.pattern} min="0" onInput={(event) => {
              const input = event.target as HTMLInputElement;
              stringItem.pattern = input.value;
              this.rerender();
            }}/>
          </div>
        </form>
      </div>
    );
    const numberFields: JSX.Element = (
      <div class="col">
        <form>
          <div class="t_color bold"> Numberic </div>
          <div class="form-group row">
            <label class="col-sm-6 col-form-label">Minimum</label>
            <div class="col-sm-6 ">
              <input type="number" class="form-control form-control-sm" value={numberItem.minimum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.minimum = Number(input.value);
                this.rerender();
              }}/>
            </div>
            <div class="form-check">
              <label><input type="checkbox" checked={numberItem.exclusiveMinimum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.exclusiveMinimum = input.checked;
                this.rerender();
              }}/> Exclusive </label>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-6 col-form-label">Maximum</label>
            <div class="col-sm-6 ">
              <input type="number" class="form-control form-control-sm" value={numberItem.maximum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.maximum = Number(input.value);
                this.rerender();
              }}/>
            </div>
            <div class="form-check">
              <label><input type="checkbox" checked={numberItem.exclusiveMaximum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.exclusiveMaximum = input.checked;
                this.rerender();
              }}/> Exclusive </label>
            </div>
          </div>
          <div class="form-group">
            <label> Multiple Of: </label>
            <input type="number" class="form-control form-control-sm" value={numberItem.multipleOf} onInput={(event) => {
              const input = event.target as HTMLInputElement;
              numberItem.multipleOf = Number(input.value);
              this.rerender();
            }}/>
          </div>
        </form>
      </div>
    );

    const objectFields: JSX.Element = (
      <div class="col">
        <form>
          <div class="t_color bold"> Object </div>
          <div class="form-group">
            <label> Schema: </label>
            <input type="text" class="form-control form-control-sm" value={objectItem.schema} onInput={(event) => {
              const input = event.target as HTMLInputElement;
              objectItem.schema = input.value;
              this.rerender();
            }}/>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">Minimum Properties:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={objectItem.minProperties} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.minProperties = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">Maximum Properties:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={objectItem.maxProperties} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.maxProperties = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <div class="form-check">
              <label><input type="checkbox" checked={objectItem.canHaveAdditionalProperties} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.canHaveAdditionalProperties = input.checked;
                this.rerender();
              }}/> Allow Additional Properties </label>
            </div>
          </div>
          <div class="form-group">
            <label> Additional Properties: </label>
            <input type="text" class="form-control form-control-sm" value={objectItem.additionalProperties} onInput={(event) => {
              const input = event.target as HTMLInputElement;
              objectItem.additionalProperties = input.value;
              this.rerender();
            }}/>
          </div>
        </form>
      </div>
    );

    const arrayFields: JSX.Element = (
      <div class="col">
        <form>
          <div class="t_color bold"> Array </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">Minimum Items:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={arrayItem.minItems} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.minItems = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">Maximum Items:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={arrayItem.maxItems} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.maxItems = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <div class="form-check">
              <label><input type="checkbox" checked={arrayItem.uniqueItems} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.uniqueItems = input.checked;
                this.rerender();
              }}/> Unique Items </label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-check">
              <label><input type="checkbox" checked={arrayItem.additionalItems} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.additionalItems = input.checked;
                this.rerender();
              }}/> Additional Items </label>
            </div>
          </div>
        </form>
      </div>
    );

    const refFields: JSX.Element = (
      <div class="col">
        <div class="form-group">
          <label class="control-label col-xs-2"> Reference: </label>
          <div class="col-xs-9">
            <input type="text" value={refItem.$ref} class="form-control sm detail-ip" onInput={(event) => {
              const input = event.target as HTMLInputElement;
              refItem.$ref = input.value;
              this.rerender();
            }}/>
          </div>
        </div>
      </div>
    );

    let typeSpecificFields: JSX.Element;
    switch(this.item.type) {
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
        typeSpecificFields = (<div></div>);
    }

    //TODO: put style="border-right:1px solid #9E9E9E"

    return (
      <div class="model-det-cont container">
          {this.item.type === '$ref'
            ? <div class="row"> {refFields} </div>
            : <div class="row">
                <div class="col border-right">
                  <div class="t_color bold"> General </div>
                  <div>
                    <form class="form-horizontal form-compact model-detail-form" name="detailForm" role="form">
                      <div class="form-group">
                        <label class="control-label col-xs-2"> Title </label>
                        <div class="col-xs-9">
                          <input type="text" class="form-control sm detail-ip" id="foldName" value={this.item.title} name="title" onInput={(event) => {
                            const input = event.target as HTMLInputElement;
                            this.item.title = input.value;
                            this.rerender();
                          }}/>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-xs-2"> Description </label>
                        <div class="col-xs-9">
                          <textarea class="form-control" value={this.item.description} onInput={(event) => {
                            const input = event.target as HTMLInputElement;
                            this.item.description = input.value;
                            this.rerender();
                          }}></textarea>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-xs-2"> Default </label>
                        <div class="col-xs-9">
                          <input type="text" class="form-control sm detail-ip" value={this.item.default} onInput={(event) => {
                            const input = event.target as HTMLInputElement;
                            this.item.default = input.value;
                            this.rerender();
                          }}/>
                        </div>
                      </div>
                      <div class={requiredCheckBoxStyle}>
                        <label><input type="checkbox" checked={this.item.isRequired} onInput={(event) => {
                          if (this.item.isRoot) return;
                          const input = event.target as HTMLInputElement;
                          this.item.isRequired = input.checked;
                          this.rerender();
                        }}/> Required </label>
                      </div>
                      <div class="form-check">
                        <label><input type="checkbox" checked={this.item.isNullable} onInput={(event) => {
                          if (this.item.isRoot) return;
                          const input = event.target as HTMLInputElement;
                          this.item.isNullable = input.checked;
                          this.rerender();
                        }}/> Nullable </label>
                      </div>
                      <div>
                        <div class="enum-control-bar" onClick={() => {
                            this.enumCtrlExpanded = !this.enumCtrlExpanded;
                        }}>
                          {this.enumCtrlExpanded
                            ? <i class="btn fas fa-chevron-down"></i>
                            : <i class="btn fas fa-chevron-right"></i>
                          }
                          <label> Enumerated Values </label>
                        </div>
                        {this.enumCtrlExpanded
                          ? <div>
                              <div class="enum-row">
                                {enums.map((enumObject, index) =>
                                  <div>
                                    <input type={enumObject.type} class="form-control form-control-sm" value={enumObject.value} onInput={(event) => {
                                      const input = event.target as HTMLInputElement;
                                      this.item.enum[index].value = input.value;
                                      this.rerender();
                                    }}/>
                                    <select class="custom-select custom-select-sm" onInput={(event) => {
                                      const input = event.target as HTMLInputElement;
                                      this.item.enum[index].type = input.value;
                                      this.rerender();
                                    }}>
                                      <option>string</option>
                                      <option>number</option>
                                    </select>
                                    <i class="btn fas fa-times" onClick={() => {
                                      this.item.removeEnumValue(index);
                                      this.rerender();
                                    }}></i>
                                  </div>
                                )}
                              </div>
                              <div class="text-center">
                                <button type="button" class="btn btn-secondary btn-sm" onClick={() => {
                                  this.item.addEnumValue();
                                  this.rerender();
                                }}> Add Value <i class="fas fa-plus"></i></button>
                              </div>
                            </div>
                          : <div></div>
                        }
                      </div>
                    </form>
                  </div>
                </div>
                {typeSpecificFields}
              </div>
          }
      </div>
    );
  }
}
