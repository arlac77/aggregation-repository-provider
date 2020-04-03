import test from "ava";
import { groupListTest } from "repository-provider-test-support";

import { GithubProvider } from "github-repository-provider";
import { GiteaProvider } from "gitea-repository-provider";
import { BitbucketProvider } from "bitbucket-repository-provider";
import { AggregationProvider } from "../src/repository-provider.mjs";

function createProvider() {
  return new AggregationProvider([
    GiteaProvider.initialize(undefined, process.env),
    GithubProvider.initialize(undefined, process.env),
    BitbucketProvider.initialize(undefined, process.env),
  ]);
}

const provider = createProvider();

test(groupListTest, provider, "some_strange_name", undefined);
test(groupListTest, provider, "*", {
  arlac77: {},
  "github-mirror": { description: "github.com mirror" },
});
test(groupListTest, provider, "github-mirror", {
  "github-mirror": { description: "github.com mirror" },
});
test.skip(groupListTest, provider, undefined, {
  arlac77: {},
  "github-mirror": { description: "github.com mirror" },
});
