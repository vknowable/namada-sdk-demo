/* tslint:disable */
/* eslint-disable */
/**
* Represents an API for querying the ledger
*/
export class Query {
  free(): void;
/**
* @param {string} url
*/
  constructor(url: string);
/**
* Queries current epoch
* @returns {Promise<any>}
*/
  query_epoch(): Promise<any>;
/**
* Gets all active validator addresses
* @returns {Promise<any>}
*/
  query_all_validator_addresses(): Promise<any>;
/**
* Get the given validator's stake at the given epoch
* @param {string} address
* @returns {Promise<any>}
*/
  query_validator_stake(address: string): Promise<any>;
/**
* Gets validator metadata
* @param {string} address
* @returns {Promise<any>}
*/
  query_validator_metadata(address: string): Promise<any>;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_query_free: (a: number) => void;
  readonly query_new: (a: number, b: number) => number;
  readonly query_query_epoch: (a: number) => number;
  readonly query_query_all_validator_addresses: (a: number) => number;
  readonly query_query_validator_stake: (a: number, b: number, c: number) => number;
  readonly query_query_validator_metadata: (a: number, b: number, c: number) => number;
  readonly ring_core_0_17_5_bn_mul_mont: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h18623cacae4c0e15: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly wasm_bindgen__convert__closures__invoke2_mut__h76b8f801155b2315: (a: number, b: number, c: number, d: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
