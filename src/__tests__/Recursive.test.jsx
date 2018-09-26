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

			test("Iteration object has a willRecurse boolean", () => {
				expect.assertions(1);

				expect(iteration.willRecurse).toEqual(true);
			});

			describe("renderNext", () => {
				const nextNewProps = { foo: "new_bar" };
				const nextComponent = iteration.renderNext(nextNewProps);
				const wrapper = shallow(nextComponent);

				test("Iteration object has a renderNext function", () => {
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
			});
		});
	});
});
