# 🏴‍☠️ CaptainClaw's Semantic Commit Guide

Welcome aboard! We follow **Conventional Commits** to keep our git history clean and safe.

## Quick Format

```
<type>(<scope>): <subject>

<body (optional)>

<footer (optional)>
```

## Types at a Glance

| Type | Use When | Example |
|------|----------|---------|
| **feat** | Adding a feature | `feat(SearchBar): add fuzzy search` |
| **fix** | Fixing a bug | `fix(api): handle null responses` |
| **refactor** | Restructuring code | `refactor(frontend): extract hooks` |
| **style** | Formatting changes | `style(backend): fix linting` |
| **docs** | Writing docs | `docs(README): add install steps` |
| **test** | Adding tests | `test(api): add integration tests` |
| **chore** | Dependencies, config | `chore(deps): update React to 19` |
| **perf** | Speed improvements | `perf(database): add indexing` |
| **ci** | CI/CD changes | `ci(github): add tests to workflow` |

## Scope (recommended)

Be specific about what changed:
- `frontend`, `backend`, `database`, `api`
- More specific: `SearchBar`, `AuthService`, `ChatWindow`

## Subject Rules

✅ Use **imperative mood**: "add feature" not "added feature"  
✅ **Don't capitalize** first letter  
✅ **No period** at end  
✅ **Max 50 characters**  
✅ **One sentence**

❌ "Added the search feature"  
❌ "Feat: Add Search Feature."  
✅ "feat(SearchBar): add fuzzy search"

## Examples

### Simple Feature
```bash
git commit -m "feat(SearchBar): add fuzzy search"
```

### Feature with Details
```bash
git commit -m "feat(SearchBar): add fuzzy search

- Implement Fuse.js integration for typo-tolerant matching
- Add real-time filtering as user types
- Support keyboard navigation (arrows, enter, escape)

Closes #42"
```

### Bug Fix
```bash
git commit -m "fix(api): handle null responses from LLM

The backend wasn't validating LLM responses, causing 500 errors.
Now checks for null/undefined before processing."
```

### Refactor
```bash
git commit -m "refactor(frontend): extract ChatWindow to separate hooks"
```

## Workflow

```bash
# 1. Make your changes
# 2. Test to ensure it works
# 3. Stage changes
git add <files>

# 4. Commit with semantic message
git commit -m "type(scope): subject"

# 5. Push to GitHub
git push origin main
```

## Safe Checkpoints

Each commit is a **safe checkpoint**. If something breaks:

```bash
# Revert the last commit
git revert HEAD

# Go back to a previous commit (keep changes)
git reset --soft <commit-hash>

# Go back and discard changes
git reset --hard <commit-hash>
```

## View History

```bash
# Recent commits
git log --oneline -10

# Detailed commit
git show <commit-hash>

# Find commits by type
git log --grep="feat" --oneline
git log --grep="fix" --oneline
```

## Before Each Commit ✅

- [ ] Code tested and working
- [ ] Changes are logically grouped
- [ ] Message follows `type(scope): subject`
- [ ] Can describe in one sentence
- [ ] Will push to GitHub after

---

**Remember:** Good commits are like save points in a game. Make them often, describe them clearly, and you'll never lose progress! 🎮💾

For full details, see `git-semantic-commit/SKILL.md`
