/**
 * Public Repository Integrations for NexusOne AI
 * Integrates various open-source libraries and public APIs
 */

// GitHub Public APIs Integration
export class GitHubRepositoryService {
  private apiUrl = 'https://api.github.com';
  
  async searchRepositories(query: string, language?: string) {
    const params = new URLSearchParams({
      q: language ? `${query} language:${language}` : query,
      sort: 'stars',
      order: 'desc',
      per_page: '20'
    });
    
    const response = await fetch(`${this.apiUrl}/search/repositories?${params}`);
    return response.json();
  }
  
  async getRepositoryContent(owner: string, repo: string, path: string = '') {
    const response = await fetch(`${this.apiUrl}/repos/${owner}/${repo}/contents/${path}`);
    return response.json();
  }
  
  async getPopularAIRepositories() {
    return this.searchRepositories('artificial intelligence machine learning', 'typescript');
  }
  
  async getMarketingAutomationRepos() {
    return this.searchRepositories('marketing automation email campaigns', 'javascript');
  }
}

// NPM Public Registry Integration
export class NPMRegistryService {
  private apiUrl = 'https://registry.npmjs.org';
  
  async searchPackages(query: string) {
    const response = await fetch(`https://www.npmjs.com/search/suggestions?q=${encodeURIComponent(query)}`);
    return response.json();
  }
  
  async getPackageInfo(packageName: string) {
    const response = await fetch(`${this.apiUrl}/${packageName}`);
    return response.json();
  }
  
  async getAIPackages() {
    return this.searchPackages('artificial intelligence openai machine learning');
  }
  
  async getMarketingPackages() {
    return this.searchPackages('marketing automation email facebook ads');
  }
}

// Public API Integrations
export class PublicAPIIntegrator {
  // Free APIs that don't require keys or have public access
  
  async getQuotableQuotes() {
    const response = await fetch('https://api.quotable.io/quotes?tags=motivational,business');
    return response.json();
  }
  
  async getUnsplashPhotos(query: string, perPage: number = 20) {
    const accessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your key
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=${perPage}&client_id=${accessKey}`
    );
    return response.json();
  }
  
  async getJokesAPI() {
    const response = await fetch('https://official-joke-api.appspot.com/jokes/programming/ten');
    return response.json();
  }
  
  async getCatFacts() {
    const response = await fetch('https://catfact.ninja/facts?limit=10');
    return response.json();
  }
  
  async getAdviceSlip() {
    const response = await fetch('https://api.adviceslip.com/advice');
    return response.json();
  }
}

// Open Source Template Repository Integration
export class TemplateRepositoryService {
  private templates = [
    {
      name: 'React Landing Page Templates',
      repo: 'cruip/open-react-template',
      description: 'Free React landing page templates',
      category: 'landing-pages',
      license: 'MIT'
    },
    {
      name: 'Email Templates',
      repo: 'leemunroe/responsive-html-email-template',
      description: 'Responsive HTML email templates',
      category: 'email',
      license: 'MIT'
    },
    {
      name: 'Marketing Components',
      repo: 'tailwindlabs/headlessui',
      description: 'Headless UI components for marketing sites',
      category: 'components',
      license: 'MIT'
    },
    {
      name: 'AI Chat Interface',
      repo: 'mckaywrigley/chatbot-ui',
      description: 'Open source chatbot UI',
      category: 'ai-chat',
      license: 'MIT'
    },
    {
      name: 'E-commerce Templates',
      repo: 'vercel/commerce',
      description: 'Next.js commerce templates',
      category: 'ecommerce',
      license: 'MIT'
    }
  ];
  
  async getTemplatesByCategory(category: string) {
    return this.templates.filter(template => template.category === category);
  }
  
  async getAllTemplates() {
    return this.templates;
  }
  
  async downloadTemplate(repoUrl: string) {
    // Implementation would download and extract repository
    const zipUrl = `https://github.com/${repoUrl}/archive/main.zip`;
    return { downloadUrl: zipUrl, success: true };
  }
}

