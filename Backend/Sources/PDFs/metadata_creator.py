import os
from slugify import slugify
import shutil
import json



for filename in os.listdir('.'):
    if filename.endswith('.pdf'):
        filename_meta = filename.split('.')[0]
        
        filename_new = slugify(filename_meta)+".pdf"

        shutil.move("./"+filename, "./"+filename_new)

for filename in os.listdir('.'):
    if filename.endswith('.pdf'):
        filename = filename.split('.')[0]
        filename_meta = slugify(filename)+".meta.json"

        if not os.path.exists("./"+filename_meta):
            # touch filename.meta.json
            os.system(f'touch {filename_meta}')

dic = {
    "url": ""
}

for filename in os.listdir('.'):
    if filename.endswith('.json'):
       with open(filename, 'w') as f:
           f.write(json.dumps(dic, indent=4))
        
       