// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize)]
pub struct NodeVersion {
    pub version: String,
    pub is_current: bool,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_nvm_versions() -> Result<Vec<NodeVersion>, String> {
    // 获取用户主目录
    let home_dir = dirs::home_dir()
        .ok_or("无法获取用户主目录")?;
    
    // nvm 版本目录路径
    let nvm_versions_dir = home_dir.join(".nvm").join("versions").join("node");
    
    // 检查目录是否存在
    if !nvm_versions_dir.exists() {
        return Ok(vec![]);
    }
    
    // 获取当前使用的版本（通过检查 default 别名或环境变量）
    let current_version = get_current_node_version(&home_dir);
    
    // 读取版本目录
    let entries = fs::read_dir(&nvm_versions_dir)
        .map_err(|e| format!("读取 nvm 版本目录失败: {}", e))?;
    
    let mut versions = Vec::new();
    
    for entry in entries {
        let entry = entry.map_err(|e| format!("读取目录项失败: {}", e))?;
        let path = entry.path();
        
        if path.is_dir() {
            if let Some(version_name) = path.file_name().and_then(|n| n.to_str()) {
                // 检查是否是版本号格式（v开头）
                if version_name.starts_with('v') {
                    let is_current = current_version.as_ref()
                        .map(|cv| cv == version_name)
                        .unwrap_or(false);
                    
                    versions.push(NodeVersion {
                        version: version_name.to_string(),
                        is_current,
                    });
                }
            }
        }
    }
    
    // 按版本号排序（降序，最新版本在前）
    versions.sort_by(|a, b| {
        // 移除 'v' 前缀并比较版本号
        let a_version = &a.version[1..];
        let b_version = &b.version[1..];
        version_compare::compare(b_version, a_version)
            .unwrap_or(std::cmp::Ordering::Equal)
    });
    
    Ok(versions)
}

fn get_current_node_version(home_dir: &PathBuf) -> Option<String> {
    // 方法1: 检查 nvm 的 default 别名
    let default_alias = home_dir.join(".nvm").join("alias").join("default");
    if let Ok(content) = fs::read_to_string(&default_alias) {
        let trimmed = content.trim();
        if !trimmed.is_empty() && trimmed.starts_with('v') {
            return Some(trimmed.to_string());
        }
    }
    
    // 方法2: 尝试执行 nvm current 命令（如果可用）
    // 注意：在 Tauri 中直接执行 shell 命令需要额外配置
    // 这里先使用文件系统方法
    
    None
}

// 简单的版本号比较函数
mod version_compare {
    use std::cmp::Ordering;
    
    pub fn compare(v1: &str, v2: &str) -> Option<Ordering> {
        let v1_parts: Vec<u32> = v1.split('.')
            .map(|s| s.parse().unwrap_or(0))
            .collect();
        let v2_parts: Vec<u32> = v2.split('.')
            .map(|s| s.parse().unwrap_or(0))
            .collect();
        
        let max_len = v1_parts.len().max(v2_parts.len());
        
        for i in 0..max_len {
            let v1_val = v1_parts.get(i).copied().unwrap_or(0);
            let v2_val = v2_parts.get(i).copied().unwrap_or(0);
            
            match v1_val.cmp(&v2_val) {
                Ordering::Equal => continue,
                other => return Some(other),
            }
        }
        
        Some(Ordering::Equal)
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_nvm_versions])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
