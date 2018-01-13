import test from 'ava';
import { GithubProvider } from 'github-repository-provider';

import { AggregationProvider } from '../src/repository-provider';

test('locate github', async t => {
  const provider = new AggregationProvider([new GithubProvider()]);

  const repository = await provider.repository(
    'https://github.com/arlac77/aggregation-repository-provider.git'
  );

  t.is(repository.name, 'arlac77/aggregation-repository-provider');
});
