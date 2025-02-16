import { Metadata } from '@flights/core/src/contracts'

export interface NestedMetadataOptions<T> {
  (data: object): T
}

export interface NestedMetadataArgs<T> {
  nest: NestedMetadataOptions<T>
}

export class NestedMetadata<T> implements Metadata {
  nest: NestedMetadataOptions<T>

  constructor(args: NestedMetadataArgs<T>) {
    this.nest = args.nest
  }

  toObject(): { [p: string]: any } {
    return {
      type: this.nest,
    }
  }
}
