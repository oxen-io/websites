/** /info */
interface NetworkInfoResponse {
  network: {
    nettype: string;
    hard_fork: number;
    height: number;
    top_block_hash: string;
    version: string;
    staking_requirement: number;
    min_operator_stake: number;
    max_stakers: number;
  };
  t: number;
}

/** /nodes */
export enum NODE_STATE {
  RUNNING = 'Running',
  AWAITING_CONTRIBUTORS = 'Awaiting Contributors',
  CANCELLED = 'Cancelled',
  DECOMMISSIONED = 'Decommissioned',
  DEREGISTERED = 'Deregistered',
  UNLOCKED = 'Unlocked',
}

export interface LockedContribution {
  amount: number;
  key_image: string;
  key_image_pub_key: string;
}

export interface Contributor {
  address: string;
  amount: number;
  reserved: number;
  locked_contributions: LockedContribution[];
}

export interface GetNodesForWalletResponse {
  nodes: ServiceNode[];
}

export interface ServiceNode {
  state: NODE_STATE;
  service_node_pubkey: string;
  requested_unlock_height: number;
  active: boolean;
  funded: boolean;
  earned_downtime_blocks: number;
  service_node_version: [number, number, number];
  contributors: Contributor[];
  total_contributed: number;
  total_reserved: number;
  staking_requirement: number;
  portions_for_operator: number;
  operator_address: string;
  pubkey_ed25519: string;
  last_uptime_proof: number;
  state_height: number;
  swarm_id: number;
  contribution_open: number;
  contribution_required: number;
  num_contributions: number;
  decomm_blocks_remaining?: number;
  decomm_blocks?: number;
  /** TODO - Add this to the backend api */
  awaiting_liquidation?: boolean;
  //can_restake?: boolean;
}

export interface OpenNode {
  bls_pubkey: string;
  cancelled: boolean;
  contract: string;
  contributions: Array<Contributor>;
  fee: number;
  finalized: boolean;
  service_node_pubkey: string;
  service_node_signature: string;
  total_contributions: number;
}

export interface GetOpenNodesResponse {
  nodes: OpenNode[];
}

/** /store */
interface StoreRegistrationResponse {
  success: boolean;
  registration: {
    type: 'solo' | 'contract';
    operator: string;
    contract?: string;
    pubkey_ed25519: string;
    pubkey_bls: string;
    sig_ed25519: string;
    sig_bls: string;
  };
}

/** /registrations */
export interface Registration {
  type: 'solo' | 'contract';
  operator: string;
  contract?: string;
  pubkey_ed25519: string;
  pubkey_bls: string;
  sig_ed25519: string;
  sig_bls: string;
  timestamp: number;
}

export interface LoadRegistrationsResponse {
  registrations: Registration[];
}

/** /validation */
interface ValidationError {
  code: string;
  error: string;
  detail?: string;
}

interface ValidateRegistrationResponse {
  success?: boolean;
  error?: ValidationError;
  remaining_contribution?: number;
  remaining_spots?: number;
  remaining_min_contribution?: number;
}

/** Client types */
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  endpoint: string;
  method: HTTPMethod;
  body?: BodyInit;
}

export interface StakingBackendResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export type Logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  debug: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  time: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  timeEnd: (data: any) => void;
};

export interface SSBClientConfig {
  baseUrl: string;
  logger?: Logger;
  debug?: boolean;
}

/**
 * Client for interacting with the Session Staking Backend API.
 */
export class SessionStakingClient {
  private readonly baseUrl: string;
  private readonly debug?: boolean;
  private readonly logger: Logger = console;

  constructor(config: SSBClientConfig) {
    const { baseUrl, debug, logger } = config;
    this.debug = debug;

    if (this.debug) {
      this.logger.debug('Initializing session staking backend client');
    }

    if (logger) {
      this.logger = logger;
    }

    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    if (!this.baseUrl) {
      throw new Error('baseUrl is required');
    }
  }

  private async request<T>({
    endpoint,
    method,
    body,
  }: RequestOptions): Promise<StakingBackendResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      if (this.debug) {
        this.logger.time(url);
        if (body) this.logger.debug(body);
      }
      const res = await fetch(url, {
        method,
        body,
      });

      if (!res.ok) {
        throw new Error(`Staking Backend request failed (${res.status}): ${res.statusText}`);
      }

      const data = await res.json();

