import { Loading } from '@session/ui/components/loading';
import { SanityStudioSSRPage } from '@session/sanity-cms/components/SanityStudioSSRPage';
import Studio from '@/app/(Sanity)/studio/[[...tool]]/Studio';

export default function StudioPage() {
  return <SanityStudioSSRPage sanityStudio={<Studio />} suspenseFallback={<Loading />} />;
}
