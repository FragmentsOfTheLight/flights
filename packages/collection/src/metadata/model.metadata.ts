import { Metadata } from '@lights/core/src/contracts'
import { ModelManagerAction } from '../enums/model-manager.types'
import { pick } from 'lodash'
import { plural } from 'pluralize'

export type ModelManagerActionMap = {
  [key in ModelManagerAction]?: string
}

export interface ModelMetadataOptions {
  name?: string
  identifier?: string
  routePrefix?: string
  routes?: ModelManagerActionMap | ModelManagerAction[]
}

export interface ModelMetadataArgs {
  name?: string
  identifier?: string
  routePrefix?: string
  routes?: ModelManagerActionMap | ModelManagerAction[]
  errors?: boolean
  history?: boolean
}

export class ModelMetadata implements Metadata {
  name: string
  routes: ModelManagerActionMap
  identifier?: string
  errors?: boolean
  history?: boolean

  constructor(args: ModelMetadataArgs) {
    this.name = args.name ?? ''
    if (args.identifier) this.identifier = args.identifier
    if (args.errors) this.errors = args.errors
    if (args.history) this.history = args.history
    args.name = plural(this.name)
    if (args.routes) {
      if (args.routes instanceof Array) {
        this.routes = pick(
          {
            fetch: `${args.routePrefix ?? ''}${args.name}`,
            find: `${args.routePrefix ?? ''}${args.name}/:id`,
            create: `${args.routePrefix ?? ''}${args.name}`,
            delete: `${args.routePrefix ?? ''}${args.name}/:id`,
            update: `${args.routePrefix ?? ''}${args.name}/:id`,
          },
          args.routes,
        )
      } else {
        this.routes = args.routes
      }
    } else {
      this.routes = {
        fetch: `${args.routePrefix ?? ''}${args.name}`,
        find: `${args.routePrefix ?? ''}${args.name}/:id`,
        create: `${args.routePrefix ?? ''}${args.name}`,
        delete: `${args.routePrefix ?? ''}${args.name}/:id`,
        update: `${args.routePrefix ?? ''}${args.name}/:id`,
      }
    }
  }

  toObject(): { [p: string]: any } {
    return {
      name: this.name,
      identifier: this.identifier,
    }
  }
}
