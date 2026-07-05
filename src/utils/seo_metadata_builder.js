import brandManifest from '../../config/brand_manifest.json';
import systemArchitecture from '../../config/system_architecture.json';

export function buildAudienceIntentSchema(pillarKey, currentUrl) {
  const cluster = brandManifest.audience_demand_matrix.intent_clusters[pillarKey];
  const brandName = systemArchitecture.tenant_settings.brand_name;
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${currentUrl}#webpage`,
        "url": currentUrl,
        "name": cluster.conversion_copy_tokens.hero_headline,
        "description": cluster.conversion_copy_tokens.subheadline
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `How does ${brandName} secure international business operations?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "By unifying corporate telecom routing, automated localized SEO nodes, and encrypted client operations under an enterprise-grade secure network infrastructure."
            }
          },
          {
            "@type": "Question",
            "name": "Can I white-label the client billing and scheduling experience?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. All client onboarding, AI invoicing, and appointment scheduling are integrated into a clean, unified, professional portal mapped to your custom parameters."
            }
          }
        ]
      }
    ]
  };
}

export function buildProductSchema(productName, metaDesc, currentUrl, productKey, sku) {
  const brandDomain = systemArchitecture.routing_architecture.fulfillment_subdomain.base_checkout_url.replace('/checkout', '');
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": metaDesc,
    "url": currentUrl,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.85",
      "reviewCount": "12"
    },
    "offers": {
      "@type": "Offer",
      "url": `${systemArchitecture.routing_architecture.fulfillment_subdomain.base_checkout_url}?product_id=${sku}`,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    }
  };
}

export function buildLocalBusinessSchema(city, testimonialCompany = 'Acme Corp') {
  const brandName = systemArchitecture.tenant_settings.brand_name;
  const supportEmail = systemArchitecture.tenant_settings.support_email;
  const brandDomain = systemArchitecture.routing_architecture.fulfillment_subdomain.base_checkout_url.replace('/checkout', '');
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": brandName,
    "url": brandDomain,
    "email": supportEmail,
    "priceRange": "$$$",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": "US"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": `Director of Growth at ${testimonialCompany}`
      },
      "reviewBody": `Implementing the reputation management protocols redirected our search authority coordinates in ${city}.`
    }
  };
}
