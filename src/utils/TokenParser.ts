import { readFileSync } from 'fs';
import { join } from 'path';
import { TokenResponse } from '../types';

export class TokenParser {
  private wasmModule: WebAssembly.Instance | null = null;
  private wasmMemory: WebAssembly.Memory | null = null;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.initializationPromise = this.initializeWasm();
  }

  private async initializeWasm(): Promise<void> {
    try {
      const wasmPath = join(__dirname, '../data/css.wasm');
      const wasmBuffer = readFileSync(wasmPath);
      const wasmModule = await WebAssembly.instantiate(wasmBuffer);
      this.wasmModule = wasmModule.instance;
      this.wasmMemory = wasmModule.instance.exports
        .memory as WebAssembly.Memory;
    } catch (error) {
      console.error('Failed to initialize WebAssembly module:', error);
      throw new Error('WebAssembly initialization failed');
    }
  }

  private invokeWasmFunction(functionName: string, args: number[]): number {
    if (!this.wasmModule) {
      throw new Error('WebAssembly module not initialized');
    }

    const func = this.wasmModule.exports[functionName] as Function;
    if (!func) {
      throw new Error(`WebAssembly function ${functionName} not found`);
    }

    return func(...args) as number;
  }

  async parseTokenResponse(
    tokenResponse: TokenResponse
  ): Promise<[string, string]> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }

    if (!this.wasmModule) {
      throw new Error('WebAssembly module not initialized');
    }

    // First set of calculations
    const n = this.invokeWasmFunction('cdx', [
      tokenResponse.salt1,
      tokenResponse.salt2,
      tokenResponse.salt3,
      tokenResponse.salt4,
      tokenResponse.salt5,
    ]);

    const l = this.invokeWasmFunction('rdx', [
      tokenResponse.salt1,
      tokenResponse.salt2,
      tokenResponse.salt4,
      tokenResponse.salt3,
      tokenResponse.salt5,
    ]);

    const o = this.invokeWasmFunction('bdx', [
      tokenResponse.salt1,
      tokenResponse.salt2,
      tokenResponse.salt4,
      tokenResponse.salt3,
      tokenResponse.salt5,
    ]);

    const p = this.invokeWasmFunction('ndx', [
      tokenResponse.salt1,
      tokenResponse.salt2,
      tokenResponse.salt4,
      tokenResponse.salt3,
      tokenResponse.salt5,
    ]);

    const q = this.invokeWasmFunction('mdx', [
      tokenResponse.salt1,
      tokenResponse.salt2,
      tokenResponse.salt4,
      tokenResponse.salt3,
      tokenResponse.salt5,
    ]);

    // Second set of calculations
    const a = this.invokeWasmFunction('cdx', [
      tokenResponse.salt2,
      tokenResponse.salt1,
      tokenResponse.salt3,
      tokenResponse.salt5,
      tokenResponse.salt4,
    ]);

    const b = this.invokeWasmFunction('rdx', [
      tokenResponse.salt2,
      tokenResponse.salt1,
      tokenResponse.salt3,
      tokenResponse.salt4,
      tokenResponse.salt5,
    ]);

    const c = this.invokeWasmFunction('bdx', [
      tokenResponse.salt2,
      tokenResponse.salt1,
      tokenResponse.salt4,
      tokenResponse.salt3,
      tokenResponse.salt5,
    ]);

    const d = this.invokeWasmFunction('ndx', [
      tokenResponse.salt2,
      tokenResponse.salt1,
      tokenResponse.salt4,
      tokenResponse.salt3,
      tokenResponse.salt5,
    ]);

    const e = this.invokeWasmFunction('mdx', [
      tokenResponse.salt2,
      tokenResponse.salt1,
      tokenResponse.salt4,
      tokenResponse.salt3,
      tokenResponse.salt5,
    ]);

    const accessToken = tokenResponse.accessToken;
    const refreshToken = tokenResponse.refreshToken;

    // Parse access token
    const parsedAccessToken =
      accessToken.substring(0, n) +
      accessToken.substring(n + 1, l) +
      accessToken.substring(l + 1, o) +
      accessToken.substring(o + 1, p) +
      accessToken.substring(p + 1, q) +
      accessToken.substring(q + 1);

    // Parse refresh token
    const parsedRefreshToken =
      refreshToken.substring(0, a) +
      refreshToken.substring(a + 1, b) +
      refreshToken.substring(b + 1, c) +
      refreshToken.substring(c + 1, d) +
      refreshToken.substring(d + 1, e) +
      refreshToken.substring(e + 1);

    return [parsedAccessToken, parsedRefreshToken];
  }
}
