export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div
        dangerouslySetInnerHTML={{
          __html:
            '<script id="api-reference" data-url="/api/v1/openapi.json"></script><script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>',
        }}
      />
    </main>
  );
}
