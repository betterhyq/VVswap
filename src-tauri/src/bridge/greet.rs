/**
 * 问候功能模块
 * 用于测试 Rust 与前端通信
 */

#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

