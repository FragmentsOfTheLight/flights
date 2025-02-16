import { getPropertyMetadata } from '../metadata'
import { CastMetadata, MetadataKeyTypes } from '@flights/collection'
import { NestedMetadata } from '@flights/collection/src/metadata/nested.metadata'

export function isString(object: any) {
  return typeof object === 'string' || object instanceof String
}

export function isNumber(object: any) {
  return typeof object === 'number' || object instanceof Number
}

export function isUndefined(object: any) {
  return object === undefined
}

export function isConstructor(object: any) {
  return !!object.prototype && !!object.prototype.constructor.name
}

/**
 * Maps properties from source to target if target has this property
 * @param source Source object to copy properties from
 * @param target Target object to copy properties to
 */
export function copyAvailableProps(source: any, target: any): any {
  const prototype = Object.getPrototypeOf(target)
  for (const key in source) {
    if (prototype.hasOwnProperty(key)) {
      // console.log('has', key, typeof source[key])
      if (source[key] instanceof Object) {
        const nestedMetadata = getPropertyMetadata<NestedMetadata<any>>(
          MetadataKeyTypes.NESTED_METADATA,
          target,
          key,
        )
        if (Object.keys(nestedMetadata).length > 0) {
          target[key] = nestedMetadata.nest(source[key])
        } else {
          target[key] = source[key]
        }
      } else {
        target[key] = source[key]
      }
    }
  }
  return target
}

export function mergeAvailableProps(source: any, target: any): any {
  const prototype = Object.getPrototypeOf(target)
  for (const key in source) {
    if (prototype.hasOwnProperty(key)) {
      if (target[key] instanceof Array) {
        if (source[key] instanceof Array) {
          source[key].forEach((item: any) => {
            target[key].push(item)
          })
        } else {
          target[key].push(source[key])
        }
      } else {
        if (source[key] instanceof Array) {
          target[key] = [target[key]]
          source[key].forEach((item: any) => {
            target[key].push(item)
          })
        } else {
          target[key] = source[key]
        }
      }
    }
  }
  return target
}

/**
 * Copies every property from source to target
 * @param source Source object to copy properties from
 * @param target Target object to copy properties to
 */
export function copyProps(source: any, target: any): any {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key]
    }
  }
  return target
}

/**
 * Copies every property from source to target
 * @param source Source object to copy properties from
 * @param target Target object to copy properties to
 * @param props Properties that get copied
 */
export function copySomeProps(
  source: any,
  target: any,
  props: string[],
  doCast = false,
): any {
  props.forEach(key => {
    if (doCast) {
      const cast = getPropertyMetadata<CastMetadata>(
        MetadataKeyTypes.CAST_METADATA,
        source,
        key,
      )
      if (cast && cast.mutate) {
        target[key] = cast.mutate(source, key, source[key])
      } else {
        target[key] = source[key]
      }
    } else {
      target[key] = source[key]
    }
    // console.log(
    //   'check',
    //   key,
    //   source.hasOwnProperty(key),
    //   Object.keys(source),
    //   source,
    // )
    // if (source.hasOwnProperty(key)) {
    // }
  })
  return target
}

/**
 * Maps properties from source to target based on provided mapping
 * @param source Source object to copy properties from
 * @param target Target object to copy properties to
 * @param mapping One to one name mapping between source and target properties
 */
export function mapProps(
  source: any,
  target: any,
  mapping: { [key: string]: string },
): any {
  for (const key in source) {
    if (source.hasOwnProperty(key) && mapping.hasOwnProperty(key)) {
      target[mapping[key]] = source[key]
    }
  }
  return target
}
