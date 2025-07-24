import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Building2, Globe, TrendingUp, Clock, CheckCircle, AlertCircle, Target, Users, Zap, Factory, MapPin, Star, Mail, Linkedin, ExternalLink } from 'lucide-react';
import { 
  getGrowthCampaigns, 
  createGrowthCampaign, 
  getCampaignDetails, 
  updateCampaignStatus, 
  updateBrandStatus,
  findSuppliersForBrand,
  getDiscoveredSuppliers,
  getTargetContacts,
  generateOutreachDraft,
  getOutreachEmails,
  triggerEmailSend,
  resendEmail,
  type GrowthCampaign,
  type DiscoveredBrand,
  type DiscoveredSupplier,
  type TargetContact,
  type OutreachEmail
} from '../../api/growth';
import { useOptimizedToast } from '../../hooks/useOptimizedToast';
import { TailwindDialog } from '../../components/ui/Dialog';

const BrandDiscovery: React.FC = () => {
  const [campaigns, setCampaigns] = useState<GrowthCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<GrowthCampaign | null>(null);
  const [selectedBrandSuppliers, setSelectedBrandSuppliers] = useState<{
    brand: DiscoveredBrand;
    suppliers: DiscoveredSupplier[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const toast = useOptimizedToast();

  // New campaign form state
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    keywords: [''],
    region: ''
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await getGrowthCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name.trim() || !newCampaign.keywords[0]?.trim()) {
      toast.error('Please provide campaign name and at least one keyword');
      return;
    }

    try {
      setIsCreating(true);
      const keywords = newCampaign.keywords.filter(k => k.trim() !== '');
      const campaignData = {
        name: newCampaign.name.trim(),
        keywords,
        region: newCampaign.region.trim() || undefined
      };
      
      const created = await createGrowthCampaign(campaignData);
      setCampaigns(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewCampaign({ name: '', keywords: [''], region: '' });
      toast.success('Campaign created and analysis started!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  };

  const addKeyword = () => {
    setNewCampaign(prev => ({
      ...prev,
      keywords: [...prev.keywords, '']
    }));
  };

  const removeKeyword = (index: number) => {
    setNewCampaign(prev => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index)
    }));
  };

  const updateKeyword = (index: number, value: string) => {
    setNewCampaign(prev => ({
      ...prev,
      keywords: prev.keywords.map((k, i) => i === index ? value : k)
    }));
  };

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
      {campaigns.length === 0 ? (
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
          {campaigns.map((campaign) => {
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
                    {campaign.keywords.slice(0, 3).map((keyword, idx) => (
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
      <TailwindDialog
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setNewCampaign({ name: '', keywords: [''], region: '' });
        }}
        title="Create New Campaign"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={newCampaign.name}
              onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="e.g., Q4 2024 Textile Partners"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Keywords
            </label>
            {newCampaign.keywords.map((keyword, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => updateKeyword(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  placeholder="e.g., sustainable textiles"
                  required={index === 0}
                />
                {newCampaign.keywords.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addKeyword}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              + Add Keyword
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Region (Optional)
            </label>
            <input
              type="text"
              value={newCampaign.region}
              onChange={(e) => setNewCampaign(prev => ({ ...prev, region: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
              placeholder="e.g., North America, Europe"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setNewCampaign({ name: '', keywords: [''], region: '' });
              }}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                'Create Campaign'
              )}
            </button>
          </div>
        </form>
      </TailwindDialog>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          onUpdateStatus={async (status) => {
            try {
              await updateCampaignStatus(selectedCampaign.id, status);
              await fetchCampaigns();
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

// Suppliers Modal Component
interface SuppliersModalProps {
  brand: DiscoveredBrand;
  suppliers: DiscoveredSupplier[];
  onClose: () => void;
  toast: any;
}

const SuppliersModal: React.FC<SuppliersModalProps> = ({
  brand,
  suppliers,
  onClose,
  toast
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState<DiscoveredSupplier | null>(null);
  const [supplierContacts, setSupplierContacts] = useState<TargetContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const handleViewContacts = async (supplier: DiscoveredSupplier) => {
    try {
      setIsLoadingContacts(true);
      console.log(`🔍 Loading contacts for ${supplier.companyName}...`);
      const contacts = await getTargetContacts(supplier.id);
      setSupplierContacts(contacts);
      setSelectedSupplier(supplier);
      console.log(`✅ Loaded ${contacts.length} contacts for ${supplier.companyName}`);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error(`Failed to load contacts for ${supplier.companyName}`);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  return (
    <TailwindDialog
      isOpen={true}
      onClose={onClose}
      title={`Manufacturing Partners - ${brand.companyName}`}
      maxWidth="max-w-6xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Factory className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {suppliers.length} Manufacturing Partners Found
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Potential suppliers and manufacturers for {brand.companyName}
            </p>
          </div>
        </div>

        {/* Suppliers List */}
        <div className="max-h-[70vh] overflow-y-auto">
          {suppliers.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Factory className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No suppliers found for this brand</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {suppliers.map((supplier) => (
                <div 
                  key={supplier.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Supplier Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {supplier.companyName}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {supplier.country && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {supplier.country}
                          </div>
                        )}
                        {supplier.relevanceScore && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {supplier.relevanceScore}% relevance
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Supplier Details */}
                  <div className="space-y-3">
                    {supplier.specialization && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Specialization
                        </span>
                        <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                          {supplier.specialization}
                        </p>
                      </div>
                    )}

                    {supplier.sourceUrl && (
                      <div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Source
                        </span>
                        <a 
                          href={supplier.sourceUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Profile
                        </a>
                      </div>
                    )}

                    {/* Contact Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleViewContacts(supplier)}
                        disabled={isLoadingContacts}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                        title="View Contacts"
                      >
                        <Users className="w-3 h-3" />
                        {isLoadingContacts ? 'Loading...' : 'View Contacts'}
                      </button>
                      
                      <button
                        onClick={() => {
                          // TODO: Implement direct outreach
                          toast.info(`Direct outreach to ${supplier.companyName} coming soon!`);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                        title="Start Outreach"
                      >
                        <Mail className="w-3 h-3" />
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Found {suppliers.length} potential manufacturing partners
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Contacts Modal */}
      {selectedSupplier && (
        <ContactsModal
          supplier={selectedSupplier}
          contacts={supplierContacts}
          onClose={() => {
            setSelectedSupplier(null);
            setSupplierContacts([]);
          }}
          toast={toast}
        />
      )}
    </TailwindDialog>
  );
};

// Contacts Modal Component
interface ContactsModalProps {
  supplier: DiscoveredSupplier;
  contacts: TargetContact[];
  onClose: () => void;
  toast: any;
}

const ContactsModal: React.FC<ContactsModalProps> = ({
  supplier,
  contacts,
  onClose,
  toast
}) => {
  const [generatingDraft, setGeneratingDraft] = useState<string | null>(null);
  const [selectedContactForDrafts, setSelectedContactForDrafts] = useState<TargetContact | null>(null);

  const handleGenerateEmailDraft = async (contact: TargetContact) => {
    try {
      setGeneratingDraft(contact.id);
      await generateOutreachDraft(contact.id);
      toast.success(`Email draft generation initiated for ${contact.name}! Check back in a few moments.`);
    } catch (error: any) {
      console.error('Error generating email draft:', error);
      toast.error(`Failed to generate email draft: ${error.response?.data?.message || error.message}`);
    } finally {
      setGeneratingDraft(null);
    }
  };

  const handleViewDrafts = (contact: TargetContact) => {
    setSelectedContactForDrafts(contact);
  };

  return (
    <TailwindDialog
      isOpen={true}
      onClose={onClose}
      title={`Contacts - ${supplier.companyName}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {contacts.length} Contacts Found
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Key decision-makers and contacts at {supplier.companyName}
            </p>
          </div>
        </div>

        {/* Contacts List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No contacts found for this supplier</p>
              <p className="text-sm mt-2">Try running contact enrichment to find decision-makers</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div 
                  key={contact.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {contact.name}
                      </h3>
                      {contact.title && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {contact.title}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm">
                        {contact.email && (
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${contact.email}`} className="hover:underline">
                              {contact.email}
                            </a>
                          </div>
                        )}
                        {contact.linkedinUrl && (
                          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <Linkedin className="w-3 h-3" />
                            <a 
                              href={contact.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              LinkedIn
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {contact.email && (
                        <>
                          <button
                            onClick={() => handleGenerateEmailDraft(contact)}
                            disabled={generatingDraft === contact.id}
                            className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                            title="Generate Email Draft"
                          >
                            <Mail className="w-3 h-3" />
                            {generatingDraft === contact.id ? 'Generating...' : 'Generate Draft'}
                          </button>
                          <button
                            onClick={() => handleViewDrafts(contact)}
                            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                            title="View Email Drafts"
                          >
                            <Eye className="w-3 h-3" />
                            View Drafts
                          </button>
                        </>
                      )}
                      {contact.linkedinUrl && (
                        <button
                          onClick={() => window.open(contact.linkedinUrl, '_blank')}
                          className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          title="Open LinkedIn"
                        >
                          <Linkedin className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {contact.source && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Source: {contact.source}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {contacts.length} contacts for {supplier.companyName}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Email Drafts Modal */}
      {selectedContactForDrafts && (
        <EmailDraftsModal
          contact={selectedContactForDrafts}
          onClose={() => setSelectedContactForDrafts(null)}
          toast={toast}
        />
      )}
    </TailwindDialog>
  );
};

// Email Drafts Modal Component
interface EmailDraftsModalProps {
  contact: TargetContact;
  onClose: () => void;
  toast: any;
}

const EmailDraftsModal: React.FC<EmailDraftsModalProps> = ({
  contact,
  onClose,
  toast
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [outreachEmails, setOutreachEmails] = useState<OutreachEmail[]>([]);
  const [contactInfo, setContactInfo] = useState<{
    contactName: string;
    supplierName: string;
  } | null>(null);
  const [sendingEmailIds, setSendingEmailIds] = useState<Set<string>>(new Set());
  const [resendingEmailIds, setResendingEmailIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOutreachEmails();
  }, [contact.id]);

  const fetchOutreachEmails = async () => {
    try {
      setIsLoading(true);
      const data = await getOutreachEmails(contact.id);
      setOutreachEmails(data.outreachEmails);
      setContactInfo({
        contactName: data.contactName,
        supplierName: data.supplierName
      });
    } catch (error: any) {
      console.error('Error fetching outreach emails:', error);
      toast.error(`Failed to load email drafts: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: OutreachEmail['status']) => {
    const colors = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'QUEUED': 'bg-blue-100 text-blue-800',
      'SENT': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'REPLIED': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleSendEmail = async (email: OutreachEmail) => {
    if (email.status !== 'DRAFT') {
      toast.error('Only draft emails can be sent');
      return;
    }

    try {
      setSendingEmailIds(prev => new Set(prev).add(email.id));
      const result = await triggerEmailSend(email.id);
      
      // Update the email status in local state
      setOutreachEmails(prev => 
        prev.map(e => 
          e.id === email.id 
            ? { ...e, status: 'QUEUED' as OutreachEmail['status'] }
            : e
        )
      );
      
      toast.success(`Email sending initiated for ${result.contactName}!`);
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast.error(`Failed to send email: ${error.response?.data?.message || error.message}`);
    } finally {
      setSendingEmailIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(email.id);
        return newSet;
      });
    }
  };

  const handleResendEmail = async (email: OutreachEmail) => {
    try {
      setResendingEmailIds(prev => new Set(prev).add(email.id));
      const result = await resendEmail(email.id);
      
      // Refresh the email list to show the new draft
      await fetchOutreachEmails();
      
      toast.success(`Resend copy created! New draft: "${result.subject}" is ready to send.`);
    } catch (error: any) {
      console.error('Error creating resend copy:', error);
      toast.error(`Failed to create resend copy: ${error.response?.data?.message || error.message}`);
    } finally {
      setResendingEmailIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(email.id);
        return newSet;
      });
    }
  };

  return (
    <TailwindDialog
      isOpen={true}
      onClose={onClose}
      title={`Email Drafts - ${contact.name}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Mail className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isLoading ? 'Loading...' : `${outreachEmails.length} Email Drafts`}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generated email drafts for {contactInfo?.contactName || contact.name} at {contactInfo?.supplierName || 'Unknown Company'}
            </p>
          </div>
        </div>

        {/* Email Drafts List */}
        <div className="max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading email drafts...</p>
            </div>
          ) : outreachEmails.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No email drafts found</p>
              <p className="text-sm mt-2">Generate an email draft to see it here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {outreachEmails.map((email) => (
                <div 
                  key={email.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        {email.subject}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                          {email.status}
                        </span>
                        <span>{formatDate(email.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Content:</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                      {email.body}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 mt-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(email.body);
                        toast.success('Email content copied to clipboard!');
                      }}
                      className="px-3 py-1.5 text-xs bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      title="Copy Email Content"
                    >
                      Copy
                    </button>
                    
                    {email.status === 'DRAFT' ? (
                      <>
                        {/* Primary Action - Send via System */}
                        <button
                          onClick={() => handleSendEmail(email)}
                          disabled={sendingEmailIds.has(email.id)}
                          className="px-4 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 font-medium"
                          title="Send via Texintelli System"
                        >
                          {sendingEmailIds.has(email.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3" />
                              Send Email
                            </>
                          )}
                        </button>
                        
                        {/* Secondary Action - Manual Send */}
                        <button
                          onClick={() => {
                            const mailtoLink = `mailto:${contact.email}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
                            window.location.href = mailtoLink;
                          }}
                          className="px-3 py-1.5 text-xs border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                          title="Open in Email Client (Manual)"
                        >
                          Manual Send
                        </button>
                      </>
                    ) : email.status === 'SENT' ? (
                      <>
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs bg-green-100 text-green-800 rounded-lg">
                          <CheckCircle className="w-3 h-3" />
                          Successfully Sent
                        </div>
                        <button
                          onClick={() => handleResendEmail(email)}
                          disabled={resendingEmailIds.has(email.id)}
                          className="px-3 py-1.5 text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          title="Create a copy to resend"
                        >
                          {resendingEmailIds.has(email.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3" />
                              Resend
                            </>
                          )}
                        </button>
                      </>
                    ) : email.status === 'QUEUED' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs bg-blue-100 text-blue-800 rounded-lg">
                        <Clock className="w-3 h-3" />
                        Queued for Sending
                      </div>
                    ) : email.status === 'FAILED' ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 text-xs bg-red-100 text-red-800 rounded-lg">
                        <AlertCircle className="w-3 h-3" />
                        Failed to Send
                      </div>
                    ) : email.status === 'REPLIED' ? (
                      <>
                        <div className="flex items-center gap-2 px-3 py-1.5 text-xs bg-purple-100 text-purple-800 rounded-lg">
                          <Mail className="w-3 h-3" />
                          Reply Received
                        </div>
                        <button
                          onClick={() => handleResendEmail(email)}
                          disabled={resendingEmailIds.has(email.id)}
                          className="px-3 py-1.5 text-xs bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          title="Create a follow-up copy"
                        >
                          {resendingEmailIds.has(email.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Mail className="w-3 h-3" />
                              Follow Up
                            </>
                          )}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {!isLoading && (
              <p>Showing {outreachEmails.length} email drafts for {contact.name}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchOutreachEmails}
              disabled={isLoading}
              className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </TailwindDialog>
  );
};

export default BrandDiscovery; 