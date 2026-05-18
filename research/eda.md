# Event-Driven Architecture — Research Reference

> Source notes for the EDA module. Citations refer to Fowler's bliki entry "What do you mean by 'Event-Driven'?" (2017), Richardson's microservices.io pattern catalogue, Newman's *Building Microservices* 2nd Ed. (2021), Hohpe & Woolf's *Enterprise Integration Patterns* (2003), and the CloudEvents specification (cloudevents.io).

## Table of Contents

- [What Is Event-Driven Architecture](#what-is-event-driven-architecture)
- [Why EDA vs Request/Response](#why-eda-vs-requestresponse)
- [Events, Commands, and Queries](#events-commands-and-queries)
- [Domain Event vs Integration Event](#domain-event-vs-integration-event)
- [Core Patterns](#core-patterns)
- [Reliability Patterns](#reliability-patterns)
- [Consistency Patterns](#consistency-patterns)
- [Event Design](#event-design)
- [EDA and DDD](#eda-and-ddd)
- [Event Sourcing vs EDA](#event-sourcing-vs-eda)
- [Common Mistakes](#common-mistakes)
- [E-commerce Worked Example](#e-commerce-worked-example)
- [Sources](#sources)

---

## What Is Event-Driven Architecture

The label "event-driven" is overloaded. Virtually every system that uses notifications, webhooks, or message queues claims to be event-driven. The ambiguity causes teams to talk past each other: one developer means "we publish to Kafka," another means "we use event sourcing," and a third means "our microservices don't call each other synchronously." None of these is wrong, but they are not the same thing.

Martin Fowler's 2017 essay "What do you mean by 'Event-Driven'?" is the most rigorous public treatment of this problem. Fowler identifies **four distinct patterns** that practitioners lump under the term, and argues that the word is useless as architecture shorthand until you name which pattern you mean (Fowler, 2017):

1. **Event Notification** — a system emits a fact that something happened. Consumers may react or ignore it. The producer has no knowledge of, or dependency on, its consumers. This gives the loosest temporal and spatial coupling: the producer does not wait for a response, does not know how many consumers exist, and does not know what they will do with the fact. The trade-off is that state lives with the producer; consumers must call back if they need more detail.

2. **Event-Carried State Transfer** — events carry enough payload that consumers can build a local read replica and function without querying the producer. This eliminates the "chatty consumer" problem and improves resilience: the Fulfillment service can process shipments even if the Sales service is temporarily unavailable. The trade-off is payload size and the risk of consumers relying on stale replicated state.

3. **Event Sourcing** — the application stores its state as an append-only log of events, and reconstructs current state by replaying ("folding") that log. This is a *persistence* pattern inside a single service, not a communication pattern between services. Fowler places it in this list because people confuse it with EDA, but it is architecturally distinct. See "Event Sourcing vs EDA" below.

4. **CQRS (Command Query Responsibility Segregation)** — the read model and write model are separated. Often paired with events (reads are projections of an event stream) but not inherently event-driven in the communication sense. You can implement CQRS with synchronous REST calls if you choose.

With those four patterns distinguished, the architectural definition of EDA in its communication sense is: components communicate by producing and consuming events asynchronously through a broker, rather than by making direct synchronous calls to each other (Newman, 2021, ch. 4), (Hohpe & Woolf, 2003). The broker — Kafka, RabbitMQ, AWS SNS+SQS, Google Pub/Sub — decouples producers from consumers in time, location, and identity.

---

## Why EDA vs Request/Response

Every architectural choice is a trade-off. The case for EDA is strong in certain dimensions and weak in others.

**Coupling** is the central argument. In synchronous request/response, the caller must know the callee's location (URL or service name), availability (the call fails if the target is down), and contract version (a breaking change in the API breaks the caller immediately). Events invert this dependency: the producer emits a fact and moves on. Consumers subscribe without the producer's awareness. A new consumer can be added without touching the producer at all (Newman, 2021).

**Scalability** benefits from broker-based buffering. A synchronous chain of calls means that a downstream service bottleneck immediately slows the entire chain and multiplies tail latency. A message broker absorbs load spikes: producers continue writing at their natural rate, and consumers scale independently by adding worker instances (Richardson, microservices.io). Kafka's consumer group mechanism is a canonical example: add a partition and a consumer pod and throughput scales linearly.

**Resilience** follows the same logic. A consumer being offline does not fail the producer — messages accumulate in the queue until the consumer recovers. Synchronous calls cascade failures upward through the call chain. In a Black Friday scenario, a transient failure in the Notification service should not prevent order placement; with EDA it does not.

**Trade-offs you must be honest about**: EDA is not a free lunch. Reasoning about message ordering is harder than reasoning about a sequential call stack. Debugging requires correlation IDs and distributed tracing tooling; you cannot simply read a stack trace. Eventual consistency becomes the default, which means UI design must accommodate "your order is being processed" states rather than immediate confirmation. Schema evolution discipline is mandatory: a consumer that cannot deserialize an event fails silently or loudly, but either way production breaks. These costs are real and should be weighed against the coupling benefits before adopting EDA (Newman, 2021, ch. 4).

---

## Events, Commands, and Queries

Three message types are commonly conflated in event-driven systems. Keeping them distinct matters because each has different semantics, recipients, and error handling:

| Kind    | Intent                        | Tense                      | Can be rejected? | Recipients |
|---------|-------------------------------|----------------------------|-----------------|------------|
| Event   | Announce a fact that happened | Past tense ("OrderPlaced") | No — already happened | 0..N (pub/sub) |
| Command | Request a state change        | Imperative ("PlaceOrder")  | Yes             | Exactly 1  |
| Query   | Ask for information           | Interrogative ("GetCart")  | Yes             | Exactly 1  |

The Command/Query distinction derives from Bertrand Meyer's Command-Query Separation principle (Meyer, 1988). The event category was added explicitly in CQRS and DDD discussions (Young, "CQRS Documents", 2010). The key operational consequences:

- An **event** cannot be rejected, because it describes something that already occurred. If the downstream system disagrees with the outcome, it must emit a compensating event, not refuse the original.
- A **command** targets exactly one handler and may be rejected with a validation failure. If it reaches zero handlers, that is an error. If it reaches two, that is a bug.
- A **query** is read-only and returns data. It must not change state. Mixing queries with state changes is the violation Meyer warned against (Richardson, microservices.io).

In practice: when you see a message named "PlaceOrder" on a broker, you are looking at a command masquerading as an event, and the system probably has a hidden assumption about exactly-one processing that will eventually break.

---

## Domain Event vs Integration Event

This is one of the most important distinctions in DDD-aligned event-driven systems, and one of the most frequently collapsed in practice.

**Domain Event** is a first-class tactical DDD concept. Eric Evans and Vaughn Vernon define it as a business-meaningful fact *inside* one bounded context — something the domain experts care about, expressed in the ubiquitous language of that context (Evans, 2015), (Vernon, 2013). A Domain Event is raised by an Aggregate as a side effect of a state transition. It captures the *business meaning* of what happened, not the technical operation. Examples: `OrderPlaced`, `PaymentCaptured`, `InventoryReserved`. The payload is rich: it may include internal aggregate IDs, domain-specific value objects, and any other model-aware data that downstream handlers inside the *same* context need. A Domain Event is essentially private — it belongs to the bounded context that produced it. Cross-referencing the detailed treatment in `research/ddd.md#domain-event`.

**Integration Event** is what crosses a bounded context boundary. When a Domain Event is relevant to other bounded contexts, the application layer (or a dedicated anti-corruption layer) translates it into an Integration Event — a flattened, versioned, schema-stable message published to the message broker (de la Torre et al., .NET Microservices, Microsoft, 2017–2024). The Integration Event is a *public contract* between contexts. Its payload is minimal and deliberately stable: only the fields that remote consumers genuinely need, expressed in neutral terms rather than the internal model's language. It carries a schema version so consumers can migrate at their own pace. Examples: `SalesOrderPlacedV2` on a Kafka topic, consumed by Fulfillment, Billing, and Analytics contexts. Cross-referencing `research/ddd.md#integration-event` and `research/ddd.md#domain-event-vs-integration-event-distinction`.

**Why the distinction collapses** in practice: in a monolith, Domain Events often propagate directly to other modules in the same process. There is no explicit contract, no serialization boundary, no versioning discipline — and it works fine because all code deploys together. When teams decompose that monolith into microservices, they copy the same pattern across the network. Now internal aggregate fields become remote API contracts. Any refactoring of the internal model — renaming a field, splitting an aggregate, changing an enum — immediately breaks remote consumers. The Integration Event layer is the explicit firewall that prevents this coupling (Newman, 2021).

**Rule of thumb**: Domain Events are private; Integration Events are public. The Anti-Corruption Layer translates between them at the context boundary.

---

## Core Patterns

These are the fundamental building blocks of an event-driven system. Every production EDA implementation uses some combination of these patterns.

### Producer / Consumer

The fundamental EDA primitive. A **producer** is any component that creates and publishes events to the broker. A **consumer** is any component that subscribes to a topic or queue and processes those events. Producers and consumers are decoupled in time (the producer does not wait), in location (neither knows the other's address), and in identity (the producer does not know which consumers exist). This is the core inversion of control compared to request/response (Hohpe & Woolf, 2003).

In an e-commerce system: the Sales service (producer) emits `OrderPlaced` events. The Fulfillment service, Notification service, and Analytics service are separate consumers, each processing the event independently and at their own pace.

### Message Broker

Middleware that owns the channel between producer and consumer. The broker provides **durability** (messages survive producer or consumer restarts), **ordering guarantees** (within a partition or queue), and **replay capability** (Kafka retains messages for a configurable period; consumers can re-read from any offset). Representative brokers: Apache Kafka (log-based, high throughput, strong ordering per partition), RabbitMQ (queue-based, flexible routing, lower throughput), AWS SNS+SQS (managed, fan-out + queue combination), Google Pub/Sub (managed, global, at-least-once) (Hohpe & Woolf, 2003), (Newman, 2021).

The choice of broker determines the reliability contract and the operational complexity your team takes on.

### Pub/Sub vs Queue

Two fundamental delivery models with different semantics:

**Queue (point-to-point)**: one message is delivered to exactly one consumer within a consumer group. If five worker pods subscribe to the same queue, each message goes to one of them — natural load balancing. Messages are deleted on acknowledgement. Appropriate for work distribution where each unit of work should be processed once. Example: `SendInvoiceCommand` queue with five worker pods.

**Pub/Sub (topic)**: one message is delivered to every independent subscriber. Each subscriber group receives its own copy of every message. Messages are not deleted when one subscriber acknowledges — they are retained until all subscribers have acknowledged (or the retention period expires). Appropriate for broadcasting facts that multiple independent systems care about. Example: `OrderPlaced` topic with separate subscriptions for Fulfillment, Analytics, and Email contexts.

Cite (Hohpe & Woolf, 2003, "Publish-Subscribe Channel") for the canonical treatment.

### Fan-out

Fan-out is the pattern where one event triggers multiple parallel, independent consumers. It is the natural consequence of pub/sub topic semantics. In a properly designed EDA, fan-out is free: add a new subscriber to a topic and it receives all future events without touching the producer.

E-commerce example: `sales.order.placed` fans out simultaneously to the inventory reservation service (reserve stock), the payment service (authorize charge), the email service (send confirmation), the analytics warehouse (record conversion event), and the recommendation engine (update affinity model). Five independent workflows, triggered by one event, with no coordination code in the Sales service (Hohpe & Woolf, 2003, "Recipient List" / "Publish-Subscribe Channel").

### Event Streaming vs Messaging

A brief but important distinction: **Kafka-style log retention** keeps messages available for replay long after consumers have acknowledged them. A late-joining consumer — a new analytics service, for example — can read the full history from offset 0. **Classical message brokers** (RabbitMQ default, SQS) delete messages on successful acknowledgement. Late joiners see no history. The choice between log-based streaming and traditional messaging affects your ability to add consumers retrospectively and to recover from consumer bugs by replaying (Newman, 2021, ch. 4).

---

## Reliability Patterns

Distributed messaging introduces failure modes that do not exist in synchronous systems. These patterns address the most common reliability challenges.

### Idempotency

Consumers **must** produce the same result when the same message is processed multiple times. This is not optional — the broker *will* redeliver messages on consumer crashes, network timeouts, and broker restarts. The question is not whether your consumer will receive a duplicate; it is whether your consumer handles it correctly.

Implementation strategies: deduplication keys (`eventId` stored in a processed-events table), idempotent SQL operations (`INSERT ... ON CONFLICT DO NOTHING`, `UPDATE ... WHERE version = N`), or idempotency tokens passed to downstream APIs. The idempotency invariant must hold across retries, across consumer pod restarts, and across partial failures (Newman, 2021), (Hohpe & Woolf, 2003, "Idempotent Receiver").

### At-Least-Once Delivery

The only realistic delivery guarantee in distributed brokers. What the three options mean in practice:

- **At-most-once**: acknowledge before processing. If the consumer crashes during processing, the message is lost silently. Almost never acceptable for business data.
- **At-least-once**: acknowledge after processing. On crash or timeout, the broker redelivers. This is the correct default — combined with idempotency on the consumer side, you get safe processing.
- **Exactly-once**: a marketing claim that requires coordination overhead and still reduces to idempotency under the hood. Kafka's "exactly-once semantics" (EOS) is real but scoped to Kafka-to-Kafka flows with the transactional producer API — it does not extend to your database writes.

Design for at-least-once; enforce idempotency everywhere (Newman, 2021), (Kleppmann, 2017).

### Retry with Exponential Backoff

On transient failure (downstream service temporarily unavailable, network blip, database connection pool exhausted), the consumer should retry with increasing delay: for example, 1 second, 2 seconds, 4 seconds, 8 seconds, then cap. Add random jitter (±20% of the delay) to prevent all consumers in a pod fleet from retrying simultaneously — the "thundering herd" problem. Cap the total number of retries; after exhaustion, route to the Dead Letter Queue rather than retrying forever.

### Dead Letter Queue (DLQ)

The destination for messages that exceed their retry budget or are structurally unprocessable (malformed payload, missing required fields, schema version the consumer cannot handle). A DLQ is mandatory in any production system. Without it, poison messages either spin in an infinite retry loop (consuming CPU and blocking partition progress) or get silently dropped. With a DLQ, operators can inspect the message, fix the consumer code or data, and replay when ready (Hohpe & Woolf, 2003, "Dead Letter Channel").

### Outbox Pattern

The **dual-write problem**: your service needs to atomically commit a database state change AND publish an event to the broker. These are two separate systems; there is no distributed transaction spanning them. If you write to the DB and then crash before publishing, the event is lost and downstream contexts diverge. If you publish and then crash before writing to the DB, you have published a lie.

The Outbox pattern solves this: write both your business rows *and* an `outbox` row to the same local database transaction. A separate relay process (or a CDC connector like Debezium tailing the database WAL) reads unpublished outbox rows and publishes them to the broker, then marks them sent. The business transaction is atomic; the publish is a separate, retryable step with at-least-once semantics (Richardson, microservices.io/patterns/data/transactional-outbox.html).

CDC (Change Data Capture) via Debezium reading the PostgreSQL WAL is the modern implementation: zero polling overhead, sub-second latency, and automatic backpressure handling.

### Inbox Pattern

The symmetric pattern on the consumer side: write the incoming `eventId` to a local `inbox` table *inside the same business transaction* as your domain state change. On redelivery, check the inbox table first — if the `eventId` exists, skip processing and ack the message. This provides at-most-once processing semantics for the business effect while still using an at-least-once broker.

---

## Consistency Patterns

EDA trades strong consistency for the availability and decoupling benefits described above. These patterns manage the resulting consistency model.

### Eventual Consistency

In an event-driven system, different bounded contexts see different states for a window of time after a business fact occurs. The Fulfillment context may not know an order was placed for 50 milliseconds (or, in a failure scenario, for longer). The system converges: once all events are processed, all contexts agree. This is not a bug to eliminate with synchronous calls — it is the intended operating model. Trying to achieve strong consistency in EDA by adding synchronous calls re-creates the distributed monolith (Vogels, "Eventually Consistent", ACM Queue, 2008).

UI implications: the interface must be designed for eventual consistency. Show "your order is being processed" rather than blocking until Fulfillment confirms. Use optimistic updates where appropriate. Make the "pending" state explicit in the UX.

### Saga

A long-running business transaction that spans multiple bounded contexts and cannot use a distributed 2PC (which would create the tight coupling EDA is designed to avoid). A Saga decomposes the transaction into a sequence of local transactions, each publishing an event that triggers the next step (Richardson, microservices.io/patterns/data/saga.html), (Garcia-Molina & Salem, SIGMOD 1987).

**Choreography**: each service listens for events from the previous step and emits its own event to trigger the next. No central coordinator. Simple to implement for two or three steps. Becomes difficult to reason about at scale: the business flow is implicit, distributed across many services, and requires reading all topics to trace a single transaction.

**Orchestration**: a saga orchestrator (also called a Process Manager) sends explicit commands to each service and tracks the saga state. The business flow is explicit and centralized. Easier to add monitoring, timeouts, and alerting. Newman recommends switching to orchestration once the saga exceeds three steps (Newman, 2021, ch. 6).

### Compensating Transactions

Sagas have no rollback in the database sense. To "undo" a step that already committed, the saga must issue a **compensating transaction** — an explicit business operation that reverses the effect. Examples: `RefundPayment` compensates `CapturePayment`; `ReleaseInventoryReservation` compensates `ReserveInventory`; `CancelShipmentRequest` compensates `RequestShipment`.

Compensating transactions must themselves be idempotent (the saga orchestrator may retry them). They may not perfectly restore prior state — a "semantic undo" rather than a strict undo. In some cases a compensation is impossible (an email already sent cannot be unsent); the business process must account for this with alternative flows like a follow-up apology email (Richardson, microservices.io).

---

## Event Design

The quality of event design determines the long-term maintainability of an event-driven system. Poor event design — unclear names, missing metadata, no versioning — accumulates technical debt that is expensive to pay down once remote consumers depend on the schema.

### Standard Event Envelope

Every event should carry these fields as a standard envelope, regardless of domain:

- `eventId` — a UUID that is unique per event instance. Used for deduplication (idempotency).
- `eventType` — a string identifying the schema, for example `sales.order.placed`.
- `eventVersion` — the schema version (integer or semver). Allows consumers to handle multiple versions concurrently.
- `occurredAt` — the ISO 8601 timestamp in UTC when the business fact happened, not when the message was published.
- `producer` — the source service identifier. Useful for debugging and monitoring.
- `correlationId` — an ID that ties together all events belonging to one user-initiated action (e.g., a checkout flow).
- `causationId` — the `eventId` of the event that caused this one to be produced. Used to reconstruct causal chains.
- `payload` — the business data specific to this event type.

### CloudEvents Specification

The Cloud Native Computing Foundation (CNCF) publishes the **CloudEvents specification** (v1.0), which formalizes the event envelope as a vendor-neutral standard. Required attributes: `id`, `source`, `specversion`, `type`. Optional: `subject`, `time`, `datacontenttype`, `dataschema`. Transport bindings exist for HTTP webhooks, Kafka, AMQP, and MQTT. Using CloudEvents reduces integration friction between systems from different vendors and provides a common vocabulary for observability tools (CloudEvents spec, cloudevents.io).

### Versioning Strategies

Schema evolution is inevitable. There are three main strategies:

**Additive evolution**: only add optional fields; never rename or remove existing fields. Consumers that do not understand new fields ignore them. This handles minor changes without requiring consumer updates. Requires that existing fields are never semantically repurposed.

**Versioned event types**: publish `OrderPlacedV1` alongside `OrderPlacedV2` for a migration period. Consumers migrate at their own pace. The producer deprecates V1 after all consumers have migrated. Explicit, safe, but requires producer maintenance of multiple versions during transition (Newman, 2021, ch. 4 on backward compatibility).

**Upcasting**: at read time, a transformation layer converts old event payloads to the current schema shape. Common in event-sourced systems where old events stored in the log must be readable by current code (Young, "Versioning in an Event Sourced System", 2017).

### Naming Conventions

Good event names are past-tense, domain-language, and scoped with a dotted hierarchy:

- `sales.order.placed`
- `fulfillment.shipment.dispatched`
- `billing.invoice.issued`

Avoid these anti-patterns:

- `OrderPlacedEvent` — redundant suffix; of course it is an event
- `PlaceOrder` — present imperative; that is a command, not an event
- `OrderRowInserted` — technical CRUD language; domain experts do not speak in database rows
- `UpdatedOrder` — passive voice; ambiguous about what changed

---

## EDA and DDD

EDA and DDD are complementary: DDD provides the *what* (bounded contexts, domain events, aggregates) and EDA provides the *how* (the communication infrastructure). When used together, each makes the other more principled.

### Domain Events to Integration Events Pipeline

The flow from internal fact to external message: an Aggregate raises a Domain Event as a side effect of a state transition → the Application Service captures the Domain Event and writes it to the Outbox table → the relay process publishes it as an Integration Event on the message broker, using an Anti-Corruption Layer to translate the internal payload to the stable external contract. The same physical business occurrence has two representations: the Domain Event carries the full internal model; the Integration Event carries only the contract fields needed by remote consumers.

### Bounded Context as Service and Message Boundary

In a microservices EDA system, the bounded context line typically aligns with the service boundary, the deployment unit, and the team boundary — Conway's Law in practice. One context owns its topics: only the Sales context produces `sales.*` events; other contexts consume them. This ownership model prevents the "who is responsible for this topic?" confusion that plagues systems without clear context boundaries. Cross-reference `research/ddd.md#bounded-context` and the Conway's Law section of the DDD reference.

### ACL in EDA

The Anti-Corruption Layer (ACL) takes on a concrete implementation form in event-driven systems. On **egress** (outbound): the ACL translates internal Domain Events into Integration Events, stripping model-specific fields, normalizing naming conventions, and adding the versioned envelope. On **ingress** (inbound): the ACL translates Integration Events from upstream contexts into local Domain Events or commands that use the consuming context's own ubiquitous language. This translation protects the internal domain model from changes in upstream contexts — an upstream rename does not propagate past the ACL. (Evans, 2003), (Vernon, 2013).

---

## Event Sourcing vs EDA

This conflation is the single most common conceptual error in conversations about event-driven systems. They are entirely different architectural concepts applied at different levels.

**EDA is a communication style** — it describes how multiple services or components talk to each other. The mechanism is: one service publishes an event to a broker; other services consume that event asynchronously. EDA is about inter-component communication. Nothing about EDA says anything about *how* any individual service stores its state internally.

**Event Sourcing is a persistence style** — it describes how a single service stores its own state internally. Instead of writing the current state of an entity to a relational table, the service appends an immutable event to a log and derives current state by replaying that log. Event Sourcing is about intra-service storage. Nothing about Event Sourcing requires asynchronous messaging between services.

You can have either without the other:

**EDA without Event Sourcing**: services use ordinary relational databases (PostgreSQL, MySQL), or document stores (MongoDB). When a state change commits, the service writes to its DB and uses the Outbox pattern to publish an Integration Event to Kafka. Consumers read and process it. This is the most common production EDA pattern in practice. No event log, no replaying.

**Event Sourcing without EDA**: a single service stores its aggregate state as an append-only event log in EventStoreDB or a custom events table. It exposes a synchronous REST API. Other services call it over HTTP. No broker, no async messaging. The service gains auditability, temporal querying, and natural event history — without EDA complexity.

**Both together**: powerful but compounds complexity. Event Sourcing gives you a natural Outbox (the event log *is* the outbox) and enables powerful audit and temporal features. But you are now managing both a broker *and* an event store, both consumer group offsets *and* aggregate projection state. Do not adopt Event Sourcing "to get EDA" — they solve different problems and can be adopted independently. Fowler explicitly separates Event Sourcing from his three communication patterns in the "four patterns" essay (Fowler, 2017). Cross-reference Young's CQRS Documents (Young, "CQRS Documents", 2010) and `research/ddd.md#event-sourcing`.

---

## Common Mistakes

The following mistakes appear repeatedly in teams adopting EDA for the first time. Each has a recognizable symptom and a known remedy.

- **Publishing internal Domain Events directly across the broker**: the aggregate's field names become a remote API contract. The first time someone renames an internal field, every downstream consumer breaks in production. Fix: always translate to Integration Events at the context boundary using an ACL.

- **Naming events as commands**: `PlaceOrder`, `UpdateInventory`, `SendEmail` on a topic look like events but are commands. They violate the fact-about-the-past semantics and create hidden exactly-one processing assumptions. Fix: past tense, business vocabulary — `OrderPlaced`, `InventoryReserved`, `ConfirmationEmailSent`.

- **Naming events as technical CRUD**: `OrderUpdated`, `RecordInserted`, `UserModified`. These names destroy the business-fact property and force consumers to inspect the payload to determine what actually happened. Fix: name the specific business event — `OrderAddressChanged`, `OrderItemAdded`, `OrderCancelled`.

- **Assuming exactly-once delivery**: the guarantee does not exist at the broker level for most real-world workloads. Idempotency bugs go undetected until Black Friday when duplicate processing causes double-charges or double-fulfillment.

- **Skipping the Outbox**: the dual-write bug — event published but database rolled back, or database committed but event never published — is subtle and goes undetected for months. Fix: Outbox pattern (or CDC), always.

- **Choreography saga with many steps**: a seven-step choreography saga with no central coordinator means the business flow is implicit across seven topics. Nobody can trace a failing transaction without reading seven different codebases. Fix: switch to orchestration beyond three steps.

- **No Dead Letter Queue**: poison messages wedge the consumer partition. The consumer retries forever, blocking all subsequent messages in the partition. On-call engineers scramble at 3am. Fix: always configure a DLQ with a retry budget.

- **No schema registry and no versioning policy**: the first time a producer adds a breaking change, all consumers fail simultaneously. Fix: additive-only evolution by default; versioned event types for breaking changes; a schema registry (Confluent Schema Registry, AWS Glue Schema Registry) to enforce compatibility rules automatically.

- **Using synchronous calls to "fix" eventual consistency**: when a developer is uncomfortable with the `OrderPlaced` event taking 100ms to propagate to Fulfillment, they add a direct HTTP call to confirm. This re-creates synchronous coupling and re-introduces the availability dependency EDA was adopted to eliminate. Eventual consistency is a feature, not a bug; embrace it in the UX.

- **Confusing Event Sourcing with EDA**: see the dedicated section above. Adopting Event Sourcing to "get" EDA, or assuming EDA systems must use Event Sourcing, leads to unnecessary complexity.

---

## E-commerce Worked Example

The following narrative traces a checkout transaction across bounded contexts to illustrate how EDA patterns work together in practice.

**Bounded contexts in play**: Cart, Sales, Payment, Inventory, Fulfillment, Notification.

**Step 1 — Checkout initiated**: A customer clicks "Place Order" in the Cart context. The Cart service validates the basket and publishes a `cart.checkout.requested` Integration Event containing the cart ID, item list, and customer ID.

**Step 2 — Order creation**: The Sales context consumes `cart.checkout.requested`. The Order aggregate is created and transitions to `Pending` state. The Application Service commits the Order to the Sales database and simultaneously writes a `sales.order.placed` row to the `outbox` table in the same transaction. The Outbox relay (a Debezium CDC connector reading the PostgreSQL WAL) publishes `sales.order.placed` as an Integration Event to the `sales.orders` Kafka topic. The Sales service never calls Payment, Inventory, Fulfillment, or Notification directly.

**Step 3 — Fan-out**: The `sales.order.placed` event fans out simultaneously to four subscribers: the OrderPlacement saga orchestrator, the Analytics service, the Recommendation Engine, and the Audit Log service. Each processes independently.

**Step 4 — Saga orchestration**: The OrderPlacement orchestrator (an explicit saga Process Manager in the Sales context) receives `sales.order.placed`. It sends a `payment.authorize` command to the Payment service queue. On receiving `payment.authorized`, it sends `inventory.reserve` to the Inventory queue. On `inventory.reserved`, it sends `fulfillment.create_shipment` to the Fulfillment queue. The saga state machine is explicit and persisted — if the orchestrator crashes mid-saga, it recovers by re-reading its state on restart.

**Step 5 — Reliability in action**: The Payment service uses its own Outbox: the captured-charge database row and the `payment.authorized` event commit atomically. The Fulfillment service deduplicates incoming events by `eventId` stored in its `processed_events` table. If the shipping carrier API is temporarily unavailable, Fulfillment retries with exponential backoff — 1s, 2s, 4s, 8s — then routes to a DLQ after five attempts. The on-call engineer inspects the DLQ message, fixes the carrier API configuration, and replays the message.

**Step 6 — Failure scenario — payment declined**: The Payment service publishes `payment.declined` instead of `payment.authorized`. The saga orchestrator receives this, transitions to the `Compensating` state, and emits a `cart.checkout.failed` command back to the Cart context so it can show the customer an error. No inventory was reserved, so no compensation is needed on the inventory side. The Notification service publishes a "payment failed" email.

**Step 7 — Schema versioning in practice**: Six months later, the Sales team adds a `giftWrap` boolean field to the Order model. They publish `sales.order.placed.v2` alongside `sales.order.placed.v1` on separate topics. Fulfillment migrates to V2 in the next sprint. Analytics migrates the sprint after. After 90 days, V1 is deprecated and removed. Neither migration required a coordinated multi-service deployment.

This example demonstrates: Outbox for dual-write safety, fan-out for parallel processing, saga orchestration for multi-step workflows, compensating transactions for partial failure, idempotency for at-least-once delivery, DLQ for poison message handling, and versioned event types for backward-compatible schema evolution.

---

## Sources

- Fowler, Martin. "What do you mean by 'Event-Driven'?" martinfowler.com/articles/201701-event-driven.html, 17 Feb 2017. The canonical reference for disambiguating the four EDA patterns.

- Richardson, Chris. *Microservices Patterns*. Manning, 2018; and microservices.io pattern catalogue — specifically microservices.io/patterns/data/saga.html and microservices.io/patterns/data/transactional-outbox.html. Definitive treatment of the Saga, Outbox, and CQRS patterns.

- Newman, Sam. *Building Microservices*, 2nd Ed. O'Reilly, 2021. Especially Chapter 4 (Communication Styles) and Chapter 6 (Workflow and Sagas). Practical guidance on when to choose async over sync, and orchestration over choreography.

- Hohpe, Gregor and Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. Reference patterns: Publish-Subscribe Channel, Point-to-Point Channel, Dead Letter Channel, Idempotent Receiver, Message Broker. The foundational vocabulary for messaging systems.

- CloudEvents specification v1.0 — cloudevents.io. CNCF project. Standard event envelope schema with transport bindings for HTTP, Kafka, AMQP, MQTT.

- Garcia-Molina, Hector and Salem, Kenneth. "Sagas." Proceedings of the 1987 ACM SIGMOD International Conference on Management of Data. Original academic paper introducing the saga pattern for long-running transactions.

- Vogels, Werner. "Eventually Consistent." ACM Queue, Volume 6, Issue 6, 2008. Foundational articulation of eventual consistency as a correct operating model, not a failure mode.

- Kleppmann, Martin. *Designing Data-Intensive Applications*. O'Reilly, 2017. Delivery semantics (at-most-once, at-least-once, exactly-once), log-based messaging, and distributed systems failure modes.

- Young, Greg. "CQRS Documents", 2010 (available at cqrs.wordpress.com); "Versioning in an Event Sourced System", 2017 (Leanpub). Command-Query distinction and event versioning strategies.

- Evans, Eric. *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley, 2003; *DDD Reference*, 2015 (Domain Event definition). Foundational tactical and strategic DDD concepts referenced throughout.

- Vernon, Vaughn. *Implementing Domain-Driven Design*. Addison-Wesley, 2013. Domain Events chapter, including the distinction between intra-context events and inter-context integration messages.

- de la Torre, Cesar; Wagner, Bill; Rousos, Mike. *.NET Microservices: Architecture for Containerized .NET Applications*. Microsoft, 2017–2024. Available at docs.microsoft.com/dotnet/architecture/microservices. Canonical framing of the Domain Event vs Integration Event distinction in a microservices context.

- Meyer, Bertrand. "Command-Query Separation" in *Object-Oriented Software Construction*. Prentice Hall, 1988. Lineage for the Event/Command/Query tripartite distinction.
