import { SideNav } from "@/components/scrum/side-nav";
import { TopBar } from "@/components/scrum/top-bar";

type NavigationBarProps = {
  children: React.ReactNode;
};

export function NavigationBar({ children }: NavigationBarProps) {
  return (
    <>
      <TopBar />
      <SideNav />
      <div className="min-h-screen pt-16 md:pl-64">{children}</div>
    </>
  );
}
