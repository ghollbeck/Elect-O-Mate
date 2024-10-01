import os

def concatenate_files_in_directory(directory_path, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, _, files in os.walk(directory_path):
            for filename in files:
                file_path = os.path.join(root, filename)
                if os.path.isfile(file_path):
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                        content = infile.read()
                        if content.strip():  # Check if the file has text in it
                            outfile.write(content)

directory_path = "Frontend/Perplexica/ui"
output_file = "Frontend/Perplexica/concatenated_output.txt"
concatenate_files_in_directory(directory_path, output_file)
