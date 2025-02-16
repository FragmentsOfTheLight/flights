import { Constructor } from '../../../core'

export type WidgetSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface SizedWidget {
  size: WidgetSize
}

export interface LabeledWidget {
  label: string
}

export interface HiddenWidget extends SizedWidget, LabeledWidget {
  type: 'hidden'
}
export interface TextWidget extends SizedWidget, LabeledWidget {
  type: 'text'
  hint?: string
}
export interface CheckboxWidget extends SizedWidget, LabeledWidget {
  type: 'checkbox'
  hint?: string
}
export interface TextAreaWidget extends SizedWidget, LabeledWidget {
  type: 'text-area'
  hint?: string
}
export interface TextEditorWidget extends SizedWidget, LabeledWidget {
  type: 'text-editor'
  hint?: string
}
export interface RichEditorWidget extends SizedWidget, LabeledWidget {
  type: 'rich-editor'
  hint?: string
}
export interface DateWidget extends SizedWidget, LabeledWidget {
  type: 'date'
  hint?: string
}
export interface DatetimeWidget extends SizedWidget, LabeledWidget {
  type: 'datetime'
  hint?: string
}
export interface JsonTableWidget extends SizedWidget, LabeledWidget {
  type: 'json-table'
  from: Function
  hint?: string
  optionKey?: string
  optionInputKey?: string
  optionInputLabel?: string
  optionLabel?: string
  inputWidget?: WidgetType
  fetch?: boolean
}
export interface JsonArrayWidget extends SizedWidget, LabeledWidget {
  type: 'json-array'
  hint?: string
  create?: boolean
  pageSize?: number
  keys: {
    [key: string]: {
      widget: WidgetType
      inlineEdit?: boolean
      visible?: boolean
    }
  }
}
export interface SelectWidget extends SizedWidget, LabeledWidget {
  type: 'select'
  from: Function
  hint?: string
  optionValue?: string
  optionLabel?: string
  fetch?: boolean
}
export interface MultiSelectWidget extends SizedWidget, LabeledWidget {
  type: 'multi-select'
  from: Function
  hint?: string
  optionValue?: string
  optionLabel?: string
  fetch?: boolean
}
export interface FileWidget extends SizedWidget, LabeledWidget {
  type: 'file'
  hint?: string
  removable?: boolean
  fileType?: string
  maxNumberOfFiles?: number
  maxFileSize?: number
  maxUploadSize?: number
}

export type WidgetType =
  | HiddenWidget
  | TextWidget
  | SelectWidget
  | MultiSelectWidget
  | FileWidget
  | TextAreaWidget
  | TextEditorWidget
  | CheckboxWidget
  | JsonTableWidget
  | RichEditorWidget
  | DateWidget
  | DatetimeWidget
  | JsonArrayWidget
