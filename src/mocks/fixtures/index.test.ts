import {
  createContentGroupFixture,
  createContentFeedFixture,
  createContentItemFixture,
  createNextItemFixture,
} from ".";

describe("createContentGroupFixture", () => {
  it("should work without anything passed in", () => {
    expect(createContentGroupFixture()).toMatchSnapshot();
  });

  it("should work with something passed in as an override", () => {
    expect(
      createContentGroupFixture({ title: "Test Override" })
    ).toMatchSnapshot();
  });
});

describe("createContentFeedFixture", () => {
  it("should work without anything passed in", () => {
    expect(createContentFeedFixture()).toMatchSnapshot();
  });

  it("should work with something passed in as an override", () => {
    expect(
      createContentFeedFixture({ title: "Test Override" })
    ).toMatchSnapshot();
  });
});

describe("createContentItemFixture", () => {
  it("should work without anything passed in", () => {
    expect(createContentItemFixture()).toMatchSnapshot();
  });

  it("should work with something passed in as an override", () => {
    expect(
      createContentItemFixture({ title: "Test Override" })
    ).toMatchSnapshot();
  });
});

describe("createNextItemFixture", () => {
  it("should work without anything passed in", () => {
    expect(createNextItemFixture()).toMatchSnapshot();
  });

  it("should work with something passed in as an override", () => {
    expect(createNextItemFixture({ title: "Test Override" })).toMatchSnapshot();
  });
});
