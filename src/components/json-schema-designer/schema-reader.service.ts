// import { Injectable } from '@angular/core';
import { SchemaObject } from './schema';

// @Injectable({ providedIn: 'root' })
export class SchemaReaderService {
  public workingSchema: SchemaObject;
  public loadSchema (jsonSchemaObject: any): void {
    this.workingSchema = new SchemaObject(jsonSchemaObject, null);
  }
}
