import { aggregateFifo } from "aggregate-async-iterator";
import { MultiGroupProvider } from "repository-provider";

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
export class AggregationProvider extends MultiGroupProvider {
  /**
   * Creates a new provider for a given list of provider factories
   * @param {Class[]} factories
   * @param {Object} options additional options
   * @param {Object} env taken from process.env
   * @return {AggregationProvider} newly created provider
   */
  static initialize(factories, options, env) {
    return new this(factories.map(f => f.initialize(options, env)));
  }

  constructor(providers) {
    super(undefined);
    Object.defineProperty(this, "providers", {
      value: providers
        .filter(provider => provider !== undefined)
        .sort((a, b) => b.priority - a.priority)
    });
  }

  async lookup(type, name) {
    for (const p of this.providers) {
      const item = await p[type](name);

      if (item !== undefined) {
        return item;
      }
    }
  }

  /**
   * Retrieve named repository in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor
   * @param {string} name
   * @return {Primise<Repository>}
   */
  async repository(name) {
    return this.lookup("repository", name);
  }

  /**
   * Retrieve named branch in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor
   * @param {string} name
   * @return {Primise<Branch>}
   */
  async branch(name) {
    return this.lookup("branch", name);
  }

  /**
   * List repositories groups of the providers
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repository groups of the providers
   */
  async *repositoryGroups(patterns) {
    yield* aggregateFifo(this.providers.map(p => p.repositoryGroups(patterns)));
  }

  /**
   * Retrieve named repository group in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor
   * @param {string} name
   * @return {Primise<RepositoryGroup>}
   */
  async repositoryGroup(name) {
    for (const p of this.providers) {
      const rg = await p.repositoryGroup(name);
      if (rg !== undefined) {
        return rg;
      }
    }
  }

  /**
   * List repositories or branches of the providers
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repositories of the providers
   */
  async *list(type, patterns) {
    yield* aggregateFifo(this.providers.map(p => p.list(type, patterns)));
  }
}

export default AggregationProvider;
