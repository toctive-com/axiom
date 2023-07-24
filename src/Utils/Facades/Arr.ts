export class Arr {
  /**
   * Takes a value and returns it as an array, or wraps it in an array if it is
   * not already an array.
   *
   * @param value - The value parameter can be any data type. if null or
   * undefined, it will return an empty array.
   *
   * @returns an array.
   *
   */
  static wrap(value: any): any[] {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value];
  }
}

export default Arr;
