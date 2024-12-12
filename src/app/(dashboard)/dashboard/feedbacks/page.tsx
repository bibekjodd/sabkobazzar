import Filter from './sections/filter';
import Result from './sections/result';

export default function page() {
  return (
    <div className="px-4 pb-4">
      <Filter />
      <Result />
    </div>
  );
}
