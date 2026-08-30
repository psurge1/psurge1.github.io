# Personal Portfolio Website - Refined Plan

## 1. Product direction

Build a minimal, one-page portfolio presented as a UML-inspired system diagram. The diagram should communicate how the different parts of your background connect rather than presenting unrelated sections or conventional project cards.

The visual language should be technical and distinctive without looking like a literal draw.io export:

- Thin connector lines
- Lightweight borders
- Strong typography
- Generous negative space
- Mostly neutral colors with one accent color
- Warm manilla-paper background as the primary surface
- Minimal rounded corners, gradients, and decorative elements
- No 3D models, Three.js, particle effects, or force-directed graph physics

The diagram is the primary visual identity of the site. Content remains readable and navigation remains obvious to recruiters and other first-time visitors.

### Manilla-paper visual system

- Use a warm, flat manilla tone for the page background rather than a paper photograph or heavy texture
- Use charcoal or dark brown typography and line work for an ink-on-paper feel
- Use one restrained accent color for active nodes, selected relationships, and status indicators
- If texture is added, keep it static, extremely subtle, and implemented as a lightweight CSS or SVG asset
- Keep the background visually quiet so the UML relationships remain the focus

## 2. Information hierarchy

The one-page experience should follow this conceptual hierarchy:

```text
                         [ Resume ]

[ Education ]     [ YOUR NAME / PROFILE ]     [ Experience ]
                         |
                      [ Projects ]
                         |
                         [ Now ]

                       [ Footer ]
                 Contact and social links
```

This is a visual starting point rather than a rigid layout. The final positions should be balanced around the viewport and should adapt to the amount of content returned by Supabase.

### Root profile node

The central node is the entry point to the site and should contain:

- Name
- Professional title or short tagline
- Brief introduction
- Primary navigation or jump links
- Optional profile image

The profile node replaces a conventional hero section.

### Education node

Show relevant education entries with:

- Institution
- Degree or program
- Dates
- Field of study
- Optional short description

### Experience node

Show work history as connected entries rather than an isolated timeline:

- Role
- Company
- Dates
- Short accomplishment-focused highlights
- Technologies used

### Projects node

Show selected repositories whose presentation configuration comes from Supabase and whose repository metadata is fetched from GitHub at runtime. Each project should expose:

- Repository/project name
- Description
- Primary technologies
- GitHub URL
- Live demo URL, when available
- Relevant repository metadata, such as language or last update
- A short explanation of your contribution

### Now node

Show current work, learning, and experiments using an active UML-inspired element:

```text
<<active>>
Distributed Training

status: in progress
focus: collective communication
stack: Go, C++, CUDA, gRPC
```

An active item can have a small status indicator with a slow, subtle breathing animation.

### Resume node

The Resume node should provide a clear link to a PDF or hosted résumé. It can be connected directly to the root profile node and remain visually easy to find.

### Footer node

Contact is not a separate page or primary diagram branch. The footer should act as the final node in the system and contain:

- Email
- LinkedIn
- GitHub
- Twitter/X
- Optional résumé link
- Copyright or small site metadata

## 3. Diagram and relationship model

### Nodes

Use semantic HTML elements for nodes so that the content remains accessible and selectable. A node may be rendered as a bordered panel, UML-style class box, labeled system component, or lightweight text block.

Each node should have:

- A stable identifier
- A type, such as `profile`, `project`, `experience`, or `technology`
- A visible title
- Optional metadata
- Relationships to other nodes

Avoid placing every detail directly on the diagram. Show summaries in the main composition and reveal additional information through a detail panel, expandable node, or dialog.

### Edges

Represent relationships with thin SVG lines behind the semantic HTML nodes. Example relationships include:

- Profile → Experience
- Profile → Education
- Profile → Projects
- Experience → Technologies
- Project → Technologies
- Project → Related experience
- Projects → Now

Edges must communicate real information. They should not be added merely as decoration.

### Technology relationships

Avoid a generic standalone skills list. Technologies should be connected to the projects or experiences where they were actually used.

```text
                       [ Go ]
                          |
[ Redis ] - [ Chess Platform ] - [ gRPC ]
                          |
                    [ PostgreSQL ]
```

When a visitor hovers, focuses, or selects a technology, highlight its connected projects and experiences while dimming unrelated relationships. The same interaction should work with keyboard focus and mouse input on desktop.

## 4. Desktop composition

- Use a CSS grid or carefully controlled desktop positioning for the primary diagram
- Render connector lines in an SVG layer behind the nodes
- Keep the profile node near the visual center
- Place major branches around it with enough space for edges and labels
- Keep the diagram within a readable maximum width and desktop viewport composition
- Use a predictable DOM order following Profile → Education → Experience → Projects → Now → Resume → Footer
- Treat the diagram as a curated composition rather than a freely zoomable or pannable canvas
- Use desktop hover, click, and keyboard interactions for the first release

