[![npm](https://img.shields.io/npm/v/aggregation-repository-provider.svg)](https://www.npmjs.com/package/aggregation-repository-provider)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/aggregation-repository-provider.svg)](https://greenkeeper.io/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/aggregation-repository-provider)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Build Status](https://secure.travis-ci.org/arlac77/aggregation-repository-provider.png)](http://travis-ci.org/arlac77/aggregation-repository-provider)
[![codecov.io](http://codecov.io/github/arlac77/aggregation-repository-provider/coverage.svg?branch=master)](http://codecov.io/github/arlac77/aggregation-repository-provider?branch=master)
[![Coverage Status](https://coveralls.io/repos/arlac77/aggregation-repository-provider/badge.svg)](https://coveralls.io/r/arlac77/aggregation-repository-provider)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/aggregation-repository-provider/badge.svg)](https://snyk.io/test/github/arlac77/aggregation-repository-provider)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/aggregation-repository-provider.svg?style=flat-square)](https://github.com/arlac77/aggregation-repository-provider/issues)
[![Stories in Ready](https://badge.waffle.io/arlac77/aggregation-repository-provider.svg?label=ready&title=Ready)](http://waffle.io/arlac77/aggregation-repository-provider)
[![Dependency Status](https://david-dm.org/arlac77/aggregation-repository-provider.svg)](https://david-dm.org/arlac77/aggregation-repository-provider)
[![devDependency Status](https://david-dm.org/arlac77/aggregation-repository-provider/dev-status.svg)](https://david-dm.org/arlac77/aggregation-repository-provider#info=devDependencies)
[![docs](http://inch-ci.org/github/arlac77/aggregation-repository-provider.svg?branch=master)](http://inch-ci.org/github/arlac77/aggregation-repository-provider)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![downloads](http://img.shields.io/npm/dm/aggregation-repository-provider.svg?style=flat-square)](https://npmjs.org/package/aggregation-repository-provider)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# aggregation-repository-provider

aggregates several repository providers into one

# API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [AggregationProvider](#aggregationprovider)
    -   [Parameters](#parameters)
    -   [Properties](#properties)
    -   [Examples](#examples)
    -   [repository](#repository)
        -   [Parameters](#parameters-1)
    -   [repositories](#repositories)
        -   [Parameters](#parameters-2)
    -   [repositoryGroup](#repositorygroup)
        -   [Parameters](#parameters-3)

## AggregationProvider

**Extends Provider**

<!-- skip-example -->

Combines several repository providers into one

### Parameters

-   `providers` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Provider>**  (optional, default `[]`)

### Properties

-   `providers` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;Provider>** 

### Examples

```javascript
const provider = new AggregationProvider([
    new GithubProvider(),
  new BitbucketProvider()
]);
 const repository1 = await provider.repository(
   'https://github.com/arlac77/aggregation-repository-provider'
 );
const repository2 = await provider.repository(
 'https://arlac77@bitbucket.org/arlac77/sync-test-repository.git'
);
// repository1 -> github
// repository2 -> bitbucket
```

### repository

Retrieve named repository in one of the given providers.
They are consulted in the order of the propviders given to the constructor

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Primise&lt;Repository>** 

### repositories

List repositories for the owner

#### Parameters

-   `patterns` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)> | [string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String))** 

Returns **Iterator&lt;Repository>** all matching repositories of the owner

### repositoryGroup

Retrieve named repository group in one of the given providers.
They are consulted in the order of the propviders given to the constructor

#### Parameters

-   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Primise&lt;RepositoryGroup>** 

# install

With [npm](http://npmjs.org) do:

```shell
npm install aggregation-repository-provider
```

# license

BSD-2-Clause
