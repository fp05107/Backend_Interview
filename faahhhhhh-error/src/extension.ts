import * as vscode from 'vscode';
import * as path from 'path';
import { execFile } from 'child_process';

let isEnabled = true;
let lastPlayedTime = 0;
const DEBOUNCE_MS = 1500; // 1.5 second cooldown between sounds

// Track known error counts per URI to detect NEW errors
const previousErrorCounts = new Map<string, number>();

function playFaahSound(extensionPath: string) {
	const now = Date.now();
	if (now - lastPlayedTime < DEBOUNCE_MS) {
		return; // debounce — don't spam the sound
	}
	lastPlayedTime = now;

	// Try .mp3 first, then .wav
	const mp3Path = path.join(extensionPath, 'media', 'faah.mp3');
	const wavPath = path.join(extensionPath, 'media', 'faah.wav');

	const platform = process.platform;

	if (platform === 'win32') {
		// Windows: use PowerShell to play the sound
		// Try mp3 first via Windows Media Player COM, fallback to wav via SoundPlayer
		const psScript = `
			$mp3 = '${mp3Path.replace(/'/g, "''")}';
			$wav = '${wavPath.replace(/'/g, "''")}';
			if (Test-Path $mp3) {
				Add-Type -AssemblyName presentationCore;
				$player = New-Object System.Windows.Media.MediaPlayer;
				$player.Open([Uri]$mp3);
				$player.Play();
				Start-Sleep -Seconds 3;
			} elseif (Test-Path $wav) {
				$player = New-Object System.Media.SoundPlayer($wav);
				$player.PlaySync();
			}
		`;
		execFile('powershell', ['-NoProfile', '-Command', psScript], (err) => {
			if (err) {
				console.error('Faah sound playback error:', err.message);
			}
		});
	} else if (platform === 'darwin') {
		// macOS: use afplay
		const soundFile = require('fs').existsSync(mp3Path) ? mp3Path : wavPath;
		execFile('afplay', [soundFile], (err) => {
			if (err) {
				console.error('Faah sound playback error:', err.message);
			}
		});
	} else {
		// Linux: use aplay for wav, or mpg123/mpg321 for mp3
		const fs = require('fs');
		if (fs.existsSync(mp3Path)) {
			execFile('mpg123', ['-q', mp3Path], (err) => {
				if (err) {
					execFile('mpg321', ['-q', mp3Path], (err2) => {
						if (err2) {
							console.error('Faah sound playback error: install mpg123 or mpg321');
						}
					});
				}
			});
		} else {
			execFile('aplay', [wavPath], (err) => {
				if (err) {
					console.error('Faah sound playback error:', err.message);
				}
			});
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('🔊 Faahhhhhh Error extension is now active!');

	// Toggle command
	const toggleCmd = vscode.commands.registerCommand('faahhhhhh-error.toggle', () => {
		isEnabled = !isEnabled;
		vscode.window.showInformationMessage(
			`Faah sound ${isEnabled ? '🔊 enabled' : '🔇 disabled'}`
		);
	});

	// Listen for diagnostic (error) changes
	const diagnosticListener = vscode.languages.onDidChangeDiagnostics((e) => {
		if (!isEnabled) {
			return;
		}

		for (const uri of e.uris) {
			const diagnostics = vscode.languages.getDiagnostics(uri);
			const currentErrorCount = diagnostics.filter(
				(d) => d.severity === vscode.DiagnosticSeverity.Error
			).length;

			const previousCount = previousErrorCounts.get(uri.toString()) || 0;

			// Play sound only when NEW errors appear (count increased)
			if (currentErrorCount > previousCount) {
				playFaahSound(context.extensionPath);
			}

			// Update tracked count
			if (currentErrorCount === 0) {
				previousErrorCounts.delete(uri.toString());
			} else {
				previousErrorCounts.set(uri.toString(), currentErrorCount);
			}
		}
	});

	context.subscriptions.push(toggleCmd, diagnosticListener);
}

export function deactivate() {
	previousErrorCounts.clear();
}
