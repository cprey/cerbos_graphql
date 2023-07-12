# Cerbos GraphQL Demo

This Apollo GraphQL demo from Cerbos that has been pulled into its own repo an run via DevSpace.

## Deployment and Usage

Deploy is about as simple as it gets.

```bash
devspace dev
```





## Details

This project showcases using Cerbos inside of a GraphQL server. The server is written in typescript and makes used of [type-graphql](https://typegraphql.com/) to create the schema and resolvers and [TypeDI](https://github.com/typestack/typedi) to handle dependency injection.

The Cerbos client is setup as a [global service](/src/services/Cerbos.service.ts) which is then used in the GraphQL server.

To enable batching of requests, the authorization calls are performed via a [dataloader](https://github.com/graphql/dataloader) instance which is configured per-request in the [GraphQL server context](/src/server/create-context.ts) and automatically adds in the principal information from the request.

```ts
new DataLoader(
  async (resources: ResourceCheck[]) => {
    const results = await cerbosService.cerbos.checkResources({
      principal: {
        id: user.id,
        roles: [user.role.toString()],
        attributes: JSON.parse(JSON.stringify(user)),
      },
      resources,
    });
    return resources.map(
      (key) =>
        results.findResult({ kind: key.resource.kind, id: key.resource.id })
    );
  }
)
```

Inside the GraphQL resolvers, calls to Cerbos can be done via using the context:

```ts
const authorized = await context.loaders.authorize.load({
  actions: ["view:approver"],
  resource: {
    id: expense.id,
    kind: "expense:object",
    attributes: {
      id: expense.id,
      region: expense.region,
      status: expense.status,
      ownerId: expense.createdBy.id,
    },
  },
});
```