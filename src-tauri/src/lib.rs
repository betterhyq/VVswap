// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::process::Command;

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
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
    
    // 调试：打印获取到的当前版本
    eprintln!("当前版本: {:?}", current_version);
    
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
                    // 改进版本匹配逻辑：去除空白字符并比较
                    let is_current = current_version.as_ref()
                        .map(|cv| {
                            let cv_trimmed = cv.trim();
                            let vn_trimmed = version_name.trim();
                            // 直接比较
                            cv_trimmed == vn_trimmed ||
                            // 或者比较版本号部分（去除可能的额外字符）
                            normalize_version(cv_trimmed) == normalize_version(vn_trimmed)
                        })
                        .unwrap_or(false);
                    
                    if is_current {
                        eprintln!("匹配到当前版本: {}", version_name);
                    }
                    
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
    // 方法1: 检查 ~/.nvm/current 符号链接
    let nvm_current = home_dir.join(".nvm").join("current");
    if nvm_current.exists() {
        if let Ok(target) = fs::read_link(&nvm_current) {
            if let Some(version_name) = target.file_name().and_then(|n| n.to_str()) {
                if version_name.starts_with('v') {
                    return Some(version_name.to_string());
                }
            }
        }
    }
    
    // 方法2: 检查 nvm 的 default 别名
    let default_alias = home_dir.join(".nvm").join("alias").join("default");
    if let Ok(content) = fs::read_to_string(&default_alias) {
        let trimmed = content.trim();
        if !trimmed.is_empty() && trimmed.starts_with('v') {
            return Some(trimmed.to_string());
        }
    }
    
    // 方法3: 通过执行 node --version 命令获取实际运行的版本
    if let Ok(output) = Command::new("node")
        .arg("--version")
        .output()
    {
        if output.status.success() {
            if let Ok(version_str) = String::from_utf8(output.stdout) {
                let trimmed = version_str.trim();
                eprintln!("node --version 输出: '{}'", trimmed);
                if trimmed.starts_with('v') {
                    return Some(trimmed.to_string());
                }
            }
        } else {
            eprintln!("node --version 执行失败: {:?}", output.status);
        }
    } else {
        eprintln!("无法执行 node --version 命令");
    }
    
    // 方法4: 检查 PATH 中的 node 是否指向 nvm 管理的版本
    if let Ok(output) = Command::new("which")
        .arg("node")
        .output()
    {
        if output.status.success() {
            if let Ok(node_path) = String::from_utf8(output.stdout) {
                let node_path = node_path.trim();
                // 检查路径是否包含 .nvm/versions/node
                if node_path.contains(".nvm/versions/node/") {
                    // 从路径中提取版本号
                    // 例如: /Users/xxx/.nvm/versions/node/v18.17.0/bin/node
                    if let Some(parts) = node_path.split(".nvm/versions/node/").nth(1) {
                        if let Some(version) = parts.split('/').next() {
                            if version.starts_with('v') {
                                return Some(version.to_string());
                            }
                        }
                    }
                }
            }
        }
    }
    
    None
}

// 标准化版本号字符串，去除可能的额外字符
fn normalize_version(version: &str) -> String {
    version
        .trim()
        .chars()
        .take_while(|c| c.is_alphanumeric() || *c == '.' || *c == 'v')
        .collect()
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

#[tauri::command]
fn switch_node_version(version: String) -> Result<(), String> {
    // 获取用户主目录
    let home_dir = dirs::home_dir()
        .ok_or("无法获取用户主目录")?;
    
    // 验证版本号格式
    if !version.starts_with('v') {
        return Err("版本号格式错误，应以 'v' 开头".to_string());
    }
    
    // 检查版本是否存在
    let version_dir = home_dir.join(".nvm").join("versions").join("node").join(&version);
    if !version_dir.exists() {
        return Err(format!("版本 {} 不存在", version));
    }
    
    // 方法1: 直接写入 default 别名文件（更可靠）
    let alias_dir = home_dir.join(".nvm").join("alias");
    if !alias_dir.exists() {
        fs::create_dir_all(&alias_dir)
            .map_err(|e| format!("创建别名目录失败: {}", e))?;
    }
    
    let default_alias = alias_dir.join("default");
    fs::write(&default_alias, &version)
        .map_err(|e| format!("写入默认别名失败: {}", e))?;
    
    // 方法2: 尝试通过 shell 执行 nvm 命令（确保环境变量也更新）
    // 获取 shell 路径
    let shell = std::env::var("SHELL").unwrap_or_else(|_| "/bin/bash".to_string());
    let nvm_script = home_dir.join(".nvm").join("nvm.sh");
    
    if nvm_script.exists() {
        // 构建命令：source nvm.sh && nvm alias default <version>
        let command = format!(
            "source {} && nvm alias default {}",
            nvm_script.to_string_lossy(),
            version
        );
        
        // 执行命令（即使失败也不影响，因为我们已经直接写入了文件）
        let _ = Command::new(&shell)
            .arg("-c")
            .arg(&command)
            .output();
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_nvm_versions, switch_node_version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
