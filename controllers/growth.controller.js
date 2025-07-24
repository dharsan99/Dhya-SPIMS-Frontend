/**
 * Create a new Growth Campaign
 */
exports.createGrowthCampaign = async (req, res) => {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'Missing tenant ID in token' });
    }

    const { name, keywords, region } = req.body;

    if (!name || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ 
        error: 'Name and keywords array are required' 
      });
    }

    console.log(`🚀 [GROWTH] Creating campaign for tenant: ${tenantId}`, { name, keywords, region });

    const campaign = await prisma.growthCampaign.create({
      data: {
        tenantId: tenantId,
        name,
        keywords,
        region,
        status: 'ANALYZING' // Changed from 'DRAFT' to 'ANALYZING' to indicate processing has started
      },
      include: {
        discoveredBrands: true
      }
    });

    console.log(`✅ [GROWTH] Campaign created: ${campaign.id}`);

    // 🚀 NEW: Asynchronously trigger the n8n BrandFinder workflow
    const brandFinderWebhookUrl = process.env.N8N_BRANDFINDER_WEBHOOK_URL;
    if (brandFinderWebhookUrl) {
      console.log(`📡 [GROWTH] Triggering BrandFinder workflow for campaign: ${campaign.id}`);
      
      // Don't await this - let it run in background
      axios.post(brandFinderWebhookUrl, {
        campaignId: campaign.id,
        tenantId: campaign.tenantId,
        name: campaign.name,
        keywords: campaign.keywords,
        region: campaign.region
      }, {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Texintelli-SPIMS/1.0'
        }
      }).then(response => {
        console.log(`✅ [GROWTH] BrandFinder workflow triggered successfully for campaign: ${campaign.id}`, {
          status: response.status,
          statusText: response.statusText
        });
      }).catch(err => {
        console.error(`❌ [GROWTH] Failed to trigger BrandFinder workflow for campaign ${campaign.id}:`, {
          message: err.message,
          code: err.code,
          status: err.response?.status,
          statusText: err.response?.statusText
        });
        
        // Optionally update campaign status to indicate workflow trigger failed
        prisma.growthCampaign.update({
          where: { id: campaign.id },
          data: { status: 'DRAFT' } // Reset to draft if workflow failed
        }).catch(updateErr => {
          console.error(`❌ [GROWTH] Failed to update campaign status after workflow error:`, updateErr.message);
        });
      });
    } else {
      console.warn(`⚠️ [GROWTH] N8N_BRANDFINDER_WEBHOOK_URL not configured - skipping workflow trigger`);
    }

    res.status(201).json(campaign);
  } catch (error) {
    console.error('❌ [GROWTH] Error creating growth campaign:', error);
    res.status(500).json({ 
      error: 'Failed to create growth campaign',
      details: error.message 
    });
  }
};

/**
 * Save discovered brands from n8n workflow (n8n only)
 */
exports.saveDiscoveredBrands = async (req, res) => {
  console.log('💾 [GROWTH] === SAVE DISCOVERED BRANDS REQUEST ===');
  console.log(`💾 [GROWTH] Request body:`, {
    hasBrands: !!req.body.brands,
    brandsCount: req.body.brands?.length || 0,
    campaignId: req.params.campaignId
  });
  
  try {
    const { campaignId } = req.params;
    const { brands } = req.body;

    console.log(`💾 [GROWTH] Saving brands for campaign: ${campaignId}`);

    if (!brands || !Array.isArray(brands)) {
      console.log('❌ [GROWTH] Invalid brands data:', { brands, type: typeof brands });
      return res.status(400).json({ 
        error: 'Brands array is required' 
      });
    }

    // Verify campaign exists
    const campaign = await prisma.growthCampaign.findUnique({
      where: { id: campaignId }
    });

    if (!campaign) {
      console.log(`❌ [GROWTH] Campaign not found: ${campaignId}`);
      return res.status(404).json({ 
        error: 'Campaign not found' 
      });
    }

    console.log(`💾 [GROWTH] Campaign found: ${campaignId}, proceeding to save ${brands.length} brands`);

    // Save brands
    const savedBrands = await Promise.all(
      brands.map(async (brand) => {
        console.log(`💾 [GROWTH] Saving brand: ${brand.brandName}`);
        return prisma.discoveredBrand.create({
          data: {
            campaignId: campaignId,
            brandName: brand.brandName,
            website: brand.website,
            productFitAnalysis: brand.productFitAnalysis,
            status: 'DISCOVERED'
          }
        });
      })
    );

    console.log(`✅ [GROWTH] Saved ${savedBrands.length} brands for campaign: ${campaignId}`);
    console.log('✅ [GROWTH] === SAVE DISCOVERED BRANDS SUCCESS ===');
    
    res.status(201).json({
      message: `Successfully saved ${savedBrands.length} brands`,
      brands: savedBrands
    });
  } catch (error) {
    console.error('❌ [GROWTH] === SAVE DISCOVERED BRANDS ERROR ===');
    console.error('❌ [GROWTH] Error saving discovered brands:', error);
    console.error('❌ [GROWTH] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to save discovered brands',
      details: error.message 
    });
  }
};

