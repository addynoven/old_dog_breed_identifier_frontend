import os
import shutil

# Paths
SOURCE_DIR = "/home/neon/programs/python/Ai/deep_learning/mca_project/ML_model/Images"
DEST_DIR = "/home/neon/programs/python/Ai/deep_learning/mca_project/old_frontend/public/breeds"

def copy_breed_images():
    if not os.path.exists(SOURCE_DIR):
        print(f"Error: Source directory {SOURCE_DIR} does not exist.")
        return

    # Create destination directory if it doesn't exist
    if not os.path.exists(DEST_DIR):
        os.makedirs(DEST_DIR)
        print(f"Created destination directory: {DEST_DIR}")

    # Iterate through breed folders
    breed_folders = [f for f in os.listdir(SOURCE_DIR) if os.path.isdir(os.path.join(SOURCE_DIR, f))]
    
    print(f"Found {len(breed_folders)} breed folders.")

    for breed_folder in breed_folders:
        src_breed_path = os.path.join(SOURCE_DIR, breed_folder)
        dest_breed_path = os.path.join(DEST_DIR, breed_folder)

        # Create breed folder in destination
        if not os.path.exists(dest_breed_path):
            os.makedirs(dest_breed_path)

        # Get all images in the breed folder
        images = [f for f in os.listdir(src_breed_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
        images.sort() # Sort to ensure deterministic selection

        # Copy top 3 images
        for i, image_name in enumerate(images[:3]):
            src_image_path = os.path.join(src_breed_path, image_name)
            dest_image_name = f"{i+1}.jpg" # Rename to 1.jpg, 2.jpg, 3.jpg
            dest_image_path = os.path.join(dest_breed_path, dest_image_name)
            
            shutil.copy2(src_image_path, dest_image_path)
            # print(f"Copied {src_image_path} to {dest_image_path}")
        
        # print(f"Processed {breed_folder}")

    print("Successfully copied images for all breeds.")

if __name__ == "__main__":
    copy_breed_images()
