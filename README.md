## Note!

Apparently Hasura has a new actions feature where you can expose custom mutations, and Hasura will query your microservices for it. However, this demo was built before the feature was introduced. Clearly it is advantageous to expose your auth through GraphQL as well. Before the feature we would have to query 2 endpoints, now we can query the Hasura endpoint and it can manage everything. But once again, this repo was built before the new actions feature!

# Authentication Micro-service

To run:

`yarn migrate`

`yarn dev`
