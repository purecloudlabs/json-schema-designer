import { Component, Prop, State } from '@stencil/core';
import { ISchemaItem, SchemaReference, SchemaString, SchemaNumeric, SchemaObject, SchemaArray } from '../schema';

@Component({
  tag: 'item-details'
})
export class ItemDetailsComponent {
  @Prop() item: ISchemaItem;
  @Prop() parent: any;
  @Prop() definitions: any;
  @Prop() useenums: boolean;

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

  _getDefinitionReferences( definition, prefix: string ) {
    let references: string[] = [];
    let name: string = definition.definitionName || definition.title;
    let reference: string = prefix + name;
    references.push(reference)
    let children = definition.getChildren ? definition.getChildren() : [];
    children.forEach((child) => {
      references = references.concat(this._getDefinitionReferences(child, reference + '/'));
    })
    return references;
  }

  render() {
    //Item Casts for Specific Fields
    const refItem = this.item as SchemaReference;
    const stringItem = this.item as SchemaString;
    const numberItem = this.item as SchemaNumeric;
    const objectItem = this.item as SchemaObject;
    const arrayItem = this.item as SchemaArray;

    const enums = this.item.enum ? this.item.enum : [];

    let definitionReferences = [];
    this.definitions.forEach((definition) => {
      definitionReferences = definitionReferences.concat(this._getDefinitionReferences(definition, '#/definitions/'));
    })

    const basicFields: JSX.Element = (
      <div class="col-lg-6 border-right">
        <h4 class="t_color bold"> {this.i18n.translate('json-schema-designer.general')} </h4>
        <form class="form-horizontal" role="form">
          <div class="form-group">
            <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.title')} </label>
            <div class="col-sm-10">
              <input type="text" class="form-control" id="foldName" value={this.item.title} name="title" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                this.item.title = input.value;
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.description')} </label>
            <div class="col-sm-10">
              <textarea class="form-control" value={this.item.description} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                this.item.description = input.value;
                this.rerender();
              }}></textarea>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.default')} </label>
            <div class="col-sm-10">
              <input type="text" class="form-control" value={this.item.default} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                this.item.default = input.value;
                this.rerender();
              }}/>
            </div>
          </div>
          {this.item.type === 'null'
            ? <div></div>
            : <div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" checked={this.item.isRequired} onInput={(event) => {
                          if (this.item.isRoot) return;
                          const input = event.target as HTMLInputElement;
                          this.item.isRequired = input.checked;
                          this.rerender();
                        }} disabled={this.item.isRoot}/> {this.i18n.translate('json-schema-designer.required')}
                      </label>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-sm-offset-2 col-sm-10">
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" checked={this.item.isNullable} onInput={(event) => {
                          if (this.item.isRoot) return;
                          const input = event.target as HTMLInputElement;
                          this.item.isNullable = input.checked;
                          this.rerender();
                        }}/> {this.i18n.translate('json-schema-designer.nullable')}
                      </label>
                    </div>
                  </div>
                </div>
              { this.useenums ?
                <div class="form-group">
                  <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.enumerated-values')} </label>
                  <div class="col-sm-10">
                    {enums.map((enumObject, index) =>
                      <div class="row">
                        <div class="col-sm-8">
                          <input type={enumObject.type} class="form-control input-sm" value={enumObject.value} onInput={(event) => {
                            const input = event.target as HTMLInputElement;
                            this.item.enum[index].value = input.value;
                            this.rerender();
                          }}/>
                        </div>
                        <div class="col-sm-3">
                          <select class="form-control input-sm" onInput={(event) => {
                            const input = event.target as HTMLInputElement;
                            this.item.enum[index].type = input.value;
                            this.rerender();
                          }}>
                            <option value='string'>{this.i18n.translate('json-schema-designer.string')}</option>
                            <option value='number'>{this.i18n.translate('json-schema-designer.number')}</option>
                          </select>
                        </div>
                        <div class="col-sm-1">
                          <i class="btn fa fa-times" onClick={() => {
                            this.item.removeEnumValue(index);
                            this.rerender();
                          }}></i>
                        </div>
                      </div>
                    )}
                    <div>
                      <button type="button" class="btn btn-default btn-xs width100" onClick={() => {
                        this.item.addEnumValue();
                        this.rerender();
                      }}>
                        <i class="fa fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
                : <div></div>
              }
              </div>
          }
        </form>
      </div>
    );

    const stringFields: JSX.Element = (
      <div class="col-lg-6">
        <form class="form-horizontal">
          <h4 class="t_color bold"> {this.i18n.translate('json-schema-designer.string')} </h4>
          <div class="form-group">
            <label class="control-label col-sm-2">{this.i18n.translate('json-schema-designer.minimum-length')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={stringItem.minLength} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.minLength = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">{this.i18n.translate('json-schema-designer.maximum-length')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={stringItem.maxLength} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.maxLength = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.format')} </label>
            <div class="col-sm-10">
              <input type="text" class="form-control form-control-sm" value={stringItem.format} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.format = input.value;
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.pattern')} </label>
            <div class="col-sm-10">
              <input type="text" class="form-control" value={stringItem.pattern} min="0" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                stringItem.pattern = input.value;
                this.rerender();
              }}/>
            </div>
          </div>
        </form>
      </div>
    );

    const numberFields: JSX.Element = (
      <div class="col-lg-6">
        <form class="form-horizontal">
          <h4 class="t_color bold"> {this.i18n.translate('json-schema-designer.numeric')} </h4>
          <div class="form-group">
            <label class="control-label col-sm-2">{this.i18n.translate('json-schema-designer.minimum')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={numberItem.minimum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.minimum = Number(input.value);
                this.rerender();
              }}/>
            </div>
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox">
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
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">{this.i18n.translate('json-schema-designer.maximum')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={numberItem.maximum} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.maximum = Number(input.value);
                this.rerender();
              }}/>
            </div>
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox">
                <label><input type="checkbox" checked={numberItem.exclusiveMaximum} onInput={(event) => {
                  const input = event.target as HTMLInputElement;
                  numberItem.exclusiveMaximum = input.checked;
                  this.rerender();
                }}/> {this.i18n.translate('json-schema-designer.exclusive')} </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.multiple-of')} </label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={numberItem.multipleOf} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                numberItem.multipleOf = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
        </form>
      </div>
    );

    const objectFields: JSX.Element = (
      <div class="col-lg-6">
        <form class="form-horizontal">
          <h4 class="t_color bold"> {this.i18n.translate('json-schema-designer.object')} </h4>
          <div class="form-group">
            <label class="control-label col-sm-2"> {this.i18n.translate('json-schema-designer.schema')} </label>
            <div class="col-sm-10">
              <input type="text" class="form-control" value={objectItem.schema} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.schema = input.value;
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">{this.i18n.translate('json-schema-designer.minimum-properties')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={objectItem.minProperties} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.minProperties = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">{this.i18n.translate('json-schema-designer.maximum-properties')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={objectItem.maxProperties} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.maxProperties = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox">
                <label>
                  <input type="checkbox" checked={objectItem.canHaveAdditionalProperties} onInput={(event) => {
                  const input = event.target as HTMLInputElement;
                  objectItem.canHaveAdditionalProperties = input.checked;
                  this.rerender();
                  }}/>
                  {this.i18n.translate('json-schema-designer.allow-additional-properties')}
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <label class="control-label col-sm-2">{this.i18n.translate('json-schema-designer.additional-properties')}</label>
            <div class="col-sm-10">
              <textarea class="form-control" value={objectItem.additionalProperties} onInput={(event) => {
                const input = event.target as HTMLInputElement;
                objectItem.additionalProperties = input.value;
                this.rerender();
              }} disabled={!objectItem.canHaveAdditionalProperties}/>
            </div>
          </div>
        </form>
      </div>
    );

    const arrayFields: JSX.Element = (
      <div class="col-lg-6">
        <form class="form-horizontal">
          <h4 class="t_color bold"> {this.i18n.translate('json-schema-designer.array')} </h4>
          <div class="form-group">
            <label class="col-sm-2 control-label">{this.i18n.translate('json-schema-designer.minimum-items')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={arrayItem.minItems} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.minItems = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <label class="col-sm-2 control-label">{this.i18n.translate('json-schema-designer.maximum-items')}</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" value={arrayItem.maxItems} min="1" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                arrayItem.maxItems = Number(input.value);
                this.rerender();
              }}/>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox">
                <label>
                  <input type="checkbox" checked={arrayItem.uniqueItems} onInput={(event) => {
                  const input = event.target as HTMLInputElement;
                  arrayItem.uniqueItems = input.checked;
                  this.rerender();
                  }}/>
                  {this.i18n.translate('json-schema-designer.unique-items')}
                </label>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
              <div class="checkbox">
                <label>
                  <input type="checkbox" checked={arrayItem.additionalItems} onInput={(event) => {
                    const input = event.target as HTMLInputElement;
                    arrayItem.additionalItems = input.checked;
                    this.rerender();
                  }}/>
                  {this.i18n.translate('json-schema-designer.additional-items')}
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    );

    const refFields: JSX.Element = (
      <div class="col-lg-12">
        <form class="form-horizontal">
          <div class="form-group">
            <label class="col-sm-2 control-label"> {this.i18n.translate('json-schema-designer.reference')} </label>
            <div class="col-sm-10">
              <select class="form-control input-sm" onInput={(event) => {
                const input = event.target as HTMLInputElement;
                const definitionName: string = input.value;
                refItem.$ref = definitionName;
                this.rerender();
              }}>
              <option value="" disabled selected={!refItem.$ref}>{this.i18n.translate('json-schema-designer.select-definition')}</option>
              {definitionReferences.map((name) =>
                <option>
                  <option selected={refItem.$ref === name}>{name}</option>
                </option>
              )}
              </select>
            </div>
          </div>
        </form>
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
        typeSpecificFields = ("");
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
