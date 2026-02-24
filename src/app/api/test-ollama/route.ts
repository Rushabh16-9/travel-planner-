import { NextResponse } from 'next/server';

export async function GET() {
    const model = process.env.OLLAMA_MODEL;
    const results: any = {
        env_model: model || 'NOT_SET',
        connectivity: 'PENDING',
        generation: 'PENDING',
        error: null
    };

    try {
        // 1. Check Connectivity (Scan Hosts)
        const hosts = ["http://localhost:11434", "http://127.0.0.1:11434", "http://[::1]:11434"];
        let workingHost = "";

        for (const host of hosts) {
            try {
                const res = await fetch(`${host}/api/tags`);
                if (res.ok) {
                    workingHost = host;
                    results.working_host = host;
                    results.connectivity = 'OK';
                    const data = await res.json();
                    results.available_models = data.models.map((m: any) => m.name);
                    break;
                }
            } catch (e) {
                results.failed_hosts = [...(results.failed_hosts || []), host];
            }
        }

        if (!workingHost) throw new Error("Could not connect to Ollama on any host (localhost, 127.0.0.1, ::1)");

        if (model) {
            // 2. Check if Model Exists
            const modelExists = results.available_models.some((m: string) => m.includes(model));
            results.model_found = modelExists;

            // 3. Test Generation
            const genStart = Date.now();
            const genRes = await fetch(`${workingHost}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Say "Hello"' }],
                    stream: false
                })
            });

            const genData = await genRes.json();
            results.generation = genRes.ok ? 'OK' : 'FAILED';
            results.latency = `${Date.now() - genStart}ms`;
            results.response = genData.message?.content || genData;
        }

    } catch (e: any) {
        results.error = e.message;
        if (e.cause) results.cause = e.cause;
    }

    return NextResponse.json(results);
}
