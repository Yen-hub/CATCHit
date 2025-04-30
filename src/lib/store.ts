import { load } from "@tauri-apps/plugin-store";
import { ThreatStatus } from "@/components/CyberScanResult";

interface PersistedState {
  history: {
    id: number;
    target: string;
    timestamp: string;
    status: ThreatStatus;
    threatType?: string;
  }[];
  threats: {
    id: string;
    type: string;
    target: string;
    timestamp: string;
    status: ThreatStatus;
    details: string;
    securityScore: number;
    metadata: Record<string, any>;
  }[];
}

class StorageService {
  private store: Awaited<ReturnType<typeof load>> | null = null;

  async init() {
    this.store = await load(".settings/storage.json");
    // Initialize with default values if store is empty
    const hasData = await this.store.has("state");
    if (!hasData) {
      await this.store.set("state", {
        history: [],
        threats: [],
      });
    }
    await this.store.save();
  }

  async getState(): Promise<PersistedState> {
    if (!this.store) await this.init();
    const state = await this.store?.get<PersistedState>("state");
    return state || { history: [], threats: [] };
  }

  async setState(state: PersistedState): Promise<void> {
    if (!this.store) await this.init();
    await this.store?.set("state", state);
    await this.store?.save();
  }

  async addToHistory(item: PersistedState["history"][0]): Promise<void> {
    const state = await this.getState();
    state.history.unshift(item);
    await this.setState(state);
  }

  async addThreat(threat: PersistedState["threats"][0]): Promise<void> {
    const state = await this.getState();
    state.threats.unshift(threat);
    await this.setState(state);
  }

  async clearHistory(): Promise<void> {
    const state = await this.getState();
    state.history = [];
    await this.setState(state);
  }

  async clearThreats(): Promise<void> {
    const state = await this.getState();
    state.threats = [];
    await this.setState(state);
  }
}

export const storage = new StorageService();
