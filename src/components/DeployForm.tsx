import { useState } from "react";

interface DeployFormProps {
  onDeploy: (wasmPath: string) => void;
}

export function DeployForm({ onDeploy }: DeployFormProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      // TODO: validate WASM magic bytes before sending
      // A non-WASM file produces cryptic Soroban errors
      onDeploy(file.name);
    }
  };

  return (
    <form className="deploy-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="wasm-file">WASM File</label>
        <input
          id="wasm-file"
          type="file"
          accept=".wasm"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>
      <button type="submit" disabled={!file}>
        Deploy
      </button>
    </form>
  );
}
