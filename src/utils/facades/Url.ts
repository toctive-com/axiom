export class Url {
  static trim(url: string) {
    return url
      .split('/')
      .filter((i) => i !== '')
      .join('/');
  }

  static join(...urls: string[]) {
    return urls.map(Url.trim).join('/');
  }
}
