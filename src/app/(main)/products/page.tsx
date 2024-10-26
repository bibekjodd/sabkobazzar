import { SearchProductsParams } from '@/components/layouts/products-filter-sidebar';
import Client from './client';

export default async function page(props: { searchParams: Promise<SearchProductsParams> }) {
  const searchParams = await props.searchParams;
  return <Client searchParams={searchParams} />;
}
