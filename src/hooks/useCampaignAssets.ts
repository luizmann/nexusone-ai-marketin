// Hook for managing generated campaigns and their assets
import { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { FixedCampaignData } from '@/services/fixedCampaignService';

export interface CampaignAsset {
  id: string;
  url: string;
  type: 'hero' | 'product' | 'background' | 'icon' | 'ad' | 'video';
  prompt: string;
  campaignId: string;
  createdAt: string;
}

export function useCampaignAssets() {
  const [campaigns, setCampaigns] = useKV<FixedCampaignData[]>('generated-campaigns', []);
  const [assets, setAssets] = useState<CampaignAsset[]>([]);
  const [loading, setLoading] = useState(false);

  // Load all assets from campaigns
  useEffect(() => {
    const allAssets: CampaignAsset[] = [];
    
    campaigns.forEach(campaign => {
      if (campaign.dragDropAssets?.generatedImages) {
        campaign.dragDropAssets.generatedImages.forEach(image => {
          allAssets.push({
            ...image,
            campaignId: campaign.id,
            createdAt: campaign.createdAt
          });
        });
      }
    });
    
    setAssets(allAssets);
  }, [campaigns]);

  const addCampaign = (campaign: FixedCampaignData) => {
    setCampaigns(prev => [...prev, campaign]);
  };

  const updateCampaign = (campaignId: string, updates: Partial<FixedCampaignData>) => {
    setCampaigns(prev =>
      prev.map(campaign =>
        campaign.id === campaignId ? { ...campaign, ...updates } : campaign
      )
    );
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== campaignId));
  };

  const getLatestCampaign = () => {
    return campaigns.length > 0 ? campaigns[campaigns.length - 1] : null;
  };

  const getAssetsByType = (type: CampaignAsset['type']) => {
    return assets.filter(asset => asset.type === type);
  };

  const getAssetsByCampaign = (campaignId: string) => {
    return assets.filter(asset => asset.campaignId === campaignId);
  };

  const getCampaignById = (campaignId: string) => {
    return campaigns.find(campaign => campaign.id === campaignId);
  };

  return {
    campaigns,
    assets,
    loading,
    addCampaign,
    updateCampaign,
    deleteCampaign,
    getLatestCampaign,
    getAssetsByType,
    getAssetsByCampaign,
    getCampaignById
  };
}

// Hook for campaign statistics
export function useCampaignStats() {
  const { campaigns } = useCampaignAssets();

  const stats = {
    totalCampaigns: campaigns.length,
    completedCampaigns: campaigns.filter(c => c.status === 'completed').length,
    failedCampaigns: campaigns.filter(c => c.status === 'failed').length,
    totalAssets: campaigns.reduce((total, campaign) => {
      return total + (campaign.dragDropAssets?.generatedImages.length || 0);
    }, 0),
    totalAds: campaigns.reduce((total, campaign) => {
      return total + (campaign.marketingAssets?.facebookAds.length || 0);
    }, 0),
    totalVideos: campaigns.reduce((total, campaign) => {
      return total + (campaign.marketingAssets?.videos.length || 0);
    }, 0)
  };

  return stats;
}