// Public Code Snippet Integration
export class CodeSnippetService {
  private snippets = {
    'react-hooks': [
      {
        name: 'useLocalStorage',
        code: `
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
        `,
        description: 'React hook for localStorage management',
        author: 'Public Domain'
      }
    ],
    'marketing-utils': [
      {
        name: 'generateEmailTemplate',
        code: `
export function generateEmailTemplate(data: {
  title: string;
  content: string;
  ctaText: string;
  ctaUrl: string;
}) {
  return \`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>\${data.title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2c3e50;">\${data.title}</h1>
        <p>\${data.content}</p>
        <a href="\${data.ctaUrl}" style="background: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          \${data.ctaText}
        </a>
      </div>
    </body>
    </html>
  \`;
}
        `,
        description: 'Generate responsive email templates',
        author: 'Community'
      }
    ]
  };
  
  async getSnippetsByCategory(category: string) {
    return this.snippets[category] || [];
  }
  
  async getAllSnippets() {
    return this.snippets;
  }
}

// Integration Manager
export class PublicRepositoryIntegrationManager {
  private github: GitHubRepositoryService;
  private npm: NPMRegistryService;
  private publicAPI: PublicAPIIntegrator;
  private templates: TemplateRepositoryService;
  private snippets: CodeSnippetService;
  
  constructor() {
    this.github = new GitHubRepositoryService();
    this.npm = new NPMRegistryService();
    this.publicAPI = new PublicAPIIntegrator();
    this.templates = new TemplateRepositoryService();
    this.snippets = new CodeSnippetService();
  }
  
  // Get inspiration content for campaigns
  async getInspirationContent() {
    try {
      const [quotes, advice] = await Promise.all([
        this.publicAPI.getQuotableQuotes(),
        this.publicAPI.getAdviceSlip()
      ]);
      
      return {
        quotes: quotes.results || [],
        advice: advice.slip?.advice || '',
        success: true
      };
    } catch (error) {
      console.error('Error fetching inspiration content:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get marketing templates
  async getMarketingTemplates() {
    try {
      const [landingPages, emailTemplates, components] = await Promise.all([
        this.templates.getTemplatesByCategory('landing-pages'),
        this.templates.getTemplatesByCategory('email'),
        this.templates.getTemplatesByCategory('components')
      ]);
      
      return {
        landingPages,
        emailTemplates,
        components,
        success: true
      };
    } catch (error) {
      console.error('Error fetching marketing templates:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get AI tools and libraries
  async getAIToolsAndLibraries() {
    try {
      const [aiRepos, aiPackages] = await Promise.all([
        this.github.getPopularAIRepositories(),
        this.npm.getAIPackages()
      ]);
      
      return {
        repositories: aiRepos.items || [],
        packages: aiPackages || [],
        success: true
      };
    } catch (error) {
      console.error('Error fetching AI tools:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get marketing automation resources
  async getMarketingAutomationResources() {
    try {
      const [marketingRepos, marketingPackages] = await Promise.all([
        this.github.getMarketingAutomationRepos(),
        this.npm.getMarketingPackages()
      ]);
      
      return {
        repositories: marketingRepos.items || [],
        packages: marketingPackages || [],
        success: true
      };
    } catch (error) {
      console.error('Error fetching marketing resources:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get free stock images
  async getFreeStockImages(query: string = 'business marketing') {
    try {
      const images = await this.publicAPI.getUnsplashPhotos(query);
      return {
        images: images.results || [],
        success: true
      };
    } catch (error) {
      console.error('Error fetching stock images:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Get useful code snippets
  async getUsefulCodeSnippets() {
    try {
      const [reactHooks, marketingUtils] = await Promise.all([
        this.snippets.getSnippetsByCategory('react-hooks'),
        this.snippets.getSnippetsByCategory('marketing-utils')
      ]);
      
      return {
        reactHooks,
        marketingUtils,
        success: true
      };
    } catch (error) {
      console.error('Error fetching code snippets:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const publicRepoIntegration = new PublicRepositoryIntegrationManager();