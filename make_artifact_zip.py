import shutil
import os
import zipfile

# Source is the scratch directory
source_dir = r"C:\Users\prana\.gemini\antigravity\scratch\threat-monitor"
# Destination is the artifacts directory
dest_dir = r"C:\Users\prana\.gemini\antigravity\brain\68cd7c41-6ba8-45e2-adc1-1c745cfb792c"
zip_filename = "threat_monitor_deployable.zip"
zip_path = os.path.join(dest_dir, zip_filename)

print(f"Zipping {source_dir} to {zip_path}...")

with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(source_dir):
        # Exclude huge/unnecessary dirs
        dirs[:] = [d for d in dirs if d not in ["venv", "node_modules", ".git", "__pycache__", "dist", ".gemini", ".idea"]]
        
        for file in files:
            if file in ["threat_monitor.db", ".DS_Store", "threat_monitor_source.zip", "make_artifact_zip.py"]:
                continue
            
            # Explicitly ensure PROJECT_GUIDE.md is included (it is in root so it should be by default)

            
            abs_file = os.path.join(root, file)
            # Calculate path relative to the source root so they appear at root of zip
            rel_path = os.path.relpath(abs_file, source_dir)
            zipf.write(abs_file, rel_path)

print(f"Created {zip_path}")
