import test from "ava";
import { GithubProvider } from "github-repository-provider";
import { GiteaProvider } from "gitea-repository-provider";
import { AggregationProvider } from "../src/repository-provider.mjs";

function createProvider() {
  return new AggregationProvider([
    GiteaProvider.initialize(undefined, process.env),
    GithubProvider.initialize(undefined, process.env)
  ]);
}

test("list repositories github", async t => {
  const provider = createProvider();

  const r = {};

  for await (const repository of provider.repositories(
    "arlac77/*"
  )) {
    //console.log("REPO",repository);
    r[repository.fullName] = repository;
  }

  t.truthy(r["arlac77/aggregation-repository-provider"]);
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


test.skip("list groups github", async t => {
  const provider = createProvider();

  const rgs = {};

  for await (const rg of provider.repositoryGroups()) {
    rgs[rg.name] = rg;
    console.log("YYY", rg.provider.name, rg, rg.name);
  }

  t.truthy(rgs["arlac77"]);
});