Tablet and mobile layouts are intentionally out of scope for this phase.

## 5. Detailed content interaction

The initial diagram should stay visually quiet. Selecting a node can open a detail panel or dialog containing the full content.

Recommended behavior:

- Hover: emphasize the node and related edges
- Focus: use the same emphasis as hover with a visible focus ring
- Click: open or expand details
- Escape: close an open detail panel or dialog
- External links: clearly indicate GitHub, live demo, résumé, and social destinations

The detail view should preserve the diagram context and avoid navigating to separate project pages in the MVP.

## 6. Animation and motion language

Use a consistent vocabulary:

```text
draw → fade → drift → highlight
```

### Initial assembly

- Reveal the central profile first
- Draw connector lines outward from the profile
- Fade in connected nodes with a small stagger
- Keep the complete introduction between approximately 600 and 900 milliseconds

### Scroll or viewport reveal

- Fade from `opacity: 0` to `opacity: 1`
- Translate approximately 8px upward into place
- Optionally draw the incoming connector from parent to child

### Idle motion

- Drift selected elements by only 2–4px
- Use long durations of several seconds
- Offset animation timing so elements do not move in sync
- Keep most elements still

### Hover and selection

- Slightly increase text weight or contrast
- Move the active node approximately 2px
- Highlight connected nodes and edges
- Optionally dim unrelated content

### Active status

- Give `Now` items a small breathing status dot
- Animate opacity or scale subtly rather than pulsing the entire node

Avoid bouncing nodes, spring physics, constant connector pulsing, typing animations, animated gradients, and excessive motion.

Respect `prefers-reduced-motion` by disabling drift, line-drawing animation, staggered transitions, and nonessential movement while preserving clear visual state changes.

### Animation implementation and performance

- Use CSS animations and transitions for drift, emphasis, opacity, and text-weight changes
- Use SVG stroke animations for connector drawing and edge highlighting
- Use the Web Animations API only for interactions that cannot be expressed cleanly in CSS
- Keep continuous animation outside React render loops; React should manage interaction state and content, not per-frame visual updates
- Animate compositor-friendly properties such as `transform` and `opacity`
- Avoid layout-triggering animation of width, height, top, left, margins, or font metrics
- Do not animate every node continuously; reserve drift for a small number of intentionally selected elements
- Avoid excessive `will-change`, large filters, and expensive blur effects
- Target smooth 60 FPS performance on lower-end hardware
- Test with browser performance tools while the full diagram, SVG edges, and active states are visible

## 7. Frontend and backend architecture

### Frontend

Required stack:

- React + TypeScript + Vite, compiled as a fully static site
- CSS Modules, plain CSS, or another lightweight styling approach
- Semantic HTML for nodes and interactive controls
- SVG for connector edges
- GitHub Pages for hosting
- GitHub Actions for build and deployment

The generated frontend must work without a server runtime. GitHub Pages hosts only the built static assets; React manages interaction state and content rendering in the browser.

### Supabase backend

Supabase should be the primary content API for the site:

- Postgres stores published portfolio content, relationships, and the selected GitHub repository allowlist
- The Supabase client exposes published content to the static frontend at runtime
- Edge Functions remain available for future secure or scheduled workflows, but are not required for client-side GitHub metadata in the MVP
- Storage can hold résumé files or images when needed
- Row Level Security allows public reads of published records while protecting private or draft data

Most visible content should be loaded through API calls to Supabase rather than hardcoded into the frontend. The frontend should include loading, empty, and error states so the diagram remains understandable if a request fails.

At runtime, the frontend should request profile, education, experience, current-work, technology, social, résumé, and project configuration data from Supabase. GitHub repository metadata is then fetched directly by the browser using the selected repository configuration.

### Suggested data model

```text
profiles
├── id
├── name
├── title
├── bio
└── profile_image_url

education
├── id
├── institution
├── degree
├── field
├── start_date
├── end_date
└── description

experiences
├── id
├── company
├── role
├── start_date
├── end_date
├── description
└── published

projects
├── id
├── name
├── summary
├── contribution
├── github_repo
├── live_url
├── featured
├── display_order
└── published

technologies
├── id
├── name
└── category

project_technologies
├── project_id
└── technology_id

experience_technologies
├── experience_id
└── technology_id

current_items
├── id
├── title
├── status
├── focus
├── stack
├── display_order
└── published

social_links
├── id
├── platform
├── label
├── url
└── display_order
```

