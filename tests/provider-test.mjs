import test from "ava";
import { GithubProvider } from "github-repository-provider";
import { BitbucketProvider } from "bitbucket-repository-provider";
import { GiteaProvider } from "gitea-repository-provider";
import { LocalProvider } from "local-repository-provider";
import { AggregationProvider } from "../src/repository-provider.mjs";

test("locate repository undefined", async t => {
  const provider = new AggregationProvider([
    GithubProvider.initialize(undefined, process.env),
    GiteaProvider.initialize(undefined, process.env),
    LocalProvider.initialize(process.env)
  ]);

  const repository = await provider.repository();

  t.is(repository, undefined);
});

test("locate group undefined", async t => {
  const provider = new AggregationProvider([
    GithubProvider.initialize(undefined, process.env),
    GiteaProvider.initialize(undefined, process.env),
    LocalProvider.initialize(process.env)
  ]);

  const rg = await provider.repositoryGroup(undefined);

  t.is(rg, undefined);
});

test("locate github https", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env)),
    new BitbucketProvider(
      BitbucketProvider.optionsFromEnvironment(process.env)
    ),
    new LocalProvider(LocalProvider.optionsFromEnvironment(process.env))
  ]);

  const repository = await provider.repository(
    "https://github.com/arlac77/aggregation-repository-provider"
  );

  t.is(repository.provider.name, "GithubProvider");
  t.is(repository.fullName, "arlac77/aggregation-repository-provider");
});

test("locate github git@", async t => {
  if (process.env.SSH_AUTH_SOCK) {
    const provider = new AggregationProvider([
      new GithubProvider(GithubProvider.optionsFromEnvironment(process.env)),
      new BitbucketProvider(
        BitbucketProvider.optionsFromEnvironment(process.env)
      ),
      new LocalProvider(LocalProvider.optionsFromEnvironment(process.env))
    ]);

    const repository = await provider.repository(
      "git@github.com:arlac77/aggregation-repository-provider.git"
    );

    t.is(repository.provider.name, "GithubProvider");
    t.is(repository.fullName, "arlac77/aggregation-repository-provider");
  } else {
    t.is(1, 1, "skip git@ test without SSH_AUTH_SOCK");
  }
});

test("locate github short", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env)),
    new BitbucketProvider(
      BitbucketProvider.optionsFromEnvironment(process.env)
    ),
    new LocalProvider(LocalProvider.optionsFromEnvironment(process.env))
  ]);

  const repository = await provider.repository(
    "arlac77/aggregation-repository-provider"
  );

  t.is(repository.fullName, "arlac77/aggregation-repository-provider");
  //t.is(repository.provider.name, "GithubProvider");
});

test.skip("locate github after bitbucket short", async t => {
  const bbOptions = process.env.BITBUCKET_USERNAME
    ? {
      auth: {
        type: "basic",
        username: process.env.BITBUCKET_USERNAME,
        password: process.env.BITBUCKET_PASSWORD
      }
    }
    : undefined;

  const provider = new AggregationProvider([
    new BitbucketProvider(bbOptions),
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env))
  ]);

  const repository = await provider.repository(
    "arlac77/aggregation-repository-provider"
  );

  //t.is(repository.provider.name, "GithubProvider");
  t.is(repository.fullName, "arlac77/aggregation-repository-provider");
});

test.skip("locate bitbucket", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env)),
    new BitbucketProvider(BitbucketProvider.optionsFromEnvironment(process.env))
  ]);

  const repository = await provider.repository(
    "https://arlac77@bitbucket.org/arlac77/sync-test-repository.git"
  );

  //t.is(repository.provider.name, "BitbucketProvider");
  t.is(repository.fullName, "arlac77/sync-test-repository");
});

test.skip("locate bitbucket ssh", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env)),
    new BitbucketProvider(BitbucketProvider.optionsFromEnvironment(process.env))
  ]);

  const repository = await provider.repository(
    "ssh://git@bitbucket.org/arlac77/sync-test-repository.git"
  );

  t.is(repository.provider.name, "BitbucketProvider");
  t.is(repository.fullName, "arlac77/sync-test-repository");
});

test.skip("locate bitbucket (stash) ssh", async t => {
  const provider = new AggregationProvider([
    //new GithubProvider({ url: 'http://nowhere.com/' }),
    new BitbucketProvider(BitbucketProvider.optionsFromEnvironment(process.env))
  ]);

  try {
    const repository = await provider.repository(
      "ssh://git@stash.mydomain.com/myproject/myrepo.git"
    );

    t.is(repository.provider.name, "BitbucketProvider");
    t.is(repository, "myproject/myrepo");
  } catch (e) {
    t.is(e, "myproject/myrepo");
  }
});