      return { data, status: res.status, statusText: res.statusText };
    } finally {
      if (this.debug) this.logger.timeEnd(url);
    }
  }

  /**
   * Retrieves general network information.
   * @returns Network information.
   */
  public async getNetworkInfo(): Promise<StakingBackendResponse<NetworkInfoResponse>> {
    const options: RequestOptions = {
      endpoint: `/info`,
      method: 'GET',
    };
    return this.request<NetworkInfoResponse>(options);
  }

  public async getOpenNodes(): Promise<StakingBackendResponse<GetOpenNodesResponse>> {
    const options: RequestOptions = {
      endpoint: `/nodes/open`,
      method: 'GET',
    };
    return this.request<GetOpenNodesResponse>(options);
  }

  /**
   * Retrieves service nodes associated with the given Ethereum wallet address.
   * @param address Ethereum wallet address.
   * @returns Service nodes.
   */
  public async getNodesForEthWallet({
    address,
  }: {
    address: string;
  }): Promise<StakingBackendResponse<GetNodesForWalletResponse>> {
    const options: RequestOptions = {
      endpoint: `/nodes/${address}`,
      method: 'GET',
    };
    return this.request<GetNodesForWalletResponse>(options);
  }

  /**
   * Retrieves service nodes associated with the given Oxen wallet address.
   * @param address Oxen wallet address.
   * @returns Service nodes.
   *
   * @deprecated Use {@link getNodesForEthWallet} instead.
   */
  public getNodesForOxenWallet = async ({
    address,
  }: {
    address: string;
  }): Promise<StakingBackendResponse<GetNodesForWalletResponse>> =>
    this.getNodesForEthWallet({ address });

  /**
   * Stores or replaces the registration details for a service node.
   * @param snPubkey Service node public key (hex).
   * @param queryParams Registration details.
   * @returns Registration response.
   */
  public async storeRegistration({
    snPubkey,
    queryParams,
  }: {
    snPubkey: string;
    queryParams: BodyInit;
  }): Promise<StakingBackendResponse<StoreRegistrationResponse>> {
    const options: RequestOptions = {
      endpoint: `/store/${snPubkey}`,
      method: 'GET',
      body: queryParams,
    };
    return this.request<StoreRegistrationResponse>(options);
  }

  /**
   * Retrieves stored registrations for the given service node public key.
   * @param snPubkey Service node public key (hex).
   * @returns Registrations.
   */
  public async loadRegistrations({
    snPubkey,
  }: {
    snPubkey: string;
  }): Promise<StakingBackendResponse<LoadRegistrationsResponse>> {
    const options: RequestOptions = {
      endpoint: `/registrations/${snPubkey}`,
      method: 'GET',
    };
    return this.request<LoadRegistrationsResponse>(options);
  }

  /**
   * Retrieves stored registrations associated with the given operator wallet.
   * @param operator Operator wallet address (Ethereum).
   * @returns Registrations.
   */
  public async getOperatorRegistrations({
    operator,
  }: {
    operator: string;
  }): Promise<StakingBackendResponse<LoadRegistrationsResponse>> {
    const options: RequestOptions = {
      endpoint: `/registrations/${operator}`,
      method: 'GET',
    };
    return this.request<LoadRegistrationsResponse>(options);
  }

  /**
   * Validates a registration including fee, stakes, and reserved spot requirements.
   * @param queryParams Registration details.
   * @returns Validation response.
   */
  public async validateRegistration({
    queryParams,
  }: {
    queryParams: BodyInit;
  }): Promise<StakingBackendResponse<ValidateRegistrationResponse>> {
    const options: RequestOptions = {
      endpoint: `/validate`,
      method: 'GET',
      body: queryParams,
    };
    return this.request<ValidateRegistrationResponse>(options);
  }
}

export type SessionStakingClientMethodResponseMap = {
  getNetworkInfo: NetworkInfoResponse;
  getNodesForEthWallet: GetNodesForWalletResponse;
  getNodesForOxenWallet: GetNodesForWalletResponse;
  getOpenNodes: GetOpenNodesResponse;
  storeRegistration: StoreRegistrationResponse;
  loadRegistrations: LoadRegistrationsResponse;
  getOperatorRegistrations: LoadRegistrationsResponse;
  validateRegistration: ValidateRegistrationResponse;
};

/**
 * Creates a new instance of the SessionStakingClient.
 *
 * @param config The configuration object for the SSB client.
 * @returns A new instance of the SessionStakingClient.
 */
export const createSessionStakingClient = (config: SSBClientConfig): SessionStakingClient =>
  new SessionStakingClient(config);
