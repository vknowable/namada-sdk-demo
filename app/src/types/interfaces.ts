export interface iBlock {
	height: number;
	time: string;
  tx_array: Array<string>;
}

export interface iValidator {
  address: string;
  email?: string;
  website?: string;
  description?: string;
  discord?: string;
  stake?: number;
  state?: string;
}

export interface iInfo {
  chainId: string;
  epoch: string;
  height: string;
}