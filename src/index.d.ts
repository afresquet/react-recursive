import { Component, ReactNode } from "react";

export type RecursiveRender = (
	/** Props that will be passed to the next iterations. Can override anything except the iteration number. */
	newProps?: {}
) => ReactNode;

export type RecursiveIterationFunction = (
	iteration: {
		/** Props passed to the parent Recursive component and new props passed in 'renderNext' or 'renderNodes'. */
		props: {};
		/** Current iteration of the (optional) provided array. */
		array: any;
		/** Current iteration index number. Only defined when the recursion is not a tree. */
		index: number;
		/** True when next iteration won't reach the maxium number of iterations, false when it will. Only defined when the recursion is not a tree. */
		willRecurse: boolean;
		/** Function that renders the next iteration. Only defined when the recursion is not a tree. */
		renderNext: RecursiveRender;
		/** Current depth of the tree. Only defined when the recursion is a tree. */
		depth: number;
		/** True when the current node has child nodes, false when it doesn't. Only defined when the recursion is a tree. */
		hasNodes: boolean;
		/** Function that renders the next nodes of the iteration. Only defined when the recursion is a tree. */
		renderNodes: RecursiveRender;
	}
) => ReactNode;

export interface RecursiveProps {
	children?: ReactNode | RecursiveIterationFunction;
	/** Starting iteration number, cannot be changed afterwards. */
	iteration?: number;
	/** Limit of recursive iterations that can happen. */
	maxIterations?: number;
	/** Array containing elements to be passed to each iteration. */
	array?: any[];
	/** Indicates if the recursion happens on a tree. */
	tree?: boolean;
	/** Name of the tree nodes parameter. */
	nodesName?: string;
	/** Unique identifier for each node when recursing over a tree. */
	keyName?: string;
}

declare class Recursive extends Component<RecursiveProps> {
	/** Hard cap on the maximum number of recursions that defaults to 10000. Setting it to 0 eliminates the cap. Change at your own risk. */
	static MAX_RECURSIONS_HARD_CAP: number;
}

export default Recursive;
