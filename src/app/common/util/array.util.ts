export class ArrayUtil {
  static generateArray<T>(from: number, to: number, step: number): number[] {
    const result: number[] = [];

    for (let i = from; i <= to; i += step) {
      result.push(i);
    }

    return result;
  }

  static empty<T>(): T[] {
    return []
  }
}
