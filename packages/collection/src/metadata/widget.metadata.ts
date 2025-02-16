import { Metadata } from '@lights/core/contracts'
import { WidgetType } from '../enums'

export class WidgetMetadata implements Metadata {
  widget: WidgetType

  constructor(widget: WidgetType) {
    this.widget = widget
  }

  toObject(): { [p: string]: any } {
    return this.widget
  }
}
