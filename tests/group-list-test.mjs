import test from "ava";
import { groupListTest } from "repository-provider-test-support";

import { GithubProvider } from "github-repository-provider";
import { GiteaProvider } from "gitea-repository-provider";
import { BitbucketProvider } from "bitbucket-repository-provider";
import { AggregationProvider } from "aggregation-repository-provider";

function createProvider() {
  return AggregationProvider.initialize(
    [GiteaProvider, GithubProvider, BitbucketProvider],
    undefined,
    process.env
  );
}

const provider = createProvider();

test(groupListTest, provider, "some_strange_name", undefined);
test(groupListTest, provider, "*", {
  arlac77: {
    type: "User"
    /*description: "xx"*/
  },
  "Kronos-Integration": {
    type: "Organization"
    /*description: "service management with node"*/
  },
  "github-mirror": { description: "github.com mirror" }
});
test(groupListTest, provider, "github-mirror", {
  "github-mirror": { description: "github.com mirror" }
});
test(groupListTest, provider, undefined, {
  arlac77: {},
  "github-mirror": { description: "github.com mirror" }
});
