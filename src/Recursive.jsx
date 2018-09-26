import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class Recursive extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node,
			PropTypes.array
		]),
		iteration: PropTypes.number,
		maxIterations: PropTypes.number,
		array: PropTypes.arrayOf(PropTypes.any),
		tree: PropTypes.bool,
		nodesName: PropTypes.string,
		keyName: PropTypes.string
	};

	static defaultProps = {
		children: undefined,
		iteration: 0,
		maxIterations: 10,
		array: undefined,
		tree: false,
		nodesName: "nodes",
		keyName: ""
	};

	get iterationProps() {
		const {
			children,
			iteration,
			maxIterations,
			tree,
			nodesName,
			keyName,
			...iterationProps
		} = this.props;

		return iterationProps;
	}

	get nextIteration() {
		return this.props.iteration + 1;
	}

	get willRecurse() {
		return this.nextIteration < this.props.maxIterations;
	}

	get isChildrenArray() {
		return Array.isArray(this.props.children);
	}

	get nodes() {
		return this.iterationProps[this.props.nodesName];
	}

	get hasNodes() {
		const { nodes } = this;

		return nodes && Array.isArray(nodes) && nodes.length > 0;
	}

	renderNext = newProps => {
		const { nextIteration, willRecurse } = this;
		const { children } = this.props;

		return !willRecurse ? null : (
			<Recursive {...this.props} {...newProps} iteration={nextIteration}>
				{children}
			</Recursive>
		);
	};

	renderNodes = newProps => {
		const { nextIteration, nodes, hasNodes } = this;
		const { children, array, nodesName, tree, keyName } = this.props;

		return !hasNodes
			? null
			: nodes.map(node => (
					<Recursive
						array={array}
						tree={tree}
						nodesName={nodesName}
						keyName={keyName}
						{...node}
						{...newProps}
						iteration={nextIteration}
						key={node[keyName]}
					>
						{children}
					</Recursive>
			  ));
	};

	render = () => {
		const {
			children,
			iteration,
			maxIterations,
			array,
			tree,
			keyName
		} = this.props;

		if (!children && !array)
			throw new Error(
				'Recursive component requires an "array" prop when no children are provided.'
			);

		if (iteration >= maxIterations) return null;

		const { nextIteration, willRecurse, isChildrenArray } = this;

		if (children && typeof children !== "function" && !isChildrenArray)
			return (
				<Fragment>
					{children}

					{willRecurse && (
						<Recursive {...this.props} iteration={nextIteration}>
							{children}
						</Recursive>
					)}
				</Fragment>
			);

		const { iterationProps } = this;

		if (isChildrenArray || (!children && array)) {
			const arr = children || array;
			const currentItem = arr[iteration];
			const child =
				typeof currentItem !== "function"
					? currentItem
					: currentItem({
							props: iterationProps,
							value: iteration,
							willRecurse
					  });

			return (
				<Fragment>
					{child}

					{willRecurse && (
						<Recursive
							{...this.props}
							iteration={nextIteration}
							maxIterations={arr.length}
						>
							{children}
						</Recursive>
					)}
				</Fragment>
			);
		}

		const arrayIteration = array ? array[iteration] : undefined;

		if (tree) {
			if (!keyName)
				throw new Error('Missing "keyName" prop in Recursive component.');

			const { hasNodes, renderNodes } = this;

			return children({
				props: iterationProps,
				array: arrayIteration,
				depth: iteration,
				hasNodes,
				renderNodes
			});
		}

		const { renderNext } = this;

		return children({
			props: iterationProps,
			array: arrayIteration,
			value: iteration,
			willRecurse,
			renderNext
		});
	};
}

export default Recursive;
