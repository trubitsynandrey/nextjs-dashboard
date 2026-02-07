import ExpensesTableSkeleton from '@/app/ui/expenses/skeleton';

export default function Loading() {
  return (
    <div className="w-full">
      <div className="mt-10">
        <ExpensesTableSkeleton />
      </div>
    </div>
  );
}
