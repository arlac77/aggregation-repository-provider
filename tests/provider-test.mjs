import test from "ava";
import { assertRepo } from "./util.mjs";

import { GithubProvider } from "github-repository-provider";
import { BitbucketProvider } from "bitbucket-repository-provider";
import { GiteaProvider } from "gitea-repository-provider";
import { LocalProvider } from "local-repository-provider";
import { AggregationProvider } from "../src/repository-provider.mjs";

function createProvider() {
  return new AggregationProvider([
    GithubProvider.initialize({ priority: 2 }, process.env),
    GiteaProvider.initialize({ priority: 3 }, process.env),
    BitbucketProvider.initialize({ priority: 1 }, process.env),
    LocalProvider.initialize(undefined, process.env)
  ]);
}

test("sorted providers", async t => {
  const provider = createProvider();

  t.is(provider.providers[0].name, "GiteaProvider");
  t.is(provider.providers[1].name, "GithubProvider");
  t.is(provider.providers[2].name, "BitbucketProvider");
});

test("locate repository undefined", async t => {
  const provider = createProvider();

  t.is(await provider.repository(), undefined);
});

const repoFixtures = {
  "": undefined,
  " ": undefined,

  // "git@mfelten.de/github-repository-provider.git": undefined,
  //"http://www.heise.de/index.html": undefined,

  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux.git": {
    fullName: "markus/de.mfelten.archlinux",
    description: "infrasctucture build on arch linux (arm)",
    provider: GiteaProvider
  },
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux": {
    fullName: "markus/de.mfelten.archlinux",
    description: "infrasctucture build on arch linux (arm)",
    provider: GiteaProvider
  },
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux#master": {
    fullName: "markus/de.mfelten.archlinux",
    provider: GiteaProvider
  },
  "markus/de.mfelten.archlinux#master": {
    fullName: "markus/de.mfelten.archlinux",
    description: "infrasctucture build on arch linux (arm)",
    provider: GiteaProvider
  },
  "https://github.com/arlac77/github-repository-provider.git#master": {
    fullName: "arlac77/github-repository-provider",
    description: "repository provider for github",
    provider: GithubProvider
  },
  "https://github.com/arlac77/aggregation-repository-provider": {
    fullName: "arlac77/aggregation-repository-provider",
    provider: GithubProvider
  },
  "git@github.com:arlac77/aggregation-repository-provider.git": {
    fullName: "arlac77/aggregation-repository-provider",
    provider: GithubProvider
  },
  "arlac77/aggregation-repository-provider": {
    fullName: "arlac77/aggregation-repository-provider",
    provider: GithubProvider
  },
  "https://arlac77@bitbucket.org/arlac77/sync-test-repository.git": {
    fullName: "arlac77/sync-test-repository",
    description: "test repository for npm-template-sync @bitbucket",
    provider: BitbucketProvider
  },
  "ssh://git@bitbucket.org/arlac77/sync-test-repository.git": {
    fullName: "arlac77/sync-test-repository",
    description: "test repository for npm-template-sync @bitbucket",
    provider: BitbucketProvider
  }
};

test("locate repository several", async t => {
  const provider = createProvider();

  t.plan(28);

  for (const rn of Object.keys(repoFixtures)) {
    const r = repoFixtures[rn];
    const repository = await provider.repository(rn);
    await assertRepo(t, repository, r);
  }
});

test("locate branch undefined", async t => {
  const provider = createProvider();
  const branch = await provider.branch();

  t.is(branch, undefined);
});

test("locate group undefined", async t => {
  const provider = createProvider();
  const rg = await provider.repositoryGroup();

  t.is(rg, undefined);
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
    GithubProvider.initialize(undefined, process.env)
  ]);

  const repository = await provider.repository(
    "arlac77/aggregation-repository-provider"
  );

  //t.is(repository.provider.name, "GithubProvider");
  t.is(repository.fullName, "arlac77/aggregation-repository-provider");
});

test.skip("locate bitbucket (stash) ssh", async t => {
  const provider = new AggregationProvider([
    //new GithubProvider({ url: 'http://nowhere.com/' }),
    BitbucketProvider.initialize(undefined, process.env)
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
