import type { APIRoute, GetStaticPaths } from 'astro';
import { getAllPolicies, getRelatedPolicies, getImpactForPolicy, getAmendmentsForPolicy } from '../../../lib/data';

export const getStaticPaths: GetStaticPaths = () => {
  return getAllPolicies().map(p => ({
    params: { id: p.id },
    props: { policy: p },
  }));
};

export const GET: APIRoute = ({ props }) => {
  const policy = (props as { policy: import('../../../lib/data').PolicyItem }).policy;
  const related = getRelatedPolicies(policy, 5);
  const impact = getImpactForPolicy(policy.title);
  const amendments = getAmendmentsForPolicy(policy.id);

  return new Response(
    JSON.stringify({
      policy,
      impact,
      amendments,
      related: related.map(p => ({ id: p.id, title: p.title, date: p.date, type: p.type })),
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
