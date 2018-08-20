import { Component, Prop, State } from '@stencil/core';
import { ISchemaItem, SchemaReference, SchemaString, SchemaNumeric, SchemaObject, SchemaArray } from '../schema';

@Component({
  tag: 'item-details'
})
export class ItemDetailsComponent {
  @Prop() item: ISchemaItem;
  @Prop() parent: any;

  @Prop({ context: 'i18n' }) private i18n: any;

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

    const basicFields: JSX.Element = (
      <div class="col-lg-6 border-right">
        <div class="t_color bold"> {this.i18n.translate('json-schema-designer.general')} </div>
        <div>
          <form class="form-horizontal form-compact model-detail-form" name="detailForm" role="form">
            <div class="form-group">
              <label class="control-label col-xs-2"> {this.i18n.translate('json-schema-designer.title')} </label>
              <div class="col-xs-9">
                <input type="text" class="form-control sm detail-ip" id="foldName" value={this.item.title} name="title" onInput={(event) => {
                  const input = event.target as HTMLInputElement;
                  this.item.title = input.value;
                  this.rerender();
                }}/>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-xs-2"> {this.i18n.translate('json-schema-designer.description')} </label>
              <div class="col-xs-9">
                <textarea class="form-control" value={this.item.description} onInput={(event) => {
                  const input = event.target as HTMLInputElement;
                  this.item.description = input.value;
                  this.rerender();
                }}></textarea>
              </div>
            </div>
            <div class="form-group">
              <label class="control-label col-xs-2"> {this.i18n.translate('json-schema-designer.default')} </label>
              <div class="col-xs-9">
                <input type="text" class="form-control sm detail-ip" value={this.item.default} onInput={(event) => {
                  const input = event.target as HTMLInputElement;
                  this.item.default = input.value;
                  this.rerender();
                }}/>
              </div>
            </div>
            {this.item.type === 'null'
              ? <div></div>
              : <div>
                  <div class={requiredCheckBoxStyle}>
                    <label>
                      <input type="checkbox" checked={this.item.isRequired} onInput={(event) => {
                        if (this.item.isRoot) return;
                        const input = event.target as HTMLInputElement;
                        this.item.isRequired = input.checked;
                        this.rerender();
                      }}/>
                      {this.i18n.translate('json-schema-designer.required')}
                      </label>
                  </div>
                  <div class="form-check">
                    <label>
                      <input type="checkbox" checked={this.item.isNullable} onInput={(event) => {
                        if (this.item.isRoot) return;
                        const input = event.target as HTMLInputElement;
                        this.item.isNullable = input.checked;
                        this.rerender();
                      }}/> {this.i18n.translate('json-schema-designer.nullable')}
                    </label>
                  </div>
                  <div>
                    <div class="enum-control-bar" onClick={() => {
                        this.enumCtrlExpanded = !this.enumCtrlExpanded;
                    }}>
                      {this.enumCtrlExpanded
                        ? <i class="btn fa fa-chevron-down"></i>
                        : <i class="btn fa fa-chevron-right"></i>
                      }
                      <label> {this.i18n.translate('json-schema-designer.enumerated-values')} </label>
                    </div>
                    {this.enumCtrlExpanded
                      ? <div>
                          {enums.map((enumObject, index) =>
                            <div class="enum-row">
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
                                <option value='string'>{this.i18n.translate('json-schema-designer.string')}</option>
                                <option value='number'>{this.i18n.translate('json-schema-designer.number')}</option>
                              </select>
                              <i class="btn fa fa-times" onClick={() => {
                                this.item.removeEnumValue(index);
                                this.rerender();
                              }}></i>
                            </div>
                            )}
                          <div class="text-center">
                            <button type="button" class="btn btn-secondary btn-sm" onClick={() => {
                              this.item.addEnumValue();
                              this.rerender();
                            }}>
                              <i class="fa fa-plus"></i>
                              {this.i18n.translate('json-schema-designer.add-value')}
                            </button>
                          </div>
                        </div>
                      : <div></div>
                    }
                  </div>
                </div>
            }
          </form>
        </div>
      </div>
    );
    const stringFields: JSX.Element = (
      <div class="col-lg-6">
        <form>
          <div class="t_color bold"> {this.i18n.translate('json-schema-designer.numeric')} </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">{this.i18n.translate('json-schema-designer.minimum-length')}:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={stringItem.minLength} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.minLength = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">{this.i18n.translate('json-schema-designer.maximum-length')}</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={stringItem.maxLength} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.maxLength = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label> {this.i18n.translate('json-schema-designer.format')}: </label>
            <input type="text" class="form-control form-control-sm" value={stringItem.format} onInput={(event) => {
              const input = event.target as HTMLInputElement;
              stringItem.format = input.value;
              this.rerender();
            }}/>
          </div>
          <div class="form-group">
            <label> {this.i18n.translate('json-schema-designer.pattern')}: </label>
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
      <div class="col-lg-6">
        <form>
          <div class="t_color bold"> {this.i18n.translate('json-schema-designer.numeric')} </div>
          <div class="form-group row">
            <label class="col-sm-6 col-form-label">{this.i18n.translate('json-schema-designer.minimum')}</label>
            <div class="col-sm-6 ">
              <input type="number" class="form-control form-control-sm" value={numberItem.minimum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.minimum = Number(input.value);
                this.rerender();
              }}/>
            </div>
            <div class="form-check col-sm-6">
              <label>
                <input type="checkbox" checked={numberItem.exclusiveMinimum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.exclusiveMinimum = input.checked;
                this.rerender();
                }}/>
                {this.i18n.translate('json-schema-designer.exclusive')}
              </label>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-6 col-form-label">{this.i18n.translate('json-schema-designer.maximum')}</label>
            <div class="col-sm-6">
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
              }}/> {this.i18n.translate('json-schema-designer.exclusive')} </label>
            </div>
          </div>
          <div class="form-group">
            <label> {this.i18n.translate('json-schema-designer.multiple-of')}: </label>
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
      <div class="col-lg-6">
        <form>
          <div class="t_color bold"> Object </div>
          <div class="form-group">
            <label> {this.i18n.translate('json-schema-designer.schema')}: </label>
            <input type="text" class="form-control form-control-sm" value={objectItem.schema} onInput={(event) => {
              const input = event.target as HTMLInputElement;
              objectItem.schema = input.value;
              this.rerender();
            }}/>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">{this.i18n.translate('json-schema-designer.minimum-properties')}:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={objectItem.minProperties} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.minProperties = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">{this.i18n.translate('json-schema-designer.maximum-properties')}:</label>
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
              }}/> {this.i18n.translate('json-schema-designer.allow-additional-properties')} </label>
            </div>
          </div>
          <div class="form-group">
            <label> {this.i18n.translate('json-schema-designer.additional-properties')}: </label>
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
      <div class="col-lg-6">
        <form>
          <div class="t_color bold"> {this.i18n.translate('json-schema-designer.array')} </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">{this.i18n.translate('json-schema-designer.minimum-items')}:</label>
            <div class="col-sm-4">
              <input type="number" class="form-control form-control-sm" value={arrayItem.minItems} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.minItems = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-8 col-form-label">{this.i18n.translate('json-schema-designer.maximum-items')}:</label>
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
              }}/> {this.i18n.translate('json-schema-designer.unique-items')} </label>
            </div>
          </div>
          <div class="form-group">
            <div class="form-check">
              <label><input type="checkbox" checked={arrayItem.additionalItems} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.additionalItems = input.checked;
                this.rerender();
              }}/> {this.i18n.translate('json-schema-designer.additional-items')} </label>
            </div>
          </div>
        </form>
      </div>
    );

    const refFields: JSX.Element = (
      <div class="col-lg-6">
        <div class="form-group">
          <label class="control-label col-xs-2"> {this.i18n.translate('json-schema-designer.reference')}: </label>
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
        typeSpecificFields = (<div></div>);
    }

    return (
      <div class="model-det-cont container">
          {this.item.type === '$ref'
            ? <div class="row">
                {refFields}
              </div>
            : <div class="row">
                {basicFields}
                {typeSpecificFields}
              </div>
          }
      </div>
    );
  }
}
