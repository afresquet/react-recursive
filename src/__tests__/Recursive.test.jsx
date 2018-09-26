import React, { Fragment } from "react";
import { shallow, mount } from "enzyme";
import Recursive from "../Recursive";

describe("Recursive component", () => {
	test("Returns null when maxIterations is reached", () => {
		expect.assertions(1);

		const wrapper = shallow(
			<Recursive maxIterations={0}>
				<p>Foo</p>
			</Recursive>
		);

		expect(wrapper.getElement()).toBeNull();
	});

	describe("Components as children", () => {
		test("Renders correctly", () => {
			expect.assertions(1);

			const wrapper = shallow(
				<Recursive>
					<p>Foo</p>
				</Recursive>
			);

			expect(wrapper).toHaveLength(1);
		});

		test("Recursively renders 10 times by default", () => {
			expect.assertions(1);

			const wrapper = mount(
				<Recursive>
					<p>Foo</p>
				</Recursive>
			);
			const iterations = wrapper.find(Recursive);

			expect(iterations).toHaveLength(10);
		});

		test("Recursively renders the amount of times passed in maxIterations", () => {
			expect.assertions(1);

			const wrapper = mount(
				<Recursive maxIterations={2}>
					<p>Foo</p>
				</Recursive>
			);
			const iterations = wrapper.find(Recursive);

			expect(iterations).toHaveLength(2);
		});
	});

	describe("Array as child", () => {
		const mockArray = [1, 2, 3];

		test("Renders correctly", () => {
			expect.assertions(1);

			const wrapper = shallow(<Recursive>{mockArray}</Recursive>);

			expect(wrapper).toHaveLength(1);
		});

		test("Recursively renders the amount of times that the array contains", () => {
			expect.assertions(1);

			const wrapper = mount(<Recursive>{mockArray}</Recursive>);
			const iterations = wrapper.find(Recursive);

			expect(iterations).toHaveLength(mockArray.length);
		});

		describe("Function as array item", () => {
			const mockProps = { foo: "bar" };
			const mockArrayWithFn = [1, 2, jest.fn(() => 3)];
			const fnItem = mockArrayWithFn[2]; // eslint-disable-line prefer-destructuring
			let iterationObj;

			beforeAll(() => {
				mount(<Recursive {...mockProps}>{mockArrayWithFn}</Recursive>);
				iterationObj = fnItem.mock.calls[0][0]; // eslint-disable-line prefer-destructuring
			});

			test("Calls the function if the array item is a function", () => {
				expect.assertions(1);

				expect(fnItem).toHaveBeenCalledTimes(1);
			});

			test("Function gets passed an iteration object", () => {
				expect.assertions(1);

				expect(iterationObj).toBeInstanceOf(Object);
			});

			test("Iteration object has the passed props", () => {
				expect.assertions(1);

				expect(iterationObj.props.foo).toEqual(mockProps.foo);
			});

			test("Iteration object has the current iteration number", () => {
				expect.assertions(1);

				expect(iterationObj.value).toEqual(2);
			});

			test("Iteration object has a 'willRecurse' boolean", () => {
				expect.assertions(1);

				expect(iterationObj.willRecurse).toEqual(false);
			});
		});
	});

	describe("Function as child", () => {
		test("Renders correctly", () => {
			expect.assertions(1);

			const wrapper = shallow(<Recursive>{() => <p>Hello</p>}</Recursive>);

			expect(wrapper).toHaveLength(1);
		});

		test("Recursively renders 10 times by default", () => {
			expect.assertions(1);

			const wrapper = mount(
				<Recursive>
					{iteration => (
						<Fragment>
							<p>Foo</p>

							{iteration.renderNext()}
						</Fragment>
					)}
				</Recursive>
			);
			const iterations = wrapper.find(Recursive);

			expect(iterations).toHaveLength(10);
		});

		test("Recursively renders the amount of times passed in maxIterations", () => {
			expect.assertions(1);

			const wrapper = mount(
				<Recursive maxIterations={2}>
					{iteration => (
						<Fragment>
							<p>Foo</p>

							{iteration.renderNext()}
						</Fragment>
					)}
				</Recursive>
			);
			const iterations = wrapper.find(Recursive);

			expect(iterations).toHaveLength(2);
		});

		describe("Iteration", () => {
			const mockProps = { foo: "bar" };
			const mockMaxIterations = 2;
			const mockFn = jest.fn(({ renderNext }) => renderNext());
			shallow(
				<Recursive {...mockProps} maxIterations={mockMaxIterations}>
					{mockFn}
				</Recursive>
			);
			const iteration = mockFn.mock.calls[0][0];

			test("Runs the function passed as child", () => {
				expect.assertions(1);

				expect(mockFn).toHaveBeenCalledTimes(mockMaxIterations);
			});

			test("Passes an iteration object to the function", () => {
				expect.assertions(1);

				expect(iteration).toBeInstanceOf(Object);
			});

			test("Iteration object has the passed props", () => {
				expect.assertions(1);

				expect(iteration.props.foo).toEqual(mockProps.foo);
			});

			test("Iteration object has the iteration number", () => {
				expect.assertions(1);

				expect(iteration.value).toEqual(0);
			});

			test("Iteration object has a 'willRecurse' boolean", () => {
				expect.assertions(1);

				expect(iteration.willRecurse).toEqual(true);
			});

			describe("renderNext", () => {
				const nextNewProps = { foo: "new_bar" };
				const nextComponent = iteration.renderNext(nextNewProps);
				const wrapper = shallow(nextComponent);

				test("Iteration object has a 'renderNext' function", () => {
					expect.assertions(1);

					expect(iteration.renderNext).toBeInstanceOf(Function);
				});

				test("Returns the next iteration of the component", () => {
					expect.assertions(1);

					expect(wrapper).toHaveLength(1);
				});

				test("Adds the passed props to the next iteration", () => {
					expect.assertions(1);

					expect(nextComponent.props.foo).toEqual(nextNewProps.foo);
				});

				test("Returns null if it won't recurse next iteration", () => {
					expect.assertions(1);

					const iterationNextNull = mockFn.mock.calls[1][0];
					const nextNullComponent = iterationNextNull.renderNext();

					expect(nextNullComponent).toBeNull();
				});
			});
		});
	});

	describe("Tree", () => {
		const mockTree = {
			name: "Foo",
			nodes: [{ name: "Bar" }, { name: "Baz", nodes: [{ name: "Qux" }] }]
		};
		const mockFn = jest.fn(({ props: { name }, hasNodes, renderNodes }) => (
			<Fragment>
				<p>{name}</p>

				{hasNodes && renderNodes()}
			</Fragment>
		));
		const wrapper = mount(
			<Recursive {...mockTree} tree keyName="name">
				{mockFn}
			</Recursive>
		);

		test("Renders correctly", () => {
			expect.assertions(1);

			expect(wrapper).toHaveLength(1);
		});

		test("Recursively renders the tree", () => {
			expect.assertions(2);

			expect(wrapper.find(Recursive)).toHaveLength(4);
			expect(mockFn).toHaveBeenCalledTimes(4);
		});

		test("'nodesName' defaults to 'nodes'", () => {
			expect.assertions(1);

			expect(wrapper.props().nodesName).toEqual("nodes");
		});

		test("Throws error when missing 'keyName' prop", () => {
			expect.assertions(1);

			try {
				shallow(<Recursive tree>{() => "Foo"}</Recursive>);
			} catch (error) {
				expect(error.message).toEqual(
					'Missing "keyName" prop in Recursive component.'
				);
			}
		});

		describe("Iteration", () => {
			const iteration = mockFn.mock.calls[0][0];

			test("Passes an iteration object to the child function", async () => {
				expect.assertions(1);

				expect(iteration).toBeInstanceOf(Object);
			});

			test("Iteration object has the current depth tree data", () => {
				expect.assertions(1);

				expect(iteration.props.name).toEqual(mockTree.name);
			});

			test("Iteration object has the current depth number", () => {
				expect.assertions(1);

				expect(iteration.depth).toEqual(0);
			});

			test("Iteration object has a 'hasNodes' boolean", () => {
				expect.assertions(1);

				expect(iteration.hasNodes).toEqual(true);
			});

			describe("renderNodes", () => {
				const nextNewProps = { name: "new_name" };
				const nextComponents = iteration.renderNodes(nextNewProps);

				test("Iteration object has a 'renderNodes' function", () => {
					expect.assertions(1);

					expect(iteration.renderNodes).toBeInstanceOf(Function);
				});

				test("Returns an array with the iterations of the next depth", () => {
					expect.assertions(1);

					expect(nextComponents).toHaveLength(2);
				});

				test("Adds the passed props to the next iterations", () => {
					expect.assertions(2);

					expect(nextComponents[0].props.name).toEqual(nextNewProps.name);
					expect(nextComponents[1].props.name).toEqual(nextNewProps.name);
				});

				test("Returns null if the iteration has no nodes", () => {
					expect.assertions(1);

					const iterationNullNodes = mockFn.mock.calls[1][0];
					const nextNullComponent = iterationNullNodes.renderNodes();

					expect(nextNullComponent).toBeNull();
				});
			});
		});
	});
});
