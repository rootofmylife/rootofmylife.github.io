# Data Exchange: REST vs. GraphQL vs. gRPC

## REST

- HTTP paths describing data, e.g. /users as a collection of users
- Easily discoverable data, e.g. user ID 3 would be at /users/3. All of the CRUD (Create Read Update Delete) operations below can be applied to this path
- CRUD operations in HTTP are POST/PUT for create, GET for read, POST/PUT for update, and DELETE for deletion
- POST with an ID in the path means update existing entity, POST with no ID means create
- PUT with an ID means create an entity and overwrite the one that’s there if it already exists
  Pros
- Easy to learn
- Widely used & most engineers are familiar with it
- Uses common HTTP verbs which are well described in RFC 2616
- Easy to intercept for debugging with Chrome Developer Tools or Wireshark and easily read payload without additional special tooling
  Cons
- Inefficient. APIs must be rewritten for each use case to prevent over or under fetching
- JSON is typically used. Objects are large and field names are repetitive

## GraphQL

- Uses POST for all operations, with a single HTTP path, e.g. /graphql
- 2 types of operations are Queries and Mutations, which are specified in the JSON request body
- Queries are used for reading data
- Mutations are used for creating, updating, and deleting data
- Queries passed from client to server declare the fields requested for the HTTP request
- Resolvers are implemented on the server return values for a specific field
- Data structures are pre\*defined in a GraphQL schema
  Pros
- Solves the under and over fetching problem that plagues REST and gRPC
- Only sends the fields in the response that the caller requested in the query
  Cons
- Errors can be contained in the response body with a status of 200, leading to more complex client logic to parse them if if the library doesn’t
- Uses JSON objects by default which are large and field names are repetitive

## gRPC

- Opinionated to promote the microservice architecture
- Generally generated from Protobuf objects
- Declare a service in Protobuf and implement it in server code
- Client libraries are generated from the Protobuf code for each language
  Pros
- Polyglot: Generates code to call services for most popular programming language
- Uses Protobuf by default for transport for efficiency
- Automatically solves retries, network issues, etc.
- Generates client and server code in your programming language. This can save engineering time from writing service calling code
  Cons
- Protobufs are harder to intercept over the wire and parse into a human readable format
- APIs must be rewritten for each use case to prevent over or under fetching

## SOAP

- Simple Object Access Protocol (SOAP) is a protocol for exchanging information encoded in Extensible Markup Language (XML) between a client and a procedure or service that resides on the Internet.
- SOAP can be used by a variety of transport protocols in addition to HTTP, for example, FTP and SMTP.
- SOAP uses a standard XML schema (XSL) to encode XML.

## References

```output
- https://www.danhacks.com/software/grpc-rest-graphql.html
- https://www.redhat.com/architect/apis-soap-rest-graphql-grpc
```
