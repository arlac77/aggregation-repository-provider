import { Provider } from "repository-provider";

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

    /*
    providers = providers.sort((a, b) => {
      const x = a.priority < b.priority ? -1 : a.priority > b.priority ? 1 : 0;
      console.log(`${a.priority} <> ${b.priority} -> ${x}`);
      return x;
     }
    );
    */

    Object.defineProperty(this, "providers", { value: providers });
  }

  /**
   * Retrieve named repository in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor
   * @param {string} name
   * @param {Object} options
   * @return {Primise<Repository>}
   */
  async repository(name, options) {
    for (const p of this.providers) {
      this.trace({
        message: "consulting provider",
        provider: p.name,
        repository: name
      });

      const repository = await p.repository(name, options);
      if (repository !== undefined) {
        return repository;
      }
    }

    return undefined;
  }

  /**
   * List repositories for the owner
   * @param {string[]|string} matchingPatterns
   * @return {Iterator<Repository>} all matching repositories of the owner
   */
  async *repositories(patterns) {
    for (const provider of this.providers) {
      this.trace({
        message: "consulting provider",
        provider: provider.name,
        patterns
      });

      for await (const repository of provider.repositories(patterns)) {
        yield repository;
      }
    }
  }

  async *branches(patterns) {
    for (const provider of this.providers) {
      this.trace({
        message: "consulting provider",
        provider: provider.name,
        patterns
      });

      for await (const branch of provider.branches(patterns)) {
        yield branch;
      }
    }
  }

  /**
   * Retrieve named repository group in one of the given providers.
   * They are consulted in the order of the propviders given to the constructor
   * @param {string} name
   * @param {Object} options
   * @return {Primise<RepositoryGroup>}
   */
  async repositoryGroup(name, options) {
    for (const p of this.providers) {
      this.trace({
        message: "consulting provider for repo group",
        provider: p.name,
        group: name
      });

      const rg = await p.repositoryGroup(name, options);
      if (rg !== undefined) {
        return rg;
      }
    }

    return undefined;
  }
}
