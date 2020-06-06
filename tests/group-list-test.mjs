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

test(groupListTest, provider, "some_strange_name", undefined);
test(groupListTest, provider, "github-mirror", {
  "GiteaProvider/github-mirror": { description: "mirror of github.com" }
});

const all = {
  "GithubProvider/arlac77": {
    type: "User"
  },
  "BitbucketProvider/arlac77": {
    type: "user"
  },
  "GithubProvider/Kronos-Integration": {
    type: "Organization"
    // description: "service management with node"
  },
  "GiteaProvider/github-mirror": { description: "mirror of github.com" }
};

test(groupListTest, provider, "*", all);
test(groupListTest, provider, undefined, all);
