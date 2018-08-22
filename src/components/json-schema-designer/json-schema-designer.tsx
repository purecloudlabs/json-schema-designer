import { Component, Prop, State, Method } from '@stencil/core';
import { SchemaObject, ISchemaItem } from './schema';

@Component({
  tag: 'json-schema-designer',
  styleUrl: 'json-schema-designer.less',
  shadow: false
})
export class DesignerComponent {
  @Prop() inputschema: string;
  @Prop() inputtranslations: string;
  @Prop() viewmode: string = 'tabs';
  @Prop() debugmode: boolean = true;

  @Method()
  exportSchema() {
    console.log('inside of web component');
    return this.workingSchema.jsonSchemaString()
  }

  @Prop({ context: 'i18n' }) private i18n: any;

  @State() activeTab: string = 'designer';
  @State() _tickle: number = 0;

  workingSchema: any;

  constructor() {}

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

    //Load Translations
    if (typeof(this.inputtranslations) === 'string') {
      this.i18n.translations = JSON.parse(this.inputtranslations);
    } else if (this.inputtranslations) {
      this.i18n.translations = this.inputtranslations;
    }

    //Load Schema
    let startingSchema = this.debugmode ? testData : {};
    if (typeof(this.inputschema) === 'string') {
      startingSchema = JSON.parse(this.inputschema);
    }
    this.workingSchema = new SchemaObject(startingSchema, null);
  }

  rerender() {
    this._tickle++;
  }

  render() {
    const jsonOutput: string = this.workingSchema ? this.workingSchema.jsonSchemaString() : "";
    const definitions: ISchemaItem[] = this.workingSchema ? this.workingSchema.getDefinitions() : [];
    if (this.viewmode === 'tabs') {
      const desingerPillClass: string = this.activeTab === 'designer' ? 'nav-link active' : 'nav-link';
      const outputPillClass: string = this.activeTab === 'output' ? 'nav-link active' : 'nav-link';
      return (
        <div id="json-schema-designer" class="container">
          <div class="p-3">
            <ul class="nav nav-pills justify-content-center">
              <li class="btn nav-item">
                <div class={desingerPillClass} onClick={() => { this.activeTab = 'designer' }}> Designer </div>
              </li>
              <li class="btn nav-item">
                <div class={outputPillClass} onClick={() => { this.activeTab = 'output' }}> Output </div>
              </li>
            </ul>
          </div>
          <div class="row">
            {this.activeTab === 'designer'
              ? <div class="col-lg-12">
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
                    }}><i class="fa fa-plus"></i> {this.i18n.translate('json-schema-designer.add-definition')}</button>
                  </div>
                </div>
              : <div class="col-lg-12">
                  <div class="card card-body bg-light">
                    <div class="text-center">
                      <button class="btn btn-secondary btn-sm" onClick={() => this.exportSchema()}> {this.i18n.translate('json-schema-designer.export')} </button>
                    </div>
                    <pre> { jsonOutput }</pre>
                  </div>
                </div>
            }
          </div>
        </div>

      );
    } else if (this.viewmode === 'columns') {
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
                }}><i class="fa fa-plus"></i> {this.i18n.translate('json-schema-designer.add-definition')}</button>
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
    } else {
      console.error('view mode:', '"' + this.viewmode + '"', 'not supported');
      return (
        <div class="container">
          <h4 class='text-danger'> {this.i18n.translate('json-schema-designer.view-mode-not-supported')}</h4>
        </div>
      );
    }
  }
}
