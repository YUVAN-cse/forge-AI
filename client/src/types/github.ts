export interface GithubRepository {
    githubRepoId: number;
    name: string;
    fullName: string;
    owner: string;
    description: string | null;
    private: boolean;
    visibility: string;
    language: string | null;
    defaultBranch: string;
    stars: number;
    forks: number;
    openIssues: number;
    size: number;
    cloneUrl: string;
    htmlUrl: string;
    createdAt: string;
    updatedAt: string;
    alreadyImported: boolean;
}

export interface ImportedRepository {
    _id: string;
    project: string;
    githubRepoId: number;
    name: string;
    fullName: string;
    owner: string;
    description: string;
    language: string;
    defaultBranch: string;
    visibility: string;
    private: boolean;
    cloneUrl: string;
    htmlUrl: string;
    importedBy: string;
    importedAt: string;
    lastSyncedAt: string;
}