import { Instantiable } from "../Types";
import Application from "./Application";

export class Container {
  /**
   * This property is used to store the bindings between abstract
   * classes/interfaces and their concrete implementations in the container.
   *
   */
  private static bindings: {
    [key: string]: any;
  } = {};

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
  singleton(
    abstract: string | Instantiable,
    contract: Instantiable = null,
    parameters?: {}
  ) {
    return Container.singleton(abstract, contract, parameters);
  }

  static singleton(
    abstract: string | Instantiable,
    contract: Object | Instantiable = null,
    parameters?: {}
  ) {
    if (typeof abstract === "string") {
      if (contract === null) {
        throw new Error(
          `${Container.constructor.name}.singleton(): Argument #2 (concrete) can't be null while Argument #1 (abstract) is a string`
        );
      }

      if (typeof contract === "object") {
        return Container.bind(abstract, contract);
      } else {
        return Container.bind(abstract, contract, parameters);
      }
    }

    if (contract === null) {
      return Container.bind(abstract.name, abstract, parameters);
    }

    
    if (typeof contract === "object") {
      return Container.bind(abstract.name, contract);
    } else {
      return Container.bind(abstract.name, contract, parameters);
    }
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
  static bind(abstract: string, contract: {});
  static bind(abstract: string, contract: Instantiable, parameters: {});
  static bind(abstract: string, contract: Instantiable, parameters?: {}) {
    if (Object.keys(Container.bindings).includes(abstract)) {
      console.warn(
        `Container.bindings already contains "${abstract}" associated to ${Container.bindings[abstract].constructor.name} class`
      );
      return Container.bindings[abstract];
    }

    if (typeof contract === "object") {
      Container.bindings[abstract] = contract;
    } else {
      Container.bindings[abstract] = new contract(parameters);
    }

    return Container.bindings[abstract];
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
  public make<T>(ref: Instantiable): T {
    return Application.make(ref);
  }
  public static make<T>(ref: Instantiable): T {
    if (!Object.keys(Container.bindings).includes(ref.name)) {
      // try to make a singleton for `ref`, then return it
      try {
        return this.singleton(ref, null);
      } catch (error) {
        throw new Error(`${ref.name} is not stored in Container`);
      }
    }

    return Container.bindings[ref.name];
  }
}

export default Container;
