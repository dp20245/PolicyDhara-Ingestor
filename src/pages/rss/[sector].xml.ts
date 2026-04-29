import rss from '@astrojs/rss';
import type { APIContext, GetStaticPaths } from 'astro';
import { getAllPolicies, getMeta, getSectorSlug } from '../../lib/data';
import { renderPolicyHtml } from '../../lib/rss-content';

const SITE_URL = 'https://varnasr.github.io/PolicyDhara';

export const getStaticPaths: GetStaticPaths = () => {
  const meta = getMeta();
  const sectors = Object.keys(meta.sector_counts);

  return sectors.map(sector => ({
    params: { sector: getSectorSlug(sector) },
    props: { sectorName: sector },
  }));
};

export function GET(context: APIContext & { props: { sectorName: string } }) {
  const { sectorName } = context.props;
  const sectorSlug = getSectorSlug(sectorName);
  const policies = getAllPolicies()
    .filter(p => p.sector_slugs.includes(sectorSlug))
    .slice(0, 100);
  const base = (import.meta.env.BASE_URL || '/').replace(/\/?$/, '/');
  const siteRoot = context.site
    ? new URL(base, context.site).toString().replace(/\/$/, '')
    : SITE_URL;

  return rss({
    title: `PolicyDhara - ${sectorName}`,
    description: `Indian development policies in the ${sectorName} sector — by ImpactMojo`,
    site: siteRoot,
    items: policies.map(p => ({
      title: p.title,
      description: `[${p.sectors.join(', ')}] ${p.description}`,
      link: p.link || `${siteRoot}/policies/${p.id}/`,
      pubDate: new Date(p.date),
      categories: p.sectors,
      content: renderPolicyHtml(p),
      customData: `<source>${p.source_short}</source><type>${p.type}</type>`,
    })),
    customData: `<language>en-in</language>`,
  });
}
