import { useRef, useState } from "react";

interface DeployFormProps {
  onDeploy: (file: File) => void;
  disabled?: boolean;
}

// WASM binaries start with the magic bytes \0asm.
const WASM_MAGIC = [0x00, 0x61, 0x73, 0x6d];

export function DeployForm({ onDeploy, disabled }: DeployFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selected: File | null) => {
    setError(null);
    setFile(selected);
    if (!selected) return;

    // Validate the WASM magic bytes client-side so bad files fail fast
    // instead of producing cryptic Soroban errors (see ROADMAP.md edge cases).
    selected
      .slice(0, 4)
      .arrayBuffer()
      .then((buf) => {
        const head = new Uint8Array(buf);
        const ok =
          head.length === 4 &&
          head.every((b, i) => b === WASM_MAGIC[i]);
        if (!ok) {
          setFile(null);
          setError("Selected file is not a valid WASM binary.");
        }
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onDeploy(file);
    }
  };

  return (
    <form className="deploy-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="wasm-file">WASM File</label>
        <input
          id="wasm-file"
          ref={inputRef}
          type="file"
          accept=".wasm"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {error && <div className="error">{error}</div>}
      </div>
      <button type="submit" disabled={!file || disabled}>
        Deploy
      </button>
    </form>
  );
}