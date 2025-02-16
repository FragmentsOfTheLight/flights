// export function Injectable(value?: boolean) {
//     return function (
//       target: any,
//       propertyKey: string,
//       descriptor: PropertyDescriptor
//     ) {
//       console.log(target)
//     };
// }

export function Inject() {
  return function (target: Function) {
    // if (Reflect.hasOwnMetadata(METADATA_KEY.PARAM_TYPES, target)) {
    //     throw new Error(ERRORS_MSGS.DUPLICATED_INJECTABLE_DECORATOR);
    // }
    // var types = Reflect.getMetadata(METADATA_KEY.DESIGN_PARAM_TYPES, target) || [];
    console.log(Reflect.getMetadata('annotations', target))
    // Reflect.defineMetadata('annotations', types, target);
    // Reflect.defineProperty(target, 'id', { value: 1 })
    return target
  }
}
