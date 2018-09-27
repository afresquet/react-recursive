# React Recursive &middot; [![Build Status](https://travis-ci.org/afresquet/react-recursive.svg?branch=master)](https://travis-ci.org/afresquet/react-recursive) [![Coverage Status](https://coveralls.io/repos/github/afresquet/react-recursive/badge.svg?branch=master)](https://coveralls.io/github/afresquet/react-recursive?branch=master)

A React component to easily create recursive components.

The main feature, and probably only relevant one, of this component is that you can easily recurse over trees and declare how it's going to look.

Otherwise it can be used as a glorified loop with a bit more flexibility.

This component also show how awesome it is to have functions as children in React components.

Collaboration and PRs are welcome!

## Table of contents

1. [Getting Started](#Getting-Started)
   1. [Installation](#Installation)
   2. [Usage](#Usage)
2. [Documentation](#Documentation)
   1. [Props](#Props)
      1. [iteration](#iteration)
      2. [maxIterations](#maxIterations)
      3. [array](#array)
      4. [tree](#tree)
      5. [nodesName](#nodesName)
      6. [keyName](#keyName)
      7. [children](#children)
      8. [rest props](#rest-props)
   2. [Iteration Object](#Iteration-Object)
      1. [iteration.props](#iteration.props)
      2. [iteration.array](#iteration.array)
      3. [iteration.index](#iteration.index)
      4. [iteration.willRecurse](#iteration.willRecurse)
      5. [iteration.renderNext()](<#iteration.renderNext()>)
      6. [iteration.depth](#iteration.depth)
      7. [iteration.hasNodes](#iteration.hasNodes)
      8. [iteration.renderNodes()](<#iteration.renderNodes()>)
3. [Examples](#Examples)
4. [Credits](#Credits)
5. [License](#License)

## Getting Started

### Installation

```sh
npm install react-recursive
```

or

```sh
yarn add react-recursive
```

### Usage

```jsx
import React from "react";
import Recursive from "react-recursive";

const App = () => (
	<Recursive>
		<h1>Hello world!</h1>
	</Recursive>
);

export default App;
```

## Documentation

### Props

All props are optional and, with the exeption of [`iteration`](#iteration), can be changed during the recursion.

Some props are dependent on others, for example if you set [`tree`](#tree) to `true`, you must provide a [`keyName`](#keyName) prop.

For simplicity's sake, some example snippets will show self-closing components but note that this is only possible when providing an [`array`](#array) prop.

The props are the following:

#### iteration

Starting iteration index number. Defaults to 0.

This is the only prop that can't be changed once the recursion begins.

This prop has no effect when children are not passed.

```jsx
<Recursive /> // Begins at default iteration index 0.

<Recursive iteration={1} /> // Begins at iteration index 1.
```

#### maxIterations

Cap that sets a maximum amount of iterations that the component can recurse on. Default is 10.

Once that cap is reached, the next iteration will not return a component, but instead it will return `null`.

This prop has no effect when children are not passed, unless it's set to 0.

```jsx
<Recursive /> // Will do up to 10 iterations by default.

<Recursive maxIterations={100} /> // Will do up to 100 iterations.
```

#### array

Array that will be iterated through during the recursion if it's defined.

If the component receives a function as a child the current item of the array will be passed in the [`iteration` object](#iteration-object).

If no children are provided this prop becomes required instead of optional. Items of this array can be anything that can be rendered by React, and if a function that returns a valid component is passed it takes an [`iteration` object](#iteration-object) as its parameter.

Note that the prop [`maxIterations`](#maxIterations) has no effect if no children are provided, or if the child is an array. It uses the length of the array as the maximum amount of iterations.

Also note that if a function child is provided, if the array contains a function it will not be called and you must do so manually.

```jsx
<Recursive /> // ERROR: Prop `array` is required.

<Recursive array={[
  "Foo ",
  () => <span>Bar<span>,
  iteration => `Baz + ${iteration.index}`
]} /> // Output: Foo Bar Baz + 2

<Recursive array={["Foo"]}>
  {iteration => console.log(iteration.array)} // Foo
</Recursive>
```

#### tree

Determines if the recursion is happening over a tree. Defaults to false.

When set to true, it recurses over a tree and its subsequent nodes.

Since the nodes need to be mapped on, React requires a unique key to be set to each node. This makes `tree` dependent on the `keyName` prop. See [`keyName`](#keyName) for more information.

The tree to recurse over needs to be spread like any other prop in the `Recursive` component.

```jsx
const tree = { id: "123", foo: "bar", nodes: [{}, {}, {}] }

<Recursive tree {...tree} /> // ERROR: Prop `keyName` is required when `tree` is true.

<Recursive tree keyName={"id"} {...tree}>
  {iteration => <div>do stuff here</div>}
</Recursive>
```

#### nodesName

Name of the property that has the nodes of the given tree. Defaults to "nodes".

For example if your tree has its nodes in a property named `"my_cool_nodes"` you pass that as the `nodesName` prop.

For more complex trees, this prop can be changed on the fly during the recursion.

This prop has no effect if the prop [`tree`](#tree) is not `true`.

```jsx
const tree = { id: "123", "my_cool_nodes": [{}, {}, {}] }

<Recursive tree keyName={"id"} {...tree} /> // ERROR: Prop `nodes` does not exist.

<Recursive tree nodesName="my_cool_nodes" keyName={"id"} {...tree}>
  {iteration => <div>do stuff here</div>}
</Recursive>
```

#### keyName

Name of the property that has the unique key of the given tree.

This prop is always required when [`tree`](#tree) is set to `true`.

For example if your tree and its nodes have a unique property named `"uniqueId"` you pass that as the `keyName` prop.

For more complex trees, this prop can be changed on the fly during the recursion.

This prop has no effect if the prop [`tree`](#tree) is not `true`.

```jsx
const tree = { uniqueId: "123", nodes: [{}, {}, {}] }

<Recursive tree {...tree} /> // ERROR: Prop `keyName` is required when `tree` is true.

<Recursive tree keyName={"uniqueId"} {...tree}>
  {iteration => <div>do stuff here</div>}
</Recursive>
```

#### children

The `Recursive` component takes anything that is considered a valid component by React.

It will render its children one after another the amount of times provided in the [`maxIterations`](#maxIterations) prop.

If the child is an array it will render each item one after another. If an item is a function, an [`iteration` object](#iteration-object) will be passed as its argument.

If the child is a function it receives an [`iteration` object](#iteration-object) as its argument, which allows for more complex structures with more interesting results. See more about the [`iteration` object here](#iteration-object).

If no children are provided, an [`array`](#array) prop is necessary and it will behave the same way as passing an array child.

```jsx
<Recursive /> // ERROR: No children nor array provided

<Recursive maxIterations={3}>
  <h1>Hello world!</h1>
<Recursive>

<Recursive array={["Foo", "Bar", "Baz"]} />

<Recursive>
  {["Foo", "Bar", "Baz"]}
</Recursive>

<Recursive>
  {iteration => <div>do stuff here</div>}
</Recursive>
```

#### rest props

Any other props passed to the `Recursive` component are passed to the [`iteration` object](#iteration-object) on its [`props`](#iteration.props) property.

This props can be changed during the recursion and new ones can be added on the fly.

```jsx
<Recursive foo="bar">
  {iteration => console.log(iteration.props)} // { foo: "bar" }
</Recursive>
```

### Iteration Object

When the child of the component is a function, it receives an "`iteration` object" as its argument.

This object has some information and tools from the current iteration.

It contains the following properties and methods:

#### iteration.props

An object with any other extra props passed to the `Recursive` and new ones received from the [`renderNext`](#iteration.renderNext) and [`renderNodes`](#iteration.renderNodes) methods.

This props can be changed during the recursion and new ones can be added on the fly.

```jsx
<Recursive foo="bar">
  {iteration => console.log(iteration.props)} // { foo: "bar" }
</Recursive>
```

#### iteration.array

The current iteration of the provided [array](#array). If no array is provided it will be `undefined`.

```jsx
<Recursive array={["Foo"]}>
	{iteration => console.log(iteration.array)} // Foo
</Recursive>
```

#### iteration.index

The current index number of the iteration.

This property is only defined when not recursing over a [tree](#tree).

```jsx
<Recursive maxIterations={5}>
	{iteration => console.log(iteration.index)} // 0, 1, 2, 3, 4
</Recursive>
```

#### iteration.willRecurse

Indicates if the next iteration will reach the maximum iterations provided.

If it is `false` it means that if the [`maxIterations`](#maxIterations) prop stays the same the next iteration will return `null`.

This property is only defined when not recursing over a [tree](#tree).

```jsx
<Recursive maxIterations={3}>
	{iteration => console.log(iteration.willRecurse)} // true, true, false
</Recursive>
```

#### iteration.renderNext()

This is the function that keeps the recursion going. When called it returns the next iteration at the position that is called.

It can receive an object as its argument that will pass new props or modify existing ones for the next iteration. The only unmodifiable prop is the [current iteration index](#iteration.index).

Not calling this function is the equivalent of terminating the recursion early. Otherwise [`maxIterations`](#maxIterations) will handle that.

This property is only defined when not recursing over a [tree](#tree).

```jsx
<Recursive maxIterations={3} foo="bar">
	{iteration => (
		<Fragment>
			<p>Iteration {iteration.index + 1}</p>

			{iteration.willRecurse && iteration.renderNext({ foo: "baz" })}
		</Fragment>
	)}
</Recursive>
```

#### iteration.depth

Similar to [`iteration.index`](#iteration.index), but instead of being the current iteration index number it's the current depth of the tree.

This means that the parent node of the tree will be of `depth` 0, its nodes will be 1, and so on.

This property is only defined when recursing over a [tree](#tree).

```js
const tree = {
	name: "Foo", // Depth: 0
	nodes: [
		{
			name: "Bar", // Depth: 1
		},
		{
			name: "Baz", // Depth: 1
			nodes: [
				{
					name: "Qux", // Depth: 2
				},
			],
		},
	],
};
```

#### iteration.hasNodes

Similar to [`iteration.willRecurse`](#iteration.willRecurse), but instead indicates if the current node has child nodes to recurse over.

If it's `false` it means that [`iteration.renderNodes`](#iteration.renderNodes) will return `null`.

This property is only defined when recursing over a [tree](#tree).

```js
const tree = {
	name: "Foo", // hasNodes: true
	nodes: [
		{
			name: "Bar", // hasNodes: false
		},
		{
			name: "Baz", // hasNodes: true
			nodes: [
				{
					name: "Qux", // hasNodes: false
				},
			],
		},
	],
};
```

#### iteration.renderNodes()

Similar to [`iteration.renderNext`](#iteration.renderNext), but instead it loops through all of the current iteration nodes and renders them.

It can receive an object as its argument that will pass new props or modify existing ones for the next iteration. The only unmodifiable prop is the [current iteration depth](#iteration.depth).

Not calling this function is the equivalent of terminating the recursion early. Otherwise either if there are [no nodes to recurse over](#iteration.hasNodes) or [`maxIterations`](#maxIterations) will handle that.

This property is only defined when recursing over a [tree](#tree).

```jsx
const tree = { name: "Foo", nodes: [{ name: "Bar"}, { name: "Baz"}] }

<Recursive maxIterations={3} {...tree} tree keyName="name" foo="bar">
	{iteration => (
		<Fragment>
			<p>Depth {iteration.depth + 1}</p>

			{iteration.hasNodes && iteration.renderNodes({ foo: "baz" })}
		</Fragment>
	)}
</Recursive>
```

## Examples

You can find examples at the [project's GitHub Page](https://afresquet.github.io/react-recursive/).

The real benefit of this component can be seen when recursing over trees of data, which is easier to illustrate on a website than it is on a documentation file.

In the mean time, here's a few simple ones to begin with:

### Example 1

```jsx
<Recursive maxIterations={3}>
	<p>Three Items</p>
</Recursive>
```

HTML output:

```html
<p>Three Items</p>
<p>Three Items</p>
<p>Three Items</p>
```

### Example 2

```jsx
<Recursive maxIterations={5}>
	{iteration => (
		<Fragment>
			{iteration.willRecurse &&
				iteration.index % 2 !== 0 &&
				iteration.renderNext()}

			<p>Item {5 - iteration.index}</p>

			{iteration.willRecurse &&
				iteration.index % 2 === 0 &&
				iteration.renderNext()}
		</Fragment>
	)}
</Recursive>
```

HTML output:

```html
<p>Item 5</p> // Iteration 1
<p>Item 3</p> // Iteration 3
<p>Item 1</p> // Iteration 5
<p>Item 2</p> // Iteration 4
<p>Item 4</p> // Iteration 2
```

### Example 3

```jsx
const array = ["Foo", "Bar", "Baz"];

<ul>
	<Recursive maxIterations={array.length} array={array}>
		{iteration => (
			<li>
				<p>{iteration.array}</p>
				<p>
					Will another list render?
					{iteration.willRecurse ? " Yes" : " No"}
				</p>

				{iteration.willRecurse && <ul>{iteration.renderNext()}</ul>}
			</li>
		)}
	</Recursive>
</ul>;
```

HTML output:

```html
<ul>
  <li>
    <p>Foo</p>
    <p>Will another list render? Yes</p>
    <ul>
      <li>
        <p>Bar</p>
        <p>Will another list render? Yes</p>
        <ul>
          <li>
            <p>Baz</p>
            <p>Will another list render? No</p>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

## Credits

Project created with [`create-react-library`](https://www.npmjs.com/package/create-react-library)

## License

[MIT License](./LICENSE).
