import { Mutator } from '@lights/core/contracts'

export class StringPrefixMutator implements Mutator {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  mutate(value: any) {
    if (value instanceof String) {
      return this.prefix + value
    }
    return value
  }
}

export class StringPostfixMutator implements Mutator {
  private postfix: string

  constructor(postfix: string) {
    this.postfix = postfix
  }

  mutate(value: any) {
    if (value instanceof String) {
      return value + this.postfix
    }
    return value
  }
}

export class StringBrToLnMutator implements Mutator {
  mutate(value: any) {
    if (value instanceof String) {
      if (value === null || value === undefined) {
        return ''
      }
      return value.replace(/<br\s*\/?>/gm, '\n')
    }
    return value
  }
}

export class StringLnToBrMutator implements Mutator {
  mutate(value: any) {
    if (value instanceof String) {
      if (value === null || value === undefined) {
        return ''
      }
      return value.replace(/\n/g, '<br/>')
    }
    return value
  }
}
