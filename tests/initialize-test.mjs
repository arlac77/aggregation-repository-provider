import test from "ava";
import { createMessageDestination } from "repository-provider-test-support";
import AggregationProvider from "aggregation-repository-provider";

test("initialize import name", async t => {
  const provider = await AggregationProvider.initialize(
    ["github-repository-provider"],
    {},
    process.env
  );
  t.is(provider.name, "aggregation");
  t.true(provider._providers.length >= 1);
});

test("initialize AGGREGATION_FACTORIES", async t => {
  const messageDestination = createMessageDestination().messageDestination;

  const provider = await AggregationProvider.initialize(
    [],
    {messageDestination},
    {
      ...process.env,
      AGGREGATION_FACTORIES:
        "github-repository-provider,XGITEA_(gitea-repository-provider),GITEA_(gitea-repository-provider)"
    }
  );

  t.is(provider.name, "aggregation");
  t.is(provider._providers.length, 2);
  t.is(provider._providers[0].name, "github");
  t.is(provider._providers[1].name, "gitea");
});

test("logging", async t => {
  const { messageDestination, messages } = createMessageDestination();

  const provider = await AggregationProvider.initialize(
    ["github-repository-provider"],
    { messageDestination },
    process.env
  );

  t.is(provider.messageDestination, messageDestination);

  provider._providers[0].info("info");
  provider._providers[0].error("error");
  provider._providers[0].warn("warn");

  t.deepEqual(messages.info, ["info"]);
  t.deepEqual(messages.error, ["error"]);
  t.deepEqual(messages.warn, ["warn"]);
});
