import test from "ava";
import { GithubProvider } from "github-repository-provider";
import { AggregationProvider } from "../src/repository-provider";

test.skip("list github short pattern", async t => {
  const provider = new AggregationProvider([
    new GithubProvider(GithubProvider.optionsFromEnvironment(process.env))
  ]);

  const r = {};

  for await (const repository of provider.repositories(
    "arlac77/*"
  )) {
    r[repository.fullName] = repository;
  }

  t.truthy(r["arlac77/aggregation-repository-provider"]);
});
