import { Component, Prop, State } from '@stencil/core';
import { SchemaObject, ISchemaItem } from './schema';

declare var $: any;

@Component({
  tag: 'json-schema-designer',
  styleUrl: 'json-schema-designer.less',
  shadow: false
})
export class DesignerComponent {
  @Prop() inputSchema: any;
  @Prop() inputTranslations: any;
  @Prop() outputSchemaCallback: any;

  @Prop({ context: 'i18n' }) private i18n: any;

  @State() _tickle: number = 0;

  workingSchema: any;

  constructor() {}

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
    this.workingSchema = new SchemaObject(testData, null);
    if (this.inputTranslations) this.i18n.transtions = this.inputTranslations;
  }

  componentDidLoad() {
    console.log('Component has been rendered');
    $('[data-toggle="tooltip"]').tooltip();
  }

  rerender() {
    this._tickle++;
  }

  render() {
    const jsonOutput: string = this.workingSchema ? this.workingSchema.jsonSchemaString() : "";
    const definitions: ISchemaItem[] = this.workingSchema ? this.workingSchema.getDefinitions() : [];
    return (
      <div class="json-schema-builder container">
        <div class="row">
          <div class="col-lg-6">
            <h5> {this.i18n.translate('json-schema-designer.schema')} </h5>
              <schema-row item={ this.workingSchema } parent={this}></schema-row>
            <h5> {this.i18n.translate('json-schema-designer.definitions')} </h5>
            {definitions.map((definition) =>
                <schema-row item={definition} parent={this} ></schema-row>
            )}
            <div class="text-center">
              <button class="btn btn-secondary btn-sm" onClick={()=> {
                this.workingSchema.addDefinition();
                this.rerender();
              }}><i class="fas fa-plus"></i> {this.i18n.translate('json-schema-designer.add-definition')}</button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card card-body bg-light">
              <div class="text-center">
                <button class="btn btn-secondary btn-sm" onClick={() => this.exportSchema()}> {this.i18n.translate('json-schema-designer.export')} </button>
              </div>
              <pre> { jsonOutput }</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
