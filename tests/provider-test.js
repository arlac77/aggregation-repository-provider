import test from 'ava';
import { GithubProvider } from 'github-repository-provider';
import { BitbucketProvider } from 'bitbucket-repository-provider';
import { LocalProvider } from 'local-repository-provider';
import { AggregationProvider } from '../src/repository-provider';

test('locate github https', async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider(),
    new LocalProvider()
  ]);

  const repository = await provider.repository(
    'https://github.com/arlac77/aggregation-repository-provider'
  );

  t.is(repository.name, 'arlac77/aggregation-repository-provider');
});

test('locate github git@', async t => {
  if (process.env.SSH_AUTH_SOCK) {
    const provider = new AggregationProvider([
      new GithubProvider(),
      new BitbucketProvider(),
      new LocalProvider()
    ]);

    const repository = await provider.repository(
      'git@github.com:arlac77/aggregation-repository-provider.git'
    );

    t.is(repository.name, 'arlac77/aggregation-repository-provider');
  } else {
    t.is(1, 1, 'skip git@ test without SSH_AUTH_SOCK');
  }
});

test('locate github short', async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider(),
    new LocalProvider()
  ]);

  const repository = await provider.repository(
    'arlac77/aggregation-repository-provider'
  );

  t.is(repository.name, 'arlac77/aggregation-repository-provider');
});

test('locate bitbucket', async t => {
  const provider = new AggregationProvider([
    new GithubProvider(),
    new BitbucketProvider(),
    new LocalProvider()
  ]);

  const repository = await provider.repository(
    'https://arlac77@bitbucket.org/arlac77/sync-test-repository.git'
  );

  t.is(repository.name, 'arlac77/sync-test-repository');
});
