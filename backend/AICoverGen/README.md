#### Setting up the environment

download require packages:

```console
cd backend/AICoverGen
pip install -r requirements.txt
```

download the Hubert checkpoints (this only need to be run once):

```console
python src/download_models.py
```

download the pretrain RVC checkpoints, unzip, put them into backend/AICoverGen/rvc_models, and rename them with index number:
0: https://huggingface.co/PlayerBPlaytime/My-Models/resolve/main/MJInvincibleEra.zip
1: https://huggingface.co/coreliastreet/arianagrande2024/resolve/main/eternal.zip?download=true


#### Song conversion APIs

There are two APIs in AICoverGen/apis.py



##### generate_song

```python
def generate_song(song_input: str, rvc_dirname: str, output_path: str, pitch_change: int) -> str:
"""
Create covers with any RVC v2 trained AI voice.

Args:
song_input (str): The path to the song. eg: path/to/your/song.wav
rvc_dirname (str): The name of the RVCmodel. The model is placed under AICoverGen/rvc_models/
output_path (str): The path to the output directory for generated song. eg: path/to/output/song/
pitch_change (int): 0 for male-to-male or female-to-female, 1 for male-to-female, -1 for female-to-male

Returns:
cover_path (str): The path to the generated cover. eg: path/to/cover/
"""
return cover_path
```

##### preprocess

```python
def preprocess(song_input, output_dir, song_id) -> str, str, str, str, str, str:
"""
Preprocess the input song. Seperating main vocal, backup vocal and instrumental parts of the song. This processing is done on cpu.

Args:
song_input (str): The path to the song. eg: path/to/your/song.wav
output_dir (str): The path to the output directory for generated song. eg: path/to/output/song/
song_id (str): Name of the output song

Returns:
orig_song_path (str): The path to the original song.
vocals_path (str): The path to the vocal part of the song.
instrumentals_path (str): The path to the instrumental part of the song.
main_vocals_path (str): The path to the main vocal part of the song.
backup_vocals_path (str): The path to the backup vocal part of the song.
main_vocals_dereverb_path (str): The path to the vocal part of the song, after dereverbing 去除残响.

"""
return orig_song_path, vocals_path, instrumentals_path, main_vocals_path, backup_vocals_path, main_vocals_dereverb_path
```