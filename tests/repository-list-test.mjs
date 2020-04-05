import test from "ava";
import { repositoryListTest } from "repository-provider-test-support";

import { GithubProvider } from "github-repository-provider";
import { GiteaProvider } from "gitea-repository-provider";
import { BitbucketProvider } from "bitbucket-repository-provider";
import { AggregationProvider } from "../src/repository-provider.mjs";

function createProvider() {
  return new AggregationProvider([
    GiteaProvider.initialize(undefined, process.env),
    GithubProvider.initialize(undefined, process.env),
    BitbucketProvider.initialize(undefined, process.env)
  ]);
}

const provider = createProvider();

test(repositoryListTest, provider, "arlac77/*", {
  "aggregation-repository-provider": {
    fullName: "arlac77/aggregation-repository-provider"
  }
});

test(repositoryListTest, provider, undefined, {
  "aggregation-repository-provider": {
    fullName: "github-mirror/aggregation-repository-provider"
  }
});

test(repositoryListTest, provider, "no_such_group/*");
