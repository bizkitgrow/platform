# ResellPortal Integration & API Reference Guide

This documentation outlines the core APIs, product SKU mappings, webhook callbacks, and test validation structures for integrating with the **ResellPortal** whitelabel backend.

---

## 🛡️ 1. API Authorization & Endpoints

All programmatically executed actions (such as remote workspace activations or domain operations) authenticate using an API key generated in the reseller settings console.

### Authorization Header
Attach the bearer API key to all outbound request headers:
```http
Authorization: Bearer <your_api_key>
Content-Type: application/json
```

### Programmatic Activation Endpoint
To provision a digital asset or service programmatically on behalf of a user:
*   **Method**: `POST`
*   **Endpoint**: `https://panel.resellportal.com/api/v1/services/activate`
*   **Body Payload (JSON)**:
    ```json
    {
      "client_email": "client@example.com",
      "client_name": "Jane Doe",
      "product": "vpn",
      "billing_cycle": "monthly",
      "options": {
        "country": "US"
      }
    }
    ```
*   **Response**: `201 Created` returning the provisioned service parameters.

---

## 📦 2. Product SKU & Configuration Reference

ResellPortal supports a variety of digital assets. Below is the mapping of SKU identifiers, base wholesale costs, and parameters.

### Billing Cycles
*   `monthly`
*   `quarterly`
*   `biannual`
*   `annual`

### Whitelist Core Products & SKUs

| Product SKU | Description | Base Wholesale Cost | Options / Parameters |
| :--- | :--- | :--- | :--- |
| `vpn` | High-speed global VPN service | $6.00 / month | `"country"`: e.g., `"US"`, `"GB"`, `"DE"` |
| `web_hosting` | cPanel SSD Hosting with WordPress | $15.00 / month | N/A |
| `crm` | Customer Relationship Manager | $15.00 / month | N/A |
| `website_builder` | Drag-and-drop AI Web Builder | $10.00 / month | N/A |
| `email_marketing` | Campaign manager & newsletter suite | Tier-dependent | `"tier"`: `"starter"`, `"growth"`, `"pro"`, `"business"` |
| `cloud_storage` | Cloud backup and file sharing | Tier-dependent | N/A |
| `business_phone` | White-label virtual phone number | Tier-dependent | N/A |
| `docsign` | AI contract & document signing | Tier-dependent | N/A |
| `invoice_ai` | AI Invoice & estimate builder | Tier-dependent | N/A |
| `appointments` | Appointment scheduling service | Tier-dependent | N/A |
| `wp_plugin_installer` | WordPress Plugin Installer Pack (1500+) | $10.00 / month | Required options: `"Plugin Name"`, `"Description"`, `"Author Name"`, `"Logo URL"`, `"Their domain"` |
| `social_media_automation` | AI-assisted social posting & scheduling | $15.00 / month | N/A |
| `seo` | Monthly white-label SEO execution | $200.00 / month | N/A |
| `web_design` | Custom WordPress website design | Starting at $50.00 | Topic items determine total cost (e.g. About: +$50, FAQ: +$50, Portfolio: +$75) |

### AI Business Tools Suite Add-ons
The AI Suite base starts at **$5.00 / month** with cumulative cost add-ons:
*   `AI Live Chat Bot`: $15.00 / month
*   `AI FAQ Assistant`: $10.00 / month
*   `AI Lead Capture Bot`: $12.00 / month
*   `AI Appointment Scheduler`: $10.00 / month
*   `AI Product Recommender`: $15.00 / month
*   `AI Business Intelligence`: $20.00 / month
*   `AI Email Auto-Responder`: $8.00 / month
*   `AI CRM Assistant`: $15.00 / month
*   `AI Review Responder`: $10.00 / month
*   `AI Competitor Monitor`: $20.00 / month
*   `AI Market Domination`: $20.00 / month
*   `AI Local Leads Finder`: $18.00 / month
*   `AI Blog Generator`: $12.00 / month
*   `AI Website Health Monitor`: $8.00 / month
*   `AI QR Code Generator`: $5.00 / month

---

## 🪝 3. Webhooks & Callback Telemetry

Storefront webhooks alert external handlers (like the Vercel edge router) of payment validation or activation status changes.

### Signature Validation
ResellPortal includes a verification signature in the header **`X-Webhook-Signature`** using an HMAC-SHA256 hash generated over the raw payload and your webhook secret:
```php
$payload = file_get_contents("php://input");
$expected = hash_hmac("sha256", $payload, $WEBHOOK_SECRET);
if (!hash_equals($expected, $_SERVER["HTTP_X_WEBHOOK_SIGNATURE"])) {
    http_response_code(401);
    exit;
}
```

### Supported Callback Events
*   `service.activated` — Service provisioned successfully (both checkout purchases and manual/API triggers).
*   `service.suspended` — Wallet balance empty or service manually suspended.
*   `service.cancelled` — Service deleted/cancelled.
*   `service.renewed` — Recurring invoice paid and service validity extended.
*   `service.renewal_failed` — Automated renewal charge failed.
*   `client.created` — Client record registered.
*   `deposit.completed` — Reseller wallet top-up successful.
*   `commission.earned` — Affiliate referral payout credited.

### Example Callback Payload
```json
{
  "event": "service.activated",
  "timestamp": "2026-04-25T14:32:00Z",
  "data": {
    "service_id": 1234,
    "client_email": "client@example.com",
    "product": "vpn",
    "billing_cycle": "monthly",
    "options": {
      "country": "US"
    }
  }
}
```

---

## 🧪 4. Testing & Verification

### Webhook Verification
- Navigate to **API Access → Webhooks** in the ResellPortal console.
- Click **`Send Test Event`** to dispatch dummy payloads containing mock checksum headers to your webhook URL.

### Sandbox Payments
- Link Stripe or PayPal developer keys under **Whitelabel Settings → Payments**.
- Submit checkout actions using a secondary (non-reseller) email account to test end-to-end webhook execution without real funds.
