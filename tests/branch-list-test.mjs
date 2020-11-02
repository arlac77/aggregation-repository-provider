import test from "ava";
import { branchListTest } from "repository-provider-test-support";

import GithubProvider from "github-repository-provider";
import BitbucketProvider from "bitbucket-repository-provider";
import GiteaProvider from "gitea-repository-provider";
import LocalProvider from "local-repository-provider";
import MockProvider from "mock-repository-provider";
import AggregationProvider from "aggregation-repository-provider";

function createProvider() {
  return new AggregationProvider([
    GithubProvider.initialize({ priority: 2 }, process.env),
    GiteaProvider.initialize({ priority: 3 }, process.env),
    BitbucketProvider.initialize({ priority: 1 }, process.env),
    new MockProvider(
      {
        "mock1/repo1": {
          master: {}
        },
        "arlac77/npm-mocket-1": {
          master: {}
        }

      },
      { delay: 10000, priority: 4 }
    ),
  //    LocalProvider.initialize(undefined, process.env)
  ]);
}

const provider = createProvider();

test(branchListTest, provider, "mock1/r*", {
  "mock1/repo1": {
    fullCondensedName: "mock1/repo1"
  }
});

test(branchListTest, provider, "bad-name/unknown-*");
test(branchListTest, provider, "arlac77/npm-*", 6);
test(branchListTest, provider, "https://github.com/arlac77/npm-*", 6);
test(
  branchListTest,
  provider,
  "arlac77/*repository-provider",
  {
    "github/arlac77/aggregation-repository-provider": {
      fullCondensedName: "arlac77/aggregation-repository-provider"
    }
  },
  true
);
