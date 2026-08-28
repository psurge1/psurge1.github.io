# Portfolio Implementation Steps

## Stage 1: Frontend foundation

- Scaffold the React + TypeScript + Vite application
- Set up the project structure and shared styles
- Configure the static GitHub Pages build and deployment workflow
- Add placeholder data for all portfolio content

## Stage 2: Visual foundation

- Define the manilla-paper background and color palette
- Choose typography, spacing, borders, and connector line styles
- Create the base page shell and desktop layout
- Establish the UML-inspired visual language

## Stage 3: Diagram structure

- Build the central profile node
- Add Education, Experience, Projects, Now, Resume, and Skills nodes
- Add the footer with contact and social links
- Render relationships with an SVG edge layer
- Establish a clear semantic DOM order

## Stage 4: Content interactions

- Add hover and keyboard focus states
- Highlight connected nodes and edges
- Add expandable details or a detail panel

## Stage 5: Animation and frontend polish

- Add subtle drift and hover emphasis
- Add initial diagram assembly animation
- Add connector draw and scroll reveal effects
- Implement animations with CSS, SVG, or Web Animations
- Add `prefers-reduced-motion` support
- Verify smooth 60 FPS performance on lower-end hardware
- Test keyboard navigation and desktop usability

## Stage 6: Supabase basic schema

- Create the Supabase project
- Define a UML content table based on `UmlBoxData`
- Define a social links table for the footer
- Add the common UML fields as columns
- Store preview sections, actions, and popup details as flexible JSON data
- Configure public read access and Row Level Security

## Stage 7: Runtime content integration

- Add the Supabase client to the frontend
- Replace placeholder content with runtime Supabase API calls
- Add loading, empty, and error states
- Keep the diagram layout independent from database response formats

## Stage 8: Specialized backend integrations

- Add résumé or image storage only if needed
- Add specialized tables for education classes, experience, skills, or current work if needed
- Add relationships and richer popup-specific data only when the MVP requires them

## Stage 9: GitHub project integration

- Store the selected repository allowlist in Supabase
- Fetch public GitHub repository metadata client-side at runtime
- Merge GitHub metadata with Supabase project descriptions and display settings
- Render live repository updates without rebuilding the site
- Add handling for missing repositories, rate limits, and API errors

## Stage 10: Final verification

- Confirm the production build works on GitHub Pages
- Verify Supabase and GitHub requests in the deployed site
- Check accessibility, focus states, and reduced-motion behavior
- Re-test animation performance with all nodes and relationships visible
- Remove unused placeholder data and defer non-MVP features such as the blog
