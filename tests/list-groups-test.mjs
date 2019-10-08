import test from "ava";
import { listGroupsTest } from "repository-provider-test-support";

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

//test(listGroupsTest, provider, "some_strange_name", undefined);
test(listGroupsTest, provider, "*", { arlac77: {}, "github-mirror": { description: "github.com mirror" }  });
//test(listGroupsTest, provider, undefined, { arlac77: {}, "github-mirror": { description: "github.com mirror" }});
