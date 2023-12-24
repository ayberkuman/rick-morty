import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen max-w-screen-xl mx-auto p-24">
        {children}
      </div>
      <Toaster />
    </Providers>
  );
}
