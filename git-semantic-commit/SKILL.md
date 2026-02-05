---
name: git-semantic-commit
description: Make semantic git commits following Conventional Commits standard. Use when committing code changes to ensure commit messages are clear, standardized, and enable automatic changelog generation and version bumping. Essential for maintaining clean git history and safe revert points.
---

# Semantic Git Commits Skill

## Overview

This skill ensures all commits follow the [Conventional Commits](https://www.conventionalcommits.org/) standard, making git history clean, readable, and machine-parseable.

## Commit Message Format

Every commit must follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (required)

- **feat** - A new feature
- **fix** - A bug fix
- **refactor** - Code change that neither fixes nor adds a feature
- **style** - Code style changes (formatting, semicolons, etc.)
- **docs** - Documentation changes
- **test** - Adding or updating tests
- **chore** - Build process, dependency updates, tooling changes
- **perf** - Performance improvements
- **ci** - CI/CD configuration changes

### Scope (optional but recommended)

Specify what part of the codebase is affected:
- `frontend`, `backend`, `database`, `api`, `config`, etc.
- Be specific: `SearchBar` instead of just `frontend`

### Subject (required)

- Use imperative mood: "add feature" not "added feature"
- Don't capitalize first letter
- No period at the end
- Max 50 characters
- Be concise and descriptive

### Body (optional but recommended for commits that aren't trivial)

- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

### Footer (optional)

```
Closes #123
Breaking-Change: describe what breaks
```

## Workflow

### Before Committing

1. **Stage changes**: `git add <files>`
2. **Review diff**: `git diff --cached` to verify what's being committed
3. **Craft the message** using the format above

### Commit Command

```bash
git commit -m "type(scope): subject" -m "body" -m "footer"
```

Or for multi-line messages:

```bash
git commit  # Opens editor
```

### Quick Reference Examples

**Feature commit:**
```
feat(SearchBar): add fuzzy search with Fuse.js

- Implement SearchBar component with real-time filtering
- Create searchEngine service for project/file indexing
- Add keyboard navigation (arrows, enter, escape)
- Support typo-tolerant matching

Closes #42
```

**Bug fix:**
```
fix(api): handle null responses from LLM service

The backend was not properly catching null responses from the LLM,
causing 500 errors. Now validates response before processing.
```

**Simple refactor:**
```
refactor(frontend): extract ChatWindow logic into separate hooks
```

**Documentation:**
```
docs(README): add fuzzy search feature to installation guide
```

## Safe Commit Practices

1. **Commit frequently** - Small, logical changes are easier to review and revert
2. **One concern per commit** - If you can't describe it in one sentence, split it
3. **Test before committing** - Verify the code works before making a commit
4. **Write clear messages** - Future-you (or someone else) will read these

## Checking Commit History

```bash
# View recent commits
git log --oneline -10

# View detailed commit
git show <commit-hash>

# Search commits by message
git log --grep="feat" --oneline

# View history of a file
git log --oneline -- <file>
```

## Reverting Safe Commits

Because commits are well-organized and semantic, reverting is safe:

```bash
# Revert a single commit
git revert <commit-hash>

# Reset to a previous commit (keep changes)
git reset --soft <commit-hash>

# Reset to a previous commit (discard changes)
git reset --hard <commit-hash>
```

## Integration with Development

**Each work session should:**
1. Make changes to features/fixes
2. Commit with semantic message
3. Push to GitHub
4. Move to next task

This ensures:
- ✅ Zero progress lost
- ✅ Clean git history
- ✅ Easy rollback if needed
- ✅ Automatic changelog generation (future)
- ✅ Semantic versioning support (future)

## Checklist Before Each Commit

- [ ] Code is tested and working
- [ ] Changes are logically grouped (one concern per commit)
- [ ] Message follows format: `type(scope): subject`
- [ ] Body explains why, not how (if multi-line)
- [ ] Pushed to GitHub after commit
- [ ] Can describe change in one sentence

---

**Remember:** Good commits are like checkpoints in a video game. When you need to reload, you'll be grateful for clean save points.
