import React from "react";

import Recursive from "react-recursive";

const tree = [
	{
		name: "One",
		nodes: [
			{
				name: "One One",
				nodes: [
					{ name: "One One One" },
					{ name: "One One Two" },
					{ name: "One One Three" },
				],
			},
			{ name: "One Two" },
		],
	},
	{
		name: "Two",
		nodes: [
			{ name: "Two One" },
			{
				name: "Two Two",
				nodes: [
					{ name: "Two Two One" },
					{ name: "Two Two Two", nodes: [{ name: "Two Two Two One" }] },
				],
			},
		],
	},
	{ name: "Three" },
	{ name: "Four", nodes: [{ name: "Four One" }] },
];

const styles = {
	container: { display: "flex" },
	code: { whiteSpace: "pre", tabSize: 2 },
};

const App = () => (
	<div style={styles.container}>
		<div>
			<h1>React Recursive</h1>

			<pre style={styles.code}>
				{`
		<ul>
			<Recursive maxIterations={5}>
				<li>
					<p>Five Items</p>
				</li>
			</Recursive>
		</ul>
			`}
			</pre>
			<ul>
				<Recursive maxIterations={5}>
					<li>
						<p>Five Items</p>
					</li>
				</Recursive>
			</ul>

			<pre style={styles.code}>
				{`
		<Recursive
			foo="bar"
			array={[
				"Item 1",
				<h2 key="array-2">Item 2</h2>,
				({ props, index, willRecurse }) => [
					\`Item \${index + 1}\`,
					" | ",
					\`foo="\${props.foo}"\`,
					" | ",
					<i key="array-3-italic">{\`Will continue? \${
						willRecurse ? "Yes" : "No"
					}\`}</i>,
				],
			]}
		/>
				`}
			</pre>
			<Recursive
				foo="bar"
				array={[
					"Item 1",
					<h2 key="array-2">Item 2</h2>,
					({ props, index, willRecurse }) => [
						`Item ${index + 1}`,
						" | ",
						`foo="${props.foo}"`,
						" | ",
						<i key="array-3-italic">{`Will continue? ${
							willRecurse ? "Yes" : "No"
						}`}</i>,
					],
				]}
			/>

			<pre style={styles.code}>
				{`
		<ul>
			<Recursive maxIterations={3}>
				{iteration => (
					<li>
						<p>Item {iteration.index + 1}</p>
						<p>
							Will item {iteration.index + 2} render?
							{iteration.willRecurse ? " Yes" : " No"}
						</p>

						{iteration.willRecurse && <ul>{iteration.renderNext()}</ul>}
					</li>
				)}
			</Recursive>
		</ul>
			`}
			</pre>
			<ul>
				<Recursive maxIterations={3}>
					{iteration => (
						<li>
							<p>Item {iteration.index + 1}</p>
							<p>
								Will item {iteration.index + 2} render?
								{iteration.willRecurse ? " Yes" : " No"}
							</p>

							{iteration.willRecurse && <ul>{iteration.renderNext()}</ul>}
						</li>
					)}
				</Recursive>
			</ul>
		</div>

		<div>
			<pre style={styles.code}>
				{`
		const tree = [
			{
				name: "One",
				nodes: [
					{
						name: "One One",
						nodes: [
							{ name: "One One One" },
							{ name: "One One Two" },
							{ name: "One One Three" },
						],
					},
					{ name: "One Two" },
				],
			},
			{
				name: "Two",
				nodes: [
					{ name: "Two One" },
					{
						name: "Two Two",
						nodes: [
							{ name: "Two Two One" },
							{ name: "Two Two Two", nodes: [{ name: "Two Two Two One" }] },
						],
					},
				],
			},
			{ name: "Three" },
			{ name: "Four", nodes: [{ name: "Four One" }] },
		];

		<ul>
			{tree.map(node => (
				<Recursive {...node} tree keyName="name" key={node.name}>
					{iteration => (
						<li>
							<p>
								{iteration.props.name} | depth: {iteration.depth}
							</p>

							{iteration.hasNodes && <ul>{iteration.renderNodes()}</ul>}
						</li>
					)}
				</Recursive>
			))}
		</ul>
			`}
			</pre>
			<ul>
				{tree.map(node => (
					<Recursive {...node} tree keyName="name" key={node.name}>
						{iteration => (
							<li>
								<p>
									{iteration.props.name} | depth: {iteration.depth}
								</p>

								{iteration.hasNodes && <ul>{iteration.renderNodes()}</ul>}
							</li>
						)}
					</Recursive>
				))}
			</ul>
		</div>
	</div>
);

export default App;
