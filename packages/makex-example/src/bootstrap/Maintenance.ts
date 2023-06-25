import { PathOrFileDescriptor, readFileSync } from "node:fs";

export class Maintenance {
  // TODO add interface for maintenance configs
  private static config: {};

  public static handle(configFile: PathOrFileDescriptor) {
    // FIXME if failed to parse json data, return 503 status code
    Maintenance.config = JSON.parse(
      readFileSync(configFile, { encoding: "utf-8" })
    );

    console.log(Maintenance.config);
  }
}
export default Maintenance;
