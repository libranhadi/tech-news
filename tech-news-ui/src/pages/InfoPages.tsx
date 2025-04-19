import { useParams } from 'react-router-dom';
import Welcome from './info/Welcome';

const components: Record<string, React.FC> = {
  welcome: Welcome,
};

export default function InfoPage() {
  const { infoType } = useParams<{ infoType: string }>();
  const Component = components[infoType ?? 'welcome'] ?? (() => <p className="text-center mt-10">Page not found</p>);

  return (
    <div className="mt-4">
      <Component />
    </div>
  );
}
