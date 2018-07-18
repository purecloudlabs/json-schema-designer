import { Component, Prop } from '@stencil/core';
import { ISchemaItem } from '../schema';

@Component({
  tag: 'app-item-details'
})
export class ItemDetailsComponent {
  @Prop() item: ISchemaItem;
  enumCtrlExpanded: boolean;

  // ngOnChanges() {
  //   if (this.item.enum && this.item.enum.length) {
  //     this.enumCtrlExpanded = true;
  //   }
  // }
}
