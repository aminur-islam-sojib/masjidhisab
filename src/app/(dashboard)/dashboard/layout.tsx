export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div    >
      <body className="min-h-full flex flex-col">{children}</body>
    </div>
  );
}