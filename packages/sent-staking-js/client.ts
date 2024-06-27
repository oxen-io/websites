import { generateMockNodeData, genereateOpenNodes } from './test';

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
  pubKey: string;
  operatorFee: number;
  minContribution: number;
  maxContribution: number;
  contributors: Contributor[];
  operatorAddress: string;
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
interface Registration {
  type: 'solo' | 'contract';
  operator: string;
  contract?: string;
  pubkey_ed25519: string;
  pubkey_bls: string;
  sig_ed25519: string;
  sig_bls: string;
  timestamp: number;
}

interface LoadRegistrationsResponse {
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

type RequestBody = Record<string, unknown>;

export interface SSBRequestOptions {
  url: string;
  method: HTTPMethod;
  body?: RequestBody;
}

export interface SSBResponse<T> {
  body: T;
  status: number;
  statusText: string;
}

export type SSBRequest = <T>(options: SSBRequestOptions) => Promise<SSBResponse<T>>;

export interface SSBClientConfig {
  baseUrl: string;
  request: SSBRequest;
}

/**
 * Client for interacting with the Session Staking Backend API.
 */
export class SessionStakingClient {
  private baseUrl: string;
  private request: SSBRequest;

  constructor(config: SSBClientConfig) {
    const { baseUrl, request } = config;
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    if (!this.baseUrl || typeof this.baseUrl !== 'string') {
      throw new Error('baseUrl is required and must be a string');
    }

    if (!request || typeof request !== 'function') {
      throw new Error('request is required and must be a function');
    }

    this.request = request;
  }

  /**
   * Retrieves general network information.
   * @returns Network information.
   */
  public async getNetworkInfo(): Promise<SSBResponse<NetworkInfoResponse>> {
    const options: SSBRequestOptions = {
      url: `${this.baseUrl}/info`,
      method: 'GET',
    };
    return this.request<NetworkInfoResponse>(options);
  }

  public async getOpenNodes({
    userAddress,
  }: {
    userAddress: string;
  }): Promise<SSBResponse<GetOpenNodesResponse>> {
    const nodes = genereateOpenNodes({ userAddress });
    return {
      body: { nodes },
      status: 200,
      statusText: 'MOCK',
    };
  }

  /**
   * Retrieves service nodes associated with the given Ethereum wallet address.
   * @param address Ethereum wallet address.
   * @returns Service nodes.
   *
   * @deprecated The response is stubbed with mock data.
   */
  public async getNodesForEthWallet({
    address,
  }: {
    address: string;
  }): Promise<SSBResponse<GetNodesForWalletResponse>> {
    const mockData = generateMockNodeData({ userAddress: address });
    return {
      body: mockData,
      status: 200,
      statusText: 'MOCK',
    };
    /* const options: SSBRequestOptions = {
      url: `${this.baseUrl}/nodes/${address}`,
      method: 'GET',
    };
     return this.request<GetNodesForWalletResponse>(options); */
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
  }): Promise<SSBResponse<GetNodesForWalletResponse>> => this.getNodesForEthWallet({ address });

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
    queryParams: RequestBody;
  }): Promise<SSBResponse<StoreRegistrationResponse>> {
    const options: SSBRequestOptions = {
      url: `${this.baseUrl}/store/${snPubkey}`,
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
  }): Promise<SSBResponse<LoadRegistrationsResponse>> {
    const options: SSBRequestOptions = {
      url: `${this.baseUrl}/registrations/${snPubkey}`,
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
  }): Promise<SSBResponse<LoadRegistrationsResponse>> {
    const options: SSBRequestOptions = {
      url: `${this.baseUrl}/registrations/${operator}`,
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
    queryParams: RequestBody;
  }): Promise<SSBResponse<ValidateRegistrationResponse>> {
    const options: SSBRequestOptions = {
      url: `${this.baseUrl}/validate`,
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
