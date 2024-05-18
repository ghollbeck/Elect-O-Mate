
import json

file_path = '/Users/gaborhollbeck/Desktop/GitHub/1_Elect-O-Mate/Backend/-1_0_1_Answers.json' 


def read_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

def main():
    # Read JSON file
    data = read_json_file(file_path)
    

    # Your further processing...
    print(data)

if __name__ == "__main__":
    main()

    