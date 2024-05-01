# importing packages 
from pytube import YouTube 
import os 
  
def yttomp3(yt_url):
    # url input from user 
    yt = YouTube(yt_url) 
  
    # extract only audio 
    video = yt.streams.filter(only_audio=True).first() 
    
    # check for destination to save file 
    destination = 'musics/'
    
    # download the file 
    out_file = video.download(output_path=destination) 
    
    # save the file 
    base, ext = os.path.splitext(out_file) 
    new_file = base + '.mp3'
    os.rename(out_file, new_file) 