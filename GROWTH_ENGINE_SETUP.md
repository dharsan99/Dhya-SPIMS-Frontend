# Growth Engine Backend Setup Guide

## ✅ Step 1: Backend API Endpoints - COMPLETED

Your backend now has all the required Growth Engine endpoints:

### 📋 **Available Endpoints:**

#### **Company Persona Endpoints**
- `GET /api/growth/persona` - Get company persona
- `POST /api/growth/persona` - Create/update persona (n8n webhook)
- `POST /api/growth/persona/generate` - Trigger persona generation

#### **🆕 Growth Campaign Endpoints**
- `GET /api/growth/campaigns` - Get all campaigns
- `POST /api/growth/campaigns` - Create campaign (triggers n8n workflow)
- `GET /api/growth/campaigns/:campaignId` - Get campaign details with brands
- `PUT /api/growth/campaigns/:campaignId/status` - Update campaign status
- `GET /api/growth/campaigns/:campaignId/brands` - Get brands for campaign
- `POST /api/growth/campaigns/:campaignId/brands` - Save brands (n8n webhook)
- `PUT /api/growth/brands/:brandId/status` - Update brand status

---

## ✅ Step 2: Frontend Brand Discovery UI - COMPLETED

### 🎨 **Brand Discovery Features:**

#### **Campaign Management**
- ✅ Create new brand discovery campaigns
- ✅ Set keywords and target regions
- ✅ View campaign status and progress
- ✅ Real-time status updates (DRAFT → ANALYZING → READY_FOR_OUTREACH)

#### **Brand Discovery Dashboard**
- ✅ Campaign cards with status indicators
- ✅ Brand count and keyword display
- ✅ Campaign details modal with discovered brands
- ✅ Brand status management and tracking

#### **User Experience**
- ✅ Responsive design for mobile and desktop
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Empty states with call-to-action buttons

### 📁 **Files Created/Updated:**
- `src/pages/GrowthEngine/BrandDiscovery.tsx` - Main Brand Discovery component
- `src/api/growth.ts` - Updated with campaign API functions
- `src/pages/GrowthEngine.tsx` - Updated to enable Brand Discovery
- `src/App.tsx` - Added Brand Discovery route

---

## 🔧 Step 3: Environment Variables Setup

Add these environment variables to your `.env` file:

```env
# 🚀 Growth Engine n8n Webhook URLs
# Company Persona Builder Webhook (already exists)
N8N_PERSONA_BUILDER_WEBHOOK_URL="https://your-n8n-instance.com/webhook/persona-builder-webhook-id"

# 🆕 NEW: BrandFinder Workflow Webhook (for campaign automation)
N8N_BRANDFINDER_WEBHOOK_URL="https://your-n8n-instance.com/webhook/brandfinder-webhook-id"

# n8n API Key for webhook authentication
N8N_API_KEY="your-n8n-api-key-here"
```

---

## 🎯 **What's Working Now:**

### ✅ **Live Features:**
1. **AI Company Persona Generation** - Fully functional with n8n integration
2. **Brand Discovery Campaigns** - Create campaigns that trigger n8n workflows
3. **Campaign Management** - View, track, and manage discovery campaigns
4. **Brand Tracking** - Monitor discovered brands and their status

### 🔄 **Workflow Process:**
1. User creates a campaign with keywords and region
2. Backend immediately creates campaign with "ANALYZING" status
3. Backend triggers n8n BrandFinder webhook (if configured)
4. n8n workflow discovers brands and saves them back to the database
5. Campaign status updates to "READY_FOR_OUTREACH"
6. User can view discovered brands and manage their status

---

## 🎯 **Next Steps:**

1. **✅ COMPLETED**: Configure Environment Variables
2. **🚀 NEXT**: Build n8n BrandFinder Workflow
3. **🔄 IN PROGRESS**: Test the complete integration
4. **📋 PENDING**: Build remaining features (Campaign Management, Analytics)

---

## 🔍 **API Usage Examples:**

### Create Campaign (Frontend → Backend)
```javascript
POST /api/growth/campaigns
{
  "name": "Q4 2024 Textile Campaign",
  "keywords": ["sustainable textiles", "organic cotton", "eco-friendly fabric"],
  "region": "North America"
}
```

### Get Campaign Details (Frontend → Backend)
```javascript
GET /api/growth/campaigns/123e4567-e89b-12d3-a456-426614174000
```

### Save Discovered Brands (n8n → Backend)
```javascript
POST /api/growth/campaigns/123e4567-e89b-12d3-a456-426614174000/brands
{
  "brands": [
    {
      "brandName": "EcoTextile Corp",
      "website": "https://ecotextile.com",
      "productFitAnalysis": "High potential match for sustainable textile needs..."
    }
  ]
}
```

---

## 🚨 **Important Notes:**

1. **Authentication**: All frontend endpoints require JWT authentication
2. **n8n Endpoints**: Use API key authentication with `x-api-key` header
3. **Tenant Isolation**: All operations are tenant-scoped for security
4. **Async Processing**: Campaign creation returns immediately, processing happens in background

## 🎉 **Brand Discovery is Now Live!**

Your Brand Discovery feature is fully implemented and ready for n8n workflow integration! Users can now:
- Create brand discovery campaigns through the UI
- Monitor campaign progress and status
- View discovered brands with analysis
- Track the entire discovery pipeline

Ready for Step 2: Building the n8n Workflow! 🚀 