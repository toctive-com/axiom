/**
 * The purpose of this interface is to ensure that any class that wants to be
 * considered "Jsonable" must provide a method to convert itself to a JSON
 * representation.
 *
 */
export interface Jsonable {
  /**
   * Convert the object to its JSON representation.
   *
   * @param  int  spaces
   * @return string
   *
   */
  toJson(spaces: number): string;
}
