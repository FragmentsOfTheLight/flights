/**
 * A class of which only a single instance can exist.
 */
export interface Singleton{
    _instance: Singleton
    getInstance(): Singleton
}