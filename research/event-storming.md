# Event Storming — Research Reference

> Source notes for the Event Storming module. Citations refer to Brandolini's eventstorming.com, his Leanpub book "Introducing EventStorming" (2013–ongoing), Fowler's bliki entry (2017), and DDD Europe / Explore DDD talks 2015–2024.

## Table of Contents

- [What Is Event Storming](#what-is-event-storming)
- [Why Workshop Format, Why Physical Sticky Notes](#why-workshop-format-why-physical-sticky-notes)
- [Who Attends, Materials, Duration](#who-attends-materials-duration)
- [Three Levels](#three-levels)
- [Sticky Note Elements](#sticky-note-elements)
- [ES Artifacts in Detail](#es-artifacts-in-detail)
- [ES → DDD Bridge](#es--ddd-bridge)
- [Common Facilitator Mistakes](#common-facilitator-mistakes)
- [E-commerce Checkout — Worked Example](#e-commerce-checkout--worked-example)
- [Sources](#sources)

---

## What Is Event Storming

Event Storming is a workshop-based technique for rapidly exploring complex business domains by placing Domain Events — things that happened and matter to the business — at the center of the conversation, deliberately ignoring data structures and database schemas (Brandolini, eventstorming.com). The name combines "Event" (Domain Events, the primary modeling artifact) and "Brainstorming" (the generative, open-ended collaborative spirit of the session).

Alberto Brandolini invented Event Storming around 2012–2013 while reflecting on why traditional modeling sessions so often stalled. Those sessions tended to start from nouns — entities, tables, classes — forcing participants into debates about data ownership before they had agreed on what the system was supposed to do. Brandolini's insight was that past-tense facts ("an order was placed," "a payment failed") are easier for a mixed room of domain experts and developers to agree on than structural decisions. Events describe what already happened; they are observable, verifiable, and expressed in business language rather than technical jargon. The first public account appeared on his blog ziobrando.blogspot.com in 2013, and the technique was formalized in "Introducing EventStorming," published on Leanpub and continuously updated since then (Brandolini, 2013).

Martin Fowler summarized Event Storming in 2017, calling it "a workshop format for quickly exploring complex business domains" and noting that "the result is a shared understanding among all participants about what the key events are and the flows between them" (Fowler, 2017). Fowler's entry brought wider awareness outside the DDD community and remains one of the most widely cited secondary references.

The core premise is democratic: everyone in the room contributes stickies. There is no single expert presenting to passive listeners. Domain experts bring knowledge of what the business actually does; developers bring knowledge of what is technically feasible. The physical act of placing and moving stickies externalizes assumptions so they can be challenged by anyone in the room (Brandolini, "Introducing EventStorming").

## Why Workshop Format, Why Physical Sticky Notes

The workshop format is not incidental — it is the mechanism by which tacit, tribal knowledge is surfaced. In most organizations, critical business rules live in the heads of a handful of senior domain experts, undocumented and often contradicted by what the software actually implements. A document or interview cannot reliably extract this knowledge because the expert does not know which parts are non-obvious. A workshop, by contrast, forces contradictions into the open: when two domain experts place conflicting events on the wall, the conflict is visible and cannot be dismissed as a misunderstanding.

Physical sticky notes, applied to an "unlimited modeling space" — Brandolini's term for a paper roll spanning several meters of wall — provide specific affordances that digital tools struggle to replicate (Brandolini, eventstorming.com):

- **Low commitment, high mobility**: moving a sticky costs nothing. This lowers the psychological barrier to challenging a placement, which in turn lowers the barrier to disagreement. Digital diagrams feel more permanent and are harder to challenge.
- **Parallel contribution**: ten people can put stickies on the wall simultaneously. In a meeting, only one person speaks at a time.
- **Readable from across the room**: Sharpie-written text forces brevity and legibility. Participants can read the whole wall at a glance, perceiving flow and clusters that would require scrolling in a digital tool.
- **Color as a shared vocabulary**: the color coding (described in the Sticky Note Elements section) is a mnemonic layer — participants learn to parse the board by color at a glance without reading every word.

Brandolini acknowledges that remote or hybrid teams do use digital tools such as Miro and Mural, and that the technique still produces value in those contexts. However, he is explicit that the physical medium provides social-proximity and kinaesthetic benefits — people literally walk along the timeline, which creates a shared mental map of the domain — that distributed tools partially replicate but do not fully replace (Brandolini, DDD Europe 2018).

## Who Attends, Materials, Duration

**Attendees**

Brandolini's guidance is: "Invite the people who have questions and the people who have answers." In practice this means:

- **Domain experts** (essential): the people who know how the business works — not the managers who describe the business, but the operators who run it. A warehouse manager, a customer support lead, a fraud analyst.
- **Developers** (essential): the engineers who will implement the system. Not observers — active contributors who place stickies and ask questions.
- **Facilitator** (essential): ideally someone with no stake in the outcome. Their job is to keep the session moving, prevent any individual from dominating the wall, and ensure hotspots are captured rather than smoothed over.
- **Product owner, UX designer, operations staff** (valuable): broaden the perspective of what events exist and what information people need to act on them.

Group size of 6–20 is comfortable. Above 20 participants, Brandolini recommends splitting into parallel tracks, each exploring a different area of the domain, then reconvening to compare and align (Brandolini, "Introducing EventStorming").

**Materials**

- 8 meters or more of paper roll (butcher paper) taped to a wall — the unlimited modeling surface.
- Sticky notes in the canonical colors: orange (domain events), blue (commands), small yellow (actors), purple (policies), pink (hotspots), green (read models), large yellow (external systems), white (aggregates).
- Sharpie markers, not ballpoint pens — legible from 2 meters away.
- Masking tape and blu-tack to secure the paper roll.
- Optional: dot stickers in two colors for voting on hotspot priority.

**Duration**

| Format | Duration | Scope |
|---|---|---|
| Big Picture | 2–4 hours | Entire business domain |
| Process Level | Half-day to full day | One process or value stream |
| Design Level | Multiple sessions | One bounded context |

Kenny Baas-Schwegler, who has facilitated hundreds of Event Storming sessions and co-authored "Collaborative Software Design" (Manning, 2024), notes that remote facilitation typically adds 30–50% to session duration and requires more explicit facilitation cues to compensate for the reduced social proximity (Baas-Schwegler, 2024).

## Three Levels

Brandolini defines three progressively zoomed-in formats of Event Storming. All three use the same notation (sticky note colors and conventions), but differ in scope, participant set, and output artifacts.

| Level | Purpose | Output | Audience |
|---|---|---|---|
| **Big Picture** | Explore the entire business — surface every domain event across the company on one wall. | Event timeline, hotspots, candidate subdomain boundaries. | Whole organization: executives, domain experts, all development teams. |
| **Process Level** | Zoom into one process. Add commands, actors, policies, read models, and external systems. | Detailed process flow with causation chains, automation opportunities, policy formalization. | Cross-functional process team. |
| **Design Level** | Zoom into one bounded context. Identify aggregates and their invariants. | Aggregate sketches, command–event pairs, ready to translate into code. | Implementing development team plus 1–2 domain experts. |

The Big Picture format is the most widely used as a first encounter — it fits in a half-day and produces immediate value by revealing the hotspots (conflicts, pain points, unknowns) that nobody had named before. The Process Level is where most of the structural discovery happens: commands, policies, and read models become visible. The Design Level is explicitly a design activity: its output is close enough to code that developers can begin writing aggregate classes and event handlers directly from the wall (Brandolini, eventstorming.com/three-levels).

Fowler (2017) describes the Big Picture and Process Level but notes that the Design Level vocabulary (aggregates, read models) was still evolving when he wrote his entry — the current three-level framing is Brandolini's own elaboration from subsequent DDD Europe and Explore DDD talks.

## Sticky Note Elements

Brandolini's color conventions are now a de-facto industry standard. The exact colors matter because they create a visual grammar readable at a glance: an experienced Event Storming practitioner can scan a wall and immediately identify flow, causation, automation, and risk.

| Color | Element | Definition | Example (e-commerce checkout) |
|---|---|---|---|
| Orange | Domain Event | Something relevant that happened in the past. Always written in past tense. | *Order Placed*, *Payment Authorized*, *Item Added To Cart* |
| Blue | Command | An intention or request that, if accepted, produces a Domain Event. Written in imperative form. | *Place Order*, *Authorize Payment*, *Add Item To Cart* |
| Yellow (small) | Actor / User | The person or role issuing a command. A role, not an individual. | *Customer*, *Warehouse Operator*, *Fraud Analyst* |
| Purple | Policy | A rule of the form "Whenever event X happens, issue command Y." Reactive automation. | "Whenever Payment Authorized → Place Order" |
| Pink | Hotspot | A problem, conflict, open question, or pain point. The highest-value stickies in Big Picture. | "Why do refunds sometimes double-charge the customer?" |
| Green | Read Model | The information an actor needs to decide to issue a command. The data visible on a screen. | *Cart Summary*, *Order History View*, *Available Inventory* |
| Yellow (large) | External System | A system outside the modeled domain that emits or consumes events. | *Stripe*, *Shipping Carrier API*, *Tax Calculation Service* |
| White | Aggregate | A cluster of objects treated as a unit. Appears at Design Level. Receives commands, emits events. | *Order*, *Cart*, *Inventory Item*, *Payment* |

The canonical color set is defined in (Brandolini, "Introducing EventStorming"). Fowler (2017) lists slightly fewer colors in his bliki entry because the Design Level vocabulary — aggregates and read models — expanded in Brandolini's subsequent work after the 2017 post.

A note on the two yellows: the deliberate reuse of yellow for both Actors (small) and External Systems (large) is intentional — they are related concepts (both are "things that cause or receive events") but distinguished by size and context. In practice many facilitators use a distinct color for External Systems to avoid confusion; Brandolini notes this in the errata of his Leanpub book (Brandolini, eventstorming.com).

## ES Artifacts in Detail

**Domain Event** is the atomic unit of Event Storming. It is a business-meaningful fact recorded in the past tense — "Order Placed," not "Place Order" or "Order Placing." The tense is not arbitrary: past tense forces participants to describe things that actually happen in the real business, not aspirational system states. The most common mistake is writing technical events like "Database Row Inserted" or "Cache Invalidated" — these are implementation details, not domain facts. Domain Events appear at all three levels. At Big Picture they are deliberately vague and numerous; at Design Level they are precise and carry a defined payload.

**Command** is an intention that, if accepted by an aggregate, produces a Domain Event. Commands can be rejected — if a customer tries to place an order with an out-of-stock item, the "Place Order" command may be refused. This is the key distinction from Domain Events, which cannot be undone: an event is a historical fact, a command is a request. At Process Level, commands make the causal chain explicit: it is now clear what triggers each event and who is responsible.

**Policy** is a reactive rule of the form "Whenever event X happens, do Y." Policies are the invisible glue of most businesses — they encode business rules that are widely known but rarely written down, such as "Whenever an order is placed, notify the warehouse." Event Storming reliably surfaces policies because placing an event on the wall and asking "so what happens next?" usually elicits a policy response. In code, a policy often becomes a saga, a process manager, or a scheduled job.

**Actor** represents a role — a category of person — not an individual. One human can play multiple roles: the same person might act as a "Customer" in one flow and an "Administrator" in another. Actors answer the question "who decides to issue this command?" At Design Level, actors are sometimes replaced by policies (when the decision is automated) or external systems (when the trigger is outside the domain).

**External System** is any system outside the boundary of the domain being modeled. External systems force an important conversation: what is the integration contract? Does the domain own the data format, or does the external system dictate it? Mapping external systems is the first step toward identifying Anti-Corruption Layers and Open Host Services in DDD context mapping terms.

**Read Model** is the information that an actor needs to make a decision before issuing a command. The Cart Summary view that a customer sees before clicking "Place Order" is a Read Model. Read Models map naturally to the Query side of CQRS architectures: they are projections of Domain Events onto a form useful for decision-making. Identifying Read Models at Process Level directly informs what projections must be built.

**Hotspot** is the most operationally valuable sticky in a Big Picture session. Pink stickies mark questions nobody can answer, conflicts between two domain experts, pain points in the current process, and risks. Brandolini has said "If there are no hotspots, you are not doing it right" — the absence of hotspots indicates either that the domain is genuinely simple or that participants are not being honest about problems. After a Big Picture session, the hotspot density map is a prioritization tool: areas with many pink stickies deserve early design attention.

**Aggregate** appears exclusively at Design Level. It is a cluster of Domain Objects treated as a consistency unit — all changes to the aggregate are atomic, all invariants are enforced by the aggregate root. In Event Storming, an aggregate is identified by grouping commands and events: a command received by an aggregate produces an event emitted by that aggregate. The aggregate's name is often the most stable part of the Ubiquitous Language, surviving long after the implementation details change.

## ES → DDD Bridge

Event Storming produces raw material that maps directly onto Domain-Driven Design strategic and tactical patterns.

**From Big Picture to Bounded Context identification**: clusters of Domain Events that share a vocabulary — the same nouns, the same verbs, the same domain experts who understand them — are candidate Bounded Contexts. The vocabulary shift is the signal: if participants notice that the word "Order" means something different in the Checkout flow than in the Fulfillment flow, that divergence marks a context boundary (Brandolini, eventstorming.com). In DDD terms, each Bounded Context has its own Ubiquitous Language, and Event Storming makes that language audible.

**Pivotal Events** are Brandolini's term for Domain Events that mark the seam between two contexts. "Order Placed" is the canonical example in an e-commerce domain: everything to the left (Cart, Checkout) is the Sales context; everything to the right (Fulfillment, Shipping, Inventory) is the Operations context. The same event name appears on both sides, but the teams that care about it, the data they need from it, and the actions they take differ. This is exactly the relationship DDD calls a Published Language or Customer–Supplier context map pattern.

**From hotspots to context map refinement**: a high density of hotspots around a particular event or process area signals a missing or mis-drawn Bounded Context boundary. If two teams argue about who "owns" an event, the boundary is wrong.

**From Process Level to tactical design**: the command–event pairs discovered at Process Level become the skeleton of aggregate methods. "Place Order" (command) → "Order Placed" (event) becomes an `Order.placeOrder()` method that returns an `OrderPlacedEvent`. The policy "Whenever Payment Authorized → Reserve Inventory" becomes a saga or process manager listening to `PaymentAuthorizedEvent` and issuing a `ReserveInventory` command.

**From Design Level to aggregate code**: the Design Level output is the closest to executable specification. Each aggregate name becomes a class; each command becomes a method; each event becomes an event class. Nick Tune has written extensively on feeding Design Level output into the Bounded Context Canvas, which then guides team organization and API design (Tune, 2018–2024).

## Common Facilitator Mistakes

Experienced ES practitioners, including Brandolini, Verraes, and Baas-Schwegler, identify a consistent set of failure modes:

- **Starting with nouns or entities**: the facilitator asks "what are the main entities?" instead of "what are the main events?" This immediately recreates the CRUD/data-model mindset that Event Storming is designed to escape. Always start with past-tense events (Brandolini, "Introducing EventStorming").
- **Developer dominance**: developers often step forward and start drawing technical flows while domain experts go quiet. The facilitator must physically direct domain experts to the wall and invite their stickies. If the wall is filled by developers, the session has failed its purpose.
- **Skipping hotspots to stay positive**: some facilitators discourage pink stickies to "keep the energy up." This destroys the session's most valuable output. Hotspots are not complaints — they are the prioritized backlog of problems that need design attention (Brandolini, DDD Europe 2018).
- **Premature convergence**: locking onto the first plausible event timeline before exploring alternatives. A good Big Picture session will produce multiple contradictory versions of the same flow before converging — the contradictions are the insight.
- **Undersized wall**: a wall that is too short forces the model to shrink prematurely. Participants start merging distinct events, hiding complexity. Brandolini is explicit: 8+ meters minimum for a company-wide Big Picture (Brandolini, eventstorming.com).
- **Treating colors as decorative**: when participants stop distinguishing commands from events, or policies from external systems, the wall loses its readability. Enforcing the color contract is a core facilitator responsibility.
- **Wrong tense on events**: events written in the present or future tense ("Place Order," "Order Will Be Shipped") are commands or intentions, not facts. The facilitator must catch and correct these immediately. (Brandolini, "Introducing EventStorming"); see also Verraes on "the grammar of Domain Events" (Verraes, 2018).
- **Digital-tool misuse in remote sessions**: copy-pasting pre-made sticky templates into Miro gives participants nothing to do — the act of creating and placing stickies is the cognitive work. Remote facilitators should require participants to type their own stickies (Baas-Schwegler, 2024).

## E-commerce Checkout — Worked Example

This example walks through a Design-Level Event Storming slice for an online checkout flow. It illustrates how all eight sticky note element types interact in practice.

**The domain event timeline** (orange stickies, left to right):

1. *Item Added To Cart* — triggered by the **Customer** actor issuing the *Add Item To Cart* command against the **Cart** aggregate.
2. *Cart Reviewed* — triggered by the **Customer** viewing the *Cart Summary* read model (green) and issuing *Review Cart*.
3. *Checkout Started* — **Customer** issues *Start Checkout*, receiving a *Checkout Form* read model showing address and payment fields.
4. *Address Validated* — the *Validate Address* command is routed to an **Address Validation Service** external system (large yellow), which returns a confirmation event.
5. *Payment Authorized* — the *Authorize Payment* command is sent to **Stripe** (external system, large yellow). Stripe responds asynchronously; the event fires when Stripe's callback arrives.
6. *Order Placed* — **Policy**: "Whenever Payment Authorized → Place Order." This policy (purple sticky) fires automatically, issuing *Place Order* to the **Order** aggregate. No human actor is involved. This is the pivotal event separating the Sales bounded context from the Fulfillment bounded context.
7. *Inventory Reserved* — **Policy**: "Whenever Order Placed → Reserve Inventory." The **Inventory** aggregate receives *Reserve Inventory* and emits *Inventory Reserved* or, on failure, *Inventory Reservation Failed*.
8. *Shipment Requested* — **Policy**: "Whenever Inventory Reserved → Request Shipment." The *Request Shipment* command goes to the **Shipping Carrier API** external system (large yellow).

**Hotspot captured during the session** (pink sticky, placed between *Inventory Reserved* and *Shipment Requested*): "How do we handle partial inventory availability? Cancel the whole order or split into multiple shipments?" This hotspot was unresolved during the workshop and became a design spike in the next sprint.

**Read models identified**:
- *Cart Summary* (green): item list, quantities, subtotals, applied discount codes. Consulted by the Customer before Checkout Started.
- *Order Confirmation* (green): order ID, items, estimated delivery date. Displayed after Order Placed.
- *Inventory Availability* (green): current stock level per SKU. Consulted by the Inventory aggregate policy before committing a reservation.

**Aggregates identified** (white stickies at Design Level): **Cart** (receives Add Item To Cart, Remove Item From Cart; emits Item Added To Cart, Item Removed From Cart), **Order** (receives Place Order; emits Order Placed, Order Cancelled), **Inventory Item** (receives Reserve Inventory; emits Inventory Reserved, Inventory Reservation Failed).

**Outcome**: From this Design-Level slice, the Cart and Order aggregates were identified as belonging to separate bounded contexts (Cart lives in the Sales context; Order is the published language event consumed by Fulfillment). The "Payment Authorized → Order Placed" policy became the `OrderPlacementSaga` in code: a saga that listens to `PaymentAuthorizedEvent`, calls the Order service to place the order, and handles compensation (order cancellation + refund initiation) if the Order aggregate rejects the command.

This worked example demonstrates how Event Storming compresses discovery that would otherwise require weeks of requirements gathering into a single half-day session — provided the right people are in the room with pens and paper (Brandolini, eventstorming.com).

## Sources

- Brandolini, Alberto. *Introducing EventStorming*. Leanpub, 2013–ongoing. https://leanpub.com/introducing_eventstorming — the canonical reference; covers Big Picture, Process Level, Design Level, all sticky note elements, facilitation guidance, and anti-patterns.
- Brandolini, Alberto. *eventstorming.com*. Official site with the canonical color legend, three-levels description, and facilitation resources.
- Brandolini, Alberto. "EventStorming: How and Why." DDD Europe 2018 talk. Available at dddeurope.com — covers the workshop rationale, remote adaptations, and the unlimited modeling space principle.
- Fowler, Martin. "EventStorming." martinfowler.com/bliki/EventStorming.html, 17 May 2017. Accessible introduction to Big Picture and Process Level for the broader software engineering audience.
- DDD Europe Conference Talks 2015–2024. dddeurope.com — annual archive of talks from Brandolini, Verraes, Baas-Schwegler, Tune, and other ES practitioners.
- Verraes, Mathias. Blog posts on Domain Events and ES facilitation, including "The Grammar of Domain Events." verraes.net, 2014–2023.
- Baas-Schwegler, Kenny; van Kelle, Evelyn; Verschatse, Gien. *Collaborative Software Design*. Manning, 2024. Covers remote and hybrid Event Storming facilitation and collaborative modeling patterns.
- Tune, Nick. Articles on using ES output with the Bounded Context Canvas. medium.com/nick-tune-tech-strategy-blog, 2018–2024.
