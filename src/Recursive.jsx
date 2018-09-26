import React, { Fragment } from "react";
import PropTypes from "prop-types";

const Recursive = props => {
	const { iteration, maxIterations, ...rest } = props;

	if (iteration === maxIterations) return null;

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

	const renderNext = extra =>
		!willRecurse ? null : (
			<Recursive {...props} {...extra} iteration={nextIteration}>
				{props.children}
			</Recursive>
		);

	return props.children({
		props: rest,
		value: iteration,
		willRecurse,
		renderNext
	});
};

Recursive.propTypes = {
	iteration: PropTypes.number,
	maxIterations: PropTypes.number
};

Recursive.defaultProps = {
	iteration: 0,
	maxIterations: 10
};

export default Recursive;
