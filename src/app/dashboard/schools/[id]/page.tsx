// Server component — required for static export with generateStaticParams
import SchoolDetailClient from './SchoolDetailClient';

// Pre-generate pages for all 20 schools (sch-1 to sch-20)
export function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({ id: `sch-${i + 1}` }));
}

export default function SchoolDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <SchoolDetailClient id={params.id} />;
}
