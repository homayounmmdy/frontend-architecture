# Frontend Architecture: Monoliths to Microfrontends

<img width="1528" height="779" alt="Screenshot 2026-09-04 144245" src="https://github.com/user-attachments/assets/4c8ac2c9-cec4-4b67-92aa-7e3241e5aa7b" />


This repository documents my learnings from **Frontend Architecture: Monoliths to Microfrontends** on Frontend Masters, taught by **Maxi Ferreira** (Staff Software Engineer).

📅 **Course Timeline**

- Started: August 21, 2026
- Completed: September 4, 2026

## About the Course

A comprehensive guide to mastering software architecture and managing complexity in modern web development. This course explores practical strategies for scaling frontend applications, taking you on a journey from a single monolithic codebase to a robust microfrontend architecture. 

It emphasizes making informed architectural decisions based on business goals, quality attributes, and constraints. Rather than just theorizing, the course provides hands-on exercises to enforce code boundaries, optimize build processes, and ensure scalable, maintainable, and efficient frontend systems.

Key topics include:

- 🏛️ **Architecture Fundamentals**: Understanding the four pillars of software architecture (style, characteristics, decisions, logical components) and using the C4 model for visualizing system context.
- 🧱 **Monoliths & Modularization**: Tackling boundary issues to avoid a "big ball of mud," applying Domain-Driven Design (DDD) subdomains, and enforcing modular monolith structures using ESLint boundary rules and Dependency Cruiser.
- 📦 **Monorepos Architecture**: Transitioning from a monolith to a monorepo, managing workspaces, and leveraging Turborepo for caching, task orchestration, and visualizing dependency graphs.
- 🧩 **Micro Frontends Overview**: Evaluating the trade-offs of micro frontends, exploring isolation techniques (iframes, web components), and understanding when to adopt this pattern for independent team deployments.
- 🔗 **Module Federation**: Deep dive into Module Federation (including 2.0 enhancements) for runtime code sharing, configuring host/remote applications, asynchronous loading with `React.lazy` and `Suspense`, and robust error handling.
- 🔄 **State & Communication**: Decoupling micro frontend state using Nanostores, managing cross-application communication via `postMessage` or props, and avoiding tight coupling between independent apps.
- 🗺️ **Version Management & Service Discovery**: Implementing frontend service discovery patterns, utilizing `MFManifest.json` for standardizing micro frontend usage, and handling multiple dependency versions in distributed architectures.

Throughout the course, I worked through a practical e-commerce project, systematically refactoring it from a monolith to a modular monorepo, and finally splitting it into micro frontends while enforcing strict architectural boundaries.

## 🚀 Why I Took This Course

I took this course to sharpen my frontend architecture skills and gain a deeper, practical understanding of how to structure and scale complex applications. I wanted to move beyond basic component design and learn how to evaluate architectural trade-offs, enforce clean code boundaries, and confidently implement patterns like modular monoliths, monorepos, and micro frontends to build maintainable, enterprise-grade systems.

## 📢 Access Note

Due to regional restrictions in Iran, I accessed this course through alternative means. While I don't have an official certificate, I completed the lessons, followed the demonstrations, and documented my implementations and takeaways in this repository.