The exact schema can be simplified for the first implementation, but relationships should be modeled explicitly so technology highlighting is based on real associations.

## 8. GitHub integration

Selected repositories should be configurable rather than displaying every public repository.

Recommended runtime flow:

```text
Frontend loads selected repository configuration from Supabase
              ↓
Browser queries GitHub's public API at runtime
              ↓
Frontend merges GitHub metadata with portfolio-specific fields
              ↓
Project nodes render in the diagram
```

The frontend should:

1. Read the selected repository allowlist and presentation fields from Supabase.
2. Query GitHub's public repository endpoint for each selected repository when the site loads.
3. Merge GitHub metadata with portfolio-specific fields such as contribution, display order, featured status, and live URL.
4. Render the normalized project data in the diagram and detail panel.
5. Handle loading, missing repositories, API errors, and rate limits without breaking the rest of the portfolio.

No GitHub credential should be required in the static frontend for public repository metadata. Because the browser queries GitHub at runtime, repository updates appear without rebuilding or redeploying the site. A lightweight browser cache may be used to reduce repeated requests, but it must not prevent fresh data from being retrieved on later visits.

Supabase Edge Functions can be introduced later if private GitHub data, higher API limits, server-side caching, or scheduled synchronization becomes necessary.

## 9. Component architecture

Keep the component structure small and focused:

```text
App
├── PortfolioShell
│   ├── DiagramCanvas
│   │   ├── EdgeLayer
│   │   ├── ProfileNode
│   │   ├── EducationNode
│   │   ├── ExperienceNode
│   │   ├── ProjectsNode
│   │   ├── NowNode
│   │   └── ResumeNode
│   ├── DetailPanel / DetailDialog
│   ├── LoadingState
│   ├── ErrorState
│   └── FooterContact
└── AccessibilityControls
```

Suggested data responsibilities:

- `usePortfolioData`: loads published content from Supabase
- `useGitHubProjects`: fetches selected repository metadata from GitHub at runtime and combines it with Supabase project configuration
- `useDiagramInteractions`: manages selected nodes, highlighted relationships, and detail views
- `useReducedMotion`: detects the user's motion preference

The diagram renderer should consume a normalized collection of nodes and edges. This keeps layout and interaction logic separate from Supabase and GitHub response formats.

## 10. Accessibility and usability

- Use semantic headings and landmarks even though the visual design is diagrammatic
- Make every interactive node keyboard accessible
- Provide visible focus indicators
- Use buttons for expandable nodes and links for navigation
- Give SVG edges an accessible or decorative role as appropriate
- Provide text alternatives for relationship highlights
- Ensure contrast for thin lines, borders, and muted text
- Do not rely on color alone to show active or selected states
- Keep all important content available in the DOM and readable by screen readers
- Support `prefers-reduced-motion`
- Provide a simple linear reading order in the DOM and for assistive technology

The unusual diagram should enhance discovery, not become a barrier to understanding who you are, what you have done, and how to contact you.

## 11. MVP scope

### Include

- One-page UML-inspired portfolio diagram
- Profile/name node
- Education node
- Experience node
- Selected GitHub-powered project nodes
- Current work / `Now` node
- Technology relationships connected to projects and experience
- Resume node
- Footer containing email, LinkedIn, GitHub, and Twitter/X
- Supabase API-driven content
- Client-side runtime GitHub metadata retrieval
- Desktop-first layout; tablet and mobile support are deferred
- Initial assembly, subtle drift, hover/focus highlighting, and scroll reveal
- CSS/SVG/Web Animations with a 60 FPS performance target
- Detail panel or expandable node behavior
- Keyboard accessibility and reduced-motion support
- Static deployment through GitHub Pages

### Defer

- Blog section
- Tablet and mobile layouts
- Individual project case-study routes
- Full content-management dashboard
- Supabase-backed contact form
- Authentication
- GitHub activity graph
- Advanced filtering and search
- Analytics and download tracking
- Dark/light theme customization

## 12. Implementation sequence

1. Define the visual tokens: manilla background, typography, line weights, spacing, neutral ink color, and accent color.
2. Create the semantic desktop diagram with placeholder content.
3. Add SVG edge rendering and carefully controlled desktop layout rules.
4. Add node focus, selection, detail panels, and technology highlighting.
5. Create Supabase tables, published-content policies, and normalized API responses.
6. Add the selected-repository configuration and client-side GitHub API integration.
7. Replace placeholders with Supabase runtime API calls and loading/error states.
8. Add CSS/SVG/Web Animations, reduced-motion behavior, and performance safeguards.
9. Verify keyboard navigation, screen-reader order, 60 FPS interaction performance, and GitHub Pages deployment.
