import { matcher } from "matching-iterator";
import { aggregateFifo } from "aggregate-async-iterator";
import { MultiGroupProvider } from "repository-provider";

/**
 * <!-- skip-example -->
 * Combines several repository providers into one.
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
   * Creates a new provider for a given list of provider factories.
   * Factories can be import urls with additional instance identifier.
   * ```txt
   * IDENTIFIER(my-repository-provider)
   * ```
   * @param {Class[]|string[]} factories
   * @param {Object} options additional options
   * @param {Object} env taken from process.env
   * @return {AggregationProvider} newly created provider
   */
  static async initialize(factories, options, env) {
    return new this(
      await this.initializeProviders(factories, options, env),
      options
    );
  }

  /**
   *
   * @param {Class[]|string[]} factories
   * @param {Object} options additional options
   * @param {Object} env taken from process.env
   * @return {Provider[]} newly created providers
   */
  static async initializeProviders(factories = [], options, env) {
    const key = this.instanceIdentifier + "FACTORIES";

    if (env[key]) {
      factories.push(...env[key].split(/\s*,\s*/));
    }

    return Promise.all(
      factories.map(async f => {
        let o = options;

        if (typeof f === "string") {
          const m = f.match(/^(\w+)\(([^\)]+)\)/);
          if (m) {
            f = m[2];
            o = { instanceIdentifier: m[1], ...options };
          }

          f = (await import(f)).default;
        }

        return f.initialize(o, env);
      })
    );
  }

  static get name() {
    return "aggregation";
  }

  /**
   * @return {string} default instance environment name prefix
   */
  static get instanceIdentifier() {
    return "AGGREGATION_";
  }

  constructor(providers, options) {
    super(options);
    this.setProviders(providers);
  }

  setProviders(providers) {
    this._providers = providers
      .filter(provider => provider !== undefined)
      .sort((a, b) => b.priority - a.priority);

    this._providers.forEach(provider => (provider.messageDestination = this));
  }

  async *providers(name) {
    yield* matcher(this._providers.values(), name, {
      name: "name"
    });
  }

  async lookup(type, name) {
    for (const p of this._providers) {
      const item = await p[type](name);

      if (item !== undefined) {
        return item;
      }
    }
  }

  /**
   * Retrieve named pull request in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor.
   * @param {string} name
   * @return {Primise<PullRequest>}
   */
  async pullRequest(name) {
    return this.lookup("pullRequest", name);
  }

  /**
   * Retrieve named repository in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor.
   * @param {string} name
   * @return {Primise<Repository>}
   */
  async repository(name) {
    return this.lookup("repository", name);
  }

  /**
   * Retrieve named branch in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor.
   * @param {string} name
   * @return {Primise<Branch>}
   */
  async branch(name) {
    return this.lookup("branch", name);
  }

  /**
   * Retrieve named tag in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor.
   * @param {string} name
   * @return {Primise<Branch>}
   */
  async tag(name) {
    return this.lookup("tag", name);
  }

  /**
   * Retrieve named repository group in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor.
   * @param {string} name
   * @return {Primise<RepositoryGroup>}
   */
  async repositoryGroup(name) {
    return this.lookup("repositoryGroup", name);
  }

  /**
   * List repositories groups of the providers.
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repository groups of the providers
   */
  async *repositoryGroups(patterns) {
    yield* aggregateFifo(
      this._providers.map(p => p.repositoryGroups(patterns))
    );
  }

  /**
   * List repositories or branches of the providers.
   * @param {string} type name of the method to deliver typed iterator projects,repositories,branches,tags
   * @param {string[]|string} patterns
   * @return {Iterator<Repository>} all matching repositories of the providers
   */
  async *list(type, patterns) {
    yield* aggregateFifo(this._providers.map(p => p.list(type, patterns)));
  }
}

export default AggregationProvider;
