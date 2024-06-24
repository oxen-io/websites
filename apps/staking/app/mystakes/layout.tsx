import ScreenContainer from '@/components/ScreenContainer';

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ScreenContainer>{children}</ScreenContainer>;
}
