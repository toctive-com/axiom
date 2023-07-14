import { Container as BrandiContainer, Token, token } from 'brandi';
import Application from '@/Foundation/Application';

declare type UnknownConstructor<T extends Object = Object> = new (
  ...args: never[]
) => T;
declare type UnknownFunction<T = unknown> = (...args: never[]) => T;
export declare type UnknownCreator<T = unknown> =
  | UnknownConstructor<T>
  | UnknownFunction<T>;

/**
 * The `Container` class is a TypeScript implementation of a dependency injection
 * container that allows for setting and retrieving values based on a given name.
 *
 */
export class Container extends BrandiContainer {
  /**
   * This property is used to store the bindings between abstract
   * classes/interfaces and their concrete implementations in the container.
   *
   */
  public static tokens: Record<string, Token<unknown>> = {};

  /**
   * This static property is used to store the instance of the container that
   * will be used for dependency injection.
   *
   */
  public static container = new BrandiContainer();

  /**
   * Here is how to use this container
   *
   * @example
   * ```ts
   * class Kernel { public value = "VALUE" }
   * Container.set("kernel", Kernel);
   * const kernelInstance = Container.get<Kernel>("kernel").value;
   * ```
   *
   */
  constructor() {
    super();
    Container.container = this;
  }

  /**
   * Sets a value of type TClass in the Application class using a given name.
   *
   * @param name - A string representing the name of the class to be set.
   *
   * @param value - represents a value that can create an instance of the class "TClass", but the
   * specific implementation is unknown.
   *
   * @returns the result of calling the `set` method of the `Application` object
   * with the provided `name` and `value` arguments.
   *
   */
  set<TClass>(name: string, value: UnknownCreator<TClass>) {
    return Application.set<TClass>(name, value);
  }

  /**
   * Sets a value in a container and returns an instance of the specified class.
   *
   * @param name - A string representing the name of the class or value
   * being set.
   *
   * @param value -  represents the value that will be bound to the specified name in the
   * container. The `UnknownCreator<TClass>` type indicates that the value can be
   * any type that can be used to create an instance of `TClass`.
   *
   * @returns the result of calling the `make` method with the `name` parameter.
   *
   */
  static set<TClass>(name: string, value: UnknownCreator<TClass>) {
    const token = this.setToken<TClass>(name);
    this.container.bind(token).toInstance(value).inSingletonScope();
    return this.make<TClass>(name);
  }

  /**
   * The function "make" returns an instance of a generic type TValue from a
   * container based on the given name.
   *
   * @param {string} name - A string representing the name of the value to be
   * created.
   *
   * @returns The `make<TValue>(name: string)` function is returning the result of
   * calling `Container.make<TValue>(name)`.
   *
   */
  make<TValue>(name: string) {
    return Container.make<TValue>(name);
  }

  /**
   * The `make` function in TypeScript returns an instance of a specified type from a
   * container based on a given name.
   *
   * @param {string} name - A string representing the name of the token.
   *
   * @returns an instance of the specified type TValue, obtained from the container
   * using the provided name.
   *
   */
  static make<TValue>(name: string) {
    const token = Container.getToken<TValue>(name);
    return Container.container.get<Token<TValue>>(token);
  }

  /**
   * The function sets a token with a given name and returns it.
   * @param {string} name - A string representing the name of the token.
   *
   * @returns a Token object.
   *
   */
  static setToken<T>(name: string): Token<T> {
    return (this.tokens[name] = token<T>(name));
  }

  /**
   * The function `getToken` returns a token of type `T` based on the given name.
   * @param {string} name - A string representing the name of the token.
   *
   * @returns a Token of type T.
   *
   */
  static getToken<T>(name: string): Token<T> {
    return this.tokens[name] as Token<T>;
  }
}

export default Container;
