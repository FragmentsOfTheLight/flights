/* jshint esversion: 6 */

import { ModelManagerAction } from './enums/model-manager.types'
import {
  copyAvailableProps,
  copySomeProps,
  isUndefined,
  mergeAvailableProps,
  Repository,
  RepositoryUploadData,
} from '@lights/core'
import { RepositoryQueryOptions } from '@lights/core/contracts'
import { ModelActionNotPermittedError } from './errors/model-manager.errors'
import {
  getClassMetadata,
  getPropertyMetadata,
  mergeClassMetadata,
} from '@lights/core/src/metadata'
import {
  MetadataKeyTypes,
  ModelState,
  PropertiesData,
  WidgetType,
} from './enums'
import {
  FieldMetadata,
  FieldTagConfig,
  ModelManagerActionMap,
  ModelMetadata,
  WidgetMetadata,
} from './metadata'
import { Collection } from './collection'
import { plural } from 'pluralize'

export class ModelManager {
  _repository: Repository

  constructor(repository: Repository) {
    this._repository = repository
  }

  get repository() {
    return this._repository
  }

  public getRouteOrDie<Model extends object>(
    model: Model,
    action: ModelManagerAction,
  ) {
    const route = this.getRoute(model, action)
    if (route === undefined) {
      throw new ModelActionNotPermittedError(model, action)
    }
    return route
  }

  public getModelMetadata<Model extends object>(model: Model): ModelMetadata {
    return getClassMetadata<ModelMetadata>(
      MetadataKeyTypes.MODEL_METADATA,
      model,
    )
  }

  public getRoutes<Model extends object>(model: Model): ModelManagerActionMap {
    return this.getModelMetadata(model).routes ?? {}
  }

  public getRoute<Model extends object>(
    model: Model,
    action: ModelManagerAction,
  ): string | undefined {
    return this.getRoutes(model)[action]
  }

  public can<Model extends object>(
    model: Model,
    action: ModelManagerAction,
  ): boolean {
    return this.getRoutes(model)[action] !== undefined
  }

  public getPrototypeOf<Model extends object>(model: Model) {
    if (model instanceof Function) {
      return model.prototype
    } else {
      return Object.getPrototypeOf(model)
    }
  }

  public getProperties<Model extends object>(model: Model) {
    model = this.getPrototypeOf(model)
    const readFields = getClassMetadata<FieldTagConfig>(
      MetadataKeyTypes.FIELD_TAGS_METADATA,
      model,
    )
    if (readFields && readFields.editable) {
      return readFields
    }
    const props = Object.keys(model)
    const fields: FieldTagConfig = {
      visible: {},
      editable: {},
      bulkEditable: {},
      searchable: {},
      sortable: {},
    }
    props.forEach(prop => {
      const metadata = getPropertyMetadata<FieldMetadata>(
        MetadataKeyTypes.FIELD_METADATA,
        model,
        prop,
      )
      const propMetadata = {
        field: metadata,
        widget: this.getPropertyWidget(model, prop),
      }
      if (metadata.visible) fields.visible[prop] = propMetadata
      if (metadata.editable) fields.editable[prop] = propMetadata
      if (metadata.bulkEditable) fields.bulkEditable[prop] = propMetadata
      if (metadata.searchable) fields.searchable[prop] = propMetadata
      if (metadata.sortable) fields.sortable[prop] = propMetadata
    })
    mergeClassMetadata<FieldTagConfig>(
      MetadataKeyTypes.FIELD_TAGS_METADATA,
      fields,
      model,
    )
    return fields
  }

  public getVisibleProperties<Model extends object>(
    model: Model,
  ): PropertiesData {
    return this.getProperties(model).visible
  }
  public getEditableProperties<Model extends object>(
    model: Model,
  ): PropertiesData {
    return this.getProperties(model).editable
  }
  public getSearchableProperties<Model extends object>(
    model: Model,
  ): PropertiesData {
    return this.getProperties(model).searchable
  }
  public getBulkEditableProperties<Model extends object>(
    model: Model,
  ): PropertiesData {
    return this.getProperties(model).bulkEditable
  }

  public getVisibleData<Model extends object>(model: Model): PropertiesData {
    const props = Object.keys(this.getVisibleProperties(model))
    const object = {}
    copySomeProps(model, object, props)
    return object
  }
  public getEditableData<Model extends object>(model: Model): PropertiesData {
    const props = Object.keys(this.getEditableProperties(model))
    const object = {}
    copySomeProps(model, object, props, true)
    return object
  }
  public getSearchableData<Model extends object>(model: Model): PropertiesData {
    const props = Object.keys(this.getSearchableProperties(model))
    const object = {}
    copySomeProps(model, object, props)
    return object
  }
  public getBulkEditableData<Model extends object>(
    model: Model,
  ): PropertiesData {
    const props = Object.keys(this.getBulkEditableProperties(model))
    const object = {}
    copySomeProps(model, object, props, true)
    return object
  }

  public getIdentifier<Model extends object>(
    model: Model,
  ): string | Array<string> {
    model = this.getPrototypeOf(model)
    return this.getModelMetadata(model).identifier ?? 'id'
  }

  public getIdentifierValue<Model extends object>(
    model: Model,
  ): number | string {
    const identifier = this.getIdentifier(model)
    if (identifier instanceof Array) {
      return 1
    } else {
      // @ts-ignore
      return model[identifier] as string
    }
  }

