import test from "ava";
import {
  assertRepo,
  assertBranch,
  providerTest,
  createMessageDestination
} from "repository-provider-test-support";
import { createProvider } from "./helpers/util.mjs";

import GithubProvider from "github-repository-provider";
import BitbucketProvider from "bitbucket-repository-provider";
import GiteaProvider from "gitea-repository-provider";
import LocalProvider from "local-repository-provider";
import MockProvider from "mock-repository-provider";
import AggregationProvider from "aggregation-repository-provider";

test(providerTest, createProvider());

test("sorted providers", async t => {
  const provider = createProvider();

  let i = 0;
  for (const p of [
    MockProvider,
    GiteaProvider,
    GithubProvider,
    BitbucketProvider,
    LocalProvider
  ]) {
    t.true(provider._providers[i++] instanceof p, `instanceof ${p}`);
  }
});

test("list providers", async t => {
  const provider = createProvider();

  const ps = [];

  for await (const p of provider.providers("git*")) {
    ps.push(p);
  }

  t.is(ps.length, 2);
});

test("message forwarding", async t => {
  const provider = createProvider();
  const { messageDestination, messages, levels } = createMessageDestination();

  provider.messageDestination = messageDestination;

  for (const l of levels) {
    provider._providers[0][l](l);
    t.deepEqual(messages[l], [l], l);
  }
});

test("locate repository undefined", async t => {
  const provider = createProvider();

  t.is(await provider.repository(), undefined);
});

const owner1 = {
  name: "arlac77",
  uuid: "{7eeeef8a-17ef-45be-996f-ea51387bc7b9}"
};

const repoFixtures = {
  "": undefined,
  " ": undefined,
  "git@mfelten.de/github-repository-provider.git": undefined,
  "http://www.heise.de/index.html": undefined,
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux.git": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrastructure build on arch linux (arm)",
    provider: GiteaProvider
  },

  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrastructure build on arch linux (arm)",
    provider: GiteaProvider
  },
  "https://mfelten.dynv6.net/services/git/markus/de.mfelten.archlinux#master": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    provider: GiteaProvider
  },
  "markus/de.mfelten.archlinux#master": {
    branch: "master",
    fullName: "markus/de.mfelten.archlinux",
    description: "infrastructure build on arch linux (arm)",
    provider: GiteaProvider
  },

  "https://github.com/arlac77/github-repository-provider.git#master": {
    branch: "master",
    fullName: "arlac77/github-repository-provider",
    description: "repository provider for github",
    provider: GithubProvider
  },
  "https://github.com/arlac77/aggregation-repository-provider": {
    branch: "master",
    fullName: "arlac77/aggregation-repository-provider",
    provider: GithubProvider
  },

  "git@github.com:arlac77/aggregation-repository-provider.git": {
    branch: "master",
    fullName: "arlac77/aggregation-repository-provider",
    provider: GithubProvider
  },

  "arlac77/aggregation-repository-provider": {
    branch: "master",
    fullName: "arlac77/aggregation-repository-provider",
    provider: GithubProvider
  },

  "https://arlac77@bitbucket.org/arlac77/sync-test-repository.git": {
    branch: "master",
    provider: BitbucketProvider,
    owner: owner1,
    name: "sync-test-repository",
    fullName: "arlac77/sync-test-repository",
    uuid: "{1fbf1cff-a829-473c-bd42-b5bd684868a1}",
    description: "test repository for npm-template-sync @bitbucket"
  },
  "ssh://git@bitbucket.org/arlac77/sync-test-repository.git": {
    branch: "master",
    provider: BitbucketProvider,
    owner: owner1,
    name: "sync-test-repository",
    fullName: "arlac77/sync-test-repository",
    uuid: "{1fbf1cff-a829-473c-bd42-b5bd684868a1}",
    description: "test repository for npm-template-sync @bitbucket"
  },
  "git@bitbucket.org:arlac77/sync-test-repository.git": {
    branch: "master",
    provider: BitbucketProvider,
    owner: owner1,
    name: "sync-test-repository",
    fullName: "arlac77/sync-test-repository",
    uuid: "{1fbf1cff-a829-473c-bd42-b5bd684868a1}",
    description: "test repository for npm-template-sync @bitbucket"
  },
  "https://bitbucket.org/arlac77/template-node-app.git": {
    provider: BitbucketProvider,
    name: "template-node-app",
    uuid: "{bec21095-03ca-45ad-8571-b7d611a6dffd}",
    branch: "master"
  },
  "https://arlac77@bitbucket.org/arlac77/template-node-app.git": {
    provider: BitbucketProvider,
    name: "template-node-app",
    fullName: "arlac77/template-node-app",
    uuid: "{bec21095-03ca-45ad-8571-b7d611a6dffd}",
    owner: owner1,
    hooks: [
      {
        id: "{79492efb-32b4-4f69-a469-606b58d2f8b5}",
        active: true,
        url: "https://mfelten.dynv6.net/services/ci/api/bitbucket",
        events: new Set(["repo:push"])
      }
    ],
    branch: "master"
  }
};

test("locate repository several", async t => {
  const provider = createProvider();

  t.plan(96);

  for (const [name, repositoryFixture] of Object.entries(repoFixtures)) {
    const repository = await provider.repository(name);
    await assertRepo(t, repository, repositoryFixture, name);
  }
});

test("locate branch several", async t => {
  const provider = createProvider();

  t.plan(30);

  for (const [name, repositoryFixture] of Object.entries(repoFixtures)) {
    const branch = await provider.branch(name);
    await assertBranch(t, branch, repositoryFixture, name);
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
    GithubProvider.initialize(undefined, process.env)
  ]);

  const repository = await provider.repository(
    "arlac77/aggregation-repository-provider"
  );

  //t.is(repository.provider.name, "GithubProvider");
  t.is(repository.fullName, "arlac77/aggregation-repository-provider");
});
