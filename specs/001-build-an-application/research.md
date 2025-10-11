# Research: Climbing Progress Tracker Application

## Unknowns & Clarifications

### Authentication Method

- **Unknown**: Auth method for login/logout (email/password, SSO, OAuth?)
- **Decision**: Use email/password authentication with optional OAuth (Google, Apple) for broader device compatibility and user convenience.
- **Rationale**: Email/password is standard and easy to implement; OAuth provides secure, cross-platform login and is common in mobile apps.
- **Alternatives considered**: SSO (not needed for most users), phone-based login (less common for climbing apps).

### Import/Export Formats

- **Unknown**: Supported formats for user data import/export
- **Decision**: Support CSV and JSON formats for import/export.
- **Rationale**: CSV is widely supported and easy to use; JSON allows for richer data and compatibility with other platforms.
- **Alternatives considered**: XML (less common), direct API sync (future enhancement).

### Error Handling Behaviors

- **Unknown**: How errors are surfaced to users
- **Decision**: Use modal dialogs and toast notifications for error feedback; log errors for debugging.
- **Rationale**: Modals and toasts are standard in mobile UX; logging aids troubleshooting and support.
- **Alternatives considered**: Silent failures (bad UX), only logging (not user-friendly).

### Performance Goals

- **Unknown**: Specific performance targets
- **Decision**: Target 60 FPS for UI, <200ms p95 for user actions, offline-capable for session logging.
- **Rationale**: Ensures smooth experience on mobile and desktop; offline logging is critical for gym environments.
- **Alternatives considered**: Lower FPS (unacceptable), online-only (limits usability).

### Constraints

- **Unknown**: Memory, offline, device compatibility
- **Decision**: <100MB memory usage, offline support, compatible with iOS/Android and web (via Expo).
- **Rationale**: Mobile devices have limited resources; Expo enables cross-platform support.
- **Alternatives considered**: Native-only (less maintainable), web-only (limits mobile reach).

### Scale/Scope

- **Unknown**: User and screen targets
- **Decision**: Designed for up to 10k users, 20-30 screens/features.
- **Rationale**: Typical for niche fitness apps; scalable for future growth.
- **Alternatives considered**: Enterprise scale (not needed), minimal screens (limits UX).

### Testing

- **Unknown**: Testing frameworks and approach
- **Decision**: Use Jest and React Native Testing Library for unit/integration tests; E2E with Detox.
- **Rationale**: These are standard for Expo/React Native projects.
- **Alternatives considered**: Mocha/Chai (less common), manual testing (not sufficient).

### Storage

- **Unknown**: Data storage solution
- **Decision**: Use SQLite (wa-sqlite) for local storage; cloud sync via API (future enhancement).
- **Rationale**: SQLite is reliable and supported in Expo; cloud sync can be added later.
- **Alternatives considered**: AsyncStorage (less robust), direct cloud-only (limits offline).

---

## Best Practices

- Modular code structure (feature-based folders)
- TypeScript for type safety
- Clean code, DRY principles
- Responsive UI with Expo and React Native
- Use shadcn/ui for consistent components
- Tailwind CSS for styling
- TDD: Write tests before implementation
- Document all major features in /docs

---

## Integration Patterns

- Integrate new features with existing models/components
- Use Context API or Zustand for global state
- API contracts for future cloud sync
- Data import/export via CSV/JSON

---

## Summary

All major unknowns and clarifications have been resolved. The project will use Expo, React Native, TypeScript, SQLite, Jest, and Detox, with a modular, test-driven approach and cross-platform compatibility.
