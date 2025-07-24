import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Brain, RefreshCw, AlertCircle, ChevronDown, Wand2, Edit3, Target, TrendingUp, Shield, AlertTriangle, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  getCompanyPersona, 
  upsertCompanyPersona, 
  triggerPersonaGeneration} from '../../api/growth';
import useAuthStore from '../../hooks/auth';
import { TailwindDialog } from '../../components/ui/Dialog';

// Utility functions to parse persona data

// Fallback data when parsing fails

// Accordion Component
const AccordionItem = ({ title, children, isOpen, onToggle }: { 
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
}) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-lg">{title}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-gray-600 dark:text-gray-300">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// SWOT Card Component
const SWOTCard = ({ 
  type, 
  title, 
  items, 
  icon: Icon 
}: { 
  type: 'strengths' | 'weaknesses' | 'opportunities' | 'threats';
  title: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
}) => {
  const colors = {
    strengths: 'green',
    weaknesses: 'red', 
    opportunities: 'blue',
    threats: 'gray'
  };

  const colorClass = colors[type];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <div className={`p-4 border-b border-${colorClass}-200 dark:border-${colorClass}-800 bg-${colorClass}-50 dark:bg-${colorClass}-900/20`}>
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 text-${colorClass}-600 dark:text-${colorClass}-400`} />
          <h3 className={`font-bold text-${colorClass}-600 dark:text-${colorClass}-400`}>{title}</h3>
        </div>
      </div>
      <ul className="p-4 space-y-2">
        {items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} className="text-gray-600 dark:text-gray-300 flex items-start">
              <span className={`inline-block w-2 h-2 rounded-full bg-${colorClass}-400 mt-2 mr-3 flex-shrink-0`}></span>
              <span>{item}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-500 dark:text-gray-400 italic">No data available</li>
        )}
      </ul>
    </div>
  );
};

export const CompanyPersona = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState('');
  const [simplePersonaInput, setSimplePersonaInput] = useState('');
  const [openAccordion, setOpenAccordion] = useState<string | null>('executive-summary');

  // Query for company persona
  const { 
    data: personaData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['companyPersona'],
    queryFn: getCompanyPersona,
    retry: (failureCount, error: any) => {
      // Don't retry on 404 errors (no persona exists)
      if (error?.status === 404 || error?.code === 'PERSONA_NOT_FOUND') {
        console.log('[QUERY] Not retrying 404 error - no persona exists');
        return false;
      }
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  console.log('🎯 [COMPONENT] Query state:', {
    isLoading,
    hasData: !!personaData,
    error: error?.message,
    personaDataKeys: personaData ? Object.keys(personaData) : []
  });

  // Debug: Log the actual persona data structure
  if (personaData) {
    console.log('🔍 [COMPONENT] Raw persona data from backend:', {
      id: personaData.id,
      tenant_id: personaData.tenant_id,
      executiveSummary: personaData.executiveSummary?.substring(0, 100) + '...',
      targetMarketSweetSpot: personaData.targetMarketSweetSpot?.substring(0, 100) + '...',
      swotAnalysisKeys: personaData.swotAnalysis ? Object.keys(personaData.swotAnalysis) : [],
      swotAnalysisSample: personaData.swotAnalysis ? {
        strengthsCount: personaData.swotAnalysis.strengths?.length || 0,
        weaknessesCount: personaData.swotAnalysis.weaknesses?.length || 0,
        opportunitiesCount: personaData.swotAnalysis.opportunities?.length || 0,
        threatsCount: personaData.swotAnalysis.threats?.length || 0,
        strengthsSample: personaData.swotAnalysis.strengths?.slice(0, 2) || [],
        weaknessesSample: personaData.swotAnalysis.weaknesses?.slice(0, 2) || []
      } : null,
      detailedAnalysisKeys: personaData.detailedAnalysis ? Object.keys(personaData.detailedAnalysis) : [],
      detailedAnalysisSample: personaData.detailedAnalysis ? {
        productionAndQuality: personaData.detailedAnalysis.productionAndQuality?.substring(0, 100) + '...',
        marketPositioningAndAdvantage: personaData.detailedAnalysis.marketPositioningAndAdvantage?.substring(0, 100) + '...',
        coreExpertiseAndDifferentiators: personaData.detailedAnalysis.coreExpertiseAndDifferentiators?.substring(0, 100) + '...'
      } : null
    });
  }

  // Use structured data directly from API response
  const structuredPersona = personaData ? {
    companyName: 'NSC Spinning Mills', // Default company name
    executiveSummary: personaData.executiveSummary || '',
    targetMarket: personaData.targetMarketSweetSpot ? [personaData.targetMarketSweetSpot] : [],
    strengths: personaData.swotAnalysis?.strengths || [],
    weaknesses: personaData.swotAnalysis?.weaknesses || [],
    opportunities: personaData.swotAnalysis?.opportunities || [],
    threats: personaData.swotAnalysis?.threats || [],
    productionCapabilities: personaData.detailedAnalysis?.productionAndQuality || 
                           personaData.detailedAnalysis?.productionCapabilities || '',
    coreExpertise: personaData.detailedAnalysis?.coreExpertiseAndDifferentiators || 
                  personaData.detailedAnalysis?.coreExpertise || '',
    marketPositioning: personaData.detailedAnalysis?.marketPositioningAndAdvantage || 
                      personaData.detailedAnalysis?.marketPositioning || '',
    rawText: JSON.stringify(personaData, null, 2) // For debugging
  } : null;

  // For backward compatibility, create a text version for editing
  const detailedPersona = structuredPersona ? 
    `Executive Summary: ${structuredPersona.executiveSummary}\n\n` +
    `Target Market: ${structuredPersona.targetMarket.join(', ')}\n\n` +
    `Strengths:\n${structuredPersona.strengths.map(s => `- ${s}`).join('\n')}\n\n` +
    `Weaknesses:\n${structuredPersona.weaknesses.map(w => `- ${w}`).join('\n')}\n\n` +
    `Opportunities:\n${structuredPersona.opportunities.map(o => `- ${o}`).join('\n')}\n\n` +
    `Threats:\n${structuredPersona.threats.map(t => `- ${t}`).join('\n')}\n\n` +
    `Production and Quality: ${structuredPersona.productionCapabilities}\n\n` +
    `Core Expertise and Differentiators: ${structuredPersona.coreExpertise}\n\n` +
    `Market Positioning and Advantage: ${structuredPersona.marketPositioning}`
    : '';

  console.log('🎯 [COMPONENT] Data processing:', {
    hasStructuredPersona: !!structuredPersona,
    structuredPersonaKeys: structuredPersona ? Object.keys(structuredPersona) : [],
    detailedPersonaLength: detailedPersona.length,
    strengthsCount: structuredPersona?.strengths?.length || 0,
    weaknessesCount: structuredPersona?.weaknesses?.length || 0,
    opportunitiesCount: structuredPersona?.opportunities?.length || 0,
    threatsCount: structuredPersona?.threats?.length || 0
  });

  const saveMutation = useMutation({
    mutationFn: (personaText: string) => {
      // Convert text back to structured format for the API
      const lines = personaText.split('\n');
      const structuredData = {
        executiveSummary: '',
        targetMarketSweetSpot: '',
        swotAnalysis: {
          strengths: [] as string[],
          weaknesses: [] as string[],
          opportunities: [] as string[],
          threats: [] as string[]
        },
        detailedAnalysis: {
          productionAndQuality: '',
          marketPositioningAndAdvantage: '',
          coreExpertiseAndDifferentiators: '',
          // Fallback fields for backward compatibility
          productionCapabilities: '',
          coreExpertise: '',
          marketPositioning: '',
          competitiveAdvantages: [] as string[],
          marketChallenges: [] as string[],
          growthStrategies: [] as string[]
        }
      };

      let currentSection = '';
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('Executive Summary:')) {
          structuredData.executiveSummary = trimmedLine.replace('Executive Summary:', '').trim();
        } else if (trimmedLine.startsWith('Target Market:')) {
          structuredData.targetMarketSweetSpot = trimmedLine.replace('Target Market:', '').trim();
        } else if (trimmedLine.startsWith('Strengths:')) {
          currentSection = 'strengths';
        } else if (trimmedLine.startsWith('Weaknesses:')) {
          currentSection = 'weaknesses';
        } else if (trimmedLine.startsWith('Opportunities:')) {
          currentSection = 'opportunities';
        } else if (trimmedLine.startsWith('Threats:')) {
          currentSection = 'threats';
        } else if (trimmedLine.startsWith('Production Capabilities:') || trimmedLine.startsWith('Production and Quality:')) {
          const content = trimmedLine.replace(/Production (Capabilities|and Quality):/, '').trim();
          structuredData.detailedAnalysis.productionAndQuality = content;
          structuredData.detailedAnalysis.productionCapabilities = content; // Fallback
        } else if (trimmedLine.startsWith('Core Expertise:') || trimmedLine.startsWith('Core Expertise and Differentiators:')) {
          const content = trimmedLine.replace(/Core Expertise( and Differentiators)?:/, '').trim();
          structuredData.detailedAnalysis.coreExpertiseAndDifferentiators = content;
          structuredData.detailedAnalysis.coreExpertise = content; // Fallback
        } else if (trimmedLine.startsWith('Market Positioning:') || trimmedLine.startsWith('Market Positioning and Advantage:')) {
          const content = trimmedLine.replace(/Market Positioning( and Advantage)?:/, '').trim();
          structuredData.detailedAnalysis.marketPositioningAndAdvantage = content;
          structuredData.detailedAnalysis.marketPositioning = content; // Fallback
        } else if (trimmedLine.startsWith('- ') && currentSection) {
          const item = trimmedLine.replace('- ', '').trim();
          if (item) {
            structuredData.swotAnalysis[currentSection as keyof typeof structuredData.swotAnalysis].push(item);
          }
        }
      }

      return upsertCompanyPersona(structuredData);
    },
    onSuccess: () => {
      console.log('✅ [MUTATION] Persona saved successfully');
      toast.success('Persona saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['companyPersona'] });
      setIsEditModalOpen(false);
    },
    onError: (err: Error) => {
      console.error('❌ [MUTATION] Save mutation failed:', err.message);
      toast.error(err.message || 'Failed to save persona. Please try again.');
    },
  });

  const generateMutation = useMutation({
    mutationFn: triggerPersonaGeneration,
    onSuccess: () => {
      console.log('✅ [MUTATION] Persona generation triggered successfully');
      toast.success('AI processing started! Check back in a few minutes for your generated persona.');
      // Refetch after a delay to get the new persona
      setTimeout(() => {
        console.log('🔄 [MUTATION] Refetching persona after generation delay');
        refetch();
      }, 30000); // 30 seconds delay
    },
    onError: (err: Error) => {
      console.error('❌ [MUTATION] Generation mutation failed:', err.message);
      toast.error(err.message || 'Failed to generate persona. Please try again.');
    },
  });

  // --- Handlers ---
  const handleSave = () => {
    console.log('💾 [HANDLER] Save button clicked');
    console.log('💾 [HANDLER] Editing persona length:', editingPersona.length);
    
    if (!editingPersona.trim()) {
      console.warn('⚠️ [HANDLER] Empty persona content, showing error');
      toast.error('Please enter persona content before saving.');
      return;
    }
    
    console.log('💾 [HANDLER] Calling save mutation');
    saveMutation.mutate(editingPersona);
  };

  const handleGenerate = () => {
    console.log('🚀 [HANDLER] Generate button clicked');
    console.log('🚀 [HANDLER] Simple input length:', simplePersonaInput.length);
    
    if (!simplePersonaInput.trim()) {
      console.warn('⚠️ [HANDLER] Empty input, showing error');
      toast.error('Please provide company details for AI generation.');
      return;
    }

    // === DEBUG: Check user and tenantId ===
    const tenantId = user?.tenantId || user?.tenant_id;
    console.log('🔍 [HANDLER] User object:', {
      hasUser: !!user,
      userKeys: user ? Object.keys(user) : 'No user',
      tenantId: tenantId,
      tenantIdType: typeof tenantId,
      userId: user?.id,
      userEmail: user?.email
    });

    // Check if tenantId exists and is valid (support both formats)
    if (!tenantId) {
      console.error('❌ [HANDLER] Missing tenantId in user object');
      toast.error('Could not identify user tenant. Please log in again.');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = uuidRegex.test(tenantId);
    
    console.log('🔍 [HANDLER] Tenant ID validation:', {
      tenantId: tenantId,
      isValidUuid: isValidUuid,
      length: tenantId?.length
    });

    if (!isValidUuid) {
      console.error('❌ [HANDLER] Invalid UUID format for tenantId:', tenantId);
      toast.error('Invalid user session. Please log in again.');
      return;
    }

    // === DEBUG: Log what we're sending to backend ===
    const payload = {
      personaData: simplePersonaInput,
    };
    
    console.log('🚀 [HANDLER] Sending to backend proxy:', {
      payload: payload,
      personaDataLength: simplePersonaInput.length,
      personaDataPreview: simplePersonaInput.substring(0, 100) + '...'
    });

    // The payload is now simpler - tenantId is handled by the backend
    generateMutation.mutate(payload);
  };

  const handleRegenerate = () => {
    console.log('🔄 [HANDLER] Regenerate button clicked');
    
    // Check if tenantId exists and is valid (support both formats)
    const tenantId = user?.tenantId || user?.tenant_id;
    if (!tenantId) {
      console.error('❌ [HANDLER] Missing tenantId in user object');
      toast.error('Could not identify user tenant. Please log in again.');
      return;
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const isValidUuid = uuidRegex.test(tenantId);
    
    if (!isValidUuid) {
      console.error('❌ [HANDLER] Invalid UUID format for tenantId:', tenantId);
      toast.error('Invalid user session. Please log in again.');
      return;
    }

    // Use existing persona data as input for regeneration, or create a basic prompt
    let regenerationInput = '';
    
    if (detailedPersona && detailedPersona.trim()) {
      // Extract key information from existing persona for regeneration
      const existingPersona = detailedPersona;
      regenerationInput = `Regenerate company persona based on existing data: ${existingPersona.substring(0, 500)}...`;
      console.log('🔄 [HANDLER] Using existing persona for regeneration');
    } else {
      // Fallback to a generic regeneration prompt
      regenerationInput = 'Regenerate company persona with updated AI analysis and insights.';
      console.log('🔄 [HANDLER] Using fallback regeneration prompt');
    }

    console.log('🔄 [HANDLER] Regenerating persona with input:', {
      inputLength: regenerationInput.length,
      inputPreview: regenerationInput.substring(0, 100) + '...'
    });

    const payload = {
      personaData: regenerationInput,
    };

    generateMutation.mutate(payload);
  };

  const handleRefresh = () => {
    console.log('🔄 [HANDLER] Refresh button clicked');
    refetch();
    toast.success('Checking for updated persona...');
  };

  const toggleAccordion = (section: string) => {
    console.log('📂 [HANDLER] Toggling accordion section:', section);
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const openEditModal = () => {
    console.log('✏️ [HANDLER] Opening edit modal');
    console.log('✏️ [HANDLER] Setting editing persona length:', detailedPersona.length);
    setEditingPersona(detailedPersona);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    console.log('✏️ [HANDLER] Closing edit modal');
    setIsEditModalOpen(false);
    setEditingPersona('');
  };

  // Check if error is due to no persona existing (404)
  const isNoPersonaError = error?.message?.includes('404') || 
                          error?.message?.includes('PERSONA_NOT_FOUND') ||
                          error?.message?.includes('Company Persona not found');

  console.log('🎯 [COMPONENT] Render state:', {
    isLoading,
    isNoPersonaError,
    hasPersonaData: !!personaData,
    isEditModalOpen
  });

  if (isLoading) {
    console.log('⏳ [COMPONENT] Rendering loading state');
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your company persona...</p>
        </div>
      </div>
    );
  }

  // If no persona exists, show the generation form
  if (isNoPersonaError) {
    console.log('📝 [COMPONENT] Rendering no persona state (generation form)');
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-2">
              Create Your Company Persona
            </h1>
            <p className="text-lg text-gray-600">
              Generate your first AI-powered company persona to unlock growth insights
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Brain className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Generate New Persona</h2>
                  <p className="text-sm text-gray-600">Describe your company and target audience</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={simplePersonaInput}
                onChange={(e) => {
                  console.log('📝 [INPUT] Simple persona input changed, length:', e.target.value.length);
                  setSimplePersonaInput(e.target.value);
                }}
                placeholder="e.g., Company: NSC Spinning Mills - Textile manufacturer specializing in sustainable fabrics, melange yarns, and fancy yarns. Certifications: GOTS, GRS. Target: Fashion brands, eco-conscious consumers, B2B textile buyers. Strengths: Fast sampling, quality control, sustainable practices..."
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="mt-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Wand2 className="h-5 w-5" />
                <span>{generateMutation.isPending ? 'Generating...' : 'Generate AI Persona'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If persona exists, show the Persona Hub
  console.log('🏢 [COMPONENT] Rendering persona hub with data');
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header & Actions */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Left Side: Title and Timestamp */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {structuredPersona?.companyName || 'Company'} Persona Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {personaData?.updatedAt ? new Date(personaData.updatedAt).toLocaleString() : 'Never'}
              </p>
            </div>

            {/* Right Side: Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleRegenerate}
                disabled={generateMutation.isPending}
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4" />
                <span>{generateMutation.isPending ? 'Processing...' : 'Regenerate with AI'}</span>
              </button>
              <button
                onClick={openEditModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Persona</span>
              </button>
              <button
                onClick={handleRefresh}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Target Market Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Target Market Sweet Spot</h2>
            </div>
            <ul className="space-y-2 text-gray-600">
              {structuredPersona?.targetMarket && structuredPersona.targetMarket.length > 0 ? (
                structuredPersona.targetMarket.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mt-2 mr-3 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No target market data available</li>
              )}
            </ul>
          </div>

          {/* Executive Summary Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Executive Summary</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {structuredPersona?.executiveSummary || 'No executive summary available.'}
            </p>
          </div>
        </div>

        {/* SWOT Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">SWOT Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SWOTCard
              type="strengths"
              title="Strengths"
              icon={Shield}
              items={structuredPersona?.strengths || []}
            />
            <SWOTCard
              type="weaknesses"
              title="Weaknesses"
              icon={AlertTriangle}
              items={structuredPersona?.weaknesses || []}
            />
            <SWOTCard
              type="opportunities"
              title="Opportunities"
              icon={Zap}
              items={structuredPersona?.opportunities || []}
            />
            <SWOTCard
              type="threats"
              title="Threats"
              icon={AlertCircle}
              items={structuredPersona?.threats || []}
            />
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis</h2>
          </div>
          
          <AccordionItem
            title="Analysis of Production & Quality Capabilities"
            isOpen={openAccordion === 'production'}
            onToggle={() => toggleAccordion('production')}
          >
            <div className="space-y-4">
              {structuredPersona?.productionCapabilities ? (
                <div dangerouslySetInnerHTML={{ __html: structuredPersona.productionCapabilities.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="text-gray-500 italic">No production capabilities data available.</p>
              )}
            </div>
          </AccordionItem>

          <AccordionItem
            title="Analysis of Core Expertise & Market Differentiators"
            isOpen={openAccordion === 'expertise'}
            onToggle={() => toggleAccordion('expertise')}
          >
            <div className="space-y-4">
              {structuredPersona?.coreExpertise ? (
                <div dangerouslySetInnerHTML={{ __html: structuredPersona.coreExpertise.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="text-gray-500 italic">No core expertise data available.</p>
              )}
            </div>
          </AccordionItem>

          <AccordionItem
            title="Market Positioning & Competitive Advantage"
            isOpen={openAccordion === 'positioning'}
            onToggle={() => toggleAccordion('positioning')}
          >
            <div className="space-y-4">
              {structuredPersona?.marketPositioning ? (
                <div dangerouslySetInnerHTML={{ __html: structuredPersona.marketPositioning.replace(/\n/g, '<br/>') }} />
              ) : (
                <p className="text-gray-500 italic">No market positioning data available.</p>
              )}
            </div>
          </AccordionItem>
        </div>
      </div>

      {/* Edit Dialog */}
      <TailwindDialog
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Company Persona"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Persona Content
            </label>
            <textarea
              value={editingPersona}
              onChange={(e) => setEditingPersona(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Enter your company persona content..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeEditModal}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </TailwindDialog>
    </div>
  );
};

export default CompanyPersona; 