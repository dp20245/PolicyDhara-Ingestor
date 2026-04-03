import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getAllPolicies } from '../lib/data';
import { renderPolicyHtml } from '../lib/rss-content';

export function GET(context: APIContext) {
  const policies = getAllPolicies();

  return rss({
    title: 'PolicyDhara',
    description: 'Auto-updating tracker of Indian development policies across 22 sectors — by ImpactMojo',
    site: context.site?.toString() || 'https://varnasr.github.io/PolicyDhara',
    items: policies.slice(0, 100).map(p => ({
      title: p.title,
      description: `[${p.sectors.join(', ')}] ${p.description}`,
      link: p.link || `https://varnasr.github.io/PolicyDhara/`,
      pubDate: new Date(p.date),
      categories: p.sectors,
      content: renderPolicyHtml(p),
      customData: `<source>${p.source_short}</source><type>${p.type}</type>`,
    })),
    customData: `<language>en-in</language>`,
  });
}
