import os
from slugify import slugify
import shutil
import json
from datetime import datetime


def generate_tags_from_pdf(filename):
    pass

def initialize_metadata():

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
  
    # get current date in dd.mm.yyyy format
    date = datetime.now().strftime('%d.%m.%Y')

    sample_dict = {
        "party_name": "",
        "party_full_name": "",
        "tags": [],
        "date": date,
        "country": "",
        "language": "",
    }

    for filename in os.listdir('.'):
        if filename.endswith('.json'):
            with open(filename, 'r') as f:    
                dic = json.load(f)
            with open(filename, 'w') as f:
                if not "url" in dic:
                    pass
                sample_dict = {**dic, **sample_dict}
                f.write(json.dumps(sample_dict, indent=4))
                    

                
initialize_metadata()