use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Serialize, Deserialize)]
struct ScanResult {
    check: String,
    status: String,
    severity: String,
    message: String,
}

#[derive(Serialize)]
struct FileResponse {
    file_name: String,
    file_size: u64,
    hashes: Hashes,
    is_malicious: bool,
    scan_results: Vec<ScanResult>,
    threat_level: String,
}

#[derive(Serialize)]
struct Hashes {
    md5: String,
    sha1: String,
    sha256: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
