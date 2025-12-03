/**
 * 问候功能桥接
 * 对应 Rust 端的 bridge::greet 模块
 */
import { invoke } from "@tauri-apps/api/core";

/**
 * 测试命令 - 问候
 * @param name 名称
 * @returns 问候语
 */
export async function greet(name: string): Promise<string> {
  return await invoke<string>("greet", { name });
}

