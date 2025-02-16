export type ModelState =
  | 'empty'
  | 'fetching'
  | 'saving'
  | 'saved'
  | 'fetched'
  | 'modified'
  | 'uploading'
  | 'uploaded'
  | 'deleting'
  | 'deleted'

export type ModelStateKeys = 'model-state'
