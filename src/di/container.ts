type Factory<T> = () => T;

class Container {
  private instances = new Map<string, unknown>();
  private factories = new Map<string, Factory<unknown>>();

  register<T>(token: string, factory: Factory<T>) {
    this.factories.set(token, factory);
  }

  registerInstance<T>(token: string, instance: T) {
    this.instances.set(token, instance);
  }

  resolve<T>(token: string): T {
    if (this.instances.has(token)) return this.instances.get(token) as T;
    const factory = this.factories.get(token);
    if (!factory) throw new Error(`Service not registered: ${token}`);
    const instance = factory() as T;
    this.instances.set(token, instance); // memoized as singleton
    return instance;
  }

  reset() {
    this.instances.clear();
  }
}

export const container = new Container();

export const TOKENS = {
  ApiClient: "ApiClient",
  AuthService: "AuthService",
} as const;