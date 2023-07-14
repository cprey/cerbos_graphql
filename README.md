# Cerbos GraphQL Demo

This [Cerbos Apollo GraphQL demo](https://github.com/cerbos/demo-graphql) has been pulled into this repo so you can run via DevSpace. Their tutorial made you click and edit and gosh what a headache ☠️

## Deployment

Deploy is about as simple as it gets.

- grab the PAT token from 1Password (search for cerbos)
- create a Kubernetes secret in your cluster (hopefully it's Loft 😉)
- run `devspace dev`

```console
kubectl create secret generic cerbos-github-token --from-literal=GITHUB_TOKEN=thisisnttherealPATtokenwhichisfoundin1password
```

```console
devspace dev
```

This will use Node18 to install Apollo GraphQL server and the official Cerbos helm chart. The Cerbos policy configurtion is pulled from this very GitHub repo using [this mechanism](https://docs.cerbos.dev/cerbos/latest/installation/helm.html#_deploy_cerbos_configured_to_read_policies_from_a_github_repository) so you can PR this repo if you want to make policy changes/additions.

## Usage

Launch GraphQL Playground [localhhost:8000](http://localhost:8000) in your local browser.

Edit the HTTP headers by adding the JSON as pictured below.

![img1](./playground.png)


```json
{
 "token": "key:joe:finance" 
}
```

and the GraphQL Query

```json
{
  expense(id: "expense2") {
    id
    amount
    status
    vendor {
      name
    }
    createdBy {
      name
    }
    approvedBy {
      name
    }
  }
}
```

> CLICK THE DAMN BUTTON ALREADY!

## Sample Queries

To run these you need to set an HTTP header called `token` which identifies the user (and thus there permissions)

Some example tokens:

- `key:sajit:it` is an IT Admin
- `key:joe:finance` is an EMEA Finance person
- `key:sally:sales` is an EMEA Sales person
- `key:zeena:sales` is an North America sales person
- `key:john:manager-emea` is an EMEA Manager in sales
- `key:brock:manager-na` is an North America Manager in sales

```
{
  "x-auth-token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjg5MzQ5MDU4LCJleHAiOjE2ODk5NTM4NTgsImlzcyI6IkdvRnVuZE1lIiwibGF0IjoxNjg5MTE3NDUxfQ.mFFSQ-DeBeN7mSYRqVrIaNRqES1yPTvL_354u_pST0ATgMkBXny5NayQw67BJhXpxl_rp2GT6M6kww6sMZvYzg"
}
```

### Get an Expense

```console
{
  expense(id: "expense2") {
    id
    amount
    status
    vendor {
      name
    }
    createdBy {
      name
    }
    approvedBy {
      name
    }
  }
}
```
```
{
  user(id: 1) {
    id
    firstName
    lastName
  }
}
```

### Approve an Expense

```console
mutation {
  approveExpense(id: "expense1")
}
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