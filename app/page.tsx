export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">
        Next.js revalidatePath Bug with Dynamic Routes
      </h1>
      
      <div className="prose prose-gray max-w-none">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important: Production Mode Required</h3>
          <p className="text-yellow-800 text-sm">
            This bug only occurs in production builds. In development mode, all pages are 
            generated on-demand. Run <code className="bg-yellow-100 px-1 rounded">pnpm build && pnpm start</code> to reproduce.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">The Bug</h2>
        <p className="text-gray-700 mb-6">
          <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">revalidatePath()</code> completely fails to clear the cache 
          for specific dynamic routes. This affects ANY dynamic route, including ISR.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <h3 className="font-semibold text-red-900 mb-3 text-lg">❌ App Router (Broken)</h3>
            <p className="text-red-800 mb-3">
              <code className="bg-red-100 px-2 py-1 rounded font-mono text-sm">{`revalidatePath('/s/{subdomain}')`}</code> does nothing.
            </p>
            <p className="text-red-700 text-sm">
              Cache remains stale. Page shows 404 forever.
            </p>
          </div>

          <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-3 text-lg">✅ Pages Router (Works)</h3>
            <p className="text-green-800 mb-3">
              <code className="bg-green-100 px-2 py-1 rounded font-mono text-sm">{`res.revalidate('/s/{subdomain}')`}</code> works perfectly.
            </p>
            <p className="text-green-700 text-sm">
              Cache is cleared. Page loads immediately.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800">
            <code className="bg-blue-100 px-2 py-1 rounded font-mono text-sm">revalidatePath</code> should work exactly like <code className="bg-blue-100 px-2 py-1 rounded font-mono text-sm">res.revalidate</code> but it doesn't. 
            Using a Pages Router API route as a workaround shouldn't be necessary.
          </p>
        </div>


      </div>
    </div>
  );
}