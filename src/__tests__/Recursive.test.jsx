import React from "react";
import { shallow } from "enzyme";
import Recursive from "../Recursive";

describe("Recursive component", () => {
	test("Renders without crashing", () => {
		expect.assertions(1);

		const wrapper = shallow(<Recursive />);

		expect(wrapper).toHaveLength(1);
	});
});
