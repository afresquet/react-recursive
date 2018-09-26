import React, { Fragment } from "react";
import PropTypes from "prop-types";

const Recursive = props => {
	const { iteration, maxIterations, tree, nodesName, keyName, ...rest } = props;

	if (iteration >= maxIterations) return null;

	const nextIteration = iteration + 1;

	const willRecurse = nextIteration !== maxIterations;

	if (typeof props.children === "object")
		return (
			<Fragment>
				{props.children}

				{willRecurse && (
					<Recursive {...props} iteration={nextIteration}>
						{props.children}
					</Recursive>
				)}
			</Fragment>
		);

	if (!tree) {
		const renderNext = newProps =>
			!willRecurse ? null : (
				<Recursive {...props} {...newProps} iteration={nextIteration}>
					{props.children}
				</Recursive>
			);

		return props.children({
			props: rest,
			value: iteration,
			willRecurse,
			renderNext
		});
	}

	if (!keyName)
		throw new Error('Missing "keyName" prop in Recursive component.');

	const nodes = rest[nodesName];
	const hasNodes = nodes && Array.isArray(nodes) && nodes.length > 0;

	const renderNodes = newProps =>
		!hasNodes
			? null
			: nodes.map(node => (
					<Recursive
						tree
						nodesName={nodesName}
						keyName={keyName}
						{...node}
						{...newProps}
						iteration={nextIteration}
						key={node[keyName]}
					>
						{props.children}
					</Recursive>
			  ));

	return props.children({
		props: rest,
		depth: iteration,
		hasNodes,
		renderNodes
	});
};

Recursive.propTypes = {
	children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
	iteration: PropTypes.number,
	maxIterations: PropTypes.number,
	tree: PropTypes.bool,
	nodesName: PropTypes.string,
	keyName: PropTypes.string
};

Recursive.defaultProps = {
	iteration: 0,
	maxIterations: 10,
	tree: false,
	nodesName: "nodes",
	keyName: ""
};

export default Recursive;
