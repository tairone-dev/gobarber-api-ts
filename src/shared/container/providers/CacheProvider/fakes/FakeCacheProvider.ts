import CacheProvider from '@shared/container/providers/CacheProvider/models/CacheProvider';

interface CacheData {
  [key: string]: string;
}

export default class RedisCacheProvider implements CacheProvider {
  private cache: CacheData = {};

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter((key) =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach((key) => {
      delete this.cache[key];
    });
  }
}
