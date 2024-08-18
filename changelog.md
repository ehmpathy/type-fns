# Changelog

## [1.18.0](https://github.com/ehmpathy/type-fns/compare/v1.17.0...v1.18.0) (2024-08-18)


### Features

* **array:** expose ArrayWith type declaration ([7855ac5](https://github.com/ehmpathy/type-fns/commit/7855ac529cfd30f463fd7f5657345839af3150d3))

## [1.17.0](https://github.com/ehmpathy/type-fns/compare/v1.16.0...v1.17.0) (2024-07-27)


### Features

* **practs:** bump practs and resolve audit ([e1e7844](https://github.com/ehmpathy/type-fns/commit/e1e7844aedf4e5b805c5d72643606c20b5248dd6))

## [1.16.0](https://github.com/ehmpathy/type-fns/compare/v1.15.0...v1.16.0) (2024-06-14)


### Features

* **metadata:** expose OmitMetadata generic ([20bfea9](https://github.com/ehmpathy/type-fns/commit/20bfea9e8a36a11c885a1c2598f817dffff8d294))

## [1.15.0](https://github.com/ehmpathy/type-fns/compare/v1.14.0...v1.15.0) (2024-05-25)


### Features

* **types:** add PickAny type, symmetric with PickOne ([71cb283](https://github.com/ehmpathy/type-fns/commit/71cb283402577635149758b8474fa9e6f134ecb4))

## [1.14.0](https://github.com/ehmpathy/type-fns/compare/v1.13.0...v1.14.0) (2024-05-25)


### Features

* **checks:** add isKeyOf check ([982f63d](https://github.com/ehmpathy/type-fns/commit/982f63ded16d1fbd3bd3bac77753399b395b37e7))

## [1.13.0](https://github.com/ehmpathy/type-fns/compare/v0.12.0...v1.13.0) (2024-05-14)


### Miscellaneous Chores

* lift to v1 semver range ([#25](https://github.com/ehmpathy/type-fns/issues/25)) ([5e297d8](https://github.com/ehmpathy/type-fns/commit/5e297d8b945ef33810b0ad63591ac1218c284d76))

## [0.12.0](https://github.com/ehmpathy/type-fns/compare/v0.11.0...v0.12.0) (2024-05-11)


### Features

* **assure:** expose generic withAssure wrapper; also, withAssure isPresent ([009b29e](https://github.com/ehmpathy/type-fns/commit/009b29ef4c96e043ba84a5a9e41637f8517226d3))


### Bug Fixes

* **lint:** upgrade eslint to support typescript v5 ([57530dc](https://github.com/ehmpathy/type-fns/commit/57530dc61e727f6035cf0aa030e6f6ad1f290586))

## [0.11.0](https://github.com/ehmpathy/type-fns/compare/v0.10.0...v0.11.0) (2024-05-09)


### Features

* **enum:** add Literalize type to expand enum w literal union ([e35381a](https://github.com/ehmpathy/type-fns/commit/e35381aeee6334219997467acd6f5445a664641a))

## [0.10.0](https://github.com/ehmpathy/type-fns/compare/v0.9.2...v0.10.0) (2024-04-28)


### Features

* **enum:** expand isOfEnum with backwards compat assess and assure ([72ac7ac](https://github.com/ehmpathy/type-fns/commit/72ac7ac7b7f1055d0f7b61fe2fb5f62c98cd8738))

## [0.9.2](https://github.com/ehmpathy/type-fns/compare/v0.9.1...v0.9.2) (2024-04-24)


### Bug Fixes

* **omit:** ensure omit satisfies Omit standard type ([90552cc](https://github.com/ehmpathy/type-fns/commit/90552cc459f663533ac12fde195d9f2c72137cda))
* **pick:** ensure pick satisfies Pick standard type ([cc4fd3d](https://github.com/ehmpathy/type-fns/commit/cc4fd3d253a2d3280cfb135463da2319cdcc83a1))

## [0.9.1](https://github.com/ehmpathy/type-fns/compare/v0.9.0...v0.9.1) (2023-10-26)


### Bug Fixes

* **checks:** include deletedAt as a common metadata key ([7791c38](https://github.com/ehmpathy/type-fns/commit/7791c380c0f3f6513ebe476b7915b364c398689a))
* **docs:** remove outdated cicd badges ([7c6499a](https://github.com/ehmpathy/type-fns/commit/7c6499aa52c35353e2b303ee79f3fcc85e81d065))

## [0.9.0](https://github.com/ehmpathy/type-fns/compare/v0.8.1...v0.9.0) (2023-07-16)


### Features

* **companions:** add pick and omit companion methods ([2aed5a5](https://github.com/ehmpathy/type-fns/commit/2aed5a523b3fc6ca58db5213a57b9e11e790eec2)), closes [#16](https://github.com/ehmpathy/type-fns/issues/16)


### Bug Fixes

* **audit:** resolve security vulnerabilities with audit fix ([90cdbd2](https://github.com/ehmpathy/type-fns/commit/90cdbd22e388e3ab4c84ff03133084bf5f2751f0))

## [0.8.1](https://github.com/ehmpathy/type-fns/compare/v0.8.0...v0.8.1) (2023-02-16)


### Bug Fixes

* **cicd:** skip integration test provision step in cicd ([e5e64ae](https://github.com/ehmpathy/type-fns/commit/e5e64aefa763d65400696c5bad1b7fb7aaba059a))
* **practs:** upgrade to declapract-typescript-ehmpathy best practices ([6915660](https://github.com/ehmpathy/type-fns/commit/6915660c0a9a6101ee9afd505f65ac2731cd43a7))

## [0.8.0](https://www.github.com/ehmpathy/type-fns/compare/v0.7.0...v0.8.0) (2022-11-27)


### Features

* **types:** add DropFirst generic type ([fc3a214](https://www.github.com/ehmpathy/type-fns/commit/fc3a214071c3c975840ffea41b02290829359da4))

## [0.7.0](https://www.github.com/ehmpathy/type-fns/compare/v0.6.0...v0.7.0) (2022-11-26)


### Features

* **checks:** define the hasMetadata type check function ([64b788f](https://www.github.com/ehmpathy/type-fns/commit/64b788fcf1348c654d920750a56bbc77dc3e6dad))

## [0.6.0](https://www.github.com/ehmpathy/type-fns/compare/v0.5.1...v0.6.0) (2022-11-25)


### Features

* **checks:** add isNotUndefined and isNotNull checks ([e810bdf](https://www.github.com/ehmpathy/type-fns/commit/e810bdf5e2ec6b9caa3e289aa8a7c693524b5e65))

### [0.5.1](https://www.github.com/ehmpathy/type-fns/compare/v0.5.0...v0.5.1) (2022-11-25)


### Bug Fixes

* **exports:** actually export NotUndefined ([1869b05](https://www.github.com/ehmpathy/type-fns/commit/1869b05e59764b3b822298dac223b9cb09b02fc0))

## [0.5.0](https://www.github.com/ehmpathy/type-fns/compare/v0.4.1...v0.5.0) (2022-11-25)


### Features

* **types:** add the NotUndefined generic type ([bd613c2](https://www.github.com/ehmpathy/type-fns/commit/bd613c27ced111eb44c971734ab343a9cd2fbe8e))

### [0.4.1](https://www.github.com/ehmpathy/type-fns/compare/v0.4.0...v0.4.1) (2022-11-24)


### Bug Fixes

* **exports:** actually export isAPromise, isAFunction, PickOne ([ad5b28f](https://www.github.com/ehmpathy/type-fns/commit/ad5b28f1d2da9fe382d1245d38d970b1b0e7bd1c))

## [0.4.0](https://www.github.com/ehmpathy/type-fns/compare/v0.3.0...v0.4.0) (2022-11-24)


### Features

* **checks:** add isAFunction, isAPromise, and PickOne type checks and generic type ([981ae42](https://www.github.com/ehmpathy/type-fns/commit/981ae4275530bdae203b9013bed193f1afda6b8d))


### Bug Fixes

* **cicd:** update github actions, test scripts, and swap repo org to ehmpathy ([b6a1458](https://www.github.com/ehmpathy/type-fns/commit/b6a1458b6d2d5423255fc8eaee2e3181d0c14850))
* **doc:** fix comment describing has metadata in code ([d7d2e55](https://www.github.com/ehmpathy/type-fns/commit/d7d2e556ba03ad5a573f90d6ea75c5696f493058))
* **name:** rename package to type-fns ([66258d9](https://www.github.com/ehmpathy/type-fns/commit/66258d93e7964c675b92f50061ddcb11a79f2b69))
* **tests:** remove example of type error from tests ([326123c](https://www.github.com/ehmpathy/type-fns/commit/326123cf845b31e82edb0d3d50cd6034217df2fa))

## [0.3.0](https://www.github.com/ehmpathy/type-fns/compare/v0.2.1...v0.3.0) (2022-01-03)


### Features

* **checks:** add the HasMetadata type modifier ([85f0ca4](https://www.github.com/ehmpathy/type-fns/commit/85f0ca467983ea6f1fc5845990f98dbe9cbe5e8f))

### [0.2.1](https://www.github.com/ehmpathy/type-fns/compare/v0.2.0...v0.2.1) (2021-11-16)


### Bug Fixes

* **enum:** forbid giving isOfEnum functions null or undefined as an input ([98ec621](https://www.github.com/ehmpathy/type-fns/commit/98ec6216bc5775cbb2015f400358fe7d5fffc303))
