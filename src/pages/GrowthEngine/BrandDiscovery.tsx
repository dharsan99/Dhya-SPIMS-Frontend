import React, { useState } from 'react';
import { Plus, Search, Eye, Building2, Globe, TrendingUp, Clock, CheckCircle, AlertCircle, Target, Factory } from 'lucide-react';
import { 
  getGrowthCampaigns, 
  getCampaignDetails, 
  updateCampaignStatus, 
  updateBrandStatus,
  findSuppliersForBrand,
  getDiscoveredSuppliers,
  type GrowthCampaign,
  type DiscoveredBrand,
  type DiscoveredSupplier
} from '../../api/growth';
import { useOptimizedToast } from '../../hooks/useOptimizedToast';
import { TailwindDialog } from '../../components/ui/Dialog';
import { useQuery } from '@tanstack/react-query';
import CreateCampaignModal from '../../components/growthengine/CreateCampaignModal';
import SuppliersModal from '../../components/growthengine/SuppliersModal';

const BrandDiscovery: React.FC = () => {
  const {
    data: campaignsData,
    isLoading,
    isError,
    refetch: refetchCampaigns
  } = useQuery<GrowthCampaign[], Error>({
    queryKey: ['growth-campaigns'],
    queryFn: getGrowthCampaigns,
  });
  const campaigns: GrowthCampaign[] = Array.isArray(campaignsData) ? campaignsData : [];
  const [selectedCampaign, setSelectedCampaign] = useState<GrowthCampaign | null>(null);
  const [selectedBrandSuppliers, setSelectedBrandSuppliers] = useState<{
    brand: DiscoveredBrand;
    suppliers: DiscoveredSupplier[];
  } | null>(null);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const toast = useOptimizedToast();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: GrowthCampaign['status']) => {
    const colors = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'ANALYZING': 'bg-blue-100 text-blue-800',
      'READY_FOR_OUTREACH': 'bg-green-100 text-green-800',
      'ACTIVE': 'bg-purple-100 text-purple-800',
      'PAUSED': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: GrowthCampaign['status']) => {
    const icons = {
      'DRAFT': Clock,
      'ANALYZING': Search,
      'READY_FOR_OUTREACH': Target,
      'ACTIVE': TrendingUp,
      'PAUSED': AlertCircle,
      'COMPLETED': CheckCircle
    };
    return icons[status] || Clock;
  };

  const handleViewCampaign = async (campaign: GrowthCampaign) => {
    try {
      const details = await getCampaignDetails(campaign.id);
      setSelectedCampaign(details);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      toast.error('Failed to load campaign details');
    }
  };

  const handleViewSuppliers = async (brand: DiscoveredBrand) => {
    try {
      setIsLoadingSuppliers(true);
      const suppliers = await getDiscoveredSuppliers(brand.id);
      setSelectedBrandSuppliers({ brand, suppliers });
      toast.success(`Loaded ${suppliers.length} suppliers for ${brand.companyName}`);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      toast.error('Failed to load suppliers');
    } finally {
      setIsLoadingSuppliers(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (isError) {
    toast.error('Failed to load campaigns');
    return (
      <div className="p-6 text-center text-red-500">Failed to load campaigns.</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Discovery</h1>
          <p className="text-gray-600">
            Automatically discover potential business partners and customers in your industry
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      {(campaigns.length === 0) ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first brand discovery campaign to find potential partners and customers
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Campaign
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(campaigns as GrowthCampaign[]).map((campaign: GrowthCampaign) => {
            const StatusIcon = getStatusIcon(campaign.status);
            const brandCount = campaign.discoveredBrands?.length || 0;
            return (
              <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{campaign.name}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      <StatusIcon className="w-3 h-3" />
                      {campaign.status.replace('_', ' ')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewCampaign(campaign)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="w-4 h-4" />
                    <span>{campaign.keywords.length} keywords</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{brandCount} brands discovered</span>
                  </div>

                  {campaign.region && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span>{campaign.region}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-2">
                    {campaign.keywords.slice(0, 3).map((keyword: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {keyword}
                      </span>
                    ))}
                    {campaign.keywords.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{campaign.keywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Created {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleViewCampaign(campaign)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          refetchCampaigns();
        }}
      />

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onUpdateStatus={async (status) => {
            try {
              await updateCampaignStatus(selectedCampaign.id, status);
              await refetchCampaigns();
              setSelectedCampaign(null);
              toast.success('Campaign status updated');
            } catch (error) {
              toast.error('Failed to update campaign status');
            }
          }}
          onUpdateBrandStatus={async (brandId, status) => {
            try {
              await updateBrandStatus(brandId, status);
              // Refresh campaign details
              const updated = await getCampaignDetails(selectedCampaign.id);
              setSelectedCampaign(updated);
              toast.success('Brand status updated');
            } catch (error) {
              toast.error('Failed to update brand status');
            }
          }}
          onRefresh={async () => {
            const updated = await getCampaignDetails(selectedCampaign.id);
            setSelectedCampaign(updated);
          }}
          onViewSuppliers={handleViewSuppliers}
          isLoadingSuppliers={isLoadingSuppliers}
          toast={toast}
        />
      )}
      
      {/* Suppliers Modal */}
      {selectedBrandSuppliers && (
        <SuppliersModal
          brand={selectedBrandSuppliers.brand}
          suppliers={selectedBrandSuppliers.suppliers}
          onClose={() => setSelectedBrandSuppliers(null)}
          toast={toast}
        />
      )}
    </div>
  );
};

// Campaign Details Modal Component
interface CampaignDetailsModalProps {
  campaign: GrowthCampaign;
  onClose: () => void;
  onUpdateStatus: (status: GrowthCampaign['status']) => void;
  onUpdateBrandStatus: (brandId: string, status: DiscoveredBrand['status']) => void;
  onRefresh: () => Promise<void>;
  onViewSuppliers: (brand: DiscoveredBrand) => void;
  isLoadingSuppliers: boolean;
  toast: any;
}

const CampaignDetailsModal: React.FC<CampaignDetailsModalProps> = ({
  campaign,
  onClose,
  onRefresh,
  onViewSuppliers,
  isLoadingSuppliers, 
  toast
}) => {
  const getStatusColor = (status: GrowthCampaign['status']) => {
    const colors = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'ANALYZING': 'bg-blue-100 text-blue-800',
      'READY_FOR_OUTREACH': 'bg-green-100 text-green-800',
      'ACTIVE': 'bg-emerald-100 text-emerald-800',
      'PAUSED': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getBrandStatusColor = (status: DiscoveredBrand['status']) => {
    const colors = {
      'DISCOVERED': 'bg-blue-100 text-blue-800',
      'SUPPLIERS_IDENTIFIED': 'bg-purple-100 text-purple-800',
      'CONTACTS_ENRICHED': 'bg-indigo-100 text-indigo-800',
      'CONTACTED': 'bg-yellow-100 text-yellow-800',
      'RESPONDED': 'bg-green-100 text-green-800',
      'QUALIFIED': 'bg-emerald-100 text-emerald-800',
      'CONVERTED': 'bg-teal-100 text-teal-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <TailwindDialog
      isOpen={true}
      onClose={onClose}
      title={campaign.name}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Campaign Status and Info */}
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
            {campaign.status.replace('_', ' ')}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {campaign.discoveredBrands?.length || 0} brands discovered
          </span>
        </div>

        <div className="max-h-[70vh] overflow-y-auto space-y-6">
          {/* Campaign Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {campaign.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            {campaign.region && (
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Region</h3>
                <p className="text-gray-600 dark:text-gray-400">{campaign.region}</p>
              </div>
            )}
          </div>

          {/* Discovered Brands */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Discovered Brands</h3>
            {!campaign.discoveredBrands || campaign.discoveredBrands.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {campaign.status === 'ANALYZING' ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p>Analyzing and discovering brands...</p>
                  </div>
                ) : (
                  <p>No brands discovered yet</p>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {campaign.discoveredBrands.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{brand.companyName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBrandStatusColor(brand.status)}`}>
                          {brand.status.replace('_', ' ')}
                        </span>
                      </div>
                      {brand.website && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <Globe className="w-3 h-3" />
                          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400">
                            {brand.website}
                          </a>
                        </div>
                      )}
                      {brand.productFitAnalysis && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{brand.productFitAnalysis}</p>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={async () => {
                          try {
                            await findSuppliersForBrand(brand.id);
                            toast.success(`Finding manufacturing partners for ${brand.companyName}...`);
                            // Refresh campaign details to show updated status
                            await onRefresh();
                          } catch (error) {
                            toast.error('Failed to initiate supplier discovery');
                          }
                        }}
                        disabled={brand.status === 'SUPPLIERS_IDENTIFIED'}
                        className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                        title="Find Manufacturing Partners"
                      >
                        <Factory className="w-3 h-3" />
                        {brand.status === 'SUPPLIERS_IDENTIFIED' ? 'Partners Found' : 'Find Partners'}
                      </button>
                      
                                                                  {(() => {
                        // 🔍 DEBUG: Console log brand suppliers data
                        console.log(`🔍 [BRAND DEBUG] Checking View button for ${brand.companyName}:`, {
                          hasDiscoveredSuppliers: !!brand.discoveredSuppliers,
                          suppliersCount: brand.discoveredSuppliers?.length || 0,
                          suppliersData: brand.discoveredSuppliers,
                          status: brand.status,
                          willShowViewButton: !!(brand.discoveredSuppliers && brand.discoveredSuppliers.length > 0)
                        });
                        
                        return (brand.discoveredSuppliers && brand.discoveredSuppliers.length > 0) ? (
                          <button
                            onClick={() => onViewSuppliers(brand)}
                            disabled={isLoadingSuppliers}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-1"
                            title="View Suppliers"
                          >
                            <Eye className="w-3 h-3" />
                            {isLoadingSuppliers ? 'Loading...' : `View (${brand.discoveredSuppliers?.length || 0})`}
                          </button>
                        ) : null;
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </TailwindDialog>
  );
};

export default BrandDiscovery; 