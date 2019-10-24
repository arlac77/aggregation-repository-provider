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

test(repositoryListTest, createProvider(), "arlac77/*", {
  "aggregation-repository-provider": {
    fullName: "arlac77/aggregation-repository-provider"
  }
});

test(repositoryListTest, createProvider(), undefined, {
  "aggregation-repository-provider": {
    fullName: "github-mirror/aggregation-repository-provider"
  }
});

test("list branches github", async t => {
  const provider = createProvider();

  const b = {};

  for await (const branch of provider.branches(
    "arlac77/*repository-provider"
  )) {
    //console.log("BRANCH",branch.fullCondensedName);
    b[branch.fullCondensedName] = branch;
  }

  t.truthy(b["arlac77/aggregation-repository-provider"]);
});
