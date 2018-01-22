import { Provider } from 'repository-provider';

/**
 * <!-- skip-example -->
 * Combines several repository providers into one
 * @param {Provider[]} providers
 * @example
 *   const provider = new AggregationProvider([
 *     new GithubProvider(),
 *   new BitbucketProvider()
 * ]);
 *  const repository1 = await provider.repository(
 *    'https://github.com/arlac77/aggregation-repository-provider'
 *  );
 * const repository2 = await provider.repository(
 *  'https://arlac77@bitbucket.org/arlac77/sync-test-repository.git'
 * );
 * // repository1 -> github
 * // repository2 -> bitbucket
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