  public getPropertyWidget<Model extends object>(
    model: Model,
    property: string,
  ): WidgetType {
    const widget = getPropertyMetadata<WidgetMetadata>(
      MetadataKeyTypes.WIDGET_METADATA,
      model,
      property,
    )
    if (widget.widget && widget.widget.type) {
      return widget.widget
    } else {
      return {
        type: 'text',
        size: 12,
        label: property,
      }
    }
  }

  public async fetch<Model extends object>(
    collection: Collection<Model>,
    options?: RepositoryQueryOptions,
  ) {
    const route = this.getRouteOrDie(
      collection.modelPrototype.prototype,
      'fetch',
    )
    const metadata = this.getModelMetadata(collection.modelPrototype.prototype)
    this.setState(collection, 'fetching')
    const result = await this._repository.fetch(route, options)
    collection.clear()
    if (metadata.name.length > 0) {
      collection.append((result.data as any)[plural(metadata.name)] ?? [])
    } else {
      collection.append((result.data as any) ?? [])
    }
    if (result.meta?.page) collection.pagination = result.meta?.page
    this.setState(collection, 'fetched')
    return result
  }

  public async add<Model extends object>(
    model: Model,
    options?: RepositoryQueryOptions,
  ) {
    const route = this.getRouteOrDie(model, 'create')
    const metadata = this.getModelMetadata(model)
    this.setState(model, 'saving')
    const result = await this._repository.add<Model, any>(
      route,
      this.getEditableData(model),
      options,
    )
    if (result.data)
      copyAvailableProps((result.data as any)[metadata.name] ?? {}, model)
    this.setState(model, 'saved')
    return result
  }

  public clear<Model extends object>(model: Model) {
    try {
      ;(model as any).$ = {}
    } catch (e) {
      console.log('failed to clear model', e)
    }
  }

  public async find<Model extends object>(
    model: Model,
    identifier?: number | string,
    options?: RepositoryQueryOptions,
  ) {
    const route = this.getRouteOrDie(model, 'find')
    const metadata = this.getModelMetadata(model)
    if (isUndefined(identifier)) {
      identifier = this.getIdentifierValue(model)
    }
    this.setState(model, 'fetching')
    const result = await this._repository.find<Model>(
      route,
      identifier ?? 0,
      options,
    )
    if (result.data)
      if (metadata.name.length > 0) {
        copyAvailableProps((result.data as any)[metadata.name] ?? {}, model)
      } else {
        copyAvailableProps((result.data as any) ?? {}, model)
      }
    this.setState(model, 'fetched')
    return result
  }

  public async save<Model extends object>(
    model: Model,
    identifier?: number | string,
    options?: RepositoryQueryOptions,
  ) {
    const route = this.getRouteOrDie(model, 'update')
    const metadata = this.getModelMetadata(model)
    if (isUndefined(identifier)) {
      identifier = this.getIdentifierValue(model)
    }
    this.setState(model, 'saving')
    const result = await this._repository.save<Model, any>(
      route,
      identifier ?? 0,
      this.getEditableData(model),
      options,
    )
    if (result.data)
      copyAvailableProps((result.data as any)[metadata.name] ?? {}, model)
    this.setState(model, 'saved')
    return result
  }

  public async delete<Model extends object>(
    model: Model,
    identifier?: number | string,
    options?: RepositoryQueryOptions,
  ) {
    const route = this.getRouteOrDie(model, 'delete')
    const metadata = this.getModelMetadata(model)
    if (isUndefined(identifier)) {
      identifier = this.getIdentifierValue(model)
    }
    this.setState(model, 'deleting')
    const result = await this._repository.delete<Model>(
      route,
      identifier ?? 0,
      options,
    )
    if (result.data)
      copyAvailableProps((result.data as any)[metadata.name] ?? {}, model)
    this.setState(model, 'deleted')
    return result
  }

  getModelName<Model extends object>(model: Model) {
    const metadata = this.getModelMetadata(model)
    return metadata.name
  }

  public async uploadFile<Model extends object>(
    model: Model,
    data: RepositoryUploadData | RepositoryUploadData[],
    options?: RepositoryQueryOptions,
  ) {
    const route = this.getRouteOrDie(model, 'create') + '/media'
    const metadata = this.getModelMetadata(model)
    this.setState(model, 'uploading')
    const result = await this._repository.uploadFile<Model>(
      route,
      data,
      options,
    )
    this.setState(model, 'uploaded')
    if (result.data) {
      mergeAvailableProps((result.data as any)[metadata.name] ?? {}, model)
    }
    return result
  }

  public async deleteFile<Model extends object>(
    model: Model,
    identifier: number | string,
    options?: RepositoryQueryOptions,
  ) {
    const route = this.getRouteOrDie(model, 'create') + '/media/:id'
    const result = await this._repository.deleteFile<Model>(
      route,
      identifier,
      options,
    )
    return result
  }

  clone<Model extends object>(model: Model, copyData = true): Object {
    let newObject = new (Object.getPrototypeOf(model).constructor)()
    if (copyData) copyAvailableProps(model, newObject)
    else {
      newObject[String(this.getIdentifier(model))] =
        this.getIdentifierValue(model)
    }
    return newObject
  }

  getState(object: any): ModelState {
    return object.state ?? 'empty'
  }

  setState(object: any, state: ModelState): void {
    if (object.state) {
      object.state = state
    }
  }
}
