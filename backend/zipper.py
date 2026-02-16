import shutil
import os
from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()

@router.get("/download-source")
def download_source():
    # Path to the project root (assuming we are in backend/utils or similar, adjust upwards)
    # Actually we are running from backend/main.py, so ".." is project root
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root_dir = os.path.dirname(base_dir) # scratch/threat-monitor
    
    zip_filename = "threat_monitor_source.zip"
    zip_path = os.path.join(base_dir, zip_filename)
    
    # Create zip if not exists or just recreate
    # EXCLUDE venv, node_modules, .git, __pycache__
    
    def ignore_patterns(path, names):
        ignore_list = []
        if "venv" in names: ignore_list.append("venv")
        if "node_modules" in names: ignore_list.append("node_modules")
        if ".git" in names: ignore_list.append(".git")
        if "__pycache__" in names: ignore_list.append("__pycache__")
        if "threat_monitor.db" in names: ignore_list.append("threat_monitor.db") # Don't share the DB usually
        if "dist" in names: ignore_list.append("dist")
        return ignore_list

    # We want to zip 'backend' and 'frontend' from the root
    # shutil.make_archive works on a directory.
    # We want to archive 'threat-monitor' folder content.
    
    # Simplification: Just walk and zip manually to avoid directory nesting hell or huge copies
    import zipfile
    
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(root_dir):
            # Filtering directories in-place to skip traversal
            dirs[:] = [d for d in dirs if d not in ["venv", "node_modules", ".git", "__pycache__", "dist", ".gemini", ".idea"]]
            
            for file in files:
                if file in ["threat_monitor.db", "threat_monitor_source.zip", ".DS_Store"]:
                    continue
                
                abs_file = os.path.join(root, file)
                rel_path = os.path.relpath(abs_file, root_dir)
                zipf.write(abs_file, rel_path)
                
    return FileResponse(zip_path, filename=zip_filename, media_type='application/zip')
