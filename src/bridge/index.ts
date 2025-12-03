/**
 * Rust 桥接层
 * 统一封装所有与 Rust 后端的交互逻辑
 */
import { invoke } from "@tauri-apps/api/core";
import type { NodeVersion } from "./types";

/**
 * 测试命令 - 问候
 * @param name 名称
 * @returns 问候语
 */
export async function greet(name: string): Promise<string> {
  return await invoke<string>("greet", { name });
}

/**
 * 获取所有已安装的 Node.js 版本
 * @returns Node.js 版本列表
 */
export async function getNvmVersions(): Promise<NodeVersion[]> {
  try {
    return await invoke<NodeVersion[]>("get_nvm_versions");
  } catch (error) {
    console.error("获取 nvm 版本失败:", error);
    throw error;
  }
}

/**
 * 切换 Node.js 版本
 * @param version 要切换的版本号（例如: "v18.17.0"）
 * @throws 如果切换失败会抛出错误
 */
export async function switchNodeVersion(version: string): Promise<void> {
  try {
    await invoke("switch_node_version", { version });
  } catch (error) {
    console.error("切换版本失败:", error);
    throw error;
  }
}

