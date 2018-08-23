import test from "ava";
import { GithubProvider } from "github-repository-provider";
import { BitbucketProvider } from "bitbucket-repository-provider";
import { LocalProvider } from "local-repository-provider";
import { AggregationProvider } from "../src/repository-provider";

test("locate repository undefined", async t => {
  const provider = new AggregationProvider([
    new GithubProvider()
    // TODO new BitbucketProvider(),
    // TODO new LocalProvider()
  ]);

  const repository = await provider.repository(undefined);

  t.is(repository, undefined);
});

test("locate project undefined", async t => {
  const provider = new AggregationProvider([
    new GithubProvider()
    // TODO new BitbucketProvider(),
    // TODO new LocalProvider()
  ]);

  const rg = await provider.repositoryGroup(undefined);

  t.is(rg, undefined);
});

test("locate github https", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider(),
    new LocalProvider()
  ]);

  const repository = await provider.repository(
    "https://github.com/arlac77/aggregation-repository-provider"
  );

  t.is(repository.provider.name, "GithubProvider");
  t.is(repository.name, "arlac77/aggregation-repository-provider");
});

test("locate github git@", async t => {
  if (process.env.SSH_AUTH_SOCK) {
    const provider = new AggregationProvider([
      new GithubProvider(),
      new BitbucketProvider(),
      new LocalProvider()
    ]);

    const repository = await provider.repository(
      "git@github.com:arlac77/aggregation-repository-provider.git"
    );

    t.is(repository.provider.name, "GithubProvider");
    t.is(repository.name, "arlac77/aggregation-repository-provider");
  } else {
    t.is(1, 1, "skip git@ test without SSH_AUTH_SOCK");
  }
});

test("locate github short", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider(),
    new LocalProvider()
  ]);

  const repository = await provider.repository(
    "arlac77/aggregation-repository-provider"
  );

  t.is(repository.provider.name, "GithubProvider");
  t.is(repository.name, "arlac77/aggregation-repository-provider");
});

test("locate github after bitbucket short", async t => {
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
    new GithubProvider()
  ]);

  const repository = await provider.repository(
    "arlac77/aggregation-repository-provider"
  );

  t.is(repository.provider.name, "GithubProvider");
  t.is(repository.name, "arlac77/aggregation-repository-provider");
});

test("locate bitbucket", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider()
  ]);

  const repository = await provider.repository(
    "https://arlac77@bitbucket.org/arlac77/sync-test-repository.git"
  );

  t.is(repository.provider.name, "BitbucketProvider");
  t.is(repository.name, "arlac77/sync-test-repository");
});

test("locate bitbucket ssh", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider()
  ]);

  const repository = await provider.repository(
    "ssh://git@bitbucket.org/arlac77/sync-test-repository.git"
  );

  t.is(repository.provider.name, "BitbucketProvider");
  t.is(repository.name, "arlac77/sync-test-repository");
});

test.skip("locate bitbucket (stash) ssh", async t => {
  const provider = new AggregationProvider([
    //new GithubProvider({ url: 'http://nowhere.com/' }),
    new BitbucketProvider()
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
