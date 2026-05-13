export type TreeNode = {
    name: string;
    type: "file" | "directory";
    children?: TreeNode[];
};

export type TreeFilter = 'all' | 'files' | 'dirs';

export type TreeSort = "name" | "type";
export type IgnoreMatcher = (relativePath: string, isDirectory: boolean) => boolean;

export type TreeOptions = {
    filter?: TreeFilter;
    sort?: TreeSort;
};
