export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <div className="min-h-full flex flex-col">{children}</div>
    </div>
  );
}
