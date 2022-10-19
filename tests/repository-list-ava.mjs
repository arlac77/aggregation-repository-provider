import test from "ava";
import { createProvider } from "./helpers/util.mjs"; 
import { repositoryListTest } from "repository-provider-test-support";

const provider = createProvider();

test("single repo", async t => {
  const r = await provider.repository("konsumation/konsum");
  t.is(r.identifier, "github:konsumation/konsum");
});

test(repositoryListTest, provider, "konsumation/*", {
  "konsumation/konsum": {
    name: "konsum"
  }
});

test(repositoryListTest, provider, "arlac77/*repository-provider", {
  "arlac77/aggregation-repository-provider": {
    name: "aggregation-repository-provider"
  },
  "arlac77/repository-provider": {
    name: "repository-provider"
  }
});

test(repositoryListTest, provider, undefined, {
  "github-mirror/aggregation-repository-provider": {
    name: "aggregation-repository-provider"
  },
  "github-mirror/template-ava": {
    name: "template-ava"
  }
});

test(repositoryListTest, provider, "no_such_group/*");
