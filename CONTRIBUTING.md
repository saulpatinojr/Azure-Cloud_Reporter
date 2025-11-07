# Contributing to Cloud Reporter

Thank you for your interest in contributing to Cloud Reporter! This guide will help you understand our development process and standards.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 8+
- Git version control
- Firebase account (for testing)
- Modern code editor (VS Code recommended)

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/azure-cloud-reporter.git
cd azure-cloud-reporter

# Install dependencies
npm install --legacy-peer-deps

# Copy environment configuration
cp .env.example .env.local

# Start development server
npm run dev
```

### Code Editor Setup

#### VS Code Extensions (Recommended)
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **Tailwind CSS IntelliSense**
- **Firebase**

#### Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🛠 Development Guidelines

### Code Standards

#### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` type - use proper typing
- Use utility types when appropriate

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
}

// Avoid
const user: any = {};
```

#### React Components
- Use functional components with hooks
- Implement proper prop typing
- Follow the component file structure
- Use compound components for complex UI

```typescript
// Component structure
interface ComponentProps {
  title: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export const Component: React.FC<ComponentProps> = ({ 
  title, 
  children, 
  variant = 'primary' 
}) => {
  // Component logic
  return (
    <div className={`component component--${variant}`}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
```

#### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use design system tokens for consistency
- Create reusable component variants

```typescript
// Good - Utility classes with responsive design
<div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow">

// Avoid - Inline styles
<div style={{ padding: '16px', backgroundColor: 'white' }}>
```

### File Organization

#### Directory Structure
```
src/
├── components/
│   ├── design-system/     # Reusable UI components
│   ├── layout/            # Layout components
│   ├── forms/             # Form components
│   └── [feature]/         # Feature-specific components
├── pages/                 # Page components
├── services/              # Business logic
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
├── utils/                 # Utility functions
├── types/                 # TypeScript definitions
└── lib/                   # Third-party configurations
```

#### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Services**: camelCase with Service suffix (`userService.ts`)
- **Types**: PascalCase with descriptive names (`UserData`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

### Testing Standards

#### Unit Tests
```typescript
// Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from './Component';

describe('Component', () => {
  test('renders with correct title', () => {
    render(<Component title="Test Title">Content</Component>);
    expect(screen.getByRole('heading')).toHaveTextContent('Test Title');
  });

  test('handles user interactions', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Integration Tests
```typescript
// feature.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeaturePage } from './FeaturePage';
import { TestProviders } from '../__tests__/TestProviders';

test('completes feature workflow', async () => {
  const user = userEvent.setup();
  
  render(
    <TestProviders>
      <FeaturePage />
    </TestProviders>
  );

  // Test user interaction flow
  await user.click(screen.getByRole('button', { name: /start/i }));
  await waitFor(() => {
    expect(screen.getByText(/success/i)).toBeInTheDocument();
  });
});
```

#### E2E Tests
```typescript
// cypress/e2e/feature.cy.ts
describe('Feature Workflow', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.visit('/feature');
  });

  it('completes the full workflow', () => {
    cy.get('[data-cy=start-button]').click();
    cy.get('[data-cy=form-input]').type('Test data');
    cy.get('[data-cy=submit-button]').click();
    
    cy.get('[data-cy=success-message]')
      .should('contain', 'Workflow completed successfully');
  });
});
```

## 📝 Pull Request Process

### Before Submitting

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/descriptive-name
   ```

2. **Write Tests**
   - Unit tests for components and utilities
   - Integration tests for complex features
   - E2E tests for critical user flows

3. **Run Quality Checks**
   ```bash
   npm run lint        # ESLint checks
   npm run type-check  # TypeScript validation
   npm run test        # Unit tests
   npm run e2e         # E2E tests (optional for minor changes)
   ```

4. **Update Documentation**
   - Update README if needed
   - Add/update component documentation
   - Update API documentation for service changes

### Pull Request Template

```markdown
## Description
Brief description of the changes and their purpose.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed

## Screenshots (if applicable)
Include screenshots or GIFs for UI changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No console errors or warnings
```

### Review Process

1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Functional testing in staging environment
4. **Documentation**: Ensure documentation is updated

## 🎨 Design System Contributions

### Creating Components

#### Component Structure
```typescript
// Button/Button.tsx
import React from 'react';
import { cn } from '../../utils/helpers';
import { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'button',
        `button--${variant}`,
        `button--${size}`,
        { 'button--disabled': disabled },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Component Types
```typescript
// Button/Button.types.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

#### Storybook Stories
```typescript
// Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};
```

#### Component Tests
```typescript
// Button/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });

  test('applies variant classes', () => {
    render(<Button variant="secondary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('button--secondary');
  });
});
```

### Design Tokens

#### Token Structure
```typescript
// tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
    // More color scales
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};
```

## 🐛 Bug Reports

### Bug Report Template

```markdown
## Bug Description
A clear description of the bug and its impact.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Browser: [e.g., Chrome 91]
- OS: [e.g., Windows 10]
- App Version: [e.g., 1.2.3]

## Screenshots
Add screenshots if applicable.

## Additional Context
Any other relevant information.
```

## 🚀 Feature Requests

### Feature Request Template

```markdown
## Feature Summary
Brief description of the proposed feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
Detailed description of the proposed solution.

## Alternatives Considered
Other solutions that were considered.

## Additional Context
Mockups, examples, or additional information.

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

## 📚 Documentation Contributions

### Documentation Standards

- Use clear, concise language
- Include code examples for technical content
- Follow markdown best practices
- Keep documentation up to date with code changes

### Types of Documentation

1. **API Documentation**: Service and component APIs
2. **User Guides**: Step-by-step user instructions
3. **Developer Guides**: Technical implementation details
4. **Deployment Guides**: Setup and configuration instructions

## 🏆 Recognition

### Contributors

We recognize contributions through:
- GitHub contributor graphs
- Release notes acknowledgments
- Community showcases
- Contributor spotlights

### Becoming a Maintainer

Regular contributors may be invited to become maintainers based on:
- Consistent, high-quality contributions
- Community involvement and support
- Understanding of project architecture and goals
- Commitment to project values and standards

## 📞 Getting Help

### Development Support

- **GitHub Discussions**: Community Q&A
- **GitHub Issues**: Bug reports and feature requests
- **Documentation**: Comprehensive guides and references

### Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's code of conduct

---

Thank you for contributing to Cloud Reporter! Your contributions help make this platform better for the entire MSP community.