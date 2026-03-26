export default async function SandboxPage() {
  const res = await fetch("http://localhost:3001/api/health")
  const data = await res.json()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">API Health Check</h1>
      <pre className="mt-4 rounded-md bg-muted p-4">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
