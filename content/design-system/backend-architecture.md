# Backend Architecture

The process of defining the modularity, interfaces, and data flow for a system to satisfy specified requirements.

## Key Principles

- Modularity: Each component of the system should have a specific task.
- Scalability: Systems should be designed to handle growth of traffic.
- Robustness: Systems should be able to handle errors or unexpected situations.
- Flexibility: Systems should be designed to accommodate changes or future features.

==Note: don't try invent something that makes other harder to understand==

## Key Challenges

- Complexity: Handling the intricate details and interdependencies in a system can be complex.
- Adaptability: Designing systems that can adapt to changing business needs is challenging.
- Security: Ensuring the security of data and processes within the system is a constant concern.
- Technology: Choosing the right technology stack for the system is crucial and can be difficult.
- Resources: Allocating the right resources for the system's development and maintenance can be a challenge.
- Stakeholders: Getting all stakeholders to agree on the system's design can sometimes be a difficult task.

## Three commonly used architectures

- Monolithic
- Distributed (service-oriented)
- Serverless

## Monolithic

### Definition

Monolithic architecture is a model where all the necessary code and components for a software application are combined into a single unit.

### Overview

Monolithic architecture has all functionalities tightly coupled, running in the same system.

### Pros

- **Simplicity:** Easier to develop, test, and deploy due to unified system.
- **Consistency:** Allows for uniformity in handling requests as every module uses the same set of procedures.
- **Efficiency:** Since all the functionalities are interconnected, it can be more efficient in terms of inter-process communication.

### Cons

- **Limited Scalability:** Scaling specific functions of a system is not possible. The entire system needs to be scaled.
- **Lack of Flexibility:** Changes to a single component can require the entire system to be redeployed.
- **Complexity:** The system can become too complex and hard to manage as the application grows.

### Use Cases

- **Small-scale applications:** Given its simplicity, a monolithic architecture is often suitable for small-scale applications or startups where the application's scope is clear and unlikely to drastically change or scale.
- **Applications with simple, well-defined business processes:** Monolithic architecture can be beneficial in scenarios where the business processes are simple and unlikely to require significant changes or additions.
- **Applications where high performance is critical:** Since all functionalities are interconnected, a monolithic architecture can provide faster inter-process communication compared to other architectures.

## Distributed (service-oriented)

Generic services and/or microservices architecture is a method of developing software systems that are loosely coupled and independently deployable smaller services, which run in their own processes.

This architecture allows for continuous delivery and deployment of large, complex applications. It also enhances an organization's capability to innovate and reduces the time to market for new features.

- **"Generic services"** often refers to a component of an application that provides specific functionality for the platform.
- **"Generic services"** could be part of a monolithic application where all services run within the same process, or it could be part of a distributed system where services may run in separate processes or on separate machines.

## Distributed (microservices)

- **"Microservices"** are a specific style of service-based architecture. In a microservices architecture, each service is small, independent, and loosely coupled.
- **"Microservices"** run in their own process and communicate with other "services" using protocols such as HTTP/REST or messaging queues. They can be developed, deployed, and scaled independently, which offers more flexibility than traditional service architectures.

### Microservices Pros

- **Independent Development:** Each service can be developed independently by a team that is focused on that service.
- **Independent Deployment:** Services can be deployed independently.
- **Fault Isolation:** A process failure should not bring the whole system down.
- **Mixed Technology Stack:** Different services can use different technologies.

### Microservices Cons

- **Distributed System Complexity:** Developers must deal with the additional complexity of creating a distributed system.
- **Development and Testing:** Writing and testing applications is more difficult due to it being a distributed system.
- **Data Management:** Managing data consistency can be challenging.

### Microservices Use Cases

- **E-commerce platforms:** They often need to handle high volumes of transactions and user interactions, which can be efficiently managed through independent microservices.
- **Social media platforms:** The various functionalities like posting, messaging, and notifications can be divided into separate microservices.
- **Streaming services:** Microservices can help handle the heavy load and deliver smooth streaming experience.
- **Online gaming platforms:** They can use microservices to manage game logic, player data, and real-time multiplayer interactions separately.
- **Large-scale IoT systems:** Each device or sensor type can be managed by a dedicated microservice.

## Serverless

Serverless architecture refers to applications that significantly depend on third-party services (backend-as-a-service or "BaaS" - Firebase; Supabase) or on custom code that's run in ephemeral containers (function as a service or "FaaS").

Serverless architectures, the app logic is still run on servers, but all the server management is done by the cloud provider (AWS, Azure, GCP, etc). You just need to run your code, and the cloud provider takes care of the rest.

### Serverless Pros

- No server management is required.
- Costs based on usage, not on pre-purchased capacity.
- Automated scaling.
  (FEM runs on AWS s3, and it's super fast)

### Serverless Cons

- The architecture can be more expensive for long-term applications.
- Testing can be difficult due to the environment's reliance on the Internet.
- Troubleshooting and debugging is also more complex.

### Serverless Use Cases

- **Real-time file processing:** As soon as a file is uploaded in S3, AWS Lambda can trigger a function to process it.
- **Real-time stream processing:** Perform real-time analytics on data streams using Kinesis.
- **Extract, transform, load (ETL):** Perform ETL on demand. For example, when a new file is uploaded to S3, AWS Lambda can trigger to process the data and load it into a database.
- **Websites:** Websites that are purely static (HTML, CSS, JavaScript) can be served from S3 directly.
