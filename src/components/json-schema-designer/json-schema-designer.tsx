import { Component, Prop, State } from '@stencil/core';
import { SchemaObject, ISchemaItem } from './schema';

@Component({
  tag: 'json-schema-designer',
  styleUrl: 'json-schema-designer.less',
  shadow: false
})
export class DesignerComponent {
  @Prop() inputSchema: any;
  @Prop() outputSchemaCallback: any;
  @State() rerenderTickle: number;

  workingSchema: any;

  constructor() {}

  exportSchema() {
    this.outputSchemaCallback && this.outputSchemaCallback(this.workingSchema.jsonSchemaString());
  }

  componentWillLoad() {
    this.rerenderTickle = 0;
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
    console.log('workingSchema:', this.workingSchema);
  }

  rerender() {
    this.rerenderTickle += 1;
  }

  render() {
    const jsonOutput: string = this.workingSchema ? this.workingSchema.jsonSchemaString() : "";
    const definitions: ISchemaItem[] = this.workingSchema ? this.workingSchema.getDefinitions() : [];
    return (
      <div class="json-schema-builder container">
        <div class="row">
          <div class="col-lg-6">
            <h5> Schema </h5>
              <app-schema-row item={ this.workingSchema } parent={this}></app-schema-row>
            <h5> Definitions </h5>
            {definitions.map((definition) =>
                <app-schema-row item={definition} parent={this} ></app-schema-row>
            )}
            <div class="text-center">
              <button class="btn btn-secondary btn-sm" onClick={()=> {
                console.log('add definition');
                this.workingSchema.addDefinition();
                this.rerender();
              }}><i class="fas fa-plus"></i> Add Definition</button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card card-body bg-light">
              <div class="text-center">
                <button class="btn btn-secondary btn-sm" onClick={() => this.exportSchema()}> Export </button>
              </div>
              <pre> { jsonOutput }</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
//
// <div class="container">
//   <div class="row">
//     <div class="col-lg-6"> <!-- Left Pane -->
//       <h5> Schema </h5>
//       <app-schema-row [item]="schemaReaderService.workingSchema"></app-schema-row>
//       <h5> Definitions </h5>
//       <div *ngFor="let definition of schemaReaderService.workingSchema.getDefinitions()">
//         <app-schema-row [item]="definition"></app-schema-row>
//       </div>
//       <div class="text-center">
//         <button class="btn btn-secondary btn-sm" (click)="schemaReaderService.workingSchema.addDefinition()"><fa-icon icon="plus"></fa-icon> Add Definition</button>
//       </div>
//     </div>
//     <div class="col-lg-6"> <!-- Right Pane -->
//       <div class="card card-body bg-light">
//         <div class="text-center">
//           <button class="btn btn-secondary btn-sm" (click)="exportSchema()"><fa-icon></fa-icon> Export </button>
//         </div>
//         <pre *ngIf="schemaReaderService.workingSchema"> {{schemaReaderService.workingSchema.jsonSchemaString()}}</pre>
//       </div>
//     </div>
//   </div>
// </div>
