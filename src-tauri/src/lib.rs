// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

mod bridge;

use bridge::greet::greet;
use bridge::node_version::{get_nvm_versions, switch_node_version};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_nvm_versions, switch_node_version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
