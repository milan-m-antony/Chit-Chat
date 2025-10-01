# 🤝 Contributing to ChitChat

Thank you for your interest in contributing to ChitChat! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## 🚀 Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chitchat.git
   cd chitchat
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Set up environment**
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

5. **Run development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing patterns
   - Add comments for complex logic

3. **Test your changes**
   - Test in multiple browsers
   - Test on mobile devices
   - Test with multiple users

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 💻 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use type inference where appropriate

### React
- Use functional components
- Use hooks (useState, useEffect, useCallback)
- Keep components small and focused
- Extract reusable logic into custom hooks

### Styling
- Use TailwindCSS utility classes
- Follow existing color scheme
- Use CSS variables for theme colors
- Ensure responsive design

### File Structure
```
components/
├── ui/              # Reusable UI components
├── Feature.tsx      # Feature-specific components
└── README.md        # Component documentation
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ChatMessage.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useProgressTimer.tsx`)
- **Utils**: camelCase (e.g., `formatTime.ts`)
- **Types**: PascalCase (e.g., `Message`, `UserProfile`)

## 📝 Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
type(scope): subject

body (optional)

footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(chat): add message editing feature
fix(auth): resolve login redirect issue
docs(readme): update setup instructions
style(components): format code with prettier
refactor(hooks): extract timer logic to custom hook
```

## 🔍 Pull Request Process

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Documentation updated if needed

### PR Title
Use conventional commit format:
```
feat(chat): add message editing
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test the changes

## Screenshots (if applicable)
Add screenshots or GIFs

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on multiple devices
```

### Review Process
1. Maintainer will review your PR
2. Address any feedback
3. Once approved, PR will be merged
4. Your contribution will be credited

## 🐛 Reporting Bugs

### Before Reporting
- Check if bug already reported
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop, iPhone 13]

**Additional context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of desired solution

**Describe alternatives you've considered**
Alternative solutions or features

**Additional context**
Mockups, examples, or references
```

## 🎯 Areas for Contribution

### Good First Issues
- UI improvements
- Documentation updates
- Bug fixes
- Adding tests

### Advanced Contributions
- New features
- Performance optimizations
- Security enhancements
- Database optimizations

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 💬 Questions?

- Open an issue for questions
- Join our community discussions
- Check existing issues and PRs

## 🙏 Thank You!

Every contribution, no matter how small, is valuable. Thank you for helping make ChitChat better!

---

**Happy Coding! 🚀**
