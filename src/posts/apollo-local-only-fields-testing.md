---
title: Testing Apollo Client with local-only fields
publishedDate: 2020-12-24T10:38
subline: Easy when you know how.
tags: apollo
---

Apollo's GraphQL Client framework provides a `MockedProvider` with which to test
components. It's pretty well documented for the most part, but I did struggle a
bit when it came to testing components that were querying local-only fields.

[Local-only fields](https://www.apollographql.com/docs/react/local-state/local-state-management/)
are a way to include fields in your GraphQL queries that do not
exist in your schema, via field policies.  These field policies
allow you to return data from anywhere you might keep
it on the client, for example `window.localStorage`.

To test such a component you need to pass the field resolvers to
`MockedProvider`, via a instance of `InMemoryCache`.

```javascript

// MyComponent.test.js

const testCache = new InMemoryCache({
  typePolicies: {
    Query: {
      // the type-policy you defined for the real client
    }
  },
  addTypename: false, // must match what is passed in MockedProvider for same
});

const mocks = [{
  request: {
    // mock query here as normal 
  }
}]

test('default render path', async () => {
  const { container } = render(
    <MockedProvider mocks={mocks} addTypename={false} cache={cache}>
      <MyComponent />
    </MockedProvider>
  );

  await expect(container.firstChild).toMatchInlineSnapshot();
});

```


And that's it, your component should perform under testing as you would expect.
Hopefully this saves someone a little bit of time. :)
