# - API LINK -> https://inventory-rest-api.vercel.app

# **API DOCUMENTATION**

This API is for **Inventory Management System** , where you can do CRUD operation on products.

Admin panel = super-admin, admin, officer

Base url for product: {{domainName}}/api/v1/products

| **URL**                                              | **REQUEST METHOD** | **PERMISSION** | **RETURN**                        |
| ---------------------------------------------------- | ------------------ | -------------- | --------------------------------- |
| /                                                    | get                | Everyone       | All products                      |
| /:id                                                 | get                | Everyone       | Specific product                  |
| /:id                                                 | patch              | Admin panel    | Update specific product           |
| /:id                                                 | delete             | Admin panel    | Delete specific product           |
| /category                                            | get                | Everyone       | List of categories                |
| /category/:category                                  | get                | Everyone       | All products of specific category |
| /brand/:brand                                        | get                | Everyone       | All products of specific brand    |
| /search?item={{name}}                                | get                | Everyone       | Search based on a keyword         |
| ?{{fieldName}}={{value}}&{{fieldName}}[gt]={{value}} | get                | Everyone       | Filtering                         |
| ?sort=-{{fieldName}},{{fieldName}}                   | get                | Everyone       | Sorting                           |
| ?fields=-{{fieldName}},-{{fieldName}}                | get                | Everyone       | Limiting fields                   |
| ?page={{value}}&limit={{value}}                      | get                | Everyone       | Pagination                        |
| /top-10-deals                                        | get                | Everyone       | Aliasing                          |
| /create                                              | post               | Admin panel    | Create a product                  |

<br/>

For user, base url is **:** {{domainName}}/api/v1/users/

| **URL**                   | **REQUEST METHOD** | **PERMISSION**     | **RETURN**                         |
| ------------------------- | ------------------ | ------------------ | ---------------------------------- |
| /login                    | post               |
| Login into account        |
| /create-account           | post               | super-admin        | Create new account                 |
| /change-active-status/:id | patch              | super-admin, admin | Change active status of an account |
| /delete/:id               | delete             | super-admin        | Delete an account                  |
