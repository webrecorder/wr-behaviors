# Hacking Autopilot

## Contributing to Autopilot

We welcome contributions from anyone with beginning to advanced programming knowledge.

Please be advised that we have a [code of conduct](./code-of-conduct.md) that we expect all contributors to follow.

### Reporting bugs
Bugs are tracked as [GitHub issues](https://guides.github.com/features/issues/).

Use these steps to report a bug:
1. Determine which repository under which to report the problem
2. Perform a [search](https://github.com/search?q=is%3Aissue+user%3Awebrecorder) to check if the issue has already been reported
3. Use the [bug report template](./bug-report.md) to report the bug.

<!-- ## Tools of the Trade -->

### Advanced options

#### postStep
The export `postStep` can be called after each action to convert the yielded results into the expected format.

It is recommended that you use the library function `lib.buildCustomPostStepFn`if you want to perform some kind of action after each behavior step that is not directly tied to the running of the behavior.

```js
export const postStep = lib.buildCustomPostStepFn(() => { ... });
```

#### Metadata export: match
If you want to compare your URL to multiple sub URLs, you can use a different version of `match`. This version is shown below, and has the two properties `base` (RegExp) and `sub` (Array).

The `base` regular expression is used as a generic test. If `base` matches a URL, the regular expressions in the `sub` array will be tested against the same URL. The behavior is considered matched to a URL when the `base` regular expression matches the URL and one of the `sub` regular expressions also matches the URL.

```js
// variation 2
export const metadata = {
  name: 'the name of your behavior',
  match: {
    regex: {
      base: /a regular expression dictating the base URL the behavior will run on/,
      sub: [
        /an array of regular expressions dictating more specific parts of the base URL the behavior will run on/,
      ],
    },
  },
  description: 'a description of what your behavior does',
};
```
## Testing a behavior (Debugging)
Blocked by PR 63 (testing infrastructure)

## Build System

### Overview

The behavior build process has three phases
- [Initialization](#initialization)
- [Collection](#collection)
- [Building](#building)


### Initialization

Initialization has three steps
1. Ultimate build configuration
2. Building what resolution
3. Ensuring the necessary build directory structure exists


#### Ultimate build configuration

The ultimate build configuration is created in combination with user supplied cli options using the following steps:

 1. If a config was specified using `-c, --config`, the specified config will be used
 2. If the default config exists in the current working directory of the commands, the default config is used
 3. Otherwise the path to the behavior file or dir (`-b, --build [fileOrDir]`) is used and the six config values are set to the project defaults

When a config file is used each of the six values from the config file are resolved as follows
- if the key exists and value is relative, make absolute by resolving it against the directory containing the config file
- if the key exists and is absolute, use key value
- if key does not exist use project default value
  - build, dist: `<directory containing config>/<name>`
  - lib, tsconfig: projects default value
  - metadata: placed in current working directory


Once the ultimate build configuration has been created, the build process proceeds to the next step.

#### Building what resolution

The determination for what is being built is done using the value for the `-b, --build` cli option and that value can be one of two types:
- `boolean`: build all behaviors found in the value for the `behaviors` key from the supplied build config
- `string`: path to a directory containing behaviors or a single behavior to be built

When the value for build is `boolean`:
- If the directory supplied via the `behaviors` config key exists, then what is being built is that directory and the initialization process contains to the next step
> [name=kyragaut] ^^ line 43 this doesn't make sense
- Otherwise, if the directory supplied via the `behaviors` config key does not exist the build process is ended

When the value for build is a `string` and an absolute path:
- If the path exists, then what is being built is that directory or file and the initialization process contains to the next step
> [name=kyragaut] ^^ line 48 this doesn't make sense
- Otherwise, if the path does not exist the build process is ended

When the value for build is a `string` and a relative path, it is resolved in the following order:
1. the value as is resolved using node's relative path resolution algorithm. Note this value is used by other steps if previous ones fail and is denoted as `resolvedPath`
2. the value as is joined with the supplied configs behavior dir or projects default behavior dir
3. the value as is joined with the the current working directory
4. `resolvedPath` is joined with the supplied configs behavior dir or projects default behavior dir
5. `resolvedPath` is joined with the current working directory

If any of the absolute paths described above exist, then what is being built is the resolved path and the initialization process contains to the next step otherwise the build process is ended
> [name=kyragaut] ^^ line 59 this doesn't make sense


#### Ensuring the necessary build directory structure exists

The final step in the initialization process is to ensure that the `build` and `dist` directories exist.

These values may differ from the names used previously only when they are supplied by the user in a build config file.

The `build` directory is used to hold intermediate files used by the build system in order to setup the behavior for final building and usage by other tools such as our own running system.

Any setup in order to facilitate running the behavior is done here.

The `dist` directory is where the built, bundled, behaviors are placed alongside their metadata if configured to do so.


### Collection

The collection phase operates in one of two modes:
- `single behavior`: when the `what is being built` path resolves to file
- `multi-behavior`: when the `what is being built` path resolves to a directory

The primary difference between modes is that `multi-behavior` mode considers every file contained in the directory and its descendant directories.

Both modes use the same means in determining if a file is indeed a behavior which is as follows:
- the file is an es module
- has a `metadata` or `metaData` named export
- has an `isBehavior` named export

Once the behavior(s) have been collected a report is printed stating how many behaviors were found and if any of the files considered partially met the requirements for collection.

**Note**: Both the collection and building phases share modes with the mode operating under set by the collection phase.

### Building

The building phase can be described in the following steps:
1. Extract behaviors metadata
2. Create the behavior's intermediate file in the configured `build` directory
3. Use build behavior using rollup, built behavior placed in configured `dist` directory
4. Once all behaviors have been built generate behavior metadata.


The previous steps are applied to all behaviors returned by the collection phase
##CLI
write docs on npm or yarn scripts
revamp the cli as scripts package.json scripts
<!-- ## Overview on Behaviors -->
## Provided CLI Commands
## Behavior Standard Library Reference
<!-- This is just API? -->