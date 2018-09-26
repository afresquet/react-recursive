import React, { Component, Fragment } from "react";

import Recursive from "react-recursive";

const App = () => (
	<Fragment>
		<h1>React Recursive</h1>

		<pre style={{ whiteSpace: "pre", tabSize: 2 }}>
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

		<pre style={{ whiteSpace: "pre", tabSize: 2 }}>
			{`
		<ul>
			<Recursive maxIterations={3}>
				{iteration => (
					<Fragment>
						<li>
							<p>Item {iteration.value + 1}</p>
							<p>
								Will item {iteration.value + 2} render?
								{iteration.willRecurse ? " Yes" : " No"}
							</p>
						</li>

						{iteration.willRecurse && <ul>{iteration.renderNext()}</ul>}
					</Fragment>
				)}
			</Recursive>
		</ul>
			`}
		</pre>
		<ul>
			<Recursive maxIterations={3}>
				{iteration => (
					<Fragment>
						<li>
							<p>Item {iteration.value + 1}</p>
							<p>
								Will item {iteration.value + 2} render?
								{iteration.willRecurse ? " Yes" : " No"}
							</p>
						</li>

						{iteration.willRecurse && <ul>{iteration.renderNext()}</ul>}
					</Fragment>
				)}
			</Recursive>
		</ul>
	</Fragment>
);

export default App;
