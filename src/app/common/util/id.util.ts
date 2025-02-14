export class IdUtil {
  static generate(): string {
    return new Date().toString();
  }
}
