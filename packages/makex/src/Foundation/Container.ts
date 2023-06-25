import { Instantiable } from "../Types";

export class Container {
  /**
   * This property is used to store the bindings between abstract
   * classes/interfaces and their concrete implementations in the container.
   *
   */
  private static bindings: { [key: string]: InstanceType<Instantiable> } = {};

  /**
   * This function binds an abstract class or string to a concrete implementation.
   *
   * @param {string | Instantiable} abstract - The "abstract" parameter can either
   * be a string or an Instantiable (a constructor function). If it is a string, it
   * represents the name of the abstract class or interface that we want to bind to
   * a concrete implementation. If it is an Instantiable, it represents the
   * abstract class or interface itself
   * @param {Instantiable | null} [contract] - The `contract` parameter is an optional
   * parameter of type `Instantiable`. It represents the concrete implementation of
   * the abstract class or interface that is being bound to the container. If this
   * parameter is not provided, the container will attempt to resolve the
   * implementation based on the abstract class or interface provided.
   *
   * @returns the result of calling the `bind` method with either the `abstract`
   * and `contract` arguments or the `abstract` argument converted to a string and
   * used as both the key and value for the `bind` method. The specific value
   * returned depends on the type and values of the `abstract` and `contract`
   * arguments passed to the function.
   *
   */
  singleton(abstract: string | Instantiable, contract: Instantiable = null) {
    if (typeof abstract === "string") {
      if (contract === null) {
        throw new Error(
          `${Container.constructor.name}.singleton(): Argument #2 (concrete) can't be null while Argument #1 (abstract) is a string`
        );
      }
      return this.bind(abstract, contract);
    }

    if (contract === null) {
      return this.bind(abstract.name, abstract);
    }

    return this.bind(abstract.name, contract);
  }

  /**
   * This function binds an abstract string to an instantiable class in a
   * container.
   *
   * @param {string} abstract - The abstract parameter is a string that represents
   * the abstract or interface that needs to be bound to a concrete implementation.
   * In other words, it is the key or identifier that will be used to retrieve the
   * concrete implementation from the container.
   *
   * @param {Instantiable} contract - The `contract` parameter is an `Instantiable`
   * class that will be instantiated and bound to the `abstract` parameter in the
   * container's bindings. This means that whenever the `abstract` parameter is
   * resolved from the container, an instance of the `contract` class will be
   * returned.
   */
  bind(abstract: string, contract: Instantiable) {
    if (Object.keys(Container.bindings).includes(abstract)) {
      throw new Error(
        `Container.bindings already contains "${abstract}" associated to ${Container.bindings[abstract].constructor.name} class`
      );
    }
    Container.bindings[abstract] = new contract();
  }

  /**
   * This is a generic function that returns an object of type T or null based on a
   * given reference string.
   *
   * @param {string} ref - ref is a string parameter that represents the reference
   * to a binding in the Container.
   *
   * @returns The `make` function is returning a value of type `T` or `null`. If
   * the `ref` parameter exists as a key in the `Container.bindings` object, the
   * function returns the value associated with that key as type `T`. Otherwise, it
   * returns `null`.
   */
  make<T>(ref: Instantiable): T {
    if (!Object.keys(Container.bindings).includes(ref.name)) {
      throw new Error(`${ref.name} is not stored in Container`);
    }

    return Container.bindings[ref.name];
  }
}

export default Container;
