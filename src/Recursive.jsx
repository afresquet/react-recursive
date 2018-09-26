import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class Recursive extends Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.node,
			PropTypes.array
		]).isRequired,
		iteration: PropTypes.number,
		maxIterations: PropTypes.number,
		tree: PropTypes.bool,
		nodesName: PropTypes.string,
		keyName: PropTypes.string
	};

	static defaultProps = {
		iteration: 0,
		maxIterations: 10,
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
		const { children, nodesName, tree, keyName } = this.props;

		return !hasNodes
			? null
			: nodes.map(node => (
					<Recursive
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
		const { children, iteration, maxIterations, tree, keyName } = this.props;

		if (iteration >= maxIterations) return null;

		const { nextIteration, willRecurse, isChildrenArray } = this;

		if (typeof children !== "function" && !isChildrenArray)
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

		if (isChildrenArray) {
			const currentItem = children[iteration];
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
							maxIterations={children.length}
						>
							{children}
						</Recursive>
					)}
				</Fragment>
			);
		}

		if (tree) {
			if (!keyName)
				throw new Error('Missing "keyName" prop in Recursive component.');

			const { hasNodes, renderNodes } = this;

			return children({
				props: iterationProps,
				depth: iteration,
				hasNodes,
				renderNodes
			});
		}

		const { renderNext } = this;

		return children({
			props: iterationProps,
			value: iteration,
			willRecurse,
			renderNext
		});
	};
}

export default Recursive;
