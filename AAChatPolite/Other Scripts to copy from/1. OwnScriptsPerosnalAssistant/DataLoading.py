
import os
from VoiceTranscription import transcribe

import shutil
from datetime import datetime
import subprocess

from pydub import AudioSegment


audio_dir = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings'
output_dir = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/Transcriptions/mdFiles'
output_dir_chunks = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/Transcriptions/mdFiles/Chunks'

file_path = "/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings/Recording 2.m4a"

#paths for the moving of the file to transcribed
recordings_folder_path = audio_dir
destination_transcribed_path = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings/Transcribed'
destination_file_path = os.path.join(destination_transcribed_path, os.path.basename(recordings_folder_path))



#maybe I should have ratehr exported it with worse quait and then chicked the text that was transcribed

def split_audio(audio_path, filename2:str):  # Default chunk size is 600 seconds
    chunk_size = 400000
    audio = AudioSegment.from_file(audio_path)

    length_audio = len(audio)
    print(length_audio)
    chunks = list()

    # Calculate the number of chunks
    num_chunks = length_audio // chunk_size
    if length_audio % chunk_size:
        num_chunks += 1
    print(f"Number of chunks: {num_chunks}")

    for i in range(0, length_audio, chunk_size):
        chunk = audio[i:i+chunk_size]
        chunks.append(chunk)

    # Specify the name of the new folder
    folder_name = f"Chunk_{filename2}"
    # Full path to the new folder
    audio_path = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings/Chunks'
    # join paths, create folder
    folder_path = os.path.join(audio_path, folder_name)
    os.makedirs(folder_path, exist_ok=True)  # Create the folder if it doesn't exist




    # Get the creation time and convert it to a formatted string
    stat_info = os.stat(audio_path)
    creation_time = stat_info.st_birthtime
    formatted_date = datetime.fromtimestamp(creation_time).strftime("%Y-%m-%d")




    # Save chunks as separate files
    for i in range(0, length_audio, chunk_size):
        chunk = audio[i:i+chunk_size]
        j = i // chunk_size
        name =os.path.join(folder_path, f"chunk{j+1}_{num_chunks}.mp3")
        
        chunk.export(name, format="mp3", bitrate="64k")  # Save the chunk in the new folder

        # Set the creation date of the copied file to match the original file
        creation_date_str = datetime.fromtimestamp(creation_time).strftime("%m/%d/%Y %H:%M:%S")
        subprocess.run(["SetFile", "-d", creation_date_str, name])

    return folder_path





def LoopTranscription (run:str, audio_dir, output_dir, output_dir_chunks):

    for filename in os.listdir(audio_dir):
        if filename.endswith((".m4a", ".mp3", ".wav")):

            filename2 = os.path.splitext(filename)[0]
            
            audio_file_path = os.path.join(audio_dir, filename)


            file_size_MB = os.path.getsize(audio_file_path) / (1024 * 1024)
            if file_size_MB > 20:
                print(f"File {filename} is larger than 20 MB..")
                audio_chunk_dir = split_audio(audio_file_path,filename2)

                for i,filename in enumerate (os.listdir(audio_chunk_dir)):
                    
                    audio_file_path2= audio_file_path
                    audio_file_path = os.path.join(audio_chunk_dir, filename)
                    output_dir = os.path.join(output_dir_chunks, filename2)

                            


                    
                    # Create a markdown filename based on the audio filename
                    markdown_filename = f"Chunk_{os.path.splitext(filename)[0]}.md"
                    
                    # Full path to the markdown file
                    markdown_file_path = os.path.join(output_dir, markdown_filename)
                    #os.makedirs(markdown_file_path, exist_ok=True)  # Create the folder if it doesn't exist


#Transcription

                    # Transcribe the audio file
                    transcription = transcribe(audio_file_path, run = run)
                    
                    
                    # Write the transcription to the markdown file
                    with open(markdown_file_path, 'w') as f:
                        f.write(transcription)

                    # Get the creation time and convert it to a formatted string
                    stat_info = os.stat(audio_file_path2)
                    creation_time = stat_info.st_birthtime
                    formatted_date = datetime.fromtimestamp(creation_time).strftime("%Y-%m-%d")

                    # Set the creation date of the copied file to match the original file
                    creation_date_str = datetime.fromtimestamp(creation_time).strftime("%m/%d/%Y %H:%M:%S")
                    subprocess.run(["SetFile", "-d", creation_date_str, markdown_file_path])




                    print(f" {i}_{len(os.listdir(audio_chunk_dir))} Chunk Transcription saved with name: {markdown_filename}")




                    #moving transcribed file into transcribed folder

                    # move the file
                    destination_transcribed_path = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings/Transcribed/Chunks'
                    destination_transcribed_path2 = os.path.join(destination_transcribed_path, filename2)
                    os.makedirs(destination_transcribed_path2, exist_ok=True)  # Create the folder if it doesn't exist

                    destination_file_path = os.path.join(destination_transcribed_path2, os.path.basename(audio_file_path2))
                    shutil.move(audio_file_path2, destination_file_path)
                    print("moved")



            else:

                audio_dir = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings'
                output_dir = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/Transcriptions/mdFiles'
    
                
                # Create a markdown filename based on the audio filename
                markdown_filename = os.path.splitext(filename)[0] + ".md"
                
                # Full path to the markdown file
                markdown_file_path = os.path.join(output_dir, markdown_filename)

                
                # Transcribe the audio file
                transcription = transcribe(audio_file_path, run = run)
                
                
                # Write the transcription to the markdown file
                with open(markdown_file_path, 'w') as f:
                    f.write(transcription)

                # Get the creation time and convert it to a formatted string
                stat_info = os.stat(audio_file_path)
                creation_time = stat_info.st_birthtime
                formatted_date = datetime.fromtimestamp(creation_time).strftime("%Y-%m-%d")

                # Set the creation date of the copied file to match the original file
                creation_date_str = datetime.fromtimestamp(creation_time).strftime("%m/%d/%Y %H:%M:%S")
                subprocess.run(["SetFile", "-d", creation_date_str, markdown_file_path])
            
                print(f"Transcription saved with name: {markdown_filename}")

                # move the file
                destination_transcribed_path = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings/Transcribed'
                destination_file_path = os.path.join(destination_transcribed_path, os.path.basename(audio_file_path))
                shutil.move(audio_file_path, destination_file_path)
                print("moved")
                

        else:
            print("No audio file found in the directory")


audio_dir = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/VoiceRecordings'
output_dir = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/Transcriptions/mdFiles'
output_dir_chunks = '/Users/gaborhollbeck/Library/Mobile Documents/com~apple~CloudDocs/Dokumente Sync./2024/Priya - Partnerlator/Chat with PDF SPH/Final Folder/Data/Transcriptions/mdFiles/Chunks'


LoopTranscription("server",audio_dir,output_dir,output_dir_chunks)

