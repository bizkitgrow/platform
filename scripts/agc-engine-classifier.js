/**
 * Deterministic keyword-based product classification
 */

const productSkuMap = {
  ai_business_tools_suite: 'rp_sku_b2b_suite_agency',
  invoicing_with_ai: 'rp_sku_invoice_ledger_ai',
  appointment_booking: 'rp_sku_booking_calendar_v1',
  document_signing_software: 'rp_sku_esign_crypto_secure',
  crm_system: 'rp_sku_crm_multi_tenant',
  reputation_management: 'rp_sku_reputation_gmb_auto',
  vpn_service: 'rp_sku_vpn_secure_edge',
  business_phone_number: 'rp_sku_voip_us_uk',
  esim_data_plans: 'rp_sku_esim_global_v1',
  domain_registration: 'rp_sku_domain_registry',
  cloud_storage: 'rp_sku_cloud_storage_redundant',
  ai_website_builder: 'rp_sku_website_builder_ai',
  wordpress_plugin_installer_pack: 'rp_sku_wp_plugin_bundle',
  web_hosting: 'rp_sku_hosting_container_isolated',
  web_design_service: 'rp_sku_design_task_fixed',
  email_marketing: 'rp_sku_email_drip_sequence',
  smm_services: 'rp_sku_smm_signals_pack',
  social_media_automation: 'rp_sku_social_cron_engine',
  link_in_bio: 'rp_sku_linktree_premium_canvas',
  monthly_seo_service: 'rp_sku_seo_hyperlocal_pack',
};

/**
 * Classify article into one of 20 product + route combinations.
 * @param {string} title
 * @param {string} content
 * @returns {{ key: string, sku: string, category_slug: string }}
 */
function getProductAndRoute(title, content) {
  const text = `${title} ${content}`.toLowerCase();
  let key = 'ai_business_tools_suite';
  let category_slug = 'operational-automation';

  // --- PILLAR 1: Connectivity & Mobility ---
  if (text.includes('esim') || text.includes('sim card') || text.includes('roaming')) {
    key = 'esim_data_plans';
    category_slug = 'connectivity-mobility';
  } else if (text.includes('vpn') || text.includes('proxy') || text.includes('cybersecurity')) {
    key = 'vpn_service';
    category_slug = 'connectivity-mobility';
  } else if (
    text.includes('phone number') ||
    text.includes('virtual number') ||
    text.includes('voip')
  ) {
    key = 'business_phone_number';
    category_slug = 'connectivity-mobility';
  } else if (text.includes('cloud storage') || text.includes('backup') || text.includes('drive')) {
    key = 'cloud_storage';
    category_slug = 'connectivity-mobility';
  }
  // --- PILLAR 2: Growth & Marketing ---
  else if (
    text.includes('gmb') ||
    text.includes('google maps') ||
    text.includes('review') ||
    text.includes('reputation')
  ) {
    key = 'reputation_management';
    category_slug = 'local-authority';
  } else if (text.includes('seo') || text.includes('backlink') || text.includes('serp')) {
    key = 'monthly_seo_service';
    category_slug = 'local-authority';
  } else if (text.includes('website builder') || text.includes('landing page')) {
    key = 'ai_website_builder';
    category_slug = 'local-authority';
  } else if (text.includes('domain') || text.includes('tld')) {
    key = 'domain_registration';
    category_slug = 'local-authority';
  } else if (text.includes('hosting') || text.includes('vps') || text.includes('cpanel')) {
    key = 'web_hosting';
    category_slug = 'local-authority';
  } else if (text.includes('web design') || text.includes('ui ux')) {
    key = 'web_design_service';
    category_slug = 'local-authority';
  } else if (text.includes('social media automation') || text.includes('buffer')) {
    key = 'social_media_automation';
    category_slug = 'local-authority';
  } else if (text.includes('followers') || text.includes('likes') || text.includes('smm')) {
    key = 'smm_services';
    category_slug = 'local-authority';
  } else if (text.includes('link in bio') || text.includes('linktree')) {
    key = 'link_in_bio';
    category_slug = 'local-authority';
  }
  // --- PILLAR 3: Operational Automation ---
  else if (text.includes('crm') || text.includes('customer relationship')) {
    key = 'crm_system';
    category_slug = 'operational-automation';
  } else if (text.includes('invoice') || text.includes('billing') || text.includes('payment')) {
    key = 'invoicing_with_ai';
    category_slug = 'operational-automation';
  } else if (
    text.includes('booking') ||
    text.includes('appointment') ||
    text.includes('calendar')
  ) {
    key = 'appointment_booking';
    category_slug = 'operational-automation';
  } else if (text.includes('esign') || text.includes('signature') || text.includes('contract')) {
    key = 'document_signing_software';
    category_slug = 'operational-automation';
  } else if (text.includes('wordpress') || text.includes('wp plugin')) {
    key = 'wordpress_plugin_installer_pack';
    category_slug = 'operational-automation';
  } else if (text.includes('email marketing') || text.includes('newsletter')) {
    key = 'email_marketing';
    category_slug = 'operational-automation';
  }

  return {
    key,
    sku: productSkuMap[key] || 'rp_sku_b2b_suite_agency',
    category_slug,
  };
}

module.exports = { getProductAndRoute };
