export type TreeNode = {
    name: string;
    type: "file" | "directory";
    children?: TreeNode[];
};

export type TreeFilter = 'all' | 'files' | 'dirs';
