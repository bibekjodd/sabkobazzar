import Client from './client';

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Client productId={id} />;
}
