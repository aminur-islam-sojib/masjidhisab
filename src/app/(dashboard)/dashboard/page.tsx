import { getMyMosque } from "@/features/Mosque/queries";

export default async function DashboardPage() {
  const mosque = await getMyMosque();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-ink">
          Welcome to {mosque?.name}
        </h1>
        <p className="text-sm text-ink-soft">
          Here is an overview of your mosque&apos;s daily operations and
          finances.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-sage-200/80 shadow-(--shadow-card)">
          <p className="text-xs text-ink-faint font-medium">
            Monthly Collections
          </p>
          <p className="font-heading text-2xl font-bold text-ink mt-1">৳0.00</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sage-200/80 shadow-(--shadow-card)">
          <p className="text-xs text-ink-faint font-medium">Total Expenses</p>
          <p className="font-heading text-2xl font-bold text-ink mt-1">৳0.00</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-sage-200/80 shadow-(--shadow-card)">
          <p className="text-xs text-ink-faint font-medium">Musalli Capacity</p>
          <p className="font-heading text-2xl font-bold text-ink mt-1">
            {mosque?.capacity || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
