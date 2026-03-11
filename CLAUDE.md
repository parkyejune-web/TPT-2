# CLAUDE.md

This file provides guidance for AI assistants (Claude and others) working in this repository.

## Repository Status

This is a fresh repository. No source files have been committed yet. This CLAUDE.md serves as the foundational conventions document — update it as the project grows.

## Git Workflow

### Branch Naming

- Feature branches: `feature/<short-description>`
- Bug fixes: `fix/<short-description>`
- AI-assisted branches: `claude/<task-id>-<description>`

### Commits

- Write clear, imperative commit messages (e.g., "Add user authentication", not "Added auth")
- Keep commits atomic — one logical change per commit
- Never commit secrets, `.env` files, or credentials

### Push Protocol

Always use:
```bash
git push -u origin <branch-name>
```

Retry on network failure with exponential backoff (2s, 4s, 8s, 16s).

## Development Conventions

### General

- Prefer editing existing files over creating new ones
- Avoid over-engineering — implement only what is needed
- Do not add comments unless the logic is non-obvious
- Remove unused code rather than commenting it out

### Security

- Never introduce SQL injection, XSS, command injection, or other OWASP Top 10 vulnerabilities
- Validate input only at system boundaries (user input, external APIs)
- Do not hardcode credentials or tokens

### Testing

- Write tests for new functionality when a test suite exists
- Run existing tests before committing to confirm nothing is broken
- Do not mark a task complete if tests are failing

## AI Assistant Instructions

When this repository gains source code, update the sections below with specifics.

### Adding New Sections

As the project is built out, document:

1. **Tech Stack** — languages, frameworks, major libraries
2. **Directory Structure** — purpose of each top-level directory
3. **Build & Run** — commands to install dependencies, start dev server, build for production
4. **Testing** — how to run the test suite, where tests live
5. **Linting & Formatting** — tools used and how to run them
6. **Environment Variables** — required variables and where to set them (never the values)
7. **Database** — ORM, migrations, how to seed data
8. **API** — base URL pattern, authentication scheme, key endpoints
9. **Deployment** — CI/CD pipeline, environments (dev/staging/prod)

### Current Unknowns

- [ ] Technology stack not yet chosen
- [ ] Directory structure not yet established
- [ ] No build, test, or lint scripts defined
- [ ] No environment variables documented
- [ ] No deployment pipeline configured

Update this checklist as decisions are made and files are added.
