import test from "ava";
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

async function lgt(t, pattern, names) {
  const rgs = {};

  for await (const rg of provider.repositoryGroups(pattern)) {
    rgs[rg.name] = rg;
    //  console.log(rg.provider.name, rg, rg.name);
  }

  console.log(rgs);

  for (const name of names) {
    t.truthy(rgs[name] !== undefined, name);
  }
}

lgt.title = (providedTitle = "list groups", pattern, names) =>
  `${providedTitle} '${pattern}' = ${names}`.trim();

test(lgt, "*", ["arlac77", "old"]);
//test(lgt, undefined, ["arlac77", "old"]);
