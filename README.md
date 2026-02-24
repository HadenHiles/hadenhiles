# Design from the User Down. Build the System to Match

[![Haden](./public/logo/logo_color.png)](https://www.hadenhiles.com)

I build software the way I want software to feel as a user: simple, fast, intuitive, and reliable.

I’m a Principal Software and DevOps Engineer at How To Hockey. I work across the entire stack, from interface design to backend architecture to deployment pipelines. But my default lens is UX. Every feature starts with the same mental model:

> As a user, what would I expect right here?

Clean flows. Thoughtful layout. Clear hierarchy. Stable infrastructure underneath it all.

I care about building things that work consistently in production, not just in demos.

---

## 🏒🎬 When I'm Not Coding

I’m usually on the ice, testing gear, trying weird hockey challenges, or building something just because I want to understand how it works.

On my [YouTube channel](https://www.youtube.com/@HadenHiles), I document experiments that mix hockey, tech, and curiosity. Sometimes it is performance testing. Sometimes it is app building. Sometimes it is just seeing what happens.

The common thread is the same as my engineering work: experiment, measure, improve.

---

## 🚀 Featured Projects

Below are projects where I owned both the user experience and the system behind it.

---

### 🥅 [TenThousandShotChallenge](https://github.com/HadenHiles/TenThousandShotChallenge)  

*Flutter, Dart, Firebase*  
620 commits

A cross-platform mobile app built to support the 10,000 Shot Challenge community.

Players can log sessions, track cumulative progress, and visualize improvement over time. Authentication supports Google and Apple sign-in. Data is structured around session-based tracking to keep logging simple and scalable.

UX focus: open the app, log shots in seconds, see progress clearly, leave. No friction.

---

### 🎓 [The Pond](https://github.com/HadenHiles/ThePond)  

*PHP, WordPress, JavaScript, CSS*  
434 commits

A structured subscription platform for hockey training.

Built with WordPress, LearnDash, and MemberPress. Integrated payments, gated courses, dashboards, and content progression. Designed for clarity on the user side and low operational overhead on the admin side.

UX focus: players should always know what to do next. Admin workflows should not require technical gymnastics.

---

### 🗺️ [The Group of Seven Trail App](https://github.com/HadenHiles/G7TrailApp)  

*Flutter, Dart, C++*  
362 commits

An interactive hiking companion app for the Lake Superior Group of Seven Trail.

Includes interactive maps, bluetooth beacon integration, and contextual trail information triggered by location. Built for real-world use while moving through the trail.

UX focus: relevant information should appear at the right time without digging through menus.

---

### 📊 [NextShift](https://github.com/HadenHiles/NextShift)  

*Flutter, Dart, Firebase*  
53 commits

A community-driven feedback and voting platform for the How To Hockey ecosystem.

Users can submit ideas, vote on features, and provide structured input that informs roadmap decisions. Real-time updates powered by Firebase.

UX focus: submitting an idea should take under 20 seconds. Feedback should feel visible and meaningful.

---

### 🧠 [Skill Drills](https://github.com/HadenHiles/skill-drills)  

*Flutter, Dart, C++*  
37 commits

A customizable skill tracking application.

Users can define routines, set flexible performance metrics, and log sessions across different training styles. Built to balance freedom and structure.

UX focus: flexible without becoming confusing.

---

### 🎬 [VideoScraper](https://github.com/HadenHiles/VideoScraper)  

*React, TypeScript, Node.js, Express*  
19 commits

A modern web application that processes video URLs through a Node.js proxy backend.

Built with a Vite + React frontend and Express backend to handle CORS and request routing cleanly.

UX focus: paste a link, click once, get a file.

---

## 🔧 Systems and Infrastructure Work

Not everything I build has a UI.

- CI and CD pipelines for safer deployments  
- Containerized environments for consistency  
- Reverse proxy and networking configuration  
- Secure remote access and documentation such as HTH-Twingate-Setup  
- Scrapers and APIs for data aggregation  

Reliability is part of user experience. If the system fails, the interface does not matter.

---

## 🧠 How I Think

- UX first. Start with “as a user I…”  
- Simple beats clever.  
- Reliability is a feature.  
- Remove friction before adding features.  
- Resist the urge to optimize something that should not exist.  

---

*If you'd like to work together, reach out at [business@hadenhiles.com](mailto:business@hadenhiles.com).*

---
---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
