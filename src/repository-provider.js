import { Provider } from 'repository-provider';

/**
 * Combines several repository providers into one
 * @param {Provider[]} providers
 */
export class AggregationProvider extends Provider {
  constructor(providers) {
    super(undefined);
    Object.defineProperty(this, 'providers', { value: providers });
  }

  /**
   * Retrieve named repository in one of the given providers
   * @param {string} name
   * @return {Repository}
   */
  async repository(name) {
    const matches = await Promise.all(
      this.providers.map(provider => provider.repository(name))
    );
    return matches.find(p => p !== undefined);
  }
}
