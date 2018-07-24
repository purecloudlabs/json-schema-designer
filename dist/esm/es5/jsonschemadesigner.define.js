// jsonschemadesigner: Custom Elements Define Library, ES Module/ES5 Target
import { defineCustomElement } from './jsonschemadesigner.core.js';
import {
  DesignerComponent,
  ItemDetailsComponent,
  SchemaRowComponent
} from './jsonschemadesigner.components.js';

export function defineCustomElements(window, opts) {
  defineCustomElement(window, [
    DesignerComponent,
    ItemDetailsComponent,
    SchemaRowComponent
  ], opts);
}