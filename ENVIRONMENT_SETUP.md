# Frontend Environment Setup

## Environment Variables

Create a `.env` file in the frontend root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5001

# For Production
# VITE_API_BASE_URL=https://your-backend-domain.com
```

## Development Setup

1. **Local Development**:
   ```bash
   # Backend should be running on port 5001
   VITE_API_BASE_URL=http://localhost:5001
   ```

2. **Production**:
   ```bash
   # Update to your actual backend URL
   VITE_API_BASE_URL=https://your-backend-domain.com
   ```

## Resend Integration Status

### ✅ Working Features:
- Email campaign creation and sending
- Real-time email analytics
- Webhook event tracking
- Bounce management
- Campaign performance metrics

### 🔧 Configuration Required:
- Backend webhook secret (see backend setup)
- Resend API key (configured in backend)
- Production domain for webhooks

## Testing the Integration

1. **Start both servers**:
   ```bash
   # Backend (port 5001)
   cd ../Dhya-SPIMS-Backend-Prod
   npm run dev

   # Frontend (port 5173)
   cd ../Dhya-SPIMS-Frontend-Prod
   npm run dev
   ```

2. **Test email sending**:
   - Go to Marketing → Bulk Email
   - Create a new campaign
   - Send test emails
   - Check analytics in real-time

3. **Verify webhooks**:
   - Check backend logs for webhook events
   - View analytics in the Email Analytics panel
   - Monitor bounce management

## Troubleshooting

### Common Issues:

1. **API Connection Errors**:
   - Verify `VITE_API_BASE_URL` is correct
   - Ensure backend is running
   - Check CORS configuration

2. **Email Not Sending**:
   - Check backend logs for Resend API errors
   - Verify `RESEND_API_KEY_SPIMS` is set
   - Check email template configuration

3. **Analytics Not Updating**:
   - Verify webhook endpoint is accessible
   - Check webhook secret configuration
   - Monitor backend logs for webhook events

### Debug Commands:

```bash
# Check frontend build
npm run build

# Check TypeScript errors
npx tsc --noEmit

# Test API connection
curl http://localhost:5001/api/webhooks/analytics
``` 