const axios = require('axios');

// Test script for brand discovery workflow with structured search parameters
const testBrandDiscovery = async () => {
  const webhookUrl = 'https://your-n8n-instance.com/webhook/6c625654-853a-4689-b4fb-afce19ac8971';
  
  // Structured payload with Apollo search parameters
  const payload = {
    brandId: "c35ab853-f458-4c1a-a5ee-2b958b345a1d",
    companyName: "Fabindia",
    campaignId: "9a7b0053-4aff-4661-96ac-baf5b8feb1b2",
    tenantId: "3bf9bed5-d468-47c5-9c19-61a7e37faedc",
    apolloSearchParams: {
      person_titles: ["sourcing", "merchandising", "fabric", "supply chain"],
      person_seniorities: ["director", "manager", "head"],
      person_functions: ["operations", "purchasing"]
    }
  };

  try {
    console.log('🚀 Testing brand discovery workflow with structured parameters...');
    console.log('📤 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await axios.post(webhookUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SPIMS-BrandDiscovery-Test/1.0'
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('✅ Workflow triggered successfully');
    console.log('📊 Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error triggering workflow:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

// Test different search configurations
const testDifferentConfigurations = async () => {
  const configurations = [
    {
      name: "Sourcing Focus",
      apolloSearchParams: {
        person_titles: ["sourcing", "procurement"],
        person_seniorities: ["director", "manager"]
      }
    },
    {
      name: "Merchandising Focus", 
      apolloSearchParams: {
        person_titles: ["merchandising", "buying"],
        person_seniorities: ["head", "manager"]
      }
    },
    {
      name: "Supply Chain Focus",
      apolloSearchParams: {
        person_titles: ["supply chain", "logistics"],
        person_functions: ["operations"]
      }
    }
  ];

  for (const config of configurations) {
    console.log(`\n🧪 Testing configuration: ${config.name}`);
    try {
      const payload = {
        brandId: "c35ab853-f458-4c1a-a5ee-2b958b345a1d",
        companyName: "Fabindia",
        campaignId: "9a7b0053-4aff-4661-96ac-baf5b8feb1b2",
        tenantId: "3bf9bed5-d468-47c5-9c19-61a7e37faedc",
        apolloSearchParams: config.apolloSearchParams
      };
      
      await testBrandDiscovery(payload);
      console.log(`✅ ${config.name} test completed`);
    } catch (error) {
      console.error(`❌ ${config.name} test failed:`, error.message);
    }
  }
};

// Run tests
if (require.main === module) {
  console.log('🧪 Starting brand discovery workflow tests...\n');
  
  // Test basic functionality
  testBrandDiscovery()
    .then(() => {
      console.log('\n✅ Basic test completed successfully');
      return testDifferentConfigurations();
    })
    .then(() => {
      console.log('\n🎉 All tests completed!');
    })
    .catch(error => {
      console.error('\n💥 Test suite failed:', error.message);
      process.exit(1);
    });
}

module.exports = { testBrandDiscovery, testDifferentConfigurations }; 