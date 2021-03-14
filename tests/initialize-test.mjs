import test from "ava";

import AggregationProvider from "aggregation-repository-provider";

test("initialize 1", async t => {
  const provider = await AggregationProvider.initialize(
    ["github-repository-provider"],
    {},
    process.env
  );

  t.is(provider.name, "aggregation");
  t.is(provider.providers.length, 1);
});

test("initialize AGGREGATION_FACTORIES", async t => {
  const provider = await AggregationProvider.initialize(
    [],
    {},
    {
      AGGREGATION_FACTORIES:
        "github-repository-provider,gitea-repository-provider",
      ...process.env
    }
  );

  t.is(provider.name, "aggregation");
  t.is(provider.providers.length, 2);
  t.is(provider.providers[0].name, "github");
  t.is(provider.providers[1].name, "gitea");
});
