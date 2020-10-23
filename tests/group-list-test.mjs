import test from "ava";
import { groupListTest } from "repository-provider-test-support";

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

test(groupListTest, provider, "some_strange_name", undefined, true);
test(groupListTest, provider, "github-mirror", {
  "gitea/github-mirror": { description: "mirror of github.com" }
}, true);

const all = {
  "github/arlac77": {
    type: "User"
  },
  "bitbucket/arlac77": {
    type: "user"
  },
  "github/Kronos-Integration": {
    type: "Organization"
    // description: "service management with node"
  },
  "gitea/github-mirror": { description: "mirror of github.com" }
};

test(groupListTest, provider, "*", all, true);
test(groupListTest, provider, undefined, all, true);
