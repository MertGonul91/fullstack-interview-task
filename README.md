## Deliverables

- New routes
  -  `/investments` get all investments
  - `/investments/export` export all investments as CSV Text
  - `/investments/:id/export` export a specific investment as CSV Text

- How to run any additional scripts or tests you may have added
  - ```bash
    npm run test
    ```

1. How might you make this service more secure?
   - Using middlewares like [Helmet](https://helmetjs.github.io/) for express application would make this more secure by setting various HTTP headers. Other than that it would be really helpful to create a custom isAdmin middleware for this specific admin microservice which could check cookies and verify a JWT.
2. How would you make this solution scale to millions of records?
   - Integrating it with a SQL or a NoSQL database depending on the future features to make it more easily scalable.
3. What else would you have liked to improve given more time?
   - Integrate it with a DB and and add CRUD operations.

# Notes

- Normally i would work in a different branch and then create a Pull Request to merge it. This time i directly pushed it to the main which not very ideal when working with a team.

- I spent 2:30 hours on the task

# Moneyhub Tech Test - Investments and Holdings

At Moneyhub we use microservices to partition and separate the concerns of the codebase. In this exercise we have given you an example `admin` service and some accompanying services to work with. In this case the admin service backs a front end admin tool allowing non-technical staff to interact with data.

A request for a new admin feature has been received

## Requirements

- An admin is able to generate a csv formatted report showing the values of all user holdings
  - The report should be sent to the `/export` route of the investments service
  - The investments service expects the report to be sent as csv text
  - The csv should contain a row for each holding matching the following headers
    |User|First Name|Last Name|Date|Holding|Value|
  - The holding should be the name of the holding account given by the financial-companies service
  - The holding value can be calculated by `investmentTotal * investmentPercentage`
- Ensure use of up to date packages and libraries (the service is known to use deprecated packages)
- Make effective use of git

We prefer:

- Functional code
- Ramda.js (this is not a requirement but feel free to investigate)
- Unit testing

### Notes

All of you work should take place inside the `admin` microservice

For the purposes of this task we would assume there are sufficient security middleware, permissions access and PII safe protocols, you do not need to add additional security measures as part of this exercise.

You are free to use any packages that would help with this task

We're interested in how you break down the work and build your solution in a clean, reusable and testable manner rather than seeing a perfect example, try to only spend around _1-2 hours_ working on it

## Getting Started

Please clone this service and push it to your own github (or other) public repository

To develop against all the services each one will need to be started in each service run

```bash
npm start
or
npm run develop
```

The develop command will run nodemon allowing you to make changes without restarting

The services will try to use ports 8081, 8082 and 8083

Use Postman or any API tool of you choice to trigger your endpoints (this is how we will test your new route).

### Existing routes

We have provided a series of routes

Investments - localhost:8081

- `/investments` get all investments
- `/investments/:id` get an investment record by id
- `/investments/export` expects a csv formatted text input as the body

Financial Companies - localhost:8082

- `/companies` get all companies details
- `/companies/:id` get company by id

Admin - localhost:8083

- `/investments/:id` get an investment record by id
