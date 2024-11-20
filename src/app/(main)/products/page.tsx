import { SearchProductsParams } from '@/components/filter-products';
import Client from './page.client';

export default async function page(props: { searchParams: Promise<SearchProductsParams> }) {
  const searchParams = await props.searchParams;
  return <Client searchParams={searchParams} />;
}
