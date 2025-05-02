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

let store: Awaited<ReturnType<typeof load>> | null = null;

const init = async () => {
  store = await load(".settings/storage.json");
  const hasData = await store.has("state");
  if (!hasData) {
    await store.set("state", {
      history: [],
      threats: [],
    });
  }
  await store.save();
};

const getState = async (): Promise<PersistedState> => {
  if (!store) await init();
  const state = await store?.get<PersistedState>("state");
  return state || { history: [], threats: [] };
};

const setState = async (state: PersistedState): Promise<void> => {
  if (!store) await init();
  await store?.set("state", state);
  await store?.save();
};

const addToHistory = async (
  item: PersistedState["history"][0]
): Promise<void> => {
  const state = await getState();
  state.history.unshift(item);
  await setState(state);
};

const addThreat = async (
  threat: PersistedState["threats"][0]
): Promise<void> => {
  const state = await getState();
  state.threats.unshift(threat);
  await setState(state);
};

const clearHistory = async (): Promise<void> => {
  const state = await getState();
  state.history = [];
  await setState(state);
};

const clearThreats = async (): Promise<void> => {
  const state = await getState();
  state.threats = [];
  await setState(state);
};

export const storage = {
  init,
  getState,
  setState,
  addToHistory,
  addThreat,
  clearHistory,
  clearThreats,
};
