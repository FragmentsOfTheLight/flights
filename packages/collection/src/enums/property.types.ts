import { FieldMetadata } from '../metadata'
import { WidgetType } from './widget.types'

export type PropertiesData = {
  [key: string]: PropertyData
}

export type PropertyData = {
  field: FieldMetadata
  widget: WidgetType
}
