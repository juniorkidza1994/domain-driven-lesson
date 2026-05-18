# E-Commerce Real-World Examples — Research Reference

> Source notes for Module 7 (ShopSphere case study). Citations refer to
> Richardson's microservices.io pattern catalogue, Shopify Engineering Blog,
> Netflix Tech Blog, the citerus/dddsample-core repository, Newman's Building
> Microservices 2nd Ed. (2021), Vernon's Implementing Domain-Driven Design
> (2013), and the DDD Europe talk archive.

## Table of Contents
- [Real Company References](#real-company-references)
- [Bounded Contexts](#bounded-contexts)
- [Context Map](#context-map)
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

## Context Map

A Context Map documents all Bounded Contexts in a system and their interrelationships, making implicit integration contracts visible (Evans, 2003, Part IV, Chapter 14). It answers two questions that the Bounded Contexts section alone cannot answer: (1) *how do you decide where the boundary should be drawn in the first place?* and (2) *once the boundary exists, what is the explicit pattern governing how the two contexts interact?*

### How to Identify Boundary Locations (Decomposition Signals)

Evans and Vernon describe six signals that reliably indicate a bounded context boundary. These signals apply to ShopSphere and to any e-commerce system; they are the same signals Shopify used when decoupling their Rails monolith into bounded modules (Westeinde, Shopify Engineering, 2019).

**Signal 1 — Linguistic shift.** The same noun means different things to different teams. Evans' canonical example from DDD Europe 2019: "Order" in the Sales context means the customer's checkout intent — a list of desired items and a shipping address. "Order" in the Fulfillment context means a warehouse pick list — a physical instruction to retrieve specific bins. Same word, different concepts. The linguistic seam marks the boundary. In ShopSphere, "Product" in the Catalog context means a description, price, and image. "Product" in the Inventory context means a physical stock-keeping unit in a warehouse bin. The word is the same; the model is different. Split here (Evans, DDD Europe 2019; ddd.md §Context Mapping Patterns).

**Signal 2 — Different rates of change.** Catalog data changes on a marketing cadence — product descriptions updated weekly, prices changed for seasonal promotions. Inventory data changes on a transactional cadence — every sale, every supplier receipt, every stock adjustment. Systems that change at different rates for different reasons should be separated. Shopify's engineering team made this exact decision: the Product component (Catalog) and Inventory component are explicitly split, communicating through declared interfaces rather than shared tables (Westeinde, Shopify Engineering, 2019; Vernon, 2013).

**Signal 3 — Team ownership conflict.** When two teams argue about who owns the model for a concept, the disagreement itself marks the boundary. The Order management team and the Fulfillment team arguing about who owns "shipment status" is a signal that Shipping should be its own bounded context with an explicit interface. Richardson's FTGO application places Order and Delivery as separate services precisely because the team structures and responsibilities are distinct (Richardson, microservices.io).

**Signal 4 — Data coupling with divergent rules.** If two modules read the same database rows but apply different business rules to them, they are actually different bounded contexts sharing data unsafely. A single "products" table that both the Catalog team (who cares about SEO metadata) and the Inventory team (who cares about bin location and reorder point) write to is a Shared Kernel relationship that should be made explicit or split (Evans, 2003; ddd.md §Context Mapping Patterns).

**Signal 5 — Regulatory or organizational boundary.** PCI DSS compliance is a hard regulatory boundary: no context that does not handle card data should be inside PCI scope. Payment is isolated as its own bounded context because the regulatory constraint mandates it, not because of any internal model disagreement. Similarly, a third-party logistics provider (3PL) is an external organization — an organizational boundary that maps directly to an external bounded context accessed via Anti-Corruption Layer (Richardson, *Microservices Patterns*, Manning, 2018).

**Signal 6 — Conformance pressure.** If one team is forced to match another team's API exactly with no negotiation, a Conformist relationship exists. If a team can design a stable API and offer it to multiple consumers without negotiation per consumer, an Open Host Service relationship exists. Recognizing these power asymmetries at design time prevents invisible coupling from accumulating over time (Evans, 2003; Vernon, 2013, Chapter 3).

### ShopSphere Context Map — Relationship Table

The following table documents the relationship pattern between each pair of bounded contexts in ShopSphere. Patterns follow the nine canonical patterns defined in Evans (2003) and applied to e-commerce in ddd.md §Context Mapping Patterns.

| Upstream Context | Downstream Context | Pattern | Rationale |
|---|---|---|---|
| Customer | Order | **Customer-Supplier** | Order is downstream: it consumes customer identity (customerId, name, shipping address) at order-creation time and stores a snapshot inside the Order aggregate. Customer dictates the identity contract; Order must conform. Snapshot ownership prevents Order from being blocked by address changes (Vernon, 2013). |
| Catalog | Cart | **Open Host Service + Published Language** | Catalog exposes a product search and detail API (OHS) with a documented JSON schema (PL). Cart consumes it to build line items. Multiple consumers (Cart, third-party affiliates, mobile apps) use the same stable interface without negotiation (Evans, 2003; ddd.md §Context Mapping Patterns). |
| Catalog | Order | **Open Host Service + Published Language** | Order reads Catalog's product data at checkout to create the immutable line-item snapshot. Same OHS as above; Order is just another consumer. The snapshot decouples Order from future Catalog changes (Richardson, FTGO, microservices.io). |
| Catalog | Inventory | **Shared Kernel** | Catalog and Inventory share a canonical Product Identity value object — the SKU identifier and variant code. Any change to the SKU schema requires joint agreement from both teams. This is the one Shared Kernel in ShopSphere; it is kept deliberately small (Evans, 2003; Westeinde, Shopify Engineering, 2019; ddd.md §Context Mapping Patterns). |
| Order | Inventory | **Customer-Supplier** | Order (supplier) dictates the reservation contract: when `OrderPlaced` fires, it carries the exact line-item payload that Inventory must use to process the reservation. Inventory (customer) must conform to the event schema Order publishes. Inventory does not negotiate the contract (Vernon, 2013). |
| Order | Payment | **Partnership** | Order and Payment co-develop the checkout flow. The PaymentIntent contract and the `CheckoutStarted` event schema are jointly evolved by both teams under a shared sprint cadence. Neither context can release a breaking change without coordinating with the other. This Partnership is appropriate because Order and Payment are co-located in the same team at ShopSphere's scale (Evans, 2003; ddd.md §Context Mapping Patterns). Note: Newman warns Partnership is unsustainable at organizational scale — it should evolve to Customer-Supplier as teams grow (Newman, 2021). |
| Order | Shipping | **Customer-Supplier** | Order (supplier) publishes `OrderConfirmed`, which contains the ShipmentRequest data. Shipping (customer) must conform to that event schema to begin the pick-pack-ship workflow. Shipping does not influence the Order model (Evans, 2003; citerus/dddsample-core). |
| Shipping | Carrier API (external) | **Anti-Corruption Layer** | The carrier API (external bounded context — e.g., Thailand Post, Ninja Van) uses its own terminology: "consignment", "waybill", "manifest". An ACL inside the Shipping context translates between the carrier's language and ShopSphere's internal `Shipment`, `TrackingNumber`, and `DeliveryEvent` model. The ACL protects the ShopSphere domain model from carrier API churn (Evans, 2003; ddd.md §Context Mapping Patterns). This is the same ACL pattern Shopify uses when integrating third-party shipping apps with their internal Order model. |
| Payment | Stripe/Gateway (external) | **Conformist** | Payment integrates with Stripe's API by adopting Stripe's model verbatim — no translation layer. Payment's internal `PaymentIntent`, `Charge`, and `Refund` concepts map directly to Stripe's API objects. Conformist is appropriate here because Stripe is a Generic subdomain: ShopSphere has no competitive differentiation in how it communicates with a payment gateway, and the cost of maintaining an ACL outweighs the model purity benefit (Vernon, 2013; Richardson, *Microservices Patterns*, Manning, 2018; ddd.md §Context Mapping Patterns). |
| (all contexts) | Notification | **Conformist** | Notification is a pure consumer of integration events. It adopts the event schemas published by Order, Payment, Shipping, and Cart verbatim — no translation, no ACL. This is appropriate because Notification owns no business entities: it only needs to know "what message to send when this event occurs," and that logic does not require model autonomy. Richardson's FTGO Notification service follows the same pattern (Richardson, microservices.io). |
| Promotions engine | Cart | **Separate Ways** | The Promotions/Discounts engine solves promo code and discount logic independently. Cart recalculates totals locally by calling a Promotions service with no shared domain model. When Promotions and Cart are genuinely decoupled teams with no dependency, Separate Ways prevents unnecessary coupling (Evans, 2003; ddd.md §Context Mapping Patterns). |

### Cross-Context Interaction Mechanics

The pattern label describes the *relationship*; the integration mechanism describes *how the interaction is implemented* in the running system.

**Domain Events as the cross-context integration mechanism.** In an event-driven system, Integration Events are the primary implementation of Customer-Supplier, OHS, and Conformist relationships at context boundaries. Each context publishes events in its own ubiquitous language (e.g., Order publishes `OrderPlaced`); downstream contexts subscribe to those events and react without calling back to the upstream context. This decouples the producer and consumer at runtime, making the upstream context resilient to downstream failures (Verraes, DDD Europe 2019; eda.md §Integration Events).

**Anti-Corruption Layer as an event-translating adapter.** When a ShopSphere context consumes events from an external system (Carrier API, legacy warehouse ERP), the ACL sits between the external event stream and the internal domain model. The ACL pattern manifests as: (1) consume the external event in its raw form, (2) translate to an internal domain event using a dedicated translation service, (3) publish the translated internal event as if it originated inside ShopSphere. The ACL is invisible to all internal consumers — they only see `ShipmentDelivered`, never the carrier's raw `DeliveryStatusWebhook`. Combining an ACL with the Outbox pattern ensures that translation and re-publication are atomic, preventing half-translated states (Evans, 2003; Richardson, microservices.io/patterns/data/transactional-outbox.html; ddd.md §Context Mapping Patterns).

**Open Host Service as a documented event schema.** The Catalog context's OHS is not just a REST endpoint — it also includes the event schema for `ProductPriceChanged` and `ProductDiscontinued` events. Downstream contexts (Cart, Order, Notification) subscribe to these events via the Published Language: a documented Avro or JSON schema that Catalog owns and versions. This is the same mechanism as a data contract in a Data Mesh architecture — Catalog is the "data product producer," and Cart, Order, Notification are consumers (Verraes, DDD Europe 2019; eda.md §Published Language; ddd.md §Context Mapping Patterns).

**Snapshot as Customer-Supplier decoupling technique.** The Customer-Supplier pattern between Customer context and Order context is implemented via a data snapshot, not a live query. When `CheckoutStarted` fires, the Order context reads the customer's address from the Customer API at that moment and stores a copy inside the Order aggregate. From that point, the Order context is fully autonomous — it does not query Customer again for the lifetime of that order. This is the technique Richardson documents for the FTGO Consumer-Order relationship: "the order service stores a copy of the consumer information rather than calling the consumer service at runtime" (Richardson, *Microservices Patterns*, Manning, 2018).

**Partnership co-design in Event Storming.** The Partnership pattern between Order and Payment is operationalized through a shared Design-Level Event Storming session. Both teams participate in the same session, jointly modeling the checkout flow, the `CheckoutStarted` event payload, and the failure scenarios. The session output — agreed event names, agreed payload fields, agreed saga steps — becomes the Published Language contract between them. This is the DDD Crew's recommended technique for Partnership teams: use Domain Message Flow Modeling or Design-Level ES together rather than writing API specs in isolation (Evans, DDD Europe keynotes; ddd.md §Context Mapping Patterns §Workshop Activity).

### Context Map Evolution

Context mapping patterns are not permanent. Vernon (2013, Chapter 3) and Newman (2021) both document typical evolutionary trajectories that apply directly to ShopSphere as the team and codebase grow.

The Order-Payment **Partnership** should evolve to a **Customer-Supplier** relationship once the checkout contract stabilizes. Newman explicitly warns that "Partnership requires continuous high-bandwidth communication between teams; this is unsustainable as organizations grow; the natural evolution is a stable upstream API with downstream consumer-driven contract tests" (Newman, 2021, ch. 6). In practice: once the `CheckoutStarted` event schema is stable and well-tested, Payment should treat it as a published interface it consumes, not a jointly-owned contract it co-authors.

The **Conformist** relationship between Payment and Stripe can evolve to an **ACL** if ShopSphere ever needs to support multiple payment gateways simultaneously (Stripe for international cards, PromptPay/TrueMoney for Thailand-specific payment methods). An ACL would translate gateway-specific terminology to ShopSphere's internal Payment model, allowing the Payment context to remain gateway-agnostic. Richardson documents this exact "multi-gateway ACL" pattern in the FTGO payment service design (Richardson, microservices.io).

The **Shared Kernel** between Catalog and Inventory (the SKU value object) is the highest-risk relationship in ShopSphere's context map. Vernon (2013) warns that Shared Kernels "create hidden coupling that surfaces only when one team needs to change the shared schema." The evolutionary path is to replace the Shared Kernel with an OHS: Catalog publishes `ProductVariantRegistered` events (containing SKU data); Inventory consumes those events and maintains its own local projection of variant identity, removing the need for shared code (Vernon, 2013; Westeinde, Shopify Engineering, 2019; ddd.md §Context Mapping Patterns §Evolution).

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
