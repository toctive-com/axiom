/**
 * The `stringify` function converts an object to a JSON string, handling
 * circular references and allowing for indentation.
 *
 * @param obj - The object that you want to stringify. It can be any valid
 * JavaScript object.
 * @param [space] - Indentation level and formatting of the output JSON string.
 * @returns A string representation of the input object `obj` in JSON format.
 *
 */
export const stringify = (obj: Object, space?: string | number) => {
  let cache = [];

  let str = JSON.stringify(
    obj,
    function (_key, value) {
      if (typeof value === 'object' && value !== null) {
        // circular reference found, discard key
        if (cache.indexOf(value) !== -1) return;

        // store value in our collection
        cache.push(value);
      }
      return value;
    },
    space,
  );

  // reset the cache
  cache = null;
  return str;
};
