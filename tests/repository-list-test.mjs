import test from "ava";
import { repositoryListTest } from "repository-provider-test-support";

import GithubProvider from "github-repository-provider";
import GiteaProvider from "gitea-repository-provider";
import BitbucketProvider from "bitbucket-repository-provider";
import AggregationProvider from "aggregation-repository-provider";

function createProvider() {
  return AggregationProvider.initialize(
    [GiteaProvider, GithubProvider, BitbucketProvider],
    undefined,
    process.env
  );
}

const provider = createProvider();

test("single repo", async t => {
  const r = await provider.repository("k0nsti/konsum");
  t.is(r.identifier, "github:k0nsti/konsum");
});

test(repositoryListTest, provider, "k0nsti/*", {
  "k0nsti/konsum": {
    name: "konsum"
  }
});

test(repositoryListTest, provider, "arlac77/*repository-provider", {
  "arlac77/aggregation-repository-provider": {
    name: "aggregation-repository-provider"
  },
  "arlac77/repository-provider": {
    name: "repository-provider"
  }
});

test(repositoryListTest, provider, undefined, {
  "github-mirror/aggregation-repository-provider": {
    name: "aggregation-repository-provider"
  },
  "github-mirror/template-ava": {
    name: "template-ava"
  }
});

test(repositoryListTest, provider, "no_such_group/*");
