import {
  getPropertyMetadata,
  mergePropertyMetadata,
} from '@lights/core/src/metadata'
import { WidgetMetadata } from '../metadata'
import { MetadataKeyTypes, WidgetType } from '../enums'

export function Widget(widgetOptions: WidgetType): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    mergePropertyMetadata(
      MetadataKeyTypes.WIDGET_METADATA,
      new WidgetMetadata({
        ...widgetOptions,
      }),
      target,
      propertyKey,
    )
  }
}
