# Contributing to NexusOne AI

Thank you for your interest in contributing to NexusOne AI! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- A Supabase account (for backend development)
- OpenAI API key (for AI features)

### Development Setup

1. **Fork and Clone**
```bash
git clone https://github.com/yourusername/nexusone-ai.git
cd nexusone-ai
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env.local
# Add your API keys to .env.local
```

4. **Start Development Server**
```bash
npm run dev
```

## Contributing Guidelines

### Types of Contributions

We welcome the following types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📝 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🌍 **Translation improvements**
- 🧪 **Test coverage improvements**

### Before Contributing

1. **Check existing issues** to avoid duplicating work
2. **Create an issue** for new features to discuss implementation
3. **Read the roadmap** to understand project direction
4. **Review the codebase** to understand our patterns and conventions

## Pull Request Process

### 1. Create a Branch

Create a descriptive branch name:
```bash
git checkout -b feature/ai-video-generator
git checkout -b fix/login-issue
git checkout -b docs/api-documentation
```

### 2. Make Changes

- Follow our [coding standards](#coding-standards)
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Commit Changes

Use conventional commit messages:
```bash
git commit -m "feat: add AI video generation with Luma API"
git commit -m "fix: resolve authentication redirect issue"
git commit -m "docs: update API integration guide"
```

### 4. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request with:
- Clear title and description
- Link to related issues
- Screenshots for UI changes
- Test coverage information

### 5. Review Process

- Automated checks must pass
- Code review by maintainers
- Testing on staging environment
- Documentation review (if applicable)

## Coding Standards

### TypeScript

We use strict TypeScript configuration:

```typescript
// ✅ Good
interface UserProfile {
  id: string
  email: string
  createdAt: Date
}

const updateUser = async (userId: string, data: Partial<UserProfile>): Promise<UserProfile> => {
  // Implementation
}

// ❌ Bad
const updateUser = (userId: any, data: any) => {
  // Implementation
}
```

### React Components

Use functional components with hooks:

```typescript
// ✅ Good
interface Props {
  userId: string
  onUpdate: (user: UserProfile) => void
}

export const UserCard: React.FC<Props> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  
  // Component logic
  
  return (
    <div className="p-4 border rounded-lg">
      {/* JSX */}
    </div>
  )
}

// ❌ Bad
export const UserCard = (props: any) => {
  // Implementation
}
```

### CSS and Styling

Use Tailwind CSS classes:

```typescript
// ✅ Good
<button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
  Click me
</button>

// ❌ Bad
<button style={{ padding: '8px 16px', backgroundColor: 'blue' }}>
  Click me
</button>
```

### File Organization

```
src/
├── components/           # Reusable components
│   ├── ui/              # Base UI components
│   ├── forms/           # Form components
│   └── layout/          # Layout components
├── pages/               # Page components
├── hooks/               # Custom hooks
├── services/            # API services
├── types/               # TypeScript types
├── utils/               # Utility functions
└── constants/           # Application constants
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile`, `CampaignCard`)
- **Files**: kebab-case (`user-profile.tsx`, `campaign-card.tsx`)
- **Variables**: camelCase (`userId`, `campaignData`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_RETRIES`)

## Testing Requirements

### Unit Tests

Write unit tests for utilities and hooks:

```typescript
// src/utils/__tests__/format-currency.test.ts
import { formatCurrency } from '../format-currency'

describe('formatCurrency', () => {
  it('should format USD currency correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
  })
  
  it('should handle zero values', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0.00')
  })
})
```

### Integration Tests

Test API integrations:

```typescript
// src/services/__tests__/campaign-service.test.ts
import { campaignService } from '../campaign-service'

describe('CampaignService', () => {
  it('should create campaign successfully', async () => {
    const campaign = await campaignService.create({
      name: 'Test Campaign',
      type: 'facebook_ads'
    })
    
    expect(campaign.id).toBeDefined()
    expect(campaign.status).toBe('draft')
  })
})
```

### E2E Tests

Test critical user flows:

```typescript
// e2e/campaign-creation.spec.ts
import { test, expect } from '@playwright/test'

test('user can create a complete marketing campaign', async ({ page }) => {
  await page.goto('/dashboard')
  await page.click('[data-testid="create-campaign"]')
  await page.fill('[data-testid="campaign-name"]', 'Test Campaign')
  await page.click('[data-testid="generate-campaign"]')
  
  await expect(page.locator('[data-testid="campaign-success"]')).toBeVisible()
})
```

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## Documentation

### Code Documentation

Use JSDoc for complex functions:

```typescript
/**
 * Generates a complete marketing campaign using AI
 * @param productUrl - The URL of the product to promote
 * @param options - Campaign generation options
 * @returns Promise resolving to the generated campaign
 */
async function generateCampaign(
  productUrl: string,
  options: CampaignOptions
): Promise<Campaign> {
  // Implementation
}
```

### README Updates

When adding new features, update:
- Feature list in README.md
- Installation instructions (if needed)
- API documentation (if applicable)
- Examples and usage guides

### API Documentation

Document new API endpoints:

```typescript
/**
 * POST /api/campaigns
 * Creates a new marketing campaign
 * 
 * Body:
 * {
 *   "name": "string",
 *   "type": "facebook_ads" | "google_ads" | "complete_funnel",
 *   "productUrl": "string",
 *   "options": {
 *     "includeVideo": boolean,
 *     "includeLandingPage": boolean
 *   }
 * }
 * 
 * Returns:
 * {
 *   "id": "string",
 *   "status": "draft" | "active" | "completed",
 *   "createdAt": "string",
 *   "assets": {
 *     "landingPage": "string",
 *     "adCreatives": "string[]",
 *     "videos": "string[]"
 *   }
 * }
 */
```

## Development Workflow

### Branch Strategy

- `main` - Production ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commit Message Format

Use conventional commits:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(ai): add video generation with Luma API
fix(auth): resolve token refresh issue
docs(api): update campaign creation guide
```

### Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows our style guidelines
- [ ] Tests are written and passing
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] Error handling is implemented
- [ ] TypeScript types are defined
- [ ] Performance impact is considered
- [ ] Accessibility is maintained

## Getting Help

### Communication Channels

- **Discord**: [Join our community](https://discord.gg/nexusone)
- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Email**: developers@nexusone.ai

### Maintainer Response Times

- Critical bugs: Within 24 hours
- Feature requests: Within 1 week
- Pull reviews: Within 2-3 days
- Questions: Within 1-2 days

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Discord announcements
- LinkedIn shoutouts

## License

By contributing to NexusOne AI, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to NexusOne AI! 🚀