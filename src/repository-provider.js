import { Provider } from 'repository-provider';

/**
 * <!-- skip-example -->
 * Combines several repository providers into one
 * @param {Provider[]} providers
 * @property {Provider[]} providers
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
  constructor(providers = []) {
    super(undefined);
    Object.defineProperty(this, 'providers', { value: providers });
  }

  /**
   * Retrieve named repository in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor
   * @param {string} name
   * @return {Primise<Repository>}
   */
  async repository(name) {
    for (const p of this.providers) {
      const r = await p.repository(name);
      if (r !== undefined) {
        return r;
      }
    }

    return undefined;
  }
}
