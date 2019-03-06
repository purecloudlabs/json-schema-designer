import { Component, Prop, State, Method, Watch, Event, EventEmitter } from '@stencil/core';
import { ISchemaItem, SchemaRoot, createAppropriateSchemaItem } from './schema';

const TEST_DEFINITIONS = {
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
  },
  "definition2": {
    "type": [
      "string"
    ],
    "title": "definition2",
    "description": "this is a definition"
  }
};
const TEST_SCHEMAS = [
  {
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
    "definitions": TEST_DEFINITIONS
  },
  {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "array",
    "properties": {},
    "items": {
      "$schema": "http://json-schema.org/draft-04/schema#",
      "title": "Account",
      "type": "object",
      "description": "A Salesforce account.",
      "required": [ "Id" ],
      "properties": {
        "Id": {
          "type": "string",
          "description": "The ID of the account."
        },
        "Name": {
          "type": "string",
          "description": "The name of the account."
        },
        "AccountNumber": {
          "type": "string",
          "description": "The account number."
        },
        "Phone": {
          "type": "string",
          "description": "The phone number associated with the account."
        },
        "BillingStreet": { "type": "string", "description": "The billing street address." }, "BillingCity": { "type": "string", "description": "The billing city." }, "BillingState": { "type": "string", "description": "The billing state." }, "BillingPostalCode": { "type": "string", "description": "The billing postal code." }, "BillingCountry": { "type": "string", "description": "The billing country." }, "ShippingStreet": { "type": "string", "description": "The shipping street address." }, "ShippingCity": { "type": "string", "description": "The shipping city." }, "ShippingState": { "type": "string", "description": "The shipping state." }, "ShippingPostalCode": { "type": "string", "description": "The shipping postal code." }, "ShippingCountry": { "type": "string", "description": "The shipping country." }
      }
    }
  },
  {}
];

@Component({
  tag: 'json-schema-designer',
  styleUrl: 'json-schema-designer.less',
  shadow: false
})
export class DesignerComponent {
  @Prop() inputschema: string;
  @Prop() inputtranslations: string;
  @Prop() viewmode: string = 'columns'; //tabs, columns, designerOnly
  @Prop() debugmode: boolean = false;

  @Method()
  exportSchema() {
    try {
      return this.workingSchema.jsonSchemaString()
    } catch (e) {
      this.error.emit(e);
    }
  }

  @Event() error: EventEmitter;
  @Event() change: EventEmitter;

  @Watch('inputschema')
  watchHandler() {
    this._loadSchema();
  }

  @Prop({ context: 'i18n' }) private i18n: any;
  @State() activeTab: string = 'designer';
  @State() _tickle: number = 0;
  workingSchema: SchemaRoot;

  componentWillLoad() {
    //Load Translations
    if (typeof(this.inputtranslations) === 'string') {
      this.i18n.translations = JSON.parse(this.inputtranslations);
    } else if (this.inputtranslations) {
      this.i18n.translations = this.inputtranslations;
    }

    //Load Schema
    this._loadSchema();
  }

  rerender() {
    this._tickle++;
  }

  changeRootType(type: string) {
    //grab definitions
    let definitions = this.workingSchema.definitions || {};
    let newRoot: SchemaRoot = this.workingSchema.copy(type) as SchemaRoot;
    newRoot.definitions = definitions;
    Object.values(definitions).forEach((definition: ISchemaItem) => {
      definition.parent = newRoot;
    });
    this.workingSchema = newRoot;
  }

  private lastOutput : String = ''

  _loadSchema() {
    let startingSchema: any = this.debugmode ? TEST_SCHEMAS[0] : this.inputschema;
    try {
      if (typeof(startingSchema) === 'string') {
        startingSchema = JSON.parse(startingSchema);
      }
      if (startingSchema.type !== 'object' && startingSchema.type !== 'array') {
        throw new Error('root schema must have type object or array. Loading empty object schema');
      }
      this.workingSchema = createAppropriateSchemaItem(startingSchema, null) as SchemaRoot;
    } catch (error) {
      this.error.emit(error);
      startingSchema = { type: 'object' }
      this.workingSchema = createAppropriateSchemaItem(startingSchema, null) as SchemaRoot;
    }
  }

  render() {
    const jsonOutput: string = this.workingSchema ? this.workingSchema.jsonSchemaString() : "";
    if (this.lastOutput !== jsonOutput) {
      this.lastOutput = jsonOutput;
      this.change.emit(jsonOutput);
    }
    const definitions: ISchemaItem[] = this.workingSchema ? this.workingSchema.getDefinitions() : [];
    const designer: JSX.Element = (
      <div>
        <h5> {this.i18n.translate('json-schema-designer.schema')} </h5>
          <schema-row item={ this.workingSchema } parent={ this } definitions={ definitions }></schema-row>
        { definitions.length
          ? <div>
              <h5> {this.i18n.translate('json-schema-designer.definitions')} </h5>
              {definitions.map((definition) =>
                  <schema-row item={definition} parent={this} definitions={ definitions }></schema-row>
              )}
            </div>
          : <div></div>
        }
        <div class="row">
          <div class="col-sm-12">
            <button class="btn btn-link btn-xs pull-right" onClick={()=> {
              this.workingSchema.addDefinition();
              this.rerender();
            }}>
              <span> {this.i18n.translate('json-schema-designer.add-definition')} </span>
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    );
    if (this.viewmode === 'tabs') {
      const desingerPillClass: string = this.activeTab === 'designer' ? 'btn btn-primary' : 'btn btn-default';
      const outputPillClass: string = this.activeTab === 'output' ? 'btn btn-primary' : 'btn btn-default';
      return (
        <div id="json-schema-designer" class="container">
          <div class="row">
            <div class="tabs">
              <div class={desingerPillClass} onClick={() => { this.activeTab = 'designer' }}> Designer </div>
              <div class={outputPillClass} onClick={() => { this.activeTab = 'output' }}> Output </div>
            </div>
          </div>
          <div class="row">
            {this.activeTab === 'designer'
              ? <div class="col-lg-12">
                { designer }
                </div>
              : <div class="col-lg-12">
                  <pre> { jsonOutput }</pre>
                </div>
            }
          </div>
        </div>
      );
    } else if (this.viewmode === 'columns') {
      return (
        <div id="json-schema-designer" class="container">
          <div class="row">
            <div class="col-lg-6">
              { designer }
            </div>
            <div class="col-lg-6">
              <pre> { jsonOutput }</pre>
            </div>
          </div>
        </div>
      );
    } else if (this.viewmode === 'designerOnly') {
      return (
        <div id="json-schema-designer" class="container">
          <div class="row">
            <div class="col-lg-12">
              { designer }
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
