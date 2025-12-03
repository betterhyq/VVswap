/**
 * Node.js 版本管理模块
 * 提供获取和切换 Node.js 版本的功能
 */
use std::fs;
use std::path::{PathBuf};
use std::process::Command;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NodeVersion {
    pub version: String,
    pub is_current: bool,
}

/// 验证版本号格式是否有效（以 'v' 开头）
fn is_valid_version_format(version: &str) -> bool {
    version.trim().starts_with('v') && !version.trim().is_empty()
}

/// 获取 nvm 根目录路径
fn get_nvm_root() -> Result<PathBuf, String> {
    dirs::home_dir()
        .ok_or("无法获取用户主目录".to_string())
        .map(|home| home.join(".nvm"))
}

/// 获取 nvm 版本目录路径
fn get_nvm_versions_dir() -> Result<PathBuf, String> {
    get_nvm_root().map(|root| root.join("versions").join("node"))
}

/// 获取 nvm alias 目录路径
fn get_nvm_alias_dir() -> Result<PathBuf, String> {
    get_nvm_root().map(|root| root.join("alias"))
}

/// 获取当前 Node.js 版本（通过执行 nvm current 命令）
fn get_current_node_version() -> Option<String> {
    let nvm_root = get_nvm_root().ok()?;
    let nvm_script = nvm_root.join("nvm.sh");
    
    // 如果 nvm.sh 不存在，返回 None
    if !nvm_script.exists() {
        return None;
    }
    
    // 构建 shell 命令：source nvm.sh 然后执行 nvm current
    let nvm_path = nvm_script.to_str()?;
    let shell_command = format!("source {} && nvm current", nvm_path);
    
    // 执行命令
    let output = Command::new("zsh")
        .arg("-c")
        .arg(&shell_command)
        .output()
        .ok()?;
    
    // 检查命令是否成功执行
    if !output.status.success() {
        return None;
    }
    
    // 解析输出
    let version = String::from_utf8(output.stdout).ok()?;
    let trimmed = version.trim();
    
    // 验证版本格式并返回
    if is_valid_version_format(trimmed) {
        Some(trimmed.to_string())
    } else {
        None
    }
}

/// 解析版本号用于排序（提取数字部分）
fn parse_version_for_sort(version: &str) -> Vec<u32> {
    version
        .trim_start_matches('v')
        .split('.')
        .filter_map(|s| s.parse::<u32>().ok())
        .collect()
}

/// 对版本列表进行排序（降序，最新版本在前）
fn sort_versions(versions: &mut [NodeVersion]) {
    versions.sort_by(|a, b| {
        let a_parts = parse_version_for_sort(&a.version);
        let b_parts = parse_version_for_sort(&b.version);
        b_parts.cmp(&a_parts) // 降序排序
    });
}

#[tauri::command]
pub fn get_nvm_versions() -> Result<Vec<NodeVersion>, String> {
    let nvm_versions_dir = get_nvm_versions_dir()?;
    
    // 如果版本目录不存在，返回空列表
    if !nvm_versions_dir.exists() {
        return Ok(vec![]);
    }
    
    // 获取当前使用的版本
    let current_version = get_current_node_version();
    
    // 读取并过滤版本目录
    let entries = fs::read_dir(&nvm_versions_dir)
        .map_err(|e| format!("读取 nvm 版本目录失败: {}", e))?;
    
    let mut versions: Vec<NodeVersion> = entries
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();
            
            // 只处理目录
            if !path.is_dir() {
                return None;
            }
            
            // 提取版本名称
            let version_name = path.file_name()?.to_str()?.to_string();
            
            // 验证版本格式
            if !is_valid_version_format(&version_name) {
                return None;
            }
            
            // 检查是否是当前版本
            let is_current = current_version
                .as_ref()
                .map(|cv| cv.trim() == version_name.trim())
                .unwrap_or(false);
            
            Some(NodeVersion {
                version: version_name,
                is_current,
            })
        })
        .collect();
    
    // 按版本号降序排序
    sort_versions(&mut versions);
    
    Ok(versions)
}

#[tauri::command]
pub fn switch_node_version(version: String) -> Result<(), String> {
    // 验证版本号格式
    if !is_valid_version_format(&version) {
        return Err("版本号格式错误，应以 'v' 开头且不为空".to_string());
    }
    
    let trimmed_version = version.trim();
    
    // 检查版本是否存在
    let version_dir = get_nvm_versions_dir()?.join(trimmed_version);
    if !version_dir.exists() {
        return Err(format!("版本 {} 不存在", trimmed_version));
    }
    
    // 确保 alias 目录存在
    let alias_dir = get_nvm_alias_dir()?;
    if !alias_dir.exists() {
        fs::create_dir_all(&alias_dir)
            .map_err(|e| format!("创建别名目录失败: {}", e))?;
    }
    
    // 写入 default 别名文件
    let default_alias = alias_dir.join("default");
    fs::write(&default_alias, trimmed_version)
        .map_err(|e| format!("写入默认别名失败: {}", e))?;
    
    Ok(())
}

