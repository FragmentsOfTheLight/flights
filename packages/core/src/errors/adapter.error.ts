import { BaseError } from ".";

export class AdapterNotFoundError extends BaseError{
  constructor(adapter: string) {
    super(`adapter "${adapter}" not registered.`);
  }
}