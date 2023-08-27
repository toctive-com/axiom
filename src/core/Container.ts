import { Container as BrandiContainer, Token, token } from 'brandi';

// Custom type aliases
type UnknownConstructor<T extends Object = Object> = new (
  ...args: never[]
) => T;
type UnknownFunction<T = unknown> = (...args: never[]) => T;
type UnknownCreator<T = unknown> = UnknownConstructor<T> | UnknownFunction<T>;

/**
 * The `Container` class is a TypeScript implementation of a dependency
 * injection container that allows for setting and retrieving values based on a
 * given name.
 *
 * @example
 * ```ts
 * class Kernel { public value = "VALUE" }
 * Container.set("kernel", Kernel);
 * const kernelInstance = Container.get<Kernel>("kernel").value;
 * ```
 *
 */
export class Container extends BrandiContainer {
  /**
   * This property is used to store the bindings between abstract
   * classes/interfaces and their concrete implementations in the container.
   */
  public static tokens: Record<string, Token<unknown>> = {};

  /**
   * This static property is used to store the instance of the container that
   * will be used for dependency injection.
   */
  public static container = new BrandiContainer();

  /**
   * Creates an instance of the `Container` class and sets it as the active
   * container.
   */
  constructor() {
    super();
    Container.container = this;
  }

  /**
   * Sets a value of type TClass in the Application class using a given name.
   * @param name - The name of the value to set.
   * @param value - The value or function that creates an instance of the class.
   * @returns An instance of the specified class.
   */
  set<TClass>(name: string, value: UnknownCreator<TClass>) {
    return Container.set<TClass>(name, value);
  }

  /**
   * Sets a value in the container and returns an instance of the specified
   * class.
   * @param name - The name of the value to set.
   * @param value - The value or function that creates an instance of the class.
   * @returns An instance of the specified class.
   */
  static set<TClass>(name: string, value: UnknownCreator<TClass>) {
    const token = this.setToken<TClass>(name);
    this.container.bind(token).toInstance(value).inSingletonScope();
    return this.make<TClass>(name);
  }

  /**
   * Returns an instance of a specified type from the container based on a given
   * name.
   * @param name - The name of the value to retrieve.
   * @returns An instance of the specified type.
   */
  make<TValue>(name: string) {
    return Container.make<TValue>(name);
  }

  /**
   * Returns an instance of a specified type from the container based on a given
   * name.
   * @param name - The name of the value to retrieve.
   * @returns An instance of the specified type.
   */
  static make<TValue>(name: string) {
    const token = Container.getToken<TValue>(name);
    return Container.container.get<typeof token>(token);
  }

  /**
   * Sets a token with a given name and returns it.
   * @param name - The name of the token.
   * @returns A Token object.
   */
  static setToken<T>(name: string): Token<T> {
    return (this.tokens[name] = token<T>(name));
  }

  /**
   * Returns a token of type T based on the given name.
   * @param name - The name of the token.
   * @returns A Token of type T.
   */
  static getToken<T>(name: string): Token<T> {
    return this.tokens[name] as Token<T>;
  }
}

export default Container;
