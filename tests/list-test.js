import test from "ava";
import { GithubProvider } from "github-repository-provider";
import { AggregationProvider } from "../src/repository-provider.mjs";

test("list repositories github", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env))
  ]);

  const r = {};

  for await (const repository of provider.repositories(
    "arlac77/*"
  )) {
    console.log("REPO",repository);
    r[repository.fullName] = repository;
  }

  t.truthy(r["arlac77/aggregation-repository-provider"]);
});


test.skip("list groups github", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env))
  ]);

  const rgs = {};

  for await (const rg of provider.repositoryGroups("*")) {
    rgs[rg.name] = rg;
    console.log("YYY", rg);
  }

  t.truthy(rgs["arlac77"]);
});
