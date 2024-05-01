from apis import *

song_input, rvc_dirname, output_path, pitch_change = "billie_jean.ogg", "MJOTW", "./debug_output", 0
#generate_song(song_input, rvc_dirname, output_path, pitch_change)
res = preprocess(song_input, "preprocessed", "billie")

for r in res:
    print(r)