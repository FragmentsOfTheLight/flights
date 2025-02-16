import { Metadata, ModelCastFunction } from '@lights/core/contracts'

export interface CastMetadataOptions {
  get?: ModelCastFunction<any>
  set?: ModelCastFunction<any>
  mutate?: ModelCastFunction<any>
  access?: ModelCastFunction<any>
}

export interface CastMetadataArgs {
  get?: ModelCastFunction<any>
  set?: ModelCastFunction<any>
  mutate?: ModelCastFunction<any>
  access?: ModelCastFunction<any>
}

export class CastMetadata implements Metadata {
  get?: ModelCastFunction<any>
  set?: ModelCastFunction<any>
  mutate?: ModelCastFunction<any>
  access?: ModelCastFunction<any>

  constructor(args: CastMetadataArgs) {
    this.get = args.get
    this.set = args.set
    this.mutate = args.mutate
    this.access = args.access
  }

  toObject(): { [p: string]: any } {
    return {
      get: this.get,
      set: this.set,
      mutate: this.mutate,
      access: this.access,
    }
  }
}
