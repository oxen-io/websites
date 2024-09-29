type NetworkInfo = {
  block_height: number;
  block_timestamp: number;
  block_top_hash: string;
  hard_fork: number;
  max_stakers: number;
  min_operator_stake: number;
  nettype: string;
  staking_requirement: number;
  version: string;
};

/** /info */
interface NetworkInfoResponse {
  network: NetworkInfo;
  t: number;
}

export enum NODE_STATE {
  RUNNING = 'Running',
  AWAITING_CONTRIBUTORS = 'Awaiting Contributors',
  CANCELLED = 'Cancelled',
  DECOMMISSIONED = 'Decommissioned',
  DEREGISTERED = 'Deregistered',
  AWAITING_EXIT = 'Awaiting Exit',
  EXITED = 'Exited',
}

export interface LockedContribution {
  amount: number;
  key_image: string;
  key_image_pub_key: string;
}

export interface Contributor {
  address: string;
  amount: bigint;
  reserved: bigint;
  locked_contributions: LockedContribution[];
}

export interface WalletInfo {
  contract_claimed: bigint;
  contract_rewards: bigint;
  rewards: bigint;
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

/** GET /stakes/<32 byte address> */
export type StakeContributor = {
  address: string;
  amount: number;
  reserved: number;
};

export type Stake = {
  contract_id: number;
  contributors: Array<StakeContributor>;
  deregistration_unlock_height: number | null;
  earned_downtime_blocks: number;
  exited: boolean;
  last_reward_block_height: number | null;
  last_uptime_proof: number | null;
  liquidation_height: number | null;
  operator_address: string;
  operator_fee: number | null;
  requested_unlock_height: number | null;
  service_node_pubkey: string;
  staked_balance: number | null;
  state: NODE_STATE;
};

export interface GetStakesResponse {
  network: NetworkInfo;
  stakes: Array<Stake>;
  historical_stakes: Array<Stake>;
  wallet: WalletInfo;
  error_stakes: Array<{ contract_id: number; error: string }>;
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

/** GET /nodes */
export interface GetNodesResponse {
  network: NetworkInfo;
  nodes: Stake[];
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

/** GET /exit/<32 byte pubkey> */
export interface GetNodeExitSignaturesResponse {
  network: NetworkInfo;
  result: BlsExitResponse;
}

/** GET /liquidation/<32 byte pubkey> */
export interface GetNodeLiquidationResponse {
  network: NetworkInfo;
  result: BlsLiquidationResponse;
}

/** GET /exit_liquidation_list */
export interface GetExitLiquidationListResponse {
  network: NetworkInfo;
  result: Array<Stake>;
}

/** POST /rewards */

export interface GetRewardsClaimSignatureResponse {
  network: NetworkInfo;
  result: BlsRewardsResponse;
}

export type BlsRewardsResponse = {
  amount: number;
  height: number;
  msg_to_sign: string;
  non_signer_indices: Array<number>;
  signature: string;
};

export type BlsExitResponse = {
  bls_pubkey: string;
  msg_to_sign: string;
  non_signer_indices: Array<number>;
  signature: string;
  timestamp: number;
};

export type BlsLiquidationResponse = BlsExitResponse;

/** Client types */
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RequestOptions {
  endpoint: string;
  method: HTTPMethod;
  body?: BodyInit;
}

export interface StakingBackendResponse<T> {
  data: T | null;
  status: number;
  statusText: string;
}

export type Logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  debug: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  error: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  time: (data: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: resolve proper type
  timeEnd: (data: any) => void;
};

export interface SSBClientConfig {
  baseUrl: string;
  logger?: Logger;
  errorOn404?: boolean;
  debug?: boolean;
}

/**
 * Client for interacting with the Session Staking Backend API.
 */
export class SessionStakingClient {
  private readonly baseUrl: string;
  private readonly debug?: boolean;
  private readonly logger: Logger = console;
  private readonly errorOn404: boolean = false;

  constructor(config: SSBClientConfig) {
    const { baseUrl, debug, logger, errorOn404 } = config;
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

    if (errorOn404) {
      this.errorOn404 = errorOn404;
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

      let data: T | null = null;
      if (!res.ok) {
        const errorMessage = `Staking Backend request failed (${res.status}): ${res.statusText}`;
        if (this.errorOn404) {
          throw new Error(errorMessage);
        } else {
          this.logger.error(errorMessage);
          data = null;
        }
      } else {
        data = await res.json();
      }

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
   * Retrieves service nodes associated with the given wallet address.
   * @param address Wallet address.
   * @returns stakes, historical stakes, and wallet information.
   */
  public async getStakesForWalletAddress({
    address,
  }: {
    address: string;
  }): Promise<StakingBackendResponse<GetStakesResponse>> {
    const options: RequestOptions = {
      endpoint: `/stakes/${address}`,
      method: 'GET',
    };
    return this.request<GetStakesResponse>(options);
  }

  public async getRewardsClaimSignature({
    address,
  }: {
    address: string;
  }): Promise<StakingBackendResponse<GetRewardsClaimSignatureResponse>> {
    const options: RequestOptions = {
      endpoint: `/rewards/${address}`,
      method: 'POST',
    };
    return this.request<GetRewardsClaimSignatureResponse>(options);
  }

  public async getNodeExitSignatures({
    nodePubKey,
  }: {
    nodePubKey: string;
  }): Promise<StakingBackendResponse<GetNodeExitSignaturesResponse>> {
    const options: RequestOptions = {
      endpoint: `/exit/${nodePubKey}`,
      method: 'GET',
    };
    return this.request<GetNodeExitSignaturesResponse>(options);
  }

  public async getNodeLiquidation({
    nodePubKey,
  }: {
    nodePubKey: string;
  }): Promise<StakingBackendResponse<GetNodeLiquidationResponse>> {
    const options: RequestOptions = {
      endpoint: `/liquidation/${nodePubKey}`,
      method: 'GET',
    };
    return this.request<GetNodeLiquidationResponse>(options);
  }

  public async exitLiquidationList() {
    const options: RequestOptions = {
      endpoint: `/exit_liquidation_list`,
      method: 'GET',
    };
    return this.request<GetExitLiquidationListResponse>(options);
  }

  public async getNodes(): Promise<StakingBackendResponse<GetNodesResponse>> {
    const options: RequestOptions = {
      endpoint: `/nodes`,
      method: 'GET',
    };
    return this.request<GetNodesResponse>(options);
  }

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

/**
 * Creates a new instance of the SessionStakingClient.
 *
 * @param config The configuration object for the SSB client.
 * @returns A new instance of the SessionStakingClient.
 */
export const createSessionStakingClient = (config: SSBClientConfig): SessionStakingClient =>
  new SessionStakingClient(config);
