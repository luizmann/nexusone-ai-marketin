// Campaign Content Validator - Ensures no blank or empty content
import { FixedCampaignData } from '@/services/fixedCampaignService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100 quality score
}

export class CampaignContentValidator {
  
  static validateCampaign(campaign: FixedCampaignData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Validate basic campaign data
    if (!campaign.productName || campaign.productName.trim().length === 0) {
      errors.push('Product name is missing or empty');
      score -= 10;
    }

    if (!campaign.price || campaign.price.trim().length === 0) {
      errors.push('Price is missing or empty');
      score -= 10;
    }

    if (!campaign.targetAudience || campaign.targetAudience.trim().length === 0) {
      errors.push('Target audience is missing or empty');
      score -= 10;
    }

    // Validate generated content
    const content = campaign.generatedContent;
    if (!content) {
      errors.push('Generated content is completely missing');
      score -= 50;
      return { isValid: false, errors, warnings, score: 0 };
    }

    // Check headline
    if (!content.headline || content.headline.trim().length === 0) {
      errors.push('Headline is missing or empty');
      score -= 15;
    } else if (content.headline.length < 10) {
      warnings.push('Headline is very short (less than 10 characters)');
      score -= 5;
    }

    // Check subheadline
    if (!content.subheadline || content.subheadline.trim().length === 0) {
      errors.push('Subheadline is missing or empty');
      score -= 10;
    }

    // Check hero section
    if (!content.heroSection) {
      errors.push('Hero section is missing');
      score -= 15;
    } else {
      if (!content.heroSection.title || content.heroSection.title.trim().length === 0) {
        errors.push('Hero section title is missing');
        score -= 5;
      }
      if (!content.heroSection.subtitle || content.heroSection.subtitle.trim().length === 0) {
        warnings.push('Hero section subtitle is missing');
        score -= 3;
      }
    }

    // Check problem section
    if (!content.problemSection) {
      errors.push('Problem section is missing');
      score -= 10;
    } else {
      if (!content.problemSection.description || content.problemSection.description.trim().length === 0) {
        errors.push('Problem description is missing');
        score -= 5;
      }
      if (!content.problemSection.painPoints || content.problemSection.painPoints.length === 0) {
        warnings.push('No pain points defined');
        score -= 3;
      }
    }

    // Check solution section
    if (!content.solutionSection) {
      errors.push('Solution section is missing');
      score -= 10;
    } else {
      if (!content.solutionSection.description || content.solutionSection.description.trim().length === 0) {
        errors.push('Solution description is missing');
        score -= 5;
      }
      if (!content.solutionSection.benefits || content.solutionSection.benefits.length === 0) {
        warnings.push('No benefits defined');
        score -= 3;
      }
    }

    // Check features section
    if (!content.featuresSection || !content.featuresSection.features || content.featuresSection.features.length === 0) {
      warnings.push('No features defined');
      score -= 5;
    } else {
      const emptyFeatures = content.featuresSection.features.filter(f => 
        !f.title || f.title.trim().length === 0 || !f.description || f.description.trim().length === 0
      );
      if (emptyFeatures.length > 0) {
        warnings.push(`${emptyFeatures.length} features have empty titles or descriptions`);
        score -= emptyFeatures.length * 2;
      }
    }

    // Check social proof
    if (!content.socialProof) {
      warnings.push('Social proof section is missing');
      score -= 8;
    } else {
      if (!content.socialProof.testimonials || content.socialProof.testimonials.length === 0) {
        warnings.push('No testimonials provided');
        score -= 5;
      }
      if (!content.socialProof.stats || content.socialProof.stats.length === 0) {
        warnings.push('No statistics provided');
        score -= 3;
      }
    }

    // Check pricing section
    if (!content.pricingSection) {
      errors.push('Pricing section is missing');
      score -= 15;
    } else {
      if (!content.pricingSection.ctaText || content.pricingSection.ctaText.trim().length === 0) {
        errors.push('Call-to-action text is missing');
        score -= 10;
      }
    }

    // Validate marketing assets
    const assets = campaign.marketingAssets;
    if (!assets) {
      errors.push('Marketing assets are missing');
      score -= 20;
    } else {
      if (!assets.facebookAds || assets.facebookAds.length === 0) {
        warnings.push('No Facebook ads generated');
        score -= 5;
      }
      if (!assets.videos || assets.videos.length === 0) {
        warnings.push('No video content generated');
        score -= 5;
      }
      if (!assets.whatsappFlow) {
        warnings.push('WhatsApp flow is missing');
        score -= 5;
      }
    }

    // Validate drag & drop assets
    const dragDropAssets = campaign.dragDropAssets;
    if (!dragDropAssets || !dragDropAssets.generatedImages || dragDropAssets.generatedImages.length === 0) {
      warnings.push('No drag & drop images available');
      score -= 8;
    }

    const isValid = errors.length === 0;
    score = Math.max(0, Math.min(100, score));

    return {
      isValid,
      errors,
      warnings,
      score
    };
  }

  static getQualityLabel(score: number): string {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    if (score >= 50) return 'Poor';
    return 'Critical';
  }

  static getQualityColor(score: number): string {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 50) return 'text-orange-500';
    return 'text-red-500';
  }

  static getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    if (score >= 40) return 'outline';
    return 'destructive';
  }

  // Check if content appears to be AI-generated placeholder
  static isPlaceholderContent(text: string): boolean {
    const placeholderPatterns = [
      /lorem ipsum/i,
      /placeholder/i,
      /your (text|content|product|name) here/i,
      /sample (text|content)/i,
      /\[insert.*\]/i,
      /todo:?/i,
      /coming soon/i,
      /under construction/i
    ];

    return placeholderPatterns.some(pattern => pattern.test(text));
  }

  // Validate that content is meaningful and not generic
  static validateContentQuality(campaign: FixedCampaignData): string[] {
    const issues: string[] = [];
    const content = campaign.generatedContent;

    if (!content) return ['No content to validate'];

    // Check for placeholder content
    if (this.isPlaceholderContent(content.headline)) {
      issues.push('Headline appears to be placeholder text');
    }

    if (this.isPlaceholderContent(content.subheadline)) {
      issues.push('Subheadline appears to be placeholder text');
    }

    // Check for product name integration
    const productName = campaign.productName.toLowerCase();
    if (content.headline && !content.headline.toLowerCase().includes(productName) && productName.length > 3) {
      issues.push('Product name not integrated into headline');
    }

    // Check content length quality
    if (content.problemSection?.description && content.problemSection.description.length < 50) {
      issues.push('Problem description is too short');
    }

    if (content.solutionSection?.description && content.solutionSection.description.length < 50) {
      issues.push('Solution description is too short');
    }

    // Check for repetitive content
    const allText = [
      content.headline,
      content.subheadline,
      content.problemSection?.description,
      content.solutionSection?.description
    ].filter(Boolean).join(' ').toLowerCase();

    const words = allText.split(/\s+/);
    const wordCount = new Map<string, number>();
    words.forEach(word => {
      if (word.length > 3) {
        wordCount.set(word, (wordCount.get(word) || 0) + 1);
      }
    });

    const repeatedWords = Array.from(wordCount.entries())
      .filter(([word, count]) => count > 3 && word !== productName.toLowerCase())
      .map(([word]) => word);

    if (repeatedWords.length > 0) {
      issues.push(`Repetitive content detected: ${repeatedWords.join(', ')}`);
    }

    return issues;
  }
}

export const campaignValidator = CampaignContentValidator;