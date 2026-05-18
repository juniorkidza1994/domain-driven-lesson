# E-Commerce Real-World Examples — Research Reference

> Source notes for Module 7 (ShopSphere case study). Citations refer to
> Richardson's microservices.io pattern catalogue, Shopify Engineering Blog,
> Netflix Tech Blog, the citerus/dddsample-core repository, Newman's Building
> Microservices 2nd Ed. (2021), Vernon's Implementing Domain-Driven Design
> (2013), and the DDD Europe talk archive.

## Table of Contents
- [Real Company References](#real-company-references)
- [Bounded Contexts](#bounded-contexts)
- [Domain Events](#domain-events)
- [Order Fulfillment Saga](#order-fulfillment-saga)
- [Failure Flows](#failure-flows)
- [ShopSphere Teaching Model](#shopsphere-teaching-model)
- [What Is Typical vs Varies](#what-is-typical-vs-varies)
- [Sources](#sources)

---

## Real Company References

### Shopify Engineering — Modular Monolith

Shopify's engineering blog (engineering.shopify.com) published a landmark post in 2019 titled "Deconstructing the Monolith: Designing Software that Maximizes Developer Productivity" by Kirsten Westeinde. The post describes how Shopify decomposes a multi-million-line Rails monolith not into microservices, but into explicitly bounded modules — what they call a "modular monolith." Each module enforces strict interface contracts: no cross-module database access, no direct object instantiation from another module's internals. The bounded context principle (separating Catalog from Inventory from Checkout from Fulfillment) is applied at the module boundary level rather than the service boundary level. Shopify's approach demonstrates that bounded contexts are first and foremost a *design concept*, not an infrastructure mandate — you can achieve most of the coupling benefits without spinning up additional deployment units (Westeinde, Shopify Engineering, 2019).

A follow-up post in 2022 on the Shopify engineering blog detailed how the modular monolith approach scales to hundreds of engineers by enforcing that each "component" (their term for a bounded context module) owns its own database tables and communicates with adjacent components only through declared Ruby interfaces, never through shared ActiveRecord queries. This is Conway's Law applied inside a single repository (Shopify Engineering, 2022).

### Netflix Tech Blog — Event-Driven Studio Orchestration

Netflix published a series of posts on netflixtechblog.com (2020–2022) describing their move to event-driven architecture for Studio Production workflows — the internal system that tracks content from greenlighting a project through production, post-production, and delivery. While the domain is media rather than e-commerce, the architectural patterns map directly: an `OrderPlaced` event in e-commerce is analogous to a `ProductionApproved` event in Netflix's system; `InventoryReserved` maps to `ResourcesAllocated`; `ShipmentDispatched` maps to `ContentDelivered`. Netflix's system uses Apache Kafka as the backbone, with choreography for simple notification flows and orchestration (via a Netflix-internal saga orchestrator called "Conductor") for multi-step workflows — exactly the trade-off Richardson and Newman describe for e-commerce saga design (Netflix Tech Blog, 2020).

The Netflix blog post "Conductor: Why We Built a New Workflow Orchestrator" (2018, updated 2020) is particularly relevant: Conductor was introduced specifically because pure choreography sagas became impossible to reason about beyond four or five steps. The Netflix team mirrors Newman's guidance (Newman, 2021, ch. 6) almost word-for-word — choreography is fine for two or three steps; beyond that, orchestration is needed to make the business process legible and operable.

### Chris Richardson / microservices.io — FTGO Reference Application

Chris Richardson's "Food To Go" (FTGO) reference application, documented at microservices.io and in *Microservices Patterns* (Manning, 2018), is the most comprehensive publicly available example of e-commerce-adjacent domain modelling using DDD + event-driven architecture. FTGO models a food delivery platform with bounded contexts for: Consumer, Restaurant, Order, Accounting (Payment), Delivery (Fulfillment), and Notification — a context map strikingly similar to the ShopSphere model used in this course. Richardson uses the Saga pattern for order creation (spanning Consumer, Restaurant, Accounting, and Delivery contexts), the Outbox pattern for dual-write safety, and CQRS for order history views. All three patterns are described with sequence diagrams and sample code at microservices.io/patterns (Richardson, microservices.io).

The FTGO Saga for order creation is the canonical reference for the `OrderPlaced` → `PaymentAuthorized` → `InventoryReserved` → `ShipmentCreated` choreography chain that ShopSphere uses as a teaching model. Richardson documents both the happy-path and the three main failure scenarios — payment failure, restaurant rejection, and delivery unavailability — with explicit compensating event flows (Richardson, *Microservices Patterns*, Manning, 2018).

### citerus/dddsample-core — DDD Cargo Shipping

The `citerus/dddsample-core` repository (github.com/citerus/dddsample-core) is the canonical implementation of the Cargo Shipping domain from Eric Evans' original *Domain-Driven Design* book (Evans, 2003). The repository, maintained by the Citerus consulting firm in Sweden, demonstrates tactical DDD patterns — Aggregates, Repositories, Domain Services, Domain Events, Factories — in a Java codebase. The Cargo domain shares structural characteristics with e-commerce: a `Cargo` aggregate tracks lifecycle state through `HandlingEvent` domain events; route planning uses a `RoutingService` domain service; delivery specification uses Value Objects. DDD practitioners treat dddsample-core as the ground truth for "what does idiomatic DDD code look like?" — the same patterns apply directly to the Order, Inventory, and Shipment aggregates in ShopSphere (Evans, 2003; citerus/dddsample-core, github.com).

### DDD Europe — Mathias Verraes and Eric Evans

Mathias Verraes, in his DDD Europe 2019 talk "DDD & Messaging Architectures" (dddeurope.com archive), argues that domain events are the primary integration mechanism between bounded contexts, and that getting event names right — past tense, business vocabulary, no CRUD language — is the most important design decision in an event-driven system. He uses an e-commerce checkout example to illustrate the difference between `OrderUpdated` (a CRUD name that destroys intent) and `OrderShipped` (a business fact that carries meaning) (Verraes, DDD Europe 2019).

Eric Evans' DDD Europe keynotes (2015, 2018, 2019) repeatedly return to the bounded context as the central strategic concept. In his 2019 keynote, Evans cautioned that teams draw bounded context lines too large — trying to include more in one context for "convenience" — and then find that the ubiquitous language collapses under the weight of overloaded terms. For e-commerce, the canonical example he uses is "Order" meaning the customer's checkout intent in the Sales context versus "Order" meaning a warehouse pick-list in the Fulfillment context: same word, different concepts, requiring a context boundary between them (Evans, DDD Europe 2019).

---

## Bounded Contexts

Each of the eight ShopSphere bounded contexts represents a distinct subdomain with its own ubiquitous language, data ownership, and team responsibility. The justification for each boundary follows Vernon's guidance that a bounded context is the explicit envelope within which a model applies (Vernon, 2013).

### Customer / Identity

The Customer context owns authentication, customer profiles, saved addresses, payment methods on file, and consent/GDPR records. It does NOT own order history — that belongs to the Order context — nor does it own current cart contents — that belongs to Cart. Separating Customer from Order prevents the common mistake of treating the customer record as a God Object that accumulates every relationship in the system. The context map relationship between Customer and Order is Customer-Supplier: the Order context consumes customer identity (customer ID, name, shipping address) at order creation time, then stores a snapshot of that data inside the Order aggregate, making the Order context resilient to customer profile changes after order placement. Why separated: a customer address update must not retroactively change the shipping address on a completed order — only an address snapshot owned by Order provides this safety (Vernon, 2013; Richardson, microservices.io).

### Catalog / Product

The Catalog context owns SKU definitions, product descriptions, images, pricing rules, taxonomy (categories, tags), and search indexes. It does NOT own stock counts — inventory levels live in the Inventory context — and it does NOT own cart line items or order line items, which are snapshots of catalog data at a point in time. Separating Catalog from Inventory prevents the coupling that Shopify's modular monolith architecture explicitly avoids: Shopify's Product component contains descriptions and images while their Inventory component tracks quantities, and the two communicate through declared interfaces rather than shared database tables (Westeinde, Shopify Engineering, 2019). Why separated: catalog data changes on a marketing cadence (descriptions updated weekly, prices changed for promotions); inventory data changes on a transactional cadence (every sale, every receipt from a supplier). Different change rates indicate different bounded contexts (Vernon, 2013).

### Cart

The Cart context manages ephemeral pre-checkout state: item selection, quantity choices, applied promo codes, and gift wrap preferences. It does NOT persist orders — it is explicitly short-lived state that ends when checkout completes. Cart is responsible for abandoned cart detection and for publishing the `CartAbandoned` integration event that triggers re-engagement emails. The Cart also publishes `CheckoutStarted` when the customer initiates checkout, which is the event that kicks off the Order Fulfillment Saga. Why separated: Cart is a session-scoped, high-write-frequency context that can afford relaxed consistency (it is fine for Cart to be unavailable while the Payment context is processing); mixing Cart state into the Order aggregate would create an ordering constraint that does not exist in the domain (Richardson, FTGO, microservices.io).

### Order

The Order context owns the canonical Order Aggregate, the lifecycle state machine (`Pending` → `Confirmed` → `Shipped` → `Delivered`, or `Cancelled`), and the immutable line-item snapshot taken at order creation time. The Order aggregate is the pivot point of the entire fulfillment saga: it consumes `CheckoutStarted`, coordinates with Inventory and Payment via domain events, and publishes `OrderPlaced`, `OrderConfirmed`, `OrderShipped`, `OrderDelivered`, and `OrderCancelled`. Order does NOT own payment records (those belong to Payment), shipment records (Shipping), or inventory levels (Inventory). Why separated: the Order aggregate enforces business invariants about the order lifecycle — it should not be polluted with payment gateway integration logic or carrier API concerns, which change at different rates and belong to different teams (Evans, 2003; Vernon, 2013).

### Inventory / Warehouse

The Inventory context owns physical stock counts, stock reservations, warehouse location (bin, aisle), replenishment triggers, and inbound purchase orders. It does NOT own product descriptions or pricing (Catalog) and does NOT own shipment tracking (Shipping). When an order is placed, Inventory reserves stock — decreasing available quantity while recording the reservation — then releases the reservation when the order ships or cancels. This separation mirrors Shopify's explicit split between their Product and Inventory components, and maps to the FTGO "Restaurant" context in Richardson's reference application (Westeinde, Shopify Engineering, 2019; Richardson, microservices.io). Why separated: inventory operations happen at warehouse time, not at catalog-edit time. A warehouse operator managing stock levels should not be blocked by or coupled to a marketing team updating product descriptions.

### Payment

The Payment context owns payment authorization, capture, refunds, and the integration with payment gateway providers (Stripe, Adyen, PayPal). Critically, Payment owns the PCI DSS compliance scope boundary — no other context should ever handle raw card data. Payment is a generic subdomain: the business logic is dictated almost entirely by payment industry standards and gateway APIs rather than by ShopSphere's specific domain. It publishes `PaymentAuthorized`, `PaymentCaptured`, `PaymentFailed`, `RefundRequested`, and `RefundCompleted`. Why separated: PCI scope is a hard regulatory boundary. Mingling payment credential handling with order management would force the entire system into PCI scope, an enormous compliance burden (Richardson, *Microservices Patterns*, Manning, 2018).

### Shipping / Fulfillment

The Shipping context manages the pick-pack-ship workflow: receiving fulfillment requests, generating pick lists, selecting carriers, creating shipment records, and consuming delivery status webhooks from carrier APIs. It does NOT own order business rules (Order context) or customer notification logic (Notification context). Shipping publishes `ShipmentCreated`, `ShipmentDispatched`, and `ShipmentDelivered`, and consumes `OrderConfirmed` to know when to begin fulfillment. The dddsample-core Cargo example is the canonical reference for modelling shipment lifecycle with rich Domain Events (citerus/dddsample-core). Why separated: fulfillment is a physical-world workflow with its own domain experts (warehouse managers, logistics coordinators) who speak a different language from the order management team. Evans' warning about context pollution — overloaded terms collapsing language — applies directly here (Evans, DDD Europe 2019).

### Notification

The Notification context is a pure consumer of integration events. It listens to `OrderPlaced`, `OrderShipped`, `OrderDelivered`, `PaymentFailed`, `CartAbandoned`, and any other events that require customer communication, then dispatches emails, SMS, and push notifications accordingly. Notification owns no business entities — it has no concept of "what an order is," only "what message to send when this event occurs." Why separated: notification channels (email, SMS, push, WhatsApp) change frequently; third-party provider integrations (SendGrid, Twilio, Firebase) have their own reliability characteristics; and the notification rules ("send a reminder 24 hours after CartAbandoned") are a distinct business concern that should not pollute the core transactional contexts. This maps directly to the Notification context in Richardson's FTGO application (Richardson, microservices.io).

---

## Domain Events

The following table catalogs the core domain events in a ShopSphere-style e-commerce system. Events are named in PascalCase past tense following the naming conventions in `research/eda.md#event-design`. Each event is an integration event at the context boundary — produced by one bounded context and consumed by one or more others.

| Event | Producer Context | Payload Summary | Typical Consumers |
|---|---|---|---|
| `CartCreated` | Cart | cartId, customerId, sessionId, createdAt | Analytics, Notification |
| `CartAbandoned` | Cart | cartId, customerId, items, totalValue, abandonedAt | Notification, Analytics |
| `CheckoutStarted` | Cart | cartId, customerId, items, shippingAddress, promoCode | Order |
| `OrderPlaced` | Order | orderId, customerId, lineItems, totalAmount, shippingAddress | Inventory, Payment, Notification, Analytics |
| `OrderConfirmed` | Order | orderId, confirmedAt | Shipping, Notification |
| `OrderCancelled` | Order | orderId, reason, cancelledAt | Inventory, Payment, Notification |
| `OrderShipped` | Order | orderId, trackingNumber, carrier, shippedAt | Notification, Customer |
| `OrderDelivered` | Order | orderId, deliveredAt, signatureRequired | Notification, Analytics |
| `OrderReturned` | Order | orderId, returnReason, items, returnedAt | Inventory, Payment, Notification |
| `InventoryReserved` | Inventory | orderId, reservationId, items, reservedAt | Payment |
| `InventoryReleased` | Inventory | orderId, reservationId, reason, releasedAt | Order |
| `StockDepleted` | Inventory | skuId, warehouseId, depletedAt | Catalog, Notification |
| `StockReplenished` | Inventory | skuId, quantityAdded, newTotal, replenishedAt | Catalog, Analytics |
| `PaymentAuthorized` | Payment | orderId, authorizationCode, amount, authorizedAt | Order |
| `PaymentCaptured` | Payment | orderId, transactionId, amount, capturedAt | Order |
| `PaymentFailed` | Payment | orderId, failureCode, failureReason, failedAt | Order, Notification |
| `RefundRequested` | Order | orderId, refundAmount, reason, requestedAt | Payment |
| `RefundCompleted` | Payment | orderId, refundId, amount, completedAt | Order, Notification |
| `ShipmentCreated` | Shipping | shipmentId, orderId, warehouseId, createdAt | Order, Notification |
| `ShipmentDispatched` | Shipping | shipmentId, orderId, carrier, trackingNumber, dispatchedAt | Order, Notification |
| `ShipmentDelivered` | Shipping | shipmentId, orderId, deliveredAt, proofOfDelivery | Order, Notification |
| `DeliveryFailed` | Shipping | shipmentId, orderId, failureReason, attemptedAt | Order, Notification |
| `CustomerRegistered` | Customer | customerId, email, locale, registeredAt | Notification, Analytics |
| `AddressAdded` | Customer | customerId, addressId, addressType, addedAt | Customer, Notification |

### Naming Conventions

All events in this catalogue follow past-tense, business-vocabulary naming as described in `research/eda.md#event-design`. The rule is straightforward: an event describes something that already happened in the business, expressed in the language that domain experts use, not the language of database operations.

Avoid these anti-patterns: `OrderUpdated` (which update? the address? the status? the items?), `RecordInserted` (technical CRUD language invisible to business), `ProcessOrder` (imperative, a command not an event), `OrderStatusChanged` (generic; say specifically what changed). Every event name in the table above answers the question "what happened?" in terms a warehouse manager or finance analyst would recognize without a developer translation layer.

The PascalCase convention — `OrderPlaced`, `PaymentAuthorized`, `InventoryReserved` — is standard in JVM and .NET ecosystems. In Kafka topic naming, the same events become snake_case topic names: `order.placed`, `payment.authorized`, `inventory.reserved`. The PascalCase class name and the dotted topic name are two representations of the same event type (de la Torre et al., .NET Microservices, Microsoft, 2017–2024).

Tense is non-negotiable: `OrderPlaced` (past, correct) versus `PlaceOrder` (imperative, a command) versus `OrderPlacing` (present progressive, ambiguous state). A consumer processing `OrderPlaced` knows it is reacting to a historical fact and must not try to reject or modify it; a consumer processing `PlaceOrder` might assume it has the authority to reject the operation, breaking the event's immutability contract (Verraes, DDD Europe 2019; `research/eda.md#event-design`).

Business vocabulary excludes technical identifiers from event names themselves: `PaymentGatewayWebhookReceived` is a technical event name that leaks infrastructure concerns into the domain language; `PaymentAuthorized` is the business fact that the domain expert cares about, regardless of whether it arrived via Stripe webhook, PayPal IPN, or a bank redirect.

---

## Order Fulfillment Saga

The Order Fulfillment Saga traces the happy-path choreography flow from customer checkout through delivery confirmation. Each step lists the acting context, the event consumed, the event emitted, and the side-effect committed. The saga uses the PascalCase event names from the Domain Events catalogue above.

**1. Customer submits checkout**
- Actor: Customer (browser)
- Acting context: Cart
- Event consumed: (user action — no upstream event)
- Event emitted: `CheckoutStarted`
- Side-effect: Cart state frozen; session timer stopped; abandoned-cart timer cancelled.

**2. Order creation**
- Acting context: Order
- Event consumed: `CheckoutStarted`
- Event emitted: `OrderPlaced`
- Side-effect: Order aggregate created in `Pending` state; line items snapshot taken from cart payload; `OrderPlaced` written to Outbox table in same database transaction as the Order row. Outbox relay publishes to `order.placed` Kafka topic.

**3. Inventory reservation**
- Acting context: Inventory
- Event consumed: `OrderPlaced`
- Event emitted: `InventoryReserved` (happy path) or `StockDepleted` (failure path — see Failure Flows)
- Side-effect: available stock count decremented; reservation record created with orderId and expiry timestamp.

**4. Payment authorization**
- Acting context: Payment
- Event consumed: `InventoryReserved`
- Event emitted: `PaymentAuthorized` (happy path) or `PaymentFailed` (failure path)
- Side-effect: gateway authorization call issued; authorization code stored; Outbox entry written.

**5. Payment capture**
- Acting context: Payment
- Event consumed: (internal Payment saga step — authorization capture timer)
- Event emitted: `PaymentCaptured`
- Side-effect: charge captured from authorization; transaction record committed; Outbox entry written.

**6. Order confirmation**
- Acting context: Order
- Event consumed: `PaymentCaptured`
- Event emitted: `OrderConfirmed`
- Side-effect: Order aggregate transitions from `Pending` to `Confirmed` state.

**7. Shipment creation**
- Acting context: Shipping
- Event consumed: `OrderConfirmed`
- Event emitted: `ShipmentCreated`
- Side-effect: pick list generated; warehouse task created; shipment record created.

**8. Dispatch**
- Acting context: Shipping
- Event consumed: (carrier API callback — label printed)
- Event emitted: `ShipmentDispatched` → Order context consumes and publishes `OrderShipped`
- Side-effect: tracking number assigned; carrier manifest submitted; Order aggregate transitions to `Shipped`.

**9. Delivery**
- Acting context: Shipping
- Event consumed: (carrier delivery webhook)
- Event emitted: `ShipmentDelivered` → Order context consumes and publishes `OrderDelivered`
- Side-effect: delivery timestamp and proof-of-delivery stored; Order aggregate transitions to `Delivered`.

**10. Parallel notification**
- Acting context: Notification
- Events consumed: `OrderPlaced`, `OrderShipped`, `OrderDelivered` (in parallel, independently)
- Event emitted: (none — side-effect only)
- Side-effect: confirmation email sent on `OrderPlaced`; dispatch email with tracking number sent on `OrderShipped`; delivery confirmation email sent on `OrderDelivered`.

### Choreography vs Orchestration Trade-off

The ShopSphere saga above uses **choreography**: each context reacts to the previous context's event with no central coordinator. This is pedagogically clear — the business flow is visible by reading the event sequence — but Newman warns explicitly that choreography becomes hazardous beyond three to four steps: "with five or six steps, the lack of a central coordinator means the business flow is hidden across many services, making it hard to monitor, hard to retry on partial failure, and hard to add timeouts" (Newman, 2021, ch. 6). Richardson echoes this, documenting a `CreateOrderSaga` orchestrator in the FTGO reference application precisely because the order creation flow exceeds four steps (Richardson, microservices.io/patterns/data/saga.html). ShopSphere's ten-step saga would, in a production system, warrant switching to orchestration using a Process Manager — a dedicated saga orchestrator that holds the saga state machine explicitly, sends commands to each participating context, and handles compensations centrally. ShopSphere uses choreography only for teaching clarity; the dissent section of this plan acknowledges the pedagogical simplification.

---

## Failure Flows

### Payment Failure Handling

After `InventoryReserved` is published, the Payment context attempts authorization. If the gateway declines the card, Payment publishes `PaymentFailed` instead of `PaymentAuthorized`. The Order context consumes `PaymentFailed` and transitions the Order aggregate to `Cancelled`, publishing `OrderCancelled`. The Inventory context consumes `OrderCancelled` and publishes `InventoryReleased`, restoring the reserved stock to available inventory. The Notification context consumes both `PaymentFailed` and `OrderCancelled`: it sends the customer a "payment was declined" email with a link to update their payment method. No shipment was ever created, so no Shipping compensations are needed. Richardson documents this precise compensating event chain in the FTGO CreateOrderSaga failure scenario (Richardson, *Microservices Patterns*, Manning, 2018).

### Inventory Reservation Failure

If the Inventory context cannot fulfill the reservation — because stock has been depleted between the time the customer added to cart and the time the order was placed — it publishes `StockDepleted` instead of `InventoryReserved`. The Order context consumes `StockDepleted` and publishes `OrderCancelled`. Because no `InventoryReserved` event was published, no payment was ever attempted, so no Payment compensation is needed. The Notification context sends an out-of-stock notification email. Optionally, the Cart context may consume `OrderCancelled` and publish a new `CartCreated` event to re-stage the customer's items, allowing them to continue shopping without losing their selection (Newman, 2021, ch. 6). This is a common UX pattern in real e-commerce systems: instead of an error page, the customer sees a populated cart with a note that the requested quantity was unavailable.

### Cancellation After Capture

If a customer cancels after `PaymentCaptured` has been published but before `ShipmentDispatched`, the Order context must coordinate a multi-step compensating flow. The customer action triggers `OrderCancelled` from the Order context. The Payment context consumes `OrderCancelled` and, because a capture already occurred, initiates a refund — publishing `RefundRequested`, then `RefundCompleted` once the gateway processes the reversal. The Inventory context consumes `OrderCancelled` and publishes `InventoryReleased`. The Notification context sends a cancellation confirmation and a refund-initiated email on `RefundRequested`, then a refund-complete email on `RefundCompleted`. If cancellation is requested after `ShipmentDispatched`, the flow becomes a return rather than a cancellation, triggering `OrderReturned` and a different compensation path. Richardson calls this distinction between "pre-dispatch cancel" and "post-dispatch return" a critical saga state machine boundary (Richardson, microservices.io/patterns/data/saga.html).

---

## ShopSphere Teaching Model

*ShopSphere is a fictional Thai marketplace created as a teaching example for this course. All domain modelling decisions below are illustrative — they are designed to maximize teaching clarity, not to represent any real production system.*

ShopSphere uses eight bounded contexts that deliberately mirror the structure documented in real-world references above. Each context choice is justified by pointing at a published industry analog so students understand that these are not arbitrary pedagogical inventions.

The eight ShopSphere contexts and their real-world analogs: **Customer** (analogous to Shopify's Customer component — owns identity and addresses, not purchase history); **Catalog** (Shopify's Product component — owns descriptions, pricing, and taxonomy, not stock counts); **Cart** (the Cart module in any e-commerce platform — ephemeral, session-scoped, not persisted as an order); **Order** (Richardson's FTGO Order service — the lifecycle state machine and canonical order record); **Inventory** (Shopify's Inventory component, explicitly split from Catalog — stock counts, reservations, and warehouse location); **Payment** (Richardson's FTGO Accounting service — PCI-scoped, gateway-integrated, owns authorization and capture); **Shipping** (citerus dddsample-core Cargo domain — pick/pack/ship workflow and carrier integration); **Notification** (Richardson's FTGO Notification service — pure consumer, no business entities, multi-channel dispatch).

ShopSphere's event flows use the exact PascalCase event names from the Domain Events catalogue: `CheckoutStarted` → `OrderPlaced` → `InventoryReserved` → `PaymentAuthorized` → `PaymentCaptured` → `OrderConfirmed` → `ShipmentCreated` → `ShipmentDispatched` → `OrderShipped` → `ShipmentDelivered` → `OrderDelivered`. Failure paths use: `PaymentFailed` → `OrderCancelled` → `InventoryReleased`; and `StockDepleted` → `OrderCancelled`. These event names are consistent with the worked examples in `research/eda.md#e-commerce-worked-example` and align with the event timeline produced in `research/event-storming.md`'s checkout example.

ShopSphere makes three explicit pedagogical simplifications that differ from production recommendations. First, ShopSphere uses **choreography throughout** the Order Fulfillment Saga. Newman recommends switching to orchestration at four or more steps; ShopSphere's saga has ten steps and in production would warrant a Process Manager. Choreography is used here because it makes the event chain visible and traceable for learners — each event appears explicitly in the saga narrative. Second, ShopSphere **omits the Tax context**. In production, tax calculation (VAT, withholding tax, cross-border e-commerce tax) is typically a separate bounded context or a third-party service integration (Avalara, TaxJar). The Thai marketplace context involves 7% VAT on most goods, but the complexity of tax rulesets is out of scope for a DDD teaching example. Third, ShopSphere **omits the Returns and Loyalty contexts**. A real marketplace would have rich return management (RMA workflows, return shipping label generation, restocking logic) and a loyalty points system. These are suppressed to keep the context map tractable at seven modules.

These simplifications are documented explicitly — not hidden — so that students can reason about where a real implementation would diverge from the teaching model. Cross-reference: `research/ddd.md#bounded-context` for the strategic design principle underlying context boundary decisions; `research/eda.md#e-commerce-worked-example` for the EDA patterns applied across these contexts; `research/event-storming.md` for the workshop technique used to discover these events and context boundaries in the first place.

The Thai marketplace framing of ShopSphere (ร้านตลาดออนไลน์) adds one domain-specific nuance not present in Western e-commerce references: Cash on Delivery (COD) is a dominant payment method in Thailand, where many customers do not have credit cards or prefer not to use them online. COD changes the Payment saga flow: `PaymentAuthorized` and `PaymentCaptured` do not occur before `OrderConfirmed`; instead, `OrderConfirmed` fires immediately on `InventoryReserved`, and `PaymentCaptured` fires only when the delivery driver confirms cash receipt — triggering `ShipmentDelivered` and `PaymentCaptured` simultaneously. This COD variant is a concrete illustration of why the Order Fulfillment Saga must be configurable by payment method, and why a saga orchestrator is more appropriate than choreography for handling these conditional branches.

---

## What Is Typical vs Varies

Understanding which design decisions are industry-standard and which are team-specific helps students distinguish "this is how it's done" from "this is one way to do it."

### Typical (consistent across most production e-commerce systems)

- **Separate Payment context with PCI scope boundary.** Every mature e-commerce architecture isolates payment credential handling from order management. PCI DSS compliance requires it. Teams that merge payment processing into the Order service inadvertently expand their PCI scope to the entire order system (Richardson, *Microservices Patterns*, Manning, 2018).
- **Separate Inventory from Catalog.** Shopify, Richardson's FTGO, and Vernon's DDD examples all show this split. Product descriptions and pricing are catalog concerns; stock counts and reservations are inventory concerns. Merging them creates a context that changes for two different reasons at two different rates (Westeinde, Shopify Engineering, 2019).
- **Past-tense Domain Events.** `OrderPlaced`, `PaymentAuthorized`, `InventoryReserved` — not `PlaceOrder`, `AuthorizePayment`, `ReserveInventory`. This is not a style preference; it enforces the correct immutability semantics (Verraes, DDD Europe 2019; `research/eda.md#event-design`).
- **Outbox pattern for dual-write safety.** Writing to the database and publishing to a broker in the same operation is unsafe without the Outbox. The pattern is canonical in Richardson, Newman, and the .NET microservices guide (Richardson, microservices.io/patterns/data/transactional-outbox.html).
- **Idempotent consumers.** Brokers guarantee at-least-once delivery. Every consumer must be safe to call multiple times with the same message. Idempotency bugs cause double-charges and double-fulfillments on high-load days (Newman, 2021).
- **Dead Letter Queue for unprocessable messages.** Poison messages that fail processing must go somewhere. A DLQ is universally recommended across all broker technologies — Kafka, RabbitMQ, SQS (Hohpe & Woolf, *Enterprise Integration Patterns*, 2003).

### Varies (team-specific or context-specific decisions)

- **Choreography vs orchestration.** Both are valid. Small teams with simple flows (two to three steps) often start with choreography. Netflix built a dedicated orchestrator (Conductor) when choreography became unmanageable. Newman recommends orchestration at four or more steps, but many teams stick with choreography longer for simplicity. Shopify's modular monolith uses neither — in-process function calls between modules remove the need for a broker-based saga altogether (Westeinde, Shopify Engineering, 2019; Newman, 2021).
- **Cart as a service vs a library.** Some platforms implement Cart as a full microservice with its own database; others implement it as a stateless library backed by a session cache or a client-side cookie. The right choice depends on scale and whether the Cart state needs to be shared across devices.
- **Order state machine granularity.** Some systems have two states (Pending, Completed); others have ten or more (Pending, AwaitingPayment, PaymentAuthorized, PaymentCaptured, Confirmed, PickingInProgress, Packed, Dispatched, InTransit, Delivered, ReturnRequested, Returned). The right granularity depends on operational visibility requirements.
- **Whether Shipping is in-house or a third-party context.** Shopify uses a combination of Shopify Shipping (their own carrier-integration product) and third-party apps. Small merchants outsource entirely to a 3PL (third-party logistics provider) context. Whether Shipping is an internal bounded context or an external system depends on whether the organization controls the warehouse.
- **Monolith vs microservices physical deployment.** Shopify proves that bounded contexts do not require microservices: their modular monolith achieves context isolation through code architecture rather than network boundaries. The trade-off is operational simplicity (no distributed tracing, no broker, no saga) versus independent deployability and independent scaling (Westeinde, Shopify Engineering, 2019).
- **Whether Tax is its own context.** High-volume retailers with complex multi-jurisdiction tax obligations (cross-border e-commerce, US sales tax nexus, EU VAT) typically have a dedicated Tax context or integrate a specialist service. Simpler operations fold tax calculation into the Order context as a domain service.

---

## Sources

- Richardson, Chris. *Microservices Patterns*. Manning, 2018. The definitive treatment of Saga, Outbox, and CQRS patterns in a microservices context. The FTGO reference application (github.com/microservices-patterns/ftgo-application) provides runnable examples of all three. Pattern catalogue available at microservices.io/patterns/data/saga.html and microservices.io/patterns/data/transactional-outbox.html.

- Newman, Sam. *Building Microservices*, 2nd Ed. O'Reilly, 2021. Chapter 4 (Communication Styles) and Chapter 6 (Workflow and Sagas). Chapter 6 contains the specific recommendation to switch from choreography to orchestration at four or more saga steps, and a worked e-commerce example.

- Vernon, Vaughn. *Implementing Domain-Driven Design*. Addison-Wesley, 2013. The primary tactical DDD reference. Chapters on Bounded Contexts, Aggregates, and Domain Events are directly applied in the ShopSphere context boundary justifications above.

- Evans, Eric. *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley, 2003. The foundational text. The Cargo Shipping domain model in Part IV is the direct ancestor of the citerus/dddsample-core implementation. Evans' DDD Europe keynotes (2015, 2019) are referenced for context boundary guidance.

- Westeinde, Kirsten. "Deconstructing the Monolith: Designing Software that Maximizes Developer Productivity." Shopify Engineering Blog, engineering.shopify.com, 2019. The primary reference for Shopify's modular monolith bounded context approach, the Product/Inventory split, and the argument that context isolation does not require microservices.

- Shopify Engineering Blog, engineering.shopify.com, 2022. Follow-up posts on scaling the modular monolith and enforcing context boundaries through component ownership of database tables.

- Netflix Tech Blog, netflixtechblog.com. "Conductor: Why We Built a New Workflow Orchestrator" (2018, updated 2020); Studio Production event-driven architecture posts (2020–2022). Referenced for the real-world switch from choreography to orchestration and the analogous mapping of Netflix content delivery events to e-commerce fulfillment events.

- citerus/dddsample-core. github.com/citerus/dddsample-core. The Java implementation of the DDD Cargo Shipping domain from Evans (2003). Reference implementation for tactical DDD patterns — Aggregates, Repositories, Domain Events, Factories — applied to a logistics domain structurally similar to ShopSphere's Shipping context.

- Verraes, Mathias. "DDD & Messaging Architectures." DDD Europe 2019, dddeurope.com archive. Covers domain event naming discipline (past tense, business vocabulary, no CRUD names) and the e-commerce checkout example used to illustrate `OrderShipped` vs `OrderUpdated` naming quality.

- Evans, Eric. DDD Europe Keynotes 2015, 2018, 2019. dddeurope.com archive. The 2019 keynote includes the "Order as pick-list vs Order as customer intent" example referenced in the Bounded Contexts section above.

- de la Torre, Cesar; Wagner, Bill; Rousos, Mike. *.NET Microservices: Architecture for Containerized .NET Applications*. Microsoft, 2017–2024. docs.microsoft.com/dotnet/architecture/microservices. Canonical framing of the Domain Event vs Integration Event distinction and PascalCase event naming conventions in the .NET/C# ecosystem.

- Hohpe, Gregor and Woolf, Bobby. *Enterprise Integration Patterns*. Addison-Wesley, 2003. Dead Letter Channel, Idempotent Receiver, and Publish-Subscribe Channel patterns referenced in the Domain Events and What Is Typical vs Varies sections.
