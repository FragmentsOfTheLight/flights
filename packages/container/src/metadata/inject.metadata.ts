import { ContainerBinding } from '@flights/core/src/contracts'

export interface InjectMetadataOptions {
  key: string
  bind: ContainerBinding
}

export interface InjectMetadataArgs {
  bind: ContainerBinding
}

export class InjectMetadata {
  constructor(args: InjectMetadataArgs) {}
}
