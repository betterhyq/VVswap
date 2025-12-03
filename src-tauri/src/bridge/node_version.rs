/**
 * Node.js 版本管理模块
 * 提供获取和切换 Node.js 版本的功能
 */
use serde::{Deserialize, Serialize};
use std::fs;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NodeVersion {
    pub version: String,
    pub is_current: bool,
}

// 获取当前 Node.js 版本（默认全局版本）
fn get_current_node_version() -> Option<String> {
    let home_dir = dirs::home_dir()?;
    let default_alias = home_dir.join(".nvm").join("alias").join("default");
    
    if let Ok(content) = fs::read_to_string(&default_alias) {
        let trimmed = content.trim();
        if !trimmed.is_empty() && trimmed.starts_with('v') {
            return Some(trimmed.to_string());
        }
    }
    
    None
}

#[tauri::command]
pub fn get_nvm_versions() -> Result<Vec<NodeVersion>, String> {
    // 获取用户主目录
    let home_dir = dirs::home_dir()
        .ok_or("无法获取用户主目录")?;
    
    // nvm 版本目录路径
    let nvm_versions_dir = home_dir.join(".nvm").join("versions").join("node");
    
    // 检查目录是否存在
    if !nvm_versions_dir.exists() {
        return Ok(vec![]);
    }
    
    // 获取当前使用的版本
    let current_version = get_current_node_version();
    
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
                    // 检查是否是当前版本
                    let is_current = current_version.as_ref()
                        .map(|cv| cv.trim() == version_name.trim())
                        .unwrap_or(false);
                    
                    versions.push(NodeVersion {
                        version: version_name.to_string(),
                        is_current,
                    });
                }
            }
        }
    }
    
    Ok(versions)
}

#[tauri::command]
pub fn switch_node_version(version: String) -> Result<(), String> {
    // 验证版本号格式
    if !version.starts_with('v') {
        return Err("版本号格式错误，应以 'v' 开头".to_string());
    }
    
    // 获取用户主目录
    let home_dir = dirs::home_dir()
        .ok_or("无法获取用户主目录")?;
    
    // 检查版本是否存在
    let version_dir = home_dir.join(".nvm").join("versions").join("node").join(&version);
    if !version_dir.exists() {
        return Err(format!("版本 {} 不存在", version));
    }
    
    // 确保 alias 目录存在
    let alias_dir = home_dir.join(".nvm").join("alias");
    if !alias_dir.exists() {
        fs::create_dir_all(&alias_dir)
            .map_err(|e| format!("创建别名目录失败: {}", e))?;
    }
    
    // 直接写入 default 别名文件
    let default_alias = alias_dir.join("default");
    fs::write(&default_alias, &version)
        .map_err(|e| format!("写入默认别名失败: {}", e))?;
    
    Ok(())
}

