/**
 * Facilitates the creation of other objects.
 * @see AbstractFactory | to create instance of several class families.
 */
export interface FactoryMethod{
    
}

/**
 * Creates instance of several class families.
 * @see FactoryMethod | to create instance of one class family.
 */
export interface AbstractFactory{

}

/**
 * Creates instance of one adapter family classes.
 * @see Adapter | to make incompatible interfaces work together.
 * @see FactoryMethod | to create instance of one class family.
 */
export interface AdapterFactory{
  instances: { [key:string]:Object }
  hasInstance(type: string): boolean
  getInstance(type: string): Object
}