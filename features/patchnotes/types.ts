/** Represents a single change entry in a patchnote */
export interface PatchnoteChange {
	type: "added" | "improved" | "fixed" | "removed";
	description: string;
}

/** Represents a complete version patchnote */
export interface Patchnote {
	id: string;
	version: string;
	title: string;
	date: string;
	summary: string;
	changes: PatchnoteChange[];
	isNew?: boolean;
}
