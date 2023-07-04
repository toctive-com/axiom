import { existsSync } from "node:fs";
import { resolve } from "node:path";

export default {
  appName: "MakeX Project",

  /**
   * Maintenance Mode
   * -----------------------------------------------
   * The configuration setting that determines whether the application is in
   * maintenance mode or not.
   *
   * It has three properties:
   * - (string)   title:    The title of the maintenance mode message
   * - (string)   template: The message to display when the application is in maintenance mode
   * - (boolean)  enabled:  Whether or not the application is in maintenance mode
   *
   */
  maintenanceMode: {
    enabled: existsSync(resolve("../down")),

    title: "Maintenance Mode",
    except: [],
    redirect: null,
    retry: null,
    refresh: null,
    secret: null,
    status: 503,
    template:
      "The application is currently undergoing maintenance. Please try again later.",
  },
};
