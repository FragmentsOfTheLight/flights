import { Metadata } from '@lights/core/src/contracts'
import { PropertiesData } from '../enums'

export type FieldTag =
  | 'visible'
  | 'searchable'
  | 'editable'
  | 'bulkEditable'
  | 'sortable'

export type FieldTagConfig = {
  [key in FieldTag]: PropertiesData
}

export type FieldMetadataOptions = {
  name?: string
} & {
  [key in FieldTag]?: boolean
}

export type FieldMetadataArgs = {
  name: string
} & {
  [key in FieldTag]: boolean
}

export class FieldMetadata implements Metadata {
  name?: string
  visible?: boolean
  searchable?: boolean
  editable?: boolean
  bulkEditable?: boolean
  sortable?: boolean

  constructor(args: FieldMetadataArgs) {
    this.name = args.name
    this.visible = args.visible
    this.searchable = args.searchable
    this.editable = args.editable
    this.bulkEditable = args.bulkEditable
    this.sortable = args.sortable
  }

  toObject(): { [p: string]: any } {
    return {
      name: this.name,
      visible: this.visible,
      searchable: this.searchable,
      editable: this.editable,
      bulkEditable: this.bulkEditable,
    }
  }
}
