# How to add PDF sources
1. Add the PDF file to the `PDFs` folder.
2. set `OPENAI_API_KEY` environment variable to your OpenAI API key.
3. run `python3 metadata_creator.py` to create metadata for the PDFs.
   1. this will create a metadata file for the pdf and generate tags for the pdf using openai 
   2. if metadata file already exists, it will skip the pdf and move to the next one. You can force tag regeneration by running the script witht he `--force_generate_tags`flag (`python metadata_creator.py --force_generate_tags`)
   3. Fill out the manual fields in the metadata file such as `url`, `party_name`, etc