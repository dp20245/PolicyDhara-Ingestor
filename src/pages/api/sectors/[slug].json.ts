import type { APIRoute, GetStaticPaths } from 'astro';
import { getAllPolicies, getMeta, getSectorSlug, getPoliciesBySector } from '../../../lib/data';

export const getStaticPaths: GetStaticPaths = () => {
  const meta = getMeta();
  return Object.keys(meta.sector_counts).map(sector => ({
    params: { slug: getSectorSlug(sector) },
    props: { sectorName: sector },
  }));
};

export const GET: APIRoute = ({ params, props }) => {
  const slug = params.slug as string;
  const sectorName = (props as { sectorName: string }).sectorName;
  const policies = getPoliciesBySector(slug);

  return new Response(
    JSON.stringify({
      sector: sectorName,
      slug,
      total: policies.length,
      policies,
    }, null, 2),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
};
