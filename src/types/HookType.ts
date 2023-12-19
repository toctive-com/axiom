export type HookType =
  // Purpose: Executed before processing the incoming request.
  // Use cases: Authentication checks, request validation, logging.
  | 'pre-request'

  // Purpose: Executed before routing the request to the appropriate endpoint.
  // Use cases: Additional global checks, modifying request parameters.
  | 'pre-route'

  // Purpose: Executed after the route handler has processed the request but
  // before sending the response.
  // Use cases: Response modification, logging, data aggregation.
  | 'post-route'

  // Purpose: Executed just before sending the response to the client. Use
  // cases: Final response modification, headers manipulation.
  | 'pre-response'

  // Purpose: Executed after sending the response to the client.
  // Use cases: Cleanup tasks, logging.
  | 'post-response'

  // Purpose: Executed when an error occurs during the request-response cycle.
  // Use cases: Custom error handling, logging, error response modification.
  | 'error-handling'

  // Purpose: Allow users to inject custom middleware functions at various
  // points in the request-response cycle.
  // Use cases: Third-party middleware integration, custom functionality
  // injection.
  | 'pre-middleware'
  | 'post-middleware'

  // Purpose: Executed during the server shutdown process.
  // Use cases: Graceful shutdown, cleanup tasks.
  | 'shutdown'

  // Purpose: Executed before validating the request parameters.
  // Use Cases: Sanitizing or transforming request data, custom validation
  // logic.
  | 'pre-validation'

  // Purpose: Executed after validating the request parameters.
  // Use Cases: Logging validation results, additional data manipulation based
  // on validation.
  | 'post-validation'

  // Purpose: Executed before serializing the response data.
  // Use Cases: Custom data manipulation, formatting response data.
  | 'pre-serialization'

  // Purpose: Executed after serializing the response data.
  // Use Cases: Logging serialized data, applying additional transformations.
  | 'post-serialization'

  // Purpose: Executed before compressing the response data.
  // Use Cases: Checking conditions for compression, custom compression
  // algorithms.
  | 'pre-compression'

  // Purpose: Executed after compressing the response data.
  // Use Cases: Logging compression details, additional post-processing.
  | 'post-compression';
