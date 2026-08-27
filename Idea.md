# Portfolio Website Concept

## Core Idea

Build a **minimal, one-page portfolio as a large UML/system diagram**. The diagram represents me and my work as a connected system rather than using conventional portfolio cards/sections.

It should feel technical and unique, but **not like a literal draw.io UML export**. Use UML/system-diagram visual language with modern typography, thin lines, lots of whitespace, and restrained interaction.

## Information to Show

- **Name / identity** — central/root element
- **Education**
- **Work experience**
- **Projects** — selected repositories populated from GitHub
- **Currently working on** — active projects, learning, experiments, etc.
- **Resume**
- **Contact/socials** — email, GitHub, LinkedIn, Twitter/X, etc.
- **Skills/technologies**

## Diagram Structure

The name/profile is the root, branching into the major areas:

                         [ Resume ]

[ Education ]    [ YOUR NAME ]    [ Experience ]
                       |
                [ Projects ]
                       |
                   [ Now ]

                 [ Contact ]

This is conceptual. The final composition should be visually balanced rather than rigidly symmetric.

### Skills

Avoid a generic standalone skills list where possible. Instead, connect technologies to the experiences/projects where they were actually used.

              [ Go ]
                |
[ Redis ] -- [ Chess Platform ] -- [ gRPC ]
                |
          [ PostgreSQL ]

Hovering a technology such as `Go` could highlight the projects/experiences connected to it.

### Projects

Selected repositories should be configurable and populated from GitHub. Potential metadata:

- Project/repository name
- Description
- Primary technologies
- GitHub link
- Relevant repository metadata where appropriate

### Currently Working On

Give active work a subtle UML-inspired treatment:

    <<active>>
    Distributed Training

    status: in progress
    focus: collective communication
    stack: Go, C++, CUDA, gRPC

An active item may have a small, slowly breathing status indicator.

## Visual Direction

- Minimal with significant negative space
- UML/system-architecture inspiration
- Thin connector lines
- Lightweight borders
- Strong typography
- Mostly neutral palette with one accent color
- Avoid excessive cards, gradients, rounded UI, or decorative clutter
- The diagram itself should be the site's primary visual identity

## Animation / Interaction

1. **Initial assembly**
   - Central profile appears
   - Connector lines draw outward
   - Connected nodes fade in with a small stagger
   - Keep total intro short (~600–900 ms)

2. **Subtle idle motion**
   - Some elements drift only ~2–4 px over several seconds
   - No force-directed graph physics

3. **Hover highlighting**
   - Slightly emphasize hovered node
   - Move it ~2 px
   - Highlight connected edges/nodes
   - Optionally dim unrelated content

4. **Scroll reveal**
   - `opacity: 0 -> 1`
   - `translateY: ~8px -> 0`
   - Incoming connector can draw from parent to child

5. **Active status**
   - `Now` items may have a small status dot with a slow breathing/opacity animation

### Motion Language

Keep animation vocabulary consistent:

**draw -> fade -> drift -> highlight**

Avoid:

- Bouncing nodes
- Spring/force physics
- Particle effects
- Constantly pulsing connector lines
- Typing animations
- Animated gradients
- Excessive motion

## UX Principle

The graph should be **useful, not just decorative**. Relationships should communicate information—for example, which technologies were used in which projects or jobs.

Despite the unusual presentation, a recruiter should be able to immediately find:

**Who I am -> Education -> Experience -> Projects -> Current work -> Resume/Contact**

Prioritize readability and fast navigation over strict adherence to UML notation.

## Goal for Refinement

Refine this concept into a concrete implementation plan, especially:

- Overall diagram layout and information hierarchy
- How the diagram adapts to different screen sizes
- How nodes/edges should be represented
- How detailed information appears without cluttering the diagram
- GitHub integration for selected projects
- Animation implementation
- Component architecture
- Accessibility and `prefers-reduced-motion`
- How to keep the design visually unique while remaining extremely simple
