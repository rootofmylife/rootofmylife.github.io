# Module Not Microservice

## At the heart of microservices, we're told we'll find

... Lots of Good Things (TM)!

- "Scalability": "Code can be broken into smaller parts that can be developed, tested, deployed, and updated independently."
- "Focus": "... developer focuses on solving business problems and business logic."
- "Availability": "back-end data must always be available for a wide range of devices... ."
- "Simplicity": "provides simplified development of large scale enterprise level application."
- "Responsiveness": "... enables distributed applications to scale is response to changing transaction loads... ."
- "Reliability": "Ensures no single point of failure by providing replicated server groups that can continue when something breaks. Restores the running application to good condition after failures occur."

These all sound relatively familiar, I'd imagine, but the fun part about those six quotes is that two were taken from microservices literature (blog posts, papers, etc), two from twenty-years-ago EJB literature, and two from Oracle Tuxedo, which is forty-plus-years-ago technology.

## At the heart of microservices, we find

... modules.

Yup, the lowly "module", that core concept that has been at the heart of most programming languages since the 1970s. (Even earlier, though it was harder to do with older languages that didn't incorporate the module as a first-class core concept.) Call them "assemblies" on the CLR (C#, F#, Visual Basic, ...), "JARs" or "packages" on the JVM (Java, Kotlin, Clojure, Scala, Groovy, ...), or dynamically-link libraries from your favorite operating system (DLLs on Windows, `so`s or `a`s on \*nixes, and of course macOS has the "Frameworks" tucked away inside the /Library directories), but at a conceptual level, they're all modules. Each has a different internal format, but each serves the same basic purpose: an independently-built, -managed, -versioned, and -deployed unit of code that can be reused.

Consider this working definition of a module, quoted from one of Computer Science's foundational papers:

> "A well-defined segmentation of the project effort ensures system modularity. Each task forms a separate, distinct program module. At implementation time each module and its inputs and outputs are well-defined, there is no confusion in the intended interface with other system modules. At checkout time the integrity of the module is tested independently; there are few scheduling problems in synchronizing the completion of several tasks before checkout can begin. Finally, the system is maintained in modular fashion; system errors and deficiencies can be traced to specific system modules, thus limiting the scope of detailed error searching."

This comes from David Parnas' seminal paper, ["On the Criteria To Be Used in Decomposing Systems into Modules"](https://www.win.tue.nl/~wstomv/edu/2ip30/references/criteria_for_modularization.pdf), written in 1971--over 50 years ago at the time of this writing. The well-defined "separate, distinct program modules" covers about half of the suggested benefits of microservices, and we've been able to do that for fifty years.

So why the hullabaloo over microservices?

Because microservices were really never about microservices, or services, or even distributed systems.

## At the heart of microservices, we should find

... organizational clarity.

Amazon, one of the first companies to openly discuss the microservice concept, really wasn't trying to push the architectural principle as much as they were trying to push the idea of an independent development team whose blockers were few and far between. Waiting on the DBA team for schema changes? QA needs a build to test so they can find bugs? Or are we waiting on the infrastructure team to procure a server? Or the UX team to create a prototype for the presentation?

_SCHHHLLLUURRRRRRRPPPPpppp..._

That sound you hear is the development team aggregating ownership of any and all of those dependencies that could (and frequently would) block them from moving forward. It meant that the teams were a small microcosm of the average IT team's various parts (analysis, development, design, testing, data management, deployment, administration, and more). It did mean that now teams either had to be assembled from a variety of disparate skillsets, or else we had to require the complete set of skills in each team member (the so-called "Full Stack Developer"), which meant that hiring these folks became infinitely trickier. It also meant that now the team was responsible for its own production outages, meaning the team itself now has to be given on-call responsibilities (and the commensurate payroll and legal implications that go along with that). But, when all that was navigated, it meant that each team could build their artifact independently of one another, constrained by nothing other than time and the physics of how fast fingers can fly over a keyboard.

In theory, anyway.

## At the heart of microservices, we often find

... [the Fallacies of Distributed Computing](https://architecturenotes.co/fallacies-of-distributed-systems/).

For those not familiar with them, the Fallacies were first coined by Peter Deutsch in a presentation to his peers at Sun--back in the 80s. They reappeared in the 1994 seminal paper ["A Note on Distributed Computing"](https://scholar.harvard.edu/files/waldo/files/waldo-94.pdf) by Ann Wolrath and Jim Waldo, and they both essentially say the same thing:

> "Getting distributed systems right--performance, reliability, scalability, whatever "right" means--is hard." (loosely paraphrased)

When we decomposed the system into in-memory modules running on a single operating system node, the costs of passing data across process or library boundaries was pretty negligble, even fifty years ago. When passing that data across network lines, though--as most microservices do--adds five to seven orders of magnitude greater latency to the communication. That is not simply something we can "scale away" by adding more nodes to the network; that actually makes the problem worse.

Yes, some of that can be made less relevant by hosting the microservices on the same machine, usually by loading them into a cluster of virtual machines running containerized images of the independent microservice. (As in, using Docker Compose or Kubernetes to host a collection of Docker containers.) Doing so, however, adds latency between the virtual machine process boundaries (because we have to move data up and down the virtual networking stack, in accordance with the rules of the seven-layer model, even if some of those layers are being entirely emulated), and still creates the reliability issue of running on a single node.

What's worse, even as we start to wrestle with the Fallacies of Distributed Computing, we begin to run into a related, but separate, set of problems: [The Fallacies of Enterprise Computing](http://blogs.newardassociates.com/blog/2016/enterprise-computing-fallacies.html).

## At the heart of microservices, we need

... to start rethinking what we really need.

**_Do you need to decompose the problem into independent entities?_** You can do that by embracing standalone processes hosted in Docker containers, **or** you can do that by embracing standalone modules in an application server that obey a standardized API convention, **or** a variety of other options. This isn't a technical problem that requires abandoning anything that's already been built--it can be done using technologies from anywhere in the last twenty years, including servlets, ASP.NET, Ruby, Python, C++, maybe even _shudder_ Perl. **_The key is to establish that common architectural backplane with well-understood integration and communication conventions, whatever you want or need it to be._**

**_Do you need to reduce the dependencies your development team is facing?_** Then begin by looking at those dependencies and working with partners to determine which of them you can bring into the team's wheelhouse. If the organization doesn't want to officially break up the "skill-centric" ontology of its org chart (meaning you have a "database" group, a "infrastructure" group, and a "QA" group as peers to your "development" group), then work with the senior executives to at least allow for a "dotted-line" reporting structure, so there's individuals from each group that are now "matrixed" in on a single team. But, most importantly, make sure that team has a crystal-clear vision of what it is they're trying to build, and they can confidently describe the heart of their service/microservice/module to any random stranger walking by on the street. **_The key is to give the team the direction and goal, the autonomy to accomplish it, and the clarion call to get it done._**

It really boils down to these two things, which really, really, really have nothing to do with each other except tangentially.

## Appendix

With respect to the microservices hype, one company's blog post offers 10 reasons to charge into microservices:

1. **They promote big data best practices.** Microservices naturally fit within a data pipeline-oriented architecture, which aligns with the way big data should be collected, ingested, processed and delivered. Each step in a data pipeline handles one small task in the form of a microservice.
2. **They are relatively easy to build and maintain.** Their single-purpose design means they can be built and maintained by smaller teams. Each team can be cross-functional while also specialise in a subset of the microservices in a solution.
3. **They enable higher-quality code.** Modularising an overall solution into discrete components helps application development teams focus on one small part at a time. This simplifies the overall coding and testing process.
4. **They simplify cross-team co-ordination.** Unlike traditional service-oriented architectures (SOAs), which typically involve heavyweight inter-process communications protocols, microservices use event-streaming technologies to enable easier integration.
5. **They enable real-time processing.** At the core of a microservices architecture is a publish-subscribe framework, enabling data processing in real time to deliver immediate output and insights.
6. **They facilitate rapid growth.** Microservices enable code and data reuse the modular architecture, making it easier to deploy more data-driven use cases and solutions for added business value.
7. **They enable more outputs.** Data sets often are presented in different ways to different audiences; microservices simplify the way data can be extracted for various end users.
8. **Easier to assess updates in the application life cycle.** Advanced analytics environments, including those for machine learning, need ways to assess existing computational models against newly created models. A-B and multivariate testing in a microservices architecture enable users to validate their updated models.
9. **They enable scale.** Scalability is about more than the ability to handle more volume. It’s also about the effort involved. Microservices make it easier to identify scaling bottlenecks and then resolve those bottlenecks at a per-microservice level.
10. **Many popular tools are available.** A variety of technologies in the big data world, including the open-source community, work well in a microservices architecture. Apache Hadoop, Apache Spark, NoSQL databases and many streaming analytics tools can be used for microservices. We are also proud to partner with Pivotal in this area.

Let's take a second and examine each of those, but this time in light of prior art:

1. They promote big data best practices. Pipes-and-filters architectures have been a part of the software scene since the 70s, when [Unixes promoted several ideas](https://en.wikipedia.org/wiki/Unix_philosophy):
   1. Make each program do one thing well. To do a new job, build afresh rather than complicate old programs by adding new "features".
   2. Expect the output of every program to become the input to another, as yet unknown, program. Don't clutter output with extraneous information. Avoid stringently columnar or binary input formats. Don't insist on interactive input.
2. **They are relatively easy to build and maintain.** See the Unix philosophy, above.
3. **They enable higher-quality code.** If focusing on one small part at a time helps improve quality, then see the Unix philosophy, above.
4. **They simplify cross-team co-ordination.** This one is interesting; it suggests that "service-oriented architectures (SOAs) ... typically involve heavyweight inter-process communications protocols"--like JSON over HTTP? Or is that taken to mean that all SOA requires SOAP, WSDL, XML Schema and the full collection of WS-specifications? Ironically, nothing about a microservice in any way _prevents_ it from using any of those "heavyweight" protocols, and some microservices are even suggsting the use of gRPC, a binary protocol that bears closer resemblance to IIOP, from CORBA, which was the "heavyweight protocol" predecessor to... SOAP, WSDL, XML Schema, and the full collection of WS-\_ specifications.
5. **They enable real-time processing.** Real-time processing has actually been a "thing" for quite a while, and while many such systems use a pub-sub or "event bus" model to do it, it hardly requires microservices to do it.
6. **They facilitate rapid growth.** "Reuse the modular architecture"--do we even have a count of how many different things have all promoted "reuse" as a selling point? Languages certainly have done it (OOP, functional languages, procedural languages), libraries, frameworks.... One day I want to see something hyped that explicitly says "Screw reuse. We don't care about that."
7. **They enable more outputs.** "Data sets often are presented in different ways to different audiences"--that sounds a great deal like the [Crystal Reports](https://www.sap.com/products/technology-platform/crystal-reports.html) home page.
8. **Easier to assess updates in the application life cycle.** The need to "assess existing computational models against newly created models" for machine learning and advanced analytics environments... kinda sounds like a large pile of action words thrown together with little substance behind them.
9. **They enable scale.** How funny--the same was said of EJB, transactional middleware processing (a la Tuxedo), and mainframes.
10. **Many popular tools are available.** I don't think I have to really work hard to point out that tools have always been available for every major hype that's come through our industry--particularly after the hype has taken root for a while. Most readers won't even be old enough to remember [CASE tools](https://en.wikipedia.org/wiki/Computer-aided_software_engineering) but maybe they'll remember [UML](https://en.wikipedia.org/wiki/List_of_Unified_Modeling_Language_tools).

But the discerning reader will notice that there is a pretty common theme to about half of the points above--the idea of creating and maintaining small, independent "chunks" of code and data, versioned apart from one another, using common inputs and outputs to enable a larger integration of the system. It's almost as if...

// This article seems to have missed 16 years of event-based architectures, domain driven design, bound contexts, CQRS, and pretty much every reason we use microservices.

## FAQ

How do I horizontally scale my modules across multiple machines? How do I release a new version of my module without waiting for hundreds of other teams to all fix their bugs? .99^100^365 is a very small number.

- you scale the component containing your module to multiple nodes, same with microservices, same with monoliths. the only reason it might be hard is if some other module in the component is aggressively preallocating resources even when lightly used, and that is a problem to be solved by itself, orthogonal to the deployment strategy with a good branching strategy

What I want is modules that I can instantly convert to services without changing any code using the module.

Unfortunately, people keep forgetting that microservice also requires organizational change. Otherwise, it's just a heavy overhead.

Microservices is a different perspective than modules, there is a business perspective, referencing DDD; there is a data perspective; there is also an operations and maintenance perspective; there is also a technical architecture perspective

I still like microservices because I’ve yet to see a team doing a modular architecture in memory keep from creating a spaghetti mess of interdependence. Yes, the same often happens in microservices, but the extra complexity of a distributed system provides a slightly stronger nudge to decouple that means some teams at the margin do achieve something modular.

```output
I don't think microservices are the answer to everything, but I don't see how monoliths can keep up with developer velocity when an organization reaches thousands of developers.

Monoliths are way slower to deploy than microservices, and when you have hundreds or thousands of changes going out every day, this means lots of changes being bundled together in the same deployment, and as a consequence, lots of bugs. Having to stop a deployment and roll it back every time a defect is sent to production would just make the whoe thing completely undeployable.

Microservices have some additional operational overhead, but they do allow much faster deployments and rollbacks without affecting the whole org.
```

```output
I am working on a project that uses a microservice architecture to make the individual components scalable and separate the concerns. However one of the unexpected consequences is that we are now doing a lot of network calls between these microservices, and this has actually become the main speed bottleneck for our program, especially since some of these services are not even in the same data center. We are now attempting to solve this with caches and doing batch requests, but all of this created additional overhead that could have all been avoided by not using microservices.

====>>>>> Yes. If you design a distributed system you need to consider the network traffic very carefully, and choose your segmentation in such a way that you minimize traffic and still achieve good scalability.

For this reason, I've been trying to push for building a monolithic app first, then splitting into components, and introducing libs for common functionality. Only when this is all done, you think about the communication patterns and discuss how to scale the app.

Most microservice shops I've been in have instead done the naïve thing; just come up with random functionally separate things and put them in different micro services; "voting service", "login service", "user service" etc. This can come with a very very high price. Not only in terms of network traffic, but also in debuggability, having a high amount of code duplication, and getting locked into the existing architecture, cementing the design and functionality.

====>>>>> In which case, the next step for your org is a mandate that all microservices be available in all datacenters.

Let each microservice owner figure out how to achieve their latency+reliability SLA's in every location - whether replicating datastores, caching, being stateless, or proxying requests to a master location.

====>>>>> I think you need to answer why? If you can't put all of the services in one data center, then by definition you can't write a monolith either. If the monolith would happily run in one datacenter, then you should have all instances of your microservices in that one datacenter.

It surprised me that you would conclude that this is a problem with microservices. It's like if a particularly architect always punches you in the groin in every meeting, and you've concluded that architects are bad people, rather than this one architect is a bad person.
```

```output
Microservices, while often sold as solving a technical problem, usually actually solve for a human problem in scaling up an organization.

There's two technical problems that microservices purport to solve: modularization (separation of concerns, hiding implementation, document interface and all that good stuff) and scalability (being able to increase the amount of compute, memory and IO to the specific modules that need it).

The first problem, modules, can be solved at the language level. Modules can do that job, and that's the point of this blog post.

The second problem, scalability, is harder to solve at the language level in most languages outside those designed to be run in a distributed environment. But most people need it a lot less than they think. Normally the database is your bottleneck and if you keep your application server stateless, you can just run lots of them; the database can eventually be a bottleneck, but you can scale up databases _a lot_.

The real reason that microservices may make sense is because they keep people honest around module boundaries. They make it much harder to retain access to persistent in-memory state, harder to navigate object graphs to take dependencies on things they shouldn't, harder to create PRs with complex changes on either side of a module boundary without a conversation about designing for change and future proofing. Code ownership by teams is something you need as an organization scales, if only to reduce the amount of context switching that developers need to do if treated as fully fungible; owning a service is more defensible than owning a module, since the team will own release schedules and quality gating.

I'm not so positive on every microservice maintaining its own copy of state, potentially with its own separate data store. I think that usually adds more ongoing complexity in synchronization than it saves by isolating schemas. A better rule is for one service to own writes for a table, and other services can only read that table, and maybe even then not all columns or all non-owned tables. Problems with state synchronization are one of the most common failure modes in distributed applications, where queues get backed up, retries of "bad" events cause blockages and so on.

=====>>>>> Microservices, by definition, do not share a DB. If they do then you just have multiple processes in the same larger service.

=====>>>>> > There's two technical problems that microservices purport to solve

There's a third technical problem that microservices solve, and it's my favorite: isolation. With monoliths, you provide all of your secrets to the whole monolith, and a vulnerability in one module can access any secret available to any other module. Similarly, a bug that takes down one module takes down the whole process (and probably the whole app when you consider cascading failures). In most mainstream languages, every module (even the most unimportant, leaf node on the dependency tree) needs to be scoured for potential security or reliability issues because any module can bring the whole thing down.

This isn't solved at the language level in most mainstream languages. The Erlang family of languages generally address the reliability issue, but most languages punt on it altogether.

> The real reason that microservices may make sense is because they keep people honest around module boundaries.

Agreed. Microservices, like static type systems, are "rails". Most organizations have people who will take shortcuts in the name of expedience, and systems with rails disincentivize these shortcuts (importantly, they don't _preclude_ them).
```
