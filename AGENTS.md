Before applying any changes, please run `bun get-types` to generate the latest types. 
If you need types, try to find the type in the `src/types/gen/endpoints` and `src/types/gen/schemas` directory.

Before committing ant changes, please run `bun lint` to format the code.

This project uses routes and services architecture. No controller or repository layers are used. 

All reading operations require Role.User permission.

All writing operations require Role.Admin permission.
