# Domain-Driven Design — Research Reference

> Source: 32 research items, 20 fields each. Uncertain fields omitted. Generated from research/ddd-sources/results/.

## Table of Contents


### Strategic Design

1. [Domain](#domain) — Strategic Design
2. [Subdomain Types](#subdomain-types) — Strategic Design
3. [Bounded Context](#bounded-context) — Strategic Design
4. [Context Mapping Patterns](#context-mapping-patterns) — Strategic Design
5. [Ubiquitous Language](#ubiquitous-language) — Strategic Design
6. [When to Use DDD](#when-to-use-ddd) — Strategic Design
7. [Strategic Distillation Tools](#strategic-distillation-tools) — Strategic Design
8. [DDD Starter Modelling Process](#ddd-starter-modelling-process) — Strategic Design
9. [Wardley Mapping and Core Domain Positioning](#wardley-mapping-and-core-domain-positioning) — Strategic Design
10. [Conway's Law and Team Topologies Alignment](#conways-law-and-team-topologies-alignment) — Strategic Design

### Tactical Design

11. [Entity](#entity) — Tactical Design
12. [Value Object](#value-object) — Tactical Design
13. [Aggregate](#aggregate) — Tactical Design
14. [Repository](#repository) — Tactical Design
15. [Domain Service](#domain-service) — Tactical Design
16. [Application Service](#application-service) — Tactical Design
17. [Domain Event](#domain-event) — Tactical Design
18. [Factory](#factory) — Tactical Design
19. [Specification Pattern](#specification-pattern) — Tactical Design
20. [Integration Event](#integration-event) — Tactical Design
21. [Saga and Process Manager](#saga-and-process-manager) — Tactical Design

### Architecture

22. [Architecture Patterns](#architecture-patterns) — Architecture
23. [CQRS](#cqrs) — Architecture
24. [Event Sourcing](#event-sourcing) — Architecture
25. [Supple Design](#supple-design) — Architecture
26. [Model Exploration Whirlpool](#model-exploration-whirlpool) — Architecture

### Collaborative Tools

27. [Domain Storytelling](#domain-storytelling) — Collaborative Tools
28. [Bounded Context Canvas and DDD Crew Tools](#bounded-context-canvas-and-ddd-crew-tools) — Collaborative Tools

### Misconceptions

29. [Common Misconceptions](#common-misconceptions) — Misconceptions
30. [Domain Event vs Integration Event Distinction](#domain-event-vs-integration-event-distinction) — Misconceptions

### Ecosystem

31. [Data Mesh](#data-mesh) — Ecosystem
32. [Wardley Mapping Legacy Modernization](#wardley-mapping-legacy-modernization) — Ecosystem

---


## Strategic Design


### Domain


**Definition**

A domain is a sphere of knowledge, influence, or activity. In Domain-Driven Design, the domain refers to the subject area to which the user applies a program. A domain model is a system of abstractions that describes selected aspects of a domain and can be used to solve problems related to that domain. DDD distinguishes the problem space (the real-world domain with its subdomains and complexity) from the solution space (bounded contexts, models, and code created to address problems within that domain). The problem space is represented by terms such as Domain, Problem Domain, and Core Domain — they stand for the actual business problem the software is going to solve. The solution space is represented by bounded contexts: the code and artifacts created to address those problems.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Chapter 1 defines domain as 'a sphere of knowledge, influence, or activity.' The DDD Reference (Evans, 2015) repeats this definition verbatim: 'A sphere of knowledge, influence, or activity. The subject area to which the user applies a program is the domain of the software.'

**Secondary Citations**

Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013. Chapter 2 explains how a domain divides into bounded contexts. Khononov, Vladik. Learning Domain-Driven Design. O'Reilly, 2021. Clarifies problem space vs. solution space: subdomains are the problem, bounded contexts are the solution. Millett, Scott and Tune, Nick. Patterns, Principles and Practices of Domain-Driven Design. Wrox, 2015. Covers core, supporting, and generic subdomain classification.

**E-commerce Example**

An online shop's full domain encompasses everything the business does: catalog management, customer accounts, shopping cart, order processing, payment, inventory, and shipping. Within this domain, subdomains emerge naturally: the Catalog subdomain (product search and browsing) may be a supporting subdomain, Order and Checkout are core subdomains delivering competitive value, Payment is typically a generic subdomain (solved by Stripe or similar), Inventory and Shipping may be core or supporting depending on business strategy. The domain boundary is the entire e-commerce business; bounded contexts (solution space) are then defined within each subdomain to encapsulate its model and language.

**Common Mistake**

Treating 'domain' and 'bounded context' as synonyms. Practitioners new to DDD often use 'domain' to mean a single microservice or a single bounded context. In reality, a domain is the entire problem space (e.g., the whole e-commerce business), while a bounded context is a solution-space artifact — a specific model within code that solves one part of that problem. Conflating the two leads to incorrect context map design and missed opportunities to identify core vs. generic subdomains.

**Anti-Pattern**

Big Ball of Mud (Foote and Yoder, 1997): when domain boundaries are never clearly defined, all code becomes entangled in a single haphazardly structured system. Evans acknowledges Big Ball of Mud as the most resilient (and most common) architectural pattern in practice — it emerges when no one takes stewardship of the domain model and team boundaries are ignored. A secondary anti-pattern is the Monolithic Domain Model: treating the entire domain as a single model rather than separating it into bounded contexts, causing a single ubiquitous language to collapse under the weight of multiple conflicting meanings.

**Event Storming / EDA Connection**

In Big Picture Event Storming, the entire domain is explored on a single long paper roll. Domain Events (orange stickies) surface what happens across the whole problem space, and the facilitation of this workshop is the primary mechanism for discovering subdomain boundaries within the domain. Hotspot stickies (red/pink) mark pain points and ambiguities that often signal subdomain or bounded context seams. The outcome of a Big Picture session is a shared understanding of the domain's event flow, which then guides which subdomains to zoom into with Design-Level Event Storming. In EDA, the domain is the boundary within which domain events carry semantic meaning — events crossing domain boundaries require explicit translation (anti-corruption layers or published language contracts).

**Contested Interpretations**

Evans (2003) defines domain purely as a problem-space concept — it is the sphere of knowledge, not a code artifact. Vernon (2013, Implementing DDD) is largely consistent but places heavier emphasis on subdomain classification (core, supporting, generic) as a strategic design tool, sometimes blurring domain with subdomain in casual usage. Khononov (2021, Learning DDD) makes the problem-space/solution-space distinction the central organizing principle of his book, arguing it was underemphasized in Evans' original text. There is ongoing community debate about whether 'domain' should refer only to the top-level business area or can recursively apply to subdomains — Evans uses both usages in the Blue Book without a hard rule.

**Thai Audience Note**

Thai architects from traditional 3-tier/SOA backgrounds often map 'domain' directly to a database schema or a service tier (e.g., 'the product domain = the product database'). This conflates the problem space with a technical artifact. A more dangerous confusion is mapping domains to org-chart departments: in Thai enterprise hierarchies, IT departments are often siloed by technology (DBA team, middleware team, UI team) rather than by business capability, making subdomain identification counter-cultural. The concept that a 'domain' has no code representation — only subdomains and bounded contexts do — requires deliberate unlearning.

**Related Concepts**

Subdomain, Bounded Context, Ubiquitous Language, Context Map, Core Domain, Supporting Subdomain, Generic Subdomain, Strategic Design

**Recent Developments (2020–2025)**

By 2024-2025, the DDD community has increasingly framed domain analysis as a sociotechnical design activity, not merely a software modeling concern. Combining DDD with Team Topologies and Wardley Mapping — as described in multiple InfoQ articles (2022-2025) — treats domain boundaries as team boundary inputs, not just codebase boundaries. At Explore DDD 2024, Eric Evans argued for incorporating large language models into domain modeling workflows. The DDD Starter Modelling Process (ddd-crew, updated 2022-2024) provides an open process guide that treats domain understanding as the first explicit step before any technical modeling.

**Implementation Pattern**

The domain concept itself does not map to a single implementation pattern — it is a problem-space concept. However, identifying the domain and its subdomains drives implementation choices: Core subdomains (highest business value, most complex) justify CQRS and Event Sourcing to achieve auditability and scalability. Supporting subdomains can use simpler CRUD patterns. Generic subdomains are candidates for off-the-shelf solutions rather than custom builds. The Strangler Fig pattern is used when extracting a subdomain from a monolith — the domain analysis identifies which subdomain to extract first based on strategic value and coupling.

**Workshop Activity**

Big Picture Event Storming (Brandolini): the primary activity for exploring and discovering the domain and its subdomain boundaries. Domain Storytelling is used to elicit domain knowledge from domain experts through narrative. The Bounded Context Canvas (DDD Crew) is used once subdomains are identified to define solution-space contexts. The DDD Starter Modelling Process (DDD Crew, 2022) guides teams from domain understanding through strategic design to tactical implementation.

**Decomposition Signal**

Linguistic signals: domain experts use different terms for the same concept in different areas — this indicates subdomain and context boundaries. Organizational signals: teams that rarely communicate own different subdomains. Data-coupling signals: tables that are accessed across many use cases with different meanings (e.g., 'product' means different things in catalog vs. shipping vs. invoicing) indicate implicit subdomain splits. Rate-of-change signals: parts of the system that change at dramatically different rates (e.g., pricing rules change weekly, fulfillment logic changes monthly) often belong to separate subdomains. These signals surface during Big Picture Event Storming when hotspots cluster around the same entities.

**Evolution &amp; Refactoring**

The domain itself rarely changes (an e-commerce business remains an e-commerce business), but the team's understanding of subdomain boundaries evolves continuously. Initial domain maps are almost always wrong — Evans explicitly says the model must be refined through iteration. Canonical refactoring moves include: (1) Promoting a Supporting Subdomain to Core as the business evolves; (2) Extracting a Subdomain from a monolith using the Strangler Fig pattern; (3) Segregated Core — isolating the core subdomain within an existing codebase before full extraction; (4) Merging two bounded contexts when they are found to share the same ubiquitous language. The DDD Starter Modelling Process emphasizes domain re-exploration as a recurring activity, not a one-time upfront exercise.

**Conway's Law Implication**

Conway's Law states that system design mirrors the communication structure of the organization that built it. For the domain concept, this means: if the domain is not divided into clear subdomains before team structures are defined, team boundaries will be arbitrary and the resulting bounded contexts will reflect org-chart silos rather than business capabilities. The Reverse Conway Maneuver — deliberately designing team structures around desired domain boundaries — is a recognized pattern. For Thai enterprise architects, this is particularly relevant: IT departments organized by technology (DB team, middleware, UI) will produce architectures with no domain alignment, forcing all domain logic into integration layers.

**Data Mesh / Analytics Note**

In data mesh architecture, domain-oriented data ownership is the first principle — each domain team owns its analytical data products. The DDD domain concept directly maps to this: the problem-space domain boundary becomes the ownership boundary for data products. For Thai enterprises with strong BI/data warehouse culture, domain analysis determines which team owns which fact tables and dimensions in a data mesh. A common collision: a Core Domain's operational data may have very different shape and latency requirements than the analytical projection of the same data needed by BI pipelines — the domain boundary helps clarify which team holds source-of-truth and who publishes derived data products.

**Testing Approach**

Because 'domain' is a problem-space concept rather than a code artifact, there is no direct test target for the domain itself. Testing is applied to bounded contexts and aggregates within subdomains. Domain-level verification occurs through Big Picture Event Storming sessions (collaborative validation with domain experts, not automated tests). At the code level: domain models within bounded contexts are tested with unit tests against aggregate invariants; bounded context integration is tested with contract tests (e.g., consumer-driven contracts via Pact) to verify that published domain events conform to their schema across context boundaries.

**Tooling &amp; DSL**

Context Mapper DSL (open source): allows declaration of domain, subdomains, bounded contexts, and context maps in a structured DSL with diagram generation. Miro / Mural: used for remote Big Picture Event Storming to explore the domain. EventStorming.com provides the canonical process description. The DDD Crew's Bounded Context Canvas (available as Miro/GitHub template) structures domain exploration output into solution-space context definitions. Domain Storytelling tool (Egon.io) is purpose-built for capturing domain knowledge as story diagrams.

**Legacy Modernization Relevance**

Domain analysis is the essential first step in any brownfield modernization. Before applying Strangler Fig or any extraction pattern, teams must identify what the legacy system's domains and subdomains actually are — often they are implicit and entangled. The Architecture Modernization with Domain-Driven Discovery approach (InfoQ, 2022) uses Event Storming to make the implicit domain structure explicit, then applies subdomain classification (core/supporting/generic) to prioritize extraction order: extract Core Subdomains first for maximum value, use ACL (Anti-Corruption Layer) to shield new bounded contexts from the legacy model's language. For Thai enterprises with mainframe or ERP-centric monoliths, domain discovery often reveals that the ERP covers multiple distinct subdomains that need separate teams and models.

### Subdomain Types


**Definition**

Subdomains in Domain-Driven Design are distinct areas of the problem space that collectively form the overall business domain. They are classified into three types: (1) Core Subdomain — the area where the organization gains competitive advantage; it embodies complex, frequently-changing business logic that cannot be purchased off-the-shelf. (2) Supporting Subdomain — necessary for the core domain to function but provides no competitive differentiation; usually simpler in logic and must be built in-house because no off-the-shelf product fits. (3) Generic Subdomain — a solved problem shared across many businesses (e.g., authentication, email notifications); can and should be purchased or adopted rather than built from scratch.

**Primary Citation**

Vernon, V. (2016). Domain-Driven Design Distilled, ch. 2 'Strategic Design with Subdomains'. Also Vernon, V. (2013). Implementing Domain-Driven Design, Part I. Evans, E. (2003). Domain-Driven Design: Tackling Complexity in the Heart of Software, ch. 15 'Distillation' — introduces Core Domain; Supporting and Generic distinctions elaborated by Vernon.

**Secondary Citations**

Khononov, V. (2021). Learning Domain-Driven Design, ch. 1 — refines the three-type taxonomy by adding complexity and volatility dimensions; distinguishes Generic (buy), Supporting (simple logic, build), Core (complex, build with best engineers). Vladikk.com blog post 'Revisiting the Basics of DDD' (2018) provides accessible summary of all three types.

**E-commerce Example**

In an online shop, the Core Subdomain is typically the Catalog (personalized product recommendations, dynamic pricing engine) or Order Orchestration (the proprietary fulfillment algorithm that differentiates the shop). Payment processing is a Generic Subdomain — handled by Stripe, Adyen, or a payment gateway (a solved, off-the-shelf problem). Shipping carrier integration (FedEx/UPS API wrapper) is also Generic. The Inventory management subdomain is often Supporting: it must be custom because of the shop's unique warehouse rules, but the business does not compete on how it manages stock. Cart and Checkout may be Supporting as well — necessary scaffolding that enables Core order logic but not differentiating on its own.

**Common Mistake**

Teams label everything as a Core Subdomain to justify heavy DDD investment (rich domain models, event sourcing, CQRS) across the entire system. This inflates cost and complexity where simple CRUD or an off-the-shelf product would suffice. Conversely, a team may misclassify a genuine Core Subdomain as Generic and outsource it, surrendering competitive advantage.

**Anti-Pattern**

Over-engineering the Periphery: applying full Domain Model pattern, Event Sourcing, and CQRS uniformly to Supporting and Generic subdomains that need only Transaction Script or Active Record. The literature (Khononov 2021, Vladikk.com) names this 'CQRS everywhere' — using complex patterns where subdomain complexity does not warrant it, generating accidental complexity. A related anti-pattern is the Commoditized Core: treating a genuinely differentiating subdomain as Generic and replacing it with an off-the-shelf product, eroding competitive advantage.

**Event Storming / EDA Connection**

In Big Picture Event Storming, domain events cluster naturally into subdomains: high-frequency, complex event chains with hotspots (pink stickies) indicate Core Subdomain territory. Simple, stable CRUD-like event chains signal Supporting Subdomains. Events produced by third-party integrations (payment gateway webhooks, shipping carrier callbacks) mark Generic Subdomain boundaries. The subdomain classification guides which bounded contexts receive rich aggregates versus thin facades. In EDA design, Core Subdomains are prime candidates for event-sourced aggregates; Generic Subdomains are usually consumers of external events (e.g., PaymentProcessed from a payment provider) without owning the event schema.

**Contested Interpretations**

Evans (2003) introduces the Core Domain concept in ch. 15 but does not formally name 'Supporting' and 'Generic' as a trio — those labels are solidified by Vernon (2013/2016). A contested point is the boundary between Supporting and Generic: some practitioners (Khononov 2021) add a complexity axis — simple logic = Supporting, zero differentiating logic = Generic — while others treat any non-core custom build as Supporting regardless of simplicity. Another debate concerns whether a subdomain classification is stable: Evans notes Core Domains evolve; Khononov explicitly states a Supporting Subdomain can become Core due to strategic shift, meaning classification should be revisited regularly rather than fixed at project inception.

**Thai Audience Note**

Thai architects from traditional 3-tier/SOA backgrounds often classify every module as equally important — all services get the same architecture stack. The subdomain taxonomy forces an unfamiliar prioritization conversation with business stakeholders, which can feel politically uncomfortable in hierarchical organizations where 'my system is core' is a status statement. Additionally, Thai enterprises frequently build in-house what should be Generic (e.g., custom authentication, email, reporting) because purchasing SaaS feels like lack of control; the Generic subdomain concept directly challenges this habit.

**Related Concepts**

Bounded Context, Context Map, Ubiquitous Language, Strategic Design, Domain Vision Statement, Segregated Core, Big Picture Event Storming

**Recent Developments (2020–2025)**

Post-2020, the community has refined subdomain classification with quantitative heuristics. Khononov (2021) introduced the 'complexity vs. competitive advantage' matrix as a decision aid. The DDD Starter Modelling Process (DDD Crew, 2022, ddd-crew.github.io) treats subdomain identification as step 1 of an iterative process rather than a one-time design decision. Wardley Mapping integration (Kaiser, InfoQ 2022) adds an evolution axis (genesis → commodity) that maps closely to Core → Generic, providing a visual complement to subdomain classification. Vlad Khononov's 2024 book 'Balancing Coupling in Software Design' extends the model by connecting subdomain type to coupling tolerance between bounded contexts.

**Implementation Pattern**

Core Subdomains: Rich Domain Model pattern; Event Sourcing + CQRS when auditability and complex state transitions are required; Saga orchestration for cross-context processes involving the core. Supporting Subdomains: Active Record or Transaction Script pattern; simpler CRUD services are appropriate; basic integration events (no event sourcing needed). Generic Subdomains: Adapter/Anti-Corruption Layer wrapping off-the-shelf product or SaaS; no domain model needed — only a thin integration layer translating external APIs to internal events.

**Workshop Activity**

Big Picture Event Storming — subdomain boundaries emerge from event clustering and hotspot identification. Bounded Context Canvas (DDD Crew) — the 'Strategic Classification' section explicitly asks teams to label each context as Core, Supporting, or Generic. Domain Storytelling can also surface subdomain boundaries by tracing end-to-end business stories.

**Decomposition Signal**

Core: stakeholders debate design decisions intensely; frequent requirement changes; team requests senior engineers; business cannot describe the logic in simple rules — it is judgment-based. Supporting: stable requirements, simple CRUD or ETL-like flows; no business stakeholder escalates design choices; can be described as a decision table. Generic: the problem has a Wikipedia article and multiple SaaS products solving it; any competitor would implement it identically. Organizational signal: if multiple teams share responsibility with no clear owner, it is likely Supporting or Generic.

**Evolution &amp; Refactoring**

Subdomain classification is not static. A Supporting Subdomain (e.g., a recommendation engine built cheaply) can become Core as the business pivots to personalization as a differentiator. Generic Subdomains can be superseded by better SaaS products, prompting replacement. The canonical refactoring move is 'Segregated Core' (Evans 2003): when the Core Domain is tangled with Supporting logic inside one bounded context, extract the Core into a separate module or context and demote surrounding logic to Supporting. Teams should re-evaluate subdomain classifications at major product strategy reviews.

**Conway's Law Implication**

Core Subdomains should be owned by the most senior, stable, cross-functional teams (Conway's Law inverse: put your best team on the most complex, strategically important context). Generic Subdomains are candidates for platform teams or outsourced vendors. Supporting Subdomains may be owned by feature teams. In Thai hierarchical IT departments, subdomain classification provides a defensible, business-grounded argument for team-to-domain alignment conversations that would otherwise be politically driven.

**Data Mesh / Analytics Note**

In a Data Mesh architecture, Core Subdomains are the natural owners of high-value analytical data products (e.g., order analytics, personalization signals). Generic Subdomains (authentication, payments) typically do not own analytical data products but may produce operational events consumed by Core Domain data pipelines. Supporting Subdomains provide reference data (inventory levels, product catalog snapshots). The Data Mesh principle of domain ownership (Dehghani, martinfowler.com 2019/2022) maps directly to subdomain classification for determining who publishes which data product.

**Testing Approach**

Core Subdomains: rich aggregate unit tests covering all invariants and business rules; property-based testing for complex logic; contract tests at bounded context seams. Supporting Subdomains: integration tests sufficient; thin domain model means fewer pure unit tests. Generic Subdomains: adapter/integration tests against the external service (pact-style contract tests if consuming external events); no business logic to unit test.

**Tooling &amp; DSL**

Context Mapper DSL: allows declaring bounded contexts with subdomain type annotations (CORE, SUPPORTING, GENERIC) and generates Context Maps. Bounded Context Canvas (Miro/Mural template from DDD Crew): includes a 'Strategic Classification' cell for subdomain type. EventStorming digital tools (Miro, MURAL, EventStorming.io): hotspot stickers naturally cluster around Core Subdomain areas during Big Picture sessions.

**Legacy Modernization Relevance**

Subdomain classification is the first step in Domain-Driven Discovery for legacy modernization (InfoQ 2023). The Strangler Fig Pattern prioritizes which parts to extract first: Core Subdomains justify full rewrite investment; Supporting Subdomains may be extracted incrementally with an Anti-Corruption Layer (ACL) wrapping legacy APIs; Generic Subdomains are candidates for replacement with SaaS (e.g., replace custom auth with an identity provider). In Thai brownfield scenarios, Generic Subdomains built in-house (custom reporting, custom SSO) are quick wins for SaaS replacement, freeing budget for Core Subdomain modernization.

### Bounded Context


**Definition**

A Bounded Context is a defined part of software where particular terms, definitions, and rules apply in a consistent and unambiguous way. It is the linguistic and model boundary within which a particular domain model is defined and applicable. Inside the boundary, a Ubiquitous Language is spoken consistently; the same word can mean different things in different contexts, and the boundary makes those meanings explicit. DDD deals with large models by dividing them into different Bounded Contexts and being explicit about their interrelationships.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003, Part IV (Strategic Design). Also: Fowler, Martin. 'BoundedContext.' martinfowler.com, 2014. https://martinfowler.com/bliki/BoundedContext.html

**Secondary Citations**

Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — recommends always decomposing to the level of bounded contexts and not further unless there are strong reasons. Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — aligns bounded contexts with microservice deployment units. Nick Tune, 'Dissecting Bounded Contexts' at DDD Europe 2020 (InfoQ) — explores modularity and finer decomposition within bounded contexts.

**E-commerce Example**

In an online shop, the concept of 'Product' illustrates bounded contexts clearly: in the Catalog context, a Product has a description, images, price, and SEO metadata. In the Inventory context, a Product is a SKU that is either available or not, tracked by quantity. In the Shipping context, a Product is a physical item with weight and dimensions needing packaging. In the Payment context, a Product may not exist at all — only an Order Line with a monetary amount matters. Each context maintains its own model of 'Product,' and an Anti-Corruption Layer or Published Language translates between them at context seams. The Order context acts as the integrating hub, emitting an 'OrderPlaced' event that the Payment, Inventory, and Shipping contexts subscribe to independently.

**Common Mistake**

Treating a Bounded Context as equivalent to a microservice and decomposing one-to-one. A bounded context is a modeling boundary (linguistic and conceptual), not a deployment boundary. One bounded context can be deployed as a monolith, multiple services, or a single library. Equating bounded contexts to microservices leads to over-fragmentation, with tiny services that share data through synchronous calls, recreating tight coupling — the very thing DDD was meant to prevent. As Vlad Khononov notes, always decompose to the level of bounded contexts, but not further unless there is a strong operational reason.

**Anti-Pattern**

Distributed Monolith — when services are broken apart by technical layer or team convenience rather than bounded context boundaries, services remain tightly coupled at the data and behavior level despite being physically separate. Changes in one service force coordinated deployments across many others. Also 'Big Ball of Mud Context' — when boundaries are never drawn or enforced, multiple domain models become entangled within the same codebase, with language ambiguities proliferating unchecked. Evans himself notes that a Big Ball of Mud is the most resilient DDD organizational pattern precisely because teams give up on enforcing any model at all. (Evans, 2003, Strategic Patterns; Richardson, microservices.io, 2023)

**Event Storming / EDA Connection**

In Big Picture Event Storming, the swimlane or pivot-event technique surfaces natural linguistic seams — moments where the same domain word changes meaning, or where a different team 'owns' the narrative. These seams become candidate bounded context boundaries marked with vertical lines on the storming board. At Design-Level Event Storming within a context, commands, aggregates, read models, and policies are elaborated using the context's own Ubiquitous Language. In EDA event flow, bounded contexts communicate via domain events published to a shared bus (e.g., 'OrderPlaced' published by the Order context, consumed by Payment and Shipping contexts), minimizing temporal coupling between contexts. The Bounded Context Canvas (DDD Crew) is used post-storming to formalize the discovered context's responsibilities, ubiquitous language, inbound/outbound dependencies, and classification (Core/Supporting/Generic).

**Contested Interpretations**

1. Granularity: Evans (2003) offers no fixed size rule — boundary is wherever the language changes. Vernon (2013) tends to align each bounded context with a deployable microservice. Khononov (2021) explicitly warns against over-decomposition beyond bounded contexts. Nick Tune (2020, DDD Europe) argues for finer-grained internal modularity within a bounded context rather than splitting it. No consensus on 'how big is a context.' 2. Bounded Context vs Subdomain confusion: Evans notes teams frequently conflate bounded contexts (solution space) with subdomains (problem space). A subdomain is discovered; a bounded context is designed. One context can serve multiple subdomains and one subdomain can be implemented across multiple contexts during transition. 3. Shared Kernel legitimacy: Evans treats Shared Kernel as a valid but high-cost integration pattern. Some practitioners (Vernon, post-2016) argue it should be avoided entirely in favor of duplication plus Published Language.

**Thai Audience Note**

Thai architects from SOA and 3-tier backgrounds typically think in terms of technical layers (presentation, business logic, data) and shared databases as integration points. Bounded Context inverts this: the integration point moves to the API or event boundary, and each context owns its own data store. The concept of 'the same table means different things to different teams' is counterintuitive when a shared Oracle or SQL Server schema is the accepted source of truth. Additionally, hierarchical Thai IT departments often have a DBA team that owns all schemas — this organizational pattern directly conflicts with context ownership of data and must be addressed explicitly when introducing DDD.

**Related Concepts**

- Domain
- Subdomain Types
- Ubiquitous Language
- Context Map
- Anti-Corruption Layer
- Aggregate
- Domain Event
- Event Storming

**Recent Developments (2020–2025)**

2020: Nick Tune at DDD Europe introduced finer-grained analysis of bounded context internals, recommending thinking about 'sub-contexts' and modularity within a context rather than always splitting into separate deployables (InfoQ, 2020). 2020-2022: Data Mesh (Zhamak Dehghani, martinfowler.com, 2020) directly applies Bounded Context as the ownership granularity for data products — each domain's bounded context owns and serves its own analytical data product, extending DDD into the data platform layer. 2022-2023: Architecture for Flow work (Skelton/Pais Team Topologies + Wardley Mapping) formalizes the Reverse Conway Maneuver: design bounded contexts first, then shape teams to match context boundaries. 2024-2025: At Explore DDD 2024, Evans encouraged experimentation with LLMs as domain modeling assistants; at QCon London 2025, DDD-led architecture modernization was demonstrated in healthcare contexts (InfoQ, 2025).

**Implementation Pattern**

CQRS should be applied selectively within a bounded context — it is a within-context pattern, not a cross-context pattern. A context with high read/write asymmetry (e.g., a Catalog context serving millions of reads but few writes) is a natural fit for CQRS + read-model projections. Event Sourcing is appropriate within a Core Domain bounded context where audit trail and temporal queries matter (e.g., Order context); it is an anti-pattern when applied to the entire system. Outbox Pattern is used at context boundaries to ensure reliable event publication without distributed transactions. Saga (choreography-based) is the preferred integration pattern between contexts when eventual consistency is acceptable — each context reacts to domain events from others without direct coupling. Orchestration-based Saga (via a Process Manager) is appropriate when a complex business process spans multiple contexts and requires explicit compensation logic (e.g., order cancellation rolling back payment and inventory).

**Workshop Activity**

Big Picture Event Storming (Alberto Brandolini) is the primary tool for discovering bounded context candidates — vertical lines are drawn at linguistic pivot points on the storming board. Bounded Context Canvas (DDD Crew) is used to document and validate each discovered context: its purpose, ubiquitous language terms, inbound/outbound dependencies, and strategic classification. Domain Storytelling is an alternative discovery technique that uses pictographic story narration with domain experts to identify where actors switch context. Domain Message Flow Modeling (DDD Crew) is used to validate context boundaries by mapping cross-context event/command flows.

**Decomposition Signal**

Linguistic signals: the same term (e.g., 'Customer', 'Product', 'Order') has meaningfully different attributes or behaviors when discussed with different domain experts or teams — a strong signal for a context boundary. Organizational signals: when two teams must coordinate every time they change a shared model, or when a team owns a distinct business capability end-to-end. Data-coupling signals: a shared database table with columns that only make sense to one consumer team signals an undrawn boundary. Rate-of-change signals: parts of the model that change at very different frequencies (e.g., Catalog changes with marketing campaigns; Inventory changes in real time with warehouse events) indicate separate contexts. Team culture and language signals: different vocabularies used in meetings or documentation between departments (Sales vs. Warehouse vs. Finance) are among the most reliable decomposition signals (Evans, 2003; Fowler, martinfowler.com).

**Evolution &amp; Refactoring**

Bounded context boundaries are not fixed lines — they evolve as domain understanding deepens through conversations with domain experts. Common evolutionary moves: (1) Splitting a context when a single context grows too large or two distinct Ubiquitous Languages emerge within it — the Segregated Core refactoring (Evans, 2003) extracts the core model from supporting concerns. (2) Merging contexts when two separately modeled contexts turn out to share the same language and team — maintaining two models becomes wasteful overhead. (3) Introducing an Anti-Corruption Layer incrementally during extraction from a legacy monolith, so the new context's model is protected from the legacy schema's language. (4) Promoting a Shared Kernel to separate Published Language when the shared code grows divergent team interests. The typical lifecycle: discover via Event Storming → document via Bounded Context Canvas → implement as a modular monolith → extract to separate deployable when operational pressure justifies it.

**Conway's Law Implication**

Conway's Law states that organizations design systems mirroring their communication structures. For Bounded Context, this means a context should be owned by a single team (or a small stable team cluster) — shared ownership of a context between two teams is a high-risk smell that produces Big Ball of Mud. The Reverse Conway Maneuver (from Team Topologies, Skelton/Pais, 2019) prescribes designing bounded contexts first, then restructuring teams to align with those context boundaries, rather than letting org structure dictate architecture. In Thai enterprises with hierarchical IT departments siloed by technology (DBA team, middleware team, frontend team), this inversion is organizationally disruptive but essential — a bounded context team must span all necessary skills to own its context end-to-end (full-stack stream-aligned team).

**Data Mesh / Analytics Note**

Data Mesh (Dehghani, 2020) adopts Bounded Context as the ownership granularity for data products. Each domain's bounded context is responsible for serving its own analytical data as a product — e.g., the Order context publishes an 'Orders' analytical data product with its own schema, SLA, and ownership. This directly extends DDD's bounded context ownership into the data platform layer. For Thai enterprises with strong BI culture and centralized data warehouses, this represents a significant shift: instead of a central EDW team owning all data, each bounded context team owns and maintains their data product. The bounded context boundary becomes the boundary of the data domain in the mesh.

**Testing Approach**

At the context boundary: consumer-driven contract tests (e.g., Pact) verify that published events and APIs conform to the contracts expected by consuming contexts, catching integration regressions without full end-to-end tests. Within the context: aggregate unit tests cover business rules in isolation (no I/O). Application service integration tests verify that the context's use cases execute correctly against a real database or in-memory substitute. The seam between contexts is the primary testing boundary — test doubles (mocks/stubs) are acceptable only at the point where one context calls another, not within a context's internals. (Fowler, martinfowler.com; enterprisecraftsmanship.com)

**Tooling &amp; DSL**

Context Mapper DSL (open source, contextmapper.org) — a domain-specific language and VS Code extension for modeling bounded contexts and context maps as code; generates PlantUML context map diagrams and service contract stubs. Bounded Context Canvas (DDD Crew, GitHub) — a structured one-page canvas (also available as a Miro template) for documenting a context's purpose, ubiquitous language, inbound/outbound dependencies, and strategic classification. EventStorming digital tools: Miro and Mural both have EventStorming templates; the DDD Crew provides Miro templates for the full DDD Starter Modelling Process including Bounded Context Canvas. Domain Storytelling Modeler (domainstorytelling.org) — open-source browser tool for capturing domain stories that reveal context boundaries.

**Legacy Modernization Relevance**

Bounded Context is the primary decomposition lens for the Strangler Fig pattern: identify existing bounded contexts within the monolith (often implicit and tangled), then incrementally extract them one at a time behind a facade. The Anti-Corruption Layer (ACL) is placed at the boundary between the new context and the legacy monolith, translating the legacy schema's language into the new context's Ubiquitous Language — protecting the new model from the pollution of legacy data structures. The DDD-based discovery process for modernization: use Event Storming to map the legacy business processes, draw candidate context boundaries at linguistic seams, create a Context Map of upstream/downstream relationships, then prioritize extraction by Core Domain first. For Thai enterprise brownfield scenarios (large Oracle ERP, SAP, or homegrown monoliths), identifying where bounded context lines should be drawn within the existing system is the critical first step before any microservices migration.

### Context Mapping Patterns


**Definition**

Context Mapping is a set of strategic patterns in Domain-Driven Design for explicitly characterizing the relationships, integration strategies, and team dynamics between Bounded Contexts. A Context Map documents all Bounded Contexts in a system and their interrelationships, making implicit integration contracts visible. The nine canonical patterns are: Shared Kernel, Customer-Supplier, Conformist, Anticorruption Layer (ACL), Open Host Service (OHS), Published Language (PL), Separate Ways, Big Ball of Mud, and Partnership. Each pattern describes both a technical integration style and a socio-organizational relationship between the teams that own the connected contexts.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Part IV, Chapter 14: 'Maintaining Model Integrity' — introduces all nine context mapping patterns and the concept of the Context Map as a living artifact. Also: Evans, Eric. DDD Reference (2015), domainlanguage.com — concise canonical definitions of all patterns.

**Secondary Citations**

Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013. Chapter 3 is considered the best practical guide to drawing context maps and applying upstream-downstream patterns. Vernon emphasizes team relationship dynamics alongside technical integration. Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — adds the lens of team cognitive load and organizational design to context mapping. Tune, Nick &amp; Skelton, Matthew. 'Architecture for Flow' (InfoQ, 2022) — connects context mapping patterns to Team Topologies interaction modes (collaboration, X-as-a-Service, facilitating).

**E-commerce Example**

In an online shop with Catalog, Cart, Order, Payment, Shipping, and Inventory bounded contexts, context mapping patterns appear at every boundary: (1) Shared Kernel: Catalog and Inventory share a canonical Product Identity value object (SKU + variant) — any change requires joint agreement. (2) Customer-Supplier: Order is upstream to Shipping; Order dictates the ShipmentRequest contract, Shipping must conform. (3) Conformist: Payment integrates with Stripe's API without translation — Payment adopts Stripe's model as-is. (4) Anticorruption Layer: Shipping integrates with a legacy ERP warehouse system; an ACL translates between the ERP's ItemCode terminology and the internal ProductVariant model. (5) Open Host Service + Published Language: Catalog exposes a product search API (OHS) with a documented JSON schema (PL) consumed by Cart, Order, and external affiliate systems. (6) Separate Ways: a standalone Promotions engine solves discount logic independently with no shared model with Cart; Cart recalculates totals locally. (7) Partnership: Order and Payment teams co-develop the checkout flow under a shared sprint cadence, evolving the PaymentIntent contract together. (8) Big Ball of Mud: an unreformed legacy monolith handling both Inventory and legacy Order history — wrapped behind an ACL to prevent model bleed into new services.

**Common Mistake**

Treating Context Mapping as a one-time architectural diagram exercise rather than a living team-relations artifact. Teams draw a context map at kickoff and never update it as relationships and team structures evolve. A related mistake is conflating the pattern label (e.g., 'we have an ACL') with actually implementing an ACL — teams declare the pattern without building the translation layer, leaving upstream model concepts leaking directly into downstream code.

**Anti-Pattern**

Distributed Monolith — when teams label their architecture as microservices but deploy Shared Kernel relationships across every service boundary, sharing domain classes and database schemas. The services are technically separate processes but are tightly coupled through shared models, producing all the operational complexity of microservices with none of the autonomy. Described in Vernon (2013) and widely referenced in microservices literature. A second named failure is 'Context Map Rot' (community term): a context map that describes the intended architecture rather than the actual integration reality, causing teams to make decisions based on stale relationship assumptions.

**Event Storming / EDA Connection**

Context Mapping patterns determine the event flow topology in an EDA system. In Big Picture Event Storming, the boundaries between swimlanes (or pivotal events) where the ubiquitous language shifts are the natural locations to apply context mapping patterns. Specifically: (1) An ACL manifests as an event-translating adapter — Domain Events from an upstream context are consumed, translated, and re-published as internally meaningful events. (2) OHS + PL corresponds to a well-documented event schema (e.g., AsyncAPI spec) that downstream contexts subscribe to. (3) Partnership implies event schemas co-designed by both teams in the same design-level Event Storming session. (4) Conformist means the downstream context adopts the upstream event's payload structure verbatim as its internal domain events. (5) Separate Ways means no shared event channel — each context emits and consumes events in isolation.

**Contested Interpretations**

Two areas of genuine disagreement: (1) Shared Kernel scope — Evans (2003) treats it as a valid integration pattern between aligned teams. Vernon (2013) warns it should be used sparingly and tends to create tight coupling; he prefers ACL or OHS in most cases. Khononov (2021) frames Shared Kernel as a form of high-collaboration team topology, appropriate only when Conway's Law alignment is guaranteed. (2) Partnership semantics — Evans' original description implies mutual technical dependency. Vernon and the post-2016 community interpret Partnership as also requiring explicit joint governance and release coordination. The DDD Crew (2020+) maps Partnership onto Team Topologies' 'Collaboration' interaction mode, which is explicitly intended to be temporary rather than permanent — a tension not present in Evans' original treatment.

**Thai Audience Note**

Thai architects from SOA/3-tier backgrounds typically model integration as point-to-point shared database joins or shared DTO libraries — which maps to Shared Kernel or the Big Ball of Mud pattern without the explicit naming. The concept that 'integration style is also a team relationship decision' is culturally unfamiliar: in hierarchical Thai IT departments, integration contracts are often dictated top-down by an enterprise architect without the upstream-downstream negotiation that Customer-Supplier implies. The ACL pattern also requires investment that is hard to justify to management — it produces no visible user feature, only model isolation. Framing ACL cost as 'preventing model contamination from legacy ERP' resonates better than framing it as 'translation layer.'

**Related Concepts**

Bounded Context (the unit being mapped), Ubiquitous Language (shifts at context boundaries signal mapping needs), Subdomain Types (Core/Supporting/Generic guide which mapping patterns are appropriate — Core-to-Core often Partnership; Generic often Conformist or OHS), Domain Events (the EDA mechanism crossing context boundaries), Event Storming (the workshop where context boundaries and mapping patterns are discovered), CQRS (common implementation choice when two contexts share read models via OHS), Aggregate Design Canvas (the within-context complement to context mapping).

**Recent Developments (2020–2025)**

2020-2025 developments: (1) Team Topologies mapping (Skelton &amp; Pais, 2019; widely applied post-2020): the DDD community explicitly maps context mapping patterns to Team Topologies interaction modes — Partnership = Collaboration (temporary), OHS/Customer-Supplier = X-as-a-Service, Shared Kernel = tight Collaboration. Nick Tune and Susanne Kaiser formalized this at DDD Europe 2022 and InfoQ 2023. (2) Data Mesh (Dehghani, 2020-2022): data mesh treats each analytical data product as a bounded context exposing data via OHS + Published Language (e.g., data contracts). Martinfowler.com's 'Data Mesh Principles' article (2020) and 'Designing Data Products' (2023) operationalize DDD context mapping for analytical domains. (3) AI-assisted context mapping: domainlanguage.com published an article (2024) on using LLMs to assist context mapping discovery from legacy codebases, representing the first official Domain Language Inc. engagement with AI tooling for DDD.

**Implementation Pattern**

Pattern selection by relationship type: (1) Anticorruption Layer → implement as an adapter/facade with an explicit translation service; commonly combined with the Outbox pattern when the ACL translates and re-publishes domain events to prevent dual-write failures. (2) Open Host Service → implement as a REST or gRPC API or event schema (AsyncAPI); add consumer-driven contract tests (Pact) to validate PL compliance. (3) Shared Kernel → enforce via a shared library with semantic versioning and mutual code ownership; CI gates prevent unilateral changes. (4) Customer-Supplier → upstream team publishes a stable interface; downstream writes consumer-driven contract tests against it. (5) Conformist → downstream adopts upstream model verbatim; no translation layer needed, reducing complexity at the cost of model purity. (6) Partnership → joint Event Storming sessions and shared CI pipeline; co-deploy cadence required. (7) Separate Ways → no shared infrastructure; context is fully self-contained; suitable for Generic subdomains where off-the-shelf solutions are used.

**Workshop Activity**

Big Picture Event Storming: hotspot stickies (pink) mark points of friction at context boundaries — these are prime candidates for ACL or Customer-Supplier patterns. After Big Picture ES, draw an initial Context Map as a post-session artifact. Bounded Context Canvas (DDD Crew): each canvas captures inbound/outbound dependencies, guiding which mapping pattern applies at each boundary. Domain Message Flow Modeling: visualizes the event/command flows between contexts, revealing whether partnership or customer-supplier semantics are in play. Context Mapping Workshop (DDD Crew's Context Mapping starter kit on GitHub) is a dedicated activity for mapping existing system boundaries.

**Decomposition Signal**

Signals that context boundaries exist and mapping patterns are needed: (1) Linguistic shift — the same noun means different things to different teams ('product' in Catalog vs. Shipping); this is the primary Evans signal. (2) Different rates of change — Catalog updates product info daily; Inventory updates stock counts in real time; different release cadences indicate separate contexts. (3) Data coupling — two modules share a database table but apply different business rules to the same rows. (4) Team ownership conflict — two teams argue about who owns the model for 'order'; the disagreement itself marks the boundary. (5) Organizational silos — a separate vendor, regulatory body, or business unit controls part of the model (classic ACL signal). (6) Conformance pressure — one team is forced to match another team's API exactly without negotiation power (Conformist signal).

**Evolution &amp; Refactoring**

Context Mapping patterns evolve as team structures and system maturity change. Common evolutionary trajectories: (1) Big Ball of Mud → ACL → explicit Bounded Context: legacy systems are first wrapped with an ACL, then incrementally extracted using Strangler Fig. The ACL prevents model contamination during the transition period. (2) Partnership → Customer-Supplier: co-located teams that collaborated intensely (Partnership) mature into stable upstream/downstream relationships as their APIs stabilize; the explicit contract reduces coordination overhead. (3) Conformist → ACL: when a downstream team gains enough business value to justify translation investment, Conformist is refactored into an ACL to regain model autonomy. (4) Shared Kernel → separate OHS: as teams scale and release independence becomes important, shared kernel classes are replaced with a published API. The Context Map itself is a key refactoring tool — regularly revisiting it surfaces drift between intended and actual integration patterns.

**Conway's Law Implication**

Context Mapping patterns are simultaneously technical and organizational decisions — each pattern implies a corresponding team interaction mode. Partnership requires two teams communicating continuously (high bandwidth); this is unsustainable at scale, so Conway's Law predicts Partnership relationships will naturally evolve toward Customer-Supplier as teams separate. In Thai hierarchical IT departments where architects set integration contracts top-down, the Customer-Supplier pattern is naturally instantiated (architect = supplier, development teams = customers) but without the explicit negotiation DDD prescribes. Shared Kernel requires genuine joint code ownership — rare in siloed Thai enterprise IT where team ownership maps strictly to cost centers. The ACL pattern is Conway's Law-safe: it allows teams to evolve independently behind the translation boundary.

**Data Mesh / Analytics Note**

Data Mesh (Dehghani, 2020) operationalizes DDD context mapping for analytical data. Each data product corresponds to a bounded context exposing its analytical data via Open Host Service + Published Language — the 'data contract' is the PL for analytical consumers. Downstream BI/ML pipelines are Conformist or use ACL (data transformation pipelines) when they need to reconcile model differences. For Thai enterprises with strong BI/data warehouse cultures, this framing helps: the ETL pipeline from the Order bounded context to the data warehouse is an ACL; the data warehouse's star schema is its own bounded context (analytics) with a Conformist relationship to operational contexts. Context mapping makes the upstream-downstream data flow explicit and owned.

**Testing Approach**

Testing strategy by pattern: (1) Customer-Supplier and OHS/PL → Consumer-Driven Contract Tests (CDC) using tools like Pact. The downstream (consumer) publishes contract expectations; the upstream (provider) verifies against them in CI. This ensures PL stability without integration environment dependency. (2) ACL → unit-test the translation layer in isolation with known upstream payloads and expected downstream domain objects; integration-test the ACL against a stub of the external system. (3) Shared Kernel → shared library tests run in both contexts' CI pipelines; any failing test in either context blocks release. (4) Conformist → no translation to test; focus on integration tests that verify the external model's API contract has not changed (snapshot tests on external responses). (5) Partnership → co-owned integration tests in a shared repository, run against a shared staging environment.

**Tooling &amp; DSL**

Context Mapper (contextmapper.org) — a dedicated DSL and VS Code extension for modeling context maps in code, supporting all nine DDD patterns with diagram generation and refactoring commands. Miro/Mural — DDD Crew provides a free Bounded Context Canvas Miro template and a Context Mapping starter kit. Event Storming tools: Miro, Mural, and Lucid are commonly used for Big Picture ES sessions that produce the raw material for context maps. The DDD Crew GitHub (ddd-crew.github.io) hosts the Bounded Context Canvas and Domain Message Flow templates as free Miro/Figma resources. C4 Model diagrams (Context and Container levels) complement context maps for communicating to non-DDD stakeholders.

**Legacy Modernization Relevance**

Context Mapping is the primary strategic tool for legacy migration planning. The recommended approach for Thai enterprise architects facing monolith-to-microservices migrations: (1) Map the existing monolith as a Big Ball of Mud — acknowledge the current state explicitly. (2) Identify seams using linguistic and rate-of-change signals (decomposition_signal above). (3) Apply ACL at the boundary of the first extracted service to isolate the new bounded context's model from the legacy model — this is the 'Getting Started with DDD When Surrounded by Legacy Systems' pattern (Evans, 2013, domainlanguage.com). (4) Use Strangler Fig to route traffic incrementally to new services while the ACL translates. (5) Once extraction is complete, the ACL can be retired or evolved into OHS + PL for other consumers. The Context Map serves as the migration roadmap — each pattern represents a stage in the modernization journey.

### Ubiquitous Language


**Definition**

Ubiquitous Language is the practice of building up a common, rigorous language between developers and domain experts, based on the domain model used in the software. The language must be used everywhere — in conversation, documentation, and code — and is strictly scoped to a single Bounded Context. Because software does not cope well with ambiguity, each term has exactly one meaning within its context boundary. Evans introduced it to close the translation gap that corrupts understanding when developers maintain a separate technical vocabulary from the business.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Chapter 2 (Communication and the Use of Language). Also: Evans, DDD Reference, 2015, domainlanguage.com.

**Secondary Citations**

Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — states Ubiquitous Language and Bounded Context are 'the two primary pillars of DDD's strengths, and one cannot properly stand without the other.' Khononov, Vladik. Learning Domain-Driven Design. O'Reilly, 2021 — describes Ubiquitous Language as 'a cornerstone practice in DDD' and advocates using Event Storming to discover and refine it. Fowler, Martin. 'UbiquitousLanguage', martinfowler.com, 2006.

**E-commerce Example**

In an e-commerce platform, the word 'Order' means different things in different departments. In the Catalog context, an 'Order' does not exist — only 'Products' and 'SKUs' are relevant. In the Order Management context, an 'Order' is a confirmed purchase with line items, a billing address, and a status lifecycle (Placed, Confirmed, Shipped, Delivered). In the Shipping context, the same business concept is a 'Shipment' with a tracking number and carrier assignment. Ubiquitous Language requires each context to define its own precise vocabulary: developers in Order Management speak of 'placing an Order', never 'creating a Shipment'; Shipping engineers speak of 'dispatching a Shipment', never 'fulfilling an Order'. The class names, method names, and event names in each service's codebase must mirror these context-specific terms exactly.

**Common Mistake**

Teams create a single enterprise-wide ubiquitous language and attempt to share it across all bounded contexts. This contradicts the fundamental constraint that Ubiquitous Language is scoped to one Bounded Context. When a term like 'Customer' or 'Product' is forced to carry meaning across multiple contexts, it accumulates contradictory attributes and logic, eventually producing an anemic, bloated object that satisfies no context well. The correct approach is to allow the same real-world concept to have different names and different representations in different contexts, connected only by explicit translation at context boundaries.

**Anti-Pattern**

The 'God Ubiquitous Language' (sometimes called the Enterprise Canonical Model) — an attempt to define one authoritative vocabulary for the entire organization. Literature reference: Evans (2003) explicitly warns that as you try to model a larger domain, it gets progressively harder to build a single unified model, and different groups will use subtly different vocabularies. Khononov (2021) reinforces this: there is no practical way to have a canonical enterprise data model where every element is representative of how every team would want to use it. The failure mode manifests as a shared kernel that becomes a bottleneck or as integration models that leak into multiple contexts.

**Event Storming / EDA Connection**

Event Storming is the primary workshop technique for discovering and validating Ubiquitous Language. Every sticky note in Event Storming uses domain vocabulary: orange Domain Event stickies (e.g., 'OrderPlaced', 'PaymentConfirmed') are named in the language of the business, not technical identifiers. Blue Command stickies ('PlaceOrder', 'ConfirmPayment') and yellow Actor stickies ('Customer', 'Warehouse Manager') all force participants to agree on the exact terms used in each bounded context. Disagreements about sticky-note naming reveal language ambiguity and signal where boundaries should be drawn. In EDA event flows, event names are the most durable expression of Ubiquitous Language in code: a well-named event like 'ShipmentDispatched' in the Shipping context cannot be misread, whereas a generic 'StatusUpdated' event signals language breakdown.

**Contested Interpretations**

Evans (2003) treats Ubiquitous Language as primarily a team communication practice that is then reflected in code. Vernon (2013) elevates it to equal status with Bounded Context as one of the two pillars of DDD — arguing the language must be formally encoded into every artifact including tests, APIs, and message schemas. Fowler's bliki notes the language (and model) should evolve as team understanding grows, implying it is dynamic. A minor contested point: Evans focuses on spoken and written language first (conversations with domain experts, documentation), while the post-2016 community (Khononov, DDD Crew) emphasizes discovering the language through collaborative modeling workshops (Event Storming, Domain Storytelling) rather than through traditional requirements gathering, shifting the primary discovery mechanism.

**Thai Audience Note**

Thai architects coming from SOA or 3-tier backgrounds are accustomed to a single canonical data model (often an enterprise-wide ERD or a shared service layer) as the source of truth. The idea that the same business concept (e.g., 'Customer') has legitimately different meanings in different services, and that this difference is intentional and correct, is counterintuitive. They may also conflate Ubiquitous Language with documentation artifacts (data dictionaries, glossaries in Word/Confluence) rather than understanding it as a living constraint that must be enforced in class names, method signatures, API endpoint names, and event names in the actual codebase.

**Related Concepts**

- Bounded Context
- Context Mapping Patterns
- Domain
- Subdomain Types
- Aggregate
- Domain Events
- Event Storming

**Recent Developments (2020–2025)**

In 2024, Eric Evans publicly encouraged DDD practitioners to experiment with LLMs trained specifically on a bounded context's Ubiquitous Language rather than on broad general-purpose corpora, arguing a domain-specific LLM would be far more useful for context-specific tasks (InfoQ, March 2024). The DDD community has also increasingly adopted 'living documentation' approaches (circa 2021–2023) where code annotations are scanned to auto-generate an always-up-to-date glossary from class and method names that conform to the Ubiquitous Language, eliminating the drift between documentation and implementation. Data Mesh (Zhamak Dehghani, 2021, martinfowler.com) explicitly applies Ubiquitous Language at the domain data product level, requiring each analytical data product to use the vocabulary of its bounded domain rather than a centralized data warehouse schema.

**Implementation Pattern**

Ubiquitous Language is not a tactical pattern itself but it constrains how all tactical patterns are implemented. Key enforcement points: (1) Aggregate and Entity class names must use context-specific terms, not technical or generic names. (2) CQRS command and query names must be verbs from the Ubiquitous Language ('PlaceOrder', not 'CreateOrderRecord'). (3) Event Sourcing event names must be past-tense domain facts ('OrderPlaced', 'PaymentFailed') using exact domain vocabulary. (4) Outbox and Saga message schemas must carry Ubiquitous Language field names, not database column names. (5) REST API paths and GraphQL types must reflect domain concepts. The test that the language is truly ubiquitous: a domain expert unfamiliar with code should be able to read a class diagram or event log and recognize the terms as their own.

**Workshop Activity**

Big Picture Event Storming (primary) — surfaces raw domain vocabulary by having experts name Domain Events on orange stickies using business language. Design-Level Event Storming — refines vocabulary into commands, policies, and aggregates. Domain Storytelling — makes language visual through pictographic scenarios; explicitly captures ubiquitous language as labeled arrows and actors. Bounded Context Canvas — has a dedicated 'Ubiquitous Language' section requiring the team to list key terms with their context-specific definitions.

**Decomposition Signal**

Observable signals that a language boundary exists and should become a Bounded Context boundary: (1) The same word is used by different teams with subtly different meanings (e.g., 'Order' means 'cart checkout' to Sales but 'fulfillment unit' to Warehouse). (2) Conversation between teams requires constant translation or clarification of terms. (3) A shared data model has columns or fields that are null or irrelevant in some contexts (indicating overloaded concepts). (4) Different sub-teams use different naming conventions for the same real-world entity in their code. (5) Documentation has parenthetical disambiguations ('Order (Sales context)' vs 'Order (Fulfillment context)'). These linguistic signals are the earliest and cheapest indicators of context boundaries — cheaper than observing data coupling or deployment coupling.

**Evolution &amp; Refactoring**

Ubiquitous Language evolves as domain understanding deepens — Evans explicitly states the language and model should evolve together as the team's understanding grows. Refactoring moves: (1) Term clarification: rename a class or event when domain experts correct terminology (e.g., 'Transaction' → 'Payment' in a Billing context). (2) Term splitting: when one overloaded term is found to represent two distinct concepts, introduce two new terms and refactor code accordingly. (3) Term promotion: a term used informally in conversations is formally codified into a class or event name. (4) Context extraction: when a cluster of terms forms a coherent language that differs from the surrounding context, this signals a candidate for a new Bounded Context (Segregated Core). The key discipline is keeping code and language synchronized — renaming in code whenever the language changes, and changing language whenever code reveals a conceptual gap.

**Conway's Law Implication**

A team's communication structure shapes its system's architecture (Conway's Law). Ubiquitous Language provides the positive corollary: the team that owns a Bounded Context owns the language of that context, and its language boundary should align with the team boundary. In hierarchical Thai enterprise IT departments, where multiple siloed teams share the same database or SOA service layer, the absence of per-context language ownership is both a symptom and a cause of architectural coupling. Applying the Inverse Conway Maneuver — restructuring teams around bounded contexts first — creates the organizational conditions under which a distinct Ubiquitous Language per context can be maintained and enforced.

**Data Mesh / Analytics Note**

Data Mesh explicitly imports Ubiquitous Language into the analytical data plane. Each domain team owns its data products and names them using the domain's Ubiquitous Language (e.g., 'confirmed_orders' not 'fact_order_header'). This prevents the central data warehouse anti-pattern where BI schemas use generic or normalized names that lose domain meaning. For Thai enterprises with strong BI cultures and centralized data warehouses, this represents a significant paradigm shift: instead of mapping domain entities to a canonical DWH schema, each bounded context exposes data products whose field names are taken directly from that context's Ubiquitous Language.

**Testing Approach**

Ubiquitous Language is tested primarily through ubiquity checks: (1) Glossary review sessions where domain experts validate that class names, method names, and event names match their vocabulary — any term that requires explanation is a failure. (2) Domain unit tests written with domain-readable assertions: test method names should read as domain scenarios ('givenAnOrderIsPlaced_whenPaymentFails_thenOrderIsCancelled') using Ubiquitous Language terms. (3) Contract tests at bounded context seams verify that published event and API field names conform to the consuming context's Ubiquitous Language translation. (4) Living documentation tooling that auto-generates a glossary from code annotations, allowing domain experts to review it as a continuous validation artifact.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) — allows teams to define Bounded Contexts and their Ubiquitous Language in a textual DSL, generate context maps, and export to PlantUML or other formats. Miro/Mural — used for remote Event Storming; sticky note labels are the primary vehicle for capturing Ubiquitous Language collaboratively. Domain Storytelling tool (egon.io) — open-source, purpose-built for Domain Storytelling sessions that produce pictographic representations of domain vocabulary. Bounded Context Canvas (ddd-crew.github.io) — Miro/Mural template with an explicit Ubiquitous Language section. For living documentation: ArchUnit (Java) and custom annotation processors can enforce naming conventions that conform to the Ubiquitous Language at build time.

**Legacy Modernization Relevance**

In brownfield/legacy modernization, the legacy system's data model and naming conventions are almost never aligned with any meaningful Ubiquitous Language — they reflect past technical decisions, not domain concepts. The first step when applying DDD to a legacy system is to discover the Ubiquitous Language of each bounded context that will be extracted, independent of the legacy schema. The Anti-Corruption Layer (ACL) pattern is then placed at the boundary between the new bounded context (with its clean Ubiquitous Language) and the legacy system (with its technical or anemic naming), performing explicit translation so that the new context's language is never contaminated by legacy terminology. In the Strangler Fig pattern, each new service that replaces a slice of the monolith should define its own Ubiquitous Language for that slice, using the ACL to translate to/from the monolith during the transition period.

### When to Use DDD


**Definition**

Domain-Driven Design is particularly suited to complex domains where a lot of often-messy logic needs to be organized. DDD is most appropriate when the primary complexity of an application is not technical but resides in the domain itself — the activity or business of the user. Evans argues that successful design must systematically deal with this central aspect by building a model that reflects real domain knowledge. The approach is less about tactical patterns (aggregates, repositories) and more about strategic collaboration: discussion, listening, understanding, discovery, and business value — all in an effort to centralize knowledge.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. The core criterion — complex domain logic that resists straightforward processing — is stated throughout Part I. Fowler summarizes: 'DDD is particularly suited to complex domains, where a lot of often-messy logic needs to be organized.' (Fowler, 'DomainDrivenDesign', martinfowler.com, 2014).

**Secondary Citations**

Khononov, Vladik. Learning Domain-Driven Design. O'Reilly, 2021 — Khononov disputes the 'complex projects only' restriction, arguing that once DDD is decoupled from the Domain Model tactical pattern, it becomes a pure modeling methodology applicable to any domain where consistent terminology matters. Hickey, James Michael. 'Stop Pretending To Do Domain-Driven Design' (jamesmichaelhickey.com) — emphasizes that DDD is about talking to domain experts and identifying which parts change most often, not about applying tactical patterns everywhere.

**E-commerce Example**

In an e-commerce platform, DDD is justified in the Order and Payment subdomains: complex business rules govern promotions, fraud scoring, order state machines, and multi-currency settlement — all areas where domain expert collaboration is critical and logic changes frequently. By contrast, the Catalog browsing subdomain (product listing, search facets) may be predominantly read-heavy CRUD; a simpler data-access pattern or off-the-shelf product catalogue service is sufficient. The Shipping subdomain may qualify if the company owns logistics complexity (carrier selection rules, SLA negotiation), but if shipping is outsourced entirely to a third-party provider, it is a Generic subdomain best addressed by integrating an existing solution rather than building a rich domain model.

**Common Mistake**

The most frequent misapplication is applying DDD tactical patterns (Aggregate, Repository, Domain Service) uniformly across an entire codebase, including modules that are pure CRUD or generic plumbing. Teams spend engineering cycles adding aggregates and domain events to a basic profile-management module that has no meaningful business invariants. This 'pattern tax' adds complexity without value. The strategic first step — identifying which subdomains actually warrant a rich domain model — is skipped.

**Anti-Pattern**

Big Ball of Mud Domain Model: applying DDD vocabulary everywhere without strategic triage produces a sprawling, bloated model that mirrors the database schema rather than the business domain — effectively reverting to an Anemic Domain Model wrapped in DDD terminology. A related anti-pattern is Event Sourcing as Default: prematurely adopting Event Sourcing for all bounded contexts (including trivial CRUD ones) because it feels 'DDD-compliant', dramatically inflating operational and cognitive overhead in areas that would function adequately with simple state storage. (InfoQ, 'DDD — the Wrong Way', 2015.)

**Event Storming / EDA Connection**

In a Big Picture EventStorming session, the decision of whether to use DDD surfaces naturally: dense clusters of domain events, hotspots (pink stickies marking confusion or contention), and competing terminologies between swimlanes all signal that a rich domain model is warranted. If an area of the event flow produces few domain events and has no actor-driven commands beyond create/read/update/delete, that boundary may be a Generic or Supporting subdomain where a simple CRUD service or off-the-shelf solution suffices. EventStorming thus acts as the discovery mechanism that answers 'where does DDD apply here?' before any code is written.

**Contested Interpretations**

Evans (2003) implicitly frames DDD as appropriate only for genuinely complex domains — the entire book is premised on 'tackling complexity in the heart of software.' Fowler echoes this: 'DDD is particularly suited to complex domains.' However, Khononov (2021) explicitly contests this restriction: he argues that even simple domains benefit from the strategic practices (Ubiquitous Language, bounded contexts) because inconsistent terminology causes coordination failures regardless of domain complexity. His position decouples strategic DDD from tactical DDD, making the criteria domain-type-specific rather than complexity-gated. This disagreement has practical consequences: Evans/Fowler would not mandate DDD for a CRUD-only subdomain; Khononov would still recommend strategic modeling even there.

**Thai Audience Note**

Thai architects from 3-tier/SOA backgrounds are accustomed to database-centric thinking: every feature maps to a table and a stored procedure. The concept of 'domain complexity' as the primary driver for DDD is alien — they tend to judge complexity by transaction volume or integration count, not by richness of business rules. This causes two opposite failure modes: (1) applying DDD to high-traffic but logic-light reporting services (wrong unit of measure), and (2) dismissing DDD for genuinely complex domains like insurance underwriting or credit scoring because the transaction count is low. Thai teams also often lack access to domain experts (business stakeholders sit far above the IT hierarchy), making the collaboration prerequisite for DDD hard to fulfill in practice.

**Related Concepts**

- Domain
- Subdomain Types
- Bounded Context
- Ubiquitous Language
- Context Mapping Patterns

**Recent Developments (2020–2025)**

In 2024, Eric Evans encouraged DDD practitioners to experiment with LLMs, proposing that future domain modelers will identify tasks involving natural language interpretation as distinct subdomains — effectively adding a new criterion for 'when to use DDD': when parts of a system handle unstructured natural-language input that resists structured domain modeling, a hybrid approach (structured DDD model + LLM-backed subdomain) may be appropriate. In 2023, the InfoQ article 'Start Your Architecture Modernization with Domain-Driven Discovery' codified a four-step DDD-first approach to cloud migration projects, establishing domain-driven discovery as the recommended entry point for brownfield architecture modernization — not just greenfield design. QCon London 2025 reported growing adoption of DDD at scale in healthcare, reinforcing that regulated industries with complex rule sets are prime DDD candidates.

**Implementation Pattern**

When DDD is warranted (Core subdomain, complex invariants, long-lived system): use a rich Domain Model with Aggregates enforcing invariants, Domain Events for cross-aggregate communication, and CQRS to separate write (command) and read (query) models where read patterns diverge significantly from the write model. Event Sourcing is appropriate only when auditability of every state change is a hard business requirement — not by default. When DDD is NOT warranted (Supporting or Generic subdomains, CRUD-only): use Transaction Script or Table Module patterns; expose a simple REST/GraphQL API backed directly by an ORM. Forcing CQRS or Event Sourcing onto these subdomains is the classic over-engineering mistake.

**Workshop Activity**

Big Picture EventStorming is the primary activity for determining where DDD should be applied: it surfaces domain event density, hotspots, and language inconsistencies that signal Core subdomains. The DDD Starter Modelling Process (ddd-crew) provides a structured checklist — starting with 'Understand the Domain' before committing to any tactical patterns — that gates the decision to apply DDD on evidence gathered from collaborative modeling rather than assumptions.

**Decomposition Signal**

Signals that DDD IS warranted: (1) Linguistic — domain experts and developers use different words for the same concept, or the same word means different things in different contexts; (2) Organizational — multiple teams or business units collaborate on one module with frequent misalignment; (3) Rate-of-change — business rules in this area change frequently due to regulatory or competitive pressure; (4) Data-coupling — entities carry large volumes of conditional logic (if-else chains encoding business policy). Signals that DDD is NOT warranted: the module is a CRUD wrapper over a stable data schema; the 'domain expert' is just a data entry operator; the system is explicitly throwaway (one-time migration, prototype); no ongoing relationship with the business owner is planned.

**Evolution &amp; Refactoring**

DDD application is not a binary up-front decision — it evolves. A subdomain that starts as Supporting (simple CRUD) may graduate to Core as business differentiation grows around it. Canonical refactoring moves: (1) Distillation — identify the Core Domain within a bloated model and separate it from generic concerns (Evans, ch. 15); (2) Segregated Core — physically separate Core subdomain code from supporting code in the same bounded context; (3) Incremental adoption — begin with Ubiquitous Language and context mapping (low investment), add tactical patterns only when invariant complexity justifies it. Conversely, if a formerly complex subdomain is commoditized (e.g., payment processing now handled by Stripe), it should be demoted to Generic and replaced with an off-the-shelf integration.

**Conway's Law Implication**

Conway's Law states that system architecture mirrors the communication structure of the organization. For Thai enterprise architects in hierarchical IT departments, this means: a siloed IT team (front-end / back-end / DBA layers) will naturally produce a layered monolith regardless of DDD aspirations. The Inverse Conway Maneuver — deliberately aligning team boundaries to desired bounded context boundaries — is a prerequisite for DDD to succeed at scale. If organizational restructuring is politically infeasible, DDD's strategic benefits will be undermined by cross-team coordination friction. This is a critical go/no-go consideration before committing to DDD in large Thai enterprise contexts.

**Data Mesh / Analytics Note**

DDD bounded contexts map naturally to data mesh domain ownership: each bounded context becomes a candidate data product owner responsible for both its operational data and the analytical data products derived from it. However, the same 'when to use DDD' criterion applies: only Core subdomains with complex, frequently changing business logic justify the overhead of a full domain-owned data product. Generic subdomains (e.g., a standard authentication service) do not warrant dedicated analytical ownership — their data can be centralized. For Thai enterprises with strong BI cultures, the data mesh framing often makes DDD's bounded context concept more palatable because it connects to familiar data ownership discussions.

**Testing Approach**

The testing strategy mirrors the 'when to use DDD' decision: where DDD tactical patterns apply, unit-test aggregates against their public API (method calls and resulting domain events or state), treating the aggregate as the unit boundary — no mocks inside the aggregate. Where DDD does NOT apply (CRUD services), integration tests against the real database are sufficient and more valuable than unit tests on thin service classes. At bounded context seams, use contract tests (consumer-driven contracts) to validate integration points without coupling test suites across contexts.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) — allows encoding bounded contexts, subdomain types (Core/Supporting/Generic), and context map relationships in a versioned DSL; use it to make the 'when to use DDD' decision explicit and reviewable. Bounded Context Canvas (ddd-crew.github.io) — a structured template for characterizing each bounded context before deciding on tactical pattern investment. Miro/Mural templates exist for Big Picture EventStorming and the DDD Starter Modelling Process. EventStorming digital tools (Miro, MURAL, Avolution) surface hotspots that indicate where DDD investment is warranted.

**Legacy Modernization Relevance**

DDD is most actionable in brownfield contexts when combined with the Strangler Fig pattern: identify bounded contexts in the legacy monolith via domain-driven discovery (EventStorming the existing system), then extract Core subdomains first — the areas of highest complexity and change rate that justify the refactoring cost. Generic and Supporting subdomains should be replaced with SaaS or commodity services, not reimplemented with a rich domain model. Anti-Corruption Layers (ACL) are placed at the seam between the legacy system and the new DDD-modeled service to prevent legacy data models from polluting the new ubiquitous language. A 2023 InfoQ article on architecture modernization codifies this four-step approach for cloud migration projects.

### Strategic Distillation Tools


**Definition**

Strategic Distillation is a set of techniques from Evans (2003, Ch.15) for identifying, separating, and highlighting the Core Domain from the rest of the model. The five primary tools are: (1) Domain Vision Statement — a short written description of the Core Domain and the value it brings, used to guide team priorities; (2) Highlighted Core — adding visual marks (e.g., a separate distillation document or inline flags in the model diagram) to make the core elements immediately recognizable without restructuring code; (3) Cohesive Mechanisms — factoring out procedural, mechanical complexity (algorithms, mathematical frameworks) into separate, FRAMEWORK-like modules so they do not obscure the Core Domain's expressive logic; (4) Segregated Core — physically refactoring the Core Domain classes into their own package/module, removing direct dependencies on supporting or generic code; (5) Abstract Core — capturing the most fundamental concepts of the Core Domain as abstract classes or interfaces at the top of the model hierarchy, allowing multiple Bounded Contexts to depend on shared abstractions rather than concrete implementations. Together these form an escalating ladder of investment: from low-cost documentation tools (Vision Statement, Highlighted Core) to costly structural refactoring (Segregated Core, Abstract Core).

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Part IV, Chapter 15: Distillation. Patterns covered: Core Domain (p.401), Generic Subdomains (p.407), Domain Vision Statement (p.416), Highlighted Core (p.419), Cohesive Mechanisms (p.426), Segregated Core (p.439), Abstract Core (p.448).

**Secondary Citations**

- Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021. Ch.2 — Distinguishing Core, Supporting, and Generic Subdomains; criteria for build vs. buy vs. outsource decisions aligned with Evans distillation ladder.
- Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013. Ch.2 — Discusses core domain identification in the context of strategic design and subdomains.
- Vladikk (Khononov). 'Revisiting the Basics of Domain-Driven Design.' vladikk.com, 2018. Clarifies the three subdomain types and why generic subdomains should be bought, not built.
- DDD Crew. 'DDD Starter Modelling Process.' ddd-crew.github.io. Includes core domain classification step using Core Domain Charts.
- Kaiser, Susanne. 'Architecture for Flow with Wardley Mapping, DDD, and Team Topologies.' InfoQ, 2022. Extends distillation with Wardley evolution stages to guide build/buy decisions.
- Tune, Nick. 'Start Your Architecture Modernization with Domain-Driven Discovery.' InfoQ, 2022. Uses Core Domain Charts and strategic distillation as the first step in legacy modernization.

**E-commerce Example**

In an online shop with Catalog, Cart, Order, Payment, Shipping, and Inventory domains: The Domain Vision Statement might read: 'Our core mission is personalized, AI-driven product discovery and merchandising that increases basket size. Everything else exists to enable that discovery experience.' The Highlighted Core marks the Catalog Recommendation Engine, dynamic pricing logic, and merchandising rules as core elements in the model diagrams. Cohesive Mechanisms extract the recommendation scoring algorithm (a computational mechanism) into a separate Recommendation Framework module, keeping Catalog domain classes clean and expressive. The Segregated Core moves Catalog + Pricing classes into a standalone core package, cutting compile-time dependencies on Order, Payment, and Shipping. Abstract Core defines a ProductContext interface and a PricingStrategy abstraction at the top of the hierarchy so that multiple regional bounded contexts (EU Catalog, APAC Catalog) can share the abstraction without coupling to each other's implementations.

**Common Mistake**

Teams treat the Domain Vision Statement as a one-time kick-off exercise — writing a one-pager in the first sprint and never updating it. As the domain evolves and competitive pressures shift (e.g., the core competitive advantage moves from catalog to fulfillment speed), the stale statement continues to misdirect team investment toward the wrong area. The Vision Statement is a living document that must be revisited at each major strategic pivot; neglecting this update loop defeats its entire purpose.

**Anti-Pattern**

Investment Inversion (unnamed in literature but described in Evans Ch.15 and elaborated by Khononov 2021): spending the most engineering effort on Generic Subdomains (authentication, email, PDF generation) while the Core Domain receives mediocre attention. This is the logical inverse of what distillation prescribes. Khononov (2021) names the failure mode explicitly: treating every subdomain as equally strategic leads to commodity work crowding out differentiation. Related named anti-pattern: Big Ball of Mud — when the Segregated Core is never established, core logic entangles with generic and supporting code until the model collapses into an undifferentiated mass (Foote and Yoder, 1999, referenced in Evans Ch.15 context).

**Event Storming / EDA Connection**

In Big Picture Event Storming, the Highlighted Core technique has a direct visual analogue: facilitators use pink hotspot stickies and gold/yellow actor cards to mark the highest-value, highest-contention areas of the timeline — these correspond to Core Domain events. When the storming board is analyzed, the dense cluster of domain events, commands, and policies with the most hotspot flags (pain points) is a strong signal of where the Core Domain lies. The Domain Vision Statement is often drafted immediately after a Big Picture session to crystallize the emerging shared understanding. In EDA terms, Core Domain events (e.g., OrderPlaced, RecommendationGenerated) are the ones that downstream consumers most care about, and the Segregated Core ensures these events originate from clean, well-modeled aggregates rather than tangled shared code.

**Contested Interpretations**

The primary contested area is between Evans (2003) and Khononov (2021) on the granularity of the distillation ladder. Evans treats all five tools as a continuous escalation within a single system, where teams choose how deeply to invest. Khononov simplifies this into a three-tier model (Core, Supporting, Generic) and emphasizes the build/buy/outsource decision as the primary strategic outcome — he does not discuss Cohesive Mechanisms or Abstract Core as named patterns, effectively de-emphasizing the structural refactoring tools. Vernon (2013) largely follows Evans but focuses more on Bounded Context boundaries as the primary isolation mechanism rather than the Segregated Core package restructuring. A practical disagreement exists over whether Segregated Core vs. separate Bounded Context is the right isolation move — Evans suggests Segregated Core when a full context split is too costly; Vernon and Khononov tend to push for full context separation as the default.

**Thai Audience Note**

Thai architects from traditional 3-tier or SOA backgrounds are accustomed to organizing code by technical layer (Controller / Service / DAO) rather than by domain significance. The concept of a 'Segregated Core' — physically separating domain-important classes from domain-generic classes within the same application — translates poorly because their existing mental model has no equivalent of 'this code matters more to the business than that code.' They may also conflate the Domain Vision Statement with a project charter or scope document (used heavily in Thai enterprise PMO governance), missing its function as a living alignment tool for architectural trade-off decisions rather than a contractual scope boundary.

**Related Concepts**

- Core Domain and Subdomains
- Subdomain Types (Core, Supporting, Generic)
- Bounded Context
- Context Mapping Patterns
- Ubiquitous Language
- When to Use DDD

**Recent Developments (2020–2025)**

Since 2020, the distillation toolkit has been augmented by two complementary techniques: (1) Wardley Mapping (Simon Wardley) — used alongside Evans' Core Domain Charts to place each subdomain on a value-chain evolution axis (Genesis → Custom → Product → Commodity). This gives a quantitative signal for whether a subdomain is Core (Genesis/Custom) or Generic (Product/Commodity), making build vs. buy decisions more defensible. Susanne Kaiser (InfoQ, 2022) demonstrates this combination in 'Architecture for Flow.' (2) Core Domain Charts — a lightweight collaborative canvas introduced by the DDD Crew (post-2020) where teams plot subdomains on a 2x2 of business differentiation vs. model complexity; the upper-right quadrant is the Core Domain requiring the Segregated Core and highest team investment. These replace the informal judgment calls Evans describes with a facilitated, repeatable workshop artifact.

**Implementation Pattern**

The distillation tools map to implementation patterns as follows: Domain Vision Statement and Highlighted Core require no code change — they are documentation and modeling artifacts. Cohesive Mechanisms translate to the Strategy or Template Method pattern in code, or to a dedicated library/framework module; in a microservices architecture, a Cohesive Mechanism may become a shared library or an internal platform service. Segregated Core translates to a strict module boundary in a monolith (separate Maven module, Go package, Python package) or a dedicated microservice bounded by an anti-corruption layer. Abstract Core translates to shared kernel interfaces or event schema contracts — in an event-driven system, the Abstract Core often manifests as a canonical event schema (e.g., a Protobuf/Avro schema library) shared by Core Domain producers and multiple consumer bounded contexts. CQRS is frequently applied within the Segregated Core to keep command models expressive and query models performant without polluting the core model.

**Workshop Activity**

Big Picture Event Storming is the primary activity for discovering Core Domain boundaries (dense hotspot clusters identify the core). The DDD Starter Modelling Process (DDD Crew) includes an explicit 'Strategize' step using Core Domain Charts — a dedicated workshop canvas for classifying subdomains. The Bounded Context Canvas is used after the core is identified to document and validate the Segregated Core's responsibilities and dependencies.

**Decomposition Signal**

Signals that the Core Domain needs distillation: (1) Linguistic — ubiquitous language is unclear or contested only in a specific cluster of classes; that cluster is likely the core. (2) Organizational — senior domain experts spend all their time in one area of the codebase; that area is probably core. (3) Data-coupling — a group of entities is referenced by almost everything else in the system; those are core aggregates that should be segregated. (4) Rate-of-change — the classes that change most frequently due to business rule evolution (not infrastructure or framework updates) mark the core; a Core Domain that rarely changes is a signal the model is wrong. (5) Business risk — the areas where a bug causes immediate revenue loss or competitive disadvantage are core.

**Evolution &amp; Refactoring**

The distillation tools form an escalating refactoring roadmap for the Core Domain lifecycle: (1) Start with Domain Vision Statement — costs hours, aligns team immediately. (2) Apply Highlighted Core — costs days, makes the core visible without restructuring. (3) Extract Cohesive Mechanisms — costs weeks, reduces noise in the core model. (4) Establish Segregated Core — costs months, requires compile-time boundary enforcement and dependency cleanup; this is the canonical 'Big Refactoring' Evans warns about. (5) Introduce Abstract Core — costs months; appropriate only when multiple bounded contexts genuinely share the same abstractions. Canonical evolution signals: when the Segregated Core module starts attracting unrelated dependencies again, re-apply Cohesive Mechanism extraction; when the Abstract Core becomes unstable, split it per bounded context instead. Evans explicitly states the costs of a Segregated Core can be high and teams should not rush to it.

**Conway's Law Implication**

The Segregated Core has a direct Conway's Law implication: the team owning it should be a stream-aligned team (Team Topologies terminology) focused exclusively on Core Domain capabilities. Generic and supporting subdomains should be owned by platform or enabling teams. In Thai enterprise IT, where team boundaries are typically drawn by technical role (frontend team, DBA team, middleware team) rather than by domain value, applying Segregated Core requires an organizational redesign alongside the code restructuring. The Domain Vision Statement is a useful artifact for making the case to management: it frames why the core team needs dedicated headcount and reduced context-switching rather than being a shared resource pool.

**Data Mesh / Analytics Note**

The Segregated Core is the natural owner of Core Domain data products in a Data Mesh architecture. Because the Core Domain contains the entities with highest business value (e.g., Orders, Products, Customer Recommendations), the Segregated Core team should own the corresponding analytical data products rather than a centralized BI team. In Thai enterprises with strong BI cultures, the risk is that a centralized data warehouse team reshapes the Core Domain model to fit reporting needs, violating the Segregated Core's integrity. The Domain Vision Statement can be used to argue that the Core Domain model — not the BI schema — is the authoritative source of domain truth.

**Testing Approach**

The Segregated Core should have the highest unit test coverage in the system — these tests ARE the executable specification of business rules. Domain Vision Statement assertions can be encoded as architecture fitness functions (e.g., ArchUnit in Java, Dependency-Check in .NET) that enforce that no class outside the core package has a compile-time dependency on Core Domain internals. Cohesive Mechanisms are tested independently as library code (unit tests with algorithmic correctness focus, not domain language). Integration tests at the boundary of the Segregated Core use contract tests (Pact or schema-based) to ensure downstream bounded contexts are not silently broken when the core evolves.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) supports modeling Core Domain boundaries, subdomain types, and bounded context relationships in a code-based DSL, with generators for Context Map diagrams and PlantUML outputs. Miro and Mural provide templates for Core Domain Charts (DDD Crew canvas) and Big Picture Event Storming boards with hotspot stickers. The DDD Crew's GitHub repository (ddd-crew.github.io) hosts the official Core Domain Chart template. For enforcing Segregated Core at the code level: ArchUnit (Java), NetArchTest (.NET), and dependency-cruiser (JavaScript/TypeScript) can enforce package boundary rules as automated architectural tests.

**Legacy Modernization Relevance**

Strategic Distillation tools are the recommended starting point for brownfield DDD adoption. The Domain Vision Statement and Highlighted Core can be applied to a legacy monolith without touching any code — they create shared understanding first. The DDD Crew's Domain-Driven Discovery process (Tune, InfoQ 2022) explicitly uses Core Domain Charts as the first artifact before any code extraction. When migrating from a legacy monolith: (1) apply Highlighted Core to identify which classes are core; (2) apply Cohesive Mechanism extraction to untangle algorithms from business rules; (3) apply Segregated Core to create a module boundary inside the monolith (pre-microservices); (4) use an Anti-Corruption Layer at the boundary of the Segregated Core to isolate it from legacy code; (5) eventually extract the Segregated Core into its own deployable service (Strangler Fig). Evans' 'Getting Started with DDD When Surrounded by Legacy Systems' (Domain Language, 2013) provides the canonical guidance for this sequence.

### DDD Starter Modelling Process


**Definition**

The DDD Starter Modelling Process is a step-by-step guide created by the DDD Crew for practitioners who are new to Domain-Driven Design and unsure where to start. It provides an ordered set of collaborative activities — originally eight steps (Understand/Align, Discover, Decompose, Strategize, Connect, Organize, Define, Code), with some formulations adding Test and Document — that guide a team from understanding the business model through to a socio-technical architecture including both a domain model in code and an aligned team structure. The process is explicitly non-prescriptive: on real projects, teams switch between steps freely as new insights emerge. It covers more than the Whirlpool Process (Evans) by explicitly targeting socio-technical architecture, combining strategic and tactical DDD with organizational design.

**Primary Citation**

DDD Crew. 'Domain-Driven Design Starter Modelling Process.' GitHub / ddd-crew.github.io, 2020–present. https://ddd-crew.github.io/ddd-starter-modelling-process/ — This is a community-authored open-source resource, not a single-author book. The primary authority is the DDD Crew repository itself.

**Secondary Citations**

Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — provides complementary step-by-step framing for applying DDD strategically and tactically. InfoQ, 'Start Your Architecture Modernization with Domain-Driven Discovery,' 2022 — applies a parallel discovery-first sequence (problem framing, event storming, bounded context identification, roadmap) demonstrating alignment with the Starter Modelling Process for brownfield scenarios. Susanne Kaiser, 'Adaptive Socio-Technical Systems with Architecture for Flow: Wardley Maps, DDD, and Team Topologies,' InfoQ, 2022 — extends the process with Wardley Mapping and Team Topologies integration.

**E-commerce Example**

An online shop team new to DDD applies the process as follows: (1) Understand — map the business model: revenue from Catalog sales, key partners are logistics providers, key activities are merchandising and order fulfilment. (2) Discover — run a Big Picture Event Storming across the full purchase flow: ProductViewed, ProductAddedToCart, OrderPlaced, PaymentProcessed, InventoryReserved, ShipmentDispatched, DeliveryConfirmed. (3) Decompose — identify sub-domains: Catalog, Cart, Order, Payment, Inventory, Shipping. (4) Strategize — classify: Order+Payment = Core Domain (competitive advantage), Catalog = Supporting, Shipping = Generic (use third-party). (5) Connect — map relationships: Order context publishes OrderPlaced event consumed by Payment, Inventory, and Shipping contexts; Payment uses ACL to integrate with external payment gateway. (6) Organize — align teams: one stream-aligned team per Core/Supporting context, enabling team for infrastructure, Shipping as a platform team consuming a logistics SaaS. (7) Define — complete Bounded Context Canvases for each context, specifying responsibilities, ubiquitous language, inbound/outbound events. (8) Code — implement aggregates (Order, Payment, Shipment) with domain events using CQRS where appropriate.

**Common Mistake**

Treating the process as a strict linear waterfall rather than an iterative loop. The DDD Crew explicitly states that the sequential presentation is a simplification to reduce cognitive load for beginners, and that on real projects teams constantly revisit earlier steps as new domain understanding emerges. Teams that complete Step 8 (Code) and consider themselves done — without looping back to update their event storm, bounded context canvases, or team structure as the domain evolves — lose the adaptive, knowledge-crunching benefit that DDD provides. The model should continuously reflect the team's current understanding.

**Anti-Pattern**

Process Theatre — going through all eight steps of the Starter Modelling Process as a documentation exercise without genuine domain expert participation, producing artefacts (event storm photos, bounded context canvases, context maps) that are immediately shelved and never referenced during implementation. The result is a waterfall with DDD branding: a big up-front design that does not inform the code. This is related to the broader anti-pattern of 'Model Drift' where the conceptual model (canvases, diagrams) and the code model diverge over time. The DDD Crew process is designed to prevent this by making the process iterative and the artefacts living documents, but teams that treat it as a one-time ceremony fall into this failure mode.

**Event Storming / EDA Connection**

Event Storming is the primary discovery tool used in Step 2 (Discover) of the process. A Big Picture Event Storming session maps the entire business domain with orange domain-event sticky notes, surfacing hotspots, actors, commands, policies, and read models across the timeline. The output directly feeds Step 3 (Decompose): candidate bounded context boundaries are drawn as swimlanes or vertical lines on the event storm board where language or ownership shifts. Domain Message Flow Modelling (a DDD Crew tool) is used in Step 5 (Connect) to define how bounded contexts exchange events and commands — this becomes the EDA topology for the system. The Bounded Context Canvas (Step 7 — Define) formalizes the inbound and outbound domain events for each context, giving the engineering team a precise contract for the event schema. In EDA implementation, the event storm's orange stickies map directly to domain events published on a message broker.

**Contested Interpretations**

1. Step count: The DDD Crew's own documentation has varied between 8 and 10 steps over time, with some versions including explicit Test and Document steps and others treating them as implicit. No stable canonical step list exists in a versioned release. 2. Scope vs Whirlpool Process: Evans's original Whirlpool process (domain model refinement loop) focuses purely on model-code alignment within a bounded context. The Starter Modelling Process is broader, explicitly adding organizational design (Step 6 — Organize). Some traditionalist DDD practitioners argue this scope expansion conflates software modelling with organizational change management, which requires different expertise. 3. Suitability for brownfield: The process was designed for teams new to DDD, implying a degree of greenfield thinking. Nick Tune and others (InfoQ, 2022) have adapted it for legacy modernization scenarios, but the adaptation is not part of the canonical process — it requires practitioners to layer in Strangler Fig and ACL patterns themselves.

**Thai Audience Note**

Thai enterprise IT teams in hierarchical organizations typically follow a sequential SDLC (requirements → design → build → test → deploy) mandated by governance processes. The Starter Modelling Process's explicit message that 'this linear process is not a realistic process — it is just a starting point' is difficult to communicate to PMO and audit functions that expect a traceable stage-gate. Additionally, Thai teams with a strong DBA culture will resist Step 6 (Organize) which implies each bounded context team owns its own data store — a direct conflict with centralized database governance. Facilitators should frame the process as a learning workshop first, not a project plan.

**Related Concepts**

Bounded Context, Subdomain Types, Ubiquitous Language, Context Mapping Patterns, Domain (Core/Supporting/Generic), Event Storming, Bounded Context Canvas, Domain Storytelling, Aggregate Design Canvas, When to Use DDD

**Recent Developments (2020–2025)**

Since 2021, the DDD Starter Modelling Process has been extended by the community to integrate with Team Topologies (Skelton and Pais, 2019) — Step 6 (Organize) now explicitly references stream-aligned teams, enabling teams, and platform teams. Susanne Kaiser's 2022 work on 'Adaptive Socio-Technical Systems with Architecture for Flow' (InfoQ) combines the process with Wardley Mapping to add strategic context to the Strategize step. The process has also been applied to architecture modernization discovery, where Nick Tune (IntelliJ, 2022) demonstrated adapting Steps 1–5 to brownfield discovery before any code changes. The DDD Crew GitHub repository continues to receive community contributions and the process diagram has been updated to reflect a more cyclic rather than linear flow.

**Implementation Pattern**

The process is itself a meta-pattern for choosing implementation patterns: (a) After Step 4 (Strategize), Core Domains identified as requiring high differentiation are candidates for rich domain models with aggregates, domain events, and optionally CQRS+Event Sourcing. Generic Sub-domains should use off-the-shelf software, not custom domain models. (b) Step 5 (Connect) determines whether bounded context integration uses synchronous REST/gRPC (tight coupling, simpler) or asynchronous domain events via a message broker (loose coupling, EDA). The Saga pattern (choreography vs orchestration) applies to multi-context workflows such as Order→Payment→Inventory→Shipping. (c) The Outbox Pattern is introduced at the code step when a bounded context must reliably publish domain events alongside a local database transaction — critical for the Order context publishing 'OrderPlaced' to downstream contexts.

**Workshop Activity**

Step 2 (Discover): Big Picture Event Storming. Step 3–4 (Decompose/Strategize): Core Domain Chart, Sub-domain mapping from event storm. Step 5 (Connect): Domain Message Flow Modelling (DDD Crew). Step 6 (Organize): Team Topology Canvas / organizational mapping. Step 7 (Define): Bounded Context Canvas (DDD Crew). Step 8 (Code): Design-Level Event Storming, Aggregate Design Canvas (DDD Crew). Domain Storytelling can be used at Step 2 as an alternative or complement to Event Storming for capturing business workflows narratively.

**Decomposition Signal**

The process provides signals at each step for when to proceed or loop back: (Step 2→3): Pivot events or linguistic shifts in the event storm signal bounded context candidates. (Step 3→4): Sub-domains with very different rates of change or separate team ownership signal distinct contexts. (Step 4→5): Core domains where latency or consistency requirements differ from supporting domains signal synchronous vs asynchronous integration choices. (Step 6): Conway's Law inverse — if the current team structure does not match the desired bounded context boundaries, either the team structure must change or the context boundaries should be reconsidered. The process instructs teams to detect these signals iteratively rather than to drive decomposition top-down from an architecture diagram.

**Evolution &amp; Refactoring**

The process is designed to be applied repeatedly throughout a system's lifecycle, not just at inception. As a domain grows, new sub-domains are discovered (e.g., a Reviews context splits from the Catalog context when it develops its own ubiquitous language and team ownership). The canonical DDD refactoring moves apply: Segregated Core (extracting the most domain-rich parts of an overcrowded context), Bubble Context (isolating a new clean model inside a legacy context using an ACL), and Context Split (dividing one overloaded context into two once a team scale or linguistic divergence makes the single model untenable). The Starter Modelling Process supports this by treating Steps 2–5 as recurring discovery activities — teams run a focused event storm whenever a major feature or strategic shift occurs.

**Conway's Law Implication**

Step 6 (Organize) of the process directly applies the Inverse Conway Maneuver: design the team structure to match the desired bounded context boundaries rather than letting the existing org chart determine the software architecture. Each bounded context should ideally be owned by a single stream-aligned team with end-to-end delivery responsibility. In hierarchical Thai enterprise IT departments — with separate DBA, middleware, frontend, and QA guilds — the existing team structure will produce a layered monolith regardless of how well the domain model is designed. Introducing the Starter Modelling Process in such organizations requires an explicit organizational design conversation at Step 6, not just a software architecture one.

**Data Mesh / Analytics Note**

The process does not explicitly address analytical/reporting concerns, but Step 4 (Strategize) is the natural insertion point: Core Domains that feed BI/ML pipelines should be classified accordingly and their domain events designed as first-class data products. In a Data Mesh architecture, each bounded context becomes a data domain that owns its analytical data product — the event schema defined in Step 7 (Define) via the Bounded Context Canvas becomes the contract for that data product. Thai enterprises with strong BI culture (Oracle, SAP BI) will need to explicitly model 'reporting context' as a separate bounded context that subscribes to domain events from Core and Supporting contexts rather than querying source databases directly.

**Testing Approach**

Step 8 (Code) of the process implies but does not prescribe a specific testing approach; community practice has established the following layer: (1) Aggregate unit tests — fast, in-memory tests of domain model invariants (e.g., Order cannot be placed without at least one line item). (2) Application service integration tests — test the command handler + aggregate + event publishing pipeline with an in-memory event bus. (3) Contract tests at bounded context seams — using tools such as Pact to verify that the events published by the Order context match the schema expected by the Payment context. (4) End-to-end tests — limited to critical business flows (place order, process payment, dispatch shipment) to avoid slow test suites. The Starter Modelling Process does not mandate TDD but is compatible with it; some versions list Test as a ninth step.

**Tooling &amp; DSL**

Step 2 (Discover): Miro or Mural with EventStorming sticky note templates; EventStorming.com reference cards; physical A0 paper + sticky notes for in-person workshops. Step 5 (Connect): Domain Message Flow diagram (pen-and-paper or Miro template from DDD Crew GitHub). Step 7 (Define): Bounded Context Canvas (Miro template, ddd-crew GitHub). Step 8 (Code): Context Mapper DSL (contextmapper.org) — allows teams to encode bounded contexts, context maps, and aggregates in a versioned DSL with PlantUML diagram generation; Aggregate Design Canvas (Miro template). Digital remote tooling: Miro is de facto standard; Mural, FigJam, and Conceptboard are used as alternatives.

**Legacy Modernization Relevance**

Steps 1–5 of the process have been directly adapted for brownfield architecture modernization ('domain-driven discovery'). The sequence: run a Big Picture Event Storm on the current legacy system (Step 2), identify bounded contexts hidden inside the monolith (Step 3), classify which are Core vs Generic (Step 4), map current integration points and their pain (Step 5). This produces a target architecture and a prioritized extraction roadmap. The Strangler Fig pattern implements the extraction: a new bounded context is built alongside the legacy system, with an Anti-Corruption Layer translating between the legacy data model and the new domain model. The Bubble Context pattern can be applied within the legacy monolith itself to isolate a clean model before full extraction. The Starter Modelling Process does not prescribe these patterns but provides the discovery foundation for them.

### Wardley Mapping and Core Domain Positioning


**Definition**

Wardley Mapping is a strategic management technique created by Simon Wardley (2005) that visualizes the components of a business or service on a two-dimensional map. The Y-axis (value chain) represents visibility to the end-user, anchored by user needs at the top. The X-axis (evolution axis) plots each component's maturity across four stages: Genesis (novel, uncertain, high competitive advantage), Custom-Built (understood but bespoke), Product (increasingly standardized, off-the-shelf available), and Commodity (ubiquitous utility). In the context of DDD, the evolution axis directly informs subdomain classification: Core Subdomains map to Genesis/Custom-Built (differentiating, must build in-house); Supporting Subdomains map to Custom-Built (necessary but non-differentiating); Generic Subdomains map to Product/Commodity (solved problems — buy or outsource). The technique bridges business strategy with software architecture and team design, enabling make-vs-buy-vs-outsource decisions grounded in situational awareness.

**Primary Citation**

Wardley, S. (2016). 'Wardley Maps' — serial publication on medium.com/wardleymaps; formalized technique originated at Fotango, 2005. Wikipedia: 'Wardley map' (en.wikipedia.org/wiki/Wardley_map). Kaiser, S. (2023). Adaptive Systems with Domain-Driven Design, Wardley Mapping, and Team Topologies: Architecture for Flow. Addison-Wesley Signature Series (Vernon).

**Secondary Citations**

Kaiser, S. (2022). 'Architecture for Flow with Wardley Mapping, DDD, and Team Topologies', InfoQ presentation. Kaiser, S. (2023). 'Adaptive, Socio-Technical Systems with Architecture for Flow: Wardley Maps, DDD, and Team Topologies', InfoQ article. Kaiser, S. (2022). Podcast: 'Susanne Kaiser on DDD, Wardley Mapping, and Team Topologies', InfoQ.

**E-commerce Example**

For an online shop, a Wardley Map of the business landscape might reveal: (1) The product recommendation engine and dynamic pricing algorithm sit at Genesis/Custom-Built — these are the Core Subdomains delivering competitive advantage; build in-house with senior engineers using DDD rich domain models. (2) Inventory management and order orchestration (fulfillment rules) sit at Custom-Built/early Product — Supporting Subdomains; build in-house but with lighter DDD investment. (3) Payment processing (Stripe/Adyen), authentication (Auth0), and shipping carrier APIs (FedEx/UPS) sit at Product/Commodity — Generic Subdomains; buy an off-the-shelf product or outsource entirely. The Wardley Map makes explicit what the DDD subdomain classification implies: the payment gateway is a commodity utility, not a source of competitive advantage, so building it in-house wastes strategic resource. The evolution axis triggers the build-vs-buy gate at bounded context seams.

**Common Mistake**

The most frequent misapplication is treating all systems as if they sit in Genesis — using fully custom DDD solutions (rich domain models, event sourcing, CQRS) for components that the market already commoditizes. Conversely, some teams plot their genuine Core Subdomain too far right on the evolution axis and decide to buy an off-the-shelf product, outsourcing their competitive differentiator. The Wardley mapping insight that Susanne Kaiser highlights is: if you are using internally a component in Genesis or custom-built but there is a market equivalent at Product/Commodity, your organization is less efficient — you are investing engineering capacity in non-differentiating work.

**Anti-Pattern**

Commoditized Core: positioning a genuine Core Subdomain as if it were a Generic Subdomain and replacing it with an off-the-shelf product, thus outsourcing the competitive advantage. On the opposite end, Inertia-Driven Custom Build: continuing to build components in-house that have already evolved to Product/Commodity on the market, citing historical investment as justification. Wardley names 'inertia to change caused by preexisting capital' as a distinct failure pattern with about 16 forms — the Blockbuster-vs-Netflix case illustrates how past success prevents recognition that a component has commoditized. In DDD terms, this manifests as building and maintaining bespoke implementations of authentication, email, or payment systems instead of adopting available utilities.

**Event Storming / EDA Connection**

Wardley Mapping integrates with Big Picture Event Storming: after identifying domain events, the team plots each bounded context or subdomain on a Wardley Map to assess its evolution stage. Event clusters with high hotspot density, frequent model change, and complex business rules (orange and red stickies in abundance) indicate Genesis-stage territory — Core Subdomains requiring bespoke bounded contexts with rich aggregates. Event flows dominated by integration events from third-party systems (payment webhooks, logistics callbacks) indicate Commodity-stage Generic Subdomains — these bounded contexts use Anti-Corruption Layers rather than owned aggregates. In EDA design, the evolution positioning governs event ownership: Core Subdomain contexts publish canonical domain events; Commodity contexts consume and translate external events via ACL translators. Wardley Maps thus provide the strategic view that guides which bounded contexts deserve event-sourced aggregates versus simple event consumers.

**Contested Interpretations**

There is no single authoritative mapping between DDD subdomain types and Wardley evolution stages — the correspondence (Core→Genesis/Custom, Supporting→Custom, Generic→Product/Commodity) is a practitioner heuristic synthesized by Kaiser (2023) and is not stated by Evans (2003) or Vernon (2013/2016). Evans did not know or reference Wardley Mapping. Vernon's DDD Distilled (2016) is similarly silent on Wardley. The combination is a post-2016 community synthesis. A contested point is granularity: some practitioners apply Wardley Mapping at the bounded context level, others at the component or capability level within a context, producing incompatible maps of the same system. Additionally, Simon Wardley himself cautions that evolution stage is not purely subjective — it is observable through market signals — yet many DDD practitioners plot subdomains based on perceived strategic importance alone, conflating strategic importance with evolution stage.

**Thai Audience Note**

Thai enterprise architects from traditional SOA/3-tier/CRUD backgrounds typically size all components by data volume or transaction count, not by strategic differentiation or evolution stage. Wardley Mapping requires a fundamentally different question: 'Is this a source of competitive advantage or a commodity?' — a question that SOA service decomposition never asks. Additionally, hierarchical IT departments in Thailand often have organizational inertia (Wardley's 16 inertia forms) that prevents acknowledging when internal components have commoditized, because the teams owning them would be downsized. Facilitators should address this political dimension explicitly when introducing Wardley Mapping alongside DDD.

**Related Concepts**

Subdomain Types, Strategic Distillation Tools, Context Mapping Patterns, Bounded Context, DDD Starter Modelling Process, When to Use DDD

**Recent Developments (2020–2025)**

Susanne Kaiser's 2023 book 'Adaptive Systems with Domain-Driven Design, Wardley Mapping, and Team Topologies: Architecture for Flow' (Addison-Wesley) is the canonical post-2020 synthesis formally integrating all three frameworks. The 2023 InfoQ article 'Adaptive, Socio-Technical Systems with Architecture for Flow' details the combined approach: Wardley Maps for business strategy, DDD for software design, Team Topologies for team organization. The framework gained significant traction at DDD Europe 2022-2023 conferences. A 2026 practitioner synthesis ('Build vs Buy in 2026: Using Wardley Mapping to Navigate the Agentic AI Shift') extends the framework to AI-era build-vs-buy decisions, noting that agentic AI capabilities are rapidly moving from Genesis toward Product/Commodity, requiring teams to reassess which AI capabilities to build versus adopt.

**Implementation Pattern**

The evolution axis prescribes which implementation patterns are appropriate per subdomain: (1) Genesis/Core Subdomain — Rich Domain Model with Aggregates, CQRS for read-model flexibility, Event Sourcing for auditability and temporal querying of complex business state changes. Saga choreography for process coordination where the Core Subdomain must not be tightly coupled to external systems. (2) Custom-Built/Supporting Subdomain — Transaction Script or simple Domain Model; CQRS optional if read performance demands it; no Event Sourcing unless audit trail is a business requirement. (3) Product-Commodity/Generic Subdomain — Active Record or direct ORM is sufficient; outsource to utility provider if possible, wrapping with an Anti-Corruption Layer (ACL) to prevent the vendor model from leaking into Core context. The Outbox pattern applies at Core Subdomain bounded context seams to guarantee reliable event publishing when the Core Subdomain uses Event Sourcing.

**Workshop Activity**

Big Picture Event Storming is the primary discovery activity: it surfaces domain events and hotspots that signal where complexity (and thus Core Subdomain territory) lives. After Event Storming, teams create a Wardley Map of the resulting bounded contexts — plotting each on the evolution axis using market signals (Is there an off-the-shelf product for this? Do competitors use the same solution?). The Bounded Context Canvas then documents the strategic classification (core/supporting/generic) alongside team ownership and upstream/downstream dependencies. Domain Storytelling can validate the Wardley positioning by walking through user journeys and checking whether the story changes if a commodity product replaces a candidate Generic Subdomain.

**Decomposition Signal**

Observable signals that indicate Core Subdomain / Genesis positioning: (1) Linguistic — domain experts use bespoke, specialized vocabulary with no industry-standard term (uniqueness of ubiquitous language signals differentiation). (2) Organizational — senior engineers cluster around this area; leadership closely monitors its output. (3) Data-coupling — other bounded contexts consume this context's data but not vice versa (authority gradient). (4) Rate-of-change — frequent model changes driven by business experimentation, not bug fixes. (5) Market signal — no viable off-the-shelf product exists, or available products require compromising on the distinguishing business rule. Signals pointing to Commodity/Generic positioning: the same capability is available from multiple SaaS vendors at competitive price, industry-standard APIs exist, no business stakeholder considers this a source of competitive advantage.

**Evolution &amp; Refactoring**

Wardley Mapping explicitly captures that evolution is directional and inevitable: components always move left-to-right (Genesis → Commodity) over time, never backward. This means Core Subdomain classifications are not permanent — a differentiating recommendation engine today may become a commodity AI feature next year. The canonical refactoring move is the Segregated Core: as the market catches up, extract the parts of the Core Subdomain that have commoditized into a separate bounded context, buy or outsource them, and refocus engineering investment on the remaining differentiating nucleus. Teams should treat subdomain classification as a living map reviewed quarterly or when significant market shifts occur (e.g., a competitor releasing a competing open-source solution). This lifecycle awareness distinguishes Wardley-informed DDD from static subdomain taxonomies applied once at project inception.

**Conway's Law Implication**

Wardley Mapping and Team Topologies are explicitly integrated in Kaiser's (2023) framework: once subdomains are positioned on the evolution axis, team cognitive load is allocated accordingly. Components in Genesis (Core Subdomain) require high cognitive load — teams working here need autonomy, deep domain expertise, and minimal external dependencies. Components in Commodity (Generic Subdomain) should be handled by Platform teams or outsourced, reducing cognitive load on stream-aligned teams. For Thai enterprise architects who influence org structure in hierarchical IT departments: Wardley Maps provide an objective, market-evidence-based argument for reorganizing teams around strategic value rather than technical layer (frontend/backend/DBA), making the Conway's Law inverse design argument concrete and defensible to senior management.

**Data Mesh / Analytics Note**

Wardley Mapping can position analytical capabilities alongside operational ones on the evolution axis. A Core Subdomain's operational data (e.g., proprietary recommendation signals, dynamic pricing history) also has strategic value in BI/ML pipelines — this data is in Genesis territory and should not be exposed via generic data warehouse schemas that flatten business semantics. Commodity-stage data (shipping carrier logs, payment transaction records) maps naturally to standard Data Mesh data products with well-known schemas. For Thai enterprises with strong BI culture, the Wardley Map argument is: do not model the Core Subdomain's analytical data product to fit the enterprise data warehouse schema — the strategic data is differentiating and deserves its own semantics-preserving data product boundary.

**Testing Approach**

Testing strategy follows the evolution axis: (1) Core Subdomain bounded contexts — comprehensive aggregate unit tests (domain rules at unit level), integration tests at bounded context seams, and contract tests with downstream consumers (since Core Subdomains are typically authoritative upstream contexts). Event Sourcing in Core contexts enables replay-based testing of aggregate state transitions. (2) Supporting Subdomain contexts — integration tests covering main use cases; unit tests for non-trivial business rules only. (3) Generic Subdomain / commodity integrations — test the Anti-Corruption Layer translation logic (unit tests for mappers); use consumer-driven contract tests against the external vendor API. Wardley's evolution stage governs test investment: highest test rigor on Core Subdomain, minimal on commodity wrappers.

**Tooling &amp; DSL**

Primary tooling: Online Wardley Maps (onlinewardleymaps.com) — browser-based tool for creating and sharing maps with a simple DSL. Miro and Mural have community-contributed Wardley Mapping templates. The Context Mapper DSL (contextmapper.org) covers DDD-side modeling (bounded contexts, context maps, aggregates) and can export to PlantUML; it does not directly produce Wardley Maps but is complementary for the DDD layer. Teams practicing the Kaiser (2023) framework typically run Wardley Mapping in Miro/Mural alongside Event Storming boards and Bounded Context Canvas templates. The awesome-wardley-maps GitHub repository aggregates community tools, training courses, and templates.

**Legacy Modernization Relevance**

Wardley Mapping is particularly powerful in brownfield/legacy modernization scenarios. The technique surfaces which parts of a monolith or SOA landscape are over-engineered custom solutions for commodity problems (candidates for Strangler Fig extraction + replacement with off-the-shelf products) versus which parts contain genuine Core Subdomain logic that must be carefully preserved and re-modeled. Kaiser's (2023) framework demonstrates decomposing a 'big ball of mud' monolith into bounded contexts using the map: Strangler Fig extraction priority is set by the evolution axis — extract commodity-positioned capabilities first (lower risk, available replacement), leaving Core Subdomain extraction for last (highest complexity, requires deep DDD modeling). Anti-Corruption Layers are placed at the boundary between the legacy monolith and newly extracted bounded contexts to prevent the legacy model from contaminating the new domain model.

### Conway's Law and Team Topologies Alignment


**Definition**

Conway's Law (Melvin Conway, 1968) states that organizations which design systems are constrained to produce designs which are copies of the communication structures of those organizations. In essence, the architecture of a software system reflects the social and communication boundaries of the team that built it. Team Topologies (Skelton and Pais, 2019) operationalizes this by defining four fundamental team types — Stream-Aligned, Platform, Enabling, and Complicated-Subsystem — and three interaction modes (collaboration, X-as-a-Service, facilitating) that organizations can deliberately use to shape the architecture they want. The Reverse Conway Maneuver inverts this: first determine the desired software architecture based on bounded contexts, then restructure teams to match those communication paths, allowing Conway's Law to work for the organization rather than against it.

**Primary Citation**

Conway, Melvin E. 'How Do Committees Invent?' Datamation, April 1968. Skelton, Matthew and Pais, Manuel. Team Topologies: Organizing Business and Technology Teams for Fast Flow. IT Revolution Press, 2019. Fowler, Martin. 'Conway's Law.' martinfowler.com. https://martinfowler.com/bliki/ConwaysLaw.html

**Secondary Citations**

Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — addresses how team ownership of bounded contexts prevents coupling. LeRoy, Jonny and Simons, Matt. 'Demystifying Conway's Law.' Cutter IT Journal, December 2010 — coined the term 'Inverse Conway Maneuver.' Kaiser, Susanne. 'Architecture for Flow with Wardley Mapping, DDD, and Team Topologies.' InfoQ, 2021 — integrates all three frameworks into a coherent method.

**E-commerce Example**

In an online shop, applying the Reverse Conway Maneuver means first identifying bounded contexts — Catalog, Cart, Order, Payment, Shipping, Inventory — then structuring teams to match. A Stream-Aligned Team per core context (e.g., a dedicated Order Team owning Order + Cart, a Payment Team, a Catalog Team) ensures each team can evolve its bounded context independently without coordinating across team seams for every release. The Shipping bounded context might involve a third-party logistics provider, so an Anti-Corruption Layer maintained by the Shipping Team isolates that external model. A Platform Team provides shared infrastructure (event bus, observability, authentication) consumed by all stream-aligned teams in a self-service manner. If the organization instead has a single monolithic 'Backend Team' owning all contexts, Conway's Law predicts a monolithic or tightly-coupled architecture will emerge — a Distributed Monolith if deployed as microservices.

**Common Mistake**

The most frequent misapplication is deploying microservices without first reorganizing teams to match the desired service boundaries. Organizations decompose a monolith into dozens of services but keep a single centralized 'backend team' or 'API team' owning all services. Conway's Law then recreates a tightly-coupled monolith at the service level — because the communication structure of the organization (one team, all services) mirrors into the architecture (services with shared schemas, synchronous call chains, coordinated deployments). The Reverse Conway Maneuver is skipped entirely.

**Anti-Pattern**

Distributed Monolith (also called Microlith): A system decomposed into separate services at deployment level but remaining tightly coupled in terms of shared database schemas, synchronous call chains, and coordinated release cycles. This anti-pattern arises directly from violating Conway's Law — the organizational communication structure was not redesigned to match the desired service boundaries. A single team deploying ten 'microservices' will produce ten tightly-coupled modules that must be released together — functionally a monolith. The Team Topologies framework names this as a consequence of misaligned team interaction modes.

**Event Storming / EDA Connection**

Big Picture Event Storming surfaces the organizational dimension of Conway's Law: when participants from different teams place stickies describing the same subdomain, tension and overlap become visible. Hotspot stickies (pink) explicitly mark coordination pain points that often correspond to team boundary misalignment. The output of a Big Picture Event Storming session — a bounded context map with identified actors and domain events — directly informs which stream-aligned teams to form around which event flows. EDA reinforces this: each bounded context publishes its own domain events (e.g., Order context publishes OrderPlaced), and other contexts consume them asynchronously, enabling true team independence across context seams.

**Contested Interpretations**

There is debate about how strictly bounded context boundaries should match team boundaries. Skelton and Pais (2019) state a bounded context should be owned by exactly one team, but one team may own multiple bounded contexts. Khononov (2021) agrees on single-team ownership but warns that small bounded contexts can create too many teams with high coordination overhead. Vernon (2013) emphasizes the model boundary more than the organizational boundary. A further tension: some practitioners argue that Conway's Law is descriptive (what happens) rather than prescriptive (what should happen) and warn against over-engineering org structure to match an idealized architecture that may change.

**Thai Audience Note**

Thai enterprise architects in hierarchical IT departments often encounter siloed structures organized around technical layers (DBA team, Backend team, Frontend team, QA team) rather than business domains. This directly violates the Reverse Conway Maneuver — layer-organized teams produce layer-coupled architectures (classic 3-tier), not domain-aligned services. The concept that organizational structure is a first-class architectural decision is counterintuitive for architects who treat org charts as a business/HR concern outside their scope. Additionally, Thai enterprises with strong centralized IT governance may struggle with the Platform Team model, confusing it with a traditional shared services group that becomes a bottleneck rather than a self-service enabler.

**Related Concepts**

Bounded Context, Context Mapping Patterns, Subdomain Types, Strategic Distillation Tools, Domain

**Recent Developments (2020–2025)**

In 2024-2025, the relationship between Team Topologies and microservices/DDD has been formalized as explicitly synergistic. Chris Richardson's DDD Europe 2025 presentation 'Team Topologies and the Microservice Architecture: A Synergistic Relationship' (microservices.io, June 2025) argues that bounded contexts serve as both service boundaries and team ownership boundaries, and that Team Topologies provides the organizational complement to DDD's technical modeling. In 2024, Richardson also explored modular monolith patterns for fast flow as a team-topology-aligned alternative to premature microservice decomposition. The sociotechnical design movement (2024, InfoQ) integrates Conway's Law with Domain Storytelling and DDD to co-evolve org structure and architecture together.

**Implementation Pattern**

The Reverse Conway Maneuver is itself an implementation pattern: (1) run Big Picture Event Storming to identify bounded contexts and domain events; (2) map contexts to subdomains (core/supporting/generic); (3) assign one stream-aligned team per core bounded context; (4) use asynchronous event-driven communication (Outbox pattern, event bus) between context-owning teams to eliminate synchronous coupling across team boundaries; (5) introduce a Platform Team providing the event bus, observability, and auth as self-service infrastructure. CQRS inside a bounded context is a team-local decision and does not require cross-team coordination. Saga choreography (events rather than orchestration) is preferred at team boundaries to preserve team autonomy.

**Workshop Activity**

Big Picture Event Storming is the primary activity: it makes team communication boundaries and handoff pain points visible via hotspot stickies. The Bounded Context Canvas (DDD Crew) adds a team ownership field explicitly. Domain Message Flow Modeling surfaces inter-team event flows. Team Topologies also defines its own 'Team Interaction Modeling' workshop that can be layered on top of Event Storming outputs.

**Decomposition Signal**

Key signals that team-to-context misalignment is causing architectural damage: (1) Linguistic: different teams use the same word ('Product', 'Customer') to mean different things and argue about the canonical definition — indicates no bounded language boundary. (2) Organizational: multiple teams must approve or deploy together for a single business feature — indicates team boundaries cut across bounded contexts. (3) Data coupling: teams share a database schema or must coordinate schema migrations — direct Conway's Law violation. (4) Rate-of-change: a context that changes frequently is co-owned with a stable context, forcing slow teams to block fast ones.

**Evolution &amp; Refactoring**

Team-context alignment must be re-evaluated whenever the organization reorganizes (mergers, reorgs, outsourcing). A common evolution path: start with a modular monolith where one team owns all modules but enforces internal bounded context boundaries via package/module structure; as the team grows or contexts become large enough to warrant separate deployment, extract bounded contexts into separate services and simultaneously spin up new stream-aligned teams. The Strangler Fig pattern applied at the service extraction level tracks directly to Conway's Law — each extracted service should be handed to a newly formed or re-scoped team at the same time, not after.

**Conway's Law Implication**

Conway's Law is itself the core subject of this item. Its direct implication for Thai enterprise architects is that reorganizing IT departments around business domains (not technical layers) is a prerequisite to achieving domain-aligned microservices. Without the organizational change, the technical architecture reverts to a monolith regardless of how many services are deployed. The Reverse Conway Maneuver gives architects a concrete lever: propose the desired software architecture first, then use it to justify the org restructuring to management.

**Data Mesh / Analytics Note**

Data Mesh applies Conway's Law explicitly to analytical data: each domain team (stream-aligned team) owns its own data products, including analytical datasets, rather than a central data warehouse team owning all data. This mirrors the Reverse Conway Maneuver at the data layer. For Thai enterprises with strong centralized BI culture, this is a significant shift: the BI/data warehouse team becomes a Platform Team providing tooling (query engines, pipelines), while stream-aligned domain teams produce and publish their own domain data products.

**Testing Approach**

Contract testing (e.g., Pact) at bounded context seams enforces that team-to-team integration contracts are explicit and tested independently of the consuming team's release cycle. Each stream-aligned team owns its own test suite (unit, integration, component) within its bounded context. Cross-team integration is tested via consumer-driven contract tests published by downstream teams and verified by upstream teams in CI. This aligns test ownership with team ownership, preventing shared integration test suites that create coordination overhead.

**Tooling &amp; DSL**

Context Mapper (contextmapper.org) is a DSL and IDE tooling set for modeling bounded contexts and context maps, with generators for Team Topologies diagrams. Miro and Mural provide EventStorming and Bounded Context Canvas templates. The Team Topologies book authors provide a Team Topologies diagramming notation. IntelliJ IDEA and VS Code support Context Mapper via plugins. For CI-level validation of team-context alignment, architecture fitness functions (ArchUnit for Java, NetArchTest for .NET) can enforce that code modules corresponding to different bounded contexts do not import from each other.

**Legacy Modernization Relevance**

For Thai enterprise architects facing brownfield SOA or monolith modernization, Conway's Law provides a diagnostic tool: map the current org chart alongside the current architecture diagram and observe the isomorphism. The Strangler Fig pattern for legacy extraction should always be paired with a team topology change — extracting the Catalog service from the monolith is only durable if a dedicated Catalog Team simultaneously takes ownership. Without the team change, the extracted service drifts back toward the monolith as the single 'backend team' continues to couple it. Anti-Corruption Layers at the boundary between the legacy monolith and new services correspond to the boundary between old team responsibilities and new stream-aligned team ownership.

## Tactical Design


### Entity


**Definition**

An Entity is an object fundamentally defined not by its attributes, but by a thread of continuity and identity. Entities have a distinct identity that runs through time and different representations. Two entities may have identical attribute values yet remain distinct because their identity—typically represented by a unique identifier—is the source of equality, not their current state. Entities are mutable over time; their attributes change while their identity remains constant.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Chapter 5: 'A Model Expressed in Software' — sections on Entities (Reference Objects), Modeling Entities, and Designing the Identity Operation. Also formalized in Evans, Eric. DDD Reference (2015), domainlanguage.com.

**Secondary Citations**

Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — covers Entity as a tactical pattern alongside Value Object and Aggregate. Khorikov, Vladimir (Enterprise Craftsmanship) — extensive blog series distinguishing Entity from Value Object by identity, mutability, and lifespan (enterprisecraftsmanship.com/posts/entity-vs-value-object-the-ultimate-list-of-differences/). Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — Chapters 5-7 cover Entity implementation with factories, repositories, and aggregate roots. Richardson, Chris. Microservices.io — aggregates and entity patterns in transactional microservices (infoq.com/articles/microservices-aggregates-events-cqrs-part-1-richardson/).

**E-commerce Example**

In an e-commerce Order domain, an Order is a canonical Entity: it is created with a unique OrderId (e.g. ORD-20240501-00123), and as it transitions through states—Pending, Confirmed, Shipped, Delivered, Cancelled—its attributes change (status, shippedAt, trackingNumber) while its identity never changes. Two orders with identical items and delivery address are nonetheless distinct entities. Similarly, a Customer entity persists with a CustomerId across address changes, email updates, and cart sessions. In contrast, a ShippingAddress or Money amount is a Value Object because it has no independent identity—if two addresses are structurally identical, they are interchangeable.

**Common Mistake**

The most frequent mistake is treating the database primary key (a persistence concern) as the domain identity. Teams assign auto-increment integer IDs from the ORM layer and conflate row identity with domain entity identity. This leaks infrastructure concerns into the domain model, prevents identity generation before persistence (e.g. for domain events emitted pre-save), and breaks identity semantics in distributed or event-sourced systems where an entity's identity must be known before it is stored. Domain identity should be generated in the domain layer (e.g. via UUID/ULID at construction time), not delegated to the database.

**Anti-Pattern**

Anemic Domain Model (Fowler, martinfowler.com/bliki/AnemicDomainModel.html): Entities become data containers—plain getter/setter objects—with all business logic pushed into service classes (Fat Service Layer). The entity technically exists with an identity, but carries no behavior, so domain rules are enforced nowhere or duplicated across services. A second related anti-pattern is Partially Initialized Entity (Khorikov, enterprisecraftsmanship.com/posts/partially-initialized-entities-anti-pattern/): repositories return entity instances with only some fields populated to optimize queries, breaking invariants because the entity cannot enforce rules it is unaware of. Both anti-patterns violate the rich domain model principle—entities should protect their own invariants through encapsulated behavior.

**Event Storming / EDA Connection**

In Design-Level EventStorming, Entities emerge most visibly as Aggregate Roots—the orange Aggregate sticky (sometimes a yellow sticky in design-level sessions) that groups Commands and Domain Events. Each Command (blue sticky) targets a specific Entity instance by its identity, and the resulting Domain Event (orange sticky) is emitted by that Entity. For example: Command 'Place Order' targets the Order entity (aggregate root) identified by its OrderId, and the entity emits 'Order Placed' domain event. In EDA event flow, Event Sourcing treats an Entity's state as a sequence of domain events replayed in order—the entity's identity is the stream key (e.g. order-ORD-123). Hot spots (pink stickies) in EventStorming often reveal places where Entity identity is ambiguous or where the wrong object was chosen as the aggregate root.

**Contested Interpretations**

Evans (2003) defines Entity primarily as an object with identity continuity, and reserves the term 'Reference Object' as an alternative name—emphasizing that identity allows shared references. Vernon (Implementing DDD, 2013) operationalizes Entity more strictly within Aggregates: every Aggregate has exactly one root Entity (the Aggregate Root), and non-root Entities inside the Aggregate boundary are local entities accessible only through the root. This is a refinement Evans does not make as explicitly. Khononov (2021) notes that in simpler subdomains (Supporting/Generic), practitioners often skip rich entity behavior entirely and use a Transaction Script or Active Record pattern—implying Entity as a rich object is a Core Domain concern, not universal. Fowler's EvansClassification (martinfowler.com) treats Entity and Value Object as a fundamental object taxonomy, without tying them specifically to Aggregate structure. The practical contested point: should all entities be made Aggregate Roots, or can entities exist inside aggregates without root status? Vernon says yes (non-root local entities); some practitioners collapse this to 'all entities are roots' for simplicity.

**Thai Audience Note**

Thai architects from SOA/3-tier/CRUD backgrounds tend to model entities as database tables with getter/setter DTOs, mapping directly to the Anemic Domain Model anti-pattern. The concept that an object 'owns its behavior' and enforces its own invariants is foreign when business logic lives in stored procedures or service layers. A second confusion: Thai enterprise systems often use composite primary keys (e.g. combination of branch code + sequence) as identity, which makes domain identity generation before persistence non-obvious. Emphasize that domain identity is a business concept (an Order Number has meaning to the business) distinct from a database surrogate key (an auto-increment integer has no business meaning).

**Related Concepts**

Value Object (contrasted by structural vs. identity equality), Aggregate (an Entity serves as Aggregate Root; the Aggregate boundary defines the consistency scope of an Entity), Repository (retrieves and persists Entities by identity), Domain Event (emitted by Entities when state changes), Ubiquitous Language (Entity names come from the Ubiquitous Language of the Bounded Context), Bounded Context (Entity definitions are context-specific—a Customer Entity in Sales differs from Customer in Shipping), Factory (responsible for constructing fully-initialized Entities that satisfy invariants).

**Recent Developments (2020–2025)**

Post-2020 community consensus has shifted toward treating Entity as a concept most valuable in the Core Domain, while using simpler patterns (Active Record, CRUD) in Supporting/Generic subdomains—reducing over-engineering. Khononov's Learning Domain-Driven Design (2021) explicitly maps tactical pattern choice (Entity vs. simpler patterns) to subdomain type. The rise of Event Sourcing has renewed attention to how Entity identity anchors event streams: the entity's ID becomes the stream name, making identity design a first-class architectural concern with direct persistence and query implications. Spring Modulith (2022) and modular monolith patterns have reinforced that Entities should be strictly owned by a single module/bounded context, formalizing what DDD always implied but teams ignored in shared-database architectures. The DDD Crew (ddd-crew.github.io) published collaborative canvas tools (Aggregate Design Canvas, Bounded Context Canvas) post-2020 that make Entity/Aggregate boundaries explicit design artifacts.

**Implementation Pattern**

CQRS: Entity state changes are triggered by Commands; Queries read from a separate read model (projections), so the Entity's internal representation is never directly exposed for reads. This protects entity invariants and avoids leaking domain internals. Event Sourcing: The Entity's identity (ID) becomes the event stream key; state is reconstructed by replaying domain events in sequence rather than reading a current-state table. This is appropriate for entities with complex lifecycle and audit requirements (e.g. Order, Payment). Outbox Pattern: When an Entity emits domain events, the Outbox pattern ensures the event is written atomically with the state change in the same database transaction, guaranteeing at-least-once delivery to the event bus without distributed transactions. Repository Pattern: The canonical pattern for Entity persistence—a Repository provides a collection-like interface for retrieving/saving entities by identity, hiding the ORM/SQL details from the domain model.

**Workshop Activity**

Design-Level EventStorming: Entities surface as Aggregate stickies when participants group Commands and Events. The Aggregate Design Canvas (DDD Crew, ddd-crew.github.io) is the dedicated tool: it explicitly asks teams to name the aggregate root entity, define its invariants, list its commands and events, and specify its state transitions. This canvas makes Entity design a structured, team-visible artifact. Domain Storytelling can also surface entities as actors or work objects in the narrative flow.

**Decomposition Signal**

[not-applicable] Entity is a tactical pattern applied within a Bounded Context, not a boundary-drawing concept. However, signals that the wrong object was chosen as an Entity (vs. Value Object): if two instances with identical attributes must be tracked separately over time, it is an Entity. If not, it is a Value Object. A signal to split an over-loaded Entity: the entity accumulates attributes belonging to different lifecycles (e.g. Order combining payment state and shipping state) — consider extracting separate Entities or moving attributes to subordinate Value Objects.

**Evolution &amp; Refactoring**

Entities commonly start lean (few attributes, simple behavior) and accumulate state and rules as the domain is better understood. Common refactoring moves: (1) Extract Value Objects — identify attribute clusters that have no independent identity (e.g. extract Address, Money, DateRange from a bloated entity). (2) Introduce Aggregate boundary — when an Entity grows to own too many child objects, formalize the Aggregate Root contract and enforce access through the root. (3) Segregated Core — in a Core Domain with a very complex Entity, isolate it from supporting glue code so the essential model remains visible. (4) Split aggregate — when an Aggregate Root Entity becomes a bottleneck (high write contention), split into two smaller aggregates with eventual consistency between them. Entity identity design also evolves: teams often start with auto-increment IDs and later migrate to UUIDs/ULIDs to support distributed generation and event sourcing stream keys.

**Conway's Law Implication**

An Entity should be owned by exactly one team—the team responsible for the Bounded Context that defines it. When multiple teams modify the same Entity (e.g. a shared Customer record updated by Sales, Support, and Billing teams), Conway's Law predicts the entity will become structurally complex mirroring team coordination overhead. The Inverse Conway Maneuver aligns team ownership boundaries with Bounded Context (and Entity) ownership: each team owns the entities in their context. For Thai enterprise architects in hierarchical IT departments, this is significant: the DBA-owned shared schema (where all teams write to the same Customer table) is the organizational anti-pattern that DDD's Entity-per-context ownership is designed to replace.

**Data Mesh / Analytics Note**

Entities in the operational domain should not be directly exposed to analytical/BI systems. The recommended bridge is CQRS read models or domain events fed into a data platform. In a Data Mesh architecture, the Entity's domain events become the source of domain data products—each event stream (keyed by Entity identity) is the authoritative data product for that domain. For Thai enterprises with strong BI/data warehouse culture, the pattern is: Entity emits domain events → events land in a streaming platform (Kafka) → BI team consumes events → analytical models (star schema, data product) are built from events, not by querying the entity's operational database directly. This prevents BI queries from degrading transactional Entity performance and avoids coupling BI schema to operational Entity schema.

**Testing Approach**

Unit tests for Entities: test behavior through the Entity's public methods — given an initial state, when a command is applied, then the entity is in the expected state and has emitted the expected domain events. Entities should be testable without a database (no persistence in unit tests). Repository integration tests: verify that Entity identity round-trips correctly through persistence (save by ID, retrieve by ID, confirm attributes match). Invariant tests: write explicit tests for each business invariant the entity enforces (e.g. an Order entity cannot be cancelled after it is shipped). Event-sourced entity tests: use the Given/When/Then pattern — given past events, when a command is applied, then new events are emitted. Avoid testing Entities through HTTP endpoints (integration tests at the wrong layer).

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org): a DSL for expressing Bounded Contexts, Aggregates, and Entities in code; generates UML/PlantUML diagrams and PlantUML code from DSL definitions — useful for making Entity ownership and Aggregate boundaries explicit. Miro/Mural: EventStorming and Aggregate Design Canvas templates available from DDD Crew (ddd-crew.github.io) — used during workshop phases to discover and name Entities collaboratively. EventStorming.com provides digital tool recommendations. For implementation, JVM ecosystems use patterns from Vernon's IDDD samples; .NET uses Microsoft's eShopOnContainers as a reference Entity/Aggregate implementation (devblogs.microsoft.com). Spring Modulith (2022) enforces module-level Entity ownership through package conventions.

**Legacy Modernization Relevance**

In brownfield modernization (Strangler Fig pattern), identifying Entities is the first step in carving out a bounded context from a monolith. The process: identify which tables/objects in the legacy system represent Entities with their own identity lifecycle → define the Aggregate boundary around each Entity → introduce an Anti-Corruption Layer (ACL) to translate between the legacy schema's implicit entity representation and the new domain model's explicit Entity. A common challenge is that legacy monoliths use shared Customer/Product tables across all features—these must be split into context-specific Entity definitions (Customer in Sales vs. Customer in Support differ in attributes and behavior). The ACL prevents the legacy schema from polluting the new Entity model. Teams typically extract one Aggregate Root Entity at a time, leaving the rest of the monolith intact, achieving incremental modernization without a big-bang rewrite.

### Value Object


**Definition**

A Value Object is an object that represents a descriptive aspect of the domain with no conceptual identity. Value Objects are instantiated to represent elements of the design that we care about only for what they are, not who or which they are. Two Value Objects with identical attribute values are considered equal (structural equality). Value Objects must be immutable: you do not change a Value Object — you replace it with a new one. To change a value such as height, you don't change the height object; you replace it with a new one.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003, Chapter 5 (A Model Expressed in Software). Also: Fowler, Martin. 'ValueObject.' martinfowler.com. https://martinfowler.com/bliki/ValueObject.html — defines a Value Object as 'a small simple object, like money or a date range, whose equality isn't based on identity.'

**Secondary Citations**

Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — dedicates Chapter 6 to Value Objects, emphasizing measurement, quantification, or description of domain things. Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — highlights Value Objects as the antidote to Primitive Obsession, encouraging their use whenever a concept requires more than one primitive. Khorikov, Vladimir. Enterprise Craftsmanship blog (enterprisecraftsmanship.com) — extensive practical guidance on immutability, equality, and when to create Value Objects.

**E-commerce Example**

In an online shop, the Order domain is rich with Value Objects. A Money value (amount + currency code) represents a price or total — two Money instances with amount=100, currency='THB' are equal regardless of how they were created. An Address (street, city, postal code, country) on a ShippingOrder is immutable: changing a delivery address means replacing the entire Address object, not mutating its fields. A DateRange (startDate, endDate) represents a promotional window in the Catalog domain. In the Payment domain, a CardLast4 or a CurrencyAmount are Value Objects, ensuring that arithmetic is encapsulated (Money.add()) and that the compiler prevents accidentally assigning an email address to a price field. Quantity in the Cart (number + unit such as 'pcs') is another classic example — business rules about minimum quantities and discounts live inside the Value Object itself.

**Common Mistake**

Treating a Value Object as an Entity by giving it a database surrogate key or an identity field (e.g., address_id in the database). This forces reference equality instead of structural equality, pollutes the domain model with persistence concerns, and destroys the immutability guarantee. Teams from CRUD backgrounds automatically reach for an ID on every row, so every concept — including genuinely identity-free ones like Money or Address — ends up with its own table row and surrogate key, making the model needlessly complex and hiding valuable domain semantics.

**Anti-Pattern**

Primitive Obsession — the use of primitive types (string, int, decimal) to represent domain concepts that deserve their own type. For example, storing a monetary amount as a bare decimal instead of a Money value object. This scatters validation logic (is the amount positive? is the currency code a valid ISO 4217 code?) across the codebase, allows the compiler to silently accept an email string assigned to a customer-name field, and makes the model less expressive. Fowler identifies Primitive Obsession as a code smell in Refactoring (martinfowler.com/bliki/ValueObject.html). The named failure mode is 'Primitive Obsession,' and Value Objects are the prescribed remedy.

**Event Storming / EDA Connection**

In Design-Level Event Storming, Value Objects appear as the attributes carried by Domain Events (orange stickies) and Commands (blue stickies). When the facilitator asks 'what data travels with this event?', the answer is usually Value Objects: an OrderPlaced event carries a Money total, a ShippingAddress, and an OrderId. Read Models (green stickies) expose Value Objects as query results (e.g., a PriceSummary VO). Policies (purple stickies) evaluate conditions expressed in Value Object terms (e.g., 'if Discount &gt; 20%'). Value Objects also appear on Aggregate Design Canvas entries as properties of the Aggregate Root. In EDA event flows, ensuring event payloads use Value Objects (not bare primitives) makes events self-documenting and schema-validatable.

**Contested Interpretations**

Evans (2003) and Vernon (2013) agree on the core definition but differ slightly on persistence strategy: Evans allows Value Objects to be stored as database rows when sharing is needed, while Vernon strongly advocates storing Value Objects embedded in their owning Entity's row (ORM value mapping) to preserve identity-free semantics. The more contested question is whether a Value Object can have behavior beyond simple getters — Evans and Vernon both say yes (Money.add(), Address.format()), but some practitioners treat Value Objects as pure data bags (DTO-like), which Fowler and Khorikov explicitly reject as incorrect. Fowler's martinfowler.com/bliki/ValueObject.html also notes that some literature conflates 'Value Object' with the broader Java/C# concept of 'value type,' which is a language-level distinction, not a domain modeling one.

**Thai Audience Note**

Thai architects from 3-tier/CRUD backgrounds typically design every database table with an auto-increment primary key and map every row to a Java/C# object with an id field. This habit makes it almost automatic to accidentally treat Value Objects as Entities. Additionally, ORM frameworks like Hibernate/JPA in enterprise Thai projects historically required an @Id annotation on every mapped class, reinforcing the ID habit. The concept that two Money(100, 'THB') instances are interchangeable — and that this is the correct behavior, not a bug — conflicts with the reference-equality expectations from years of object-oriented development under traditional enterprise patterns.

**Related Concepts**

Entity, Aggregate, Aggregate Root, Domain Event, Ubiquitous Language, Domain, Bounded Context

**Recent Developments (2020–2025)**

Since 2020, language-native record types have become the preferred implementation vehicle for Value Objects. Java Records (GA in Java 16, 2021) and C# 9 Records (2020) provide compiler-enforced immutability and structural equality out of the box, removing the need for boilerplate equals/hashCode overrides. Khorikov's Enterprise Craftsmanship post 'C# 9 Records as DDD Value Objects' (enterprisecraftsmanship.com, 2020) argues records are better suited to DTOs than true DDD Value Objects because they lack the behavior encapsulation that domain models require — a nuanced community debate. In functional DDD (F#, Haskell, Kotlin data classes), Value Objects are the default, and the DDD community increasingly aligns on 'prefer value semantics everywhere unless identity is genuinely required.' InfoQ's 2023 article on Java Records (infoq.com/articles/exploring-java-records/) demonstrates applying Records with DDD value object semantics in Java 21 projects.

**Implementation Pattern**

Value Objects are embedded within Aggregates and Entities — they are never the Aggregate Root. The primary implementation choice is embedded persistence (ORM value type / Owned Type in EF Core / @Embeddable in JPA) rather than a separate table with a foreign key, to preserve identity-free semantics. In CQRS systems, Value Objects appear on both sides: on the Command side as input validation wrappers (a CreateOrder command wraps a Money value object, not a raw decimal), and on the Query side as read model fields. In Event Sourcing, events carry Value Objects as payload — deserialization recreates them from their constituent fields, relying on structural equality rather than identity. No Outbox or Saga pattern is specific to Value Objects; they participate in those patterns by being carried inside Domain Events and Command payloads.

**Workshop Activity**

Design-Level Event Storming — Value Objects surface when participants annotate Domain Event stickies (orange) with the data they carry. The Aggregate Design Canvas (DDD Crew, ddd-crew.github.io) has an explicit 'Handled Commands / Produced Events' section where attribute types are named, making Value Objects explicit. Value Objects also appear in Domain Storytelling when domain experts describe 'amounts,' 'addresses,' or 'date ranges' as cohesive concepts.

**Decomposition Signal**

[not-applicable] — Value Object is a tactical modeling pattern, not a boundary-drawing concept. The signal for using a Value Object (rather than a primitive) is: multiple related primitives that travel together (amount + currency), or a primitive that requires validation logic (email format), or a concept that recurs across the model and benefits from encapsulated behavior (Money.add(), Money.inCurrency()). These are code-level and model-level signals, not organizational or architectural boundary signals.

**Evolution &amp; Refactoring**

Value Objects commonly emerge through refactoring from primitives — a process Fowler calls 'Replace Primitive with Value Object' (a named refactoring in Refactoring, 2nd ed.). Teams typically start with a bare string or decimal, discover that validation is duplicated in multiple places, and extract a Value Object. Over time, behavior migrates into the Value Object (Money.add(), Money.format(), Address.isInRegion()). A related evolution is splitting a large Value Object when different parts change at different rates — for example, separating BillingAddress from ShippingAddress when the Shipping domain starts needing additional fields. In Event Sourcing systems, versioning Value Objects in event payloads requires upcasting strategies when attribute sets change.

**Conway's Law Implication**

Value Objects are an intra-team concern — they live entirely within a single Bounded Context and are owned by one team. Conway's Law does not directly affect Value Object design. However, when multiple teams share a Published Language or Open-Host Service, the shared contract often serializes Value Objects as primitive fields (JSON numbers and strings), requiring each consuming team to reconstruct Value Objects from raw data. Teams that share Value Object class libraries across context boundaries create harmful coupling — the correct practice is for each team to own its own Value Object types and translate at the context seam.

**Data Mesh / Analytics Note**

Value Objects in the operational domain model do not map directly to analytical data products. When events carrying Value Objects are consumed by a Data Mesh domain data product or a BI pipeline, the Value Object is typically flattened into its constituent columns (e.g., Money becomes amount_thb and currency_code columns). The semantic meaning encoded in the Value Object — that amount and currency are inseparable — is often lost in the analytical layer. Thai enterprise BI teams may denormalize these into separate dimensions, breaking the invariant. Documenting Value Object semantics explicitly (via Data Contracts or schema registries) is the mitigation strategy.

**Testing Approach**

Value Objects are the easiest DDD building block to unit test: they are pure, stateless, and have no dependencies. Tests verify: (1) structural equality — two instances with identical attributes are equal; (2) immutability — methods that 'change' the value return a new instance; (3) validation — constructors or factory methods reject invalid input (negative Money amount, malformed email). No mocking is needed. A test like Money(100,'THB').add(Money(50,'THB')).equals(Money(150,'THB')) is the canonical pattern. Integration tests are not needed for Value Objects themselves, only for how they persist within Aggregates.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) supports declaring Value Objects with the 'ValueObject' keyword, enabling code generation and documentation. In Java/JPA, @Embeddable + @Embedded maps a Value Object without a separate table. In C#/EF Core, OwnsOne() achieves the same. For Event Storming facilitation, the EventStorming Glossary &amp; Cheat Sheet (ddd-crew.github.io/eventstorming-glossary-cheat-sheet/) documents which stickies correspond to which DDD building blocks, including Value Objects as data payloads on event stickies. Miro and Mural both have community EventStorming templates that include Value Object annotation cards.

**Legacy Modernization Relevance**

In brownfield modernization (Strangler Fig pattern), Value Objects are one of the first and safest DDD concepts to introduce. A team can wrap a legacy string field (e.g., a VARCHAR(255) email column) in an Email Value Object inside the new service layer without touching the legacy database schema. This ACL (Anti-Corruption Layer) role — translating between the legacy primitive representation and the rich domain model — gives immediate value: centralized validation, cleaner APIs, and compiler-enforced type safety. As more of the system is extracted behind the Strangler Fig facade, Value Objects accumulate domain behavior that was previously scattered in procedural transaction scripts. This is a low-risk, high-value first step in DDD adoption for Thai enterprise brownfield projects.

### Aggregate


**Definition**

A cluster of domain objects (Entities and Value Objects) that can be treated as a single unit for the purpose of data changes. One of its members is designated the Aggregate Root — the single entry point through which all external access and modifications must occur. The Aggregate enforces invariants (business rules) that apply across its entire cluster, and it forms a transactional consistency boundary: all changes to objects within an Aggregate are committed in a single ACID transaction. No cross-aggregate transactions are permitted.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003, ch. 6 ("The Life Cycle of a Domain Object" — Aggregates, Factories, Repositories). Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013, ch. 10 ("Aggregates"). Also: Vernon, Vaughn. "Effective Aggregate Design" Parts I–III. DDD Community, 2011.

**Secondary Citations**

Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021, ch. 5 (aggregates as consistency enforcement). Richardson, Chris. "Developing Transactional Microservices Using Aggregates, Event Sourcing and CQRS." InfoQ, 2015. Hickey, James. "DDD Aggregates: Consistency Boundary." jamesmichaelhickey.com. DDD Crew. "Aggregate Design Canvas." ddd-crew.github.io.

**E-commerce Example**

In an Order domain, the Order is the Aggregate Root. It owns a collection of OrderLineItems (child Entities) and a ShippingAddress (Value Object). Rules such as 'total line items cannot exceed 50' and 'order cannot be confirmed if payment has not been captured' are invariants enforced by the Order root. External code (e.g., the Cart service) never modifies OrderLineItem directly — it calls Order.addItem() or Order.removeItem(). The Payment aggregate is separate: an Order references a PaymentId (identity reference only, never a direct object link), and eventual consistency via domain events bridges the two aggregates when payment status changes.

**Common Mistake**

Making Aggregates too large. Developers often lump every related entity into one Aggregate (e.g., Order + Customer + Product + Inventory in a single cluster) to avoid eventual consistency. This creates wide transactional locks, frequent optimistic concurrency conflicts in multi-user scenarios, and performance bottlenecks. Vernon's rule is: design Aggregates small — one entity is the minimum viable Aggregate. Use eventual consistency (domain events) to coordinate across Aggregate boundaries rather than widening the transaction.

**Anti-Pattern**

God Aggregate: a single large Aggregate that accumulates responsibility for too many invariants, causing lock contention, deployment coupling, and a bloated domain model. Described implicitly in Vernon (2011) Parts I–III as the starting failure mode practitioners reach for. Related: Anemic Domain Model (Fowler, martinfowler.com/bliki/AnemicDomainModel.html) — Aggregates reduced to mere data bags with all logic pushed to services, which destroys invariant enforcement entirely. The two anti-patterns are often found together: large, anemic Aggregates that enforce nothing.

**Event Storming / EDA Connection**

In Event Storming, Aggregates appear as yellow stickies (in Design-Level EventStorming). They sit between Commands (blue) and Domain Events (orange): a Command is issued to an Aggregate, which validates invariants and emits one or more Domain Events as output. The Aggregate sticky names the consistency boundary that 'decides' whether a command succeeds or fails. In EDA, the emitted Domain Events become the async messages that flow to other Aggregates, Bounded Contexts, or read models — replacing direct cross-aggregate calls with eventual consistency. The Aggregate is therefore the central actor in the command-event cycle of Design-Level EventStorming.

**Contested Interpretations**

1. Aggregate size: Evans (2003) gives limited guidance on size; Vernon (2011/2013) advocates strongly for small aggregates (often a single entity), while some practitioners argue medium-sized aggregates are acceptable when strong consistency is a domain requirement. 2. Reference by identity vs. object reference: Vernon insists on reference-by-identity only across Aggregate boundaries. Evans is less explicit. Some teams allow in-memory object references for read paths, separating read and write models. 3. Aggregate per service vs. multiple aggregates per service: Richardson (microservices.io) allows multiple Aggregates per microservice; some strict DDD practitioners argue each microservice should own exactly one Aggregate. No consensus as of 2024.

**Thai Audience Note**

Thai architects from traditional 3-tier or SOA backgrounds often model database tables as Aggregates (one table = one entity = one Aggregate), which misses the invariant-enforcement purpose entirely. The concept of 'no cross-aggregate transactions' is jarring because enterprise SOA often relies on distributed XA transactions or stored-procedure-level joins across entities. Another common confusion: mistaking the Aggregate for a REST resource or a DTO — Aggregates are behavioral units, not data transfer shapes. The refrain 'you load and save whole Aggregates' conflicts with decades of fine-grained SQL UPDATE instincts.

**Related Concepts**

- Entity
- Value Object
- Domain
- Bounded Context
- Ubiquitous Language
- Context Mapping Patterns
- Subdomain Types

**Recent Developments (2020–2025)**

By 2024, the microservices community (Richardson, microservices.io) formally elevated the Aggregate to a first-class microservices pattern, noting it was 'ignored by most developers except DDD purists' but is central to transactional microservice design. The ExploreDDD 2024 conference highlighted that DDD domain modeling (including Aggregates) is necessary but insufficient for microservice physical design — teams must also consider network, latency, and team-ownership constraints when placing Aggregate boundaries. Additionally, the intersection of DDD Aggregates with LLMs was discussed, exploring how LLM-assisted design might help surface aggregate boundaries from natural-language domain descriptions.

**Implementation Pattern**

CQRS pairs naturally with Aggregates: the write side enforces invariants via the Aggregate Root; the read side uses denormalized projections (Read Models) built from Domain Events, bypassing Aggregate overhead. Event Sourcing stores Aggregates as an append-only sequence of Domain Events, enabling full audit trail and temporal queries — Vernon and Richardson both recommend this for Core Domain Aggregates. The Transactional Outbox pattern (microservices.io) is critical: Domain Events emitted by an Aggregate must be published to the event broker atomically with the database write; the Outbox table holds events until a relay process publishes them, preventing lost events. Saga (choreography or orchestration) coordinates multi-Aggregate workflows spanning eventual consistency boundaries.

**Workshop Activity**

Design-Level EventStorming (Brandolini): Aggregates appear as yellow stickies sandwiched between Command (blue) and Domain Event (orange) stickies. Aggregate Design Canvas (DDD Crew, ddd-crew.github.io): a structured template to define the Aggregate's name, invariants, state transitions, commands it handles, and events it emits — used after EventStorming to formalize the design. The DDD Starter Modelling Process (ddd-crew.github.io) sequences EventStorming → Domain Message Flow → Bounded Context Canvas → Aggregate Design Canvas.

**Decomposition Signal**

Aggregate boundaries should be drawn at invariant-enforcement seams. Observable signals: (1) Linguistic — domain experts say 'whenever X changes, Y must also be consistent immediately' (same Aggregate) vs. 'Y will catch up eventually' (separate Aggregates). (2) Transaction rate — two entities written together in every use case → candidate for same Aggregate. (3) Lock contention — high optimistic concurrency failures suggest Aggregate is too large; split it. (4) Organizational — if two teams own different parts of the same Aggregate, it will become a coordination bottleneck. (5) Change frequency mismatch — if sub-entities change at vastly different rates, splitting improves scalability.

**Evolution &amp; Refactoring**

Aggregates typically start too large (because requirements are uncertain) and are split over time as invariants clarify and performance issues surface. Canonical refactoring moves: (1) Extract child Entity to its own Aggregate Root — replace object reference with identity reference, introduce Domain Event for cross-Aggregate coordination. (2) Merge Aggregates — when two Aggregates are always updated together within the same transaction, merge them to eliminate dual-write risk. (3) Segregated Core — Vernon's pattern from Implementing DDD: extract a concentrated Core Domain Aggregate from a bloated model, keeping supporting concepts as a Supple Design around it. Aggregate splitting is a common trigger for introducing the Outbox pattern and Saga coordination.

**Conway's Law Implication**

Because an Aggregate enforces its own invariants and is transactionally isolated, it naturally maps to a single team's ownership. When two teams must modify the same Aggregate, Conway's Law predicts coordination overhead will degrade both the team and the model — a common sign the Aggregate boundary is drawn incorrectly. In Thai enterprise IT departments with siloed teams (ERP team, CRM team, Finance team), Aggregate boundaries that cross team boundaries manifest as constant integration conflicts. The Aggregate boundary should align with the team boundary, not the database table boundary.

**Data Mesh / Analytics Note**

Aggregates are write-side, transactional constructs — they are not analytical data products. In a Data Mesh context, Domain Events emitted by Aggregates become the source of truth for operational data products. The Aggregate's domain events are consumed by analytical pipelines (CDC, event streaming) to populate read-optimized stores (data warehouse, data lake). Care must be taken not to expose Aggregate internal state directly to BI consumers — the Aggregate boundary is preserved; only its emitted events or projected read models cross into the analytical domain. Fowler's Data Mesh Principles (martinfowler.com) align domain ownership of both operational APIs and analytical endpoints within the same bounded context.

**Testing Approach**

Aggregates are the ideal unit for domain unit tests: instantiate the Aggregate, invoke a command method, assert on emitted Domain Events or state changes — no mocks, no infrastructure. This is the canonical 'pure unit test' in DDD (Hickey, jamesmichaelhickey.com/ddd-unit-tests). Integration tests verify persistence (Repository save/load round-trip with actual DB). Contract tests at Bounded Context seams verify that Domain Events emitted by one context's Aggregate are correctly consumed by another context's event handler, without coupling internal Aggregate details.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) — allows declaring Aggregates within Bounded Contexts with explicit Root Entity, Value Objects, and Repository definitions; generates PlantUML and Service Cut diagrams. Aggregate Design Canvas (DDD Crew, ddd-crew.github.io) — Miro/Mural template for collaborative Aggregate modeling. EventStorming digital boards (Miro, Mural) — yellow sticky type for Aggregates in Design-Level sessions. Event Catalog (eventcatalog.dev) — documents Domain Events emitted by Aggregates across the system.

**Legacy Modernization Relevance**

When applying the Strangler Fig pattern (microservices.io) to extract services from a legacy monolith, the Aggregate boundary defines the extraction unit. A key first step is identifying implicit Aggregates within the monolith's data model — tables with FK relationships that are always written together form candidate Aggregates. The Anti-Corruption Layer (ACL) wraps calls to legacy systems, translating their data model into proper Aggregate commands, preventing legacy concepts from leaking into the new domain model. Evans's 'Getting Started with DDD When Surrounded by Legacy Systems' (domainlanguage.com, 2016) specifically addresses applying Aggregate patterns incrementally without a full rewrite. For Thai enterprise contexts facing COBOL-era core systems or ERP customizations, identifying Aggregate boundaries incrementally is safer than big-bang extraction.

### Repository


**Definition**

A Repository provides collection-like access to domain objects (specifically Aggregate Roots), mediating between the domain and data mapping layers. It encapsulates the set of objects persisted in a data store and the operations performed over them, providing a more object-oriented view of the persistence layer. Client objects construct query specifications declaratively and submit them to the Repository for satisfaction. Objects can be added and removed from the Repository, as they can from a simple collection of objects, and the mapping code encapsulated by the Repository will carry out the appropriate operations behind the scenes. Conceptually, a Repository simulates a collection of all the objects of a certain type — clients interact with it as if all matching objects were in memory. There is one Repository per Aggregate Root; the Repository hides all ORM and database details from the domain model.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Chapter 6: 'The Life Cycle of a Domain Object' — section on Repositories. Also formalized in Evans, Eric. DDD Reference (2015), domainlanguage.com. Fowler, Martin. Patterns of Enterprise Application Architecture. Addison-Wesley, 2002. Chapter 'Repository' (martinfowler.com/eaaCatalog/repository.html) — defines Repository as a pattern that mediates between domain and data mapping layers using a collection-like interface.

**Secondary Citations**

Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — Chapter 12 covers Repository implementation strategies including collection-oriented vs. persistence-oriented repositories. Vernon, Vaughn. Effective Aggregate Design Part II (dddcommunity.org, 2011) — establishes that persistence and retrieval always work through the Aggregate Root, directly motivating one-Repository-per-Aggregate. Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — covers Repository as a tactical pattern with guidance on when richer persistence abstraction is warranted vs. simpler data-access patterns. Khorikov, Vladimir (Enterprise Craftsmanship) — blog series on domain model separation from persistence model (enterprisecraftsmanship.com). Richardson, Chris. Developing Transactional Microservices Using Aggregates, Event Sourcing and CQRS (infoq.com, 2015) — covers Repository role when aggregates emit domain events and persist via event store.

**E-commerce Example**

In an e-commerce Order domain, an OrderRepository provides collection-like access to Order aggregates. The application service calls orderRepository.findById(orderId) to retrieve a fully-initialized Order aggregate (including its OrderLines, ShippingAddress, and Payment status), applies a domain operation such as order.cancel(), and then calls orderRepository.save(order). The repository hides whether it uses an ORM (e.g. JPA/Hibernate), a document store (MongoDB), or raw SQL — the domain service never touches a database connection. A separate ProductRepository serves the Catalog bounded context, providing findBySku() and findByCategory() operations for the Product aggregate root. The Cart bounded context has a CartRepository with findByCustomerId(). There is no shared 'GenericRepository' — each aggregate root has its own dedicated repository with query methods tailored to that aggregate's use cases.

**Common Mistake**

The most frequent mistake is creating a generic repository (IRepository&lt;T&gt;) that exposes low-level query primitives (e.g. GetAll(), Find(Expression&lt;Func&lt;T,bool&gt;&gt; predicate)) rather than domain-meaningful query methods. This forces business query logic to leak into application services or presentation layers — the caller must know how to construct the right filter expression. A Repository's query methods should speak the Ubiquitous Language (e.g. findOrdersAwaitingShipment(), findActiveCartByCustomer(customerId)) and return fully-initialized aggregates. A second common mistake is creating repositories for non-aggregate-root entities (e.g. an OrderLineRepository when OrderLine is part of the Order aggregate) — this bypasses the aggregate boundary and allows external code to modify aggregate internals without going through the root.

**Anti-Pattern**

Generic Repository Anti-Pattern: Implementing a single IRepository&lt;T&gt; base with methods like GetAll(), Add(T), Delete(T), and Find(Expression&lt;Func&lt;T,bool&gt;&gt;) that is reused across all aggregate types. This pattern — common in tutorials and scaffolding tools — exposes raw LINQ or predicate expressions to callers, leaking persistence concerns upward and producing an interface that is technically abstract but semantically meaningless in domain terms. The repository no longer speaks Ubiquitous Language and becomes a thin wrapper over the ORM with no encapsulation value. Referenced in community discussions on Enterprise Craftsmanship (enterprisecraftsmanship.com/tags/repository/). A related anti-pattern is the Partially Initialized Entity (Khorikov, enterprisecraftsmanship.com/posts/partially-initialized-entities-anti-pattern/): when a repository returns aggregate instances with only some fields loaded (for query performance), the returned aggregate cannot enforce its invariants — business rules operate on incomplete state, producing silent correctness failures.

**Event Storming / EDA Connection**

In Design-Level EventStorming, the Repository is the implicit mechanism behind every Command-Aggregate pair on the board. When a facilitator places a blue Command sticky ('Cancel Order') next to an orange Aggregate sticky ('Order'), the implied runtime flow is: (1) application service receives command, (2) Repository loads the Order aggregate by its identity, (3) aggregate executes the command and emits domain events ('Order Cancelled'), (4) Repository persists the updated aggregate and the emitted events. The Repository is the bridge between the Event Storming board's commands/events and the actual persistence substrate. In Event Sourcing architectures, the Repository replaces conventional ORM-based persistence: it loads an aggregate by replaying its stored event stream, and saves it by appending new domain events to that stream. In EDA, the Repository is also the point where the Outbox pattern is applied — ensuring domain events are written atomically with aggregate state changes before being published to the event bus.

**Contested Interpretations**

Evans (2003) introduces two repository orientations that have since diverged in practice: collection-oriented (simulates an in-memory collection; no explicit 'save' call needed — changes are tracked automatically by the ORM Unit of Work) vs. persistence-oriented (requires explicit save/update calls). Vernon (Implementing DDD, 2013) codifies this distinction explicitly in Chapter 12 and recommends collection-oriented where the ORM supports it. The contested area is whether the Repository should support queries beyond findById: Evans allows rich query methods; some practitioners (influenced by CQRS) argue that Repositories should only support loading by aggregate identity for writes, while all read queries go through a separate read model (not through the Repository at all). Fowler's PoEAA definition is broader and predates DDD, making Repository both a data access abstraction and a query mechanism. Khononov (2021) sidesteps the debate by noting that CQRS effectively deprecates the Repository as a query mechanism on the read side — read models use direct SQL or views, not repositories.

**Thai Audience Note**

Thai architects from 3-tier/CRUD and SOA backgrounds typically implement data access as a DAO (Data Access Object) or Service layer calling stored procedures — the domain objects are DTOs with no behavior. The Repository pattern is conceptually unfamiliar because it claims to be a 'collection' while actually hitting a database. Key translation friction: (1) the concept of 'loading an aggregate as a unit' is foreign when teams are used to loading individual table rows and assembling DTOs in the service layer; (2) the rule 'one Repository per Aggregate Root, not per table' conflicts with the ingrained DAO-per-table pattern; (3) Thai enterprise systems often have DBAs who own stored procedures — the Repository wrapping an ORM bypasses these stored procedures, creating organizational tension. Frame Repository as 'a DDD-aware DAO that speaks business language and returns complete business objects, not raw data rows.'

**Related Concepts**

Aggregate (Repository always corresponds to exactly one Aggregate Root — the root is the only entry point for persistence), Entity (Repositories retrieve and persist Entities by their identity), Value Object (Value Objects within an Aggregate are persisted as part of the Aggregate via its Repository — they have no independent Repository), Factory (Factories construct new Aggregate instances; Repositories retrieve existing ones — they are complementary lifecycle patterns), Domain Event (Repository persists state changes that produce domain events; in Event Sourcing, the Repository stores and replays event streams), CQRS (on the command side, Repositories load aggregates; on the query side, repositories are typically replaced by direct read models), Ubiquitous Language (Repository query method names must reflect the Ubiquitous Language — findOrdersAwaitingShipment() not GetAll()), Bounded Context (each Bounded Context defines its own Repositories; crossing context boundaries via a shared Repository is an anti-pattern).

**Recent Developments (2020–2025)**

Post-2020 community consensus has converged on two key shifts for the Repository pattern: (1) CQRS relegates Repositories to the write (command) side only — read queries bypass Repositories entirely and use purpose-built read models (raw SQL, views, materialized projections), reducing over-engineering of repository query methods; (2) Event Sourcing has produced 'Event Store Repositories' as a first-class pattern — instead of persisting aggregate state, the Repository appends domain events to an event stream and reconstructs aggregates by replaying events. The Strangler Fig pattern (microservices.io, 2023) increasingly positions the Repository as the key seam for incremental extraction: wrapping legacy data access behind a Repository interface allows the underlying storage to be migrated from a legacy schema to a new persistence model without touching the domain. The DDD Crew's Aggregate Design Canvas (ddd-crew.github.io, post-2020) makes Repository ownership explicit as a design artifact. ExploreDDD 2024 discussions (microservices.io, 2024) have noted the emerging use of Repository-like abstractions over LLM knowledge stores and vector databases, expanding the pattern beyond relational/document storage.

**Implementation Pattern**

CQRS: On the command side, the Repository loads the full Aggregate by ID, the aggregate processes the command, and the Repository persists the result. On the query side, Repositories are typically bypassed — direct SQL queries or ORM projections return DTOs or read models tailored for UI consumption, avoiding the overhead of loading full aggregates. Event Sourcing: The Repository is replaced by an Event Store Repository — save() appends new domain events to the aggregate's event stream; findById() reconstructs the aggregate by replaying events from the store. This approach is appropriate for aggregates with complex lifecycle and audit requirements (Order, Payment). Outbox Pattern: The Repository's save() operation writes aggregate state and domain events atomically in the same database transaction to an Outbox table; a separate relay process publishes events to the event bus, ensuring at-least-once delivery without distributed transactions. Specification Pattern: Complex query predicates are encapsulated as Specification objects passed to Repository query methods, keeping query logic in the domain layer (valid when not using full CQRS read separation). Repository implementations should use integration tests against a real database — mocking the repository in unit tests is appropriate for testing application services, but the repository implementation itself must be verified with actual persistence.

**Workshop Activity**

Design-Level EventStorming: Repositories surface implicitly when participants trace the flow from a blue Command sticky through an orange Aggregate sticky to a Domain Event — the facilitator can make explicit 'how does the aggregate get loaded?' to surface the Repository. The Aggregate Design Canvas (DDD Crew, ddd-crew.github.io) includes a section for Repository interface methods, making the query surface explicit. Domain Storytelling can reveal which queries the domain requires, driving Repository method naming from real use cases rather than generic CRUD.

**Decomposition Signal**

[not-applicable] Repository is a tactical pattern applied within a Bounded Context, not a boundary-drawing concept. However, a signal that Repository boundaries are wrong: if a Repository needs to load aggregates from multiple Bounded Contexts to satisfy a single operation, this indicates a missing Anti-Corruption Layer or incorrect Aggregate boundary. If multiple teams need to write through the same Repository, this is a Conway's Law signal that the Aggregate Root and its owning Bounded Context need clearer team ownership.

**Evolution &amp; Refactoring**

Repositories commonly start with a simple findById() and save() interface and accumulate query methods as use cases grow. Common refactoring moves: (1) Extract read model — when Repository query methods proliferate for reporting or list views, extract them to a separate read-model query layer (CQRS read side), leaving the Repository with only write-side aggregate loading. (2) Introduce Specification — when query predicates multiply with slight variations, consolidate them behind a Specification pattern to avoid an explosion of findByX() methods. (3) Migrate to Event Store Repository — if an Aggregate accumulates audit requirements or the team adopts Event Sourcing, the Repository's save/load implementation is replaced by event stream append/replay without changing the domain interface. (4) Anti-Corruption Layer introduction — when the legacy schema forces the Repository to perform complex mapping, introduce an explicit translation layer rather than polluting domain objects with persistence artifacts. A Repository's interface should be stable; its implementation is an infrastructure concern that can be replaced (e.g. from JPA to MongoDB) without touching domain code.

**Conway's Law Implication**

A Repository should be owned by exactly one team — the team responsible for the Bounded Context that owns the Aggregate Root. When multiple teams write through the same Repository (e.g. a shared OrderRepository used by both the Fulfillment and Billing teams), Conway's Law predicts the repository interface will grow to accommodate each team's query needs, becoming a God Repository. The correct structure is to have each Bounded Context own its Repositories, with cross-context data access mediated by domain events or Anti-Corruption Layers, not shared repositories. For Thai enterprise architects in hierarchical IT departments with DBA-owned data access layers, the Repository pattern should be positioned as the developer-side encapsulation that works alongside (not against) DBA-managed infrastructure — the Repository interface is defined by the domain team, while the implementation can defer to DBA-approved stored procedures or ORM mappings.

**Data Mesh / Analytics Note**

The Repository is a write-side operational concern and should never be used as the source for BI/analytical queries. Exposing the aggregate's transactional database through Repository-level queries for reporting creates read/write contention and couples BI schema to domain model evolution. The recommended pattern is: Repository persists aggregate state → aggregate emits domain events → events are published to a streaming platform (Kafka) → BI/ML teams consume events to build analytical read models (data warehouse, data lakehouse). In a Data Mesh architecture, the aggregate's event stream (keyed by aggregate identity) becomes the domain data product — consumers build their own projections from events rather than querying the Repository's backing store. For Thai enterprises with strong Oracle BI/SAP BI cultures, frame this as: 'the Repository feeds events to the data warehouse pipeline; it does not replace the data warehouse.'

**Testing Approach**

Unit tests for application services: mock the Repository interface (e.g. InMemoryOrderRepository) so that aggregate behavior can be tested without a database. The mock repository should return fully-initialized aggregates, not partially loaded stubs. Integration tests for Repository implementation: verify round-trip persistence — save an aggregate, retrieve it by ID, confirm all attributes and invariants are preserved. Use a real database (test container or embedded DB) — mocking the ORM in repository integration tests defeats the purpose. Contract tests at Bounded Context seams: if another context depends on aggregate state through a shared database (a code smell), introduce contract tests to detect schema breaking changes. Event Store Repository tests: given a sequence of past events, verify the repository reconstructs the aggregate correctly; given a command that produces new events, verify the events are appended correctly to the stream.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org): allows expressing Repositories in the DSL alongside Aggregates — generates documentation and PlantUML diagrams showing which Repository serves which Aggregate Root. Spring Data (JPA, MongoDB, R2DBC): provides repository interfaces that align closely with DDD Repository semantics when used with care — teams should extend only the identity-based retrieval interfaces and add domain-meaningful query methods, avoiding the full CrudRepository which exposes generic operations. EventStoreDB and Marten (.NET): purpose-built event store repositories for Event Sourcing. Miro/Mural with DDD Crew Aggregate Design Canvas template: the canvas includes a slot for Repository interface methods. Microsoft's eShopOnContainers reference architecture (devblogs.microsoft.com) provides Repository implementation examples with EF Core and DDD-aligned domain models.

**Legacy Modernization Relevance**

The Repository is the primary seam for incrementally extracting a domain model from a legacy monolith using the Strangler Fig pattern. The approach: (1) introduce a Repository interface in front of the legacy data access layer (DAO, stored procedure calls, or direct SQL) — the implementation wraps legacy persistence without changing the legacy schema; (2) the domain model is developed against the Repository interface, not the legacy schema directly; (3) the Repository implementation is migrated piece-by-piece from the legacy storage to the new persistence model (e.g. from stored procedures to JPA) without changing the domain interface; (4) an Anti-Corruption Layer within the Repository translates legacy data representations (flat rows, mixed concerns) into properly structured Aggregate instances. This approach allows the domain model to be correct by construction from day one, while legacy infrastructure is modernized incrementally. A common challenge in Thai enterprise brownfield contexts: stored procedures that span multiple business concepts must be decomposed — the Repository query methods define the correct boundaries, and stored procedures are refactored to serve those boundaries rather than driving the domain model.

### Domain Service


**Definition**

A Domain Service is a stateless operation within the domain model that expresses significant business behavior which does not naturally belong to an Entity or Value Object. When a significant process or transformation in the domain is not a natural responsibility of any single entity or value object, it is modeled as a standalone interface declared as a Service. Domain Services hold domain logic — they participate in business decisions the same way entities and value objects do — but they carry no persistent state of their own.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Chapter 5: 'A Model Expressed in Software' — section on Services: 'When a significant process or transformation in the domain is not a natural responsibility of an entity or value object, add an operation to the model as standalone interface declared as a service. Make the service stateless.' Also formalized in Evans, Eric. DDD Reference (2015), domainlanguage.com.

**Secondary Citations**

Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — covers Domain Service as a tactical pattern for cross-aggregate operations. Khorikov, Vladimir (Enterprise Craftsmanship) — 'Domain services vs Application services' (enterprisecraftsmanship.com/posts/domain-vs-application-services/) clearly delineates that domain services hold domain logic while application services orchestrate without making business decisions. Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — Chapter 7 covers Domain Services, emphasizing they should be named with Ubiquitous Language verbs and reside in the domain layer. Richardson, Chris. Microservices.io — domain services used in transactional saga patterns (infoq.com/articles/microservices-aggregates-events-cqrs-part-1-richardson/).

**E-commerce Example**

In an e-commerce domain, pricing logic that spans multiple aggregates is a canonical Domain Service example. A PricingService (or OrderPricingCalculator) computes the final price for a Cart by applying rules from PromotionPolicy (e.g. buy-3-get-1-free, coupon codes, loyalty tier discounts) against the Cart's line items. Neither the Cart entity nor the PromotionPolicy value object should own this calculation alone — Cart does not know promotion rules, and PromotionPolicy does not know the cart's structure. The Domain Service coordinates them: PricingService.calculateTotalPrice(cart, promotionPolicy) returns a Money value object representing the final amount. Other examples: FraudCheckService that evaluates an Order and Customer together to detect suspicious patterns; InventoryAllocationService that allocates stock across multiple warehouse entities based on routing rules.

**Common Mistake**

The most frequent mistake is placing application orchestration logic — loading aggregates, calling repositories, sending emails, publishing events — inside a Domain Service and calling it a 'domain' service. True Domain Services contain domain logic (business rules and decisions); they do not call repositories or send notifications. A related mistake is creating a Domain Service for every operation, including those that naturally belong to an Entity or Value Object, leading to an Anemic Domain Model where entities are mere data bags and all behavior migrates into a Fat Service Layer. The test: if the service contains a business decision (a rule the domain expert cares about), it is a Domain Service. If it merely orchestrates steps without deciding anything, it is an Application Service.

**Anti-Pattern**

Anemic Domain Model (Fowler, martinfowler.com/bliki/AnemicDomainModel.html): When Domain Services are overused, all business logic migrates out of Entities and Value Objects into service classes, leaving the domain objects as passive data bags. The entity technically exists but carries no behavior — domain rules are enforced nowhere or duplicated across services. This is contrary to object-oriented design principles. A second anti-pattern is the Fat Service Layer (also called God Service or Transaction Script Disguised as DDD): teams create one 'domain service' per use case (e.g. CheckoutService, OrderProcessingService) that does everything — loading data, applying rules, saving, notifying — yielding procedural code under a DDD veneer. Mechanical Approach to Domain Modeling (Khorikov, enterprisecraftsmanship.com/posts/mechanical-approach-to-domain-modeling/): teams create Domain Services mechanically for every operation without evaluating whether the logic belongs to an entity or value object, leading to the same fat service outcome.

**Event Storming / EDA Connection**

In Design-Level EventStorming, Domain Services often appear between a Policy sticky (lilac) and a Command sticky (blue): the Policy says 'when X event happens, apply Y promotion rule' — the Domain Service implements that rule. For example, a 'When Cart Updated' event triggers a Policy 'recalculate price', which invokes the PricingService Domain Service, which produces a 'Pricing Calculated' domain event. Domain Services frequently sit in the swim lane between Policies and Aggregates, computing values that determine which Command fires or how an Aggregate state changes. In EDA event flow, Domain Services are often stateless computors invoked synchronously within a Command Handler — they do not emit events themselves but provide computed values that the Aggregate uses before emitting its own events. Hot spots (pink stickies) in EventStorming frequently mark places where pricing, allocation, or fraud logic spans multiple aggregates — these resolve to Domain Services during Design-Level modeling.

**Contested Interpretations**

Evans (2003) states Domain Services should be stateless, but Evans himself later softened this position — 'he no longer thinks that is necessary, although it's nice if you can do it' (reported in community discussions). This creates ambiguity about whether a service that caches lookup data is still a Domain Service or must become an Application Service. Vernon (Implementing DDD, 2013) and Khorikov (Enterprise Craftsmanship) both retain statelessness as the distinguishing characteristic of Domain Services. A second contested point is the boundary between Domain Service and Application Service: Khorikov's rule is that Domain Services hold domain logic (business decisions) while Application Services orchestrate without deciding; but in practice, some operations involve both orchestration and domain logic, making the placement ambiguous. A third contested area is whether Domain Services should accept repository interfaces as constructor dependencies (to look up data during calculation) — Vernon allows this; others argue a true Domain Service should receive all needed objects as method parameters, not fetch them internally.

**Thai Audience Note**

Thai architects from SOA/3-tier/CRUD backgrounds typically model business logic as Service classes with database access — what DDD calls an Application Service or Transaction Script. They often assume any class named 'Service' is a Domain Service, and freely mix database calls, business rules, and notifications in a single service class. The critical distinction to emphasize: a Domain Service contains pure business logic expressible in Ubiquitous Language, takes domain objects as inputs, returns domain objects, and never calls a repository or sends an email. Thai teams also tend to create a Domain Service for every operation (one-class-per-use-case habit from Spring MVC @Service stereotype), leading directly to the Fat Service Layer anti-pattern. The heuristic: if you can explain what the service does to a business analyst without mentioning a database or HTTP call, it is a Domain Service candidate.

**Related Concepts**

Entity (Domain Services coordinate multiple Entities that cannot own the operation alone), Value Object (Domain Services often return Value Objects as computed results, e.g. Money, Discount), Aggregate (Domain Service operates across Aggregate boundaries where a single Aggregate cannot hold cross-aggregate rules), Application Service (contrasted: Application Service orchestrates workflow without domain decisions; Domain Service implements domain decisions without orchestration), Repository (Domain Services should not call Repositories directly — this is a key differentiator from Application Services), Ubiquitous Language (Domain Service names should be verbs from the Ubiquitous Language, e.g. PricingCalculator, FraudEvaluator, InventoryAllocator), Domain Event (Aggregates emit Domain Events after receiving results from Domain Services).

**Recent Developments (2020–2025)**

Post-2020 community thinking has become more precise about Domain Service scope. Khorikov's 'Domain model purity vs. domain model completeness (DDD Trilemma)' (enterprisecraftsmanship.com/posts/domain-model-purity-completeness/) — published and widely cited 2020-2023 — directly addresses Domain Services: the trilemma between keeping Domain Services pure (no external calls), keeping the model complete (all necessary data available), and avoiding performance pitfalls (not loading unnecessary data). The resolution pattern is injecting data into Domain Services as method parameters (passed by the Application Service), not by injecting Repository interfaces into the Domain Service. Khononov's Learning Domain-Driven Design (2021, O'Reilly) reinforced that tactical pattern choice — including when to introduce a Domain Service vs. enriching an Entity — should be driven by subdomain type (Core vs. Supporting vs. Generic). The DDD Crew (ddd-crew.github.io) Aggregate Design Canvas (post-2020) includes a prompt for identifying cross-aggregate operations, which surfaces Domain Service candidates during collaborative design sessions.

**Implementation Pattern**

Domain Services are most naturally paired with the following patterns: (1) Command Handler + Domain Service: the Application Service (Command Handler) loads aggregates via Repository, calls the Domain Service with those aggregates as parameters, and passes the result back to the Aggregate's command method — keeping the Domain Service free of infrastructure. (2) CQRS: Domain Services only participate in the Command side; Query side uses read models directly and does not pass through Domain Services. (3) Saga (Choreography vs Orchestration): In a multi-step business process (e.g. checkout), Domain Services implement individual domain decisions within each saga step; the saga orchestrator (Application Service or Process Manager) calls the Domain Service at each step. (4) Outbox: If a Domain Service's result causes a state change that triggers a Domain Event, the Outbox pattern ensures the event is written atomically with the state change. Avoid: Domain Services should not use Event Sourcing directly — they are stateless computors, not event-producing entities.

**Workshop Activity**

Design-Level EventStorming: Domain Services surface when participants notice that a Policy (lilac sticky) triggers logic that requires data from more than one Aggregate, and no single Aggregate can own the rule. The gap between a Policy and the resulting Command/Aggregate is where a Domain Service is drawn. Aggregate Design Canvas (DDD Crew, ddd-crew.github.io): the 'dependencies' section of the canvas prompts teams to identify what external information an Aggregate needs — when that information comes from another Aggregate's rule, a Domain Service is the resolution. Domain Storytelling can also reveal Domain Services when a work object flows through multiple actors applying combined rules.

**Decomposition Signal**

[not-applicable] Domain Service is a tactical pattern applied within a Bounded Context, not a boundary-drawing concept. However, signals that a Domain Service is needed (vs. enriching an Entity or Value Object): (1) the logic requires data from two or more Aggregates simultaneously to make a decision; (2) the operation has no natural 'home' in any single entity — no entity owns all the data needed; (3) the operation's name is a verb from the Ubiquitous Language that domain experts use independently of any noun (e.g. 'calculate price', 'allocate inventory', 'evaluate fraud'). Conversely, if the logic only requires data owned by a single Entity, it belongs in that Entity's method, not in a separate service.

**Evolution &amp; Refactoring**

Domain Services often start as methods in Application Services that grow too complex, prompting extraction into a separate class. Common refactoring moves: (1) Extract Domain Service — when an Application Service method contains domain logic (business decisions), extract that logic into a Domain Service; the Application Service retains only orchestration. (2) Push logic into Entity — when a Domain Service operates exclusively on one Aggregate's data, move the logic into the Aggregate's method (reversing over-extraction). (3) Introduce Specification — when a Domain Service validates complex conditions, the Specification pattern (enterprisecraftsmanship.com/posts/specification-pattern-always-valid-domain-model/) encapsulates each condition as a composable object, making the Domain Service's rule composition explicit and testable. (4) Split Domain Service — when a Domain Service accumulates unrelated responsibilities, split it into two focused services aligned with single Ubiquitous Language concepts. In legacy modernization, Domain Services are often the first DDD concept extracted from a monolith's service layer because they carry pure business logic with fewer infrastructure dependencies than Application Services.

**Conway's Law Implication**

A Domain Service that coordinates logic across multiple Aggregates within a single Bounded Context should be owned by one team — the team owning that Bounded Context. If multiple teams contribute to the same Domain Service, Conway's Law predicts it will accumulate conflicting responsibilities and become a coordination bottleneck. A problematic signal: a 'PricingService' touched by both the Catalog team (who owns product prices) and the Promotions team (who owns discount rules) — this cross-team dependency should be resolved by splitting the service or clarifying ownership. For Thai enterprise architects in hierarchical IT departments, shared Domain Services owned by a 'platform team' frequently become the organizational anti-pattern that prevents bounded context autonomy: the platform team becomes a bottleneck gating business logic changes for all consuming teams.

**Data Mesh / Analytics Note**

Domain Services are operational constructs and should not be directly exposed to analytical pipelines. The computed results of Domain Services (e.g. final order prices, allocated stock quantities) should be captured as Domain Events emitted by Aggregates after the Domain Service calculation, and those events fed into a streaming platform for analytical consumption. In a Data Mesh architecture, a Domain Service's computed result becomes part of the domain's data product only through the event stream — not by exposing the Domain Service's logic to BI tools directly. For Thai enterprises with strong BI culture, a common mistake is calling Domain Service equivalents from ETL jobs to recompute values — this creates coupling between operational domain logic and analytical infrastructure, and breaks when Domain Service logic evolves.

**Testing Approach**

Domain Services are the easiest DDD building block to unit test because they are stateless and take all inputs as method parameters. Unit test pattern: given a set of domain objects (Aggregates, Value Objects) passed as parameters, when the Domain Service method is called, then the returned value matches the expected business rule outcome — no mocks needed for pure Domain Services. If a Domain Service genuinely requires an external lookup (e.g. current exchange rate), inject an interface and mock it in tests. Avoid testing Domain Services through Application Service integration tests — test them in isolation. Property-based testing (generating random input combinations) is especially effective for pricing and allocation Domain Services where exhaustive examples are impractical.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org): Domain Services can be expressed in the DSL as service operations within a Bounded Context, making cross-aggregate dependencies explicit in a machine-readable model. Miro/Mural with DDD Crew EventStorming templates (ddd-crew.github.io): Domain Services surface as unnamed gaps between Policy stickies and Aggregate stickies during Design-Level EventStorming — naming them is a workshop output. For .NET implementations, Microsoft's eShopOnContainers (devblogs.microsoft.com) provides reference Domain Service implementations. For JVM, Vernon's IDDD sample projects show Domain Service patterns with explicit parameter injection. No dedicated tooling exists specifically for Domain Services — they are identified through collaborative modeling and implemented as simple stateless classes.

**Legacy Modernization Relevance**

In brownfield modernization using the Strangler Fig pattern, Domain Services are often the first element to extract from a legacy monolith because they contain pure business logic with fewer database and infrastructure dependencies than full Application Services. The process: identify methods in legacy service classes that contain business decisions (not just CRUD orchestration) → extract those methods into a Domain Service class → the legacy code calls the new Domain Service → progressively move the surrounding infrastructure to the new context. An Anti-Corruption Layer (ACL) is needed when the Domain Service receives inputs from the legacy system in a different shape (e.g. legacy flat price structure vs. new domain Money + Currency model). Legacy stored procedures that compute prices, tax, or allocation are canonical Domain Service candidates — extract the logic, verify with unit tests, and eliminate the stored procedure dependency over time.

### Application Service


**Definition**

An Application Service is a thin orchestration layer that coordinates domain model operations to fulfill a specific use case or user story. It contains no domain logic itself — all business decisions are delegated to the domain model (Aggregates, Entities, Domain Services). The Application Service is responsible for: (1) loading the necessary Aggregates or other domain objects from Repositories, (2) invoking domain operations on those objects, and (3) persisting changes and dispatching side effects such as publishing domain events. It defines the transaction boundary for a use case. Application Services are the entry point into the domain model from the outside world (UI, API controllers, message consumers), and they translate between external DTOs/requests and domain objects. They must not contain business-critical decisions — any such logic placed here is a signal of an Anemic Domain Model anti-pattern.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Chapter 4: 'Isolating the Domain' — defines the Application Layer as a thin layer that coordinates the application activity and delegates work to domain objects; it does not contain business rules or domain knowledge. The application layer is responsible for directing the expressive domain objects to work out problems. Also: Evans, Eric. DDD Reference (2015), domainlanguage.com — Application Layer entry: 'Defines the jobs the software is supposed to do and directs the expressive domain objects to work out problems. The tasks this layer is responsible for are meaningful to the business or necessary for interaction with the application layers of other systems.' Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013. Chapter 14: 'Application' — covers Application Services as coordinators of use cases, with one method per use case, thin by design, housing transaction control and security checks.

**Secondary Citations**

Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — Chapter on 'Tactical Design Patterns' distinguishes Application Services (orchestration, no domain logic) from Domain Services (domain logic that does not belong to a single aggregate). Khorikov, Vladimir (Enterprise Craftsmanship). 'Domain services vs Application services', 2016 (enterprisecraftsmanship.com) — clearest available definition: application services do not make business decisions; the domain model does. Execution flow: (1) retrieve data from external sources, (2) execute domain operations, (3) apply results to the outside world. Richardson, Chris. 'Developing Transactional Microservices Using Aggregates, Event Sourcing and CQRS', InfoQ, 2015 — shows Application Service (command handler) as the entry point that loads aggregate, invokes command, persists result, and publishes event.

**E-commerce Example**

In an e-commerce Order bounded context, a PlaceOrderApplicationService.placeOrder(customerId, cartId, paymentDetails) method represents a single use case. The method: (1) loads the Cart aggregate via CartRepository, (2) loads the Customer aggregate via CustomerRepository to verify shipping address and credit status, (3) calls Order.create(customer, cartItems, paymentDetails) — which is a domain factory method that enforces all business invariants such as minimum order value and payment method eligibility, (4) saves the resulting Order aggregate via OrderRepository, (5) publishes an OrderPlaced domain event to the message broker. No business decision (e.g., 'should this customer be allowed to order?') is made inside the Application Service — those rules live in the Order aggregate or a domain policy. A second Application Service method, cancelOrder(orderId, reason), handles the cancellation use case in isolation with its own transaction boundary.

**Common Mistake**

The single most frequent mistake is placing domain logic inside Application Services instead of in the domain model. Teams new to DDD gradually add 'just this one condition' or 'just this calculation' to the Application Service because it feels faster. Over time the Application Service grows into a transaction script that duplicates business rules across multiple use cases, and the domain model degrades into an Anemic Domain Model — a collection of data containers with no behavior. The distinguishing test: if a piece of code makes a business-critical decision (e.g., whether a discount applies, whether an order is allowed), it belongs in the domain model. If it only coordinates calls to objects that make those decisions, it belongs in the Application Service.

**Anti-Pattern**

Fat Service Layer (also called Transaction Script Accumulation): The Application Service accretes business logic over time, particularly conditional branching and validations that encode domain rules. Domain objects become passive data structures (Anemic Domain Model — Fowler, martinfowler.com, 2003). The Fat Service Layer anti-pattern is documented in 'Domain Driven Design and Development In Practice' (InfoQ): 'Not investing in a domain model leads to an application architecture with a Fat Service Layer and an Anemic Domain Model where facade classes start accumulating more and more business logic and domain objects become mere data carriers with getters and setters.' Martin Fowler defines the Anemic Domain Model: 'The basic symptom of an Anemic Domain Model is that it looks like the real thing with objects named after domain nouns and rich relationships, but when you look at the behavior, there is hardly any behavior on these objects, making them little more than bags of getters and setters.' (martinfowler.com/bliki/AnemicDomainModel.html)

**Event Storming / EDA Connection**

In Design-Level Event Storming, a blue Command sticky (e.g., 'Place Order') maps directly to one Application Service method. The Application Service is the code that handles the command: it receives the command DTO from the API or message consumer, loads the target Aggregate, invokes the domain operation on the Aggregate, and persists the Aggregate which then raises domain events (orange stickies in Event Storming notation). When using EDA, the Application Service also publishes those domain events to an event bus or message broker. In saga orchestration (as opposed to choreography), the Application Service acts as a saga orchestrator — it receives events, decides the next command to issue, and coordinates multi-step processes across bounded contexts. The Command Handler in CQRS (write side) is effectively an Application Service method.

**Contested Interpretations**

Evans (2003) defines the Application Layer as the layer above the Domain Layer but below the UI/Infrastructure layers, responsible for coordinating use cases with no domain logic. Vernon (2013, IDDD) largely agrees but is more explicit that each Application Service method should represent exactly one use case or command, and that Application Services handle security and transaction management. The key contested area is the scope of 'no domain logic': Vernon allows Application Services to perform input validation (syntax/structural checks like null checks), whereas Evans is less explicit. Khorikov (Enterprise Craftsmanship) distinguishes between business logic validation (domain) and input validation (application layer acceptable). Khononov (2021) frames Application Services as part of the 'Application Layer' and emphasizes their role in coordinating the port-and-adapters (Hexagonal Architecture) boundary. There is broad consensus on the core principle: no business decisions in Application Services.

**Thai Audience Note**

Thai architects from traditional 3-tier (Presentation / Business Logic / Data) or SOA backgrounds typically place all business logic in a 'Service layer' or 'Business Logic Component' that maps 1:1 to database tables. This maps most closely to the Fat Service Layer anti-pattern. The DDD split — Application Service (orchestration only) above a rich Domain Model (business logic) — feels counterintuitive because it distributes code that was previously centralized. Common confusion: 'If the Application Service does not contain business logic, what does it do?' The answer is coordination: it is the glue between the outside world and the domain, not the brain of the system.

**Related Concepts**

Domain Service (contains domain logic that does not fit a single Entity or Aggregate — distinct from Application Service which has none), Aggregate (the primary target of Application Service orchestration and transaction boundary), Repository (loaded and saved by Application Service), Domain Event (raised by Aggregates and published by Application Service to event bus), Bounded Context (each Bounded Context typically has its own Application Service layer), CQRS (Application Service = Command Handler on the write side), Saga (Application Service acts as orchestrator in long-running processes)

**Recent Developments (2020–2025)**

2022–2025: The rise of Vertical Slice Architecture (Jimmy Bogard) has led some teams to merge the Application Service and thin controller into a single 'feature slice' handler (e.g., MediatR IRequestHandler in .NET), but the same rule applies — no domain logic in the handler. The CQRS pattern has further solidified the Application Service / Command Handler identity: frameworks like Axon (Java) and MassTransit (C#) make the command handler boundary explicit. Hexagonal Architecture (Ports and Adapters) has gained adoption as the structural home for Application Services — they implement 'inbound ports' (use-case interfaces) and call 'outbound ports' (repository interfaces). The DDD Crew's Aggregate Design Canvas (2020+, ddd-crew.github.io) explicitly references Application Services as the callers of aggregate commands. Functional programming influence (2022–2025) has prompted some practitioners to represent Application Services as pure pipeline functions (Request → Effect), keeping side effects at the boundary.

**Implementation Pattern**

Transaction per Application Service method: each use case method runs in a single database transaction (begin on entry, commit on success, rollback on exception). CQRS: Application Services serve as Command Handlers (write side); Queries bypass the domain model and go directly to a read model or read database. Outbox Pattern: Application Service persists aggregate and outbox event record in the same transaction, ensuring at-least-once event delivery without distributed transactions. Saga Orchestration: Application Service acts as saga orchestrator — it coordinates multi-step cross-aggregate/cross-service workflows by issuing commands and reacting to replies, while Saga Choreography uses event-driven reactions between services with no central orchestrator. Hexagonal (Ports and Adapters): Application Service implements an inbound port interface, decoupling it from HTTP/messaging delivery mechanisms.

**Workshop Activity**

Design-Level Event Storming: Application Services become visible as the mapping from blue Command stickies to system behaviors — each Command triggers exactly one Application Service method. Bounded Context Canvas: the 'Inbound Communication' section lists the use cases that Application Services expose. Domain Storytelling: each user story step where 'the system does X' typically maps to an Application Service method call. Aggregate Design Canvas (DDD Crew, 2020+): the 'Commands' section of the canvas maps to Application Service invocations.

**Decomposition Signal**

[not-applicable] — Application Service is a tactical pattern within a Bounded Context, not a boundary-drawing concept. It does not signal where to draw boundaries; rather, it is the consequence of having drawn them. Within a bounded context, the signal that an Application Service is needed is any externally triggered use case (HTTP endpoint, message consumer, scheduled job) that requires coordinating domain objects. The signal that an Application Service is too fat (needs refactoring) is when it contains if/else branching that encodes domain rules.

**Evolution &amp; Refactoring**

Application Services start small but grow through feature accretion. The canonical refactoring when an Application Service becomes too large is to extract domain logic into Aggregates, Entities, or Domain Services — the Application Service should shrink back to pure coordination. When a use case grows complex enough to span multiple aggregates or bounded contexts, the Application Service method may be refactored into a Saga (long-running process manager). In CQRS adoption, read-only Application Service methods (queries) are extracted to dedicated Query Handlers or Query Services, leaving write Application Services to focus solely on commands. As a system evolves toward event sourcing, Application Services change from loading-updating-saving aggregates to loading an event stream, applying a command, appending new events — the coordination pattern remains the same.

**Conway's Law Implication**

Application Services map naturally to team ownership: each Bounded Context has its own Application Service layer, and the team owning the bounded context owns its Application Services. In Thai enterprise IT departments with strong functional silos (separate teams for UI, backend, database), Application Services are often designed by the 'backend team' with no visibility into domain rules — this encourages Fat Service Layer growth. Cross-functional teams (product + domain experts + engineers) co-located around a bounded context tend to produce thinner Application Services because domain experts push business rules into the domain model where they can be discussed and tested.

**Data Mesh / Analytics Note**

Application Services are not directly involved in analytical data pipelines, but they are the write-side boundary where domain events are emitted. Those domain events (emitted by Aggregates, published by Application Services) serve as the source of truth for downstream data mesh domains and BI pipelines. In organizations with strong BI culture (common in Thai enterprises), Application Services must reliably publish domain events with rich business context — not just technical change records — to enable meaningful analytical queries. The Outbox Pattern ensures events from Application Service transactions are reliably delivered to analytical consumers.

**Testing Approach**

Application Services are tested primarily with integration tests: spin up an in-memory or test database, call the Application Service method, assert on persisted state and/or published events. Unit testing Application Services in isolation (with mocked repositories and domain objects) is less valuable because the Application Service has little logic of its own — the interesting behavior lives in the domain model, which is unit-tested independently. Contract tests validate that the Application Service correctly handles the interface between the API layer and the domain. For CQRS, Command Handlers (Application Services) are integration-tested with the write model; Query Handlers are tested separately against the read model.

**Tooling &amp; DSL**

Context Mapper DSL: Application Services can be modeled as 'Application' layer entries in a Bounded Context definition, separating them from Domain and Infrastructure. MediatR (.NET) / Axon Framework (Java): provide explicit Command Handler/Application Service boundaries with built-in transaction and event bus integration. Spring @Service + @Transactional (Java): conventional annotation-driven demarcation of Application Service transaction boundaries. EventStorming boards (Miro/Mural): blue Command stickies + system response area maps directly to Application Service method signatures. Aggregate Design Canvas (DDD Crew): 'Handled Commands' section maps to Application Service entry points.

**Legacy Modernization Relevance**

In Strangler Fig migrations, Application Services are the first extraction target: define an Application Service interface that matches the use cases currently handled by the legacy monolith's fat service/facade layer, implement it against the new domain model in the strangler component, and route traffic progressively. Anti-Corruption Layer (ACL): Application Services in the new bounded context invoke an ACL adapter to translate between legacy data models and the new domain model — this keeps the domain model clean during incremental extraction. In SOA-to-DDD migrations (common in Thai enterprises), existing SOAP/REST 'service operations' map 1:1 to Application Service methods, making them a safe starting point for domain modeling conversations without disrupting the external API contract.

### Domain Event


**Definition**

A Domain Event is something that happened in the domain that the domain experts care about. It represents a fact that occurred at a specific point in time, is named in the past tense (e.g., OrderPlaced, PaymentProcessed), and is immutable once created. Domain Events are raised by aggregates to signal meaningful state changes and can be consumed in-process (for side effects within the same bounded context) or published out-of-process to other bounded contexts or systems.

**Primary Citation**

Evans, Eric. 'Domain-Driven Design Reference: Definitions and Pattern Summaries.' Domain Language, 2015. Domain Events were not formally in the original 2003 book but were added by Evans as part of his ongoing understanding of DDD. Also: Fowler, Martin. 'Domain Event.' martinfowler.com (eaaDev), 2005.

**Secondary Citations**

Vernon, Vaughn. 'Implementing Domain-Driven Design.' Addison-Wesley, 2013 (ch. 8). Richardson, Chris. 'Microservices Patterns.' Manning, 2018 (ch. 3-4) — covers Domain Events with transactional outbox. Khononov, Vlad. 'Learning Domain-Driven Design.' O'Reilly, 2021 — reinforces Domain Events as the primary integration mechanism between bounded contexts.

**E-commerce Example**

In an e-commerce system: when a customer places an order, the Order aggregate raises an OrderPlaced event containing orderId, customerId, lineItems, and totalAmount. The Inventory bounded context subscribes to this event and decrements stock (InventoryReserved). The Payment bounded context subscribes and initiates a charge (PaymentInitiated). The Shipping bounded context listens for PaymentProcessed and schedules fulfillment. Each event is named in past tense, carries a timestamp and correlation ID, and is immutable. Additional events: CartAbandoned, ProductAddedToCart, OrderShipped, OrderCancelled, RefundIssued.

**Common Mistake**

Publishing internal domain events outside the bounded context boundary that produced them. Teams often design a single domain event schema and share it across multiple bounded contexts, creating tight coupling between contexts. Internal events (e.g., OrderLineItemAdded) reflect implementation details and may change frequently; they should be translated into Integration Events (a coarser, stable contract) before crossing context boundaries. Using raw internal events as public API creates a distributed monolith in disguise.

**Anti-Pattern**

1. 'Chatty Events' / Event Granularity Explosion: raising an event for every field change rather than for meaningful business outcomes, leading to event storms that are expensive to process and difficult to reason about. 2. 'Event Sourcing Everywhere': treating event sourcing (persisting state as a sequence of events) as the default architecture for all aggregates, even where it adds complexity without benefit — flagged as an anti-pattern by Greg Young and others in the DDD community. 3. 'Shared Event Schema' (Distributed Monolith via Events): directly sharing internal domain event classes across service boundaries, recreating the coupling that bounded contexts were meant to prevent.

**Event Storming / EDA Connection**

In Event Storming, Domain Events are represented by orange sticky notes — the most fundamental element of both Big Picture and Design-Level sessions. The entire Event Storming workshop starts by identifying domain events on a timeline. In Big Picture ES, orange stickies represent business facts the entire organization cares about. In Design-Level ES, orange stickies connect to Commands (blue), Actors (yellow), Policies (purple), Read Models (green), and External Systems, revealing the full event flow. In EDA, domain events become the messages on the event bus; the Event Storming output directly maps to message topics and consumer subscriptions.

**Contested Interpretations**

1. Internal vs. Integration Events: Evans and Vernon do not sharply distinguish between Domain Events raised within an aggregate and Integration Events published across bounded contexts. Khononov (2021) and the community have clarified this distinction — internal domain events may be lightweight objects; integration events should be versioned, stable, and translated at context boundaries. 2. When to dispatch: Vernon (IDDD) advocates dispatching after the transaction commits; some practitioners argue for dispatching within the transaction using transactional outbox. Enterprise Craftsmanship recommends dispatch-after-commit for most cases. 3. Event Sourcing as default: Some practitioners conflate Domain Events with Event Sourcing; Evans explicitly clarified these are separate concerns — you can use domain events without event sourcing.

**Thai Audience Note**

Thai architects from traditional SOA/CRUD backgrounds typically think in terms of database tables and stored procedures as the source of truth. The concept of an immutable event as a first-class domain citizen — not derived from a table row — is unfamiliar. Common confusion: mistaking a database trigger or audit log entry for a domain event. The key difference is that domain events are named by the business (past-tense business vocabulary), carry business meaning, and are raised intentionally by the domain model — not as a side effect of persistence. Also, 3-tier teams often want to 'update the event' when something changes, violating immutability.

**Related Concepts**

Aggregate (events are raised by aggregates), Value Object (event payloads are typically value objects), Bounded Context (events cross context boundaries as integration events), Repository (used to load aggregates that produce events), Application Service (dispatches events after aggregate operations), Domain Service (may coordinate multi-aggregate flows triggered by events), CQRS (events update read models), Event Sourcing (aggregates stored as event streams), Saga/Process Manager (orchestrates multi-step flows via events)

**Recent Developments (2020–2025)**

2020-2025: The CNCF CloudEvents specification graduated in 2024, providing a vendor-neutral envelope standard for domain events published to cloud platforms, adopted by Azure Event Grid, Google Eventarc, and AWS EventBridge. The community has converged on separating Domain Events (internal, rich domain objects) from Integration Events (external, schema-versioned, CloudEvents-compatible). The Transactional Outbox pattern (combined with CDC tools like Debezium) has become the de-facto reliable publishing mechanism, replacing the dual-write anti-pattern. Event-driven banking architecture articles (InfoQ 2024) confirm that domain events remain the primary decoupling mechanism in cloud-native financial systems.

**Implementation Pattern**

1. Aggregate collects events internally (a list on the aggregate root), raised during command handling. 2. Application Service / Unit of Work flushes events after committing the transaction. 3. Transactional Outbox: events written atomically to an outbox table in the same DB transaction as state changes; a relay process (or CDC/Debezium) publishes them to a message broker (Kafka, RabbitMQ, SNS). 4. CQRS: published events update read-model projections asynchronously. 5. Saga/Choreography: downstream aggregates react to events to advance a multi-step business process without a central orchestrator. 6. Event Sourcing (optional): instead of current-state persistence, aggregate state is reconstructed by replaying the event stream stored in an event store.

**Workshop Activity**

Big Picture Event Storming (orange stickies are the starting point — participants write domain events before anything else). Design-Level Event Storming (orange stickies linked to commands, policies, read models to produce a detailed event flow). Domain Message Flow Modeling (DDD Crew) — maps which events flow between bounded contexts and who produces/consumes them.

**Decomposition Signal**

[not-applicable] Domain Event is a tactical pattern within a bounded context, not a boundary-drawing concept. However, at the strategic level: if two bounded contexts frequently need the same event, that shared event becomes a decomposition signal — it may indicate a missing integration context or a need for an event-driven contract between contexts.

**Evolution &amp; Refactoring**

Domain Events evolve in two main ways: (1) Schema evolution — as business requirements change, event payloads must be versioned (additive changes are safe; removing fields is breaking). Common approaches: versioned event types (OrderPlacedV2), upcasting (transforming old events to new shape on read). (2) Granularity refactoring — early models often have too fine-grained events (one per field change) or too coarse (one event per aggregate save). Refactoring toward meaningful business outcomes reduces event volume and improves consumer clarity. In Event Sourcing contexts, event schema migration is a significant maintenance burden — prefer value-object-rich events that encode business intent, not technical state snapshots.

**Conway's Law Implication**

Team boundaries should align with event producer/consumer relationships. If Team A owns the Order context that produces OrderPlaced, and Team B owns Inventory that consumes it, the event schema becomes the API contract between teams — it must be treated with the same rigor as a REST API. In hierarchical Thai IT departments with siloed teams (e.g., separate ERP, CRM, and e-commerce teams), domain events can serve as the decoupling layer, but the organizational governance for who owns and versions each event must be explicit. Without ownership clarity, event schemas become org-political battlegrounds.

**Data Mesh / Analytics Note**

Domain Events are the natural feed for analytical pipelines. In a data mesh architecture, each domain team owns both its operational events and its analytical data products derived from those events. Domain Events published to Kafka can be consumed by stream processors (Flink, Spark Streaming) to build real-time dashboards (e.g., live order funnel, revenue by SKU). CDC tools (Debezium) can capture domain events from the outbox table and route them to a data lake. Thai enterprises with strong BI culture should note that domain events provide richer business context than raw DB change logs — they carry business intent, not just data diffs.

**Testing Approach**

Unit tests: assert that a specific command on an aggregate produces the expected domain event(s) in the aggregate's uncommitted events collection — no infrastructure required (Given/When/Then on pure domain objects). Integration tests: verify that events are written to the outbox and subsequently published to the message broker. Consumer contract tests (Pact or schema registry): ensure event consumers and producers agree on the event schema. Event sourcing tests: Given a sequence of past events, When a command is applied, Then new events are produced — this pattern naturally yields a functional, side-effect-free test suite.

**Tooling &amp; DSL**

Event Storming: Miro/Mural templates (DDD Crew templates on ddd-crew.github.io) use orange sticky note conventions. Context Mapper DSL: supports defining bounded contexts and their event-based relationships. EventCatalog (open source): documents domain events, their schemas, and producer/consumer relationships. Schema registries (Confluent Schema Registry, AWS Glue Schema Registry): enforce schema compatibility for published events. Axon Framework (Java): first-class domain event support with event store, projections, and sagas. MassTransit (.NET): saga support built on domain events.

**Legacy Modernization Relevance**

Domain Events are the primary decoupling mechanism in Strangler Fig migrations. When extracting a new service from a monolith: (1) the monolith raises domain events (or a CDC tool captures DB changes and translates them into domain events via an Anti-Corruption Layer); (2) the new service subscribes to these events rather than calling the monolith directly, breaking the synchronous coupling. This approach allows incremental extraction without big-bang rewrites. In SOA-to-microservices migrations, existing SOAP/ESB message types can often be translated into domain events at the ACL boundary, preserving the meaning while changing the transport mechanism.

### Factory


**Definition**

A Factory is a mechanism for encapsulating complex creation logic and abstracting the type of a created object for the sake of a client. In Domain-Driven Design, a Factory is responsible for creating whole, internally consistent Aggregates (or complex Entities) and ensuring that all invariants are enforced atomically at the moment of creation. When creation of an object or Aggregate is itself a complex operation — one that requires knowledge of internal invariants — a Factory should be used to encapsulate that knowledge. A Factory is fundamentally distinct from a Repository: Factories make new objects (creation), while Repositories find existing objects (retrieval and reconstitution from persistence). The Factory guarantees that any object it produces is valid and fully initialized; it never returns a partially constructed object.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Chapter 6: 'The Life Cycle of a Domain Object' — section on Factories (pp. 137–157). Evans establishes that Factories are responsible for ensuring that all invariants are met for the object they create. Also formalized in Evans, Eric. DDD Reference (2015), domainlanguage.com — defines Factory as 'a mechanism for encapsulating complex creation logic and abstracting the type of a created object for the sake of a client.'

**Secondary Citations**

Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — covers Factory as a tactical building block alongside Entities, Value Objects, Aggregates, Repositories, Domain Events, Modules, and Services. Vernon notes that the car engine itself does not know how it is created; that is not its responsibility, and it would be much more complex if the engine not only had to operate but also had to create itself. Vernon, Vaughn. Effective Aggregate Design Part I (dddcommunity.org, 2011) — discusses aggregate initialization and invariant enforcement at creation time. Khorikov, Vladimir. Enterprise Craftsmanship blog — 'Partially initialized entities anti-pattern' (enterprisecraftsmanship.com) documents that Factories must always return a fully-fledged entity with all its invariants fulfilled. Nilsson, Jimmy. Applying Domain-Driven Design and Patterns — discusses Factory as a domain pattern and notes how Services, Factories, or Repositories can be injected into domain objects to support rich behavior.

**E-commerce Example**

In an e-commerce Order domain, creating a new Order is a complex operation that must enforce multiple invariants simultaneously: the customer must exist, at least one OrderLine must be present, each OrderLine must reference a valid Product with a positive quantity, and the total must not exceed any credit limit. Instead of placing this logic in the Order constructor or in an Application Service, an OrderFactory encapsulates it. The OrderFactory.create(customerId, cartItems, shippingAddress) method validates all inputs, constructs the Order aggregate with its OrderLines and initial status (PENDING), and returns a fully valid Order — or throws a domain exception if any invariant is violated. Similarly, a PaymentFactory creates a Payment aggregate from an Order, ensuring the amount matches the order total and the payment method is supported. The Inventory domain uses a StockReservationFactory to atomically create a StockReservation aggregate that links a product SKU, quantity, and order reference. None of these factories are confused with repositories: the factories create brand-new aggregates, while the corresponding repositories (OrderRepository, PaymentRepository) are used only for retrieval and persistence of existing ones.

**Common Mistake**

The single most frequent misapplication is bypassing the Factory and constructing aggregates directly in application services or controllers using raw constructors, then manually setting properties one at a time. This leads to the 'partially initialized entity' anti-pattern, where an aggregate is returned from creation code in a state where not all invariants have been checked. The client code must then 'know' the correct sequence of property assignments to reach a valid state, which scatters creation invariant logic across the codebase. A related mistake is mechanically creating a Factory class for every concept — even simple ones — without evaluating whether the constructor itself is sufficient. Evans is clear: a Factory is warranted only when object creation is itself complex and requires enforcing invariants that the object cannot enforce on its own during straightforward construction.

**Anti-Pattern**

Partially Initialized Entity (Khorikov, Enterprise Craftsmanship): An entity or aggregate that is returned from creation code without all invariants enforced, forcing calling code to complete initialization. The anti-pattern arises when Factories are absent and constructors are anemic — the object is created in an intermediate state that violates domain rules. Mechanical Factory Proliferation (Khorikov, Enterprise Craftsmanship): Automatically generating a Factory class for every entity regardless of whether construction is actually complex. This produces boilerplate infrastructure with no domain value and obscures where true complexity lies. Both anti-patterns are variants of the broader Anemic Domain Model (Fowler, martinfowler.com/bliki/AnemicDomainModel.html) where domain objects hold data but delegate all logic — including creation logic — to external services or application layers.

**Event Storming / EDA Connection**

In Event Storming (Big Picture and Design-Level), a Factory surfaces at the point where a Command triggers the creation of a new Aggregate rather than mutating an existing one. On the Design-Level Event Storming board, a 'Create Order' Command sticky (blue) that produces an 'Order Placed' Event sticky (orange) signals that the domain needs a Factory (or a named constructor on the Aggregate) to enforce creation invariants atomically. The Factory is responsible for ensuring that the resulting 'Order Placed' event represents a genuinely valid state transition — not just a structural object but a domain-meaningful occurrence. In EDA (Event-Driven Architecture) flows, Factories are typically invoked by Application Services that handle incoming Commands; the Factory returns a new Aggregate, the Aggregate raises Domain Events, and those events are dispatched to the message bus. In Event Sourcing contexts, the Factory creates the initial state of an Aggregate before any events have been applied — this is the one time a Factory is used; subsequent reconstitution from the event stream is done by the Repository replaying events, not by the Factory.

**Contested Interpretations**

Evans (2003) treats Factory as a standalone pattern — distinct classes or methods responsible solely for creation. Vernon (2013, Implementing Domain-Driven Design) largely agrees but emphasizes that a Factory can be a static factory method on the Aggregate Root itself (a named constructor), rather than always a separate Factory class. This is a practical reconciliation of Gang of Four Factory Method with DDD's Factory. The community has settled on a pragmatic position: a dedicated Factory class is warranted for complex cross-aggregate creation (e.g., creating an Order from a Cart across two aggregates); a static named constructor on the Aggregate Root is sufficient for simpler cases where creation logic is self-contained. Khononov (Learning Domain-Driven Design, O'Reilly, 2021) largely follows Vernon's pragmatic stance. There is no deep disagreement on purpose — only on whether a separate class is always required. The contested area is: when does complexity warrant a dedicated Factory object vs. a named constructor?

**Thai Audience Note**

Thai architects from traditional 3-tier or SOA backgrounds typically place all object creation in a Service Layer or DAO, using setter injection to populate domain objects after retrieval or creation. The DDD Factory concept — that creation logic belongs to the domain and must enforce invariants at the instant of construction — is counterintuitive when the mental model is 'the database is the source of truth, validation happens in the service layer.' A common Thai-context mistake is to use a Factory as a thin DTO-to-entity mapper (similar to a MapStruct converter) rather than as an invariant enforcer. The distinction to emphasize: a Factory is not a mapper; it is a domain authority on what constitutes a valid new object.

**Related Concepts**

Aggregate, Entity, Value_Object, Repository, Domain_Service, Application_Service, Ubiquitous_Language

**Recent Developments (2020–2025)**

Post-2020 DDD practice has seen a community shift away from mandatory Factory classes toward named constructors (static factory methods) directly on Aggregate Roots — reducing boilerplate while preserving the invariant-enforcement guarantee. Vladimir Khorikov's Enterprise Craftsmanship series (2020–2023) documents the 'always-valid domain model' approach, where creation invariants are enforced in constructors or named constructors, eliminating the need for a separate Factory class in many cases. The broader community consensus captured in the DDD Starter Modelling Process (ddd-crew.github.io, updated 2021–2022) treats Factory as an implementation detail that emerges from design, not a mandatory artifact to scaffold upfront. In the context of functional DDD (Scott Wlaschin, F# community), Factories are expressed as pure functions returning Result/Either types, allowing invariant failures to be expressed as typed errors rather than exceptions — an approach gaining traction in TypeScript and Kotlin DDD communities by 2022–2024.

**Implementation Pattern**

Factory is most naturally combined with CQRS: on the Command side, an Application Service receives a Create* Command, delegates to the Factory to produce a valid Aggregate, then passes the Aggregate to the Repository for persistence. The Factory never appears on the Query side. In Event Sourcing, the Factory creates the Aggregate's initial snapshot before the first event is stored; all subsequent reconstitution uses the Repository replaying the event stream — the Factory is never called during reconstitution. In Saga/Process Manager patterns, a Factory may be responsible for creating a Saga instance when a triggering event arrives, enforcing that the Saga starts in a valid initial state. In Outbox pattern implementations, the Factory creates the Aggregate (which raises Domain Events internally), and the Repository persists both the Aggregate state and the Domain Events to the outbox table atomically. CQRS is the most common pairing; Event Sourcing is the most nuanced (because Factory and reconstitution-from-events must be kept conceptually separate).

**Workshop Activity**

Design-Level Event Storming is the primary activity where Factory surfaces: when a Command produces a new Aggregate (not a state change on an existing one), the modeling team must decide whether creation complexity warrants a dedicated Factory. The Aggregate Design Canvas (ddd-crew.github.io) has a 'Creation' section explicitly for this — teams document what inputs are required to create the Aggregate and what invariants must hold at creation. Bounded Context Canvas does not surface Factory directly, but the 'Inbound Communication' section may imply creation events that lead to Factory design decisions.

**Decomposition Signal**

[not-applicable] Factory is a tactical pattern for object creation within a Bounded Context, not a boundary-drawing concept. It does not carry decomposition signals.

**Evolution &amp; Refactoring**

Factories typically emerge during refactoring, not at initial design. A common lifecycle: (1) start with a constructor, (2) creation logic grows as new invariants are discovered, (3) refactor complex constructor into a static named constructor on the Aggregate, (4) if creation requires cross-aggregate coordination or external lookups, extract into a dedicated Factory class. Evans describes this as 'reconstituting' objects — once a Factory is extracted, it can be evolved independently of the Aggregate's internal logic. In brownfield scenarios, a Factory often emerges when the team discovers that the legacy code has scattered creation logic across service classes; consolidating it into a Factory is a canonical refactoring move. Factories rarely need to be split or merged — their evolution is usually additive (new named constructors for new creation scenarios) or extraction (pulling a Factory class from an overloaded constructor).

**Conway's Law Implication**

Factory is a tactical pattern internal to a single Bounded Context; it does not directly imply team structure. However, if multiple teams share responsibility for creating a complex Aggregate (e.g., an Order that spans Catalog, Pricing, and Inventory concerns), the Factory becomes a coordination point and a potential coupling hotspot. Conway's Law implies that if the Factory must call across team-owned services to validate inputs, the team boundaries and the Factory's dependency graph will mirror each other. The resolution is to design the Factory to operate within a single team's Bounded Context, receiving pre-validated value objects from upstream contexts rather than crossing context boundaries during creation.

**Data Mesh / Analytics Note**

Factory is an operational domain pattern with minimal direct relevance to analytical/data mesh concerns. However, a Factory that enforces strict invariants at creation time produces well-structured domain events (e.g., 'OrderCreated' with all required fields) that become clean data products for downstream analytics. In data mesh terms, the operational domain's Factory output — domain events emitted when a new Aggregate is created — is the canonical source for the domain's data product. If the Factory is sloppy (creates partially initialized aggregates), the downstream analytical data product inherits the inconsistency. Thai enterprises with strong BI culture should note: Factory quality directly affects the quality of event streams that feed their data warehouse or data lake.

**Testing Approach**

Factories are among the easiest DDD building blocks to unit test because they are pure functions of their inputs: given a set of valid inputs, the Factory returns a valid Aggregate; given invalid inputs, it throws a domain exception. Unit tests should cover: (1) valid creation scenarios producing correctly initialized aggregates, (2) each invariant violation producing the expected domain exception, (3) edge cases at invariant boundaries. No mocking is typically required — Factories should not depend on infrastructure. Integration tests are needed only when a Factory delegates to a Repository or external service for lookup (which is a design smell and usually indicates the lookup should be done by the Application Service before calling the Factory). The Factory tag on Enterprise Craftsmanship documents that Factories in an always-valid domain model make unit testing straightforward because the test can trust that any object produced by the Factory is valid.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) supports modeling Aggregates and their creation operations but does not have a dedicated Factory keyword — Factories emerge from the implementation rather than the strategic model. The Aggregate Design Canvas (ddd-crew.github.io) includes a 'Creation' section where teams document Factory requirements during collaborative design sessions. EventStorming digital tools (Miro, Mural) support capturing Factory decisions as annotations on Design-Level EventStorming boards when a Command creates a new Aggregate. No dedicated Factory-specific tooling exists; it is primarily a code-level pattern. IDE templates (e.g., Resharper live templates, VS Code snippets) are commonly used to scaffold Factory classes in .NET, Java, and TypeScript DDD projects.

**Legacy Modernization Relevance**

In brownfield legacy modernization (Strangler Fig pattern), Factories are critical for establishing the Always-Valid Domain Model constraint as new services are extracted from a legacy monolith. Legacy systems typically create domain objects through anemic setter-based code scattered across service layers; introducing a Factory in the extracted service consolidates invariant enforcement. The Anti-Corruption Layer (ACL) pattern, which translates legacy data structures into new domain concepts, often delegates to a Factory to produce valid Aggregates from translated inputs. This is particularly relevant when migrating from CRUD-based SOA systems: the ACL receives the legacy DTO, translates fields, and passes them to the Factory, which enforces invariants and creates a valid Aggregate. The Factory becomes the 'quality gate' that prevents legacy data inconsistencies from polluting the new domain model. Enterprise Craftsmanship's course 'Domain-Driven Design: Working with Legacy Projects' addresses exactly this pattern.

### Specification Pattern


**Definition**

The Specification Pattern is a software design pattern whereby a piece of domain knowledge — a business rule or query criterion — is encapsulated into a single reusable unit called a Specification. Each specification exposes an IsSatisfiedBy predicate that returns a Boolean, and specifications can be composed using Boolean logic (And, Or, Not) to form complex rules from simpler parts. Evans and Fowler describe it as both an analysis pattern (capturing how stakeholders think about a domain) and a design pattern (a useful mechanism for data retrieval, in-memory validation, object construction-to-order, and bulk updates).

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software (Addison-Wesley, 2003), Chapter 9 — 'Making Implicit Concepts Explicit'. Also: Fowler, Martin &amp; Evans, Eric. 'Specifications' (martinfowler.com/apsupp/spec.pdf, 1997/updated) — the foundational paper co-authored by both, which defines the pattern, its four use cases, and composite combinators.

**Secondary Citations**

Khorikov, Vladimir. 'Specification Pattern: C# implementation' (enterprisecraftsmanship.com, 2016); 'Specification Pattern vs Always-Valid Domain Model' (enterprisecraftsmanship.com); 'CQRS vs Specification Pattern' (enterprisecraftsmanship.com); 'Using a DDD Approach for Validating Business Rules' (infoq.com/articles/ddd-business-rules/).

**E-commerce Example**

In an e-commerce Order domain, a DiscountEligibleSpecification might check whether an Order qualifies for a promotional discount (e.g., total &gt; 1000 THB AND customer tier is Gold AND no previous discount applied this month). The same specification object is reused three ways: (1) in-memory validation when a customer clicks 'Apply Discount'; (2) database query to fetch all eligible orders for a bulk promo run; (3) construction-to-order when the Inventory system needs to build a sample order that qualifies. A separate InStockSpecification on products can be And-combined with DiscountEligibleSpecification for a 'qualifying in-stock order' query without duplicating logic.

**Common Mistake**

The most frequent mistake is using the Specification Pattern as a universal query builder for the read side, then struggling to translate composite specifications efficiently into SQL or ORM queries. Developers end up with an object graph that cannot be converted to a database-native predicate, forcing full table scans or in-memory filtering of large result sets. Khorikov notes this directly: 'You can't employ the native querying mechanism of the underlying data storage and have to fall back to the lowest common denominator.' The fix is to limit specifications to the write/command side and use purpose-built read models or CQRS query objects for the read side.

**Anti-Pattern**

Generic Repository + Specification as Universal Query API: Teams wire specifications directly into a generic IRepository&lt;T&gt;.Find(ISpecification&lt;T&gt;) interface and treat it as a replacement for all query logic. This creates a 'Specification God Object' that accumulates dozens of combinators and breaks database query translation. Closely related to the 'Leaky Abstraction' anti-pattern. Fowler's 'Rules Engine' bliki also warns that over-engineering Boolean composition into a full rules engine is a smell when a simpler hard-coded specification suffices (martinfowler.com/bliki/RulesEngine.html).

**Event Storming / EDA Connection**

In Event Storming, business rules surface as Policy stickies (lilac/purple) that sit between a Domain Event and a Command, encoding the condition 'when X happens, if [rule] then issue command Y.' A Specification directly implements the [rule] inside that Policy. At Design-Level Event Storming, when facilitators identify a Policy that checks multiple conditions, that is the signal to introduce a Specification class in the aggregate or domain service. On the EDA side, a Specification can guard a Command Handler — the handler calls spec.IsSatisfiedBy(aggregate) before deciding whether to publish an event or raise a domain exception.

**Contested Interpretations**

Two active debates exist: (1) Specification vs. Always-Valid Domain Model — Khorikov argues that if aggregates enforce invariants in their own constructors and methods, external Specification objects add no value for validation; the Always-Valid model makes specifications redundant on the write side. Evans' original text does not address this tension directly, leaving practitioners to choose. (2) Specification vs. CQRS — Khorikov states the two patterns 'contradict each other at the most fundamental level': CQRS mandates separate read models optimized per query, whereas Specification assumes one composable predicate serves all query needs. The DDD community has not reached consensus; both camps have active proponents.

**Thai Audience Note**

Thai architects from 3-tier/SOA backgrounds typically encode business rules in stored procedures or service-layer if-chains duplicated across validation, queries, and batch jobs. The Specification Pattern directly addresses this duplication, but the concept of 'an object that represents a rule' is counterintuitive when rules are seen as procedural logic. The composability aspect (And/Or/Not combinators) maps well to the SQL WHERE clause mental model, which helps. The main confusion is distinguishing specifications (domain objects living in the domain layer) from query DTOs or filter request objects (living in the application layer) — Thai teams often collapse these layers.

**Related Concepts**

- Value Object
- Domain Service
- Repository
- Aggregate
- Application Service
- Domain Event
- Ubiquitous Language

**Implementation Pattern**

On the write/command side: Specification objects live in the Domain layer, called from Application Services or Command Handlers before state-changing operations. On the read side: CQRS is strongly preferred over Specification — each query gets its own optimized read model (SQL view, projection, Elasticsearch query) rather than a translated specification. For Event Sourcing systems, specifications guard commands before events are appended; they do NOT filter event streams (projections handle read concerns). Saga choreography can use specifications to decide whether a service should react to a domain event — the specification encodes the policy condition. Outbox pattern is not directly related to Specification, but specifications may gate which events are worthy of outbox publication.

**Workshop Activity**

Design-Level Event Storming — Specifications surface when facilitators examine Policy stickies and ask 'what exact condition triggers this policy?' Each condition branch that needs to be reused or composed maps to a Specification. The Aggregate Design Canvas can record which specifications guard which aggregate commands. Bounded Context Canvas does not directly surface specifications (too tactical), but the 'Business Rules' section is the natural home for enumerating them.

**Decomposition Signal**

[not-applicable] — The Specification Pattern is a tactical pattern within a single bounded context, not a boundary-drawing tool. It does not signal where to split services or bounded contexts.

**Evolution &amp; Refactoring**

Specifications typically start as inline if-conditions inside aggregate methods or application services. The refactoring signal is duplication: when the same condition appears in a validator, a repository query, and a batch job, extract it into a named Specification class. As the domain grows, hard-coded specifications (a single class per rule) may be refactored into a Composite Specification using And/Or/Not combinators when rules need to be assembled at runtime (e.g., configurable eligibility rules). Further evolution: as the system adopts CQRS, Specification objects on the read side are replaced with dedicated query objects or projections, leaving specifications only on the write side. This is a one-way ratchet — reverting from CQRS projections back to Specifications is costly.

**Conway's Law Implication**

The Specification Pattern has minimal direct Conway's Law implication because it is purely tactical — it lives within one bounded context and one team's codebase. However, when multiple teams share a generic ISpecification interface across service boundaries, Conway's Law creates coordination overhead: teams must agree on the specification contract, versioning, and combinators. Best practice: each bounded context team owns its own specification types; cross-context rule sharing signals a missing Shared Kernel or Anti-Corruption Layer discussion, not a shared Specification base class.

**Data Mesh / Analytics Note**

Specifications operate on operational (transactional) data within a bounded context's write model. They are not directly applicable to analytical pipelines. However, the business rule logic encoded in a Specification is often needed in analytical contexts too (e.g., 'which orders qualify for premium treatment?'). In a Data Mesh architecture, the domain team publishing a data product should expose the specification logic as a documented business rule in the data product contract, rather than having the analytics team re-implement it. Sharing the rule definition (not the code) avoids duplicated business logic across operational and analytical planes.

**Testing Approach**

Specification unit tests are the simplest in DDD: instantiate the specification, call IsSatisfiedBy with a valid and an invalid domain object, assert true/false. No mocks needed because specifications are pure functions over domain objects. Composite specifications (And/Or/Not) should be tested for each combinator. Integration tests verify that ORM translation of specifications produces correct SQL (if used on the read side). Contract tests are not applicable — specifications are internal to a bounded context. The ease of testing is one of the pattern's main advantages over embedded if-chains.

**Tooling &amp; DSL**

No dedicated tooling exists for the Specification Pattern itself. Context Mapper DSL does not have a specification primitive — specifications are implemented in code. In C#/.NET, libraries such as Ardalis.Specification provide a base class and Repository integration. In Java, Spring Data Specifications (JPA Criteria API wrappers) implement the pattern for data retrieval. For Miro/Mural: no standard canvas template; teams annotate Policy stickies in Event Storming boards with the specification name. The pattern is language-agnostic but most documented examples are in C# and Java.

**Legacy Modernization Relevance**

In legacy CRUD or SOA systems, business rules are typically scattered across stored procedures, service methods, and UI validation scripts. Extracting Specification objects is an early, low-risk step in a Strangler Fig migration: identify a rule that is duplicated across the legacy codebase, encapsulate it as a Specification in the new domain model, and route validation calls through the new service. An Anti-Corruption Layer (ACL) between legacy and new system can use Specifications to translate legacy filter semantics into domain-native predicates. This approach is R2 (easily reversed) and delivers immediate value — it reduces duplication before the full bounded context extraction is complete.

### Integration Event


**Definition**

An Integration Event is an event published across bounded context boundaries via an asynchronous message broker. It represents a committed fact from a producing bounded context that other contexts (or external systems) need to react to. Unlike Domain Events (which are internal to a bounded context and may be synchronous), Integration Events always travel out-of-process, carry a minimal stable payload, and have their own lifecycle, transport contract, and schema versioning strategy distinct from the internal domain events that may have triggered them. They must only be published after the originating transaction is durably persisted.

**Primary Citation**

De la Torre, Cesar. 'Domain Events vs. Integration Events in Domain-Driven Design and microservices architectures.' Microsoft Developer Blogs (devblogs.microsoft.com), 2017. This is the most widely cited treatment that formalizes the distinction. Also: Richardson, Chris. 'Microservices Patterns.' Manning, 2018 — covers the transactional outbox as the reliable mechanism for Integration Event publishing.

**Secondary Citations**

Khononov, Vlad. 'Learning Domain-Driven Design.' O'Reilly, 2021 — reinforces that integration events must be modeled differently from internal domain events and treated as a public API contract. Richardson, Chris. 'Microservices Patterns.' Manning, 2018 (ch. 3-4) — covers the Transactional Outbox pattern as the canonical reliable integration event publishing mechanism. InfoQ (2019): 'Practical DDD: Bounded Contexts + Events =&gt; Microservices' — explains how events become the inter-context communication mechanism.

**E-commerce Example**

In an e-commerce system: when the Order bounded context commits an OrderPlaced transaction, it writes an OrderPlacedIntegrationEvent (carrying orderId, customerId, totalAmount, lineItems summary) to an outbox table in the same DB transaction. A relay process (or Debezium CDC) reads the outbox and publishes to a Kafka topic. The Inventory context subscribes and reserves stock (producing InventoryReservedIntegrationEvent). The Payment context subscribes and initiates a charge. The Shipping context listens for PaymentProcessedIntegrationEvent to schedule fulfillment. Each integration event carries only the data other contexts need — no internal Order aggregate internals leak. Schema versioning (e.g., v1/v2 topic namespaces) ensures backward compatibility when the Order context evolves its internal model.

**Common Mistake**

Directly publishing internal Domain Events across bounded context boundaries without translation. Teams frequently serialize their internal domain event objects (which carry aggregate internals, implementation-specific field names, and internal identifiers) and send them to a shared message broker consumed by other bounded contexts. This creates tight schema coupling: any internal refactoring of the originating aggregate breaks all downstream consumers. The correct approach is to explicitly translate internal domain events into a stable, minimal Integration Event schema at the bounded context boundary — treating the integration event as a public API contract independent of the internal model.

**Anti-Pattern**

1. 'Distributed Monolith via Shared Event Schema': publishing internal domain event classes directly to a shared broker consumed by many contexts, so all contexts must be updated whenever any internal model changes — the system behaves like a monolith despite running as distributed services. Described in InfoQ (2016): 'Microservices Ending up as a Distributed Monolith.' 2. 'Chatty Integration Events': firing a separate integration event for every field-level change rather than meaningful business facts, flooding the broker and making consumer logic unmanageable. 3. 'Dual Write' (publishing to broker without atomic outbox): writing to the database and then publishing to the broker in two separate steps — if the service crashes between them, the event is lost or duplicated, violating the exactly-once delivery contract. Addressed by the Transactional Outbox pattern (microservices.io).

**Event Storming / EDA Connection**

In Event Storming, Integration Events appear when the facilitator introduces the concept of Bounded Context boundaries on the modelling surface. In Big Picture Event Storming, an orange sticky that triggers reactions in a different part of the domain (handled by a different team or system) is a candidate integration event — it crosses a swimlane or context boundary. In Domain Message Flow Modeling (DDD Crew), integration events are explicitly the messages drawn as arrows between bounded context boxes, with producer and consumer labeled. In EDA, integration events map directly to message broker topics or queues; the Event Storming output of inter-context orange stickies becomes the topic design for Kafka or RabbitMQ.

**Contested Interpretations**

1. Naming and formalization: Evans (2003) did not formally define 'Integration Event' as a distinct term — it emerged from community practice and was popularized by Vernon (IDDD, 2013) and de la Torre (2017). Some practitioners use 'Public Event' (Khononov) or 'Notification Event' (Fowler) for the same concept, creating terminology inconsistency. 2. Where to translate: some teams translate domain events to integration events inside the domain layer; others argue this translation belongs in the application service or infrastructure layer to keep domain logic clean. 3. Payload minimalism vs. richness: there is ongoing debate on how much data to include. Minimal payloads (just IDs) force consumers to query back for detail (request-driven anti-pattern); rich payloads risk exposing internal model. No single consensus exists — context and consumer needs determine the trade-off.

**Thai Audience Note**

Thai architects from traditional SOA/ESB backgrounds often conflate Integration Events with SOAP messages or ESB-routed notifications — both are async messages, so the distinction feels artificial. Key difference: Integration Events are domain-meaningful, named in business language (OrderPlaced, not order_status_update), immutable, and carry business intent rather than technical state diffs. A second common confusion is equating Integration Events with database triggers or CDC change events — these carry technical row-level diffs, not business facts. Also, hierarchical Thai IT departments often have a central ESB team that 'owns' all inter-system messages, which conflicts with DDD's principle that the producing bounded context team owns and versions its integration event contracts.

**Related Concepts**

Domain Event (the internal precursor that is translated into an Integration Event at the context boundary), Bounded Context (Integration Events are the primary cross-context communication mechanism), Context Mapping Patterns (Published Language and Open Host Service patterns govern the integration event contract), Application Service (orchestrates the translation from domain event to integration event), Aggregate (the origin of the domain events that become integration events), Saga/Process Manager (choreography via integration events or orchestration that emits integration events), CQRS (integration events update read models in downstream contexts), Transactional Outbox (the reliable publishing pattern for integration events)

**Recent Developments (2020–2025)**

2020-2025: The CNCF CloudEvents specification (graduated 2024) provides a standardized envelope for integration events across cloud platforms (Azure Event Grid, AWS EventBridge, Google Eventarc), formalizing the payload schema that DDD practitioners had been defining informally. Multi-cloud event-driven architectures (InfoQ 2024) have made cross-boundary integration events the default integration mechanism, with 86% of organizations now multi-cloud (Flexera 2025). The Transactional Outbox + CDC (Debezium) pattern has become the industry-standard reliable publishing mechanism, replacing fragile dual-write approaches. Event-driven banking architecture articles (InfoQ 2024) report that integration events with well-defined consumer-driven contracts have reduced inter-team coupling in regulated financial systems.

**Implementation Pattern**

1. Transactional Outbox: write the integration event to an outbox table atomically with the state change; a relay process (or CDC tool like Debezium) reads the outbox and publishes to the broker (Kafka, RabbitMQ, Azure Service Bus). This eliminates dual-write risk. 2. Translation layer: in the Application Service, after committing the domain transaction, map internal domain events to integration event DTOs with a stable schema. 3. Schema versioning: use versioned event types (OrderPlacedV1, OrderPlacedV2) or additive-only schema evolution with a schema registry (Confluent Schema Registry). 4. Consumer-driven contracts (Pact): define the integration event schema from the consumer's perspective and verify the producer conforms. 5. Saga choreography: integration events serve as the inter-context messages that advance a distributed saga without a central orchestrator. 6. Inbox pattern: consumers write received integration events to an inbox table before processing, enabling idempotent handling and at-least-once delivery safety.

**Workshop Activity**

Domain Message Flow Modeling (DDD Crew): the primary activity for mapping integration events — draws bounded context boxes as producers/consumers with labeled event arrows between them. Big Picture Event Storming: inter-context orange stickies that cross swimlane boundaries become integration event candidates. Bounded Context Canvas: the 'Inbound/Outbound Communication' section explicitly captures what integration events the context publishes and subscribes to.

**Decomposition Signal**

[not-applicable] Integration Event is a tactical/communication pattern, not a boundary-drawing concept. However, it provides a decomposition signal in practice: if a proposed integration event carries a very large payload that many contexts need, it may indicate the producing context is too broad and should be split. Conversely, if many fine-grained integration events must be combined by consumers to reconstruct business state, this signals a missing aggregating context or a need for a higher-level Published Language event.

**Evolution &amp; Refactoring**

Integration Events must be evolved with extreme care because they are public contracts consumed by other teams' codebases. Safe evolution strategies: (1) Additive-only changes — adding optional fields is backward compatible; removing or renaming fields is breaking. (2) Versioned event types — introduce OrderPlacedV2 as a new event type alongside OrderPlacedV1; run both in parallel during migration until all consumers are upgraded. (3) Upcasting — a transformation layer converts old event shapes to new at consumption time, isolating schema change impact. (4) Consumer-driven contract tests (Pact) — run as part of CI to catch breaking schema changes before deployment. Anti-pattern to avoid: silently changing the semantic meaning of a field without renaming it (e.g., repurposing 'amount' from gross to net) — this is the most dangerous evolution mistake as it passes schema validation but breaks business logic.

**Conway's Law Implication**

The integration event schema is the API contract between teams — the team that owns the producing bounded context owns and versions the integration event. In practice, this means team boundaries must align with bounded context ownership; if two teams share ownership of a context that produces integration events, the governance of schema changes becomes a coordination bottleneck. In hierarchical Thai IT departments, where a central architecture or ESB team traditionally owns inter-system contracts, DDD integration events require shifting that ownership to product teams — a significant organizational change. The Inverse Conway Maneuver recommends designing team boundaries to match desired integration event flows, not the other way around.

**Data Mesh / Analytics Note**

In a data mesh architecture, integration events published to a Kafka topic by an operational bounded context are a natural feed for analytical data products owned by the same domain team. The domain team publishes integration events (e.g., OrderPlaced) which are consumed by both other operational contexts and by the team's own stream processing jobs (Flink, Spark Streaming) to produce analytical data products (e.g., real-time revenue dashboard, order funnel metrics). The key data mesh principle — domain ownership of analytical data — is directly enabled by integration events: the team that produces the event also owns the analytics derived from it. Thai enterprises with strong BI culture should treat integration events as the preferred feed for near-real-time dashboards, replacing batch ETL from operational databases.

**Testing Approach**

1. Producer-side: integration tests verify that a domain command results in the correct integration event written to the outbox table (asserts on the DB row, not the broker). 2. Outbox relay tests: verify that the relay/CDC process reads from outbox and publishes correctly-shaped messages to the broker. 3. Consumer-driven contract tests (Pact): the consuming bounded context defines the integration event schema it expects; the producing context runs Pact provider verification in its CI pipeline to catch breaking changes. 4. End-to-end event flow tests: spin up both producer and consumer services with an in-memory or containerized broker (Testcontainers + Kafka) and assert that a command in the producer results in the expected state change in the consumer. Avoid testing integration events purely with unit tests — the outbox and transport mechanics must be covered by integration or contract tests.

**Tooling &amp; DSL**

Transactional Outbox: Debezium (CDC-based outbox relay), MassTransit Outbox (.NET), Eventuate Tram (Java). Schema registries: Confluent Schema Registry (Avro/JSON Schema/Protobuf), AWS Glue Schema Registry. Consumer-driven contracts: Pact (multi-language), Spring Cloud Contract. CNCF CloudEvents SDK: standardized envelope across cloud providers. Domain Message Flow Modeling canvas (DDD Crew, ddd-crew.github.io): workshop tool to map integration events between bounded contexts. EventCatalog (open source): documents integration event schemas, producers, and consumers in a searchable portal. Context Mapper DSL: models bounded context relationships including Published Language event contracts.

**Legacy Modernization Relevance**

Integration Events are the primary mechanism for decoupling a legacy monolith from newly extracted services in a Strangler Fig migration. Pattern: (1) Add an Anti-Corruption Layer (ACL) at the monolith boundary that intercepts database changes (via CDC/Debezium or domain hooks) and translates them into well-defined integration events published to a broker. (2) The new service subscribes to these integration events instead of calling the monolith directly. (3) As more functionality moves to the new service, the monolith's role as producer diminishes until it is strangled. In SOA-to-microservices migrations, existing ESB message types (often XML SOAP messages) are translated to integration events at the ACL boundary, preserving business semantics while replacing the ESB infrastructure with a modern message broker. The Event Interception pattern (martinfowler.com) is the specific technique for intercepting legacy system events during extraction.

### Saga and Process Manager


**Definition**

A Saga is a pattern for managing long-running, multi-step business workflows that span multiple aggregates or bounded contexts without relying on distributed ACID transactions. It decomposes an overarching business transaction into a sequence of local transactions, each updating data within a single service and publishing a message or event. If a local transaction fails, the saga executes compensating transactions to undo the changes made by preceding steps. A Process Manager (also called Saga Orchestrator in some literature) is a stateful component that explicitly tracks the current state of a long-running process, listens to events, and issues commands to participants — providing a single coordination point for complex flows. Together, they enable eventual consistency across service boundaries without two-phase commit.

**Primary Citation**

Richardson, Chris. 'Microservices Patterns.' Manning, 2018 (ch. 4) — defines sagas as a sequence of local transactions with compensating transactions and details both choreography and orchestration variants. Also: Garcia-Molina, H. and Salem, K. 'Sagas.' SIGMOD Conference, 1987 — original academic source for the term. Evans, Eric. 'Domain-Driven Design Reference.' Domain Language, 2015 — process managers appear as a tactical pattern for coordinating aggregates across bounded contexts.

**Secondary Citations**

Vernon, Vaughn. 'Implementing Domain-Driven Design.' Addison-Wesley, 2013 (ch. 10) — discusses long-running processes and process managers as stateful domain objects. Khononov, Vlad. 'Learning Domain-Driven Design.' O'Reilly, 2021 — covers sagas as a key pattern for cross-bounded-context consistency. Rucker, Bernd — 'Process Managers in Event-Based Systems,' InfoQ 2017 — distinguishes process managers from simple choreographed sagas.

**E-commerce Example**

Order fulfillment in an e-commerce system is the canonical saga example. When a customer places an order (OrderPlaced event), a saga coordinates: (1) Reserve inventory — InventoryService decrements stock (InventoryReserved); (2) Process payment — PaymentService charges the customer (PaymentProcessed or PaymentFailed); (3) Schedule shipping — ShippingService books a courier (ShipmentScheduled). If PaymentFailed, a compensating transaction releases the inventory reservation (InventoryReleased). In choreography, each service publishes events that the next service listens to. In orchestration, an OrderSaga process manager entity tracks state (PENDING → INVENTORY_RESERVED → PAYMENT_PENDING → CONFIRMED or CANCELLED) and sends explicit commands (ReserveInventory, ProcessPayment, ScheduleShipment, ReleaseInventory) to participants. The orchestrated variant makes the flow visible and auditable as a single component.

**Common Mistake**

The single most common mistake is treating a saga like a distributed ACID transaction — developers write compensating transactions as if they are automatic rollbacks that restore the system to exactly the original state. In reality, compensating transactions are business-specific operations that may not be perfectly reversible (e.g., a refund is not the same as a payment never occurred). A related mistake is modeling sagas without a clear pivot transaction: the last step that must succeed before the saga can commit. Any step before the pivot must be compensatable; steps after it must be retried-to-completion, never compensated. Teams who ignore the pivot transaction concept end up with sagas that can partially compensate in incorrect orders, leading to inconsistent data.

**Anti-Pattern**

Distributed Monolith: when teams implement sagas but couple services so tightly (shared database, synchronous calls inside saga steps, or implicit ordering dependencies) that the services cannot be deployed independently — the saga coordination merely moves the coupling from data to process, giving the worst of both worlds. Literature reference: Richardson, Chris. 'Microservices Patterns' (2018) warns that distributed data management patterns including Saga become harmful when services remain tightly coupled. A second anti-pattern is the God Orchestrator: a single orchestrator that accumulates business logic for many unrelated sagas, becoming a new monolith. This violates the principle that each saga should be scoped to a single coherent business process and owned by the bounded context that initiates it.

**Event Storming / EDA Connection**

In Event Storming, sagas and process managers surface as the 'read model' and 'policy' stickies that connect multiple aggregates across a timeline. When facilitators draw a Design-Level EventStorming board and see a chain of Domain Events (orange) spanning multiple aggregates or bounded contexts with Policy (lilac) stickies converting events into commands, they are identifying a saga. A Process Manager maps directly to the blue 'Read Model' / 'Process' sticky that tracks accumulated state across events and issues the next command. In Big Picture EventStorming, long orange corridors with many alternating events and commands across swimlanes are visual signals that a saga is needed. The EventStorming output — the sequence of Event → Command → Aggregate chains — becomes the specification for implementing a choreography-based or orchestration-based saga.

**Contested Interpretations**

There is ongoing disagreement about the relationship between 'Saga' and 'Process Manager.' In the original Garcia-Molina/Salem (1987) paper, a saga is purely a sequence of transactions with compensations and has no explicit state-management component. In the CQRS/event-driven community (Udi Dahan, Greg Young), a Process Manager is a distinct, heavier concept: a stateful class that listens to events, holds current state in a database, and issues commands — while a saga is the simpler, stateless choreography pattern. Vaughn Vernon in 'Implementing Domain-Driven Design' (2013) uses the term 'Long-Running Process' or 'Saga' interchangeably for what others call a Process Manager, adding to the confusion. Chris Richardson's 'Microservices Patterns' (2018) uses 'Saga' as the umbrella term covering both choreography and orchestration variants, with the orchestration variant being closest to the traditional Process Manager. The InfoQ 2017 article by Rucker explicitly separates the two: a saga is choreography-based, while a process manager is orchestration-based with explicit state. No definitive community consensus exists on terminology.

**Thai Audience Note**

Thai architects from SOA/3-tier/CRUD backgrounds typically rely on a single relational database with foreign keys and database transactions to enforce consistency across what DDD considers separate bounded contexts. The mental model shift is significant: (1) they must accept that 'eventual consistency' means the database can be transiently inconsistent, which feels wrong to teams audited by regulators; (2) compensating transactions feel fragile compared to a database rollback — there is no automatic undo; (3) Thai enterprise IT often has a separate DBA team that manages database transactions centrally, so distributing transaction ownership to application teams requires both technical and organizational change. The choreography variant is especially unfamiliar because there is no single place to see the 'flow' — something that Thai architects (who often draw BPMN process diagrams) find uncomfortable.

**Related Concepts**

Domain Event, Integration Event, Aggregate, Bounded Context, Context Mapping Patterns, CQRS (Command Query Responsibility Segregation), Domain Service, Application Service

**Recent Developments (2020–2025)**

2024: Chris Richardson published 'A Tour of Two Sagas' (microservices.io, March 2024) — a code walkthrough of choreography-based and orchestration-based saga implementations, demonstrating both variants concretely with the Eventuate framework. The article reinforces that both variants remain valid and choice depends on complexity: choreography for simple flows (2–3 steps), orchestration for complex multi-step processes. Also in 2025: Temporal Technologies launched cloud availability on AWS (InfoQ, May 2025), bringing durable workflow execution — a managed alternative to hand-rolling saga orchestrators — into mainstream adoption. The Temporal model abstracts away compensating transactions by checkpointing workflow state, reducing saga implementation complexity significantly. This represents a tooling shift away from framework-level saga libraries toward dedicated workflow platforms.

**Implementation Pattern**

Two implementation variants: (1) Choreography-based saga — each service publishes domain events after completing its local transaction; downstream services subscribe and react autonomously. No central coordinator. Works well for simple 2–3 step flows. Risk: implicit flow that is hard to trace and reason about for complex sequences. (2) Orchestration-based saga (Process Manager) — a dedicated orchestrator class/service sends commands to participants and waits for reply events. The orchestrator holds explicit state in a database (via the Outbox pattern for reliability). Works well for complex multi-step flows where visibility and auditability matter. The Outbox pattern is strongly recommended with both variants to guarantee at-least-once event delivery: write the event to an OUTBOX table within the same local database transaction, then a separate relay process forwards it to the message broker. CQRS pairs naturally with the orchestration variant because the saga orchestrator's state can itself be a read model updated by events.

**Workshop Activity**

Design-Level EventStorming is the primary activity: teams trace chains of Domain Events → Policies → Commands → Aggregates across a timeline and identify where one aggregate's event triggers action in another aggregate or bounded context. When such cross-aggregate chains appear, the team determines whether a saga (choreography) or process manager (orchestration) is needed. Big Picture EventStorming also surfaces long-running processes as long orange event corridors. Domain Message Flow Modeling (DDD Crew) is useful for specifying the exact sequence of messages in a saga before implementation.

**Decomposition Signal**

[not-applicable] — Saga and Process Manager are tactical implementation patterns, not boundary decomposition signals. They are applied after bounded context boundaries are drawn. The signal that a saga is needed is: a business workflow requires consistency across more than one aggregate or bounded context and a distributed transaction (2PC) is not acceptable. Observable signals include: BPMN process diagrams that cross system/team boundaries, business rules that reference entities from multiple bounded contexts, SLA requirements that span service calls.

**Evolution &amp; Refactoring**

Sagas typically start as choreography-based for simple flows and evolve to orchestration-based (process managers) as the flow grows in complexity and observability becomes critical. A common refactoring move is the 'Extract Process Manager' — identify implicit choreography by mapping all event subscriptions across services for a business process, then introduce a dedicated process manager class/service that owns the state and makes the flow explicit. Over time, process managers may be extracted from application services into dedicated workflow engines (e.g., Temporal, Axon Framework, Eventuate). Another evolution dimension: compensating transactions become complex as domain logic grows — teams refactor toward 'saga with no compensatable steps' by reordering steps so the pivot transaction comes first (validate all preconditions before committing any side effects).

**Conway's Law Implication**

Saga ownership must align with team ownership. If an order fulfillment saga spans Order, Payment, and Shipping teams, the orchestrator must be owned by exactly one team — typically the team that owns the initiating bounded context (Order). If ownership is unclear, the saga becomes a coordination overhead that no single team is accountable for, leading to bugs that fall between team boundaries. Conway's Law implies: choreography-based sagas are safer when services are owned by different autonomous teams (no central coordinator to fight over); orchestration-based sagas work best when one team can own the orchestrator. Thai enterprise IT departments with rigid team silos often resist placing a cross-functional saga orchestrator in any one team's scope.

**Data Mesh / Analytics Note**

Sagas produce a rich trail of domain events (OrderPlaced, PaymentProcessed, InventoryReserved, ShipmentScheduled) that are valuable for analytical pipelines. In a Data Mesh context, these events can be treated as data products: each bounded context publishes its events to a stream (Kafka topic) that the analytical domain consumes as a read-only product. The saga's compensating events (PaymentFailed, InventoryReleased) are equally important for analytics — they capture business failures and reversals that are invisible in OLTP systems. Care must be taken not to leak saga implementation details (e.g., SAGA_STEP column) into the analytical schema; instead, project events into business-meaningful facts.

**Testing Approach**

Sagas require multiple test levels: (1) Unit tests for each participant's local transaction logic in isolation — standard aggregate unit tests apply; (2) Integration tests for the saga orchestrator using in-memory message buses or embedded brokers (e.g., TestContainers + Kafka) to exercise command/reply cycles; (3) Saga-level integration tests that simulate failure scenarios — inject failures at each step and assert that compensating transactions fire correctly and the system reaches a consistent terminal state; (4) Contract tests between the saga orchestrator and each participant using consumer-driven contract testing (e.g., Pact) to ensure command/reply message schemas remain compatible. The Outbox pattern should be tested separately to confirm at-least-once delivery.

**Tooling &amp; DSL**

For implementation: Eventuate Tram Sagas (Java, open source) — embeddable library for both choreography and orchestration-based sagas, integrates with Spring Boot and the Outbox pattern; Temporal.io — durable workflow engine that abstracts saga state and compensations as code-native workflows (2024–2025 gaining momentum); Axon Framework (Java) — DDD/CQRS/ES framework with built-in Saga support. For modeling: Design-Level EventStorming on Miro/Mural with orange/lilac/blue stickies maps directly to saga steps; Domain Message Flow Modeling (DDD Crew on GitHub) provides a lightweight diagram format for specifying message sequences before coding. Context Mapper DSL does not have native saga support but can model bounded context interactions that inform saga design.

**Legacy Modernization Relevance**

In Strangler Fig migrations from monolith/SOA to services, sagas are typically introduced at the seam where an extracted service must participate in a workflow previously handled by a single database transaction. The Anti-Corruption Layer (ACL) at the monolith boundary can translate legacy database triggers or stored procedure calls into domain events that feed the saga. A common sequence: (1) extract a service behind the ACL; (2) introduce a choreography-based saga with the monolith as one participant; (3) once more services are extracted, optionally introduce a process manager. Thai enterprises migrating from Oracle/IBM SOA backends often have BPMN process definitions in BPM engines (IBM BPM, Camunda); these can be refactored into process managers that emit domain events instead of direct service calls, reducing the coupling while preserving process visibility that business stakeholders require.

## Architecture


### Architecture Patterns


**Definition**

DDD architecture patterns describe how to physically structure software so that the domain model remains at the center, insulated from infrastructure and delivery concerns. Three primary styles are recognized: (1) Layered Architecture (Evans, 2003) separates code into four canonical layers — User Interface, Application, Domain, and Infrastructure — with a strict dependency rule that outer layers may call inward but the Domain layer must never depend on Infrastructure. (2) Hexagonal Architecture (Ports and Adapters, Alistair Cockburn, 2005; popularized within DDD by Vaughn Vernon) places the domain at the core surrounded by a Ports layer (use-case interfaces) and an Adapters layer (technology implementations), so changes in HTTP, database, or messaging never reach domain objects. (3) DDD + Microservices maps Bounded Contexts to independently deployable services, using each context's internal architecture (typically hexagonal) to ensure domain logic is not contaminated by inter-service plumbing. The unifying principle across all three styles is the Dependency Inversion Principle: the domain defines abstractions (ports / repository interfaces) and infrastructure implements them, so the domain depends on nothing outside itself.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003, Part IV 'Strategic Design', Chapter 16 'Large-Scale Structure' and Chapter 4 'Isolating the Domain' (layered architecture). Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013, Chapter 4 'Architecture' (hexagonal architecture as the preferred style for DDD). Fowler, Martin. 'Presentation Domain Data Layering'. martinfowler.com, 2015.

**Secondary Citations**

Richardson, Chris. 'Developing Transactional Microservices Using Aggregates, Event Sourcing and CQRS'. InfoQ, 2015 (parts 1 and 2). Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 (chapters on ports and adapters and microservice decomposition). 'Enabling Microservices with Domain-Driven Design and Ports and Adapters'. InfoQ presentation by Declan Whelan. Fowler, Martin. 'Breaking a Monolith into Microservices'. martinfowler.com.

**E-commerce Example**

In an e-commerce system using hexagonal architecture, the Order Bounded Context is the innermost hexagon. Its domain layer holds Order, OrderLine, and Money value objects, enforcing invariants like 'total must be positive'. The Ports layer exposes interfaces: OrderRepository (write side), OrderReadModel (read side), PaymentGateway (output port). Adapters implement these: PostgresOrderRepository, StripePaymentAdapter, and a REST API adapter. The Catalog context is a separate hexagon with its own Ports. When the Checkout service places an order, it calls the Application Service in the Order hexagon, which orchestrates domain logic and fires an OrderPlaced domain event. The Payment hexagon receives this via an event bus adapter — the domain itself never references Stripe or Kafka directly. In a microservices deployment, each hexagon becomes a separately deployable service; decomposition follows DDD subdomains: Catalog, Cart, Order, Payment, Shipping, and Inventory each become services whose internal architecture is hexagonal.

**Common Mistake**

The most frequent mistake is treating layered architecture as permission to put domain logic in the Application or Infrastructure layer. Teams using traditional 3-tier CRUD frameworks habitually place business rules in service classes (Fat Service Layer) while domain objects become pure data containers with only getters and setters. This is the Anemic Domain Model: the code looks like it uses DDD (entities, repositories, application services exist) but domain objects carry no behavior, so the domain layer provides no protective boundary. The fix is to move validations, calculations, and invariant enforcement into the domain objects themselves, using Application Services only for orchestration and transaction coordination.

**Anti-Pattern**

Two named anti-patterns arise when architecture patterns are misapplied: (1) Anemic Domain Model (Fowler, 2003; martinfowler.com/bliki/AnemicDomainModel.html) — entities are data bags, logic lives in services; the domain layer is present structurally but absent intellectually. All the cost of a domain model, none of the benefit. (2) Distributed Monolith (Richardson, microservices.io; Tilkov, InfoQ 2018) — a system is decomposed into multiple deployed services but remains tightly coupled through shared databases, synchronous call chains, or coordinated deployments; it combines the operational complexity of microservices with the deployment coupling of a monolith. DDD's Bounded Context discipline is the primary guard against the Distributed Monolith: services must be separated by business-domain boundaries, not arbitrary technical slicing.

**Event Storming / EDA Connection**

Architecture patterns directly shape which Event Storming sticky notes live where. In hexagonal architecture, Domain Events (orange stickies) originate inside the domain hexagon when aggregates change state. Commands (blue stickies) arrive at Input Ports (Application Services) from external actors. Policies (purple stickies) and Read Models (green stickies) live in the outer ring — they read events but never touch aggregate state. In an EDA/microservices setup each Bounded Context hexagon subscribes to Integration Events from other contexts via a message-broker adapter. The EventStorming 'Design Level' session naturally produces the port-and-adapter layout: aggregates handle commands and emit events, process managers (sagas) react to events and send new commands, read models project events. The boundary of each hexagon corresponds to a Bounded Context discovered in Big Picture EventStorming.

**Contested Interpretations**

There is meaningful disagreement on (1) whether layered architecture is still appropriate for DDD. Evans (2003) presented it as the default; Vernon (2013) argues hexagonal/ports-and-adapters is strictly superior for DDD because layered architecture still allows domain leakage upward if layers are not enforced rigidly. (2) Whether every Bounded Context must become a microservice. Vladimir Khononov and Chris Richardson both warn that equating bounded contexts with microservices is premature decomposition; Richardson (microservices.io, 2023) explicitly states 'DDD, necessary but insufficient' for microservices physical design. Vladikk (2018, vladikk.com) argues bounded contexts are logical, not deployment, boundaries. (3) Onion Architecture (Jeffrey Palermo) vs Hexagonal Architecture: both place the domain at the center but differ in how many rings they define and where application services sit. Vernon treats Onion as a hexagonal variant; others consider them distinct patterns.

**Thai Audience Note**

Thai architects from 3-tier or SOA backgrounds typically conflate 'layers' with 'tiers' (separate deployed processes). They may implement Hexagonal Architecture structurally (package names like 'domain', 'application', 'infrastructure') but allow JPA annotations or Spring-specific imports to bleed into entity classes, breaking the insulation. The key mental-model shift is: Infrastructure depends on Domain, never the reverse. In SOA backgrounds, 'services' mean WSDL/SOAP orchestration; in DDD, Application Services are thin coordinators, not business logic containers. The instinct to put all business logic in a @Service class is the single most common failure mode.

**Related Concepts**

Bounded Context (defines the boundary each hexagon represents), Application Service (the use-case orchestrator that sits at the inner port boundary), Repository (the canonical output port for aggregate persistence), Domain Event (the primary output from the domain hexagon into the event bus adapter), Integration Event (the adapter-level event crossing context boundaries), Context Mapping Patterns (define how hexagons interact: ACL, Conformist, Partnership), Subdomain Types (Core vs Supporting vs Generic determines architecture investment level), CQRS (frequently combined with hexagonal — commands enter write-side port, queries use separate read-model port)

**Recent Developments (2020–2025)**

2024: Richardson (microservices.io, September 2024) published 'Architectural patterns for modular monoliths that enable fast flow', recommending DDD-based domain module organization as the preferred structure even within a monolith, organizing around bounded contexts rather than technical layers. 2024: The microservices pattern language evolution (PLoP 2024 presentation, microservices.io October 2024) explicitly integrates Team Topologies alignment with bounded-context architecture as an emerging best practice. 2024: ExploreDDD 2024 panel discussed the intersection of DDD and LLMs — early community work on whether LLMs can assist with bounded context and port-and-adapter scaffolding. 2023: Richardson's 'DDD, necessary but insufficient' post (April 2023) established that physical design decisions (database-per-service, network latency, deployment) require additional principles beyond DDD bounded contexts alone.

**Implementation Pattern**

Hexagonal Architecture pairs naturally with CQRS: the write side (commands) enters through an Application Service port and mutates aggregate state, while the read side (queries) uses a separate read-model port returning DTOs optimized for display. Event Sourcing stores aggregate state as a log of Domain Events, making the domain hexagon the sole producer of events; the persistence adapter replays them to reconstruct state. The Outbox Pattern (microservices.io) solves dual-write reliability between aggregate persistence and event publishing within a hexagonal microservice. Sagas (choreography or orchestration) coordinate multi-service flows: in choreography each hexagon's event-bus adapter reacts to Integration Events; in orchestration a Saga Orchestrator service issues Commands through other services' input ports. CQRS should be applied per Bounded Context, not system-wide.

**Workshop Activity**

Big Picture EventStorming discovers the Bounded Contexts that become hexagons. Design-Level EventStorming (within one context) surfaces the commands, aggregates, policies, and read models that map to ports and adapters. The Bounded Context Canvas (ddd-crew.github.io) explicitly captures inbound/outbound communications (ports) and the ubiquitous language. The Aggregate Design Canvas helps define the aggregate boundary within the domain hexagon.

**Decomposition Signal**

Signals that a bounded context should be extracted as its own hexagon or microservice: (1) Linguistic boundary — the same word means different things across teams (e.g. 'Product' in Catalog vs Inventory); (2) Rate-of-change mismatch — the Checkout domain changes weekly while Catalog changes monthly; (3) Team ownership boundary — different squads own different parts of the domain; Conway's Law predicts the architecture will reflect team boundaries; (4) Data coupling — domain objects from separate subdomains are co-located in the same database table or aggregate, creating forced synchronous dependency; (5) Scalability difference — Payment processing requires low-latency isolated scaling that the rest of the system does not. These are the signals Evans (ch. 14) and Richardson (microservices.io decompose-by-subdomain) identify for drawing context boundaries.

**Evolution &amp; Refactoring**

Architecture patterns evolve as domain understanding grows. A common path: start with layered architecture in a modular monolith, enforce strict domain isolation (no infrastructure imports in domain package), then introduce hexagonal port/adapter interfaces as seams. Extract services when bounded context signals appear (see decomposition_signal). Canonical refactoring moves: (1) Introduce Repository interface to break domain-infrastructure coupling; (2) Strangler Fig (Fowler, martinfowler.com/bliki/StranglerFigApplication.html) — route new feature traffic through new hexagonal service while legacy handles old paths; (3) Add Anti-Corruption Layer adapter between old and new contexts during transition; (4) Segregated Core — move Core Domain logic into the domain hexagon and relegate Supporting logic to adapters. Richardson (microservices.io, 2023) documents step-by-step service extraction from a modular monolith.

**Conway's Law Implication**

Conway's Law states that organizations design systems that mirror their communication structures. For DDD architecture patterns this means: a single team owning the entire system tends to produce a layered monolith; separate product teams aligned to business domains produce bounded-context hexagons. The Reverse Conway Maneuver (Team Topologies) deliberately structures teams around desired bounded contexts before writing code. A bounded context should have exactly one team owner — shared ownership of a domain hexagon leads to coordination overhead that defeats the purpose of the boundary. In Thai enterprises with hierarchical, functional IT departments (DBA team, middleware team, front-end team), the default is layered architecture because teams are organized by technical layer, not business capability.

**Data Mesh / Analytics Note**

Hexagonal Architecture creates a clean seam for analytical data: the read-model port (query side) can be implemented by an adapter that publishes domain events to a data warehouse or streaming platform. Each Bounded Context acts as a domain data product owner in Data Mesh terms — it controls what events it publishes and what schema it guarantees. In Thai enterprises with centralized BI/data warehouse culture, the risk is that analytics needs drive schema decisions in the domain model (OLAP-friendly denormalization leaking into domain objects). The hexagonal port boundary enforces that the domain model is optimized for business invariants, while a separate analytics adapter transforms events into warehouse-friendly structures.

**Testing Approach**

Hexagonal Architecture makes testing straightforward. (1) Domain hexagon unit tests: pure in-memory tests of aggregates and domain services; no Spring, no database, no network. Test all invariants, state transitions, and domain event emission. (2) Application Service integration tests: wire real domain with in-memory or stub adapters (fake repository, fake payment gateway); test use-case orchestration. (3) Adapter integration tests: test the real adapter against the real external system (database, message broker) in isolation from domain logic. (4) Contract tests at bounded context seams: verify that events published by one hexagon conform to the schema consumed by another — use consumer-driven contract tests (e.g. Pact). Enterprise Craftsmanship recommends test doubles only for cross-context communications, not for intra-hexagon dependencies.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org — note: not on allowlist, cite with caution) defines bounded context relationships and can generate PlantUML architecture diagrams. Miro and Mural templates exist for Bounded Context Canvas and EventStorming (ddd-crew.github.io provides downloadable templates). ArchUnit (Java) and NetArchTest (.NET) enforce hexagonal architecture rules in CI: assert that domain package has no dependency on infrastructure package. For microservices: Docker Compose for local multi-hexagon setup; Kubernetes for production. Service mesh tools (Istio, Linkerd) manage inter-adapter communication. EventStorming digital tools: Miro, Mural, EventStormingVirtualBoardWEB.

**Legacy Modernization Relevance**

Most Thai enterprise architects face brownfield migration from Oracle-based 3-tier or SAP-adjacent SOA systems. The canonical approach: (1) Apply the Strangler Fig pattern — new bounded-context hexagons intercept traffic incrementally while the legacy system handles remaining paths. (2) Place an Anti-Corruption Layer (ACL) adapter between the new hexagonal context and the legacy system; the ACL translates legacy data formats and domain concepts into the new ubiquitous language. (3) Use Evans' 'Getting Started with DDD When Surrounded by Legacy Systems' (domainlanguage.com) which recommends starting with a Bubble Context — a small, isolated hexagon that does not share a database with the legacy system. (4) Extract the Core Domain first; leave Generic Subdomains (reporting, user management) in the legacy layer until last. Richardson (microservices.io refactoring guide) provides a worked example of step-by-step service extraction.

### CQRS


**Definition**

Command Query Responsibility Segregation (CQRS) is the principle that you can use a different model to update information than the model you use to read information. It extends the Command-Query Separation (CQS) principle — where a method either changes state (command) or returns data (query), never both — to the architectural level of services and data models. In a CQRS system, the write side (commands) enforces business invariants through aggregates and persists state changes; the read side (queries) projects that state into denormalized, query-optimized views. Fulfilling a query request only retrieves data and does not modify system state, while fulfilling a command request modifies system state but typically returns only an acknowledgement. For some situations this separation can be valuable, but for most systems CQRS adds risky complexity.

**Primary Citation**

Fowler, Martin. "CQRS." martinfowler.com, 14 Jul 2011. The canonical short reference defining CQRS, noting the pattern originated with Greg Young and Udi Dahan, and warning that CQRS adds risky complexity to most systems. Young, Greg. "CQRS, Task Based UIs, Event Sourcing agh!" goodenoughsoftware.net, 2010 (frequently cited via Fowler bliki).

**Secondary Citations**

Richardson, Chris. "Developing Transactional Microservices Using Aggregates, Event Sourcing and CQRS — Parts 1 &amp; 2." InfoQ, 2015. Richardson, Chris. Microservices Patterns. Manning, 2018 (Pattern: CQRS, microservices.io). Khorikov, Vladimir. "Types of CQRS." enterprisecraftsmanship.com. Dahan, Udi. Interview on CQRS, DDD and NServiceBus. InfoQ. Bellemare, Adam. Building Event-Driven Microservices. O'Reilly, 2020.

**E-commerce Example**

In an Order bounded context: a PlaceOrder command is handled by the Order aggregate, which enforces invariants (item availability, payment capture) and emits an OrderPlaced domain event. A separate read model — an OrderSummaryView table or document store — listens to OrderPlaced, OrderShipped, and OrderCancelled events and projects a denormalized view optimized for the customer's 'My Orders' page (order date, status, total, item thumbnails). The Catalog bounded context similarly separates: a UpdateInventory command goes through the Inventory aggregate, while a ProductListView read model (denormalized, cached) serves product search queries. This lets the write side scale transactionally and the read side scale for high read throughput independently.

**Common Mistake**

Conflating CQRS with Event Sourcing and adopting both everywhere. The most frequent mistake is treating CQRS as a system-wide architecture — applying it to all bounded contexts regardless of complexity — when it should only be used in specific portions of a system where the benefit of separate read and write models outweighs the added operational complexity (eventual consistency, synchronization, extra infrastructure). Fowler explicitly notes that the majority of cases attempting CQRS have not been successful and it has been seen as a significant force for getting a software system into serious difficulties.

**Anti-Pattern**

Event-Sourced Monolith: Applying Event Sourcing (and CQRS as its enabler) uniformly across all services creates an event-sourced monolith — a distributed system where every service publishes and subscribes to every other service's events, producing monstrous data-flow diagrams and tight event-schema coupling that is hard to evolve. Greg Young has stated that 'a whole system based on Event Sourcing is an anti-pattern' (InfoQ, 2016). A second anti-pattern is CQRS Everywhere — treating CQRS as a default architectural style for simple CRUD services, introducing eventual consistency, dual-model complexity, and projection lag where a single model with synchronous reads would suffice.

**Event Storming / EDA Connection**

CQRS maps directly onto Design-Level Event Storming artifacts: the Command stickies (blue) on the ES board correspond to the write side — they trigger Aggregate state changes. The Domain Event stickies (orange) are the output of those commands. The Read Model stickies (green) on the ES board are exactly the CQRS query projections — they display the state the read model projects from the event stream. In EDA terms, commands flow into the write side via a command bus; domain events flow out and are consumed by projection handlers that update read models. CQRS is therefore the implementation pattern that operationalizes the Design-Level EventStorming output: commands become command handlers, events become event handlers that update views, and read models become the query side.

**Contested Interpretations**

1. CQRS vs. CQS scope: Fowler and Young agree CQRS is an architectural-level extension of Bertrand Meyer's CQS method-level principle, but practitioners debate how 'segregated' the models must be (same database with different query paths = Type 1 CQRS per Khorikov; fully separate data stores = Type 3). 2. Coupling to Event Sourcing: Young originally conceived CQRS to enable Event Sourcing. Vernon and Richardson describe them as independent — CQRS does not require Event Sourcing. Fowler agrees they are separable. However, some practitioners (and Udi Dahan's early work) still treat them as synonymous. 3. Command return values: Young's strict reading prohibits commands from returning data (fire-and-forget); Fowler acknowledges the pragmatic variant where commands return identifiers or acknowledgement payloads to support UI feedback.

**Thai Audience Note**

Thai architects from traditional 3-tier / SOA backgrounds typically build a single service layer that both validates business rules and populates screens. The CQRS mental shift — that the model exposing a 'My Orders' screen is a completely different object graph from the model enforcing order placement rules — is counterintuitive when the team has always shared one ORM entity class for both. The eventual consistency in the read model (the screen may show stale data for milliseconds to seconds after a command) is also culturally uncomfortable in environments where Oracle database ACID guarantees are the baseline expectation. It helps to introduce CQRS starting from the read side: 'stop hitting the same domain model for reporting; build a separate projection database optimized for queries.'

**Related Concepts**

Event Sourcing (often paired; provides the event log that the CQRS read side projects), Domain Event (the output of a command that propagates to read model projections), Aggregate (the write-side consistency enforcer that handles commands), Saga and Process Manager (coordinates multi-step business processes using commands and events across aggregates), Bounded Context (CQRS should be applied per bounded context, not system-wide), Integration Event (events crossing bounded context boundaries that may feed external CQRS read models), Repository (write side infrastructure for loading and persisting aggregates), Application Service (orchestrates command handling — validates, loads aggregate, calls domain method, persists, publishes event).

**Recent Developments (2020–2025)**

In August 2025, Netflix published a case study on replacing a Kafka+Cassandra-based CQRS architecture for their Tudum platform with RAW Hollow, an in-memory object store. The team concluded that for their specific use case the CQRS pattern was not the optimal approach; eliminating it removed cache invalidation problems and reduced data propagation times significantly. This signals growing community nuance around CQRS: the pattern is appropriate for high-complexity write domains needing independent read scaling, but should be challenged when the entire dataset fits in memory or when simpler materialized-view approaches suffice. The 2024 evolution of the Microservices Architecture pattern language (Richardson, microservices.io) continues to position CQRS as an essential data management pattern in event-sourced microservices, not as a universal default.

**Implementation Pattern**

Three implementation levels exist (per Khorikov's taxonomy): (1) Simple CQRS — same database, separate query objects bypassing the domain model for reads (no separate write model per se). (2) CQRS with separate read store — write side persists to a normalized transactional database; projection handlers subscribe to domain events and update a denormalized read store (e.g., MongoDB, Redis, Elasticsearch). (3) Event-Sourced CQRS — write side persists a sequence of domain events (EventStoreDB, Kafka compacted topic); read side replays events to build projections. Level 1 is a safe starting point for complex query requirements in a monolith. Level 2 is the microservices standard, requiring the Outbox pattern to reliably publish events. Level 3 couples tightly with Event Sourcing and is appropriate only for audit-heavy, temporally-sensitive domains.

**Workshop Activity**

Design-Level Event Storming is the primary workshop activity that produces the input artifacts for a CQRS implementation: Command stickies (write side triggers), Aggregate stickies (write side handlers), Domain Event stickies (outputs that feed projections), and Read Model stickies (query side targets). Running a Design-Level ES session on the Order bounded context directly yields the command handlers, event publishers, and read model projections needed to implement CQRS. The Aggregate Design Canvas (DDD Crew) further refines the write-side aggregate boundaries before coding.

**Decomposition Signal**

CQRS is a tactical implementation pattern, not a boundary concept. The signal to apply CQRS within a bounded context is: (1) read load vastly exceeds write load (e.g., 100:1 reads to writes on the Order list screen); (2) query shapes are structurally incompatible with the write-side domain model (joining data across aggregates, denormalization required for performance); (3) the domain is complex enough that the write model must protect invariants at the cost of query usability; (4) the bounded context already publishes domain events, making projection maintenance low-cost. Conversely, if CRUD suffices and queries map cleanly onto the write model, CQRS adds unnecessary complexity.

**Evolution &amp; Refactoring**

CQRS systems typically evolve in this sequence: (1) Start with a unified model, noticing that complex queries degrade performance. (2) Introduce Simple CQRS — bypass the domain model for reads using direct SQL/ORM projections. (3) Extract a separate read store as query complexity or read throughput grows. (4) Introduce Event Sourcing only when audit trails or temporal queries are required. The main refactoring challenge is event schema evolution: when aggregate models change, historical events must remain interpretable. Strategies include upcasters (transform old event formats at read time), versioned event types, and event migration scripts. Bounded context boundaries may also shift — if a read model requires data from multiple services, the decomposition itself may be wrong and recombination (or a dedicated reporting context) is the correct refactoring move.

**Conway's Law Implication**

CQRS can create natural team seams: a platform team owns the event infrastructure and projection framework, while feature teams own individual command handlers and read model projections. However, if the read side and write side of the same bounded context are owned by different teams, Conway's Law predicts the communication overhead will produce an anemic write model (teams avoid adding business logic that breaks the other team's projections) or a stale read model (the projection team is always a sprint behind the command team). The safest org structure is a single cross-functional team owning one bounded context end-to-end — both write and read sides — so the team communication boundary aligns with the technical segregation, not cuts across it.

**Data Mesh / Analytics Note**

The CQRS read model is a natural bridge to analytics: a projection handler can simultaneously update an OLTP read store (for user-facing queries) and publish to a data warehouse or data lake (for BI/ML). In a data mesh context, the CQRS event stream (domain events) can serve as the data product — analytics consumers subscribe to the same events the read model projections consume. However, care is needed: CQRS read models are optimized for specific bounded-context queries and are not general analytical schemas. Thai enterprises with strong BI culture often try to use CQRS read models directly as BI sources, leading to brittle pipelines when projection schemas change; a dedicated analytics context or data product layer is preferable.

**Testing Approach**

Write side (command handling): unit test the aggregate in isolation — given a state (or event history), when a command is issued, assert the resulting domain events or state change. No database needed. Application service (command orchestration): integration test with a real database — load aggregate, invoke command, assert persisted state and published events. Read side (projections): integration test — publish a domain event to the projection handler, assert the read store is updated correctly. End-to-end: fire a command via the API, wait for eventual consistency, assert the read model reflects the new state. Avoid mocking the read store in projection tests; use an in-memory or test-container database to catch schema mismatches.

**Tooling &amp; DSL**

Axon Framework / Axon Server (Java): purpose-built CQRS+Event Sourcing framework with command bus, event bus, projection support, and Axon Server as event store. EventStoreDB: open-source event store supporting CQRS projections via persistent subscriptions. Eventuate Platform (Chris Richardson): Saga + CQRS framework for microservices. MediatR (C# .NET): lightweight command/query dispatcher enabling Simple CQRS without a dedicated framework. Context Mapper DSL: can model bounded contexts and application services at a level that maps to CQRS command/query separation. Miro/Mural: Design-Level EventStorming templates from DDD Crew surface the read model stickies that become CQRS projections.

**Legacy Modernization Relevance**

CQRS is a useful incremental extraction tool when strangling a legacy monolith. Step 1: identify a high-read-load module (e.g., order history). Step 2: introduce a Simple CQRS read path — bypass the legacy ORM with a direct SQL projection query, without touching write logic. Step 3: as the write side is extracted into a new service, subscribe its events to maintain the read projection in the new service's own store. The Strangler Fig pattern works well here: the legacy system continues to handle writes initially, while the new service's read model is populated from the legacy system's events (via Event Interception or CDC). The Anti-Corruption Layer (ACL) translates legacy data formats into the new bounded context's domain events before feeding the projection.

### Event Sourcing


**Definition**

Event Sourcing is a persistence pattern that ensures every change to the state of an application is captured as an immutable event object, and that these event objects are themselves stored in sequence for the same lifetime as the application state. The current state of any aggregate is derived by replaying the event sequence from the event store — the event log is the authoritative source of truth. It is a persistence mechanism, not a domain modeling requirement; aggregates using event sourcing store events instead of the current-state snapshot. Key capabilities unlocked: temporal queries (state at any past point), audit trails without extra infrastructure, and event replay for debugging or building new projections.

**Primary Citation**

Fowler, Martin. 'Event Sourcing.' martinfowler.com (eaaDev), 2005. Fowler defines the core invariant: every state change is stored as an event object in sequence; the event log alone is sufficient to reconstruct any past or current state. Richardson, Chris. 'Microservices Patterns.' Manning, 2018 (ch. 6) — formalises Event Sourcing as a microservices-grade persistence pattern paired with CQRS.

**Secondary Citations**

Vernon, Vaughn. 'Implementing Domain-Driven Design.' Addison-Wesley, 2013 (ch. 8) — covers aggregate event sourcing in detail. Richardson, Chris. 'Developing Transactional Microservices Using Aggregates, Event Sourcing and CQRS.' InfoQ, 2015 — two-part article covering practical implementation. Doomen, Dennis. 'Event Sourcing Done Right — Experience from the Trenches.' DDD Europe 2020, covered by InfoQ.

**E-commerce Example**

In an e-commerce system, an Order aggregate uses Event Sourcing: instead of storing a single orders row with status='SHIPPED', the event store holds an ordered stream: [OrderPlaced (items, customerId, totalAmount), PaymentReceived (paymentId, amount), InventoryReserved (warehouseId, lineItems), OrderShipped (trackingId, carrier), OrderDelivered (deliveredAt)]. To compute the current state (e.g., 'what is this order's status?'), the service replays the stream. If a refund is required, a RefundInitiated event is appended — the original events are never mutated. Temporal queries are free: 'what was the cart total at 14:03?' — replay up to that timestamp. Projections build read models for the UI: an OrderSummaryProjection subscribes to the stream and maintains a denormalised orders_summary table optimised for listing queries (CQRS).

**Common Mistake**

Conflating Event Sourcing with Event-Driven Architecture (EDA). Event Sourcing is a persistence mechanism for storing aggregate state as a sequence of events; EDA is a system integration style where components communicate via events. A system can be event-driven without using Event Sourcing (e.g., it publishes domain events but persists aggregates in a relational DB), and it can use Event Sourcing without being broadly event-driven (e.g., a single service stores its aggregate state as events but calls other services synchronously). Mixing up the two leads teams to either apply Event Sourcing globally (where most aggregates don't benefit) or to assume EDA automatically confers Event Sourcing's audit and temporal-query benefits.

**Anti-Pattern**

1. 'Event Sourcing Everywhere' (Whole-System Event Sourcing): applying Event Sourcing as the default persistence strategy across all bounded contexts creates an event-sourced monolith. Greg Young and the DDD community classify this as an anti-pattern — CQRS and Event Sourcing should be applied selectively only in contexts where audit history, temporal queries, or event replay are genuine business requirements (InfoQ, 2016). 2. 'Mixing Persistence Mechanisms' for the same aggregate: persisting both an event history and a current-state snapshot of the same aggregate in the same transaction introduces inconsistency — state cannot always be reliably rebuilt from events. 3. 'Events as Implicit Commands' across bounded contexts: publishing internal event-sourcing events (fine-grained state-change records) directly to other bounded contexts creates tight coupling; internal events must be translated into stable Integration Events at context boundaries.

**Event Storming / EDA Connection**

Event Storming and Event Sourcing share the same primitive — the Domain Event (orange sticky note in Event Storming). In a Design-Level Event Storming session, the sequence of orange stickies on the timeline for a given aggregate directly maps to the event stream that Event Sourcing would persist. The orange stickies become the event types stored in the event store; Commands (blue) become the triggers that produce them; Policies (purple) become event handlers or projections. In EDA flow terms, Event Sourcing provides the write-side persistence; projections subscribed to the event store feed the read-side (CQRS) and downstream bounded contexts. The event stream in the store is effectively the audit log that Event Storming's Big Picture session aims to reconstruct narratively.

**Contested Interpretations**

1. Is Event Sourcing a DDD pattern or merely an infrastructure pattern? Fowler introduced Event Sourcing independently of DDD (2005); Vernon's IDDD (2013) integrated it into DDD as the preferred aggregate persistence for complex domains. Khononov (2021) treats it as an optional infrastructure choice, not a DDD requirement — this is the more widely accepted post-2015 position. 2. CQRS as mandatory companion: many practitioners treat CQRS as inseparable from Event Sourcing (because replaying events to answer queries is inefficient). Fowler and Young clarify that CQRS and Event Sourcing are independent patterns that often compose well, but neither requires the other. 3. Scope of application: the community disagrees on how widely Event Sourcing should be applied — from 'core domain only' (Fowler, Young) to 'any aggregate with rich history requirements' (Vernon). The consensus since ~2016 is to apply it selectively, not as a default.

**Thai Audience Note**

Thai architects from traditional 3-tier/SOA/CRUD backgrounds think in terms of a canonical 'current state' table as the source of truth. The idea of deleting or not storing the current state, and deriving it by replaying a log, is counter-intuitive and initially feels unreliable. Common confusion: equating the event store with an audit log added on top of the real database — but in Event Sourcing the event store IS the database; there is no separate state table. Additionally, traditional Thai enterprise architects are accustomed to UPDATE and DELETE as normal operations; the append-only, immutable constraint of Event Sourcing conflicts with ingrained CRUD instincts. The performance concern ('replaying millions of events is slow') is real but addressed by snapshots — this must be demonstrated concretely to build confidence.

**Related Concepts**

Domain Event (the immutable fact that Event Sourcing stores), Aggregate (the unit whose state is rebuilt by replaying its event stream), CQRS (separates write-side event store from read-side projections — almost always paired with Event Sourcing), Domain Event (the orange sticky note that maps 1:1 to stored events), Saga and Process Manager (long-running processes that react to events emitted by event-sourced aggregates), Repository (in Event Sourcing, the Repository loads/saves aggregates by reading/appending events, not rows), Integration Event (events published outside the bounded context, translated from internal event-sourcing events), Application Service (orchestrates command handling and event persistence)

**Recent Developments (2020–2025)**

2020–2025: The community has reached a strong consensus that Event Sourcing is a selective pattern, not a default architecture — applying it system-wide is now widely cited as an anti-pattern. EventStoreDB (formerly Event Store) released v20.10 (2021) with gRPC as the default protocol, multi-language clients (Go, Node.js, Rust, Haskell), and improved security, maturing into a production-grade event store platform. The InfoQ Architecture Trends 2023 and 2024 reports note sociotechnical architecture (Team Topologies, Conway's Law awareness) as the emerging complement to Event Sourcing — event stream ownership must align with team ownership. InfoQ's 2024 event-driven banking article confirms event-sourced cores remain the dominant pattern in high-auditability financial domains, while the broader community has standardised on CQRS + Event Sourcing + Transactional Outbox as the reliable trio for event-sourced microservices.

**Implementation Pattern**

1. Command handling: an Application Service receives a command, loads the aggregate from the Event Store (by replaying its event stream), calls the aggregate method, and the aggregate emits new domain events. 2. Persistence: new events are appended atomically to the aggregate's stream in the Event Store (EventStoreDB, Marten, custom). Optimistic concurrency via expected-version prevents lost-update races. 3. Snapshots: periodically persist a materialized snapshot of aggregate state; on load, start from the latest snapshot + subsequent events only — avoids replaying unbounded histories. 4. CQRS read side: projections (event handlers) subscribe to the event stream and maintain denormalized read models (SQL, Redis, Elasticsearch) optimized for query patterns. 5. Integration: internal events are translated into Integration Events at context boundaries and published via a message broker (Kafka, RabbitMQ) — the Transactional Outbox pattern ensures reliability. 6. Event versioning: use upcasters or versioned event types (OrderPlacedV2) to handle schema evolution without migrating historic events.

**Workshop Activity**

Design-Level Event Storming: the sequence of orange stickies (Domain Events) for a given aggregate directly models the event stream that Event Sourcing would store — making Design-Level ES the natural discovery activity before deciding to use Event Sourcing. Aggregate Design Canvas (DDD Crew): explicitly calls out the aggregate's event output, helping teams decide if the event history has sufficient business value to justify Event Sourcing. Big Picture Event Storming surfaces which aggregates have a rich history of business facts (a strong signal that Event Sourcing is appropriate).

**Decomposition Signal**

[not-applicable] Event Sourcing is a tactical/persistence pattern applied within a bounded context, not a boundary-drawing signal. However, as a secondary signal: if an aggregate's entire business value lies in its history (e.g., a financial ledger, an audit trail, a workflow history), that is a strong signal to apply Event Sourcing for that aggregate specifically. If multiple teams need to independently query the history of the same entity, it may signal that the entity belongs in its own bounded context with an event-sourced write model and multiple read-side projections owned by different teams.

**Evolution &amp; Refactoring**

Event Sourcing systems face two primary evolution challenges: (1) Event schema evolution — since historic events are immutable and must remain readable indefinitely, schema changes require careful versioning. The community has converged on two techniques: copy-transform migration (read the old event store, transform events to the new schema, write to a new store) and upcasting (transform old event shapes to new shapes on read, at runtime). Additive changes (new optional fields) are safe; removing or renaming fields is breaking. (2) Aggregate boundary refactoring — splitting or merging aggregates in an event-sourced system is expensive because the event history is tightly coupled to the aggregate's identity. The canonical refactoring is to freeze the old aggregate's event stream, migrate state to the new boundary, and start a new event stream — a costly operation that reinforces the importance of getting aggregate boundaries right upfront via Event Storming.

**Conway's Law Implication**

Event Sourcing makes aggregate ownership explicit: the team that owns an aggregate's bounded context also owns its event store stream, its event schema, and its projection logic. In Thai enterprises with hierarchical, siloed IT departments (separate ERP team, CRM team, e-commerce team), this creates governance questions: who owns the event schema contract? Who is responsible for upcasting when it changes? Conway's Law predicts that event schema boundaries will mirror team boundaries — if the org is siloed, events will be designed too narrowly or too broadly to compensate for org friction. A practical implication: Event Sourcing works best when a single autonomous team owns the full write+read lifecycle (Command → Aggregate → Event Store → Projections); cross-team event schema dependencies should be mediated by Integration Events with explicit ownership.

**Data Mesh / Analytics Note**

An event-sourced system is a natural fit for data mesh architectures: the event store stream is a first-class analytical data product owned by the producing domain team. Projections from the event store can feed both operational read models and analytical pipelines — the same stream of OrderPlaced, PaymentReceived, OrderShipped events used for operational CQRS can be consumed by a Flink or Spark Streaming job to build a real-time revenue dashboard or fraud-detection model. Thai enterprises with strong BI culture benefit specifically because the event history provides richer context than traditional CDC (column-level change capture): events carry business intent and vocabulary, making BI reports interpretable by business users. The event store effectively becomes an immutable, auditable data lake at the domain level.

**Testing Approach**

Event Sourcing naturally enables a clean Given/When/Then test pattern for aggregates: Given a sequence of past events (the aggregate's history), When a command is handled, Then specific new events are produced. This is fully deterministic and requires zero infrastructure — the aggregate is a pure function from events to events. Unit tests: load aggregate from a list of in-memory past events, call a command method, assert the new events list. Integration tests: write events to a real event store, load the aggregate, verify state. Projection tests: publish a sequence of events, assert the resulting read model. This test suite is highly maintainable because there is no mocking of repositories or databases — only event lists.

**Tooling &amp; DSL**

EventStoreDB (eventstore.com): purpose-built event store with stream-per-aggregate model, subscriptions (catch-up and persistent), gRPC API, multi-language clients. Marten (martendb.io): .NET library that turns PostgreSQL into an event store — lower ops overhead for teams already on Postgres. Axon Framework (Java): full CQRS+ES framework with Axon Server as dedicated event store. Axon Server Standard Edition is open source (InfoQ, 2018). EventCatalog: documents event streams, schemas, and producer/consumer relationships. Miro/Mural with DDD Crew Event Storming templates: orange sticky note sessions map directly to event store stream design. Context Mapper DSL: can model bounded context event flows that translate to Event Sourcing stream boundaries.

**Legacy Modernization Relevance**

Event Sourcing is particularly valuable in Strangler Fig migrations from monoliths. Strategy: (1) use Event Interception — capture state changes in the legacy monolith as domain events (via CDC/Debezium or explicit hooks) and feed them into the new service's event store; (2) the new service builds its read models from these events, operating in parallel with the monolith; (3) once the new service's event-sourced aggregate is the authoritative write source, the monolith path is retired. The append-only nature of Event Sourcing also helps with rollback: since the monolith's data is never deleted, reverting to it is feasible during the transitional period. For Thai enterprises on legacy SOA/ESB, existing message logs (often retained by the ESB) can sometimes be transformed into initial event streams to bootstrap the event store, reducing the migration gap.

### Supple Design


**Definition**

Supple Design is a cluster of design principles — Intention-Revealing Interfaces, Side-Effect-Free Functions, Assertions, Closure of Operations, Conceptual Contours, Standalone Classes, and a Declarative Style — that together put the power inherent in a deep model into the hands of a client developer. A supple design reveals a deep underlying model that makes its potential clear. The client developer can flexibly use a minimal set of loosely coupled concepts to express a range of scenarios in the domain. Design elements fit together in a natural way with a result that is predictable, clearly characterized, and robust. Supple Design is the complement to deep modeling: deep modeling produces an incisive model; supple design makes that model usable in code.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003, Chapter 10 ('Supple Design'). The chapter defines all seven principles and introduces the idea that 'restructuring yields supple design.' Also: Evans, Eric. DDD Reference (2015). domainlanguage.com — the compact reference edition describes each supple design pattern with its definition and intent.

**Secondary Citations**

Vernon, Vaughn. Implementing Domain-Driven Design. Addison-Wesley, 2013 — references Supple Design principles in the context of Aggregate and Value Object design, emphasizing side-effect-free methods and intention-revealing method names. InfoQ (2023): 'Late Architecture with Functional Programming' (infoq.com/news/2023/04/late-arch-functional-programming/) notes that functional architecture enables supple domain models that anticipate change through immutability and closure. Khorikov, Vladimir. Enterprise Craftsmanship blog (enterprisecraftsmanship.com) — applies supple design principles in C# and .NET, especially around value object immutability and testability of side-effect-free functions.

**E-commerce Example**

In an online shop, Supple Design manifests across all domains. In the Catalog domain, an Intention-Revealing Interface names a method calculateDiscountedPrice(CustomerTier, Quantity) rather than compute(int, int) — both the purpose and the expected return are clear. In the Cart domain, a Side-Effect-Free Function on a Money value object — Money.add(Money other) returns a new Money — lets client code freely combine price calculations without worrying about order or mutation; the Cart's subtotal is a pure derivation. Assertions enforce invariants: an Order aggregate asserts that totalAmount equals the sum of its line items after every command. Closure of Operations applies when CartLineItem.withUpdatedQuantity(Quantity q) returns a new CartLineItem — the operation is closed over its type. Conceptual Contours guide decomposition: ShippingAddress and BillingAddress are kept as separate Value Objects rather than one generic Address because they change independently and for different reasons (shipping updates on re-order, billing updates on card change). Standalone Classes emerge in the Pricing domain: a DiscountPolicy class can be understood and tested without importing Catalog or Inventory. The Declarative Style surfaces in a DSL-like fluent API: Order.place().withItems(items).forCustomer(customer).applyPromotion(promo) reads like domain language.

**Common Mistake**

Treating Supple Design as a style guide for naming conventions alone, rather than as a coherent set of principles that reinforce each other. Teams rename methods to sound 'intention-revealing' but still write methods that mutate state, accumulate side effects, and return void — undercutting testability and composability. The deeper mistake is not following through: Intention-Revealing Interfaces without Side-Effect-Free Functions still leaves callers unable to safely combine operations. The full power of Supple Design emerges only when the principles are applied together: revealing names enable discoverability; side-effect-free functions enable safe combination; assertions document contracts; closure reduces conceptual dependencies.

**Anti-Pattern**

Anemic Domain Model — the fully named failure mode that arises when Supple Design principles are ignored. When methods do not reveal intent, when every method is a void mutator with side effects, and when no assertions or closures exist, behavior migrates out of the domain objects into procedural service layers. The result is objects that are pure data bags (getters and setters), with all logic in transaction scripts. Fowler defines and criticises this explicitly at martinfowler.com/bliki/AnemicDomainModel.html: 'The fundamental horror of this anti-pattern is that it's so contrary to the basic idea of object-oriented design; which is to combine data and process together.' Supple Design's seven principles are the prescription for avoiding or curing the Anemic Domain Model.

**Event Storming / EDA Connection**

Supple Design principles directly shape how Event Storming artifacts are named and structured. Intention-Revealing Interfaces correspond to the naming discipline applied to Domain Events (orange stickies) — events must be named in past tense with business-meaningful names (OrderPlaced, PaymentDeclined) rather than technical names (RecordInserted). Commands (blue stickies) should reveal actor intent (PlaceOrder, not ProcessRequest). Side-Effect-Free Functions align with the Read Model (green sticky) principle: projections that derive read-optimized views from events are naturally side-effect-free — they query state without mutating it. Assertions map to invariants expressed on Aggregate stickies and enforced inside the Aggregate boundary. Closure of Operations is visible in event chains: a CartUpdated event produces another CartUpdated event of the same conceptual type — the operation stays within the domain vocabulary. In EDA flows, Declarative Style emerges in policy (purple sticky) expressions: 'whenever PaymentConfirmed, then ReserveInventory' is a declarative rule, not an imperative procedure.

**Contested Interpretations**

Evans (2003) describes Supple Design as primarily a tactical code-level concern — a set of principles for designing classes and operations. Functional programming practitioners (and some DDD community members) argue that side-effect-free functions and closure of operations are naturally achieved in functional languages (F#, Haskell, Scala) without deliberate effort, and that the OO-centric framing of Supple Design is a limitation of Evans' original text. InfoQ's 2023 functional programming coverage supports this view. Vernon (2013) does not dedicate a chapter to Supple Design as a standalone concept, folding most of the principles into his Value Object and Aggregate chapters — which some practitioners interpret as Vernon de-emphasizing Supple Design as a named cluster. Khononov (2021) does not use the term 'Supple Design' prominently, preferring to discuss the individual principles (especially immutability and value objects) in separate contexts, creating uncertainty about whether 'Supple Design' remains a useful cluster name in modern DDD discourse.

**Thai Audience Note**

Thai architects from 3-tier CRUD and SOA backgrounds are accustomed to writing void service methods that mutate database rows directly — the exact opposite of Side-Effect-Free Functions and Intention-Revealing Interfaces. The concept that a method should return a value rather than mutate state conflicts with the transaction-script patterns taught in most Thai enterprise Java/.NET training. Additionally, Assertions (design-by-contract invariants) are culturally unfamiliar — Thai enterprise teams typically validate at the controller/API layer only, leaving domain objects without self-enforcing invariants. The Declarative Style goal is also challenging: enterprise middleware (Spring Batch, BPEL workflow engines common in Thai banks and telcos) encourages imperative orchestration rather than declarative domain expression.

**Related Concepts**

Value Object, Entity, Aggregate, Ubiquitous Language, Domain Event, Domain Service, Bounded Context, CQRS

**Recent Developments (2020–2025)**

Since 2020, functional programming has become the most visible influence on Supple Design principles. Java Records (GA in Java 16, 2021) and C# 9 Records (2020) provide compiler-enforced immutability that realizes Side-Effect-Free Functions and Closure of Operations with less boilerplate. InfoQ's 2023 article 'Late Architecture with Functional Programming' (infoq.com/news/2023/04/late-arch-functional-programming/) explicitly connects functional architecture to supple domain models: 'Functional architecture makes extensive use of advanced abstraction to implement reusable components and supple domain models that anticipate the future.' DDD Europe 2023 and 2024 sessions (documented at domainlanguage.com) continued to explore functional DDD approaches that naturally realize Supple Design without explicit application of the seven-principle framework — suggesting the community is absorbing Supple Design into language-level idioms rather than treating it as a named checklist.

**Implementation Pattern**

Supple Design most naturally aligns with the Functional Core, Imperative Shell pattern: the domain model (Value Objects, Aggregates, Domain Services) is implemented as a functional core of pure, side-effect-free functions with closure properties; infrastructure concerns (persistence, messaging, HTTP) are confined to an imperative shell. CQRS reinforces Supple Design by separating the Command side (imperative mutations that enforce assertions/invariants via Aggregates) from the Query side (side-effect-free read projections). In Event Sourcing, every domain operation that produces events is naturally side-effect-free from the perspective of the caller: the function takes a state and a command, and returns events — nothing is mutated inside the function. The Outbox pattern and Saga choreography operate at the infrastructure shell level and do not directly affect Supple Design principles in the domain core.

**Workshop Activity**

Design-Level Event Storming is the primary workshop that surfaces and validates Supple Design choices. Participants assign names to Commands (blue) and Domain Events (orange) — the naming exercise directly tests Intention-Revealing Interfaces. The Aggregate Design Canvas (DDD Crew, ddd-crew.github.io) makes explicit the commands handled, events produced, and invariants enforced by an Aggregate — directly corresponding to Intention-Revealing Interfaces, Side-Effect-Free outputs, and Assertions respectively. Domain Storytelling (domainstorytelling.org) captures Declarative Style requirements: domain experts narrate 'when customer places an order, the system reserves inventory' — a declarative policy that should be reflected in code.

**Decomposition Signal**

Supple Design is a tactical design pattern cluster rather than a boundary-drawing concept; however, Conceptual Contours — one of the seven principles — directly addresses decomposition signals. The signal to apply Conceptual Contours is: operations that frequently change together belong in the same Value Object or class; operations that change independently belong in separate classes. Linguistic signals matter: when domain experts refer to 'the billing address' and 'the delivery address' as distinct concepts, that is a signal they should be separate Value Objects even if they share the same fields. Rate-of-change signals: when one part of a concept is updated by Pricing and another by Shipping, Conceptual Contours dictate splitting the concept at that boundary. For Standalone Classes, the signal is transitive dependency chains — if understanding class A requires understanding B, C, and D, the chain is too long and decomposition is needed.

**Evolution &amp; Refactoring**

Evans names the refactoring trajectory explicitly: 'Restructuring Yields Supple Design.' Teams begin with transaction scripts or anemic domain models and iteratively extract behavior into Value Objects (Side-Effect-Free Functions, Closure of Operations), introduce assertion-based invariants into Aggregates, and rename operations to reveal intent (Intention-Revealing Interfaces). The canonical refactoring moves are: (1) Replace Primitive with Value Object — adds Closure; (2) Extract Method with descriptive name — adds Intention-Revealing Interface; (3) Convert void mutator to returning new state — adds Side-Effect-Free Function; (4) Add @Invariant / guard clause to constructor — adds Assertion. Over time, as the team's understanding deepens, the model becomes more expressive (Declarative Style) and individual classes become more self-contained (Standalone Classes, Conceptual Contours). In legacy brownfield systems, these refactorings can be applied incrementally behind a Strangler Fig facade without disrupting existing behavior.

**Conway's Law Implication**

Supple Design operates at the intra-team, code-level scope — it does not directly prescribe team boundaries. However, Standalone Classes and Conceptual Contours have an indirect Conway's Law implication: when a class requires importing and understanding models from multiple other teams' bounded contexts, it signals that either the bounded context seams are wrong or that the class violates the Standalone Class principle. Teams that own highly coupled shared libraries often find those libraries are exactly the anti-pattern Standalone Classes warns against. Intention-Revealing Interfaces also affect inter-team communication: when a team exposes a poorly named API (Open-Host Service or Published Language), consuming teams cannot infer intent, increasing integration friction — a sociotechnical overhead that Conway's Law amplifies.

**Data Mesh / Analytics Note**

Supple Design's Side-Effect-Free Functions and Closure of Operations principles align well with the Data Mesh concept of data products that are read-only, queryable, and self-describing. A Data Mesh domain data product is analogous to a read model derived from side-effect-free projections of domain events — it cannot be mutated by consumers. Intention-Revealing Interfaces apply to the data product API: column names, schema names, and contract definitions should reflect domain language, not technical storage names. However, Supple Design's emphasis on rich behavior in domain objects conflicts with the analytical layer's need for flat, denormalized, columnar data — the rich Value Objects of the operational model are flattened into primitive columns in BI pipelines, losing their behavioral contracts. Thai enterprise BI teams should be made aware that a Money value object does not survive the ETL boundary and must be reconstructed semantically.

**Testing Approach**

Supple Design's Side-Effect-Free Functions make domain objects the easiest possible unit test targets. A side-effect-free function on a Value Object has no dependencies to mock: given input X, expect output Y. Assertion-based invariants can be tested by attempting to construct an invalid state and asserting the exception. Closure of Operations is tested by verifying the return type matches the input type (e.g., Money.add(Money) returns Money, not decimal). Intention-Revealing Interfaces improve test readability — a test that calls order.placeWithPromotion(promo) is self-documenting. For Aggregate invariant assertions, unit tests verify that commands either succeed (producing events or state changes) or raise domain exceptions. No integration tests or mocks are needed for the pure-functional core; integration tests apply only at the imperative shell (repositories, message buses).

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) supports declaring Value Objects and Aggregates with intention-revealing names, and generates PlantUML diagrams that surface whether classes are truly standalone or entangled. In Java, Lombok's @Value annotation and Java Records enforce immutability, supporting Side-Effect-Free Functions and Closure of Operations. In C#, EF Core Owned Types and C# 9+ Records support the same. For workshop facilitation, the Aggregate Design Canvas (ddd-crew.github.io) provides a structured template that surfaces Intention-Revealing Commands, produced Events, and enforced Invariants — directly mapping to three of the seven Supple Design principles. Miro and Mural EventStorming templates include sticky-note annotation cards for data payloads and invariants.

**Legacy Modernization Relevance**

Supple Design principles are the safest entry point for DDD adoption in brownfield systems. In a Strangler Fig modernization, teams can introduce Intention-Revealing Interfaces and Side-Effect-Free Functions incrementally: wrap legacy void-mutator services in new classes that return new state objects, without touching the underlying database. Assertions can be added as guard clauses in the Anti-Corruption Layer (ACL) that translates legacy data into the new domain model — catching invalid legacy state at the integration seam rather than propagating it. Conceptual Contours guide how to split a legacy God Object: identify which methods change together (belong in one class) and which change independently (should be separated). The DDD Reference document 'Getting Started with DDD When Surrounded by Legacy Systems' (domainlanguage.com, 2013) explicitly addresses this scenario, advocating for applying Supple Design principles first within a Bubble Context before attempting full bounded context extraction.

### Model Exploration Whirlpool


**Definition**

The Model Exploration Whirlpool is Eric Evans' iterative, non-linear process for discovering and continuously refining domain models in collaboration with domain experts. First published by Domain Language, Inc. (dated June 2010), it is explicitly not a development process — it is a complementary loop that fits inside most iterative methodologies (Agile, Lean, Scrum). The central theme is to keep challenging the model. The process cycles through four interacting activities: (1) Scenario Exploration — walk through real business scenarios to stress-test existing model assumptions and expose misalignments between the model and domain reality; (2) Model Sketching — rapidly sketch alternative model structures on a whiteboard or paper, aiming for at least three distinct candidate models, choosing concrete concepts and relationships without committing to code; (3) Challenging and Probing — challenge each candidate model against the scenarios and write small code probes (spikes) to verify that the model can actually be expressed in code at an acceptable complexity; (4) Distillation and Refactoring for Deeper Insight — identify which elements of the model are core versus incidental, refactor the code to reflect the improved model, and look for the breakthrough moment where a new concept suddenly simplifies a previously complex area. The whirlpool is self-referential: completing one cycle produces new scenarios or reveals new model opportunities, pulling the team back into the loop. Objectives: enable rapid exploration of business scenarios and domain models, shorten the feedback cycle for model ideas, and head off exploding complexity in the software design.

**Primary Citation**

Evans, Eric. 'Whirlpool Process of Model Exploration.' Domain Language, Inc., 2010 (document dated 6/19/2010). Available at: https://www.domainlanguage.com/ddd/whirlpool/ — Self-described as 'Another violent water metaphor brought to you by the author of DDD!' Evans introduced the whirlpool as a supplementary guidance document after receiving repeated requests for concrete advice on model exploration in Agile settings, independent of his 2003 book. The companion diagram is available at https://www.domainlanguage.com/ddd/whirlpool/attachment/ddd_model_exploration_whirlpool-2/

**Secondary Citations**

Kenny Baas-Schwegler, 'Model Exploration Whirlpool — Domain-Driven Design: The First 15 Years,' Xebia Blog / Leanpub anthology essay, 2019 — demonstrates applying the whirlpool in conjunction with Event Storming and Example Mapping, and describes using TDD code probes within the whirlpool cycle. DDD Crew, 'DDD Starter Modelling Process,' ddd-crew.github.io, 2020–present — explicitly positions the whirlpool as the ancestor of the Starter Modelling Process; notes the whirlpool covers model-code alignment within a bounded context while the Starter Modelling Process extends to socio-technical architecture. Evans, Eric. 'DDD Reference,' Domain Language, 2015 — includes distillation concepts (Core Domain, Segregated Core, Cohesive Mechanisms) that are the strategic-level complement to the tactical whirlpool loop.

**E-commerce Example**

An online shop team discovers that their Order context is growing unmanageable. They invoke the whirlpool: (1) Scenario Exploration — they walk through 'Customer applies a promotional coupon at checkout' and 'Customer partially returns an order' with domain experts. Both scenarios break the current Order aggregate, which lacks a concept of 'Pricing Policy.' (2) Model Sketching — the team sketches three alternatives on a whiteboard: (a) embed coupon rules inside Order; (b) introduce a PricingPolicy value object that Order references; (c) introduce a separate Pricing bounded context. (3) Challenging and Probing — they write a code spike for option (b): a PricingPolicy applied to a list of CartItems returns a PricedBasket value object. The scenario 'partial return recalculates refund using original pricing policy' passes with option (b) but is intractable with option (a). (4) Distillation — the team recognises that PricingPolicy is a first-class domain concept (a breakthrough); they refactor Order to hold a reference to the PricingPolicy ID and extract pricing calculation into a domain service. The code simplifies, new promotional scenarios become straightforward, and the ubiquitous language gains 'Pricing Policy' as an explicit term. The loop then restarts: the domain expert asks about 'tiered pricing for B2B customers,' triggering a new scenario exploration cycle.

**Common Mistake**

Treating the whirlpool as a one-time design session at the beginning of a project rather than as an on-demand, recurring loop invoked whenever the model is struggling. Many teams run an initial Event Storming or domain modelling workshop, declare the model 'done,' and then proceed to implement without returning to the whirlpool as complexity grows. Evans explicitly states the whirlpool should be called upon at any time of need throughout the lifetime of application development. The result of treating it as a single ceremony is that the domain model fossilizes at its initial naive state while the business domain continues to evolve — the code accumulates workarounds rather than model refinements.

**Anti-Pattern**

Premature Convergence — the team stops cycling through the whirlpool after evaluating only one or two model candidates instead of Evans' recommended minimum of three. This produces a model that satisfies the first few scenarios encountered but collapses under edge cases because no alternative conceptualizations were attempted. In literature, this failure mode connects to the broader 'Anemic Domain Model' anti-pattern (Fowler, martinfowler.com): when teams converge too quickly on a CRUD-style model (entity = database table), they never discover the richer behavioral abstractions the whirlpool is designed to surface. Fowler describes the Anemic Domain Model as incurring all the costs of a domain model without yielding any of the benefits — the whirlpool's scenario-challenge-probe cycle is the corrective mechanism Evans designed to prevent this outcome.

**Event Storming / EDA Connection**

Event Storming and the Model Exploration Whirlpool are complementary and mutually reinforcing. A Big Picture Event Storming surfaces domain events (orange stickies), commands (blue), actors (yellow), policies (purple), and hotspots (pink) — this output is the ideal raw material for the whirlpool's Scenario Exploration step. Each hotspot on the event storm board identifies a scenario worthy of a whirlpool cycle. Conversely, the model sketches produced in the whirlpool are validated by replaying them against the event storm timeline: does the candidate model support every event transition on the board? The code probe step in the whirlpool, when implemented using TDD, naturally produces domain events as outputs of aggregate commands — these map directly to the EDA event flow. In Design-Level Event Storming, the whirlpool's model-sketch-probe loop is embedded inside the workshop itself: participants sketch aggregates on the board, challenge them with scenarios (Given/When/Then notation), and discard or refine models in real time. Kenny Baas-Schwegler (Xebia, 2019) explicitly integrates EventStorming as the scenario-generation mechanism for the whirlpool.

**Contested Interpretations**

1. Process vs. framework: Evans insists the whirlpool is not a process but a collection of feedback loops. Some practitioners (including those who wrote 'Domain-Driven Design: The First 15 Years,' Leanpub 2019) treat it as a prescriptive process with defined steps, which Evans has explicitly resisted. 2. Relationship to Agile ceremonies: Paul Rayner (InfoQ, 2016) argues the whirlpool integrates naturally with Agile sprint planning and retrospectives; others argue that sprint cadence is too short for meaningful whirlpool cycles and that the whirlpool belongs at the story refinement level. 3. Scope relative to Event Storming: Kenny Baas-Schwegler integrates EventStorming into the whirlpool scenario step; however, Evans' original whirlpool document predates the widespread adoption of EventStorming (Brandolini, 2013) and does not prescribe any particular collaborative discovery technique for scenario generation. Whether EventStorming is a preferred mechanism for the whirlpool or simply one compatible option is contested in community practice. 4. Overlap with DDD Starter Modelling Process: The DDD Crew acknowledges the whirlpool as the conceptual ancestor of their process but notes the whirlpool is narrowly focused on model-code alignment, while the Starter Modelling Process extends to organizational design — making direct comparison difficult.

**Thai Audience Note**

Thai architects from traditional SOA and 3-tier CRUD backgrounds typically expect a defined, auditable process with named phases and deliverable gates. The whirlpool's deliberate anti-process framing ('this is not a development process') is culturally jarring: there is no Gantt chart slot for 'model sketching' or 'code probe.' The concept of intentionally exploring at least three models before converging also conflicts with a deadline-driven culture where 'the fastest design wins.' Facilitators should frame the whirlpool as a structured technical spike within each sprint — a time-boxed activity with a visible whiteboard output — to make it legible to Thai PMO governance. The breakthrough concept (sudden model simplification) is also unfamiliar: Thai IT teams tend to equate more complexity with more capability, so the idea that removing a concept from a model is progress requires explicit coaching.

**Related Concepts**

DDD Starter Modelling Process, Ubiquitous Language, Bounded Context, Strategic Distillation Tools, Domain (Core/Supporting/Generic), Subdomain Types, Domain Event, Aggregate, When to Use DDD, CQRS, Event Sourcing

**Recent Developments (2020–2025)**

In 2024, Eric Evans (at Explore DDD, March 2024 — covered by InfoQ) encouraged DDD practitioners to experiment with LLMs as a new tool for model exploration. Evans proposed that a trained language model can act as a bounded context proxy, and that the whirlpool's scenario-challenge loop can be partially accelerated by using LLM-generated domain scenarios to stress-test candidate models. Evans published follow-up articles on Domain Language (domainlanguage.com, 2024–2025) exploring LLMs as components within deterministic systems, suggesting the whirlpool loop could incorporate LLM-assisted scenario generation while keeping humans in control of model decisions for the Core Domain. The DDD Crew's Starter Modelling Process (updated 2021–2023) explicitly references the whirlpool as the inspiration for its iterative design and has extended it with more explicit tooling recommendations (EventStorming, Aggregate Design Canvas, Bounded Context Canvas) that were not specified in Evans' original 2010 document.

**Implementation Pattern**

The whirlpool's code probe step is most naturally implemented via TDD: write a failing test that expresses a domain scenario in the ubiquitous language, then implement the minimum model that makes it pass. This red-green-refactor cycle is the micro-level counterpart of the whirlpool's macro-level scenario-sketch-challenge-distil loop. At the architectural level: (a) When the whirlpool produces a model where command processing and query concerns are clearly separate, CQRS is the natural implementation pattern. (b) When the whirlpool identifies that a sequence of state transitions is the core concept (breakthrough: 'our Order is really a state machine'), Event Sourcing becomes appropriate — the domain events surfaced by the whirlpool's scenario exploration map directly to the event store. (c) When the whirlpool reveals that a complex operation spans multiple aggregates (e.g., checkout spans Cart, Payment, Inventory), the Saga pattern (choreography via domain events or orchestration via a process manager) handles the distributed coordination. (d) The Outbox Pattern ensures that domain events produced during a whirlpool-informed aggregate command are reliably published to the EDA infrastructure.

**Workshop Activity**

The whirlpool is itself a collaborative workshop format, but it integrates with specific DDD Crew tools at each step: Scenario Exploration uses Big Picture EventStorming (orange stickies) or Design-Level EventStorming (aggregate swimlanes) to generate scenarios; Model Sketching uses whiteboard sketching or the Aggregate Design Canvas (DDD Crew); Challenging uses Example Mapping (BDD Given/When/Then) to formalize scenario-model fit tests; Distillation can be supported by the Bounded Context Canvas and Core Domain Chart. The whirlpool cycle itself is the meta-activity that decides when to use each of these tools and in what order.

**Decomposition Signal**

The whirlpool itself generates decomposition signals rather than applying them: (a) Linguistic divergence during scenario exploration — when the same term means different things in different scenario sequences, a bounded context boundary is signalled. (b) Model sketch incompatibility — when no single candidate model can satisfy two distinct groups of scenarios without becoming a god object, a subdomain split is signalled. (c) Code probe complexity explosion — when a probe for a scenario requires more than a handful of objects to express, the model is carrying too much responsibility and distillation or decomposition is needed. (d) Breakthrough recognition — when a new concept (e.g., 'Pricing Policy') suddenly makes previously complex code simple, the old model was conflating two concerns that should be separated. These signals emerge from the whirlpool cycle itself rather than being detected upfront.

**Evolution &amp; Refactoring**

The whirlpool is designed as an ongoing evolutionary mechanism, not a one-off modelling session. As a bounded context matures, whirlpool cycles shift from model discovery (early, many sketch iterations) to model refinement (later, incremental code refactoring). Canonical refactoring moves that emerge from whirlpool cycles: (a) Segregated Core — isolating the most domain-rich elements of an overcrowded model into a separate layer or module after distillation identifies them as the Core Domain; (b) Aggregate splitting — when a probe reveals that one aggregate has grown to coordinate too many invariants, splitting it into two aggregates with an eventual consistency relationship (domain event between them) is the refactoring move; (c) Introducing Supple Design patterns — Intention-Revealing Interfaces, Side-Effect-Free Functions, Assertions — applied after the whirlpool identifies that the current code's expressiveness is blocking scenario exploration. The whirlpool's breakthrough moment typically signals that a major refactoring move (often Segregated Core or a new Value Object extraction) is ready to be executed.

**Conway's Law Implication**

The whirlpool is a technical practice focused on model-code alignment, and Evans' original document does not address team structure directly. However, the process has an implicit Conway's Law consequence: the developer(s) who participate in the whirlpool loop — running code probes, sketching models, challenging scenarios with domain experts — must have authority and time to refactor the codebase when a better model is found. In hierarchical Thai enterprise IT departments where developers are separated from architects (who design) and business analysts (who talk to domain experts), the whirlpool's required collaboration is structurally blocked. Implementing the whirlpool requires at minimum a cross-functional sub-team (1–2 developers + 1 domain expert) with an allocated time-box per sprint — a structural change that implies the Inverse Conway Maneuver at the team level.

**Data Mesh / Analytics Note**

The whirlpool is a tactical-to-strategic modeling tool that operates at the bounded context or aggregate level. When the whirlpool's distillation step identifies Core Domain concepts (e.g., PricingPolicy, InventoryAllocation), those concepts become first-class data products in a Data Mesh architecture: the domain events emitted by these aggregates (PricePolicyApplied, InventoryAllocated) are the source-of-truth data products consumed by analytical pipelines. Thai enterprises with Oracle/SAP BI cultures often have separate 'data layer' teams that directly query source databases — the whirlpool's model boundaries suggest instead that BI queries should consume published domain events from the Core Domain, not raw tables. This is a useful framing because it connects the whirlpool's output (a refined domain model with explicit domain events) to a concrete architectural decision that BI teams understand.

**Testing Approach**

The whirlpool's code probe step is most naturally expressed as a TDD spike: write a failing test in the ubiquitous language (e.g., 'given a cart with three items and a 10%-off coupon, when checkout is processed, then PricedBasket total equals sum minus discount'), implement the minimum model to pass, then evaluate whether the model scales to other scenarios without the test suite exploding. These probes are deliberately disposable — they are not production tests but model validity tests. When a model candidate survives the probe gauntlet, the team promotes the probe tests into the production aggregate unit test suite. Contract tests at bounded context seams verify that domain events produced by the refined model match the schema expected by downstream consumers — these are the permanent test artefacts that survive the whirlpool cycle.

**Tooling &amp; DSL**

Scenario Exploration: physical whiteboard or Miro/Mural with EventStorming templates (orange event stickies, blue command stickies); Example Mapping cards (story / rules / examples / questions). Model Sketching: whiteboard sketches, CRC cards, or Aggregate Design Canvas (DDD Crew Miro template at ddd-crew.github.io). Code Probing: any TDD-capable IDE; Context Mapper DSL (contextmapper.org) can encode the candidate model as a versioned DSL artifact for comparison across whirlpool cycles. Distillation: Core Domain Chart (DDD Crew), Bounded Context Canvas (Miro template). The whirlpool document itself is a free PDF from domainlanguage.com; the accompanying diagram is available at the whirlpool attachment page.

**Legacy Modernization Relevance**

The whirlpool is particularly valuable in brownfield scenarios because it provides a structured mechanism for discovering what the legacy model actually is versus what it should be. In practice: (1) Run scenario exploration against the current legacy code path — this surfaces the implicit model embedded in procedural scripts and stored procedures. (2) Sketch alternative models that would handle the same scenarios more cleanly — this produces the target model for a Strangler Fig extraction. (3) Write code probes in the new service alongside the legacy system — the probe is the 'bubble' of the Bubble Context pattern, isolated from the legacy model by an Anti-Corruption Layer. (4) Distillation identifies which legacy concepts should be translated (via ACL) and which should be re-conceptualized from scratch. Evans' 2013 companion document 'Getting Started with DDD When Surrounded By Legacy Systems' (domainlanguage.com) extends the whirlpool explicitly for brownfield entry points including the Bubble Context and Autonomous Bubble patterns.

## Collaborative Tools


### Domain Storytelling


**Definition**

Domain Storytelling is a collaborative, visual, and agile modeling technique in which domain experts narrate concrete scenarios — called domain stories — using a simple pictographic language. Each sentence in a story follows the pattern: an actor performs an activity on a work object (optionally sending it to another actor). The resulting diagram is built incrementally as the moderator records each step, making the knowledge-transfer observable and correctable in real time. The technique was systematized by Stefan Hofer and Henning Schwentner (WPS – Workplace Solutions) in the book 'Domain Storytelling: A Collaborative, Visual, and Agile Way to Build Domain-Driven Software' (Addison-Wesley, 2022). Stories are categorized along three orthogonal axes: Time (as-is vs. to-be), Scope (coarse-grained vs. fine-grained), and Purity (pure — no software actors — vs. digitalized — software systems shown). Domain Storytelling is used for discovering bounded contexts, eliciting ubiquitous language, deriving requirements, and aligning technical teams with business experts in Domain-Driven Design projects.

**Primary Citation**

Hofer, Stefan and Schwentner, Henning. 'Domain Storytelling: A Collaborative, Visual, and Agile Way to Build Domain-Driven Software.' Addison-Wesley Signature Series (Vernon), 2022. ISBN 978-0-13-787082-4. The technique was first publicly presented by the authors at DDD Europe conferences and is documented at https://domainstorytelling.org/.

**Secondary Citations**

InfoQ podcast (2022): 'Domain Storytelling with Stefan Hofer and Henning Schwentner' — covers use for bounded context discovery and DDD integration. InfoQ news (2018): 'Finding Bounded Contexts Using Domain Storytelling' — describes indicator-based method for detecting context boundaries from domain stories. Nick Tune (2020): 'Domain Message Flow Modeling' (domainstorytelling.org/articles/domain-message-flow-modeling/) — an extension technique directly inspired by Domain Storytelling for visualizing inter-context communication.

**E-commerce Example**

A team building an online shop uses Domain Storytelling to model the order placement flow. In a coarse-grained, as-is, pure story: a Customer searches the Catalog, selects a Product, adds it to the Cart, and places an Order. A coarse-grained digitalized story adds software actors: the Customer uses the Shop Frontend, which calls the Order Service; the Order Service sends a payment request to the Payment Service; the Payment Service notifies the Shipping Service to dispatch a package. Three bounded-context indicators appear: (1) the word 'order' means different things to the Customer (a purchase decision) and to the Shipping team (a fulfillment job); (2) the Payment Service uses its own language (transaction, authorization, settlement) that does not appear in the Catalog or Cart; (3) handoff arrows cross between human actors and software systems at context seams. These indicators suggest at least three bounded contexts: Shopping (Catalog + Cart), Order Management, and Payment. A fine-grained, to-be, digitalized story then models the checkout subprocess in detail: the Customer submits payment details, the Shop Frontend calls Payment Service to authorize the card, Payment Service calls the external gateway, receives confirmation, and publishes a PaymentAuthorized event consumed by the Order Service.

**Common Mistake**

Modeling all edge cases and exception paths in a single domain story instead of focusing on the most important scenario (the happy path or the 80% case). A common mistake is treating Domain Storytelling like a comprehensive process specification tool — trying to capture every variation, error case, and conditional branch in one diagram. This produces illegible, overloaded diagrams and slows the session to a halt. The technique is designed for focused storytelling of one scenario at a time: model the core case first, then create separate stories for important variations. Trying to force branching logic and loops into a single narrative defeats the simplicity that makes the method accessible to non-technical domain experts.

**Anti-Pattern**

Story Without a Storyteller — conducting a Domain Storytelling session without a genuine domain expert narrating. When a business analyst, product manager, or developer narrates the story from their own understanding (rather than eliciting it from a domain expert), the resulting diagrams codify assumptions rather than discovered domain knowledge. This mirrors the broader DDD anti-pattern of 'developer-driven ubiquitous language' where technical vocabulary replaces domain vocabulary. Hofer and Schwentner emphasize that the domain expert must be the narrator and the moderator records exactly what is said, using the expert's words for actor and work-object labels — not translations or technical synonyms. A related anti-pattern is Digitalized-First Modeling: starting with software systems as actors before establishing the pure (software-free) business story. This prematurely anchors the model to the existing system rather than the business intent.

**Event Storming / EDA Connection**

Domain Storytelling and Event Storming are complementary discovery tools used at different points of a DDD project and with different focal lengths. Domain Storytelling is actor-centric and narrative-driven: stories show who does what with which work object, making human workflow and system responsibility visible. Event Storming is event-centric: the orange sticky notes capture what happened in time, surfacing commands, policies, and read models. A typical combined workflow: (1) Begin with coarse-grained Domain Stories to establish the business vocabulary, identify actors, and sketch the high-level process — this reveals candidate bounded context seams before any event storming begins. (2) Use Big Picture Event Storming to map the full domain timeline, using the actor and work-object vocabulary already discovered in step 1 to label commands and policies correctly. (3) Use fine-grained, digitalized Domain Stories to validate the software design after Design-Level Event Storming, checking that the proposed command/event model matches how domain experts narrate the workflow. In EDA implementations, the activity arrows in Domain Stories (e.g., 'Order Service sends payment request to Payment Service') correspond directly to domain events on a message broker. The work objects (order, payment, shipment) become the event payloads. Domain Message Flow Modeling, directly inspired by Domain Storytelling, provides a dedicated notation for the inter-context event topology.

**Contested Interpretations**

1. Scope relative to Event Storming: Practitioners disagree on when to use Domain Storytelling versus Event Storming; Hofer and Schwentner acknowledge both can model overlapping situations. Some practitioners (infoq.com podcast, 2022) argue Domain Storytelling is better for onboarding non-technical stakeholders because its sentence structure is immediately intuitive, while Event Storming scales better for complex technical design exploration. No community consensus exists on a definitive sequencing rule. 2. Pure vs. digitalized stories as requirements: Some teams treat pure stories as business requirements and digitalized stories as software specifications, blurring the technique's modeling role with formal specification. Hofer and Schwentner caution that domain stories are models for understanding, not binding contracts. 3. Bounded context boundary detection: The 'three indicators' heuristic (language divergence, ownership shift, handoff crossing) is described as a signal, not proof, of a bounded context boundary. Critics note this is subjective and depends heavily on the moderator's DDD experience to interpret correctly.

**Thai Audience Note**

Thai architects from SOA/3-tier/CRUD backgrounds tend to model systems first (software boxes and database tables) rather than business workflows with human actors. Domain Storytelling's insistence on starting with pure stories — no software actors at all — feels unproductive to teams accustomed to drawing system diagrams immediately. Facilitators should clarify that 'pure' does not mean ignoring technology permanently; it means establishing the business ground truth before adding software. Additionally, Thai organizational culture can make domain experts reluctant to narrate in front of an audience and have their words recorded in real time, particularly if management is present. Running smaller, role-homogeneous sessions before a cross-functional workshop can lower this barrier. The actor-activity-work-object sentence structure translates naturally into Thai grammatical patterns and can be explained with Thai-language story examples.

**Related Concepts**

Event Storming, Bounded Context, Ubiquitous Language, Context Mapping Patterns, DDD Starter Modelling Process, Domain Message Flow Modeling, Subdomain Types, Domain (Core/Supporting/Generic), Aggregate

**Recent Developments (2020–2025)**

Since the book publication (Addison-Wesley, 2022), three notable developments have occurred. (1) Architecture Modernization integration: Nick Tune's 'Start Your Architecture Modernization with Domain-Driven Discovery' (InfoQ, 2022) formalized Domain Storytelling as the first activity in a four-step brownfield DDD discovery process, replacing ad-hoc interviews with structured storytelling sessions as the input to context mapping and roadmap planning. (2) 'Domain-driven Transformation' (Lilienthal and Schwentner, 2024): A new book co-authored by Schwentner specifically applies Domain Storytelling to monolith-to-microservices migrations, extending the technique's scope from discovery into incremental architecture change. (3) Egon.io evolution: The open-source Domain Story Modeler (egon.io) added a 'replay' feature for step-by-step story playback during workshops and expanded export formats, making remote workshop facilitation more practical. Domain Storytelling is now featured in the DDD Starter Modelling Process as the recommended tool for the Discover step in conjunction with Event Storming.

**Implementation Pattern**

Domain Storytelling is a discovery and design tool, not an implementation pattern itself. However, its outputs map directly to implementation decisions: (1) Actors in digitalized stories correspond to microservice or bounded context boundaries — each software actor in the diagram is a candidate service. (2) Activity arrows crossing between software actors correspond to integration points where you must choose synchronous (REST/gRPC) or asynchronous (domain event via message broker) communication; the former tightly couples services, the latter enables event-driven choreography. (3) Work objects passed between actors become the payloads of commands or domain events; their names should flow directly into the ubiquitous language of the implementing code. (4) Coarse-grained stories inform CQRS read-model design: when an actor reads a work object compiled from multiple sources (e.g., an Order Summary combining Cart + Payment + Shipping data), this signals a candidate read model separated from the write model. (5) Fine-grained, to-be stories for multi-step checkout workflows map to Saga patterns — each activity step in the story corresponds to a Saga step that may need compensation if a downstream step fails.

**Workshop Activity**

Domain Storytelling is itself a dedicated collaborative modeling workshop activity. It is typically run before or alongside Big Picture Event Storming (to establish actor vocabulary and high-level flow), and before Design-Level Event Storming (to validate the software design against business narration). It is explicitly listed as a companion technique to the Bounded Context Canvas and Domain Message Flow Modeling within the DDD Crew toolkit.

**Decomposition Signal**

Domain Storytelling surfaces bounded context candidates through three observable indicators in the story diagram: (1) Language divergence — the same noun (e.g., 'order') appears with different meanings for different actors; this word collision signals a context boundary. (2) Ownership shift — the narrative hand-off from one human actor to another (e.g., from Customer to Warehouse Operator) maps to an organizational ownership boundary, which often aligns with a bounded context seam. (3) Handoff crossing — when a work object crosses from one software system actor to another (e.g., Order Service sends a fulfillment request to Shipping Service), the crossing arrow is a candidate integration point between contexts. Hofer and Schwentner recommend counting these indicators: finding three in the same location increases confidence that a genuine bounded context boundary exists there.

**Evolution &amp; Refactoring**

Domain stories are living models that should be revisited as domain understanding deepens. The as-is/to-be axis makes evolution explicit: teams begin with as-is stories that document the current (often imperfect) process, then co-design to-be stories that reflect the desired future state, making the gap between current and target architecture visible. As bounded contexts are extracted from a monolith, the digitalized stories evolve from a single large software actor ('the Monolith') to multiple specialized actors reflecting newly separated services. When a context is later further subdivided (e.g., splitting Order Management into Order Placement and Order Fulfillment), new fine-grained stories are written for each sub-context. Domain stories should be archived (not deleted) when superseded, as they document the reasoning behind architectural decisions — a form of Architectural Decision Record in narrative form.

**Conway's Law Implication**

Domain Storytelling makes Conway's Law visible: when a domain story requires a single activity to be performed by three different software actors owned by three different teams, the story diagram reveals the coupling that Conway's Law predicts will produce communication overhead and coordination friction. Conversely, a clean story where each actor corresponds to a single team's bounded context demonstrates the inverse Conway Maneuver in action. Thai enterprise architects who facilitate Domain Storytelling sessions frequently discover that the software actor topology in the digitalized stories mirrors the organizational chart — a strong indicator that the system was designed by communication structure rather than by domain logic. The story diagrams can be used as evidence when proposing team reorganization along bounded context lines.

**Data Mesh / Analytics Note**

Domain Storytelling has limited direct connection to data mesh and analytics concerns, but it surfaces analytically relevant domain flows. When a domain story shows a domain expert consuming a 'report' or 'dashboard' work object (e.g., a Warehouse Manager reads an Inventory Report), this reveals an implicit analytical bounded context that is separate from the transactional order/payment flow. In a data mesh architecture, each analytical data product should correspond to a domain that owns and serves its own dataset; Domain Storytelling helps identify which domains produce data that downstream analysts and BI tools consume. The Domain Message Flow Modeling extension (inspired by Domain Storytelling) has been adapted to show analytical event flows alongside operational event flows, helping teams reason about which domain events feed reporting pipelines.

**Testing Approach**

Domain Storytelling itself is not a testing tool, but domain stories serve as scenario inputs for test design. Each sentence in a domain story ('Customer places Order using Shop Frontend') maps to an acceptance test scenario: given a Customer with items in their Cart, when they submit the Order, then the Order Service records the order and the Payment Service is notified. The as-is and to-be story pairs can also be used to validate that a new feature implementation correctly reflects the to-be story's intended workflow. Fine-grained, digitalized domain stories that show software actor interactions can be translated into contract tests at bounded context seams — verifying that the integration points between services match the narrated handoffs. Teams using Example Mapping alongside Domain Storytelling can use stories as the source of 'examples' that become Gherkin scenarios.

**Tooling &amp; DSL**

Egon.io (egon.io) — the primary open-source, browser-based Domain Story Modeler built by WPS – Workplace Solutions. Requires no account, no installation, and does not store data remotely; can be self-hosted as a Docker container. Features include: step-by-step story replay for workshop use, export to SVG/PNG/DST (domain story file format), import from DST for iterative modeling. Miro and Mural are usable alternatives with custom icon sets, but lack the story-specific features (replay, story validation) of Egon.io. The domainstorytelling.org website provides a free icon set for use in drawing tools. No DSL (text-based Domain Story Language) exists in the same category as Context Mapper DSL — Domain Storytelling is inherently visual and relies on diagrammatic notation rather than text syntax.

**Legacy Modernization Relevance**

Domain Storytelling is particularly effective for brownfield scenarios because it can model the current (as-is) system accurately before designing the target (to-be) architecture. In a legacy monolith migration: (1) Run as-is, digitalized Domain Storytelling sessions with current system users to map how the monolith is actually used — this frequently reveals undocumented workflows and hidden sub-domains that do not appear in the system architecture diagram. (2) Use the bounded-context indicators (language divergence, ownership shift, handoff crossing) to identify extraction candidates for Strangler Fig decomposition. (3) Draw to-be stories for each extracted service, using them as the shared understanding between business owners and the migration team. (4) Use Anti-Corruption Layer placement decisions to bridge the legacy system vocabulary (old work-object names) with the new bounded context's ubiquitous language — the domain story diagrams make these translation points explicit as handoff arrows crossing actor boundaries. Nick Tune's 2022 architecture modernization methodology (InfoQ) formalizes Domain Storytelling as the discovery foundation for brownfield DDD-driven migration.

### Bounded Context Canvas and DDD Crew Tools


**Definition**

The Bounded Context Canvas (BCC) is a structured, one-page collaborative design tool created by the DDD Crew for documenting and designing individual bounded contexts. It guides practitioners through key design decisions by requiring them to address: the context's name and purpose, its strategic classification (core/supporting/generic, and evolution stage), its domain roles, inbound and outbound communication (commands, queries, and events), ubiquitous language terms, business decisions, assumptions, verification metrics, and open questions. The DDD Crew family also includes two companion tools: the Aggregate Design Canvas (ADC), which guides aggregate boundary design within a context by examining invariants, corrective policies, handled commands, created events, throughput, and size; and Domain Message Flow Modelling (DMFM), which visualizes the flow of messages (commands, events, queries) between actors, bounded contexts, and external systems for a single scenario. Together, these three tools provide structured workshop artefacts covering the macro-level (context boundaries), the inter-context level (message flows), and the micro-level (aggregate design).

**Primary Citation**

DDD Crew. 'Bounded Context Canvas.' GitHub, ddd-crew/bounded-context-canvas, 2019–present. https://github.com/ddd-crew/bounded-context-canvas. Contributors include Kenny Baas, Kim Lindhard, Michael Plöd, and Maxime Sanglan-Charlier. Licensed under Creative Commons Attribution 4.0 International. The canvas was inspired by the Business Model Canvas framework (Osterwalder).

**Secondary Citations**

DDD Crew. 'Aggregate Design Canvas.' GitHub, ddd-crew/aggregate-design-canvas, 2020–present. Inspired by the Bounded Context Canvas. DDD Crew. 'Domain Message Flow Modelling.' GitHub, ddd-crew/domain-message-flow-modelling, 2020–present. Influenced by Simon Brown's C4 model and Domain Storytelling. DDD Crew. 'DDD Starter Modelling Process.' ddd-crew.github.io, 2020–present — places all three tools in the step sequence: DMFM at Step 5 (Connect), BCC at Step 7 (Define), ADC at Step 8 (Code). Susanne Kaiser, 'Adaptive Socio-Technical Systems with Architecture for Flow,' InfoQ, 2022 — extends the process integrating these tools with Wardley Mapping and Team Topologies.

**E-commerce Example**

In an online shop applying the DDD Starter Modelling Process, the three DDD Crew tools are used as follows: (1) Domain Message Flow Modelling (Step 5 — Connect): a DMFM diagram is drawn for the 'Place Order' scenario. It shows: Customer→Order context (PlaceOrder command), Order context→Payment context (ProcessPayment command), Payment context→Order context (PaymentConfirmed event), Order context→Inventory context (ReserveStock command), Order context→Shipping context (OrderPlaced event). Between 5 and 9 messages on the diagram. (2) Bounded Context Canvas (Step 7 — Define): completed for the Order context — Purpose: 'manage the full lifecycle of a customer purchase from placement to fulfilment confirmation'; Strategic Classification: Core Domain, revenue-generating, custom-built; Inbound: PlaceOrder command, PaymentConfirmed event; Outbound: OrderPlaced event, CancelOrder command; Ubiquitous Language: Order, OrderLine, OrderStatus, OrderId; Business Decisions: 'an order must not be placed if stock is below the minimum threshold.' (3) Aggregate Design Canvas (Step 8 — Code): completed for the Order aggregate — Invariants: 'order must have at least one line item', 'total must be positive'; Commands: PlaceOrder, CancelOrder, ConfirmPayment; Events: OrderPlaced, OrderCancelled, PaymentConfirmed; Throughput: moderate concurrency (one command per order per second); Size: 10–50 events per order lifetime.

**Common Mistake**

Treating the Bounded Context Canvas as a documentation artefact filled in after the design is already implemented, rather than as a generative workshop tool used to surface and resolve design decisions before code is written. Teams frequently complete the BCC retrospectively to document what already exists, which means the 'open questions' and 'assumptions' sections are left empty — the very sections that reveal unresolved design risks. The canvas is designed to be filled collaboratively with domain experts and engineers together, using the structured sections to drive conversation about context boundaries, not to record them.

**Anti-Pattern**

Canvas Theatre — completing all three DDD Crew canvases (BCC, ADC, DMFM) as a big-bang design ceremony disconnected from running code, producing polished artefacts that are immediately shelved and never referenced when implementation decisions are made. The canvases become shelfware: the code's aggregates diverge from the ADC, the published events diverge from the BCC's outbound communication, and the DMFM diagrams no longer match the actual integration topology. This is a variant of the broader 'Model Drift' anti-pattern. The DDD Crew process explicitly addresses this by framing all tools as living documents to be revisited as understanding evolves — but teams with project-milestone culture treat completion of the canvases as a deliverable milestone rather than a starting point.

**Event Storming / EDA Connection**

The three DDD Crew tools bridge Event Storming output to implementation artefacts: (1) Big Picture Event Storming surfaces candidate bounded contexts at linguistic pivot points (vertical swimlane lines on the board). The Bounded Context Canvas is then used immediately post-storming to capture and refine the discovered context — its ubiquitous language terms come directly from the orange event and blue command stickies. (2) Domain Message Flow Modelling translates Event Storming's discovered event chains into explicit inter-context message diagrams, mapping orange event stickies to event messages in DMFM and blue command stickies to command messages. This gives the EDA topology: which context publishes which events, which context consumes them, and in what order for a given scenario. (3) The Aggregate Design Canvas maps the Design-Level Event Storming output (commands→aggregate→events pattern) into a structured nine-section form, making the aggregate's consistency boundary, invariants, and throughput explicit before implementation.

**Contested Interpretations**

1. Canvas ordering: The BCC documentation suggests completing sections in the presented order (top-to-bottom) for beginners, but notes that outside-in (start with communication) and inside-out (start with ubiquitous language) orderings are valid alternatives. There is no community consensus on which ordering produces better designs — it depends on team maturity and context. 2. BCC granularity: Some practitioners use the BCC at the sub-domain level (one canvas per sub-domain) and others at the bounded context level. The tool's name implies bounded context granularity, but the canvas sections (especially 'purpose' and 'strategic classification') apply equally well to sub-domains. This ambiguity is unresolved in the DDD Crew materials. 3. DMFM vs Sequence Diagrams: Some architects argue that UML sequence diagrams (which are well understood and tool-supported) serve the same purpose as Domain Message Flow Modelling, and that the DMFM's custom notation adds learning overhead without sufficient benefit. DDD Crew counters that DMFM's simplified notation is accessible to non-technical domain experts in a way UML is not.

**Thai Audience Note**

Thai enterprise architects familiar with UML and traditional SOA tend to gravitate toward sequence diagrams and service interface definitions rather than the BCC/DMFM notation. The BCC's sections on 'strategic classification' and 'domain roles' have no direct equivalent in the SOA service specification documents Thai teams are accustomed to, and the 'ubiquitous language' section conflicts with the practice of technical naming (getCustomer, updateOrder) rather than domain naming. Additionally, Thai teams with a project-delivery culture (milestones, deliverables, sign-off) will find the canvas's intended use as a living, revisitable document difficult to fit into their governance gates — facilitators must explicitly frame canvases as design-conversation tools, not sign-off documents.

**Related Concepts**

- Bounded Context
- Aggregate
- Domain Message Flow Modelling
- DDD Starter Modelling Process
- Event Storming
- Context Mapping Patterns
- Ubiquitous Language
- Subdomain Types
- Strategic Distillation Tools

**Recent Developments (2020–2025)**

2020–2022: The BCC has been updated iteratively by the DDD Crew (v3+), adding explicit sections for 'domain roles' (analysis context, execution context, gateway context classifications) and 'verification metrics' for testing whether the context boundary is correctly drawn. Multiple digital implementations now exist: DDD Toolbox (free online editor), HTML browser-editable version, Miro template, Draw.io integration, and Excalidraw template. 2022–2023: The Aggregate Design Canvas gained adoption for aggregate design sessions following Design-Level Event Storming, with the nine-section structure (including Throughput and Size sections) helping teams make concurrency tradeoffs explicit before implementation. 2023–2025: The DMFM has seen growing adoption in microservices architecture reviews as a lightweight alternative to full UML sequence diagrams — its constraint of 5–9 messages per diagram forces appropriate scenario decomposition. Community tooling on Miro and FigJam has made all three canvases accessible in remote-workshop contexts.

**Implementation Pattern**

The three tools map to different implementation pattern decisions: (1) Bounded Context Canvas — the 'inbound/outbound communication' section directly determines the event schema contracts at context boundaries. If the BCC shows asynchronous events as the primary outbound mechanism, the Outbox Pattern is the appropriate implementation choice to ensure reliable event publication. If the BCC shows synchronous query-response patterns, REST or gRPC is appropriate. (2) Domain Message Flow Modelling — the message flow diagrams reveal whether a business scenario requires Saga choreography (multiple contexts each react to events autonomously) or Saga orchestration (a Process Manager coordinates the sequence). If the DMFM shows a long, branching message chain with compensation requirements, an orchestrated Saga is indicated. (3) Aggregate Design Canvas — the Throughput section (command rate × client count) determines whether optimistic locking suffices or whether the aggregate must be split to reduce contention. The Corrective Policies section reveals where the aggregate boundary may be too tight, suggesting Event Sourcing plus compensating events rather than atomic transactions.

**Workshop Activity**

The three DDD Crew tools fit into the DDD Starter Modelling Process at specific steps: Domain Message Flow Modelling is used at Step 5 (Connect) after bounded context candidates are identified, to model how contexts exchange messages for key scenarios. Bounded Context Canvas is used at Step 7 (Define) to formalize each context's responsibilities, language, and dependencies before coding begins. Aggregate Design Canvas is used at Step 8 (Code) as the starting point for implementing aggregates — often immediately following a Design-Level Event Storming session. All three tools can also be run as standalone workshops without the full modelling process.

**Decomposition Signal**

The Bounded Context Canvas's own 'Verification Metrics' and 'Open Questions' sections surface decomposition signals directly during the workshop: if two teams cannot agree on a single 'purpose' statement for a canvas, it signals that the boundary is drawn too broadly and two canvases are needed. In the Domain Message Flow Modelling, a DMFM diagram with more than 9 messages for a single scenario signals that the scenario is too complex or that context boundaries are misaligned — some messages should be internal to a context rather than crossing context boundaries. In the Aggregate Design Canvas, a high number of 'corrective policies' signals that the aggregate boundary is too tight and should be expanded, while high Throughput signals that the aggregate is too large and should be split.

**Evolution &amp; Refactoring**

The BCC, ADC, and DMFM are designed as living documents to be updated as domain understanding evolves — not as one-time design artefacts. Common evolution patterns: (1) A BCC that starts with a large 'open questions' section and many 'assumptions' gradually has those items resolved into concrete language terms and business decisions as the team gains domain knowledge. (2) When a bounded context's BCC grows too large (many ubiquitous language terms, many inbound/outbound messages), it signals that the context should be split — the refactoring move is to create two new BCC canvases and a DMFM diagram to define how they communicate. (3) An ADC that shows many corrective policies signals that the aggregate boundary should be relaxed and an eventual-consistency approach adopted instead of strict transactional boundaries. Teams should revisit all three canvases at major product milestones (new feature, team restructuring, performance incident) rather than treating them as frozen design documents.

**Conway's Law Implication**

The Bounded Context Canvas has a direct Conway's Law implication: the 'Purpose' and 'Strategic Classification' sections define what a single team should own end-to-end. If completing a BCC requires input from multiple teams with no single owner, that is a signal that either the context boundary is poorly drawn or the team structure is misaligned. The DDD Crew recommends that each BCC corresponds to a stream-aligned team (one team, one context). In Thai enterprise IT departments with hierarchical guild structures (DBA team, middleware team, frontend team), a single BCC's ownership will span multiple functional guilds — the canvas makes this multi-guild coupling visible and forces an explicit organizational conversation about stream alignment.

**Data Mesh / Analytics Note**

The BCC's 'outbound communication' section naturally captures domain events that become data products in a Data Mesh architecture. Each bounded context's published events (as documented in the BCC) define the contract for that context's analytical data product — the event schema becomes the data product's interface. For Thai enterprises migrating from a centralized data warehouse model, the DMFM diagrams can be reused to show how analytical data flows from operational bounded contexts to reporting and BI consumers, making the case that the BCC-per-context ownership model naturally extends into data platform ownership.

**Testing Approach**

The BCC's 'inbound/outbound communication' sections define the contract test boundaries: consumer-driven contract tests (e.g., Pact) should be written for every event and command listed as outbound in the BCC, verifying that the publishing context's schema matches the consuming context's expectations. The ADC's 'handled commands' and 'created events' sections map directly to aggregate unit tests: each command should have a test asserting the expected event output and each invariant should have a test asserting it is enforced. The DMFM provides the basis for integration scenario tests: each message flow diagram represents a testable end-to-end scenario that can be implemented as a narrow integration test using test doubles at context boundaries.

**Tooling &amp; DSL**

All three DDD Crew tools are available as open-source templates on GitHub under Creative Commons Attribution 4.0 licenses. Bounded Context Canvas: available as a Miro template, Draw.io integration, Excalidraw template, HTML browser-editable version, and via the DDD Toolbox free online editor. Aggregate Design Canvas: available as a Miro template and PDF/SVG download. Domain Message Flow Modelling: available as a Miro template and pen-and-paper format. Context Mapper DSL (contextmapper.org) can encode the BCC and ADC artefacts as code, generating PlantUML context map diagrams and service stubs from the DSL definition — this allows canvas content to be version-controlled alongside code. For remote workshops, Miro is the de facto standard; FigJam and Mural are used as alternatives.

**Legacy Modernization Relevance**

The three DDD Crew tools are highly applicable to brownfield modernization: (1) The BCC can be used to document existing implicit bounded contexts within a legacy monolith before any extraction begins — mapping what currently exists before designing what should exist. Completing a BCC for a legacy module often reveals that its 'purpose' is ambiguous and its 'ubiquitous language' is inconsistent with other modules, making the case for splitting it. (2) The DMFM is used to map current integration patterns within the monolith (shared database calls, synchronous in-process calls) and to design the target event-driven integration pattern after extraction — making the before/after contrast explicit. (3) The ADC helps teams identify which aggregates in a legacy system have poor boundary design (many corrective policies, high coupling) that must be refactored before extraction. Anti-Corruption Layers are introduced at the context seams identified in the DMFM diagrams, protecting new bounded contexts from the legacy schema's language.

## Misconceptions


### Common Misconceptions


**Definition**

Three pervasive misconceptions systematically distort DDD adoption. (1) 'DDD equals microservices': DDD is a modeling philosophy focused on collaboration and language, not an architectural style; Bounded Contexts define the *largest* coherent service boundary, not necessarily a microservice. (2) 'Every project needs DDD': DDD tactical patterns (Aggregate, Repository, Domain Service) are only appropriate where domain complexity justifies them; CRUD-heavy or generic subdomains should use simpler patterns such as Transaction Script or Active Record. (3) 'Aggregate equals database table': Aggregates are consistency boundaries defined by business invariants, not by persistence schema; their physical storage may span multiple tables, documents, or a single serialized blob.

**Primary Citation**

Evans, Eric. Domain-Driven Design: Tackling Complexity in the Heart of Software. Addison-Wesley, 2003. Evans defines Bounded Context as a delimiting context for a model, not an architectural deployment unit (Part IV). He defines Aggregate as a cluster of associated objects treated as a unit for data changes, with the Aggregate Root as the only member accessible from outside (ch. 6). On applicability: 'This book should be used on projects facing complex domains where the design philosophy described here pays off.' (Preface). Fowler summarizes the complexity prerequisite: 'DDD is particularly suited to complex domains, where a lot of often-messy logic needs to be organized.' (Fowler, 'DomainDrivenDesign', martinfowler.com, 2014).

**Secondary Citations**

Khononov, Vladik. Learning Domain-Driven Design. O'Reilly, 2021 — argues that DDD should be decoupled from its tactical Domain Model pattern; once decoupled, it applies broadly through strategic tools (Ubiquitous Language, Bounded Context) even for simpler subdomains. Vernon, Vaughn. 'Effective Aggregate Design' (dddcommunity.org, 2011) — four rules for aggregate composition that explicitly separate persistence mechanics from aggregate boundaries. Hickey, James Michael. 'What Are Domain-Driven Design Aggregates?' (jamesmichaelhickey.com) — clarifies that aggregates are domain concepts, not collection classes or table proxies. Vladikk (Khononov). 'Bounded Contexts are NOT Microservices' (vladikk.com, 2018) — the canonical debunking of the BC=microservice equation.

**E-commerce Example**

Misconception 1 (DDD=microservices): An e-commerce platform has a Catalog Bounded Context. A team may deploy it as one modular monolith service or split it into three microservices (Search, Product Detail, Pricing). Both options are legitimate within the same Bounded Context; the BC boundary is about model consistency, not deployment granularity. Misconception 2 (every project needs DDD): The Inventory replenishment module runs a simple reorder-point calculation with no complex invariants — applying full DDD tactical patterns (Aggregate, Repository, Domain Event publishing) yields no benefit; a Transaction Script calling a warehouse API suffices. Misconception 3 (Aggregate=table): The Order Aggregate spans multiple database tables: orders, order_line_items, shipping_address. There is no one-to-one table mapping; the Aggregate Root (Order) enforces the invariant 'total items must not exceed 50' across all child objects regardless of physical storage layout.

**Common Mistake**

The single most frequent misapplication is conflating Bounded Context with microservice deployment unit. Teams draw one BC per microservice, then create dozens of tiny services with coupled models and chatty inter-service calls — producing a Distributed Monolith. The root error is treating DDD as an architecture prescription rather than a modeling philosophy: DDD defines *what* the boundary is (consistent language and model), not *how many* services implement it.

**Anti-Pattern**

Three anti-patterns directly emerge from the three misconceptions. (1) Distributed Monolith — services decomposed by microservice-per-BC rule end up sharing databases or requiring synchronous calls for every business operation, eliminating the autonomy microservices are supposed to provide. (2) Pattern Tax / DDD Everywhere — applying Aggregate, Repository, and Domain Events to CRUD-only modules inflates complexity, slows delivery, and produces 'anemic aggregates' with no real invariants. Related: Anemic Domain Model (Fowler, martinfowler.com). (3) ORM-Driven Aggregate Design — teams design Aggregates to match ORM entity graphs or database table rows, inverting the correct dependency: persistence is a consequence of the domain model, not its driver.

**Event Storming / EDA Connection**

Event Storming directly challenges all three misconceptions in a workshop setting. (1) Big Picture EventStorming produces a Context Map with explicitly named integration patterns (Partnership, Customer-Supplier, ACL) between BCs — making it visible that multiple microservices can live inside one BC, and that BC lines are about language, not deployment. (2) The facilitation rule 'start with the most complex flow' inherently identifies where DDD payoff is high (Orange sticky note hotspots) and where a simple CRUD flow suffices, guiding selective DDD application. (3) Design-Level EventStorming identifies aggregate consistency rules through policy and command stickies rather than through ER diagrams, making the aggregate boundary domain-driven rather than schema-driven.

**Contested Interpretations**

Misconception 2 ('every project needs DDD') is itself contested. Khononov (2021) argues that once DDD is decoupled from its tactical Domain Model pattern, strategic DDD (Ubiquitous Language, Context Mapping, subdomain classification) applies to *any* project, even simple ones — because all software benefits from consistent terminology and knowing which parts matter most. Evans (2003) and Fowler take the narrower view that DDD only pays off when the domain itself is the primary source of complexity. This creates genuine tension: practitioners who follow Khononov apply DDD strategy broadly but use simple implementation patterns (Transaction Script, Active Record) for low-complexity subdomains, while strict Evans readers may skip DDD entirely for simpler projects. Neither camp disputes the other two misconceptions.

**Thai Audience Note**

Thai enterprise architects from SOA/3-tier/CRUD backgrounds face three specific translation problems. First, in SOA practice, services are often sized by technical capability (UserService, ProductService), mapping one-to-one with microservices; the idea that a Bounded Context can contain *multiple* technical services or an entire monolith is counterintuitive. Second, Thai enterprise projects often have fixed governance checklists: DDD is either on the checklist or not, creating pressure to apply it uniformly rather than selectively by subdomain complexity. Third, ORM-centric workflows (Hibernate, JPA, Entity Framework) are dominant in Thai enterprise Java/.NET shops; thinking of persistence as a consequence of domain design rather than its blueprint requires a significant mental shift away from 'entity = table' database-first design.

**Related Concepts**

Bounded Context, Aggregate, Subdomain Types, When to Use DDD, Context Mapping Patterns, Conway's Law and Team Topologies Alignment

**Recent Developments (2020–2025)**

In 2024, Eric Evans encouraged practitioners to experiment with LLMs for DDD workflows, framing a trained language model as a Bounded Context and proposing fine-tuned models per BC as a strong separation of concerns (InfoQ, March 2024). This reinforces that DDD is a modeling philosophy adaptable to new technology, not tied to any architectural pattern. The 2023 InfoQ article on DDD physical design for microservices (Richardson, 2023) explicitly labels the BC=microservice equation as a misconception, showing community consensus has solidified. Khononov's 2021 Learning DDD remains the dominant post-2020 resource reshaping the 'every project needs DDD' narrative by separating strategic DDD (broadly applicable) from tactical DDD (complexity-gated).

**Implementation Pattern**

Debunking the three misconceptions maps to concrete implementation choices. (1) DDD != microservices: use Context Mapping patterns (Partnership, Customer-Supplier, ACL, Open-Host Service) to specify inter-context integration regardless of whether BCs are monoliths or microservices; CQRS and Event Sourcing are orthogonal options within a BC, not microservices requirements. (2) DDD not always: apply Transaction Script for Supporting subdomains with simple CRUD logic; use Active Record for moderate-complexity data-entry flows; reserve the full tactical Domain Model (Aggregate + Repository + Domain Events) for Core subdomains with complex invariants and frequent expert collaboration. (3) Aggregate != table: separate domain model from persistence model; options include ORM with mapping configuration, document serialization (e.g., JSONB column for the entire aggregate), or an Event Sourcing event store; the Aggregate Root is the only entry point for loading and saving.

**Workshop Activity**

Big Picture EventStorming (surfaces BC boundaries and hotspot complexity, revealing which subdomains warrant DDD tactics and which are CRUD flows). Bounded Context Canvas (makes integration patterns and team ownership explicit, breaking the BC=microservice assumption). Aggregate Design Canvas (drives aggregate boundaries from business invariants rather than data schema, debunking the table-mapping misconception).

**Decomposition Signal**

Signals that a boundary is a Bounded Context (not necessarily a microservice): a distinct Ubiquitous Language that would create confusion if mixed with another context's terms; a team that owns the model end-to-end; diverging rates of change from other contexts. Signals that DDD tactical patterns are warranted in a subdomain: cyclomatic complexity of business rules is high; multiple collaborating domain experts disagree on edge cases; the same term means different things in different workflows. Signals that an aggregate boundary is wrong: frequent cross-aggregate transactions in a single use case (too many aggregates); unit tests require loading the entire database graph (aggregate too large); invariant enforcement requires querying outside the root (boundary drawn at the wrong level).

**Evolution &amp; Refactoring**

The three misconceptions compound over time if uncorrected. A team that equates BC with microservice accrues the Distributed Monolith anti-pattern; the canonical refactoring move is to merge over-split services back into a modular monolith and re-draw deployment boundaries independently of BC lines. Teams that applied DDD everywhere accumulate anemic aggregates with no invariants; refactoring involves collapsing them to Active Record or Transaction Script patterns in Supporting subdomains (Segregated Core technique applied in reverse). Teams with ORM-driven aggregates find them brittle as the domain evolves; the refactoring move is to introduce an anti-corruption layer between the domain model and the persistence schema, allowing both to evolve independently.

**Conway's Law Implication**

The DDD=microservices misconception is amplified by Conway's Law pressures. When an organization has one team per microservice, managers naturally assume each team must own its own Bounded Context — reinforcing the false equation. The Inverse Conway Maneuver recommends designing team structure to match the desired BC boundaries, but those BC boundaries should be drawn for model consistency, not for deployment topology. Thai enterprise architects who control org-chart decisions need to decouple the question 'what is the boundary of our domain model?' from 'how many deployable services do we ship?' — the former is a modeling question answered by DDD, the latter is an operational question answered by operational maturity and team capacity.

**Data Mesh / Analytics Note**

The Aggregate=table misconception is particularly damaging for Data Mesh adoption. If teams treat aggregates as table proxies, they expose raw ORM tables as data products — leaking implementation detail and tightly coupling analytical consumers to operational schema. Correct DDD thinking separates the operational domain model from the analytical projection: domain events (emitted when aggregates change state) become the source of truth for building analytical read models and Data Mesh data products. This decoupling means the operational aggregate can restructure its tables without breaking BI pipelines, as long as the domain events remain stable.

**Testing Approach**

Each misconception correction has a corresponding test signal. (1) BC!=microservice: integration contract tests between BCs should pass regardless of how many microservices implement a BC; if splitting a BC into microservices breaks a contract test, the split violated the model boundary. (2) DDD not always: aggregate unit tests in a Supporting subdomain with no business invariants (only CRUD) should be trivially empty — a signal that the aggregate pattern is unwarranted there. (3) Aggregate!=table: aggregate unit tests must load and save the entire aggregate through the repository interface without leaking table structure; if a test must set up five tables to test one business rule, the aggregate boundary or repository implementation is likely wrong.

**Tooling &amp; DSL**

Context Mapper DSL (contextmapper.org) — explicitly models Bounded Contexts and their relationships independently of microservice count, making the BC!=microservice distinction concrete in code. Miro/Mural Bounded Context Canvas template (ddd-crew.github.io) — separates 'Inbound Communication' from deployment topology, helping teams see that one BC can have multiple service entry points. EventStorming digital tools (Miro, Mural, MURAL, Lucid) — Big Picture sessions produce a Context Map that shows BC integration patterns rather than a microservices decomposition diagram. For aggregate persistence, ORM mapping configuration files (Hibernate hbm.xml, EF Core Fluent API) are the practical artifact that separates domain model from schema.

**Legacy Modernization Relevance**

All three misconceptions are especially damaging in brownfield contexts. (1) Teams migrating a legacy monolith to microservices often apply the BC=microservice rule mechanically, producing hundreds of tiny services with shared databases — a worse outcome than the original monolith. The Strangler Fig pattern should extract one BC at a time, keeping that BC as a single deployable unit initially, then optionally splitting it further after establishing a clean domain model. (2) Legacy monoliths often have complex CRUD modules that practitioners assume need DDD; applying tactical patterns to them prolongs migration. The better strategy is to identify the true Core Domain within the monolith and apply DDD only there. (3) Legacy codebases have table-per-entity schemas that look like aggregates but are not; Anti-Corruption Layers between the new domain model and the legacy schema prevent the table structure from leaking into the domain, enabling the aggregate boundary to be drawn correctly even before the database is migrated.

### Domain Event vs Integration Event Distinction


**Definition**

A Domain Event is an internal fact raised by an aggregate within a single bounded context. It is lightweight, in-process, and represents something meaningful that occurred in the domain. An Integration Event is derived from one or more domain events but crosses bounded context boundaries via an asynchronous message broker. The two are distinct artefacts: Domain Events are scoped to one context (may be synchronous, rich with domain internals), while Integration Events are public contracts (always async, schema-versioned, carrying only the payload other contexts need). Conflating them leads to tight coupling across context boundaries — treating domain event schemas as the public API forces every internal refactoring to break external consumers.

**Primary Citation**

De la Torre, Cesar. 'Domain Events vs. Integration Events in Domain-Driven Design and microservices architectures.' Microsoft Developer Blogs (devblogs.microsoft.com), 2017. This article formally established the distinction between the two event types and is the most widely cited treatment. Fowler, Martin. 'Domain Event.' martinfowler.com (eaaDev), 2005 — defines Domain Events as something that happened in the domain that domain experts care about. Evans, Eric. 'Domain-Driven Design Reference: Definitions and Pattern Summaries.' Domain Language, 2015 — covers Domain Events but does not formally distinguish Integration Events as a separate term.

**Secondary Citations**

Vernon, Vaughn. 'Implementing Domain-Driven Design.' Addison-Wesley, 2013 (ch. 8) — covers Domain Events extensively; integration events implied by context integration chapters. Khononov, Vlad. 'Learning Domain-Driven Design.' O'Reilly, 2021 — explicitly distinguishes internal domain events from public events (integration events), calling the latter a context's public API. Richardson, Chris. 'Microservices Patterns.' Manning, 2018 (ch. 3-4) — covers the Transactional Outbox as the reliable mechanism for publishing integration events from domain event triggers. InfoQ (2019): 'Practical DDD: Bounded Contexts + Events =&gt; Microservices' — explains event translation at context boundaries.

**E-commerce Example**

In an e-commerce system, the Order aggregate raises an internal OrderLineItemAdded domain event each time a line item is added to the cart — this event is consumed in-process by a domain service that recalculates the cart total. When the customer confirms the order, the Order aggregate raises an OrderPlaced domain event, also in-process. The Application Service translates this into an OrderPlacedIntegrationEvent (orderId, customerId, totalAmount, lineItems summary only — no internal aggregate state) and writes it to an outbox table atomically with the order transaction. A CDC relay (Debezium) publishes the integration event to a Kafka topic. The Inventory context subscribes and reserves stock; the Payment context initiates a charge. If the internal Order model later renames 'lineItems' to 'orderLines', the integration event schema is unchanged — downstream contexts are shielded from internal refactoring. This is the critical distinction: Domain Events serve internal consistency; Integration Events serve inter-context contracts.

**Common Mistake**

Directly publishing internal Domain Events to a shared message broker consumed by other bounded contexts, without a translation step. Teams serialize their domain event objects (which contain aggregate internals, implementation-specific field names, and private identifiers) and send them to Kafka or RabbitMQ as if they were integration events. Any internal refactoring of the originating aggregate — renaming a field, changing an ID type, splitting an event — immediately breaks all downstream consumers. The root cause is treating the Domain Event as both an internal consistency signal and a public API simultaneously. The correct pattern is to explicitly translate the domain event into a separate Integration Event DTO with a stable, minimal schema at the bounded context boundary, versioned independently of the internal model.

**Anti-Pattern**

1. 'Distributed Monolith via Shared Event Schema': directly publishing internal domain event classes to a shared broker so all contexts must be updated whenever any internal model changes — the system behaves like a monolith despite running as distributed services. Described in InfoQ (2016): 'Microservices Ending up as a Distributed Monolith.' 2. 'Anemic Integration Event': publishing only an entity ID (e.g., {"orderId": 123}) and forcing consumers to call back synchronously to fetch the data they need — re-introducing synchronous coupling through the event bus back-channel. This is sometimes called the 'Query-Back Anti-Pattern.' 3. 'Dual Write' (publishing to broker without atomic outbox): writing to the database and then publishing to the broker in two separate steps — if the service crashes between them, the event is lost or duplicated. Addressed by the Transactional Outbox pattern (microservices.io). 4. 'Domain Event Leakage': a domain event designed for one purpose (triggering downstream Saga steps) is also published externally without a proper translation layer, coupling external consumers to internal Saga state machine design.

**Event Storming / EDA Connection**

In Event Storming, the distinction maps directly to the physical modelling surface: orange stickies within a single swimlane (bounded context) represent Domain Events — internal facts consumed by policies and read models within the same context. Orange stickies that cross a swimlane boundary or trigger reactions in a different context (shown by an arrow to an external system box or a different swimlane) are candidates for Integration Events. In Design-Level Event Storming, the facilitator explicitly asks: 'Is this event consumed only inside this context or does another team need to know about it?' — this question surfaces the distinction. In the Domain Message Flow Modeling canvas (DDD Crew), integration events are the labelled arrows between bounded context boxes, confirming which events are truly public. In EDA system design, this distinction determines topology: Domain Events may use in-process event buses (MediatR, Spring ApplicationEventPublisher); Integration Events always use out-of-process brokers (Kafka, RabbitMQ, Azure Service Bus).

**Contested Interpretations**

1. Terminology inconsistency: Evans (2003) did not formally introduce 'Integration Event' as a distinct term — it emerged from community practice. Khononov (2021) uses 'Public Event'; Fowler uses 'Notification Event' for overlapping concepts, creating terminology fragmentation. 2. Translation layer placement: some practitioners translate domain events to integration events inside the domain layer; others argue this belongs in the application service or infrastructure layer. No single consensus — Vernon implies application layer; Enterprise Craftsmanship recommends infrastructure. 3. Payload richness debate: minimal payloads (just IDs) force consumers to query back synchronously, re-introducing coupling; rich payloads risk leaking internal model details. No universal answer — depends on consumer autonomy requirements and update frequency. 4. Whether the distinction is necessary at all: some practitioners argue that with proper schema registries and consumer-driven contracts, publishing domain events directly to a broker is acceptable if schema evolution is carefully managed — this view is a minority but exists in the InfoQ community.

**Thai Audience Note**

Thai architects from SOA/ESB backgrounds often see both domain events and integration events as 'just messages' — the same as SOAP notifications routed through a central ESB. The critical distinction that translates poorly: Domain Events are raised intentionally by the business model and express business meaning, while ESB messages in traditional Thai enterprise IT are typically database-change notifications or service-call wrappers with no domain semantics. A second confusion point: Thai hierarchical IT departments often have a central 'integration team' that owns all inter-system messages (the ESB team). DDD requires the producing bounded context team to own and version its integration event schema — this is a significant organizational shift that Thai architects need to negotiate with leadership. Also, the idea that an internal event and a public event are explicitly different artefacts (two separate classes/schemas) is unfamiliar to teams that use a single unified event model.

**Related Concepts**

Domain Event (the internal precursor — raised by Aggregate, consumed in-process), Integration Event (the public contract derived from Domain Event at context boundary), Bounded Context (the scope that defines what is 'internal' vs 'external'), Context Mapping Patterns (Published Language and Open Host Service govern Integration Event contracts), Aggregate (origin of Domain Events that trigger Integration Events), Application Service (translation point from Domain Event to Integration Event), Saga and Process Manager (choreographed via Integration Events across contexts), CQRS (Integration Events update downstream read models), Event Sourcing (Domain Events stored as aggregate state; Integration Events are a separate publishing concern), Transactional Outbox (reliable Integration Event publishing pattern)

**Recent Developments (2020–2025)**

2020-2025: The CNCF CloudEvents specification (graduated 2024) has provided a standardized envelope format that integration events can adopt, making the Domain Event vs Integration Event distinction more concrete in implementation — Domain Events remain plain domain objects; Integration Events carry the CloudEvents envelope (specversion, source, type, id, time) when published to cloud brokers. Azure, AWS EventBridge, and Google Eventarc all natively support CloudEvents. The community has further converged on the Transactional Outbox + CDC (Debezium) as the standard reliable bridge between Domain Event (committed to DB) and Integration Event (published to broker). EventCatalog (open source, 2022+) now provides a documentation portal that explicitly models producers and consumers of integration events separately from internal domain event flows, reinforcing the distinction at the tooling level. Khononov's 'Learning DDD' (2021) reinforced the public/private event split and this framing is now standard in DDD community education.

**Implementation Pattern**

1. Two-class model: define separate Domain Event classes (rich, internal, may reference aggregate internals) and Integration Event DTOs (minimal, stable, serialization-friendly). 2. Translation in Application Service: after committing the domain transaction, the Application Service reads uncommitted domain events from the aggregate, maps each to its corresponding Integration Event DTO, and writes them to the outbox table atomically. 3. Transactional Outbox: the outbox table is written in the same DB transaction as the aggregate state change. A relay (or Debezium CDC) reads the outbox and publishes Integration Events to Kafka/RabbitMQ. This eliminates dual-write and guarantees at-least-once delivery. 4. Schema versioning: Integration Events carry a version field (or use versioned topic names); Domain Events need not be versioned unless used in Event Sourcing. 5. In-process bus for Domain Events: use MediatR (.NET), Spring ApplicationEventPublisher (Java), or a simple observer pattern for in-process Domain Event dispatch — these never leave the process boundary. 6. Out-of-process broker for Integration Events: Kafka, RabbitMQ, Azure Service Bus, or AWS SNS/SQS — these always cross process boundaries.

**Workshop Activity**

Design-Level Event Storming: the explicit question 'Is this event consumed inside or outside this bounded context?' surfaces the distinction. Facilitators draw a context boundary line on the modelling surface; orange stickies that cross it become Integration Event candidates. Domain Message Flow Modeling (DDD Crew, ddd-crew.github.io): the primary workshop tool for documenting which events are integration events — draws bounded context boxes with labeled event arrows between them, making the public contract explicit. Bounded Context Canvas: the 'Inbound/Outbound Communication' section captures which Integration Events the context publishes (outbound) and subscribes to (inbound), distinct from internal domain events.

**Decomposition Signal**

The Domain Event vs Integration Event boundary is itself a decomposition signal: if an event must be consumed by another bounded context, it reveals a context dependency. Excessive integration events flowing between two contexts signals that they may be too tightly coupled — consider whether they should be merged into one context, or whether a mediating context (e.g., an integration context or event-driven ACL) should be introduced. Conversely, if a context produces many fine-grained domain events that consumers must combine to reconstruct state, this signals a missing coarser-grained integration event design — the producing context's public API needs to be raised to a higher abstraction level. Observable signal: if consumers are subscribing to 5+ domain events just to track one business fact, the integration event design is too granular.

**Evolution &amp; Refactoring**

Domain Events can be freely refactored as long as all consumers are within the same bounded context (co-deployed). Integration Events must be evolved with breaking-change discipline: (1) Additive-only changes — adding optional fields is safe; removing or renaming fields is a breaking change. (2) Versioned event types — introduce OrderPlacedV2 alongside OrderPlacedV1; run both in parallel until all consumers migrate. (3) Upcasting — a transformation layer converts old event shapes to the new format at the consumer side. (4) Consumer-driven contract tests (Pact) — detect breaking schema changes in CI before deployment. A critical refactoring move for teams that conflated the two: introduce the translation layer incrementally — first duplicate the integration event schema from the domain event (identical fields), then decouple them field by field as the internal model evolves. This strangler fig approach avoids a big-bang rewrite of all consumers.

**Conway's Law Implication**

The Domain Event vs Integration Event boundary maps directly to team boundaries: Domain Events are owned entirely by one team (the bounded context team); Integration Events are the API contract between teams. The team that produces the Integration Event owns its schema — any change must be negotiated with consuming teams. In hierarchical Thai IT departments, where a central ESB or integration team traditionally owns all inter-system contracts, DDD requires this ownership to shift to product teams — a political challenge as much as a technical one. The Inverse Conway Maneuver recommends: first agree on Integration Event contracts between teams (the inter-team API), then design the internal Domain Event model independently within each team. This prevents internal Domain Event design from being constrained by cross-team concerns.

**Data Mesh / Analytics Note**

In a data mesh architecture, the distinction is important for data product design: Domain Events (internal) should not be exposed as data products because their schema is volatile and tied to internal aggregate implementation. Integration Events — already designed for cross-context stability — are the natural candidates for streaming data products. The domain team publishes Integration Events (e.g., OrderPlaced) to Kafka; this same topic can serve both operational consumers (Inventory context) and analytical consumers (data product: real-time order funnel dashboard). Thai enterprises with strong BI culture and central data warehouses should note: Integration Events provide richer business context than raw DB change logs (they express business intent), making them superior feeds for near-real-time analytical pipelines compared to CDC-captured row-level diffs from the operational database.

**Testing Approach**

Domain Events: pure unit tests — Given a command applied to an aggregate, assert that the aggregate's uncommitted events collection contains the expected Domain Event(s). No infrastructure required. Integration Events: integration tests verify that a domain command results in the correct Integration Event written to the outbox table (asserts on the DB row). Outbox relay tests verify that the relay/CDC reads from outbox and publishes correctly-shaped messages. Consumer-driven contract tests (Pact): the consuming context defines the Integration Event schema it expects; the producing context runs Pact provider verification in CI to catch breaking schema changes before deployment. End-to-end event flow tests: spin up producer and consumer services with a containerized broker (Testcontainers + Kafka) to assert that a command in the producer results in the expected state change in the consumer. The Domain/Integration boundary clarifies which test level applies: domain events → unit; integration events → integration/contract.

**Tooling &amp; DSL**

In-process Domain Event dispatch: MediatR (.NET), Spring ApplicationEventPublisher (Java), simple observer/subscriber pattern. Integration Event publishing: Debezium (CDC-based outbox relay), MassTransit Outbox (.NET), Eventuate Tram (Java). Schema registries for Integration Events: Confluent Schema Registry (Avro/JSON Schema/Protobuf), AWS Glue Schema Registry. Consumer-driven contract testing: Pact (multi-language). CNCF CloudEvents SDK: standardized Integration Event envelope. Domain Message Flow Modeling canvas (DDD Crew, ddd-crew.github.io): workshop tool to map integration events between contexts. EventCatalog (open source): documents integration event schemas with producer/consumer relationships — the catalogue explicitly separates internal vs. public events. Context Mapper DSL: models bounded context relationships including Published Language event contracts.

**Legacy Modernization Relevance**

This distinction is critical in Strangler Fig migrations. The legacy monolith typically has no explicit Domain Event model — state changes are recorded as audit logs or DB triggers. During extraction: (1) An Anti-Corruption Layer (ACL) wraps the legacy system and translates DB change events (CDC via Debezium) or hook-based callbacks into well-defined Domain Events within a new bounded context. (2) The new context then translates these internal Domain Events into Integration Events published to a broker, which the newly extracted microservices subscribe to. This two-step translation (legacy change → Domain Event → Integration Event) is essential: it insulates the new domain model from the legacy data model, and it insulates consumers from the ACL's translation details. In Thai SOA-to-microservices migrations, existing ESB SOAP message types can be mapped to Integration Events at the ACL boundary — preserving business semantics while replacing the ESB transport with a modern broker.

## Ecosystem


### Data Mesh


**Definition**

Data Mesh is a sociotechnical approach to analytical data architecture that applies Domain-Driven Design principles — specifically bounded contexts and domain ownership — to the analytical data plane. Coined by Zhamak Dehghani (ThoughtWorks, published on martinfowler.com, 2019/2020), it decentralizes ownership of analytical data by treating data as a product, owned and served by the domain team that generates it. Data Mesh rests on four pillars: (1) Domain ownership — each bounded context team owns its operational and analytical data end-to-end; (2) Data as a product — domain teams treat their data outputs as products with consumers, SLAs, documentation, and quality guarantees; (3) Self-serve data platform — a federated infrastructure platform enables domain teams to produce and consume data products without central pipeline teams; (4) Federated computational governance — global standards (schema, security, quality) are enforced computationally across all domain data products without requiring a central data team to own every pipeline.

**Primary Citation**

Dehghani, Zhamak. 'How to Move Beyond a Monolithic Data Lake to a Distributed Data Mesh.' martinfowler.com, 2019. https://martinfowler.com/articles/data-monolith-to-mesh.html. Dehghani, Zhamak. 'Data Mesh Principles and Logical Architecture.' martinfowler.com, 2020. https://martinfowler.com/articles/data-mesh-principles.html. Dehghani, Zhamak. Data Mesh: Delivering Data-Driven Value at Scale. O'Reilly, 2022.

**Secondary Citations**

Fowler, Martin. Supporting blog commentary and hosting of Dehghani's original articles on martinfowler.com (2019–2022). InfoQ: 'Data Mesh Architecture: A New Paradigm for Data Management' (2020) — summarizes the four pillars and community reaction. InfoQ: 'Data Mesh Paradigm Shift' presentation by Zhamak Dehghani at QCon (2021) — adds federated governance detail and self-serve platform architecture. Khononov, Vlad. Learning Domain-Driven Design. O'Reilly, 2021 — contextualizes Data Mesh as a natural extension of bounded context ownership into the data platform layer.

**E-commerce Example**

In an online shop with bounded contexts (Catalog, Cart, Order, Payment, Shipping, Inventory), Data Mesh assigns analytical data ownership to each domain team. The Order team owns the 'confirmed_orders' data product: it publishes a versioned, SLA-backed analytical table (or event stream) describing orders placed, order lines, and status transitions. The Payment team owns the 'payment_transactions' data product with settlement status and amounts. The Catalog team owns the 'product_catalog_snapshot' data product with pricing and attributes. A central BI team does not own pipelines that pull from each team's database; instead, each domain team publishes their data product to a self-serve platform (e.g., a data lakehouse), and the BI team composes reports by consuming those products. The 'Product' concept means different things in the Catalog data product (marketing attributes) versus the Inventory data product (stock quantity, SKU) — the same DDD bounded context separation applies. Federated governance ensures that all data products share a common schema registry (e.g., Avro/Protobuf schemas in Confluent Schema Registry) and a common access-control policy, even though each domain team independently produces its product.

**Common Mistake**

Treating Data Mesh as a pure technology or tool migration (e.g., 'we replaced our central ETL with distributed Spark jobs') without changing ownership, incentives, or team structure. Data Mesh is first a sociotechnical and organizational pattern — domain teams must own both the production and the quality of their data products, which requires changing how teams are measured and funded. A second common mistake is applying Data Mesh to all data uniformly: Dehghani explicitly states that Data Mesh targets domains with complex, high-value analytical data; generic or commodity data (e.g., authentication logs) does not warrant domain ownership overhead. A third mistake is confusing the data product pillar with a data catalog — a data product is an actively maintained, SLA-backed analytical asset with consumers, not merely a documented dataset in a catalog.

**Anti-Pattern**

Data Swamp Monolith — when a central data lake or data warehouse team owns all analytical data pipelines across all domains, pipelines become unmaintainable, schemas drift from domain intent, and domain teams lose trust in the data. This is the direct inverse of Data Mesh and the failure mode that motivated Dehghani's work. Also 'Data Mesh in Name Only' (DMINO) — when organizations adopt the Data Mesh label but keep centralized ownership of data pipelines under a renamed 'Data Platform Team'; domain teams remain consumers with no ownership or accountability. A third anti-pattern is 'Shadow IT Data Products' — domain teams build unofficial analytical pipelines without governance, producing inconsistent metrics ('revenue' calculated differently in six places) that cannot be federated. (Dehghani, martinfowler.com, 2020; InfoQ, 2020)

**Event Storming / EDA Connection**

Data Mesh and Event-Driven Architecture are strongly complementary. Domain Events produced by aggregates within a bounded context (surfaced during Big Picture Event Storming as orange stickies) are the natural source feed for that context's data products. In an EDA platform (e.g., Kafka), each domain team publishes its domain events to topic streams; these streams serve dual purposes: operational integration between contexts and analytical data product feeds for the Data Mesh layer. The Event Storming board's swimlane structure directly maps to Data Mesh domain ownership: each swimlane (bounded context) becomes a data domain responsible for its own event streams and analytical data products. In Design-Level Event Storming, the Read Model stickies (green) represent the query-side projections within a context — these projections are the operational analogs of Data Mesh data products for the analytical layer. The self-serve platform pillar of Data Mesh maps to the platform team in Team Topologies, which maintains the shared event bus and schema registry that all domain teams use.

**Contested Interpretations**

1. Relationship to DDD: Dehghani explicitly draws on DDD bounded contexts as the ownership granularity, but some DDD practitioners argue the mapping is imprecise — a bounded context is a modeling boundary for operational software, while a data domain in Data Mesh is an ownership boundary for analytical artifacts; these do not always coincide cleanly. 2. Scope: Some practitioners argue Data Mesh applies only to large organizations (hundreds of domain teams) and is overkill for mid-size enterprises. Dehghani and supporters argue the principles apply at any scale. 3. Self-serve platform feasibility: The self-serve platform pillar assumes a mature internal platform engineering capability that many organizations (especially Thai enterprises) do not have. Critics argue this prerequisite is frequently understated, making Data Mesh implementations fail at the platform layer. 4. Federated vs. centralized governance: The tension between federated governance (domain autonomy) and interoperability (central standards) is unresolved — different organizations draw the line differently, and Dehghani's framework does not provide a definitive resolution.

**Thai Audience Note**

Thai enterprises with strong centralized BI culture (Oracle BI, SAP BW, central EDW teams) will experience Data Mesh as a fundamental organizational inversion: instead of a central data team that owns all pipelines and schemas, domain application teams become responsible for their own analytical outputs. This conflicts with two common Thai enterprise patterns: (1) siloed IT departments where application teams and data teams are organizationally and politically separate, with data teams owning 'the truth'; (2) a culture of centralized control where schema changes require DBA approval. Data Mesh requires domain teams to have full-stack capability (application + data), which implies cross-functional team restructuring that is organizationally disruptive in hierarchical Thai IT departments. The data product concept maps well to Thai BI culture's emphasis on data quality and business reporting — framing data products as 'curated, SLA-backed data assets with an owner' resonates more than abstract architecture diagrams.

**Related Concepts**

- Bounded Context
- Domain
- Subdomain Types
- Context Mapping Patterns
- Domain Event
- Event Sourcing
- CQRS
- Conway's Law and Team Topologies Alignment
- Ubiquitous Language

**Recent Developments (2020–2025)**

2022: Zhamak Dehghani published 'Data Mesh: Delivering Data-Driven Value at Scale' (O'Reilly, 2022), consolidating and expanding the four-pillar framework with implementation guidance. 2022–2023: Major cloud providers (AWS, Azure, GCP) introduced Data Mesh reference architectures — AWS Data Mesh on Lake Formation, Azure Purview for federated governance, GCP Dataplex — making self-serve platform infrastructure more accessible. 2023–2024: The data lakehouse architecture (Delta Lake, Apache Iceberg, Apache Hudi) became the dominant self-serve storage layer for Data Mesh implementations, replacing the data lake + data warehouse two-tier approach. 2024–2025: Data Contracts (a standardized schema + SLA agreement between data producers and consumers) emerged as the practical implementation artifact for the 'data as a product' pillar, with open-source tooling (Bitol, OpenDataContract standard) gaining traction. InfoQ reported growing enterprise adoption and maturation of federated governance patterns, including computational policy enforcement via Open Policy Agent (OPA) across domain data products (InfoQ, 2024).

**Implementation Pattern**

Data Mesh is not a single implementation pattern but a combination of patterns aligned to its four pillars. For domain ownership: each bounded context team runs its own data pipeline (e.g., using dbt, Apache Spark, or Flink) against its own operational database or event stream, building and owning the data product. For data as a product: the Outbox Pattern ensures domain events are reliably emitted from aggregate transactions to Kafka, providing the raw feed for the domain's data product; CQRS read models can serve as the operational query layer while the same event stream feeds the analytical layer. For self-serve platform: a shared Event Streaming Platform (Kafka + Schema Registry) and a shared data lakehouse (Delta Lake or Iceberg on S3/GCS) provide the infrastructure layer that all domain teams use without per-team infrastructure overhead. For federated governance: schema contracts are enforced via a Schema Registry (Confluent or AWS Glue Schema Registry); access policies are enforced via column-level security in the lakehouse; data quality is enforced per domain product via Great Expectations or dbt tests. Event Sourcing is a natural fit for Data Mesh data products: the event store is simultaneously the operational audit log and the feed for the analytical data product.

**Workshop Activity**

No dedicated workshop activity was formalized by Dehghani specifically for Data Mesh. However, Big Picture Event Storming is the recommended precursor: the swimlane boundaries drawn during storming become the domain ownership boundaries in the Data Mesh. The Bounded Context Canvas (DDD Crew) can be extended with a 'data products' section to explicitly map each context's analytical outputs. Domain Storytelling can be used to map analytical data flows — 'who produces what data and who consumes it' — revealing data ownership gaps.

**Decomposition Signal**

Observable signals that indicate a Data Mesh domain boundary: (1) Different teams query the same central data warehouse table for different business purposes, using different filters and business logic — signals that the table should be split into domain-owned data products. (2) A central BI/ETL team is the bottleneck for all analytical pipeline changes — a central team cannot scale linearly with domain complexity. (3) Analytical schema definitions drift from domain terminology: if a 'shipment' in the data warehouse has different meaning than 'shipment' in the Shipping team's operational model, a domain data product boundary would re-align them. (4) Rate-of-change mismatch: the Order domain's analytics need to update in near-real-time for operations, but the central data warehouse team runs nightly batch jobs — the domain team should own the product with the latency it requires.

**Evolution &amp; Refactoring**

Data Mesh adoption typically follows a maturation path. Stage 1 (Monolithic Data Lake): a central team owns all pipelines; domains are consumers only. Stage 2 (Domain-Embedded Analytics): domain teams build shadow analytics pipelines informally, creating inconsistency. Stage 3 (Federated Data Products): domain teams formally own data products with defined schemas and SLAs, served via a shared self-serve platform. Stage 4 (Computational Governance): federated governance policies are enforced programmatically across all domain products, enabling interoperability without central coordination. The canonical refactoring move is the 'data product extraction': identify a central pipeline owned by the data team that sources from a single operational domain → transfer ownership to the domain team → wrap the pipeline output in a data product contract → retire the central team's pipeline. The Anti-Corruption Layer pattern from DDD applies during migration: new domain data products are published alongside the legacy central EDW, with adapters translating between schemas, until consumers migrate.

**Conway's Law Implication**

Data Mesh is explicitly a response to Conway's Law applied to data architecture. A centralized data team produces a centralized data architecture (data warehouse, data lake) whose schema mirrors the communication bottleneck of a single team serving all domains. Data Mesh applies the Reverse Conway Maneuver to the analytical plane: first design the desired data domain boundaries (aligned to bounded contexts), then assign full-stack teams — including analytical data ownership — to those boundaries. For Thai enterprises with hierarchical IT departments (application team, DBA team, BI team as separate cost centers), Data Mesh requires a structural change: the application team and data pipeline responsibilities must be co-located within the same stream-aligned team. This is often the hardest organizational change, not the technology change.

**Data Mesh / Analytics Note**

Data Mesh IS the analytics architecture pattern in this research set — it is the subject, not a note about how another concept extends to analytics. The key integration with other DDD concepts: every bounded context team in a DDD architecture becomes a potential data domain in the Data Mesh, responsible for both its operational software and its analytical data products. Domain Events (orange stickies in Event Storming) are the primary feed. CQRS read models are the operational analog of data products. The Ubiquitous Language of each bounded context governs the naming of its data products. Strategic Distillation (Core vs. Supporting vs. Generic subdomains) determines the relative investment in data product quality: Core Domain data products warrant highest investment; Generic Subdomain data products can be centralized or commoditized.

**Testing Approach**

Data Mesh data products are tested using data quality frameworks applied by the owning domain team. Schema contract tests: validate that the published data product schema (Avro, Protobuf, JSON Schema) conforms to its registered contract — breaking schema changes are caught in CI before publication. Data quality tests: row-level completeness, uniqueness, and referential integrity checks using dbt tests or Great Expectations, run in the domain team's pipeline before the product is published as 'ready.' SLA tests: latency and freshness assertions (e.g., 'this data product must be updated within 15 minutes of source event') monitored via observability tooling. Consumer contract tests: similar to Pact for APIs, data consumers register their expectations against a data product schema; the producer's CI runs consumer tests to prevent breaking changes. Cross-domain analytical integration tests are the responsibility of the consuming team, not the producing domain team.

**Tooling &amp; DSL**

Self-serve platform tools: Apache Kafka + Confluent Schema Registry (event streaming and schema governance); Delta Lake / Apache Iceberg / Apache Hudi (open table formats for data lakehouse); dbt (SQL-based transformation and data quality testing within domain teams); Apache Airflow or Prefect (domain pipeline orchestration). Federated governance tools: AWS Glue Data Catalog, Azure Purview, or Google Dataplex for cross-domain data product discovery and metadata governance; Open Policy Agent (OPA) for computational policy enforcement. Data Contract tooling: Bitol open standard, Schemata, or PayPal's Data Contract CLI for schema + SLA contracts between data producers and consumers. Observability: Monte Carlo, Soda, or Elementary (open source dbt-native) for data quality monitoring across domain products. No DDD-specific DSL exists for Data Mesh — Context Mapper DSL does not yet model analytical data products, though the Bounded Context Canvas can be extended manually.

**Legacy Modernization Relevance**

Data Mesh is primarily a brownfield pattern — it was explicitly designed to solve the failures of centralized data lakes and data warehouses that accumulate in large enterprises over many years. The canonical legacy modernization path: (1) Identify analytical data domains using the same Event Storming + bounded context discovery process used for operational modernization. (2) Apply Strangler Fig to the central data lake: new domain data products are built and published in parallel with legacy central pipelines, and consumers are migrated gradually. (3) An Anti-Corruption Layer translates between the legacy EDW schema and the domain's Ubiquitous Language-named data product schema, preventing domain teams from inheriting legacy naming conventions. (4) Decommission central pipelines domain by domain as consumers migrate. For Thai enterprises migrating from Oracle BI / SAP BW: the migration path is to build domain data products in an open lakehouse layer (Delta Lake, Iceberg) and migrate BI reports to consume those products, retiring the central EDW tables domain by domain. The organizational change (moving pipeline ownership to domain teams) is typically harder and slower than the technology migration.

### Wardley Mapping Legacy Modernization


**Definition**

Wardley Mapping Legacy Modernization is the application of Simon Wardley's strategic mapping technique to brownfield migration scenarios, combining it with DDD principles — specifically the Strangler Fig pattern, Anti-Corruption Layer (ACL) placement, and incremental bounded-context extraction — to migrate from a legacy monolith or SOA-based system. The Wardley Map surfaces which parts of the existing system are over-engineered custom solutions for commodity problems (candidates for replacement with off-the-shelf products) versus which parts contain genuine Core Domain logic that must be carefully re-modeled. The evolution axis (Genesis→Custom-Built→Product→Commodity) establishes extraction priority: commodity-positioned components are extracted first (lower risk, available replacement), leaving Core Domain extraction for last where DDD richness is fully applied. ACLs are placed at the boundary between the legacy system and newly extracted bounded contexts to prevent legacy model contamination of the new domain model.

**Primary Citation**

Fowler, Martin. 'StranglerFigApplication.' martinfowler.com, 2004. https://martinfowler.com/bliki/StranglerFigApplication.html — Defines the Strangler Fig pattern as the foundational approach for incremental legacy replacement. Kaiser, Susanne. Adaptive Systems with Domain-Driven Design, Wardley Mapping, and Team Topologies: Architecture for Flow. Addison-Wesley Signature Series (Vernon), 2023 — the canonical post-2020 synthesis that formally integrates Wardley Mapping with DDD for brownfield modernization. Evans, Eric. 'Getting Started with DDD When Surrounded by Legacy Systems.' domainlanguage.com, 2013 — the original guidance from Evans on applying DDD in legacy brownfield contexts, including ACL placement.

**Secondary Citations**

Tune, Nick. 'Start Your Architecture Modernization with Domain-Driven Discovery.' InfoQ, 2022 — demonstrates applying DDD discovery steps (Big Picture Event Storming, bounded context identification, context mapping) as the prerequisite before any Strangler Fig extraction begins. Richardson, Chris. 'Pattern: Strangler Application.' microservices.io — concise summary of the Strangler Fig pattern and ACL placement in a microservices migration context. Kaiser, Susanne. 'Adaptive Socio-Technical Systems with Architecture for Flow: Wardley Maps, DDD, and Team Topologies.' InfoQ, 2022 — details decomposing a 'big ball of mud' monolith into bounded contexts using Wardley Maps to set extraction priority.

**E-commerce Example**

An online shop is migrating from a legacy Oracle-based monolith that handles Catalog, Order, Payment, Inventory, and Shipping in a single codebase. The team first creates a Wardley Map of all capabilities. (1) Payment processing appears at Product/Commodity on the evolution axis — a payment SaaS (Stripe/Adyen) exists; the team uses Strangler Fig to route payment requests to the new Payment bounded context backed by Stripe, with an ACL translating between Stripe's PaymentIntent model and the internal PaymentOrder domain event. This is extracted first (lowest risk). (2) Shipping sits at Custom-Built/Product — third-party carrier APIs exist; Strangler Fig routes shipping requests to a new Shipping context with an ACL translating legacy ItemCode to internal ProductVariant. (3) Inventory sits at Custom-Built — the legacy reorder logic is bespoke but non-differentiating; extracted with a Domain Model and ACL against the legacy ERP schema. (4) Order and Catalog sit at Genesis/Custom-Built — these are the Core Domains; extracted last with full DDD richness: aggregates, domain events, CQRS. The ACL at each seam prevents the legacy schema's anemic language from contaminating the new bounded contexts' ubiquitous language.

**Common Mistake**

The most frequent misapplication is applying the Strangler Fig pattern without first drawing a Wardley Map or domain map of the monolith — starting extraction based on technical convenience (e.g., 'this module is the least coupled') rather than strategic priority (evolution stage and domain classification). Teams extract their Core Domain first because it is the most visible and politically important subsystem, when it is actually the riskiest extraction with the highest modeling complexity. The correct sequencing is: extract commodity-positioned Generic Subdomains first (low risk, off-the-shelf replacements available), then Supporting Subdomains, leaving the Core Domain for last when the team has built migration muscle and the ACL patterns are well-understood.

**Anti-Pattern**

Distributed Monolith via Premature Extraction: teams apply the Strangler Fig pattern by splitting along technical layers (UI service, API service, database service) rather than bounded context boundaries identified through DDD discovery. The result is separately deployed services that share the legacy database schema and make synchronous calls to each other for every operation — all the operational complexity of microservices with none of the autonomy or model clarity. This is described by Richardson (microservices.io) as a distributed monolith. A second named failure: 'ACL Theatre' (community term) — teams declare an Anti-Corruption Layer in their architecture diagram but implement it as a simple field-rename DTO mapper without translating domain concepts; the legacy model's anemic, table-driven language bleeds into the new bounded context's classes, defeating the purpose of the extraction.

**Event Storming / EDA Connection**

Big Picture Event Storming is the mandatory first step in the Wardley-informed modernization sequence: it maps the legacy system's business processes using orange domain-event stickies, surfacing hotspots (red stickies) at points of model confusion and cross-team friction inside the monolith. These hotspots reveal the implicit bounded context seams hidden inside the legacy code. After Event Storming, the team overlays a Wardley Map to assign evolution positioning to each discovered context cluster. In EDA migration, the Strangler Fig extraction sequence creates new bounded contexts that publish domain events to a message broker while the legacy monolith continues operating; the ACL translates legacy data changes (often polled from the legacy database via Change Data Capture) into properly named domain events for the new contexts. The Outbox pattern ensures reliable event publication from each newly extracted context without distributed transactions against the legacy database.

**Contested Interpretations**

Two areas of genuine practitioner disagreement: (1) ACL placement timing — Evans' 2013 'Getting Started with DDD When Surrounded by Legacy Systems' recommends placing an ACL as the very first step before any extraction, creating a Bubble Context inside or alongside the legacy system. Some practitioners (Richardson, microservices.io) prefer placing the ACL only at the moment of Strangler Fig extraction, arguing that an early ACL adds overhead before the boundary is well-understood. (2) Strangler Fig directionality — the original Fowler (2004) pattern describes intercepting calls at the facade level (HTTP routing layer). Some DDD practitioners apply Strangler Fig at the data level (database views or Change Data Capture replication), which differs significantly in complexity and risk. No single authoritative prescription exists for choosing between facade-level and data-level strangling in a DDD migration context.

**Thai Audience Note**

Thai enterprise architects face brownfield scenarios almost exclusively — large Oracle ERP, SAP, or homegrown monoliths that have been in production for 10-20 years. The two most common misalignments with DDD-informed modernization are: (1) Thai hierarchical IT governance requires a complete 'to-be architecture' approved before any migration begins, conflicting with the Wardley Map's incremental, evidence-driven extraction sequence. Facilitators should frame the Wardley Map as the approved roadmap, making the incremental sequencing visible as a deliberate plan rather than as 'doing it piece by piece.' (2) The centralized DBA team model means the legacy database schema is treated as the authoritative data contract — ACL placement that decouples new bounded contexts from that schema is seen as a governance violation. Framing the ACL as 'the migration interface that allows parallel operation without schema changes to the legacy system' is more persuasive than 'protecting model purity.'

**Related Concepts**

Wardley Mapping and Core Domain Positioning, Bounded Context, Context Mapping Patterns, Subdomain Types, DDD Starter Modelling Process, Strategic Distillation Tools, Domain Event, CQRS, Event Sourcing

**Recent Developments (2020–2025)**

Susanne Kaiser's 2023 book 'Adaptive Systems with Domain-Driven Design, Wardley Mapping, and Team Topologies: Architecture for Flow' (Addison-Wesley) is the canonical post-2020 synthesis explicitly integrating Wardley Maps into the brownfield DDD modernization workflow. Nick Tune's 2022 InfoQ article 'Start Your Architecture Modernization with Domain-Driven Discovery' formalizes a domain-driven discovery sequence as the prerequisite for any legacy migration: problem framing, Big Picture Event Storming, bounded context identification, context map, and extraction roadmap — all before writing new code. The article demonstrates that the Wardley Map and Context Map together constitute the migration roadmap. In 2023-2024, the Architecture Modernization community (led by Tune and others) established 'Domain-Driven Discovery' as a distinct practice track at DDD Europe and QCon conferences, focused entirely on applying DDD principles to brownfield systems rather than greenfield design.

**Implementation Pattern**

The canonical implementation sequence for Wardley-informed DDD migration: (1) ACL-first at facade: place an HTTP facade (API Gateway or BFF) in front of the legacy monolith; all new features are implemented as new bounded contexts behind the facade, with the ACL translating between the facade's API and the legacy internals. (2) Strangler Fig routing: incrementally move traffic from legacy endpoints to new bounded context endpoints through the facade — no big-bang cutover. (3) Event Bridge via CDC: use Change Data Capture (e.g., Debezium) on the legacy database to publish raw change events; the ACL subscribes, translates raw DB events into proper domain events, and publishes them to the new bounded contexts' message broker. (4) Outbox pattern in new contexts: each new bounded context uses the Outbox pattern to atomically publish domain events with its local database write, preventing dual-write against the legacy system. (5) CQRS in Core Domain contexts: once the Core Domain is extracted, apply CQRS to separate write-side aggregates (rich domain model) from read-side projections (optimized query models consuming domain events). Saga choreography is preferred for cross-context business processes in the extracted system to maintain loose coupling.

**Workshop Activity**

Big Picture Event Storming on the legacy system is the mandatory first workshop — it maps the as-is business processes and surfaces hidden bounded context seams inside the monolith. After the Event Storm, a Wardley Map workshop assigns evolution positioning to each discovered context cluster, establishing the extraction priority. The Bounded Context Canvas (DDD Crew) documents each target bounded context before extraction begins, defining its ubiquitous language, inbound/outbound events, and upstream/downstream context map relationships. Domain Message Flow Modeling (DDD Crew) validates the target event topology before implementation, ensuring the Strangler Fig extraction sequence produces a coherent EDA architecture.

**Decomposition Signal**

Signals inside a legacy monolith that indicate where bounded context boundaries should be drawn for Strangler Fig extraction: (1) Linguistic — database tables or service methods with overloaded names ('product' table with columns used only by Catalog vs. only by Inventory) signal an undrawn boundary. (2) Organizational — different business units or vendor teams touch different parts of the monolith; team ownership conflict marks a context seam. (3) Data-coupling — a table or module that is read by one subsystem and written by another with no shared understanding of the business rule governing changes. (4) Rate-of-change — modules that change on very different cadences (marketing-driven Catalog vs. real-time Inventory) indicate separate contexts. (5) Wardley evolution signal — if a module's function has a commercially available SaaS equivalent (payment, authentication, search), it is a commodity Generic Subdomain and a high-priority Strangler Fig candidate regardless of how much custom code exists.

**Evolution &amp; Refactoring**

The Wardley-informed modernization lifecycle has three stages: (1) Discovery — Big Picture Event Storming + Wardley Map to produce target architecture and prioritized extraction roadmap; (2) Migration — Strangler Fig extractions in priority order (commodity first, Core Domain last), with an ACL at each seam; each extraction is a reversible R2 operation when done incrementally behind a facade. (3) Stabilization — once Core Domain contexts are extracted and the legacy monolith is fully strangled, remove the facade and ACLs that are no longer needed; evolve the Core Domain's model using Segregated Core refactoring as domain understanding deepens. Wardley's evolution axis reminds teams that the migration is not a one-time project: today's Core Domain may become a commodity within five years (e.g., recommendation engines as AI becomes commoditized), triggering a new extraction cycle. The Context Map should be reviewed quarterly to catch when bounded context boundaries should shift.

**Conway's Law Implication**

Legacy monoliths typically reflect the Conway's Law imprint of the organization that built them — layered architectures (presentation/service/data) matching siloed frontend, middleware, and DBA teams. The Strangler Fig extraction sequence must account for the required Conway's Law realignment: each extracted bounded context needs a dedicated stream-aligned team with end-to-end ownership (design, code, deploy, operate). In Thai hierarchical IT departments where this team structure does not exist, the Strangler Fig extraction will produce a distributed monolith because multiple teams (still siloed by technical layer) coordinate on every extracted service. The Wardley Map argument for team restructuring: 'This commodity-stage capability should be owned by a platform team or outsourced to reduce cognitive load on the teams building the Core Domain.' This objective, market-evidence-based framing is more persuasive to senior management than 'we need to reorganize our teams.'

**Data Mesh / Analytics Note**

Legacy monolith migrations frequently involve a central data warehouse or ETL pipeline that reads directly from the legacy database. When bounded contexts are extracted via Strangler Fig, the legacy database tables that the ETL pipeline depends on are either removed or restructured — breaking all upstream BI/ML pipelines. The DDD-informed solution is to treat each extracted bounded context as a data domain that owns and serves its own analytical data product (Data Mesh pattern), publishing domain events that analytical consumers subscribe to rather than querying source tables directly. For Thai enterprises with strong BI culture (Oracle BI, SAP BW), this requires an explicit migration of the ETL pipeline alongside the application migration — the 'reporting ACL' transforms domain events into the analytics schema the BI layer expects, replacing the direct database read.

**Testing Approach**

During Strangler Fig migration, testing is organized in three layers: (1) ACL translation unit tests — given a known legacy payload (legacy DTO or DB row), assert that the ACL produces the correct domain object with the correct ubiquitous language; these tests are the safety net ensuring the ACL correctly translates between legacy and new models. (2) Consumer-Driven Contract Tests (CDC) at each new bounded context boundary — downstream contexts publish contracts; the new context's CI pipeline verifies published events and APIs match those contracts; this ensures Strangler Fig extractions do not break existing consumers. (3) Parallel-run integration tests during migration — for a period after each extraction, both the legacy monolith and the new bounded context handle the same traffic (shadow mode); comparing outputs detects behavioral divergence before the legacy path is retired. Legacy system regression tests (often absent) are replaced incrementally by the new bounded context's aggregate unit tests and application service integration tests.

**Tooling &amp; DSL**

Wardley Mapping tool: Online Wardley Maps (onlinewardleymaps.com) — browser-based DSL for creating and sharing maps; Miro/Mural community-contributed Wardley templates. Event Storming: Miro or Mural with DDD Crew sticky-note templates for Big Picture Event Storming of legacy systems. Context Mapper DSL (contextmapper.org) — models the as-is and to-be context maps in code, tracking migration progress as bounded contexts are extracted; generates PlantUML diagrams of the evolving architecture. Bounded Context Canvas (ddd-crew.github.io) — Miro template for documenting each target bounded context before extraction. Change Data Capture tooling: Debezium (open source) for streaming legacy database changes as events into the ACL translation layer. API Gateway / facade: AWS API Gateway, Kong, or nginx for implementing the Strangler Fig HTTP routing facade.

**Legacy Modernization Relevance**

This item IS the legacy modernization concept — it is the full synthesis of Wardley Mapping, the Strangler Fig pattern, Anti-Corruption Layer placement, and incremental bounded-context extraction as applied to DDD-informed brownfield migration. The three core mechanisms: (1) Wardley Map sets the extraction priority — commodity-stage contexts (Generic Subdomains with available off-the-shelf alternatives) are extracted first, reducing risk and building team migration capability before the complex Core Domain is touched. (2) Strangler Fig provides the safe incremental extraction mechanism — new bounded contexts are built alongside the legacy system and traffic is incrementally routed to them through a facade; no big-bang cutover. (3) ACL placement protects new bounded contexts from the legacy model's language — every new context has an ACL at its seam with the legacy system, translating legacy table-driven, CRUD-language artifacts into the new context's ubiquitous language objects. The combination ensures the migration is both strategically prioritized and tactically safe.
