import test from 'ava';
import { GithubProvider } from 'github-repository-provider';
import { BitbucketProvider } from 'bitbucket-repository-provider';

import { AggregationProvider } from '../src/repository-provider';

test('locate github', async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider()
  ]);

  const repository = await provider.repository(
    'https://github.com/arlac77/aggregation-repository-provider'
  );

  t.is(repository.name, 'arlac77/aggregation-repository-provider');
});

test('locate bitbucket', async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider()
  ]);

  const repository = await provider.repository(
    'https://arlac77@bitbucket.org/arlac77/sync-test-repository.git'
  );

  t.is(repository.name, 'arlac77/sync-test-repository');
});
