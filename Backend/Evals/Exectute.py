from Calc import *
from AI_Answer_Generator import *
import os

# folder_path = "Backend/Evals/Party_Answers_Json"
# for filename in os.listdir(folder_path):
#     if filename.endswith(".json"):
#         CreateCSV(os.path.join(folder_path, filename))

filepath = "./Backend/Evals/Party_Answers_Json/Party_Answers_Converted_de.json"
execute_calc(filepath,"OAI")

from AI_Answer_Generator import Groq

client = Groq()
client.set_api_key(api_keyGroq)  # Assuming there's a method to set the API key



