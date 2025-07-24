# SPIMS Frontend - Comprehensive API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Backend APIs](#backend-apis)
4. [Frontend Components](#frontend-components)
5. [Custom Hooks](#custom-hooks)
6. [Utility Functions](#utility-functions)
7. [Type Definitions](#type-definitions)
8. [Usage Examples](#usage-examples)
9. [Development Setup](#development-setup)

## Project Overview

SPIMS (Supply Chain & Production Intelligence Management System) is a comprehensive manufacturing and business growth platform built with modern web technologies. It includes:

- **Core Manufacturing**: Production tracking, inventory management, order processing
- **Growth Engine**: AI-powered business development with brand discovery, contact enrichment, and automated outreach
- **Analytics**: Performance metrics, production insights, and growth analytics
- **User Management**: Role-based access control and tenant isolation

### Key Features
- Real-time production monitoring
- Automated business development workflows
- AI-powered email generation and reply drafting
- Comprehensive analytics dashboard
- Multi-tenant architecture
- Responsive design with dark/light theme support

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Node.js + Express + Prisma ORM
- **Database**: PostgreSQL (implied from Prisma usage)
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Authentication**: JWT tokens

### Project Structure
```
src/
├── components/           # Reusable React components
│   ├── Marketing/       # Marketing-specific components
│   ├── Fibers/         # Fiber management components
│   ├── Employees/      # Employee management components
│   ├── ui/             # Base UI components
│   └── ...
├── api/                # Frontend API clients
├── hooks/              # Custom React hooks
├── pages/              # Route components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── stores/             # Zustand state stores
└── styles/             # Global styles
```

## Backend APIs

### Authentication APIs

All protected endpoints require a Bearer token in the Authorization header:
```javascript
Authorization: Bearer <jwt_token>
```

### Growth Engine APIs

#### Campaign Management

**Create Growth Campaign**
```http
POST /api/growth/campaigns
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Q1 2024 Textile Expansion",
  "keywords": ["sustainable textiles", "organic cotton", "eco-friendly fabrics"],
  "region": "North America"
}
```

**Response:**
```json
{
  "id": "uuid",
  "tenant_id": "uuid", 
  "name": "Q1 2024 Textile Expansion",
  "keywords": ["sustainable textiles", "organic cotton", "eco-friendly fabrics"],
  "region": "North America",
  "status": "ANALYZING",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "discoveredBrands": []
}
```

**Update Campaign Status**
```http
PUT /api/growth/campaigns/:campaignId/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "ACTIVE"
}
```

**Get Campaign Details**
```http
GET /api/growth/campaigns/:campaignId
Authorization: Bearer <token>
```

**Get Discovered Brands**
```http
GET /api/growth/campaigns/:campaignId/brands
Authorization: Bearer <token>
```

#### Company Persona Management

**Get Company Persona**
```http
GET /api/growth/persona
Authorization: Bearer <token>
```

**Upsert Company Persona**
```http
PUT /api/growth/persona
Content-Type: application/json
Authorization: Bearer <token>

{
  "executiveSummary": "Leading textile manufacturer...",
  "targetMarketSweetSpot": "Sustainable fashion brands...",
  "swotAnalysis": {
    "strengths": ["Quality production", "Sustainable practices"],
    "weaknesses": ["Limited brand awareness"],
    "opportunities": ["Growing eco-fashion market"],
    "threats": ["Price competition"]
  },
  "detailedAnalysis": {
    "productionAndQuality": "State-of-the-art facilities...",
    "marketPositioningAndAdvantage": "Unique sustainability focus...",
    "coreExpertiseAndDifferentiators": "Advanced eco-friendly processes..."
  }
}
```

#### Task Management

**Get Growth Tasks**
```http
GET /api/growth/tasks?status=TODO&priority=HIGH&taskType=REPLY_FOLLOWUP&limit=10
Authorization: Bearer <token>
```

**Create Growth Task**
```http
POST /api/growth/tasks
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Follow up with ABC Fashion",
  "description": "Discuss Q2 partnership opportunities",
  "priority": "HIGH",
  "taskType": "GENERAL",
  "dueDate": "2024-02-01T09:00:00Z"
}
```

**Update Growth Task**
```http
PUT /api/growth/tasks/:taskId
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "IN_PROGRESS",
  "priority": "MEDIUM"
}
```

#### Analytics APIs

**Get Analytics Dashboard**
```http
GET /api/growth/analytics/dashboard?timeframe=30d
Authorization: Bearer <token>
```

**Get Campaign Analytics**
```http
GET /api/growth/analytics/campaigns
Authorization: Bearer <token>
```

**Get Growth Metrics**
```http
GET /api/growth/analytics/growth-metrics?timeframe=90d
Authorization: Bearer <token>
```

## Frontend Components

### Core Components

#### GrowthTaskManager

A comprehensive task management component for handling growth-related tasks.

```tsx
import { GrowthTaskManager } from '../components/GrowthTaskManager';

// Basic usage
<GrowthTaskManager />

// Reply tasks only
<GrowthTaskManager 
  showOnlyReplyTasks={true}
  showCreateButton={false}
  maxTasks={5}
/>
```

**Props:**
- `showOnlyReplyTasks?: boolean` - Filter to show only reply follow-up tasks
- `showCreateButton?: boolean` - Show/hide the create task button
- `maxTasks?: number` - Limit the number of tasks displayed

**Features:**
- Real-time task updates every 15 seconds
- AI reply generation integration
- Task filtering by status and priority
- Inline task editing and status updates
- Delete confirmation

#### AIReplyModal

Modal component for AI-powered reply generation and management.

```tsx
import { AIReplyModal } from '../components/AIReplyModal';

<AIReplyModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  task={selectedTask}
  onTaskUpdate={handleTaskUpdate}
/>
```

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Close handler
- `task: GrowthTask` - Task object for reply generation
- `onTaskUpdate: () => void` - Callback when task is updated

#### DataTable

Generic data table component with sorting, filtering, and pagination.

```tsx
import { DataTable } from '../components/DataTable';

<DataTable
  data={orders}
  columns={orderColumns}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  sortField={sortField}
  sortDirection={sortDirection}
  onSort={handleSort}
/>
```

#### Modal

Reusable modal wrapper component.

```tsx
import { Modal } from '../components/Modal';

<Modal isOpen={isOpen} onClose={onClose} title="Create Order">
  <OrderForm onSubmit={handleSubmit} />
</Modal>
```

#### ThemeSelector

Theme switching component supporting light, dark, and auto modes.

```tsx
import { ThemeSelector } from '../components/ThemeSelector';

<ThemeSelector />
```

### Page Components

#### Dashboard
Main dashboard with production metrics, orders overview, and quick actions.

#### GrowthEngine
Growth Engine dashboard with campaign overview and analytics.

#### CompanyPersona
Company persona management interface.

#### BrandDiscovery
Brand discovery campaign management.

#### TaskManagement
Comprehensive task management interface.

## Custom Hooks

### useThemeStore

Zustand store hook for theme management.

```tsx
import { useThemeStore } from '../hooks/useThemeStore';

function MyComponent() {
  const { theme, setTheme } = useThemeStore();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Switch to Dark Theme
    </button>
  );
}
```

**Methods:**
- `theme: 'light' | 'dark' | 'auto'` - Current theme
- `setTheme(theme)` - Updates theme and persists to localStorage

### useOptimizedToast

Optimized toast notifications hook.

```tsx
import { useOptimizedToast } from '../hooks/useOptimizedToast';

function MyComponent() {
  const toast = useOptimizedToast();
  
  const handleSuccess = () => {
    toast.success('Operation completed successfully!');
  };
  
  const handleError = () => {
    toast.error('Something went wrong');
  };
}
```

### usePageTitle

Hook for setting page titles.

```tsx
import { usePageTitle } from '../hooks/usePageTitle';

function OrdersPage() {
  usePageTitle('Orders Management');
  
  return <div>Orders content...</div>;
}
```

### useTenantStore

Tenant management store.

```tsx
import { useTenantStore } from '../hooks/useTenantStore';

function MyComponent() {
  const { tenantId, setTenantId } = useTenantStore();
  
  return <div>Current tenant: {tenantId}</div>;
}
```

## Utility Functions

### OCR Utilities

#### extractTextWithTesseract

Extract text from images using Tesseract.js.

```tsx
import { extractTextWithTesseract } from '../utils/ocr';

async function processImage(imageFile: File) {
  try {
    const imageUrl = URL.createObjectURL(imageFile);
    const extractedText = await extractTextWithTesseract(imageUrl);
    console.log('Extracted text:', extractedText);
  } catch (error) {
    console.error('OCR failed:', error);
  }
}
```

### PDF Utilities

#### generatePDF

Generate PDF documents from data.

```tsx
import { generatePDF } from '../utils/pdf/generator';

const exportToPDF = async (data: OrderData[]) => {
  try {
    await generatePDF({
      title: 'Orders Report',
      data: data,
      columns: ['orderId', 'buyer', 'quantity', 'status'],
      filename: 'orders-report.pdf'
    });
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
};
```

### Data Processing

#### normalizeOrders

Normalize order data for consistent structure.

```tsx
import { normalizeOrders } from '../utils/normalizeOrders';

const processOrderData = (rawOrders: any[]) => {
  const normalizedOrders = normalizeOrders(rawOrders);
  return normalizedOrders;
};
```

#### computePendingFibres

Calculate pending fiber requirements.

```tsx
import { computePendingFibres } from '../utils/computePendingFibres';

const PendingFibersCard = ({ orders, inventory }) => {
  const pendingFibers = computePendingFibres(orders, inventory);
  
  return (
    <div>
      <h3>Pending Fiber Requirements</h3>
      {pendingFibers.map(fiber => (
        <div key={fiber.id}>
          {fiber.type}: {fiber.quantity} {fiber.unit}
        </div>
      ))}
    </div>
  );
};
```

## Type Definitions

### Growth Engine Types

#### GrowthCampaign
```typescript
interface GrowthCampaign {
  id: string;
  tenant_id: string;
  name: string;
  keywords: string[];
  region?: string;
  status: 'DRAFT' | 'ANALYZING' | 'READY_FOR_OUTREACH' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  discoveredBrands?: DiscoveredBrand[];
}
```

#### DiscoveredBrand
```typescript
interface DiscoveredBrand {
  id: string;
  campaignId: string;
  companyName: string;
  website?: string;
  productFitAnalysis: string;
  discoverySource?: string;
  status: 'DISCOVERED' | 'SUPPLIERS_IDENTIFIED' | 'CONTACTS_ENRICHED' | 'CONTACTED' | 'RESPONDED' | 'QUALIFIED' | 'CONVERTED';
  createdAt: string;
  updatedAt: string;
  discoveredSuppliers?: DiscoveredSupplier[];
}
```

#### GrowthTask
```typescript
interface GrowthTask {
  id: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  taskType: 'REPLY_FOLLOWUP' | 'GENERAL';
  assignedUserId?: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // Reply-specific context
  originalEmailId?: string;
  contactId?: string;
  contactName?: string;
  contactEmail?: string;
  companyName?: string;
  campaignId?: string;
  campaignName?: string;
  replySubject?: string;
}
```

#### CompanyPersona
```typescript
interface CompanyPersona {
  id: string;
  tenant_id: string;
  executiveSummary: string;
  targetMarketSweetSpot: string;
  swotAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  detailedAnalysis: {
    productionAndQuality?: string;
    marketPositioningAndAdvantage?: string;
    coreExpertiseAndDifferentiators?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Core Types

#### Order
```typescript
interface Order {
  id: string;
  buyerId: string;
  orderNumber: string;
  quantity: number;
  status: 'pending' | 'in_progress' | 'completed' | 'dispatched';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Production
```typescript
interface Production {
  id: string;
  date: string;
  section: string;
  machine: string;
  quantity: number;
  quality: string;
  efficiency: number;
  downtime?: number;
  operator: string;
  shift: 'morning' | 'evening' | 'night';
}
```

#### DashboardSummary
```typescript
interface DashboardSummary {
  orders: {
    totalOrders: number;
    statusBreakdown: {
      pending: number;
      in_progress: number;
      completed: number;
      dispatched: number;
    };
    pendingOrders: number;
    overdueOrders: number;
  };
  production: ProductionSummary;
  financial: {
    receivables?: {
      total: number;
      overdue: number;
    };
    payables?: {
      total: number;
      overdue: number;
    };
  };
}
```

## Usage Examples

### Complete Growth Campaign Workflow

```tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getGrowthCampaigns, 
  createGrowthCampaign, 
  getCampaignDetails,
  updateCampaignStatus 
} from '../api/growth';

function CampaignManager() {
  const queryClient = useQueryClient();
  
  // Fetch campaigns
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['growth-campaigns'],
    queryFn: getGrowthCampaigns,
    refetchInterval: 30000 // Refetch every 30 seconds
  });
  
  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: createGrowthCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['growth-campaigns'] });
      toast.success('Campaign created successfully!');
    }
  });
  
  const handleCreateCampaign = async (data: CreateCampaignRequest) => {
    await createCampaignMutation.mutateAsync(data);
  };
  
  const handleStatusUpdate = async (campaignId: string, status: string) => {
    await updateCampaignStatus(campaignId, status);
    queryClient.invalidateQueries({ queryKey: ['growth-campaigns'] });
  };
  
  if (isLoading) return <div>Loading campaigns...</div>;
  
  return (
    <div>
      <h1>Growth Campaigns</h1>
      
      {/* Campaign Form */}
      <CampaignForm onSubmit={handleCreateCampaign} />
      
      {/* Campaign List */}
      {campaigns?.map(campaign => (
        <CampaignCard 
          key={campaign.id}
          campaign={campaign}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
  );
}
```

### Task Management with AI Integration

```tsx
import React, { useState } from 'react';
import { GrowthTaskManager } from '../components/GrowthTaskManager';
import { AIReplyModal } from '../components/AIReplyModal';

function TaskDashboard() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  
  const handleAIReply = (task: GrowthTask) => {
    setSelectedTask(task);
    setShowAIModal(true);
  };
  
  return (
    <div className="space-y-6">
      {/* High Priority Reply Tasks */}
      <div>
        <h2>Urgent Reply Follow-ups</h2>
        <GrowthTaskManager 
          showOnlyReplyTasks={true}
          maxTasks={5}
          showCreateButton={false}
        />
      </div>
      
      {/* All Tasks */}
      <div>
        <h2>All Growth Tasks</h2>
        <GrowthTaskManager />
      </div>
      
      {/* AI Reply Modal */}
      {showAIModal && selectedTask && (
        <AIReplyModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          task={selectedTask}
          onTaskUpdate={() => {
            // Refresh tasks
            setShowAIModal(false);
          }}
        />
      )}
    </div>
  );
}
```

### Analytics Dashboard Implementation

```tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getAnalyticsDashboard, 
  getCampaignAnalytics,
  getGrowthMetrics 
} from '../api/growth';

function AnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');
  
  const { data: dashboard } = useQuery({
    queryKey: ['analytics-dashboard', timeframe],
    queryFn: () => getAnalyticsDashboard(timeframe)
  });
  
  const { data: campaignAnalytics } = useQuery({
    queryKey: ['campaign-analytics'],
    queryFn: getCampaignAnalytics
  });
  
  const { data: growthMetrics } = useQuery({
    queryKey: ['growth-metrics', timeframe],
    queryFn: () => getGrowthMetrics(timeframe)
  });
  
  return (
    <div className="space-y-6">
      {/* Timeframe Selector */}
      <div>
        <select 
          value={timeframe} 
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Campaigns" 
          value={dashboard?.overview.totalCampaigns} 
        />
        <MetricCard 
          title="Total Contacts" 
          value={dashboard?.overview.totalContacts} 
        />
        <MetricCard 
          title="Reply Rate" 
          value={dashboard?.performance.replyRate} 
        />
        <MetricCard 
          title="Active Contacts" 
          value={dashboard?.overview.activeContacts} 
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrowthChart data={growthMetrics?.timeSeries} />
        <CampaignPerformanceChart data={campaignAnalytics?.campaigns} />
      </div>
    </div>
  );
}
```

### Theme Management

```tsx
import React from 'react';
import { useThemeStore } from '../hooks/useThemeStore';

function Header() {
  const { theme, setTheme } = useThemeStore();
  
  return (
    <header className="bg-white dark:bg-gray-800 border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <h1>SPIMS Dashboard</h1>
        
        <div className="flex items-center space-x-4">
          {/* Theme Selector */}
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-1 border rounded dark:bg-gray-700"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
      </div>
    </header>
  );
}
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (for backend)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd spims-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_ENABLE_GROWTH_ENGINE=true
```

4. **Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
```

6. **Linting and Type Checking**
```bash
npm run lint
npm run type-check
```

### Project Configuration

#### Vite Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

#### TypeScript Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### Tailwind Configuration (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

### API Integration

#### Axios Configuration (`src/api/axios.ts`)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 30000,
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Testing

#### Unit Tests
```bash
npm run test
```

#### E2E Tests
```bash
npm run test:e2e
```

#### Test Configuration
Create test utilities in `src/test/utils.tsx`:
```typescript
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
}
```

### Deployment

#### Build Optimization
The project is configured for optimal production builds:
- Code splitting by routes
- Tree shaking for unused code elimination
- Asset optimization and compression
- TypeScript type checking

#### Environment Variables
Production environment variables:
```env
VITE_API_BASE_URL=https://api.yourapp.com
VITE_ENABLE_GROWTH_ENGINE=true
VITE_SENTRY_DSN=your-sentry-dsn
```

## 📧 Email Templates

### Template Variables

Email templates support the following variables that are automatically replaced when emails are sent:

- `{{{RESEND_UNSUBSCRIBE_URL}}}` - Automatically replaced with Resend's unsubscribe URL for each recipient
- `{{{FIRST_NAME}}}` - Recipient's first name (if available)
- `{{{LAST_NAME}}}` - Recipient's last name (if available)
- `{{{EMAIL}}}` - Recipient's email address

### Unsubscribe Compliance

All email templates automatically include an unsubscribe link for compliance with email marketing regulations. The unsubscribe link is added automatically if not present in the template content.

**Example template with unsubscribe link:**
```html
<p>Hi {{{FIRST_NAME|there}}},</p>
<p>Thank you for your interest in our products!</p>

<br><br>
<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
<p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">
  You can unsubscribe from these emails at any time by clicking 
  <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color: #3b82f6; text-decoration: underline;">here</a>.
</p>
```

## 📧 **Email Validation & CSV Upload**

### **Email Validation System**

The system now includes comprehensive email validation during CSV uploads:

#### **Validation Features:**
- **Format Validation**: Checks email syntax using regex pattern
- **Common Typo Correction**: Automatically fixes common domain typos:
  - `gmil.com` → `gmail.com`
  - `gmial.com` → `gmail.com`
  - `hotmal.com` → `hotmail.com`
  - `yaho.com` → `yahoo.com`
  - `outlok.com` → `outlook.com`
  - And many more...

#### **Validation Process:**
1. **Pre-validation**: Each email is checked for format and common typos
2. **Auto-correction**: Valid emails with typos are automatically corrected
3. **Filtering**: Invalid emails are skipped with detailed error messages
4. **Feedback**: Users receive comprehensive validation reports

#### **Validation Response:**
```typescript
interface ValidationResult {
  validEmails: string[];
  correctedEmails: Array<{ original: string; corrected: string }>;
  invalidEmails: Array<{ email: string; error: string }>;
  summary: {
    total: number;
    valid: number;
    corrected: number;
    invalid: number;
  };
}
```

### **CSV Upload with Validation**

#### **Enhanced CSV Upload Modal**
- **Real-time validation** during file processing
- **Visual feedback** with statistics and corrections
- **Detailed error reporting** for invalid emails
- **Auto-correction display** showing what was fixed

#### **CSV Format Support:**
- **Required**: `email` column
- **Optional**: `name`, `first_name`, `last_name`, `company` columns
- **Auto-generation**: Missing names/companies generated from email domain
- **Flexible headers**: Supports various column name variations

#### **Upload Process:**
1. **File Selection**: User uploads CSV file
2. **Parsing**: System parses CSV and extracts emails
3. **Validation**: Each email validated and corrected
4. **Feedback**: User sees validation results
5. **Creation**: Only valid emails added to mailing list

#### **User Experience:**
- **Instant feedback** on validation results
- **Clear statistics** showing total, valid, corrected, and invalid counts
- **Detailed corrections** list showing what was auto-fixed
- **Error explanations** for invalid emails
- **Progress indicators** during processing

### **Backend Integration**

#### **Email Validation Service**
```javascript
// Validate single email
const result = preValidateEmail(email);

// Validate batch of emails
const batchResult = validateEmailBatch(emails);

// Get user-friendly feedback
const feedback = getValidationFeedback(batchResult);
```

#### **Mailing List Creation with Validation**
- **Pre-validation** of all emails before Resend API calls
- **Automatic correction** of common typos
- **Filtering** of invalid emails
- **Detailed logging** of validation results
- **Error handling** for validation failures

#### **Rate Limit Compliance**
- **Sequential Processing**: All Resend API calls processed sequentially to avoid rate limits
- **Smart Delays**: 550ms delays between mailing list operations
- **Batch Processing**: Contact operations batched with 50ms delays between individual items
- **Error Resilience**: Individual failures don't stop entire operations
- **Detailed Logging**: Comprehensive audit trail of all API interactions

#### **Benefits:**
- **Improved deliverability** through email validation
- **Reduced bounce rates** from corrected typos
- **Better user experience** with immediate feedback
- **Data quality** improvement at upload time
- **Cost savings** by filtering invalid emails early
- **Rate limit compliance** preventing 429 errors
- **Reliable operations** with sequential processing

This documentation covers all major APIs, components, and functions in the SPIMS project. For additional details on specific components or APIs, refer to the inline code documentation and TypeScript definitions within the source files.