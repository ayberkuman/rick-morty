import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="min-h-screen md:px-0 md:py-5 md:mr-5">
        {children}
      </div>
      <Toaster />
    </Providers>
  );
}