/**
 * 🆕 NEW: Get details for a specific campaign with discovered brands
 * Fetches details and discovered brands for a specific campaign.
 * Called by the frontend.
 */
exports.getCampaignDetails = async (req, res) => {
  console.log('🔍 [GROWTH] === GET CAMPAIGN DETAILS REQUEST ===');
  
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      console.log('❌ [GROWTH] Missing tenant ID in token');
      return res.status(400).json({ error: 'Missing tenant ID in token' });
    }

    const { campaignId } = req.params;
    console.log(`🔍 [GROWTH] Fetching details for campaign: ${campaignId}, tenant: ${tenantId}`);

    const campaign = await prisma.growthCampaign.findFirst({
      where: { 
        id: campaignId, 
        tenantId: tenantId // Ensure tenant ownership
      },
      include: {
        discoveredBrands: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!campaign) {
      console.log(`❌ [GROWTH] Campaign not found: ${campaignId} for tenant: ${tenantId}`);
      return res.status(404).json({ 
        error: 'Campaign not found',
        message: 'Campaign not found or you do not have permission to access it.'
      });
    }

    console.log(`✅ [GROWTH] Campaign details retrieved: ${campaignId}`, {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      brandsCount: campaign.discoveredBrands?.length || 0,
      keywordsCount: campaign.keywords?.length || 0
    });
    console.log('✅ [GROWTH] === GET CAMPAIGN DETAILS SUCCESS ===');
    
    res.status(200).json(campaign);
  } catch (error) {
    console.error('❌ [GROWTH] === GET CAMPAIGN DETAILS ERROR ===');
    console.error(`❌ [GROWTH] Error fetching details for campaign ${req.params.campaignId}:`, error);
    console.error('❌ [GROWTH] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch campaign details',
      details: error.message 
    });
  }
};

/**
 * 🔧 INTERNAL SERVICE: Get Company Persona for a specific tenant
 * Fetches a Company Persona for a specific tenant.
 * Called by internal services (n8n) using API key authentication.
 * The tenant ID is provided as a URL parameter.
 */
exports.getPersonaForService = async (req, res) => {
  console.log('🔍 [GROWTH INTERNAL] === GET PERSONA FOR SERVICE REQUEST ===');
  
  const { tenantId } = req.params; // Get tenantId from the URL parameter
  
  console.log(`🔍 [GROWTH INTERNAL] Request details:`, {
    tenantId: tenantId,
    tenantIdType: typeof tenantId,
    hasApiKey: !!req.headers['x-api-key'],
    userAgent: req.headers['user-agent']
  });

  if (!tenantId) {
    console.log('❌ [GROWTH INTERNAL] Missing tenant ID in URL parameter');
    return res.status(400).json({ 
      error: 'Tenant ID is required in the URL path',
      message: 'Please provide tenantId as a URL parameter: /internal/persona/:tenantId' 
    });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(tenantId)) {
    console.log(`❌ [GROWTH INTERNAL] Invalid tenant ID format: ${tenantId}`);
    return res.status(400).json({ 
      error: 'Invalid tenant ID format',
      message: 'Tenant ID must be a valid UUID' 
    });
  }

  try {
    console.log(`🔍 [GROWTH INTERNAL] Fetching persona for tenant: ${tenantId}`);
    
    const persona = await prisma.companyPersona.findUnique({
      where: { tenantId: tenantId },
    });

    if (!persona) {
      console.log(`❌ [GROWTH INTERNAL] Persona not found for tenant: ${tenantId}`);
      return res.status(404).json({ 
        error: 'Company Persona not found',
        message: `Company Persona not found for tenant: ${tenantId}` 
      });
    }

    console.log(`✅ [GROWTH INTERNAL] Persona found for tenant: ${tenantId}`, {
      id: persona.id,
      isActive: persona.isActive,
      createdAt: persona.createdAt,
      updatedAt: persona.updatedAt,
      executiveSummaryLength: persona.executiveSummary?.length || 0,
      targetMarketSweetSpotLength: persona.targetMarketSweetSpot?.length || 0,
      hasSwotAnalysis: !!persona.swotAnalysis,
      hasDetailedAnalysis: !!persona.detailedAnalysis
    });
    console.log('✅ [GROWTH INTERNAL] === GET PERSONA FOR SERVICE SUCCESS ===');
    
    res.status(200).json(persona);
  } catch (error) {
    console.error('❌ [GROWTH INTERNAL] === GET PERSONA FOR SERVICE ERROR ===');
    console.error(`❌ [GROWTH INTERNAL] Error fetching persona for tenant ${tenantId}:`, error);
    console.error('❌ [GROWTH INTERNAL] Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Error fetching company persona',
      message: 'Internal server error while fetching company persona',
      details: error.message 
    });
  }
}; 