use namada::namada_sdk::rpc::{query_epoch, query_storage_value};
use namada::ledger::queries::{RPC};
use namada::types::{address::Address};
use namada::types::token;
// use namada::proof_of_stake::Epoch;
use namada::types::storage::{Epoch, Key};
use namada::proof_of_stake::types::{ValidatorMetaData, ValidatorState};
use wasm_bindgen::prelude::*;
// use gloo_utils::format::JsValueSerdeExt;
use borsh::{BorshDeserialize, BorshSerialize};
use serde::Deserialize;
use std::collections::{HashMap};
use std::str::FromStr;

use crate::rpc_client::HttpClient;
use crate::utils::{set_panic_hook, to_js_result};

#[wasm_bindgen]
/// Represents an API for querying the ledger
pub struct Query {
    client: HttpClient,
}

#[wasm_bindgen]
impl Query {
    #[wasm_bindgen(constructor)]
    pub fn new(url: String) -> Query {
        set_panic_hook();
        let client = HttpClient::new(url);
        Query { client }
    }

    /// Queries current epoch
    pub async fn query_epoch(&self) -> Result<JsValue, JsError> {
        let epoch = RPC.shell().epoch(&self.client).await?;
        to_js_result(epoch)
    }

    /// Gets all active validator addresses
    pub async fn query_all_validator_addresses(&self) -> Result<JsValue, JsError> {
        let validator_addresses = RPC
            .vp()
            .pos()
            .validator_addresses(&self.client, &None)
            .await?;

        to_js_result(validator_addresses)
    }

    /// Get the given validator's stake at the given epoch
    pub async fn query_validator_stake(&self, address: String) -> Result<JsValue, JsError> {
        let addr: Address = Address::from_str(&address)?;
        let epoch: Epoch = query_epoch(&self.client).await?;
        let validator_stake = RPC
            .vp()
            .pos()
            .validator_stake(&self.client, &addr, &Some(epoch))
            .await?;

        to_js_result(validator_stake)
    }

    /// Gets validator metadata
    pub async fn query_validator_metadata(&self, address: String) -> Result<JsValue, JsError> {
        let addr: Address = Address::from_str(&address)?;
        let metadata: Option<ValidatorMetaData> = RPC
            .vp()
            .pos()
            .validator_metadata(&self.client, &addr)
            .await?;

        let epoch: Epoch = query_epoch(&self.client).await?;
        let state: Option<ValidatorState> = RPC
            .vp()
            .pos()
            .validator_state(&self.client, &addr, &Some(epoch))
            .await?;

        let mut state_msg = String::new();
        match state {
            Some(state) => match state {
                ValidatorState::Consensus => {
                    state_msg = "Active (consensus set)".to_string();
                }
                ValidatorState::BelowCapacity => {
                    state_msg = "Active (below-capacity set)".to_string();
                }
                ValidatorState::BelowThreshold => {
                    state_msg = "Active (below-threshold set)".to_string();
                }
                ValidatorState::Inactive => {
                    state_msg = "Inactive".to_string();
                }
                ValidatorState::Jailed => {
                    state_msg = "Jailed".to_string();
                }
            },
            None => state_msg = "Validator state not found".to_string(),
        }

        let mut result: HashMap<String, String> = HashMap::new();

        if let Some(valid_metadata) = metadata {
            result.insert("email".to_string(), valid_metadata.email);
            result.insert("description".to_string(), valid_metadata.description.unwrap_or_default());
            result.insert("website".to_string(), valid_metadata.website.unwrap_or_default());
            result.insert("discord".to_string(), valid_metadata.discord_handle.unwrap_or_default());
        } else {
            // Handle the case where metadata is None
            result.insert("metadata".to_string(), "No metadata available".to_string());
        }

        result.insert("state".to_string(), state_msg);

        to_js_result(result)
    }
}