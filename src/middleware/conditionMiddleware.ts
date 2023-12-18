import { Route, RoutesGroup } from '@/core';
import { RouteAction, RouteActionParameters } from '@/types';

/**
 * Middleware that conditionally selects and returns one of two route actions
 * based on a boolean condition or a function that evaluates the condition.
 *
 * @param condition - A boolean value or a function that takes
 * `RouteActionParameters` as a parameter and returns a boolean.
 * @param firstAction - The route action or route group to be used when the
 * condition is true.
 * @param secondAction - The route action or route group to be used when the
 * condition is false.
 *
 * @returns A function that takes RouteActionParameters and returns the selected
 * route action or route group.
 *
 * @example
 * ```
 * router.get(
 *    '/test-middleware',
 *    conditionMiddleware(
 *        userIsAdmin,        // boolean condition
 *        () => 'admin',      // first action
 *        () => 'not-admin',  // second action
 *    ),
 * );
 * ```
 *
 * @example
 * ```
 * router.get(
 *    '/test-middleware',
 *    conditionMiddleware(
 *        ({req}) => req.params.age >= 18,  // function condition
 *        () => 'admin',                    // first action
 *        () => 'not-admin',                // second action
 *    ),
 * );
 * ```
 */
const conditionMiddleware = (
  condition: boolean | ((params: RouteActionParameters) => boolean),
  firstAction: RouteAction,
  secondAction: RouteAction,
) => {
  return function (routeActionParameters: RouteActionParameters) {
    // Determine whether to use the first or second action based on the
    // condition.
    let shouldUseFirstAction =
      typeof condition === 'boolean'
        ? condition
        : condition(routeActionParameters);

    // Return the selected route action or route group.
    return shouldUseFirstAction ? firstAction : secondAction;
  };
};

export default conditionMiddleware;
