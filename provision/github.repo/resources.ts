import type { DeclastructProvider } from 'declastruct';
import {
  type DeclaredGithubBranch,
  DeclaredGithubBranchProtection,
  DeclaredGithubRepo,
  DeclaredGithubRepoConfig,
  getDeclastructGithubProvider,
} from 'declastruct-github';
import { type DomainEntity, RefByUnique } from 'domain-objects';
import { UnexpectedCodePathError } from 'helpful-errors';

import pkg from '../../package.json';

/**
 * .what = typed subset of package.json fields used for github repo config
 */
interface PackageJson {
  description?: string;
  private?: boolean;
  homepage?: string;
}

export const getProviders = async (): Promise<DeclastructProvider[]> => [
  getDeclastructGithubProvider(
    {
      credentials: {
        token:
          process.env.GITHUB_TOKEN ??
          UnexpectedCodePathError.throw('github token not supplied'),
      },
    },
    {
      log: {
        info: () => {},
        debug: () => {},
        warn: console.warn,
        error: console.error,
      },
    },
  ),
];

// biome-ignore lint/suspicious/noExplicitAny: DomainEntity generic requires any for heterogeneous array
export const getResources = async (): Promise<DomainEntity<any>[]> => {
  // declare the repo
  const pkgTyped = pkg as PackageJson;
  const repo = DeclaredGithubRepo.as({
    owner: 'ehmpathy',
    name: 'type-fns',
    description: pkgTyped.description ?? null,
    visibility: pkgTyped.private === true ? 'private' : 'public',
    private: pkgTyped.private ?? false, // todo: why do we have to specify this twice?
    homepage: pkgTyped.homepage ?? null,

    // things we haven't changed from the defaults
    archived: false,
  });

  // ref the main branch
  const branchMain = RefByUnique.as<typeof DeclaredGithubBranch>({
    name: 'main',
    repo,
  });

  // declare config for the repo
  const repoConfig = DeclaredGithubRepoConfig.as({
    repo,

    // explicitly set the main branch
    defaultBranch: branchMain.name,

    // we only use issues; the rest is noise today
    hasIssues: true,
    hasProjects: false,
    hasWiki: false,
    isTemplate: false,

    // only squash merges are allowed
    allowSquashMerge: true,
    allowMergeCommit: false, // but especially not merge merges. never merge merges
    allowRebaseMerge: false,

    // allow nice to haves for pulls
    allowAutoMerge: true,
    allowUpdateBranch: true,

    // always cleanup after yourself
    deleteBranchOnMerge: true,

    // configure messages
    mergeCommitMessage: 'PR_TITLE',
    mergeCommitTitle: 'MERGE_MESSAGE',
    squashMergeCommitMessage: 'COMMIT_MESSAGES',
    squashMergeCommitTitle: 'COMMIT_OR_PR_TITLE',
    webCommitSignoffRequired: false,
  });

  // declare protection for that branch, too
  const branchMainProtection = DeclaredGithubBranchProtection.as({
    branch: branchMain,

    enforceAdmins: true, // yes, even admins need to follow this (note: they can still take the time to go and change the settings temporarily for the exceptions)
    allowsDeletions: false, // dont allow the `main` branch to be deleted
    allowsForcePushes: false, // dont allow `main` branch to be force pushed to
    requireLinearHistory: false, //  # no ugly merge commits, woo! 🎉

    requiredStatusChecks: {
      strict: true, // branch must be up to date. otherwise, we dont know if it will really pass once it is merged
      contexts: [
        'suite / install / pnpm',
        'suite / enshard',
        'suite / test-commits',
        'suite / test-types',
        'suite / test-format',
        'suite / test-lint',
        'suite / test-unit',
        'suite / test-integration',
        'suite / test-acceptance-locally',
        'pullreq-title', // "review / pullreq-title",
      ],
    },

    // things we haven't changed from the defaults
    allowForkSyncing: false,
    blockCreations: false,
    lockBranch: false,
    requiredConversationResolution: false,
    requiredPullRequestReviews: null,
    requiredSignatures: false,
    restrictions: null,
  });

  // and return the full set
  return [repo, repoConfig, branchMainProtection];
};
