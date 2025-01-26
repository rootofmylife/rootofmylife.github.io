# Testing Introduction

## Difference between system testing types and user acceptance testing

### Unit test

An isolated test that tests one thing. Typically, this is a set of tests that might pass particular arguments to a function and then make sure that the value that is return is what we were expecting.

Unit testing involves breaking down codes into small parts that can be easily tested. These small parts are called units. Units range from a simple function to complex algorithms (sometimes components in Vue). One example is testing a simple `multiplication` function in your code. It is crucial that the test result returns the expected output, which in our case is the multiplication of the numbers we inputted. This is usually the first test done on an application.

### Component test

Test the single component in the page instead of rendering whole site.

### Integration test

These are tests that test one or more units working together. Sure, any test that exercises two or more units is technically an integration test. But, for our purposes, we're going to say that browser tests (e.g. [Cypress](https://www.cypress.io), [Playwright](https://playwright.dev), [Selenium](https://www.selenium.dev), [WebdriverIO](https://webdriver.io)) are integration tests.

The purpose of integration testing is to ensure components (parent components) that integrate other components (child components) work correctly. Integration testing is used to check data flow among components to ensure all components in the application collaborate as required. This test is usually carried out after unit testing is completed.

### End-to-end (E2E) test

E2E testing is a type of application test where you do not have to break down the application into units. Instead, you test the application as a whole. This is to ensure you maintain data integrity between various components of the system, and that the flow of an application behaves as required from start to finish. This test is mainly done after integration testing.

These test the _whole system_. In a perfect world, these are testing everything from the authentication flow to the APIs to the UI. Obviously, these are super valuable, but getting this infrastructure in place can be difficult to the point of seemingly impossible without a large investment of effort.

### Acceptance test

Acceptance testing ensures the app meets the client’s requirements. In this test, just las with End-to-End(E2E) testing, the whole application is tested. However, unlike the E2E test method, this test is only to certify the system with respect to the client’s requirements. It does not focus on cosmetic errors, spelling mistakes, or system testing. This test is usually the last test carried out on an application.

## Which test is important?

The moral of the story here is that all of your tests live on a spectrum: unit tests are easy to write and running hundreds or even thousands is pretty quick. A passing integration or end-to-end test provides a lot more confidence, but they're also a lot harder to write and take longer to run.

The trick here is finding the right balance. It's all about confidence. We're not looking to test for testing's sake. What we _want_ is to be able to change or refactor our code with confidence that we're not accidentally breaking something important. Whatever kinds of tests get you there the fastest are the ones that you should write.

Sure, integration tests are slower and somewhat harder to write, but sometimes a single integration test can provide a level of confidence that rivals 60 unit tests.

## Types of User Acceptance Testing

- Operational testing: Operational testing is a type of acceptance test carried out by developers to ascertain the functions of the application. This type of testing is also called production acceptance testing. It s used to make sure the application is ready to be shipped to users.

- Compliance testing: Compliance testing is mostly run on applications to see if they are in line with regulatory laws. The purpose of this type of test is to make sure that the application obeys governing laws.

- Contract testing: Contract testing is between the product owner and the development team. This type of testing is geared toward ensuring all specifications listed in the contract are incorporated into the application. The test checks for functionalities listed in the contract and observes how the application is able to accomplish its specifications.

- Alpha & beta testing:
  - Alpha testing is simply testing performed on applications in the development environment, mostly among staff. The overall functionality of the application is tested in alpha testing. Testers send their feedback even before deploying the application.
  - Beta testing is when customers test the application in a production environment. The purpose of this test is to ensure lots of customers can use the product at the same time while testing performance and scalability in real-world settings.

## Testing Libraries

- Unit testing.
- Component testing (e.g. [Enzyme](https://enzymejs.github.io/enzyme/), [Testing Library](https://testing-library.com)).
- Integration testing (e.g. [Cypress](https://www.cypress.io), [Playwright](https://playwright.dev)).
- Static type-checking (e.g. [Flow](https://flow.org), [TypeScript](https://www.typescriptlang.org)).
- Static analysis (e.g. [ESlint](https://eslint.org), [Prettier](https://prettier.io)).
- Audits: Performance, accessibility, etc. (e.g. [aXe](https://www.deque.com/axe), [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/))
