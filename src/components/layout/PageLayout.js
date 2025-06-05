import Link from 'next/link';
import Button from '../ui/Button';

const PageLayout = ({ 
  title, 
  children, 
  backHref = '/',
  backLabel = 'Back to Home',
  className = ''
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <Link href={backHref}>
            <Button variant="primary">
              {backLabel}
            </Button>
          </Link>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout; 